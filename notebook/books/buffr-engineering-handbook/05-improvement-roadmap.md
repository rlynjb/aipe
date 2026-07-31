[← Contents](README.md)

# 05 · Improvement roadmap

The foundation is already stronger than a basic RAG chatbot: persistent personal memory, profile injection, tracing, connector support, retrieval evals, an explicit agent runtime.

The biggest opportunity now is **not adding more tools**. It's improving what happens *between* the user's question and the final answer.

---

## Contents

- [Highest-leverage improvements](#highest-leverage-improvements)
- [Bugs & risky behaviors worth reviewing](#bugs--risky-behaviors-worth-reviewing)
- [Recommended implementation order](#recommended-implementation-order)
- [Target architecture](#target-architecture)

---

## Highest-leverage improvements

### 1. Replace "always search everything" with intent-based routing

The current routing prompt requires a KB search for every question and often a web search too. That creates unnecessary evidence, latency, conflicting context, and potentially worse synthesis.

Different questions want different evidence:

- "What did I say about my career goals?" → personal KB only
- "What is NVIDIA's latest earnings result?" → web only, maybe personal KB secondarily
- "Based on my goals, should I study system design or DSA?" → personal KB first, then reasoning; web probably unnecessary
- "Summarize our conversation so far" → sequential conversation state, not vector retrieval

The prompt also says to synthesize **all** tool results, even irrelevant ones — which pressures the model to include weak material instead of ignoring it.

Introduce a deterministic or structured routing stage:

```text
User question
      │
      ▼
Query classifier
      │
      ├── personal_fact
      ├── personal_synthesis
      ├── current_external
      ├── product_research
      ├── conversation_reference
      └── general_reasoning
      │
      ▼
Route-specific retrieval policy
```

This is probably the single largest answer-quality improvement. It's also the durable version of [Tweak B](03-diagnosing-and-tweaks.md#tweak-b--wrong-tool-fires-first).

### 2. Add query rewriting before vector search

Today the model supplies one natural-language query directly to `search_knowledge_base`, which runs a single vector query. That's fragile for questions like:

> "What should I focus on next?"

A raw embedding search may match generic occurrences of "focus" or "next," while the real intent needs current projects, stated goals, unfinished work, recent decisions, and personal priorities.

Add a retrieval planner that produces 2–4 targeted searches:

```json
{
  "intent": "personal_synthesis",
  "queries": [
    "current active software projects and their status",
    "career and learning priorities",
    "unfinished tasks and next milestones",
    "recent decisions about buffr"
  ],
  "filters": [],
  "desiredEvidence": 8
}
```

Then merge and deduplicate the hits. This helps broad reflective questions far more than simply increasing `top_k`.

### 3. Upgrade from vector-only to hybrid retrieval

Vector-only works for semantic questions but misses exact ticker symbols, project names like `aptkit`, dates, medication names, filenames, uncommon technical terms, and quoted phrases.

Use a hybrid score:

```text
final_score =
  0.55 × vector_similarity
+ 0.30 × lexical/BM25_score
+ 0.10 × recency_score
+ 0.05 × source_priority
```

Then rerank the best 20–30 candidates down to ~6–10 final chunks:

```text
Vector search ─┐
               ├─ merge → deduplicate → rerank → context selection
Keyword search ┘
```

For a personal agent, exact matching matters nearly as much as semantic similarity.

### 4. Separate memory from durable knowledge

Conversation memories currently share the same vector store and surface through the same search as documents. Elegant, but it risks a feedback loop:

```text
User fact
  → answer generated from fact
  → Q+A stored as memory
  → generated answer retrieved later
  → generated answer treated like primary evidence
```

That gradually amplifies summaries, assumptions, and mistakes. Give sources explicit trust levels:

```text
Tier 1: direct user-authored records
Tier 2: structured application data
Tier 3: retrieved prior user messages
Tier 4: previous assistant answers
Tier 5: live external sources
```

For personal facts, prior assistant answers should not outrank the original user material. At minimum, tag with metadata:

```ts
type SourceAuthority =
  | 'user-authored'
  | 'structured-record'
  | 'user-message'
  | 'assistant-memory'
  | 'external';
```

Then use it during reranking and synthesis.

### 5. Add sequential conversation history

The source itself notes that in-prompt sequential turn history is still missing — each question is handled essentially independently. That hurts follow-ups:

- "Why?"
- "What about the second one?"
- "Compare that with my other project."
- "Can you elaborate?"
- "No, I meant the app."

Vector memory is not a substitute for immediate conversational continuity. A good context layout:

```text
Prompt context:
1. System and profile
2. Last 6–10 conversation turns
3. Rolling older-conversation summary
4. Retrieved long-term memories
5. Retrieved documents
```

Recent turns should be included **directly**, not retrieved semantically.

### 6. Improve chunking

The chunker uses fixed 512-character windows with 64-character overlap. That splits sentences, separates headings from content, breaks list semantics, makes chunks too small for coherent synthesis, and duplicates fragments without structure.

Move to structure-aware chunking:

```text
Markdown document
  → heading sections
  → paragraphs
  → sentence-aware packing
  → token-based size cap
```

Suggested defaults:

- target: 250–450 tokens
- maximum: 600 tokens
- overlap: one sentence, ~40–80 tokens
- prepend document title and heading path to embedded content

Example embedded chunk:

```text
Document: Career Roadmap
Section: Current priorities > Learning

I want to familiarize myself with system design and rebuild buffr...
```

Embedding the heading path often gives a sizable retrieval boost.

### 7. Return full evidence separately from citation snippets

The search result's `citation` truncates text to ~160 characters. The full text may still be in metadata, but relying on arbitrary metadata makes the contract unclear. Define an explicit shape:

```ts
type RetrievedPassage = {
  id: string;
  documentId: string;
  text: string;
  score: number;
  title?: string;
  section?: string;
  sourceType: SourceAuthority;
  createdAt?: string;
  updatedAt?: string;
  citationLabel: string;
};
```

Use `text` for synthesis and `citationLabel` only for attribution.

### 8. Introduce evidence compression

More retrieval isn't always better — passing eight overlapping chunks to a small local model can reduce answer quality. Build a compact evidence packet before generation:

```text
Claim 1: User is currently prioritizing buffr and system design.
Sources: roadmap.md § Mastery; journal 2026-07-28

Claim 2: User wants semi-passive products alongside full-time work.
Sources: career-goals.md; task 812

Conflict: One older entry prioritizes the vlog app.
Recency: buffr preference is newer.
```

Then let the final model answer from this normalized evidence rather than raw tool dumps. Especially useful with Gemma 2 and an 8,192-token ceiling.

### 9. Make answers claim-aware

Instead of a generic "cite sources" instruction, require the model to separate retrieved facts, inference, recommendation, and uncertainty:

```json
{
  "directAnswer": "...",
  "supportingClaims": [
    { "claim": "...", "sourceIds": ["..."], "confidence": 0.91 }
  ],
  "inferences": ["..."],
  "uncertainties": ["..."],
  "nextAction": "..."
}
```

Render it as natural prose in the TUI. The structured intermediate form makes unsupported claims easier to detect and evaluate.

### 10. Expand evals beyond retrieval precision

The current eval measures retrieval `P@1` and `R@3`. Useful, but they don't tell you whether the final answer is good. You need at least four layers:

```text
1. Routing      → Did the system choose the correct data sources?
2. Retrieval    → Did it retrieve the necessary evidence?
3. Grounding    → Is every factual claim supported?
4. Usefulness   → Did it directly answer, in the desired form?
```

Suggested metrics:

| Dimension | Example metric |
|-----------|----------------|
| Routing | correct-tool selection rate |
| Retrieval | Recall@5, MRR, nDCG |
| Grounding | supported-claim percentage |
| Completeness | required-fact coverage |
| Relevance | irrelevant-context rate |
| Personalization | correct use of relevant profile facts |
| Calibration | appropriate uncertainty |
| Style | directness, concision, readability |

Also build eval sets by question type:

```text
exact personal fact
multi-document synthesis
recent-vs-old conflict
follow-up reference
missing-information question
current external question
personal + external comparison
recommendation based on preferences
```

This is the natural extension of the weekly eval-growing habit in [04](04-weekly-cadence.md#add-one-new-eval-query-every-week).

---

## Bugs & risky behaviors worth reviewing

### Metadata filtering may be too permissive

The filter matcher treats a missing key as a match:

```ts
!(key in hit.meta) || hit.meta[key] === value
```

A result without the requested metadata field passes the filter. It should likely be:

```ts
key in hit.meta && hit.meta[key] === value
```

Otherwise asking for `kind: "memory"` still allows chunks with no `kind` field.

### A fixed `minScore: 0.65` may produce brittle recall

One global similarity threshold across journal entries, short task records, long documents, conversation memories, and exact project names will behave inconsistently. Tune per source type, or retrieve a broader candidate set and rerank. This is the deeper cause behind [Tweak A](03-diagnosing-and-tweaks.md#tweak-a--retrieval-misses).

### Tool-call limits can conflict with routing requirements

The agent is bounded to four tool calls, while the routing prompt can require personal search, web search, product-review retrieval, and synthesis across all results — leaving little room for reformulation or a second retrieval pass. A planned retrieval pipeline beats asking the model to improvise inside a hard call budget. Related knob: [Tweak C](03-diagnosing-and-tweaks.md#tweak-c--too-slow--too-many-tool-calls).

---

## Recommended implementation order

### Phase 1 — Immediate quality fixes

1. Add recent sequential conversation turns.
2. Fix exact metadata filtering.
3. Remove unconditional web and KB retrieval.
4. Add structured intent routing.
5. Split user-authored evidence from assistant-generated memory.

### Phase 2 — Retrieval quality

1. Add multi-query rewriting.
2. Implement hybrid lexical/vector retrieval.
3. Replace character chunking with structure-aware token chunking.
4. Add metadata-aware reranking.
5. Add temporal ranking and conflict detection.

### Phase 3 — Generation quality

1. Build an evidence packet.
2. Generate a structured claim map.
3. Validate claims against source IDs.
4. Render the structured result into the desired conversational style.
5. Add answer-level evals.

---

## Target architecture

```text
                       ┌────────────────────┐
User question ────────▶│ Conversation state │
                       └─────────┬──────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │ Intent + query plan │
                       └─────────┬──────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
 Personal retrieval       External retrieval     No retrieval
          │                      │                  reasoning
          ▼                      ▼                      │
 Hybrid candidates       Connector results             │
          │                      │                      │
          └──────────────┬───────┴──────────────────────┘
                         ▼
                 Authority-aware reranker
                         │
                         ▼
                Evidence normalization
                         │
                         ▼
                Claim-aware generation
                         │
                         ▼
                Grounding verification
                         │
                         ▼
                    Final response
```

The most important conceptual change, and the through-line from [01](01-mental-model.md#where-buffr-becomes-unique):

> **buffr should not be an agent that automatically searches and then talks. It should be a decision system that first determines what kind of evidence the question requires.**

That makes the app feel noticeably smarter even with the same local models.

---

← Prev: [04 · Weekly cadence](04-weekly-cadence.md) · [Contents](README.md) · Next: [06 · Reference](06-reference.md) →
