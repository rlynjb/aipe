─────────────────────────────────────────────────
STUDY — AGENT ARCHITECTURE SPEC
─────────────────────────────────────────────────

A topic-focused study guide spec for agent
architecture and orchestration. Inherits all
structural rules from `study.md` — the per-concept-
file template, the formatting rules, the diagram
requirements, the hard rules, the constraint
summary. What this spec defines is what's *unique*
to agent architecture as a topic of study:

  → The set of agent reasoning patterns, retrieval-
    as-a-capability patterns, multi-agent
    orchestration topologies, and cross-cutting
    agent infrastructure to cover
  → A three-shapes framing for recognizing which
    *kind* of agent work the codebase exercises
    (workflow/chain, single-agent, or multi-agent),
    used to weight coverage
  → The output folder convention
  → Agent-architecture-specific constraints

This spec exists because `study-ai-engineering.md`
covers the *single-agent* surface well (agents vs
chains, tool calling, ReAct, tool routing, agent
memory, error recovery) and covers retrieval
mechanics (embeddings, chunking, vector DBs, RAG,
GraphRAG) deeply — but it stops at the single
agent. The genuinely separate body of knowledge is
everything *above* one agent: the reasoning
patterns beyond ReAct, the retrieval loop that
turns RAG agentic, and the orchestration topologies
that coordinate many agents. That's what this spec
owns. Where a concept is already covered in
`study-ai-engineering.md`, this spec cross-
references rather than duplicates.

This spec is run alongside `study.md`, not instead
of it. The agent reads both: `study.md` for *how*
to write each concept file (block structure,
diagrams, validate levels, etc.), and this spec for
*what* to write about.

**Scope: per-codebase, per-repo.** This spec runs
against one codebase at a time, exactly like the
base study generator. When the command is run
inside a repo, the agent analyzes that repo's code
and produces an agent architecture guide for *that
codebase*. The spec does not span multiple
codebases or read content from anywhere outside the
current repo. If you want agent architecture guides
for three different projects, you run the command
three times — once in each repo's working
directory.

**This spec is codebase-agnostic by construction.**
It names no specific project. Every example in the
body below is a *generic shape label* (workflow /
single-agent / multi-agent), never a named repo.
The codebase being studied is always — and only —
the repo where the command was run.

═════════════════════════════════════════════════
THE PERSONA — references `teacher.md`
═════════════════════════════════════════════════

The persona is defined in `teacher.md` — the staff
engineer with 12 years of industry experience, 8 at
Google and Meta on distributed systems at scale, 4
as EM/principal at Series B. Read that file for the
full persona, voice rules, format hierarchy, and
what's banned. Do not restate.

This spec uses the **teacher posture** from
`teacher.md` (the default). No shift. Agent
orchestration is systems-shaped work — control
loops, message passing between agents, shared
state, coordination failure modes, cost and latency
budgets across a topology. The staff-engineer voice
that explains distributed systems is the right one
for explaining a supervisor-worker topology or a
graph orchestration state machine.

One calibration note inside that posture: a large
share of agent-architecture wisdom is *production
scar tissue* — the "don't reach for multi-agent
before single-agent hits its quality ceiling" rule
comes from people who shipped multi-agent systems
and paid the 2-5x coordination tax. The teacher
voice carries that judgment as architectural
opinion ("here is when this topology earns its
overhead, and here is when it doesn't"), not as a
separate persona. Where this spec names a
production reality, it names it as a decision with a
breakpoint, the same way `study.md`'s Tradeoffs
block does.

═════════════════════════════════════════════════
THE READER — calibrate to `me.md`
═════════════════════════════════════════════════

`teacher.md` defines who is *writing* the guide.
`me.md` defines who is *reading* it. Read `me.md`
before generating, and treat its contents as the
source of truth for reader-side calibration:

  → **Voice and format register.** `me.md`'s "HOW
     TO WRITE FOR YOU" section names the rules that
     apply on top of `teacher.md`'s voice rules:
     diagram-first, pattern as the primary anchor
     (not vendor-specific), concept → mechanism →
     code in the reader's own repo.

  → **What examples land.** When this spec calls
     for an anchor example or a worked walkthrough,
     reach for the reader's frontend primitives and
     the system shapes named in `me.md` (local-first
     vs cloud-first, on-device vs cloud AI, storage
     layering). Agent topologies map cleanly onto
     things the reader already builds: a
     supervisor-worker split is a manager component
     delegating to child components; a pipeline is a
     `.then()` chain of single-purpose functions; a
     fan-out/fan-in is `Promise.all()` over
     independent requests, then a merge.

  → **The shape-matching logic.** This spec
     identifies which of three agent shapes the
     codebase being studied most resembles
     (workflow/chain, single-agent, multi-agent).
     `me.md`'s portfolio describes the system shapes
     the reader has already built; when the target
     codebase matches one, the agent has pre-existing
     context to anchor against — but the anchor stays
     generic in the spec body, named only when the
     studied repo actually exercises it.

  → **What the reader already knows.** `me.md` names
     strong frontend instincts and AI-application
     experience, with multi-agent orchestration as
     newer ground. Single-agent concepts (ReAct,
     tool calling) can move faster — they're covered
     in `study-ai-engineering.md` and this spec
     cross-references rather than re-teaching.
     Multi-agent orchestration (SECTION C) is the
     load-bearing new material; teach it as new
     ground, not as a refresher.

  → **The cognitive shape.** Visual-first thinking.
     Ideas arrive as pictures; details and logic
     take longer. Orchestration topologies are
     inherently diagrammatic — every topology in
     SECTION C is a shape before it is a mechanism.
     Lead with the shape.

**Precedence when three files overlap:**

  1. This spec wins on **structure** (block
     templates, three-shapes framing, the
     orchestration-template sub-section, constraint
     summaries).
  2. `teacher.md` wins on **voice register** (tone,
     posture, what's banned).
  3. `me.md` wins on **calibration** (which examples
     land, what's already known, depth modulation).

These three layers compose. The spec defines what
gets generated; `teacher.md` defines how the writer
speaks; `me.md` defines how it lands for this
specific reader. None of the three names a specific
project as an anchor in this spec — the studied repo
is the only project that appears in the generated
output.

═════════════════════════════════════════════════
OUTPUT FOLDER NAME
═════════════════════════════════════════════════

Following the `.aipe/` convention used in
`study.md`, agent architecture guides save to:

  .aipe/study-agent-architecture/

`.aipe/` is a per-repo directory — it lives at the
root of whichever repo the command was run in. Each
repo gets its own `.aipe/study-agent-architecture/`.

The folder name is fixed across repos, because it
names the *topic*, not the codebase. The same
convention applies to the other topic specs
(`study-system-design-dsa/`,
`study-ai-engineering/`, `study-prompt-engineering/`,
`study-interview-defense/`).

The directory structure inherits from `study.md`'s
rules. The top-level layout, generated per codebase:

```
.aipe/study-agent-architecture/
  00-overview.md
  README.md                       ← index + reading order
  01-reasoning-patterns/
    README.md
    01-chains-vs-agents.md
    02-react.md
    03-plan-and-execute.md
    04-reflexion-self-critique.md
    05-tree-of-thoughts.md
    06-routing.md
  02-agentic-retrieval/
    README.md
    01-agentic-rag.md
    02-self-corrective-rag.md
    03-retrieval-routing.md
  03-multi-agent-orchestration/
    README.md
    01-when-not-to-go-multi-agent.md
    02-supervisor-worker.md
    03-sequential-pipeline.md
    04-parallel-fan-out.md
    05-debate-verifier-critic.md
    06-swarm-handoff.md
    07-graph-orchestration.md
    08-shared-state-and-message-passing.md
    09-coordination-failure-modes.md
  04-agent-infrastructure/
    README.md
    01-context-engineering.md
    02-agent-memory-tiers.md
    03-tool-calling-and-mcp.md
    04-agent-evaluation.md
    05-guardrails-and-control.md
  05-production-serving/
    README.md
    01-cross-turn-caching.md
    02-fan-out-backpressure.md
    03-per-tool-circuit-breaking.md
  06-orchestration-system-design-templates/
    README.md
    01-multi-agent-research-assistant.md
    02-agentic-support-system.md
    03-agentic-coding-system.md
  agent-patterns-in-this-codebase.md  ← patterns this repo actually uses
```

The `agent-patterns-in-this-codebase.md` file at
the root describes how *this codebase* uses agent
patterns — what loops exist, what topology (if any)
is used, what each agent or chain does and which
pattern it instantiates. It is per-codebase,
generated from the code in the repo the command was
run in. If the codebase has no agent features (it's
a chain/workflow shape, or has no LLM features at
all), the file is still generated but says so
honestly ("This codebase does not currently use any
autonomous agent loop. The patterns below are
covered as study material; the system design
templates in sub-section 05 identify the topologies
this codebase could adopt and the refactor each
would require.").

Naming follows the kebab-case rule from `study.md`.
Each sub-section directory has its own README.md
that indexes the files in that directory and notes
the reading order (within a sub-section most files
are self-contained; across sub-sections, the
recommended order is A → B → C → D → E → F).

═════════════════════════════════════════════════
RELATIONSHIP TO STUDY.MD AND STUDY-AI-ENGINEERING.MD
═════════════════════════════════════════════════

This spec drives a **separate workflow** from every
other generator in the family. Running the base
generator (`study.md`) produces
`.aipe/study-system-design-dsa/`. Running
`study-ai-engineering.md` produces
`.aipe/study-ai-engineering/`. Running this spec
produces `.aipe/study-agent-architecture/`. The
workflows share `study.md` as their structural
foundation but are triggered independently and
produce independent outputs.

**The boundary with `study-ai-engineering.md`.** The
two specs are siblings with a clean seam:

```
  study-ai-engineering.md          study-agent-architecture.md
  ───────────────────────          ────────────────────────────
  what ONE model/agent does        what happens ABOVE one agent
  LLM foundations                   reasoning patterns (CoT →
  (tokens, sampling, structured       ReAct → plan-execute →
   outputs, streaming, cost)          reflexion → ToT)
  retrieval mechanics               retrieval as a control loop
  (embeddings, chunking,              (agentic RAG, self-RAG,
   vector DBs, RAG, GraphRAG)         retrieval routing)
  single agent + tools              MANY agents coordinating
  (agents-vs-chains, tool             (supervisor-worker,
   calling, ReAct, tool routing,      pipeline, parallel, debate,
   agent memory, error recovery)      swarm, graph, shared state)
  LLM evals (output quality)        agent evals (trajectory,
                                      tool-call accuracy, topology)
  production serving for one        production serving for a loop
  call (caching, cost, rate          / topology (cross-turn cache,
   limit, retry/breaker)             fan-out backpressure, per-tool
                                      circuit breaking)
```

When the two overlap (ReAct appears in both; agent
memory appears in both; RAG mechanics underpin
agentic RAG), this spec **cross-references** the
`study-ai-engineering.md` concept file rather than
re-teaching it. The cross-reference goes in the
`See also` block: "→ ReAct mechanics:
`.aipe/study-ai-engineering/04-agents-and-tool-use/03-react-pattern.md`".
This spec's ReAct file (`01-reasoning-patterns/02-react.md`)
exists to place ReAct *in the family of reasoning
patterns* (where it sits relative to plan-execute
and reflexion, when to escalate past it) — not to
re-explain the Thought-Action-Observation loop the
AI-engineering file already walks.

This spec is *additive* to `study.md`. The agent run
for agent architecture study works like this:

  1. Agent reads `study.md` to learn the per-
     concept-file template, formatting rules,
     diagram requirements, hard rules, and
     constraint summary.

  2. Agent reads `teacher.md` to learn the writer
     persona (teacher posture).

  3. Agent reads `me.md` to learn reader-side
     calibration: voice register, example
     preferences, the reader's portfolios (for
     anchoring, kept generic in the spec body), and
     the cognitive shape (visual-first,
     ideas-before-details).

  4. Agent reads this spec to learn the agent-
     architecture concept list, the three-shapes
     framing, and the agent-architecture-specific
     constraints.

  5. Agent reads the codebase context of the repo
     where the command was run. This spec runs
     against one codebase at a time — the same
     per-repo scope as the base study generator.

  6. Agent generates `.aipe/study-agent-architecture/`
     (inside that repo's `.aipe/` directory) with
     sub-directories per sub-section, each containing
     per-concept files following `study.md`'s per-
     concept template, written in the teacher voice
     from `teacher.md`, and calibrated to the reader
     as defined in `me.md`. Concept files for
     patterns the repo does not exercise are still
     generated when the pattern belongs to the
     shape the repo matches (see CONSTRAINTS), with
     `In this codebase` honestly marked "Not yet
     implemented" and the system design templates
     naming the refactor that would adopt it.

═════════════════════════════════════════════════
WHAT THIS SPEC DOES NOT REDEFINE
═════════════════════════════════════════════════

Inherited from `study.md` without restatement.
Refer to `study.md` for the canonical definition:

  → The per-concept-file template (Subtitle, Why
    care, How it works, primary diagram, In this
    codebase, Elaborate, Tradeoffs, Tech reference,
    Summary, Interview defense, Validate, See also)
  → Why care's five moves (scenario → name the
    question → why it matters → before/after →
    one-line summary)
  → How it works's three moves (mental model →
    layered walkthrough → principle) plus the ASCII
    diagram requirements per move
  → All formatting rules (no markdown tables for
    Tech reference, kebab-case file names, no
    Mermaid / no images, box-drawing diagram chars)
  → The "Use real software, not analogies" rule (and
    its priority order: frontend primitives first,
    whole products last)
  → The Validate block's levels (reconstruct,
    explain, apply, defend, quick check)
  → The general constraint summary at the bottom of
    `study.md`
  → The "Check for existing guide" diff-and-update
    behavior

Inherited from `teacher.md` without restatement:

  → The writer persona (staff engineer, 12 years,
    FAANG → Series B)
  → The teaching philosophy (comprehension over
    performance)
  → The format hierarchy (diagrams primary, prose
    fills in, pseudocode for logic, real code only
    when syntax matters)
  → Voice rules: direct, opinionated, specific,
    occasionally blunt, always constructive
  → What's banned: hedging, marketing language,
    apologetic tradeoff naming, slow on-ramps,
    physical-world analogies as primary anchor

Inherited from `me.md` without restatement:

  → Reader voice and format calibration (the "HOW TO
    WRITE FOR YOU" section)
  → Reader cognitive shape (visual-first,
    ideas-then-details, language-agnostic,
    fundamentals + hands-on)
  → Honest gap inventory — multi-agent orchestration
    is newer ground; teach it as new ground rather
    than assuming familiarity

If a future change to `study.md`, `teacher.md`, or
`me.md` updates one of these, this spec
automatically inherits it. No duplication, no
drift.

─────────────────────────────────────────────────
THE BODY — AGENT ARCHITECTURE
─────────────────────────────────────────────────

Cover every agent pattern in the codebase, plus the
in-scope patterns for the shape the codebase
matches (see CONSTRAINTS). The patterns below are
organized into five sub-sections — reasoning
patterns, agentic retrieval, multi-agent
orchestration, agent infrastructure, and
orchestration system design templates. For each
pattern: explain what it is, show it visually, show
what the code does at each step (or would do, for
not-yet-implemented patterns), and name the
tradeoff.

Agent architecture work comes in three recognizable
shapes. The table below names them with a *generic*
description of each — no project names. When
generating a guide, the agent first identifies which
shape the codebase being studied most resembles —
that determines how the rest of this spec is
weighted.

  ┌──────────────────┬──────────────────────────────────┐
  │ Shape            │ What the codebase exercises      │
  ├──────────────────┼──────────────────────────────────┤
  │ Workflow / chain │ Predetermined steps. The control │
  │                  │ flow is written by the engineer; │
  │                  │ the LLM fills in slots but does  │
  │                  │ not choose the next step. No      │
  │                  │ autonomous loop.                 │
  ├──────────────────┼──────────────────────────────────┤
  │ Single-agent     │ One reasoning loop with tools.   │
  │                  │ The model decides which tool to   │
  │                  │ call and when to stop (ReAct-     │
  │                  │ style). One actor.               │
  ├──────────────────┼──────────────────────────────────┤
  │ Multi-agent      │ Multiple coordinating agents in  │
  │                  │ a topology. Work is split across │
  │                  │ specialized agents; state is      │
  │                  │ shared or passed; a coordination │
  │                  │ structure decides who runs when. │
  └──────────────────┴──────────────────────────────────┘

  Each sub-section in this spec declares which shape
  it primarily belongs to via its `Anchor:` line.
  The anchor names a *shape category*, not a project.

  When the codebase being studied matches a shape,
  the agent weights coverage toward sub-sections with
  that anchor. Patterns from other shapes still appear
  if the codebase exercises them — coverage is
  weighted, not exclusive. A workflow/chain codebase
  gets full coverage of SECTION A's chains-vs-agents
  boundary and SECTION C's "when not to go
  multi-agent," with the rest framed as "what you'd
  reach for if the control flow needed to become
  autonomous." A multi-agent codebase gets full
  SECTION C coverage.

  ┌─────────────────────────────────────────────────┐
  │ HOW TO READ THE SHAPE LABELS IN THIS SPEC —      │
  │ READ THIS BEFORE GENERATING ANYTHING            │
  ├─────────────────────────────────────────────────┤
  │ Throughout this spec, the body uses generic      │
  │ shape labels (workflow, single-agent,            │
  │ multi-agent) and generic worked examples (a      │
  │ "research assistant," a "support system," a      │
  │ "coding agent"). These are INSTRUCTIONAL          │
  │ EXAMPLES showing the SHAPE of a good answer.     │
  │ They are NOT the answer, and they are NOT the    │
  │ codebase you are studying.                       │
  │                                                   │
  │ When generating the guide:                       │
  │  • The codebase being studied is the repo where  │
  │    the command was run — and ONLY that repo.     │
  │  • Every "In this codebase" block is answered    │
  │    about THAT repo's actual code, by reading     │
  │    THAT repo's files.                            │
  │  • Every file path is a real path in THAT repo   │
  │    (or an expected path in THAT repo for a       │
  │    not-yet-implemented pattern).                 │
  │  • Do not invent a project name. Do not anchor   │
  │    to any repo other than the one being studied. │
  │  • The generic worked examples in this spec      │
  │    (research assistant, support system, coding   │
  │    agent) are templates for the system design    │
  │    sub-section ONLY. Their "Applies to this      │
  │    codebase" bullets are STILL answered about    │
  │    the studied repo.                             │
  └─────────────────────────────────────────────────┘

═════════════════════════════════════════════════
SECTION A — REASONING PATTERNS
  Anchor: single-agent (primary) · workflow (secondary)
═════════════════════════════════════════════════

How one model thinks through a task. This is the
substrate the orchestration topologies sit on top
of — a supervisor-worker system is supervisor and
workers each running one of these patterns. Cover
the family, and the escalation ladder between them.

  ### Chains vs agents (the boundary)

  The first distinction. Show the structural
  difference between a written control flow and an
  autonomous loop:

  Chain (engineer writes the steps):
    Input → Step 1 → Step 2 → Step 3 → Output
            (LLM fills each slot; it does not
             choose what comes next)

  Agent (model writes the steps at runtime):
  ┌───────────────────────────────────────────────┐
  │              Agent control loop               │
  │   ┌─────────┐                                 │
  │   │ Reason  │ ← model decides next action     │
  │   └────┬────┘                                 │
  │        ▼                                      │
  │   ┌─────────┐                                 │
  │   │ Act     │ ← call a tool                   │
  │   └────┬────┘                                 │
  │        ▼                                      │
  │   ┌─────────────┐                             │
  │   │ Observe     │ ← read result               │
  │   └────┬────────┘                             │
  │        └──────────── loop or stop             │
  └───────────────────────────────────────────────┘

  The decision rule: use a chain when you know the
  steps in advance. Use an agent when the steps
  depend on what the model finds. The cost of an
  agent is unpredictability — variable step count,
  variable cost, harder debugging.

  Cross-reference: `study-ai-engineering.md`'s
  `04-agents-and-tool-use/01-agents-vs-chains.md`
  walks the mechanics. This file places the boundary
  as the *entry point to the reasoning-pattern
  family* — every pattern below is a way of
  structuring what happens inside the loop.

  ### ReAct

  The default single-agent pattern: interleave
  reasoning and action. Covered mechanically in
  `study-ai-engineering.md`. This file's job is
  placement — ReAct is the baseline, and the
  strong prior is to *start here* before any fancier
  pattern. Show the escalation framing:

  Default to ReAct.
    │
    ├─ measure: success rate, tool-call accuracy,
    │           latency, cost
    │
    └─ only escalate when a specific failure mode
       is identified that ReAct can't address

  The interview-grade point: most teams jump past
  ReAct prematurely. Naming "I built a ReAct
  baseline, measured it, and escalated only when
  [specific failure]" is a stronger signal than
  reaching for multi-agent first.

  ### Plan-and-execute

  Separate planning from doing. Show the split:

  ┌─ Plan phase ──────────────────────────────────┐
  │  Expensive model builds the full plan up front│
  │  (list of steps, dependencies)                │
  └──────────────────┬────────────────────────────┘
                     │  plan: [step1, step2, step3]
                     ▼
  ┌─ Execute phase ───────────────────────────────┐
  │  Cheap/fast model runs each step               │
  │  (no re-planning per step)                      │
  └───────────────────────────────────────────────┘

  Why this beats sequential ReAct on structured
  tasks: you decouple the strategy (one expensive
  call) from the grunt work (many cheap calls), and
  you avoid re-deciding the whole approach on every
  loop. The tradeoff: it's brittle when the plan
  assumptions break mid-execution — a step fails and
  the plan has no branch for it. Mitigation: a
  re-plan trigger when execution diverges from the
  plan.

  When to pick which: ReAct for dynamic/exploratory
  tasks where the path can't be predicted;
  plan-and-execute for structured tasks where it can.

  ### Reflexion / self-critique loop

  The agent evaluates its own output and retries.
  Show the loop sitting on top of a base pattern:

  ┌──────────────────────────────────────────────┐
  │  base pattern (ReAct) produces a draft answer │
  └────────────────────┬─────────────────────────┘
                       ▼
  ┌──────────────────────────────────────────────┐
  │  Critic step: "is this correct / complete?"   │
  └────────────────────┬─────────────────────────┘
              ┌─────────┴─────────┐
              ▼ good              ▼ flawed
          return            revise + loop
                            (cap the retries)

  The hard limit that matters: a model critiquing
  its own output shares the blind spots that
  produced the output. Self-critique catches format
  and obvious-error failures well; it catches
  subtle-reasoning failures poorly. The cost is 2-5x
  tokens for one extra reliability step.
  Cross-reference: `study-prompt-engineering.md`'s
  self-critique concept covers the prompt-level
  mechanics; this file covers it as a *loop
  structure* layered on a reasoning pattern.

  ### Tree of Thoughts

  Explore multiple reasoning branches, score them,
  pick the best. Show the branching:

           root question
          ┌──────┼──────┐
          ▼      ▼      ▼
        path A  path B  path C
          │      │      │
        score  score  score
          └──────┼──────┘
                 ▼
            best path wins

  Be blunt: this is rarely worth it in production.
  The branching multiplies token cost by the branch
  factor and rarely beats a well-prompted ReAct loop
  on real tasks. Cover it so the reader recognizes
  it and can say why they *didn't* use it — that's
  the more common interview answer.

  ### Routing

  Pick the right handler before committing to a loop.
  Show heuristic-first routing:

  Input
    │
    ▼
  ┌─────────────────────┐
  │ Heuristic router    │ fast, deterministic
  │ (regex, rules)      │
  └─────────┬───────────┘
            │ no clear match
            ▼
  ┌─────────────────────┐
  │ LLM router          │ classify intent, pick
  │ (model-decided)     │ the handler/agent/tool
  └─────────────────────┘

  Routing is the bridge from SECTION A to SECTION C:
  in a single-agent system it picks a tool; in a
  multi-agent system the same pattern picks which
  *agent* handles the request (the supervisor's
  core job). Production pattern: heuristic at the
  front for the high-volume predictable routes, LLM
  router at the back for the ambiguous ones.

═════════════════════════════════════════════════
SECTION B — AGENTIC RETRIEVAL
  Anchor: single-agent (primary)
  Cross-references study-ai-engineering.md for all
  retrieval mechanics (embeddings, chunking, vector
  DBs, dense/sparse, RRF, reranking, RAG, GraphRAG).
═════════════════════════════════════════════════

This sub-section does NOT re-teach retrieval
mechanics. Those live in
`study-ai-engineering.md`'s `03-retrieval-and-rag/`.
This sub-section covers the shift from retrieval as
a *one-shot pipeline step* to retrieval as a
*control loop the agent drives* — which is purely an
agent-architecture concern.

  ### Agentic RAG

  Show the difference between static RAG and the
  agentic loop:

  Static RAG (one shot):
    query → retrieve top-k → stuff → generate
    (no evaluation, no second try)

  Agentic RAG (a loop):
  ┌───────────────────────────────────────────────┐
  │  decompose query into sub-questions           │
  └────────────────────┬──────────────────────────┘
                       ▼
  ┌───────────────────────────────────────────────┐
  │  retrieve for each (route to the right source)│
  └────────────────────┬──────────────────────────┘
                       ▼
  ┌───────────────────────────────────────────────┐
  │  evaluate: is this enough to answer?          │
  └──────────┬─────────────────────┬──────────────┘
             ▼ no                  ▼ yes
        re-retrieve            generate answer
        (refine query)
             │
             └──── loop (cap iterations)

  This is ReAct whose primary tool is retrieval.
  The reframe to hand the reader: *all agentic RAG
  is agentic AI; not all agentic AI does retrieval.*
  The tradeoff is steep — roughly 3-10x token cost
  and 2-5x latency over static RAG — so the
  above-threshold rule applies hard: use the loop
  only when one-shot retrieval measurably fails on
  multi-step or cross-source queries.

  ### Self-corrective RAG

  Add a relevance grader between retrieval and
  generation, with a fallback path:

  retrieve → ┌─────────────────────────┐
             │ grade each chunk:       │
             │ relevant? grounded?     │
             └──────────┬──────────────┘
              ┌──────────┴──────────┐
              ▼ relevant            ▼ not relevant
          generate            fall back:
                              rewrite query / widen
                              search / escalate

  The point this teaches: retrieval success
  (a chunk came back) is not answer success (the
  chunk is relevant and the answer is grounded in
  it). The grader is the gate that catches the gap.

  ### Retrieval routing

  When there are multiple knowledge sources, route
  the query to the right one before retrieving:

  query → ┌──────────────────────────┐
          │ router: which source?    │
          └──────────┬───────────────┘
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     vector DB    SQL DB     web search
     (semantic)   (exact)    (fresh)

  This is SECTION A's routing pattern applied to
  retrieval. The interview-grade point: a single
  vector store is rarely the whole answer; routing
  between a vector store (paraphrase queries), a
  relational store (exact lookups), and live search
  (freshness) is what production retrieval looks
  like.

═════════════════════════════════════════════════
SECTION C — MULTI-AGENT ORCHESTRATION
  Anchor: multi-agent (primary)
  This is the load-bearing new material in this
  spec. Teach it as new ground.
═════════════════════════════════════════════════

Everything above one agent. Each topology is a
*shape* first — lead with the diagram, then walk the
coordination mechanism, then name the overhead it
buys and what it buys with it.

  ### When NOT to go multi-agent

  This file comes first in the sub-section by design.
  The single most important multi-agent decision is
  whether to be multi-agent at all. Show the
  escalation gate:

  ┌───────────────────────────────────────────────┐
  │ 1. Build a single-agent (ReAct) baseline      │
  │ 2. Measure: success rate, tool-call accuracy, │
  │    latency, cost                              │
  │ 3. Identify the SPECIFIC failure single-agent │
  │    cannot fix                                  │
  │ 4. Is that failure genuinely decomposable     │
  │    into independent specialties?              │
  │       │                                        │
  │       ├─ no  → stay single-agent, fix the      │
  │       │        prompt / tools / retrieval      │
  │       └─ yes → escalate to the SPECIFIC        │
  │                topology that addresses it      │
  └───────────────────────────────────────────────┘

  The cost of crossing this gate: multi-agent adds
  roughly 2-5x coordination overhead and a much
  larger debugging surface (now you debug the
  conversation between agents, not just one agent's
  loop). The quality gain is often modest unless the
  problem genuinely splits into specialties. This is
  the file that earns the reader the senior-grade
  answer: "I considered multi-agent and chose not
  to, because [the failure wasn't decomposable]."

  ### Supervisor-worker

  The most common and most useful topology. Show the
  shape:

  ┌───────────────────────────────────────────────┐
  │              Supervisor agent                  │
  │   (decomposes task, delegates, synthesizes)   │
  └───────┬───────────────┬───────────────┬───────┘
          ▼               ▼               ▼
      ┌────────┐      ┌────────┐      ┌────────┐
      │worker 1│      │worker 2│      │worker 3│
      │(spec.) │      │(spec.) │      │(spec.) │
      └────┬───┘      └────┬───┘      └────┬───┘
           └───────────────┼───────────────┘
                           ▼
                  supervisor synthesizes
                  worker results → answer

  The bridge for the reader: this is a manager
  component delegating to child components, each
  owning one responsibility, with the parent
  merging the results. The supervisor's core job is
  routing (SECTION A) plus synthesis. The decision
  to make explicit: does the supervisor call workers
  as *tools* (it stays in control) or *hand off* to
  them (control transfers)? Tools-style keeps the
  topology debuggable; handoff-style is more flexible
  but harder to trace.

  ### Sequential / pipeline

  Output of one agent feeds the next. Show the chain:

  ┌─────────┐   draft   ┌─────────┐  reviewed  ┌─────────┐
  │ Agent A │ ────────► │ Agent B │ ─────────► │ Agent C │
  │ (write) │           │ (edit)  │            │ (format)│
  └─────────┘           └─────────┘            └─────────┘

  The bridge: this is a `.then()` chain of single-
  purpose functions, except each function is an
  agent. Same benefit as single-purpose chains —
  isolated failures, you know which stage broke, you
  can run a cheaper model on early stages. Same cost
  — latency is the sum of all stages (sequential, no
  parallelism).

  ### Parallel / fan-out-fan-in

  Independent subtasks run simultaneously, a merger
  combines. Show the fan:

           ┌──────── split ────────┐
           ▼          ▼            ▼
      ┌────────┐ ┌────────┐  ┌────────┐
      │agent 1 │ │agent 2 │  │agent 3 │   (concurrent)
      └────┬───┘ └────┬───┘  └────┬───┘
           └──────────┼───────────┘
                      ▼
              ┌──────────────┐
              │ merge agent  │  synthesizes
              └──────────────┘

  The bridge: this is `Promise.all()` over
  independent requests, then a reduce. The win is
  latency — three agents in parallel cost the time of
  the slowest, not the sum. The constraint that makes
  it possible: the subtasks must be genuinely
  independent (no subtask needs another's output). If
  they're dependent, it's a pipeline, not a fan-out.

  ### Debate / verifier-critic

  Agents argue or critique to refine quality. Show
  the two flavors:

  Debate (symmetric):              Verifier-critic (asymmetric):
  ┌────────┐   ┌────────┐          ┌──────────┐   ┌──────────┐
  │agent A  │◄─►│agent B  │         │ producer │──►│ critic   │
  │(propose)│   │(counter)│         │          │◄──│(approve/ │
  └────────┘   └────────┘          └──────────┘   │ reject)  │
       │            │                              └──────────┘
       └─────┬──────┘                    loop until approved
             ▼                           (cap the rounds)
        judge picks

  When this earns its overhead: high-stakes outputs
  where a second perspective measurably catches
  errors (a developer agent + a reviewer agent). The
  cost: every round is a full agent turn. The
  failure mode: two agents from the same model family
  share blind spots — use a different model family
  for the critic when the stakes justify it (the
  same self-preference bias named in
  `study-ai-engineering.md`'s LLM-as-judge file).

  ### Swarm / handoff

  Peer-to-peer control transfer, no central boss.
  Show the handoff:

      ┌────────┐  "you take it"  ┌────────┐
      │agent A  │ ──────────────► │agent B  │
      └────────┘                 └───┬────┘
           ▲                         │ "back to you"
           └─────────────────────────┘

  The model itself decides when to hand control to a
  peer specialist. More flexible than supervisor-
  worker (no central bottleneck), harder to debug
  (no single point that knows the whole state). The
  failure mode this introduces — infinite handoff
  (A → B → A → B) — is covered in the coordination-
  failure-modes file.

  ### Graph orchestration

  Control flow as an explicit state machine with
  nodes, edges, and checkpointed state. Show the
  graph:

  ┌──────┐    ┌──────┐    ┌──────┐
  │ node │───►│ node │───►│ node │
  │  A   │    │  B   │    │  C   │
  └──────┘    └──┬───┘    └──────┘
                 │ conditional edge
                 ▼
              ┌──────┐
              │ node │  (loop back / branch)
              │  D   │
              └──────┘

  This is the topology that makes the others
  inspectable: supervisor-worker, pipeline, and
  debate can all be expressed as a graph with
  explicit state, conditional edges, and
  checkpointing (so you can pause for human review
  and resume). The bridge: this is a state machine,
  the same shape a frontend engineer uses for a
  multi-step form's UI states — except the state is
  the shared agent context and the transitions are
  agent turns. The win is debuggability and human-
  in-the-loop pauses; the cost is up-front
  structure (you define the graph instead of letting
  the model freewheel).

  ### Shared state and message passing

  How agents communicate. The two models:

  Shared state (blackboard):       Message passing:
  ┌──────────────────────┐        agent A ──msg──► agent B
  │   shared context     │        agent B ──msg──► agent C
  │  (all agents read     │        (each agent sees only
  │   and write here)     │         what's passed to it)
  └──────────────────────┘
   ▲      ▲       ▲
   A      B       C

  The tradeoff that matters: shared state is simple
  to reason about but every agent sees everything
  (context bloat, the lost-in-the-middle problem
  scales with the number of agents). Message passing
  scopes each agent's context to what it needs
  (cheaper, less noise) but requires deciding what
  to pass — and a bug there means an agent acts on
  missing information. Multi-agent context routing
  (passing role-specific context to each agent) is
  the production answer, and it's a direct
  application of SECTION D's context engineering.

  ### Coordination failure modes

  The failures that don't exist in single-agent
  systems. Cover each with its mitigation:

  ┌──────────────────────┬──────────────────────────┐
  │ Failure              │ Mitigation               │
  ├──────────────────────┼──────────────────────────┤
  │ Infinite handoff     │ Handoff counter; force   │
  │ (A→B→A→B…)            │ stop or escalate to human│
  ├──────────────────────┼──────────────────────────┤
  │ Tool-call cascade    │ Per-agent and global      │
  │ (one agent triggers  │ iteration caps; budget    │
  │ a storm of calls)    │ ceiling that halts the run│
  ├──────────────────────┼──────────────────────────┤
  │ Context bloat as      │ Message passing / context │
  │ agents accumulate     │ routing instead of a       │
  │ shared state         │ shared blackboard          │
  ├──────────────────────┼──────────────────────────┤
  │ Synthesis failure    │ Validate worker outputs    │
  │ (supervisor merges    │ against a schema before    │
  │ contradictory results│ synthesis; surface         │
  │ )                    │ conflicts, don't average   │
  ├──────────────────────┼──────────────────────────┤
  │ Cost blowup          │ Per-run token budget;      │
  │ (2-5x overhead       │ cheap models for workers,  │
  │ compounds silently)  │ expensive only for the     │
  │                      │ supervisor                 │
  └──────────────────────┴──────────────────────────┘

  This file is where the "2-5x overhead" claim from
  the first file becomes concrete — these are the
  specific ways the overhead shows up and the
  specific controls that bound it.

═════════════════════════════════════════════════
SECTION D — AGENT INFRASTRUCTURE
  Anchor: single-agent + multi-agent (both)
═════════════════════════════════════════════════

The cross-cutting disciplines that matter more than
any single topology. These are the parts most
practitioners underweight and the parts that
separate a demo from a shipped system.

  ### Context engineering

  The discipline RAG and prompt engineering are
  subsets of. Show the superset relationship:

  ┌───────────────────────────────────────────────┐
  │            Context engineering                │
  │  (everything the model sees at inference time)│
  │                                               │
  │   ┌─────────────┐  ┌─────────────┐            │
  │   │   prompt    │  │     RAG     │            │
  │   │ engineering │  │ (retrieval) │            │
  │   └─────────────┘  └─────────────┘            │
  │   ┌─────────────┐  ┌─────────────┐            │
  │   │   memory    │  │ tool outputs│            │
  │   └─────────────┘  └─────────────┘            │
  │   ┌─────────────┐  ┌─────────────┐            │
  │   │ history      │  │ user profile│            │
  │   └─────────────┘  └─────────────┘            │
  └───────────────────────────────────────────────┘

  The reframe to hand the reader: most agent failures
  are not model failures — they are context failures
  (stale retrieval, lost-in-the-middle on a bloated
  context, no user state loaded, the wrong tool
  outputs in the window). Prompt engineering gets the
  first good output; context engineering keeps the
  thousandth good. Bigger context windows do not
  solve this — they make room for more noise. The
  job is curating *what fills the window for the next
  step*, and in a multi-agent system, *which agent
  sees what*. Cross-reference:
  `study-ai-engineering.md`'s context-window and
  lost-in-the-middle files cover the mechanics; this
  file covers context engineering as the *discipline*
  that decides what goes in the window.

  ### Agent memory tiers

  Memory as a dedicated component, separate from the
  context window. Show the tiers:

  ┌─ Working (in-context) ─────────────────────────┐
  │  The current task's context. Lives in the      │
  │  window. Gone when the run ends.               │
  └────────────────────────────────────────────────┘
  ┌─ Episodic (recent sessions) ───────────────────┐
  │  Summaries of past runs/conversations.          │
  │  Retrieved by relevance to the current task.    │
  └────────────────────────────────────────────────┘
  ┌─ Long-term (persistent knowledge) ─────────────┐
  │  Durable facts, decisions, preferences. Stored │
  │  in a vector DB / graph. Unbounded.             │
  └────────────────────────────────────────────────┘

  The bridge for the reader: this is the same
  local-canonical-plus-retrieved-context instinct
  from a local-first app's storage layering, applied
  to an agent's knowledge. The retrieval problem is
  the load-bearing one — long-term memory only works
  if the right thing is retrieved at the right time,
  which is RAG inside the agent. Cross-reference:
  `study-ai-engineering.md`'s agent-memory file
  covers the two-layer short/long split; this file
  extends it to the three-tier model and the
  cross-session retrieval problem.

  ### Tool calling and MCP

  The connective tissue under every pattern. Covered
  mechanically in `study-ai-engineering.md`
  (tool-calling file). This file's job: place tool
  calling as the substrate that ReAct, agentic RAG,
  and every multi-agent topology run on, and cover
  MCP as the protocol that standardizes how agents
  connect to tools and data — so a tool defined once
  is usable across agents without per-agent
  integration. The decision to name: MCP vs direct
  tool definitions vs a tool gateway, and the token
  overhead tradeoff of each.

  ### Agent evaluation

  Evaluating an agent is harder than evaluating one
  LLM call, because the unit of evaluation is the
  *trajectory*, not just the final output. Show what
  expands:

  LLM eval (one call):       Agent eval (a trajectory):
  ┌──────────────┐           ┌──────────────────────────┐
  │ input        │           │ was the right tool called?│
  │ → output     │           │ in the right order?       │
  │ → score      │           │ did it recover from errors│
  └──────────────┘           │ how many steps / $ / ms?  │
                             │ was the final output good?│
                             └──────────────────────────┘

  The metrics that matter for agents: task success
  rate, tool-call accuracy, trajectory efficiency
  (steps and cost to completion), and recovery rate
  (did it handle a failed tool call). The evaluator
  paradox — using an LLM to grade an LLM's trajectory
  — is real; the controls are frozen golden
  trajectories, iteration caps, and human spot-checks.
  Cross-reference: `study-ai-engineering.md`'s evals
  sub-section covers output-quality eval methods and
  LLM-as-judge bias; this file covers what's
  *additional* for agents — trajectory and tool-call
  evaluation.

  ### Guardrails and control

  The controls that bound an autonomous loop. Show
  the control points:

  ┌───────────────────────────────────────────────┐
  │  Input guardrail   (validate / sanitize)      │
  └────────────────────┬──────────────────────────┘
                       ▼
  ┌───────────────────────────────────────────────┐
  │  Agent loop                                   │
  │   • iteration cap (max steps)                 │
  │   • token / cost budget (halt at ceiling)     │
  │   • human-in-the-loop pause (gated actions)   │
  └────────────────────┬──────────────────────────┘
                       ▼
  ┌───────────────────────────────────────────────┐
  │  Output guardrail  (schema, safety check,     │
  │  never let agent output trigger side effects  │
  │  directly — go through your code)             │
  └───────────────────────────────────────────────┘

  Why this is its own concept: an agent without
  caps loops silently and burns tokens; an agent
  whose output triggers side effects directly is a
  prompt-injection liability. Cross-reference:
  `study-ai-engineering.md`'s prompt-injection and
  error-recovery files cover the per-call defenses;
  this file covers them as the *control envelope*
  around an autonomous loop, plus the human-in-the-
  loop gate that graph orchestration makes possible.

═════════════════════════════════════════════════
SECTION E — PRODUCTION SERVING FOR AGENTS
  Anchor: single-agent + multi-agent (both)
  Cross-references study-ai-engineering.md's
  production-serving sub-section (section 06) for the
  single-call mechanics — caching, cost optimization,
  rate limiting/backpressure, retry/circuit-breaker.
  This sub-section covers what those become once the
  unit is an autonomous loop (single-agent) or a
  topology (multi-agent), where the same problems
  compound across turns and across concurrent agents.
═════════════════════════════════════════════════

`study-ai-engineering.md`'s section 06 covers
caching, cost, backpressure, and circuit-breaking
for a *single LLM call*. This sub-section does NOT
re-teach those. It covers the three places where the
single-call version is insufficient because the unit
of execution is no longer one call — it's a loop or a
topology that issues many calls, often concurrently,
often repeatedly against the same tool. These are the
serving concerns that only show up once a system is
agentic.

  ### Cross-turn caching

  Single-call caching keys on one request. An agent
  runs many turns per task, and many tasks repeat
  sub-steps. Show the two cache scopes:

  Single-call cache (ai-eng's version):
    request → hash → hit? return : call

  Cross-turn cache (the agent version):
  ┌───────────────────────────────────────────────┐
  │  Agent run (task A)                           │
  │   turn 1: retrieve "auth flow"  ──┐           │
  │   turn 2: reason                  │ cached    │
  │   turn 3: retrieve "auth flow" ◄──┘ within    │
  │           (same sub-step, cache hit) the run  │
  └───────────────────────────────────────────────┘
  ┌───────────────────────────────────────────────┐
  │  Agent run (task B, later)                    │
  │   turn 1: retrieve "auth flow" ◄── semantic   │
  │           (similar to task A's, cache hit)    │
  │           cache across runs                    │
  └───────────────────────────────────────────────┘

  Three layers, cheapest to most useful for agents:
  prompt-prefix caching (provider-side — keep the
  stable system prompt and tool definitions at the
  front so the prefix is cached across every turn);
  intra-run memoization (the agent re-derives the
  same sub-result within a single task — cache it by
  the tool call + args); and cross-run semantic cache
  (a later task's sub-step is semantically close to an
  earlier one — embed the sub-query and return the
  cached result if close enough). The bridge for the
  reader: prefix caching is the same instinct as
  keeping the stable part of a request stable so a
  `fetch` keep-alive or an HTTP cache can reuse it —
  here it's the token prefix the provider caches.

  The tradeoff that's sharper for agents than for
  single calls: a stale cross-run cache hit poisons
  the *whole trajectory*, not one response — the agent
  reasons forward on a stale sub-result and every
  downstream turn inherits the error. Gate the
  semantic cache on freshness (don't cache retrieval
  results whose underlying data can change mid-task),
  and never cache a tool call that has side effects.

  ### Fan-out backpressure

  A single call has one outbound request to rate-
  limit. A fan-out topology (SECTION C's parallel
  pattern) fires many concurrent calls from one task —
  and a supervisor spawning workers can fan out
  faster than the provider's rate limit allows. Show
  the flow control:

  Supervisor decomposes → 12 worker calls at once
                       │
                       ▼
  ┌───────────────────────────────────────────────┐
  │  Concurrency limiter (semaphore)              │
  │   pop up to N concurrent (N = 4)              │
  │   queue the rest                              │
  └────────────────────┬──────────────────────────┘
                       ▼
  ┌───────────────────────────────────────────────┐
  │  Provider — receives at most N at a time      │
  └───────────────────────────────────────────────┘

  The bridge: this is `Promise.all()` with a
  concurrency cap — the same thing you reach for when
  you have 200 independent requests but don't want to
  open 200 connections at once. The agent version adds
  backpressure *upward*: when the worker queue grows
  past a threshold, the supervisor should stop
  decomposing further rather than queue unbounded work
  — a runaway supervisor that keeps spawning workers is
  the multi-agent version of an unbounded queue.

  The tradeoff: a low concurrency cap protects the
  provider but serializes the fan-out (you lose the
  parallel-latency win that made fan-out worth it).
  The breakpoint is the provider's rate limit divided
  by per-call duration — cap concurrency just under
  that, and if the task needs more throughput than the
  limit allows, the answer is request a higher limit
  or batch, not a higher local cap that just trades
  queueing for 429s.

  ### Per-tool circuit breaking

  Single-call retry handles one flaky request. An
  agent loop can call the *same flaky tool* on every
  turn — retrying a dead tool inside a loop multiplies
  the failure by the iteration count and burns the
  whole budget on a tool that isn't coming back. Show
  the breaker scoped to a tool:

  Agent calls tool X
       │
       ▼
  ┌───────────────────────────────────────────────┐
  │  Circuit breaker (per tool)                   │
  │   closed:    calls pass through               │
  │   N fails →  OPEN: fail fast, don't call tool │
  │   after T:   half-open, try one               │
  └───────────────────────────────────────────────┘
       │ tool X open?
       ▼
  Agent observes "tool X unavailable" and routes
  around it (picks a different tool / degrades /
  escalates) — instead of retrying it every turn

  The shift from ai-eng's version: there, the circuit
  breaker protects *your* service from hammering a
  broken dependency. Here it does that *and* feeds the
  open-circuit state back to the agent as an
  observation, so the agent's reasoning can route
  around the dead tool rather than looping on it. A
  breaker that just fails fast without telling the
  agent leaves the agent retrying the same dead path.

  The tradeoff: a per-tool breaker adds state the
  agent runtime has to carry across turns (which tools
  are open, their cooldown timers). The failure this
  prevents is the expensive one — without it, one dead
  tool plus an agent loop equals the entire iteration
  budget spent on retries, the worst kind of cost
  blowup because it produces nothing. This is the
  control that turns SECTION C's "tool-call cascade"
  failure mode from a budget-ending event into a
  routed-around inconvenience.

═════════════════════════════════════════════════
SECTION F — ORCHESTRATION SYSTEM DESIGN TEMPLATES
  Anchor: codebases reframed as interview templates
═════════════════════════════════════════════════

Mirror of the System design template sub-sections in
`study-ai-engineering.md`. Same nine-bullet template
shape (see that spec's "Template shape" block — do
not redefine here). All three templates appear in
every agent architecture guide regardless of current
applicability — the "Applies to this codebase"
bullet is honest (`yes` / `partially` / `no`), and
the "How to make it apply" bullet names the concrete
refactor that would let the reader defend the
codebase as this template.

These reframe the studied codebase as the answer to
"design an agentic X system." Same code, interview
framing. The three templates are generic and apply
to any repo:

  ### Multi-agent research assistant

  - **The prompt:** "Design a system that answers a
    complex research question by gathering from
    multiple sources and synthesizing."
  - **Standard architecture:** supervisor decomposes
    the question → parallel worker agents each
    retrieve from a source (agentic RAG per worker) →
    supervisor synthesizes with citations. (Draw the
    fan-out + synthesis diagram.)
  - **Data model:** source registry, per-worker
    retrieval indices, a shared findings store
    keyed by sub-question, citation provenance.
  - **Key components:** decomposition (supervisor),
    parallel retrieval (workers, fan-out), synthesis
    (merge agent), citation tracking. Decision per
    component: tools-style vs handoff-style
    delegation; shared state vs message passing.
  - **Scale concerns:** at many sources, fan-out
    fan-out cost; at deep questions, iteration
    blowup (cap it); at high volume, the supervisor
    becomes the bottleneck (cheap workers, expensive
    supervisor only).
  - **Eval framing:** trajectory eval (did each
    worker hit the right source?), answer
    groundedness (every claim cites a retrieved
    chunk), cost/latency per question.
  - **Common failure modes:** synthesis of
    contradictory sources, citation hallucination,
    cost blowup from deep loops, lost-in-the-middle
    across many worker results.
  - **Applies to this codebase:** [agent fills,
    about the studied repo only.]
  - **How to make it apply:** [agent fills, naming
    the refactor in the studied repo's files.]

  ### Agentic support / task system

  - **The prompt:** "Design an agent that resolves
    user requests by taking real actions across
    tools, and escalates when it can't."
  - **Standard architecture:** intent router →
    single agent with tools (ReAct) → guardrails
    (input sanitize, action gating, output schema) →
    human escalation on low confidence or gated
    actions. (Draw the loop with the control
    envelope.)
  - **Data model:** conversation/run history with
    tool calls and confidence per turn, escalation
    log, tool registry, action audit trail.
  - **Key components:** routing, the agent loop,
    guardrails, escalation gate, audit logging.
    Decision: which actions require human approval
    (irreversible / high-stakes) vs auto-execute.
  - **Scale concerns:** tool-call cascade under
    load, cost per resolved request, escalation
    queue as the human bottleneck.
  - **Eval framing:** resolution rate without
    escalation, tool-call accuracy, adversarial set
    (prompt injection, out-of-scope), action-safety
    (no unauthorized side effects).
  - **Common failure modes:** prompt injection in
    user input, agent taking an unsafe action
    directly, infinite loop on an unsolvable
    request, hallucinated tool results.
  - **Applies to this codebase:** [agent fills.]
  - **How to make it apply:** [agent fills.]

  ### Agentic coding / build system

  - **The prompt:** "Design an agent that completes
    a coding task across a repo — read, plan, edit,
    verify."
  - **Standard architecture:** plan-and-execute
    (plan the changes, then execute per file) +
    verifier-critic (run tests / review the diff,
    loop on failure) + guardrails (scope the writable
    files, cap iterations). (Draw plan→execute→verify
    loop.)
  - **Data model:** repo context (file tree,
    relevant files retrieved), the plan, the diff,
    test results, an iteration counter.
  - **Key components:** retrieval over the codebase
    (which files matter), planning, execution
    (edits), verification (tests/review), the
    re-plan trigger on verification failure.
    Decision: plan-and-execute vs pure ReAct for the
    edit loop.
  - **Scale concerns:** large repos blow the context
    budget (retrieval routing over the codebase),
    long tasks blow the iteration cap, cost per task.
  - **Eval framing:** task success (tests pass),
    trajectory efficiency (edits and re-plans to
    completion), regression rate (did it break
    something else).
  - **Common failure modes:** editing files outside
    scope, plan assumptions breaking mid-execution
    (re-plan), verifier sharing the producer's blind
    spots, context loss across long tasks.
  - **Applies to this codebase:** [agent fills.]
  - **How to make it apply:** [agent fills.]

═════════════════════════════════════════════════
AGENT PATTERNS IN THIS CODEBASE
  Anchor: the codebase being studied
═════════════════════════════════════════════════

  ### Agent patterns table

  Show the actual agent patterns this repo uses as a
  table:

  ┌────────────────────┬────────────────┬───────────────────┐
  │ Feature            │ Pattern / shape│ Why this pattern  │
  ├────────────────────┼────────────────┼───────────────────┤
  │ [feature]          │ ReAct          │ dynamic path      │
  │ [feature]          │ pipeline       │ known steps       │
  │ [feature]          │ supervisor-    │ decomposable into │
  │                    │ worker         │ specialties       │
  └────────────────────┴────────────────┴───────────────────┘

  For each: name the shape (workflow / single-agent /
  multi-agent), show the loop or topology as a small
  diagram, name the control envelope (caps, budgets,
  guardrails), and name the eval (if any). Not the
  full implementation — the structure of it.

  If the codebase is a workflow/chain shape with no
  autonomous loop, say so plainly and point to the
  system design templates for what adopting an agent
  loop would require.

═════════════════════════════════════════════════
CONSTRAINTS — AGENT-ARCHITECTURE-SPECIFIC
═════════════════════════════════════════════════

These constraints apply *in addition to* the general
constraint summary in `study.md`.

```
→ This spec is codebase-driven AND shape-driven.
   A concept file is generated when EITHER (a) the
   codebase exercises the pattern, OR (b) the
   pattern belongs to the shape the codebase matches
   (workflow / single-agent / multi-agent) and is
   in-scope for that shape. Patterns from a shape the
   codebase does not match at all are skipped — no
   file generated. Example: a workflow/chain codebase
   with no autonomous loop skips most of SECTION C's
   topology files but ALWAYS generates
   `01-when-not-to-go-multi-agent.md` and
   `01-chains-vs-agents.md` (the boundary files), and
   the system design templates in SECTION F (which
   name the refactor toward an agent loop).

→ For patterns NOT yet implemented in the studied
   repo but in-scope for its shape: `In this
   codebase` says "Not yet implemented" with one
   honest sentence (why — no autonomous loop yet,
   single-agent hasn't hit its ceiling, etc.), and
   the system design template in SECTION F carries
   the concrete "how to make it apply" refactor.
   This spec does NOT require a Project exercises
   block (it has no curriculum dependency) — unlike
   `study-ai-engineering.md`. If a future curriculum
   maps to these concepts, a Project exercises block
   can be added per `study.md`'s definition; until
   then, the system design templates are the
   buildable targets.

→ Cross-reference, do not duplicate. Where a concept
   is already covered in `study-ai-engineering.md`
   (ReAct mechanics, tool-calling mechanics, RAG /
   GraphRAG mechanics, agent memory two-layer split,
   LLM-as-judge bias, prompt injection per-call
   defense, single-call caching / cost / rate-limit /
   retry-and-circuit-breaker mechanics), the concept
   file here cites that file in
   its `See also` block and covers only the agent-
   architecture-specific angle (placement in the
   pattern family, the control loop, the topology,
   the trajectory). A concept file here that
   re-teaches mechanics already in
   `study-ai-engineering.md` is a generation failure.

→ Lead with the shape. Every SECTION C topology file
   opens with its topology diagram as the Move 1
   mental-model visual — the topology IS the mental
   model. Multi-agent topologies are diagrammatic by
   nature; a topology file whose Move 1 is prose
   instead of a shape diagram is incomplete.

→ Each `═════` sub-section divider includes an
   `Anchor:` line naming the shape category
   (workflow / single-agent / multi-agent) the
   sub-section primarily belongs to. The anchor names
   a CATEGORY, never a project. When the studied
   codebase matches the sub-section's anchor shape,
   weight coverage toward that sub-section.

→ No project names in generated output except the
   studied repo. The shape labels (workflow,
   single-agent, multi-agent) and the generic worked
   examples (research assistant, support system,
   coding agent) are instructional templates only.
   The only project that appears in any "In this
   codebase," file path, or "Applies to this
   codebase" bullet is the repo where the command was
   run.

→ The SECTION F system design templates are generic
   and generated for EVERY guide regardless of shape.
   Their standard architecture / data model / scale /
   eval / failure bullets are generic; the "Applies
   to this codebase" and "How to make it apply"
   bullets are answered about the studied repo only,
   using the nine-bullet template shape from
   `study-ai-engineering.md` (NOT the per-concept
   template — no Why care, How it works, etc.).
```
