````markdown
# CODE_REVIEW

Version: 1.0.0

Status: Active

Owner: SahakarERP Core Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the mandatory code review process for SahakarERP.

Every Pull Request, AI-generated change, bug fix, feature, refactoring, documentation update, and architectural modification must undergo a structured review before merging.

The objective is to maintain a consistent, maintainable, secure, and high-quality codebase.

---

# Code Review Philosophy

A code review is **not** about finding fault with the developer.

Its purpose is to ensure that every contribution:

- follows the architecture
- follows coding standards
- maintains consistency
- prevents technical debt
- preserves long-term maintainability

The reviewer is reviewing the **code**, not the developer.

---

# Review Workflow

```
Implementation

↓

Self Review

↓

Documentation Review

↓

Architecture Review

↓

Code Review

↓

Testing

↓

Approval

↓

Merge

↓

Deployment

↓

Verification
```

---

# Scope

The following must always be reviewed.

- New Features
- Bug Fixes
- Refactoring
- UI Changes
- Database Changes
- Documentation
- Components
- Services
- Validation
- Configuration
- Architecture

No exception.

---

# Reviewer Responsibilities

The reviewer must verify

✓ Business requirements

✓ Architecture

✓ Coding standards

✓ Security

✓ Performance

✓ Documentation

✓ Testing

✓ Maintainability

---

# Review Levels

## Level 1

Minor

Examples

- Documentation
- Comments
- Typo fixes

---

## Level 2

Normal

Examples

- New module
- New component
- UI changes
- Validation

---

## Level 3

Critical

Examples

- Database.js
- SchemaService.js
- ModuleLoader.js
- Authentication
- Architecture

Requires Architecture Review.

---

# Architecture Checklist

Verify

☐ Module structure followed

☐ Uses Database.js

☐ Uses SchemaService.js

☐ Uses ModuleLoader.js

☐ No duplicated architecture

☐ No unsupported framework

☐ No direct SpreadsheetApp access

☐ Components reused

☐ Bootstrap used consistently

---

# Business Checklist

Verify

☐ Business workflow preserved

☐ Register philosophy maintained

☐ Validation rules correct

☐ No business logic lost

☐ Naming meaningful

☐ Workflow matches PROJECT_CONTEXT.md

---

# UI Checklist

Verify

☐ Bootstrap 5 only

☐ Responsive

☐ No inline CSS

☐ No inline JavaScript

☐ Reusable components

☐ Accessibility considered

☐ Consistent layout

☐ Loading states

☐ Error states

☐ Empty states

---

# Service Checklist

Verify

☐ Business logic only

☐ No HTML generation

☐ Uses Database.js

☐ Proper validation

☐ Error handling

☐ Logging

☐ Audit fields maintained

---

# Database Checklist

Verify

☐ Database.js reused

☐ Batch operations

☐ No duplicate queries

☐ No unnecessary reads

☐ No unnecessary writes

☐ Schema unchanged unless approved

☐ IDs generated correctly

---

# Component Checklist

Verify

☐ Generic

☐ Reusable

☐ Configurable

☐ No module-specific code

☐ Proper documentation

☐ Bootstrap styling

---

# Security Checklist

Verify

☐ Inputs validated

☐ Permissions checked

☐ Sensitive data protected

☐ No exposed internals

☐ Soft delete respected

☐ Audit logging present

---

# Performance Checklist

Verify

☐ Efficient loops

☐ Batch Sheet access

☐ Lazy loading

☐ Minimal DOM manipulation

☐ No duplicated calculations

---

# Documentation Checklist

Verify updates to

☐ CURRENT_SPRINT.md

☐ CHANGELOG.md

☐ CHANGE_REQUESTS.md

☐ Module README

☐ Architecture (if required)

☐ ADR (if required)

---

# Testing Checklist

Verify

☐ Feature tested

☐ Existing functionality unaffected

☐ Regression testing completed

☐ Manual testing completed

☐ Error scenarios tested

---

# AI Review Checklist

When reviewing AI-generated code verify

☐ AI documentation was followed

☐ Existing code reused

☐ No duplicated utilities

☐ No invented architecture

☐ No unsupported libraries

☐ Component standards followed

☐ Standard Module Template followed

---

# Common Review Comments

Examples

### Good

- Excellent reuse of existing components.
- Validation follows project standards.
- Database access correctly centralized.

### Needs Improvement

- Extract duplicated logic.
- Move business logic to service.
- Reuse existing component.
- Improve naming.
- Add documentation.
- Improve validation.

---

# Review Decision

Choose one.

## Approved

Ready to merge.

---

## Approved With Suggestions

Can merge.

Suggestions can be addressed later.

---

## Changes Requested

Must be corrected before merge.

---

## Rejected

Architecture or implementation unacceptable.

Major redesign required.

---

# Merge Checklist

Before merging verify

☐ Review completed

☐ Documentation updated

☐ Tests passed

☐ Git history clean

☐ No merge conflicts

☐ Sprint updated

☐ Change request updated

---

# AI Review Response Format

When an AI agent reviews code it should produce

```
Summary

Architecture Review

Code Quality

Performance

Security

Documentation

Testing

Risks

Recommendations

Final Decision
```

---

# Severity Levels

Critical

Project cannot merge.

Examples

- Broken architecture
- Data loss
- Security issue

---

High

Must fix before merge.

Examples

- Incorrect validation
- Database issue
- Broken workflow

---

Medium

Should fix.

Examples

- Duplicated code
- Poor naming
- Documentation missing

---

Low

Optional improvements.

Examples

- Formatting
- Minor optimization
- Better comments

---

# Metrics

Track review quality.

Total Reviews

Approved

Approved with Suggestions

Changes Requested

Rejected

Average Review Time

Documentation Compliance

Architecture Compliance

---

# Final Principles

A successful review leaves the codebase:

- Cleaner
- Safer
- Better documented
- Easier to understand
- Easier to maintain

Every review should protect the long-term vision of SahakarERP.

Quality is more important than speed.

Consistency is more important than personal coding style.

Every merged change should make SahakarERP better than it was before.
````