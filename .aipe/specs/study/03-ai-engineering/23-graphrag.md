# GraphRAG basics

**Industry name(s):** GraphRAG, knowledge-graph retrieval, structured RAG
**Type:** Industry standard

> Combine vector retrieval with explicit graph traversal — embeddings find similar nodes; edges traverse relationships embeddings can't.

**See also:** → [13-embeddings-geometric](13-embeddings-geometric.md) · → [16-dense-vs-sparse-retrieval](16-dense-vs-sparse-retrieval.md)

---

## Why care

You've watched a vector retriever miss "all things related to topic X" because the relations were graph edges, not text. Embeddings don't see "this entry is in thread #refactor"; a graph does.

The pattern is *use the right index for the right relationship*. Vector for similarity; graph for typed connections.

---

## How it works

Pre-built graph (entities + relations) plus vector index. Retrieval can walk edges.

```
user: "show me all entries tagged #refactor"
       │
       ▼
graph query: nodes where edge[tag]→ #refactor
       │
       ▼
nodes returned (no embedding needed)

user: "show me entries similar to X"
       │
       ▼
vector query: top-k by cosine to embedding(X)
       │
       ▼
nodes returned (no graph needed)
```

### For aipe

Not directly. Curriculum's C2.13 anchors to loopd's `#tag` thread system. Aipe's project context doesn't have explicit graph structure beyond markdown headings.

---

## GraphRAG basics — diagram

```
Vector retrieval + graph traversal

Vector index:                        Graph:
  embedding(doc)                       node ─edge── node
                                            tagged
Returns top-k by cosine              Returns connected nodes by edge type

Combined:                            
  query → vector retrieve → graph expand to neighbours
                                   → return enriched set
```

---

## In this codebase

**Not used.** aipe's project context is markdown without explicit graph edges. The only structure is `##` headings, which is hierarchy not graph. Loopd's `#tag` threads ARE a graph and use this pattern.

---

## Elaborate

### Where this pattern comes from

GraphRAG (Microsoft Research, 2024) combined LLM-generated knowledge graphs with vector retrieval. Earlier graph-DB tools (Neo4j) had similar shapes.

### The deeper principle

Different relationships need different indexes. Force everything into one and you'll miss what the wrong index can't see.

### Where this breaks down

When the corpus has no natural graph structure — markdown without typed links is similarity-only.

### What to explore next

- Microsoft's GraphRAG paper
- Neo4j vector index integration

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ GraphRAG                 │ Vector-only                  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Setup            │ Graph + vector indexes   │ Vector only                  │
│ Recall (typed)   │ Higher — edges traverse  │ Lower — embeddings miss     │
│   relations      │ what embeddings can't    │ typed relations             │
│ Implementation   │ Graph build + walker     │ Just vector store           │
│ Failure mode     │ Mistaken edges           │ Misses graph-only relations │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't have a graph, so no GraphRAG. The cost is missed relationships if aipe ever needed them.

### Sub-block 2 — what the alternative would have cost

Building a graph layer for project context (entities = files, edges = "references", "follows", etc.) would require document analysis and graph maintenance — overkill for current scale.

### Sub-block 3 — the breakpoint

If aipe's project context grows to include cross-document relationships (e.g., "this rule depends on that stack item"), graph structure earns its place.

---

## Tech reference (industry pairing)

### Graph-augmented retrieval

- **Codebase uses:** none.
- **Leading today:** Microsoft GraphRAG — `innovation-leading`, 2026.
- **Runner-up:** Neo4j + vector index — `adoption-leading` for production knowledge graphs.

---

## Project exercises

Loopd's B2A.8 (`related entries` via semantic + graph) anchors GraphRAG. No aipe-specific Build item.

---

## Summary

GraphRAG combines vector retrieval with explicit graph traversal — useful when relationships are typed connections that embeddings don't capture. aipe doesn't have a graph; loopd uses the pattern via `#tag` threads. The constraint: aipe's corpus has only hierarchical (heading) structure. The cost: missed cross-document relations if/when they emerge.

- Vector + graph; different indexes for different relationships.
- aipe doesn't use it; loopd does via tag threads.
- Breakpoint: cross-document typed relations emerge.

---

## Interview defense

### Likely questions

**Q [mid]:** What does GraphRAG add over vector RAG?

**A:** Explicit traversal of typed relationships. Embeddings find similar nodes; edges find "things tagged X," "things following Y." Embeddings can't replace edges for structured queries.

**Q [senior]:** Why doesn't aipe use GraphRAG?

**A:** aipe's project context is markdown without typed edges. The only structure is `##` headings (hierarchy, not graph). Loopd has `#tag` threads — actual graph edges — and uses GraphRAG there.

**Q [arch]:** When would aipe need a graph?

**A:** If project context grew to include cross-document typed references (rule A depends on stack item B). Today there's no such structure; introducing it would be ahead of demand.

### The question candidates always dodge

**Q:** Can you build a graph from markdown automatically?

**A:** Partially — LLMs can extract entities and edges, but the result is noisy. Hand-curated graphs are still the standard; automated graph extraction is a research topic, not a production pattern.

### One-line anchors

- Vector + graph; different indexes for different relationships.
- Loopd uses it (#tag threads); aipe doesn't.
- Breakpoint: typed cross-document relations.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw vector + graph retrieval.

### Level 2 — Explain it out loud
Why doesn't aipe have a graph? Under 60 seconds.

### Level 3 — Apply it to a new scenario

If aipe added "rule A depends on stack item B" as an explicit relation, would GraphRAG earn its place?

### Level 4 — Defend the decision you'd change

"Would you build a graph extractor for aipe's project context as a preprocessing step?"

### Quick check — code reference test
Without opening files:
- aipe uses GraphRAG? → No
- Loopd's graph structure? → `#tag` threads
- Breakpoint? → typed cross-document relations
