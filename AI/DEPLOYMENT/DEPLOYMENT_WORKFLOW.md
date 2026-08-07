# Deployment Workflow

Developer flow (one-command experience)

1. Build
   node Tools/DeploymentBuilder.js
   - Scans, transforms and writes build/ and build/.clasp.json
   - Produces AI/DEPLOYMENT/DEPLOYMENT_REPORT.md and build/deployment_log.txt

2. Validate (optional but recommended)
   node Tools/DeploymentValidator.js
   - Verifies include references, lists broken includes and warnings

3. Push
   clasp push
   - Because .clasp.json in build/ is present, use: clasp push --rootDir build or rely on build/.clasp.json

4. Deploy
   Use Apps Script UI or clasp deploy commands as usual

CI Integration

- Add a job step to run DeploymentBuilder.js, then DeploymentValidator.js
- Fail build on validator errors

Commands

- Build only: node Tools/DeploymentBuilder.js
- Validate only: node Tools/DeploymentValidator.js
- Full flow (build + validate): node Tools/DeploymentBuilder.js && node Tools/DeploymentValidator.js

Flags (supported in scripts)

- --config path/to/Tools/DeploymentConfig.json  (use custom config)
- --dry-run (simulate actions; no files written)
- --verbose (detailed logging)

Notes

- The builder will refuse to overwrite an existing build/ unless --force is provided.
- Always inspect AI/DEPLOYMENT/DEPLOYMENT_REPORT.md and build/deployment_log.txt before deploying to production.