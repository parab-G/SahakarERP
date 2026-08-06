DataTable component for SahakarERP

Purpose

Responsive, accessible Bootstrap 5 data table component compatible with Google Apps Script HTMLService.

Files

- DataTable.html — HTML template (<template id="datatable-template">)
- DataTable.js — Component factory and runtime API

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.destroy()

Key config options

- columns: [{ key, title, sortable (bool), width }]  // width optional
- rows: array of objects matching column keys
- pageSize: number
- sortable: bool
- searchable: bool
- selectable: bool
- actions: array of action definitions { key, label }
- emptyMessage: string
- loading: bool

Events (callbacks)

- onRowClick(row, rowIndex)
- onSelectionChanged(selectedRows)
- onSort(columnKey, direction)
- onPageChange(page)
- onAction(actionKey, row)

Accessibility

- role="grid" on table
- column headers use role="columnheader" and aria-sort
- rows use role="row" and each cell role="gridcell"
- keyboard navigation: arrow up/down to move focus between rows, Enter to select/activate

Notes

- Include DataTable.html template in the host page before creating instances.
- Requires Bootstrap 5 CSS.
- The component intentionally exposes a small API surface; host code should wire server-side pagination if data is large (use onPageChange).
