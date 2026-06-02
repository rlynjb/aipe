# PR Review Protocol

A five-pass code review process for the current branch. Each pass operates at a different altitude. Finish each pass before starting the next — problems found higher up make lower-level findings irrelevant.

## How to use this

Run against the current branch vs its base (default: `main`). Compare `git diff <base>...HEAD` and review the working tree state.

Execute passes **in order**. Do not skip ahead. If a pass surfaces a blocking issue, stop and report it before continuing.

Output: a structured review report at the end (format defined below). Do not drop comments mid-pass; collect findings and emit them at the end, grouped by pass and severity.

---

## Inputs to gather first

Before Pass 1, collect:

- Current branch name and base branch (`git branch --show-current`, `git merge-base`)
- Commit list (`git log <base>..HEAD --oneline`)
- Files changed and line counts (`git diff <base>...HEAD --stat`)
- PR description / linked ticket if available in:
  - `.github/PULL_REQUEST_TEMPLATE.md` (for context on what's expected)
  - Commit messages
  - Any `PR_BODY.md`, `CHANGES.md`, or similar at repo root
  - First commit's extended message
- Project conventions from `CLAUDE.md`, `README.md`, `.dev/`, or `CONTRIBUTING.md`

If PR intent is unclear after gathering these, **stop and ask the user** what the PR is meant to accomplish before proceeding.

---

## Pass 1 — Intent

**Goal:** Confirm the PR exists for a clear, correct reason.

**Do not look at code in this pass.** Read description, ticket, commit messages, design docs.

Answer:

- [ ] What problem is this PR solving? State it in one sentence.
- [ ] Is the proposed solution the right shape for the problem?
- [ ] Is the scope appropriate — not bundling unrelated changes, not too narrow to be useful?
- [ ] Does this conflict with recent decisions, in-flight work, or stated project direction (check `CLAUDE.md`, `.dev/`, recent commits on base)?
- [ ] Are there explicit non-goals or out-of-scope items called out?

**Blocking conditions for Pass 1:**

- PR purpose cannot be determined from available context
- Stated goal contradicts project direction or recent decisions
- Scope is clearly wrong (e.g., "fix typo" PR touching architecture)

If any blocking condition fires, halt and report. Do not proceed to Pass 2.

---

## Pass 2 — Shape

**Goal:** Sanity-check the surface area of the diff before reading code.

Run:

```
git diff <base>...HEAD --stat
git diff <base>...HEAD --name-only | xargs -I {} dirname {} | sort -u
```

Answer:

- [ ] How many files changed? How many lines added/removed?
- [ ] Which layers are touched (UI, state, data, API, config, tests, deps, migrations)?
- [ ] Does the file tree match the PR description? (e.g., "small bug fix" should not touch 40 files)
- [ ] Are there unrelated changes mixed in — drive-by refactors, formatting changes, unrelated files?
- [ ] Are there high-risk change types present? Flag each:
  - Database migrations
  - Dependency additions or version bumps (check `package.json`, `package-lock.json`, lockfile diffs)
  - Environment variable or config changes
  - Public API / contract changes
  - Auth, permissions, or security-adjacent code
- [ ] Is the test file count proportional to the logic file count?

**Output of Pass 2:** A one-sentence summary of what the PR does *based purely on the diff shape*. Compare to the description's one-sentence summary from Pass 1. If they don't match, that's a finding.

---

## Pass 3 — Architecture

**Goal:** Verify the change fits the codebase and the system design is sound. Skim for structure, not correctness.

For each significant new or modified module:

**Placement and patterns:**

- [ ] Is the new logic in the right layer? (UI logic in components, data logic in data layer, etc.)
- [ ] Does it follow existing patterns in the codebase, or invent new ones? If new, is the new pattern justified?
- [ ] Are new abstractions (hooks, utilities, components, modules) earning their place?
- [ ] Anything obviously misplaced — business logic in render, side effects where they don't belong, hardcoded values that should be config?
- [ ] Are naming conventions consistent with the rest of the codebase?

**Boundaries and contracts:**

- [ ] Does data cross layer boundaries through well-defined contracts, or does one layer reach into another's internals?
- [ ] Are types defined at the boundary, or invented ad-hoc on each side?
- [ ] If the data layer changed shape tomorrow, how many UI files would need to change? (Answer should be small.)
- [ ] Are imports flowing in the right direction (UI imports data, not vice versa; shared utilities don't import from features)?

**State ownership and source of truth:**

- [ ] For each piece of state introduced or changed: what's the single source of truth?
- [ ] If two places hold it, how are they kept in sync? What happens when sync fails?
- [ ] Is derived state being stored when it should be computed?
- [ ] Is state at the right level — local vs lifted vs global?
- [ ] For React/Vue: hooks following the rules, effects with correct dependency arrays, components not god-sized?

**Coupling and change radius:**

- [ ] If this one thing changed tomorrow, what else would have to change?
- [ ] Are there new direct imports between modules that previously didn't know about each other? (Boundary erosion.)
- [ ] Hidden coupling via global state reads, magic strings shared across modules, implicit ordering dependencies?

**Failure modes (architectural):**

- [ ] Are retries idempotent at the design level? Could retrying create duplicate records?
- [ ] For multi-write operations (e.g., local + remote, two services): what's canonical, what's the ordering, what happens on partial failure?
- [ ] Is there a timeout strategy? What happens when it fires?
- [ ] Are errors caught at the right layer, or swallowed too early / propagated too far?

**Scaling assumptions:**

- [ ] Does this assume something about size that won't hold over time? (List of users, messages, entries, todos, history)
- [ ] Is pagination present on lists that will grow unboundedly?
- [ ] Cache invalidation strategy when caching — or explicit decision not to cache?
- [ ] Rate limits on external APIs considered?
- [ ] Bundle size impact of new dependencies?

**State machines:**

- [ ] Anything with "modes" or "statuses" — is it modeled as an explicit state machine (enum/union), or implied by booleans? (Multiple booleans almost always allow invalid combinations.)
- [ ] Are all transitions valid? Can the code reach an unreachable state?

**Blocking conditions for Pass 3:**

- A new function/component is structurally in the wrong place such that reviewing its implementation would be wasted effort
- A new abstraction duplicates an existing one already in the codebase
- Source of truth is unclear or contradicted across layers
- State is modeled in a way that admits invalid combinations on a critical path

If blocking, halt and report. Do not proceed.

---

## Pass 4 — Correctness

**Goal:** Verify the code actually works for the cases it needs to handle.

Go line by line on the *meaningful* changes — core logic, risky paths, anything the PR description flagged as tricky. Skim boilerplate.

**Logic walkthrough.** For each meaningful change:

- [ ] Happy path — does it do what the description claims?
- [ ] Error paths — what happens on throw, network failure, timeout, mid-flight unmount?
- [ ] States — loading, error, empty, success, stale (especially for async UI)
- [ ] Contract changes — did a function signature, API shape, or DB schema change in a way callers don't know about? (`git grep` for callers)
- [ ] Race conditions, ordering assumptions, time-of-check-time-of-use bugs
- [ ] Resource cleanup — event listeners, subscriptions, timers, file handles

**Complexity scan.** For every loop, ask: what's `n`, and is there a hidden loop inside it?

- [ ] `array.includes()` / `array.find()` / `indexOf` inside a loop over the same array → O(n²) when a Set/Map would make it O(n)
- [ ] `.filter().map().reduce()` chains re-traversing the same data when one pass would do
- [ ] Nested `forEach` over the same collection
- [ ] Sorting inside a loop instead of once outside
- [ ] Recursion without memoization on overlapping subproblems

For small bounded `n` (under ~100), O(n²) is fine. The question is whether `n` can grow with user data or input — list of entries, messages, habits over time, todos, etc.

**Data structure fit.** Does the structure match the access pattern?

- [ ] Frequent lookups by key → Map/object, not array+find
- [ ] Need uniqueness → Set, not array + dedup
- [ ] Lots of "is this in the set" checks → Set, not array
- [ ] Tree-shaped data being flattened then re-nested repeatedly → keep it as a tree or memoize
- [ ] Need both order and uniqueness → ordered Map / Set

**Edge cases (DSA discipline).** For any non-trivial logic:

- [ ] Empty input — sensible result, or divide by zero / access `[0]` of empty?
- [ ] Single-element input — "compare adjacent pairs" patterns break at length 1
- [ ] Duplicate elements — sort stability, dedup correctness, "first match vs all matches"
- [ ] Off-by-one at array boundaries (`<` vs `<=`, `length` vs `length - 1`)
- [ ] Negative numbers, zero, very large numbers (JS: precision past `Number.MAX_SAFE_INTEGER`)
- [ ] Already-sorted vs reverse-sorted vs random input (for sort-adjacent logic)
- [ ] Concurrent / out-of-order arrival of async results

**Recursion checks (if present):**

- [ ] Base case present and reachable from every recursive call?
- [ ] Input that could cause stack overflow (deeply nested data, long lists)?
- [ ] Could this be iterative without losing clarity?
- [ ] For tree traversals: correct traversal order (pre/in/post-order, BFS/DFS) for what's being computed?

**Mutation and aliasing hazards:**

- [ ] Object/array passed in and mutated when caller expected it unchanged?
- [ ] `Array.sort` / `reverse` mutating in place — was a copy needed?
- [ ] Default parameter values that are objects/arrays (shared across calls!)
- [ ] Shallow-copied nested object — inner references still shared?

**Idempotency and side effects:**

- [ ] If this code runs twice (retry, double-click, hot reload, navigation back), what happens?
- [ ] Is the operation safe to retry, or does it need deduplication?
- [ ] Are side effects isolated to predictable places, or scattered?

**Observability (correctness-adjacent):**

- [ ] Enough logging/telemetry to debug this in production without local repro?
- [ ] Errors logged with enough context (user id, request id, input shape)?
- [ ] Silent failures actually silent, or surfaced somewhere?

**Tests:**

- [ ] Do tests cover the risky cases (edges, errors, races) or just the obvious path?
- [ ] Would the tests actually fail if the code were wrong? (Beware tests that only assert "no error thrown.")
- [ ] Are mocks reasonable, or do they bypass the thing being tested?
- [ ] Test coverage proportional to risk, not just to line count?

**Security and data integrity sweep:**

- [ ] User input validated and escaped at boundaries
- [ ] Auth/authorization checks present on protected actions
- [ ] No secrets, tokens, or PII committed
- [ ] No new dependencies with known CVEs (flag any new package additions for the user to verify)
- [ ] SQL/query construction not vulnerable to injection
- [ ] No `dangerouslySetInnerHTML`, `eval`, or equivalent without justification

---

## Pass 5 — Craft

**Goal:** Surface low-stakes improvements. Mark these clearly as non-blocking.

- [ ] Naming reveals intent
- [ ] Functions do one thing; long functions broken up where natural
- [ ] Comments explain *why*, not *what*; no stale comments
- [ ] Dead code removed
- [ ] Magic numbers / strings extracted where it improves clarity
- [ ] Error messages useful to the next engineer debugging in production
- [ ] Accessibility (frontend): semantic HTML, keyboard nav, focus management, ARIA only where needed, labels on icon-only buttons, color contrast
- [ ] Performance foot-guns that aren't complexity bugs: unnecessary re-renders, large unmemoized lists, blocking the main thread on a hot path
- [ ] Bundle/dependency cost: any new dep that's heavy for what it does

---

## Output format

After all passes complete (or after halting on a blocking condition), emit a single report in this format:

```
# PR Review: <one-sentence summary>

**Branch:** <branch> → <base>
**Files changed:** <count> (+<adds> / -<dels>)
**Verdict:** [approve | approve with comments | request changes | blocked at pass N]

## Summary
<2–4 sentences: what the PR does, what's good, what's concerning>

## Blocking issues
<empty if none. Each item: pass number, location (file:line), problem, suggested resolution>

## Findings by pass

### Pass 1 — Intent
<bullets, or "no findings">

### Pass 2 — Shape
<bullets, or "no findings">

### Pass 3 — Architecture
<bullets. Group by category: placement / boundaries / state ownership / coupling / failure modes / scaling / state machines. Each item: location, problem, suggested direction.>

### Pass 4 — Correctness
<bullets. Group by severity: blocking / important / minor. Each item: location, problem, suggested fix. Call out complexity, data structure, edge case, and idempotency findings explicitly.>

### Pass 5 — Craft
<bullets, all tagged "nit:" or "suggestion:". These are non-blocking.>

## Questions for the author
<things you couldn't determine and need clarification on>

## Praise
<specific good decisions worth calling out — not generic encouragement>
```

---

## Constraints

- **One pass at a time.** Do not jump between passes. Collect findings; emit at end.
- **Severity discipline.** Every Pass 4 finding gets a severity (blocking / important / minor). Every Pass 5 finding is non-blocking.
- **Ask questions, don't issue verdicts**, when uncertainty is genuine. "What happens if `userId` is null here?" beats "this is broken" when you're not 100% sure.
- **No style nits the linter should catch.** If the project has a linter/formatter, assume it runs. If it doesn't, that's the actual finding.
- **Pull the branch context, not just the diff.** For non-trivial changes, `git grep` for callers of changed functions, read surrounding unchanged code, check whether assumptions still hold.
- **Complexity flags require a real `n`.** Don't flag O(n²) on a list known to be bounded and small. Do flag it when `n` grows with user data, time, or input.
- **Praise specifically.** Generic "looks good" praise is noise. Call out specific decisions that were well made.
- **Do not run tests, install dependencies, or execute the code** unless the user explicitly asks. This is a read-only review.

---

## Run

Start by gathering inputs (section above). State the base branch you're comparing against. If unclear, ask. Then execute Pass 1 through Pass 5 in order, halting on any blocking condition. Emit the final report in the format specified.
