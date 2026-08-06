# CODING_STANDARDS

Version: 1.0.0

Status: Approved

Owner: SahakarERP Core Team

Last Updated: 2026-08-06

---

# Purpose

This document defines the coding standards for SahakarERP.

Every developer, AI coding agent, contributor, and maintainer must follow these standards. Consistent code is easier to understand, review, maintain, and extend.

These standards are mandatory unless an approved Architecture Decision Record (ADR) specifies otherwise.

---

# Core Principles

Every line of code should follow these principles.

- Simplicity over cleverness
- Readability over brevity
- Reusability over duplication
- Consistency over personal preference
- Maintainability over speed
- Documentation before implementation

When multiple solutions exist, choose the one that is easiest for another developer to understand.

---

# Golden Rules

- Never duplicate code.
- Never hardcode values that belong in Config.js.
- Never bypass Database.js.
- Never access Google Sheets from UI code.
- Never mix UI and business logic.
- Never modify architecture without an ADR.
- Always update documentation with every feature.
- Always write reusable code.
- Always think module-first.

---

# File Naming Standards

HTML Templates

```
Module.html
```

Client Script

```
ModuleScript.html
```

Service

```
ModuleService.js
```

Schema

```
ModuleSchema.js
```

Validation

```
ModuleValidation.js
```

Documentation

```
README.md
```

---

# Folder Naming

Use PascalCase.

Correct

```
Modules/
Components/
Reports/
Documents/
```

Incorrect

```
modules/
components_new/
My Folder/
```

---

# Variable Naming

Use camelCase.

Correct

```javascript
workOrderId
supplierName
gstAmount
```

Incorrect

```javascript
work_order
Supplier_Name
temp
```

---

# Function Naming

Functions should describe what they do.

Correct

```javascript
createSupplier()

updateWorkOrder()

calculateGST()

loadDashboard()
```

Avoid

```javascript
doWork()

run()

temp()

abc()
```

---

# Constant Naming

Use UPPER_CASE.

```javascript
MAX_ROWS

DEFAULT_PAGE_SIZE

GST_RATE

APP_VERSION
```

---

# Boolean Naming

Always use meaningful prefixes.

```javascript
isActive

hasPermission

canEdit

shouldReload
```

Avoid

```javascript
flag

status

value
```

---

# ID Standards

Every record requires a unique ID.

Pattern

```
SOC-000001

SUP-000001

WO-000001

TEN-000001
```

IDs are generated only by Utils.js.

Never generate IDs manually.

---

# Comments

Comment WHY.

Not WHAT.

Good

```javascript
// Prevent duplicate suppliers during import.
```

Bad

```javascript
// Increment i
i++;
```

---

# Function Length

Ideal

20–40 lines.

Maximum

100 lines.

If longer,

split into helper functions.

---

# Function Responsibilities

One function.

One responsibility.

Correct

```javascript
createSupplier()

validateSupplier()

saveSupplier()
```

Incorrect

```javascript
createSupplierAndPrintAndEmailAndExport()
```

---

# HTML Standards

Use semantic HTML.

Prefer

```
section

header

main

footer

nav

article
```

Avoid unnecessary div nesting.

---

# Bootstrap Rules

Use Bootstrap 5.

Prefer utilities.

Example

```
container-fluid

row

col

mb-3

d-flex

gap-2
```

Avoid custom CSS unless absolutely necessary.

---

# CSS Rules

No inline CSS.

Wrong

```html
<div style="color:red">
```

Correct

```html
<div class="text-danger">
```

If custom styling is needed,

place it in the component stylesheet.

---

# JavaScript Rules

No inline JavaScript.

Wrong

```html
<button onclick="save()">
```

Correct

```javascript
button.addEventListener(...)
```

---

# Component Rules

Components must

Be reusable

Be configurable

Contain no business logic

Contain no module-specific code

Support accessibility

Support Bootstrap themes

---

# Module Rules

Every module must include

```
Module.html

ModuleScript.html

ModuleService.js

ModuleSchema.js

ModuleValidation.js

README.md
```

No exceptions.

---

# Database Rules

Only Database.js may access

SpreadsheetApp

Sheet

Range

Spreadsheet

No other file may directly interact with Google Sheets.

---

# Service Rules

Services contain

Business logic

Validation

Permissions

CRUD

Workflow

Services never manipulate HTML.

---

# UI Rules

UI is responsible for

Displaying information

Collecting user input

Calling Services

Displaying responses

UI never performs business calculations.

---

# Validation Rules

Validation occurs

Client

↓

Server

Server validation is mandatory.

Client validation is for user experience only.

---

# Response Standards

Every server function returns

Success

```javascript
{
success:true,
data:{}
}
```

Failure

```javascript
{
success:false,
code:"",
message:""
}
```

Never return raw exceptions.

---

# Error Handling

Catch errors.

Log errors.

Return friendly messages.

Never expose

Stack traces

Sheet IDs

Internal APIs

---

# Logging Standards

Temporary

```javascript
Logger.log()
```

Persistent

system_logs sheet

Every critical log includes

Timestamp

Module

User

Action

Result

---

# Performance Rules

Batch reads.

Batch writes.

Avoid repeated loops.

Avoid repeated Sheet access.

Cache expensive operations.

Lazy load modules.

---

# Security Rules

Never trust client data.

Always validate permissions.

Never expose confidential data.

Soft delete records.

Use audit fields.

---

# Documentation Rules

Every feature must update

README.md

CHANGELOG.md

CURRENT_SPRINT.md

Module README

if applicable.

Documentation is part of the feature.

---

# Git Commit Standards

Commit messages

```
feat:

fix:

docs:

refactor:

style:

test:

chore:
```

Examples

```
feat: add Supplier Register

fix: correct GST calculation

docs: update architecture

refactor: simplify Database helpers
```

---

# Pull Request Rules

Every PR must include

Purpose

Files changed

Screenshots (if UI)

Testing performed

Documentation updated

Related issue

---

# Code Review Checklist

Reviewer verifies

✓ No duplicated code

✓ Uses Database.js

✓ Bootstrap 5 only

✓ No inline CSS

✓ No inline JavaScript

✓ Documentation updated

✓ Naming conventions followed

✓ Validation implemented

✓ Error handling included

✓ Logging included

---

# AI Coding Rules

Before writing code an AI agent must

Read

PROJECT_CONTEXT.md

ARCHITECTURE.md

CODING_STANDARDS.md

CURRENT_SPRINT.md

AI/README.md

Then

Understand existing code.

Reuse existing utilities.

Reuse Components.

Reuse Services.

Never invent architecture.

Never duplicate code.

Never introduce unsupported libraries.

---

# Refactoring Rules

Refactor only when

It improves readability

It removes duplication

It improves performance

It does not change behavior

Large refactors require approval.

---

# Deprecated Code

Never delete immediately.

Mark

```javascript
// Deprecated
```

Update documentation.

Remove only after approval.

---

# Code Quality Goals

Every file should be

Simple

Readable

Consistent

Reusable

Documented

Maintainable

Predictable

---

# Final Principles

Write code for the next developer.

Optimize for clarity.

Prefer explicit code over clever code.

Every module should look like every other module.

Consistency is more valuable than individual coding style.

When in doubt,

follow the existing architecture rather than inventing a new pattern.