# Cost optimization for LLMs

**Industry name(s):** Cost optimisation, model tier routing, prompt slimming
**Type:** Industry standard

> Drive down $/call via cheaper models, caching, prompt trimming, and batching where applicable.

**See also:** → [06-token-economics](06-token-economics.md) · → [41-llm-caching](41-llm-caching.md)

---

## Why care

You've watched your LLM bill 10× over a quarter because every feature defaulted to the most-expensive model. Cost optimisation is invisible until it's painful; pay it forward by designing for cost from day one.

The pattern is *unit-cost discipline*. Same shape as web egress costs, AWS compute optimisation.

---

## How it works

Four levers.

### Cheaper model when sufficient

Use Haiku for trivial tasks; Sonnet for typical; Opus only when needed. Cost ratio Haiku:Sonnet:Opus ≈ 1:4:20.

### Prompt caching

10× reduction on cached input ([41-llm-caching](41-llm-caching.md)).

### Prompt slimming

Trim wrapper / template content not actively load-bearing. Smaller input → cheaper.

### Batching

When applicable, batch multiple short prompts into one call.

### For aipe

aipe's wrappers are at the upper end of size. Prompt slimming (smaller `commands/study.md`) and caching (implicit) are the levers. Batching doesn't apply (each `/aipe:<type>` is one user invocation).

---

## Cost optimization — diagram

```
Four levers

  Model tier         Caching          Slimming           Batching
  ──────────         ───────          ────────           ────────
  Haiku $0.80/M      10× saving       trim unused       group short
  Sonnet $3/M        on cached         template content   prompts
  Opus $15/M         prefix            
  
  aipe: depends      aipe: implicit    aipe: lever       aipe: N/A
  on host's pick                                          (one user
                                                          invocation
                                                          per command)
```

---

## In this codebase

**Slimming + implicit caching are the levers.** Loopd's B5.3 anchors model routing for cost.

---

## Elaborate

### Where this pattern comes from

OpenAI's tiered models (2022+); production cost engineering as LLM systems scaled.

### The deeper principle

Spend the right amount per request.

### Where this breaks down

When small models can't deliver acceptable quality, no amount of routing saves cost.

### What to explore next

- [06-token-economics](06-token-economics.md)
- Anthropic / OpenAI pricing pages

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Optimise cost            │ Always use top model        │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ $ / call         │ Variable; often 5–10× lower│ Stable, high                │
│ Quality          │ Variable per tier        │ Stable, top                  │
│ Complexity       │ Routing logic            │ None                         │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't route models. Users pick the model session-wide.

### Sub-block 2 — what the alternative would have cost

Per-spec-type model routing would need host cooperation aipe doesn't have.

### Sub-block 3 — the breakpoint

When `/aipe:study` cost becomes prohibitive at scale.

---

## Tech reference (industry pairing)

### Cost optimisation

- **Codebase uses:** implicit caching + template slimming.
- **Leading today:** model routing + caching combo — `adoption-leading`, 2026.

---

## Project exercises

Loopd's B5.3 (model routing policy). No aipe Build item.

---

## Summary

LLM cost optimisation has four levers: model tier, caching, slimming, batching. aipe uses caching (implicit) and slimming (template discipline). The constraint: aipe doesn't drive model selection. The cost: users on premium models pay more.

- Four levers: tier / cache / slim / batch.
- aipe = cache + slim.
- Model routing is host-side.

---

## Interview defense

### Likely questions

**Q [mid]:** Four cost levers?

**A:** Cheaper model when sufficient, prompt caching, prompt slimming, batching.

**Q [senior]:** Which lever does aipe use?

**A:** Slimming (template discipline keeps wrappers focused) and implicit caching (prefixes are stable, host enables caching).

**Q [arch]:** When would model routing earn its place in aipe?

**A:** When the host agent exposes a "use Haiku for this command" hint. Today, it's session-wide; aipe can't influence per-command.

### The question candidates always dodge

**Q:** Why doesn't aipe use Haiku for `/aipe:feature`?

**A:** Because aipe doesn't pick the model. Users do, via their host agent's settings.

### One-line anchors

- Four levers: tier / cache / slim / batch.
- aipe = slim + implicit cache.
- Loopd B5.3 anchors explicit routing.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the four cost levers.

### Level 2 — Explain it out loud
Why aipe can't drive model tier. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user runs `/aipe:feature` 100 times in a day on Opus. What's the lever to suggest?

### Level 4 — Defend the decision you'd change

"Would you embed a 'recommended model tier' hint per wrapper?"

### Quick check — code reference test
Without opening files:
- aipe cost lever today? → slim + implicit cache
- Loopd cost build item? → B5.3
- Cheapest tier? → Haiku ($0.80/M input)
