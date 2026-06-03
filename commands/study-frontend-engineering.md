---
description: Per-codebase frontend-engineering guide — rendering, state, components, data-fetch, routing, styling, platform APIs, build
---

The user invoked `/aipe:study-frontend-engineering`.

This command takes **no arguments**. There is one frontend-engineering guide per repo at `.aipe/study-frontend-engineering/`. Re-running enters UPDATE MODE when the guide already exists.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/specs/`, write a short project-context placeholder covering stack, data model, file structure, and must-not-change constraints, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-frontend-engineering.`, and stop.

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, and optional matching files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/study-frontend-engineering.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location. Follow the partition seam exactly: this guide owns the framework-and-platform layer (rendering, state shape, components, data-fetch seam, routing, styling, platform APIs, build). Cross-link mechanism-level teaching to its owning generator (event loop → `study-runtime-systems`, wire semantics → `study-networking`, FCP/LCP measurement → `study-performance-engineering`, XSS/CSP → `study-security`, module depth → `study-software-design`, system-level state ownership → `study-system-design`).

## Step 4 — Detect CREATE or UPDATE and frontend-applicability

Check `.aipe/study-frontend-engineering/` for `00-overview.md`, `audit.md`, or numbered markdown artifacts. Existing content means UPDATE; otherwise CREATE.

Also confirm the repo has a frontend surface (UI framework dependency, component files, browser entry point). If the repo has no frontend code, emit `no frontend surface — this generator is not load-bearing for this repo` and stop. Do not scaffold an empty guide.

## Step 5 — Audit and plan

Read the repo before writing. Inventory real frontend evidence with `file:line` anchors: the rendering mode (SPA / SSR / SSG / RSC / hybrid / island), the state graph, the component boundaries, the data-fetching seam, the routing structure, the styling system, the Web APIs in use, and the bundler config. Distinguish observed behavior from inference; label inferred rendering behavior plainly. Emit `not yet exercised` honestly per lens. Print one plan and wait for one confirmation before editing.

## Step 6 — Execute

Follow the two-pass shape defined in `specs/me.md` → AUDIT-STYLE GENERATORS and the frontend-engineering lens inventory in `specs/study-frontend-engineering.md`.

In CREATE mode, produce `audit.md` (Pass 1, one `##` section per lens with `not yet exercised` named honestly) plus the discovered-pattern files (Pass 2, 3-8 files for a typical repo, each named after a real frontend pattern the repo exercises — `signals-and-fine-grained-reactivity`, `optimistic-mutations-with-rollback`, `streaming-ssr-handoff`, etc.). In UPDATE mode, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: regenerate `audit.md` against current evidence, add pattern files when the codebase grows a new frontend pattern, update existing pattern files when implementations change, and remove pattern files only when the pattern is genuinely gone.

## Step 7 — Report

Print the mode, files created/updated/removed, the rendering mode in one sentence, the three highest-leverage patterns named with file paths, `not yet exercised` lenses, cross-links to neighboring guides (`study-software-design`, `study-system-design`, `study-performance-engineering`, `study-security`, `study-runtime-systems`, `study-networking`), and the single next action.
