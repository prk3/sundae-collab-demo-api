<h1 align="center"><a href="https://github.com/prk3/sundae-collab-server">sundae-collab</a></h1>
<p align="center">Delicious collaboration framework</p>

sundae-collab-demo-api serves an example resource type - cooking recipe - to [sundae-collab-demo-client](https://github.com/prk3/sundae-collab-demo-client) over a REST API.

## Recipe

Recipe model has the following fields:

- id - integer, uniquely identifies recipe
- name - string, not longer than 500 characters
- description - string, not longer than 2000 characters
- type - string, one of drink/appetizer/soup/main/dessert
- time - integer, multiple of 5, greater or equal 5
- alcohol - boolean

## Routes

- GET /recipes - reads all recipes from the db
- POST /recipes - adds a new recipe
- GET /recipes/&lt;id&gt; - retrieves recipe by
- PUT /recipes/&lt;id&gt; - updates recipe with that id
- DELETE /recipes/&lt;id&gt; - removes recipe with given id

## Environment

sundae-collab-demo-api relies on the following environment variables:

- NODE_ENV - environment - development / production / test (default = production)
- PORT - defines port the server will run on (default = 8000)
- DB_TYPE (default = pg)
- DB_HOST (default = 127.0.0.1)
- DB_PORT (default = 5432)
- DB_USER (default = postgres)
- DB_PASSWORD (default = postgres)
- DB_DATABASE (default = postgres)

You can override them using docker's `-e` flag or docker-compose's `environment` map.

If you decide to run demo-api locally, copy `example.env` to `.env` and change variables there.

With NODE_ENV set to `production`, demo-api blocks cross-origin requests.

## Useful commands

In the project directory, you can run:

### `npm run server`

Runs the server.

### `npm run dev`

Runs the server in the development mode. It will reload whenever source files change.

### `npm run test`

Runs the integration tests. Remember to provide a test database name with DB_DATABASE env variable.

### `npm run lint`

Lints all source files and tests.

### `npx knex migrate:latest`

Migrate database tables. The command is a part of [knex's migrations cli](https://knexjs.org/#Migrations-CLI).

### `npx knex seed:run`

Clears tables and seeds models. The command is a part of [knex's seeds cli](https://knexjs.org/#Seeds-API).

## TODO

1. Enable use of https.
