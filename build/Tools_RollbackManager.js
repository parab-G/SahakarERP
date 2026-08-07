/*
 * RollbackManager.js
 * Provides utilities to rollback to a previous snapshot produced by DeploymentVersionManager
 */

const fs = require('fs');
const path = require('path');
const Utilities = require('./DeploymentUtilities');

function rollbackTo(versionId, config){
  const repoRoot = process.cwd();
  const versionsDir = path.join(repoRoot, config.versionsDir || 'dist_versions');
  const snapshotDir = path.join(versionsDir, versionId);
  if (!fs.existsSync(snapshotDir)) throw new Error('Snapshot not found: ' + snapshotDir);
  const targetDir = path.join(repoRoot, config.buildDir || config.distDir);
  // Remove current build/dist and copy snapshot
  if (fs.existsSync(targetDir)) Utilities.removeDir(targetDir);
  Utilities.copyDir(snapshotDir, targetDir);
  return { restored: true, targetDir };
}

module.exports = { rollbackTo };
