# AI features in this codebase

**Industry name(s):** Meta-overview, app-level AI inventory
**Type:** Project-specific

> The honest answer to "what AI does aipe actually use?" — it doesn't call any AI directly. The host agent does, and aipe is the prompt-engineering discipline applied to those calls.

**See also:** → [07-prompt-engineering-discipline](07-prompt-engineering-discipline.md) · → [00-overview](../00-overview.md)

---

## Why care

You've used a tool advertised as "AI-powered" and discovered the AI is a thin wrapper around someone else's API. The honest framing matters: knowing where the AI lives (and where it doesn't) tells you what aipe is genuinely responsible for.

The pattern is *meta-honest tooling*. Aipe is a *prompt engineering* tool, not an AI app. Calling it an "AI tool" is technically true (its output goes into AI agents) but misleading without context.

---

## How it works

aipe contributes prompt templates, slash commands, and a file layout. The host agent (Claude Code, Codex CLI) does the actual model inference.

### Where AI lives

```
USER
  │ /aipe:feature add dark mode
  ▼
HOST AGENT  ← runs the LLM call
  │
  │ reads commands/feature.md (aipe-supplied)
  │ reads specs/feature.md (aipe-supplied)
  │ reads .aipe/project/context.md (user-supplied)
  │ generates spec output using its own model
  ▼
SPEC FILE (output)
```

aipe's contribution: the prompts (templates + wrappers). The host's contribution: the model, the inference, the API call.

### The features (in aipe terms)

| Feature | Aipe's role | Host's role |
|---|---|---|
| `/aipe:feature ...` | Template + wrapper + context | LLM inference |
| `/aipe:debugging ...` | Template + wrapper + context | LLM inference |
| `/aipe:study` | Template + 65-file orchestration + UPDATE mode | LLM inference per file |
| `/aipe:audit ...` | Template + wrapper + context | LLM inference |
| (... 7 more spec types) | Template + wrapper + context | LLM inference |

### What aipe does NOT do

- Call LLM APIs
- Embed text (no RAG yet — Phase 2B target)
- Run inference
- Store traces
- Manage rate limits or retries
- Pick models

All of these belong to the host agent, by design.

---

## In this codebase

**The 11 spec types are aipe's "AI features."** Each:
- Lives as `commands/<type>.md` + `skills/<type>/SKILL.md` + `specs/<type>.md`.
- Produces structured spec output via the host's LLM call.

**The notable consumer surfaces:**
- All 11 spec types use the host agent's default model + sampling.
- `/aipe:study` is the largest — 65 files per CREATE run; UPDATE-mode diff each file.
- No spec type calls LLMs directly; all go through the host.

**Phase 2B (deferred):** RAG over project context — `commands/index.md` + retrieval in each Step 2. Would add aipe's first direct embedding-API call.

**Phase 4A (deferred):** `/aipe:implement` — first agent-shaped spec type. Tool-calling, planning, error recovery.

---

## Elaborate

### Where this pattern comes from

"AI-powered tool" became a marketing tag in 2023; the honest "we're a prompt-engineering toolkit, not an AI service" framing is rarer.

### The deeper principle

Where the AI lives matters. aipe is at the prompt-engineering layer; the host agent is at the inference layer.

### Where this breaks down

When users expect aipe to be the AI (and direct support questions accordingly). The fix is documentation that names the boundary clearly.

### What to explore next

- [07-prompt-engineering-discipline](07-prompt-engineering-discipline.md)
- [00-overview](../00-overview.md)

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ "Prompts only" framing   │ "Full AI service" framing   │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Build cost       │ Markdown only            │ AI service infrastructure   │
│ User confusion   │ "Wait, aipe doesn't call │ Aligns with user expectation│
│                  │ AI?" — small at first    │ but oversells               │
│ Versatility      │ Works with any host      │ Locked to one provider      │
│ Honesty          │ High                     │ Lower                       │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Some user confusion. Some users assume aipe calls Claude / OpenAI directly.

### Sub-block 2 — what the alternative would have cost

Aipe as an AI service would require a backend, API integration, billing, auth — every weight a plugin avoids.

### Sub-block 3 — the breakpoint

Not applicable — aipe will not become an AI service.

---

## Tech reference (industry pairing)

### Plugin-only AI tooling

- **Codebase uses:** markdown wrappers + templates.
- **Leading today:** plugin marketplaces (Claude Code, Codex) — `adoption-leading`, 2026.

---

## Project exercises

Cross-references all curriculum Build items targeted at aipe — B1.7, B2B.1–B2B.6, B4A.1–B4A.5. See [07-prompt-engineering-discipline](07-prompt-engineering-discipline.md) and Phase 2 / Phase 4 concept files for specifics.

---

## Summary

aipe's "AI features" are 11 prompt templates + wrappers; the host agent does the actual LLM work. aipe doesn't call APIs, embed text, or manage inference — all that belongs to the host. The constraint that drove this: zero-runtime markdown plugin. The cost being paid: occasional user confusion about where AI lives.

- 11 spec types = 11 prompt templates + wrappers.
- Host agent does inference; aipe contributes prompts.
- Phase 2B adds first direct embedding call (deferred).
- Phase 4A adds first agent-shaped spec type (deferred).

---

## Interview defense

### Likely questions

**Q [mid]:** What "AI" does aipe actually do?

**A:** None directly. aipe is markdown prompts + wrappers. The host agent (Claude Code, Codex CLI) runs the LLM calls using prompts aipe supplies.

**Q [senior]:** Why doesn't aipe just call APIs?

**A:** Because the host agent already runs an LLM in the user's session — duplicating that would mean two LLM calls per command, two API keys, two billing surfaces. The host's existing model is enough.

**Q [arch]:** Will aipe ever become an AI service?

**A:** No. The "plugin only, zero runtime" invariant is load-bearing. If aipe gained a backend, it'd compete with hosting + auth + billing concerns that markdown distribution avoids.

### The question candidates always dodge

**Q:** Isn't a prompt template still "AI"?

**A:** Strictly, the AI is the model. Templates are prompt engineering — the discipline applied to LLM inputs. Calling templates "AI" conflates the input shape with the inference. The honest framing is "aipe is a prompt-engineering toolkit; host agents are AI services; aipe makes host agents' outputs project-shaped."

### One-line anchors

- aipe contributes prompts; host agents do inference.
- 11 spec types, zero direct LLM calls.
- Phase 2B / 4A add direct calls (deferred).

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw user → host → aipe-prompt → LLM → output.

### Level 2 — Explain it out loud
Explain "aipe doesn't call AI" to a curious friend. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user complains "aipe doesn't work with Claude 3.5 Sonnet." What's the right answer?

### Level 4 — Defend the decision you'd change

"Would you make aipe a hosted service if it would 10× adoption?"

### Quick check — code reference test
Without opening files:
- AI features count? → 11 spec types
- Direct LLM calls in aipe? → zero
- Where is the AI? → host agent
