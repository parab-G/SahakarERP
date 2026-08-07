(function(){
  /**
   * UnitMasterSchema.js
   * Declarative schema for Unit Master
   * Exposes: this.SahakarSchemas.UnitMaster
   */
  var schema = {
    moduleName: 'UnitMaster',
    sheetName: 'Units',
    displayField: 'Unit Name',
    primaryKey: 'Unit ID',
    schemaVersion: '1.0.0',
    supportsSoftDelete: true,
    supportsSearch: true,
    supportsHistory: true,
    supportsDocuments: false,
    supportsExport: true,
    supportsImport: true,

    indexes: [
      { name: 'idx_unit_code', fields: ['Unit Code'], unique: true }
    ],

    sections: [
      {
        id: 'general',
        title: 'General',
        fields: [
          { name: 'Unit ID', label: 'Unit ID', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: false, visible: true, description: 'Auto-generated primary identifier' },
          { name: 'Unit Code', label: 'Unit Code', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: true, visible: true, validation: { pattern: '^[A-Z0-9_\-]{1,10}$' }, description: 'Short stable code used for integrations' },
          { name: 'Unit Name', label: 'Unit Name', type: 'string', required: true, unique: false, default: '', searchable: true, sortable: true, editable: true, visible: true, validation: { maxLength: 100 }, description: 'Display name of the unit (e.g., Kilogram)' },
          { name: 'Description', label: 'Description', type: 'string', required: false, default: '', searchable: false, sortable: false, editable: true, visible: true }
        ]
      },
      {
        id: 'display',
        title: 'Display & Ordering',
        fields: [
          { name: 'Display Order', label: 'Display Order', type: 'number', required: false, default: 0, searchable: false, sortable: true, editable: true, visible: true },
          { name: 'Active', label: 'Active', type: 'boolean', required: false, default: true, searchable: true, editable: true, visible: true },
          { name: 'Default', label: 'Default', type: 'boolean', required: false, default: false, searchable: true, editable: true, visible: true },
          { name: 'System Record', label: 'System Record', type: 'boolean', required: false, default: false, searchable: false, editable: false, visible: false }
        ]
      },
      {
        id: 'audit',
        title: 'System & Audit',
        fields: [
          { name: 'Created By', label: 'Created By', type: 'string' },
          { name: 'Created Date', label: 'Created Date', type: 'datetime' },
          { name: 'Updated By', label: 'Updated By', type: 'string' },
          { name: 'Updated Date', label: 'Updated Date', type: 'datetime' },
          { name: 'Deleted', label: 'Deleted', type: 'boolean', default: false },
          { name: 'Deleted Date', label: 'Deleted Date', type: 'datetime' }
        ]
      }
    ]
  };

  if (typeof this.SahakarSchemas === 'undefined') this.SahakarSchemas = {};
  this.SahakarSchemas.UnitMaster = schema;
  return schema;
})();
