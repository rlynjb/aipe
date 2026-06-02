# Study — Runtime Systems (applied)
## the `/aipe:study-runtime-systems` command

A study-family generator that audits the **current repo** through the execution model inside the repo: processes, threads, tasks, event loops, memory, I/O, synchronization, bounded work, and cancellation. Findings are grounded in real files, configuration, runtime behavior, and dependency choices.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns topic scope, partition seams, concept inventory, and anchoring rules.

```
  /aipe:study-runtime-systems      → create or update
  output: .aipe/study-runtime-systems/
```

## Where this sits — partition

```
study-runtime-systems  HOW code executes inside one machine or language runtime.
study-system-design WHERE components live and how requests cross boundaries.
study-testing           HOW runtime behavior is verified deterministically.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: where does work execute, what resources does it own, and what breaks under concurrency or overload?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts

Every concept file uses the full `format.md` template. Generate these files in order:

  1. `runtime-map`
     the runtime, process, task, and resource map as-built.

  2. `processes-threads-and-tasks`
     process boundaries, threads, workers, tasks, schedulers, and where work runs.

  3. `event-loop-and-async-io`
     event loops, queues, microtasks, asynchronous I/O, and blocking hazards.

  4. `shared-state-races-and-synchronization`
     shared mutable state, race conditions, locks, atomics, channels, and ownership.

  5. `memory-stack-heap-gc-and-lifetimes`
     allocation, stack and heap behavior, garbage collection or lifetimes, and memory pressure.

  6. `filesystem-streams-and-resource-lifecycle`
     files, streams, descriptors, handles, cleanup, and resource ownership.

  7. `backpressure-bounded-work-and-cancellation`
     bounded concurrency, queues, overload, cancellation, deadlines, and graceful shutdown.

  8. `runtime-systems-red-flags-audit`
     ranked execution-model risks grounded in the repo.

## Output

```
  .aipe/study-runtime-systems/
    00-overview.md
    01-runtime-map.md
    02-processes-threads-and-tasks.md
    03-event-loop-and-async-io.md
    04-shared-state-races-and-synchronization.md
    05-memory-stack-heap-gc-and-lifetimes.md
    06-filesystem-streams-and-resource-lifecycle.md
    07-backpressure-bounded-work-and-cancellation.md
    08-runtime-systems-red-flags-audit.md
```

`00-overview.md` contains the repo-grounded map, the ranked findings, the reading order, and explicit `not yet exercised` notes. The final audit file ranks risks by consequence and names the evidence for each verdict.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` when the repo does not contain the mechanism.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, reconcile against the codebase surgically: add newly exercised concepts, update changed evidence, retain still-correct teaching, and remove stale claims.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-runtime-systems`.
