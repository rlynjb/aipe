# Curriculum Spec

A reusable prompt spec that turns any working codebase into a structured learning resource. Extracts formal concepts already present in the code, grounds each one in a specific file or pattern, and organises them into a curriculum ordered by dependency. Works with any app, any language, any stack.


## Why this works

> **Why it matters**
>
> Learning from toy examples teaches a concept in isolation. Learning from your own codebase teaches it in context — where it lives, why it was chosen, what problem it solves. That's the difference between knowing a pattern and knowing when to use it.


## Prompt template

Paste your codebase spec or architecture doc, then send this prompt. The output is a directory of structured curriculum markdown files (one per category, plus an ordered learning path and a `README.md` index) you can save and study from.


```
I'm going to share the architecture and codebase of an app
I built. Turn it into a structured learning resource that
teaches me the underlying concepts through my own code.

App spec / architecture doc:
[paste your spec, README, or architecture doc here]

1. Extract concepts
Identify every meaningful concept in this codebase.
Map each one to a formal name and category:

  → Agentic AI       LLM vs agent, tool calling, ReAct loop,
                    memory patterns, orchestration, prompt chaining
  → Systems thinking separation of concerns, data flow,
                    storage abstraction, idempotency,
                    migration strategies, race conditions
  → Thinking in code type-driven design, schema-first dev,
                    error classification, optimistic UI,
                    provider abstraction, rollback patterns
  → AI product eng   context window management, spec-driven dev,
                    memory bank patterns, evaluation,
                    cost vs capability tradeoffs
  → Language-agnostic any patterns or mental models that
                     transfer across stacks

2. Ground each concept in the codebase
For every concept, explain:
  → What it is       formal definition, 2–3 sentences
  → Where it lives   specific file, function, or pattern in this app
  → Why it exists    what problem it solves in this specific context
  → General rule     the transferable principle beyond this codebase

3. Build a curriculum
Organise all concepts into a learning path:
  → Order by dependency  prerequisites before advanced topics
  → Group by theme       cluster related concepts
  → Mark difficulty      foundational / intermediate / advanced
  → Suggest next steps   what to read, build, or explore to go deeper

4. Output format
Structure as a markdown document with:
  → Concept index at the top (name, category, difficulty)
  → One section per concept with the four explanations
  → Curriculum section at the end with ordered learning path
  → "Go deeper" links per concept

Constraints
  → Every explanation must reference a specific part of the codebase
  → No generic definitions disconnected from the actual code
  → Language-agnostic principles must be explicitly labelled
  → If a concept is only partially implemented, note what's missing
     and why completing it would deepen understanding
```


> 💾 Save output → `.aipe/specs/curriculum/[project-name]/` — a **directory** containing per-category chapter files (`00-overview.md`, `01-agentic-ai.md`, `02-systems-thinking.md`, `03-thinking-in-code.md`, `04-ai-product-engineering.md`, `05-language-agnostic.md`), an ordered `06-curriculum-path.md`, and a `README.md` index with a flat concept map.


## Example concepts it extracts — buffr


**Provider abstraction**

Lives in netlify/functions/lib/ai/provider.ts. The multi-provider factory that swaps Anthropic/OpenAI/Ollama behind a single interface. General rule: abstract what changes, stabilise what doesn't.

Lives in chains/summarizer.ts, chains/intent.ts. Each chain is a single-purpose LLM call. General rule: one prompt, one job — chain them rather than cramming everything into one context.

Lives in the manual actions race condition fix and the backfill migration script. General rule: operations safe to retry are easier to reason about, debug, and recover from.

Lives in the .aipe/ directory structure. Externalising AI context into files the model reads on session start. General rule: when a tool has no memory, you build the memory layer yourself.

Lives in the Neon DB migration plan (Phases 3–5). Write to both stores, verify parity, then cut over reads. General rule: never cut over reads and writes simultaneously — separate the risks.


## How to use the output

> This spec is reusable across any codebase, any language, any stack. The output changes — the prompt doesn't.

1. **Save as a curriculum directory** — Save under `.aipe/specs/curriculum/[project-name]/` (one file per category, plus the learning path and a `README.md` index). Update individual chapter files as the codebase grows — new features surface new concepts in their respective categories.

2. **Study one concept at a time** — Read the explanation, find it in the code, then explain it back in your own words without looking. That's the test.

3. **Implement the missing pieces** — If a concept is only partially present (e.g. agent loop exists but has no memory), implement the gap as a learning exercise. Building beats reading every time.

4. **Re-run on new codebases** — Every app surfaces different concepts. Run this spec against loopd, contrl, or any new project to extract what's unique to that domain.
