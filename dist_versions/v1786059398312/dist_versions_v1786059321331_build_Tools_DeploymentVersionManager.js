/**
 * DeploymentVersionManager.js
 * Manages versioned snapshots of dist for rollback and auditing.
 */

const fs = require('fs');
const path = require('path');
const Utilities = require('./DeploymentUtilities');

function createVersionSnapshot(config){
  const repoRoot = process.cwd();
  const distDir = path.join(repoRoot, config.distDir);
  const versionsDir = path.join(repoRoot, config.versionsDir || 'dist_versions');
  Utilities.ensureDir(versionsDir);
  const versionId = 'v' + Date.now();
  const snapshotDir = path.join(versionsDir, versionId);
  Utilities.copyDir(distDir, snapshotDir);
  return { versionId, snapshotDir };
}

function listVersions(config){
  const repoRoot = process.cwd();
  const versionsDir = path.join(repoRoot, config.versionsDir || 'dist_versions');
  if (!fs.existsSync(versionsDir)) return [];
  return fs.readdirSync(versionsDir).sort();
}

module.exports = { createVersionSnapshot, listVersions };
