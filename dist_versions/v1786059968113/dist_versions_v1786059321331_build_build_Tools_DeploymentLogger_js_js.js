/**
 * DeploymentLogger.js
 * Simple file + console logger for deployment operations.
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logFile, opts){
    this.logFile = logFile || path.join(process.cwd(),'build','deployment_log.txt');
    this.verbose = opts && opts.verbose;
    try{ fs.mkdirSync(path.dirname(this.logFile), { recursive: true }); } catch(e){}
  }
  info(...args){ console.log('[INFO]', ...args); try{ fs.appendFileSync(this.logFile, '[INFO] ' + args.join(' ') + '\n'); }catch(e){} }
  warn(...args){ console.warn('[WARN]', ...args); try{ fs.appendFileSync(this.logFile, '[WARN] ' + args.join(' ') + '\n'); }catch(e){} }
  error(...args){ console.error('[ERR]', ...args); try{ fs.appendFileSync(this.logFile, '[ERR] ' + args.join(' ') + '\n'); }catch(e){} }
}

function createDefault(){ return new Logger(null, { verbose: false }); }
module.exports = Logger;
module.exports.createDefault = createDefault;
