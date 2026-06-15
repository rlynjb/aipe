---
description: Action-shaped AOSD audit — walks 8 design lenses; produces a dated audit summary + per-finding refactor specs at .aipe/audits/refactors/design-*.md
---

The user invoked `/aipe:audit-software-design`.

This is the **action-shaped** counterpart to `/aipe:study-software-design`. Same 8 AOSD lenses, but the output is a triaged audit summary + per-finding refactor specs (one per firing red flag) — not a teaching artifact.

```
/aipe:audit-software-design   → walk 8 lenses; generate refactor specs
```

Also invoked by `/aipe:audit` as the 5th generator. The two flows are interchangeable — both produce the same artifacts.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does not exist, create `.aipe/project/`, `.aipe/audits/`, and `.aipe/audits/refactors/`, write a short project-context placeholder, print `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:audit-software-design.`, and stop.

If `.aipe/project/context.md` exists, ensure `.aipe/audits/` and `.aipe/audits/refactors/` exist (mkdir if needed).

## Step 2 — Load context

Read `.aipe/project/context.md`, optional `.aipe/project/rules.md`, optional `.aipe/project/stack.md`, and optional matching files under `~/.config/aipe/global/`.

Also read (skip if missing):
- `.aipe/audits/cleanup-<latest>.md` — for dedup against audit-cleanup fix-now items
- `.aipe/study-software-design/audit.md` — for cross-link material (the comprehension half)

## Step 3 — Load the template chain

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/audit-software-design.md
${CLAUDE_PLUGIN_ROOT}/specs/refactor.md
${CLAUDE_PLUGIN_ROOT}/specs/refactor-frontend-behaviour.md
${CLAUDE_PLUGIN_ROOT}/specs/refactor-frontend-visual.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location. The three refactor templates are loaded because Step 5 routes per-finding spec generation to one of them based on finding shape.

## Step 4 — Walk the 8 AOSD lenses

Per `specs/audit-software-design.md` lens inventory. For each lens, identify firing red flags with `file:line` grounding. Honest emission: "no findings" for a lens rather than padding with weak observations.

```
  1. complexity-in-this-codebase
  2. deep-vs-shallow-modules
  3. information-hiding-and-leakage
  4. layers-and-abstractions
  5. pull-complexity-downward
  6. errors-and-special-cases
  7. readability
  8. red-flags-audit (capstone)
```

Build an inventory: lens → findings → (location, severity, shape, fix-direction). Classify finding shape now (logic / UI behavior / CSS-HTML) so Step 5's template routing has the input.

## Step 5 — Dedupe against audit-cleanup

If `.aipe/audits/cleanup-<latest>.md` exists, cross-check each finding against its fix-now list. For overlaps:
- The audit summary (Step 6) lists the finding under the AOSD lens that caught it AND cross-links to the existing `cleanup-*.md` spec.
- No duplicate `design-*.md` spec is generated for that finding.

## Step 6 — Generate the dated audit summary

Write `.aipe/audits/design-<YYYY-MM-DD>.md`. Structure: 8 `##` sections (one per lens). Each section lists findings with:
- **Location** (`file:line`)
- **Severity** (low / medium / high)
- **Refactor-spec path** (or "no spec — see note" with reason: behaviour-change-required / not-localized / duplicate-of-cleanup)
- **Cross-link** to `study-software-design` Pass-2 file if applicable

Final section: top-3 highest-leverage findings ranked across all lenses (severity × ease-of-fix), for the executor to start with.

## Step 7 — Generate per-finding refactor specs

For every finding that earned a spec (passes Step 5 of `audit-software-design.md`: behaviour-preserving + specific + localized), write a refactor spec at the right path:

```
  finding shape           template                             path
  ─────────────────────────────────────────────────────────────────────────────
  logic / module          refactor.md                          design-<name>.md
  UI behavior             refactor-frontend-behaviour.md       design-frontend-<name>.md
  CSS / tokens / HTML     refactor-frontend-visual.md          design-visual-<name>.md
```

Pick the **tightest applicable template**. Fill in every section (What/Why/Refactor type/Current/Target/Must not change/Must not introduce/Done when) — the spec is the contract the executor session uses. Track counts by template type for the report.

## Step 8 — Report

Print:

```
✓ audit-software-design complete
  audit summary:        .aipe/audits/design-<date>.md
                        (8 lenses; <N> firing red flags total)
  refactor specs:       .aipe/audits/refactors/design-*.md
                        (<N> total: <N> general, <N> frontend, <N> visual)
  highest-leverage:     design-<slug>.md (start here)

Next: review the audit summary; pick a spec; hand to a separate
      session to execute (one refactor per session).
```

**Stop. Wait for the user's next instruction.**
