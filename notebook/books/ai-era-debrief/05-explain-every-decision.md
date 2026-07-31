[← Contents](README.md)

# 5. Be Able to Explain Every Decision

* [ ] **Explain what problem the feature solves.**\
  Start with the user or business need rather than immediately describing technical components.\
  **Example:** “Prerequisite validation prevents curriculum authors from creating learning paths that students cannot complete.”

* [ ] **Explain how data moves through the system.**\
  Describe the complete path across the frontend, network, server, storage, and supporting services.\
  **Example:** Explain how an uploaded repository becomes parsed code metadata, model prompts, validated study sections, and a saved Markdown file.

* [ ] **Explain why I chose the architecture.**\
  Connect the architecture to specific constraints instead of calling it a general best practice.\
  **Example:** “I used a background worker because generation takes 30 seconds and should not hold an HTTP request open.”

* [ ] **Explain why I chose the data structure.**\
  Describe how the required operations match the selected structure.\
  **Example:** “I used an adjacency list because the skill graph is sparse and we frequently traverse outgoing edges.”

* [ ] **Explain the alternatives I rejected.**\
  Show that the decision came from comparison rather than habit or AI preference.\
  **Example:** “I rejected an adjacency matrix because it would allocate space for relationships that rarely exist.”

* [ ] **Explain the trade-offs I accepted.**\
  Every design improves some qualities while making others harder, slower, or more expensive.\
  **Example:** “Using PostgreSQL keeps operations simple, but complex graph queries may be less expressive than in a graph database.”

* [ ] **Explain the implementation’s assumptions.**\
  Hidden assumptions can become bugs when the product or dataset changes.\
  **Example:** The recommendation algorithm may assume all prerequisite edges have equal learning cost.

* [ ] **Explain where the system is most likely to fail.**\
  Identify the weakest boundaries, uncertain dependencies, and resource limits.\
  **Example:** Large repositories may exceed the model context window or produce incomplete study coverage.

* [ ] **Explain time and space complexity.**\
  Give an approximate analysis of the main algorithm rather than claiming the entire application has one complexity.\
  **Example:** DFS cycle detection takes approximately `O(V + E)` time and `O(V)` additional space.

* [ ] **Explain how I would test it.**\
  Cover unit behavior, integration boundaries, failure paths, and realistic end-to-end usage.\
  **Example:** Unit-test graph traversal, integration-test database validation, and end-to-end test the visual error shown after creating a cycle.

* [ ] **Explain how I would redesign it for 10× or 100× usage.**\
  Identify which assumptions stop working and what architectural changes become necessary.\
  **Example:** Replace full-graph loading with server-side filtering, pagination, clustering, and incremental rendering.

* [ ] **Explain where AI was used and how I verified it.**\
  Be transparent about assistance while demonstrating that you retained engineering responsibility.\
  **Example:** “Claude generated the first DFS implementation; I traced it manually, added cycle fixtures, found a state-reset bug, and corrected it.”

---

[← 4. Catching AI mistakes](04-catching-ai-mistakes.md) · [Contents](README.md) · [6. Problem-solving →](06-problem-solving.md)
