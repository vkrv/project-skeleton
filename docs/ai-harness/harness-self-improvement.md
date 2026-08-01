# Harness self-improvement

This tree is a living harness. When conventions improve, update the rules/docs **here** (and, if you maintain an upstream `skeleton/` copy elsewhere, propagate product-agnostic improvements back).

## Prefer promoting patterns

| Signal | Action |
|--------|--------|
| Same instruction given 2+ times | Add/update a `.cursor/rules/*.mdc` |
| Stack choice becomes reusable | Add or extend a folder under `profiles/` |
| Docs shape drifts | Fix `docs/INDEX.md` template + `020-docs-and-crossrefs.mdc` |
| Tooling script pattern stabilizes | Update root `package.json` / CI / `packages/config` |

## Do not

- Encode one product’s domain into core rules or profiles meant for reuse
- Skip EVOLUTION-LOG / RULES-INDEX when changing rules

See `000-rule-evolution.mdc`.

## Neutrality

Commits, PRs, and docs in this template must stay **product-agnostic**:

- Describe the harness change (what/why), not which app discovered it
- Do not name products, monorepos, brands, or private repos that triggered an update

