# Structured outputs

**Industry name(s):** JSON mode, tool schemas, function calling outputs, constrained decoding
**Type:** Industry standard

> When the consumer of model output is code, not a human — make the model output parseable JSON validated against a schema, every time.

**See also:** → [03-sampling-parameters](03-sampling-parameters.md) · → [12-output-mode-mismatch](12-output-mode-mismatch.md)

---

## Why care

You've parsed an LLM's "JSON output" only to find the model wrapped it in ` ```json ... ``` ` fences, or added an explanatory paragraph before the opening brace, or hallucinated a trailing comma. Free-form text + `JSON.parse()` is a recipe for runtime exceptions. The fix is for the model to commit to JSON at the decoding layer, not at the prompt layer.

The pattern is *constrained decoding* — the model is restricted to only emit tokens that keep the output valid against a schema. Same shape recurs in any system where a generator's output must conform to a grammar — SQL query builders, code generators that must produce parseable AST. The trick is to push the constraint *into* the generator, not check it after the fact.

---

## How it works

A typewriter with a grammar enforcer that won't let you type characters that produce invalid syntax.

### JSON mode

Most modern LLM APIs (Anthropic, OpenAI, Google) support a "JSON mode" that constrains the output to valid JSON. The decoder masks any token that would break JSON validity (e.g., closing braces in the wrong position). The output is parseable JSON every time — not "usually."

```
prompt: "Extract the name and age from: John is 30."

with JSON mode:    {"name": "John", "age": 30}
without JSON mode: Sure! Here's the extracted info:
                   ```json
                   {"name": "John", "age": 30}
                   ```
```

### Schema-constrained decoding

Beyond raw JSON validity, you can pass a JSON Schema and the model is constrained to produce output that matches the schema — required fields present, types correct, enum values respected.

```
schema: { name: string, age: integer, role: "admin" | "user" }

prompt:     "John is a 30-year-old admin."
output:     {"name": "John", "age": 30, "role": "admin"}
                                         ▲
                                         | "manager" would be rejected
                                         | at decode time, never emitted
```

If you're coming from frontend, think of this like a controlled `<input type="email">` — the browser constrains what can be entered, not just what's validated on submit.

### Tool / function calling

Anthropic's tool use and OpenAI's function calling are special cases of schema-constrained decoding. The "tool" is a function signature; the model emits a structured call object that matches that signature.

```
tool: write_file(path: string, content: string)
model output: { "tool": "write_file", "input": { "path": "...", "content": "..." } }
```

This works whether the consumer is a programmatic dispatcher (parse the call, invoke the tool) or an agent loop (route the call to the next step). The schema is the contract.

### What aipe doesn't do

aipe doesn't request structured outputs from any LLM. The host agent generates markdown specs as free text; users read them. There's no automated downstream consumer of the spec output.

The concept matters conceptually because spec templates in `specs/<type>.md` ARE shape constraints — they tell the host agent "output sections in this order with these names." The model isn't constrained at the decoder layer; it's constrained at the prompt layer. The constraint is honoured because the prompts are precise, but it's softer than schema validation.

### The principle — push the constraint into the generator

When output must conform to a grammar, the cheapest fix is to constrain the generator, not validate the output. Prompt instructions ("output JSON") plus output parsing ("if not JSON, fail") is a worse design than constrained decoding because the prompt is a wish and the parsing is recovery; constrained decoding is enforcement.

The full picture is below.

---

## Structured outputs — diagram

```
Free-form vs constrained generation

┌─ Free-form prompt + parse ──────────────────────────────────────────────┐
│                                                                         │
│   prompt: "Output JSON: {...}"                                          │
│        │                                                                │
│        ▼                                                                │
│   model emits any tokens                                                │
│        │                                                                │
│        ▼                                                                │
│   ```json\n{"name": "John"}\n``` followed by paragraph                  │
│        │                                                                │
│        ▼                                                                │
│   regex / try-catch / strip fences / repair                             │
│        │                                                                │
│        ▼                                                                │
│   {"name": "John"}  ✓  (sometimes; sometimes raises)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─ Schema-constrained decoding ───────────────────────────────────────────┐
│                                                                         │
│   prompt + schema: { name: string, age: integer }                       │
│        │                                                                │
│        ▼                                                                │
│   decoder masks tokens that would break the schema                      │
│        │                                                                │
│        ▼                                                                │
│   {"name": "John", "age": 30}  ✓  every time                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Not used directly.** aipe's templates produce markdown for human review, not JSON for programmatic consumption. The host agent's output is free text.

aipe's templates *do* impose shape constraints via prompt design — `specs/study.md` has a strict per-concept section order, sub-field requirements, and naming rules. These constraints land in the host agent's prompt and are honoured by the model's instruction-following — not by decoder-level enforcement. The difference is real: a well-trained model honours instructions ~95% of the time; constrained decoding is ~100%.

For aipe to need structured outputs, the consumer would have to be code. Hypothetical: a future `/aipe:implement` command that reads a spec and dispatches edits would benefit from the spec being JSON-shaped under the hood. Today, no such consumer exists.

---

## Elaborate

### Where this pattern comes from

JSON mode in LLM APIs started around 2023 with OpenAI's `response_format: { type: "json_object" }`. Schema-constrained decoding (full JSON Schema) followed in 2024 with Anthropic's tool use, OpenAI's structured outputs (`response_format: { type: "json_schema" }`), and similar in Gemini. The decoder-level enforcement was a step-change in reliability for downstream-of-LLM systems.

### The deeper principle

Schema is contract; constrained decoding is enforcement. Treat your output schema as a first-class artifact, not an afterthought.

### Where this breaks down

When the right output is genuinely a hybrid (some structured fields, some free prose). The model can do this — JSON with a `"reasoning": "..."` field — but the design pressure is to either fully embrace constraints (everything in JSON) or fully accept free-form (markdown spec, no JSON). Hybrid designs are harder to reason about.

### What to explore next

- [03-sampling-parameters](03-sampling-parameters.md) → sampling matters even with constraints
- [12-output-mode-mismatch](12-output-mode-mismatch.md) → when the prompt says one mode but you got another
- Anthropic's tool use docs, OpenAI's structured outputs docs

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Schema-constrained       │ Free-form + parsing         │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Parse success    │ ~100%                    │ ~85–95%                     │
│ Setup cost       │ Define + maintain schema │ Just write the prompt       │
│ Tool latency     │ Same or slightly slower  │ Same                        │
│ Error handling   │ Schema match guaranteed; │ Try-catch around every parse│
│                  │ no try-catch needed      │                             │
│ Vendor lock-in   │ Schema shape per         │ Provider-agnostic prompt    │
│                  │ provider                 │                             │
│ Output           │ Pure data, no prose      │ Mixed prose + data; hard    │
│   shape          │                          │ to extract                  │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't use structured outputs, so it doesn't have a parseable representation of generated specs. A future `/aipe:implement` consumer would have to parse markdown headings to find sections — fragile under template evolution. The cost lands when such a consumer is built; today, no consumer exists.

### Sub-block 2 — what the alternative would have cost

If aipe templates required JSON output, every spec would lose readability — users couldn't skim them, code reviewers couldn't read diffs, the docs site couldn't render them naturally. The output is for humans first; constraints would hurt.

### Sub-block 3 — the breakpoint

Fine until aipe ships a programmatic consumer of spec output (e.g., `/aipe:implement`). At that point, either (a) the consumer parses markdown by section (fragile), or (b) the templates emit a JSON sidecar (e.g., `.aipe/specs/features/foo.md` + `.aipe/specs/features/foo.json`). Option (b) is the structured-output path.

---

## Tech reference (industry pairing)

### LLM structured-output APIs

- **Codebase uses:** none — aipe doesn't call LLMs.
- **Why it's here:** the lever for "parseable LLM output" if aipe ever needs it.
- **Leading today:** Anthropic tool use + OpenAI structured outputs (`json_schema` mode) — `adoption-leading` for downstream-of-LLM systems, 2026.
- **Why it leads:** decoder-level enforcement = 100% parse success; well-defined APIs; widely supported.
- **Runner-up:** Instructor / Outlines (Python libs that wrap LLM APIs with Pydantic models) — `innovation-leading` for typed Python codebases; same enforcement, friendlier ergonomics.

---

## Project exercises

No aipe-anchored Build items. Curriculum tags this concept to loopd via B1.1: "Add Zod schemas for every AI input/output across loopd's 5 chains `[exercises C1.4, C1.12]`" — loopd has 5 production chains, four of which emit JSON; structured outputs are mandatory there. aipe's role is conceptual defense.

---

## Summary

Structured outputs use schema-constrained decoding to guarantee LLM outputs match a contract — JSON validity, field types, enum values. aipe doesn't use them; spec outputs are markdown for human review, not data for programmatic consumption. The constraint that drove this: aipe's output is documents, not data. The cost being paid: a future programmatic consumer of spec output would have to parse markdown.

- JSON mode constrains to valid JSON; schema mode constrains to a specific schema.
- Tool / function calling is a special case of schema-constrained decoding.
- aipe's templates impose shape via prompt instructions, not decoder enforcement.
- The breakpoint is "first programmatic consumer of spec output."

---

## Interview defense

### Likely questions

**Q [mid]:** What's the difference between asking the model to output JSON and using JSON mode?

**A:** Asking via prompt is a wish — the model usually complies (~85–95%), occasionally adds prose, occasionally wraps in fences. JSON mode constrains the decoder to only emit tokens that keep the output valid JSON — ~100% success. Schema mode goes further: the output is constrained to match a specific schema.

```
Prompt only            JSON mode             JSON Schema mode
───────────            ─────────             ─────────────────
"Output JSON"          response_format =     response_format =
                       {type: "json_object"} {type: "json_schema",
                                              schema: {...}}
   │                       │                     │
   ▼                       ▼                     ▼
~90% parseable          ~100% parseable       ~100% schema-matching
```

**Q [senior]:** Why doesn't aipe use structured outputs?

**A:** The output is markdown for human readers and human reviewers, not data for downstream programs. Structuring it as JSON would lose readability (you can't skim a JSON tree the way you skim a markdown spec) and would require a renderer between the spec and the user. The current free-text-with-prompt-instructions design is right for the human-output use case.

**Q [arch]:** When would aipe need structured outputs?

**A:** If a future spec type emits something a program will consume — a `/aipe:implement` command that reads a spec and dispatches file edits, for example. At that point the spec's "Files to touch" section is data, not prose, and structured-output enforcement earns its place. The breakpoint is "first programmatic consumer." Until then, free text is right.

### The question candidates always dodge

**Q:** Why not enforce schema via prompt + retries?

**A:** Because retries cost tokens and time, and the retry's failure mode (model produces "almost-JSON" again) leads to either an infinite loop or a giving-up state. Schema-constrained decoding pays the cost once at decode time and guarantees success; prompt-and-retry pays the cost potentially many times and doesn't guarantee anything.

```
Prompt + parse + retry                  Schema-constrained decoding
─────────────────────────              ─────────────────────────────
prompt → output → parse                schema + prompt → output
   │      ✗                                                ✓
   ▼      ↓ retry                      one call, guaranteed parse
prompt → output → parse                no retry logic, no fallback
   ↓      ✗
   ↓      ↓ retry
   ...   give up → throw

3+ calls in failure case               1 call always
```

### One-line anchors

- Constrained decoding makes JSON output ~100% reliable; prompts alone are ~90%.
- Tool / function calling is schema-constrained decoding for an action language.
- aipe's templates use prompt constraints, not decoder constraints — fine for human output.
- The breakpoint is "first programmatic consumer of spec output."

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the free-form-vs-constrained generation flows side by side.

### Level 2 — Explain it out loud
Explain why JSON mode beats prompt-only JSON instructions. Under 90 seconds.

### Level 3 — Apply it to a new scenario

A future `/aipe:implement` reads a spec's "Files to touch" list and edits each file. Should that section be free prose or JSON? Why?

### Level 4 — Defend the decision you'd change

"If aipe added JSON sidecars next to each spec file, what would it cost in maintenance?"

### Quick check — code reference test
Without opening files:
- What guarantees JSON validity 100% of the time? → schema-constrained decoding
- Does aipe use structured outputs? → No
- What's the breakpoint? → first programmatic consumer of spec output
