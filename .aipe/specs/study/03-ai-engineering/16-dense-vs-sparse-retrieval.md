# Dense vs sparse retrieval

**Industry name(s):** Dense retrieval (embeddings), sparse retrieval (BM25, TF-IDF), lexical vs semantic search
**Type:** Industry standard

> Two ways to find similar text — by learned semantic vectors (dense) or by word-overlap statistics (sparse). Each finds things the other misses.

**See also:** → [13-embeddings-geometric](13-embeddings-geometric.md) · → [17-hybrid-retrieval-rrf](17-hybrid-retrieval-rrf.md)

---

## Why care

You've watched embedding-based search miss the exact phrase the user typed because the embedding "thought" a synonym was closer. Then you switched to keyword search and missed everything that wasn't an exact match. Each search method has blind spots; the fix is usually to combine them.

The pattern is *complementary retrieval modalities*. Same idea as combining recall and precision metrics — they measure different failures.

---

## How it works

Two retrievers asking different questions of the same corpus.

### Dense (embedding-based)

Embed the query, embed every chunk, return top-k by cosine similarity. Finds semantically similar even when wording differs.

### Sparse (BM25 / TF-IDF)

Score chunks by query-term frequency × inverse document frequency. Finds chunks with the literal query terms; misses synonyms.

### When each wins

- **Dense wins:** synonym matching, conceptual queries, paraphrased questions.
- **Sparse wins:** exact-phrase queries, named entities, jargon the embedding doesn't know.

If you're coming from frontend, dense is like "fuzzy search for meaning," sparse is like grep with smart ranking.

### For aipe

Phase 2B B2B.3 starts with dense-only retrieval (cheaper, easier). B2A.10 (loopd) adds BM25 alongside dense and uses [17-hybrid-retrieval-rrf](17-hybrid-retrieval-rrf.md) to combine. For aipe, the curriculum doesn't anchor a separate hybrid build — dense alone is the starting point.

---

## Dense vs sparse — diagram

```
Query: "how does aipe pick which model to use"

Dense retrieval                          Sparse (BM25) retrieval
───────────────                          ───────────────────────
embed query → cosine vs all chunks       tokenize query → score per chunk
                                          by TF-IDF
results:
  [provider-agnostic chains]   0.78      results:
  [host agent picks the model] 0.74        [Step 3 model loading]    8.2
  [tokenization]               0.62        [provider-agnostic chains] 6.1
                                            [the host agent picks]    5.4

   semantic match                          literal-token match
```

---

## In this codebase

**Not implemented.** Phase 2B starts with dense-only (B2B.3); BM25 augmentation isn't anchored for aipe specifically. If aipe's Phase 2B eval (B2B.6) shows dense missing exact-phrase queries, adding BM25 would be the natural next step.

---

## Elaborate

### Where this pattern comes from

BM25 (1994) was the standard for lexical search before dense embeddings. Dense retrieval (DPR, 2020) showed competitive quality with simpler infrastructure. The realisation that the two are complementary led to hybrid systems by ~2022.

### The deeper principle

Different metrics measure different failures; ensemble them.

### Where this breaks down

When the query is genuinely ambiguous — neither dense nor sparse finds the right chunk, because the right answer isn't in any chunk. Retrieval can't recover from missing source.

### What to explore next

- [17-hybrid-retrieval-rrf](17-hybrid-retrieval-rrf.md) → combining dense and sparse
- BM25 Wikipedia article — the canonical reference

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Dense only (start)       │ Hybrid dense + sparse       │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Setup            │ One model + vector store │ Same + BM25 index           │
│ Storage          │ Vectors only             │ Vectors + tokens            │
│ Recall (synonym) │ Higher                   │ Higher                      │
│ Recall (exact)   │ Lower                    │ Higher                      │
│ Latency          │ ~50ms / query            │ ~80ms / query (two indexes) │
│ Failure mode     │ Misses exact-phrase      │ Combiner mis-ranks          │
│                  │ queries                  │ occasionally                │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Dense-only misses exact-phrase queries. A user typing `/aipe:study` then asking "where does v1.26.0 add Project exercises?" might find the right chunk if the embedding captures "Project exercises"; might miss if "v1.26.0" is the load-bearing token (specific version strings are weakly embedded).

### Sub-block 2 — what the alternative would have cost

Hybrid adds a second index (BM25) and a combiner (RRF). For a small `.aipe/project/`, that's overkill.

### Sub-block 3 — the breakpoint

Fine until B2B.6 eval shows dense missing >10% of exact-phrase queries. At that point, B2A.10's hybrid pattern from loopd transfers.

---

## Tech reference (industry pairing)

### BM25 implementations

- **Codebase uses:** none today.
- **Leading today:** `bm25s` (Python), `rank-bm25` — `adoption-leading` for sparse retrieval, 2026.
- **Runner-up:** SPLADE — `innovation-leading` for learned sparse retrieval.

---

## Project exercises

No aipe-specific Build item beyond the inclusion in B2B.3. Hybrid retrieval is a loopd build (B2A.10) that aipe could absorb if eval demands.

---

## Summary

Dense and sparse retrieval find different things — dense for semantic, sparse for exact-token. aipe's Phase 2B starts dense-only (B2B.3); adding sparse is a follow-up if exact-phrase queries dominate the failure mode. The constraint: simpler is better at small corpus sizes. The cost being paid: occasional miss on exact-phrase queries.

- Dense = embedding similarity; finds synonyms.
- Sparse = BM25 / TF-IDF; finds exact tokens.
- aipe starts dense-only in Phase 2B.
- Breakpoint: B2B.6 eval shows exact-phrase miss > 10%.

---

## Interview defense

### Likely questions

**Q [mid]:** Difference between dense and sparse retrieval?

**A:** Dense uses embedding similarity (semantic); sparse uses word-overlap statistics (lexical). Dense finds synonyms; sparse finds exact tokens. They have different blind spots.

**Q [senior]:** Why start dense-only?

**A:** Simpler infrastructure (one index instead of two), faster ship for small corpora. Aipe's project context is small enough that dense alone covers the common case. BM25 earns its place when eval shows exact-phrase queries failing.

**Q [arch]:** When does hybrid earn its place for aipe?

**A:** When eval (B2B.6) shows >10% of representative queries failing on exact-phrase matches. At that point, RRF-combined dense + sparse is the standard fix.

### The question candidates always dodge

**Q:** Why use BM25 at all when dense is better at semantic matching?

**A:** Because dense isn't *always* better. Specific version strings, jargon, named entities — these are tokens, not semantics. BM25 ranks them correctly when dense ranks them randomly.

### One-line anchors

- Dense = semantic; sparse = lexical.
- Different failure modes; hybrid covers both.
- aipe starts dense-only; adds BM25 if eval demands.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw dense vs sparse with example results.

### Level 2 — Explain it out loud
Explain why each method has blind spots. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user asks "what's in v1.26.0?" — which method finds the right chunk?

### Level 4 — Defend the decision you'd change

"Would you ship hybrid retrieval from day one of Phase 2B?"

### Quick check — code reference test
Without opening files:
- BM25 family? → sparse
- Embedding similarity family? → dense
- aipe's Phase 2B starting point? → dense-only
