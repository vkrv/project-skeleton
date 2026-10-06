# Rule evolution log

Append-only history of harness / convention changes.

| Date | Trigger | Rule / doc | Rationale |
|------|---------|------------|-----------|
| 2026-08-15 | Pin policy for latest stable | 010-project-context.mdc, tech-stack.md, profiles/expo-mobile | Prefer latest stable; never downgrade for old architecture; Expo `install --fix` then exclude when bumping |
| 2026-09-21 | Template freshness | profiles/drizzle-postgres, EVOLUTION-LOG | Document recommended Drizzle starting pins (drizzle-orm 0.45.2, postgres.js 3.4.9, drizzle-kit 0.31.10); drop leftover empty bootstrap placeholder row |
| 2026-10-06 | Agents could claim done without proof | AGENTS.md, 160-testing-harness.mdc, testing.md | Definition of done requires command evidence, regression tests, and UI visual proof; 160 points at AGENTS.md |
