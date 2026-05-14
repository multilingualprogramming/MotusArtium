# Data Sources

MotusArtium is GraphQL-first.

That is the key design choice for the project.

## Primary Data Path: Wikidata GraphQL

The main application behavior depends on dedicated GraphQL documents stored in [`graphql/`](../graphql).

These documents drive:

- movement detail loading
- artist detail loading
- artwork detail loading
- artist expansion from a movement
- artwork expansion from an artist
- artwork expansion from a museum
- artwork expansion from a subject
- influence and diffusion views
- label refreshes for selected entities

The GraphQL endpoint used by the app is Wikidata's `wbgraphql` endpoint.

## Why GraphQL Is Central

GraphQL is the main aspect of MotusArtium because it lets the app:

- keep entity relationships explicit
- ship dedicated query documents as part of the product
- show the active document directly in the UI
- make variables and response shapes visible
- expand different entity types through purpose-built query surfaces

This is not just an implementation detail. It is part of the product identity.

## Supporting Data Path: REST

REST is used for narrower supporting tasks where it is a better fit than GraphQL.

### `wbsearchentities`

Used for free-text search input such as:

- movement names
- artist names
- museum names
- subject terms

### `wbgetentities`

Used to inspect entity claims for search-result type resolution, so the app can decide whether a search result should load as:

- movement
- artist
- artwork
- museum
- subject

## Current GraphQL Documents

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
- `countries_coordinates.graphql`
- `entity_label.graphql`

## Practical Rule

If the user is searching by text, the shell starts with REST.

If the app is expanding an entity into meaningful art-history relationships, the app should move into GraphQL as quickly as possible.
