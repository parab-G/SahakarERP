# ADR-0002: Service Migration — SocietyService → SocietyMasterService

Status: Proposed
Date: 2026-08-07

## 1. Current service architecture

- Legacy Service: `SocietyService.js`
  - Implements sheet-based CRUD and export/import utilities.
  - Uses `SHEET_NAMES` and helper functions `getPrimaryKey`, `getPrefix` to map schema.
  - Exposes functions used by UI scripts: `getSocieties`, `getSociety`, `saveSociety`, `updateSociety`, `softDeleteSociety`.
  - Performs inline normalization (`normalizeSociety`) and validation (`validateSociety`).

- New Service: `Modules/SocietyMaster/SocietyMasterService.js`
  - Modernized, modular service using `SocietyMasterSchema.js` and `SocietyMasterValidation.js`.
  - Uses `Database.js` for all sheet interactions and `Response.js` for standardized responses.
  - Offers API surface: `initialize`, `getAll`, `getById`, `getActive`, `create`, `update`, `softDelete`, `restore`, `exists`, `search`, `count`.
  - Emphasizes separation of validation and persistence.

- Shared Utilities: `Database.js`, `Utils.js` and `Response.js` provide DB access, timestamps/UUIDs, and standard response envelopes.

## 2. Duplicate responsibilities

- Both services validate data, apply normalization, and implement business rules (uniqueness, single-active rule).
- Both perform sheet header mapping and CRUD operations using Database.* helpers or direct header manipulation.
- Duplicated logic increases maintenance burden and the risk of subtle behavioral divergence.

## 3. Which functions should remain public

Public surface should provide application-level operations required by UI and integrations. Recommend keeping the following public functions in the consolidated API (exposed by SocietyMasterService):

- getAll / getById / getActive
- create (or save)
- update
- softDelete
- restore
- search
- count
- exists

Rationale: These methods map directly to UI workflows and integrations and encapsulate validation and business rules.

## 4. Which functions should become internal

Utility and backward-compatibility helpers that do not need to be public should be internal/private:

- normalizeSociety (normalize input payloads)
- validateSociety (field-level helpers used by validation module) — keep validation logic in `SocietyMasterValidation.js` and make `validateSociety` a thin internal adapter
- duplicateRegistration / checkDuplicateName — internal checks used by create/update flows
- requireSocietySchema — internal provisioning helper

Rationale: Reduces API surface and encourages single source-of-truth (SocietyMasterValidation and Schema definitions).

## 5. Wrapper strategy

Phase approach (non-code in this ADR):

- Implement server-side wrappers (thin adapters) in a compatibility module that expose legacy function names and delegate to SocietyMasterService methods. Example mapping:
  - getSocieties → SocietyMasterService.search / getAll
  - getSociety(id) → SocietyMasterService.getById(id)
  - saveSociety → SocietyMasterService.create
  - updateSociety → SocietyMasterService.update
  - softDeleteSociety → SocietyMasterService.softDelete

- Wrappers should preserve legacy input/output shapes and Response semantics (Response.success/validationError/notFound). They should not duplicate validation logic but rely on SocietyMasterValidation.

- Deploy wrappers in a transitional release and log usage for deprecation tracking.

Note: The ADR does not implement wrappers; it only documents the strategy.

## 6. Backward compatibility

- Maintain identical function names and Response contracts for legacy callers during the transition period by providing wrappers.
- Ensure sheet column names remain compatible or add mapping layers in wrappers to translate field names.
- Deprecation notices should be included in logs and API responses when wrappers are called.

## 7. Migration phases

Phase A — Readiness
- Ensure SocietyMasterService parity with legacy API and complete unit tests for validation and persistence.

Phase B — Wrappers
- Deploy compatibility wrappers that delegate to SocietyMasterService. Keep legacy functions in place but marked deprecated.
- Monitor logs for wrapper usage and errors.

Phase C — Switch UI
- Update ModuleLoader to point to SocietyMaster UI and update client scripts to use new API signatures where beneficial.
- Keep wrappers running to support external integrations.

Phase D — Cleanup
- After monitoring and stabilization, remove wrappers and legacy service code, documenting breaking changes.

## 8. Risks

- Mismatched I/O shapes: wrappers must faithfully translate inputs/outputs or integrations will break.
- Hidden behavior: legacy code may have implicit behaviors (header names, default values) not covered by new service.
- Timing and data races: switching services during active usage may temporarily produce inconsistencies unless wrapped in transactions or gated releases.

## 9. Rollback plan

- Keep legacy service code in a release branch until deprecation window ends.
- Re-enable legacy endpoints by removing wrapper delegation and restoring direct legacy service invocation.
- Maintain database backups and schema snapshots prior to migration.

## 10. Testing checklist

- Unit tests for SocietyMasterValidation and normalize adapters.
- Integration tests for SocietyMasterService covering create/update/delete/restore/search and single-active rule.
- Wrapper contract tests: legacy function name calls must return expected Response shapes.
- End-to-end UI smoke tests: create/edit/delete via the UI and verify sheet states.
- Performance test: ensure getAll/search are performant for expected dataset sizes; add server-side pagination hooks if needed.
- Accessibility tests for UI components (COMPONENT_GUIDE.md compliance).

## 11. Final recommendation

Adopt SocietyMasterService as the canonical service for society master data. Implement compatibility wrappers for a staged migration to avoid breaking changes. Prioritize tests and documentation during the wrapper phase, and plan for final removal of legacy services after a successful stabilization period (minimum two weeks of monitored traffic).

Approved-by: SahakarERP Core Team (proposed)
