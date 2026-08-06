# Unit Master Module

Purpose

Unit Master stores measurement units used across SahakarERP (kg, litre, pcs, m, etc.). It's a small reference master following the Reference standards.

Files

- UnitMasterSchema.js — declarative schema and metadata
- UnitMasterValidation.js — pure validation helpers (SahakarValidation.UnitMaster)
- UnitMasterService.js — server-side service using Database.js + Response.js
- UnitMaster.html — optional lightweight UI shell (component-driven)
- UnitMasterScript.html — client script using reusable components and calling server functions

Standards

- Implements Modules/Reference/ standards (schema, validation, service, UI)
- Soft-delete, audit fields, and uniqueness for Unit Code
- No inline CSS or DB calls in validation

Integration

- MaterialMaster references Unit Master by Unit (unit code or Unit ID)
- Purchase/Register modules should use Unit ID when persisting line items to avoid display-name drift

Review

Confirm Unit codes and any system defaults before seeding production data.