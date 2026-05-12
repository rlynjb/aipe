# Multi-agent orchestration

**Industry name(s):** Multi-agent systems, agent crews, role-based agent design
**Type:** Industry standard

> Multiple agents with different roles coordinating on a task — usually overkill for single-purpose work.

**See also:** → [32-agent-loop](32-agent-loop.md) · → [40-when-not-to-agent](40-when-not-to-agent.md)

---

## Why care

You've seen frameworks like CrewAI and AutoGen sell "multi-agent" as a feature and watched teams build elaborate role-based systems for tasks that one well-shaped agent could handle. The complexity rarely earns its place.

The pattern is *role-based decomposition*. Same shape as microservices — when it works, it's a win; when it doesn't, it's an architectural tax.

---

## How it works

Multiple agents, each with a role (researcher, writer, critic). Orchestrator routes work; agents communicate via shared state or messages.

### For aipe

Curriculum tags C4.8 `[learn-only — interview defense]` — multi-agent is for *defending* design choices, not for building aipe. aipe is single-agent (the host agent runs each wrapper).

---

## Multi-agent orchestration — diagram

```
   orchestrator
        │
   ┌────┼────┐
   ▼    ▼    ▼
researcher writer critic
   │    │    │
   └────┴────┘
        ▼
   shared state
```

---

## In this codebase

**Not used.** Single-agent for the foreseeable future.

---

## Elaborate

### Where this pattern comes from

CrewAI (2023), AutoGen (2023), LangGraph multi-actor patterns. Roots in classical multi-agent systems research.

### The deeper principle

Decomposition is sometimes worth it; usually it's overkill.

### Where this breaks down

When the agents' roles are arbitrary, not from a real task structure. The orchestrator overhead exceeds the per-role benefit.

### What to explore next

- Anthropic "Building effective agents" — argues for simpler shapes
- CrewAI / AutoGen docs

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Multi-agent              │ Single agent                │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Complexity       │ Orchestrator + N agents  │ One loop                    │
│ Per-task tokens  │ N× (each agent re-reads) │ 1×                          │
│ When useful      │ Genuinely parallel roles │ Sequential task             │
│ Failure blast    │ Orchestrator hangs       │ One agent hangs             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe is single-agent. Loses parallel role-based work.

### Sub-block 2 — what the alternative would have cost

Multi-agent aipe would require a planner agent, writer agent, reviewer agent — three times the LLM calls per spec.

### Sub-block 3 — the breakpoint

When aipe genuinely benefits from parallel roles (rare for spec generation).

---

## Tech reference (industry pairing)

### Multi-agent frameworks

- **Codebase uses:** none.
- **Leading today:** CrewAI, AutoGen, LangGraph — `innovation-leading`, 2026.

---

## Project exercises

`learn-only` per curriculum. No Build item.

---

## Summary

Multi-agent orchestration coordinates role-based agents. aipe is single-agent and intentionally so — spec generation doesn't benefit from role decomposition. The constraint: simpler is better when work is sequential. The cost: rules out parallel-role workflows.

- Multiple agents, role-based.
- aipe stays single-agent.
- `learn-only` for interview defense.

---

## Interview defense

### Likely questions

**Q [mid]:** When does multi-agent earn its place?

**A:** When you have genuinely parallel roles — researcher pulls data while writer drafts; critic reviews after. Sequential tasks don't benefit.

**Q [senior]:** Why isn't aipe multi-agent?

**A:** Spec generation is sequential — load context, fill template, generate, stop. No parallel roles; multi-agent would just multiply LLM calls.

**Q [arch]:** Where do multi-agent systems fail?

**A:** When roles are arbitrary, not from task structure. The orchestrator becomes overhead without payoff.

### The question candidates always dodge

**Q:** Why is CrewAI so popular if multi-agent is overkill?

**A:** Some tasks genuinely benefit. The error is generalising "multi-agent" to every problem.

### One-line anchors

- Multi-agent = parallel roles + orchestrator.
- aipe is single-agent.
- Usually overkill; pick deliberately.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw orchestrator + 3 role agents.

### Level 2 — Explain it out loud
Why aipe is single-agent. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A hypothetical `/aipe:research` reads papers, summarises, cites — multi-agent or single?

### Level 4 — Defend the decision you'd change

"Would you split `/aipe:study` into researcher + writer agents?"

### Quick check — code reference test
Without opening files:
- aipe multi-agent? → No
- Curriculum tag? → learn-only
- When does multi-agent earn its place? → genuinely parallel roles
