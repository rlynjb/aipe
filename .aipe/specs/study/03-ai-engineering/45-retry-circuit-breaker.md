# Retry and circuit breaker

**Industry name(s):** Retry policy, circuit breaker, fail-fast pattern
**Type:** Industry standard

> Retry transient failures with backoff; trip a circuit breaker on sustained failure to give the upstream a break.

**See also:** → [44-rate-limiting-backpressure](44-rate-limiting-backpressure.md)

---

## Why care

You've watched a service retry a downstream that's been dead for ten minutes and contribute to the outage. Circuit breakers prevent retry-as-DDoS.

The pattern is *fail fast under sustained failure*. Same shape as Hystrix, resilience4j.

---

## How it works

```
state = CLOSED (normal)
on failure:
  consecutive_failures++
  if consecutive_failures > threshold:
    state = OPEN
    return error immediately for cooldown_period
on cooldown end:
  state = HALF_OPEN
  let one request through; if succeeds, → CLOSED; else → OPEN
```

### For aipe

Defers to host. Loopd's B5.4 anchors circuit breaker for "provider outage."

---

## Retry + circuit breaker — diagram

```
States

   CLOSED          OPEN              HALF_OPEN
   ──────          ────              ──────────
   normal          fail fast         test one
   request         (during cooldown) request
   passes through  no upstream call  if ok → CLOSED
                                     if fail → OPEN
```

---

## In this codebase

**Defers to host.** No aipe-side breaker.

---

## Elaborate

### Where this pattern comes from

Nygard's "Release It!" (2007). Standard cloud-native pattern.

### The deeper principle

Sustained failure is upstream's problem; stop adding to their load.

### Where this breaks down

When false-positive trips lock out a healthy upstream. Tune thresholds carefully.

### What to explore next

- Hystrix / resilience4j docs

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Breaker                  │ Just retry                  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Upstream load    │ Reduced during outage    │ Hammers during outage       │
│ Downtime         │ Bounded by cooldown      │ Until upstream healthy      │
│ Implementation   │ State machine            │ Simple retry                │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't have breaker.

### Sub-block 2 — what the alternative would have cost

aipe-side breaker would duplicate host's logic.

### Sub-block 3 — the breakpoint

When sustained host-level outages cause user complaints, breaker logic might earn its place at the host layer.

---

## Tech reference (industry pairing)

### Circuit breaker libraries

- **Codebase uses:** none.
- **Leading today:** resilience4j (Java), opossum (Node) — `adoption-leading`, 2026.

---

## Project exercises

Loopd's B5.4. No aipe Build item.

---

## Summary

Retry + circuit breaker handle transient + sustained failures. aipe defers. The constraint: aipe is markdown. The cost: depends on host.

- Retry transient; break circuit on sustained.
- aipe defers to host.
- Loopd B5.4 anchors.

---

## Interview defense

### Likely questions

**Q [mid]:** What does a circuit breaker do?

**A:** After N consecutive failures, refuse new requests for a cooldown period. Lets upstream recover.

**Q [senior]:** Why both retry and breaker?

**A:** Retry handles transient; breaker handles sustained. Without retry, transient failures kill calls. Without breaker, sustained failures retry-DDoS the upstream.

**Q [arch]:** When does aipe need its own breaker?

**A:** If host-side handling is insufficient and aipe sees repeated failures from the same call path. Today, no.

### The question candidates always dodge

**Q:** Threshold for tripping?

**A:** Depends. Common: 5 consecutive failures or 50% failure rate over 30s window.

### One-line anchors

- Retry transient; break sustained.
- aipe defers to host.
- Loopd B5.4 anchors.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the breaker state machine.

### Level 2 — Explain it out loud
Why both retry and breaker. Under 60 seconds.

### Level 3 — Apply it to a new scenario

Anthropic API is down for 5 minutes. What does aipe see?

### Level 4 — Defend the decision you'd change

"Would you add a per-spec-type breaker in aipe wrappers?"

### Quick check — code reference test
Without opening files:
- Breaker states? → CLOSED / OPEN / HALF_OPEN
- aipe breaker? → none, defers to host
- Loopd Build item? → B5.4
