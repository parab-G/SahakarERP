/**
 * ==========================================================
 * SAHAKAR ERP
 * Utils.gs
 * Version: 1.0.0
 * Common Utility Functions
 * ==========================================================
 */

/**
 * Format Date to yyyy-MM-dd
 */
function formatDate(value, pattern) {
  if (!value) return "";
  const fmt = pattern || "yyyy-MM-dd";
  return Utilities.formatDate(new Date(value), DEFAULT_TIMEZONE, fmt);
}

/**
 * Format Currency
 */
function formatCurrency(amount) {
  const n = Number(amount || 0);
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Generate ISO Timestamp
 */
function generateTimestamp() {
  return new Date().toISOString();
}

/**
 * Generate UUID
 */
function generateUUID() {
  return Utilities.getUuid();
}

/**
 * Check Blank
 */
function isBlank(value) {
  return value === null ||
         value === undefined ||
         String(value).trim() === "";
}

/**
 * Trim all string values in an object.
 */
function sanitizeInput(obj) {

  if (!obj || typeof obj !== "object") return obj;

  const cleaned = {};

  Object.keys(obj).forEach(function(key){

    const value = obj[key];

    cleaned[key] =
      (typeof value === "string")
        ? value.trim()
        : value;

  });

  return cleaned;
}

/**
 * Log Error
 */
function logError(source, err) {

  const msg = err && err.message ? err.message : String(err);

  console.error("[" + source + "] " + msg);

}

/**
 * Safe Executor
 */
function safeExecute(callback) {

  try {

    return success(callback());

  } catch (ex) {

    logError("safeExecute", ex);

    return serverError(ex);

  }

}

/**
 * Deep Clone
 */
function cloneObject(obj){
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Convert value to Boolean.
 */
function toBoolean(value){

  if (typeof value === "boolean") return value;

  return String(value).toUpperCase() === "TRUE";

}
