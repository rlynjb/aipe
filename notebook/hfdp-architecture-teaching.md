# Head First Design Patterns Architecture-Teaching Prompt Library

Quick-reference for learning an application's architecture through the lens of *Head First Design Patterns*. The focus is not memorizing pattern names—it is understanding objects, responsibilities, collaboration, variation, and why particular abstractions exist.

The goal is to move from:

```text
I recognize Strategy, Factory, and Observer.
```

to:

```text
I understand what varies,
which objects collaborate,
why the abstraction exists,
and what change it makes easier.
```

---

## Index

| #  | Prompt                      | What it teaches                    | Reach for it when                                |
| -- | --------------------------- | ---------------------------------- | ------------------------------------------------ |
| 1  | **Compact daily**           | Complete object-design lesson      | Default                                          |
| 2  | **Master**                  | Deep architecture walkthrough      | Learning a major feature                         |
| 3  | **Object map**              | Participants and responsibilities  | Too many classes                                 |
| 4  | **Collaboration flow**      | Runtime object conversation        | Static structure makes sense but runtime doesn't |
| 5  | **What varies**             | Variation points                   | Understanding abstractions                       |
| 6  | **Pattern evidence**        | Proves actual patterns             | Pattern-heavy codebase                           |
| 7  | **Composition/inheritance** | Reuse and substitution choices     | Hierarchies/delegation                           |
| 8  | **Creation architecture**   | Factories and dependency selection | DI/factory-heavy system                          |
| 9  | **Change exercise**         | Why patterns exist                 | Best way to understand design value              |
| 10 | **Teach from scratch**      | Derive patterns from problems      | Avoid pattern memorization                       |
| 11 | **Quiz me**                 | Active recall                      | After studying                                   |

---

## Recommended learning sequence

```text
Behavior
 ↓
Objects
 ↓
Responsibilities
 ↓
Collaboration
 ↓
What varies
 ↓
Stable abstractions
 ↓
Patterns
 ↓
Creation
 ↓
Change scenarios
 ↓
Trade-offs
```

---

## 1. Compact daily prompt

```text
Teach me this application's architecture using Head First Design Patterns.

Do not begin by naming patterns.

Explain:

1. Main user behavior
2. Important objects/modules
3. Responsibility of each participant
4. How they collaborate at runtime
5. What behavior varies
6. What remains stable
7. Where composition is used
8. Where inheritance is used
9. Which abstractions allow substitution
10. Where concrete implementations are selected
11. Which design patterns are actually present
12. What future change each pattern makes easier

For every claimed pattern provide:

- Design problem
- Participants
- Collaboration
- Variation encapsulated
- Stable code protected
- Trade-off

Point to concrete files and symbols.

Finish with:

- ASCII object/collaboration diagram
- Pattern map
- 5 files to study
- 5 design concepts
- 5 questions testing my understanding
```

---

## 2. Master architecture-teaching prompt

```text
Teach me this application's software architecture using concepts from
Head First Design Patterns.

Assume I want to understand the design well enough to rebuild and extend it.

Do not pattern-match from class names.

## 1. Behavior

Explain the important user/system behaviors.

## 2. Participants

Identify important:

- Objects
- Services
- Components
- Interfaces
- Concrete implementations
- Factories
- Wrappers
- Publishers
- Subscribers

For each explain its responsibility.

## 3. Collaboration

Trace representative behavior.

Show:

Caller
→ collaborator
→ delegated behavior
→ result

Explain what each participant knows about the others.

## 4. What varies

Identify independently changing:

- Algorithms
- Business rules
- Providers
- Rendering
- Persistence
- State behavior
- Creation logic
- Notifications

For each explain:

What varies?
What remains stable?
Where is variation encapsulated?

## 5. Abstractions

Identify important interfaces and contracts.

Explain:

- Clients
- Implementations
- Substitution mechanism
- Concrete knowledge leaked
- Why the abstraction exists

## 6. Composition versus inheritance

Map important relationships.

Explain whether each represents:

- True subtype relationship
- Behavior reuse
- Runtime composition
- Delegation
- Configuration

Explain the trade-off.

## 7. Pattern evidence

Investigate relevant patterns:

- Strategy
- Observer
- Decorator
- Factory Method
- Abstract Factory
- Command
- Adapter
- Facade
- Template Method
- Iterator
- Composite
- State
- Proxy

For every confirmed pattern explain:

Problem
→ participants
→ collaboration
→ variation
→ extension mechanism
→ benefit
→ cost

Mark patterns as:

- Confirmed
- Likely
- Partial
- Superficial resemblance
- Not present

## 8. Creation architecture

Explain:

- Who selects concrete implementations
- Who constructs them
- Who configures them
- Who owns their lifetime
- Whether factories or dependency injection are involved

## 9. State and events

Where relevant explain:

- State transitions
- State-dependent behavior
- Publishers
- Subscribers
- Event lifecycle
- Ordering assumptions

## 10. Change scenarios

Test:

- New algorithm
- New provider
- New state
- New notification type
- New product/object family

Explain which participants change.

## 11. Pattern trade-offs

For each pattern ask:

- What complexity disappeared?
- What indirection appeared?
- Would simpler code work?
- What requirement justifies the pattern?

## 12. Learning summary

Return:

- Object map
- Collaboration diagram
- Variation map
- Pattern map
- Creation flow
- 5 files to study
- 5 design lessons
- 10 interview questions
```

---

## 3. Object map

```text
Teach me the architecture as a network of collaborating objects.

For each important participant show:

- Responsibility
- State owned
- Interface implemented
- Collaborators
- Behavior delegated
- Behavior performed
- Who creates it

Then draw an ASCII collaboration map.

Exclude utility classes that do not matter architecturally.
```

---

## 4. Collaboration flow

```text
Trace this behavior as an object conversation:

[action]

For every interaction explain:

Caller
Message/method
Receiver
Responsibility being delegated
Return/result

Then explain:

- Which participants know concrete implementations
- Which communicate through abstractions
- Where coupling exists
- Where substitution is possible
```

---

## 5. What varies

```text
Teach me this architecture by identifying what varies.

Find changing:

- Algorithms
- Policies
- Providers
- State-dependent behavior
- Object creation
- External APIs
- UI behavior
- Notifications

For each:

What varies?
What stays stable?
Which abstraction contains the variation?
How is an implementation selected?
How would I add another variation?
```

---

## 6. Pattern evidence

```text
Identify design patterns in this application.

Do not classify by names.

For every candidate prove:

1. Design problem
2. Participants
3. Pattern roles
4. Runtime collaboration
5. Variation encapsulated
6. Stable behavior
7. Extension mechanism
8. Trade-off

Classify confidence:

Confirmed
Likely
Partial
Superficial resemblance
Not present
```

---

## 7. Composition versus inheritance

```text
Teach me every architecturally important composition and inheritance
relationship.

For inheritance explain:

- Parent contract
- Child specialization
- Overridden behavior
- Whether substitution is valid

For composition explain:

- Owner
- Collaborator
- Delegated behavior
- Runtime replacement possibilities

Explain why each design likely chose composition or inheritance.
```

---

## 8. Creation architecture

```text
Teach me how important objects come into existence.

Trace:

Requirement
→ concrete implementation selection
→ construction
→ configuration
→ injection
→ use
→ lifetime/disposal

Identify:

- Direct constructors
- Factories
- Factory methods
- Abstract factories
- DI containers
- Registries
- Service locators

Explain why each exists.
```

---

## 9. Change exercise

```text
Suppose I add:

[new behavior/provider/state]

Do not implement it.

Show:

- New participants
- Existing participants modified
- Interfaces extended
- Creation changes
- Collaboration changes
- Tests affected

Then explain which design pattern contains the change and what would happen
without that pattern.
```

---

## 10. Teach from scratch

```text
Teach me how to derive this architecture without knowing its patterns.

Start with:

User requirement
→ responsibilities
→ what varies
→ stable behavior
→ collaborations
→ abstractions

Only after deriving the design, identify any known pattern that describes it.

Explain why the pattern is the conclusion rather than the starting point.
```

---

## 11. Quiz me

```text
Quiz me one question at a time about:

1. Responsibilities
2. Collaborators
3. What varies
4. Stable abstractions
5. Composition
6. Inheritance
7. Pattern participants
8. Object creation
9. Change scenarios
10. Trade-offs

Make later questions require me to predict how the architecture changes.
```

---

## Final teaching principle

Never teach:

```text
This is Strategy because it has Strategy in the name.
```

Teach:

```text
This behavior varies.
This client should remain stable.
These implementations are interchangeable.
The client delegates the varying behavior through this contract.

That collaboration is what makes Strategy a useful description.
```

**Problem → responsibility → collaboration → variation → pattern.**
