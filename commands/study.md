---
description: Visual study guide for system design, DSA, and AI engineering — diagrams, pseudocode, traces (auto-detects existing guide and updates only what changed)
---

The user invoked `/aipe:study`.

This command takes **no arguments**. There is one study guide per project, saved at `.aipe/specs/study/`. Since `.aipe/` is already per-project, no extra slug is needed to disambiguate guides. Re-running `/aipe:study` from the same project always points at the same directory — UPDATE MODE detects it cleanly.

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

## Step 3 — Load the `study` template

Read the template at:

```
${CLAUDE_PLUGIN_ROOT}/specs/study.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` upward from this file's location.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/specs/study/` already contains any of the four study chapter files (`00-overview.md`, `01-system-design.md`, `02-dsa.md`, `03-ai-engineering.md`).

**If any exist → go to UPDATE MODE (Step 5U onward). Do NOT regenerate from scratch.**

**If none exist → go to CREATE MODE (Step 5C onward).**

(The `.aipe/specs/study/` directory itself may exist as an empty placeholder created by Step 1; that's not the same as having a guide already. Check for the actual chapter files.)

---

# CREATE MODE

Runs only when no existing study guide is found.

## Step 5C — Plan the study guide

The study spec produces a visual reference — diagrams first, prose second, designed for skimming. It is **not** an interview prep guide (that's `/aipe:interview`). The study guide explains the codebase so a reader can understand it; the interview guide prepares you to defend it under pressure.

Apply the template's structure (loaded in Step 3) and the project context. The template defines exactly **4 files**: an overview + system design + DSA + AI engineering.

The non-negotiables from the template:

1. **Visual before verbal.** Every concept opens with a diagram (ASCII box-drawing characters in fenced code blocks). If a concept can't be diagrammed, use pseudocode. If neither, a comparison table. Prose is the last resort and still comes after at least one visual.
2. **Skim-first structure.** Every individual concept gets its own `###` header — not just major sections. A reader should be able to find any concept in under 10 seconds by scanning headers.
3. **Self-contained blocks.** A reader who jumps to any section should not need to have read prior sections to understand what's there. Cross-references are fine; required reading order is not.
4. **Every algorithm gets a step-by-step execution trace** — every variable at every step, not just before/after. This is the most valuable part of the DSA section.
5. **Decisions and tradeoffs inline.** The why is part of the what. Every non-trivial decision gets one line on the tradeoff.

Diagrams use box-drawing characters: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼`. No Mermaid, no images, no PlantUML.

Every term must be shown before it's used (jargon without a diagram is forbidden).

Every chapter is grounded in concrete details from the project context: real file names, real operations, real data shapes. No abstract examples — use the actual data the app operates on for the DSA section.

## Step 6C — Create the output directory

Directory: `.aipe/specs/study/`

Create it (`mkdir -p` is fine; the directory may already exist as a sibling to other spec types but lacks the chapter files).

## Step 7C — Generate and save each chapter sequentially

For each row below: compose only that chapter's content following the template's section requirements, then immediately Write it to the named file before moving on.

| File | Section | What goes in it |
|---|---|---|
| `00-overview.md` | System Overview | One full-system diagram with every layer and connection labelled. Bullet legend (one line per component: what it is, what it does, what it talks to). **No prose paragraphs in this file.** |
| `01-system-design.md` | System Design | Every significant architectural pattern in this codebase. Per concept: diagram → "What it is" / "Why it's used here" / "Tradeoff" (one sentence each) → optional pseudocode and/or comparison table. Concepts: request flow, auth boundary, serverless functions, storage layer, API design, provider abstraction (if present), and any others surfaced by the project context. |
| `02-dsa.md` | Data Structures and Algorithms | Every algorithm or data structure grounded in a real operation from THIS codebase. Per operation: real operation + file → the actual data shape → brute force pseudocode + execution trace + complexity → optimal pseudocode + execution trace + complexity → comparison table → "When brute force is fine". End with a complexity cheat sheet (every major data operation in the app, time/space, and whether it holds at 10× scale). |
| `03-ai-engineering.md` | AI Engineering | Every AI pattern in this codebase. Concepts: what an LLM actually is (IO model, not architecture), prompt chaining (single-purpose vs multi-purpose), context window (visualised as a fixed container), provider abstraction (factory diagram), agents vs chains (linear vs loop diagrams), tool calling (mechanics, not concept), RAG (pattern diagram), and a table of how this codebase uses AI specifically. |

**No README.md** — the headers within each file are the navigation. The four file names ARE the table of contents.

If the codebase has no AI surface, still write `03-ai-engineering.md` but keep it brief and explicit ("This codebase has no LLM/agent component. If you add one, here's the patterns to reach for: …"). Don't fabricate AI usage.

## Step 8C — Report + stop

Print exactly:

```
✓ Study guide created at .aipe/specs/study/
  4 files: 00-overview, 01-system-design, 02-dsa, 03-ai-engineering
```

Then a 3-sentence summary: what the codebase being studied is, which section was richest given the actual surface area, and any operations in the DSA section that are currently O(n²) where O(n) is easy (since the spec asks for these to be flagged plainly).

**Stop. Wait for the user's next instruction.** They'll typically pick a section to skim, ask for a deeper trace, or ask which operation to fix first. Do NOT auto-fix or auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing study guide. Goal: make the guide accurate again without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Read every `.md` file inside `.aipe/specs/study/` (the 4 chapter files; there's no README.md for study). Build a mental model of what the guide currently shows: which diagrams it contains, which operations it covers in DSA, which AI patterns it explains.

## Step 6U — Diff the guide against the current codebase

Re-read the project context loaded in Step 2 — that's "the codebase as of now". Compare against what each of the 4 study files says.

For every file, identify:

- **Outdated** — diagrams that reference stale layers, operations that no longer exist, AI patterns the codebase no longer uses
- **Missing** — new architecture, new operations, new AI patterns the guide doesn't yet cover
- **Still accurate** — leave these alone
- **Partially accurate** — update the specific concept block, not the whole file

Look for the kinds of changes the template flags:

- New / removed / renamed files or modules
- Changed data models or storage backends
- New / swapped libraries (especially AI providers)
- New features or removed features
- Changed architectural decisions (e.g., serverless → server, single-provider → multi-provider)
- New operations the DSA section should cover

## Step 7U — Output the change plan and STOP for confirmation

Print a structured summary in this exact shape:

```
Changes detected for .aipe/specs/study/
─────────────────────────────────────────────────

00-overview.md
  Outdated: <e.g. layer X removed, but still in the system diagram>
  Missing:  <e.g. new background-jobs layer not on the map>
  Action:   <update diagram + bullet legend / no change>

02-dsa.md
  Outdated: <e.g. reorder-actions complexity is now O(n) but trace shows old O(n²) version>
  Missing:  <e.g. new diff operation in src/lib/diff/ not covered>
  Action:   <update one concept + add new concept block>

[continue for every file that needs work; SKIP files that don't]

─────────────────────────────────────────────────
Reply "yes" to apply all changes.
Reply with a file name (e.g. "02-dsa") to update only that file.
Reply "no" to abort.
```

**Stop here. Wait for the user's reply.** Do NOT proceed to apply changes until the user confirms.

## Step 8U — Apply changes (after user confirms)

Run only after the user replies "yes" or with a file name. For each file approved:

- Edit only the sections identified as outdated or missing.
- Do NOT rewrite accurate sections.
- Maintain the existing voice and visual-first structure (diagram before prose, `###` per concept, self-contained blocks).
- Apply the template's diagram + pseudocode + trace requirements to any new concepts you add.
- Append a changelog entry at the bottom of each updated file:

  ```
  ---
  Updated: <today's ISO date, e.g. 2026-05-07> — <one-line summary of what changed and why>
  ```

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/specs/study/
─────────────────────────────────────────────────
Files updated:        <list, e.g. 02-dsa, 03-ai-engineering>
Files unchanged:      <list>
New concepts added:   <list with file, e.g. "diff operation (02-dsa)">
Stale content removed: <list with file>
File references that
  no longer exist:    <list — these need manual review>
```

**Stop. Wait for the user's next instruction.**
