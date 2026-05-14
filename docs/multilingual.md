# Multilingual

MotusArtium is built around the Multilingual programming language.

The source tree is French-first, and the generated browser bundle is produced from `.multi` files.

## Where Multilingual Appears

- `src/principal.multi`: entrypoint
- `src/ui/etat.multi`: application state
- `src/donnees/requetes.multi`: data access and normalization
- `src/ui/visualisations/*.multi`: visual and semantic views
- `src/ui/interactions/*.multi`: navigation and interaction logic

## Why It Matters Here

Multilingual is not just a build curiosity in this project. It shapes:

- naming
- state flow
- async loading functions
- the French-first authoring style
- the relationship between source code and generated browser runtime

## Current Relationship Between Multilingual and JavaScript

The project uses a Multilingual-first hybrid model:

- Multilingual provides the core application source, reactive state, entity loaders, and runtime concepts.
- The browser shell in `app.js` and `bootstrap.js` adds:
  - search integration
  - GraphQL instrumentation
  - URL bootstrapping
  - shell-level UI behavior

`app.js` still carries a compatibility implementation of `window.ui.etat` for bundles produced before the full state module is lowered. It must stay a fallback: new stateful behavior belongs in `src/ui/etat.multi` or nearby `.multi` modules.

## Build Model

The usual flow is:

1. edit `.multi` sources in `src/`
2. build the UI bundle with the Multilingual toolchain
3. ship `bundle.js` alongside the shell files

Example:

```bash
python -m multilingualprogramming build-ui-bundle src/principal.multi --lang fr --out-dir _build
```

## Language Perspective

MotusArtium is a good example of using Multilingual for:

- a reactive stateful UI
- domain-specific naming in French
- semantic and temporal modeling
- a browser-facing application that still exposes query-driven data behavior

In short, GraphQL is the main data language of the product, and Multilingual is the main authoring language of the application.
