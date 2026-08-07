/**
 * SupplierMasterSchema.js
 *
 * Declarative schema for Supplier Master module.
 * Exposes schema metadata under SahakarSchemas.SupplierMaster for provisioning.
 */
(function(){
  'use strict';

  var SupplierMasterSchema = {
    moduleName: 'SupplierMaster',
    sheetName: 'Supplier_Master',
    displayField: 'supplier_name',
    primaryKey: 'id',
    supportsSoftDelete: true,
    supportsSearch: true,
    supportsHistory: true,
    supportsDocuments: true,
    supportsExport: true,
    supportsImport: true,

    indexes: [
      { name: 'idx_supplier_name', fields: ['supplier_name'], unique: false },
      { name: 'idx_gstin', fields: ['gstin'], unique: false },
      { name: 'idx_pan', fields: ['pan'], unique: false }
    ],

    uniqueIndexes: [ ['uuid'] ],

    lookupFields: { byId: 'id', byUUID: 'uuid', byName: 'supplier_name' },

    dropdowns: {
      supplier_category: { label: 'Supplier Category', values: [ {value:'local',label:'Local'},{value:'national',label:'National'},{value:'international',label:'International'} ] },
      material_type: { label: 'Material Type', values: [ {value:'raw',label:'Raw Material'},{value:'consumable',label:'Consumable'},{value:'service',label:'Service'} ] }
    },

    reservedFields: ['custom_field_1','custom_field_2','metadata_json'],

    sections: [
      {
        key: 'general', title: 'General Information', description: 'Core supplier identification', fields: [
          { name:'id', label:'Supplier ID', type:'integer', required:true, unique:true, default:null, searchable:true, sortable:true, editable:false, visible:true, validation:'auto-increment', description:'Primary numeric identifier' },
          { name:'uuid', label:'UUID', type:'string', required:true, unique:true, default:'uuidv4()', searchable:true, sortable:false, editable:false, visible:false, validation:'uuid', description:'Global unique identifier' },
          { name:'supplier_name', label:'Supplier Name', type:'string', required:true, unique:false, default:null, searchable:true, sortable:true, editable:true, visible:true, validation:'max 200 chars', description:'Primary name of supplier' },
          { name:'firm_name', label:'Firm Name', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'max 200 chars', description:'Official firm name' },
          { name:'supplier_category', label:'Category', type:'string', required:false, unique:false, default:'local', searchable:true, sortable:true, editable:true, visible:true, validation:'enum', description:'Supplier category dropdown' }
        ]
      },
      {
        key:'tax', title:'Tax Information', description:'GST and PAN', fields:[
          { name:'gstin', label:'GSTIN', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'gstin', description:'GST Identification Number' },
          { name:'pan', label:'PAN', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:false, validation:'pan', description:'Permanent Account Number' },
          { name:'msme', label:'MSME No', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:false, validation:'max 50 chars', description:'MSME registration number' }
        ]
      },
      {
        key:'contact', title:'Contact', description:'Primary contact details', fields:[
          { name:'contact_person', label:'Contact Person', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'max 150 chars', description:'Primary contact person' },
          { name:'mobile', label:'Mobile', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'phone', description:'Primary mobile number' },
          { name:'alt_mobile', label:'Alternate Mobile', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:false, validation:'phone', description:'Secondary mobile' },
          { name:'email', label:'Email', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'email', description:'Primary email' }
        ]
      },
      {
        key:'address', title:'Address', description:'Postal address', fields:[
          { name:'address', label:'Address', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:true, validation:'max 300 chars', description:'Full address' },
          { name:'village', label:'Village', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'max 100 chars', description:'Village or locality' },
          { name:'taluka', label:'Taluka', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'max 100 chars', description:'Taluka' },
          { name:'district', label:'District', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'max 100 chars', description:'District' },
          { name:'state', label:'State', type:'string', required:false, unique:false, default:'IN', searchable:true, sortable:false, editable:true, visible:true, validation:'ISO 3166 or name', description:'State' },
          { name:'pincode', label:'PIN Code', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:true, validation:'numeric 4-8', description:'Postal code' }
        ]
      },
      {
        key:'bank', title:'Bank', description:'Banking details', fields:[
          { name:'bank_name', label:'Bank Name', type:'string', required:false, unique:false, default:null, searchable:true, sortable:false, editable:true, visible:true, validation:'max 100', description:'Bank name' },
          { name:'branch', label:'Branch', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:true, validation:'max 100', description:'Branch' },
          { name:'account_number', label:'Account Number', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:false, validation:'bank account', description:'Bank account (mask in UI)' },
          { name:'ifsc', label:'IFSC', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:false, validation:'ifsc', description:'IFSC code' },
          { name:'upi_id', label:'UPI ID', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:false, validation:'upi', description:'UPI identifier' }
        ]
      },
      {
        key:'profile', title:'Profile', description:'Supplier classification', fields:[
          { name:'material_type', label:'Material Type', type:'string', required:false, unique:false, default:'raw', searchable:true, sortable:false, editable:true, visible:true, validation:'enum', description:'Material or service classification' },
          { name:'gst_registered', label:'GST Registered', type:'boolean', required:false, unique:false, default:false, searchable:true, sortable:true, editable:true, visible:true, validation:'boolean', description:'Whether supplier is GST registered' },
          { name:'active', label:'Active', type:'boolean', required:true, unique:false, default:true, searchable:true, sortable:true, editable:true, visible:true, validation:'boolean', description:'Active status' },
          { name:'remarks', label:'Remarks', type:'text', required:false, unique:false, default:null, searchable:false, sortable:false, editable:true, visible:false, validation:'text', description:'Administrative notes' }
        ]
      },
      {
        key:'audit', title:'Audit Fields', description:'System audit', fields:[
          { name:'createdAt', label:'Created At', type:'timestamp', required:true, unique:false, default:'now()', searchable:false, sortable:true, editable:false, visible:false, validation:'timestamp', description:'Creation timestamp' },
          { name:'createdBy', label:'Created By', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:false, visible:false, validation:'user id or email', description:'Creator' },
          { name:'updatedAt', label:'Updated At', type:'timestamp', required:false, unique:false, default:null, searchable:false, sortable:true, editable:false, visible:false, validation:'timestamp', description:'Last update time' },
          { name:'updatedBy', label:'Updated By', type:'string', required:false, unique:false, default:null, searchable:false, sortable:false, editable:false, visible:false, validation:'user id', description:'Last updater' },
          { name:'deleted', label:'Deleted', type:'boolean', required:true, unique:false, default:false, searchable:false, sortable:false, editable:false, visible:false, validation:'boolean', description:'Soft delete flag' },
          { name:'deletedAt', label:'Deleted At', type:'timestamp', required:false, unique:false, default:null, searchable:false, sortable:true, editable:false, visible:false, validation:'timestamp', description:'Deleted timestamp' }
        ]
      }
    ]
  };

  // Expose schema
  if (typeof window !== 'undefined') { window.SahakarSchemas = window.SahakarSchemas || {}; window.SahakarSchemas.SupplierMaster = SupplierMasterSchema; }
  if (typeof this !== 'undefined' && this !== window) { this.SahakarSchemas = this.SahakarSchemas || {}; this.SahakarSchemas.SupplierMaster = SupplierMasterSchema; }

})();
