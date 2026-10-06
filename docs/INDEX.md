# Documentation Index

Master registry of all {{PROJECT_NAME}} documentation. **Update this file when adding or changing any doc.**

## Plan

| Doc | Description |
|-----|-------------|
| [PLAN.md](../PLAN.md) | Root plan summary |
| [plan/ROADMAP.md](plan/ROADMAP.md) | Phased delivery roadmap |
| [plan/PLANS.md](plan/PLANS.md) | ExecPlan convention for multi-step / multi-session work |
| [plan/exec/README.md](plan/exec/README.md) | Per-task ExecPlan files (optional to commit) |
| [plan/exec/_template.md](plan/exec/_template.md) | Copyable ExecPlan skeleton |

## Architecture

| Doc | Description |
|-----|-------------|
| [architecture/tech-stack.md](architecture/tech-stack.md) | Pinned dependency versions |
| [architecture/env.md](architecture/env.md) | Environment variables (names only) |
| [architecture/monorepo.md](architecture/monorepo.md) | Repo layout, data flow, and pnpm 11 workspace config |
| [architecture/testing.md](architecture/testing.md) | Test suite, no-op policy, per-package fast loop, and quality gate |
| [architecture/api.md](architecture/api.md) | HTTP API conventions (pagination, etc.) |

## Features

| Doc | Status | Description |
|-----|--------|-------------|
| — | — | Add feature docs here as work starts |

See [features/README.md](features/README.md) for the feature doc template.

## AI Harness

| Doc | Description |
|-----|-------------|
| [AGENTS.md](../AGENTS.md) | Always-on agent protocol (canonical map, phase, docs, testing, rule evolution) |
| [CLAUDE.md](../CLAUDE.md) | Claude Code import of AGENTS.md |
| [ai-harness/RULES-INDEX.md](ai-harness/RULES-INDEX.md) | Guidance file registry (which tools load what), including Agent Skills |
| [ai-harness/EVOLUTION-LOG.md](ai-harness/EVOLUTION-LOG.md) | Rule change history |
| [ai-harness/harness-self-improvement.md](ai-harness/harness-self-improvement.md) | Keep rules/tooling/docs harness improving over time |
| [`.agents/skills/`](../.agents/skills/) | Cross-tool Agent Skills (`SKILL.md` playbooks); listed in RULES-INDEX |
