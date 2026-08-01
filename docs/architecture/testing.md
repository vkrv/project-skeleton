# Testing

## Stack

- **Vitest** for Node packages, API, and web apps
- Native mobile suites (Jest/Detox or equivalent) when the first mobile app needs them

## Quality gate

```bash
pnpm test    # package tests via turbo
pnpm check   # build + typecheck + lint + test
```

CI (`.github/workflows/ci.yml`) runs install → build → typecheck → lint → test on every push/PR.

## What to test

- Pure domain logic and mappers
- Zod contracts at API / shared boundaries
- Service-layer behavior for HTTP routes (prefer over full HTTP integration until a DB harness exists)
- Regression tests for bug fixes when practical

Update this doc when the testing strategy changes.
