#!/usr/bin/env node
/**
 * Build.js
 * High-level orchestrator for the deployment pipeline.
 * Runs Stage 1..6: scan, dependency graph, filename mapping, include resolution,
 * manifest generation, validation, and writes dist/ output.
 *
 * Usage: node Tools/Build.js [--config Tools/DeploymentConfig.json] [--dry-run] [--verbose]
 */

const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const configPath = argv.config || path.join('Tools','DeploymentConfig.json');
const dryRun = argv['dry-run'] || false;
const verbose = argv.verbose || false;

const Logger = require('./DeploymentLogger');
const Utilities = require('./DeploymentUtilities');
const Builder = require('./DeploymentBuilder');
const Resolver = require('./IncludeResolver');
const ManifestGen = require('./ManifestGenerator');
const Validator = require('./DeploymentValidator');
const Reporter = require('./DeploymentReporter');
const VersionMgr = require('./DeploymentVersionManager');

const repoRoot = process.cwd();

let config = Utilities.loadConfig(configPath);
const logger = new Logger(config.logFile, { verbose });

(async function main(){
  logger.info('Build started');
  try{
    // Stage 1: Scan
    logger.info('Stage 1: Repository scan');
    const scanned = Builder.scan(config);
    logger.info(`Scanned ${scanned.length} files`);

    // Stage 2: Dependency graph
    logger.info('Stage 2: Building dependency graph');
    const depGraph = Builder.buildDependencyGraph(scanned);
    Utilities.writeJson(path.join(config.distDir,'dependency_graph.json'), depGraph);
    logger.info('Dependency graph written');

    // Stage 3: Filename mapping
    logger.info('Stage 3: Generating filename mapping');
    const manifest = Builder.generateFilenameMapping(scanned);
    Utilities.writeJson(path.join(config.distDir,'deployment_manifest.json'), manifest);
    logger.info('Deployment manifest written');

    // Stage 4: Include resolver and copy files
    logger.info('Stage 4: Resolving includes and generating dist files');
    const resolveResult = Resolver.resolveAndCopy(scanned, manifest, config, { dryRun, logger });
    logger.info(`Files copied: ${resolveResult.copied}`);

    // Stage 5: Apps Script manifest generation
    logger.info('Stage 5: Generating appsscript.json');
    const appsscript = ManifestGen.generate(config, manifest);
    fs.writeFileSync(path.join(config.distDir,'appsscript.json'), JSON.stringify(appsscript, null, 2), 'utf8');
    logger.info('appsscript.json written');

    // Stage 6: Validation
    logger.info('Stage 6: Validating dist output');
    const vres = Validator.validate(config);
    if (!vres.ok){
      logger.error('Validation failed');
      Reporter.writeReport({ config, manifest, depGraph, resolveResult, validation: vres });
      process.exit(2);
    }

    // Versioning
    const versionInfo = VersionMgr.createVersionSnapshot(config);

    // Reporting
    Reporter.writeReport({ config, manifest, depGraph, resolveResult, validation: vres, versionInfo });
    logger.info('Build completed successfully');
  } catch (e){
    logger.error('Build failed', e.stack || e);
    process.exit(1);
  }
})();
