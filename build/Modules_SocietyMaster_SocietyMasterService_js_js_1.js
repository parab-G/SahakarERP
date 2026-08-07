/**
 * SocietyMasterService.js
 *
 * Business service for Society Master module.
 * Provides a single source of truth for CRUD and business rules.
 * All data access uses Database.js. No direct SpreadsheetApp usage.
 *
 * Public namespace: SocietyMasterService
 *
 * Style: Apps Script compatible, documented functions, safeExecute wrapper used
 * for error handling and standardized Response objects.
 */

(function(){
  'use strict';

  // Public namespace
  var S = {};

  // Helper: schema discovery (from Modules/SocietyMaster/SocietyMasterSchema.js)
  var schema = (typeof this.SahakarSchemas !== 'undefined' && this.SahakarSchemas.SocietyMaster) || (typeof window !== 'undefined' && window.SahakarSchemas && window.SahakarSchemas.SocietyMaster) || null;
  var sheetName = (schema && schema.sheetName) || 'Society_Master';

  // Build field -> label map from schema for sheet operations
  function buildFieldLabelMap(){ var map = {}; if (!schema || !schema.sections) return map; schema.sections.forEach(function(sec){ (sec.fields||[]).forEach(function(f){ if (f && f.name && f.label) map[f.name] = f.label; }); }); return map; }
  var fieldLabel = buildFieldLabelMap();

  // Utility: convert internal record (by field names) to sheet record (by header labels)
  function toSheetRecord(rec){ var out = {}; if (!rec || typeof rec !== 'object') return out; Object.keys(rec).forEach(function(k){ var header = fieldLabel[k] || k; out[header] = rec[k]; }); return out; }

  // Utility: convert sheet record (headers) to internal record (field names)
  function fromSheetRecord(sheetRec){ if (!sheetRec || typeof sheetRec !== 'object') return {}; var out = {}; Object.keys(fieldLabel).forEach(function(fn){ var hdr = fieldLabel[fn]; if (hdr && sheetRec.hasOwnProperty(hdr)) out[fn] = sheetRec[hdr]; }); // include generic ID discovery
    // bring through common audit headers if present
    if (sheetRec['ID']) out.id = sheetRec['ID']; if (sheetRec['Id']) out.id = out.id || sheetRec['Id']; if (sheetRec['id']) out.id = out.id || sheetRec['id']; if (sheetRec['UUID']) out.uuid = sheetRec['UUID']; if (sheetRec['uuid']) out.uuid = out.uuid || sheetRec['uuid']; return out; }

  // Helper: normalize record inputs
  function sanitize(record){ try{ return sanitizeInput(record || {}); } catch(e){ return record || {}; } }

  // Helper: find existing records matching predicate
  function findAll(){ return Database.getAll(sheetName) || []; }

  // -------------------- Business checks --------------------
  function checkDuplicateName(name, excludeId){ var rows = findAll(); if (!name) return null; var found = rows.find(function(r){ var v = (r['Society Name'] || r['name'] || r['Name'] || ''); if (!v) return false; if (excludeId){ var idCell = r['ID'] || r['Id'] || r['id']; if (String(idCell) === String(excludeId)) return false; } return String(v).trim().toLowerCase() === String(name).trim().toLowerCase(); }); return found; }

  function checkDuplicateRegistrationNumber(regNo, excludeId){ if (!regNo) return null; var rows = findAll(); return rows.find(function(r){ var v = r['Registration Number'] || r['registration_number'] || r['registration_no']; if (!v) return false; if (excludeId){ var idCell = r['ID'] || r['Id'] || r['id']; if (String(idCell) === String(excludeId)) return false; } return String(v).trim().toLowerCase() === String(regNo).trim().toLowerCase(); }) || null; }

  function findActive(excludeId){ var rows = findAll(); return rows.find(function(r){ var active = r['Active Status'] || r['active'] || r['Active'] || r['active_status']; if (!active) return false; var isActive = String(active).toLowerCase() === 'true' || active === true; if (!isActive) return false; if (excludeId){ var idCell = r['ID'] || r['Id'] || r['id']; if (String(idCell) === String(excludeId)) return false; } return true; }) || null; }

  // -------------------- Public API --------------------

  /**
   * initialize()
   * Ensure the underlying sheet exists using SchemaService (if available).
   * Returns Response.success with schema info or Response.error.
   */
  S.initialize = function(){ return safeExecute(function(){ try{ if (typeof ensureSocietySchema === 'function') return ensureSocietySchema(); // may return Response-like object
        return { sheetName: sheetName, initialized: true }; } catch(e){ // fallback
        return { sheetName: sheetName, initialized: false, message: 'SchemaService not available' }; } }, 'SocietyMasterService.initialize'); };

  /**
   * getAll()
   * Returns all society records (non-deleted).
   */
  S.getAll = function(){ return safeExecute(function(){ var rows = Database.getAll(sheetName) || []; return rows.map(function(r){ return r; }); }, 'SocietyMasterService.getAll'); };

  /**
   * getById(id)
   * Returns single record by id (or null) as Response.success(data) or notFound.
   */
  S.getById = function(id){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var r = Database.findById(sheetName, id); if (!r) return Response.notFound('Record not found: ' + id); return r; }, 'SocietyMasterService.getById'); };

  /**
   * getActive()
   * Returns the active society record (first found) or notFound.
   */
  S.getActive = function(){ return safeExecute(function(){ var r = findActive(); if (!r) return Response.notFound('No active society found'); return r; }, 'SocietyMasterService.getActive'); };

  /**
   * create(record)
   * Validates and inserts a new society record. Enforces business rules:
   * - Unique society name
   * - Unique registration number
   * - Only one active society
   * Populates audit fields: createdAt, createdBy, updatedAt, updatedBy, deleted
   */
  S.create = function(input){ return safeExecute(function(){ var rec = sanitize(input || {});
      // validate payload
      if (!(typeof SahakarValidation !== 'undefined' && SahakarValidation.SocietyMaster)) return Response.error('Validation module not available');
      var v = SahakarValidation.SocietyMaster.validateCreate(rec);
      if (!v.valid) return Response.validationError(v.errors);

      // business uniqueness
      var dupName = checkDuplicateName(rec.name);
      if (dupName) return Response.validationError([{ field: 'name', message: 'Duplicate society name exists.' }]);
      var dupReg = checkDuplicateRegistrationNumber(rec.registration_number);
      if (dupReg) return Response.validationError([{ field: 'registration_number', message: 'Registration number already exists.' }]);

      // only one active
      if (rec.active === true || String(rec.active).toLowerCase() === 'true'){
        var existingActive = findActive();
        if (existingActive) return Response.validationError([{ field: 'active', message: 'An active society already exists. Deactivate it first.' }]);
      }

      // populate audit fields
      var ts = generateTimestamp();
      rec.createdAt = ts; rec.updatedAt = ts; rec.deleted = false;
      // createdBy/updatedBy can be provided by caller; otherwise null
      rec.createdBy = rec.createdBy || null; rec.updatedBy = rec.updatedBy || rec.createdBy || null;

      // map to sheet headers and insert
      var sheetRec = toSheetRecord(rec);
      var ok = Database.insertRecord(sheetName, sheetRec);
      if (!ok) return Response.error('Failed to insert record');
      return { id: rec.id || null, message: 'Created' };

    }, 'SocietyMasterService.create'); };

  /**
   * update(id, record)
   * Partial updates allowed. Enforces uniqueness rules and single-active rule.
   */
  S.update = function(id, input){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var existing = Database.findById(sheetName, id); if (!existing) return Response.notFound('Record not found: ' + id);
      var rec = sanitize(input || {});
      if (!(typeof SahakarValidation !== 'undefined' && SahakarValidation.SocietyMaster)) return Response.error('Validation module not available');
      // include id for validation
      rec.id = id;
      var v = SahakarValidation.SocietyMaster.validateUpdate(rec);
      if (!v.valid) return Response.validationError(v.errors);

      // uniqueness checks
      if (rec.name){ var dup = checkDuplicateName(rec.name, id); if (dup) return Response.validationError([{ field: 'name', message: 'Duplicate society name exists.' }]); }
      if (rec.registration_number){ var dr = checkDuplicateRegistrationNumber(rec.registration_number, id); if (dr) return Response.validationError([{ field: 'registration_number', message: 'Registration number already exists.' }]); }

      // active rule
      if (typeof rec.active !== 'undefined'){
        var activeVal = (rec.active === true || String(rec.active).toLowerCase() === 'true'); if (activeVal){ var otherActive = findActive(id); if (otherActive) return Response.validationError([{ field: 'active', message: 'Another active society exists. Deactivate first.' }]); }
      }

      // populate audit fields
      rec.updatedAt = generateTimestamp(); rec.updatedBy = rec.updatedBy || null;

      // map to sheet headers and update
      var sheetRec = toSheetRecord(rec);
      var ok = Database.updateRecord(sheetName, id, sheetRec);
      if (!ok) return Response.error('Failed to update record');
      return { id: id, message: 'Updated' };
    }, 'SocietyMasterService.update'); };

  /**
   * softDelete(id)
   * Soft-delete a record by id. Sets deleted flag and timestamps.
   */
  S.softDelete = function(id){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var existing = Database.findById(sheetName, id); if (!existing) return Response.notFound('Record not found: ' + id);
      // prevent deleting active society by default — caller can override after confirmation
      var active = existing['Active Status'] || existing['active']; if (String(active).toLowerCase() === 'true' || active === true) return Response.validationError([{ field: 'active', message: 'Cannot delete an active society. Deactivate first.' }]);
      var ok = Database.softDelete(sheetName, id);
      if (!ok) return Response.error('Soft delete failed');
      return { id: id, message: 'Soft deleted' };
    }, 'SocietyMasterService.softDelete'); };

  /**
   * restore(id)
   * Restore a soft-deleted record. Ensure single-active rule not violated.
   */
  S.restore = function(id){ return safeExecute(function(){ if (!id) return Response.notFound('Missing id'); var existing = Database.findById(sheetName, id); if (!existing) return Response.notFound('Record not found: ' + id);
      // if restoring active and another active exists, fail
      var willBeActive = (existing['Active Status'] || existing['active']) === true || String(existing['Active Status'] || existing['active']).toLowerCase() === 'true'; if (willBeActive){ var other = findActive(id); if (other) return Response.validationError([{ field: 'active', message: 'Another active society exists. Deactivate first.' }]); }
      var ok = Database.restoreRecord(sheetName, id);
      if (!ok) return Response.error('Restore failed');
      return { id: id, message: 'Restored' };
    }, 'SocietyMasterService.restore'); };

  /**
   * exists(id)
   * Returns boolean indicating whether record exists (not deleted)
   */
  S.exists = function(id){ return safeExecute(function(){ if (!id) return false; return Database.recordExists(sheetName, id); }, 'SocietyMasterService.exists'); };

  /**
   * search(filters)
   * Filters: object with fieldName -> value. Performs simple contains match for strings and exact match otherwise.
   */
  S.search = function(filters){ return safeExecute(function(){ var f = filters || {}; var rows = Database.getAll(sheetName) || []; var results = rows.filter(function(r){ return Object.keys(f).every(function(k){ var hdr = fieldLabel[k] || k; var val = r[hdr]; if (val === undefined || val === null) return false; var q = f[k]; if (isBlank(q)) return true; if (typeof val === 'string' && typeof q === 'string') return val.toLowerCase().indexOf(q.toLowerCase()) !== -1; return String(val) === String(q); }); }); return results; }, 'SocietyMasterService.search'); };

  /**
   * count()
   * Returns number of non-deleted society records
   */
  S.count = function(){ return safeExecute(function(){ return Database.count(sheetName); }, 'SocietyMasterService.count'); };

  // Expose namespace
  this.SocietyMasterService = S;

})();