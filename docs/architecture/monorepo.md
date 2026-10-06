# Monorepo layout

```
/
├── apps/                 # Deployable applications
│   └── {{PRIMARY_APP}}/  # Primary app (create at bootstrap)
├── packages/
│   └── config/           # Shared ESLint + TypeScript (@repo/config)
├── docs/                 # Architecture, features, AI harness
├── profiles/             # Optional stack packs (copy rules when needed)
├── AGENTS.md             # Always-on agent protocol (canonical map + phase)
├── CLAUDE.md             # Claude Code import of AGENTS.md
├── package.json          # Workspace root scripts
├── pnpm-workspace.yaml
└── turbo.json
```

The **canonical** agent-facing map (paths + purpose) lives in [AGENTS.md](../../AGENTS.md). This doc is the layout tree and data-flow notes — do not duplicate the map table here.

## Data flow (typical)

```
Client apps  →  Your HTTP API  →  ORM / DB
                     ↑
              packages/shared (contracts, tokens)
```

Clients talk only to **your** API. Do not give browsers or mobile apps direct database credentials.

## pnpm 11 workspace config

pnpm 11 reads **workspace + install settings from `pnpm-workspace.yaml`**.

Do **not** put those settings in:

- Root `package.json#pnpm` (pnpm 11 does not keep `allowBuilds`, age-gate, and related keys there)
- Project `.npmrc`, except **auth and registry** (everything else belongs in the workspace yaml or user-level config)

`packageManager` in root `package.json` still pins the pnpm version. A commented example lives in `pnpm-workspace.yaml`.

### `allowBuilds`

Lifecycle scripts (`preinstall` / `install` / `postinstall`, native compile) are **blocked until reviewed**. `strictDepBuilds` defaults to `true`.

- After the first real dependency that needs a lifecycle script, add it under `allowBuilds` with `true`.
- Typical early entries: `esbuild`. If you adopt Cloudflare Workers, allow `workerd` the same way.
- `pnpm approve-builds` / `pnpm add --allow-build` write entries here. Install may also insert placeholder keys for unreviewed builders — set each to `true` or `false`.
- Do **not** set `dangerouslyAllowAllBuilds: true`. That silently runs every current and future dependency lifecycle script.

Do not copy another repo's allowlist. Approve only packages this workspace actually needs to build.

### `minimumReleaseAgeExclude`

pnpm 11 defaults `minimumReleaseAge` to **1440** minutes (1 day) so brand-new publishes are not resolved immediately.

When you **intentionally** pin a version newer than the age gate, list that package (optionally `@version`) under `minimumReleaseAgeExclude`. Exclude only those pins — not a standing list of unrelated packages.

## Adding packages

1. Create under `apps/*` or `packages/*`
2. Depend on `@repo/config` for ESLint/TS bases
3. Update the [AGENTS.md](../../AGENTS.md) monorepo map (canonical); update the tree above if layout changed
4. Append EVOLUTION-LOG
