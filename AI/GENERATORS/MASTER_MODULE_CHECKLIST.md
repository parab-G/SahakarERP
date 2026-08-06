# Master Module Checklist

Every generated module MUST pass this checklist before review:

Architecture
- Follows MASTER_MODULE_TEMPLATE.md structure
- Uses Schema → Validation → Service → (UI) pattern

Coding Standards
- Follows AI/CODING_STANDARDS.md
- No inline CSS or inline JS in templates

Accessibility
- Modals trap focus
- ARIA attributes on forms and tables
- Keyboard reachable actions

Database
- Uses Database.js for persistence
- Soft-delete implemented
- Audit fields present (CreatedBy/Date, UpdatedBy/Date, Deleted, DeletedDate)

Validation & Response
- Validation functions exist and are pure
- Service returns Response.success/error/validationError/notFound

Components & UI
- Reuse Toolbar, DataTable, Modal, Alert, Spinner, SearchBox
- No duplicated component code

Performance & Security
- No heavy client-side scans on large tables
- Input sanitization and size limits

Documentation & Tests
- README present
- Unit tests for validation
- Integration tests for service (mock DB)

Naming & Versioning
- Module and files follow naming standards
- schemaVersion set if needed

Release
- Changelog entry
- AI/CURRENT_SPRINT.md updated

Sign-off
- Developer, Reviewer, QA signatures (or PR approvals)