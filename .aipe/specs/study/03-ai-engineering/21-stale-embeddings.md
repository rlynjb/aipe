# Stale embeddings

**Industry name(s):** Index staleness, embedding drift, cache invalidation for vectors
**Type:** Industry standard

> When the source document changes, the embedding is stale. Detect it, re-embed it, or your retrieval silently returns outdated content.

**See also:** → [22-incremental-indexing](22-incremental-indexing.md) · → [21-stale-embeddings](21-stale-embeddings.md)

---

## Why care

You've shipped a RAG system, edited the source documents, and watched retrieval return the *old* content because the embeddings weren't refreshed. Stale embeddings are silent — there's no error, just wrong answers.

The pattern is *cache invalidation, but for vectors*. Same shape as HTTP ETags, browser cache validators — detect changed source, refresh derived artifact.

---

## How it works

Track when each embedding was generated; flag stale when source changes.

### Detection strategies

- **File mtime.** Compare embedding's `embedded_at` to source file's mtime. If source > embedded_at → stale. Cheap, catches most cases.
- **Content hash.** Hash the source content; compare to hash stored with embedding. More expensive but catches `touch`-without-change.
- **Manual flag.** User runs `/aipe:index --rebuild`.

### For aipe (Phase 2B B2B.4)

mtime-based staleness — cheaper than hashing, sufficient for typical edits.

---

## Stale embeddings — diagram

```
mtime-based staleness check

source file: .aipe/project/context.md
  mtime: 2026-05-12 14:30

index entry: {file: ".aipe/project/context.md", embedded_at: 2026-05-10 09:00}

  index.embedded_at  < source.mtime  →  STALE
                                        re-embed on next run
```

---

## In this codebase

**Not yet implemented.** Phase 2B B2B.4 is the buildable target.

---

## Elaborate

### Where this pattern comes from

mtime-based invalidation is older than the web (Make uses it since 1976). Hash-based invalidation came with content-addressable systems (Git, IPFS). RAG-specific staleness handling is a 2023+ concern.

### The deeper principle

Derived artifacts go stale when source changes; detect and refresh.

### Where this breaks down

When mtime doesn't update (e.g., touching files via certain editors that preserve mtime). Hash-based detection fixes it but costs more.

### What to explore next

- [22-incremental-indexing](22-incremental-indexing.md) → the rebuild strategy

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ mtime check              │ Content hash                 │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Detection cost   │ stat() per file          │ stat() + read + hash         │
│ False negative   │ Touch-without-change     │ None                         │
│ Implementation   │ One field per index entry│ Hash field + content read    │
│ Failure mode     │ Misses content-pristine  │ Always detects               │
│                  │ but mtime-modified files │                              │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

mtime misses the "touch without change" case. Rare; fixable by manual `--rebuild` if it happens.

### Sub-block 2 — what the alternative would have cost

Content hashing adds an I/O read per file at index-time. For small files, milliseconds; aggregated, seconds. Worth it only if mtime drift is common.

### Sub-block 3 — the breakpoint

If multiple users report stale-but-mtime-clean indexes, swap to hash-based.

---

## Tech reference (industry pairing)

### Cache invalidation for embeddings

- **Codebase uses:** none today.
- **Leading today:** mtime + manual rebuild — `adoption-leading`, 2026.
- **Runner-up:** content-hash invalidation — `innovation-leading` for content-addressed systems.

---

## Project exercises

### [B2B.4] Stale-index handling via file mtime

Covered in [13-embeddings-geometric](13-embeddings-geometric.md) Project exercises section.

---

## Summary

Stale embeddings need detection; aipe Phase 2B uses mtime comparison (B2B.4). The constraint: cheap detection catches most cases. The cost: occasional miss on mtime-clean edits.

- mtime-based staleness for Phase 2B.
- Re-embed on stale + next invocation.
- Breakpoint: false-negative reports trigger hash-based migration.

---

## Interview defense

### Likely questions

**Q [mid]:** What makes an embedding stale?

**A:** Its source document changed since the embedding was generated. The embedding still represents the old content; retrieval returns outdated answers.

**Q [senior]:** Why mtime instead of hash?

**A:** mtime is one stat() call per file; hashing requires reading the whole file. For small project contexts, mtime is sufficient and ~100× cheaper.

**Q [arch]:** When would hash-based detection earn its place?

**A:** If users routinely edit files with editors that preserve mtime (e.g., some IDEs), mtime misses the staleness. Hash catches it. Adopt when complaints emerge.

### The question candidates always dodge

**Q:** Why not push-based invalidation (file watcher)?

**A:** A watcher runs continuously and keeps state — heavier than mtime-on-invocation. For a markdown plugin that runs on demand, pull-based is the right shape.

### One-line anchors

- Stale embedding = source changed since embedding generated.
- mtime detection is cheap; hash detection is more reliable.
- aipe Phase 2B uses mtime.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the mtime comparison check.

### Level 2 — Explain it out loud
Why doesn't aipe use a file watcher? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user edits `context.md` with an editor that preserves mtime. What happens?

### Level 4 — Defend the decision you'd change

"Would you switch to hash-based detection?"

### Quick check — code reference test
Without opening files:
- aipe's Phase 2B detection? → mtime
- Build item? → B2B.4
- False-negative case? → mtime-preserving edits
