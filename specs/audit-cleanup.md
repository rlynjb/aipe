# Cleanup Audit Spec

Use this when the codebase has accumulated entropy and you want to pay down debt — not when you're gating a phase. Output is a prioritized debt list where every item is either a refactor (behaviour-preserving) or explicitly deferred. If an item requires behaviour changes to clean up, it leaves this flow and becomes feature work.

> Cleanup audits are backward-looking and health-driven. Phase audits are forward-looking and feature-driven. Don't conflate them — running this before a phase boundary will surface noise you don't need to act on yet.


## Step 1 — Update app analysis

Same as phase audit, but with a different lens. You're not asking "what's incomplete?" — you're asking "what's grown, drifted, or rotted?"


```
"Update context.md to reflect the current state of [app].
What modules have grown significantly? Where have
patterns diverged from earlier decisions? What was
written quickly that's now load-bearing?"
```


> 💾 Update → .aipe/project/context.md


## Step 2 — Multi-lens scan

Cleanup debt isn't one thing. Run the codebase through four distinct lenses in one pass — each finds different problems, and mixing them up means you'll miss things.


### Lens 1: Structural (code health)

The cheapest lens. Finds the most items. Most of cleanup lives here.

  - **Dead weight** — unused exports, unreachable branches, commented-out code, unused dependencies, orphaned files
  - **Drift** — same pattern implemented N different ways across modules (error handling, loading states, API calls)
  - **Duplication** — same logic in N places, often with small variations that obscure they're the same
  - **Misnamed** — names that lie about what the code does (function name no longer matches behaviour, file in wrong directory)
  - **Oversized** — files or functions that grew past their original purpose


### Lens 2: Architectural (boundaries and dependencies)

More expensive to evaluate, more expensive to fix. Apply sparingly — over-architecting a small app is its own debt.

  - **Module boundaries** — what depends on what, and does the dependency direction make sense (leaves depending on roots, not the other way around)
  - **Cohesion** — do things in the same module belong together, or did the module become a junk drawer
  - **Coupling** — modules that should be independent but reach into each other
  - **State placement** — state that lives in the wrong layer (component state that should be in a store, global state that should be local)
  - **Side effect placement** — effects scattered through pure logic, or pure logic tangled with effects

> **See also:**
> - `study-software-design.md` — APOSD primitives applied to your files (comprehension artifact). Use to **understand** the named primitive being violated and the conceptual fix.
> - `audit-software-design.md` — same 8 AOSD lenses as study-software-design, action-shaped. Produces per-finding refactor specs at `.aipe/specs/refactors/design-*.md`. Use to **act** on AOSD-flagged findings.
>
> This Lens 2 overlaps with `audit-software-design`'s lenses on architectural findings. `/aipe:audit` runs them in order (cleanup before software-design); audit-software-design dedupes against the just-written cleanup file to avoid duplicating refactor specs for the same finding.


### Lens 3: DSA hot-paths

Narrow lens. Only matters for code that actually runs often or on data that's grown. Don't apply this to cold code.

  - **Wrong data structure for access pattern** — array where you need a map, repeated linear scans on data that's now large
  - **Quadratic where linear is possible** — nested loops over the same data, especially if input size has grown
  - **Redundant traversals** — multiple passes over the same data that could be one pass
  - **Recomputation** — same derived value computed every render or every call when it could be cached at a clear boundary


### Lens 4: Test debt

Often forgotten in cleanup. Bad tests are worse than no tests because they lie about coverage.

  - **Missing** — load-bearing code with no tests
  - **Wrong level** — unit tests doing integration work, or integration tests asserting unit-level details
  - **Redundant** — multiple tests covering the same path, none covering the edges
  - **Brittle** — tests that break on cosmetic changes, indicating they're testing implementation not behaviour
  - **Lying** — tests that pass but don't actually exercise the code path they claim to


> 💾 Save output → .aipe/audits/cleanup-[date].md


## Step 3 — Score and decide

Every finding gets three fields. Without these, the list is just complaining.


```
## [Finding name]

**Lens:** structural | architectural | dsa | test

**Severity:** low | medium | high
  - low: cosmetic, doesn't compound
  - medium: slows future work, makes bugs more likely
  - high: actively causing bugs, blocking changes, or growing fast

**Effort:** S | M | L
  - S: under an hour, one file
  - M: half day, a few files
  - L: a day or more, or touches many files

**Decision:** fix-now | fix-later | accept | cannot-clean

**Refactor-shape:** [one sentence — what does the behaviour-preserving
change look like? if you can't write this sentence, the item is
cannot-clean and needs feature work instead]
```


> Fix-now items: high severity, S or M effort.
> Fix-later items: medium severity, any effort — track but don't act.
> Accept items: low severity, or L effort with unclear payoff — document and move on.
> Cannot-clean items: behaviour change required — exit cleanup, file as feature work.


## Step 4 — Triage to fix-now list

Pull only the fix-now items into the next step. Resist expanding this list. A cleanup session that tries to fix everything will either drag on or quietly change behaviour to make the work tractable — both bad outcomes.


```
"From .aipe/audits/cleanup-[date].md, list only
fix-now items. For each, draft the refactor spec
stub: what to refactor, why, target structure.
Stop there — don't fill in must-not-change yet."
```


> 💾 Save each stub → .aipe/specs/refactors/cleanup-[name].md
> (Step 5 will rewrite the path with a prefix based on the chosen
>  template: `cleanup-[name].md` for general, `cleanup-frontend-[name].md`
>  for frontend-behaviour, `cleanup-visual-[name].md` for frontend-visual.)


## Step 5 — Complete each refactor spec

For each stub, fill in the rest using the **right template** for the finding shape. Three templates, three sets of invariants:

```
  finding shape                              → template
  ──────────────────────────────────────────────────────────────────
  logic only (no UI surface touched)         refactor.md
                                              floor invariants: API
                                              stays identical, no
                                              behaviour change

  UI surface — state / effects / components /  refactor-frontend-behaviour.md
  data flow / event semantics / a11y          extends refactor.md +
                                              pixels stay identical,
                                              event order identical,
                                              a11y identical, framework
                                              context named

  visual surface only — CSS / design tokens / refactor-frontend-visual.md
  semantic HTML (no behaviour change)         extends behaviour variant
                                              + tightest rule: pixels
                                              identical AND no new user
                                              capability
```

Pick the **tightest applicable template** — visual is the floor of last resort for pure styling refactors; behaviour wraps anything with state/effects/events; general handles everything else. If a finding spans multiple shapes (e.g., extracting a hook AND restyling its consumer), split into two specs and pick one template per spec.

The "must not change" and "must not introduce" sections are where the cleanup audit's strict-handoff promise gets enforced — if you find yourself wanting to change behaviour to make the refactor cleaner, stop and re-file the item as feature work.

> The single highest-leverage discipline in cleanup: if the refactor wants to grow past behaviour-preserving, abandon it. Half a cleanup that changed behaviour is worse than no cleanup, because you've now made the code different without a feature reason and lost the ability to bisect.


## Step 6 — Execute one at a time

Same pattern as feature work. One refactor spec per Claude Code session. Run the existing tests before and after — that's the contract.

> Never batch cleanup refactors into one session. Even if each is small, the combined diff destroys your ability to attribute a regression. Cleanup compounds bugs faster than feature work because nothing's supposed to have changed.


```
"Read .aipe/project/context.md and
.aipe/specs/refactors/cleanup-[name].md.
Refactor as specified. Do not change behaviour.
Do not touch anything outside the listed scope."
```


## Step 7 — Update context

After all fix-now items are done, update context.md. Note what was cleaned, what was accepted, and what got punted to feature work. The accepted-and-deferred list is important — next cleanup audit starts from there.


```
"Update .aipe/project/context.md — cleanup pass complete.
Mark cleaned modules as stable. List accepted debt and
deferred items so the next audit doesn't re-discover them."
```


## When NOT to run this

  - Mid-phase, while features are in flight — you'll create merge conflicts and lose your bearings on what changed why
  - Before you have tests on the code you want to clean — refactor without tests is rewrite
  - When you're frustrated with the codebase — frustration-driven cleanup turns into behaviour changes
  - On code you're about to delete or replace anyway
