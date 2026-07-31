[← Contents](README.md)

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

[← 4. Use AI](04-use-ai.md) · [Contents](README.md) · [6. Review gates →](06-review-gates.md)
