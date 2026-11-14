# Project memory

Standing, category-split memory for this repo. It is **not** the harness evolution log.

| File | Use for |
|------|---------|
| This file | Index and rules. Read it when the category is unclear. |
| [memory/bugs.md](memory/bugs.md) | Root causes, failed fixes, regressions to guard against |
| [memory/design.md](memory/design.md) | UI/UX and visual decisions |
| [memory/functionality.md](memory/functionality.md) | Product behaviour and domain decisions |
| [EVOLUTION-LOG.md](EVOLUTION-LOG.md) | Harness / convention changes only (keep its name; dates stay **ascending**) |

## When to read

Before starting work, open the category that matches the area: bugs when reproducing or fixing, design when changing UI/UX, functionality when changing behaviour or domain rules. Skim **Standing** first, then recent entries.

## When to write

Add an entry after:

- A bug whose root cause or a failed fix should not be rediscovered
- A UI/UX or visual decision that later screens must match
- A product-behaviour or domain decision that later work must respect
- A rejected approach that looked plausible

Do **not** log harness or convention edits here — append [EVOLUTION-LOG.md](EVOLUTION-LOG.md).

## How to write

Each category file:

1. **Standing** at the top: constraints still in force. Keep this short. Prune bullets that are obsolete or that a feature/architecture doc now owns.
2. **Entries** newest-first. Each entry: date (`YYYY-MM-DD`), one-line context, decision or lesson.

Preferred shapes (the harness linter accepts all three):

```markdown
- **YYYY-MM-DD** — Context: lesson.

### YYYY-MM-DD — Context

Lesson.

| YYYY-MM-DD | Context | Lesson |
```

Do not put dated entries in Standing — that section is the distilled constraints, not the log.

## Rules

- **Feature and architecture docs win** if Standing disagrees. Fix the drift; do not treat memory as a second source of truth.
- **Never paste log content** into `AGENTS.md` or `.cursor/rules`. If the lesson is now a convention, promote a distilled rule (see [AGENTS.md](../../AGENTS.md) rule evolution) and point at it from Standing.
- **Rejected approaches are worth recording** so the next agent does not retry them.
- **Prefer an ADR or ExecPlan** when that is the better home; [link it](../plan/PLANS.md) rather than duplicate it. Promote *Outcomes* / *Surprises* that should outlive a plan into the matching category here.

## Template stubs

Category files in this template ship with headings and one **example** line. The example is not in force. Replace or delete it when the first real entry lands. Do not invent product content in the skeleton.
