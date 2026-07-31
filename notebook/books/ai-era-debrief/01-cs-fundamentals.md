[← Contents](README.md)

# 1. Strengthen Computer-Science Fundamentals

## General fundamentals

* [ ] **Study data structures through real application features.**\
  Learn each structure by identifying where it naturally appears in an application rather than studying it only as an isolated interview problem.\
  **Example:** Represent each skill by its ID in a `Map<string, Skill>` so the application can retrieve a node without scanning the entire skill list.

* [ ] **Understand time and space complexity.**\
  Be able to estimate how an operation grows as the amount of data increases, even when AI wrote the implementation.\
  **Example:** Searching an array for a skill is approximately `O(n)`, while looking it up in a hash map is approximately `O(1)` on average.

* [ ] **Practice arrays, maps, sets, stacks, queues, trees, and graphs.**\
  Understand the behavior and common use cases of each structure so you can recognize which one matches the problem.\
  **Example:** Use a `Set` to prevent duplicate skill IDs, a queue for BFS, and a graph for prerequisite relationships.

* [ ] **Learn BFS, DFS, cycle detection, topological sorting, and shortest paths.**\
  These algorithms answer different questions about connections, reachability, ordering, and routes within a graph.\
  **Example:** Use BFS to find skills two steps away, DFS to inspect a dependency branch, and topological sorting to generate a valid curriculum order.

* [ ] **Review databases, networking, concurrency, caching, and operating-system fundamentals.**\
  Applications operate across several layers, so understanding only frontend components is not enough to explain their behavior.\
  **Example:** A skill update may travel from the browser through HTTP, reach an API handler, execute a database transaction, invalidate a cache, and return a response.

* [ ] **Connect every concept to code inside one of my applications.**\
  After studying a concept, locate or create one place where that concept appears in a real codebase.\
  **Example:** After learning queues, inspect how a background job queue could process study-material generation without blocking the user request.

* [ ] **Explain when and why I would choose one structure or algorithm over another.**\
  Knowing an algorithm’s name is not enough; you should understand the conditions that make it appropriate.\
  **Example:** Choose BFS instead of DFS when you need the closest prerequisite gap because BFS explores the graph one level at a time.

---

[Contents](README.md) · [2. Systems thinking →](02-systems-thinking.md)
