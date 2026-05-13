# Chapter 2A — RAG Over a Personal Corpus

**Phase 2A of the curriculum.** Primary project: loopd's retrieval surfaces. Reading time: 22 minutes.

> RAG is just a 1992-era information retrieval system with an LLM bolted onto the end. The IR part is what'll get you hired; the LLM part is what'll get you in the door.

## The framing

The reader has built loopd: an Android daily-vlog journal app. Hundreds, eventually thousands, of entries — text, tags, threads, todos. The user asks the app a natural-language question across their own journal ("what was I worried about last August?") and expects a coherent answer grounded in their actual entries.

That's RAG. Retrieve relevant entries. Stuff them into the LLM's context. Let the LLM synthesize an answer that cites the retrieved entries.

```
User question
  │
  ▼
┌──────────────────────────────────┐
│  Retrieve relevant entries       │ ← embed question, cosine search
└──────────────┬───────────────────┘ ← over personal corpus
               │
               │  top-k entries
               ▼
┌──────────────────────────────────┐
│  Stuff into LLM context           │ ← deliberate ordering
└──────────────┬───────────────────┘ ← (lost-in-the-middle awareness)
               │
               ▼
┌──────────────────────────────────┐
│  LLM generates the answer         │ ← cites retrieved entries
└──────────────┬───────────────────┘
               │
               ▼
        Grounded answer
```

The thing that breaks RAG in practice is almost never the LLM. It's the retrieval. **Bad retrieval → bad answers, even with a great model.** This chapter is mostly about retrieval.

---

## On loopd's principle #11

You wrote a principle into the loopd spec: *"No RAG. Hand-picked retrieval (sibling todos + last 3 days of entries, capped at 1000 chars each) feeds the expand chain. Embeddings + vector store would be overkill at this scale."*

That principle was right at the time. It's incomplete now.

The updated version is in `[B1.4]`:

> *"RAG above threshold. The expand chain stays hand-picked because its corpus is bounded by today. The interpret chain at week/month scope and the 'find related entries' feature on threads use embeddings + cosine search. The threshold is documented per-feature; default is no RAG until a feature provably needs it."*

That nuance is the difference between "RAG is the answer to everything" (junior) and "RAG is one tool, used where its costs are paid for by its benefits" (senior). Phase 2A makes that nuance concrete by implementing RAG only where the feature provably needs it — and documenting the threshold for every other feature so the next engineer can revisit the call.

---

## What an embedding actually is — `[C2.1]`

An embedding is a vector. Specifically, it's a fixed-length array of floats (typically 384 or 1536 or 3072 dimensions) that represents text in a way where **geometric proximity ≈ semantic similarity**.

```
"buy milk"          →  [0.12, -0.84, 0.33, ..., 0.07]
"purchase dairy"    →  [0.15, -0.79, 0.31, ..., 0.09]   ← close
"stock market"      →  [-0.42, 0.61, 0.18, ..., -0.23]  ← far

Geometric picture (2D projection):

         ↑
         │  • "stock market"
         │
         │           • "buy milk"
         │              • "purchase dairy"
         │
         └─────────────────────────────────→
```

The embedding model doesn't *understand* "milk." It learned, from billions of training examples, that text *about* milk tends to appear in similar contexts, so it places that text at a similar position in the vector space.

This is the same instinct as colors in RGB space. Red and pink are close in RGB; red and blue are far. Nobody told the RGB color model what "red" means. It just placed similar-looking colors at similar coordinates.

**Cosine similarity** is the operation: compute the cosine of the angle between two vectors. It's a number from -1 to 1. Two embeddings of similar meaning will have cosine ~0.7-0.9. Random pairs will hover around 0. The math is one numpy line; the intuition is the entire game.

---

## Embedding models — `[C2.2]`

You have to pick one. Picking is harder than people think.

```
Decision tree:

What's the use case?
  │
  ├── English, general purpose, hosted OK
  │   → text-embedding-3-small (OpenAI)
  │   → fast, cheap, good baseline
  │
  ├── Multilingual or domain-specific
  │   → Cohere embed-v3, BGE, multilingual MiniLM
  │
  ├── Privacy-critical, on-device
  │   → sentence-transformers (local)
  │   → smaller models, run on CPU
  │
  └── Code, technical text
      → text-embedding-3-large (OpenAI)
      → or specialized like Voyage code-2
```

Things to know:

- **Embedding model is a one-way decision.** Once you embed 50,000 entries with model X, switching to model Y means re-embedding all 50,000 entries. Plan accordingly.
- **Cost is low.** OpenAI's `text-embedding-3-small` is ~$0.02 per million tokens. Re-embedding 10k entries of journal text is pennies. Don't be afraid to redo it.
- **Dimensionality is a real choice.** 1536 dims is OpenAI's default. 3072 is the high-fidelity option (text-embedding-3-large). Higher dims = better similarity discrimination but linearly more storage and query compute. For loopd, 1536 is fine.

For loopd, the right default is `text-embedding-3-small` for v1. When you do `[B2A.1]` and pick the model, document *why* — the candidate who can explain the choice ("I picked the OpenAI hosted model for v1 because the journal is English-only, I need decent quality, and the cost at my scale is negligible; if I add an on-device requirement later I'll switch to sentence-transformers and re-embed") gets points.

---

## Chunking — `[C2.3]`, `[B2A.3]`

**Chunks are the unit of retrieval.** This is the single sentence that most candidates can't say. If your chunks are bad, your retrieval is bad, and there is nothing the LLM can do downstream to fix it.

Three approaches:

```
Fixed-size chunking
  Split every N tokens. Simple. Boundaries often land
  mid-sentence. Quality: variable.

Sentence-window chunking
  Split on sentence boundaries, group N sentences.
  Boundaries are clean. Quality: better for prose,
  worse for structured data like tables.

Structural chunking
  Split on document structure — markdown headings,
  code blocks, JSON nesting, log records. Quality:
  highest, but requires parsing the input format.
```

For loopd's journal entries, you have **natural chunk boundaries already**: one entry per row in the database. The entries are typically 50–500 words. They are pre-chunked by the user's act of writing them.

But you also have *threads* — sequences of entries connected by tag — and *todos* — sub-entries inside other entries. The chunking question is what counts as the indexable unit.

The right call for loopd: **one chunk per journal entry** is the v1 default. Threads get retrieved as a unit only when the query is about the thread itself. Todos get retrieved with their parent entry as context, never alone. If chunks-per-entry turns out to be too coarse later (long entries get under-retrieved), you split inside the entry on paragraph boundaries.

The interview rule: **never chunk by token count blindly.** That's the lazy answer. The senior answer is "I chunked at semantic boundaries that the data already provides, and I'd revisit only if retrieval recall measurably dropped below threshold."

---

## Vector stores — `[C2.7]`, `[B2A.2]`

The same question as "where do I store the embeddings."

```
┌──────────────────────┬─────────────────────────┐
│ Storage              │ When to use             │
├──────────────────────┼─────────────────────────┤
│ pgvector             │ Already on Postgres;    │
│  (Postgres extension)│ unifies relational +    │
│                      │ vector queries          │
├──────────────────────┼─────────────────────────┤
│ sqlite-vec           │ Local-first apps;       │
│  (SQLite extension)  │ no server needed        │
├──────────────────────┼─────────────────────────┤
│ Pinecone, Weaviate,  │ Massive scale;          │
│ Qdrant, Chroma       │ dedicated infra         │
├──────────────────────┼─────────────────────────┤
│ In-memory + JSON     │ <1000 chunks;           │
│                      │ prototype scale         │
└──────────────────────┴─────────────────────────┘
```

**For loopd, the answer is `sqlite-vec`.** Loopd is a local-first Android app. The journal lives on the device. The embedding index should also live on the device. Same SQLite database as the journal entries, one new virtual table for the vectors.

This is not a generic recommendation. It's the right call *because of loopd's constraints*. The interview move:

> *"I picked sqlite-vec for loopd because the journal is local-first — privacy is a feature — and adding a network round trip to a managed vector DB would break that. At loopd's scale (a few thousand entries per user) the SQLite extension is fast enough; the cosine search runs in tens of milliseconds. If I were building a multi-tenant SaaS, I'd reach for pgvector or Qdrant. The decision is shape-dependent, not best-in-class."*

That's the answer. Best-in-class doesn't exist for vector stores. Best-fitting-the-constraints does.

---

## Dense vs sparse retrieval — `[C2.4]` (IK Module 1)

Embeddings are **dense retrieval**. Every vector has a value at every dimension. Similarity is over the whole vector.

The classical alternative is **sparse retrieval** — BM25 being the canonical example. Tokens become a sparse representation (most term-frequency values are zero). Similarity is term overlap weighted by inverse document frequency.

```
Dense (embeddings):
  Query: "how do I fix the auth bug"
       │
       ▼ embed
       │
  [0.12, -0.84, 0.33, ..., dense vector]
       │
       ▼ cosine similarity
       │
  Top-k by semantic similarity

Sparse (BM25):
  Query: "how do I fix the auth bug"
       │
       ▼ tokenize
       │
  ["fix", "auth", "bug"]  ← stopwords filtered
       │
       ▼ term frequency × inverse doc frequency
       │
  Top-k by keyword overlap
```

When **dense** wins: paraphrases. "auth bug" finds "login broken." "I felt overwhelmed at work" finds "I was anxious about the deadline."

When **sparse** wins: exact terms. "CVE-2024-1234" matches itself. Rare words. Code identifiers. Proper nouns.

**Hybrid retrieval** combines them. Dense for semantic recall, sparse for precision on rare terms, fused with Reciprocal Rank Fusion (RRF):

```
Query → ┌─ Dense (cosine) ──→ [doc3, doc7, doc1]
        └─ Sparse (BM25) ──→ [doc7, doc2, doc5]

RRF: score(doc) = sum over rankings of 1 / (k + rank)
                  (k is a constant, usually 60)

Final ranking:
  doc7: appears in both lists, top-2 in both → highest
  doc3: dense rank 1, not in sparse
  doc2: sparse rank 2, not in dense
  ...
```

For loopd v1, **dense alone is fine**. The journal is short, the queries are paraphrase-style, and BM25 adds infrastructure complexity for a marginal recall gain. The build `[B2A.5]` introduces hybrid retrieval *as an explicit upgrade*, with a precision-recall comparison against dense-only on a labeled set. The point of the build is not to ship hybrid; it's to measure whether hybrid is worth shipping.

That measurement is the interview signal. "I tested hybrid retrieval and it improved recall by 8% on my eval set, but increased query latency by 40ms. Given loopd's UX (background batch jobs, not realtime), I shipped it. If this were a chat surface I might not have." Specific. Measured. Named the tradeoff.

---

## Reranking with a cross-encoder — `[C2.6]`

Two-stage retrieval is how real systems get good quality without paying full price.

```
Query
  │
  ▼
┌──────────────────────────────┐
│ Stage 1: Bi-encoder retrieve │  fast, top-50 candidates
│ (cosine similarity)          │
└──────────────┬───────────────┘
               │
               ▼  50 candidates
┌──────────────────────────────┐
│ Stage 2: Cross-encoder rerank│  slow, top-5
│ (full attention over pair)   │
└──────────────┬───────────────┘
               │
               ▼
          Top-5 ranked, ready for the LLM
```

A **bi-encoder** embeds the query and each doc separately; similarity is a dot product. Fast — you can run cosine over 100k docs in milliseconds. But coarse — the embedding has to summarize the whole doc and the whole query independently.

A **cross-encoder** takes the query and a doc together as a single input to a transformer, and outputs a relevance score. Slow — you can't precompute. But much more accurate — the model can attend to interactions between specific query terms and doc terms.

The trick: use bi-encoder to narrow from 100k → 50, then cross-encoder to polish 50 → 5.

For loopd, **`[B2A.6]` introduces reranking only after you measure that bi-encoder-alone retrieval is hitting a recall ceiling.** Don't add reranking on principle. Add it because you measured that the top-5 from cosine alone misses entries that the user would judge relevant.

The interview move: "I measured hit@5 on a 30-query labeled set. Bi-encoder alone hit 0.62; with cross-encoder rerank it hit 0.81. The rerank latency added 80ms but loopd's UX is background-batched so the latency is hidden. Tradeoff worth it." That sentence reuses an `[Bx.y]` build artifact and earns senior signal.

---

## Query rewriting and HyDE — `[C2.8]`, `[B2A.7]`

User queries are short and ambiguous. Documents are long and specific. The embedding spaces don't always align. **Query rewriting bridges the gap.**

```
Original query: "fix the auth thing"

Approach 1 — Query rewriting (LLM expands the query):
  LLM rewrites → "how to debug authentication token verification errors"
  Better recall: more retrievable terms.

Approach 2 — HyDE (Hypothetical Document Embeddings):
  LLM generates a hypothetical answer:
    "To debug auth, check the token signature against the JWT
     secret in the env file..."
  Embed *that* hypothetical document, retrieve docs similar to it.
```

HyDE is counterintuitive and effective. The user's query embedding is in "question space"; the docs are in "answer space." Mapping the query into answer space (by generating a plausible answer) puts it closer to the docs.

The tradeoff: extra LLM call per query. That's latency and cost. Worth it only when measured recall is poor. **`[B2A.7]`** is the test: try query rewriting on the 30-query eval set; measure precision@k before and after.

---

## Stale embeddings — `[C2.11]`

This is the bug that bites every RAG system in production. The trap is silent — no error, no exception, just wrong answers.

```
Day 1:
  text: "We use Sequelize ORM"
  embedding: e_v1

Day 30:
  text: "We use Drizzle ORM" (the user edited it!)
  embedding: still e_v1   ← out of sync!

Query "what ORM do we use?":
  retrieves the embedding → maps to old text "Sequelize"
  LLM answers "Sequelize"
  Wrong answer. Retrieval was technically successful.
```

The fix is straightforward in concept: track an `embedding_stale_at` per row. On text edit, mark stale. A background pass re-embeds stale rows on idle.

**`[B2A.4]`** ships exactly this for loopd. Every journal entry row gets:

```sql
embedding              BLOB,
embedding_model        TEXT,    -- which model produced this
embedding_version      INTEGER, -- the model's version
embedding_stale_at     INTEGER  -- timestamp if needs re-embed
```

On entry edit, the trigger marks `embedding_stale_at = unixepoch()`. A background job sweeps stale rows nightly and re-embeds them. The result is consistency between text and vectors.

The interview move: *"My RAG layer tracks staleness explicitly. Every edit invalidates the embedding; a nightly pass re-embeds stale rows. Without this, the bug pattern is silent — retrieval succeeds, but on outdated text — and you only catch it from user reports. I've debugged this bug at three companies; it's always cheaper to instrument up front."*

---

## RAG above threshold — `[B2A.8]`

The full pipeline for loopd's interpret chain at week/month scope:

```
User question (e.g., "summarize my August")
  │
  ▼
┌─────────────────────────────────────┐
│ Query rewrite                       │ ← optional, gated
│ "summarize entries about August      │
│  themes, mood, recurring topics"     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Hybrid retrieval                    │ ← dense + sparse, RRF
│ over journal entries with metadata  │
│ filter (date >= 2026-08-01)         │
└──────────────┬──────────────────────┘
               │
               │  ~50 candidates
               ▼
┌─────────────────────────────────────┐
│ Cross-encoder rerank                │ ← optional, gated by recall
│ Top-5 by relevance                  │
└──────────────┬──────────────────────┘
               │
               │  Top-5, ordered for context (most relevant first)
               ▼
┌─────────────────────────────────────┐
│ LLM synthesis (interpret chain)     │ ← prompt: "use these entries
│                                     │  as the only source of truth"
└──────────────┬──────────────────────┘
               │
               ▼
          Grounded answer with cited entries
```

Every box in this diagram has an explicit reason. Every reason has a measurement. That's the discipline.

---

## Eval as the gating mechanism — preview of Chapter 3

The single most underbuilt thing in junior RAG systems is the eval harness. You will not build an eval until you have something to evaluate; once you do, you can't tune anything responsibly without it.

`[B2A.10]`: build a 30-query labeled eval set for loopd. For each query, mark the 1–3 entries that the user would consider correct hits. Run your retrieval. Measure hit@5, MRR, and faithfulness of the generated answer.

This eval is what tells you whether your changes help. Chapter 3 goes deeper. For now: every change to your retrieval pipeline gets re-measured against this set. No measurement, no change.

---

## The Phase 2A deliverables

- [ ] `[B2A.1]` Embedding model chosen and documented (with reasoning).
- [ ] `[B2A.2]` sqlite-vec wired into loopd's data layer.
- [ ] `[B2A.3]` Per-entry chunking + indexing pipeline shipped.
- [ ] `[B2A.4]` Stale-embedding tracking + re-embedding background pass.
- [ ] `[B2A.5]` Hybrid retrieval (dense + sparse + RRF) implemented and measured.
- [ ] `[B2A.6]` Reranking via cross-encoder, gated on recall.
- [ ] `[B2A.7]` Query rewriting evaluated.
- [ ] `[B2A.8]` Full RAG pipeline ships behind the interpret chain at week/month scope.
- [ ] `[B2A.9]` Loopd principle #11 updated to "RAG above threshold."
- [ ] `[B2A.10]` 30-query labeled eval set with hit@5, MRR, faithfulness.

That's a real RAG implementation. Not a tutorial-grade one; the real thing.

---

## The Interview Move

> *"My personal RAG over loopd's journal uses hybrid retrieval — dense embeddings via sqlite-vec, BM25 via the FTS5 extension, fused with RRF — gated by a recall-based switch to cross-encoder reranking when bi-encoder hit@5 drops below 0.7. Stale embeddings are tracked per row and re-embedded by a nightly idle pass; without that, retrieval silently drifts from text. Every change to the pipeline is measured against a 30-query labeled eval set. The principle of 'no RAG below threshold' is documented per feature — the expand chain stays hand-picked because the corpus is today-bounded; the interpret chain at week/month scope is where RAG earns its place."*

That sentence pulls in `[C2.1]`, `[C2.4]`, `[C2.5]`, `[C2.6]`, `[C2.8]`, `[C2.11]`, and the loopd principle update. It also names a measured threshold and a rejected alternative. That's how a senior engineer answers "tell me about your RAG work" — by walking the system, naming each decision, and pointing at where it was measured.

Next chapter: same retrieval pattern, different shape — retrieval over your project context inside the aipe slash commands.
