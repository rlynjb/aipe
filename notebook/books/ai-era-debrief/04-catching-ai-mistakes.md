[← Contents](README.md)

# 4. Practice Catching AI Mistakes

* [ ] **Check whether the implementation is logically correct.**\
  Walk through the code using small examples and confirm that its output matches the intended behavior.\
  **Example:** Test whether adding `A → B`, `B → C`, and `C → A` is correctly identified as a cycle.

* [ ] **Check for missing edge cases.**\
  Identify inputs outside the ordinary happy path and make their expected behavior explicit.\
  **Example:** Test an empty graph, one isolated node, duplicate edges, disconnected components, and a very deep prerequisite chain.

* [ ] **Check whether the types are accurate.**\
  Types should represent domain guarantees rather than merely silence compiler errors.\
  **Example:** Use separate `SkillId` and `UserId` types or branded strings so they cannot be accidentally mixed.

* [ ] **Check whether errors are handled meaningfully.**\
  Errors should be translated into information that developers, users, or monitoring systems can act upon.\
  **Example:** Return “This prerequisite creates a cycle” rather than a generic “500 Internal Server Error.”

* [ ] **Check whether asynchronous operations are safe.**\
  Understand ordering, cancellation, retries, and what happens when multiple operations overlap.\
  **Example:** Cancel an outdated graph-search request when the user immediately enters a different search term.

* [ ] **Check for race conditions.**\
  Consider whether concurrent actions can read or write inconsistent state.\
  **Example:** Two users may simultaneously add edges that are individually valid but create a cycle when combined.

* [ ] **Validate user input.**\
  Assume client-side input can be bypassed and enforce critical rules at the trusted boundary.\
  **Example:** Validate skill IDs and prerequisite relationships on the server even when the UI already disables invalid selections.

* [ ] **Separate authentication from authorization.**\
  Knowing who the user is does not automatically mean they have permission to perform every action.\
  **Example:** A signed-in learner may view a curriculum but should not be able to rewrite its prerequisite graph.

* [ ] **Protect secrets and private data.**\
  Check logs, browser bundles, error messages, environment variables, and prompts for accidental exposure.\
  **Example:** Never send the Claude API key to client-side code or include private repository content in analytics logs.

* [ ] **Use database transactions where necessary.**\
  Related database changes should succeed or fail together when partial completion would violate system rules.\
  **Example:** Creating a skill and its initial prerequisite edges should roll back if one of the edges is invalid.

* [ ] **Inspect query cost.**\
  Confirm that database operations will remain efficient as the dataset grows.\
  **Example:** Avoid fetching the complete skill graph when the user only needs one node and its direct prerequisites.

* [ ] **Look for tight coupling.**\
  Modules should not know unnecessary implementation details about one another.\
  **Example:** The graph traversal module should accept graph data rather than directly importing PostgreSQL and React Flow.

* [ ] **Evaluate whether abstractions are useful.**\
  An abstraction should hide complexity, stabilize a boundary, or enable meaningful variation.\
  **Example:** A `GraphRepository` interface is useful when you genuinely support multiple storage systems, not merely because interfaces look architectural.

* [ ] **Test behavior rather than internal implementation.**\
  Tests should remain valid when the code is refactored without changing externally observable results.\
  **Example:** Test that the API rejects a cycle instead of asserting that a specific private DFS helper was called.

* [ ] **Consider much larger usage.**\
  Estimate how memory, latency, database load, model cost, and user experience change with scale.\
  **Example:** Determine whether loading 100,000 graph nodes into the browser is acceptable or whether the app needs progressive loading.

---

[← 3. AI as a tool](03-ai-as-a-tool.md) · [Contents](README.md) · [5. Explain every decision →](05-explain-every-decision.md)
