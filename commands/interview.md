---
description: Prepare to defend a project in an interview
argument-hint: <intent...>
---

The user invoked `/aipe:interview` with intent: `$ARGUMENTS`.

If `$ARGUMENTS` is empty or only whitespace, ask the user for a brief intent (one short sentence describing what to spec) and stop. Don't proceed without an intent.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:interview $ARGUMENTS.`
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

## Step 4 — Plan the prep guide

The interview spec is a book-style prep guide. It is too long and too structured to compose as one blob. Plan to generate and save it **chapter by chapter** into a directory of per-chapter markdown files.

Apply the template structure (loaded in Step 3) and the project context to the user's intent (`$ARGUMENTS`). The template defines 13 files: Preface + 11 chapters + Appendix.

Two requirements from the template that drive every chapter:

1. **Four-part concept structure (Shape / Rule / Failure / Contrast).** Every non-trivial concept in chapters 2–12 must be explained in this shape — not as a bullet list, as four short connected paragraphs. The template's `## Explaining Concepts` meta-section (rendered at the top of `01-system-architecture.md`) defines it; subsequent chapters apply it. Skip the structure for trivial decisions ("we use TypeScript strict mode") — forcing it makes the document feel bureaucratic.

2. **Elaboration requirements per chapter.**
   - At least 3 non-trivial concepts explained with the four-part structure.
   - At least 1 ASCII diagram (more for complex chapters).
   - 3 interview questions, one each at `[mid]` / `[senior]` / `[arch]`.
   - Each model answer ≥ 150 words, named files / functions / decisions.
   - The hard question answered in ≥ 200 words.

Every chapter is grounded in concrete details from the project context: real file names, real decisions, real constraints. No generic advice. No placeholder brackets. No hedging language.

## Step 5 — Determine the output directory

Compute the slug from `$ARGUMENTS`: lowercase, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars. If empty, use `spec`.

Directory: `.aipe/specs/interview/<slug>/`

If the directory already exists, append an ISO timestamp: `.aipe/specs/interview/<slug>-<YYYY-MM-DDTHH-MM-SS>/`. **Never overwrite.**

Create the directory.

## Step 6 — Generate and save each chapter sequentially

For each row in the table below: compose only that chapter's content, applying the chapter shape from the template (Opening → ASCII diagram → Concept explanations using the four-part structure → 3 interview questions labelled `[mid]` `[senior]` `[arch]` with model answers → the hard question), then immediately Write it to the named file before moving on.

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

If a chapter doesn't apply to this project (e.g., Chapter 4 — AI engineering — for a project with no AI surface), still write the file but keep it short and explicit about why ("this project has no AI component; if asked, the answer to lean on is …"). Don't fabricate concepts to hit the 3-concept minimum.

## Step 7 — Generate the table of contents

After all 13 chapter files are written, create `README.md` in the same directory containing:

- Title: `# Interview prep: <intent from $ARGUMENTS>`
- One sentence describing the project being defended.
- A markdown list linking to all 13 files in order, each with a 1-line summary drawn from the chapter you actually wrote (not the template's generic description).

## Step 8 — Report + stop

Print exactly:

```
✓ Interview prep guide saved to .aipe/specs/interview/<slug>/
  13 chapters + README.md table of contents
```

Then a 3-sentence summary: what the project under defence is, which chapters were most substantive given the project's actual surface area, and which chapters are intentionally light (e.g., no DB → Chapter 5 is brief).

**Stop. Wait for the user's next instruction.** They'll typically pick a chapter to drill on, request a revision, or ask for a quiz. Do NOT auto-quiz or auto-revise.
