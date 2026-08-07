/**
 * SocietyMasterValidation.js
 *
 * Declarative business validation rules for the Society Master module.
 *
 * This module exports a collection of pure validation functions under the
 * global namespace `SahakarValidation.SocietyMaster` for reuse by UI, services,
 * import/batch scripts and future APIs. No database calls or side-effects are
 * performed here — uniqueness and cross-record constraints are reported as
 * warnings and must be enforced by the caller with access to persistent data.
 *
 * Style: Apps Script compatible, plain JS, documented helpers.
 */

(function(){
  'use strict';

  // Ensure validation namespace
  if (typeof this.SahakarValidation === 'undefined') this.SahakarValidation = {};
  if (typeof this.SahakarValidation.SocietyMaster === 'undefined') this.SahakarValidation.SocietyMaster = {};

  var VM = this.SahakarValidation.SocietyMaster;

  // ---------------------- Helper functions ----------------------
  /** isEmpty(value) -> boolean */
  function isEmpty(v){ return v === null || typeof v === 'undefined' || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0); }

  /** isString(v) */
  function isString(v){ return typeof v === 'string' || v instanceof String; }

  /** isEmail(v) basic RFC-lite check */
  function isEmail(v){ if (!isString(v)) return false; var re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/; return re.test(v); }

  /** isURL(v) basic check */
  function isURL(v){ if (!isString(v)) return false; try{ var u = new URL(v); return !!u.protocol && (u.protocol === 'http:' || u.protocol === 'https:'); } catch(e){ return false; } }

  /** isE164 or local phone */
  function isPhone(v){ if (!isString(v)) return false; // allow +country and digits, spaces, dashes
    var cleaned = v.replace(/[\s\-()]/g,''); return /^\+?[0-9]{6,15}$/.test(cleaned); }

  /** isMobile - same as phone but prefer 10-15 digits */
  function isMobile(v){ return isPhone(v); }

  /** isNumeric string */
  function isNumeric(v){ if (v === null || v === undefined) return false; return /^\d+$/.test(String(v)); }

  /** isISODate - YYYY-MM-DD or ISO timestamp */
  function isISODate(v){ if (!isString(v)) return false; // simple parse
    var d = Date.parse(v); return !isNaN(d); }

  function isPastOrToday(v){ if (!isISODate(v)) return false; var d = new Date(v); var now = new Date(); // ignore time zone fuzz
    return d.getTime() <= now.getTime(); }

  /** PAN (India) */
  function isPAN(v){ if (!isString(v)) return false; return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v.toUpperCase()); }

  /** GSTIN (India) basic check 15 chars */
  function isGSTIN(v){ if (!isString(v)) return false; return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v.toUpperCase()); }

  /** IFSC (India) */
  function isIFSC(v){ if (!isString(v)) return false; return /^[A-Za-z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase()); }

  /** PIN code */
  function isPincode(v){ if (!isString(v) && typeof v !== 'number') return false; var s = String(v).trim(); return /^\d{4,8}$/.test(s); }

  /** Basic bank account number sanity */
  function isBankAccount(v){ if (v === null || v === undefined) return false; var s = String(v).trim(); return /^[0-9A-Za-z\-\/]{6,30}$/.test(s); }

  // ---------------------- Validation primitives ----------------------
  function makeResponse(){ return { valid: true, errors: [], warnings: [] }; }
  function pushError(resp, path, msg){ resp.valid = false; resp.errors.push({ field: path, message: msg }); }
  function pushWarning(resp, path, msg){ resp.warnings.push({ field: path, message: msg }); }

  // ---------------------- Field-level validation ----------------------
  /** validateField(fieldName, value) -> {valid, errors, warnings} */
  VM.validateField = function(fieldName, value){ var r = makeResponse(); var f = String(fieldName||'').trim(); switch(f){
    case 'name':
      if (isEmpty(value)) pushError(r,'name','Society name is required.');
      else if (!isString(value)) pushError(r,'name','Society name must be a string.');
      else if (value.trim().length > 200) pushError(r,'name','Society name must be at most 200 characters.');
      break;

    case 'society_code':
      if (isEmpty(value)) pushError(r,'society_code','Society code is required.');
      else if (!/^[A-Za-z0-9\-_]{3,15}$/.test(String(value))) pushError(r,'society_code','Society code must be 3–15 alphanumeric characters, - or _.');
      else pushWarning(r,'society_code','Uniqueness must be verified by the service (no DB access from validator).');
      break;

    case 'registration_number':
      if (!isEmpty(value) && !/^[A-Za-z0-9\-\/_]{1,50}$/.test(String(value))) pushError(r,'registration_number','Registration number must be alphanumeric (max 50).');
      else if (!isEmpty(value)) pushWarning(r,'registration_number','Uniqueness should be enforced by the service.');
      break;

    case 'registration_date':
      if (!isEmpty(value)){
        if (!isISODate(value)) pushError(r,'registration_date','Registration date must be a valid date (ISO format).');
        else if (!isPastOrToday(value)) pushError(r,'registration_date','Registration date cannot be in the future.');
      }
      break;

    case 'society_type':
      var allowed = ['cooperative','society','trust','company'];
      if (isEmpty(value)) pushError(r,'society_type','Society type is required.');
      else if (allowed.indexOf(String(value)) === -1) pushError(r,'society_type','Invalid society type. Allowed: ' + allowed.join(', '));
      break;

    case 'pan':
      if (!isEmpty(value) && !isPAN(value)) pushError(r,'pan','PAN format invalid (expected India PAN).');
      break;

    case 'gstin':
      if (!isEmpty(value) && !isGSTIN(value)) pushError(r,'gstin','GSTIN format appears invalid.');
      break;

    case 'email':
      if (!isEmpty(value) && !isEmail(value)) pushError(r,'email','Email format is invalid.');
      break;

    case 'mobile':
      if (!isEmpty(value) && !isMobile(value)) pushError(r,'mobile','Mobile number looks invalid. Use E.164 or digits (6–15).');
      break;

    case 'phone':
      if (!isEmpty(value) && !isPhone(value)) pushError(r,'phone','Phone number looks invalid.');
      break;

    case 'pincode':
      if (!isEmpty(value) && !isPincode(value)) pushError(r,'pincode','PIN/ZIP code must be numeric (4–8 digits).');
      break;

    case 'website':
      if (!isEmpty(value) && !isURL(value)) pushError(r,'website','Website must be a valid URL starting with http(s).');
      break;

    case 'account_number':
      if (!isEmpty(value) && !isBankAccount(value)) pushError(r,'account_number','Account number appears invalid.');
      break;

    case 'ifsc_code':
      if (!isEmpty(value) && !isIFSC(value)) pushError(r,'ifsc_code','IFSC code format invalid (India).');
      break;

    case 'active':
      if (typeof value !== 'boolean') pushError(r,'active','Active must be boolean.');
      else pushWarning(r,'active','Only one active society must exist — caller must verify across records.');
      break;

    case 'office_bearers':
      if (!isEmpty(value)){
        var ob = value;
        if (isString(ob)){
          // JSON string allowed but warn
          try{ ob = JSON.parse(ob); } catch(e){ pushError(r,'office_bearers','Office bearers must be an array or JSON string representing an array.'); ob = null; }
        }
        if (Array.isArray(ob)){
          ob.forEach(function(o, idx){ if (!o) return; if (!o.name || !String(o.name).trim()) pushError(r,'office_bearers['+idx+'].name','Office bearer name is required.'); if (!o.designation || !String(o.designation).trim()) pushError(r,'office_bearers['+idx+'].designation','Office bearer designation is required.'); });
        }
      }
      break;

    default:
      // Unknown field — validation is delegated to caller
      pushWarning(r, fieldName, 'No specific validator for field: ' + fieldName);
      break;
  }

  return r; };

  // ---------------------- Record-level validation ----------------------
  /** validateRecord(record) -> {valid, errors, warnings} */
  VM.validateRecord = function(record){ var resp = makeResponse(); if (!record || typeof record !== 'object') { pushError(resp,'record','Record must be an object'); return resp; }
    // required fields for record-level validity
    // name
    var fieldsToCheck = ['name','society_code','society_type','registration_date','email','mobile','phone','pincode','pan','gstin','account_number','ifsc_code','office_bearers','active'];
    // Validate common fields
    ['name','society_code','society_type','registration_date','email','mobile','phone','pincode','website','registration_number','pan','gstin','account_number','ifsc_code','office_bearers','active'].forEach(function(k){ var result = VM.validateField(k, record[k]); result.errors.forEach(function(e){ pushError(resp,e.field,e.message); }); result.warnings.forEach(function(w){ pushWarning(resp,w.field,w.message); } ); });

    // Additional record-level rules
    // No duplicate society names cannot be checked without DB — warn caller
    if (!isEmpty(record.name)) pushWarning(resp,'name','Uniqueness of society name must be verified by the service if required.');

    // Registration date vs activation date
    if (record.registration_date && record.activation_date){ try{ var rd = new Date(record.registration_date); var ad = new Date(record.activation_date); if (rd.getTime() > ad.getTime()) pushWarning(resp,'activation_date','Activation date occurs before registration date.'); } catch(e){} }

    return resp; };

  // ---------------------- Create / Update / Delete validators ----------------------
  /** validateCreate(record) */
  VM.validateCreate = function(record){ var r = VM.validateRecord(record);
    // enforce required for create
    if (isEmpty(record.name)) pushError(r,'name','Society name is required for create.');
    if (isEmpty(record.society_code)) pushError(r,'society_code','Society code is required for create.');
    if (isEmpty(record.society_type)) pushError(r,'society_type','Society type is required for create.');
    // registration_date optional but if present must be <= today already validated
    return r; };

  /** validateUpdate(record) */
  VM.validateUpdate = function(record){ var r = VM.validateRecord(record);
    // updates must include identifier
    if (isEmpty(record.id) && isEmpty(record.uuid)) pushError(r,'id','Update requires id or uuid to identify the record.');
    return r; };

  /** validateDelete(record) */
  VM.validateDelete = function(record){ var r = makeResponse(); if (!record || typeof record !== 'object') { pushError(r,'record','Record must be an object'); return r; }
    if (isEmpty(record.id) && isEmpty(record.uuid)) pushError(r,'id','Delete requires id or uuid.');
    // additional business rule: prevent delete if active (caller should handle) — report as warning
    if (record && record.active) pushWarning(r,'active','Record is active. Deleting an active society is discouraged; consider deactivating first.');
    return r; };

  // Expose helpers for tests or callers
  VM._helpers = {
    isEmpty: isEmpty,
    isEmail: isEmail,
    isPhone: isPhone,
    isISODate: isISODate,
    isPAN: isPAN,
    isGSTIN: isGSTIN,
    isIFSC: isIFSC,
    isPincode: isPincode
  };

  // Attach to global context
  this.SahakarValidation.SocietyMaster = VM;

})();
