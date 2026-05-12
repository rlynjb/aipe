# Positional bias in ranking

**Industry name(s):** Position bias, lost-in-the-middle (for LLMs), recency bias (for recommenders)
**Type:** Industry standard

> Things at certain positions get preferred regardless of merit — head/tail attention in LLMs, recency in recommenders, top-of-list in UI.

**See also:** → [02-context-windows](02-context-windows.md) · → [26-llm-judge-bias](26-llm-judge-bias.md)

---

## Why care

You've ranked search results and noticed users click the top 3 regardless of which 3 are at the top. Position is a feature your eval has to account for — otherwise "click-through" misleads you about quality.

The pattern is *position correlates with outcome independent of quality*. Same in search ranking, recommender systems, LLM attention.

---

## How it works

Two flavours.

### LLM lost-in-the-middle

Critical content in the middle of a long context gets less attention than content at the ends. See [02-context-windows](02-context-windows.md).

### Recommender / ranking recency bias

Users click top items more; top items get more training signal; trained models rank them higher; the loop self-reinforces.

### For aipe

[02-context-windows](02-context-windows.md) covers lost-in-the-middle for LLMs — relevant to wrapper design. Recommender-style bias doesn't apply to aipe (no recommender surface).

---

## Positional bias — diagram

```
Two flavours

LLM lost-in-the-middle:                Recommender recency bias:
attention high at ends,                items at top get clicks,
weakest in the middle                  clicks become training signal,
                                       training reinforces top placement
                                       (positive feedback loop)
```

---

## In this codebase

**Lost-in-the-middle applies to wrapper design.** See [02-context-windows](02-context-windows.md). Recommender bias doesn't apply — aipe has no recommender.

---

## Elaborate

### Where this pattern comes from

Lost-in-the-middle: Liu et al. (2023). Recency bias in recommenders: documented since the early 2010s in industrial recommender systems.

### The deeper principle

Position correlates with outcome; isolate position effects to measure true quality.

### Where this breaks down

When the position effect is the dominant signal — at that point, debiasing is the only way to measure quality.

### What to explore next

- [02-context-windows](02-context-windows.md) → LLM-side bias
- Recommender system debiasing literature

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Account for position     │ Ignore position             │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Eval cleanliness │ Higher                   │ Lower (position contaminates│
│                  │                          │ signal)                     │
│ Implementation   │ Randomise position in    │ None                        │
│                  │ eval; debias models      │                             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't need to actively debias — no ranking surface. The LLM-side lost-in-the-middle is mitigated structurally (head/tail placement of critical content).

### Sub-block 2 — what the alternative would have cost

Recommender-style debiasing would require maintaining propensity models. Not applicable to aipe.

### Sub-block 3 — the breakpoint

Not applicable for aipe in current form.

---

## Tech reference (industry pairing)

### Position-bias mitigation

- **Codebase uses:** structural mitigation in wrapper design ([02-context-windows](02-context-windows.md)).
- **Leading today:** Liu et al.'s mitigation strategies (randomise, anchor at ends) — `adoption-leading`, 2026.

---

## Project exercises

No aipe-specific Build item. Touched via B3.3 randomization in loopd.

---

## Summary

Position correlates with outcome in LLM attention and recommender clicks. aipe's wrappers mitigate lost-in-the-middle structurally (head/tail placement). No recommender surface to debias. The constraint: design around position; debias when measuring.

- Lost-in-the-middle for LLMs; recency bias for recommenders.
- aipe mitigates structurally via wrapper layout.
- No recommender surface; no recommender debiasing needed.

---

## Interview defense

### Likely questions

**Q [mid]:** Two kinds of positional bias?

**A:** Lost-in-the-middle (LLM attention U-shape); recommender recency (top-of-list gets more clicks regardless of merit).

**Q [senior]:** How does aipe handle lost-in-the-middle?

**A:** Wrapper structure: Step 1 scaffold and Step N STOP at the head and tail (high attention); flag taxonomies and repair recipes in the middle (lower attention but referenced on demand).

**Q [arch]:** When would aipe need recommender debiasing?

**A:** If aipe ever shipped a "recommended next spec type" feature based on user history. No such surface today.

### The question candidates always dodge

**Q:** Why don't bigger LLM contexts fix lost-in-the-middle?

**A:** They reduce it but don't eliminate it. Attention is still uneven across positions; the U-shape is shallower at 1M tokens than at 200k but still present.

### One-line anchors

- LLM = U-shape attention; recommender = top-of-list reinforcement.
- aipe mitigates LLM-side via wrapper layout.
- No recommender surface in aipe.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw both flavours of positional bias.

### Level 2 — Explain it out loud
Why does the LLM U-shape exist? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A future `/aipe:next-spec` recommends what to spec next based on history. Does recommender bias apply?

### Level 4 — Defend the decision you'd change

"Would you build a recommender into aipe?"

### Quick check — code reference test
Without opening files:
- aipe's primary bias to worry about? → lost-in-the-middle
- Recommender bias in aipe? → not applicable
- Mitigation? → wrapper structure (Step 1 + STOP at ends)
