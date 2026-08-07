/**
 * SupplierMasterService.js
 *
 * Business service for Supplier Master module. Uses Database.js for data access
 * and SahakarValidation.SupplierMaster for input validation. Returns standardized
 * Response objects via safeExecute.
 */
(function(){
  'use strict';
  var S = {};

  var schema = (typeof this.SahakarSchemas !== 'undefined' && this.SahakarSchemas.SupplierMaster) || (typeof window !== 'undefined' && window.SahakarSchemas && window.SahakarSchemas.SupplierMaster) || null;
  var sheetName = (schema && schema.sheetName) || 'Supplier_Master';

  function buildFieldLabelMap(){ var map={}; if (!schema||!schema.sections) return map; schema.sections.forEach(function(sec){ (sec.fields||[]).forEach(function(f){ if (f && f.name && f.label) map[f.name]=f.label; }); }); return map; }
  var fieldLabel = buildFieldLabelMap();

  function toSheetRecord(rec){ var out={}; if (!rec||typeof rec!=='object') return out; Object.keys(rec).forEach(function(k){ var header = fieldLabel[k] || k; out[header]=rec[k]; }); return out; }
  function fromSheetRecord(sheetRec){ if (!sheetRec||typeof sheetRec!=='object') return {}; var out={}; Object.keys(fieldLabel).forEach(function(fn){ var hdr=fieldLabel[fn]; if (hdr && sheetRec.hasOwnProperty(hdr)) out[fn]=sheetRec[hdr]; }); if (sheetRec['ID']) out.id=sheetRec['ID']; if (sheetRec['UUID']) out.uuid=sheetRec['UUID']; return out; }

  function sanitize(rec){ try{ return sanitizeInput(rec||{}); }catch(e){ return rec||{}; } }
  function findAll(){ return Database.getAll(sheetName) || []; }

  function checkDuplicateName(name, excludeId){ if (!name) return null; var rows = findAll(); return rows.find(function(r){ var v = r[fieldLabel['supplier_name']] || r['Supplier Name'] || r['supplier_name'] || ''; if (!v) return false; if (excludeId){ var idCell = r['ID']||r['Id']||r['id']; if (String(idCell)===String(excludeId)) return false; } return String(v).trim().toLowerCase()===String(name).trim().toLowerCase(); }) || null; }
  function checkDuplicateGSTIN(gstin, excludeId){ if (!gstin) return null; var rows = findAll(); return rows.find(function(r){ var v = r[fieldLabel['gstin']] || r['GSTIN'] || ''; if (!v) return false; if (excludeId){ var idCell = r['ID']||r['Id']||r['id']; if (String(idCell)===String(excludeId)) return false; } return String(v).trim().toLowerCase()===String(gstin).trim().toLowerCase(); }) || null; }

  S.initialize = function(){ return safeExecute(function(){ try{ if (typeof ensureSchema === 'function' || typeof ensureSupplierSchema === 'function') return { sheetName: sheetName, initialized: true }; return { sheetName: sheetName, initialized: true }; } catch(e){ return { sheetName: sheetName, initialized:false }; } }, 'SupplierMasterService.initialize'); };

  S.getAll = function(){ return safeExecute(function(){ var rows = Database.getAll(sheetName) || []; return rows.map(function(r){ return r; }); }, 'SupplierMasterService.getAll'); };

  S.getById = function(id){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var r = Database.findById(sheetName, id); if (!r) return Response.notFound('Record not found: ' + id); return r; }, 'SupplierMasterService.getById'); };

  S.create = function(input){ return safeExecute(function(){ var rec = sanitize(input||{}); if (!(typeof SahakarValidation !== 'undefined' && SahakarValidation.SupplierMaster)) return Response.error('Validation module not available'); var v = SahakarValidation.SupplierMaster.validateCreate(rec); if (!v.valid) return Response.validationError(v.errors);

      // uniqueness checks
      var dup = checkDuplicateName(rec.supplier_name); if (dup) return Response.validationError([{ field:'supplier_name', message:'Duplicate supplier name exists.' }]); var dupG = checkDuplicateGSTIN(rec.gstin); if (dupG) return Response.validationError([{ field:'gstin', message:'GSTIN already exists.' }]);

      var ts = generateTimestamp(); rec.createdAt = ts; rec.updatedAt = ts; rec.deleted = false; rec.createdBy = rec.createdBy || null; rec.updatedBy = rec.updatedBy || rec.createdBy || null;
      var sheetRec = toSheetRecord(rec); var ok = Database.insertRecord(sheetName, sheetRec); if (!ok) return Response.error('Insert failed'); return { id: rec.id || null, message: 'Created' };
    }, 'SupplierMasterService.create'); };

  S.update = function(id, input){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var existing = Database.findById(sheetName, id); if (!existing) return Response.notFound('Record not found: ' + id); var rec = sanitize(input||{}); if (!(typeof SahakarValidation !== 'undefined' && SahakarValidation.SupplierMaster)) return Response.error('Validation module not available'); rec.id = id; var v = SahakarValidation.SupplierMaster.validateUpdate(rec); if (!v.valid) return Response.validationError(v.errors);
      if (rec.supplier_name){ var d = checkDuplicateName(rec.supplier_name, id); if (d) return Response.validationError([{ field:'supplier_name', message:'Duplicate supplier name exists.' }]); }
      if (rec.gstin){ var dg = checkDuplicateGSTIN(rec.gstin, id); if (dg) return Response.validationError([{ field:'gstin', message:'GSTIN already exists.' }]); }
      rec.updatedAt = generateTimestamp(); rec.updatedBy = rec.updatedBy || null; var sheetRec = toSheetRecord(rec); var ok = Database.updateRecord(sheetName, id, sheetRec); if (!ok) return Response.error('Update failed'); return { id: id, message: 'Updated' };
    }, 'SupplierMasterService.update'); };

  S.softDelete = function(id){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var existing = Database.findById(sheetName, id); if (!existing) return Response.notFound('Record not found: ' + id); var ok = Database.softDelete(sheetName, id); if (!ok) return Response.error('Soft delete failed'); return { id: id, message: 'Soft deleted' }; }, 'SupplierMasterService.softDelete'); };

  S.restore = function(id){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var existing = Database.findById(sheetName, id); if (!existing) return Response.notFound('Record not found: ' + id); var ok = Database.restoreRecord(sheetName, id); if (!ok) return Response.error('Restore failed'); return { id: id, message: 'Restored' }; }, 'SupplierMasterService.restore'); };

  S.exists = function(id){ return safeExecute(function(){ if (!id) return false; return Database.recordExists(sheetName, id); }, 'SupplierMasterService.exists'); };

  S.search = function(filters){ return safeExecute(function(){ var f = filters || {}; var rows = Database.getAll(sheetName) || []; var results = rows.filter(function(r){ return Object.keys(f).every(function(k){ var hdr = fieldLabel[k] || k; var val = r[hdr]; if (val===undefined||val===null) return false; var q = f[k]; if (isBlank(q)) return true; if (typeof val === 'string' && typeof q === 'string') return val.toLowerCase().indexOf(q.toLowerCase()) !== -1; return String(val) === String(q); }); }); return results; }, 'SupplierMasterService.search'); };

  S.count = function(){ return safeExecute(function(){ return Database.count(sheetName); }, 'SupplierMasterService.count'); };

  this.SupplierMasterService = S;
})();
