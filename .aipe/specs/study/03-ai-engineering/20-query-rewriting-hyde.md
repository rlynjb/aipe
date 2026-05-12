# Query rewriting and HyDE

**Industry name(s):** Query rewriting, HyDE (Hypothetical Document Embeddings), query expansion
**Type:** Industry standard

> The user's query is short ("add dark mode"); the documents are long. Rewrite the query into something more like a document before retrieving.

**See also:** → [13-embeddings-geometric](13-embeddings-geometric.md) · → [15-chunking-strategies](15-chunking-strategies.md)

---

## Why care

You've watched a retriever miss the right chunk because the user's 3-word query had nothing in common with the 500-word document's vocabulary. Query rewriting closes the lexical/embedding gap.

The pattern is *transform the query to match the document distribution*. Like search-engine query expansion in the 2000s, but with LLMs producing the expansion.

---

## How it works

Two approaches.

### Query rewriting

LLM expands the user's intent into a richer query. Sometimes a single phrase; sometimes a list of variants.

```
user: "add dark mode toggle"
LLM rewrites: "implement a user-preference setting that switches the
              application's CSS color scheme between light and dark
              variants, persisting the choice across sessions"
```

### HyDE (Hypothetical Document Embeddings)

LLM generates a hypothetical answer document, then embeds *that* (not the query). Retrieves documents similar to the hypothetical.

```
user: "what does aipe's UPDATE mode do?"
LLM imagines a doc: "aipe's UPDATE mode runs two diffs..."
embed the hypothetical → retrieve real documents similar to it
```

### For aipe (Phase 2B B2B.5)

The curriculum names B2B.5: "Query rewriting: expand `/aipe:feature <intent>` into richer retrieval query." Aipe's user typically types short intents; expansion is the natural fit.

HyDE is harder (one extra LLM call) and not anchored to aipe.

---

## Query rewriting and HyDE — diagram

```
User query → rewrite → retrieve

User: "add dark mode toggle"
       │
       ▼
   LLM rewrite
       │
       ▼
"user-preference setting that switches CSS color scheme between
 light and dark variants, persisting choice across sessions"
       │
       ▼
   embed (richer)
       │
       ▼
   retrieve top-k chunks
```

---

## In this codebase

**Not yet implemented.** Phase 2B B2B.5 is the buildable target — wrap user `$ARGUMENTS` with an expansion step before passing to retrieval.

---

## Elaborate

### Where this pattern comes from

Query expansion is a classical IR technique. HyDE (Gao et al., 2022) is the LLM-era variant — generate a hypothetical document with an LLM, retrieve real documents similar to it.

### The deeper principle

Queries and documents live in different distributions; transform one to match the other.

### Where this breaks down

When the LLM expansion hallucinates terms that don't appear in any document — retrieval gets misled by the expansion's fabrications.

### What to explore next

- HyDE paper (Gao et al., 2022)
- LangChain `RetrievalQA` with `query_rewriter`

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Query rewriting          │ Use raw query               │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ LLM calls / query│ +1                       │ 0                           │
│ Recall           │ Higher                   │ Lower for short queries     │
│ Latency          │ +1 LLM round-trip        │ Just retrieval              │
│ Cost / query     │ +$0.001                  │ Just embedding cost         │
│ Failure mode     │ Bad rewrite misleads     │ Short queries miss content  │
│                  │ retrieval                │                             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Phase 2B starts without rewriting; short queries may miss content. The cost is one extra LLM call per command if/when rewriting is added.

### Sub-block 2 — what the alternative would have cost

Always-rewrite adds latency and cost on every command. For longer user intents (sentence-length), the value is small.

### Sub-block 3 — the breakpoint

When eval shows retrieval recall < 80% on short queries. B2B.5 adds rewriting at that point.

---

## Tech reference (industry pairing)

### Query rewriting

- **Codebase uses:** none today; Phase 2B B2B.5.
- **Leading today:** custom LLM-rewriter prompts — `adoption-leading`, 2026.
- **Runner-up:** HyDE — `innovation-leading` for retrieval-heavy systems.

---

## Project exercises

### [B2B.5] Query rewriting

- **Exercise ID:** `[B2B.5]`
- **What to build:** Wrap user `$ARGUMENTS` with an LLM-rewrite step before retrieval. Output: an expanded query that's longer and more concrete.
- **Why it earns its place:** short user intents under-retrieve.
- **Files to touch:** `commands/<type>.md` Step 2 (or wherever retrieval lands).
- **Done when:** B2B.6 eval shows recall@5 improvement of ≥5% over baseline.
- **Estimated effort:** `1–4hr`.

---

## Summary

Query rewriting expands a short user intent into a richer query before retrieval. HyDE goes further — LLM generates a hypothetical answer and retrieves similar real documents. aipe's Phase 2B B2B.5 adds rewriting; HyDE isn't anchored. The constraint: short user intents under-retrieve. The cost: extra LLM call per command.

- Rewriting adds an LLM call before retrieval.
- HyDE: embed a hypothetical document, not the query.
- aipe's Phase 2B B2B.5 adds rewriting.
- Breakpoint: recall@5 < 80% on short queries.

---

## Interview defense

### Likely questions

**Q [mid]:** What's the difference between query rewriting and HyDE?

**A:** Rewriting expands the query into a richer phrase. HyDE generates a hypothetical answer document and embeds that — retrieves documents similar to the hypothetical. HyDE is more expensive (full document generation) but can outperform on hard queries.

**Q [senior]:** Why does aipe need query rewriting?

**A:** User intents are typically 2–5 words. Document chunks are 100+ tokens. The vocabulary gap means retrieval misses content the user actually wanted. Rewriting closes the gap.

**Q [arch]:** When does HyDE earn its place over rewriting?

**A:** When the queries are genuinely hard — questions whose answers are written very differently from how they're asked. For aipe's case (intent → spec generation), rewriting is enough.

### The question candidates always dodge

**Q:** Won't query rewriting introduce hallucinations into retrieval?

**A:** Yes — the rewriter can fabricate terms. Mitigation: constrain the rewriter to expand on the user's terms, not invent new ones; eval the rewriter's output for fidelity.

### One-line anchors

- Short queries under-retrieve; expand them.
- Rewriting expands; HyDE imagines and embeds.
- aipe Phase 2B B2B.5 adds rewriting.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the rewrite-then-retrieve flow.

### Level 2 — Explain it out loud
Why don't short queries retrieve well? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user types `/aipe:feature add login`. What might a rewriter expand this to?

### Level 4 — Defend the decision you'd change

"Would you start with HyDE instead of rewriting?"

### Quick check — code reference test
Without opening files:
- aipe's Phase 2B rewriting Build item? → B2B.5
- HyDE input to embed? → hypothetical document
- Breakpoint? → recall@5 < 80%
