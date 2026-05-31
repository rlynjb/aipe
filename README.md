# AIPE Specs

A system for AI-assisted app development. Each spec is a prompt template with built-in discipline — constraints that keep Claude (or any AI assistant) from doing more than what was asked.

The specs work together. They're not a menu to pick from; they're a flow with handoffs between them.


## The system at a glance

Two flows, plus a foundation layer. The action flow (top) is for getting work done. The reflective flow (middle) is for thinking and learning. The foundation layer (bottom) defines who's writing, who's reading, and how each concept file is structured.

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

audit-refactor.md              study.md  ← orchestrator: runs the five below
                                 study-system-design-dsa.md
                                 study-ai-engineering.md
                                 study-prompt-engineering.md
                                 study-agent-architecture.md
                                 study-interview-defense.md
                               study-hackathon-demo.md  ← standalone, run on demand


FOUNDATION LAYER
════════════════

REFERENCES  (read by every study generator above)

format.md    ← concept-file format — how each file is structured
teacher.md   ← writer persona — who teaches, what voice
me.md        ← reader profile — who reads, how they think
```

  - **Describe** — take stock of what exists. No changes, no proposals, no grading.
  - **Diagnose** — find debt and decide what's worth paying down. Produces a triaged list.
  - **Act** — execute one specific, named change. Behaviour-preserving by default.
  - **Evaluate** — staff-engineer opinions on the codebase, organized as a book. Not a fix list; a notebook you return to.
  - **Teach** — concept-by-concept study guides anchored to this specific codebase. `study.md` is the orchestrator (the `/aipe:study` command): it runs the five topic generators in one pass, covering system design + DSA, AI/ML, prompt engineering, agent architecture, and a book-style interview defense for project-level prep. A sixth generator, `study-hackathon-demo.md`, is run standalone on demand — it turns the codebase into a book-style demo script for a timed presentation.
  - **References** — `format.md`, `teacher.md`, and `me.md` are foundational references, not generators. They produce no artifact of their own. Every study generator reads all three before producing output: `format.md` defines the concept-file structure (the block template, the house-style traits, the diagram/pseudocode/hard rules); `teacher.md` defines the writer voice; `me.md` defines the reader being written for.

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

You want to deeply understand the patterns in a codebase — system design, DSA, AI engineering, ML, prompt engineering, agent architecture — concept by concept, anchored to the actual code you wrote. One file per pattern, walked end-to-end from orientation to validated understanding. There are five topic generators, plus an orchestrator that runs them all and a format reference they all share.

  - **study.md** — the orchestrator (the `/aipe:study` command). One command that creates or updates **every** study guide for the current repo in one pass: it reads `format.md` for structure, runs each of the five generators below in create-or-update mode, and reports a single summary. Run a generator standalone when you changed only one slice of the codebase; run `study.md` when you want everything reconciled at once.
  - **study-system-design-dsa.md** — produces `.aipe/study-system-design-dsa/` with one file per pattern found in the codebase, covering system overview, system design, and DSA, in a staff-engineer voice. Per-codebase, runs from inside the repo.
  - **study-ai-engineering.md** — produces `.aipe/study-ai-engineering/` covering LLM foundations, retrieval, agents, evals, production serving, classical ML, recommender systems, on-device inference, and system design templates. Identifies which of three AI shapes the codebase matches (LLM app / prompt tooling / classical ML) and weights coverage accordingly.
  - **study-prompt-engineering.md** — produces `.aipe/study-prompt-engineering/` with 13 prompt-engineering concepts (anatomy, structured outputs, prompts-as-code, token budgeting, eval-driven iteration, prompt injection defenses, and more), in a working-AI-engineer voice (deliberately different from the staff-engineer persona — production scars matter more than distributed-systems pedigree here).
  - **study-agent-architecture.md** — produces `.aipe/study-agent-architecture/` covering everything *above* a single agent: reasoning patterns (incl. the agent-loop skeleton), agentic retrieval, multi-agent orchestration topologies, agent infrastructure, and production serving for loops. Identifies which of three shapes the codebase matches (workflow/chain, single-agent, multi-agent) and weights coverage accordingly. Cross-references `study-ai-engineering.md` rather than duplicating single-agent mechanics.
  - **study-interview-defense.md** — book-style interview defense generator. Produces `.aipe/study-interview-defense/` as 8 sequential chapters (the pitch, the architecture, the choices, the scale story, the failure story, the hard parts, the counterfactuals, the AI question) plus an overview. Visual-first treatment: callout boxes, recurring diagrams, strong-vs-weak answer side-by-sides, "I don't know" recovery boxes, follow-up decision trees, pull quotes. Same staff engineer as the others, but in coach posture rather than teacher posture. Pair with `study-system-design-dsa.md` — the concept files prepare the deep dive; this book prepares the wide opener.

All five generators read `format.md` for structure, plus `teacher.md` and `me.md` for voice and reader calibration, before producing output. See "The shape of the system now" below.

Common reasons: building real comprehension (not memorization) before interviews, working through a curriculum with your own code as the anchor, returning to specific concepts as reference.


### Present a project as a demo

You're about to demo a project in a timed slot — a hackathon, a demo day, a show-and-tell. You want a run-of-show: what to say, what to show, in what order, against the clock.

  - **study-hackathon-demo.md** — book-style hackathon demo generator, run standalone (not part of the `study.md` orchestrator pass — you make a demo when you're presenting, not on every code change). Produces `.aipe/study-hackathon-demo/` as an overview plus six chapters (the cold open, the demo, under the hood, the build story, the close, the Q&A). Built around a hard time budget (up to 10 minutes, scalable to a shorter slot); the live demo is the centerpiece, with a designated "money shot" scheduled in the first third. Demo-specific visual treatments: time-budget bars, SAY/SHOW tables, verbatim script lines, IF-IT-BREAKS recovery boxes, and "tighten it" cuts for when you're running long. Coach posture, same engineer as the others. Demos only what the codebase actually does — unbuilt features go in the close as clearly-framed "what's next."

Common reasons: a hackathon submission demo, a demo-day pitch, a sprint review, rehearsing a timed walkthrough so you don't run over.


### Calibrate the format, the writer voice, or the reader profile

These aren't generators — they're foundational reference specs that every study generator above consults.

  - **format.md** — defines the concept-file format shared across the whole study family: the per-concept block template (Subtitle → Zoom out → How it works → Primary diagram → Implementation in codebase → Elaborate → Project exercises → Interview defense → Validate → See also), the house-style traits (skeleton parts; pattern / flow / layer / layers-and-hops diagrams; pseudocode; step-by-step; use cases; code side by side; zoom out then in; conversational tone), and the diagram / pseudocode / hard rules. This is the single source of truth for *how a concept file is structured*; the generators supply *what* goes in it.
  - **teacher.md** — defines the default writer persona (staff engineer, 12 years industry, FAANG → Series B) used in teacher posture by `study-system-design-dsa.md`, `study-ai-engineering.md`, and `study-agent-architecture.md`, and in coach posture by `study-interview-defense.md`. Names the teaching philosophy, format hierarchy (diagrams primary, prose fills in, pseudocode for logic, real code only when syntax matters), the conversational-tone trait, and what's banned (hedging, marketing language, etc.). Documents the *posture variations* — teacher vs coach — and names when *not* to use this persona (the prompt engineering exception).
  - **me.md** — defines the reader profile: who reads the artifacts, how they think, what they've already built, what they know vs honest gaps. Contains the DSA portfolio and the system design portfolio. Used by every study generator for example anchoring and depth calibration.

Update these when the format, the reader's knowledge, or the writer's voice should shift. Every study generator automatically inherits the changes — no duplication, no drift.


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

The TEACH branch has a clean separation between *how it's structured*, *who writes*, *who reads*, and *what gets written*:

```
format.md    ← concept-file format (block template, traits, rules)
teacher.md   ← writer persona (staff engineer, default voice)
me.md        ← reader profile (who you are, how you think)
   │              │              │
   └──────────────┴──────────────┘
        read by every study generator
                   │
                   ▼
study.md  ← orchestrator: runs the five below in one pass
   │
   ├─ study-system-design-dsa.md   → .aipe/study-system-design-dsa/
   ├─ study-ai-engineering.md      → .aipe/study-ai-engineering/
   ├─ study-prompt-engineering.md  → .aipe/study-prompt-engineering/  (uses own persona)
   ├─ study-agent-architecture.md  → .aipe/study-agent-architecture/
   └─ study-interview-defense.md   → .aipe/study-interview-defense/   (coach posture)

study-hackathon-demo.md  → .aipe/study-hackathon-demo/   (coach posture; standalone)
```

`format.md`, `teacher.md`, and `me.md` form the foundation. `format.md` is *how the file is shaped*; `teacher.md` is the *writer*; `me.md` is the *reader*. Each generator reads all three, and the artifact emerges from the conversation between them.

The precedence rule is four layers:

  1. **Generator wins on topic** — which concepts to cover, the topic-specific constraints, the output path.
  2. **`format.md` wins on concept-file structure** — the block template, the house-style traits, the diagram / pseudocode / hard rules.
  3. **`teacher.md` wins on voice register** — tone, posture, what's banned, the format hierarchy.
  4. **`me.md` wins on calibration** — which examples land, depth modulation, what's already known vs honest gaps.

Each consuming spec states this precedence explicitly so the agent can't get confused about what overrides what.


### How each spec handles the foundation layer

Every generator reads `format.md` for structure (the block template, the house-style traits, the diagram / pseudocode / hard rules). On top of that shared structure, each handles the *voice* foundation differently — tailored treatment, not carbon copies:

  - **study-system-design-dsa.md** references `teacher.md` in the default **teacher posture**. It is now just the system-design + DSA topic generator; it no longer carries the format (that moved to `format.md`).
  - **study-ai-engineering.md** references `teacher.md` in the default **teacher posture**, no shift.
  - **study-agent-architecture.md** references `teacher.md` in the default **teacher posture** — orchestration is systems-shaped work, so the staff-engineer voice fits. Cross-references `study-ai-engineering.md` for single-agent mechanics rather than re-teaching them.
  - **study-interview-defense.md** references `teacher.md` in **coach posture** — same engineer, different stance. The coach-posture-specific framing (hiring committees, more direct, optimized for landing) stays in this spec because it's specific to interview defense; the underlying engineer comes from `teacher.md`.
  - **study-hackathon-demo.md** references `teacher.md` in **coach posture** too, with a demo-coach framing layered on (watched a hundred demos win and lose; optimizes for the clock and the room). Like interview defense, it's book-style — an overview plus chapters, not the per-concept grid — but it's run standalone rather than through the orchestrator.
  - **study-prompt-engineering.md** is the exception. It references `teacher.md` to explicitly *not* use it, citing the "WHEN NOT TO USE THIS PERSONA" section. Its persona (working AI engineer with production scars) stays inline. `format.md` and `me.md` are still inherited because the structure and the reader are constant across the family.
  - **study.md** (the orchestrator) reads `format.md` once and hands it to all five generators, then runs each in create-or-update mode and prints one summary.


### Why this matters

The format extraction did for *structure* what the persona extraction did for *voice*: it pulled the concept-file template out of the system-design spec into `format.md`, a single source of truth every generator reads. The payoff is that changing the format is now a one-place edit that the whole family inherits. Recent changes that landed in one file and propagated to all five generators: the opening block became **Zoom out, then zoom in** (replacing "Why care"); **Tradeoffs**, **Tech reference**, and **Summary** were removed; the **house-style traits** were named (skeleton parts, the four diagram types, pseudocode, step-by-step, use cases, code side by side, zoom out then in, conversational tone); and the **load-bearing-skeleton** lens was added (isolate a pattern's kernel, name each part by what breaks when it's missing, separate skeleton from optional hardening).

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

format.md  ─┐
teacher.md  ─┤  read by every study generator before producing output
me.md  ──────┤  (no artifact of their own; foundation references only)
             │
             ▼

study.md  ──►  orchestrator: runs all five generators below in one pass
                  (reads format.md once, hands it to each, prints a summary)

study-system-design-dsa.md  ──►  system design + DSA concept files
  (reads format.md for structure)   anchored to this codebase
                                  (output: .aipe/study-system-design-dsa/)
                                    │
                                    └──►  no automatic handoff — the artifact is
                                          the deliverable; you read and return to it

study-ai-engineering.md  ───►  AI + ML concept files anchored
  (reads format.md for structure)  to this codebase
                                  (output: .aipe/study-ai-engineering/)
                                    │
                                    └──►  no automatic handoff — same as above

study-prompt-engineering.md  ───►  13 prompt-engineering concept files
  (reads format.md for structure)       anchored to this codebase
  (own working-AI-engineer persona)     (output: .aipe/study-prompt-engineering/)
                                    │
                                    └──►  no automatic handoff — same as above

study-agent-architecture.md  ───►  agent reasoning + orchestration concept
  (reads format.md for structure)      files anchored to this codebase
                                       (output: .aipe/study-agent-architecture/)
                                    │
                                    └──►  no automatic handoff — same as above

study-interview-defense.md  ───►  8-chapter book defending the project
  (reads format.md for structure)     at the interview level
  (coach posture from teacher.md)     (output: .aipe/study-interview-defense/)
                                    │
                                    └──►  pair with the concept files:
                                          concepts prepare the deep dive,
                                          this book prepares the wide opener

study-hackathon-demo.md  ───►  overview + 6-chapter demo run-of-show
  (reads format.md for structure)   for a timed presentation
  (coach posture from teacher.md)   (output: .aipe/study-hackathon-demo/)
  (standalone — not in orchestrator) │
                                    └──►  no automatic handoff — the book is
                                          the script you present from
```

The arrows are one-way. Refactors don't loop back to audits; audits don't execute refactors. The reflective specs hand off to the action flow but never receive from it. Each spec stays in its layer.

`format.md`, `teacher.md`, and `me.md` flow *into* the study generators but receive nothing back — they're foundations, not artifacts.


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
| `study.md` | Teach (orchestrator) | Any codebase | One command that runs all five study generators in create-or-update mode and reports a single summary |
| `study-system-design-dsa.md` | Teach | Any codebase | Per-codebase concept guides — system design + DSA — staff-engineer voice |
| `study-ai-engineering.md` | Teach | Any codebase, AI/ML topic | Per-codebase AI + ML concept guides — LLM foundations, retrieval, agents, evals, classical ML, system design templates — staff-engineer voice |
| `study-prompt-engineering.md` | Teach | Any codebase, prompt engineering topic | Per-codebase guide of 13 prompt-engineering concepts — working-AI-engineer voice |
| `study-agent-architecture.md` | Teach | Any codebase, agent topic | Per-codebase guide of reasoning patterns, multi-agent orchestration, and agent infrastructure — everything above a single agent — staff-engineer voice |
| `study-interview-defense.md` | Teach | Any codebase, project-level interview defense | Book-style 8-chapter defense of the whole project — coach posture, visual-first treatment |
| `study-hackathon-demo.md` | Teach (standalone) | Any codebase, timed demo presentation | Book-style overview + 6-chapter run-of-show for a ≤10-min demo — coach posture, time-budgeted, demo-as-centerpiece |
| `format.md` | Foundation | Format reference (concept-file structure) | Defines the concept-file block template, the house-style traits, and the diagram / pseudocode / hard rules every study generator inherits |
| `teacher.md` | Foundation | Persona reference (writer) | Defines the default staff-engineer voice across the study generators; named posture variations (teacher / coach); named exceptions |
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

  1. **format.md** — read this first to understand the concept-file structure every study generator produces: the block template, the house-style traits, the diagram / pseudocode / hard rules. This is the spine the topic specs fill.
  2. **me.md** — the reader profile every study generator consults. Read it to understand who the artifacts are calibrated for.
  3. **teacher.md** — the writer persona. Names the default voice, the format hierarchy, the bans, and the posture variations (teacher vs coach).
  4. The topic generators (`study-system-design-dsa.md`, `study-ai-engineering.md`, `study-prompt-engineering.md`, `study-agent-architecture.md`), the interview defense spec (`study-interview-defense.md`), and the hackathon demo spec (`study-hackathon-demo.md`) — once you've internalized `format.md`'s structure, each is just a topic + voice layered on top. The two book-style specs (interview defense, hackathon demo) layer the coach posture on top of that.
  5. **study.md** — the orchestrator. Read last: it ties the five generators together into one command once you know what each produces. (`study-hackathon-demo.md` is run standalone, outside the orchestrator.)

> The specs are designed to be read in this order, but used in any order. Reading order builds the mental model; usage depends on what you're trying to do.
