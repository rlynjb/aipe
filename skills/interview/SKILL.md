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
${CODEX_PLUGIN_ROOT}/specs/interview.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/interview.md` upward from this file's location.

## Step 4 — Plan the prep guide

The interview spec is a book-style prep guide. It is too long and too structured to compose as one blob. Plan to generate and save it **chapter by chapter** into a directory of per-chapter markdown files.

Apply the template structure (loaded in Step 3) and the project context to the user's intent (`$ARGUMENTS`). The template defines 13 sections:

- Preface
- Chapters 1 through 11
- Appendix

Each section should be grounded in concrete details from the project context: real file names, real decisions, real constraints. No generic advice. No placeholder brackets.

## Step 5 — Determine the output directory

Compute the slug from `$ARGUMENTS`: lowercase, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars. If empty, use `spec`.

Directory: `.aipe/specs/interview/<slug>/`

If the directory already exists, append an ISO timestamp: `.aipe/specs/interview/<slug>-<YYYY-MM-DDTHH-MM-SS>/`. **Never overwrite.**

Create the directory.

## Step 6 — Generate and save each chapter sequentially

For each row in the table below: compose only that chapter's content, applying the template's per-chapter structure (opening narrative → ASCII diagram → 3 questions labelled `[mid]` `[senior]` `[arch]` → model answers → "the hard question"), then immediately Write it to the named file before moving on.

| File | Section |
|---|---|
| `00-preface.md` | Preface: What this project is really about |
| `01-system-architecture.md` | Chapter 1: System architecture |
| `02-frontend-engineering.md` | Chapter 2: Frontend engineering |
| `03-backend-and-api-design.md` | Chapter 3: Backend and API design |
| `04-ai-engineering.md` | Chapter 4: AI engineering |
| `05-data-modelling.md` | Chapter 5: Data modelling |
| `06-reliability-and-error-handling.md` | Chapter 6: Reliability and error handling |
| `07-developer-process.md` | Chapter 7: Developer process |
| `08-ownership-and-judgment.md` | Chapter 8: Ownership and judgment |
| `09-data-structures-and-algorithms.md` | Chapter 9: Data structures and algorithms |
| `10-what-id-do-differently.md` | Chapter 10: What I'd do differently |
| `11-defending-ai-assisted-work.md` | Chapter 11: Defending AI-assisted work |
| `12-appendix-complexity-cheat-sheet.md` | Appendix: Complexity cheat sheet |

If a chapter doesn't apply to this project (e.g., Chapter 4 — AI engineering — for a project with no AI surface), still write the file but keep it short and explicit about why ("this project has no AI component; if asked, the answer to lean on is …").

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
