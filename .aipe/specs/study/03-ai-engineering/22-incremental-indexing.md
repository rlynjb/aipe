# Incremental indexing

**Industry name(s):** Incremental indexing, partial reindex, delta indexing
**Type:** Industry standard

> Don't re-embed everything when one file changes — embed only the changed sections.

**See also:** → [21-stale-embeddings](21-stale-embeddings.md) · → [15-chunking-strategies](15-chunking-strategies.md)

---

## Why care

You've watched a "rebuild index" command run for 30 minutes because every embedding got regenerated even though only one file changed. Full rebuilds don't scale.

The pattern is *only do the work that changed*. Same shape as `make`'s dependency tracking, bundler incremental rebuilds, Git's content-addressed store.

---

## How it works

For each chunk: check if source is stale (mtime > embedded_at); re-embed only stale chunks.

```
for chunk in index:
  if chunk.source.mtime > chunk.embedded_at:
    chunk.embedding = embed(chunk.content)
    chunk.embedded_at = now()
  else:
    skip
```

### For aipe (Phase 2B B2B.4)

Combined with mtime staleness. The `/aipe:index` command walks all files, checks mtime, re-embeds stale chunks.

---

## Incremental indexing — diagram

```
Full rebuild vs incremental

Full rebuild:                          Incremental:
all 50 chunks                           50 chunks, 2 stale
       │                                       │
       ▼                                       ▼
embed each (50 × $0.0001 = $0.005)      check mtime × 50
                                                │
                                                ▼
                                        re-embed only stale 2
                                        (2 × $0.0001 = $0.0002)
                                                │
                                        25× cheaper
```

---

## In this codebase

**Not yet implemented.** Phase 2B B2B.4 enables it.

---

## Elaborate

### Where this pattern comes from

Incremental build systems date to Make (1976). Applied to embeddings around 2023 as RAG matured.

### The deeper principle

Skip the work you don't need. Track what's stale; refresh only that.

### Where this breaks down

When the staleness signal is wrong (false negatives = stale data persists). Fix: combine mtime with manual rebuild option.

### What to explore next

- [21-stale-embeddings](21-stale-embeddings.md) → the staleness primitive

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Incremental              │ Full rebuild on every run    │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Per-invoke cost  │ Re-embed stale chunks    │ Re-embed everything          │
│                  │ only                     │                              │
│ Implementation   │ Manifest tracks per-chunk│ Just embed all on run        │
│                  │ embedded_at              │                              │
│ Run time         │ ~100ms typical           │ ~30s for 50 chunks           │
│ Failure mode     │ Stale signal misses edit │ None — always fresh          │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Manifest tracking adds a small file (`.aipe/.index/manifest.json` with per-chunk metadata).

### Sub-block 2 — what the alternative would have cost

Full rebuild on every invocation: ~30s for 50 chunks at API rates. Multiply by every `/aipe:<type>` call → unusable.

### Sub-block 3 — the breakpoint

Always incremental at any scale. The breakpoint is "is the staleness signal reliable?" — answered by B2B.4's mtime approach.

---

## Tech reference (industry pairing)

### Incremental indexing strategies

- **Codebase uses:** none today.
- **Leading today:** per-chunk manifest + mtime check — `adoption-leading`, 2026.
- **Runner-up:** content-addressed storage (Git-like) — `innovation-leading` for content-versioned indexes.

---

## Project exercises

Combined with B2B.4 staleness handling — see [13-embeddings-geometric](13-embeddings-geometric.md) and [21-stale-embeddings](21-stale-embeddings.md).

---

## Summary

Incremental indexing re-embeds only changed chunks. aipe Phase 2B uses mtime + per-chunk manifest. The constraint: full rebuilds are unaffordable at any scale. The cost: manifest file maintenance.

- Per-chunk `embedded_at` field; skip if not stale.
- Combined with mtime staleness from B2B.4.
- ~100ms typical run vs ~30s full rebuild.

---

## Interview defense

### Likely questions

**Q [mid]:** Why not just re-embed everything?

**A:** Cost and time. For 50 chunks at API rates, full rebuild is ~30s and ~$0.005. For 5000 chunks, it's minutes and dollars per invocation. Incremental is essentially free per call.

**Q [senior]:** How does aipe's incremental indexing detect what changed?

**A:** mtime comparison. The index manifest stores `embedded_at` per chunk; the indexer compares to source file mtime; stale chunks get re-embedded; fresh chunks are skipped.

**Q [arch]:** What scales worst about full rebuild?

**A:** Linear in corpus size. For a hypothetical 50k-chunk corpus, full rebuild is hours. Incremental is sub-second regardless of corpus size — assuming the staleness check is fast (mtime stat() is O(1) per file).

### The question candidates always dodge

**Q:** Why not chunk-level deltas (re-embed only changed sections within a file)?

**A:** That's the natural granularity already — chunks ARE sections of files. When one file's section changes, only that chunk's embedding is stale.

### One-line anchors

- Re-embed only changed chunks.
- mtime-based detection from B2B.4.
- Per-chunk `embedded_at` in manifest.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw incremental vs full rebuild.

### Level 2 — Explain it out loud
Why is incremental indexing mandatory at scale? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user edits one `##` section in `context.md`. What gets re-embedded?

### Level 4 — Defend the decision you'd change

"Would you ship aipe with content-hash invalidation from day one?"

### Quick check — code reference test
Without opening files:
- aipe's manifest location? → `.aipe/.index/manifest.json`
- Staleness signal? → mtime > embedded_at
- Build item? → B2B.4
