# Agent guidance index

Registry of always-on protocol, Cursor-scoped rules, and Agent Skills. Update when adding or removing guidance files. Enforced by `pnpm check:harness` (every `.mdc` under `.cursor/rules/` and `profiles/` must be listed; every `.agents/skills/*/SKILL.md` must be listed; every listed `.mdc` / skill path must exist).

## Where guidance lives

| File | Loaded by | Apply | Description |
|------|-----------|-------|-------------|
| [AGENTS.md](../../AGENTS.md) | Cursor, Codex, GitHub Copilot, Gemini CLI, and other AGENTS.md clients; Claude Code via `CLAUDE.md` import | always | **Single source** of always-on protocol (project context, docs, testing, definition of done, rule evolution) |
| [CLAUDE.md](../../CLAUDE.md) | Claude Code | always | Imports AGENTS.md (`@AGENTS.md`); Claude-only notes only |
| `.cursor/rules/*.mdc` | Cursor | frontmatter (`alwaysApply` / `globs`) | Pointer to AGENTS.md plus glob-scoped (and copied profile) rules |
| `profiles/*` | not loaded until copied into `.cursor/rules/` | — | Optional stack packs |
| `.agents/skills/*/SKILL.md` | Cursor, Codex, GitHub Copilot (native). Claude Code via `.claude/skills` symlink | on demand | Task playbooks (open [Agent Skills](https://agentskills.io/specification) format) |

Always-on protocol belongs in `AGENTS.md`. Do not restate it in always-on `.mdc` files. Do not copy skill bodies into AGENTS.md.

## Skills

Canonical location: [`.agents/skills/<slug>/SKILL.md`](../../.agents/skills/). Each `SKILL.md` uses YAML frontmatter with `name` (must match the folder slug) and `description` (what it does **and** when to use it), plus a short step body that points at canonical docs rather than copying them.

`.agents/skills/` is the cross-client project path in the [Agent Skills](https://agentskills.io/skill.md) docs. Native **project** load paths (checked 2026-10):

| Tool | Native project path | Source |
|------|---------------------|--------|
| Cursor | `.agents/skills/` and `.cursor/skills/` | [Cursor Agent Skills](https://cursor.com/docs/skills) |
| Codex | `.agents/skills/` (from CWD up to repo root) | [Codex skills](https://developers.openai.com/codex/skills) |
| GitHub Copilot | `.github/skills/`, `.claude/skills/`, or `.agents/skills/` | [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| Claude Code | `.claude/skills/<slug>/SKILL.md` only (does **not** document `.agents/skills`) | [Claude Code skills](https://code.claude.com/docs/en/skills) |

Claude Code is the major tool that cannot read `.agents/skills`. This repo keeps one copy under `.agents/skills/` and a **symlink** `.claude/skills` → `.agents/skills` (Claude Code follows skill-folder symlinks). Do not duplicate `SKILL.md` bodies. Cursor also reads `.claude/skills` and `.codex/skills` for compatibility; do not add extra trees.

| Skill | Path | Use when |
|-------|------|----------|
| `add-workspace-package` | [`.agents/skills/add-workspace-package/SKILL.md`](../../.agents/skills/add-workspace-package/SKILL.md) | Adding an `apps/*` or `packages/*` workspace package |
| `adopt-profile` | [`.agents/skills/adopt-profile/SKILL.md`](../../.agents/skills/adopt-profile/SKILL.md) | Copying a `profiles/` stack pack into `.cursor/rules/` |
| `evolve-harness` | [`.agents/skills/evolve-harness/SKILL.md`](../../.agents/skills/evolve-harness/SKILL.md) | Changing AGENTS.md, rules, profiles, skills, or harness docs |
| `verify-done` | [`.agents/skills/verify-done/SKILL.md`](../../.agents/skills/verify-done/SKILL.md) | Collecting definition-of-done evidence before claiming finished |

Add a skill: create the folder, write `SKILL.md`, list `.agents/skills/<slug>` here, run `pnpm check:harness`.

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
