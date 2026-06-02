---
description: Per-codebase system-design guide — architecture, boundaries, flows, state ownership, failure handling, and scale
---

The user invoked `/aipe:study-system-design`.

This command takes **no arguments**. There is one system-design guide per repo at `.aipe/study-system-design/`. Re-running enters UPDATE MODE when the guide already exists.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/specs/`, write a short project-context placeholder covering stack, data model, file structure, and must-not-change constraints, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-system-design.`, and stop.

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, and optional matching files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-system-design.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file's location. Follow the system-design partition seam exactly: this guide owns architecture, not reusable DSA curriculum.

## Step 4 — Detect CREATE or UPDATE and legacy content

Check `.aipe/study-system-design/` for `00-overview.md` or numbered markdown artifacts. Existing content means UPDATE; otherwise CREATE.

Also check for the former combined folder `.aipe/study-system-design-dsa/`. If it exists, report it as a legacy archive. Explain that architecture now moves to `.aipe/study-system-design/` and DSA learning moves to `.aipe/study-dsa-foundations/`. Do not silently delete or overwrite the legacy folder.

## Step 5 — Audit and plan

Read the repo before writing. Inventory real architectural evidence with `file:line` anchors, distinguish observations from inferences, and emit `not yet exercised` rather than inventing infrastructure or scale. Print one plan and wait for one confirmation before editing.

## Step 6 — Execute

In CREATE mode, generate the complete artifact declared by `specs/study-system-design.md`. In UPDATE mode, reconcile surgically against current code: add newly relevant boundaries and patterns, update changed evidence, preserve correct teaching, and remove stale claims.

Do not recreate `02-dsa/`. Cross-link algorithm and data-structure learning to `.aipe/study-dsa-foundations/`.

## Step 7 — Report

Print the mode, files created/updated/removed, ranked architectural findings, `not yet exercised` areas, foundation-guide cross-links, and any legacy archive note.
