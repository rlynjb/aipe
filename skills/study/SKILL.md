---
description: Study orchestrator — run all four study generators in one pass, with a single confirmation gate and a consolidated summary
---

The user invoked `/aipe:study`.

This command takes **no arguments**. It is the **orchestrator**: it does not generate any concept content of its own — it runs each of the four study generators in the right mode (create or update) and reports what changed. Use this command after a nontrivial codebase change when you want every study guide reconciled in one pass.

If you changed only one slice of the codebase and want only that guide refreshed, reach for the matching standalone command instead:

- `/aipe:study-system-design-dsa` — system design + DSA
- `/aipe:study-ai-engineering` — LLM foundations, retrieval, agents, evals, production serving, ML
- `/aipe:study-prompt-engineering` — the 13 prompt engineering concepts (working AI engineer voice)
- `/aipe:study-agent-architecture` — reasoning patterns, agentic retrieval, multi-agent orchestration

The performance-side books (interview defense, hackathon demo) have moved to a sibling family. Use `/aipe:rehearse` (the rehearse orchestrator) for both, or `/aipe:rehearse-interview-defense` / `/aipe:rehearse-hackathon-demo` for one at a time. `/aipe:study` keeps your *comprehension* guides current; `/aipe:rehearse` prepares the *performance* books.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `.aipe/project/aieng-curriculum.md` or `.aipe/project/curriculum.md` (optional — read once and pass to the AI-engineering and prompt-engineering generators when present; degrade gracefully when absent — never block a run on a missing curriculum file)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)
- `~/.config/aipe/global/aieng-curriculum.md` or `~/.config/aipe/global/curriculum.md` (optional)

## Step 3 — Resolve all the inputs each generator needs

The orchestrator reads every input once and hands it to the generators. Resolve these:

```
${CODEX_PLUGIN_ROOT}/specs/study.md                       (this orchestrator spec)
${CODEX_PLUGIN_ROOT}/specs/format.md                      (structure — concept-file template + rules)
${CODEX_PLUGIN_ROOT}/specs/study-system-design-dsa.md     (system-design + DSA topic)
${CODEX_PLUGIN_ROOT}/specs/study-ai-engineering.md
${CODEX_PLUGIN_ROOT}/specs/study-prompt-engineering.md
${CODEX_PLUGIN_ROOT}/specs/study-agent-architecture.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md                     (writer persona)
${CODEX_PLUGIN_ROOT}/specs/me.md                          (reader profile)
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

**`format.md` is the structural foundation for the whole family** — the per-concept-file template, the house-style traits, formatting rules, diagram rules, pseudocode rules, hard rules. Every generator reads it for structure even though each generates a different topic. Read it once; pass it to all four. (`study-system-design-dsa.md` is no longer special as a structure source — it is now just the system-design + DSA topic generator, reading `format.md` for structure like the others. The legacy template sections still in its body are superseded; `format.md` wins.)

**Per format.md, the concept-file template is:** Subtitle → Zoom out, then zoom in → How it works → Primary diagram → Implementation in codebase → Elaborate → Project exercises (AI/ML only) → Interview defense → Validate → See also. **Removed from older templates: Why care (replaced by Zoom out), Tradeoffs, Tech reference, Summary.**

**Persona routing is not uniform:**
- Three generators use `teacher.md` in **teacher posture** — `study-system-design-dsa`, `study-ai-engineering`, and `study-agent-architecture`.
- `study-prompt-engineering` uses its own **inline persona** (working AI engineer) and must NOT be given `teacher.md`'s persona to apply. (It still reads `teacher.md` only to honor its "WHEN NOT TO USE THIS PERSONA" exclusion.)
- The coach-posture generators (interview defense, hackathon demo) belong to the rehearse orchestrator now and are NOT run here.

Respect each generator spec's persona declaration.

## Step 4 — Detection pass (no writes)

For each generator, check whether its output folder already exists in this repo's `.aipe/` directory, and build a per-folder plan. Do not edit anything yet.

```
Generator                       Output folder                       Decision
─────────────────────────────   ─────────────────────────────────   ───────
study-system-design-dsa.md      .aipe/study-system-design-dsa/      CREATE or UPDATE
study-ai-engineering.md         .aipe/study-ai-engineering/         CREATE or UPDATE
study-prompt-engineering.md     .aipe/study-prompt-engineering/     CREATE or UPDATE
study-agent-architecture.md     .aipe/study-agent-architecture/     CREATE or UPDATE
```

A folder exists (UPDATE) when its generator's own "Check for existing guide" signal is met. Apply each generator's signal uniformly here:

- `study-system-design-dsa/` — `00-overview.md` at root OR any file in `01-system-design/` / `02-dsa/`
- `study-ai-engineering/` — `00-overview.md` at root OR any file in `01-llm-foundations/` … `09-ml-system-design-templates/`
- `study-prompt-engineering/` — `00-overview.md` at root OR any `[0-9][0-9]-*.md` file
- `study-agent-architecture/` — `00-overview.md` at root OR any file in `01-reasoning-patterns/` … `06-orchestration-system-design-templates/`

For each UPDATE-mode generator, perform the diff its own spec defines (codebase drift, template drift, inventory drift) and build a per-file change list: what's outdated, what's missing, what action to take.

For each CREATE-mode generator, mark "full generate."

## Step 5 — Print the consolidated plan

Output one combined plan across all four guides:

```
STUDY RUN PLAN — <repo name> — <today's ISO date>

┌──────────────────────────────┬──────────┬────────────────────────────┐
│ Guide                        │ Mode     │ Preview                    │
├──────────────────────────────┼──────────┼────────────────────────────┤
│ study-system-design-dsa      │ <mode>   │ <full generate | N edits>  │
│ study-ai-engineering         │ <mode>   │ <…>                        │
│ study-prompt-engineering     │ <mode>   │ <…>                        │
│ study-agent-architecture     │ <mode>   │ <…>                        │
└──────────────────────────────┴──────────┴────────────────────────────┘
```

Below the table, for each UPDATE-mode guide, list the per-file changes (which files will be edited, what each edit does in one line). For each CREATE-mode guide, list the top-level directories that will be created. The user should be able to read this plan once and know exactly what every guide is about to do.

## Step 6 — Single confirmation gate

**Wait for one confirmation** before editing any file. The four generators' "wait for confirmation before editing" contracts are batched into this single gate.

If the run is non-interactive (a `--yes`-style invocation or an automated context where the user already accepted), skip the gate and execute the plan directly.

## Step 7 — Execute in run order

Run the generators in this order — independent for correctness, but the order produces a readable progression and a sensible summary:

1. `study-system-design-dsa`
2. `study-ai-engineering`
3. `study-prompt-engineering`
4. `study-agent-architecture`

For each generator:

- **CREATE mode** — generate the full guide per the generator's spec (directory structure, every concept/chapter file, every README index). The generator's standalone spec defines the exact procedure; follow it faithfully.
- **UPDATE mode** — apply only the section-level edits identified in Step 4. Never rewrite a whole file when a section edit will do. Append to each updated file:

  ```
  ---
  Updated: <today's ISO date> — <one-line summary of what changed and why>
  ```

  Update each affected `README.md` index when files were added or removed.

The orchestrator emits no concept content of its own — all content comes from the generator specs.

## Step 8 — The final report

After execution, print a summary table so the user can see at a glance what changed for each guide.

```
STUDY RUN SUMMARY — <repo name> — <today's ISO date>

┌──────────────────────────────┬──────────┬────────────────────────────┐
│ Guide                        │ Mode     │ Result                     │
├──────────────────────────────┼──────────┼────────────────────────────┤
│ study-system-design-dsa      │ <mode>   │ <e.g. 2 files edited, 1+>  │
│ study-ai-engineering         │ <mode>   │ <e.g. no change (current)> │
│ study-prompt-engineering     │ <mode>   │ <e.g. 13 files generated>  │
│ study-agent-architecture     │ <mode>   │ <e.g. full guide generated>│
└──────────────────────────────┴──────────┴────────────────────────────┘
```

Below the table, one section per guide listing the specific files touched and a one-line reason for each.

**Stop. Wait for the user's next instruction.** Do NOT auto-act on findings. Do NOT generate follow-up specs.

---

## Scope and constraints

- **Per-repo.** The orchestrator runs against ONE repo — the directory the command was invoked in. It never reads or writes another repo. Every reference, file path, and code citation is about this repo only.
- **All six always run.** The orchestrator does NOT skip a generator because the repo "doesn't do that topic." Each generator's own spec decides what to emit for a topic the codebase doesn't exercise (honest "not yet implemented" files, system-design templates as buildable targets, etc.). Skipping is the generator's call, never the orchestrator's.
- **Structure source is read once.** `format.md` is the structural foundation for the whole family. Read it once and hand it to all four generators; do not re-derive structure per generator. (`study-system-design-dsa.md` is now a topic generator like the others, not the structure source.)
- **Persona routing is not uniform.** See Step 3 — four generators use `teacher.md` (one in coach posture, three in teacher posture); `study-prompt-engineering` uses its own inline persona.
- **Edits are surgical in UPDATE mode.** Never rewrite a whole file when a section-level edit will do. Preserve everything the codebase still supports; change only what the codebase changed.
- **A guide that is already current produces no edits.** UPDATE mode is a no-op when the code and the guide already agree — the expected outcome for guides whose topic you didn't touch this round.
- **Curriculum files are optional inputs.** Read `aieng-curriculum.md` when present; degrade gracefully when absent. Never block a run on a missing curriculum file.
- **The orchestrator emits no concept content of its own.** It produces only the run plan, the confirmation gate, and the summary report.
