# Master Module Folder Structure

Canonical layout

Modules/<ModuleName>Master/
  README.md
  <ModuleName>Schema.js
  <ModuleName>Validation.js
  <ModuleName>Service.js
  <ModuleName>.html         (optional UI shell)
  <ModuleName>Script.html  (optional client script)
  tests/
    validation.test.js
    service.test.js
  docs/
    migration.md
    examples.md

Examples
- Small reference master: UnitMaster (Schema, Validation, Service, optional UI)
- Complex master: MaterialMaster (full UI, tests, docs)

Guidelines for growth

- Keep tests under tests/
- Keep long-form docs under docs/
- Use scripts/ for migration/import helpers (if required) but do NOT commit secret keys
- Versioning: add schemaVersion in Schema.js and record migration notes in docs/

Module dependencies

- Core utilities (Utils.js, Database.js, Response.js)
- Optional: components for UI (Components/*)

Notes on ModuleLoader

- Register service namespace and route to UI where applicable
- Prefer non-invasive registration (do not overwrite existing services)