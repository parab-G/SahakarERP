# Reference Schema Standard

This standard defines the mandatory schema metadata every Reference Master must include.

Mandatory metadata

- moduleName: string (e.g., "UnitMaster")
- sheetName: string (sheet/tab name)
- displayField: string (user-facing name field)
- primaryKey: string (e.g., "Unit ID")
- supportsSoftDelete: boolean
- supportsSearch: boolean
- supportsHistory: boolean
- supportsExport: boolean
- supportsImport: boolean
- schemaVersion: semantic version (optional but recommended)

Field-level metadata (every field object)

- name: field internal name
- label: user-facing label
- type: string|number|boolean|date|datetime
- required: boolean
- unique: boolean
- default: any
- searchable: boolean
- sortable: boolean
- editable: boolean
- visible: boolean
- validation: object (pattern, min, max, enums)
- description: string

Common fields to include

- Reference Code (short, unique code)
- Reference Name (display name)
- Description
- Display Order (number)
- Active (boolean)
- Default (boolean)
- System Record (boolean)
- CreatedBy, CreatedDate, UpdatedBy, UpdatedDate, Deleted, DeletedDate

Indexes

- Define logical indexes for uniqueness and lookups (name, code)

Dropdown metadata

- Where a field is constrained to a set, include a dropdowns block in the schema listing allowed values

Search & export flags

- Mark fields searchable and exportable explicitly

Example guidance

- Keep reference records small (dozens—not thousands)
- Use short stable codes for integration (avoid wording changes)
