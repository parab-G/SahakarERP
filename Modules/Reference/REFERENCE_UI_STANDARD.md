# Reference UI Standard

Purpose

Reference UIs (optional) are lightweight pages to manage small lookup tables. They must reuse existing components and remain accessible and responsive.

Required components

- Toolbar (title, add, refresh)
- SearchBox
- Summary Cards (counts)
- DataTable (rows, actions: view/edit/delete)
- Modal (create/edit)
- Alert (notifications)
- Spinner (loading)
- Pagination (if > pageSize)

Layout & styles

- Use Bootstrap 5 grid and utilities
- No inline CSS or inline JS
- Templates should be simple and loadable before component factories run

Accessibility

- Keyboard navigation: modal focus trap, table row actions reachable by keyboard
- ARIA labels for forms and data tables
- High-contrast friendly colors via ThemeManager

Behavior

- CRUD flows must call server service APIs via google.script.run
- Client-side must handle success, validation errors, and failures gracefully
- Export hooks: provide an unobtrusive export button that calls service or uses client CSV generation

Performance

- Reference lists are small — download all records once and cache in UI components; refresh on create/update/delete

Testing

- Manual UI tests for keyboard flows, screen reader announcements, and responsive behavior
