[← Contents](README.md)

# 2. Orient to an application or feature

Use this sequence:

```text
Purpose
  ↓
Domain model
  ↓
System design
  ↓
One complete execution flow
  ↓
Software design
  ↓
Data and technical foundations
  ↓
Failures and trade-offs
```

## 2.1 Purpose and outcome

- [ ] What problem does this solve?
- [ ] Who experiences the problem?
- [ ] What outcome should the user receive?
- [ ] What is in and out of scope?
- [ ] What does success look like?

**Example:** The goal is not merely “render a graph.” It is “help learners understand what they can study next and why.”

---

## 2.2 Domain model and invariants

- [ ] What are the central domain concepts?
- [ ] How do they relate?
- [ ] What states can they enter?
- [ ] What rules must always remain true?
- [ ] Which terms are ambiguous or inconsistently named?

### Example

```text
Skill
Prerequisite relationship
Learning path
Completion state
Recommendation
```

```text
A skill cannot depend on itself.
A deleted skill cannot remain a prerequisite.
A read-only learner cannot modify the curriculum.
A prerequisite graph may not contain cycles.
```

---

## 2.3 System design and boundaries

- [ ] What are the major components?
- [ ] What runs in the client, server, database, worker, or external service?
- [ ] Which component owns canonical state?
- [ ] How do components communicate?
- [ ] Which dependencies are outside the team’s control?

```text
Graph editor UI
    ↓ HTTP
Graph API
    ↓
Graph service
    ├── Relationship validator
    ├── Recommendation engine
    └── Graph repository
             ↓
          PostgreSQL
```

---

## 2.4 One complete execution flow

Trace a real action rather than reading files randomly.

- [ ] Identify the event and entry point.
- [ ] Follow data across every boundary.
- [ ] Note validation and authorization.
- [ ] Note transformation, persistence, and transactions.
- [ ] Identify side effects, cache changes, events, or background work.
- [ ] Follow success and failure responses back to the caller.

```text
User connects two skill nodes
        ↓
React event handler
        ↓
API request
        ↓
Authorization
        ↓
Cycle validation
        ↓
Database transaction
        ↓
Cache invalidation
        ↓
Updated graph response
        ↓
UI rerender
```

---

## 2.5 Software design

- [ ] How is the code divided into modules?
- [ ] What are the important public interfaces?
- [ ] What does each module own?
- [ ] What dependencies exist between modules?
- [ ] Which abstractions represent domain concepts?
- [ ] Which modules must be understood together?
- [ ] Where is the design tightly coupled or fragmented?

Produce a small dependency diagram before trying to understand every file.

---

## 2.6 Data and technical foundations

- [ ] What data is canonical, cached, derived, temporary, or persisted?
- [ ] What consistency and transaction guarantees are required?
- [ ] How are caches populated and invalidated?
- [ ] How are concurrent updates handled?
- [ ] What data structures and algorithms are used?
- [ ] Why were they selected, and what alternatives exist?
- [ ] What are the dominant time and space costs?

**Example:** A skill graph may use an adjacency list, DFS for cycle detection, topological sorting for learning order, and BFS for nearby recommendations.

---

## 2.7 Failure, security, and scale boundaries

- [ ] Where can the feature fail?
- [ ] Which inputs may be invalid, duplicated, delayed, or incomplete?
- [ ] What race conditions or partial failures are possible?
- [ ] Where are authentication, authorization, and validation enforced?
- [ ] What information is sensitive?
- [ ] What becomes slow or expensive as usage grows?
- [ ] What assumptions break at 10× or 100× scale?
- [ ] How are low-level failures translated into useful domain responses?

---

[← 1. Source of truth](01-source-of-truth.md) · [Contents](README.md) · [3. Philosophy review →](03-philosophy-review.md)
