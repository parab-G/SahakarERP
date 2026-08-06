# Master Module Template

Purpose

Canonical template and file responsibilities for any generated Master module.

Folder layout (canonical)

Modules/<ModuleName>Master/
  README.md
  <ModuleName>Schema.js
  <ModuleName>Validation.js
  <ModuleName>Service.js
  <ModuleName>.html         (optional UI)
  <ModuleName>Script.html  (optional client script)
  tests/                   (unit & integration tests)
  docs/                    (module-specific docs)

File responsibilities

- README.md — purpose, integration, sample usage, migration notes
- Schema.js — declarative metadata used by provisioning, UIs and services
- Validation.js — pure validation namespace SahakarValidation.<ModuleName>
- Service.js — server-side API (Database.js + Response.js)
- .html/.Script.html — optional Apps Script-compatible UI using reusable components
- tests/ — validation and service tests (mock Database)

Dependencies

- Database.js (for persistence)
- Response.js (standardized responses)
- Utils.js (IDs, timestamps)
- Components (for UI)

Expected outputs

- Fully documented module folder
- Passing validation + service tests
- Optional UI working with ModuleLoader mappings

Required documentation

- README.md
- Example API usage
- Migration notes if replacing legacy tables

Notes

- Keep modules self-contained and reuse shared helpers from Core where needed.
- Implement soft-delete and audit fields consistently.