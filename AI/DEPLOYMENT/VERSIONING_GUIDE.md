# Versioning Guide

Purpose

Explains how deployment versions are created and tracked for rollback and auditing.

Version IDs

- Generated as 'v' + epoch milliseconds (e.g., v1623423412345)
- Created by DeploymentVersionManager.createVersionSnapshot after successful build/validation

Artifacts

- dist_versions/<versionId>/  -- full copy of dist for the version
- AI/DEPLOYMENT/DEPLOYMENT_REPORT.md -- report containing versionId and snapshot info

Best practices

- Create snapshot only after validation passes
- Keep 10-20 recent snapshots and archive older ones externally
- Record versionId in release notes or changelog for traceability
