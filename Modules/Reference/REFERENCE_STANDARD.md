# Reference Master Standard

This document prescribes the required structure and conventions for all Reference Master modules.

Module structure

Each reference master MUST contain:
- <Name>Schema.js — declarative metadata
- <Name>Validation.js — pure validation helpers
- <Name>Service.js — server service (Database.js + Response.js)
- README.md — module overview
- Optional: <Name>.html and <Name>Script.html for lightweight UI

Required files and naming

- Module folder name: Modules/<Name>Master
- File suffixes: Schema.js, Validation.js, Service.js
- Service namespace: <Name>MasterService (exposed on global object)

Business rules

- Reference Code (short code) is recommended and usually unique
- Display Name is required
- System records: flag system-owned items (do not delete)

Required methods (service contract)

initialize(), getAll(), getActive(), getById(id), exists(id), search(filters), count(), create(record), update(id, record), softDelete(id), restore(id)

Required events (recommended)

- When UI is present, emit lifecycle events: onCreate, onUpdate, onDelete, onRestore

Documentation

- README.md must explain purpose, usage, and integration points
- Schema must document every field and metadata

Coding standards

- Follow AI/CODING_STANDARDS.md
- Validation code: no DB calls; pure functions
- Service: use Database.js only for persistence; use Response.js for returns

Error handling

- Services MUST return Response.* objects (success, error, validationError, notFound)
- Do not throw raw exceptions across server boundary; log internally and return friendly messages

Soft Delete & Audit

- Soft delete is mandatory for reference masters
- Schema must include standard audit fields: CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, Deleted (boolean), DeletedDate

Versioning

- Add a schemaVersion property in schema if future migrations required
- Document breaking changes in module README and AI/CHANGE_REQUESTS.md
