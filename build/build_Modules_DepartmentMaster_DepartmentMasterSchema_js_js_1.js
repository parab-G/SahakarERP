(function(){
  /**
   * DepartmentMasterSchema.js
   * Declarative schema for Department Master module
   * Exposes: this.SahakarSchemas.DepartmentMaster
   */
  var schema = {
    moduleName: 'DepartmentMaster',
    sheetName: 'Departments',
    displayField: 'Department Name',
    primaryKey: 'Department ID',
    supportsSoftDelete: true,
    supportsSearch: true,
    supportsHistory: true,
    supportsDocuments: true,
    supportsExport: true,
    supportsImport: true,

    indexes: [
      { name: 'idx_dept_code', fields: ['Department Code'], unique: true },
      { name: 'idx_dept_name', fields: ['Department Name'], unique: true }
    ],

    dropdowns: {
      department_type: [
        'Zilla Parishad','PWD','Harbour','Forest','Irrigation','MJP','MIDC','Municipal Council','Gram Panchayat','Panchayat Samiti','State Government','Central Government','Other'
      ]
    },

    sections: [
      {
        id: 'general',
        title: 'General',
        fields: [
          { name: 'Department ID', label: 'Department ID', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: false, visible: true, description: 'Auto-generated primary identifier' },
          { name: 'Department Code', label: 'Department Code', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: true, visible: true, description: 'Unique code for department' },
          { name: 'Department Name', label: 'Department Name', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: true, visible: true },
          { name: 'Department Type', label: 'Department Type', type: 'string', required: true, default: '', searchable: true, editable: true, visible: true, description: 'Select from department types dropdown' },
          { name: 'Parent Department', label: 'Parent Department', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true, description: 'Optional parent Department ID' },
          { name: 'Short Name', label: 'Short Name', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true }
        ]
      },
      {
        id: 'contact',
        title: 'Contact & Office',
        fields: [
          { name: 'Office Address', label: 'Office Address', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Village', label: 'Village', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Taluka', label: 'Taluka', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'District', label: 'District', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'State', label: 'State', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Pincode', label: 'Pincode', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true }
        ]
      },
      {
        id: 'communication',
        title: 'Communication',
        fields: [
          { name: 'Office Phone', label: 'Office Phone', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true },
          { name: 'Email', label: 'Email', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Website', label: 'Website', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true }
        ]
      },
      {
        id: 'contact_officer',
        title: 'Contact Officer',
        fields: [
          { name: 'Contact Officer', label: 'Contact Officer', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Designation', label: 'Designation', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true }
        ]
      },
      {
        id: 'finance',
        title: 'Finance & Status',
        fields: [
          { name: 'GST Applicable', label: 'GST Applicable', type: 'boolean', required: false, default: false, searchable: true, editable: true, visible: true },
          { name: 'GST Number', label: 'GST Number', type: 'string', required: false, default: '', searchable: true, editable: true, visible: true },
          { name: 'Active', label: 'Active', type: 'boolean', required: false, default: true, searchable: true, editable: true, visible: true },
          { name: 'Remarks', label: 'Remarks', type: 'string', required: false, default: '', searchable: false, editable: true, visible: true }
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
  this.SahakarSchemas.DepartmentMaster = schema;
  return schema;
})();
