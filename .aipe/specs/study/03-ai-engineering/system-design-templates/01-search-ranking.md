# Search ranking system design

**Industry name(s):** Information retrieval system, learned ranking, IK Module: Search ranking
**Type:** Industry standard

> Design a search ranking system that takes a user query and returns the top-k most relevant items from a corpus.

**See also:** → [13-embeddings-geometric](../13-embeddings-geometric.md) · → [16-dense-vs-sparse-retrieval](../16-dense-vs-sparse-retrieval.md) · → [17-hybrid-retrieval-rrf](../17-hybrid-retrieval-rrf.md)

---

- **The prompt:** Design a search ranking system for a documentation site that takes a user query and returns the top 10 most relevant documents, supporting both exact-phrase and semantic queries.

- **Standard architecture:**

  ```
  ┌─ Query path ────────────────────────────────────────────────────────────┐
  │                                                                         │
  │   user query                                                            │
  │       │                                                                 │
  │       ▼                                                                 │
  │   query understanding (rewrite, expand, classify intent)                │
  │       │                                                                 │
  │       ▼                                                                 │
  │   retrieval (parallel)                                                  │
  │     ├── dense (embedding cosine)                                        │
  │     └── sparse (BM25)                                                   │
  │       │                                                                 │
  │       ▼                                                                 │
  │   fusion (RRF) → top-N candidates                                       │
  │       │                                                                 │
  │       ▼                                                                 │
  │   rerank (cross-encoder) → top-k                                        │
  │       │                                                                 │
  │       ▼                                                                 │
  │   return ranked list                                                    │
  │                                                                         │
  └────────────────────────────────────────────────────────────────────────-┘
  
  ┌─ Indexing path (offline) ───────────────────────────────────────────────┐
  │                                                                         │
  │   docs → chunk → embed → vector store                                   │
  │              │              │                                           │
  │              └─── tokens ──▶ BM25 index                                 │
  │                                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
  ```

- **Data model:**
  - `documents` — `{id, title, content, last_modified}`
  - `chunks` — `{doc_id, chunk_id, content, embedding[1024], embedded_at}`
  - `bm25_index` — token → posting list
  - `clicks` — `{query, clicked_doc, position, timestamp}` for downstream ranking
  - `eval_set` — `{query, expected_doc_ids}` for offline scoring

- **Key components:**
  - *Query understanding*: rewrite short queries into richer phrases (LLM-driven query expansion). Choice: `text-embedding-3-small` + LLM rewriter; balances cost and recall.
  - *Dense retrieval*: embed the rewritten query; top-50 via cosine over vector store. Choice: sqlite-vec for <1M docs; Qdrant beyond.
  - *Sparse retrieval*: BM25 over tokenized index; top-50. Catches exact-phrase matches embeddings miss.
  - *Fusion*: RRF (k=60) combines the two ranked lists into a single ordering without score-normalization issues.
  - *Reranker*: cross-encoder (ms-marco-MiniLM-L-6-v2) scores top-50 → top-10. Slower but precise.
  - *Eval harness*: golden set of (query, expected) pairs; nightly runs measure hit@10, MRR, NDCG.

- **Scale concerns:**
  - At ~10M docs: vector store latency rises; ANN index (HNSW or IVF) needed. Solution: switch from flat cosine to HNSW, accept ~95% recall.
  - At ~1k QPS: reranker becomes the bottleneck. Solution: pre-cache reranker scores for the head queries; only run rerank on tail queries.
  - At ~100k queries/day: query-understanding latency dominates. Solution: cache LLM-rewriter outputs by query hash; expire weekly.

- **Eval framing:**
  - Offline: hit@10, MRR, NDCG over the golden set; weekly.
  - Online: CTR@1, dwell time, abandonment rate; per release.
  - No-click is not a negative label (see [28-no-click-not-negative](../28-no-click-not-negative.md)); separate "user saw but didn't click" from "user didn't see at all" using session-replay or scroll depth.

- **Common failure modes:**
  - Stale embeddings on edited docs. Mitigation: mtime-based incremental re-embed (see [21-stale-embeddings](../21-stale-embeddings.md)).
  - Cold-start: new docs have no click signal. Mitigation: weight content-similarity higher until enough signal accumulates.
  - Ranking bias: top results get more clicks, training data overrepresents them. Mitigation: counterfactual / propensity-weighted training.
  - LLM-rewriter hallucinations: rewriter fabricates terms that mislead retrieval. Mitigation: constrain rewriter to expansion-only; eval rewriter fidelity.

- **Applies to this codebase:** `partially`. aipe doesn't have a search-ranking surface today — there's no query → ranked-docs flow. But aipe's Phase 2B target (RAG over project context) is structurally a small-scale search ranking system: query rewriting + dense retrieval + (optional) sparse + (optional) rerank. The pieces from the template apply 1-to-1, just at <100-chunk scale instead of 10M-doc scale.

- **How to make it apply:** Ship Phase 2B's full stack — B2B.1 (indexer), B2B.2 (embedding source), B2B.3 (retrieve-then-feed), B2B.5 (query rewriting), B2B.6 (precision@k eval). Once these are in, the `applies` verdict moves to `yes` and aipe becomes defensible as a small-scale search-ranking system. The deepening from there would be: add BM25 + RRF (transfer from loopd's B2A.10) if eval shows exact-phrase queries failing; add a cross-encoder rerank (B2A.11 pattern) if precision@1 is the bottleneck.
