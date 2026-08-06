# BUG_REPORT.md

## Purpose

This prompt is used when a bug has been discovered but has **not yet been investigated or fixed**.

Its purpose is to create a complete, reproducible bug report that any developer or AI agent can later use to diagnose and resolve the issue.

This document should never modify code.

Its responsibility ends after creating a high-quality bug report.

---

# Instructions

You are working on the SahakarERP project.

Before doing anything:

1. Read:
   - AI/PROJECT_CONTEXT.md
   - AI/ARCHITECTURE.md
   - AI/CODING_STANDARDS.md
   - AI/CURRENT_SPRINT.md

Do NOT fix the bug.

Do NOT refactor code.

Do NOT create new features.

Only investigate and document.

---

# Required Output

Create a bug report containing the following sections.

---

## 1. Summary

Short description of the problem.

Example

> Supplier list does not refresh after creating a new supplier.

---

## 2. Module

Which module is affected?

Examples

- Dashboard
- Supplier
- Tender Register
- Work Orders
- Settings

---

## 3. Severity

Choose one.

Critical

High

Medium

Low

---

## 4. Type

Choose one.

UI

Validation

Logic

Database

Performance

Security

Apps Script

Google Sheets

Integration

Documentation

Other

---

## 5. Environment

Example

Production

Development

Google Chrome

Firefox

Mobile

Desktop

---

## 6. Steps to Reproduce

Provide numbered steps.

Example

1. Open Supplier Module

2. Click Add Supplier

3. Save supplier

4. Observe supplier list

---

## 7. Expected Result

Describe expected behaviour.

---

## 8. Actual Result

Describe actual behaviour.

---

## 9. Root Cause

If known.

Otherwise write

Unknown

Do NOT guess.

---

## 10. Files Involved

List possible files.

Example

SupplierService.js

Supplier.html

Database.js

---

## 11. Screenshots

Mention screenshots or logs if available.

---

## 12. Suggested Fix

Optional.

Keep short.

Do not implement.

---

## 13. Related Issues

Reference any known issue numbers.

---

## 14. Regression Risk

Low

Medium

High

---

## 15. Notes

Additional observations.

---

# Deliverables

Create

AI/ISSUES/ISSUE-XXXX.md

using

AI/ISSUES/ISSUE_TEMPLATE.md

Fill every section.

---

# Rules

Never modify code.

Never modify documentation.

Never update CURRENT_SPRINT.md.

Never close the issue.

Never commit changes.

Do not speculate.

If evidence is insufficient,

write

UNKNOWN

instead of guessing.

---

# Completion Checklist

☐ Bug reproduced

☐ Evidence collected

☐ Severity assigned

☐ Issue documented

☐ Files identified

☐ Issue created

☒ Code modified (must remain unchecked)

☒ Issue closed (must remain unchecked)

---

# Success Criteria

Another developer or AI agent should be able to resolve the issue using only this report without needing additional clarification.