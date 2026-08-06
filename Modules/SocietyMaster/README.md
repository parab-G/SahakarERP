# Society Master — Module Specification

Version: 1.0.0
Last Updated: 2026-08-07

This document is the authoritative specification for the Society Master module. It describes business rules, data model, relationships, UI layout, operations, validations, permissions, testing checklist, and guidance for AI agents and developers.

---

# Purpose

The Society Master is the root master record for the SahakarERP system. It captures authoritative information about the registered society (organization) that the ERP instance serves. All ERP modules reference the Society Master (by Society ID) for tenant-scoped data, configuration, and reporting.

Roles
- Single source of truth for society metadata, legal identifiers, contact and bank details, office bearers, and audit information.
- Used by modules for tenancy, validation of documents, bank transfers, and statutory reporting.

Scope
- Initially supports one active society per installation (one-tenant mode). Future releases will allow multiple societies with tenancy controls.

---

# Business Rules

- Only one society may be active at any time (system-enforced). The system must prevent having two records with status.active = true.
- Support for multiple societies is planned; all modules must reference society_id for scoping.
- Certain fields are required for statutory operations (e.g., GST, PAN, bank account) — completeness checks available in admin settings.
- Soft deletes are supported (is_deleted flag). Restores must preserve audit trail.
- System fields track creation and modification metadata.

---

# Complete Field List

Fields are grouped into sections. For each field: Field Name | Data Type | Required | Validation | Example

## System Fields

- id | Integer (PK) | Required | Auto-increment primary key | 102
- uuid | String (UUID) | Required | UUIDv4 | 6f1e2a90-1b5a-4b3a-9f3f-7a1e9d5a2c3b
- version | Integer | Optional | Increment on update | 3
- is_deleted | Boolean | Required (default: false) | true/false | false
- deleted_at | Timestamp | Optional | ISO 8601 timestamp | 2026-07-01T10:20:30Z
- deleted_by | Integer (user id) | Optional | FK to Users | 12
- created_at | Timestamp | Required | ISO 8601 | 2026-06-01T09:00:00Z
- created_by | Integer (user id) | Required | FK to Users | 2
- modified_at | Timestamp | Optional | ISO 8601 | 2026-06-20T11:00:00Z
- modified_by | Integer (user id) | Optional | FK to Users | 3

## General Information

- society_code | String | Required | Unique short code (alphanumeric, 3-15 chars) | "SAHAKAR-001"
- name | String | Required | Non-empty, max 200 chars | "Sahakar Farmers Co-op Society"
- short_name | String | Optional | Max 50 chars | "Sahakar"
- legal_name | String | Optional | Full legal registered name | "Sahakar Farmers Cooperative Society Ltd"
- registration_number | String | Optional | Alphanumeric, max 50 | "REG-2020-452"
- registration_date | Date | Optional | ISO date; cannot be in future | 2020-04-12
- registration_authority | String | Optional | Name of registering authority | "Registrar of Cooperatives"
- society_type | String | Required | Enum: cooperative|society|trust|company | "cooperative"
- constitution | String | Optional | e.g., by-laws reference | "Bylaws v2"

## Address

- address_line1 | String | Required | Max 200 chars | "12 Market Road"
- address_line2 | String | Optional | Max 200 chars | "Near Central Post"
- city | String | Required | Max 100 chars | "Pune"
- district | String | Optional | Max 100 chars | "Pune"
- state | String | Required | Must match master list | "Maharashtra"
- pincode | String | Required | Numeric 5–7 digits depending on country | "411001"
- country | String | Required | ISO 3166-1 alpha-2 or full name | "IN" / "India"

## Contact

- phone | String | Optional | Landline; normalized E.164 or local format | "+91-20-12345678"
- mobile | String | Optional | E.164 recommended | "+919876543210"
- email | String | Optional | Valid email format | "office@sahakar.org"
- alternate_email | String | Optional | Valid email | "accounts@sahakar.org"
- website | String | Optional | URL validation | "https://sahakar.org"

## Bank

- primary_bank_name | String | Optional | Max 100 chars | "State Bank of India"
- primary_branch | String | Optional | Max 100 chars | "Pune Branch"
- account_number | String | Optional | Numeric string, masked in UI | "XXXXXXXX1234"
- ifsc_code | String | Optional | IFSC format (India): 11 chars | "SBIN0001234"
- bank_account_type | String | Optional | Enum: savings|current | "current"
- bank_address | String | Optional | Full branch address | "12 Finance Street, Pune"
- bank_currency | String | Optional | ISO 4217 | "INR"

## GST / Tax

- gstin | String | Optional | GSTIN format validation (India) | "27ABCDE1234F1Z5"
- gst_registration_type | String | Optional | Enum: regular|composition|unregistered | "regular"
- gst_start_date | Date | Optional | Effective registration date | 2020-06-01

## PAN / Tax ID

- pan | String | Optional | Country-specific (India PAN: 10 chars) | "ABCDE1234F"

## Audit & Compliance

- compliance_notes | Text | Optional | Free-form notes about compliance status | "Annual return filed: 2025"
- financial_year_start | Date | Optional | Used for financial reports | 2025-04-01
- accounting_standard | String | Optional | e.g., accrual, cash | "accrual"

## Office Bearers (structured list)

Each office bearer entry:
- id | Integer | auto
- name | String | Required | max 150 | "Mr. A. Kumar"
- designation | String | Required | e.g., President, Secretary | "President"
- start_date | Date | Optional | office term start | 2024-07-01
- end_date | Date | Optional | office term end | 2026-07-01
- contact_mobile | String | Optional | E.164 | "+919876543210"
- contact_email | String | Optional | email | "president@sahakar.org"

Examples of office bearer roles:
- president
- vice_president
- secretary
- treasurer

## Status

- active | Boolean | Required | Only one record should have active=true | true
- activation_date | Date | Optional | When the record was activated | 2020-05-01
- deactivation_date | Date | Optional | When deactivated | null
- remarks | Text | Optional | Administrative notes | "Migrated from legacy DB"

## System Integration Fields

- external_id | String | Optional | ID used by external systems (ERP integrations) | "EXT-SAH-01"
- integration_flags | JSON | Optional | Integration-specific metadata | {"sync_to_gst": true}

---

# Relationships

- Members — one-to-many (society_id → members.society_id)
- Departments — one-to-many (society_id → departments.society_id)
- Work Orders — one-to-many (society_id → workorders.society_id)
- Bank Accounts — one-to-many (society_id → bank_accounts.society_id)
- Documents — one-to-many (society_id → documents.society_id)
- Settings — one-to-one (society_id → settings.society_id)

Relationship notes
- Foreign keys should include ON UPDATE/DELETE rules consistent with soft delete (prefer restrict or nullify rather than cascade delete).
- All relationships must include society_id to support future multi-society tenancy.

---

# Module Layout (UI)

This is a recommended layout for the Society Master admin page.

- Toolbar
  - Title, subtitle, primary action (Add / Edit Society), Export, Import, Refresh
  - Search box and filter dropdowns (state, active status)

- Summary Cards (top row)
  - Active society badge, Registered since, Members count, Bank verified status

- Filters & Search (left/fixed or top)
  - Quick filters: Active only, GST registered, PAN available

- Data Table (center)
  - Columns: id, society_code, name, city, state, gstin, pan, primary_bank_name, active, actions
  - Row actions: View, Edit, Archive (soft delete), Restore (if deleted)

- Detail / Data Form (right panel or modal)
  - Sections: General Information, Address, Contact, Bank, GST, PAN, Office Bearers, Audit
  - Inline validation & field grouping

- Activity / Audit timeline (bottom)
  - Change history and recent exports/imports

Accessibility
- Forms follow accessible markup; inputs labeled and validated with aria-describedby for errors.

---

# CRUD Operations

Create
- Input: full payload with required fields.
- Validation: required fields, unique society_code, unique gstin/pan where applicable.
- Post-condition: created_at/created_by populated; if active=true then ensure no other active society.

Read
- Support read by id, uuid, society_code, and filters.
- Include related counts (members_count) in summary endpoints for dashboard views.

Update
- Support partial updates (PATCH) and full updates (PUT). Increment version and track modified_at/modified_by.
- If active toggled true, system must deactivate other societies atomically.

Soft Delete
- Set is_deleted=true, deleted_at, deleted_by. Do not physically remove rows.
- Related records remain but are filtered by default list endpoints (exclude deleted).

Restore
- Clear is_deleted and deleted_at/deleted_by; maintain audit.
- If restoring an active society, ensure single-active rule enforced.

---

# Validation Rules

- society_code: required, unique, /^[A-Za-z0-9\-\_]{3,15}$/
- name: required, non-empty, max 200 chars
- pincode: numeric length depending on country; validate against country rules when country present
- email fields: RFC-compliant email validation
- mobile/phone: E.164 if provided; otherwise normalize to country format
- account_number: must pass basic length checks and (where possible) modulus checks if available for local banking
- ifsc_code: India IFSC pattern /^[A-Za-z]{4}0[A-Z0-9]{6}$/
- gstin: country-specific format; for India GSTIN 15 chars with checksum
- pan: country-specific format; India PAN /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
- registration_date: not in future
- activation_date/deactivation_date: logical ordering (activation <= deactivation)

Server-side validation must be authoritative; client validation is advisory UX.

---

# Permissions

Roles (example)
- Super Admin — full access to create/update/delete/restore and settings
- Admin — create/update, soft delete, export
- Auditor — read-only access to records and audit trail
- Data Entry — create/update non-sensitive fields

Permission matrix
- Create: Super Admin, Admin
- Read: All roles (with field-level masking for sensitive fields like account_number unless explicit permission)
- Update: Super Admin, Admin, Data Entry (limited fields)
- Delete (soft): Super Admin, Admin
- Restore: Super Admin

Field-level masking
- Bank account numbers and PAN may be masked in UI for roles without permission.

---

# Future Enhancements

- Multi-society tenancy with tenant-aware auth and per-society configuration.
- Bank account verification via micro-deposit or bank APIs.
- GST automatic validation and e-invoice integration.
- Bulk import/export with mapping templates and validation preview.
- Soft-archival workflows: scheduled archival and retention policies.
- Audit and change approvals: multi-step approval for critical updates.

---

# Testing Checklist

Data model & validation
- [ ] Insert valid society record
- [ ] Reject invalid society_code patterns
- [ ] Enforce unique society_code and unique statutory IDs when required
- [ ] Validate GST and PAN formats (where applicable)

Business rules
- [ ] Ensure only one active society at a time
- [ ] Soft delete then restore preserves audit

UI behavior
- [ ] Form validation displays inline errors and ARIA descriptions
- [ ] Office bearer addition/removal updates related UI
- [ ] Masking of sensitive fields for unauthorized roles

Integration
- [ ] Export/Import round-trip maintains data integrity
- [ ] Related modules filter by society_id

Security
- [ ] Field-level permissions enforced
- [ ] SQL injection and XSS tests for freeform fields

Accessibility
- [ ] Keyboard navigation for all forms and tables
- [ ] Screen reader announcements for error/success

Performance
- [ ] List endpoints paginate and respond under target SLA for typical dataset sizes

---

# AI Notes — Guidance for AI Agents

- Always read AI/PROJECT_CONTEXT.md, AI/CODING_STANDARDS.md, and Components/COMPONENT_GUIDE.md before making changes.
- Do not edit Modules/ or Database.js unless explicitly requested and authorized.
- Use SchemaService.js to determine existing schemas and create migration scripts consistent with project conventions.
- When proposing schema changes, include migration steps: forward migration, backward migration, and data migration notes.
- For data imports, run validation in a dry-run mode and produce a structured error report for each row.
- Preserve audit metadata and do not fabricate user IDs — require explicit mapping.

---

# Developer Checklist

- [ ] Review Project Context and Coding Standards
- [ ] Design DB schema changes (if any) and produce migration scripts
- [ ] Implement APIs: list, get, create, update, soft-delete, restore
- [ ] Implement server-side validation consistent with Validation Rules section
- [ ] Implement permissions and field-level masking in controllers
- [ ] Implement unit and integration tests per Testing Checklist
- [ ] Add README usage examples and sample payloads
- [ ] Ensure components use Components/COMPONENT_GUIDE.md standards when building UI

---

End of specification
