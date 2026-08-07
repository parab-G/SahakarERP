/**
 * ==========================================================
 * SAHAKAR ERP
 * Response.js
 * Version : 1.1.0
 * ==========================================================
 */

const Response = (() => {

    'use strict';

    function success(data = null, message = 'Success') {
        return {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        };
    }

    function error(message = 'Unexpected Error') {
        return {
            success: false,
            message,
            data: null,
            timestamp: new Date().toISOString()
        };
    }

    function validationError(errors = []) {
        return {
            success: false,
            message: 'Validation Failed',
            errors,
            timestamp: new Date().toISOString()
        };
    }

    function notFound(message = 'Record Not Found') {
        return {
            success: false,
            message,
            data: null,
            timestamp: new Date().toISOString()
        };
    }

    function serverError(exception) {

        console.error(exception);

        return {
            success: false,
            message: exception.message || 'Internal Server Error',
            data: null,
            timestamp: new Date().toISOString()
        };

    }

    return Object.freeze({

        success,

        error,

        validationError,

        notFound,

        serverError

    });

})();