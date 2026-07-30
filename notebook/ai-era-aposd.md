Yes. Your earlier prompt asks **how the application is constructed**. A prompt based on *A Philosophy of Software Design* asks **how effectively the design contains complexity**.

Ousterhout describes complexity through three symptoms: **change amplification**, **cognitive load**, and **unknown unknowns**. He attributes much of that complexity to dependencies and obscurity, then recommends information hiding, deep modules, simple interfaces, and comparing multiple designs. ([Stanford University][1])

## Comprehensive Ousterhout-style design review

Review this application or feature using the principles from John Ousterhout’s *A Philosophy of Software Design*.

Do not merely summarize the code or identify design patterns. Evaluate how effectively the design manages complexity.

For every conclusion:

* Reference the relevant file, module, class, function, type, or interface.
* Separate facts visible in the code from your interpretation.
* Explain why the issue matters during future development.
* Give a concrete improvement when appropriate.

## 1. Purpose and essential complexity

* What problem does this feature solve?
* What complexity is inherent in the problem and cannot reasonably be removed?
* What complexity appears to have been introduced by the implementation?
* What is the simplest mental model a developer should have for this feature?

## 2. Change amplification

* What files or modules must change for a typical feature modification?
* Are the same decisions represented in multiple places?
* Which apparently small changes would require edits across many files?
* Are business rules, schemas, types, validation, and UI behavior duplicated?
* What knowledge could be consolidated so one change happens in one place?

Give one example change and trace every location that would need modification.

## 3. Cognitive load

* How much information must a developer hold in their mind to modify this feature safely?
* Which modules must be understood together?
* Are there ordering requirements, hidden setup steps, global state, or lifecycle assumptions?
* Does the developer need to understand implementation details that should have been hidden?
* Which concepts could be absorbed into a deeper abstraction?

Identify the five facts a developer currently needs to remember and explain which ones the design could eliminate.

## 4. Unknown unknowns

* What important dependencies or side effects are difficult to discover?
* Are there behaviors not evident from names, types, interfaces, or nearby documentation?
* Can a developer make a locally reasonable change that silently breaks another part of the system?
* Which assumptions are enforced only by convention?
* Where would a new developer be most likely to make an incorrect first guess?

Identify at least three hidden facts that should be made obvious, enforced, or encapsulated.

## 5. Module depth

For each important module, class, service, or hook:

* What useful functionality does it provide?
* How complicated is its public interface?
* How much implementation knowledge does it hide?
* Is it a deep module with substantial functionality behind a simple interface?
* Is it a shallow module that adds another interface without hiding meaningful complexity?
* Could several shallow modules be combined into one deeper module?

Classify each major module as:

* Deep
* Acceptable
* Shallow
* Pass-through

Explain the classification.

## 6. Information hiding and leakage

* What design decisions or specialized knowledge does each module own?
* Is that knowledge contained in one place?
* Which implementation details leak through public interfaces?
* Are callers required to understand storage formats, ordering rules, caching behavior, retries, parsing details, or infrastructure decisions?
* Is the same knowledge duplicated across several modules?
* Could related knowledge be brought together?

For each instance of information leakage, explain:

1. What information is leaking.
2. Which modules know it.
3. Why that creates dependency.
4. Where the knowledge should ideally live.

## 7. Interface design

* What are the most important public interfaces?
* Do they expose a simple abstraction or a sequence of low-level steps?
* Can the common operation be completed through one obvious call?
* Are callers forced to supply configuration values the module could determine itself?
* Are there boolean flags, loosely related parameters, or methods that must be called in a particular order?
* Are common use cases simple while uncommon options remain available without distracting users?
* Does the interface expose implementation details?

For each major interface, propose a smaller or more coherent alternative where useful.

## 8. “Do the whole job” principle

* Is one conceptual task divided across several modules or layers?
* Does one module begin an operation and force callers to complete it elsewhere?
* Are callers responsible for cleanup, validation, retries, serialization, caching, or error translation that the module could handle?
* Does the current decomposition follow execution order rather than ownership of knowledge?
* Where could one module take responsibility for the complete operation?

Identify any feature where the caller currently coordinates too many steps.

## 9. General-purpose versus special-purpose design

* Which modules contain application-specific behavior?
* Which modules are reusable mechanisms?
* Are general-purpose and special-purpose concerns mixed together?
* Has a module been generalized beyond actual requirements?
* Is a supposedly reusable abstraction tightly shaped around one current use case?
* What is the simplest reasonably general interface that satisfies current needs?

Do not recommend speculative abstractions unless they simplify the present design.

## 10. Pass-through layers

* Which methods simply forward calls to another module?
* Which layers expose nearly the same interface as the layer below?
* Does each layer provide a genuinely different abstraction?
* Are there wrappers, repositories, services, managers, controllers, or hooks that add terminology but little functionality?
* Could any layer be removed or given greater responsibility?

Trace one important call stack and mark which layers add real value.

## 11. Dependencies and coupling

* Which modules change together frequently?
* Which modules know too much about one another?
* Are dependencies based on stable abstractions or volatile implementation details?
* Are circular dependencies present?
* Does a module depend on more services than its purpose requires?
* Could dependency direction be improved?
* Which dependency creates the greatest future maintenance risk?

Produce a concise dependency diagram and identify the strongest coupling.

## 12. Error handling and exception complexity

* Are errors handled where enough context exists to resolve them?
* Are low-level errors repeatedly propagated through many layers?
* Are exceptions used to avoid handling predictable conditions?
* Do callers need to understand many infrastructure-specific failure types?
* Can common failures be handled inside the module?
* Are errors translated into domain-relevant results at an appropriate boundary?

Show the complete path of one failure through the system and suggest how it could be simplified.

## 13. Configuration complexity

* Which configuration values must developers or users provide?
* Which values could be selected automatically?
* Are there unexplained thresholds, timeouts, limits, or constants?
* Is configuration scattered across the application?
* Do configuration options expose uncertainty in the module’s implementation?
* Can safe defaults eliminate decisions from the caller?

Identify every “voodoo constant” whose correct value is not obvious.

## 14. Comments and documentation

* Do comments explain information that cannot be derived from the code?
* Are important interface contracts, side effects, invariants, units, and assumptions documented?
* Do comments explain why the design exists rather than narrating individual statements?
* Are implementation comments compensating for confusing code?
* Are names and interfaces obvious enough that routine comments are unnecessary?
* Is important documentation located where developers will find it?

Identify missing documentation that contributes directly to unknown unknowns.

## 15. Consistency and obviousness

* Does similar code follow similar conventions?
* Are naming, error handling, state management, data access, and API shapes consistent?
* Does the most obvious implementation approach usually produce correct behavior?
* Are there special cases that violate the developer’s likely expectations?
* Are related concepts named consistently throughout the system?
* Which inconsistencies increase cognitive load?

List the places where a developer’s first reasonable assumption would be wrong.

## 16. Tactical versus strategic programming

* Which parts appear optimized for the fastest immediate implementation?
* Where has complexity been deferred to future developers?
* Are there patches, duplicated conditions, special cases, or temporary abstractions that became permanent?
* Which small redesign would reduce repeated future work?
* Where would a modest investment now substantially simplify later changes?

Distinguish between necessary product shortcuts and avoidable design debt.

## 17. Design it twice

Choose the most problematic part of the current design and propose at least two substantially different designs.

For each option, compare:

* Public interface complexity
* Information hidden
* Number and strength of dependencies
* Change amplification
* Cognitive load
* Discoverability
* Testability
* Migration cost
* Future flexibility

Do not automatically select the design with more patterns, classes, or layers. Recommend the design that provides the clearest and deepest abstraction for current needs.

## 18. Design red flags

Search specifically for:

* Shallow modules
* Information leakage
* Pass-through methods
* Temporal decomposition
* Repeated code or repeated knowledge
* Excessive configuration
* Special-case logic
* Very deep call stacks
* Methods that require callers to understand internal state
* Multiple modules performing part of the same conceptual task
* Comments that repeat the code
* Vague names
* Non-obvious behavior
* Small pieces of unnecessary complexity

For each red flag, rate it:

* Minor
* Significant
* Structural

## Final output

Finish with:

1. **Design summary**
   Explain the current design’s central abstraction in five sentences or fewer.

2. **Complexity scorecard**
   Rate change amplification, cognitive load, unknown unknowns, information hiding, module depth, and interface simplicity from 1–5.

3. **Best-designed area**
   Identify one module that hides complexity particularly well.

4. **Highest-risk area**
   Identify the design issue most likely to slow future development.

5. **Top five improvements**
   Rank improvements by expected complexity reduction, not by ease of implementation.

6. **Design-it-twice comparison**
   Compare the current design with two alternatives.

7. **Reading path**
   List the files and symbols I should inspect in order to understand the design.

8. **Understanding test**
   Ask me five questions that require me to explain the abstractions, hidden information, dependencies, and trade-offs without looking at the code.

## Faster feature-orientation prompt

This is the version to use when entering an unfamiliar feature and you do not need the full audit.

Orient me to this feature using the principles from *A Philosophy of Software Design*.

Explain:

1. What is the simplest mental model for this feature?
2. What are its main modules and public interfaces?
3. What knowledge or design decisions does each module hide?
4. Which modules are deep, and which are shallow?
5. Where does information leak between modules?
6. What must a developer understand before changing this feature?
7. What small change would require edits in several places?
8. What important behavior or dependency is difficult to discover?
9. Which methods or layers merely pass work through?
10. Is one conceptual task unnecessarily divided across multiple modules?
11. Which configuration, sequencing, cleanup, or error-handling responsibilities could be absorbed by a module?
12. What is the strongest coupling in the feature?
13. Which part is optimized tactically rather than designed strategically?
14. What two alternative designs should I compare?
15. What is the single highest-value simplification?

Reference the relevant files and symbols for every answer. Separate facts visible in the code from design inferences.

Finish with:

* an ASCII module diagram,
* the three most important interfaces,
* the three largest sources of complexity,
* the five files I should read first,
* and three questions that test whether I understand the design.

## Questions to ask while implementing a feature

You can also use this compact checklist during AI-assisted development:

Before implementing this feature, answer:

* What complexity is inherent in the problem?
* What information should be hidden inside one module?
* What should callers need to know—and what should they not need to know?
* What is the simplest interface that can perform the complete common task?
* Can the module determine any configuration automatically?
* Am I creating a deep module or adding another shallow layer?
* Does this abstraction provide different value from the layer beneath it?
* Am I organizing code around ownership of knowledge or merely execution order?
* What dependencies will this design create?
* What future change would reveal information leakage?
* What are two meaningfully different designs?
* Which design minimizes change amplification, cognitive load, and unknown unknowns?

After implementation, review:

* Did implementation details escape through the interface?
* Does the caller coordinate steps the module should perform?
* Are any modules only forwarding arguments?
* Did AI introduce extra classes or abstractions without hiding complexity?
* Can a developer use the feature correctly without reading its implementation?
* Is important behavior obvious from names, types, interfaces, and documentation?
* What complexity did this change add, and what complexity did it remove?

The distinction is:

```text
Architecture orientation:
“What components exist, and how do they communicate?”

Ousterhout design orientation:
“What must a developer understand, what complexity is exposed,
and where should that complexity be hidden?”
```

Deep modules are especially important here: the goal is not necessarily fewer lines or smaller classes, but **substantial capability behind a comparatively simple interface**. Ousterhout also warns that pass-through layers and excessive class decomposition can add interfaces and dependencies without creating a useful new abstraction. ([Stanford University][2])

[1]: https://web.stanford.edu/~ouster/cgi-bin/cs190-winter18/lecture.php?topic=complexity&utm_source=chatgpt.com "The Nature of Complexity"
[2]: https://web.stanford.edu/~ouster/cgi-bin/cs190-winter18/lecture.php?topic=modularDesign&utm_source=chatgpt.com "Modular Design"
