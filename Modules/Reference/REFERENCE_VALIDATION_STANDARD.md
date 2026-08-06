# Reference Validation Standard

Validation responsibilities

- Validation must be pure: no Database.js or external calls.
- Provide reusable validation methods under SahakarValidation.<ModuleName>

Required validation API

- validateField(fieldName, value) -> { valid, errors[], warnings[] }
- validateRecord(record) -> { valid, errors[], warnings[] }
- validateCreate(record) -> { valid, errors[], warnings[] }
- validateUpdate(record) -> { valid, errors[], warnings[] }
- validateDelete(record) -> { valid, errors[], warnings[] }

Validation response format

{
  valid: true|false,
  errors: [string],
  warnings: [string]
}

Guidelines

- Errors: required fields, format violations (codes, email, numeric)
- Warnings: non-fatal issues (suggested formatting, deprecated values)
- Business-rule checks that require DB lookups MUST be left to the Service layer (e.g., uniqueness)
- Include documentation comments for every validation method
- Keep logic minimal and well-tested
