---
name: adopt-profile
description: Adopt an optional stack profile from profiles/ into .cursor/rules and record it under Adopted in RULES-INDEX. Use when enabling Fastify API, Drizzle/Postgres, Expo mobile, or UI-design rules, or when the user asks to copy a profile.
---

# Adopt a stack profile

How-to: [profiles/README.md](../../../profiles/README.md). File catalog: [RULES-INDEX.md](../../../docs/ai-harness/RULES-INDEX.md).

## Steps

1. Pick only the folders that match the stack (`typescript-api`, `drizzle-postgres`, `expo-mobile`, `ui-design`). Do not copy unused profiles “just in case.”
2. Copy the profile `.mdc` file(s) into `.cursor/rules/` (keep filenames). Do not rewrite always-on protocol into them.
3. Append a row under **Adopted profiles / product rules** in RULES-INDEX. Leave the Optional table as the catalog.
4. Append [EVOLUTION-LOG.md](../../../docs/ai-harness/EVOLUTION-LOG.md): date, trigger “Adopted \<profile\> profile”, rule file, rationale. Dates must be non-decreasing.
5. Pin real versions in [tech-stack.md](../../../docs/architecture/tech-stack.md) when the profile implies libraries.
6. If the profile implies new packages (`packages/db`, `apps/server`, …), create them with [add-workspace-package](../add-workspace-package/SKILL.md) and update the [AGENTS.md](../../../AGENTS.md) map.
7. Run `pnpm check:harness`, then `pnpm check` if dependencies or packages changed.

## Gotchas

- Files under `profiles/` are inactive until copied. Editing the pack alone does not apply it.
- Copied rules are Cursor-scoped (`globs` / `alwaysApply`). Always-on protocol stays in AGENTS.md.
- Stay product-agnostic in shared harness files.
