---
name: audit-refactor
description: Staff-engineer notebook of refactor opinions — six-chapter book per codebase, takes not tasks
---

The user invoked `/aipe:audit-refactor`.

This command takes **no arguments**. There is one audit-refactor book per project, saved at `.aipe/audit-refactor-<purpose>/` — where `<purpose>` is the same 2-word descriptor used by `/aipe:study` (e.g., `audit-refactor-ai-journal/`, `audit-refactor-ml-fitness/`, `audit-refactor-prompt-tooling/`). On first run the agent reuses an existing study purpose if one exists, or derives a new one. Re-running enters UPDATE MODE on the existing directory.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:audit-refactor.`
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

## Step 3 — Load both templates

Audit-refactor opines against the catalog in `refactor.md`. Load both:

```
${CODEX_PLUGIN_ROOT}/specs/refactor.md
${CODEX_PLUGIN_ROOT}/specs/audit-refactor.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/refactor.md` and `specs/audit-refactor.md` upward from this file's location.

## Step 4 — Detect existing book → branch CREATE or UPDATE

Look first for an existing audit-refactor book in `.aipe/`:

```bash
ls -d .aipe/audit-refactor-*/ 2>/dev/null
```

A match counts as an existing book only if it contains `00-overview.md` at its root OR any file matching `0[1-5]-*.md`.

Branch on what's found:

- **One existing book** → record its path as `<book-dir>` and go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **Multiple existing books** (rare — usually means the project's purpose was renamed) → list them and ask the user which to update. Honor the choice; set `<book-dir>` and go to UPDATE MODE.
- **No existing book** → derive `<purpose>` (Step 4b) and go to CREATE MODE (Step 5C onward).

### Step 4b — Derive the `<purpose>` descriptor (only when no book was found)

**Reuse the study purpose if it exists.** Check `.aipe/study-*/` first:

```bash
ls -d .aipe/study-*/ 2>/dev/null
```

If exactly one matches, extract the descriptor after `study-` and reuse it: `<book-dir>` = `.aipe/audit-refactor-<descriptor>/`. The intent is that `study-ai-journal/` and `audit-refactor-ai-journal/` describe the same project from different angles.

If no study directory exists, derive a new 2-word descriptor from the codebase context, applying the same rules study.md uses:

- The descriptor names *what the app does*, not what it's built with. "Ai journal" is a purpose. "Next.js app" is not.
- **Exactly 2 words** when possible; reach for 3 only if 2 genuinely cannot capture the purpose; never more than 3.
- **Kebab-case, all lowercase.**
- **Concrete nouns and clear adjectives** over marketing language.
- The agent decides `<purpose>` itself from the codebase evidence. Only ask the user one clarifying question if the README and the actual code describe genuinely different purposes.

Set `<book-dir>` = `.aipe/audit-refactor-<purpose>/`.

---

# CREATE MODE

Runs only when no existing book is found.

## Step 5C — Plan the book

Apply the loaded `audit-refactor.md` template. The output is a **six-chapter directory** of markdown files — not a single document, not a flat list. The reader works through each chapter in one sitting and returns to verdicts as reference.

The non-negotiables from the template:

1. **Two voices, kept in their own sections.** Neutral voice for catalog reference, observation, file paths (no opinions, hedging allowed for facts). Staff-engineer voice for takes, tradeoffs, verdicts (first person, direct, **hedging banned**). Mark staff-engineer sections explicitly with `**Take:**` or `**Verdict:**` labels so the reader can skim and find the opinions.
2. **This is not audit-cleanup.** No severity scores, no effort estimates, no fix-now/accept/defer triage. Verdicts are *opinions*, not work items. If the user wants an action list, hand off to `/aipe:audit-cleanup`.
3. **This is not study.md.** Study teaches concepts as they exist in the code. This evaluates what *could be different* about the code.
4. **The reader knows the catalog.** Do not teach Extract Function or Strategy. Do not include "definition" sections. Opine on whether the technique applies, whether it's worth applying, what's at stake.
5. **Every take must reference this specific codebase.** Generic claims ("most codebases benefit from Strategy") are banned. "In this codebase, the three places Strategy would help are X, Y, Z" is required.
6. **Direct is not unkind.** The reader built this codebase. Frame weaknesses as observations and tradeoffs, not failures. The point is to make them think, not feel small.

## Step 6C — Create the directory structure

Create:

```
.aipe/audit-refactor-<purpose>/
```

(Use `mkdir -p`.) The six chapter files live directly under the root — no subdirectories.

## Step 7C — Generate the six chapter files

Write the chapters in this order so each can build on prior context where useful:

```
00-overview.md       The staff-engineer's overall take + reading order
01-composition.md    Opinions on composition refactors
02-structural.md     Opinions on structural refactors
03-patterns.md       Opinions on design pattern opportunities
04-dsa.md            Opinions on DSA-shaped issues
05-principles.md     Opinions on principle violations (walks principles, not techniques)
```

**Chapter shape for 01–04** (the technique-based chapters):

1. `## Chapter N — [Category Name]` heading
2. **One-paragraph category intro** (neutral voice) — what this category is, in 2–3 sentences. No tutorial.
3. **Map of the territory** (neutral voice) — which techniques from this category appear, marked with depth: **DEEP** / **BRIEF** / **MENTION** / **NOT FOUND**. This is the chapter's table of contents.
4. **DEEP sections** (one `###` per technique) — full treatment: Where it shows up (neutral, with file paths and line ranges) → Why it's like this (neutral, when reconstructable) → Take (staff-engineer, with a verdict) → The tradeoff (staff-engineer, including the breakpoint) → What I'd watch for (staff-engineer, the failure mode) → Verdict (one sentence: "Worth doing." / "Worth doing eventually." / "Not worth it." / "Not worth it until [condition]").
5. **BRIEF sections** (one `###` per technique, much shorter) — two paragraphs max: one neutral (where it shows up), one staff-engineer (take + verdict combined).
6. **MENTION line items** — single bullets each. "Extract Variable in `utils.ts:47`. Do it or don't." No further treatment.
7. **Chapter close** (staff-engineer voice, one paragraph) — what pattern emerges from this chapter as a whole? What does it suggest about how the codebase was built?

**Chapter 00 — Overview** has a different shape:
- The codebase in one paragraph (neutral)
- The staff-engineer's overall take (staff-engineer voice, 2–4 paragraphs) — what does this codebase do well? What's the pattern of its weaknesses? What's the one thing I'd change if I could only change one thing?
- Reading order and chapter summaries — one paragraph per chapter (01–05), naming each chapter's overall verdict and recommending a reading order based on which chapters have the highest-stakes content.

**Chapter 05 — Principles** walks the 10 principles from `refactor.md` Section 5 (Single Responsibility, DRY-with-care, Separation of Concerns, Dependency Inversion, Open/Closed, Liskov Substitution, Interface Segregation, Locality of Behaviour, Principle of Least Surprise, Tell-Don't-Ask). For each, same depth grading. DEEP principles get: Where it's violated (neutral) → Why it matters here (staff-engineer) → Is it worth fixing? (staff-engineer — sometimes the answer is no) → Which techniques would address it (neutral, cross-referencing prior chapters). Chapter 05 closes with a paragraph on which principles the codebase honours by default and which it strains against — often the most interesting paragraph in the book.

**Depth grading rules** (apply mechanically, not by personal interest):

- **DEEP** when ALL hold: technique applies in multiple places OR one load-bearing place; the tradeoff is non-obvious; the staff engineer has a real opinion that isn't trivial. A well-balanced chapter has 1–4 DEEP sections.
- **BRIEF** when: applies but isn't load-bearing; tradeoff is mostly clean; or applies in many places with no interesting variation between them.
- **MENTION** when: applies in exactly one place with no real tradeoff; the verdict is obvious.
- **NOT FOUND** when: technique doesn't apply at all. List under the Map of the territory with one line; no section needed.

A chapter with zero DEEP sections is honest — say so in the intro and keep it short. A chapter with eight DEEP sections is probably mis-graded; re-evaluate.

## Step 8C — Report + stop

Print exactly:

```
✓ Audit-refactor book created at .aipe/audit-refactor-<purpose>/
  00-overview.md
  01-composition.md      (DEEP: <N>, BRIEF: <N>, MENTION: <N>)
  02-structural.md       (DEEP: <N>, BRIEF: <N>, MENTION: <N>)
  03-patterns.md         (DEEP: <N>, BRIEF: <N>, MENTION: <N>)
  04-dsa.md              (DEEP: <N>, BRIEF: <N>, MENTION: <N>)
  05-principles.md       (DEEP: <N>, BRIEF: <N>, MENTION: <N>)
```

Then a 3–5 sentence summary: the staff-engineer's overall verdict from `00-overview.md`, which chapter has the highest-stakes content for this codebase, and the recommended reading order.

**Stop. Wait for the user's next instruction.** Do NOT auto-act on verdicts. Do NOT generate a fix list. When the user is ready to act, hand off to `/aipe:audit-cleanup` (triage) and then `/aipe:refactor` (execute one named refactor).

---

# UPDATE MODE

Runs when Step 4 found an existing book. Goal: refresh takes against the current codebase without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing book

Walk `<book-dir>` and read every chapter file: `00-overview.md`, `01-composition.md`, `02-structural.md`, `03-patterns.md`, `04-dsa.md`, `05-principles.md`. Skip any that don't exist (and flag them for regeneration in Step 6U).

## Step 6U — Diff each chapter against the current codebase

For each chapter, walk the relevant technique catalog against the current code:

- **Outdated** — file paths that have moved or been deleted, takes referencing modules that no longer exist, verdicts whose breakpoint has been crossed.
- **New** — techniques whose applicability has changed (e.g., a State Machine pattern that emerged in recent code), or a DEEP section that should be promoted from BRIEF because the codebase grew into it.
- **Stale verdict** — a previous "Not worth it until X" verdict where X has now happened.

Output a structured change plan in this shape:

```
Changes detected for .aipe/audit-refactor-<purpose>/
─────────────────────────────────────────────────

00-overview.md
  Outdated: <e.g. one-thing-I'd-change references a layer that's now refactored>
  New:      <e.g. new top-of-mind concern: AI agent retries>
  Action:   <update the staff-engineer's overall take paragraph>

01-composition.md
  Outdated: Extract Function take referenced api/users.ts, now at api/v2/users.ts
  New:      State Machine pattern emerged in loopd/thread/
  Action:   update file paths in DEEP section 1, promote BRIEF "State Machine" to a new DEEP section

... (one block per chapter)

Files unchanged: <list>
```

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Maintain the two-voice convention. Append a changelog entry at the bottom of each updated chapter:

```
---
Updated: <today's ISO date, e.g. 2026-05-23> — <one-line summary of what changed and why>
```

Do NOT rewrite accurate sections. Do NOT change verdicts unless the underlying take has shifted.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/audit-refactor-<purpose>/
─────────────────────────────────────────────────
Chapters updated:     <list>
Chapters unchanged:   <count or list>
```

**Stop. Wait for the user's next instruction.**
