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
    for asset in ["app.js", "bootstrap.js", "bundle.js"]:
        assert_contains(index_html, asset, "index.html")

    app_js = (site_root / "app.js").read_text(encoding="utf-8")
    for expected in [
        "activeCollectionKind",
        "charger_mouvement_artistes_page_suivante",
        "charger_artiste_oeuvres_page_suivante",
        "charger_musee_oeuvres_page_suivante",
    ]:
        assert_contains(app_js, expected, "app.js")

    for query_path in PAGINATED_QUERIES:
        query = (site_root / query_path).read_text(encoding="utf-8")
        for expected in ["$first", "$after", "pageInfo", "endCursor", "hasNextPage"]:
            assert_contains(query, expected, query_path)


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
