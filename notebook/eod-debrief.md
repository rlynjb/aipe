# AI-Era Debrief Prompt Library

Self-contained debrief reference for the AI-era software engineer. Each section pairs a runnable prompt — paste your feature, diff, or decision and have the agent run the checks against what you actually did — with the full checklist it's built from (explanation + example per item), so nothing lives outside this file.

> AI can generate code, but your value comes from **understanding the problem, directing the implementation, evaluating the result, and defending the final design.**
> 
> This is to orient you to design, review, implement, and coordinate applications with AI while keeping ownership of the system's mental model and its complexity.

**How to use:** run at the end of a work block, not as a to-do list. Every day, run the [Final Engineering Standard](#final-engineering-standard-daily-core) against whatever you shipped — that's the core debrief. When today felt shaky in one spot, open the matching prompt. Every week, run the [Weekly practice loop](#weekly-practice-loop). Spread thin? The [Priority order](#priority-order) says what to strengthen first.

---

## Index

| # | Prompt | What it does | Reach for it when |
|---|--------|--------------|-------------------|
| ★ | [**Final Engineering Standard**](#final-engineering-standard-daily-core) | 10 honest checks before calling anything "done" | Every day · anything you'd call done |
| 1 | [**CS fundamentals**](#1-strengthen-cs-fundamentals) | Tie structures/algorithms to real app code | CS fundamentals felt shaky today |
| 2 | [**Systems thinking**](#2-develop-systems-thinking) | Problem, boundaries, flow, invariants, alternatives | A design or architecture decision |
| 3 | [**AI as a tool**](#3-use-ai-as-a-tool-not-an-authority) | How you directed the AI, not just what it wrote | Merging or shipping AI-generated code |
| 4 | [**Catch AI mistakes**](#4-catch-ai-mistakes) | 15-point correctness/security/scale audit of a diff | Merging or shipping AI-generated code |
| 5 | [**Explain every decision**](#5-explain-every-decision) | Force a defensible account of each choice | A design or architecture decision |
| 6 | [**Problem-solving**](#6-improve-problem-solving) | Frame, decompose, evidence-debug a problem | A tricky bug |
| 7 | [**Agentic systems**](#7-operate-agentic-systems) | Boundaries, approvals, evals, observability | Building or running an agent |
| 8 | [**Study-material generator**](#8-study-material-plugin-generator) | Generates codebase-grounded study material + drills | Turning today's work into study reps |
| 9 | [**Proof of ability**](#9-build-proof-of-engineering-ability) | Portfolio/interview evidence from the project | Portfolio or interview prep |
| W | [**Weekly practice loop**](#weekly-practice-loop) | One concept, learned → built → tested → taught | Every week |
| P | [**Priority order**](#priority-order) | What to strengthen first when spread thin | Deciding where to spend limited time |

Every section has a **Reference** block: the full checklist with an explanation and worked example for each item.

---

## Final Engineering Standard (daily core)

**What it does:** The ten honest checks that decide whether an AI-built feature is actually complete. Run this every day against whatever you shipped or touched — it's the core debrief; the blanks show where the day was thin.

```text
Debrief the AI-built feature I just finished against the Final Engineering
Standard. For each statement, answer yes or no, and cite specific evidence from
the feature. List every "no" as a gap I must close before calling it done.

- I understand the user problem.
- I understand the underlying CS principles.
- I can trace the complete data flow.
- I can explain why the design was selected.
- I reviewed the generated implementation.
- I tested normal, edge, and failure cases.
- I can identify its assumptions and weaknesses.
- I know how it would behave at greater scale.
- I can redesign one part without depending entirely on AI.
- I can teach the feature to another engineer.

AI may produce the implementation, but I remain responsible for the reasoning,
correctness, architecture, and outcome.
```

**Reference.** Before considering an AI-built feature complete, I should be able to say each of the ten statements above honestly. The governing principle: *AI may produce the implementation, but I remain responsible for the reasoning, correctness, architecture, and outcome.*

---

## 1. Strengthen CS fundamentals

**What it does:** Checks that today's concepts are tied to real application code and that you can justify structure/algorithm choices — not just name them.

```text
Debrief today's work against CS fundamentals. For each check, state whether I
demonstrated it, and point to the exact place in my code where the concept
appears. Flag the checks I could not connect to real code as study targets.

- Study data structures through real application features.
- Understand time and space complexity.
- Practice arrays, maps, sets, stacks, queues, trees, and graphs.
- Learn BFS, DFS, cycle detection, topological sorting, and shortest paths.
- Review databases, networking, concurrency, caching, and operating-system fundamentals.
- Connect every concept to code inside one of my applications.
- Explain when and why I would choose one structure or algorithm over another.
```

**Reference.**

- **Study data structures through real application features.** Learn each structure by identifying where it naturally appears in an application rather than studying it only as an isolated interview problem. *Example:* Represent each skill by its ID in a `Map<string, Skill>` so the application can retrieve a node without scanning the entire skill list.
- **Understand time and space complexity.** Be able to estimate how an operation grows as the amount of data increases, even when AI wrote the implementation. *Example:* Searching an array for a skill is approximately `O(n)`, while looking it up in a hash map is approximately `O(1)` on average.
- **Practice arrays, maps, sets, stacks, queues, trees, and graphs.** Understand the behavior and common use cases of each structure so you can recognize which one matches the problem. *Example:* Use a `Set` to prevent duplicate skill IDs, a queue for BFS, and a graph for prerequisite relationships.
- **Learn BFS, DFS, cycle detection, topological sorting, and shortest paths.** These algorithms answer different questions about connections, reachability, ordering, and routes within a graph. *Example:* Use BFS to find skills two steps away, DFS to inspect a dependency branch, and topological sorting to generate a valid curriculum order.
- **Review databases, networking, concurrency, caching, and operating-system fundamentals.** Applications operate across several layers, so understanding only frontend components is not enough to explain their behavior. *Example:* A skill update may travel from the browser through HTTP, reach an API handler, execute a database transaction, invalidate a cache, and return a response.
- **Connect every concept to code inside one of my applications.** After studying a concept, locate or create one place where that concept appears in a real codebase. *Example:* After learning queues, inspect how a background job queue could process study-material generation without blocking the user request.
- **Explain when and why I would choose one structure or algorithm over another.** Knowing an algorithm's name is not enough; you should understand the conditions that make it appropriate. *Example:* Choose BFS instead of DFS when you need the closest prerequisite gap because BFS explores the graph one level at a time.

---

## 2. Develop systems thinking

**What it does:** Pulls you up from individual functions to the whole system — problem, boundaries, data flow, invariants, failure modes, and at least one alternative design.

```text
Debrief today's design work against systems thinking. For each check, give my
answer for this feature; where I have no answer, mark it as a gap.

- Define the actual user problem.
- Identify the system boundaries.
- Map the full data and request flow.
- Identify components, services, databases, APIs, and external dependencies.
- Define important invariants and business rules.
- Consider failure modes and unusual inputs.
- Consider security, performance, scalability, and maintainability.
- Decide what belongs in the client, server, database, or background worker.
- Sketch at least one alternative design before committing.
```

**Reference.**

- **Define the actual user problem.** Describe the user's desired outcome before thinking about frameworks, models, or implementation details. *Example:* The problem is not "build a graph UI"; it is "help learners understand what to study next and why."
- **Identify the system boundaries.** Decide what your application owns and what responsibilities belong to external systems or services. *Example:* Your app may own skill relationships and progress, while authentication is delegated to an identity provider.
- **Map the full data and request flow.** Trace what happens from the moment a user performs an action until the final result appears. *Example:* User adds a prerequisite → frontend validates input → API receives request → server checks authorization → database saves edge → cache is invalidated → graph rerenders.
- **Identify components, services, databases, APIs, and external dependencies.** Create a clear inventory of the moving parts so hidden dependencies do not surprise you later. *Example:* The Claude plugin may depend on a CLI command, code parser, prompt builder, Claude API, output validator, and Markdown writer.
- **Define important invariants and business rules.** Identify conditions that must always remain true regardless of which interface or service modifies the data. *Example:* A deleted skill cannot remain referenced as another skill's prerequisite.
- **Consider failure modes and unusual inputs.** Think about how the system behaves when data is missing, malformed, duplicated, delayed, or partially processed. *Example:* The study generator should handle a repository containing no tests, an unsupported language, or a file too large for the model context.
- **Consider security, performance, scalability, and maintainability.** Evaluate more than whether the feature works during a successful local demonstration. *Example:* A graph traversal that is acceptable for 100 skills may freeze the browser when the graph reaches 100,000 nodes.
- **Decide what belongs in the client, server, database, or background worker.** Place responsibilities according to trust, cost, latency, persistence, and resource requirements. *Example:* Dragging nodes belongs in the client, authorization belongs on the server, relationships belong in the database, and long AI generation belongs in a worker.
- **Sketch at least one alternative design before committing.** Comparing alternatives reveals trade-offs that are easy to overlook when accepting the first AI-generated solution. *Example:* Compare storing graph edges in PostgreSQL tables with using a dedicated graph database before choosing either approach.

---

## 3. Use AI as a tool, not an authority

**What it does:** Reviews *how* you directed the AI — constraints, requested alternatives, small reviewable changes — and whether you kept the architectural decisions yourself.

```text
Debrief how I used AI on this task. For each check, state honestly whether I did
it, and where I let the AI make a decision I should have owned.

- Give AI constraints and context instead of vague requests.
- Ask AI to explain its proposed architecture before generating code.
- Request multiple approaches with trade-offs.
- Break large tasks into small, reviewable changes.
- Inspect generated code before accepting it.
- Verify unfamiliar APIs against official documentation.
- Avoid merging code I cannot explain.
- Keep important architectural decisions under my control.
- Use AI to accelerate implementation, debugging, testing, and research.
- Notice unnecessary complexity and abstractions.
```

**Reference.**

- **Give AI constraints and context instead of vague requests.** Describe the domain, existing architecture, requirements, limitations, and acceptance criteria before requesting code. *Example:* Say, "Add cycle validation to this TypeScript adjacency-list implementation without changing the public API," instead of "Fix the graph."
- **Ask AI to explain its proposed architecture before generating code.** Review the design while changes are still inexpensive and easy to reject. *Example:* Ask Claude to describe the modules, data flow, and failure handling before allowing it to edit the repository.
- **Request multiple approaches with trade-offs.** AI should help expand your decision space rather than quietly making architectural choices for you. *Example:* Ask for an in-memory traversal, a recursive SQL query, and a graph-database approach with performance and maintenance trade-offs.
- **Break large tasks into small, reviewable changes.** Smaller changes are easier to understand, test, debug, and reverse. *Example:* First add graph types, then cycle detection, then API validation, and finally the visual error message.
- **Inspect generated code before accepting it.** Read the implementation closely enough to explain its control flow, dependencies, assumptions, and side effects. *Example:* Notice that an AI-generated DFS function mutates shared state and may produce incorrect results when called twice.
- **Verify unfamiliar APIs against official documentation.** AI may invent options, combine versions, or use outdated signatures even when the generated code looks plausible. *Example:* Confirm that the installed React Flow version supports the property Claude placed on a node component.
- **Avoid merging code I cannot explain.** Treat inability to explain a change as a signal that more review or study is required. *Example:* Do not merge a custom caching layer until you can explain its keys, expiration behavior, invalidation rules, and failure cases.
- **Keep important architectural decisions under my control.** Let AI suggest options, but retain ownership of boundaries, data models, security rules, and long-term trade-offs. *Example:* You decide whether study materials are generated synchronously or through a queue; AI helps implement the chosen design.
- **Use AI to accelerate implementation, debugging, testing, and research.** Delegate mechanical work while retaining responsibility for problem framing and validation. *Example:* Ask AI to generate test cases for cycle detection after you define what constitutes a valid and invalid graph.
- **Notice unnecessary complexity and abstractions.** AI often produces extra factories, interfaces, wrappers, or services that make simple code harder to understand. *Example:* Replace five graph repository classes with one focused module when the application has only one storage implementation.

---

## 4. Catch AI mistakes

**What it does:** A 15-point audit of an AI-generated diff spanning correctness, edge cases, types, async/races, security, transactions, query cost, coupling, and scale. Give it the diff.

```text
Audit this AI-generated change for the mistakes below. For each check, report
pass/fail with evidence, and for any failure give a concrete input or event
sequence that demonstrates it.

- Check whether the implementation is logically correct.
- Check for missing edge cases.
- Check whether the types are accurate.
- Check whether errors are handled meaningfully.
- Check whether asynchronous operations are safe.
- Check for race conditions.
- Validate user input.
- Separate authentication from authorization.
- Protect secrets and private data.
- Use database transactions where necessary.
- Inspect query cost.
- Look for tight coupling.
- Evaluate whether abstractions are useful.
- Test behavior rather than internal implementation.
- Consider much larger usage.
```

**Reference.**

- **Check whether the implementation is logically correct.** Walk through the code using small examples and confirm that its output matches the intended behavior. *Example:* Test whether adding `A → B`, `B → C`, and `C → A` is correctly identified as a cycle.
- **Check for missing edge cases.** Identify inputs outside the ordinary happy path and make their expected behavior explicit. *Example:* Test an empty graph, one isolated node, duplicate edges, disconnected components, and a very deep prerequisite chain.
- **Check whether the types are accurate.** Types should represent domain guarantees rather than merely silence compiler errors. *Example:* Use separate `SkillId` and `UserId` types or branded strings so they cannot be accidentally mixed.
- **Check whether errors are handled meaningfully.** Errors should be translated into information that developers, users, or monitoring systems can act upon. *Example:* Return "This prerequisite creates a cycle" rather than a generic "500 Internal Server Error."
- **Check whether asynchronous operations are safe.** Understand ordering, cancellation, retries, and what happens when multiple operations overlap. *Example:* Cancel an outdated graph-search request when the user immediately enters a different search term.
- **Check for race conditions.** Consider whether concurrent actions can read or write inconsistent state. *Example:* Two users may simultaneously add edges that are individually valid but create a cycle when combined.
- **Validate user input.** Assume client-side input can be bypassed and enforce critical rules at the trusted boundary. *Example:* Validate skill IDs and prerequisite relationships on the server even when the UI already disables invalid selections.
- **Separate authentication from authorization.** Knowing who the user is does not automatically mean they have permission to perform every action. *Example:* A signed-in learner may view a curriculum but should not be able to rewrite its prerequisite graph.
- **Protect secrets and private data.** Check logs, browser bundles, error messages, environment variables, and prompts for accidental exposure. *Example:* Never send the Claude API key to client-side code or include private repository content in analytics logs.
- **Use database transactions where necessary.** Related database changes should succeed or fail together when partial completion would violate system rules. *Example:* Creating a skill and its initial prerequisite edges should roll back if one of the edges is invalid.
- **Inspect query cost.** Confirm that database operations will remain efficient as the dataset grows. *Example:* Avoid fetching the complete skill graph when the user only needs one node and its direct prerequisites.
- **Look for tight coupling.** Modules should not know unnecessary implementation details about one another. *Example:* The graph traversal module should accept graph data rather than directly importing PostgreSQL and React Flow.
- **Evaluate whether abstractions are useful.** An abstraction should hide complexity, stabilize a boundary, or enable meaningful variation. *Example:* A `GraphRepository` interface is useful when you genuinely support multiple storage systems, not merely because interfaces look architectural.
- **Test behavior rather than internal implementation.** Tests should remain valid when the code is refactored without changing externally observable results. *Example:* Test that the API rejects a cycle instead of asserting that a specific private DFS helper was called.
- **Consider much larger usage.** Estimate how memory, latency, database load, model cost, and user experience change with scale. *Example:* Determine whether loading 100,000 graph nodes into the browser is acceptable or whether the app needs progressive loading.

---

## 5. Explain every decision

**What it does:** Forces a defensible account of each choice — problem, data flow, architecture, structure, rejected alternatives, trade-offs, assumptions, failure points, and where AI was used and verified.

```text
Make me explain this feature as if defending it in a design review. For each
prompt below, write my answer; mark any I cannot answer confidently as a gap.

- Explain what problem the feature solves.
- Explain how data moves through the system.
- Explain why I chose the architecture.
- Explain why I chose the data structure.
- Explain the alternatives I rejected.
- Explain the trade-offs I accepted.
- Explain the implementation's assumptions.
- Explain where the system is most likely to fail.
- Explain time and space complexity.
- Explain how I would test it.
- Explain how I would redesign it for 10× or 100× usage.
- Explain where AI was used and how I verified it.
```

**Reference.**

- **Explain what problem the feature solves.** Start with the user or business need rather than immediately describing technical components. *Example:* "Prerequisite validation prevents curriculum authors from creating learning paths that students cannot complete."
- **Explain how data moves through the system.** Describe the complete path across the frontend, network, server, storage, and supporting services. *Example:* Explain how an uploaded repository becomes parsed code metadata, model prompts, validated study sections, and a saved Markdown file.
- **Explain why I chose the architecture.** Connect the architecture to specific constraints instead of calling it a general best practice. *Example:* "I used a background worker because generation takes 30 seconds and should not hold an HTTP request open."
- **Explain why I chose the data structure.** Describe how the required operations match the selected structure. *Example:* "I used an adjacency list because the skill graph is sparse and we frequently traverse outgoing edges."
- **Explain the alternatives I rejected.** Show that the decision came from comparison rather than habit or AI preference. *Example:* "I rejected an adjacency matrix because it would allocate space for relationships that rarely exist."
- **Explain the trade-offs I accepted.** Every design improves some qualities while making others harder, slower, or more expensive. *Example:* "Using PostgreSQL keeps operations simple, but complex graph queries may be less expressive than in a graph database."
- **Explain the implementation's assumptions.** Hidden assumptions can become bugs when the product or dataset changes. *Example:* The recommendation algorithm may assume all prerequisite edges have equal learning cost.
- **Explain where the system is most likely to fail.** Identify the weakest boundaries, uncertain dependencies, and resource limits. *Example:* Large repositories may exceed the model context window or produce incomplete study coverage.
- **Explain time and space complexity.** Give an approximate analysis of the main algorithm rather than claiming the entire application has one complexity. *Example:* DFS cycle detection takes approximately `O(V + E)` time and `O(V)` additional space.
- **Explain how I would test it.** Cover unit behavior, integration boundaries, failure paths, and realistic end-to-end usage. *Example:* Unit-test graph traversal, integration-test database validation, and end-to-end test the visual error shown after creating a cycle.
- **Explain how I would redesign it for 10× or 100× usage.** Identify which assumptions stop working and what architectural changes become necessary. *Example:* Replace full-graph loading with server-side filtering, pagination, clustering, and incremental rendering.
- **Explain where AI was used and how I verified it.** Be transparent about assistance while demonstrating that you retained engineering responsibility. *Example:* "Claude generated the first DFS implementation; I traced it manually, added cycle fixtures, found a state-reset bug, and corrected it."

---

## 6. Improve problem-solving

**What it does:** Runs the problem-solving discipline over a bug or tricky task — restate, separate requirements from implementation, work a small example, decompose, measure before optimizing, debug from evidence, and record the root cause.

```text
Debrief how I solved this problem or bug. For each check, describe what I
actually did; where I skipped a step or guessed, name it.

- Restate the problem before writing code.
- Separate requirements from implementations.
- Create a small example manually.
- Identify inputs, outputs, constraints, and invariants.
- Decompose the problem into independently testable parts.
- Choose the simplest correct solution first.
- Measure before optimizing.
- Compare the result against a known-good example.
- Debug from evidence rather than guessing.
- Record why the bug occurred, not only how it was fixed.
```

**Reference.**

- **Restate the problem before writing code.** Rewrite the request in precise terms to expose ambiguity and prevent premature implementation. *Example:* "Given a proposed directed edge, determine whether adding it would create a path back to the source node."
- **Separate requirements from implementations.** Distinguish what the system must accomplish from one particular way of accomplishing it. *Example:* "Generate a valid study order" is a requirement; "use Kahn's algorithm" is an implementation choice.
- **Create a small example manually.** Solve a tiny instance yourself before trusting code or AI output. *Example:* Draw five skill nodes and manually determine the expected topological order before running the implementation.
- **Identify inputs, outputs, constraints, and invariants.** Define the problem contract so the implementation can be evaluated objectively. *Example:* Input: nodes and directed edges; output: valid order or cycle error; invariant: every edge references an existing node.
- **Decompose the problem into independently testable parts.** Divide the solution along clear responsibilities rather than creating one large function. *Example:* Separate graph construction, edge validation, cycle detection, persistence, and UI feedback.
- **Choose the simplest correct solution first.** Avoid optimizing or generalizing before the basic behavior is correct and understood. *Example:* Start with an adjacency list and DFS before introducing distributed graph processing.
- **Measure before optimizing.** Use profiling, logs, traces, or benchmarks to identify the real bottleneck. *Example:* Confirm whether graph layout, database retrieval, or React rendering causes the delay before rewriting the algorithm.
- **Compare the result against a known-good example.** Use manually verified fixtures, reference implementations, or established tools to detect subtle errors. *Example:* Compare your topological-sort results with a small graph whose valid orders you already know.
- **Debug from evidence rather than guessing.** Gather logs, reproduction steps, state snapshots, and failing inputs before changing code. *Example:* Log the recursion stack and visited nodes to understand why cycle detection incorrectly rejects a valid graph.
- **Record why the bug occurred, not only how it was fixed.** Capture the incorrect assumption or missing safeguard so the lesson transfers to future work. *Example:* "The bug occurred because traversal state was shared between requests rather than initialized per operation."

---

## 7. Operate agentic systems

**What it does:** Checks an agent or workflow for the operational essentials — clear boundaries, human approval points, failure handling, tracing, evaluations, cost/latency tracking, and knowing when *not* to use an agent.

```text
Debrief the agent or agentic workflow I worked on. For each check, state whether
it is in place, and flag anything missing that could cause silent failure or
unbounded behavior.

- Understand how agents use tools, memory, context, and structured outputs.
- Understand the difference between a workflow and an autonomous agent.
- Define agent responsibilities and boundaries.
- Design human approval points.
- Add retries, timeouts, fallbacks, and failure handling.
- Trace agent decisions and tool calls.
- Build evaluations for correctness and reliability.
- Test prompt and model changes against the same evaluation set.
- Track latency, cost, failure rates, and quality.
- Avoid agents when deterministic code is better.
```

**Reference.**

- **Understand how agents use tools, memory, context, and structured outputs.** Learn the distinct role each mechanism plays so the system does not become one uncontrolled prompt. *Example:* Your plugin uses repository tools to read files, context to hold relevant code, and a schema to produce predictable study sections.
- **Understand the difference between a workflow and an autonomous agent.** A workflow follows predefined steps, while an agent dynamically decides which actions to take. *Example:* Parse → summarize → quiz is a workflow; choosing which files to inspect based on discoveries is more agentic.
- **Define agent responsibilities and boundaries.** Give each agent a focused purpose and make prohibited actions explicit. *Example:* A code-analysis agent may read files and report risks but must not modify the repository.
- **Design human approval points.** Require confirmation before expensive, destructive, sensitive, or externally visible actions. *Example:* Let the agent propose documentation edits, but require your approval before writing them into the codebase.
- **Add retries, timeouts, fallbacks, and failure handling.** Treat model and tool failures as expected operating conditions rather than exceptional surprises. *Example:* Retry a transient model error twice, then produce a partial study guide with a clear warning.
- **Trace agent decisions and tool calls.** Preserve enough execution history to understand how the agent arrived at an output. *Example:* Record which files were opened, which concepts were extracted, and which prompt generated each study section.
- **Build evaluations for correctness and reliability.** Define repeatable tests that measure whether agent outputs meet the intended standard. *Example:* Check whether generated study materials identify the correct graph algorithm used in a known sample repository.
- **Test prompt and model changes against the same evaluation set.** Compare versions using stable examples rather than relying on general impressions. *Example:* Run both the old and new prompt against ten repositories and compare factual accuracy, coverage, and unsupported claims.
- **Track latency, cost, failure rates, and quality.** Agent performance includes operational characteristics, not only whether the output sounds impressive. *Example:* Measure generation time, token usage, schema-validation failures, and reviewer scores per study guide.
- **Avoid agents when deterministic code is better.** Use ordinary functions for predictable rules and models for ambiguous reasoning or language tasks. *Example:* Detect graph cycles with a deterministic algorithm rather than asking an LLM whether the graph looks cyclic.

---

## 8. Study-material plugin generator

**What it does:** Unlike the debriefs above, this is a *generation* prompt — point it at a codebase (or today's feature) to produce codebase-grounded study material and active-recall drills.

```text
Generate study material from this codebase. Produce each of the following,
grounded in the actual code rather than generic explanations:

- Generate a system overview.
- Generate a request-flow walkthrough.
- Generate a component and dependency map.
- Identify the CS fundamentals used by each feature.
- Explain data structures and algorithms.
- Generate architecture-decision questions.
- Generate alternative implementation approaches.
- Generate complexity analysis.
- Generate edge cases and failure scenarios.
- Generate security and performance review questions.
- Generate AI-code audit exercises.
- Generate interview questions grounded in the codebase.
- Generate a redesign challenge.
- Generate a teach-without-code exercise.

Then test my active understanding, not just recognition:

- Require an answer before revealing the explanation.
- Ask follow-up questions when the answer is incomplete.
- Generate small coding or debugging exercises.
- Revisit concepts I previously struggled with.
- Require me to defend a design.
- Track concepts demonstrated across projects.
```

**Reference — study materials it should generate.**

- **Generate a system overview.** Summarize the application's purpose, users, major components, and technical boundaries. *Example:* "This is a Next.js skill-tree application with PostgreSQL storage, React Flow visualization, and Claude-generated study guides."
- **Generate a request-flow walkthrough.** Explain one important operation from the initiating event through the final response. *Example:* Walk through what happens after the user creates a new prerequisite edge.
- **Generate a component and dependency map.** Show which modules depend on one another and which dependencies cross architectural boundaries. *Example:* Display `GraphEditor → Graph API → Graph Service → Repository → PostgreSQL`.
- **Identify the CS fundamentals used by each feature.** Connect implementation details to the underlying computer-science concepts. *Example:* Map prerequisite recommendations to BFS and duplicate prevention to set membership.
- **Explain data structures and algorithms.** Describe why each structure or algorithm appears and what operations it supports. *Example:* Explain why the application uses an adjacency list instead of an adjacency matrix.
- **Generate architecture-decision questions.** Ask questions that require the developer to justify boundaries and trade-offs. *Example:* "Why does cycle validation occur on the server even though the client performs the same check?"
- **Generate alternative implementation approaches.** Present credible alternatives so the developer practices comparison rather than accepting the existing design automatically. *Example:* Compare application-level DFS, recursive SQL, and a graph database for prerequisite traversal.
- **Generate complexity analysis.** Identify the dominant operations and estimate how they grow with input size. *Example:* Explain why rebuilding the entire adjacency list for every edge addition may become expensive.
- **Generate edge cases and failure scenarios.** Produce realistic situations that challenge correctness, reliability, and usability. *Example:* Ask what happens when a skill is deleted during an active recommendation request.
- **Generate security and performance review questions.** Prompt the developer to inspect trust boundaries, permissions, data exposure, and resource usage. *Example:* "Can a learner retrieve private curriculum data by changing the curriculum ID in the request?"
- **Generate AI-code audit exercises.** Present suspicious generated code and ask the developer to identify its defects. *Example:* Show a DFS function that never removes nodes from the active recursion set and ask why it reports false cycles.
- **Generate interview questions grounded in the codebase.** Turn the application's real decisions into technical discussion rather than unrelated trivia. *Example:* "How would you redesign this graph renderer to support 100,000 nodes?"
- **Generate a redesign challenge.** Ask the developer to improve one subsystem under a new constraint. *Example:* "Redesign study generation so it survives model outages and resumes interrupted jobs."
- **Generate a teach-without-code exercise.** Require an explanation using diagrams, concepts, and examples without reading implementation details. *Example:* Explain how cycle detection works using five skill nodes drawn on paper.

**Reference — the plugin should test active understanding.**

- **Require an answer before revealing the explanation.** Retrieval strengthens understanding more effectively than immediately reading a generated summary. *Example:* Ask, "Which traversal would find the nearest unlocked skill?" before showing the BFS explanation.
- **Ask follow-up questions when the answer is incomplete.** Evaluate the reasoning behind the response instead of treating keywords as proof of understanding. *Example:* After the learner says "use DFS," ask how the recursion stack detects a back edge.
- **Generate small coding or debugging exercises.** Convert concepts into tasks that require direct application. *Example:* Ask the learner to repair a cycle-detection function with a shared mutable `visited` set.
- **Revisit concepts the learner previously struggled with.** Track weak areas and introduce them again in different project contexts. *Example:* If transaction boundaries were misunderstood, revisit them when the next application updates two related tables.
- **Require the learner to defend a design.** Prompt for assumptions, alternatives, risks, and trade-offs rather than simple recognition. *Example:* Ask why graph traversal should run on the server instead of accepting "because it is faster."
- **Track concepts demonstrated across projects.** Build a record showing whether knowledge transfers beyond one familiar implementation. *Example:* Mark BFS as demonstrated only after the learner explains its use in both a skill tree and a dependency explorer.

---

## 9. Build proof of engineering ability

**What it does:** Turns the project into defensible portfolio and interview evidence — problem statement, diagram, ADRs, where AI was used and verified, tests/evals, a documented bug, and two walkthroughs at different depths.

```text
Assess this project as portfolio and interview evidence. For each item, tell me
whether it exists and is strong enough to defend; list what's missing or weak.

- Write a clear problem statement.
- Include a system-design diagram.
- Document important architectural decisions.
- Describe where AI was used.
- Explain how generated work was verified.
- Include tests and meaningful evaluation results.
- Document one difficult bug and the investigation.
- Show what changed after learning.
- Explain performance, reliability, and security.
- Prepare a five-minute walkthrough.
- Prepare a deeper technical walkthrough.
- Keep the repository and commit history understandable.
```

**Reference.**

- **Write a clear problem statement.** Explain who has the problem, what currently goes wrong, and what outcome the project creates. *Example:* "Developers using AI can ship applications without understanding the underlying CS concepts; this plugin generates codebase-specific study material."
- **Include a system-design diagram.** Visualize the application's major components, boundaries, and data movement. *Example:* Show repository input flowing through parsing, concept extraction, generation, validation, and Markdown output.
- **Document important architectural decisions.** Record the context, options, choice, and consequences of decisions that future developers may question. *Example:* Write an ADR explaining why study generation runs through a queue instead of directly inside a CLI command.
- **Describe where AI was used.** Separate AI-assisted work from your own product, architecture, review, and testing decisions. *Example:* "Claude drafted the parser adapter; I defined the interface, validated supported syntax, and wrote the fixtures."
- **Explain how generated work was verified.** Demonstrate concrete review methods instead of saying you manually checked it. *Example:* Mention type checking, tests, manual traces, benchmark comparisons, and documentation verification.
- **Include tests and meaningful evaluation results.** Show evidence that the project behaves correctly and that model-generated output meets a defined standard. *Example:* Report that 18 of 20 sample repositories produced valid, complete study guides under the evaluation rubric.
- **Document one difficult bug and the investigation.** Show your ability to form hypotheses, collect evidence, isolate causes, and validate a fix. *Example:* Explain how stale graph state caused recommendations to ignore newly completed skills.
- **Show what changed after learning.** Present the first design, its limitations, and the reasoning behind the improved design. *Example:* Compare an early monolithic prompt with the later parse → analyze → generate → validate pipeline.
- **Explain performance, reliability, and security.** Demonstrate awareness of production behavior beyond feature completeness. *Example:* Discuss prompt-injection risks from repository content, job retries, rate limits, and large-repository processing.
- **Prepare a five-minute walkthrough.** Create a focused explanation covering the problem, architecture, one important decision, and the result. *Example:* Explain the Claude plugin from repository input to personalized study guide without diving into every file.
- **Prepare a deeper technical walkthrough.** Be ready to discuss internals, trade-offs, tests, failures, and scaling decisions when questioned. *Example:* Explain how concepts are extracted, deduplicated, ranked, validated, and mapped back to source files.
- **Keep the repository and commit history understandable.** Organize code and changes so another engineer can reconstruct how the system evolved. *Example:* Use focused commits such as "add cycle detection" and "enforce graph validation in API" rather than one massive "finish feature" commit.

---

## Weekly practice loop

**What it does:** One concept per week, carried all the way through — learned against current work, implemented, AI-proposed, reviewed, tested, explained in your own words, fed back into the study plugin, and rebuilt from scratch.

```text
Run my weekly practice loop. Help me pick the concept from my current feature,
then hold me to each step and record the closing reflection.

- Learn one fundamental relevant to the current feature.
- Implement or inspect it in a real application.
- Let AI propose an implementation.
- Review the proposal for correctness and complexity.
- Write normal, edge, and failure tests.
- Explain the completed feature in my own words.
- Document one architectural decision and its trade-offs.
- Add the lesson to the Claude study plugin.
- Rebuild one small part without copying the generated answer.
- Record what I can now explain that I could not explain last week.
```

**Reference.**

- **Learn one fundamental relevant to the current feature.** Choose the concept based on immediate product work so learning and implementation reinforce one another. *Example:* Study topological sorting during the week you implement curriculum ordering.
- **Implement or inspect it in a real application.** Find the concept in production-style code rather than stopping after reading or watching a tutorial. *Example:* Inspect how your graph service constructs indegree counts for Kahn's algorithm.
- **Let AI propose an implementation.** Use AI to expose yourself to possible approaches without treating the proposal as automatically correct. *Example:* Ask Claude for both DFS-based and Kahn-based topological sorting implementations.
- **Review the proposal for correctness and complexity.** Walk through examples, check assumptions, and estimate runtime and memory use. *Example:* Verify that the algorithm returns an error when the processed node count is smaller than the total node count.
- **Write normal, edge, and failure tests.** Test ordinary behavior, boundary conditions, malformed inputs, and external failures. *Example:* Test a valid DAG, empty graph, duplicate edge, self-loop, cycle, and missing node reference.
- **Explain the completed feature in my own words.** Summarize the problem, solution, algorithm, data flow, trade-offs, and weaknesses without reading the AI conversation. *Example:* Record a short voice explanation of how the application detects prerequisite cycles.
- **Document one architectural decision and its trade-offs.** Build a habit of making engineering reasoning visible and reusable. *Example:* Record why traversal runs in the API service rather than the React client.
- **Add the lesson to the Claude study plugin.** Turn the new concept into reusable questions, exercises, and explanations. *Example:* Add a generator that creates topological-sorting questions from the current codebase.
- **Rebuild one small part without copying the generated answer.** Reimplementation exposes whether you understand the logic or merely recognize the final code. *Example:* Write a basic BFS traversal from a blank file after reviewing the production implementation.
- **Record what I can now explain that I could not explain last week.** Track capability growth rather than measuring progress only through features shipped. *Example:* "I can now explain why a skill tree is usually a DAG rather than a traditional tree."

---

## Priority order

Not a debrief prompt — the order to strengthen skills when time is short. Higher items unlock the ones below them.

```text
1. Systems thinking          — understand the whole problem and system before individual functions
2. Problem decomposition     — divide ambiguous work into responsibilities with clear contracts
3. CS and DSA fundamentals   — the structures and algorithms that explain why the app works
4. Explaining decisions      — communicate why a solution fits and what it sacrifices
5. Detecting AI mistakes     — recognize plausible code that is wrong, insecure, or overcomplicated
6. Testing and evaluation    — repeatable evidence that code and AI outputs meet expectations
7. Operating agentic systems — design, constrain, observe, and improve model+tool systems
8. Communicating the work    — diagrams, docs, walkthroughs, defensible portfolio evidence
```

**Reference.**

1. **Systems thinking.** Understand the complete problem and system before focusing on individual functions. *Example:* Map how skill data moves from the database to the graph renderer before optimizing a React component.
2. **Problem decomposition.** Divide ambiguous product work into smaller responsibilities with clear contracts. *Example:* Separate repository parsing, CS concept detection, lesson generation, and evaluation.
3. **CS and DSA fundamentals.** Learn the structures and algorithms that explain why the application works. *Example:* Understand graphs, traversal, and topological ordering before building advanced skill recommendations.
4. **Explaining technical decisions.** Practice communicating why a solution fits the requirements and what it sacrifices. *Example:* Explain why PostgreSQL is sufficient for the initial graph size despite graph databases offering richer traversal syntax.
5. **Detecting AI mistakes.** Develop the ability to recognize plausible-looking code that is incorrect, insecure, outdated, or unnecessarily complicated. *Example:* Catch an AI-generated function that treats every visited node as evidence of a cycle.
6. **Testing and evaluation.** Build repeatable evidence that deterministic code and AI-generated outputs meet expectations. *Example:* Maintain graph algorithm fixtures and a scored evaluation set for generated study guides.
7. **Operating agentic systems.** Understand how to design, constrain, observe, and improve systems that use models and tools. *Example:* Track which repository files the study agent reads and prevent it from modifying them.
8. **Communicating and demonstrating the work.** Convert technical understanding into diagrams, documentation, walkthroughs, and defensible portfolio evidence. *Example:* Present the plugin as a system that preserves engineering understanding while accelerating development with AI.
