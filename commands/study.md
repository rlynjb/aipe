---
description: Visual study guide for system design, DSA, and AI engineering — diagrams-first, one file per concept, with section indexes (auto-detects existing guide and updates only what changed)
---

The user invoked `/aipe:study`.

This command takes **no arguments**. There is one study guide per project, saved at `.aipe/specs/study/`. Since `.aipe/` is already per-project, no extra slug is needed. Re-running `/aipe:study` from the same project always points at the same directory — UPDATE MODE detects it cleanly.

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

Check whether `.aipe/specs/study/` already contains the study layout. The signal is the presence of `00-overview.md` at the root, OR any file inside `01-system-design/`, `02-dsa/`, or `03-ai-engineering/`.

**If any of those exist → go to UPDATE MODE (Step 5U onward). Do NOT regenerate from scratch.**

**If none exist → go to CREATE MODE (Step 5C onward).**

(The `.aipe/specs/study/` directory itself may exist as a placeholder; that's not the same as having a guide already.)

---

# CREATE MODE

Runs only when no existing study guide is found.

## Step 5C — Plan the study guide

The study spec produces a visual reference — diagrams first, prose second, designed for skimming. It is **not** an interview prep guide (that's `/aipe:interview`). The study guide explains the codebase so a reader can understand it; the interview guide prepares you to defend it under pressure.

Apply the template's structure (loaded in Step 3) and the project context. The output is a **nested directory of per-concept files**, not flat-per-section files.

The non-negotiables from the template:

1. **Visual before verbal.** Every concept opens with a diagram (ASCII box-drawing characters in fenced code blocks). If a concept can't be diagrammed, use pseudocode. If neither, a comparison table. Prose is the last resort and still comes after at least one visual.
2. **Skim-first structure.** Every individual concept gets its own `###` header — and its own file. A reader should be able to find any concept in under 10 seconds by scanning the section's `README.md` index.
3. **Self-contained blocks.** A reader who jumps to any file should not need to have read prior files to understand it. Cross-references via "**See also:**" links are fine; required reading order is not.
4. **Every algorithm gets a step-by-step execution trace** — every variable at every step, not just before/after.
5. **Decisions and tradeoffs inline.** The why is part of the what. Every non-trivial decision gets one line on the tradeoff.
6. **Every concept file ends with an Elaborate block** — Where this pattern comes from / The deeper principle / Where this breaks down / What to explore next.
7. **Every concept file ends with an Interview defense block** AFTER the Tradeoffs section — What an interviewer is really asking / Likely questions (each labelled `[mid]` `[senior]` `[arch]`) / The question candidates always dodge / One-line anchors. This turns the concept understanding into a conversation the reader can have under pressure.
8. **Every concept file ends with a Validate block** AFTER the Interview defense section — 4 levels (Reconstruct the diagram → Explain it out loud → Apply it to a new scenario → Defend the decision you'd change) plus a "Quick check — code reference test". Each level builds on the last; do not skip levels. Level 3 must reference the specific file and line range the reader checks their answer against. The validate block closes the gap between reading and knowing.
9. **Every "In this codebase" section must include a real code reference** — `**File:**` + `**Function / class:**` + `**Line range:**` (e.g., `L42–L67`). For multi-file patterns, list every file with the role each plays. No concept file ships without a code reference; the validate block depends on it for Level 3 and Level 4 to send the reader back to specific code.
10. **Every concept file opens with a two-line subtitle** directly under the H1 and BEFORE the blockquote summary. Two fields: `**Industry name(s):**` (formal/widely-recognised names this pattern goes by, comma-separated; or `— (project-specific composition of [X] + [Y])` if no formal name) and `**Type:**` (one of: `Industry standard` / `Language-agnostic` / `Industry standard · Language-agnostic` / `Project-specific`). The subtitle's job is to give the reader the vocabulary they'd use to describe this concept to other devs in conversation — so the listener can do a one-second pattern lookup instead of needing three paragraphs of context.

11. **Every concept file in `01-system-design/` includes a "Checklist step" tag** as a 4th bullet in the Quick summary section. The template defines a 6-step mental checklist for system design — `1. Data model`, `2. Request / response flow`, `3. Caching layers`, `4. State ownership`, `5. Failure handling`, `6. Scale concerns`. Each pattern lives in one or more steps; tag accordingly (e.g., `**Checklist step:** 2 (Request flow) + 4 (State ownership)`). This anchors every system-design concept in the unified framework so the reader builds one mental model across the section instead of treating each pattern as standalone trivia. The `02-dsa/` and `03-ai-engineering/` files do NOT use this field — it is system-design-only.

12. **Voice: state decisions, not hopes.** Hedging language (`this might`, `could potentially`, `tends to`) is banned. If something is a tradeoff, name it. If something is suboptimal, say so plainly — then explain why it was still the right call at the time. The reader should feel a senior colleague is explaining over coffee, not a textbook.

13. **Every concept file includes a "Why care" block** immediately after `**See also:**` and BEFORE `## Quick summary`. Two short paragraphs. No file paths, no project nouns — that's the test of a real zoom-out.
    - **Paragraph 1 — the hook.** One opening sentence that grabs attention. Pick whichever of these three angles fits best:
      - **The everyday problem they've already hit** ("You've copied a file in your terminal and watched the second one start before the first one finished — that's the same problem this pattern solves at scale.")
      - **The surprising claim** ("Most of the speed in a modern web app comes from not doing work, not from doing it faster.")
      - **The scenario that ends in a question** ("Two users open the same document, both edit the title, both hit save within a second of each other. What does the server show next? That's the question this pattern answers.")
      Then 1–2 sentences naming the underlying problem in plain English.
    - **Paragraph 2 — the zoom out.** 3–5 sentences. Name the pattern, state what it does in general terms, place it in the family of problems it belongs to, and name 1–2 other places the same pattern shows up (React's renderer abstraction, Postgres drivers, HTTP keep-alive, thread pools). End with an explicit handoff to Quick summary ("Here's what that looks like in this codebase." / "The shape it takes here is in Quick summary below.").
    What Why care is NOT: not a definition dump (definitions belong in How it works); not a tradeoff discussion (Tradeoffs has its own block); not codebase-specific (file paths and project nouns are banned here); not long (past two short paragraphs and it competes with How it works).

14. **Quick summary uses a single shape across all sections.** The bullets are `**What:**` / `**Why here:**` / `**Checklist step:**` (system-design files only — omit for DSA and AI files) / `**Tradeoff:**`. Two sentences per bullet (one line for `Checklist step`). Generic answers (`for flexibility`, `for performance`, `for scalability`) banned — every bullet must reference a real project constraint, file, or decision. Quick summary is the **zoom-in** after Why care's zoom-out: same reader, now landing in this codebase.

Diagrams use box-drawing characters: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼`. No Mermaid, no images, no PlantUML.

Every term must be shown before it's used (jargon without a diagram is forbidden).

Every file is grounded in concrete details from the project context: real file names, real operations, real data shapes.

## Step 6C — Plan the file inventory

Identify the patterns/operations to cover per section by walking the project context. Assign each a kebab-case file name with a numeric prefix (in dependency / reading order):

- **`01-system-design/`** — every significant architectural pattern in the codebase. Likely candidates: request flow, authentication boundary, serverless functions, storage layer, API design, provider abstraction. Add any others present in the codebase. Skip ones that don't apply.
- **`02-dsa/`** — every meaningful operation in the codebase. Likely candidates: reordering, deduplication, flattening, sorting, lookups, filtering, grouping, diffing. Add any others; skip ones that don't apply.
- **`03-ai-engineering/`** — universal AI concepts plus project-specific usage. Default set (include if AI is used at all): `01-what-an-llm-is`, `02-prompt-chaining`, `03-context-window`, `04-provider-abstraction`, `05-agents-vs-chains`, `06-tool-calling`, `07-rag`, `08-ai-features-in-this-app`. Add others if present. If the codebase has no AI surface, write only `08-ai-features-in-this-app.md` with a brief "no AI in this codebase" note and skip the rest.

## Step 7C — Create the directory structure

Create:

```
.aipe/specs/study/
.aipe/specs/study/01-system-design/
.aipe/specs/study/02-dsa/
.aipe/specs/study/03-ai-engineering/
```

(Use `mkdir -p`.)

## Step 8C — Generate `00-overview.md`

One full-system diagram + bullet legend (one line per component: what it is, what it does, what it talks to). **No prose paragraphs.** Save to `.aipe/specs/study/00-overview.md`.

## Step 9C — Generate per-concept files in each section

For each section (`01-system-design/`, `02-dsa/`, `03-ai-engineering/`), iterate the inventory from Step 6C. Compose ONE file per concept. Save immediately before moving to the next.

Every concept file uses this exact structure:

```markdown
# [Concept name]

**Industry name(s):** [formal/widely-recognised names this pattern goes by, comma-separated. If none, write "— (project-specific composition of [X] + [Y])"]
**Type:** [Industry standard | Language-agnostic | Industry standard · Language-agnostic | Project-specific]

> [One sentence — what this is and why it matters in this codebase. The reader should know if they need this file from this one line alone.]

**See also:** → [related-file] · → [related-file]

---

## Why care

The hook. Make the reader want to read the next thing. The file flow is hook → zoom out → zoom in → details → check, and this block opens it. Two short paragraphs. **No file paths. No project nouns.** A reader who has never seen this codebase should understand this block fully.

### Paragraph 1 — the hook

One opening sentence that grabs attention. Pick whichever of these three angles fits the pattern best:

- **The everyday problem they've already hit** — e.g., "You've copied a file in your terminal and watched the second one start before the first one finished — that's the same problem this pattern solves at scale."
- **The surprising claim** — e.g., "Most of the speed in a modern web app comes from not doing work, not from doing it faster."
- **The scenario that ends in a question** — e.g., "Two users open the same document, both edit the title, both hit save within a second of each other. What does the server show next? That's the question this pattern answers."

Then 1–2 sentences naming the underlying problem in plain English. Concrete nouns. No jargon before it's defined. The reader should finish this paragraph thinking *"huh, I want to know how that works."*

### Paragraph 2 — the zoom out

3–5 sentences. Name the pattern, state what it does in general terms, place it in the family of problems it belongs to, and name 1–2 other places the same pattern shows up — React's renderer abstraction, Postgres drivers, HTTP keep-alive, thread pools. That's the recognition hook: *"oh, that's the same thing as X."*

End on a sentence that hands off to Quick summary: "Here's what that looks like in this codebase." / "The shape it takes here is in Quick summary below." Or similar — explicit handoff, so the reader knows the zoom-in is coming.

**What Why care is NOT:**
- Not a definition dump (definitions belong in How it works).
- Not a tradeoff discussion (Tradeoffs has its own block).
- Not codebase-specific (file paths and project nouns are banned here).
- Not long (past two short paragraphs and it competes with How it works).

---

## Quick summary

Why care zoomed out. This block zooms in. A reader who opens this file, glances at the diagram, and reads only Quick summary should walk away with the pattern named with its shape in this codebase, the specific project constraint it solves, and the cost being paid. Generic answers (`for flexibility`, `for performance`, `for scalability`) are banned — every bullet must reference a real project constraint, file, or decision.

Each bullet is two sentences. The first names the thing, the second grounds it in this codebase or this constraint.

- **What:** Two sentences. First: the pattern named. Second: its shape in this codebase — what the parts are and how they connect. Concrete shape, not pure definition.
- **Why here:** Two sentences. First: the specific project constraint that drove this choice (not "for flexibility" — name what would have broken otherwise; e.g., "the team has no SRE", "user data must survive a device wipe", "model pricing changes monthly"). Second: what the obvious alternative would have broken instead.
- **Checklist step:** [system-design files only — `N (step name)` from the 6-step mental checklist; one or more steps separated by `+` (e.g., `2 (Request flow) + 4 (State ownership)`). Omit this bullet entirely for `02-dsa/` and `03-ai-engineering/` files.]
- **Tradeoff:** Two sentences. First: the specific cost this approach pays — measurable, not vague. Second: the condition under which that cost stops being acceptable. A tradeoff without its breakpoint is just a complaint.

---

## [Concept name] — diagram

[Primary diagram — always first, always labelled, ASCII box-drawing in a fenced code block]

---

## How it works

[Prose — 2–3 short paragraphs max. Direct language. No jargon without a prior diagram showing it.]

[Secondary diagrams, pseudocode, or execution traces as needed]

---

## In this codebase

Required for every file:

**File:** `path/to/file.ts`
**Function / class:** `functionName()` or `ClassName`
**Line range:** L42–L67

If multiple files are involved, list all of them with the role each plays:

**Entry point:** `netlify/functions/projects.ts` L12–L34
**Storage:**     `netlify/functions/lib/storage/projects.ts` L5–L28
**Types:**       `src/lib/types.ts` L14–L22

Show the relevant code shape in pseudocode or a trimmed real snippet if it clarifies the implementation. Do not paste large blocks — show the shape, not the full implementation. If the codebase is on GitHub, prefer GitHub link format: `[functionName](https://github.com/owner/repo/blob/main/path/to/file.ts#L42-L67)`.

---

## Elaborate

### Where this pattern comes from
[2–3 sentences on the origin — what problem the industry was trying to solve when this pattern was invented. Just enough to make the pattern feel inevitable rather than arbitrary.]

### The deeper principle
[The generalised insight. What would you take away if you never used this codebase again? Name the principle. Show with a diagram or comparison if it has structure.]

### Where this breaks down
[Concrete conditions when this pattern stops being the right choice. "When X exceeds Y" or "when Z is required". A pattern without limits is just dogma.]

### What to explore next
- [Related concept] → [one line on how it connects]
- [Adjacent pattern] → [one line on how it connects]
- [More advanced version] → [one line on how it connects]

---

## Tradeoffs

[Comparison table or bullet list — what this approach gives, what it costs, what the alternative would be and when you'd choose it instead]

---

## Interview defense

### What an interviewer is really asking
[One paragraph. Behind every technical question is a softer question: do you understand the tradeoffs, or did you just use this because everyone else does? Name what the interviewer is actually probing for. This reframe makes the questions easier to answer — the reader knows what game is being played.]

### Likely questions

[Every question an interviewer would plausibly ask about this specific concept as it appears in this codebase. Not generic — grounded in the actual implementation. Label each:]

  [mid]    — implementation knowledge
  [senior] — decision-making and tradeoffs
  [arch]   — system-level consequences and scale

[For each question:]

  Q: [the question, written as an interviewer would say it — direct, slightly uncomfortable]
  A: [Model answer in first person. 3–5 sentences. Must include:
      → the decision that was made (specific, not vague)
      → the constraint that drove it
      → the tradeoff that was accepted
      → what would change at scale or under different constraints
      Written at the level the question label indicates.]

### The question candidates always dodge
[One question per concept that trips people up. Write the question. Then write the honest answer that owns the limitation without apologising for it. Longer than the others — separates candidates who understand from candidates who built.]

### One-line anchors
[3–5 short, memorable statements about this concept that the reader can hold in their head walking into the interview. Not definitions — conclusions. The kind of thing you'd say to demonstrate you've thought about this, not just used it.]

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Close this file. Open a blank document or whiteboard. Draw the primary diagram from memory. Label every box and every arrow.

Open the file. Compare.

✓ Pass: your diagram matches the structure and labels
✗ Fail: re-read the diagram section, wait 10 minutes, try again. Do not move to Level 2 until you pass.

### Level 2 — Explain it out loud
Explain [concept name] to an imaginary colleague who just asked "how does this work in your project?" No notes. Under 90 seconds.

Checkpoints — did you:
- Name the specific file or function?  → [file reference from "In this codebase" section]
- Say why this approach was chosen over the alternative?
- Name the tradeoff in one sentence?

If you skipped any: you described it, you didn't understand it.

### Level 3 — Apply it to a new scenario
Answer this without looking at the file:

[One project-specific scenario — generated from the actual pattern, grounded in the project context. Not a textbook question. A situation that would arise in a real project using this codebase.]

Write your answer. 3–5 sentences minimum. Then open `[file at line range]` and check whether your answer matches what the code actually does.

### Level 4 — Defend the decision you'd change
Pick the biggest tradeoff from the Tradeoffs section. Answer in writing:

"If you were starting this project today with the same constraints, would you make the same decision? Why or why not? If you'd change it, what would you do instead and what would that cost?"

Reference the actual code:
→ Point to `[file]` to support what exists
→ Point to what would need to change if you chose the alternative

There is no right answer. The point is specificity. Vague answers mean you don't know the code well enough to have an opinion about it yet.

### Quick check — code reference test
Without opening any files, answer:
- What file does this pattern live in?
- What is the function or class name?
- Approximately what line range?

Then open the file and verify.

✓ Pass: you named the file and function correctly
✗ Fail on lines: that's fine — line numbers change. File and function are what matter.
```

For DSA files (in `02-dsa/`), the **How it works** section additionally must contain:
- The actual data structure shape from this codebase
- Brute force pseudocode + execution trace + complexity
- Optimal pseudocode + execution trace + complexity (with the "insight" — what brute force misses)
- Comparison table: brute force vs optimal at multiple scales
- "When brute force is fine" — sometimes it is

## Step 10C — Generate section README indexes

After all per-concept files in a section are written, create that section's `README.md`:

- **`01-system-design/README.md`** — index of pattern files (one-line description each), plus the full system map diagram from `00-overview.md` for quick reference, plus the **6-step mental checklist** (Data model / Request flow / Caching / State ownership / Failure handling / Scale concerns) reproduced verbatim from the template, with each listed pattern tagged by which step(s) it lives in. The mental checklist is what binds the section into a unified framework — readers should see it on entry, before opening any individual pattern file.
- **`02-dsa/README.md`** — index of operation files (one-line each), plus the full **complexity cheat sheet** table (every major data operation in the app, time/space, "holds at 10×?"). For every operation that doesn't hold at 10×: one-line fix and estimated effort.
- **`03-ai-engineering/README.md`** — index of AI pattern files (one-line each), plus the **AI features table** (Feature → Pattern used → Why this pattern).

The section READMEs are the navigation. They're the first thing a reader opens when they enter a section.

## Step 11C — Report + stop

Print exactly:

```
✓ Study guide created at .aipe/specs/study/
  00-overview.md
  01-system-design/  (<N> files + README.md)
  02-dsa/            (<N> files + README.md)
  03-ai-engineering/ (<N> files + README.md)
```

Then a 3-sentence summary: what the codebase being studied is, which section was richest given the actual surface area, and any operations in the DSA section that are currently O(n²) where O(n) is easy (since the spec asks for these to be flagged plainly).

**Stop. Wait for the user's next instruction.** They'll typically pick a concept file to drill on, ask for a deeper trace, or ask which operation to fix first. Do NOT auto-fix or auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing study guide. Goal: make the guide accurate again without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/specs/study/` recursively. Read every `.md` file in:

- the root (`00-overview.md`)
- `01-system-design/` (README.md + every per-pattern file)
- `02-dsa/` (README.md + every per-operation file)
- `03-ai-engineering/` (README.md + every per-pattern file)

Build a mental model of what the guide currently covers per file: the diagrams, the operations, the AI patterns, the tradeoffs.

## Step 6U — Diff the guide against the current codebase AND the current template

For every existing concept file, run TWO diffs:

**Diff A — against the current codebase context** (re-read in Step 2). Identify:

- **Outdated** — diagrams referencing stale layers, operations that no longer exist as described, AI patterns the codebase no longer uses, file/function references that have moved
- **Content missing inside existing sections** — sections of an existing concept that need new content based on codebase changes (e.g., a tradeoff table that lacks the new alternative)
- **New concepts not yet covered** — patterns/operations introduced by codebase changes that have no file yet

**Diff B — against the current per-concept template structure** (the structure described in Step 9C of CREATE MODE). The template can grow over plugin versions. Existing files generated by older versions may be **structurally incomplete**: missing entire required sections that the current template now requires. Identify:

- **Sections structurally absent** — required template elements not present in the file at all. The current required structure, in order:
  1. `# Title`
  2. **Subtitle block** — `**Industry name(s):**` line + `**Type:**` line (added v1.13.0)
  3. `> One-sentence blockquote summary`
  4. `**See also:**` line
  5. `## Why care` (added v1.18.0, replaces v1.17.0's `## In plain English`; two short paragraphs — Paragraph 1 the hook, Paragraph 2 the zoom-out + recognition hook + explicit handoff to Quick summary; no file paths or project nouns)
  6. `## Quick summary` — single shape across all sections (Quick-summary variants from v1.17.0 were removed in v1.18.0). Bullets: `**What:**` / `**Why here:**` / `**Checklist step:**` (system-design files only — omit for DSA and AI) / `**Tradeoff:**`. Every bullet two sentences (one line for Checklist step).
  7. `## [Concept] — diagram` (primary diagram)
  8. `## How it works`
  9. `## In this codebase` (must contain `**File:**`, `**Function / class:**`, `**Line range:**` — code reference is mandatory)
  10. `## Elaborate` (with subsections: Where this pattern comes from / The deeper principle / Where this breaks down / What to explore next)
  11. `## Tradeoffs`
  12. `## Interview defense` (with subsections: What an interviewer is really asking / Likely questions / The question candidates always dodge / One-line anchors)
  13. `## Validate your understanding` (with subsections: Level 1 / Level 2 / Level 3 / Level 4 / Quick check)

  If any of those is missing, flag it as "Missing section: `<section name>`" — not as a content-update issue.

  Also flag three specific structural-gap variants:
  - "Missing subtitle block (Industry name(s) + Type)" — when the file has the H1 and blockquote but no `**Industry name(s):**` / `**Type:**` lines between them.
  - "Missing code reference in: `## In this codebase`" — when the section exists but lacks the structured `**File:**` / `**Function / class:**` / `**Line range:**` lines.
  - "Missing Why care block" — when the section is absent or incomplete. Required: two short paragraphs (Paragraph 1 the hook, Paragraph 2 the zoom-out with an explicit handoff to Quick summary). No file paths, no project nouns — that's the test of a real zoom-out.
  - **Note on legacy guides:** files generated under v1.17.0 may contain `## In plain English` (with the three sub-sections `### The question` / `### The answer in one breath` / `### Where you'd see this elsewhere`) instead of the new `## Why care`. Treat this as "Section to be replaced: `## In plain English` → `## Why care`" — same fix path as a missing block, but use the existing content as source material when collapsing the three sub-sections into the two new paragraphs. Also: legacy v1.17.0 files in `02-dsa/` and `03-ai-engineering/` may use Quick summary Variant B (`**Data shape:**` / `**Operation:**` / etc.) or Variant C (`**The chain:**` / etc.) — those variants were removed in v1.18.0. Treat as "Quick summary to be migrated to single shape (What / Why here / Tradeoff)" — preserve the old bullet content as material for the new bullets.

  All three are fixed the same way: append/replace the missing structured fields in their canonical position, with values drawn from the project context.

For each file, sum the findings from both diffs. Files that are clean on both diffs are **still accurate** — leave them alone.

Look for the kinds of changes the template flags:

- New / removed / renamed files or modules
- Changed data models or storage backends
- New / swapped libraries (especially AI providers)
- New features or removed features
- Changed architectural decisions
- New operations the DSA section should cover

## Step 7U — Output the change plan and STOP for confirmation

Print a structured summary in this exact shape:

```
Changes detected for .aipe/specs/study/
─────────────────────────────────────────────────

00-overview.md
  Outdated: <e.g. layer X removed but still in the system diagram>
  Missing:  <e.g. new background-jobs layer not on the map>
  Action:   <update diagram + bullet legend / no change>

01-system-design/03-serverless-functions.md
  Outdated:        <e.g. references Netlify Blobs, but storage moved to Neon Postgres>
  Content missing: <e.g. connection pooling section>
  Section missing: <e.g. `## Interview defense` (added in template v1.11.0)>
  Action:          <update "In this codebase" + append the missing Interview defense section>

02-dsa/                          (NEW FILES)
  + 06-diff-operation.md         <new operation in src/lib/diff/ — add a file>

[continue for every file that needs work; SKIP files that are clean on both diffs]

─────────────────────────────────────────────────
Reply "yes" to apply all changes.
Reply with a path (e.g. "02-dsa/01-reordering" or just "02-dsa") to update only that scope.
Reply "no" to abort.
```

**Stop here. Wait for the user's reply.** Do NOT proceed to apply changes until the user confirms.

## Step 8U — Apply changes (after user confirms)

Run only after the user replies "yes" or with a scoped path. For each file approved:

- Edit only the sections identified as outdated, content-missing, or structurally absent.
- For **structurally absent sections**, append the section in canonical order. The current sequence is: Title → **Subtitle (Industry name(s) + Type)** → blockquote → See also → **Why care** → Quick summary (single shape) → diagram → How it works → In this codebase → Elaborate → Tradeoffs → Interview defense → Validate your understanding.
- For a **missing subtitle block**, insert two lines immediately after the H1 and before the blockquote:
  - `**Industry name(s):**` followed by formal/widely-recognised names this pattern goes by (or `— (project-specific composition of [X] + [Y])` if none).
  - `**Type:**` followed by one of `Industry standard` / `Language-agnostic` / `Industry standard · Language-agnostic` / `Project-specific`.
  Pick the labels from your understanding of the concept; do not require the user to choose. The reader can correct it later if needed.
- For an **"In this codebase" section missing the structured code reference**, append `**File:**` / `**Function / class:**` / `**Line range:**` lines using values drawn from the project context. The Validate block's Level 3 and Level 4 reference back into this section, so a missing code reference cascades into validate-block-incompleteness.
- For a **Why care block missing or incomplete**, insert (or complete) the section between the `**See also:**` line and `## Quick summary`. Two short paragraphs required: paragraph 1 is the hook (one opening sentence from the three angles: everyday problem / surprising claim / scenario ending in question, then 1–2 sentences naming the underlying problem). Paragraph 2 is the zoom-out (3–5 sentences naming the pattern, the family of problems, 1–2 other places it shows up, ending with an explicit handoff to Quick summary like "Here's what that looks like in this codebase."). No file paths, no project nouns inside this block.
- For a **legacy `## In plain English` block (v1.17.0 shape)**, REPLACE the section with `## Why care`. Collapse the three sub-sections into two paragraphs: paragraph 1 turns "The question" into the hook (rephrase the question as one of the three angles), paragraph 2 fuses "The answer in one breath" + "Where you'd see this elsewhere" into a single zoom-out paragraph with an explicit handoff sentence. Old content is reusable as source material.
- For a **legacy Quick summary Variant B or C (v1.17.0 shape)** in `02-dsa/` or `03-ai-engineering/` files, REPLACE the bullet set with the v1.18.0 single shape: `**What:**` / `**Why here:**` / `**Tradeoff:**`. Map the old bullets to the new ones (e.g., Variant B's `**Operation:**` → `**What:**`'s shape sentence; `**Breakpoint:**` → `**Tradeoff:**`'s breakpoint sentence). Preserve the old prose as material; drop the variant-specific labels.
- For a **system-design file missing the Checklist step bullet**, insert a `**Checklist step:**` bullet in Quick summary between `**Why here:**` and `**Tradeoff:**`. Pick the step(s) (1–6) from the agent's understanding of which mental-checklist step(s) the pattern lives in.
- If the **system-design `README.md` is missing the 6-step mental checklist**, append it after the existing index. Tag each listed pattern with its checklist step(s) so the section README is the unified framework view.
- Do NOT rewrite accurate sections.
- Maintain the existing voice and per-concept file structure.
- Apply the template's diagram + pseudocode + trace requirements to any new concepts you add.
- If new concept files are added: also update the relevant section `README.md` index AND any cross-section "See also" links that should point at them.
- Append a changelog entry at the bottom of each updated file:

  ```
  ---
  Updated: <today's ISO date, e.g. 2026-05-07> — <one-line summary of what changed and why>
  ```

- For new files added: instead of a changelog entry, just include the standard concept file structure (the file is new, so no "updated" history yet).

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/specs/study/
─────────────────────────────────────────────────
Files updated:        <list, e.g. 01-system-design/03-serverless-functions, 02-dsa/01-reordering>
Files added:          <list, e.g. 02-dsa/06-diff-operation>
Files unchanged:      <count or list>
Section READMEs
  reindexed:          <list of READMEs touched>
File references that
  no longer exist:    <list — these need manual review>
```

**Stop. Wait for the user's next instruction.**
