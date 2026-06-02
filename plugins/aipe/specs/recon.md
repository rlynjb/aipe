# Recon — AI-engineering readiness audit + path
## the `/aipe:recon` command

A readiness-family generator that places the **current repo** on the
AI-engineering hiring ladder and sequences the shortest path up. It scores
the repo's AI/ML surface against the `study-ai-engineering` competency map on
a four-rung maturity ladder, names the load-bearing gap, and hands back an
ordered queue of moves — each routed into the spec that closes it
(`study-*`, `drill`, or `rehearse-*`).

Reads `format.md` (diagrams + hard rules), `teacher.md` in **coach posture**,
`me.md`, and the codebase. Defines its own artifact shape — like the rehearse
books — not the concept-file template.

```
  /aipe:recon      → create or update
  output: .aipe/audits/recon-[date].md   (dated; the trail IS the progression)
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition (no overlap)
═════════════════════════════════════════════════

```
  study-*     UNDERSTAND a topic in this repo (comprehension).
  audit*      INVENTORY what's here / debt / refactor opinion (health).
  rehearse-*  PERFORM the work for a specific room (defend, demo, doc).
  recon       PLACE this repo on the AI-eng hiring ladder + sequence    ← here
              the path up. The readiness axis — not comprehension,
              not code-health, not performance.
  drill       EXECUTE one gap-closing failure-rep recon surfaced.
```

  → recon is the meta-layer ABOVE the study family. It does not re-teach
    (cross-link `study-ai-engineering` / `study-prompt-engineering`), does
    not list code-health debt (that's `audit-cleanup`), does not write
    performance scripts (that's `rehearse-*`). It reads the repo — and any
    existing `.aipe/study-ai-engineering/` audit — and answers one question
    the rest of the family doesn't: **where does this repo put me on the
    hiring ladder, and what's the shortest path up?**
  → The unit recon scores is the same competency map `study-ai-engineering`
    already defines (LLM foundations, context/prompts, retrieval/RAG,
    agents, evals, production serving, ML). recon reuses that taxonomy; it
    does not invent a parallel one.

═════════════════════════════════════════════════
PERSONA + READER
═════════════════════════════════════════════════

`teacher.md`, **coach posture** — the staff engineer who has sat on the L4–L5
hiring loop. Same engineer as the study family, shifted to score against the
bar: what reads as senior in a room, not what is merely true. Inherit the
banned list (no hedging, no marketing language) and verdict-first /
rank-what-matters. `me.md` for reader calibration. Do not restate either.

The recon voice does not give credit for scaffolding and does not soften the
rung. A competency claimed in a README but absent in the code is flagged as a
**liability**, not a strength — it is the thread an interviewer pulls.

═════════════════════════════════════════════════
THE MATURITY LADDER — the lens
═════════════════════════════════════════════════

Every competency is scored on this ladder. The question is never "does the
code exist" — it is "does it exist at the depth that survives the bar." The
top rung is `format.md`'s Validate level 4 (*defend*) and the Interview
defense block, applied as an assessment scale — not a new vocabulary.

```
  L0  SCAFFOLDED   code present, tutorial-shaped or AI-generated, never
                   stressed. Author can't say why it's built this way.
                   → zero signal. A liability if claimed.

  L1  BUILT        author assembled it and understands the shape.
                   → answers "what did you build," not "what went wrong."

  L2  DEBUGGED     author hit a real failure here and diagnosed it.
                   a specific war story exists: symptom → cause → fix.
                   → this is where interview signal begins.

  L3  DEFENSIBLE   author can state the failure, the alternatives tried,
                   the eval evidence that settled it, and the tradeoff
                   accepted — and hold it against push-back.
                   → this is what reads as L5. (= Validate: defend.)
```

Scoring rule: a competency is only as high as the *evidence in the repo*
supports — eval scripts, error handling, commit history, config that shows a
deliberate choice. A working happy path is L0/L1. **No eval and no handled
failure caps the ceiling at L1**, no matter how much code is present.

═════════════════════════════════════════════════
WHAT IT PRODUCES — one dated audit doc
═════════════════════════════════════════════════

A single markdown artifact at `.aipe/audits/recon-[date].md` (matching
`audit.md` / `audit-cleanup.md`). Dated, not overwritten — the run history
is the progression trail and the raw material for the "here's how I closed
my gaps" recruiter narrative. Four sections, in order:

```
  1. AUDIT   the repo's AI/ML surface — real vs scaffolded. Which shape
             it matches (LLM-app / classical-ML / RAG; the same three-shapes
             framing study-ai-engineering uses), what chains/models/loops
             exist, where authorship is hand-built vs left-as-generated,
             and an explicit check for the three usually-missing things:
             EVALS, FAILURE HANDLING, TRADEOFF EVIDENCE. Cite file:line.

  2. LENS    each in-scope competency from the study-ai-engineering map
             scored L0–L3, one line of evidence + the single move that
             raises it. Render as a scorecard. State the repo's true level:
             the median of claimed competencies, dragged down by any
             claimed-but-L0 competency.

  3. PATH    which track this repo advances; the single strongest signal
             (the one competency that, pushed to L3, becomes an interview
             centerpiece); the load-bearing gap (almost always evals or
             failure handling); and claim-vs-reality — what level this reads
             as on a resume today and where it falls apart under questioning.

  4. TRACK   the ordered queue. Each move raises one competency by one rung,
             is buildable+debuggable (not just readable), and routes into
             the spec that closes it:
               → comprehension gap  → /aipe:study-ai-engineering (or
                                       study-prompt-engineering)
               → hands-on / L1→L3   → /aipe:drill  (the failure-rep)
               → can build but can't say it → /aipe:rehearse-interview-defense
```

Nothing else. No encouragement, no recap of progress. The phase-4 queue is
the part acted on; sections 1–3 are the evidence that justifies it.

═════════════════════════════════════════════════
ANCHORING + HONEST ASSESSMENT
═════════════════════════════════════════════════

```
  → Per-repo. Score the repo where the command was run, against evidence in
    its files. Any project named in this spec (loopd, contrl, AdvntrCue) is
    an INSTRUCTIONAL EXAMPLE of a shape — never the repo being scored.
  → Score against the code, not the README or intent. A claimed-but-absent
    competency is a liability, named with its file location.
  → Rank, don't flatten. Name the load-bearing gap before the full
    scorecard. Prefer one competency at L3 over five at L1 — depth over
    breadth (me.md).
  → Honest "not yet exercised" for competencies the repo doesn't touch.
    Never manufacture a finding to fill the map.
  → The cross-repo three-track portfolio view (which of LLM-app / ML / RAG
    is furthest from one L3 war story across ALL repos) is the one
    deliberately out-of-scope deviation from per-repo. It is a separate,
    parked artifact (a future `/aipe:recon-portfolio`), because it must read
    repos this command does not. Per-repo recon ends by pointing UP to it,
    not by guessing at other repos.
```

═════════════════════════════════════════════════
CREATE VS UPDATE + RUN
═════════════════════════════════════════════════

```
  recon is dated, so every run writes a NEW .aipe/audits/recon-[date].md
  rather than reconciling an existing one — the prior dated files stay as
  the trail. On a fresh run: read the repo, read any existing
  .aipe/study-ai-engineering/ audit for context, score, write the dated doc,
  print the phase-4 queue and the single highest-leverage next command.
```

Wired to run standalone via `/aipe:recon`. Not part of `/aipe:study` or
`/aipe:rehearse` — it is the readiness layer that routes into both.
