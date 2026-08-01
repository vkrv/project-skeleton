# Bootstrap — new project from this skeleton

Create a repo from this GitHub template (`gh repo create my-new-app --template vkrv/project-skeleton --clone`), or copy this tree as a new repo root, then complete the checklist below before product work.

## 1. Identity

- [ ] Replace all `{{PROJECT_NAME}}` with the display product name
- [ ] Replace all `{{SCOPE}}` with the npm scope (e.g. `acme` → `@acme/config`)
- [ ] Replace `{{PRIMARY_APP}}` with the first app folder name (e.g. `web`, `mobile`, `server`)
- [ ] Fill `{{SCOPE_SUMMARY}}` in `AGENTS.md` (one-line phase description)
- [ ] Update root `package.json` `name` and filter paths to use the real scope

```bash
# Example find-replace from repo root after copy:
# {{PROJECT_NAME}} → MyProduct
# {{SCOPE}} → myproduct
# {{PRIMARY_APP}} → web
```

## 2. Docs & context

- [ ] Fill [`.cursor/rules/010-project-context.mdc`](.cursor/rules/010-project-context.mdc) (name, stack, monorepo map, phase in/out of scope)
- [ ] Fill [docs/architecture/tech-stack.md](docs/architecture/tech-stack.md) with real pinned versions
- [ ] Document env var names in [docs/architecture/env.md](docs/architecture/env.md)
- [ ] Sketch Phase 1 checkboxes in [docs/plan/ROADMAP.md](docs/plan/ROADMAP.md)
- [ ] Update [PLAN.md](PLAN.md) one-liner

## 3. Optional profiles

Copy only what you need from [`profiles/`](profiles/). See [profiles/README.md](profiles/README.md).

| Profile | When |
|---------|------|
| `typescript-api` | Fastify + Zod HTTP API |
| `drizzle-postgres` | Drizzle ORM + hosted Postgres |
| `expo-mobile` | Expo / React Native client |
| `ui-design` | Theme tokens, surface cards, Lucide-first icons |

For each copied profile:

- [ ] Copy `.mdc` into `.cursor/rules/`
- [ ] Add a row to `docs/ai-harness/RULES-INDEX.md`
- [ ] Append a line to `docs/ai-harness/EVOLUTION-LOG.md`

## 4. First app & install

- [ ] Create the first app under `apps/` (remove `apps/.gitkeep` when ready)
- [ ] Wire its `package.json` to depend on `@{{SCOPE}}/config` (after rename)
- [ ] `pnpm install`
- [ ] Confirm `pnpm check` passes (or adjust until empty packages are filtered)

## 5. First evolution log entry

- [ ] Append to `docs/ai-harness/EVOLUTION-LOG.md`:

```markdown
| YYYY-MM-DD | Bootstrap | — | Project initialized from universal skeleton |
```

## Done

Agents should start at [AGENTS.md](AGENTS.md). Product features go under `docs/features/` with INDEX + ROADMAP updates per `020-docs-and-crossrefs.mdc`.
