[← Contents](README.md)

# Priority Order

## 1. Systems thinking

* [ ] Understand the complete problem and system before focusing on individual functions.
  **Example:** Map how skill data moves from the database to the graph renderer before optimizing a React component.

## 2. Problem decomposition

* [ ] Divide ambiguous product work into smaller responsibilities with clear contracts.
  **Example:** Separate repository parsing, CS concept detection, lesson generation, and evaluation.

## 3. CS and DSA fundamentals

* [ ] Learn the structures and algorithms that explain why the application works.
  **Example:** Understand graphs, traversal, and topological ordering before building advanced skill recommendations.

## 4. Explaining technical decisions

* [ ] Practice communicating why a solution fits the requirements and what it sacrifices.
  **Example:** Explain why PostgreSQL is sufficient for the initial graph size despite graph databases offering richer traversal syntax.

## 5. Detecting AI mistakes

* [ ] Develop the ability to recognize plausible-looking code that is incorrect, insecure, outdated, or unnecessarily complicated.
  **Example:** Catch an AI-generated function that treats every visited node as evidence of a cycle.

## 6. Testing and evaluation

* [ ] Build repeatable evidence that deterministic code and AI-generated outputs meet expectations.
  **Example:** Maintain graph algorithm fixtures and a scored evaluation set for generated study guides.

## 7. Operating agentic systems

* [ ] Understand how to design, constrain, observe, and improve systems that use models and tools.
  **Example:** Track which repository files the study agent reads and prevent it from modifying them.

## 8. Communicating and demonstrating the work

* [ ] Convert technical understanding into diagrams, documentation, walkthroughs, and defensible portfolio evidence.
  **Example:** Present the plugin as a system that preserves engineering understanding while accelerating development with AI.

---

[← 10. Weekly practice loop](10-weekly-practice-loop.md) · [Contents](README.md) · [Final engineering standard →](12-final-engineering-standard.md)
