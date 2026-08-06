# Sprint 4.3 Plan — Framework Foundation

Sprint Goal

Establish and adopt the Core infrastructure for the reusable UI component framework so existing components can incrementally migrate to shared utilities and consistent lifecycle behavior.

Sprint Goal Summary

- Deliver foundational modules: BaseComponent, EventEmitter, ComponentFactory, ComponentRegistry, ConfigManager, ThemeManager, Accessibility helpers, SharedHelpers.
- Integrate foundation into one pilot component (opt-in) to validate approach.
- Create adoption guidance and tests required for broad migration in subsequent sprints.

Objectives

- Implement robust, well-documented Core modules under Components/Core/.
- Select one component (SearchBox recommended) and refactor it to use BaseComponent, EventEmitter, SharedHelpers and ConfigManager.
- Consolidate CSS tokens into a shared stylesheet and wire ThemeManager to set CSS variables.
- Add basic automated tests and accessibility checks for the refactored component.

Deliverables

- Components/Core/{BaseComponent.js, EventEmitter.js, ComponentFactory.js, ComponentRegistry.js, ConfigManager.js, Accessibility.js, ThemeManager.js, SharedHelpers.js, README.md}
- Refactored component (SearchBox) using Core APIs — proof of concept only.
- Components/components.css (shared CSS variables and tokens)
- Migration guide (Components/Core/README.md) documenting how to adopt Core utilities in other components.
- Basic accessibility & integration test script (example manual test steps and sample unit tests where applicable)

Files to be created or modified

- Add: Components/Core/* (as above)
- Add: Components/components.css
- Modify (proof-of-concept): Components/SearchBox/{SearchBox.js, README.md} to adopt BaseComponent and SharedHelpers

Success Criteria

- Core modules implemented and documented.
- At least one component refactored and passing manual accessibility checks.
- ThemeManager is able to set CSS variables consumed by components.
- Migration guide is clear and validated by the POC refactor.

Dependencies

- Bootstrap 5 available on host pages.
- Component templates present in repository for the POC component.
- Team alignment on global namespace and adoption timeline.

Estimated Work

- Core modules: 2-3 developer days
- POC refactor (SearchBox): 1 day
- Tests & migration guide: 1 day
- Buffer & reviews: 1 day

Priority

High — core modules are required to reduce duplication and stabilize the component framework.

Tasks

Phase 1 — Core Infrastructure

- BaseComponent: base lifecycle methods, config application, common helper wiring.
- EventEmitter: lightweight publish/subscribe with on/off/once/emit.
- ComponentFactory: helper to create instances from templates with consistent config handling.
- ComponentRegistry: register and discover component factories for optional runtime loading.
- ConfigManager: validation and default merging for component configs.
- ThemeManager: set and expose CSS variables and theme tokens.
- Accessibility: trapFocus, aria helpers, live region announcer.
- SharedHelpers: DOM helpers, uid, cloneTemplateById, debounce/throttle, safeInnerHTML.

Phase 2 — POC Adoption

- Refactor SearchBox to use BaseComponent and SharedHelpers.
- Wire ThemeManager to a shared components CSS file.
- Run manual accessibility tests and document results.

Phase 3 — Testing

- Add example unit tests demonstrating BaseComponent behavior.
- Document manual test steps for keyboard navigation and screen reader checks.

Phase 4 — Documentation

- Update Components/Core/README.md with API docs and migration steps.
- Update component README templates with migration checklist.

Phase 5 — Prepare Supplier Module

- With foundation in place, begin planning for Supplier Module scaffolding using the component framework.

