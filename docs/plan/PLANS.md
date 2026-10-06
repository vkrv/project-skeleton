# ExecPlans

An **ExecPlan** is a living, self-contained execution document that a coding agent or a newcomer can follow to deliver a working change. The reader has only the current working tree and this one plan file. There is no memory of prior chats, prior plans, or unstated context.

This convention is adapted from OpenAI’s published ExecPlan practice for long, multi-step work. It is tailored to this monorepo: plans live under `docs/plan/`, acceptance follows this repo’s [definition of done](../../AGENTS.md#definition-of-done), and durable product planning stays in the roadmap.

## When an ExecPlan is required

Write one before (or at the start of) work that is:

- A **multi-step feature** (several files, packages, or milestones)
- A **significant refactor** (behavior must stay correct while structure changes)
- Anything that will **span sessions or agents** (handoff, pause, or parallel implementers)

Skip an ExecPlan for a one-file fix, a typo, a pin bump with a clear command, or a docs-only tweak that a single commit can finish.

If you are unsure, write the plan. The cost of a short plan is lower than a half-finished change with no handoff.

## Where plans live

| Path | Role |
|------|------|
| This file (`docs/plan/PLANS.md`) | Convention: what an ExecPlan is and the rules for writing one |
| [exec/_template.md](exec/_template.md) | Copyable skeleton with every mandatory section |
| [exec/](exec/README.md) | Per-task plans, named `YYYY-MM-DD-slug.md` |

**Why here, not the repo root.** Root `PLAN.md` is a one-line pointer. Phased delivery already lives in `docs/plan/ROADMAP.md`. The convention, the template, and the task files belong next to that roadmap so planning docs stay in one tree. `AGENTS.md` stays short and only triggers the convention.

Per-task plans are **optional to commit**. Commit a plan when another session or agent will need it, or when the PR is easier to review with the working record attached. Keep unfinished local plans untracked if they are only for you.

## How this relates to other docs

| Doc | Job | Not its job |
|-----|-----|-------------|
| [ROADMAP.md](ROADMAP.md) | Phased **delivery checkboxes** (what ships, in which phase) | Step-by-step implementation, command transcripts, recovery |
| Feature docs (`docs/features/`) | User-visible behavior, status, open questions | The executable path for a single task |
| ExecPlan (`docs/plan/exec/…`) | **How** this task gets done, with living progress and proof | Replacing the roadmap or the feature doc |
| ADR (if the repo adopts them, typically under `docs/architecture/`) | Durable **architectural decisions** that outlive one task | A scratchpad for every in-task choice |

When an ExecPlan decision should last (a boundary, a storage choice, a public API shape), promote it to an ADR (or the architecture doc that plays that role) and link it from the Decision Log. When the work ships, tick the matching ROADMAP checkbox and update the feature doc status. Do not treat the `exec/` folder as the product roadmap.

**Finished plans:** if the working notes are still useful, move the file to `docs/plan/exec/archive/` (same basename). If they are not, delete the file. Update [INDEX.md](../INDEX.md) only if you registered a specific plan there; the folder README is enough for the convention.

## How to use this file

When **authoring**, follow this document. If it is not in context, read it through. Start from the template and fill every mandatory section as you research. Embed the knowledge a novice needs; do not point at a chat transcript or an external essay and assume it will be fetched.

When **implementing**, do not stop to ask for “next steps” between planned milestones. Update the living sections at every stopping point, commit when a milestone is verifiable, and continue. Still ask the clarifying questions [AGENTS.md](../../AGENTS.md) requires (ambiguous intent, security/privacy, public naming). Resolve *implementation* ambiguity in the plan itself and record why.

When **discussing** a plan, log decisions in the Decision Log so a later reader can see why the spec changed. It must always be possible to restart from **only** the ExecPlan plus the working tree.

When requirements are risky or unknown, add a **prototyping** milestone: a small, additive spike with a way to run it and a rule for promoting or discarding it.

## Non-negotiable rules

1. **Self-contained.** A novice with this file and the working tree can succeed. Define every term of art in plain language the first time you use it, and say where it appears in *this* repository (path, command, or symbol). Repeat assumptions. If a prior ExecPlan is checked in, you may cite it by repo-relative path; if it is not, copy the needed context in.
2. **Living.** Revise the plan as progress happens, as surprises appear, and as decisions land. After a revision, every section must still be true together. Add a short note at the bottom of the file describing what changed and why.
3. **Observable.** The outcome is working behavior a human can see, not merely “files were touched.” Acceptance is evidence in the same sense as the definition of done: commands run, results reported, regressions covered, docs/roadmap updated when relevant, UI proof when the UI changed.
4. **Idempotent enough to retry.** Steps should be safe to re-run, or they must say how to recover from a half-finished attempt.

Do not outsource a key choice to the reader. Do not specify the letter of a change so narrowly that the code compiles and does nothing useful. Prefer over-explaining user-visible effects; under-specify incidental internals.

## Mandatory sections

Every ExecPlan file must include these headings (wording may add a few words after the required phrase; the phrase must appear as a markdown heading). Keep them in roughly this order.

### Purpose / Big Picture

A few sentences: what someone can do after this change that they could not do before, and how to see it working. User-visible first.

### Progress

A **checklist** of granular steps, **with timestamps** on completed (and, when useful, started) items, using UTC. This section must match reality at every stop: split a half-finished item into “done” vs “remaining” rather than leaving a stale checkbox. Checklists are mandatory here.

Example shape:

- [x] (2026-10-07 14:00Z) Example completed step.
- [ ] Example remaining step.
- [ ] Example split step (completed: X; remaining: Y).

### Surprises & Discoveries

Unexpected behavior, bugs, constraints, or insights that changed the approach. Attach short evidence (a test name, a command snippet, a file path).

### Decision Log

Every material choice, in this shape:

- Decision: …
  Rationale: …
  Date/Author: …

Include reversals. If you change course, say why here and fix Progress so it still matches.

### Outcomes & Retrospective

At each major milestone and at completion: what was achieved, what remains, what you would do differently, and how the result compares to Purpose.

### Context and Orientation

The current state as if the reader knows nothing. Full repository-relative paths for the files and modules that matter. How those parts fit together. Definitions of non-obvious terms. Do not say “see the architecture doc” without restating the bit you need.

### Plan of Work

Prose sequence of edits. For each edit: path, location (function, module, export), and what to insert or change. Concrete and minimal. If you use milestones, each one should say what will exist at the end that did not exist before, how to run it, and what acceptance you will observe. Progress tracks the checklist; this section tells the story.

### Concrete Steps

Exact commands and the working directory for each. When a command prints something that proves progress, include a short expected transcript. Update this section as the real commands evolve.

### Validation and Acceptance

How to exercise the change and what to observe. Phrase acceptance as behavior (inputs → outputs), not as “added a struct.”

This repo’s definition of done is the default evidence bar:

- Run `pnpm check` (or `pnpm turbo run test --filter <pkg>` while iterating) and **report the command and its result**.
- New behavior has tests that can fail; a bug fix has a regression test.
- Docs, `docs/INDEX.md`, and `docs/plan/ROADMAP.md` updated when relevant; EVOLUTION-LOG when a convention changed.
- UI changes include visual proof of the affected flow, not only a static screenshot of the happy path.

If the change is internal, still show impact: a test that fails before and passes after, plus a scenario that uses the new behavior. State the exact commands and how to tell success from failure.

### Idempotence and Recovery

What is safe to repeat. What to do if a step fails halfway (retry, rollback, leftover files, dirty git state). How to leave the tree clean.

### Interfaces

Be prescriptive. Name the packages, modules, types, and function signatures that must exist when the milestone is done. Prefer stable names such as `@repo/config` or `apps/web/src/foo.ts` `export function bar`. If a dependency is required, name it and why — do not leave “pick a library” to the implementer unless that choice is an explicit spike with promotion criteria.

## Optional section

**Artifacts and notes** — short transcripts, diffs, or snippets that prove success. Keep them small. Prefer instructions a reader can re-run over pasting large blobs.

## Formatting

One markdown file per task. Use normal headings, lists, and fenced code for commands. Write prose in narrative sections; the Progress checklist is the required list. Name files and symbols with repo-relative paths. Show the working directory with every command.

Do not wrap the whole plan in a single giant code fence (that pattern is for pasting into a chat, not for files in this repo).

## Prototypes and parallel paths

Spikes are encouraged when they de-risk a larger change. Label the scope as prototyping, say how to run it, and say when it gets promoted or deleted. Prefer additive changes that keep tests passing, then remove the old path with tests still green. If two implementations coexist during a migration, say how to validate both and how to retire one.

## The bar

A single, stateless agent — or a human novice — can read the ExecPlan top to bottom and produce a working, observable result: **self-contained, current, and checkable**.
