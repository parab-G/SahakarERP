#!/usr/bin/env node
/**
 * DeploymentBuilder.js
 * Scans repository and creates a build/ folder with Apps Script-friendly filenames.
 * - Deterministic
 * - Non-destructive (does not edit source)
 * - Rewrites include(...) references to generated names
 *
 * Usage: node Tools/DeploymentBuilder.js [--config Tools/DeploymentConfig.json] [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');

const argv = require('minimist')(process.argv.slice(2));
const Utilities = require('./DeploymentUtilities');
const configPath = argv.config || path.join('Tools','DeploymentConfig.json');
const dryRun = argv['dry-run'] || false;
const verbose = argv.verbose || false;

function log(...args){ console.log(...args); if (verbose) fs.appendFileSync(logFile, args.join(' ') + '\n'); }

// Load config
let config = {
  sourceRoots: ['Components','Modules',''],
  ignoreDirs: ['.git','.github','node_modules','AI','tests','docs'],
  includeExtensions: ['.html','.js','.gs'],
  buildDir: 'build',
  logFile: 'build/deployment_log.txt',
  reportFile: 'AI/DEPLOYMENT/DEPLOYMENT_REPORT.md'
};

if (fs.existsSync(configPath)){
  try{ const raw = fs.readFileSync(configPath,'utf8'); Object.assign(config, JSON.parse(raw)); } catch(e){ console.error('Failed to load config', e); process.exit(1); }
} else {
  console.log('Config not found at', configPath, 'using defaults');
}
// ensure distDir exists in config for compatibility
if (!config.distDir) config.distDir = config.buildDir;
// ensure build/dist are ignored from scans to avoid recursion
if (!config.ignoreDirs.includes(config.buildDir)) config.ignoreDirs.push(config.buildDir);
if (!config.ignoreDirs.includes(config.distDir)) config.ignoreDirs.push(config.distDir);

const repoRoot = process.cwd();
const buildDir = path.join(repoRoot, config.buildDir);
const logFile = path.join(repoRoot, config.logFile);
const reportFile = path.join(repoRoot, config.reportFile);

// Helpers
function ensureDir(dir){ if (!fs.existsSync(dir)){ fs.mkdirSync(dir, { recursive: true }); } }

function isIgnored(dir){
  const parts = dir.split(path.sep);
  return parts.some(part => config.ignoreDirs.includes(part));
}

function normalizeRel(p){ return p.split(path.sep).join('/'); }

function generateBaseName(relPath){
  // remove leading ./ if any
  let s = relPath.replace(/^[\.\/]+/,'');
  // replace non-alphanumeric with underscore
  s = s.replace(/[^a-zA-Z0-9\/._-]/g, '_');
  // replace path separators and dots with underscore
  s = s.replace(/[\/\.]/g, '_');
  // collapse multiple underscores
  s = s.replace(/_+/g,'_');
  // trim underscores
  s = s.replace(/^_+|_+$/g,'');
  return s;
}

function extType(ext){
  if (ext === '.html') return 'html';
  if (ext === '.js') return 'js';
  if (ext === '.gs') return 'gs';
  return ext.replace('.','');
}

// Step 1: Scan files
function scanFiles(){
  const results = [];
  const roots = config.sourceRoots.slice();
  // if empty string included, interpret as repo root
  for (let r of roots){
    const root = r === '' ? repoRoot : path.join(repoRoot, r);
    if (!fs.existsSync(root)) continue;
    walk(root, root, results);
  }
  // Sort for determinism
  results.sort((a,b)=> a.rel.localeCompare(b.rel));
  return results;
}

function walk(curr, base, results){
  const entries = fs.readdirSync(curr, { withFileTypes: true });
  entries.sort((a,b)=> a.name.localeCompare(b.name));
  for (let e of entries){
    const full = path.join(curr, e.name);
    if (isIgnored(normalizeRel(path.relative(repoRoot, full)))) continue;
    if (e.isDirectory()){
      walk(full, base, results);
    } else if (e.isFile()){
      const rel = path.relative(base, full);
      const relFromRepo = path.relative(repoRoot, full);
      const ext = path.extname(e.name).toLowerCase();
      if (config.includeExtensions.includes(ext) && !e.name.endsWith('.min.js')){
        results.push({ full, rel, relFromRepo, ext });
      }
    }
  }
}

// Provide exported API functions: scan, buildDependencyGraph, generateFilenameMapping
function scan(cfg){
  if (cfg && typeof cfg === 'object'){
    // backward-compatible mapping: allow 'extensions' key in config
    if (Array.isArray(cfg.extensions) && !cfg.includeExtensions){ cfg.includeExtensions = cfg.extensions; }
    // map sourceRoots '.' to repo-root empty string for existing logic
    if (Array.isArray(cfg.sourceRoots)){
      cfg.sourceRoots = cfg.sourceRoots.map(r => (r === '.' ? '' : r));
    }
    Object.assign(config, cfg);
  }
  const files = scanFiles();
  return files;
}

function buildDependencyGraph(scanned){
  // Simple dependency graph based on include(...) in templates and createTemplateFromFile in JS/GS
  const graph = { nodes: [], edges: [] };
  const includeHtmlRe = /<\?(?:!?=)\s*include\(\s*['\"]([^'\"]+)['\"]\s*\)\s*;?\s*\?>/g;
  const createTemplateRe = /createTemplateFromFile\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const createHtmlOutputRe = /createHtmlOutputFromFile\(\s*['\"]([^'\"]+)['\"]\s*\)/g;

  scanned.forEach(f => {
    const rel = normalizeRel(f.relFromRepo);
    graph.nodes.push(rel);
    let content = '';
    try{ content = fs.readFileSync(f.full,'utf8'); } catch(e){}
    let match;
    includeHtmlRe.lastIndex = 0;
    while ((match = includeHtmlRe.exec(content)) !== null){ graph.edges.push({ from: rel, to: match[1] }); }
    createTemplateRe.lastIndex = 0;
    while ((match = createTemplateRe.exec(content)) !== null){ graph.edges.push({ from: rel, to: match[1] }); }
    createHtmlOutputRe.lastIndex = 0;
    while ((match = createHtmlOutputRe.exec(content)) !== null){ graph.edges.push({ from: rel, to: match[1] }); }
  });
  return graph;
}

function generateFilenameMapping(scanned){
  const mapping = {};
  const entries = [];
  const used = new Set();
  for (let f of scanned){
    const relNormalized = normalizeRel(f.relFromRepo);
    // Create base name without extension
    const withoutExt = relNormalized.replace(/\.[^/.]+$/,'');
    let baseName = withoutExt.replace(/[\/\.]/g,'_').replace(/[^a-zA-Z0-9_\-]/g,'_').replace(/_+/g,'_').replace(/^_+|_+$/g,'');
    let candidate = baseName;
    let i = 1;
    const ext = path.extname(f.full).toLowerCase();
    while (used.has(candidate + ext)){
      candidate = baseName + '_' + i;
      i++;
    }
    used.add(candidate + ext);
    mapping[relNormalized] = candidate; // map to base name (no ext)
    entries.push({ source: relNormalized, target: candidate + ext });
  }
  return { mapping, entries };
}

// Main (when run as script)
function build(){
  console.log('DeploymentBuilder starting (dryRun=' + dryRun + ')');
  const files = scanFiles();
  log('Scanned files count: ' + files.length);

  // mapping original relative repo path (normalized with forward slashes) -> generatedNameWithoutExt
  const mapping = {};
  const conflicts = [];

  // Step 2: Generate unique names
  for (let f of files){
    const relNormalized = normalizeRel(f.relFromRepo);
    const withoutExt = relNormalized.replace(/\.[^/.]+$/,'');
    const baseName = withoutExt.replace(/[\/\.]/g,'_').replace(/[^a-zA-Z0-9_\-]/g,'_').replace(/_+/g,'_').replace(/^_+|_+$/g,'');
    let genBase = baseName; // e.g., Components_Alert_Alert
    // Ensure uniqueness
    let candidate = genBase;
    let i = 1;
    const ext = f.ext.toLowerCase();
    while (Object.values(mapping).includes(candidate + ext)){
      candidate = genBase + '_' + i;
      i++;
    }
    mapping[relNormalized] = candidate;
    if (candidate !== genBase){ conflicts.push({ original: relNormalized, resolved: candidate }); }
  }

  // Prepare build dir
  if (!dryRun){
    if (fs.existsSync(buildDir)){
      console.log('Build dir exists:', buildDir);
    } else {
      ensureDir(buildDir);
    }
  }

  // Step 3 & 4: Copy files and rewrite includes
  const includePattern = /<\?(?:!\=|\=)\s*include\(\s*['\"]([^'\"]+)['\"]\s*\)\s*;?\s*\?>/g; // captures <?!= include('...') ?> and <?= include('...') ?>
  const createTemplatePattern = /createTemplateFromFile\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const createHtmlOutputPattern = /createHtmlOutputFromFile\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
  const builtFiles = [];
  const brokenIncludes = [];
  const warnings = [];

  for (let f of files){
    const relNormalized = normalizeRel(f.relFromRepo);
    const genBase = mapping[relNormalized];
    const outExt = f.ext.toLowerCase();
    const outFilename = genBase + outExt; // preserves extension
    const outPath = path.join(buildDir, outFilename);

    let content = fs.readFileSync(f.full, 'utf8');

    // find includes and replace with mapped names
    let modified = content;
    let match;
    // include within <? ?>
    includePattern.lastIndex = 0;
    while ((match = includePattern.exec(content)) !== null){
      const inc = match[1];
      const candidates = [];
      let incNormalized = inc.replace(/^\/+/, '');
      candidates.push(incNormalized);
      candidates.push(incNormalized + '.html');
      candidates.push(incNormalized + '.js');
      candidates.push(incNormalized + '.gs');
      let found = false;
      let mappedName = null;
      for (let c of candidates){
        if (mapping[c]){ mappedName = mapping[c]; found = true; break; }
      }
      if (!found){
        const endsWith = Object.keys(mapping).find(k => k.endsWith('/' + incNormalized) || k.endsWith('/' + incNormalized + '.html') || k.endsWith('/' + incNormalized + '.js'));
        if (endsWith){ mappedName = mapping[endsWith]; found = true; }
      }
      if (found && mappedName){
        modified = modified.split(match[0]).join("<?!= include('" + mappedName + "') ?>");
      } else {
        brokenIncludes.push({ file: relNormalized, include: inc });
        warnings.push('Broken include in ' + relNormalized + ': ' + inc);
      }
    }

    // createTemplateFromFile replacements (server-side)
    createTemplatePattern.lastIndex = 0;
    while ((match = createTemplatePattern.exec(content)) !== null){
      const inc = match[1];
      const candidates = Utilities.resolveCandidates(inc);
      let found = null;
      for (let c of candidates){ if (mapping[c]){ found = mapping[c]; break; } }
      if (found){ modified = modified.split(match[0]).join("createTemplateFromFile('" + found + "')"); }
      else { brokenIncludes.push({ file: relNormalized, include: inc }); }
    }

    // createHtmlOutputFromFile replacements
    createHtmlOutputPattern.lastIndex = 0;
    while ((match = createHtmlOutputPattern.exec(content)) !== null){
      const inc = match[1];
      const candidates = Utilities.resolveCandidates(inc);
      let found = null;
      for (let c of candidates){ if (mapping[c]){ found = mapping[c]; break; } }
      if (found){ modified = modified.split(match[0]).join("createHtmlOutputFromFile('" + found + "')"); }
      else { brokenIncludes.push({ file: relNormalized, include: inc }); }
    }

    // Write out the transformed file
    if (!dryRun){
      fs.writeFileSync(outPath, modified, 'utf8');
      builtFiles.push({ source: relNormalized, target: outFilename });
      log('Wrote', outPath);
    } else {
      builtFiles.push({ source: relNormalized, target: outFilename, dryRun: true });
      log('[dry-run] would write', outPath);
    }
  }

  // Step 6: write build/.clasp.json
  const claspJson = { scriptId: '', rootDir: config.buildDir };
  if (!dryRun){
    fs.writeFileSync(path.join(buildDir,'.clasp.json'), JSON.stringify(claspJson, null, 2), 'utf8');
    log('Wrote', path.join(buildDir,'.clasp.json'));
  }

  // Step 7: write report
  const report = generateReport({ filesScanned: files.length, builtFiles, conflicts, brokenIncludes, warnings });
  if (!dryRun){ fs.writeFileSync(reportFile, report, 'utf8'); fs.writeFileSync(path.join(buildDir, 'deployment_log.txt'), report, 'utf8'); }
  console.log('Build complete. Files built:', builtFiles.length);
  if (brokenIncludes.length) console.warn('Broken includes detected:', brokenIncludes.length, 'see', reportFile);
}

function generateReport({ filesScanned, builtFiles, conflicts, brokenIncludes, warnings }){
  const now = new Date().toISOString();
  const lines = [];
  lines.push('# Deployment Report');
  lines.push('');
  lines.push('Generated by: DeploymentBuilder');
  lines.push('Date: ' + now);
  lines.push('');
  lines.push('Summary');
  lines.push('');
  lines.push('- Files scanned: ' + filesScanned);
  lines.push('- Files included in build: ' + builtFiles.length);
  lines.push('- Duplicate name conflicts resolved: ' + conflicts.length);
  lines.push('- Broken includes: ' + brokenIncludes.length);
  lines.push('- Warnings: ' + warnings.length);
  lines.push('');
  lines.push('Files processed');
  lines.push('');
  for (let f of builtFiles){ lines.push('- Source: ' + f.source + '\n  Target: ' + f.target); }
  if (conflicts.length){ lines.push('\nDuplicates resolved\n'); for (let c of conflicts) lines.push('- Original: ' + c.original + ' -> Resolved: ' + c.resolved); }
  if (brokenIncludes.length){ lines.push('\nBroken includes\n'); for (let b of brokenIncludes) lines.push('- File: ' + b.file + ' references: ' + b.include + ' (no mapping found)'); }
  if (warnings.length){ lines.push('\nWarnings\n'); for (let w of warnings) lines.push('- ' + w); }
  return lines.join('\n');
}

// Exports for programmatic API
module.exports = {
  scan,
  buildDependencyGraph,
  generateFilenameMapping,
  build
};

// CLI entrypoint
if (require.main === module){
  try{ build(); } catch(e){ console.error('DeploymentBuilder failed', e); process.exit(1); }
}
