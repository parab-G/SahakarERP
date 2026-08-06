# Contractor Master Module

Purpose

The Contractor Master module manages contractor master data used across SahakarERP. It provides schema, validation, and service layers, plus a component-driven UI for listing, searching, creating, editing, soft-deleting and restoring contractors.

Files

- ContractorMasterSchema.js — declarative schema and metadata
- ContractorMasterValidation.js — pure validation rules (no DB calls)
- ContractorMasterService.js — server-side service using Database.js and Response.js
- ContractorMaster.html — component-based UI shell (Toolbar, Cards, Search, Filters, Table, Pagination, Modal, Alerts, Spinner)
- ContractorMasterScript.html — client script that initializes reusable components and calls server methods via google.script.run

Standards

- Follow AI/STANDARDS/MODULE_STANDARD.md
- Bootstrap 5 for layout
- No inline CSS in templates
- Validation is centralized; service enforces uniqueness and audit fields
- Soft-delete-only; no hard deletes

Integration notes

Client-side expects server functions: getContractors, saveContractor, updateContractor, softDeleteContractor, restoreContractor. ModuleLoader or Code.js should map those names to ContractorMasterService functions as needed.

Review

Please review schema, validation rules, and service API signatures before mapping ModuleLoader or adding server wrappers.