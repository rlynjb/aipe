# Hybrid retrieval with RRF

**Industry name(s):** Reciprocal Rank Fusion (RRF), hybrid retrieval, ensemble retrieval
**Type:** Industry standard

> Run dense + sparse retrievals independently; combine their ranks with RRF — `score = Σ 1/(k + rank_i)` — to get a single ranked list that beats either alone.

**See also:** → [16-dense-vs-sparse-retrieval](16-dense-vs-sparse-retrieval.md) · → [18-reranking-cross-encoder](18-reranking-cross-encoder.md)

---

## Why care

You've tried averaging scores from dense and sparse retrievers and watched the scales fight — dense gives 0.7s, sparse gives BM25 scores in the 5-20 range. The naive average broke. RRF works because it only uses rank position, not score magnitude.

The pattern is *rank-based ensemble* — combine multiple rankings without worrying about score normalisation. Same trick as Schulze voting, as rank-aggregation in benchmarks.

---

## How it works

Each retriever produces a ranked list. RRF assigns each item a score based on its rank in each list, then sums.

```
RRF score for item X = Σᵢ 1 / (k + rank_X_in_listᵢ)
                       
  where k is a constant (typically 60)
```

If item X ranks 1st in dense and 3rd in sparse:
```
score = 1/(60+1) + 1/(60+3) = 0.0164 + 0.0159 = 0.0323
```

The constant `k` damps the head — first place isn't infinitely better than 10th.

### For aipe

Not anchored to aipe directly. Loopd's B2A.10 uses RRF; if aipe's Phase 2B eval (B2B.6) demands hybrid, the same pattern transfers.

---

## Hybrid retrieval with RRF — diagram

```
Two ranked lists, one fused output

Dense top-5:                  Sparse top-5:               RRF-fused top-5:
1. doc_A   0.78               1. doc_B   8.2              1. doc_A   0.041
2. doc_C   0.71               2. doc_A   6.5              2. doc_B   0.033
3. doc_E   0.65               3. doc_D   5.1              3. doc_C   0.028
4. doc_B   0.62               4. doc_C   4.8              4. doc_D   0.027
5. doc_F   0.58               5. doc_E   3.9              5. doc_E   0.024

   score scales differ          rank used, not score        deduped + ranked
```

---

## In this codebase

**Not implemented.** No hybrid retrieval in aipe today. If/when Phase 2B's eval demands it, the loopd B2A.10 implementation transfers.

---

## Elaborate

### Where this pattern comes from

Cormack, Clarke & Buettcher (2009) introduced RRF for retrieval. It became a default for hybrid LLM retrieval around 2022.

### The deeper principle

Combining rankings via positional rank avoids score-scale problems entirely.

### Where this breaks down

When one retriever is much worse than the other, RRF still gives it half the influence. Weighting (`score = α·rank_dense + (1-α)·rank_sparse`) earns its place when retrievers are unequal.

### What to explore next

- [18-reranking-cross-encoder](18-reranking-cross-encoder.md) → next step after retrieval
- Cormack 2009 paper on RRF

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ RRF                       │ Score-weighted average      │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Implementation   │ One formula              │ Requires score normalisation│
│ Recall           │ Higher than either alone │ Higher than either alone    │
│ Hyperparams      │ Just k (often 60)        │ Per-retriever weights       │
│ Failure mode     │ Equal-weight ensemble    │ Mis-tuned weights skew      │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Nothing currently — aipe doesn't have hybrid retrieval yet.

### Sub-block 2 — what the alternative would have cost

Score-weighted average requires normalising scores across retrievers (dense in [0,1], BM25 unbounded) before combining. The normalisation tunable becomes its own bug surface.

### Sub-block 3 — the breakpoint

When one retriever consistently dominates the other in eval (say, dense wins 80% of cases), weight the dominant one higher and accept the per-retriever weights.

---

## Tech reference (industry pairing)

### Hybrid retrieval

- **Codebase uses:** none.
- **Leading today:** RRF (in tools like Vespa, Weaviate, Qdrant) — `adoption-leading`, 2026.
- **Runner-up:** ColBERT late-interaction — `innovation-leading` for token-level retrieval.

---

## Project exercises

Loopd's B2A.10 anchors RRF; aipe doesn't have a specific Build item.

---

## Summary

RRF combines ranked lists from independent retrievers using rank position only, avoiding score-normalisation problems. aipe doesn't use it yet; Phase 2B starts dense-only. The constraint: hybrid earns its place only when eval shows dense missing exact-phrase queries. The cost: extra index, slight latency.

- RRF = `Σ 1/(k + rank)`; k typically 60.
- Beats either dense or sparse alone for most workloads.
- aipe's Phase 2B starts dense-only; RRF transfers from loopd if needed.

---

## Interview defense

### Likely questions

**Q [mid]:** What does RRF stand for, and what does it compute?

**A:** Reciprocal Rank Fusion. Each item's score is the sum of `1/(k+rank)` across all retrievers; higher score = better. Uses rank position, not score magnitude, so the retrievers can have very different score scales.

**Q [senior]:** Why not just average dense and sparse scores?

**A:** Different scales. Dense scores are in `[0,1]`; BM25 scores are unbounded. Averaging skews toward whichever retriever has the bigger raw numbers. RRF dodges this by only using rank.

**Q [arch]:** When does weighted RRF earn its place?

**A:** When eval shows one retriever consistently better than the other — say, dense wins 80% of queries. Equal-weight RRF gives sparse too much influence. Weighted RRF (e.g., `α · 1/(k+rank_dense) + (1-α) · 1/(k+rank_sparse)`) lets you tune.

### The question candidates always dodge

**Q:** Why is `k` typically 60?

**A:** Empirical. The constant damps the head — `1/(60+1) = 0.016` vs `1/(60+10) = 0.014` — so first place isn't disproportionately better than 10th. Different `k` values trade head-vs-tail influence; 60 is the common starting point.

### One-line anchors

- RRF combines rankings via rank position, not score magnitude.
- Formula: `Σ 1/(k + rank)`, k ≈ 60.
- aipe doesn't use it yet; would adopt from loopd if eval demands.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw dense top-5, sparse top-5, RRF-fused top-5.

### Level 2 — Explain it out loud
Explain why RRF doesn't need score normalisation. Under 60 seconds.

### Level 3 — Apply it to a new scenario

You have dense top-3 [A, B, C] and sparse top-3 [B, D, A]. Compute the RRF scores for A, B, C, D.

### Level 4 — Defend the decision you'd change

"Would you ship aipe's Phase 2B with RRF from day one?"

### Quick check — code reference test
Without opening files:
- RRF formula? → `Σ 1/(k + rank)`
- Typical k? → 60
- aipe uses it today? → No
