# Study — Testing & Correctness (applied)
## the `/aipe:study-testing` command

A study-family generator that audits the **current repo**'s tests: what's
covered and what isn't, whether the test design is sound, where untestable
code signals a design problem, and how the suite holds up (flakiness,
isolation). Findings grounded in real files.

Topic generator. Reads `format.md`, `teacher.md` (teacher posture),
`me.md`, the codebase. Inherits the concept-file template, create/update,
confirmation gate, and run/report mechanics from the family — see
`study-software-design.md`. This file defines topic, concepts, partition,
anchoring.

```
  /aipe:study-testing      → create or update
  output: .aipe/study-testing/
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition (the AI-eval seam)
═════════════════════════════════════════════════

```
  study-testing         DETERMINISTIC correctness: given known input,    ← here
                        assert known output. Unit/integration/property.
  study-ai-engineering  evals — PROBABILISTIC evaluation of model/LLM
                        output (eval sets, LLM-as-judge, regression).
  study-software-design "hard to test" as a design smell — that finding
                        is cross-linked, not duplicated.
```

  → The seam that matters: **determinism.** If the assertion is "equals
    the expected value," it's testing → here. If the assertion is "is
    good enough / didn't regress on a non-deterministic output," it's
    evaluation → study-ai-engineering. They MEET when you test an AI
    feature: a deterministic harness (here) wrapping a probabilistic
    core (there). State which half a finding is.
  → "This code is hard to test" is a `study-software-design` finding
    (deep modules are easy to test); reference it, don't re-audit it.

═════════════════════════════════════════════════
PERSONA + THROUGH-LINE
═════════════════════════════════════════════════

`teacher.md`, teacher posture. Verdict-first / rank-what-matters. `me.md`
for calibration. Inherit template + persona.

```
  the question:  how do you KNOW the code works — and will keep
                 working after the next change?

  tests answer the unknown-unknowns symptom: a good suite tells you
  what a change broke before your users do. A suite that doesn't is
  decoration.
```

═════════════════════════════════════════════════
THE TOPIC — concepts (full format.md template each)
═════════════════════════════════════════════════

"Implementation in codebase" carries the audit: what's tested, how, where
the gaps and smells are.

```
  1. what-is-tested-and-what-isnt
       the coverage map — not the % number, the RISK map. Which
       critical paths have tests, which don't. The zoom-out.
       red flag: the most important / most complex code is the
       least tested.

  2. test-design-and-levels
       the pyramid as-built: unit vs integration vs e2e balance.
       Over-mocked unit tests that prove nothing; missing
       integration coverage at the seams.
       red flag: heavy mocking that tests the mock, not the code;
       an inverted pyramid (all e2e, slow, flaky).

  3. tests-as-design-pressure
       where code is hard to test BECAUSE the design is tangled
       (global state, side effects, deep coupling). Untestable =
       a design smell. Cross-link to software-design's deep-modules.
       red flag: a test that needs elaborate setup to reach the code.

  4. determinism-isolation-and-flakiness
       tests that depend on time, network, ordering, shared state.
       Flaky tests train people to ignore red.
       red flag: a test that passes/fails on rerun with no code
       change; tests that must run in a specific order.

  5. edge-cases-and-error-paths
       boundary values, empty/null, error branches, property-style
       coverage. The happy path is usually tested; the rest isn't.
       red flag: zero tests on the error/exception branches.

  6. testing-ai-features   (AI repos)
       the seam in practice: how (if at all) the repo puts a
       deterministic harness around a non-deterministic core —
       fixtures, recorded responses, contract tests on the
       wrapper, and where it hands off to study-ai-engineering's
       evals for the model output itself.
       red flag: an LLM feature with no test at the boundary
       (prompt assembly, tool dispatch, output parsing) — all of
       which ARE deterministic and testable.
       (Honest "not exercised" if no AI code.)

  7. testing-red-flags-audit
       consolidated checklist marked against this repo. Capstone.
```

═════════════════════════════════════════════════
ANCHORING + OUTPUT
═════════════════════════════════════════════════

Family anchoring rules (real paths, rank worst-first, blunt + constructive,
honest "too small to test meaningfully yet" with a buildable target).
Project exercises become "write the missing test for X"; Interview defense
becomes "justify this test boundary / this mock."

```
  .aipe/study-testing/
    README.md   through-line (how do you know it works?) + map + the
                deterministic-vs-eval seam, stated up front
    01-what-is-tested-and-what-isnt.md
    02-test-design-and-levels.md
    03-tests-as-design-pressure.md
    04-determinism-isolation-and-flakiness.md
    05-edge-cases-and-error-paths.md
    06-testing-ai-features.md
    07-testing-red-flags-audit.md
```

Create/update, confirmation, audit pass, run order, summary: family pattern,
identical to `study-software-design.md`. Per-repo, code-grounded, original
expression, inherit structure + voice. Wire into `/aipe:study` via a table
row + run-order entry (teacher posture); standalone until then.
