# Head First Design Patterns Code-Review Prompt Library

Quick-reference for reviewing a change with an AI coding agent, using *Head First Design Patterns* to judge whether the change assigns responsibilities clearly, encapsulates variation, reduces coupling, and uses patterns only where they solve a real design problem.

A normal review asks:

```text
Does this code work?
Are there bugs?
Are there tests?
```

A Head First Design Patterns review also asks:

```text
What varies, and is it encapsulated?
Are objects collaborating through stable abstractions?
Is behavior composed or locked into conditionals and inheritance?
Does a pattern solve a real problem, or merely add indirection?
Will the next behavior require extension or widespread modification?
```

Head First Design Patterns should **complement, not replace** reviews for correctness, security, performance, accessibility, and testing.

---

## Index

| #  | Prompt                                                                     | What it does                                                  | Reach for it when                              |
| -- | -------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| ★  | [**Compact daily**](#compact-daily-code-review-prompt)                     | 11-point pass in one shot, blocking vs optional               | Default. Most diffs.                           |
| 0  | [**Master**](#0-master-head-first-design-patterns-code-review-prompt)      | Full 15-point review → 5 finding buckets                      | Bigger or higher-stakes change                 |
| 1  | [**Understand the change**](#1-understand-the-change-first)                | Explains intent before critiquing                             | First — don't review what you don't understand |
| 2  | [**Correctness**](#2-review-correctness)                                   | Bugs, branches, races, boundaries + repro                     | Always, before design                          |
| 3  | [**Responsibilities**](#3-review-responsibility-assignment)                | Checks whether behavior belongs to the right objects          | New or changed classes/modules                 |
| 4  | [**What varies**](#4-review-what-varies)                                   | Finds changing behavior mixed into stable code                | Conditionals or provider-specific logic grew   |
| 5  | [**Program to abstractions**](#5-review-programming-to-abstractions)       | Concrete dependencies vs stable interfaces                    | Concrete imports spread through the diff       |
| 6  | [**Composition vs inheritance**](#6-review-composition-versus-inheritance) | Finds rigid hierarchies and subclass explosion                | New subclasses or override-heavy code          |
| 7  | [**Pattern fit**](#7-review-design-pattern-fit)                            | Tests whether a pattern is proven and justified               | Pattern-like classes were introduced           |
| 8  | [**Object collaboration**](#8-review-object-collaboration)                 | Maps who knows whom and how work is delegated                 | Execution flow feels tangled                   |
| 9  | [**Creation logic**](#9-review-object-creation)                            | Reviews constructors, factories, and runtime selection        | Concrete creation logic changed                |
| 10 | [**Interface complexity**](#10-review-interface-complexity)                | Params, modes, concrete leakage, error surface                | Public interface changed                       |
| 11 | [**State and transitions**](#11-review-state-dependent-behavior)           | State ownership, transitions, and State-pattern fit           | Status conditionals or reducers changed        |
| 12 | [**Events and observers**](#12-review-events-and-observers)                | Publisher/subscriber coupling and lifecycle                   | Events, callbacks, or listeners changed        |
| 13 | [**Wrappers and boundaries**](#13-review-wrappers-and-boundaries)          | Distinguishes Adapter, Facade, Decorator, Proxy, pass-through | New wrapper or integration layer               |
| 14 | [**Change impact**](#14-review-change-impact)                              | Probes future variation for extension vs modification         | Testing whether the design earns flexibility   |
| 15 | [**Tests as design evidence**](#15-review-tests-as-design-evidence)        | Behavior, collaboration, substitution, and over-mocking       | Reviewing test changes                         |
| A  | [**AI-generated change**](#a-reviewing-an-ai-generated-change)             | Skeptical pass for common agent-created pattern smells        | The diff came from an agent                    |
| B  | [**Single class/function**](#b-review-a-single-class-or-function)          | Zoomed-in responsibility and collaboration review             | Reviewing one unit                             |
| C  | [**New abstraction or pattern**](#c-review-a-new-abstraction-or-pattern)   | Whether the abstraction earns its existence                   | Interface, hierarchy, or pattern introduced    |
| D  | [**Refactor**](#d-review-a-refactor)                                       | Behavior preserved and coupling reduced, not moved            | PR labeled “refactor”                          |
| E  | [**Review comments**](#e-producing-useful-review-comments)                 | Concrete, actionable, severity-tagged output                  | Turning findings into PR comments              |

Reference (not prompts): [Review workflow](#recommended-review-workflow) · [Manual-review questions](#questions-to-remember-during-manual-review) · [The four reviews](#the-overall-model)

---

## Compact daily code-review prompt

**What it does:** Runs the whole design-pattern review as a single 11-point pass and splits blocking from optional. Your everyday driver for a normal diff.

```text
Review this diff using principles from Head First Design Patterns.

Focus on:

1. Correctness and violated invariants
2. Responsibility assignment
3. What varies and whether it is encapsulated
4. Programming to abstractions
5. Composition versus inheritance
6. Object collaboration and coupling
7. Design-pattern fit
8. Object creation and dependency selection
9. Interface complexity
10. Change impact
11. Test quality

For every finding, provide:

- Evidence
- Concrete consequence
- Severity
- Smallest recommended improvement

Separate blocking issues from optional design improvements.

Do not recommend a design pattern unless you can identify:

- The real design problem
- The participants
- Their collaboration
- The variation being encapsulated
- The benefit that justifies the added indirection
```

---

## 0. Master Head First Design Patterns code-review prompt

**What it does:** The full 15-point review producing five finding buckets, each finding tagged blocking, important, or optional with a realistic scenario. Use for bigger or higher-stakes changes.

```text
Review this change using principles from Head First Design Patterns.

Do not focus only on style, formatting, or pattern names.

Evaluate:

1. What behavior the change introduces or modifies.
2. Whether the implementation matches the intended behavior.
3. Which objects, modules, interfaces, and collaborators are affected.
4. Whether responsibilities are assigned to appropriate objects.
5. Which behavior, algorithm, dependency, state, or object family varies.
6. Whether changing behavior is separated from stable orchestration.
7. Whether clients depend on abstractions or concrete implementations.
8. Whether composition is used appropriately instead of rigid inheritance.
9. Whether object collaboration is clear and loosely coupled.
10. Whether object creation and concrete selection occur in appropriate places.
11. Whether any claimed design pattern is structurally and behaviorally proven.
12. Whether public interfaces expose unnecessary modes or implementation details.
13. Whether state, events, errors, and lifecycle behavior are handled clearly.
14. Whether tests verify behavior and important collaborations without
    over-coupling to implementation.
15. Whether a smaller or more direct design would be clearer.

Separate findings into:

- Correctness issues
- Responsibility and collaboration issues
- Pattern and abstraction issues
- Testing gaps
- Optional improvements

For every finding:

- Cite the file and symbol
- Explain the concrete consequence
- Give a realistic scenario where it matters
- Suggest the smallest reasonable improvement
- Mark it as blocking, important, or optional

For every pattern-related finding, explain:

- The design problem
- The expected pattern participants
- The actual participants in this code
- How they collaborate
- What varies
- What remains stable
- Whether the pattern reduces more complexity than it adds

Do not reward pattern vocabulary, extra interfaces, factories, wrappers, or
class hierarchies unless they solve a demonstrated design problem.
```

---

## 1. Understand the change first

**What it does:** Forces the agent to explain behavior, entry points, participants, and assumptions before critiquing.

```text
Explain this change before reviewing it.

Identify:

- The user or system behavior being changed
- The entry points affected
- The major execution path
- The objects or modules involved
- The responsibility of each participant
- State read or written
- Dependencies selected or created
- Existing behavior being replaced
- Important invariants
- Assumptions made by the implementation
- Behaviors or dependencies that appear likely to vary

Separate what is directly confirmed by the diff from what you inferred.
```

---

## 2. Review correctness

**What it does:** Standard correctness pass. Design-pattern analysis comes after proving that the code behaves correctly.

```text
Review this change for behavioral correctness.

Look for:

- Incorrect assumptions
- Missing branches
- Null or undefined values
- Invalid state transitions
- Boundary conditions
- Race conditions
- Partial failures
- Retry behavior
- Duplicate operations
- Stale data
- Backward compatibility problems
- Differences between runtime values and static types
- Incorrect collaborator selection
- Missing registration or dependency wiring
- Unsupported implementations
- Observer lifecycle problems
- State-specific behavior running in the wrong state

For each issue, provide a concrete input or event sequence that demonstrates
the failure.
```

---

## 3. Review responsibility assignment

**What it does:** Checks whether responsibilities are cohesive, authoritative, and assigned to the objects that have the required information.

```text
Review the responsibility assignment in this change.

For each new or changed class, function, module, component, or service, identify:

- Primary responsibility
- Secondary responsibilities
- Decisions it owns
- State it owns
- Behavior it delegates
- Collaborators it coordinates
- Knowledge it requires
- Knowledge its callers require

Look for:

- One object owning unrelated responsibilities
- One responsibility scattered across several objects
- Controllers containing domain behavior
- Callers preparing data that a callee should own
- Concrete implementations making orchestration decisions
- Objects coordinating collaborators they should not know about
- Ambiguous ownership
- Multiple objects independently making the same decision

For each problem, identify the most appropriate owner and explain why.
```

---

## 4. Review what varies

**What it does:** Finds sources of change and checks whether they are encapsulated rather than mixed into stable code.

```text
Identify what varies in this change.

Look for variation in:

- Algorithms
- Business rules
- Validation policies
- Pricing or ranking behavior
- Rendering behavior
- Storage providers
- External APIs
- Notification channels
- Serialization formats
- Object families
- Workflow steps
- State-dependent behavior
- Retry policies
- Platform-specific behavior

For each variation point, determine:

- What can change
- What should remain stable
- Where the variation is currently located
- Whether it is encapsulated
- Which callers know about concrete choices
- How a new variation would be added
- Whether existing code must be modified
- Whether a conditional is acting as a variation switch

Flag cases where changing one behavior requires editing stable orchestration or
several unrelated callers.
```

---

## 5. Review programming to abstractions

**What it does:** Evaluates whether important clients depend on stable contracts or concrete classes.

```text
Review how this change depends on abstractions and concrete implementations.

For every important dependency, identify:

- The client
- The dependency
- Whether the client imports a concrete class
- Whether an interface or abstract contract exists
- Who selects the concrete implementation
- Whether the implementation can be substituted
- Whether the abstraction reflects a genuine behavioral contract
- Whether callers still depend on implementation-specific methods or data

Look for:

- Concrete imports spread across clients
- Type checks against implementations
- Downcasts
- Interfaces created only for mocking
- Interfaces with one implementation and no credible variation
- Leaky abstractions
- Generic abstractions that hide the domain
- Stable clients forced to change for every new implementation

Do not recommend an interface automatically. Require a real substitution,
boundary, testing, ownership, or variation need.
```

---

## 6. Review composition versus inheritance

**What it does:** Tests whether inheritance represents a true subtype relationship or merely a mechanism for varying behavior.

```text
Review every inheritance and composition relationship affected by this change.

For inheritance, identify:

- Behavior inherited
- State inherited
- Methods overridden
- Whether the subtype honors the parent contract
- Whether callers rely on subtype knowledge
- Whether base-class changes affect unrelated subclasses
- Whether the hierarchy exists mainly for code reuse
- Whether new requirements produce more subclasses

Look for:

- Fragile base classes
- Deep hierarchies
- Subclass explosion
- Empty inherited methods
- Methods that throw "unsupported"
- Type checks against subclasses
- Overrides that bypass base invariants
- Parallel class hierarchies

For composition, identify:

- Behavior delegated
- Collaborator selected
- Whether it can be replaced independently
- Whether composition creates useful flexibility
- Whether it merely adds indirection

Explain where composition would improve change locality and where inheritance is
the simpler and more accurate design.
```

---

## 7. Review design-pattern fit

**What it does:** Verifies pattern claims using intent, participants, and collaboration rather than names.

```text
Review every design-pattern candidate introduced or changed by this patch.

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
2. Confidence:
   - Confirmed
   - Likely
   - Partial
   - Superficial resemblance
   - Not present
3. The real design problem
4. The participants and their pattern roles
5. The collaboration sequence
6. What varies
7. What remains stable
8. How the design is extended
9. Benefit gained
10. Complexity or trade-off introduced
11. Whether a simpler design would work

Do not classify code as a pattern merely because:

- A class has the pattern name
- An interface has multiple implementations
- A wrapper delegates
- A callback exists
- An event emitter is imported
- A function constructs an object
- An enum represents state
```

---

## 8. Review object collaboration

**What it does:** Maps the runtime conversation between participants and flags excessive knowledge or coordination.

```text
Review how objects collaborate in this change.

For each important participant, identify:

- Who creates it
- Who calls it
- Who it calls
- Messages or methods exchanged
- Data passed between collaborators
- State read or modified
- Events published or consumed
- Concrete types known
- Required call ordering
- Lifecycle assumptions

Look for:

- Objects that know too many collaborators
- Long coordination chains
- Circular dependencies
- Hidden global dependencies
- Feature envy
- Callers reaching through one object into another
- Concrete collaborators passed through several layers
- Objects that only forward calls
- Collaboration that is difficult to test independently
- Runtime behavior hidden in registration or middleware

Explain whether the collaboration is understandable from local code and whether
each participant knows only what it needs.
```

---

## 9. Review object creation

**What it does:** Reviews where concrete types are selected, configured, constructed, and owned.

```text
Review object creation and dependency selection in this change.

Find:

- Direct constructor calls
- Static factories
- Factory functions
- Factory classes
- Dependency-injection bindings
- Service locators
- Framework registration
- Runtime plugin loading
- Environment-based selection
- Test substitutions

For each created object, identify:

- Who requests it
- Who selects the concrete implementation
- Who constructs it
- Who configures it
- Who owns its lifetime
- Whether related objects must form a compatible family
- Whether callers depend on the concrete type
- Whether creation logic is duplicated

Determine whether the creation design is:

- Simple and appropriately direct
- Centralized for a valid reason
- A credible Factory Method
- A credible Abstract Factory
- Dependency injection without a GoF factory
- Scattered concrete construction
- A factory abstraction that does not earn its complexity

Do not recommend a factory merely to remove constructor calls.
```

---

## 10. Review interface complexity

**What it does:** Reviews public contracts for behavioral clarity and implementation leakage.

```text
Review each public interface changed by this patch.

Evaluate:

- Number of concepts exposed
- Number of parameters
- Boolean flags
- Mode or type parameters
- Configuration options
- Required call ordering
- Return-value complexity
- Error surface
- Special cases
- Default behavior
- Naming clarity
- Concrete implementation types exposed
- Knowledge required by callers

Look especially for:

- Boolean flags selecting algorithms
- Enums selecting concrete implementations
- Callers passing provider-specific configuration
- Methods only valid in certain states
- Interfaces that require downcasting
- Factories returning overly broad base types
- Abstractions that expose every implementation option

Ask whether a caller expresses a genuine requirement or is being forced to make
an internal design decision.
```

---

## 11. Review state-dependent behavior

**What it does:** Evaluates state ownership, transitions, scattered conditionals, and whether a State-pattern design is justified.

```text
Review state-dependent behavior introduced or changed by this patch.

For each important state value, identify:

- Source of truth
- Owner
- Possible states
- Allowed transitions
- Transition triggers
- Behavior available in each state
- Invalid operations
- Side effects of transitions
- Persistence
- Readers and writers

Look for:

- State conditionals scattered across modules
- Switch statements that grow whenever a state is added
- Invalid combinations of flags
- Transitions that bypass invariants
- Multiple sources of truth
- Objects that change behavior based on another object's internals
- State objects that contain no meaningful behavior
- A State pattern introduced for a trivial enum

Determine whether the design is best described as:

- Plain state with localized conditionals
- Explicit state machine
- Reducer-based state
- Confirmed State pattern
- Partial State pattern
- Unnecessary pattern complexity
```

---

## 12. Review events and observers

**What it does:** Reviews event-driven collaboration, subscriber lifecycle, payload coupling, ordering, and failure isolation.

```text
Review every event, callback, listener, or observer affected by this change.

Identify:

- Publisher or subject
- Subscribers or observers
- Registration mechanism
- Unregistration mechanism
- Event type
- Payload
- Dispatch mechanism
- Synchronous or asynchronous delivery
- Delivery order
- Error handling
- Subscriber lifetime
- Duplicate registration behavior
- Hidden side effects

Check whether:

- Publishers know concrete subscribers
- Subscribers depend on publisher internals
- Event payloads expose mutable internal state
- Ordering between observers matters
- One observer failure prevents others
- Listeners are leaked or never removed
- Duplicate subscriptions are possible
- Events are used where a direct call would be clearer
- Direct calls are used where decoupled notification is needed
- The code is genuinely Observer or merely callback infrastructure

Explain the concrete behavior when subscribers are added, removed, duplicated,
slow, or failing.
```

---

## 13. Review wrappers and boundaries

**What it does:** Distinguishes useful boundary patterns from decorative wrappers and pass-through layers.

```text
Review every wrapper, gateway, integration layer, client, middleware, and facade
affected by this change.

For each one, determine whether it primarily:

- Converts one interface into another
- Simplifies a complex subsystem
- Adds behavior before or after delegation
- Controls access to another object
- Hides remote communication
- Selects an implementation
- Merely renames or forwards calls

Classify it as:

- Adapter
- Facade
- Decorator
- Proxy
- Strategy
- Gateway
- Anti-corruption layer
- Plain wrapper
- Pass-through
- Unclear

For every classification, explain:

- Caller
- Exposed interface
- Wrapped or adapted interface
- Whether object identity is preserved
- Whether behavior is added
- Whether the goal is compatibility, simplification, extension, or access control
- Whether callers still understand the underlying implementation

Flag wrappers that add navigation without reducing coupling or simplifying use.
```

---

## 14. Review change impact

**What it does:** Uses plausible future changes to test whether variation is localized and whether patterns earn their complexity.

```text
Use these hypothetical changes to test the design:

1. [Add a new behavior or algorithm]
2. [Replace an external provider or implementation]
3. [Add a new state, event, command, or product type]

For each change, identify:

- Files likely to change
- Existing classes likely to be modified
- New classes likely to be added
- Interfaces likely to change
- Conditionals likely to grow
- Registration or wiring changes
- Tests likely to change
- Stable code that remains untouched
- Abstractions that contain the change
- Dependencies that allow the change to spread

Classify the extension mechanism as:

- Polymorphic extension
- Composition
- Configuration
- Registration
- Factory selection
- Conditional modification
- Duplication
- Framework change

Then answer:

- Does the current design follow open/closed where it matters?
- Is the expected change realistic?
- Does the flexibility justify the indirection?
- Would a simpler local change be clearer?
```

---

## 15. Review tests as design evidence

**What it does:** Evaluates whether tests prove behavior and useful substitution while avoiding excessive coupling to participant structure.

```text
Review the tests changed or added by this patch.

Determine whether they verify:

- User-visible behavior
- Domain invariants
- Collaborator contracts
- Interchangeable implementations
- State transitions
- Event publication and subscription
- Object-creation selection
- Error behavior
- Edge cases
- Extension with a new implementation

Look for tests that are overly coupled to:

- Private methods
- Exact call order without a behavioral reason
- Concrete class names
- Constructor wiring
- Internal helper functions
- Number of delegation steps
- Mock interactions instead of outcomes
- Textbook pattern structure

Ask:

- Could the implementation be refactored without rewriting most tests?
- Can one implementation be replaced with another under the same contract?
- Do tests prove that a new variation can be added safely?
- Are mocks exposing excessive collaboration complexity?
- Is a difficult-to-test design signaling excessive coupling?

Separate missing behavioral coverage from optional design-oriented tests.
```

---

## A. Reviewing an AI-generated change

**What it does:** Applies extra skepticism to common AI-generated design smells: ceremonial interfaces, needless factories, pattern overuse, tiny wrappers, and generic abstractions.

```text
Review this AI-generated change skeptically using Head First Design Patterns.

Look specifically for:

- Pattern names copied from textbook examples without a real design problem
- Interfaces with one implementation and no credible variation
- Abstract factories that create one product
- Strategies selected by large conditionals
- Decorators that only forward calls
- Facades that expose the entire subsystem
- Adapters that preserve the original interface unchanged
- State classes containing no behavior
- Commands that are only renamed function calls
- Observers used for a direct one-to-one dependency
- Singleton used as global mutable state
- Excessive dependency injection
- Generic base classes that obscure the domain
- One class per tiny operation
- Parallel class hierarchies
- Speculative extension points
- Over-mocking caused by fragmented collaboration

For each candidate, determine whether it:

- Solves a demonstrated change problem
- Creates a stable substitution point
- Improves responsibility ownership
- Reduces coupling
- Simplifies callers
- Is justified by more than one real implementation or future requirement

Prefer the smallest design that clearly supports the current behavior and
credible sources of change.
```

---

## B. Review a single class or function

**What it does:** Zooms in on one unit while still evaluating its collaborators and sources of variation.

```text
Review [class, function, hook, or module] using Head First Design Patterns.

Evaluate:

- Primary responsibility
- Secondary responsibilities
- Inputs and outputs
- State owned
- Decisions owned
- Collaborators
- Concrete dependencies
- Behavior delegated
- Behavior that varies
- Conditionals selecting behavior
- Object creation
- Side effects
- Error behavior
- Testability

Then answer:

1. Does it have one coherent reason to change?
2. Does it own behavior that belongs elsewhere?
3. Does it depend on abstractions where substitution is useful?
4. Is composition or inheritance used appropriately?
5. Is it acting as a pattern participant?
6. Is that pattern role justified?
7. Could the design be made clearer with a smaller change?

Do not judge the unit in isolation from its callers and collaborators.
```

---

## C. Review a new abstraction or pattern

**What it does:** Tests whether a new interface, hierarchy, factory, wrapper, or pattern earns its existence.

```text
Review the new abstraction introduced by this change.

Identify:

- The concrete design problem
- The behavior or dependency that varies
- The stable code being protected
- The abstraction's clients
- Its implementations
- Its creation and selection mechanism
- Its collaboration model
- Its extension mechanism
- Its runtime and testing benefits
- Its cost in indirection and concepts

Then ask:

- Is there more than one real implementation?
- Is another implementation credibly expected?
- Does the abstraction cross an architectural or vendor boundary?
- Does it simplify clients?
- Does it centralize a real decision?
- Can clients substitute implementations without special knowledge?
- Is the abstraction named around behavior or implementation?
- Does a smaller function, parameter, or direct dependency solve the problem?
- Is a named pattern genuinely present?
- Would removing the abstraction make the code clearer?

Classify it as:

- Necessary now
- Reasonable seam
- Premature but low-cost
- Speculative
- Misapplied pattern
- Unnecessary
```

---

## D. Review a refactor

**What it does:** Checks that behavior remains stable while responsibility, coupling, and change locality improve rather than merely moving code.

```text
Review this refactor using Head First Design Patterns.

First verify that behavior is preserved.

Then compare before and after:

- Responsibility ownership
- Number of concrete dependencies
- Variation points
- Conditionals selecting behavior
- Use of composition
- Inheritance depth
- Object collaboration
- Object-creation logic
- Public interface complexity
- State ownership
- Event coupling
- Test coupling
- Files touched by plausible future changes

Determine whether the refactor:

- Encapsulates changing behavior
- Protects stable orchestration
- Programs to a meaningful abstraction
- Replaces conditionals with appropriate polymorphism
- Reduces or increases participant count
- Reduces or increases runtime indirection
- Improves or obscures the domain
- Introduces a pattern that earns its cost
- Merely relocates complexity

Flag behavioral changes hidden inside the refactor.
```

---

## E. Producing useful review comments

**What it does:** Converts findings into specific comments tied to concrete consequences rather than vague pattern advice.

```text
Turn the review findings into actionable pull-request comments.

For each comment, include:

- Severity: blocking, important, or optional
- File and symbol
- Concrete behavior or design problem
- Why it matters
- Realistic change or failure scenario
- Smallest recommended improvement

Pattern-related comments must not say only:

- "Use Strategy"
- "Apply Factory"
- "Favor composition"
- "Program to an interface"
- "This violates open/closed"

Instead explain:

- What varies
- Which stable code is being modified
- Which participants are coupled
- What concrete future change causes the problem
- How the suggested design localizes that change
- Why the added abstraction is justified

Avoid comments based only on personal preference or textbook conformance.
```

---

## Recommended review workflow

### Pass 1 — Understand and verify behavior

Run:

```text
1. Understand the change first
2. Review correctness
```

Do not begin with pattern identification.

Goal:

```text
Understand what changed and find behavioral defects before discussing design.
```

### Pass 2 — Review responsibility and variation

Run:

```text
3. Review responsibility assignment
4. Review what varies
5. Review programming to abstractions
```

Goal:

```text
Determine who owns each behavior and whether changing code is separated from
stable code.
```

### Pass 3 — Review collaboration and pattern structure

Run the relevant prompts:

```text
6. Review composition versus inheritance
7. Review design-pattern fit
8. Review object collaboration
9. Review object creation
11. Review state-dependent behavior
12. Review events and observers
13. Review wrappers and boundaries
```

Goal:

```text
Determine whether the participants and collaborations form a useful design,
not merely a recognizable pattern shape.
```

### Pass 4 — Test maintainability

Run:

```text
10. Review interface complexity
14. Review change impact
15. Review tests as design evidence
```

Goal:

```text
Test whether realistic new behavior can be added without unnecessary changes
or brittle tests.
```

### Pass 5 — Produce comments

Run:

```text
E. Producing useful review comments
```

Goal:

```text
Turn the highest-value findings into concrete, proportionate PR feedback.
```

---

## Questions to remember during manual review

```text
What behavior changed?

Which object should own that behavior?

What varies?

What should remain stable?

Where is the concrete implementation selected?

Do clients depend on abstractions or concrete types?

Is composition being used for behavior that changes?

Is inheritance representing a true subtype?

How do the objects collaborate at runtime?

Does a claimed pattern have real participants and intent?

What new requirement would justify this abstraction?

Would that requirement extend the design or modify many existing classes?

Does the pattern reduce more complexity than it adds?

Could a smaller design solve the same problem?

Do the tests verify behavior or merely mirror the implementation?
```

---

## The overall model

A complete code review contains four different reviews:

```text
Correctness review
    Does the change behave correctly?

Responsibility review
    Is behavior owned by the right object?

Collaboration review
    Are dependencies and interactions clear and appropriately decoupled?

Change review
    Can realistic new behavior be added without unnecessary modification?
```

Head First Design Patterns primarily strengthens the last three. It should not replace the first.

---

## Pattern-evidence rule

Never accept:

```text
This uses Strategy because there is a PricingStrategy interface.
```

Require:

```text
The pricing algorithm varies independently from checkout orchestration.

CheckoutService delegates pricing to the PricingPolicy abstraction.
PercentagePricing and TieredPricing provide interchangeable behaviors.
The concrete policy is selected during composition, and CheckoutService does
not branch on pricing type.

A new pricing algorithm can be added without modifying CheckoutService.

This supports a Strategy classification.
```

Likewise:

```text
Interface with multiple implementations ≠ automatically Strategy

Event emitter ≠ automatically Observer

Object-creation helper ≠ automatically Factory Method

Wrapper ≠ automatically Adapter or Decorator

Status enum ≠ automatically State

Service method ≠ automatically Command

Global instance ≠ justified Singleton
```

---

## Final code-review principle

The goal is not to ask:

```text
Which design patterns does this diff use?
```

The better sequence is:

```text
What behavior changed?
Who owns it?
What varies?
What should remain stable?
Which objects collaborate?
Where are concrete decisions made?
What future change tests this design?
Does a known pattern accurately explain the collaboration?
Does that pattern earn its complexity?
```

Pattern names should summarize a proven design—not substitute for understanding it.
