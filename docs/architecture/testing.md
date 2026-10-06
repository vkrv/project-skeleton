# Testing

## Stack

- **Vitest** for Node packages, API, and web apps
- Native mobile suites (Jest/Detox or equivalent) when the first mobile app needs them

## Quality gate

```bash
pnpm test           # package tests via turbo
pnpm check:harness  # deterministic AI-harness self-check (stdlib only)
pnpm check          # harness + build + typecheck + lint + test
```

CI (`.github/workflows/ci.yml`) runs the harness self-check, then install → build → typecheck → lint → test on every push/PR.

### Harness self-check

`scripts/check-harness.mjs` (also `pnpm check:harness`) verifies:

- Every `.mdc` under `.cursor/rules/` and `profiles/` is listed in `docs/ai-harness/RULES-INDEX.md`, and every listed `.mdc` exists
- `.mdc` frontmatter has a `description` and `globs` or `alwaysApply`
- Relative markdown links in `AGENTS.md`, `BOOTSTRAP.md`, `README.md`, `docs/`, and `profiles/` resolve
- `AGENTS.md` stays under 32 KiB (warning past ~200 lines)
- Evolution-log dates are non-decreasing
- When `HARNESS_MODE=product`, leftover bootstrap placeholders fail the gate. Default / template mode allows them. JSX style objects are ignored.

Run it after editing rules, profiles, or harness docs. After bootstrap, set `HARNESS_MODE=product` in CI so leftover placeholders fail the gate.

## What to test

- Pure domain logic and mappers
- Zod contracts at API / shared boundaries
- Service-layer behavior for HTTP routes (prefer over full HTTP integration until a DB harness exists)
- Regression tests for bug fixes when practical

Update this doc when the testing strategy changes.
