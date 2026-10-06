# {{PROJECT_NAME}} — AI Entry Point

Start every session here. **This file is the single source of always-on agent guidance** (tool-agnostic). Keep it concise (~200 lines; well under typical size caps such as Codex 32 KiB).

**Product name:** {{PROJECT_NAME}} — {{SCOPE_SUMMARY}}.

Glob-scoped Cursor rules (`.cursor/rules/`) and optional `profiles/` still apply when those stacks are in use. Do not duplicate this protocol in always-on Cursor rules.

## Current phase

**Phase 1:** {{SCOPE_SUMMARY}} — fill in after bootstrap (see [BOOTSTRAP.md](BOOTSTRAP.md)).

This section is the **canonical** current-phase + in/out-of-scope list. Delivery checkboxes live in [docs/plan/ROADMAP.md](docs/plan/ROADMAP.md).

### Phase 1 scope (implement)

- _List features to implement in Phase 1_

### Out of scope (document only)

- _List deferred / document-only work_

## Stack

Pinned versions: [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) (single version source). Fill during bootstrap.

Example shape:

- Node **24**, pnpm **11**, Turborepo **2.x**
- Primary app: `apps/{{PRIMARY_APP}}`
- Shared packages under `packages/*`

### Pin policy

- Prefer the **latest stable** release compatible with the pinned SDK/runtime
- Never downgrade a library to stay on an older runtime or architecture
- For Expo apps (if used): `npx expo install --fix` first; if the SDK-bundled pin is known-broken or behind latest stable, bump and add `expo.install.exclude`
- No pre-release deps unless explicitly needed

## Monorepo map

This table is the **canonical** agent-facing map. Architecture tree and data flow: [docs/architecture/monorepo.md](docs/architecture/monorepo.md).

| Path | Purpose |
|------|---------|
| `apps/{{PRIMARY_APP}}` | Primary client app (fill after creating first app) |
| `packages/config` | Shared ESLint + TypeScript config (`@{{SCOPE}}/config`) |
| `packages/*` | Shared libraries (add as needed) |

Update this table when you add apps or packages.

## Documentation

- [docs/INDEX.md](docs/INDEX.md) — master doc registry
- [docs/plan/ROADMAP.md](docs/plan/ROADMAP.md) — phased delivery plan
- [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) — pinned versions
- [docs/architecture/env.md](docs/architecture/env.md) — environment variables
- [docs/ai-harness/RULES-INDEX.md](docs/ai-harness/RULES-INDEX.md) — guidance file registry
- [docs/ai-harness/EVOLUTION-LOG.md](docs/ai-harness/EVOLUTION-LOG.md) — convention change history

### Docs conventions

**INDEX is canonical.** Update `docs/INDEX.md` whenever adding or changing any doc.

Each `docs/features/*.md` must include:

- **Status:** planned | in-progress | shipped
- **Related:** schema tables, API routes, screens/clients, linked features
- **Open questions:** items needing user input

Living plan:

- `PLAN.md` — short summary + link to roadmap
- `docs/plan/ROADMAP.md` — phased checkboxes, updated as work progresses

Cross-link with relative markdown links. Example: feature doc → `../architecture/data-model.md` → schema package.

## Dev commands

Run everything from the **repo root**:

```bash
pnpm install

# Quality
pnpm check      # build + typecheck + lint + test
pnpm build
pnpm lint
pnpm typecheck
pnpm test

# Dev
pnpm dev        # all apps (turbo)
pnpm clean
```

Add app-specific scripts (e.g. `dev:server`) only after creating those apps.

## Testing

Tests are part of the quality gate. **Run `pnpm test` before considering work done.**

- **Vitest** for shared packages and Node/web apps by default
- Native clients: add Jest/Detox (or project-chosen runner) when the first mobile app needs a suite

When to add tests:

- New pure logic (validators, mappers, domain math) → unit test alongside code
- New Zod API contracts in shared packages → schema tests
- Bug fix → regression test when practical
- New HTTP route → prefer testing extracted service logic; integration tests when a DB test harness exists

CI runs `pnpm test` on every push/PR. Do not merge with failing tests.

Agent checklist:

1. Add/update tests for changed behavior
2. Run `pnpm test` locally
3. Update `docs/architecture/testing.md` if strategy changes

## Environment (names only — see env.md)

Document env var **names** in `docs/architecture/env.md`. Never commit secrets.

## Clarifying questions

Ask before building when:

- Requirements have multiple valid implementations with significant trade-offs
- User intent is ambiguous (scope, UX, data model)
- Feature touches security, privacy, or competitive fairness
- Naming/branding decisions affect public API or schema

How to ask: structured questions with concrete options; 1–2 critical questions at a time; propose a default if blocked, labeled as assumption.

Do not ask when the answer is in docs, rules, or existing conventions, or when the choice is standard for this stack (e.g. Zod at API boundaries).

## Rule evolution (MANDATORY)

When a pattern emerges that should be a convention, **update the harness immediately**. This protocol is mandatory for every agent, not Cursor-only.

### When to evolve

- Same pattern in 2+ places or 2+ sessions
- Bug caused by missing convention
- User says "this should be a rule" or "always do X"
- New package/app added to monorepo
- Schema or API contract changes affect multiple apps
- A reusable harness / tooling / docs convention improves (keep the harness self-improving)

### How to evolve

1. Always-on protocol → this file. Glob-scoped or stack-specific → add/update `.cursor/rules/*.mdc` (copy from `profiles/` when adopting a stack)
2. Append to `docs/ai-harness/EVOLUTION-LOG.md` (date, trigger, rule, rationale)
3. Update `docs/ai-harness/RULES-INDEX.md` when guidance files change
4. This repo is the canonical template — when improving the harness from a product monorepo, **push product-agnostic changes here** so the next project benefits

### Never skip

- New feature → feature doc + `docs/INDEX.md` entry + ROADMAP checkbox
- Version pin change → `docs/architecture/tech-stack.md` + EVOLUTION-LOG
- Behavior change → add/update tests; run `pnpm test`

### Harness self-improvement

Treat tooling + AI rules + docs conventions as a living system:

- Prefer improving **this file**, a **core glob-scoped rule**, or a **profile** over one-off chat instructions
- When a stack pack becomes a repeated need, add or update a folder under `profiles/` and document in RULES-INDEX
- Never invent product-specific examples into shared harness files meant for reuse
- Commit/PR/docs messages must stay **neutral** — do not name products or repos that triggered the change

Optional stack profiles live in `profiles/` — copy selected rules into `.cursor/rules/` during bootstrap.

## Tool loading

| File | Loaded by |
|------|-----------|
| `AGENTS.md` (this file) | Cursor, Codex, GitHub Copilot, Gemini CLI, and other AGENTS.md clients |
| `CLAUDE.md` | Claude Code (imports this file with `@AGENTS.md`) |
| `.cursor/rules/*.mdc` | Cursor (one always-on pointer plus glob-scoped rules; see RULES-INDEX) |
