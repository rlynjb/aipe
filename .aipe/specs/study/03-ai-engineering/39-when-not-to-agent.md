# When *not* to use an agent

**Industry name(s):** Agent-avoidance, chain-vs-agent decision, anti-agent argument
**Type:** Industry standard

> Most production LLM features don't need agents. Single-purpose chains are simpler, cheaper, more reliable. Default to chain; reach for agent only when the work is genuinely loopy.

**See also:** → [10-single-purpose-chains](10-single-purpose-chains.md) · → [32-agent-loop](32-agent-loop.md)

---

## Why care

You've seen a team build an "agent" for what was structurally a single LLM call wrapped in a prompt. Frameworks, tool registries, termination logic — all overhead for work that didn't need any of it. The reaching-for-agents reflex is a real cost in modern AI engineering.

The pattern is *match abstraction to task*. Same shape as "function, not class" in OOP — pick the smaller abstraction unless the bigger one earns it.

---

## How it works

Three questions to decide.

1. **Is the work loopy?** Does the next step depend on the result of the previous? (Yes → agent. No → chain.)
2. **Is the environment unpredictable?** Will the agent encounter cases that require real-time decisions? (Yes → agent. No → chain.)
3. **Do you need exploration?** Does the work involve trying things and observing? (Yes → agent. No → chain.)

If all three are no, use a chain.

### For aipe

`/aipe:feature`, `/aipe:study`, `/aipe:debugging`, etc. — all "no" on all three. They're chains. `/aipe:implement` (Phase 4A) is "yes" — it edits files, observes results, decides next file. That's an agent.

---

## When not to agent — diagram

```
Decision tree

  Need a loop where next step depends on previous?
       │
  ┌────┴────┐
  no        yes ──▶ AGENT
  │
  ▼
  Environment unpredictable?
       │
  ┌────┴────┐
  no        yes ──▶ AGENT
  │
  ▼
  Need exploration?
       │
  ┌────┴────┐
  no        yes ──▶ AGENT
  │
  ▼
  CHAIN (default)
```

---

## In this codebase

**aipe is overwhelmingly chains.** 11 spec types, all chain-shaped. `/aipe:implement` (Phase 4A, future) is the first agent.

---

## Elaborate

### Where this pattern comes from

Anthropic's "Building effective agents" (2024) made the case explicitly. Backlash against agent-everywhere hype around the same time.

### The deeper principle

Reach for less, not more. Default to chains.

### Where this breaks down

When a task is genuinely agent-shaped but you force it into a chain. Symptom: prompts grow elaborate trying to predict all paths the chain might need.

### What to explore next

- Anthropic's "Building effective agents"
- [10-single-purpose-chains](10-single-purpose-chains.md)

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Default-to-chain         │ Default-to-agent            │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Per-call cost    │ Low                      │ High (multiple iterations)  │
│ Reliability      │ High                     │ Lower                       │
│ Complexity       │ Low                      │ High (loops, tools)         │
│ Right work       │ Most production LLM      │ Genuinely exploratory tasks │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't have agents (until `/aipe:implement` lands). Loses exploratory work — but `/aipe:implement` is the right place for exploration, not the other 10 commands.

### Sub-block 2 — what the alternative would have cost

Agent-shaped aipe everywhere would multiply LLM calls per spec, slow generation, reduce reliability.

### Sub-block 3 — the breakpoint

`/aipe:implement` is the breakpoint. Other spec types stay chains.

---

## Tech reference (industry pairing)

### Anti-agent design

- **Codebase uses:** the chain-by-default discipline.
- **Leading today:** Anthropic's "Building effective agents" framing — `adoption-leading`, 2026.

---

## Project exercises

### [B4.6] Write the "when *not* to" section

- **Exercise ID:** `[B4.6]`
- **What to build:** A section in `template-style-guide.md` (B1.7) or in `specs/implement.md` explicitly arguing when chains beat agents, with examples from aipe.
- **Why it earns its place:** the case for restraint needs to be made; without it, future maintainers reach for agents reflexively.
- **Files to touch:** `aipe/template-style-guide.md` (Phase 1 B1.7 artifact) or new section in implementation spec.
- **Done when:** the section names 3 chain-shaped tasks in aipe and 1 agent-shaped one with reasons.
- **Estimated effort:** `1–4hr`.

---

## Summary

Most LLM work is chains; agents are for genuinely loopy / unpredictable / exploratory work. aipe is overwhelmingly chains; `/aipe:implement` will be the first agent. The constraint: default to less. The cost: agent-shaped work has to wait for the right wrapper.

- Three questions: loopy? unpredictable? exploratory? All no → chain.
- aipe is 10 chains + 1 future agent.
- B4.6 documents the discipline.

---

## Interview defense

### Likely questions

**Q [mid]:** When is a chain enough?

**A:** When the work is sequential, predictable, and doesn't need exploration. Most production LLM features.

**Q [senior]:** Why aipe is 10 chains + 1 future agent?

**A:** 10 of the 11 spec types are transform-A-to-B work — load context, generate doc, write file. Sequential, predictable, no exploration. `/aipe:implement` reads a spec, decides what files to edit, edits, verifies — that's loopy, hence agent.

**Q [arch]:** What's the cost of forcing agent-shape on chain-work?

**A:** Multiplied LLM calls, lower reliability, harder onboarding. The wrappers grow elaborate trying to predict all paths.

### The question candidates always dodge

**Q:** Why is "agents-everywhere" so common despite this?

**A:** Frameworks like CrewAI, LangGraph make agents the default. The marketing exceeds the right scope.

### One-line anchors

- Default to chain. Reach for agent only when loop / exploration / unpredictability earns it.
- aipe is 10 chains + 1 agent (`/aipe:implement`).
- Three questions to decide.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the chain-vs-agent decision tree.

### Level 2 — Explain it out loud
Why is `/aipe:study` a chain, not an agent? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A hypothetical `/aipe:research papers about X` — chain or agent?

### Level 4 — Defend the decision you'd change

"Would you ship aipe with `/aipe:study` agent-shaped to allow dynamic file generation?"

### Quick check — code reference test
Without opening files:
- aipe chains today? → 11
- aipe agents today? → 0 (1 planned in Phase 4A)
- Build item to document this? → B4.6
