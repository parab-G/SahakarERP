(function(){
  /**
   * MaterialMasterService.js
   * Server-side service for Material Master.
   * Uses Database.js, Response.js, Utils.js, and SahakarValidation.MaterialMaster
   */
  if (typeof this.MaterialMasterService !== 'undefined') return;

  var S = {};
  var SHEET = (this.SahakarSchemas && this.SahakarSchemas.MaterialMaster && this.SahakarSchemas.MaterialMaster.sheetName) || 'Materials';

  function nowIso(){ return (new Date()).toISOString(); }
  function makeId(){ if (typeof Utils !== 'undefined' && Utils.generateId) return Utils.generateId(); if (typeof Utils !== 'undefined' && Utils.generateUuid) return Utils.generateUuid(); return 'MAT-' + Date.now(); }

  S.initialize = function(){ try{ if (typeof Database !== 'undefined' && Database.ensureSheet) Database.ensureSheet(SHEET); return Response.success({ message: 'MaterialMaster initialized' }); } catch(e){ return Response.error('Init failed'); } };

  S.getAll = function(){ try{ var rows = Database.getAll(SHEET) || []; return Response.success({ data: rows }); } catch(e){ return Response.error('Failed to load materials'); } };

  S.getById = function(id){ try{ var r = Database.findById(SHEET, id); if (!r) return Response.notFound('Material not found'); return Response.success({ data: r }); } catch(e){ return Response.error('Failed to load material'); } };

  S.getActive = function(){ try{ var rows = Database.getAll(SHEET)||[]; var active = rows.filter(function(r){ return r['Active'] === true || String(r['Active']).toLowerCase()==='true'; }); return Response.success({ data: active }); } catch(e){ return Response.error('Failed to load active materials'); } };

  S.exists = function(id){ try{ var r = Database.findById(SHEET, id); return !!r; } catch(e){ return false; } };

  S.create = function(record){
    try{
      var v = (this.SahakarValidation && this.SahakarValidation.MaterialMaster) ? this.SahakarValidation.MaterialMaster.validateCreate(record) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce uniqueness of Material Code
      var all = Database.getAll(SHEET) || [];
      var code = record['Material Code'];
      if (code){ var dup = all.find(function(r){ return String(r['Material Code']||'').trim().toLowerCase() === String(code||'').trim().toLowerCase(); }); if (dup) return Response.validationError(['Material Code must be unique.']); }

      var id = record['Material ID'] || makeId();
      record['Material ID'] = id;
      record['Created By'] = record['Created By'] || 'system';
      record['Created Date'] = record['Created Date'] || nowIso();
      record['Deleted'] = false;

      Database.insertRecord(SHEET, record);
      return Response.success({ data: record, message: 'Material created' });
    } catch(e){ return Response.error('Failed to create material'); }
  };

  S.update = function(id, updates){
    try{
      if (!id) return Response.validationError(['Material ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Material not found');

      var merged = Object.assign({}, existing, updates);
      var v = (this.SahakarValidation && this.SahakarValidation.MaterialMaster) ? this.SahakarValidation.MaterialMaster.validateUpdate(merged) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce Material Code uniqueness excluding current
      if (merged['Material Code']){
        var all = Database.getAll(SHEET) || [];
        var dup = all.find(function(r){ return r['Material ID'] !== id && String(r['Material Code']||'').trim().toLowerCase() === String(merged['Material Code']||'').trim().toLowerCase(); });
        if (dup) return Response.validationError(['Material Code must be unique.']);
      }

      merged['Updated By'] = updates['Updated By'] || 'system';
      merged['Updated Date'] = nowIso();
      Database.updateRecord(SHEET, id, merged);
      return Response.success({ data: merged, message: 'Material updated' });
    } catch(e){ return Response.error('Failed to update material'); }
  };

  S.softDelete = function(id){
    try{
      if (!id) return Response.validationError(['Material ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Material not found');
      existing['Deleted'] = true;
      existing['Deleted Date'] = nowIso();
      existing['Active'] = false;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Material soft-deleted' });
    } catch(e){ return Response.error('Failed to delete material'); }
  };

  S.restore = function(id){
    try{
      if (!id) return Response.validationError(['Material ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Material not found');
      existing['Deleted'] = false;
      existing['Deleted Date'] = '';
      existing['Active'] = true;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Material restored' });
    } catch(e){ return Response.error('Failed to restore material'); }
  };

  S.search = function(filters){
    try{
      var all = Database.getAll(SHEET) || [];
      filters = filters || {};
      var q = String(filters.q || '').toLowerCase();
      var result = all.filter(function(r){
        if (!q) return true;
        var hay = [r['Material Name'], r['Material Code'], r['Material Category'], r['Sub Category'], r['Brand'], r['Specification']].join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      return Response.success({ data: result });
    } catch(e){ return Response.error('Search failed'); }
  };

  S.count = function(){ try{ var all = Database.getAll(SHEET) || []; return Response.success({ data: all.length }); } catch(e){ return Response.error('Count failed'); } };

  this.MaterialMasterService = S;
  return S;
})();