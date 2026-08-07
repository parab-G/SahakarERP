(function(){
  /**
   * ContractorMasterValidation.js
   * Pure validation helpers for Contractor Master.
   * Exposes: SahakarValidation.ContractorMaster
   * No DB access. Returns { valid, errors, warnings }
   */
  if (typeof this.SahakarValidation === 'undefined') this.SahakarValidation = {};

  var utils = {
    isEmpty: function(v){ return v === null || v === undefined || String(v).trim() === ''; },
    isEmail: function(v){ return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); },
    isMobile: function(v){ return /^\d{10}$/.test(String(v||'')); },
    isGSTIN: function(v){ return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(String(v||'')); },
    isPAN: function(v){ return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(v||'')); },
    isIFSC: function(v){ return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(v||'')); },
    isPincode: function(v){ return /^\d{6}$/.test(String(v||'')); },
    isUrl: function(v){ try{ if (!v) return false; return /^(https?:\/\/)?([\w.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v); }catch(e){return false;} },
    isDate: function(v){ var d = new Date(v); return !isNaN(d.valueOf()); },
    isNotFutureDate: function(v){ if (!v) return true; var d = new Date(v); return !isNaN(d.valueOf()) && d <= new Date(); }
  };

  var V = {};

  V.validateField = function(fieldName, value){
    var errors = [], warnings = [];
    switch(fieldName){
      case 'Contractor Name':
        if (utils.isEmpty(value)) errors.push('Contractor Name is required.');
        break;
      case 'Registration Number':
        if (utils.isEmpty(value)) errors.push('Registration Number is required.');
        break;
      case 'Mobile':
        if (utils.isEmpty(value)) errors.push('Mobile is required.');
        else if (!utils.isMobile(value)) errors.push('Mobile must be a 10 digit number.');
        break;
      case 'GSTIN':
        if (!utils.isEmpty(value) && !utils.isGSTIN(value)) errors.push('GSTIN format is invalid.');
        break;
      case 'PAN':
        if (!utils.isEmpty(value) && !utils.isPAN(value)) errors.push('PAN format is invalid.');
        break;
      case 'IFSC':
        if (!utils.isEmpty(value) && !utils.isIFSC(value)) errors.push('IFSC format is invalid.');
        break;
      case 'Pincode':
        if (!utils.isEmpty(value) && !utils.isPincode(value)) errors.push('Pincode must be a 6 digit number.');
        break;
      case 'Email':
        if (!utils.isEmpty(value) && !utils.isEmail(value)) errors.push('Email is invalid.');
        break;
      case 'Website':
        if (!utils.isEmpty(value) && !utils.isUrl(value)) warnings.push('Website value does not look like a valid URL.');
        break;
      case 'Labour License Valid Upto':
      case 'PWD Valid Upto':
      case 'Blacklisted Date':
        if (!utils.isEmpty(value) && !utils.isDate(value)) errors.push(fieldName + ' must be a valid date.');
        if (!utils.isEmpty(value) && !utils.isNotFutureDate(value)) warnings.push(fieldName + ' is in the future.');
        break;
      default:
        break;
    }
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateRecord = function(record){
    var errors = [], warnings = [];
    var fieldsToCheck = ['Contractor Name','Registration Number','Mobile','GSTIN','PAN','IFSC','Pincode','Email','Website','Labour License Valid Upto','PWD Valid Upto','Blacklisted Date'];
    fieldsToCheck.forEach(function(f){ var r = V.validateField(f, record[f]); r.errors.forEach(function(e){ errors.push(e); }); r.warnings.forEach(function(w){ warnings.push(w); }); });

    // Business constraints (no DB access here): note uniqueness requirements in warnings for service-level enforcement
    if (utils.isEmpty(record['Registration Number'])) errors.push('Registration Number is mandatory and must be unique (service enforces uniqueness).');

    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateCreate = function(record){ return V.validateRecord(record); };
  V.validateUpdate = function(record){ var res = V.validateRecord(record); if (utils.isEmpty(record['Contractor ID'])) res.errors.push('Contractor ID is required for update.'); return { valid: res.errors.length === 0, errors: res.errors, warnings: res.warnings }; };
  V.validateDelete = function(record){ var errors = []; if (utils.isEmpty(record['Contractor ID'])) errors.push('Contractor ID is required for delete.'); return { valid: errors.length === 0, errors: errors, warnings: [] }; };

  this.SahakarValidation.ContractorMaster = V;
  return V;
})();
