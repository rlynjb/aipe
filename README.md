# AIPE — study & rehearse specs

A spec system for generating per-repo learning and performance artifacts. Point a command at a codebase and it produces structured guides in a consistent voice: **study** guides to understand the code and **rehearse** books to justify, communicate, present, and defend it. Every artifact is grounded in the real repo and refreshed in place as code changes.

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

`/plugin marketplace update` refreshes the catalog from GitHub (output: `✔ Updated 1 marketplace (1 plugin bumped)` when a new version is available, or `✔ Updated 1 marketplace` when already current). Re-running `/plugin install` upgrades the installed copy. Auto-update can be toggled per marketplace in `/plugin` → **Marketplaces**; pair it with `/reload-plugins` to pick up changes mid-session.

Publisher (this repo): pushing to `main` is enough — the marketplace catalog is read live from GitHub. The version that consumers see is set in `.claude-plugin/plugin.json`.

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

Plus `.gitignore`, `.git/`, `.claude/settings.local.json` (local permissions), and an empty `.worktrees/` scaffold. Nothing else at the root.

Claude-Code-only as of v1.65.0; Codex support and the public-facing website are both gone. The `notebook/` consolidation in v1.66.0+ collapsed `books/`, `guides/`, `pending_specs/`, and `prompts/` under a single parent so the root only carries plugin material + personal notebook + the README.

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

`study-prompt-engineering` uses its own inline working-AI-engineer persona. The other fourteen study generators use `teacher.md` in teacher posture.

Every study generator is also directly runnable as `/aipe:<generator>` when only one concern changed.

The former `.aipe/study-system-design-dsa/` output is a legacy archive. New runs split it into `.aipe/study-system-design/` for architecture and `.aipe/study-dsa-foundations/` for algorithms and data structures; migration is explicit and never silently deletes the old folder.

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

Different repos produce different Pass 2 file lists. The directory listing itself becomes a learning artifact: a reader scanning the folder sees what's interesting about the repo before opening anything.

When a previous run left the older fixed-file-list layout (one file per lens), the generator flags it on UPDATE and asks whether to fold those files into a regenerated `audit.md` or keep them as an archive — never silently rewritten.

The other nine generators are **curriculum-style** — they teach concepts that apply broadly, so their output is a fixed set of concept files. (Foundations, intelligence, plus `study-data-modeling` and `study-distributed-systems`.)

`study-frontend-engineering` is also audit-style and emits `no frontend surface` honestly when a non-frontend repo has no UI code, so the orchestrator's output stays clean across mixed-stack portfolios.

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

A standalone rehearsal companion to `/aipe:rehearse`. Diverges from its sibling rehearse-* commands in one important way: **it is per-person, not per-repo.** The bank covers the reader's entire career — 8-12 quantified STAR stories tagged by competency — for FAANG-style behavioral interview loops at Anthropic, Meta, Google, and similar.

Ten competencies probed at senior+ behavioral rounds:

```text
  1  scope-expansion              6  technical-judgment
  2  ambiguity-navigation         7  prioritization-and-saying-no
  3  peer-conflict-resolution     8  failure-recovery   (non-negotiable)
  4  stakeholder-pushback         9  impact-at-scale
  5  influence-without-authority 10  mission-alignment  (Anthropic-weighted)
```

Runs in one of two modes depending on what's available:

```text
  BANK mode      career-history.md is present  → generate REAL stories
                                                 from the reader's material
  SCAFFOLD mode  career-history.md is absent   → detect the current
                                                 project's archetype
                                                 (hackathon / personal /
                                                 work) and produce
                                                 archetype-shaped TEMPLATES
                                                 the reader fills in
```

BANK mode reads career-history at `.aipe/project/career-history.md` or `~/.config/aipe/global/career-history.md`. SCAFFOLD mode scaffolds the per-user career-history file anyway (so reflection has a home) and produces 5-7 template stories tagged by competency. Templates open with `**STATUS:** scaffold template — not interview-ready` and contain prompts in each STAR field — **numbers, names, quotes, and timestamps are never invented to fill a template**. Re-running after the reader replaces prompts with real material graduates templates into real bank entries.

Output: `README.md` + `00-overview.md` (competency × company coverage matrix, with gaps named honestly) + one story file per candidate. The `failure-recovery` story is a senior-bar non-negotiable; if absent from the raw material, the bank flags it as the highest-leverage prep target rather than inventing one.

Stories cross-link to per-repo `rehearse-interview-defense` books when applicable, so the project-defense layer and the person-level story bank compose. Runs standalone — not part of `/aipe:rehearse`'s fan-out, which stays per-repo.

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

Pipeline, not fan-out: recon's queue feeds drill's input. `/aipe:ready --n 3` runs the top 3 queue items. Where `/aipe:study` builds comprehension and `/aipe:rehearse` prepares performance, `/aipe:ready` **measures hireability** and closes the highest-leverage gap.

Both generators use `teacher.md` in **coach posture** — same staff engineer as the study/rehearse families, shifted to the hiring-bar stance. The recon voice does not give credit for scaffolding; the drill voice believes the only proof of understanding is breaking the system on purpose and explaining why.

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

One command runs **all four** audit-family generators on the current repo in sequence under one confirmation gate. Where `/aipe:study` builds comprehension and `/aipe:rehearse` prepares performance, `/aipe:audit` **takes stock** — what's there, what's wrong, what's inaccessible, and what a staff engineer would say about it.

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

The four artifacts stay independent at the file system level — the orchestrator does not merge them; it summarizes. The final report ranks top concerns across all four into a single list.

Each generator runs standalone: `/aipe:audit-status`, `/aipe:audit-cleanup`, `/aipe:audit-frontend-a11y`, `/aipe:audit-refactor`.

**Note (v1.61.0 rename):** the prior `/aipe:audit` command (the standalone 8-section snapshot) is now `/aipe:audit-status`. The `/aipe:audit` name belongs to the orchestrator.

## Standalone framework guide

`/aipe:read-aposd` remains standalone. It generates a book-style guide to the primitives in *A Philosophy of Software Design*. Unlike `study-software-design`, it teaches the framework itself rather than auditing a codebase.

## `/aipe:code-review` — per-branch PR review

Reviews the **current branch's diff against base** and emits a single report. Not a study guide, not a long-lived per-repo artifact — every run is fresh.

```
/aipe:code-review           → review current branch vs main
/aipe:code-review develop   → review current branch vs develop
```

Five lenses walked in order (Intent → Shape → Architecture → Correctness → Craft), each with its own checklist and blocking conditions. Self-contained: the spec carries the full lens inventory plus the framing rules — a required **Branch context** block up front, `file:line` anchoring inside the diff, verdict-first ranked findings, severity discipline on Pass 4, and a single-report output that mirrors to `.aipe/reviews/<branch>-<date>.md` when that directory exists.

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

- **runtime-systems vs system-design** — execution inside a runtime here; architecture boundaries there.
- **networking vs security vs system-design** — protocol mechanics here; trust there; boundary placement there.
- **database-systems vs data-modeling vs system-design** — engine mechanisms here; schema shape here; datastore selection and scaling there.
- **dsa-foundations vs system-design** — reusable algorithms and data structures here; architectural boundaries and scale tradeoffs there.
- **testing vs ai-engineering evals** — deterministic expected results here; probabilistic quality and regression thresholds there.
- **debugging-observability vs performance-engineering** — explain failures with evidence here; measure and optimize bottlenecks there.
- **problem-selection vs design-doc** — justify investment here; communicate the selected technical design there.
- **code-review vs study-\* / audit-\*** — per-branch diff evaluation here; per-codebase findings there. A codebase-wide observation that surfaces during review cross-links to the relevant study/audit guide rather than being restated.
- **recon vs study-\*** — recon scores the repo on the AI-engineering hiring ladder and names the load-bearing gap; study-\* teaches the underlying topic. recon points at gaps; study-\* closes the comprehension ones.
- **drill vs study-ai-engineering Project exercises** — both produce buildable exercises. The seam is the induced failure: drill is "break on purpose, diagnose, prove with an eval, earn the war story"; Project exercises is "build it to learn the concept." Drill cross-references the same `Bx.y` and concept file; it adds steps 2, 5, and 6 (induce, eval, war story) that Project exercises doesn't carry.
- **ready vs /aipe:study / /aipe:rehearse** — study builds comprehension; rehearse prepares performance; ready measures hireability. ready sits above and routes into the other two: comprehension gaps → `/aipe:study-*`; can-build-but-can't-say-it gaps → `/aipe:rehearse-interview-defense`.
- **audit vs study-\* / refactor-\*** — audit takes stock of the whole project across four heterogeneous dimensions in one pass (status snapshot, debt triage, a11y, refactor opinions); study-\* teaches the underlying topics; refactor-\* applies a named technique. audit names what's there and what's wrong; refactor changes it.
- **audit-status vs audit-cleanup vs audit-refactor** — three different stances on the same code. status describes only (no recommendations). cleanup diagnoses and triages (fix-now / fix-later / accept). refactor is a staff-engineer opinion book (six chapters; takes not tasks). The orchestrator runs all three together; the standalone commands run them individually.

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

`notebook/` holds reference documentation, personal study notes, drafts, and working prompts — not generator specs, not commands, not shipped with the marketplace package. Four sections:

```text
notebook/guides/          personal study + interview-prep write-ups
                          (spec-aipe.md, how-to-study.md,
                          interview-prep-reads.md,
                          time-tested-pressure.md,
                          time-pressure-schedule.{md,ics})
notebook/books/           book-club notes + interview-masterclass material
notebook/pending_specs/   work-in-progress spec drafts not yet
                          promoted to specs/
notebook/prompts/         personal working prompts not (yet) generator
                          specs (aieng-curriculum.md, etc.)
```

These read top-to-bottom; they don't generate anything. Update them as the project (or your prep) evolves.

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
