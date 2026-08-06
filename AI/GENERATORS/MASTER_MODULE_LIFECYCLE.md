# Master Module Lifecycle

ASCII lifecycle diagram

Idea
  |
  v
Requirements --> Architecture --> Schema --> Validation --> Service --> UI
                                         |             |
                                         v             v
                                       Testing <---- Review
                                         |
                                         v
                                       Integration
                                         |
                                         v
                                       Release
                                         |
                                         v
                                      Maintenance

Stages explained

1. Idea: capture business need and stakeholders
2. Requirements: field list, dropdowns, uniqueness, relationships
3. Architecture: confirm Module boundaries, dependencies, Core usage
4. Schema: produce declarative metadata
5. Validation: pure validators and tests
6. Service: DB-backed APIs, audit, soft-delete
7. UI: optional, reuse components
8. Testing: unit + integration + accessibility
9. Review: cross-functional sign-off
10. Integration: ModuleLoader, Schema registration
11. Release: changelog, AI/CURRENT_SPRINT.md entry
12. Maintenance: bug fixes, schema migrations
