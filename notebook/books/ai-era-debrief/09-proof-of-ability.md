[← Contents](README.md)

# 9. Build Proof of Engineering Ability

* [ ] **Write a clear problem statement.**\
  Explain who has the problem, what currently goes wrong, and what outcome the project creates.\
  **Example:** “Developers using AI can ship applications without understanding the underlying CS concepts; this plugin generates codebase-specific study material.”

* [ ] **Include a system-design diagram.**\
  Visualize the application’s major components, boundaries, and data movement.\
  **Example:** Show repository input flowing through parsing, concept extraction, generation, validation, and Markdown output.

* [ ] **Document important architectural decisions.**\
  Record the context, options, choice, and consequences of decisions that future developers may question.\
  **Example:** Write an ADR explaining why study generation runs through a queue instead of directly inside a CLI command.

* [ ] **Describe where AI was used.**\
  Separate AI-assisted work from your own product, architecture, review, and testing decisions.\
  **Example:** “Claude drafted the parser adapter; I defined the interface, validated supported syntax, and wrote the fixtures.”

* [ ] **Explain how generated work was verified.**\
  Demonstrate concrete review methods instead of saying you manually checked it.\
  **Example:** Mention type checking, tests, manual traces, benchmark comparisons, and documentation verification.

* [ ] **Include tests and meaningful evaluation results.**
  Show evidence that the project behaves correctly and that model-generated output meets a defined standard.
  **Example:** Report that 18 of 20 sample repositories produced valid, complete study guides under the evaluation rubric.

* [ ] **Document one difficult bug and the investigation.**
  Show your ability to form hypotheses, collect evidence, isolate causes, and validate a fix.
  **Example:** Explain how stale graph state caused recommendations to ignore newly completed skills.

* [ ] **Show what changed after learning.**
  Present the first design, its limitations, and the reasoning behind the improved design.
  **Example:** Compare an early monolithic prompt with the later parse → analyze → generate → validate pipeline.

* [ ] **Explain performance, reliability, and security.**
  Demonstrate awareness of production behavior beyond feature completeness.
  **Example:** Discuss prompt-injection risks from repository content, job retries, rate limits, and large-repository processing.

* [ ] **Prepare a five-minute walkthrough.**
  Create a focused explanation covering the problem, architecture, one important decision, and the result.
  **Example:** Explain the Claude plugin from repository input to personalized study guide without diving into every file.

* [ ] **Prepare a deeper technical walkthrough.**
  Be ready to discuss internals, trade-offs, tests, failures, and scaling decisions when questioned.
  **Example:** Explain how concepts are extracted, deduplicated, ranked, validated, and mapped back to source files.

* [ ] **Keep the repository and commit history understandable.**
  Organize code and changes so another engineer can reconstruct how the system evolved.
  **Example:** Use focused commits such as “add cycle detection” and “enforce graph validation in API” rather than one massive “finish feature” commit.

---

[← 8. Study-material plugin](08-study-material-plugin.md) · [Contents](README.md) · [10. Weekly practice loop →](10-weekly-practice-loop.md)
