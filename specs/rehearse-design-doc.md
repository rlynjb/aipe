# Rehearse — Design Docs (the `/aipe:rehearse-design-doc` command)

A rehearse-family generator that turns the **current repo**'s most
significant design decisions into staff-level **design docs / RFCs** — the
written artifact you put in front of a team, a reviewer, or a promo
committee to get alignment and to read as staff-level. This is the human
layer: not comprehension for yourself (that's `study-*`), but communication
to others.

Performance-side, like the other rehearse books. Reads `format.md`
(formatting, diagram, no-hedging, hard rules), `teacher.md` in **coach
posture** (same staff engineer, preparing you to communicate under
scrutiny), `me.md`, and the codebase. It defines its own chapter shape (a
design doc is not the concept-file template) and inherits the rehearse
family's create/update detection, single confirmation gate, and run/report
mechanics — see `rehearse-interview-defense.md`; identical here.

```
  /aipe:rehearse-design-doc      → create or update
  output: .aipe/rehearse-design-doc/
```

═════════════════════════════════════════════════
WHAT IT IS — and where it sits
═════════════════════════════════════════════════

```
  study-*               UNDERSTAND the codebase (comprehension, for you)
  rehearse-interview-defense  DEFEND it in an interview (spoken, coach)
  rehearse-hackathon-demo     SHOW it in a demo (spoken, coach)
  rehearse-design-doc   COMMUNICATE a decision in WRITING (this)    ← here
```

  → The staff signal it trains: at staff level the bottleneck is
    usually not the code, it's writing the decision down so a room
    aligns behind it. This produces that document for real decisions
    already in your repo.
  → It does not invent decisions. It finds the ones the codebase
    actually made and writes them up the way they should have been
    written up (or were).

═════════════════════════════════════════════════
PERSONA — coach posture (uniform with the family)
═════════════════════════════════════════════════

`teacher.md`, coach posture — the same staff engineer, shifted to prepare
you for scrutiny. For a design doc that means: write so a skeptical
reviewer aligns; lead with the decision, not the suspense; "say this, not
that" on framing. Inherit the banned list (no hedging, no marketing
language) and the verdict-first / rank-what-matters trait. `me.md` for
calibration. Persona routing stays uniform across all three rehearse
books — all coach.

═════════════════════════════════════════════════
WHICH DECISIONS WARRANT A DOC
═════════════════════════════════════════════════

A design doc is expensive attention; spend it only where the decision was
**significant and non-obvious**. Rank the repo's decisions and write docs
for the top few (cap ~2–3 unless told otherwise):

```
  warrants a doc          skip
  ──────────────          ────
  hard to reverse         a default nobody would question
  a real alternative      one obvious way to do it
    existed
  cross-cutting impact    local, contained
  someone will ask        self-explanatory
    "why this way?"
```

If the repo has no decision that clears this bar, say so honestly and
write one short doc on the most consequential choice it did make, framed as
a template the reader can reuse — do not manufacture three.

═════════════════════════════════════════════════
THE DESIGN-DOC CHAPTER — structure
═════════════════════════════════════════════════

One chapter = one decision = one complete doc. Every doc, same spine (the
canonical RFC shape), coach-voiced, grounded in real files:

```
  1. Title + one-line summary   the decision in a sentence, up top.
  2. Context / problem          what forced the decision. Real
                                constraints from the repo, not theory.
  3. Goals & non-goals          what this must do — and explicitly
                                what it won't. Non-goals prevent scope
                                fights.
  4. The decision               the chosen design. A diagram (per
                                format.md) is mandatory — the shape
                                before the prose.
  5. Alternatives considered    2–3 real options that were on the
                                table, each with why it lost. This is
                                "design it twice" written down; a doc
                                with no alternatives reads as
                                undercooked.
  6. Tradeoffs accepted         what this costs, owned without
                                flinching ("we chose X, accepting Z").
                                No apologetic framing.
  7. Risks & mitigations        what could go wrong, what guards it.
  8. Rollout / migration        how it ships safely; what changes for
                                callers / data already in flight.
  9. Open questions             what's still undecided. Honesty here
                                is a staff signal, not a weakness.
```

Coach notes thread through: where a reviewer will push, the framing that
holds, the sentence that gets the yes. Keep each doc tight — a doc people
actually read, not a wall.

═════════════════════════════════════════════════
OUTPUT + MECHANICS
═════════════════════════════════════════════════

```
  .aipe/rehearse-design-doc/
    00-overview.md        which decisions warranted a doc (ranked),
                          the doc template, how to use these
    01-<decision-slug>.md   one full design doc
    02-<decision-slug>.md
    03-<decision-slug>.md   (cap ~3; fewer if fewer warrant it)
```

Create/update detection (does `.aipe/rehearse-design-doc/` exist?), the
single confirmation gate, the detection pass, run order, and the REHEARSE
RUN SUMMARY row are the rehearse family pattern — identical to
`rehearse-interview-defense.md`. On UPDATE the docs drift when the
decisions in the code change (a chosen design was replaced, a new
significant decision appeared); reconcile against the code, surgically.

```
  → Per-repo. Every doc is about a real decision in this repo, cited
    to real files. No invented decisions, no invented code.
  → On-demand, like the rehearse family — run it when you're about to
    document or defend a decision, not on every commit.
  → Grounded and honest. Significant + non-obvious only; own the
    tradeoffs; surface the open questions.
  → Inherit formatting/diagram/hard rules from format.md and coach
    posture from teacher.md. Restate neither.
```

═════════════════════════════════════════════════
RUNNING IT INSIDE `/aipe:rehearse`
═════════════════════════════════════════════════

This belongs to the rehearse orchestrator. Once `rehearse.md` lists it,
`/aipe:rehearse` creates/updates it alongside the interview-defense and
demo books, under the same single confirmation gate and summary — and
persona routing stays uniform (all three coach posture). Standalone via
`/aipe:rehearse-design-doc` until then.
