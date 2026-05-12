# Reranking with a cross-encoder

**Industry name(s):** Cross-encoder reranker, reranking model, two-stage retrieval
**Type:** Industry standard

> First-stage retrieval is fast and recall-focused; a second-stage cross-encoder rescores the top-N with quadratic but accurate attention over the query-document pair.

**See also:** → [16-dense-vs-sparse-retrieval](16-dense-vs-sparse-retrieval.md) · → [17-hybrid-retrieval-rrf](17-hybrid-retrieval-rrf.md)

---

## Why care

You've watched a dense retriever return 10 plausible documents, only the 4th of which is actually relevant. The fix is to rerank with a model that looks at the query and each candidate together — slower but precise.

The pattern is *retrieve cheap, rank expensive*. Same shape as L1/L2 cache hierarchies — fast filter, slow scorer for the survivors.

---

## How it works

Two stages.

### Stage 1 — Retrieval

Embedding similarity or BM25. Returns top-N (say, 25) candidates. Fast.

### Stage 2 — Cross-encoder rerank

A model that takes `(query, document)` together as input and outputs a relevance score. Quadratic in `N × len(doc)`, so only feasible on small candidate sets.

```
retriever returns 25 candidates
       │
       ▼
cross-encoder scores each (query, doc_i) pair
       │
       ▼
return top-5 by cross-encoder score
```

### For aipe

Not anchored. Loopd's B2A.11 says: "Cross-encoder rerank on 'related entries'; measure hit@5; if no improvement, skip in 2B." The default for aipe is to skip reranking until eval shows it's needed.

---

## Reranking — diagram

```
Two-stage retrieval

stage 1: fast retrieval         stage 2: precise rerank
─────────────────────           ───────────────────────
embed query                      cross-encoder reads
       │                          (query, doc) together
       ▼                                │
top-25 by cosine                        ▼
       │                          rerank 25 → top-5
       ▼
[25 candidates, mixed quality]   [5 candidates, high quality]
```

---

## In this codebase

**Not used.** Phase 2B B2B.3 starts without reranking. If eval shows precision@k < target, B2A.11's reranking pattern transfers.

---

## Elaborate

### Where this pattern comes from

Two-stage retrieval is from classical IR (the BM25 + LambdaMART stack). The cross-encoder reranker variant became dominant after BERT-rerankers (Nogueira & Cho 2019) and sentence-transformers (2020).

### The deeper principle

Spend compute where it matters. Fast retrieval gets recall; slow reranking gets precision.

### Where this breaks down

When the first stage misses the right answer entirely — reranking can't recover from missing candidates. Recall has to be solid before precision can help.

### What to explore next

- [16-dense-vs-sparse-retrieval](16-dense-vs-sparse-retrieval.md) → first-stage retrieval
- ms-marco-MiniLM-L-6-v2 — the canonical cross-encoder reranker

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ With reranking           │ Without                     │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Latency          │ +50–200 ms per query     │ Just first-stage            │
│ Precision        │ Higher                   │ Lower                       │
│ Recall           │ Same                     │ Same                        │
│ Implementation   │ Cross-encoder model load │ Just first-stage            │
│ Failure mode     │ Doesn't recover from     │ Retrieval errors propagate  │
│                  │ missing first-stage hit  │                             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe skips reranking; the cost is lower precision on top-k. Acceptable when the user gets to look at 5+ chunks and pick the right one mentally.

### Sub-block 2 — what the alternative would have cost

Reranking adds a second model dependency (cross-encoder, ~250 MB) and ~100ms latency per query. For small corpora, not worth it.

### Sub-block 3 — the breakpoint

When B2B.6 eval shows precision@1 < 50%. At that point, reranking probably earns its place.

---

## Tech reference (industry pairing)

### Cross-encoder rerankers

- **Codebase uses:** none.
- **Leading today:** `ms-marco-MiniLM-L-6-v2` — `adoption-leading` for open-source rerankers, 2026.
- **Runner-up:** Cohere Rerank API — `innovation-leading` for hosted rerankers; better quality at higher cost.

---

## Project exercises

Loopd's B2A.11 (skippable). No aipe-specific Build item.

---

## Summary

Two-stage retrieval: first stage retrieves N candidates fast; second stage reranks with a cross-encoder. aipe doesn't use it; Phase 2B starts without and adds only if eval demands. The constraint: extra latency + model dependency only earn their place at scale.

- Retrieval = fast recall; reranking = slow precision.
- aipe defaults to no reranking.
- Breakpoint: precision@1 < 50%.

---

## Interview defense

### Likely questions

**Q [mid]:** Why a separate reranker?

**A:** First-stage retrieval is fast but coarse (compares query embedding to document embedding independently). Cross-encoder rerankers look at `(query, doc)` together, computing pairwise attention; much more accurate but quadratic in candidates × length.

**Q [senior]:** Why doesn't aipe start with reranking?

**A:** Extra latency and a second model dependency without proven payoff. Phase 2B's eval (B2B.6) measures whether first-stage alone is good enough; reranking earns its place if precision is the bottleneck.

**Q [arch]:** When does reranking earn its place at scale?

**A:** When the corpus grows large enough that first-stage retrieval returns many low-quality candidates. The threshold is around 100k+ documents; for aipe's per-project context (~50 chunks), it's overkill.

### The question candidates always dodge

**Q:** Why not always rerank?

**A:** Latency and complexity. Reranking adds 50-200ms per query and a second model dependency. For small corpora, the precision gain is marginal; for large ones, it's load-bearing.

### One-line anchors

- Two-stage: fast retrieval + slow rerank.
- Cross-encoder reads `(query, doc)` together; quadratic but accurate.
- aipe skips reranking by default.
- Breakpoint: precision@1 below target.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the two-stage retrieval flow.

### Level 2 — Explain it out loud
Why is reranking quadratic in candidates × length? Under 60 seconds.

### Level 3 — Apply it to a new scenario

aipe's corpus is 30 chunks. Does reranking earn its place? When would it?

### Level 4 — Defend the decision you'd change

"Would you adopt Cohere Rerank API for aipe's Phase 2B?"

### Quick check — code reference test
Without opening files:
- Cross-encoder input shape? → `(query, document)` together
- aipe uses reranking today? → No
- Breakpoint? → precision@1 < target on eval
