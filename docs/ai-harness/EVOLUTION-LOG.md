# Rule evolution log

Append-only history of harness / convention changes.

| Date | Trigger | Rule / doc | Rationale |
|------|---------|------------|-----------|
| 2026-08-15 | Pin policy for latest stable | 010-project-context.mdc, tech-stack.md, profiles/expo-mobile | Prefer latest stable; never downgrade for old architecture; Expo `install --fix` then exclude when bumping |
| 2026-09-21 | Template freshness | profiles/drizzle-postgres, EVOLUTION-LOG | Document recommended Drizzle starting pins (drizzle-orm 0.45.2, postgres.js 3.4.9, drizzle-kit 0.31.10); drop leftover empty bootstrap placeholder row |
| 2026-10-06 | Template freshness | pnpm-workspace.yaml, monorepo.md, expo-mobile 130, RULES-INDEX, 160-testing-harness.mdc, testing.md, BOOTSTRAP.md | pnpm 11 settings live in the workspace yaml (`allowBuilds`, `minimumReleaseAgeExclude`); Expo Query first-load / error overlay / Metro isolation; empty Adopted profiles section; `pnpm test` must not no-op |
