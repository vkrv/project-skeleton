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
| ORM (optional) | Drizzle | _pin when adopted_ | See `profiles/drizzle-postgres` for recommended starting pins |
| Mobile (optional) | Expo | _pin when adopted_ | See `profiles/expo-mobile` |

## Pin policy

- Prefer the **latest stable** release compatible with the pinned SDK/runtime
- Never downgrade a library to stay on an older runtime or architecture
- Expo packages: `npx expo install --fix` first (when Expo profile is used); if the SDK pin is known-broken or behind latest stable, bump and add `expo.install.exclude`
- No pre-releases unless explicitly required
- Document every pin change in `docs/ai-harness/EVOLUTION-LOG.md`
