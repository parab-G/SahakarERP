Spinner component for SahakarERP

Purpose

Reusable Bootstrap 5 Spinner component compatible with Google Apps Script HTMLService.

Files

- Spinner.html — HTML template (<template id="spinner-template">).
- Spinner.js — Component factory and runtime API.

Features

- Sizes: small, medium, large
- Types: border and grow
- Modes: inline, overlay, fullscreen
- Loading text and progress percentage
- Backdrop options and z-index control
- Delayed show and minimum visible duration to avoid flicker
- Accessible: aria-busy and role/status messages

Quick example

<script src="/Components/Spinner/Spinner.js"></script>
<div id="list-container"></div>
<script>
  const spinner = window.SahakarComponents.Spinner.create('#list-container', { mode: 'overlay', type: 'border', size: 'medium', backdrop: true });
  spinner.show();
</script>

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.setMessage(text)
- instance.setProgress(percent)
- instance.destroy()

Config options (common keys)

- id, className, visible, disabled, theme, callbacks
- mode, type, size, backdrop, backdropTransparent, delay, minDuration, zIndex, message

Accessibility notes

- Spinner sets aria-busy on the host element while visible.
- Spinner message area uses aria-live="polite" for screen reader updates.

Integration notes

- Requires Bootstrap 5 CSS.
- Include Spinner.html template in the page before creating instances.

