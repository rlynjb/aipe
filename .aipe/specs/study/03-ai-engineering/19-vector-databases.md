# Vector databases

**Industry name(s):** Vector store, vector DB, ANN (approximate nearest neighbour) index
**Type:** Industry standard

> Where embeddings live. The choice is between in-memory JSON (small), SQLite extensions (medium), dedicated vector DBs (large).

**See also:** → [13-embeddings-geometric](13-embeddings-geometric.md) · → [15-chunking-strategies](15-chunking-strategies.md)

---

## Why care

You've stored embeddings in a list, computed cosine vs every entry on every query, and watched it become unusable past ~10k vectors. Vector DBs make nearest-neighbour search fast at scale.

The pattern is *specialised data store for high-dim vectors*. Same shape as time-series DBs, graph DBs — generic storage works at small scale; specialised storage earns its place at large scale.

---

## How it works

Three tiers by corpus size.

### Tier 1 — in-memory JSON (small, < 10k vectors)

Read a `.jsonl` of `{id, embedding, metadata}` into memory. Cosine over all rows. Simple, dependency-free.

### Tier 2 — SQLite extensions (medium, 10k–1M vectors)

`sqlite-vec` extension. Stores vectors as BLOB; supports cosine via custom SQL function. No separate process. Fits embedded scenarios.

### Tier 3 — dedicated vector DB (large, 1M+ vectors)

Pinecone, Qdrant, Weaviate, Vespa. ANN index (HNSW, IVF). Sub-millisecond search at scale.

### For aipe (Phase 2B)

aipe's project context is typically < 100 chunks. Tier 1 (in-memory `.aipe/.index/embeddings.jsonl`) is enough. Loopd's B2A.1 picks `sqlite-vec` for the personal-corpus case (~10k entries). Aipe doesn't need to scale beyond Tier 1.

---

## Vector databases — diagram

```
Tier choice by corpus size

  < 10k vectors      10k – 1M           1M+
       │               │                  │
       ▼               ▼                  ▼
   ┌─────────┐    ┌─────────┐       ┌─────────────┐
   │ JSONL   │    │ sqlite- │       │ Pinecone /  │
   │ in-mem  │    │ vec     │       │ Qdrant /    │
   └─────────┘    └─────────┘       │ Weaviate    │
   simple, no     embedded,         └─────────────┘
   deps           one process       distributed, ANN
   
   aipe Phase 2B   loopd Phase 2A   not in scope
```

---

## In this codebase

**Not yet implemented.** Phase 2B uses Tier 1 (`.aipe/.index/embeddings.jsonl`). Loopd uses Tier 2 (`sqlite-vec`).

---

## Elaborate

### Where this pattern comes from

ANN indexes for vectors (HNSW, IVF) come from 2010s research. Pinecone (2021) productised hosted vector DBs; sqlite-vec (2023) brought embedded vector search to SQLite.

### The deeper principle

Match storage to scale; don't over-engineer for hypothetical growth.

### Where this breaks down

When project context grows past Tier 1 capacity (~10k chunks). Migration to Tier 2 is a one-time effort; Tier 3 is unrealistic for aipe.

### What to explore next

- sqlite-vec docs
- Pinecone vs Qdrant vs Weaviate comparison

---

## Tradeoffs

```
┌──────────────────┬─────────────┬─────────────┬─────────────────┐
│ Dimension        │ JSONL       │ sqlite-vec  │ Hosted DB       │
├──────────────────┼─────────────┼─────────────┼─────────────────┤
│ Setup            │ Zero        │ One ext     │ Account + auth  │
│ Capacity         │ < 10k       │ ~1M         │ Unlimited       │
│ Query latency    │ ms – s      │ μs – ms     │ ms (network)    │
│ Cost             │ $0          │ $0          │ $0.10+/mo       │
│ Failure mode     │ Memory OOM  │ Disk I/O    │ Network outage  │
└──────────────────┴─────────────┴─────────────┴─────────────────┘
```

### Sub-block 1 — what we gave up

Tier 1 doesn't scale past a few thousand vectors. For aipe's typical use case, fine.

### Sub-block 2 — what the alternative would have cost

Hosted vector DB adds account setup, network dependency, monthly cost. Overkill for ~50 chunks.

### Sub-block 3 — the breakpoint

Tier 1 → Tier 2 at ~5k chunks. Tier 2 → Tier 3 at ~1M chunks (aipe will never reach this).

---

## Tech reference (industry pairing)

### Vector storage

- **Codebase uses:** none today; Phase 2B uses Tier 1 (JSONL).
- **Leading today:** sqlite-vec — `adoption-leading` for embedded vector search, 2026.
- **Why it leads:** zero-ops, one extension load, full SQL access alongside vectors.
- **Runner-up:** Qdrant — `innovation-leading` for hosted/self-hosted vector DBs; better at 1M+ scale.

---

## Project exercises

Loopd's B2A.1 picks sqlite-vec. For aipe, JSONL is the Phase 2B default.

---

## Summary

Vector DBs scale by corpus size: JSONL for small, sqlite-vec for medium, hosted DBs for large. aipe's Phase 2B uses JSONL (~50 chunks); loopd uses sqlite-vec (~10k). The constraint: match storage to scale. The cost: Tier 1 doesn't scale past ~10k.

- Three tiers by scale.
- aipe Phase 2B uses Tier 1; loopd uses Tier 2.
- Breakpoint Tier 1 → 2: ~5k chunks.

---

## Interview defense

### Likely questions

**Q [mid]:** What does a vector DB do that an array can't?

**A:** ANN index. Plain array requires O(n) cosine; ANN index returns top-k in O(log n) using structures like HNSW.

**Q [senior]:** Why JSONL for aipe instead of sqlite-vec?

**A:** Project context is ~50 chunks. Linear cosine over 50 vectors is < 1ms. The overhead of loading sqlite-vec extension exceeds the search time at this scale. Tier 1 is the right fit.

**Q [arch]:** When does aipe need to migrate to Tier 2?

**A:** At ~5k chunks. A user with a very large `.aipe/project/` (multiple deep curriculum files, large stack docs, extensive rules) could approach this. Migration is a one-time port; sqlite-vec API is similar enough that the indexer's `commands/index.md` would only need its storage layer swapped.

### The question candidates always dodge

**Q:** Why not just use Pinecone from day one?

**A:** Cost and complexity. Pinecone needs an account, an API key, network access. For ~50 chunks, the right tier is in-memory JSON.

### One-line anchors

- JSONL (small), sqlite-vec (medium), Pinecone/Qdrant/etc. (large).
- aipe lives in Tier 1; loopd in Tier 2.
- ANN index earns its place past ~10k vectors.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the three tiers with scale thresholds.

### Level 2 — Explain it out loud
Explain why aipe doesn't use Pinecone. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user has 8k chunks in their `.aipe/project/`. Which tier? Why?

### Level 4 — Defend the decision you'd change

"Would you ship aipe with sqlite-vec as the default to skip the future migration?"

### Quick check — code reference test
Without opening files:
- aipe's tier? → Tier 1 (JSONL)
- Threshold for Tier 2? → ~5k chunks
- Common ANN index? → HNSW
