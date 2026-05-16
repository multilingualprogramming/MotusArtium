#!/usr/bin/env python3
"""Build the static site with the same shape as the GitHub Pages workflow."""

from __future__ import annotations

import argparse
import os
import pathlib
import re
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
    "js/bus.js",
    "js/actions.js",
]

I18N_FILES = [
    "src/ui/i18n.multi",
    "src/i18n/locales/fr.json",
    "src/i18n/locales/en.json",
    "src/i18n/locales/es.json",
]

RUNTIME_TYPE_ALIASES = {
    "type": "__ml_type",
    "chaine": '"str"',
    "liste": '"list"',
    "dictionnaire": '"dict"',
}

RUNTIME_TYPE_HELPER = """
function __ml_type(v) {
  if (v === null || v === undefined) return "none";
  if (typeof v === "string") return "str";
  if (Array.isArray(v)) return "list";
  if (typeof v === "number") return "number";
  if (typeof v === "boolean") return "bool";
  return "dict";
}
"""


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
        ensure_bundle_runtime_aliases(build_dir / "bundle.js")


def ensure_bundle_runtime_aliases(bundle_path: pathlib.Path) -> None:
    """Keep generated bundles compatible across compiler runtime variants."""
    bundle_js = bundle_path.read_text(encoding="utf-8")
    helper_missing = not re.search(r"\bfunction\s+__ml_type\s*\(", bundle_js)

    missing_aliases = []
    for name, value in RUNTIME_TYPE_ALIASES.items():
        pattern = rf"\b(?:const|let|var)\s+{re.escape(name)}\s*="
        if not re.search(pattern, bundle_js):
            missing_aliases.append(f"const {name} = {value};")

    if not helper_missing and not missing_aliases:
        return

    insertion_parts = []
    if helper_missing:
        insertion_parts.append(RUNTIME_TYPE_HELPER.strip())
    insertion_parts.extend(missing_aliases)
    insertion = "\n" + "\n".join(insertion_parts) + "\n"
    marker = "\nconst _engine = new ReactiveEngine();"
    if marker in bundle_js:
        bundle_js = bundle_js.replace(marker, insertion + marker, 1)
    else:
        match = re.search(r"function __ml_type\(v\) \{.*?\n\}", bundle_js, re.S)
        if not match:
            raise RuntimeError("Unable to locate __ml_type body in generated bundle.js")
        bundle_js = bundle_js[: match.end()] + insertion + bundle_js[match.end() :]

    bundle_path.write_text(bundle_js, encoding="utf-8")


def stage_site(build_dir: pathlib.Path, site_dir: pathlib.Path) -> None:
    if site_dir.exists():
        shutil.rmtree(site_dir)
    site_dir.mkdir(parents=True)

    for relative in STATIC_FILES:
        destination = site_dir / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / relative, destination)

    for relative in I18N_FILES:
        destination = site_dir / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / relative, destination)

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
