# Read — A Philosophy of Software Design (book-style guide)
## the `/aipe:read-aposd` command

One command that generates an original, **book-style** study guide to the
design *primitives* in John Ousterhout's *A Philosophy of Software Design*
— taught in this family's voice, with original examples, anchored to your
own code where a repo is present. It is a guided read of the ideas, not a
copy of the book.

This is a generator. Like the `study-*` specs it reads `teacher.md` (voice)
and `me.md` (reader), and it borrows the teaching primitives from
`format.md` (diagrams-first, zoom out, the structure pass, claim →
consequence, verdict-first). But a book is not a codebase, so it defines
its **own** chapter template below rather than the per-concept-file
template — the same way the `rehearse-*` books define their own chapter
shape while inheriting the persona.

```
HOW TO RUN

  drop this file where your /aipe: commands resolve, then:

    /aipe:read-aposd                 → create or update the guide
    /aipe:read-aposd --part II       → only (re)generate one Part
    /aipe:read-aposd --anchor ./repo → anchor "In your code" to a repo

  output lands in  .aipe/read-aposd/  as a numbered book.
```

═════════════════════════════════════════════════
WHAT THIS IS — AND IS NOT
═════════════════════════════════════════════════

  → IS: an original, chaptered guide that teaches the book's
    concepts the way a senior colleague would — diagrams,
    your-code examples, the red flag to watch for each idea.
  → IS: a companion you read alongside (or before) the book to
    make the primitives stick.
  → IS NOT: a reproduction, a chapter-by-chapter transcript, or
    a substitute for the book. It paraphrases ideas; it never
    reprints the author's words.

═════════════════════════════════════════════════
COPYRIGHT — HARD RULE (non-negotiable)
═════════════════════════════════════════════════

The book is copyrighted. This guide teaches the *ideas* (not
protected) in entirely original *expression* (the protected part
stays the author's).

  → NEVER reproduce the book's prose. No passage dumps, no
    chapter text, no figure redraws-as-copies.
  → NEVER quote more than a short phrase, and only when the exact
    wording is a defined term (e.g. the name of a red flag). Keep
    any quote under ~15 words; default to paraphrase.
  → Explain every concept in your own words with your own
    examples. If you cannot explain an idea without quoting it,
    you do not understand it yet — go understand it.
  → Every Part's README states plainly: this guide supplements
    the book, it does not replace it. Point the reader to buy or
    borrow it (it is also free to read on the author's site).
  → Enumerating the topics/chapter order is fine — that's a fact
    about the book, not its expression.

═════════════════════════════════════════════════
WHO WRITES / WHO READS
═════════════════════════════════════════════════

  → Voice: `teacher.md`, teacher posture. The staff-engineer
    persona is a near-perfect fit — this book is general software
    design, exactly that engineer's home turf. Inherit the banned
    list (no hedging, no marketing language, no slow on-ramps, no
    physical-world analogy as the primary anchor) and the
    verdict-first / rank-what-matters trait.
  → Reader: `me.md`. Calibrate depth, examples, and what's already
    known to the reader. Bridge from what they know (frontend,
    DSA, the agent/pipeline work) into each primitive.
  → Structure primitives: `format.md`. Reuse zoom-out, the
    structure pass (layers · axes · seams), diagrams-as-primary,
    claim → consequence. Do NOT reuse the codebase-anchored blocks
    (no "Implementation in codebase"); this spec replaces them
    with "In your code" below.

═════════════════════════════════════════════════
THE THROUGH-LINE — the one idea the whole book serves
═════════════════════════════════════════════════

Every chapter is in service of a single claim. State it in the
front matter and thread it through every chapter:

```
  COMPLEXITY is the enemy.   (the cost that compounds over a
                              codebase's life)

  it shows up as ────────────────────────────────────────────
     change amplification   one change touches many places
     cognitive load         how much you must hold in your head
     unknown unknowns        you can't tell what a change will break

  it is caused by ───────────────────────────────────────────
     dependencies           code that can't be understood alone
     obscurity              important info that isn't obvious

  the weapon ────────────────────────────────────────────────
     DEEP MODULES with simple interfaces
     + hide design decisions
     + pull complexity down, away from users
```

Whenever a chapter introduces a technique, close the loop back to
this: *which symptom does it reduce, by removing which cause?* A
technique that doesn't reduce complexity doesn't earn a chapter.

═════════════════════════════════════════════════
THE BOOK MAP — parts and chapters
═════════════════════════════════════════════════

Generate in this order; it's a deliberate arc from problem →
weapon → edges → readability → judgment.

```
  PART I   — Why design at all        (the problem)
    1. Complexity is the whole game
    2. Tactical vs strategic programming

  PART II  — The core weapon          (modules & interfaces)
    3. Deep modules
    4. Information hiding (and leakage)
    5. General-purpose is deeper
    6. Different layer, different abstraction
    7. Pull complexity downward
    8. Better together or better apart

  PART III — Taming the edges
    9. Define errors out of existence
   10. Design it twice

  PART IV  — Making it obvious        (readability)
   11. Why write comments (the four excuses)
   12. Comments describe what isn't obvious
   13. Choosing names
   14. Write the comments first
   15. Consistency
   16. Code should be obvious

  PART V   — Judgment                 (principles over fashion)
   17. On trends and dogma
   18. Designing for performance
   19. Conclusion + the red-flags checklist
```

═════════════════════════════════════════════════
THE CHAPTER TEMPLATE — book style
═════════════════════════════════════════════════

Each chapter is a short, self-contained read with narrative
continuity to its neighbours. Same seven beats every time, so the
reader learns the rhythm and can move fast. Keep chapters tight —
a chapter is a sitting, not a textbook section.

```
  1. Opener        one line: where we are in the arc, what the
                   last chapter set up that this one needs.

  2. The idea      VERDICT FIRST. The principle in one or two
                   sentences, in plain words. No on-ramp.

  3. How it works  diagram-primary. Draw the shape of the idea
                   (a deep vs shallow module, a leak across a
                   boundary, a layer stack). Prose fills in what
                   the diagram can't.

  4. Why it cuts   tie to the through-line explicitly: which
     complexity    symptom (change amplification / cognitive load
                   / unknown unknowns) does this reduce, by
                   removing which cause (dependency / obscurity)?

  5. In your code  anchor to the reader (me.md) and, if --anchor
                   gave a repo, to real files in it. Original
                   examples only — never the book's. Name one
                   place the reader's own code already does this
                   well, and one place it doesn't.

  6. The red flag  the smell that says you're violating this
                   principle. One named flag, one sentence on how
                   to spot it. (Use the book's flag *names* as
                   defined terms; describe them in your words.)

  7. Carry forward one line threading into the next chapter.
```

Hard rules (inherited from `format.md` / `teacher.md`):

```
  → Every chapter has at least one ASCII box-drawing diagram.
    The idea is a picture before it is prose.
  → Every abstract claim is followed by a concrete consequence.
  → No physical-world analogy as the primary anchor. Reach for
    engineering the reader already knows (interfaces, layers,
    call stacks, the pipeline/agent work) first.
  → No hedging, no marketing language, no slow on-ramps.
  → Paraphrase, never reproduce. (See COPYRIGHT above.)
```

═════════════════════════════════════════════════
THE CONCEPT MAP — what each chapter teaches
═════════════════════════════════════════════════

Per chapter: the idea, the mechanism to diagram, the red flag,
and a cross-link to where this primitive already showed up in the
reader's other guides (so it composes with the rest of the study
family). Teach all of it in original words.

```
PART I
  1. Complexity is the whole game
     idea:     complexity is anything that makes code hard to
               understand or change; it accrues in small
               increments, so it must be resisted continuously.
     diagram:  the three symptoms + two causes (from THROUGH-LINE).
     red flag: "I'm afraid to touch this."
     link:     this is the axis everything else is traced against.

  2. Tactical vs strategic programming
     idea:     working code isn't enough; invest a steady ~10–20%
               in design or complexity compounds. Tactical
               "tornadoes" leave a mess that everyone else pays for.
     diagram:  tactical (fast now, steep later) vs strategic
               (small constant tax, flat later) over time.
     red flag: "just make it work, clean it up later."

PART II
  3. Deep modules
     idea:     a module's value is its functionality divided by
               the size of its interface. Deep = powerful behind a
               small interface. Shallow = interface nearly as
               complex as what it hides (negative value once you
               count the cost of learning it).
     diagram:  deep module (thin interface / fat body) vs shallow.
     red flag: shallow module; classitis (many tiny classes).
     link:     "a sub-agent is just a tool with a loop inside" —
               that's a deep module: huge behaviour, one call.

  4. Information hiding (and leakage)
     idea:     each module hides a design decision behind its
               interface. Leakage = a decision that shows up in
               more than one module, so they must change together.
     diagram:  a decision sealed inside one box vs the same
               decision bleeding across two boxes (a seam that
               shouldn't carry that knowledge).
     red flag: information leakage; the same fact edited in two
               places; temporal decomposition.
     link:     seams — a boundary is healthy when knowledge does
               NOT flip across it that shouldn't.

  5. General-purpose is deeper
     idea:     make modules somewhat general-purpose — an interface
               shaped by the problem, not by one caller's current
               need. Usually both simpler AND more reusable.
     diagram:  one general interface serving N callers vs N
               special-purpose methods, one per caller.
     red flag: a method that exists for exactly one call site;
               interface mirrors today's single use case.

  6. Different layer, different abstraction
     idea:     adjacent layers should offer different abstractions.
               If a layer just forwards to the next, it isn't
               earning its place.
     diagram:  a clean layer stack vs a pass-through method that
               adds nothing.
     red flag: pass-through method; pass-through variable threaded
               through many layers unchanged.
     link:     layered decomposition — each altitude should answer
               the control/state question differently.

  7. Pull complexity downward
     idea:     it's better for the module to absorb complexity than
               to push it up to every caller. One implementer
               suffers so that many users don't.
     diagram:  complexity sitting in one module vs the same
               complexity multiplied across all its callers.
     red flag: a config knob handed to users that the module had
               enough information to decide itself.

  8. Better together or better apart
     idea:     merge two pieces when they share information,
               simplify a combined interface, or remove
               duplication; split when general and special-purpose
               are tangled. Subdivision has a cost too.
     diagram:  the decision test as a small flow (shared info? /
               duplicated? / general vs special tangled?).
     red flag: code that's confusing split across two units and
               would be obvious in one (or the reverse).

PART III
  9. Define errors out of existence
     idea:     the best exception handling is needing less of it.
               Redesign the API so the error case simply can't
               occur; otherwise mask it low, or aggregate handling
               in one place.
     diagram:  errors handled at every call site vs designed away /
               masked / aggregated.
     red flag: try/except scattered everywhere; special cases that
               a different definition would erase.

 10. Design it twice
     idea:     produce two or three genuinely different designs
               before committing. Cheap insurance against the
               first idea being the only idea.
     diagram:  one path forward vs three sketched, one chosen.
     red flag: first design shipped with no alternative weighed.
     link:     the structure pass is "design it twice" for reading
               — read the skeleton two ways before the mechanics.

PART IV
 11. Why write comments — the four excuses
     idea:     "self-documenting code," "no time," "they go stale,"
               "the ones I've seen are useless" — why each is wrong.
               Comments capture what code structurally cannot.
     diagram:  what lives in code vs what only a comment can carry
               (intent, rejected options, units, invariants).
     red flag: "good code doesn't need comments" used to skip them
               wholesale.

 12. Comments describe what isn't obvious
     idea:     don't restate the code; add precision and intuition.
               Separate interface comments (what a caller needs)
               from implementation comments (how/why).
     diagram:  a comment that repeats the line vs one that adds the
               thing the line can't say.
     red flag: a comment that's just the code in English.

 13. Choosing names
     idea:     precise, consistent names that form a clear image;
               vague names are where bugs hide.
     diagram:  a vague name's blast radius vs a precise one.
     red flag: generic names (data, obj, tmp, manager, info).

 14. Write the comments first
     idea:     comments-first is a design tool — writing the
               interface comment before the code exposes a bad
               interface while it's still cheap to change.
     diagram:  comment-first loop (describe → notice the smell →
               redesign → then implement).
     red flag: comments written last, or never.

 15. Consistency
     idea:     do the same thing the same way everywhere; it turns
               unknown unknowns into knowns and lets readers reuse
               understanding.
     diagram:  one convention reused vs two conventions for one job.
     red flag: two ways to do the identical thing in one codebase.

 16. Code should be obvious
     idea:     obviousness lives in the reader's head, not the
               author's. Things that destroy it: hidden control
               flow, generics without types, inconsistency.
     diagram:  obvious path (reader predicts correctly) vs a "huh?"
               moment.
     red flag: a reviewer says "wait, where does this happen?"

PART V
 17. On trends and dogma
     idea:     principles over fashion. The book's contrarian
               takes — inheritance is often a complexity trap
               (prefer composition), agile can push tactical work,
               TDD optimizes features over design, design patterns
               can be over-applied. Use each as a *lens*, not a law.
     diagram:  "pattern applied because it fits" vs "applied
               because it's a pattern."
     red flag: reaching for a pattern/framework because it's the
               done thing, not because it cuts complexity here.
     link:     composition over inheritance — the exact maxim from
               the foundations layer; this is its source argument.

 18. Designing for performance
     idea:     clean design is usually fast enough; measure before
               optimizing; find the critical path and design around
               that, not everywhere.
     diagram:  whole-system micro-tuning vs effort focused on the
               hot path.
     red flag: sacrificing clarity to optimize code that isn't on
               the critical path.

 19. Conclusion + the red-flags checklist
     idea:     consolidate. The red flags from every chapter become
               a single review checklist; the principles become a
               design heuristic list.
     diagram:  the red-flags checklist as a one-screen index, each
               linking back to its chapter.
     red flag: (this chapter IS the index of them.)
```

═════════════════════════════════════════════════
THE RUNNING EXAMPLE — one thread through the book
═════════════════════════════════════════════════

Pick ONE small, original example and carry it across chapters so
the reader watches the same code get better as the principles
stack. If `--anchor <repo>` is given, use a real module from that
repo instead and trace its evolution. Never use the book's
examples. Good carriers: a config loader, a small HTTP client
wrapper, a text/JSON parser, a cache. State the carrier in the
front matter and reuse it.

═════════════════════════════════════════════════
CREATE VS UPDATE — per-folder, like the study family
═════════════════════════════════════════════════

```
  does .aipe/read-aposd/ exist?
     NO  → CREATE: generate front matter + every chapter + README.
     YES → UPDATE: reconcile, surgically.
              for an UPDATE, the thing that drifts is usually the
              "In your code" sections (the reader's repo changed) or
              the reader's calibration (me.md changed) — not the
              book. Re-diff:
                → In-your-code anchors vs the current repo
                → voice/calibration vs teacher.md / me.md
                → chapter template vs format.md
              edit only what moved; append "Updated: [date] — …".
```

A book whose source ideas haven't changed and whose anchors still
match is a no-op on UPDATE — same contract as the study guides.

═════════════════════════════════════════════════
OUTPUT STRUCTURE
═════════════════════════════════════════════════

```
  .aipe/read-aposd/
    README.md                 the through-line, the map, how to
                              read, the "supplement not replace"
                              note + where to get the book
    00-front-matter.md        through-line + running example
    part-1/
      01-complexity.md
      02-tactical-vs-strategic.md
    part-2/
      03-deep-modules.md
      04-information-hiding.md
      05-general-purpose.md
      06-layers.md
      07-pull-complexity-down.md
      08-together-or-apart.md
    part-3/
      09-errors-out-of-existence.md
      10-design-it-twice.md
    part-4/
      11-why-comments.md
      12-comments-not-obvious.md
      13-names.md
      14-comments-first.md
      15-consistency.md
      16-obvious-code.md
    part-5/
      17-trends-and-dogma.md
      18-performance.md
      19-conclusion-red-flags.md
```

═════════════════════════════════════════════════
HOW THE RUN EXECUTES — step by step
═════════════════════════════════════════════════

```
  1. Resolve inputs
       read teacher.md (voice), me.md (reader),
       read format.md (teaching primitives only),
       read --anchor repo if given (for "In your code").

  2. Detection
       .aipe/read-aposd/ exists? → CREATE or UPDATE.

  3. Plan (no writes)
       CREATE → "will generate front matter + 19 chapters".
       UPDATE → per-file change list (anchors / voice / template).

  4. Confirm (single gate; skip if non-interactive).

  5. Execute, in book order
       front matter → Part I → … → Part V.
       every chapter: the seven beats, ≥1 diagram, original words,
       through-line closed, red flag named, carry-forward written.

  6. Report
       a one-line-per-chapter summary + the consolidated red-flags
       checklist location.
```

═════════════════════════════════════════════════
SCOPE AND CONSTRAINTS
═════════════════════════════════════════════════

```
  → One book, one folder. This spec covers A Philosophy of
    Software Design only. A second book is a second spec.
  → Original expression always. Paraphrase the ideas; never
    reproduce the prose. Supplement the book, don't replace it.
  → Diagrams are mandatory and primary, per format.md.
  → "In your code" is the codebase bridge; with no --anchor, fall
    back to the reader's known projects (me.md) and generic-but-
    original examples.
  → Inherit voice from teacher.md; do not restate the persona.
  → The guide teaches primitives. It is foundations-layer reading
    that the system-design and agent-architecture guides reference
    — composition, deep modules, and layering all live here.
```
