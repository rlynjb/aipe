# Ready Orchestrator — the `/aipe:ready` command

One command that runs the **readiness loop** on the current repo: assess where
the repo sits on the AI-engineering hiring ladder, then turn the load-bearing
gap into a hands-on failure-rep. Where `/aipe:study` builds comprehension and
`/aipe:rehearse` prepares performance, `/aipe:ready` measures hireability and
closes the highest-leverage gap.

This orchestrator defines no content. It reads `format.md`, `teacher.md` in
coach posture, `me.md`, the current repo, and the two generator specs; runs
them as a pipeline; prints one plan; waits for one confirmation; then writes
the artifacts and one summary.

## The readiness loop

```
  recon   PLACE the repo on the hiring ladder + sequence the path up.
  drill   EXECUTE the load-bearing gap as an induced-failure rep.
```

## Pipeline, not fan-out

Unlike `/aipe:study` and `/aipe:rehearse`, which fan out to independent
generators that never touch each other's folders, the readiness generators
form a **pipeline** — recon's output is drill's input:

```
/aipe:ready
  reads format.md + teacher.md (coach) + me.md + repo
       (+ any existing .aipe/study-ai-engineering/ audit for context,
        + .aipe/project/aieng-curriculum.md when present)

  1. recon  →  .aipe/audits/recon-[date].md
                  produces the LENS scorecard + the TRACK queue
                        │
                        │  the NEXT (load-bearing) move from the queue
                        ▼
  2. drill  →  .aipe/drills/<competency>-<slug>.md
                  the failure-rep that closes that one gap
```

## Generators

  1. `recon` — readiness audit + sequenced path (the dated assessment)
  2. `drill` — one hands-on failure-rep for the gap recon surfaced

## Run order

Strictly sequential — recon before drill, because drill needs recon's queue.
recon writes the dated audit and surfaces the TRACK queue; ready reads the
NEXT move and hands it to drill. Default: generate the drill for the single
load-bearing gap — depth over breadth, per `me.md`. Generate more only when
asked (`--n` for the top N queue items).

## What ready does NOT do

  → **It does not complete the drills.** A drill is hands-on work you do in
    your editor — build the naive version, induce the failure, diagnose, fix,
    eval. ready produces the recon audit and the drill exercise sheet; you run
    the rep and write the war story.
  → **It does not run `/aipe:study-*` or `/aipe:rehearse-*`.** recon's queue
    routes gaps that aren't drill-shaped outward — a comprehension gap →
    `/aipe:study-ai-engineering`, a can-build-but-can't-say-it gap →
    `/aipe:rehearse-interview-defense`. ready surfaces those routes in the
    summary; you run them.
  → **It is per-repo.** It scores and drills the repo where it was run. The
    cross-repo three-track portfolio view (which track is weakest across all
    your repos) is the parked `/aipe:recon-portfolio` layer — recon points up
    to it rather than guessing at repos this run can't read.

## Inputs and persona routing

`format.md` for structure (diagrams, hard rules), `teacher.md` in coach
posture for voice, `me.md` for reader calibration. Both generators use coach
posture — same staff engineer, hiring-bar stance. Read
`.aipe/project/aieng-curriculum.md` when present and pass it to drill (for
`Bx.y` provenance). Never block a run because it's absent.

## Single confirmation gate

recon is dated — it always writes a new `.aipe/audits/recon-[date].md`, never
reconciles an existing one. drill always generates a new writeup. So the plan
is simply: "recon will write [dated audit]; drill will generate [N exercise
sheet(s)] for the top gap(s)." Print the plan, wait for one confirmation, then
execute. In non-interactive execution, print the plan and continue.

## Execution contract

- **recon:** read the repo + any existing `study-ai-engineering` audit; score
  against the competency map on the L0–L3 ladder; write the dated audit with
  the LENS scorecard and the TRACK queue.
- **drill:** take the NEXT move from recon's queue; generate the six-step
  writeup targeting the repo's real files; cite the `Bx.y` curriculum item and
  the `study-ai-engineering` concept file for provenance.
- **Honesty:** score against the code, not the README; emit `not yet
  exercised` rather than inventing coverage; never plan a failure that step 2
  can't actually induce.
- **Isolation:** recon writes only to `.aipe/audits/`; drill writes only to
  `.aipe/drills/`. Neither rewrites the other's output.

## Final report

Print: the recon audit path, the repo's true level (the LENS verdict), the
load-bearing gap, the drill sheet(s) generated, and the rest of the TRACK
queue with the outward route for each item (`/aipe:study-*`, `/aipe:drill`
again, or `/aipe:rehearse-*`). End with the single next action.

## Relationship to `/aipe:study` and `/aipe:rehearse`

`/aipe:study` builds comprehension; `/aipe:rehearse` prepares performance;
`/aipe:ready` measures where you stand and closes the highest-leverage gap.
The readiness loop sits above the other two and routes into them. Each
generator also remains runnable standalone — `/aipe:recon` to reassess,
`/aipe:drill` to rep a specific gap — for when you don't need the full loop.
