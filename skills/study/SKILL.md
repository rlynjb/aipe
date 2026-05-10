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
${CODEX_PLUGIN_ROOT}/specs/study.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` upward from this file's location.

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

1. **Visual before verbal — but the primary diagram is the recap.** Every concept has ONE primary diagram (ASCII box-drawing in a fenced code block) that sits AFTER `## How it works` as the recap visual — a reader who only looks at it should grasp the structure. Inside `## How it works`, every paragraph that introduces jargon must anchor it with a secondary visual in the same paragraph: a small diagram, a pseudocode block, a comparison table, or an execution trace. Prose alone is the last resort. The primary diagram must label every architectural layer it spans — UI layer, Service layer, Storage layer, Network boundary, Provider layer — using a left-margin label, a horizontal divider with the layer name, or grouped boxes inside a labelled band.
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

13. **Every concept file includes a "Why care" block** immediately after `**See also:**` and BEFORE `## How it works`. Two short paragraphs. No file paths, no project nouns — that's the test of a real zoom-out.
    - **Paragraph 1 — the hook.** One opening sentence that grabs attention. Pick whichever of these three angles fits best:
      - **The everyday problem they've already hit** ("You've copied a file in your terminal and watched the second one start before the first one finished — that's the same problem this pattern solves at scale.")
      - **The surprising claim** ("Most of the speed in a modern web app comes from not doing work, not from doing it faster.")
      - **The scenario that ends in a question** ("Two users open the same document, both edit the title, both hit save within a second of each other. What does the server show next? That's the question this pattern answers.")
      Then 1–2 sentences naming the underlying problem in plain English.
    - **Paragraph 2 — the zoom out.** 3–5 sentences. Name the pattern, state what it does in general terms, place it in the family of problems it belongs to, and name 1–2 other places the same pattern shows up (React's renderer abstraction, Postgres drivers, HTTP keep-alive, thread pools). End with an explicit handoff to How it works ("Here's how that actually works in this codebase." / "How it shows up here is in the next block.").
    What Why care is NOT: not a definition dump (definitions belong in How it works); not a tradeoff discussion (Tradeoffs has its own block); not codebase-specific (file paths and project nouns are banned here); not long (past two short paragraphs and it competes with How it works).

14. **Quick summary is the RECAP block, positioned after Tradeoffs and before Interview defense.** Not the zoom-in. By the time the reader gets here, they've seen the hook, the diagram, the mechanics, the codebase references, and the tradeoffs. Quick summary collapses all of that into a one-paragraph recap plus a bulleted key-point list. It's the block the reader returns to in three weeks to remember what this file was about. **No new information** — everything in Quick summary must already appear earlier in the file.
    - **Part 1 — concept recap (one paragraph, 3–5 sentences).** Cover: what the pattern is (pulled from Why care's paragraph 2), how it shows up in this codebase (from How it works or In this codebase), the constraint that forced it (from Tradeoffs), the cost being paid (from Tradeoffs). Written as if a colleague asked "wait, what's this file about again?" — the answer they get without scrolling.
    - **Part 2 — key points to remember (3–6 bullets).** Short, declarative one-sentence statements. The kind of thing the reader could write on an index card. Each bullet: one sentence (longer belongs in How it works or Tradeoffs); a conclusion not a definition ("X happens before Y" not "X is a function that does Y"); specific to this codebase where it matters (generic facts about the pattern belong in Why care). Mix categories: at least one shape ("the parts and how they connect"), at least one rule ("the invariant this pattern maintains"), at least one tradeoff ("the cost being paid"). A reader who skims only the bullets walks away with the shape, the rule, and the cost.

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

The hook. Make the reader want to read the next thing. The file flow is hook → zoom out → mechanics → diagram → tradeoffs → recap → check, and this block opens it. Two short paragraphs. **No file paths. No project nouns.** A reader who has never seen this codebase should understand this block fully.

### Paragraph 1 — the hook

One opening sentence that grabs attention. Pick whichever of these three angles fits the pattern best:

- **The everyday problem they've already hit** — e.g., "You've copied a file in your terminal and watched the second one start before the first one finished — that's the same problem this pattern solves at scale."
- **The surprising claim** — e.g., "Most of the speed in a modern web app comes from not doing work, not from doing it faster."
- **The scenario that ends in a question** — e.g., "Two users open the same document, both edit the title, both hit save within a second of each other. What does the server show next? That's the question this pattern answers."

Then 1–2 sentences naming the underlying problem in plain English. Concrete nouns. No jargon before it's defined. The reader should finish this paragraph thinking *"huh, I want to know how that works."*

### Paragraph 2 — the zoom out

3–5 sentences. Name the pattern, state what it does in general terms, place it in the family of problems it belongs to, and name 1–2 other places the same pattern shows up — React's renderer abstraction, Postgres drivers, HTTP keep-alive, thread pools. That's the recognition hook: *"oh, that's the same thing as X."*

End on a sentence that hands off to How it works: "Here's how that actually works in this codebase." / "How it shows up here is in the next block." Or similar — explicit handoff, so the reader knows the mechanics are coming.

**What Why care is NOT:**
- Not a definition dump (definitions belong in How it works).
- Not a tradeoff discussion (Tradeoffs has its own block).
- Not codebase-specific (file paths and project nouns are banned here).
- Not long (past two short paragraphs and it competes with How it works).

---

## How it works

[Prose — 2–3 short paragraphs max. Direct language. Write like explaining to a colleague who asked "how does this actually work?"]

[Secondary diagrams, pseudocode, or execution traces **inline** where they earn their place. The reader should never encounter a piece of jargon without a visual anchoring it within the same paragraph — a small diagram, a pseudocode block, a comparison table, or an execution trace.]

End with a sentence that hands off to the primary diagram: "The full picture is below." / "Here's the diagram of the whole flow." The diagram that follows is the recap visual — it shows everything the prose just walked through, in one frame.

---

## [Concept name] — diagram

[Primary diagram — comes AFTER How it works as the recap visual. ASCII box-drawing in a fenced code block. Labels every box, every arrow, and **every architectural layer** the system spans (UI layer, Service layer, Storage layer, Network boundary, Provider layer — whichever apply). Use a left-margin label, a horizontal divider with the layer name, or grouped boxes inside a labelled band. Stands alone — a reader who only looks at this diagram should grasp the structure without reading the prose above. Example shape:]

```
Request flow with layers

┌─ UI layer ──────────────────────────────────┐
│  Browser   →   React component              │
└─────────────────────────────────────────────┘
            │
            ▼  HTTP POST /api/sessions
┌─ Service layer ─────────────────────────────┐
│  Netlify function   →   Auth middleware     │
│                     →   Handler             │
└─────────────────────────────────────────────┘
            │
            ▼  storage.set(key, value)
┌─ Storage layer ─────────────────────────────┐
│  Netlify Blobs                              │
└─────────────────────────────────────────────┘
```

The labelled bands make the boundaries reviewable. Without them the reader sees boxes and arrows; with them they see where the network sits, where auth sits, where the data finally lands.

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

## Quick summary

The recap. By the time the reader lands here they've seen the hook, the diagram, the mechanics, the codebase references, and the tradeoffs. Quick summary collapses all of that into a one-paragraph recap plus a bulleted key-point list. It is the block the reader returns to in three weeks to remember what this file was about. **No new information** — everything here must already appear earlier in the file.

Two parts, in this order.

### Part 1 — concept recap (one paragraph)

3–5 sentences. Cover:

- What the pattern is — one sentence, pulled from Why care's paragraph 2 (the concept, not the implementation).
- How it shows up in this codebase — one sentence, pulled from How it works or In this codebase.
- The constraint that made it the right call here — one sentence, pulled from Tradeoffs.
- The cost being paid for that choice — one sentence, pulled from Tradeoffs.

Write it as if a colleague asked *"wait, what's this file about again?"* — the answer they get without scrolling.

### Part 2 — key points to remember (3–6 bullets)

Short, declarative one-sentence statements. The kind of thing the reader could write on an index card. Each bullet:

- One sentence — bullets that need two sentences belong in How it works or Tradeoffs.
- A conclusion, not a definition — "X happens before Y", not "X is a function that does Y".
- Specific to this codebase where it matters — generic facts about the pattern belong in Why care.

Mix categories. At least one **shape** ("the parts and how they connect"), at least one **rule** ("the invariant this pattern maintains"), at least one **tradeoff** ("the cost being paid"). For `01-system-design/` files, include one bullet that names the **checklist step(s)** this pattern lives in (e.g., "Lives in step 2 (Request flow) and step 4 (State ownership) of the system-design checklist"). A reader who skims only the bullets should walk away with the shape, the rule, and the cost.

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
  5. `## Why care` (added v1.18.0, replaces v1.17.0's `## In plain English`; two short paragraphs — Paragraph 1 the hook, Paragraph 2 the zoom-out + recognition hook + explicit handoff to How it works; no file paths or project nouns; the handoff target changed in v1.20.0 — was "diagram and How it works" in v1.19.0, now just "How it works")
  6. `## How it works` (moved BEFORE the primary diagram in v1.20.0; 2–3 short paragraphs; every paragraph that introduces jargon must anchor it with a secondary visual in the same paragraph — small diagram, pseudocode, comparison table, or execution trace; ends with an explicit handoff sentence to the primary diagram, e.g. "The full picture is below.")
  7. `## [Concept] — diagram` (moved AFTER How it works in v1.20.0 as the recap visual; must label every architectural layer it spans — UI / Service / Storage / Network boundary / Provider — using left-margin labels, horizontal dividers with layer names, or grouped boxes inside labelled bands)
  8. `## In this codebase` (must contain `**File:**`, `**Function / class:**`, `**Line range:**` — code reference is mandatory)
  9. `## Elaborate` (with subsections: Where this pattern comes from / The deeper principle / Where this breaks down / What to explore next)
  10. `## Tradeoffs`
  11. `## Quick summary` (RECAP position since v1.19.0 — after Tradeoffs, before Interview defense). Two parts: Part 1 is a one-paragraph concept recap (3–5 sentences covering what the pattern is, how it shows up in this codebase, the constraint that forced it, the cost paid). Part 2 is 3–6 short declarative key-point bullets mixing shape / rule / tradeoff (system-design files include one bullet naming the checklist step(s) the pattern lives in). No new information — everything must already appear earlier in the file.
  12. `## Interview defense` (with subsections: What an interviewer is really asking / Likely questions / The question candidates always dodge / One-line anchors)
  13. `## Validate your understanding` (with subsections: Level 1 / Level 2 / Level 3 / Level 4 / Quick check)

  If any of those is missing, flag it as "Missing section: `<section name>`" — not as a content-update issue.

  Also flag these specific structural-gap variants:
  - "Missing subtitle block (Industry name(s) + Type)" — when the file has the H1 and blockquote but no `**Industry name(s):**` / `**Type:**` lines between them.
  - "Missing code reference in: `## In this codebase`" — when the section exists but lacks the structured `**File:**` / `**Function / class:**` / `**Line range:**` lines.
  - "Missing Why care block" — when the section is absent or incomplete. Required: two short paragraphs (Paragraph 1 the hook, Paragraph 2 the zoom-out with an explicit handoff to How it works). No file paths, no project nouns — that's the test of a real zoom-out.
  - "Primary diagram in wrong position (still before How it works)" — flag any file where `## [Concept] — diagram` sits before `## How it works`. In v1.20.0 the order swapped: How it works walks the mechanics in prose first, then the primary diagram appears as the recap visual. The fix is to SWAP the two sections.
  - "Primary diagram missing architectural-layer labels" — flag any primary diagram that crosses a system boundary (UI ↔ Service, Service ↔ Storage, app ↔ Provider) without naming the boundary. The diagram must label each layer it spans using a left-margin label, a horizontal divider with the layer name, or grouped boxes inside a labelled band.
  - "How it works missing in-paragraph anchors" — flag any `## How it works` paragraph that introduces jargon without a secondary visual in the same paragraph (small diagram, pseudocode block, comparison table, or execution trace). Prose-only paragraphs that introduce new terms are not allowed.
  - "How it works missing handoff sentence to the primary diagram" — flag any `## How it works` block that ends without an explicit handoff line ("The full picture is below." / "Here's the diagram of the whole flow." / similar).
  - "Quick summary in wrong position (still after Why care)" — flag any v1.18.0-shape Quick summary that sits between Why care and How it works/diagram. It must be MOVED to after Tradeoffs and before Interview defense, AND RESHAPED from the bullet-only zoom-in form to the v1.19.0+ recap form (Part 1 concept-recap paragraph + Part 2 key-point bullets).
  - "Why care still hands off to Quick summary or to the diagram" — flag any Why care paragraph 2 whose closing sentence says "Quick summary below" (v1.18.0 wording) or "diagram below" / "diagram and How it works" (v1.19.0 wording). The handoff target is now How it works alone.
  - **Note on legacy guides:**
    - Files generated under **v1.17.0** may contain `## In plain English` (with the three sub-sections `### The question` / `### The answer in one breath` / `### Where you'd see this elsewhere`) instead of the new `## Why care`. Treat as "Section to be replaced: `## In plain English` → `## Why care`" — use the existing content as source material when collapsing the three sub-sections into the two new paragraphs.
    - Files generated under **v1.17.0** in `02-dsa/` and `03-ai-engineering/` may use Quick summary Variant B (`**Data shape:**` / `**Operation:**` / etc.) or Variant C (`**The chain:**` / etc.). Those variants were removed in v1.18.0 and the whole block has since moved + reshaped in v1.19.0. Treat as "Quick summary to be migrated to v1.19.0 recap form (paragraph + key points) AND moved to after Tradeoffs" — preserve the old bullet content as raw material for the new recap sentences and key-point bullets.
    - Files generated under **v1.18.0** have Quick summary in the WRONG position (between Why care and the diagram) and in the WRONG shape (single zoom-in bullet list of `**What:**` / `**Why here:**` / `**Checklist step:**` / `**Tradeoff:**`). Treat as "Quick summary to be moved (to after Tradeoffs) AND reshaped (to Part 1 recap paragraph + Part 2 key-point bullets)". The v1.18.0 bullet content is reusable material — `**What:**` and `**Why here:**` feed Part 1's "what the pattern is" and "how it shows up here" sentences; `**Tradeoff:**` feeds Part 1's "constraint" and "cost" sentences; `**Checklist step:**` becomes one of Part 2's key-point bullets.
    - Files generated under **v1.19.0** have the primary diagram in the WRONG position (still before `## How it works`) and a Why care paragraph 2 whose handoff sentence points at "the diagram and How it works". v1.20.0 swapped the order — How it works comes first, primary diagram follows as recap visual — and the Why care handoff now points at How it works alone. Treat as "Sections to be reordered: `## How it works` and `## [Concept] — diagram` must be SWAPPED so How it works is first". Also: append a handoff sentence at the end of How it works pointing at the primary diagram below; add architectural-layer labels to the primary diagram if it crosses any layer boundary; rewrite the Why care paragraph 2 closing sentence to hand off to How it works only.

  All variants are fixed the same way: insert/replace/reorder the structured fields in their canonical position, with values drawn from the project context and from existing-block content where present.

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
- For **structurally absent sections**, append the section in canonical order. The current sequence is: Title → **Subtitle (Industry name(s) + Type)** → blockquote → See also → **Why care** → **How it works** → **[Concept] — diagram (recap visual, labels every layer)** → In this codebase → Elaborate → Tradeoffs → **Quick summary (recap form)** → Interview defense → Validate your understanding.
- For a **missing subtitle block**, insert two lines immediately after the H1 and before the blockquote:
  - `**Industry name(s):**` followed by formal/widely-recognised names this pattern goes by (or `— (project-specific composition of [X] + [Y])` if none).
  - `**Type:**` followed by one of `Industry standard` / `Language-agnostic` / `Industry standard · Language-agnostic` / `Project-specific`.
  Pick the labels from your understanding of the concept; do not require the user to choose. The reader can correct it later if needed.
- For an **"In this codebase" section missing the structured code reference**, append `**File:**` / `**Function / class:**` / `**Line range:**` lines using values drawn from the project context. The Validate block's Level 3 and Level 4 reference back into this section, so a missing code reference cascades into validate-block-incompleteness.
- For a **Why care block missing or incomplete**, insert (or complete) the section between the `**See also:**` line and `## How it works`. Two short paragraphs required: paragraph 1 is the hook (one opening sentence from the three angles: everyday problem / surprising claim / scenario ending in question, then 1–2 sentences naming the underlying problem). Paragraph 2 is the zoom-out (3–5 sentences naming the pattern, the family of problems, 1–2 other places it shows up, ending with an explicit handoff to How it works like "Here's how that actually works in this codebase." or "How it shows up here is in the next block."). No file paths, no project nouns inside this block.
- For a **Why care block whose closing sentence hands off to the wrong place** — either "Quick summary below" (v1.18.0 wording) or "diagram below" / "diagram and How it works" (v1.19.0 wording) — rewrite only that closing sentence so it hands off to How it works alone. Leave the rest of paragraph 2 alone if the content is otherwise correct.
- For a **primary diagram in the v1.19.0 position** (sitting before `## How it works`), SWAP the two sections so `## How it works` comes first and `## [Concept] — diagram` follows as the recap visual. Do not rewrite either section's content during the swap; just reorder them.
- For a **`## How it works` block missing a handoff sentence to the primary diagram**, append one closing sentence pointing at the diagram below ("The full picture is below." / "Here's the diagram of the whole flow." / similar).
- For a **`## How it works` paragraph that introduces jargon without an in-paragraph visual**, add a secondary visual inside that paragraph: a small diagram, a pseudocode block, a comparison table, or an execution trace — whichever earns its place. The rule is that no piece of jargon lands in a paragraph without a visual anchoring it in the same paragraph.
- For a **primary diagram missing architectural-layer labels** (the diagram crosses a UI ↔ Service, Service ↔ Storage, or app ↔ Provider boundary without naming it), add the layer labels. Use whichever shape fits: a left-margin label, a horizontal divider with the layer name, or grouped boxes inside a labelled band (`┌─ Service layer ──┐ ... └────────────┘`). Pick the labels from the system map in `00-overview.md` so the bands match the layers the system actually has.
- For a **legacy `## In plain English` block (v1.17.0 shape)**, REPLACE the section with `## Why care`. Collapse the three sub-sections into two paragraphs: paragraph 1 turns "The question" into the hook (rephrase the question as one of the three angles), paragraph 2 fuses "The answer in one breath" + "Where you'd see this elsewhere" into a single zoom-out paragraph with an explicit handoff sentence pointing at How it works. Old content is reusable as source material.
- For a **Quick summary in the v1.18.0 position and shape** (still sitting between Why care and the diagram/How it works, as a bullet list of `**What:**` / `**Why here:**` / `**Checklist step:**` / `**Tradeoff:**`), do BOTH: (a) DELETE the block from its old position, and (b) INSERT a new Quick summary block in the v1.19.0 recap form between Tradeoffs and Interview defense. The v1.19.0 recap form has two parts: **Part 1** is a single paragraph of 3–5 sentences (what the pattern is / how it shows up in this codebase / the constraint that forced it / the cost being paid); **Part 2** is 3–6 short declarative key-point bullets mixing shape / rule / tradeoff. For system-design files, include one bullet in Part 2 that names the checklist step(s) the pattern lives in. Reuse the v1.18.0 bullet content as raw material: `**What:**`'s second sentence feeds Part 1's "how it shows up here" sentence; `**Why here:**` feeds Part 1's "constraint" sentence; `**Tradeoff:**` feeds Part 1's "cost" sentence; `**Checklist step:**` becomes the system-design checklist-step bullet in Part 2.
- For a **legacy Quick summary Variant B or C (v1.17.0 shape)** in `02-dsa/` or `03-ai-engineering/` files, treat it the same as the v1.18.0 case: DELETE from old position, INSERT v1.19.0 recap form after Tradeoffs. Map the legacy bullets through the v1.18.0 → v1.19.0 path (Variant B's `**Operation:**` → Part 1's "what the pattern is" sentence; `**Breakpoint:**` → Part 1's "constraint" sentence; etc.). Preserve old prose as material; drop the variant-specific labels.
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
