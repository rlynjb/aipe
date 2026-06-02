---
description: Hands-on failure-rep — induce, diagnose, fix, and prove with an eval. One drill per gap; the pile is the war-story portfolio.
---

The user invoked `/aipe:drill`.

A drill is **not a tutorial**. It is a failure engineered on purpose in the **current repo**, diagnosed, fixed, and proved with an eval — the only thing in the system that produces an L3 war story. Each drill writeup accumulates under `.aipe/drills/` and is the trail recon's strongest-signal read draws from.

```
/aipe:drill                          → pick the NEXT gap from the latest recon queue
/aipe:drill <competency> <L0|L1>→<L2|L3>   → drill a specific competency directly
/aipe:drill --from <recon-file>      → use a specific dated recon audit's queue
```

Every run generates a NEW writeup. There is no UPDATE mode; drills accumulate.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/` and `.aipe/drills/`, write a short project-context placeholder, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:drill.`, and stop.

If `.aipe/project/context.md` exists, ensure `.aipe/drills/` exists (mkdir if needed).

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, optional `.aipe/project/aieng-curriculum.md` (for `Bx.y` provenance), and optional matching files under `~/.config/aipe/global/`.

Read any existing `.aipe/study-ai-engineering/` audit for the concept-file cross-references the drill will cite.

## Step 3 — Load the template chain

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/drill.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location. The persona is `teacher.md` in **coach posture** — the staff engineer who believes the only proof someone understands a system is that they can break it on purpose and explain why.

## Step 4 — Resolve the gap

Three input modes:

  1. **No arguments** — read the latest `.aipe/audits/recon-<date>.md` (most recent date wins), take the NEXT move from its TRACK queue. If no recon audit exists, **stop** and tell the user to run `/aipe:recon` first.
  2. **`<competency> <L_>→<L_>`** — drill the named competency directly, raising it from one rung to another. Validate the competency exists in the `study-ai-engineering` map.
  3. **`--from <recon-file>`** — use a specific dated recon audit's queue; same NEXT-move logic.

State which mode resolved the gap and which `Bx.y` curriculum item maps to it (if any).

## Step 5 — Plan and confirm

Print: the gap (competency + L_→L_ + `Bx.y` if applicable), the file path that will hold the writeup (`.aipe/drills/<competency>-<slug>.md`), and a one-line preview of the planned induced failure. **Confirm with the user** before writing — the drill template is a contract; the user may want to redirect to a different failure or scale.

In non-interactive execution, print the plan and continue.

## Step 6 — Generate the drill writeup

Follow the six-step anatomy from `specs/drill.md` verbatim. Target the repo's REAL files (not generic examples). Use `file:line` for the naive build. Cite the `study-ai-engineering` concept file and the `Bx.y` curriculum item for theory provenance — do not restate.

```
  competency:   <from study-ai-engineering map>      raises: L_ → L_
  curriculum:   <Bx.y from aieng-curriculum.md, if one maps>
  study ref:    <the .aipe/study-ai-engineering/ concept file>

  1. BUILD       <the naive version + file:line>
  2. INDUCE      <the exact input/scale/edge that forces the failure —
                  if step 2 doesn't actually break it, the drill is faked>
  3. DIAGNOSE    <symptom → hypotheses → isolated cause>
  4. FIX+REJECT  <the fix; the alternative rejected and why>
  5. EVAL        <the measurement: golden set / confusion matrix /
                  precision@k / regression set — with the number>
  6. WAR STORY   "<the sentence you can now say in a room, in your voice>"
```

**Rules from the spec, enforced here:**

  → The failure is the assignment. If step 2 didn't actually break, redirect the user to a harder input.
  → No eval, no L3. Step 5 is non-negotiable.
  → The war story is a sentence said out loud under push-back, in the reader's voice (`me.md`). Written last, in original words.

The writeup is a **template the user fills out** — the command sketches the planned drill (steps 1, 2, 5 in particular) and stops short of fabricating the actual diagnosis, fix, or war story. Those are hands-on output. The drill is finished when the user has lived it.

## Step 7 — Report

Print the writeup path, the gap closed (when complete) or scaffolded (when handed back to the user), the `Bx.y` and `study-*` cross-links, and the next move in the recon queue (if there is one).

**Stop. Wait for the user's next instruction.**
