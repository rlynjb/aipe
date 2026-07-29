# Study — Non-Functional Requirements (applied)
## the `/aipe:study-nonfunctional-requirements` command

A study-family generator that audits the **current repo** through the cross-cutting **non-functional requirements** that define whether the system is trustworthy: reliability, scalability, maintainability, latency budgets, availability posture, security/privacy/compliance boundaries, observability, and cost constraints. Plus the **functional requirements** anchor — what features the codebase actually implements. Per-topic findings grounded in real files, config, and infra — where each requirement is met, where it isn't, the specific evidence.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns the requirements lens inventory, partition seams with the deep-walk sibling specs, output layout, and anchoring rules.

```
  /aipe:study-nonfunctional-requirements   → create or update
  output: .aipe/study-nonfunctional-requirements/
```

## Where this sits — partition

This spec is the cross-cutting NFR audit at the codebase level. Most NFR flavors have a sibling spec that owns the deep walk of that flavor's mechanics; this spec owns the framing, the vocabulary, and the one-page "here are the NFRs this codebase meets" audit.

```
  DEEP-WALK SPECS (this spec cross-links out to them):

  study-security                trust boundaries, auth, PII, dependencies      →  security NFR
  study-performance-engineering measurement, latency, throughput, cost         →  performance / cost NFR
  study-debugging-observability logs, metrics, traces, incidents               →  observability NFR
  study-testing                 test design, coverage, flakiness, evals         →  reliability testing
  study-software-design         module quality, complexity, layering           →  maintainability (code-level)
  study-distributed-systems     coordination under partial failure             →  availability under partition
  study-system-design           architecture, scale ceilings, failure paths    →  reliability / scalability architecture

  THIS SPEC OWNS:
                                the cross-cutting NFR audit (one file, all
                                NFRs) + the DDIA Ch 2 vocabulary applied
                                to this repo + the functional-requirements
                                anchor (what the codebase actually does)
```

A finding belongs here when it is a **cross-cutting NFR posture** the codebase either meets or doesn't. Deep mechanics belong in the owning sibling. This spec's audit says "reliability is <verdict> because of <evidence at file:line>; the deep walk is in `study-system-design/audit.md` Lens 6"; the sibling spec's audit walks the actual retry / fallback / degradation code.

## Through-line

```
  the question: which NFRs does this codebase actually meet, and how do we know?
```

Non-functional requirements are the constraints the system operates under — reliability, scalability, maintainability, security, latency, availability, cost, observability. In interview vocabulary they precede the architecture; in an audit they are the framing the architecture is measured against. This spec turns the NFR framing into a per-codebase audit, grounded in real code and config, one page. Cross-links to deep-walk siblings when the reader wants the mechanics.

## Topic concepts — audit-style two-pass output

**This is an audit-style generator.** It produces output in the two-pass shape defined in `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — one `audit.md` walking the lens inventory below
  → Pass 2 — discovered-pattern files, one per significant NFR pattern the repo actually exercises (e.g., a distinctive graceful-degradation strategy, a load-shedding pattern, an SLO-driven autoscaling policy)

The pattern-discovery rules, file-layout rules, and worked examples live in `me.md`. Do not restate them here. This spec defines only the **lens inventory specific to NFRs**.

### The lens inventory (for `audit.md`)

Walk the codebase against this ordered 8-lens inventory. Each lens becomes one `##` section in `audit.md`. For each lens: name what the codebase actually does (with `file:line` grounding) or emit `not yet exercised`. When a finding warrants deep mechanics, cross-link to the owning sibling spec rather than restating.

1. **functional-requirements** — the user-facing capabilities implemented in real routes, handlers, background jobs, or CLI commands. Every feature grounded in code — never aspirational. When the README (or a design doc) claims something the code doesn't back up, note the drift. Skip when the codebase is a library with no user-facing surface — say so plainly.
2. **reliability** — fault tolerance visible in code: retries (with backoff / jitter / caps), timeouts (per-call, per-request, deadline propagation), fallbacks (graceful degradation paths, cached-response returns, safe-defaults), and error-handling posture (do errors propagate, get swallowed, get logged, get retried?). Framed per DDIA 2e Ch 2 (hardware / software / human faults). Cross-link the architectural failure-handling to `study-system-design` Lens 6; testable fault handling to `study-testing`.
3. **scalability** — load parameters the system copes with today and where they head (per DDIA 2e Ch 2). Read requests-per-second, concurrent-connections, data-volume-per-day, jobs-per-hour, or whichever the codebase's load-shape actually is. What's the ceiling? What breaks first? Cross-link architectural bottlenecks to `study-system-design` Lens 7; measurement to `study-performance-engineering`.
4. **maintainability** — the three DDIA 2e sub-attributes: **operability** (deployability, health checks, runbooks, on-call surface — how easy for ops to keep it running), **simplicity** (code-level complexity — cross-link to `study-software-design`), **evolvability** (schema migrations, API versioning, backwards-compatibility posture — cross-link to `study-data-modeling` for schema evolution and DDIA Ch 5 for encoding evolution).
5. **latency-and-performance-budgets** — hard budgets in code and config (`maxDuration`, per-call timeouts, request-response deadlines, batch-window sizes) plus SLOs / SLIs when present. Named budgets grounded in real config values. Cross-link measurement + optimization to `study-performance-engineering`.
6. **availability-security-privacy** — the composite operational posture: **availability** (uptime targets, single points of failure, redundancy, degradation modes — cross-link to `study-distributed-systems` for coordination-under-partition); **security** (auth surface, authorization boundaries, encryption in transit + at rest — cross-link to `study-security`); **privacy / compliance** (PII handling, GDPR / HIPAA / SOC2 relevance, data retention — cross-link to `study-security`).
7. **observability-and-cost** — the two "you can't manage what you can't measure" attributes: **observability** (logs, metrics, traces available for verification — cross-link to `study-debugging-observability`); **cost** (rate limits, budget guards, cost-per-request instrumentation, cost-per-user posture — cross-link to `study-performance-engineering`).
8. **nonfunctional-requirements-red-flags-audit** — ranked NFR gaps, each grounded in real evidence. Unmet requirements that the codebase claims to meet, unspecified requirements the codebase quietly assumes, and requirements the codebase meets by accident (unstated but true — a landmine when someone changes the code without knowing).

### What earns a Pass 2 pattern file in this topic

The general rules in `me.md` apply: the pattern has a name, passes the load-bearing test, passes the recognition test. For NFRs specifically, the load-bearing test asks: *"if I stripped this pattern out, which NFR would the system stop meeting, and by how much?"* Real answers name a specific NFR loss — "loses 99.9% availability during Provider X outages," "loses evaluable observability of the RAG pipeline," "loses cost bound on adversarial prompts." Vague answers ("harder to operate") do not earn a file.

Typical NFR pattern names (kebab-case, illustrative — the actual names come from the repo): `graceful-degradation-cache-then-error`, `single-flight-collapse`, `circuit-breaker-with-half-open-probe`, `token-budget-enforced-per-request`, `structured-logging-with-request-id`, `slo-driven-autoscaling`, `deterministic-replay-for-diagnosis`, `pii-redaction-at-the-edge`.

## Output

The two-pass file layout is defined in `me.md` → AUDIT-STYLE GENERATORS → File layout. For NFRs specifically, the output folder is `.aipe/study-nonfunctional-requirements/`. All files flat at the root, no nested sub-directories.

Files produced:

- `README.md` — reading order plus cross-links to every deep-walk sibling (`study-system-design`, `study-security`, `study-performance-engineering`, `study-debugging-observability`, `study-testing`, `study-software-design`, `study-distributed-systems`, `study-data-modeling`)
- `00-overview.md` — one-page orientation: the NFR verdict table (one row per lens with pass / meets-partially / not-yet-exercised / gap-with-evidence), the three highest-cost NFR gaps, and the single next action worth taking
- `audit.md` — Pass 1, the 8-lens audit defined above. Eight `##` sections, one per lens.
- `01-` through `0N-` — Pass 2, the discovered-pattern files. Each named after the NFR pattern in kebab-case, each using the full `format.md` template.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value (env var, YAML field, feature flag), schema object, infra manifest, or executable path. Both `audit.md` and the pattern files anchor to real evidence.
- Distinguish observed behavior from inference. Label inferred production or scale behavior plainly ("the timeout is 30s in config, but I did not observe a real timeout event").
- Do not manufacture NFRs to fill the inventory. Use `not yet exercised` in the audit when a lens finds nothing (a static site has no cost NFR; a single-user CLI has no availability NFR). Do not invent pattern files for patterns the repo doesn't actually exercise.
- **Keep the partition seam sharp.** Deep mechanics belong to the owning sibling. This spec's audit says the NFR verdict + cites evidence + cross-links out. When a lens's findings are all in the sibling spec's audit, this spec's section is a one-paragraph "reliability: pass — the retry-and-fallback machinery is walked in `study-system-design/audit.md#failure-handling-and-reliability`; NFR posture is X."
- **Every NFR verdict is falsifiable.** "Reliability: meets" without evidence is banned. "Reliability: meets — three retry-with-jitter sites at `handler.ts:42`, `worker.ts:118`, `sync.ts:201`; graceful degradation to cached response at `edge.ts:88` when Provider X is down" is required.
- On UPDATE, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: add new pattern files when the codebase grows new NFR patterns, update existing pattern files when implementations change, remove pattern files only when patterns are genuinely gone, regenerate `audit.md` against current evidence.

## Deep reading — DDIA 2nd edition (the primary anchor)

*Designing Data-Intensive Applications, 2e* (Feb 2026) is this spec's canonical reference. **Chapter 2 (Nonfunctional Requirements)** is the framing this whole audit uses — reliability / scalability / maintainability plus the surrounding attributes. Read Ch 2 once before running this generator for the first time; the vocabulary transfers directly to the lens inventory.

Also relevant when the specific NFR lens fires:

```
  DDIA 2e chapter                              which lens it sharpens
  ─────────────────────────────────────────────────────────────────────────────
  Ch 1 — Trade-Offs in Data Systems Arch      the whole through-line; NFRs are
                                              the axis every trade-off is scored on
  Ch 2 — Nonfunctional Requirements           the entire lens inventory —
                                              THE PRIMARY ANCHOR
  Ch 5 — Encoding and Evolution               Lens 4 (maintainability → evolvability)
  Ch 8 — Transactions                         Lens 2 (reliability under concurrent
                                              writes); also relevant to Lens 6
  Ch 9 — Distributed-System Problems          Lens 2 (reliability under partial
                                              failure); Lens 6 (availability under
                                              network partition)
```

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it inside the "adjacent operational disciplines" tier, right after the core-tier specs, under the shared confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-nonfunctional-requirements`.
