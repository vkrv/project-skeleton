# Bootstrap — new project from this skeleton

Create a repo from this GitHub template (`gh repo create my-new-app --template vkrv/project-skeleton --clone`), or copy this tree as a new repo root, then complete the checklist below before product work.

## 1. Identity

- [ ] Replace all `{{PROJECT_NAME}}` with the display product name
- [ ] Rename root `repo` and `@repo/config` (including turbo `--filter` paths) to the real npm scope (e.g. `acme` → `@acme/config`)
- [ ] Replace `{{PRIMARY_APP}}` with the first app folder name (e.g. `web`, `mobile`, `server`)
- [ ] Fill `{{SCOPE_SUMMARY}}` in `AGENTS.md` (one-line phase description)
- [ ] Update root `package.json` `name` and filter paths to use the real scope

```bash
# Example find-replace from repo root after copy:
# {{PROJECT_NAME}} → MyProduct
# repo / @repo → myproduct / @myproduct
# {{PRIMARY_APP}} → web
```

## 2. Docs & context

- [ ] Fill [AGENTS.md](AGENTS.md) (name, stack, monorepo map, phase in/out of scope — canonical)
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
| `git-submodule` | Shared library or SDK consumed as a git submodule |

For each copied profile:

- [ ] Copy `.mdc` into `.cursor/rules/`
- [ ] Fill pack-specific ALL-CAPS mustache tokens in the copied `.cursor/rules/` file (see the pack README)
- [ ] Append a row under **Adopted profiles / product rules** in `docs/ai-harness/RULES-INDEX.md` (keep Optional as catalog only)
- [ ] Append a line to `docs/ai-harness/EVOLUTION-LOG.md`

## 4. First app & install

- [ ] Create the first app under `apps/` (remove `apps/.gitkeep` when ready)
- [ ] Wire its `package.json` to depend on `@repo/config` (after rename)
- [ ] `pnpm install`
- [ ] After the first real dependency that needs a lifecycle script (native compile / `postinstall`, e.g. esbuild), add it under `allowBuilds` in `pnpm-workspace.yaml` — see [docs/architecture/monorepo.md](docs/architecture/monorepo.md)
- [ ] Confirm `pnpm check` passes (or adjust until empty packages are filtered)

## 5. First evolution log entry

- [ ] Append to `docs/ai-harness/EVOLUTION-LOG.md`:

```markdown
| YYYY-MM-DD | Bootstrap | — | Project initialized from universal skeleton |
```

## 6. Enable the product-mode placeholder gate

This skeleton omits `HARNESS_MODE` so leftover bootstrap tokens are allowed. After they are gone from core files, turn the gate on as a normal last bootstrap step:

- [ ] Set `HARNESS_MODE=product` in CI so `pnpm check:harness` fails on leftovers

**Where to set it:** GitHub Actions `env` on the harness step or the `check` job in `.github/workflows/ci.yml` (this template does **not** set it):

```yaml
- run: node scripts/check-harness.mjs
  env:
    HARNESS_MODE: product
```

Locally: `HARNESS_MODE=product pnpm check:harness`. The variable is listed in [docs/architecture/env.md](docs/architecture/env.md).

Unadopted packs under `profiles/` are a catalog and are **not** scanned. When you copy a pack into `.cursor/rules/`, fill that pack’s ALL-CAPS mustache tokens in the **copied** file (see the pack README). Adopted copies are scanned.

## Done

Agents should start at [AGENTS.md](AGENTS.md). Product features go under `docs/features/` with INDEX + ROADMAP updates per the docs conventions in AGENTS.md.
