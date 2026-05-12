# Embeddings (geometrically)

**Industry name(s):** Dense vector representations, learned embeddings, semantic vectors
**Type:** Industry standard

> Text becomes a fixed-length vector of floats; geometric closeness in vector space approximates semantic closeness — that's the whole trick.

**See also:** → [14-embedding-models](14-embedding-models.md) · → [16-chunking-strategies](16-chunking-strategies.md) · → [19-vector-databases](19-vector-databases.md)

---

## Why care

You've used full-text search and watched it miss results that are obviously about the same topic — "car" finds "car" but not "automobile." Lexical matching breaks on synonyms; semantic matching needs a way to measure meaning. Embeddings are that way: meaning becomes geometry, and similarity becomes a distance calculation.

The pattern is *represent meaning as position in a learned space*. Same shape as word2vec, image embeddings for vision search, audio embeddings for music recommendation. The trick is the space is learned from data, so semantically-related things end up near each other without anyone hand-encoding the relationships.

---

## How it works

A map of meaning where similar things live nearby.

### The geometric picture

An embedding model takes text in and emits a fixed-length vector (typically 384, 768, 1024, or 1536 dimensions). Each dimension is one coordinate in a learned high-dimensional space.

```
"car"        → [0.12, -0.34, 0.78, ...]   (1024 floats)
"automobile" → [0.13, -0.32, 0.77, ...]   (almost the same place)
"banana"     → [0.85, 0.21, -0.44, ...]   (far away)
```

Cosine similarity (or dot product on normalised vectors) measures how close two embeddings are. `cosine_similarity(car, automobile) ≈ 0.92`; `cosine_similarity(car, banana) ≈ 0.15`.

If you're coming from frontend, think of this like CSS coordinates — every text gets `(x, y, z, …)` and you can compute Euclidean distance between any two points. Higher dimensions, same idea.

### Why it works

The model was trained on text where related ideas appear in similar contexts (the distributional hypothesis: "you shall know a word by the company it keeps"). The training objective rewards the model for placing co-occurring words near each other in the space.

### What aipe doesn't do

aipe has no RAG. No embedding model, no vector store, no retrieval. Every `/aipe:<type>` invocation feeds the *full* context (`.aipe/project/context.md`, the template, the wrapper) to the host agent — there's no "find the most relevant chunk and feed that."

The curriculum's Phase 2B is the buildable target: an embedded `commands/index.md` that walks `.aipe/project/` and `~/.config/aipe/global/`, embeds chunks, retrieves top-k for each invocation. That's a Phase 2B deliverable, not shipped.

The full picture is below.

---

## Embeddings geometrically — diagram

```
Vector space (conceptual 2D projection of 1024D)

                 ▲
                 │
   automobile ●  │  ● car
                 │    ● vehicle
                 │
            ─────┼─────────────────────────▶
                 │
                 │              ● banana
                 │           ● mango
                 │              ● apple
                 ▼

  Cosine similarity:
     car ↔ automobile ≈ 0.92    (close)
     car ↔ banana     ≈ 0.15    (far)
     banana ↔ mango   ≈ 0.85    (close)
```

---

## In this codebase

**Not yet implemented.** aipe has no embeddings, no vector store, no retrieval. The current load model is "feed everything to the host agent."

```
Today (no RAG):
   /aipe:study  →  load .aipe/project/context.md (full file)
                    load specs/study.md (full template)
                    load commands/study.md (full wrapper)
                    → host agent gets ~135k tokens of input

Phase 2B target:
   /aipe:study  →  embed user intent
                    retrieve top-k chunks from .aipe/.index/
                    feed only those chunks (~10–20k tokens)
                    → host agent gets focused input
```

The Phase 2B curriculum items B2B.1, B2B.3, B2B.4 are the buildable targets.

---

## Elaborate

### Where this pattern comes from

Word embeddings started with word2vec (Mikolov, 2013) showing that learned vectors capture semantic relationships. Sentence and document embeddings followed via Universal Sentence Encoder, sentence-transformers, then OpenAI/Anthropic/Cohere/Google embedding APIs as production primitives (2022+).

### The deeper principle

Geometric similarity captures semantic similarity, provided the space is learned on text where that holds. The hypothesis is empirical — sometimes the geometry misleads, and that's why retrieval-eval matters.

### Where this breaks down

When the model wasn't trained on text like yours — e.g., a model trained on web text retrieving over medical records will misrank. Domain-specific embeddings exist (BGE for code, ClinicalBERT for medicine) and earn their place when the gap matters.

### What to explore next

- [14-embedding-models](14-embedding-models.md) → how to pick one
- [16-chunking-strategies](16-chunking-strategies.md) → what to embed
- [17-dense-vs-sparse](17-dense-vs-sparse.md) → when lexical search still wins

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Add embeddings (Phase 2B)│ No retrieval (today)         │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Input tokens     │ ~10–20k per call         │ ~135k per call               │
│ Latency          │ +embedding API call      │ Just generation              │
│ Cost / call      │ Reduced 5–10× via cache  │ Full input every time        │
│ Implementation   │ Indexer + retriever +    │ Zero — direct file load     │
│                  │ stale handler + eval     │                              │
│ Failure blast    │ Bad retrieval → wrong    │ Same input every time;       │
│                  │ context fed              │ predictable                  │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe's full-context load gets every byte of project context into the prompt. That's the cost (~135k tokens) AND the safety (nothing important is missed because of bad retrieval). For a small `.aipe/project/` directory, the trade favours full-load; for a large project context (curriculum + multiple stack files + rules), it'd start to favour retrieval.

### Sub-block 2 — what the alternative would have cost

A bad RAG implementation worse than no RAG. If retrieval misses the key context chunk, the model generates a spec against incomplete information and the user can't tell. The Phase 2B Build items include eval (B2B.6 precision@k on 10 representative intents) precisely to mitigate this.

### Sub-block 3 — the breakpoint

Fine until project context exceeds ~50k tokens. Today, typical `.aipe/project/` is well under 10k tokens; RAG isn't justified. As users with larger contexts emerge — multi-file context directories, large curricula, organisation-level shared context — RAG earns its place.

---

## Tech reference (industry pairing)

### Embedding models

- **Codebase uses:** none today.
- **Why it would be here (Phase 2B):** turn text into vectors for similarity search.
- **Leading today:** `text-embedding-3-large` (OpenAI), Cohere Embed v3 — `adoption-leading` for production RAG, 2026.
- **Why it leads:** strong quality, low cost, hosted API.
- **Runner-up:** BGE-large (open-source, sentence-transformers) — `innovation-leading` for self-hosted; matches hosted quality at lower per-call cost above ~1M calls/month.

---

## Project exercises

### [B2B.3] Retrieve-then-feed: every `/aipe:<type>` starts with retrieval

- **Exercise ID:** `[B2B.3]`
- **What to build:** Wrap every wrapper's Step 2 with a retrieval call that fetches the top-k most relevant chunks of `.aipe/project/` instead of loading all files. Embedding model: pick once (`text-embedding-3-small` is the recommended starting point). Top-k: 5 to start.
- **Why it earns its place:** demonstrates RAG-over-project-context — the Phase 2B anchor for aipe. The signal in interview is "you scaled to a 50k-token context without overflow."
- **Files to touch:** `commands/index.md` (new — the indexer slash command), each `commands/<type>.md` Step 2 (modified to call retrieval), `.aipe/.index/` (new directory, gitignored, stores embeddings).
- **Done when:** running `/aipe:feature` with a 50k-token `.aipe/project/` loads ~10k of retrieved chunks, the generated spec quality is within 5% of full-context baseline on 10 fixtures (B2B.6 eval), `commands/index.md` documented in README.
- **Estimated effort:** `1–2 days`.

### [B2B.4] Stale-index handling via file mtime

- **Exercise ID:** `[B2B.4]`
- **What to build:** Mark index entries stale when source file mtime > index entry's `embedded_at`. Re-embed on next idle invocation (or on demand).
- **Why it earns its place:** stale embeddings are the #1 RAG bug; making mtime the signal is cheaper than content hashing and catches the typical case.
- **Files to touch:** `.aipe/.index/manifest.json` (new — tracks per-file mtime + embedded_at), retrieval code in Step 2.
- **Done when:** editing `.aipe/project/context.md` and rerunning `/aipe:feature` produces a spec reflecting the edit (regression test).
- **Estimated effort:** `<1hr` after B2B.3.

---

## Summary

Embeddings represent meaning as position in a high-dimensional learned space; cosine similarity measures semantic closeness. aipe doesn't use them — current load model feeds full project context every call (~135k tokens). Phase 2B's Build items (B2B.1, B2B.3, B2B.4) introduce RAG: embed `.aipe/project/` chunks, retrieve top-k per invocation, feed only those. The constraint that drove deferring this: today's typical project context fits comfortably; RAG would be premature. The cost being paid: every `/aipe:<type>` call loads everything, even what's not relevant.

- Text → vector → cosine similarity → semantic closeness.
- aipe currently has no embeddings; loads full context every call.
- Phase 2B (B2B.1, B2B.3, B2B.4) is the buildable target.
- The breakpoint is project context > 50k tokens.

---

## Interview defense

### Likely questions

**Q [mid]:** What's an embedding, geometrically?

**A:** A fixed-length vector (typically 1024 floats) in a learned high-dimensional space. Texts with similar meanings end up at nearby points. Similarity is computed via cosine (or dot product on normalised vectors). The space is learned from training data — co-occurring words end up neighbours.

**Q [senior]:** Why doesn't aipe use embeddings today?

**A:** The typical `.aipe/project/` is under 10k tokens — well within the host's context window. RAG would be machinery without payoff. Phase 2B's Build items add it for users whose project context grows past ~50k tokens; until then, full-load is simpler and equally good.

**Q [arch]:** What changes when aipe adds RAG?

**A:** Step 2 of every wrapper becomes "embed query → retrieve top-k from .aipe/.index/ → feed those chunks instead of full files." The indexer (`commands/index.md`) maintains the index; mtime-based stale handling triggers re-embedding when source files change. Input tokens drop from ~135k to ~15k per call; latency adds the embedding round-trip but loses the larger generation latency. Eval (B2B.6) ensures retrieval quality.

### The question candidates always dodge

**Q:** Why hand-pick the embedding model instead of letting users configure it?

**A:** Because every additional choice point in a markdown plugin is friction. Pick one good default (`text-embedding-3-small`), document the choice, allow override via env var. Most users never override; power users have an escape.

### One-line anchors

- Embedding = fixed-length vector in learned space.
- Cosine similarity ≈ semantic similarity (provided training matched the domain).
- aipe doesn't have RAG today; Phase 2B is the buildable target.
- The breakpoint is project context > 50k tokens.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the 2D projection of embedding space with "car," "automobile," "banana" placed.

### Level 2 — Explain it out loud
Explain why aipe doesn't use RAG today and when it would. Under 90 seconds.

### Level 3 — Apply it to a new scenario

A user has `.aipe/project/` with 30 files totalling 80k tokens. Would you turn on Phase 2B for them? What would B2B.3 look like in their case?

### Level 4 — Defend the decision you'd change

"Would you ship Phase 2B with a default-on or default-off?"

### Quick check — code reference test
Without opening files:
- What's the dimensionality of a typical embedding? → 384, 768, 1024, or 1536
- What's the similarity metric? → cosine similarity
- Where would aipe's RAG land? → Phase 2B, `commands/index.md` + retrieval in Step 2
