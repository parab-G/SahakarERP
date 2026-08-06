# Reference Masters — Overview

Purpose

Reference Masters are small, authoritative lookup tables used across SahakarERP (e.g., Unit Master, GST Rate, Department Type). This folder defines standards and guidance so every new reference master is consistent, testable, and maintainable.

Folder structure

- Modules/Reference/
  - README.md (this file)
  - REFERENCE_STANDARD.md
  - REFERENCE_SCHEMA_STANDARD.md
  - REFERENCE_VALIDATION_STANDARD.md
  - REFERENCE_SERVICE_STANDARD.md
  - REFERENCE_UI_STANDARD.md
  - REFERENCE_MIGRATION_GUIDE.md

Architecture

Reference masters follow a simple, repeatable architecture:
- Schema (declarative metadata)
- Validation (pure, no DB calls)
- Service (server-side CRUD via Database.js + Response.js)
- UI (optional lightweight page composed from reusable components)

Naming & lifecycle

- Module folder: Modules/<Name>Master (e.g., UnitMaster)
- Files: README.md, <Name>Schema.js, <Name>Validation.js, <Name>Service.js, <Name>.html, <Name>Script.html
- Lifecycle: initialize → getAll/getActive → create/update → softDelete/restore

Best practices

- Keep reference data small and stable
- Use unique reference codes
- Prefer server-side enforcement of uniqueness
- Provide seed/system records where applicable

Integration

- Exported service APIs allow modules to look up values by ID or code
- UI pages are optional and must use reusable components

Future expansion

- Support import/export CSV
- Add history/audit UI when needed
- Add centralized caching for performance
