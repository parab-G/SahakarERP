# Master Module Testing Guide

Testing levels

1. Unit tests
   - Validation functions: all edge cases (required, format, numeric bounds)
   - Small helpers used by service (ID generation, utils)

2. Integration tests
   - Service methods using a mocked Database.js (create/read/update/delete/restore)
   - Error and validation responses asserted

3. Business rule tests
   - Uniqueness constraints
   - Single-active rules (if applicable)

4. Accessibility tests (UI)
   - Keyboard navigation
   - ARIA attributes and announcements

5. Performance tests
   - Large list behavior (client caching vs server pagination)

6. Regression tests
   - Re-run full suite after schema changes

Testing checklist

- Validation: >= 95% branch coverage on validateField/validateRecord
- Service: happy-path and error-path tests
- UI smoke: create → view → edit → soft-delete → restore
- CI integration: run tests in PR pipeline

Mocking guidance

- Mock Database.getAll, findById, insertRecord, updateRecord
- Keep tests deterministic; snapshot stable records for imports

Test artifacts

- Seed CSVs used in integration tests
- Test reports saved under tests/reports

Notes

- Tests should not rely on live sheets
- Use small, focused test fixtures to speed CI