# SahakarERP UI Component Framework Guide

This is the official manual for the SahakarERP UI Framework. Every developer and AI agent must read and follow this guide before creating or modifying UI components.

---

# 1. Framework Overview

Purpose
- Provide a consistent, accessible, and reusable UI component system for SahakarERP.

Goals
- Fast, predictable component creation
- Consistent public APIs and lifecycle
- Accessibility-first design
- Google Apps Script HTMLService compatibility
- Bootstrap 5 styling with theming support

Architecture
- Template + Factory pattern: HTML <template> files store markup, JavaScript factories clone templates and return a component instance (API object).
- Components are independent, opt-in consumers of Core utilities (Components/Core).

Why reusable components exist
- Reduce duplication, ensure consistent UX, simplify maintenance and onboarding.

Relationships
- ERP Modules: consume components via create(container, config) and instance API. Modules should not alter component internals.
- ModuleLoader: optional runtime loader; components must be usable without it. Future integration will use ComponentRegistry / ComponentFactory for lazy loading.
- Core Framework: Components may adopt Core utilities (BaseComponent, EventEmitter, ConfigManager, Accessibility, ThemeManager, SharedHelpers) to standardize behavior.

---

# 2. Folder Structure

Components/
- Root for UI components and core utilities.

Card/, Toolbar/, Alert/, Spinner/, Modal/, SearchBox/, Pagination/, DataTable/
- Each folder contains: README.md, <Component>.html (template), <Component>.js (factory/runtime), and tests/docs when needed.

Core/
- Shared utilities and foundation modules:
  - BaseComponent.js — base lifecycle scaffolding and config handling
  - EventEmitter.js — publish/subscribe
  - ComponentRegistry.js — optional runtime registry
  - ComponentFactory.js — create instances from registry/templates
  - ConfigManager.js — defaults and validation
  - Accessibility.js — focus trap, aria helpers
  - ThemeManager.js — CSS variable management
  - SharedHelpers.js — DOM helpers, uid, debounce, safeInnerHTML

Responsibilities
- Component folders: own markup + runtime. Do not modify other components.
- Core: reusable logic, not UI markup.

---

# 3. Component Architecture

HTML Template
- Store static markup inside a <template id="Component-Template">. Do not include inline JS or CSS. Markup should use Bootstrap classes and aria attributes.

JavaScript Runtime
- Export a factory function that returns an instance API.
- Factories must be pure (no global side-effects) and accept (container, config).

Factory Pattern
- create(container, config) clones the template, binds DOM refs, wires events, applies config, and appends to container.

Configuration Object
- Standard shape (required):
  {
    id: "",
    className: "",
    visible: true,
    disabled: false,
    theme: "light",
    callbacks: {}
  }
- Component-specific options extend this base shape.

Lifecycle
- Standardized API: create / show / hide / update / destroy (see section 4).

Public API
- Methods should be documented in README and follow verb-noun naming (setTitle, setBody, setData).
- Return the instance object on create for chaining.

Accessibility
- Use roles (region, toolbar, dialog, alert), aria-live for announcements, aria-busy for loading, and tabbable elements in order.

Bootstrap
- Components rely on Bootstrap 5 utilities; avoid reimplementing layout logic.

No inline JS / No inline CSS
- Templates must not contain inline JS or CSS. Styling via classes and CSS variables; behavior via component JS.

---

# 4. Component Lifecycle

Standard methods and when to use them:

create(container, config)
- Purpose: instantiate component; clone template; return API.
- Use: only once per logical component instance. Must be idempotent for different containers.

show()
- Purpose: make component visible and announce to screen readers if needed.
- Use: when rendering must remain in DOM but be shown (e.g., modal.show()).

hide()
- Purpose: do not remove state; hide visually and set aria-hidden.
- Use: temporary hiding without destroying state.

update(config)
- Purpose: apply new configuration at runtime. Merge defaults and validate changes.
- Use: update text, data, visibility, disabled state, theme.

destroy()
- Purpose: remove DOM, unbind events, release references for GC.
- Use: when component will not be reused; always call in module cleanup.

sync()
- Purpose: reconcile DOM with internal state (read model → view). Optional helper in complex components.
- Use: after multiple state changes to batch DOM updates.

refresh()
- Purpose: redraw dynamic elements (table rows, lists) without full re-creation.
- Use: when data payload changes frequently.

loading()
- Purpose: enter loading state (aria-busy=true). Show spinner or overlay if needed.
- Use: before async operations begin.

disabled()/enabled()
- Purpose: set interactive controls to disabled or enabled, adjust aria-disabled, and update classes.
- Use: when actions must be blocked.

visibility
- Purpose: combination of visible flag + show/hide. Use update({visible:false}) to set persistent visibility.

Notes
- Prefer update() over direct DOM manipulation.
- create() must not begin long-running tasks; use show()/loading() to trigger async flows.

---

# 5. Configuration Standards

config
- Always validate against ConfigManager defaults.

defaults
- Provide sensible defaults; document them in README.

callbacks
- Use config.callbacks: {onOpen: fn, onClose: fn} for initial wiring.
- For runtime event registration, expose EventEmitter and instance.on/once/off as well.

events
- Emit lifecycle events: created, shown, hidden, updated, destroyed.

state
- Keep a plain JS state object on the instance: instance.state = {loaded:false, items:[]}

DOM references
- Store important DOM nodes in instance.refs for unit tests and lifecycle operations.

runtime properties
- instance.id, instance.visible, instance.disabled, instance.theme

---

# 6. Event System

EventEmitter
- Use Components/Core/EventEmitter (or provide equivalent) for runtime events.
- EventEmitter API: on(name, fn), off(name, fn), once(name, fn), emit(name, payload).

Events
- Standard lifecycle event names: created, shown, hidden, updated, destroyed, error.

Callbacks
- config.callbacks are one-time bootstrap hooks; EventEmitter is preferred for dynamic handlers.

Naming conventions
- Use kebab-case or dot-separated names for events: "row:click", "modal:open".

Lifecycle events
- Emit at the end of the corresponding method (after DOM appended for created, after show animation for shown).

Custom events
- Components may emit custom events scoped to the instance; subscribe via instance.on('custom', handler).

---

# 7. Accessibility Standards

ARIA
- Every interactive component must include appropriate roles and aria-* attributes.
- Examples: role="dialog" aria-modal="true" for Modal; role="alert" aria-live="polite" for alerts.

Keyboard navigation
- Provide keyboard shortcuts and focus order: Tab/Shift+Tab navigation, Enter for primary actions, ESC for close when relevant.

Focus management
- Trap focus in modals and restore focus to the opener on close. Use Accessibility.trapFocus() helper.

Screen readers
- Use aria-live regions for announcements. Ensure announcements on important state changes (success, error, loading complete).

Contrast
- Follow WCAG AA contrast ratios. ThemeManager should expose color tokens.

Bootstrap requirements
- Bootstrap 5 must be available in host pages. Components rely on its utilities and accessible behaviors.

---

# 8. Theme System

ThemeManager
- Central place to set CSS variables and theme tokens (colors, z-index, spacing, progress height).
- Use ThemeManager.setTheme(name, vars) at app bootstrap.

CSS variables
- Components must consume CSS variables (e.g., --sahakar-z-index-modal, --sahakar-progress-height) for customizable styling.

Dark Mode
- Support theme variants (light/dark) by providing tokens; avoid runtime class toggles that conflict with host apps.

Future customization
- Provide swap-able token packs for branding and high-contrast accessibility themes.

---

# 9. Naming Standards

Component names
- PascalCase for component constructors (Card, Toolbar), folder names follow same.

Methods
- Verb-based camelCase (show, hide, setTitle, setData).

Files
- <Component>.html, <Component>.js, README.md inside each folder.

Variables
- camelCase for local variables; UPPER_SNAKE for constants.

Events
- kebab-case or dot: "row:select", "pagination:change".

Callbacks
- onEvent naming in callbacks: onOpen, onClose, onSearch.

CSS classes
- Use Bootstrap utilities and project prefixes: .sahakar-card, .sahakar-modal.

Folders
- Lowercase folder names matching component name.

---

# 10. Best Practices

- Reuse small, focused components and compose them for complex UIs.
- Prefer configuration over hardcoding; document config options.
- Keep template markup minimal and semantic.
- Centralize utilities in Core to avoid duplication.
- Avoid heavy client-side processing in DataTable; provide hooks for server-side paging.
- Write README.md and usage examples for every component.

---

# 11. Anti-Patterns

Never:
- Duplicate components across folders
- Manipulate another component's DOM directly
- Hardcode HTML markup in JS strings
- Place inline CSS or JS in templates
- Bypass BaseComponent for shared lifecycle behaviors (unless documented exception)

---

# 12. Creating a New Component — Checklist

1. Create folder Components/MyComponent/
2. Add MyComponent.html template with semantic markup and Bootstrap classes. No inline JS/CSS.
3. Add MyComponent.js that exports create(container, config) and implements the standard API.
4. Add README.md with API, config options, examples, accessibility notes, and tests.
5. Use ConfigManager defaults and validate config.
6. Use EventEmitter for runtime events and emit lifecycle events.
7. Store DOM refs in instance.refs and state in instance.state.
8. Implement accessibility: roles, aria-* and keyboard support.
9. Add unit/manual test steps and example usage (in README).
10. Run manual accessibility checklist and document results.
11. Submit for review; do not integrate into ModuleLoader without core-adoption plan.

---

# 13. Integrating with Modules

- Modules should treat components as black boxes.
- Use create(container, config) to mount components; call destroy() during module teardown.
- Do not mutate instance.refs externally; use instance.update() or exposed setters.
- For server interactions, use callbacks or emitted events (onAction, onSearch) to let the module handle network I/O.

---

# 14. Integrating with ModuleLoader

Current status
- ModuleLoader is optional. Components must not require ModuleLoader to function.

Future approach
- ModuleLoader will leverage ComponentRegistry and ComponentFactory to lazy-load components. Factories should register with the registry (optional) but remain usable via direct import.

---

# 15. Future Roadmap

Planned components
- Form controls: Input, Select, DatePicker, FileUploader (Drive)
- Composite modules: RecordEditor, FormBuilder, Dashboard Tiles

Framework evolution
- Migrate components to BaseComponent adoption and centralize CSS tokens.
- Add test harness and automated accessibility checks in CI.

Migration strategy
- Refactor one component at a time to adopt Core utilities (recommended order: SearchBox → Modal → DataTable → Card).

---

# Appendix: Minimal ASCII Diagram — Template + Factory

Container (host) -> create(container, config)
  └─ clone <template id="X"> -> instance.dom
        ├─ instance.refs
        ├─ instance.state
        └─ instance.api {show, hide, update, destroy}

---

# Contact & Contribution

- Follow AI/PROJECT_CONTEXT.md, AI/CODING_STANDARDS.md and Components/FRAMEWORK_REVIEW.md when contributing.
- For questions, contact the SahakarERP Core Team.


---

End of guide.
