# Sahakar ERP

Version: 1.0.0 (Development)

---

## Overview

Sahakar ERP is a web-based Enterprise Resource Planning (ERP) application designed specifically for Labour Cooperative Societies (Majur Sahakari Sanstha) operating in Maharashtra.

The ERP digitizes the complete lifecycle of government and private construction works from tender participation to project closure, accounting, GST reconciliation and reporting.

The application is developed using Google Apps Script, HTML, CSS and JavaScript with Google Sheets acting as the database.

---

# Objectives

• Replace multiple Excel workbooks with a centralized ERP.

• Track every Tender.

• Track every Work Order.

• Track every Execution Agency.

• Track every Supplier.

• Track every Financial Transaction.

• Maintain complete accounting.

• Maintain GST records.

• Generate management reports.

---

# Technology Stack

Frontend

- HTML5
- CSS3
- JavaScript

Backend

- Google Apps Script

Database

- Google Sheets

Development

- VS Code
- clasp
- Git

---

# Project Modules

Dashboard

Settings

Society Master

Execution Agency Register

Supplier Register

Society Accounts Register

Chart of Accounts

Tender Register

Work Order Register

Execution Assignment Register

Voucher Register

Transaction Register

Government Bill Register

GST Purchase Register

Settlement Register

Document Register

Compliance Register

Reports

---

# Development Workflow

VS Code

↓

Git Commit

↓

clasp push

↓

Deploy

↓

Testing

---

# Project Structure

```
Backend

Services

Modules

Assets

Docs
```

(Current Apps Script files remain in the project root. Folder restructuring will be performed in a later sprint.)

---

# Coding Standards

1. Never access SpreadsheetApp directly from modules.

2. All database operations must go through Database.js.

3. Every module must have

- HTML
- Script
- Service

4. Never hardcode dropdown values.

5. Every record must have a Primary Key.

6. Business logic belongs inside Service files.

---

# Version Control

Git is used for source control.

Every completed feature will be committed separately.

---

# License

Internal Use Only

Copyright © 2026
Govinda Parab
