# AIPE — study & rehearse specs

A spec system for generating per-repo learning and performance artifacts.
Point a command at a codebase and it produces structured guides written in
a consistent voice: **study** guides to *understand* the code, **rehearse**
books to *present and defend* it. Every artifact is grounded in the real
repo and refreshed in place as the code changes.

```
  study      → comprehension   (understand the codebase, for you)
  rehearse   → performance     (present / defend it, for a room)
```

---

## The foundation — three files everything reads

These are referenced by every generator; they are never restated inside a
generator (inherit, don't restate).

```
  format.md    STRUCTURE — the per-concept-file template, the house
               style, ASCII-diagram rules, the hard rules. Includes the
               concept-file block order:
                 Subtitle → Zoom out → Structure pass → How it works →
                 Primary diagram → Implementation in codebase → Elaborate
                 → Project exercises → Interview defense → Validate → See also

  teacher.md   VOICE — the staff-engineer persona. Teacher posture
               (study) and coach posture (rehearse) are the same engineer,
               different stance. Sets tone, what's banned, what's reached
               for first.

  me.md        READER — calibration: what's already known, which examples
               land, how deep to teach each concept.
```

Precedence when they conflict: the consuming spec wins on **structure**,
`teacher.md` on **voice**, `me.md` on **calibration**.

---

## `/aipe:study` — the comprehension orchestrator

One command; creates or updates **all seven** study guides for the current
repo. Run it after changing the codebase.

```
  #  generator                     output folder              posture
  ─  ─────────────────────────     ──────────────────────     ───────────
  1  study-system-design-dsa       study-system-design-dsa/   teacher
  2  study-software-design         study-software-design/     teacher
  3  study-security                study-security/            teacher
  4  study-testing                 study-testing/             teacher
  5  study-ai-engineering          study-ai-engineering/      teacher
  6  study-prompt-engineering      study-prompt-engineering/  inline*
  7  study-agent-architecture      study-agent-architecture/  teacher
```

\* `study-prompt-engineering` uses its own inline persona (a working AI
engineer), not `teacher.md`.

What each covers:

```
  system-design-dsa   architecture + data structures & algorithms
  software-design     module/interface quality, complexity (Ousterhout)
  security            trust boundaries, authn/authz, injection, secrets
  testing             deterministic correctness, coverage, test design
  ai-engineering      LLM foundations, RAG, agents, evals, serving, ML
  prompt-engineering  the prompt-engineering concepts
  agent-architecture  reasoning patterns, multi-agent orchestration
```

---

## `/aipe:rehearse` — the performance orchestrator

One command; creates or updates **all three** rehearse books. Run it when
preparing to present or interview. All three use **coach** posture.

```
  #  generator                     output folder                  produces
  ─  ─────────────────────────     ────────────────────────────   ────────
  1  rehearse-interview-defense    rehearse-interview-defense/    8-chapter defense book
  2  rehearse-hackathon-demo       rehearse-hackathon-demo/       demo run-of-show
  3  rehearse-design-doc           rehearse-design-doc/           staff design docs / RFCs
```

---

## Standalone specs (not in an orchestrator)

Run these directly when relevant; they are not part of the one-command
sweeps.

```
  /aipe:study-data-modeling   audits persistent-data design (schema,
                              indexing, transactions, migrations). Run on
                              repos with real persistence.

  /aipe:read-aposd            a book-style guide to the primitives in
                              "A Philosophy of Software Design" — teaches
                              the framework itself (not a codebase audit).
```

---

## How the specs partition — altitude, no overlap

Every spec owns one altitude or concern; a finding belongs to exactly one.

```
  intelligence   ai-engineering · prompt-engineering · agent-architecture
       ▲
  systems        system-design-dsa            (services, scale, DSA)
       │
  code-level     software-design · security · testing · data-modeling
       │         (modules, trust, correctness, persistent data)
       ▼
  foundations    read-aposd                   (learn the primitives)

  human layer    rehearse-design-doc          (communicate decisions)
```

Key seams:
- **software-design vs system-design-dsa** — module/interface/complexity
  here; service/architecture/algorithm there.
- **testing vs ai-engineering evals** — deterministic "equals expected"
  here; probabilistic "good enough / didn't regress" there.
- **data-modeling vs system-design** — schema/index/query shape here;
  which datastore + scaling there.
- **read-aposd vs study-software-design** — learn the framework vs apply
  it to your repo.

---

## How a run works

```
  1. detect    for each generator, does .aipe/<folder>/ exist?
                 NO  → CREATE (full generate from the spec)
                 YES → UPDATE (reconcile vs the codebase, surgically)
  2. plan      one consolidated change list across all generators
  3. confirm   a single gate for the whole run (skipped if non-interactive)
  4. execute   run each in its detected mode, in run order
  5. report    one summary table + per-guide detail
```

- **Per-repo.** Every reference, path, and citation is about the invoked
  repo only.
- **UPDATE reconciles against the CODE, not the specs.** A `format.md` or
  `teacher.md` change does *not* propagate through UPDATE — that needs a
  regenerate (delete the folder, or re-run as CREATE).
- **Honest output.** A generator emits "not yet implemented / not
  exercised" rather than inventing content for a topic the repo doesn't
  hit. Findings are grounded in real files; nothing is fabricated.

---

## Output layout

```
  .aipe/
    study-system-design-dsa/      study-prompt-engineering/
    study-software-design/        study-agent-architecture/
    study-security/               study-data-modeling/      (standalone)
    study-testing/                read-aposd/               (standalone)
    study-ai-engineering/
    rehearse-interview-defense/
    rehearse-hackathon-demo/
    rehearse-design-doc/
```

---

## What's new

```
  + study-software-design   new generator — applies A Philosophy of
                            Software Design to the repo. Wired into
                            /aipe:study.
  + study-security          new generator — trust-axis audit. Wired in.
  + study-testing           new generator — correctness/test audit,
                            partitioned from ai-engineering evals. Wired in.
  + study-data-modeling     new generator — persistent-data audit.
                            Standalone.
  + read-aposd              new standalone spec — book-style guide to
                            the design primitives.
  + rehearse-design-doc     new generator — staff design docs / RFCs,
                            the human/communication layer. Wired into
                            /aipe:rehearse.

  ~ format.md               added Block 3 "Structure pass" (layers · axes
                            · seams) between Zoom out and How it works;
                            blocks renumbered to 11.
  ~ teacher.md              added the "verdict first, then rank what
                            matters" teaching trait.
  ~ study.md                orchestrator: 4 → 7 generators.
  ~ rehearse.md             orchestrator: 2 → 3 generators.
```
