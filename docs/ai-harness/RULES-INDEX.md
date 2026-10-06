# Cursor rules index

Registry of active `.cursor/rules/*.mdc` files. Update when adding or removing rules.

## Core (always present)

| File | Apply | Description |
|------|-------|-------------|
| `000-rule-evolution.mdc` | always | Self-evolve rules + docs; keep harness improving; propagate agnostic fixes upstream if applicable |
| `010-project-context.mdc` | always | Product name, stack, phase scope (fill at bootstrap) |
| `020-docs-and-crossrefs.mdc` | always | INDEX, feature docs, ROADMAP |
| `030-ask-clarifying-questions.mdc` | always | Ask before ambiguous / high-stakes work |
| `100-typescript.mdc` | `**/*.{ts,tsx}` | Strict TS + Zod boundaries |
| `160-testing-harness.mdc` | always | Vitest + no-op-free `pnpm test` / `pnpm check` |

## Optional (from `profiles/`)

Copy into `.cursor/rules/` only when that stack is adopted. See [../../profiles/README.md](../../profiles/README.md).

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
