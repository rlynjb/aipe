# eval basics — Part F · pitfalls & practice

> **eval basics** — split into parts, read in order. cross-refs use section numbers.
> ```
> A · what an eval is ............ sections 0-1
> B · filling the boxes .......... sections 2-4
> C · making evals that dont lie . sections 5-8
> D · where evals run ............ sections 9-11
> E · running & reading .......... sections 12-14
> F · pitfalls & practice ........ sections 15-17   <- this file
> appendix · vocab + glossary
> ```

---

## 15 · common pitfalls & Goodhart's law

The ways evals lie to you, collected in one place:

- **testing on training data (leakage)** — grades memorization, not ability. the #1 silent
  score-inflator (§6).
- **tiny-n theater** — §8. percentages and percentiles that are noise wearing a suit.
- **uncalibrated judge** — §7. a confident RESULT number sitting on an unchecked ruler.
- **happy-path only** — §3. proves it works when nothing's wrong; says nothing about failure.
- **one number, no slices** — "85%" hides "40% on the slice that actually matters."
- **gaming the metric (Goodhart)** — *"when a measure becomes a target, it stops being a good
  measure."* optimize hard against one rubric and the model learns to satisfy the *rubric*,
  not the goal (e.g. pad answers to please a verbosity-biased judge). defense: keep a held-out
  set the optimizer never sees, and adversarially rotate the rubric.
- **vanity metrics** — measuring what's easy (accuracy) instead of what matters (recall on the
  rare critical class).
- **no baseline** — "85%!" versus *what?* without last week's number you can't say
  better/worse, which is the only question that ships code.

one rule that prevents most of these: **an eval number is only meaningful with its
denominator (n), its baseline, and a calibrated scorer.** missing any of the three → treat the
number as a hint, not a fact.

---

## 16 · a worked example, end to end

The smallest real eval — the angry-email labeler — all three boxes in code shape (pseudo-TS):

```ts
// BOX 1 — dataset: examples with known answers + metadata for slicing
const cases = [
  { input: "WHERE IS MY REFUND",       expected: "angry",     meta: { slice: "billing", role: "golden" } },
  { input: "thanks, got it!",          expected: "not-angry", meta: { slice: "thanks",  role: "golden" } },
  { input: "following up on my order", expected: "not-angry", meta: { slice: "neutral", role: "adversarial" } },
  // ...20 total
];

// BOX 2 — scorer: one case → verdict. here exact-match, because there's a right answer.
const score = (output, expected) => (output.trim() === expected ? 1 : 0);

// THE LOOP (a baby harness): run each case, keep the RAW output so you can read failures
const results = [];
for (const c of cases) {
  const output = await classify(c.input);          // ← the system under test
  results.push({ ...c, output, score: score(output, c.expected) });
}

// BOX 3 — aggregate: squish verdicts into decision numbers
const accuracy = mean(results.map(r => r.score));
const { precision, recall, f1 } = prf(results);     // the 2×2 table from §5

// THE DECISION — note the denominator (§8) and slice breakdown (§6)
console.log(`acc ${accuracy}  P ${precision}  R ${recall}  F1 ${f1}  (n=${cases.length})`);
report(bySlice(results));   // "85% overall, 40% on adversarial" ← the actionable line
```

Two things to notice:
- swap `score()` for a **rubric+judge** and *nothing else changes* — that's the pluggability
  from §12. the boxes don't move; only the scorer's insides do.
- wrap `classify()` in a cache, add retries + a baseline diff, and you've started building the
  real harness. every section of this doc is a way to make **one of these three boxes** better.

---

## 17 · mapping a real topic to all of the above

The multi-agent system uses **a different eval type per agent role** — §4's matching rule
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
