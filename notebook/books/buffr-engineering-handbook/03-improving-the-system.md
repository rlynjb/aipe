# Part III — Improving the System

## 6. Controlled Tweaks

Change one variable at a time. Record the old value, new value, hypothesis, eval result, and decision.

---

### Tweak A: Similarity threshold

In `src/session.ts`, locate:

```typescript
createSearchKnowledgeBaseTool(pipeline, {
  minTopK: 4,
  minScore: 0.65,
});
```

Possible experiments:

```text
0.60 → greater recall, possibly more noise
0.65 → current baseline
0.70 → stricter results, possibly more misses
```

Run:

```bash
npm run build && npm run eval
```

Do not judge only by the mean. Check which query classes improved or regressed.

A single global threshold may not work equally well for journal entries, tasks, memories, and focused documents. A later exercise is to use source-specific thresholds or retrieve broadly and rerank.

---

### Tweak B: Metadata filter correctness

Review the filter behavior in the retrieval tool.

A filter should normally require the field to exist and equal the requested value:

```typescript
key in hit.meta && hit.meta[key] === value
```

A result missing the requested field should not silently pass an exact-match filter.

Add tests for:

- `kind: "memory"`
- source type
- document ID
- date or time range
- app/schema origin

---

### Tweak C: Intent routing

Avoid rules that require every question to search every source.

Instead, test a router against examples such as:

```json
[
  {
    "question": "What did I say about my career goals?",
    "expected": ["personal_kb"]
  },
  {
    "question": "What happened in the market today?",
    "expected": ["web"]
  },
  {
    "question": "Based on my goals, which book should I read next?",
    "expected": ["personal_kb", "reasoning"]
  },
  {
    "question": "What did you mean by the second point?",
    "expected": ["recent_conversation"]
  }
]
```

Track:

```text
correct route rate
unnecessary tool rate
missing tool rate
average tool calls
latency by route
```

---

### Tweak D: Tool-call and turn budgets

Current limits may resemble:

```typescript
maxToolCalls: 4,
maxTurns: 6,
```

Do not increase these automatically when answers are incomplete. First determine whether the model wasted calls because routing was unclear.

Experiments:

- fewer calls with deterministic routing
- more calls only for multi-source research
- route-specific budgets

Example:

```text
personal_fact:       1–2 tool calls
personal_synthesis:  2–4 tool calls
current_external:    1–3 tool calls
product_research:    2–4 tool calls
```

---

### Tweak E: Freshness and re-indexing

After editing notes:

```bash
npm run index -- path/to/updated-note.md
npm run eval
```

After DB changes:

```bash
npm run index:db
npm run eval
```

Confirm that upserts replace old versions rather than leaving stale duplicates.

Add a freshness test:

1. Index a fact with value A.
2. Change it to value B.
3. Re-index.
4. Query the fact.
5. Confirm that B outranks or replaces A.

---

### Tweak F: Search result contract

Return full synthesis text separately from the short citation label.

Example:

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

Use `text` for synthesis and `citationLabel` only for display.
