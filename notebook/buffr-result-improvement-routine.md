# Buffr Engineering Handbook

## Table of Contents

- [Introduction](#introduction)
  - [Core Principle](#core-principle)
- [Part I — Operating Buffr](#part-i-operating-buffr)
  - [1. One-Time Setup and Baseline](#1-one-time-setup-and-baseline)
  - [2. Daily Natural Use](#2-daily-natural-use)
  - [3. Weekly Review](#3-weekly-review)
- [Part II — Diagnosing Bad Results](#part-ii-diagnosing-bad-results)
  - [4. Capture the Failure](#4-capture-the-failure)
  - [5. Failure Decision Tree](#5-failure-decision-tree)
- [Part III — Improving the System](#part-iii-improving-the-system)
  - [6. Controlled Tweaks](#6-controlled-tweaks)
- [Part IV — Evaluation and Experiments](#part-iv-evaluation-and-experiments)
  - [7. Evaluation Framework](#7-evaluation-framework)
  - [8. Experiment Log](#8-experiment-log)
- [Part V — Improvement Roadmap](#part-v-improvement-roadmap)
  - [9. Monthly Improvement Sprint](#9-monthly-improvement-sprint)
  - [10. Prioritized Backlog](#10-prioritized-backlog)
  - [11. Symptom-to-Fix Cheat Sheet](#11-symptom-to-fix-cheat-sheet)
  - [12. Recommended Implementation Order](#12-recommended-implementation-order)
- [Part VI — AI Engineering Workflow](#part-vi-ai-engineering-workflow)
  - [The Continuous Improvement Loop](#the-continuous-improvement-loop)
  - [Failure Classification](#failure-classification)
  - [AI System Pipeline](#ai-system-pipeline)
  - [Engineering Principles](#engineering-principles)

---

## Introduction

A practical routine for improving Buffr through real use, diagnosis, controlled experiments, and evals.

The goal is not to change several parts of the system at once. The goal is to:

1. Use Buffr naturally.
2. Notice a specific failure.
3. Classify the failure.
4. Change one variable.
5. Measure whether the result improved.
6. Keep or revert the change.

---

## Core principle

> Do not improve Buffr by intuition alone. Turn every disappointing answer into a reproducible test case.

A good result depends on several separate stages:

```text
Question
  → conversation understanding
  → intent routing
  → query planning
  → retrieval
  → ranking
  → evidence selection
  → answer generation
  → grounding and presentation
```

A bad final answer does not automatically mean the model is bad. The failure may have happened earlier.

---

### Core Principle

---

## Part I — Operating Buffr

### 1. One-Time Setup and Baseline

Run:

```bash
npm run chat
```

Ask:

> What do you know about me?

A healthy setup should draw from your profile, indexed notes, and relevant stored data. If it says little or nothing, index a focused note:

```bash
npm run index -- path/to/your-notes.md
```

Then run:

```bash
npm run eval
```

Record your starting baseline:

```text
Date:
Commit:
Prompt version:
Embedding model:
Generation model:
Mean P@1:
Mean R@3:
Typical latency:
Typical input tokens:
Notes:
```

This gives you something to compare against after each experiment.

---

### 2. Daily Natural Use

### Goal

Use Buffr like a real tool and notice where the experience breaks.

Open chat and ask two or three real questions you genuinely have that day. Do not invent artificial tests during daily use.

Try to naturally include different question types over time:

- a direct personal fact
- a question connecting several personal records
- a follow-up question such as “Why?” or “What about the other one?”
- a current external question
- a recommendation based on your own goals or preferences

After each answer, ask:

> Was this accurate, useful, grounded, and appropriately personalized?

If yes, move on. If no, save the exact question and continue to Phase 2.

### Read the footer numbers

An answer may show:

```text
2.1s · 1,842 in · 312 out
```

Meaning:

```text
2.1s       total answer latency
1,842 in   tokens read by the model
312 out    tokens generated
```

Do not optimize these numbers in isolation. First learn your normal range.

Watch for changes such as:

- latency suddenly increasing
- input tokens growing without a better answer
- several tools firing for a simple question
- a very short answer despite strong available evidence
- a long answer containing irrelevant retrieved material

---

### 3. Weekly Review

Once a week, run three representative questions:

1. personal fact or habit
2. project or multi-document synthesis
3. current external question

Also run one follow-up question that depends on the previous turn.

For each answer, score:

```text
Route correct?            0 or 1
Needed evidence found?    0 or 1
Top evidence relevant?    0 or 1
Claims supported?         0 or 1
Answer complete?          0 or 1
Answer useful?            1–5
Latency acceptable?       0 or 1
```

Then run:

```bash
npm run eval
```

Compare results with the previous week.

### Add one real question to the eval set

Every week, add at least one real question from your usage:

```json
{
  "query": "your real question",
  "relevant": ["expected-document-id"]
}
```

Also label its type:

```json
{
  "query": "Based on my recent priorities, what should I build next?",
  "type": "personal_synthesis",
  "relevant": ["career-goals", "active-projects", "recent-journal"]
}
```

Over time, your eval suite should reflect how you genuinely use Buffr.

---

---

## Part II — Diagnosing Bad Results

### 4. Capture the Failure

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

### 5. Failure Decision Tree

Run through these checks in order.

### Step 1: Did Buffr understand the conversation?

Ask whether the question depends on the immediately preceding turns.

Examples:

- “Why?”
- “Compare it with the second one.”
- “No, I meant my other app.”
- “Can you expand that?”

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
| “What did I say about my career goals?” | Personal KB |
| “What is NVIDIA’s latest earnings result?” | Live web |
| “Based on my goals, should I study DSA or system design?” | Personal KB + reasoning |
| “Summarize what we just discussed.” | Recent conversation state |
| “What do reviews dislike about this product?” | Product reviews, possibly web |

#### Failure signals

- Personal question never searches personal records.
- Current-events question uses only old indexed notes.
- Simple reasoning question triggers every available connector.
- The model is instructed to synthesize irrelevant results merely because they were fetched.

#### Likely exercise: intent-based routing

Replace unconditional “always search everything” behavior with an explicit route:

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
- Did the query contain vague words such as “it,” “that,” “next,” or “focus”?

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

---

---

## Part III — Improving the System

### 6. Controlled Tweaks

Change one variable at a time. Record the old value, new value, hypothesis, eval result, and decision.

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

---

---

## Part IV — Evaluation and Experiments

### 7. Evaluation Framework

Retrieval metrics alone do not measure the complete product experience.

Use four eval layers.

### 1. Routing

Did Buffr choose the appropriate source and tools?

Metrics:

- correct-tool selection rate
- unnecessary-tool rate
- missed-tool rate
- tool-call count

### 2. Retrieval

Did Buffr find the necessary evidence?

Metrics:

- P@1
- Recall@3 or Recall@5
- MRR
- nDCG

### 3. Grounding

Did the final answer stay supported by the evidence?

Metrics:

- supported-claim percentage
- unsupported-claim count
- citation correctness
- conflict acknowledgment

### 4. Usefulness

Did Buffr answer the actual question well?

Metrics:

- directness
- completeness
- personalization
- calibration
- readability
- actionable next step when appropriate

### Recommended eval categories

```text
exact personal fact
multi-document synthesis
recent-versus-old conflict
follow-up reference
missing-information question
current external question
personal-plus-external comparison
recommendation based on preferences
exact-name or ticker lookup
stale-data replacement
assistant-memory versus user-source conflict
```

---

### 8. Experiment Log

Use this whenever you change behavior:

```markdown
### Experiment: [name]

- Date:
- Commit:
- Failure case:
- Hypothesis:
- Layer being changed:
- Single variable changed:
- Baseline metrics:
- New metrics:
- Qualitative result:
- Regressions:
- Decision: keep / revise / revert
- Follow-up:
```

Example:

```markdown
### Experiment: Lower retrieval threshold

- Failure case: workout routine not found
- Hypothesis: relevant chunks score between 0.60 and 0.65
- Variable: minScore 0.65 → 0.60
- Baseline: P@1 0.62, R@3 0.71
- New: P@1 0.58, R@3 0.83
- Result: recall improved but top-result quality dropped
- Decision: revert and test reranking instead
```

---

---

## Part V — Improvement Roadmap

### 9. Monthly Improvement Sprint

Choose only one system layer per sprint.

### Sprint options

#### Sprint 1: Conversation continuity

Build and test:

- recent turn injection
- rolling conversation summary
- pronoun and referent resolution
- follow-up eval cases

#### Sprint 2: Intent routing

Build and test:

- route schema
- labeled routing dataset
- route-specific tool access
- unnecessary-tool-call metric

#### Sprint 3: Query planning

Build and test:

- multi-query expansion
- query deduplication
- trace visibility
- broad synthesis questions

#### Sprint 4: Hybrid retrieval

Build and test:

- vector candidates
- lexical candidates
- merged ranking
- exact-term evals

#### Sprint 5: Structure-aware chunking

Build and test:

- Markdown heading parsing
- sentence-aware packing
- heading-path metadata
- re-index comparison

#### Sprint 6: Authority and freshness

Build and test:

- source authority metadata
- recency scoring
- conflict resolution
- generated-memory safeguards

#### Sprint 7: Evidence packets

Build and test:

- deduplication
- claim extraction
- conflict detection
- token reduction

#### Sprint 8: Claim-aware answers

Build and test:

- structured answer intermediate
- source IDs per claim
- uncertainty labels
- grounding validator

---

### 10. Prioritized Backlog

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

### 11. Symptom-to-Fix Cheat Sheet

| Symptom | First check | Likely cause | Best next exercise |
|---|---|---|---|
| Wrong personal answer | Did personal KB fire? | Routing or retrieval | Route test, then retrieval eval |
| Correct doc absent | R@3 or R@5 | Retrieval/indexing miss | Threshold, query rewrite, hybrid search |
| Correct doc present but not first | P@1 low, recall high | Ranking problem | Reranking, lexical/recency signals |
| Answer fails on “Why?” | Recent turns included? | Missing conversation state | Sequential history |
| Old fact beats new fact | Inspect timestamps | No freshness policy | Recency scoring and replacement test |
| Assistant summary beats user statement | Inspect source type | Authority problem | Source-authority ranking |
| Answer contains unrelated facts | Inspect tool calls/context | Over-routing or noisy retrieval | Intent routing, evidence compression |
| Good evidence, unsupported conclusion | Compare claims to sources | Generation/grounding problem | Claim-aware output and validator |
| Answer is slow | Tool trace and input tokens | Too many tools or repeated evidence | Route-specific budgets, deduplication |
| Exact name or ticker is missed | Lexical match | Vector-only weakness | Hybrid retrieval |
| Section meaning is broken | Inspect chunk boundaries | Fixed character chunking | Structure-aware chunking |
| New note is ignored | Confirm re-index and duplicates | Stale KB | Freshness/upsert test |

---

### 12. Recommended Implementation Order

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

---

---

## Part VI — AI Engineering Workflow

### The Continuous Improvement Loop

```text
          Build
            │
            ▼
     Use the system
            │
            ▼
    Find one bad answer
            │
            ▼
 Classify the failure
            │
            ├── Routing
            ├── Retrieval
            ├── Ranking
            ├── Memory
            ├── Tool selection
            ├── Generation
            └── Evaluation
            │
            ▼
 Form a hypothesis
            │
            ▼
 Change ONE thing
            │
            ▼
 Run evals
            │
            ▼
 Did it improve?
      │            │
     Yes          No
      │            │
      └──────┬─────┘
             ▼
       Keep learning
```

### Failure Classification

- Routing
- Query planning
- Retrieval
- Reranking
- Chunking
- Conversation memory
- Source authority
- Tool selection
- Evidence selection
- Generation
- Grounding
- Evaluation

### AI System Pipeline

```text
User Question
      │
      ▼
Intent Classification
      │
      ▼
Query Planning
      │
      ▼
Hybrid Retrieval
      │
      ▼
Reranking
      │
      ▼
Evidence Normalization
      │
      ▼
Generation
      │
      ▼
Grounding Verification
      │
      ▼
Final Answer
```

### Engineering Principles

- Build first, optimize second.
- Diagnose before changing code.
- Change one variable at a time.
- Measure improvements with evals.
- Prefer architecture improvements over prompt tweaks.
- Treat every subsystem as independently testable.
