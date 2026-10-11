---
name: verify-done
description: Collect definition-of-done evidence before claiming work is finished. Use when wrapping up a change, writing a PR, or when the user asks if something is done, verified, or ready to merge.
---

# Verify done

Canonical list: **Definition of done** in [AGENTS.md](../../../AGENTS.md). Commands: [testing.md](../../../docs/architecture/testing.md). Missing verification is not a successful fix.

## Evidence to collect

1. **Commands:** From repo root run `pnpm check` (includes `pnpm check:harness`). While iterating, `pnpm turbo run test --filter <pkg>` is fine, but do not claim the full gate without `pnpm check` output. Report the command and its result.
2. **Tests:** Every bug fix needs a regression test. New logic needs tests per testing.md. Do not add no-op `test` scripts.
3. **Parity:** If the change touches logic that exists in more than one implementation, list each mirrored implementation and the regression test that covers it. If a side could not be updated, cite the tracked follow-up. Do not claim done with an untracked split.
4. **Docs:** Update docs, [INDEX.md](../../../docs/INDEX.md), and [ROADMAP.md](../../../docs/plan/ROADMAP.md) when relevant. Convention change → [EVOLUTION-LOG.md](../../../docs/ai-harness/EVOLUTION-LOG.md). If this work has an ExecPlan under `docs/plan/exec/`, update Progress and Validation so the plan still matches reality ([PLANS.md](../../../docs/plan/PLANS.md)).
5. **UI:** If web UI, layout, routing, or client state changed, exercise the flow (not a single screenshot). If no browser is available, say what substitute you used (tests, curl) and what you could not verify.
6. **Harness:** If you touched AGENTS.md, rules, profiles, skills, or harness docs, `pnpm check:harness` must be green.

## Report

In the PR or handoff include: commands run + outcomes, tests added, mirrored implementations (or N/A), docs touched, and UI evidence or an explicit gap. Do not merge from this skill.
