[← Contents](README.md)

# 8. Continue Developing the Claude Study-Material Plugin

## Study materials it should generate

* [ ] **Generate a system overview.**\
  Summarize the application’s purpose, users, major components, and technical boundaries.\
  **Example:** “This is a Next.js skill-tree application with PostgreSQL storage, React Flow visualization, and Claude-generated study guides.”

* [ ] **Generate a request-flow walkthrough.**\
  Explain one important operation from the initiating event through the final response.\
  **Example:** Walk through what happens after the user creates a new prerequisite edge.

* [ ] **Generate a component and dependency map.**\
  Show which modules depend on one another and which dependencies cross architectural boundaries.\
  **Example:** Display `GraphEditor → Graph API → Graph Service → Repository → PostgreSQL`.

* [ ] **Identify the CS fundamentals used by each feature.**\
  Connect implementation details to the underlying computer-science concepts.\
  **Example:** Map prerequisite recommendations to BFS and duplicate prevention to set membership.

* [ ] **Explain data structures and algorithms.**\
  Describe why each structure or algorithm appears and what operations it supports.\
  **Example:** Explain why the application uses an adjacency list instead of an adjacency matrix.

* [ ] **Generate architecture-decision questions.**\
  Ask questions that require the developer to justify boundaries and trade-offs.\
  **Example:** “Why does cycle validation occur on the server even though the client performs the same check?”

* [ ] **Generate alternative implementation approaches.**\
  Present credible alternatives so the developer practices comparison rather than accepting the existing design automatically.\
  **Example:** Compare application-level DFS, recursive SQL, and a graph database for prerequisite traversal.

* [ ] **Generate complexity analysis.**\
  Identify the dominant operations and estimate how they grow with input size.\
  **Example:** Explain why rebuilding the entire adjacency list for every edge addition may become expensive.

* [ ] **Generate edge cases and failure scenarios.**\
  Produce realistic situations that challenge correctness, reliability, and usability.\
  **Example:** Ask what happens when a skill is deleted during an active recommendation request.

* [ ] **Generate security and performance review questions.**\
  Prompt the developer to inspect trust boundaries, permissions, data exposure, and resource usage.\
  **Example:** “Can a learner retrieve private curriculum data by changing the curriculum ID in the request?”

* [ ] **Generate AI-code audit exercises.**\
  Present suspicious generated code and ask the developer to identify its defects.\
  **Example:** Show a DFS function that never removes nodes from the active recursion set and ask why it reports false cycles.

* [ ] **Generate interview questions grounded in the codebase.**\
  Turn the application’s real decisions into technical discussion rather than unrelated trivia.\
  **Example:** “How would you redesign this graph renderer to support 100,000 nodes?”

* [ ] **Generate a redesign challenge.**\
  Ask the developer to improve one subsystem under a new constraint.\
  **Example:** “Redesign study generation so it survives model outages and resumes interrupted jobs.”

* [ ] **Generate a teach-without-code exercise.**\
  Require an explanation using diagrams, concepts, and examples without reading implementation details.\
  **Example:** Explain how cycle detection works using five skill nodes drawn on paper.

## The plugin should test active understanding

* [ ] **Require an answer before revealing the explanation.**\
  Retrieval strengthens understanding more effectively than immediately reading a generated summary.\
  **Example:** Ask, “Which traversal would find the nearest unlocked skill?” before showing the BFS explanation.

* [ ] **Ask follow-up questions when the answer is incomplete.**\
  Evaluate the reasoning behind the response instead of treating keywords as proof of understanding.\
  **Example:** After the learner says “use DFS,” ask how the recursion stack detects a back edge.

* [ ] **Generate small coding or debugging exercises.**\
  Convert concepts into tasks that require direct application.\
  **Example:** Ask the learner to repair a cycle-detection function with a shared mutable `visited` set.

* [ ] **Revisit concepts the learner previously struggled with.**\
  Track weak areas and introduce them again in different project contexts.\
  **Example:** If transaction boundaries were misunderstood, revisit them when the next application updates two related tables.

* [ ] **Require the learner to defend a design.**\
  Prompt for assumptions, alternatives, risks, and trade-offs rather than simple recognition.\
  **Example:** Ask why graph traversal should run on the server instead of accepting “because it is faster.”

* [ ] **Track concepts demonstrated across projects.**\
  Build a record showing whether knowledge transfers beyond one familiar implementation.\
  **Example:** Mark BFS as demonstrated only after the learner explains its use in both a skill tree and a dependency explorer.

---

[← 7. Agentic systems](07-agentic-systems.md) · [Contents](README.md) · [9. Proof of ability →](09-proof-of-ability.md)
