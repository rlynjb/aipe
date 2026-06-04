---
name: study
description: [orchestrator] Study orchestrator — run all sixteen study generators with one confirmation gate and one summary
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

The user invoked `/aipe:study`. Run all sixteen comprehension generators in one pass.

The orchestrator loads sixteen generator specs (run order below). The new study-frontend-engineering generator emits "no frontend surface" honestly when the repo has no UI code, so non-frontend repos stay silent on that lens rather than gain an empty artifact.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` is absent, scaffold `.aipe/project/` and `.aipe/specs/`, write a short context placeholder covering stack, data model, file structure, and must-not-change constraints, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study.`, and stop.

## Step 2 — Load context and specs

Read `.aipe/project/context.md`, optional repo/global rules and stack files, optional AI curriculum files, then:

```
${CODEX_PLUGIN_ROOT}/specs/study.md
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-runtime-systems.md
${CODEX_PLUGIN_ROOT}/specs/study-networking.md
${CODEX_PLUGIN_ROOT}/specs/study-database-systems.md
${CODEX_PLUGIN_ROOT}/specs/study-dsa-foundations.md
${CODEX_PLUGIN_ROOT}/specs/study-system-design.md
${CODEX_PLUGIN_ROOT}/specs/study-software-design.md
${CODEX_PLUGIN_ROOT}/specs/study-frontend-engineering.md
${CODEX_PLUGIN_ROOT}/specs/study-data-modeling.md
${CODEX_PLUGIN_ROOT}/specs/study-security.md
${CODEX_PLUGIN_ROOT}/specs/study-testing.md
${CODEX_PLUGIN_ROOT}/specs/study-distributed-systems.md
${CODEX_PLUGIN_ROOT}/specs/study-debugging-observability.md
${CODEX_PLUGIN_ROOT}/specs/study-performance-engineering.md
${CODEX_PLUGIN_ROOT}/specs/study-ai-engineering.md
${CODEX_PLUGIN_ROOT}/specs/study-prompt-engineering.md
${CODEX_PLUGIN_ROOT}/specs/study-agent-architecture.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file. `format.md` is the shared structural source. Fifteen generators use `teacher.md` in teacher posture; `study-prompt-engineering` uses its inline persona. `study-frontend-engineering` notes its reader-home-turf calibration explicitly — the teacher can lean on existing frontend knowledge.

## Step 3 — Detect modes without writing

- `study-runtime-systems` → `.aipe/study-runtime-systems/`
- `study-networking` → `.aipe/study-networking/`
- `study-database-systems` → `.aipe/study-database-systems/`
- `study-dsa-foundations` → `.aipe/study-dsa-foundations/`
- `study-system-design` → `.aipe/study-system-design/`
- `study-software-design` → `.aipe/study-software-design/`
- `study-frontend-engineering` → `.aipe/study-frontend-engineering/` (skipped if no frontend surface)
- `study-data-modeling` → `.aipe/study-data-modeling/`
- `study-security` → `.aipe/study-security/`
- `study-testing` → `.aipe/study-testing/`
- `study-distributed-systems` → `.aipe/study-distributed-systems/`
- `study-debugging-observability` → `.aipe/study-debugging-observability/`
- `study-performance-engineering` → `.aipe/study-performance-engineering/`
- `study-ai-engineering` → `.aipe/study-ai-engineering/`
- `study-prompt-engineering` → `.aipe/study-prompt-engineering/`
- `study-agent-architecture` → `.aipe/study-agent-architecture/`

For each folder, numbered content or `00-overview.md` means UPDATE; otherwise CREATE.

Also check for legacy `.aipe/study-system-design-dsa/`. If present, include a migration note in the consolidated plan: architecture moves to `.aipe/study-system-design/`, DSA learning moves to `.aipe/study-dsa-foundations/`, and the legacy folder is never silently deleted or overwritten.

## Step 4 — Plan once and confirm once

Print one consolidated table with all sixteen generators, modes, and planned changes. Wait for one confirmation before editing. Continue after printing the plan in non-interactive execution.

## Step 5 — Execute in spec order

Follow `specs/study.md`. CREATE full artifacts; UPDATE surgically against the repo. Ground claims in real files, label inference, use `not yet exercised` instead of invented behavior, keep partition seams sharp, and write each generator only inside its own folder.

## Step 6 — Report

Print one summary row per generator with mode, files created/updated/removed, ranked findings, and cross-links.
