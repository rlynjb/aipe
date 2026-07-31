[← Contents](README.md)

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

[← 3. Philosophy review](03-philosophy-review.md) · [Contents](README.md) · [5. Coordinate delivery →](05-coordinate-delivery.md)
