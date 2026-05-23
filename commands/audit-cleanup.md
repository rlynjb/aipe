---
description: Triaged debt list — diagnose code health, decide what to fix, what to accept, what to defer
argument-hint: <optional scope...>
---

The user invoked `/aipe:audit-cleanup` with optional scope: `$ARGUMENTS`.

`$ARGUMENTS` is optional. If empty, scan the whole codebase. If supplied, narrow the multi-lens scan to that area (e.g., "auth module", "frontend only").

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does NOT exist in the current working directory:

1. Create `.aipe/project/` and `.aipe/audits/` directories.
2. Write `.aipe/project/context.md` with this placeholder body:

   ```
   # Project context

   Describe this codebase so an AI agent can implement against it without asking.

   ## Stack
   - runtime, framework, language

   ## Data model
   - entities, relationships, where they live

   ## File structure
   - top-level folders and what lives where

   ## What must not change
   - public API surface, schema fields, ...
   ```

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:audit-cleanup.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)

## Step 3 — Load the `audit-cleanup` template

Read the template at:

```
${CLAUDE_PLUGIN_ROOT}/specs/audit-cleanup.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/audit-cleanup.md` upward from this file's location.

## Step 4 — Run the multi-lens scan

Apply the procedure in the loaded template. Run the codebase through **four distinct lenses** in one pass — structural, architectural, DSA hot-paths, and test debt. Each lens finds different problems; mixing them up means missing things.

The non-negotiables from the template:

1. **Cleanup audits are backward-looking and health-driven**, not phase boundaries. Don't conflate this with `/aipe:audit` — that's describe-only; this one diagnoses and triages.
2. **Every finding gets four fields**: `**Lens:**` (structural / architectural / dsa / test), `**Severity:**` (low / medium / high), `**Effort:**` (S / M / L), `**Decision:**` (fix-now / fix-later / accept / cannot-clean), plus `**Refactor-shape:**` — one sentence describing the behaviour-preserving change. **Without these fields the list is just complaining.**
3. **Lens 2 (architectural) is expensive to evaluate and expensive to fix.** Apply sparingly — over-architecting a small app is its own debt. Don't blanket-recommend Extract Module for everything.
4. **Lens 3 (DSA hot-paths) is narrow.** Only flag perf issues for code that actually runs often or on data that's grown. Cold code with "the wrong" data structure is a non-issue, not a finding.
5. **Decision rubric is non-negotiable:**
   - **fix-now** = high severity + S or M effort
   - **fix-later** = medium severity (any effort) — track, don't act
   - **accept** = low severity, or L effort with unclear payoff — document and move on
   - **cannot-clean** = item requires behaviour change to clean up → exit cleanup, file as feature work
6. **The Refactor-shape sentence is the gate to fix-now.** If you can't write one sentence describing the behaviour-preserving change, the item is `cannot-clean`. Don't fudge this — items that pretend to be refactors but secretly require behaviour change are how cleanup sessions silently break things.
7. **Save outputs to the paths the spec dictates** — see Step 5.

## Step 5 — Save outputs

The cleanup audit produces two artifacts, written separately:

**Artifact 1 — The triaged debt list:**

Compute the date: `<YYYY-MM-DD>` (today, local time).

Path: `.aipe/audits/cleanup-<YYYY-MM-DD>.md`

If that file already exists, append an ISO time suffix: `.aipe/audits/cleanup-<YYYY-MM-DD>T<HH-MM-SS>.md`. **Never overwrite.**

Body: every finding with the five labelled fields. Group by lens. Order each lens's items by severity (high → low).

**Artifact 2 — Refactor spec stubs for fix-now items:**

For each finding with `Decision: fix-now`, write a stub at:

```
.aipe/specs/refactors/cleanup-<slug>.md
```

Where `<slug>` is derived from the finding name (lowercase, kebab-case, ≤60 chars). The stub contains the `## What to refactor`, `## Why`, and `## Target structure` fields from the matching refactor spec format — leave `## Must not change` and `## Must not introduce` blank for the user to complete via `/aipe:refactor` in a separate session.

If a stub path collides, append the ISO time suffix as above.

## Step 6 — Report + stop

Print exactly:

```
✓ Cleanup audit saved to .aipe/audits/cleanup-<YYYY-MM-DD>.md
  fix-now stubs:  <count> at .aipe/specs/refactors/cleanup-*.md
  fix-later:      <count> tracked in the audit
  accept:         <count> documented in the audit
  cannot-clean:   <count> handed off to feature work
```

Then a short summary (3–5 sentences) — which lens produced the most fix-now items, what stood out, any cannot-clean items the user might not have realized require feature work.

**Stop. Wait for the user's next instruction.** Do NOT auto-execute any of the fix-now refactors. Do NOT batch them in one session — the spec is explicit that cleanup compounds bugs faster than feature work because nothing's supposed to have changed. The user runs each refactor as its own `/aipe:refactor` session.
