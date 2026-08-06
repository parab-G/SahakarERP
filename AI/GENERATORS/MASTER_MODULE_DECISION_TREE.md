# Master Module Decision Tree

Use these trees to decide generation options.

1) Does this module require a UI?
- If records <= 500 and editing required by humans -> Yes
- If purely programmatic lookup -> Optional

2) Does it require validation?
- If any field has format/required/number/date constraints -> Yes
- Else -> Minimal validation (presence)

3) Should soft delete exist?
- If data is referenced by other modules or historically significant -> Yes
- If ephemeral and truly disposable -> consider hard delete (rare)

4) Should audit fields exist?
- Always include for masters used by ERP (traceability)

5) Should search/pagination be implemented?
- If expected records > pageSize (default 50) -> implement pagination
- If list small (<200) -> client-side caching with simple search

6) Dropdowns vs free text?
- If values are stable and enumerable -> dropdown (reference master)
- If values vary per record -> free text

7) Require history?
- If regulatory/audit requirement -> supportsHistory = true

Example flow (ASCII)

Start -> UI? -> Validation? -> Soft Delete? -> Audit? -> Pagination? -> Done
