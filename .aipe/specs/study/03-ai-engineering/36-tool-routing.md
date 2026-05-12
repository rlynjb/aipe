# Tool routing

**Industry name(s):** Routing, heuristic vs LLM-routed, dispatcher
**Type:** Industry standard

> When multiple tools could handle an input, decide which one — by rule (cheap), by LLM (flexible), or by classifier (in between).

**See also:** → [31-tool-calling](31-tool-calling.md) · → [09-heuristic-before-llm](09-heuristic-before-llm.md)

---

## Why care

You've built an agent with 12 tools and watched it pick the wrong one. Routing is the dispatch problem — and it's harder than it looks.

The pattern is *dispatch by signal strength*. Same shape as event-handler dispatch in UI frameworks.

---

## How it works

Three options.

### Heuristic routing

`if input.startswith("read"): use read_file`. Cheap, deterministic; brittle.

### LLM routing

The LLM picks the tool from the tool set. Flexible; ~95% reliable with good descriptions.

### Classifier routing

A small classifier (embedding similarity or fine-tuned) picks the tool. Middle ground.

### For aipe

Phase 4A B4A.4 anchors "Explicit dispatcher routing" for `/aipe:implement`. Likely heuristic (the spec names the tools needed) with LLM fallback.

---

## Tool routing — diagram

```
Heuristic                  LLM                      Classifier
─────────                  ───                      ──────────
if X: tool_A                LLM picks                 small model picks
elif Y: tool_B              from tool_descriptions    by embedding/intent
else: error                                          
cheap, brittle              flexible, $0.001          middling
```

---

## In this codebase

**Phase 4A target.** No tool routing today.

---

## Elaborate

### Where this pattern comes from

Classifier dispatch goes back to OS interrupt handlers. LLM-based routing emerged with agent frameworks (2023).

### The deeper principle

Match routing complexity to the routing problem.

### Where this breaks down

When routing decisions need context the heuristic doesn't have. LLM routing then earns its place.

### What to explore next

- Semantic Router library
- [09-heuristic-before-llm](09-heuristic-before-llm.md) → cascading patterns

---

## Tradeoffs

```
┌──────────────────┬─────────────┬─────────────┬─────────────────┐
│ Dimension        │ Heuristic   │ LLM         │ Classifier      │
├──────────────────┼─────────────┼─────────────┼─────────────────┤
│ Cost             │ $0          │ $0.001+     │ ~$0 after train │
│ Latency          │ μs          │ s           │ ms              │
│ Reliability      │ Brittle     │ ~95%        │ ~92%            │
│ Maintenance      │ Edit rules  │ Edit prompt │ Retrain         │
└──────────────────┴─────────────┴─────────────┴─────────────────┘
```

### Sub-block 1 — what we gave up

aipe has no routing yet.

### Sub-block 2 — what the alternative would have cost

LLM routing on every step would add latency + cost across `/aipe:implement`'s many iterations.

### Sub-block 3 — the breakpoint

For `/aipe:implement` with 4–6 tools, heuristic routing works. Beyond ~12 tools, LLM or classifier routing earns its place.

---

## Tech reference (industry pairing)

### Routing

- **Codebase uses:** none.
- **Leading today:** heuristic + LLM fallback — `adoption-leading`, 2026.
- **Runner-up:** Semantic Router (embedding-based) — `innovation-leading`.

---

## Project exercises

### [B4A.4] Explicit dispatcher routing

- **Exercise ID:** `[B4A.4]`
- **What to build:** Routing logic in `/aipe:implement`: which tool runs for which spec section.
- **Why it earns its place:** without explicit routing, the agent guesses tool choice; explicit is auditable.
- **Files to touch:** `specs/implement.md`, `commands/implement.md`.
- **Done when:** routing rules documented and testable.
- **Estimated effort:** `1–4hr`.

---

## Summary

Tool routing decides which tool handles an input. Heuristic for small tool sets; LLM for flexible cases; classifier in between. Phase 4A B4A.4 anchors heuristic routing for `/aipe:implement`. The constraint: ~6 tools is heuristic-friendly. The cost: brittle rules.

- Heuristic / LLM / classifier — three options.
- aipe Phase 4A B4A.4 = heuristic.
- Breakpoint: ~12 tools → LLM or classifier.

---

## Interview defense

### Likely questions

**Q [mid]:** Three routing strategies?

**A:** Heuristic (rules), LLM (let the model pick), classifier (small model). Cost-flexibility tradeoff.

**Q [senior]:** Why heuristic for `/aipe:implement`?

**A:** Small tool set (4–6 tools). Heuristic rules are reliable; LLM routing would add latency on every step without payoff.

**Q [arch]:** When does LLM routing earn its place?

**A:** Beyond ~12 tools, heuristic rules become hard to maintain. LLM with good tool descriptions handles the scale.

### The question candidates always dodge

**Q:** Are LLM-routed agents really 95% reliable?

**A:** With well-written tool descriptions, yes. With ambiguous descriptions (two tools with overlapping purposes), reliability drops fast.

### One-line anchors

- Routing matches tool to input.
- Heuristic cheap, brittle; LLM flexible, costly; classifier middle.
- aipe Phase 4A B4A.4 = heuristic.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the three routing strategies.

### Level 2 — Explain it out loud
Why heuristic over LLM for small tool sets? Under 60 seconds.

### Level 3 — Apply it to a new scenario

`/aipe:implement` adds a 7th tool (`open_browser`). Does heuristic still work?

### Level 4 — Defend the decision you'd change

"Would you start with LLM routing in `/aipe:implement` for future-proofing?"

### Quick check — code reference test
Without opening files:
- aipe Phase 4A routing strategy? → heuristic (B4A.4)
- Threshold for LLM routing? → ~12+ tools
- Classifier example? → Semantic Router
