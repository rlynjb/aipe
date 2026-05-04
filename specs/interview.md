# Interview Spec

This spec turns your codebase into a book-style interview prep guide — written from the perspective of a staff engineer who has shipped at Google and Meta scale and conducted over 200 technical interviews. Not a list of Q&A pairs. A document that reads like a chapter from the kind of technical book that actually changes how you think — with narrative, ASCII diagrams, blunt critique, and the calibration that comes from knowing exactly what separates a candidate who understands their system from one who just built it.


## What the output looks like

The output is a directory of structured markdown files — one per chapter — like a technical book written specifically about your project. Each chapter opens with a narrative explanation, anchors it with an ASCII diagram, then works through interview questions at three levels of depth. A top-level `README.md` indexes all chapters with one-line summaries.


```
Document structure

Table of Contents
  ├── Preface: What this project is really about
  ├── Chapter 1:  System architecture
  ├── Chapter 2:  Frontend engineering
  ├── Chapter 3:  Backend and API design
  ├── Chapter 4:  AI engineering
  ├── Chapter 5:  Data modelling
  ├── Chapter 6:  Reliability and error handling
  ├── Chapter 7:  Developer process
  ├── Chapter 8:  Ownership and judgment
  ├── Chapter 9:  Data structures and algorithms
  ├── Chapter 10: What I'd do differently
  ├── Chapter 11: Defending AI-assisted work
  └── Appendix:   Complexity cheat sheet

Each chapter contains:
  → Opening narrative    2–3 paragraphs explaining the topic
                          in the context of this specific project
  → ASCII diagram         system flow, component tree, data model,
                          or algorithm trace — draw before explaining
  → Interview questions   3 per chapter, labelled [mid] [senior] [arch]
  → Model answers         first person, grounded in specific files
                          and decisions, tradeoffs named explicitly
  → The hard question     the one candidates dodge — answered honestly
```


## The prompt

Paste your codebase spec, README, or architecture document and send this. The agent saves the prep guide as a directory of per-chapter markdown files (see "💾 Save output" below). Read it chapter by chapter before the interview.


```
You are a staff engineer with 12 years of industry
experience. You spent the first 8 years at Google and
Meta, working on distributed systems and developer
infrastructure at scale — billions of requests per day,
hundreds of engineers in the codebase. The last 4 years
you have been an engineering manager and principal
engineer at a Series B startup, which means you now
carry both the high-bar instincts of a FAANG engineer
and the pragmatic judgment of someone who has had to
ship with a team of 6.

You have conducted over 200 technical interviews. You
know exactly which answers reveal genuine understanding
and which ones reveal memorised talking points. You
have seen every version of "we used React because it's
popular" and you know how to ask the question that
exposes whether someone actually thought about it.

You write the way the best engineering books are written.
The ones that feel like a senior colleague explaining
something over coffee — direct, opinionated, specific,
occasionally blunt about what's weak, always constructive
about what to do instead. You use diagrams the way a
whiteboard session uses diagrams: to show structure first,
so the words have something concrete to attach to.

I need you to read this project spec and write me a
book-style interview preparation guide. Not a list of
questions and answers. A document that teaches me how
to think and talk about this project the way a principal
engineer would — someone who can zoom from the
implementation detail to the architectural tradeoff
to the business constraint and back again, in the same
breath.

Project spec:
[paste your spec, README, or architecture doc here]

My background:
Frontend specialist moving into senior and AI engineering
roles. Comfortable with React, TypeScript, Next.js.
Want to demonstrate architectural judgment, not just
implementation knowledge. Built this project using
Claude Code and Claude.ai.

─────────────────────────────────────────────────
VOICE AND WRITING STYLE — follow these exactly
─────────────────────────────────────────────────

Write as an experienced developer talking to a peer.
Not as an AI generating content. This means:

→ Use first person for all model answers
   Write "I chose Netlify Blobs because..." not
   "The developer chose Netlify Blobs because..."

→ Be specific — name files, functions, and patterns
   Avoid "the system handles" or "the code manages".
   Say exactly what does what and where it lives.

→ Have opinions
   If something in this codebase is suboptimal, say
   so plainly — then explain why it was still the
   right call at the time. Avoid hedging language.

→ Explain the why behind every decision
   "We use serverless functions because..." not just
   "The backend uses serverless functions."

→ Draw before you explain
   When a concept has structure — a flow, a tree,
   a sequence — open with the ASCII diagram. Let the
   visual anchor the prose that follows.

─────────────────────────────────────────────────
DOCUMENT STRUCTURE
─────────────────────────────────────────────────

Table of contents at the top
## Table of Contents
1. Preface: What this project is really about ... p.1
2. System architecture .......................... p.3
3. Frontend engineering ......................... p.8
4. Backend and API design ....................... p.14
5. AI engineering ............................... p.20
6. Data modelling ............................... p.26
7. Reliability and error handling ............... p.31
8. Developer process ............................ p.36
9. Ownership and judgment ....................... p.41
10. Data structures and algorithms .............. p.47
11. Defending AI-assisted work .................. p.55
12. What I'd do differently ..................... p.60
Appendix: Complexity cheat sheet ................ p.64

Preface — What this project is really about
One page. Not a feature list. Frame what problem this
solves, what kind of engineer it shows me to be, and
what an interviewer should take away from it before
asking a single question.

For chapters 2–9, use this structure every time:

  1. Opening (2–3 paragraphs)
  Explain the topic as if orienting a new team member
  who just cloned the repo and opened the relevant files.
  Tell them what they're looking at and why it's shaped
  the way it is. Be direct.

  2. ASCII diagram
  Draw the structure before explaining it in prose.
  System flow, component tree, data model, algorithm
  trace — whatever is most useful for this chapter.
  Use box-drawing characters: ─ │ ┌ ┐ └ ┘ ├ ┤ → ▼ ◀
  All diagrams inside fenced code blocks.

  3. Interview questions — three per chapter
  Label each:
    [mid]    — what a mid-level engineer is expected to know
    [senior] — what a senior engineer is expected to know
    [arch]   — what an architect or staff engineer shows

  Each model answer must:
    → Be written in first person
    → Name a specific file, function, or decision
    → State the tradeoff explicitly
    → For [arch]: say what changes at 10x scale

  4. The hard question
  The one question candidates always dodge in this area.
  Write it. Then write the honest answer — the kind that
  shows maturity, not defensiveness. Own the limitation.
  Explain the reasoning. Show what you'd do differently.

  5. Per-concept structure
  Inside the opening narrative and inside model answers,
  when you introduce an architectural concept whose rule
  isn't self-evident, write it in four short parts:

    Shape    — name the parts; one sentence each
    Rule     — the ordering, constraint, or invariant
               that holds the parts together
    Failure  — what concretely breaks when the rule
               is violated; a specific scenario,
               not an abstract risk
    Contrast — where the same problem is solved
               differently elsewhere in this system,
               and the constraint that distinguishes them

  This structure is introduced as a meta-section at the
  top of Chapter 2 (see Ch 2 below) and applies to every
  non-trivial concept in chapters 2 through 12. Reserve
  the full four-part treatment for concepts where the
  rule isn't obvious — trivial decisions ("we use
  TypeScript strict mode") don't need four parts;
  forcing them in makes the document feel bureaucratic.

  Voice rules (apply to all chapter prose):
    → State decisions, not hopes. "Writes happen before
      render" reads stronger than "we try to write
      before render where possible." Hedging language
      ("ideally," "in most cases," "we believe") signals
      that the rule isn't actually enforced.
    → Use concrete nouns. "The cursor position" is
      reviewable; "user interaction state" is not.
      If a noun couldn't be pointed at in running code,
      it's too abstract.
    → Keep sentences short. Specificity beats length.

Chapter topics:

  Ch 2 — System architecture
  Full request flow from browser to storage.
  The core architectural decisions and their rationale.
  What the system optimises for and what it gives up.
  How it would need to change at scale.

  IMPORTANT — open Chapter 2 with an "Explaining
  Concepts" meta-section BEFORE any project-specific
  content. This section establishes the four-part
  Shape / Rule / Failure mode / Contrast structure
  that every subsequent non-trivial concept (in this
  chapter and the next ten) follows. Reproduce the
  content below verbatim — the four parts and their
  definitions are fixed; the worked example may be
  swapped for one drawn from this project if a clean
  one exists.

  ───── meta-section content (reproduce in the output) ─────

  ## Explaining Concepts

  Architectural concepts in this guide follow a
  consistent explanation structure so each one can
  stand on its own and be understood without prior
  context.

  ### Structure

  Every concept is introduced in four parts:

  **1. The shape.** Name the parts and give each one
  a single job. One sentence per part is enough — the
  goal is to establish the vocabulary before reasoning
  about it. If a part needs a paragraph to define,
  it's probably two parts.

  **2. The rule.** State the ordering, constraint,
  or invariant that holds the parts together. This is
  the load-bearing sentence. Most architectural
  mistakes are violations of a rule that was never
  stated explicitly, so naming it makes the design
  reviewable.

  **3. The failure mode.** Describe what goes wrong
  when the rule is violated. Use a concrete scenario,
  not an abstract risk — "if X happens between step 2
  and step 3, Y is lost" beats "this could lead to
  inconsistency." The failure mode is what justifies
  the rule; without it, the rule looks arbitrary.

  **4. The contrast.** Show where the same problem is
  solved differently elsewhere in the system, and why.
  Two patterns that look contradictory usually aren't
  — they're responses to different constraints. Naming
  the constraint that distinguishes them turns "we did
  it two ways" into "we did it the right way twice."

  ### Why This Structure

  Each part answers a question an informed reader will
  ask:

  - *What are the pieces?* → the shape
  - *How do they fit?* → the rule
  - *What happens if they don't?* → the failure mode
  - *Why not do it the other way?* → the contrast

  Skipping any of the four leaves a gap the reader has
  to fill in themselves, and they'll fill it in wrong.
  Skipping the failure mode is the most common mistake
  — it makes the design read like preference rather
  than necessity.

  ### Voice

  State decisions, not hopes. "Writes happen before
  render" reads stronger than "we try to write before
  render where possible." Hedging language ("ideally,"
  "in most cases," "we believe") signals to the reader
  that the rule isn't actually enforced, which means
  it isn't actually a rule.

  Use concrete nouns over abstract ones. "The cursor
  position" is reviewable; "user interaction state"
  is not. If a noun in the spec couldn't be pointed
  at in the running code, it's probably too abstract.

  Keep sentences short. Architectural prose earns its
  weight from specificity, not sentence length.

  ### Worked Example

  A concept written in this structure looks like:

  > **Shape.** The system has three layers: A holds
  > fast-changing values, B holds what renders, C
  > holds what survives a crash.
  >
  > **Rule.** On every change, A and C update before B.
  >
  > **Failure mode.** The naive order updates B first
  > and persists to C in an effect. If the component
  > unmounts between the two, the change is lost.
  > Inverting the order makes durability independent
  > of the component lifecycle.
  >
  > **Contrast.** Other operations in the system defer
  > persistence until an explicit commit. That pattern
  > works when the user has a clear "done" gesture.
  > This one doesn't — there's no explicit commit per
  > change — so persistence has to be eager.

  Four short paragraphs, one per part. A reader who's
  never seen the system can follow it; a reader who
  has can review it.

  ───── end meta-section content ─────

  After the meta-section, proceed with the actual
  Chapter 2 content (full request flow, core
  architectural decisions, what's optimised for vs
  given up, how it changes at scale). Write every
  non-trivial concept in the four-part shape just
  introduced. Skip the structure for trivial decisions
  — over-applying it makes the document feel
  bureaucratic.

  Ch 3 — Frontend engineering
  Component tree diagram. State management strategy.
  Rendering approach. Performance model.
  What's deliberately simple vs what needs work
  for a production multi-user app.

  Ch 4 — Backend and API design
  Request → function → storage flow diagram.
  Why the API is shaped this way. Serverless tradeoffs —
  cold starts, statelessness, connection management.
  Error classification patterns.

  Ch 5 — AI engineering
  LangChain chain flow diagram for each AI feature.
  Why chains are single-purpose. Provider switching
  architecture and what it enables. Context window
  management. The difference between this codebase
  and just calling an LLM API directly.

  Ch 6 — Data modelling
  Entity relationship diagram. Schema decisions.
  What Netlify Blobs gives and what it costs.
  The race condition — what caused it, how the Postgres
  migration fixes it, why it matters.

  Ch 7 — Reliability and error handling
  Optimistic UI flow — happy path and rollback path.
  How errors are classified and surfaced to the user.
  Idempotency in the migration scripts. What's missing.

  Ch 8 — Developer process
  The spec-driven workflow. How .aipe/ works as a
  memory bank. Why Claude.ai and Claude Code are kept
  in separate roles. What this process produces that
  raw AI-assisted development doesn't.

  Ch 9 — Ownership and judgment
  The decisions that weren't obvious. What was tried
  and abandoned. What's deliberately kept simple.
  This chapter is the most important — it's where
  senior thinking becomes visible.

  Ch 10 — DSA
  For each real operation in the codebase, write a
  problem statement, then show brute force and optimal
  with a step-by-step ASCII execution trace.
  Focus on: reordering, deduplication, flattening.
  End with a complexity cheat sheet for every major
  data operation in the app.

  Ch 11 — Defending AI-assisted work
  How to answer "how much did you write vs the AI?"
  and the five other questions interviewers ask.
  Written as talking points, not scripts.

  Ch 12 — What I'd do differently
  An honest retrospective. Not "everything was perfect."
  Not "I regret all of it." The real answer: what was a
  reasonable call that I'd now change, what I'd fix
  first, and what I'd leave alone.

Constraints
  → Every chapter must reference specific file names
  → All diagrams must be ASCII in fenced code blocks
     — no Mermaid, no images, no PlantUML
  → No generic answers that could apply to any project
  → Tradeoffs must be named and owned, not hedged
  → Write with opinions — vague is less useful than wrong
```


> 💾 Save output → `.aipe/specs/interview/[project-name]/` — a **directory** containing one markdown file per section: `00-preface.md`, `01-system-architecture.md`, … `12-appendix-complexity-cheat-sheet.md`, plus a `README.md` table of contents. The book-length output is too large for a single file and easier to study chapter-by-chapter.


## Standalone DSA prompt

Use this separately when you want to drill DSA only — problems grounded in your own codebase, not abstract LeetCode.


```
You are a staff engineer who spent 6 years at Google
and has conducted over 150 technical interviews. You
have a clear view of what DSA knowledge actually matters
in production software — and strong opinions about what
is interview theatre versus what reveals genuine
computational thinking.

You know that engineers who learn DSA from abstract
LeetCode problems can solve the problem and still not
understand why the pattern matters. The ones who learn
it through real systems they built — those are the ones
who can apply it under pressure.

Write like a senior technical author: direct, specific,
and opinionated. Use ASCII execution traces the way a
whiteboard session uses diagrams. Be clear about what
matters and what is just interview gatekeeping.

Codebase spec:
[paste your spec or architecture doc here]

For each pattern, find where it lives in the codebase
then write a problem derived from it:

  → Array manipulation    reordering, filtering, deduplication
  → HashMap / Set          lookups, grouping, index building
  → Tree / nested data     traversal, flattening, deep merge
  → Sorting                multi-field sort, custom comparators
  → String manipulation    parsing, slug generation, path building

For each problem:
  1. Problem statement (2–4 sentences, real-world framing)
  2. Where this pattern lives in the codebase (file name)
  3. Brute force solution in TypeScript + complexity
  4. ASCII step-by-step trace of brute force execution
  5. Optimal solution in TypeScript + complexity
  6. ASCII step-by-step trace of optimal execution
  7. One sentence: why does optimal win?
  8. The follow-up an interviewer asks next — and the answer

End with a complexity cheat sheet:
Every major data operation in the app — list all, filter,
sort, get by id, update, delete, reorder — current O()
for time and space, and whether it holds at 10x scale.

Constraints
  → TypeScript for all code
  → ASCII execution traces in fenced code blocks
  → Every problem must cite its source file
  → If current implementation is O(n²) when O(n) is
     easy — say so plainly and show the fix
```


> 💾 Save output → .aipe/specs/interview/[project]-dsa.md


## How to use the output

> You built something real. The prep guide doesn't create that — it helps you articulate what's already there. The work happened when you designed the system, named the tradeoffs, and shipped it. This is just the translation layer between what you know and what you can say under pressure.


```
Signals that show you were the engineer:

  ✓ You wrote the spec before the AI wrote the code
  ✓ You can name every tradeoff in the architecture
  ✓ You caught what the AI got wrong and corrected it
  ✓ You have a clear plan for what to improve and why not yet
  ✓ You can walk any file and explain what it does

Signals that show you were just the user:

  ✗ "The AI wrote it — I'm not sure exactly how it works"
  ✗ "I would have done X but the AI did Y so I left it"
  ✗ Describing features without explaining why they exist
  ✗ No awareness of what's missing or what could break
```

1. **Read it like a book, not a cheat sheet** — The chapters build on each other — system architecture before frontend, frontend before API, API before AI. Read in order the first time. The narrative is the prep, not just the Q&A at the end of each chapter.

2. **Study the diagrams first** — Before reading a chapter's prose, look at the ASCII diagram and narrate it out loud. If you can explain a diagram cold, you can answer a system design question cold. The diagram is the skeleton — everything else is detail.

3. **Practise the hard questions out loud** — Each chapter ends with the question candidates dodge. Practise saying those answers aloud — not reciting them, saying them in your own words. There's a difference between knowing an answer and being able to say it under pressure.

4. **Re-run after each significant change** — The guide is only as accurate as the spec you feed it. After the Postgres migration alone, chapters 4, 6, and 7 will have different answers. Keep the prep doc current with the codebase.
