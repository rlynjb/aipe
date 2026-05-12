# Streaming responses

**Industry name(s):** Server-sent events for LLMs, token-by-token streaming, incremental decoding
**Type:** Industry standard

> Tokens arrive as they're decoded, not after the full response is ready — useful for chat UIs, irrelevant for batch generation.

**See also:** → [01-tokenization](01-tokenization.md) · → [25-llm-serving](25-llm-serving.md)

---

## Why care

You've used a chat UI where the response appears word-by-word vs one where it pops in all at once after 8 seconds. The first feels alive; the second feels broken. The difference isn't speed — total latency is roughly the same — it's perceived latency. Streaming hides the latency by giving the user something to look at while the rest decodes.

The pattern is *progressive disclosure of incremental work*. Same shape as `Suspense` with progressive hydration, as buffered HTTP responses, as React server components streaming HTML. The trick is the consumer needs to know how to render incremental output; if it can't, streaming is wasted bandwidth.

---

## How it works

A printer that emits text as it computes, not after.

### The protocol

LLM streaming APIs send a sequence of small payloads (typically JSON over SSE) — each carrying a few new tokens. The client appends to its in-progress buffer and renders.

```
event: content_block_delta
data: {"delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"delta": {"type": "text_delta", "text": " world"}}

event: content_block_stop
data: {}
```

If you're coming from frontend, this is `fetch()` with `response.body.getReader()` — chunked transfer with the chunks being JSON-of-tokens, not raw bytes.

### When it helps

- **Chat UIs.** User sees tokens as they generate; perceived latency = time-to-first-token (≈300–800ms) instead of total response time (≈3–10s).
- **Long-running generation.** A user can read the beginning while the end is still generating.
- **Cancellation.** User can stop the stream mid-response if the answer is heading the wrong way.

### When it doesn't help

- **Batch / programmatic consumers.** If the consumer needs the full output before it can act, streaming adds complexity without benefit.
- **JSON output mode.** Streaming partial JSON is fragile; most consumers wait for the full object.
- **Spec generation.** `/aipe:<type>` writes a markdown file once at the end; streaming wouldn't change the user-visible experience.

### What aipe doesn't do

aipe wrappers don't stream anything — the host agent handles streaming for its own chat UI. From aipe's perspective, every `/aipe:<type>` call is "host agent generates a full file, then writes it" — atomic from the wrapper's viewpoint.

The full picture is below.

---

## Streaming — diagram

```
Streaming vs batch

Batch (no streaming):
   request ─────────────────────[8 s compute]────────────▶ full response
                                                                 │
   user perceived: 8 s of nothing, then the answer               ▼
                                                            renders all
                                                            at once

Streaming:
   request ──[300 ms first token]──▶ tok ─▶ tok ─▶ tok ─▶ ... ─▶ done
                                       │      │      │             │
   user perceived: text appears 300 ms in, scrolls in over 8 s    ▼
                                                            already
                                                            visible
```

---

## In this codebase

**Not implemented.** aipe doesn't stream — the host agent does. `/aipe:<type>` generates a spec file, the file is written at the end, the user reads it after.

Curriculum tags this concept `learn-only` (C1.5: "Streaming responses `[learn-only — loopd has no streaming]`"). It's not anchored to any project build.

---

## Elaborate

### Where this pattern comes from

Server-Sent Events (SSE, 2008) standardised progressive HTTP responses for the web. ChatGPT (2022) popularised token-level streaming in LLM UIs; every API has supported it since. The pattern itself is older — buffered TTY output predates the web.

### The deeper principle

Total latency and perceived latency are different costs. Streaming pays a small total-latency tax (protocol overhead) to drastically reduce perceived latency.

### Where this breaks down

When the consumer can't render incremental output. JSON streaming is the canonical failure mode — partial JSON isn't parseable, so the consumer either buffers (no streaming benefit) or implements partial-JSON parsing (complexity).

### What to explore next

- [25-llm-serving](25-llm-serving.md) → serving patterns where streaming is one option
- HTTP/2 streaming, SSE spec, WebSocket alternatives

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Stream                   │ Wait for full response      │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Perceived latency│ ~300 ms                  │ ~3–10 s                     │
│ Total latency    │ Slightly higher (proto)  │ Slightly lower              │
│ UI complexity    │ Streaming renderer       │ Single render               │
│ Cancellation     │ Mid-stream interrupt     │ No interrupt possible       │
│ JSON output      │ Hard (partial JSON)      │ Straightforward             │
│ Vendor lock-in   │ Same                     │ Same                        │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't stream, so users wait the full host-agent generation time before seeing the spec. For a single-file spec like `/aipe:feature`, that's 5–30 seconds; for `/aipe:study` (multi-file), it can be minutes. Users see a "generating…" indicator in the host UI but no incremental content. The cost is felt; it's acceptable because spec generation is batch work.

### Sub-block 2 — what the alternative would have cost

Streaming spec generation would require the host agent to stream tokens through aipe's wrapper logic. The wrappers are markdown — they don't have streaming logic. Adding it would mean either (a) the host streams to the user directly (bypassing the wrapper's structure) or (b) the wrapper buffers + writes file at end (no streaming benefit). Neither earns its place.

### Sub-block 3 — the breakpoint

Fine until users complain about "what's happening?" during long `/aipe:study` runs. At that point, the right fix is for the host agent to print progress messages ("Generating 01-system-design/03-...") as files complete — incremental file-level progress instead of token-level streaming. Today, host agents (Claude Code, Codex CLI) do print messages, so the breakpoint is already partly mitigated.

---

## Tech reference (industry pairing)

### LLM streaming APIs

- **Codebase uses:** none.
- **Leading today:** Anthropic Messages streaming + OpenAI Chat streaming via SSE — `adoption-leading`, 2026.
- **Runner-up:** WebSocket-based streaming — `innovation-leading` for full-duplex (rare in production LLMs).

---

## Project exercises

No aipe-anchored Build items. `learn-only` per curriculum.

---

## Summary

Streaming sends tokens as they decode rather than waiting for full output. aipe doesn't stream — wrappers are markdown that don't have streaming logic, and spec generation is batch-shaped. The constraint: spec output is a file, not chat. The cost: users wait for the full generation; the host agent's progress messages partly mitigate.

- Streaming reduces perceived latency from 3–10s to ~300ms.
- Best for chat UIs; worst for JSON output and batch generators.
- aipe defers to host agent; no per-wrapper streaming.
- The breakpoint is user complaints about long `/aipe:study` runs.

---

## Interview defense

### Likely questions

**Q [mid]:** What does streaming do for an LLM API?

**A:** Sends tokens as they decode rather than buffering the full response. The first token arrives in ~300ms; the rest stream in over the response time. Total latency is roughly the same; perceived latency is much lower because the user sees output immediately.

**Q [senior]:** Why doesn't aipe stream?

**A:** Wrappers are markdown without streaming logic, and spec output is a file the user opens after generation, not chat they read live. Adding streaming would mean the host agent prints tokens directly to the user (skipping the wrapper) or the wrapper buffers everything (no streaming benefit). Neither earns its place for batch-shaped output.

**Q [arch]:** When would streaming be worth adding to aipe?

**A:** When users start abandoning long `/aipe:study` runs because they can't tell what's happening. The fix there is file-level progress messages (not token-level streaming) — "Generated 01-system-design/03-plugin-distribution.md (12 of 65)" — which the host agent already does. Token-level streaming would be overkill.

### The question candidates always dodge

**Q:** Why not stream just the user-facing parts?

**A:** Because the user-facing parts of `/aipe:study` are *files written to disk*, not tokens to stdout. Streaming would only help if the wrapper printed progressive output, which would compete with the host agent's own progress display.

### One-line anchors

- Streaming = tokens as they decode, not at the end.
- Best for chat; worst for batch / JSON / file output.
- aipe doesn't stream — file output is batch by design.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw batch vs streaming side by side.

### Level 2 — Explain it out loud
Explain why streaming helps chat UIs but not aipe. Under 60 seconds.

### Level 3 — Apply it to a new scenario

If `/aipe:study` had a progress-streaming option ("show me which file you're generating right now"), what would it stream — tokens or file completion events?

### Level 4 — Defend the decision you'd change

"Would you ever add token-level streaming to aipe? Under what condition?"

### Quick check — code reference test
Without opening files:
- What's typical time-to-first-token? → ~300ms
- Does aipe stream? → No
- What's the closest thing aipe has to streaming? → Host agent's own progress messages
