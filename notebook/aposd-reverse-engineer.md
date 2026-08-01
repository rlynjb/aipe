Yes. **APOSD—*A Philosophy of Software Design*** can work very well as a **design lens for reverse-engineering an existing app or feature with an AI coding agent**.

The book is not a step-by-step reverse-engineering manual. Its value is giving the agent better questions:

> What complexity exists here, where is it located, what hides it, and where does it leak?

APOSD focuses on minimizing complexity by decomposing systems into relatively independent modules. Its major ideas include deep modules, simple interfaces, information hiding, reducing dependencies, and making code more obvious. ([Stanford University][1])

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

A normal codebase explanation might say:

> `GraphView.tsx` calls `useGraphData`, which calls the API.

An APOSD-oriented explanation asks:

> Does `GraphView` know more about graph storage, layout, caching, and API response formats than it should?

That second question helps you understand the **actual software design**, not just the call sequence.

## Master reverse-engineering prompt

Use this first:

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

The instruction to separate **evidence from inference** is especially important. Otherwise, coding agents often present plausible architectural guesses as established facts.

# Useful prompts by investigation stage

## 1. Establish the behavioral contract

Before studying implementation, determine what the feature actually promises.

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

This prevents the agent from treating the first function it finds as the feature boundary.

## 2. Find the real entry points

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

## 3. Trace one concrete scenario

Choose one user action and follow it completely.

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

Example:

```text
Trace what happens when a user adds a node to the skill-tree graph and connects
it to an existing node.
```

## 4. Identify the modules and their abstractions

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

A **deep module** provides substantial functionality behind a comparatively simple interface; information hiding is one of the main ways to achieve this. ([Daniel Hofstetter's Books][2])

## 5. Detect information leakage

This is one of the most useful APOSD prompts.

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

Information hiding reduces external dependencies on a design decision, so changes to that decision can remain localized. ([Daniel Hofstetter's Books][2])

## 6. Find shallow and pass-through modules

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

This is useful with AI-generated code because agents often create extra hooks, services, factories, interfaces, and wrappers that increase navigation cost without hiding complexity.

## 7. Locate cognitive load

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

## 8. Measure change amplification

This tells you whether you really understand the design.

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

For a graph app, useful probes might be:

```text
1. Add a new node type called "checkpoint."
2. Support multiple edges between the same two nodes.
3. Replace the graph-layout library.
4. Persist node positions separately from semantic graph data.
5. Add undo and redo for graph edits.
```

A module that successfully hides its implementation should contain many of these changes without forcing unrelated callers to change.

## 9. Find temporal decomposition

Temporal decomposition happens when code is divided according to execution order rather than ownership of knowledge.

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

## 10. Examine configuration complexity

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

This is a strong test for module depth: a module may appear reusable while forcing every caller to understand its internals.

## 11. Analyze error handling

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

## 12. Investigate state ownership

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

## 13. Ask what is intentionally hidden

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

The last question is particularly revealing:

> Could I replace the implementation without rewriting its consumers?

If not, the abstraction may not be hiding much.

## 14. Evaluate interface complexity

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

## 15. Find “unknown unknowns”

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

This reduces the chance that the agent gives you a clean but incorrect architecture story.

# APOSD design scorecard prompt

After the reverse-engineering pass, ask for a structured assessment:

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

# Architecture-teaching prompt

Because you are using codebases to study software fundamentals, this version may be especially useful:

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

# Prompt for comparing current and ideal designs

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

# Recommended workflow with your coding agent

Use APOSD in multiple passes rather than asking one giant question:

```text
Pass 1: What does the feature do?
Pass 2: Trace one concrete scenario.
Pass 3: Map modules, state, and dependencies.
Pass 4: Identify hidden and leaked information.
Pass 5: Probe the design with hypothetical changes.
Pass 6: Compare actual versus ideal boundaries.
Pass 7: Reconstruct a simplified version.
```

The key idea is:

```text
File exploration tells you where the code is.

Execution tracing tells you how it works.

APOSD analysis tells you why it is easy or difficult to change.
```

So yes—APOSD can become your **reverse-engineering question framework**, while the AI coding agent serves as the code explorer, tracer, critic, and tutor. The strongest combination is to use APOSD alongside system-design questions, behavioral tracing, data-flow analysis, and change-impact experiments.

[1]: https://web.stanford.edu/~ouster/cgi-bin/book.php?utm_source=chatgpt.com "Software Design Book"
[2]: https://books.danielhofstetter.com/a-philosophy-of-software-design/?utm_source=chatgpt.com "A Philosophy of Software Design - by John Ousterhout"
