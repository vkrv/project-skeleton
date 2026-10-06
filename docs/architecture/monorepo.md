# Monorepo layout

```
/
├── apps/                 # Deployable applications
│   └── {{PRIMARY_APP}}/  # Primary app (create at bootstrap)
├── packages/
│   └── config/           # Shared ESLint + TypeScript (@{{SCOPE}}/config)
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

## Adding packages

1. Create under `apps/*` or `packages/*`
2. Depend on `@{{SCOPE}}/config` for ESLint/TS bases
3. Update the [AGENTS.md](../../AGENTS.md) monorepo map (canonical); update the tree above if layout changed
4. Append EVOLUTION-LOG
