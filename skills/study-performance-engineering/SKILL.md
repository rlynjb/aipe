---
name: study-performance-engineering
description: "Performance Engineering study guide — measurement and optimization of the repo: budgets, baselines, profiling, latency, throughput, memory, I/O, rendering, caching, batching, backpressure, and cost"
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

The user invoked `/aipe:study-performance-engineering`.

This command takes **no arguments**. There is one `performance engineering` artifact per repo at `.aipe/study-performance-engineering/`. Re-running enters UPDATE MODE when the artifact already exists.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/specs/`, write a short project-context placeholder covering stack, data model, file structure, and must-not-change constraints, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-performance-engineering.`, and stop.

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, and optional matching files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-performance-engineering.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file's location. Follow the generator spec's topic boundary and persona posture exactly.

## Step 4 — Detect CREATE or UPDATE and legacy content

Check `.aipe/study-performance-engineering/` for `00-overview.md`, `audit.md`, or any numbered markdown artifact. Existing content means UPDATE; otherwise CREATE.

Also check for the **legacy fixed-file-list layout** — files named after the 8 audit lenses, e.g. `01-performance-budget.md`, `02-measurement-baselines-and-profiling.md`, `03-latency-throughput-and-tail-behavior.md`, `04-cpu-memory-and-allocation.md`, `05-io-network-and-database-bottlenecks.md`, `06-caching-batching-and-backpressure.md`, `07-rendering-client-and-mobile-performance.md`, `08-performance-red-flags-audit.md`. Older runs produced one file per lens; the current shape consolidates the lens walk into a single `audit.md` and reserves numbered files for discovered patterns (`me.md` → AUDIT-STYLE GENERATORS). If any of these lens-named files exist, flag them in the plan and ask whether to (a) fold their content into a regenerated `audit.md` and break out true Pass-2 pattern files, or (b) leave them in place as an archive. Do not silently rewrite or delete them.

## Step 5 — Audit and plan

Read the repo before writing. Inventory real evidence with `file:line` anchors, distinguish observations from inferences, keep the generator's partition seam sharp, and emit `not yet exercised` rather than inventing behavior. Print one plan and wait for one confirmation before editing.

## Step 6 — Execute

Follow the two-pass shape defined in `specs/me.md` → AUDIT-STYLE GENERATORS and the lens inventory in `specs/study-performance-engineering.md`.

In CREATE mode, produce `audit.md` (Pass 1, one `##` section per lens with `not yet exercised` named honestly) plus the discovered-pattern files (Pass 2, 3-8 files for a typical repo, each named after a real performance pattern the repo exercises). In UPDATE mode, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: regenerate `audit.md` against current evidence, add pattern files when the codebase grows a new mechanism, update existing pattern files when implementations change, and remove pattern files only when the mechanism is genuinely gone.

## Step 7 — Report

Print the mode, files created/updated/removed, ranked findings, `not yet exercised` areas, and cross-links to adjacent generators.
