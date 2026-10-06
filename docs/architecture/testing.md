# Testing

## Stack

- **Vitest** for Node packages, API, and web apps
- When native / mobile app code exists, wire **real unit tests** for JS/TS logic (Vitest or the project-chosen runner)
- Full platform runners (device / simulator) can stay TBD / opt-in until you need them
- Optional E2E is **labeled and opt-in in CI** — a named non-required job, `workflow_dispatch`, or an obvious path filter. Do not hide a no-op E2E step inside the required `pnpm test` job

## No-ops are not a suite

- `pnpm test` and each package `test` script must **run tests** when that package claims a suite
- Do not ship `"test": "echo skipped"` / `exit 0` placeholders, empty runner configs that match nothing, or Turbo pipelines that always succeed with zero files executed
- A package with no suite yet should **omit** the `test` script (Turbo skips missing tasks) rather than fake a pass. Root `package.json` already filters `@repo/config` for that reason
- When you add a `test` script, add at least one real assertion so a regression can fail the gate

## Quality gate

Full gate before calling work done (see [AGENTS.md](../../AGENTS.md) definition of done):

```bash
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
- ExecPlan files under `docs/plan/exec/` (except `_template.md` and `README.md`) include every mandatory section heading from [PLANS.md](../plan/PLANS.md)
- When `HARNESS_MODE=product`, leftover bootstrap placeholders fail the gate. Default / template mode allows them. JSX style objects are ignored.

Run it after editing rules, profiles, or harness docs. After bootstrap, set `HARNESS_MODE=product` in CI so leftover placeholders fail the gate.

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
| `@repo/config` | No `test` script; excluded from root `pnpm test` |
| Future `apps/*` and `packages/*` | `pnpm turbo run test --filter <pkg>` once the package defines `test` |

Add a row when a package gains a `test` script.

## What to test

- Pure domain logic and mappers
- Zod contracts at API / shared boundaries
- Service-layer behavior for HTTP routes (prefer over full HTTP integration until a DB harness exists)
- Regression tests for every bug fix

Update this doc when the testing strategy changes.
