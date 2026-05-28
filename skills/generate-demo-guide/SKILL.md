---
description: Generate a DEMO_GUIDE.md presentation playbook grounded in what the codebase actually does
---

The user invoked `/aipe:generate-demo-guide`.

This command takes **no arguments**. It inspects the current repo and produces `DEMO_GUIDE.md` at the repo root — a presentation playbook for whoever will demo the project (hackathons, demo days, stakeholder reviews). Unlike the other aipe commands, this one does NOT require `.aipe/` scaffolding — it inspects the actual codebase directly.

## Step 1 — Load optional project context

If they exist, read these for extra signal (skip silently if absent — the spec gathers its own context from the repo in step 0):

- `.aipe/project/context.md`
- `.aipe/project/rules.md`
- `~/.config/aipe/global/identity.md`
- `~/.config/aipe/global/rules.md`

## Step 2 — Load the `generate-demo-guide` template

Read the template at:

```
${CODEX_PLUGIN_ROOT}/specs/generate-demo-guide.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/generate-demo-guide.md` upward from this file's location.

## Step 3 — Execute the spec's procedure

Follow the loaded template's steps in order. The spec is self-contained and procedural:

- **Step 0 — detect the context.** Read README, planning docs, any submission/rubric/brief, and the dependency manifest. Infer what the project is, who the audience is (judges / client / stakeholders / investors), and any format constraints (time limit, required sections, rubric). If a rubric exists, design the guide to hit its criteria explicitly. If the audience is genuinely unclear, default to "a technically literate reviewer who has not seen this project before" and note that assumption at the top.
- **Step 1 — inspect the codebase.** Determine what actually exists vs what was planned. Cover entry points & core logic, external integrations (real vs stubbed, with real names and counts), user-facing surfaces (reachable vs placeholder), **data reality** (live / cached / synthetic / fixtures — the single most important thing to get right), and config & stack (real deps + versions). Write yourself an internal "built vs planned" summary first.
- **Step 2 — generate `DEMO_GUIDE.md`** with the 8 sections the spec defines: (1) what this is, (2) honest architecture with an ASCII diagram, (3) the use case story, (4) the timed demo script (say / do / show per section, matching any required structure or time limit from step 0), (5) presenting tips, (6) Q&A prep, (7) pre-demo checklist, (8) what's-real-vs-roadmap transparency ledger.
- **Step 3 — accuracy pass.** Re-read the guide against the codebase. Confirm every factual claim (counts, names, features, data source, stack) matches the code. Fix drift. Flag uncertainty with `> ⚠️ verify: ...` rather than guessing.

The non-negotiables from the template:

1. **Accuracy over aspiration.** The guide describes what *exists* right now. Planned-but-unbuilt features go in the roadmap column, never in the present-tense demo script. Audiences lose trust fast when a demo claims something the product doesn't do.
2. **Match the project's voice.** Mirror the casing and tone of the repo's existing docs/UI copy. Pull real user-facing copy (actual headline/tagline) instead of inventing one. Don't impose a generic corporate register.
3. **Respect the format constraints** found in step 0 — time limit, required sections, rubric. If none exist, use the spec's sensible defaults.
4. **Data reality is the most important thing to get right.** Be honest about live vs cached vs synthetic vs fixtures, both in the use-case section and the Q&A "what's real vs mocked?" answer.
5. **One output file**: `DEMO_GUIDE.md` at repo root, plus the console summary.
6. If part of the guide can't be written accurately because the codebase is incomplete there, say so plainly rather than inventing content.

## Step 4 — Report + stop

After writing `DEMO_GUIDE.md`, print the console summary the spec specifies:

- what's built (1–2 lines)
- what's notably missing vs the plan/spec, if one exists (1–2 lines)
- the single biggest risk for the demo (1 line)
- one concrete suggestion to strengthen the demo before presenting (1 line)

**Stop. Wait for the user's next instruction.** Do NOT auto-revise the guide or start building missing features.
