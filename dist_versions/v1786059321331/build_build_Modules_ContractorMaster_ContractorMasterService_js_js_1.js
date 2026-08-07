(function(){
  /**
   * ContractorMasterService.js
   * Server-side service for Contractor Master.
   * Uses Database.js, Response.js, Utils.js, and SahakarValidation.ContractorMaster
   */
  if (typeof this.ContractorMasterService !== 'undefined') return;

  var S = {};
  var MODULE = 'ContractorMaster';
  var SHEET = (this.SahakarSchemas && this.SahakarSchemas.ContractorMaster && this.SahakarSchemas.ContractorMaster.sheetName) || 'Contractors';

  function nowIso(){ return (new Date()).toISOString(); }
  function makeId(){ if (typeof Utils !== 'undefined' && Utils.generateId) return Utils.generateId(); if (typeof Utils !== 'undefined' && Utils.generateUuid) return Utils.generateUuid(); return 'CT-' + Date.now(); }

  S.initialize = function(){
    try{ if (typeof Database !== 'undefined' && Database.ensureSheet) Database.ensureSheet(SHEET); return Response.success({ message: 'ContractorMaster initialized' }); } catch(e){ return Response.error('Init failed'); }
  };

  S.getAll = function(){
    try{
      var rows = Database.getAll(SHEET) || [];
      return Response.success({ data: rows });
    } catch(e){ return Response.error('Failed to load contractors'); }
  };

  S.getById = function(id){
    try{ var r = Database.findById(SHEET, id); if (!r) return Response.notFound('Contractor not found'); return Response.success({ data: r }); } catch(e){ return Response.error('Failed to load contractor'); }
  };

  S.getActive = function(){
    try{ var rows = Database.getAll(SHEET)||[]; var active = rows.filter(function(r){ return r['Active'] === true || String(r['Active']).toLowerCase()==='true'; }); return Response.success({ data: active }); } catch(e){ return Response.error('Failed to load active contractors'); }
  };

  S.exists = function(id){ try{ var r = Database.findById(SHEET, id); return !!r; } catch(e){ return false; } };

  S.create = function(record){
    try{
      var v = (this.SahakarValidation && this.SahakarValidation.ContractorMaster) ? this.SahakarValidation.ContractorMaster.validateCreate(record) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce uniqueness of Registration Number at service level
      var all = Database.getAll(SHEET) || [];
      var reg = record['Registration Number'];
      if (reg){ var dup = all.find(function(r){ return String(r['Registration Number']||'').trim().toLowerCase() === String(reg||'').trim().toLowerCase(); }); if (dup) return Response.validationError(['Registration Number must be unique.']); }

      var id = record['Contractor ID'] || makeId();
      record['Contractor ID'] = id;
      record['Created By'] = record['Created By'] || 'system';
      record['Created Date'] = record['Created Date'] || nowIso();
      record['Deleted'] = false;

      Database.insertRecord(SHEET, record);
      return Response.success({ data: record, message: 'Contractor created' });
    } catch(e){ return Response.error('Failed to create contractor'); }
  };

  S.update = function(id, updates){
    try{
      if (!id) return Response.validationError(['Contractor ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Contractor not found');

      var merged = Object.assign({}, existing, updates);
      var v = (this.SahakarValidation && this.SahakarValidation.ContractorMaster) ? this.SahakarValidation.ContractorMaster.validateUpdate(merged) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce Registration Number uniqueness (excluding current)
      if (merged['Registration Number']){
        var all = Database.getAll(SHEET) || [];
        var dup = all.find(function(r){ return r['Contractor ID'] !== id && String(r['Registration Number']||'').trim().toLowerCase() === String(merged['Registration Number']||'').trim().toLowerCase(); });
        if (dup) return Response.validationError(['Registration Number must be unique.']);
      }

      merged['Updated By'] = updates['Updated By'] || 'system';
      merged['Updated Date'] = nowIso();
      Database.updateRecord(SHEET, id, merged);
      return Response.success({ data: merged, message: 'Contractor updated' });
    } catch(e){ return Response.error('Failed to update contractor'); }
  };

  S.softDelete = function(id, opts){
    try{
      if (!id) return Response.validationError(['Contractor ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Contractor not found');
      existing['Deleted'] = true;
      existing['Deleted Date'] = nowIso();
      existing['Active'] = false;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Contractor soft-deleted' });
    } catch(e){ return Response.error('Failed to delete contractor'); }
  };

  S.restore = function(id){
    try{
      if (!id) return Response.validationError(['Contractor ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Contractor not found');
      existing['Deleted'] = false;
      existing['Deleted Date'] = '';
      existing['Active'] = true;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Contractor restored' });
    } catch(e){ return Response.error('Failed to restore contractor'); }
  };

  S.search = function(filters){
    try{
      var all = Database.getAll(SHEET) || [];
      filters = filters || {};
      var q = String(filters.q || '').toLowerCase();
      var result = all.filter(function(r){
        if (!q) return true;
        var hay = [r['Contractor Name'], r['Firm Name'], r['Registration Number'], r['GSTIN'], r['PAN'], r['Contact Person']].join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      return Response.success({ data: result });
    } catch(e){ return Response.error('Search failed'); }
  };

  S.count = function(){ try{ var all = Database.getAll(SHEET) || []; return Response.success({ data: all.length }); } catch(e){ return Response.error('Count failed'); } };

  this.ContractorMasterService = S;
  return S;
})();
