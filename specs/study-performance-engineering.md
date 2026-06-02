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
study-system-design       explains architecture-scale tradeoffs.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: what is measurably slow or expensive, why, and which change improves it without moving the bottleneck?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts — audit-style two-pass output

**This is an audit-style generator.** It produces output in the two-pass shape defined in `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — one `audit.md` walking the lens inventory below
  → Pass 2 — discovered-pattern files, one per significant performance pattern the repo actually exercises

The pattern-discovery rules, file-layout rules, and worked examples live in `me.md`. Do not restate them here. This spec defines only the **lens inventory specific to performance engineering**.

### The lens inventory (for `audit.md`)

Walk the codebase against this ordered 8-lens inventory. Each lens becomes one `##` section in `audit.md`. For each lens: name what the codebase actually does (with `file:line` grounding) or emit `not yet exercised`. When a finding is significant enough to have a dedicated pattern file in Pass 2, cross-link to it.

1. **performance-budget** — the user-visible and system-visible performance budget.
2. **measurement-baselines-and-profiling** — representative workloads, baselines, profilers, instrumentation, and before/after evidence.
3. **latency-throughput-and-tail-behavior** — latency distributions, throughput, p95/p99 behavior, queues, and contention.
4. **cpu-memory-and-allocation** — CPU cost, memory pressure, allocation, retention, and garbage-collection behavior where relevant.
5. **io-network-and-database-bottlenecks** — filesystem, network, API, database, and external-service bottlenecks.
6. **caching-batching-and-backpressure** — cache tradeoffs, batching, debouncing, throttling, bounded work, and overload control.
7. **rendering-client-and-mobile-performance** — rendering, bundles, startup, main-thread work, and client constraints where relevant.
8. **performance-red-flags-audit** — ranked performance risks with baselines or explicitly named missing measurements.

### What earns a Pass 2 pattern file in this topic

The general rules in `me.md` apply: the pattern has a name, passes the load-bearing test, passes the recognition test. For performance specifically, the load-bearing test asks: *"if I stripped this pattern out, what measurable performance capability would the system lose?"* Real answers name a concrete number — a budget defended (p99 < 200ms under N rps), an overload mode held (queue depth bounded under fan-in), a cost ceiling kept (cache hit rate that keeps egress under quota). Vague answers ("things would be slower") do not earn a file.

## Output

The two-pass file layout is defined in `me.md` → AUDIT-STYLE GENERATORS → File layout. For this topic the output folder is `.aipe/study-performance-engineering/`. All files flat at the root, no nested sub-directories.

Files produced:

- `README.md` — reading order plus cross-links to neighbors (`study-runtime-systems`, `study-system-design`).
- `00-overview.md` — the repo-grounded map, ranked findings, reading order, and explicit `not yet exercised` notes.
- `audit.md` — Pass 1, the 8-lens audit defined above. Eight `##` sections, one per lens. The final lens (`performance-red-flags-audit`) ranks risks by consequence and names the evidence (baseline or explicitly missing measurement) for each verdict.
- `01-` through `0N-` — Pass 2, the discovered-pattern files. Each named after a pattern in kebab-case, each using the full `format.md` template.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path. Both `audit.md` and the pattern files anchor to real evidence.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` in the audit when a lens finds nothing. Do not invent pattern files for mechanisms the repo doesn't actually exercise.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: regenerate `audit.md` against current evidence, add pattern files when the codebase grows a new mechanism, update existing pattern files when implementations change, and remove pattern files only when the mechanism is genuinely gone.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-performance-engineering`.
