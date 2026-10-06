---
name: evolve-harness
description: Run the mandatory harness evolution loop after a convention change. Use when adding or changing AGENTS.md, Cursor rules, profiles, skills, or harness docs; when the user says always do X; or when the same pattern appears twice.
---

# Evolve the harness

Protocol: **Rule evolution (MANDATORY)** in [AGENTS.md](../../../AGENTS.md). Index: [RULES-INDEX.md](../../../docs/ai-harness/RULES-INDEX.md). Why: [harness-self-improvement.md](../../../docs/ai-harness/harness-self-improvement.md).

## Steps

1. Decide the layer:
   - Always-on, tool-agnostic → AGENTS.md (keep ≲200 lines / 32 KiB)
   - Glob-scoped or stack-specific → `.cursor/rules/*.mdc` (copy from `profiles/` when adopting a stack)
   - Reusable stack pack → `profiles/<name>/` plus a RULES-INDEX catalog row
   - On-demand procedure → `.agents/skills/<slug>/SKILL.md`, not always-on text
2. Edit the file(s). Do not duplicate always-on protocol into `.mdc` files.
3. Update RULES-INDEX when guidance files are added or removed (every `.mdc` and every `.agents/skills/*/SKILL.md` must be listed).
4. Append one row to [EVOLUTION-LOG.md](../../../docs/ai-harness/EVOLUTION-LOG.md): date, trigger, rule/doc, rationale. Keep existing rows. Dates must be non-decreasing. Stay **neutral** — no product or private repo names.
5. New doc → register in [docs/INDEX.md](../../../docs/INDEX.md). Feature work also updates ROADMAP.
6. Version pin change → [tech-stack.md](../../../docs/architecture/tech-stack.md) + EVOLUTION-LOG.
7. Run `pnpm check:harness` and fix errors. Behavior change → tests + **definition of done**.
8. Product-agnostic improvements belong in this template so the next project inherits them.

## Never skip

- New feature → feature doc + INDEX + ROADMAP
- `pnpm check:harness` after rule, profile, skill, or harness-doc edits
