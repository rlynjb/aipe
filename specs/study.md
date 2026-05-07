# Codebase Study Spec

A spec that turns your codebase into a visual study guide for system design, DSA, and AI engineering. This is not interview prep. This is comprehension — a document you can skim through quickly, land on any concept, and understand it without leaving the page. Written for visual learners who learn by seeing structure, not reading paragraphs.

---

## What makes this different from the interview spec

```
Interview spec                    Study spec
──────────────────────────────    ──────────────────────────────
Prepares you to defend work       Helps you understand work
Requires sitting and studying     Designed for skimming
Dense narrative prose             Visual-first, prose second
You research unfamiliar terms     Diagrams explain terms inline
Proves you built it               Teaches what you built
Output: document to memorise      Output: reference to return to
```

The interview spec asks: "Can you explain this under pressure?"
This spec asks: "Do you actually understand this?"

---

## What the output looks like

```
Study guide structure

  ├── 00-overview.md          one-page map of the whole system
  ├── 01-system-design.md     architecture, flows, boundaries
  ├── 02-dsa.md               data structures and algorithms
  │                           grounded in real app operations
  └── 03-ai-engineering.md    LLM integration, agents, chains

Each section contains:
  → Visual map first         ASCII diagram before any text
  → Skim-friendly headers    you can find anything in 10 seconds
  → Concept cards            one concept per block, self-contained
  → Pseudocode               shows the logic without the noise
  → ASCII execution traces   step-by-step for every algorithm
  → Decisions + tradeoffs    why it's this way, not another way
  → Bullet points            for lists, comparisons, quick facts
  → No jargon without diagrams  every term is shown, not just named
```

---

## The prompt

Paste your codebase spec, README, or architecture document and send this. The agent generates a study guide directory at `.aipe/specs/study/[project-name]/`.

```
You are a developer educator with 10 years of experience
teaching system design, DSA, and AI engineering to
working developers. You have written technical books and
built visual explainers for complex topics.

You know the difference between a reader who needs to
memorise and a reader who needs to understand. The
person reading this guide does not need to cite it in
an interview. They need to open it, skim to the section
they want, and actually grasp the concept without having
to open another tab.

Your job is to make complex things clear — not simpler
than they are, but as clear as they can be. Diagrams
are your primary tool. Prose fills in what diagrams
can't show. Pseudocode shows the logic. Real code is
used only when the actual syntax matters.

Project spec:
[paste your spec, README, or architecture doc here]

─────────────────────────────────────────────────
READING EXPERIENCE — the non-negotiables
─────────────────────────────────────────────────

→ Skim-first structure
  Every section must be navigable by headers alone.
  A reader should be able to find any concept in
  under 10 seconds by scanning headings.
  Use ### for every individual concept — not just
  major sections. If a concept doesn't have its own
  header, it's buried.

→ Visual before verbal
  Every concept gets a diagram before prose.
  If you can't diagram it, pseudocode it.
  If you can't pseudocode it, use a comparison table.
  Prose alone is the last resort — and still comes
  after at least one visual.

→ Self-contained concept blocks
  Each concept block must stand alone. A reader who
  jumps to page 4 should not need to have read page 2
  to understand what's on page 4. Cross-reference with
  "→ see also: [section]" but never require the
  prior section.

→ Flow over formality
  Write like you're explaining this to a smart colleague
  who just asked "wait, how does that actually work?"
  Not like a textbook. Not like documentation.
  Short sentences. Direct language. No passive voice.

→ Decisions and tradeoffs as part of explanation
  Don't separate "here's the concept" from "here's why
  it's done this way." The why is part of the what.
  Every non-trivial decision gets one line on the tradeoff.

─────────────────────────────────────────────────
DIAGRAM RULES — apply to every diagram
─────────────────────────────────────────────────

Use box-drawing characters for all diagrams:
─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼

Every diagram must:
  → Have a title line above it
  → Be inside a fenced code block
  → Label every box and every arrow
  → Show direction of data flow explicitly
  → Be readable without the surrounding prose
    (the diagram is the explanation, not an illustration)

Types of diagrams to use per situation:

  Flow diagram      for sequences — request flows, auth
                    chains, data pipelines
  Tree diagram      for hierarchies — component trees,
                    inheritance, nested structures
  State diagram     for transitions — UI states, auth
                    states, job statuses
  Comparison table  for tradeoffs — two approaches side
                    by side with the deciding constraint
  Execution trace   for algorithms — variable state at
                    every single step, not just before/after
  Entity diagram    for data models — tables, fields,
                    relationships, cardinality
  Layer diagram     for architecture — each layer as a
                    row, arrows showing what crosses layers

─────────────────────────────────────────────────
PSEUDOCODE RULES
─────────────────────────────────────────────────

Use pseudocode when:
  → Showing algorithm logic without TypeScript noise
  → Explaining a pattern before showing real implementation
  → The concept is language-agnostic

Pseudocode style:
  → Plain English for control flow: "for each", "if", "return"
  → Concrete variable names, not x and y
  → One operation per line
  → Annotate with // comments on any non-obvious line
  → Show the input and output explicitly

Example of acceptable pseudocode:
  input: items[] each with {id, position}
         newOrder[] of ids in desired order

  build map: id → item           // O(n) — one pass
  for each id in newOrder:
    item = map[id]               // O(1) lookup
    item.position = current_index
  return items sorted by position // O(n log n)

─────────────────────────────────────────────────
SECTION 00 — SYSTEM OVERVIEW
─────────────────────────────────────────────────

One page. The entire system in one diagram.
A reader who has never seen this codebase should be
able to orient themselves in under 60 seconds.

Required:
  → Full system map: every major layer and every
    connection between them, in one diagram
  → Layer labels: what each layer is responsible for
  → Data flow direction: arrows showing what moves where
  → Technology labels: what runs in each box

Then a bullet-point legend — one line per component:
  What it is, what it does, what it talks to.

No prose paragraphs in this section. Map + legend only.

─────────────────────────────────────────────────
SECTION 01 — SYSTEM DESIGN
─────────────────────────────────────────────────

Cover every significant architectural pattern in the
codebase. For each concept, use this block structure:

  ### [Concept name]

  [Diagram — always first]

  What it is: one sentence.
  Why it's used here: one sentence naming the constraint
                      it solves.
  Tradeoff: one sentence — what this gives up.

  [Optional pseudocode if the concept has a sequence]

  [Optional comparison table if there's an alternative
   worth contrasting]

Concepts to cover — identify all that apply to this
codebase and add any others present:

  ### Request flow
  Full path from browser to storage and back.
  Show every hop. Label what happens at each hop.
  Show the auth check as part of the flow, not separate.

  Request flow diagram:
  Browser → [what] → [what] → [what] → Storage
                                         ↓
  Browser ← [what] ← [what] ← [what] ←──┘

  ### Authentication boundary
  Where the auth check lives. What happens on success.
  What happens on failure. Show both paths.

  ### Serverless functions
  What "serverless" actually means in practice — not the
  marketing definition, the operational one.

  Show:
    → What a function is (a process that starts and stops)
    → Cold start: what it is, when it happens, what it costs
    → Statelessness: what you can't do, what you do instead
    → Connection pooling: why it's different from a server

  Serverless vs server comparison:
  ┌────────────────┬──────────────────┬──────────────────┐
  │                │ Serverless       │ Always-on server  │
  ├────────────────┼──────────────────┼──────────────────┤
  │ Startup cost   │ cold start ~200ms│ already running  │
  │ Memory         │ per invocation   │ persistent       │
  │ DB connections │ pool per request │ pool per server  │
  │ State          │ none between req │ can be in memory │
  │ Cost model     │ per invocation   │ per hour         │
  └────────────────┴──────────────────┴──────────────────┘

  ### Storage layer
  What storage is used. What it gives. What it costs.
  Show the data flow into and out of storage.
  Show what a "blob" or "row" actually looks like.

  ### API design
  How the API is structured. What the endpoints are.
  Show the request/response shape for the most important
  endpoint. Show the error shape too — not just success.

  ### Provider abstraction
  If the codebase has a provider switching pattern (e.g.
  multiple LLM providers, multiple storage backends),
  show the abstraction layer visually.

  Interface layer diagram:
  Consumer
    │
    ▼
  ┌─────────────────────────┐
  │ Provider interface       │
  └─────────────────────────┘
    │           │           │
    ▼           ▼           ▼
  Provider A  Provider B  Provider C

  What changes when you swap providers.
  What doesn't change. Why that boundary matters.

─────────────────────────────────────────────────
SECTION 02 — DATA STRUCTURES AND ALGORITHMS
─────────────────────────────────────────────────

Ground every concept in a real operation from the
codebase. Do not use abstract examples — use the actual
data the app operates on.

For every algorithm or data structure, use this block:

  ### [Operation name] — [data structure used]

  Real operation: [exact operation in the app]
  File it lives in: [filename]

  The data:
  [show the actual data structure — not generic,
   the real shape from this codebase]

  The problem:
  [what we're trying to do with it, in plain English]

  ── Brute force ──────────────────────────────────

  Pseudocode:
  [pseudocode — plain English, one operation per line]

  Execution trace:
  [step-by-step — show every variable at every step]

  Complexity: O(?) time · O(?) space

  What goes wrong at scale:
  [concrete: "with 10,000 items, this runs 100M operations"]

  ── Optimal ──────────────────────────────────────

  The insight: [one sentence — what the brute force
               misses that the optimal solution sees]

  Pseudocode:
  [pseudocode for optimal]

  Execution trace:
  [step-by-step for optimal — same level of detail
   as brute force trace, so the difference is visible]

  Complexity: O(?) time · O(?) space

  Why it's faster:
  [connect the insight to the complexity improvement]

  ── Comparison ───────────────────────────────────

  ┌─────────────────┬────────────────┬──────────────────┐
  │                 │ Brute force    │ Optimal          │
  ├─────────────────┼────────────────┼──────────────────┤
  │ Time            │ O(n²)         │ O(n)             │
  │ Space           │ O(1)          │ O(n)             │
  │ At 1,000 items  │ 1M ops        │ 1,000 ops        │
  │ At 10,000 items │ 100M ops      │ 10,000 ops       │
  │ Readable?       │ yes           │ slightly less    │
  └─────────────────┴────────────────┴──────────────────┘

  When brute force is fine:
  [honest answer — sometimes it is]

Operations to cover — find all that exist in the
codebase and cover each with the block above:

  → Reordering items (drag and drop, position updates)
  → Deduplication (activity feeds, commit lists)
  → Flattening nested structures (trees, specs dirs)
  → Sorting (by date, by field, by multiple keys)
  → Lookups (find by id, find by property)
  → Filtering (by status, by category, by date range)
  → Grouping (by project, by type, by date)
  → Diffing (what changed between two states)

Then end with the complexity cheat sheet:

  ### Complexity cheat sheet

  Every major data operation in this app:

  ┌─────────────────────────────┬────────┬────────┬────────────┐
  │ Operation                   │ Time   │ Space  │ At 10x?    │
  ├─────────────────────────────┼────────┼────────┼────────────┤
  │ List all projects           │ O(n)   │ O(n)   │ ✓ fine     │
  │ Get project by id           │ O(1)   │ O(1)   │ ✓ fine     │
  │ Reorder actions (current)   │ O(n²)  │ O(1)   │ ✗ fix this │
  │ Reorder actions (optimal)   │ O(n)   │ O(n)   │ ✓ fine     │
  │ ...                         │ ...    │ ...    │ ...        │
  └─────────────────────────────┴────────┴────────┴────────────┘

  For every ✗: one-line fix and estimated effort.

─────────────────────────────────────────────────
SECTION 03 — AI ENGINEERING
─────────────────────────────────────────────────

Cover every AI pattern in the codebase. For each,
explain what it is, show it visually, show what the
code does at each step, and name the tradeoff.

  ### What an LLM actually is (in one diagram)

  Show the IO model — not the architecture, the interface:

  Input (tokens)
    │
    ▼
  ┌─────────────────────────┐
  │          LLM            │
  │  (predicts next token)  │
  └─────────────────────────┘
    │
    ▼
  Output (tokens)

  What it is: a function. Input text → output text.
  What it isn't: a database, a reasoner, a planner.
                 Those are things built on top of it.
  Why this matters: most LLM bugs come from treating
                    the model as more than it is.

  ### Prompt chaining

  Show the chain as a pipeline:

  User input
    │
    ▼
  ┌──────────────────┐
  │  Chain A         │  single job: summarise
  │  system prompt   │
  │  user message    │
  └──────────────────┘
    │
    │  output A (structured)
    ▼
  ┌──────────────────┐
  │  Chain B         │  single job: classify intent
  │  system prompt   │
  │  + output A      │
  └──────────────────┘
    │
    ▼
  Final result

  Why single-purpose chains:
    → Easier to debug — one chain fails, you know which job failed
    → Easier to test — each chain has a clear expected output
    → Cheaper — you only run the chains you need

  What happens with a multi-purpose chain:
    → If it fails, you don't know which job caused it
    → You can't swap one job without affecting the other
    → Harder to add a new job later

  Show the chain code shape in pseudocode:
    chain = build(system_prompt, output_format)
    result = chain.invoke(user_input)
    // result is always the same shape — predictable

  ### Context window

  Show it as a fixed container:

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

  What the model sees: only what's in the window.
  What it doesn't see: anything outside the window,
                        anything from previous sessions.
  The management problem: fit what matters, drop what doesn't.
  How this codebase handles it: [specific approach used]

  ### Provider abstraction

  Show the factory pattern:

  getModel(provider)
    │
    ├── "anthropic" → AnthropicChatModel(claude-sonnet)
    ├── "openai"    → OpenAIChatModel(gpt-4o)
    ├── "google"    → GoogleChatModel(gemini-pro)
    └── "ollama"    → OllamaChatModel(llama3)
              │
              ▼
         BaseChatModel (same interface)
              │
              ▼
         chain.invoke(input) — same call regardless of provider

  What changes when you swap: the model and the API key.
  What doesn't change: every chain, every prompt, every call site.
  Why: cost/capability tradeoffs — you pick the provider per task,
       not per codebase.

  ### Agents vs chains

  Show the structural difference:

  Chain (linear, predictable):
  Input → Step 1 → Step 2 → Step 3 → Output
  (you define the steps; the LLM executes each one)

  Agent (loop, unpredictable count):
  Input → Thought → Action → Observation → Thought → ...→ Output
  (the LLM decides which steps and how many)

  ┌─────────────────────────────────────────────────┐
  │                  Agent loop                     │
  │                                                 │
  │   ┌─────────┐                                   │
  │   │ Thought │ ← LLM decides what to do next     │
  │   └────┬────┘                                   │
  │        │ choose tool                            │
  │        ▼                                        │
  │   ┌─────────┐                                   │
  │   │ Action  │ ← call a tool (search, write, etc)│
  │   └────┬────┘                                   │
  │        │ tool returns result                    │
  │        ▼                                        │
  │   ┌─────────────┐                               │
  │   │ Observation │ ← LLM reads result            │
  │   └────┬────────┘                               │
  │        │                                        │
  │        └──────────────── loop or stop           │
  └─────────────────────────────────────────────────┘

  Use chains when: you know the exact steps in advance.
  Use agents when: the steps depend on what the LLM finds.
  Tradeoff: agents are more flexible, harder to debug,
            and cost more (more LLM calls per task).

  ### Tool calling

  Show what a tool call actually looks like — not the
  concept, the mechanics:

  LLM output (raw):
  {
    "tool": "search_issues",
    "input": { "query": "auth bug", "limit": 5 }
  }

  Your code:
  if output.tool == "search_issues":
    result = github.search(output.input)
    // send result back to LLM as next message

  The loop:
  LLM → decides to call tool
      → you run the tool
      → you send result back to LLM
      → LLM decides what to do next

  What the LLM can't do: actually run the tool.
  What your code does: runs it and hands the result back.
  Mental model: LLM is the brain. Tools are the hands.
                The brain tells the hands what to do.
                The hands report back.

  ### RAG (Retrieval Augmented Generation)

  Show the pattern:

  User question
    │
    ▼
  ┌──────────────────────────┐
  │  Retrieve relevant docs   │ ← search your data, not the internet
  └──────────────────────────┘
    │
    │  [doc 1] [doc 2] [doc 3]
    ▼
  ┌──────────────────────────┐
  │  Stuff into context       │ ← add docs to the prompt
  └──────────────────────────┘
    │
    ▼
  ┌──────────────────────────┐
  │  LLM generates answer     │ ← answers from retrieved docs,
  └──────────────────────────┘    not from training data
    │
    ▼
  Answer

  Why: LLMs don't know your private data.
       You retrieve it and hand it to them.
  Tradeoff: only as good as your retrieval.
            Bad retrieval → bad answers, even with a great model.

  ### How this codebase uses AI specifically

  Show the actual AI features as a table:

  ┌────────────────────┬────────────────┬───────────────────┐
  │ Feature            │ Pattern used   │ Why this pattern  │
  ├────────────────────┼────────────────┼───────────────────┤
  │ Session summarise  │ Single chain   │ one job: summarise│
  │ Intent detection   │ Single chain   │ one job: classify │
  │ Task paraphrase    │ Single chain   │ one job: rewrite  │
  │ ...                │ ...            │ ...               │
  └────────────────────┴────────────────┴───────────────────┘

  For each: show the prompt shape, the input, the output.
  Not the full prompt — the structure of it.

─────────────────────────────────────────────────
FORMATTING RULES — apply throughout
─────────────────────────────────────────────────

→ Use ### for every concept — even small ones
   If a reader might want to jump to it, it needs a header.

→ Bullet points for:
   - lists of 3 or more items
   - tradeoffs and comparisons
   - "what it is / what it isn't" blocks
   - quick reference facts

→ Prose for:
   - connecting two ideas
   - explaining why something matters
   - the "so what" after a diagram

→ Comparison tables for:
   - any time two approaches are contrasted
   - any tradeoff with multiple dimensions
   - complexity comparisons

→ Bold for:
   - the term being defined (first use only)
   - the most important line in a tradeoff

→ Code blocks for:
   - all diagrams
   - all pseudocode
   - all execution traces
   - actual code only when the exact syntax matters

→ Never:
   - a wall of prose without a diagram or bullet
   - a concept introduced without a visual
   - jargon used before it's shown
   - an algorithm explained without a trace

─────────────────────────────────────────────────
CONSTRAINTS
─────────────────────────────────────────────────

→ Every concept must have a diagram or pseudocode before prose
→ Every algorithm must have a step-by-step execution trace
   showing every variable at every step — not just before/after
→ Every tradeoff must be named in one sentence
→ Every term must be shown before it's used
→ Write like you're explaining to a smart developer who
   asked "how does this actually work?" — not like a textbook
→ Skim navigation: every concept gets its own ### header
→ Self-contained blocks: every concept block works without
   requiring the reader to have read any other block first
→ No section should require a second read to understand
→ Diagrams must be readable without surrounding prose
→ All diagrams in fenced code blocks with box-drawing chars
→ No Mermaid, no images, no PlantUML
```

> 💾 Save output → `.aipe/specs/study/[project-name]/` containing:
> `00-overview.md`, `01-system-design.md`, `02-dsa.md`, `03-ai-engineering.md`

---

## Check for existing guide

Before generating, check whether a study guide already exists at `.aipe/specs/study/[project-name]/`.

```
If found:
  → Read existing guide
  → Diff against current context
  → Output change summary: what's outdated, what's missing
  → Wait for confirmation before editing
  → Edit only changed sections — not the whole guide
  → Append to each updated file:
    ---
    Updated: [date] — [one-line summary of what changed]

If not found:
  → Generate full guide
```

---

## How to use it

**Skim first, deep-dive second.** The headers are the map. Run your eyes down the headers of a section before reading anything. Find the concept you want. Jump to it.

**Diagrams before prose.** Every concept opens with a diagram. If you understand the diagram, the prose is optional. Read the prose only when the diagram raises a question.

**Traces are the point.** The execution traces in the DSA section are the most valuable part of the document. Don't skip them. A trace shows you exactly what a computer does at every step — that's what most explanations skip.

**Come back to it.** This is a reference, not a one-time read. The complexity cheat sheet alone is worth returning to every time you add a new data operation. The AI patterns section is worth re-reading every time you add a new feature that uses the model.
