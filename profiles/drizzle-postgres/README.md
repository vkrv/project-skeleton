# drizzle-postgres profile

Copy `110-drizzle-postgres.mdc` → `.cursor/rules/110-drizzle-postgres.mdc`.

Typical packages to add later: `packages/db` (Drizzle schema + migrations). Wire root `db:*` scripts only after that package exists.

## Recommended starting pins

Use current latest stable unless you have a reason not to. As of 2026-09-21:

| Package | Version |
|---------|---------|
| `drizzle-orm` | **0.45.2** |
| `postgres` (postgres.js) | **3.4.9** |
| `drizzle-kit` | **0.31.10** |

Record the chosen pins in `docs/architecture/tech-stack.md` and append a row to `docs/ai-harness/EVOLUTION-LOG.md` when you adopt the profile.
