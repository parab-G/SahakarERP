# FEATURE_REQUEST

Version: 1.0.0

Status: Active

Owner: SahakarERP Core Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document is the standard prompt template for requesting a **new feature** in SahakarERP.

Every AI agent must use this template before implementing any new feature.

The objective is to ensure that every feature follows the same architecture, coding standards, documentation process, and review workflow.

Never start coding a feature without first completing this document.

---

# Feature Request Workflow

```
Business Requirement

↓

Feature Request

↓

Architecture Review

↓

Sprint Assignment

↓

Implementation

↓

Testing

↓

Documentation

↓

Review

↓

Deployment

↓

Release
```

---

# Instructions for AI Agents

Before writing any code you MUST read:

- AI/PROJECT_CONTEXT.md
- AI/ARCHITECTURE.md
- AI/CODING_STANDARDS.md
- AI/CURRENT_SPRINT.md

Understand the existing architecture before proposing any solution.

Never invent new architecture.

Never duplicate existing functionality.

Always reuse existing components and services.

---

# Feature Request Template

Copy everything below for every new feature request.

---

## Feature Title

Provide a short and descriptive title.

Example

```
Supplier Master Module
```

---

## Business Objective

Explain why this feature is needed.

Describe the business problem it solves.

Do not explain technical implementation.

---

## Business Value

Examples

- Reduce manual work
- Improve reporting
- Increase audit compliance
- Improve data quality
- Eliminate duplicate entries
- Simplify workflow

---

## Module Category

Choose one.

- Master
- Operations
- Management
- Reports
- Administration
- AI
- Components
- Infrastructure

---

## Priority

Choose one.

- Critical
- High
- Medium
- Low

---

## Dependencies

List existing modules required.

Example

```
Society Master

Chart of Accounts

Database.js

SchemaService.js
```

---

## Expected User Roles

Who will use this feature?

Example

- Administrator
- Chairman
- Secretary
- Accountant
- Office Staff

---

## Functional Requirements

Describe every function expected.

Example

- Create
- Edit
- Delete
- Search
- Filter
- Export
- Print

---

## Validation Rules

List validation requirements.

Example

- Supplier Name mandatory.
- GST Number unique.
- Mobile Number optional.
- PAN format validation.

---

## Required Database Changes

Specify

New Sheet

Existing Sheet

New Columns

Indexes

Relationships

If none

Write

```
No database changes required.
```

---

## Required Components

Select reusable UI components.

Example

- Card
- Toolbar
- Search Box
- Data Table
- Modal
- Pagination
- Alert

---

## Expected Files

List files expected.

Example

```
Modules/Supplier/

Supplier.html

SupplierScript.html

SupplierService.js

SupplierSchema.js

SupplierValidation.js

README.md
```

---

## Reports Impact

Will this affect reports?

Yes

No

If yes

List affected reports.

---

## Security Requirements

Examples

- Administrator only.
- Read-only access.
- Role-based permissions.
- Audit logging required.

---

## Performance Requirements

Examples

- Support 10,000+ records.
- Lazy loading.
- Batch operations.
- Cached lookups.

---

## Acceptance Criteria

Feature is complete only if

- Business requirements satisfied.
- Validation implemented.
- Documentation updated.
- Components reused.
- No duplicated code.
- Bootstrap compliant.
- Tested successfully.

---

## Testing Requirements

List required testing.

Example

- Unit Testing
- Integration Testing
- Manual Testing
- User Acceptance Testing

---

## Documentation Updates

Must update

- CURRENT_SPRINT.md
- CHANGELOG.md
- Module README
- CHANGE_REQUESTS.md

---

## Git Requirements

Commit format

```
feat:

Example

feat: add Supplier Master module
```

---

## AI Self Review Checklist

Before submitting verify

✓ Read AI documentation

✓ Existing module reviewed

✓ Existing components reused

✓ Existing services reused

✓ No duplicated code

✓ Bootstrap 5 only

✓ No inline CSS

✓ No inline JavaScript

✓ Documentation updated

✓ Tests completed

---

# Example Feature Request

Feature

Supplier Master

Category

Master

Priority

High

Business Objective

Maintain supplier information used across work orders and purchases.

Dependencies

Database.js

SchemaService.js

Toolbar Component

Data Table Component

Search Component

Expected Files

Supplier.html

SupplierScript.html

SupplierService.js

SupplierSchema.js

SupplierValidation.js

README.md

Acceptance

CRUD operations complete.

Duplicate supplier prevention.

GST validation.

Search enabled.

Audit fields maintained.

Documentation updated.

---

# AI Response Format

When an AI agent receives a feature request, it should respond with:

```
Feature Analysis

Business Understanding

Architecture Impact

Modules Affected

Files To Create

Files To Modify

Dependencies

Implementation Plan

Testing Plan

Documentation Updates

Estimated Effort

Approval Required
```

Coding should begin only after this analysis.

---

# Final Statement

Every feature in SahakarERP must begin with a Feature Request.

A clear feature request leads to better architecture, better implementation, fewer bugs, and easier maintenance.

Think first.

Design second.

Code third.

Document always.