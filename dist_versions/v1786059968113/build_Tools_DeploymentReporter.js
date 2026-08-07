/**
 * DeploymentReporter.js
 * Writes human-readable deployment reports to AI/DEPLOYMENT/DEPLOYMENT_REPORT.md
 */

const fs = require('fs');
const path = require('path');
const Utilities = require('./DeploymentUtilities');

function writeReport({ config, manifest, depGraph, resolveResult, validation, versionInfo }){
  const reportPath = path.join(process.cwd(), config.reportFile || 'AI/DEPLOYMENT/DEPLOYMENT_REPORT.md');
  const lines = [];
  lines.push('# Deployment Report');
  lines.push('');
  lines.push('Date: ' + new Date().toISOString());
  lines.push('');
  lines.push('Files processed: ' + (manifest && manifest.entries ? manifest.entries.length : 0));
  lines.push('');
  if (manifest && manifest.entries){
    lines.push('## Files');
    manifest.entries.forEach(e=>{ lines.push('- ' + e.source + ' -> ' + e.target); });
    lines.push('');
  }
  if (resolveResult){
    lines.push('## Broken Includes');
    (resolveResult.brokenIncludes||[]).forEach(b=> lines.push('- ' + b.file + ' includes ' + b.include));
    lines.push('');
  }
  if (validation && !validation.ok){
    lines.push('## Validation Errors');
    (validation.errors||[]).forEach(e=> lines.push('- ' + e));
    lines.push('');
  }
  if (versionInfo){
    lines.push('## Version');
    lines.push('- Version ID: ' + versionInfo.versionId);
    lines.push('- Snapshot dir: ' + versionInfo.snapshotDir);
    lines.push('');
  }
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

module.exports = { writeReport };
