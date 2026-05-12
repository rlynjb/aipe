# Tool / function calling

**Industry name(s):** Tool use, function calling, structured tool invocation
**Type:** Industry standard

> The LLM returns a structured call object (tool name + args); the host runs the tool; the result feeds back to the LLM as context.

**See also:** → [32-agent-loop](32-agent-loop.md) · → [04-structured-outputs](04-structured-outputs.md)

---

## Why care

You've wanted an LLM to take actions (read a file, call an API, run a command) and discovered "just prompt it for JSON" doesn't reliably work. Tool calling makes the action language a first-class API.

The pattern is *structured action calls*. Same shape as RPC — the model emits a typed call; the host dispatches; the result feeds back.

---

## How it works

LLM API takes a list of tool schemas; LLM emits `{tool: name, input: args}`; host parses, runs, returns result; LLM continues.

```
tools: [
  {name: "read_file", input_schema: {path: string}},
  {name: "write_file", input_schema: {path: string, content: string}}
]

LLM output: {tool: "read_file", input: {path: "specs/feature.md"}}
host runs read_file → returns content
LLM receives result, continues
```

### For aipe

Not used in current wrappers (no agent loop). Phase 4A's B4A.2 ("Tool set: file read/write, run command, ask user") is the buildable target for the `/aipe:implement` meta-agent.

---

## Tool calling — diagram

```
Tool call flow

LLM ────emits───▶ {tool: "read_file", input: {path: "..."}}
                      │
                      ▼
                  host runs read_file
                      │
                      ▼
                  result: "file contents"
                      │
                      ▼
LLM ◀────fed back──── result
   continues with new context
```

---

## In this codebase

**Not used.** Phase 4A B4A.2 will introduce a tool set for `/aipe:implement`.

---

## Elaborate

### Where this pattern comes from

OpenAI introduced function calling in mid-2023. Anthropic's tool use followed. Both use JSON Schema for tool definitions.

### The deeper principle

Actions deserve types. Schema-constrained tool calls are more reliable than prompt-parsed actions.

### Where this breaks down

When the tool set is too large or ambiguous — the LLM picks wrong tools. Mitigation: smaller tool sets, clearer descriptions.

### What to explore next

- [32-agent-loop](32-agent-loop.md)
- Anthropic tool use docs, OpenAI function calling docs

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Schema-driven tools      │ Prompt-parsed actions       │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Reliability      │ ~100% well-formed        │ ~85% parseable              │
│ Setup            │ Schemas per tool         │ Just prompt                 │
│ Tool docs        │ In schema description    │ In prompt body              │
│ Failure blast    │ Wrong tool picked        │ Unparseable action          │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't use tool calling because no wrapper is agent-shaped. Phase 4A introduces it.

### Sub-block 2 — what the alternative would have cost

Prompt-parsed actions for `/aipe:implement` would be ~85% reliable; tool calling is ~100%. The 15% reliability gap matters when actions edit files.

### Sub-block 3 — the breakpoint

When `/aipe:implement` lands, tool calling is mandatory.

---

## Tech reference (industry pairing)

### Tool calling APIs

- **Codebase uses:** none today.
- **Leading today:** Anthropic tool use + OpenAI function calling — `adoption-leading`, 2026.

---

## Project exercises

### [B4A.2] Tool set for /aipe:implement

- **Exercise ID:** `[B4A.2]`
- **What to build:** Define tools `file_read`, `file_write`, `run_command`, `ask_user`. Each with JSON Schema input.
- **Why it earns its place:** structured tool calls give reliable file edits.
- **Files to touch:** `specs/implement.md` (template, new), `commands/implement.md` (wrapper, new).
- **Done when:** `/aipe:implement` can edit a file via tool call; tool schemas documented.
- **Estimated effort:** `1–2 days`.

---

## Summary

Tool / function calling makes LLM actions structured and reliable. aipe doesn't use it today; Phase 4A's B4A.2 introduces the tool set for `/aipe:implement`. The constraint: file edits need ~100% reliability; prompt-parsed actions can't deliver that. The cost: tool schema maintenance.

- Schemas + dispatch + result-feedback.
- aipe will use it in Phase 4A.
- Reliability gap: ~100% vs ~85% prompt-parsed.

---

## Interview defense

### Likely questions

**Q [mid]:** What is tool calling?

**A:** The LLM emits a structured `{tool, input}` call; the host runs the tool; the result feeds back. Schema-driven, reliable, the standard for action-taking agents.

**Q [senior]:** Why isn't aipe agent-shaped today?

**A:** Spec generation is single-purpose-chain work (see [10-single-purpose-chains](10-single-purpose-chains.md)). The output is a document, not an action. Phase 4A's `/aipe:implement` is the first agent-shaped use case — that's where tool calling earns its place.

**Q [arch]:** What's the minimum tool set for `/aipe:implement`?

**A:** `file_read` (load spec + current files), `file_write` (apply edits), `run_command` (verify), `ask_user` (confirm). B4A.2 names exactly these.

### The question candidates always dodge

**Q:** Why not use the host's built-in tools (Claude Code already has Read/Edit)?

**A:** Good point — for `/aipe:implement`, leveraging the host's existing tools is cheaper than defining new ones. The wrapper would just instruct the host to use its tools.

### One-line anchors

- LLM emits `{tool, input}`; host dispatches.
- Schema-driven, ~100% reliable.
- aipe Phase 4A B4A.2 introduces tools.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the tool call → dispatch → feedback loop.

### Level 2 — Explain it out loud
Why tool calls vs prompt-parsed actions? Under 60 seconds.

### Level 3 — Apply it to a new scenario

`/aipe:implement` reads a spec and needs to edit 3 files. Walk through the tool calls.

### Level 4 — Defend the decision you'd change

"Would `/aipe:implement` define its own tools or use the host's?"

### Quick check — code reference test
Without opening files:
- aipe Phase 4A Build item for tools? → B4A.2
- Reliability of structured tool calls? → ~100%
- aipe uses tool calling today? → No
