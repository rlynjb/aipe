# Rehearse Orchestrator — the `/aipe:rehearse` command

One command that creates or updates **all five** per-repo rehearsal artifacts. These are performance artifacts for alignment, presentation, scrutiny, and calibration rather than comprehension guides.

## The human layer

```
problem selection   WHY this problem deserves investment
design docs         HOW a significant technical decision is communicated
hackathon demo      HOW the resulting value is shown
interview defense   HOW the work is defended under scrutiny
eval workshop       HOW you calibrate that AI-authored evals actually work
```

## Generators

   1. `rehearse-problem-selection` — why a problem deserves investment
   2. `rehearse-design-doc` — written RFCs for significant technical decisions
   3. `rehearse-hackathon-demo` — demo run-of-show
   4. `rehearse-interview-defense` — spoken project defense
   5. `rehearse-eval-workshop` — trustworthy-eval workshop (workbook, not book — generate the 10-exercise workbook + discovery map, then STOP. Coaching is a separate interactive layer invoked via the standalone `/aipe:rehearse-eval-workshop` command later)

```
/aipe:rehearse
  reads format.md + teacher.md (coach posture) + me.md + repo
  fans out:
    rehearse-problem-selection.md  →  .aipe/rehearse-problem-selection/
    rehearse-design-doc.md  →  .aipe/rehearse-design-doc/
    rehearse-hackathon-demo.md  →  .aipe/rehearse-hackathon-demo/
    rehearse-interview-defense.md  →  .aipe/rehearse-interview-defense/
    rehearse-eval-workshop.md  →  .aipe/rehearse-eval-workshop/
```

## Inputs and persona routing

Read `format.md` once for shared formatting and hard rules, `teacher.md` in **coach posture**, `me.md`, the current repo, and all five generator specs. Persona routing is uniform: all five artifacts use the same staff engineer shifted into coach posture. Each artifact defines its own shape.

## Run order

Run the generators in the numbered order above: justify the problem before documenting decisions, practice showing and defending the result, then calibrate the eval trust story. The artifacts are independent and must not rewrite one another's folders.

## Detection pass and single confirmation gate

For each fixed `.aipe/<generator>/` folder:

- **Books 1–4** (problem-selection, design-doc, hackathon-demo, interview-defense): choose UPDATE when the folder contains `00-overview.md` or numbered markdown content; otherwise choose CREATE.
- **rehearse-eval-workshop** uses CREATE / **RESUME** (not UPDATE). Choose RESUME when the folder contains `00-map.md` or any `0[1-9]-*.md` / `10-*.md` exercise file; otherwise CREATE. RESUME reads the existing workbook's progress state and reports it; it does NOT regenerate.

Print one consolidated plan and wait for one confirmation before editing. In non-interactive execution, print the plan and continue.

## Execution contract

- **CREATE:** generate the complete artifact declared by the generator spec.
- **UPDATE:** reconcile surgically when workflows, evidence, design decisions, demo behavior, or defense claims change. (Applies to books 1–4 only.)
- **RESUME:** report workbook state (ticked exercises, in-progress, remaining) and stop; do NOT regenerate. Do NOT overwrite the reader's edits. (Applies to rehearse-eval-workshop only.)
- **eval-workshop generation is non-interactive inside the fan-out.** Run the discovery pass, generate `00-map.md` and the exercise files (skipping RAG/agent exercises whose shape wasn't detected), and STOP. Do NOT enter coaching mode inside `/aipe:rehearse`. The coach-one-exercise-at-a-time mechanic is a downstream interaction the reader invokes via the standalone `/aipe:rehearse-eval-workshop` command.
- **Honesty:** use the repo and supplied project context; do not invent users, decisions, metrics, code, evidence, or eval files.
- **Isolation:** write only inside each generator's fixed folder.

## Final report

Print one row per book with mode and files created/updated/removed, followed by the best rehearsal order for the current goal.

## Relationship to `/aipe:study`

`/aipe:study` builds comprehension. `/aipe:rehearse` turns that understanding into staff-level problem selection, written alignment, demonstration, and spoken defense.
