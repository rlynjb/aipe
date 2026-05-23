# Audit Spec

Use this when you want to take stock of a project — not to fix it. The audit produces a status report you can read, not a list of actions to execute. Nothing gets changed. No work is proposed.

> This spec is purely descriptive. If you want a debt list with triage, use audit-cleanup.md. If you want to restructure code, use refactor.md. The audit's job is to tell you *what is*, not *what to do*.


## When to run this

  - **Coming back to a project after time away** — onboard yourself before you touch anything
  - **Writing portfolio descriptions, READMEs, or case studies** — pull material from a current snapshot, not from memory
  - **Briefing someone else** — interviewer, collaborator, future you
  - **Periodic check-ins** — "where am I" without a specific trigger
  - **Before any decision about direction** — what you build next depends on knowing what you have


## Step 1 — Run the scan

One pass through the codebase that captures everything. The output of this step is the source material for everything else.


```
"Audit [app]. Produce a status report covering
the eight sections below. Be specific — name modules,
features, libraries, decisions. Do not propose changes.
Do not list things to fix. Describe the current state
as it exists today."
```


### Section 1 — Identity

  - One-paragraph description of what the app does
  - Primary user / use case
  - Stage (prototype, MVP, in active use, maintained, dormant)


### Section 2 — Stack

  - Core technologies (language, framework, runtime)
  - Notable dependencies and what they're used for
  - Persistence layer
  - Deploy target
  - Anything unusual or non-default


### Section 3 — Architecture

  - Top-level structure (directories, modules, packages)
  - State model — where data lives, how it flows
  - External integrations and how they're wired in
  - Boundaries between layers (UI, logic, persistence, effects)


### Section 4 — Features

  - What the app actually does, grouped by area
  - For each: brief description and current state (stable, rough, experimental)
  - Order roughly by maturity — most stable first


### Section 5 — Decisions

  - Notable choices that aren't obvious from the code
  - The reasoning behind them (as best as can be reconstructed)
  - Tradeoffs accepted
  - Things explicitly rejected and why

> This section is the one that most repays the time. The code shows what was done; the decisions show why. Without this, every revisit re-asks the same questions.


### Section 6 — Incomplete and deferred

  - **Incomplete** — features started but not finished. What state are they in? What's missing?
  - **Deferred with intent** — things explicitly chosen not to build (or not yet). The "no" decisions.
  - **Unknown status** — features that may or may not still work; not recently tested

> This is the gating discipline preserved from older audits. The deferred list is the most underrated artifact — without it, half-done features quietly become load-bearing because no one remembers they were paused.


### Section 7 — Risks and rough edges

Observation only, no prescription. What's worth being aware of, not what to do about it.

  - Known bugs that aren't being fixed yet
  - Areas that feel fragile or hard to change
  - Dependencies that are aging, deprecated, or risky
  - Coverage gaps (tests, error handling, monitoring) — if relevant

> If the temptation is to say "and we should fix X" — stop. That belongs in audit-cleanup.md or feature work. The audit's discipline is description.


### Section 8 — What's next (as currently planned)

  - The intended direction, as best as can be reconstructed from the code, commits, and any planning docs
  - Not a recommendation — just "here's what was apparently being headed toward"


> 💾 Save output → .aipe/audits/snapshot-[date].md


## Step 2 — Re-read for your specific use case

The scan produces a comprehensive snapshot. To use it, read it through the lens of why you ran the audit.


### Lens: onboarding yourself back

Read in order: Identity → What's next → Incomplete and deferred → Decisions. You want to reconstruct what you were doing and why before you look at the code itself. Sections 2–4 are reference.


### Lens: portfolio / README writing

Read in order: Identity → Features (stable only) → Architecture → Stack → Decisions. Skip Incomplete, Risks. Public-facing material describes what the app *is*, not what's pending.

> Tip for portfolio writing: the Decisions section is where the interesting material lives. "Built with Next.js and Notion API" is generic; "chose Notion as the database because [reason]" is distinctive. Pull from Section 5 when you want the writing to sound like a person made the choices, not a stack template.


### Lens: briefing someone else (interview, collaborator)

Read in order: Identity → Architecture → Decisions → Incomplete and deferred → Risks. The Decisions and Incomplete sections are what an interviewer will probe — *why this way, what's hard, what's left undone, how would you do it differently.* The audit gives you a current, accurate version of those answers instead of a stale recollection.


### Lens: periodic check-in

Read in order: Incomplete and deferred → What's next → Risks. Skim everything else. You're looking for drift — what's changed since last time, what got abandoned mid-stream, what's quietly aging.


## Step 3 — Update context (optional)

If the audit surfaces material that should live in `.aipe/project/context.md`, update it. The audit itself is a timestamped snapshot; context.md is the living document.


```
"Update .aipe/project/context.md based on the audit
snapshot. Pull in any decisions, deferred items, or
risks that aren't already captured. Leave the audit
file itself unchanged — it's the snapshot, not the
working doc."
```


## What this audit does not do

  - **It doesn't fix anything.** No code changes, no refactors, no cleanups.
  - **It doesn't propose work.** No "you should..." statements. No prioritized lists of fixes.
  - **It doesn't judge.** Risks and rough edges are observed, not graded. "Hard to change" is an observation; "needs to be refactored" is a prescription that belongs elsewhere.
  - **It doesn't gate phases.** Use it whenever; phase boundaries aren't special.

If you find yourself wanting to act on what the audit surfaces, hand off:

  - Debt worth paying down → **audit-cleanup.md**
  - Restructuring without behaviour change → **refactor.md**
  - Building something new or fixing something broken → feature spec / fix mini-spec


## Naming note

"Audit" still carries some sense of "find problems and recommend fixes" from earlier versions of this spec. If you ever rename, **snapshot.md** or **status-report.md** would match the contents better. Keeping it as audit.md for now since you may have existing references.
