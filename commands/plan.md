---
description: Multi-phase project plan you can resume across sessions
argument-hint: <intent...>
---

The user invoked `/aipe:plan` with intent: `$ARGUMENTS`.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:plan $ARGUMENTS.`
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

## Step 3 — Load the `plan` template

Read the template at:

```
${CLAUDE_PLUGIN_ROOT}/specs/plan.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/plan.md` upward from this file's location.

## Step 4 — Compose the filled spec

Apply the template structure to the project context and the user's intent (`$ARGUMENTS`). Use your own model — this is what you're already doing in this conversation, no external API call.

Rules:
- Replace every `[bracket placeholder]` with concrete content.
- All file names and paths must match the actual project (from the context files).
- Constraints sections must reflect real project constraints, not generic advice.
- Output ONLY the filled spec body — no preamble, no commentary.

## Step 5 — Save the spec

Compute the slug from `$ARGUMENTS`: lowercase, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars. If empty, use `spec`.

Path: `.aipe/specs/plans/<slug>.md`

If that file already exists, append an ISO timestamp: `.aipe/specs/plans/<slug>-<YYYY-MM-DDTHH-MM-SS>.md`. **Never overwrite.**

Create parent directories as needed and write the filled spec.

## Step 6 — Report + stop

Print exactly:

```
✓ Spec saved to <path>
```

Then give a 3-sentence summary of what the spec covers (the main sections, the key decisions baked in, any open questions the user might want to clarify).

**Stop. Wait for the user's next instruction.** Do NOT auto-implement.
