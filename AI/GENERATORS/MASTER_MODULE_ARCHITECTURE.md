# Master Module Architecture

Layers

1. Schema Layer
   - Declarative metadata (fields, indexes, dropdowns)
   - Used by provisioning, forms, and mapping

2. Validation Layer
   - Pure validation functions (SahakarValidation namespace)
   - No DB calls; returns { valid, errors, warnings }

3. Service Layer
   - Server-side logic using Database.js and Response.js
   - Enforces uniqueness, audit fields, soft-delete, and business rules

4. UI Layer (optional)
   - Apps Script HTMLService pages built from reusable components
   - Client scripts call server-side service via google.script.run

5. Component Layer
   - Reusable UI pieces (Toolbar, DataTable, Modal, Alert, Spinner)
   - Must consume Core utilities (EventEmitter, BaseComponent)

6. Database Layer
   - Database.js abstracts sheet operations (getAll, findById, insertRecord, updateRecord)

7. Response Layer
   - Response.success/error/validationError/notFound used for all service responses

Integration points

- ModuleLoader: registers services and UI routes
- SahakarSchemas: central registry of schemas for tooling and UI
- SahakarValidation: central registry for validation namespaces

Design goals

- Separation of concerns: schema declarative, validation pure, service authoritative
- Backward compatibility: services should be non-destructive to legacy callers
- Reuse: prefer shared helpers in Core (ConfigManager, SharedHelpers, ThemeManager)

Error handling & logging

- Services catch exceptions and return Response.error with a friendly message
- Detailed logs kept server-side (not committed to repo)

Migration & versioning

- schemaVersion in Schema.js for migrations
- Migration notes in docs/ and AI/CHANGE_REQUESTS.md
