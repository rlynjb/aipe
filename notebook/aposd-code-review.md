Yes. **APOSD is excellent for code review**, particularly for reviewing whether a change makes the system easier or harder to understand and modify.

A normal code review asks:

```text
Does this code work?
Are there bugs?
Are there tests?
```

An APOSD-oriented review also asks:

```text
Where did the complexity go?
Is the complexity hidden inside a module, or pushed onto callers?
Did this change duplicate design knowledge?
Will the next change require editing many places?
```

APOSD should complement—not replace—reviews for correctness, security, performance, accessibility, and testing.

## Master APOSD code-review prompt

```text
Review this change using principles from A Philosophy of Software Design.

Do not focus only on style or formatting.

Evaluate:

1. What behavior the change introduces or modifies.
2. Whether the implementation matches the intended behavior.
3. Which modules and interfaces are affected.
4. Where the new complexity is located.
5. Whether modules hide meaningful complexity from callers.
6. Whether any interface became more complicated.
7. Whether implementation details leak across module boundaries.
8. Whether design knowledge is duplicated.
9. Whether responsibilities and state ownership are clear.
10. Whether the change introduces temporal coupling or required call ordering.
11. Whether the change increases change amplification.
12. Whether names and control flow make the code obvious.
13. Whether errors are handled at the correct abstraction level.
14. Whether the tests verify behavior and important invariants.
15. Whether a smaller or more localized design would be clearer.

Separate findings into:

- Correctness issues
- Design and complexity issues
- Maintainability risks
- Testing gaps
- Optional improvements

For every finding:

- Cite the file and symbol
- Explain the concrete consequence
- Give a realistic scenario where it matters
- Suggest the smallest reasonable improvement
- Mark it as blocking, important, or optional

Do not recommend abstraction merely to reduce line count.
Do not reward additional layers unless they hide meaningful complexity.
```

# Recommended review workflow

Use several passes rather than asking the agent to review everything simultaneously.

```text
Pass 1: Understand the intended behavior
Pass 2: Review correctness and failure cases
Pass 3: Review module boundaries and information hiding
Pass 4: Review state, dependencies, and errors
Pass 5: Review tests and change impact
Pass 6: Summarize only actionable findings
```

## 1. Understand the change first

```text
Explain this change before reviewing it.

Identify:

- The user or system behavior being changed
- The entry points affected
- The major execution path
- State read or written
- External systems involved
- Existing behavior being replaced
- Important invariants
- Assumptions made by the implementation

Separate what is directly confirmed by the diff from what you inferred.
```

This prevents the agent from criticizing code it has not properly understood.

## 2. Review correctness

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

For each issue, provide a concrete input or event sequence that demonstrates
the failure.
```

APOSD is primarily a design philosophy, so this normal correctness pass should still come first.

## 3. Review module depth

A deep module offers substantial functionality behind a comparatively simple interface.

```text
Evaluate the depth of every module introduced or substantially changed.

For each module, identify:

- Functionality provided
- Public interface
- Configuration required
- Knowledge required by callers
- Complexity hidden internally
- Complexity exposed externally

Classify it as:

- Deep
- Moderately deep
- Shallow
- Pass-through
- Unclear

Explain whether the module makes the system easier to use or merely moves code
into another file.
```

A useful review question is:

> Is the interface considerably simpler than the implementation behind it?

If not, the abstraction may not be helping.

## 4. Detect shallow abstractions

AI-generated code often creates unnecessary hooks, services, helpers, factories, interfaces, and wrappers.

```text
Look for shallow abstractions introduced by this change.

Find modules or functions that:

- Only forward arguments
- Rename another API
- Contain almost no policy or behavior
- Expose nearly every implementation option
- Require callers to understand the wrapped implementation
- Are used only once without creating a meaningful boundary
- Split a simple operation across many files

For each candidate, determine whether it is:

- A useful adapter
- A stable architectural boundary
- A test seam
- A shallow abstraction
- An unnecessary pass-through

Do not assume that more modules mean better modularity.
```

## 5. Review information hiding

```text
For each changed module, identify:

- What design decisions it owns
- What implementation details it hides
- What callers currently need to know
- What callers should not need to know
- Which internal details are exposed through parameters, return values,
  configuration, errors, or required operation ordering

Determine whether the change improves or weakens information hiding.
```

Examples of details that may be leaking:

```text
Database column names
HTTP response shapes
Cache-key formats
Retry rules
Storage representation
Vendor-specific error codes
Graph traversal implementation
Serialization format
Internal status values
```

## 6. Find duplicated design knowledge

This is one of the most valuable APOSD review checks.

```text
Search the change and surrounding code for duplicated design knowledge.

Look for rules such as:

- Validation requirements
- Status transitions
- Field mappings
- Permission decisions
- Default values
- Error-code interpretations
- Cache-key construction
- Serialization formats
- Database constraints
- Business calculations

For each duplicated rule:

1. Show all locations that know the rule.
2. Explain how those locations could diverge.
3. Identify which module should own the rule.
4. Determine whether this change increases or reduces duplication.
```

The problem is not merely repeated syntax. The problem is **the same decision being encoded in multiple places**.

## 7. Review responsibility ownership

```text
For each responsibility introduced by this change, identify its owner.

Responsibilities may include:

- Validation
- Authorization
- Transformation
- Persistence
- Caching
- Retry behavior
- State transitions
- Error translation
- UI formatting
- Domain calculations

Check whether:

- One responsibility is scattered across several modules
- One module owns unrelated responsibilities
- Callers perform work that should belong inside the callee
- Ownership is ambiguous
- Multiple modules can independently make the same decision
```

A strong review question is:

> Who is authoritative for this decision?

If there is no clear answer, future changes are likely to create inconsistencies.

## 8. Review state ownership

```text
Map every state value added or modified by this change.

For each value, identify:

- Source of truth
- Owner
- Readers
- Writers
- Lifetime
- Persistence mechanism
- Derived values
- Synchronization behavior
- Invariants
- Staleness risks

Look for:

- Multiple sources of truth
- Duplicated derived state
- Ambiguous ownership
- State copied unnecessarily
- State that can become temporarily inconsistent
- Callers that must manually keep values synchronized
```

This is especially useful for React, frontend stores, caches, and optimistic updates.

## 9. Review temporal coupling

```text
Find operations that must occur in a particular order.

Examples:

- Initialize before reading
- Validate before transforming
- Save before publishing
- Refresh after mutation
- Register before dispatching
- Load configuration before constructing a service

For each sequence, determine:

- Whether the required order is obvious
- Whether the interface enforces it
- How many callers must remember it
- What happens when the order is violated
- Whether the module could absorb or eliminate the ordering requirement
```

An API like this is often fragile:

```ts
const client = createClient();
client.configure(config);
client.initialize();
client.load();
```

A deeper interface may be:

```ts
const client = await createReadyClient(config);
```

The second version hides the initialization sequence from callers.

## 10. Review interface complexity

```text
Review each public interface changed by this patch.

Evaluate:

- Number of parameters
- Boolean flags
- Configuration options
- Required call ordering
- Return-value complexity
- Error surface
- Special cases
- Naming clarity
- Default behavior
- Knowledge required by callers

Ask whether the interface became simpler or more complex than before.

Identify parameters that expose implementation decisions rather than genuine
caller requirements.
```

Pay particular attention to boolean flags:

```ts
loadGraph(true, false, true)
```

They often indicate hidden modes and unclear responsibilities.

## 11. Review general-purpose versus special-purpose design

APOSD generally warns against excessive special cases, but “generic” code can also become difficult.

```text
Determine whether this implementation is appropriately general.

Check for two opposite problems:

1. Overly special-purpose code
   - Hard-coded behavior
   - One-off branches
   - Feature-specific logic scattered through shared modules

2. Overly generic code
   - Excessive configuration
   - Abstract factories with one implementation
   - Generic types that obscure the domain
   - Extension points without realistic future users
   - Framework-building instead of solving the current problem

Recommend the simplest design that supports the known requirements without
creating unnecessary special cases.
```

## 12. Review error abstraction

```text
Review how errors cross module boundaries.

Identify:

- Where errors originate
- Where they are caught
- Where they are translated
- Where context is added or lost
- Which errors reach callers
- Which errors reach users
- Whether callers must understand infrastructure-specific failures

Check whether each module exposes errors appropriate to its abstraction level.
```

For example:

```text
Poor boundary:
UI handles PostgreSQL constraint code 23505.

Better boundary:
Repository translates it into DuplicateProjectNameError.
```

## 13. Review code obviousness

APOSD values code that can be understood quickly and accurately.

```text
Review this change for code obviousness.

Look for:

- Misleading names
- Important behavior hidden in generic helpers
- Side effects not reflected in names
- Control flow spread across many small functions
- Clever expressions
- Implicit conventions
- Unexpected mutation
- Nonlocal dependencies
- Comments that repeat code
- Missing comments about design reasoning
- Names that require knowledge of implementation details

Identify the smallest changes that would reduce the time needed to understand
the code correctly.
```

Useful distinction:

```text
Bad comment:
Increment index by one.

Useful comment:
Skip the synthetic root node because it is not persisted.
```

The second comment explains information that is not obvious from the code itself.

## 14. Review change amplification

```text
Use hypothetical future changes to evaluate this design.

Consider:

1. A small behavior modification
2. A new data field or state
3. A replacement of an external dependency
4. A new caller
5. A new error case

For each scenario, identify:

- Files likely to change
- Interfaces likely to change
- Rules duplicated across locations
- Modules that successfully contain the change
- Changes that would spread through unrelated layers

Determine whether this patch improves or worsens change locality.
```

This is often more informative than merely asking whether the code “looks clean.”

## 15. Review tests as design evidence

```text
Review the tests for this change.

Determine whether they verify:

- User-visible behavior
- Important domain invariants
- Public module contracts
- Error behavior
- Boundary conditions
- State transitions
- Regression scenarios
- Concurrency or timing behavior when relevant

Look for tests that are overly coupled to:

- Private methods
- Internal call order
- Specific implementation details
- Mock interactions rather than outcomes
- Exact internal data representations

Explain what the tests reveal about the quality of the module interfaces.
```

Tests that must know every internal call often indicate that module boundaries are weak.

# Reviewing an AI-generated change

This prompt is especially useful when using an AI coding agent:

```text
Review this AI-generated implementation skeptically.

Look specifically for common AI-generated design problems:

- Unnecessary files or layers
- Shallow wrapper functions
- Interfaces with only one implementation
- Premature factories or dependency injection
- Duplicate validation
- Excessive configuration
- Generic utility modules containing domain logic
- Broad exception handling
- Silent fallback behavior
- Type assertions hiding invalid states
- Comments that claim behavior not guaranteed by code
- Tests that merely reproduce the implementation
- New abstractions that are not used consistently
- Partial migration leaving two competing patterns

Determine which abstractions hide meaningful complexity and which merely add
navigation cost.
```

## Review a single function

```text
Review this function using APOSD principles.

Determine:

- Its actual responsibility
- Whether it performs more than one conceptual task
- What assumptions it makes
- What design knowledge it contains
- Whether that knowledge appears elsewhere
- Whether its inputs expose implementation details
- Whether its output creates work for callers
- Whether its name accurately communicates behavior
- Whether the function should remain separate, be merged, or belong in another
  module

Do not recommend extraction merely because the function is long.
```

Long functions are not automatically bad. A longer function with coherent logic may be easier to understand than ten tiny functions requiring constant navigation.

## Review a new abstraction

```text
Evaluate whether this new abstraction earns its existence.

Ask:

- What complexity does it hide?
- What decision does it centralize?
- How much simpler is its interface than its implementation?
- How many realistic callers need it?
- Could callers use the underlying implementation just as easily?
- Does it create a stable boundary?
- Does it reduce change amplification?
- Does it eliminate duplicated knowledge?
- Does it introduce terminology developers must learn?
- What would be lost if the abstraction were removed?

Conclude with:

- Keep as-is
- Simplify
- Merge with another module
- Move responsibility
- Remove abstraction
```

## Review a refactor

```text
Review this refactor separately from behavioral changes.

Verify:

- Whether behavior is genuinely preserved
- Whether complexity was reduced rather than relocated
- Whether module interfaces became simpler
- Whether information hiding improved
- Whether duplicated knowledge was removed
- Whether dependencies became more localized
- Whether the new structure requires more navigation
- Whether tests are less coupled to implementation
- Whether temporary compatibility layers remain

Identify any part of the refactor that changes behavior despite being presented
as structural only.
```

## Producing useful review comments

Ask the agent not to produce vague opinions:

```text
Write code-review comments that are concrete and actionable.

Each comment must include:

1. Location
2. Observed issue
3. Concrete consequence
4. Scenario where it matters
5. Smallest suggested improvement
6. Severity

Avoid comments such as:

- This could be cleaner.
- Consider refactoring.
- This feels complex.
- Use better separation of concerns.

Only report issues that have a plausible maintenance, correctness, or usability
consequence.
```

A good comment might be:

> **Important:** `ProductCard` now interprets the raw API status values `"active"` and `"archived"`. The same mapping exists in `productMapper.ts`. If the backend adds another status, both locations must change together. Consider returning a domain-level `ProductState` from the mapper so UI components do not depend on the transport representation.

# Compact daily code-review prompt

```text
Review this diff using APOSD principles.

Focus on:

1. Correctness and violated invariants
2. Module depth
3. Information hiding
4. Duplicated design knowledge
5. Responsibility and state ownership
6. Interface complexity
7. Temporal coupling
8. Change amplification
9. Error abstraction
10. Code obviousness
11. Test quality

For every finding, provide:

- Evidence
- Concrete consequence
- Severity
- Smallest recommended improvement

Separate blocking issues from optional design improvements.
Do not recommend additional abstractions unless they hide meaningful complexity.
```

## Questions to remember during manual review

```text
What complexity does this change introduce?

Where is that complexity contained?

Does the caller need to know this detail?

Who owns this decision?

Is the same rule represented anywhere else?

Can invalid state cross this boundary?

Does the interface make the common case simple?

Must callers remember a particular operation order?

Would a likely future change remain localized?

Is this abstraction deeper than its interface?

Does this code make the system more obvious?

Does the test verify behavior or merely mirror the implementation?
```

The overall model is:

```text
Correctness review:
Does the change work?

APOSD review:
Does the design contain its complexity?

Change-impact review:
Will the next modification remain localized?

Testing review:
Can we prove the behavior without depending on implementation details?
```

The strongest code review combines all four.
