Modal component for SahakarERP

Purpose

Reusable Bootstrap 5 Modal component compatible with Google Apps Script HTMLService.

Files

- Modal.html — HTML template (<template id="modal-template">)
- Modal.js — Component factory and runtime API

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.destroy()

Key config options

- title, subtitle, body, footer
- size: 'sm' | 'md' | 'lg' | 'xl'
- scrollable: boolean
- centered: boolean
- fullscreen: boolean
- backdrop: boolean
- keyboard: boolean (ESC to close)
- closeButton: boolean
- primaryButton, secondaryButton, dangerButton: { text, onClick }
- theme
- callbacks: { onOpen, onClose, onPrimary, onSecondary, onDanger }

Features

- Focus trap while modal open
- ESC to close (configurable)
- Backdrop click to close (configurable)
- Loading / error / success states in the footer area
- Accessible ARIA roles and attributes
- Dynamic content and buttons

Usage example

<script src="/Components/Modal/Modal.js"></script>
<div id="page-root"></div>
<script>
  const modal = window.SahakarComponents.Modal.create('#page-root', {
    title: 'Confirm',
    body: '<p>Are you sure?</p>',
    primaryButton: { text: 'Yes', onClick: () => { console.log('primary'); modal.hide(); } },
    secondaryButton: { text: 'Cancel', onClick: () => modal.hide() },
  });

  modal.show();
</script>

Accessibility notes

- Modal uses role="dialog" and aria-modal="true" when shown.
- Title element is referenced by aria-labelledby for screen readers.
- Focus is trapped inside the modal; focus returns to the previously focused element on close.

Integration notes

- Requires Bootstrap 5 CSS for visual styles.
- Include Modal.html template in the page before creating instances.
