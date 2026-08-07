(function(){
  /**
   * MaterialMasterValidation.js
   * Pure validation helpers for Material Master.
   * Exposes: SahakarValidation.MaterialMaster
   * No DB access. Returns { valid, errors, warnings }
   */
  if (typeof this.SahakarValidation === 'undefined') this.SahakarValidation = {};

  var utils = {
    isEmpty: function(v){ return v === null || v === undefined || String(v).trim() === ''; },
    isNumber: function(v){ return !isNaN(Number(v)) && isFinite(v); },
    isPositiveNumber: function(v){ return utils.isNumber(v) && Number(v) >= 0; },
    isHSN: function(v){ return /^\d{4,8}$/.test(String(v||'')); },
    isBarcode: function(v){ return /^[0-9A-Z\-]{4,50}$/.test(String(v||'')); },
    isQRCode: function(v){ return /^[\w:\/\-\.=]{4,200}$/.test(String(v||'')); }
  };

  var V = {};

  V.validateField = function(fieldName, value){
    var errors = [], warnings = [];
    switch(fieldName){
      case 'Material Code':
        if (utils.isEmpty(value)) errors.push('Material Code is required.');
        break;
      case 'Material Name':
        if (utils.isEmpty(value)) errors.push('Material Name is required.');
        break;
      case 'Unit':
        if (utils.isEmpty(value)) errors.push('Unit is required.');
        break;
      case 'GST Rate':
        if (utils.isEmpty(value)) errors.push('GST Rate is required.');
        else if (!utils.isNumber(value)) errors.push('GST Rate must be a number.');
        break;
      case 'Minimum Stock':
      case 'Maximum Stock':
      case 'Reorder Level':
      case 'Opening Stock':
      case 'Current Stock':
      case 'Opening Rate':
      case 'Standard Rate':
      case 'Last Purchase Rate':
        if (!utils.isEmpty(value) && !utils.isPositiveNumber(value)) errors.push(fieldName + ' must be a non-negative number.');
        break;
      case 'HSN Code':
        if (!utils.isEmpty(value) && !utils.isHSN(value)) warnings.push('HSN Code should be numeric (4-8 digits).');
        break;
      case 'Barcode':
        if (!utils.isEmpty(value) && !utils.isBarcode(value)) warnings.push('Barcode format looks unusual.');
        break;
      case 'QR Code':
        if (!utils.isEmpty(value) && !utils.isQRCode(value)) warnings.push('QR Code looks unusual.');
        break;
      default:
        break;
    }
    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateRecord = function(record){
    var errors = [], warnings = [];
    var fieldsToCheck = ['Material Code','Material Name','Unit','GST Rate','Minimum Stock','Maximum Stock','Reorder Level','Opening Stock','Current Stock','Opening Rate','Standard Rate','Last Purchase Rate','HSN Code','Barcode','QR Code'];
    fieldsToCheck.forEach(function(f){ var r = V.validateField(f, record[f]); r.errors.forEach(function(e){ errors.push(e); }); r.warnings.forEach(function(w){ warnings.push(w); }); });

    if (utils.isEmpty(record['Material Code'])) errors.push('Material Code is mandatory and must be unique (service enforces uniqueness).');
    if (utils.isEmpty(record['Material Name'])) errors.push('Material Name is mandatory.');
    if (utils.isEmpty(record['Unit'])) errors.push('Unit is mandatory.');
    if (utils.isEmpty(record['GST Rate'])) errors.push('GST Rate is mandatory.');

    return { valid: errors.length === 0, errors: errors, warnings: warnings };
  };

  V.validateCreate = function(record){ return V.validateRecord(record); };
  V.validateUpdate = function(record){ var res = V.validateRecord(record); if (utils.isEmpty(record['Material ID'])) res.errors.push('Material ID is required for update.'); return { valid: res.errors.length === 0, errors: res.errors, warnings: res.warnings }; };
  V.validateDelete = function(record){ var errors = []; if (utils.isEmpty(record['Material ID'])) errors.push('Material ID is required for delete.'); return { valid: errors.length === 0, errors: errors, warnings: [] }; };

  this.SahakarValidation.MaterialMaster = V;
  return V;
})();