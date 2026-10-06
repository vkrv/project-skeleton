# Rule evolution log

Append-only history of harness / convention changes.

| Date | Trigger | Rule / doc | Rationale |
|------|---------|------------|-----------|
| 2026-08-15 | Pin policy for latest stable | 010-project-context.mdc, tech-stack.md, profiles/expo-mobile | Prefer latest stable; never downgrade for old architecture; Expo `install --fix` then exclude when bumping |
| 2026-09-21 | Template freshness | profiles/drizzle-postgres, EVOLUTION-LOG | Document recommended Drizzle starting pins (drizzle-orm 0.45.2, postgres.js 3.4.9, drizzle-kit 0.31.10); drop leftover empty bootstrap placeholder row |
| 2026-10-06 | Agents could claim done without proof | AGENTS.md, 160-testing-harness.mdc, testing.md | Definition of done requires command evidence, regression tests, and UI visual proof; 160 points at AGENTS.md |
| 2026-10-06 | Template CI | CI workflow, package names, turbo.json | Valid default names (`repo` / `@repo/config`), committed lockfile, current Actions majors; Expo `.expo/**` outputs stay in the Expo profile |
| 2026-10-06 | Template freshness | pnpm-workspace.yaml, monorepo.md, expo-mobile 130, RULES-INDEX, 160-testing-harness.mdc, testing.md, BOOTSTRAP.md | pnpm 11 settings live in the workspace yaml (`allowBuilds`, `minimumReleaseAgeExclude`); Expo Query first-load / error overlay / Metro isolation; empty Adopted profiles section; `pnpm test` must not no-op |
| 2026-10-06 | Always-on protocol only visible to Cursor | AGENTS.md, CLAUDE.md, 000-agents.mdc | Move always-on guidance into AGENTS.md so non-Cursor agents see the same protocol; Cursor keeps a pointer plus glob-scoped rules |
