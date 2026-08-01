# Code Orientation Prompt Library

Quick-reference for orienting yourself to an unfamiliar app or feature with an AI agent — structured so you get a real engineer's mental model, not a generic architecture summary. Ask in layers, trace one real flow, then make the AI quiz you.

**Three layers to separate (plus the CS underneath):**

```text
Domain model      the real-world concepts and rules the software represents
System design     how the major parts work together (app → services → db → APIs)
Software design   how the code inside those parts is organized (modules → interfaces → functions → patterns)
```

*Skill-tree app, mapped across the layers:*

```text
Domain model:     Skill, prerequisite, progress, learning path
System design:    UI, API, graph service, database, AI service
Software design:  GraphRepository, traversal functions, validators
CS fundamentals:  DAGs, BFS, DFS, topological sorting
```

---

## Index

| # | Prompt | What it does | Reach for it when |
|---|--------|--------------|-------------------|
| 1 | [**Master orientation**](#master-orientation-prompt) | Full 11-part orientation → diagram, 5 files, 5 questions, exercise | First contact with an app or feature |
| 2 | [**Quick sequence**](#quick-orientation-sequence) | 7 questions in order — a lighter pass | Short on time, or already partly familiar |
| 3 | [**Interview-me self-test**](#interview-me-self-test) | Flips the AI from summarizer to examiner | After orientation, to test real understanding |

Reference (not prompts): [The three layers](#the-three-layers) · [Trace one flow](#trace-one-flow)

---

## Master orientation prompt

**What it does:** The full pass — purpose, domain model, system design, software design, execution flow, DS&A, persistence, failure cases, security/performance, design decisions, and a learning path. Forces file/symbol citations and evidence-vs-inference separation, and ends with a diagram, the five files to read first, five comprehension questions, and a redesign exercise.

```text
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
```

---

## Quick orientation sequence

**What it does:** The same orientation in a lighter, ordered pass — seven questions that build on each other. Run top to bottom; the highest-value step is tracing one complete flow, since it forces you to connect the layers.

```text
Orient me to this feature by answering these in order, each building on the last:

1. What problem does this feature solve?
2. What is the domain model?
3. What is the system design?
4. Trace one complete execution flow.
5. What is the software design?
6. What CS principles power it?
7. What can fail, and what trade-offs were made?

Cite the relevant file and symbol for each answer; separate code facts from inference.
```

---

## Interview-me self-test

**What it does:** Turns passive reception into active model-building. After the AI explains the feature, this flips it from summarizer to examiner — one question at a time — so you find out what you actually understand.

```text
Now hide the explanation and interview me about this feature one question at a
time. Wait for my answer before revealing yours, and ask a follow-up whenever my
answer is incomplete.
```

---

## The three layers

Keep these distinct when you read any system — conflating them is what produces vague explanations:

```text
Domain model      the real-world concepts and rules represented by the software
System design     application → services → database → APIs → external systems
Software design   modules → interfaces → classes/functions → patterns → dependencies
```

System design tells you how the major parts work together. Software design tells you how the code inside those parts is organized. The domain model tells you what real-world concepts and rules the code exists to serve.

---

## Trace one flow

Architecture diagrams stay abstract; following a real action forces the layers to connect. Pick one important user action and trace it end to end — for example, connecting two skill nodes:

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
