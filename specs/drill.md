# Drill — hands-on failure-rep for one competency gap
## the `/aipe:drill` command

A readiness-family generator that turns one competency gap into a **hands-on
failure-rep**: a deliberate failure you cause in the **current repo**,
diagnose, fix, and prove with an eval — the only thing in the system that
produces an L3 war story, because war stories come from breaking things, not
reading about them. Each completed drill is the evidence that moves a
competency from "built" to "defensible."

Reads `format.md` (diagrams + hard rules), `teacher.md` in **coach posture**,
`me.md`, and the codebase. Defines its own artifact shape — the six-step
drill writeup — not the concept-file template.

```
  /aipe:drill      → generate one drill from a gap
  output: .aipe/drills/<competency>-<slug>.md   (accumulates; the pile IS
                                                  the war-story portfolio)
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition (and the one seam)
═════════════════════════════════════════════════

```
  study-* Project exercises   BUILD to UNDERSTAND a concept (comprehension).
  drill                       BREAK to DEFEND — the induced failure +     ← here
                              diagnosis that earns L2→L3 and a war story.
  recon                       SELECTS which gap to drill.
  rehearse-interview-defense  REHEARSES saying the war story out loud.
```

  → The third verb of the system:
      study  → understand a pattern        (comprehension)
      recon  → where does this repo sit    (assessment)
      drill  → cause + fix a real failure  (the rep that earns the rung)
  → **The seam to manage (honest):** `study-ai-engineering`'s Project
    exercises blocks already produce buildable exercises mapped to curriculum
    Build items (`Bx.y`). The overlap is real. The split: Project exercises =
    "build it to learn the concept." drill = "break it on purpose, diagnose,
    prove the fix with an eval, earn the defensible claim." A drill
    cross-references the same `Bx.y` and the same concept file — it adds the
    *induced failure + war story* those blocks don't carry. If the two ever
    drift into duplication, drill's distinct value is steps 2, 5, and 6
    below; Project exercises' is the concept comprehension.

═════════════════════════════════════════════════
PERSONA + READER
═════════════════════════════════════════════════

`teacher.md`, **coach posture** — the staff engineer who has shipped and
broken these systems in production and sat on the L4–L5 loop. The drill voice
believes the only proof someone understands a system is that they can break
it on purpose and explain why. Inherit the banned list and verdict-first.
`me.md` for calibration. Do not restate either.

═════════════════════════════════════════════════
ANATOMY OF A DRILL — the ladder mechanism
═════════════════════════════════════════════════

A drill is not a tutorial. It is a failure engineered on purpose. The six
steps walk one competency up recon's maturity ladder, ending at
L3 (*DEFENSIBLE*):

```
  1. BUILD THE NAIVE VERSION   the obvious happy-path implementation.    → L1
  2. INDUCE THE FAILURE        the specific input / scale / edge that
                               breaks it. you MUST make it fail.
  3. DIAGNOSE                  symptom → hypotheses → isolate cause.     → L2
                               the rep. resist jumping to the fix.
  4. FIX + REJECT              the fix shipped, AND the alternative
                               rejected and why (a fix with no rejected
                               alternative is luck, not a tradeoff).
  5. PROVE IT WITH AN EVAL     the measurement that shows it's fixed and
                               won't regress. evals cap every track, so   → L3
                               this is non-negotiable. no eval, no L3.
  6. WAR STORY                 the one-line defense you couldn't give
                               before. if you can't write it, not done.
```

Rule: **a drill with no induced failure is a tutorial and produces zero
interview signal.** If you cannot break it, you do not understand it yet.

═════════════════════════════════════════════════
INPUT + OUTPUT
═════════════════════════════════════════════════

Preferred input — a move straight from a recon queue:

```
  gap:  <a TRACK move from .aipe/audits/recon-[date].md>
```

Or specify directly: `competency` (from the study-ai-engineering map),
`target` (raise it L_ → L_), and the repo to do it in (the repo where the
command is run).

Output — one writeup per completed drill, following the six-step anatomy
verbatim, saved to `.aipe/drills/<competency>-<slug>.md`. Unlike recon (one
dated doc), drills accumulate — each is a war story, and the folder is the
trail recon's phase-3 strongest-signal read draws from. The war story is the
deliverable; steps 1–5 are the evidence that earns it.

═════════════════════════════════════════════════
THE DRILL TEMPLATE
═════════════════════════════════════════════════

```
  competency:   <from the study-ai-engineering map>     raises: L_ → L_
  curriculum:   <Bx.y from aieng-curriculum.md, if one maps>  (provenance)
  study ref:    <the .aipe/study-ai-engineering/ concept file for the theory>

  1. BUILD       <the naive version + the file:line it lives in>
  2. INDUCE      <the exact input/scale/edge to force the failure>
  3. DIAGNOSE    <symptom → hypotheses → isolated cause>
  4. FIX+REJECT  <the fix; the alternative rejected and why>
  5. EVAL        <the measurement: golden set / confusion matrix /
                 retrieval precision@k / regression set — with the number>
  6. WAR STORY   "<the sentence you can now say in a room, in your voice>"
```

═════════════════════════════════════════════════
STARTER LIBRARY — instructional examples
═════════════════════════════════════════════════

These show the SHAPE of a drill, calibrated to me.md's portfolio shapes.
They are NOT the drill to run — the drill targets the repo where the command
was run. **Start with an eval drill**: evals cap every track in the recon
map, so closing that one rung lifts the ceiling on all tracks at once.

```
★ eval-first (llm-app)        competency: eval design     L0 → L2   [B3.*]
  build:   an LLM-as-judge eval for one chain.
  induce:  find a case where the judge scores a worse answer higher —
           it rewards length / confidence over correctness.
  diagnose: no rubric, position/verbosity bias (study-ai-eng LLM-as-judge).
  fix+reject: criterion rubric + few-shot anchors. reject raw 1–5 (un-
           anchored); reject exact-match (too brittle for generative).
  eval:    agreement rate vs a ~20-item hand-labeled gold set.

  malformed-json (llm-app)    competency: structured output  L1 → L2
  induce:  feed real inputs until the model fences JSON in prose / adds a
           trailing comma. parser throws.
  fix+reject: schema-validate + repair-retry. reject regex extraction.
  eval:    regression set of the exact inputs that broke it.

  abstention (classical-ml)   competency: failure modes      L1 → L2   [B2C.*]
  induce:  feed the classifier an out-of-distribution input; it confidently
           misclassifies (softmax has no "I don't know").
  fix+reject: confidence threshold + abstain. reject adding more classes.
  eval:    confusion matrix + per-class precision/recall on a held-out AND
           an out-of-distribution set; threshold off the PR curve.

  two-scales (rag)            competency: index architecture  L1 → L3
  build:   pure vector search over a small corpus — works.
  induce:  scale the corpus 100x; precision collapses (near-duplicates +
           lost-in-the-middle).
  fix+reject: hybrid (BM25 + dense) + rerank. reject raising k; reject a
           bigger embedding model.
  eval:    precision@5 at both scales; show the delta the reranker bought.
           ← the headline RAG answer; the only one targeting L3 directly.
```

═════════════════════════════════════════════════
ANCHORING + CONSTRAINTS
═════════════════════════════════════════════════

```
  → Per-repo. The drill is built and broken in the repo where the command
    was run. Named projects above are instructional examples of the shape,
    never the repo being drilled.
  → The failure is the assignment. If step 2 didn't break, it was faked —
    force a harder input. The L2 signal is in step 3 (diagnose), not step 4.
  → No eval, no L3. An undefended fix is luck. Step 5 is non-negotiable.
  → The war story is a sentence said out loud under push-back, in the
    reader's voice (me.md). Written last, in original words, or the drill
    isn't finished.
  → Cross-reference, don't duplicate: cite the Bx.y curriculum item and the
    study-ai-engineering concept file for the theory; this file carries only
    the induced failure, the diagnosis, the eval, and the war story.
  → One writeup per completed drill in .aipe/drills/. The folder is the
    trail recon reads to find the strongest signal.
```

Wired to run standalone via `/aipe:drill`. Not part of `/aipe:study` or
`/aipe:rehearse` — it is the hands-on rep that recon routes gaps into.
