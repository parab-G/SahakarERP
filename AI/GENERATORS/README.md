# AI Development Kit — Generators

Purpose

This folder contains the official AI Development Kit for generating SahakarERP modules. It is the single source of truth for any AI agent or developer automating module creation.

Contents

- REFERENCE_MASTER_GENERATOR.md — end-to-end generation workflow for reference masters
- MASTER_MODULE_TEMPLATE.md — canonical module template and file responsibilities
- MASTER_MODULE_CHECKLIST.md — pre-release checklist every generated module must pass
- MASTER_MODULE_REVIEW.md — official review criteria and sign-off process
- MASTER_MODULE_PROMPT.md — canonical prompt AI must use (with placeholders)
- MASTER_MODULE_EXAMPLE.md — UnitMaster example implementing the standards
- MASTER_MODULE_LIFECYCLE.md — lifecycle stages and ASCII diagrams
- MASTER_MODULE_DECISION_TREE.md — decision trees for generation choices
- MASTER_MODULE_NAMING.md — naming conventions
- MASTER_MODULE_FOLDER_STRUCTURE.md — folder layout norms
- MASTER_MODULE_ARCHITECTURE.md — layer responsibilities and integrations
- MASTER_MODULE_TESTING.md — testing guidance and checklists
- MASTER_MODULE_ANTI_PATTERNS.md — mistakes to avoid

How AI agents should use this kit

1. Read README.md and MASTER_MODULE_PROMPT.md.
2. Use MASTER_MODULE_TEMPLATE.md to scaffold files.
3. Validate with MASTER_MODULE_CHECKLIST.md and tests in MASTER_MODULE_TESTING.md.
4. Submit for review using MASTER_MODULE_REVIEW.md.

Recommended sequence

Requirements → Schema → Validation → Service → UI → Tests → Review → Release

Review workflow

Peer review → QA tests → Accessibility check → Release approval (owner + QA)
