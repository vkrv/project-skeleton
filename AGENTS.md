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

This table is the **canonical** agent-facing map. Layout, data flow, and pnpm 11 workspace settings: [docs/architecture/monorepo.md](docs/architecture/monorepo.md).

| Path | Purpose |
|------|---------|
| `apps/{{PRIMARY_APP}}` | Primary client app (fill after creating first app) |
| `packages/config` | Shared ESLint + TypeScript config (`@repo/config`) |
| `packages/*` | Shared libraries (add as needed) |

Update this table when you add apps or packages.

## Documentation

- [docs/INDEX.md](docs/INDEX.md) — master doc registry
- [docs/plan/ROADMAP.md](docs/plan/ROADMAP.md) — phased delivery plan
- [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) — pinned versions
- [docs/architecture/monorepo.md](docs/architecture/monorepo.md) — layout and pnpm 11 workspace settings
- [docs/architecture/env.md](docs/architecture/env.md) — environment variables
- [docs/ai-harness/RULES-INDEX.md](docs/ai-harness/RULES-INDEX.md) — guidance file registry
- [docs/ai-harness/EVOLUTION-LOG.md](docs/ai-harness/EVOLUTION-LOG.md) — convention change history

### Docs conventions

**INDEX is canonical.** Update `docs/INDEX.md` whenever adding or changing any doc. Feature docs (`docs/features/*.md`) include **Status** (planned | in-progress | shipped), **Related**, and **Open questions**. Living plan: `PLAN.md` + `docs/plan/ROADMAP.md`. Cross-link with relative markdown links.

## Dev commands

Run everything from the **repo root**:

```bash
pnpm install

# Quality
pnpm check         # harness + build + typecheck + lint + test
pnpm check:harness # rules index, skills, links, placeholders, evolution log
pnpm build
pnpm lint
pnpm typecheck
pnpm test

# Dev
pnpm dev        # all apps (turbo)
pnpm clean
```

Add app-specific scripts (e.g. `dev:server`) only after creating those apps.

## Definition of done

Not done without evidence. Missing verification is not a successful fix.

- Run `pnpm check` (or `pnpm turbo run test --filter <pkg>` while iterating). Report the command and its result — do not assert green without that output.
- Add a regression test for every bug fix.
- Update docs, [docs/INDEX.md](docs/INDEX.md), and [docs/plan/ROADMAP.md](docs/plan/ROADMAP.md) when relevant.
- Append to [docs/ai-harness/EVOLUTION-LOG.md](docs/ai-harness/EVOLUTION-LOG.md) when a convention changed.
- For UI changes, provide visual evidence (screenshot or recording of the affected flow).

## Testing

Follow **definition of done** above. Strategy and per-package fast-loop: [docs/architecture/testing.md](docs/architecture/testing.md).

- **Vitest** for shared packages and Node/web apps by default
- When native / mobile app code exists, wire **real unit tests** for JS/TS logic (Vitest or the project-chosen runner). Full platform runners (device / simulator) can stay TBD / opt-in
- Optional E2E is **labeled and opt-in in CI** — not a silent skip inside the required `pnpm test` job

No-ops are not a suite:

- `pnpm test` and each package `test` script must actually run tests when that package claims a suite
- Do not ship placeholder scripts (`echo` / `exit 0`), empty configs that match zero files, or pipelines that always pass with nothing executed
- Packages without a suite yet should **omit** the `test` script (Turbo skips missing tasks) rather than fake a pass
- Adding a `test` script means adding at least one real assertion that can fail

When to add tests:

- New pure logic (validators, mappers, domain math) → unit test alongside code
- New Zod API contracts in shared packages → schema tests
- Bug fix → regression test (required)
- New HTTP route → prefer testing extracted service logic; integration tests when a DB test harness exists

CI runs `pnpm test` on every push/PR. Do not merge with failing tests.

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
3. Update `docs/ai-harness/RULES-INDEX.md` when guidance files change (including `.agents/skills`)
4. Run `pnpm check:harness` and fix any errors
5. This repo is the canonical template — when improving the harness from a product monorepo, **push product-agnostic changes here** so the next project benefits

### Never skip

- New feature → feature doc + `docs/INDEX.md` entry + ROADMAP checkbox
- Version pin change → `docs/architecture/tech-stack.md` + EVOLUTION-LOG
- Behavior change → add/update tests; satisfy **definition of done** (`pnpm check` + evidence)
- Rule, profile, skill, or harness-doc change → run `pnpm check:harness`

### Harness self-improvement

Treat tooling + AI rules + docs conventions as a living system:

- Prefer improving **this file**, a **core glob-scoped rule**, a **profile**, or an **Agent Skill** over one-off chat instructions
- When a stack pack becomes a repeated need, add or update a folder under `profiles/` and document in RULES-INDEX
- Never invent product-specific examples into shared harness files meant for reuse
- Commit/PR/docs messages must stay **neutral** — do not name products or repos that triggered the change

Optional stack profiles live in `profiles/` — copy selected rules into `.cursor/rules/` during bootstrap.

## Skills

On-demand playbooks, not always-on protocol. When a task matches a skill `description`, follow that `SKILL.md`. Do not paste skill bodies into this file.

- Canonical: [`.agents/skills/<slug>/SKILL.md`](.agents/skills/) ([Agent Skills](https://agentskills.io/specification))
- Claude Code does not read `.agents/skills`; [`.claude/skills`](.claude/skills) is a symlink to that folder
- Add a skill: folder slug = `name`, non-empty `description` (when to use it), list it in [RULES-INDEX](docs/ai-harness/RULES-INDEX.md), run `pnpm check:harness`

## Tool loading

| File | Loaded by |
|------|-----------|
| `AGENTS.md` (this file) | Cursor, Codex, GitHub Copilot, Gemini CLI, and other AGENTS.md clients |
| `CLAUDE.md` | Claude Code (imports this file with `@AGENTS.md`) |
| `.cursor/rules/*.mdc` | Cursor (one always-on pointer plus glob-scoped rules; see RULES-INDEX) |
| `.agents/skills/*/SKILL.md` | Cursor, Codex, GitHub Copilot (native). Claude Code via `.claude/skills` symlink |
