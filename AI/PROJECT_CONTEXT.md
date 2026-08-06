# PROJECT_CONTEXT

Version: 1.0.0

Status: Approved

Owner: SahakarERP Core Team

Last Updated: 2026-08-06

# PROJECT_CONTEXT.md

**Project**: SahakarERP  
**Purpose**: Canonical onboarding and operational and technical context for every AI agent and human developer joining SahakarERP  
**Audience**: AI coding agents, software developers, maintainers, new contributors

---

## Vision

SahakarERP is **not another accounting software**.

It is a complete digital operating system for **Labour Cooperative Societies** (Majur Sahakari Sanstha) in Maharashtra. The product was designed after studying the real day-to-day operations of cooperative societies and the physical registers they maintain. Instead of focusing only on ledgers, SahakarERP digitizes the entire lifecycle of government work and society administration — from discovering a tender to final settlement and audit — and replaces dozens of physical registers with a single, consistent digital system.

**Long term goals**

- **Paperless office** for cooperative societies  
- **Digital document repository** where every register entry links to source documents and photos  
- **Automated statutory compliance** and reminders for renewals and audits  
- **AI assisted administration** for drafting letters, extracting data from documents, and smart search  
- **Government work management** that mirrors the real tender to settlement lifecycle  
- **Financial management** integrated with operational registers and vouchers  
- **Knowledge preservation** so institutional memory survives staff turnover

SahakarERP’s mission is to **digitize the entire cooperative society**: administration, engineering, accounting, compliance, legal, members, meetings, government correspondence, tendering, assets, document management, and knowledge base.

---

## Project Summary

**What SahakarERP is today**

- A single codebase running entirely on **Google Apps Script**.  
- UI built with **HTMLService**, **Bootstrap 5**, and **Vanilla JavaScript (ES6)** using HTML templates.  
- Persistent data stored in **Google Sheets**.  
- A centralized data access layer implemented as **Database.js**.  
- Automatic sheet creation and schema enforcement via **SchemaService.js**.  
- Client to server communication via `google.script.run`.  
- Source control with **Git** and **GitHub**, local development and deployment using **clasp**, and Web App deployment through Google Apps Script.

**What SahakarERP is not**

- It is not a microservices system, not a Node.js app, and not built on external databases or container platforms. All code executes inside the Apps Script runtime and all persistent data is in Google Sheets.

---

## What Makes SahakarERP Unique

SahakarERP is unique because it models the **register-first** operational reality of Labour Cooperative Societies. The product:

- Treats **Registers** as first-class entities rather than secondary reports.  
- Centers every workflow around the **Work Order** and the sequence of registers that follow it.  
- Preserves the exact sequence of administrative steps used by societies: tender purchase, EMD, technical and financial qualification, LOA, work order, measurements, government billing, settlement, audit, and record preservation.  
- Links documents, photos, and correspondence to register entries so every audit trail is traceable.  
- Is intentionally simple and constrained to Google Apps Script and Google Sheets so societies can run the system with minimal infrastructure and using accounts they already have.

---

## Business Goal

**Digitize the entire cooperative society.**

This is the single business objective that drives every feature and design decision. Digitization means:

- Replacing physical registers with searchable, auditable digital registers.  
- Capturing documents and linking them to register entries.  
- Automating routine compliance and reminders.  
- Preserving institutional knowledge in a structured knowledge base.  
- Enabling AI to assist routine administrative tasks while keeping humans in control.

---

## Canonical Business Workflow

SahakarERP models the real cooperative workflow. The canonical business flow implemented in the product is:

```
Tender Discovery
↓
Tender Purchase
↓
EMD
↓
Tender Submission
↓
Technical Qualification
↓
Financial Qualification
↓
LOA
↓
Work Order
↓
Execution Agency Selection
↓
Execution Assignment
↓
Material Purchase
↓
GST Purchases
↓
Expenses
↓
Measurements
↓
Government Bill
↓
Payment Received
↓
Settlement
↓
Work Completion
↓
Audit
↓
Record Preservation
```

Each step maps to one or more registers and documents. The UI and reports are organized to make this flow visible and auditable for society administrators and auditors.

---

## Register Philosophy

Registers are the backbone of SahakarERP. A register is a structured, auditable list of entries that mirrors a physical register used by societies. Registers are the primary source of truth for operations and reporting.

**Common registers**

- Tender Register  
- Work Order Register  
- Execution Register  
- Supplier Register  
- Transaction Register  
- Voucher Register  
- GST Purchase Register  
- Document Register  
- Compliance Register  
- Letter Register  
- Resolution Register  
- Notice Register  
- Meeting Register  
- Member Register  
- Asset Register

**Register rules**

- Every register is implemented as a Google Sheet and a service module.  
- Each register row includes audit fields: **id**, **createdAt**, **createdBy**, **updatedAt**, **updatedBy**, and **deleted** (soft delete).  
- Registers can own documents; document metadata is stored in the Document Register and files are referenced by Drive ID or URL.  
- Registers are the primary input for reports, letters, and government correspondence.

---

## Current Repository Structure

This is the actual layout of the repository. New contributors and AI agents should use this map to find code and documentation immediately.

```
/
├── AI/                         # AI Developer Kit and issues for AI-driven fixes
├── Components/                 # Shared reusable UI components and templates
├── Modules/                    # ERP modules organized by register and feature
├── Code.js                     # Entry point for client scripts
├── Main.html                   # Main application shell and HTMLService entry
├── App.html                    # Dashboard container
├── Navbar.html                 # Top navigation template
├── Sidebar.html                # Sidebar navigation template
├── Database.js                 # Centralized data access layer for Google Sheets
├── SchemaService.js            # Automatic sheet creation and schema enforcement
├── Utils.js                    # Utility functions and ID generators
├── Response.js                 # Standardized response and error objects
├── ModuleLoader.js             # Dynamic module loader and registry
├── Config.js                   # Environment and configuration constants
├── PROJECT_ROADMAP.md
├── CHANGELOG.md
└── appsscript.json
```

**Notes**

- `Modules/` contains subfolders for each module. Each module follows the Standard Module Template described below.  
- `Components/` contains reusable HTML fragments and client-side JS helpers used across modules.  
- `AI/` contains AI prompts, issue trackers for AI-suggested fixes, and experiments. AI agents must read `AI/README.md` before making changes.

---

## Current Development Status

**Current Version**

- **1.x**

**Completed**

- ✓ Foundation and repository layout  
- ✓ Routing and module loader  
- ✓ Dashboard and main shell  
- ✓ Schema Service and Database.js basics  
- ✓ Settings and Society Master module

**Current Sprint**

- **Sprint 4**

**Current Priority**

- Reusable UI Components

**Next Priorities**

- Suppliers module  
- Execution Agencies module  
- Chart of Accounts module  
- Tender Register module

---

## Golden Rules

These are the non-negotiable principles every developer and AI agent must follow.

- **Everything is a Register.**  
- **Everything is a Module.**  
- **Everything has a Schema.**  
- **Everything goes through Database.js.**  
- **Everything must be documented.**  
- **Everything must be reusable.**  
- **Never hardcode.**  
- **Never duplicate.**

Treat these as the project’s constitution. Violations must be corrected and documented in an ADR.

---

## Standard Module Template

Every module must follow this template. This ensures consistency and makes modules predictable for humans and AI.

**Every module MUST contain**

- `Module.html` — UI template for the module (HTMLService template)  
- `ModuleScript.html` — Client script fragment if needed for the module shell  
- `ModuleService.js` — Server side Apps Script service functions for the module  
- `ModuleSchema.js` — Schema definition consumed by SchemaService.js  
- `Validation.js` — Validation rules shared by client and server where possible  
- `README.md` — Module README with endpoints, sample payloads, and usage notes  
- `Documentation` — Short design notes and ADR references  
- `Tests` — Placeholder for future unit and integration tests

**Module folder example**

```
Modules/WorkOrders/
├── WorkOrders.html
├── WorkOrdersScript.html
├── WorkOrdersService.js
├── WorkOrdersSchema.js
├── WorkOrdersValidation.js
├── README.md
```

---

## Component Philosophy

Pages should be assembled from reusable components rather than repeated HTML. Sprint 4.2 focuses on building and enforcing this component library.

**Reusable components**

- Card  
- Toolbar  
- Data Table  
- Modal  
- Search Box  
- Pagination  
- Status Badge  
- Alert  
- Confirmation Dialog  
- Loading Spinner  
- Empty State  
- Statistics Card  
- Dashboard Tile  
- Dropdown  
- Form Controls

**Rules**

- Components live in `Components/` and are referenced by modules via `ModuleLoader.js`.  
- Components must be parameterized and avoid inline JavaScript. Event wiring happens in module `ui.js`.  
- Styling uses Bootstrap 5 classes and design tokens. No inline CSS.

---

## UI Patterns and Page Layout

Every page should feel identical and predictable. Use the following layout pattern:

- **Header** with society name and user info  
- **Toolbar** with primary actions (Create, Import, Export)  
- **Filters** for date, status, and key attributes  
- **Search** for quick lookup within the register  
- **Table** showing register rows with sortable columns  
- **Pagination** for large registers  
- **Modal** for create and edit forms  
- **Alerts** for success, warning, and error messages  
- **Confirmation** dialogs for destructive actions  
- **Loading spinner** for long operations  
- **Empty state** with guidance and next steps  
- **Error state** with actionable messages

This pattern must be implemented consistently across modules.

---

## Development Principles and Coding Philosophy

SahakarERP enforces a strict development sequence and coding discipline to keep the codebase consistent and maintainable.

**Every sprint and feature follows this sequence**

1. **Idea** documented in `CURRENT_SPRINT.md`  
2. **Discussion** and ADR if architecture changes are needed  
3. **Architecture** confirmation and schema design  
4. **Documentation** update before coding begins  
5. **Sprint Planning** and task assignment  
6. **Implementation** following the Standard Module Template  
7. **Review** via PR and Tech Lead approval  
8. **Git Commit** with atomic, descriptive messages  
9. **Push** to staging and run integration tests  
10. **Deployment** to production via clasp and Apps Script Web App  
11. **Testing** and verification  
12. **Release** and update `CHANGELOG.md`

**Coding rules**

- Never access Google Sheets directly from UI code. All reads/writes must go through `Database.js`.  
- Never duplicate utilities. Reuse `Utils.js` and shared libraries.  
- Always validate on server even if validated on client.  
- Always update module README, `CHANGELOG.md`, and `CURRENT_SPRINT.md` with changes.  
- Keep commits atomic and include tests where feasible.

---

## Developer Workflow

This project intentionally integrates AI agents into the development loop. The workflow reflects that collaboration.

```
Developer
↓
ChatGPT or other AI for documentation and scaffolding
↓
AI Documentation and code suggestions
↓
Copilot Codex Gemini for implementation assistance
↓
Developer Review and manual edits
↓
Git commit and PR
↓
Deployment via clasp
↓
Production
```

AI agents must follow the AI Developer Guidelines in this document and the repository `AI/README.md`.

---

## Issue Management

The repository contains an `AI/ISSUES` area for AI-suggested fixes and a standard issue workflow for human triage.

**Issue flow**

```
Bug or Request
↓
Create issue in GitHub or AI/ISSUES for AI-suggested fixes
↓
Discussion and assignment
↓
Fix implemented in feature branch
↓
Review and approval
↓
Merge and close
```

AI-generated fixes must be reviewed by a human before merging.

---

## Current Limitations

Documenting current platform limitations helps set expectations.

- Google Apps Script execution quotas and runtime limits  
- Google Sheets row and performance limits for very large datasets  
- No offline support in the current Web App  
- No background job scheduler beyond Apps Script triggers  
- No websocket or real-time push support  
- No file streaming; uploads are via Drive and referenced by ID

These limitations are accepted for the current version and inform design choices such as pagination, batching, and efficient range operations.

---

## Testing and Quality Assurance

**Testing levels**

- Unit tests for pure business logic where feasible.  
- Integration tests against a staging Apps Script project and a copy of production sheets with synthetic data.  
- End to end tests for critical flows: Tender → Work Order → Measurement → Bill → Settlement.  
- Manual QA for UI and edge cases.

**Test data**

- Use synthetic, privacy-safe data for CI and staging.  
- Seed scripts are available in `scripts/seed` to populate staging sheets.

**Quality gates**

- PRs must pass linting and tests.  
- Schema changes must be reviewed for backward compatibility.  
- Code reviews must verify `Database.js` usage and audit field handling.

---

## Observability and Operations

**Logging**

- Use `Logger.log` for transient logs and a `system_logs` sheet for persistent logs.  
- Include correlation IDs in logs to trace multi-step operations.

**Monitoring**

- Monitor Apps Script quotas, execution time, and sheet sizes.  
- Track row counts per sheet and alert when thresholds are reached.

**Runbooks**

- Maintain runbooks in `docs/runbooks` for common incidents: quota exhaustion, sheet corruption, deployment rollback, and data recovery.

**Backups**

- Regular exports of critical sheets to Google Drive backups.  
- Backup schedule and retention policy documented in `docs/runbooks`.

---

## AI Developer Guidelines

Every AI agent must follow these rules before making any code changes or suggestions:

1. **Read this document** `PROJECT_CONTEXT.md` first.  
2. **Read `CURRENT_SPRINT.md` and `ARCHITECTURE.md`** for context and sprint priorities.  
3. **Read `CODING_STANDARDS.md`** and follow naming, formatting, and testing rules.  
4. **Never invent architecture** or propose replacing Google Apps Script and Google Sheets as the current runtime and datastore.  
5. **Never create duplicate utilities**. Reuse `Database.js`, `SchemaService.js`, and `libs/`.  
6. **Never access Google Sheets from the UI**. All data access must go through `Database.js`.  
7. **Always update documentation** for any change: module README, `CHANGELOG.md`, and `CURRENT_SPRINT.md`.  
8. **Keep commits atomic** and include tests where applicable.  
9. **Document every architectural decision** in `docs/adr` with rationale and migration plan.  
10. **Follow the Standard Module Template** exactly.

AI agents must treat this repository as a constrained environment and produce code that runs inside Google Apps Script without external dependencies. All AI suggestions must include tests, documentation updates, and an ADR if they affect architecture.

---

## Things AI Must Never Do

Absolute prohibitions for AI agents and automated tools:

- **❌ Replace Bootstrap** or change the UI framework.  
- **❌ Replace Google Sheets** as the datastore without an approved ADR.  
- **❌ Rewrite Database.js** or create a parallel data access layer.  
- **❌ Invent frameworks** or introduce runtime dependencies that cannot run in Apps Script.  
- **❌ Duplicate utilities** that already exist in `Components/` or `Utils.js`.  
- **❌ Create hidden dependencies** or external services without approval.  
- **❌ Change architecture without approval** recorded in an ADR.  
- **❌ Break existing modules** or remove backward compatibility silently.  
- **❌ Skip documentation** for any change.  
- **❌ Modify production data directly** outside of service functions and migration scripts.

Any violation must be reported immediately to the Tech Lead and reverted.

---

## Governance and Architectural Decisions

- All architectural or schema changes must be recorded as an ADR in `docs/adr`.  
- An ADR must include problem statement, proposed change, alternatives, migration plan, rollback plan, and approvals.  
- Small changes that affect only a module still require a short ADR or an entry in `docs/changes` explaining the rationale.

---

## Database and Migration Strategy

**Current datastore**

- **Google Sheets** is the canonical datastore. `Database.js` abstracts sheet operations and is the single point of contact with Sheets. `SchemaService.js` ensures sheets and columns exist and handles safe schema evolution.

**Why Database.js exists**

- To centralize sheet access patterns and make future migrations possible without changing business logic across modules.  
- To provide query helpers, idempotency helpers, and efficient range operations that minimize Apps Script execution time.

**Planned migration path**

If scale or functional needs require migration, the intended path is:

```
Google Sheets
↓
SQLite
↓
PostgreSQL
↓
Cloud hosted relational database
```

**Important migration rules**

- Migrations must preserve business logic and register semantics.  
- `Database.js` must be extended or replaced with a compatible adapter so service code does not change.  
- Any migration requires an ADR, migration plan, and data migration scripts. Do not migrate without explicit approval.

---

## Document System and Ownership

Documents are first-class entities. Every module can own documents and link them to register entries. The Document Register stores metadata and links to files in Google Drive.

**Document types commonly used**

- Tender Notice  
- Bill of Quantities (BOQ)  
- Letter of Award (LOA)  
- Agreement  
- Measurement Book entries and photos  
- Bills and invoices  
- Completion Certificates  
- Correspondence and government letters  
- Audit reports  
- Resolutions and meeting minutes

**Document rules**

- Documents are uploaded via the UI and referenced by Drive ID or URL.  
- Each document entry includes `ownerModule`, `ownerId`, `documentType`, `uploadedBy`, `uploadedAt`, and `tags`.  
- Documents are searchable via metadata and will be the primary input for future OCR and AI features.

---

## Future AI Capabilities

SahakarERP is AI-first in its long-term vision. Planned capabilities include:

- Document OCR to extract structured data from invoices, BOQs, and measurement books  
- Smart Search across registers and documents using semantic search  
- Ask ERP conversational assistant for natural language queries  
- Letter drafting and resolution drafting using templates and register data  
- Auto accounting suggestions that map transactions to chart of accounts  
- Work estimation and tender analysis to highlight risky bids  
- Compliance reminders generated from register data and statutory calendars  
- Meeting minutes generation from structured agendas and notes  
- Knowledge retrieval to surface SOPs and past decisions  
- Voice assistant for field agents to log measurements and expenses hands-free

All AI features must be opt-in, auditable, and subject to human review for legal or financial outputs.

---

## Contacts and Communication

- Engineering Manager and Tech Lead contact details are maintained in `docs/contacts.md`.  
- Use the project Slack or Teams channel for day-to-day communication.  
- Use GitHub Issues for work tracking and pull requests for code review.  
- AI-suggested changes must be posted to `AI/ISSUES` for human triage.

---

## Final Paragraph

SahakarERP is more than software. It is an attempt to preserve and modernize the operational knowledge of Labour Cooperative Societies. Every module should solve a real-world administrative problem while remaining simple enough for cooperative societies to adopt without specialized IT infrastructure.

**One sentence summary**

SahakarERP is intended to become the most comprehensive ERP platform ever built for Labour Cooperative Societies in Maharashtra, preserving institutional knowledge while digitizing every operational process from registration to project completion.