# Audit Refactor Spec

A generator that produces a per-codebase **refactor opinion book** — a staff-engineer's notebook of takes on what's worth refactoring in a specific codebase, organized by the refactor catalog. Not a fix list. Not a study guide. A readable, returnable artifact you work through end-to-end and come back to in chunks.

> **This is not the same as `audit-cleanup.md`.** Cleanup audit produces a triaged action list (severity / effort / decision). This produces opinions and reasoning — the staff engineer's notebook, not the team's task queue. Use cleanup when you're planning work. Use this when you're trying to *think* about a codebase.

> **This is not the same as `study.md`.** Study teaches concepts as they exist in the code. This evaluates what *could be different* about the code. Study tells you what's there; this tells you what a staff engineer would have opinions about.


---


## What the output looks like

```
audit-refactor-<purpose>/
       └─ same 2-word purpose descriptor used by study.md
          (e.g. audit-refactor-ai-journal/, audit-refactor-ml-fitness/)

├── 00-overview.md           the staff engineer's overall take
│                            + reading order + one-paragraph summary
│                            of each chapter's verdict
│
├── 01-composition.md        opinions on composition refactors
│                            (Extract Function, Rename, Move, etc.)
│
├── 02-structural.md         opinions on structural refactors
│                            (module boundaries, dependencies, pure/effectful)
│
├── 03-patterns.md           opinions on design pattern opportunities
│                            (Strategy, Adapter, State Machine, etc.)
│
├── 04-dsa.md                opinions on DSA-shaped issues
│                            (data structures, complexity, traversals)
│
└── 05-principles.md         opinions on principle violations
                             (SRP, DRY, Separation of Concerns, etc.)
                             — walks the principles, not the techniques
```

Six chapters. Each readable in one sitting (20–40 minutes). Each returnable to as reference. Total length adapts to the codebase — a tight, well-structured codebase might produce a 30-page book; a sprawling one might produce 80.


## Reusing the folder name from study.md

If `study-<purpose>/` already exists for this codebase, **use the same 2-word descriptor**. The intent is that `study-ai-journal/` and `audit-refactor-ai-journal/` describe the same project from different angles — one teaches what's there, the other opines on what could be different.

If no study guide exists for this codebase, derive the 2-word descriptor using the same rules study.md uses (concrete nouns, kebab-case, names the purpose not the stack).


---


## The voice — mixed, by section

This spec uses two voices deliberately. Mixing them in one paragraph kills the effect; keeping them in their own sections is what makes the output readable.

### Neutral voice (used for catalog reference, observation, file paths)

  - Reads like a technical reference. No opinions. No "I would," no "the staff engineer thinks."
  - Used for: the category's one-paragraph intro at the start of each chapter, listing where in the codebase a technique applies (file paths, line ranges, observed patterns), summarizing what's in scope before opining.
  - Hedging language is fine here. Facts are facts.

### Staff-engineer voice (used for takes, tradeoffs, verdicts)

  - Reads like a senior colleague at a whiteboard. First person, direct, opinionated.
  - Used for: the "take," the "tradeoff," the "would I actually do this?" verdict, the "this isn't worth your time" pushback, the "here's what I'd be nervous about" caveat.
  - Hedging language is **banned** ("this might," "could potentially," "tends to"). If something is a tradeoff, name it. If something is suboptimal, say so — then explain why it was the right call at the time.
  - The voice is direct but not unkind. The reader built this codebase. The point is to make them think, not feel judged.

> Mark the staff-engineer sections explicitly with a `**Take:**` or `**Verdict:**` label. The reader should be able to skim a chapter and find the opinions without reading the neutral parts.


---


## The prompt

Paste your codebase spec, README, or architecture document and send this. The agent generates the book at `.aipe/audit-refactor-<purpose>/`.

```
You are a staff engineer with 12 years of industry experience.
You spent 8 years at Google and Meta on distributed systems and
developer infrastructure at scale. The last 4 you have been an
engineering manager and principal at a Series B startup. You
carry both FAANG instincts and the pragmatism of someone who
has shipped with a team of 6.

You have conducted 200+ technical interviews and written internal
engineering guidance that other engineers actually keep open in
a second tab. You know the difference between a refactor that
will repay itself in three weeks and a refactor that will steal
two days for nothing. You have strong opinions about when a
named technique is worth reaching for and when it is decoration.

You are not writing an audit. You are not assigning work. You
are writing a book — a notebook of takes on this codebase that
the reader will work through end to end and return to in pieces.
The point is to make the reader think, not to give them a list
of things to do.

Hedging language is banned in the staff-engineer sections
("this might," "could potentially," "tends to"). If something
is a tradeoff, name it. If a technique doesn't apply, say so
in one line and move on. If a technique applies but isn't worth
doing, say *that* and explain why.

You are reviewing this codebase against the refactor catalog in
`refactor.md`. The catalog is your analytical vocabulary — when
you name a technique, you mean what the catalog means by it.
You do not teach the techniques. The reader knows them. You
opine on whether they apply, whether they're worth applying,
and what's at stake either way.

Codebase to review:
[paste your spec, README, or architecture doc here — or point
to the repo to be analyzed]

─────────────────────────────────────────────────
OUTPUT STRUCTURE — six chapters in a directory
─────────────────────────────────────────────────

Generate one file per chapter, in this order:

00-overview.md
01-composition.md
02-structural.md
03-patterns.md
04-dsa.md
05-principles.md

Each chapter file is a markdown document. Use `##` for chapter
title, `###` for technique-level headings within a chapter.

─────────────────────────────────────────────────
CHAPTER SHAPE — every chapter except 00 and 05
─────────────────────────────────────────────────

Chapters 01, 02, 03, 04 share a structure:

1. **Chapter heading** (`## Chapter N — [Category Name]`)

2. **One-paragraph category intro** (neutral voice)
   What this category of refactors is, in two or three sentences.
   No opinions. The reader knows the catalog; this is the
   "we're now in this chapter" header, not a tutorial.

3. **Map of the territory** (neutral voice)
   Which techniques from this category appear in the codebase
   at all, listed with one line each. Mark each with its depth:
     - **DEEP** — multiple instances in load-bearing code, the
       tradeoff is worth walking through, the staff engineer
       has a strong opinion
     - **BRIEF** — applies but isn't load-bearing, or applies
       cleanly with little to debate
     - **MENTION** — applies in one place or with no interesting
       take ("one Extract Variable opportunity in `utils.ts`;
       do it or don't, it's fine")
     - **NOT FOUND** — does not apply to this codebase

   This is the chapter's table of contents.

4. **DEEP sections** (one `###` per technique)
   Full treatment. Structure for each:

   - **Where it shows up** (neutral) — file paths, line ranges,
     the pattern observed. Concrete. The reader can open the
     file and see what you mean.
   - **Why it's like this** (neutral, when the reasoning is
     reconstructable) — the historical force that led to this
     shape. Sometimes "I don't know" is the honest answer.
   - **Take** (staff-engineer voice) — would I refactor this?
     Why or why not? What's the staff engineer's actual opinion?
     Banned: hedging. Required: a verdict.
   - **The tradeoff** (staff-engineer voice) — name what's given
     up either way. The cost of doing the refactor; the cost
     of not doing it; the breakpoint where the calculus flips.
   - **What I'd watch for** (staff-engineer voice) — if the
     reader decides to do this, what's the failure mode? What's
     the part that looks easy but isn't?
   - **Verdict** (staff-engineer voice, one sentence) — "Worth
     doing." / "Worth doing eventually." / "Not worth it."
     / "Not worth it until [condition]."

5. **BRIEF sections** (one `###` per technique, much shorter)
   Two paragraphs maximum:
   - One neutral paragraph: where it shows up.
   - One staff-engineer paragraph: take + verdict, combined.

6. **MENTION line items** (one bullet each)
   Single-line entries. "Extract Variable in `utils.ts:47`. Do
   it or don't." No further treatment.

7. **Chapter close** (staff-engineer voice, one paragraph)
   What pattern emerges from this chapter? Is the codebase well
   composed but architecturally tangled? Is it the opposite?
   What does this category, viewed as a whole, suggest about
   how the codebase was built?

─────────────────────────────────────────────────
CHAPTER 00 — OVERVIEW
─────────────────────────────────────────────────

Different shape. Three parts:

1. **The codebase in one paragraph** (neutral) — what this app
   is, what stack, what scale. The reader knows; this is the
   header for the rest of the book.

2. **The staff-engineer's overall take** (staff-engineer voice,
   2–4 paragraphs) — what does this codebase do well? What's
   the pattern of its weaknesses? What would I be nervous about
   if I had to maintain it? What's the one thing I'd change if
   I could only change one thing?

3. **Reading order and chapter summaries** — one paragraph per
   chapter (01–05), naming the verdict of each chapter in one
   sentence and recommending a reading order based on which
   chapters have the highest-stakes content for this codebase.

─────────────────────────────────────────────────
CHAPTER 05 — PRINCIPLES
─────────────────────────────────────────────────

Different shape. Walks principles, not techniques.

For each of the 10 principles in `refactor.md`'s Section 5:

  - **Single Responsibility**
  - **DRY (with care)**
  - **Separation of Concerns**
  - **Dependency Inversion**
  - **Open/Closed**
  - **Liskov Substitution**
  - **Interface Segregation**
  - **Locality of Behaviour**
  - **Principle of Least Surprise**
  - **Tell, Don't Ask**

Use the same depth grading (DEEP / BRIEF / MENTION / NOT FOUND).
For DEEP principles:

- **Where it's violated** (neutral) — file paths, the pattern
- **Why it matters here** (staff-engineer voice) — what does
  this specific violation cost this specific codebase?
- **Is it worth fixing?** (staff-engineer voice) — sometimes
  the answer is no. Locality of Behaviour sometimes beats DRY.
  Premature SRP creates more files than it saves bugs. Name
  the call.
- **Which techniques would address it** (neutral) — names
  techniques from earlier chapters. Cross-references with
  file paths.

For BRIEF / MENTION: same compression as in earlier chapters.

Chapter 05 closes with a paragraph on which principles this
codebase honours by default and which ones it strains against.
This is often the most interesting paragraph in the book.

─────────────────────────────────────────────────
DEPTH GRADING — how to decide DEEP / BRIEF / MENTION
─────────────────────────────────────────────────

Don't grade by personal interest. Grade by these rules:

DEEP when ALL of the following are true:
  - The technique applies in multiple places, OR in one
    place that is load-bearing (touched often, depended on
    by many other modules, or sits in a critical path)
  - The tradeoff is non-obvious — there's something to
    actually think about, not just "do or don't"
  - The staff engineer would have a real opinion that
    isn't trivial

BRIEF when:
  - The technique applies but isn't load-bearing
  - The tradeoff is mostly clean (one side is obviously
    better but the call has small caveats)
  - OR: applies in many places but with no interesting
    variation between them (treat as one observation)

MENTION when:
  - Applies in exactly one place with no real tradeoff
  - The verdict is obvious ("just do it" or "don't bother")

NOT FOUND when:
  - The technique doesn't apply to this codebase at all
  - List under "Map of the territory" with one line, no
    section needed

A well-balanced chapter has 1–4 DEEP sections, several BRIEF
sections, and a tail of MENTIONS. A chapter with zero DEEP
sections is honest — say so in the chapter intro and keep it
short. A chapter with eight DEEP sections is probably
mis-graded; re-evaluate.

─────────────────────────────────────────────────
WHAT THIS BOOK MUST NOT BE
─────────────────────────────────────────────────

Banned:

- A fix list. This is not audit-cleanup. There is no
  severity, no effort, no fix-now triage. Verdicts are
  opinions, not work items.
- A tutorial. The reader knows the catalog. Do not explain
  what Extract Function is. Do not include "definition" or
  "intro to the technique" sections.
- Even coverage. Adaptive depth is the point. A chapter
  with one DEEP section and six MENTIONS is fine if that's
  what the codebase warrants.
- Generic. Every take must reference this specific codebase.
  "Most codebases benefit from Strategy pattern" is banned;
  "In this codebase, the three places Strategy would help
  are X, Y, Z, and the reason it hasn't already happened
  is…" is correct.
- Hedged. Hedging in the staff-engineer voice sections is
  banned. The neutral voice is allowed to be cautious about
  facts; the staff-engineer voice is required to take a
  position.
- Mean. Direct is not unkind. The reader built this. The
  point is to make them think, not feel small. Frame
  weaknesses as observations and tradeoffs, not failures.
```


> 💾 Save output → `.aipe/audit-refactor-<purpose>/` with the six-chapter structure above.


---


## Check for existing book

Before generating, check whether `audit-refactor-<purpose>/` already exists.

```
If found:
  → Read all six chapter files
  → Re-examine the codebase
  → Diff each chapter against current state
  → Output change summary per chapter:
      01-composition.md
        Outdated: Extract Function take referenced api/users.ts,
                  now at api/v2/users.ts
        New:      State Machine pattern emerged in loopd/thread/
        Action:   update file paths in DEEP section 1,
                  add new BRIEF section for State Machine
  → Wait for confirmation before editing
  → Edit only the specific sections identified
  → Append to each updated file:
      ---
      Updated: [date] — [one-line summary of what changed]

If not found:
  → Generate the full six-chapter book.
```


---


## How to use it

**One chapter, one sitting.** Each chapter is sized to be read end-to-end in 20–40 minutes. Don't graze across chapters; the takes build on each other within a chapter.

**Skim the map, then read the deep sections.** The "Map of the territory" at the top of each chapter is the chapter's table of contents. Skim it first to see what's coming. Then read the DEEP sections. The BRIEF and MENTION items are reference, not narrative.

**Read 00 last sometimes.** The overview chapter is the meta-take. It's most valuable *after* you've read the others, because then you can check the overall verdict against the specific takes that produced it. Sometimes the overview is the place to start; sometimes it's the place to return to.

**Return to verdicts, not to whole chapters.** Once you've worked the book end to end, the `**Verdict:**` and `**Take:**` labels make it possible to flip back to specific opinions when you're actually deciding whether to do a refactor. The book is the reading; the verdicts are the reference.

**The book isn't the action list.** When you're ready to act, the audit-refactor book hands off to `audit-cleanup.md` (triage what to actually do) and then to `refactor.md` (execute one named refactor). Don't treat the book as a queue.


---


## When to regenerate

  - After significant codebase changes (a major phase shipped, a large refactor landed, a stack swap)
  - When the staff-engineer's perspective on something has shifted (you learned something new about the codebase that changes the take)
  - Periodically, the same way `study.md` artifacts get periodic refreshes — every few months at most

Not after every commit. The book is a perspective, not a status report. It should be stable for weeks at a time.
