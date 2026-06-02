---
name: rehearse
description: Rehearse orchestrator — run all four human-layer rehearsal generators with one confirmation gate and one summary
---

The user invoked `/aipe:rehearse`. Run all four human-layer rehearsal generators in one pass.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` is absent, scaffold `.aipe/project/` and `.aipe/specs/`, write a short context placeholder, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:rehearse.`, and stop.

## Step 2 — Load context and specs

Read repo/global context, rules, and stack files, then:

```
${CODEX_PLUGIN_ROOT}/specs/rehearse.md
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/rehearse-problem-selection.md
${CODEX_PLUGIN_ROOT}/specs/rehearse-design-doc.md
${CODEX_PLUGIN_ROOT}/specs/rehearse-hackathon-demo.md
${CODEX_PLUGIN_ROOT}/specs/rehearse-interview-defense.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file. All four books use `teacher.md` in coach posture.

## Step 3 — Detect modes without writing

- `rehearse-problem-selection` → `.aipe/rehearse-problem-selection/`
- `rehearse-design-doc` → `.aipe/rehearse-design-doc/`
- `rehearse-hackathon-demo` → `.aipe/rehearse-hackathon-demo/`
- `rehearse-interview-defense` → `.aipe/rehearse-interview-defense/`

For each folder, numbered content or `00-overview.md` means UPDATE; otherwise CREATE.

## Step 4 — Plan once and confirm once

Print one consolidated table with all four books, modes, and planned changes. Wait for one confirmation before editing. Continue after printing the plan in non-interactive execution.

## Step 5 — Execute in spec order

Follow `specs/rehearse.md`. CREATE full artifacts; UPDATE surgically against the repo. Do not invent users, evidence, decisions, metrics, or code. Write each generator only inside its own folder.

## Step 6 — Report

Print one summary row per book with mode and files created/updated/removed, followed by the recommended rehearsal order.
