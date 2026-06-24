─────────────────────────────────────────────────
REHEARSE — HACKATHON DEMO SPEC
─────────────────────────────────────────────────

A per-codebase study spec for **presenting a project as
a hackathon demo** in a time-boxed slot of up to ten
minutes. Inherits formatting rules, diagram
requirements, the no-analogy rule, the no-hedging rule,
and hard rules from `format.md`. What this spec defines
is what's *unique* to a hackathon demo as a thing to
prepare:

  → A book-style sequential structure (an overview plus
    six chapters, read in order) rather than the
    reference-grid shape of the per-concept template in
    `format.md`. The chapters are the run-of-show — you
    read them front-to-back and they *are* the script.
  → A hard **time budget** as the organizing motif. The
    whole book is built around a ten-minute (or shorter)
    ceiling; every chapter owns a slice of the clock and
    a "tighten it" cut for when you're running long.
  → A **live demo** as the centerpiece, not a Q&A
    defense. The demo chapter gets the largest budget
    and a choreographed click-path with a designated
    "money shot."
  → The **coach posture** of the persona — same engineer
    as the default, shifted to a demo coach who has
    watched a hundred hackathon demos win and lose.
  → A **demo-failure recovery** treatment — every
    on-screen beat has a backup for when the wifi dies
    or the build crashes on stage.

This spec is run alongside `study-system-design.md`
and the other study generators (its sibling specs), not
instead of them. The agent reads `format.md` for *how*
to write (block-quality standards, diagrams, the "use
real software, not analogies" rule, the no-hedging
rule), and this spec for *what* to write, in what order,
in what shape.

**Scope: per-codebase, per-repo.** This spec runs
against one codebase at a time, exactly like the base
study generator. When the command is run inside a repo,
the agent analyzes that repo's code and produces a demo
book for *that* project. It demos only what the codebase
actually does — see the no-vaporware constraint below.

═════════════════════════════════════════════════
THE RELATIONSHIP TO THE STUDY FAMILY
═════════════════════════════════════════════════

This is a third performance-oriented sibling alongside
the interview defense book. The family now has three
distinct ways of turning a codebase into spoken
performance:

```
study-system-design.md     Helps you UNDERSTAND the work
  (+ the topic generators)       (comprehension, one file per pattern)

rehearse-interview-defense.md     Helps you DEFEND the work
                                 (a hiring interviewer probes; you hold ground)

rehearse-hackathon-demo.md        Helps you SHOW the work
  (this spec)                    (a room watches a clock; you land the wow)
```

The interview defense book prepares you for an
interviewer drilling into *why you built it this way*.
This book prepares you for judges and a crowd watching
*what it does* in a ten-minute window. Different room,
different clock, different goal:

  → **Interview defense** optimizes for surviving
    follow-ups under one-on-one pressure. Depth wins.
  → **This book** optimizes for landing impact in a
    fixed slot in front of a room. Pace and the demo win.

A reader can use both for the same project: the demo
book to present it, the defense book to answer the
"how does it actually work" questions that come after.

═════════════════════════════════════════════════
THE PERSONA — references `teacher.md` in coach posture
═════════════════════════════════════════════════

The underlying engineer is defined in `teacher.md` — the
staff engineer with 12 years of industry experience.
Read that file for the full background, voice rules,
format hierarchy, and what's banned. Do not restate.

This spec uses the **coach posture** described in
`teacher.md`'s "THE POSTURE" section — same engineer,
different stance — with a demo-specific framing layered
on top, the same way the interview defense spec layers
its interview framing on coach posture.

The demo-coach framing:

  → **You have watched a hundred hackathon demos win and
     lose.** You know the demo that buries the wow in
     minute eight, the demo that spends three minutes on
     a login screen, the demo that crashes and the
     presenter freezes, and the demo that opens cold with
     the money shot and never lets the room look away.
     You write with that pattern-recognition explicit.

  → **You optimize for the clock and the room, not for
     completeness.** A demo is not a tour of every
     feature. It is the shortest path to making a room
     care. "Cut this beat" is advice you give freely.

  → **More direct, more opinionated.** "Don't open with
     the problem slide; open with the thing working"
     replaces "consider how to introduce it." The reader
     needs choreography, not options.

What stays the same: everything in `teacher.md` — the
persona, the format hierarchy (diagrams primary, prose
fills in), the bans (hedging, marketing language), the
direct/opinionated/specific voice. Coach posture is a
*shift*, not a replacement.

  ## The hackathon reality you write into

  The reader built this in a hackathon window — days,
  maybe a weekend. The build is real but rough: hardcoded
  edges, a half-finished settings screen, a feature that
  only works on the happy path. The demo coach does not
  pretend otherwise. The job is to choreograph the ten
  minutes so the room sees the strongest true thing the
  codebase does, and to own the rough edges with the
  confidence of someone who shipped under a clock rather
  than hiding them.

═════════════════════════════════════════════════
THE TIME DISCIPLINE — the organizing constraint
═════════════════════════════════════════════════

Everything in this book serves a hard ceiling: **up to
ten minutes, and not one second over.** Going long is the
single most common way a hackathon demo loses — the buzzer
cuts you off before the close, or the judges stop
listening at minute eleven.

The book assigns every chapter a **time budget**, and the
budgets sum to the slot with a buffer left over. The
default split for a ten-minute slot:

```
  THE TEN-MINUTE RUN-OF-SHOW (default budget)

  0:00 ┌─────────────────────────────────────────────┐
       │ 01  COLD OPEN + ONE-LINER          0:00–1:00 │  1:00
  1:00 ├─────────────────────────────────────────────┤
       │ 02  THE DEMO (centerpiece)         1:00–6:00 │  5:00
       │       the money shot lands by 3:00            │
  6:00 ├─────────────────────────────────────────────┤
       │ 03  UNDER THE HOOD                 6:00–8:00 │  2:00
  8:00 ├─────────────────────────────────────────────┤
       │ 04  THE BUILD STORY                8:00–8:45 │  0:45
  8:45 ├─────────────────────────────────────────────┤
       │ 05  THE CLOSE + THE ASK            8:45–9:30 │  0:45
  9:30 ├─────────────────────────────────────────────┤
       │     buffer / breathing room        9:30–10:00 │  0:30
 10:00 └─────────────────────────────────────────────┘

       06  THE Q&A  ← prep only; runs after the clock,
                       does not eat the ten minutes
```

Two rules govern the budget:

  → **Scale it to the real slot.** Many hackathons give
    three to five minutes, not ten. The agent scales every
    budget proportionally to the actual slot named by the
    reader (default ten if unspecified) — but the demo
    always keeps the largest share, and the money shot
    always lands inside the first third.

  → **The demo has a floor; everything else has a ceiling.**
    When the budget is tight, cut from under-the-hood,
    build story, and close first. Never cut the demo below
    the point where the room sees the thing actually work.

═════════════════════════════════════════════════
THE BOOK SHAPE — AN OVERVIEW PLUS SIX CHAPTERS
═════════════════════════════════════════════════

The output is a book generated as six chapter files plus
an overview, all in the output folder. Order matches the
order you present in. The reader reads through once to
rehearse, then holds the one-page run sheets while
presenting.

```
.aipe/rehearse-hackathon-demo/
  00-overview.md             ← the run-of-show: the whole slot on one timeline
  01-the-cold-open.md        ← first 60 seconds: hook + the one-liner
  02-the-demo.md             ← the live walkthrough, the centerpiece, the money shot
  03-under-the-hood.md       ← the one impressive technical thing, kept demo-shallow
  04-the-build-story.md      ← what you actually shipped + the hard part you cracked
  05-the-close.md            ← the vision, the ask, the last line they remember
  06-the-qa.md               ← judge questions + crisp answers (prep, post-clock)
```

Each chapter file is one continuous narrative — not a
reference grid of blocks. Chapters open with a hook and
their time budget, walk the beats in presentation order,
and close with a one-page run sheet the reader holds
while on stage.

  ## What each chapter covers

  **01 — The cold open**
  The first sixty seconds, where the room decides whether
  to pay attention. Two beats: the **hook** (open on the
  thing working or the problem that stings, never on a
  title slide or a self-introduction) and the **one-liner**
  ("X is a Y that does Z for W"). This chapter teaches the
  discipline of starting in motion. The most common failure
  it trains against: spending the first ninety seconds on
  setup the room doesn't need yet.

  **02 — The demo**
  The centerpiece, and the chapter that gets the most
  budget. A choreographed click-path through the running
  app, anchored to what the codebase actually does: the
  exact sequence of screens, what to say at each step
  (value, not narration), and the designated **money shot**
  — the single moment the room goes "oh." The money shot is
  named explicitly and scheduled inside the first third of
  the slot. Includes the demo-failure recovery: the backup
  for when the live build won't cooperate.

  **03 — Under the hood**
  The one technical thing worth showing, kept demo-shallow.
  Not an architecture tour — the single most impressive or
  non-obvious mechanism in the codebase (the real-time sync,
  the on-device model, the agent loop), drawn as one diagram
  and explained in the time it takes to say three sentences.
  This chapter teaches the reader to go exactly one level
  deep and stop — enough to earn credibility, not enough to
  lose the room.

  **04 — The build story**
  Proof it's real, not a mockup. What actually got shipped
  in the hackathon window, and the one hard part that got
  cracked. Anchored to the codebase: real features, real
  commits, the genuine obstacle and how it was solved. This
  is the chapter that separates a working build from a pitch
  deck. Owns the rough edges honestly rather than hiding
  them.

  **05 — The close**
  The vision, the ask, and the last line. Where it goes next
  (clearly framed as future, never demoed as if it exists),
  what you want from the room (a vote, feedback, a
  conversation), and the one sentence you want them
  repeating to each other afterward. This chapter teaches
  ending on a beat, not trailing off into "yeah, so, that's
  it."

  **06 — The Q&A**
  Prep for the questions judges always ask, handled after
  the timed slot so it never eats the clock. The standard
  probes: "Is this actually working?" "What was the hard
  part?" "What's the stack?" "Did you build this during the
  hackathon?" "Is there a business here / what's next?" Each
  gets a crisp, honest, speakable answer anchored to the
  codebase, plus a decision tree for the likely follow-ups.

═════════════════════════════════════════════════
THE BOOK-STYLE TREATMENT — visual conventions
═════════════════════════════════════════════════

Like the interview defense book, this spec uses a book
shape — narrative prose flowing through visual aids,
optimized for sequential reading and for glancing at while
presenting. A reader who skims only the visual treatments
(the timeline bars, the click-path diagrams, the script
lines, the if-it-breaks boxes) gets most of what they need
to run the demo.

Six visual treatments are required throughout the book:

  ## 1. The time-budget bar

  Every chapter opens with its slice of the slot drawn as a
  timeline bar — where this beat sits in the ten minutes and
  how long it owns. This is the book's defining motif. The
  reader always knows where they are against the clock.

```
  ┌──────────────────────────────────────────────────────┐
  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
  │ 1:00 ────────────── 6:00 ─────────────────────── 10:00 │
  │        THE DEMO — you own 1:00 to 6:00 (5 min)         │
  └──────────────────────────────────────────────────────┘
```

  ## 2. The chapter-opening diagram

  The large visual anchor for the chapter, 15–30 lines of
  ASCII. For the demo chapter it is the click-path / screen
  flow; for under-the-hood it is the one architecture
  diagram; for the cold open it is the room's attention
  curve. Wrapped in one sentence of prose before and one
  after — diagrams never stand alone.

  ## 3. The SAY / SHOW treatment

  The demo and cold-open beats are choreographed as a
  two-track table: what is **on screen** (SHOW) beside what
  comes **out of your mouth** (SAY). The two tracks are
  deliberately separated because the most common demo
  failure is narrating the clicks ("now I'm clicking here")
  instead of speaking value while the hands do the clicking.

```
  SHOW (on screen)              SAY (out loud)
  ──────────────────────        ──────────────────────────
  the empty dashboard           "here's a fresh workspace —
                                 watch what happens when I…"
  paste a messy paragraph       "…drop in raw notes…"
  the structured result         "…and it's already sorted."  ← money shot
```

  ## 4. The script line (pull quote)

  The exact sentences to say, in distinct visual treatment
  (heavy vertical bar ┃ prefix). These are the lines the
  reader says close to verbatim — the one-liner, the
  money-shot line, the closing line. Two to four per
  chapter. Written in the reader's voice (see `me.md`),
  first person, present tense, directly speakable.

```
  ┃ "It turns a wall of notes into a plan in one paste."
```

  ## 5. The IF-IT-BREAKS recovery box

  Every chapter with an on-screen beat carries at least one
  recovery box (double-line border ╔ ╗ ╚ ╝ ═ ║), distinct
  from other callouts so the eye finds it fast under stress.
  It names the backup: the recorded clip, the screenshots,
  or the line you say while you narrate the flow from memory.
  The rule it trains: never freeze, never apologize twice,
  keep moving.

```
  ╔══════════════════════════════════════════════════════╗
  ║ IF IT BREAKS                                           ║
  ║ The live result won't load → switch to the 20-second  ║
  ║ recorded clip (slide 2). Say: "let me show you the    ║
  ║ result from a run earlier" and keep the energy up.     ║
  ╚══════════════════════════════════════════════════════╝
```

  ## 6. The strong-vs-weak demo move (side-by-side)

  Where a demo failure mode is distinctive enough to teach
  against, a two-column side-by-side: the weak move beside
  the strong one. The contrast is the teaching mechanism
  ("weak: explain the architecture first / strong: show it
  working, explain only if asked").

═════════════════════════════════════════════════
THE PER-CHAPTER FILE TEMPLATE
═════════════════════════════════════════════════

Each chapter file follows the same internal structure.
Sequential — read front-to-back to rehearse, skimmed by
its visual treatments while presenting.

```
# Chapter N — [Chapter title]   ([start]–[end], [duration])

  ## Opening hook (1-2 paragraphs)

  Direct address to the reader, coach voice. What this beat
  is for, where it sits in the run-of-show, what it has to
  accomplish before the clock moves on. Concrete, not
  platitudes: not "the demo is the most important part of
  your presentation" but "you have five minutes and the room
  decides in the first ninety seconds whether this is real."

  ## The time-budget bar

  This chapter's slice of the slot (visual treatment #1).
  One sentence naming what has to be done inside it.

  ## The chapter-opening diagram

  The large visual anchor (visual treatment #2) — click-path,
  architecture, or attention curve. 15–30 lines, wrapped in
  prose before and after.

  ## The body — the beats in order

  The chapter's main content, walked in presentation order.
  Depending on the chapter:
    - SAY / SHOW tables for on-screen beats (treatment #3)
    - script lines / pull quotes for the verbatim lines
      (treatment #4)
    - strong-vs-weak side-by-sides where a failure mode is
      worth teaching against (treatment #6)
    - for the demo and cold-open chapters, the designated
      money shot is named and its timing fixed

  ## The IF-IT-BREAKS box (chapters with an on-screen beat)

  At least one recovery box (treatment #5), pinned to the
  beat most likely to fail live.

  ## The "tighten it" treatment

  Every chapter names how to cut itself when you're running
  long — the single line or beat to drop, and the floor below
  which you must not cut. This is the demo analog of the
  time discipline: every beat knows how to compress.

  ## The one-page run sheet

  The glance-while-presenting card. One page, tight:
    - this beat's time budget and its money-shot timing (if any)
    - the SAY lines in order, as bullet prompts
    - the one script line to nail
    - the IF-IT-BREAKS backup in one line
    - the "tighten it" cut in one line

  This run sheet is what the reader actually holds on stage.
```

═════════════════════════════════════════════════
THE 00-OVERVIEW.MD FILE
═════════════════════════════════════════════════

The overview is the book's run-of-show and reading guide.
It serves three purposes:

  1. **Show the whole slot on one timeline.** The full
     ten-minute (or scaled) run-of-show as a single timeline
     diagram — every chapter, its budget, and the money-shot
     marker — so the reader can see the shape of the
     presentation at a glance.
  2. **Suggest a rehearsal order.** First pass: read the
     chapters in order and run the demo once end-to-end with
     a timer. Second pass: run it again holding only the
     one-page run sheets. Night-before / morning-of: read
     only the run sheets and time the money shot.
  3. **Connect to the rest of the study system.** This book
     presents the project; the interview defense book in
     `.aipe/rehearse-interview-defense/` answers the "how does
     it actually work" questions that come after; the
     concept files prepare the deepest follow-ups.

The overview also carries the **master demo diagram** — the
one-screen picture of what the app does — which recurs in
the demo chapter. The reader returns to the overview to
re-anchor on the run-of-show.

═════════════════════════════════════════════════
HOW THE WORKFLOW RUNS
═════════════════════════════════════════════════

This spec can run standalone (run its command from inside a
repo to produce just the demo book) or as part of the
`/aipe:rehearse` orchestrator, which composes both rehearse
books — interview defense and hackathon demo — in one pass. It
is not part of the `/aipe:study` orchestrator; that one runs the
comprehension guides.

The agent run for a hackathon demo book works like this:

  1. Agent reads `format.md` to learn the formatting rules,
     diagram quality standards, the "use real software, not
     analogies" rule, the no-hedging rule, and the hard
     rules.

  2. Agent reads `teacher.md` for the base writer persona —
     the staff engineer voice, the format hierarchy, the
     bans. Then reads this spec's persona section for the
     demo-coach posture shift.

  3. Agent reads `me.md` for reader-side calibration: who the
     reader is, what voice the spoken script lines should
     embody (first person, present tense, speakable), and
     what the reader can credibly claim from her actual
     portfolios. `me.md` calibrates examples and voice; it
     does not override `format.md`'s structure or
     `teacher.md`'s voice rules.

  4. Agent reads this spec for the book shape (overview plus
     six chapters), the time discipline, the six visual
     treatments, and the per-chapter template.

  5. Agent asks for (or infers) the **slot length** — the
     real number of minutes, default ten — and scales every
     time budget to it, keeping the demo's share largest and
     the money shot inside the first third.

  6. Agent reads the codebase context of the repo where the
     command was run, and identifies, per chapter, the
     content specific to this codebase: the demoable
     happy-path features, the one impressive mechanism, what
     actually shipped, the genuine hard part. It demos only
     what the code actually does (see the no-vaporware
     constraint).

  7. Agent generates the book — 7 files (00-overview.md plus
     six chapter files) in `.aipe/rehearse-hackathon-demo/`,
     written in the staff engineer's demo-coach voice
     (`teacher.md` in coach posture) and calibrated to the
     reader (`me.md`).

═════════════════════════════════════════════════
CHECK FOR EXISTING GUIDE — create vs update
═════════════════════════════════════════════════

Before generating, check whether
`.aipe/rehearse-hackathon-demo/` already exists, the same
per-folder check the other generators use.

  → **Missing → CREATE.** Generate the full book from
    scratch per this spec.
  → **Exists → UPDATE.** Reconcile against the current
    codebase: re-derive the demoable features, the money
    shot, and the build story from the code as it is now;
    edit only the beats whose underlying feature changed;
    leave timing and choreography intact where the feature
    still works. Do not regenerate unchanged chapters.

═════════════════════════════════════════════════
WHAT THIS SPEC DOES NOT REDEFINE
═════════════════════════════════════════════════

Inherited from `format.md` without restatement:

  → All formatting rules (kebab-case file names, no Mermaid /
    no images, box-drawing diagram chars)
  → The "Use real software, not analogies" rule (frontend
    primitives first, whole products last)
  → The hard rules at the bottom of `format.md`

Inherited from `teacher.md` without restatement (this spec
uses the coach posture variation — same engineer, different
stance):

  → The writer persona (staff engineer, 12 years, FAANG →
    Series B)
  → The teaching philosophy, here in demo-coach framing
  → The format hierarchy (diagrams primary, prose fills in,
    pseudocode for logic, real code only when syntax matters)
  → What's banned: hedging, marketing language, apologetic
    tradeoff naming, slow on-ramps, physical-world analogies
    as primary anchor

Inherited from `me.md` without restatement:

  → Reader voice and format calibration — applies to all
    spoken script lines, all coach-voice chapter prose, all
    pull quotes
  → Reader portfolios — used to ground the build story, the
    under-the-hood mechanism, and the Q&A answers in what the
    reader has actually shipped
  → Reader cognitive shape (visual-first, ideas-then-details)
    — shapes where diagrams go and how beats are ordered

The constraints below are specific to this spec.

═════════════════════════════════════════════════
CONSTRAINTS — HACKATHON DEMO BOOK SPECIFIC
═════════════════════════════════════════════════

```
→ The slot ceiling is hard. Every chapter carries a time
   budget; the budgets sum to the slot with a buffer left
   over. The book never plans to use the full slot to the
   second — it plans to finish early with breathing room.

→ The demo is the centerpiece and gets the largest budget.
   The money shot — the single moment the room reacts — is
   named explicitly and scheduled inside the first third of
   the slot. Never bury it past the halfway mark.

→ Every chapter opens with its time-budget bar. The reader
   always knows where they are against the clock.

→ Every on-screen beat is choreographed as a SAY / SHOW
   pair. Narrating the clicks ("now I click here") is the
   failure mode the SAY track exists to prevent — the SAY
   track speaks value while the hands do the clicking.

→ Every chapter with an on-screen beat has at least one
   IF-IT-BREAKS recovery box. A demo with no backup plan is
   off-spec. The backup is concrete: a recorded clip,
   screenshots, or the exact line to say while narrating from
   memory.

→ Every chapter names its "tighten it" cut — the beat to
   drop when running long, and the floor it must not cut
   below. The demo's floor is "the room sees it work."

→ No vaporware. The book demos only what the codebase
   actually does on a path that actually runs. Features that
   don't work, or don't exist yet, go in the close as
   clearly-framed "what's next" — never shown as if they
   exist. If a planned money shot depends on a feature that
   isn't built, the agent picks a different money shot from
   what is built.

→ Own the rough edges, don't hide them. Hackathon builds are
   rough; the build-story and Q&A chapters teach the reader
   to name the rough edges with the confidence of someone who
   shipped under a clock — not to pretend the build is
   production-grade.

→ All spoken script lines are written in the reader's voice
   (first person, present tense, directly speakable).
   Third-person prose ("the developer then shows…") is banned
   in SAY tracks and script lines.

→ All claims grounded in the codebase must be verifiable.
   Features, stack, file references in the under-the-hood and
   build-story chapters must match what's in the repo. If a
   beat requires a claim the agent can't verify, drop the
   beat rather than fabricate.

→ The book has exactly an overview plus six chapters
   (00-overview plus 01-06). Do not add chapters. Do not
   collapse chapters. The chapter list is the contract.

→ The Q&A chapter (06) is prep only — it runs after the
   timed slot and never counts against the budget. It is
   always generated.

→ Banned marketing language across the whole book:
   "scalable solution," "robust architecture," "leveraging,"
   "cutting-edge," "best-in-class," "state-of-the-art,"
   "industry-leading," "revolutionary," "game-changing,"
   "seamless." These collapse on contact with a real room.

→ Demo-coach voice throughout: address the reader as "you."
   The book is a conversation between the staff-engineer
   persona and the presenter, not a third-person narration of
   what to do.

→ Where AI assistance shaped the build, the Q&A chapter
   teaches the reader to own it honestly — matter-of-fact
   about what the tools did and what the reader did. Judges
   in 2026 assume heavy AI use; defensiveness reads worse
   than candor.
```
