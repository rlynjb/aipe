# Provider-agnostic chain design

**Industry name(s):** Provider abstraction, vendor-neutral prompts, multi-model compatibility
**Type:** Industry standard

> Design prompts so they work across Claude, GPT, Llama, Gemini without rewrites — the abstraction is the prompt's shape, not a runtime adapter.

**See also:** → [07-prompt-engineering-discipline](07-prompt-engineering-discipline.md) · → [10-single-purpose-chains](10-single-purpose-chains.md)

---

## Why care

You've built an LLM feature on GPT-4 and watched the next quarter's budget review say "switch to Claude," and discovered every prompt referenced GPT-isms (system message format, tool-call syntax, response-format flags) that don't translate. The cost of the switch wasn't the API call — it was the prompts.

The pattern is *vendor-neutral artifact design*. Same shape as writing SQL that runs on multiple Postgres versions, or HTML that renders in multiple browsers. The trick is to know which features are common and which are provider-specific, and to stay in the common subset for portability.

---

## How it works

A prompt that doesn't name its provider.

### What provider-agnostic looks like

A prompt that:
- Uses common-subset features: plain text instructions, JSON output requests via prompt (not via `response_format` field), structured examples, explicit step-by-step instructions.
- Avoids provider-specific tokens: Claude's `<assistant>` / `<user>` tags, OpenAI's `system` role in raw API form, Gemini's function-call schema.
- Doesn't rely on undocumented behaviour ("Claude is good at X; we depend on it").

### What aipe does (load-bearing case)

aipe is provider-agnostic by structural design. Every template is markdown — the universal LLM input format. No template references a specific model's quirks. The host agent picks the model; aipe doesn't care which.

```
specs/feature.md uses:                  Provider-specific would have used:
─────────────────────                   ─────────────────────────────────
"Step 1 — Initialize if needed..."      <claude_system>...</claude_system>
"Read the template at:"                 function_call: {name: ..., args: ...}
"## Output"                             response_format: {type: "json_object"}
```

If you're coming from frontend, this is like writing CSS without browser prefixes — stay in the standardised subset and the same code works across vendors.

### Where the abstraction lives

For aipe, the abstraction is the wrapper file format. `commands/<type>.md` and `skills/<type>/SKILL.md` differ only in env-var name (`${CLAUDE_PLUGIN_ROOT}` vs `${CODEX_PLUGIN_ROOT}`). The body — the actual prompt — is byte-identical.

This works because both host agents (Claude Code, Codex CLI) execute markdown wrappers the same way: they read the wrapper, follow its instructions, generate output using whatever model the user has configured. The wrapper doesn't care if the underlying call goes to Sonnet, GPT, or Llama.

### The principle — abstraction by restraint, not adapter

The cheapest provider-agnostic design is to stay in the common subset. Adapter layers (one shape of prompt with a runtime translator to each provider's specific format) are heavier and earn their place only when feature divergence is real. aipe doesn't have an adapter; it has restraint.

The full picture is below.

---

## Provider-agnostic chains — diagram

```
Provider-specific (the failure mode)            Provider-agnostic (aipe)
─────────────────────────────────              ─────────────────────────

prompt = {                                      prompt = """
  "role": "system",                              # Spec generation
  "content": "...",                              ## Step 1 — ...
  "model": "gpt-4o",                             ## Step 2 — ...
  "tools": [...],                                """
  "response_format": {...}
}                                               (same markdown, works
                                                 against any model)
↓ tied to OpenAI's API shape                    ↓ vendor-neutral
                                                  by structural design
breaks when switching to Claude
```

---

## In this codebase

**Provider-agnostic by structure.** No template or wrapper references a specific model or provider. The 11 templates work against whichever model the host agent runs.

In practice today: Claude Code runs Claude Sonnet 4.6 (default), Claude Opus 4.7 (premium), Claude Haiku 4.5 (fast tier); Codex CLI runs configurable models. Aipe is silent on which model — the templates work against all of them.

The curriculum tags this concept covered for aipe via the cross-anchor with loopd's B1.6 ("Provider-swap eval: all 5 chains on Claude → OpenAI on same 10 fixtures. Document divergences."). For aipe, the discipline transfers — and the structural agnosticism is one of the load-bearing reasons the byte-identical-mirror invariant from [01-template-source-of-truth](../01-system-design/01-template-source-of-truth.md) is even possible.

---

## Elaborate

### Where this pattern comes from

Cross-vendor LLM compatibility became a practical concern in 2023 as multiple frontier models (GPT-4, Claude 2, Llama 2) became viable for production. LiteLLM, LangChain's `Chat*` classes, and Continue.dev's provider abstraction all formalised the runtime-adapter approach. The "stay in the common subset" approach is older — it's how cross-database SQL has been written for decades.

### The deeper principle

The cheapest abstraction is the one you don't write. Restraint at the artifact layer beats adapter layers at the runtime layer when the feature divergence is small.

### Where this breaks down

When provider-specific features become load-bearing. If aipe needed Claude's structured outputs feature, or OpenAI's logprobs, the markdown-only design wouldn't fit. The fix would be to add a per-provider variant of the wrapper that the host picks based on its configuration — adding the adapter layer the current design avoids.

### What to explore next

- [04-structured-outputs](04-structured-outputs.md) → where provider-specific features start to matter
- LiteLLM, LangChain `BaseChatModel` — runtime adapter implementations
- Continue.dev's provider abstraction — IDE-side provider switching

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Stay in common subset    │ Adapter layer per provider  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Up-front cost    │ Just write markdown      │ Build N adapters            │
│ Feature ceiling  │ Common subset only       │ Full per-provider features  │
│ Maintenance      │ One template, all        │ N adapters maintained       │
│                  │ providers                │ separately                  │
│ Onboarding       │ "Just markdown"          │ "Learn the adapter shape"   │
│ Failure blast    │ A feature outside common │ One adapter buggy → one     │
│                  │ subset → no go           │ provider broken             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe can't use provider-specific features. Structured outputs (JSON mode, schema-constrained decoding) would be useful for a future `/aipe:implement` consumer — but they're provider-specific in their API shape. Aipe today asks for "output JSON" in the prompt (the universal subset) instead of using OpenAI's `response_format: {type: "json_object"}` or Anthropic's tool use. The reliability difference (~95% vs ~100%) is real but tolerated.

### Sub-block 2 — what the alternative would have cost

Per-provider adapter layers would have required: a runtime layer that translates a generic prompt to provider-specific calls; per-provider config (model names, endpoint URLs, auth tokens); maintenance as providers add/remove features. For a markdown plugin where the host agent already handles provider selection, this would be redundant — the host is doing it once; aipe doing it again is duplication.

### Sub-block 3 — the breakpoint

Fine until a provider-specific feature becomes load-bearing for aipe — e.g., a `/aipe:implement` that depends on schema-constrained decoding for reliable file edits. At that point, the right move is for the host agent's plugin layer to expose the feature uniformly (so aipe's wrapper can request it without naming the provider). If the host doesn't, aipe would need its own per-provider variants of one or two wrappers. That's a contained refactor, not a global one.

---

## Tech reference (industry pairing)

### Provider abstraction layers

- **Codebase uses:** none — aipe uses markdown (the universal substrate).
- **Why it's here:** the host agent handles provider selection; aipe stays neutral.
- **Leading today:** LiteLLM — `adoption-leading` for Python provider abstraction, 2026.
- **Why it leads:** unified API across 100+ providers; drop-in for OpenAI's SDK; community-maintained.
- **Runner-up:** LangChain `BaseChatModel` — `adoption-leading` for typed Python LLM apps; more opinionated, pulls in chain primitives.

---

## Project exercises

No aipe-specific Build item. Curriculum's B1.6 anchors to loopd ("Provider-swap eval on all 5 chains"). For aipe, the concept is structurally present in the templates' design.

---

## Summary

aipe's wrappers and templates are provider-agnostic by structural design — markdown is the universal LLM input format, and no template references provider-specific features. The host agent picks the model; aipe is silent on which. The constraint that drove this: the byte-identical-mirror between Claude Code and Codex CLI surfaces requires neither surface to depend on its provider's specifics. The cost being paid: aipe can't use provider-specific features (structured outputs, logprobs, etc.) without breaking the agnosticism.

- Provider-agnostic by restraint, not by adapter layer.
- Markdown templates are the universal substrate; host agent runs any model.
- The byte-identical-mirror invariant requires structural agnosticism.
- The breakpoint is "first load-bearing provider-specific feature."

---

## Interview defense

### Likely questions

**Q [mid]:** How does aipe stay provider-agnostic without an adapter layer?

**A:** By restraint. Every template is markdown — the universal LLM input format. No template references provider-specific tokens (Claude's tags, OpenAI's `response_format`, Gemini's function-call schema). The host agent (Claude Code / Codex CLI) picks the underlying model; aipe doesn't care.

**Q [senior]:** What features does aipe give up by staying in the common subset?

**A:** Structured outputs (JSON mode, schema-constrained decoding). aipe asks for JSON in the prompt instead of via the API flag, getting ~95% reliability instead of ~100%. For human-readable spec output, the gap is tolerable; for a hypothetical programmatic consumer, it'd be a problem.

**Q [arch]:** When would aipe need to break agnosticism?

**A:** When a provider-specific feature becomes load-bearing for a new spec type. A `/aipe:implement` that depends on schema-constrained decoding for reliable file edits would need either (a) the host agent to expose the feature uniformly, or (b) per-provider wrapper variants. Today no such need exists; the agnosticism holds.

### The question candidates always dodge

**Q:** Why not just pick Claude and optimise for it?

**A:** Two reasons. First, the user picks the host; aipe can't dictate. A user on Codex CLI with their preferred model shouldn't be told "use Claude." Second, even on Claude Code, users have model-tier choices (Haiku/Sonnet/Opus); a single-model-optimised template would break on the tiers it wasn't built for.

```
Single-model (locked)          Provider-agnostic (today)
─────────────────              ─────────────────────────
optimised for Sonnet           markdown works on:
"use Claude tool use"          Sonnet, Opus, Haiku
"use Claude system prompt"     GPT-4o, GPT-4.1
                                Gemini 2.x
fails on:                      Llama 3.x
- Codex CLI users              ─ user's pick ─
- Haiku tier users
- self-hosted Llama
```

### One-line anchors

- Provider-agnostic by structural design (markdown), not adapter layer.
- Aipe gives up provider-specific features; the host picks the model.
- The byte-identical mirror requires structural agnosticism.
- Breakpoint: first load-bearing provider-specific feature.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw provider-specific vs provider-agnostic prompts.

### Level 2 — Explain it out loud
Explain why aipe doesn't have a "Claude adapter" and a "GPT adapter." Under 90 seconds.

### Level 3 — Apply it to a new scenario

A hypothetical `/aipe:implement` needs reliable JSON output to dispatch file edits. How would you preserve provider-agnosticism while still getting reliable JSON?

### Level 4 — Defend the decision you'd change

"Would you ship a Claude-only variant of aipe if the data showed 99% of users were on Claude Code?"

### Quick check — code reference test
Without opening files:
- What's aipe's universal substrate? → plain markdown
- Where does provider selection happen? → in the host agent
- What feature does aipe forgo by staying neutral? → schema-constrained decoding (and similar)
