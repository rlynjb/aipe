[← Contents](README.md)

# 6. Reusable review gates

These are summaries of the main playbook, not separate checklists to maintain.

## 6.1 Fast orientation

```text
1. What user outcome does this produce?
2. What are the domain concepts and invariants?
3. What are the major components and boundaries?
4. Who owns canonical state?
5. What is one complete execution flow?
6. What are the important interfaces and dependencies?
7. What data and algorithms matter?
8. Where can it fail?
9. What is the strongest coupling?
10. Which files and symbols should I inspect first?
```

---

## 6.2 Before implementation

```text
1. Is the requirement separate from the proposed implementation?
2. What complexity is essential?
3. What knowledge should one module hide?
4. What should callers not need to know?
5. What is the simplest interface that performs the whole common task?
6. What dependencies will this introduce?
7. What future change could expose information leakage?
8. What are two meaningfully different designs?
9. Which design best reduces the three symptoms of complexity?
10. What is the smallest testable vertical slice?
```

---

## 6.3 After implementation

```text
1. Can the feature be used correctly without reading its implementation?
2. Did implementation details leak?
3. Does the caller coordinate work a module should own?
4. Are there shallow or pass-through layers?
5. Is knowledge duplicated?
6. Are important behaviors obvious from names, types, and documentation?
7. What small future change would require multiple edits?
8. What complexity was removed and added?
9. What decision and trade-off should be recorded?
10. Which requirement and test prove completion?
```

---

[← 5. Coordinate delivery](05-coordinate-delivery.md) · [Contents](README.md) · [7. Unified AI prompt →](07-unified-ai-prompt.md)
