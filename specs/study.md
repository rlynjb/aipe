# Study Orchestrator — the `/aipe:study` command

One command that creates or updates **all seventeen** per-repo study guides. Run it after a meaningful codebase change when every comprehension artifact should catch up without invoking each `/aipe:study-*` command by hand.

This orchestrator defines no topic content. It reads `format.md`, `teacher.md`, `me.md`, the current repo, and the seventeen generator specs; performs a detection-only pass; prints one consolidated plan; waits for one confirmation; then creates or updates each guide and prints one summary.

## The complete study map

```
foundations   runtime-systems · networking · database-systems · dsa-foundations
      ↓
core          system-design · software-design · frontend-engineering · data-modeling
      ↓
adjacent      nonfunctional-requirements · security · testing · distributed-systems
              debugging-observability · performance-engineering
      ↓
intelligence  ai-engineering · prompt-engineering · agent-architecture
```

## Generators

   1. `study-runtime-systems` — runtime / OS / concurrency foundations
   2. `study-networking` — networking and protocol foundations
   3. `study-database-systems` — database-engine foundations
   4. `study-dsa-foundations` — reusable DSA curriculum grounded in repo examples
   5. `study-system-design` — architecture, boundaries, flows, and scale
   6. `study-software-design` — module, interface, and complexity quality
   7. `study-frontend-engineering` — rendering, state, components, data-fetch, routing, styling, platform APIs, build
   8. `study-data-modeling` — schema, query-shape, integrity, and migrations
   9. `study-nonfunctional-requirements` — cross-cutting NFR audit (reliability, scalability, maintainability, latency, availability, security, observability, cost) framed per DDIA 2e Ch 2; cross-links to deep-walk siblings
  10. `study-security` — trust boundaries and security
  11. `study-testing` — deterministic correctness and test design
  12. `study-distributed-systems` — coordination under partial failure
  13. `study-debugging-observability` — evidence, logs, metrics, traces, and incidents
  14. `study-performance-engineering` — measurement, profiling, latency, throughput, and cost
  15. `study-ai-engineering` — LLM foundations, RAG, agents, evals, serving, and ML
  16. `study-prompt-engineering` — prompt-engineering discipline
  17. `study-agent-architecture` — reasoning patterns and multi-agent orchestration

```
/aipe:study
  reads format.md + teacher.md + me.md + repo + generator specs
  fans out:
    study-runtime-systems.md  →  .aipe/study-runtime-systems/
    study-networking.md  →  .aipe/study-networking/
    study-database-systems.md  →  .aipe/study-database-systems/
    study-dsa-foundations.md  →  .aipe/study-dsa-foundations/
    study-system-design.md  →  .aipe/study-system-design/
    study-software-design.md  →  .aipe/study-software-design/
    study-frontend-engineering.md  →  .aipe/study-frontend-engineering/
    study-data-modeling.md  →  .aipe/study-data-modeling/
    study-nonfunctional-requirements.md  →  .aipe/study-nonfunctional-requirements/
    study-security.md  →  .aipe/study-security/
    study-testing.md  →  .aipe/study-testing/
    study-distributed-systems.md  →  .aipe/study-distributed-systems/
    study-debugging-observability.md  →  .aipe/study-debugging-observability/
    study-performance-engineering.md  →  .aipe/study-performance-engineering/
    study-ai-engineering.md  →  .aipe/study-ai-engineering/
    study-prompt-engineering.md  →  .aipe/study-prompt-engineering/
    study-agent-architecture.md  →  .aipe/study-agent-architecture/
```

## Inputs and persona routing

`format.md` is the single structural foundation. Read it once and pass it to every generator. `teacher.md` supplies teacher posture and `me.md` supplies reader calibration. Sixteen generators use `teacher.md` in teacher posture. `study-prompt-engineering` uses its own inline working-AI-engineer persona and reads `teacher.md` only to honor that exclusion. `study-frontend-engineering` notes explicitly that this is the reader's home turf — the teacher can lean on existing knowledge without an on-ramp. `study-nonfunctional-requirements` runs after the core-tier specs and reads their outputs when present (cross-linking into their audits rather than re-walking their mechanics).

Read optional `.aipe/project/aieng-curriculum.md` or `.aipe/project/curriculum.md` when present and pass it to the AI-oriented generators. Never block a run because curriculum files are absent.

## Run order

The numbered list above is the run order: mechanisms before architecture, code-level design after architecture, adjacent operational disciplines after the core, and intelligence last. Generators are independent and must not rewrite another generator's folder. Cross-link neighboring guides at partition seams.

## Detection pass and single confirmation gate

For each fixed `.aipe/<generator>/` folder:

```
folder contains 00-overview.md or numbered content  → UPDATE
otherwise                                           → CREATE
```

Before editing any generated artifact, print one consolidated table with generator, mode, and planned changes. Wait for one confirmation for the whole run. In non-interactive execution, print the plan and continue.

During detection, also check for the legacy `.aipe/study-system-design-dsa/` folder. If present, include a migration note in the consolidated plan: architecture now belongs in `.aipe/study-system-design/`, DSA learning belongs in `.aipe/study-dsa-foundations/`, and the old folder must not be silently deleted or overwritten.

## Execution contract

- **CREATE:** generate the complete artifact declared by that generator spec.
- **UPDATE:** reconcile surgically against the codebase: add newly relevant material, update changed evidence, retain still-correct teaching, and remove stale claims.
- **Honesty:** emit `not yet exercised` rather than inventing infrastructure, behavior, scale, or evidence.
- **Grounding:** cite real files and label inferences plainly.
- **Isolation:** write only inside the generator's own fixed folder.

## Final report

Print one row per generator with mode, files created/updated/removed, ranked findings, and `not yet exercised` topics. Then print cross-links that should be read next.

## Standalone execution

Every generator remains directly runnable via `/aipe:<generator>`. Use a standalone command when only one concern changed. `read-aposd` remains a separate book-style foundations guide because it teaches a framework rather than auditing a repo.
