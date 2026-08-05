/**
 * ==========================================================
 * SAHAKAR ERP
 * Utils.js
 * Version: 1.1.0
 * Common Utility Functions
 * ==========================================================
 */

/**
 * Format Date
 */
function formatDate(value, pattern) {

  if (!value) return "";

  return Utilities.formatDate(
    new Date(value),
    DEFAULT_TIMEZONE,
    pattern || "yyyy-MM-dd"
  );

}

/**
 * Format Currency
 */
function formatCurrency(amount) {

  return Number(amount || 0).toLocaleString("en-IN", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2

  });

}

/**
 * ISO Timestamp
 */
function generateTimestamp() {

  return new Date().toISOString();

}

/**
 * UUID
 */
function generateUUID() {

  return Utilities.getUuid();

}

/**
 * Blank Check
 */
function isBlank(value) {

  return value === null ||

         value === undefined ||

         String(value).trim() === "";

}

/**
 * Trim object strings
 */
function sanitizeInput(obj) {

  if (!obj || typeof obj !== "object") {

    return obj;

  }

  const cleaned = {};

  Object.keys(obj).forEach(function (key) {

    cleaned[key] =

      typeof obj[key] === "string"

        ? obj[key].trim()

        : obj[key];

  });

  return cleaned;

}

/**
 * Boolean Converter
 */
function toBoolean(value) {

  if (typeof value === "boolean") {

    return value;

  }

  return String(value).trim().toUpperCase() === "TRUE";

}

/**
 * Deep Clone
 */
function cloneObject(obj) {

  return JSON.parse(JSON.stringify(obj));

}

/**
 * Logger
 */
function logError(source, err) {

  console.error(

    "[" + source + "]",

    err && err.stack

      ? err.stack

      : err

  );

}

/**
 * Safe Executor
 *
 * Every backend service should return
 * a standardized Response object.
 */
function safeExecute(callback, source) {

  try {

    const result = callback();

    return Response.success(

      result,

      "Success"

    );

  }

  catch (ex) {

    logError(

      source || "safeExecute",

      ex

    );

    return Response.serverError(ex);

  }

}

/**
 * Validate Required Fields
 */
function validateRequired(record, fields) {

  const errors = [];

  fields.forEach(function (field) {

    if (isBlank(record[field])) {

      errors.push({

        field: field,

        message: field + " is required."

      });

    }

  });

  return errors;

}

/**
 * Validate Mobile Number
 */
function isValidMobile(value) {

  return /^[6-9][0-9]{9}$/.test(

    String(value || "").trim()

  );

}

/**
 * Validate PAN
 */
function isValidPAN(value) {

  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

    .test(String(value || "").trim().toUpperCase());

}

/**
 * Validate GSTIN
 */
function isValidGSTIN(value) {

  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/

    .test(String(value || "").trim().toUpperCase());

}

/**
 * Validate Email
 */
function isValidEmail(value) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    .test(String(value || "").trim());

}