# Architecture

MotusArtium is a layered application with a static browser shell, a Multilingual runtime, and a set of dedicated Wikidata query documents.

## Main Layers

- `index.html` and `styles.css` define the shell layout and presentation.
- `bundle.js` is the generated Multilingual browser bundle.
- `app.js` bridges the shell to live data, graph state, and runtime loading functions.
- `bootstrap.js` handles startup, URL deep links, REST search, and detail-panel fallback behavior.
- `src/` contains the source application written in Multilingual.
- `graphql/` contains the GraphQL documents sent to Wikidata.

## Current Runtime Responsibilities

### `app.js`

- tracks active GraphQL documents and variables
- renders query status, response shape, and selection context
- manages the in-browser constellation graph state
- exposes loaders for:
  - movements
  - artists
  - artworks
  - museums
  - subjects
- expands nodes into related entities using dedicated GraphQL documents

### `bootstrap.js`

- initializes the app
- reads deep-link URLs such as `?entity=...&type=...`
- uses REST search for discovery
- resolves search-result type before loading
- wires search results into the correct runtime loader

### `src/`

Important source areas:

- `src/principal.multi`: main Multilingual entrypoint
- `src/donnees/requetes.multi`: GraphQL endpoint access and normalization
- `src/ui/etat.multi`: reactive state and loading methods
- `src/ui/visualisations/`: graph, chronology, galaxy, and heatmap views
- `src/semantique/`: semantic, temporal, geographic, and graph-oriented logic

## Current Entity Entry Types

The current shell supports direct entry and expansion for:

- movement
- artist
- artwork
- museum
- subject

Each of these is treated as a first-class graph root in the browser shell.

## Deep Links

The app supports URL-based loading using the query string:

- `?entity=Q40415&type=movement`
- `?entity=Q5593&type=artist`
- `?entity=Q12418&type=artwork`
- `?entity=Q160112&type=museum`
- `?entity=Q146&type=subject`

## Notes

- The browser shell is not replacing the Multilingual runtime; it is wrapping it and making query behavior more visible.
- The current architecture is intentionally hybrid: Multilingual remains central, while the JavaScript shell handles instrumentation, search UX, and graph orchestration around it.
