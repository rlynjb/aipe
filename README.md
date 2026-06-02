# AIPE — study & rehearse specs

A spec system for generating per-repo learning and performance artifacts. Point a command at a codebase and it produces structured guides in a consistent voice: **study** guides to understand the code and **rehearse** books to justify, communicate, present, and defend it. Every artifact is grounded in the real repo and refreshed in place as code changes.

```text
study      → comprehension   (understand the codebase, for you)
rehearse   → performance     (align / present / defend, for a room)
```

## The foundation — three files everything reads

```text
format.md    STRUCTURE — concept-file template, house style, diagrams, hard rules
teacher.md   VOICE     — staff-engineer teacher posture or coach posture
me.md        READER    — calibration: prior knowledge, examples, depth
```

Precedence when they conflict: the consuming spec wins on **structure**, `teacher.md` on **voice**, and `me.md` on **calibration**.

## `/aipe:study` — the comprehension orchestrator

One command creates or updates **all fifteen** study guides for the current repo. Run it after a meaningful codebase change.

```text
FOUNDATIONS
  1  study-runtime-systems             OS/runtime · concurrency · memory · I/O
  2  study-networking                  DNS · TCP/UDP · TLS · HTTP · realtime · retries
  3  study-database-systems            engines · indexes · query plans · MVCC · WAL
  4  study-dsa-foundations             reusable structures · algorithms · practice gaps

CORE SOFTWARE ENGINEERING
  5  study-system-design               architecture · boundaries · flows · scale
  6  study-software-design             modules · interfaces · complexity (Ousterhout)
  7  study-data-modeling               schema · normalization · queries · migrations

ADJACENT DISCIPLINES
  8  study-security                    trust boundaries · authn/authz · injection · secrets
  9  study-testing                     deterministic correctness · coverage · test design
 10  study-distributed-systems         partial failure · consistency · queues · coordination
 11  study-debugging-observability     evidence · logs · metrics · traces · incidents
 12  study-performance-engineering     profiling · latency · throughput · memory · cost

INTELLIGENCE
 13  study-ai-engineering              LLM foundations · RAG · agents · evals · serving · ML
 14  study-prompt-engineering          prompt-engineering concepts (inline persona*)
 15  study-agent-architecture          reasoning patterns · multi-agent orchestration
```

`study-prompt-engineering` uses its own inline working-AI-engineer persona. The other fourteen study generators use `teacher.md` in teacher posture.

Every study generator is also directly runnable as `/aipe:<generator>` when only one concern changed.

The former `.aipe/study-system-design-dsa/` output is a legacy archive. New runs split it into `.aipe/study-system-design/` for architecture and `.aipe/study-dsa-foundations/` for algorithms and data structures; migration is explicit and never silently deletes the old folder.

## Audit-style vs curriculum-style output

Six study generators are **audit-style** — they describe what THIS repo actually does:

```text
  study-system-design           study-security
  study-software-design         study-testing
  study-debugging-observability study-performance-engineering
```

Their output is **two-pass**:

```text
  audit.md                       Pass 1 — fixed lens inventory; same shape every repo;
                                          one ## section per lens; `not yet exercised`
                                          emitted honestly when a lens finds nothing
  01-<discovered-pattern>.md     Pass 2 — variable; 3-8 files named after the patterns
  02-<discovered-pattern>.md              the repo actually exercises (e.g. `oauth-boundary`,
  ...                                     `streaming-ndjson`, `local-first-sync`)
```

Different repos produce different Pass 2 file lists. The directory listing itself becomes a learning artifact: a reader scanning the folder sees what's interesting about the repo before opening anything.

When a previous run left the older fixed-file-list layout (one file per lens), the generator flags it on UPDATE and asks whether to fold those files into a regenerated `audit.md` or keep them as an archive — never silently rewritten.

The other nine generators are **curriculum-style** — they teach concepts that apply broadly, so their output is a fixed set of concept files. (Foundations, intelligence, plus `study-data-modeling` and `study-distributed-systems`.)

## `/aipe:rehearse` — the human-layer orchestrator

One command creates or updates **all four** rehearsal books. All four use `teacher.md` in coach posture.

```text
  1  rehearse-problem-selection    why this problem deserves investment
  2  rehearse-design-doc           written RFCs for significant technical decisions
  3  rehearse-hackathon-demo       demo run-of-show
  4  rehearse-interview-defense    spoken project defense
```

Together they cover the complete human layer:

```text
problem selection → written alignment → demonstration → defense under scrutiny
```

## Standalone framework guide

`/aipe:read-aposd` remains standalone. It generates a book-style guide to the primitives in *A Philosophy of Software Design*. Unlike `study-software-design`, it teaches the framework itself rather than auditing a codebase.

## `/aipe:code-review` — per-branch PR review

Reviews the **current branch's diff against base** and emits a single report. Not a study guide, not a long-lived per-repo artifact — every run is fresh.

```
/aipe:code-review           → review current branch vs main
/aipe:code-review develop   → review current branch vs develop
```

Inherits the lens inventory (Intent → Shape → Architecture → Correctness → Craft) from `prompts/pr-review-protocol-v2.md` and owns the framing: a required **Branch context** block up front, `file:line` anchoring inside the diff, verdict-first ranked findings, severity discipline on Pass 4, and a single-report output that mirrors to `.aipe/reviews/<branch>-<date>.md` when that directory exists.

## How the specs partition — one owner per concern

```text
intelligence   ai-engineering · prompt-engineering · agent-architecture
     ▲
adjacent       security · testing · distributed-systems
               debugging-observability · performance-engineering
     ▲
core           system-design · software-design · data-modeling
     ▲
foundations    runtime-systems · networking · database-systems · dsa-foundations

human layer    problem-selection · design-doc · hackathon-demo · interview-defense

per-branch     code-review
```

Key seams:

- **runtime-systems vs system-design** — execution inside a runtime here; architecture boundaries there.
- **networking vs security vs system-design** — protocol mechanics here; trust there; boundary placement there.
- **database-systems vs data-modeling vs system-design** — engine mechanisms here; schema shape here; datastore selection and scaling there.
- **dsa-foundations vs system-design** — reusable algorithms and data structures here; architectural boundaries and scale tradeoffs there.
- **testing vs ai-engineering evals** — deterministic expected results here; probabilistic quality and regression thresholds there.
- **debugging-observability vs performance-engineering** — explain failures with evidence here; measure and optimize bottlenecks there.
- **problem-selection vs design-doc** — justify investment here; communicate the selected technical design there.
- **code-review vs study-\* / audit-\*** — per-branch diff evaluation here; per-codebase findings there. A codebase-wide observation that surfaces during review cross-links to the relevant study/audit guide rather than being restated.

## How a run works

```text
1. detect    each fixed .aipe/<generator>/ folder → CREATE or UPDATE
2. plan      one consolidated change list across the orchestrator
3. confirm   one gate for the whole run (continue after plan in non-interactive use)
4. execute   run each generator in dependency-aware order
5. report    one summary table plus per-guide detail
```

- **Per-repo.** Every reference, path, and citation is about the invoked repo only.
- **Surgical updates.** UPDATE reconciles claims against the codebase and retains still-correct teaching.
- **Honest output.** A generator emits `not yet exercised` rather than inventing infrastructure, scale, or behavior.
- **Sharp seams.** A finding belongs to exactly one generator; adjacent generators cross-link rather than duplicate it.

## Output layout

```text
.aipe/
  study-runtime-systems/           study-security/
  study-networking/                study-testing/
  study-database-systems/          study-distributed-systems/
  study-dsa-foundations/           study-debugging-observability/
  study-system-design/         study-performance-engineering/
  study-software-design/           study-ai-engineering/
  study-data-modeling/             study-prompt-engineering/
                                  study-agent-architecture/

  rehearse-problem-selection/
  rehearse-design-doc/
  rehearse-hackathon-demo/
  rehearse-interview-defense/

  read-aposd/                      (standalone framework guide)
  reviews/<branch>-<date>.md       (per-branch code-review output, optional)
```
