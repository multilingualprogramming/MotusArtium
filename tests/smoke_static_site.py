#!/usr/bin/env python3
"""Smoke-test the static MotusArtium site artifact."""

from __future__ import annotations

import argparse
import contextlib
import functools
import http.server
import pathlib
import socket
import socketserver
import threading
import urllib.request


REQUIRED_FILES = [
    "index.html",
    "styles.css",
    "app.js",
    "theme.js",
    "bootstrap.js",
    "bundle.js",
    "graphql/artists_by_movement.graphql",
    "graphql/artworks_by_artist.graphql",
    "graphql/artworks_by_museum.graphql",
    "graphql/museum_details.graphql",
    "graphql/movements_catalog.graphql",
]

DEEP_LINKS = [
    "/",
    "/?entity=Q42934&type=movement",
    "/?entity=Q5593&type=artist",
    "/?entity=Q19675&type=museum",
    "/?entity=Q878985&type=movement&mode=temporal-river",
]

PAGINATED_QUERIES = [
    "graphql/artists_by_movement.graphql",
    "graphql/artworks_by_artist.graphql",
    "graphql/artworks_by_museum.graphql",
    "graphql/movements_catalog.graphql",
]

# Async functions compiled from principal.multi into bundle.js by the
# Multilingual UI-lowering pass.  Only async functions are emitted; sync
# helper functions (rendre_panneau_detail, rendre_barre_recherche) are not
# emitted by the compiler and remain in the JS layer.
#
# Adding a name here means: it must live in bundle.js, not only in app.js.
# This list grows as logic migrates from app.js into Multilingual source.
BUNDLE_EXPORTS = [
    # Core entity loaders
    "charger_mouvement",
    "charger_artiste",
    "charger_oeuvre",
    "basculer_visualisation",
    # Search and navigation bridge
    "lancer_recherche",
    "ouvrir_barre_recherche",
    "fermer_barre_recherche",
    # Detail panel bridge
    "ouvrir_panneau_detail",
    "fermer_panneau_detail",
    # Cursor-based pagination (Phase 1 addition)
    "charger_mouvement_artistes_page_suivante",
    "charger_artiste_oeuvres_page_suivante",
    "charger_musee_oeuvres_page_suivante",
    # Search dispatch (Phase 4 addition)
    "resoudre_type_entite",
    "charger_selection",
]

# Every entity-loader in bundle.js must delegate to ui.etat, not re-implement.
# Checking for these strings ensures the bundle stays a thin bridge.
BUNDLE_DELEGATION_MARKERS = [
    "ui.etat.charger_mouvement",
    "ui.etat.charger_artiste",
    "ui.etat.charger_oeuvre",
    "ui.etat.basculer_visualisation",
]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        return


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def find_open_port() -> int:
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def read_url(url: str) -> tuple[int, str]:
    request = urllib.request.Request(url, headers={"User-Agent": "MotusArtium smoke test"})
    with urllib.request.urlopen(request, timeout=10) as response:
        return int(response.status), response.read().decode("utf-8", errors="replace")


def assert_contains(text: str, needle: str, context: str) -> None:
    if needle not in text:
        raise AssertionError(f"{context} does not contain {needle!r}")


def validate_files(site_root: pathlib.Path) -> None:
    for relative_path in REQUIRED_FILES:
        path = site_root / relative_path
        if not path.is_file():
            raise AssertionError(f"Missing required file: {relative_path}")

    index_html = (site_root / "index.html").read_text(encoding="utf-8")
    for asset in ["bundle.js", "app.js", "bootstrap.js"]:
        assert_contains(index_html, asset, "index.html")
    if not index_html.index("bundle.js") < index_html.index("app.js") < index_html.index("bootstrap.js"):
        raise AssertionError("index.html must load bundle.js before the JS shell fallback")

    app_js = (site_root / "app.js").read_text(encoding="utf-8")
    assert_contains(app_js, "window.ui.etat = window.ui.etat || {}", "app.js")

    principal_path = site_root / "src/principal.multi"
    if principal_path.exists():
        principal_multi = principal_path.read_text(encoding="utf-8")
        assert_contains(principal_multi, "importer ui.etat", "src/principal.multi")

    for query_path in PAGINATED_QUERIES:
        query = (site_root / query_path).read_text(encoding="utf-8")
        for expected in ["$first", "$after", "pageInfo", "endCursor", "hasNextPage"]:
            assert_contains(query, expected, query_path)

    validate_bundle_exports(site_root)
    validate_graph_display_contract(site_root)


def validate_bundle_exports(site_root: pathlib.Path) -> None:
    """Check that bundle.js contains all expected Multilingual-owned exports."""
    bundle_js = (site_root / "bundle.js").read_text(encoding="utf-8")
    for name in BUNDLE_EXPORTS:
        assert_contains(bundle_js, name, "bundle.js")
    for marker in BUNDLE_DELEGATION_MARKERS:
        assert_contains(bundle_js, marker, "bundle.js delegation")
    assert_contains(bundle_js, "Object.assign(window.ui.etat", "bundle.js")
    if "unsupported" in bundle_js:
        raise AssertionError("bundle.js contains unsupported lowering output")
    if "null /*" in bundle_js:
        raise AssertionError("bundle.js contains placeholder lowering output")
    validate_bundle_graph_runtime(bundle_js)


def validate_bundle_graph_runtime(bundle_js: str) -> None:
    """Check the generated graph-loading path used by the main display."""
    expected_markers = [
        "async function obtenir_graphe_mouvement(mouvement_id, limite = 50)",
        "async function obtenir_artistes_mouvement(mouvement_id, limite = 50)",
        "var POINT_TERMINAL_WIKIDATA_GRAPHQL =",
        "var LANGUE_PAR_DEFAUT = 'fr'",
        "var CACHE_DOCUMENTS_GRAPHQL = {}",
        "setIndex(index, value)",
        "_engine.get('cache_entites').setIndex(entite_id, donnees)",
        "_engine.get('cache_relations').setIndex(mouvement_id, contrat)",
        "await donnees.requetes.obtenir_graphe_mouvement(mouvement_id)",
        "_ajouter_noeud(mouvement_id, 'mouvement'",
        "_ajouter_noeud(artiste_id, 'artiste'",
        "_ajouter_relation(mouvement_id, artiste_id, 'contient_artiste')",
        "if ((__ml_truthy((_engine.get('mouvement_etendu_id').get() == mouvement_id)) &&",
        "function __ml_truthy(value)",
        "if (__ml_truthy(erreurs))",
        "return (Object.keys(this.noeuds)).length",
    ]
    for marker in expected_markers:
        assert_contains(bundle_js, marker, "bundle.js graph runtime")

    if "if (((_engine.get('mouvement_etendu_id').get() == mouvement_id) ||" in bundle_js:
        raise AssertionError("bundle.js lowers the movement loaded guard with ||")
    if "async function obtenir_artistes_mouvement(mouvement_id, limite)" in bundle_js:
        raise AssertionError("bundle.js dropped the artist query default limit")

    leaked_top_level_locals = [
        "\nvar uri = _uri_entite(entite_id);",
        "\nlieu_naissance = _extraire_item(",
        "\ncreateur = _extraire_item(",
        "\nmusee = _extraire_item(",
        "\nsujet = _extraire_item(",
        "\ndonnees = ((entite)?.['donnees'] ?? {});",
        "\nhtml = '<div",
    ]
    for marker in leaked_top_level_locals:
        if marker in bundle_js:
            raise AssertionError(
                "bundle.js leaked helper-function body statements to module scope"
            )


def validate_graph_display_contract(site_root: pathlib.Path) -> None:
    """Check that loaded graph state can reach the constellation display."""
    index_html = (site_root / "index.html").read_text(encoding="utf-8")
    app_js = (site_root / "app.js").read_text(encoding="utf-8")
    bootstrap_js = (site_root / "bootstrap.js").read_text(encoding="utf-8")
    bundle_js = (site_root / "bundle.js").read_text(encoding="utf-8")

    html_markers = [
        'id="constellation-links"',
        'id="constellation-nodes"',
        'class="constellation-links"',
        'class="constellation-nodes"',
    ]
    for marker in html_markers:
        assert_contains(index_html, marker, "index.html graph display")

    bundle_markers = [
        "function obtenir_instantane_etat()",
        "['graphe']: _engine.get('graphe').get().exporter_json()",
        "exporter_json()",
        "return {['noeuds']: noeuds_json, ['relations']: relations_json",
        "var noeuds_json = []",
        "var relations_json = []",
        "__ml_add(noeuds_json",
        "__ml_add(relations_json",
    ]
    for marker in bundle_markers:
        assert_contains(bundle_js, marker, "bundle.js graph snapshot")

    app_markers = [
        'document.getElementById("constellation-nodes")',
        'document.getElementById("constellation-links")',
        "function readRuntimeSnapshot()",
        "window.ui.etat.obtenir_instantane_etat()",
        "function getRenderableNodes()",
        "const allNodes = (((snapshot.graphe || {}).noeuds) || []).slice()",
        "function renderConstellation()",
        "const nodes = getRenderableNodes()",
        "const visibleNodeIds = new Set(nodes.map((node) => node.id))",
        "constellationLinksEl.appendChild(link)",
        "constellationNodesEl.appendChild(nodeEl)",
    ]
    for marker in app_markers:
        assert_contains(app_js, marker, "app.js graph display")

    bootstrap_markers = [
        "await initialiser_application()",
        "syncShellFromSnapshot(readRuntimeSnapshot())",
        "renderConstellation()",
        "renderRuntimeState()",
    ]
    for marker in bootstrap_markers:
        assert_contains(bootstrap_js, marker, "bootstrap.js graph display")


def validate_http(site_root: pathlib.Path) -> None:
    port = find_open_port()
    handler = functools.partial(QuietHandler, directory=str(site_root))
    server = ReusableTCPServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        for path in DEEP_LINKS:
            status, body = read_url(f"http://127.0.0.1:{port}{path}")
            if status != 200:
                raise AssertionError(f"{path} returned HTTP {status}")
            assert_contains(body, "MotusArtium", path)
            assert_contains(body, "app.js", path)

        for query_path in PAGINATED_QUERIES:
            status, body = read_url(f"http://127.0.0.1:{port}/{query_path}")
            if status != 200:
                raise AssertionError(f"/{query_path} returned HTTP {status}")
            assert_contains(body, "pageInfo", query_path)
    finally:
        server.shutdown()
        server.server_close()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("site_root", nargs="?", default=".", help="Static site root to smoke-test")
    args = parser.parse_args()

    site_root = pathlib.Path(args.site_root).resolve()
    validate_files(site_root)
    validate_http(site_root)
    print(f"Smoke tests passed for {site_root}")


if __name__ == "__main__":
    main()
