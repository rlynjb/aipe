# Rehearse — Problem Selection (the `/aipe:rehearse-problem-selection` command)

A rehearse-family generator that turns the **current repo** into a staff-level problem-selection brief: why a problem deserves attention, why now, for whom, what evidence supports it, what the smallest useful scope is, what not to build, and how success will be measured. This is the human layer before solution design.

Reads `format.md`, `teacher.md` in **coach posture**, `me.md`, and the codebase. It defines its own brief shape because a problem brief is not a study concept file.

```
  /aipe:rehearse-problem-selection  → create or update
  output: .aipe/rehearse-problem-selection/
```

## Where this sits

```
  rehearse-problem-selection  WHY this problem deserves investment.  ← here
  rehearse-design-doc         HOW a significant technical decision is communicated.
  rehearse-hackathon-demo     HOW the resulting value is shown.
  rehearse-interview-defense  HOW the work is defended under scrutiny.
```

## The brief

Generate one grounded bundle:

```
  .aipe/rehearse-problem-selection/
    00-overview.md
    01-problem-brief.md
    02-scope-cuts-and-non-goals.md
    03-options-and-opportunity-cost.md
    04-success-metrics-and-feedback-loop.md
    05-skeptical-reviewer-questions.md
```

The core brief answers, in order:

1. **User or operational problem** — who experiences what pain.
2. **Evidence and current cost** — what the repo, issue context, or workflow proves; distinguish evidence from inference.
3. **Why now** — what changed or what cost compounds.
4. **Beneficiaries and exclusions** — who benefits and who is intentionally outside scope.
5. **Constraints** — technical, product, time, migration, and organizational constraints visible from the repo or supplied context.
6. **Options** — include `do nothing`; name the opportunity cost of each option.
7. **Smallest useful scope** — the narrowest slice that validates the premise.
8. **Non-goals and cuts** — what not to build.
9. **Success metrics** — observable outcomes and the feedback loop.
10. **Risks and objections** — the skeptical review-room questions and the answers that hold.

## Anchoring rules

- Ground claims in repository evidence or supplied project context. Label inferences and unanswered discovery questions.
- Do not invent users, metrics, market evidence, or organizational constraints.
- If the repo cannot establish that a problem is worth solving, say so and produce the discovery questions required before investment.
- Prefer a narrow validated slice over a feature wishlist. Include `do nothing` as a real option.
- On UPDATE, reconcile the brief when scope, workflows, evidence, or significant constraints change.

## Running it inside `/aipe:rehearse`

This generator belongs to the rehearse orchestrator. `/aipe:rehearse` creates or updates it alongside the other rehearsal books under the same single confirmation gate and consolidated summary. It also remains runnable standalone.
