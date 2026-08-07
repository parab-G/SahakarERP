/**
 * DeploymentUtilities.js
 * Small helpers: copying directories, JSON read/write, path normalization
 */

const fs = require('fs');
const path = require('path');

function loadConfig(configPath){
  const repoRoot = process.cwd();
  const p = path.join(repoRoot, configPath);
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p,'utf8'));
}

function ensureDir(d){ if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function normalizeRel(p){ return p.split(path.sep).join('/'); }

function writeJson(p, obj){ ensureDir(path.dirname(p)); fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8'); }

function copyDir(src, dest){ ensureDir(dest); const entries = fs.readdirSync(src, { withFileTypes: true }); for (let e of entries){ const s = path.join(src, e.name); const d = path.join(dest, e.name); if (e.isDirectory()) copyDir(s,d); else fs.copyFileSync(s,d); } }

function removeDir(dir){ if (!fs.existsSync(dir)) return; const entries = fs.readdirSync(dir, { withFileTypes: true }); for (let e of entries){ const full = path.join(dir, e.name); if (e.isDirectory()) removeDir(full); else fs.unlinkSync(full); } fs.rmdirSync(dir); }

function resolveCandidates(inc){
  // Return possible mapping keys for an include string like 'Components/Alert/Alert'
  const candidates = [];
  const raw = inc.replace(/^[\.\/]+/,'');
  candidates.push(raw);
  candidates.push(raw + '.html');
  candidates.push(raw + '.js');
  candidates.push(raw + '.gs');
  // also strip leading path segments
  const parts = raw.split('/');
  for (let i=0;i<parts.length;i++){
    candidates.push(parts.slice(i).join('/'));
    candidates.push(parts.slice(i).join('/') + '.html');
  }
  return candidates;
}

module.exports = { loadConfig, ensureDir, normalizeRel, writeJson, copyDir, removeDir, resolveCandidates };
