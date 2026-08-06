# Master Module Prompt (Canonical)

Use this prompt as the canonical starting point for every AI-driven module generation. Replace placeholders with specific values.

--- PROMPT START ---
Task: Generate a SahakarERP master module

ModuleName: {{ModuleName}} (e.g., SupplierMaster)
Purpose: {{Short description of purpose}}
Business Fields:
  - {{FieldName}}: {{type}} (required|optional) — {{validation}}
  - ...
Dropdowns:
  - {{field}}: ["a","b","c"]
Business Rules:
  - Uniqueness: {{field(s)}}
  - Soft delete: true
  - Special rules: {{e.g., only one active, dependent uniqueness}}
Relationships:
  - References: {{ModuleName}} -> {{OtherModule}} by {{Field}}
Validation:
  - Patterns, numeric rules, date rules
UI Requirements:
  - Use components: Toolbar, SearchBox, DataTable, Modal, Alert, Spinner
  - Columns to display: {{list}}
  - Actions: create, edit, soft delete, restore
Tests:
  - Unit tests for validation
  - Integration tests for service
Deliverables:
  - README.md
  - {{ModuleName}}Schema.js
  - {{ModuleName}}Validation.js
  - {{ModuleName}}Service.js
  - Optional UI files: {{ModuleName}}.html, {{ModuleName}}Script.html
  - Tests skeleton
Constraints:
  - No inline CSS or inline JS
  - Use Database.js for persistence
  - Return Response.js objects

Review requirements:
  - Pass MASTER_MODULE_CHECKLIST.md
  - Peer review + QA

--- PROMPT END ---

Notes for AI agents

- Always validate the prompt fields for ambiguity before scaffolding.
- Ask clarifying questions when business rules are unclear.
- Produce concise diffs and a summary of created files for review.