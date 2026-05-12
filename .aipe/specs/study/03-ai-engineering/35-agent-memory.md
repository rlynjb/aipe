# Agent memory

**Industry name(s):** Short-term context, long-term retrieval, agent memory hierarchy
**Type:** Industry standard

> Short-term = the prompt context. Long-term = retrieval over past state (RAG). Different time horizons; different storage.

**See also:** → [13-embeddings-geometric](13-embeddings-geometric.md) · → [32-agent-loop](32-agent-loop.md)

---

## Why care

You've built an agent that "forgets" between iterations because everything lives in the prompt context, which gets pruned when too long. Memory is what lets agents work across long tasks.

The pattern is *memory hierarchy*. Same shape as L1 cache / RAM / disk.

---

## How it works

Two tiers.

### Short-term: prompt context

The current iteration's input. Includes the spec, prior tool calls and results. Limited by the model's context window.

### Long-term: retrieval

When the agent needs to recall something not in current context (e.g., "what did the user say about X last time?"), it retrieves via embedding similarity (RAG).

### For aipe

Phase 4A `/aipe:implement` short-term = the spec + current tool history. Long-term = retrieval over prior specs / project context if needed.

---

## Agent memory — diagram

```
Two tiers

  Short-term (prompt)        Long-term (retrieval)
  ─────────────────          ─────────────────────
  current context             store of past state
  bounded by window           bounded only by disk
  every step sees it          retrieved on demand
```

---

## In this codebase

**Phase 4A target.** Short-term is the agent's prompt context; long-term retrieval shares Phase 2B's RAG layer if/when it lands.

---

## Elaborate

### Where this pattern comes from

Classical AI working memory + long-term memory. LLM-era variant: prompt + retrieval.

### The deeper principle

Match memory tier to access frequency. Hot in context, cold in retrieval.

### Where this breaks down

When context overflows and the agent loses earlier state. Mitigation: summarise old context into a memory chunk; store; retrieve when relevant.

### What to explore next

- [13-embeddings-geometric](13-embeddings-geometric.md) → retrieval primitive

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Two-tier (short + long)  │ Short-term only             │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Capacity         │ ~unlimited via retrieval │ Bounded by context window   │
│ Implementation   │ +retrieval + storage     │ Just prompt                 │
│ Failure mode     │ Bad retrieval misses     │ Window overflow loses       │
│                  │ memory                   │ memory                      │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't have agent memory. Phase 4A would add short-term (the agent's prompt) naturally; long-term shares Phase 2B.

### Sub-block 2 — what the alternative would have cost

Short-term-only `/aipe:implement` would forget across iterations once context filled.

### Sub-block 3 — the breakpoint

When `/aipe:implement` needs to act across many files (~50+), summary memory earns its place.

---

## Tech reference (industry pairing)

### Agent memory

- **Codebase uses:** none.
- **Leading today:** LangGraph's checkpoints, custom summary + retrieval — `adoption-leading`, 2026.

---

## Project exercises

Part of B4A.1.

---

## Summary

Agent memory has tiers: prompt context (short-term) and retrieval (long-term). aipe Phase 4A would use both — prompt for current state, RAG retrieval for cross-spec memory. The constraint: context windows bound short-term. The cost: retrieval has its own failure modes.

- Short-term = prompt; long-term = retrieval.
- aipe Phase 4A target.
- Hot in context, cold in store.

---

## Interview defense

### Likely questions

**Q [mid]:** Two memory tiers?

**A:** Short-term lives in the prompt context (limited by window). Long-term lives in retrieval storage (RAG). Cold data comes back via retrieval.

**Q [senior]:** Why two tiers?

**A:** Context windows are bounded. Long tasks exceed the window. Retrieval is the unbounded tier, just slower to access.

**Q [arch]:** What does `/aipe:implement` need?

**A:** Short-term = the current spec + tool history. Long-term = optional retrieval over prior specs if the user references "the change we made last week."

### The question candidates always dodge

**Q:** Why not just use a bigger context window?

**A:** Even 1M-token windows fill. Long-term memory is needed at scale regardless of window size.

### One-line anchors

- Short-term = prompt; long-term = retrieval.
- aipe Phase 4A would use both tiers.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the two-tier memory.

### Level 2 — Explain it out loud
Why two tiers? Under 60 seconds.

### Level 3 — Apply it to a new scenario

`/aipe:implement` is editing 30 files; context fills mid-execution. What does memory hierarchy do?

### Level 4 — Defend the decision you'd change

"Would you skip long-term memory in v1 of `/aipe:implement`?"

### Quick check — code reference test
Without opening files:
- Short-term storage? → prompt context
- Long-term storage? → retrieval / RAG
- aipe agent memory today? → none
