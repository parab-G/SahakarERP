/**
 * DeploymentVersionManager.js
 * Manages versioned snapshots of dist for rollback and auditing.
 */

const fs = require('fs');
const path = require('path');
const Utilities = require('./DeploymentUtilities');

function createVersionSnapshot(config){
  const repoRoot = process.cwd();
  // Prefer buildDir if present, otherwise fallback to distDir
  const srcDir = path.join(repoRoot, config.buildDir || config.distDir);
  const versionsDir = path.join(repoRoot, config.versionsDir || 'dist_versions');
  Utilities.ensureDir(versionsDir);
  const versionId = 'v' + Date.now();
  const snapshotDir = path.join(versionsDir, versionId);
  Utilities.copyDir(srcDir, snapshotDir);
  return { versionId, snapshotDir };
}

function listVersions(config){
  const repoRoot = process.cwd();
  const versionsDir = path.join(repoRoot, config.versionsDir || 'dist_versions');
  if (!fs.existsSync(versionsDir)) return [];
  return fs.readdirSync(versionsDir).sort();
}

module.exports = { createVersionSnapshot, listVersions };
