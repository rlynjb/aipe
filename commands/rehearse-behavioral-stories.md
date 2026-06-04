---
description: [standalone] Per-person STAR story bank for FAANG-style behavioral interview loops — 10 competencies, quantified, rehearsed for follow-up
---

The user invoked `/aipe:rehearse-behavioral-stories`.

This command takes **no arguments**. The artifact is **per-person, not per-repo** — the bank covers the reader's entire career, not one codebase. Re-running enters UPDATE MODE when the bank already exists. Runs standalone; not part of `/aipe:rehearse`.

```
/aipe:rehearse-behavioral-stories   → create or update the story bank
output: .aipe/rehearse-behavioral-stories/
```

## Step 1 — Locate career-history; pick mode

This spec runs in one of two modes depending on what's available:

  → **BANK mode** — career-history file is present; generate real
    stories from the reader's material.
  → **SCAFFOLD mode** — career-history is absent; detect the current
    project's archetype and generate archetype-shaped templates the
    reader fills in.

Read the career-history file in this preference order:

  1. `.aipe/project/career-history.md` (per-repo location)
  2. `~/.config/aipe/global/career-history.md` (global / per-user)

**If found** → BANK mode (continue with the existing career-history as input).

**If not found** → SCAFFOLD mode. Do NOT stop. Instead:

  1. Scaffold the per-user file at `~/.config/aipe/global/career-history.md` with the template below (so the reader has a place to capture real material when they reflect):

  ```markdown
  # Career history

  Raw material for the behavioral story bank. Be specific.
  Names, dates, numbers, the actual decisions. Reps will not save
  a vague memory.

  ## Roles, in reverse chronological order
  - <company> <role> <date range> — <one-line scope of what you owned>

  ## Notable projects (per role)
  - <project name> — <one-line outcome, with a number when possible>
    - what was at stake when you started
    - the decision you owned
    - the result, quantified
    - one thing you'd do differently now

  ## Moments worth a story
  Free-form. Anything you've thought "I should remember to tell that
  story" about. Bullet points, no structure required.
  ```

  2. Print `✓ Scaffolded ~/.config/aipe/global/career-history.md (fill in as you reflect).`
  3. Continue to Step 1b — detect the current project's archetype.

## Step 1b — Detect archetype (SCAFFOLD mode only)

Skip this step in BANK mode. In SCAFFOLD mode, classify the current project as **hackathon** / **personal** / **work** using these heuristics (first match wins; ask the user if none match):

  1. Presence of `.aipe/rehearse-hackathon-demo/` → **hackathon**
  2. README / `.aipe/project/context.md` keywords:
       `hackathon`, `48 hours`, `prize`, `demo day` → **hackathon**
       `personal`, `side project`, `for fun`, `portfolio` → **personal**
  3. `.github/PULL_REQUEST_TEMPLATE.md` OR `CODEOWNERS` OR multiple distinct git committers → **work**
  4. Single-committer git history with a public-looking remote → **personal**
  5. None match → **ask the user which archetype applies** before proceeding.

State the detected archetype in the plan (Step 5).

## Step 2 — Load context

Read the career-history file (BANK mode) or `.aipe/project/context.md` + README + `git log` (SCAFFOLD mode), plus optional `~/.config/aipe/global/identity.md`, and any companion global files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-behavioral-stories.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location. Use `teacher.md` in **coach posture** — the staff engineer who has sat on the L4–L5 hiring loop. Vague stories get sharpened, not preserved.

## Step 4 — Detect CREATE or UPDATE

Check `.aipe/rehearse-behavioral-stories/` for `00-overview.md` or any `0[1-9]-*.md` story file. Existing content means UPDATE; otherwise CREATE.

## Step 5 — Audit input and plan

The 10 competencies probed at senior+ behavioral rounds:

```
1. scope-expansion              6. technical-judgment
2. ambiguity-navigation         7. prioritization-and-saying-no
3. peer-conflict-resolution     8. failure-recovery   (non-negotiable)
4. stakeholder-pushback         9. impact-at-scale
5. influence-without-authority 10. mission-alignment  (Anthropic-weighted)
```

**BANK mode:** Walk the career-history input and identify candidate stories. Tag each with a primary competency. Build a competency coverage map: which competencies have story candidates, which are gaps. Explicitly name `failure-recovery` if absent — highest-leverage prep target.

**SCAFFOLD mode:** Pick 5-7 archetype-shaped templates from the library for the detected archetype (see `specs/rehearse-behavioral-stories.md` → SCAFFOLD MODE → ARCHETYPE TEMPLATE LIBRARIES):

```
hackathon  → scope-cutting-under-time-pressure, decision-in-the-last-
              two-hours, team-stack-or-scope-conflict, broken-demo-
              recovery, the-money-shot-decision, pitching-to-a-
              skeptical-judge, mission-alignment-48h

personal   → the-inspiration-moment, decision-to-start, why-this-over-
              alternatives, self-imposed-scope-discipline, the-almost-
              gave-up-moment, feedback-that-changed-direction,
              mission-alignment-personal

work       → scope-expansion-or-saying-no, peer-or-stakeholder-
              conflict, influence-without-authority, technical-
              judgment-under-uncertainty, failure-recovery-and-post-
              mortem, mentorship, impact-at-scale
```

Tag each template with the 10-competency primary it teaches so the coverage matrix works the same way as BANK mode.

Print one plan with the **mode** named, the archetype if SCAFFOLD, candidate stories (5-12), competency coverage matrix, and gaps. Wait for one confirmation. In non-interactive execution, print the plan and continue.

## Step 6 — Execute

In CREATE mode (BANK), generate `README.md`, `00-overview.md` (the competency × company coverage matrix + recommended rehearsal order per company), and one `01-<slug>.md` through `0N-<slug>.md` story file per candidate, each following the STAR + defense template in `specs/rehearse-behavioral-stories.md`.

In CREATE mode (SCAFFOLD), generate the same file layout but each story file is a **template** — opens with the banner `**STATUS:** scaffold template — not interview-ready`, contains *prompts* in each STAR field rather than fabricated content, and ends with 3-5 archetype-specific Reflection Prompts to help the reader surface the real moment. `00-overview.md` names the detected archetype and labels the bank as template-only with a clear path to graduation.

In UPDATE mode, mode-detect each file: files showing the `STATUS: scaffold template` banner are templates; files without it are real bank entries. Add new stories for newly mined material (BANK only), sharpen real stories where reflection has deepened, regenerate `00-overview.md` against the current bank (counting graduated templates as real entries). Never overwrite a real entry with a fresh template; the reader's reflection always wins.

**Enforce coach-voice rules from the spec:**

  → **Numbers must be real (BANK).** If a result is vague ("we improved performance"), flag the story for sharpening; do not invent a number.
  → **Numbers are NEVER invented (SCAFFOLD).** Templates contain prompts ("the actual percentage here") where real entries would contain numbers. The banner makes the non-interview-ready status explicit.
  → **Verbs are first-person.** "We launched it" gets rewritten to "I owned X, ran Y, held the rollback decision on Z."
  → **The failure-recovery story is non-negotiable.** In BANK mode, if raw material doesn't surface one, emit `gap — no failure-recovery story available; this is the highest-leverage prep target.` In SCAFFOLD mode, always include a failure-recovery template even if the archetype library doesn't usually emphasize it.
  → **Cross-link to defense books.** When a story is about a project that has a `.aipe/rehearse-interview-defense/` book in some repo, cite it in the story's `Cross-link` field.

## Step 7 — Report

Print the mode (**BANK** or **SCAFFOLD**), the detected archetype if SCAFFOLD, files created/updated/removed, the competency × company coverage matrix, the explicit gaps named honestly (especially `failure-recovery` if absent), and the recommended rehearsal order for each target company. End with the single next action:

  → BANK mode: "fill the gap" / "run reps against story #N" / "sharpen story X with real numbers"
  → SCAFFOLD mode: "open `01-<slug>.md` and replace the prompts with your real material — the highest-leverage template for your bank is X" (and a reminder that running `/aipe:rehearse-behavioral-stories` again will graduate filled-in templates and re-score the coverage matrix)

**Stop. Wait for the user's next instruction.**
