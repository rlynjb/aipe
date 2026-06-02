# Study — Debugging & Observability (applied)
## the `/aipe:study-debugging-observability` command

A study-family generator that audits the **current repo** through how the repo reveals behavior in development and production: reproduction, evidence, structured logs, metrics, traces, state snapshots, incidents, and prevention. Findings are grounded in real files, configuration, runtime behavior, and dependency choices.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns topic scope, partition seams, concept inventory, and anchoring rules.

```
  /aipe:study-debugging-observability      → create or update
  output: .aipe/study-debugging-observability/
```

## Where this sits — partition

```
study-testing                 catches known failure conditions before release.
study-debugging-observability explains unknown behavior with evidence.
study-performance-engineering measures bottlenecks; this generator explains failures.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: when behavior is wrong, what evidence exists to explain it quickly and prevent recurrence?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts

Every concept file uses the full `format.md` template. Generate these files in order:

  1. `observability-map`
     the evidence map: what can be observed at each important boundary.

  2. `reproduction-and-evidence`
     minimal reproduction, hypotheses, controlled experiments, and evidence collection.

  3. `structured-logs-and-correlation`
     events, levels, context, correlation IDs, redaction, and searchable fields.

  4. `metrics-slis-slos-and-alerts`
     signals, service-level indicators, objectives, alerts, and actionable thresholds.

  5. `traces-and-request-lifecycles`
     request lifecycles, spans, causal chains, and latency attribution.

  6. `state-snapshots-and-debugging-boundaries`
     state inspection, network traces, error output, and before/after snapshots.

  7. `incident-analysis-and-prevention`
     root cause, contributing conditions, remediation, regression guards, and runbooks.

  8. `debugging-observability-red-flags-audit`
     ranked blind spots and diagnostic risks grounded in the repo.

## Output

```
  .aipe/study-debugging-observability/
    00-overview.md
    01-observability-map.md
    02-reproduction-and-evidence.md
    03-structured-logs-and-correlation.md
    04-metrics-slis-slos-and-alerts.md
    05-traces-and-request-lifecycles.md
    06-state-snapshots-and-debugging-boundaries.md
    07-incident-analysis-and-prevention.md
    08-debugging-observability-red-flags-audit.md
```

`00-overview.md` contains the repo-grounded map, the ranked findings, the reading order, and explicit `not yet exercised` notes. The final audit file ranks risks by consequence and names the evidence for each verdict.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` when the repo does not contain the mechanism.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, reconcile against the codebase surgically: add newly exercised concepts, update changed evidence, retain still-correct teaching, and remove stale claims.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-debugging-observability`.
