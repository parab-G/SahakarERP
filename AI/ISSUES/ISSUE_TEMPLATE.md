````markdown
# ISSUE_TEMPLATE

Version: 1.0.0

Status: Active

Owner: SahakarERP Core Team

Last Updated: YYYY-MM-DD

---

# Purpose

This template is the standard format for reporting, tracking, and resolving issues in SahakarERP.

It is used by:

- Human Developers
- AI Coding Agents
- Testers
- Project Maintainers

Every issue should contain sufficient information for another developer or AI agent to understand, reproduce, investigate, and resolve the problem without additional clarification.

---

# Issue Types

Choose one.

- 🐞 Bug
- ✨ Feature Request
- 🚀 Enhancement
- ♻️ Refactoring
- 📚 Documentation
- ⚡ Performance
- 🔒 Security
- 🏗 Architecture
- 🧪 Testing
- ❓ Question

---

# Priority

Choose one.

- Critical
- High
- Medium
- Low

---

# Status

Choose one.

- Open
- Under Review
- Approved
- In Progress
- Testing
- Blocked
- Completed
- Deferred
- Closed

---

# Issue Information

Issue ID

```
ISS-0001
```

Title

```
Short descriptive title
```

Issue Type

```
Bug / Feature / Enhancement / etc.
```

Priority

```
High
```

Status

```
Open
```

Sprint

```
Sprint 4.2
```

Reported By

```
Developer / AI Agent
```

Assigned To

```
Developer / AI Agent
```

Reported On

```
YYYY-MM-DD
```

---

# Business Context

Describe why this issue matters.

Questions to answer:

- What business process is affected?
- Which users are affected?
- What is the expected outcome?

---

# Problem Description

Provide a clear description.

Explain

- What happened?
- What should happen?
- What actually happened?

---

# Steps To Reproduce

Example

1. Open Society Master.
2. Click Add Society.
3. Enter valid details.
4. Click Save.
5. Observe duplicate record.

---

# Expected Behaviour

Describe the correct behaviour.

---

# Actual Behaviour

Describe the observed behaviour.

---

# Screenshots

Attach screenshots if available.

Example

```
screenshots/
duplicate_supplier.png
```

---

# Related Module

Example

```
Society Master
```

---

# Related Files

List expected files involved.

Example

```
Modules/Society/

Society.html

SocietyScript.html

SocietyService.js

Database.js

SchemaService.js
```

---

# Possible Root Cause

If known, describe the likely cause.

Otherwise write

```
Unknown
```

---

# Impact Analysis

Affected Areas

Examples

- UI
- Database
- Reports
- Dashboard
- Documents
- Navigation

Business Impact

Examples

- Cannot save records
- Incorrect calculations
- Audit risk
- User confusion

---

# Dependencies

Does this issue depend on another issue?

Example

```
ISS-0004
```

Or

```
None
```

---

# Architecture Impact

Choose one.

```
None
```

```
Minor
```

```
Major
```

If Major

Create an ADR before implementation.

---

# Proposed Solution

Describe the preferred solution.

Do not write code.

Explain the implementation approach.

---

# AI Investigation Notes

This section is completed by the AI agent.

Example

```
Root Cause

Existing Code Reviewed

Files To Modify

Risk Level

Recommended Solution
```

---

# Developer Notes

Developers can record

- Observations
- Assumptions
- Decisions
- Discussions

Append notes.

Do not overwrite previous notes.

---

# Testing Plan

Required tests

☐ Reproduce issue

☐ Implement fix

☐ Verify fix

☐ Regression testing

☐ Manual testing

☐ Documentation review

---

# Documentation Updates

Update if required

☐ CURRENT_SPRINT.md

☐ CHANGELOG.md

☐ CHANGE_REQUESTS.md

☐ Module README

☐ Architecture

☐ ADR

---

# Resolution

Completed By

```
Developer / AI
```

Completion Date

```
YYYY-MM-DD
```

Git Commit

```
Commit Hash
```

Sprint

```
Sprint Number
```

Release Version

```
Version
```

Verification

```
Verified / Pending
```

---

# Post Resolution Review

Questions

Did the fix solve the root cause?

Could this issue happen again?

Should coding standards change?

Should architecture change?

Should documentation improve?

Should automated tests be added?

Record lessons learned.

---

# AI Handover

Before closing the issue, every AI agent should record

```
Agent

Task Performed

Files Modified

Summary

Known Limitations

Recommendations

Next Suggested Task
```

---

# Closure Checklist

Before closing verify

☑ Root cause identified

☑ Issue fixed

☑ Code reviewed

☑ Tests passed

☑ Documentation updated

☑ Git committed

☑ Git pushed

☑ clasp deployed

☑ Production verified

☑ CURRENT_SPRINT.md updated

---

# Final Notes

Every issue contributes to improving SahakarERP.

Never delete issues.

Closed issues become part of the project's institutional knowledge and help future developers and AI agents avoid repeating the same mistakes.

The objective is not only to solve problems but to continuously improve the architecture, documentation, and quality of the entire ERP.
````
