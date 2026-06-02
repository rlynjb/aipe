# Study — Performance Engineering (applied)
## the `/aipe:study-performance-engineering` command

A study-family generator that audits the **current repo** through measurement and optimization of the repo: budgets, baselines, profiling, latency, throughput, memory, I/O, rendering, caching, batching, backpressure, and cost. Findings are grounded in real files, configuration, runtime behavior, and dependency choices.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns topic scope, partition seams, concept inventory, and anchoring rules.

```
  /aipe:study-performance-engineering      → create or update
  output: .aipe/study-performance-engineering/
```

## Where this sits — partition

```
study-performance-engineering MEASURES and improves observed bottlenecks.
study-runtime-systems         explains execution mechanisms.
study-system-design-dsa       explains architecture-scale tradeoffs.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: what is measurably slow or expensive, why, and which change improves it without moving the bottleneck?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts

Every concept file uses the full `format.md` template. Generate these files in order:

  1. `performance-budget`
     the user-visible and system-visible performance budget.

  2. `measurement-baselines-and-profiling`
     representative workloads, baselines, profilers, instrumentation, and before/after evidence.

  3. `latency-throughput-and-tail-behavior`
     latency distributions, throughput, p95/p99 behavior, queues, and contention.

  4. `cpu-memory-and-allocation`
     CPU cost, memory pressure, allocation, retention, and garbage-collection behavior where relevant.

  5. `io-network-and-database-bottlenecks`
     filesystem, network, API, database, and external-service bottlenecks.

  6. `caching-batching-and-backpressure`
     cache tradeoffs, batching, debouncing, throttling, bounded work, and overload control.

  7. `rendering-client-and-mobile-performance`
     rendering, bundles, startup, main-thread work, and client constraints where relevant.

  8. `performance-red-flags-audit`
     ranked performance risks with baselines or explicitly named missing measurements.

## Output

```
  .aipe/study-performance-engineering/
    00-overview.md
    01-performance-budget.md
    02-measurement-baselines-and-profiling.md
    03-latency-throughput-and-tail-behavior.md
    04-cpu-memory-and-allocation.md
    05-io-network-and-database-bottlenecks.md
    06-caching-batching-and-backpressure.md
    07-rendering-client-and-mobile-performance.md
    08-performance-red-flags-audit.md
```

`00-overview.md` contains the repo-grounded map, the ranked findings, the reading order, and explicit `not yet exercised` notes. The final audit file ranks risks by consequence and names the evidence for each verdict.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` when the repo does not contain the mechanism.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, reconcile against the codebase surgically: add newly exercised concepts, update changed evidence, retain still-correct teaching, and remove stale claims.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-performance-engineering`.
