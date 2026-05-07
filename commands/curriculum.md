---
description: Turn a codebase into a learning resource
argument-hint: <intent...>
---

The user invoked `/aipe:curriculum` with intent: `$ARGUMENTS`.

`$ARGUMENTS` is **optional** for this command. If empty or only whitespace, derive a default slug from the current working directory's basename (lowercase, hyphenate non-alphanumerics). This way re-running `/aipe:curriculum` from the same project always points at the same curriculum directory.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:curriculum $ARGUMENTS.`
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

## Step 3 — Load the `curriculum` template

Read the template at:

```
${CLAUDE_PLUGIN_ROOT}/specs/curriculum.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/curriculum.md` upward from this file's location.

## Step 4 — Plan the curriculum

The curriculum spec produces a structured learning resource — too long and too multi-themed for a single file. Save it as a **directory** of per-category chapter files, with a final ordered learning path and a README.md table of contents.

Apply the template (loaded in Step 3) to the project context and the user's intent (`$ARGUMENTS`). The template names 5 fixed categories of concepts to extract:

- Agentic AI
- Systems thinking
- Thinking in code
- AI product engineering
- Language-agnostic

Plan to walk these in order: for each category, identify the concepts present in the project's codebase, then write a chapter that explains each concept using the template's four-part structure (What it is / Where it lives / Why it exists / General rule).

## Step 5 — Determine the output directory

Compute the slug:

- If `$ARGUMENTS` is non-empty: lowercase it, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars.
- If `$ARGUMENTS` is empty or whitespace-only: use the lowercase basename of the current working directory (`$PWD`), with non-alphanumerics replaced by `-`, repeats collapsed, trimmed to 60 chars. (E.g., running in `~/Public/buffr/` → slug is `buffr`.)

Directory: `.aipe/specs/curriculum/<slug>/`

If the directory already exists, append an ISO timestamp: `.aipe/specs/curriculum/<slug>-<YYYY-MM-DDTHH-MM-SS>/`. **Never overwrite.**

Create the directory.

## Step 6 — Generate and save each category chapter sequentially

For each row in the table below: identify the concepts in the project that fit the category, compose the chapter (one concept per subsection, each with the four-part structure), then immediately Write the file before moving on.

| File | Category |
|---|---|
| `00-overview.md` | Why this curriculum exists for THIS codebase, how to study it (read → find → explain back) |
| `01-agentic-ai.md` | LLM vs agent, tool calling, ReAct loop, memory patterns, orchestration, prompt chaining |
| `02-systems-thinking.md` | Separation of concerns, data flow, storage abstraction, idempotency, migration strategies, race conditions |
| `03-thinking-in-code.md` | Type-driven design, schema-first dev, error classification, optimistic UI, provider abstraction, rollback patterns |
| `04-ai-product-engineering.md` | Context window management, spec-driven dev, memory bank patterns, evaluation, cost vs capability tradeoffs |
| `05-language-agnostic.md` | Patterns or mental models that transfer across stacks |

Each concept inside a chapter follows the template's four-part structure:
- **What it is** — formal definition, 2–3 sentences
- **Where it lives** — specific file, function, or pattern in this codebase
- **Why it exists** — what problem it solves in this specific context
- **General rule** — the transferable principle beyond this codebase

Mark difficulty per concept (foundational / intermediate / advanced) and note "Go deeper" links or follow-up reading where relevant.

If a category has no concepts in this codebase (e.g., a pure data app has nothing in `01-agentic-ai`), still write the file but keep it short and explicit about why ("This codebase has no agentic component. If you want to learn this category, the closest analog here is …, or move on to `02-systems-thinking`.").

## Step 7 — Generate the curriculum-path chapter

After all 6 category chapters are written, create `06-curriculum-path.md` containing the ordered learning path:

- Order concepts across all categories by dependency (prerequisites before advanced topics).
- Group thematically when concepts cluster naturally.
- Mark each entry with its difficulty and a link back to the chapter+section where it's explained.
- End with "Suggested next steps" — what to read, build, or explore to go deeper.

## Step 8 — Generate the table of contents

After the curriculum-path chapter exists, create `README.md` in the same directory containing:

- Title: `# Curriculum: <intent from $ARGUMENTS, or the project name derived from cwd basename if no intent given>`
- One sentence describing the codebase being studied.
- A markdown list linking to all 7 files in order, each with a 1-line summary drawn from what you actually wrote (not the template's generic descriptions).
- A flat **concept index** at the bottom: every concept you covered, with its category, difficulty, and a link to its chapter section.

## Step 9 — Report + stop

Print exactly:

```
✓ Curriculum saved to .aipe/specs/curriculum/<slug>/
  6 category chapters + curriculum-path + README.md table of contents
```

Then a 3-sentence summary: which categories were richest given this codebase's actual surface area, which were intentionally light or skipped, and which 2–3 concepts you'd recommend studying first.

**Stop. Wait for the user's next instruction.** They'll typically pick a concept to drill on, ask for an exercise, or request a revision. Do NOT auto-quiz, auto-revise, or implement anything.
