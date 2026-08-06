# Example: UnitMaster (Reference Implementation)

This document demonstrates how UnitMaster was generated using the AI Development Kit.

Schema
- Module: UnitMaster
- Primary Key: Unit ID
- Fields: Unit Code (unique), Unit Name (required), Description, Display Order, Active, Default, System Record
- Indexes: idx_unit_code (unique)

Validation
- SahakarValidation.UnitMaster
- validateField: checks Unit Code pattern and Unit Name presence
- validateRecord/Create/Update/Delete implemented as pure functions

Service
- UnitMasterService (initialize, getAll, getActive, getById, exists, search, count, create, update, softDelete, restore)
- Uses Database.js and Response.js
- Enforces Unit Code uniqueness and manages audit fields

UI
- Optional lightweight page using Toolbar, SearchBox, DataTable, Modal, Alert, Spinner
- Client script calls server functions via google.script.run: getUnits, saveUnit, updateUnit, softDeleteUnit

Integration
- MaterialMaster stores Unit (Unit ID) for materials
- Purchase Register should reference Unit ID on line items

Documentation & Tests
- README.md describing integration and seeding notes
- Tests: validation unit tests and service integration tests (mock DB)

Review notes
- Follow MASTER_MODULE_CHECKLIST.md and MASTER_MODULE_REVIEW.md
- Confirm seed list of common units (kg, m, pcs, ltr, tonne) before production import
