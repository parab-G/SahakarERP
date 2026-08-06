# ARCHITECTURE

Version: 1.0.0

Status: Approved

Owner: SahakarERP Core Team

Last Updated: 2026-08-06

---

# Purpose

This document defines the software architecture of SahakarERP.

Every developer and AI coding agent must follow this architecture. No architectural changes are permitted without approval and an Architecture Decision Record (ADR).

This document explains how the application is built, how modules communicate, where business logic belongs, and how new functionality must be added.

---

# Architectural Principles

The architecture is based on the following principles:

- Simple
- Modular
- Register First
- Component Based
- Service Based
- Reusable
- Documentation Driven
- Database Abstraction
- Low Coupling
- High Cohesion

---

# Technology Stack

Frontend

- HTMLService
- Bootstrap 5
- Vanilla JavaScript (ES6)

Backend

- Google Apps Script

Database

- Google Sheets

Deployment

- clasp
- Google Apps Script Web App

Version Control

- Git
- GitHub

---

# High Level Architecture

```
Browser

↓

Main.html

↓

ModuleLoader.js

↓

Selected Module

↓

google.script.run()

↓

Apps Script Service

↓

Database.js

↓

Google Sheets
```

---

# Repository Structure

```
/

AI/
Components/
Modules/

App.html
Main.html
Navbar.html
Sidebar.html

Database.js
SchemaService.js
ModuleLoader.js
Utils.js
Response.js
Config.js

CHANGELOG.md
PROJECT_ROADMAP.md
README.md
```

---

# Folder Responsibilities

## AI/

Project documentation for AI agents.

Contains:

- Project Context
- Architecture
- Coding Standards
- Sprint Status
- Prompts
- Issues

---

## Components/

Contains reusable UI components.

Examples

- Card
- Modal
- Toolbar
- Table
- Pagination
- Search Box
- Alert
- Spinner

No business logic belongs here.

---

## Modules/

Contains every ERP module.

Each module owns

- UI
- Service
- Schema
- Validation
- Documentation

---

# Standard Module Structure

```
Modules/

ModuleName/

Module.html

ModuleScript.html

ModuleService.js

ModuleSchema.js

ModuleValidation.js

README.md
```

Every module follows exactly this structure.

---

# Layered Architecture

```
Presentation Layer

↓

Component Layer

↓

Module Layer

↓

Service Layer

↓

Database Layer

↓

Google Sheets
```

No layer may bypass another layer.

---

# Presentation Layer

Responsible for

- HTML
- Bootstrap
- User Interaction

Must never

- Access Google Sheets
- Contain business logic
- Perform calculations
- Store application state

---

# Component Layer

Contains reusable UI.

Examples

- Card
- Table
- Modal
- Toolbar
- Search
- Pagination

Components are generic.

Components never know module names.

---

# Module Layer

Each ERP Register is one module.

Example

Tender Register

Supplier Register

Society Master

Execution Agency

Work Orders

Every module uses shared components.

---

# Service Layer

Business logic belongs here.

Responsibilities

- Validation
- Processing
- Permissions
- CRUD
- Workflow

UI never contains business logic.

---

# Database Layer

Database.js is the single gateway to Google Sheets.

No other file may directly call

SpreadsheetApp

Sheet

Range

Spreadsheet APIs

Everything goes through Database.js.

---

# Schema Layer

SchemaService.js manages

- Sheet creation
- Columns
- Default values
- Schema updates

Every module registers its schema.

---

# Data Flow

```
User

↓

Component

↓

Module

↓

google.script.run()

↓

ModuleService.js

↓

Database.js

↓

Google Sheets
```

Responses travel back in reverse order.

---

# Response Format

Every service returns

Success

```
{
success:true,
data:{}
}
```

Failure

```
{
success:false,
message:"",
code:""
}
```

Response.js provides helper functions.

---

# Module Loader

ModuleLoader.js is responsible for

- Registering modules
- Loading HTML
- Initializing scripts
- Navigation
- Lazy loading

Modules never load themselves.

---

# Navigation

Navbar

↓

Sidebar

↓

ModuleLoader

↓

Module

Navigation must never directly manipulate HTML outside ModuleLoader.

---

# Component Architecture

Every reusable component must support

Configuration

Callbacks

Bootstrap styling

Accessibility

No module specific code.

---

# Database Architecture

Google Sheets

↓

Database.js

↓

Services

↓

Modules

↓

UI

Database.js isolates Google Sheets implementation from business logic.

Future database migration only changes Database.js.

---

# Schema Architecture

Every register has

ModuleSchema.js

Defines

Sheet Name

Columns

Data Types

Defaults

Indexes

Validation Rules

---

# Validation Architecture

Validation occurs twice.

Client

↓

Server

Server validation is mandatory.

---

# Error Handling

Errors are never shown directly.

Server

↓

Response.js

↓

Client

↓

Bootstrap Alert

Internal stack traces are never exposed.

---

# Logging

Temporary

Logger.log()

Persistent

system_logs sheet

Every critical error should include

Timestamp

Module

User

Action

Message

---

# Security

Client never accesses Sheets.

Permissions checked in Services.

Sensitive data never returned unless required.

Soft delete instead of permanent delete.

Audit fields mandatory.

---

# Naming Conventions

Modules

SupplierService.js

SupplierSchema.js

Supplier.html

SupplierScript.html

Variables

camelCase

Classes

PascalCase

Constants

UPPER_CASE

IDs

MODULE-000001

---

# Performance Rules

Batch reads.

Batch writes.

Avoid repeated Sheet access.

Cache where appropriate.

Lazy load modules.

Reuse components.

---

# Future Scalability

Current

Google Sheets

Future

Database.js Adapter

↓

SQLite

↓

PostgreSQL

↓

Cloud SQL

Business logic must never change during migration.

---

# AI Architecture Rules

AI must

Read PROJECT_CONTEXT.md first.

Read this document second.

Never bypass Database.js.

Never duplicate components.

Never invent frameworks.

Never replace Bootstrap.

Never create direct SpreadsheetApp calls.

Always follow Standard Module Structure.

Always update documentation.

---

# Architecture Decision Records

Any change involving

Folder structure

Database

Module Layout

Communication

Deployment

must create an ADR before implementation.

---

# Final Principles

Everything is a Module.

Everything is a Register.

Everything has a Schema.

Everything uses Components.

Everything goes through Services.

Everything goes through Database.js.

Everything is documented.

Nothing is duplicated.

Architecture consistency is more important than implementation speed.