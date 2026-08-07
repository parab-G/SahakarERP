(function(){
  /**
   * UnitMasterValidation.js
   * Pure validation helpers for Unit Master.
   * Exposes: SahakarValidation.UnitMaster
   */
  if (typeof this.SahakarValidation === 'undefined') this.SahakarValidation = {};

  var utils = {
    isEmpty: function(v){ return v === null || v === undefined || String(v).trim() === ''; },
    isNumber: function(v){ return !isNaN(Number(v)) && isFinite(v); },
    matchesPattern: function(v, p){ try{ return new RegExp(p).test(String(v||'')); }catch(e){ return false; } }
  };

  var V = {};

  V.validateField = function(fieldName, value){
    var errors = [], warnings = [];
    switch(fieldName){
      case 'Unit Code':
        if (utils.isEmpty(value)) errors.push('Unit Code is required.');
        else if (!utils.matchesPattern(value, '^[A-Z0-9_\-]{1,10}$')) errors.push('Unit Code must be 1-10 chars, uppercase letters, numbers, underscore or hyphen.');
        break;
      case 'Unit Name':
        if (utils.isEmpty(value)) errors.push('Unit Name is required.');
        break;
      case 'Display Order':
        if (!utils.isEmpty(value) && !utils.isNumber(value)) errors.push('Display Order must be a number.');
        break;
      default:
        break;
    }
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateRecord = function(record){
    var errors = [], warnings = [];
    var fieldsToCheck = ['Unit Code','Unit Name','Display Order'];
    fieldsToCheck.forEach(function(f){ var r = V.validateField(f, record[f]); r.errors.forEach(function(e){ errors.push(e); }); r.warnings.forEach(function(w){ warnings.push(w); }); });

    if (utils.isEmpty(record['Unit Code'])) errors.push('Unit Code is mandatory and must be unique (service enforces uniqueness).');
    if (utils.isEmpty(record['Unit Name'])) errors.push('Unit Name is mandatory.');

    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateCreate = function(record){ return V.validateRecord(record); };
  V.validateUpdate = function(record){ var res = V.validateRecord(record); if (utils.isEmpty(record['Unit ID'])) res.errors.push('Unit ID is required for update.'); return { valid: res.errors.length === 0, errors: res.errors, warnings: res.warnings }; };
  V.validateDelete = function(record){ var errors = []; if (utils.isEmpty(record['Unit ID'])) errors.push('Unit ID is required for delete.'); return { valid: errors.length === 0, errors: errors, warnings: [] }; };

  this.SahakarValidation.UnitMaster = V;
  return V;
})();