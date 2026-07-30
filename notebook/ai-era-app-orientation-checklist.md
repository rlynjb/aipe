Exactly. That is one of the fastest ways to orient yourself—but ask it in a structured way so the AI does not return a generic architecture summary.

**System design** tells you how the major parts work together. **Software design** tells you how the code inside those parts is organized.

```text
System design
Application → services → database → APIs → external systems

Software design
Modules → interfaces → classes/functions → patterns → dependencies
```

A third layer is equally important: **the domain model**—the real-world concepts and rules represented by the software.

For a skill-tree application:

```text
Domain model:     Skill, prerequisite, progress, learning path
System design:    UI, API, graph service, database, AI service
Software design:  GraphRepository, traversal functions, validators
CS fundamentals:  DAGs, BFS, DFS, topological sorting
```

Here is a reusable orientation prompt:

Orient me to this application or feature as an engineer. Do not only summarize the code.

Explain:

1. **Purpose and user problem**

   * What problem does this solve?
   * Who uses it?
   * What is the expected outcome?

2. **Domain model**

   * What are the main domain concepts?
   * What relationships exist between them?
   * What rules or invariants must always remain true?

3. **System design**

   * What are the major components and system boundaries?
   * Which parts run in the client, server, database, background workers, or external services?
   * How do the components communicate?

4. **Software design**

   * How is the code divided into modules?
   * What are the important interfaces, abstractions, and dependencies?
   * Which software-design patterns are being used?
   * Where is the code tightly coupled or unnecessarily complex?

5. **Execution flow**

   * Identify the main entry points.
   * Walk through one important user action from beginning to end.
   * Explain how data changes as it travels through the system.

6. **Data structures and algorithms**

   * What data structures and algorithms does this feature use?
   * Why were they selected?
   * What are their approximate time and space complexities?
   * What alternatives could have been used?

7. **Data and persistence**

   * What data is stored?
   * What is the database model?
   * How are consistency, transactions, caching, and invalidation handled?

8. **Failure and edge cases**

   * Where can this feature fail?
   * What unusual inputs or race conditions should be considered?
   * How are errors, retries, and partial failures handled?

9. **Security and performance**

   * Where are authentication, authorization, and input validation performed?
   * What could become slow or expensive as usage grows?
   * What assumptions would break at 10× or 100× scale?

10. **Design decisions**

    * What important decisions were made?
    * What trade-offs were accepted?
    * What alternative designs should I compare?

11. **Learning path**

    * Which computer-science and software-engineering concepts should I study to fully understand this implementation?
    * Point me to the most important files, symbols, and functions in the order I should inspect them.

For every claim, reference the relevant file path, function, class, type, or database table. Clearly separate facts visible in the code from your own inferences.

Finish with:

* a concise architecture diagram,
* the five most important files to read,
* five questions that test whether I truly understand the feature,
* and one small redesign exercise.

## The quickest orientation sequence

Use the prompt in this order:

```text
1. What problem does this feature solve?
             ↓
2. What is the domain model?
             ↓
3. What is the system design?
             ↓
4. Trace one complete execution flow
             ↓
5. What is the software design?
             ↓
6. What CS principles power it?
             ↓
7. What can fail, and what trade-offs were made?
```

The most valuable step is usually **tracing one complete flow**. Architecture diagrams can remain abstract, but following a real action forces you to connect the layers:

```text
User connects two skill nodes
        ↓
React event handler
        ↓
API request
        ↓
Authorization
        ↓
Cycle validation using graph traversal
        ↓
Database transaction
        ↓
Updated graph returned
        ↓
UI rerenders
```

After the AI explains it, test yourself with:

> “Now hide the explanation and interview me about this feature one question at a time.”

That changes the process from passively receiving an AI summary to actively building a mental model.
