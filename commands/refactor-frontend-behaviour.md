---
description: Frontend behaviour refactor — state, effects, components, data flow; pixels stay identical
argument-hint: <what to refactor + why>
---

The user invoked `/aipe:refactor-frontend-behaviour` with intent: `$ARGUMENTS`.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:refactor-frontend-behaviour $ARGUMENTS.`
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

Read the general refactor template AND the frontend-behaviour template (the latter extends the former):

```
${CLAUDE_PLUGIN_ROOT}/specs/refactor.md
${CLAUDE_PLUGIN_ROOT}/specs/refactor-frontend-behaviour.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/refactor.md` and `specs/refactor-frontend-behaviour.md` upward from this file's location.

## Step 4 — Compose the filled refactor spec

Apply the spec format from `refactor-frontend-behaviour.md` (which adds `## Framework context` and a stricter `## Must not change` block on top of the general format).

The non-negotiables from the templates:

1. **Name the technique from the frontend vocabulary.** The 7 categories: State placement (Lift State, Lower State, Move to Server State, Collapse Redundant State, ...), Component structure (Extract Component, Extract Reusable Logic via Custom Hook/Composable, Split Container/Presentation, ...), Effect/lifecycle (Extract Effect, Move Effect to Event Handler, Replace Effect with Derived Value, Add Cleanup, ...), Rendering/performance (Memoize Component, Code-Split, Virtualize Long List, Reduce Re-Render Scope, ...), Data flow (Replace Prop Drilling, Invert Event Flow, Stabilize Object/Array Identity, ...), Styling (Promote Style to Design Token, Move Computed Style to State-Driven Class, ...), DSA-flavoured (Key-Based Reconciliation Fix, Batch State Updates, Debounce User Input, ...). General composition refactors from `refactor.md` (Extract Function, Rename, Move) still apply — pick those when they fit.
2. **Same-behaviour bar is stricter than backend.** Frontend has visible side effects: what's on screen, what's focused, what re-renders, what fires what event, what gets requested. The `## Must not change` block MUST include: visible UI behaviour (same renders, same user-observable output), event semantics (same events fire in the same order), network/storage behaviour (same requests, same writes), accessibility (keyboard, focus, ARIA, screen reader output stays identical). A refactor that keeps return values identical but changes when a component re-renders has changed behaviour.
3. **`## Framework context` is required.** Name the framework + version + any relevant idioms (React 18 vs 19, Vue 3 Composition vs Options API, Svelte 5 runes, etc.). This narrows what "Extract Reusable Logic" means concretely.
4. **One refactor type per spec, one spec per session.** Frontend refactors are especially dangerous to combine because the surfaces interact: a state placement change affects rendering, which affects perf. Split, don't combine.
5. **Performance refactors only on measured problems.** "Frontend perf intuition is unreliable — the actual bottleneck is rarely where it feels like it is." If `$ARGUMENTS` names a perf refactor without a measurement, the spec must include a `## Done when` step that measures before and after.
6. **`## Done when` is non-negotiable.** Always include: existing tests pass, manual smoke test of affected screens, no new console warnings or errors. For perf refactors, add a measurable threshold.
7. **System design changes are not refactors.** If the intent really wants to change rendering strategy (CSR → SSR), state architecture (lift everything to a global store), or boundaries (introduce error boundaries that didn't exist), the spec must reject it with a one-line note pointing the user at a feature spec or a separate design doc.

Composition rules:
- Replace every `[bracket placeholder]` with concrete content.
- All file names and paths must match the actual project.
- The "Must not change" block must include the project-specific constraints from `.aipe/project/context.md`'s "What must not change" section in addition to the standard frontend list.
- Output ONLY the filled spec body — no preamble, no commentary about the process.

## Step 5 — Save the spec

Compute the slug from `$ARGUMENTS`: lowercase, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars. If empty, use `spec`.

Path: `.aipe/specs/refactors/frontend-<slug>.md`

If that file already exists, append an ISO timestamp: `.aipe/specs/refactors/frontend-<slug>-<YYYY-MM-DDTHH-MM-SS>.md`. **Never overwrite.**

Create parent directories as needed and write the filled spec.

## Step 6 — Report + stop

Print exactly:

```
✓ Spec saved to <path>
```

Then a 3-sentence summary: the refactor type chosen, the frontend dimension it addresses (state / structure / effects / rendering / data flow / styling / DSA), and any open questions the user might want to clarify before execution — especially around measurement bars if it's a perf refactor.

**Stop. Wait for the user's next instruction.** Do NOT auto-execute the refactor.
