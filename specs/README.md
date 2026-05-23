# AIPE Specs

A system for AI-assisted app development. Each spec is a prompt template with built-in discipline — constraints that keep Claude (or any AI assistant) from doing more than what was asked.

The specs work together. They're not a menu to pick from; they're a flow with handoffs between them.


## The system at a glance

Three layers of work, each with its own discipline:

```
DESCRIBE        →    DIAGNOSE      →    ACT
(no action)          (triage)            (changes code)

audit.md             audit-cleanup.md    refactor.md
audit-frontend-a11y.md                   refactor-frontend-behaviour.md
                                         refactor-frontend-visual.md
```

  - **Describe** — take stock of what exists. No changes, no proposals, no grading.
  - **Diagnose** — find debt and decide what's worth paying down. Produces a triaged list.
  - **Act** — execute one specific, named change. Behaviour-preserving by default.

Findings flow downward. An audit might surface debt → a cleanup audit triages it → a refactor spec executes the fix. The discipline is in **not skipping layers** — acting without diagnosing leads to scope creep; diagnosing without describing leads to fixing the wrong things.


## "I want to..." — which spec?


### Take stock of a project

You don't want to fix anything yet. You want to know what's there.

  - General codebase snapshot → **audit.md**
  - Accessibility state of a frontend → **audit-frontend-a11y.md**

Common reasons: coming back after time away, writing portfolio descriptions, briefing an interviewer, periodic check-ins.


### Clean up accumulated debt

You can feel the codebase getting heavy. You want to fix what's worth fixing, accept the rest, and move on.

  - **audit-cleanup.md** — produces a triaged debt list, then hands off to refactor specs

Common signs: hesitating before touching certain files, finding the same logic in three places, names that no longer match what the code does.


### Restructure code without changing what it does

You know what you want to change. Behaviour stays identical.

  - Any code, any language → **refactor.md**
  - Frontend behaviour and structure (state, effects, components, data flow) → **refactor-frontend-behaviour.md**
  - Frontend visual surface (CSS, design tokens, semantic HTML) → **refactor-frontend-visual.md**

Use the most specific spec that applies. The frontend specs extend `refactor.md` — read it first, then layer the specific one on top.


### Add capability or fix bugs

These aren't in this system yet. Use feature specs or fix mini-specs (referenced by the audits, but not provided here as templates).

If an audit surfaces something that requires *new behaviour* (adding keyboard navigation, fixing a real bug, building a new screen), that's not a refactor — it's feature work. The audits explicitly hand it off rather than trying to do it themselves.


## How the specs hand off to each other

```
audit.md  ────────────────►  identifies debt
                                    │
                                    ▼
                             audit-cleanup.md  ─────►  triages, fix-now list
                                                              │
                                                              ▼
                                                       refactor.md
                                                       refactor-frontend-behaviour.md
                                                       refactor-frontend-visual.md

audit-frontend-a11y.md  ────►  identifies a11y gaps
                                    │
                                    ├──►  new capability needed  →  feature spec
                                    ├──►  broken behaviour       →  fix mini-spec
                                    └──►  semantic markup change →  refactor-frontend-visual.md
```

The arrows are one-way. Refactors don't loop back to audits; audits don't execute refactors. Each spec stays in its layer.


## Why the constraints matter

Every spec has a "must not change / must not introduce / what this does not do" section. These exist because AI assistants will, by default, do more than what's asked. Without explicit constraints:

  - **Refactors** turn into rewrites — Claude "improves" things you didn't ask about
  - **Audits** turn into action plans — Claude finds problems and starts fixing them
  - **Cleanup** turns into scope creep — one fix becomes five, behaviour changes silently

The discipline is what makes the specs useful. If you find yourself softening the constraints to make a task work, you've picked the wrong spec.


## Conventions

  - **One spec per session.** Don't combine refactor types or audit lenses across a single Claude Code session.
  - **Save outputs to predictable paths.** Each spec specifies where its output goes (`.aipe/audits/`, `.aipe/specs/refactors/`). Keeping these consistent makes the history searchable later.
  - **Reference, don't duplicate.** When you write a spec instance (a real refactor or audit), reference the template, don't copy its rules into the instance.
  - **Update context.md after major changes.** The audits write to dated snapshots; `.aipe/project/context.md` is the living document that should reflect the current state.


## Spec reference

| Spec | Layer | Scope | Best for |
|------|-------|-------|----------|
| `audit.md` | Describe | Any codebase | Snapshots, onboarding, portfolio writing, interview prep |
| `audit-frontend-a11y.md` | Describe | Frontend a11y | Finding accessibility gaps without committing to fix them |
| `audit-cleanup.md` | Diagnose | Any codebase | Producing a triaged debt list with explicit fix/accept/defer decisions |
| `refactor.md` | Act | Any code, language-agnostic | Named, behaviour-preserving restructures |
| `refactor-frontend-behaviour.md` | Act | Frontend behaviour | State placement, effects, components, data flow, perf |
| `refactor-frontend-visual.md` | Act | Frontend visuals | CSS organization, design tokens, semantic HTML |


## Reading order if you're new to this

  1. **refactor.md** — establishes the discipline (must-not-change / must-not-introduce). Everything else inherits from this.
  2. **audit.md** — the describe-don't-act discipline. Mirrors refactor.md's constraint style at a different layer.
  3. **audit-cleanup.md** — how diagnosis bridges describe and act.
  4. The frontend specs — once you've internalized the general patterns, the frontend ones are extensions.

> The specs are designed to be read in this order, but used in any order. Reading order builds the mental model; usage depends on what you're trying to do.
