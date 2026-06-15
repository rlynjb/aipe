---
description: [orchestrator] Audit orchestrator — runs audit-status, audit-cleanup, audit-frontend-a11y, audit-refactor, and audit-software-design under one confirmation gate
---

The user invoked `/aipe:audit`.

One command runs **all five** audit-family generators on the current repo in sequence under one confirmation gate, producing a complete read on what's there, what's wrong, what's inaccessible, what a staff engineer would say about it, and what design principles are violated.

```
/aipe:audit           → run all five generators in sequence
```

The orchestrator does not redefine output shape — each generator's own spec is the contract. `audit-software-design` is the action-shaped companion to `study-software-design` (same 8 AOSD lenses; produces refactor specs instead of teaching artifacts).

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/`, `.aipe/audits/`, and `.aipe/audits/refactors/`, write a short project-context placeholder (stack, data model, file structure, must-not-change constraints), print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:audit.`, and stop.

If `.aipe/project/context.md` exists, ensure `.aipe/audits/` and `.aipe/audits/refactors/` exist (mkdir if needed).

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
${CLAUDE_PLUGIN_ROOT}/specs/audit-software-design.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location.

## Step 4 — Plan the run (single confirmation gate)

Print one consolidated plan covering all five generators with the planned output paths:

```
  Plan
  ────
  audit-status           → .aipe/audits/snapshot-<YYYY-MM-DD>.md
  audit-cleanup          → .aipe/audits/cleanup-<YYYY-MM-DD>.md
                           + .aipe/audits/refactors/cleanup-*.md
                              (one per fix-now finding; template
                              chosen by finding shape:
                                logic       → cleanup-<name>.md
                                UI behavior → cleanup-frontend-<name>.md
                                CSS / HTML  → cleanup-visual-<name>.md)
  audit-frontend-a11y    → .aipe/audits/a11y-<YYYY-MM-DD>.md
                           (or skipped if no frontend surface)
  audit-refactor         → .aipe/audit-refactor-<purpose>/
                           (six-chapter book; reuses folder if purpose matches)
  audit-software-design  → .aipe/audits/design-<YYYY-MM-DD>.md
                           + .aipe/audits/refactors/design-*.md
                              (one per firing AOSD red flag; template
                              chosen by finding shape:
                                logic       → design-<name>.md
                                UI behavior → design-frontend-<name>.md
                                CSS / HTML  → design-visual-<name>.md)
```

Wait for one confirmation. In non-interactive execution, print the plan and continue. **One gate for all five** — no per-stage prompts.

## Step 5 — Execute audit-status

Run per `specs/audit-status.md`: produce the 8-section descriptive snapshot at `.aipe/audits/snapshot-<YYYY-MM-DD>.md`. Describe, don't act.

## Step 6 — Execute audit-cleanup

Run per `specs/audit-cleanup.md` (all 7 steps including the refactor-spec generation): four-lens debt triage (structural / architectural / DSA hot-paths / test debt). Every finding gets the four fields (Lens / Severity / Effort / Decision) plus the Refactor-shape line. Write the triaged list to `.aipe/audits/cleanup-<YYYY-MM-DD>.md`.

For each **fix-now** finding (Step 4-5 of audit-cleanup), also write a complete refactor spec to `.aipe/audits/refactors/cleanup-*.md`. Pick the template based on finding shape:

```
  logic only (no UI surface)               → refactor.md template
                                              path: cleanup-<name>.md
  UI behavior (state / effects / events)   → refactor-frontend-behaviour.md
                                              path: cleanup-frontend-<name>.md
  CSS / tokens / semantic HTML only        → refactor-frontend-visual.md
                                              path: cleanup-visual-<name>.md
```

Pick the **tightest applicable template**. Track the count by template type for the consolidated summary.

## Step 7 — Execute audit-frontend-a11y

Run per `specs/audit-frontend-a11y.md`. If the repo has no frontend surface, emit `no frontend surface` and skip to Step 8 — do not create an empty a11y file. Otherwise write to `.aipe/audits/a11y-<YYYY-MM-DD>.md`.

## Step 8 — Execute audit-refactor

Run per `specs/audit-refactor.md`: the six-chapter staff-engineer refactor notebook. Heavier artifact; writes to `.aipe/audit-refactor-<purpose>/` (a folder, not a single dated file).

## Step 9 — Execute audit-software-design

Run per `specs/audit-software-design.md`: walk the 8 AOSD lenses (same vocabulary as `study-software-design`), dedupe findings against the just-written `cleanup-<date>.md` (cross-link overlaps rather than producing duplicate specs), produce the dated audit summary at `.aipe/audits/design-<YYYY-MM-DD>.md`, and write per-finding refactor specs to `.aipe/audits/refactors/design-*.md`.

Template routing for the refactor specs (same logic as audit-cleanup Step 6):

```
  finding shape           template                             path
  ─────────────────────────────────────────────────────────────────────────────
  logic / module          refactor.md                          design-<name>.md
  UI behavior             refactor-frontend-behaviour.md       design-frontend-<name>.md
  CSS / tokens / HTML     refactor-frontend-visual.md          design-visual-<name>.md
```

Pick the **tightest applicable template**. A finding earns a spec only if the fix is behaviour-preserving + specific + localized; otherwise document it in the audit summary without a spec.

## Step 10 — Consolidated summary

Print one row per generator with the output path and a one-line headline, then a `Top concerns across the five audits` block ranking the worst items from cleanup's `fix-now`, a11y's blocking issues, refactor's chapter 1, and software-design's red-flags-audit lens into a single ranked list. End with the single next action.

```
✓ Audit run complete
  audit-status:           .aipe/audits/snapshot-<date>.md
                          (8-section snapshot; <N> features, <N> deferred items)
  audit-cleanup:          .aipe/audits/cleanup-<date>.md
                          (<N> findings; <N> fix-now)
                          + .aipe/audits/refactors/cleanup-*.md
                          (<N> total: <N> general, <N> frontend, <N> visual)
  audit-frontend-a11y:    .aipe/audits/a11y-<date>.md
                          (or "no frontend surface")
  audit-refactor:         .aipe/audit-refactor-<purpose>/
                          (six chapters; load-bearing finding: <one line>)
  audit-software-design:  .aipe/audits/design-<date>.md
                          + .aipe/audits/refactors/design-*.md
                          (<N> firing flags; <N> refactor specs:
                           <N> general, <N> frontend, <N> visual)

Top concerns across the five audits (ranked):
  1. <one line>
  2. <one line>
  3. <one line>

Next: <single command>
```

## What `/aipe:audit` does NOT do

  → Does not merge the five artifacts into one file. Each generator writes to its own path; the orchestrator only summarizes.
  → Does not act on findings. Audit is read-only.
  → Does not stop short on the frontend-a11y "no frontend surface" case — that's an honest emit, not an error.
  → Does not retry on hard error. If any generator fails (missing context, unreadable repo), report and stop — partial results are misleading.
  → Does not duplicate audit-cleanup's refactor specs. audit-software-design dedupes against the just-written `cleanup-<date>.md` and cross-links overlapping findings rather than producing a second `design-*.md` spec for the same fix.

Each generator also runs standalone: `/aipe:audit-status`, `/aipe:audit-cleanup`, `/aipe:audit-frontend-a11y`, `/aipe:audit-refactor`, `/aipe:audit-software-design`.

**Stop. Wait for the user's next instruction.**
