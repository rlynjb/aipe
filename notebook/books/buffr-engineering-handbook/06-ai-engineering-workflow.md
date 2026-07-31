# Part VI — AI Engineering Workflow

## The Continuous Improvement Loop

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

---

## Failure Classification

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

---

## AI System Pipeline

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

---

## Engineering Principles

- Build first, optimize second.
- Diagnose before changing code.
- Change one variable at a time.
- Measure improvements with evals.
- Prefer architecture improvements over prompt tweaks.
- Treat every subsystem as independently testable.
