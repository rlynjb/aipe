[← Contents](README.md)

# 3. Review the design using *A Philosophy of Software Design*

The central question is:

> **How effectively does this design contain complexity?**

Evaluate the three symptoms:

1. **Change amplification:** A small change requires many edits.
2. **Cognitive load:** A developer must understand too much at once.
3. **Unknown unknowns:** Important facts or dependencies are difficult to discover.

The common causes are excessive dependencies and obscurity.

---

## 3.1 Essential versus accidental complexity

- [ ] What complexity is inherent in the problem?
- [ ] What complexity was introduced by the implementation?
- [ ] What is the simplest useful mental model?
- [ ] Which concepts exist only because of a framework or chosen decomposition?
- [ ] What could be removed without weakening the required behavior?

**Example:** Cycle detection is essential for a DAG. Requiring callers to manually maintain traversal state is accidental interface complexity.

---

## 3.2 Change amplification

- [ ] What files must change for a typical modification?
- [ ] Is the same rule repeated in schemas, UI checks, services, and tests?
- [ ] Which small change spreads across unrelated modules?
- [ ] Which knowledge could be consolidated?

Choose one realistic change and trace every affected location. A long or surprising list may expose duplicated knowledge or information leakage.

---

## 3.3 Cognitive load

- [ ] What must a developer remember to use or modify the feature correctly?
- [ ] Which modules must be read together?
- [ ] Are there hidden ordering, setup, cleanup, or lifecycle requirements?
- [ ] Must callers understand implementation details?
- [ ] Which facts could be absorbed by a deeper abstraction?

List the five facts a developer currently needs to remember and identify which ones the design could eliminate.

---

## 3.4 Unknown unknowns

- [ ] Which dependencies or side effects are difficult to discover?
- [ ] Which behaviors are not evident from names, types, interfaces, or nearby documentation?
- [ ] Can a locally reasonable change silently break another area?
- [ ] Which assumptions are enforced only by convention?
- [ ] Where would a new developer make the wrong first guess?
- [ ] What hidden fact should become explicit, enforced, or encapsulated?

---

## 3.5 Module depth

A **deep module** provides substantial capability behind a comparatively simple interface. A **shallow module** adds an interface without hiding meaningful complexity.

For each important module:

- [ ] What useful capability does it provide?
- [ ] How complicated is its public interface?
- [ ] What knowledge does it hide?
- [ ] Does it reduce what callers must understand?
- [ ] Is it deep, acceptable, shallow, or pass-through?
- [ ] Could several shallow modules become one deeper module?

```text
Deep: substantial capability behind a small interface.
Acceptable: clear responsibility and reasonable interface.
Shallow: interface complexity is close to implementation complexity.
Pass-through: mostly forwards calls or mirrors another layer.
```

---

## 3.6 Information hiding and leakage

- [ ] What specialized knowledge does each module own?
- [ ] Is that knowledge contained in one place?
- [ ] Which implementation details leak through public interfaces?
- [ ] Do callers know storage formats, cache keys, retry rules, parsing details, or lifecycle sequencing?
- [ ] Is the same decision repeated across modules?
- [ ] Can related knowledge be brought together?

For each leak:

```text
Information leaking:
Modules that know it:
Dependency created:
Where the knowledge should live:
```

---

## 3.7 Interface design and “do the whole job”

- [ ] Can the common task be completed through one obvious call?
- [ ] Does the interface expose a domain operation or a low-level procedure?
- [ ] Are callers providing values the module could determine?
- [ ] Are there boolean flags or methods that must be called in order?
- [ ] Are safe defaults available?
- [ ] Is the caller coordinating validation, persistence, caching, cleanup, retries, or error conversion?
- [ ] Can a module with the relevant knowledge own the whole operation?
- [ ] Can the interface be used correctly without reading the implementation?

Less contained:

```text
beginGraphUpdate()
validateEdge()
persistEdge()
invalidateGraphCache()
publishGraphEvent()
endGraphUpdate()
```

More contained:

```text
addPrerequisite(sourceSkillId, targetSkillId)
```

---

## 3.8 Pass-through layers and coupling

- [ ] Which methods merely forward arguments?
- [ ] Which layers expose nearly the same interface as the layer below?
- [ ] Does each layer provide a distinct abstraction or policy?
- [ ] Which modules frequently change together?
- [ ] Which modules know too much about one another?
- [ ] Are dependencies based on stable abstractions or volatile details?
- [ ] Are there circular dependencies?
- [ ] Which dependency creates the greatest maintenance risk?
- [ ] Could a layer be removed or given meaningful responsibility?

Trace one call stack and label what each layer adds:

```text
Abstraction
Policy
Validation
Translation
Only forwarding
```

---

## 3.9 General-purpose versus special-purpose design

- [ ] Which code is reusable mechanism?
- [ ] Which code is application-specific policy?
- [ ] Are these concerns mixed?
- [ ] Has an abstraction been generalized beyond current needs?
- [ ] Is a supposedly generic abstraction shaped around one special case?
- [ ] What is the simplest reasonably general interface that satisfies current requirements?

Do not create speculative abstractions unless they simplify the present system.

---

## 3.10 Errors, configuration, consistency, and documentation

- [ ] Are errors handled where enough context exists to resolve or translate them?
- [ ] Do callers need to understand infrastructure-specific failures?
- [ ] Which configuration could be automatic or have safe defaults?
- [ ] Are there unexplained thresholds, timeouts, or constants?
- [ ] Do similar operations follow similar naming and API conventions?
- [ ] Does the obvious usage usually produce correct behavior?
- [ ] Are contracts, invariants, side effects, and assumptions documented?
- [ ] Do comments explain why rather than narrate code?
- [ ] Is important documentation located where developers will discover it?

List places where a developer’s first reasonable assumption would be wrong.

---

## 3.11 Strategic versus tactical programming

- [ ] Which code was optimized only for immediate delivery?
- [ ] Where was complexity deferred to future developers?
- [ ] Which patch, duplicated condition, or special case became permanent?
- [ ] Which modest redesign would reduce repeated future work?
- [ ] Which shortcuts are justified by current constraints?
- [ ] Which shortcuts are avoidable design debt?

Strategic programming means making modest investments that reduce future complexity, not adding speculative architecture.

---

## 3.12 Design it twice

Compare at least two meaningfully different designs before committing to a consequential choice.

| Dimension | Option A | Option B |
| --- | --- | --- |
| Public interface complexity | | |
| Information hidden | | |
| Dependencies | | |
| Change amplification | | |
| Cognitive load | | |
| Discoverability | | |
| Testability | | |
| Migration cost | | |
| Future flexibility | | |

Prefer the design that provides the clearest deep abstraction for current needs—not the one with the most patterns, classes, or layers.

---

[← 2. Orient](02-orient.md) · [Contents](README.md) · [4. Use AI →](04-use-ai.md)
