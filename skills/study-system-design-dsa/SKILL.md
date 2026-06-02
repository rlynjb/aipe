---
description: Per-codebase visual study guide — system design + DSA, diagrams-first, one file per concept
---

The user invoked `/aipe:study-system-design-dsa`.

This command takes **no arguments**. There is one system-design + DSA guide per repo, saved at the fixed path `.aipe/study-system-design-dsa/`. `.aipe/` is per-repo (lives at the root of whichever repo the command is run in), and the folder name is fixed across repos — it names the *topic*, not the codebase. Re-running `/aipe:study-system-design-dsa` from the same repo enters UPDATE MODE on the existing directory.

`format.md` is now the **structural foundation** for the whole study family — the per-concept-file template, formatting rules, diagram requirements, and hard rules live there. This command is just the system-design + DSA topic generator alongside its siblings (`/aipe:study-ai-engineering`, `/aipe:study-prompt-engineering`, `/aipe:study-agent-architecture`).

To run every study generator in one pass instead of invoking each command by hand, use `/aipe:study` — the orchestrator.

The performance-side books (interview defense, hackathon demo) have moved to a sibling family — `/aipe:rehearse-interview-defense` and `/aipe:rehearse-hackathon-demo`, with `/aipe:rehearse` as their orchestrator.

**Scope.** This command covers system design and DSA only.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-system-design-dsa.`
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

Structure is now defined in `format.md` (the shared format reference across the whole study family). Read four files — structure, topic, writer persona, reader calibration:

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/study-system-design-dsa.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the concept-file template, house-style traits, diagram rules, pseudocode rules, hard rules. **Per format.md, the concept-file blocks are:** Subtitle → Zoom out, then zoom in → **Structure pass** (axes / seams / layered decomposition) → How it works → Primary diagram → Implementation in codebase → Elaborate → (Project exercises, AI/ML only) → Interview defense → Validate → See also. **Removed from older templates: Why care (replaced by Zoom out), Tradeoffs, Tech reference, Summary.**
- **`study-system-design-dsa.md`** — the system-design + DSA topic content: the inventory, the "what to expect by discipline" catalog. Legacy template sections in its body are superseded; format.md wins.
- **`teacher.md`** — the writer persona, used in **teacher posture** (the default — not the coach posture, which is for interview defense). The reader is sitting next to you; you're explaining a concept with time and patience. Diagrams primary, mechanism walked slowly.
- **`me.md`** — reader-side calibration: voice and format register, what examples land (reach into the reader's DSA and system-design portfolios before inventing), what the reader already knows vs honest gaps, the visual-first cognitive shape.

Precedence when they overlap: `format.md` wins on **structure** (it is the single source of truth for concept structure); `teacher.md` wins on **voice register**; `me.md` wins on **calibration**. Treat `teacher.md` and `me.md` as input data to respect, not reinterpret.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-system-design-dsa/` already contains the guide. The signal is the presence of `00-overview.md` at the root OR any file inside `01-system-design/` or `02-dsa/`. (The directory may exist as an empty placeholder; that's not the same as having a guide already.)

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

**Legacy directory check.** Earlier versions used `.aipe/study-<purpose>/` with a derived descriptor (for example `.aipe/study-ai-journal/`). Compare any `.aipe/study-*/` directory against the current fixed generator names declared in `specs/study.md`; treat only unrecognized names as legacy guides. The old `study-interview-defense/` and `study-hackathon-demo/` folders are also legacy because those artifacts moved to `.aipe/rehearse-*/`. In CREATE mode, prompt once: "Found a legacy guide at `<path>` — migrate to the new path or leave as archive?" In UPDATE mode, note the legacy directory in the Step 7U change plan.

---

# CREATE MODE

Runs only when no existing study guide is found.

## Step 5C — Plan the study guide

The study spec produces a visual reference — diagrams first, prose second, designed for skimming. It is **not** an interview prep guide. The study guide explains the codebase so a reader can understand it.

Apply the template's structure (loaded in Step 3) and the project context. The output is a **nested directory of per-concept files**, not flat-per-section files. Scope is **system design + DSA only** — refer the user to `/aipe:study-ai-engineering` for AI/ML and `/aipe:study-prompt-engineering` for prompt engineering.

The non-negotiables from `format.md` (canonical structure source) and this spec (topic):

1. **Concept-file block order (per format.md).** Subtitle → Zoom out, then zoom in → **Structure pass** → How it works → Primary diagram → Implementation in codebase → Elaborate → Interview defense → Validate → See also. **No Why care, no Tradeoffs, no Tech reference, no Summary** — these were removed from the template. Where a legacy template section in any loaded spec body says otherwise, format.md wins.
2. **Subtitle (Block 1).** Industry name(s) + type label (`Industry standard` / `Language-agnostic` / `Industry standard · Language-agnostic` / `Project-specific`), so another dev catches on in a one-second lookup.
3. **Zoom out, then zoom in (Block 2 — replaces Why care).** The opening block. Two beats in order: (a) **Zoom out** — show where this concept sits in the whole system as a LAYERS ascii diagram (UI / Service / Storage / Provider bands with this concept's box marked, 5–14 lines); (b) **Zoom in** — name the pattern and the question it answers, then hand off to Structure pass. **Most conversational block in the file** — second-person, plain-spoken. Banned: definition-first openings ("X is a mechanism that…"), physical-world analogies as the anchor, marketing language, slow on-ramps.

3a. **Structure pass (Block 3 — orient → understand bridge, NEW).** Before How it works walks the mechanics, read the *skeleton* of the system: what it's made of and where its joints are. Three foundations in dependency order: (1) **layers** — what are the levels of abstraction? (2) **axes** — which dimension will you trace across them? (control / state / dependency / failure / lifecycle / cost / guarantees / trust — pick ONE; tracing the right axis makes boundaries pop, the wrong one flattens everything); (3) **seams** — where are the boundaries, and which are load-bearing? A seam matters when an axis flips across it (control changes, state ownership changes, trust boundary, failure containment). Keep the structure pass tight — depth belongs in How it works. **Failure mode it fixes:** memorising mechanics with no skeleton to hang them on.
4. **How it works is the load-bearing block; it follows a three-move structure with frontend bridging.** Length scales with complexity, not capped at a paragraph count. Three required moves: Move 1 (the mental model, first paragraph + PATTERN diagram of the literal shape — loop / traversal frontier / topology / kernel, 5–12 lines) anchored to a frontend primitive; Move 2 (step-by-step walkthrough — one operation per line, one moving part per bolded sub-heading, **every sub-section gets at least one diagram**: pattern / layers-and-hops / execution trace); Move 2.5 (current state vs future state) when applicable; Move 3 (the principle, final paragraph) — the takeaway that generalises beyond this codebase.
    - **Move 2 skeleton variant** (optional, for patterns with a kernel). When the concept has an irreducible kernel (BFS's frontier+visited+termination, a rate limiter's counter+window+reset, an agent loop's step+execute+accumulate+terminate, a read-through cache's lookup+hit/miss+eviction), run Move 2 as a load-bearing-skeleton walkthrough instead of a flat list of parts: (1) isolate the kernel as pseudocode — the smallest shape that is still the pattern; (2) name each part **by what BREAKS when it is missing**, not by definition; (3) separate skeleton from optional hardening. The interview-defense payoff: naming a load-bearing part people routinely forget (BFS's termination on empty frontier, a rate limiter's reset, an agent loop's hard iteration budget) is the strongest signal the reader built the thing rather than read about it.
    - **Use PSEUDOCODE for logic, not real code** — plain-English control flow, concrete variable names, one operation per line, annotated. **How it works carries no real code, no file paths, and no line references** — those live exclusively in Block 6 (Implementation in codebase). Keep the separation clean: Block 4 teaches the general pattern; Block 6 is where it lives in this repo.
    - **Tone in Block 3 stays conversational** — same register as Zoom out. Senior colleague at the whiteboard, second person, "okay, watch what happens when the queue empties," "here's the part everyone trips on." Plain-spoken, dense, no lecturing.
    - **Layers-and-hops diagrams** — anything that crosses layers or services must be drawn with labelled bands and every hop labelled (what travels, in which direction). A diagram that crosses a boundary without naming it is off-spec.
    - **Every algorithm gets a step-by-step execution trace** — every variable at every step, not just before/after. (DSA files especially.)
5. **Primary diagram (Block 5) — the recap visual.** ONE primary diagram per concept (ASCII box-drawing in a fenced code block) that sits AFTER How it works. A reader who only looks at it should grasp the structure. Labels every architectural layer it spans.
6. **Implementation in codebase (Block 6 — renamed from "In this codebase").** Code side-by-side with line-by-line explanation: show actual repo code beside an annotation of what each part does. Must include real code references — `**File:**` + `**Function / class:**` + `**Line range:**` (e.g., `L42–L67`). For multi-file patterns, list every file with the role each plays. Never drop a raw block without annotation.
7. **Elaborate (Block 7).** Where this pattern comes from / The deeper principle / Where this breaks down / What to explore next.
8. **Interview defense (Block 9).** Each Q&A: What an interviewer is really asking / Likely questions (each labelled `[mid]` `[senior]` `[arch]`) / The question candidates always dodge / One-line anchors. Each question carries its own diagram sized to the question level.
9. **Validate (Block 10).** 4 levels — Reconstruct the diagram → Explain it out loud → Apply it to a new scenario → Defend the decision you'd change — plus a "Quick check — code reference test". Each level builds on the last; do not skip levels. Level 3 must reference the specific file and line range the reader checks their answer against.
10. **See also (Block 11, moved to last).** Cross-references via links; required reading order is not.
11. **Skim-first structure.** Every individual concept gets its own `###` header — and its own file. A reader should be able to find any concept in under 10 seconds by scanning the section's `README.md` index. Files are self-contained — a reader who jumps to any file should not need to have read prior files to understand it.
12. **Voice: state decisions, not hopes.** Hedging language (`this might`, `could potentially`, `tends to`) is banned. If something is a tradeoff, name it inline where it lands (no longer a dedicated block). If something is suboptimal, say so plainly.
13. **Use frontend primitives the reader builds with — not analogies, not whole products.** Reach for the lowest-level primitive that still carries the point. Banned as primary anchors: coat checks, librarians, locked doors, bouncers, factories, queues at coffee shops — and **whole-product references** ("Linear does X", "GitHub does Y") *when a lower-level primitive captures the same point*. Priority: frontend primitives (a todo list, a DB table, a `.map()` with `key`) → patterns the reader has built → DevTools surfaces → industry-standard protocols (JWT, OAuth, MVCC) → whole products as last resort.
14. **Diagrams use box-drawing characters**: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼`. No Mermaid, no images, no PlantUML.

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
.aipe/study-system-design-dsa/
.aipe/study-system-design-dsa/01-system-design/
.aipe/study-system-design-dsa/02-dsa/
```

(Use `mkdir -p`.) Sections without applicable patterns are not created — leaving an empty `02-dsa/` for a project with no real DSA surface is misleading. The inventory from Step 6C decides which directories exist.

## Step 8C — Generate `00-overview.md`

One full-system diagram + bullet legend (one line per component: what it is, what it does, what it talks to). **No prose paragraphs.** Save to `.aipe/study-system-design-dsa/00-overview.md`.

## Step 9C — Generate per-concept files in each section

For each section that the inventory included (`01-system-design/`, `02-dsa/`), iterate the inventory from Step 6C. Compose ONE file per concept. Save immediately before moving to the next.

Every concept file uses the per-concept structure from `format.md` — Subtitle, Zoom out / then zoom in (with the LAYERS diagram), How it works (Block 4; 3 moves with diagrams at every move and every sub-section; skeleton variant when the pattern has a kernel), Primary diagram (recap visual), Implementation in codebase (code side-by-side + line-by-line annotation, with real `**File:**` / `**Function / class:**` / `**Line range:**`), Elaborate, Interview defense (with diagrams per Q&A), Validate (4 levels + Quick check), See also.

DSA files include a step-by-step execution trace — every variable at every step.

## Step 10C — Generate section README indexes

Each section directory gets its own `README.md`:

- **`01-system-design/README.md`** — index of pattern files (one-line each), plus the 6-step mental checklist (`1. Data model` / `2. Request / response flow` / `3. Caching layers` / `4. State ownership` / `5. Failure handling` / `6. Scale concerns`) with each listed pattern tagged by its checklist step(s).
- **`02-dsa/README.md`** — index of operation files (one-line each), plus a complexity cheat sheet (operation → time complexity → space complexity).

The section READMEs are the navigation — the first thing a reader opens when they enter a section.

## Step 11C — Report + stop

Print exactly:

```
✓ Study guide created at .aipe/study-system-design-dsa/
  00-overview.md
  01-system-design/                            (<N> files + README.md)
  02-dsa/                                      (<N> files + README.md)
```

Then a 3-sentence summary: what the codebase being studied is, which section was richest given the actual surface area, and any operations in the DSA section that are currently O(n²) where O(n) is easy (since the spec asks for these to be flagged plainly).

If the codebase has AI/ML or prompt engineering surface, add a fourth sentence:

```
  AI/ML or prompt engineering content detected — generate per-repo companion guides with:
    /aipe:study-ai-engineering
    /aipe:study-prompt-engineering
```

If a legacy `.aipe/study-<purpose>/` directory was detected (older versions of this command), add:

```
  Legacy guide detected at <path> — migrate content or leave as archive? (see migration note)
```

**Stop. Wait for the user's next instruction.** They'll typically pick a concept file to drill on, ask for a deeper trace, or ask which operation to fix first. Do NOT auto-fix or auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing study guide. Goal: make the guide accurate again without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-system-design-dsa/` recursively. Read every `.md` file in:

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
- The template defined in `format.md` has shifted since the file was written. Identify missing blocks AND blocks that have been removed. The current template defines: Subtitle, Zoom out / then zoom in (with LAYERS diagram), How it works (Block 4; 3 moves with diagrams at every move and every sub-section; skeleton variant when the pattern has a kernel), Primary diagram, Implementation in codebase (code side-by-side + annotation, with file + function + line range), Elaborate, Interview defense (with diagrams per Q&A), Validate (4 levels + Quick check), See also. **Removed in the new template:** Why care (replaced by Zoom out), Tradeoffs, Tech reference, Summary. Older files have these blocks and need them migrated/removed.

Specific flags to raise per file:

- "Missing Zoom out / then zoom in block" — older files have Why care instead, or skip the orientation block entirely; rewrite with the LAYERS diagram and the two-beat zoom-out / zoom-in shape
- "Why care block (legacy) present" — older files have a Why care block where Zoom out should be; replace it (Zoom out is the new Block 2, Why care is removed)
- "Tradeoffs block (legacy) present" — removed in the new template; absorb the breakpoint into How it works Move 2 inline, then delete the block
- "Tech reference block (legacy) present" — removed in the new template; cite the stack inline in Implementation in codebase where it lands, then delete the block
- "Summary block (legacy) present" — removed in the new template; delete the block (the Primary diagram already serves as the recap)
- "How it works lacks Move 2 sub-section diagrams" — every Move 2 sub-section needs at least one diagram (pattern / layers-and-hops / execution trace)
- "How it works lacks layers-and-hops labelling on boundary-crossing diagrams" — diagrams that cross layers/services must label every band and every hop
- "How it works contains real code, file paths, or line references" — move all real code + paths + line numbers to Block 6 (Implementation in codebase); replace with pseudocode + diagrams in Block 3
- "How it works lecturing tone (definition-dumps, slow on-ramps)" — rewrite in conversational register, second person, like a senior colleague at the whiteboard
- "Implementation in codebase missing code side-by-side" — Block 6 requires actual repo code beside line-by-line annotation; not just file paths
- "Implementation in codebase named 'In this codebase' (legacy)" — rename to "Implementation in codebase" per format.md
- "See also positioned after subtitle (legacy)" — See also moves to the last block in the new template
- "Interview defense answers lack diagrams" — every Q&A needs a small ASCII diagram sized to the question level
- "Validate block lacks Level 3 code reference" — Level 3 must reference a specific file + line range

## Step 7U — Output the change plan and STOP for confirmation

Print a structured summary:

```
Changes detected for .aipe/study-system-design-dsa/
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

[If a legacy .aipe/study-<purpose>/ directory exists:]
LEGACY directory at <path>:
  Action:   ask the user — migrate content into .aipe/study-system-design-dsa/, or leave as archive?

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
Update complete for .aipe/study-system-design-dsa/
─────────────────────────────────────────────────
Files updated:        <list>
Files added:          <list>
Files unchanged:      <count or list>
Section READMEs:      <updated / unchanged>
Orphan content:       <left as-is / removed / migrated, per user's choice>
Legacy directory:     <left as-is / removed / migrated, per user's choice>
```

**Stop. Wait for the user's next instruction.**
