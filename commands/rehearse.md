---
description: [orchestrator] Rehearse orchestrator — run all five human-layer rehearsal generators with one confirmation gate and one summary
---

The user invoked `/aipe:rehearse`. Run all five human-layer rehearsal generators in one pass.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` is absent, scaffold `.aipe/project/` and `.aipe/specs/`, write a short context placeholder, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:rehearse.`, and stop.

## Step 2 — Load context and specs

Read repo/global context, rules, and stack files, then:

```
${CLAUDE_PLUGIN_ROOT}/specs/rehearse.md
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-problem-selection.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-design-doc.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-hackathon-demo.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-interview-defense.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-eval-workshop.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file. All five generators use `teacher.md` in coach posture.

## Step 3 — Detect modes without writing

- `rehearse-problem-selection` → `.aipe/rehearse-problem-selection/`
- `rehearse-design-doc` → `.aipe/rehearse-design-doc/`
- `rehearse-hackathon-demo` → `.aipe/rehearse-hackathon-demo/`
- `rehearse-interview-defense` → `.aipe/rehearse-interview-defense/`
- `rehearse-eval-workshop` → `.aipe/rehearse-eval-workshop/`

For books 1–4, numbered content or `00-overview.md` means UPDATE; otherwise CREATE. For `rehearse-eval-workshop`, `00-map.md` or any `0[1-9]-*.md` / `10-*.md` file means RESUME; otherwise CREATE (RESUME reports state only — never regenerates).

## Step 4 — Plan once and confirm once

Print one consolidated table with all five generators, their modes (CREATE / UPDATE / RESUME), and planned changes. Wait for one confirmation before editing. Continue after printing the plan in non-interactive execution.

## Step 5 — Execute in spec order

Follow `specs/rehearse.md`. CREATE full artifacts; UPDATE the books surgically against the repo; RESUME the workshop by reporting state only. Do not invent users, evidence, decisions, metrics, code, or eval files. Write each generator only inside its own folder.

**Eval workshop special handling:** the generation phase runs its Step 5C discovery pass (scanning the repo's eval surface + detecting RAG/agent/plain-LLM shape) and writes `00-map.md` + exercise files with skip logic on 07/08. Then STOP. Do NOT enter coaching mode inside `/aipe:rehearse` — coaching is a downstream interaction the reader invokes via the standalone `/aipe:rehearse-eval-workshop` command later.

## Step 6 — Report

Print one summary row per generator with mode (CREATE / UPDATE / RESUME) and files created/updated/removed. For the eval workshop, also print the discovery summary (repo shape, eval surface found, exercises generated with skip reasons). End with the recommended rehearsal order.
