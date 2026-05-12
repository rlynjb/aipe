# Eval methods

**Industry name(s):** Exact match, fuzzy match, rubric, LLM-as-judge, pairwise eval
**Type:** Industry standard

> How you score outputs. Pick the cheapest method that catches the failure mode you care about.

**See also:** → [24-eval-set-types](24-eval-set-types.md) · → [26-llm-judge-bias](26-llm-judge-bias.md)

---

## Why care

You've used exact-string match to grade LLM outputs and watched it fail every case because the model phrased the answer slightly differently. Or you've used LLM-as-judge and watched it grade everything 7/10. Pick the right grader for the output type.

The pattern is *match the grader to the failure mode*. Same shape as test assertions — `===` for primitives, `toMatchObject` for shape, snapshot for serialised state.

---

## How it works

Five common methods.

### Exact match

`output == expected`. Works for deterministic JSON, code identifiers, file paths. Fails for prose.

### Fuzzy match (BLEU, edit distance)

Score similarity between output and expected. Works for short structured prose. Imperfect for long-form.

### Rubric / criteria

Hand-write criteria ("does the answer reference the codebase?"). Score each criterion. Time-consuming but specific.

### LLM-as-judge

Ask an LLM to score the output. Cheap, scales, but has biases (see [26-llm-judge-bias](26-llm-judge-bias.md)).

### Pairwise

Show LLM two outputs (A vs B); ask which is better. Eliminates the "everything's 7/10" pull of single-scoring.

### For aipe

Phase 2B B2B.6 uses precision@k (a kind of exact-match-on-chunk-id). B3.7 anchors pairwise (with-RAG vs without-RAG) — loopd, but aipe-relevant for the retrieval eval.

---

## Eval methods — diagram

```
Method choice by output type

Output type             Method
───────────             ──────
JSON, IDs               exact match
Short prose             fuzzy / BLEU / edit distance
Long prose / specs      rubric or LLM-judge
A vs B preference       pairwise
Retrieval               precision@k / hit@k / MRR
```

---

## In this codebase

**Not yet implemented.** Phase 2B B2B.6 uses precision@k. B3.7 (pairwise with-RAG vs without-RAG) anchors loopd but applies to aipe's RAG eval.

---

## Elaborate

### Where this pattern comes from

Each method is older than LLMs: exact match from compiler tests, BLEU from MT (2002), rubric from human grading, pairwise from psychology experiments. LLM-as-judge crystallised around 2023 as LLMs got good enough to grade.

### The deeper principle

The grader is part of the eval. Choose it deliberately; mismatched graders give bad signals.

### Where this breaks down

When the grader has biases that align with one output style. LLM-as-judge has known biases (position, verbosity); single-score LLM eval anchors at "7/10" for everything.

### What to explore next

- [26-llm-judge-bias](26-llm-judge-bias.md)
- BLEU paper (Papineni et al., 2002)

---

## Tradeoffs

```
┌──────────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Method           │ Cost        │ Quality     │ Scale       │ Bias risk   │
├──────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Exact match      │ $0          │ Perfect ID  │ Unlimited   │ None        │
│ Fuzzy            │ $0          │ Approx      │ Unlimited   │ Vocabulary  │
│ Rubric           │ Human-hours │ High        │ Slow        │ Author      │
│ LLM-judge        │ $0.001/case │ Medium      │ Unlimited   │ Position,   │
│                  │             │             │             │ verbosity   │
│ Pairwise         │ $0.001/case │ Higher than │ Unlimited   │ Less than   │
│                  │             │ single LLM  │             │ single LLM  │
└──────────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Sub-block 1 — what we gave up

aipe Phase 2B uses precision@k (exact ID match on chunk). For broader quality eval, pairwise LLM-judge would be needed (B3.7).

### Sub-block 2 — what the alternative would have cost

Rubric evals require hand-curating criteria per spec type — for 11 spec types, 11 rubrics. Heavy maintenance.

### Sub-block 3 — the breakpoint

When precision@k passes but specs still feel wrong, broader eval (pairwise or rubric) earns its place.

---

## Tech reference (industry pairing)

### Eval frameworks

- **Codebase uses:** none.
- **Leading today:** custom evals + LLM-as-judge — `adoption-leading`, 2026.
- **Runner-up:** Promptfoo, Langfuse evals — `innovation-leading` for productised eval.

---

## Project exercises

B2B.6 (precision@k) for aipe Phase 2B. B3.7 (pairwise with-RAG vs without-RAG) anchored to loopd, applies conceptually.

---

## Summary

Five eval methods — exact, fuzzy, rubric, LLM-judge, pairwise — pick by output type and failure mode. aipe Phase 2B uses precision@k for retrieval. The constraint: cheapest valuable method first. The cost: only retrieval quality is measured, not generated-spec quality.

- Exact for IDs; fuzzy for short prose; rubric for criteria; LLM-judge for long prose; pairwise for preference.
- aipe Phase 2B = precision@k.
- Breakpoint: broader quality eval (pairwise) earns its place.

---

## Interview defense

### Likely questions

**Q [mid]:** Why not always use LLM-as-judge?

**A:** Biases. LLM-judges over-rate verbose answers, anchor at "7/10" for single scoring, prefer outputs whose style matches the judge's training. Pairwise mitigates some; exact-match avoids the issue entirely for IDs.

**Q [senior]:** Why precision@k for retrieval?

**A:** The output is a chunk ID; exact match works perfectly. No need for LLM-judge complexity. The right grader for the output shape.

**Q [arch]:** When does pairwise earn its place?

**A:** When you want "is A better than B?" — comparing two implementations or two prompt versions. Pairwise gives a clearer signal than single-scoring both.

### The question candidates always dodge

**Q:** Why is exact match "perfect"?

**A:** Because for the right output type (IDs, file paths, code identifiers), exact match has no failure mode. It's only "perfect" when the output IS exactly comparable.

### One-line anchors

- Match grader to output type.
- aipe = precision@k for retrieval.
- LLM-judge has biases; pairwise reduces them.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the method-by-output-type table.

### Level 2 — Explain it out loud
Why precision@k for retrieval, not LLM-judge? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user wants to grade `/aipe:study`'s generated concept files for quality. Which method?

### Level 4 — Defend the decision you'd change

"Would you add pairwise LLM-judge to aipe's eval suite?"

### Quick check — code reference test
Without opening files:
- aipe's eval method? → precision@k
- Best for prose? → pairwise or rubric
- Best for IDs? → exact match
