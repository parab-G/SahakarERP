# Deployment Pipeline

This document explains the detailed stages performed by the Deployment Framework.

Stages

1. Repository Scan
   - Discover files under Components/, Modules/, and repository root
   - Include: .html, .js, .gs, .json
   - Exclude: .git, .github, node_modules, AI, README.md, docs, logs, dist

2. Dependency Graph
   - Parse HTML/JS for include('...') and HtmlService.createTemplateFromFile references
   - Build directed graph of file dependencies
   - Detect cycles and report

3. Filename Mapping
   - Deterministic mapping from original path to generated base name
   - Ensure global uniqueness by appending numeric suffixes as needed
   - Produce dist/deployment_manifest.json with mapping table

4. Include Resolution
   - Rewrite include('...') calls in file copies to point to generated names
   - Validate include targets exist; report broken includes

5. Manifest Generation
   - Produce dist/appsscript.json with recommended runtime, scopes and webapp settings

6. Validation
   - Verify duplicates, broken includes, invalid HTML, cyclic includes, duplicate global symbols
   - Produce report with warnings/errors

7. Versioning & Snapshot
   - Create versioned snapshot under dist_versions/ for rollback

8. Reporting
   - Write AI/DEPLOYMENT/DEPLOYMENT_REPORT.md summarizing the build

9. Push (manual/CI)
   - Use clasp push --rootDir dist to upload the generated project

Notes

- The pipeline is deterministic: same source -> same mapping
- Build artifacts are disposable and must not be edited directly
