# Optional stack profiles

These folders are **not active** until you copy their rules into the new project.

## How to adopt a profile

1. Choose the profile(s) that match your stack.
2. Copy the `.mdc` file(s) into `.cursor/rules/`.
3. Add a row for each rule in `docs/ai-harness/RULES-INDEX.md`.
4. Append a line to `docs/ai-harness/EVOLUTION-LOG.md` (date, trigger: “Adopted X profile”, rule file, rationale).
5. Update `docs/architecture/tech-stack.md` with real version pins.
6. Adjust `AGENTS.md` / `010-project-context.mdc` monorepo map if the profile implies new packages (e.g. `packages/db`, `apps/server`).

## Profiles

| Folder | Contents | Use when |
|--------|----------|----------|
| [typescript-api](typescript-api/) | `120-server-api.mdc` | Fastify 5 + Zod type provider HTTP API |
| [drizzle-postgres](drizzle-postgres/) | `110-drizzle-postgres.mdc` | Drizzle schema/migrations + hosted Postgres |
| [expo-mobile](expo-mobile/) | `130-expo-mobile.mdc` | Expo Router, TanStack Query, offline patterns |
| [ui-design](ui-design/) | `140-ui-design.mdc`, `150-images-and-icons.mdc` | Elevated surfaces, theme tokens, Lucide-first |

## Notes

- Profiles are intentionally **product-agnostic** — no domain routes or feature lists.
- You can adopt zero profiles (tooling + core rules only) or several together.
- Do not leave unused profile copies inside `.cursor/rules/` “just in case.”
