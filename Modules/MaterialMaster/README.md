# Material Master Module

Purpose

Material Master stores materials used in construction projects and acts as the central catalogue for purchase, BOQ, estimates, cost sheets, and future inventory/stock modules.

Files

- MaterialMasterSchema.js — declarative schema and metadata
- MaterialMasterValidation.js — pure validation (no DB calls)
- MaterialMasterService.js — server-side service using Database.js and Response.js
- MaterialMaster.html — component-driven UI shell (Toolbar, Cards, Search, Filters, Table, Pagination, Modal, Alerts, Spinner)
- MaterialMasterScript.html — client script initializing components and calling server functions via google.script.run

Standards

- Follow AI/STANDARDS/MODULE_STANDARD.md and Components/COMPONENT_GUIDE.md
- Bootstrap 5 for layout
- No inline CSS or inline DB calls in validation
- Service uses Database.js and manages audit fields
- Soft-delete only; restore supported

Integration notes

Client expects server functions: getMaterials, saveMaterial, updateMaterial, softDeleteMaterial, restoreMaterial. ModuleLoader mapping recommended.

Review

Please review schema fields, dropdown lists, and validation rules before mapping ModuleLoader or adding server wrappers.