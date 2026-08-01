# APOSD Feature-Planning Prompt Library

Quick-reference for planning a Jira feature with *A Philosophy of Software Design* principles. Pick a prompt, paste your ticket, run it. Prompts never write code — they place complexity deliberately before you touch the keyboard.

A Jira ticket usually tells you:

```text
What the user needs
What behavior is accepted
What is excluded
Extra context and constraints
```

APOSD helps you determine:

```text
Which module should own the behavior?
What information should be hidden?
What invariants must always hold?
What should callers not need to understand?
How can the feature remain easy to change later?
```

The goal is not to generate an elaborate architecture before writing code. The goal is to **remove ambiguity and deliberately place complexity**.

---

## Index

| # | Prompt | What it does | Reach for it when |
|---|--------|--------------|-------------------|
| 1 | **Compact daily** | 14-step condensed plan, all phases in one shot | Default. Most tickets. |
| 2 | **Master** | Full 15-stage deep analysis | High-risk / ambiguous / cross-cutting feature |
| 3 | **First pass** | Sorts ticket into confirmed / inferred / ambiguous / contradictory | Before anything — normalize the ticket |
| 4 | **AC → invariants** | Turns each acceptance criterion into a guarantee + owner + test | AC is vague or behavior-only |
| 5 | **Codebase investigation** | Question set for locating where the feature belongs | Requirements clear, need to find the fit |
| 6 | **Closest features** | Finds 3 nearest existing features + reusable decisions | Suspect similar behavior already exists |
| 7 | **Responsibility map** | Plans by decision / owner instead of frontend/backend/db | Risk of scattering one decision across layers |
| 8 | **Two designs** | A (extend) vs B (restructure), full trade-off compare | Multiple viable structures |
| 9 | **Overengineering check** | Flags speculative abstractions in a proposed plan | Plan feels layer-heavy or AI-generated |
| 10 | **Future-change probes** | Stress-tests boundaries against likely future changes | Validate module boundaries before coding |
| 11 | **Vertical slices** | Converts chosen design into independently testable slices | Ready to sequence implementation |

Reference (not prompts): [Planning sequence](#recommended-planning-sequence) · [Planning questions](#planning-questions--mental-checklist) · [Workflow](#workflow-summary)

---

## Recommended planning sequence

```text
Jira ticket
    ↓
Behavioral contract
    ↓
Open questions and assumptions
    ↓
Domain concepts and invariants
    ↓
Existing-system investigation
    ↓
Execution and data flow
    ↓
Responsibility boundaries
    ↓
Two or more design options
    ↓
Selected design and trade-offs
    ↓
Implementation slices
    ↓
Testing and rollout plan
```

---

## 1. Compact daily prompt

**What it does:** Runs every planning phase in a condensed 14-step pass. Your everyday driver for a normal ticket — output separates evidence, requirements, assumptions, and recommendations.

```text
Plan this Jira feature using APOSD principles. Do not write code yet.

1. Extract confirmed requirements, assumptions, ambiguities, and exclusions.
2. Rewrite the acceptance criteria as testable behavior.
3. Identify domain concepts, state transitions, and invariants.
4. Find the existing modules and patterns involved.
5. Trace the likely end-to-end execution and data flow.
6. Assign each business and technical decision to an owning module.
7. Identify what each module should hide.
8. Propose two designs and compare their trade-offs.
9. Check for shallow modules, duplicated knowledge, temporal coupling, and
   multiple sources of truth.
10. Probe the design with likely future changes.
11. Recommend one design.
12. Break it into independently testable vertical slices.
13. Map acceptance criteria and invariants to tests.
14. List open questions, risks, rollout concerns, and definition of done.

Separate codebase evidence, ticket requirements, assumptions, and recommendations.
```

---

## 2. Master feature-planning prompt

**What it does:** The full 15-stage analysis — behavioral contract through rollout. Use when a feature is high-risk, cross-cutting, or ambiguous enough to justify the depth. Paste the Jira ticket, acceptance criteria, out-of-scope section, and relevant comments into the top.

```text
You are helping me plan a software feature using principles from A Philosophy of Software Design.

Do not implement the feature yet.

Jira ticket:

[Paste user story]

Acceptance criteria:

[Paste acceptance criteria]

Out of scope:

[Paste out-of-scope items]

Additional context and Jira comments:

[Paste relevant comments]

Relevant codebase areas, if known:

[Files, modules, routes, services, or leave blank]

Analyze the ticket in the following stages.

## 1. Behavioral contract

Explain the feature from the user's perspective:

* Who uses it
* What triggers it
* Inputs
* Visible outputs
* State changes
* Success behavior
* Loading behavior
* Empty behavior
* Failure behavior
* Permissions or prerequisites
* Side effects
* Persistence requirements

Rewrite the acceptance criteria into precise, testable behavioral statements.

Do not add requirements that are not supported by the ticket.

## 2. Requirement classification

Classify every requirement as one of:

* Explicit requirement
* Implied requirement
* Technical constraint
* Product assumption
* Open question
* Out of scope
* Possible future requirement

Cite the ticket section or comment supporting each conclusion.

Separate confirmed requirements from interpretations.

## 3. Ambiguities and contradictions

Identify:

* Missing behavior
* Contradictory acceptance criteria
* Comments that change the original story
* Undefined terminology
* Unspecified edge cases
* Unclear ownership
* Missing permissions
* Missing error behavior
* Missing data-retention behavior
* Requirements that may be technically incompatible

For each ambiguity, explain why it matters and propose a concrete question for the product owner, designer, or engineering team.

Do not silently resolve material ambiguities.

## 4. Domain model

Identify the important domain concepts involved.

For each concept, describe:

* Meaning
* Important fields
* Relationships
* Lifecycle
* Valid states
* Invalid states
* Ownership
* Persistence needs

Do not base the domain model on UI components or database tables alone.

## 5. Invariants

List the conditions that must always remain true.

Examples include:

* Valid state transitions
* Permission guarantees
* Uniqueness constraints
* Relationship constraints
* Ordering requirements
* Data consistency rules
* Idempotency requirements

For each invariant, identify:

* Where it should be enforced
* Whether the type system can represent it
* Whether runtime validation is needed
* Whether a database constraint is needed
* Which tests should prove it

## 6. Existing-system investigation

Identify what must be inspected in the codebase before selecting a design:

* Existing entry points
* Similar features
* Domain models
* State management
* APIs
* Persistence layer
* Authorization
* Error conventions
* Background jobs
* Analytics
* Feature flags
* Tests
* Shared abstractions

Provide targeted codebase-search questions rather than generic exploration instructions.

## 7. End-to-end flow

Describe the expected execution flow from entry point to completion.

Include:

1. User or system trigger
2. Input collection
3. Validation
4. Authorization
5. Domain operation
6. Persistence
7. External effects
8. State synchronization
9. Response
10. UI feedback
11. Error recovery

Clearly label which steps already exist and which must be introduced.

## 8. Responsibility and ownership map

For each responsibility, identify the module that should own it:

* Input validation
* Authorization
* Business rules
* State transitions
* Data transformation
* Persistence
* Caching
* External integrations
* Error translation
* UI presentation
* Analytics
* Retry or recovery behavior

Look for decisions that could accidentally be duplicated across layers.

Explain which information each module should hide from its callers.

## 9. APOSD design assessment

Evaluate the proposed boundaries using these principles:

* Deep modules
* Simple interfaces
* Information hiding
* Clear responsibility ownership
* Minimal change amplification
* Minimal temporal coupling
* General-purpose versus special-purpose design
* Code obviousness
* Errors defined at the appropriate abstraction level

Identify likely shallow modules, pass-through layers, unnecessary wrappers, or configuration that would shift complexity onto callers.

Do not introduce abstractions merely to create more layers.

## 10. Design alternatives

Produce at least two viable designs.

For each design, show:

* Modules
* Interfaces
* Dependencies
* State ownership
* Data flow
* Information hidden
* Information exposed
* Advantages
* Disadvantages
* Testing implications
* Migration cost
* Likely future-change impact

Recommend one design and explain why it best minimizes overall system complexity.

## 11. Change-impact probes

Test the proposed design against:

* A likely small enhancement
* A new state or field
* A changed business rule
* A second caller
* A replacement external dependency
* A new failure case

Explain which modules would change in each scenario.

Use this to identify leaked knowledge and weak boundaries.

## 12. Implementation plan

Break the work into small, independently verifiable slices.

For every slice, include:

* Goal
* Files or modules likely affected
* Behavioral change
* Invariant addressed
* Tests
* Dependencies
* Risks
* Completion signal

Prefer vertical slices that produce testable behavior.

Avoid separating the work only into frontend, backend, and database phases when that prevents end-to-end verification.

## 13. Test strategy

Map each acceptance criterion and invariant to tests.

Include, where applicable:

* Unit tests
* Module contract tests
* Integration tests
* API tests
* UI tests
* Authorization tests
* Failure-path tests
* Concurrency or idempotency tests
* Regression tests
* Manual verification

Avoid tests that merely mirror private implementation details.

## 14. Delivery and rollout

Identify:

* Database migrations
* Backward compatibility
* Feature flags
* Deployment ordering
* Observability
* Logs and metrics
* Analytics events
* Rollback strategy
* Data cleanup
* Documentation
* Operational risks

## 15. Final planning summary

Return:

* Feature summary
* Confirmed requirements
* Open questions
* Assumptions
* Domain concepts
* Invariants
* Recommended design
* Module map
* Data and execution flow
* Implementation slices
* Test matrix
* Rollout considerations
* Risks
* Definition of done

Keep observed facts, design recommendations, and assumptions clearly separated.
```

---

## 3. First pass — understand the ticket

**What it does:** Normalizes raw Jira info into four buckets and rewrites the ticket as a behavioral contract. Prevents Jira comments from quietly changing the scope without being recognized. Run this *before* any architecture discussion.

```text
Analyze this Jira ticket before proposing an implementation.

Create four sections:

## Confirmed

Requirements directly stated by the user story, acceptance criteria, out-of-scope section, or comments.

## Inferred

Behavior that appears necessary but is not explicitly stated.

For every inference, explain what evidence suggests it.

## Ambiguous

Requirements that could reasonably have multiple interpretations.

For each ambiguity, provide one precise clarification question.

## Contradictory

Statements in the ticket or comments that conflict with one another.

Identify which statement came later and whether it appears to supersede the earlier one.

Then rewrite the ticket as a concise behavioral contract without adding unsupported requirements.
```

---

## 4. Turn acceptance criteria into invariants

**What it does:** Converts visible-behavior AC into continuous guarantees, each with an owning module and a test. Surfaces criteria too thin to derive an invariant from.

*Example — ticket:*

```text
As a user, I can archive a project.
Archived projects no longer appear in the active-project list.
```

*Example — possible invariants:*

```text
A project cannot be both active and archived.

Only authorized users may archive the project.

Archiving the same project twice must not create an invalid transition.

Archived projects remain retrievable from archive history.

Active-project queries must consistently exclude archived projects.
```

```text
Convert each acceptance criterion into:

1. User-visible behavior
2. Domain invariant
3. State transition
4. Authorization rule
5. Failure behavior
6. Test case
7. Module responsible for guaranteeing it

Identify acceptance criteria that do not currently define enough information to
derive these items.
```

---

## 5. Questions for investigating the existing codebase

**What it does:** A question set to locate where a feature belongs before choosing a design. Use once the requirements are clear.

```text
Where does similar behavior already exist?

Which module currently owns the closest domain concept?

What are the existing entry points for this workflow?

Where are the relevant business rules enforced?

Where is authorization handled?

What is the source of truth for the affected state?

Which modules can write to that state?

What representations does the data use across UI, API, domain, and persistence?

What errors already exist at this boundary?

Which existing tests describe the current behavior?

Are there competing patterns for solving this problem?

Which implementation is current, and which is legacy?
```

---

## 6. Find the three closest existing features

**What it does:** Locates the 3 nearest existing features and extracts reusable decisions — while explicitly separating good patterns from cargo-culted repetition.

```text
Find the three closest existing features to this Jira ticket.

For each one, explain:

- What behavior it shares with the new feature
- Which modules it uses
- Which design decisions are reusable
- Which limitations should not be copied
- Whether it represents the current preferred architecture
- What evidence supports that conclusion

Do not assume that repeated code represents a good pattern.
```

---

## 7. Design the feature around responsibilities

**What it does:** Plans the feature by *decision* and *owner* rather than by technical layer (frontend / backend / database), so a single business rule doesn't get scattered across several tickets or pull requests.

```text
Map this feature by design decisions rather than files or framework layers.

For every decision, answer:

- What is the decision?
- Which module should be authoritative?
- Which callers need the result?
- Which callers should not know how the decision is made?
- How should the decision be exposed?
- Where could the knowledge accidentally be duplicated?
```

---

## 8. Ask for two designs

**What it does:** Forces a real alternative — A extends the existing architecture, B optimizes ownership and information hiding — then compares them on the APOSD axes and recommends one.

```text
Design this feature in two substantially different ways.

Design A should extend the existing architecture with minimal structural change.

Design B should optimize responsibility ownership and information hiding, even
if it requires a moderate internal restructuring.

For each design, compare:

- Interface complexity
- Module depth
- Information hiding
- Change amplification
- Migration risk
- Testing difficulty
- Consistency with the current codebase
- Long-term maintenance cost

Recommend one, but explain what evidence could change the recommendation.
```

---

## 9. Detect overengineering before coding

**What it does:** Reviews a proposed plan for speculative abstractions (single-impl interfaces, pass-through services, config for hypotheticals) and rules each keep / simplify / merge / defer. AI coding agents often create unnecessary abstractions during feature planning.

```text
Review this proposed plan for speculative design.

Look for:

- Interfaces with only one foreseeable implementation
- Factories that do not hide construction complexity
- Generic repositories that expose the underlying database API
- Hooks or services that merely forward calls
- Configuration for hypothetical future requirements
- Plugin systems without a confirmed need
- New shared utilities that contain feature-specific logic
- Layers that make execution tracing more difficult
- Separate types that represent the same concept without a clear boundary

For each abstraction, state:

- What complexity it hides
- Which decision it owns
- What would happen if it were removed
- Whether it should be kept, simplified, merged, or deferred
```

---

## 10. Probe the design with future changes

**What it does:** Stress-tests module boundaries against likely future changes. These are *design probes*, not requirements — you are not trying to support all these changes immediately; they reveal weak boundaries and leaked knowledge before you commit.

```text
Assume the following changes arrive after this feature ships:

1. A second user role gains limited access.
2. The domain object gains another lifecycle state.
3. The UI is replaced by another client.
4. The persistence technology changes.
5. Bulk operations are added.
6. The operation must become undoable.

For each scenario:

- Which modules change?
- Which interfaces change?
- Which rules are duplicated?
- Which implementation details leak to callers?
- Which parts remain unaffected?

Use the results to identify weak module boundaries.
```

---

## 11. Convert the plan into vertical slices

**What it does:** Turns the chosen design into an ordered set of small, independently testable slices — sequenced to reduce uncertainty early, not split by layer.

*Example slice sequence:*

```text
Slice 1: Domain transition and invariant tests

Slice 2: Persistence support and integration tests

Slice 3: Application-level operation with authorization and error translation

Slice 4: UI entry point and user feedback

Slice 5: Observability, analytics, and rollout controls
```

```text
Convert the recommended feature design into an implementation plan.

Break the work into small vertical slices that can be reviewed and tested independently.

For every slice provide:

* Objective
* User-visible or system-visible outcome
* Modules affected
* Interface changes
* Domain rules or invariants introduced
* Tests required
* Dependencies on previous slices
* Migration or compatibility considerations
* Observability needed
* Risks
* Explicitly excluded work
* Definition of complete

Order the slices to reduce uncertainty early.

Implement the highest-risk assumptions through small experiments before building dependent functionality.

Do not create separate frontend, backend, and database phases unless each phase can be verified independently.

Finish with:

* Recommended pull-request boundaries
* Suggested commit sequence
* Acceptance-criteria-to-test matrix
* Remaining product questions
* Remaining technical questions
```

---

## Planning questions — mental checklist

Not a prompt. Keep these in your head while reviewing any plan:

```text
What exactly must the user be able to do?

What must always remain true?

Which module should guarantee that?

Who owns each state transition?

What information should callers not need to understand?

Is the interface simpler than the behavior behind it?

Is the same design decision encoded elsewhere?

Can invalid state cross this boundary?

Does the plan introduce required operation ordering?

Would the likely next change remain localized?

Are we creating an abstraction for a real boundary or a hypothetical future?

Can the feature be delivered in small end-to-end slices?
```

---

## Workflow summary

```text
Jira tells you what to build.

Codebase investigation tells you where it fits.

System design tells you how the pieces interact.

APOSD tells you where the complexity should live.

The implementation plan tells you how to deliver it safely.
```
