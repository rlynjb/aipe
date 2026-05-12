# Error recovery in agents

**Industry name(s):** Agent error recovery, tool failure handling, retry-with-context
**Type:** Industry standard

> Tool calls fail. The agent has to detect, decide whether to retry, and recover without infinite loops.

**See also:** → [32-agent-loop](32-agent-loop.md)

---

## Why care

You've watched an agent retry the same failing tool 5 times in a row and run out of budget. Without explicit error-recovery logic, agents are fragile.

The pattern is *fail, reason about failure, choose next action*. Same as exception handlers — observe, decide, recover.

---

## How it works

1. Tool returns error.
2. Agent reads error message.
3. Decision: retry (with different args), try different tool, ask user, give up.

### For aipe

Phase 4A B4A.5 anchors "Failure modes + mitigations" for `/aipe:implement`. Likely modes: file-not-found (ask user), syntax error in edit (retry with corrected diff), tool unavailable (ask user).

---

## Error recovery — diagram

```
Per-tool-failure

  tool returns error
       │
       ▼
  agent reads error message
       │
       ▼
  decide:
       ├─ retry with different args
       ├─ try different tool
       ├─ ask user for help
       └─ give up + report
```

---

## In this codebase

**Phase 4A target.** Not yet implemented.

---

## Elaborate

### Where this pattern comes from

Classical exception handling. Applied to agents around 2023 in agent frameworks.

### The deeper principle

Failure is data; reason about it.

### Where this breaks down

When the same failure repeats — agent has to know "I already tried this."

### What to explore next

- LangGraph's error handling
- Anthropic's "Building effective agents"

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Explicit recovery        │ No recovery (fail fast)     │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Robustness       │ Higher                   │ Lower                       │
│ Implementation   │ Per-tool error handlers  │ None                        │
│ Loop risk        │ Infinite retry possible  │ Stops on first failure      │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe has no agents; nothing to recover.

### Sub-block 2 — what the alternative would have cost

Fail-fast `/aipe:implement` would abort on transient errors (file lock, race).

### Sub-block 3 — the breakpoint

`/aipe:implement` ships with B4A.5 documented modes.

---

## Tech reference (industry pairing)

### Error recovery patterns

- **Codebase uses:** none.
- **Leading today:** custom per-tool handlers — `adoption-leading`, 2026.

---

## Project exercises

### [B4A.5] Failure modes + mitigations

- **Exercise ID:** `[B4A.5]`
- **What to build:** Document failure modes for each tool in `/aipe:implement`: file-not-found, permission-denied, syntax-error-in-edit, user-cancellation. Document mitigation per mode.
- **Why it earns its place:** prevents infinite retry loops; gives users a clear path when tools fail.
- **Files to touch:** `specs/implement.md`, `commands/implement.md`.
- **Done when:** every tool has a documented failure-and-recovery section.
- **Estimated effort:** `1–4hr`.

---

## Summary

Error recovery handles tool failures explicitly. aipe Phase 4A B4A.5 documents `/aipe:implement`'s failure modes. The constraint: silent retries are infinite loops. The cost: per-tool error handlers.

- Tool fails → reason about error → decide next action.
- aipe Phase 4A B4A.5.
- Mitigations: retry, swap tool, ask user, give up.

---

## Interview defense

### Likely questions

**Q [mid]:** Recovery options for an agent tool failure?

**A:** Retry with different args, try a different tool, ask the user, give up. Pick by context.

**Q [senior]:** What's `/aipe:implement`'s recovery story?

**A:** B4A.5 documents per-tool modes. File-not-found → ask user; permission denied → ask user; syntax error in edit → retry with corrected diff; user cancellation → exit.

**Q [arch]:** What's the worst failure mode?

**A:** Silent retry on a deterministic failure — same args, same error, repeat. Mitigation: detect repeat failures, bail.

### The question candidates always dodge

**Q:** Why not just throw and let the user retry?

**A:** Some errors are recoverable in-loop (transient races). Throwing on every error is wasteful when the agent could correct the args.

### One-line anchors

- Tool fail → reason → retry / swap / ask / give up.
- aipe Phase 4A B4A.5.
- Watch for repeat-failure loops.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the failure-handling decision tree.

### Level 2 — Explain it out loud
Why silent retry is dangerous. Under 60 seconds.

### Level 3 — Apply it to a new scenario

`/aipe:implement` tries to edit a file and gets permission denied. What does B4A.5 prescribe?

### Level 4 — Defend the decision you'd change

"Would you cap retries at 1 per tool to prevent loops?"

### Quick check — code reference test
Without opening files:
- aipe Phase 4A error-recovery Build item? → B4A.5
- Recovery options? → retry / swap / ask / give up
- Worst failure mode? → silent infinite retry
