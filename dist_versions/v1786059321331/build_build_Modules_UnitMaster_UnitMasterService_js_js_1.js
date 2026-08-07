(function(){
  /**
   * UnitMasterService.js
   * Server-side service for Unit Master.
   * Uses Database.js, Response.js, Utils.js, and SahakarValidation.UnitMaster
   */
  if (typeof this.UnitMasterService !== 'undefined') return;

  var S = {};
  var SHEET = (this.SahakarSchemas && this.SahakarSchemas.UnitMaster && this.SahakarSchemas.UnitMaster.sheetName) || 'Units';

  function nowIso(){ return (new Date()).toISOString(); }
  function makeId(){ if (typeof Utils !== 'undefined' && Utils.generateId) return Utils.generateId(); if (typeof Utils !== 'undefined' && Utils.generateUuid) return Utils.generateUuid(); return 'U-' + Date.now(); }

  S.initialize = function(){ try{ if (typeof Database !== 'undefined' && Database.ensureSheet) Database.ensureSheet(SHEET); return Response.success({ message: 'UnitMaster initialized' }); } catch(e){ return Response.error('Init failed'); } };

  S.getAll = function(){ try{ var rows = Database.getAll(SHEET) || []; return Response.success({ data: rows }); } catch(e){ return Response.error('Failed to load units'); } };

  S.getById = function(id){ try{ var r = Database.findById(SHEET, id); if (!r) return Response.notFound('Unit not found'); return Response.success({ data: r }); } catch(e){ return Response.error('Failed to load unit'); } };

  S.getActive = function(){ try{ var rows = Database.getAll(SHEET)||[]; var active = rows.filter(function(r){ return r['Active'] === true || String(r['Active']).toLowerCase()==='true'; }); return Response.success({ data: active }); } catch(e){ return Response.error('Failed to load active units'); } };

  S.exists = function(id){ try{ var r = Database.findById(SHEET, id); return !!r; } catch(e){ return false; } };

  S.create = function(record){
    try{
      var v = (this.SahakarValidation && this.SahakarValidation.UnitMaster) ? this.SahakarValidation.UnitMaster.validateCreate(record) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce uniqueness of Unit Code
      var all = Database.getAll(SHEET) || [];
      var code = record['Unit Code'];
      if (code){ var dup = all.find(function(r){ return String(r['Unit Code']||'').trim().toLowerCase() === String(code||'').trim().toLowerCase(); }); if (dup) return Response.validationError(['Unit Code must be unique.']); }

      var id = record['Unit ID'] || makeId();
      record['Unit ID'] = id;
      record['Created By'] = record['Created By'] || 'system';
      record['Created Date'] = record['Created Date'] || nowIso();
      record['Deleted'] = false;

      Database.insertRecord(SHEET, record);
      return Response.success({ data: record, message: 'Unit created' });
    } catch(e){ return Response.error('Failed to create unit'); }
  };

  S.update = function(id, updates){
    try{
      if (!id) return Response.validationError(['Unit ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Unit not found');

      var merged = Object.assign({}, existing, updates);
      var v = (this.SahakarValidation && this.SahakarValidation.UnitMaster) ? this.SahakarValidation.UnitMaster.validateUpdate(merged) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce Unit Code uniqueness excluding current
      if (merged['Unit Code']){
        var all = Database.getAll(SHEET) || [];
        var dup = all.find(function(r){ return r['Unit ID'] !== id && String(r['Unit Code']||'').trim().toLowerCase() === String(merged['Unit Code']||'').trim().toLowerCase(); });
        if (dup) return Response.validationError(['Unit Code must be unique.']);
      }

      merged['Updated By'] = updates['Updated By'] || 'system';
      merged['Updated Date'] = nowIso();
      Database.updateRecord(SHEET, id, merged);
      return Response.success({ data: merged, message: 'Unit updated' });
    } catch(e){ return Response.error('Failed to update unit'); }
  };

  S.softDelete = function(id){
    try{
      if (!id) return Response.validationError(['Unit ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Unit not found');
      existing['Deleted'] = true;
      existing['Deleted Date'] = nowIso();
      existing['Active'] = false;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Unit soft-deleted' });
    } catch(e){ return Response.error('Failed to delete unit'); }
  };

  S.restore = function(id){
    try{
      if (!id) return Response.validationError(['Unit ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Unit not found');
      existing['Deleted'] = false;
      existing['Deleted Date'] = '';
      existing['Active'] = true;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Unit restored' });
    } catch(e){ return Response.error('Failed to restore unit'); }
  };

  S.search = function(filters){
    try{
      var all = Database.getAll(SHEET) || [];
      filters = filters || {};
      var q = String(filters.q || '').toLowerCase();
      var result = all.filter(function(r){
        if (!q) return true;
        var hay = [r['Unit Name'], r['Unit Code'], r['Description']].join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      return Response.success({ data: result });
    } catch(e){ return Response.error('Search failed'); }
  };

  S.count = function(){ try{ var all = Database.getAll(SHEET) || []; return Response.success({ data: all.length }); } catch(e){ return Response.error('Count failed'); } };

  this.UnitMasterService = S;
  return S;
})();