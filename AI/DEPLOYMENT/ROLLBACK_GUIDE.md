# Rollback Guide

Purpose

How to rollback the deployed dist to a previous snapshot.

Snapshots

- The framework stores snapshots in dist_versions/ with versioned subfolders (e.g., dist_versions/v16234234)
- Each snapshot is a full copy of dist at the time of build

Rollback steps

1. List available versions:
   node -e "console.log(require('./Tools/DeploymentVersionManager').listVersions(require('./Tools/DeploymentConfig.json')) )"
2. Choose a version id (e.g., v16234234)
3. Run rollback:
   node -e "require('./Tools/RollbackManager').rollbackTo('v16234234', require('./Tools/DeploymentConfig.json'))"
4. Validate files and run clasp push from dist/

Notes

- Rollback replaces dist/ with the snapshot; it does not change Git history
- After rollback, run DeploymentValidator.js to ensure consistent includes before pushing
- Keep snapshots for audit; purge old snapshots with care (disk usage)
