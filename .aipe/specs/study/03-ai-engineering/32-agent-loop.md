# The agent loop, termination conditions

**Industry name(s):** Agent loop, ReAct loop, iterative agent, termination criterion
**Type:** Industry standard

> Agent = LLM + tools + loop. Loop iterates "decide, act, observe, decide" until a termination condition fires.

**See also:** → [31-tool-calling](31-tool-calling.md) · → [33-react-pattern](33-react-pattern.md)

---

## Why care

You've built an "agent" that ran for 30 iterations and ended in a `RecursionError`. Without explicit termination conditions, agent loops can run forever. The hardest part of an agent is when to stop.

The pattern is *loop with bounded termination*. Same shape as classical AI search (depth-limited DFS, IDA*).

---

## How it works

```
while not terminated:
  decision = LLM(context, available_tools)
  if decision is "done":
    break
  result = run_tool(decision)
  context.append(result)

return final_state
```

### Termination conditions

- **Confidence ≥ threshold:** model says "I'm confident; final answer X."
- **Max iterations:** hard cap (often 5–10).
- **Time budget:** wall-clock limit.
- **No new actions:** if the agent repeats the same action twice, stop.

### For aipe

Phase 4A B4A.3 anchors "Termination conditions documented" for `/aipe:implement`. Likely conditions: confirmation-from-user (the user approves the changes), max iterations (5), or no further changes needed.

---

## Agent loop — diagram

```
Loop with termination

  ┌─▶ context + tools
  │       │
  │       ▼
  │   LLM decides
  │       │
  │   ┌───┴───┐
  │   ▼       ▼
  │  done   tool call
  │   │       │
  │   ▼       ▼
  │  exit   run tool
  │           │
  │           ▼
  │       observe result
  │           │
  └───────────┘  (loop)

Termination:
  - "done" decision
  - max iterations (e.g., 5)
  - time budget
  - repeat detection
```

---

## In this codebase

**Not implemented.** Phase 4A B4A.3 anchors documented termination for `/aipe:implement`.

---

## Elaborate

### Where this pattern comes from

ReAct (Yao et al., 2022) named the canonical agent loop. Anthropic's "Building effective agents" (2024) formalised the practitioner advice.

### The deeper principle

Loops without termination are infinite. Make termination explicit and bounded.

### Where this breaks down

When the model never decides "done" — repeats the same action, makes no progress. Mitigation: progress detection (compare states), iteration cap.

### What to explore next

- [33-react-pattern](33-react-pattern.md)
- Anthropic's "Building effective agents" post

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Bounded agent loop       │ Unbounded                   │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Termination      │ Guaranteed               │ Possibly never              │
│ Cost ceiling     │ Bounded                  │ Unbounded                   │
│ Implementation   │ Explicit conditions      │ Trust the model             │
│ Failure mode     │ Cap hit → incomplete     │ Runaway cost / infinite     │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't have agents; nothing to give up today.

### Sub-block 2 — what the alternative would have cost

Unbounded loops in `/aipe:implement` would risk runaway file edits.

### Sub-block 3 — the breakpoint

Mandatory at Phase 4A; without bounds, `/aipe:implement` is unshippable.

---

## Tech reference (industry pairing)

### Agent frameworks

- **Codebase uses:** none.
- **Leading today:** custom loops + Anthropic SDK / OpenAI SDK — `adoption-leading`, 2026.
- **Runner-up:** LangGraph — `innovation-leading` for graph-shaped agent control flow.

---

## Project exercises

### [B4A.3] Termination conditions documented

- **Exercise ID:** `[B4A.3]`
- **What to build:** Document `/aipe:implement`'s termination conditions: user approves (primary), max 5 iterations (cap), no further changes needed (early exit).
- **Why it earns its place:** prevents runaway agent loops.
- **Files to touch:** `specs/implement.md`, `commands/implement.md`.
- **Done when:** conditions are explicit in the wrapper; testable.
- **Estimated effort:** `<1hr`.

---

## Summary

Agent loop = decide-act-observe-repeat with explicit termination. aipe doesn't have agents; Phase 4A B4A.3 documents termination for `/aipe:implement`. The constraint: agents without bounds are unsafe. The cost: cap may stop work mid-task.

- Loop iterates until termination.
- Termination: done / max iter / time / no progress.
- aipe Phase 4A B4A.3 is the anchor.

---

## Interview defense

### Likely questions

**Q [mid]:** Termination conditions?

**A:** Confidence-done, max iterations, time budget, no-progress. Most agents combine 2-3.

**Q [senior]:** Why is agent loop the hardest part?

**A:** Knowing when to stop. The decide/act/observe parts have well-known shapes; termination is bespoke per use case.

**Q [arch]:** What termination would `/aipe:implement` use?

**A:** User-approval is primary (every edit confirmed). Max-5-iter as safety cap. No-further-changes as early exit when the spec is fully applied.

### The question candidates always dodge

**Q:** Why not just trust the LLM to know when to stop?

**A:** Because it doesn't. Models without explicit termination often repeat the same action or "verify" indefinitely.

### One-line anchors

- Loop: decide → act → observe → repeat.
- Termination is hardest: done / max / time / no-progress.
- aipe Phase 4A B4A.3 documents conditions.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the agent loop with termination branches.

### Level 2 — Explain it out loud
Why is termination the hardest part? Under 60 seconds.

### Level 3 — Apply it to a new scenario

`/aipe:implement` is editing 3 files. What ends the loop?

### Level 4 — Defend the decision you'd change

"Would you ship `/aipe:implement` with unbounded iterations if the host had its own cap?"

### Quick check — code reference test
Without opening files:
- aipe agent loops today? → none
- Phase 4A Build item? → B4A.3
- Most reliable termination signal? → user approval
