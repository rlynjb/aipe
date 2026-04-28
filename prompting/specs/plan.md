# Plan Spec

A reusable format for creating phased implementation plans that Claude Code can work through autonomously across multiple sessions. Use this when a project needs 20+ hours of work, spans multiple features, and you want Claude Code to resume without re-explaining context each time.


## When to use it


## Prompt to generate a plan

Paste this into Claude.ai along with your spec, codebase context, or feature list. Claude produces a full plan.md ready to save to the repo root.


```
Create an implementation plan in the Plan Spec format.

Project: [NAME]
Stack:   [LIST STACK]
Context: [WHAT THE PROJECT IS, 1–3 SENTENCES]

Features to implement (in rough priority order):
1. [FEATURE 1]
2. [FEATURE 2]
3. [FEATURE 3]

Requirements:
→ Break work into sequential phases, one per feature
   (split large features into multiple phases)
→ Each phase must have: Status, Goal, Depends on,
   numbered checkbox Steps, Constraints, Rollback plan,
   Done-when checklist, and a Notify-user footer
→ Include a session startup prompt at the top
→ Include a notification rule for phase completion
→ Include portability / cross-phase constraints
→ Include a phase overview table with time estimates
→ Mark Phase 1 as Active, all others as Backlog
→ Number steps as [phase].[step] e.g. 1.1, 1.2, 2.1
→ Steps must be concrete enough to execute without
   clarification — name specific files and functions
→ End with cross-phase constraints and file location

Output the full plan.md file, ready to save.
```


> 💾 Save output → [project]-plan.md in repo root


## Required sections in every plan file


**1. Title + summary**

One-line description. The instruction: "Read this file at the start of every session and continue from the next unchecked step."

Exact instruction Claude Code follows when it opens a new session. Reads the plan file, finds the active phase, finds the next unchecked step.

The exact message Claude Code must output after completing each phase — summary of what was done, what's next, and "Ready to continue? Type yes."

What the project is, what this plan covers, why phases are ordered this way. Ends with a one-line stack summary.

Non-negotiable constraints that apply throughout every phase — things like "don't touch auth", "always use migration files", "never break auto-save".

All phases with dependencies and time estimates in one scannable table. Phase 1 active, rest backlog.

Each phase has: Status, Goal, Depends on, Steps (checkboxes), Constraints, Rollback plan, Done-when checklist, Notify-user footer.

Rules for every phase: notify after each, one phase per session, don't touch unrelated files, run tests, deploy after key phases.

Where to save the plan in the repo. Always root — not docs/ or specs/ — so session startup is frictionless.


## Phase structure


```
## Phase [N] — [name]

**Status: Active** or **Status: Backlog**

**Goal:** [1–2 sentences — what it achieves and why ordered here]

**Depends on:** [previous phase, or — for Phase 1]

---

### Steps

- [ ] **[N].1** [Concrete step — name specific files and functions]
  - [Sub-bullet for additional detail]

- [ ] **[N].2** [Next step]

- [ ] **[N].X** Run test suite — all existing tests pass

---

### Constraints
- [What this phase must NOT do]
- [Behaviour that must be preserved]

### Rollback plan
[How to undo this phase if it breaks something]

### ✓ Done when
- [ ] [Observable outcome — "users can X", not "I wrote X"]
- [ ] All tests pass
- [ ] Deployed without errors

→ Notify user, wait for confirmation before Phase [N+1]
```


## Phase sizing rules


```
- [ ] **2.3** Create `lib/ai/summarize.ts`:
  - Loads entries from SQLite
  - Builds prompt via `lib/ai/prompt.ts`
  - Calls Claude (claude-sonnet-4-6)
  - Writes to `ai_summaries` on success
```


```
- [ ] **2.3** Add AI summary
  functionality
```


## How Claude Code uses the plan

> The plan file IS the state. No separate todo list, no external tracker. Just the file in the repo, versioned alongside the code it describes.


```
Session start
  → reads plan file from repo root
  → finds phase marked Status: Active
  → finds first unchecked step [ ]

Working
  → executes step
  → updates [ ] to [x] in the plan file
  → moves to next unchecked step
  → repeats

Phase complete
  → all steps + done-when items checked
  → outputs notification message
  → stops — waits for user to type "yes"

Next session
  → active phase moves to Phase N+1
  → cycle repeats
```


## File naming


```
Project-wide plan (multiple features):
  [project]-plan.md   e.g. loopd-plan.md, buffr-plan.md

Single-feature plan:
  [feature]-plan.md   e.g. auth-plan.md, onboarding-plan.md

Always save in repo root — not docs/ or specs/
```
