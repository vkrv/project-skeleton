# Testing

## Stack

- **Vitest** for Node packages, API, and web apps
- When native / mobile app code exists, wire **real unit tests** for JS/TS logic (Vitest or the project-chosen runner)
- Full platform runners (device / simulator) can stay TBD / opt-in until you need them
- Optional E2E is **labeled and opt-in in CI** — a named non-required job, `workflow_dispatch`, or an obvious path filter. Do not hide a no-op E2E step inside the required `pnpm test` job

## No-ops are not a suite

- `pnpm test` and each package `test` script must **run tests** when that package claims a suite
- Do not ship `"test": "echo skipped"` / `exit 0` placeholders, empty runner configs that match nothing, or Turbo pipelines that always succeed with zero files executed
- A package with no suite yet should **omit** the `test` script (Turbo skips missing tasks) rather than fake a pass. Root `package.json` already filters `@{{SCOPE}}/config` for that reason
- When you add a `test` script, add at least one real assertion so a regression can fail the gate

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
