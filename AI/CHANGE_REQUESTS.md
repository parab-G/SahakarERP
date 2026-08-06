# CHANGE_REQUESTS

Version: 1.0.0

(To be completed# CHANGE_REQUESTS

Version: 1.0.0

Status: Active

Owner: SahakarERP Core Team

Last Updated: YYYY-MM-DD

---

# Purpose

This document is the official register for all proposed, approved, implemented, rejected, and deferred changes in SahakarERP.

Every significant change to the project must be recorded here before implementation.

This document provides traceability between ideas, discussions, implementation, architecture decisions, commits, and releases.

No architectural or business-critical change should be implemented without first creating an entry in this document.

---

# Change Workflow

Every change follows this lifecycle.

```
Idea

↓

Discussion

↓

Change Request

↓

Architecture Review

↓

Approval

↓

Sprint Planning

↓

Implementation

↓

Testing

↓

Deployment

↓

Verification

↓

Closed
```

---

# Change Categories

Every request must belong to one of the following categories.

## Feature

New functionality.

Examples

- Supplier Module
- Document Management
- AI Search

---

## Enhancement

Improvement to an existing feature.

Examples

- Better Dashboard
- Faster Database Queries
- Improved Search

---

## Bug Fix

Correction of incorrect behaviour.

Examples

- Wrong GST calculation
- Duplicate ID generation
- Navigation issue

---

## Refactoring

Internal improvement without changing behaviour.

Examples

- Database optimization
- Component extraction
- Code cleanup

---

## Documentation

Documentation only.

Examples

- Architecture update
- README improvements
- Sprint documentation

---

## Performance

Performance improvements.

Examples

- Batch reads
- Lazy loading
- Component caching

---

## Security

Security improvements.

Examples

- Permission checks
- Input validation
- Authentication

---

## Architecture

Changes affecting project architecture.

Examples

- Folder restructuring
- Database abstraction
- Module framework

Architecture changes require an ADR.

---

# Request Status

Every request must have one of these statuses.

| Status | Meaning |
|---------|---------|
| Proposed | Newly submitted |
| Under Review | Being discussed |
| Approved | Ready for implementation |
| In Progress | Work has started |
| Testing | Under verification |
| Completed | Successfully delivered |
| Deferred | Postponed |
| Rejected | Not accepted |
| Cancelled | No longer required |

---

# Priority Levels

| Priority | Meaning |
|----------|---------|
| Critical | Must be completed immediately |
| High | Important |
| Medium | Planned work |
| Low | Nice to have |

---

# Change Request Template

Copy this template for every new request.

```
Change ID:

Title:

Category:

Priority:

Requested By:

Date:

Status:

Current Sprint:

Description:

Business Reason:

Technical Impact:

Files Expected To Change:

Architecture Impact:

Requires ADR:

Dependencies:

Assigned To:

Testing Required:

Documentation Required:

Estimated Effort:

Notes:
```

---

# Active Change Requests

---

## CR-0001

Title

AI Developer Kit

Category

Documentation

Priority

Critical

Status

Completed

Sprint

4.1

Description

Create documentation allowing AI agents to understand SahakarERP before writing code.

Result

Completed successfully.

---

## CR-0002

Title

Reusable UI Framework

Category

Architecture

Priority

Critical

Status

Approved

Sprint

4.2

Description

Develop reusable Bootstrap components for all ERP modules.

Architecture Impact

Yes

Requires ADR

No

Assigned To

Pending

---

# Completed Change Requests

Move completed requests here after verification.

---

# Deferred Requests

Move postponed requests here.

Example

```
CR-0012

Offline Support

Deferred

Reason

Planned after Version 1.0
```

---

# Rejected Requests

Record rejected ideas for historical reference.

Template

```
Change ID

Reason

Decision Date

Approved By
```

Never delete rejected requests.

---

# Emergency Changes

Emergency production fixes must also be recorded.

Required Information

- Incident Number
- Root Cause
- Resolution
- Verification
- Preventive Action

---

# Architecture Review Checklist

Before approving a change verify

✓ Architecture remains consistent

✓ Database.js is reused

✓ Components are reusable

✓ No duplicated code

✓ Documentation updated

✓ Naming conventions followed

✓ Testing planned

✓ No unsupported libraries

---

# AI Review Checklist

Every AI agent must verify

✓ PROJECT_CONTEXT.md read

✓ ARCHITECTURE.md read

✓ CODING_STANDARDS.md read

✓ CURRENT_SPRINT.md read

✓ Existing code reviewed

✓ Duplicate functionality checked

✓ Documentation updated

---

# Implementation Checklist

Before implementation

☐ Approved

☐ Assigned

☐ Dependencies resolved

☐ Architecture reviewed

☐ Sprint assigned

After implementation

☐ Tested

☐ Documentation updated

☐ Git committed

☐ Git pushed

☐ clasp deployed

☐ Verified

---

# Change Log Reference

Every completed request should reference

Git Commit

GitHub Pull Request

Sprint

Release Version

ADR (if applicable)

Example

```
Commit

abc123

Sprint

4.2

Version

1.0.0

ADR

ADR-005
```

---

# AI Handover Notes

Every AI agent completing a change request should append a note.

Template

```
Agent

Task Completed

Files Modified

Issues Found

Recommendations

Next Suggested Task
```

Do not overwrite previous notes.

Append only.

---

# Metrics

Track overall project improvements.

| Metric | Value |
|---------|------|
| Total Requests | 0 |
| Completed | 0 |
| In Progress | 0 |
| Deferred | 0 |
| Rejected | 0 |

Update these values after every sprint.

---

# Governance Rules

Every significant project change must have a Change Request.

Every architectural change must have an ADR.

Every completed change must reference a Git commit.

Every implemented change must update

- CHANGELOG.md
- CURRENT_SPRINT.md
- Relevant module documentation

---

# Final Statement

CHANGE_REQUESTS.md is the permanent history of why SahakarERP changed.

Source code explains **how** something works.

Architecture explains **where** it belongs.

CHANGE_REQUESTS.md explains **why** it exists.

Never delete historical change requests.

Preserve the complete decision history of the project.