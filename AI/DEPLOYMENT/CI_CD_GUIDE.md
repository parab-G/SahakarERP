# CI/CD Guide for Deployment

Purpose

How to integrate the Deployment Framework into CI pipelines.

Suggested pipeline steps

1. Checkout
2. Install Node dependencies (if any)
3. Run Build: node Tools/Build.js --config Tools/DeploymentConfig.json
4. Run Validator: node Tools/DeploymentValidator.js --config Tools/DeploymentConfig.json
5. On success, optional: run tests
6. Push to Apps Script: npx clasp push --rootDir dist
7. Create release/tag

Failure handling

- Fail pipeline on validator errors
- Upload AI/DEPLOYMENT/DEPLOYMENT_REPORT.md as pipeline artifact

Secrets

- Store clasp credentials in CI secret store; do not commit
- Use npx clasp with authentication pre-configured in the CI runner
