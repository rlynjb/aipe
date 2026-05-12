# ReAct (Reasoning + Acting)

**Industry name(s):** ReAct, reasoning + acting, interleaved thought-action
**Type:** Industry standard

> Interleave the LLM's reasoning ("I need to read the spec") with action ("call read_file"). Each step has a thought and an action.

**See also:** → [32-agent-loop](32-agent-loop.md)

---

## Why care

You've seen an agent take an action that didn't make sense and discovered you can't tell *why* it took the action. ReAct interleaves explicit reasoning so the decision trail is visible.

The pattern is *make reasoning a first-class step*. Same shape as "explain before doing" — write down why, then do.

---

## How it works

Each loop iteration: reason first, then act.

```
Thought: I need to identify which files the spec wants edited.
Action:  read_file(path="specs/feature.md")
Observation: <file content>
Thought: The spec lists 3 files. I should read them.
Action:  read_file(path="src/auth.ts")
...
```

### For aipe

Phase 4A's B4A.1 anchors `/aipe:implement` as ReAct-shaped. The wrapper would prompt the agent to emit thoughts before each tool call.

---

## ReAct — diagram

```
Per iteration

  ┌─▶ Thought: <reasoning>
  │       │
  │       ▼
  │   Action: <tool call>
  │       │
  │       ▼
  │   Observation: <tool result>
  │       │
  └───────┘ (loop)
```

---

## In this codebase

**Not implemented.** Phase 4A `/aipe:implement` (B4A.1) is the target.

---

## Elaborate

### Where this pattern comes from

Yao et al., 2022 — "ReAct: Synergizing Reasoning and Acting in Language Models."

### The deeper principle

Make reasoning visible. The thought trail is the audit log.

### Where this breaks down

When thoughts get long-winded and crowd the context. Mitigation: cap thought length.

### What to explore next

- Yao et al., 2022 ReAct paper

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ ReAct (thought + action) │ Action-only                 │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Tokens / iter    │ ~2× (thought adds tokens)│ Action only                  │
│ Debuggability    │ Thought trail visible    │ Why? unclear                 │
│ Reliability      │ Higher                   │ Lower                        │
│ Latency          │ +30–50% per iter         │ Faster                       │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't use ReAct today.

### Sub-block 2 — what the alternative would have cost

Action-only `/aipe:implement` would be hard to debug when actions look wrong.

### Sub-block 3 — the breakpoint

When `/aipe:implement` lands, ReAct earns its place.

---

## Tech reference (industry pairing)

### ReAct frameworks

- **Codebase uses:** none.
- **Leading today:** custom ReAct prompts — `adoption-leading`, 2026.

---

## Project exercises

Part of B4A.1 (the `/aipe:implement` build).

---

## Summary

ReAct interleaves reasoning with action — Thought → Action → Observation per iteration. aipe doesn't use it; Phase 4A B4A.1's `/aipe:implement` will. The constraint: visible reasoning = debuggable agents. The cost: 2× tokens, 30–50% latency.

- Thought → Action → Observation, looped.
- aipe Phase 4A target.
- Reasoning visible = debuggable.

---

## Interview defense

### Likely questions

**Q [mid]:** What does ReAct stand for?

**A:** Reasoning + Acting. Each loop step has a thought (reasoning) and an action (tool call).

**Q [senior]:** Why ReAct vs action-only?

**A:** Debuggability. The thought trail makes it possible to audit why the agent took an action. Action-only is faster but opaque.

**Q [arch]:** What does `/aipe:implement` gain from ReAct?

**A:** User-reviewable thought trail. Before each file edit, the agent says "I'm doing this because..." — the user can intercept bad reasoning before the edit lands.

### The question candidates always dodge

**Q:** Won't long thoughts cost too many tokens?

**A:** Yes — cap thought length. ReAct with 200-token thoughts is feasible; with 2000-token thoughts is wasteful.

### One-line anchors

- ReAct: Thought → Action → Observation per iteration.
- Reasoning visible = audit log.
- aipe Phase 4A target (B4A.1).

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the ReAct loop.

### Level 2 — Explain it out loud
Why visible reasoning matters. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A `/aipe:implement` thought is "I need to delete file X." How does the user catch a bad deletion?

### Level 4 — Defend the decision you'd change

"Would you skip ReAct in `/aipe:implement` for speed?"

### Quick check — code reference test
Without opening files:
- ReAct full name? → Reasoning + Acting
- aipe uses ReAct today? → No
- Phase 4A item? → B4A.1
