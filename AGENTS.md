# {{PROJECT_NAME}} — AI Entry Point

Start every session here. **Product name:** {{PROJECT_NAME}}.

## Current phase

**Phase 1:** {{SCOPE_SUMMARY}} — fill in after bootstrap (see [BOOTSTRAP.md](BOOTSTRAP.md)).

## Monorepo map

| Path | Purpose |
|------|---------|
| `apps/{{PRIMARY_APP}}` | Primary client app (fill after creating first app) |
| `packages/config` | Shared ESLint + TypeScript config (`@{{SCOPE}}/config`) |
| `packages/*` | Shared libraries (add as needed) |

Update this table when you add apps or packages.

## Documentation

- [docs/INDEX.md](docs/INDEX.md) — master doc registry
- [docs/plan/ROADMAP.md](docs/plan/ROADMAP.md) — phased delivery plan
- [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) — pinned versions
- [docs/architecture/env.md](docs/architecture/env.md) — environment variables

## Cursor rules

- [docs/ai-harness/RULES-INDEX.md](docs/ai-harness/RULES-INDEX.md) — all rules
- [docs/ai-harness/EVOLUTION-LOG.md](docs/ai-harness/EVOLUTION-LOG.md) — rule change history
- `.cursor/rules/000-rule-evolution.mdc` — **mandatory** self-evolution protocol

Optional stack profiles live in `profiles/` — copy selected rules into `.cursor/rules/` during bootstrap.

## Dev commands

Run everything from the **repo root**:

```bash
pnpm install

# Quality
pnpm check      # build + typecheck + lint + test
pnpm build
pnpm lint
pnpm typecheck
pnpm test

# Dev
pnpm dev        # all apps (turbo)
pnpm clean
```

Add app-specific scripts (e.g. `dev:server`) only after creating those apps.

## Environment (names only — see env.md)

Document env var **names** in `docs/architecture/env.md`. Never commit secrets.

## Rule evolution (summary)

When patterns emerge, update `.cursor/rules/*.mdc` + EVOLUTION-LOG + RULES-INDEX. See `000-rule-evolution.mdc`.
