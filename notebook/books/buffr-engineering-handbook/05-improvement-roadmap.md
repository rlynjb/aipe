# Part V — Improvement Roadmap

## 9. Monthly Improvement Sprint

Choose only one system layer per sprint.

---

### Sprint 1: Conversation continuity

Build and test:

- recent turn injection
- rolling conversation summary
- pronoun and referent resolution
- follow-up eval cases

### Sprint 2: Intent routing

Build and test:

- route schema
- labeled routing dataset
- route-specific tool access
- unnecessary-tool-call metric

### Sprint 3: Query planning

Build and test:

- multi-query expansion
- query deduplication
- trace visibility
- broad synthesis questions

### Sprint 4: Hybrid retrieval

Build and test:

- vector candidates
- lexical candidates
- merged ranking
- exact-term evals

### Sprint 5: Structure-aware chunking

Build and test:

- Markdown heading parsing
- sentence-aware packing
- heading-path metadata
- re-index comparison

### Sprint 6: Authority and freshness

Build and test:

- source authority metadata
- recency scoring
- conflict resolution
- generated-memory safeguards

### Sprint 7: Evidence packets

Build and test:

- deduplication
- claim extraction
- conflict detection
- token reduction

### Sprint 8: Claim-aware answers

Build and test:

- structured answer intermediate
- source IDs per claim
- uncertainty labels
- grounding validator

---

## 10. Prioritized Backlog

### Tier 1 — Highest leverage

- [ ] Add recent sequential conversation history.
- [ ] Fix exact metadata filtering.
- [ ] Replace unconditional retrieval with intent routing.
- [ ] Separate or down-rank assistant-generated memory.
- [ ] Add routing and final-answer evals.

### Tier 2 — Retrieval quality

- [ ] Add multi-query rewriting.
- [ ] Add hybrid lexical and vector retrieval.
- [ ] Add metadata-aware reranking.
- [ ] Add recency and source-authority signals.
- [ ] Replace character chunking with structure-aware token chunking.

### Tier 3 — Generation quality

- [ ] Normalize retrieval into an evidence packet.
- [ ] Generate a structured claim map.
- [ ] Verify factual claims against source IDs.
- [ ] Clearly label inference and uncertainty.
- [ ] Render the verified structure into conversational prose.

---

## 11. Symptom-to-Fix Cheat Sheet

| Symptom | First check | Likely cause | Best next exercise |
|---|---|---|---|
| Wrong personal answer | Did personal KB fire? | Routing or retrieval | Route test, then retrieval eval |
| Correct doc absent | R@3 or R@5 | Retrieval/indexing miss | Threshold, query rewrite, hybrid search |
| Correct doc present but not first | P@1 low, recall high | Ranking problem | Reranking, lexical/recency signals |
| Answer fails on "Why?" | Recent turns included? | Missing conversation state | Sequential history |
| Old fact beats new fact | Inspect timestamps | No freshness policy | Recency scoring and replacement test |
| Assistant summary beats user statement | Inspect source type | Authority problem | Source-authority ranking |
| Answer contains unrelated facts | Inspect tool calls/context | Over-routing or noisy retrieval | Intent routing, evidence compression |
| Good evidence, unsupported conclusion | Compare claims to sources | Generation/grounding problem | Claim-aware output and validator |
| Answer is slow | Tool trace and input tokens | Too many tools or repeated evidence | Route-specific budgets, deduplication |
| Exact name or ticker is missed | Lexical match | Vector-only weakness | Hybrid retrieval |
| Section meaning is broken | Inspect chunk boundaries | Fixed character chunking | Structure-aware chunking |
| New note is ignored | Confirm re-index and duplicates | Stale KB | Freshness/upsert test |

---

## 12. Recommended Implementation Order

Do not attempt all improvements simultaneously.

```text
1. Recent conversation history
2. Metadata filter correctness
3. Intent-based routing
4. Source authority and memory separation
5. Multi-query retrieval planning
6. Hybrid retrieval and reranking
7. Structure-aware chunking
8. Evidence normalization
9. Claim-aware generation
10. Full routing + retrieval + grounding + usefulness evals
```

The desired end state is:

```text
                       ┌────────────────────┐
User question ────────▶│ Conversation state │
                       └─────────┬──────────┘
                                 ▼
                       ┌────────────────────┐
                       │ Intent + query plan │
                       └─────────┬──────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
 Personal retrieval       External retrieval      No retrieval
          │                      │                  reasoning
          ▼                      ▼                      │
 Hybrid candidates       Connector results             │
          └──────────────┬───────┴──────────────────────┘
                         ▼
                Authority-aware reranker
                         ▼
                Evidence normalization
                         ▼
                 Claim-aware generation
                         ▼
                 Grounding verification
                         ▼
                    Final response
```

> Buffr should not merely search and then talk. It should determine what evidence the question requires, retrieve the best evidence, and make clear what is known, inferred, or uncertain.
