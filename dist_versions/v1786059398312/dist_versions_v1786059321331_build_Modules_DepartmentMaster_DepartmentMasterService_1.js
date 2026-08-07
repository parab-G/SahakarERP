(function(){
  /**
   * DepartmentMasterService.js
   * Server-side service for Department Master.
   * Uses Database.js, Response.js, Utils.js, and SahakarValidation.DepartmentMaster
   */
  if (typeof this.DepartmentMasterService !== 'undefined') return;

  var S = {};
  var SHEET = (this.SahakarSchemas && this.SahakarSchemas.DepartmentMaster && this.SahakarSchemas.DepartmentMaster.sheetName) || 'Departments';

  function nowIso(){ return (new Date()).toISOString(); }
  function makeId(){ if (typeof Utils !== 'undefined' && Utils.generateId) return Utils.generateId(); if (typeof Utils !== 'undefined' && Utils.generateUuid) return Utils.generateUuid(); return 'DEPT-' + Date.now(); }

  S.initialize = function(){
    try{ if (typeof Database !== 'undefined' && Database.ensureSheet) Database.ensureSheet(SHEET); return Response.success({ message: 'DepartmentMaster initialized' }); } catch(e){ return Response.error('Init failed'); }
  };

  S.getAll = function(){ try{ var rows = Database.getAll(SHEET) || []; return Response.success({ data: rows }); } catch(e){ return Response.error('Failed to load departments'); } };

  S.getById = function(id){ try{ var r = Database.findById(SHEET, id); if (!r) return Response.notFound('Department not found'); return Response.success({ data: r }); } catch(e){ return Response.error('Failed to load department'); } };

  S.getActive = function(){ try{ var rows = Database.getAll(SHEET)||[]; var active = rows.filter(function(r){ return r['Active'] === true || String(r['Active']).toLowerCase()==='true'; }); return Response.success({ data: active }); } catch(e){ return Response.error('Failed to load active departments'); } };

  S.exists = function(id){ try{ var r = Database.findById(SHEET, id); return !!r; } catch(e){ return false; } };

  S.create = function(record){
    try{
      var v = (this.SahakarValidation && this.SahakarValidation.DepartmentMaster) ? this.SahakarValidation.DepartmentMaster.validateCreate(record) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce uniqueness: Department Code and Department Name
      var all = Database.getAll(SHEET) || [];
      var code = record['Department Code'];
      if (code){ var dup = all.find(function(r){ return String(r['Department Code']||'').trim().toLowerCase() === String(code||'').trim().toLowerCase(); }); if (dup) return Response.validationError(['Department Code must be unique.']); }
      var name = record['Department Name'];
      if (name){ var dupn = all.find(function(r){ return String(r['Department Name']||'').trim().toLowerCase() === String(name||'').trim().toLowerCase(); }); if (dupn) return Response.validationError(['Department Name must be unique.']); }

      var id = record['Department ID'] || makeId();
      record['Department ID'] = id;
      record['Created By'] = record['Created By'] || 'system';
      record['Created Date'] = record['Created Date'] || nowIso();
      record['Deleted'] = false;

      Database.insertRecord(SHEET, record);
      return Response.success({ data: record, message: 'Department created' });
    } catch(e){ return Response.error('Failed to create department'); }
  };

  S.update = function(id, updates){
    try{
      if (!id) return Response.validationError(['Department ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Department not found');

      var merged = Object.assign({}, existing, updates);
      var v = (this.SahakarValidation && this.SahakarValidation.DepartmentMaster) ? this.SahakarValidation.DepartmentMaster.validateUpdate(merged) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce uniqueness excluding current
      if (merged['Department Code']){
        var all = Database.getAll(SHEET) || [];
        var dup = all.find(function(r){ return r['Department ID'] !== id && String(r['Department Code']||'').trim().toLowerCase() === String(merged['Department Code']||'').trim().toLowerCase(); });
        if (dup) return Response.validationError(['Department Code must be unique.']);
      }
      if (merged['Department Name']){
        var all2 = Database.getAll(SHEET) || [];
        var dupn = all2.find(function(r){ return r['Department ID'] !== id && String(r['Department Name']||'').trim().toLowerCase() === String(merged['Department Name']||'').trim().toLowerCase(); });
        if (dupn) return Response.validationError(['Department Name must be unique.']);
      }

      merged['Updated By'] = updates['Updated By'] || 'system';
      merged['Updated Date'] = nowIso();
      Database.updateRecord(SHEET, id, merged);
      return Response.success({ data: merged, message: 'Department updated' });
    } catch(e){ return Response.error('Failed to update department'); }
  };

  S.softDelete = function(id){
    try{
      if (!id) return Response.validationError(['Department ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Department not found');
      existing['Deleted'] = true;
      existing['Deleted Date'] = nowIso();
      existing['Active'] = false;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Department soft-deleted' });
    } catch(e){ return Response.error('Failed to delete department'); }
  };

  S.restore = function(id){
    try{
      if (!id) return Response.validationError(['Department ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Department not found');
      existing['Deleted'] = false;
      existing['Deleted Date'] = '';
      existing['Active'] = true;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Department restored' });
    } catch(e){ return Response.error('Failed to restore department'); }
  };

  S.search = function(filters){
    try{
      var all = Database.getAll(SHEET) || [];
      filters = filters || {};
      var q = String(filters.q || '').toLowerCase();
      var result = all.filter(function(r){
        if (!q) return true;
        var hay = [r['Department Name'], r['Department Code'], r['Short Name'], r['Contact Officer']].join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      return Response.success({ data: result });
    } catch(e){ return Response.error('Search failed'); }
  };

  S.count = function(){ try{ var all = Database.getAll(SHEET) || []; return Response.success({ data: all.length }); } catch(e){ return Response.error('Count failed'); } };

  this.DepartmentMasterService = S;
  return S;
})();