# Master Module Naming Standards

Purpose

Canonical naming ensures consistency across code, tests, docs and UI.

Folders
- Modules/<ModuleName>Master (PascalCase with 'Master' suffix)

Files
- <ModuleName>Schema.js
- <ModuleName>Validation.js
- <ModuleName>Service.js
- <ModuleName>.html (UI)
- <ModuleName>Script.html (client JS for HTMLService)
- README.md

Classes / Namespaces
- Service: <ModuleName>Service (global object)
- Validation: SahakarValidation.<ModuleName>
- Schema exposure: SahakarSchemas.<ModuleName>

Functions / Methods
- use camelCase for functions: getAll(), getById(id), create(record), softDelete(id)

Variables
- Constants: UPPER_SNAKE or PascalCase for exported constants
- Local vars: camelCase

Events & Callbacks
- event names: <module>.<action> (e.g., unit.created)
- callback keys in config: onCreate, onUpdate, onDelete

HTML IDs & CSS classes
- IDs: moduleName-kebab-action (e.g., unit-master-root)
- CSS classes: sahakar-<component>-<purpose> (e.g., sahakar-card-summary)

Data attributes
- data-sahakar-id, data-sahakar-code for element-level bindings

Examples
- Folder: Modules/UnitMaster
- Service: UnitMasterService
- Validation: SahakarValidation.UnitMaster
- Schema: SahakarSchemas.UnitMaster
