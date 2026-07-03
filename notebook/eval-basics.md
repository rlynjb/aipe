# eval basics

> the foundation, the choices, and the numbers — built up in the order that actually
> makes sense (foundation first), not the order we stumbled through it.
>
> one-line spine: **an eval is a scoring function run over a fixed dataset, aggregated
> into a decision. everything else names a choice about the dataset or the scorer.**

---

## 0 · the load-bearing idea

Most eval confusion comes from treating four *different kinds of thing* as if they were
siblings on one list. "golden", "rubric", "trajectory", "LLM-judge" sound like alternatives
— pick one. They aren't. They live in different boxes and you **combine** them.

So before anything else, hold this: there is a small **invariant machine**, and everything
else is a **choice about how you fill two of its boxes**.

---

## 1 · the machine (the actual foundation)

An eval is a *measurement*. Every measurement is the same three parts plus a purpose.

```
   ┌─────────────────────────────────────────────┐
   │   dataset  ──►  scorer  ──►  aggregate       │──► decision
   │   (cases)      (case →        (scores →       │
   │                 judgment)      number)        │
   └─────────────────────────────────────────────┘
         ▲              ▲
      what's in     how you turn
      a case        output → score
```

`dataset + scorer + aggregation → decision`. That's it.

Why *this* is the foundation and the fancier stuff isn't:

- it is **invariant** — drop any box and it stops being an eval. You cannot evaluate
  without cases to run, a way to score them, and a way to combine scores.
- the fancier vocabulary is **contingent** — you can have an eval with no golden answers
  (rubric only), no LLM (pure code), no trajectory (single-turn). Any of those can be
  *absent*. Invariant beats contingent when deciding what's fundamental.

**analogy.** "types of car — electric, manual, AWD?" Those are real axes but a car isn't
*fundamentally* those. It's engine + wheels + chassis moving a payload. Fuel / transmission
/ drivetrain are the config space of the components. Same here: golden / rubric / judge are
the config space of `dataset` and `scorer`.

---

## 2 · the choices (what "golden / rubric / etc." actually are)

Each fills exactly one box. This is why they compose instead of competing — they're answers
to *different questions*.

```
"golden"   = a fact about your DATASET  (each case carries a labeled answer)
"rubric"   = a fact about your SCORER   (it grades against criteria, not an answer)
"judge"    = a fact about your SCORER   (an LLM assigns the score)
"trajectory" = a fact about the UNIT    (a case is a path, not a single output)
```

They feel like a menu of "eval types" but they're picks along independent axes. A real eval
is one pick from each axis at once:

```
axis 1 — REFERENCE  what do you compare against?
  reference-based ... you have a gold answer   ("golden", labeled set)
  reference-free .... no single right answer    ("rubric", assertions)

axis 2 — GRADER     who assigns the score?
  code · statistical · LLM-judge · human

axis 3 — SCALE      what shape is the score?
  binary · absolute (1–5) · pairwise (A>B) · ranking

axis 4 — UNIT       what counts as one case?
  point / single-turn  ("LLM eval")
  trajectory / path    ("agent eval")
```

> caveat: "the four axes" is a *teaching map*, not a named industry thing. The individual
> distinctions inside it are canonical (reference-based vs reference-free is textbook;
> pointwise vs pairwise is textbook). Don't write "the four axes of eval" in notes as if
> teams say it. Say: *"an eval is one pick from each of these independent choices."*

---

## 3 · the method menu (not made up, not math)

"which method?" is a **lookup off a small closed menu**, the way you pick a data structure.
No formula outputs the method. There's a menu and a matching rule.

```
GRADER MENU (who assigns the score)          needs a gold answer?
─────────────────────────────────────────────────────────────────
1. exact / structural match   (==, schema)   yes
2. fuzzy / overlap            (F1, edit dist) yes
3. semantic similarity        (embedding cos) yes
4. set metrics                (precision/recall/F1)  yes (labeled set)
5. rubric + LLM-judge         (criteria → score)     no
6. property / assertion       (valid JSON? no PII?)  no
7. trajectory / path check    (right tools, right order)  no
8. human rating               (person scores)        no
```

That's ~the whole toolbox. "rubric / golden / trajectory" are just entries 5, 4, 7.

**the matching rule** — a decision procedure, not arithmetic:

```
does the output have ONE correct answer?
├─ yes, exact ──────────► exact match (1)      classify, extract, route
├─ yes, a labeled set ──► set metrics (4)      "did it catch the anomaly?"
├─ close-but-fuzzy ─────► overlap / semantic (2,3)
└─ no, it's a judgment call ─► rubric + judge (5)   summaries, diagnoses, recs

is it a PATH, not an output? ──► trajectory (7)   agents
is it a hard constraint? ─────► assertion (6)     "must be valid JSON"
is it the ground-truth anchor? ► human (8)        calibration
```

the pick is **forced by the shape of the output** — that's why it feels non-arbitrary but
also non-mathematical. Ground-truth labels exist → you *can* compute precision/recall, so
you do. No single right answer exists → no metric exists to compute, so you fall to
rubric+judge.

**where math actually enters:** only *inside* a method, never in choosing it.
`precision = TP/(TP+FP)`, F1, percentiles — arithmetic that runs *after* the method is
already chosen by output-shape. So: **choosing = lookup (no math). running = sometimes
arithmetic.** The "is this math?" instinct is picking up on the arithmetic inside methods
1–4, which happens downstream of the (non-math) choice.

> honest caveat: the menu has *defaults*, not one legal answer per row. A diagnosis *could*
> be graded by semantic-similarity to a golden diagnosis (3) instead of a rubric (5). Some
> teams do exactly that. "I chose rubric over semantic-similarity because diagnoses have
> many valid phrasings" is a strong deliberate-choice answer.

---

## 4 · the harness (what turns the loop into infrastructure)

The loop in §1 is the *physics*. A **harness** is the engineering around it that lets you
run it repeatedly, cheaply, and trustably over real (slow, flaky, expensive,
non-deterministic) systems.

```
                        THE EVAL HARNESS
   ┌──────────────────────────────────────────────────────────┐
   │  dataset ─► TASK ─► output ─► SCORER ─► score ─► AGG       │─► report
   │  loader   (SUT)              (grader)                      │   + compare
   │  ────────────────────────────────────────────────────────│   to baseline
   │            cross-cutting concerns (the actual job):        │
   │  versioning · concurrency · caching · persistence ·        │
   │  observability · regression-compare                        │
   └──────────────────────────────────────────────────────────┘
```

**core (minimum viable):**
- **case** = `{input, [expected], metadata}`. metadata matters more than expected —
  it's how you slice ("judge fine on refunds, tanks on returns").
- **task / SUT** = the thing under test, behind a *pluggable* interface. If the harness
  knows whether the SUT is one call vs a RAG chain vs an agent, it's a script, not a harness.
- **scorer** = `(output, expected?) → score`, pluggable + composable.
- **aggregation** = scores → decision signal (mean, p50/p95, pass-rate, per-slice).

**the six concerns that earn the name "harness":**
1. **concurrency + rate control** — bounded parallelism, retries+backoff, timeouts. naive
   `for case: await run()` is unusable at 500 cases.
2. **partial-failure isolation** — one case throwing must not kill the run. capture the
   error *as a result* and continue. dying on case 347/500 = worthless.
3. **caching** — key on `hash(input + prompt_version + model)`. changing only the scorer
   must not re-pay for generation. biggest cost lever.
4. **persistence of raw I/O** — store outputs, not just scores. you debug a pass-rate drop
   by *reading the failing outputs*. scores-only = a black box you can't act on.
5. **observability** — tokens / latency / $ per case + per run.
6. **versioning + regression-compare** — pin dataset+prompt+model together, diff against a
   baseline. "did my change help?" is *the* question a harness exists to answer.

**the test — harness vs script:** *can you swap the SUT, swap the scorer, and re-run against
last week's numbers without editing the loop?* yes → harness.

> most portfolio "harnesses" implement 1–4 and stop. concurrency, failure-isolation, and
> regression-compare are the senior signal — they only matter at real scale, which is exactly
> what synthetic-load + fault-injection are meant to demonstrate.

---

## 5 · what the numbers are *for*

The mistake is reading every number as "how good is the system." Only one kind is. Sort by
**purpose**:

```
kind          answers                        about quality?
──────────────────────────────────────────────────────────────
INSTRUMENT    "what resolution is my ruler?"   no — scorer design
              (4 dims, 5-scale, 3 verdicts, #rubrics)
COVERAGE      "how much did I test?"            no — dataset breadth
              (10 goldens, 4 classes)
RESULT        "is the system good?"            YES ← the only one
              (the scores themselves)
CALIBRATION   "do I trust the ruler?"           no — measures the measurer
              (6/6 verdict, 24/24 within-1)
OPERATIONAL   "what did it cost / how slow?"    no — runtime
              (p50/p95/p99, $ per case)
```

- **INSTRUMENT** describes the ruler, not the thing measured. `4 dims × 5-scale × 3 verdicts`
  is scorer *design* — resolution. Picked before you run anything. Can't be good/bad, only
  well/poorly designed for the question.
- **COVERAGE** is the *denominator* of every result. "passed" is meaningless without
  "passed *on what*."
- **RESULT** is the only quality signal — and often the *last* to exist. If your dashboard
  is all instrument+coverage+calibration+cost, note that **none of those numbers say whether
  the system is good.** They say it's *measurable*.
- **CALIBRATION** is meta — it says the *judge* agrees with humans, licensing trust in the
  results. Without it, results are readings from an ungraded ruler.
- **OPERATIONAL** is orthogonal to quality entirely. p95 can be great while the system is
  wrong. it's a ship-gate, not a quality-gate.

**interview move:** when someone points at the dashboard and asks "so is it good?", answer
*"which number — the quality result, or my confidence in the judge that produced it?"*
Separating result from calibration out loud is the senior tell.

---

## 6 · per-agent vs shared (the number that trips everyone)

"different evals per agent" is true about the **method**. It does **not** mean each agent
owns a column of numbers. Most numbers are *shared plumbing*; only two things are per-agent.

```
PER-AGENT (changes by agent)        SHARED (same for everyone)
────────────────────────────        ──────────────────────────
which method  (rubric/golden/traj)  5-scale, 3 verdicts   (grading scale)
which rubric  (2 rubrics = 2 agents) calibration           (judge trust)
                                    p50/p95/p99, $         (runtime)
```

**analogy.** a school grades essays by rubric and math by answer-key — *per subject*. But
the A–F scale is the *same* in every class; the student count is the *same*. Nobody says
"the A–F scale belongs to English." The 5-scale and percentiles are the A–F scale.

walk **one** agent and check every number:

```
diagnostic agent — which numbers touch it?
  method: rubric × judge ──────  ✓ ITS choice (per-agent)
  4 dimensions ────────────────  ✓ shape of ITS rubric (per-agent)
  5-scale, 3 verdicts ─────────  shared scale
  10 goldens ──────────────────  ✗ DOESN'T TOUCH IT (feeds monitoring's P/R/F1)
  calibration ─────────────────  shared — validates the JUDGE (→ licenses diag's scores)
  p95 / $ ─────────────────────  shared runtime
```

of ~7 numbers, exactly **one pair** (method + its dimensions) is "about" this agent. The
odd one out — **goldens** — is a *single-agent* dataset that only the monitoring agent is
scored against. Not global, not every-agent. That's usually what snags people.

```
per-agent:      method + rubric
shared:         scale, calibration, percentiles, $
per-ONE-agent:  goldens → monitoring only
```

---

## 7 · mapping a real topic to all of the above

The multi-agent system uses **a different eval type per agent role** — §3's matching rule
made physical. This is why "4 signal classes / 2 rubrics" line up the way they do:

```
agent           eval question     method (the axis combo)        primitive
coordinator     routed right?     trajectory × code              —
monitoring      caught anomaly?   golden × code × set → P/R/F1   scoreDetections
diagnostic      diagnosis good?   rubric × judge × 5-scale       RubricJudge
recommendation  rec good?         rubric × judge × 5-scale       RubricJudge
```

2 rubrics (not 4) because monitoring gets precision/recall (not a rubric) and coordinator
gets routing correctness (not a quality score). Naming *"different agents demand different
eval axes"* explicitly is exactly the point an interviewer rewards.

**machinery ↔ files:**

```
file                     box              axis picks
01-eval-set-types    →   DATASET          reference-based (golden) storage
02-eval-methods      →   SCORER           rubric × judge × 5-scale(abs)
03-llm-judge-bias    →   SCORER trust     bias mitigation + calibration
04-observability     →   AGGREGATE+runtime cost/latency
run.eval.ts          →   THE LOOP         the harness
report.eval.ts       →   AGGREGATE→report percentiles + $
```

**the honest read: structure = senior-grade, n = placeholder.**
- 10 goldens / 4 classes ≈ 2.5 per class — smoke skeleton; can't slice per-class yet.
- 6/6, 24/24 within-1 = a calibration *smoke test*, not a calibration *set*. 6/6 looks
  perfect *because* n is tiny; CI is enormous. proves "not broken", not "calibrated". target
  ~30–50 human labels before "calibrated" is defensible. ← the thing an interviewer pokes.
- p50/p95/p99 over 10 cases is meaningless (p99 of 10 = the max). percentiles need volume —
  which is why synthetic load is on the plan.

don't add eval *machinery* — it's there. add **volume + human labels**.

**dependency-first build order** (from `not_started`):
```
1. 01  freeze golden schema {input, expected, signal_class, metadata}
2. 02  rubrics-as-data (write before judge — judge needs criteria to read)
3. run.eval.ts  the loop, once dataset+scorer shapes are stable
4. 03  calibration (after judge runs) — expand n=6 → ~40 here
5. 04 / report  observability last — aggregates what the loop produced
```

> one structural edit: "evals" and "observability" answer different questions —
> *is the output good* (01–03) vs *what did it cost / what happened* (04). worth a one-line
> separator so `onCapabilityEvent` + receipts is clearly answering the second.

---

## eng-vocab one-liners

- **eval** — a scoring function run over a fixed dataset, aggregated into a decision;
  everything else is a choice about the dataset or the scorer.
- **eval harness** — the runtime that executes that loop over a fixed, *versioned* dataset
  with production concerns (concurrency, failure-isolation, caching, persistence,
  observability, regression-compare) that make results repeatable and debuggable. the loop
  is trivial; the six concerns are the job.
- **eval methods** — a fixed ~8-item menu of grader types; selected per agent by the *shape
  of its output* (single answer → match/metrics; judgment call → rubric+judge; path →
  trajectory), not by calculation. math only appears *inside* a method once chosen.
- **eval numbers by purpose** — instrument (ruler design), coverage (what was tested),
  result (is it good), calibration (do I trust the ruler), operational (what it cost). only
  *result* speaks to quality; the other four exist to make result trustworthy + affordable.
- **per-agent vs shared** — each agent picks a *method*; most numbers are a shared measuring
  toolkit reused across agents; goldens are a single-agent dataset scored only against the
  monitoring agent.
- **calibration set** — human-labeled anchors that measure the *judge*, not the system.
  small n = "not broken"; trustworthy needs ~30–50.
