# LLM-as-judge bias

**Industry name(s):** LLM-judge bias, position bias, verbosity bias, self-preference bias
**Type:** Industry standard

> The LLM grading your output has known biases — it prefers what came first, what's longer, and outputs that look like its own.

**See also:** → [25-eval-methods](25-eval-methods.md) · → [27-positional-bias-ranking](27-positional-bias-ranking.md)

---

## Why care

You've used GPT-4 to grade two prompt variants A vs B and watched it always pick A. Then you swapped the order — it still picked the first one. That's position bias, and it's one of three biases that make LLM-judges unreliable without mitigation.

The pattern is *measure your measurer*. Same shape as auditing the auditor — the eval tool itself has failure modes.

---

## How it works

Three biases to know.

### Position bias

LLM judges favour the option presented first (or last, depending on the model). Mitigation: randomise position; average across both orderings.

### Verbosity bias

Longer answers score higher even when shorter ones are correct. Mitigation: cap output length; explicitly tell the judge "ignore length."

### Self-preference bias

LLM judges over-rate outputs that look like their own writing. Claude-judge prefers Claude-style; GPT-judge prefers GPT-style. Mitigation: use a different model as judge than as generator.

### For aipe

Aipe Phase 2B's eval (B2B.6) uses precision@k (exact-match) — no LLM-judge, no bias. If B3.7's pairwise with-RAG vs without-RAG eval lands, bias mitigations matter (randomise order, average two orderings).

---

## LLM-judge bias — diagram

```
Position bias mitigation

run 1: A presented first, B second  →  judge picks A
run 2: B presented first, A second  →  judge picks A again
                                        (A genuinely better)

vs.

run 1: A presented first, B second  →  judge picks A
run 2: B presented first, A second  →  judge picks B
                                        (position bias — neither is clearly better)

Mitigation: always run both orderings; tie-breaks are warning signs.
```

---

## In this codebase

**Not yet implemented.** Phase 2B uses precision@k (no LLM-judge). If B3.7-style pairwise eval lands, randomisation is mandatory.

---

## Elaborate

### Where this pattern comes from

LLM-as-judge biases were documented in 2023–2024 papers (Zheng et al., MT-Bench / Chatbot Arena). The mitigation playbook (randomise position, cap length, cross-model judging) is the consensus today.

### The deeper principle

Don't trust your grader without auditing it. The grader's biases become your eval's blind spots.

### Where this breaks down

When the bias correlates with the failure mode you're trying to measure — e.g., if "verbose answer" is also the failure mode, verbosity bias and quality become correlated.

### What to explore next

- Zheng et al., "Judging LLM-as-a-Judge" (2023)
- MT-Bench, Chatbot Arena methodology

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Bias-mitigated LLM-judge │ Naive LLM-judge             │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Calls per item   │ 2× (both orderings)      │ 1×                          │
│ Reliability      │ Higher                   │ Lower — bias affects signal │
│ Setup            │ Randomise + average      │ Just call judge             │
│ Failure mode     │ Tie-breaks reveal bias   │ Bias goes undetected        │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe currently has no LLM-judge eval; no bias to mitigate yet.

### Sub-block 2 — what the alternative would have cost

Naive LLM-judge would systematically prefer Claude-shaped outputs (since the judge would likely be Claude). Misleading eval signal.

### Sub-block 3 — the breakpoint

If aipe adds pairwise LLM-judge eval, bias mitigations are mandatory from day one.

---

## Tech reference (industry pairing)

### Bias-mitigated LLM-judge frameworks

- **Codebase uses:** none.
- **Leading today:** MT-Bench methodology (randomised pairwise) — `adoption-leading`, 2026.
- **Runner-up:** Anthropic's Constitutional AI eval — `innovation-leading` for principle-based grading.

---

## Project exercises

Loopd's B3.3 ("rubric LLM-judge on 30 entries, randomize variant order"). For aipe, the discipline transfers if pairwise eval is added.

---

## Summary

LLM judges have biases — position, verbosity, self-preference. aipe doesn't currently use LLM-judge eval; precision@k avoids the problem. If pairwise LLM-judge eval is added (B3.7 pattern), randomising order and averaging is mandatory. The constraint: trust no grader you haven't audited. The cost: 2× calls when mitigating position bias.

- Position bias: first-presented wins.
- Verbosity bias: longer wins.
- Self-preference bias: own-style wins.
- aipe avoids LLM-judge today via precision@k.

---

## Interview defense

### Likely questions

**Q [mid]:** What biases does an LLM-judge have?

**A:** Position (prefers first or last), verbosity (prefers longer), self-preference (prefers outputs that look like its own writing).

**Q [senior]:** How do you mitigate position bias?

**A:** Run the eval in both orderings; average the scores. If the judge picks differently in the two orderings, the difference between A and B is below the bias's noise floor — treat as a tie.

**Q [arch]:** Why does aipe avoid LLM-judge?

**A:** It doesn't need it — Phase 2B's eval is precision@k on chunk IDs, which is exact-match. No bias possible. If broader quality eval is added (B3.7 pairwise), bias mitigations become mandatory.

### The question candidates always dodge

**Q:** Why does verbosity bias exist?

**A:** The judge model was trained on human preferences, and humans (in training data) tend to prefer longer answers. The bias is inherited from training; mitigation requires explicit instruction or length capping.

### One-line anchors

- Three biases: position, verbosity, self-preference.
- Mitigation: randomise, cap length, cross-model judging.
- aipe avoids via exact-match precision@k.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the position-bias mitigation flow (both orderings).

### Level 2 — Explain it out loud
Why do LLM-judges prefer longer answers? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A team uses GPT-4 to grade Claude-generated outputs. What bias matters most?

### Level 4 — Defend the decision you'd change

"Would you adopt MT-Bench's randomised pairwise for aipe from day one of LLM-judge use?"

### Quick check — code reference test
Without opening files:
- Three LLM-judge biases? → position, verbosity, self-preference
- aipe's current eval? → precision@k (no LLM-judge)
- Position bias mitigation? → randomise order, average two orderings
