# Deployment Workflow

Developer flow (one-command experience)

1. Build
   node Tools/Build.js --config Tools/DeploymentConfig.json
   - Scans, transforms and writes build/ (only deployable files) and build/appsscript.json
   - Produces AI/DEPLOYMENT/DEPLOYMENT_REPORT.md (report) and AI/DEPLOYMENT/deployment_log.txt (logs)

2. Validate (automatic in Deploy.js or run manually)
   node Tools/DeploymentValidator.js --config Tools/DeploymentConfig.json
   - Verifies includes, manifest consistency, and repository .clasp.json presence

3. Push (performed from build/ by Deploy.js)
   node Tools/Deploy.js --config Tools/DeploymentConfig.json --deploy
   - Deploy.js writes build/.clasp.json (scriptId from repository .clasp.json) and runs: cd build && clasp push

4. Version
   node Tools/Deploy.js --version
   - Creates an Apps Script version after a successful push

5. Snapshot
   - After successful push/version, Deploy.js triggers a snapshot of the build into dist_versions/ for rollback

Commands

- Full deploy: node Tools/Deploy.js --config Tools/DeploymentConfig.json --deploy
- Build only: node Tools/Deploy.js --build-only
- Push only: node Tools/Deploy.js --push-only
- Create version: node Tools/Deploy.js --version
- Dry run: add --dry-run to any command

Flags (supported)

- --config path/to/Tools/DeploymentConfig.json
- --dry-run (simulate actions; no push/versioning)
- --verbose (detailed logging)

Notes

- The repository .clasp.json remains authoritative and must contain scriptId. Deploy.js reads it and generates build/.clasp.json automatically.
- The build/ directory is the only folder pushed to Apps Script. Source files are never uploaded.
- Logs and reports are written to AI/DEPLOYMENT/ (not into build/).