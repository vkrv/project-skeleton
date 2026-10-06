# Testing

## Stack

- **Vitest** for Node packages, API, and web apps
- Native mobile suites (Jest/Detox or equivalent) when the first mobile app needs them

## Quality gate

Full gate before calling work done (see [AGENTS.md](../../AGENTS.md) definition of done):

```bash
pnpm check   # build + typecheck + lint + test
```

CI (`.github/workflows/ci.yml`) runs install → build → typecheck → lint → test on every push/PR.

## Fast loop (per package)

While iterating, filter to the package you changed. Use the `name` field from that package's `package.json`.

```bash
pnpm turbo run test --filter <pkg>
pnpm turbo run lint --filter <pkg>
pnpm turbo run typecheck --filter <pkg>
```

From the package directory: `pnpm test`.

| Package | Fast loop |
|---------|-----------|
| `@{{SCOPE}}/config` | No `test` script; excluded from root `pnpm test` |
| Future `apps/*` and `packages/*` | `pnpm turbo run test --filter <pkg>` once the package defines `test` |

Add a row when a package gains a `test` script.

## What to test

- Pure domain logic and mappers
- Zod contracts at API / shared boundaries
- Service-layer behavior for HTTP routes (prefer over full HTTP integration until a DB harness exists)
- Regression tests for every bug fix

Update this doc when the testing strategy changes.
