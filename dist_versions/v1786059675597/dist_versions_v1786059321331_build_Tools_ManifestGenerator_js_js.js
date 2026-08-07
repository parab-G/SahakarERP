/**
 * ManifestGenerator.js
 * Produces appsscript.json for Apps Script deployment based on config and manifest.
 */

const path = require('path');

function generate(config, manifest){
  // Basic manifest template. Consumers may modify for libraries and scopes.
  const template = {
    timeZone: config.timeZone || 'Etc/UTC',
    oauthScopes: config.oauthScopes || [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/script.external_request',
      'https://www.googleapis.com/auth/script.scriptapp'
    ],
    exceptionLogging: config.exceptionLogging || 'STACKDRIVER',
    runtimeVersion: config.runtimeVersion || 'V8',
    webapp: config.webapp || { access: 'ANYONE', executeAs: 'USER_DEPLOYING' }
  };
  // Add files list based on deployment manifest if needed (not required by clasp)
  return template;
}

module.exports = { generate };
