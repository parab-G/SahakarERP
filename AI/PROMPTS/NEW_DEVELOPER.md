# NEW_DEVELOPER

Version: 1.0.0

Status: Active

Owner: SahakarERP Core Team

Last Updated: YYYY-MM-DD

---

# Welcome to SahakarERP

Welcome to the SahakarERP development team.

Whether you are a human developer or an AI coding agent, this document is your onboarding guide.

**Do not write a single line of code before completing this onboarding process.**

SahakarERP is a long-term project intended to become the most comprehensive ERP platform for Labour Cooperative Societies in Maharashtra.

You are joining an active project with established architecture, coding standards, documentation standards, and development workflows.

Your responsibility is **to extend the system without breaking consistency**.

---

# Step 1 - Understand the Mission

SahakarERP is **not** just an accounting application.

It is a complete operating system for Labour Cooperative Societies.

Our mission is to digitize every operational activity of a cooperative society.

Examples include:

- Society Administration
- Government Tenders
- Work Orders
- Execution Agencies
- Accounting
- GST
- Compliance
- Documents
- Letters
- Resolutions
- Meetings
- Assets
- Members
- Reports
- AI Assistance

Always think beyond a single feature.

Every feature should contribute to the long-term vision.

---

# Step 2 - Read Project Documentation

Read the following documents in order.

```
AI/README.md

↓

AI/PROJECT_CONTEXT.md

↓

AI/ARCHITECTURE.md

↓

AI/CODING_STANDARDS.md

↓

AI/CURRENT_SPRINT.md

↓

AI/CHANGE_REQUESTS.md
```

Do not skip any document.

---

# Step 3 - Understand Repository Structure

```
/

AI/

Components/

Modules/

Database.js

SchemaService.js

ModuleLoader.js

Utils.js

Response.js

Config.js

Main.html

App.html

Navbar.html

Sidebar.html

PROJECT_ROADMAP.md

CHANGELOG.md

README.md
```

Become familiar with this structure before making changes.

---

# Step 4 - Understand the Architecture

SahakarERP follows a layered architecture.

```
Browser

↓

HTML

↓

Reusable Components

↓

Module

↓

Service

↓

Database.js

↓

Google Sheets
```

Never bypass these layers.

---

# Step 5 - Understand the Golden Rules

The project is governed by these principles.

- Everything is a Module.
- Everything is a Register.
- Everything has a Schema.
- Everything goes through Database.js.
- Everything must be reusable.
- Everything must be documented.
- Never duplicate code.
- Never hardcode values.
- Never invent architecture.

---

# Step 6 - Review Current Sprint

Open

```
AI/CURRENT_SPRINT.md
```

Understand:

- Current sprint
- Completed work
- Current task
- Pending tasks
- Blockers
- Handover notes

Never begin work without reading this file.

---

# Step 7 - Review Existing Code

Before writing code:

Review similar modules.

Examples:

- Settings
- Society Master
- Dashboard

Reuse existing patterns whenever possible.

Never create a second implementation of an existing solution.

---

# Step 8 - Before Creating a New Feature

Complete this checklist.

☐ Read Feature Request

☐ Read Architecture

☐ Review Existing Modules

☐ Review Components

☐ Review Database.js

☐ Review SchemaService.js

☐ Review Coding Standards

☐ Check CURRENT_SPRINT.md

☐ Check CHANGE_REQUESTS.md

Only then begin implementation.

---

# Step 9 - Standard Module Structure

Every module must contain:

```
Module.html

ModuleScript.html

ModuleService.js

ModuleSchema.js

ModuleValidation.js

README.md
```

Follow this structure exactly.

---

# Step 10 - Component Philosophy

Never build UI from scratch if a reusable component exists.

Always reuse:

- Cards
- Tables
- Toolbars
- Search
- Pagination
- Alerts
- Modals

If a reusable component does not exist,

create it inside:

```
Components/
```

Never inside an individual module.

---

# Step 11 - Coding Rules

Write code that is:

- Simple
- Readable
- Reusable
- Predictable
- Maintainable

Avoid:

- Long functions
- Duplicated logic
- Inline CSS
- Inline JavaScript
- Hardcoded values

---

# Step 12 - Documentation Rules

Every change requires documentation updates.

Update:

- CURRENT_SPRINT.md
- CHANGELOG.md
- Module README
- CHANGE_REQUESTS.md

Documentation is considered part of the implementation.

---

# Step 13 - Git Workflow

Every completed task follows:

```
Implement

↓

Review

↓

Test

↓

Documentation

↓

Git Commit

↓

Git Push

↓

clasp Push

↓

Verify
```

Never skip documentation.

---

# Step 14 - AI Handover

Before ending your work:

Update

```
AI/CURRENT_SPRINT.md
```

Include:

- Task completed
- Files modified
- Known issues
- Recommendations
- Next task

Leave the project in a better state than you found it.

---

# Step 15 - When You Are Unsure

Do not guess.

Review:

- PROJECT_CONTEXT.md
- ARCHITECTURE.md
- CODING_STANDARDS.md

If uncertainty remains,

stop and request clarification rather than introducing inconsistent code.

---

# Common Mistakes to Avoid

Never:

❌ Access Google Sheets directly.

❌ Duplicate Database.js functionality.

❌ Create module-specific UI components.

❌ Introduce unsupported libraries.

❌ Ignore coding standards.

❌ Skip validation.

❌ Skip documentation.

❌ Change architecture without approval.

❌ Delete historical documentation.

---

# Success Criteria

A successful developer or AI agent:

- Understands the business domain.
- Follows the architecture.
- Reuses existing code.
- Writes maintainable code.
- Updates documentation.
- Leaves clear handover notes.
- Improves the project without increasing technical debt.

---

# Final Message

SahakarERP is more than a software project.

It is an effort to preserve, modernize, and simplify the operation of Labour Cooperative Societies through well-designed, maintainable software.

Your responsibility is not just to write code.

Your responsibility is to protect the architecture, preserve consistency, and help build a system that will remain useful and maintainable for many years.

Welcome to the SahakarERP development team.