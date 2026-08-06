Card component for SahakarERP

Purpose

Reusable Bootstrap 5 Card component compatible with Google Apps Script HTMLService.

Files

- Card.html — HTML template (<template id="card-template">).
- Card.js — Component factory and runtime API.

Features

- title, subtitle, icon, badge
- header actions
- body and footer content
- loading and empty states
- collapsible mode
- Accessible and responsive

Quick example

<script src="/Components/Card/Card.js"></script>
<div id="my-card-container"></div>
<script>
  const card = window.SahakarComponents.Card.create('#my-card-container', {
    title: 'Overview',
    subtitle: 'Summary',
    visible: true,
    callbacks: { onShow: () => console.log('shown') }
  });
  card.show();
</script>

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.destroy()
- instance.setBody(content) // helper
- instance.setTitle(text) // helper

Config options (common keys)

- id: string
- className: string (space-separated)
- visible: boolean
- disabled: boolean
- theme: string
- callbacks: { onShow, onHide, onUpdate }
- title, subtitle, icon, badge, body, footer, collapsible, loading, empty, emptyMessage

Accessibility notes

- Card sets aria-labelledby on its region using the title when provided.
- Use callbacks to manage focus if needed.

Integration notes

- Requires Bootstrap 5 CSS.
- Include Card.html template in the page before creating instances.
