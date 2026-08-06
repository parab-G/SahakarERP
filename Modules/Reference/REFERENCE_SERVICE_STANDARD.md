# Reference Service Standard

Service responsibilities

- Implement server-side CRUD and search for reference data.
- Use Database.js exclusively for persistence.
- Return Response.js standardized objects.
- Call validation namespace (SahakarValidation.<Module>) before writes.

Required service API (exposed on global)

- initialize()
- getAll()
- getActive()
- getById(id)
- exists(id)
- search(filters)
- count()
- create(record)
- update(id, record)
- softDelete(id)
- restore(id)

Implementation guidelines

- No direct SpreadsheetApp or external calls beyond Database.js.
- Enforce uniqueness and other DB-level business rules at service level.
- Populate audit fields: CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, Deleted, DeletedDate.
- Do not throw raw exceptions to the client; catch and return Response.error with a friendly message.
- Keep service methods small and well-documented.

Testing

- Unit tests: validation + service logic (mock Database)
- Integration: roundtrip create → read → update → softDelete → restore
