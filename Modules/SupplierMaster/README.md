# Supplier Master — Module Specification

Version: 1.0.0
Last Updated: 2026-08-07

This module manages supplier master data used throughout SahakarERP. It follows the Schema + Validation + Service pattern and reuses the SocietyMaster reference implementation and shared Components.

Purpose
- Record and maintain supplier information (contacts, tax IDs, bank, category, materials).
- Provide a canonical source of supplier metadata referenced by purchasing and accounting modules.

Key features
- CRUD (soft delete) with audit fields
- Validation rules for GSTIN, PAN, IFSC, emails and phone numbers
- Search, filters, pagination via reusable components
- Component-driven UI using DataTable, SearchBox, Modal, Alert, Spinner

Standards
- Follows Modules/MODULE_STANDARD.md and Components/COMPONENT_GUIDE.md
- No inline CSS or inline JavaScript inside templates
- All data access uses Database.js and Response.js

Files
- SupplierMasterSchema.js — declarative schema metadata
- SupplierMasterValidation.js — pure validation helpers
- SupplierMasterService.js — server-side business service using Database.js
- SupplierMaster.html — UI page using reusable components
- SupplierMasterScript.html — client script that initializes components and calls server

Usage
- ModuleLoader should load Modules/SupplierMaster/SupplierMaster.html
- Server-side functions are exposed via google.script.run by name (create wrappers if needed)

Contributing
- Follow AI/PROJECT_CONTEXT.md and AI/CODING_STANDARDS.md
- Use Components/Core shared utilities for future refactors

End of README
