# drizzle-postgres profile

Copy `110-drizzle-postgres.mdc` → `.cursor/rules/110-drizzle-postgres.mdc`.

Typical packages to add later: `packages/db` (Drizzle schema + migrations). Wire root `db:*` scripts only after that package exists.
