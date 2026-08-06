Framework Review: Reusable UI Components (Sprint 4.2.1)

Scope

Reviewed components:
- Components/Card
- Components/Toolbar
- Components/Alert
- Components/Spinner

Purpose

Identify strengths, weaknesses and inconsistencies; recommend standards and required changes before integration.

1) Strengths

- Single global namespace used consistently: window.SahakarComponents. This simplifies discovery and prevents global pollution.
- Template + JS factory pattern across components: HTMLService-compatible (<template> usage), behavior in JS files — good separation of concerns.
- Bootstrap 5 utilities used consistently (no custom CSS required) keeping visual consistency with the repo.
- Accessibility considered in many places: role attributes, aria-live/aria-atomic for alerts, aria-busy handling for spinner, aria-labelledby on Card title.
- Flexible action patterns: actions accept DOM elements, HTML strings, or config objects (Toolbar/Card) — good for integration flexibility.
- Components expose useful instance objects and DOM node (el) for advanced usage.

2) Weaknesses

- Public API inconsistency: not all components implement the same lifecycle methods. Standard required lifecycle (create, show, hide, update, destroy) is partially implemented across components.
  - Card: create(...) returns methods but lacks show(), hide(), update(config). It mounts immediately on create and provides destroy and mutation helpers (setBody, setTitle, etc.).
  - Toolbar: create(...) returns mutation helpers and destroy; lacks show(), hide(), update(config).
  - Alert: create(...) returns show(), hide(), update(), destroy — matches lifecycle.
  - Spinner: create(...) returns show(), hide(), destroy but lacks update(config) (it exposes setMessage/setProgress instead).

- Configuration shape varies per component (different keys for similar concepts). Examples:
  - Card: uses title/subtitle/icon/badge/body/footer/headerActions/loading/empty/collapsible
  - Toolbar: uses title/subtitle/breadcrumb/leftActions/rightActions/customActions/searchPlaceholder/primaryButton etc.
  - Alert: uses type/title/message/icon/autoClose/timeout/progress/mode/onClose/autoShow
  - Spinner: uses mode/type/size/backdrop/delay/minDuration/zIndex/message/progress
  This makes integration adapters and standard tooling harder.

- Templating violations: Alert.html contains inline style attributes (progress height and progress-bar width) which violate the project rule “No inline CSS in templates.” Other templates are free of inline CSS. All templates avoid inline JS handlers (good).

- Accessibility inconsistencies and missing conventions:
  - Focus management: show() rarely manages focus or keyboard focus for dismissible elements (Alert dismiss button should be focusable and optionally focused when shown in toast mode).
  - aria-hidden usage varies: some components set aria-hidden on show/hide; others rely on class toggling only.
  - Naming of ARIA callbacks inconsistent (e.g., Alert uses onClose in config while Toolbar uses onSearch/onFilter functions registered via onSearch/onFilter methods).

- Update API inconsistency: Alert has update(config) but Spinner has setMessage/setProgress only. Card and Toolbar rely on targeted setters rather than a single update() method.

- Duplication in helper code patterns: each component implements its own ensureElement(), cloneTemplate(), uid(); a shared tiny utility would reduce duplication (future refactor).

3) Inconsistencies (concrete list)

- Lifecycle methods:
  - Alert: create, show, hide, update, destroy — OK
  - Spinner: create, show, hide, destroy (+setMessage/setProgress) — partially OK
  - Card: create, destroy, and many setters — missing show/hide/update
  - Toolbar: create, destroy, setters — missing show/hide/update

- Config merging behavior:
  - Alert.update merges config (Object.assign) and re-applies; Spinner.applyConfig merges; Card.applyConfig only applied at create and targeted setters exist; Toolbar.applyConfig applied at create but no update method.

- Event/callback registration:
  - Toolbar uses onSearch(fn)/onFilter(fn) methods for handlers.
  - Alert uses onClose config property.
  - Spinner uses no standardized onShow/onHide/onError events.
  - Card exposes no lifecycle events.

- ARIA and focus handling:
  - Alert: role="alert", aria-live, aria-atomic present. Dismiss button exists but not focused on show.
  - Spinner: sets aria-busy on host; spinner role=status used. Good.
  - Toolbar/Card: set role="region" but lack consistent labelled-by usage (Card sets aria-labelledby; Toolbar sets aria-label string).

- Template inline CSS:
  - Alert.html: <div class="progress" style="height:6px;"> and progress-bar style="width:100%" — flagged as violation.
  - Others: no inline style attributes found.

4) Recommended standards (must be applied before integration)

A. Global namespace
- Keep window.SahakarComponents as the single global namespace. Use consistent assignment pattern: window.SahakarComponents.ComponentName = { create }.

B. Standard public lifecycle (required)
- Every component MUST implement this public surface:
  - create(container, config) -> instance
  - instance.show() -> shows/mounts component
  - instance.hide() -> hides component (but does not destroy unless explicitly requested)
  - instance.update(config) -> shallow merge + re-apply configuration
  - instance.destroy() -> remove DOM and clear timers/listeners
- The instance SHOULD also expose id and el (DOM node). Additional helpers (e.g., setMessage) are allowed but optional.

C. Configuration object patterns
- Use common keys where semantics overlap:
  - title, subtitle, icon, body/content, footer, mode ("inline|overlay|fullscreen|toast"), size ("small|medium|large"), type (component-specific like alert type), autoShow (bool), autoClose (bool), timeout (ms), progress (number 0-100), callbacks: onShow, onHide, onClose, onUpdate.
- Actions: use arrays named actions.left, actions.right, actions.custom or flat leftActions/rightActions/customActions but be consistent across components.

D. Events & callbacks
- Uniform callback names: onShow, onHide, onClose, onAction (for action buttons). Components that use event registration (e.g., onSearch) may keep two patterns but document both; preferred is config.onSearch or instance.on('search', handler).

E. Accessibility
- All components MUST provide:
  - role attribute appropriate to component (region/toolbar/alert/status)
  - aria-labelledby for compound widgets that have titles (generate stable id if title is provided)
  - aria-live where dynamic (alerts, messages)
  - set aria-hidden appropriately when hidden and restore when shown
  - manage focus for toast/alert: when showing a dismissible toast in toast mode, do one of: focus dismiss button or expose focus() method for the instance
  - use visually-hidden text for non-text icons

F. Templates and styling
- No inline CSS in templates. Move fixed styles to CSS classes (components can provide a small CSS file or rely on a shared components.css loaded by host). Progress width may be controlled by JS but initial template must not contain style attributes.
- No inline JavaScript in templates (already followed).

G. Utilities
- Recommend creating a very small shared utilities module (Components/_utils.js) to centralize ensureElement(), cloneTemplateById(id), uid(), and safeSetHtml() — implement later but required before large-scale refactor.

H. README template
- Each component README must follow the same template:
  - Purpose
  - Files
  - Features
  - Quick usage (minimal example)
  - Config options (table)
  - Public API (list of methods and signatures)
  - Accessibility notes
  - Integration notes (dependencies like Bootstrap)

5) Required changes before integration (concrete action list)

- Implement uniform lifecycle methods for Card and Toolbar (add show(), hide(), update(config)) so they match Alert and Spinner. Card and Toolbar should not auto-mount unless config.autoShow===true; create should return instance but not force visible state unless autoShow requested. (This is a behaviour change — required before integration.)

- Add update(config) to Spinner to accept full config merging (it already has setMessage/setProgress; update should call applyConfig).

- Remove inline style attributes from Alert.html (progress height and progress-bar width) and replace with CSS classes (e.g., .sahakar-progress-small { height: 6px; } and initial width via class or let JS set width only).

- Standardize config keys across components (rename where needed or add aliases): ensure title/subtitle/icon/body/mode/size/type/autoShow/autoClose/timeout/progress/onShow/onHide/onClose are supported with documented defaults.

- Standardize callback names: convert config.onClose and others to use onClose/onHide/onShow consistently; provide instance.on(event, handler) later if needed.

- Consistent ARIA behavior: ensure show() sets aria-hidden=false and focuses the component appropriately when interactive (e.g., toast dismiss focus). Ensure hide() sets aria-hidden=true and returns focus behavior documented.

- Add tests or manual QA checklist to verify keyboard navigation and screen reader announcement for alerts and toasts.

- Add a small components README template and update each component README to follow it (consistency + machine parsing later).

6) Inline CSS / JS violations found

- Alert.html: contains inline style attributes:
  - <div class="progress" style="height:6px;"> — inline CSS
  - <div class="progress-bar" role="progressbar" style="width:100%" ...> — inline CSS
  These must be removed and replaced with CSS classes or controlled entirely from JS (only runtime width changes allowed programmatically).

- No inline JavaScript handlers were found in templates. Good.

7) Accessibility inconsistencies to resolve

- Add focus management to Alert.show (toast mode) so keyboard users can dismiss easily. Option: focus the dismiss button when shown (configurable).
- Ensure all components expose accessible names: if title is provided, set aria-labelledby on container consistently (Card already does this). Toolbar should generate an id for title and reference it with aria-labelledby instead of only aria-label string (helpful for screen readers).
- Confirm aria-live usage: Alert uses aria-live="polite" which is correct; Spinner messages use aria-live="polite" — OK. Ensure Toolbar uses role="toolbar" and search inputs have aria-label (they do) and keyboard focus order is logical.

8) Component scores (1–10)

- Card: 6/10
  - Pros: solid template, good accessibility for title, rich API for content updates
  - Cons: missing standardized lifecycle methods (show/hide/update), no update(config) merge, no focus management, no documented config table

- Toolbar: 6/10
  - Pros: rich actions model, responsive collapse, search/filter callbacks
  - Cons: missing standard lifecycle, inconsistent event registration conventions, limited accessibility labeling (aria-label string vs labelledby)

- Alert: 8/10
  - Pros: follows lifecycle, update(config) supported, good accessibility attributes, toast container implemented, stacking supported
  - Cons: template contains inline CSS, focus management missing, progress bar implementation uses inline style initial value

- Spinner: 7/10
  - Pros: comprehensive modes and options, delayed show/min duration, aria-busy handling
  - Cons: lacks update(config) method, minimal focus guidance, relies on JS for z-index inline style (acceptable), needs documented config defaults

Overall framework maturity assessment

- Maturity: Early (score 6.5/10)

The set of components demonstrates a consistent architectural pattern (template + factory), good Bootstrap alignment, and reasonable accessibility awareness. However API inconsistency, a small template CSS violation, and missing lifecycle uniformity must be addressed before the component library can be treated as a stable, pluggable UI framework.

Short-term priority (required before wide integration)

1. Enforce the standardized lifecycle (create, show, hide, update, destroy) across all components.
2. Remove inline CSS from templates (Alert.html) and rework progress bar initial state to use classes.
3. Standardize config object keys and callback names; provide aliases for backward compatibility if immediate renames are impractical.
4. Add focus management for alerts/toasts and document accessibility behavior in each README.
5. Add a common README template and update each component README to follow it.

Long-term recommendations

- Add a small shared utilities module for common DOM helpers.
- Add automated visual and accessibility tests (a11y checks) for components.
- Consider building a single components index script (Components/index.js) that registers and documents all components and exports a shared utilities object.

Appendix: Suggested common README template (short)

- Purpose
- Files
- Quick example
- Config options (table)
- Public API (methods)
- Accessibility notes
- Integration notes (dependencies)

End of report.
