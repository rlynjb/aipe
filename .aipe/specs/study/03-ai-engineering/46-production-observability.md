# Production observability

**Industry name(s):** Production telemetry, SLOs, dashboards, on-call alerts
**Type:** Industry standard

> What you watch in production: token spend, latency, errors, drift. The signal-set that tells you the system is healthy.

**See also:** → [29-llm-observability](29-llm-observability.md)

---

## Why care

You've shipped an LLM feature and discovered (months later) that costs doubled because of a prompt-regression. Without production telemetry, you find out at month-end via the bill.

The pattern is *real-time visibility*. Same shape as APM dashboards for web apps.

---

## How it works

Four signals.

- **Token spend** ($/hour). Alert on doubling.
- **Latency** (p50, p95, p99). Alert on p95 doubling.
- **Errors** (rate of 4xx, 5xx, parse failures). Alert on rate >5%.
- **Drift** (output distribution changes). Hard to measure; usually rubric-evals on samples.

### SLOs

Service level objectives: numeric thresholds the team commits to. "p95 latency < 3s; error rate < 1%."

### For aipe

aipe doesn't track. Loopd's B5.5 / B5.6 anchor an ops dashboard + SLOs for loopd.

---

## Production observability — diagram

```
Four signals + SLOs

    Token spend ──▶ alert on 2× day-over-day
    Latency p95 ──▶ alert on 2× hourly
    Error rate  ──▶ alert on >5%
    Drift       ──▶ rubric-eval on samples

  SLO: numeric commitment
      "p95 < 3s, errors < 1%, $ < $X/mo"
```

---

## In this codebase

**Not used.** aipe has no production users at scale.

---

## Elaborate

### Where this pattern comes from

SRE practice (Google, 2010s); applied to LLM apps 2023+.

### The deeper principle

Watch the right signals; alert when they drift.

### Where this breaks down

When signals lag — by the time the dashboard shows the regression, users have felt it. Mitigation: real-time alerts.

### What to explore next

- [29-llm-observability](29-llm-observability.md)
- Google SRE book

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Full observability       │ Reactive (bill at month end)│
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Time-to-detect   │ Minutes                  │ Days to weeks               │
│ Setup            │ Dashboard + alerts       │ None                        │
│ Failure mode     │ Alert fatigue            │ Silent regression           │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe has no observability infrastructure.

### Sub-block 2 — what the alternative would have cost

aipe-side telemetry requires a backend — overkill for a markdown plugin.

### Sub-block 3 — the breakpoint

If aipe gained an aipe-hosted service component, observability earns its place.

---

## Tech reference (industry pairing)

### Production telemetry

- **Codebase uses:** none.
- **Leading today:** DataDog, Grafana + Prometheus — `adoption-leading`, 2026.
- **LLM-specific:** Langfuse, Helicone — `innovation-leading`.

---

## Project exercises

Loopd's B5.5 / B5.6. No aipe Build item.

---

## Summary

Production observability watches token spend, latency, errors, drift. aipe doesn't track; no service component. The constraint: aipe is a markdown plugin. The cost: no production telemetry possible.

- Four signals + SLOs.
- aipe doesn't track.
- Loopd B5.5/5.6 anchor.

---

## Interview defense

### Likely questions

**Q [mid]:** Four production signals?

**A:** Token spend, latency (p95/p99), error rate, drift.

**Q [senior]:** What's an SLO?

**A:** A numeric commitment. "p95 latency < 3s; errors < 1%; $ < $5k/month." Alert when violated.

**Q [arch]:** Why doesn't aipe have observability?

**A:** No service component to instrument. The host agent runs the LLM call; aipe is the markdown wrapper that the host reads.

### The question candidates always dodge

**Q:** Could aipe track in `.aipe/.metrics/`?

**A:** Possible but unusual — metrics in a user's repo. The host agent's session telemetry is the right place.

### One-line anchors

- Watch token, latency, errors, drift.
- SLO = numeric commitment.
- aipe defers; loopd implements.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the four signals + SLO.

### Level 2 — Explain it out loud
Why SLOs matter. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user reports `/aipe:study` "feels slow lately." How do you debug without telemetry?

### Level 4 — Defend the decision you'd change

"Would you add `.aipe/.metrics/` per command run?"

### Quick check — code reference test
Without opening files:
- Four signals? → token, latency, errors, drift
- aipe observability? → none
- Loopd Build items? → B5.5 (dashboard), B5.6 (SLOs)
