# Audit — Software Design (action-shaped)

Use this when you want an actionable refactor queue from AOSD principles applied to your code — not when you want to read and understand the design shape. Output is a triaged list of design violations + one refactor spec per firing red flag, ready to hand to an executor session.

> **Companion to `study-software-design.md`.** Same 8 lenses, same evidence base, different deliverable. `study-software-design` produces a comprehension artifact (audit.md + Pass-2 pattern files; named primitive being violated + the fix as prose). `audit-software-design` produces refactor specs at `.aipe/specs/refactors/design-*.md` you can execute one at a time. Run study to understand; run this to act. `/aipe:audit` invokes this one so taking stock produces action material.

`/aipe:audit` invokes this as the 5th generator. Also runnable standalone via `/aipe:audit-software-design`.

═════════════════════════════════════════════════
WHERE THIS SITS — partition
═════════════════════════════════════════════════

```
  audit-cleanup            general code-health triage (4 lenses:
                            structural / architectural / DSA /
                            tests). Lens 2 overlaps with this spec
                            on architectural findings; cross-link.
  audit-software-design    AOSD primitives applied to your code     ← here
                            (8 lenses: complexity, deep-vs-shallow,
                            info-hiding, layers, pull-down, errors,
                            readability, red-flags-audit). Action-
                            shaped: refactor specs per firing flag.
  audit-refactor           staff-engineer opinion book (six chapters,
                            takes not tasks). Different deliverable
                            entirely — read for perspective, not
                            for action material.
  study-software-design    SAME 8 lenses as this spec, comprehension
                            output. Run to understand; run this
                            to act on the same evidence.
```

If a finding is purely about general code health (dead code, drift, duplication), it belongs to `audit-cleanup` Lens 1. If it's architectural in a generic sense (module boundaries, cohesion, coupling), it belongs to `audit-cleanup` Lens 2. If it's specifically about an AOSD principle being violated (a module is shallow, knowledge is leaking across boundaries, a layer doesn't earn its place), it belongs here. The cross-reference between audit-cleanup Lens 2 and this spec is bidirectional.

═════════════════════════════════════════════════
THE LENS INVENTORY (same as study-software-design)
═════════════════════════════════════════════════

Walk the codebase against this ordered 8-lens inventory. Each lens carries the AOSD red flag(s) that fire it. For every firing flag, produce a refactor spec in Step 5.

```
  1. complexity-in-this-codebase
       the diagnostic overview. Locate where change amplifies,
       cognitive load spikes, unknown-unknowns hide.
       red flag: complexity hotspot.

  2. deep-vs-shallow-modules
       inventory modules by depth (functionality ÷ interface size).
       Name the shallowest (worst — interface nearly as complex as
       the body; classitis).
       red flag: shallow module, classitis.

  3. information-hiding-and-leakage
       find decisions that leak — a fact known in two modules that
       forces them to change together; temporal decomposition;
       config that exposes internals.
       red flag: information leakage, same knowledge edited twice.

  4. layers-and-abstractions
       find pass-through methods and pass-through variables;
       adjacent layers offering the same abstraction.
       red flag: pass-through method/variable, layer not earning
       its place.

  5. pull-complexity-downward
       find knobs/parameters pushed up to callers that the module
       had enough information to decide itself.
       red flag: avoidable config exposed to users.

  6. errors-and-special-cases
       find exception handling scattered across call sites and
       special cases a different definition would erase.
       red flag: try/except everywhere, special-case sprawl.

  7. readability
       names · comments · consistency · obviousness. Vague names,
       comments that restate code, two conventions for one job,
       hidden control flow.
       red flag: one per facet.

  8. red-flags-audit
       capstone lens. Ousterhout's red flags as a checklist marked
       against this repo: fires / doesn't / N/A.
```

═════════════════════════════════════════════════
WHAT EARNS A REFACTOR SPEC
═════════════════════════════════════════════════

Not every observation becomes a refactor spec. A finding earns a spec when ALL of these hold:

  → The fix is **behaviour-preserving** (a true refactor, not a feature change). If fixing it requires changing what the code does, file as feature work instead.
  → The fix is **specific** — you can name what to change, where, and the target structure. "Improve cohesion" is not specific; "extract `validateInputs` from `processOrder` into a private method" is.
  → The fix is **localized** — one technique, one boundary. If a finding needs three refactors to address, file three specs (one technique per spec — same discipline as `refactor.md`).

Observations that DON'T meet these criteria stay in the audit summary (`design-<date>.md`) as documented findings without an executable spec.

═════════════════════════════════════════════════
OUTPUT
═════════════════════════════════════════════════

Two artifacts per run:

```
  .aipe/audits/design-<YYYY-MM-DD>.md     dated audit summary
                                          (analogous to cleanup-<date>.md).
                                          Walks all 8 lenses; lists every
                                          firing red flag with location +
                                          severity + the refactor-spec path
                                          (or "no spec — see note" for
                                          findings that don't earn one).

  .aipe/specs/refactors/design-*.md       one refactor spec per firing
                                          red flag that earned one.
                                          Template chosen by finding shape:

      design-<name>.md             logic / module / interface
                                   (uses refactor.md template)

      design-frontend-<name>.md    UI behavior — state / effects /
                                   components / data flow
                                   (uses refactor-frontend-behaviour.md)

      design-visual-<name>.md      CSS / design tokens / semantic HTML
                                   (uses refactor-frontend-visual.md)
```

The `design-` prefix distinguishes specs from this generator from `cleanup-` specs (from audit-cleanup) and user-invoked `refactor` specs in the same folder. The reader can `ls .aipe/specs/refactors/design-*` to see only the AOSD-driven work.

═════════════════════════════════════════════════
HOW THE RUN EXECUTES
═════════════════════════════════════════════════

```
  1. Resolve inputs
       Read .aipe/project/context.md, optional rules/stack files,
       any existing .aipe/audits/cleanup-<latest>.md (to dedupe
       findings already covered by cleanup) and any existing
       .aipe/study-software-design/ (cross-link material).

  2. Walk the 8 lenses
       For each lens, identify firing red flags with file:line
       grounding. Honest: emit "no findings" rather than padding
       with weak observations.

  3. Dedupe against audit-cleanup
       If a finding here is already a fix-now item in the latest
       cleanup-<date>.md, cross-link to that cleanup spec rather
       than producing a duplicate refactor spec. The audit summary
       still lists the finding under the AOSD lens that caught it.

  4. Generate the dated audit summary
       Write .aipe/audits/design-<YYYY-MM-DD>.md with one ##
       section per lens. Each section: findings with location,
       severity (low/med/high), refactor-spec path (or "no spec —
       see note" with reason).

  5. Generate per-finding refactor specs
       For every finding that earns a spec (Step 2 criteria), write
       .aipe/specs/refactors/design-<name>.md using the right
       template:
         logic        → refactor.md           → design-<name>.md
         UI behavior  → refactor-frontend-    → design-frontend-<name>.md
                        behaviour.md
         CSS/HTML     → refactor-frontend-    → design-visual-<name>.md
                        visual.md
       Pick the tightest applicable template. Fill in all sections
       (What/Why/Refactor type/Current/Target/Must not change/Must
       not introduce/Done when) — the spec is the contract the
       executor session uses.

  6. Report
       Print the audit summary path, the count by template
       (e.g., "12 refactor specs: 8 general, 3 frontend, 1 visual"),
       and the highest-leverage spec to execute first (severity ×
       leverage). End with the single next action: usually "review
       the audit summary; pick a spec; hand to a separate session
       to execute."
```

═════════════════════════════════════════════════
ANCHORING + HONEST ASSESSMENT
═════════════════════════════════════════════════

```
  → Every finding cites file:line. No "this module seems shallow"
    without a path.

  → "No findings" for a lens is a valid result. If the codebase
    doesn't have a layering problem, say so — don't manufacture
    one to fill the section.

  → Behaviour-preserving discipline (inherited from refactor.md):
    if any refactor wants to grow past behaviour-preserving,
    abandon it and re-file as feature work. Half a refactor
    that changed behaviour is worse than no refactor.

  → Dedupe with audit-cleanup. If a finding is already on
    cleanup's fix-now list, don't generate a duplicate spec —
    cross-link instead. The audit summary documents the AOSD
    framing of the same finding without duplicating the action
    artifact.

  → On UPDATE (re-running this generator): regenerate the dated
    audit summary; add new refactor specs for newly firing flags;
    skip flags already covered by an existing design-*.md spec
    in .aipe/specs/refactors/; remove specs only when the
    underlying flag is no longer firing.
```

═════════════════════════════════════════════════
RUNNING IT INSIDE `/aipe:audit`
═════════════════════════════════════════════════

This generator is the 5th step of `/aipe:audit`. The orchestrator runs it after `audit-refactor`, so the design summary (`design-<date>.md`) can reference findings from cleanup, a11y, refactor, and status. The orchestrator surfaces the refactor-spec count by template in its final report.

Also runs standalone via `/aipe:audit-software-design` when only the design dimension changed.
