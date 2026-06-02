---
description: Per-branch code review — Intent → Shape → Architecture → Correctness → Craft on the current branch's diff vs base
---

The user invoked `/aipe:code-review`.

This command reviews the **current branch** against its base. It takes one optional argument: the base branch (default: `main`, falling back to `master` if `main` is absent).

```
/aipe:code-review           → review current branch vs main
/aipe:code-review develop   → review current branch vs develop
```

Every run is a fresh review. There is no CREATE/UPDATE mode — `code-review` produces a per-branch artifact, not a long-lived per-repo guide. The output is a single review report; cross-link to `study-*` and `audit-*` guides for codebase-wide observations rather than restating them.

## Step 1 — Load context

Read these files (skip missing ones — none are required for a code review, but they sharpen findings when present):

- `.aipe/project/context.md` (project conventions)
- `.aipe/project/rules.md`
- `.aipe/project/stack.md`
- `~/.config/aipe/global/identity.md`
- `~/.config/aipe/global/rules.md`
- `~/.config/aipe/global/stack.md`
- `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`, `.dev/*` at the repo root

`code-review` does NOT require `.aipe/project/context.md` to exist. Do not scaffold `.aipe/` if it is missing — proceed without it.

## Step 2 — Load the template chain

Code review reads five files in order — structure, voice, reader, protocol, then the spec:

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/prompts/pr-review-protocol-v2.md
${CLAUDE_PLUGIN_ROOT}/specs/code-review.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset, search upward from this file's location.

Precedence when files overlap: `format.md` wins on structure; `teacher.md` wins on voice; `me.md` wins on reader calibration; `pr-review-protocol-v2.md` wins on **what to check per lens**; `code-review.md` wins on **how to frame and report findings**.

## Step 3 — Resolve branch and base

- Current branch: `git branch --show-current`. If this is `main` / `master` or detached HEAD, **stop** and ask the user which branch to review.
- Base branch: the argument if provided; otherwise `main`, falling back to `master`. If neither exists, ask the user.
- Merge base: `git merge-base <base> HEAD`. If the branches have diverged in unexpected ways (no common ancestor, base is ahead of HEAD), report it and ask before proceeding.

## Step 4 — Gather inputs

Per `pr-review-protocol-v2.md` § Inputs to gather first:

```
git log <base>..HEAD --oneline
git diff <base>...HEAD --stat
git diff <base>...HEAD --name-only | xargs -I {} dirname {} | sort -u
```

Read the PR description / ticket from (in order):
- `.github/PULL_REQUEST_TEMPLATE.md` (for context on what's expected)
- Commit messages (especially the first commit's extended message)
- `PR_BODY.md`, `CHANGES.md` at the repo root
- An open PR for this branch via `gh pr view` if available

If PR intent is unclear after gathering, **stop and ask the user** what the PR is meant to accomplish. Do not proceed to the lens walk.

## Step 5 — Build the Branch context block

Per `specs/code-review.md` § The branch-context block, answer in order:

```
Branch          <branch> → <base>
Task            one sentence: what does this branch try to do?
Source          ticket | PR body | commit message | inferred from diff
Confidence      stated | inferred
Files changed   <count>  (+<adds> / -<dels>)
Commits         <N>
Layers touched  ui · state · data · api · config · tests · deps · migrations
Risk surface    migration · dep bump · auth · public API · config · env vars · schema change — or "none"
```

If `Source: inferred from diff` AND the diff is non-trivial (more than a handful of lines or touches more than one layer), **stop**. Print the inferred Branch context block and ask the user to confirm or correct the Task before walking the lenses.

This block is the single source of truth for what the branch is FOR. Every Pass-1 and Pass-2 finding ties back to it.

## Step 6 — Walk the lenses in order

Walk the five lenses from `pr-review-protocol-v2.md` in order: **Intent → Shape → Architecture → Correctness → Craft**. Finish each lens before starting the next — problems found higher up make lower-level findings irrelevant.

Honor the protocol's per-lens **blocking conditions**: if a lens fires a blocking condition, halt and report. Do not proceed to the next lens.

Collect findings; do not emit them mid-pass. Rank per lens (verdict-first: name the worst issue first). Assign severity on Pass 4 (`blocking` / `important` / `minor`). Tag Pass 5 as `nit:` or `suggestion:` (always non-blocking).

Ground every applied claim in a real `file:line` range inside the diff. Use `git grep` to read callers of changed functions when needed. Do not run tests, install dependencies, or execute the code unless the user explicitly asks — this is a read-only review.

## Step 7 — Emit the report

Per `specs/code-review.md` § Output. Write the report to STDOUT (the agent's conversation). If `.aipe/reviews/` exists, also save a copy to `.aipe/reviews/<branch>-<YYYY-MM-DD>.md`. Do not create `.aipe/reviews/` unless the user explicitly asks.

Structure:

```
# PR Review: <one-sentence summary>

## Branch context
<the block from Step 5, plus Verdict>

## Summary
<2–4 sentences: what the PR does, what's good, what's concerning; verdict-first>

## Blocking issues
<empty if none; each item: pass number, location, problem, suggested resolution>

## Findings by pass
### Pass 1 — Intent
### Pass 2 — Shape
### Pass 3 — Architecture          (grouped by category)
### Pass 4 — Correctness            (grouped by severity)
### Pass 5 — Craft                  (all nit: / suggestion:)

## Questions for the author
<genuine uncertainty only — not questions whose answers the diff makes obvious>

## Praise
<specific good decisions — not generic encouragement>
```

A small PR will not exercise every lens. Emit `no findings` honestly per lens — never manufacture a finding to fill the section. Match weight to evidence: the highest-stakes lens gets the most ink.

**Stop after the report. Wait for the user's next instruction.**
