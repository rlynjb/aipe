[← Contents](README.md)

# 7. Unified AI prompt

```text
Orient me to this application or feature as an engineer, then review how effectively its design contains complexity using John Ousterhout’s A Philosophy of Software Design.

Do not merely summarize the repository or list design patterns.

For every conclusion:
- Reference the relevant file, module, class, function, type, interface, API, or database table.
- Separate facts visible in the code from interpretation.
- Explain why the issue matters for future development.
- Give a concrete improvement when appropriate.
- State uncertainty when evidence is incomplete.

Explain:

1. Purpose and scope
- What user problem does this solve?
- Who uses it?
- What outcome does it produce?
- What is in and out of scope?

2. Domain model
- What are the central concepts and relationships?
- What invariants must always remain true?

3. System design
- What are the major components and boundaries?
- What runs in the client, server, database, worker, or external service?
- Which component owns canonical state?
- How do components communicate?

4. Execution flow
- Identify the main entry points.
- Trace one important action end to end.
- Include validation, authorization, persistence, side effects, and failures.

5. Software design
- What are the major modules and public interfaces?
- What does each module own?
- What are the important dependencies and strongest coupling?

6. Data and technical foundations
- What data is stored, cached, derived, or transient?
- What data structures and algorithms are used?
- What are the dominant time and space costs?

7. Complexity review
- What complexity is essential and what was introduced by the implementation?
- Where is there change amplification?
- What creates cognitive load?
- What important facts are unknown unknowns?
- Which modules are deep, shallow, or pass-through?
- Where does information leak?
- Which callers coordinate work a module should absorb?
- Where are configuration, errors, or special cases unnecessarily exposed?
- Which code is tactical rather than strategic?

8. Reliability and scale
- Where can the feature fail?
- What edge cases, race conditions, or partial failures exist?
- Where are authentication, authorization, and input validation enforced?
- What assumptions break at 10× or 100× usage?

9. Design it twice
- Select the most consequential design area.
- Propose two meaningfully different alternatives.
- Compare interface complexity, information hiding, dependencies, change amplification, cognitive load, testability, migration cost, and flexibility.

Finish with:
- A concise mental model
- An ASCII system and dependency diagram
- The five most important files and symbols
- The three largest sources of complexity
- The best-designed module
- The highest-risk design area
- The top five improvements ranked by complexity reduction
- Five questions that test whether I understand the feature
```

---

[← 6. Review gates](06-review-gates.md) · [Contents](README.md) · [8. Completion standard →](08-completion-standard.md)
