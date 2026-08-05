# SAHAKAR ERP
## Project Roadmap

**Project:** Sahakar ERP  
**Repository:** SahakarERP  
**Platform:** Google Apps Script + Google Sheets  
**Status:** Active Development  
**Development Model:** Sprint Based  
**Architecture Owner:** Govinda Parab

---

# 1. Vision

Develop a production-ready ERP for Labour Cooperative Societies (Majur Sahakari Sanstha) that manages the complete lifecycle of government and private works, from tender publication to final settlement, using Google Apps Script and Google Sheets.

Primary goals:

- Easy to maintain
- Modular architecture
- Production-ready
- Suitable for small and medium labour cooperative societies
- Extendable without rewriting existing modules

---

# 2. Technology Stack

Frontend
- HTML
- CSS
- Vanilla JavaScript
- Google Apps Script HTML Service

Backend
- Google Apps Script

Database
- Google Sheets

Version Control
- Git
- GitHub

Deployment
- clasp

IDE
- VS Code

AI Development
- ChatGPT
- ChatGPT Desktop (Codex)

---

# 3. Development Principles

## Never

- Generate placeholder code.
- Duplicate business logic.
- Rewrite working code unnecessarily.
- Hardcode sheet names.
- Hardcode IDs.
- Mix UI and business logic.
- Break backward compatibility without approval.

## Always

- Keep modules independent.
- Reuse Database.js.
- Use Response.js for every backend response.
- Use safeExecute() for backend service methods.
- Keep frontend and backend synchronized.
- Commit after every completed task.
- Test before deployment.

---

# 4. Current Architecture

UI

Main.html

├── Navbar.html

├── Sidebar.html

├── Style.html

└── App.html (Dashboard)

Backend

Code.js

Config.js

Database.js

Response.js

Utils.js

DashboardService.js

SettingsService.js

Modules

Settings.html

SettingsScript.html

Future modules will follow the same pattern.

---

# 5. Current Sprint

Sprint 3

Goal

Convert the framework into a working application.

Tasks

- Fix Response contract
- Connect Dashboard frontend
- Implement Dashboard backend integration
- Sidebar routing
- Connect Settings module
- Stabilize framework

Deliverable

A deployable ERP application with a working Dashboard and accessible Settings module.

---

# 6. Sprint Roadmap

## Sprint 1

Framework

Completed

---

## Sprint 2

Core Infrastructure

Completed

- Config
- Database
- Response
- Utils
- Settings

---

## Sprint 3

Dashboard

In Progress

---

## Sprint 4

Society Master

Planned

Features

- CRUD
- Search
- Validation
- Active / Inactive
- Soft Delete

---

## Sprint 5

Execution Agencies

Planned

---

## Sprint 6

Supplier Master

Planned

---

## Sprint 7

Tender Register

Planned

---

## Sprint 8

Work Orders

Planned

---

## Sprint 9

Execution Assignment

Planned

---

## Sprint 10

Transactions

Planned

---

## Sprint 11

Government Bills

Planned

---

## Sprint 12

GST Purchase Register

Planned

---

## Sprint 13

Settlement Register

Planned

---

## Sprint 14

Reports

Planned

---

## Sprint 15

Production Release

---

# 7. Planned Modules

Masters

- Society Master
- Society Accounts
- Chart of Accounts
- Supplier
- Execution Agency

Projects

- Tender Register
- Work Orders
- Execution Assignment

Accounts

- Transactions
- Government Bills
- GST Purchases
- Settlements

Compliance

- Compliance Register

Documents

- Document Register

Reports

- Dashboard
- Reports

Administration

- Settings

---

# 8. Coding Standards

Naming

Service Files

ModuleNameService.js

Example

SocietyService.js

Frontend

ModuleName.html

Examples

Society.html

Supplier.html

Backend

One service per module.

Database access

Always through Database.js.

Responses

Always through Response.js.

Utilities

Always through Utils.js.

---

# 9. Git Workflow

Every feature must follow:

git add .

git commit -m "type: short description"

git push

clasp push

Deploy

Verify

Commit Types

feat

fix

refactor

docs

style

test

chore

---

# 10. Technical Debt

Current Known Issues

- Dashboard not connected to backend
- Sidebar navigation incomplete
- Response wrapper inconsistency
- Primary key lookup improvements
- ID generation improvements
- Static dashboard
- Missing authentication
- Missing schema migration

---

# 11. Backlog

High Priority

- Live Dashboard
- Society Master
- Routing
- Authentication
- Role Management

Medium Priority

- Search optimization
- Caching
- Reports
- Audit Logs

Low Priority

- Dark Mode
- Export Templates
- Notifications

---

# 12. Release Strategy

Every Sprint must end with:

✔ Working application

✔ Git Commit

✔ GitHub Push

✔ clasp Push

✔ Deployment

✔ Verification

No sprint is complete until the deployed application works.

---

# 13. AI Instructions

Every AI agent working on this repository must:

1. Read this document first.
2. Preserve existing architecture.
3. Avoid unnecessary rewrites.
4. Deliver production-ready code.
5. Prefer incremental improvements.
6. Explain breaking changes before implementing them.
7. Keep frontend and backend synchronized.
8. Never introduce placeholder code unless explicitly requested.

---

# 14. Success Criteria

The project will be considered Version 1.0 when:

- All planned modules are functional.
- Dashboard is fully dynamic.
- Authentication is implemented.
- Role-based access is available.
- Reports are operational.
- Google Sheets schema is stable.
- Deployment is repeatable.
- Source code is fully documented.
- Application is suitable for daily production use.

---

**Last Updated:** 06-Aug-2026

**Maintainer:** Govinda Parab

**Status:** Active Development