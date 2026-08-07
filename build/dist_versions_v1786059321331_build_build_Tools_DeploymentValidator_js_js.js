#!/usr/bin/env node
/**
 * DeploymentValidator.js
 * Verifies build/ artifacts produced by DeploymentBuilder.js
 * - Ensures .clasp.json exists and rootDir matches
 * - Ensures no duplicate generated filenames
 * - Scans build files for include('...') patterns and ensures referenced files exist in build/
 *
 * Usage: node Tools/DeploymentValidator.js [--config Tools/DeploymentConfig.json] [--verbose]
 */

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const configPath = argv.config || path.join('Tools','DeploymentConfig.json');
const verbose = argv.verbose || false;

let config = { buildDir: 'build', reportFile: 'AI/DEPLOYMENT/DEPLOYMENT_REPORT.md' };
if (fs.existsSync(configPath)){
  try{ Object.assign(config, JSON.parse(fs.readFileSync(configPath,'utf8'))); }catch(e){ console.error('Failed to read config', e); process.exit(1); }
}

const repoRoot = process.cwd();
const buildDir = path.join(repoRoot, config.buildDir);

function fail(msg){ console.error('VALIDATOR ERROR:', msg); process.exitCode = 2; }
function warn(msg){ console.warn('VALIDATOR WARNING:', msg); }

if (!fs.existsSync(buildDir)){
  fail('Build directory not found: ' + buildDir);
  process.exit(1);
}

// Check .clasp.json
const claspPath = path.join(buildDir, '.clasp.json');
if (!fs.existsSync(claspPath)) fail('.clasp.json missing in build directory');
else {
  try{ const c = JSON.parse(fs.readFileSync(claspPath,'utf8')); if (!c.rootDir || c.rootDir !== config.buildDir) warn('.clasp.json rootDir does not match config.buildDir'); } catch(e){ fail('Invalid JSON in ' + claspPath); }
}

// Collect build files
const buildFiles = fs.readdirSync(buildDir).filter(f => fs.statSync(path.join(buildDir,f)).isFile());
const nameSet = new Set();
let dupCount = 0;
for (let f of buildFiles){ if (nameSet.has(f)){ warn('Duplicate file in build: ' + f); dupCount++; } else nameSet.add(f); }
if (dupCount) fail('Duplicate filenames found in build directory');

// Validate includes
const includePattern = /include\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
let missingIncludes = [];
for (let f of buildFiles){ if (!f.endsWith('.html') && !f.endsWith('.js') && !f.endsWith('.gs')) continue; const c = fs.readFileSync(path.join(buildDir,f),'utf8'); let match; while ((match = includePattern.exec(c)) !== null){ const inc = match[1]; // should map to a build file base name
    // allow both with and without extension
    const candidates = [inc + '.html', inc + '.js', inc + '.gs'];
    const found = candidates.find(x => buildFiles.includes(x));
    if (!found){ missingIncludes.push({ file: f, include: inc }); }
  }}

if (missingIncludes.length){
  console.error('Missing include targets:', missingIncludes.length);
  missingIncludes.slice(0,20).forEach(m => console.error('-', m.file, 'includes', m.include));
  fail('Missing include targets detected. See output for samples.');
} else {
  console.log('Validator passed: no missing includes');
}

console.log('DeploymentValidator completed successfully');
