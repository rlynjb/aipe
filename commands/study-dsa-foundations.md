---
description: DSA Foundations study guide — the reusable data-structures-and-algorithms vocabulary behind the repo, including important foundations the repo does not currently exercise
---

The user invoked `/aipe:study-dsa-foundations`.

This command takes **no arguments**. There is one `dsa foundations` artifact per repo at `.aipe/study-dsa-foundations/`. Re-running enters UPDATE MODE when the artifact already exists.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/specs/`, write a short project-context placeholder covering stack, data model, file structure, and must-not-change constraints, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-dsa-foundations.`, and stop.

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, and optional matching files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/study-dsa-foundations.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location. Follow the generator spec's topic boundary and persona posture exactly.

## Step 4 — Detect CREATE or UPDATE

Check `.aipe/study-dsa-foundations/` for `00-overview.md` or any numbered markdown artifact. Existing content means UPDATE; otherwise CREATE.

## Step 5 — Audit and plan

Read the repo before writing. Inventory real evidence with `file:line` anchors, distinguish observations from inferences, keep the generator's partition seam sharp, and emit `not yet exercised` rather than inventing behavior. Print one plan and wait for one confirmation before editing.

## Step 6 — Execute

In CREATE mode, generate the complete artifact declared by `specs/study-dsa-foundations.md`. In UPDATE mode, reconcile surgically against current code: add newly relevant material, update changed evidence, preserve correct teaching, and remove stale claims.

## Step 7 — Report

Print the mode, files created/updated/removed, ranked findings, `not yet exercised` areas, and cross-links to adjacent generators.
