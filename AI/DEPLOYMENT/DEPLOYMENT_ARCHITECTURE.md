# Deployment Builder Architecture

Overview

The Deployment Builder transforms the repository's nested structure into a flat, clash-free build suitable for clasp (Apps Script). It consists of three parts:

1. Scanner
   - Traverses configured source roots (Components/, Modules/, root .js/.html)
   - Filters by allowed extensions and ignore rules

2. Transformer
   - Generates deterministic, globally-unique target filenames
   - Rewrites include() references in copied files to point to generated names
   - Resolves conflicts deterministically (append numeric suffix when needed)

3. Writer & Reporter
   - Writes transformed files into build/ directory
   - Generates build/.clasp.json
   - Produces AI/DEPLOYMENT/DEPLOYMENT_REPORT.md summarizing actions

Determinism

- File discovery is sorted alphabetically
- Generated names are derived from normalized relative paths
- Conflict resolution appends incremental suffixes consistently

Rollback

- The builder never mutates source files
- build/ is disposable; removing it restores pre-deploy state

Validation

- DeploymentValidator.js verifies include references and reports missing targets

Extensibility

- DeploymentConfig.json accepts additional roots, ignore patterns, and extensions
- Additional rewrite rules can be added for other templating syntaxes

Security

- No secrets or credentials are stored in build/ or generated reports
- Logging avoids printing sensitive content; large file contents are summarized
