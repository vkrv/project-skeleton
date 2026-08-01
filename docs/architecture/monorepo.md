# Monorepo layout

```
/
├── apps/                 # Deployable applications
│   └── {{PRIMARY_APP}}/  # Primary app (create at bootstrap)
├── packages/
│   └── config/           # Shared ESLint + TypeScript (@{{SCOPE}}/config)
├── docs/                 # Architecture, features, AI harness
├── profiles/             # Optional stack packs (copy rules when needed)
├── AGENTS.md             # Agent entry point
├── package.json          # Workspace root scripts
├── pnpm-workspace.yaml
└── turbo.json
```

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
3. Update `AGENTS.md` monorepo map and `010-project-context.mdc`
4. Append EVOLUTION-LOG
