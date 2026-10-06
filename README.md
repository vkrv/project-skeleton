# Universal project skeleton

Portable monorepo **tooling + AI harness + docs conventions**. Use **this repository** as a GitHub **template** so new projects start without reinventing CI, Cursor rules, or documentation structure.

## Start a new project

On GitHub: open this repository → **Use this template** → clone → open in Cursor.

Or with the GitHub CLI:

```bash
gh repo create my-new-app --template vkrv/project-skeleton --private --clone
cd my-new-app
```

Then follow [BOOTSTRAP.md](BOOTSTRAP.md): replace placeholders, choose profiles, create the first app under `apps/`, run `pnpm install`.

## What's included

| Path | Purpose |
|------|---------|
| Root tooling | pnpm workspace, Turborepo, Node 24, CI |
| `scripts/` | Repo-root tooling (`pnpm check:harness`) |
| `packages/config` | Shared ESLint + TypeScript bases |
| `AGENTS.md` | Always-on agent protocol (tool-agnostic) |
| `CLAUDE.md` | Claude Code import of AGENTS.md |
| `.agents/skills/` | Cross-tool Agent Skills (canonical `SKILL.md` playbooks) |
| `.claude/skills` | Symlink to `.agents/skills` (Claude Code) |
| `.cursor/rules/` | Cursor pointer to AGENTS.md + glob-scoped rules (e.g. TypeScript) |
| `docs/` | INDEX, ROADMAP, architecture stubs, EVOLUTION-LOG |
| `profiles/` | Optional stack packs (API, Drizzle, Expo, UI) — copy when needed |

## What's not included

- Product features, schema, seeds, or sample apps
- Platform-specific release pipelines (EAS, store listing, asset generators)
- Vendor-locked auth or client DB SDKs

## Placeholders

| Token | Meaning |
|-------|---------|
| `{{PROJECT_NAME}}` | Display / product name |
| `repo` / `@repo` | Default npm names (root `repo`, workspace `@repo/config`). Rename to the real scope at bootstrap. |
| `{{PRIMARY_APP}}` | First app directory under `apps/` |
| `{{SCOPE_SUMMARY}}` | One-line current-phase blurb in AGENTS.md |

## Quality scripts (after bootstrap)

```bash
pnpm install
pnpm check          # harness + build + typecheck + lint + test
pnpm check:harness  # AI-harness self-check (no install required)
pnpm dev
```

## Self-improvement

This harness is meant to evolve. See [AGENTS.md](AGENTS.md) (rule evolution) and [docs/ai-harness/harness-self-improvement.md](docs/ai-harness/harness-self-improvement.md).

This repository is the canonical template. When a product monorepo improves product-agnostic harness conventions, mirror them here so the next project starts better than the last.
