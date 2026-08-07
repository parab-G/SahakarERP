(function(){
  /**
   * BankMasterSchema.js
   * Declarative schema for Bank Master module
   * Exposes: this.SahakarSchemas.BankMaster
   */
  var schema = {
    moduleName: 'BankMaster',
    sheetName: 'Banks',
    displayField: 'Bank Name',
    primaryKey: 'Bank ID',
    supportsSoftDelete: true,
    supportsSearch: true,
    supportsHistory: true,
    supportsDocuments: true,
    supportsExport: true,
    supportsImport: true,

    indexes: [
      { name: 'idx_ifsc', fields: ['IFSC Code'], unique: true },
      { name: 'idx_branch_code', fields: ['Branch Code'], unique: false }
    ],

    sections: [
      {
        id: 'general',
        title: 'General',
        fields: [
          { name: 'Bank ID', label: 'Bank ID', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: false, visible: true, description: 'Auto-generated primary identifier' },
          { name: 'Bank Name', label: 'Bank Name', type: 'string', required: true, unique: false, default: '', searchable: true, sortable: true, editable: true, visible: true },
          { name: 'Branch Name', label: 'Branch Name', type: 'string', required: true, unique: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Branch Code', label: 'Branch Code', type: 'string', required: false, unique: false, default: '', searchable: false, editable: true, visible: true },
          { name: 'IFSC Code', label: 'IFSC Code', type: 'string', required: true, unique: true, default: '', searchable: true, editable: true, visible: true }
        ]
      },
      {
        id: 'codes',
        title: 'Codes',
        fields: [
          { name: 'MICR Code', label: 'MICR Code', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true },
          { name: 'SWIFT Code', label: 'SWIFT Code', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true }
        ]
      },
      {
        id: 'address',
        title: 'Address',
        fields: [
          { name: 'Address', label: 'Address', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Village', label: 'Village', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Taluka', label: 'Taluka', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'District', label: 'District', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'State', label: 'State', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Pincode', label: 'Pincode', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true }
        ]
      },
      {
        id: 'contact',
        title: 'Contact',
        fields: [
          { name: 'Phone', label: 'Phone', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true },
          { name: 'Email', label: 'Email', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Website', label: 'Website', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true },
          { name: 'Branch Manager', label: 'Branch Manager', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true }
        ]
      },
      {
        id: 'capabilities',
        title: 'Capabilities',
        fields: [
          { name: 'UPI Supported', label: 'UPI Supported', type: 'boolean', required: false, default: false, searchable: true, editable: true, visible: true },
          { name: 'NEFT Supported', label: 'NEFT Supported', type: 'boolean', required: false, default: true, searchable: true, editable: true, visible: true },
          { name: 'RTGS Supported', label: 'RTGS Supported', type: 'boolean', required: false, default: true, searchable: true, editable: true, visible: true },
          { name: 'IMPS Supported', label: 'IMPS Supported', type: 'boolean', required: false, default: true, searchable: true, editable: true, visible: true },
          { name: 'Cheque Supported', label: 'Cheque Supported', type: 'boolean', required: false, default: true, searchable: true, editable: true, visible: true }
        ]
      },
      {
        id: 'status',
        title: 'Status & Audit',
        fields: [
          { name: 'Active', label: 'Active', type: 'boolean', required: false, default: true, searchable: true, editable: true, visible: true },
          { name: 'Remarks', label: 'Remarks', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true },
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
  this.SahakarSchemas.BankMaster = schema;
  return schema;
})();