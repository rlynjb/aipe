# AIPE — study & rehearse specs

A Claude Code plugin that turns a codebase into per-repo learning, prep, and review artifacts. Grounded in real `file:line` evidence; refreshed in place as the code changes.

```text
study      → comprehension   (understand the codebase, for you)
rehearse   → performance     (align / present / defend, for a room)
ready      → readiness       (score on the AI-eng hiring ladder + drill the gap)
audit      → take stock      (status / cleanup / a11y / refactor opinions)
code-review → per-branch     (Intent → Shape → Architecture → Correctness → Craft)
behavioral-stories → per-person  (STAR story bank for FAANG behavioral loops)
```

## Install & update

AIPE ships as a Claude Code plugin via the `rlynjb-aipe` marketplace (sourced from this repo). All commands are run inside Claude Code, not in a shell.

```text
# first-time install
/plugin marketplace add rlynjb/aipe
/plugin install aipe@rlynjb-aipe

# update to the latest version
/plugin marketplace update rlynjb-aipe
/plugin install aipe@rlynjb-aipe
```

Publisher (this repo): pushing to `main` is enough — the marketplace catalog reads live from GitHub. Consumer version comes from `.claude-plugin/plugin.json`.

## Repo source layout

What's in this repo, top-level:

```text
.claude-plugin/   Claude plugin manifest + marketplace.json
commands/         36 Claude slash commands (one .md per command)
specs/            source-of-truth specs that commands load
                  (format.md, teacher.md, me.md, study-*.md,
                   rehearse-*.md, audit-*.md, code-review.md,
                   recon.md, drill.md, ready.md, etc.)
notebook/         personal study / prep / drafts / prompts —
                  not shipped with the plugin (see Notebook below)
README.md         this file
```

Plus `.gitignore`, `.git/`, `.claude/settings.local.json` (local permissions), and an empty `.worktrees/` scaffold. Nothing else.

## The foundation — three files everything reads

```text
format.md    STRUCTURE — concept-file template, house style, diagrams, hard rules
teacher.md   VOICE     — staff-engineer teacher posture or coach posture
me.md        READER    — calibration: prior knowledge, examples, depth
```

Precedence when they conflict: the consuming spec wins on **structure**, `teacher.md` on **voice**, and `me.md` on **calibration**.

## `/aipe:study` — the comprehension orchestrator

One command creates or updates **all sixteen** study guides for the current repo. Run it after a meaningful codebase change.

```text
FOUNDATIONS
  1  study-runtime-systems             OS/runtime · concurrency · memory · I/O
  2  study-networking                  DNS · TCP/UDP · TLS · HTTP · realtime · retries
  3  study-database-systems            engines · indexes · query plans · MVCC · WAL
  4  study-dsa-foundations             reusable structures · algorithms · practice gaps

CORE SOFTWARE ENGINEERING
  5  study-system-design               architecture · boundaries · flows · scale
  6  study-software-design             modules · interfaces · complexity (Ousterhout)
  7  study-frontend-engineering        rendering · state · components · data-fetch · routing · styling · platform · build
  8  study-data-modeling               schema · normalization · queries · migrations

ADJACENT DISCIPLINES
  9  study-security                    trust boundaries · authn/authz · injection · secrets
 10  study-testing                     deterministic correctness · coverage · test design
 11  study-distributed-systems         partial failure · consistency · queues · coordination
 12  study-debugging-observability     evidence · logs · metrics · traces · incidents
 13  study-performance-engineering     profiling · latency · throughput · memory · cost

INTELLIGENCE
 14  study-ai-engineering              LLM foundations · RAG · agents · evals · serving · ML
 15  study-prompt-engineering          prompt-engineering concepts (inline persona*)
 16  study-agent-architecture          reasoning patterns · multi-agent orchestration
```

All but `study-prompt-engineering` use `teacher.md` in teacher posture (it uses its own inline working-AI-engineer persona). Every generator is also directly runnable as `/aipe:<generator>` for when only one concern changed.

## Audit-style vs curriculum-style output

Seven study generators are **audit-style** — they describe what THIS repo actually does:

```text
  study-system-design           study-security
  study-software-design         study-testing
  study-frontend-engineering    study-debugging-observability
                                study-performance-engineering
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

Different repos produce different Pass 2 file lists — the directory listing itself is a learning artifact. `study-frontend-engineering` emits `no frontend surface` honestly for non-frontend repos.

The other nine generators are **curriculum-style** — they teach concepts that apply broadly, so their output is a fixed set of concept files (foundations, intelligence, plus `study-data-modeling` and `study-distributed-systems`).

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

## `/aipe:rehearse-behavioral-stories` — per-person STAR story bank

Standalone companion to `/aipe:rehearse`. **Per-person, not per-repo** — the bank covers the reader's entire career as 8-12 quantified STAR stories tagged by competency for FAANG-style behavioral loops (Anthropic, Meta, Google).

Ten senior+ competencies:

```text
  1  scope-expansion              6  technical-judgment
  2  ambiguity-navigation         7  prioritization-and-saying-no
  3  peer-conflict-resolution     8  failure-recovery   (non-negotiable)
  4  stakeholder-pushback         9  impact-at-scale
  5  influence-without-authority 10  mission-alignment  (Anthropic-weighted)
```

Two modes:

```text
  BANK      career-history.md present  → real stories from your material
  SCAFFOLD  career-history.md absent   → archetype-shaped templates
                                         (hackathon / personal / work)
                                         the reader fills in
```

Reads career-history at `.aipe/project/career-history.md` or `~/.config/aipe/global/career-history.md`. SCAFFOLD templates open with a `STATUS: scaffold template` banner and contain prompts where real entries hold numbers — **never invented**. Re-running graduates filled-in templates into real entries. The `failure-recovery` story is the senior-bar non-negotiable; absent, it's flagged as the highest-leverage prep target. Cross-links to per-repo `rehearse-interview-defense` books when applicable.

## `/aipe:ready` — the readiness orchestrator

One command runs the **readiness loop** on the current repo: place it on the AI-engineering hiring ladder, then turn the load-bearing gap into a hands-on failure-rep.

```text
  1  recon    score the repo on the L0–L3 ladder; produce a dated audit with
              the LENS scorecard + the TRACK queue.
              output: .aipe/audits/recon-<date>.md
  2  drill    take the NEXT move from recon's queue; generate the six-step
              induced-failure writeup the user fills out in their editor.
              output: .aipe/drills/<competency>-<slug>.md
```

Pipeline, not fan-out — recon's queue feeds drill's input. `/aipe:ready --n 3` runs the top 3 gaps. Both generators use `teacher.md` in **coach posture** — hiring-bar stance, no credit for scaffolding, no tutorial substitutes for the rep.

The L0–L3 ladder:

```text
L0  SCAFFOLDED   tutorial / AI-generated; author can't say why
L1  BUILT        author assembled it; understands the shape
L2  DEBUGGED     real failure hit, diagnosed, fix shipped
L3  DEFENSIBLE   failure + alternatives + eval evidence + tradeoff
                 (= format.md's Validate level 4)
```

No eval and no handled failure caps the ceiling at L1, regardless of code volume. A drill closes the gap from L1 to L2 or L3; the war story is the deliverable.

Each generator also runs standalone: `/aipe:recon` to reassess; `/aipe:drill` to rep a specific gap directly.

## `/aipe:audit` — the take-stock orchestrator

Runs **all four** audit-family generators sequentially under one gate. `/aipe:audit` answers: what's there, what's wrong, what's inaccessible, what a staff engineer would say.

```text
  1  audit-status         WHAT IS — 8-section descriptive snapshot
                          output: .aipe/audits/snapshot-<date>.md
  2  audit-cleanup        WHAT'S WRONG — four-lens debt triage with
                          fix-now / fix-later / accept / cannot-clean
                          output: .aipe/audits/cleanup-<date>.md
  3  audit-frontend-a11y  WHAT'S INACCESSIBLE — frontend a11y read
                          ("no frontend surface" honestly if N/A)
                          output: .aipe/audits/a11y-<date>.md
  4  audit-refactor       WHAT A STAFF ENGINEER WOULD SAY — six-chapter
                          opinion notebook (book, not single file)
                          output: .aipe/audit-refactor-<purpose>/
```

The four artifacts stay independent on disk — the orchestrator summarizes, doesn't merge. The final report ranks top concerns across all four. Each generator also runs standalone: `/aipe:audit-status`, `/aipe:audit-cleanup`, `/aipe:audit-frontend-a11y`, `/aipe:audit-refactor`.

## Standalone framework guide

`/aipe:read-aposd` remains standalone. It generates a book-style guide to the primitives in *A Philosophy of Software Design*. Unlike `study-software-design`, it teaches the framework itself rather than auditing a codebase.

## `/aipe:code-review` — per-branch PR review

Reviews the current branch's diff against base; emits a single report. Every run is fresh.

```
/aipe:code-review           → review current branch vs main
/aipe:code-review develop   → review current branch vs develop
```

Five lenses walked in order (Intent → Shape → Architecture → Correctness → Craft), each with checklist + blocking conditions. Required **Branch context** block up front, `file:line` anchoring inside the diff, verdict-first ranked findings, severity tags on Pass 4. Mirrors to `.aipe/reviews/<branch>-<date>.md` when that directory exists.

## How the specs partition — one owner per concern

```text
intelligence   ai-engineering · prompt-engineering · agent-architecture
     ▲
adjacent       security · testing · distributed-systems
               debugging-observability · performance-engineering
     ▲
core           system-design · software-design · frontend-engineering · data-modeling
     ▲
foundations    runtime-systems · networking · database-systems · dsa-foundations

human layer    problem-selection · design-doc · hackathon-demo · interview-defense

per-person     behavioral-stories   (FAANG-style STAR story bank)

readiness      recon · drill   (orchestrated by /aipe:ready)

take stock     audit-status · audit-cleanup · audit-frontend-a11y · audit-refactor
               (orchestrated by /aipe:audit)

per-branch     code-review
```

Key seams:

- **runtime-systems vs system-design** — execution inside a runtime vs architecture boundaries.
- **networking vs security vs system-design** — protocol mechanics vs trust vs boundary placement.
- **database-systems vs data-modeling vs system-design** — engine mechanisms vs schema shape vs datastore choice + scaling.
- **testing vs ai-engineering evals** — deterministic expected results vs probabilistic quality + regression thresholds.
- **code-review vs study-\* / audit-\*** — per-branch diff evaluation vs per-codebase findings; review cross-links rather than restates.
- **ready vs study / rehearse** — study builds comprehension, rehearse prepares performance, ready measures hireability and routes gaps into the other two.
- **audit-status vs audit-cleanup vs audit-refactor** — three stances on the same code: describe-only / triage / opinion book. Orchestrator runs all three; standalones run individually.
- **drill vs study-ai-engineering Project exercises** — both produce buildable exercises; drill adds the induced failure + eval + war story that earns the L3 rung.

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

## Notebook (not part of the plugin)

`notebook/` holds reference docs, personal study notes, drafts, and working prompts — not shipped with the marketplace package.

```text
notebook/guides/          study + interview-prep write-ups, schedules
notebook/books/           book-club notes + interview-masterclass material
notebook/pending_specs/   WIP spec drafts not yet promoted to specs/
notebook/prompts/         working prompts not (yet) generator specs
```

Read top-to-bottom; don't generate anything.

## Output layout

```text
.aipe/
  study-runtime-systems/           study-security/
  study-networking/                study-testing/
  study-database-systems/          study-distributed-systems/
  study-dsa-foundations/           study-debugging-observability/
  study-system-design/             study-performance-engineering/
  study-software-design/           study-ai-engineering/
  study-frontend-engineering/      study-prompt-engineering/
  study-data-modeling/             study-agent-architecture/

  rehearse-problem-selection/
  rehearse-design-doc/
  rehearse-hackathon-demo/
  rehearse-interview-defense/

  read-aposd/                      (standalone framework guide)

  audits/snapshot-<date>.md        (audit-status: 8-section descriptive snapshot)
  audits/cleanup-<date>.md         (audit-cleanup: triaged debt list with verdicts)
  audits/a11y-<date>.md            (audit-frontend-a11y: a11y read; frontend repos)
  audit-refactor-<purpose>/        (audit-refactor: six-chapter notebook)

  audits/recon-<date>.md           (dated readiness audits; trail of progression)
  drills/<competency>-<slug>.md    (war-story portfolio; accumulates per drill)
  reviews/<branch>-<date>.md       (per-branch code-review output, optional)
  rehearse-behavioral-stories/     (per-person STAR story bank; reused across loops)
```
