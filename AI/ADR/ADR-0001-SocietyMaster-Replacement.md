# ADR-0001: Consolidate Society Module and Society Master

Status: Proposed
Date: 2026-08-07

## Context / Problem Statement

The repository currently contains two overlapping modules: `Modules/Society/` and `Modules/SocietyMaster/`. Both provide UI and service code for managing society records, leading to duplication in functionality, inconsistent UX, diverging validation and schema definitions, and increased maintenance burden. This fragmentation risks conflicting data access patterns, duplicated business rules, and harder onboarding for new developers and AI agents.

## Current Architecture

- Modules/Society/
  - Existing Society module (legacy). Contains UI (Society.html, SocietyScript.html), services (SocietyService.js) and uses a schema defined in SchemaService constants.

- Modules/SocietyMaster/
  - Newer module (Sprint 5.1) implementing a modern component-driven UI (SocietyMaster.html, SocietyMasterScript.html), a declarative schema (SocietyMasterSchema.js), validation (SocietyMasterValidation.js), and a service (SocietyMasterService.js) that uses Database.js and SchemaService.js.

- Shared components and Core framework exist under Components/ and provide standardized UI primitives.

## Why duplicate Society modules are harmful

- Divergent logic: Two services may implement different validation, audit, or uniqueness semantics.
- UX inconsistency: Users exposed to both modules may see different field layouts or behavior.
- Increased maintenance: Bug fixes and feature changes must be applied twice.
- Testing overhead: More tests and QA needed for duplicated code paths.
- Data integrity risk: Conflicting write patterns could produce inconsistent records.

## Proposed Migration

Consolidate functionality into `Modules/SocietyMaster/` as the single authoritative Society module. Phased approach:

1. Stabilize `SocietyMaster` (current sprint): ensure the schema, validation and service are production-ready and registered with ModuleLoader.
2. Run integration shim and compatibility wrappers to allow existing callers (legacy module) to route through `SocietyMasterService` without changing client code.
3. Deprecate `Modules/Society/` UI and services; redirect ModuleLoader to load `SocietyMaster` pages in place of legacy module.
4. Remove legacy module after a grace period, synchronized with release and documentation updates.

## Migration Phases

Phase 0 — Readiness
- Verify SocietyMasterSchema aligns with SchemaService expectations.
- Ensure SocietyMasterService provides full API parity with legacy SocietyService (getSocieties, saveSociety, updateSociety, softDeleteSociety, etc.).

Phase 1 — Integration
- Add thin wrappers (server-side) that map legacy function names to SocietyMasterService methods for a transitional release.
- Deploy and monitor usage.

Phase 2 — Switch
- Update ModuleLoader and navigation to load SocietyMaster UI for 'Society' menu entries.
- Keep legacy endpoints functional but marked deprecated.

Phase 3 — Remove
- After verification window, remove Modules/Society/ and its services, update docs and changelog.

## Backward Compatibility

- Maintain wrapper functions (legacy API names) that call SocietyMasterService internally.
- Preserve existing sheet names and headers during transition (SchemaService.ensureSchema will be used to ensure headers match).
- UI-level behavior remains compatible via DataTable and field mappings.

## Risks

- Behavioral mismatch: minor differences in validation or field labels may affect integrations.
- Data migration: if schema changes require column renames, existing sheets may need migration scripts.
- Rollout risk: switching ModuleLoader before wrappers are fully tested may break clients relying on legacy APIs.

## Rollback Plan

- Re-enable legacy ModuleLoader routes to serve `Modules/Society/` pages using versioned tags or feature flags.
- Restore legacy service endpoints from source control if a rollback is required.
- Keep legacy code in a safety branch while the migration matures.

## Files Affected

- New primary: Modules/SocietyMaster/{SocietyMaster.html, SocietyMasterScript.html, SocietyMasterSchema.js, SocietyMasterValidation.js, SocietyMasterService.js}
- Legacy: Modules/Society/ (UI & service)
- ModuleLoader.js — may be updated to swap module mapping (recommended change during Phase 2)
- SchemaService.js — ensure schema keys map and provisioning is consistent
- AI docs: AI/SPRINTS/*, AI/PROJECT_CONTEXT.md, changelog entries

## Testing Strategy

- Unit tests for SocietyMasterValidation functions (field-level and record-level).
- Integration tests for SocietyMasterService using a test spreadsheet or mock Database wrapper.
- Manual UX verification: compare legacy and new UI flows for create/update/delete, search and import/export.
- Backward compatibility tests: ensure wrapper endpoints respond identically to legacy functions.
- Accessibility checks per COMPONENT_GUIDE.md for the new UI.

## Final Recommendation

Proceed with consolidation. Use the phased migration above, starting with wrappers and compatibility shims to avoid immediate breaking changes. Prioritize automated tests for validation and service logic, and schedule a deprecation window for the legacy module. After a successful verification period (2 weeks), remove the legacy module and finalize documentation updates.

Approved-by: SahakarERP Core Team (proposed)


---

End of ADR-0001
