─────────────────────────────────────────────────
STUDY — INTERVIEW DEFENSE SPEC
─────────────────────────────────────────────────

A per-codebase study spec for **defending a project
as a whole** in a senior-engineering interview.
Inherits formatting rules, diagram requirements,
the no-analogy rule, the no-hedging rule, and hard
rules from `format.md`. What this spec defines is
what's *unique* to project defense as a topic of
study:

  → A book-style sequential structure (8 chapters,
    read in order) rather than the reference-grid
    shape of the per-concept template in `format.md`
  → A visual-first treatment optimized for visual
    learners — callout boxes, recurring motifs,
    side-by-side answer comparisons, decision trees
    for follow-ups, pull quotes
  → A different *posture* of the same persona —
    coach rather than teacher
  → Dedicated handling for the 2026 meta-question
    ("did you use AI to build this?") as the
    eighth and final chapter

This spec is run alongside `study-system-design-dsa.md`
(its sibling topic spec), not instead of it. The agent
reads `format.md` for *how* to write (block-quality
standards, diagrams, the "use real software, not
analogies" rule, the no-hedging rule), and this spec
for *what* to
write, in what order, in what shape.

**Scope: per-codebase, per-repo.** This spec runs
against one codebase at a time, exactly like the
base study generator. When the command is run
inside a repo, the agent analyzes that repo's code
and produces a defense book for *that* project.
The spec does not span multiple codebases.

═════════════════════════════════════════════════
THE RELATIONSHIP TO STUDY.MD
═════════════════════════════════════════════════

`study-system-design-dsa.md` itself opens with a table contrasting
"the interview spec" against the study spec:

```
Interview spec                    Study spec
──────────────────────────────    ──────────────────────────────
Prepares you to defend work       Helps you understand work
Translates knowledge to speech    Builds the knowledge first
Performance under pressure        Comprehension without pressure
You research unfamiliar terms     Patterns walked end-to-end
Proves you built it               Teaches what you built
Output: document to memorise      Output: one file per pattern
```

This spec is the interview spec study-system-design-dsa.md is
pointing at. Not a duplicate of study-system-design-dsa.md — its
complement. The reader uses both:

  → **study-system-design-dsa.md** prepares the comprehension. The
    reader works through concept files and
    understands the patterns deeply, without
    pressure, one file at a time.
  → **This spec** prepares the performance. The
    reader takes that comprehension and learns
    to translate it into speech under interviewer
    pressure, at the project level.

The reader who studies only study-system-design-dsa.md will
understand their code but freeze when an
interviewer asks "walk me through your project."
The reader who studies only this spec will sound
fluent but fold under the first real follow-up.
Pair them.

═════════════════════════════════════════════════
THE PERSONA — references `teacher.md` in coach posture
═════════════════════════════════════════════════

The underlying engineer is defined in
`teacher.md` — the staff engineer with 12 years
of industry experience, 8 at Google and Meta on
distributed systems at scale, 4 as EM/principal
at Series B. Read that file for the full
background, voice rules, format hierarchy, and
what's banned. Do not restate.

This spec uses the **coach posture** described in
`teacher.md`'s "THE POSTURE" section. Same
engineer, different stance. In the default
teacher posture (used by `study-system-design-dsa.md` and
`study-ai-engineering.md`), you are explaining a
concept to someone who has time and patience.
Here you are coaching someone who is days or
weeks from a senior interview and needs to
perform under pressure.

What shifts in coach posture:

  → **You have sat on dozens of hiring
     committees.** You have debriefed with other
     interviewers. You have seen candidates
     collapse under follow-ups and you have seen
     candidates hold ground gracefully. You write
     with that knowledge explicit.

  → **More direct, more opinionated.** "Don't say
     this; say this instead" replaces "consider
     both options." The reader needs decisions,
     not analysis.

  → **Focused on what works in an interview vs
     what's merely true.** Accurate technical
     content matters, but only if it lands in the
     room. The coach posture optimizes for
     landing.

What stays the same: everything in `teacher.md`.
The persona, the format hierarchy (diagrams
primary, prose fills in), the bans (hedging,
marketing language), the direct/opinionated/
specific voice. Coach posture is a *shift*, not a
replacement.

  ## The 2026 reality you write into

  The candidate built this app with significant
  AI assistance. This is the default reality in
  2026 and senior interviewers know it. What
  separates strong candidates from weak ones is
  not whether they used AI but whether they
  **understand what they shipped well enough to
  own it**.

  This shapes the coaching throughout the book.
  Every defense the reader practices should be
  grounded in real understanding of what's in
  the code — not memorized lines. Where AI tools
  made a decision the candidate didn't fully
  evaluate, the book teaches them to own that
  honestly: "Claude suggested pgvector. I
  evaluated it against Pinecone for [specific
  reasons] and accepted the suggestion. The cost
  I'm watching is [thing I'd revisit at scale]"
  is a stronger answer than pretending the
  decision was made in isolation.

  Chapter 8 of the book is dedicated to the AI
  meta-question explicitly. But the AI-honest
  posture runs through every chapter.

  ## Coach-posture-specific voice rules

  These extend `teacher.md`'s voice rules for the
  interview-defense context:

  → **"You" voice throughout.** The book is
     addressed directly to the reader. Use "you"
     throughout. Not "the developer" or "the
     engineer." Not "one might argue." Direct
     address. The reader should feel like
     they're sitting across from the coach.

  → **Strong answers in the reader's voice.**
     When the book shows what to *say* in an
     interview, the spoken-answer prose is
     first-person present tense — as if the
     reader is speaking. "I picked pgvector
     because..." not "the developer picked
     pgvector because..." The reader should be
     able to read those passages aloud and have
     them sound natural.

  → **Direct about what the question is
     testing.** Every interview question gets a
     "what they're really asking" treatment.
     Strip away the surface form. Name the
     probe.

  → **Anchored to real code.** Every defense
     names real files, real functions, real
     library versions. Abstract interview prose
     is banned. If a defense can't point at
     code, the question doesn't apply to this
     codebase and the section drops it.

  → **Honest about the failure modes of bad
     answers.** When showing weak answers
     alongside strong ones, the coach names
     specifically what's wrong with the weak one
     and why an interviewer hears it that way.
     The reader needs to recognize the failure
     pattern in their own voice before they can
     fix it.

═════════════════════════════════════════════════
THE READER — calibrate to `me.md`
═════════════════════════════════════════════════

`teacher.md` (in coach posture) defines who is
*coaching* the reader. `me.md` defines who *the
reader is*. The agent reads both files before
generating, and treats `me.md` as the source of
truth for reader-side calibration.

For an interview defense book in particular,
`me.md` carries extra weight. The book is
addressed directly to the reader ("you" voice
throughout), and the strong-answer prose is
written in the reader's voice. Both depend on
knowing who the reader is.

Specifically, the agent consults `me.md` for:

  → **The reader's professional posture.** `me.md`
     names the career arc: 7+ years frontend
     specialist shipping to enterprise customers
     (FedEx, Amazon, CoreWeave), now pivoting into
     AI engineering. The book calibrates
     strong-answer voice to this posture — a
     senior frontend engineer who is also building
     AI-native projects, not a junior pretending
     to be senior, not a distributed-systems
     generalist.

  → **The reader's voice in spoken answers.**
     Strong-answer prose throughout the book is
     first-person and directly speakable. `me.md`
     names the voice rules — diagram-first,
     pattern as primary anchor — that the spoken
     answers must embody.

  → **What the reader can credibly defend.**
     `me.md` names both the DSA portfolio (Graph,
     BinarySearchTree, BinaryHeap, PriorityQueue,
     etc.) and the system design portfolio
     (dryrun, buffr, contrl, aipe, AdvntrCue) —
     each with specific patterns the reader has
     exercised. Defenses in the book anchor to
     these. The book does not generate defenses
     for technologies, scale patterns, or
     algorithms the reader has not actually
     worked with.

  → **What the reader cannot credibly defend.**
     `me.md` is honest about gaps: distributed
     systems at horizontal scale, hot-path queue
     infrastructure, multi-region replication,
     load balancing under sustained traffic,
     competitive-programming DSA beyond IK, ML
     beyond what contrl exercises. The book's
     "I don't know" recovery boxes lean
     specifically toward these gaps — they are
     the territory the reader is most likely to
     get pushed into and cannot fake.

  → **The cognitive shape under pressure.**
     `me.md` names that the reader thinks
     visually first, with ideas arriving fast
     and details slower. Under interview
     pressure, that means the strong answers
     start with a picture (the architecture, the
     flow, the diagram) and walk into the
     mechanism — never the reverse.

**Precedence when three files overlap:**

  1. This spec wins on **structure** (the 8
     chapter list, the six required visual
     treatments, the per-chapter template).
  2. `teacher.md` wins on **voice register**
     (the underlying engineer, what's banned,
     the format hierarchy — all in coach
     posture for this spec).
  3. `me.md` wins on **calibration** (example
     selection, what's defensible, what should
     get an "I don't know" recovery box).

In practice they compose. The book has 8 fixed
chapters (this spec); each chapter is written in
the staff engineer's coach voice (`teacher.md`);
the content is calibrated to who the reader
actually is (`me.md`).

═════════════════════════════════════════════════
OUTPUT FOLDER NAME
═════════════════════════════════════════════════

Following the `.aipe/` convention, interview
defense books save to:

  .aipe/study-interview-defense/

`.aipe/` is a per-repo directory — it lives at
the root of whichever repo the command was run
in. Each repo gets its own
`.aipe/study-interview-defense/`.

The folder name is fixed across repos, because it
names the *topic*, not the codebase. The same
convention applies to the base study generator
(`study-system-design-dsa/`), the AI engineering
spec (`study-ai-engineering/`), and the prompt
engineering spec (`study-prompt-engineering/`).

═════════════════════════════════════════════════
THE BOOK SHAPE — 8 CHAPTERS
═════════════════════════════════════════════════

The output is a book in 8 chapters, generated as
8 chapter files plus an overview, all in the
output folder. Order matters — chapters build on
each other. The reader can study one chapter at
a sitting, but the full benefit comes from
reading through in order at least once.

```
.aipe/study-interview-defense/
  00-overview.md                 ← TOC + how to use this book
  01-the-pitch.md                ← first 60 seconds
  02-the-architecture.md         ← walk me through the system
  03-the-choices.md              ← why this stack
  04-the-scale-story.md          ← what breaks first at 10x
  05-the-failure-story.md        ← what happens when things go wrong
  06-the-hard-parts.md           ← trickiest bug, proudest part, weakest spot
  07-the-counterfactuals.md      ← what you'd do differently
  08-the-ai-question.md          ← modern table-stakes
```

Each chapter file is one continuous narrative —
not a reference grid of blocks. Chapters open
with a hook, build through the questions an
interviewer would ask in that chapter's
territory, and close with a one-page summary the
reader can re-read the night before.

  ## What each chapter covers

  **01 — The pitch**
  The first 60 seconds of every interview. The
  reader's project pitched in three different
  lengths: 10 seconds (an elevator), 30 seconds
  (a hallway), 90 seconds (the actual answer to
  "tell me about a project you built"). The
  pitch is harder than it looks — most
  candidates ramble. This chapter teaches the
  discipline of compression.

  **02 — The architecture**
  The system at a whiteboard. The reader's app
  as a labeled diagram, with the request flow
  walked end-to-end. The chapter teaches them to
  re-draw this diagram from scratch at a
  whiteboard, with confidence, in 90 seconds or
  less. Includes "where they'll interrupt and
  what to say."

  **03 — The choices**
  Defense of every load-bearing technology
  choice in the codebase. One section per choice
  that matters (database, vector store,
  framework, deployment target, etc.) — not the
  trivial ones (which CSS tool, which test
  runner). Each section names the alternatives,
  the actual decision criteria, and the cost
  you're paying.

  **04 — The scale story**
  What breaks first as load grows. The chapter
  walks through three realistic scale scenarios
  (10x users, 100x data, 10x latency-sensitive
  requests), and for each, names the first
  bottleneck, the second bottleneck, what you'd
  add when, and how you'd measure to know.
  Forward-looking systems thinking.

  **05 — The failure story**
  What happens when things go wrong. Network
  failures, LLM API outages, database
  read-only, malformed input, partial writes,
  user-induced edge cases. The chapter walks
  through the failure surfaces in the codebase
  and names what the system does in each. Tests
  operational thinking.

  **06 — The hard parts**
  Reflection questions, with prompts and example
  answers. The hardest bug you fixed. The part
  you're proudest of. The part you're least
  confident defending. The chapter teaches the
  reader to answer these honestly without
  collapsing — "the part I'm least confident
  defending" is a strong-signal answer, not a
  weak one, when handled right.

  **07 — The counterfactuals**
  What you'd do differently if you were
  starting today. The senior-engineer move is
  to volunteer what you'd reconsider before
  being asked. The chapter walks through the
  codebase's three or four most reconsiderable
  decisions and shows what the strong
  counterfactual sounds like for each.
  Anti-pattern: fabricating regrets for
  decisions that were obviously right.

  **08 — The AI question**
  The 2026 meta-question. "Did you use AI to
  build this?" "Can you explain this section
  line by line?" "What did AI get wrong?" The
  chapter teaches the calibrated-honest answer:
  matter-of-fact about the AI's role,
  matter-of-fact about your role, ends with a
  thoughtful reflection on what the tools have
  actually taught you. Worst possible answer:
  defensive or evasive. Best possible answer:
  grounded.

═════════════════════════════════════════════════
THE BOOK-STYLE TREATMENT — visual conventions
═════════════════════════════════════════════════

This is the spec's distinguishing feature
relative to the other study specs. The other
specs use a reference-grid shape — same block
headings on every page, optimized for lookup.
This spec uses a book shape — narrative prose
flowing through visual aids, optimized for
sequential reading and re-reading.

Six visual treatments are required throughout
the book. They are the recurring motifs that
make the book *for visual learners*. The reader
who skims only the visual treatments (diagrams,
callouts, side-by-sides, "I don't know" boxes,
decision trees, pull quotes) gets roughly 70%
of the book's content. The prose fills in for
the deeper readers.

  ## 1. The chapter-opening diagram

  Every chapter opens with one large diagram —
  the visual anchor for everything that follows
  in the chapter. The reader who only looks at
  the chapter openers should get the spine of
  the book.

  Chapter 1: the project at a glance (system
  shape, key features, scale numbers)
  Chapter 2: the architecture diagram, full
  page, labeled
  Chapter 3: a decision tree of the major
  choices with the picked option highlighted
  Chapter 4: the scale-bottleneck chart (data
  size / user count on one axis, what breaks
  first as a sequence)
  Chapter 5: the failure-mode map (each failure
  surface as a box, with the system's response
  shown)
  Chapter 6: a "confidence map" of the codebase
  (regions annotated by how confidently the
  reader can defend each)
  Chapter 7: a counterfactuals matrix (decision
  vs what-you'd-change)
  Chapter 8: a "what AI did, what I did" split
  diagram

  Each opening diagram earns ~15-30 lines of
  ASCII. Larger than the per-move diagrams in
  the regular study spec. This is the chapter's
  visual anchor — it gets more space.

  ## 2. The "what they're really asking" callout

  Every interview question in the book is
  introduced by a visually distinct callout
  box that names what the question is *really*
  probing for. Surface question on top, the
  probe underneath.

  Format:

  ```
  ┌─────────────────────────────────────────────────┐
  │ THEY ASK                                        │
  │   "Why pgvector and not Pinecone?"              │
  │                                                 │
  │ WHAT THEY'RE TESTING                            │
  │   Do you understand the cost of a network hop?  │
  │   Did you think about cost at your expected     │
  │   scale, or just default to whatever you'd      │
  │   heard of? Can you compare on more than one    │
  │   axis?                                         │
  └─────────────────────────────────────────────────┘
  ```

  These callouts appear before every question
  treated in the book. They are the visual
  entry point — the reader's eye lands on the
  callout, reads the surface question, reads
  the probe, and now knows what the section
  that follows is going to teach.

  ## 3. The strong-answer / weak-answer
  side-by-side

  When the book teaches a defense, it shows
  both answers side by side: the strong answer
  the reader should aim for, and the weak
  answer most candidates default to. Same
  question, two answers, the contrast doing
  the teaching.

  Format:

  ```
  ┌─────────────────────────┬─────────────────────────┐
  │ WEAK ANSWER             │ STRONG ANSWER           │
  ├─────────────────────────┼─────────────────────────┤
  │ "I used pgvector        │ "I picked pgvector for  │
  │ because it's good for   │ operational simplicity. │
  │ this kind of thing."    │ It runs in the same     │
  │                         │ Postgres instance as my │
  │                         │ application data, so I  │
  │                         │ avoid a network hop and │
  │                         │ a separate billing      │
  │                         │ surface..."             │
  ├─────────────────────────┼─────────────────────────┤
  │ Why it's weak:          │ Why it works:           │
  │ "good for this kind of  │ Names the actual        │
  │ thing" is filler — it   │ decision criterion      │
  │ signals you don't       │ (operational            │
  │ remember why you chose  │ simplicity), gives the  │
  │ it.                     │ specific tradeoff       │
  │                         │ (network hop), shows    │
  │                         │ awareness of the cost.  │
  └─────────────────────────┴─────────────────────────┘
  ```

  The side-by-side does most of the work. The
  reader sees the failure pattern next to the
  success pattern. They internalize the
  difference visually before reading any
  surrounding prose.

  ## 4. The "I don't know" recovery box

  Every chapter has at least one boxed
  treatment of the "I don't know" recovery —
  what to say when the interviewer probes into
  territory the reader genuinely doesn't know.
  This box gets a distinct visual treatment so
  the eye finds it on re-reading.

  Format:

  ```
  ╔═══════════════════════════════════════════════╗
  ║ WHEN YOU DON'T KNOW                           ║
  ║                                               ║
  ║   They ask about something you haven't gone   ║
  ║   deep on. Like the internal mechanics of     ║
  ║   HNSW — you picked it on defaults and the    ║
  ║   numbers held up.                            ║
  ║                                               ║
  ║   Say:                                        ║
  ║   "I haven't gone deep into HNSW internals.   ║
  ║    I picked it on operational defaults and    ║
  ║    the latency numbers held up in practice.   ║
  ║    If you want to dig into it, can you        ║
  ║    start me off?"                             ║
  ║                                               ║
  ║   What this signals: confidence about what    ║
  ║   you do know, no fake confidence about       ║
  ║   what you don't, willingness to learn in     ║
  ║   real time. All three are senior signals.    ║
  ║                                               ║
  ║   Do NOT say:                                 ║
  ║   "It uses some kind of graph thing where...  ║
  ║    uh... it finds nodes that are close?"      ║
  ║   Vague hedging in territory you don't know   ║
  ║   is the surest way to fail a senior          ║
  ║   interview.                                  ║
  ╚═══════════════════════════════════════════════╝
  ```

  Note the double-line border (╔ ╗ ╚ ╝ ║) — a
  distinct visual treatment from other boxes
  in the book. The reader's eye finds these on
  re-reading because they look different.

  ## 5. The follow-up decision tree

  When an interviewer asks a question, they
  usually have 2-4 follow-ups depending on the
  answer. The book shows these as a decision
  tree, so the reader can map their answer to
  the likely next question.

  Format:

  ```
  "Why pgvector?"
        │
        ▼
  You give the operational-simplicity answer.
        │
        ├─► IF THEY ASK ABOUT COST
        │     Have numbers ready. pgvector: free
        │     beyond Postgres infra. Pinecone:
        │     starts at $70/month.
        │
        ├─► IF THEY ASK ABOUT PERFORMANCE
        │     pgvector is slower than specialized
        │     engines at billions of rows. At
        │     your data size it doesn't matter.
        │     Say so.
        │
        └─► IF THEY ASK ABOUT ALTERNATIVES
              Have one alternative you know
              well (Weaviate or Qdrant). Don't
              try to know all of them.
  ```

  This tree gives the reader a mental map of
  where the conversation can go. They're no
  longer worried about being caught off-guard
  — they've already walked the branches.

  ## 6. The pull quote

  Each chapter has 2-4 pull quotes — single
  sentences in distinct visual treatment that
  capture the chapter's key claim. These are
  the lines the reader memorizes.

  Format:

  ```
  ┃ "The senior-engineer move is to volunteer
  ┃  what you'd reconsider before being asked."
  ```

  Or:

  ```
        ▸ The strongest defense isn't denial.
          It's owning the decision and the
          cost you're paying for it.
  ```

  Pull quotes break up the flow of prose. The
  reader's eye lands on them between sections.
  They are the cards the reader pulls out of
  the book and carries into the interview.

═════════════════════════════════════════════════
THE PER-CHAPTER FILE TEMPLATE
═════════════════════════════════════════════════

Each chapter file follows the same internal
structure. The structure is sequential — the
reader reads the chapter front-to-back the first
time. On re-reading, they skim the visual
treatments (callouts, pull quotes, boxes) for
the key takeaways.

```
# Chapter N — [Chapter title]

  ## Opening hook (1-2 paragraphs)

  Direct address to the reader. What this
  chapter is about, why it matters, what they'll
  walk away knowing. The coach voice.

  No interview-prep platitudes ("the
  architecture question is one of the most
  important questions you'll be asked").
  Concrete: "In the first ten minutes of every
  senior interview, someone will ask you to
  walk through what you built. This chapter is
  about doing that in ninety seconds without
  rambling."

  ## The chapter-opening diagram

  The large visual anchor for the chapter.
  15-30 lines of ASCII. Labeled, layered,
  drawn so the reader who only studied this
  diagram would remember the chapter's spine.

  Wrapped in one sentence of prose before and
  one after — diagrams never stand alone.

  ## The body — questions and defenses

  The chapter's main content. A sequence of
  questions an interviewer would ask in this
  chapter's territory, each treated with:

    1. The "what they're really asking" callout
    2. The strong-answer prose (in the reader's
       voice, anchored to real code)
    3. The strong-answer / weak-answer
       side-by-side (where the failure mode is
       distinctive enough to teach against)
    4. The follow-up decision tree (showing 2-4
       likely follow-ups and what to say to
       each)
    5. At least one pull quote per chapter

  The number of questions per chapter varies
  by chapter type. Chapter 2 (architecture) has
  1-2 big questions. Chapter 3 (choices) has
  one per load-bearing technology choice.
  Chapter 6 (hard parts) has 3-5 reflection
  prompts.

  ## At least one "I don't know" recovery box

  Every chapter has at least one boxed
  treatment of the "I don't know" recovery —
  pinned to the specific question in that
  chapter where the reader is most likely to
  get pushed past their depth.

  ## The "what you'd change" treatment

  Every chapter closes with a one-paragraph
  treatment of what the reader would
  reconsider in the territory of that chapter.
  Even Chapter 2 (architecture) — what would
  you redo if starting today? This isn't
  padding; it's the senior-engineer habit of
  always being able to name what you'd
  reconsider.

  ## The one-page summary

  The night-before re-read material. One page,
  tight, with:

    - The chapter's core claim in one sentence
    - The 3-5 questions covered, with one-line
      answers
    - The chapter's pull quote(s)
    - The "what you'd change" sentence

  This summary is what the reader skims twelve
  hours before the interview. It is the
  chapter's compressed form.
```

═════════════════════════════════════════════════
THE 00-OVERVIEW.MD FILE
═════════════════════════════════════════════════

The overview is the book's table of contents
and reading guide. It serves three purposes:

  1. **Map the book.** Show all 8 chapters with
     one-line descriptions and the questions
     each covers.
  2. **Suggest a reading order.** First read:
     chapters in order, one per sitting.
     Review: skim the chapter summaries and
     pull quotes. Night-before: read only the
     one-page summary at the end of each
     chapter.
  3. **Connect to the rest of the study
     system.** This book is the project-level
     defense. The concept-level Interview
     defense blocks live inside each concept
     file under `.aipe/study-system-design-dsa/`
     and `.aipe/study-ai-engineering/`. The
     two are complementary — concept files
     prepare the deep dive; this book prepares
     the wide opener.

The overview also contains the master diagram —
the system at a glance — that recurs across
chapters. The reader returns to the overview
when they need to re-anchor.

═════════════════════════════════════════════════
HOW THE WORKFLOW RUNS
═════════════════════════════════════════════════

This spec drives a **separate workflow** from
the base study guide generator and the other
topic specs. Running the base generator with
`study-system-design-dsa.md` does not include this spec. To
produce the interview defense book for a repo,
run this spec's command from inside that repo.

The four workflows share `format.md` as their
structural foundation but are triggered
independently:

  → `study-system-design-dsa.md`                     → `.aipe/study-system-design-dsa/`
  → `study-ai-engineering.md`      → `.aipe/study-ai-engineering/`
  → `study-prompt-engineering.md`  → `.aipe/study-prompt-engineering/`
  → `study-interview-defense.md`   → `.aipe/study-interview-defense/`

Each produces its own folder inside the repo's
`.aipe/` directory.

The agent run for interview defense study works
like this:

  1. Agent reads `format.md` to learn the
     formatting rules, diagram quality
     standards, the "use real software, not
     analogies" rule, the no-hedging rule, and
     the hard rules.

  2. Agent reads `teacher.md` to learn the
     base writer persona — the staff engineer
     voice, the format hierarchy, the bans.
     Then reads this spec's persona section to
     learn the coach-posture shift specific to
     interview defense.

  3. Agent reads `me.md` to learn reader-side
     calibration: who the reader is
     professionally, what voice the strong
     answers should embody, what defenses the
     reader can credibly make from her actual
     portfolios (DSA + system design), and what
     gaps she should defer on rather than fake.
     `me.md` does not override the structural
     rules from `format.md` or this spec, and
     does not override `teacher.md`'s voice
     rules — it calibrates examples, depth, and
     what's defensible.

  4. Agent reads this spec to learn the book
     shape (8 chapters), the visual conventions
     (the six required treatments), and the
     per-chapter template.

  5. Agent reads the codebase context of the
     repo where the command was run. This spec
     runs against one codebase at a time.

  6. Agent identifies, for each chapter, the
     content that's specific to this codebase:
     the project's pitch, the architecture, the
     load-bearing choices, the realistic scale
     bottlenecks, the failure surfaces, etc.
     Cross-references against `me.md`'s
     portfolios to make sure the defenses
     anchor to things the reader has actually
     shipped.

  7. Agent generates the book — 9 files
     (00-overview.md plus 8 chapter files) in
     `.aipe/study-interview-defense/`, written
     in the staff engineer's coach voice
     (`teacher.md` in coach posture) and
     calibrated to the reader (`me.md`).

═════════════════════════════════════════════════
RELATIONSHIP TO THE EXISTING INTERVIEW DEFENSE BLOCK
═════════════════════════════════════════════════

`format.md`'s per-concept-file template already
includes an "Interview defense" block scoped to
*one concept*. That block stays exactly where
it is — this spec does not modify it. The two
defenses are complementary:

  → The **per-concept Interview defense block**
    (inside concept files in
    `.aipe/study-system-design-dsa/` and
    `.aipe/study-ai-engineering/`) defends
    *one decision* in depth, for the moment
    the interviewer drills into a specific
    pattern like provider abstraction or
    composite primary keys.

  → The **project-level Interview defense
    book** (this spec, in
    `.aipe/study-interview-defense/`) defends
    *the whole project* — the architecture,
    the tech stack, the scale story, the
    counterfactuals — for the moment the
    interviewer asks about the app at the
    project level.

The reader uses both. The concept files prepare
for the deep dive. The book prepares for the
wide opener.

═════════════════════════════════════════════════
WHAT THIS SPEC DOES NOT REDEFINE
═════════════════════════════════════════════════

Inherited from `format.md` without restatement:

  → All formatting rules (kebab-case
    file names, no Mermaid / no images,
    box-drawing diagram chars)
  → The "Use real software, not analogies"
    rule (frontend primitives first, whole
    products last)
  → The hard rules at the bottom of `format.md`

Inherited from `teacher.md` without restatement
(this spec uses the coach posture variation —
same engineer, different stance):

  → The writer persona (staff engineer, 12
    years, FAANG → Series B)
  → The teaching philosophy, here in coach
    framing rather than teacher framing
  → The format hierarchy (diagrams primary,
    prose fills in, pseudocode for logic,
    real code only when syntax matters)
  → What's banned: hedging, marketing language,
    apologetic tradeoff naming, slow on-ramps,
    physical-world analogies as primary anchor

Inherited from `me.md` without restatement:

  → Reader voice and format calibration (the
    "HOW TO WRITE FOR YOU" section) — applies
    to all strong-answer prose, all coach-voice
    chapter prose, all pull quotes
  → Reader DSA and system design portfolios —
    used to ground every defense, every code
    walkthrough, every counterfactual
  → Reader cognitive shape (visual-first,
    ideas-then-details) — shapes how chapter
    openings land, where diagrams go, how
    follow-up trees branch
  → Honest gap inventory — shapes which
    territories get "I don't know" recovery
    boxes vs which territories get full
    strong-answer treatment

The constraints below are specific to this
spec.

═════════════════════════════════════════════════
CONSTRAINTS — INTERVIEW DEFENSE BOOK SPECIFIC
═════════════════════════════════════════════════

```
→ Every chapter file is one continuous
   narrative, not a reference grid. The reader
   reads it front-to-back the first time.
   Block headings are used internally (Opening
   hook, Body, Summary) but the prose flows
   between them. Do not produce a grid of
   identically-named blocks like a concept
   file would have.

→ Every chapter opens with one large diagram
   (15-30 lines of ASCII) — the chapter's
   visual anchor. The opening diagram is
   distinct from the per-question diagrams
   inside the chapter body. Wrapped in prose:
   one sentence before, one after.

→ Every question treated in the book is
   introduced by a "WHAT THEY'RE REALLY
   ASKING" callout box (single-line border,
   ┌ ┐ └ ┘ ─ │). No question appears in the
   book without this callout. The callout
   names the underlying probe, not just the
   surface form.

→ Every chapter contains at least one
   strong-answer / weak-answer side-by-side
   table (two columns, the contrast as the
   teaching mechanism). When a failure pattern
   is distinctive enough to be worth teaching
   against, use the side-by-side.

→ Every chapter contains at least one "I
   don't know" recovery box (double-line
   border, ╔ ╗ ╚ ╝ ═ ║). This visual treatment
   is distinct from other callouts so the eye
   finds it on re-reading.

→ Every chapter contains at least one
   follow-up decision tree showing the 2-4
   most likely follow-up questions and what
   to say to each. Drawn as a branching ASCII
   tree.

→ Every chapter contains 2-4 pull quotes.
   Pull quotes are single sentences in
   distinct visual treatment (heavy vertical
   bar ┃ prefix, or indented ▸ marker). They
   are the lines the reader memorizes.

→ Every chapter closes with a one-page
   summary suitable for night-before review:
   the chapter's core claim, the questions
   covered with one-line answers, the pull
   quotes, and the "what you'd change"
   sentence.

→ All "strong answer" prose throughout the
   book is written in the reader's voice
   (first person, present tense, directly
   speakable). Third-person prose ("the
   developer chose...") is banned in
   strong-answer blocks.

→ All claims grounded in the codebase must be
   verifiable. Library versions, file paths,
   function names must match what's in the
   repo. If a defense requires a claim the
   agent can't verify, the question is wrong
   for this codebase — drop it rather than
   fabricate.

→ The book has exactly 8 chapters
   (00-overview plus 01-08). Do not add
   chapters. Do not collapse chapters. The
   chapter list is the contract.

→ Chapter 8 (the AI question) is always
   generated, regardless of whether AI
   assistance is detectable in the codebase.
   The 2026 baseline is that the reader used
   AI tools heavily. If they didn't, the
   chapter teaches them how to say so without
   sounding defensive.

→ Banned marketing language across the
   entire book: "scalable solution," "robust
   architecture," "leveraging modern best
   practices," "cutting-edge," "best-in-class,"
   "state-of-the-art," "industry-leading,"
   "enterprise-grade." These collapse on
   contact with a real interviewer.

→ Coach voice throughout: address the reader
   as "you." The book is a conversation
   between the staff-engineer persona and the
   candidate. Not a third-person narration of
   what to do.

→ Where AI assistance shaped a decision in
   the codebase, the book teaches the reader
   to own that honestly — not to hide it.
   This applies in every chapter, not just
   chapter 8. Strong defenses distinguish
   three modes of decision-making: deliberate
   (reader's choice), evaluated-and-accepted
   (AI suggested, reader evaluated and
   accepted), and defaulted-to (AI's default,
   reader didn't deeply evaluate). The third
   mode is the riskiest to own and the most
   senior-signal-positive when owned well.
```
