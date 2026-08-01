# Universal project skeleton

Portable monorepo **tooling + AI harness + docs conventions**. Use **this repository** as a GitHub **template** so new projects start without reinventing CI, Cursor rules, or documentation structure.

## Start a new project

On GitHub: open this repository → **Use this template** → clone → open in Cursor.

Or with the GitHub CLI (replace `OWNER/REPO` with this template’s slug):

```bash
gh repo create my-new-app --template OWNER/REPO --private --clone
cd my-new-app
```

Then follow [BOOTSTRAP.md](BOOTSTRAP.md): replace placeholders, choose profiles, create the first app under `apps/`, run `pnpm install`.

## What's included

| Path | Purpose |
|------|---------|
| Root tooling | pnpm workspace, Turborepo, Node 24, CI |
| `packages/config` | Shared ESLint + TypeScript bases |
| `.cursor/rules/` | Universal core rules (evolution, docs, TS, tests) |
| `docs/` | INDEX, ROADMAP, architecture stubs, empty EVOLUTION-LOG |
| `profiles/` | Optional stack packs (API, Drizzle, Expo, UI) — copy when needed |

## What's not included

- Product features, schema, seeds, or sample apps
- Platform-specific release pipelines (EAS, store listing, asset generators)
- Vendor-locked auth or client DB SDKs

## Placeholders

| Token | Meaning |
|-------|---------|
| `{{PROJECT_NAME}}` | Display / product name |
| `{{SCOPE}}` | npm scope without `@` (package becomes `@{{SCOPE}}/config`) |
| `{{PRIMARY_APP}}` | First app directory under `apps/` |
| `{{SCOPE_SUMMARY}}` | One-line current-phase blurb in AGENTS.md |

## Quality scripts (after bootstrap)

```bash
pnpm install
pnpm check   # build + typecheck + lint + test
pnpm dev
```

## Self-improvement

This harness is meant to evolve. See [docs/ai-harness/harness-self-improvement.md](docs/ai-harness/harness-self-improvement.md) and `000-rule-evolution.mdc`.

This repository is the canonical template. When a product monorepo improves product-agnostic harness conventions, mirror them here so the next project starts better than the last.
