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

13. **Every concept file includes an "In plain English" block** immediately after `**See also:**` and BEFORE `## Quick summary`. Three sub-sections:
    - `### The question` — one sentence, the universal question this pattern answers (written as a question, no project nouns, no file paths).
    - `### The answer in one breath` — two sentences max; the pattern's core idea, codebase-agnostic.
    - `### Where you'd see this elsewhere` — 2–4 examples of where this same pattern shows up in other systems the reader has likely touched (React's renderer abstraction, HTTP keep-alive, thread pools, etc.). This is the recognition hook.
    The block exists to anchor the reader's brain to the universal concept BEFORE the codebase-specific shape. Generic answers ("How do we improve flexibility?") and codebase-specific answers ("How does our system handle requests?") are both banned here — name the universal pattern question.

14. **Quick summary uses one of three variants depending on the directory.** Each section asks different questions, so each gets a tailored block. The bullet labels and contents differ — pick by the directory the file lives in:
    - **Variant A — `01-system-design/`:** `**What:**` / `**Why here:**` / `**Checklist step:**` / `**Tradeoff:**`. Architectural decisions: what was built, what constraint forced it, which checklist step it lives in, what was traded.
    - **Variant B — `02-dsa/`:** `**Data shape:**` / `**Operation:**` / `**Complexity now:**` / `**Breakpoint:**`. Operations on data: real shape + size class, what's done to it, current Big-O, the scale at which it breaks.
    - **Variant C — `03-ai-engineering/`:** `**The chain:**` / `**Why this shape:**` / `**Failure mode:**` / `**Cost:**`. Chains and prompts: single-job description + IO contract, what forced the topology, how it misbehaves and what's done about it, tokens-per-call and breakpoint cost.
    Every bullet is two sentences (or one line for `Checklist step` / `Complexity now`). Generic answers banned across all three variants — every bullet must reference a real project constraint, file, or measurement.

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

## In plain English

Anchor the reader's brain to the universal concept BEFORE describing how it shows up in this codebase. Three sub-blocks. No file paths, no project nouns inside this section.

### The question
[One sentence — the universal question a working engineer asks when they reach for this pattern. Written as a question, not a statement. Examples: "How do I swap one implementation for another without rewriting every call site?" / "How do I make the interface feel instant when the server takes 200ms to confirm?" / "How do I reorder a list of N items by a new order of IDs in linear time?". Banned: vague questions like "How do we improve flexibility?", or codebase-specific ones like "How does our system handle requests?".]

### The answer in one breath
[Two sentences max. The pattern's core idea, codebase-agnostic. No mention of this project. Example for connection pooling: "Keep a pool of pre-opened connections warm and lend them out one at a time. The cost of opening is paid once at startup; every request after that borrows a connection that's already live."]

### Where you'd see this elsewhere
[2–4 bullet points naming other systems where this same pattern shows up. The recognition hook — "oh, that's the same thing as X." Pick examples the reader has likely touched. For provider abstraction: React's renderer abstraction (DOM/native/server) · Database drivers (Postgres/MySQL/SQLite behind the same interface) · Storage SDKs (S3/GCS/R2 behind the same SDK).]

---

## Quick summary

This section is the codebase-specific TL;DR. The "In plain English" block above answered the universal question; this block answers it for THIS project.

A reader who opens this file, glances at the diagram, and reads only Quick summary should walk away with the pattern named in its shape here, the specific project constraint that made it the right call, and the cost being paid. Generic answers (`for flexibility`, `for performance`, `for scalability`) are banned — every bullet must reference a real project constraint, file, or measurement.

The bullet labels and contents differ per section. Use the variant that matches the directory the file lives in.

### Variant A — for `01-system-design/` files

- **What:** Two sentences. First: the pattern named. Second: its shape in this codebase — what the parts are and how they connect. Concrete shape, not pure definition.
- **Why here:** Two sentences. First: the specific project constraint that drove this choice (not "for flexibility" — name what would have broken otherwise; e.g., "the team has no SRE", "user data must survive a device wipe", "model pricing changes monthly"). Second: what the obvious alternative would have broken instead.
- **Checklist step:** One line. `N (step name)` from the 6-step mental checklist; one or more steps separated by `+` (e.g., `2 (Request flow) + 4 (State ownership)`).
- **Tradeoff:** Two sentences. First: the specific cost this approach pays — measurable, not vague. Second: the condition under which that cost stops being acceptable. A tradeoff without its breakpoint is just a complaint.

### Variant B — for `02-dsa/` files

- **Data shape:** Two sentences. First: the actual structure this operates on — not generic "an array of items", the real shape from this codebase (e.g., "An array of `Action` objects, each with `{id, projectId, position, createdAt}`"). Second: the size class in practice (e.g., "typically under 100 items per project; one outlier has 800"). Size is what makes complexity a real question or a theoretical one.
- **Operation:** Two sentences. First: what's being done to the data, in plain English (not "we manipulate the array" — say "reorder the array so positions match a new order of IDs"). Second: where in the user-facing app this operation runs (e.g., "every time the user drags an item in the project view"). This tells the reader why it matters.
- **Complexity now:** One line. Current implementation's time and space, with the n it's measured against (e.g., `O(n²) time, O(1) space — where n is the number of actions in a project`). Add `(optimal)` or `(brute force — could be O(n))` so the reader knows where this sits.
- **Breakpoint:** Two sentences. First: the concrete scale at which this stops being acceptable, with numbers grounded in actual data (e.g., "Fine at 100 items; visible lag at 1,000; unusable at 10,000"). Second: what the fix looks like in one phrase (not the full solution; e.g., "Build an id→item map once, then rewrite positions in a single pass"). If already optimal, write "No fix needed — already O(n) for this operation."

### Variant C — for `03-ai-engineering/` files

- **The chain:** Two sentences. First: what this chain does in one job — single verb (e.g., "Classifies a todo into one of seven modes", "Summarises a recording transcript into a three-beat caption"). Second: the inputs in and the output out — the contract, in concrete terms (e.g., "Input: raw transcript string + recent caption history. Output: JSON with hook/summary/reflection fields").
- **Why this shape:** Two sentences. First: the constraint that forced this prompt structure or chain topology — not "for better outputs"; name what specifically went wrong without it (e.g., "single-call versions returned inconsistent tone across devices", "the model hallucinated todo categories that didn't exist"). Second: what the obvious alternative (one mega-prompt, no fallback, no classifier upstream) would have broken.
- **Failure mode:** Two sentences. First: the specific way this chain misbehaves when it does (e.g., "Returns malformed JSON intermittently when the transcript exceeds 4k tokens"). Second: what the codebase does about it — retry, fall back to cheaper model, return a default, surface an error. If there's no handling, say so plainly: "Currently uncaught; surfaces as a 500."
- **Cost:** Two sentences. First: tokens per call and dollars per 1,000 calls at current pricing (e.g., "~800 input + 200 output tokens; ~$0.12 per 1k calls at Sonnet 4 pricing"). If costs aren't measured, say so: "Not currently metered." Second: the condition under which this cost stops being acceptable (e.g., "fine at current solo use; would need batching at 10k calls/day").

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
  5. `## In plain English` (added v1.17.0; with subsections: The question / The answer in one breath / Where you'd see this elsewhere)
  6. `## Quick summary` — section-aware (added v1.17.0 variant split):
     - In `01-system-design/`: **Variant A** — bullets `**What:**` / `**Why here:**` / `**Checklist step:**` / `**Tradeoff:**`
     - In `02-dsa/`: **Variant B** — bullets `**Data shape:**` / `**Operation:**` / `**Complexity now:**` / `**Breakpoint:**`
     - In `03-ai-engineering/`: **Variant C** — bullets `**The chain:**` / `**Why this shape:**` / `**Failure mode:**` / `**Cost:**`
  7. `## [Concept] — diagram` (primary diagram)
  8. `## How it works`
  9. `## In this codebase` (must contain `**File:**`, `**Function / class:**`, `**Line range:**` — code reference is mandatory)
  10. `## Elaborate` (with subsections: Where this pattern comes from / The deeper principle / Where this breaks down / What to explore next)
  11. `## Tradeoffs`
  12. `## Interview defense` (with subsections: What an interviewer is really asking / Likely questions / The question candidates always dodge / One-line anchors)
  13. `## Validate your understanding` (with subsections: Level 1 / Level 2 / Level 3 / Level 4 / Quick check)

  If any of those is missing, flag it as "Missing section: `<section name>`" — not as a content-update issue.

  Also flag four specific structural-gap variants:
  - "Missing subtitle block (Industry name(s) + Type)" — when the file has the H1 and blockquote but no `**Industry name(s):**` / `**Type:**` lines between them.
  - "Missing code reference in: `## In this codebase`" — when the section exists but lacks the structured `**File:**` / `**Function / class:**` / `**Line range:**` lines.
  - "Missing Quick summary variant" — when the Quick summary section exists but uses the wrong bullet labels for the file's directory. Each directory has a required variant: A for `01-system-design/` (`What` / `Why here` / `Checklist step` / `Tradeoff`), B for `02-dsa/` (`Data shape` / `Operation` / `Complexity now` / `Breakpoint`), C for `03-ai-engineering/` (`The chain` / `Why this shape` / `Failure mode` / `Cost`). A `02-dsa/` file with `**What:**` and `**Tradeoff:**` bullets is using Variant A's old shape and needs to be migrated to Variant B. Same for AI files using Variant A.
  - "Missing In plain English block" — when the section is absent or incomplete (must have all three sub-blocks: The question / The answer in one breath / Where you'd see this elsewhere).

  All four are fixed the same way: append/replace the missing structured fields in their canonical position, with values drawn from the project context.

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
- For **structurally absent sections**, append the section in canonical order. The current sequence is: Title → **Subtitle (Industry name(s) + Type)** → blockquote → See also → **In plain English** → Quick summary (variant by directory) → diagram → How it works → In this codebase → Elaborate → Tradeoffs → Interview defense → Validate your understanding.
- For a **missing subtitle block**, insert two lines immediately after the H1 and before the blockquote:
  - `**Industry name(s):**` followed by formal/widely-recognised names this pattern goes by (or `— (project-specific composition of [X] + [Y])` if none).
  - `**Type:**` followed by one of `Industry standard` / `Language-agnostic` / `Industry standard · Language-agnostic` / `Project-specific`.
  Pick the labels from your understanding of the concept; do not require the user to choose. The reader can correct it later if needed.
- For an **"In this codebase" section missing the structured code reference**, append `**File:**` / `**Function / class:**` / `**Line range:**` lines using values drawn from the project context. The Validate block's Level 3 and Level 4 reference back into this section, so a missing code reference cascades into validate-block-incompleteness.
- For a **Quick summary using the wrong variant** (e.g., a `02-dsa/` file with `**What:**`/`**Tradeoff:**` bullets), rewrite the section to use the directory-appropriate variant (A/B/C as listed in Diff B). Do NOT just append the new bullets alongside the old — replace the bullet set entirely, drawing values from the project context. The old prose can be preserved as source material when filling in the new variant's bullets.
- For an **"In plain English" block missing or incomplete**, insert (or complete) the section between the `**See also:**` line and `## Quick summary`. All three sub-blocks required: `### The question` (one universal question, no project nouns), `### The answer in one breath` (two sentences, codebase-agnostic), `### Where you'd see this elsewhere` (2–4 examples in other systems).
- For a **system-design file (Variant A) missing the Checklist step bullet**, insert a `**Checklist step:**` bullet in Quick summary between `**Why here:**` and `**Tradeoff:**`. Pick the step(s) (1–6) from the agent's understanding of which mental-checklist step(s) the pattern lives in.
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
