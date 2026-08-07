(function(){
  /**
   * BankMasterService.js
   * Server-side service for Bank Master.
   * Uses Database.js, Response.js, Utils.js, and SahakarValidation.BankMaster
   */
  if (typeof this.BankMasterService !== 'undefined') return;

  var S = {};
  var SHEET = (this.SahakarSchemas && this.SahakarSchemas.BankMaster && this.SahakarSchemas.BankMaster.sheetName) || 'Banks';

  function nowIso(){ return (new Date()).toISOString(); }
  function makeId(){ if (typeof Utils !== 'undefined' && Utils.generateId) return Utils.generateId(); if (typeof Utils !== 'undefined' && Utils.generateUuid) return Utils.generateUuid(); return 'BANK-' + Date.now(); }

  S.initialize = function(){ try{ if (typeof Database !== 'undefined' && Database.ensureSheet) Database.ensureSheet(SHEET); return Response.success({ message: 'BankMaster initialized' }); } catch(e){ return Response.error('Init failed'); } };

  S.getAll = function(){ try{ var rows = Database.getAll(SHEET) || []; return Response.success({ data: rows }); } catch(e){ return Response.error('Failed to load banks'); } };

  S.getById = function(id){ try{ var r = Database.findById(SHEET, id); if (!r) return Response.notFound('Bank not found'); return Response.success({ data: r }); } catch(e){ return Response.error('Failed to load bank'); } };

  S.getActive = function(){ try{ var rows = Database.getAll(SHEET)||[]; var active = rows.filter(function(r){ return r['Active'] === true || String(r['Active']).toLowerCase()==='true'; }); return Response.success({ data: active }); } catch(e){ return Response.error('Failed to load active banks'); } };

  S.exists = function(id){ try{ var r = Database.findById(SHEET, id); return !!r; } catch(e){ return false; } };

  S.create = function(record){
    try{
      var v = (this.SahakarValidation && this.SahakarValidation.BankMaster) ? this.SahakarValidation.BankMaster.validateCreate(record) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce IFSC uniqueness
      var all = Database.getAll(SHEET) || [];
      var ifsc = record['IFSC Code'];
      if (ifsc){ var dup = all.find(function(r){ return String(r['IFSC Code']||'').trim().toUpperCase() === String(ifsc||'').trim().toUpperCase(); }); if (dup) return Response.validationError(['IFSC Code must be unique.']); }

      var id = record['Bank ID'] || makeId();
      record['Bank ID'] = id;
      record['Created By'] = record['Created By'] || 'system';
      record['Created Date'] = record['Created Date'] || nowIso();
      record['Deleted'] = false;

      Database.insertRecord(SHEET, record);
      return Response.success({ data: record, message: 'Bank created' });
    } catch(e){ return Response.error('Failed to create bank'); }
  };

  S.update = function(id, updates){
    try{
      if (!id) return Response.validationError(['Bank ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Bank not found');

      var merged = Object.assign({}, existing, updates);
      var v = (this.SahakarValidation && this.SahakarValidation.BankMaster) ? this.SahakarValidation.BankMaster.validateUpdate(merged) : { valid: true, errors: [] };
      if (!v.valid) return Response.validationError(v.errors);

      // enforce IFSC uniqueness excluding current
      if (merged['IFSC Code']){
        var all = Database.getAll(SHEET) || [];
        var dup = all.find(function(r){ return r['Bank ID'] !== id && String(r['IFSC Code']||'').trim().toUpperCase() === String(merged['IFSC Code']||'').trim().toUpperCase(); });
        if (dup) return Response.validationError(['IFSC Code must be unique.']);
      }

      merged['Updated By'] = updates['Updated By'] || 'system';
      merged['Updated Date'] = nowIso();
      Database.updateRecord(SHEET, id, merged);
      return Response.success({ data: merged, message: 'Bank updated' });
    } catch(e){ return Response.error('Failed to update bank'); }
  };

  S.softDelete = function(id){
    try{
      if (!id) return Response.validationError(['Bank ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Bank not found');
      existing['Deleted'] = true;
      existing['Deleted Date'] = nowIso();
      existing['Active'] = false;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Bank soft-deleted' });
    } catch(e){ return Response.error('Failed to delete bank'); }
  };

  S.restore = function(id){
    try{
      if (!id) return Response.validationError(['Bank ID required']);
      var existing = Database.findById(SHEET, id);
      if (!existing) return Response.notFound('Bank not found');
      existing['Deleted'] = false;
      existing['Deleted Date'] = '';
      existing['Active'] = true;
      Database.updateRecord(SHEET, id, existing);
      return Response.success({ message: 'Bank restored' });
    } catch(e){ return Response.error('Failed to restore bank'); }
  };

  S.search = function(filters){
    try{
      var all = Database.getAll(SHEET) || [];
      filters = filters || {};
      var q = String(filters.q || '').toLowerCase();
      var result = all.filter(function(r){
        if (!q) return true;
        var hay = [r['Bank Name'], r['Branch Name'], r['IFSC Code'], r['MICR Code'], r['Branch Manager']].join(' ').toLowerCase();
        return hay.indexOf(q) !== -1;
      });
      return Response.success({ data: result });
    } catch(e){ return Response.error('Search failed'); }
  };

  S.count = function(){ try{ var all = Database.getAll(SHEET) || []; return Response.success({ data: all.length }); } catch(e){ return Response.error('Count failed'); } };

  this.BankMasterService = S;
  return S;
})();