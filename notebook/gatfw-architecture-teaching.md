# Graph Algorithms Architecture-Teaching Prompt Library

Quick-reference for learning graph-shaped parts of an application using *Graph Algorithms the Fun Way*. These prompts teach the architecture from domain relationships to graph representation, traversal, algorithms, complexity, and the product behavior those algorithms enable.

The goal is to move from:

```text
The application has nodes and edges.
```

to:

```text
I understand what those nodes and edges mean,
which questions the graph answers,
why each algorithm fits,
and what its complexity means for the application.
```

---

## Index

| #  | Prompt                    | What it teaches                    | Reach for it when         |
| -- | ------------------------- | ---------------------------------- | ------------------------- |
| 1  | **Compact daily**         | Complete graph architecture lesson | Default                   |
| 2  | **Master**                | Deep graph/algorithm walkthrough   | Graph-heavy feature       |
| 3  | **Graph model**           | Vertices, edges, semantics         | First orientation         |
| 4  | **Representation**        | How graph exists in memory/storage | Data structure learning   |
| 5  | **Traversal trace**       | Algorithm execution step-by-step   | BFS/DFS/etc.              |
| 6  | **Algorithm map**         | Requirement → algorithm            | Multiple graph operations |
| 7  | **Invariant map**         | Structural guarantees              | Mutating graphs           |
| 8  | **Complexity**            | V/E and scaling behavior           | Performance learning      |
| 9  | **Mutation architecture** | Add/delete/change relationships    | Dynamic graphs            |
| 10 | **Alternative algorithm** | Why this algorithm was chosen      | Understanding trade-offs  |
| 11 | **Teach from scratch**    | Derive algorithm from requirement  | Deepest learning exercise |
| 12 | **Quiz me**               | Active recall                      | After studying            |

---

## Recommended learning sequence

```text
User problem
 ↓
Domain relationships
 ↓
Graph suitability
 ↓
Vertices + edges
 ↓
Representation
 ↓
Required operations
 ↓
Algorithm
 ↓
Execution trace
 ↓
Complexity
 ↓
Trade-offs
```

---

## 1. Compact daily prompt

```text
Teach me the graph architecture of this application using concepts from
Graph Algorithms the Fun Way.

Do not begin with algorithm names.

Explain:

1. What user problem requires relationships between entities.
2. Whether the problem is genuinely graph-shaped.
3. What the vertices represent.
4. What the edges represent.
5. Direction, weights, cycles, and connectivity.
6. How the graph is represented in code.
7. How it is persisted.
8. Important graph invariants.
9. Graph operations the application needs.
10. Algorithms implementing those operations.
11. Why each algorithm fits.
12. Time and space complexity.
13. Important edge cases.
14. What happens as the graph grows.

For every algorithm point to concrete files and symbols.

Finish with:

- ASCII graph architecture
- Graph model
- Algorithm map
- Complexity table
- 5 files to study
- 5 graph concepts
- 5 questions testing my understanding
```

---

## 2. Master architecture-teaching prompt

```text
Teach me the graph architecture of this application using concepts from
Graph Algorithms the Fun Way.

Assume I want to understand it well enough to rebuild the graph functionality
without copying the implementation.

## 1. Start with the product problem

Explain what user questions or behaviors require relationships.

Do not assume a graph is necessary.

## 2. Graph suitability

Compare the current graph model with:

- List
- Map
- Set
- Tree
- Relational joins
- Hierarchical model

Explain why a graph is or is not useful.

## 3. Domain graph

Define:

- Vertex meaning
- Vertex identity
- Vertex attributes
- Edge meaning
- Edge identity
- Direction
- Weight
- Self-loops
- Duplicate edges
- Cycles
- Connectivity
- Sparse/dense characteristics

## 4. Representation

Explain the actual representation:

- Adjacency list
- Adjacency matrix
- Edge list
- Maps/sets
- Database relationships
- Graph library
- Derived graph

Show the relevant types and files.

## 5. Graph ownership

Explain:

- Source of truth
- Who creates vertices
- Who creates edges
- Who mutates the graph
- Who validates mutations
- Who queries it

## 6. Invariants

Identify structural guarantees.

Examples:

- No dangling edges
- No duplicate edges
- DAG remains acyclic
- Tenant boundaries
- Valid weights
- Unique vertices

Show where each is enforced.

## 7. Required operations

Map product behavior to:

- Neighbor lookup
- Reachability
- Traversal
- Path finding
- Shortest path
- Cycle detection
- Topological ordering
- Connected components
- Ranking
- Matching
- Flow

## 8. Algorithm selection

For each operation explain:

Requirement
→ graph property
→ algorithm preconditions
→ selected algorithm

Only then name the algorithm.

## 9. Algorithm trace

For important algorithms, walk through a tiny graph by hand.

Show:

- Initial state
- Frontier/queue/stack
- Visited state
- Current vertex
- Decisions
- Termination
- Result

Then map each conceptual step to the implementation.

## 10. Complexity

For every important operation explain:

- V
- E
- Time complexity
- Space complexity
- Expected graph shape
- Worst-case graph shape

Explain what the Big-O means for this actual product.

## 11. Mutations

Teach what happens when:

- Vertex added
- Vertex removed
- Edge added
- Edge removed
- Weight changed

Explain invariant maintenance and derived-data updates.

## 12. Edge cases

Simulate:

- Empty graph
- One vertex
- Disconnected graph
- Cycle
- Self-loop
- Duplicate edge
- Very deep graph
- Very wide graph
- High-degree vertex

## 13. Alternatives

For each major algorithm identify:

- Simpler alternative
- More sophisticated alternative
- Why current choice fits
- Requirement that would force a different algorithm

## 14. Learning summary

Return:

- Domain graph
- Architecture diagram
- Representation map
- Algorithm map
- Invariant map
- Complexity table
- 5 files to study
- 5 concepts
- 10 interview questions
```

---

## 3. Graph model

```text
Teach me the domain graph before discussing algorithms.

Identify:

Vertices
Edges
Direction
Weights
Cycles
Connectivity
Identity
Attributes

For every element explain what it means in the product.

Separate:

Domain graph
Storage representation
Visual representation

Do not confuse screen coordinates with graph semantics.
```

---

## 4. Representation

```text
Teach me how this graph is represented internally.

Show:

Domain relationship
→ TypeScript/classes/types
→ in-memory structure
→ persistence representation

Determine whether it uses:

- Adjacency list
- Adjacency matrix
- Edge list
- Maps/sets
- Relational tables
- Graph database
- Library-specific structure

Explain the read, write, memory, and traversal trade-offs.
```

---

## 5. Traversal trace

```text
Teach me this graph operation step by step:

[operation]

Use a tiny example graph.

At every iteration show:

Current vertex
Frontier
Visited
Decision
Next state

Then map those conceptual steps to the actual implementation.

Do not skip directly to the result.
```

---

## 6. Algorithm map

```text
Create an algorithm map for this application.

For each user behavior show:

User requirement
→ graph question
→ graph operation
→ algorithm
→ preconditions
→ complexity

Examples of questions:

Can A reach B?
What is closest to A?
Does adding this edge create a cycle?
What order satisfies all dependencies?
Which nodes belong together?

Explain why each algorithm matches the question.
```

---

## 7. Invariant map

```text
Teach me the graph invariants.

For each invariant show:

Invariant
→ mutation that threatens it
→ detection algorithm
→ enforcement location
→ failure behavior
→ test

Explain which guarantees are structural and which require traversal.
```

---

## 8. Complexity

```text
Teach me the complexity of this graph feature in practical terms.

Define V and E for this application.

For each important operation show:

Algorithm
Time complexity
Space complexity
Expected workload
Worst case

Then estimate what happens when:

V becomes 10× larger
E becomes 10× larger
The graph becomes dense
One node becomes extremely high-degree

Do not give Big-O without explaining its product consequence.
```

---

## 9. Mutation architecture

```text
Teach me what happens when the graph changes.

Trace:

Add vertex
Add edge
Remove edge
Remove vertex

For each show:

Validation
Invariant checks
Storage mutation
Derived-state updates
Cache/index updates
UI synchronization

Explain which operations require traversal and why.
```

---

## 10. Alternative algorithm

```text
Pick one important graph algorithm in this application.

Explain:

1. The exact problem it solves.
2. Graph properties it relies on.
3. Why the current algorithm works.
4. A simpler alternative.
5. A more sophisticated alternative.
6. Their time/space complexity.
7. What requirement would make me switch.

Do not evaluate algorithms independently of the product workload.
```

---

## 11. Teach from scratch

```text
Pretend I need to rebuild this graph feature from requirements alone.

Do not tell me the existing algorithm initially.

Walk me through:

User question
→ domain relationships
→ graph model
→ required operation
→ correctness requirements
→ graph properties
→ candidate algorithms
→ complexity
→ selected algorithm

Only afterward compare our derived design with the actual implementation.

Explain differences and trade-offs.
```

---

## 12. Quiz me

```text
Quiz me one question at a time.

Progress through:

1. Domain graph
2. Vertices and edges
3. Direction and weights
4. Representation
5. Invariants
6. Traversal
7. Algorithm selection
8. Complexity
9. Edge cases
10. Design changes

Eventually give me new requirements and ask me to choose an algorithm and
justify it.

Do not accept an algorithm name without asking why its preconditions fit.
```

---

## Final teaching principle

Never teach:

```text
This feature uses BFS.
```

Teach:

```text
The user needs the fewest-hop path.

Each edge has equal cost.

Therefore the search explores vertices by increasing distance from the source.

That requirement and graph property lead us to BFS.
```

The learning sequence should always be:

```text
Product question
→ graph model
→ required operation
→ algorithm properties
→ algorithm
→ complexity
```

The algorithm is the consequence of understanding the problem—not the starting point.
