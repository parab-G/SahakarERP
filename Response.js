/**
 * ==========================================================
 * SAHAKAR ERP
 * Response.gs
 * Version: 1.0.0
 * Standard API Response Helpers
 * ==========================================================
 */

/**
 * Success response
 * @param {*} data
 * @param {string} message
 * @returns {Object}
 */
function success(data, message) {
  return {
    success: true,
    message: message || "Operation completed successfully.",
    data: data || null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Error response
 * @param {string} message
 * @returns {Object}
 */
function error(message) {
  return {
    success: false,
    message: message || "An unexpected error occurred.",
    data: null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Validation error response
 * @param {Array|string} errors
 * @returns {Object}
 */
function validationError(errors) {
  return {
    success: false,
    message: "Validation failed.",
    errors: Array.isArray(errors) ? errors : [errors],
    timestamp: new Date().toISOString()
  };
}

/**
 * Record not found response
 * @param {string} entity
 * @returns {Object}
 */
function notFound(entity) {
  return {
    success: false,
    message: (entity || "Record") + " not found.",
    data: null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Exception response
 * @param {*} ex
 * @returns {Object}
 */
function serverError(ex) {

  const msg = ex && ex.message ? ex.message : String(ex);

  console.error(msg);

  return {
    success: false,
    message: "Internal server error.",
    error: msg,
    timestamp: new Date().toISOString()
  };
}
