# Tokenization

**Industry name(s):** Byte-pair encoding (BPE), SentencePiece, WordPiece, subword tokenization
**Type:** Industry standard

> The piece of LLM mechanics that turns text into the integer sequences models actually consume — and the unit context windows are sized in.

**See also:** → [02-context-windows](02-context-windows.md) · → [06-token-economics](06-token-economics.md)

---

## Why care

You've seen an API charge by "tokens" and wondered why some 100-character strings cost more than others. The answer is tokenization: the model doesn't see characters; it sees integer IDs from a learned vocabulary, and the vocabulary is biased toward common English. "Hello world" might be 2 tokens; "Привет, мир" might be 8. Same meaning, different cost — and you can't tell without running the tokenizer.

The pattern is *subword segmentation* — splitting text into pieces that are smaller than words but larger than characters. The shape recurs anywhere a learned model needs to handle an open vocabulary: speech recognition, machine translation, compression. The trick is that the segmentation is *learned* on training data, not designed by humans, so the splits reflect statistical regularities of the training corpus. Here's how that affects an AI-tooling project.

---

## How it works

A receipt printer with a learned shorthand. The model sees text as a sequence of small reusable pieces — common pieces (`the`, ` and`, `ing`) get a single token; rare pieces (Cyrillic letters, emojis, code identifiers) get broken into multiple smaller tokens. The shorthand is fixed at training time and shipped with the model.

### What a token actually is

A token is an integer ID drawn from a vocabulary of typically 32k–256k entries. Each entry is a byte sequence — usually a few characters of text. Common entries: ` the` (note the leading space), `tion`, `is`. Less common: individual emoji codepoints, Cyrillic letters, less-frequent code identifiers.

```
"Hello, world"               → [9906, 11, 1917]              (3 tokens — common)
"Привет, мир"                → [54029, 27332, 11, 19395, 21]  (5 tokens — Cyrillic split)
"function double(x: number)" → [1723, 2378, 7, 87, 25, 1396, 8]  (7 tokens)
```

If you're coming from frontend, think of this like a Brotli dictionary — common substrings get short codes; rare ones get longer encodings. Different in detail (learned, not hand-built; consumed by an ML model, not unpacked to text) but the same intuition: common things get cheap encodings.

### Why BPE / SentencePiece is the dominant family

BPE (byte-pair encoding) starts from raw bytes and iteratively merges the most-frequent adjacent pairs until the vocabulary reaches the target size. SentencePiece (Google) does similar but skips the pre-tokenization step (handles whitespace natively). Both produce subword vocabularies where common substrings are single tokens.

This works whether the input is English, code, JSON, markdown, or Cyrillic. It breaks (in the cost sense) for input far from the training distribution: rare scripts, novel emojis, exotic code identifiers. Those inputs use more tokens per character because the tokenizer can't recognise long substrings.

### How tokens relate to context windows

A model's "context window" is the maximum number of tokens it can process in one call — typical values today: 200k for Claude Sonnet 4.6, 1M for Claude Opus 4.7, 128k for GPT-4o. The window is in *tokens*, not characters, which is why understanding tokenization affects how much content you can feed in.

The practical consequence for an AI-tooling project: when you load a project's `.aipe/project/context.md` into a prompt, you spend its token count. When you load a 138 KB wrapper file like `commands/study.md`, you spend roughly its character count divided by ~3.5 (the typical English ratio). That's ~40k tokens just for the wrapper — significant fraction of any modern context window.

### How tokens relate to cost

Both API pricing and on-device latency scale with token count. A model that charges $3 / million input tokens × 40k tokens = $0.12 per call just for loading the wrapper, before the user's prompt. This is why [06-token-economics](06-token-economics.md) is its own concept.

### The principle — character-level intuition is wrong

The lesson from tokenization is: *the model doesn't see your text the way you do*. A 100-character string isn't 100 units to the model; it's whatever the tokenizer decides. This is the source of many surprises:

- Why "rate limit" failures hit at unexpected text lengths.
- Why some prompts are "more expensive" than others of similar character count.
- Why concatenating two short JSON keys uses more tokens than expected (each key gets its own token sequence).

Building intuition for tokenization is what separates engineers who treat LLMs as black boxes from engineers who reason about model behaviour at the cost layer.

The full picture is below.

---

## Tokenization — diagram

```
From text to integer IDs

┌─ Application layer ──────────────────────────────────────────────────────┐
│                                                                          │
│   User text: "Generate a feature spec for dark mode toggle"              │
│                                                                          │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       ▼  pre-tokenize (whitespace, special chars)
┌─ Tokenizer (learned, shipped with model) ────────────────────────────────┐
│                                                                          │
│   Greedy match against vocabulary:                                       │
│                                                                          │
│   "Gener" + "ate"     → [33288, 349]                                     │
│   " a"                → [264]                                            │
│   " feature"          → [4096]                                           │
│   " spec"             → [1424]                                           │
│   " for"              → [369]                                            │
│   " dark"             → [4170]                                           │
│   " mode"             → [3941]                                           │
│   " toggle"           → [10638]                                          │
│                                                                          │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       ▼
┌─ Model input layer ──────────────────────────────────────────────────────┐
│                                                                          │
│   [33288, 349, 264, 4096, 1424, 369, 4170, 3941, 10638]                  │
│        ↓                                                                 │
│   embedding lookup → dense vectors → transformer layers → ...            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

  Text:    "Generate a feature spec for dark mode toggle"   (47 chars)
  Tokens:  9 (English-friendly, frequent substrings)
  Ratio:   ~5.2 chars/token (typical for English-heavy text)
```

---

## In this codebase

**Not yet implemented in aipe directly.** aipe is a markdown plugin — it doesn't tokenize anything itself. Tokenization happens inside the host agent (Claude Code, Codex CLI) when it loads the wrapper, the template, and the user's context into its prompt window. The host agent's tokenizer is opaque to aipe.

The concept is in-scope for aipe via Phase 1's "what aipe encodes" anchor on [C1.7](07-prompt-engineering-discipline.md) — to defend aipe in interview, you need to defend why aipe's templates produce token-efficient prompts. That makes tokenization a learn-only concept for aipe (no Build item assigned to aipe), exercised conceptually rather than in code.

Where the cost lands for aipe:
- Wrapper size matters because every `/aipe:<type>` call loads `commands/<type>.md` into the host's prompt. `commands/study.md` at 138 KB is roughly 40k tokens.
- Template size matters similarly. `specs/study.md` at 294 KB is ~85k tokens.
- The combined "wrapper + template + context + user intent" easily exceeds 130k tokens before the host agent starts generating output.

---

## Elaborate

### Where this pattern comes from

BPE was introduced in 1994 for data compression, then re-applied to neural MT in 2015 (Sennrich et al.) when it became clear that character-level models were too slow and word-level models couldn't handle OOV (out-of-vocabulary) words. SentencePiece (Kudo & Richardson, 2018) is Google's variant. Modern LLMs (GPT, Claude, Llama, Gemini) all use BPE-family tokenizers with vocabularies between 32k and 256k entries.

### The deeper principle

Models don't read text — they read sequences of integer IDs drawn from a learned vocabulary. The vocabulary embeds biases (toward English, toward training-data common substrings). Your intuition about "this prompt is short" needs to be replaced with intuition about "this prompt is short *in tokens*."

### Where this breaks down

When the input distribution is far from training:
- Non-English scripts (Cyrillic, CJK, Arabic) use 2–4× more tokens per character than English.
- Novel code identifiers (long snake_case Python names) use more tokens than expected.
- Newer emoji codepoints (post-training-cutoff) are split into byte-level fallbacks.

These cases consume tokens faster than character intuition predicts.

### What to explore next

- [02-context-windows](02-context-windows.md) → tokens are the unit of context windows
- [06-token-economics](06-token-economics.md) → tokens drive cost
- Karpathy's "Let's build the GPT tokenizer" — best educational walkthrough

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Don't think about tokens │ Reason about tokens         │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Cognitive load   │ Zero — treat text as     │ +1 layer of intuition       │
│                  │ characters               │ ("how many tokens is this?")│
│ Cost surprises   │ Rate-limit / pricing     │ Predict cost ± 20%          │
│                  │ surprises common         │                             │
│ Prompt design    │ Naive copy-paste prompts │ Trim unused context, prefer │
│                  │                          │ English-heavy framing       │
│ Tool failures    │ Context-window overflow  │ Catch the overflow at       │
│                  │ silently truncates       │ prompt-assembly time        │
│ Vendor lock-in   │ Same                     │ Same                        │
│ Failure blast    │ "Why did the chain fail?"│ "We exceeded 200k tokens   │
│                  │ — opaque                 │ at chain step 3" — actionable│
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

The cost of *not* reasoning about tokens for an AI-tooling project: silent context-window overflows. When `commands/study.md` + `specs/study.md` + `.aipe/project/context.md` + user intent + agent history blow past the host's context window, the host's behaviour is implementation-defined — it might truncate the wrapper, the context, or the user message, none of which are good. The user sees a spec generated against incomplete inputs and can't tell what was missing.

For aipe specifically: the `/aipe:study` wrapper at 138 KB (~40k tokens) plus the study template at 294 KB (~85k tokens) plus typical context (~10k tokens) is already 135k tokens of input — pushing close to Claude Sonnet's 200k window. Add the agent's session history and the user's prompt, and we're at the limit. This is a real load-bearing concern for the largest wrapper.

### Sub-block 2 — what the alternative would have cost

Reasoning about tokens for every prompt means: counting tokens for every file you load, knowing your model's window, building intuition for what fits. The cognitive cost is non-trivial — for a tool author, it's an extra discipline; for a tool user, it's invisible (the tool author handles it).

The benefit: predictable behaviour. You know `/aipe:study` works because the inputs fit. You know what to trim if a future user reports overflow. You know which models are cheaper and which are unaffordable for your wrapper's size.

### Sub-block 3 — the breakpoint

Fine until wrappers + templates + context + history exceed 70% of the host's context window. At Claude Sonnet 4.6's 200k tokens, that's ~140k tokens — and we're roughly there for `/aipe:study`. The next template-version expansion (v1.30+) may push over the line.

The fix at that scale: (a) move template content into smaller files loaded on demand (Step 6C reads only the section currently being generated), (b) compress the wrapper by extracting flag taxonomy into a separate file (see [03-template-diff](../02-dsa/03-template-diff.md) Sub-block 3), or (c) require users to run on larger-context models. Today, the simplest path is (a) + (b).

---

## Tech reference (industry pairing)

### LLM tokenizers

- **Codebase uses:** none directly — tokenization happens inside the host agent.
- **Why it's here:** the unit aipe's wrappers and templates are measured in (tokens, not characters).
- **Leading today:** BPE-family tokenizers (Claude's, GPT's, Llama's) — `adoption-leading` for production LLMs, 2026.
- **Why it leads:** balances vocabulary size against sequence length; learned splits adapt to training data; the family is well-understood and shippable.
- **Runner-up:** byte-level tokenization (Llama 3's tiktoken variant; BPT) — `innovation-leading` for fully-multilingual coverage at the cost of longer sequences.

---

## Project exercises

No Build items are assigned to aipe for tokenization. The concept is `learn-only` for aipe per the curriculum's Phase 1 coverage table (C1.1: "Tokenization (BPE, sentencepiece) — what is a token, why context windows are sized in tokens `[learn-only — built in reincodes viz]`"). The deliverable is conceptual understanding, not a code artifact in aipe.

Cross-project reference: the reincodes portfolio site will host an interactive tokenization visualiser (curriculum line 522). That's the project-anchored proof artifact for this concept.

---

## Summary

Tokenization is the BPE-family subword segmentation that turns text into integer sequences models consume — the unit aipe's wrappers, templates, context, and user prompts are measured in. aipe doesn't tokenize directly; the host agent does, opaquely. The concept matters for aipe because the largest wrapper (`commands/study.md` at 138 KB ≈ 40k tokens) plus its template (`specs/study.md` at 294 KB ≈ 85k tokens) already consume ~70% of a 200k context window before user input. The constraint that drove this: long-form wrappers and templates make context-window pressure real even for a markdown-only plugin. The cost being paid: the agent has to manage prompt size carefully on every `/aipe:study` invocation.

- Tokens are integer IDs from a learned 32k–256k vocabulary; not characters.
- English-heavy text averages ~3.5–5 characters per token; non-Latin scripts can be 1–2.
- `commands/study.md` at 138 KB ≈ 40k tokens; `specs/study.md` at 294 KB ≈ 85k tokens.
- Combined wrapper + template + context for `/aipe:study` already approaches 70% of Claude Sonnet's 200k window.
- The breakpoint is when total prompt size exceeds the host model's context window — likely v1.30+ for `/aipe:study`.

---

## Interview defense

### What an interviewer is really asking

"What do you know about tokenization?" is testing whether you've internalised that LLM cost and capacity are in tokens, not characters. The dodge is to define BPE. The senior answer connects tokenization to a real cost or capacity problem in your project.

### Likely questions

**Q [mid]:** What's the difference between a token and a character?

**A:** A token is an integer ID from a learned vocabulary (typically 32k–256k entries). The vocabulary contains subword pieces — `the`, ` and`, `tion`. A character is a Unicode codepoint. English text averages 3.5–5 characters per token; non-Latin scripts can be much lower (1–2 chars/token), which means non-English prompts use more tokens for the same meaning.

```
"Hello"   → 1 token  (1 vocab entry)
"Привет"  → 4 tokens (Cyrillic split into bytes)

Char count: 5 vs 6 (close)
Token count: 1 vs 4 (4× difference)
```

**Q [senior]:** Why does the largest wrapper in aipe matter from a tokenization perspective?

**A:** `commands/study.md` is 138 KB — roughly 40k tokens. Combined with `specs/study.md` at ~85k tokens, the input prompt for a `/aipe:study` invocation is ~125k tokens before user context, agent history, or output generation. Claude Sonnet 4.6's window is 200k. We're at ~62% just for the wrapper + template — that's the load-bearing tokenization cost in this project. The next template expansion that adds ~10k tokens pushes us over 70%, which starts compressing the room available for the agent's working state.

```
Wrapper + template load
─────────────────────────
commands/study.md     ~40k tokens
specs/study.md        ~85k tokens
.aipe/project/        ~10k tokens
                       ────
                      ~135k / 200k window (~67%)

Remaining for agent work: ~65k
 ── breaks first when wrapper grows past
    ~50k tokens or context.md grows to ~20k ──
```

**Q [arch]:** What changes when aipe runs on a model with a 1M-token context (e.g., Claude Opus 4.7)?

**A:** The wrapper+template+context constraint relaxes — we go from ~67% utilisation on Sonnet to ~13% on Opus. That's enough headroom to load many study guide files in one prompt (today the agent generates one file at a time). At 1M tokens, the right thing might be to load the full existing study guide into the prompt during UPDATE mode (currently we read files one-at-a-time). The breakpoint is roughly "wrapper + all study files + codebase context fit comfortably" — at 1M tokens that's easy; at 200k it requires the current file-by-file streaming.

### The question candidates always dodge

**Q:** Why don't you measure token count programmatically inside the wrapper?

**A:** Because aipe doesn't run code — it's markdown read by a host agent. The host agent already tokenizes everything it reads; aipe doesn't have a tokenizer to count with. We could ask the host to count tokens at runtime (Claude Code's Bash tool could run `tiktoken` or similar), but that adds (a) a dependency on a specific tokenizer (Claude's vs GPT's vs Llama's all differ), (b) a runtime cost per prompt, (c) a maintenance burden when the tokenizer changes. For a markdown plugin where token concerns are mostly about wrapper size at design time, the character-count-divided-by-3.5 estimate is good enough. The breakpoint is when prompts start failing in the field — at which point precise counting earns its place.

### One-line anchors

- Tokens are integer IDs from a learned 32k–256k vocabulary; not characters.
- BPE / SentencePiece are the dominant subword tokenizer families.
- Context windows are sized in tokens; cost is priced in tokens.
- English ≈ 3.5–5 chars/token; non-Latin scripts can be 1–2.
- For aipe, the largest wrapper + template already consumes ~67% of Claude Sonnet's window.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the text → tokenizer → integer-sequence flow from memory.

### Level 2 — Explain it out loud
Explain tokenization to a frontend engineer who's never thought past "characters." Under 90 seconds.

### Level 3 — Apply it to a new scenario

A user adds a 50 KB `.aipe/project/aieng-curriculum.md` to their project (about 14k tokens). They run `/aipe:study` on Claude Sonnet 4.6 (200k window). Roughly what percentage of the window is consumed before any output? Where are you most likely to feel pressure?

### Level 4 — Defend the decision you'd change

"If aipe were rewritten today with full knowledge of token budgets, would you split `commands/study.md` into a smaller wrapper + loaded-on-demand sections? What would it cost?"

### Quick check — code reference test
Without opening files:
- What's the rough char-to-token ratio for English? → 3.5–5
- What's the approximate token count of `commands/study.md`? → ~40k
- Where does tokenization happen for aipe? → Inside the host agent, opaquely
