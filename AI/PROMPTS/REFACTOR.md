````markdown
# REFACTOR

Version: 1.0.0

Status: Active

Owner: SahakarERP Core Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document defines the standard process for refactoring code in SahakarERP.

Refactoring is the process of improving code quality **without changing business behaviour**.

Every developer and AI agent must follow this process before modifying existing code.

The objective is to continuously improve maintainability while protecting the stability of the application.

---

# Definition

Refactoring means improving the internal implementation of existing code without changing:

- Business logic
- User experience
- Database behaviour
- API contracts
- Output
- Existing workflows

If functionality changes, it is **not** refactoring.

---

# Refactoring Goals

Every refactoring should improve one or more of the following.

- Readability
- Maintainability
- Reusability
- Performance
- Testability
- Consistency
- Documentation

---

# When Refactoring Is Allowed

Refactoring is encouraged when:

- Duplicate code exists.
- Functions are too large.
- Components are repeated.
- Variable names are unclear.
- Business logic is mixed with UI.
- Database access is duplicated.
- Performance can be improved.
- Code follows an outdated project standard.

---

# When Refactoring Is NOT Allowed

Do NOT refactor if it will:

- Change business behaviour.
- Introduce new architecture.
- Break compatibility.
- Delay sprint objectives.
- Modify database schema unnecessarily.
- Introduce unsupported libraries.
- Affect production stability without approval.

---

# Refactoring Workflow

```
Identify Problem

↓

Review Existing Code

↓

Determine Impact

↓

Architecture Review

↓

Implement Refactor

↓

Testing

↓

Documentation

↓

Git Commit

↓

Deployment

↓

Verification
```

---

# Types of Refactoring

## Code Cleanup

Examples

- Remove dead code
- Remove commented code
- Rename variables
- Rename functions
- Improve formatting

---

## Function Refactoring

Examples

- Split large functions
- Extract helper methods
- Remove nested conditions
- Improve readability

---

## Component Refactoring

Examples

- Extract reusable HTML
- Remove duplicated Bootstrap layouts
- Standardize modals
- Reuse shared components

---

## Service Refactoring

Examples

- Remove duplicated validation
- Move business logic into services
- Simplify workflows

---

## Database Refactoring

Examples

- Improve batch operations
- Reduce Spreadsheet calls
- Cache repeated lookups
- Improve query efficiency

Database behaviour must remain unchanged.

---

## Documentation Refactoring

Examples

- Improve README
- Update Architecture
- Improve comments
- Correct diagrams

---

# Before Refactoring

Complete this checklist.

☐ Read PROJECT_CONTEXT.md

☐ Read ARCHITECTURE.md

☐ Read CODING_STANDARDS.md

☐ Read CURRENT_SPRINT.md

☐ Review existing implementation

☐ Identify duplicated code

☐ Estimate impact

☐ Check dependencies

---

# Refactoring Request Template

```
Refactor ID

Title

Reason

Current Problem

Expected Improvement

Files Affected

Risk Level

Architecture Impact

Testing Required

Documentation Required

Estimated Time
```

---

# Risk Levels

## Low

Formatting

Comments

Variable names

Documentation

---

## Medium

Function extraction

Component extraction

Service cleanup

Performance improvements

---

## High

Database layer

Module loader

Authentication

Schema changes

Shared utilities

High-risk refactoring requires approval.

---

# Refactoring Rules

Always

- Preserve functionality.
- Preserve API contracts.
- Preserve database structure.
- Preserve response format.
- Preserve module interfaces.

Never

- Rewrite working code without reason.
- Introduce breaking changes.
- Mix refactoring with new features.
- Skip testing.

---

# Testing Requirements

Every refactoring must verify:

✓ Existing functionality still works.

✓ No UI regression.

✓ Database operations unchanged.

✓ Response format unchanged.

✓ Existing modules continue working.

---

# Documentation Requirements

After every refactoring update:

- CHANGELOG.md
- CURRENT_SPRINT.md
- CHANGE_REQUESTS.md
- Module README (if applicable)

If architecture changes:

- Create an ADR.

---

# AI Refactoring Checklist

Before writing code verify:

✓ Existing implementation understood.

✓ Duplicate code confirmed.

✓ Existing utilities reviewed.

✓ Existing components reviewed.

✓ Database.js reused.

✓ Bootstrap components reused.

✓ No architecture changes.

✓ No new dependencies.

---

# Code Review Checklist

Reviewer must verify:

✓ No behaviour change.

✓ Code is simpler.

✓ Duplication reduced.

✓ Naming improved.

✓ Documentation updated.

✓ Tests passed.

✓ Performance maintained or improved.

---

# Commit Message Standard

Use:

```
refactor:
```

Examples

```
refactor: simplify Database query helpers

refactor: extract reusable toolbar component

refactor: standardize response handling

refactor: split supplier validation logic
```

---

# AI Response Format

When asked to refactor code, respond with:

```
Current Code Analysis

Problems Identified

Refactoring Plan

Files Affected

Risk Assessment

Testing Strategy

Documentation Updates

Estimated Effort
```

Only begin implementation after completing the analysis.

---

# Examples of Good Refactoring

Good

- Replace duplicated HTML with a reusable component.
- Split a 300-line function into smaller functions.
- Remove repeated validation logic.
- Cache repeated database reads.
- Rename unclear variables.

Bad

- Rewrite Database.js because of coding style preference.
- Replace Bootstrap with another UI framework.
- Change business workflow during cleanup.
- Rename public functions used by other modules without migration.

---

# Final Principles

Refactoring exists to improve the codebase, not to satisfy personal preferences.

The best refactoring is:

- Small
- Safe
- Tested
- Documented
- Easy to review

Every refactoring should leave SahakarERP cleaner, simpler, and easier to maintain than before.
````