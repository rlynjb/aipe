---
description: Non-functional requirements audit for this codebase — cross-cutting NFR posture (reliability, scalability, maintainability, latency, availability, security, observability, cost) grounded in real code, config, and infra; cross-links to deep-walk sibling specs
---

The user invoked `/aipe:study-nonfunctional-requirements`.

This command takes **no arguments**. There is one NFR guide per repo, saved at the fixed path `.aipe/study-nonfunctional-requirements/`. `.aipe/` is per-repo; the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused study generator that audits the **current repo** against the cross-cutting **non-functional requirements** defined in *Designing Data-Intensive Applications, 2e* Chapter 2: reliability (fault tolerance), scalability (load parameters + ceilings), and maintainability (operability + simplicity + evolvability). Plus the operational NFRs that a modern spec must cover: latency budgets, availability posture, security / privacy / compliance boundaries, observability, and cost constraints. Also anchors the functional-requirements side — what features the codebase actually implements. Per-lens findings grounded in real files, config, and infra.

**Partition (no overlap with sibling specs — this spec cross-links out):**
- `study-nonfunctional-requirements` — the **cross-cutting NFR audit** at the codebase level (this command). One page, all NFRs, verdict per lens.
- `study-system-design` — architecture, boundaries, flows, scale ceilings (deep walk of reliability + scalability architecture).
- `study-security` — trust boundaries, auth, PII, dependencies (deep walk of security NFR).
- `study-performance-engineering` — measurement, latency, throughput, cost (deep walk of performance + cost NFRs).
- `study-debugging-observability` — logs, metrics, traces, incidents (deep walk of observability NFR).
- `study-testing` — test design, coverage, flakiness, evals (deep walk of reliability testing).
- `study-software-design` — module quality, complexity, layering (deep walk of maintainability at code level).
- `study-distributed-systems` — coordination under partial failure (deep walk of availability under partition).
- `study-data-modeling` — schema, migrations, evolution (deep walk of maintainability's evolvability sub-attribute + DDIA Ch 5).

A finding belongs here when it is a **cross-cutting NFR posture** the codebase either meets or doesn't. Deep mechanics belong in the owning sibling. This spec's audit says "reliability is <verdict> because of <evidence at file:line>"; the sibling spec's audit walks the actual retry / fallback / degradation code.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-nonfunctional-requirements.`
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

Non-functional requirements reads four files in order — structure, writer persona, reader calibration, then the spec itself:

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/study-nonfunctional-requirements.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the concept-file template, house-style traits, diagram rules, pseudocode rules, hard rules. The 9-block per-concept structure (used for Pass 2 pattern files).
- **`teacher.md`** — writer persona in **teacher posture** — same staff engineer, systems-literate. Inherit the banned list and the verdict-first / rank-what-matters trait.
- **`me.md`** — reader calibration: voice register, example anchoring, what the reader already knows. Also supplies the AUDIT-STYLE GENERATORS section that defines the two-pass shape and file layout.
- **`study-nonfunctional-requirements.md`** — the topic (which NFRs are lenses), the partition seams with deep-walk siblings, the anchoring rules (every NFR verdict cites file + line range), the honest-assessment rules (never fabricate an NFR the codebase doesn't meet).

Precedence when they conflict: format.md wins on **structure**; teacher.md wins on **voice register**; me.md wins on **calibration**.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-nonfunctional-requirements/` already contains the guide. The signal is the presence of `00-overview.md`, `audit.md`, or any concept file matching `0[1-9]-*.md`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

---

# CREATE MODE

## Step 5C — Audit pass (read-only)

Walk the codebase as an NFR auditor. For each lens in the spec, identify the NFR posture: retries / timeouts / fallbacks in code (reliability), configured load parameters + observed ceilings (scalability), operability surface (deployability, health, on-call) + code-level simplicity (maintainability), timeout budgets in config (latency), availability / security / privacy posture, observability surface, cost instrumentation. Build an inventory of findings, each anchored to `file:line` ranges, config values, schema fields, or infra manifests.

**Read the sibling deep-walk specs' outputs if they exist** in `.aipe/`. When `study-system-design/audit.md` or `study-security/audit.md` (etc.) is present, the NFR verdict for that lens should cross-link into the sibling's specific `##` section rather than re-audit. This spec's job is the cross-cutting view; the deep walk is the sibling's.

This is the heavy work — the framing is brief; the verdicts + evidence are the substance. **No vague claims.** Every "reliability: meets" needs the specific retry / fallback / degradation site cited.

## Step 6C — Plan the guide

The non-negotiables from `format.md` (structure), `teacher.md` (voice), `me.md` (calibration), and this spec (topic):

1. **All structural rules from `format.md` apply** — the 9-block per-concept template (used for Pass 2 pattern files), formatting rules, box-drawing diagram chars.
2. **`audit.md` is the heavy artifact** — 8 `##` sections, one per lens, each with a **verdict line** (pass / meets-partially / not-yet-exercised / gap-with-evidence) followed by **falsifiable evidence** (real files, real config values, real cross-links to sibling specs' deep walks). Every verdict cites `**File:**` / `**Config:**` / `**Sibling audit:**`.
3. **Cross-link, do not re-audit.** When a sibling spec (`study-security`, `study-performance-engineering`, etc.) owns the deep walk of a lens, this spec's `##` section for that lens is a one-paragraph verdict + evidence + cross-link — NOT a re-audit of the mechanics. Cross-linking is the primary content, not filler.
4. **Every NFR verdict is falsifiable.** "Reliability: meets" without evidence is banned. Every verdict names the specific code, config, or infra sites that back it up (or names their absence when the verdict is a gap).
5. **Honest assessment.** If an NFR doesn't apply to this codebase (a single-user CLI has no availability NFR; a static site has no cost NFR), say so plainly in that lens — don't fabricate a finding.
6. **DDIA 2e Ch 2 vocabulary as the through-line.** Reliability / scalability / maintainability (operability + simplicity + evolvability) — use these terms verbatim, per the standard-term-leads rule (see `format.md` HARD RULES). If the codebase has its own local terms, cite them in parens: "the retry policy (`withRetry` at `lib/retry.ts:12`) is the reliability primitive."
7. **No project names in generated output except the studied repo.**

## Step 7C — Create the directory and generate the guide

Follow the two-pass shape defined in `specs/me.md` → AUDIT-STYLE GENERATORS and the lens inventory in `specs/study-nonfunctional-requirements.md`.

Create:

```bash
mkdir -p .aipe/study-nonfunctional-requirements
```

Generate the following (flat — no subdirectories):

```
README.md                          map + through-line + cross-links to every
                                   deep-walk sibling + reading order
00-overview.md                     the NFR verdict table + three highest-cost
                                   NFR gaps + single next action
audit.md                           Pass 1 — the 8-lens NFR audit
01-<discovered-pattern>.md         Pass 2 — discovered NFR patterns the repo
02-<discovered-pattern>.md                   actually exercises (kebab-case name),
0N-<discovered-pattern>.md                   0-8 files (a small repo may have none)
```

**Pass 1 (`audit.md`)** walks all 8 lenses from the spec, each as one `##` section. Each lens names the NFR verdict with `file:line` / config-value / infra-manifest grounding, or `not yet exercised` honestly. When a lens's mechanics live in a sibling spec's audit, this lens's section cross-links into that sibling's specific `##` section rather than re-walking. The capstone lens (`nonfunctional-requirements-red-flags-audit`) consolidates the ranked NFR gaps.

**Pass 2 (discovered-pattern files)** uses the full `format.md` per-concept template. The auditing emphasis lands in How it works Move 2 — real `file:line` references shown side-by-side with annotation, the NFR the pattern meets, and the specific mechanism. Pattern file names come from the repo, not from the lens inventory — see `me.md` → AUDIT-STYLE GENERATORS → "What earns its own pattern file" for the discovery rules.

## Step 8C — Generate `00-overview.md`

The audit at a glance: the **NFR verdict table** (one row per lens: functional-requirements / reliability / scalability / maintainability / latency-and-performance-budgets / availability-security-privacy / observability-and-cost / nonfunctional-red-flags-audit — with pass / meets-partially / not-yet-exercised / gap-with-evidence per row), the three highest-cost NFR gaps (from lens 8) with file paths, and the single next action worth taking. The reader who reads only the overview gets the punch list. Cross-link to `audit.md` for the full lens walk, to each Pass 2 file for pattern deep-walks, and to each deep-walk sibling spec for mechanics.

## Step 9C — Report + stop

Print:

```
✓ Non-functional requirements audit created at .aipe/study-nonfunctional-requirements/
  README.md
  00-overview.md             (verdict table; 3 highest-cost NFR gaps named)
  audit.md                   (8 lenses; <N> gaps flagged)
  01-<pattern>.md            (Pass 2 — discovered NFR pattern)
  ...
  0N-<pattern>.md
```

Then a 3–5 sentence summary: the dominant NFR posture of this codebase (which NFRs it meets well, which are gaps), the single highest-leverage NFR fix, any lens that's mostly `not yet exercised` for this repo. Name the sibling deep-walk specs whose audits the reader should read for the mechanics of the biggest gaps.

**Stop. Wait for the user's next instruction.**

---

# UPDATE MODE

## Step 5U — Read the existing guide

Walk `.aipe/study-nonfunctional-requirements/` and read every file (`README.md`, `00-overview.md`, `audit.md`, and each Pass 2 pattern file).

## Step 6U — Re-audit and diff

Follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE.

Diff sources:
- **Codebase drift** — NFR verdicts that no longer hold (the retry was added; the timeout was tightened; the cost guard was removed), file paths that moved, new NFR gaps the original audit missed, new NFR patterns that now earn their own Pass 2 file.
- **Sibling-audit drift** — when a sibling spec's audit has been updated (`study-system-design/audit.md`, `study-security/audit.md`, etc.), cross-links may need to point at renamed `##` sections or updated evidence.
- **Template drift** — `format.md` has added blocks since the file was written; check that older Pass 2 files have them.
- **Pattern drift** — Pass 2 pattern files for NFR patterns the repo no longer exercises; missing files for patterns the repo added.

Output a structured change plan: `audit.md` regenerated (full diff against current evidence), pattern files added / updated / removed, with reasons per change.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation.** Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Regenerate `audit.md` against current evidence. Add new Pass 2 pattern files for newly-load-bearing NFR patterns. Update existing pattern files where the implementation changed. Remove pattern files only when the pattern is genuinely gone from the codebase (not just refactored).

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-nonfunctional-requirements/
─────────────────────────────────────────────────
Files updated:        <list>
Findings added:       <count>
Findings removed:     <count, with one-line reason each>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
