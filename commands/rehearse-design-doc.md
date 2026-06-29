---
description: Design docs / RFCs for this codebase — staff-level written artifacts for alignment, review, promo packets
---

The user invoked `/aipe:rehearse-design-doc`.

This command takes **no arguments**. There is one design-doc bundle per repo, saved at the fixed path `.aipe/rehearse-design-doc/`. `.aipe/` is per-repo; the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a rehearse-family generator that turns the **current repo**'s most significant design decisions into staff-level design docs / RFCs — the written artifact you put in front of a team, a reviewer, or a promo committee to get alignment and to read as staff-level. This is the **human layer**: not comprehension for yourself (that's `/aipe:study-*`), but communication to others.

**Performance-side, like the rest of the rehearse family.** Coach posture (preparing you to communicate under scrutiny). The output bundle is small by design: pick the **significant + non-obvious** decisions only — typically 1–3 docs per repo. A doc for a decision everyone would make the same way wastes the reader's attention.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:rehearse-design-doc.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)

## Step 3 — Load the template chain

Design-doc reads four files in order — structure rules, writer persona (coach posture), reader calibration, then the spec itself:

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/rehearse-design-doc.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the *quality standards*: formatting (kebab-case file names, no Mermaid/no images, box-drawing diagram chars), diagram conventions, pseudocode rules, the analogy rule (analogies welcome — to land or clinch — but the engineering mechanism is always built in full, never replaced by metaphor), the standard-term-leads rule (industry term as the noun, repo's local name in parens on first use — "the port (`DataSource`)"), the no-hedging rule, the hard rules. This spec uses its own per-decision doc template (defined inline below) — NOT the concept-file template.
- **`teacher.md`** — the writer persona in **coach posture** (same staff engineer, shifted to preparing the reader to communicate under scrutiny). Inherits the banned list (hedging, marketing language, slow on-ramps, analogy doing the load-bearing work or replacing the engineering explanation) and the verdict-first / rank-what-matters trait.
- **`me.md`** — reader-side calibration. The reader's own portfolios and writing voice — the docs sound like the reader, not like an abstract template.
- **`rehearse-design-doc.md`** — the topic (which decisions warrant a doc), the per-doc nine-section structure, the selection rules.

## Step 4 — Detect existing bundle → CREATE or UPDATE

Check whether `.aipe/rehearse-design-doc/` contains the bundle. The signal is the presence of `00-overview.md` at the root OR any doc file matching `0[1-3]-*.md`.

- **Existing bundle found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing bundle** → go to CREATE MODE (Step 5C onward).

---

# CREATE MODE

## Step 5C — Identify the decisions worth a doc

Walk the codebase as a reviewer asking *"which decisions in this repo are significant + non-obvious?"*. A decision earns a doc when:

- It's load-bearing (the system would be meaningfully different if reversed),
- AND it's non-obvious (a different engineer might reasonably have picked differently).

**Skip** decisions that were obviously the right call ("we use TypeScript"), or that have no meaningful alternatives, or that are too local to warrant alignment.

**Target 1–3 docs.** A bundle of one is honest if only one decision warrants it — never manufacture three to fill the slot. If only one decision warrants a doc, the bundle is one doc plus the overview.

## Step 6C — Plan the bundle

Non-negotiables — inherited from `format.md` (quality), `teacher.md` (coach posture), `me.md` (calibration), and this spec (structure):

1. **One chapter = one decision = one complete doc.** Every doc follows the same canonical RFC nine-section spine.
2. **The decision-doc nine-section structure** (use these exact section names, in order):
   1. **Title + one-line summary** — the decision in a sentence, up top.
   2. **Context / problem** — what forced the decision. Real constraints from the repo, not theory.
   3. **Goals & non-goals** — what this must do, and explicitly what it won't. Non-goals prevent scope fights.
   4. **The decision** — the chosen design. **A diagram (per format.md) is mandatory** — the shape before the prose.
   5. **Alternatives considered** — 2–3 real options that were on the table, each with why it lost. This is "design it twice" written down; a doc with no alternatives reads as undercooked.
   6. **Tradeoffs accepted** — what this costs, owned without flinching ("we chose X, accepting Z"). No apologetic framing.
   7. **Risks & mitigations** — what could go wrong, what guards it.
   8. **Rollout / migration** — how it ships safely; what changes for callers / data already in flight.
   9. **Open questions** — what's still undecided. Honesty here is a staff signal, not a weakness.
3. **Coach notes thread through** — where a reviewer will push, the framing that holds, the sentence that gets the yes. Coach notes can be inline callouts, but they DO NOT replace the canonical sections.
4. **Grounded.** Every doc cites real file paths and decisions visible in the repo. No invented decisions, no invented code.
5. **Tight.** A doc people actually read, not a wall. Keep each section short; lead with the verdict; trust the diagrams to carry weight.
6. **Hedging and marketing language banned** (inherited from teacher.md).
7. **Honest about open questions.** The Open Questions section is not pro-forma — list what's actually undecided. If everything is decided, write "none — and that's the result of decisions 1, 2, 5 above" rather than padding.

## Step 7C — Create the directory and generate the bundle

Create:

```bash
mkdir -p .aipe/rehearse-design-doc
```

Generate:

```
00-overview.md             which decisions warranted a doc (ranked), the doc template, how to use these
01-<decision-slug>.md      one full design doc
02-<decision-slug>.md      [optional — only if a second decision warrants a doc]
03-<decision-slug>.md      [optional — cap ~3; fewer is fine]
```

Each decision file uses the nine-section spine from Step 6C. Slug each filename after the decision (kebab-case): e.g. `01-tenant-routing-strategy.md`, `02-vector-store-choice.md`.

## Step 8C — Generate `00-overview.md`

The overview names the decisions that earned a doc and the ones that didn't. Three short sections:

1. **The decisions we documented** — ranked list with one-line summary each; pointer to the matching doc file.
2. **The decisions we deliberately didn't document** — name them in one line each, with the reason ("obvious choice"; "no real alternative"; "too local to warrant alignment"). This is the staff-signal move: showing you considered the boundary.
3. **How to use these docs** — for review (read top-to-bottom, push on Section 5 alternatives), for promo (cite Sections 1+2+6 — the why, the cost owned), for onboarding (skim Section 4 diagrams).

## Step 9C — Report + stop

Print exactly:

```
✓ Design docs created at .aipe/rehearse-design-doc/
  00-overview.md          (<N> docs ranked; <M> decisions deliberately not documented)
  01-<slug>.md            (<title>)
  02-<slug>.md            (<title>)   [omit if not generated]
  03-<slug>.md            (<title>)   [omit if not generated]
```

Then a 3–5 sentence summary: the highest-stakes decision in the bundle, the strongest section in that doc (usually Tradeoffs accepted or Alternatives considered), and the open question with the longest tail (the one a reviewer will push hardest on).

**Stop. Wait for the user's next instruction.**

---

# UPDATE MODE

## Step 5U — Read the existing bundle

Walk `.aipe/rehearse-design-doc/` and read `00-overview.md` plus every `0[1-3]-*.md` doc file.

## Step 6U — Diff against the current codebase

Two diff sources:

- **Decision drift** — a documented decision was reversed (the design changed), a new significant + non-obvious decision appeared and needs a doc, or a previously undocumented decision is now obvious / load-bearing enough to deserve one.
- **Section drift** — file paths/citations that have moved, alternatives whose rationale changed, open questions that have been resolved (move to Tradeoffs accepted).

Output a structured change plan per doc, plus any additions/removals at the bundle level.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation.** Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only identified sections. Preserve sections that still hold; surgically edit the ones whose underlying decision shifted.

Do NOT regenerate unchanged docs. Do NOT manufacture new docs to "fill out" the bundle — only add when a new decision genuinely warrants one.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/rehearse-design-doc/
─────────────────────────────────────────────────
Docs updated:         <list>
Docs added:           <list>
Docs removed/archived: <list, with one-line reason each>
Docs unchanged:       <count or list>
```

**Stop. Wait for the user's next instruction.**
