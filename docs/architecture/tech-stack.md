# Tech stack

**Single source of truth for pinned versions.** Update this file + EVOLUTION-LOG when pins change.

## Runtime & tooling

| Tool | Version | Notes |
|------|---------|-------|
| Node | 24.x (see `.node-version`) | LTS |
| pnpm | 11.x | `packageManager` in root `package.json` |
| Turborepo | 2.10.x | Monorepo task runner |
| TypeScript | 6.x | Shared via workspace |

## Apps & libraries

| Layer | Choice | Version | Notes |
|-------|--------|---------|-------|
| Primary app | _TBD_ | — | Fill at bootstrap |
| API (optional) | Fastify | _pin when adopted_ | See `profiles/typescript-api` |
| ORM (optional) | Drizzle | _pin when adopted_ | See `profiles/drizzle-postgres` |
| Mobile (optional) | Expo | _pin when adopted_ | See `profiles/expo-mobile` |

## Pin policy

- Prefer stable releases; avoid pre-releases unless explicitly required
- Expo packages: `npx expo install --fix` only (when Expo profile is used)
- Document every pin change in `docs/ai-harness/EVOLUTION-LOG.md`
