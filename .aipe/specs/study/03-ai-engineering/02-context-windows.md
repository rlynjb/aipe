# Context windows + lost-in-the-middle

**Industry name(s):** Context window, attention horizon, lost-in-the-middle (Liu et al., 2023)
**Type:** Industry standard

> The model's working memory is one fixed-size token sequence — and it doesn't attend equally to every position in it. Beginning and end get the most weight; the middle gets less.

**See also:** → [01-tokenization](01-tokenization.md) · → [16-chunking-strategies](16-chunking-strategies.md)

---

## Why care

You've written a long prompt to an LLM and watched it ignore instructions buried in the middle while obsessing over the first and last paragraphs. That's not a bug — it's how attention scales in practice. Models read in tokens, but they don't *remember* in tokens uniformly; positional bias is real.

The pattern is *attention falloff in the middle of long contexts*. It shows up wherever a transformer processes long sequences. The trick is to put load-bearing instructions at the ends and treat the middle as supporting evidence, not primary signal. Here's why that matters for an AI-tooling project that loads 100k+ tokens of wrappers and context.

---

## How it works

A long meeting where attention drifts. The first 10 minutes set the agenda; the last 10 minutes are the action items; the 90 minutes in between are arguments most attendees half-remember. Long LLM contexts work similarly — the head and tail get the most "attention weight"; the middle is fuzzier.

### Context window — the hard limit

The context window is the maximum token count the model can process in one call. Today's typical values:

- Claude Haiku 4.5: 200k tokens
- Claude Sonnet 4.6: 200k tokens
- Claude Opus 4.7: 1M tokens
- GPT-4o: 128k tokens
- GPT-4.1: 1M tokens
- Llama 3.1 405B: 128k tokens

Exceed the window and the model errors out or silently truncates (depending on host). The window is in tokens (see [01-tokenization](01-tokenization.md)).

### Lost-in-the-middle — the soft limit

Liu et al. (2023) showed that retrieval-style tasks suffer significant accuracy loss when the relevant information lands in the middle of the context. Performance is shaped like a U: high at position 0 and position N, dipping at position N/2.

If you're coming from frontend, think of this like keyboard focus — the input where the cursor is gets all the attention; everything else is peripheral. The model's "cursor" effectively lives at the two ends; the middle is peripheral.

The practical consequence: if you load a 100k-token prompt with the user's actual question buried at token 50k, the model is less likely to act on the question than if the question sits at the top or bottom. This is why a well-structured prompt repeats critical instructions at the end ("Remember: respond only with JSON") even when they appeared at the start.

### Why long contexts don't make the problem go away

Increasing the window from 200k to 1M tokens helps with the hard limit (you can fit more) but doesn't fix the U-shape. The middle still gets less attention; you just have more room to bury things in it. The fix isn't a bigger window — it's better placement of load-bearing content.

For a system like aipe that loads 100k+ tokens per `/aipe:<type>` call, this means: critical instructions go in the wrapper's opening Step 1 and closing Step N (STOP). Reference material (the template body, the canonical section list) sits in the middle where the model can reach it on demand but doesn't need to hold it primary.

### How aipe's structure reflects this

`commands/study.md` (the 138 KB wrapper) opens with Step 1 (scaffold check, the most critical gate) and closes with the STOP. The middle is the template-version flag taxonomy, the repair recipes, the canonical section list — material the agent references when it needs to but doesn't need to hold front-of-mind during every step.

If we'd put Step 1 in the middle of the wrapper, the scaffold check would get less attention and the agent would occasionally proceed without scaffolding. Position is functional.

### The principle — context isn't memory, it's a beam

Models don't have memory in the sense of equally-accessible random storage. They have an attention beam that's strongest at the ends and weakest in the middle. Design prompts so load-bearing content sits where the beam is strongest.

The full picture is below.

---

## Context windows — diagram

```
Attention falloff across the context window (Liu et al., 2023)

  Accuracy
   100% │ ●━━━━━━━━━●                                ●━━━━━━━━━●
        │             ╲                            ╱
        │              ╲                          ╱
    75% │               ●━━━━━━●        ●━━━━━━━●
        │                       ╲      ╱
        │                        ╲    ╱
    50% │                         ●━━●
        │                          U-shape
    25% │
        │
     0% │
        └─────────────────────────────────────────────────────
        position 0      position N/2 (lowest)      position N (max)
                              ↑
                       hardest to recall
```

```
aipe wrapper structure mirrors the attention shape

┌─ commands/study.md (138 KB) ─────────────────────────────────────────────┐
│                                                                          │
│  ╔══ HIGH ATTENTION (head) ═══════════════════════════════════════╗      │
│  ║  Step 1: scaffold check  ◀── most critical gate goes here     ║      │
│  ║  Step 2: load context                                          ║      │
│  ║  Step 3: load template                                         ║      │
│  ║  Step 4: detect existing / branch CREATE vs UPDATE             ║      │
│  ╚════════════════════════════════════════════════════════════════╝      │
│                                                                          │
│  ┌── LOWER ATTENTION (middle) ─────────────────────────────────┐         │
│  │  Step 5C–11C: CREATE mode (template body, section rules)    │         │
│  │  Step 5U–6U: UPDATE mode (Diff A + Diff B flag taxonomy)    │         │
│  │  Step 8U: repair recipes per flag                           │         │
│  │  ─ reference material, accessed on demand ─                 │         │
│  └─────────────────────────────────────────────────────────────┘         │
│                                                                          │
│  ╔══ HIGH ATTENTION (tail) ═══════════════════════════════════════╗      │
│  ║  Step 7U: print plan + STOP                                    ║      │
│  ║  Step 9U: report + STOP                                        ║      │
│  ║  "Stop. Wait for the user's next instruction."                 ║      │
│  ╚════════════════════════════════════════════════════════════════╝      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Not yet implemented as code in aipe.** aipe doesn't read or process its own context window — the host agent does. The concept matters for the *design* of aipe's wrappers, not for its runtime.

How it shapes existing wrappers:
- Critical gates (Step 1 scaffold, Step 7U STOP) live at the head and tail of every wrapper — the high-attention positions.
- Reference material (flag taxonomies, repair recipes) lives in the middle — accessed on demand.
- Every wrapper ends with an explicit "STOP" line — exploiting tail attention to enforce the no-auto-implement invariant.

The concept is in-scope as `[learn-only]` for aipe per the curriculum (Phase 1 C1.2: `Context windows and the lost-in-the-middle problem [learn-only — surfaces in Phase 2 chunking]`). The aipe-anchored exercise would be the Phase 2B RAG work, where chunking strategy depends on lost-in-the-middle.

---

## Elaborate

### Where this pattern comes from

Lost-in-the-middle was documented by Liu et al. (2023, Stanford / Anthropic) using needle-in-a-haystack-style retrieval tests. The finding generalises across model families and sizes — it's an attention-mechanism effect, not a quirk of one model. Earlier work (Beltagy et al., Longformer 2020) tried to mitigate the underlying issue architecturally; modern long-context models partly solve it (Claude Opus 4.7 is significantly better than GPT-3.5-turbo on the U-shape test) but don't eliminate it.

### The deeper principle

Position is a feature. A token at position 0 carries different weight than the same token at position N/2, even when both are inside the model's hard window. Design prompts as if the model has spotty memory: critical content goes where attention is strongest.

### Where this breaks down

When critical content cannot be at the ends — e.g., a long document where the user's question depends on a specific paragraph in the middle. In that case, retrieval-then-generation (extract the relevant paragraph, put it at the end of a shorter prompt) outperforms loading the whole document. This is the foundational case for RAG.

### What to explore next

- [16-chunking-strategies](16-chunking-strategies.md) → how to slice long documents to put relevant chunks at the ends
- Liu et al., "Lost in the Middle" (2023) — the original paper
- The reincodes interactive viz for lost-in-the-middle (curriculum side-track)

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Design around U-shape    │ Treat context as flat       │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Prompt design    │ Position critical        │ Write naturally, hope       │
│   effort         │ content at head + tail   │                             │
│ Reliability      │ ~95% on critical gates   │ ~80% with degradation as    │
│                  │                          │ prompts grow                │
│ Prompt length    │ Possibly repeats         │ No repetition needed —      │
│                  │ critical instructions    │ but lower reliability       │
│ Onboarding       │ "Put STOPs at the end" — │ "Just write what you mean"  │
│                  │ explicit rule            │ — no rule, more drift       │
│ Failure blast    │ Reliability dips in      │ Reliability dips across     │
│                  │ middle-of-prompt content │ all long-prompt scenarios   │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Designing around the U-shape costs prompt-length: critical instructions sometimes appear twice (head and tail) when once would suffice if attention were flat. For aipe's wrappers, this is minor — STOPs at the head (after scaffold) and tail (after generation) are natural anyway. The cost lands when a wrapper has multiple critical gates and they can't all live at the ends; today, no wrapper has that problem.

### Sub-block 2 — what the alternative would have cost

Treating context as flat — writing wrappers as natural prose with steps in chronological order regardless of attention shape — would have made Step 7U's UPDATE-mode STOP less reliable. The STOP comes 60–80% through `commands/study.md` (the middle, attention-wise). If the wrapper relied on it being respected the same as Step 1's scaffold STOP, the middle-attention dip would occasionally let the agent proceed past it. The current design exploits the explicit "STOP. Wait for the user's reply." phrasing — short, declarative, repeats at every stopping point — to compensate.

### Sub-block 3 — the breakpoint

Fine until the wrapper grows past the point where critical content is forced into the middle. `commands/study.md` is 138 KB; if it grows to 250 KB, the Step 7U STOP would sit at ~40% depth (middle territory). At that scale, the right move is to extract the middle into smaller files loaded on demand — same fix as the tokenization breakpoint. The two breakpoints often coincide.

---

## Tech reference (industry pairing)

### Long-context LLMs

- **Codebase uses:** the host agent picks the model; aipe is model-agnostic.
- **Why it's here:** the hard ceiling on how much aipe can load per call.
- **Leading today:** Claude Opus 4.7 (1M tokens), GPT-4.1 (1M tokens) — `innovation-leading` for long-context applications, 2026.
- **Why it leads:** 5–10× the working room of mainstream models, enabling whole-codebase prompts; lost-in-the-middle still applies but is less acute.
- **Runner-up:** Claude Sonnet 4.6 / Haiku 4.5 (200k) — `adoption-leading` for typical workloads; cheaper, fast, sufficient for prompts under ~140k tokens.

---

## Project exercises

No Build items assigned to aipe for context windows. Curriculum tags this as `learn-only` for aipe (C1.2: "Context windows and the lost-in-the-middle problem `[learn-only — surfaces in Phase 2 chunking]`"). The proof artifact lives in Phase 2B (RAG) chunking strategy, not in aipe directly.

Cross-project: the reincodes portfolio's lost-in-the-middle viz is the conceptual proof artifact for this curriculum concept.

---

## Summary

Context windows are the hard token limit a model can process per call; lost-in-the-middle is the soft accuracy drop in middle positions of long prompts. aipe's wrappers are designed around this shape — Step 1 scaffold and Step N STOP live at the high-attention head and tail; flag taxonomies and repair recipes live in the lower-attention middle. The constraint that drove this: long wrappers loaded into long prompts can't rely on uniform attention; critical gates must sit where the beam is strongest. The cost being paid: minor prompt-length repetition (STOPs phrased explicitly at multiple points).

- Context window is hard token limit; lost-in-the-middle is soft accuracy U-shape.
- Position is functional — head and tail get the most attention.
- aipe wrappers place critical gates (Step 1, Step 7U STOP) at the ends.
- The breakpoint is wrapper-size-driven; same point as the tokenization breakpoint.
- RAG is the structural solution when load-bearing content can't fit at the ends.

---

## Interview defense

### What an interviewer is really asking

"Why are LLM prompts sensitive to length?" is testing whether you understand attention's non-uniformity. The dodge is to say "the window is limited." The senior answer separates hard limits (window) from soft limits (lost-in-the-middle) and names a design decision that respects both.

### Likely questions

**Q [mid]:** What's lost-in-the-middle?

**A:** A measured accuracy drop when relevant information is buried in the middle of a long prompt. Liu et al. (2023) showed the effect is U-shaped — high accuracy at the start and end of context, dipping in the middle. It applies across model families and isn't fully fixed by larger context windows.

**Q [senior]:** Why is `commands/study.md` structured with Step 1 at the top and Step N at the bottom?

**A:** Because head and tail get the strongest attention. Step 1 (scaffold gate) and Step N (STOP) are the two most critical gates in any wrapper — if either is missed, the contract is broken. Placing them at the ends exploits the U-shape; placing them in the middle (e.g., scaffold check at line 80% of the wrapper) would let occasional middle-attention dips skip them.

```
Wrapper attention                         If structured naively
─────────────────                         ──────────────────────
[STEP 1 scaffold]  ← head, ~95% reliable  [Step 5C, 6C, ...]
[Step 2 load]                             [STEP 1 scaffold]    ← middle, ~80%
[Step 3 template]                          ─ breaks more often ─
[Step 4 branch]                           [Step N STOP]
[Step 5–8 body]                           [...]
[Step N STOP]      ← tail, ~95% reliable
```

**Q [arch]:** What changes when running aipe on a 1M-token context model?

**A:** The hard ceiling moves from "~67% of 200k = comfortable" to "~13% of 1M = vast headroom." Lost-in-the-middle relaxes too — at 1M tokens, the U-shape is shallower (modern long-context models invest in mitigations). The architectural option that opens up: UPDATE-mode runs could load the *entire* existing study guide into prompt instead of file-by-file streaming. That's currently impossible at 200k; at 1M it's natural. The breakpoint where this becomes valuable is "study guide > 100 files" — we're under that today.

### The question candidates always dodge

**Q:** Why don't you just use a 1M-context model and stop worrying?

**A:** Three reasons the bigger-context-model path isn't a complete answer:

```
┌────────────────────┬──────────────────────────┬───────────────────────────┐
│ Dimension          │ Design for 200k (today)  │ Always use 1M model       │
├────────────────────┼──────────────────────────┼───────────────────────────┤
│ Cost               │ Sonnet/Haiku at $3/M     │ Opus at $15/M tokens —    │
│                    │ tokens                   │ 5× more per call          │
│ Latency            │ ~1–3s per spec section   │ 2–5× slower on 1M models  │
│ Model availability │ Sonnet on every host     │ Opus is premium tier;     │
│                    │                          │ not all users have access │
│ Lost-in-middle     │ Avoided by design        │ Reduced but not gone      │
│ Vendor lock-in     │ Multiple model options   │ Single model              │
│ Failure blast      │ Wrapper grows → users    │ Wrapper grows → users on  │
│                    │ feel it on all hosts     │ smaller models broken     │
└────────────────────┴──────────────────────────┴───────────────────────────┘
```

Designing for the smaller window keeps aipe portable across models. If aipe became Opus-only by design, it'd be a less useful tool.

### One-line anchors

- Context window is hard limit; lost-in-the-middle is the U-shaped soft limit.
- Head and tail attention is strongest; middle is weakest.
- Position critical content (scaffold gate, STOP) at the ends.
- Bigger windows relax the hard limit but don't eliminate the soft one.
- For long content that can't be at the ends, RAG is the structural fix.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the U-shape attention curve. Mark where critical content should go and where reference material lives.

### Level 2 — Explain it out loud
Explain context windows + lost-in-the-middle to someone who's used to flat-memory programming (Python lists, JS arrays). Under 90 seconds.

### Level 3 — Apply it to a new scenario

A future `/aipe:onboarding` wrapper has 200 lines of body. Where should the "do not proceed unless authenticated" gate live? Why?

### Level 4 — Defend the decision you'd change

"If aipe required users to run on Opus 4.7 (1M tokens), how would you restructure `commands/study.md`?"

### Quick check — code reference test
Without opening files:
- What's Claude Sonnet 4.6's context window? → 200k tokens
- Where does the Step 7U STOP live in `commands/study.md`? → roughly at the bottom (tail)
- What's the U-shape called? → lost-in-the-middle
