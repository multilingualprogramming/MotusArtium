#!/usr/bin/env python3
"""Build the static site with the same shape as the GitHub Pages workflow."""

from __future__ import annotations

import argparse
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile


ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_MULTILINGUAL = pathlib.Path("/home/johnsamuel/multilingual")
STATIC_FILES = [
    "index.html",
    "styles.css",
    "app.js",
    "theme.js",
    "bootstrap.js",
]


def ensure_roman_stub(stub_dir: pathlib.Path) -> None:
    """Provide the tiny roman API needed by the local checkout when pip is absent."""
    (stub_dir / "roman.py").write_text(
        "def toRoman(value):\n"
        "    return str(value)\n\n"
        "def fromRoman(value):\n"
        "    return 0\n",
        encoding="utf-8",
    )


def run_build(multilingual_root: pathlib.Path, build_dir: pathlib.Path) -> None:
    with tempfile.TemporaryDirectory(prefix="motus_pydeps_") as tmp:
        stub_dir = pathlib.Path(tmp)
        ensure_roman_stub(stub_dir)

        env = os.environ.copy()
        env["PYTHONPATH"] = os.pathsep.join(
            [
                str(stub_dir),
                str(multilingual_root),
                env.get("PYTHONPATH", ""),
            ]
        )

        subprocess.run(
            [
                sys.executable,
                "-m",
                "multilingualprogramming",
                "build-ui-bundle",
                "src/principal.multi",
                "--lang",
                "fr",
                "--out-dir",
                str(build_dir),
            ],
            cwd=ROOT,
            env=env,
            check=True,
        )


def stage_site(build_dir: pathlib.Path, site_dir: pathlib.Path) -> None:
    if site_dir.exists():
        shutil.rmtree(site_dir)
    site_dir.mkdir(parents=True)

    for relative in STATIC_FILES:
        shutil.copy2(ROOT / relative, site_dir / relative)

    shutil.copy2(build_dir / "bundle.js", site_dir / "bundle.js")
    shutil.copytree(ROOT / "graphql", site_dir / "graphql")


def report(site_dir: pathlib.Path) -> None:
    app_js = (site_dir / "app.js").read_text(encoding="utf-8")
    bundle_js = (site_dir / "bundle.js").read_text(encoding="utf-8")
    bundle_has_state = "window.ui.etat" in bundle_js or "ui.etat = {" in bundle_js

    print(f"[INFO] staged site: {site_dir}")
    print(f"[INFO] app.js lines: {len(app_js.splitlines())}")
    print(f"[INFO] bundle.js lines: {len(bundle_js.splitlines())}")
    print(f"[INFO] bundle provides ui.etat: {'yes' if bundle_has_state else 'no'}")
    if not bundle_has_state:
        print("[INFO] app.js compatibility fallback is still required")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out-dir", default="_site", help="Static site output directory")
    parser.add_argument("--build-dir", default="_build", help="Generated bundle directory")
    parser.add_argument(
        "--multilingual-root",
        default=str(DEFAULT_MULTILINGUAL),
        help="Path to a local multilingual checkout",
    )
    args = parser.parse_args()

    multilingual_root = pathlib.Path(args.multilingual_root).resolve()
    if not multilingual_root.is_dir():
        raise SystemExit(f"Missing multilingual checkout: {multilingual_root}")

    build_dir = (ROOT / args.build_dir).resolve()
    site_dir = (ROOT / args.out_dir).resolve()

    run_build(multilingual_root, build_dir)
    stage_site(build_dir, site_dir)
    report(site_dir)


if __name__ == "__main__":
    main()
