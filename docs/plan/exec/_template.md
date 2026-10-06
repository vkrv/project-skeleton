# Short action-oriented title

This ExecPlan is a living document. Replace the title. Keep `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` current as work proceeds. Maintain every section in accordance with [docs/plan/PLANS.md](../PLANS.md).

## Purpose / Big Picture

What someone can do after this change that they could not do before, and how they will see it working.

## Progress

Timestamp completed items in UTC. Split anything half-finished into done vs remaining. This list must match the real state of the work.

- [ ] (started: YYYY-MM-DD HH:MMZ) First granular step
- [ ] Next granular step

## Surprises & Discoveries

- Observation: …
  Evidence: …

## Decision Log

- Decision: …
  Rationale: …
  Date/Author: …

## Outcomes & Retrospective

Fill at each major milestone and at completion. Compare the result to Purpose. Note gaps and lessons.

## Context and Orientation

Current state for a reader who knows nothing about this task. Full repository-relative paths. Define every non-obvious term. How the touched parts fit together.

## Plan of Work

Prose sequence of edits. For each: path, location (function / module / export), and what to change. If using milestones, each milestone ends with something new that can be run and observed.

## Concrete Steps

Working directory and exact commands. Short expected transcripts when output proves progress.

    cd /path/to/repo
    pnpm check

## Validation and Acceptance

Observable behavior, not “files exist.” Default evidence bar (definition of done):

- `pnpm check` (or filtered `pnpm turbo run test --filter <pkg>` while iterating) — record the command and its result
- Tests for new behavior; regression test for every bug fix
- Docs / INDEX / ROADMAP / EVOLUTION-LOG when those apply
- UI: visual proof of the affected flow, including an edge or error path if you touched one

Name the exact commands, expected outputs, and how a novice tells success from failure.

## Idempotence and Recovery

What is safe to re-run. How to recover from a half-finished step. How to leave the tree clean.

## Interfaces

Packages, modules, types, and function signatures that must exist when this is done. Name required dependencies and why.

## Artifacts and notes (optional)

Short transcripts or snippets that prove success.

## Revision notes

Append a dated note whenever you change this plan: what changed and why.
