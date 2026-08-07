# Known Limitations

- The builder rewrites include('...') patterns only. Other templating syntaxes may not be detected.
- Complex runtime references built dynamically (string concatenation of include names) may not be resolvable statically.
- Duplicate global function names across different source files may still conflict when pushed to Apps Script — validator attempts to detect duplicates but may have false negatives.
- Large repositories may produce large dist/ and snapshots — consider pruning old snapshots.
- appsscript.json is generated from a template and may need manual tuning for library references and OAuth scopes.
- The framework does not automatically update ModuleLoader or runtime code that expects original relative paths — use generated mapping to resolve at runtime when necessary.
