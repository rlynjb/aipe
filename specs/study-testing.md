# Study — Testing & Correctness (applied)
## the `/aipe:study-testing` command

A study-family generator that audits the **current repo**'s tests: what's
covered and what isn't, whether the test design is sound, where untestable
code signals a design problem, and how the suite holds up (flakiness,
isolation). Findings grounded in real files.

Topic generator. Reads `format.md`, `teacher.md` (teacher posture),
`me.md` (reader + AUDIT-STYLE GENERATORS), the codebase. **This is an
audit-style generator** — it produces the two-pass output (`audit.md` +
discovered-pattern files) defined in `me.md` → AUDIT-STYLE GENERATORS.
Inherits the concept-file template, create/update, confirmation gate,
and run/report mechanics from the family — see `study-software-design.md`.
This file defines topic, lens inventory, partition, anchoring.

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
THE TOPIC — audit-style two-pass output
═════════════════════════════════════════════════

Per `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — `audit.md` walks the lens inventory below.
  → Pass 2 — discovered-pattern files name the testing patterns the
    repo actually exercises deliberately (e.g. a recorded-response
    contract test that pins an LLM seam, a property-based generator
    that defends an invariant, a fixture strategy that earns its own
    name).

  → THE LENS INVENTORY (for `audit.md`)

  Walk the codebase against this ordered 7-lens inventory. Each lens
  becomes one `##` section in `audit.md`. For each lens: name what the
  codebase actually does (with `file:line` grounding) or emit `not yet
  exercised`. The lens's audit content — what's tested, how, where the
  gaps and smells are — belongs in `audit.md`. When a finding is
  significant enough to have a dedicated pattern file in Pass 2,
  cross-link to it.

```
  1. what-is-tested-and-what-isnt
       the coverage map — not the % number, the RISK map. Which
       critical paths have tests, which don't. The zoom-out for
       the audit.
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
       consolidated checklist marked against this repo. Capstone lens.
```

  → WHAT EARNS A PASS 2 PATTERN FILE IN THIS TOPIC

  The general rules in `me.md` apply: the pattern has a name, passes
  the load-bearing test, passes the recognition test. For testing
  specifically, the load-bearing test asks: *"if I stripped this
  testing pattern out, what specifically would the suite stop
  catching?"* Real answers name a concrete class of bug now invisible
  (regressions in a recorded LLM contract, race conditions a
  property test caught, schema drift a contract test pins). A
  one-off flaky test is a lens finding; a recurring testing
  *technique* the repo applies deliberately is a pattern.

  Vague answers ("the tests would be weaker") do not earn a file.

═════════════════════════════════════════════════
ANCHORING + OUTPUT
═════════════════════════════════════════════════

Family anchoring rules (real paths, rank worst-first, blunt +
constructive, honest "too small to test meaningfully yet" with a
buildable target). Project exercises become "write the missing test
for X"; Interview defense becomes "justify this test boundary / this
mock."

The two-pass file layout is defined in `me.md` → AUDIT-STYLE
GENERATORS → File layout. For this topic the output folder is
`.aipe/study-testing/`. All files flat at the root, no nested
sub-directories.

Files produced:

  → `README.md` — through-line (how do you know it works?) + map +
    the deterministic-vs-eval seam, stated up front + reading order.
  → `audit.md` — Pass 1, the 7-lens audit defined above. The capstone
    lens (`testing-red-flags-audit`) consolidates the checklist.
  → `01-` through `0N-` — Pass 2, discovered-pattern files, each
    named after a testing technique the repo actually exercises.

Create/update, confirmation, audit pass, run order, summary: family
pattern, identical to `study-software-design.md` (which now follows
the two-pass shape). On UPDATE, follow `me.md` → AUDIT-STYLE
GENERATORS → On UPDATE. Per-repo, code-grounded, original expression,
inherit structure + voice. Wired into `/aipe:study` under the shared
confirmation gate and consolidated summary; also runnable standalone.
