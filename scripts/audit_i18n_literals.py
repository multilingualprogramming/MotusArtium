#!/usr/bin/env python3
"""Report likely user-facing string literals that remain in app.js.

This is a temporary migration helper. It intentionally uses lightweight
heuristics so it can run without Node dependencies.
"""

from __future__ import annotations

import argparse
import pathlib
import re


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]

STRING_RE = re.compile(r"""(?P<quote>["'])(?P<value>(?:\\.|(?!\1).)*?)(?P=quote)""")
SKIP_VALUE_RE = re.compile(
    r"""^([#.][A-Za-z0-9_-]+|[A-Za-z0-9_-]+|[A-Z]{2}|Q\d+|https?://|[{}[\](),.:;\s|&=+*/<>!~?-]+)$"""
)
USER_TEXT_RE = re.compile(r"[A-Za-z][A-Za-z ]{2,}")


def is_likely_user_text(value: str) -> bool:
    if not value or len(value) < 4:
        return False
    if SKIP_VALUE_RE.match(value):
        return False
    if value.startswith(("http://", "https://", "data-", "aria-")):
        return False
    return bool(USER_TEXT_RE.search(value))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("path", nargs="?", default="app.js")
    parser.add_argument("--limit", type=int, default=200)
    args = parser.parse_args()

    path = (PROJECT_ROOT / args.path).resolve()
    count = 0
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        stripped = line.strip()
        if stripped.startswith("//"):
            continue
        for match in STRING_RE.finditer(line):
            value = match.group("value")
            if is_likely_user_text(value):
                print(f"{line_number}: {value}")
                count += 1
                if count >= args.limit:
                    return


if __name__ == "__main__":
    main()
