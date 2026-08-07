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

// Main
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
    const baseName = generateBaseName(relNormalized);
    const type = extType(f.ext);
    let genBase = baseName + '_' + type; // e.g., Components_Alert_Alert_html
    // Ensure uniqueness
    let candidate = genBase;
    let i = 1;
    while (Object.values(mapping).includes(candidate)){
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
  const includePattern = /include\(\s*['\"]([^'\"]+)['\"]\s*\)/g; // captures include('...')
  const builtFiles = [];
  const brokenIncludes = [];
  const warnings = [];

  for (let f of files){
    const relNormalized = normalizeRel(f.relFromRepo);
    const genBase = mapping[relNormalized];
    const outExt = f.ext.toLowerCase();
    const outFilename = genBase + (outExt === '.html' ? '.html' : outExt === '.js' ? '.js' : outExt);
    const outPath = path.join(buildDir, outFilename);

    let content = fs.readFileSync(f.full, 'utf8');

    // find includes and replace with mapped names
    let modified = content;
    let match;
    while ((match = includePattern.exec(content)) !== null){
      const inc = match[1];
      // Candidate keys to look up in mapping
      const candidates = [];
      // normalize inc to repo-relative path if it starts with / or .
      let incNormalized = inc.replace(/^\/+/, '');
      // If inc has no extension, try both with .html and .js
      candidates.push(incNormalized);
      candidates.push(incNormalized + '.html');
      candidates.push(incNormalized + '.js');
      candidates.push(incNormalized + '.gs');
      // Also try relative to Components/ or Modules/ if inc starts with component name without prefix
      // Map candidate variants to mapping keys by normalizing path separators
      let found = false;
      let mappedName = null;
      for (let c of candidates){
        const key = c.split('/').join('/');
        if (mapping[key]){ mappedName = mapping[key]; found = true; break; }
      }
      if (!found){
        // Sometimes include uses path relative to repo root without extension - try to locate any mapping that endsWith the include
        const endsWith = Object.keys(mapping).find(k => k.endsWith('/' + incNormalized) || k.endsWith('/' + incNormalized + '.html') || k.endsWith('/' + incNormalized + '.js'));
        if (endsWith){ mappedName = mapping[endsWith]; found = true; }
      }

      if (found && mappedName){
        // replace include('inc') with include('mappedName') — only for this copied file (modified)
        modified = modified.split(match[0]).join("include('" + mappedName + "')");
      } else {
        brokenIncludes.push({ file: relNormalized, include: inc });
        warnings.push('Broken include in ' + relNormalized + ': ' + inc);
      }
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

// Run
try{ build(); } catch(e){ console.error('DeploymentBuilder failed', e); process.exit(1); }
