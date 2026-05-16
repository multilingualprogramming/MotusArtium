#!/usr/bin/env python3
"""Smoke-test the static MotusArtium site artifact."""

from __future__ import annotations

import argparse
import contextlib
import functools
import http.server
import json
import pathlib
import socket
import socketserver
import threading
import urllib.request


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    "index.html",
    "styles.css",
    "app.js",
    "theme.js",
    "bootstrap.js",
    "bundle.js",
    "src/ui/i18n.multi",
    "src/i18n/locales/fr.json",
    "src/i18n/locales/en.json",
    "src/i18n/locales/es.json",
    "graphql/artists_by_movement.graphql",
    "graphql/artworks_by_artist.graphql",
    "graphql/artworks_by_museum.graphql",
    "graphql/museum_details.graphql",
    "graphql/movements_catalog.graphql",
    "graphql/artists_by_nationality.graphql",
    "graphql/artworks_by_material.graphql",
    "graphql/movements_by_country.graphql",
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
    # Récit + Comparison panel (Priority 1 & 3)
    "charger_donnees_comparaison",
    # Three-tier interface additions
    "charger_musee",
    "charger_sujet",
    "rendre_grille_themes",
    # I18n bridge
    "charger_textes_interface",
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
    validate_i18n_contract(site_root)
    validate_graph_display_contract(site_root)
    validate_recit_comparaison_contract(site_root)
    validate_three_tier_contract(site_root)


def validate_bundle_exports(site_root: pathlib.Path) -> None:
    """Check that bundle.js contains all expected Multilingual-owned exports."""
    bundle_js = (site_root / "bundle.js").read_text(encoding="utf-8")
    for name in BUNDLE_EXPORTS:
        assert_contains(bundle_js, name, "bundle.js")
    for marker in BUNDLE_DELEGATION_MARKERS:
        assert_contains(bundle_js, marker, "bundle.js delegation")
    assert_contains(bundle_js, "Object.assign(window.ui.etat", "bundle.js")
    assert_contains(bundle_js, "Object.assign(window.ui.i18n", "bundle.js i18n")
    if "unsupported" in bundle_js:
        raise AssertionError("bundle.js contains unsupported lowering output")
    if "null /*" in bundle_js:
        raise AssertionError("bundle.js contains placeholder lowering output")
    for runtime_alias in [
        "function __ml_type",
        "const type = __ml_type;",
        'const chaine = "str";',
        'const liste = "list";',
        'const dictionnaire = "dict";',
    ]:
        assert_contains(bundle_js, runtime_alias, "bundle.js runtime aliases")
    validate_bundle_graph_runtime(bundle_js)


def validate_bundle_graph_runtime(bundle_js: str) -> None:
    """Check the generated graph-loading path used by the main display."""
    quote_normalized_bundle_js = bundle_js.replace('"', "'")
    expected_markers = [
        "async function obtenir_graphe_mouvement(mouvement_id, limite = 50, langue = LANGUE_PAR_DEFAUT)",
        "donnees.requetes.obtenir_graphe_mouvement(mouvement_id, 50, _engine.get('mode_langue_actif').get())",
        "await charger_mouvement(_engine.get('entite_selectionnee_id').get(), true)",
        "async function obtenir_artistes_mouvement(mouvement_id, limite = 50, langue = LANGUE_PAR_DEFAUT)",
        "var POINT_TERMINAL_WIKIDATA_GRAPHQL =",
        "var CACHE_DOCUMENTS_GRAPHQL = {}",
        "setIndex(index, value)",
        "_engine.get('cache_entites').setIndex(entite_id, donnees)",
        "_engine.get('cache_relations').setIndex(mouvement_id, contrat)",
        "await donnees.requetes.obtenir_graphe_mouvement(mouvement_id, 50, _engine.get('mode_langue_actif').get())",
        "_ajouter_noeud(mouvement_id, 'mouvement'",
        "_ajouter_noeud(artiste_id, 'artiste'",
        "_ajouter_relation(mouvement_id, artiste_id, 'contient_artiste')",
        "if (((!__ml_truthy(forcer_rechargement)) && __ml_truthy((_engine.get('mouvement_etendu_id').get() == mouvement_id)) &&",
        "function __ml_truthy(value)",
        "if (__ml_truthy(erreurs))",
        "return (Object.keys(this.noeuds)).length",
    ]
    for marker in expected_markers:
        assert_contains(quote_normalized_bundle_js, marker, "bundle.js graph runtime")

    if "var LANGUE_PAR_DEFAUT = 'fr'" not in quote_normalized_bundle_js:
        raise AssertionError("bundle.js graph runtime does not contain LANGUE_PAR_DEFAUT = fr")

    if "if (((_engine.get('mouvement_etendu_id').get() == mouvement_id) ||" in bundle_js:
        raise AssertionError("bundle.js lowers the movement loaded guard with ||")
    if "async function obtenir_artistes_mouvement(mouvement_id, limite)" in bundle_js:
        raise AssertionError("bundle.js dropped the artist query default limit")
    if ".upper()" in bundle_js:
        raise AssertionError("bundle.js contains a Python-style string upper() call")

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


def validate_i18n_contract(site_root: pathlib.Path) -> None:
    """Check that new interface-copy keys stay locale-driven."""
    app_js = (site_root / "app.js").read_text(encoding="utf-8")
    assert_contains(app_js, "function traduireInterface", "app.js i18n")
    assert_contains(app_js, "window.ui.i18n", "app.js i18n")
    assert_contains(app_js, "charger_textes_interface", "app.js i18n")
    assert_contains(app_js, "window.motusI18nReady", "app.js i18n")
    assert_contains(app_js, 'const supportedLanguages = ["fr", "en", "es"]', "app.js i18n")
    assert_contains(app_js, "function detectPreferredLanguage", "app.js i18n")
    assert_contains(app_js, "navigator.languages", "app.js i18n")
    assert_contains(app_js, "const initialLanguage = detectPreferredLanguage()", "app.js i18n")
    assert_contains(app_js, "window.motusInitialLanguage = initialLanguage", "app.js i18n")
    assert_contains(app_js, "await applyLanguage(window.motusInitialLanguage", "app.js i18n")
    assert_contains(app_js, "async function applyLanguage", "app.js i18n")
    assert_contains(app_js, "window.ui.etat.basculer_langue(language)", "app.js i18n")
    assert_contains(app_js, "renderStoryTier", "app.js i18n")
    if "fetch(\"src/i18n/locales/\" + langue + \".json\")" in app_js:
        raise AssertionError("app.js must not load locale JSON directly; ui.i18n owns loading")
    if "\"session.clear\": \"Clear Session\"" in app_js:
        raise AssertionError("app.js must load locale JSON instead of embedding translation tables")
    if "runtimeState.currentLanguage = runtimeState.currentVariables.languageCode" in app_js:
        raise AssertionError("GraphQL request language must not silently change the interface language")

    i18n_multi = (site_root / "src/ui/i18n.multi").read_text(encoding="utf-8")
    assert_contains(i18n_multi, "déf obtenir_texte", "src/ui/i18n.multi")
    assert_contains(i18n_multi, "asynchrone déf charger_textes_interface", "src/ui/i18n.multi")
    assert_contains(i18n_multi, "attendre fetch(chemin)", "src/ui/i18n.multi")
    assert_contains(i18n_multi, "LANGUE_INTERFACE_PAR_DEFAUT = \"fr\"", "src/ui/i18n.multi")
    assert_contains(i18n_multi, "CHEMIN_LOCALES_INTERFACE = \"src/i18n/locales/\"", "src/ui/i18n.multi")
    if "\"session.clear\": \"Clear Session\"" in i18n_multi:
        raise AssertionError("src/ui/i18n.multi must not duplicate locale dictionaries")

    locale_dir = site_root / "src/i18n/locales"
    locales = {}
    for code in ["fr", "en", "es"]:
        path = locale_dir / f"{code}.json"
        with path.open(encoding="utf-8") as handle:
            locales[code] = json.load(handle)

    reference_keys = set(locales["fr"].keys())
    required_keys = {
        "session.clear",
        "mode.observatory",
        "compass.movement",
        "preset.cross-language.title",
        "collection.loadMoreArtists",
        "search.placeholder.entity",
        "tier.story",
        "story.heading",
        "explorer.heading",
        "search.mode.entity",
        "polyglot.surface.es.label",
    }
    for key in required_keys:
        if key not in reference_keys:
            raise AssertionError(f"fr locale missing required key: {key}")

    for code, table in locales.items():
        keys = set(table.keys())
        if keys != reference_keys:
            missing = sorted(reference_keys - keys)
            extra = sorted(keys - reference_keys)
            raise AssertionError(
                f"{code} locale keys differ; missing={missing}, extra={extra}"
            )

    index_html = (site_root / "index.html").read_text(encoding="utf-8")
    assert_contains(index_html, 'data-language="es"', "index.html language controls")
    assert_contains(index_html, 'data-language="en" aria-pressed="true"', "index.html default language")

    bundle_js = (site_root / "bundle.js").read_text(encoding="utf-8")
    assert_contains(bundle_js, '_engine.declare(\'mode_langue_actif\', "en")', "bundle.js default language")
    assert_contains(bundle_js, '["fr", "en", "es"]', "bundle.js language support")


def validate_graph_display_contract(site_root: pathlib.Path) -> None:
    """Check that loaded graph state can reach the constellation display."""
    index_html = (site_root / "index.html").read_text(encoding="utf-8")
    app_js = (site_root / "app.js").read_text(encoding="utf-8")
    bootstrap_js = (site_root / "bootstrap.js").read_text(encoding="utf-8")
    bundle_js = (site_root / "bundle.js").read_text(encoding="utf-8")
    quote_normalized_bundle_js = bundle_js.replace('"', "'")

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
        assert_contains(quote_normalized_bundle_js, marker, "bundle.js graph snapshot")

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


def validate_recit_comparaison_contract(site_root: pathlib.Path) -> None:
    """Check that Récit mode (Priority 1) and Comparison panel (Priority 3) are wired up."""
    index_html = (site_root / "index.html").read_text(encoding="utf-8")
    app_js = (site_root / "app.js").read_text(encoding="utf-8")
    bootstrap_js = (site_root / "bootstrap.js").read_text(encoding="utf-8")
    bundle_js = (site_root / "bundle.js").read_text(encoding="utf-8")

    # index.html: recit visualization container + comparison containers
    html_markers = [
        'id="recit-visualization"',
        'id="comparison-panel-container"',
        'id="__ml_recit_root"',
        'id="__ml_comparison_root"',
        'id="selected-entity-image"',
    ]
    for marker in html_markers:
        assert_contains(index_html, marker, "index.html récit/comparaison")

    # bundle.js: Récit module exported at window.ui.composants.recit
    bundle_recit_markers = [
        "window.ui.composants.recit",
        "rendre_recit",
        "window.ui.composants.panneau_comparaison",
        "rendre_panneau_comparaison",
        "window.semantique.intersections",
        "calculer_intersection_artistes",
        "calculer_artistes_uniques",
        "obtenir_etiquette_artiste",
        "basculer_comparaison",
        "charger_donnees_comparaison",
        "effacer_comparaison",
        "donnees_comparaison",
        "entites_comparaison",
    ]
    for marker in bundle_recit_markers:
        assert_contains(bundle_js, marker, "bundle.js récit/comparaison")

    detail_multi = site_root / "src/ui/composants/panneau_detail.multi"
    if detail_multi.exists():
        src = detail_multi.read_text(encoding="utf-8")
        assert_contains(src, 'donnees.obtenir("image"', "panneau_detail.multi image")
        assert_contains(src, '<img src="', "panneau_detail.multi image")
        assert_contains(src, 'donnees.obtenir("birthDate"', "panneau_detail.multi artist fields")
        assert_contains(src, 'donnees.obtenir("birthplaceLabel"', "panneau_detail.multi artist fields")
        assert_contains(src, 'donnees.obtenir("inceptionDate"', "panneau_detail.multi artwork fields")
        assert_contains(src, 'donnees.obtenir("creatorLabel"', "panneau_detail.multi artwork fields")

    requetes_multi = site_root / "src/donnees/requetes.multi"
    if requetes_multi.exists():
        src = requetes_multi.read_text(encoding="utf-8")
        assert_contains(src, '"image": _champ_valeur(_extraire_texte(item.obtenir("image", [])))', "requetes.multi artist image")

    # app.js: Récit mode visibility handling uses the correct deep module path
    app_markers = [
        "isRecitMode",
        "recit-visualization",
        "window.ui?.composants?.recit?.rendre_recit",
        "rendre_recit",
        "function buildCommonsThumbnail",
        "function fetchSelectedEntityImageFilename",
        "wbgetclaims",
        "extractWikidataP18Filename",
        "selectedEntityImageEl",
    ]
    for marker in app_markers:
        assert_contains(app_js, marker, "app.js récit mode")

    # bootstrap.js: comparison panel wired up + compare button + correct etat path
    bootstrap_markers = [
        "renderComparisonPanel",
        "data-action='comparer'",
        "window.ui.etat.basculer_comparaison",
        "compare-btn",
        "window.renderComparisonPanel",
        "comparison-panel-container",
        "__ml_comparison_root",
    ]
    for marker in bootstrap_markers:
        assert_contains(bootstrap_js, marker, "bootstrap.js comparaison")

    # .multi sources: check core function signatures exist
    recit_multi = (site_root / "src/ui/composants/recit.multi")
    if recit_multi.exists():
        src = recit_multi.read_text(encoding="utf-8")
        assert_contains(src, "déf rendre_recit()", "recit.multi")
        assert_contains(src, "_rendre_recit_mouvement", "recit.multi")
        assert_contains(src, "_rendre_recit_artiste", "recit.multi")
        assert_contains(src, "_rendre_recit_oeuvre", "recit.multi")
        assert_contains(src, "data-explorer-open-observatory", "recit.multi Voir la Constellation")

    etat_multi = (site_root / "src/ui/etat.multi")
    if etat_multi.exists():
        src = etat_multi.read_text(encoding="utf-8")
        assert_contains(src, "relation.type_noeud == type_relation", "etat.multi relation lookup")

    intersections_multi = (site_root / "src/semantique/intersections.multi")
    if intersections_multi.exists():
        src = intersections_multi.read_text(encoding="utf-8")
        assert_contains(src, "déf calculer_intersection_artistes", "intersections.multi")
        assert_contains(src, "déf calculer_artistes_uniques", "intersections.multi")

    comparaison_multi = (site_root / "src/ui/composants/panneau_comparaison.multi")
    if comparaison_multi.exists():
        src = comparaison_multi.read_text(encoding="utf-8")
        assert_contains(src, "déf rendre_panneau_comparaison()", "panneau_comparaison.multi")
        assert_contains(src, "effacer_comparaison", "panneau_comparaison.multi")


def validate_three_tier_contract(site_root: pathlib.Path) -> None:
    """Check that the three-tier Story/Explorer/Observatory system is wired up."""
    index_html = (site_root / "index.html").read_text(encoding="utf-8")
    app_js = (site_root / "app.js").read_text(encoding="utf-8")
    bootstrap_js = (site_root / "bootstrap.js").read_text(encoding="utf-8")
    bundle_js = (site_root / "bundle.js").read_text(encoding="utf-8")

    # index.html: tier nav, panels, guide, journey steps, search modes
    html_markers = [
        'data-tier="story"',
        'id="tier-nav"',
        'id="story-panel"',
        'id="explorer-panel"',
        'id="observatory-subtabs"',
        'id="observatory-guide"',
        'class="journey-step"',
        'class="search-mode-btn"',
        'id="__ml_themes_root"',
        'id="__ml_story_recit_root"',
        'id="__ml_explorer_themes_root"',
    ]
    for marker in html_markers:
        assert_contains(index_html, marker, "index.html three-tier")

    # app.js: tier switching logic
    app_markers = [
        "setActiveTier",
        "renderStoryTier",
        'data-tier',
        "observatory-guide-seen",
        "observatory-guide-dismiss",
        "pole-name",
    ]
    for marker in app_markers:
        assert_contains(app_js, marker, "app.js three-tier")

    # bootstrap.js: loadSearchSelection bridge
    assert_contains(bootstrap_js, "window.loadSearchSelection", "bootstrap.js three-tier")

    # app.js: theme tile and search mode (moved from bootstrap.js to avoid bloat)
    # renderThemeStoryCard removed — story card HTML is now generated in recit.multi
    app_tier_markers = [
        "charger-sujet",
        "currentSearchMode",
        "search-mode-btn",
        "renderStoryTier",
    ]
    for marker in app_tier_markers:
        assert_contains(app_js, marker, "app.js three-tier delegation")

    # bundle.js: grille_themes component exported
    bundle_markers = [
        "window.ui.composants.grille_themes",
        "rendre_grille_themes",
        "charger_musee",
        "charger_sujet",
    ]
    for marker in bundle_markers:
        assert_contains(bundle_js, marker, "bundle.js three-tier")

    # grille_themes.multi source
    grille_multi = site_root / "src/ui/composants/grille_themes.multi"
    if grille_multi.exists():
        src = grille_multi.read_text(encoding="utf-8")
        assert_contains(src, "déf rendre_grille_themes()", "grille_themes.multi")
        assert_contains(src, "data-action", "grille_themes.multi")
        assert_contains(src, "theme-tile", "grille_themes.multi")


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
