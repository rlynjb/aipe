# No-click is not a negative label

**Industry name(s):** Implicit-feedback noise, signal-vs-noise in clicks, no-click ambiguity
**Type:** Industry standard

> When a user doesn't click a result, it doesn't mean the result is bad — they might not have seen it, or the answer is in another result, or they got distracted.

**See also:** → [25-eval-methods](25-eval-methods.md) · → [27-positional-bias-ranking](27-positional-bias-ranking.md)

---

## Why care

You've trained a ranker on "clicked = good, not clicked = bad" and watched it converge to ranking the same top-of-list items higher and higher. The "not clicked" labels are noise; treating them as negatives biases the system toward already-popular items.

The pattern is *missing-not-at-random*. Same shape as survey response bias — the absence of a response isn't itself a signal.

---

## How it works

Treat clicks as positive signal; treat no-clicks as no signal (not negative).

### For aipe

No user-click surface — aipe doesn't track user behaviour. The concept is `learn-only` for aipe.

---

## No-click — diagram

```
Naive labelling (wrong)              Correct labelling
─────────────────────                ──────────────────
clicked       → +1                   clicked       → +1
not clicked   → −1                   not clicked   → no label
                                     (just absent)
training overrates                   training learns from
"already on top"                     positive signal only
```

---

## In this codebase

**Not applicable.** aipe has no click tracking. Curriculum tags this learn-only.

---

## Elaborate

### Where this pattern comes from

Search-ranking and recommender literature, 2010s. Critical for training rankers from implicit feedback.

### The deeper principle

Absence is not a label. Treat missing data as missing.

### Where this breaks down

When you genuinely need a negative signal — solutions involve adversarial sampling or explicit user feedback collection.

### What to explore next

- [27-positional-bias-ranking](27-positional-bias-ranking.md)
- "Counterfactual reasoning for implicit feedback" papers

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Treat as no-signal       │ Treat as negative           │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Bias             │ Lower                    │ High — feedback loop         │
│ Sample size      │ Smaller labelled set     │ Larger but noisy             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe has no clicks; nothing to give up.

### Sub-block 2 — what the alternative would have cost

Not applicable.

### Sub-block 3 — the breakpoint

Not applicable.

---

## Tech reference (industry pairing)

### Implicit feedback debiasing

- **Codebase uses:** none.
- **Leading today:** counterfactual sampling — `adoption-leading` for production rankers, 2026.

---

## Project exercises

No aipe Build item; learn-only.

---

## Summary

No-click isn't negative — it's absence of signal. aipe has no click surface; concept is learn-only. The constraint: aipe doesn't track behaviour. The cost: not applicable.

- Don't treat no-click as negative.
- aipe has no click surface; learn-only.

---

## Interview defense

### Likely questions

**Q [mid]:** Why isn't no-click negative?

**A:** Many reasons users don't click: they didn't see the item (it was below the fold), they got their answer elsewhere, they got distracted. Treating no-click as negative trains models on noise.

**Q [senior]:** Does aipe have this concern?

**A:** No — aipe doesn't track user clicks. The concept applies to ranking/recommender systems.

**Q [arch]:** How would you collect negative signal if you needed it?

**A:** Explicit feedback (thumbs-down), or counterfactual sampling (items not shown). Both expensive.

### The question candidates always dodge

**Q:** Why is this still a concern in 2026?

**A:** Implicit feedback is the cheapest signal to collect — every team that builds a ranker reaches for it. The noise-vs-signal awareness is hard-won knowledge.

### One-line anchors

- No-click = absent, not negative.
- aipe has no click surface.
- Naive treatment creates feedback loops.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw naive vs correct labelling.

### Level 2 — Explain it out loud
Why is no-click ambiguous? Under 60 seconds.

### Level 3 — Apply it to a new scenario

If aipe added "did you find this spec useful?" thumbs-up/down, would this concern apply?

### Level 4 — Defend the decision you'd change

"Should aipe collect explicit user feedback on specs?"

### Quick check — code reference test
Without opening files:
- aipe's click surface? → none
- Correct treatment of no-click? → no signal (not negative)
- Why naive fails? → feedback loop favouring top-of-list
