# Graph Algorithms the Fun Way Feature-Planning Prompt Library

Quick-reference for planning a Jira feature with concepts from *Graph Algorithms the Fun Way*. Pick a prompt, paste your ticket, run it. Prompts never write code—they determine whether the problem is actually graph-shaped, define the graph precisely, select an algorithm from the behavior required, and test its limits before implementation.

A Jira ticket usually tells you:

```text
What the user needs
What behavior is accepted
What is excluded
Extra context and constraints
```

Graph-algorithm thinking helps you determine:

```text
What are the nodes and edges?
Is the graph directed, weighted, cyclic, or disconnected?
What question must the algorithm answer?
Which graph invariant must always hold?
Which traversal or optimization algorithm fits the real requirement?
What happens as the graph grows?
```

The goal is not to force every feature into a graph or choose an impressive algorithm. The goal is to **model relationships accurately and select the simplest algorithm that proves the required behavior**.

---

## Index

| #  | Prompt                                                                             | What it does                                                          | Reach for it when                                 |
| -- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| 1  | [**Compact daily**](#1-compact-daily-prompt)                                       | 14-step condensed graph plan, all phases in one shot                  | Default. Most graph-shaped tickets.               |
| 2  | [**Master**](#2-master-feature-planning-prompt)                                    | Full 15-stage graph and algorithm analysis                            | High-risk, ambiguous, or algorithm-heavy feature  |
| 3  | [**First pass**](#3-first-pass--understand-the-ticket)                             | Sorts ticket into confirmed / inferred / ambiguous / contradictory    | Before modeling the graph                         |
| 4  | [**AC → graph invariants**](#4-turn-acceptance-criteria-into-graph-invariants)     | Turns each criterion into graph rules, algorithm behavior, and tests  | Acceptance criteria are behavior-only             |
| 5  | [**Codebase investigation**](#5-questions-for-investigating-the-existing-codebase) | Questions for locating existing graph representations and algorithms  | Requirements clear, need to find the fit          |
| 6  | [**Closest features**](#6-find-the-three-closest-existing-features)                | Finds 3 nearest features and reusable modeling decisions              | Similar relationship logic may exist              |
| 7  | [**Graph model**](#7-design-the-feature-around-the-graph-model)                    | Defines vertices, edges, direction, weights, identity, and invariants | Graph representation is unclear                   |
| 8  | [**Two designs**](#8-ask-for-two-designs)                                          | A simple model vs an optimized graph design                           | Multiple representations or algorithms are viable |
| 9  | [**Overengineering check**](#9-detect-overengineering-before-coding)               | Flags unnecessary graph infrastructure or advanced algorithms         | Plan feels academically heavy                     |
| 10 | [**Future-change probes**](#10-probe-the-design-with-future-changes)               | Stress-tests graph representation and algorithm choice                | Validate the design before coding                 |
| 11 | [**Vertical slices**](#11-convert-the-plan-into-vertical-slices)                   | Converts the selected design into testable graph behaviors            | Ready to sequence implementation                  |

Reference (not prompts): [Planning sequence](#recommended-planning-sequence) · [Planning questions](#planning-questions--mental-checklist) · [Workflow](#workflow-summary)

---

## Recommended planning sequence

```text
Jira ticket
    ↓
Behavioral contract
    ↓
Open questions and assumptions
    ↓
Domain relationships
    ↓
Graph suitability check
    ↓
Graph model
    ↓
Graph invariants
    ↓
Required queries and mutations
    ↓
Candidate algorithms
    ↓
Complexity and scale analysis
    ↓
Selected design and trade-offs
    ↓
Implementation slices
    ↓
Testing and rollout plan
```

---

## 1. Compact daily prompt

**What it does:** Runs every graph-planning phase in a condensed 14-step pass. Your everyday driver for a normal graph-shaped ticket.

```text
Plan this Jira feature using concepts from Graph Algorithms the Fun Way.
Do not write code yet.

1. Extract confirmed requirements, assumptions, ambiguities, and exclusions.
2. Rewrite the acceptance criteria as testable behavior.
3. Determine whether the problem is genuinely graph-shaped.
4. Identify the domain entities and relationships.
5. Define the graph's vertices, edges, direction, weights, and identity rules.
6. Identify graph invariants and valid mutations.
7. List the graph questions the feature must answer.
8. Find the existing data structures, graph logic, and related features.
9. Propose at least two representations or algorithmic designs.
10. Compare correctness, complexity, memory use, update cost, and explainability.
11. Probe the design with cycles, disconnected components, duplicates, and scale.
12. Recommend the simplest design that satisfies the requirements.
13. Break it into independently testable vertical slices.
14. List tests, open questions, risks, rollout concerns, and definition of done.

Separate ticket requirements, codebase evidence, assumptions, algorithmic
inference, and recommendations.

Do not force a graph model if a list, tree, set, map, or relational query solves
the problem more clearly.
```

---

## 2. Master feature-planning prompt

**What it does:** The full 15-stage analysis—behavioral contract through graph modeling, algorithm selection, implementation, and rollout. Use when a feature is algorithm-heavy, cross-cutting, or ambiguous.

```text
You are helping me plan a software feature using concepts from
Graph Algorithms the Fun Way.

Do not implement the feature yet.

Jira ticket:

[Paste user story]

Acceptance criteria:

[Paste acceptance criteria]

Out of scope:

[Paste out-of-scope items]

Additional context and Jira comments:

[Paste relevant comments]

Relevant codebase areas, if known:

[Files, modules, schemas, routes, services, or leave blank]

Expected graph size or workload, if known:

[Number of nodes, edges, mutations, queries, latency expectations, or leave blank]

Analyze the ticket in the following stages.

## 1. Behavioral contract

Explain the feature from the user's perspective:

* Who uses it
* What triggers it
* Inputs
* Visible outputs
* State changes
* Success behavior
* Loading behavior
* Empty behavior
* Failure behavior
* Permissions or prerequisites
* Side effects
* Persistence requirements

Rewrite the acceptance criteria into precise, testable behavioral statements.

Do not add requirements that are not supported by the ticket.

## 2. Requirement classification

Classify every requirement as one of:

* Explicit requirement
* Implied requirement
* Technical constraint
* Product assumption
* Open question
* Out of scope
* Possible future requirement

Cite the ticket section or comment supporting each conclusion.

Separate confirmed requirements from interpretations.

## 3. Ambiguities and contradictions

Identify:

* Missing behavior
* Contradictory acceptance criteria
* Comments that change the original story
* Undefined terminology
* Unspecified edge cases
* Unclear relationship direction
* Unclear duplicate behavior
* Unclear cycle behavior
* Missing ordering or ranking semantics
* Missing scale expectations
* Requirements that may be algorithmically incompatible

For each ambiguity, explain why it matters and propose a concrete question for
the product owner, designer, or engineering team.

Do not silently resolve material ambiguities.

## 4. Graph suitability

Determine whether the problem should be modeled as a graph.

Identify:

* Domain entities
* Relationships
* Queries over those relationships
* Mutations to those relationships
* Whether paths, reachability, connectivity, dependency, ranking, or flow matter

Compare a graph model with simpler alternatives:

* List
* Set
* Map
* Tree
* Relational table and joins
* Hierarchical structure
* State machine
* Plain search or filtering

Explain whether the graph model is essential, useful, optional, or unnecessary.

Do not force the graph abstraction merely because relationships exist.

## 5. Graph model

Define the proposed graph precisely.

Document:

* Vertex meaning
* Vertex identity
* Vertex attributes
* Edge meaning
* Edge identity
* Directed or undirected
* Weighted or unweighted
* Simple graph or multigraph
* Self-loops allowed or forbidden
* Cycles allowed or forbidden
* Connected or potentially disconnected
* Static or dynamic
* Sparse or dense
* Ownership and tenancy
* Persistence requirements

If multiple graph views exist, define each one separately.

Do not confuse the domain graph with its visual layout.

## 6. Graph invariants

List the conditions that must always remain true.

Examples include:

* Vertex identifiers are unique
* Edges reference existing vertices
* Duplicate edges are forbidden or explicitly supported
* A dependency graph remains acyclic
* A tree-like graph has at most one parent per node
* Edge weights satisfy domain constraints
* A path cannot cross tenant boundaries
* Root or source nodes follow special rules
* Deleted nodes cannot remain referenced
* Ordering derived from the graph is deterministic where required

For each invariant, identify:

* Where it should be enforced
* Whether the type system can represent it
* Whether runtime validation is needed
* Whether a database constraint is possible
* Whether a graph traversal is required
* Which tests should prove it

## 7. Required graph operations

List every graph operation the feature requires.

Classify each as:

* Add vertex
* Remove vertex
* Update vertex
* Add edge
* Remove edge
* Update edge
* Find neighbors
* Test adjacency
* Test reachability
* Find a path
* Find a shortest path
* Traverse a component
* Detect a cycle
* Produce a topological order
* Find connected components
* Rank vertices
* Build a spanning tree
* Match or assign entities
* Compute flow or capacity
* Search by depth or distance

For each operation, identify:

* Inputs
* Outputs
* Frequency
* Latency expectation
* Mutation or read
* Required correctness
* Whether approximate results are acceptable

## 8. Existing-system investigation

Identify what must be inspected in the codebase before choosing a design:

* Existing entity models
* Relationship tables
* Adjacency structures
* Graph libraries
* Traversal helpers
* Cycle checks
* Ordering logic
* Search or recommendation logic
* Visualization libraries
* Persistence layer
* Caching
* Authorization
* Background jobs
* Tests
* Analytics
* Feature flags
* Legacy implementations

Provide targeted codebase-search questions rather than generic exploration
instructions.

## 9. Candidate algorithms

For each required graph operation, identify the simplest credible algorithm.

Consider where relevant:

* Breadth-first search
* Depth-first search
* Iterative DFS
* Bidirectional search
* Cycle detection
* Topological sorting
* Dijkstra's algorithm
* Bellman–Ford
* A*
* Floyd–Warshall
* Connected-components traversal
* Union–find
* Minimum spanning tree
* Strongly connected components
* PageRank or centrality
* Bipartite matching
* Maximum flow
* Dynamic programming on DAGs

For each candidate, explain:

* Why it fits
* Preconditions
* Correctness guarantee
* Time complexity
* Space complexity
* Behavior on disconnected graphs
* Behavior on cycles
* Behavior with negative weights
* Mutation cost
* Implementation difficulty
* Testing difficulty

Do not choose an advanced algorithm when a traversal or database query is
sufficient.

## 10. Representation and design alternatives

Produce at least two viable designs.

Design A should favor simplicity and compatibility with the current codebase.

Design B may optimize graph operations or future scale, even if it requires a
different representation.

For each design, show:

* Domain model
* Graph representation
* Storage model
* Public operations
* Algorithms
* Mutation flow
* Query flow
* Invariant enforcement
* Cache or derived-data needs
* Advantages
* Disadvantages
* Complexity
* Memory cost
* Testing implications
* Migration cost
* Likely future-change impact

Recommend one design and explain why.

## 11. Complexity and scale probes

Evaluate the proposed design for:

* Empty graph
* One vertex
* One edge
* Duplicate edges
* Self-loops
* Cycles
* Disconnected components
* Very deep paths
* Very wide graphs
* Dense graphs
* High-degree vertices
* Frequent mutations
* Repeated path queries
* Concurrent edits
* Large tenants
* Worst-case input

Estimate time and space complexity for the most important operations.

Distinguish theoretical worst case from expected workload.

Identify the data size at which the design would need reconsideration.

## 12. Implementation plan

Break the work into small, independently verifiable slices.

For every slice, include:

* Goal
* User-visible behavior
* Graph operation introduced
* Graph invariant addressed
* Representation or algorithm involved
* Files or modules likely affected
* Tests
* Dependencies
* Risks
* Completion signal

Prefer vertical slices that produce testable behavior.

Avoid creating all graph infrastructure before delivering the first behavior.

## 13. Test strategy

Map each acceptance criterion, graph invariant, and algorithm guarantee to
tests.

Include, where applicable:

* Unit tests
* Property-based tests
* Graph fixture tests
* Integration tests
* API tests
* UI tests
* Authorization tests
* Mutation tests
* Cycle tests
* Disconnected-graph tests
* Duplicate-edge tests
* Complexity or benchmark tests
* Regression tests
* Manual visualization checks

Use small named graph fixtures whose expected result can be reasoned about by
hand.

Avoid tests that merely duplicate the algorithm line by line.

## 14. Delivery and rollout

Identify:

* Data migrations
* Graph backfills
* Existing invalid relationships
* Backward compatibility
* Feature flags
* Deployment ordering
* Cache rebuilding
* Observability
* Logs and metrics
* Performance thresholds
* Rollback strategy
* Data cleanup
* Documentation
* Operational risks

Explain how existing graph data will be validated before enabling the feature.

## 15. Final planning summary

Return:

* Feature summary
* Confirmed requirements
* Open questions
* Assumptions
* Graph-suitability decision
* Domain concepts
* Graph model
* Graph invariants
* Required graph operations
* Recommended algorithms
* Complexity summary
* Recommended design
* Data and execution flow
* Implementation slices
* Test matrix
* Rollout considerations
* Risks
* Definition of done

Keep observed facts, product requirements, mathematical guarantees, and design
recommendations clearly separated.
```

---

## 3. First pass — understand the ticket

**What it does:** Normalizes raw Jira information before graph modeling. Prevents the team from choosing nodes, edges, or algorithms while the behavior remains ambiguous.

```text
Analyze this Jira ticket before proposing a graph model or algorithm.

Create four sections:

## Confirmed

Requirements directly stated by the user story, acceptance criteria,
out-of-scope section, or comments.

## Inferred

Behavior that appears necessary but is not explicitly stated.

For every inference, explain what evidence suggests it.

## Ambiguous

Requirements that could reasonably have multiple interpretations.

Pay special attention to:

- Relationship direction
- Whether duplicate relationships are allowed
- Whether cycles are allowed
- Whether ordering matters
- Whether edge weights have meaning
- Whether all nodes must be connected
- Whether the user needs any path or the best path
- Whether results must update immediately
- Expected graph size

For each ambiguity, provide one precise clarification question.

## Contradictory

Statements in the ticket or comments that conflict with one another.

Identify which statement came later and whether it appears to supersede the
earlier one.

Then rewrite the ticket as a concise behavioral contract without adding
unsupported graph requirements.
```

---

## 4. Turn acceptance criteria into graph invariants

**What it does:** Converts visible feature behavior into continuous structural and algorithmic guarantees.

*Example — ticket:*

```text
As a user, I can connect one skill to another as a prerequisite.
The app must not allow circular prerequisite chains.
```

*Example — possible graph invariants:*

```text
Each skill is represented by one unique vertex.

A prerequisite relationship is a directed edge.

Adding an edge must not create a directed cycle.

An edge may connect only skills in the same workspace.

Duplicate prerequisite edges are not allowed.

A topological ordering must exist after every successful mutation.
```

```text
Convert each acceptance criterion into:

1. User-visible behavior
2. Graph entities involved
3. Graph mutation or query
4. Structural invariant
5. Algorithmic guarantee
6. Failure behavior
7. Complexity concern
8. Test case
9. Module responsible for guaranteeing it

Identify acceptance criteria that do not currently define enough information
to derive these items.
```

---

## 5. Questions for investigating the existing codebase

**What it does:** A focused question set for locating existing relationship and traversal behavior before selecting a representation or algorithm.

```text
Where are the domain entities that may become vertices defined?

Where are relationships between those entities stored?

Is the relationship directed or undirected in current behavior?

Can duplicate relationships exist?

Can self-references exist?

Where are relationship mutations performed?

Where are cycles currently prevented or tolerated?

Does any code already perform BFS, DFS, path search, ordering, ranking, or
connected-component analysis?

Is a graph library already installed?

Is the graph representation optimized for persistence, querying, or rendering?

Is visual layout data mixed with semantic graph data?

What is the source of truth for vertices and edges?

Which modules can mutate the graph?

Which queries are currently implemented through database joins?

Which tests define graph behavior today?

Are there competing graph representations?

Which implementation is current, and which is legacy?
```

---

## 6. Find the three closest existing features

**What it does:** Locates the three nearest features and extracts reusable graph-modeling and algorithmic decisions without assuming repeated code is correct.

```text
Find the three closest existing features to this Jira ticket.

For each one, explain:

- What domain behavior it shares
- Which entities behave like vertices
- Which relationships behave like edges
- Whether the graph is directed, weighted, cyclic, or disconnected
- Which representation it uses
- Which algorithms or traversals it uses
- Which invariants it enforces
- Which design decisions are reusable
- Which limitations should not be copied
- Whether it represents the current preferred architecture
- What evidence supports that conclusion

Do not assume repeated traversal code or use of the same graph library
represents a good design.
```

---

## 7. Design the feature around the graph model

**What it does:** Defines the graph through domain meaning and operations rather than beginning with a library API.

```text
Design this feature around its domain graph.

For every graph element, answer:

- What domain concept does it represent?
- Is it a vertex, edge, attribute, or derived value?
- What gives it identity?
- Who owns it?
- Can it change?
- Can it be deleted?
- Which invariants constrain it?
- Which operations read it?
- Which operations mutate it?
- Which callers should not know the storage representation?

Then define:

- Directed or undirected
- Weighted or unweighted
- Simple graph or multigraph
- Cyclic or acyclic
- Connected or disconnected
- Static or dynamic
- Sparse or dense
- Semantic data versus visual-layout data

Do not select an algorithm until the graph model and required operations are
clear.
```

---

## 8. Ask for two designs

**What it does:** Forces a real alternative between a simple codebase-compatible approach and a graph-optimized approach.

```text
Design this feature in two substantially different ways.

Design A should use the simplest representation and algorithms that fit the
current codebase and expected workload.

Design B should optimize the most important graph operations or likely scale,
even if it requires a more explicit graph abstraction or derived index.

For each design, compare:

- Domain clarity
- Graph representation
- Persistence complexity
- Query complexity
- Mutation complexity
- Invariant enforcement
- Algorithm correctness
- Time complexity
- Space complexity
- Behavior on cycles and disconnected graphs
- Compatibility with the current codebase
- Testing difficulty
- Migration risk
- Observability
- Long-term maintenance cost

Recommend one, but explain what workload or requirement would change the
recommendation.
```

---

## 9. Detect overengineering before coding

**What it does:** Reviews a proposed plan for unnecessary graph machinery, algorithm sophistication, or speculative scale.

```text
Review this proposed graph-feature plan for overengineering.

Look for:

- A graph library when a map and traversal would suffice
- A graph database without a demonstrated query need
- Generic graph abstractions with one domain use
- Support for weighted edges when the domain has no weights
- Multigraph support without duplicate relationships
- Dynamic algorithms for mostly static data
- Precomputed reachability for a small graph
- All-pairs shortest paths for a few point queries
- A* without a valid heuristic
- Dijkstra for unweighted edges
- Union-find where deletions must be supported
- Distributed graph processing for a local workload
- Visual-layout concerns mixed into the domain model
- Plugin systems for hypothetical algorithms
- Caches with no invalidation or rebuild plan

For each abstraction or algorithm, state:

- What requirement it satisfies
- What complexity it introduces
- What simpler alternative exists
- What would happen if it were removed
- Whether it should be kept, simplified, replaced, or deferred
```

---

## 10. Probe the design with future changes

**What it does:** Stress-tests the representation and algorithm against plausible changes before implementation begins.

```text
Probe this graph design with the following future changes:

1. Add a new vertex type.
2. Add a new edge type.
3. Allow multiple edges between two vertices.
4. Introduce weighted edges.
5. Allow or forbid cycles.
6. Add path explanation to the UI.
7. Support deletion of vertices with many edges.
8. Add a second caller with different query needs.
9. Increase the graph to 10× and 100× its expected size.
10. Replace the persistence or visualization library.

For each change, identify:

- Data-model changes
- Representation changes
- Algorithm changes
- Invariants affected
- Files or modules likely to change
- Tests likely to change
- Migration needs
- Complexity impact
- Whether the current design contains or spreads the change

Use the results to identify premature specialization, weak boundaries, and
algorithm choices tied too closely to current assumptions.
```

---

## 11. Convert the plan into vertical slices

**What it does:** Converts the selected graph design into end-to-end behaviors rather than implementing the entire graph engine first.

```text
Convert the selected graph-feature design into independently testable vertical
slices.

For each slice, include:

- User-visible outcome
- Graph entities involved
- Graph operation
- Invariant enforced
- Algorithm used
- Persistence change
- API or interface change
- UI or system feedback
- Tests
- Observability
- Risks
- Completion signal

Order the slices so that:

1. The graph model is introduced only as needed.
2. The first slice proves one useful end-to-end behavior.
3. Invariants are enforced before advanced queries depend on them.
4. Simple traversals come before speculative optimization.
5. Performance work follows evidence from realistic fixtures or benchmarks.
6. Migration and rollback remain safe at every step.

Avoid phases such as:

- Build graph engine
- Build all algorithms
- Build backend
- Build frontend
- Add tests

Prefer slices such as:

- Create one valid relationship and display it
- Reject a relationship that creates a cycle
- Return direct neighbors
- Return a reachable path with an explanation
- Support deletion while preserving graph invariants
```

---

## Planning questions — mental checklist

```text
Is this problem genuinely a graph?

What are the vertices?

What are the edges?

What does edge direction mean?

Are weights real domain values or algorithmic convenience?

Are duplicate edges allowed?

Are self-loops allowed?

Are cycles valid?

Can the graph be disconnected?

What is the source of truth?

Which mutations are allowed?

Which invariants must survive every mutation?

Does the feature need reachability, traversal, ordering, shortest path,
connectivity, ranking, matching, or flow?

Does the algorithm's precondition match the graph?

Can a simpler algorithm solve the requirement?

What are V and E at expected scale?

Is the graph sparse or dense?

What is the worst-case shape?

How are results explained to users?

How will the graph be tested with small fixtures?

What future change would invalidate this representation or algorithm?
```

---

## Workflow summary

```text
Understand behavior
    ↓
Decide whether the problem is graph-shaped
    ↓
Define vertices, edges, and semantics
    ↓
Define graph invariants
    ↓
List required mutations and queries
    ↓
Investigate existing representations
    ↓
Choose candidate algorithms
    ↓
Compare simple and optimized designs
    ↓
Probe edge cases and scale
    ↓
Choose the simplest correct design
    ↓
Implement in vertical slices
    ↓
Verify invariants, complexity, and rollout
```

---

## Algorithm-selection rule

Never begin with:

```text
We should use Dijkstra's algorithm.
```

Begin with:

```text
The user needs the minimum-total-cost route between two vertices.

Edges have nonnegative weights representing cost.

The graph may contain cycles and disconnected components.

This supports Dijkstra's algorithm for point-to-point shortest-path queries.
```

Likewise:

```text
Unweighted shortest path        → breadth-first search

Reachability or traversal       → BFS or DFS

Dependency ordering             → topological sort

Cycle detection in directed DAG → DFS coloring or Kahn's algorithm

Dynamic connectivity with adds  → union-find may fit

Negative edge weights           → Dijkstra does not fit

All-pairs shortest paths        → justify against repeated query volume

Heuristic pathfinding           → A* requires an admissible/useful heuristic
```

The algorithm name is the conclusion, not the starting point.

---

## Final feature-planning principle

The goal is not to ask:

```text
Which graph algorithm can we use?
```

The better sequence is:

```text
What user question must the feature answer?
What domain relationships exist?
Is a graph the clearest model?
What are the exact graph semantics?
Which invariants must hold?
What operation answers the user question?
Which algorithm satisfies that operation's preconditions?
What does it cost in time, space, and maintenance?
What breaks when the graph changes or grows?
```

Graph algorithms should make the required behavior correct and explainable—not make the architecture look more sophisticated.
