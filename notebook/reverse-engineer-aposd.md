# APOSD Reverse-Engineering Prompt Library

Quick-reference for reverse-engineering an existing app or feature with an AI coding agent, using *A Philosophy of Software Design* as the question framework. The agent is the explorer, tracer, critic, and tutor; APOSD gives it better questions.

The core question APOSD asks of any code:

```text
What complexity exists here, where is it located, what hides it, and where does it leak?
```

A normal explanation says: *`GraphView.tsx` calls `useGraphData`, which calls the API.*
An APOSD explanation asks: *Does `GraphView` know more about graph storage, layout, caching, and API response formats than it should?* — that second question reveals the actual **design**, not just the call sequence.

**Always separate evidence from inference.** Otherwise agents present plausible architectural guesses as established facts.

---

## Index

| # | Prompt | What it does | Reach for it when |
|---|--------|--------------|-------------------|
| 0 | [**Master reverse-engineering**](#0-master-reverse-engineering-prompt) | Full 12-point pass → 9-section report | Start here on any unfamiliar feature |
| 1 | [**Behavioral contract**](#1-establish-the-behavioral-contract) | Feature purely from the user's side, no implementation | Before studying any code |
| 2 | [**Find entry points**](#2-find-the-real-entry-points) | Every route / handler / job / listener that starts the feature | Don't trust the first function you find |
| 3 | [**Trace one scenario**](#3-trace-one-concrete-scenario) | Follows a single user action end to end | Need concrete ground truth |
| 4 | [**Module map**](#4-identify-the-modules-and-their-abstractions) | Documents + classifies each module (deep → shallow) | Building the mental model |
| 5 | [**Information leakage**](#5-detect-information-leakage) | Finds design knowledge duplicated across places | Suspect change amplification |
| 6 | [**Shallow / pass-through**](#6-find-shallow-and-pass-through-modules) | Flags layers that don't hide meaningful complexity | Lots of hooks/wrappers/AI-gen code |
| 7 | [**Cognitive load**](#7-locate-cognitive-load) | What a dev must hold in mind at once to edit safely | Feature feels hard to touch |
| 8 | [**Change amplification**](#8-measure-change-amplification) | Probes design with hypothetical changes | Testing whether you actually understand it |
| 9 | [**Temporal decomposition**](#9-find-temporal-decomposition) | Detects load→validate→save splits that scatter one rule | Editing one rule touches many files |
| 10 | [**Configuration complexity**](#10-examine-configuration-complexity) | Audits config that shifts complexity onto callers | Module looks reusable but leaky |
| 11 | [**Error handling**](#11-analyze-error-handling) | Maps the error model + where complexity should absorb | Failures leak across boundaries |
| 12 | [**State ownership**](#12-investigate-state-ownership) | Source of truth, readers, writers, staleness per value | State ownership feels ambiguous |
| 13 | [**What's intentionally hidden**](#13-ask-what-is-intentionally-hidden) | Per interface: hidden vs accidentally exposed | Testing abstraction quality |
| 14 | [**Interface complexity**](#14-evaluate-interface-complexity) | Whether interface is simpler than its functionality | Judging a specific module's interface |
| 15 | [**Unknown unknowns**](#15-find-unknown-unknowns) | Hunts for evidence the current story is incomplete | Before trusting any clean explanation |
| A | [**Design scorecard**](#a-aposd-design-scorecard) | 1–5 scores across 10 APOSD dimensions | After the RE pass, want a summary |
| B | [**Architecture-teaching**](#b-architecture-teaching-prompt) | Teaches the feature as if you'll rebuild from scratch | Studying fundamentals via real code |
| C | [**Current vs ideal**](#c-compare-current-and-ideal-designs) | Descriptive vs prescriptive architecture, side by side | Want to see the gap to a better design |

Reference (not prompts): [RE model chain](#the-aposd-reverse-engineering-model) · [Multi-pass workflow](#recommended-multi-pass-workflow)

---

## The APOSD reverse-engineering model

Instead of merely generating a file tree, have the agent reconstruct this chain:

```text
User behavior
    ↓
Public interface
    ↓
Entry point
    ↓
Execution path
    ↓
State and data transformations
    ↓
Modules and responsibilities
    ↓
Hidden design decisions
    ↓
Dependencies and information leakage
    ↓
Likely change impact
```

---

## 0. Master reverse-engineering prompt

**What it does:** The full first pass — 12 investigation points producing a 9-section report. Explicitly forces evidence-vs-inference separation so guesses don't get presented as facts. Use this first.

```text
Reverse-engineer this feature using the principles from A Philosophy of
Software Design.

Do not modify the code yet.

Your goal is to explain:

1. What user-visible behavior the feature provides.
2. Where the feature begins in the codebase.
3. The end-to-end execution path.
4. The major modules involved and each module's responsibility.
5. The public interface of each important module.
6. What complexity each module hides from its callers.
7. Which modules are deep and which appear shallow.
8. What design information is duplicated or leaked across boundaries.
9. Which dependencies create the greatest cognitive load.
10. What would have to change for three plausible feature modifications.
11. Which parts are confirmed by code and which are your inferences.
12. What questions remain unanswered.

For every conclusion, cite the relevant file, symbol, and line range.

Present the result as:

- Behavioral summary
- System boundary
- Execution trace
- Module map
- Data and state flow
- Dependency map
- APOSD design assessment
- Change-impact scenarios
- Unknowns and verification steps
```

---

## 1. Establish the behavioral contract

**What it does:** Pins down what the feature *promises* before any implementation study, so the agent doesn't treat the first function it finds as the feature boundary. Output is contract-shaped and could become acceptance tests.

```text
Describe this feature entirely from the user's perspective.

Identify:

- How the user enters the feature
- Inputs the user can provide
- Visible outputs
- Loading, empty, success, and error states
- Permissions or prerequisites
- Side effects
- Persistent changes
- External services involved

Do not explain implementation yet. Produce a behavioral contract that could
later be turned into acceptance tests.
```

---

## 2. Find the real entry points

**What it does:** Enumerates every way the feature can start — routes, handlers, jobs, listeners, triggers — and separates primary from indirect entry points.

```text
Find every entry point into this feature.

Consider:

- Routes
- UI event handlers
- Public functions
- API endpoints
- Commands
- Background jobs
- Event listeners
- Database triggers
- Scheduled tasks

For each entry point, explain who calls it and under what conditions.

Distinguish primary entry points from indirect or internal entry points.
```

---

## 3. Trace one concrete scenario

**What it does:** Follows a single user action all the way through, naming file/symbol/state/dependency/decision at each step. Concrete ground truth beats a generic overview.

```text
Trace the following scenario end to end:

[Describe one specific user action.]

Start with the user interaction and follow the execution through:

1. UI event
2. Input validation
3. State update
4. Business logic
5. Network or persistence layer
6. Response transformation
7. Rendering or user feedback
8. Error handling

At each step, identify:

- File and symbol
- Input
- Output
- State read or written
- Dependency invoked
- Design decision being made

Do not skip intermediate abstractions.
```

*Example:*

```text
Trace what happens when a user adds a node to the skill-tree graph and connects
it to an existing node.
```

---

## 4. Identify the modules and their abstractions

**What it does:** Builds a module map documenting responsibility, interface, hidden vs exposed details, then classifies each module deep → shallow → pass-through with evidence. (A deep module gives substantial functionality behind a simple interface.)

```text
Construct a module map for this feature.

For each important module, document:

- Responsibility
- Public interface
- Internal implementation details
- Callers
- Dependencies
- State owned
- Decisions owned
- Details hidden from callers
- Details callers must understand

Then classify the module as:

- Deep
- Moderately deep
- Shallow
- Pass-through
- Unclear

Explain the classification using concrete evidence.
```

---

## 5. Detect information leakage

**What it does:** One of the most useful APOSD prompts — finds design knowledge duplicated across locations, shows why they must change together, and names who should own it. Leakage is what makes changes ripple.

```text
Look for information leakage in this feature.

Find design knowledge that appears in more than one place, including:

- Database schema knowledge
- API response shapes
- Naming conventions
- Status values
- Validation rules
- Retry policies
- Cache keys
- Graph traversal rules
- Serialization formats
- Permission logic
- Error interpretation
- Layout calculations

For every leak, show:

1. The duplicated design knowledge
2. Every location that knows about it
3. Why those locations must change together
4. Which module should ideally own the knowledge
5. Whether centralizing it would improve or harm the design
```

---

## 6. Find shallow and pass-through modules

**What it does:** Flags modules whose interface is nearly as complex as their implementation — forwarders, renamers, layers that add navigation cost without hiding complexity. Especially useful on AI-generated code (agents love extra hooks/services/factories).

```text
Find modules, wrappers, functions, hooks, services, or components whose
interfaces are nearly as complex as their implementations.

Look especially for code that:

- Merely forwards arguments
- Renames another API without simplifying it
- Exposes implementation-specific configuration
- Requires callers to understand operation ordering
- Splits one responsibility across many tiny files
- Adds a layer without hiding meaningful complexity

For each candidate, explain whether it is:

- A legitimate boundary
- A useful adapter
- A shallow module
- An unnecessary pass-through layer

Do not assume that small modules are automatically well designed.
```

---

## 7. Locate cognitive load

**What it does:** Identifies the knowledge a developer must hold *simultaneously* to safely change the feature, grouped by kind, then flags paths that demand too many groups at once.

```text
Identify the knowledge a developer must hold simultaneously to safely modify
this feature.

Group that knowledge into:

- Domain rules
- UI behavior
- State transitions
- Data model
- Infrastructure
- External APIs
- Timing or concurrency
- Error behavior
- Configuration
- Hidden conventions

Then identify which code paths require knowledge from too many groups at once.

Explain what makes those paths cognitively difficult.
```

---

## 8. Measure change amplification

**What it does:** Probes the design with hypothetical changes to reveal whether you actually understand it. A well-hidden module contains many of these without forcing unrelated callers to change. Don't implement — use as probes.

```text
Perform a change-impact analysis for these hypothetical changes:

1. [Small behavior change]
2. [Data-model change]
3. [New integration or major capability]

For each change, identify:

- Files likely to change
- Interfaces likely to change
- Tests likely to change
- Design knowledge duplicated across those files
- Modules that successfully contain the change
- Modules that allow the change to spread
- Unknown risks

Do not implement the changes. Use them as probes for understanding the design.
```

*Example probes (graph app):*

```text
1. Add a new node type called "checkpoint."
2. Support multiple edges between the same two nodes.
3. Replace the graph-layout library.
4. Persist node positions separately from semantic graph data.
5. Add undo and redo for graph edits.
```

---

## 9. Find temporal decomposition

**What it does:** Detects code split by execution order (load → validate → transform → save → notify) rather than knowledge ownership, where changing one business rule forces edits across several sequential modules.

```text
Check whether this feature is decomposed primarily by execution sequence:

- Load
- Validate
- Transform
- Save
- Notify

Determine whether these stages share knowledge that belongs together in one
deeper abstraction.

Find cases where a developer must edit several sequential modules to change one
business rule.

Suggest alternative responsibility boundaries, but do not refactor yet.
```

---

## 10. Examine configuration complexity

**What it does:** Audits every config option for whether it shifts complexity from the module onto its callers — a strong test of real module depth (a module can look reusable while forcing callers to understand its internals).

```text
Audit all configuration required by this feature.

For each option, determine:

- Who provides it
- Who interprets it
- Whether callers understand why it is needed
- Whether a sensible default exists
- Whether two options must remain synchronized
- Whether the option exposes an implementation detail
- Whether the module could determine the value itself

Identify configuration that shifts complexity from the module onto its callers.
```

---

## 11. Analyze error handling

**What it does:** Maps the whole error model — where errors originate, cross boundaries, get translated — and recommends where error complexity should be absorbed vs stay visible.

```text
Map the feature's error model.

Identify:

- Where errors originate
- Which errors cross module boundaries
- Where errors are translated
- Which modules expose low-level failures
- Which callers must understand infrastructure-specific errors
- Which errors can be handled internally
- Whether retry and recovery policies are centralized
- Whether normal conditions are represented as exceptions

Recommend where error complexity should be absorbed and where it should remain
visible.
```

---

## 12. Investigate state ownership

**What it does:** Maps every important piece of state — source of truth, owner, readers, writers, lifetime, staleness — and flags state whose ownership is ambiguous or whose representation leaks across modules.

```text
Map every important piece of state used by this feature.

For each state value, document:

- Source of truth
- Owner
- Readers
- Writers
- Lifetime
- Persistence mechanism
- Synchronization mechanism
- Derived values
- Invariants
- Ways it can become stale

Identify state whose ownership is ambiguous or whose representation leaks across
multiple modules.
```

---

## 13. Ask what is intentionally hidden

**What it does:** Per interface, contrasts what callers *need* to know with what they *currently* know. The revealing test: *could the implementation be replaced without changing callers?* If not, the abstraction hides little.

```text
For each major interface, answer:

- What does the caller need to know?
- What does the caller currently know?
- What implementation decisions are hidden?
- What implementation decisions are accidentally exposed?
- What assumptions are implicit rather than documented?
- Could the implementation be replaced without changing callers?

Use concrete examples from the codebase.
```

---

## 14. Evaluate interface complexity

**What it does:** Scores a specific module's interface on concepts, arguments, ordering, special cases, error surface, and asks the key question: is the interface simpler than the functionality behind it?

```text
Analyze the interface of [module or feature].

Evaluate:

- Number of concepts exposed
- Number of arguments
- Required call ordering
- Special cases
- Configuration burden
- Return-value complexity
- Error surface
- Naming clarity
- Consistency across methods
- Knowledge required before first use

Explain whether the interface is simpler than the functionality it provides.
```

---

## 15. Find "unknown unknowns"

**What it does:** Actively hunts for evidence that contradicts the current architecture story — hidden writes, background jobs, feature flags, legacy paths, runtime registration. Reduces the risk of a clean-but-wrong explanation.

```text
Challenge the current architectural explanation.

Search for evidence that contradicts it, including:

- Alternative entry points
- Hidden writes
- Background processing
- Indirect event handlers
- Feature flags
- Legacy implementations
- Environment-dependent behavior
- Tests using a different path
- Generated code
- Runtime registration
- Dependency injection
- Dynamic imports
- Database behavior not represented in application code

List anything that could make the current explanation incomplete.
```

---

## A. APOSD design scorecard

**What it does:** After the reverse-engineering pass, produces a structured 1–5 assessment across 10 APOSD dimensions with evidence, consequences, and one improvement each. Won't reward abstraction by default.

```text
Score this feature from 1 to 5 on the following dimensions:

1. Interface simplicity
2. Module depth
3. Information hiding
4. Responsibility clarity
5. State ownership
6. Dependency containment
7. Change locality
8. Code obviousness
9. Error abstraction
10. Overall cognitive load

For each score:

- Give concrete evidence
- Cite the relevant code
- Explain the consequences
- Recommend one improvement
- State your confidence level

Do not reward additional abstraction by default. Reward abstractions only when
they hide meaningful complexity or localize design knowledge.
```

---

## B. Architecture-teaching prompt

**What it does:** Teaches the feature as if you'll rebuild it from scratch without copying the code — separating essential vs accidental complexity, framework mechanics, and reusable CS concepts. Ends with a small reconstruction exercise. Best for studying fundamentals through real code.

```text
Teach me this feature as though I will need to rebuild it from scratch without
copying the implementation.

Explain it in this order:

1. User problem
2. Behavioral contract
3. Essential domain concepts
4. Core invariants
5. Data model
6. State transitions
7. Algorithms involved
8. Public module boundaries
9. Information each module should hide
10. End-to-end execution path
11. Failure cases
12. Performance constraints
13. Security constraints
14. Testing strategy
15. Alternative designs and trade-offs

Separate:

- Essential complexity inherent to the problem
- Accidental complexity introduced by this implementation
- Framework-specific mechanics
- Reusable computer-science concepts

Finish with a small reconstruction exercise that implements the same principles
without duplicating the original code.
```

---

## C. Compare current and ideal designs

**What it does:** Produces two architecture models side by side — descriptive (what the code does today) vs prescriptive (how it could be arranged to minimize complexity) — and keeps observed design clearly separate from proposal.

```text
Produce two architecture models for this feature:

A. Descriptive architecture:
What the code actually does today.

B. Prescriptive architecture:
How responsibilities could be arranged to minimize complexity using APOSD
principles.

For both models, show:

- Modules
- Interfaces
- Dependencies
- State ownership
- Information hidden
- Information leaked
- Change boundaries

Do not present the prescriptive model as fact. Clearly separate observed design
from proposed design.
```

---

## Recommended multi-pass workflow

Use APOSD in multiple passes rather than one giant question:

```text
Pass 1: What does the feature do?
Pass 2: Trace one concrete scenario.
Pass 3: Map modules, state, and dependencies.
Pass 4: Identify hidden and leaked information.
Pass 5: Probe the design with hypothetical changes.
Pass 6: Compare actual versus ideal boundaries.
Pass 7: Reconstruct a simplified version.
```

The key idea:

```text
File exploration tells you where the code is.

Execution tracing tells you how it works.

APOSD analysis tells you why it is easy or difficult to change.
```

---

*Sources: A Philosophy of Software Design — John Ousterhout (web.stanford.edu/~ouster/cgi-bin/book.php); summary notes at books.danielhofstetter.com/a-philosophy-of-software-design.*
