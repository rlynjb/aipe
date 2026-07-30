The key is to **externalize the moving parts**. Do not rely on memory, scattered chats, or repeatedly rereading tickets. Build a lightweight operating system where every requirement, decision, dependency, and unknown has a place.

## 1. Separate the different kinds of information

A project becomes overwhelming when everything is mixed together.

| Category         | What belongs there                                       |
| ---------------- | -------------------------------------------------------- |
| **Goals**        | What outcome are we trying to produce?                   |
| **Requirements** | What must the system do?                                 |
| **Constraints**  | Security, performance, timeline, budget, platform limits |
| **Decisions**    | What did we choose, why, and who agreed?                 |
| **Unknowns**     | Questions that still need answers                        |
| **Dependencies** | Other teams, APIs, designs, approvals, data              |
| **Risks**        | What could delay or break the project?                   |
| **Tasks**        | The actual implementation work                           |

A requirement is not a task.

* Requirement: “Users can visualize relationships between skills.”
* Decision: “Use a directed acyclic graph.”
* Task: “Implement graph layout adapter.”
* Unknown: “Can a skill have multiple prerequisites?”
* Risk: “Large graphs may become unreadable.”
* Dependency: “Product must define prerequisite rules.”

Keeping these separate prevents premature coding.

---

## 2. Create one project control page

Maintain one short page that acts as the project index.

```text
Project: Skill Graph

Goal
Help users understand what to learn next and why.

Current scope
- Display skills as nodes
- Display prerequisite relationships
- Expand and collapse branches
- Show learning progress

Out of scope
- AI-generated curricula
- Social sharing
- Collaborative editing

Open questions
- Can graphs contain cycles?
- What is the maximum expected graph size?
- Who is allowed to modify relationships?

Decisions
- Directed graph
- Read-only first release
- Server owns canonical graph data

Dependencies
- Product: relationship rules
- Design: interaction states
- Backend: graph endpoint

Top risks
- Poor performance on large graphs
- Ambiguous prerequisite semantics
```

This is not the detailed specification. It is the dashboard that points to everything else.

---

## 3. Track requirements with stable IDs

Give important requirements identifiers so people can refer to the same thing.

```text
REQ-01: Users can see prerequisite relationships.
REQ-02: Users can expand and collapse a node.
REQ-03: The graph supports at least 1,000 nodes.
REQ-04: Unauthorized users cannot edit relationships.
```

Then connect implementation work to them:

```text
REQ-02
├── DESIGN-04: Expanded-node interaction
├── API-07: Fetch child nodes
├── TASK-31: Add expand/collapse state
└── TEST-18: Verify collapsed branches are hidden
```

This creates traceability:

```text
Goal
  ↓
  Requirement
    ↓
    Design decision
      ↓
      Implementation task
        ↓
        Test
          ↓
          Released behavior
          ```

          When a requirement changes, you can see what else is affected.

          ---

## 4. Use an open-question log

Many projects stall because unanswered questions remain buried in meetings or Slack.

Use a simple table:

| ID   | Question                                     | Owner     | Needed by | Status        |
| ---- | -------------------------------------------- | --------- | --------- | ------------- |
| Q-01 | Can a skill have multiple parents?           | Product   | Aug 3     | Open          |
| Q-02 | Maximum graph size?                          | Data team | Aug 4     | Investigating |
| Q-03 | Must layouts remain stable between sessions? | Design    | Aug 5     | Answered      |

An unanswered question should have:

* An owner
* A deadline or decision point
* A consequence if unanswered

For example:

> If Q-02 is not answered by implementation time, assume 1,000 nodes and document that assumption.

That keeps uncertainty from silently blocking progress.

---

## 5. Maintain a decision log

Do not let important architectural decisions live only in conversations.

```text
DEC-008: Use server-generated graph relationships

Context
Relationships must remain consistent across clients.

Options
1. Construct relationships in the frontend
2. Construct relationships in the backend

Decision
The backend returns canonical nodes and edges.

Reason
This prevents clients from interpreting prerequisite rules differently.

Tradeoff
The frontend has less flexibility for local experimentation.

Date
July 28, 2026

Participants
Engineering, product, data
```

The purpose is not bureaucracy. It prevents the team from reopening the same discussion three weeks later without remembering why the original choice was made.

---

## 6. Organize work by vertical slices

Avoid organizing the entire project like this:

```text
Build all backend work
Then all frontend work
Then all tests
Then integrate everything
```

Prefer small end-to-end slices:

```text
Slice 1: Display one static graph
Slice 2: Load graph data from API
Slice 3: Expand and collapse nodes
Slice 4: Display progress states
Slice 5: Handle large graphs
Slice 6: Add editing permissions
```

Each slice should produce something observable and testable.

For every slice, define:

```text
User outcome
Requirements covered
Frontend changes
Backend changes
Data changes
Tests
Dependencies
Definition of done
```

This makes moving parts converge around deliverable behavior rather than disconnected technical layers.

---

## 7. Map dependencies explicitly

Use a dependency graph when work cannot happen independently.

```text
Define graph semantics
        │
                ├──> Design interactions
                        │         └──> Implement graph controls
                                │
                                        ├──> Define API schema
                                                │         └──> Implement graph endpoint
                                                        │                    └──> Connect frontend
                                                                │
                                                                        └──> Create test fixtures
                                                                                          └──> Performance testing
                                                                                          ```

                                                                                          Pay particular attention to the **critical path**: the chain of work that determines when the project can finish.

                                                                                          Not every incomplete task is equally important.

                                                                                          ---

## 8. Use meetings to make decisions, not store information

Before a collaboration meeting, share:

```text
Context
What has changed
Questions requiring decisions
Recommended option
Consequences of delaying
```

During the meeting:

```text
Decision:
Owner:
Deadline:
Follow-up action:
```

After the meeting, update the source of truth. Do not leave the project state inside meeting notes alone.

A useful status update is:

```text
Completed
- API schema agreed
- Static graph prototype working

Next
- Connect frontend to endpoint
- Test 1,000-node dataset

Blocked
- Waiting for product to define cycle behavior

Decisions needed
- Stable layout between sessions: yes or no?

Risks
- Current layout library slows down above 700 nodes
```

That is more useful than “still working on the graph feature.”

---

## 9. Control changes instead of resisting them

Requirements will change. The important part is making the impact visible.

When something changes, ask:

```text
What changed?
Why did it change?
Which requirements are affected?
Which completed work is affected?
What new work is introduced?
What gets delayed or removed?
Who approves the tradeoff?
```

For example:

> Supporting editable graphs adds authorization, validation, conflict handling, audit history, UI states, and additional tests. We can add it, but it moves the release date or requires removing another feature.

This is how you communicate tradeoffs without sounding uncooperative.

---

## 10. Keep three planning horizons

Do not plan every task at the same level of detail.

### Now

Detailed and immediately actionable:

```text
Implement expand/collapse behavior
Add API error state
Confirm cycle rules
```

### Next

Roughly decomposed:

```text
Progress visualization
Large-graph performance
Keyboard navigation
```

### Later

Outcome-level only:

```text
Collaborative editing
AI-generated skill recommendations
Graph sharing
```

Detailed planning too far ahead creates maintenance overhead because the information will change.

---

## A compact operating model

```text
                    PROJECT GOAL
                                             │
                                                         ┌────────────┴────────────┐
                                                                     │                         │
                                                                            REQUIREMENTS               CONSTRAINTS
                                                                                        │                         │
                                                                                                    └────────────┬────────────┘
                                                                                                                             │
                                                                                                                                               SYSTEM DESIGN
                                                                                                                                                                        │
                                                                                                                                                                                  ┌──────────────┼──────────────┐
                                                                                                                                                                                            │              │              │
                                                                                                                                                                                                  WORKSTREAMS    DEPENDENCIES     RISKS
                                                                                                                                                                                                            │              │              │
                                                                                                                                                                                                                      └──────────────┼──────────────┘
                                                                                                                                                                                                                                               │
                                                                                                                                                                                                                                                                 VERTICAL SLICES
                                                                                                                                                                                                                                                                                          │
                                                                                                                                                                                                                                                                                                                 TASKS
                                                                                                                                                                                                                                                                                                                                          │
                                                                                                                                                                                                                                                                                                                                                                 TESTS
                                                                                                                                                                                                                                                                                                                                                                                          │
                                                                                                                                                                                                                                                                                                                                                                                                                RELEASE
                                                                                                                                                                                                                                                                                                                                                                                                                                         │
                                                                                                                                                                                                                                                                                                                                                                                                                                                              FEEDBACK
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       │
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       REQUIREMENT UPDATES
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ```

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       The feedback loop matters. Requirements gathering is not a single phase at the beginning; it continues as prototypes, implementation constraints, and user feedback reveal new information.

## The practical rule

At any point, you should be able to answer these questions:

1. What outcome are we trying to achieve?
2. What is currently in and out of scope?
3. What decisions have already been made?
4. What remains unknown?
5. What is blocked, and by whom?
6. What is the next testable slice?
7. What changed recently?
8. What tradeoff are we making?

When those answers are visible, “a lot of moving parts” becomes a manageable system rather than a mental burden.

