Pagination component for SahakarERP

Purpose

Reusable Bootstrap 5 Pagination component compatible with Google Apps Script HTMLService.

Files

- Pagination.html — HTML template (<template id="pagination-template">)
- Pagination.js — Component factory and runtime API

Public API

- create(container, config)
- instance.show()
- instance.hide()
- instance.update(config)
- instance.destroy()

Config options (common keys)

- id, className, visible, disabled, theme, callbacks
- currentPage: number
- pageSize: number
- totalRecords: number
- pageSizes: array (e.g., [10,25,50])
- maxButtons: number (max numeric page buttons)
- showFirstLast: boolean
- showPrevNext: boolean
- showInfo: boolean
- disabled: boolean

Events / callbacks

- onPageChange(page)
- onPageSizeChange(size)

Methods

- goTo(page)
- next()
- previous()
- first()
- last()
- setPage(page)
- setTotal(total)
- setPageSize(size)

Accessibility

- aria-labels on nav and buttons
- keyboard support (ArrowLeft/ArrowRight for prev/next)

Usage

Include Pagination.html template and Pagination.js, create instance and listen to events. Host apps should wire server-side pagination via onPageChange.
