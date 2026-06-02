---
name: refactor
description: Restructure without changing behaviour — name the technique, scope it tight
argument-hint: <what to refactor + why>
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

The user invoked `/aipe:refactor` with intent: `$ARGUMENTS`.

If `$ARGUMENTS` is empty or only whitespace, ask the user for a brief intent (one short sentence — what to refactor and why) and stop. Don't proceed without an intent.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:refactor $ARGUMENTS.`
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

## Step 3 — Load the `refactor` template

Read the template at:

```
${CODEX_PLUGIN_ROOT}/specs/refactor.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/refactor.md` upward from this file's location.

## Step 4 — Compose the filled refactor spec

Apply the spec format from the loaded template (the `## What to refactor` / `## Why` / `## Refactor type` / ... block) to the project context and the user's intent (`$ARGUMENTS`).

The non-negotiables from the template:

1. **Name the technique.** "Refactor type" is the single most important field. Use a name from the vocabulary catalog in the loaded template — composition (Extract Function, Rename, Move, ...), structural (Extract Module, Invert Dependency, Separate Pure from Effectful, ...), pattern (Strategy, Adapter, Factory, ...), or DSA (Change Data Structure, Replace Quadratic with Linear, ...). "Clean up X" / "Make X better" / "Improve X" are not refactor types and the spec must reject them.
2. **Pick the smallest type that fixes the diagnosis.** Composition < structural < pattern < DSA. When multiple types could fix the same problem, prefer the smaller one — its blast radius is smaller and the verification is easier.
3. **One refactor type per spec, one spec per session.** If the intent names more than one technique ("extract a function AND rename it"), split into multiple specs and tell the user. Combining types is how scope creeps.
4. **`## Why` must name the principle being violated.** Single Responsibility, DRY-with-care, Separation of Concerns, Dependency Inversion, etc. — pulled from the Principles section of the template. "Code is messy" is not a diagnosis.
5. **`## Must not change` is non-negotiable.** Always include: external API/interface stays identical, no behaviour change (same input → same output), `Do not touch [specific files]`. Add any project-specific constraints from `.aipe/project/context.md`'s "What must not change" section.
6. **`## Must not introduce` is non-negotiable.** Always include: no new dependencies, no new abstractions not discussed in this spec, no additional refactors discovered along the way (surface them as separate specs).
7. **`## Done when` must be verifiable.** Existing tests pass / feature still works end-to-end / equivalent measurement. "Looks cleaner" is not a done condition.

Composition rules:
- Replace every `[bracket placeholder]` with concrete content.
- All file names and paths must match the actual project (from the context files).
- The "Must not change" and "Must not introduce" sections must reflect real project constraints, not generic advice.
- Output ONLY the filled spec body — no preamble, no commentary about the process.

## Step 5 — Save the spec

Compute the slug from `$ARGUMENTS`: lowercase, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars. If empty, use `spec`.

Path: `.aipe/specs/refactors/<slug>.md`

If that file already exists, append an ISO timestamp: `.aipe/specs/refactors/<slug>-<YYYY-MM-DDTHH-MM-SS>.md`. **Never overwrite.**

Create parent directories as needed and write the filled spec.

## Step 6 — Report + stop

Print exactly:

```
✓ Spec saved to <path>
```

Then a 3-sentence summary: the refactor type chosen, the principle being addressed, and any open questions the user might want to clarify before execution.

**Stop. Wait for the user's next instruction.** Do NOT auto-execute the refactor — that's a separate session with the spec as the only input.
