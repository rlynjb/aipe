# LLM caching

**Industry name(s):** Prompt caching, semantic cache, response cache
**Type:** Industry standard

> Cache LLM responses (or partial inputs) to avoid recomputing the same work twice — different cache shapes for different workload patterns.

**See also:** → [06-token-economics](06-token-economics.md) · → [42-latency-optimization](42-latency-optimization.md)

---

## Why care

You've watched the same prompt run a hundred times and paid for every call even though the answer was the same. Caching turns repeated calls into free lookups.

The pattern is *memoise the expensive call*. Same shape as React `useMemo`, HTTP caching.

---

## How it works

Three flavours.

### Prompt caching (provider-level)

Anthropic / OpenAI cache the prefix of your prompt server-side. Repeated long-prefix calls cost ~10% of normal input price.

### Response caching (your-side)

Hash the prompt; if seen before, return stored response. Exact-match only.

### Semantic caching

Hash the embedding of the prompt; if a near-duplicate has been seen, return that response. Approximate match.

### For aipe

Prompt caching matters most. The 11 wrappers and their templates are the cacheable prefix; every call against the same wrapper reuses ~80% of the input. Phase 5's B5.2 anchors prompt caching to loopd; aipe benefits structurally without needing a build.

---

## LLM caching — diagram

```
Three flavours

Prompt caching                Response caching          Semantic caching
──────────────                ───────────────           ──────────────────
provider caches input prefix   you cache full response   you cache by embedding

[stable wrapper] cached        prompt hash → response    embed query →
[+ variable input]             (exact match only)         nearest stored
                                                          response (fuzzy)

aipe wins here                 not used                   not used today
(Anthropic supports)
```

---

## In this codebase

**Implicit win via Anthropic prompt caching.** When users run aipe on Claude Sonnet 4.5+ (which supports prompt caching), the wrapper + template prefix is cached automatically by the API — no aipe-side code needed.

Today: aipe doesn't request prompt caching explicitly; the host agent (Claude Code) decides whether to enable it. If enabled, repeated `/aipe:<type>` calls in a session benefit.

---

## Elaborate

### Where this pattern comes from

Anthropic's prompt caching (mid-2024) made cross-call caching a first-class API feature. OpenAI followed.

### The deeper principle

Cache where the work is. Prompt prefix caching is server-side because the model is server-side.

### Where this breaks down

When prefixes are highly variable. aipe's wrapper + template is highly cacheable; the small variable input (`$ARGUMENTS`, context content) is the uncached part.

### What to explore next

- Anthropic prompt caching docs
- Semantic cache implementations

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Prompt caching           │ Response caching            │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Cost savings     │ 10× on cached prefix     │ ~$0 if exact-match cache    │
│ Setup            │ API flag; provider does it│ Build cache + lookup        │
│ Cache hit rate   │ High when prefix stable  │ Lower (exact match)         │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't actively manage caching; defers to host agent. Some cache opportunities may be missed if host doesn't enable prompt caching.

### Sub-block 2 — what the alternative would have cost

Response caching at aipe's wrapper level would require persistent storage + prompt-hashing — overhead for a markdown plugin.

### Sub-block 3 — the breakpoint

When users complain about cost on repeated calls, aipe could explicitly request prompt caching from host APIs.

---

## Tech reference (industry pairing)

### Prompt caching

- **Codebase uses:** implicit via host agent.
- **Leading today:** Anthropic prompt caching (Sonnet 4.5+) — `adoption-leading` for long-prefix workloads, 2026.
- **Why it leads:** 10× cost reduction; no client-side code.
- **Runner-up:** OpenAI prompt caching — `adoption-leading` for OpenAI-side.

---

## Project exercises

Loopd's B5.2 (prompt caching for loopd's chains). For aipe, the benefit is structural — wrappers are cacheable prefixes by design.

---

## Summary

LLM caching avoids recomputation. Prompt caching (provider-level) is the load-bearing flavour for aipe — wrappers + templates are stable, cacheable prefixes. The constraint: aipe is markdown-only; can't manage caching itself. The cost: depends on host agent enabling caching.

- Three flavours: prompt, response, semantic.
- aipe benefits structurally from prompt caching.
- 10× savings on cached prefix.

---

## Interview defense

### Likely questions

**Q [mid]:** What is prompt caching?

**A:** Provider caches the prefix of your prompt server-side; repeated calls with the same prefix pay ~10% of normal input cost for that prefix.

**Q [senior]:** Why does aipe benefit structurally?

**A:** Every `/aipe:<type>` call's prompt has the wrapper + template (~125k tokens) as a stable prefix. Only the user's intent and the variable context differ. Cacheable.

**Q [arch]:** What's the savings on a full `/aipe:study` run?

**A:** Roughly 5× — ~$30 → ~$6 (see [06-token-economics](06-token-economics.md)).

### The question candidates always dodge

**Q:** Why doesn't aipe explicitly request caching?

**A:** Because the host agent controls the API call. aipe's wrapper is markdown read by the host; it can't set API flags directly.

### One-line anchors

- Prompt caching = 10× cost reduction on cached prefix.
- aipe wrappers are cacheable prefixes by design.
- Loopd B5.2 anchors explicit caching.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the three cache flavours.

### Level 2 — Explain it out loud
Why aipe benefits from prompt caching without code. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user runs `/aipe:study` then `/aipe:feature` in the same session. Which cache helps?

### Level 4 — Defend the decision you'd change

"Should aipe explicitly request prompt caching in its wrappers?"

### Quick check — code reference test
Without opening files:
- aipe's cache today? → implicit via host
- Anthropic prompt caching savings? → 10× on cached prefix
- Build item? → loopd's B5.2 (not aipe)
