# Master Module Anti-Patterns

This reference lists mistakes AI agents must avoid when generating modules.

Do NOT:

- Duplicate CRUD logic across modules: centralize via shared patterns and Database.js.
- Duplicate validation that requires DB calls inside validation layer: keep validation pure.
- Inline CSS or inline JavaScript in HTML templates.
- Call SpreadsheetApp directly from client-side code or validation functions.
- Return raw exceptions from services to clients; always use Response objects.
- Hard-delete records that are referenced elsewhere.
- Create new component implementations when a reusable component exists.
- Break naming conventions or folder structure; it increases maintenance cost.
- Put business logic in HTML or templates.
- Create large monolithic functions; prefer small testable functions.
- Omit audit fields or soft-delete flag on masters used across ERP.
- Use display text as integration keys (use ID or stable code).

Common mistakes

- Not enforcing uniqueness at service layer (causes data corruption).
- Using non-deterministic ID generation without documenting format.
- Not documenting seed/default values for production imports.

If uncertain

- Ask clarifying questions (use MASTER_MODULE_PROMPT.md placeholders).
- Default to safer patterns: soft-delete, audit fields, pure validation, Response objects.
