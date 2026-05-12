# Two-diff UPDATE mode

**Industry name(s):** Drift detection, Reconciliation loop, Three-way merge (conceptually)
**Type:** Industry standard · Project-specific composition of [drift detection] + [template version diff]

> UPDATE mode runs TWO diffs per file — Diff A: spec vs current codebase, Diff B: spec vs current template structure — and pauses for user confirmation before any edit lands.

**See also:** → [02-per-spec-type-contract](02-per-spec-type-contract.md) · → [03-template-diff](../02-dsa/03-template-diff.md)

---

## Why care

You've watched a teammate run `aws cloudformation deploy` and discovered six months of manual changes silently overwritten — the template was their truth, your in-place edits were drift, and the deploy chose the template. The everyday failure of regeneration tools is they don't distinguish *staleness* from *user-intended divergence*, and they lose work that should have been preserved.

The pattern is *drift detection with user-in-the-loop reconciliation*. Terraform's `plan` step does this — show what's changing, ask before applying. Kubernetes' kubectl-diff does this. Database migrations with `pending` lists do this. The principle is "compute the delta, present it, gate the apply on confirmation." aipe's UPDATE mode adds a second axis: not only does the codebase drift from the spec, but the spec drifts from the template-of-record between plugin versions. Two independent axes, two diffs, one user gate. Here's how that works.

---

## How it works

A two-axis health check. Imagine the spec sits at point (X, Y) on a grid: X is "how well it describes the current codebase" and Y is "how well it matches the current template's structure." Over time, both can drift independently — the codebase changes (X drifts) and the template version evolves (Y drifts). UPDATE mode measures both axes per file and tells the user which files need work and why.

### Diff A — spec vs codebase

The first axis: has the codebase changed in ways the spec doesn't reflect?

```
Read existing spec file at .aipe/specs/<type-plural>/<slug>.md
Read current codebase context (.aipe/project/*.md)

For each section / claim in the spec:
  - Does it still match what the codebase looks like?
  - Are there new files / patterns the spec doesn't mention?
  - Are there file/function references that have moved or been removed?

Flag findings as:
  - Outdated  (spec says X, codebase now says Y)
  - Missing   (codebase has Z that spec doesn't cover)
  - Stale ref (file/function path doesn't exist anymore)
```

If you're coming from frontend, think of this like a snapshot test: the spec is the snapshot, the codebase is the current render. Diff A is "the snapshot drifted from the truth." The fix is to update the spec.

### Diff B — spec vs current template structure

The second axis: has the *template* evolved to require sections the existing spec doesn't have?

```
Re-read the canonical template at specs/<type>.md

For each REQUIRED section in the current template:
  - Is the section present in the existing spec?
  - If present, does it follow the current sub-structure?
  - Is each required field in the section filled?

Flag findings as:
  - Section missing     (template added a section in v1.X, spec is pre-v1.X)
  - Section reshaped    (template restructured the section, old shape obsolete)
  - Sub-field missing   (sub-section added, existing section incomplete)
```

This is the second axis nobody else thinks about. Naive update modes only catch Diff A — they ignore that the template *itself* has versions, and that an old spec generated under v1.18.0 might be structurally incomplete under v1.29.0 even though the codebase hasn't changed at all.

The practical consequence: a spec generated when `/aipe:study` was at v1.18.0 lacks the Interview defense section (added v1.11.0 — already there) but might also lack the architectural-layer labels on diagrams (added v1.20.0), the Tradeoffs comparison-table structure (added v1.21.0), the Tech reference section (added v1.23.0), and the Project exercises block (added v1.26.0). Diff B walks every required section listed in `commands/study.md` Step 6U and flags each absence as a specific repair recipe.

The `study.md` template is the high-cadence case — v1.18.0 through v1.29.0 introduced ~7 template-level changes that older specs need to absorb. The other 10 templates have moved less (Interview defense was added once; not much else).

### The combined output — the change plan

The wrapper sums findings from both diffs into a structured change plan per file:

```
01-system-design/03-serverless-functions.md
  Outdated:        references Netlify Blobs, but storage moved to Neon Postgres
  Content missing: connection pooling section
  Section missing: Interview defense (template v1.11.0)
                   Tech reference (template v1.23.0)
                   architectural-layer labels in primary diagram (v1.20.0)
  Action:          update In this codebase + append missing sections
```

Files clean on both diffs are left alone. The plan only mentions files that need work.

### The STOP — user-in-the-loop reconciliation

Step 7U prints the change plan and **stops**. The wrapper does not edit any file. The user replies:

- `yes` → apply all
- `02-dsa/01-reordering` → apply only that file
- `02-dsa` → apply only that section
- `no` → abort

This is the same pattern as Terraform's `plan` + `apply` separation. The plan is read-only; the apply is gated on the confirmation. The user can see what's about to happen and selectively gate parts of it.

This works whether the user trusts the auto-detection or not — they can verify the plan against the actual repo before approving. It breaks if the wrapper auto-applies (which is why STOP is non-negotiable; see [06-scaffold-then-stop](06-scaffold-then-stop.md)).

### Step 8U — apply only confirmed changes

The wrapper edits the files. It doesn't rewrite accurate sections; it only patches the flagged ones. New files (CREATE-mode-from-inside-UPDATE) are written; outdated sections are patched in place; missing sections are appended in their canonical order.

Each updated file gets a one-line changelog at the bottom:

```
---
Updated: 2026-05-12 — added Tech reference section (template v1.23.0); restructured
                       Tradeoffs into comparison-table form (template v1.21.0).
```

### Why two diffs and not one merged check?

A single merged check would conflate "the codebase changed" with "the template changed" and present them as one undifferentiated list. Two-axis separation lets the user reason about each cause independently — "this file needs work because the codebase moved" is a different kind of problem from "this file needs work because the template grew." The first means the spec is *wrong*; the second means the spec is *incomplete relative to the current standard*. Different problem shapes, different reviews.

This is what people mean by "multi-dimensional drift." Reconciliation is harder when there are independent axes; the cure is to surface them independently, not to flatten them.

The full picture is below.

---

## Two-diff UPDATE mode — diagram

```
UPDATE mode: two axes of drift, one user gate

┌─ Inputs ──────────────────────────────────────────────────────────────────┐
│                                                                           │
│   Existing spec at .aipe/specs/<type-plural>/<slug>.md                    │
│   Current codebase context (.aipe/project/*.md)                           │
│   Current template at specs/<type>.md                                     │
│                                                                           │
└──────────────────────┬──────────────────────┬─────────────────────────────┘
                       │                      │
                       ▼                      ▼
┌─ Diff A ──────────────────────┐  ┌─ Diff B ──────────────────────────────┐
│ Spec vs current codebase      │  │ Spec vs current template              │
│                               │  │                                       │
│  Outdated: spec says X,       │  │  Section missing (template added it   │
│           codebase says Y     │  │           in a later version)         │
│  Missing: codebase has Z      │  │  Section reshaped (template           │
│           not in spec         │  │           restructured)               │
│  Stale ref: file path moved   │  │  Sub-field missing                    │
│                               │  │                                       │
└──────────────┬────────────────┘  └──────────────┬────────────────────────┘
               │                                  │
               └────────────────┬─────────────────┘
                                ▼
┌─ Change plan (Step 7U) ───────────────────────────────────────────────────┐
│                                                                           │
│   Per file:                                                               │
│     Outdated:        <list>                                               │
│     Content missing: <list>                                               │
│     Section missing: <list>  (Diff B)                                     │
│     Action:          <one-line repair recipe>                             │
│                                                                           │
│   ─────────────────────────────────────                                   │
│   Reply "yes" / "<path>" / "no"     ◀── STOP HERE                         │
└──────────────────────┬────────────────────────────────────────────────────┘
                       │
                       ▼  user confirms
┌─ Step 8U — apply only confirmed changes ──────────────────────────────────┐
│                                                                           │
│   Edit outdated sections in place                                         │
│   Append missing sections in canonical order                              │
│   Write new files                                                         │
│   Add Updated: <date> changelog line                                      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Spec for the contract:** `spec-aipe.md` lines 161–180 ("Per-spec-type contract") documents the two-diff model. The pattern was introduced in v1.11.1 specifically because users were hitting "the spec is missing the new sections you added to the template" — Diff A alone wasn't enough.

**Where the diff logic lives:** every `commands/<type>.md` Step 6U.
- `commands/study.md` has the most elaborate Diff B — Step 6U lists ~30 specific structural-gap flags (e.g., "Missing Why care block", "Primary diagram in wrong position", "Tradeoffs still in prose/bullet form"). Each flag has a one-line repair recipe in Step 8U.
- `commands/feature.md` Step 6U is much shorter — the feature template has fewer required sections.

**Step 7U user-prompt format:** documented in every wrapper. Example: `commands/study.md` ~line 1900 (in the "Step 7U — Output the change plan and STOP for confirmation" section).

**Step 8U repair recipes:** the body of each wrapper's Step 8U enumerates how to fix each flag from Step 6U. The recipes are the load-bearing part of the wrapper — they translate "section missing" into "insert it at this position with these defaults."

---

## Elaborate

### Where this pattern comes from

Drift detection as a discipline came from infrastructure-as-code (Terraform, Pulumi, CloudFormation) in the mid-2010s. The "plan-before-apply" gate is Terraform's defining invariant (2014). The two-axis variant is rarer — it's most visible in tools that handle both *content drift* and *schema drift* together, like Atlas (database schema management) or Helmfile (Helm chart + values both versioned). The aipe variant inherits the plan-apply separation and adds the template-version axis because the templates themselves evolve.

### The deeper principle

When two independent things can drift, surface them independently. Conflating drift dimensions makes the change plan opaque and the user's review error-prone. The cure is to keep the dimensions visible at every layer — in the diff logic, in the change plan, in the repair recipes. The user should be able to say "I'll fix the codebase-drift but defer the template-drift" and have the system honour that.

### Where this breaks down

When the two diffs interact. If a section is *both* outdated (codebase moved) AND structurally absent (template version added a sub-section), the repair has to walk both axes — update the content for the codebase change, then restructure for the template change. The wrappers handle this by listing both flags on the same file and letting Step 8U apply both repairs in order; in practice, it works fine, but the change plan can get noisy. A file with 6 flags across both diffs is harder to review than a file with 2.

### What to explore next

- [03-template-diff](../02-dsa/03-template-diff.md) → the algorithm for Diff B specifically
- Terraform's `plan` documentation — same pattern, same pause-for-confirmation
- Atlas schema drift detection — same two-axis idea for database schemas

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Two-diff UPDATE          │ Regenerate from scratch     │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ User edits       │ Preserved unless flagged │ Lost on every regeneration  │
│ Run time         │ Read + diff per file     │ Read template + generate    │
│ Implementation   │ Diff machinery (Step 6U) │ None — just rerun CREATE    │
│   complexity     │ + 30+ flags + repair     │                             │
│                  │ recipes per wrapper      │                             │
│ User trust       │ User sees + approves     │ User can't see the diff;    │
│                  │ every change             │ has to trust the generator  │
│ Wrapper size     │ Step 6U + 8U = ~60% of   │ Wrappers stay smaller       │
│                  │ `commands/study.md` body │                             │
│ Failure blast    │ Bad flag → noisy plan,   │ Bad regeneration → lost     │
│                  │ user catches it          │ user edits silently         │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

We gave up wrapper compactness. `commands/study.md` is 138 KB; roughly 60% of that is Step 6U flag descriptions + Step 8U repair recipes. The wrapper grew enormous because Diff B grew enormous (every template-version change between v1.11 and v1.29 added flags). At v1.29, there are ~30 distinct structural-gap flags for the study template alone. Every new template version adds 1–3 more.

We gave up speed. A naive regeneration runs the template once. UPDATE mode reads the existing spec, reads the codebase, reads the template, computes both diffs, prints the plan, waits, applies. For a multi-file spec like `/aipe:study` with 50+ files, the diff phase alone can take a minute or two before the user sees anything. Worth it — but it's slower than a regenerate.

We gave up the option to "just rebuild." Sometimes a user wants to throw away the existing spec and start over (rare but real). Today the only way is to delete `.aipe/specs/<type-plural>/<slug>.md` and re-run. That's fine, but it's not a first-class operation.

### Sub-block 2 — what the alternative would have cost

Regeneration from scratch would have lost user edits silently. A user who hand-tweaked a Tradeoffs section to better describe a project-specific cost would see their tweak erased on the next regeneration. They'd lose trust in the tool and start hand-rewriting specs outside of `/aipe:<type>` — at which point the tool's no longer earning its place. With ~5 plugin releases per quarter and ~3 hand-edits per spec per quarter, that's ~15 lost edits per quarter per spec — a slow erosion that kills adoption.

The naive regeneration would also conflate template drift with codebase drift — every regeneration would show every section "changed" because the regeneration always produces a fresh output. The diff would be 100% noise. UPDATE mode's value proposition is that the diff is signal, not noise.

### Sub-block 3 — the breakpoint

Fine until the number of structural-gap flags per template exceeds ~50. At that point, the wrapper body is too large to keep mirrored across `commands/<type>.md` and `skills/<type>/SKILL.md` reliably — reviewers can't eyeball the diff between the two during release. The fix would be to extract the flag table into a separate file (`specs/<type>-update-flags.md`) that both wrappers reference, breaking the "wrappers are byte-identical except env var" invariant gracefully. The study template is at ~30 flags today; v1.30+ template changes will push toward the breakpoint.

A second breakpoint: when the diff time exceeds 30 seconds for a multi-file spec. Today's study guide diff against 50+ files takes ~10–15s on a fast machine; if a study guide grows to 200 files, the diff becomes annoying. At that scale, parallel-reading the files (rather than serial) earns its place.

---

## Tech reference (industry pairing)

### Drift detection pattern

- **Codebase uses:** the wrapper's Step 6U is the drift detector; Step 7U is the plan/apply gate.
- **Why it's here:** without it, every UPDATE-mode run would either regenerate-and-lose-edits or fail-to-update-template-changes.
- **Leading today:** Terraform-style plan-before-apply — `adoption-leading` for infrastructure and configuration tools, 2026.
- **Why it leads:** decouples computation of the delta from application of the delta; user sees the change before it lands; selective apply works naturally.
- **Runner-up:** Pulumi's preview — `innovation-leading` for typed infrastructure; same shape, programming-language-native expression.

### Version-aware template repair

- **Codebase uses:** Step 6U flag taxonomy in `commands/study.md` and Step 8U repair recipes — both grew with template versions.
- **Why it's here:** template versions evolve faster than specs do; old specs need to be "lifted" to the current template structure without regeneration.
- **Leading today:** Atlas / Flyway-style migrations — `adoption-leading` for schema migration, 2026.
- **Why it leads:** versioned migrations let you walk an artifact from V1 to V2 to V3 with each step reviewable; the same shape applies to documents.
- **Runner-up:** schema versioning in JSON Schema with `$schema` URLs — `innovation-leading` for self-describing JSON; relies on schema registry, more elaborate.

---

## Summary

UPDATE mode runs two diffs per file — Diff A (spec vs current codebase) and Diff B (spec vs current template structure) — sums findings into a per-file change plan, prints it, and STOPs for the user to confirm before any edit lands. The two axes are kept separate because they represent different kinds of drift: Diff A means the spec is wrong about the codebase; Diff B means the spec is incomplete relative to the latest template. The constraint that drove this: regenerating from scratch lost user edits and conflated drift types. The cost being paid: wrapper size (Step 6U + 8U is ~60% of `commands/study.md`'s 138 KB) and diff-phase latency (~10–15s for multi-file specs).

- Two diffs, run independently — A for codebase drift, B for template-version drift.
- Step 7U prints the plan and STOPs; no edit lands without explicit user approval.
- Files clean on both diffs are left alone — UPDATE mode preserves accurate work.
- Step 8U applies only confirmed changes and appends a one-line changelog per updated file.
- Lives in step 2 (Request flow) and step 5 (Failure handling) of the system-design checklist — UPDATE is the alternate request flow; STOP-before-edit is the failure-handling shape.

---

## Interview defense

### What an interviewer is really asking

"Walk me through update mode" is testing whether you understand the difference between *regeneration* (cheap, loses user edits) and *reconciliation* (expensive, preserves work). The dodge is to call it a diff and stop. The senior answer names the two independent axes (codebase drift, template drift), explains why they're surfaced separately, and names the cost (wrapper size, diff latency).

### Likely questions

**Q [mid]:** What's the difference between Diff A and Diff B?

**A:** Diff A compares the existing spec to the current codebase — has the code changed in ways the spec doesn't reflect? It flags outdated content, missing coverage, and stale file references. Diff B compares the existing spec to the current template structure — has the template added sections or restructured sub-sections that the existing spec is missing? It flags structurally-absent sections by template version. The two flags surface separately because they need different repairs: Diff A repairs update content; Diff B repairs add or restructure sections.

```
Diff A                        Diff B
──────                        ──────
spec ─── compare ───▶ code    spec ─── compare ───▶ template
        ↑                            ↑
        codebase moved               template version evolved
        (e.g., file renamed)         (e.g., new required section)
```

**Q [senior]:** Why is the STOP for confirmation non-negotiable? Why not auto-apply?

**A:** Auto-apply would mean the user finds out what changed by reading the diff after the fact. With a multi-file spec like `/aipe:study` covering 50+ files, that's a 50-file diff to review — too easy to miss a bad repair. The STOP forces the user to see what's about to happen *in summary form* before any edit lands. They can selectively gate the apply ("yes" / "only this section" / "abort") which means they keep control over individual files. Auto-apply trades user confidence for one round-trip; UPDATE mode's whole reason for existing is to preserve user trust in the regenerator, so the trade is wrong.

```
With STOP (today)                    Auto-apply
─────────────────                    ──────────
compute plan                         compute plan
     │                                    │
     ▼                                    ▼
print plan to user      →            apply all edits
     │                                    │
     ▼                                    ▼
WAIT for confirmation                user reviews 50-file
     │                               diff after the fact
     ▼                                    │
apply only what's                         ▼
confirmed                            "wait, file X shouldn't
                                      have been touched"
                                          │
                                          ▼
                                     git checkout + retry
                                     (lost work in between)
```

**Q [arch]:** What scales worse first — Diff A or Diff B?

**A:** Diff B scales worse. Diff A is linear in the size of the codebase context and the spec — both small artifacts (~10 KB each). Diff B is linear in the number of template-version flags, which grows with every plugin release. Today the study template has ~30 flags; by v1.40 there might be 50. The wrapper carries each flag plus its repair recipe, so the wrapper body grows with template velocity. The breakpoint is roughly the point where the wrapper can no longer be reviewed in one pass at PR time — ~200 KB. We're at 138 KB; the next major template change (v1.30) might push past 150. The fix at that scale is to extract the flag taxonomy into a separate file both wrappers reference, breaking the byte-identical-mirror invariant cleanly.

```
Today (v1.29)               Hypothetical v1.40 (50+ flags)
─────────────               ──────────────────────────────
commands/study.md ~138 KB    commands/study.md ~250 KB
   ├── Step 6U: ~30 flags        ├── Step 6U: ~50 flags
   └── Step 8U: ~30 recipes      └── Step 8U: ~50 recipes
   (mirrored to skills/)         ─ breaks first: reviewer
                                   can't eyeball the diff ─

                                Fix: extract flags+recipes
                                to specs/study-update-flags.md
                                  ─ wrappers reference it,
                                    not embed it
```

### The question candidates always dodge

**Q:** Why didn't you just version the spec output and rebuild on every plugin update?

**A:** Because hand edits are the load-bearing case. A spec is generated, the user tweaks a Tradeoffs section to better reflect a project nuance the LLM didn't catch, then six months later the plugin updates and the regenerator rewrites the spec from scratch. The tweak is gone. Versioning + rebuild would systematically erase the human edits that make specs useful.

```
┌──────────────────┬──────────────────────────┬───────────────────────────┐
│ Dimension        │ Two-diff UPDATE (today)  │ Version + rebuild         │
├──────────────────┼──────────────────────────┼───────────────────────────┤
│ User edits       │ Preserved unless flagged │ Lost on every release     │
│ Implementation   │ ~80 KB of wrapper body   │ Trivial — re-run CREATE   │
│ Trust            │ User sees + approves     │ User has to back up edits │
│                  │ every change             │ before every release      │
│ Diff noise       │ Only flagged changes     │ Every section "changed"   │
│                  │ shown                    │ — useless                 │
│ Failure blast    │ Bad flag = noisy plan    │ Lost edit = unrecoverable │
│                  │ user catches it          │ work, silent              │
│ Suits projects   │ With hand-edited specs   │ With auto-generated-only  │
│                  │ (most)                   │ specs (none, in practice) │
└──────────────────┴──────────────────────────┴───────────────────────────┘
```

The rebuild path is faster in the short term and corrosive in the long term. UPDATE mode pays for the difference up front (wrapper size, diff latency) to keep the long term healthy.

### One-line anchors

- Two independent axes of drift: codebase changes (Diff A), template versions (Diff B).
- Step 7U prints the plan and STOPs — no edit lands without explicit confirmation.
- Files clean on both diffs are left alone — accuracy is preserved.
- Wrapper size scales with template-version cadence; ~60% of `commands/study.md` is UPDATE-mode body.
- The model breaks when flag taxonomies pass ~50 per template; fix is to extract flags into a referenced file.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the two-diff flow from memory. Label Diff A's inputs (spec, codebase), Diff B's inputs (spec, template), and the STOP point at Step 7U.

### Level 2 — Explain it out loud
Explain UPDATE mode to a colleague who's used to Terraform plan/apply. Under 90 seconds.

Checkpoints:
- Did you name both diffs and what each compares?
- Did you say "Step 7U STOPs for user confirmation"?
- Did you mention selective apply (`yes` / `<path>` / `no`)?

### Level 3 — Apply it to a new scenario

A user has a study guide generated under v1.18.0. They run `/aipe:study` after upgrading to v1.29.0 without changing their codebase. What's Diff A likely to flag? What's Diff B likely to flag?

Open `commands/study.md` Step 6U and find the flag for "Quick summary in wrong position" — that's exactly the v1.18.0 → v1.21.0 case.

### Level 4 — Defend the decision you'd change

Pick the wrapper-size cost. Answer:

"If `commands/study.md` is at 138 KB today and growing 10 KB per template release, when do you split the UPDATE-mode flag taxonomy into a separate file?"

### Quick check — code reference test
Without opening files:
- What step prints the change plan and STOPs? → Step 7U
- What's the literal first thing Step 7U asks the user? → "Reply 'yes' to apply all changes" (or scoped path / 'no')
- Where do the structural-gap flags for the study template live? → `commands/study.md` Step 6U
