---
description: Trustworthy-eval workshop for this codebase — 10 exercises in coach voice, discovery-driven skip logic, human-owned label anchor
---

The user invoked `/aipe:rehearse-eval-workshop`.

This command takes **no arguments**. There is one workshop workbook per repo, saved at the fixed path `.aipe/rehearse-eval-workshop/`. `.aipe/` is per-repo (lives at the root of whichever repo the command is run in); the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters RESUME mode on the existing directory.

This command produces a **10-exercise workshop** that teaches the reader to build a trustworthy eval for their own codebase — one where the reader can defensibly answer "you let AI write the app AND the eval, why do you trust the result?" Coach voice throughout. The **human-owned ground-truth label** is the anchor; AI drafts harness, rubric criteria, and candidate inputs, but never labels or calibration verdicts. Each exercise anchors to the repo's real eval surface (discovered at Step 5C). Two conditional tracks — **Exercise 07 (RAG)** and **Exercise 08 (agent)** — generate only if the repo's shape includes retrieval or an autonomous agent, respectively.

Unlike the other rehearse books (which produce a book to read front-to-back), this one produces a **workbook** the reader progresses through under coaching, one exercise at a time. Runs standalone; NOT part of `/aipe:rehearse` (same standalone pattern as `/aipe:rehearse-behavioral-stories`).

**Per-repo scope.** This spec runs against one codebase at a time — the repo where the command was invoked. Every exercise cites real paths from that repo's eval surface (or notes "missing, you'll create").

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:rehearse-eval-workshop.`
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

Per-repo scope: do NOT load context files from other repos. The codebase being worked on is the one this command was invoked in.

## Step 3 — Load the template chain

Eval-workshop reads four files in order — structure, writer persona, reader calibration, then the spec itself:

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-eval-workshop.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the shared quality standards across the whole study/rehearse family: formatting (kebab-case file names, no Mermaid/no images, box-drawing diagram chars), diagram conventions, pseudocode rules, the analogy rule (analogies welcome — to land or clinch — but the engineering mechanism is always built in full, never replaced by metaphor), the standard-term-leads rule (industry term as the noun, repo's local name in parens on first use), the no-hedging rule, the hard rules. This spec uses its own **per-exercise seven-part template** (defined inline in `rehearse-eval-workshop.md`), NOT format.md's concept-file template — but the *quality standards* come from format.md.
- **`teacher.md`** — the base writer persona (the staff engineer with 12 years' experience). This spec shifts that persona from *teacher* to **coach** — see teacher.md's "THE POSTURE" section. Second-person address throughout; the coach optimizes for the reader building a trustworthy eval, not for narrating one.
- **`me.md`** — reader-side calibration: who the reader is professionally, what voice they respond to, and the ownership discipline they need to internalize (human-labeled ground truth is the anchor; AI-authored plumbing is only trustworthy after verification). `me.md` does NOT override format.md's quality rules or teacher.md's voice rules — it calibrates examples and depth.
- **`rehearse-eval-workshop.md`** — the exercise arc (10 exercises with conditional skip on 07/08), the two-track ownership model (human vs AI, with the ownership line stated per exercise), the seven-part per-exercise template (`verdict / analogy / in your repo / human track / AI track / do it / done when`), the workshop-specific overrides (coach voice, one exercise at a time, always both tracks), and the non-negotiable guardrails (Claude MUST NOT author ground-truth labels or calibration verdicts).

## Step 4 — Detect existing workbook → branch CREATE or RESUME

Check whether `.aipe/rehearse-eval-workshop/` already contains the workbook. The signal is the presence of `00-map.md` at the root OR any file matching `0[1-9]-*.md` or `10-*.md`.

- **Existing workbook found** → go to RESUME MODE (Step 5R onward). **Do NOT regenerate from scratch.**
- **No existing workbook** → go to CREATE MODE (Step 5C onward).

(The `.aipe/rehearse-eval-workshop/` directory itself may exist as an empty placeholder; that's not the same as having a workbook already.)

---

# CREATE MODE

Runs only when no existing workbook is found.

## Step 5C — Discovery pass: scan the repo's eval surface

Before generating anything, read the invoked repo's eval surface with the file/grep tools available. The workbook's `00-map.md` cites what's actually there — never invent files.

**What to search for** (use Bash `find` / Grep as needed):

- **Eval directories:** `eval/`, `evals/`, `test/eval*/`, `tests/eval*/`, `scripts/eval*/`
- **Eval files:** `*.eval.*`, `*_eval.py`, `*_eval.ts`, `*.eval.json`, `*.eval.yaml`, `golden/`, `cases/`, `fixtures/eval*`
- **Judges / rubrics:** `judge*`, `rubric*`, `grader*`, `scorer*`, `criteria*`
- **Eval frameworks** in dependencies (package.json / pyproject.toml / requirements.txt / go.mod): `ragas`, `deepeval`, `langsmith`, `promptfoo`, `braintrust`, `openai-evals`, `mlflow`, `weave`, `phoenix`, `giskard`, `patronus`, `inspect-ai`
- **CI hooks:** grep `.github/workflows/`, `.gitlab-ci*`, `Makefile`, `justfile` for `eval` / `bench` targets

**What to detect** (the shape drives skip logic in Step 6C):

- **RAG shape:** presence of a retriever (vector DB client, `embed*`, `similarity_search`, `retrieve*`, `chroma`/`pinecone`/`weaviate`/`qdrant`/`pgvector`) alongside an LLM call → **generate Exercise 07 (RAG track).**
- **Agent shape:** presence of tool-call machinery (a tool registry, a trajectory / trace / message log, ReAct-style loops, LangGraph / Autogen / crewAI, `tools=[]` in an LLM call) → **generate Exercise 08 (agent track).**
- **Plain-LLM shape:** neither of the above → **skip 07 and 08.**

**Extract pattern headers from each eval file.** For each detected eval file, read the leading comment block (top ~100 lines — file-level docstring, header comment, or top-of-file docstring). Look for either of these signals:

- **Divider-labelled pattern:** a line like `─── Pattern: <name> ───` or `─── PATTERN: <name> ───` (any width of divider, any comment prefix — `//`, `#`, `/*`, `--`)
- **Plain-label pattern:** a line like `Pattern: <name>` inside a comment block near the top of the file
- **Sub-pattern list:** numbered items (`1. <name>`, `2. <name>`, ...) or bulleted items following the pattern header, or an inline "sub-patterns:" line listing them

When a pattern header is found, extract:
- The **pattern name** (the text after `Pattern:` up to end of line or the closing divider)
- The **sub-pattern list** (comma-separated names extracted from numbered/bulleted items or an explicit sub-patterns line)
- The **file:line-range** of the pattern header block

Files without a pattern header are skipped for pattern extraction — cite the file path only. Do not fabricate pattern names.

**Build the discovery inventory** (used in `00-map.md`):

```
Eval surface found:
  <path>                   type: <harness / case-set / rubric / judge / runner / gate / calibration>
                           pattern: <name from header, or "no pattern header">
                           sub-patterns: <comma-separated list, or "none">
                           header at lines <start>-<end>
  <path>                   ...
  (or: "no eval surface detected — the workshop builds it from zero")

Repo shape (drives skip logic):
  RAG:   detected | not detected     (evidence: <files or "none">)
  agent: detected | not detected     (evidence: <files or "none">)

Owners (three-parts model):
  harness / plumbing        →  dev owns design; AI can draft
  rubric / grader           →  dev owns criteria; AI drafts, dev edits
  cases + LABELS            →  HUMAN owns labels; AI does NOT
```

**Why this matters.** When the reader has already documented their eval patterns as self-describing comment headers (a `─── Pattern: golden-set, LLM-as-judge eval harness on a test runner ───` block followed by sub-pattern items), each exercise should cite the matching pattern from the codebase in its ③ "in your repo" block. This turns the workshop from abstract teaching into a per-repo tour of patterns the reader has already committed to — with exercise 05 (calibration) naturally landing on any `judge calibration / inter-rater agreement` pattern the reader already has, exercise 09 (gate) naturally landing on any `regression gate / ratchet` pattern, etc. See Step 7C for the exercise-to-pattern mapping guide.

## Step 6C — Plan the workbook (with skip logic)

The workbook is 10 exercises. Two are conditional:

```
Exercise 01   the ownership split                       always
Exercise 02   write ONE ground-truth case, by hand      always
Exercise 03   let AI write the harness                  always
Exercise 04   the rubric — AI drafts, human decides     always
Exercise 05   THE TRUST ANCHOR — calibrate the judge    always (the spine)
Exercise 06   adversarial-first                         always
Exercise 07   RAG track                                 only if RAG detected
Exercise 08   agent track                               only if agent detected
Exercise 09   wire the gate                             always
Exercise 10   capstone — articulate the anchor          always
```

If neither RAG nor agent shape is detected, generate 8 exercises: 01–06, 09, 10. Renumber the last two to keep sequential order: `07-wire-the-gate.md`, `08-capstone-articulate-the-anchor.md`.

If only RAG is detected: 9 exercises with 07 as RAG track; then 08-wire-the-gate, 09-capstone.

If only agent is detected: 9 exercises with 07 as agent track; then 08-wire-the-gate, 09-capstone.

If both detected: 10 exercises as listed.

**Non-negotiables — inherited from `format.md`, `teacher.md`, `me.md`, and this spec:**

1. **Coach voice throughout.** Address the reader as "you." Second-person direct address. No third-person narration. The coach optimizes for the reader building an eval they can defend, not for teaching abstract eval theory.
2. **One exercise at a time.** After generating the workbook, STOP and offer to coach through Exercise 01. Never run the whole arc unprompted. Every subsequent exercise is user-initiated.
3. **Always both tracks visible.** Every exercise file shows the **human track (④)** and the **AI track (⑤)** with the ownership line stated explicitly. A file missing either track is a generation failure.
4. **Every exercise anchors to real repo files** from Step 5C's discovery. Cite real paths; never invented ones; never another repo's paths. If a piece is missing from the repo, mark it "missing, you'll create" — not fabricated.
5. **Every AI-authored artifact is paired with a verification step.** Smoke test, dry-run, or calibration agreement number. Authorship is never presented as trust. This is the workshop's spine.
6. **No score is reported without its denominator (n).** "Judge agrees with human 80% (n=6)" is a smoke test; "80% (n=42)" is trustworthy. The reader must know the difference.
7. **Claude MUST NOT author ground-truth labels or calibration verdicts.** It may draft candidate *inputs* and *rubric criteria*; the human decides labels. This is the workshop's central discipline — restated in every AI-track section.
8. **Skip what already exists in the repo.** If Exercise 03's harness is already built and mature, the exercise pressures the *quality* (test coverage, pluggability of scorer/SUT) rather than re-teaching harness basics. Discovery from Step 5C drives what to skip vs teach.
9. **Match repo conventions** when the "do it" step (⑥) proposes files. Naming, language, directory layout — copy the repo's style. Do not impose a foreign layout.
10. **One ASCII diagram minimum per exercise where it clarifies.** Box-drawing chars per format.md. Skip diagrams that don't earn their space; never draw for the sake of drawing.
11. **Cite codebase-documented patterns in every exercise's ③ block.** When Step 5C extracted pattern headers from the repo's eval files, each exercise's ③ "in your repo" block includes a `▸ codebase patterns:` sub-bullet naming the file:line where the matching pattern header lives and the pattern's own name (verbatim from the codebase comment) + its sub-patterns. If the reader has documented the pattern the exercise teaches, name it and mark the exercise as *"you're already doing this — the exercise pressures its quality (calibration n, coverage, gate behavior, etc.)"* rather than teaching it from scratch. When no matching pattern was extracted, ③ says "no pattern header found in your eval files for this topic — the exercise builds it from the topic content." See Step 7C for the exercise-to-pattern mapping guide.

## Step 7C — Create the directory and generate the workbook

Create:

```bash
mkdir -p .aipe/rehearse-eval-workshop
```

Generate the following (flat — no subdirectories), in order:

```
00-map.md                              discovery inventory + ownership table + exercise arc + reading order
01-the-ownership-split.md              the three-parts model applied to this repo's evals
02-write-one-ground-truth-case.md      eval-first — the human-authored anchor
03-let-ai-write-the-harness.md         plumbing is safe to delegate; verify via smoke test
04-the-rubric-ai-drafts-human-decides.md   dimensions menu → drafted criteria → human-edited thresholds
05-the-trust-anchor-calibrate-the-judge.md   THE SPINE: hand-label, run judge, compute agreement
06-adversarial-first.md                make the eval find bugs
[07-rag-track.md]                      only if RAG detected
[08-agent-track.md]                    only if agent detected
0N-wire-the-gate.md                    the eval blocks a bad deploy
0N-capstone-articulate-the-anchor.md   the reader states the trust story in their own words
```

Where `0N` numbering closes any gap from skipped 07/08 to keep files sequential.

**Exercise-to-pattern mapping guide** (used to decide which extracted patterns from Step 5C go in which exercise's ③ block):

```
  Exercise 01  ownership split                → ALL extracted patterns appear
                                                 in the ownership table with
                                                 owner labels (harness / rubric
                                                 / labels), one row per file.

  Exercise 02  ground-truth case (eval-first) → patterns like: golden-set,
                                                 golden-dataset LLM eval,
                                                 blind-labeling setup

  Exercise 03  let AI write the harness       → patterns like: LLM-as-judge on
                                                 test runner, script-as-test,
                                                 fixture map-reduce, staged
                                                 pipeline, receipt/artifact log

  Exercise 04  the rubric                     → patterns like: rubric/scored
                                                 dimensions, LLM-as-judge,
                                                 claim decomposition

  Exercise 05  calibrate the judge (SPINE)    → patterns like: judge
                                                 calibration, inter-rater
                                                 agreement, blind-labeling
                                                 setup, anti-anchoring

  Exercise 06  adversarial-first              → patterns like: fault injection,
                                                 chaos testing, adversarial
                                                 seeds, controlled isolation
                                                 experiment

  Exercise 07  RAG track                      → patterns like: retrieval
                                                 metrics (recall@k / precision
                                                 @k), faithfulness, retriever
                                                 vs generator split

  Exercise 08  agent track                    → patterns like: trajectory
                                                 scoring, tool-call trace,
                                                 controlled isolation
                                                 experiment (probe files)

  Exercise 09  wire the gate                  → patterns like: regression gate,
                                                 snapshot baseline, golden-
                                                 master, threshold/ratchet,
                                                 script-as-test

  Exercise 10  capstone                       → cites the WHOLE pattern map
                                                 from 00-map.md as the trust
                                                 story ("here are the N patterns
                                                 I've documented; here's the
                                                 anchor n; here's the gate")
```

The pattern name a file uses is the reader's own name (verbatim from the extracted header). Don't rename. If the reader called it `golden-set, LLM-as-judge eval harness on a test runner`, cite it exactly that way — that's the vocabulary the reader has committed to and the exercise should reinforce it.

Each exercise file follows the **seven-part template from `specs/rehearse-eval-workshop.md`**, with the ③ block extended per non-negotiable #11:

```
# Exercise N — [title]

① verdict      one line: the point of this step, said first
② analogy      ground it in something non-eval before mechanism
                (per format.md's analogy rule — analogy lands the shape;
                 engineering explanation is still built in full immediately after)
③ in your repo the specific real path(s) this touches, from Step 5C discovery
                — or "missing, you'll create" for what the reader will build

                ▸ codebase patterns:
                  - <file:line-range> — <pattern name verbatim from the file's header>
                    sub-patterns: <comma-separated sub-patterns from the header>
                  - <another file:line if multiple map to this exercise>
                  (or: "no pattern header found in your eval files for this topic —
                   the exercise builds it from the topic content")

                If the pattern IS already documented in the codebase, add one
                sentence naming what the exercise pressures instead of teaching
                from scratch: "you're already doing this — this exercise
                pressures <the specific quality dimension: calibration n,
                coverage, gate behavior, sub-pattern completeness, etc.>."

④ human track  what the reader authors by hand, and WHY only a human can
⑤ AI track     what Claude may draft, and how it's VERIFIED (authorship ≠ trust)
⑥ do it        the concrete task; the exact file/shape to write (repo conventions)
⑦ done when    the checkable finish line
```

`00-map.md` contains:
- **Discovery inventory** — from Step 5C, listing every eval file found, its type, and (when present) its extracted `Pattern:` name + sub-patterns with file:line-range citations. This is the pattern index the exercises cross-reference.
- **Repo shape** — RAG / agent / plain-LLM, with the evidence line
- **Ownership table** — the three-parts model (harness / rubric / cases+labels) with the who-owns-what column, one row per discovered eval file including its documented pattern name
- **Exercise arc** — the 8/9/10 exercises with skip notes ("Exercise 07 skipped — no retrieval detected in this repo"), each exercise line showing which extracted patterns from the inventory the exercise will cite in its ③ block
- **Reading order** — first pass in numerical order; each exercise builds on the previous; Exercise 05 (calibration) is the spine — if the reader does only one, that's it
- **Progress checkboxes** — empty checkboxes next to each exercise; the reader ticks them as they complete. Used by RESUME mode to pick up where left off.

## Step 8C — Report + stop, offer to coach one exercise at a time

Print exactly:

```
✓ Eval workshop workbook created at .aipe/rehearse-eval-workshop/
  00-map.md
  01-the-ownership-split.md
  02-write-one-ground-truth-case.md
  03-let-ai-write-the-harness.md
  04-the-rubric-ai-drafts-human-decides.md
  05-the-trust-anchor-calibrate-the-judge.md
  06-adversarial-first.md
  [07-rag-track.md         ← generated / skipped: <reason>]
  [08-agent-track.md       ← generated / skipped: <reason>]
  0N-wire-the-gate.md
  0N-capstone-articulate-the-anchor.md

Discovery summary:
  Repo shape: <RAG / agent / plain-LLM> (evidence: <one line>)
  Eval surface found: <N files> (or "none — the workshop builds from zero")
  Exercises generated: <N of 10>
```

Then a 2–3 sentence coach opener:

- The dominant shape of this repo's eval surface (or "starting from zero")
- Which exercise carries the most weight for this codebase (usually 02 or 05)
- The one thing to internalize before Exercise 01 — the ownership split, and specifically that ground-truth labels are the anchor AI never touches

End with:

> **Ready to work through Exercise 01 (the ownership split)? Or you can jump to any exercise number — I'll coach from there.**

**Stop. Wait for the user's next instruction.** Do NOT auto-run Exercise 01. Do NOT paste any exercise content beyond what was written to disk. The coaching layer starts only when the user picks an exercise.

---

# RESUME MODE

Runs when Step 4 found an existing workbook. Goal: pick up where the reader left off, without regenerating.

## Step 5R — Read the existing workbook

Walk `.aipe/rehearse-eval-workshop/` and read `00-map.md` plus every `0N-*.md` file present.

Look for **progress signals**:
- Ticked checkboxes in `00-map.md` (e.g., `[x] Exercise 01`)
- Files the reader has hand-edited beyond the generated template (added notes, filled in the ⑥ "do it" step, committed real cases)
- The reader's own eval files that were created during previous exercises

Do NOT re-scan the eval surface unless `00-map.md` looks stale relative to the current codebase (e.g., named files no longer exist).

## Step 6R — Report state, offer next step

Print:

```
Workbook state:
  Location: .aipe/rehearse-eval-workshop/
  Exercises completed:  <list, or "none marked complete">
  Exercises in progress: <list, or none>
  Exercises remaining:  <list>
  Files added by the reader since generation: <list, or none>
```

Then a 1–2 sentence coach nudge — where the reader is in the arc, what the next natural step is (usually the first remaining exercise; the calibration spine at Exercise 05 if that's still pending).

End with:

> **Continue with Exercise <N> (<name>)? Or pick a different exercise number.**

**Stop. Wait for the user's next instruction.** Do NOT regenerate any files. Do NOT overwrite the reader's edits. Do NOT auto-run any exercise.

If the reader's codebase has grown significantly since generation (new eval files, new frameworks, shape change from plain-LLM → RAG/agent), offer to re-run discovery and update `00-map.md` — but only after explicit user confirmation. Never silent-update.
