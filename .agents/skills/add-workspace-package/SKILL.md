---
name: add-workspace-package
description: Create a new apps/* or packages/* workspace package in this pnpm 11 + Turborepo monorepo. Use when adding a library, app, or shared package; wiring @repo naming, TypeScript, ESLint, or Turbo; or updating the monorepo map.
---

# Add a workspace package

Follow [docs/architecture/monorepo.md](../../../docs/architecture/monorepo.md). Do not invent a second layout.

## Steps

1. Choose `packages/<slug>` (library) or `apps/<slug>` (deployable). Slug is lowercase with hyphens.
2. Add `package.json`:
   - `"name": "@repo/<slug>"` until bootstrap rename of the npm scope
   - `"private": true`
   - Scripts only for work this package actually has. Root Turbo tasks are `build`, `dev`, `lint`, `typecheck`, `test`, `clean`
   - Omit `test` until there is at least one real assertion ([testing.md](../../../docs/architecture/testing.md))
   - Depend on `@repo/config` for ESLint/TS (`@repo/config/eslint`, `@repo/config/typescript/node` or `base` / `react`)
3. Add `tsconfig.json` that `extends` the matching `@repo/config/typescript/*` export.
4. Add `eslint.config.mjs` that imports `@repo/config/eslint` if the package will run `lint`.
5. Do **not** edit `pnpm-workspace.yaml` globs (`apps/*`, `packages/*` already match). Do **not** add Turbo pipeline tasks unless a new task *name* is required (`turbo.json` already lists the standard ones).
6. If a dependency needs a lifecycle script (native compile / `postinstall`), add it under `allowBuilds` in `pnpm-workspace.yaml` — never `dangerouslyAllowAllBuilds`.
7. Update the canonical map in [AGENTS.md](../../../AGENTS.md). Update the layout tree in monorepo.md only if the tree shape changed.
8. Append [EVOLUTION-LOG.md](../../../docs/ai-harness/EVOLUTION-LOG.md). Add INDEX / ROADMAP rows if a feature or app doc appeared.
9. From repo root: `pnpm install`, then `pnpm check` (or `pnpm turbo run typecheck lint --filter @repo/<slug>` while iterating). Report the command output.

## Gotchas

- Root scripts filter `!@repo/config` because that package has no lint/typecheck/test. New packages must define the scripts they claim.
- Stay on the existing `@repo` scope until bootstrap rename.
- No new runtime dependencies unless requested.
