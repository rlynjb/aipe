---
name: rehearse-behavioral-stories
description: "[standalone] Per-person STAR story bank for FAANG-style behavioral interview loops — 10 competencies, quantified, rehearsed for follow-up"
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.


The user invoked `/aipe:rehearse-behavioral-stories`.

This command takes **no arguments**. The artifact is **per-person, not per-repo** — the bank covers the reader's entire career, not one codebase. Re-running enters UPDATE MODE when the bank already exists. Runs standalone; not part of `/aipe:rehearse`.

```
/aipe:rehearse-behavioral-stories   → create or update the story bank
output: .aipe/rehearse-behavioral-stories/
```

## Step 1 — Locate or scaffold the career-history input

This spec needs raw material before it can generate stories. Read the career-history file in this preference order:

  1. `.aipe/project/career-history.md` (per-repo location)
  2. `~/.config/aipe/global/career-history.md` (global / per-user)

If neither exists, scaffold the **per-user** version at `~/.config/aipe/global/career-history.md` with this template:

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

Print `✓ Scaffolded ~/.config/aipe/global/career-history.md. Fill it in, then re-run /aipe:rehearse-behavioral-stories.` and **stop**. A behavioral story bank without raw material is a fabrication risk.

## Step 2 — Load context

Read the career-history file located in Step 1, plus optional `~/.config/aipe/global/identity.md`, optional `.aipe/project/context.md` (when relevant), and any companion global files under `~/.config/aipe/global/`.

## Step 3 — Load the template chain

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/rehearse-behavioral-stories.md
```

If `${CODEX_PLUGIN_ROOT}` is unset, search upward from this file's location. Use `teacher.md` in **coach posture** — the staff engineer who has sat on the L4–L5 hiring loop. Vague stories get sharpened, not preserved.

## Step 4 — Detect CREATE or UPDATE

Check `.aipe/rehearse-behavioral-stories/` for `00-overview.md` or any `0[1-9]-*.md` story file. Existing content means UPDATE; otherwise CREATE.

## Step 5 — Audit the career-history file and plan

Walk the career-history input and identify candidate stories. For each, attempt to tag a primary competency from the 10-competency list (see `specs/rehearse-behavioral-stories.md`):

```
1. scope-expansion              6. technical-judgment
2. ambiguity-navigation         7. prioritization-and-saying-no
3. peer-conflict-resolution     8. failure-recovery   (non-negotiable)
4. stakeholder-pushback         9. impact-at-scale
5. influence-without-authority 10. mission-alignment  (Anthropic-weighted)
```

Build a competency coverage map: which competencies have story candidates, which are gaps. Explicitly name `failure-recovery` if absent — it's the highest-leverage prep target.

Print one plan: candidate stories (8-12), competency coverage matrix, and gaps. Wait for one confirmation before editing. In non-interactive execution, print the plan and continue.

## Step 6 — Execute

In CREATE mode, generate `README.md`, `00-overview.md` (the competency × company coverage matrix + recommended rehearsal order per company), and one `01-<slug>.md` through `0N-<slug>.md` story file per candidate, each following the STAR + defense template in `specs/rehearse-behavioral-stories.md`.

In UPDATE mode, reconcile against the current career-history file: add stories for newly mined material, sharpen existing stories where the user's reflection has deepened (vague numbers replaced with real ones, "we" rewritten to "I"), regenerate `00-overview.md` against the current bank, and remove stories that no longer represent the user's voice or current scope.

**Enforce coach-voice rules from the spec:**

  → **Numbers must be real.** If a result is vague ("we improved performance"), flag the story for sharpening; do not invent a number.
  → **Verbs are first-person.** "We launched it" gets rewritten to "I owned X, ran Y, held the rollback decision on Z."
  → **The failure-recovery story is non-negotiable.** If raw material doesn't surface one, emit `gap — no failure-recovery story available; this is the highest-leverage prep target.` Do not fabricate.
  → **Cross-link to defense books.** When a story is about a project that has a `.aipe/rehearse-interview-defense/` book in some repo, cite it in the story's `Cross-link` field.

## Step 7 — Report

Print the mode, files created/updated/removed, the competency × company coverage matrix, the explicit gaps named honestly (especially `failure-recovery` if absent), and the recommended rehearsal order for each target company. End with the single next action — usually "fill the gap" or "run reps against story #N."

**Stop. Wait for the user's next instruction.**
