# eval basics — Part E · running & reading

> **eval basics** — split into parts, read in order. cross-refs use section numbers.
> ```
> A · what an eval is ............ sections 0-1
> B · filling the boxes .......... sections 2-4
> C · making evals that dont lie . sections 5-8
> D · where evals run ............ sections 9-11
> E · running & reading .......... sections 12-14   <- this file
> F · pitfalls & practice ........ sections 15-17
> appendix · vocab + glossary
> ```

---

## 12 · the harness (what turns the loop into infrastructure)

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

## 13 · what the numbers are *for*

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

## 14 · per-agent vs shared (the number that trips everyone)

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
