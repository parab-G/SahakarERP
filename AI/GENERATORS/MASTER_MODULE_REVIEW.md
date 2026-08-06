# Master Module Review Guide

Purpose

Defines the official review process and checklists for module acceptance.

Review stages

1. Architecture Review
   - Folder layout and separation of concerns
   - Schema completeness and indexes
2. Business Review
   - Field list matches business rules
   - Uniqueness and required flags correct
3. Validation Review
   - validateField/Record/Create/Update/Delete implemented
   - Error/warning formats consistent
4. UI Review (if present)
   - Accessibility, responsive layout, component reuse
5. Performance Review
   - Service uses efficient filters; large-list behavior documented
6. Security Review
   - No secret leakage, input size limits, escaping
7. Documentation Review
   - README, migration notes, examples present
8. Testing Review
   - Validation unit tests pass
   - Service integration tests pass

Approval criteria

- All critical issues fixed
- No open security/accessibility blockers
- Reviewer+QA sign-off recorded in PR or AI/CURRENT_SPRINT.md

Release approval

- Module owner or product manager must approve prior to release
- Update changelog and AI/CURRENT_SPRINT.md with summary and files changed
