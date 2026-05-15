#!/usr/bin/env python3
"""Report likely user-facing string literals in hand-authored source files.

This is a temporary migration helper. It intentionally uses lightweight
heuristics so it can run without Node dependencies.
"""

from __future__ import annotations

import argparse
import pathlib
import re
from collections.abc import Iterable


PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]

STRING_RE = re.compile(r"""(?P<quote>["'])(?P<value>(?:\\.|(?!\1).)*?)(?P=quote)""")
SKIP_VALUE_RE = re.compile(
    r"""^([#.][A-Za-z0-9_-]+|[A-Za-z0-9_-]+|[A-Z]{2}|Q\d+|https?://|[{}[\](),.:;\s|&=+*/<>!~?-]+)$"""
)
USER_TEXT_RE = re.compile(r"[A-Za-z][A-Za-z ]{2,}")
DEFAULT_PATHS = ["app.js", "bootstrap.js", "theme.js", "src"]
SOURCE_SUFFIXES = {".js", ".multi"}
SKIPPED_NAMES = {"bundle.js"}
SKIPPED_DIRS = {".git", "_build", "_site", "bundle", "node_modules", "__pycache__"}


def is_likely_user_text(value: str) -> bool:
    if not value or len(value) < 4:
        return False
    if SKIP_VALUE_RE.match(value):
        return False
    if value.startswith(("http://", "https://", "data-", "aria-")):
        return False
    return bool(USER_TEXT_RE.search(value))


def iter_source_files(paths: Iterable[str]) -> list[pathlib.Path]:
    files: list[pathlib.Path] = []
    seen: set[pathlib.Path] = set()
    for raw_path in paths:
        path = (PROJECT_ROOT / raw_path).resolve()
        candidates: Iterable[pathlib.Path]
        if path.is_dir():
            candidates = path.rglob("*")
        else:
            candidates = [path]

        for candidate in candidates:
            if not candidate.is_file():
                continue
            if candidate.name in SKIPPED_NAMES:
                continue
            if any(part in SKIPPED_DIRS for part in candidate.relative_to(PROJECT_ROOT).parts):
                continue
            if candidate.suffix not in SOURCE_SUFFIXES:
                continue
            if candidate not in seen:
                files.append(candidate)
                seen.add(candidate)
    return sorted(files)


def audit_file(path: pathlib.Path, remaining: int | None) -> int:
    count = 0
    relative = path.relative_to(PROJECT_ROOT)
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        stripped = line.strip()
        if stripped.startswith(("//", "#")):
            continue
        for match in STRING_RE.finditer(line):
            value = match.group("value")
            if is_likely_user_text(value):
                print(f"{relative}:{line_number}: {value}")
                count += 1
                if remaining is not None and count >= remaining:
                    return count
    return count


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("paths", nargs="*", default=DEFAULT_PATHS)
    parser.add_argument("--limit", type=int, default=200)
    args = parser.parse_args()

    count = 0
    for path in iter_source_files(args.paths):
        remaining = None if args.limit <= 0 else args.limit - count
        if remaining is not None and remaining <= 0:
            return
        count += audit_file(path, remaining)


if __name__ == "__main__":
    main()
