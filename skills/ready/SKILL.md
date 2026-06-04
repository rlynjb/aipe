---
name: ready
description: "[orchestrator] Readiness orchestrator — runs recon then drill as a pipeline. Measures hireability and closes the highest-leverage gap."
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.


The user invoked `/aipe:ready`.

One command runs the **readiness loop** on the current repo: place the repo on the AI-engineering hiring ladder (recon), then turn the load-bearing gap into a hands-on failure-rep (drill). recon's output is drill's input — this is a **pipeline**, not a fan-out.

```
/aipe:ready          → recon + 1 drill (the load-bearing gap)
/aipe:ready --n 3    → recon + drills for the top 3 queue items
```

Where `/aipe:study` builds comprehension and `/aipe:rehearse` prepares performance, `/aipe:ready` measures where you stand and closes the highest-leverage gap.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/`, `.aipe/audits/`, and `.aipe/drills/`, write a short project-context placeholder, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:ready.`, and stop.

If `.aipe/project/context.md` exists, ensure `.aipe/audits/` and `.aipe/drills/` exist (mkdir if needed).

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, optional `.aipe/project/aieng-curriculum.md`, and optional matching files under `~/.config/aipe/global/`.

Read any existing `.aipe/study-ai-engineering/` audit for context. Never block a run because it's absent — recon will surface the gap.

## Step 3 — Load the template chain

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/recon.md
${CODEX_PLUGIN_ROOT}/specs/drill.md
${CODEX_PLUGIN_ROOT}/specs/ready.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file's location. Both generators use `teacher.md` in **coach posture** — same staff engineer, hiring-bar stance.

## Step 4 — Plan the run (single confirmation gate)

Print one plan covering both stages:

```
  Plan
  ────
  recon  → .aipe/audits/recon-<YYYY-MM-DD>.md
            (dated audit; LENS scorecard + TRACK queue)
  drill  → .aipe/drills/<competency>-<slug>.md
            (1 drill on the load-bearing gap, or N drills with --n N)
```

Wait for one confirmation. In non-interactive execution, print the plan and continue. **One gate for the whole pipeline** — no per-stage prompts.

## Step 5 — Execute recon

Run the recon generator per `specs/recon.md` Step 4 onward: audit AI/ML surface, score on the L0–L3 ladder, write the dated audit with the four sections (AUDIT / LENS / PATH / TRACK).

## Step 6 — Execute drill(s)

Read the just-written recon audit's TRACK queue. Take the NEXT move (or top N with `--n N`). For each gap whose route is `/aipe:drill`:

  → Generate the drill writeup per `specs/drill.md` six-step anatomy at `.aipe/drills/<competency>-<slug>.md`.
  → Cite the `Bx.y` curriculum item and the `study-ai-engineering` concept file for provenance.

For gaps whose route is NOT `/aipe:drill` (comprehension gaps → `/aipe:study-*`; performance gaps → `/aipe:rehearse-interview-defense`), do **not** generate a drill. Surface the outward route in the final report — the user runs that command separately.

## Step 7 — Final report

Print:

```
  Recon audit:        .aipe/audits/recon-<date>.md
  Repo's true level:  <LENS verdict>
  Load-bearing gap:   <one line>
  Drills generated:   <list of paths>

  TRACK queue routing:
    → <gap 1> — /aipe:drill (generated above)
    → <gap 2> — /aipe:study-ai-engineering   (run separately)
    → <gap 3> — /aipe:rehearse-interview-defense   (run separately)
    → ...

  Single next action: <one command>
```

## What ready does NOT do

  → Does not complete the drills. A drill is hands-on work in the editor — build, induce, diagnose, fix, eval. ready produces the audit and the drill exercise sheet; the user runs the rep.
  → Does not run `/aipe:study-*` or `/aipe:rehearse-*`. recon's queue routes those gaps outward; ready surfaces the routes in the summary — the user runs them.
  → Is per-repo. The cross-repo three-track portfolio view is a parked layer (`/aipe:recon-portfolio`) that reads repos this command can't.

**Stop. Wait for the user's next instruction.**
