# Chapter 1.4 — Graphs

**IK Section I, Module 4.** Reading time: 22 minutes.

> Graphs are trees with the rules broken. Trees forbid cycles and assume a root; graphs allow both, which is why graph algorithms always carry a `visited` set and graph problems start with "how is the input represented?"

## The 7 Bridges of Königsberg

IK opens this module with Euler's 1736 problem because it's the perfect framing. Königsberg had seven bridges; the question was whether you could walk all seven exactly once and return to start. Euler proved you couldn't, and in doing so, invented graph theory.

The lesson: **before solving a problem, model it as a graph.** The bridges become edges, the landmasses become vertices, and the question becomes "is there a path that uses every edge exactly once?" (an Eulerian circuit). Once the model is right, the algorithm is mechanical.

The skill being tested in graph interviews isn't usually the algorithm. It's the modeling — turning the problem statement into nodes and edges.

## Graph definitions

```
Graph G = (V, E)
  V = set of vertices (nodes)
  E = set of edges (pairs of vertices)

Directed graph: edges have direction (u → v ≠ v → u)
Undirected graph: edges are bidirectional

Weighted graph: each edge has a weight (cost, distance, capacity)

Cycle: a path that starts and ends at the same vertex
DAG: directed acyclic graph (no cycles)
Tree: connected DAG with N-1 edges for N vertices
```

The bridge from the data center: the network topology you've worked with is a graph. Routers are nodes; links are edges. BGP routing is shortest-path on this graph. Spanning Tree Protocol literally builds a spanning tree over the L2 graph. You've already used graph algorithms for years; the IK module is naming them.

## Graph storage

Three representations. Each has a place.

```
Adjacency List

  graph = {
    A: [B, C, D],
    B: [A, E],
    C: [A, E, F],
    ...
  }

  Space:    O(V + E)
  Edge query (does A→B exist?): O(degree of A)
  Iterating A's neighbors: O(degree of A)

  Best when: sparse graphs (most pairs of vertices don't have edges)
  Used in:   most interview problems

Adjacency Matrix

  graph = [[0, 1, 1, 1, 0],   ← row A: edges to B, C, D
           [1, 0, 0, 0, 1],   ← row B: edges to A, E
           ...]

  Space:    O(V²)
  Edge query: O(1)
  Iterating A's neighbors: O(V)

  Best when: dense graphs (most pairs have edges)
  Used in:   weighted graph algorithms (Floyd-Warshall),
             graphs small enough that V² fits in memory

Edge List

  graph = [(A, B), (A, C), (A, D), (B, E), (C, E), (C, F), ...]

  Space:    O(E)
  Edge query: O(E)
  Iterating A's neighbors: O(E)

  Best when: you're going to sort the edges (Kruskal's MST),
             or when E is the primary thing you operate on
```

The default: adjacency list, hash map of vertex → list of neighbors. Use it unless the problem specifically calls for dense access patterns or edge-sorted operations.

## BFS for graphs

The shape is identical to BFS for trees, but with one critical addition: the **visited set**. Without it, cycles cause infinite loops.

```
function bfs(start):
    visited = set()
    queue = [start]
    visited.add(start)

    while queue is not empty:
        node = queue.dequeue()
        process(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)        ← mark BEFORE enqueue
                queue.enqueue(neighbor)
```

**Mark visited when you enqueue, not when you dequeue.** If you mark when you dequeue, the same node can get enqueued multiple times before any of those copies are dequeued. Subtle bug. Real interview screen-out.

BFS in graphs computes **shortest path in unweighted graphs**. Each level of the BFS is one edge further from the start, so the first time you reach a target node is via the shortest path. This is one of the most-used facts in graph interview questions.

## DFS for graphs

Same shape as tree DFS, plus visited set. Both recursive and iterative forms are common in interviews.

```
function dfs(start):
    visited = set()
    dfs_helper(start, visited)

function dfs_helper(node, visited):
    if node in visited: return
    visited.add(node)
    process(node)
    for neighbor in graph[node]:
        dfs_helper(neighbor, visited)
```

DFS doesn't compute shortest paths but **it's the right tool for cycle detection, topological sort, strongly connected components**, and most "explore connected component" problems.

```
function has_cycle(graph):
    visited = set()
    in_stack = set()                ← tracks current DFS path
    for start in graph:
        if start not in visited:
            if dfs_cycle(start, visited, in_stack):
                return true
    return false

function dfs_cycle(node, visited, in_stack):
    visited.add(node)
    in_stack.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            if dfs_cycle(neighbor, visited, in_stack): return true
        elif neighbor in in_stack:
            return true             ← back edge: cycle!
    in_stack.remove(node)
    return false
```

The `in_stack` trick: a node is "in the stack" while we're still processing its descendants. If we encounter an in-stack node, that's a **back edge** — a cycle.

## DFS stack-based iterative form

Useful when recursion depth would overflow:

```
function dfs_iterative(start):
    visited = set()
    stack = [start]
    visited.add(start)

    while stack is not empty:
        node = stack.pop()
        process(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                stack.push(neighbor)
```

Note that this gives you a slightly different traversal order than recursive DFS (last neighbor pushed is popped first), but for most problems it doesn't matter.

## The general graph problem template

Almost every graph interview problem fits this template:

```
1. Parse the input into a graph representation (usually adjacency list).
2. Identify the question type:
   - Reachability:        "can you get from A to B?"           → BFS or DFS
   - Shortest path:       "fewest edges from A to B?"          → BFS (unweighted)
                          "minimum cost from A to B?"          → Dijkstra (weighted, non-neg)
                          "with negative edges?"               → Bellman-Ford
                          "all pairs shortest?"                → Floyd-Warshall
   - Connectivity:        "how many connected components?"      → DFS, count
                          "are two nodes connected?"            → Union-find
   - Cycle detection:     "is there a cycle?"                   → DFS with in-stack
   - Ordering:            "valid topological order?"            → Topological sort (DFS or Kahn's)
   - Spanning tree:       "minimum-cost spanning tree?"         → Kruskal's or Prim's
   - Flow:                "maximum flow from source to sink?"   → Max-flow (Ford-Fulkerson)
3. Apply the appropriate algorithm.
4. Return the answer.
```

The "identify the question type" step is the hard part. Most interview problems disguise themselves as graph problems through clever wording. "Word ladder" is shortest path. "Course schedule" is cycle detection or topological sort. "Number of islands" is connected components.

## Common graph interview problems

```
Reachability / connectivity:
  Number of islands                            (DFS on grid, count starts)
  Number of connected components               (DFS, count unvisited starts)
  Clone graph                                  (BFS or DFS with map of clones)

Shortest path:
  Word ladder                                  (BFS on word transitions)
  Shortest path in binary matrix               (BFS with diagonals allowed)
  Network delay time                           (Dijkstra)

Cycle / ordering:
  Course schedule (is order possible?)         (Cycle detection via DFS)
  Course schedule II (find order)              (Topological sort)
  Alien dictionary                             (Topological sort)

Grid as graph:
  Rotting oranges                              (Multi-source BFS)
  Walls and gates                              (Multi-source BFS)
  Pacific Atlantic water flow                  (DFS from each boundary)

Union-find:
  Number of provinces                          (Union all connected pairs)
  Redundant connection                         (Union-find, detect first cycle)
  Accounts merge                               (Group by shared email)
```

For the union-find category, learn the algorithm. It's separately useful and FAANG asks about it.

```
Union-find (Disjoint Set Union):

  parent = [i for i in 0..n]
  rank = [0] * n

  function find(x):
      if parent[x] != x:
          parent[x] = find(parent[x])    ← path compression
      return parent[x]

  function union(x, y):
      px, py = find(x), find(y)
      if px == py: return
      if rank[px] < rank[py]:
          parent[px] = py
      else if rank[px] > rank[py]:
          parent[py] = px
      else:
          parent[py] = px
          rank[px] += 1
```

Path compression + union by rank gives effectively O(1) per operation (technically inverse Ackermann, but at interview level, O(1)).

## How interviewers probe graph questions

Three layers:

1. **Surface:** "Implement BFS." Trivial. Confirms you know the queue + visited pattern.
2. **Standard:** "Number of islands." Tests whether you see the grid as an implicit graph.
3. **Twist:** "Word ladder where one transformation costs 1 and certain transformations cost 2." Tests whether you upgrade from BFS to Dijkstra when edge weights appear.

The twist layer is where senior signal lives. The interviewer is checking whether you have the *catalog* of graph algorithms (BFS / DFS / Dijkstra / Bellman-Ford / Floyd-Warshall / Kruskal / topological sort / union-find / max-flow) and can reach for the right one without panicking.

## A note on the frontend graph

You've worked with route graphs in React Router (nested routes form a tree, but cross-route navigation forms a DAG). You've worked with component dependency graphs (which component imports which). You've debugged a circular import. You've thought about "if I change this component, what re-renders?" — that's a reverse dependency walk.

The IK module is making those instincts explicit. You'll learn to model arbitrary problems as graphs and apply the right algorithm. The modeling skill transfers to ML: machine learning systems are graphs of data flow.

## The Interview Move

> *"Let me model this as a graph first. The nodes are X, the edges are Y, weighted/unweighted, directed/undirected. The question is asking for shortest path, so I'll reach for BFS if it's unweighted, Dijkstra if weighted non-negative. I'll represent the graph as an adjacency list because the input is sparse. Visited set on enqueue, not dequeue. Let me write the BFS."*

That's the FAANG-bar answer. Model first, identify the question type, choose the algorithm, implement with the standard guardrails. The interviewer can probe any of those four steps; you have an answer ready for each.

Next chapter: dynamic programming. The hardest of the five, and the one that separates mid from senior.
