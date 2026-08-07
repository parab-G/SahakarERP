(function(){
  /**
   * DepartmentMasterValidation.js
   * Pure validation helpers for Department Master.
   * Exposes: SahakarValidation.DepartmentMaster
   * No DB access. Returns { valid, errors, warnings }
   */
  if (typeof this.SahakarValidation === 'undefined') this.SahakarValidation = {};

  var utils = {
    isEmpty: function(v){ return v === null || v === undefined || String(v).trim() === ''; },
    isEmail: function(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v||'')); },
    isPhone: function(v){ return /^\d{6,15}$/.test(String(v||'')); },
    isPincode: function(v){ return /^\d{6}$/.test(String(v||'')); },
    isUrl: function(v){ try{ if (!v) return false; return /^(https?:\/\/)?([\w.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v); }catch(e){return false;} }
  };

  var V = {};

  V.validateField = function(fieldName, value){
    var errors = [], warnings = [];
    switch(fieldName){
      case 'Department Code':
        if (utils.isEmpty(value)) errors.push('Department Code is required.');
        break;
      case 'Department Name':
        if (utils.isEmpty(value)) errors.push('Department Name is required.');
        break;
      case 'Email':
        if (!utils.isEmpty(value) && !utils.isEmail(value)) errors.push('Email is invalid.');
        break;
      case 'Office Phone':
        if (!utils.isEmpty(value) && !utils.isPhone(value)) errors.push('Office Phone looks invalid.');
        break;
      case 'Pincode':
        if (!utils.isEmpty(value) && !utils.isPincode(value)) errors.push('Pincode must be a 6 digit number.');
        break;
      case 'Website':
        if (!utils.isEmpty(value) && !utils.isUrl(value)) warnings.push('Website value does not look like a valid URL.');
        break;
      default:
        break;
    }
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateRecord = function(record){
    var errors = [], warnings = [];
    var fieldsToCheck = ['Department Code','Department Name','Email','Office Phone','Pincode','Website'];
    fieldsToCheck.forEach(function(f){ var r = V.validateField(f, record[f]); r.errors.forEach(function(e){ errors.push(e); }); r.warnings.forEach(function(w){ warnings.push(w); }); });

    if (utils.isEmpty(record['Department Code'])) errors.push('Department Code is mandatory and must be unique (service enforces uniqueness).');
    if (utils.isEmpty(record['Department Name'])) errors.push('Department Name is mandatory and must be unique (service enforces uniqueness).');

    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateCreate = function(record){ return V.validateRecord(record); };
  V.validateUpdate = function(record){ var res = V.validateRecord(record); if (utils.isEmpty(record['Department ID'])) res.errors.push('Department ID is required for update.'); return { valid: res.errors.length === 0, errors: res.errors, warnings: res.warnings }; };
  V.validateDelete = function(record){ var errors = []; if (utils.isEmpty(record['Department ID'])) errors.push('Department ID is required for delete.'); return { valid: errors.length === 0, errors: errors, warnings: [] }; };

  this.SahakarValidation.DepartmentMaster = V;
  return V;
})();