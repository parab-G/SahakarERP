# Bank Master Module

Purpose

Bank Master stores banks and branches used across SahakarERP. It provides schema, validation, service and a component-driven UI for CRUD, search and reference by other modules.

Files

- BankMasterSchema.js — declarative schema and metadata
- BankMasterValidation.js — pure validation rules (no DB calls)
- BankMasterService.js — server-side service using Database.js and Response.js
- BankMaster.html — component-driven UI shell (Toolbar, Cards, Search, Filters, Table, Pagination, Modal, Alerts, Spinner)
- BankMasterScript.html — client script initializing components and calling server functions via google.script.run

Standards

- Follow AI/STANDARDS/MODULE_STANDARD.md and Components/COMPONENT_GUIDE.md
- Bootstrap 5 for layout
- No inline CSS or inline database calls in validation
- Service uses Database.js for all persistence and manages audit fields
- Soft-delete only; restore supported

Integration notes

Client script expects server functions: getBanks, saveBank, updateBank, softDeleteBank, restoreBank. ModuleLoader or Code.js should map those names to BankMasterService if necessary.

Review

Please review schema, validation rules, and service API signatures before mapping ModuleLoader or adding server wrappers.