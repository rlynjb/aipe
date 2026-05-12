# Single-purpose chains vs agent loops

**Industry name(s):** Constrained chain, deterministic pipeline, "anti-agent" pattern
**Type:** Industry standard

> Many real production LLM features don't need agent loops — they need one well-shaped prompt with one well-defined input and one well-defined output.

**See also:** → [07-prompt-engineering-discipline](07-prompt-engineering-discipline.md) · → [21-agents-vs-chains](21-agents-vs-chains.md)

---

## Why care

You've seen a team reach for an agent framework (LangChain, AutoGen) to solve a problem that turns out to be one LLM call wrapped in a prompt — and watched the framework's overhead, abstractions, and unpredictability add weeks to the timeline while the simple solution would have shipped in a day.

The pattern is *do the simplest thing that could possibly work*. Single-purpose chains are the LLM-shaped equivalent. Same shape as "function, not class" in OOP, "REST, not RPC" in API design — pick the lighter abstraction unless the heavier one earns it.

---

## How it works

One prompt, one output, one purpose — never an agent.

### What a single-purpose chain looks like

Inputs declared, outputs declared, prompt does one thing. No loop, no tool calls back to the LLM, no "self-correction" phase.

```
input  → prompt → output
```

If the output is wrong, you don't retry with a different system message; you fix the prompt. The prompt is the unit of iteration.

### What aipe does (load-bearing)

Every `/aipe:<type>` command is a single-purpose chain. The wrapper says: scaffold (if needed), load context, load template, branch on existing, generate or update, STOP. There's no agent loop. The host agent reads the wrapper and executes it as a sequence; it doesn't iterate, doesn't self-evaluate, doesn't retry.

Even `/aipe:study`, which generates 65 files, is structurally one chain per file. The wrapper iterates over the inventory; each file is one prompt → one output. No file is generated through "agent reasons about whether this concept needs a file."

```
/aipe:study CREATE mode
─────────────────────
Step 5C: plan inventory
Step 6C: for each concept_in_inventory:
            prompt → file_output (single chain per file)
            ↓
         write file
Step 10C: generate READMEs
Step 11C: report + STOP
```

If you're coming from frontend, this is the difference between a `useEffect` that runs once on mount and an interval that polls forever. Single-purpose is fire-and-forget; agent loop is monitor-and-react.

### Why aipe avoids agent loops

Three reasons:

1. **Reliability.** Single-purpose chains are easier to test, easier to reason about, easier to recover from. The user knows what input went in and what output came out.
2. **Cost.** Agent loops can run for many turns; cost is unbounded. Single chains are one round of input + output.
3. **Spec correctness.** A spec is a document; "the agent decided to take another pass" doesn't help. The user wants one spec, then to decide if it's right.

### The principle — match the abstraction to the problem

If your problem is "transform A to B once," use a chain. If your problem is "explore a search space," use an agent. Don't use an agent because it sounds sophisticated; use it because the problem is genuinely loopy.

The full picture is below.

---

## Single-purpose chains vs agent loops — diagram

```
Single-purpose chain (aipe shape)
─────────────────────────────────
                     ┌─────────┐
   input  ─────────▶│ prompt  │─────────▶ output
                     └─────────┘

  one round, deterministic shape


Agent loop (NOT aipe shape)
─────────────────────────────────
                   ┌──────────────┐
   input  ────────▶│ LLM reasons  │
        ▲          └──────┬───────┘
        │                 │
        │                 ▼
        │           ┌──────────────┐
        │           │ tool call    │
        │           └──────┬───────┘
        │                  │
        └──────────────────┘
              loop until termination

  N rounds, stochastic shape, unbounded cost
```

---

## In this codebase

**Load-bearing case for aipe.** Every wrapper is a single-purpose chain (or sequence of single-purpose chains).

- `/aipe:feature` — one chain: load template + context → generate spec → STOP. No loop.
- `/aipe:study` CREATE — N chains in sequence (one per concept file). Each chain is single-purpose; no chain iterates.
- `/aipe:study` UPDATE — N chains for the diff + per-file repair, all single-purpose. No agent decides "should I diff this file or that one?"

The 8-step contract (from [02-per-spec-type-contract](../01-system-design/02-per-spec-type-contract.md)) is the single-purpose-chain shape generalised.

Curriculum tags C1.10 as `learn-only` for loopd (defended in Phase 4 framing). For aipe, the concept is the structural choice that gives aipe its predictability.

---

## Elaborate

### Where this pattern comes from

The "single-purpose chain vs agent" framing crystallised in 2024 with Anthropic's "Building effective agents" post and similar discussions in DSPy / LangChain communities. Before that, the agent-everywhere assumption dominated; the pendulum swung back when production systems found agent loops fragile and expensive.

### The deeper principle

Use the smallest abstraction that works. Chains are smaller than agents; pick chains until you can't.

### Where this breaks down

When the problem is genuinely loopy. Exploring a code search space, browsing the web for an answer, debugging by running tests and reading errors — these are agent-shaped. The fix is to recognise the difference: "transform A to B" is a chain; "find A given vague constraints" is an agent.

### What to explore next

- [21-agents-vs-chains](21-agents-vs-chains.md) → when agents do earn their place
- Anthropic's "Building effective agents" — the canonical framing
- DSPy modules — chains as composable program units

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Single-purpose chain     │ Agent loop                  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Cost / call      │ One round of LLM         │ N rounds (unbounded)        │
│ Latency          │ ~1–10s                   │ ~5–60s (or longer)          │
│ Reliability      │ ~95% — input/output      │ ~70–85% — depends on        │
│                  │ contract holds           │ agent's chain of choices    │
│ Implementation   │ Prompt + parse           │ Prompt + tool registry +    │
│                  │                          │ loop + termination logic    │
│ Debugging        │ One prompt to inspect    │ N-step trace to reconstruct │
│ Failure blast    │ Wrong output once        │ Wrong output OR infinite    │
│                  │                          │ loop OR runaway cost        │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe can't do exploratory work. `/aipe:study` can't decide "this codebase needs an extra section" — the inventory is determined up-front by the curriculum + codebase scan. If the right answer required the agent to discover a pattern by tool use, aipe couldn't reach it.

### Sub-block 2 — what the alternative would have cost

Agent-shaped aipe would have unbounded cost, longer latency, lower reliability. A `/aipe:study` agent that decided what files to generate would sometimes generate 100 files; sometimes 30. Sometimes it'd skip a key concept. Sometimes it'd loop on "should I cover this?" — same prompt run twice. The current shape is predictable: inventory is fixed, files are 1-to-1 with concepts.

### Sub-block 3 — the breakpoint

Fine until a spec type genuinely requires exploration. The closest candidate is `/aipe:implement` (Phase 4A B4A.1) — reading a spec, identifying changes, editing per file, confirming. That's agent-shaped: the agent reads, decides what to edit, edits, checks, iterates. When B4A.1 lands, the agent shape will exist *for that one spec type* — but the others will remain single-purpose chains.

---

## Tech reference (industry pairing)

### Chain frameworks (no framework today)

- **Codebase uses:** none — wrappers are markdown executed by host agents.
- **Why it's here:** the host agent provides the runtime; aipe stays declarative.
- **Leading today:** plain prompts — `adoption-leading` for slash-command plugins, 2026.
- **Why it leads:** zero framework dependency; host agent does the work; declarative shape is auditable.
- **Runner-up:** DSPy — `innovation-leading` for chains-as-program-modules in Python; pulls in runtime.

---

## Project exercises

Curriculum tags C1.10 as `learn-only` (defended in Phase 4 framing). Aipe's load-bearing case is structural — the per-spec-type contract IS single-purpose-chain discipline.

---

## Summary

Single-purpose chains do one prompt → one output, with no loop. aipe's per-spec-type contract is the canonical example: every `/aipe:<type>` invocation is a single chain (or a deterministic sequence of single chains for multi-file specs). The constraint that drove this: predictability, bounded cost, and recoverable failure. The cost being paid: aipe can't do exploratory work — the inventory is fixed by the wrapper, not discovered by the agent.

- aipe's 8-step contract IS single-purpose-chain discipline.
- Multi-file specs (like `/aipe:study`) are N chains in sequence, not one agent loop.
- The pattern trades exploration for predictability.
- The breakpoint is the future `/aipe:implement` — genuinely agent-shaped work.

---

## Interview defense

### Likely questions

**Q [mid]:** What's a single-purpose chain?

**A:** One prompt, one input contract, one output contract, no loop. The opposite of an agent loop where the LLM reasons about what to do next and iterates. aipe's wrappers are all single-purpose chains.

**Q [senior]:** Why didn't you use an agent framework for `/aipe:study`?

**A:** `/aipe:study` is deterministic transformation work: walk an inventory, generate one file per item. There's no "decide what to do" — the wrapper says exactly what to do. Agent frameworks add overhead (registry, loop, termination) for a workload that doesn't need any of it. The current shape — N single-purpose chains in sequence — is predictable, cheaper, and faster.

```
Today: N single-purpose chains       Hypothetical: agent loop
────────────────────────────────     ─────────────────────────────
walk inventory                       agent: "what should I generate?"
   │                                    │
generate file 1                      agent: "generate file 1"
generate file 2                         │
...                                  agent: "did file 1 look good?"
generate file N                         │
                                     agent: "next, ..."
predictable, bounded                  ─ unbounded, expensive, slow ─
```

**Q [arch]:** When would you switch a spec type from chain to agent?

**A:** When the work genuinely requires exploration. `/aipe:implement` is the canonical case — the agent has to read a spec, decide which files need editing, edit them, run tests, possibly re-edit. That's loop-shaped work; a single-purpose chain can't do it. For `/aipe:implement`, agent makes sense. For everything else, chains.

### The question candidates always dodge

**Q:** Wouldn't an agent produce a better study guide by adapting to the codebase?

**A:** It would produce a *different* study guide every time, with different file counts, different section coverage, different opinions. The user wants predictability — same input produces same output (modulo sampling). An agent would mean two `/aipe:study` runs against the same codebase produce two different layouts. That's worse, not better.

```
Single-purpose chain        Agent
─────────────────────       ─────
same input → similar        same input → wildly different
output across runs          across runs

predictable layout          unpredictable layout
preserved user trust        eroded user trust
```

### One-line anchors

- One prompt, one input, one output, no loop.
- aipe's contract IS single-purpose-chain discipline.
- Multi-file specs are N chains in sequence, not one agent loop.
- Agents earn their place for genuinely exploratory work (`/aipe:implement`).
- The pattern trades exploration for predictability.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw a single-purpose chain and an agent loop side by side.

### Level 2 — Explain it out loud
Explain why `/aipe:study` isn't an agent. Under 90 seconds.

### Level 3 — Apply it to a new scenario

A hypothetical `/aipe:explore` would "browse the codebase and suggest 5 things to spec next." Chain or agent? Why?

### Level 4 — Defend the decision you'd change

"Would you switch `/aipe:study` to agent-shape if it improved file coverage by 20%?"

### Quick check — code reference test
Without opening files:
- What's aipe's chain shape? → the 8-step contract
- Why no agents? → predictability and bounded cost
- When would you reach for an agent? → `/aipe:implement` (Phase 4A)
