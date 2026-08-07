(function(){
  /**
   * ContractorMasterSchema.js
   * Declarative schema for Contractor Master module
   * Exposes: this.SahakarSchemas.ContractorMaster
   */

  var schema = {
    moduleName: 'ContractorMaster',
    sheetName: 'Contractors',
    displayField: 'Contractor Name',
    primaryKey: 'Contractor ID',
    supportsSoftDelete: true,
    supportsSearch: true,
    supportsHistory: true,
    supportsDocuments: true,
    supportsExport: true,
    supportsImport: true,

    indexes: [
      { name: 'idx_registration_number', fields: ['Registration Number'], unique: true },
      { name: 'idx_gstin', fields: ['GSTIN'], unique: false },
      { name: 'idx_pan', fields: ['PAN'], unique: false }
    ],

    dropdowns: {
      experience_category: ['Junior','Intermediate','Senior','Expert']
    },

    sections: [
      {
        id: 'general',
        title: 'General Information',
        fields: [
          { name: 'Contractor ID', label: 'Contractor ID', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: false, visible: true, validation: { pattern: '^CT-\\d+$' }, description: 'Primary identifier (auto-generated)' },
          { name: 'Contractor Name', label: 'Contractor Name', type: 'string', required: true, unique: false, default: '', searchable: true, sortable: true, editable: true, visible: true, validation: { maxLength: 200 }, description: 'Full name of contractor' },
          { name: 'Firm Name', label: 'Firm Name', type: 'string', required: false, unique: false, default: '', searchable: true, sortable: false, editable: true, visible: true },
          { name: 'Registration Number', label: 'Registration Number', type: 'string', required: true, unique: true, default: '', searchable: true, sortable: true, editable: true, visible: true }
        ]
      },
      {
        id: 'taxes',
        title: 'Tax & Identification',
        fields: [
          { name: 'GSTIN', label: 'GSTIN', type: 'string', required: false, unique: false, default: '', searchable: true, sortable: false, editable: true, visible: true },
          { name: 'PAN', label: 'PAN', type: 'string', required: false, unique: false, default: '', searchable: true, sortable: false, editable: true, visible: true },
          { name: 'Aadhaar', label: 'Aadhaar', type: 'string', required: false, unique: false, default: '', searchable: false, sortable: false, editable: true, visible: false }
        ]
      },
      {
        id: 'licenses',
        title: 'Licenses & Registrations',
        fields: [
          { name: 'Labour License No', label: 'Labour License No', type: 'string', required: false },
          { name: 'Labour License Valid Upto', label: 'Labour License Valid Upto', type: 'date', required: false },
          { name: 'PWD Registration', label: 'PWD Registration', type: 'string', required: false },
          { name: 'PWD Class', label: 'PWD Class', type: 'string', required: false },
          { name: 'PWD Valid Upto', label: 'PWD Valid Upto', type: 'date', required: false },
          { name: 'MES Registration', label: 'MES Registration', type: 'string', required: false },
          { name: 'Railway Registration', label: 'Railway Registration', type: 'string', required: false },
          { name: 'MSME Number', label: 'MSME Number', type: 'string', required: false }
        ]
      },
      {
        id: 'experience',
        title: 'Experience & Classification',
        fields: [
          { name: 'Experience Category', label: 'Experience Category', type: 'string', required: false },
          { name: 'Performance Rating', label: 'Performance Rating', type: 'number', required: false, default: 0 }
        ]
      },
      {
        id: 'contact',
        title: 'Contact',
        fields: [
          { name: 'Contact Person', label: 'Contact Person', type: 'string', required: false },
          { name: 'Mobile', label: 'Mobile', type: 'string', required: true },
          { name: 'Alternate Mobile', label: 'Alternate Mobile', type: 'string', required: false },
          { name: 'Email', label: 'Email', type: 'string', required: false },
          { name: 'Website', label: 'Website', type: 'string', required: false }
        ]
      },
      {
        id: 'address',
        title: 'Address',
        fields: [
          { name: 'Address', label: 'Address', type: 'string', required: false },
          { name: 'Village', label: 'Village', type: 'string', required: false },
          { name: 'Taluka', label: 'Taluka', type: 'string', required: false },
          { name: 'District', label: 'District', type: 'string', required: false },
          { name: 'State', label: 'State', type: 'string', required: false },
          { name: 'Pincode', label: 'Pincode', type: 'string', required: false }
        ]
      },
      {
        id: 'bank',
        title: 'Bank',
        fields: [
          { name: 'Bank Name', label: 'Bank Name', type: 'string', required: false },
          { name: 'Branch', label: 'Branch', type: 'string', required: false },
          { name: 'Account Number', label: 'Account Number', type: 'string', required: false },
          { name: 'IFSC', label: 'IFSC', type: 'string', required: false },
          { name: 'UPI ID', label: 'UPI ID', type: 'string', required: false }
        ]
      },
      {
        id: 'blacklist',
        title: 'Blacklist & Status',
        fields: [
          { name: 'Blacklisted', label: 'Blacklisted', type: 'boolean', required: false, default: false },
          { name: 'Blacklisted By', label: 'Blacklisted By', type: 'string', required: false },
          { name: 'Blacklisted Date', label: 'Blacklisted Date', type: 'date', required: false },
          { name: 'Blacklisted Reason', label: 'Blacklisted Reason', type: 'string', required: false },
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
  this.SahakarSchemas.ContractorMaster = schema;
  return schema;
})();
