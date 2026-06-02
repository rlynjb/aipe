---
name: study-networking
description: "Networking study guide — the transport and protocol behavior exercised by the repo: DNS, connections, TLS, HTTP semantics, realtime transports, timeouts, retries, pooling, and network failure"
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

The user invoked `/aipe:study-networking`.

This command takes **no arguments**. There is one `networking` artifact per repo at `.aipe/study-networking/`. Re-running enters UPDATE MODE when the artifact already exists.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/specs/`, write a short project-context placeholder covering stack, data model, file structure, and must-not-change constraints, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-networking.`, and stop.

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, and optional matching files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-networking.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file's location. Follow the generator spec's topic boundary and persona posture exactly.

## Step 4 — Detect CREATE or UPDATE

Check `.aipe/study-networking/` for `00-overview.md` or any numbered markdown artifact. Existing content means UPDATE; otherwise CREATE.

## Step 5 — Audit and plan

Read the repo before writing. Inventory real evidence with `file:line` anchors, distinguish observations from inferences, keep the generator's partition seam sharp, and emit `not yet exercised` rather than inventing behavior. Print one plan and wait for one confirmation before editing.

## Step 6 — Execute

In CREATE mode, generate the complete artifact declared by `specs/study-networking.md`. In UPDATE mode, reconcile surgically against current code: add newly relevant material, update changed evidence, preserve correct teaching, and remove stale claims.

## Step 7 — Report

Print the mode, files created/updated/removed, ranked findings, `not yet exercised` areas, and cross-links to adjacent generators.
