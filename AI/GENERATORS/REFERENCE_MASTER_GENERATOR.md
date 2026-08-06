# Reference Master Generator — End-to-End Process

Purpose

Defines the canonical generation pipeline for Reference Masters (small lookup modules) used by AI agents.

Overview

Input → Business Rules → Schema → Validation → Service → UI (optional) → Review → Approval → Integration → Documentation → Release

Workflow (detailed)

1. Input: business requirements, field list, dropdowns, uniqueness rules, relationships.
2. Business Rules: formalize required uniqueness, defaults, soft-delete, audit, system records.
3. Schema: produce <Module>Schema.js following REFERENCE_SCHEMA_STANDARD.md (metadata, fields, indexes, dropdowns).
4. Validation: create SahakarValidation.<Module> with pure validators (validateField, validateRecord, validateCreate, validateUpdate, validateDelete).
5. Service: implement <Module>Service.js using Database.js + Response.js, call validators, enforce DB-level rules (uniqueness), populate audit fields.
6. UI (optional): lightweight page using reusable components per REFERENCE_UI_STANDARD.md. Client functions call server wrappers exposed by ModuleLoader.
7. Review: run MASTER_MODULE_CHECKLIST.md and MASTER_MODULE_REVIEW.md. Fix failures.
8. Approval: Owner + QA sign-off.
9. Integration: register service in ModuleLoader, add schema to SahakarSchemas, register UI routes if present.
10. Documentation: update module README.md and AI/GENERATORS MASTER_MODULE_EXAMPLE.md.
11. Release: tag docs, update AI/CURRENT_SPRINT.md and changelog.

Flow diagram (ASCII)

Input
  |
  v
Business Rules --> Schema --> Validation --> Service --> UI (optional)
                               |               |
                               v               v
                            Review <-------- Integration
                               |
                               v
                            Release

Quality gates

- Validation unit tests (no DB)
- Service integration tests (mock Database)
- UI accessibility & responsiveness checks
- Checklist: MASTER_MODULE_CHECKLIST.md

Notes for AI agents

- Never modify existing modules unless requested.
- Keep validation pure; service enforces DB concerns.
- Follow naming & folder standards in MASTER_MODULE_NAMING.md and MASTER_MODULE_FOLDER_STRUCTURE.md.
