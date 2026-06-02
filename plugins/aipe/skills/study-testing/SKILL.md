---
name: study-testing
description: Testing & correctness audit for this codebase — coverage, design quality, isolation, flakiness, the AI-eval seam
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

The user invoked `/aipe:study-testing`.

This command takes **no arguments**. There is one testing guide per repo, saved at the fixed path `.aipe/study-testing/`. `.aipe/` is per-repo; the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused study generator that audits the **current repo**'s tests: what's covered and what isn't, whether the test design is sound, where untestable code signals a design problem, how the suite holds up (flakiness, isolation). Findings grounded in real files.

**Partition (the AI-eval seam):**
- `study-testing` — **DETERMINISTIC correctness**: given known input, assert known output. Unit / integration / property. ← this command.
- `study-ai-engineering` — **evals** (probabilistic evaluation of model/LLM output — eval sets, LLM-as-judge, regression).
- `study-software-design` — "hard to test" as a design smell; cross-link, don't duplicate.

The seam that matters is **determinism**. If the assertion is "equals the expected value," it's testing → here. If the assertion is "is good enough / didn't regress on a non-deterministic output," it's evaluation → `study-ai-engineering`. They MEET when you test an AI feature: a deterministic harness (here) wrapping a probabilistic core (there) — state which half a finding is.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does NOT exist in the current working directory:

1. Create `.aipe/project/` and `.aipe/specs/` directories.
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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-testing.`
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

## Step 3 — Load the template chain

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-testing.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the 11-block concept-file template, formatting + diagram + pseudocode + hard rules.
- **`teacher.md`** — writer persona in teacher posture.
- **`me.md`** — reader calibration.
- **`study-testing.md`** — the topic (testing concepts), the anchoring rules, the determinism seam.

## Step 4 — Detect existing guide → CREATE or UPDATE

Check `.aipe/study-testing/` for `00-overview.md`, `audit.md`, or any concept file matching `0[1-9]-*.md`. Existing → UPDATE; missing → CREATE.

Also check for the **legacy fixed-file-list layout** — files named after the 7 audit lenses: `01-what-is-tested-and-what-isnt.md`, `02-test-design-and-levels.md`, `03-tests-as-design-pressure.md`, `04-determinism-isolation-and-flakiness.md`, `05-edge-cases-and-error-paths.md`, `06-testing-ai-features.md`, `07-testing-red-flags-audit.md`. Older runs produced one file per lens; the current shape consolidates the lens walk into a single `audit.md` and reserves numbered files for discovered patterns (`me.md` → AUDIT-STYLE GENERATORS). If any of these lens-named files exist, flag them in the plan and ask whether to (a) fold their content into a regenerated `audit.md` and break out true Pass-2 pattern files, or (b) leave them in place as an archive. Do not silently rewrite or delete them.

---

# CREATE MODE

## Step 5C — Audit pass (read-only)

Walk the codebase as a test auditor: locate untested critical paths, identify wrong-level tests (unit-asserting-implementation, integration-asserting-unit details), find flakiness sources (timing, randomness, shared fixtures), spot code that's hard to test as a design signal. Build an inventory of findings anchored to `file:line` ranges.

## Step 6C — Plan the guide

Non-negotiables:

1. **All structural rules from `format.md` apply** — the 11-block per-concept template.
2. **Implementation in codebase is the heavy block** — real files, real tests (or their absence), the specific fix per finding. Every finding cites `**File:**` + `**Function / class:**` + `**Line range:**`.
3. **State which side of the determinism seam every finding is on.** If a test asserts an exact value → testing (here). If it asserts a "good enough" threshold on a probabilistic output → eval (cross-link to `study-ai-engineering`).
4. **Honest assessment.** If a project has no tests, say so plainly — don't fabricate a coverage report. Name what the first three tests should be and why.
5. **"Hard to test" is a design signal, not a testing finding.** Note it briefly and cross-link to `study-software-design`'s deep-vs-shallow modules; don't re-audit it.
6. **No project names in generated output except the studied repo.**

## Step 7C — Create the directory and generate the guide

Follow the two-pass shape defined in `specs/me.md` → AUDIT-STYLE GENERATORS and the lens inventory in `specs/study-testing.md`.

Create:

```bash
mkdir -p .aipe/study-testing
```

Generate the following (flat — no subdirectories):

```
README.md                          map + through-line + deterministic-vs-eval seam + reading order
00-overview.md                     master summary + the three highest-leverage gaps
audit.md                           Pass 1 — the 7-lens audit walking each testing lens
01-<discovered-pattern>.md         Pass 2 — discovered testing techniques the repo applies deliberately,
02-<discovered-pattern>.md                   named after the technique (kebab-case), one per technique,
0N-<discovered-pattern>.md                   3-8 files for a typical repo
```

**Pass 1 (`audit.md`)** walks all 7 lenses from the spec, each as one `##` section. Each lens names what the codebase actually does with `file:line` grounding, or `not yet exercised` honestly. The `06-testing-ai-features` lens emits `not yet exercised` for repos without AI/LLM surface. The capstone lens (`07-testing-red-flags-audit`) consolidates the red-flag checklist. When a finding is significant enough to have its own pattern file, the lens cross-links to it rather than restating the deep walk.

**Pass 2 (discovered-pattern files)** uses the full `format.md` per-concept template. State which side of the determinism seam each pattern lives on. Pattern file names come from the repo, not from the lens inventory — see `me.md` → AUDIT-STYLE GENERATORS → "What earns its own pattern file" for the discovery rules.

## Step 8C — Generate `00-overview.md`

The audit at a glance: a coverage map (which areas of the repo have tests, which don't), the three highest-leverage gaps (the tests that would catch the most production regressions), and a one-line verdict per lens. Cross-link to `audit.md` for the full lens walk and to each Pass 2 file for the deep walks.

## Step 9C — Report + stop

Print:

```
✓ Testing audit created at .aipe/study-testing/
  README.md
  00-overview.md             (3 highest-leverage gaps named)
  audit.md                   (7 lenses; <N> red flags firing)
  01-<pattern>.md            (Pass 2 — discovered testing technique)
  ...
  0N-<pattern>.md
```

Then a 3–5 sentence summary: the codebase's strongest test-design pattern, the single highest-leverage gap, and any lens that's mostly `not yet exercised`. Name the Pass 2 file list explicitly so the user sees what techniques the repo earned dedicated files for.

**Stop. Wait for the user's next instruction.**

---

# UPDATE MODE

## Step 5U — Read the existing guide

Walk `.aipe/study-testing/` and read every file (`README.md`, `00-overview.md`, `audit.md`, and each Pass 2 pattern file). If the legacy fixed-file-list layout is present (per Step 4 check), include those files in the walk as the source material to be folded into the regenerated `audit.md`.

## Step 6U — Re-audit and diff

Follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE.

- **Codebase drift** — tests added/removed, fixtures changed, new flaky tests, new uncovered paths, and new testing techniques that now earn their own Pass 2 pattern file.
- **Template drift** — `format.md` blocks added.
- **Cross-reference drift** — pointers to `study-ai-engineering` evals or `study-software-design` design-smell findings.
- **Pattern drift** — Pass 2 pattern files for techniques the repo no longer uses; missing files for techniques the repo added.

Output a structured change plan: `audit.md` regenerated (full diff against current evidence), pattern files added / updated / removed, with reasons per change.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation.** Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Regenerate `audit.md` against current evidence. Add new Pass 2 pattern files for newly-load-bearing testing techniques. Update existing pattern files where the implementation changed. Remove pattern files only when the technique is genuinely gone from the codebase (not just refactored). Append:

```
---
Updated: <today's ISO date> — <one-line summary>
```

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-testing/
─────────────────────────────────────────────────
Files updated:        <list>
Findings added:       <count>
Findings removed:     <count, with one-line reason each>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
