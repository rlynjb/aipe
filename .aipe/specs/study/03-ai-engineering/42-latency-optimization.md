# Latency optimization for LLMs

**Industry name(s):** LLM latency, prompt caching for latency, model routing for speed
**Type:** Industry standard

> Time-to-first-token and total-response-time are both costs. Pick model + caching + routing to optimise.

**See also:** → [41-llm-caching](41-llm-caching.md) · → [05-streaming](05-streaming.md)

---

## Why care

You've watched a `/aipe:study` invocation take 3 minutes per file and wondered why. Latency on long prompts is dominated by prefill (processing the input) and decode (generating output).

The pattern is *spend compute where it matters*. Same shape as web performance optimisation — first paint vs full load.

---

## How it works

Three levers.

### Prompt caching

Drops prefill latency on cached prefix. See [41-llm-caching](41-llm-caching.md).

### Model routing

Use Haiku (fast) for trivial tasks; Sonnet for typical; Opus for hard. Pick by complexity.

### Speculative decoding

Smaller model drafts output; larger model verifies. Cuts decode time. Provider-internal.

### For aipe

The host agent picks model and decoding. aipe doesn't manage latency directly; the spec template's structure (length + complexity) is the lever aipe controls.

---

## Latency optimization — diagram

```
Where time goes

prefill (processing input)        decode (generating output)
─────────────────────────         ───────────────────────────
~100 ms / 1k input tokens         ~10 ms / output token

aipe /aipe:study per file:
  prefill: ~135k tokens × ~100ms/1k = ~13.5s (cached: ~1.4s)
  decode:  ~3.7k tokens × ~10ms     = ~37s
                                     ─────
                                     ~50s per file (uncached)
                                     ~38s per file (cached)
```

---

## In this codebase

**Indirectly addressed.** Wrapper structure (head/tail attention from [02-context-windows](02-context-windows.md)) and prompt caching ([41-llm-caching](41-llm-caching.md)) are the levers.

---

## Elaborate

### Where this pattern comes from

LLM serving latency optimisation matured 2023+ as production loads emerged.

### The deeper principle

Latency = prefill + decode. Cut prefill via caching; cut decode via smaller models or speculative decoding.

### Where this breaks down

When the output is long (long decode time) — no caching or routing helps the decode side.

### What to explore next

- [41-llm-caching](41-llm-caching.md)
- Anthropic / OpenAI serving docs

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Optimise latency         │ Default settings            │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Per-call time    │ Lower (prompt-cached)    │ Higher                      │
│ Cost             │ Lower via cache + small  │ Higher                      │
│                  │ model routing            │                             │
│ Quality          │ Tradeoff if using smaller│ Stable                      │
│                  │ model                    │                             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't actively manage latency; depends on host.

### Sub-block 2 — what the alternative would have cost

Per-spec-type model routing would require host cooperation aipe doesn't have.

### Sub-block 3 — the breakpoint

When user complaints about `/aipe:study` slowness become common.

---

## Tech reference (industry pairing)

### Latency optimisations

- **Codebase uses:** implicit via host's caching/routing.
- **Leading today:** prompt caching + model routing — `adoption-leading`, 2026.

---

## Project exercises

Loopd's B5.2 / B5.3 anchor model routing + caching. No aipe Build item.

---

## Summary

Latency has prefill and decode components. aipe's wrappers benefit from prompt caching (cuts prefill); model routing is host-side. The constraint: aipe is markdown; can't drive serving optimisations. The cost: long outputs aren't cacheable.

- Prefill + decode are the two latency components.
- Caching cuts prefill; model routing cuts both.
- aipe benefits implicitly; loopd's B5.2/5.3 anchor explicit work.

---

## Interview defense

### Likely questions

**Q [mid]:** What dominates LLM latency?

**A:** Prefill (processing input — scales with input length) and decode (generating output — scales with output length). For long inputs (aipe's wrappers), prefill is significant; for long outputs (concept files), decode dominates.

**Q [senior]:** What's aipe's latency lever?

**A:** Wrapper-prompt structure (caching-friendly prefix) and template content (concise where possible). Both lower prefill time.

**Q [arch]:** When would model routing help aipe?

**A:** If the host agent could route `/aipe:feature` to Haiku (fast tier) and `/aipe:study` to Opus (long-context). Today, the user picks the model per session.

### The question candidates always dodge

**Q:** Why is `/aipe:study` so slow?

**A:** 65 files × ~50s/file = ~55 minutes. Cached: ~40 minutes. The cost is genuine — long outputs decode slowly.

### One-line anchors

- Latency = prefill + decode.
- aipe leverages caching implicitly; routing is host-side.
- `/aipe:study` is slow because output is large.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw prefill vs decode timing for one file.

### Level 2 — Explain it out loud
Why prompt caching helps `/aipe:study`. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user runs `/aipe:study` with 200 files in inventory. What's the realistic latency budget?

### Level 4 — Defend the decision you'd change

"Would you split `commands/study.md` into per-section files to reduce prefill on each call?"

### Quick check — code reference test
Without opening files:
- Prefill cost? → ~100ms / 1k input tokens
- Decode cost? → ~10ms / output token
- aipe levers? → caching (structural), template concision
