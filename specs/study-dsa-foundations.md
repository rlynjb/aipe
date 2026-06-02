# Study — DSA Foundations (applied)
## the `/aipe:study-dsa-foundations` command

A study-family generator that audits the **current repo** through the reusable data-structures-and-algorithms vocabulary behind the repo, including important foundations the repo does not currently exercise. Findings are grounded in real files, configuration, runtime behavior, and dependency choices.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns topic scope, partition seams, concept inventory, and anchoring rules.

```
  /aipe:study-dsa-foundations      → create or update
  output: .aipe/study-dsa-foundations/
```

## Where this sits — partition

```
study-system-design   owns architectural shape and scale tradeoffs.
study-dsa-foundations owns reusable algorithms and data structures, including repo examples and honest curriculum gaps.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: which reusable structures and algorithms explain the repo, and which foundational gaps should the reader deliberately practice?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts

Every concept file uses the full `format.md` template. Generate these files in order:

  1. `complexity-and-cost-models`
     time, space, amortized analysis, input size, and choosing the right cost model.

  2. `arrays-strings-and-hash-maps`
     indexed sequences, strings, sets, maps, collision tradeoffs, and repo examples.

  3. `stacks-queues-deques-and-heaps`
     ordering disciplines, priority queues, and repo examples.

  4. `trees-tries-and-balanced-indexes`
     hierarchies, ordered structures, prefixes, balanced trees, and repo examples.

  5. `graphs-and-traversals`
     graph models, BFS, DFS, shortest paths, dependencies, and repo examples.

  6. `sorting-searching-and-selection`
     ordering, lookup, binary search, partitioning, and selection.

  7. `recursion-backtracking-and-dynamic-programming`
     state spaces, repeated subproblems, memoization, tabulation, and repo examples.

  8. `dsa-foundations-practice-map`
     a ranked learning plan: exercised concepts first, missing foundations second.

## Output

```
  .aipe/study-dsa-foundations/
    00-overview.md
    01-complexity-and-cost-models.md
    02-arrays-strings-and-hash-maps.md
    03-stacks-queues-deques-and-heaps.md
    04-trees-tries-and-balanced-indexes.md
    05-graphs-and-traversals.md
    06-sorting-searching-and-selection.md
    07-recursion-backtracking-and-dynamic-programming.md
    08-dsa-foundations-practice-map.md
```

`00-overview.md` contains the repo-grounded map, the ranked findings, the reading order, and explicit `not yet exercised` notes. The final audit file ranks risks by consequence and names the evidence for each verdict.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` when the repo does not contain the mechanism.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, reconcile against the codebase surgically: add newly exercised concepts, update changed evidence, retain still-correct teaching, and remove stale claims.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-dsa-foundations`.
