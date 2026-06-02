# Refactor Spec

Use this when restructuring existing code without changing behaviour. The constraint list does most of the work — what must stay functionally identical, what the target structure looks like, and explicit do-not-touch boundaries.


## Refactor spec format


```
## What to refactor
[file, module, or pattern being restructured]

## Why
[the problem with the current structure — name the principle being violated]

## Refactor type
[name the specific technique — see vocabulary below]

## Current structure
[brief description or code snippet of what exists]

## Target structure
[what it should look like after — describe or sketch]

## Must not change
  - External API / interface stays identical
  - No behaviour changes — same input → same output
  - Do not touch [specific files]

## Must not introduce
  - No new dependencies
  - No new abstractions not discussed here
  - No additional refactors discovered along the way —
    surface them as separate specs, don't fold them in

## Done when
[existing tests pass / feature still works end-to-end]
```


> 💾 Save as → .aipe/specs/refactors/[name].md


## Key principle

> Refactors are the highest-risk prompts to give AI. Without tight constraints, Claude will optimise aggressively and change things you didn't ask it to. The "must not change" and "must not introduce" sections are the most important part of this spec.


---


# Refactor vocabulary

This section is a **reference**, not a menu. Use it to name the refactor you want with precision in the "Refactor type" field. Naming the technique makes the target structure unambiguous — both for you and for Claude.

> **Discipline:** one refactor type per spec. If a cleanup needs both an Extract Function and a Replace Conditional, those are two specs, two sessions. Combining them is how scope creeps.

The five categories below are ordered by scope and risk — composition refactors are smallest and safest, DSA refactors are narrowest in applicability. When multiple types could fix the same problem, prefer the smaller one.


## 1. Composition refactors (Fowler-style, language-agnostic)

Small, named, behaviour-preserving operations. Highest-frequency category — most refactors you'll write are one of these. They apply equally to OOP, functional, and procedural code.

  - **Extract Function / Method** — pull a chunk of inline logic into its own named unit. Use when a block needs a comment to explain what it does — the function name replaces the comment.
  - **Inline Function / Inline Variable** — the reverse. A function or variable that adds no clarity, only indirection.
  - **Move Function / Move Field** — code lives in the wrong module, class, or package. Often a sign cohesion has drifted.
  - **Rename** — the name lies about behaviour. Cheap, high-value, often skipped.
  - **Extract Variable** — name an intermediate expression to make logic readable.
  - **Split Phase** — a function does two distinct things in sequence (e.g., parse then transform, validate then persist). Separate them so each phase is independently testable.
  - **Replace Conditional with Polymorphism / Dispatch Table** — long if/else or switch on a type discriminator. Replace with polymorphic types (OOP), a map of functions (functional/procedural), or pattern matching (where the language supports it).
  - **Decompose Conditional** — extract the condition, the then-branch, and the else-branch into named units when the logic is complex enough that the structure is hard to read.
  - **Replace Magic Number / String with Named Constant** — self-explanatory, often a precursor to other refactors.
  - **Parameterize Function** — two functions differ only by a literal value. Combine into one that takes the value as a parameter.
  - **Remove Dead Parameter** — a parameter no caller uses, or one whose value is always the same. Remove it.


## 2. Structural refactors (boundaries, dependencies)

Larger scope than composition refactors. Touch multiple files or modules. Higher risk — verify tests cover the boundary before starting.

  - **Extract Module / Package / Class** — a coherent slice of one unit should be its own unit. Often follows a series of Move Functions.
  - **Inline Module / Class** — the reverse. A unit that doesn't earn its existence.
  - **Invert Dependency** — a unit depends on something it shouldn't (leaf depends on root, low-level depends on high-level, concrete depends on concrete). Flip the dependency direction, usually by introducing an interface, protocol, or callback.
  - **Hide Delegate** — a unit exposes its internals; callers reach through it (`a.getB().getC().doX()`). Wrap the access so callers depend on the unit's surface, not its guts.
  - **Separate Pure from Effectful** — a function mixes pure logic with side effects (network, storage, filesystem, console, mutation). Split them so the pure part is independently testable and the effectful part is thin and pushed to the edges.
  - **Introduce Boundary / Anti-Corruption Layer** — code is mixing the vocabulary of two domains (e.g., your domain types and an external API's types). Introduce a translation layer so each side stays in its own vocabulary.


## 3. Design pattern refactors

Named structural solutions to recurring problems. Apply when the diagnosis matches the pattern — not because the pattern is "good design." A pattern applied without the underlying problem is just added complexity.

### Behavioural — how units coordinate

  - **Strategy** — swap algorithms at runtime via interchangeable units sharing an interface. Cleaner than nested conditionals when the cases are stable and likely to grow.
  - **Observer / Pub-Sub** — one unit's state change notifies others without direct coupling. Use when multiple things need to react to a change and the producer shouldn't know about the consumers.
  - **Command** — wrap an operation as an object/value so it can be queued, logged, undone, or passed around. Useful for action histories, batching, async dispatch.
  - **Template Method** — a base unit defines the skeleton of an algorithm; subtypes fill in the variable steps. Functional equivalent: a higher-order function that takes the variable steps as parameters.
  - **State Machine** — explicit states and transitions, instead of scattered boolean flags. Replaces tangled `if (isLoading && !hasError && !isDone)` chains.
  - **Iterator** — abstract traversal so callers don't depend on the underlying collection shape. Most modern languages provide this natively; the refactor is usually adopting the native idiom.

### Structural — how units compose

  - **Adapter** — wrap an external interface (API, library, legacy code) so the rest of the app talks to your interface, not theirs. Useful when a dependency might be swapped or its API is awkward.
  - **Facade** — collapse a complex subsystem behind one simple interface. Common when multiple modules need the same orchestration.
  - **Composite** — tree-shaped data with uniform treatment of nodes and leaves. The caller treats the whole tree and individual nodes the same way.
  - **Decorator** — wrap a unit to add behaviour (logging, caching, auth) without changing the wrapped unit. Functional equivalent: higher-order functions that take and return functions of the same signature.
  - **Proxy** — stand in for another unit to add control (lazy loading, access checks, remote calls). Distinct from Decorator in intent: Proxy controls access, Decorator adds behaviour.

### Creational — how units are constructed

  - **Factory** — encapsulate construction logic so callers don't depend on concrete types. Use when construction has conditional logic or when the concrete type might change.
  - **Builder** — step-by-step construction of complex objects. Use when constructors have many optional parameters and named arguments aren't available or aren't enough.
  - **Dependency Injection** — pass dependencies in rather than constructing them internally. Makes testing and substitution possible. Often the first refactor toward making code testable at all.

> **Pattern caution:** patterns are a vocabulary, not a goal. "Refactor to use Strategy" is a means; the end is always "make this code easier to change, read, or test." If you can't state the end, don't apply the pattern. Most over-engineered codebases are over-engineered because someone applied patterns without the underlying problem.


## 4. DSA refactors

Narrow category. Only worth applying to **hot paths or code over data that's grown**. Cold code with the "wrong" data structure is not a bug — it's a non-issue.

  - **Change Data Structure** — array used for membership checks (linear) → set/hash set (constant). Array used for lookup by key → map/hash map. Often the biggest single perf win and the smallest diff.
  - **Replace Quadratic with Linear** — nested loops over the same collection. Replace with a hash-based lookup, or a single pass that builds and consumes.
  - **Collapse Traversals** — multiple passes over the same collection, each producing intermediate collections. Combine into one pass when the operations compose cleanly.
  - **Memoize at a Stable Boundary** — derived value computed repeatedly with the same inputs. Cache at a point where the inputs have a clear identity. Don't memoize speculatively — verify the recomputation is actually a cost.
  - **Replace Recursion with Iteration** (or vice versa) — when stack depth, tail-call support, or readability is the driver.
  - **Lazy Evaluation** — defer work until the result is actually needed. Useful when a pipeline produces values most of which are filtered out downstream.
  - **Batch / Debounce / Throttle** — coalesce many small operations into fewer larger ones. Applies to I/O, network, rendering, anything where per-operation overhead dominates.

> **DSA caution:** if you can't point at a measurement showing the current code is a problem, the refactor is speculative. Speculative perf refactors add code without removing real cost.


## 5. Principles (the "why" behind any refactor)

These aren't refactor types — they're the justifications you'd cite in the **Why** field. They cut across paradigms.

  - **Single Responsibility** — a unit should have one reason to change. Multiple reasons → split it.
  - **DRY (with care)** — duplicated logic that *will* drift if not unified. Don't deduplicate things that just *look* alike but represent different concepts; that creates fake coupling.
  - **Separation of Concerns** — presentation, business logic, persistence, side effects each live in their own layer. Mixing them makes any one of them harder to change.
  - **Dependency Inversion** — high-level units shouldn't depend on low-level details; both depend on abstractions.
  - **Open/Closed** — units should be open for extension, closed for modification. Adding a new case shouldn't require editing existing cases.
  - **Liskov Substitution** — subtypes must be usable wherever the base type is used, without surprising callers. Violations usually mean the type hierarchy is wrong.
  - **Interface Segregation** — many small, focused interfaces beat one large one. Callers shouldn't depend on methods they don't use.
  - **Locality of Behaviour** — code that changes together should live together. Sometimes overrides DRY when the duplication is local and the unification would scatter context.
  - **Principle of Least Surprise** — names, signatures, and behaviour should match what a reader would predict. Refactors that violate this are net-negative even if "cleaner" on paper.
  - **Tell, Don't Ask** — prefer asking a unit to do something over querying its state and deciding externally. Keeps logic with the data it operates on.


---


## How to use this vocabulary

When writing a refactor spec:

  1. **Diagnose first** — what's wrong with the current structure? Name the principle being violated (Why field). "Single Responsibility violated" is a real diagnosis; "code is messy" is not.
  2. **Pick the smallest refactor type that fixes it** — prefer composition refactors over structural, structural over pattern, pattern over DSA. Smaller refactors are safer because the blast radius is smaller and the verification is easier.
  3. **Name it in the spec** — "Refactor type: Extract Function" or "Refactor type: Strategy via dispatch table." This tells Claude what shape the result should take and removes interpretive room.
  4. **If multiple types apply, split into multiple specs** — one type per spec, one spec per session. Sequencing matters: usually composition refactors first (they often reveal that the larger refactor isn't needed), structural next, patterns last.

> **The cardinal rule:** refactor specs that name a single technique succeed. Refactor specs that say "clean this up" fail — Claude has no constraint on what "clean" means and will reach for whatever pattern it knows. Name the technique.
