---
name: recon
description: "AI-engineering readiness audit — places the repo on the L0–L3 hiring ladder and sequences the path up"
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.


The user invoked `/aipe:recon`.

This command takes **no arguments**. Every run writes a NEW dated audit at `.aipe/audits/recon-<YYYY-MM-DD>.md` — the trail is the progression. There is no UPDATE mode; prior dated files stay as the record.

```
/aipe:recon       → produce a fresh dated readiness audit
```

This is the readiness layer above the study family. It scores the repo against the `study-ai-engineering` competency map on the L0–L3 ladder, names the load-bearing gap, and produces an ordered queue of moves — each routed into the spec that closes it (`study-*`, `drill`, or `rehearse-*`).

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/audits/`, write a short project-context placeholder (stack, data model, file structure, must-not-change constraints), print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:recon.`, and stop.

If `.aipe/project/context.md` exists, ensure `.aipe/audits/` exists (mkdir if needed).

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, optional `.aipe/project/aieng-curriculum.md` (for `Bx.y` provenance hints), and optional matching files under `~/.config/aipe/global/`.

Also read any existing `.aipe/study-ai-engineering/` audit and `.aipe/study-prompt-engineering/` audit when present — they provide the comprehension baseline that recon's scoring builds on top of.

## Step 3 — Load the template chain

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/recon.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file's location. The persona is `teacher.md` in **coach posture** — same staff engineer, hiring-bar stance. The recon voice does not give credit for scaffolding and does not soften the rung.

## Step 4 — Audit the AI/ML surface

Walk the codebase for real AI/ML evidence: chains, models, retrieval, agents, evals, error handling, tradeoff evidence. Distinguish hand-built from scaffolded / AI-generated / tutorial-shaped. Explicitly check for the three usually-missing things: **evals, failure handling, tradeoff evidence**. Cite `file:line` for every claim.

A claimed-but-absent competency is a **liability**, not a strength — name it with the file location an interviewer would pull on.

## Step 5 — Score against the ladder

For each in-scope competency from the `study-ai-engineering` map, assign a rung on the L0–L3 ladder:

```
  L0  SCAFFOLDED   tutorial-shaped or AI-generated; author can't say why
  L1  BUILT        author assembled it; understands the shape
  L2  DEBUGGED     real failure hit, diagnosed, fix shipped
  L3  DEFENSIBLE   failure + alternatives + eval evidence + tradeoff, holds
                   under push-back
```

Scoring rule: a competency is only as high as the *evidence in the repo* supports. **No eval and no handled failure caps the ceiling at L1**, regardless of code volume.

## Step 6 — Plan and confirm

Print a plan: the four-section audit you will produce (AUDIT / LENS / PATH / TRACK), the dated filename, and a one-line preview of the load-bearing gap. Wait for one confirmation. In non-interactive execution, print the plan and continue.

## Step 7 — Write the dated audit

Generate `.aipe/audits/recon-<YYYY-MM-DD>.md` with the four sections defined in `specs/recon.md`:

```
  1. AUDIT   real vs scaffolded AI/ML surface; which shape (LLM-app /
             classical-ML / RAG); the three usually-missing things check
  2. LENS    each competency scored L0–L3 with one line of evidence and
             the single move that raises it; the repo's true level
             (median of claimed competencies, dragged down by claimed-but-L0)
  3. PATH    which track this repo advances; the single strongest signal;
             the load-bearing gap; claim-vs-reality
  4. TRACK   the ordered queue — each move raises one competency by one
             rung, routed into /aipe:study-*, /aipe:drill, or
             /aipe:rehearse-interview-defense
```

No encouragement, no recap of progress. The phase-4 queue is the part acted on; sections 1–3 are the evidence.

## Step 8 — Report

Print the audit path, the repo's true level (the LENS verdict), the load-bearing gap, and the single highest-leverage next command (usually `/aipe:drill` on the NEXT queue item, or `/aipe:study-ai-engineering` for a comprehension gap).

**Stop. Wait for the user's next instruction.**
