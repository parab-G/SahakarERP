Alert component for SahakarERP

Purpose

Reusable Bootstrap 5 Alert/Toast component compatible with Google Apps Script HTMLService.

Files

- Alert.html — HTML template (<template id="alert-template">).
- Alert.js — Component factory and runtime API.

Features

- Inline and toast modes
- Types: success, danger, warning, info, primary, secondary
- Icon, title, message, dismiss button
- Auto-close with timeout and optional progress indicator
- Stacked alerts and callbacks

Quick example

<script>
  const a = window.SahakarComponents.Alert.create('#alerts', { type: 'success', title: 'Saved', message: 'Saved successfully', autoClose: true, timeout: 4000 });
  a.show();
</script>

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.destroy()

Config options (common keys)

- id, className, visible, disabled, theme, callbacks
- type, title, message, icon, autoClose, timeout, progress, mode, progressHeight

Accessibility notes

- Alerts use role="alert" and aria-live for screen readers.
- In toast mode the dismiss button is focused when shown to aid keyboard users.

Integration notes

- Requires Bootstrap 5 CSS.
- Include Alert.html template in the page before creating instances.
