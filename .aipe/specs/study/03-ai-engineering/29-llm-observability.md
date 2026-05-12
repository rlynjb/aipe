# LLM observability

**Industry name(s):** Tracing, spans, replay, LLM trace logs
**Type:** Industry standard

> When the LLM gives a weird answer, can you replay the exact call to see why? That's observability — and it's mandatory for production LLM systems.

**See also:** → [30-observability-tools](30-observability-tools.md)

---

## Why care

You've shipped an LLM feature and gotten a user report: "the answer was wrong on Tuesday." You have no idea what prompt was sent, what model was used, what the raw response was. Debugging without traces is impossible.

The pattern is *structured logs for stochastic systems*. Same shape as APM (application performance monitoring) for web services — when behaviour is non-deterministic, you need replay.

---

## How it works

Log every LLM call's inputs (prompt, model, params), outputs (raw response, tokens, latency), and metadata (request ID, user ID if applicable). Store with enough detail to replay.

```
trace record:
  request_id: abc123
  timestamp: 2026-05-12T14:30:00Z
  model: claude-sonnet-4-6
  prompt: "..."
  params: {temperature: 0.7, top_p: 0.9}
  response: "..."
  tokens: {input: 1500, output: 350}
  latency_ms: 2400
```

### For aipe

aipe doesn't log directly. Host agents may log; aipe doesn't surface it.

Curriculum's B3.11 anchors a local `ai_trace` table for loopd. For aipe, the equivalent would be writing trace records to `.aipe/.traces/` per command invocation — not currently shipped.

---

## LLM observability — diagram

```
Trace record per call

[user types /aipe:feature add dark mode]
         │
         ▼
[trace start: request_id=abc, t=14:30:00]
         │
         ▼
[load context + template + prompt]
         │
         ▼
[trace: prompt body, params logged]
         │
         ▼
[host agent calls LLM]
         │
         ▼
[trace: response, tokens, latency logged]
         │
         ▼
[trace end: 14:30:02, total 2.4s, $0.05]
         │
         ▼
[trace stored at .aipe/.traces/abc.json]
```

---

## In this codebase

**Not implemented.** aipe defers to host agent for tracing; host agents (Claude Code, Codex CLI) have their own logs but don't expose them to aipe wrappers.

Hypothetical: aipe could write trace records to `.aipe/.traces/` per command invocation. Useful for debugging surprise spec outputs. Not anchored to a Build item for aipe.

---

## Elaborate

### Where this pattern comes from

APM (DataDog, New Relic) since 2010s; LLM-specific observability (Langfuse, Phoenix, Arize) since 2023.

### The deeper principle

Stochastic systems need replay capability. Without it, every weird behaviour is unfixable.

### Where this breaks down

When traces aren't stored long enough — a user report from 30 days ago can't be debugged if traces are 7-day retention.

### What to explore next

- [30-observability-tools](30-observability-tools.md) → specific tools
- DataDog / Langfuse / Phoenix docs

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Trace everything         │ No tracing                  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Storage          │ ~10 KB per call          │ 0                           │
│ Debug capability │ Replay any call          │ "It worked on my machine"   │
│ Privacy          │ Prompts/outputs stored   │ No data retained            │
│ Implementation   │ Trace logger per call    │ None                        │
│ Failure mode     │ Storage fills disk       │ Bug reports unfixable       │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe has no trace storage. Bug reports about spec outputs are hard to debug — user has to copy-paste the wrapper, context, and output.

### Sub-block 2 — what the alternative would have cost

A `.aipe/.traces/` directory per invocation would accumulate quickly. Auto-pruning policy needed.

### Sub-block 3 — the breakpoint

When users report spec-quality issues that the maintainer can't reproduce, tracing earns its place.

---

## Tech reference (industry pairing)

### LLM tracing

- **Codebase uses:** none.
- **Leading today:** Langfuse (self-hostable) — `adoption-leading`, 2026.
- **Runner-up:** Phoenix / Arize — `innovation-leading` for open-source ML observability.

---

## Project exercises

Loopd's B3.11 (local `ai_trace` table). No aipe-specific Build item.

---

## Summary

LLM observability stores prompt + response + metadata per call. aipe doesn't trace; host agents do, opaquely. The constraint: no host-trace exposure to aipe wrappers. The cost: user-reported quality issues are hard to debug.

- Trace records: prompt, params, response, tokens, latency.
- aipe doesn't trace; host agent does opaquely.
- Loopd's B3.11 is the anchor; aipe equivalent is unbuilt.

---

## Interview defense

### Likely questions

**Q [mid]:** What's in an LLM trace?

**A:** Prompt, model, params, response, tokens, latency, metadata. Enough to replay the call.

**Q [senior]:** Why doesn't aipe trace?

**A:** Host agents already trace their own LLM calls; aipe is a markdown plugin without direct LLM access. Adding tracing inside the wrapper would duplicate the host's work.

**Q [arch]:** When would aipe add its own traces?

**A:** If user reports about spec quality became common and host-side traces weren't accessible to the maintainer.

### The question candidates always dodge

**Q:** Storage cost of tracing?

**A:** ~10 KB per call, ~$0.01 per 1M traces in cheap blob storage. Negligible unless retention is years.

### One-line anchors

- Trace inputs + outputs + metadata.
- aipe defers to host agent.
- Loopd's B3.11 anchors the pattern.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the trace flow per command.

### Level 2 — Explain it out loud
Why is tracing mandatory for production LLMs? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user reports `/aipe:study` produced bad output last week. What do you need to debug it?

### Level 4 — Defend the decision you'd change

"Would you add `.aipe/.traces/` per command?"

### Quick check — code reference test
Without opening files:
- aipe tracing today? → no
- Loopd Build item? → B3.11
- Trace fields? → prompt, params, response, tokens, latency
