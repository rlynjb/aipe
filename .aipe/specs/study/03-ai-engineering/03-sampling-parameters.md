# Sampling parameters

**Industry name(s):** Temperature, top-p (nucleus sampling), top-k, sampling
**Type:** Industry standard

> Three knobs on the decoder that decide how varied vs deterministic the model's output is — same prompt, different knobs, different shapes of answer.

**See also:** → [04-structured-outputs](04-structured-outputs.md) · → [12-output-mode-mismatch](12-output-mode-mismatch.md)

---

## Why care

You've run the same prompt through an LLM twice and gotten different answers, and then you've run a different prompt through the same model and gotten suspiciously similar answers each time. The difference isn't the prompt — it's the sampling. Models output probability distributions over tokens; sampling parameters decide how those distributions become text.

The pattern is *stochastic-vs-deterministic decoding*. The shape recurs in any system that converts a probability distribution into a single output — beam search in machine translation, top-k retrieval, Boltzmann sampling in physics simulations. The trick is to know when you want stochasticity (creative writing, hypothesis generation) and when you want determinism (structured outputs, anything an automated system consumes). Here's how that affects an AI-tooling project.

---

## How it works

A weighted die roll with three controls.

### Temperature

The model produces a probability distribution over the vocabulary at every step. Temperature is a divisor on the logits before the softmax — `softmax(logits / T)`. Lower T → distribution sharpens → more deterministic. Higher T → distribution flattens → more varied.

```
T = 0.0   → argmax (deterministic; always picks the highest-prob token)
T = 0.7   → balanced (typical for chat)
T = 1.0   → distribution unchanged
T = 1.5+  → flattened (very varied, sometimes incoherent)
```

If you're coming from frontend, think of this like dimming a search ranking — at T=0 you only ever surface the top result; at T=1 you uniformly sample.

### Top-p (nucleus sampling)

Truncate the distribution to the smallest set of tokens whose cumulative probability ≥ p, then sample from that set.

```
top_p = 0.1  → consider only the most-likely tokens (tight)
top_p = 0.9  → consider tokens covering 90% probability mass (relaxed)
top_p = 1.0  → consider all tokens (no truncation)
```

### Top-k

Truncate the distribution to the top k highest-probability tokens, then sample. Simpler than top-p but less adaptive.

### How they combine

The common production setting is `T=0.7, top_p=0.9` — moderate variation with rare-token suppression. For deterministic JSON output: `T=0` (or `T=0.1` with `top_p=0.1`). The model's recommended defaults usually work; tuning is for specific use cases.

### What aipe doesn't do

aipe's wrappers don't set sampling parameters. The host agent picks them. Claude Code uses model defaults (T≈0.7 for chat-style responses); Codex CLI similar. For aipe's purposes — generating long structured documents — the host's defaults are fine.

If aipe ever needed to drive specific sampling for spec generation (e.g., T=0 for deterministic regeneration), it'd request that of the host agent. Today it doesn't.

### The principle — sampling is the lever between creativity and reliability

Lower temperature for things you want consistent across runs (JSON outputs, file paths, code generation where syntax errors are unacceptable). Higher temperature for things where variation is the point (caption variants, brainstorming, creative writing). Get the wrong knob and your tests are flaky or your outputs are boring.

The full picture is below.

---

## Sampling parameters — diagram

```
The decoding step

┌─ Model output ──────────────────────────────────────────────────────────┐
│                                                                         │
│   Raw logits over vocabulary:                                           │
│      token "the": 4.2                                                   │
│      token "a":    3.8                                                  │
│      token "an":   3.1                                                  │
│      token "of":   2.9                                                  │
│      ...                                                                │
│                                                                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼  apply temperature: logits / T
┌─ After temperature ─────────────────────────────────────────────────────┐
│                                                                         │
│   T = 0.5 (sharper)              T = 1.5 (flatter)                      │
│   the: 0.62                       the: 0.27                             │
│   a:   0.31                       a:   0.21                             │
│   an:  0.05                       an:  0.16                             │
│   of:  0.02                       of:  0.13                             │
│   ...                             ...                                   │
│                                                                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼  apply top-p / top-k truncation
┌─ After truncation ──────────────────────────────────────────────────────┐
│                                                                         │
│   top_p = 0.9: keep tokens until cum-prob ≥ 0.9                         │
│   top_k = 5:   keep top 5 tokens                                        │
│                                                                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼  sample one token
┌─ Output token ──────────────────────────────────────────────────────────┐
│   "the"     ← picked by weighted random over truncated set              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Not implemented directly in aipe.** aipe doesn't call LLMs; the host agent does, and the host agent picks sampling parameters. aipe's wrappers don't reference temperature / top-p / top-k anywhere.

The concept matters conceptually because spec generation is a deterministic-ish task (you want similar outputs across runs of the same prompt) but the host agent typically runs at T≈0.7 — meaning two `/aipe:feature add dark mode` invocations against the same project context will produce specs that are *similar* but not *identical*. That's by design and acceptable for spec generation, where minor variation is fine and creative phrasing helps readability.

The curriculum (Phase 1 C1.3: "Sampling parameters: temperature, top-p, top-k — loopd's caption chain is a real test case") anchors this concept to loopd, not aipe. Aipe's role is conceptual: defend why sampling-aware design matters in a tool that generates structured documents.

---

## Elaborate

### Where this pattern comes from

Temperature comes from statistical physics (Boltzmann distributions). Top-k sampling is older; top-p (nucleus sampling) was introduced by Holtzman et al. (2019) to fix the "repeat-itself" problem of top-k. Most modern LLM APIs expose all three with sensible defaults.

### The deeper principle

Stochastic outputs are a feature, not a bug — but they're a feature you have to opt into. Default-stochastic is right for chat; default-deterministic is right for any output a program consumes downstream.

### Where this breaks down

When you want reproducibility for tests but creativity for users. Two different sampling regimes are needed; the design problem is making the switch a first-class part of the API, not a per-call flag every chain remembers to set.

### What to explore next

- [04-structured-outputs](04-structured-outputs.md) → why JSON outputs benefit from low temperature
- [12-output-mode-mismatch](12-output-mode-mismatch.md) → what happens when sampling is mismatched to output type
- Holtzman et al., "The Curious Case of Neural Text Degeneration" (2019) — the nucleus-sampling paper

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Tune per-chain sampling  │ Always use defaults         │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Output variation │ Calibrated per use case  │ Default ≈ T=0.7 everywhere  │
│ Test reliability │ T=0 chains are stable    │ Tests flaky on rerun        │
│ Prompt design    │ +1 layer (which T?)      │ Zero — pick prompts, ship   │
│ Onboarding       │ "JSON chains → T=0;      │ "Defaults work" — easier    │
│                  │  caption chains → T=0.9" │ to start, harder to debug   │
│ Vendor lock-in   │ Same                     │ Same                        │
│ Failure blast    │ Wrong T → bad outputs    │ Always-default → flaky      │
│                  │ in one chain             │ JSON parsing across chains  │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't tune sampling, so we accept whatever the host agent picks. For spec generation, that's fine — the cost is two `/aipe:feature` calls against the same context produce subtly different specs, but both are acceptable. If aipe were a downstream system that consumed its own output, defaults wouldn't be enough.

### Sub-block 2 — what the alternative would have cost

Tuning per-chain sampling would require aipe to inject sampling parameters into the host's prompt or API call. The host agents don't expose this cleanly from a slash command — neither Claude Code nor Codex CLI lets a plugin override the agent's sampling. We'd need to ask the host for a "deterministic mode" flag, which neither supports today. The cost-to-benefit doesn't justify the work; spec generation tolerates variation.

### Sub-block 3 — the breakpoint

Fine until two `/aipe:study` runs on the same repo produce wildly different study guides — at which point reproducibility becomes a real complaint, and "tuneable sampling per spec type" earns its place. Today, the host's defaults produce specs that are similar enough that this isn't a complaint.

---

## Tech reference (industry pairing)

### Sampling parameter API surface

- **Codebase uses:** none directly — aipe defers to the host agent.
- **Why it's here:** would be the lever for spec-generation reproducibility if it were needed.
- **Leading today:** Anthropic Messages API + OpenAI Chat Completions API — `adoption-leading` for sampling configuration, 2026.
- **Why it leads:** consistent `temperature` / `top_p` field names across providers; documented defaults; well-understood ranges.
- **Runner-up:** custom decoding strategies (beam search, contrastive decoding) — `innovation-leading` in research, less common in production APIs.

---

## Project exercises

No aipe-anchored Build items. Curriculum tags this to loopd (C1.3 anchored to loopd's caption chain via B1.3: "Verify recentCaptions anti-repetition + add temperature variance per variant as a deliberate sampling experiment"). aipe's role is conceptual defense.

---

## Summary

Sampling parameters — temperature, top-p, top-k — decide how stochastic vs deterministic the model's output is. aipe doesn't tune them; the host agent picks defaults (typically T≈0.7). The constraint: aipe is a plugin, not a chain author; sampling lives in the host's domain. The cost: spec generation has subtle run-to-run variation; acceptable for the use case.

- Temperature scales logits before softmax; lower = sharper distribution.
- Top-p truncates to a cumulative probability mass; top-k truncates to a fixed token count.
- Production default is T≈0.7, top_p≈0.9; tune lower for structured outputs.
- aipe defers sampling to the host agent — no per-spec-type tuning.
- The breakpoint is when run-to-run variation becomes a user complaint.

---

## Interview defense

### What an interviewer is really asking

The question behind sampling is "do you understand that models are stochastic by default?" The dodge is to define temperature. The senior answer connects sampling regime to use case (deterministic structured output vs creative free-form).

### Likely questions

**Q [mid]:** What does temperature do?

**A:** Divides logits before softmax. T=0 picks the argmax (deterministic); T=1 leaves the distribution unchanged; T>1 flattens (more varied). Most production chat uses T≈0.7 — calibrated for natural-sounding variation without incoherence.

```
T=0  ────▶ argmax: [the the the the the]
T=1  ────▶ sampled: [the a my our this]
T=2  ────▶ flat:   [the eggplant zebra ✦ ...]
```

**Q [senior]:** When would you set T=0?

**A:** Anything an automated system consumes — JSON outputs, file paths, code generation. Variation in those cases means flakiness in downstream systems. For human-readable outputs (captions, prose, summaries), T≈0.7 produces more natural language; users notice the rigidness of T=0 output even when it's "correct."

```
Use case                        T choice         Why
────────                        ────────         ───
JSON for downstream parser      0–0.1            zero parse errors
Code regeneration               0–0.3            no syntax variation
Spec generation (aipe)          0.5–0.7          structured but natural
Caption / variant generation    0.7–1.0          variety is the feature
Brainstorming                   1.0+             explore the distribution
```

**Q [arch]:** Why doesn't aipe set sampling parameters in its wrappers?

**A:** Two reasons. First, the host agents (Claude Code, Codex CLI) don't expose a clean way for a plugin to override sampling. We'd have to embed an API call in the wrapper that goes around the host — breaking the "host does the work" model. Second, spec generation tolerates the host's defaults. Two `/aipe:feature` runs against the same context produce similar but not identical specs; that's acceptable. If the use case ever required strict reproducibility (e.g., specs as build artifacts that have to byte-match across CI runs), we'd need a different solution. Today, the cost-to-benefit doesn't justify it.

### The question candidates always dodge

**Q:** Why is T=0 not always the right choice?

**A:** Because T=0 produces rigid, repetitive outputs that humans find unnatural. The model's distribution captures meaningful variation in word choice and phrasing; argmax-only output loses that variation. For human consumption, mild stochasticity is a feature.

```
T=0 caption (deterministic)        T=0.7 caption (varied)
─────────────────────────         ──────────────────────
"Today I went to the park."       "Today I went to the park."
"Today I went to the park."       "Spent the afternoon at the park today."
"Today I went to the park."       "Park day — quiet morning."
"Today I went to the park."       "Walked the dog at the park."

(every run identical)             (variation is human-readable)
```

For machine-consumed outputs, identical is right. For human-consumed outputs, variation is right.

### One-line anchors

- Temperature is the divisor on logits; lower T → sharper distribution.
- Top-p truncates by cumulative probability; top-k by absolute token count.
- aipe defers sampling to the host agent; no per-spec-type tuning today.
- T=0 for structured outputs; T≈0.7 for natural prose.
- Run-to-run variation is acceptable for spec generation; would not be for build artifacts.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the logits → temperature → truncation → sample flow.

### Level 2 — Explain it out loud
Explain why JSON-output chains want T=0 and caption chains want T=0.7. Under 90 seconds.

### Level 3 — Apply it to a new scenario

aipe is asked to support a `/aipe:test-suite` command that generates Vitest tests. Should the host agent run at low T or default T? Defend.

### Level 4 — Defend the decision you'd change

"If aipe added a per-spec-type sampling-control mechanism, how would it work? What does it cost?"

### Quick check — code reference test
Without opening files:
- What's the typical production T for chat? → ~0.7
- What does top-p truncate by? → cumulative probability
- Does aipe set sampling parameters? → No, defers to host
