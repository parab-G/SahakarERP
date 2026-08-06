# Reference Migration Guide

Purpose

Guidance for creating new Reference Master modules and migrating legacy lookup tables into the new standard.

How to create a new Reference Master

Checklist

1. Create folder Modules/<Name>Master.
2. Add <Name>Schema.js with mandatory metadata and fields.
3. Add <Name>Validation.js implementing SahakarValidation.<Name> with required methods.
4. Add <Name>Service.js implementing the service API and using Database.js + Response.js.
5. (Optional) Add <Name>.html and <Name>Script.html using reusable components.
6. Add README.md documenting purpose, integration, and differences.
7. Add unit tests for validation and service (mock Database where possible).

Testing

- Validation tests: field-level and record-level tests
- Service tests: create/read/update/delete/restore flows against a test sheet or mocked Database
- UI smoke test: ensure create/edit/delete show correct responses and the DataTable refreshes

Review process

- Peer review of schema and validation
- QA-run of service with sample data
- Accessibility check for UI pages

Migration from old lookup tables

1. Inventory current lookup table headers and content.
2. Map old columns to new schema fields; identify missing/extra fields.
3. Export old data as CSV.
4. Prepare a one-time import script that transforms CSV rows into schema-aligned records and calls Service.create() or Database.insertRecord() with audit fields.
5. Run import in a staging environment and validate referential integrity (e.g., modules referencing code/ID).
6. Mark migrated legacy table as read-only or archive it.

Common mistakes

- Relying on display text as a stable integration key (use reference codes or IDs)
- Implementing validation with DB calls (keep validation pure)
- Omitting audit fields or soft-delete
- Not documenting system records or default values

Expected outputs

- Fully documented module folder
- Passing validation and service unit tests
- Migration script and mapping notes committed to AI/CHANGE_REQUESTS.md or module README

Rollback & safety

- Keep a CSV backup of original lookup table
- During import, tag migrated rows with migrationId and leave source untouched until verification

Sign-off

- Module owner and QA must sign off before marking the module ready for consumption by other ERP modules
