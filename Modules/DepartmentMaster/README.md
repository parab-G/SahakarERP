# Department Master Module

Purpose

Department Master stores government departments and organizations (tendering/issuing authorities) used throughout SahakarERP. It provides schema, validation, service and a component-driven UI for CRUD and search.

Files

- DepartmentMasterSchema.js — declarative schema and metadata
- DepartmentMasterValidation.js — pure validation rules (no DB calls)
- DepartmentMasterService.js — server-side service using Database.js and Response.js
- DepartmentMaster.html — component-driven UI shell (Toolbar, Cards, Search, Filters, Table, Pagination, Modal, Alerts, Spinner)
- DepartmentMasterScript.html — client script initializing components and calling server functions via google.script.run

Standards

- Follow AI/STANDARDS/MODULE_STANDARD.md and Components/COMPONENT_GUIDE.md
- Bootstrap 5 for layout
- No inline CSS or inline database calls in validation
- Service uses Database.js for all persistence and manages audit fields
- Soft-delete only; restore supported

Integration notes

Client script expects server functions: getDepartments, saveDepartment, updateDepartment, softDeleteDepartment, restoreDepartment. ModuleLoader or Code.js should map those names to DepartmentMasterService if necessary.

Review

Please review schema (especially department types), validation rules, and service API signatures before mapping ModuleLoader or adding server wrappers.