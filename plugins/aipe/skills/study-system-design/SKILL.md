---
name: study-system-design
description: Per-codebase system-design guide — architecture, boundaries, flows, state ownership, failure handling, and scale
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

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

Check `.aipe/study-system-design/` for `00-overview.md`, `audit.md`, or numbered markdown artifacts. Existing content means UPDATE; otherwise CREATE.

Also check for the former combined folder `.aipe/study-system-design-dsa/`. If it exists, report it as a legacy archive. Explain that architecture now moves to `.aipe/study-system-design/` and DSA learning moves to `.aipe/study-dsa-foundations/`. Do not silently delete or overwrite the legacy folder.

Also check for the **legacy nested layout** `.aipe/study-system-design/01-system-design/`. Older runs of this generator placed concept files inside that sub-directory; the current layout is flat at the root of `.aipe/study-system-design/`. If the nested folder is present, flag it in the plan and ask the user whether to move its files up one level (and remove the empty sub-dir) or leave it as archive. Do not silently relocate files.

Also check for the **legacy fixed-file-list layout** — files named after the 8 audit lenses, e.g. `01-system-map-and-boundaries.md`, `02-request-response-and-data-flow.md`, `03-state-ownership-and-source-of-truth.md`, `04-caching-and-invalidation.md`, `05-storage-choice-and-durability-boundaries.md`, `06-failure-handling-and-reliability.md`, `07-scale-bottlenecks-and-evolution.md`, `08-system-design-red-flags-audit.md`. Older runs produced one file per lens; the current shape consolidates the lens walk into a single `audit.md` and reserves numbered files for discovered patterns (`me.md` → AUDIT-STYLE GENERATORS). If any of these lens-named files exist, flag them in the plan and ask whether to (a) fold their content into a regenerated `audit.md` and break out true Pass-2 pattern files, or (b) leave them in place as an archive. Do not silently rewrite or delete them.

## Step 5 — Audit and plan

Read the repo before writing. Inventory real architectural evidence with `file:line` anchors, distinguish observations from inferences, and emit `not yet exercised` rather than inventing infrastructure or scale. Print one plan and wait for one confirmation before editing.

## Step 6 — Execute

Follow the two-pass shape defined in `specs/me.md` → AUDIT-STYLE GENERATORS and the system-design lens inventory in `specs/study-system-design.md`.

In CREATE mode, produce `audit.md` (Pass 1, one `##` section per lens with `not yet exercised` named honestly) plus the discovered-pattern files (Pass 2, 3-8 files for a typical repo, each named after a real architectural pattern the repo exercises). In UPDATE mode, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: regenerate `audit.md` against current evidence, add pattern files when the codebase grows a new pattern, update existing pattern files when implementations change, and remove pattern files only when the pattern is genuinely gone.

Do not recreate `02-dsa/`. Cross-link algorithm and data-structure learning to `.aipe/study-dsa-foundations/`.

## Step 7 — Report

Print the mode, files created/updated/removed, ranked architectural findings, `not yet exercised` areas, foundation-guide cross-links, and any legacy archive note.
