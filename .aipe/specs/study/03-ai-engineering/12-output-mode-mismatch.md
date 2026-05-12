# Output mode mismatch

**Industry name(s):** Output-format drift, mode mismatch, type-of-output anti-pattern
**Type:** Industry standard

> The prompt says "return JSON" but the model returns markdown — or vice versa. The fix is to pick one output mode per chain and stick to it.

**See also:** → [04-structured-outputs](04-structured-outputs.md) · → [10-single-purpose-chains](10-single-purpose-chains.md)

---

## Why care

You've parsed an LLM's "JSON output" and discovered it occasionally returns prose wrapped in code fences, or markdown with a JSON-looking object embedded, or pure JSON. The downstream parser breaks on the prose. The root cause is usually that the prompt was ambiguous about the output mode — one paragraph said JSON, the example showed markdown.

The pattern is *commit to one output mode per chain*. Same shape as picking one response format per API endpoint — don't return JSON sometimes and HTML other times. The trick is to enforce the choice in every layer: prompt instructions, schema (if available), examples, parser.

---

## How it works

A chain whose output type is declared once, in three places, all agreeing.

### The three layers that must agree

1. **Prompt instruction:** "Return only JSON with these fields."
2. **Examples:** few-shot examples are JSON, not prose.
3. **Decoding constraint (if available):** `response_format: {type: "json_object"}` or schema-constrained mode.

When all three agree, output is reliable. When they disagree, the model picks one — often the example, because examples are more concrete than instructions.

### What aipe does

aipe's templates produce markdown — clearly, consistently. Every template's instructions, every example in the templates, every output that wrappers reference: all markdown. There's no schema-constrained decoding because aipe doesn't need to be parsed by a downstream program.

The mode is markdown, and the choice is consistent across all three layers. No mismatch.

### Where mismatches happen

In loopd's 5 chains (curriculum's reference case), four chains return JSON for downstream consumption; one returns markdown for human reading. Each chain's prompt, examples, and decoding constraint align with its mode. If a prompt mixed the modes (e.g., "return JSON, here's a markdown example"), the model would produce mixed output.

If you're coming from frontend, this is like a typed component that declares it returns JSX but renders strings — TypeScript would catch it; LLM prompts won't unless every layer is consistent.

The full picture is below.

---

## Output mode mismatch — diagram

```
Aligned (no mismatch)                   Mismatched (the failure mode)
─────────────────────                    ─────────────────────────────

prompt:    "Return only JSON"            prompt:    "Return only JSON"
examples:  {"name": "John"}              examples:  Hello, my name is John.
schema:    {name: string}                schema:    (none)
                                         
result:    {"name": "John"}              result:    "Hello, my name is John."
                                                    OR
                                                    ```json
                                                    {"name": "John"}
                                                    ```
                                                    OR
                                                    {"name": "John"}
                                         
↓ reliable                              ↓ stochastic, breaks parsing
```

---

## In this codebase

**Mode is markdown, consistently.** All aipe templates produce markdown; all examples in templates are markdown; no template asks for JSON or any other format. No mismatch risk.

Loopd's case (the curriculum's anchor for C1.12 via B1.1): 5 chains, 4 JSON + 1 markdown. Each chain's prompt + examples + (where available) schema constraint align with its declared mode. B1.1's deliverable (Zod schemas for all 5 chains) enforces the mode at the decoding boundary.

---

## Elaborate

### Where this pattern comes from

Output-mode discipline became visible in 2023 production LLM systems as developers found that "say what you want" wasn't enough — the model needed instructions, examples, AND decoding constraints to reliably produce one mode. Anthropic and OpenAI both added JSON modes around that time; structured outputs (schema-constrained) followed in 2024.

### The deeper principle

Consistency across layers beats strength of instruction. A weak instruction backed by a matching example outperforms a strong instruction contradicted by an example.

### Where this breaks down

When the output is hybrid by design — a JSON object with a `"reasoning"` field that's a long prose paragraph. The model handles this if the example shows the hybrid shape; problems arise when the example shows pure JSON or pure prose.

### What to explore next

- [04-structured-outputs](04-structured-outputs.md) → schema-constrained decoding makes mismatch impossible
- [10-single-purpose-chains](10-single-purpose-chains.md) → why each chain has one mode

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Consistent mode           │ Mixed-mode prompts          │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Parse success    │ ~95% (markdown) / 100%   │ ~70–85%                     │
│                  │ (schema-constrained JSON)│                             │
│ Prompt design    │ Pick mode once, repeat   │ Keep aligning prompt +      │
│   cost           │ across layers            │ example + schema             │
│ Failure mode     │ Wrong mode at one layer  │ Stochastic — sometimes      │
│                  │ → audit + fix            │ JSON, sometimes prose       │
│ Vendor lock-in   │ Same                     │ Same                        │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe gives up the option to mix modes — every template is markdown only. If a future template needed to emit JSON alongside markdown (e.g., a spec with a structured "Files to touch" list), it'd have to use markdown-with-JSON-embedded (parseable as both) or split into two artifacts.

### Sub-block 2 — what the alternative would have cost

Mixed-mode templates would be a maintenance nightmare. Every change to instruction or example would risk breaking the alignment. Parse failures would be intermittent — works on Sonnet, breaks on Opus, works again next month.

### Sub-block 3 — the breakpoint

Fine until a spec type genuinely needs hybrid output. The cleanest fix is to split the spec into two files (one markdown spec + one JSON sidecar) rather than mixing modes in one file. Today, no spec type needs this.

---

## Tech reference (industry pairing)

### Output-mode enforcement

- **Codebase uses:** markdown consistency across instructions, examples, and the implicit decoding (no schema constraint).
- **Why it's here:** the cheap path to reliable output for human-readable specs.
- **Leading today:** schema-constrained JSON mode — `adoption-leading` for downstream-of-LLM systems, 2026.
- **Why it leads:** 100% mode adherence; structured outputs are guaranteed.
- **Runner-up:** few-shot examples with prompt-level instructions — `adoption-leading` for human-output systems where 95% is fine.

---

## Project exercises

Curriculum's B1.1 (Zod schemas for loopd's 5 chains) anchors C1.12 to loopd, not aipe. For aipe, the discipline transfers — every template is one mode, consistently — but no separate Build item.

---

## Summary

Output mode mismatch happens when prompt instructions, examples, and decoding constraints disagree on the output format. aipe avoids this by emitting only markdown, consistently, across all three layers. The constraint that drove this: aipe's output is human-readable; no downstream parser depends on a specific structure. The cost being paid: aipe can't emit JSON or hybrid output without breaking the markdown-only invariant.

- Three layers (instruction, example, constraint) must agree on the output mode.
- aipe is markdown-only, consistently.
- Loopd has 4 JSON + 1 markdown chains; B1.1's schemas enforce the mode at the decoding boundary.
- The breakpoint is "first spec type that genuinely needs hybrid output."

---

## Interview defense

### Likely questions

**Q [mid]:** What does output-mode mismatch look like?

**A:** Prompt says "return JSON," but the example shows prose, so the model picks the example's format. The parse downstream breaks. The fix is to align all three layers — instructions, examples, decoding constraint — on the same mode.

**Q [senior]:** Why doesn't aipe have this risk?

**A:** Every template is markdown. Instructions say markdown; examples are markdown; the output is for human readers (no parser, no decoding constraint needed). The mode is one and consistent across all layers. There's nothing to mis-align.

**Q [arch]:** When would mode mismatch become a real risk for aipe?

**A:** If a future spec type emitted hybrid output (e.g., markdown spec + JSON sidecar for programmatic consumers). The cleanest fix is to split into two files; the worst fix is to embed JSON in markdown via prompt instructions ("output a markdown spec with a JSON block in 'Files to touch'"). The embed fix risks mode mismatch because the JSON block has to satisfy both human readability and machine parseability.

### The question candidates always dodge

**Q:** Why aren't your templates partly JSON to make `/aipe:implement` easier later?

**A:** Premature optimisation. `/aipe:implement` doesn't exist yet; designing today's templates around its hypothetical needs would compromise current readability for hypothetical future utility. When `/aipe:implement` arrives, the right design is a JSON sidecar (`.aipe/specs/features/foo.md` + `.aipe/specs/features/foo.json`), keeping markdown clean and JSON pure. No mode mismatch.

### One-line anchors

- Instructions + examples + decoding constraint must agree on output mode.
- aipe is markdown across all layers; no mismatch risk.
- Loopd uses 4 JSON + 1 markdown chains, each internally consistent.
- The breakpoint is the first hybrid-output spec type.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw aligned-vs-mismatched output mode flows.

### Level 2 — Explain it out loud
Explain why "return JSON, here's a markdown example" fails. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A hypothetical `/aipe:implement` needs both markdown (for the user) and JSON (for the dispatcher). How would you structure the output?

### Level 4 — Defend the decision you'd change

"Would you allow embedded JSON in aipe's markdown templates if it made `/aipe:implement` cheaper to build?"

### Quick check — code reference test
Without opening files:
- What's aipe's output mode? → markdown
- What layers must agree? → instruction, example, decoding constraint
- Where does aipe's anchor on this concept lie? → loopd's B1.1
