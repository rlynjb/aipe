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
- `.aipe/project/aieng-curriculum.md` or `.aipe/project/curriculum.md` (per-project curriculum)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)
- `~/.config/aipe/global/aieng-curriculum.md` or `~/.config/aipe/global/curriculum.md` (cross-project curriculum)

**Curriculum file resolution.** The curriculum is **optional**. When loaded, it drives the AI (`03-ai-engineering/`) and ML (`04-machine-learning/`) inventory and powers the `## Project exercises` block. When absent, AI/ML files fall back to codebase-driven inventory and skip the Project exercises block. **The agent never blocks on a missing curriculum.**

Resolution flow:

1. **Check the canonical paths** (in order): `.aipe/project/aieng-curriculum.md` → `.aipe/project/curriculum.md` → `~/.config/aipe/global/aieng-curriculum.md` → `~/.config/aipe/global/curriculum.md`. If any path matches, load it and continue to Step 3 in **curriculum-loaded** mode.

2. **If no canonical path matches**, search the user's home for candidate curriculum files:

   ```bash
   find ~ -maxdepth 4 \( -name "aieng-curriculum.md" -o -name "curriculum.md" \) \
     -not -path "*/node_modules/*" -not -path "*/.git/*" \
     -not -path "*/.aipe/specs/*" 2>/dev/null
   ```

3. **Branch on candidate count**:

   - **Zero candidates** — continue to Step 3 in **codebase-driven** mode. No prompt, no warning. AI/ML files (if any) will be inventoried from codebase scan and will not carry a Project exercises block.

   - **Exactly one candidate** — auto-install via symlink to `~/.config/aipe/global/aieng-curriculum.md` and print a single-line notice:

     ```bash
     mkdir -p ~/.config/aipe/global
     ln -s <candidate-path> ~/.config/aipe/global/aieng-curriculum.md
     ```

     ```
     ✓ Auto-installed curriculum from <candidate-path>
       (symlinked to ~/.config/aipe/global/aieng-curriculum.md)
     ```

     Load the symlinked file and continue to Step 3 in **curriculum-loaded** mode.

   - **Multiple candidates** — prompt the user to pick:

     ```
     Found multiple curriculum candidates. Pick one or skip:

       1. /Users/rein/Public/aipe/aieng-curriculum.md       (1234 lines)
       2. /Users/rein/Projects/loopd/docs/curriculum.md     (560 lines)

     Reply with:
       - a number (1, 2, …) — symlink to ~/.config/aipe/global/aieng-curriculum.md
       - "copy <N>"          — copy instead of symlink
       - "project <N>"       — install at .aipe/project/aieng-curriculum.md
       - "skip"              — proceed without a curriculum (codebase-driven only)
     ```

     Honor the reply. On `skip`, continue in **codebase-driven** mode (no warning needed — the user explicitly chose).

**Result.** Step 3 onward operates in one of two modes:

- **curriculum-loaded** — AI/ML inventory is curriculum-driven (one file per in-scope `[Cx.y]`, Case B for not-yet-implemented concepts). Every AI/ML file carries a `## Project exercises` block. UPDATE MODE runs full Diff B including curriculum-driven flags.
- **codebase-driven** — AI/ML inventory is codebase-driven (same as `01-system-design/` and `02-dsa/`: one file per pattern found in the actual code). No Project exercises block. UPDATE MODE runs Diff A as normal and suppresses the four curriculum-driven Diff B flags (missing Project exercises, subsection bullet gaps, out-of-scope concept, missing in-scope concept file). No degradation warning — codebase-driven is a legitimate first-class mode, not a fallback.

## Step 3 — Load the `study` template

Read the template at:

```
${CODEX_PLUGIN_ROOT}/specs/study.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` upward from this file's location.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/specs/study/` already contains the study layout. The signal is the presence of `00-overview.md` at the root, OR any file inside `01-system-design/`, `02-dsa/`, `03-ai-engineering/`, or `04-machine-learning/`.

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

11. **Every concept file in `01-system-design/` includes a "Checklist step" tag** as one bullet in the Summary section's Part 2 key-point list. The template defines a 6-step mental checklist for system design — `1. Data model`, `2. Request / response flow`, `3. Caching layers`, `4. State ownership`, `5. Failure handling`, `6. Scale concerns`. Each pattern lives in one or more steps; tag accordingly (e.g., `Lives in step 2 (Request flow) and step 4 (State ownership) of the system-design checklist`). This anchors every system-design concept in the unified framework so the reader builds one mental model across the section instead of treating each pattern as standalone trivia. The `02-dsa/` and `03-ai-engineering/` files do NOT use this field — it is system-design-only.

12. **Voice: state decisions, not hopes.** Hedging language (`this might`, `could potentially`, `tends to`) is banned. If something is a tradeoff, name it. If something is suboptimal, say so plainly — then explain why it was still the right call at the time. The reader should feel a senior colleague is explaining over coffee, not a textbook.

13. **Every concept file includes a "Why care" block** immediately after `**See also:**` and BEFORE `## How it works`. Two short paragraphs. No file paths, no project nouns — that's the test of a real zoom-out.
    - **Paragraph 1 — the hook.** One opening sentence that grabs attention. Pick whichever of these three angles fits best:
      - **The everyday problem they've already hit** ("You've copied a file in your terminal and watched the second one start before the first one finished — that's the same problem this pattern solves at scale.")
      - **The surprising claim** ("Most of the speed in a modern web app comes from not doing work, not from doing it faster.")
      - **The scenario that ends in a question** ("Two users open the same document, both edit the title, both hit save within a second of each other. What does the server show next? That's the question this pattern answers.")
      Then 1–2 sentences naming the underlying problem in plain English.
    - **Paragraph 2 — the zoom out.** 3–5 sentences. Name the pattern, state what it does in general terms, place it in the family of problems it belongs to, and name 1–2 other places the same pattern shows up (React's renderer abstraction, Postgres drivers, HTTP keep-alive, thread pools). End with an explicit handoff to How it works ("Here's how that actually works in this codebase." / "How it shows up here is in the next block.").
    What Why care is NOT: not a definition dump (definitions belong in How it works); not a tradeoff discussion (Tradeoffs has its own block); not codebase-specific (file paths and project nouns are banned here); not long (past two short paragraphs and it competes with How it works).

14. **Summary is the RECAP block, positioned after Tradeoffs and before Interview defense.** (Renamed from "Quick summary" in v1.21.0.) Not the zoom-in. By the time the reader gets here, they've seen the hook, the diagram, the mechanics, the codebase references, and the tradeoffs. Summary collapses all of that into a one-paragraph recap plus a bulleted key-point list. It's the block the reader returns to in three weeks to remember what this file was about. **No new information** — everything in Summary must already appear earlier in the file.
    - **Part 1 — concept recap (one paragraph, 3–5 sentences).** Cover: what the pattern is (pulled from Why care's paragraph 2), how it shows up in this codebase (from How it works or In this codebase), the constraint that forced it (from Tradeoffs), the cost being paid (from Tradeoffs). Written as if a colleague asked "wait, what's this file about again?" — the answer they get without scrolling.
    - **Part 2 — key points to remember (3–6 bullets).** Short, declarative one-sentence statements. The kind of thing the reader could write on an index card. Each bullet: one sentence (longer belongs in How it works or Tradeoffs); a conclusion not a definition ("X happens before Y" not "X is a function that does Y"); specific to this codebase where it matters (generic facts about the pattern belong in Why care). Mix categories: at least one shape ("the parts and how they connect"), at least one rule ("the invariant this pattern maintains"), at least one tradeoff ("the cost being paid"). A reader who skims only the bullets walks away with the shape, the rule, and the cost.

15. **Tradeoffs is a structured block, not a prose dump.** Required parts: (a) a comparison table with at least four cost dimensions across two columns — path taken vs the obvious alternative; (b) Sub-block 1 — what we gave up: 2–4 paragraphs walking each cost in concrete terms (files, line counts, ms, dollars, scenarios — never "added complexity"); (c) Sub-block 2 — what the alternative would have cost: same dimensions, counterfactual frame; (d) Sub-block 3 — the breakpoint: one paragraph naming a quantitative or event-shaped condition under which this choice stops being the right call. Sub-block 4 (what wasn't actually a tradeoff) is optional but valuable when the "obvious alternative" people might raise wasn't a real option. Cost-dimension catalog to consider: performance (ms/RPS/MB), money ($/mo, $/1k ops), complexity (files/lines/layers), cognitive load (mental models a contributor must hold), vendor lock-in (migration effort), debugging cost (how hard to localize a bug), hire-ability/onboarding (does a new engineer recognise this), failure blast radius (what else breaks when this breaks). **Tone:** own the cost or own the mistake — hedging language ("performance is acceptable but could be improved") is banned. A tradeoff without a breakpoint is just a complaint; a tradeoff with a breakpoint becomes a scheduled decision the team can revisit.

16. **Interview defense answers carry diagrams.** Each Q&A in the Likely questions section gets a small ASCII diagram (5–10 lines, labelled, in a fenced block) sized to the question level: [mid] gets a **flow or shape diagram** (3–5 boxes showing what the thing does or how its parts connect); [senior] gets a **comparison diagram** (two-column table or side-by-side flows showing "what we picked" vs "what we didn't" with the tradeoff as the point); [arch] gets a **scale or boundary diagram** (what changes at 10×, often a layer diagram with one layer marked "breaks first"). The "question candidates always dodge" Q&A also gets a comparison diagram showing what was picked vs what the questioner suggested, with the full cost ledger. Skip the diagram only when the question is genuinely non-visual (e.g., "why TypeScript over JavaScript" — bullet tradeoffs suffice). The diagram is the visual the reader sketches on a whiteboard while they speak — the act of drawing is the practice.

17. **Tech-stack rule — industry pairings live in a dedicated `## Tech reference (industry pairing)` section, NOT inlined into Tradeoffs or other sections.** The section sits between `## Tradeoffs` and `## Summary` in every concept file. Inside it: one `###` subsection per tech the file references (runtime, framework, ORM/query layer, AI provider, storage, queue, auth, observability — anything load-bearing). Each subsection uses **`###` heading + labelled bullets**, with these five fields in order:
    - `**Codebase uses:**` — the real library/framework/service in the repo with the file or import line where it's instantiated.
    - `**Why it's here:**` — one sentence naming the specific job this tech does (the thing that would break if it were missing).
    - `**Leading today:**` — name + label, either `adoption-leading` (most-deployed in production today — battle-tested patterns: auth, request flow, DB access; what a senior engineer at a Series B startup defaults to) or `innovation-leading` (most mindshare/momentum, likely to lead in 1–2 years — fast-moving areas: AI tooling, edge compute, type safety; what a senior engineer at a frontier-tech company is reaching for). Include the year (2026, per the spec header).
    - `**Why it leads:**` — one sentence naming the specific technical reason (typed end-to-end, server-component-native, zero bridge cost, edge-runtime-compatible). Never marketing.
    - `**Runner-up:**` — required when the codebase already uses the leader (so the alternative landscape stays visible); optional but valuable otherwise.

    **Do NOT use markdown tables with pipes for tech entries.** They break in narrow renderings (mobile, narrow panes) and render as garbage strings of `|` characters. Use the `### [tech name]` heading + labelled bullets format exactly.

    Other sections (How it works, Tradeoffs, Interview defense) may name what the codebase uses, but the industry-leader pairing is consolidated in the Tech reference section — one section per file, never inlined elsewhere. Never claim a single tech "won"; where real disagreement exists (App Router vs Pages Router, Prisma vs Drizzle, Server Actions vs tRPC), name it in one of the fields rather than smoothing it over. Draw leader/runner-up choices from the template's "What to expect by discipline" catalog (loaded in Step 3).

18. **How it works is the load-bearing block; it follows a three-move structure with frontend bridging.** Length scales with complexity, not capped at a paragraph count. A simple concept (debounce) gets four short paragraphs; a complex backend/AI/infra concept (multi-layer auth, distributed locks, prompt routing under failure) gets fifteen to twenty paragraphs with sub-headings, interspersed visuals, and explicit current-state vs future-state walkthroughs. The reader profile is a working frontend engineer (5–8 years React/Vue/TypeScript) pivoting toward full-stack and AI engineering — comfortable with components, hooks, client state, forms, browser APIs; still building intuition for database internals, transactional semantics, server-side request handling, auth flows, queues, distributed systems, LLM-shaped failure modes. The writer's job is to bridge from the first list to the second.

    Three required moves, in order:

    - **Move 1 — The mental model (first paragraph).** Open with a concrete picture or metaphor, NOT a definition. Defense in depth → "two locked doors, but only one is installed right now." Connection pooling → "a coat check that hands you the same ticket every time." Optimistic UI → "you mark the envelope as sent before the post office confirms it arrived." After the metaphor lands, one sentence names the underlying strategy in plain English ("two independent mechanisms, layered" / "one warm resource, lent and returned" / "show success immediately, reconcile when the server confirms").

    - **Move 2 — The layered walkthrough (the body).** Break the concept into its independent moving parts; each part gets its own bolded sub-heading. The reader should never have to hold more than one moving part in their head at a time. For each part, cover four things: (a) **the technical thing** named with its real term (composite primary key / Row-Level Security / JWT signature verification — names matter); (b) **the bridge from what the reader knows** — the load-bearing sentence (e.g., "if you're coming from frontend, you're used to thinking of an `id` as globally unique — here it's different"; "this is like React's [pattern], except the [thing] lives on the server"; "think of it like [browser API], but [twist]"; "in React you'd handle this with [hook]; in a backend you handle it with [server equivalent]"); (c) **the practical consequence** — what literally happens, walked through with a concrete example (not "this is secure" but "if user A's client sends a query for `id = 'abc123'` belonging to user B, the database looks for `(user_A_id, 'abc123')` and that row literally does not exist"); (d) **the condition under which it works or breaks** — boundary conditions are where understanding lives. Anchor each part with a secondary visual where it helps (small ASCII diagram, code snippet, pseudocode sequence, comparison table, before/after pair).

    - **Move 2.5 — Current state vs future state (when applicable).** Required when the concept involves something built-but-not-fully-active, planned-but-not-yet-shipped, or in-migration (multi-tenant scaffolding, auth migrations, feature flags, gradual rollouts, deprecated paths still in the codebase). Use Phase A / Phase B (or Now / Later) sub-headings; each phase covers what's true right now in the code, what's planned and why it's gated, and what the migration between phases costs. The key insight this sub-section often surfaces: *what doesn't have to change* — e.g., "the schema didn't have to change between phases" is the kind of takeaway that turns a Phase A/B description into a lesson about architectural foresight. Skip when the concept is fully shipped and stable.

    - **Move 3 — The principle (final paragraph).** End with the takeaway that generalises beyond this codebase — NOT a summary of what was just said. "This is what people mean by designing for multi-tenancy from the start." / "This is what defense in depth looks like in a real system." / "This is why every web framework eventually adds optimistic updates." The principle paragraph bridges to the diagram below and to the reader's broader understanding.

    **Hard rules** (enforce throughout the block):
    - **No definition-first openings.** "X is a mechanism for..." is banned. Start with the mental model; end with the term.
    - **Bridge from what the reader knows in every move-2 sub-section.** If a sub-section has no bridge to a frontend concept the reader already understands, the writer hasn't done the work yet.
    - **Every abstract claim followed by a concrete consequence.** "This is secure" is banned; "if the client tries X, the database returns Y" is required.
    - **Name the terms; don't dance around them.** "Composite primary key" not "a special kind of key." Real terms, used after they're introduced with the bridge.
    - **Length scales with complexity.** A four-paragraph How it works for a complex auth pattern is a failure. A twenty-paragraph How it works for debounce is over-engineering. Calibrate.
    - **Code/file references inline where they earn it.** "The file `0002_rls_policies.sql` contains these policies — written, committed, ready, but not activated yet." File names ground the abstract in the actual repo.

    End the block with an explicit handoff sentence to the primary diagram ("The full picture is below." / "Here's the diagram of the whole flow."). The full worked example showing what good looks like lives in the loaded template (Step 3) under "How it works → Worked example" — read it before writing complex concepts.

19. **Curriculum-loaded mode is opt-in. When loaded, AI Engineering and Machine Learning files include a `## Project exercises` block and the inventory is curriculum-driven. When absent, AI/ML files are codebase-driven (same model as System design and DSA) and the Project exercises block is omitted.** Four related rules:

    - **`## Project exercises` block** (curriculum-loaded mode only) sits between `## Tech reference (industry pairing)` and `## Summary` in every Section 03 (AI Engineering) and Section 04 (Machine Learning) file. It names the curriculum-defined Build items (`[Bx.y]` IDs from `aieng-curriculum.md`) that map to this file's concept IDs. **Omit this block entirely in codebase-driven mode** — Section 03/04 files in that mode go straight from Tech reference to Summary, same shape as Section 01/02 files. Format: one `###` subsection per exercise, six labelled bullets each — `**Exercise ID:**` (verbatim, e.g. `[B3.11]`), `**What to build:**` (concrete deliverable from the curriculum), `**Why it earns its place:**` (one sentence on the interview signal it produces), `**Files to touch:**` (real file paths in this codebase, or expected paths if Case B), `**Done when:**` (measurable end-state — "Per-class F1 reported on a 50-item held-out set, saved to `docs/ml-results.md`"; if no measurable end-state can be named, the exercise is wrong), `**Estimated effort:**` (one of `<1hr`, `1–4hr`, `1–2 days`, `≥1 week`). Two cases:
      - **Case A — concept implemented.** `In this codebase` describes the implementation; Project exercises names the *next* curriculum step that extends, evaluates, or hardens it (e.g., a file on LLM caching with prompt caching active gets an exercise to add the semantic cache layer named in the curriculum).
      - **Case B — concept not yet implemented.** `In this codebase` says "Not yet implemented" with one honest sentence (deferred to Phase X / gated on prerequisite Y); Project exercises becomes the *primary* buildable target — the curriculum's Build item is the spec for building the thing. Case B is the load-bearing reason this block exists.

    - **Curriculum-driven inventory** (curriculum-loaded mode only, AI + ML only). When a curriculum is loaded, Section 03 and Section 04 generate one file per **curriculum concept in scope for the project**, regardless of current implementation state. A curriculum concept `[Cx.y]` is in scope when (a) the curriculum tags it for the project being studied (e.g., loopd, aipe, contrl-mo), and (b) its status is `covered`, `learn-only`, or `deferred`. Concepts explicitly marked out-of-scope are excluded. **In codebase-driven mode** (no curriculum loaded), Section 03 and Section 04 generate files from codebase scan only — one file per pattern found, same model as Section 01 and Section 02. Section 01 and Section 02 are always codebase-driven regardless of curriculum state.

    - **Anchors per sub-discipline.** Each `═════` sub-section divider in Section 03 and Section 04 of the template carries an `Anchor:` line naming the primary project (loopd / aipe / contrl-mo) and a `Curriculum:` line naming the phase + concept ID range. When the codebase being studied is one of the anchored projects, the agent weights coverage toward sub-sections anchored to that project — but every sub-section is covered, because the three-shapes interview story depends on the contrast. When the codebase is not one of the anchored projects, anchors are instructional examples rather than required mappings.

    - **Curriculum file resolution.** Step 2 handles this — see the "Curriculum file resolution" sub-section there. Summary: canonical paths checked first; if empty, the agent searches `~` (maxdepth 4) for candidate curriculum files; zero candidates → silent codebase-driven mode; exactly one candidate → auto-symlink to `~/.config/aipe/global/aieng-curriculum.md` with a one-line notice → curriculum-loaded mode; multiple candidates → prompt the user. The agent never blocks on a missing curriculum. Both modes are first-class; codebase-driven is not a degraded fallback.

Diagrams use box-drawing characters: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼`. No Mermaid, no images, no PlantUML.

Every term must be shown before it's used (jargon without a diagram is forbidden).

Every file is grounded in concrete details from the project context: real file names, real operations, real data shapes.

## Step 6C — Plan the file inventory

The inventory source depends on the mode determined in Step 2:

- **Sections 01 (System design) and 02 (DSA) are always codebase-driven.** Identify patterns and operations by walking the project context. Use the template's "What to expect by discipline" catalog (loaded in Step 3) as the first pass: determine whether the codebase is primarily frontend, backend, or full-stack, then walk the discipline's pattern list and note which ones you can ground in concrete code. Patterns you find become files; patterns you don't find are skipped (or flagged for the user). The cross-reference table ("if you see X, you're looking at Y") is a useful signal-to-pattern map.
- **Sections 03 (AI Engineering) and 04 (Machine Learning) depend on mode:**
  - **Curriculum-loaded mode** (Step 2 loaded a curriculum file): walk the curriculum and generate one file per **curriculum concept `[Cx.y]` in scope for the project being studied**, regardless of current implementation state. A concept is in scope when (a) the curriculum tags it for this project (e.g., loopd, aipe, contrl-mo), and (b) its status is `covered`, `learn-only`, or `deferred`. Concepts explicitly marked out-of-scope are excluded. Each file's `## In this codebase` block becomes Case A (concept is implemented — describe the implementation) or Case B (concept is not yet implemented — say so honestly in one sentence). Each file's `## Project exercises` block is built from the curriculum's `[Bx.y]` Build items that map to the file's `[Cx.y]` concept IDs.
  - **Codebase-driven mode** (no curriculum loaded): walk the project context, same as Sections 01/02. Use the expanded AI catalog (loaded in Step 3 under "SECTION 03 — AI ENGINEERING") and the ML catalog (under "SECTION 04 — MACHINE LEARNING") as pattern checklists; include patterns the codebase actually uses, skip ones it doesn't. **Omit the `## Project exercises` block from every file in this mode** — go straight from Tech reference to Summary, same shape as Section 01/02 files. Case A / Case B distinction does not apply; files exist only for patterns actually in the codebase.

Assign each pattern a kebab-case file name with a numeric prefix (in dependency / reading order):

- **`01-system-design/`** — every significant architectural pattern in the codebase. Likely candidates depend on the discipline: frontend (component composition, client routing, state-ownership split, optimistic UI, rendering strategy, error boundaries), backend (request/response flow with layered handlers, auth boundary, database access, caching, background jobs, rate limiting), full-stack (end-to-end type safety, shared validation, SSR-with-data-fetching, optimistic UI with server reconciliation, edge vs origin compute). Add any others present; skip ones that don't apply.
- **`02-dsa/`** — every meaningful operation in the codebase. Likely candidates: reordering, deduplication, flattening, sorting, lookups, filtering, grouping, diffing. Add any others; skip ones that don't apply.
- **`03-ai-engineering/`** — universal AI concepts plus project-specific usage. The template organizes patterns into sub-disciplines (loaded in Step 3 under "SECTION 03 — AI ENGINEERING"); walk each sub-discipline and include the patterns that apply. Default sub-disciplines and their patterns:
  - **LLM foundations**: what an LLM is, tokenization, sampling parameters, structured outputs, streaming, token economics, heuristic-before-LLM, provider abstraction, user-override locks.
  - **Prompt engineering**: anatomy of a production prompt, single-purpose chains, output mode mismatch, few-shot prompting, chain-of-thought, forbidden patterns / rotating formulas.
  - **Context and prompts**: context window, lost-in-the-middle, prompt chaining.
  - **Retrieval and RAG**: embeddings (geometrically), embedding model choice, chunking strategies, vector databases, dense vs sparse retrieval, hybrid retrieval with RRF, reranking with a cross-encoder, query rewriting / HyDE, stale embeddings, incremental indexing, RAG, GraphRAG.
  - **Agents and tool use**: agents vs chains, tool calling, ReAct pattern, tool routing, agent memory, error recovery in agents.
  - **Evals and observability (LLM)**: eval set types, eval methods, LLM-as-judge bias, LLM observability.
  - **Production serving (LLM)**: LLM caching, LLM cost optimization, prompt injection, rate limiting and backpressure, retry and circuit breaker.
  - **How this codebase uses AI**: AI features table, per-feature spec.

  Number files in the order above (`01-what-an-llm-is`, `02-tokenization`, … `34-ai-features-in-this-app`). Skip patterns that genuinely don't apply to the codebase rather than writing thin placeholders. If the codebase has no AI surface at all, write only `34-ai-features-in-this-app.md` (or `01-ai-features-in-this-app.md` as a lone file) with a brief "no AI in this codebase" note and skip the rest.
- **`04-machine-learning/`** — classical ML patterns the codebase uses (supervised learning, recommender systems, on-device inference — anything that involves a trained model rather than a pre-trained LLM). This section is distinct from `03-ai-engineering/`: AI engineering is prompt-engineering and LLM application work; ML engineering is data pipelines, feature engineering, training discipline, and metrics. The template (loaded in Step 3 under "SECTION 04 — MACHINE LEARNING") organizes patterns into sub-disciplines:
  - **Supervised learning foundations**: the supervised pipeline, feature engineering, train/val/test split discipline, model selection (LR vs GBT).
  - **Data and model quality**: class imbalance, domain gap, transfer learning.
  - **Metrics**: confusion matrices, calibration.
  - **Recommender systems**: framing (content-based / collaborative / hybrid), cold-start.
  - **On-device inference**: on-device basics, quantization.
  - **ML observability**: training-run logging, drift detection, retraining pipelines.
  - **How this codebase uses ML**: ML features table, per-feature spec.

  Number files in the order above (`01-supervised-pipeline`, `02-feature-engineering`, …). Skip patterns that don't apply. If the codebase has **no ML surface** (no trained models, only pre-trained LLM calls), skip this entire section — do not create the `04-machine-learning/` directory. ML and AI engineering are different disciplines; a project that only uses LLM APIs has no ML section.

## Step 7C — Create the directory structure

Create:

```
.aipe/specs/study/
.aipe/specs/study/01-system-design/
.aipe/specs/study/02-dsa/
.aipe/specs/study/03-ai-engineering/    (skip if the codebase has no AI surface)
.aipe/specs/study/04-machine-learning/   (skip if the codebase has no trained-model surface)
```

(Use `mkdir -p`.) Sections without applicable patterns are not created — leaving an empty `04-machine-learning/` for a project that doesn't use ML is misleading. The inventory from Step 6C decides which directories exist.

## Step 8C — Generate `00-overview.md`

One full-system diagram + bullet legend (one line per component: what it is, what it does, what it talks to). **No prose paragraphs.** Save to `.aipe/specs/study/00-overview.md`.

## Step 9C — Generate per-concept files in each section

For each section that the inventory included (`01-system-design/`, `02-dsa/`, `03-ai-engineering/`, `04-machine-learning/`), iterate the inventory from Step 6C. Compose ONE file per concept. Save immediately before moving to the next. Skip any section the inventory left empty (e.g., a project with no ML surface won't have `04-machine-learning/`).

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

The load-bearing block of the file. Why care made the reader curious; How it works builds the actual understanding. Everything below (the diagram, In this codebase, Tradeoffs, Summary) assumes the reader finished this block with the concept fully clicking. **Length scales with complexity, not capped at a paragraph count** — simple concepts (debounce) get four short paragraphs; complex backend/AI/infra concepts (multi-layer auth, distributed locks, prompt routing) get fifteen to twenty paragraphs with sub-headings.

Reader profile to bridge from: a working frontend engineer (5–8 years React/Vue/TypeScript) pivoting toward full-stack and AI. Comfortable with components, hooks, client state, forms, browser APIs. Building intuition for database internals, server-side request handling, auth, queues, distributed systems, LLM failure modes. Bridge every backend/AI concept to something the reader already understands from frontend.

Write three moves in order:

### Move 1 — The mental model (first paragraph)

Open with a concrete picture or metaphor, **not a definition**. "Two locked doors, but only one is installed right now." / "A coat check that hands you the same ticket every time." / "You mark the envelope as sent before the post office confirms it arrived." After the metaphor lands, one sentence names the underlying strategy in plain English ("two independent mechanisms, layered" / "one warm resource, lent and returned" / "show success immediately, reconcile when the server confirms").

### Move 2 — The layered walkthrough (the body)

Break the concept into its independent moving parts; each part gets its own bolded sub-heading (`### Layer 1: ...` / `### The schema gate` / etc.). The reader should never hold more than one moving part in their head at a time. For each part, cover four things:

1. **The technical thing**, named with its real term — "composite primary key", "Row-Level Security", "JWT signature verification". Names matter; the reader needs to recognise the term later.
2. **The bridge from what the reader knows** (load-bearing sentence). Common bridge starters:
   - "If you're coming from frontend, you're used to X. Here it's different — Y."
   - "This is like React's [pattern], except the [thing] lives on the server."
   - "Think of it like [browser API], but [twist that makes it different]."
   - "In React you'd handle this with [hook]; in a backend you handle it with [server equivalent]."
3. **The practical consequence** — what literally happens, walked through with a concrete example. Not "this is secure" but "if user A's client sends a query for `id = 'abc123'` belonging to user B, the database looks for `(user_A_id, 'abc123')` and that row literally does not exist."
4. **The condition under which it works (and breaks).** "This works whether the user is logged in or out." / "This breaks if `auth.uid()` returns the wrong value." Boundary conditions are where understanding lives.

Anchor each part with a secondary visual where it helps — small ASCII diagram, code snippet, pseudocode sequence, comparison table, before/after pair. The reader should never encounter a piece of jargon in the prose without a visual showing it in the same sub-section.

### Move 2.5 — Current state vs future state (when applicable)

Required when the concept involves something **built-but-not-fully-active, planned-but-not-yet-shipped, or in-migration** (multi-tenant scaffolding, auth migrations, feature flags, gradual rollouts, deprecated paths still in the codebase). Use Phase A / Phase B (or Now / Later) sub-headings; each phase covers what's true right now in the code, what's planned and why it's gated, and what the migration between phases costs. The key insight this sub-section often surfaces: *what doesn't have to change* — "the schema didn't have to change between phases" is the kind of takeaway that turns a Phase A/B description into a lesson about architectural foresight. Skip when the concept is fully shipped and stable.

### Move 3 — The principle (final paragraph)

End with the takeaway that **generalises beyond this codebase** — NOT a summary of what was just said. "This is what people mean by designing for multi-tenancy from the start." / "This is what defense in depth looks like in a real system." / "This is why every web framework eventually adds optimistic updates." The principle paragraph bridges to the diagram below and to the reader's broader understanding.

### Hard rules (enforce throughout)

- **No definition-first openings.** "X is a mechanism for..." is banned. Start with the mental model; end with the term.
- **Bridge from what the reader knows in every move-2 sub-section.** If a sub-section has no bridge to a frontend concept, the writer hasn't done the work yet.
- **Every abstract claim followed by a concrete consequence.** "This is secure" is banned; "if the client tries X, the database returns Y" is required.
- **Name the terms; don't dance around them.** "Composite primary key" not "a special kind of key."
- **Length scales with complexity.** Four paragraphs for complex auth = failure. Twenty paragraphs for debounce = over-engineering. Calibrate.
- **Code/file references inline where they earn it.** "The file `0002_rls_policies.sql` contains these policies — written, committed, ready, but not activated yet."

End the block with a handoff sentence to the primary diagram: "The full picture is below." / "Here's the diagram of the whole flow." A full worked example showing what good looks like lives in the loaded template (Step 3) under "## How it works — Worked example — what good looks like" — **read it before writing complex concepts**.

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

Most architectural decisions are not about right vs wrong — they're about which costs you can afford to pay and which ones would have broken you. This block names both sides of the ledger so the reader sees the decision as a choice, not an obvious default. Open with a comparison table putting both paths' costs side by side, then walk each sub-block in prose. **Hedging language is banned** ("performance is acceptable but could be improved" → no). Own the cost or own the mistake.

### Comparison table — both costs in one frame

Two-column table. Left column: the path taken in this codebase. Right column: the obvious alternative. Each row is one cost dimension. Cover all that apply; at least four rows must be filled in:

```
┌──────────────────┬──────────────────┬──────────────────┐
│ Cost dimension   │ Path taken       │ Alternative      │
├──────────────────┼──────────────────┼──────────────────┤
│ Build time       │ ...              │ ...              │
│ Latency          │ ...              │ ...              │
│ Dollars/month    │ ...              │ ...              │
│ Complexity       │ ...              │ ...              │
│ Team cog. load   │ ...              │ ...              │
│ Vendor lock-in   │ ...              │ ...              │
│ Debugging        │ ...              │ ...              │
│ Hire-ability     │ ...              │ ...              │
│ Migration cost   │ ...              │ ...              │
│ Failure blast    │ ...              │ ...              │
└──────────────────┴──────────────────┴──────────────────┘
```

A table with only "complexity" and "dollars" is the lazy version of this block.

### Sub-block 1 — what we gave up

2–4 short paragraphs. Walk the costs the path-taken column lists, one or two per paragraph, with the concrete shape of each cost. Not "added complexity" — say which file holds the extra layer, how many lines it adds, what a new contributor has to read before they can change it. Cost-dimension catalog and what "concrete" looks like:

- **Performance cost** — latency in ms, throughput drop in RPS, memory in MB, payload in KB. "Adds ~40ms to every chain call from the factory indirection." Not "may impact performance."
- **Money cost** — $/mo at current usage, $/1k operations, $/user. "$0.12 per 1k caption generations at current Sonnet 4 pricing; ~$8/month at solo usage."
- **Complexity cost** — files added, lines added, layers between caller and callee, concepts a contributor must learn. "Three extra files in `lib/providers/`; one shared interface to read before adding any provider."
- **Cognitive load** — how much of the codebase a contributor must keep in their head. "Anyone touching chains has to know which provider runs in which env."
- **Vendor lock-in** — what breaks if the vendor disappears, raises prices, or deprecates the API. Quantify the migration, not just the risk. "Switching off Netlify Blobs requires rewriting every wrapper in `netlify/functions/lib/storage/` — about a week."
- **Debugging cost** — how hard to find a bug when something goes wrong. "Rate-limit errors look identical across providers; you have to check the env var to know who's throttling you."
- **Hire-ability/onboarding** — does a new engineer recognise the pattern or have to learn it? "Any React engineer recognises a context provider; almost no one recognises our custom chain-routing pattern — onboarding adds 1–2 days."
- **Failure blast radius** — when this thing breaks, what else breaks with it? "All three providers sit behind the same factory; if the factory throws at startup, every chain in the app fails to load."

Every cost named must point at a real file, a real number, or a real scenario. Generic costs ("added complexity", "some performance impact") are banned — they are the prose equivalent of shrugging.

### Sub-block 2 — what the alternative would have cost

2–4 short paragraphs. Same cost dimensions, applied to the path not taken. This is the half of the tradeoff most candidates skip — they describe what they pay without describing what they avoided paying.

Frame as counterfactuals: "If we had used [alternative] instead, the cost would have been [concrete shape]."

Example:

> If we had hardcoded one provider into every chain, the up-front complexity cost would have been zero — no factory, no shared interface, no env-based routing. But the cost of switching providers later would have meant editing every chain file individually. With six chains in the codebase and the provider switch happening twice in the last year, that would have been twelve chain rewrites instead of two env flips.

The alternative's cost is often invisible to people who never paid it. Make it visible.

### Sub-block 3 — the breakpoint

One short paragraph. Name the concrete condition under which the path taken stops being the right call. A tradeoff without a breakpoint is just a complaint; a tradeoff with a breakpoint becomes a scheduled decision the team can revisit.

Good breakpoints are quantitative or event-shaped:

- "Fine until traffic exceeds 1M chain calls/day — at that point the indirection cost becomes measurable and the factory should be inlined."
- "Fine until the team grows past six engineers — at that point the cognitive load of the custom pattern exceeds the savings of provider switching."
- "Fine until a single provider's unique features (caching, structured outputs) become load-bearing — at that point the lowest-common-denominator interface becomes the bottleneck."

Bad breakpoints: "Fine for now." / "Fine until it isn't." / "Fine until we scale." / "Fine until requirements change." If you cannot name a real breakpoint, the decision was not a tradeoff — it was a guess. Say that openly rather than inventing a fake one.

### Sub-block 4 — what wasn't actually a tradeoff (optional)

One short paragraph, when relevant. Sometimes the "obvious alternative" people might raise wasn't a real option in the first place. Surfacing the non-options pre-empts wasted discussion and shows the reader you considered them.

Example: "Redis was not a real alternative — we needed durable storage that survived restarts. Redis is in-memory by default; the AOF option would have meant operating Redis as a database, which is not what it's good at."

Skip this sub-block when every plausible alternative was a real option. Forcing it in when nothing fits makes the document feel defensive.

---

## Tech reference (industry pairing)

The only place industry pairings live. Other sections may name what the codebase uses, but the leader/runner-up pairing is consolidated here — one `###` subsection per tech, five labelled bullets per subsection. **No markdown tables with pipes** — they break in narrow renderings. Use `###` heading + labelled bullets exactly as shown below.

For every distinct library, framework, or service this file references — runtime, framework, ORM/query layer, AI provider, storage, queue, auth, observability — add a subsection. Skip nothing load-bearing.

### [tech name]

- **Codebase uses:** [real lib/framework/service in the repo, with version where it matters and the file or import line where it's instantiated]
- **Why it's here:** [one sentence — the specific job this tech does that would break if it were missing]
- **Leading today:** [name] — `adoption-leading` OR `innovation-leading`, 2026.
- **Why it leads:** [one sentence on the specific technical reason — typed end-to-end, server-component-native, zero bridge cost, edge-runtime-compatible. Never marketing.]
- **Runner-up:** [credible alternative + one sentence on its angle. Required when the codebase already uses the leader.]

Worked example (a local-first request-flow file):

### expo-sqlite (WAL)

- **Codebase uses:** `expo-sqlite` in WAL mode, single-process via `loopd.db`. Opened in `src/lib/database.ts` at startup.
- **Why it's here:** the synchronous write layer that makes "keystroke → ~1ms write → UI re-render" possible. If it were async, the optimistic UI shape collapses.
- **Leading today:** `expo-sqlite` — `adoption-leading`, 2026.
- **Why it leads:** ships with the Expo SDK; battle-tested WAL mode; mirrors the SQLite C API directly with zero bridge cost for Expo projects.
- **Runner-up:** `op-sqlite` — `innovation-leading` JSI-direct binding with no bridge cost; the perf-tier alternative for bare React Native projects.

### @supabase/supabase-js + Supabase Postgres

- **Codebase uses:** `@supabase/supabase-js` against managed Supabase Postgres as the cloud provider layer. `pushAll()` upserts dirty rows via the Supabase client.
- **Why it's here:** the cloud mirror that receives every row the 5-second debounce batches and sends via HTTPS upsert.
- **Leading today:** Supabase — `adoption-leading` for Postgres-as-a-service, 2026.
- **Why it leads:** managed Postgres + auth + RLS + Storage in one console; SDK mirrors PostgREST, so an upsert with `onConflict` is one call.
- **Runner-up:** Neon + Drizzle — `innovation-leading` typed SQL with branch-per-PR; Convex is the reactive-first alternative.

What this block is NOT: not a rewrite of Tradeoffs (Tradeoffs name what was given up; Tech reference names what the industry context is); not a place for prose paragraphs (five bullets per tech, that's the shape); not a place for markdown tables (pipe-tables render as garbage on mobile — use `###` + labelled bullets exactly).

---

## Project exercises

**Section 03 (AI Engineering) and Section 04 (Machine Learning) files only.** Skip this block in `01-system-design/` and `02-dsa/` files.

Names the curriculum-defined exercises that build understanding of this concept by *making* something. Sourced from the curriculum file loaded in Step 2 (`aieng-curriculum.md`): walk the curriculum's Build items (`[Bx.y]`) and include each one whose concept-ID tags overlap with this file's concepts.

Two cases this block handles:

- **Case A — concept is already implemented in the codebase.** `## In this codebase` describes the implementation. This block names the *next* curriculum Build item that extends, evaluates, or hardens it — e.g., a file on LLM caching with prompt caching active gets an exercise to add the semantic-cache layer named in the curriculum.
- **Case B — concept is in the curriculum but not yet implemented.** `## In this codebase` says "Not yet implemented" with one honest sentence about why (deferred to Phase X / gated on prerequisite Y). This block becomes the *primary* buildable target — the curriculum's Build item is the spec for building the thing. Case B is why this block exists: without it, files for not-yet-implemented concepts would have nothing concrete in them.

Format — one `###` subsection per exercise, six labelled bullets each:

### [Exercise ID, e.g. B3.11] [Short title from the curriculum]

- **Exercise ID:** `[Bx.y]` — verbatim from the curriculum, so the reader can cross-reference back.
- **What to build:** the exercise statement from the curriculum, lightly edited if it references concepts the reader hasn't met yet. Concrete deliverable, not a learning goal.
- **Why it earns its place:** one sentence on the understanding this exercise produces that reading alone can't — the interview signal it creates.
- **Files to touch:** real file paths in this codebase where the exercise lands. If files don't exist yet (Case B), name the expected paths and which directory they belong in.
- **Done when:** a measurable end-state ("Zod schemas exist for all 5 chains and `pnpm test` passes" / "Per-class F1 reported on a 50-item held-out set, saved to `docs/ml-results.md`"). If no measurable end-state can be named, the exercise is wrong.
- **Estimated effort:** one of `<1hr`, `1–4hr`, `1–2 days`, `≥1 week`. Honesty here beats precision — the reader is deciding whether to take this on this week or park it.

Expect 1–3 exercises per file. If a file has zero matching exercises in the curriculum, the file is either covering a `learn-only` concept (say so in one line) or the concept isn't actually part of this project's curriculum scope (in which case the file shouldn't exist).

**What this block is NOT:** not a brainstorm of every possible thing the reader could build (only the curriculum's named `[Bx.y]` Build items belong here, with IDs preserved); not a rewrite of `## In this codebase` (In this codebase describes what *is*; Project exercises describes what comes *next*); not a tutorial (each exercise is a target, not a walkthrough — the reader uses Claude Code or their own judgment to implement).

---

## Summary

The recap. By the time the reader lands here they've seen the hook, the diagram, the mechanics, the codebase references, and the tradeoffs. Summary collapses all of that into a one-paragraph recap plus a bulleted key-point list. It is the block the reader returns to in three weeks to remember what this file was about. **No new information** — everything here must already appear earlier in the file.

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
  Diagram: [Small ASCII diagram (5–10 lines, labelled, fenced block) that supports the answer — the visual the reader can sketch on a whiteboard while they speak. Not a recap of the primary diagram. Match the type to the question level:]

    [mid]    → flow or shape diagram: 3–5 boxes showing what the thing does or how its parts connect. "Here's what a request does, step by step."
    [senior] → comparison diagram: two-column table or side-by-side flows showing "what we picked" vs "what we didn't, and why." The tradeoff is the point.
    [arch]   → scale or boundary diagram: what changes at 10×, where the architecture breaks first, what layer would need replacing. Often a layer diagram with one layer marked "breaks first."

  Skip the diagram only when the question is genuinely non-visual (e.g., "why TypeScript over JavaScript" → bullet tradeoffs, not a diagram). When in doubt, draw it — the act of drawing is the practice.

### The question candidates always dodge
[One question per concept that trips people up. Write the question. Then write the honest answer that owns the limitation without apologising for it. Longer than the others — separates candidates who understand from candidates who built.]

This question always gets a diagram. The dodge is usually a "why didn't you do X" question, so the visual is the comparison: what was picked, what was suggested, why the suggestion's cost was higher than it looks. Two-column table or side-by-side flows, with the full cost ledger.

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
- **`03-ai-engineering/README.md`** — index of AI pattern files (one-line each), grouped by sub-discipline (LLM foundations / Prompt engineering / Context and prompts / Retrieval and RAG / Agents and tool use / Evals and observability / Production serving / How this codebase uses AI), plus the **AI features table** (Feature → Pattern used → Why this pattern).
- **`04-machine-learning/README.md`** — index of ML pattern files (one-line each), grouped by sub-discipline (Supervised learning foundations / Data and model quality / Metrics / Recommender systems / On-device inference / ML observability / How this codebase uses ML), plus the **ML features table** (Feature → Model type → Inference location). Skip this README if the section was not created.

The section READMEs are the navigation. They're the first thing a reader opens when they enter a section.

## Step 11C — Report + stop

Print exactly:

```
✓ Study guide created at .aipe/specs/study/
  00-overview.md
  01-system-design/   (<N> files + README.md)
  02-dsa/             (<N> files + README.md)
  03-ai-engineering/  (<N> files + README.md)   [omit line if section not created]
  04-machine-learning/(<N> files + README.md)   [omit line if section not created]
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
- `03-ai-engineering/` (README.md + every per-pattern file) — skip if directory doesn't exist
- `04-machine-learning/` (README.md + every per-pattern file) — skip if directory doesn't exist (most projects without a trained-model surface won't have this section)

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
  6. `## How it works` (moved BEFORE the primary diagram in v1.20.0; restructured in v1.24.0 — length now scales with complexity, not capped at a paragraph count. Required structure: Move 1 — mental model / metaphor opening (NOT a definition); Move 2 — layered walkthrough where each independent moving part gets its own bolded sub-heading and covers four things (the technical thing named with its real term, the bridge from what a frontend engineer already knows, the practical consequence walked through concretely, the condition under which it works/breaks); Move 2.5 — Phase A / Phase B sub-section when the concept involves something built-but-not-active, in-migration, or gradually rolling out; Move 3 — the principle that generalises beyond this codebase (NOT a summary). Every move-2 sub-heading must include a frontend-to-backend bridge sentence ("if you're coming from frontend, you're used to X — here it's different"). Every abstract claim must be followed by a concrete consequence. Ends with an explicit handoff sentence to the primary diagram.)
  7. `## [Concept] — diagram` (moved AFTER How it works in v1.20.0 as the recap visual; must label every architectural layer it spans — UI / Service / Storage / Network boundary / Provider — using left-margin labels, horizontal dividers with layer names, or grouped boxes inside labelled bands)
  8. `## In this codebase` (must contain `**File:**`, `**Function / class:**`, `**Line range:**` — code reference is mandatory)
  9. `## Elaborate` (with subsections: Where this pattern comes from / The deeper principle / Where this breaks down / What to explore next)
  10. `## Tradeoffs` (restructured in v1.21.0 — was a one-line prose placeholder, now requires: a comparison table with at least four cost dimensions across two columns (path taken vs alternative); Sub-block 1 — what we gave up (2–4 paragraphs with concrete costs — files/ms/dollars/scenarios — never "added complexity"); Sub-block 2 — what the alternative would have cost (same dimensions, counterfactual frame); Sub-block 3 — the breakpoint (quantitative or event-shaped condition under which the choice stops being right); Sub-block 4 — what wasn't actually a tradeoff (optional). Tone: own the cost or own the mistake; hedging language is banned.)
  11. `## Tech reference (industry pairing)` (added in v1.23.0 — sits between Tradeoffs and Summary; was previously inlined into Tradeoffs in v1.22.0 files). One `###` subsection per tech the file references (runtime, framework, ORM, AI provider, storage, queue, auth — anything load-bearing). Each subsection uses `###` heading + five labelled bullets: `**Codebase uses:**` / `**Why it's here:**` / `**Leading today:**` (with `adoption-leading` or `innovation-leading` label + 2026) / `**Why it leads:**` (specific technical reason — never marketing) / `**Runner-up:**` (required when the codebase already uses the leader). **No markdown tables with pipes** — they break in narrow renderings.
  12. `## Project exercises` (added in v1.26.0 — **AI Engineering (`03-ai-engineering/`) and Machine Learning (`04-machine-learning/`) files only**, omitted in `01-system-design/` and `02-dsa/` files). Sits between Tech reference and Summary. One `###` subsection per curriculum Build item (`[Bx.y]`) that maps to this file's concept IDs. Each subsection has six labelled bullets in order: `**Exercise ID:**` (verbatim from the curriculum) / `**What to build:**` (concrete deliverable) / `**Why it earns its place:**` (one sentence on the interview signal) / `**Files to touch:**` (real file paths in this codebase, or expected paths for Case B) / `**Done when:**` (measurable end-state) / `**Estimated effort:**` (`<1hr`, `1–4hr`, `1–2 days`, or `≥1 week`). Two cases: Case A (concept already implemented — exercise extends/hardens), Case B (concept not yet implemented — exercise is the primary buildable target).
  13. `## Summary` (RENAMED in v1.21.0 — was `## Quick summary` in v1.19.0 and v1.20.0; same content shape. RECAP position — after Project exercises (for AI/ML files) or Tech reference (for system-design/DSA files), before Interview defense. Two parts: Part 1 is a one-paragraph concept recap of 3–5 sentences; Part 2 is 3–6 short declarative key-point bullets mixing shape / rule / tradeoff. System-design files include one bullet naming the checklist step(s) the pattern lives in. No new information — everything must already appear earlier in the file.)
  14. `## Interview defense` (with subsections: What an interviewer is really asking / Likely questions / The question candidates always dodge / One-line anchors). In v1.21.0, every Q&A in Likely questions gets a small ASCII diagram (5–10 lines, labelled) sized to the question level — [mid] gets a flow/shape diagram, [senior] gets a comparison diagram, [arch] gets a scale/boundary diagram. The dodge Q&A also gets a comparison diagram. Skip a diagram only when the question is genuinely non-visual.
  15. `## Validate your understanding` (with subsections: Level 1 / Level 2 / Level 3 / Level 4 / Quick check)

  If any of those is missing, flag it as "Missing section: `<section name>`" — not as a content-update issue.

  Also flag these specific structural-gap variants:
  - "Missing subtitle block (Industry name(s) + Type)" — when the file has the H1 and blockquote but no `**Industry name(s):**` / `**Type:**` lines between them.
  - "Missing code reference in: `## In this codebase`" — when the section exists but lacks the structured `**File:**` / `**Function / class:**` / `**Line range:**` lines.
  - "Missing Why care block" — when the section is absent or incomplete. Required: two short paragraphs (Paragraph 1 the hook, Paragraph 2 the zoom-out with an explicit handoff to How it works). No file paths, no project nouns — that's the test of a real zoom-out.
  - "Primary diagram in wrong position (still before How it works)" — flag any file where `## [Concept] — diagram` sits before `## How it works`. In v1.20.0 the order swapped: How it works walks the mechanics in prose first, then the primary diagram appears as the recap visual. The fix is to SWAP the two sections.
  - "Primary diagram missing architectural-layer labels" — flag any primary diagram that crosses a system boundary (UI ↔ Service, Service ↔ Storage, app ↔ Provider) without naming the boundary. The diagram must label each layer it spans using a left-margin label, a horizontal divider with the layer name, or grouped boxes inside a labelled band.
  - "How it works missing in-paragraph anchors" — flag any `## How it works` paragraph that introduces jargon without a secondary visual in the same paragraph (small diagram, pseudocode block, comparison table, or execution trace). Prose-only paragraphs that introduce new terms are not allowed.
  - "How it works missing handoff sentence to the primary diagram" — flag any `## How it works` block that ends without an explicit handoff line ("The full picture is below." / "Here's the diagram of the whole flow." / similar).
  - "How it works opens with a definition" — flag any `## How it works` block whose first paragraph starts with "X is a mechanism for...", "X is a pattern that...", "X refers to...", or any other definition-first opening. The v1.24.0 rule requires Move 1 to open with a concrete picture or metaphor, with the underlying strategy named in a follow-up sentence (NOT with the term).
  - "How it works missing layered walkthrough sub-headings (Move 2 absent)" — flag any `## How it works` block that doesn't break the concept into independent moving parts under their own bolded `###` sub-headings. A single block of running prose for a multi-part concept is a v1.24.0 failure. (Simple single-mechanism concepts like debounce may be exempt — apply judgment: if the concept genuinely has only one moving part, no sub-headings are needed.)
  - "How it works sub-section missing the frontend bridge sentence" — flag any move-2 sub-section that names a backend / AI / infra term without a bridge sentence translating it from a frontend concept the reader already knows ("if you're coming from frontend, you're used to X — here it's different" / "this is like React's [pattern], except..." / "in React you'd handle this with [hook]; in a backend you handle it with..."). Without the bridge, the writer has produced vocabulary rather than understanding.
  - "How it works missing concrete consequences (abstract-only claims)" — flag any `## How it works` paragraph that makes an abstract claim ("this is secure" / "this is fast" / "this isolates data") without immediately following it with a concrete consequence walked through with a specific example ("if user A's client sends a query for `id = 'abc123'` belonging to user B, the database looks for `(user_A_id, 'abc123')` and that row literally does not exist").
  - "How it works missing Phase A / Phase B sub-section when applicable" — flag any `## How it works` block describing a concept that involves something built-but-not-yet-active, in-migration, planned-but-gated, or with a deprecated path still in the codebase, but lacks a Phase A / Phase B (or Now / Later) sub-section. The sub-section is required for these concepts because the gap between current code and intended future state is itself the lesson; without it, the reader misreads the current state as final.
  - "How it works missing principle paragraph (Move 3)" — flag any `## How it works` block that ends without a takeaway paragraph naming the generalisable principle ("this is what people mean by designing for multi-tenancy from the start" / "this is what defense in depth looks like in a real system"). A handoff sentence to the diagram is not a substitute; both are required, in order.
  - "How it works length mismatched to complexity" — soft flag (judgment-based): a four-paragraph How it works on a multi-layer auth pattern is under-built; a twenty-paragraph How it works on a debounce function is over-built. Note it for the user but don't auto-fix.
  - "Quick summary in wrong position (still after Why care)" — flag any v1.18.0-shape Quick summary that sits between Why care and How it works/diagram. It must be MOVED to after Tradeoffs and before Interview defense, RESHAPED to the v1.19.0+ recap form (Part 1 concept-recap paragraph + Part 2 key-point bullets), and RENAMED to `## Summary`.
  - "Section renamed: `## Quick summary` → `## Summary`" — flag any file whose recap block heading is still `## Quick summary` (v1.19.0 and v1.20.0 wording). Rename the heading; content shape is unchanged.
  - "Tradeoffs still in prose/bullet form" — flag any `## Tradeoffs` block that doesn't have the v1.21.0 structure: comparison table (≥4 cost dimensions) + Sub-block 1 "what we gave up" + Sub-block 2 "what the alternative would have cost" + Sub-block 3 "the breakpoint" (Sub-block 4 "what wasn't actually a tradeoff" is optional). Old prose/bullets become source material for Sub-block 1.
  - "Tradeoffs missing breakpoint" — flag any Tradeoffs block whose breakpoint sub-block is vague ("fine for now", "fine until it isn't", "fine until we scale") or absent. The breakpoint must be quantitative or event-shaped, or the file must openly say "the decision was a guess, not a tradeoff."
  - "Interview defense answers missing per-answer diagrams" — flag any Likely-questions Q&A without a small ASCII diagram (5–10 lines, fenced block, labelled) appropriate to the question level: flow/shape for [mid], comparison for [senior], scale/boundary for [arch]. Skip flagging only when the question is genuinely non-visual.
  - "Dodge question missing comparison diagram" — flag any "The question candidates always dodge" block without a comparison diagram showing what was picked vs what the questioner suggested, with the full cost ledger.
  - "Missing `## Tech reference (industry pairing)` section" — flag any concept file that references a specific library, framework, or service (e.g., Express, Prisma, Netlify Functions, React Query, expo-sqlite) without a dedicated `## Tech reference (industry pairing)` section between Tradeoffs and Summary. v1.22.0 files inlined the pairings into Tradeoffs / How it works / Interview defense; the v1.23.0 fix is to extract them into one dedicated section.
  - "Tech reference uses markdown table with pipes" — flag any Tech reference section formatted as a pipe-table (`| Codebase uses | Why it's here | ... |`). These break in narrow renderings and render as garbage on mobile. The fix is to reformat every tech as `### [tech name]` heading + labelled bullets (`**Codebase uses:**`, `**Why it's here:**`, `**Leading today:**`, `**Why it leads:**`, `**Runner-up:**`).
  - "Tech reference subsection missing one of the five required bullets" — flag any `###` tech subsection that doesn't carry all required labelled bullets in order: `**Codebase uses:**` / `**Why it's here:**` / `**Leading today:**` (with `adoption-leading` or `innovation-leading` + year) / `**Why it leads:**` / `**Runner-up:**` (mandatory when the codebase already uses the leader).
  - "Industry pairing still inlined in Tradeoffs / How it works / Interview defense" — flag any concept file where industry-leader content lives in sections other than Tech reference. Move the pairing into the dedicated section; leave the sections free to name what the codebase uses but strip leader/runner-up content from them.
  - "Missing `## Project exercises` section (AI/ML file)" — flag any file in `03-ai-engineering/` or `04-machine-learning/` that doesn't have a `## Project exercises` block between Tech reference and Summary. The v1.26.0 fix is to walk the curriculum file's Build items (`[Bx.y]`), include each item whose concept tags overlap with this file's concept IDs, and add a `###` subsection per exercise with the six labelled bullets.
  - "Project exercises subsection missing one of the six required bullets" — flag any `###` exercise subsection that doesn't carry all required labelled bullets in order: `**Exercise ID:**` / `**What to build:**` / `**Why it earns its place:**` / `**Files to touch:**` / `**Done when:**` / `**Estimated effort:**`.
  - "Project exercises missing `Done when` end-state" — flag any subsection whose `**Done when:**` value is vague ("works", "is complete", "is implemented") rather than a measurable end-state. The fix is to rewrite the end-state with a concrete artifact, file path, test command, or measured number. If no measurable end-state can be named, the exercise itself is wrong and should be replaced.
  - **Curriculum-driven flags only fire in curriculum-loaded mode.** The four flags below ("Missing Project exercises", "Project exercises subsection missing bullets", "AI/ML file covers out-of-scope concept", "Curriculum concept in scope but missing a file") apply ONLY when Step 2 loaded a curriculum file. In codebase-driven mode, these flags are silently skipped — codebase-driven is a first-class mode, not a fallback, and AI/ML files in this mode legitimately have no Project exercises block and no concept-of-scope to validate against.
  - **Mode-switch flags** (when the previous run and this run differ in mode):
    - "Existing Project exercises block but curriculum no longer loaded" — flag any AI/ML file that already carries a `## Project exercises` block when this run is in codebase-driven mode. Two options the user picks in Step 7U: (a) keep the existing block as-is (the curriculum-supplied content stays useful even if a new curriculum check can't validate it this run), or (b) strip the block to match the current codebase-driven mode. Default: keep.
    - "Curriculum loaded but existing AI/ML files lack Project exercises" — flag any file in `03-ai-engineering/` or `04-machine-learning/` that doesn't carry a `## Project exercises` block when this run is in curriculum-loaded mode. The fix is to add the block by walking the curriculum for Build items matching the file's concept IDs (same as the standard "Missing Project exercises section" flag).
  - "AI/ML file covers a concept that's out of curriculum scope" — flag any `03-ai-engineering/` or `04-machine-learning/` file whose concept IDs don't appear in the curriculum's in-scope list (status `covered`, `learn-only`, or `deferred`) for the project being studied. These files are stale and should be removed (or the curriculum needs to be updated to include them).
  - "Curriculum concept in scope but missing a file" — flag any curriculum concept `[Cx.y]` tagged for this project with status `covered`, `learn-only`, or `deferred` that doesn't have a corresponding file in `03-ai-engineering/` or `04-machine-learning/`. The v1.26.0 fix is to generate a new file for the missing concept, using Case B of the In this codebase block if the concept isn't yet implemented.
  - "Why care still hands off to Quick summary or to the diagram" — flag any Why care paragraph 2 whose closing sentence says "Quick summary below" (v1.18.0 wording) or "diagram below" / "diagram and How it works" (v1.19.0 wording). The handoff target is now How it works alone.
  - **Note on legacy guides:**
    - Files generated under **v1.17.0** may contain `## In plain English` (with the three sub-sections `### The question` / `### The answer in one breath` / `### Where you'd see this elsewhere`) instead of the new `## Why care`. Treat as "Section to be replaced: `## In plain English` → `## Why care`" — use the existing content as source material when collapsing the three sub-sections into the two new paragraphs.
    - Files generated under **v1.17.0** in `02-dsa/` and `03-ai-engineering/` may use Quick summary Variant B (`**Data shape:**` / `**Operation:**` / etc.) or Variant C (`**The chain:**` / etc.). Those variants were removed in v1.18.0 and the whole block has since moved + reshaped in v1.19.0. Treat as "Quick summary to be migrated to v1.19.0 recap form (paragraph + key points) AND moved to after Tradeoffs" — preserve the old bullet content as raw material for the new recap sentences and key-point bullets.
    - Files generated under **v1.18.0** have Quick summary in the WRONG position (between Why care and the diagram) and in the WRONG shape (single zoom-in bullet list of `**What:**` / `**Why here:**` / `**Checklist step:**` / `**Tradeoff:**`). Treat as "Quick summary to be moved (to after Tradeoffs) AND reshaped (to Part 1 recap paragraph + Part 2 key-point bullets)". The v1.18.0 bullet content is reusable material — `**What:**` and `**Why here:**` feed Part 1's "what the pattern is" and "how it shows up here" sentences; `**Tradeoff:**` feeds Part 1's "constraint" and "cost" sentences; `**Checklist step:**` becomes one of Part 2's key-point bullets.
    - Files generated under **v1.19.0** have the primary diagram in the WRONG position (still before `## How it works`) and a Why care paragraph 2 whose handoff sentence points at "the diagram and How it works". v1.20.0 swapped the order — How it works comes first, primary diagram follows as recap visual — and the Why care handoff now points at How it works alone. Treat as "Sections to be reordered: `## How it works` and `## [Concept] — diagram` must be SWAPPED so How it works is first". Also: append a handoff sentence at the end of How it works pointing at the primary diagram below; add architectural-layer labels to the primary diagram if it crosses any layer boundary; rewrite the Why care paragraph 2 closing sentence to hand off to How it works only.
    - Files generated under **v1.20.0** have `## Quick summary` (instead of `## Summary`), a placeholder-only `## Tradeoffs` block (one prose paragraph or a bullet list — no comparison table, no sub-blocks), and Interview-defense Q&A answers without per-answer diagrams. The v1.21.0 fixes are: (a) rename `## Quick summary` → `## Summary` (content unchanged); (b) expand `## Tradeoffs` from placeholder/bullets into the structured form (comparison table + sub-blocks 1, 2, 3, optional 4) — the old prose becomes raw material for Sub-block 1 "what we gave up"; (c) for each Likely-questions Q&A, add a small ASCII diagram matched to the question level (flow/shape for [mid], comparison for [senior], scale/boundary for [arch]); (d) for the dodge Q&A, add a comparison diagram showing what was picked vs the questioner's suggestion with the full cost ledger.
    - Files generated under **v1.21.0** name specific libraries/frameworks/services (e.g., Express, Prisma, Netlify Functions, React Query) without pairing them with the current industry leader. The v1.22.0 fix is to add industry-leader pairings; the v1.23.0 fix is then to consolidate those pairings into a dedicated `## Tech reference (industry pairing)` section (see v1.22.0 note below).
    - Files generated under **v1.22.0** carry the industry-leader pairings but inlined them throughout the file (most often into Tradeoffs, sometimes also into How it works or Interview defense answers), and in many cases formatted them as one-row markdown tables with pipes — which render as garbage strings of `|` characters on narrow screens (mobile, narrow GitHub panes). The v1.23.0 fix is to: (a) create a new `## Tech reference (industry pairing)` section between Tradeoffs and Summary; (b) extract every industry-leader pairing from wherever it currently lives (Tradeoffs sub-blocks, How it works prose, Interview defense answers) and move it into the new section as a `###` subsection per tech; (c) reformat each tech entry as `### [tech name]` heading + five labelled bullets (`**Codebase uses:**` / `**Why it's here:**` / `**Leading today:**` / `**Why it leads:**` / `**Runner-up:**`); (d) leave references in other sections naming what the codebase uses (e.g., "this codebase uses expo-sqlite via `database.ts`") but strip leader/runner-up content from them. **Never use markdown tables with pipes for tech entries.**
    - Files generated under **v1.23.0** have a `## How it works` block written as 2–3 short paragraphs without the three-moves structure. v1.24.0 restructures the block: Move 1 (mental model / metaphor opening — NOT a definition), Move 2 (layered walkthrough where each independent part gets its own bolded `###` sub-heading and covers the technical term, the frontend-to-backend bridge, the practical consequence walked concretely, and the condition under which it works/breaks), Move 2.5 (Phase A / Phase B when applicable), Move 3 (the principle that generalises). Length scales with complexity (four paragraphs for debounce, fifteen-plus for complex auth). The v1.24.0 fix is to rewrite the How it works block in place: reuse existing prose as raw material for the move-2 sub-sections, add a metaphor opening if missing, split running prose into sub-headings, inject frontend-bridge sentences ("if you're coming from frontend, you're used to X — here it's different"), promote any abstract claims into abstract-claim + concrete-consequence pairs, append a Phase A / Phase B sub-section when the concept warrants it, and end with a principle paragraph + handoff line.
    - Files generated under **v1.24.0** are missing two things from the section-level inventory: (a) the **`04-machine-learning/` section** (if the codebase has any trained-model / supervised-learning / recommender / on-device-inference surface that wasn't previously documented), and (b) the **expanded `03-ai-engineering/` inventory** organized by sub-discipline. The v1.24.0 catalog of AI patterns was 8 files; v1.25.0 expanded it to ~34 patterns grouped by sub-discipline (LLM foundations / Prompt engineering / Context and prompts / Retrieval and RAG / Agents and tool use / Evals and observability / Production serving / How this codebase uses AI). The v1.25.0 fix is to: (1) walk the project context for ML surface — if any trained model, recommender, or on-device inference is in scope, create `04-machine-learning/` and walk the sub-disciplines listed in Step 6C, adding only the patterns that apply; (2) walk the expanded AI catalog (loaded in Step 3 under "SECTION 03 — AI ENGINEERING") and add any sub-discipline patterns the codebase actually uses that aren't already documented — typically patterns like tokenization, sampling parameters, structured outputs, streaming, token economics, heuristic-before-LLM, eval set types, LLM observability, prompt injection, etc. Existing v1.24.0 AI files keep their numeric prefixes; new files take the next available numbers and the README index is re-grouped by sub-discipline.
    - Files generated under **v1.25.0** were inventoried by walking the codebase (and the expanded AI catalog), but v1.26.0 changes the inventory model for Sections 03 and 04 to be **curriculum-driven**: the inventory walks the curriculum file (`aieng-curriculum.md`) and generates one file per in-scope curriculum concept, whether or not the codebase implements it yet. v1.25.0 files also lack the `## Project exercises` block (which sits between Tech reference and Summary). The v1.26.0 fix is to: (1) verify a curriculum file exists at `.aipe/project/aieng-curriculum.md` or `~/.config/aipe/global/aieng-curriculum.md`; if not, stop and ask the user to place one; (2) for every existing AI/ML file, look up its concept IDs in the curriculum and add the `## Project exercises` block using the matching `[Bx.y]` Build items (Case A if the codebase implements the concept, Case B if not — `## In this codebase` becomes "Not yet implemented" with one honest sentence); (3) check the curriculum for in-scope concepts that don't yet have a file in the section directory and generate new files for each (using Case B in `## In this codebase` and the curriculum's Build item as the primary buildable target in Project exercises); (4) propose removal for any existing file covering a concept that's out of curriculum scope. The README indexes for Section 03 and 04 are regrouped by curriculum phase rather than discipline grouping (so the reader can trace each phase's concepts in order).

  All variants are fixed the same way: insert/replace/reorder/restructure the affected fields in their canonical position, with values drawn from the project context, the curriculum file, and existing-block content where present.

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

[Header line indicating mode — always print:]
Mode: <curriculum-loaded | codebase-driven>
[If curriculum-loaded, also include the curriculum file path on the next line.]
[No warning banner — both modes are first-class. The Mode line tells the user which set of flags ran.]

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
- For **structurally absent sections**, append the section in canonical order. The current sequence is: Title → **Subtitle (Industry name(s) + Type)** → blockquote → See also → **Why care** → **How it works** → **[Concept] — diagram (recap visual, labels every layer)** → In this codebase → Elaborate → **Tradeoffs (comparison table + 4 sub-blocks)** → **Tech reference (industry pairing — `###` per tech + labelled bullets, no pipe-tables)** → **Project exercises (AI/ML files only — `###` per exercise + six labelled bullets)** → **Summary (recap form)** → **Interview defense (with per-answer diagrams)** → Validate your understanding.
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
- For a **`## How it works` block opening with a definition** ("X is a mechanism for...", "X is a pattern that..."), rewrite the opening paragraph to start with a concrete picture or metaphor. Pick a metaphor that maps to the underlying strategy ("two locked doors, but only one is installed right now" for defense in depth; "a coat check that hands you the same ticket every time" for connection pooling). After the metaphor, follow with one sentence naming the underlying strategy in plain English. The technical term gets introduced inside the move-2 sub-headings, not in the opening.
- For a **`## How it works` block written as running prose without layered sub-headings**, restructure into Move 2 sub-headings (one bolded `###` per independent moving part of the concept). Reuse the existing prose as raw material for each sub-section; do NOT discard it. For each sub-section ensure the four required things are present: (1) the technical term, (2) a bridge from frontend, (3) a concrete consequence walked through with a specific example, (4) the boundary condition. Single-mechanism concepts (debounce, hash lookup) may legitimately not need sub-headings — apply judgment; if the concept has only one moving part, leave the block as flowing prose.
- For a **move-2 sub-section missing the frontend bridge sentence**, insert a bridge sentence that translates the backend/AI/infra term into something the reader already understands from frontend. Use one of the bridge starters: "If you're coming from frontend, you're used to X. Here it's different — Y." / "This is like React's [pattern], except the [thing] lives on the server." / "Think of it like [browser API], but [twist]." / "In React you'd handle this with [hook]; in a backend you handle it with [server equivalent]." The bridge is the load-bearing sentence — without it, the writer has produced vocabulary rather than understanding.
- For a **`## How it works` paragraph with abstract claims and no concrete consequence**, follow each abstract claim with a concrete walk-through. "This is secure" → "This is secure: if user A's client sends a query for `id = 'abc123'` belonging to user B, the database looks for `(user_A_id, 'abc123')` and that row literally does not exist — the data is invisible at the structural level, not the policy level." Concrete consequences are mandatory; abstract claims without them are banned.
- For a **`## How it works` block missing a Phase A / Phase B sub-section** when the concept involves something built-but-not-yet-active (multi-tenant scaffolding, auth migration, feature flag, gradual rollout, deprecated path still in the codebase), insert a Move 2.5 sub-section. Phase A covers what's true in the code right now; Phase B covers what's planned and why it's currently gated; the closing line names what *doesn't* have to change between phases (this is often the architectural-foresight lesson the sub-section is meant to surface). Skip the sub-section only when the concept is fully shipped and stable.
- For a **`## How it works` block missing the Move 3 principle paragraph**, append a closing paragraph naming the takeaway that generalises beyond this codebase ("this is what people mean by designing for multi-tenancy from the start" / "this is what defense in depth looks like in a real system" / "this is why every web framework eventually adds optimistic updates"). The principle paragraph is NOT a summary of the mechanics — it's the lesson the reader carries to other codebases. After the principle paragraph, the handoff sentence to the primary diagram follows ("The full picture is below.").
- For a **primary diagram missing architectural-layer labels** (the diagram crosses a UI ↔ Service, Service ↔ Storage, or app ↔ Provider boundary without naming it), add the layer labels. Use whichever shape fits: a left-margin label, a horizontal divider with the layer name, or grouped boxes inside a labelled band (`┌─ Service layer ──┐ ... └────────────┘`). Pick the labels from the system map in `00-overview.md` so the bands match the layers the system actually has.
- For a **legacy `## In plain English` block (v1.17.0 shape)**, REPLACE the section with `## Why care`. Collapse the three sub-sections into two paragraphs: paragraph 1 turns "The question" into the hook (rephrase the question as one of the three angles), paragraph 2 fuses "The answer in one breath" + "Where you'd see this elsewhere" into a single zoom-out paragraph with an explicit handoff sentence pointing at How it works. Old content is reusable as source material.
- For a **Quick summary in the v1.18.0 position and shape** (still sitting between Why care and the diagram/How it works, as a bullet list of `**What:**` / `**Why here:**` / `**Checklist step:**` / `**Tradeoff:**`), do all THREE: (a) DELETE the block from its old position, (b) INSERT a new block in the v1.19.0+ recap form between Tradeoffs and Interview defense, and (c) NAME the new block `## Summary` (not `## Quick summary`). The recap form has two parts: **Part 1** is a single paragraph of 3–5 sentences (what the pattern is / how it shows up in this codebase / the constraint that forced it / the cost being paid); **Part 2** is 3–6 short declarative key-point bullets mixing shape / rule / tradeoff. For system-design files, include one bullet in Part 2 that names the checklist step(s). Reuse the v1.18.0 bullet content as raw material: `**What:**`'s second sentence feeds Part 1's "how it shows up here" sentence; `**Why here:**` feeds Part 1's "constraint" sentence; `**Tradeoff:**` feeds Part 1's "cost" sentence; `**Checklist step:**` becomes the system-design checklist-step bullet in Part 2.
- For a **legacy Quick summary Variant B or C (v1.17.0 shape)** in `02-dsa/` or `03-ai-engineering/` files, treat it the same as the v1.18.0 case: DELETE from old position, INSERT v1.19.0+ recap form after Tradeoffs, NAME it `## Summary`. Map the legacy bullets through the v1.18.0 → v1.19.0 path (Variant B's `**Operation:**` → Part 1's "what the pattern is" sentence; `**Breakpoint:**` → Part 1's "constraint" sentence; etc.). Preserve old prose as material; drop the variant-specific labels.
- For a **`## Quick summary` heading still in place** (v1.19.0/v1.20.0 files with the block already in the correct position and recap shape), simply rename the heading to `## Summary`. Do not touch the content.
- For a **`## Tradeoffs` block still in placeholder/prose/bullet form** (no comparison table, no sub-blocks), restructure it to the v1.21.0 form: (a) insert a comparison table at the top with at least four cost dimensions, two columns (path taken vs alternative) — pick dimensions from the cost-dimension catalog (performance, money, complexity, cognitive load, vendor lock-in, debugging, hire-ability, failure blast); (b) Sub-block 1 — "what we gave up" — walk each cost in concrete terms (files, line counts, ms, dollars, scenarios); the old prose/bullets become source material for this sub-block; (c) Sub-block 2 — "what the alternative would have cost" — same dimensions, counterfactual frame; (d) Sub-block 3 — "the breakpoint" — quantitative or event-shaped; if no real breakpoint exists, say openly that the decision was a guess, not a tradeoff; (e) Sub-block 4 — "what wasn't actually a tradeoff" — only if a plausible-but-not-real alternative exists. Strip any hedging language ("performance is acceptable but could be improved" → either own the cost or own the mistake).
- For a **`## Tradeoffs` block with a vague breakpoint** ("fine for now", "fine until it isn't", "fine until we scale", "fine until requirements change"), rewrite Sub-block 3 to give a concrete breakpoint — a number (chain calls/day, team size, dollar threshold) or a named event (provider's unique feature becomes load-bearing, offline support becomes a requirement). If no real breakpoint can be named, replace the sub-block with one sentence saying the decision was a guess rather than a tradeoff.
- For **Interview-defense Likely questions Q&As missing per-answer diagrams**, add a small ASCII diagram (5–10 lines, fenced block, labelled) under each answer, matched to the question level: [mid] gets a flow/shape diagram (3–5 boxes showing the thing's behaviour or parts); [senior] gets a comparison diagram (two columns, "what we picked" vs "what we didn't", tradeoff as the point); [arch] gets a scale/boundary diagram (what changes at 10×, often a layer diagram with one layer marked "breaks first"). Skip adding a diagram only when the question is genuinely non-visual (rare).
- For an **Interview-defense dodge Q&A missing a comparison diagram**, add a comparison diagram showing what was picked vs the questioner's suggestion, with the full cost ledger (build time, ops burden, idle cost, cold-start, right-when row). Two-column ASCII table, fenced block.
- For a **missing `## Tech reference (industry pairing)` section**, insert it between `## Tradeoffs` and `## Summary`. Walk every section that names a specific library / framework / service (How it works, Tradeoffs sub-blocks, Interview defense answers and diagrams) and collect the tech names — runtime, framework, ORM/query layer, AI provider, storage, queue, auth, observability. For each tech, create a `###` subsection in the new Tech reference section with five labelled bullets in order: `**Codebase uses:**` (the real lib/service in the repo + the file or import line); `**Why it's here:**` (one sentence — the specific job this tech does that would break if it were missing); `**Leading today:**` (name + `adoption-leading` for battle-tested patterns or `innovation-leading` for fast-moving areas, with the year 2026); `**Why it leads:**` (one sentence on the specific technical reason — typed end-to-end, server-component-native, zero bridge cost, edge-runtime-compatible — never marketing); `**Runner-up:**` (credible alternative with one sentence on its angle — required when the codebase already uses the leader). Draw the leader/runner-up choices from the template's "What to expect by discipline" catalog (loaded in Step 3 — frontend / backend / full-stack sections each list "Common in real codebases" and "Leading today"). Never claim a single tech "won"; name real disagreement where it exists.
- For a **Tech reference section formatted as a markdown pipe-table** (one row per tech with `|` separators — the v1.22.0 broken-output pattern), REWRITE the section. Delete the pipe-table entirely. For each tech that appeared as a row, create a `###` subsection with five labelled bullets in the order above. Pipe-tables are banned for tech entries; they render as garbage on narrow screens.
- For an **inlined industry-leader pairing in Tradeoffs / How it works / Interview defense** (the v1.22.0 pattern of mentioning "leading today" inside other sections), EXTRACT the pairing into the dedicated Tech reference section and STRIP the leader/runner-up sentences from the source section. The source section may still name what the codebase uses (e.g., "this codebase uses expo-sqlite via `database.ts`"), but anything about industry direction belongs only in Tech reference.
- For a **Tech reference `###` subsection missing one of the five labelled bullets**, append the missing bullets in canonical order (`**Codebase uses:**` / `**Why it's here:**` / `**Leading today:**` / `**Why it leads:**` / `**Runner-up:**`). Pick values from the project context and the discipline catalog. Mark `**Runner-up:**` required when the codebase already uses the leader; otherwise it's optional but valuable.
- For a **missing `## Project exercises` section in an AI/ML file**, insert it between `## Tech reference (industry pairing)` and `## Summary`. Walk the curriculum file (loaded in Step 2) and select every Build item `[Bx.y]` whose concept tags overlap with this file's concept IDs. For each selected exercise, create a `###` subsection with six labelled bullets in order: `**Exercise ID:**` (verbatim from the curriculum), `**What to build:**` (concrete deliverable from the curriculum's exercise statement), `**Why it earns its place:**` (one sentence on the interview signal), `**Files to touch:**` (real file paths in this codebase, or expected paths if the concept is Case B / not-yet-implemented), `**Done when:**` (measurable end-state — concrete artifact / file path / test command / measured number), `**Estimated effort:**` (`<1hr`, `1–4hr`, `1–2 days`, or `≥1 week`). Expect 1–3 exercises per file; if zero curriculum items match, the file is either covering a `learn-only` concept (say so in one line) or it's out of scope (the file should be removed).
- For a **Project exercises subsection missing one or more of the six labelled bullets**, append the missing bullets in canonical order. Source values from the curriculum's exercise statement (`**What to build:**`, `**Why it earns its place:**`, `**Estimated effort:**`) and from the project context (`**Files to touch:**`). Rewrite `**Done when:**` if it's vague ("works", "is complete") into a measurable end-state.
- For an **AI/ML file covering a concept that's out of curriculum scope**, propose removal in the Step 7U change plan rather than auto-deleting. The user confirms removal in their reply; only then delete the file and re-index the section README.
- For a **curriculum concept in scope but missing a file**, generate a new file in the appropriate section directory (`03-ai-engineering/` or `04-machine-learning/`) using the same per-concept template. Determine Case A vs Case B from the project context: if the concept is implemented in the codebase, write `## In this codebase` describing the implementation; if not, write `## In this codebase` as "Not yet implemented" with one honest sentence on why (deferred to Phase X / gated on prerequisite Y). Either way, the file gets a full `## Project exercises` block from the matching curriculum Build items — for Case A, the exercise is the *next* step that extends/hardens; for Case B, the exercise is the *primary* buildable target.
- For a **missing curriculum file** when the codebase has AI/ML surface, do not attempt to repair AI/ML files automatically. Stop and ask the user to place a curriculum file at `.aipe/project/aieng-curriculum.md` or `~/.config/aipe/global/aieng-curriculum.md`. Re-run /aipe:study once it's in place.
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
