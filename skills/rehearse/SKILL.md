---
description: Rehearse orchestrator — runs both rehearsal-book generators (interview defense + hackathon demo) in one pass, single confirmation gate
---

The user invoked `/aipe:rehearse`.

This command takes **no arguments** (other than the optional slot length for the demo book — see Step 5). It is the **orchestrator** for the rehearse family: it does not generate any book content of its own — it runs each of the two rehearse generators in the right mode (create or update) and reports what changed.

Use this command when you are **preparing to present or interview** and want both rehearsal books reconciled with the current codebase in one pass. Use the individual commands when you only need one book:

- `/aipe:rehearse-interview-defense` — the 8-chapter project defense book (coach voice, "I don't know" recovery)
- `/aipe:rehearse-hackathon-demo` — the overview + 6-chapter demo run-of-show (demo-coach voice, hard time budget)

**`/aipe:rehearse` is the performance-side sibling of `/aipe:study`.** Where `/aipe:study` keeps your *comprehension* guides current after a code change, `/aipe:rehearse` prepares your *performance* books when you're about to stand in front of a room. Run study on every nontrivial code change; run rehearse when you're prepping for a presentation or interview.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does NOT exist in the current working directory:

1. Create `.aipe/project/` and `.aipe/specs/` directories.
2. Write `.aipe/project/context.md` with this placeholder body:

   ```
   # Project context

   Describe this codebase so an AI agent can implement against it without asking.

   ## Stack
   - runtime, framework, language

   ## Data model
   - entities, relationships, where they live

   ## File structure
   - top-level folders and what lives where

   ## What must not change
   - public API surface, schema fields, ...
   ```

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:rehearse.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)

## Step 3 — Resolve all the inputs each generator needs

The orchestrator reads every input once and hands it to both generators. Resolve these:

```
${CODEX_PLUGIN_ROOT}/specs/rehearse.md                    (this orchestrator spec)
${CODEX_PLUGIN_ROOT}/specs/format.md                      (structure — formatting + diagram + hard rules)
${CODEX_PLUGIN_ROOT}/specs/rehearse-interview-defense.md
${CODEX_PLUGIN_ROOT}/specs/rehearse-hackathon-demo.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md                     (writer persona, used in coach posture)
${CODEX_PLUGIN_ROOT}/specs/me.md                          (reader profile)
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

**`format.md` is the structural foundation for the whole study + rehearse family** — formatting rules, diagram quality standards, the "use real software, not analogies" rule, the no-hedging rule, hard rules. Both rehearse generators use their own inline per-chapter book templates (different from format.md's per-concept template), but the *quality standards* come from format.md. Read it once; pass it to both.

**Persona routing is uniform here**, unlike the study orchestrator. Both rehearse generators use `teacher.md` in **coach posture** — the same staff engineer, shifted from teaching a concept to preparing someone for performance under pressure. The interview-defense coach and the demo-coach are that one engineer in two framings.

## Step 4 — Detection pass (no writes)

For each generator, check whether its output folder already exists in this repo's `.aipe/` directory, and build a per-folder plan. Do not edit anything yet.

```
Generator                          Output folder                          Decision
─────────────────────────────────  ─────────────────────────────────────  ───────
rehearse-interview-defense.md      .aipe/rehearse-interview-defense/      CREATE or UPDATE
rehearse-hackathon-demo.md         .aipe/rehearse-hackathon-demo/         CREATE or UPDATE
```

A folder exists (UPDATE) when its generator's own "Check for existing book" signal is met:

- `rehearse-interview-defense/` — `00-overview.md` at root OR any `0[1-8]-*.md` file (legacy per-question structure also detected and flagged for migration)
- `rehearse-hackathon-demo/` — `00-overview.md` at root OR any `0[1-6]-*.md` file

For each UPDATE-mode generator, perform the diff its own spec defines (codebase drift, template drift, inventory drift) and build a per-file change list: what's outdated, what's missing, what action to take.

For each CREATE-mode generator, mark "full generate."

## Step 5 — Resolve the slot length for the demo book

The demo book scales every chapter's time budget to the real slot length. If the user supplied a slot length to the orchestrator (e.g., `/aipe:rehearse "5 min"`), pass that to `rehearse-hackathon-demo`. Otherwise default to 10 minutes.

In UPDATE mode, an existing demo book carries its own slot length; preserve it unless the user explicitly overrode it.

## Step 6 — Print the consolidated plan

Output one combined plan across both books:

```
REHEARSE RUN PLAN — <repo name> — <today's ISO date>

┌──────────────────────────────────┬──────────┬────────────────────────────┐
│ Book                             │ Mode     │ Preview                    │
├──────────────────────────────────┼──────────┼────────────────────────────┤
│ rehearse-interview-defense       │ <mode>   │ <full generate | N edits>  │
│ rehearse-hackathon-demo          │ <mode>   │ <full generate | N edits>  │
└──────────────────────────────────┴──────────┴────────────────────────────┘

Demo slot length: <N> minutes  [default | from $ARGUMENTS | from existing book]
```

Below the table, for each UPDATE-mode book, list the per-file changes (which files will be edited, what each edit does in one line). For each CREATE-mode book, list the chapter files that will be created.

## Step 7 — Single confirmation gate

**Wait for one confirmation** before editing any file. The two generators' "wait for confirmation before editing" contracts are batched into this single gate.

If the run is non-interactive (a `--yes`-style invocation or an automated context), skip the gate and execute the plan directly.

## Step 8 — Execute in run order

Run the generators in this order — independent for correctness, but the order produces a readable summary:

1. `rehearse-interview-defense`
2. `rehearse-hackathon-demo`

For each generator:

- **CREATE mode** — generate the full book per the generator's spec (every chapter file, the overview, the run sheets). The generator's standalone spec defines the exact procedure; follow it faithfully.
- **UPDATE mode** — apply only the section-level edits identified in Step 4. Never rewrite a whole chapter when a section edit will do. Append to each updated chapter:

  ```
  ---
  Updated: <today's ISO date> — <one-line summary of what changed and why>
  ```

  Update the overview's run-of-show / table of contents when a chapter's content materially changed.

The orchestrator emits no book content of its own — all content comes from the generator specs.

## Step 9 — The final report

After execution, print a summary table.

```
REHEARSE RUN SUMMARY — <repo name> — <today's ISO date>

┌──────────────────────────────────┬──────────┬────────────────────────────┐
│ Book                             │ Mode     │ Result                     │
├──────────────────────────────────┼──────────┼────────────────────────────┤
│ rehearse-interview-defense       │ <mode>   │ <e.g. 1 chapter edited>    │
│ rehearse-hackathon-demo          │ <mode>   │ <e.g. 7 files generated>   │
└──────────────────────────────────┴──────────┴────────────────────────────┘
```

Below the table, one section per book listing the specific files touched and a one-line reason for each.

**Stop. Wait for the user's next instruction.** Do NOT auto-act on findings.

---

## Scope and constraints

- **Per-repo.** The orchestrator runs against ONE repo — the directory the command was invoked in. It never reads or writes another repo. Every reference, file path, and code citation is about this repo only.
- **On-demand, not on every change.** Unlike `/aipe:study` (which you run to keep comprehension guides current after editing code), run `/aipe:rehearse` when you are preparing to present or interview. Rehearsal books are performance artifacts; refresh them when you're about to perform, not on every commit.
- **Both always run.** The orchestrator does not skip a generator. Each generator's own spec decides what to emit (the demo book demos only what the code actually does; the defense book drops questions it can't ground in the repo). Skipping is the generator's call, never the orchestrator's. To produce just one book, run that generator's single command instead.
- **Persona routing is uniform.** Both generators use `teacher.md` in COACH posture. This is the defining contrast with the study orchestrator, whose generators split across teacher posture, coach posture, and an inline persona.
- **Edits are surgical in UPDATE mode.** Never rewrite a whole chapter when a section-level edit will do. Preserve everything the codebase still supports; change only what the codebase changed.
- **No vaporware carries over from the demo spec.** The orchestrator never relaxes a generator's grounding rules — books present only what the repo verifiably does.
- **The orchestrator emits no content of its own.** It produces only the run plan, the confirmation gate, and the summary report.
