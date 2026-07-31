[← Contents](README.md)

# 6. Improve Problem-Solving Ability

* [ ] **Restate the problem before writing code.**\
  Rewrite the request in precise terms to expose ambiguity and prevent premature implementation.\
  **Example:** “Given a proposed directed edge, determine whether adding it would create a path back to the source node.”

* [ ] **Separate requirements from implementations.**\
  Distinguish what the system must accomplish from one particular way of accomplishing it.\
  **Example:** “Generate a valid study order” is a requirement; “use Kahn’s algorithm” is an implementation choice.

* [ ] **Create a small example manually.**\
  Solve a tiny instance yourself before trusting code or AI output.\
  **Example:** Draw five skill nodes and manually determine the expected topological order before running the implementation.

* [ ] **Identify inputs, outputs, constraints, and invariants.**\
  Define the problem contract so the implementation can be evaluated objectively.\
  **Example:** Input: nodes and directed edges; output: valid order or cycle error; invariant: every edge references an existing node.

* [ ] **Decompose the problem into independently testable parts.**\
  Divide the solution along clear responsibilities rather than creating one large function.\
  **Example:** Separate graph construction, edge validation, cycle detection, persistence, and UI feedback.

* [ ] **Choose the simplest correct solution first.**\
  Avoid optimizing or generalizing before the basic behavior is correct and understood.\
  **Example:** Start with an adjacency list and DFS before introducing distributed graph processing.

* [ ] **Measure before optimizing.**\
  Use profiling, logs, traces, or benchmarks to identify the real bottleneck.\
  **Example:** Confirm whether graph layout, database retrieval, or React rendering causes the delay before rewriting the algorithm.

* [ ] **Compare the result against a known-good example.**\
  Use manually verified fixtures, reference implementations, or established tools to detect subtle errors.\
  **Example:** Compare your topological-sort results with a small graph whose valid orders you already know.

* [ ] **Debug from evidence rather than guessing.**\
  Gather logs, reproduction steps, state snapshots, and failing inputs before changing code.\
  **Example:** Log the recursion stack and visited nodes to understand why cycle detection incorrectly rejects a valid graph.

* [ ] **Record why the bug occurred, not only how it was fixed.**\
  Capture the incorrect assumption or missing safeguard so the lesson transfers to future work.\
  **Example:** “The bug occurred because traversal state was shared between requests rather than initialized per operation.”

---

[← 5. Explain every decision](05-explain-every-decision.md) · [Contents](README.md) · [7. Agentic systems →](07-agentic-systems.md)
