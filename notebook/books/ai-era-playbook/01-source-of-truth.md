[← Contents](README.md)

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

[← Core model](00-core-model.md) · [Contents](README.md) · [2. Orient →](02-orient.md)
