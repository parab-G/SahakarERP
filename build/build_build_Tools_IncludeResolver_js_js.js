/**
 * IncludeResolver.js
 * Responsible for rewriting include('...') references inside HTML/JS files
 * according to the deployment manifest and copying transformed files to dist/
 */

const fs = require('fs');
const path = require('path');
const Utilities = require('./DeploymentUtilities');

const INCLUDE_RE = /include\(\s*['\"]([^'\"]+)['\"]\s*\)/g;

function resolveAndCopy(scannedFiles, manifest, config, opts){
  const repoRoot = process.cwd();
  const distDir = path.join(repoRoot, config.distDir);
  Utilities.ensureDir(distDir);
  const mapping = manifest.mapping; // original -> generated base name
  const copied = [];
  const broken = [];

  for (let f of scannedFiles){
    const rel = Utilities.normalizeRel(f.relFromRepo);
    const genBase = mapping[rel];
    if (!genBase) continue; // skip non-included
    const ext = f.ext.toLowerCase();
    const outName = genBase + (ext === '.html' ? '.html' : ext === '.js' ? '.js' : ext);
    const outPath = path.join(distDir, outName);
    let content = fs.readFileSync(f.full, 'utf8');

    // Replace include(...) occurrences
    let modified = content;
    let match;
    while ((match = INCLUDE_RE.exec(content)) !== null){
      const inc = match[1];
      // Attempt to find mapping by several candidate keys
      const candidates = Utilities.resolveCandidates(inc);
      let found = null;
      for (let c of candidates){
        if (mapping[c]){ found = mapping[c]; break; }
      }
      if (!found){
        // try endsWith heuristic
        const key = Object.keys(mapping).find(k => k.endsWith('/' + inc) || k.endsWith('/' + inc + '.html') || k.endsWith('/' + inc + '.js'));
        if (key) found = mapping[key];
      }
      if (found){
        modified = modified.split(match[0]).join("include('" + found + "')");
      } else {
        broken.push({ file: rel, include: inc });
      }
    }

    fs.writeFileSync(outPath, modified, 'utf8');
    copied.push({ source: rel, target: outName });
  }

  return { copied: copied.length, details: copied, brokenIncludes: broken };
}

module.exports = { resolveAndCopy };
