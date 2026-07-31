[← Contents](README.md)

# 7. Learn to Operate Agentic Systems

* [ ] **Understand how agents use tools, memory, context, and structured outputs.**\
  Learn the distinct role each mechanism plays so the system does not become one uncontrolled prompt.\
  **Example:** Your plugin uses repository tools to read files, context to hold relevant code, and a schema to produce predictable study sections.

* [ ] **Understand the difference between a workflow and an autonomous agent.**\
  A workflow follows predefined steps, while an agent dynamically decides which actions to take.\
  **Example:** Parse → summarize → quiz is a workflow; choosing which files to inspect based on discoveries is more agentic.

* [ ] **Define agent responsibilities and boundaries.**\
  Give each agent a focused purpose and make prohibited actions explicit.\
  **Example:** A code-analysis agent may read files and report risks but must not modify the repository.

* [ ] **Design human approval points.**\
  Require confirmation before expensive, destructive, sensitive, or externally visible actions.\
  **Example:** Let the agent propose documentation edits, but require your approval before writing them into the codebase.

* [ ] **Add retries, timeouts, fallbacks, and failure handling.**\
  Treat model and tool failures as expected operating conditions rather than exceptional surprises.\
  **Example:** Retry a transient model error twice, then produce a partial study guide with a clear warning.

* [ ] **Trace agent decisions and tool calls.**\
  Preserve enough execution history to understand how the agent arrived at an output.\
  **Example:** Record which files were opened, which concepts were extracted, and which prompt generated each study section.

* [ ] **Build evaluations for correctness and reliability.**\
  Define repeatable tests that measure whether agent outputs meet the intended standard.\
  **Example:** Check whether generated study materials identify the correct graph algorithm used in a known sample repository.

* [ ] **Test prompt and model changes against the same evaluation set.**\
  Compare versions using stable examples rather than relying on general impressions.\
  **Example:** Run both the old and new prompt against ten repositories and compare factual accuracy, coverage, and unsupported claims.

* [ ] **Track latency, cost, failure rates, and quality.**\
  Agent performance includes operational characteristics, not only whether the output sounds impressive.\
  **Example:** Measure generation time, token usage, schema-validation failures, and reviewer scores per study guide.

* [ ] **Avoid agents when deterministic code is better.**\
  Use ordinary functions for predictable rules and models for ambiguous reasoning or language tasks.\
  **Example:** Detect graph cycles with a deterministic algorithm rather than asking an LLM whether the graph looks cyclic.

---

[← 6. Problem-solving](06-problem-solving.md) · [Contents](README.md) · [8. Study-material plugin →](08-study-material-plugin.md)
