# Harness self-improvement

This tree is a living harness. When conventions improve, update the rules/docs **here** (and, if you maintain an upstream `skeleton/` copy elsewhere, propagate product-agnostic improvements back).

Always-on protocol lives in [AGENTS.md](../../AGENTS.md) (mandatory, including neutrality). Cursor glob-scoped rules and optional `profiles/` remain stack-specific. See the **Rule evolution (MANDATORY)** section in AGENTS.md.

## Where agents load guidance

| File | Loaded by |
|------|-----------|
| `AGENTS.md` | Cursor, Codex, GitHub Copilot, Gemini CLI, and other AGENTS.md clients |
| `CLAUDE.md` | Claude Code (`@AGENTS.md` import + Claude-only notes) |
| `.cursor/rules/*.mdc` | Cursor |
| `profiles/*` | not loaded until copied into `.cursor/rules/` |
| `.agents/skills/*/SKILL.md` | Cursor, Codex, GitHub Copilot (native). Claude Code via `.claude/skills` symlink |

## Prefer promoting patterns

| Signal | Action |
|--------|--------|
| Same instruction given 2+ times | Add/update `AGENTS.md` (always-on) or a `.cursor/rules/*.mdc` (glob/stack) |
| Stack choice becomes reusable | Add or extend a folder under `profiles/` |
| Docs shape drifts | Fix `docs/INDEX.md` template + AGENTS.md docs conventions |
| Tooling script pattern stabilizes | Update root `package.json` / CI / `packages/config` |

## Do not

- Encode one product’s domain into core rules or profiles meant for reuse
- Skip EVOLUTION-LOG / RULES-INDEX when changing guidance files
- Duplicate always-on protocol into Cursor `.mdc` files (keep a pointer, not a second copy)

After changing rules, profiles, skills, or harness docs, run `pnpm check:harness`.

## Neutrality

Commits, PRs, and docs in this template must stay **product-agnostic**:

- Describe the harness change (what/why), not which app discovered it
- Do not name products, monorepos, brands, or private repos that triggered an update
