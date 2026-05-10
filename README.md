# MotusArtium

An interactive semantic atlas for exploring art movements, artists, works, and cultural influences across time and geography.

This repository follows the same minimal deployment shape as `../Memyrinth`:

- `src/principal.multi` contains the Multilingual source
- `index.html` is the static browser shell
- `bundle.js` is the generated browser bundle served by GitHub Pages

## Local Build

Requirements:

- Python 3.12+
- A local checkout of `../multilingual`

Build steps:

```bash
cd ../multilingual
pip install -e ".[wasm]"

cd ../MotusArtium
python -m multilingualprogramming build-ui-bundle src/principal.multi --lang fr --out-dir _build
cp _build/bundle.js bundle.js
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Repository Layout

- `src/principal.multi`: main Multilingual entrypoint
- `index.html`: static browser shell
- `bundle.js`: generated JavaScript bundle
- `.github/workflows/deploy.yml`: GitHub Pages build and deployment

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [WIKIDATA_QUERIES.md](WIKIDATA_QUERIES.md)
