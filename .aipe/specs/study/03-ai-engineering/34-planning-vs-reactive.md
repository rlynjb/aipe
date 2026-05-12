# Planning vs reactive agents

**Industry name(s):** Planning agent, reactive agent, plan-first vs step-at-a-time
**Type:** Industry standard

> Planning agent writes the whole plan first, then executes. Reactive agent decides one step at a time. Pick by predictability of the environment.

**See also:** → [32-agent-loop](32-agent-loop.md)

---

## Why care

You've watched a reactive agent get distracted by intermediate observations and lose the thread of what it was trying to accomplish. Or you've watched a planning agent commit to a wrong plan and execute it to completion. Each shape has failure modes.

The pattern is *plan vs react trade*. Same shape as classical AI search — forward planning vs reactive policy.

---

## How it works

Planning: write a full plan (file 1, file 2, file 3...), execute it.

Reactive: read the spec, decide next action; act; observe; decide next action again.

### For aipe

Phase 4A B4A.1's `/aipe:implement` is more planning than reactive — the spec IS the plan; the agent reads it and executes against it. The reactive components: user confirmations, error recovery on tool failure.

---

## Planning vs reactive — diagram

```
Planning agent                       Reactive agent
──────────────                       ──────────────
read goal                            read goal
   │                                    │
plan: [step 1, step 2, step 3]      decide step
   │                                    │
execute step 1                       execute
   │                                    │
execute step 2                       observe
   │                                    │
execute step 3                       decide next step (re-eval)
                                        │
                                     repeat

predictable environment              changing environment
                                     ─ reactive better when ─
                                       you don't know what
                                       comes next
```

---

## In this codebase

**Phase 4A B4A.1 = planning-shaped.** The spec is the plan; `/aipe:implement` executes against it.

---

## Elaborate

### Where this pattern comes from

Classical AI planning (STRIPS, 1970s); reactive agents (Brooks, 1986). The plan-react distinction is foundational.

### The deeper principle

Predictable environments reward planning; unpredictable environments reward reaction.

### Where this breaks down

When the plan turns out to be wrong mid-execution. Reactive recovery (or replanning) is needed.

### What to explore next

- Anthropic's "Building effective agents" (the plan-vs-react framing)

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Planning                 │ Reactive                    │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Up-front cost    │ Full-plan LLM call       │ Step-at-a-time              │
│ Mid-execution    │ Plan may be stale        │ Always responsive           │
│ Total tokens     │ Lower (one plan, exec)   │ Higher (many decisions)     │
│ Failure mode     │ Wrong plan executed      │ Distracted / no progress    │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe's `/aipe:implement` is planning-shaped (spec = plan). If the codebase changes mid-implementation (concurrent edits), the plan goes stale.

### Sub-block 2 — what the alternative would have cost

Reactive `/aipe:implement` would re-decide each file edit — more tokens, more decisions, more chances to drift.

### Sub-block 3 — the breakpoint

When user makes concurrent edits during `/aipe:implement`, reactive elements (re-read changed files) earn their place.

---

## Tech reference (industry pairing)

### Agent shapes

- **Codebase uses:** none today.
- **Leading today:** planning + reactive hybrids — `adoption-leading`, 2026.

---

## Project exercises

Part of B4A.1.

---

## Summary

Planning vs reactive trades up-front commitment for mid-execution flexibility. `/aipe:implement` (Phase 4A) is planning-shaped — the spec IS the plan. The constraint: spec generation produces deterministic plans. The cost: stale-plan risk if user edits concurrently.

- Planning = full plan, then execute.
- Reactive = step-at-a-time.
- aipe `/aipe:implement` is planning-shaped.

---

## Interview defense

### Likely questions

**Q [mid]:** Plan vs react?

**A:** Planning agents write the full plan first. Reactive agents decide one step at a time based on current observation.

**Q [senior]:** What's `/aipe:implement`?

**A:** Planning. The spec is the plan; the agent executes it. Reactive elements appear in user confirmations and tool-error recovery, but the macro shape is plan-execute.

**Q [arch]:** When would `/aipe:implement` need to switch to reactive?

**A:** When the codebase changes mid-execution. The spec was written against state X; if state Y emerges between plan and execution, the agent has to replan.

### The question candidates always dodge

**Q:** Are most production agents planning or reactive?

**A:** Most are hybrids — plan-then-react. A high-level plan defines the rough sequence; reactive elements handle errors and concurrent changes.

### One-line anchors

- Planning = full plan, execute.
- Reactive = decide each step.
- `/aipe:implement` is planning-shaped.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw planning vs reactive flows.

### Level 2 — Explain it out loud
Why is `/aipe:implement` planning, not reactive? Under 60 seconds.

### Level 3 — Apply it to a new scenario

User edits a file mid-`/aipe:implement`. What does each shape do?

### Level 4 — Defend the decision you'd change

"Would you make `/aipe:implement` fully reactive?"

### Quick check — code reference test
Without opening files:
- `/aipe:implement` shape? → planning
- Reactive use case? → unpredictable environment
- aipe today? → no agents
