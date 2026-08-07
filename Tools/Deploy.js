#!/usr/bin/env node
/**
 * Deploy.js
 * Single entrypoint for full deployment lifecycle.
 * Usage: node Tools/Deploy.js [--config Tools/DeploymentConfig.json] [--build-only] [--push-only] [--deploy] [--version] [--dry-run] [--verbose]
 */

const { spawnSync, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const configPath = argv.config || path.join('Tools','DeploymentConfig.json');
const dryRun = argv['dry-run'] || false;
const buildOnly = argv['build-only'] || false;
const pushOnly = argv['push-only'] || false;
const doVersion = argv['version'] || false;
const doDeploy = argv['deploy'] || false;
const verbose = argv.verbose || false;

const Utilities = require('./DeploymentUtilities');
const Logger = require('./DeploymentLogger');
const Validator = require('./DeploymentValidator');
const VersionMgr = require('./DeploymentVersionManager');

let config = Utilities.loadConfig(configPath);
config.buildDir = config.buildDir || 'build';
const repoRoot = process.cwd();
const buildDir = path.join(repoRoot, config.buildDir);

const logger = new Logger(config.logFile, { verbose });

function runBuild(){
  logger.info('Starting build step');
  if (dryRun){
    logger.info('[dry-run] would execute Build.js');
    return { ok: true };
  }
  const res = spawnSync(process.execPath, [path.join(__dirname,'Build.js'), '--config', configPath, '--verbose'], { stdio: 'inherit' });
  if (res.status !== 0) return { ok: false, code: res.status };
  return { ok: true };
}

function ensureRepoClasp(){
  const repoClasp = path.join(repoRoot, '.clasp.json');
  if (!fs.existsSync(repoClasp)){
    throw new Error('Repository .clasp.json not found. Create .clasp.json with scriptId at repository root before deploying.');
  }
  const obj = JSON.parse(fs.readFileSync(repoClasp,'utf8'));
  if (!obj.scriptId) throw new Error('Repository .clasp.json missing scriptId');
  return obj;
}

function writeBuildClasp(repoClaspObj){
  Utilities.ensureDir(buildDir);
  const buildClasp = { scriptId: repoClaspObj.scriptId, rootDir: '.' };
  fs.writeFileSync(path.join(buildDir,'.clasp.json'), JSON.stringify(buildClasp, null, 2), 'utf8');
  logger.info('Wrote build/.clasp.json');
}

function pushBuild(){
  logger.info('Pushing build via clasp');
  if (dryRun){ logger.info('[dry-run] would run: (cd build && clasp push)'); return { ok: true } }
  try{
    execSync('clasp push', { cwd: buildDir, stdio: 'inherit' });
    return { ok: true };
  } catch(e){ logger.error('clasp push failed', e.message); return { ok: false, error: e }; }
}

function createVersion(){
  logger.info('Creating Apps Script version');
  if (dryRun){ logger.info('[dry-run] would run: (cd build && clasp version "auto-version")'); return { ok: true } }
  try{
    const out = execSync('clasp version --description "auto-version"', { cwd: buildDir });
    const ver = out.toString().trim();
    logger.info('Created version:', ver);
    return { ok: true, version: ver };
  } catch(e){ logger.error('clasp version failed', e.message); return { ok: false, error: e }; }
}

function snapshotSuccessfulBuild(){
  try{
    const info = VersionMgr.createVersionSnapshot(config);
    logger.info('Snapshot created:', info.versionId);
    return info;
  } catch(e){ logger.warn('Version snapshot failed', e.message); return null; }
}

(async function main(){
  try{
    logger.info('Deploy starting');

    if (pushOnly){
      if (!fs.existsSync(buildDir)) throw new Error('Build directory not found for push-only');
    }

    if (!pushOnly){
      const bres = runBuild();
      if (!bres.ok) throw new Error('Build failed');
    }

    const repoClaspObj = ensureRepoClasp();

    // Write build/.clasp.json after successful build
    if (!dryRun) writeBuildClasp(repoClaspObj); else logger.info('[dry-run] would write build/.clasp.json');

    // Validate
    const vres = Validator.validate(config);
    if (!vres || !vres.ok) throw new Error('Validation failed');

    if (buildOnly){ logger.info('Build-only requested; stopping after build and validate'); process.exit(0); }

    // Push build
    const pres = pushBuild();
    if (!pres.ok) throw new Error('Push failed');

    // Versioning
    if (doVersion){
      const ver = createVersion();
      if (!ver.ok) throw new Error('Version creation failed');
    }

    // Snapshot
    const snap = snapshotSuccessfulBuild();

    logger.info('Deploy completed successfully');
    process.exit(0);
  } catch(e){
    logger.error('Deployment failed:', e.message || e);
    process.exit(2);
  }
})();
