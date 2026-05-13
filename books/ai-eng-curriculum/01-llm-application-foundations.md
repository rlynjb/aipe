# Chapter 1 — LLM Application Foundations

**Phase 1 of the curriculum.** Primary project: loopd's five AI chains. Supporting project: aipe (prompt engineering as a discipline). Reading time: 25 minutes.

> The senior interview is mostly this: can you treat an LLM like the unreliable network call it actually is, and engineer around that?

## What an LLM actually is

In one sentence: it's a function from tokens to a probability distribution over the next token, run in a loop.

Not a database. Not a reasoner. Not a planner. Not an oracle. Those are *things people build on top* of the function. The function itself is text → probability distribution → sampled token → append → repeat.

```
                  Input tokens
                       │
                       ▼
              ┌─────────────────────────┐
              │  LLM (frozen weights)   │
              │  Maps tokens to a       │
              │  probability over the   │
              │  next token in the      │
              │  vocabulary             │
              └────────────┬────────────┘
                           │
                           ▼
              Sampled token (according to
              temperature, top-p, top-k)
                           │
                           ▼
              Appended to context, loop
```

If you internalize one thing this chapter: every weird LLM behavior — hallucination, going off-topic, repeating itself, ignoring instructions in the middle of a long prompt — comes from treating the function as more than it is. The fix is always to *constrain*, *measure*, or *route around* the function, never to expect more of it.

This is exactly the same instinct you have for an external HTTP API. You don't trust the response shape; you parse and validate. You don't trust the latency; you set a timeout. You don't trust the availability; you have a circuit breaker. LLMs are stricter versions of an external HTTP API — non-deterministic, expensive, and easy to manipulate.

---

## Tokenization — `[C1.1]`

Models don't read text. They read **tokens**.

A tokenizer (BPE or sentencepiece for most modern models) splits text into chunks that are roughly word-sized in English, character-sized in Chinese, and somewhere in between in code. You pay for tokens, not characters. Context windows are sized in tokens, not characters.

```
"Hello, world!"                  →  [15496, 11, 995, 0]
"Hello, world!" (13 chars)       →  4 tokens

"const x = 42;" (13 chars)       →  6 tokens   (code is denser)

"こんにちは" (5 chars)            →  ~3 tokens

A typical English paragraph: ~4 chars/token.
```

**The intuition you need to keep:** in production, you'll be estimating costs in tokens × calls × prices. A pricing of `$3 per million input tokens` is a unit-economics number, not an SRE number. At 10k chain invocations per day with 1.5k input tokens each, that's $13.50/day = ~$400/month in input alone — for one chain. Multiply by the number of chains.

The bridge from frontend: this is the same instinct you have for bundle size. You don't ship 5MB of JS because every byte costs latency. You don't include 5k tokens of irrelevant context because every token costs money and dilutes attention.

---

## Context windows and the lost-in-the-middle problem — `[C1.2]`

The context window is a fixed-size container. Everything competes for space: system prompt, conversation history, retrieved docs, the user's current message, and the room you need to leave for the model's response.

```
┌────────────────────────────────────────────────┐
│              Context window (finite)           │
│                                                │
│  System prompt    [██████░░░░░░░░░░░░░░░░░░]  │
│  Conversation     [████████████░░░░░░░░░░░░]  │
│  Retrieved docs   [████░░░░░░░░░░░░░░░░░░░░]  │
│  Response space   [░░░░░░░░░░░░░░░░████████]  │
│                                                │
│  Total: fixed. Everything competes for space.  │
└────────────────────────────────────────────────┘
```

A 200k-token context window is not a 200k-token playground. The model attends strongly to the **start** and **end** of the context; the middle is where things go to die. This is the **lost-in-the-middle problem**, and it's the reason RAG isn't just "stuff 50 docs in the prompt and pray." If you put the relevant doc at position 17 in a list of 30, the model will likely miss it.

The practical consequence: when you build a RAG system, you don't just retrieve top-k docs; you *order* the retrieved docs deliberately. Most relevant goes first or last, never in the middle. We'll come back to this in Chapter 2A.

---

## Sampling parameters — `[C1.3]`

Same model, same prompt, different sampling parameters → completely different output behavior.

```
Same prompt, different sampling:

temperature=0    →  deterministic; the most-likely token every time
                    (classifiers, structured outputs, anything that
                     must be reproducible)

temperature=0.7  →  natural variation; modern default for chat
                    (caption generation, creative paraphrasing)

temperature=1.2  →  the model takes more risks
                    (creative writing, variant generation)

top-p=0.9        →  keep tokens until cumulative probability hits 0.9
                    (nucleus sampling; adapts to the model's confidence)

top-k=40         →  keep only the top-40 most likely tokens
                    (hard cap regardless of distribution)
```

In **loopd's caption chain**, you have a real test case. The chain emits a `recentCaptions` array of previous captions and a system prompt forbidding repetition. But if temperature is 0, the model will pick the same opening clause every time — "Today I worked on…" — because that's the most-likely first token after the system prompt. The forbidden-list works, but a low temperature actively fights it.

The fix in `[B1.3]` is to deliberately raise temperature for the caption chain to ~0.8, log the variance, and verify that the anti-repetition is doing useful work (and not just papering over a low-variance distribution). That's not a hyperparameter tweak — that's a documented experiment.

**Interview move:** at the right time, you can say something like "in loopd's caption chain I deliberately raised temperature because anti-repetition only works when the underlying sampling has variance to suppress; at temperature 0 the model converges and the forbidden list looks like it's working when it's actually just constraining a degenerate distribution." That's a senior answer. It tells the interviewer you've thought about *interaction effects* between hyperparameters and prompt structure, not just one in isolation.

---

## Structured outputs — `[C1.4]`, `[B1.1]`

This is the load-bearing pattern of Phase 1.

In your frontend code, every component prop has a type. Every API response goes through a parser. Every fetch call has an error boundary. You wouldn't ship code where a backend returned untyped JSON and you indexed `.choices[0].message.content` without checking what's there.

LLM calls are external API calls with *worse* guarantees than a normal backend. The right pattern is:

```typescript
// Schema once, used everywhere
const ClassifyResult = z.object({
  intent: z.enum(["todo", "question", "vent"]),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string()),
});

// Build the chain to emit this shape (tool call, JSON mode, or
// constrained decoding depending on provider)
const chain = buildChain({
  systemPrompt: "...",
  outputSchema: ClassifyResult,
});

// Caller gets a typed result or a typed error
const result: z.infer<typeof ClassifyResult> = await chain.invoke(input);
```

Every modern provider supports this. Anthropic has tool use. OpenAI has JSON mode and function calling. The pattern is the same: hand the schema to the provider, the provider constrains the model's output, your code parses against the schema and either gets a typed result or a typed error.

**Build item `[B1.1]`:** add Zod schemas to every input and output across loopd's five chains. This is the first concrete artifact of the curriculum. After it lands, every chain in loopd has a typed contract. After that, you can rationally discuss adding evals, swapping providers, or rewriting prompts — because every change is verifiable against the schema.

---

## Streaming responses — `[C1.5]`

Streaming is the difference between *perceived* latency and *actual* latency.

```
Non-streaming                Streaming
┌────────────────┐          ┌────────────────┐
│ LLM thinks...  │          │ LLM thinks...  │
│ ...3 sec...    │          │ "The"          │ ← chunk 1, ~200ms
│ ...5 sec...    │          │ "The quick"    │ ← chunk 2
│ ...8 sec...    │          │ "The quick br" │ ← chunk 3
│                │          │ ...            │
└────────┬───────┘          └────────┬───────┘
         │                           │
         ▼                           ▼
Full response                Tokens arrive live,
arrives at once              total time the same
```

Total compute is unchanged. But the user sees the first token in ~200ms instead of waiting 8 seconds for the whole response. For chat interfaces, this is the difference between feeling "fast" and feeling "broken."

For **loopd**, streaming is a `learn-only` concept — the chains in loopd are background-batched, not user-facing. You can answer the interview question without having shipped it. But you can name the cost: streamed responses are harder to validate (you can't run a schema check until the stream ends), harder to handle mid-stream errors, more client-side complexity. For chat, the win is worth it. For batch classification, it isn't.

---

## Token economics — `[C1.6]`, `[B1.2]`, `[B1.8]`

The single most under-discussed topic in candidate interviews. People know LLMs cost money. They cannot tell you, in dollars per month at current usage, what their app costs.

```
┌──────────────────────────────────────────────────┐
│ One chain call in loopd's interpret chain        │
├──────────────────────────────────────────────────┤
│  Input tokens                                    │
│    System prompt:        ~600 tokens             │
│    User message:         ~200 tokens             │
│    Conversation history: ~800 tokens             │
│    Retrieved entries:    ~1500 tokens (week)     │
│    Total input:          ~3100 tokens            │
│                                                  │
│  Output tokens                                   │
│    Response:             ~400 tokens             │
├──────────────────────────────────────────────────┤
│  Cost (Sonnet 4 pricing, 2026)                   │
│    input:  3100 × $3 / 1M  = $0.00930           │
│    output: 400  × $15 / 1M = $0.00600           │
│    Total per call:         $0.01530             │
├──────────────────────────────────────────────────┤
│  At 100 calls/day:      ~$1.53/day = $46/month   │
│  At 1k calls/day:       ~$15.30/day = $459/month │
│  At 10k calls/day:      ~$153/day = $4,590/month │
└──────────────────────────────────────────────────┘
```

Output tokens cost ~5× input. So the biggest line item in your cost stack is usually response length. Trimming 50 tokens of response prose saves more than trimming 200 tokens of system prompt.

The build for this phase is concrete: `[B1.2]` adds a local `ai_call_log` table that records, per chain call, the input/output tokens, the provider, the model, the cost. `[B1.8]` surfaces that in the settings panel of loopd. Now the app *knows* how much it costs. That's the bar.

The interview move: *"My AI cost dashboard lets me see per-chain spend in the last 30 days. The summarize chain was 40% of cost. I cut its system prompt from 800 to 200 tokens by externalizing the rotating-formula list to a smaller per-call lookup, and the cost dropped 28% with no measurable quality regression."* Specific, measured, has a number. That's a senior answer.

---

## Heuristic-before-LLM — `[C1.9]`, `[B1.5]`

The LLM is expensive on every call. Most inputs in any real app are predictable. **Filter the predictable ones with rules, only pay the LLM for the ambiguous ones.**

```
Input
  │
  ▼
┌─────────────────────┐
│ Heuristic check     │  fast, free, deterministic
│ (regex, rules)      │  e.g. "[" prefix → todo
│                     │       hashtag-only line → tag
│                     │       all-caps → vent
└─────────┬───────────┘
          │
     ┌────┴────┐
     │ match?  │
     └────┬────┘
          │
     ┌────┴─────┐
     │          │
     ▼ yes      ▼ no
 Return        ┌────────────────┐
 directly      │  Call LLM      │  expensive, slow,
               │  (classifier)  │  but smarter
               └────────────────┘
```

In **loopd's classifier**, the heuristic path handles ~85% of input. Things like a leading `[` prefix → todo. A line that's only hashtags → tag. The remaining 15% goes to the LLM classifier. That's an 85% cost reduction with no quality loss on the things the heuristic actually matches.

The risk is silent drift. If your users start writing in a new pattern (say, leading `>` for quotes instead of bare text), and your heuristic doesn't catch it, the LLM never gets a chance to learn it either, because the heuristic is wrong-but-confident.

**Build item `[B1.5]`** is the discipline around this: every heuristic regex gets a false-negative coverage assertion. You sample a percentage of heuristic-routed inputs and re-route them through the LLM occasionally, then compare. If the LLM disagrees with the heuristic on >5% of sampled cases, the heuristic is drifting and needs updating. This is the kind of thing FAANG production code does for spam classifiers, search rankers, anything where a fast path runs ahead of a slow path.

---

## Provider-agnostic chain design — `[C1.8]`, `[B1.6]`

If your code talks directly to `anthropic.messages.create(...)` everywhere, you've locked yourself in. Model pricing changes monthly. Rate limits move. New providers ship better models. You should be able to switch providers with an env var.

The pattern is a factory:

```
getModel(provider)
  │
  ├── "anthropic" → AnthropicChatModel(claude-sonnet-4)
  ├── "openai"    → OpenAIChatModel(gpt-4o)
  ├── "google"    → GoogleChatModel(gemini-2)
  └── "ollama"    → OllamaChatModel(llama3)
            │
            ▼
       BaseChatModel — same interface (.invoke, .stream)
            │
            ▼
       chain.invoke(input)  — same call regardless of provider
```

Every chain calls through `BaseChatModel`. No chain knows which provider is running. Provider selection happens once at startup based on an env var.

The tradeoff is real: the shared interface is the lowest common denominator of all providers. Anthropic's prompt caching, OpenAI's structured outputs, Google's grounded search — these vendor-specific features get hidden behind the interface or duplicated.

The breakpoint to revisit this is when one provider's unique feature becomes load-bearing for your product. Until then, abstraction wins. **`[B1.6]`** is the proof: take all five loopd chains, run them against the same 10 fixtures on Anthropic, then re-run on OpenAI, and document the divergences. The divergence document is the interview artifact — it shows you've measured the cost of the abstraction.

---

## User-override locks — `[C1.11]`, `[B1.9]`

LLM outputs are never authoritative on data the user can correct.

The pattern:

```
Field with override tracking:

{
  intent: "todo",
  intent_source: "llm",            ← who set this
  intent_overridden_at: null,      ← timestamp if user edited it
}

When the LLM runs again on this row:

if (intent_overridden_at != null) {
  // The user already corrected this. Do not overwrite.
  skipClassification();
} else {
  intent = classifyWithLLM(...);
  intent_source = "llm";
}
```

Without this pattern, every re-sync silently un-fixes the user's correction. User types `[x] buy milk`, the LLM classifies as `shopping`, the user corrects to `errand`, the next sync re-classifies as `shopping` again, the user gives up and stops trusting the app.

Every field the user can manually edit needs an `_overridden_at` timestamp. The LLM checks it before writing. **`[B1.9]`** is the audit across loopd's data model to find every editable field and add the lock pattern where it's missing.

This is a classic distributed-systems pattern dressed in AI clothing: **never let an unreliable source overwrite a reliable source.** You knew this as a data-center engineer when you stopped your config-management system from clobbering a hand-edit on a routing table. Same instinct.

---

## Single-purpose chains vs agent loops — `[C1.10]`

Chains are linear. The author of the chain decides the steps; the LLM executes each one. Agents are loops. The LLM decides which step to take, calls a tool, observes the result, decides the next step, and so on.

For Phase 1, you'll defend **single-purpose chains**. The interview frame:

> "Each chain in loopd has one job. Summarize. Classify intent. Extract entities. Generate caption. Score sentiment. Five chains, five well-defined contracts. When one fails, I know exactly which job failed. I can run cheaper models on classifiers and the expensive model only on synthesis. I can swap one chain's prompt without affecting the others. Agents are the right pattern when the steps depend on what the LLM finds — but in a journaling app the steps are known, so the simpler shape wins."

That answer names the principle, names the tradeoff, and names when the alternative would win. Senior.

---

## Prompt engineering as a discipline — `[C1.7]`, `[B1.7]`

This is the side track that lives in **aipe**.

Most engineers think prompt engineering is a vibe. You'll have a different answer: it's a discipline with patterns, tested in production across 11 markdown templates that other engineers (and you yourself) use weekly via slash commands. The pattern catalog includes:

- **System prompt structure:** Role → Task → Constraints → Output. Each section has one job; mixing them is how prompts drift.
- **Few-shot examples:** when format consistency matters, examples beat instructions. 3–5 good examples beat 20 mediocre ones.
- **Chain-of-thought:** giving the model space to think before answering. Less necessary on frontier models, still helps on cheaper ones.
- **Forbidden patterns / rotating formulas:** explicit anti-repetition lists fed to the model to avoid mode collapse.
- **Output mode declaration:** every chain has one output mode (JSON or markdown). Mixing modes is where chains die.

**Build `[B1.7]`** is `aipe/template-style-guide.md` documenting these patterns as exercised in your 11 templates. That document *is* the prompt-engineering proof artifact. When an interviewer asks "have you done prompt engineering?", you point at a file with 11 worked examples and a written-up discipline.

---

## The Phase 1 deliverables

When you can check these off, you've finished the chapter:

- [ ] `[B1.1]` Every loopd chain has Zod schemas for input and output.
- [ ] `[B1.2]` `ai_call_log` table exists and records every call.
- [ ] `[B1.3]` `recentCaptions` anti-repetition + temperature variance is documented as a real experiment with measured variance.
- [ ] `[B1.5]` Heuristic regex coverage in `heuristicClassify.ts` is documented with false-negative assertions.
- [ ] `[B1.6]` Provider-swap eval ran on 10 fixtures and divergences are documented.
- [ ] `[B1.7]` `aipe/template-style-guide.md` exists and walks the principles used in the 11 templates.
- [ ] `[B1.8]` AI cost & latency panel exists in `app/settings/ai.tsx`.
- [ ] `[B1.9]` Every editable field in loopd's data model has a `_overridden_at` lock.

When all eight ship, you have something rare on a resume: typed contracts, cost telemetry, provider portability, override discipline. That's the foundation. Everything in the rest of the book builds on it.

---

## The Interview Move

> *"My LLM application stack is provider-agnostic — five single-purpose chains, all with Zod-typed contracts, all logged through one cost-tracking pipeline. I've measured cost per chain at current usage, identified the 40%-of-spend chain, and cut its system prompt in half. Heuristics route 85% of classifier calls before the LLM is ever invoked. The override-lock pattern means the LLM never overwrites user corrections silently. The whole thing swaps providers in one env-var flip; I've run the eval on both Anthropic and OpenAI on the same 10 fixtures and documented where the outputs diverge."*

That paragraph is a sequence of `[Bx.y]` ID references with the IDs stripped. Each clause maps to a concrete commit in loopd. When an interviewer asks for detail on any clause, you can pull up the file. That's what converts "I've done LLM work" into actual signal.

Next chapter: retrieval. Same pattern, harder problem.
