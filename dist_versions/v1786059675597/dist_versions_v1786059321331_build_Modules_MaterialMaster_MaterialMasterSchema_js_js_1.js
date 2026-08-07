(function(){
  /**
   * MaterialMasterSchema.js
   * Declarative schema for Material Master module
   * Exposes: this.SahakarSchemas.MaterialMaster
   */
  var schema = {
    moduleName: 'MaterialMaster',
    sheetName: 'Materials',
    displayField: 'Material Name',
    primaryKey: 'Material ID',
    supportsSoftDelete: true,
    supportsSearch: true,
    supportsHistory: true,
    supportsDocuments: true,
    supportsExport: true,
    supportsImport: true,

    indexes: [
      { name: 'idx_material_code', fields: ['Material Code'], unique: true }
    ],

    dropdowns: {
      material_category: ['Cement','Steel','Sand','Aggregate','Bricks','Electrical','Plumbing','Paint','Hardware','Tools','Machinery','Office','Safety','Miscellaneous'],
      material_type: ['Raw Material','Finished Goods','Consumable','Asset','Service'],
      unit: ['kg','g','m','cm','mm','ltr','pcs','bundle','tonne','sqm']
    },

    sections: [
      {
        id: 'general',
        title: 'General',
        fields: [
          { name: 'Material ID', label: 'Material ID', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: false, visible: true, description: 'Auto-generated primary identifier' },
          { name: 'Material Code', label: 'Material Code', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: true, visible: true },
          { name: 'Material Name', label: 'Material Name', type: 'string', required: true, unique: false, default: '', searchable: true, sortable: true, editable: true, visible: true },
          { name: 'Material Category', label: 'Material Category', type: 'string', required: false },
          { name: 'Sub Category', label: 'Sub Category', type: 'string', required: false },
          { name: 'Material Type', label: 'Material Type', type: 'string', required: false }
        ]
      },
      {
        id: 'commercial',
        title: 'Commercial',
        fields: [
          { name: 'HSN Code', label: 'HSN Code', type: 'string', required: false },
          { name: 'Unit', label: 'Unit', type: 'string', required: true },
          { name: 'GST Rate', label: 'GST Rate', type: 'number', required: true },
          { name: 'Preferred Supplier', label: 'Preferred Supplier', type: 'string', required: false },
          { name: 'Brand', label: 'Brand', type: 'string', required: false }
        ]
      },
      {
        id: 'specs',
        title: 'Specification',
        fields: [
          { name: 'Specification', label: 'Specification', type: 'string', required: false },
          { name: 'Grade', label: 'Grade', type: 'string', required: false },
          { name: 'Size', label: 'Size', type: 'string', required: false },
          { name: 'Colour', label: 'Colour', type: 'string', required: false },
          { name: 'Manufacturer', label: 'Manufacturer', type: 'string', required: false }
        ]
      },
      {
        id: 'stock',
        title: 'Stock & Rates',
        fields: [
          { name: 'Minimum Stock', label: 'Minimum Stock', type: 'number', required: false, default: 0 },
          { name: 'Maximum Stock', label: 'Maximum Stock', type: 'number', required: false, default: 0 },
          { name: 'Reorder Level', label: 'Reorder Level', type: 'number', required: false, default: 0 },
          { name: 'Opening Stock', label: 'Opening Stock', type: 'number', required: false, default: 0 },
          { name: 'Current Stock', label: 'Current Stock', type: 'number', required: false, default: 0 },
          { name: 'Opening Rate', label: 'Opening Rate', type: 'number', required: false, default: 0 },
          { name: 'Standard Rate', label: 'Standard Rate', type: 'number', required: false, default: 0 },
          { name: 'Last Purchase Rate', label: 'Last Purchase Rate', type: 'number', required: false, default: 0 }
        ]
      },
      {
        id: 'storage',
        title: 'Storage & Identification',
        fields: [
          { name: 'Storage Location', label: 'Storage Location', type: 'string', required: false },
          { name: 'Shelf Number', label: 'Shelf Number', type: 'string', required: false },
          { name: 'Rack Number', label: 'Rack Number', type: 'string', required: false },
          { name: 'Barcode', label: 'Barcode', type: 'string', required: false },
          { name: 'QR Code', label: 'QR Code', type: 'string', required: false }
        ]
      },
      {
        id: 'flags',
        title: 'Flags',
        fields: [
          { name: 'Is Inventory Item', label: 'Is Inventory Item', type: 'boolean', required: false, default: true },
          { name: 'Is Consumable', label: 'Is Consumable', type: 'boolean', required: false, default: false },
          { name: 'Is Asset', label: 'Is Asset', type: 'boolean', required: false, default: false },
          { name: 'Active', label: 'Active', type: 'boolean', required: false, default: true },
          { name: 'Remarks', label: 'Remarks', type: 'string', required: false }
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
  this.SahakarSchemas.MaterialMaster = schema;
  return schema;
})();
