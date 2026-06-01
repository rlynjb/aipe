# Study Orchestrator — the `/aipe:study` command

One command that creates or updates **every** study guide for the
current repo. Run it after you change your codebase and want all of
your study guides to catch up — without running each `/aipe:study-*`
command by hand.

This file is the orchestrator. It does not define any concept
template, voice, or topic content of its own. It reads the five
generator specs, the two persona specs, and the current repo, then
runs each generator in the right mode (create or update) and reports
what changed.

This is the comprehension-side orchestrator. Its performance-side
sibling, `/aipe:rehearse`, composes the `rehearse-*` books
(interview defense, hackathon demo); those are not run here.

```
THE PROBLEM THIS SOLVES

  before                              after
  ──────────────────────────────     ──────────────────────────────
  edit codebase                       edit codebase
  /aipe:study-system-design-dsa       /aipe:study   ← one command
  /aipe:study-software-design             │
  /aipe:study-ai-engineering              │
  /aipe:study-prompt-engineering          ▼
  /aipe:study-agent-architecture      detects create vs update
  (five runs, by hand, every time)    per guide, runs them all,
                                      reports a single summary
```

---

## What it does, in one diagram

The orchestrator fans out to five generators, each producing one
fixed-name folder under the repo's `.aipe/` directory.

```
                       /aipe:study
                            │
            reads: format.md (structure),
                   teacher.md, me.md, the codebase,
                   the five generator specs,
                   and any curriculum files present
                            │
                            ▼   fans out, one folder each
                            │
   study-system-design-dsa.md   →  .aipe/study-system-design-dsa/
   study-software-design.md     →  .aipe/study-software-design/
   study-ai-engineering.md      →  .aipe/study-ai-engineering/
   study-prompt-engineering.md  →  .aipe/study-prompt-engineering/
   study-agent-architecture.md  →  .aipe/study-agent-architecture/
                            │
                            ▼
            each folder: create if missing,
            update-in-place if it already exists
```

---

## The generators it runs

All five run against the **current repo** — the directory the command
was invoked in. Each is per-repo and per-folder; there is no
cross-repo coordination. The orchestrator runs every generator on
every invocation, regardless of whether the repo currently exercises
that topic (a repo with no AI features still gets a
`study-ai-engineering/` guide whose files honestly say "not yet
implemented" — that behavior is defined in the generator spec, not
here).

```
┌──────────────────────────────┬──────────────────────────────────┐
│ Generator spec               │ Output folder (under .aipe/)     │
├──────────────────────────────┼──────────────────────────────────┤
│ study-system-design-dsa.md   │ study-system-design-dsa/         │
│ study-software-design.md     │ study-software-design/           │
│ study-ai-engineering.md      │ study-ai-engineering/            │
│ study-prompt-engineering.md  │ study-prompt-engineering/        │
│ study-agent-architecture.md  │ study-agent-architecture/        │
└──────────────────────────────┴──────────────────────────────────┘
```

### What each generator needs as input

`format.md` is the structural foundation for the whole family
(per-concept-file template, the house-style traits, formatting
rules, diagram requirements, hard rules). Every generator reads
it for structure even though each generates a different topic.
Read it once; pass it to all five. `study-system-design-dsa.md`
is no longer special as a structure source — it is now just the
system-design + DSA *topic* generator, and it reads `format.md`
for structure like the others.

  → **study-system-design-dsa.md** — reads `format.md`
    (structure), `teacher.md` (teacher posture), `me.md`, the
    codebase. Output: system overview, system design, DSA.

  → **study-software-design.md** — reads `format.md`
    (structure), `teacher.md` (teacher posture), `me.md`, the
    codebase. Audits the repo through *A Philosophy of Software
    Design*'s primitives (deep modules, information hiding,
    complexity, layering, readability). Output: the 8 design-
    audit concept files, findings grounded in real files +
    a red-flags checklist. Code-level design only — distinct
    from system-design-dsa's architecture/DSA altitude.

  → **study-ai-engineering.md** — reads `format.md`
    (structure), `teacher.md` (teacher posture), `me.md`,
    `aieng-curriculum.md` if present (for `Cx.y` / `Bx.y` IDs), the
    codebase. Output: LLM foundations, retrieval/RAG, agents, evals,
    production serving, ML.

  → **study-prompt-engineering.md** — reads
    `format.md` (structure), `me.md`,
    `aieng-curriculum.md` if present, the codebase. Persona is
    defined **inline in that spec** (working AI engineer) — it does
    **not** use `teacher.md`'s staff-engineer persona. Output: the 13
    prompt-engineering concepts.

  → **study-agent-architecture.md** — reads
    `format.md` (structure), `teacher.md` (teacher
    posture), `me.md`, the codebase. Output: reasoning patterns,
    agentic retrieval, multi-agent orchestration, agent
    infrastructure, production serving, orchestration templates.

The performance books — `rehearse-interview-defense.md` and
`rehearse-hackathon-demo.md` — are **not** run here. They belong to
the `/aipe:rehearse` orchestrator (coach posture). See that file.

If a curriculum file (`aieng-curriculum.md`) is not present, the
generators that reference it degrade gracefully — they anchor
exercises to the codebase only and skip curriculum-ID provenance.
Do not block a run on a missing curriculum file.

---

## Run order

The five generators are independent — none reads another's output, so
order does not affect correctness. Run them in this order for a
readable progression and a sensible summary:

```
1. study-system-design-dsa   (also the structure source the rest read)
2. study-software-design      (paired with system-design — same posture)
3. study-ai-engineering
4. study-prompt-engineering
5. study-agent-architecture
```

Reading `format.md` first is required regardless of run order,
because every generator needs it for structure. Reading the
*file* is the dependency — `study-system-design-dsa.md` no
longer needs to run first, since structure now lives in
`format.md`, not in the DSA topic spec.

---

## Create vs update — the per-folder decision

For each generator, before generating anything, check whether its
output folder already exists in the repo's `.aipe/` directory. This
is the same per-folder check each generator already defines in its
own "Check for existing guide" section; the orchestrator applies it
uniformly across all five.

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

Generate the full guide for that topic from scratch, following the
generator's spec exactly — the full directory structure, every
concept/chapter file, every README index.

### UPDATE mode (folder exists)

Do not regenerate from scratch. Reconcile the existing guide against
the current codebase:

```
→ Read every existing file in the guide's subdirectories
→ Diff each against the current codebase context
→ Build a per-file change list:
     Outdated:  facts that no longer match the code
     Missing:   patterns now in the code but not in the guide
     Stale ref: file paths / line ranges / versions that moved
     Action:    the specific edit to make
→ Edit ONLY the sections identified — never rewrite whole files
→ Add new files when the codebase has new patterns
→ Remove or mark files whose pattern left the codebase
→ Update each affected README.md index if files were added/removed
→ Append to each updated file:
     ---
     Updated: [date] — [one-line summary of what changed]
```

A guide that is already current produces no edits — UPDATE mode is a
no-op when the code and the guide already agree. That is the expected
outcome for guides whose topic you didn't touch this round.

---

## Confirmation — one gate for the whole run

The base generator's update behavior says "wait for confirmation
before editing." Running five generators, that would mean five
prompts. Instead, the orchestrator batches it into a single gate:

```
1. Run every generator in detection-only pass:
     CREATE-mode guides → list as "will create (full)"
     UPDATE-mode guides → produce the per-file change list
2. Print one consolidated plan across all five guides
3. Wait for a single confirmation
4. On confirm → execute every create and every edit
```

This keeps the safety of the per-generator "confirm before editing"
contract while only asking once. If the run is non-interactive (a
`--yes`-style invocation or an automated context), skip the gate and
execute the plan directly.

---

## The final report

After execution, print one summary table so you can see at a glance
what the run did to each guide.

```
STUDY RUN SUMMARY — <repo name> — <date>

┌──────────────────────────────┬──────────┬────────────────────────┐
│ Guide                        │ Mode     │ Result                 │
├──────────────────────────────┼──────────┼────────────────────────┤
│ study-system-design-dsa      │ update   │ 2 files edited, 1 added│
│ study-software-design        │ create   │ 8 files generated      │
│ study-ai-engineering         │ update   │ no change (current)    │
│ study-prompt-engineering     │ create   │ 13 files generated     │
│ study-agent-architecture     │ create   │ full guide generated   │
└──────────────────────────────┴──────────┴────────────────────────┘

Per-guide detail follows below, one section each, listing the
specific files touched and the one-line reason for each.
```

---

## Scope and constraints

```
→ Per-repo. The orchestrator runs against ONE repo — the directory
   the command was invoked in. It never reads or writes another
   repo. Every "In this codebase" reference, file path, and code
   citation is about this repo only.

→ All five always run. The orchestrator does not skip a generator
   because the repo "doesn't do that topic." The generator's own spec
   decides what to emit for a topic the codebase doesn't exercise
   (honest "not yet implemented" files, system-design templates as
   buildable targets, etc.). Skipping is the generator's call, never
   the orchestrator's.

→ Structure source is read once. format.md is the structural
   foundation for the whole family. Read it once and hand it to
   all five generators; do not re-derive structure per generator.
   (study-system-design-dsa.md is now a topic generator like the
   others, not the structure source.)

→ Persona routing is not uniform. Four generators use teacher.md in
   TEACHER posture (system-design-dsa, software-design, ai-engineering,
   agent-architecture). study-prompt-engineering uses its OWN inline
   persona and must NOT be given teacher.md's persona. (No generator here
   uses coach posture — that lives in the rehearse orchestrator.) Respect
   each generator spec's persona declaration.

→ Edits are surgical in UPDATE mode. Never rewrite a whole file when
   a section-level edit will do. Preserve everything the codebase
   still supports; change only what the codebase changed.

→ Curriculum files are optional inputs. Read aieng-curriculum.md (and
   any future curriculum file) when present; degrade gracefully when
   absent. Never block a run on a missing curriculum file.

→ The orchestrator emits no concept content of its own. It produces
   only the run plan, the confirmation gate, and the summary report.
   All guide content comes from the generator specs.
```

---

## How the run executes — step by step

```
1. Resolve inputs
     read format.md (structure — the concept-file template + rules)
     read teacher.md, me.md
     read aieng-curriculum.md if present
     read the five generator specs (incl. study-system-design-dsa.md
       for the system-design + DSA topic)
     read the current repo's codebase context

2. Detection pass (no writes)
     for each generator:
       check .aipe/<folder>/ → CREATE or UPDATE
       UPDATE → diff existing files vs codebase, build change list
       CREATE → mark "full generate"

3. Plan
     print the consolidated plan (all five guides, one view)

4. Confirm (single gate; skipped if non-interactive)

5. Execute
     run each generator in its detected mode, in run order
     CREATE → full generate per the generator's spec
     UPDATE → apply only the identified section edits,
              append the "Updated:" line, fix README indexes

6. Report
     print the STUDY RUN SUMMARY table + per-guide detail
```

---

## Running a single generator instead

The orchestrator does not replace the individual commands — it
composes them. Each `/aipe:study-*` command still runs its one
generator standalone, with the same create-or-update detection. Reach
for a single command when you changed only one slice of the codebase
and want only that guide refreshed. Reach for `/aipe:study` when you
want everything reconciled in one pass — the default after any
nontrivial codebase change.
