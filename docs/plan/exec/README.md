# Per-task ExecPlans

Individual execution plans for multi-step work. Convention: [../PLANS.md](../PLANS.md). Copy [\_template.md](_template.md) when you start a plan.

## Naming

```text
YYYY-MM-DD-slug.md
```

- Date is the day the plan started (UTC).
- `slug` is a short kebab-case label for the task (`add-execplan-convention`, `split-billing-api`).
- One plan file per task. Do not dump unrelated work into an existing plan.

## Commit or not

Plans are **optional to commit**. Commit when:

- Another session, agent, or reviewer will need the working record
- The change spans PRs or people
- The Decision Log / surprises would otherwise vanish

Keep a plan untracked (or local-only) when it is a private scratchpad. Never commit secrets.

This folder is not the product roadmap. Do not register every plan in [INDEX.md](../../INDEX.md) unless a specific plan is meant to be a standing doc.

## Finished work

When the task is done:

1. Tick ROADMAP / feature-doc status if those apply.
2. Promote lasting architectural choices to an ADR (or the architecture doc that serves that role); leave a link in the Decision Log.
3. Either **move** the file to `archive/` (same basename) if the notes are still useful, or **delete** it if they are not.

Create `archive/` on first use; it does not need to exist empty.

## Relation to other planning docs

| Doc | Use for |
|-----|---------|
| [ROADMAP.md](../ROADMAP.md) | Phase delivery checkboxes |
| Feature docs | User-visible behavior and status |
| This folder | Executable how-to for one task |
| ADRs (if adopted) | Durable decisions that outlive the task |
