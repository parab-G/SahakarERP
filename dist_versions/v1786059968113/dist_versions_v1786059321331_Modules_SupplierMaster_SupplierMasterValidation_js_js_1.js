/**
 * SupplierMasterValidation.js
 *
 * Validation helpers for the Supplier Master module.
 * Pure functions only — no DB access. Intended to be reused by UI and service.
 */
(function(){
  'use strict';
  if (typeof this.SahakarValidation === 'undefined') this.SahakarValidation = {};
  if (typeof this.SahakarValidation.SupplierMaster === 'undefined') this.SahakarValidation.SupplierMaster = {};
  var VM = this.SahakarValidation.SupplierMaster;

  function isEmpty(v){ return v === null || typeof v === 'undefined' || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length===0); }
  function isString(v){ return typeof v === 'string' || v instanceof String; }
  function isEmail(v){ if (!isString(v)) return false; var re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; return re.test(v); }
  function isPhone(v){ if (!isString(v)) return false; var cleaned = v.replace(/[\s\-()]/g,''); return /^\+?[0-9]{6,15}$/.test(cleaned); }
  function isPAN(v){ if (!isString(v)) return false; return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(v||'').toUpperCase()); }
  function isGSTIN(v){ if (!isString(v)) return false; return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(String(v||'').toUpperCase()); }
  function isIFSC(v){ if (!isString(v)) return false; return /^[A-Za-z]{4}0[A-Z0-9]{6}$/.test(String(v||'').toUpperCase()); }
  function isPincode(v){ if (!isString(v) && typeof v !== 'number') return false; var s=String(v).trim(); return /^\d{4,8}$/.test(s); }
  function isBankAccount(v){ if (v===null||v===undefined) return false; var s=String(v).trim(); return /^[0-9A-Za-z\-\/]{6,30}$/.test(s); }

  function makeResponse(){ return { valid: true, errors: [], warnings: [] }; }
  function pushError(r, f, m){ r.valid=false; r.errors.push({ field:f, message:m }); }
  function pushWarning(r,f,m){ r.warnings.push({ field:f, message:m }); }

  VM.validateField = function(field, value){ var r = makeResponse(); switch(String(field)){ case 'supplier_name': if (isEmpty(value)) pushError(r,field,'Supplier name is required'); else if (value.trim().length>200) pushError(r,field,'Too long'); break; case 'mobile': if (!isEmpty(value) && !isPhone(value)) pushError(r,field,'Invalid mobile'); break; case 'email': if (!isEmpty(value) && !isEmail(value)) pushError(r,field,'Invalid email'); break; case 'gstin': if (!isEmpty(value) && !isGSTIN(value)) pushError(r,field,'Invalid GSTIN'); break; case 'pan': if (!isEmpty(value) && !isPAN(value)) pushError(r,field,'Invalid PAN'); break; case 'ifsc': if (!isEmpty(value) && !isIFSC(value)) pushError(r,field,'Invalid IFSC'); break; case 'pincode': if (!isEmpty(value) && !isPincode(value)) pushError(r,field,'Invalid PIN'); break; default: pushWarning(r,field,'No validator for field'); break; } return r; };

  VM.validateRecord = function(rec){ var r=makeResponse(); if (!rec || typeof rec!=='object'){ pushError(r,'record','Record must be an object'); return r; } ['supplier_name','mobile','email','gstin','pan','ifsc','pincode'].forEach(function(k){ var res = VM.validateField(k, rec[k]); res.errors.forEach(function(e){ pushError(r,e.field,e.message); }); res.warnings.forEach(function(w){ pushWarning(r,w.field,w.message); }); }); return r; };

  VM.validateCreate = function(rec){ var r=VM.validateRecord(rec); if (isEmpty(rec.supplier_name)) pushError(r,'supplier_name','Supplier name required'); return r; };
  VM.validateUpdate = function(rec){ var r=VM.validateRecord(rec); if (isEmpty(rec.id) && isEmpty(rec.uuid)) pushError(r,'id','id or uuid required'); return r; };
  VM.validateDelete = function(rec){ var r=makeResponse(); if (isEmpty(rec.id) && isEmpty(rec.uuid)) pushError(r,'id','id or uuid required'); return r; };

  VM._helpers = { isEmail:isEmail, isPhone:isPhone, isPAN:isPAN, isGSTIN:isGSTIN, isIFSC:isIFSC, isPincode:isPincode };

  this.SahakarValidation.SupplierMaster = VM;
})();
