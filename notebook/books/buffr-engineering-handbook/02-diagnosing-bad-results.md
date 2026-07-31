# Part II — Diagnosing Bad Results

## 4. Capture the Failure

When an answer feels wrong, create a small failure record before changing code.

```markdown
### Failure case

- Date:
- Question:
- Expected behavior:
- Actual answer:
- Tools called:
- Retrieved sources:
- Latency:
- Input/output tokens:
- Prompt version:
- Failure category:
- Suspected cause:
```

Add the question to a backlog such as:

```text
eval/failures.md
```

The exact real-world question is valuable. Do not rewrite it into an easier benchmark.

---

## 5. Failure Decision Tree

Run through these checks in order.

---

### Step 1: Did Buffr understand the conversation?

Ask whether the question depends on the immediately preceding turns.

Examples:

- "Why?"
- "Compare it with the second one."
- "No, I meant my other app."
- "Can you expand that?"

If Buffr misunderstands the referent, the problem is likely **conversation state**, not retrieval.

#### Likely exercise

Add recent sequential conversation history directly to the prompt:

```text
1. System and profile
2. Last 6–10 turns
3. Rolling summary of older turns
4. Retrieved long-term memory
5. Retrieved documents
```

Vector memory should support long-term recall, but it should not replace recent turn history.

---

### Step 2: Was the correct route chosen?

Watch the spinner and trace which tools fired.

Common signals:

```text
searching knowledge base   → personal indexed information
searching the web          → current or external information
fetching RSS feed          → current feed content
fetching Amazon reviews    → product review evidence
```

Classify the expected route:

| Question type | Expected route |
|---|---|
| "What did I say about my career goals?" | Personal KB |
| "What is NVIDIA's latest earnings result?" | Live web |
| "Based on my goals, should I study DSA or system design?" | Personal KB + reasoning |
| "Summarize what we just discussed." | Recent conversation state |
| "What do reviews dislike about this product?" | Product reviews, possibly web |

#### Failure signals

- Personal question never searches personal records.
- Current-events question uses only old indexed notes.
- Simple reasoning question triggers every available connector.
- The model is instructed to synthesize irrelevant results merely because they were fetched.

#### Likely exercise: intent-based routing

Replace unconditional "always search everything" behavior with an explicit route:

```text
personal_fact
personal_synthesis
current_external
product_research
conversation_reference
general_reasoning
```

A structured routing result might look like:

```json
{
  "intent": "personal_synthesis",
  "needsPersonalKnowledge": true,
  "needsRecentConversation": true,
  "needsWeb": false,
  "needsProductReviews": false
}
```

Measure routing separately with a small labeled dataset.

---

### Step 3: Did retrieval find the needed evidence?

If the correct tool fired but the answer was wrong, inspect the retrieved chunks.

Ask:

- Was the correct document retrieved at all?
- Was it within the top results?
- Was the relevant sentence cut off?
- Did an assistant-generated memory outrank an original user record?
- Did an old entry outrank a newer one?
- Did the query contain vague words such as "it," "that," "next," or "focus"?

Run:

```bash
npm run eval
```

Example:

```text
query: "what did I write about coffee"
  P@1: 1.00
  R@3: 1.00

query: "my workout routine"
  P@1: 0.00
  R@3: 0.33
```

#### Reading the metrics

- **P@1:** Was the first result relevant?
- **R@3:** Did the expected relevant material appear within the first three results?

Initial target:

```text
P@1 ≥ 0.70
R@3 ≥ 0.80
```

Interpretation:

| Pattern | Likely issue |
|---|---|
| Low P@1 and low R@3 | Retrieval or indexing miss |
| Low P@1 and high R@3 | Ranking problem; correct evidence exists but is not first |
| High retrieval scores but bad answer | Synthesis, grounding, or prompt problem |
| Correct document but incomplete passage | Chunking/context problem |

Do not automatically lower the similarity threshold when R@3 is already high. That often adds more noise. Improve ranking or reranking instead.

---

### Step 4: Was enough context retrieved?

Some questions cannot be answered by one raw search query.

Example:

> What should I focus on next?

The system may need several searches:

```json
{
  "intent": "personal_synthesis",
  "queries": [
    "current active projects and status",
    "career and learning priorities",
    "unfinished tasks and next milestones",
    "recent decisions about Buffr"
  ],
  "desiredEvidence": 8
}
```

#### Likely exercise: query planning

Add a query-rewrite or retrieval-planning stage that:

1. resolves pronouns using recent conversation
2. expands broad questions into two to four focused searches
3. assigns optional metadata filters
4. merges and deduplicates the results
5. records the generated search plan in the trace

Evaluate whether multi-query retrieval improves real failure cases rather than enabling it for every question.

---

### Step 5: Was the evidence ranked correctly?

Vector similarity alone may struggle with:

- exact project names
- ticker symbols
- dates
- filenames
- uncommon technical terms
- quoted phrases
- names of medications or products

#### Likely exercise: hybrid retrieval

Combine semantic and lexical retrieval:

```text
Vector search ─┐
               ├─ merge → deduplicate → rerank → final context
Keyword/BM25 ──┘
```

A starting scoring experiment:

```text
final_score =
  0.55 × vector_similarity
+ 0.30 × lexical_score
+ 0.10 × recency_score
+ 0.05 × source_authority
```

Treat these weights as hypotheses, not truths. Test them against your eval set.

Useful ranking metrics:

- MRR
- Recall@5
- nDCG@5
- top-result accuracy

---

### Step 6: Was the retrieved chunk coherent?

Current fixed-size character chunking can split headings, sentences, lists, and related ideas.

#### Likely exercise: structure-aware chunking

Move from character slices toward:

```text
Markdown
  → heading sections
  → paragraphs
  → sentence-aware packing
  → token-size limit
```

Starting experiment:

```text
target: 250–450 tokens
maximum: 600 tokens
overlap: one sentence or 40–80 tokens
```

Prepend context to the embedded text:

```text
Document: Career Roadmap
Section: Current priorities > Learning

I want to familiarize myself with system design...
```

Create a chunking eval containing:

- headings followed by short paragraphs
- bullet lists
- long journal entries
- records with dates
- sections containing similar vocabulary but different meanings

---

### Step 7: Was the right source trusted?

Buffr stores durable records and conversation memory in related retrieval infrastructure. This can create a feedback loop:

```text
user fact
  → generated answer
  → answer stored as memory
  → generated answer retrieved later
  → generated answer treated as primary evidence
```

#### Likely exercise: source authority

Label sources explicitly:

```ts
type SourceAuthority =
  | 'user-authored'
  | 'structured-record'
  | 'user-message'
  | 'assistant-memory'
  | 'external';
```

Suggested trust order for personal facts:

```text
1. Direct user-authored record
2. Structured application record
3. Previous user message
4. Previous assistant answer
5. External source
```

This order may change for current public facts, where a reliable live source should outrank old personal notes.

Also add:

- created and updated timestamps
- source type
- document title
- section path
- whether the content is user-authored or generated

Test conflicts deliberately:

- old goal versus new goal
- user statement versus assistant summary
- outdated project status versus recent journal entry

---

### Step 8: Did the model receive clean evidence?

More chunks can make a small local model worse, especially when several chunks repeat or conflict.

#### Likely exercise: evidence normalization

Convert raw retrieval into an evidence packet:

```text
Claim 1: The user is currently prioritizing Buffr and system design.
Sources: roadmap.md § Mastery; journal 2026-07-28

Claim 2: The user wants semi-passive products alongside full-time work.
Sources: career-goals.md; task 812

Conflict: An older entry prioritizes the vlog app.
Resolution: The Buffr statement is more recent.
```

The final model should answer from this compact packet rather than from a large unstructured tool dump.

Measure:

- duplicate evidence rate
- irrelevant evidence rate
- context token count
- required-fact coverage
- answer quality before and after compression

---

### Step 9: Was the final answer grounded?

A correct retrieval can still produce an unsupported or overconfident answer.

#### Likely exercise: claim-aware generation

Use a structured intermediate result:

```json
{
  "directAnswer": "...",
  "supportingClaims": [
    {
      "claim": "...",
      "sourceIds": ["..."],
      "confidence": 0.91
    }
  ],
  "inferences": ["..."],
  "uncertainties": ["..."],
  "nextAction": "..."
}
```

Then render it into natural prose for the TUI.

Distinguish:

- retrieved fact
- inference
- recommendation
- uncertainty

Add a grounding check that flags claims without source IDs.
