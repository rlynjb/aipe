# LLM observability tools

**Industry name(s):** Langfuse, LangSmith, Phoenix, Arize, Helicone
**Type:** Industry standard

> The tools that ingest LLM traces and let you search, replay, score, and alert.

**See also:** → [29-llm-observability](29-llm-observability.md)

---

## Why care

You've written your own log line per LLM call and watched the log file grow to gigabytes with no way to search by user, model, or failure. Productionising observability needs a real tool.

The pattern is *use the right database for the data shape*. Traces are append-heavy, query-by-key. Specialised tools beat ad-hoc.

---

## How it works

Pick a tool; send traces via SDK or webhook.

### Common tools

- **Langfuse** — self-hostable; SDK in Python/TS; supports prompt versioning + eval.
- **LangSmith** — hosted (LangChain); deep tracing for chains/agents.
- **Phoenix / Arize** — open-source ML observability; strong evaluation features.
- **Helicone** — hosted; proxy-based (no SDK change); cost analytics focused.

### For aipe

Not implemented. Curriculum's B3.14 anchors loopd to "Evaluate one observability tool: Langfuse self-hosted." Aipe could adopt the same tool if it needed tracing.

---

## Observability tools — diagram

```
Trace flow

   wrapper invokes host LLM
            │
            ▼
       host agent
            │
            ▼ logs to:
   ┌────────────────────────────┐
   │ Langfuse / LangSmith / etc │
   │  (search, replay, scoring)│
   └────────────────────────────┘
            │
            ▼
   maintainer debugs by query
```

---

## In this codebase

**Not used.** aipe doesn't wire to any observability tool.

---

## Elaborate

### Where this pattern comes from

LLM-specific observability tools emerged 2023+ as production LLM apps needed visibility. Each is loosely modelled on APM tools from the web world.

### The deeper principle

Pick one tool, integrate deeply, don't try to maintain a custom solution.

### Where this breaks down

When the tool is hosted-only and privacy concerns matter — Langfuse self-host is the answer for those cases.

### What to explore next

- Langfuse self-host docs
- Phoenix open-source repo

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Hosted (LangSmith)       │ Self-hosted (Langfuse)      │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Setup            │ Account, API key         │ Docker compose + DB         │
│ Cost             │ $0.10+/mo                │ Compute + ops               │
│ Privacy          │ Data leaves machine      │ Stays local                 │
│ Features         │ Polished UI              │ Slightly rougher edges      │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe has no observability tool wired up.

### Sub-block 2 — what the alternative would have cost

Adding Langfuse self-host: Docker + DB + SDK integration per wrapper. Heavy lift for a markdown plugin.

### Sub-block 3 — the breakpoint

When debug requests become common.

---

## Tech reference (industry pairing)

### LLM observability

- **Codebase uses:** none.
- **Leading today:** Langfuse — `adoption-leading` for self-hostable LLM observability, 2026.
- **Why it leads:** open-source, self-hostable, SDK in TS/Python, prompt versioning + eval.
- **Runner-up:** Phoenix / Arize — `innovation-leading` for ML+LLM observability with stronger eval features.

---

## Project exercises

Loopd's B3.14. No aipe Build item.

---

## Summary

Observability tools (Langfuse, LangSmith, Phoenix) ingest LLM traces for search and replay. aipe doesn't use one. The constraint: aipe's host agent already traces opaquely. The cost: aipe's maintainer can't debug user issues across the host boundary.

- Tools: Langfuse, LangSmith, Phoenix, Arize, Helicone.
- aipe doesn't wire to any.
- Loopd's B3.14 picks Langfuse for self-host.

---

## Interview defense

### Likely questions

**Q [mid]:** What's the difference between Langfuse and LangSmith?

**A:** Langfuse is open-source and self-hostable; LangSmith is hosted (by LangChain). Same problem space; different deployment models.

**Q [senior]:** Why pick self-hosted for loopd?

**A:** Privacy — user journal data shouldn't leave the user's machine. Langfuse self-host satisfies that.

**Q [arch]:** Would aipe pick Langfuse if it added tracing?

**A:** Probably — same SDK semantics as loopd, similar self-host story, open-source. Adoption shares investment across the curriculum.

### The question candidates always dodge

**Q:** Why not just `console.log`?

**A:** Storage and search. A log line is a write; an observability tool indexes for query, deduplicates, aggregates. Custom log won't scale past 1k traces.

### One-line anchors

- Langfuse / LangSmith / Phoenix / Arize / Helicone.
- aipe doesn't use any.
- Loopd's B3.14 picks Langfuse self-host.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw trace flow into an observability tool.

### Level 2 — Explain it out loud
Why is `console.log` not enough? Under 60 seconds.

### Level 3 — Apply it to a new scenario

aipe adds `.aipe/.traces/`. Should the tool stay local or ship traces to Langfuse?

### Level 4 — Defend the decision you'd change

"Would you adopt Helicone (proxy-based, zero SDK change)?"

### Quick check — code reference test
Without opening files:
- Self-hostable tool? → Langfuse
- Hosted tool? → LangSmith
- aipe uses? → none
