# Components/Core — Core Framework README

Purpose
-------
This Core Framework provides the shared foundation for every SahakarERP UI component. It centralizes lifecycle behavior, configuration merging, event handling, accessibility helpers, theming tokens, DOM utilities, and component registration.

Why Core exists
- Eliminate duplicated helper code across components.
- Standardize public lifecycle and event semantics.
- Improve accessibility, theming, and maintainability.
- Allow gradual migration of legacy components via a non-invasive integration layer.

Architecture goals
- Small, focused modules with clear responsibilities.
- Backward-compatible adoption: runtime integration first, then source-level migration.
- Predictable lifecycle and consistent configuration patterns.
- Lightweight; avoid imposing heavy runtime overhead.

Why components must use it
- Consistency: common lifecycle and config semantics.
- Interoperability: uniform event and registry model for dynamic loading.
- Maintainability: central testable utilities reduce bugs and duplication.

Files and responsibilities
--------------------------
- BaseComponent.js
  - Provides standard lifecycle scaffolding and base config application (id, className, visible, disabled, theme, callbacks).
  - Houses emitter wiring and convenience on/off API forwarded to EventEmitter.

- EventEmitter.js
  - Lightweight publish/subscribe used by BaseComponent and components for runtime events.
  - API: on(name, fn), off(name, fn), once(name, fn), emit(name, payload).

- ComponentRegistry.js
  - In-memory registry mapping component names to factory functions.
  - API: register(name, factory), getFactory(name), list().

- ComponentFactory.js
  - Runtime helper to create instances by name via the registry: createByName(name, container, config).

- ConfigManager.js
  - Simple defaults merge and pick utilities. Central place for future validation.
  - API: mergeDefaults(defaults, cfg), pick(obj, keys).

- SharedHelpers.js
  - DOM and utility helpers: uid, ensureElement, cloneTemplateById, debounce, throttle, safeInnerHTML.
  - Use for consistent DOM handling and small utilities.

- Accessibility.js
  - Focus trap, aria helpers, and live region announcer used by BaseComponent or components.
  - Exposes: trapFocus(container) -> unregister, setAriaHidden(el, hidden), announceLive(text, polite).

- ThemeManager.js
  - Centralized theme token manager. Set CSS variables (tokens) and read runtime values.
  - API: setTheme(name, vars), getThemeVars(), defaultVars.

- Integrations.js
  - Non-invasive runtime shim that augments legacy factories to use Core features (wrapping factories, attaching BaseComponent, registering with ComponentRegistry).
  - Intended as a short-term compatibility bridge.

Dependencies
------------
- Host pages must include Bootstrap 5 for styling and layout.
- Core modules are pure JS and assume a DOM environment.
- Components should import/use Core modules via window.SahakarComponents.Core namespace.

Architecture diagram (ASCII)
---------------------------
Components (Card, Toolbar, ...)
        ↓            (factories)
Integrations.js (shim) — optional runtime augmentation
        ↓
BaseComponent <── EventEmitter
   ↓
SharedHelpers
   ↓
Utilities (ConfigManager, ThemeManager, Accessibility)

Simpler flow (native components):
Component Factory → BaseComponent → SharedHelpers / Accessibility / ThemeManager → EventEmitter

Component lifecycle (diagram)
-----------------------------
create(container, config)
    ↓
show()  ⇄  hide()
    ↓
update(config)
    ↓
loading() / disabled() toggles (state helpers)
    ↓
destroy()

Lifecycle — contact points
- create(): clone template, bind refs, call BaseComponent.applyBaseConfig, wire emitter and callbacks.
- show(): make visible, emit 'show'.
- hide(): hide, emit 'hide'.
- update(): apply new config via ConfigManager and BaseComponent.applyBaseConfig, emit 'update'.
- destroy(): unbind events, remove DOM, emit 'destroy'.

Configuration flow
------------------
ConfigManager.mergeDefaults(defaults, cfg)
        ↓
BaseComponent.applyBaseConfig(mergedConfig)
        ↓
Component-specific applyConfig(mergedConfig)

Event flow
----------
Component (user actions) → instance.emitter.emit('event', payload)
                           → EventEmitter notifies listeners
                           → config.callbacks invoked via BaseComponent wiring or instance.on handlers

Component registration
---------------------
- Registry holds named factories.
- Factories should register themselves or rely on Integrations.js to register legacy factories.
- ComponentFactory.createByName(name, container, config) instantiates components by name for dynamic loading.

Accessibility, Theme, Shared Helpers
------------------------------------
- Accessibility.js provides focus management and announcements — use trapFocus for modals and dialogs.
- ThemeManager exposes tokens as CSS variables; components should read tokens via getComputedStyle or ThemeManager.getThemeVars.
- SharedHelpers contains safe DOM utilities; use cloneTemplateById instead of manual template cloning.

Integration strategy
--------------------
- Legacy components → Integration layer (Integrations.js) → Core augmentation at runtime. No source edits required.
- After validation, refactor components to use Core primitives directly (replace local helpers with SharedHelpers, wire BaseComponent in code, use EventEmitter for events).
- Eventually publish native Core-based components that require the Core at load-time.

Coding rules (must follow)
--------------------------
- Use BaseComponent for lifecycle and config application.
- Use ConfigManager.mergeDefaults for default resolution; do not reimplement merging logic.
- Use EventEmitter for runtime events; avoid direct callback lists when possible.
- Use SharedHelpers for DOM helpers: uid, ensureElement, cloneTemplateById, debounce/throttle, safeInnerHTML.
- Use Accessibility helpers for focus trapping and live announcements.
- Consume theme values from ThemeManager (CSS variables) — avoid hardcoded z-index, sizes, or spacing.
- Do not place inline JavaScript or inline CSS in templates.

What must never be duplicated
- UID, ensureElement, cloneTemplate logic
- EventEmitter implementation
- Config merging utilities
- Focus trap and aria helper code
- Theme token constants

What belongs inside Core
- Any utility used by multiple components: DOM helpers, event system, config manager, accessibility helpers, theme tokens, registry/factory logic.

Migration strategy
------------------
Current (short term):
- Run Integrations.js to augment legacy factories at runtime; preserves backward compatibility.

Migration steps (recommended):
1. Pick a pilot component (SearchBox recommended).
2. Replace local helper functions with SharedHelpers imports (uid, ensureElement, cloneTemplateById).
3. Create an instance of BaseComponent in the component source and call applyBaseConfig early in create().
4. Replace ad-hoc callback invocations with emitter.emit('event') and instance.on('event', handler).
5. Replace JS hard-coded visual tokens with ThemeManager.getThemeVars or CSS vars.
6. Add unit/manual accessibility tests.
7. Repeat for other components iteratively.

Long-term (native):
- Components are authored against Core APIs (no Integrations shim required). ERP modules use ComponentFactory/Registry or direct imports.

Future roadmap (Core support)
----------------------------
- Form controls: Input, Select, DatePicker, complex FormBuilder components — Core will provide validation helpers and focus management.
- File Upload (Drive-aware uploader): SharedHelpers + ConfigManager for storage config, progress tokens via ThemeManager.
- Charts: shared data adapters and small chart wrappers that use ThemeManager for colors.
- ERP Module scaffolding: standardized patterns and examples showing how to use components in real modules.

Best practices
--------------
- Keep components small and focused; compose for complex UIs.
- Prefer config-driven behavior over hardcoded DOM manipulation.
- Expose clear, minimal public APIs and document them in README.md per component.
- Emit semantic events and keep callback names consistent (onOpen, onClose, onSelect).

Anti-patterns
-------------
- Copying utility functions into multiple components.
- Direct DOM manipulation of other component instances.
- Inline styles or scripts in templates.
- Bypassing BaseComponent for lifecycle management.

Developer checklist
-------------------
- [ ] Include component template in an HTML <template id="..."> file.
- [ ] Use SharedHelpers.cloneTemplateById to clone the template.
- [ ] Merge config with ConfigManager.mergeDefaults and apply via BaseComponent.applyBaseConfig.
- [ ] Wire events via instance.emitter (EventEmitter) and document emitted events.
- [ ] Use Accessibility.trapFocus for dialogs and restore focus on destroy.
- [ ] Read theme tokens via ThemeManager.getThemeVars and avoid hardcoded constants.
- [ ] Provide README.md with API, config, accessibility notes, and examples.

AI Agent checklist
------------------
- [ ] Read AI/PROJECT_CONTEXT.md, AI/ARCHITECTURE.md, AI/CODING_STANDARDS.md before changes.
- [ ] Do not change ModuleLoader or other modules unless requested.
- [ ] Use Integrations.js for non-invasive augmentation when refactor is not permitted.
- [ ] When refactoring, update component README and run manual accessibility checks.
- [ ] Preserve backward compatibility unless the user explicitly allows breaking changes.

Contact & contribution
----------------------
- Follow repository contribution rules and open a PR with clear description when refactoring components to adopt Core.

---

End of Core README
