# Audit Orchestrator — the `/aipe:audit` command

One command that produces **all four** audit-family artifacts for the current repo in a single pass — a complete read on what's there, what's wrong, what's inaccessible, and what a staff engineer would say about it. Where `/aipe:study` builds comprehension and `/aipe:rehearse` prepares performance, `/aipe:audit` **takes stock**.

This orchestrator defines no content of its own. It reads `format.md`, `teacher.md`, `me.md`, the current repo, and the four generator specs; runs them sequentially under one confirmation gate; emits one consolidated summary.

## The five audit dimensions

```
  audit-status            WHAT IS — 8-section descriptive snapshot
                           (purely descriptive; no recommendations)
  audit-cleanup           WHAT'S WRONG — debt list with verdicts
                           (fix-now / fix-later / accept / cannot-clean)
  audit-frontend-a11y     WHAT'S INACCESSIBLE — frontend accessibility read
                           (describe-only; "no frontend surface" if N/A)
  audit-refactor          WHAT A STAFF ENGINEER WOULD SAY — opinion book
                           (six-chapter notebook, not a task list)
  study-software-design   WHAT THE DESIGN SHAPE IS — AOSD primitives
                           applied to the repo (audit.md + Pass-2 pattern
                           files; teaches the named principle being
                           violated, complementary to audit-cleanup's
                           Lens 2). Borrowed from the study family.
```

## Generators

  1. `audit-status` — descriptive 8-section snapshot (was `/aipe:audit` before v1.61.0)
  2. `audit-cleanup` — four-lens debt triage with `fix-now / fix-later / accept / cannot-clean` verdicts
  3. `audit-frontend-a11y` — accessibility audit (describe what's there; emit `no frontend surface` when the repo has no frontend code)
  4. `audit-refactor` — six-chapter staff-engineer refactor notebook (opinions, not tasks)
  5. `study-software-design` — APOSD audit (8-lens + Pass-2 pattern files). Borrowed from the study family; included so taking stock also produces the comprehension half of the architectural picture that `audit-cleanup` Lens 2 triages.

```
/aipe:audit
  reads format.md + teacher.md + me.md + repo
  runs sequentially:
    audit-status          →  .aipe/audits/snapshot-<date>.md
    audit-cleanup         →  .aipe/audits/cleanup-<date>.md
    audit-frontend-a11y   →  .aipe/audits/a11y-<date>.md
    audit-refactor        →  .aipe/audit-refactor-<purpose>/  (book, not single file)
    study-software-design →  .aipe/study-software-design/      (audit.md + Pass-2)
```

## Inputs and persona routing

Read `format.md` once for shared formatting and hard rules, `teacher.md` in teacher posture, `me.md`, the current repo, and all five generator specs. Each generator inherits the same staff-engineer voice; `audit-refactor` adds the additional book-style framing defined in its own spec. `study-software-design` is borrowed from the study family; its own spec defines the audit-style two-pass output shape it produces.

## Run order

Sequential, in the numbered order above:

  1. **`audit-status` first.** The descriptive snapshot is cheap and grounds everything else — debt findings, a11y findings, refactor opinions, and software-design findings all reference what `audit-status` named.
  2. **`audit-cleanup` second.** Once the snapshot exists, the debt triage cites it.
  3. **`audit-frontend-a11y` third.** Independent of the first two; runs only if the repo has a frontend surface (emits `no frontend surface` and stops early otherwise).
  4. **`audit-refactor` fourth.** Heavier artifact; benefits from the prior three being in place so it can cross-reference rather than re-discover.
  5. **`study-software-design` last.** Produces the comprehension half of the architectural picture (named AOSD primitives) that `audit-cleanup` Lens 2 triages. Reads cleanup-`<date>.md` for cross-link material if present.

The five artifacts are independent at the file system level and must not rewrite one another's output.

## Detection pass and single confirmation gate

`audit-status`, `audit-cleanup`, and `audit-frontend-a11y` are **dated** — each run writes a NEW timestamped file at `.aipe/audits/<kind>-<date>.md` (never overwrites). `audit-refactor` writes a per-purpose book folder; reusing a purpose updates that folder in place. `study-software-design` writes to `.aipe/study-software-design/` — CREATE if absent, UPDATE if present (per the audit-style two-pass rules in `me.md` → AUDIT-STYLE GENERATORS).

Print one consolidated plan covering all five (with the planned filenames / folder paths) and wait for one confirmation before executing. In non-interactive execution, print the plan and continue.

## Execution contract

  → **Run each generator per its own spec.** The orchestrator does not redefine output shape — the five generator specs are the contract.
  → **Honesty.** Use the repo and supplied project context; do not invent users, decisions, metrics, or code.
  → **Isolation.** Each generator writes only to its own output path. The orchestrator does not merge artifacts.
  → **Frontend short-circuit.** If `audit-frontend-a11y` detects no frontend surface, it emits `no frontend surface` and the orchestrator continues to the next generator.
  → **Stop on hard error.** If any generator fails (missing context, unreadable repo), report the failure and stop — partial results are misleading.

## Final report

Print one row per generator with the output path and a one-line headline. Then a consolidated `Top concerns across the five audits` block — pulling the worst items from cleanup's `fix-now`, a11y's blocking issues, refactor's chapter 1 (the load-bearing finding), and software-design's `red-flags-audit` lens into a single ranked list. End with the single next action.

```
✓ Audit run complete
  audit-status:           .aipe/audits/snapshot-<date>.md
                          (8-section snapshot; <N> features, <N> deferred items)
  audit-cleanup:          .aipe/audits/cleanup-<date>.md
                          (<N> findings; <N> fix-now)
  audit-frontend-a11y:    .aipe/audits/a11y-<date>.md
                          (<N> findings, or "no frontend surface")
  audit-refactor:         .aipe/audit-refactor-<purpose>/
                          (six chapters; load-bearing finding: <one line>)
  study-software-design:  .aipe/study-software-design/
                          (8-lens audit + <N> Pass-2 pattern files;
                           red-flags-audit: <N> firing)

Top concerns across the five audits (ranked):
  1. <one line>
  2. <one line>
  3. <one line>

Next: <single command>
```

## Relationship to the other orchestrators

```
  /aipe:study      → comprehension (16 generators; long-lived per-repo guides)
  /aipe:rehearse   → performance (4 books for problem selection, design,
                                  demo, defense)
  /aipe:ready      → readiness (2-stage pipeline: recon → drill)
  /aipe:audit      → take stock (5 generators; describe what is, what's
                                 wrong, what's inaccessible, what an
                                 engineer would say, what design
                                 principles are violated)        ← this
```

Note: `study-software-design` is invoked by both `/aipe:study` and `/aipe:audit`. The study run produces it among 15 sibling comprehension guides; the audit run produces it alongside the four action-oriented dimensions so the design-shape coverage shows up at take-stock time too. Either invocation produces the same artifact at `.aipe/study-software-design/` — re-running graduates it from CREATE to UPDATE.

Each generator also runs standalone: `/aipe:audit-status`, `/aipe:audit-cleanup`, `/aipe:audit-frontend-a11y`, `/aipe:audit-refactor` — for when only one dimension changed.
