# Rate limiting and backpressure

**Industry name(s):** Rate limiting, throttling, backpressure, request queueing
**Type:** Industry standard

> LLM APIs have rate limits (RPM, TPM). Hit them and your requests fail. Respond with retries + backoff; under load, push back on the producer.

**See also:** → [45-retry-circuit-breaker](45-retry-circuit-breaker.md)

---

## Why care

You've watched `/aipe:study` halfway through 65 files and hit `429 Too Many Requests`. Without rate-limit handling, the run fails and the partial output is unusable.

The pattern is *flow control under failure*. Same shape as TCP congestion control, async queue backpressure.

---

## How it works

Two responses.

### Retry with exponential backoff

`wait(2^n + jitter); retry; up to N times`.

### Backpressure

When the queue is full, refuse new requests with `503 Service Unavailable`; let producers slow down.

### For aipe

aipe doesn't manage either; host agent does. Loopd's B5.1 anchors "request queue with retry/backoff."

---

## Rate limiting + backpressure — diagram

```
Rate limit hit

   request → API
              │
   429 Too Many Requests
              │
              ▼
   wait(2^attempt + jitter)
              │
              ▼
   retry up to N attempts
              │
              ▼
   succeed or give up
```

---

## In this codebase

**Defers to host.** Claude Code and Codex CLI handle rate limits internally; aipe doesn't see them.

---

## Elaborate

### Where this pattern comes from

Classic distributed-systems patterns. Applied to LLM APIs since 2022.

### The deeper principle

Failure is expected; build it in.

### Where this breaks down

When the rate limit is genuinely too restrictive — no amount of retry saves you. Mitigation: increase the limit (upgrade plan) or reduce load (smaller specs).

### What to explore next

- [45-retry-circuit-breaker](45-retry-circuit-breaker.md)

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Retry + backoff          │ Fail on first 429           │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Reliability      │ ~99% (recovers transient)│ ~80%                        │
│ Latency          │ +retry wait time         │ Immediate fail              │
│ Implementation   │ Retry policy             │ None                        │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't manage; depends on host's policy.

### Sub-block 2 — what the alternative would have cost

aipe-side retries would duplicate host's work.

### Sub-block 3 — the breakpoint

If host's retry policy is insufficient for `/aipe:study`'s 65-file load, aipe could insert pacing (sleep between files).

---

## Tech reference (industry pairing)

### Rate-limit handling

- **Codebase uses:** none directly.
- **Leading today:** exponential backoff + jitter — `adoption-leading`, 2026.

---

## Project exercises

Loopd's B5.1 anchors. No aipe Build item.

---

## Summary

Rate limiting + backpressure handle API throttling. aipe defers to host. The constraint: aipe is markdown; can't manage HTTP retries. The cost: depends on host quality.

- Retry + backoff for transient 429s.
- Backpressure for sustained overload.
- aipe defers to host.

---

## Interview defense

### Likely questions

**Q [mid]:** What does backoff do?

**A:** Waits `2^n + jitter` seconds between retries; jitter prevents thundering-herd retry pile-up.

**Q [senior]:** Why doesn't aipe retry?

**A:** The host agent makes the API call. Retry policy is the host's responsibility; aipe is markdown.

**Q [arch]:** What if host's retry is insufficient for `/aipe:study`?

**A:** Insert pacing between file generations — "sleep 2 seconds before each file" — to stay under rate limits. Not currently done.

### The question candidates always dodge

**Q:** Why include exponential backoff if the host handles it?

**A:** Curriculum-level question — defending knowledge of the concept. aipe doesn't implement it.

### One-line anchors

- Retry + backoff for 429s.
- aipe defers to host.
- Pacing as a fallback at scale.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the retry-with-backoff flow.

### Level 2 — Explain it out loud
Why jitter matters. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user runs `/aipe:study` and hits rate limits halfway through. What does aipe do?

### Level 4 — Defend the decision you'd change

"Would you add pacing between files in `/aipe:study`?"

### Quick check — code reference test
Without opening files:
- Backoff formula? → 2^n + jitter
- aipe handles 429? → No, host does
- Loopd Build item? → B5.1
