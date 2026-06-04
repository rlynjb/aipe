---
description: [orchestrator] Audit orchestrator — runs audit-status, audit-cleanup, audit-frontend-a11y, and audit-refactor under one confirmation gate
---

The user invoked `/aipe:audit`.

One command runs **all four** audit-family generators on the current repo in sequence under one confirmation gate, producing a complete read on what's there, what's wrong, what's inaccessible, and what a staff engineer would say about it.

```
/aipe:audit           → run all four generators in sequence
```

The orchestrator does not redefine output shape — each generator's own spec is the contract.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/audits/`, write a short project-context placeholder (stack, data model, file structure, must-not-change constraints), print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:audit.`, and stop.

If `.aipe/project/context.md` exists, ensure `.aipe/audits/` exists (mkdir if needed).

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, and optional matching files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/audit.md
${CLAUDE_PLUGIN_ROOT}/specs/audit-status.md
${CLAUDE_PLUGIN_ROOT}/specs/audit-cleanup.md
${CLAUDE_PLUGIN_ROOT}/specs/audit-frontend-a11y.md
${CLAUDE_PLUGIN_ROOT}/specs/audit-refactor.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location.

## Step 4 — Plan the run (single confirmation gate)

Print one consolidated plan covering all four generators with the planned output paths:

```
  Plan
  ────
  audit-status         → .aipe/audits/snapshot-<YYYY-MM-DD>.md
  audit-cleanup        → .aipe/audits/cleanup-<YYYY-MM-DD>.md
  audit-frontend-a11y  → .aipe/audits/a11y-<YYYY-MM-DD>.md
                         (or skipped if no frontend surface)
  audit-refactor       → .aipe/audit-refactor-<purpose>/
                         (six-chapter book; reuses folder if purpose matches)
```

Wait for one confirmation. In non-interactive execution, print the plan and continue. **One gate for all four** — no per-stage prompts.

## Step 5 — Execute audit-status

Run per `specs/audit-status.md`: produce the 8-section descriptive snapshot at `.aipe/audits/snapshot-<YYYY-MM-DD>.md`. Describe, don't act.

## Step 6 — Execute audit-cleanup

Run per `specs/audit-cleanup.md`: four-lens debt triage (structural / architectural / DSA hot-paths / test debt). Every finding gets the four fields (Lens / Severity / Effort / Decision) plus the Refactor-shape line. Write to `.aipe/audits/cleanup-<YYYY-MM-DD>.md`.

## Step 7 — Execute audit-frontend-a11y

Run per `specs/audit-frontend-a11y.md`. If the repo has no frontend surface, emit `no frontend surface` and skip to Step 8 — do not create an empty a11y file. Otherwise write to `.aipe/audits/a11y-<YYYY-MM-DD>.md`.

## Step 8 — Execute audit-refactor

Run per `specs/audit-refactor.md`: the six-chapter staff-engineer refactor notebook. Heavier artifact; writes to `.aipe/audit-refactor-<purpose>/` (a folder, not a single dated file).

## Step 9 — Consolidated summary

Print one row per generator with the output path and a one-line headline, then a `Top concerns across the four audits` block ranking the worst items from cleanup's `fix-now`, a11y's blocking issues, and refactor's chapter 1 into a single ranked list. End with the single next action.

```
✓ Audit run complete
  audit-status:        .aipe/audits/snapshot-<date>.md
                       (8-section snapshot; <N> features, <N> deferred items)
  audit-cleanup:       .aipe/audits/cleanup-<date>.md
                       (<N> findings; <N> fix-now)
  audit-frontend-a11y: .aipe/audits/a11y-<date>.md
                       (or "no frontend surface")
  audit-refactor:      .aipe/audit-refactor-<purpose>/
                       (six chapters; load-bearing finding: <one line>)

Top concerns across the four audits (ranked):
  1. <one line>
  2. <one line>
  3. <one line>

Next: <single command>
```

## What `/aipe:audit` does NOT do

  → Does not merge the four artifacts into one file. Each generator writes to its own path; the orchestrator only summarizes.
  → Does not act on findings. Audit is read-only.
  → Does not stop short on the frontend-a11y "no frontend surface" case — that's an honest emit, not an error.
  → Does not retry on hard error. If any generator fails (missing context, unreadable repo), report and stop — partial results are misleading.

Each generator also runs standalone: `/aipe:audit-status`, `/aipe:audit-cleanup`, `/aipe:audit-frontend-a11y`, `/aipe:audit-refactor`.

**Stop. Wait for the user's next instruction.**
