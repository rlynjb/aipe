─────────────────────────────────────────────────
me.md — reader profile and prompt calibration
─────────────────────────────────────────────────

Reference document for specs that need to calibrate to
Rein: voice, examples, format, prompt shape, and what to
avoid.

This file does not generate artifacts. It is a contract
that other specs consult when they need to answer:

- What examples will Rein recognize?
- What does she already know?
- What gaps should not be overclaimed?
- What voice and format should the output use?
- How should prompts be shaped for reliable agent work?

═════════════════════════════════════════════════
WHO YOU ARE
═════════════════════════════════════════════════

Rein is a Software Engineer 3 based in Seattle, with
7+ years of professional frontend experience in Vue
and React for customers including FedEx, Amazon, and
CoreWeave. She is credited with about $700K in client
cost savings.

She is pivoting deliberately into AI engineering without
abandoning frontend. The frontend experience is the
load-bearing layer; AI engineering is the additive layer.

```
past 7+ years            now                    next
─────────────────        ─────────────          ─────────────────
frontend engineer        pivot point            AI engineer /
Vue + React              frontend + AI          AI product engineer
enterprise clients       IK + projects          AI-native apps
$700K cost savings
```

Roles that fit this arc:

- Senior frontend engineer
- Senior AI engineer
- Product engineer combining frontend, systems, and AI

The portfolio case is: frontend instincts + systems
thinking + AI-first product sense.

═════════════════════════════════════════════════
HOW YOU THINK
═════════════════════════════════════════════════

```
idea
  |
  v
visual shape
  |
  v
mechanism
  |
  v
hands-on build
  |
  v
transferable understanding
```

Core calibration:

- You think visually first. Diagrams are not
  decoration; they are the primary medium.
- You get the shape quickly. Skip long on-ramps and
  spend the time on mechanism.
- You value language-agnostic patterns. The concept
  matters more than the framework or vendor.
- You trust fundamentals after building with them.
  The durable teaching path is:

```text
concept -> mechanism -> code in your own repo
```

Do not over-explain the "what." Spend effort on the
"how," "why," tradeoffs, and concrete code path.

═════════════════════════════════════════════════
PROMPT PRINCIPLES FOR AGENT WORK
═════════════════════════════════════════════════

When a spec creates prompts for agents, follow the
practical agent-design principles from *AI Agents in
Action*: prompts are not essays; they are operating
contracts.

Write prompts as an API contract:

- State the agent role clearly.
- State the task boundary.
- State what context to inspect.
- State what output shape is required.
- State what evidence must support claims.
- State what the agent must not do.
- Include an "unknown / not enough evidence" off-ramp.

Front-load the controlling instructions:

- Put role, objective, constraints, and output format
  before supporting explanation.
- Use delimiters for source text, examples, and user
  inputs.
- Remove ambiguity and contradictions.
- Prefer positive instructions:
  "cite file paths for claims" instead of only
  "do not hallucinate."

Keep scope narrow:

- One prompt should do one job.
- Split exploration, diagnosis, implementation, and
  review when they require different behavior.
- Do not pack tool instructions, persona, rubric,
  examples, and unrelated policy into one large block
  unless the agent truly needs all of it.

Prefer structured outputs:

- Use headings, tables, checklists, or JSON-like shapes
  when downstream consumers depend on structure.
- For multi-agent or tool pipelines, prefer typed or
  schema-shaped outputs over free prose.
- Make severity, confidence, evidence, and next action
  explicit when the result guides work.

Use examples deliberately:

- Include few-shot examples when format or judgment is
  non-obvious.
- Keep examples short and representative.
- Use Rein's actual portfolio when it clarifies a
  concept.
- Do not let examples become the prompt.

Design for evaluation and feedback:

- Tell the agent what would count as a good answer.
- Require evidence-vs-inference separation.
- Require verification steps for codebase claims.
- Ask for open questions when evidence is missing.
- For benchmarkable prompts, include pass/fail rubrics.

Keep tool guidance out of prompts when a tool schema can
carry it:

- Good tool names and docstrings beat long prompt
  patches.
- Use prompts for role, boundaries, reasoning discipline,
  and output contract.
- Use tool schemas for parameters, capabilities, and
  operational details.

Avoid prompt smells:

- Vague persona with no task boundary
- Contradictory instructions
- Variable output shape
- Over-complex prompts that hide the real task
- Vendor-first framing where a pattern-level prompt would
  transfer better
- Claims without evidence requirements
- No failure path or "I don't know" path

═════════════════════════════════════════════════
WHAT YOU'VE BUILT — DSA PORTFOLIO
═════════════════════════════════════════════════

Use these as concrete examples when teaching DSA,
runtime behavior, state, traversal, or algorithmic
tradeoffs.

```
implementation                repo anchor
──────────────────────────    ─────────────────────────────
Graph adjacency list          Graph.ts
  BFS / DFS                   bfs_traversal, dfs_traversal
  Euler path/cycle            graph traversal fundamentals
  valid tree                  isGraphValidTree
  connected components        numberOfConnectedComponents

Graph2 node+edge graph        Graph2.ts
  weighted edges              supports Dijkstra
  directed/undirected         grid obstacle marking

Binary Search Tree            BinarySearchTree.ts
  insert/search/delete        recursive + iterative
  traversals                  in/pre/post order
  successor/predecessor       ordered tree mechanics

Binary Heap                   BinaryHeap.ts
  MinHeap / MaxHeap           heapifyUp / heapifyDown
  from scratch                insert / getMin / getMax

Priority Queue                PriorityQueue.ts
  heap-backed                 enqueue / dequeue
  updatePriority              value-to-index lookup
  Dijkstra use                shortest-path visualizer

Tree                          Tree.ts
  n-ary tree                  pre/post traversal
  generators                  recursion visualizers

Sorting                       utils/notes/Sorting/
  selection/bubble/insertion  animated React visualizers
  merge/quick/heap            bar swaps and comparisons

State-space search            PG.ts
  river-crossing puzzle       BFS over implicit state graph
```

Strong anchors:

- Graphs: BFS, DFS, connected components, shortest path
- Heaps and priority queues
- BST operations and traversals
- Recursion and call-stack visualization
- Sorting fundamentals
- Implementing primitives from scratch

Do not overclaim depth in:

- Tries
- Union-find
- Segment trees
- Suffix arrays
- Advanced dynamic programming beyond classic recursion
  with memoization

IK curriculum vocabulary is fair game: adjacency list,
captured set, fringe edge, traversal, heap, recursion,
and related DSA terms.

═════════════════════════════════════════════════
WHAT YOU'VE BUILT — SYSTEM DESIGN PORTFOLIO
═════════════════════════════════════════════════

Use these projects as worked examples when teaching
system design, AI engineering, mobile architecture,
local-first systems, or data flow.

```
project       system shape
──────────    ─────────────────────────────────────────────
dryrun        native Android, Kotlin
              local-first mobile + cloud sync
              on-device AI with Gemini Nano
              API fallback
              GitHub-as-backend
              spaced-repetition scheduling

buffr         React Native + Expo + SQLite + Supabase
              canonical local store with opt-in mirror
              ffmpeg media pipeline
              AI-assisted compose workflow

contrl        React Native + MediaPipe + Vision Camera
              real-time on-device ML
              pose-landmark to rep counter
              no network in the hot path
              frame-rate latency budget

aipe          markdown-as-source-of-truth meta-tooling
              prompt templates as code
              slash commands as interface
              describe -> diagnose -> act layering

AdvntrCue     Next.js + pgvector + Postgres + GPT-4
              classic RAG
              vector + relational data colocated
              serverless API
              streaming response
              tool-calling + session memory
```

The five shapes cover:

- Local-first vs cloud-first
- Native mobile vs React Native vs web
- On-device AI vs cloud AI
- SQLite, Supabase, GitHub-as-store, Postgres/pgvector,
  and filesystem-backed source of truth
- Hot-path latency constraints
- RAG and tool-calling product behavior

Do not overclaim depth in:

- Multi-region distributed systems
- Kafka / Redis Streams / sustained queue infrastructure
- Load balancing under sustained production traffic
- Horizontal scale beyond portfolio-level usage

When explaining those gaps, teach them directly and
honestly instead of pretending they are already present
in the portfolio.

═════════════════════════════════════════════════
HOW TO WRITE FOR YOU
═════════════════════════════════════════════════

What works:

- Diagram first, then prose.
- Pattern first, vendor second.
- Concept -> mechanism -> code in your repo.
- Concrete file paths and symbols.
- Direct, opinionated language.
- Frontend primitives as universal anchors:
  list rendering, keys, forms, fetch/loading/error
  states, DB rows, columns, primary keys.
- Evidence-vs-inference separation.
- Short examples that prove the format or judgment.

What does not work:

- Long abstract definitions before the concrete.
- Analogy as the load-bearing explanation.
- Whole-product anchors when a primitive works.
- Marketing language:
  "scalable solution," "robust architecture,"
  "cutting-edge," "industry-leading,"
  "leveraging best practices."
- Vendor-first framing:
  "Pinecone does this," "Next.js does this."
- Slow conceptual on-ramps.
- Flattery or inflated claims about what the portfolio
  proves.

Preferred explanation shape:

```text
1. Diagram or concrete scenario
2. Pattern name
3. Mechanism walkthrough
4. Repo anchor
5. Tradeoff
6. What breaks or changes at scale
7. Self-test question or small exercise
```

═════════════════════════════════════════════════
AUDIT-STYLE GENERATORS
═════════════════════════════════════════════════

This section applies to audit-style generators:

- study-system-design
- study-software-design
- study-security
- study-testing
- study-debugging-observability
- study-performance-engineering

Curriculum-style generators teach broadly applicable
concepts and do not use this artifact shape.

Audit-style output has two passes:

```text
Pass 1: audit.md
  fixed file
  one section per topic lens
  evidence-grounded
  says "not yet exercised" honestly

Pass 2: discovered pattern files
  variable file list
  one file per significant repo-specific pattern
  named after the pattern, not the audit lens
  uses the full format.md concept-file template
```

What earns a pattern file:

- It has a clear 1-3 word kebab-case name.
- It is load-bearing: removing it would remove a real
  capability, not merely make code less tidy.
- A senior engineer can recognize the file name as a
  real architectural pattern.
- The pattern can support an interview-defense block
  with confidence.

What stays in `audit.md`:

- Generic API/storage/UI layer observations
- Findings with no named pattern behind them
- One-off implementation details
- Foundation topics that belong in curriculum-style
  generators

Typical output size:

- 3-8 discovered pattern files for a normal repo
- Fewer than 3 usually means discovery was too timid
- More than 8 usually means the bar was too low

File layout:

```text
.aipe/study-<topic>/
  README.md
  00-overview.md
  audit.md
  01-<discovered-pattern>.md
  02-<discovered-pattern>.md
  03-<discovered-pattern>.md
```

All files stay flat at the topic root. No nested
subdirectories.

On update:

- Add a pattern file when the repo grows a new
  load-bearing pattern.
- Update a pattern file when the implementation changes.
- Remove a pattern file only when the pattern is gone.
- Regenerate `audit.md` against current evidence.

If an older audit-style spec contradicts this two-pass
shape, this file wins.

═════════════════════════════════════════════════
HOW OTHER SPECS USE THIS FILE
═════════════════════════════════════════════════

Use this file as calibration, not source content to copy.

Reference:

- `WHO YOU ARE` for role/career framing.
- `HOW YOU THINK` for learning sequence.
- `PROMPT PRINCIPLES FOR AGENT WORK` when creating
  prompts, agents, or instruction artifacts.
- `WHAT YOU'VE BUILT` for real examples.
- `HOW TO WRITE FOR YOU` for voice and format.
- `AUDIT-STYLE GENERATORS` for audit output shape.

This file pairs with `teacher.md`:

- `teacher.md` defines the writer persona.
- `me.md` defines the reader and prompt-calibration
  contract.

═════════════════════════════════════════════════
WHAT THIS FILE DOES NOT DO
═════════════════════════════════════════════════

- It does not generate artifacts.
- It does not override topic-specific spec rules, except
  for the audit-style two-pass shape above.
- It does not replace `format.md` or `teacher.md`.
- It does not lock the reader profile forever.
- It does not flatter or overclaim.

The useful version of this file is current, specific,
and honest: strengths named, gaps named, examples real,
and prompts shaped as contracts agents can follow.
