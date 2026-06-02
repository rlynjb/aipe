# Study — Database Systems (applied)
## the `/aipe:study-database-systems` command

A study-family generator that audits the **current repo** through the storage-engine and consistency mechanisms beneath the repo: storage layout, indexes, query execution, transactions, isolation, concurrency control, durability, recovery, and replication. Findings are grounded in real files, configuration, runtime behavior, and dependency choices.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns topic scope, partition seams, concept inventory, and anchoring rules.

```
  /aipe:study-database-systems      → create or update
  output: .aipe/study-database-systems/
```

## Where this sits — partition

```
study-data-modeling    the SHAPE of persistent data and whether it matches access patterns.
study-database-systems the MECHANISMS used to execute and preserve reads and writes.
study-system-design-dsa WHICH datastore is selected and how it scales.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: how does the datastore execute and preserve reads and writes, and which engine guarantees does the application assume?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts

Every concept file uses the full `format.md` template. Generate these files in order:

  1. `database-systems-map`
     the datastore map, engine choices, query paths, and durability boundaries.

  2. `records-pages-and-storage-layout`
     records, pages, locality, storage layout, and the cost model of persistence.

  3. `btree-hash-and-secondary-indexes`
     index structures, lookup behavior, write costs, and index selection.

  4. `query-planning-and-execution`
     query plans, scans, joins, sort operations, N+1 behavior, and explain output where available.

  5. `transactions-isolation-and-anomalies`
     atomicity, isolation levels, anomalies, and application assumptions.

  6. `locks-mvcc-and-concurrency-control`
     locks, MVCC, optimistic and pessimistic concurrency, conflicts, and retries.

  7. `wal-durability-and-recovery`
     write-ahead logs, durability boundaries, backups, restore paths, and recovery.

  8. `replication-and-read-consistency`
     replicas, lag, failover, stale reads, and consistency expectations.

  9. `database-systems-red-flags-audit`
     ranked storage-engine and consistency risks grounded in the repo.

## Output

```
  .aipe/study-database-systems/
    00-overview.md
    01-database-systems-map.md
    02-records-pages-and-storage-layout.md
    03-btree-hash-and-secondary-indexes.md
    04-query-planning-and-execution.md
    05-transactions-isolation-and-anomalies.md
    06-locks-mvcc-and-concurrency-control.md
    07-wal-durability-and-recovery.md
    08-replication-and-read-consistency.md
    09-database-systems-red-flags-audit.md
```

`00-overview.md` contains the repo-grounded map, the ranked findings, the reading order, and explicit `not yet exercised` notes. The final audit file ranks risks by consequence and names the evidence for each verdict.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` when the repo does not contain the mechanism.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, reconcile against the codebase surgically: add newly exercised concepts, update changed evidence, retain still-correct teaching, and remove stale claims.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-database-systems`.
