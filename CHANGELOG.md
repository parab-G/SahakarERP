# Changelog

All notable changes to Sahakar ERP are documented here.

---

## Version 1.0.0

### Sprint 1

Framework Initialized

Completed

- VS Code Setup
- Node.js Setup
- clasp Setup
- Git Repository
- Initial Architecture
- Dashboard
- Backend Framework
- Settings Module (Initial)

---

### Sprint 2

Project Documentation

Completed

- README.md
- CHANGELOG.md
- .gitignore

In Progress

- Framework Stabilization

---

### Upcoming

Sprint 3

Settings Module

Sprint 4

Society Master

Sprint 5

Execution Agency

Sprint 6

Supplier

Sprint 7

Tender Register

Sprint 8

Work Order Register

Sprint 9

Voucher Register

Sprint 10

Government Bill Register

Sprint 11

GST Purchase Register

Sprint 12

Settlement Register

Sprint 13

Reports

Sprint 14

Dashboard Analytics

---

## v0.4.2 — 2026-08-07

### Added

- Reusable UI components: Card, Toolbar, Alert, Spinner, DataTable, Modal, SearchBox, Pagination (Components/)
- Core infrastructure scaffold: EventEmitter, BaseComponent, ComponentFactory, ComponentRegistry, ConfigManager, Accessibility, ThemeManager, SharedHelpers (Components/Core/)
- Sprint archival system and archive: AI/SPRINTS/Sprint-4.2.md
- Framework review and standardization reports (Components/FRAMEWORK_REVIEW.md, Components/STANDARDIZATION_REPORT.md)
- AI documentation updates and developer handover materials (AI/CURRENT_SPRINT.md appended, AI/SPRINTS/README.md)

### Changed

- Standardized component public APIs to: create(container, config), show(), hide(), update(config), destroy()
- Standardized component README templates and configuration patterns

### Improved

- Accessibility improvements across components (aria attributes, focus management, live regions)
- Component lifecycle consistency and error handling
- Developer documentation and sprint planning artifacts

### Documentation

- Detailed sprint report created: AI/SPRINTS/Sprint-4.2.md
- Component README files standardized
- Components/Core/ README and design notes added

### Architecture

- Template+factory pattern adopted for Apps Script compatibility
- Core utilities scaffolded to reduce duplication in future sprints

### Developer Experience

- Standardized public APIs and config patterns to reduce onboarding friction
- Component README templates for faster component creation

### AI Infrastructure

- Archival process defined and implemented for sprint snapshots
- Framework and architecture reviews created for AI-guided development

### Known Issues

- Core helpers are scaffolded but not yet integrated into components (requires refactor)
- No automated accessibility or integration tests yet
- DataTable client-side operations may not scale for very large datasets; server-side pagination recommended for production


