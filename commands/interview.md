---
description: Prepare to defend a project in an interview (auto-detects existing guide and updates only what changed)
---

The user invoked `/aipe:interview`.

This command takes **no arguments**. There is one interview prep guide per project, saved at `.aipe/specs/interview/`. Since `.aipe/` is already per-project, no extra slug is needed. Re-running `/aipe:interview` from the same project always points at the same directory — UPDATE MODE detects it cleanly.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:interview.`
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

## Step 3 — Load the `interview` template

Read the template at:

```
${CLAUDE_PLUGIN_ROOT}/specs/interview.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/interview.md` upward from this file's location.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/specs/interview/` already contains a prep guide. The signal is the presence of any of the 13 chapter files (`00-preface.md` through `12-appendix-complexity.md`) directly inside, OR a `README.md` at that level.

Also check for legacy formats from earlier versions:

- `.aipe/specs/interview/<anything>/` — directory with a slug (v1.5.0–v1.6.x format)
- `.aipe/specs/interview/<anything>.md` — single file (v1.1.0 and earlier)

**If any of those exist → go to UPDATE MODE (Step 5U onward). Do NOT regenerate from scratch.**

**If none exists → go to CREATE MODE (Step 5C onward).**

---

# CREATE MODE

Runs only when no existing guide is found.

## Step 5C — Plan the prep guide

The interview spec is a book-style prep guide. Too long and too structured for one blob. Plan to generate and save it **chapter by chapter** into a directory of per-chapter markdown files.

Apply the template's structure (loaded in Step 3) and the project context. The template defines 13 files: Preface + 11 chapters + Appendix.

Two requirements from the template that drive every chapter:

1. **Four-part concept structure (Shape / Rule / Failure / Contrast).** Every non-trivial concept in chapters 2–12 must be explained in this shape — not as a bullet list, as four short connected paragraphs. The template's `## Explaining Concepts` meta-section (rendered at the top of `01-system-architecture.md`) defines it; subsequent chapters apply it. Skip the structure for trivial decisions — forcing it makes the document feel bureaucratic.

2. **Elaboration requirements per chapter.**
   - At least 3 non-trivial concepts explained with the four-part structure.
   - At least 1 ASCII diagram (more for complex chapters).
   - 3 interview questions, one each at `[mid]` / `[senior]` / `[arch]`.
   - Each model answer ≥ 150 words, named files / functions / decisions.
   - The hard question answered in ≥ 200 words.

Every chapter is grounded in concrete details from the project context: real file names, real decisions, real constraints. No generic advice. No placeholder brackets. No hedging language.

## Step 6C — Create the output directory

Directory: `.aipe/specs/interview/`

Create it. (We're guaranteed to be here only if Step 4 confirmed it didn't already exist.)

## Step 7C — Generate and save each chapter sequentially

For each row below: compose only that chapter's content, applying the chapter shape from the template (Opening → ASCII diagram → Concept explanations using the four-part structure → 3 interview questions labelled `[mid]` `[senior]` `[arch]` with model answers → the hard question), then immediately Write it to the named file before moving on.

| File | Section |
|---|---|
| `00-preface.md` | Preface: What this project is really about |
| `01-system-architecture.md` | Chapter 1: System architecture (open with the `## Explaining Concepts` meta-section before any project-specific content) |
| `02-frontend-engineering.md` | Chapter 2: Frontend engineering |
| `03-backend-api.md` | Chapter 3: Backend and API design |
| `04-ai-engineering.md` | Chapter 4: AI engineering |
| `05-data-modelling.md` | Chapter 5: Data modelling |
| `06-reliability.md` | Chapter 6: Reliability and error handling |
| `07-developer-process.md` | Chapter 7: Developer process |
| `08-ownership-judgment.md` | Chapter 8: Ownership and judgment |
| `09-dsa.md` | Chapter 9: Data structures and algorithms |
| `10-what-id-do-differently.md` | Chapter 10: What I'd do differently |
| `11-defending-ai-work.md` | Chapter 11: Defending AI-assisted work |
| `12-appendix-complexity.md` | Appendix: Complexity cheat sheet |

The template names the specific concepts each chapter must apply the four-part structure to (e.g., for Chapter 1 — auth middleware pattern, serverless function boundary, storage abstraction, provider switching). Read those carefully and let them drive each chapter's content.

If a chapter doesn't apply to this project (e.g., Chapter 4 — AI engineering — for a project with no AI surface), still write the file but keep it short and explicit about why. Don't fabricate concepts to hit the 3-concept minimum.

## Step 8C — Generate the table of contents

After all 13 chapter files are written, create `README.md` in the same directory containing:

- Title: `# Interview prep: <project name derived from the cwd basename, or from .aipe/project/context.md if it names the project>`
- One sentence describing the project being defended.
- A markdown list linking to all 13 files in order, each with a 1-line summary drawn from the chapter you actually wrote.

## Step 9C — Report + stop

Print exactly:

```
✓ Interview prep guide created at .aipe/specs/interview/
  13 chapters + README.md table of contents
```

Then a 3-sentence summary: what the project under defence is, which chapters were most substantive given the project's actual surface area, and which chapters are intentionally light (e.g., no DB → Chapter 5 is brief).

**Stop. Wait for the user's next instruction.** They'll typically pick a chapter to drill on, request a revision, or ask for a quiz. Do NOT auto-quiz or auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: make the guide accurate again without losing the depth already there. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

The guide may be in one of three layouts. Identify which:

- **Canonical (current)**: chapter files directly in `.aipe/specs/interview/` (e.g., `00-preface.md`, `01-system-architecture.md`, ..., `12-appendix-complexity.md`, `README.md`). Read every `.md` file.
- **Legacy slug-subdirectory (v1.5.0–v1.6.x)**: chapter files inside `.aipe/specs/interview/<some-slug>/`. Read every `.md` file inside the slug subdirectory. Note the slug name — you'll migrate to canonical layout in Step 8U.
- **Legacy single-file (v1.1.0 and earlier)**: `.aipe/specs/interview/<some-name>.md`. Read it as one document. You'll split it into 13 chapter files in Step 8U.

Build a mental model of what the guide currently says — chapters, decisions, diagrams, tradeoffs, file references — regardless of which layout you found it in.

Build a mental model of what the guide currently contains: which decisions it explains, which diagrams it has, which tradeoffs it names, which files it references.

## Step 6U — Diff the guide against the current codebase

Re-read the project context loaded in Step 2 — that's "the codebase as of now". Compare against what the guide says.

For every chapter (or every section in a legacy file), identify:

- **Outdated** — references to stale files, decisions that have changed, patterns that no longer exist
- **Missing** — new concepts introduced by the codebase changes that the guide doesn't cover
- **Still accurate** — leave these alone
- **Partially accurate** — update the specific section, not the whole chapter

Look for the kinds of changes flagged in the template:

- New / removed / renamed files or modules
- Changed data models or schema
- New / swapped dependencies
- New / removed features
- Changed architectural decisions
- New phases completed or started

## Step 7U — Output the change plan and STOP for confirmation

Print a structured summary in this exact shape:

```
Changes detected for .aipe/specs/interview/
─────────────────────────────────────────────────

Chapter 01 — System architecture
  Outdated: <what specifically is stale and why>
  Missing:  <what new content is needed>
  Action:   <update section X / add concept Y / no change>

Chapter 03 — Backend and API design
  Outdated: <...>
  Missing:  <...>
  Action:   <...>

[continue for every chapter that needs work; SKIP chapters that don't]

─────────────────────────────────────────────────
Reply "yes" to apply all changes.
Reply with a chapter number (e.g. "03") to update only that chapter.
Reply "no" to abort.
```

**Stop here. Wait for the user's reply.** Do NOT proceed to apply changes until the user confirms.

## Step 8U — Apply changes (after user confirms)

Run only after the user replies "yes" or with a chapter number. For each chapter approved:

- Edit only the sections identified as outdated or missing.
- Do NOT rewrite accurate sections.
- Maintain the existing voice and structure (first person, four-part shape, tone).
- Apply the four-part Shape / Rule / Failure / Contrast structure to any new concepts you add.
- Update `README.md` if any chapter's 1-line summary changes.
- Append a changelog entry at the bottom of each updated chapter file:

  ```
  ---
  Last updated: <today's ISO date, e.g. 2026-05-06>
  Changes: <one-line summary of what changed and why>
  ```

**Legacy migration on first update:**

- If the existing guide was in `.aipe/specs/interview/<some-slug>/`: move the chapter files (and `README.md`) up to `.aipe/specs/interview/` directly while applying updates, then `rmdir` the now-empty slug subdirectory. Future updates edit canonical layout in place.
- If the existing guide was a single `.aipe/specs/interview/<some-name>.md`: split it into the 13 chapter files of the canonical layout while applying updates, then delete the legacy single file.

After either migration, the guide is in canonical layout and subsequent UPDATE runs are simple in-place edits.

Do NOT create new chapter files unless a chapter was missing entirely (e.g., the legacy single file lacked an Appendix, or the directory had no `04-ai-engineering.md` because the project didn't have AI when the guide was first written).

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/specs/interview/
─────────────────────────────────────────────────
Chapters updated:           <list, e.g. 03, 06>
Chapters unchanged:         <list>
New concepts added:         <list with chapter, e.g. "rate-limiter pattern (ch 06)">
Stale content removed:      <list with chapter>
Files referenced that no
  longer exist:             <list — these need manual review>
```

**Stop. Wait for the user's next instruction.** Do NOT auto-quiz or auto-revise further.
