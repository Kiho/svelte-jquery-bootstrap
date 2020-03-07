
# Svelte + Bootstrap Starter project in TypeScript

The goal of this project is to provide a starting base for an Svelte project styled with Bootstrap in TypeScript.

[See demo here at Heroku](https://cryptic-dusk-82553.herokuapp.com/)


Features:

* [Bootstrap Template](https://github.com/puikinsh/gentelella)
* Uses DataTables as Grid
* Svelte Data Table - Converted from vue-materialize-datatable
* Basic Form Validation

## How to run
    npm install
    npm run fix:route-parser

For development:
    
    npm run start

open [http://localhost:8081/](http://localhost:8081/) in the browser

## Requirements

* Node 6 or Higher
* TypeScript 2.2.2 or Higher 

## Dependencies

* [Svelte](https://svelte.technology/)
* Bootstrap
* Rollup
* TypeScript
* jQuery

Need Express to run api server

## Goals

I needed a simple POC code to support CRUD operation with JavaScript front-end and WebAPI back-end.

## Known Issues
(commonjs plugin) Invalid labeled declaration (163:8) in D:/Work/svelte-ts-bootstrap/node_modules/route-parser/lib/route/compiled-grammar.js

Error when building with rollup #25
[https://github.com/rcs/route-parser/issues/25](https://github.com/rcs/route-parser/issues/25)

## Credits

* [Svelte-TypeScript-WebPack-Starter](https://github.com/brakmic/Svelte-TypeScript-WebPack-Starter)
* [MiYogurt/svelte-with-ts](https://github.com/MiYogurt/svelte-with-ts)