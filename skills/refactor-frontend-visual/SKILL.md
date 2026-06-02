---
name: refactor-frontend-visual
description: Frontend visual refactor — CSS, design tokens, semantic HTML; same pixels, no new capability
argument-hint: <what to refactor + why>
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

The user invoked `/aipe:refactor-frontend-visual` with intent: `$ARGUMENTS`.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:refactor-frontend-visual $ARGUMENTS.`
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

## Step 3 — Load all three templates

Visual refactors extend behaviour refactors, which extend the general refactor template. Read all three:

```
${CODEX_PLUGIN_ROOT}/specs/refactor.md
${CODEX_PLUGIN_ROOT}/specs/refactor-frontend-behaviour.md
${CODEX_PLUGIN_ROOT}/specs/refactor-frontend-visual.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching upward from this file's location.

## Step 4 — Scope gate (reject feature work disguised as refactor)

Before composing the spec, gate the intent against the spec's explicit "What's NOT in scope" list. The following CANNOT be filled as a visual refactor spec — the command must refuse and tell the user where the work belongs:

- Adding keyboard navigation that didn't exist → feature spec
- Adding focus management (focus on route change, focus trapping) → feature spec
- Adding screen reader announcements / ARIA live regions → feature spec
- Adding skip links / landmarks where none existed → feature spec
- Fixing colour contrast (changes appearance) → bug fix / design fix
- Restyling components (changes appearance) → feature spec / design fix
- Responsive breakpoint changes that alter layout → design fix
- Adding new design tokens for capabilities that didn't exist → feature spec

**The discipline:** if the pixels change or a user can now do something they couldn't before, it's not a refactor. Refuse with a one-sentence reason and the correct destination (feature spec, fix mini-spec, etc.).

## Step 5 — Compose the filled refactor spec

Apply the spec format from `refactor-frontend-visual.md` (adds `## Styling context` and visual-specific `## Must not change` items).

The non-negotiables from the templates:

1. **Name the technique from the visual vocabulary.** The 7 categories: CSS naming/methodology (Adopt BEM Consistently, Adopt CSS Modules Consistently, ...), Specificity/cascade (Flatten Selector Depth, Remove `!important`, Replace ID Selectors, Adopt Cascade Layers, ...), Scope/organization (Scope Global Styles, Co-locate Styles with Component, Decompose Mega-Stylesheet, Remove Dead Styles, ...), Design tokens/theme (Extract Literal to Token, Consolidate Duplicate Tokens, Restructure Token Hierarchy, ...), Variants/composition (Consolidate Variant Props, Extract Variant System via CVA, Compose Instead of Configure, ...), Semantic HTML (Replace Div-with-Click with Button, Use Landmark Elements, Use Heading Hierarchy Correctly, ...), CSS framework cleanups (Replace Utility Sprawl with Component, Replace Custom CSS with Framework Utility, Adopt Framework Theming Primitives, ...).
2. **"Same pixels" is the verification gate.** The `## Must not change` block MUST include: rendered pixels (same visual output, verified by screenshot or eye), responsive behaviour at all breakpoints, interactive states (hover, focus, active, disabled), animations/transitions (same timing, easing, triggers), print styles, dark mode, high-contrast mode, keyboard behaviour, focus visibility, screen reader output, DOM structure where it matters for selectors/tests/third-party scripts. Compiling without errors means nothing here.
3. **`## Styling context` is required.** Name what the codebase uses (BEM, Tailwind, CSS Modules, vanilla-extract, styled-components, plain CSS, etc.) so "Adopt X Consistently" is concrete.
4. **CSS specificity is fragile.** Whenever selectors change, file order changes, or methodology changes, the specificity graph shifts. The spec must call out: verify the cascade hasn't moved.
5. **Test the visual edges.** Empty states, very long text, missing images, slow networks, RTL, very small and very large screens, browser zoom, OS font-size scaling. These are where visual refactors silently break.
6. **`## Done when` is non-negotiable.** Always include: visual diff is empty (screenshot comparison or manual check), existing tests pass, all viewports/themes/modes verified, no new console warnings (especially CSS warnings).
7. **Methodology migration warning.** "Adopt Methodology B in a codebase using A" is a *large* refactor, not one spec. The command must split it: write a target-methodology spec first, then one spec per file/component for the conversion. A half-converted codebase is worse than a consistent old-methodology one.
8. **Semantic HTML refactors ripple.** A `<div>` → `<button>` brings default browser styles, default focus behaviour, and (inside `<form>`) potential default submission. The `## Must not change` block must call out resetting these defaults explicitly so the visual stays identical.
9. **Dead style removal needs verification.** "Doesn't match anything in the codebase" misses styles applied dynamically via JS, by third-party scripts, or by CMS content. The spec must include a verification step before deletion.

Composition rules:
- Replace every `[bracket placeholder]` with concrete content.
- All file names and paths must match the actual project.
- The "Must not change" block must include the project-specific constraints from `.aipe/project/context.md` in addition to the standard visual list.
- Output ONLY the filled spec body — no preamble, no commentary about the process.

## Step 6 — Save the spec

Compute the slug from `$ARGUMENTS`: lowercase, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars. If empty, use `spec`.

Path: `.aipe/specs/refactors/visual-<slug>.md`

If that file already exists, append an ISO timestamp: `.aipe/specs/refactors/visual-<slug>-<YYYY-MM-DDTHH-MM-SS>.md`. **Never overwrite.**

Create parent directories as needed and write the filled spec.

## Step 7 — Report + stop

Print exactly:

```
✓ Spec saved to <path>
```

Then a 3-sentence summary: the refactor type chosen, the visual surface it addresses (naming / specificity / scope / tokens / variants / semantic HTML / framework), and the verification method the spec specifies for "same pixels."

**Stop. Wait for the user's next instruction.** Do NOT auto-execute the refactor.
