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

## Topic concepts — audit-style two-pass output

**This is an audit-style generator.** It produces output in the two-pass shape defined in `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — one `audit.md` walking the lens inventory below
  → Pass 2 — discovered-pattern files, one per significant observability or debugging pattern the repo actually exercises

The pattern-discovery rules, file-layout rules, and worked examples live in `me.md`. Do not restate them here. This spec defines only the **lens inventory specific to debugging & observability**.

### The lens inventory (for `audit.md`)

Walk the codebase against this ordered 8-lens inventory. Each lens becomes one `##` section in `audit.md`. For each lens: name what the codebase actually does (with `file:line` grounding) or emit `not yet exercised`. When a finding is significant enough to have a dedicated pattern file in Pass 2, cross-link to it.

1. **observability-map** — the evidence map: what can be observed at each important boundary.
2. **reproduction-and-evidence** — minimal reproduction, hypotheses, controlled experiments, and evidence collection.
3. **structured-logs-and-correlation** — events, levels, context, correlation IDs, redaction, and searchable fields.
4. **metrics-slis-slos-and-alerts** — signals, service-level indicators, objectives, alerts, and actionable thresholds.
5. **traces-and-request-lifecycles** — request lifecycles, spans, causal chains, and latency attribution.
6. **state-snapshots-and-debugging-boundaries** — state inspection, network traces, error output, and before/after snapshots.
7. **incident-analysis-and-prevention** — root cause, contributing conditions, remediation, regression guards, and runbooks.
8. **debugging-observability-red-flags-audit** — ranked blind spots and diagnostic risks grounded in the repo.

### What earns a Pass 2 pattern file in this topic

The general rules in `me.md` apply: the pattern has a name, passes the load-bearing test, passes the recognition test. For debugging & observability specifically, the load-bearing test asks: *"if I stripped this mechanism out, what specifically would the system fail to explain about its own behavior?"* Real answers name a concrete diagnostic capability lost (cross-service request correlation, queue-depth alerting that paged on the last incident, structured per-tenant log redaction). Vague answers ("logging would be worse") do not earn a file.

## Output

The two-pass file layout is defined in `me.md` → AUDIT-STYLE GENERATORS → File layout. For this topic the output folder is `.aipe/study-debugging-observability/`. All files flat at the root, no nested sub-directories.

Files produced:

- `README.md` — reading order plus cross-links to neighbors (`study-testing`, `study-performance-engineering`).
- `00-overview.md` — the repo-grounded map, ranked findings, reading order, and explicit `not yet exercised` notes.
- `audit.md` — Pass 1, the 8-lens audit defined above. Eight `##` sections, one per lens. The final lens (`debugging-observability-red-flags-audit`) ranks risks by consequence and names the evidence for each verdict.
- `01-` through `0N-` — Pass 2, the discovered-pattern files. Each named after a pattern in kebab-case, each using the full `format.md` template.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path. Both `audit.md` and the pattern files anchor to real evidence.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` in the audit when a lens finds nothing. Do not invent pattern files for mechanisms the repo doesn't actually exercise.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: regenerate `audit.md` against current evidence, add pattern files when the codebase grows a new mechanism, update existing pattern files when implementations change, and remove pattern files only when the mechanism is genuinely gone.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-debugging-observability`.
