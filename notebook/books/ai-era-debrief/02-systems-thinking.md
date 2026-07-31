[← Contents](README.md)

# 2. Develop Systems Thinking

* [ ] **Define the actual user problem.**\
  Describe the user’s desired outcome before thinking about frameworks, models, or implementation details.\
  **Example:** The problem is not “build a graph UI”; it is “help learners understand what to study next and why.”

* [ ] **Identify the system boundaries.**\
  Decide what your application owns and what responsibilities belong to external systems or services.\
  **Example:** Your app may own skill relationships and progress, while authentication is delegated to an identity provider.

* [ ] **Map the full data and request flow.**\
  Trace what happens from the moment a user performs an action until the final result appears.\
  **Example:** User adds a prerequisite → frontend validates input → API receives request → server checks authorization → database saves edge → cache is invalidated → graph rerenders.

* [ ] **Identify components, services, databases, APIs, and external dependencies.**\
  Create a clear inventory of the moving parts so hidden dependencies do not surprise you later.\
  **Example:** The Claude plugin may depend on a CLI command, code parser, prompt builder, Claude API, output validator, and Markdown writer.

* [ ] **Define important invariants and business rules.**\
  Identify conditions that must always remain true regardless of which interface or service modifies the data.\
  **Example:** A deleted skill cannot remain referenced as another skill’s prerequisite.

* [ ] **Consider failure modes and unusual inputs.**\
  Think about how the system behaves when data is missing, malformed, duplicated, delayed, or partially processed.\
  **Example:** The study generator should handle a repository containing no tests, an unsupported language, or a file too large for the model context.

* [ ] **Consider security, performance, scalability, and maintainability.**\
  Evaluate more than whether the feature works during a successful local demonstration.\
  **Example:** A graph traversal that is acceptable for 100 skills may freeze the browser when the graph reaches 100,000 nodes.

* [ ] **Decide what belongs in the client, server, database, or background worker.**\
  Place responsibilities according to trust, cost, latency, persistence, and resource requirements.\
  **Example:** Dragging nodes belongs in the client, authorization belongs on the server, relationships belong in the database, and long AI generation belongs in a worker.

* [ ] **Sketch at least one alternative design before committing.**\
  Comparing alternatives reveals trade-offs that are easy to overlook when accepting the first AI-generated solution.\
  **Example:** Compare storing graph edges in PostgreSQL tables with using a dedicated graph database before choosing either approach.

---

[← 1. CS fundamentals](01-cs-fundamentals.md) · [Contents](README.md) · [3. AI as a tool →](03-ai-as-a-tool.md)
