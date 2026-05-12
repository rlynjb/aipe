# Token economics

**Industry name(s):** LLM cost-per-token, input/output pricing asymmetry, prompt cost
**Type:** Industry standard

> Cost is per-token, not per-call; input and output tokens are priced differently; the same prompt costs different amounts on different models.

**See also:** → [01-tokenization](01-tokenization.md) · → [27-cost-optimization](27-cost-optimization.md)

---

## Why care

You've watched a clever prompt blow your monthly LLM budget because you didn't realise every call was loading 50 KB of "context" you'd never use. Cost surprises in LLM systems almost always come from token count, not call count.

The pattern is *cost-by-usage at a fine granularity*. AWS bills per GB-hour; CDNs bill per byte; LLMs bill per token. The shape: the unit is invisible to users until you make it visible. The fix is to track it explicitly — at design time (estimate token counts for prompts) and at runtime (log actual token usage per call).

---

## How it works

A meter that runs the whole time the model is reading or writing.

### Pricing structure

Most LLM APIs price input and output tokens separately:

```
Provider        Model               Input ($/M)    Output ($/M)   Ratio
Anthropic       Claude Sonnet 4.6   $3.00          $15.00         1:5
Anthropic       Claude Opus 4.7     $15.00         $75.00         1:5
Anthropic       Claude Haiku 4.5    $0.80          $4.00          1:5
OpenAI          GPT-4o              $2.50          $10.00         1:4
OpenAI          GPT-4o mini         $0.15          $0.60          1:4
```

Output is 4–5× more expensive than input. This makes sense: input is just attention over text the model already has; output requires sampling at each step.

### Cost formula

```
cost = (input_tokens × input_price + output_tokens × output_price) / 1_000_000
```

For aipe's largest call (`/aipe:study` CREATE mode, generating one concept file):
- Input: wrapper (~40k) + template (~85k) + context (~10k) + agent history (~5k) = ~140k tokens
- Output: one concept file at ~3000 lines × 5 chars/line ÷ 4 chars/token = ~3750 tokens

```
Sonnet 4.6 cost:
   input:  140_000 × $3 / 1M  = $0.42
   output: 3_750   × $15 / 1M = $0.056
   total: ~$0.48 per concept file

65 files × $0.48 = ~$31 for one /aipe:study run
```

### Prompt caching changes the math

Anthropic and OpenAI offer prompt caching — cached input tokens are billed at 10% of the regular rate.

```
With prompt caching enabled:
   first call: pay full $0.42 input
   subsequent calls (cached): pay $0.042 input  (10×)

   65 files × ($0.042 + $0.056) ≈ $6.4 — instead of $31
```

This is a 5× cost reduction for `/aipe:study` because the wrapper + template are reused across all files.

If you're coming from frontend, this is like a CDN cache hit vs origin fetch — same data, different cost.

### What aipe doesn't do

aipe doesn't log token usage or enforce caching. The host agent decides whether to use prompt caching; users see the cost on their LLM bill.

For aipe to be cost-conscious, the wrapper would have to: (a) measure token count of its inputs, (b) request prompt caching, (c) report estimated cost to the user. The first is doable; the second depends on host support; the third is informational.

---

## Token economics — diagram

```
Cost breakdown for /aipe:study CREATE (per concept file, no caching)

┌─ Input tokens (cheap @ $3/M) ─────────────────────────────────────────┐
│                                                                       │
│   wrapper          ~40k                                               │
│   template         ~85k                                               │
│   context          ~10k                                               │
│   agent history     ~5k                                               │
│                   ─────                                               │
│                   ~140k tokens × $3/M = $0.42                         │
└───────────────────────────────────────────────────────────────────────┘

┌─ Output tokens (expensive @ $15/M, 5× input) ─────────────────────────┐
│                                                                       │
│   concept file     ~3,750 tokens × $15/M = $0.056                     │
└───────────────────────────────────────────────────────────────────────┘

Total per file:    ~$0.48
65 files (full /aipe:study CREATE mode):  ~$31

With prompt caching (input @ 10%):
Total per file:    ~$0.10
65 files:          ~$6.4
```

---

## In this codebase

**Not measured directly.** aipe doesn't track tokens or cost. Users see total cost on their host bill.

The cost is real and load-bearing for `/aipe:study`. A full CREATE-mode run today (~65 files) is roughly $30 without prompt caching, $6 with. UPDATE-mode runs are cheaper because they edit existing files (smaller output, cached input).

Curriculum tags this concept covered for aipe via the cross-anchor with loopd. The aipe-anchored exercise (B1.7 template-style-guide) doesn't directly exercise token economics but defends prompt engineering discipline, which inherently includes cost discipline.

---

## Elaborate

### Where this pattern comes from

LLM pricing-per-token started with OpenAI's GPT-3 API (2020). The input/output asymmetry was introduced because output is computationally more expensive (sample at each step) vs input (one forward pass). Prompt caching (2024 Anthropic, similar in OpenAI) is the latest cost-reduction primitive.

### The deeper principle

Cost is invisible until you make it visible. Estimate at design time; log at runtime; alert when actual exceeds estimate.

### Where this breaks down

When the consumer doesn't see the cost — e.g., aipe's user pays via their host agent's bill, so aipe doesn't surface "this command costs $0.48." If a user runs `/aipe:study` casually without realising the cost, they'll be surprised at month-end. The mitigation today is documentation; the better mitigation is in-wrapper estimates.

### What to explore next

- [27-cost-optimization](27-cost-optimization.md) → patterns that reduce token spend
- Anthropic prompt caching docs, OpenAI caching docs
- Hamel Husain's blog on LLM cost discipline

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Track tokens explicitly  │ Black-box, let users see bill│
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ User awareness   │ "This will cost $X" at   │ "Why was my bill $200?"     │
│                  │ design time              │ at month end                │
│ Implementation   │ Per-wrapper token logs   │ Zero — host handles it      │
│ Caching          │ Wrapper requests caching │ Host decides                │
│ Onboarding       │ Cost docs in README      │ User reads bill,            │
│                  │                          │ self-discovers              │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't surface per-command cost. Users discover cost from their bill — a delayed and aggregated signal. A heavy `/aipe:study` user could spend $30 in one afternoon and only see it next month.

### Sub-block 2 — what the alternative would have cost

In-wrapper cost estimates would require: (a) measuring wrapper + template + context token counts (doable, but tokenizer-specific), (b) embedding the per-model price table (needs updating as providers change pricing), (c) host-agent cooperation to expose actual token usage post-call (not always available). Complexity grows quickly for an informational feature.

### Sub-block 3 — the breakpoint

Fine until cost surprises become user complaints. Today, the user base is small enough that direct support absorbs the occasional "why so expensive?" message. At scale, an in-wrapper cost note ("Estimated: ~$0.48 per concept file × 65 files ≈ $30") would earn its place.

---

## Tech reference (industry pairing)

### LLM API pricing models

- **Codebase uses:** none directly.
- **Leading today:** Anthropic + OpenAI per-token + prompt caching — `adoption-leading` for LLM pricing, 2026.
- **Why it leads:** transparent unit pricing; caching is a 5–10× cost reduction for repeated-input workloads.
- **Runner-up:** flat-rate plans (some self-hosted setups) — `innovation-leading` for high-volume users; per-call cost approaches zero at scale.

### Prompt caching

- **Codebase uses:** none — aipe defers to host agent.
- **Leading today:** Anthropic prompt caching (Claude Sonnet 4.5+) — `adoption-leading` for long-prompt workloads.
- **Why it leads:** 10× cost reduction on cached input; works automatically when prompts share a stable prefix.

---

## Project exercises

Curriculum tags C1.6 covered via loopd's B1.2 ("token usage logging per chain → new local `ai_call_log` table") and B1.8 ("AI cost & latency panel in `app/settings/ai.tsx`"). For aipe, this concept is supportive — the discipline transfers but no aipe-anchored Build item exists. If aipe were to add token logging, it would land as part of a hypothetical Phase 2B RAG build.

---

## Summary

LLM cost is per-token, with output 4–5× more expensive than input. A full `/aipe:study` CREATE run costs ~$30 uncached, ~$6 with prompt caching. aipe doesn't track or surface cost; users see it on their host bill. The constraint: aipe is a plugin, not a billing surface. The cost being paid: cost surprises possible for heavy users.

- Cost = (input × in-price + output × out-price) / 1M tokens.
- Output is 4–5× more expensive than input.
- Prompt caching reduces cached input to 10% of normal price.
- A full `/aipe:study` run: ~$30 uncached, ~$6 cached.
- aipe doesn't surface cost; informational feature deferred.

---

## Interview defense

### Likely questions

**Q [mid]:** Why is output more expensive than input?

**A:** Output requires the model to sample at every step (a full forward pass per token), while input is one forward pass over the whole prompt. The compute asymmetry is roughly 4–5×, which is reflected in pricing.

**Q [senior]:** What does prompt caching change about aipe's economics?

**A:** A full `/aipe:study` run is ~$30 uncached, ~$6 cached — a 5× reduction. The savings come because the wrapper + template are reused across all 65 generated files; they're the cacheable prefix. Without caching, each file pays the full ~140k input tokens; with caching, each file pays ~14k tokens (10%).

```
65 files × $0.48 (uncached) = ~$31
65 files × $0.10 (cached)  = ~$6.5
                              ─ 5× savings ─
```

**Q [arch]:** Should aipe expose cost estimates to users?

**A:** Probably eventually. The current black-box approach works at small scale but doesn't scale to heavy users. The fix is an in-wrapper estimate ("Estimated: $0.48 per file × 65 = $31 uncached, $6.5 cached") shown at Step 7C (right before generation starts) so users can opt out. Cost requires: (a) token estimator embedded in wrapper, (b) model-pricing table maintained, (c) caching detection. Doable; not load-bearing today.

### The question candidates always dodge

**Q:** Why doesn't aipe surface cost estimates at the wrapper level?

**A:** Two reasons:

```
┌──────────────────┬──────────────────────────┬───────────────────────────┐
│ Dimension        │ Surface cost (proposed)  │ Black-box (today)         │
├──────────────────┼──────────────────────────┼───────────────────────────┤
│ Wrapper          │ Token-counter + price    │ Zero — host handles all   │
│   complexity    │ table + caching detector │                           │
│ Accuracy         │ ±20% (estimator differs  │ Exact (host's bill)       │
│                  │ from host tokenizer)     │                           │
│ Maintenance      │ Price table per provider;│ Zero                      │
│                  │ updates when providers   │                           │
│                  │ change pricing           │                           │
│ Onboarding cost  │ "Wait, why does it       │ "Run it, see what it      │
│                  │ tell me $X?"             │ costs after"              │
│ Failure mode     │ Stale price table → wrong│ User overruns budget      │
│                  │ estimate                 │                           │
└──────────────────┴──────────────────────────┴───────────────────────────┘
```

For a small user base, black-box is right. For a larger one, surfacing earns its place.

### One-line anchors

- Cost is per-token, with output 4–5× input.
- Prompt caching = 10× cost reduction on cached prefix.
- `/aipe:study` full run is ~$30 uncached, ~$6 cached.
- aipe defers cost surfacing to the host bill.
- The breakpoint is "user complaints about surprise bills."

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the input + output token costs for one concept file.

### Level 2 — Explain it out loud
Explain why prompt caching saves 5× on `/aipe:study`. Under 90 seconds.

### Level 3 — Apply it to a new scenario

A user runs `/aipe:study` then `/aipe:feature` then `/aipe:debugging` in sequence. Which one benefits most from prompt caching?

### Level 4 — Defend the decision you'd change

"Should aipe ship with a token estimator? What does it cost to maintain?"

### Quick check — code reference test
Without opening files:
- What's the input:output price ratio for Claude Sonnet? → 1:5
- What's the cost reduction from prompt caching? → ~10× on cached input
- What's a full `/aipe:study` run cost roughly? → ~$30 uncached, ~$6 cached
