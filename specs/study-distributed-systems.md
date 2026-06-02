# Study — Distributed Systems (applied)
## the `/aipe:study-distributed-systems` command

A study-family generator that audits the **current repo** through correctness when services, replicas, workers, queues, or external systems coordinate under partial failure and imperfect information. Findings are grounded in real files, configuration, runtime behavior, and dependency choices.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns topic scope, partition seams, concept inventory, and anchoring rules.

```
  /aipe:study-distributed-systems      → create or update
  output: .aipe/study-distributed-systems/
```

## Where this sits — partition

```
study-distributed-systems correctness ACROSS coordination boundaries.
study-system-design   architectural shape and scale tradeoffs.
study-database-systems    datastore-local consistency mechanisms.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: what remains correct when coordination crosses a boundary and any participant can be slow, duplicated, stale, or unavailable?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts

Every concept file uses the full `format.md` template. Generate these files in order:

  1. `distributed-system-map`
     the coordination map: nodes, boundaries, messages, ownership, and failure domains.

  2. `partial-failure-timeouts-and-retries`
     partial failure, deadlines, retries, jitter, and failure classification.

  3. `idempotency-deduplication-and-delivery-semantics`
     duplicate work, idempotency keys, at-most-once, at-least-once, and effective exactly-once behavior.

  4. `consistency-models-and-staleness`
     consistency expectations, stale reads, read-your-writes, and convergence.

  5. `replication-partitioning-and-quorums`
     replicas, shards, partition keys, quorum behavior, and failover.

  6. `queues-streams-ordering-and-backpressure`
     queues, streams, ordering, consumer behavior, poison messages, and overload.

  7. `clocks-coordination-and-leadership`
     time, ordering, leases, coordination, leadership, and split-brain risks.

  8. `sagas-outbox-and-cross-boundary-workflows`
     multi-step workflows, compensation, transactional outbox, and reconciliation.

  9. `distributed-systems-red-flags-audit`
     ranked coordination and partial-failure risks grounded in the repo.

## Output

```
  .aipe/study-distributed-systems/
    00-overview.md
    01-distributed-system-map.md
    02-partial-failure-timeouts-and-retries.md
    03-idempotency-deduplication-and-delivery-semantics.md
    04-consistency-models-and-staleness.md
    05-replication-partitioning-and-quorums.md
    06-queues-streams-ordering-and-backpressure.md
    07-clocks-coordination-and-leadership.md
    08-sagas-outbox-and-cross-boundary-workflows.md
    09-distributed-systems-red-flags-audit.md
```

`00-overview.md` contains the repo-grounded map, the ranked findings, the reading order, and explicit `not yet exercised` notes. The final audit file ranks risks by consequence and names the evidence for each verdict.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` when the repo does not contain the mechanism.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, reconcile against the codebase surgically: add newly exercised concepts, update changed evidence, retain still-correct teaching, and remove stale claims.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-distributed-systems`.
