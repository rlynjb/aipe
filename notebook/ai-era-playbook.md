# Principles-First AI-Era Application Design Playbook

> **Purpose:** Orient to, design, review, implement, and coordinate applications with AI while retaining ownership of the system’s mental model and complexity.
>
> The separate AI-era software-engineering study checklist is intentionally excluded. This file is for real application and feature work.

## Table of contents

- [Core model](#core-model)
- [1. Establish the project source of truth](#1-establish-the-project-source-of-truth)
  - [1.1 Separate kinds of information](#11-separate-kinds-of-information)
  - [1.2 Maintain one project control page](#12-maintain-one-project-control-page)
  - [1.3 Use traceable IDs](#13-use-traceable-ids)
  - [1.4 Track unknowns and decisions](#14-track-unknowns-and-decisions)
- [2. Orient to an application or feature](#2-orient-to-an-application-or-feature)
  - [2.1 Purpose and outcome](#21-purpose-and-outcome)
  - [2.2 Domain model and invariants](#22-domain-model-and-invariants)
  - [2.3 System design and boundaries](#23-system-design-and-boundaries)
  - [2.4 One complete execution flow](#24-one-complete-execution-flow)
  - [2.5 Software design](#25-software-design)
  - [2.6 Data and technical foundations](#26-data-and-technical-foundations)
  - [2.7 Failure, security, and scale boundaries](#27-failure-security-and-scale-boundaries)
- [3. Review the design using *A Philosophy of Software Design*](#3-review-the-design-using-a-philosophy-of-software-design)
  - [3.1 Essential versus accidental complexity](#31-essential-versus-accidental-complexity)
  - [3.2 Change amplification](#32-change-amplification)
  - [3.3 Cognitive load](#33-cognitive-load)
  - [3.4 Unknown unknowns](#34-unknown-unknowns)
  - [3.5 Module depth](#35-module-depth)
  - [3.6 Information hiding and leakage](#36-information-hiding-and-leakage)
  - [3.7 Interface design and “do the whole job”](#37-interface-design-and-do-the-whole-job)
  - [3.8 Pass-through layers and coupling](#38-pass-through-layers-and-coupling)
  - [3.9 General-purpose versus special-purpose design](#39-general-purpose-versus-special-purpose-design)
  - [3.10 Errors, configuration, consistency, and documentation](#310-errors-configuration-consistency-and-documentation)
  - [3.11 Strategic versus tactical programming](#311-strategic-versus-tactical-programming)
  - [3.12 Design it twice](#312-design-it-twice)
- [4. Use AI without surrendering design ownership](#4-use-ai-without-surrendering-design-ownership)
  - [4.1 Ground the AI in the real project](#41-ground-the-ai-in-the-real-project)
  - [4.2 Ask for analysis before edits](#42-ask-for-analysis-before-edits)
  - [4.3 Require evidence](#43-require-evidence)
  - [4.4 Keep changes small and vertical](#44-keep-changes-small-and-vertical)
  - [4.5 Review AI-generated complexity](#45-review-ai-generated-complexity)
- [5. Coordinate delivery and change](#5-coordinate-delivery-and-change)
  - [5.1 Deliver vertical slices](#51-deliver-vertical-slices)
  - [5.2 Map dependencies and the critical path](#52-map-dependencies-and-the-critical-path)
  - [5.3 Use meetings to make decisions](#53-use-meetings-to-make-decisions)
  - [5.4 Give decision-oriented status updates](#54-give-decision-oriented-status-updates)
  - [5.5 Analyze requirement changes](#55-analyze-requirement-changes)
  - [5.6 Keep three planning horizons](#56-keep-three-planning-horizons)
- [6. Reusable review gates](#6-reusable-review-gates)
  - [6.1 Fast orientation](#61-fast-orientation)
  - [6.2 Before implementation](#62-before-implementation)
  - [6.3 After implementation](#63-after-implementation)
- [7. Unified AI prompt](#7-unified-ai-prompt)
- [8. Completion standard](#8-completion-standard)
- [Final reminder](#final-reminder)

---

## Core model

```text
Application orientation
What exists, why it exists, and how it works
        ↓
A Philosophy of Software Design
How effectively the design contains complexity
        ↓
Project operating system
How requirements, decisions, dependencies, and changes stay visible
```

Ask three questions:

1. **Orientation:** What is this application or feature, and how does it work?
2. **Design quality:** What complexity is exposed, duplicated, obscure, or avoidable?
3. **Execution:** What must be decided, built, tested, coordinated, and communicated next?

---

# 1. Establish the project source of truth

## 1.1 Separate kinds of information

Do not mix everything into one task list.

| Category | Meaning |
| --- | --- |
| **Goal** | The outcome the project should produce |
| **Scope** | What is included and excluded |
| **Requirement** | What the system must do |
| **Constraint** | Security, performance, platform, timeline, or policy limits |
| **Decision** | What was selected, why, and by whom |
| **Unknown** | A question that still needs an answer |
| **Dependency** | Another team, API, design, approval, or dataset |
| **Risk** | Something that may delay or weaken the outcome |
| **Task** | Concrete implementation work |
| **Test** | Evidence that a requirement is satisfied |

### Example

```text
Goal: Help learners understand what to study next.
Requirement: Users can view prerequisite relationships.
Decision: Represent prerequisites as a directed graph.
Unknown: Can a skill have multiple prerequisite paths?
Dependency: Product must define prerequisite rules.
Risk: Large graphs may become unreadable.
Task: Implement the graph layout adapter.
Test: Verify prerequisite edges render correctly.
```

A requirement is not a task, and a decision is not a requirement.

---

## 1.2 Maintain one project control page

Keep one short page that reflects the current state and points to detailed specifications.

```markdown
# Project: [Name]

## Goal
[Desired outcome]

## In scope
- ...

## Out of scope
- ...

## Requirements
- REQ-01:
- REQ-02:

## Constraints
- ...

## Open questions
- Q-01:
- Q-02:

## Decisions
- DEC-01:
- DEC-02:

## Dependencies
- ...

## Top risks
- ...

## Current testable slice
- ...

## Now / Next / Later
### Now
- ...
### Next
- ...
### Later
- ...
```

---

## 1.3 Use traceable IDs

Give important requirements, decisions, tasks, and tests stable identifiers.

```text
REQ-04: Unauthorized users cannot edit graph relationships.
DEC-07: The server owns the canonical graph.
TASK-18: Add server-side relationship validation.
TEST-12: Verify read-only users receive a forbidden response.
```

Trace important behavior:

```text
Goal
  ↓
Requirement
  ↓
Design decision
  ↓
Task
  ↓
Test
  ↓
Released behavior
```

---

## 1.4 Track unknowns and decisions

Every consequential unknown should have an owner, decision point, consequence, and temporary assumption if needed.

| ID | Question | Owner | Needed by | Status | Default assumption |
| --- | --- | --- | --- | --- | --- |
| Q-01 | Can a skill have multiple parents? | Product | Aug 3 | Open | Assume yes |
| Q-02 | Maximum graph size? | Data | Aug 4 | Investigating | Design for 1,000 nodes |

Record significant decisions:

```markdown
# DEC-[ID]: [Title]

## Context
Why was a decision required?

## Options
1. ...
2. ...

## Decision
What was selected?

## Reason
Why does it fit the current requirements?

## Trade-offs
What becomes harder, slower, or less flexible?

## Consequences
What modules, requirements, or teams are affected?
```

---

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

# 3. Review the design using *A Philosophy of Software Design*

The central question is:

> **How effectively does this design contain complexity?**

Evaluate the three symptoms:

1. **Change amplification:** A small change requires many edits.
2. **Cognitive load:** A developer must understand too much at once.
3. **Unknown unknowns:** Important facts or dependencies are difficult to discover.

The common causes are excessive dependencies and obscurity.

---

## 3.1 Essential versus accidental complexity

- [ ] What complexity is inherent in the problem?
- [ ] What complexity was introduced by the implementation?
- [ ] What is the simplest useful mental model?
- [ ] Which concepts exist only because of a framework or chosen decomposition?
- [ ] What could be removed without weakening the required behavior?

**Example:** Cycle detection is essential for a DAG. Requiring callers to manually maintain traversal state is accidental interface complexity.

---

## 3.2 Change amplification

- [ ] What files must change for a typical modification?
- [ ] Is the same rule repeated in schemas, UI checks, services, and tests?
- [ ] Which small change spreads across unrelated modules?
- [ ] Which knowledge could be consolidated?

Choose one realistic change and trace every affected location. A long or surprising list may expose duplicated knowledge or information leakage.

---

## 3.3 Cognitive load

- [ ] What must a developer remember to use or modify the feature correctly?
- [ ] Which modules must be read together?
- [ ] Are there hidden ordering, setup, cleanup, or lifecycle requirements?
- [ ] Must callers understand implementation details?
- [ ] Which facts could be absorbed by a deeper abstraction?

List the five facts a developer currently needs to remember and identify which ones the design could eliminate.

---

## 3.4 Unknown unknowns

- [ ] Which dependencies or side effects are difficult to discover?
- [ ] Which behaviors are not evident from names, types, interfaces, or nearby documentation?
- [ ] Can a locally reasonable change silently break another area?
- [ ] Which assumptions are enforced only by convention?
- [ ] Where would a new developer make the wrong first guess?
- [ ] What hidden fact should become explicit, enforced, or encapsulated?

---

## 3.5 Module depth

A **deep module** provides substantial capability behind a comparatively simple interface. A **shallow module** adds an interface without hiding meaningful complexity.

For each important module:

- [ ] What useful capability does it provide?
- [ ] How complicated is its public interface?
- [ ] What knowledge does it hide?
- [ ] Does it reduce what callers must understand?
- [ ] Is it deep, acceptable, shallow, or pass-through?
- [ ] Could several shallow modules become one deeper module?

```text
Deep: substantial capability behind a small interface.
Acceptable: clear responsibility and reasonable interface.
Shallow: interface complexity is close to implementation complexity.
Pass-through: mostly forwards calls or mirrors another layer.
```

---

## 3.6 Information hiding and leakage

- [ ] What specialized knowledge does each module own?
- [ ] Is that knowledge contained in one place?
- [ ] Which implementation details leak through public interfaces?
- [ ] Do callers know storage formats, cache keys, retry rules, parsing details, or lifecycle sequencing?
- [ ] Is the same decision repeated across modules?
- [ ] Can related knowledge be brought together?

For each leak:

```text
Information leaking:
Modules that know it:
Dependency created:
Where the knowledge should live:
```

---

## 3.7 Interface design and “do the whole job”

- [ ] Can the common task be completed through one obvious call?
- [ ] Does the interface expose a domain operation or a low-level procedure?
- [ ] Are callers providing values the module could determine?
- [ ] Are there boolean flags or methods that must be called in order?
- [ ] Are safe defaults available?
- [ ] Is the caller coordinating validation, persistence, caching, cleanup, retries, or error conversion?
- [ ] Can a module with the relevant knowledge own the whole operation?
- [ ] Can the interface be used correctly without reading the implementation?

Less contained:

```text
beginGraphUpdate()
validateEdge()
persistEdge()
invalidateGraphCache()
publishGraphEvent()
endGraphUpdate()
```

More contained:

```text
addPrerequisite(sourceSkillId, targetSkillId)
```

---

## 3.8 Pass-through layers and coupling

- [ ] Which methods merely forward arguments?
- [ ] Which layers expose nearly the same interface as the layer below?
- [ ] Does each layer provide a distinct abstraction or policy?
- [ ] Which modules frequently change together?
- [ ] Which modules know too much about one another?
- [ ] Are dependencies based on stable abstractions or volatile details?
- [ ] Are there circular dependencies?
- [ ] Which dependency creates the greatest maintenance risk?
- [ ] Could a layer be removed or given meaningful responsibility?

Trace one call stack and label what each layer adds:

```text
Abstraction
Policy
Validation
Translation
Only forwarding
```

---

## 3.9 General-purpose versus special-purpose design

- [ ] Which code is reusable mechanism?
- [ ] Which code is application-specific policy?
- [ ] Are these concerns mixed?
- [ ] Has an abstraction been generalized beyond current needs?
- [ ] Is a supposedly generic abstraction shaped around one special case?
- [ ] What is the simplest reasonably general interface that satisfies current requirements?

Do not create speculative abstractions unless they simplify the present system.

---

## 3.10 Errors, configuration, consistency, and documentation

- [ ] Are errors handled where enough context exists to resolve or translate them?
- [ ] Do callers need to understand infrastructure-specific failures?
- [ ] Which configuration could be automatic or have safe defaults?
- [ ] Are there unexplained thresholds, timeouts, or constants?
- [ ] Do similar operations follow similar naming and API conventions?
- [ ] Does the obvious usage usually produce correct behavior?
- [ ] Are contracts, invariants, side effects, and assumptions documented?
- [ ] Do comments explain why rather than narrate code?
- [ ] Is important documentation located where developers will discover it?

List places where a developer’s first reasonable assumption would be wrong.

---

## 3.11 Strategic versus tactical programming

- [ ] Which code was optimized only for immediate delivery?
- [ ] Where was complexity deferred to future developers?
- [ ] Which patch, duplicated condition, or special case became permanent?
- [ ] Which modest redesign would reduce repeated future work?
- [ ] Which shortcuts are justified by current constraints?
- [ ] Which shortcuts are avoidable design debt?

Strategic programming means making modest investments that reduce future complexity, not adding speculative architecture.

---

## 3.12 Design it twice

Compare at least two meaningfully different designs before committing to a consequential choice.

| Dimension | Option A | Option B |
| --- | --- | --- |
| Public interface complexity | | |
| Information hidden | | |
| Dependencies | | |
| Change amplification | | |
| Cognitive load | | |
| Discoverability | | |
| Testability | | |
| Migration cost | | |
| Future flexibility | | |

Prefer the design that provides the clearest deep abstraction for current needs—not the one with the most patterns, classes, or layers.

---

# 4. Use AI without surrendering design ownership

## 4.1 Ground the AI in the real project

Provide:

- User problem and desired outcome
- Domain concepts and invariants
- Current architecture and boundaries
- Existing interfaces and conventions
- Requirements and constraints
- Known decisions
- Open questions and assumptions
- Acceptance criteria
- Relevant files and symbols

Avoid vague prompts such as “improve this architecture.”

---

## 4.2 Ask for analysis before edits

Require AI to explain:

- The current mental model
- One complete execution flow
- Existing abstractions and dependencies
- Sources of complexity
- Proposed change
- Alternatives and trade-offs
- Files likely to change
- Risks and validation plan

Review the proposal before broad modifications.

---

## 4.3 Require evidence

For every AI conclusion:

- [ ] Reference the relevant file, symbol, type, interface, API, or table.
- [ ] Separate code facts from inference.
- [ ] Explain why the finding matters.
- [ ] Give a concrete improvement when appropriate.
- [ ] State uncertainty when evidence is incomplete.

---

## 4.4 Keep changes small and vertical

Prefer observable, testable slices:

```text
Slice 1: Render a static graph
Slice 2: Load graph data from the API
Slice 3: Add prerequisite validation
Slice 4: Persist relationships
Slice 5: Add permissions
Slice 6: Test large-graph behavior
```

For each slice, define:

```text
User outcome
Requirements covered
Design decisions
Frontend changes
Backend changes
Data changes
Dependencies
Tests
Definition of done
```

---

## 4.5 Review AI-generated complexity

After AI proposes or implements a change:

- [ ] Did it add shallow modules or pass-through layers?
- [ ] Did implementation details escape through interfaces?
- [ ] Did it duplicate existing knowledge?
- [ ] Did it introduce unnecessary configuration or special cases?
- [ ] Did it split one conceptual task across modules?
- [ ] Did it increase change amplification, cognitive load, or unknown unknowns?
- [ ] What complexity did it remove?
- [ ] What complexity did it add?

Code is not complete merely because it compiles or passes a narrow test.

---

# 5. Coordinate delivery and change

## 5.1 Deliver vertical slices

Avoid organizing the entire project as:

```text
All backend
Then all frontend
Then all tests
Then integration
```

Prefer:

```text
One observable behavior
        ↓
Validation
        ↓
Learning
        ↓
Next slice
```

Each slice should produce something demonstrable and testable.

---

## 5.2 Map dependencies and the critical path

- [ ] Which work can proceed independently?
- [ ] Which work depends on a decision, API, design, or dataset?
- [ ] Which dependency determines the finish date?
- [ ] What can be mocked or temporarily assumed?
- [ ] What happens if a dependency remains unresolved?

Not every unfinished task has equal impact.

---

## 5.3 Use meetings to make decisions

Before:

```text
Context
What changed
Questions requiring decisions
Recommended option
Trade-offs
Consequence of delaying
```

During:

```text
Decision
Owner
Deadline
Follow-up action
```

After: update the shared source of truth. Do not leave the current project state only in meeting notes or chat.

---

## 5.4 Give decision-oriented status updates

```markdown
## Completed
- ...

## Next
- ...

## Blocked
- ...

## Decisions needed
- ...

## Risks
- ...

## Changes since last update
- ...
```

Avoid updates that only say “still working on it.”

---

## 5.5 Analyze requirement changes

When something changes:

- [ ] What changed and why?
- [ ] Which requirements and decisions are affected?
- [ ] Which modules, interfaces, schemas, and tests are affected?
- [ ] Which completed work needs revision?
- [ ] What new work, dependencies, or risks are introduced?
- [ ] Does the change reveal information leakage or change amplification?
- [ ] Is a local patch sufficient, or should the abstraction change?
- [ ] What becomes delayed, removed, or traded off?
- [ ] Who approves the trade-off?

### Example

```text
Change:
Allow users to edit prerequisite graphs.

New implications:
Authorization
Server-side validation
Conflict handling
Audit history
New UI states
Additional tests
Possible redesign of the graph module
```

---

## 5.6 Keep three planning horizons

### Now
Detailed and immediately actionable.

### Next
Roughly decomposed.

### Later
Outcome-level only.

Do not create detailed plans so far ahead that maintaining the plan becomes extra work.

---

# 6. Reusable review gates

These are summaries of the main playbook, not separate checklists to maintain.

## 6.1 Fast orientation

```text
1. What user outcome does this produce?
2. What are the domain concepts and invariants?
3. What are the major components and boundaries?
4. Who owns canonical state?
5. What is one complete execution flow?
6. What are the important interfaces and dependencies?
7. What data and algorithms matter?
8. Where can it fail?
9. What is the strongest coupling?
10. Which files and symbols should I inspect first?
```

---

## 6.2 Before implementation

```text
1. Is the requirement separate from the proposed implementation?
2. What complexity is essential?
3. What knowledge should one module hide?
4. What should callers not need to know?
5. What is the simplest interface that performs the whole common task?
6. What dependencies will this introduce?
7. What future change could expose information leakage?
8. What are two meaningfully different designs?
9. Which design best reduces the three symptoms of complexity?
10. What is the smallest testable vertical slice?
```

---

## 6.3 After implementation

```text
1. Can the feature be used correctly without reading its implementation?
2. Did implementation details leak?
3. Does the caller coordinate work a module should own?
4. Are there shallow or pass-through layers?
5. Is knowledge duplicated?
6. Are important behaviors obvious from names, types, and documentation?
7. What small future change would require multiple edits?
8. What complexity was removed and added?
9. What decision and trade-off should be recorded?
10. Which requirement and test prove completion?
```

---

# 7. Unified AI prompt

```text
Orient me to this application or feature as an engineer, then review how effectively its design contains complexity using John Ousterhout’s A Philosophy of Software Design.

Do not merely summarize the repository or list design patterns.

For every conclusion:
- Reference the relevant file, module, class, function, type, interface, API, or database table.
- Separate facts visible in the code from interpretation.
- Explain why the issue matters for future development.
- Give a concrete improvement when appropriate.
- State uncertainty when evidence is incomplete.

Explain:

1. Purpose and scope
- What user problem does this solve?
- Who uses it?
- What outcome does it produce?
- What is in and out of scope?

2. Domain model
- What are the central concepts and relationships?
- What invariants must always remain true?

3. System design
- What are the major components and boundaries?
- What runs in the client, server, database, worker, or external service?
- Which component owns canonical state?
- How do components communicate?

4. Execution flow
- Identify the main entry points.
- Trace one important action end to end.
- Include validation, authorization, persistence, side effects, and failures.

5. Software design
- What are the major modules and public interfaces?
- What does each module own?
- What are the important dependencies and strongest coupling?

6. Data and technical foundations
- What data is stored, cached, derived, or transient?
- What data structures and algorithms are used?
- What are the dominant time and space costs?

7. Complexity review
- What complexity is essential and what was introduced by the implementation?
- Where is there change amplification?
- What creates cognitive load?
- What important facts are unknown unknowns?
- Which modules are deep, shallow, or pass-through?
- Where does information leak?
- Which callers coordinate work a module should absorb?
- Where are configuration, errors, or special cases unnecessarily exposed?
- Which code is tactical rather than strategic?

8. Reliability and scale
- Where can the feature fail?
- What edge cases, race conditions, or partial failures exist?
- Where are authentication, authorization, and input validation enforced?
- What assumptions break at 10× or 100× usage?

9. Design it twice
- Select the most consequential design area.
- Propose two meaningfully different alternatives.
- Compare interface complexity, information hiding, dependencies, change amplification, cognitive load, testability, migration cost, and flexibility.

Finish with:
- A concise mental model
- An ASCII system and dependency diagram
- The five most important files and symbols
- The three largest sources of complexity
- The best-designed module
- The highest-risk design area
- The top five improvements ranked by complexity reduction
- Five questions that test whether I understand the feature
```

---

# 8. Completion standard

Before treating a feature as complete:

- [ ] The user problem, scope, and outcome are clear.
- [ ] Requirements, constraints, decisions, and assumptions are recorded.
- [ ] The domain model and invariants are understood.
- [ ] The system design and execution flow are traceable.
- [ ] The public interface is simple relative to its capability.
- [ ] Relevant complexity is hidden in the appropriate modules.
- [ ] The change does not introduce avoidable shallow layers or duplicated knowledge.
- [ ] Failure, security, concurrency, and scale behavior are considered.
- [ ] The feature is delivered as an observable vertical slice.
- [ ] Tests trace back to requirements.
- [ ] Important decisions and trade-offs are documented.
- [ ] The source of truth reflects the current project state.
- [ ] Another engineer can understand the feature without reconstructing it from scattered conversations.
- [ ] AI contributions were reviewed for correctness and design complexity.

---

## Final reminder

```text
AI can accelerate discovery and implementation.

I remain responsible for:
- the user problem,
- the domain model,
- the system mental model,
- the public abstractions,
- the containment of complexity,
- the decisions and trade-offs,
- the evidence that the feature works,
- and the shared source of truth.
```
