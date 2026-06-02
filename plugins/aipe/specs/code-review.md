# Code Review — branch audit for the current PR
## the `/aipe:code-review` spec (reference)

A per-branch review generator. Reads the **current branch** against its base,
walks the five review lenses defined in `prompts/pr-review-protocol-v2.md`,
and produces a single grounded review report in Rein's voice.

This is not a study generator. It does not produce a long-lived per-repo
guide and has no UPDATE mode — every run is a fresh review of the current
branch state. The output is one report, written to STDOUT (or optionally
saved under `.aipe/reviews/`).

```
  inputs:   current branch + base branch + protocol
  output:   one review report (Branch context + 5 lens findings + verdict)
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition (no overlap)
═════════════════════════════════════════════════

```
  study-*           understand the whole codebase (long-lived).
  audit-*           inventory health / debt of the whole codebase.
  refactor-*        propose / execute restructuring with named techniques.
  code-review       evaluate ONE branch's diff against base.        ← here
```

A finding belongs here when it is about **this branch's changes**. Codebase-
wide observations (architectural debt, missing tests overall, performance
hotspots in untouched code) cross-link to the relevant `study-*` /
`audit-*` guide rather than being restated here.

═════════════════════════════════════════════════
WHAT THIS SPEC DOES NOT REDEFINE
═════════════════════════════════════════════════

Read these from their source files; do not restate them here.

  → The **lens inventory** — the five review passes (Intent → Shape →
    Architecture → Correctness → Craft), their checklists, their
    blocking conditions, and the input-gathering protocol. Lives in
    `prompts/pr-review-protocol-v2.md`.
  → **Voice and persona** — staff-engineer teacher posture, verdict-
    first / rank-what-matters, blunt-then-constructive, banned list
    (no marketing language, no slow on-ramps, no apologetic hedging).
    Lives in `teacher.md`.
  → **Reader calibration** — register, examples, prior knowledge, what
    not to over-explain. Lives in `me.md`.
  → **House structure rules** — diagrams, formatting, hard rules.
    Lives in `format.md`.

This spec defines only: the **branch-context discipline**, the
**anchoring rules** for review findings, the **report output format**
(branch context + per-lens findings), and how the spec composes
the four files above.

═════════════════════════════════════════════════
INPUTS — gather before the first lens
═════════════════════════════════════════════════

Per `prompts/pr-review-protocol-v2.md` § Inputs to gather first:

```
  → current branch + base       (git branch --show-current, git merge-base)
  → commit list                 (git log <base>..HEAD --oneline)
  → diff stat                   (git diff <base>...HEAD --stat)
  → PR description / ticket     (.github/PULL_REQUEST_TEMPLATE.md, commit
                                 messages, PR_BODY.md, CHANGES.md, first
                                 commit's extended message)
  → project conventions         (CLAUDE.md, README.md, .dev/, CONTRIBUTING.md)
```

If PR intent is unclear after gathering, **stop and ask the user** what
the PR is meant to accomplish. Do not proceed to the lens walk.

═════════════════════════════════════════════════
THE LENS INVENTORY — five passes from the protocol
═════════════════════════════════════════════════

The lens inventory lives in `prompts/pr-review-protocol-v2.md`. Five
lenses, walked **in order**, finish each before starting the next —
problems found higher up make lower-level findings irrelevant.

```
  1. Intent       does this PR exist for a clear, correct reason?
                  no code reading. read description, ticket, commit
                  messages, design docs.

  2. Shape        does the diff surface area match the description?
                  file count, layers touched, risk types flagged,
                  unrelated changes mixed in.

  3. Architecture does the change fit the codebase?
                  placement and patterns, boundaries and contracts,
                  state ownership and source of truth, coupling
                  and change radius, failure modes, scaling
                  assumptions, state machines.

  4. Correctness  does the code actually work for the cases it
                  needs to handle?
                  happy path, error paths, complexity (real n),
                  data-structure fit, edge cases (empty / single /
                  duplicate / off-by-one / negative / async),
                  recursion checks, mutation and aliasing,
                  idempotency, observability, tests, security.

  5. Craft        low-stakes improvements. always non-blocking.
                  naming, comments, dead code, magic numbers,
                  error messages, a11y, perf foot-guns, deps cost.
```

Each lens has **blocking conditions** defined in the protocol. Honor
them: if a lens fires a blocking condition, halt and report — do not
proceed to the next lens.

This spec does not restate the checklists. The protocol is the source
of truth for *what* to check per lens; this spec is the source of
truth for *how* to frame and report findings.

═════════════════════════════════════════════════
THE BRANCH-CONTEXT BLOCK — required, comes first
═════════════════════════════════════════════════

Every review opens with a **Branch context** block answering, in this
order:

```
  Branch          <branch-name> → <base-branch>
  Task            one sentence: what does this branch try to do?
  Source          ticket | PR body | commit message | inferred from diff
  Confidence      stated | inferred
  Files changed   <count>   (+<additions> / -<deletions>)
  Commits         <N>       (newest first if listing)
  Layers touched  ui · state · data · api · config · tests · deps · migrations
  Risk surface    flagged risk types (migration, dep bump, auth, public API,
                  config, env vars, schema change) — or "none"
```

If `Task` cannot be derived from a real artifact (ticket, PR body,
commit message, README/CHANGES file), state `Source: inferred from diff`
and **stop**. Ask the user to confirm or correct the inferred task
before proceeding. The Branch context block is the single source of
truth for what the branch is FOR; every Pass-1 and Pass-2 finding ties
back to it.

This block is non-negotiable. A review without an honest Branch context
block is a review that cannot evaluate Intent or Shape — drop everything
else and fix this first.

═════════════════════════════════════════════════
ANCHORING RULES — how findings ground themselves
═════════════════════════════════════════════════

```
  → Every applied claim cites a real `file:line` range, configuration
    value, schema object, or executable path **in the diff**. A claim
    about untouched code is out of scope; cross-link the relevant
    `study-*` guide instead.

  → Distinguish observed from inferred. Label inferred runtime or
    production behavior plainly ("this *would* deadlock under
    concurrent writes" vs "this deadlocks at <file:line>").

  → "Not exercised" is a valid finding. If a lens finds nothing
    significant, emit `no findings` honestly. Never manufacture a
    finding to fill the section. Padding the list is the failure mode.

  → Rank, don't flatten. Per Rein's verdict-first trait: name the
    single worst issue per lens BEFORE the long list. A flat catalogue
    of every minor smell teaches less than "fix this one first."

  → Severity discipline (Pass 4): every finding is tagged
    `blocking` / `important` / `minor`. Pass 5 findings are always
    `nit:` or `suggestion:` and are non-blocking.

  → Ask questions when uncertainty is genuine. "What happens if
    `userId` is null here at auth.ts:42?" beats "this is broken"
    when you're not 100% sure. The questions go in a dedicated
    section, not mixed into the verdict.

  → Praise specifically. Generic "looks good" is noise. Call out
    specific decisions that were well made (the right boundary chosen,
    the right abstraction earned its place, the right test caught the
    right thing). Praise grounds future authors' calibration.

  → Read-only by default. Do not run tests, install dependencies, or
    execute the code unless the user explicitly asks. This is a
    review, not a verification run.

  → No style nits the linter should catch. If the project has a
    linter / formatter, assume it runs. If it doesn't, that's the
    real Pass-5 finding ("no linter configured") — not the individual
    style violations.

  → Complexity flags require a real `n`. Don't flag O(n²) on a list
    known to be bounded and small. Do flag it when `n` grows with
    user data, time, or input.
```

═════════════════════════════════════════════════
OUTPUT — the report format
═════════════════════════════════════════════════

A single review report. Default to STDOUT (printed in the agent's
conversation). When `.aipe/reviews/` exists, also write a copy to
`.aipe/reviews/<branch>-<YYYY-MM-DD>.md`.

```
# PR Review: <one-sentence summary>

## Branch context
**Branch:**         <branch> → <base>
**Task:**           <one-sentence task summary>
**Source:**         <ticket | PR body | commit message | inferred from diff>
**Confidence:**     <stated | inferred>
**Files changed:**  <count>  (+<adds> / -<dels>)
**Commits:**        <N>
**Layers touched:** <ui · state · data · ...>
**Risk surface:**   <flagged types or "none">
**Verdict:**        [approve | approve with comments | request changes | blocked at pass N]

## Summary
<2–4 sentences: what the PR does, what's good, what's concerning.
verdict-first; rank what matters.>

## Blocking issues
<empty if none. Each item: pass number, location (file:line), problem,
suggested resolution.>

## Findings by pass

### Pass 1 — Intent
<bullets, or "no findings". Tie each finding to the Branch context block.>

### Pass 2 — Shape
<bullets, or "no findings". Include the one-sentence diff-shape summary
and whether it matches the Task statement.>

### Pass 3 — Architecture
<bullets. Group by category: placement / boundaries / state ownership /
coupling / failure modes / scaling / state machines. Each: location,
problem, suggested direction.>

### Pass 4 — Correctness
<bullets. Group by severity: blocking / important / minor. Call out
complexity, data-structure, edge-case, idempotency, and security
findings explicitly. Each: location, problem, suggested fix.>

### Pass 5 — Craft
<bullets, all tagged "nit:" or "suggestion:". Non-blocking.>

## Questions for the author
<things you couldn't determine and need clarification on. Genuine
uncertainty only — don't ask questions whose answer the diff makes
obvious.>

## Praise
<specific good decisions worth calling out — not generic encouragement.>
```

═════════════════════════════════════════════════
HONEST ASSESSMENT — small PRs, narrow scope
═════════════════════════════════════════════════

A tight bug fix or a one-line config change will not exercise every
lens. When a lens has little to bite on, emit `no findings` honestly
or write a single sentence stating the lens is not load-bearing for
this PR. Never manufacture a finding to fill the section. A two-line
Pass 5 on a focused refactor is doing its job; a fifteen-line Pass 5
on the same refactor is the reviewer padding the list.

Conversely, a large or unusual PR may justify going deep on a single
lens (Architecture often, Correctness for risky logic). Match weight
to evidence: the highest-stakes lens gets the most ink, the rest get
what the diff earns.

═════════════════════════════════════════════════
SCOPE AND CONSTRAINTS
═════════════════════════════════════════════════

```
  → Per-branch. Every finding is about THIS branch's diff against
    base. Untouched-code findings cross-link, not duplicate.

  → Read-only by default. Do not modify code; do not run tests;
    do not install dependencies. If a verification run is needed,
    say so and stop.

  → Inherit voice from teacher.md (teacher posture: verdict-first,
    rank-what-matters, blunt-then-constructive, banned list).

  → Inherit reader calibration from me.md.

  → Inherit the lens inventory from prompts/pr-review-protocol-v2.md.
    Where the protocol's checklists contradict this spec, the protocol
    wins on **what to check**; this spec wins on **how to frame and
    report**.

  → Inherit structure rules from format.md.

  → No project names in the report except the branch being reviewed
    and direct references to its files.
```

═════════════════════════════════════════════════
HOW THE RUN EXECUTES — step by step
═════════════════════════════════════════════════

```
  1. Resolve inputs
       run the input-gathering steps from the protocol; resolve base
       branch; read PR description and project conventions.

  2. Build the Branch context block
       answer Branch / Task / Source / Confidence / Files / Commits /
       Layers / Risk surface. If Task is inferred and the diff is
       non-trivial, stop and ask before proceeding.

  3. Walk the lenses in order
       Pass 1 → Pass 2 → Pass 3 → Pass 4 → Pass 5.
       finish each before starting the next; honor blocking conditions.

  4. Collect findings
       rank per lens; assign severity for Pass 4; tag Pass 5 as nit
       or suggestion; gather genuine questions; note specific praise.

  5. Emit the report
       single artifact, Branch context first, verdict in the header,
       findings grouped by pass, questions and praise at the end.
       write to STDOUT; mirror to .aipe/reviews/<branch>-<date>.md
       when that directory exists.
```
