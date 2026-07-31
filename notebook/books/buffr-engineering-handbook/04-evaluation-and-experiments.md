# Part IV — Evaluation and Experiments

## 7. Evaluation Framework

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

## 8. Experiment Log

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
