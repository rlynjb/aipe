# Rehearse Orchestrator — the `/aipe:rehearse` command

One command that creates or updates **all four** per-repo rehearsal books. These are performance artifacts for alignment, presentation, and scrutiny rather than comprehension guides.

## The human layer

```
problem selection   WHY this problem deserves investment
design docs         HOW a significant technical decision is communicated
hackathon demo      HOW the resulting value is shown
interview defense   HOW the work is defended under scrutiny
```

## Generators

   1. `rehearse-problem-selection` — why a problem deserves investment
   2. `rehearse-design-doc` — written RFCs for significant technical decisions
   3. `rehearse-hackathon-demo` — demo run-of-show
   4. `rehearse-interview-defense` — spoken project defense

```
/aipe:rehearse
  reads format.md + teacher.md (coach posture) + me.md + repo
  fans out:
    rehearse-problem-selection.md  →  .aipe/rehearse-problem-selection/
    rehearse-design-doc.md  →  .aipe/rehearse-design-doc/
    rehearse-hackathon-demo.md  →  .aipe/rehearse-hackathon-demo/
    rehearse-interview-defense.md  →  .aipe/rehearse-interview-defense/
```

## Inputs and persona routing

Read `format.md` once for shared formatting and hard rules, `teacher.md` in **coach posture**, `me.md`, the current repo, and all four generator specs. Persona routing is uniform: all four books use the same staff engineer shifted into coach posture. Each book defines its own artifact shape.

## Run order

Run the generators in the numbered order above: justify the problem before documenting decisions, then practice showing and defending the result. The books are independent and must not rewrite one another's folders.

## Detection pass and single confirmation gate

For each fixed `.aipe/<generator>/` folder, choose UPDATE when it contains `00-overview.md` or numbered markdown content; otherwise choose CREATE. Print one consolidated plan and wait for one confirmation before editing. In non-interactive execution, print the plan and continue.

## Execution contract

- **CREATE:** generate the complete artifact declared by the generator spec.
- **UPDATE:** reconcile surgically when workflows, evidence, design decisions, demo behavior, or defense claims change.
- **Honesty:** use the repo and supplied project context; do not invent users, decisions, metrics, code, or evidence.
- **Isolation:** write only inside each generator's fixed folder.

## Final report

Print one row per book with mode and files created/updated/removed, followed by the best rehearsal order for the current goal.

## Relationship to `/aipe:study`

`/aipe:study` builds comprehension. `/aipe:rehearse` turns that understanding into staff-level problem selection, written alignment, demonstration, and spoken defense.
