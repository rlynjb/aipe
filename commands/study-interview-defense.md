---
description: Interview defense guide for this codebase — one file per question, anchored to real code, with "I don't know" recovery
---

The user invoked `/aipe:study-interview-defense`.

This command takes **no arguments**. There is one interview defense guide per repo, saved at the fixed path `.aipe/study-interview-defense/`. `.aipe/` is per-repo (lives at the root of whichever repo the command is run in); the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a question-first companion to `/aipe:study` — for the reader who is about to defend their own work in a 45-minute interview. The unit of organization is the **question an interviewer would ask**, not the concept the system uses. The output anticipates questions, names what each is really probing, and shows what a strong answer sounds like in the *reader's* voice, anchored to *their* code.

**Per-repo scope.** This spec runs against one codebase at a time — the repo where the command was invoked. Questions are derived from what's actually in this code, not from a fixed catalog.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-interview-defense.`
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

Per-repo scope: do NOT load context files from other repos. The codebase being defended is the one this command was invoked in.

## Step 3 — Load both templates

Interview defense inherits formatting rules and the constraint summary from `study.md` but uses its *own* per-question template. Load both:

```
${CLAUDE_PLUGIN_ROOT}/specs/study.md
${CLAUDE_PLUGIN_ROOT}/specs/study-interview-defense.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` and `specs/study-interview-defense.md` upward from this file's location.

`study.md` is read for **inheritable rules** — formatting (no markdown pipe-tables, kebab-case file names, no Mermaid/images, box-drawing diagram characters), the "use real software, not analogies" rule, the hedging ban, the constraint summary. `study-interview-defense.md` is read for **the persona, the question-derivation logic, the per-question template, and the interview-defense-specific constraints**.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-interview-defense/` already contains the guide. The signal is the presence of `00-overview.md` at the root, OR `the-ai-question.md` at the root, OR any file inside `01-architecture/`, `02-tech-choices/`, `03-scale-and-load/`, `04-failure-modes/`, `05-code-walkthroughs/`, `06-counterfactuals/`, `07-dsa-decisions/`, or `08-hard-questions/`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

(The `.aipe/study-interview-defense/` directory itself may exist as an empty placeholder; that's not the same as having a guide already.)

---

# CREATE MODE

Runs only when no existing guide is found.

## Step 5C — Derive the question inventory

The agent's first job is to identify the questions an interviewer would actually ask about *this codebase*. Questions are derived from the code, not from a fixed list. Walk the project context and produce a list per category:

- **01-architecture** — derived from the system's actual shape. Always include "walk me through how this app works" (the universal opener) and at least one request-flow walkthrough. Add a data-flow question if the system has non-trivial state. Add a "how does feature X work end-to-end" question for each major user-facing feature.
- **02-tech-choices** — one question per **load-bearing** technology choice (system would be meaningfully different if a different choice were made). Examples: database, vector store, LLM provider, framework, state management, deployment target. **Skip choices that don't matter** (CSS tool, testing framework — rarely probed at senior level).
- **03-scale-and-load** — one question per realistic scale bottleneck this codebase has. Anchored to the actual architecture; questions whose answers the candidate could verify in code.
- **04-failure-modes** — one question per realistic failure surface ("what happens if the LLM API is down for 10 minutes?", "what if Postgres goes read-only?", "what if a user uploads malformed input?"). Tied to real surfaces in the code.
- **05-code-walkthroughs** — one question per load-bearing code region the interviewer might ask the candidate to walk through. Pick regions where depth would be visible.
- **06-counterfactuals** — one question per decision the candidate would honestly reconsider. **Don't fabricate counterfactuals for decisions that were obviously right** — padding undermines the senior-engineer signal this section produces.
- **07-dsa-decisions** — one question per non-trivial data-structure or algorithm choice. Only generate when there's a real decision — many codebases have few or none, and that's fine.
- **08-hard-questions** — a fixed set of open-ended reflection questions, lightly tailored to the codebase. Always include: "what's the hardest bug you debugged in this app," "what would you do differently if you started over," "what part of this codebase are you least confident defending."
- **the-ai-question** — single file at the root, **always generated** regardless of whether the agent can detect AI assistance. The 2026 baseline assumption is significant AI use; the file produces a calibrated-honest answer template.

**What NOT to include:**
- Questions whose answers are trivial ("why did you use a function") — below the senior bar.
- Questions about libraries the codebase barely uses (lodash imported once for `debounce` is not a tech choice).
- Questions the interviewer is unlikely to ask ("why this specific ESLint rule").
- Questions that have the same answer as other questions in the same category — merge them.

**Target count.** ~15–30 question files for a typical codebase. Fewer is fine for small/simple codebases. More than 40 is over-generation — merge or drop. Empty subdirectories are NOT created — a content-heavy site with no meaningful DSA decisions skips `07-dsa-decisions/` entirely.

## Step 6C — Plan the guide

Apply the per-question template from `study-interview-defense.md` (NOT `study.md`'s per-concept template — they're similar quality but different units of organization).

The non-negotiables — inherited from both specs:

1. **Persona: staff engineer who has been on the hiring side of senior+ loops.** 12 years industry, 8 at Google/Meta, the last 4 also conducting senior+ interviews and sitting in hiring committees. Knows what makes a "strong yes" vs "leaning yes" vs "weak no." Calm and pragmatic about the 2026 reality that candidates built with significant AI assistance.
2. **Strong-answer prose is written in the *candidate's* voice — first person, present tense, anchored to specific files and functions.** "I picked pgvector because..." not "the developer picked pgvector because..." The reader should be able to read the strong-answer block aloud and have it sound natural.
3. **Every claim in a "Strong answer" block must be grounded in the actual codebase.** Library versions must match what's in the repo. File paths must exist. Function names must be real. **If a strong answer requires a claim the agent can't verify, the question is wrong for this codebase — drop it rather than fabricate.**
4. **Every question file includes a "Where to expect pushback" block AND an "I don't know" recovery block.** These are the load-bearing differentiators of this spec vs other interview-prep material. A file without these blocks is incomplete. The "I don't know" recovery block teaches the skill of saying "I don't know" with poise — a learnable skill, not a character flaw.
5. **"What they're really asking" names the underlying probe, not the surface form.** Generic restatements are banned. Name the signal the interviewer is looking for and what gets tested.
6. **`the-ai-question.md` is always generated.** Always. The 2026 baseline assumes the candidate used AI heavily; the file teaches how to answer honestly without sounding defensive or evasive. Strong answer is matter-of-fact, specific about the AI's role, specific about the candidate's role, ends with thoughtful reflection on what AI tools have actually taught the candidate.
7. **AI assistance honesty is woven throughout, not isolated.** Every "why did you choose X" answer should be honest about whether the choice was the candidate's deliberate decision, the AI's suggestion the candidate evaluated and accepted, or the AI's default the candidate didn't question. The third mode is the riskiest to own — and the most senior-signal-positive when owned well.
8. **Hedging is banned (inherited from `study.md`).** "I might have used X" is weaker than either "I used X" or "I didn't use X." Pick one.
9. **No marketing language.** Banned phrasings: "scalable solution," "robust architecture," "leveraging modern best practices," "cutting-edge," "best-in-class," "state-of-the-art." Interviewers hear these as "I don't actually understand what I built."
10. **"What you'd change" is required in every file** — even for decisions the candidate wouldn't change. For those, name what would change at a different scale or under different constraints. The senior-engineer habit of always being able to name what you'd reconsider is what this block builds.

## Step 7C — Create the directory structure

Create the root and only the category subdirectories that have at least one question from Step 5C's inventory:

```
.aipe/study-interview-defense/
.aipe/study-interview-defense/01-architecture/             (always — universal opener lives here)
.aipe/study-interview-defense/02-tech-choices/             (skip if no load-bearing tech choices)
.aipe/study-interview-defense/03-scale-and-load/           (skip if no realistic scale bottlenecks)
.aipe/study-interview-defense/04-failure-modes/            (skip if no surfaces worth probing)
.aipe/study-interview-defense/05-code-walkthroughs/        (skip if no regions worth walking)
.aipe/study-interview-defense/06-counterfactuals/          (skip if no honest counterfactuals)
.aipe/study-interview-defense/07-dsa-decisions/            (skip if no real DSA decisions)
.aipe/study-interview-defense/08-hard-questions/           (always — the fixed reflection set)
```

(Use `mkdir -p`.) Empty subdirectories are not generated — a content-heavy site won't have `07-dsa-decisions/`.

## Step 8C — Generate each question file

For each question in the Step 5C inventory, write one file using the per-question template from `study-interview-defense.md`. Use this exact structure:

```
# [Question, verbatim as an interviewer would ask it]

## What they're really asking
  One paragraph naming the underlying probe.

## Why they ask this question
  One sentence on the signal this question produces in a hiring decision.

## The strong answer
  2–5 paragraphs in the candidate's voice — first person, present tense,
  anchored to specific files and functions. Every factual claim verifiable
  in the codebase.

## Key facts to know cold
  Labelled bullets, 5–10 items. Library versions, file paths, function
  names, design choices.

## Common follow-ups
  The 3–5 questions the interviewer is most likely to ask next, each with
  one-line guidance on how to handle it.

## Where to expect pushback
  The weakest part of the strong answer. Name the weakness, name what to
  say. This is the most important block — if the candidate can hold here,
  they pass.

## The "I don't know" recovery
  When the interviewer pushes into territory the candidate genuinely
  doesn't know, what to say. Name the kind of pushback, then the
  recovery. Strong recovery looks like: confidence about what you do
  know, no fake bullshit about what you don't, willingness to learn in
  real time.

## What you'd change
  One paragraph. Volunteers what the candidate would reconsider — at a
  different scale, under different constraints, or just on reflection.
  Required, even when the candidate wouldn't actually change anything.

## Practice prompt
  One sentence. A short prompt the candidate uses for recorded practice.
```

The H1 uses the **actual interviewer phrasing**, not a sanitized version. "Why pgvector and not Pinecone?" not "Discuss the vector database selection."

## Step 9C — Generate `the-ai-question.md` (always)

Single file at the root (not in a numbered subdirectory) because it cuts across every other question. Uses the same per-question template.

Required follow-ups for this file:
- "How much of the code did you actually write yourself?"
- "Can you explain [pick a complex section]? Walk me through it line by line."
- "What did AI get wrong?"
- "What's a decision Claude (or another tool) suggested that you overrode?"
- "What would you have built if you didn't have AI?"

The strong-answer voice here is more conversational than other defense files — the candidate should sound like they've thought about this honestly and arrived at a stable, grounded position, not like they memorized a defense. The worst possible answer is defensive, evasive, or pretending AI wasn't used.

## Step 10C — Generate `00-overview.md`

The candidate's at-a-glance map of every question. Two purposes: pre-interview review the night before, and identification of gaps (a question the candidate hadn't thought about). Format:

```
# Interview defense — [codebase name]

## All questions, by category

### Architecture
- Walk me through how this app works → 01-architecture/01-system-overview.md
- How does a typical request flow through the system? → 01-architecture/02-request-flow.md
...

### Tech choices
- Why pgvector and not Pinecone? → 02-tech-choices/01-vector-store.md
- Why Next.js and not Remix? → 02-tech-choices/02-framework.md
...

[...for each category...]

### The AI question
- Did you use AI to build this? → the-ai-question.md
```

End with a one-paragraph note on practice approach: read each file out loud as if answering an interviewer; the "I don't know" recovery block is the load-bearing one — practice that block more than the others, because it's the muscle most candidates haven't built.

## Step 11C — Generate section README indexes

Each category subdirectory gets its own `README.md` listing the questions in that category with their file names. Also generate `.aipe/study-interview-defense/README.md` at the root: full guide index, reading order suggestion (start with the AI question, then 01-architecture's universal opener, then work through tech-choices), and a one-paragraph note on how to practice (read aloud, time yourself, drill the pushback block specifically).

## Step 12C — Report + stop

Print exactly:

```
✓ Interview defense guide created at .aipe/study-interview-defense/
  00-overview.md
  README.md
  the-ai-question.md
  01-architecture/                  (<N> files + README.md)
  02-tech-choices/                  (<N> files + README.md)   [omit if not created]
  03-scale-and-load/                (<N> files + README.md)   [omit if not created]
  04-failure-modes/                 (<N> files + README.md)   [omit if not created]
  05-code-walkthroughs/             (<N> files + README.md)   [omit if not created]
  06-counterfactuals/               (<N> files + README.md)   [omit if not created]
  07-dsa-decisions/                 (<N> files + README.md)   [omit if not created]
  08-hard-questions/                (<N> files + README.md)
```

Then a 3–5 sentence summary: total question count (should be 15–30 for a typical codebase), which category was richest, any category that was deliberately skipped (and why), and a one-line note on the strongest pushback target the candidate should drill first.

**Stop. Wait for the user's next instruction.** They'll typically pick a question to drill or ask for a recorded-practice prompt. Do NOT auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: refresh stale answers without rewriting accurate ones. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-interview-defense/` recursively. Read every `.md` file in every subdirectory, plus `00-overview.md`, `README.md`, and `the-ai-question.md`.

## Step 6U — Diff each file against the current codebase AND the loaded templates

Three diff sources to check per file:

- **Codebase drift** — file paths that have moved, function names that have changed, library versions named in "Key facts to know cold" that have been upgraded, design decisions that have shifted.
- **Template drift** — block structure has changed since the file was written (e.g., a new block added to the per-question template). Identify missing blocks. Current required blocks: What they're really asking / Why they ask this question / The strong answer / Key facts to know cold / Common follow-ups / Where to expect pushback / The "I don't know" recovery / What you'd change / Practice prompt.
- **Inventory drift** — new load-bearing tech choices added to the codebase that warrant new files, removed features whose question files are now obsolete, questions that no longer have a real anchor in the code (drop them).

Output a structured change plan grouped by category.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Maintain the candidate-voice convention for "Strong answer" blocks. Append a changelog entry at the bottom of each updated file:

```
---
Updated: <today's ISO date> — <one-line summary of what changed and why>
```

Do NOT rewrite accurate sections. Do NOT add fabricated questions whose answers can't be grounded in the actual code — drop them instead.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-interview-defense/
─────────────────────────────────────────────────
Files updated:        <list>
Files added:          <list>
Files removed:        <list, with one-line reason each>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
