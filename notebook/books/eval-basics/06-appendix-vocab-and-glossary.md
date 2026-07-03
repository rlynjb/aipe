# eval basics — Appendix · vocab & glossary

> **eval basics** — split into parts, read in order. cross-refs use section numbers.
> ```
> A · what an eval is ............ sections 0-1
> B · filling the boxes .......... sections 2-4
> C · making evals that dont lie . sections 5-8
> D · where evals run ............ sections 9-11
> E · running & reading .......... sections 12-14
> F · pitfalls & practice ........ sections 15-17
> appendix · vocab + glossary   <- this file
> ```

---

## eng-vocab one-liners

- **eval** — a scoring function run over a fixed dataset, aggregated into a decision;
  everything else is a choice about the dataset or the scorer.
- **the three boxes** — dataset (what to test on) → scorer (grade each answer) → aggregation
  (squish to one number). invariant: drop any one and it stops being an eval.
- **eval harness** — the runtime that executes that loop over a fixed, *versioned* dataset
  with production concerns (concurrency, failure-isolation, caching, persistence,
  observability, regression-compare) that make results repeatable and debuggable.
- **eval methods** — a fixed ~8-item menu of grader types; selected per agent by the *shape
  of its output* (single answer → match/metrics; judgment call → rubric+judge; path →
  trajectory), not by calculation. math only appears *inside* a method once chosen.
- **dataset roles (golden / adversarial / regression)** — a *provenance* axis independent of
  how you grade: golden = curated to define correct; adversarial = built to expose failure;
  regression = a real past bug frozen as a permanent test. one case can wear several roles;
  regression is the one role you must tag explicitly or it rots.
- **precision vs recall** — precision = "don't cry wolf" (of what it flagged, how much was
  real); recall = "don't miss the wolf" (of what was real, how much it caught). F1 combines
  them. you set the dial by consequence, not by formula.
- **dataset quality** — coverage + diversity + balance + no-leakage. a good pile beats a big
  pile; metadata-per-case is what turns "does it fail" into "*where* it fails."
- **LLM-as-judge** — flexible scorer with known biases (position, verbosity, self-preference,
  sycophancy); usable only with mitigations + a human-labeled calibration set (~30–50).
- **calibration set** — human-labeled anchors that measure the *judge*, not the system.
  small n = "not broken"; trustworthy needs ~30–50.
- **why n matters** — small samples jitter; "85% (n=20)" spans ~68–95%. show the denominator;
  percentiles need hundreds; per-slice claims need ~30+.
- **offline vs online** — offline = fixed labeled set in CI ("good enough to ship?"); online =
  live unlabeled traffic ("still good?"), graded by guardrails + signals + drift, no ground
  truth. online finds failures → they become offline regression cases.
- **RAG eval** — grade retrieval (recall@k, precision@k, nDCG — has ground truth) and
  generation (faithfulness, answer-relevance — rubric+judge) *separately*, so you know which
  half broke.
- **agent / trajectory eval** — grade the *path* (right tools, order, recovery, efficiency,
  safety), not just the final answer. harder to label; many valid paths.
- **eval numbers by purpose** — instrument (ruler design), coverage (what was tested),
  result (is it good), calibration (do I trust the ruler), operational (what it cost). only
  *result* speaks to quality; the other four exist to make result trustworthy + affordable.
- **per-agent vs shared** — each agent picks a *method*; most numbers are a shared measuring
  toolkit reused across agents; goldens are a single-agent dataset scored only against the
  monitoring agent.
- **Goodhart's law** — when a measure becomes a target it stops being a good measure. defense:
  hold-out set the optimizer never sees + adversarial rubric rotation.

---

## glossary

```
accuracy         (TP+TN)/all. misleads on imbalanced classes.
adversarial      a case built to expose a failure mode (dataset role).
aggregation      box 3: squish per-case verdicts into a decision number.
baseline         last known result; the thing you diff against to say "better/worse".
calibration      checking the judge (or any scorer) against human labels.
case             one eval example: {input, [expected], metadata}.
coverage         how much of the real input space the dataset touches.
dataset          box 1: the pile of cases you test on.
drift            output/input distribution sliding over time (online signal).
faithfulness     RAG-gen metric: are the answer's claims grounded in retrieved text?
F1               harmonic mean of precision & recall.
golden           a curated "this is the right answer" case (dataset role).
ground truth     the known-correct label for a case.
harness          the runtime around the loop: concurrency, cache, persistence, compare.
judge (LLM-)     an LLM used as the scorer for open-ended outputs.
leakage          test data overlapping build/tune data → grades memorization.
offline eval     fixed labeled dataset, run in dev/CI, pre-ship.
online eval      live production traffic, usually unlabeled, continuous.
precision        TP/(TP+FP). "when it fired, was it right?"
p50/p95/p99      latency/score percentiles; need large n to mean anything.
recall           TP/(TP+FN). "of the real ones, how many caught?"
recall@k         retrieval metric: of relevant docs, how many in top-k.
reference-based  grading against a known answer (needs a gold label).
reference-free   grading against criteria/properties (no single answer).
regression       a real past failure frozen as a permanent test (dataset role).
rubric           explicit scoring criteria a (usually LLM) judge grades against.
scorer           box 2: turns one output into a verdict.
slice            a labeled subset (by class/difficulty) you report separately.
SUT              system under test — the thing being evaluated.
trajectory       the step-by-step path an agent takes; the unit of agent eval.
```
