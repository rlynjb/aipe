# AIPE Specs

A system for AI-assisted app development. Each spec is a prompt template with built-in discipline — constraints that keep Claude (or any AI assistant) from doing more than what was asked.

The specs work together. They're not a menu to pick from; they're a flow with handoffs between them.


## The system at a glance

Two flows, plus a foundation layer. The action flow (top) is for getting work done. The reflective flow (middle) is for thinking and learning. The foundation layer (bottom) defines who's writing and who's reading.

```
ACTION FLOW
═══════════

DESCRIBE        →    DIAGNOSE          →    ACT
(no action)          (triage)                (changes code)

audit.md             audit-cleanup.md        refactor.md
audit-frontend-a11y.md                       refactor-frontend-behaviour.md
                                             refactor-frontend-visual.md


REFLECTIVE FLOW
═══════════════

EVALUATE                       TEACH
(opinions, no action)          (concepts, anchored to code)

audit-refactor.md              study.md
                               study-ai-engineering.md
                               study-prompt-engineering.md
                               study-interview-defense.md


FOUNDATION LAYER
════════════════

PERSONAS  (referenced by the TEACH generators above)

teacher.md   ← writer persona — who teaches, what voice
me.md        ← reader profile — who reads, how they think
```

  - **Describe** — take stock of what exists. No changes, no proposals, no grading.
  - **Diagnose** — find debt and decide what's worth paying down. Produces a triaged list.
  - **Act** — execute one specific, named change. Behaviour-preserving by default.
  - **Evaluate** — staff-engineer opinions on the codebase, organized as a book. Not a fix list; a notebook you return to.
  - **Teach** — concept-by-concept study guides anchored to this specific codebase. System design, DSA, AI/ML patterns walked end-to-end. Plus a book-style interview defense generator for project-level interview prep.
  - **Personas** — `teacher.md` and `me.md` are foundational references, not generators. They produce no artifact of their own. The four TEACH generators read both before producing output: `teacher.md` defines the writer voice; `me.md` defines the reader being written for.

Findings in the action flow move downward: an audit surfaces debt → cleanup audit triages it → refactor spec executes. The discipline is in **not skipping layers** — acting without diagnosing leads to scope creep; diagnosing without describing leads to fixing the wrong things.

The reflective flow is separate. Read it when you want to think about or learn from a codebase, not when you want to change it. Both reflective specs hand off to the action flow when you're ready to act, but the artifacts themselves aren't action-oriented.


## "I want to..." — which spec?


### Take stock of a project

You don't want to fix anything yet. You want to know what's there.

  - General codebase snapshot → **audit.md**
  - Accessibility state of a frontend → **audit-frontend-a11y.md**

Common reasons: coming back after time away, writing portfolio descriptions, briefing an interviewer, periodic check-ins.


### Clean up accumulated debt

You can feel the codebase getting heavy. You want to fix what's worth fixing, accept the rest, and move on.

  - **audit-cleanup.md** — produces a triaged debt list, then hands off to refactor specs

Common signs: hesitating before touching certain files, finding the same logic in three places, names that no longer match what the code does.


### Think about a codebase without committing to act

You're not planning work. You want a staff engineer's opinions on the codebase — what's well-built, what's tangled, what techniques would apply where, what tradeoffs were made. Something you can read and return to like a book.

  - **audit-refactor.md** — produces a six-chapter notebook organized by refactor category, with staff-engineer takes and verdicts on what's worth doing

Common reasons: stepping back after a build phase, preparing to brief someone, building intuition for interviews, deciding what to focus on next.


### Learn concepts from a codebase

You want to deeply understand the patterns in a codebase — system design, DSA, AI engineering, ML, prompt engineering — concept by concept, anchored to the actual code you wrote. One file per pattern, walked end-to-end from curiosity hook to validated understanding. The four specs below split the topic surface: pick the one (or ones) that match what you want to study.

  - **study.md** — base study guide spec. Produces `.aipe/study-system-design-dsa/` with one file per pattern found in the codebase, covering system overview, system design, and DSA, in a staff-engineer voice. Diagrams, tradeoffs, validation blocks. Per-codebase, runs from inside the repo.
  - **study-ai-engineering.md** — topic-focused companion to study.md. Produces `.aipe/study-ai-engineering/` with files covering LLM foundations, retrieval, agents, evals, production serving, classical ML, recommender systems, on-device inference, and IK system design templates. Same staff-engineer voice as study.md. Per-codebase: identifies which of three AI shapes the codebase matches (LLM app / prompt tooling / classical ML) and weights coverage accordingly. Inherits study.md's structure.
  - **study-prompt-engineering.md** — topic-focused companion to study.md. Produces `.aipe/study-prompt-engineering/` with 13 prompt-engineering concepts (anatomy, structured outputs, prompts-as-code, token budgeting, eval-driven iteration, prompt injection defenses, and more), in a working-AI-engineer voice (deliberately different from study.md's staff-engineer persona — production scars matter more than distributed-systems pedigree here). Per-codebase, runs from inside the repo. Inherits study.md's structure; differs in persona and concept list.
  - **study-interview-defense.md** — book-style interview defense generator. Produces `.aipe/study-interview-defense/` as 8 sequential chapters (the pitch, the architecture, the choices, the scale story, the failure story, the hard parts, the counterfactuals, the AI question) plus an overview. Visual-first treatment for visual learners: callout boxes, recurring diagrams, strong-vs-weak answer side-by-sides, "I don't know" recovery boxes, follow-up decision trees, pull quotes. Same staff engineer as study.md, but in coach posture rather than teacher posture. Per-codebase, runs from inside the repo. Pair with study.md — the concept files prepare the deep dive; this book prepares the wide opener.

All four study generators read `teacher.md` and `me.md` as foundational references before producing output. See "The shape of the system now" below.

Common reasons: building real comprehension (not memorization) before interviews, working through a curriculum with your own code as the anchor, returning to specific concepts as reference.


### Calibrate the writer voice or the reader profile

These aren't generators — they're foundational reference specs that the four TEACH generators above consult.

  - **teacher.md** — defines the default writer persona (staff engineer, 12 years industry, FAANG → Series B) used by `study.md`, `study-ai-engineering.md`, and `study-interview-defense.md`. Names the teaching philosophy, format hierarchy (diagrams primary, prose fills in, pseudocode for logic, real code only when syntax matters), and what's banned (hedging, marketing language, etc.). Also documents the *posture variations* — teacher posture vs coach posture — and names when *not* to use this persona (the prompt engineering exception).
  - **me.md** — defines the reader profile: who reads the artifacts, how they think, what they've already built, what they know vs honest gaps. Contains the DSA portfolio (Graph, BinarySearchTree, BinaryHeap, PriorityQueue, sorting set, state-space search) and the system design portfolio (the five distinct shapes shipped — dryrun, buffr, contrl, aipe, AdvntrCue). Used by all four TEACH generators for example anchoring and depth calibration.

Update these when the reader's knowledge or the writer's voice should shift. The four TEACH generators automatically inherit the changes — no duplication, no drift.


### Restructure code without changing what it does

You know what you want to change. Behaviour stays identical.

  - Any code, any language → **refactor.md**
  - Frontend behaviour and structure (state, effects, components, data flow) → **refactor-frontend-behaviour.md**
  - Frontend visual surface (CSS, design tokens, semantic HTML) → **refactor-frontend-visual.md**

Use the most specific spec that applies. The frontend specs extend `refactor.md` — read it first, then layer the specific one on top.


### Add capability or fix bugs

These aren't in this system yet. Use feature specs or fix mini-specs (referenced by the audits, but not provided here as templates).

If an audit surfaces something that requires *new behaviour* (adding keyboard navigation, fixing a real bug, building a new screen), that's not a refactor — it's feature work. The audits explicitly hand it off rather than trying to do it themselves.


## The shape of the system now

The TEACH branch of the system has a clean separation between *who writes*, *who reads*, and *what gets written*:

```
teacher.md   ← writer persona (staff engineer, default voice)
me.md        ← reader profile (who you are, how you think)
   ↓             ↓
   referenced by all four generators
   ↓             ↓
study.md                       → .aipe/study-system-design-dsa/
study-ai-engineering.md        → .aipe/study-ai-engineering/
study-prompt-engineering.md    → .aipe/study-prompt-engineering/  (uses own persona)
study-interview-defense.md     → .aipe/study-interview-defense/   (coach posture)
```

`teacher.md` and `me.md` form a matched pair. `teacher.md` is the *writer*; `me.md` is the *reader*. Each generator spec reads both, and the artifact emerges from the conversation between them.

The precedence rule is three layers:

  1. **Spec wins on structure** — block templates, hard rules, output paths, the generator-specific constraints.
  2. **`teacher.md` wins on voice register** — tone, posture, what's banned, the format hierarchy.
  3. **`me.md` wins on calibration** — which examples land, depth modulation, what's already known vs honest gaps.

Each consuming spec states this precedence explicitly so the agent can't get confused about what overrides what.


### How each TEACH spec handles the foundation layer

The four generators got tailored treatment, not carbon copies:

  - **study.md** references `teacher.md` directly inside its prompt block. The prompt opens with "You are the staff engineer defined in `teacher.md`" and the long persona description is gone — replaced by a citation and posture-naming. The reader calibration section then points to `me.md`.
  - **study-ai-engineering.md** references `teacher.md` in the default **teacher posture**, no shift. The persona section trimmed from restatement to citation.
  - **study-interview-defense.md** references `teacher.md` in **coach posture** — same engineer, different stance. The coach-posture-specific framing (hiring committees, more direct, optimized for landing) stays in this spec because it's specific to interview defense; the underlying engineer comes from `teacher.md`.
  - **study-prompt-engineering.md** is the exception. It references `teacher.md` to explicitly *not* use it, citing the "WHEN NOT TO USE THIS PERSONA" section. Its persona (working AI engineer with production scars) stays inline. `me.md` is still inherited because the reader is constant across the family.


### Why this matters

The persona extraction made the **coach vs teacher posture distinction** explicit at the system level. Previously this distinction was implicit — interview defense said "same persona, different posture" but there was no canonical reference to *what the default posture was* vs *how coach differs*. Now `teacher.md` has a "THE POSTURE" section that names both postures, and the interview defense spec cites it directly.

This is useful for future specs. If you later build, say, a `study-onboarding.md` (a spec to onboard new engineers to your codebases), you'd reference `teacher.md` and possibly define a *new* posture — maybe "mentor" — that's a documented extension rather than an arbitrary override. The system has a vocabulary for posture shifts now.

`teacher.md` is the *default* persona, but the system explicitly accommodates exceptions (`study-prompt-engineering.md`). That's by design — different disciplines reward different credibility, and forcing a single persona across all topics would weaken the voice on topics where the default doesn't fit. The "WHEN NOT TO USE THIS PERSONA" section in `teacher.md` gives future specs a place to opt out cleanly when warranted.


## How the specs hand off to each other

```
audit.md  ────────────────►  identifies debt
                                    │
                                    ▼
                             audit-cleanup.md  ─────►  triages, fix-now list
                                                              │
                                                              ▼
                                                       refactor.md
                                                       refactor-frontend-behaviour.md
                                                       refactor-frontend-visual.md

audit-frontend-a11y.md  ────►  identifies a11y gaps
                                    │
                                    ├──►  new capability needed  →  feature spec
                                    ├──►  broken behaviour       →  fix mini-spec
                                    └──►  semantic markup change →  refactor-frontend-visual.md

audit-refactor.md  ───►  staff-engineer takes (book)
                                    │
                                    └──►  when ready to act  →  audit-cleanup.md
                                                                (then refactor specs)

teacher.md  ─┐
me.md  ──────┤  read by all four TEACH generators before producing output
             │  (no artifact of their own; foundation references only)
             │
             ▼

study.md  ──────────────►  system design + DSA concept files
                            anchored to this codebase
                              (output: .aipe/study-system-design-dsa/)
                                    │
                                    └──►  no automatic handoff — the artifact is
                                          the deliverable; you read and return to it

study-ai-engineering.md  ───►  AI + ML concept files anchored
  (inherits study.md structure)   to this codebase
                                  (output: .aipe/study-ai-engineering/)
                                    │
                                    └──►  no automatic handoff — same as study.md

study-prompt-engineering.md  ───►  13 prompt-engineering concept files
  (inherits study.md structure)         anchored to this codebase
                                        (output: .aipe/study-prompt-engineering/)
                                    │
                                    └──►  no automatic handoff — same as study.md

study-interview-defense.md  ───►  8-chapter book defending the project
  (inherits study.md structure)       at the interview level
  (coach posture from teacher.md)     (output: .aipe/study-interview-defense/)
                                    │
                                    └──►  pair with study.md's concept files:
                                          concepts prepare the deep dive,
                                          this book prepares the wide opener
```

The arrows are one-way. Refactors don't loop back to audits; audits don't execute refactors. The reflective specs hand off to the action flow but never receive from it. Each spec stays in its layer.

`teacher.md` and `me.md` flow *into* the TEACH generators but receive nothing back — they're foundations, not artifacts.


## Why the constraints matter

Every spec has a "must not change / must not introduce / what this does not do" section. These exist because AI assistants will, by default, do more than what's asked. Without explicit constraints:

  - **Refactors** turn into rewrites — Claude "improves" things you didn't ask about
  - **Audits** turn into action plans — Claude finds problems and starts fixing them
  - **Cleanup** turns into scope creep — one fix becomes five, behaviour changes silently

The discipline is what makes the specs useful. If you find yourself softening the constraints to make a task work, you've picked the wrong spec.


## Conventions

  - **One spec per session.** Don't combine refactor types or audit lenses across a single Claude Code session.
  - **Save outputs to predictable paths.** Each spec specifies where its output goes (`.aipe/audits/`, `.aipe/specs/refactors/`). Keeping these consistent makes the history searchable later.
  - **Reference, don't duplicate.** When you write a spec instance (a real refactor or audit), reference the template, don't copy its rules into the instance.
  - **Update context.md after major changes.** The audits write to dated snapshots; `.aipe/project/context.md` is the living document that should reflect the current state.


## Spec reference

| Spec | Layer | Scope | Best for |
|------|-------|-------|----------|
| `audit.md` | Describe | Any codebase | Snapshots, onboarding, portfolio writing, interview prep |
| `audit-frontend-a11y.md` | Describe | Frontend a11y | Finding accessibility gaps without committing to fix them |
| `audit-cleanup.md` | Diagnose | Any codebase | Producing a triaged debt list with explicit fix/accept/defer decisions |
| `audit-refactor.md` | Evaluate | Any codebase | Staff-engineer notebook of takes on what's worth refactoring — book-style, returnable |
| `study.md` | Teach | Any codebase | Per-codebase concept guides — system design + DSA — staff-engineer voice |
| `study-ai-engineering.md` | Teach | Any codebase, AI/ML topic | Per-codebase AI + ML concept guides — LLM foundations, retrieval, agents, evals, classical ML, system design templates — staff-engineer voice |
| `study-prompt-engineering.md` | Teach | Any codebase, prompt engineering topic | Per-codebase guide of 13 prompt-engineering concepts — working-AI-engineer voice |
| `study-interview-defense.md` | Teach | Any codebase, project-level interview defense | Book-style 8-chapter defense of the whole project — coach posture, visual-first treatment |
| `teacher.md` | Foundation | Persona reference (writer) | Defines the default staff-engineer voice across the TEACH generators; named posture variations (teacher / coach); named exceptions |
| `me.md` | Foundation | Persona reference (reader) | Defines who reads the artifacts — career arc, cognitive shape, DSA + system design portfolios, honest gap inventory |
| `refactor.md` | Act | Any code, language-agnostic | Named, behaviour-preserving restructures |
| `refactor-frontend-behaviour.md` | Act | Frontend behaviour | State placement, effects, components, data flow, perf |
| `refactor-frontend-visual.md` | Act | Frontend visuals | CSS organization, design tokens, semantic HTML |


## Reading order if you're new to this

For the **action flow** (audit / cleanup / refactor):

  1. **refactor.md** — establishes the discipline (must-not-change / must-not-introduce). Everything else inherits from this.
  2. **audit.md** — the describe-don't-act discipline. Mirrors refactor.md's constraint style at a different layer.
  3. **audit-cleanup.md** — how diagnosis bridges describe and act.
  4. The frontend specs — once you've internalized the general patterns, the frontend ones are extensions.

For the **reflective flow** (study / interview defense):

  1. **me.md** — read this first if you want to understand who the artifacts are calibrated for. It's the reader profile every TEACH generator consults.
  2. **teacher.md** — the writer persona. Names the default voice, the format hierarchy, the bans, and the posture variations (teacher vs coach).
  3. **study.md** — the base study guide spec. Read this to understand the per-concept-file template that the topic specs inherit.
  4. The topic specs (`study-ai-engineering.md`, `study-prompt-engineering.md`) and the interview defense spec (`study-interview-defense.md`) — once you've seen study.md's structure, the others are extensions and shifts.

> The specs are designed to be read in this order, but used in any order. Reading order builds the mental model; usage depends on what you're trying to do.
