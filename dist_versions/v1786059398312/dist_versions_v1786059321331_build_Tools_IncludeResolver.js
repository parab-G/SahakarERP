/**
 * IncludeResolver.js
 * Responsible for rewriting include('...') references inside HTML/JS files
 * according to the deployment manifest and copying transformed files to dist/
 */

const fs = require('fs');
const path = require('path');
const Utilities = require('./DeploymentUtilities');

// Only match include(...) when inside Apps Script templates: <?!= include('Name') ?> or <?= include('Name') ?>
const INCLUDE_RE = /<\?(?:!?=)\s*include\(\s*['\"]([^'\"]+)['\"]\s*\)\s*;?\s*\?>/g;
const CREATE_TEMPLATE_RE = /createTemplateFromFile\(\s*['\"]([^'\"]+)['\"]\s*\)/g;
const CREATE_HTML_OUTPUT_RE = /createHtmlOutputFromFile\(\s*['\"]([^'\"]+)['\"]\s*\)/g;

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

    // Replace template include(...) occurrences only inside <? ?> blocks
    let modified = content;
    let match;
    INCLUDE_RE.lastIndex = 0;
    while ((match = INCLUDE_RE.exec(content)) !== null){
      const inc = match[1];
      const candidates = Utilities.resolveCandidates(inc);
      let found = null;
      for (let c of candidates){ if (mapping[c]){ found = mapping[c]; break; } }
      if (!found){
        const key = Object.keys(mapping).find(k => k.endsWith('/' + inc) || k.endsWith('/' + inc + '.html') || k.endsWith('/' + inc + '.js'));
        if (key) found = mapping[key];
      }
      if (found){
        // normalize to template include form
        modified = modified.split(match[0]).join("<?!= include('" + found + "') ?>");
      } else {
        broken.push({ file: rel, include: inc });
      }
    }

    // Replace server-side HtmlService references in JS/GS
    CREATE_TEMPLATE_RE.lastIndex = 0;
    while ((match = CREATE_TEMPLATE_RE.exec(content)) !== null){
      const inc = match[1];
      const candidates = Utilities.resolveCandidates(inc);
      let found = null;
      for (let c of candidates){ if (mapping[c]){ found = mapping[c]; break; } }
      if (found){ modified = modified.split(match[0]).join("createTemplateFromFile('" + found + "')"); }
      else { broken.push({ file: rel, include: inc }); }
    }

    CREATE_HTML_OUTPUT_RE.lastIndex = 0;
    while ((match = CREATE_HTML_OUTPUT_RE.exec(content)) !== null){
      const inc = match[1];
      const candidates = Utilities.resolveCandidates(inc);
      let found = null;
      for (let c of candidates){ if (mapping[c]){ found = mapping[c]; break; } }
      if (found){ modified = modified.split(match[0]).join("createHtmlOutputFromFile('" + found + "')"); }
      else { broken.push({ file: rel, include: inc }); }
    }

    fs.writeFileSync(outPath, modified, 'utf8');
    copied.push({ source: rel, target: outName });
  }

  return { copied: copied.length, details: copied, brokenIncludes: broken };
}

module.exports = { resolveAndCopy };
