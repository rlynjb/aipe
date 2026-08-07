# APOSD Architecture-Teaching Prompt Library

Quick-reference for learning the architecture of an existing application using *A Philosophy of Software Design*. These prompts do not merely describe files—they teach how complexity is divided, which modules own decisions, what information is hidden, and why the system has its current boundaries.

The goal is to move from:

```text
I know where the code is.
```

to:

```text
I understand why these modules exist,
what complexity they hide,
and how changes propagate through the system.
```

---

## Index

| #  | Prompt                   | What it teaches                       | Reach for it when                 |
| -- | ------------------------ | ------------------------------------- | --------------------------------- |
| 1  | **Compact daily**        | Architecture in one teaching pass     | Default                           |
| 2  | **Master**               | Full architecture lesson              | Learning a major app/feature      |
| 3  | **System map**           | Major modules and relationships       | First orientation                 |
| 4  | **Execution flow**       | Runtime architecture                  | You know files but not flow       |
| 5  | **Responsibility map**   | Who owns each decision                | Ownership is unclear              |
| 6  | **Deep modules**         | Interface vs hidden complexity        | Learning module design            |
| 7  | **Information hiding**   | What knowledge lives where            | Understanding boundaries          |
| 8  | **Complexity map**       | Where complexity concentrates         | App feels difficult to understand |
| 9  | **Change amplification** | How changes propagate                 | Testing architecture quality      |
| 10 | **Teach from scratch**   | Reconstruct architecture conceptually | Best learning exercise            |
| 11 | **Quiz me**              | Active-recall architecture test       | After studying                    |

---

## Recommended learning sequence

```text
User behavior
    ↓
System map
    ↓
Execution flow
    ↓
Responsibilities
    ↓
Interfaces
    ↓
Hidden information
    ↓
Complexity
    ↓
Change propagation
    ↓
Trade-offs
    ↓
Rebuild mentally
```

---

## 1. Compact daily prompt

```text
Teach me the architecture of this application using APOSD principles.

Do not merely summarize directories or files.

Explain:

1. What the application does.
2. The major architectural modules.
3. What responsibility each module owns.
4. The main execution and data flows.
5. The public interface of each important module.
6. What complexity each module hides.
7. What information each module owns.
8. Which modules are deep versus shallow.
9. Where knowledge is duplicated or leaked.
10. Where complexity is concentrated.
11. How a realistic feature change propagates.
12. The most important architectural trade-offs.

For every architectural claim, point to concrete files and symbols.

Separate:

- Codebase evidence
- Architectural interpretation
- APOSD assessment

Finish with:

- ASCII architecture diagram
- 5 most important files to read
- 5 concepts I should understand
- 5 questions that test my understanding
```

---

## 2. Master architecture-teaching prompt

```text
Teach me this application's architecture using A Philosophy of Software Design.

Assume I need to understand the system well enough to modify it without relying
blindly on AI.

Do not begin by listing files.

## 1. Start with behavior

Explain:

- What problem the system solves
- Main user workflows
- Major system responsibilities
- Important state
- External dependencies

## 2. System decomposition

Identify the major modules.

For each module explain:

- Responsibility
- Public interface
- Internal implementation
- State owned
- Dependencies
- Callers
- Decisions owned

## 3. Execution architecture

Choose 2–3 representative user actions.

Trace each:

Trigger
→ entry point
→ orchestration
→ domain logic
→ persistence
→ external effects
→ state synchronization
→ response

Point to files and symbols at every important step.

## 4. Responsibility architecture

For every important business or technical decision identify:

- Decision
- Authoritative module
- Consumers
- Why that module owns it
- Where the knowledge could otherwise be duplicated

## 5. Information hiding

For each major module explain:

- What callers know
- What callers do not need to know
- Implementation decisions hidden
- Volatile knowledge hidden
- Whether anything leaks through the interface

## 6. Module depth

Evaluate major modules as:

- Deep
- Reasonably deep
- Shallow
- Pass-through

Explain the ratio between interface complexity and functionality hidden.

## 7. Complexity map

Identify complexity caused by:

- Dependencies
- Obscurity
- Change amplification
- Temporal coupling
- Shared mutable state
- Multiple representations
- Multiple sources of truth
- Configuration
- Error handling

Explain where complexity is deliberately contained versus accidentally spread.

## 8. Interface design

For important interfaces explain:

- Concepts exposed
- Knowledge required from callers
- Defaults
- Errors
- Special cases
- Whether the interface exposes implementation details

## 9. Change propagation

Test the architecture with:

- Small behavior change
- New business rule
- New caller
- New persistence mechanism
- New external provider

For each show which modules change and why.

## 10. Architectural trade-offs

Explain:

- What the architecture optimizes for
- Complexity it accepts
- Complexity it avoids
- Where a simpler architecture might work
- Where additional abstraction is justified

## 11. Rebuild it mentally

Pretend the implementation disappeared.

Teach me how to reconstruct the architecture from requirements alone:

1. Domain concepts
2. Invariants
3. Responsibilities
4. Modules
5. Interfaces
6. Data flow
7. Persistence
8. External boundaries

## 12. Learning summary

Return:

- Architecture diagram
- Responsibility map
- Execution-flow diagram
- Important interfaces
- Deep modules
- Information-hiding boundaries
- Complexity hotspots
- Change-impact examples
- 5 files to study
- 5 APOSD concepts demonstrated by the app
- 10 interview-style questions

Clearly distinguish codebase evidence from your architectural interpretation.
```

---

## 3. System map

```text
Teach me the high-level architecture of this application.

Identify the 5–10 most important modules.

For each show:

Module
Responsibility
Public interface
State owned
Dependencies
Callers
Complexity hidden

Then draw:

User
 ↓
Entry points
 ↓
Application/domain modules
 ↓
Infrastructure
 ↓
Persistence/external systems

Do not include every utility or file.
Show only architecture-significant components.
```

---

## 4. Execution flow

```text
Teach me the architecture through this user action:

[action]

Trace it end to end.

At each step explain:

- File and symbol
- Responsibility
- Input
- Output
- State read/written
- Collaborator
- Decision made
- Complexity hidden from the previous layer

Finish with an ASCII sequence diagram.
```

---

## 5. Responsibility map

```text
Map the architecture by decisions rather than directories.

For every important decision identify:

- Decision
- Authoritative module
- Why it belongs there
- Callers that need the result
- Knowledge hidden from callers
- Other places that duplicate the decision

Then identify unclear or fragmented ownership.
```

---

## 6. Deep modules

```text
Evaluate the important modules using APOSD's deep-module principle.

For each module show:

Interface complexity
        vs
Functionality/complexity hidden

Classify it:

- Deep
- Moderate
- Shallow
- Pass-through

Explain what callers must understand and what they are protected from.

Do not judge depth based on lines of code.
```

---

## 7. Information hiding

```text
Teach me what information the architecture hides.

For each major design decision ask:

- Where does this knowledge live?
- Which module owns it?
- Which modules know about it?
- Which modules should not know about it?
- What happens if this decision changes?

Look for leaked:

- Storage knowledge
- Provider knowledge
- Validation rules
- State-transition rules
- Serialization
- Retry behavior
- Configuration
- Business rules
```

---

## 8. Complexity map

```text
Create a complexity map of this application.

Identify complexity caused by:

- Change amplification
- Cognitive load
- Unknown dependencies
- Temporal coupling
- Shared state
- Configuration
- Error propagation
- Multiple representations
- Cross-module knowledge

For each hotspot explain:

Where it originates
Where it is contained
Where it leaks
Why developers must understand it
```

---

## 9. Change amplification

```text
Teach me the architecture by changing it hypothetically.

Suppose I add:

[feature/change]

Do not implement it.

Show:

- Entry points affected
- Modules affected
- Interfaces affected
- State affected
- Persistence affected
- Tests affected

Then explain what the change surface reveals about the architecture.

Highlight duplicated knowledge and weak boundaries.
```

---

## 10. Teach from scratch

```text
Pretend I cannot see the implementation.

Using what you learned from the codebase, teach me how I could design this
feature from scratch.

Start with:

Behavior
→ domain concepts
→ invariants
→ responsibilities
→ modules
→ interfaces
→ execution flow
→ persistence

Afterward compare this conceptual design with the actual implementation.

Explain why they differ.
```

---

## 11. Quiz me

```text
Quiz me about this application's architecture one question at a time.

Progress through:

1. User behavior
2. Execution flow
3. Responsibilities
4. State ownership
5. Interfaces
6. Information hiding
7. Module depth
8. Complexity
9. Change impact
10. Trade-offs

Wait for my answer.

If my answer is incomplete, ask a probing follow-up before explaining it.
```

---

## Final teaching principle

Do not teach architecture as:

```text
Here are the folders and classes.
```

Teach it as:

```text
What decisions exist?
Who owns them?
What does each module expose?
What does each module hide?
How does behavior flow through them?
Where is complexity contained?
What changes together?
Why?
```

Architecture understanding means understanding the **placement of complexity**, not memorizing the repository tree.
