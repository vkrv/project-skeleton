# Agent guidance index

Registry of always-on protocol and Cursor-scoped rules. Update when adding or removing guidance files. Enforced by `pnpm check:harness` (every `.mdc` under `.cursor/rules/` and `profiles/` must be listed; every listed `.mdc` must exist).

## Where guidance lives

| File | Loaded by | Apply | Description |
|------|-----------|-------|-------------|
| [AGENTS.md](../../AGENTS.md) | Cursor, Codex, GitHub Copilot, Gemini CLI, and other AGENTS.md clients; Claude Code via `CLAUDE.md` import | always | **Single source** of always-on protocol (project context, docs, testing, definition of done, rule evolution, ExecPlan trigger) |
| [CLAUDE.md](../../CLAUDE.md) | Claude Code | always | Imports AGENTS.md (`@AGENTS.md`); Claude-only notes only |
| [docs/plan/PLANS.md](../plan/PLANS.md) | Agents, via the AGENTS.md ExecPlan trigger | when required | ExecPlan convention; copy [exec/_template.md](../plan/exec/_template.md) to `docs/plan/exec/YYYY-MM-DD-slug.md` |
| `.cursor/rules/*.mdc` | Cursor | frontmatter (`alwaysApply` / `globs`) | Pointer to AGENTS.md plus glob-scoped (and copied profile) rules |
| `profiles/*` | not loaded until copied into `.cursor/rules/` | — | Optional stack packs |

Always-on protocol belongs in `AGENTS.md`. Do not restate it in always-on `.mdc` files.

## Core (always present)

| File | Apply | Loaded by | Description |
|------|-------|-----------|-------------|
| `000-agents.mdc` | always | Cursor | Pointer to `AGENTS.md`; do not duplicate protocol here |
| `100-typescript.mdc` | `**/*.{ts,tsx}` | Cursor | Strict TS + Zod boundaries |

## Optional (from `profiles/`)

Copy into `.cursor/rules/` only when that stack is adopted. See [../../profiles/README.md](../../profiles/README.md). Copied profile rules are loaded by **Cursor** (per each file's frontmatter).

| Profile | Rule file | Description |
|---------|-----------|-------------|
| `typescript-api` | `120-server-api.mdc` | Fastify + Zod API patterns |
| `drizzle-postgres` | `110-drizzle-postgres.mdc` | Drizzle + hosted Postgres |
| `expo-mobile` | `130-expo-mobile.mdc` | Expo Router / Query first-load / offline / Metro isolation |
| `ui-design` | `140-ui-design.mdc`, `150-images-and-icons.mdc` | Surfaces, tokens, Lucide-first |

## Adopted profiles / product rules

After bootstrap, move copied profiles here; keep Optional as catalog only.

| File | Apply | Description |
|------|-------|-------------|
