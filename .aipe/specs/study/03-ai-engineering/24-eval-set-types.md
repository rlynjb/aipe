# Eval set types

**Industry name(s):** Golden set, adversarial set, regression set, eval harness
**Type:** Industry standard

> Three eval set shapes: golden (representative happy-path), adversarial (edge cases the model fails on), regression (cases the model used to fail on).

**See also:** → [25-eval-methods](25-eval-methods.md) · → [26-llm-judge-bias](26-llm-judge-bias.md)

---

## Why care

You've shipped an LLM feature with "we tested it on a few examples" and watched it regress in production. The fix is curated eval sets that catch the failure modes you care about.

The pattern is *test-set discipline*. Same shape as unit tests, integration tests, end-to-end tests — each serves a different failure mode.

---

## How it works

Three sets per feature.

### Golden set

Representative, well-formed inputs and their expected outputs. The "happy path." Tests baseline quality.

### Adversarial set

Inputs the model historically failed on. Edge cases, ambiguities, prompt injections. Tests robustness.

### Regression set

Inputs that previously failed and were fixed. Tests that fixes stay fixed.

### For aipe

Phase 2B B2B.6 calls for "Eval: 10 representative intents, precision@k" — a golden set for the RAG retrieval. No adversarial or regression sets are anchored to aipe directly.

---

## Eval set types — diagram

```
Three sets, three jobs

  Golden          Adversarial         Regression
  ──────          ───────────         ──────────
  Representative  Hard / edge cases   Past failures, now fixed
  Happy path                          
  
  Catches:        Catches:            Catches:
  baseline        robustness          regressions
  quality dips    breaks              after refactor
```

---

## In this codebase

**Not yet implemented.** Phase 2B B2B.6 (golden set for retrieval) is the buildable target. Adversarial and regression sets aren't anchored to aipe.

---

## Elaborate

### Where this pattern comes from

Test-set discipline in ML goes back decades. The "adversarial set" framing crystallised with adversarial-example research (Goodfellow et al., 2014); the "regression set" framing comes from software engineering practice.

### The deeper principle

Different failure modes need different test sets; one set can't catch all.

### Where this breaks down

When the eval sets don't represent production traffic — drift between eval and production silently degrades quality.

### What to explore next

- [25-eval-methods](25-eval-methods.md) → how to score each set
- Anthropic's eval-set-curation guide

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ All three sets           │ Golden only                  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Coverage         │ Quality + robustness +   │ Quality only                │
│                  │ regression               │                              │
│ Curation cost    │ ~10 + ~5 + ~5 examples   │ ~10 examples                 │
│                  │ ongoing                  │                              │
│ Failure mode     │ Drift between eval and   │ Misses adversarial cases    │
│                  │ production traffic       │                              │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe currently has no eval sets. Phase 2B adds B2B.6's 10-intent golden set; adversarial/regression are deferred.

### Sub-block 2 — what the alternative would have cost

Maintaining adversarial sets requires curating hard cases ongoing — a discipline that earns its place only when adversarial failures become common.

### Sub-block 3 — the breakpoint

When adversarial / regression failures hit users in the wild, those sets earn their place.

---

## Tech reference (industry pairing)

### Eval harnesses

- **Codebase uses:** none today; B3.1 (loopd) targets a reusable harness.
- **Leading today:** Custom JSON eval sets + scorer — `adoption-leading` for production LLM apps, 2026.
- **Runner-up:** Langfuse / LangSmith eval pipelines — `innovation-leading` for hosted eval.

---

## Project exercises

### [B2B.6] Eval: 10 representative intents, precision@k

- **Exercise ID:** `[B2B.6]`
- **What to build:** A golden set of 10 `(intent, expected_chunk_id)` pairs at `aipe/.aipe/specs/eval/retrieval-precision-at-k.jsonl`. Run retrieval; measure precision@5.
- **Why it earns its place:** justifies whether Phase 2B retrieval beats no-RAG baseline.
- **Files to touch:** `aipe/.aipe/specs/eval/` (new), eval runner script.
- **Done when:** retrieval precision@5 documented in `caught-regression.md` style file; baseline-vs-RAG comparison recorded.
- **Estimated effort:** `1–2 days`.

---

## Summary

Three eval sets — golden, adversarial, regression — catch three failure modes. aipe currently has no eval; Phase 2B B2B.6 adds a 10-intent golden set for retrieval. Adversarial/regression are deferred. The constraint: ship the cheapest valuable eval first. The cost: only baseline quality is measured.

- Golden = representative; adversarial = hard; regression = past failures.
- aipe Phase 2B B2B.6 adds golden for retrieval.
- Breakpoint: adversarial failures in production.

---

## Interview defense

### Likely questions

**Q [mid]:** Why three eval sets?

**A:** Each catches a different failure. Golden catches baseline-quality regression. Adversarial catches robustness failures on edge cases. Regression catches fixes from un-fixing.

**Q [senior]:** Why does aipe start with golden only?

**A:** Cheapest discipline-to-value. 10 representative intents catch the obvious failures; adversarial and regression earn their place only after you've seen adversarial failures.

**Q [arch]:** When does an adversarial set become mandatory?

**A:** When a user reports a failure that the golden set doesn't catch. That one failure becomes the seed of the adversarial set.

### The question candidates always dodge

**Q:** Why 10 intents instead of 100?

**A:** Manual curation is the bottleneck. 10 carefully-chosen intents are more valuable than 100 random ones; you can hand-pick them to cover the key spec types.

### One-line anchors

- Golden / adversarial / regression — three sets.
- aipe Phase 2B B2B.6 = golden only.
- Adversarial earns its place after real failures.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the three eval sets with their purposes.

### Level 2 — Explain it out loud
Why is regression set the cheapest of the three? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user reports `/aipe:feature` fails on intents with special characters. What set does this populate?

### Level 4 — Defend the decision you'd change

"Would you ship aipe with all three eval sets from day one?"

### Quick check — code reference test
Without opening files:
- aipe's Phase 2B eval target? → 10 intents, precision@5
- Build item? → B2B.6
- Adversarial set status for aipe? → not anchored; deferred
