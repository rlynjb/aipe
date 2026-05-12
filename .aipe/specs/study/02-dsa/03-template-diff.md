# Template structural diff (Diff B)

**Industry name(s):** Schema diff, Structural validation, Template-version-aware repair
**Type:** Industry standard · Project-specific composition of [section enumeration] + [version-tagged flag taxonomy]

> Walk the existing spec's section list against the canonical template's required section list — flag every absent section, every reshaped sub-section, every missing sub-field, with a repair recipe per flag.

**See also:** → [05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md) · → [01-template-source-of-truth](../01-system-design/01-template-source-of-truth.md)

---

## Why care

You've upgraded a framework that added new required config fields between versions, and the upgrade docs said "if you have a config file from v1, add fields A, B, C." You've also had it go wrong — your config is from v0.9, the docs jump from v1 to v2, and you end up reverse-engineering what got added in v1.x from the changelog. Schema drift across versions is a real cost, and the tools that handle it best are explicit about which version added what.

The pattern is *version-tagged structural validation*. Linters track rules by introducing version (`@typescript-eslint/no-explicit-any was added in v1.0`). Database migration tools track schema versions per migration. JSON Schema can be versioned. The shape: have a canonical structure with version tags on each piece, walk the existing artifact, flag pieces missing or reshaped relative to the current canonical version, and translate each flag to a repair recipe. Here's how aipe's Diff B does it for spec files.

---

## How it works

A building inspector with a punch list. The current template is the building code. The existing spec is the building. Diff B walks the spec section by section, comparing each section's shape to what the current code requires — and reports every code violation with a "to bring this up to spec, do X" recipe.

### The canonical section list (the building code)

Diff B knows the current required structure of a concept file (loaded from the template in Step 3). For the `/aipe:study` per-concept template at v1.29.0, the required structure in order is:

```
1.  # Title
2.  **Industry name(s):** + **Type:** subtitle block
3.  > Blockquote summary
4.  **See also:** line
5.  ## Why care                            (added v1.18.0)
6.  ## How it works                        (3-move structure v1.24.0)
7.  ## [Concept] — diagram                  (recap visual, v1.20.0+)
8.  ## In this codebase                    (with File: / Function: / Line range:)
9.  ## Elaborate
10. ## Tradeoffs                           (comparison table + sub-blocks v1.21.0)
11. ## Tech reference (industry pairing)   (added v1.23.0)
12. ## Project exercises                   (AI/ML files only, v1.26.0+)
13. ## Summary                             (renamed from Quick summary in v1.21.0)
14. ## Interview defense                   (with per-answer diagrams v1.21.0)
15. ## Validate your understanding
```

Each section has an associated version tag — which plugin version introduced or restructured it. The version tags are how Diff B knows what to look for in older specs.

If you're coming from frontend, think of this like ESLint's rule registry — each rule has a `since` and a `deprecated` version. A linter run knows which rules to apply based on the current version's rule set; comparing existing code to the rule set yields a list of violations.

### The flag taxonomy

For each section that might be missing or reshaped, Diff B carries a named flag and a repair recipe. The taxonomy lives in `commands/study.md` Step 6U; the recipes live in Step 8U. Roughly 30 flags as of v1.29.0:

```
Missing subtitle block                   (Industry name(s) + Type)
Missing Why care block                   (added v1.18.0)
Missing Why care handoff sentence        (v1.20.0 wording fix)
Primary diagram in wrong position        (still before How it works, v1.19.0)
Primary diagram missing layer labels     (v1.20.0 boundary labels)
How it works missing 3-move structure    (v1.24.0)
How it works opens with a definition     (v1.24.0 rule)
How it works missing layered sub-headings(v1.24.0)
How it works sub-section missing bridge  (v1.24.0)
How it works missing concrete consequences
How it works missing Phase A/B sub-section (when applicable)
How it works missing principle paragraph (Move 3)
How it works missing handoff sentence
In this codebase missing code reference
Tradeoffs still in prose/bullet form     (v1.21.0)
Tradeoffs missing breakpoint
Tech reference missing                   (v1.23.0)
Tech reference uses pipe-table          (v1.22.0 broken format)
Tech reference subsection missing bullets
Industry pairing still inlined           (v1.22.0 broken pattern)
Project exercises missing (AI/ML)        (v1.26.0)
Project exercises subsection missing bullets
Project exercises missing measurable Done-when
Section renamed: Quick summary → Summary (v1.21.0)
Quick summary in wrong position          (v1.18.0 → v1.21.0 migration)
Interview defense Q&As missing diagrams (v1.21.0)
Dodge question missing comparison diagram
Missing system-design-templates dir      (v1.29.0)
AI/ML file out of curriculum scope
Curriculum concept in scope, no file     (v1.26.0)
```

Each flag is detectable by a substring match or section presence check on the existing spec. Each maps to a repair recipe in Step 8U.

### Detecting each flag — section presence and sub-structure

For each existing concept file in the study guide, Diff B does:

```
Read existing file content
Split by `##` headings → list of top-level sections in current order

For each REQUIRED section in canonical list:
  Is it present in the existing file's section list? (substring match on heading text)
    no → flag "Missing <section>"
    yes →
      Check sub-structure (e.g., does Tradeoffs have a comparison table at the top?)
      Check sub-fields (e.g., does In this codebase have **File:**?)
      For each sub-rule violated → flag specific reshape

Check section order:
  Is the order of present sections the canonical order?
    if Quick summary appears before How it works → flag wrong position
    if primary diagram appears before How it works → flag v1.19.0 order
```

If you're coming from frontend, think of this like JSX prop validation — for each component (section), check the required props (sub-fields) and warn on missing or shape-mismatch. The "section" is the component; the sub-fields are its props.

### Detecting v1.X-specific shapes

Some flags require reading the section's content, not just its presence. Example:

```
Flag: "How it works opens with a definition"
Detect: first paragraph of `## How it works` matches /^X is /  or /^X refers to/
Repair: rewrite the opening as a metaphor / mental model
```

This is a regex over the section's first paragraph. The check is heuristic — it can false-positive (a paragraph that starts with "X is" might be a legitimate observation rather than a definition) — but the flag is for the user to review, not auto-apply. The Step 7U STOP catches false positives because the user sees the flag in the change plan and can decline.

### The output — flagged file with repair recipes

The output of Diff B per file is structured as:

```
01-system-design/03-serverless-functions.md
  Section missing: ## Tech reference (industry pairing)    (template v1.23.0)
                   ## Project exercises                    (template v1.26.0, AI/ML only)
  Section reshaped: ## How it works lacks 3-move structure (template v1.24.0)
                    ## Tradeoffs is prose-only            (template v1.21.0)
  Sub-field missing: ## In this codebase lacks Line range: (template v1.13.0)
  Action: append missing sections; restructure How it works; restructure Tradeoffs
```

Files that pass every check are not mentioned in the change plan.

### Why version tags on flags

The version tag is informational, not control flow. It tells the user *when* this requirement was added — which often answers "why did this work last release?" The flag would fire even without the tag; the tag adds context for the user reading the plan.

This is what people mean by "version-aware migrations." Knowing what changed in v1.X helps a maintainer reason about why the spec needs the repair. Without it, the user sees "missing section" and has no narrative; with it, they see "the template added this in v1.23.0 (industry-pairings extraction)" — a story they can connect to their own update history.

The full picture is below.

---

## Template diff — diagram

```
Diff B per concept file

┌─ Inputs ─────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Existing concept file (.aipe/specs/study/<section>/<file>.md)          │
│   Current template's canonical section list + version tags + sub-rules   │
│                                                                          │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       ▼
┌─ Phase 1 — Section enumeration ──────────────────────────────────────────┐
│                                                                          │
│   For each required section in canonical order:                          │
│     present?  ────▶ check sub-structure (Phase 2)                        │
│     absent?   ────▶ flag "Missing <section>" with version tag            │
│                                                                          │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       ▼
┌─ Phase 2 — Sub-rule validation ──────────────────────────────────────────┐
│                                                                          │
│   For each present section, check sub-rules:                             │
│                                                                          │
│   - Tradeoffs has comparison table at top?         (v1.21.0)             │
│   - How it works has 3-move structure?              (v1.24.0)            │
│   - In this codebase has File: / Function: / Line: ?(v1.13.0)            │
│   - Tech reference uses ### + bullets (not pipes)?  (v1.23.0)            │
│   ... ~30 sub-rules total                                                │
│                                                                          │
│   Each violated rule → flag with repair recipe                           │
│                                                                          │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       ▼
┌─ Phase 3 — Order check ──────────────────────────────────────────────────┐
│                                                                          │
│   Is the order of present sections canonical?                            │
│     primary diagram before How it works → flag (v1.19.0 → v1.20.0 swap)  │
│     Quick summary between Why care and diagram → flag (v1.18.0 → v1.19.0)│
│                                                                          │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       ▼
┌─ Output ─────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Per-file flag list with repair recipes:                                │
│     Missing: <section list>                                              │
│     Reshaped: <section> needs <restructure>                              │
│     Sub-field missing: <section> lacks <field>                           │
│     Wrong order: <section> should come after <other section>             │
│                                                                          │
│   Feeds the change plan printed at Step 7U.                              │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Where the flag taxonomy lives:** `commands/study.md` Step 6U.
- ~30 flag descriptions, each with a one-line trigger condition and a version tag.
- Example: "Missing `## Tech reference (industry pairing)` section" — flag any concept file that references a specific library, framework, or service without a dedicated Tech reference section between Tradeoffs and Summary.

**Where the repair recipes live:** `commands/study.md` Step 8U.
- One recipe per flag. Recipes are written as "for a <flagged condition>, do <repair action>".
- Example: "For a missing `## Tech reference (industry pairing)` section, insert it between `## Tradeoffs` and `## Summary`. Walk every section that names a specific library / framework / service ... For each tech, create a `###` subsection ..."

**The "Note on legacy guides" sub-section:** `commands/study.md` Step 6U also documents version-specific transformation paths:
- v1.17.0 → v1.18.0: replace `## In plain English` with `## Why care`
- v1.18.0 → v1.21.0: move and reshape Quick summary into the recap-form `## Summary`
- v1.19.0 → v1.20.0: swap primary diagram and How it works positions
- v1.20.0 → v1.21.0: rename `## Quick summary` to `## Summary`; restructure Tradeoffs
- v1.21.0 → v1.22.0: add industry-leader pairings
- v1.22.0 → v1.23.0: extract pairings into Tech reference section; remove pipe-tables
- v1.23.0 → v1.24.0: restructure How it works into 3-move shape
- v1.24.0 → v1.25.0: add expanded AI catalog + Section 04 if ML surface
- v1.25.0 → v1.26.0: add Project exercises blocks; curriculum-driven AI/ML inventory
- v1.28.0 → v1.29.0: add system-design-templates sub-directories

**Documentation:** `commands/study.md` Step 6U "Note on legacy guides" enumerates the transformation paths between adjacent versions.

---

## Elaborate

### Where this pattern comes from

Structural diff for documents has roots in DocBook validators (early 2000s) and OpenAPI / JSON Schema validation. Version-tagged migration paths come from database tooling (Rails migrations, Flyway, Atlas). The combination — section-list-walking + version-tagged repair recipes for markdown documents — is unusual; most markdown tooling assumes documents are free-form. The aipe variant is a project-specific composition because the templates have a known canonical shape, which makes structural validation possible at all.

### The deeper principle

When a document has a canonical structure and the structure evolves over versions, treat the document as having an implicit schema and the structure-evolution as a schema migration. The repair recipes are migrations from "shape at version X" to "shape at version Y." Without this framing, structural drift accumulates and old documents become silently obsolete.

### Where this breaks down

When the canonical structure becomes too elaborate for a flag taxonomy to cover. As `commands/study.md` Step 6U grows past ~50 flags (we're at ~30), maintaining the taxonomy becomes its own job — every template change has to translate into one or more new flags, and reviewers can't reliably eyeball a 50+ flag list during release. The fix is either to extract the taxonomy into a structured format (e.g., a YAML file with one entry per flag) or to reduce the surface area (fewer required sub-fields per section).

A second breakdown: when the existing spec has been hand-edited beyond recognition of the template structure. Diff B's section-presence check assumes the user's section headings still match the template's. If the user renamed `## Summary` to `## TL;DR` for stylistic reasons, the check sees "no Summary section" and flags it as missing — even though it exists semantically. The fix is heuristic synonym matching, but that adds complexity for an edge case.

### What to explore next

- [05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md) → Diff A is the codebase-side companion to Diff B
- [01-template-source-of-truth](../01-system-design/01-template-source-of-truth.md) → why the canonical structure even exists
- Atlas (database schema migration) — same pattern at higher leverage in the database world

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Flag taxonomy in wrapper │ Regenerate-and-merge        │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Wrapper size     │ ~80 KB of taxonomy +     │ Trivial — just rerun CREATE │
│                  │ recipes (~60% of body)   │ on the existing file        │
│ User-edit safety │ Edits preserved unless   │ Edits lost on every release │
│                  │ section is structurally  │                             │
│                  │ flagged                  │                             │
│ Maintenance      │ Every template change    │ Zero per release            │
│   per release    │ adds 1–3 flags + recipes │                             │
│ Diff readability │ "section missing → add"  │ "every section appears to   │
│                  │ — clear narrative        │ have changed" — noise       │
│ Failure blast    │ Wrong flag → wrong       │ Lost edits → silent and    │
│                  │ repair, user catches at  │ unrecoverable               │
│                  │ Step 7U STOP             │                             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

We pay in wrapper size: ~80 KB of taxonomy + recipes in `commands/study.md`. That's the load-bearing reason the file is 138 KB. Every template version that ships adds ~3–5 lines per new flag (description + version tag) and ~10–30 lines per new repair recipe (the body of "for this flag, do this transformation"). Over 12 template-version changes (v1.18.0 → v1.29.0), that's ~30–60 KB of accumulated body.

We pay in maintenance velocity. Editing a flag means editing its description in Step 6U, its repair recipe in Step 8U, and (if it's a new section) the canonical-section-list documentation in CREATE-mode Step 9C. That's three edits per flag change in the wrapper, plus the mirror to the Codex skill — six total file edits per flag. With ~30 flags, the maintenance commitment is real.

### Sub-block 2 — what the alternative would have cost

Regenerate-and-merge would have lost user edits. A user who hand-tweaked a Tradeoffs section in `/aipe:study`'s output, then re-ran the command after a plugin update, would see their tweak erased. Over a quarter, with ~3 hand-edits per file and ~50 files per study guide, that's ~150 lost edits per quarter. The user would stop trusting `/aipe:study` and start hand-rewriting outside it — at which point the tool isn't earning its place anymore.

Regenerate-and-merge would also flood the diff with noise. Every section would appear changed because the regenerator always produces a fresh output. The user couldn't tell which changes were "the template moved on" vs "my code moved on" — both diffs would conflate. Diff B's value is precisely that it isolates the template-version axis from the codebase-drift axis.

### Sub-block 3 — the breakpoint

Fine until the taxonomy passes ~50 flags. At that count, the wrapper exceeds ~200 KB total (today: 138 KB at ~30 flags), and reviewers can no longer eyeball the diff between `commands/study.md` and `skills/study/SKILL.md` at release. The byte-identical-mirror invariant from [01-template-source-of-truth](../01-system-design/01-template-source-of-truth.md) becomes hard to enforce — a missed mirror would ship and not be caught until a user reported it.

The fix at that scale is to extract the taxonomy into a structured file (`specs/study-update-flags.yaml` or similar) that both wrappers reference rather than embed. The wrappers stay small; the taxonomy becomes structured data that can be reviewed, version-controlled, and audited. The cost: introducing a non-markdown file in a markdown-only repo, plus the small parser the wrapper needs.

---

## Tech reference (industry pairing)

### Section-presence detection (heading walk)

- **Codebase uses:** the agent reads the existing concept file's content, splits by `##` headings, and matches each heading against the canonical section list.
- **Why it's here:** the load-bearing primitive for Diff B Phase 1.
- **Leading today:** markdown AST walking — `adoption-leading` for structural validation of markdown documents, 2026.
- **Why it leads:** every markdown parser produces an AST with heading nodes; the walk is straightforward; the check is order-aware.
- **Runner-up:** regex over the raw text — `adoption-leading` in lightweight tools; faster but order-naive, harder to extend.

### Version-tagged migration recipes

- **Codebase uses:** every flag in Step 6U carries a version tag (`added v1.23.0`); every recipe in Step 8U references the tag.
- **Why it's here:** lets users reason about which template version introduced the requirement they're missing.
- **Leading today:** versioned migrations — `adoption-leading` for schema-evolution tools, 2026.
- **Why it leads:** the narrative cost is small (one tag per flag); the user benefit is large (story for every flag).
- **Runner-up:** untagged "current state" validation (lint rules without `since:`) — `adoption-leading` in simpler linters; loses the migration narrative.

---

## Summary

Diff B walks the existing concept file's section list against the current template's canonical section list, flagging absent sections, reshaped sub-sections, missing sub-fields, and out-of-order content. The taxonomy lives in `commands/study.md` Step 6U (~30 flags as of v1.29.0); the repair recipes live in Step 8U. Each flag carries a version tag identifying which template release introduced the requirement. The constraint that drove this: template structure evolves across plugin versions, and old specs need to be lifted to the current shape without regeneration. The cost being paid: ~80 KB of wrapper body devoted to taxonomy + recipes, and ~3 edits per flag change (plus a mirror to the Codex skill).

- Diff B's primitive is section-list comparison; each canonical section has a version tag.
- Flag taxonomy + repair recipes are byte-identical between Claude command and Codex skill (mirror discipline).
- Files clean on every check are not mentioned in the change plan — accuracy is preserved.
- Wrapper body scales with the number of flags; ~80 KB at ~30 flags today.
- The breakpoint is ~50 flags — extract taxonomy into structured file at that scale.

---

## Interview defense

### What an interviewer is really asking

"How do you handle old specs after a template change?" is testing whether you understand schema migration as a discipline. The dodge is "we just regenerate." The senior answer names the cost of regeneration (lost user edits) and the cost of the alternative (taxonomy + recipes, growing wrapper size).

### Likely questions

**Q [mid]:** What does a flag in Step 6U look like?

**A:** A one-line condition + a version tag. For example: "Missing `## Tech reference (industry pairing)` section — flag any concept file that references a specific library, framework, or service without a dedicated Tech reference section between Tradeoffs and Summary. (added v1.23.0)" The check itself is "does the file's `##` heading list contain 'Tech reference'?" — yes/no. The repair recipe in Step 8U expands on how to insert the section.

```
Step 6U flag:
  "Missing ## Tech reference (industry pairing) section"
  triggers when: spec file has no ## Tech reference heading
  version: v1.23.0

Step 8U recipe:
  "Insert ## Tech reference between Tradeoffs and Summary.
   Walk every named library, framework, or service in the
   existing file. For each tech, create a ### subsection with
   five labelled bullets: Codebase uses, Why it's here,
   Leading today, Why it leads, Runner-up."
```

**Q [senior]:** Why version-tag the flags instead of just having a current-state check?

**A:** The tags give the user a story. Without tags, the diff says "you're missing Tech reference" — which is actionable but lacks context. With tags, it says "you're missing Tech reference (added in v1.23.0)" — which connects the gap to a specific plugin release the user might remember updating through. The story matters because users debugging an UPDATE-mode plan need to reason about *why* the gap exists, not just *that* it exists. The tag costs three characters per flag; the narrative value is much larger.

```
Without tag                            With tag
───────────                            ────────
Missing Tech reference section         Missing Tech reference section
                                       (template v1.23.0)
"why am I missing it?                  "ah, v1.23.0 extracted industry-
 was it always required?               leader pairings out of Tradeoffs
 did I delete it?"                     into a dedicated section. My spec
                                       is from v1.22.0 — that's why."
```

**Q [arch]:** What does Diff B look like at 50 flags vs 30 flags?

**A:** At 30 flags, the taxonomy is ~150 lines of Step 6U body + ~600 lines of Step 8U recipes (combined ~80 KB in `commands/study.md`). At 50 flags, that's ~250 lines + ~1000 lines (~130 KB). The wrapper goes from 138 KB to ~190 KB. Reviewers can still read 138 KB at PR time; 190 KB is right at the boundary. Past that, the right move is to extract the taxonomy into a structured file both wrappers reference — `specs/study-update-flags.yaml` or similar — keeping the wrappers under 150 KB and making the taxonomy reviewable as data rather than prose.

```
30 flags (today)                     50 flags (v1.40+ projection)
────────────────                     ─────────────────────────
~80 KB taxonomy + recipes            ~130 KB taxonomy + recipes
wrapper: 138 KB total                wrapper: ~190 KB total
mirror reviewable at PR              ─ breaks first at PR review ─

                                     Fix: extract to
                                     specs/study-update-flags.yaml
                                     wrappers stay ~110 KB
                                     taxonomy becomes data-shaped
```

### The question candidates always dodge

**Q:** Why didn't you store the canonical structure as a parseable file and validate against it programmatically?

**A:** The wrapper IS the agent. The agent reads the wrapper, sees "do X if Y," and does X. A separate parseable file would add a layer between the wrapper and the work — the agent would have to parse the file, interpret the rules, and apply them. With prose flags and prose recipes, the agent just follows instructions in natural language. The cost ledger:

```
┌────────────────────┬──────────────────────────┬───────────────────────────┐
│ Dimension          │ Prose in wrapper (today) │ Structured rule file      │
├────────────────────┼──────────────────────────┼───────────────────────────┤
│ Agent reads        │ Native — markdown in,    │ Parse rules, interpret    │
│                    │ instructions out         │ schema, then act           │
│ Maintenance        │ Edit one prose block per │ Edit YAML rule + recipe   │
│                    │ flag change              │ template + parser if      │
│                    │                          │ needed                    │
│ Reviewer cost      │ Read prose at PR         │ Read YAML + ensure parser │
│                    │                          │ still handles it          │
│ False positive     │ Heuristic flag → agent   │ Strict match → agent      │
│   recovery        │ skips on unclear case     │ refuses on unclear case   │
│   (loose)         │                           │                           │
│ Extensibility      │ Add a prose flag,        │ Add YAML entry + maybe a  │
│                    │ done — no schema         │ new schema field          │
│ Failure blast     │ Bad prose → noisy plan,  │ Bad YAML → parser fails,  │
│                    │ user catches at Step 7U  │ no plan generated at all  │
└────────────────────┴──────────────────────────┴───────────────────────────┘
```

Structured rules earn their place when the rule count exceeds ~50 (the same breakpoint as wrapper-size-fail). Below that, prose is more flexible — the agent can reason about edge cases the YAML wouldn't anticipate. We're at 30 flags; prose is right today.

### One-line anchors

- Diff B walks the canonical section list against the existing file's section list.
- Each canonical section carries a version tag — the migration narrative for the user.
- Flag taxonomy + repair recipes are mirrored between command and skill (byte-identical).
- Wrapper body grows with flag count; breakpoint is ~50 flags or ~200 KB wrapper.
- Prose flags are flexible at small N; switch to structured rules at the breakpoint.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw Diff B's three-phase flow (section enumeration → sub-rule validation → order check) from memory. Label what each phase outputs.

### Level 2 — Explain it out loud
Explain Diff B to a colleague who's used to ESLint plugins. Under 90 seconds.

Checkpoints:
- Did you name "section presence check" as the primitive?
- Did you name "version-tagged" as the migration-narrative property?
- Did you name the load-bearing example flag (e.g., Tech reference v1.23.0)?

### Level 3 — Apply it to a new scenario

A user has a study guide generated under v1.22.0. They run `/aipe:study` after upgrading to v1.29.0. What four to six flags is Diff B likely to fire for each concept file?

Open `commands/study.md` Step 6U "Note on legacy guides" and find the v1.22.0 → v1.23.0 transformation entry — it lists the canonical drift.

### Level 4 — Defend the decision you'd change

Pick the prose-flag vs structured-rule tradeoff. Answer:

"If the flag count grew to 60 over the next 12 months, would you switch to structured rules? What's the migration cost?"

### Quick check — code reference test
Without opening files:
- Where does the flag taxonomy live? → `commands/study.md` Step 6U
- Where do the repair recipes live? → `commands/study.md` Step 8U
- Roughly how many flags are there at v1.29.0? → ~30
