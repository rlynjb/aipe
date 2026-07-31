[← Contents](README.md)

# 10. Weekly Practice Loop

* [ ] **Learn one fundamental relevant to the current feature.**
  Choose the concept based on immediate product work so learning and implementation reinforce one another.
  **Example:** Study topological sorting during the week you implement curriculum ordering.

* [ ] **Implement or inspect it in a real application.**
  Find the concept in production-style code rather than stopping after reading or watching a tutorial.
  **Example:** Inspect how your graph service constructs indegree counts for Kahn’s algorithm.

* [ ] **Let AI propose an implementation.**
  Use AI to expose yourself to possible approaches without treating the proposal as automatically correct.
  **Example:** Ask Claude for both DFS-based and Kahn-based topological sorting implementations.

* [ ] **Review the proposal for correctness and complexity.**
  Walk through examples, check assumptions, and estimate runtime and memory use.
  **Example:** Verify that the algorithm returns an error when the processed node count is smaller than the total node count.

* [ ] **Write normal, edge, and failure tests.**
  Test ordinary behavior, boundary conditions, malformed inputs, and external failures.
  **Example:** Test a valid DAG, empty graph, duplicate edge, self-loop, cycle, and missing node reference.

* [ ] **Explain the completed feature in my own words.**
  Summarize the problem, solution, algorithm, data flow, trade-offs, and weaknesses without reading the AI conversation.
  **Example:** Record a short voice explanation of how the application detects prerequisite cycles.

* [ ] **Document one architectural decision and its trade-offs.**
  Build a habit of making engineering reasoning visible and reusable.
  **Example:** Record why traversal runs in the API service rather than the React client.

* [ ] **Add the lesson to the Claude study plugin.**
  Turn the new concept into reusable questions, exercises, and explanations.
  **Example:** Add a generator that creates topological-sorting questions from the current codebase.

* [ ] **Rebuild one small part without copying the generated answer.**
  Reimplementation exposes whether you understand the logic or merely recognize the final code.
  **Example:** Write a basic BFS traversal from a blank file after reviewing the production implementation.

* [ ] **Record what I can now explain that I could not explain last week.**
  Track capability growth rather than measuring progress only through features shipped.
  **Example:** “I can now explain why a skill tree is usually a DAG rather than a traditional tree.”

---

[← 9. Proof of ability](09-proof-of-ability.md) · [Contents](README.md) · [Priority order →](11-priority-order.md)
