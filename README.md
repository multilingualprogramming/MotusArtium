# MotusArtium

MotusArtium is a GraphQL-first art history observatory built on top of Wikidata and the Multilingual programming language.

It combines a browser shell, a Multilingual runtime, and dedicated Wikidata query documents to let users explore:

- art movements
- artists
- artworks
- museums and galleries
- depicted subjects

## Current Features

- Graph-first exploration with a central constellation view.
- Search-based entry through Wikidata REST search, followed by GraphQL-driven expansion.
- Dedicated entity loading for movements, artists, artworks, museums, and subjects.
- Query-aware UI with visible active document, variables, response shape, and status.
- Footer context for selected entity, exploration trail, temporal rail, and live query preview.
- URL deep-linking such as `?entity=Q40415&type=movement`, `?entity=Q160112&type=museum`, and mode-aware links like `?entity=Q878985&type=movement&mode=temporal-river`.
- Multilingual-oriented shell and runtime integration built around the French-first Multilingual language source.

## How It Works

The app is intentionally GraphQL-first.

- Query documents live in [`graphql/`](graphql).
- The main data path uses Wikidata's `wbgraphql` endpoint.
- REST is used only where it is the better tool:
  - free-text search via `wbsearchentities`
  - entity claim lookup for search-result type disambiguation via `wbgetentities`

That means GraphQL remains the core retrieval model for expansion, relationships, and UI state, while REST supports discovery and classification around the edges.

## Main Entry Points

- [`src/principal.multi`](src/principal.multi): Multilingual application entrypoint
- [`src/ui/etat.multi`](src/ui/etat.multi): application state, entity loaders, graph cache, and pagination logic in Multilingual
- [`app.js`](app.js): browser-side shell adapter with a compatibility fallback for older bundles
- [`bootstrap.js`](bootstrap.js): startup, URL bootstrapping, REST search wiring, and detail-panel fallback logic
- [`index.html`](index.html): static shell layout
- [`styles.css`](styles.css): shell styling
- [`graphql/`](graphql): dedicated Wikidata query documents

## Query Inventory

Current query documents include:

- `movement_details.graphql`
- `artists_by_movement.graphql`
- `artist_details.graphql`
- `artist_influences.graphql`
- `artworks_by_artist.graphql`
- `artwork_details.graphql`
- `museum_details.graphql`
- `artworks_by_museum.graphql`
- `artworks_by_subject.graphql`
- `movements_catalog.graphql`
- `movement_diffusion.graphql`
- `movement_evolution.graphql`
- `entity_label.graphql`
- `countries_coordinates.graphql`

## Local Build

Requirements:

- Python 3.12+
- a local checkout of the Multilingual toolchain

Build:

```bash
git clone https://github.com/multilingualprogramming/multilingual
cd multilingual
pip install -e ".[wasm]"


https://github.com/multilingualprogramming/MotusArtium
cd MotusArtium
python -m multilingualprogramming build-ui-bundle src/principal.multi --lang fr --out-dir _build
copy _build\\bundle.js bundle.js
python -m http.server 8000
```

Then open `http://localhost:8000`.

To reproduce the GitHub Pages staging flow from this repository, use:

```bash
python3 scripts/build_static_site.py
python3 tests/smoke_static_site.py _site
```

The build script also reports whether the generated Multilingual bundle provides `ui.etat`; current builds should report `yes`.

## Repository Layout

- [`src/`](src): Multilingual source tree
- [`graphql/`](graphql): shipped GraphQL documents
- [`index.html`](index.html): HTML shell
- [`styles.css`](styles.css): shell styles
- [`app.js`](app.js): shell DOM adapter and compatibility fallback
- [`bootstrap.js`](bootstrap.js): startup and search integration
- [`bundle.js`](bundle.js): generated browser bundle

## Documentation

- [`docs/README.md`](docs/README.md): documentation index
- [`docs/architecture.md`](docs/architecture.md): current architecture and runtime responsibilities
- [`docs/data-sources.md`](docs/data-sources.md): GraphQL-first and REST-supporting data model
- [`docs/multilingual.md`](docs/multilingual.md): Multilingual language and project usage
- [`ARCHITECTURE.md`](ARCHITECTURE.md): earlier architecture plan and broader project notes
- [`GETTING_STARTED.md`](GETTING_STARTED.md): quick project bootstrap notes
