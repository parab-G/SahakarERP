Toolbar component for SahakarERP

Purpose

Reusable Bootstrap 5 Toolbar component compatible with Google Apps Script HTMLService.

Files

- Toolbar.html — HTML template (<template id="toolbar-template">).
- Toolbar.js — Component factory and runtime API.

Features

- Title, subtitle, breadcrumb
- Left / right / custom action areas
- Search and filter inputs with callbacks
- Primary / secondary / import / export / refresh CTA helpers
- Responsive collapse for small screens

Quick example

<script src="/Components/Toolbar/Toolbar.js"></script>
<div id="toolbar-root"></div>
<script>
  const t = window.SahakarComponents.Toolbar.create('#toolbar-root', { title: 'Work Orders', visible: true });
  t.onSearch(q => console.log('search', q));
</script>

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.destroy()
- instance.setLeftActions(items), setRightActions(items), setCustomActions(items)
- instance.onSearch(fn), instance.onFilter(fn)

Config options (common keys)

- id, className, visible, disabled, theme, callbacks
- title, subtitle, breadcrumb, searchPlaceholder, filterPlaceholder
- leftActions, rightActions, customActions, primaryButton, secondaryButton

Accessibility notes

- Toolbar uses role="toolbar" and provides aria-label/aria-labelledby. Show() focuses the search input to improve keyboard access.

Integration notes

- Requires Bootstrap 5 CSS.
- Include Toolbar.html template in the page before creating instances.
