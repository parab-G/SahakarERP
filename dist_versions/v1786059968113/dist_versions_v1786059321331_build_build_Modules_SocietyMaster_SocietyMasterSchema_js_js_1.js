/**
 * SocietyMasterSchema.js
 *
 * Schema definition for the Society Master module.
 * This file contains only the schema metadata and documentation comments.
 * It does NOT implement CRUD or integration logic. It is intended to be
 * consumed by SchemaService.js or other provisioning scripts.
 *
 * Style: Apps Script friendly plain JS. Attach schema to a known global
 * namespace for easy discovery by other tools: window.SahakarSchemas.SocietyMaster
 *
 * IMPORTANT: This is a declarative schema only. Validation and enforcement
 * should be performed server-side by the module service.
 */

(function(){
  'use strict';

  // Module-level metadata
  var SocietyMasterSchema = {
    moduleName: 'SocietyMaster',               // logical module name
    sheetName: 'Society_Master',               // suggested sheet/tab name for provisioning
    displayField: 'name',                      // primary display field used in lookups
    primaryKey: 'id',                          // primary key column
    supportsSoftDelete: true,
    supportsSearch: true,
    supportsHistory: true,
    supportsDocuments: true,
    supportsExport: true,
    supportsImport: true,

    // Indexes and lookup suggestions
    indexes: [
      { name: 'idx_society_code', fields: ['society_code'], unique: true },
      { name: 'idx_uuid', fields: ['uuid'], unique: true },
      { name: 'idx_gstin', fields: ['gstin'], unique: false },
      { name: 'idx_pan', fields: ['pan'], unique: false }
    ],

    uniqueIndexes: [ ['society_code'], ['uuid'] ],

    // Suggested lookup fields for relationships
    lookupFields: {
      byId: 'id',
      byUUID: 'uuid',
      byCode: 'society_code',
      byName: 'name'
    },

    // Dropdowns and enums to be used by UI (key -> {label,value[]})
    dropdowns: {
      society_type: {
        label: 'Society Type',
        values: [
          { value: 'cooperative', label: 'Cooperative' },
          { value: 'society', label: 'Society' },
          { value: 'trust', label: 'Trust' },
          { value: 'company', label: 'Company' }
        ]
      },
      bank_account_type: {
        label: 'Bank Account Type',
        values: [
          { value: 'savings', label: 'Savings' },
          { value: 'current', label: 'Current' }
        ]
      },
      gst_registration_type: {
        label: 'GST Registration Type',
        values: [
          { value: 'regular', label: 'Regular' },
          { value: 'composition', label: 'Composition' },
          { value: 'unregistered', label: 'Unregistered' }
        ]
      }
    },

    // Reserved for future expansion
    reservedFields: [ 'custom_field_1', 'custom_field_2', 'metadata_json' ],

    // Field groups and detailed field metadata
    sections: [
      {
        key: 'general',
        title: 'General Information',
        description: 'Core identifying fields for the society',
        fields: [
          {
            name: 'id', label: 'ID', type: 'integer', required: true, unique: true,
            default: null, searchable: true, sortable: true, editable: false, visible: true,
            validation: 'auto-increment integer primary key',
            description: 'Primary numeric identifier (PK) assigned by the system.'
          },
          {
            name: 'uuid', label: 'UUID', type: 'string', required: true, unique: true,
            default: 'uuidv4()', searchable: true, sortable: false, editable: false, visible: false,
            validation: 'UUID v4 string',
            description: 'Globally unique identifier for external integrations and stable references.'
          },
          {
            name: 'society_code', label: 'Society Code', type: 'string', required: true, unique: true,
            default: null, searchable: true, sortable: true, editable: true, visible: true,
            validation: '^[A-Za-z0-9\-_]{3,15}$',
            description: 'Short unique code used for quick references and imports (alphanumeric, 3-15 chars).'
          },
          {
            name: 'name', label: 'Society Name', type: 'string', required: true, unique: false,
            default: null, searchable: true, sortable: true, editable: true, visible: true,
            validation: 'max 200 chars, not empty',
            description: 'Full descriptive name of the society.'
          },
          {
            name: 'short_name', label: 'Short Name', type: 'string', required: false, unique: false,
            default: null, searchable: false, sortable: false, editable: true, visible: true,
            validation: 'max 50 chars',
            description: 'Short or display name used in compact UIs.'
          },
          {
            name: 'legal_name', label: 'Legal Name', type: 'string', required: false, unique: false,
            default: null, searchable: false, sortable: false, editable: true, visible: false,
            validation: 'max 300 chars',
            description: 'Official registered/legal name used for statutory documents.'
          },
          {
            name: 'society_type', label: 'Society Type', type: 'string', required: true, unique: false,
            default: 'cooperative', searchable: true, sortable: true, editable: true, visible: true,
            validation: 'enum',
            description: 'Type of organization. Values sourced from dropdown: cooperative, society, trust, company.'
          },
          {
            name: 'registration_number', label: 'Registration Number', type: 'string', required: false, unique: false,
            default: null, searchable: true, sortable: false, editable: true, visible: true,
            validation: 'alphanumeric, max 50',
            description: 'Registrar-provided registration identifier if available.'
          },
          {
            name: 'registration_date', label: 'Registration Date', type: 'date', required: false, unique: false,
            default: null, searchable: false, sortable: true, editable: true, visible: true,
            validation: 'date, not future',
            description: 'Official date of registration.'
          }
        ]
      },
      {
        key: 'address',
        title: 'Address',
        description: 'Physical and postal address fields',
        fields: [
          { name: 'address_line1', label: 'Address Line 1', type: 'string', required: true, unique: false, default: null, searchable: true, sortable: false, editable: true, visible: true, validation: 'max 200 chars', description: 'Primary street address.' },
          { name: 'address_line2', label: 'Address Line 2', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: true, validation: 'max 200 chars', description: 'Address continuation.' },
          { name: 'city', label: 'City', type: 'string', required: true, unique: false, default: null, searchable: true, sortable: true, editable: true, visible: true, validation: 'max 100 chars', description: 'City or town.' },
          { name: 'district', label: 'District', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: true, validation: 'max 100 chars', description: 'District/County.' },
          { name: 'state', label: 'State', type: 'string', required: true, unique: false, default: null, searchable: true, sortable: true, editable: true, visible: true, validation: 'must match master list', description: 'State or region (master list controlled).' },
          { name: 'pincode', label: 'PIN Code', type: 'string', required: true, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: true, validation: 'numeric 4-8 chars depending on country', description: 'Postal code / ZIP' },
          { name: 'country', label: 'Country', type: 'string', required: true, unique: false, default: 'IN', searchable: true, sortable: true, editable: true, visible: true, validation: 'ISO 3166-1 alpha-2 or full name', description: 'Country code or name.' }
        ]
      },
      {
        key: 'contact',
        title: 'Contact',
        description: 'Primary contact points for the society',
        fields: [
          { name: 'phone', label: 'Phone', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: true, validation: 'local or E.164', description: 'Landline phone number.' },
          { name: 'mobile', label: 'Mobile', type: 'string', required: false, unique: false, default: null, searchable: true, sortable: false, editable: true, visible: true, validation: 'E.164 preferred', description: 'Primary mobile/WhatsApp contact.' },
          { name: 'email', label: 'Email', type: 'string', required: false, unique: false, default: null, searchable: true, sortable: false, editable: true, visible: true, validation: 'email format', description: 'Primary contact email.' },
          { name: 'alternate_email', label: 'Alternate Email', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: false, validation: 'email format', description: 'Backup contact email.' },
          { name: 'website', label: 'Website', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: true, validation: 'url', description: 'Official website.' }
        ]
      },
      {
        key: 'bank',
        title: 'Bank',
        description: 'Primary banking details used for payments and reconciliation',
        fields: [
          { name: 'primary_bank_name', label: 'Bank Name', type: 'string', required: false, unique: false, default: null, searchable: true, sortable: false, editable: true, visible: true, validation: 'max 100 chars', description: 'Primary bank name.' },
          { name: 'primary_branch', label: 'Bank Branch', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: true, validation: 'max 100 chars', description: 'Bank branch name or code.' },
          { name: 'account_number', label: 'Account Number', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: false, validation: 'numeric string - sensitive; mask in UI', description: 'Primary bank account (mask for display).' },
          { name: 'ifsc_code', label: 'IFSC', type: 'string', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: false, validation: 'IFSC pattern for India', description: 'IFSC code for Indian bank transfers.' },
          { name: 'bank_account_type', label: 'Account Type', type: 'string', required: false, unique: false, default: 'current', searchable: false, sortable: false, editable: true, visible: true, validation: 'enum', description: 'Savings or Current.' },
          { name: 'bank_currency', label: 'Currency', type: 'string', required: false, unique: false, default: 'INR', searchable: false, sortable: false, editable: true, visible: true, validation: 'ISO 4217', description: 'Currency for bank account.' }
        ]
      },
      {
        key: 'tax',
        title: 'Tax Information',
        description: 'GSTIN, PAN and tax related attributes',
        fields: [
          { name: 'gstin', label: 'GSTIN', type: 'string', required: false, unique: true, default: null, searchable: true, sortable: false, editable: true, visible: true, validation: 'country-specific GST format', description: 'Goods & Services Tax Identification Number.' },
          { name: 'gst_registration_type', label: 'GST Registration Type', type: 'string', required: false, unique: false, default: 'regular', searchable: false, sortable: false, editable: true, visible: true, validation: 'enum', description: 'regular|composition|unregistered' },
          { name: 'gst_start_date', label: 'GST Start Date', type: 'date', required: false, unique: false, default: null, searchable: false, sortable: true, editable: true, visible: true, validation: 'date', description: 'Effective GST registration date.' },
          { name: 'pan', label: 'PAN', type: 'string', required: false, unique: true, default: null, searchable: true, sortable: false, editable: true, visible: false, validation: 'country-specific PAN format', description: 'Permanent Account Number (Tax ID).' }
        ]
      },
      {
        key: 'office_bearers',
        title: 'Office Bearers',
        description: 'Structured list of office bearers (chairman, secretary, treasurer etc.)',
        fields: [
          {
            name: 'office_bearers', label: 'Office Bearers', type: 'json', required: false, unique: false, default: '[]', searchable: false, sortable: false, editable: true, visible: true,
            validation: 'array of objects [{id, name, designation, start_date, end_date, contact_mobile, contact_email}]',
            description: 'Structured list of office bearers and term dates. Stored as JSON in sheet-based implementations.'
          }
        ]
      },
      {
        key: 'system',
        title: 'System Information',
        description: 'Integration and system metadata',
        fields: [
          { name: 'external_id', label: 'External ID', type: 'string', required: false, unique: false, default: null, searchable: true, sortable: false, editable: true, visible: false, validation: 'integration identifier', description: 'ID used by external systems.' },
          { name: 'integration_flags', label: 'Integration Flags', type: 'json', required: false, unique: false, default: '{}', searchable: false, sortable: false, editable: true, visible: false, validation: 'JSON object', description: 'Integration related metadata (sync preferences etc.).' }
        ]
      },
      {
        key: 'status',
        title: 'Status',
        description: 'Active / deactivation and remarks',
        fields: [
          { name: 'active', label: 'Active', type: 'boolean', required: true, unique: false, default: true, searchable: true, sortable: true, editable: true, visible: true, validation: 'boolean', description: 'Whether this society is active. Only one active society is permitted.' },
          { name: 'activation_date', label: 'Activation Date', type: 'date', required: false, unique: false, default: null, searchable: false, sortable: true, editable: true, visible: false, validation: 'date', description: 'When society was activated.' },
          { name: 'deactivation_date', label: 'Deactivation Date', type: 'date', required: false, unique: false, default: null, searchable: false, sortable: true, editable: true, visible: false, validation: 'date', description: 'When society was deactivated.' },
          { name: 'remarks', label: 'Remarks', type: 'text', required: false, unique: false, default: null, searchable: false, sortable: false, editable: true, visible: false, validation: 'free text', description: 'Administrative remarks or migration notes.' }
        ]
      },

      // Audit fields (standard)
      {
        key: 'audit',
        title: 'Audit Fields',
        description: 'Standard system audit fields',
        fields: [
          { name: 'createdAt', label: 'Created At', type: 'timestamp', required: true, unique: false, default: 'now()', searchable: false, sortable: true, editable: false, visible: true, validation: 'timestamp ISO 8601', description: 'Record creation timestamp.' },
          { name: 'createdBy', label: 'Created By', type: 'integer', required: true, unique: false, default: null, searchable: false, sortable: false, editable: false, visible: false, validation: 'user id reference', description: 'User id who created the record.' },
          { name: 'updatedAt', label: 'Updated At', type: 'timestamp', required: false, unique: false, default: null, searchable: false, sortable: true, editable: false, visible: false, validation: 'timestamp', description: 'Last modification timestamp.' },
          { name: 'updatedBy', label: 'Updated By', type: 'integer', required: false, unique: false, default: null, searchable: false, sortable: false, editable: false, visible: false, validation: 'user id reference', description: 'User id who last modified the record.' },
          { name: 'deleted', label: 'Deleted', type: 'boolean', required: true, unique: false, default: false, searchable: false, sortable: false, editable: false, visible: false, validation: 'boolean', description: 'Soft-delete flag.' },
          { name: 'deletedAt', label: 'Deleted At', type: 'timestamp', required: false, unique: false, default: null, searchable: false, sortable: true, editable: false, visible: false, validation: 'timestamp', description: 'Soft-delete timestamp.' },
          { name: 'deletedBy', label: 'Deleted By', type: 'integer', required: false, unique: false, default: null, searchable: false, sortable: false, editable: false, visible: false, validation: 'user id reference', description: 'User id who performed soft-delete.' }
        ]
      }
    ]
  };

  // Expose in a global namespace for discovery by provisioning scripts.
  if (typeof window !== 'undefined') {
    window.SahakarSchemas = window.SahakarSchemas || {};
    window.SahakarSchemas.SocietyMaster = SocietyMasterSchema;
  }

  // For Apps Script server-side usage (global var)
  if (typeof this !== 'undefined' && this !== window) {
    this.SahakarSchemas = this.SahakarSchemas || {};
    this.SahakarSchemas.SocietyMaster = SocietyMasterSchema;
  }

})();
