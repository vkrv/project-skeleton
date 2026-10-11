# git-submodule profile

Copy `160-git-submodule.mdc` → `.cursor/rules/160-git-submodule.mdc`.

Replace `{{SUBMODULE_PATH}}` in the rule `globs` with the real submodule checkout path (ALL-CAPS bootstrap-style placeholder, same convention as `{{PRIMARY_APP}}`). This token is adoption-time only — it is not a root bootstrap placeholder.

Use when this product consumes a shared library or SDK as a git submodule. Not for vendored copies or registry-only dependencies.

When you adopt this profile, add `submodules: recursive` to `actions/checkout@v7` in CI (see the rule). Do not add a submodule to the template itself.
