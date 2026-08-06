# Head First Design Patterns Reverse-Engineering Prompt Library

Quick-reference for reverse-engineering an existing app or feature with an AI coding agent, using *Head First Design Patterns* as the question framework. The agent is the explorer, tracer, pattern detector, critic, and tutor; the book’s principles give it better questions.

The core question *Head First Design Patterns* asks of any code:

```text
What varies, what should stay stable, and how are responsibilities and
collaborations arranged so the system can change without widespread edits?
```

A normal explanation says: *`CheckoutService` calls `calculateDiscount`, then calls the payment API.*

A pattern-oriented explanation asks: *Is the discount behavior encapsulated behind a Strategy? Does `CheckoutService` depend on a stable abstraction? Who selects the concrete behavior, and what changes when a new discount type is added?* — those questions reveal the actual **design**, not just the call sequence.

**Always separate evidence from inference.** Otherwise agents label familiar-looking code as patterns without proving that the participants, collaboration, and design pressure are actually present.

---

## Index

| #  | Prompt                                                                         | What it does                                                        | Reach for it when                          |
| -- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------ |
| 0  | [**Master reverse-engineering**](#0-master-reverse-engineering-prompt)         | Full 12-point pass → 9-section report                               | Start here on any unfamiliar feature       |
| 1  | [**Behavioral contract**](#1-establish-the-behavioral-contract)                | Feature purely from the user's side, no implementation              | Before studying any code                   |
| 2  | [**Find entry points**](#2-find-the-real-entry-points)                         | Every route / handler / job / listener that starts the feature      | Don't trust the first function you find    |
| 3  | [**Trace one scenario**](#3-trace-one-concrete-scenario)                       | Follows a single user action and object collaboration end to end    | Need concrete ground truth                 |
| 4  | [**Responsibility map**](#4-identify-responsibilities-and-collaborators)       | Documents each participant, role, abstraction, and collaborator     | Building the design mental model           |
| 5  | [**What varies**](#5-identify-what-varies)                                     | Finds behaviors and dependencies likely to change independently     | Looking for the reason behind abstractions |
| 6  | [**Pattern candidates**](#6-detect-design-pattern-candidates)                  | Identifies patterns without relying on class names alone            | Suspect Strategy, Observer, Factory, etc.  |
| 7  | [**Coupling and collaboration**](#7-analyze-coupling-and-object-collaboration) | Shows who knows whom and how work is delegated                      | Feature feels tangled                      |
| 8  | [**Change scenarios**](#8-probe-the-design-with-change-scenarios)              | Uses hypothetical changes to test flexibility                       | Testing whether the pattern helps          |
| 9  | [**Composition vs inheritance**](#9-examine-composition-and-inheritance)       | Audits whether behavior is composed or locked into hierarchies      | Inheritance tree feels rigid               |
| 10 | [**Creation logic**](#10-investigate-object-creation)                          | Finds scattered constructors and Factory opportunities              | Concrete classes are selected everywhere   |
| 11 | [**State and transitions**](#11-analyze-state-and-behavior-transitions)        | Maps state-dependent behavior and possible State patterns           | Conditionals grow with every state         |
| 12 | [**Events and observers**](#12-investigate-events-and-observers)               | Maps publishers, subscribers, notification flow, and coupling       | Event-driven behavior feels unclear        |
| 13 | [**Adapters and boundaries**](#13-examine-adapters-facades-and-boundaries)     | Distinguishes Adapter, Facade, Decorator, and pass-through wrappers | Many integrations or wrappers exist        |
| 14 | [**Commands and workflows**](#14-investigate-commands-and-workflows)           | Looks for encapsulated requests, queues, undo, and orchestration    | Actions need logging, retries, or undo     |
| 15 | [**Unknown unknowns**](#15-find-unknown-unknowns)                              | Hunts for hidden registrations, runtime wiring, and alternate paths | Before trusting any clean explanation      |
| A  | [**Pattern design scorecard**](#a-head-first-design-patterns-scorecard)        | 1–5 scores across 10 design dimensions                              | After the RE pass, want a summary          |
| B  | [**Architecture-teaching**](#b-architecture-teaching-prompt)                   | Teaches the feature as if you'll rebuild it from scratch            | Studying patterns through real code        |
| C  | [**Current vs ideal**](#c-compare-current-and-ideal-designs)                   | Existing design vs a pattern-informed alternative                   | Want to see whether a pattern would help   |

Reference (not prompts): [RE model chain](#the-head-first-design-patterns-reverse-engineering-model) · [Multi-pass workflow](#recommended-multi-pass-workflow)

---

## The Head First Design Patterns reverse-engineering model

Instead of merely generating a file tree or listing pattern names, have the agent reconstruct this chain:

```text
User behavior
    ↓
Public entry point
    ↓
Execution path
    ↓
Objects and modules involved
    ↓
Responsibilities
    ↓
Collaborations and message flow
    ↓
Behavior or dependency that varies
    ↓
Stable abstractions
    ↓
Pattern participants, if any
    ↓
Coupling and change impact
```

---

## 0. Master reverse-engineering prompt

**What it does:** The full first pass — 12 investigation points producing a 9-section report. Explicitly forces evidence-vs-inference separation so guesses and superficial pattern matching are not presented as facts. Use this first.

```text
Reverse-engineer this feature using the principles from Head First Design
Patterns.

Do not modify the code yet.

Your goal is to explain:

1. What user-visible behavior the feature provides.
2. Where the feature begins in the codebase.
3. The end-to-end execution path.
4. The major objects, modules, and components involved.
5. The responsibility of each important participant.
6. Which behaviors, algorithms, dependencies, or object families vary.
7. Which abstractions keep stable code separate from changing code.
8. How objects collaborate and which concrete types know about one another.
9. Which design patterns are clearly present, partially present, or absent.
10. What would have to change for three plausible feature modifications.
11. Which conclusions are confirmed by code and which are your inferences.
12. What questions remain unanswered.

Do not identify a design pattern from naming alone.

For every claimed pattern, prove:

- The design problem
- The participants
- The collaboration
- The variation being encapsulated
- The benefit gained
- The trade-off introduced

For every conclusion, cite the relevant file, symbol, and line range.

Present the result as:

- Behavioral summary
- System boundary
- Execution trace
- Responsibility and collaborator map
- Variation and abstraction map
- Dependency and coupling map
- Pattern assessment
- Change-impact scenarios
- Unknowns and verification steps
```

---

## 1. Establish the behavioral contract

**What it does:** Pins down what the feature promises before implementation study, so pattern analysis stays grounded in actual behavior rather than starting with class names.

```text
Describe this feature entirely from the user's perspective.

Identify:

- How the user enters the feature
- Inputs the user can provide
- Visible outputs
- Loading, empty, success, and error states
- Permissions or prerequisites
- Side effects
- Persistent changes
- External services involved
- User-selectable behaviors or modes

Do not explain implementation yet. Produce a behavioral contract that could
later be turned into acceptance tests.
```

---

## 2. Find the real entry points

**What it does:** Enumerates every way the feature can begin and reveals whether the same behavior is initiated through multiple channels.

```text
Find every entry point into this feature.

Consider:

- Routes
- UI event handlers
- Public functions
- API endpoints
- Commands
- Background jobs
- Event listeners
- Database triggers
- Scheduled tasks
- Framework registrations
- Dependency-injection bindings

For each entry point, explain:

- Who calls it
- Under what conditions
- Which concrete object receives control
- Whether behavior selection occurs there
- Whether object creation occurs there

Distinguish primary entry points from indirect or internal entry points.
```

---

## 3. Trace one concrete scenario

**What it does:** Follows one user action all the way through and records object collaboration, not only function calls.

```text
Trace the following scenario end to end:

[Describe one specific user action.]

Start with the user interaction and follow the execution through:

1. Entry point
2. Input validation
3. Object creation or dependency resolution
4. Behavior selection
5. Business logic
6. State update
7. Network or persistence layer
8. Events or notifications
9. Rendering or user feedback
10. Error handling

At each step, identify:

- File and symbol
- Object or module responsible
- Input
- Output
- State read or written
- Collaborator invoked
- Concrete type or abstraction referenced
- Design decision being made
- Pattern role, if one is proven

Do not skip intermediate abstractions.
```

*Example:*

```text
Trace what happens when a user selects a shipping method and completes checkout.
```

---

## 4. Identify responsibilities and collaborators

**What it does:** Builds a participant map similar to a pattern diagram, but based on the real code rather than textbook class names.

```text
Construct a responsibility and collaborator map for this feature.

For each important class, module, component, hook, or service, document:

- Primary responsibility
- Secondary responsibilities
- Public interface
- State owned
- Decisions owned
- Callers
- Collaborators
- Dependencies
- Concrete implementations it knows about
- Abstractions it depends on
- Objects it creates
- Events it publishes or consumes

Then classify each participant as primarily:

- Context
- Strategy or interchangeable behavior
- Creator
- Product
- Subject or publisher
- Observer or subscriber
- Command
- Receiver
- Adapter
- Adaptee
- Facade
- Decorator
- Component
- State
- Coordinator
- Domain object
- Infrastructure service
- Unclear

Do not force every participant into a pattern role. Use "unclear" or a plain
responsibility description when the evidence does not support a pattern.
```

---

## 5. Identify what varies

**What it does:** Finds the real design pressure behind abstractions. This is often more valuable than identifying a named pattern.

```text
Identify what varies in this feature.

Look for variation in:

- Algorithms
- Business rules
- Validation policies
- Pricing or ranking behavior
- Rendering behavior
- Storage mechanisms
- External providers
- Serialization formats
- Notification channels
- Object families
- Workflow steps
- State-dependent behavior
- Commands or user actions
- Retry and error policies
- Platform-specific implementations

For every variation point, explain:

1. What changes
2. What should remain stable
3. Where the variation is currently located
4. Whether it is encapsulated
5. Which callers know about the concrete choices
6. How a new variation would be added
7. Whether the current abstraction reduces or increases complexity
```

---

## 6. Detect design-pattern candidates

**What it does:** Identifies patterns by structure, intent, and collaboration—not by names such as `Factory`, `Manager`, or `Strategy`.

```text
Inspect this feature for credible design-pattern candidates.

Consider:

- Strategy
- Observer
- Decorator
- Factory Method
- Abstract Factory
- Singleton
- Command
- Adapter
- Facade
- Template Method
- Iterator
- Composite
- State
- Proxy
- Compound patterns

For each candidate, report:

1. Pattern name
2. Confidence: confirmed, likely, partial, superficial resemblance, or absent
3. Design problem being solved
4. Concrete participants and their pattern roles
5. Collaboration sequence
6. Behavior or dependency being encapsulated
7. Stable abstraction
8. Extension mechanism
9. Benefit gained
10. Cost or trade-off
11. Evidence that could disprove the classification

Do not classify code as a pattern merely because:

- A class has the pattern name
- An interface has multiple implementations
- A wrapper delegates one call
- A callback exists
- An event emitter is imported
- A factory function creates one object

Require evidence of intent, structure, and collaboration.
```

---

## 7. Analyze coupling and object collaboration

**What it does:** Reveals how much concrete knowledge each participant carries and whether delegation actually creates loose coupling.

```text
Map the collaboration and coupling in this feature.

For every important participant, identify:

- Objects it knows about
- Concrete classes it imports
- Interfaces it depends on
- Objects it creates
- Methods it invokes
- Events it publishes
- Events it consumes
- Configuration it requires
- Assumptions it makes about collaborators
- Call ordering it depends on

Then identify:

- Tight concrete coupling
- Stable abstraction boundaries
- Circular dependencies
- Hidden global dependencies
- Feature envy
- Excessive coordination
- Objects that know too much
- Objects that merely delegate
- Collaborations that would be difficult to test independently

Explain whether the current design programs to abstractions or to concrete
implementations.
```

---

## 8. Probe the design with change scenarios

**What it does:** Tests whether the current design actually supports change and whether a pattern is earning its complexity.

```text
Perform a change-impact analysis for these hypothetical changes:

1. [Add a new behavior or algorithm]
2. [Replace an external dependency]
3. [Add a new event, state, product type, or workflow step]

For each change, identify:

- Files likely to change
- Interfaces likely to change
- Concrete classes likely to be added
- Existing classes likely to be modified
- Conditionals likely to grow
- Tests likely to change
- Registration or wiring changes
- Stable abstractions that contain the change
- Dependencies that allow the change to spread
- Pattern that currently helps
- Pattern that may be missing
- Unknown risks

Do not implement the changes. Use them as probes for understanding the design.

Conclude whether each scenario is handled through:

- Extension
- Modification
- Configuration
- Registration
- Duplication
- Conditional branching
- Runtime composition
```

*Example probes:*

```text
1. Add a second pricing algorithm.
2. Replace the email provider.
3. Add undo for a graph-edit command.
4. Introduce a new checkout state.
5. Support another third-party API with a different interface.
```

---

## 9. Examine composition and inheritance

**What it does:** Tests the “favor composition over inheritance” principle and reveals whether subclasses are being used only to vary behavior.

```text
Audit inheritance and composition in this feature.

For each inheritance relationship, explain:

- What behavior or state is inherited
- Whether the subtype truly satisfies the parent contract
- Whether subclasses override behavior
- Whether callers depend on subtype knowledge
- Whether changes to the base class affect unrelated subclasses
- Whether the hierarchy exists mainly to reuse code
- Whether behavior could be composed instead

For each composition relationship, explain:

- Which behavior is delegated
- How the collaborator is selected
- Whether it can be replaced independently
- Whether the abstraction is stable
- Whether composition adds useful flexibility or needless indirection

Identify:

- Fragile base classes
- Deep inheritance trees
- Subclass explosion
- Type checks against subclasses
- Empty or unsupported inherited methods
- Composition that resembles Strategy, State, Decorator, or Command
```

---

## 10. Investigate object creation

**What it does:** Finds where concrete classes are selected and whether creation logic is centralized, distributed, configurable, or hidden.

```text
Map object creation for this feature.

Find:

- Direct constructor calls
- Static factory functions
- Factory classes
- Dependency-injection bindings
- Service locators
- Framework registrations
- Reflection-based creation
- Runtime plugin loading
- Environment-based selection
- Test-specific substitutions

For each created object, document:

- Who requests it
- Who selects the concrete class
- Who constructs it
- Who configures it
- Who owns its lifetime
- Whether callers depend on the concrete type
- Whether related objects must be created as a compatible family

Determine whether the design uses or could resemble:

- Simple Factory
- Factory Method
- Abstract Factory
- Dependency injection without a formal factory pattern
- Scattered direct construction

Do not recommend a factory unless object creation is genuinely variable,
complex, repeated, or tied to compatible product families.
```

---

## 11. Analyze state and behavior transitions

**What it does:** Maps behavior that changes according to internal state and distinguishes a genuine State pattern from ordinary state storage.

```text
Map state-dependent behavior in this feature.

For each important state value, document:

- Possible states
- Source of truth
- Allowed transitions
- Transition triggers
- Behavior available in each state
- Invalid operations
- Side effects of transitions
- Persistence mechanism
- Readers and writers
- Conditionals based on state

Then determine:

- Whether state-specific behavior is centralized or scattered
- Whether switch statements grow when states are added
- Whether state transitions are explicit
- Whether state objects exist
- Whether the context delegates behavior to the current state
- Whether this is a confirmed, partial, or absent State pattern

Distinguish the State pattern from:

- A status enum
- A reducer
- A state machine library
- UI state
- Database lifecycle fields
```

---

## 12. Investigate events and observers

**What it does:** Reconstructs publisher/subscriber relationships and tests whether event-driven code is truly decoupled.

```text
Map all event and notification behavior in this feature.

Identify:

- Publishers or subjects
- Subscribers or observers
- Event types
- Registration mechanism
- Unregistration mechanism
- Dispatch mechanism
- Delivery order
- Synchronous vs asynchronous delivery
- Event payloads
- Error handling
- Retry behavior
- Duplicate-delivery behavior
- Subscriber lifetime
- Hidden side effects

For every event, explain:

- Who publishes it
- Why it exists
- Who consumes it
- Whether the publisher knows concrete subscribers
- Whether subscribers depend on publisher internals
- Whether event ordering matters
- Whether the event is domain-level or infrastructure-level

Determine whether the design is:

- A confirmed Observer pattern
- Event-driven infrastructure
- Callback registration
- Message-bus integration
- Direct notification disguised as events
```

---

## 13. Examine adapters, facades, and boundaries

**What it does:** Distinguishes common wrapper patterns that are frequently confused with each other.

```text
Inspect every wrapper, integration layer, gateway, client, and service boundary.

For each one, determine whether it primarily:

- Converts one interface into another
- Simplifies a complex subsystem
- Adds behavior before or after delegation
- Controls access to another object
- Hides remote communication
- Selects among implementations
- Merely renames or forwards calls

Classify each candidate as:

- Adapter
- Facade
- Decorator
- Proxy
- Strategy
- Gateway
- Anti-corruption layer
- Plain wrapper
- Pass-through layer
- Unclear

For every classification, explain:

- The original interface
- The exposed interface
- The caller
- The wrapped or adapted object
- Whether object identity is preserved
- Whether behavior is added
- Whether the goal is compatibility, simplification, extension, or access control
```

---

## 14. Investigate commands and workflows

**What it does:** Looks for requests represented as objects and separates Command from ordinary service methods or event messages.

```text
Analyze user actions and workflow operations in this feature.

For each important operation, identify:

- Invoker
- Request representation
- Receiver
- Execution method
- Parameters
- Result
- Side effects
- Logging
- Queuing
- Retry behavior
- Undo or compensation behavior
- Persistence or serialization
- Scheduling

Determine whether the operation is:

- A confirmed Command pattern
- A command-handler architecture
- A job
- An event
- A service method
- A closure or callback
- A request DTO
- Unclear

A confirmed Command pattern should show a request encapsulated so that it can be
passed, stored, queued, logged, parameterized, retried, or undone independently
of the invoker.
```

---

## 15. Find "unknown unknowns"

**What it does:** Challenges the initial pattern map by finding runtime wiring, hidden implementations, generated code, and alternate execution paths.

```text
Challenge the current design-pattern explanation.

Search for evidence that contradicts or expands it, including:

- Alternative entry points
- Hidden constructors
- Dependency-injection containers
- Runtime registration
- Plugin systems
- Dynamic imports
- Reflection
- Feature flags
- Environment-dependent implementations
- Legacy implementations
- Test doubles using a different path
- Generated code
- Framework decorators or annotations
- Event subscribers registered outside the feature
- Background workers
- Database triggers
- Remote services performing hidden behavior
- Global singletons
- Monkey patching or middleware

List anything that could make the current responsibility, collaboration, or
pattern explanation incomplete.
```

---

## A. Head First Design Patterns scorecard

**What it does:** Produces a compact 1–5 assessment after the code has been traced. The score is not a universal quality judgment; it summarizes how well the design manages its actual sources of change.

```text
Score this feature from 1 to 5 across the following dimensions.

For every score, cite evidence and explain the reasoning.

1. Responsibility clarity
   Are responsibilities assigned clearly and cohesively?

2. Variation encapsulation
   Are changing behaviors or dependencies separated from stable code?

3. Programming to abstractions
   Do important clients depend on stable interfaces rather than concrete types?

4. Composition quality
   Is behavior composed and replaceable where change genuinely requires it?

5. Object collaboration
   Are collaborations understandable, testable, and appropriately decoupled?

6. Creation encapsulation
   Is concrete object selection located in an appropriate place?

7. Extension cost
   Can plausible new behaviors, states, products, or integrations be added
   without modifying many existing classes?

8. Pattern fit
   Do the patterns solve real design problems rather than add ceremonial layers?

9. Pattern transparency
   Can a developer understand the collaboration without memorizing class names
   or hidden runtime wiring?

10. Trade-off discipline
    Does the flexibility gained justify the indirection and object complexity?

Use this scale:

1 = severe design friction
2 = weak
3 = mixed or adequate
4 = strong
5 = exceptionally well aligned with the feature's real change pressures

Finish with:

- Overall assessment
- Three strongest design decisions
- Three largest design risks
- One pattern worth preserving
- One abstraction worth simplifying
- One area that needs more evidence
```

---

## B. Architecture-teaching prompt

**What it does:** Teaches the feature as though you will rebuild it, moving from behavior to variation, responsibilities, collaboration, and patterns.

```text
Teach me this feature as if I will rebuild it from scratch.

Use the real code as evidence, but organize the lesson in this order:

1. User-visible behavior
2. Domain concepts
3. Main execution flow
4. Responsibilities that must exist
5. Behaviors or dependencies that vary
6. Stable abstractions
7. Object collaboration
8. Object creation and wiring
9. State and event behavior
10. Design patterns used
11. Why each pattern is or is not justified
12. Failure cases and trade-offs
13. Simplest possible implementation
14. Point at which the simple design would become difficult to maintain
15. Pattern-informed evolution path

For each design pattern:

- Explain the problem before naming the pattern
- Identify the participants in the real code
- Draw the collaboration
- Show how one new requirement would be added
- Explain the cost of the pattern
- Explain what the code would look like without it

Finish with:

- A concise architecture diagram
- A participant and collaboration diagram
- The five most important files to read
- Five comprehension questions
- One small redesign exercise
```

---

## C. Compare current and ideal designs

**What it does:** Separates description from prescription. It prevents the agent from presenting a textbook-pattern rewrite as though it were the current architecture.

```text
Compare the current implementation with a plausible pattern-informed design.

Keep the two designs strictly separate.

For the current implementation, document:

- Actual responsibilities
- Actual collaborators
- Actual dependencies
- Actual object-creation flow
- Actual variation points
- Actual conditionals
- Actual extension cost
- Confirmed patterns
- Partial or superficial pattern resemblance

For the proposed design, document:

- Design problem being addressed
- Pattern or principle proposed
- Revised responsibilities
- Revised abstractions
- Revised collaboration flow
- Revised object-creation flow
- How three plausible changes would be handled
- Migration cost
- Additional indirection
- Risks and disadvantages

Then answer:

1. Is a named pattern actually necessary?
2. Would a smaller refactoring solve the problem?
3. What future change justifies the abstraction?
4. What complexity would the pattern introduce?
5. Which current code should remain unchanged?
6. At what scale or requirement would the proposed design become worthwhile?

Do not recommend patterns only to make the code resemble textbook examples.
```

---

## Recommended multi-pass workflow

Do not run every prompt at once. Use several focused passes so each answer can be verified before building on it.

### Pass 1 — Establish reality

Run:

```text
1. Establish the behavioral contract
2. Find the real entry points
3. Trace one concrete scenario
```

Goal:

```text
Understand what the feature does and obtain one verified execution path.
```

### Pass 2 — Reconstruct the design

Run:

```text
4. Identify responsibilities and collaborators
5. Identify what varies
7. Analyze coupling and object collaboration
```

Goal:

```text
Understand who owns what, how objects work together, and where change pressure
exists.
```

### Pass 3 — Identify patterns carefully

Run:

```text
6. Detect design-pattern candidates
9. Examine composition and inheritance
10. Investigate object creation
11. Analyze state and behavior transitions
12. Investigate events and observers
13. Examine adapters, facades, and boundaries
14. Investigate commands and workflows
```

Only run the specialized prompts relevant to the feature.

Goal:

```text
Identify patterns from evidence without forcing the code into textbook labels.
```

### Pass 4 — Test the design

Run:

```text
8. Probe the design with change scenarios
15. Find unknown unknowns
A. Head First Design Patterns scorecard
```

Goal:

```text
Determine whether the current abstractions contain realistic changes and
whether the patterns justify their complexity.
```

### Pass 5 — Learn or redesign

Run either:

```text
B. Architecture-teaching prompt
```

or:

```text
C. Compare current and ideal designs
```

Goal:

```text
Turn reverse engineering into transferable design understanding.
```

---

## Compact workflow

When time is limited, use this sequence:

```text
1. What user behavior does this feature provide?
2. Trace one concrete scenario end to end.
3. Which objects participate, and what responsibility does each own?
4. What varies, and what should remain stable?
5. Which participants depend on abstractions versus concrete types?
6. Which design patterns are genuinely supported by the evidence?
7. How would three plausible changes affect the code?
8. Does each pattern reduce more complexity than it introduces?
```

---

## Pattern-evidence rule

Never accept this:

```text
This is Strategy because the class is named PricingStrategy.
```

Require this:

```text
The pricing algorithm varies independently from checkout orchestration.

CheckoutService acts as the context and delegates price adjustment to the
PricingPolicy abstraction. PercentageDiscount and TieredDiscount are
interchangeable concrete behaviors. A new pricing algorithm can be introduced
by implementing PricingPolicy and changing composition or registration rather
than editing CheckoutService.

This supports a Strategy classification.
```

Likewise, distinguish:

```text
Interface with two implementations ≠ automatically Strategy

Event emitter ≠ automatically Observer

Function that creates an object ≠ automatically Factory Method

Wrapper ≠ automatically Adapter or Decorator

Status enum ≠ automatically State

Service method ≠ automatically Command

Global object ≠ automatically justified Singleton
```

---

## Final reverse-engineering principle

The goal is not to ask:

```text
Which patterns can I find?
```

The better sequence is:

```text
What behavior does the feature provide?
What responsibilities exist?
What changes independently?
Which objects collaborate?
Where are concrete decisions made?
Which abstractions protect stable code?
What happens when a new requirement arrives?
Does a known pattern explain this design?
Does that pattern earn its complexity?
```

Pattern names are the final compression of the explanation, not the beginning of it.
