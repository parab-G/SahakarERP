SearchBox component for SahakarERP

Purpose

Reusable Bootstrap 5 SearchBox component compatible with Google Apps Script HTMLService.

Files

- SearchBox.html — HTML template (<template id="searchbox-template">).
- SearchBox.js — Component factory and runtime API.

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.destroy()

Config options (common keys)

- id, className, visible, disabled, theme, callbacks
- placeholder: string
- value: string
- debounce: number (ms)
- clearButton: boolean
- icon: className (e.g., 'bi bi-search')
- size: 'sm' | 'md' | 'lg'
- disabled: boolean

Events / callbacks

- onInput(value)
- onSearch(value)
- onClear()
- onFocus()
- onBlur()

Methods

- getValue()
- setValue(value)
- clear()
- focus()
- enable()
- disable()

Features

- Live input with configurable debounce
- Enter key initiates search callback
- ESC clears input
- Optional clear button
- Accessible: aria-label, keyboard support, visually-hidden labels

Usage example

<script src="/Components/SearchBox/SearchBox.js"></script>
<div id="search-root"></div>
<script>
  const sb = window.SahakarComponents.SearchBox.create('#search-root', { placeholder: 'Search...', debounce: 250 });
  sb.onSearch = (q) => console.log('search', q);
</script>

Notes

- Requires Bootstrap 5 CSS.
- Include SearchBox.html template in the page before creating instances.
