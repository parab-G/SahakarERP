#!/usr/bin/env node
/**
 * Deploy.js
 * Wrapper to run Build then clasp push using dist/ as root.
 * This script DOES NOT run clasp itself unless --push is provided.
 * Usage:
 *   node Tools/Deploy.js [--config Tools/DeploymentConfig.json] [--push] [--dry-run] [--verbose]
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const configPath = argv.config || path.join('Tools','DeploymentConfig.json');
const push = argv.push || false;
const dryRun = argv['dry-run'] || false;
const verbose = argv.verbose || false;

const Utilities = require('./DeploymentUtilities');
const logger = require('./DeploymentLogger').createDefault();

const config = Utilities.loadConfig(configPath);

// Run build
logger.info('Starting build phase');
const res = spawnSync(process.execPath, [path.join(__dirname,'Build.js'), '--config', configPath, dryRun? '--dry-run':'', verbose? '--verbose':'' ].filter(Boolean), { stdio: 'inherit' });
if (res.status !== 0){ logger.error('Build failed'); process.exit(1); }
logger.info('Build succeeded');

if (push){
  // Run clasp push with rootDir = dist
  const claspArgs = ['push', '--rootDir', config.distDir];
  logger.info('Running clasp', claspArgs.join(' '));
  const cp = spawnSync('npx', ['clasp', ...claspArgs], { stdio: 'inherit' });
  if (cp.status !== 0){ logger.error('clasp push failed'); process.exit(1); }
  logger.info('clasp push completed');
} else {
  logger.info('Skipping clasp push (use --push to enable)');
}

logger.info('Deploy script finished');
