[← Contents](README.md)

# 3. Use AI as an Engineering Tool, Not an Authority

* [ ] **Give AI constraints and context instead of vague requests.**\
  Describe the domain, existing architecture, requirements, limitations, and acceptance criteria before requesting code.\
  **Example:** Say, “Add cycle validation to this TypeScript adjacency-list implementation without changing the public API,” instead of “Fix the graph.”

* [ ] **Ask AI to explain its proposed architecture before generating code.**\
  Review the design while changes are still inexpensive and easy to reject.\
  **Example:** Ask Claude to describe the modules, data flow, and failure handling before allowing it to edit the repository.

* [ ] **Request multiple approaches with trade-offs.**\
  AI should help expand your decision space rather than quietly making architectural choices for you.\
  **Example:** Ask for an in-memory traversal, a recursive SQL query, and a graph-database approach with performance and maintenance trade-offs.

* [ ] **Break large tasks into small, reviewable changes.**\
  Smaller changes are easier to understand, test, debug, and reverse.\
  **Example:** First add graph types, then cycle detection, then API validation, and finally the visual error message.

* [ ] **Inspect generated code before accepting it.**\
  Read the implementation closely enough to explain its control flow, dependencies, assumptions, and side effects.\
  **Example:** Notice that an AI-generated DFS function mutates shared state and may produce incorrect results when called twice.

* [ ] **Verify unfamiliar APIs against official documentation.**\
  AI may invent options, combine versions, or use outdated signatures even when the generated code looks plausible.\
  **Example:** Confirm that the installed React Flow version supports the property Claude placed on a node component.

* [ ] **Avoid merging code I cannot explain.**\
  Treat inability to explain a change as a signal that more review or study is required.\
  **Example:** Do not merge a custom caching layer until you can explain its keys, expiration behavior, invalidation rules, and failure cases.

* [ ] **Keep important architectural decisions under my control.**\
  Let AI suggest options, but retain ownership of boundaries, data models, security rules, and long-term trade-offs.\
  **Example:** You decide whether study materials are generated synchronously or through a queue; AI helps implement the chosen design.

* [ ] **Use AI to accelerate implementation, debugging, testing, and research.**\
  Delegate mechanical work while retaining responsibility for problem framing and validation.\
  **Example:** Ask AI to generate test cases for cycle detection after you define what constitutes a valid and invalid graph.

* [ ] **Notice unnecessary complexity and abstractions.**\
  AI often produces extra factories, interfaces, wrappers, or services that make simple code harder to understand.\
  **Example:** Replace five graph repository classes with one focused module when the application has only one storage implementation.

---

[← 2. Systems thinking](02-systems-thinking.md) · [Contents](README.md) · [4. Catching AI mistakes →](04-catching-ai-mistakes.md)
