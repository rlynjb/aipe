---
description: Per-codebase visual study guide — system design + DSA, diagrams-first, one file per concept
---

The user invoked `/aipe:study`.

This command takes **no arguments**. There is one study guide per project, saved at `.aipe/study-<purpose>/` — where `<purpose>` is a 2-word descriptor capturing the app's main purpose (e.g., `study-ai-journal/`, `study-ml-fitness/`, `study-prompt-tooling/`). The agent derives `<purpose>` from the codebase on first run (Step 4); re-running `/aipe:study` from the same project detects the existing `.aipe/study-*/` directory and enters UPDATE MODE.

**Scope.** This command covers system design and DSA only. **AI engineering and ML have moved to their own spec** — invoke `/aipe:study-ai-engineering` for LLM foundations, retrieval, agents, evals, production serving, and machine learning. **Prompt engineering** has its own spec too — invoke `/aipe:study-prompt-engineering` for that. Both companion specs produce fixed portfolio-wide folders (`.aipe/study-ai-engineering/`, `.aipe/study-prompt-engineering/`), not per-codebase folders like this one.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study.`
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

(No curriculum loading — that was AI/ML-specific and has moved to `/aipe:study-ai-engineering`.)

## Step 3 — Load the `study` template

Read the template at:

```
${CODEX_PLUGIN_ROOT}/specs/study.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` upward from this file's location.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Look for an existing study guide directory in `.aipe/`:

```bash
ls -d .aipe/study-*/ 2>/dev/null
```

A match counts as an existing guide only if the directory contains `00-overview.md` at its root OR any file inside `01-system-design/` or `02-dsa/`. (The directory may exist as an empty placeholder; that's not the same as having a guide already.)

Branch on what's found:

- **One existing guide found** → record its path as `<study-dir>` and go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**

- **Multiple existing guides found** (rare — usually means the project's purpose was renamed) → list them and ask the user which one to update. Honor the choice; set `<study-dir>` and go to UPDATE MODE.

- **No existing guide** → derive the 2-word `<purpose>` descriptor from the codebase context and set `<study-dir>` = `.aipe/study-<purpose>/`. Then go to CREATE MODE (Step 5C onward).

  **How to derive `<purpose>`:**
  - The descriptor names *what the app does*, not what it's built with. "Next.js app" is a stack, not a purpose. "Ai journal" is a purpose.
  - **Exactly 2 words** when possible; reach for 3 only if 2 genuinely cannot capture the purpose; never more than 3.
  - **Kebab-case, all lowercase**: `study-ai-journal`, not `study-AiJournal` or `study-ai_journal`.
  - **Concrete nouns and clear adjectives** over marketing language. `study-fitness-tracker` over `study-personal-wellness`. `study-prompt-tooling` over `study-developer-productivity`.
  - **No abbreviations the reader wouldn't recognize.** `study-ai-journal` is fine; `study-pjt-tool` is not.
  - Worked examples: `loopd` → `study-ai-journal/`; `contrl-mo` → `study-ml-fitness/`; `aipe` → `study-prompt-tooling/`; a docs Q&A app → `study-doc-search/`; a customer support chatbot → `study-support-chatbot/`.
  - The agent decides `<purpose>` *itself* from the codebase evidence. It does NOT ask the user unless the codebase is genuinely ambiguous (e.g., the README describes one purpose but the actual code does something different). In that case, ask exactly one clarifying question naming the two candidate descriptors before proceeding.

Throughout the rest of this procedure, references to `.aipe/study-<purpose>/` mean `<study-dir>` — the directory established in this step.

---

# CREATE MODE

Runs only when no existing study guide is found.

## Step 5C — Plan the study guide

The study spec produces a visual reference — diagrams first, prose second, designed for skimming. It is **not** an interview prep guide (that's `/aipe:interview`). The study guide explains the codebase so a reader can understand it.

Apply the template's structure (loaded in Step 3) and the project context. The output is a **nested directory of per-concept files**, not flat-per-section files. Scope is **system design + DSA only** — refer the user to `/aipe:study-ai-engineering` for AI/ML and `/aipe:study-prompt-engineering` for prompt engineering.

The non-negotiables from the template:

1. **Visual before verbal — but the primary diagram is the recap.** Every concept has ONE primary diagram (ASCII box-drawing in a fenced code block) that sits AFTER `## How it works` as the recap visual — a reader who only looks at it should grasp the structure. Inside `## How it works`, every paragraph that introduces jargon must anchor it with a secondary visual in the same paragraph: a small diagram, a pseudocode block, a comparison table, or an execution trace. Prose alone is the last resort. The primary diagram must label every architectural layer it spans — UI layer, Service layer, Storage layer, Network boundary, Provider layer — using a left-margin label, a horizontal divider with the layer name, or grouped boxes inside a labelled band.
2. **Skim-first structure.** Every individual concept gets its own `###` header — and its own file. A reader should be able to find any concept in under 10 seconds by scanning the section's `README.md` index.
3. **Self-contained blocks.** A reader who jumps to any file should not need to have read prior files to understand it. Cross-references via "**See also:**" links are fine; required reading order is not.
4. **Every algorithm gets a step-by-step execution trace** — every variable at every step, not just before/after. (DSA files especially.)
5. **Decisions and tradeoffs inline.** The why is part of the what. Every non-trivial decision gets one line on the tradeoff.
6. **Every concept file ends with an Elaborate block** — Where this pattern comes from / The deeper principle / Where this breaks down / What to explore next.
7. **Every concept file ends with an Interview defense block** AFTER the Tradeoffs section — What an interviewer is really asking / Likely questions (each labelled `[mid]` `[senior]` `[arch]`) / The question candidates always dodge / One-line anchors. Each question carries its own diagram sized to the question level.
8. **Every concept file ends with a Validate block** AFTER the Interview defense section — 4 levels (Reconstruct the diagram → Explain it out loud → Apply it to a new scenario → Defend the decision you'd change) plus a "Quick check — code reference test". Each level builds on the last; do not skip levels. Level 3 must reference the specific file and line range the reader checks their answer against.
9. **Every "In this codebase" section must include a real code reference** — `**File:**` + `**Function / class:**` + `**Line range:**` (e.g., `L42–L67`). For multi-file patterns, list every file with the role each plays.
10. **Every concept file opens with a two-line subtitle** directly under the H1 and BEFORE the blockquote summary. Two fields: `**Industry name(s):**` and `**Type:**` (one of: `Industry standard` / `Language-agnostic` / `Industry standard · Language-agnostic` / `Project-specific`).
11. **Every concept file in `01-system-design/` includes a "Checklist step" tag** as one bullet in the Summary section's Part 2 key-point list. The template defines a 6-step mental checklist for system design — `1. Data model`, `2. Request / response flow`, `3. Caching layers`, `4. State ownership`, `5. Failure handling`, `6. Scale concerns`. Each pattern lives in one or more steps; tag accordingly. The `02-dsa/` files do NOT use this field — it is system-design-only.
12. **Voice: state decisions, not hopes.** Hedging language (`this might`, `could potentially`, `tends to`) is banned. If something is a tradeoff, name it. If something is suboptimal, say so plainly — then explain why it was still the right call at the time.
13. **Use frontend primitives the reader builds with — not analogies, not whole products.** Reach for the lowest-level primitive that still carries the point. Banned as primary anchors: coat checks, librarians, locked doors, bouncers, factories, queues at coffee shops — and **whole-product references** ("Linear does X", "GitHub does Y") *when a lower-level primitive captures the same point*. Preferred anchor types, in priority order: frontend primitives the reader builds with daily (a todo list, a DB table, a `.map()` with `key`); patterns the reader has built in their own apps; DevTools/engineering surfaces; industry-standard protocols (JWT, OAuth, MVCC); whole products only as last resort.
14. **Every concept file includes a "Why care" block** immediately after `**See also:**` and BEFORE `## How it works`. Five structural moves in order: The grounded scenario → Name the question the pattern answers → Why answering that question matters (load-bearing pivot, bolded transition) → Concrete before/after (optional) → The one-line summary. Move 1 must be project-agnostic and anchored to frontend primitives. Hook-sentence openings, physical-world analogies, and whole-product references (as primary anchors) are banned in Move 1.
15. **Summary is the RECAP block, positioned after Tradeoffs and before Interview defense.** Part 1: concept recap (one paragraph, 3–5 sentences). Part 2: key points to remember (3–6 bullets, declarative, mixing shape / rule / tradeoff). **No new information** — everything in Summary must already appear earlier in the file.
16. **Tradeoffs is a structured block, not a prose dump.** Required parts: (a) comparison table with at least four cost dimensions across two columns (path taken vs the obvious alternative); (b) Sub-block 1 — what we gave up (2–4 paragraphs in concrete terms); (c) Sub-block 2 — what the alternative would have cost; (d) Sub-block 3 — the breakpoint (one paragraph naming a quantitative or event-shaped condition under which this choice stops being the right call). Sub-block 4 (what wasn't actually a tradeoff) is optional. Hedging language is banned.
17. **Tech-stack rule — industry pairings live in a dedicated `## Tech reference (industry pairing)` section, NOT inlined into Tradeoffs or other sections.** The section sits between `## Tradeoffs` and `## Summary` in every concept file. Inside it: one `###` subsection per tech the file references. Each subsection uses **`###` heading + labelled bullets**: `**Codebase uses:**` / `**Why it's here:**` / `**Leading today:**` (adoption-leading vs innovation-leading + year) / `**Why it leads:**` / `**Runner-up:**`. **Do NOT use markdown tables with pipes for tech entries** — they break in narrow renderings.
18. **How it works is the load-bearing block; it follows a three-move structure with frontend bridging.** Length scales with complexity, not capped at a paragraph count. Three required moves: Move 1 (the mental model, first paragraph + diagram) anchored to a frontend primitive; Move 2 (the layered walkthrough, the body) with each sub-section requiring at least one ASCII diagram; Move 2.5 (current state vs future state) when applicable; Move 3 (the principle, final paragraph) — the takeaway that generalises beyond this codebase.
19. **Diagrams use box-drawing characters**: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼`. No Mermaid, no images, no PlantUML.

Every term must be shown before it's used (jargon without a diagram is forbidden).

Every file is grounded in concrete details from the project context: real file names, real operations, real data shapes.

## Step 6C — Plan the file inventory

Both sections are **codebase-driven**. Identify patterns and operations by walking the project context. Use the template's "What to expect by discipline" catalog (loaded in Step 3) as the first pass: determine whether the codebase is primarily frontend, backend, or full-stack, then walk the discipline's pattern list and note which ones you can ground in concrete code. Patterns you find become files; patterns you don't find are skipped (or flagged for the user).

- **`01-system-design/`** — patterns the codebase actually uses (request flow, auth, storage, API design, abstraction layers, error handling — whatever the catalog and the code surface). Number files in the order they appear in the catalog (`01-request-flow.md`, `02-auth-boundary.md`, …).
- **`02-dsa/`** — operations the codebase actually performs (sorting, deduplication, flattening, reordering, lookups — whatever the code does). Number files in the order they appear in the catalog.

If the codebase has substantial AI/ML or prompt engineering content, mention it in the report but DO NOT generate those files here — point the user at `/aipe:study-ai-engineering` and `/aipe:study-prompt-engineering`.

## Step 7C — Create the directory structure

Create:

```
.aipe/study-<purpose>/
.aipe/study-<purpose>/01-system-design/
.aipe/study-<purpose>/02-dsa/
```

(Use `mkdir -p`.) Sections without applicable patterns are not created — leaving an empty `02-dsa/` for a project with no real DSA surface is misleading. The inventory from Step 6C decides which directories exist.

## Step 8C — Generate `00-overview.md`

One full-system diagram + bullet legend (one line per component: what it is, what it does, what it talks to). **No prose paragraphs.** Save to `.aipe/study-<purpose>/00-overview.md`.

## Step 9C — Generate per-concept files in each section

For each section that the inventory included (`01-system-design/`, `02-dsa/`), iterate the inventory from Step 6C. Compose ONE file per concept. Save immediately before moving to the next.

Every concept file uses the per-concept structure from the loaded template — Subtitle, blockquote summary, See also, Why care (5 moves), How it works (3 moves with diagrams at every move and every sub-section), primary diagram, In this codebase (with real `**File:**` / `**Function / class:**` / `**Line range:**`), Elaborate, Tradeoffs (comparison table + 3 sub-blocks), Tech reference (with `###` heading + labelled bullets, never pipe-tables), Summary (Part 1 recap paragraph + Part 2 key-points bullets; for system-design files, include the Checklist step tag), Interview defense (with diagrams per Q&A), Validate (4 levels + Quick check).

DSA files include a step-by-step execution trace — every variable at every step.

## Step 10C — Generate section README indexes

Each section directory gets its own `README.md`:

- **`01-system-design/README.md`** — index of pattern files (one-line each), plus the 6-step mental checklist (`1. Data model` / `2. Request / response flow` / `3. Caching layers` / `4. State ownership` / `5. Failure handling` / `6. Scale concerns`) with each listed pattern tagged by its checklist step(s).
- **`02-dsa/README.md`** — index of operation files (one-line each), plus a complexity cheat sheet (operation → time complexity → space complexity).

The section READMEs are the navigation — the first thing a reader opens when they enter a section.

## Step 11C — Report + stop

Print exactly:

```
✓ Study guide created at .aipe/study-<purpose>/
  00-overview.md
  01-system-design/                            (<N> files + README.md)
  02-dsa/                                      (<N> files + README.md)
```

Then a 3-sentence summary: what the codebase being studied is, which section was richest given the actual surface area, and any operations in the DSA section that are currently O(n²) where O(n) is easy (since the spec asks for these to be flagged plainly).

If the codebase has AI/ML or prompt engineering surface, add a fourth sentence:

```
  AI/ML or prompt engineering content detected — generate the portfolio-wide guides with:
    /aipe:study-ai-engineering
    /aipe:study-prompt-engineering
```

**Stop. Wait for the user's next instruction.** They'll typically pick a concept file to drill on, ask for a deeper trace, or ask which operation to fix first. Do NOT auto-fix or auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing study guide. Goal: make the guide accurate again without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-<purpose>/` recursively. Read every `.md` file in:

- the root (`00-overview.md`)
- `01-system-design/` (README.md + every per-pattern file)
- `02-dsa/` (README.md + every per-operation file)

If the existing guide contains stale `03-ai-engineering/` or `04-machine-learning/` directories (from older versions of this command), do NOT touch them in this run — flag them in the Step 7U change plan as orphan content that has moved to `/aipe:study-ai-engineering`, and ask the user whether to delete or migrate them.

## Step 6U — Diff the guide against the current codebase AND the current template

Two diff sources:

**Diff A — codebase drift** (always runs):
- File paths that have moved
- Function names that have changed
- Line ranges that no longer match the implementation
- New patterns the system-design or DSA inventory should now cover
- Changed architectural decisions

**Diff B — template drift** (always runs):
- `study.md` has added new blocks (e.g., a new Move sub-section to How it works, a new field to Tech reference, a new Validate level) since the file was last written. Identify missing blocks. The current template defines: Subtitle (2 lines), blockquote summary, See also, Why care (5 moves), How it works (3 moves with diagrams at every move and every sub-section), primary diagram, In this codebase (with file + function + line range), Elaborate, Tradeoffs (comparison table + 3 sub-blocks), Tech reference (with `###` heading + labelled bullets), Summary (Part 1 recap + Part 2 key-points, with Checklist step tag for system-design only), Interview defense (with diagrams per Q&A), Validate (4 levels + Quick check).

Specific flags to raise per file:

- "Missing Why care block" — older files may go straight from See also to How it works
- "Why care lacks the 5-move structure" — older files may have a single paragraph instead of the structured 5 moves
- "How it works lacks Move 2 sub-section diagrams" — every Move 2 sub-section needs at least one ASCII diagram
- "Missing Tech reference section" — older files may inline tech mentions in Tradeoffs or How it works
- "Tech reference uses markdown pipe-tables" — must be rewritten with `###` heading + labelled bullets
- "Summary positioned before Tradeoffs" — Summary moved to after Tradeoffs in newer template versions
- "Summary lacks Part 1 / Part 2 structure" — older files may have prose only or bullets only
- "Missing Checklist step tag in system-design file" — every `01-system-design/` file needs the tag in Summary Part 2
- "Interview defense answers lack diagrams" — every Q&A needs a small ASCII diagram sized to the question level
- "Validate block lacks Level 3 code reference" — Level 3 must reference a specific file + line range
- "Stale tech reference values" — leader/runner-up should be re-evaluated when the codebase has churned

## Step 7U — Output the change plan and STOP for confirmation

Print a structured summary:

```
Changes detected for .aipe/study-<purpose>/
─────────────────────────────────────────────────

00-overview.md
  Outdated: <e.g. layer X removed but still in the system diagram>
  Missing:  <e.g. new background-jobs layer not on the map>
  Action:   <update diagram + bullet legend / no change>

01-system-design/
  README.md
    Outdated: <e.g. checklist tag missing for new pattern>
    Action:   update index + checklist tags

  03-serverless-functions.md
    Outdated: references Netlify Blobs, now Neon Postgres
    Missing:  Tech reference section (legacy file)
    Action:   update "In this codebase"; add Tech reference; append changelog

  ... (one block per file)

02-dsa/
  ...

[If stale AI/ML directories exist:]
ORPHAN content (AI/ML moved to /aipe:study-ai-engineering):
  03-ai-engineering/ exists (<N> files)
  04-machine-learning/ exists (<N> files)
  Action:   ask the user — delete, migrate, or leave as archive?

Files unchanged: <list>
```

**Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 7U. Maintain the existing voice and per-concept file structure. Append a changelog entry at the bottom of each updated file:

```
---
Updated: <today's ISO date, e.g. 2026-05-24> — <one-line summary of what changed and why>
```

For new files added: include the standard concept file structure (the file is new, so no "updated" history yet).

Do NOT rewrite accurate sections. Do NOT migrate stale AI/ML directories without explicit user confirmation — those belong in `/aipe:study-ai-engineering` now, and the migration is a separate decision.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-<purpose>/
─────────────────────────────────────────────────
Files updated:        <list>
Files added:          <list>
Files unchanged:      <count or list>
Section READMEs:      <updated / unchanged>
Orphan content:       <left as-is / removed / migrated, per user's choice>
```

**Stop. Wait for the user's next instruction.**
