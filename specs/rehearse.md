# Rehearse Orchestrator — the `/aipe:rehearse` command

One command that creates or updates **every** rehearsal book for the
current repo — the performance artifacts you read *out loud*, not the
study guides you read to *understand*. Run it when you're preparing to
present or interview and want both rehearsal books current with the
codebase in one pass — without running each `/aipe:rehearse-*` command
by hand.

This file is the orchestrator. It does not define any chapter
template, voice, or content of its own. It reads the two rehearse
generator specs, the foundation references, and the current repo, then
runs each generator in the right mode (create or update) and reports
what changed.

It is the performance-side sibling of `study.md`. Where `/aipe:study`
keeps your *comprehension* guides current after a code change,
`/aipe:rehearse` prepares your *performance* books when you're about
to stand in front of a room.

```
THE PROBLEM THIS SOLVES

  before                              after
  ──────────────────────────────     ──────────────────────────────
  about to present / interview        about to present / interview
  /aipe:rehearse-interview-defense    /aipe:rehearse   ← one command
  /aipe:rehearse-hackathon-demo            │
  (two runs, by hand, every time)          ▼
                                      detects create vs update
                                      per book, runs them all,
                                      reports a single summary
```

---

## What it does, in one diagram

The orchestrator fans out to two generators, each producing one
fixed-name folder under the repo's `.aipe/` directory.

```
                       /aipe:rehearse
                             │
             reads: format.md (structure),
                    teacher.md (coach posture), me.md,
                    the codebase
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   ┌──────────────────┐            ┌──────────────────┐
   │ interview-       │            │ hackathon-       │
   │ defense          │            │ demo             │
   └────────┬─────────┘            └────────┬─────────┘
            ▼                               ▼
   .aipe/                          .aipe/
   rehearse-                       rehearse-
   interview-defense/              hackathon-demo/
            │                               │
            └───────────────┬───────────────┘
                            ▼
              each folder: create if missing,
              update-in-place if it already exists
```

---

## The generators it runs

Both run against the **current repo** — the directory the command was
invoked in. Each is per-repo and per-folder; there is no cross-repo
coordination. The orchestrator runs both generators on every
invocation; each generator's own spec decides what to emit for a
codebase (e.g. demoing only what actually runs).

```
┌──────────────────────────────┬──────────────────────────────────┐
│ Generator spec               │ Output folder (under .aipe/)     │
├──────────────────────────────┼──────────────────────────────────┤
│ rehearse-interview-defense.md │ rehearse-interview-defense/      │
│ rehearse-hackathon-demo.md    │ rehearse-hackathon-demo/         │
└──────────────────────────────┴──────────────────────────────────┘
```

### What each generator needs as input

`format.md` is the structural foundation for the whole family
(formatting rules, diagram requirements, the no-analogy rule, the
no-hedging rule, hard rules). Every generator reads it for structure.
Read it once; hand it to both.

Unlike the study orchestrator, **persona routing here is uniform**:
both rehearse generators use `teacher.md` in **coach posture** — the
same staff engineer, shifted to prepare someone for performance under
pressure. The interview-defense coach and the demo-coach are that one
engineer in two framings.

  → **rehearse-interview-defense.md** — reads `format.md` (structure),
    `teacher.md` (coach posture), `me.md`, the codebase. Output: the
    8-chapter project-defense book.

  → **rehearse-hackathon-demo.md** — reads `format.md` (structure),
    `teacher.md` (coach posture, demo-coach framing), `me.md`, the
    codebase, and the target slot length (default 10 minutes). Output:
    the overview + 6-chapter demo run-of-show.

If the target slot length isn't supplied for the demo book, default to
ten minutes and scale every time budget to it. Do not block a run on a
missing slot length.

---

## Run order

The two generators are independent — neither reads the other's output,
so order does not affect correctness. Run them in this order for a
readable summary:

```
1. rehearse-interview-defense
2. rehearse-hackathon-demo
```

Reading `format.md` first is required regardless of run order, because
both generators need it for structure.

---

## Create vs update — the per-folder decision

For each generator, before generating anything, check whether its
output folder already exists in the repo's `.aipe/` directory. This is
the same per-folder check each generator defines in its own "Check for
existing guide" section; the orchestrator applies it uniformly across
both.

```
For each generator G with output folder F:

   does .aipe/F/ exist?
        │
   ┌────┴─────┐
   ▼          ▼
  NO         YES
   │          │
   ▼          ▼
 CREATE     UPDATE
 mode       mode
```

### CREATE mode (folder missing)

Generate the full book from scratch, following the generator's spec
exactly — the overview plus every chapter file.

### UPDATE mode (folder exists)

Do not regenerate from scratch. Reconcile the existing book against
the current codebase:

```
→ Read every existing chapter file in the book
→ Diff each against the current codebase context
→ Build a per-file change list:
     Outdated:  facts / features that no longer match the code
     Missing:   demoable features or defenses now in the code
                but not in the book
     Stale ref: file paths / versions that moved
     Action:    the specific edit to make
→ Edit ONLY the sections identified — never rewrite whole chapters
→ Add chapters only if the book's contract allows (it does not —
   both books have a fixed chapter count; reconcile within it)
→ Update the overview's run-of-show / table of contents if a
   chapter's content materially changed
→ Append to each updated file:
     ---
     Updated: [date] — [one-line summary of what changed]
```

A book that is already current produces no edits — UPDATE mode is a
no-op when the code and the book already agree.

---

## Confirmation — one gate for the whole run

Each generator's update behavior says "wait for confirmation before
editing." Running two generators, that would mean two prompts. The
orchestrator batches it into a single gate:

```
1. Run both generators in detection-only pass:
     CREATE-mode books → list as "will create (full)"
     UPDATE-mode books → produce the per-file change list
2. Print one consolidated plan across both books
3. Wait for a single confirmation
4. On confirm → execute every create and every edit
```

If the run is non-interactive (a `--yes`-style invocation or an
automated context), skip the gate and execute the plan directly.

---

## The final report

After execution, print one summary table.

```
REHEARSE RUN SUMMARY — <repo name> — <date>

┌──────────────────────────────┬──────────┬────────────────────────┐
│ Book                         │ Mode     │ Result                 │
├──────────────────────────────┼──────────┼────────────────────────┤
│ rehearse-interview-defense   │ update   │ 1 chapter edited       │
│ rehearse-hackathon-demo      │ create   │ 7 files generated      │
└──────────────────────────────┴──────────┴────────────────────────┘

Per-book detail follows below, one section each, listing the specific
files touched and the one-line reason for each.
```

---

## Scope and constraints

```
→ Per-repo. The orchestrator runs against ONE repo — the directory
   the command was invoked in. It never reads or writes another repo.
   Every reference, file path, and code citation is about this repo
   only.

→ On-demand, not on every change. Unlike `/aipe:study` (which you run
   to keep comprehension guides current after editing code), run
   `/aipe:rehearse` when you are preparing to present or interview.
   Rehearsal books are performance artifacts; you refresh them when
   you're about to perform, not on every commit.

→ Both always run. The orchestrator does not skip a generator. Each
   generator's own spec decides what to emit (the demo book demos only
   what the code actually does; the defense book drops questions it
   can't ground in the repo). Skipping is the generator's call, never
   the orchestrator's. To produce just one book, run that generator's
   single command instead.

→ Persona routing is uniform. Both generators use `teacher.md` in
   COACH posture. This is the defining contrast with the study
   orchestrator, whose generators split across teacher posture, coach
   posture, and an inline persona.

→ Edits are surgical in UPDATE mode. Never rewrite a whole chapter
   when a section-level edit will do. Preserve everything the codebase
   still supports; change only what the codebase changed.

→ No vaporware carries over from the demo spec. The orchestrator never
   relaxes a generator's grounding rules — books present only what the
   repo verifiably does.

→ The orchestrator emits no content of its own. It produces only the
   run plan, the confirmation gate, and the summary report. All book
   content comes from the generator specs.
```

---

## How the run executes — step by step

```
1. Resolve inputs
     read format.md (structure — formatting, diagrams, hard rules)
     read teacher.md (coach posture), me.md
     read the two rehearse generator specs
     read the current repo's codebase context
     note the target slot length for the demo book (default 10 min)

2. Detection pass (no writes)
     for each generator:
       check .aipe/<folder>/ → CREATE or UPDATE
       UPDATE → diff existing files vs codebase, build change list
       CREATE → mark "full generate"

3. Plan
     print the consolidated plan (both books, one view)

4. Confirm (single gate; skipped if non-interactive)

5. Execute
     run each generator in its detected mode, in run order
     CREATE → full generate per the generator's spec
     UPDATE → apply only the identified section edits,
              append the "Updated:" line, fix the overview index

6. Report
     print the REHEARSE RUN SUMMARY table + per-book detail
```

---

## Running a single generator instead

The orchestrator does not replace the individual commands — it
composes them. Each `/aipe:rehearse-*` command still runs its one
generator standalone, with the same create-or-update detection. Reach
for a single command when you only need one book (just the demo for a
hackathon, just the defense for an interview). Reach for
`/aipe:rehearse` when you're prepping for both at once.

---

## Relationship to `/aipe:study`

The family has two orchestrators, cleanly partitioned by what they
produce:

```
/aipe:study      runs the four study-* generators
                 → comprehension guides (understand the codebase)
                 → run after a code change, to keep guides current

/aipe:rehearse   runs the two rehearse-* generators
                 → performance books (present / defend the codebase)
                 → run when preparing to present or interview
```

No overlap: a spec belongs to exactly one orchestrator. Both
orchestrators read the same foundation (`format.md`, `teacher.md`,
`me.md`) — they differ only in which generators they compose and when
you reach for them.
