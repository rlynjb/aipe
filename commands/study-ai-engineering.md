---
description: AI engineering + ML study guide for this codebase — 9 sub-sections, three shapes of AI work
---

The user invoked `/aipe:study-ai-engineering`.

This command takes **no arguments**. There is one AI engineering guide per repo, saved at the fixed path `.aipe/study-ai-engineering/`. `.aipe/` is per-repo (lives at the root of whichever repo the command is run in); the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused companion to `/aipe:study` — same per-concept template, same staff-engineer persona, but a fixed concept inventory spanning AI engineering (LLM foundations, retrieval, agents, evals, production serving) and machine learning. **AI engineering and ML content lives exclusively here** — `/aipe:study` no longer covers it (study.md was reduced to system-design + DSA).

**Per-repo scope.** This spec runs against one codebase at a time — the repo where the command was invoked. It does not span multiple codebases. The "three shapes of AI work" framing (LLM application engineering / prompt engineering as discipline / classical ML) is used to *recognize* which kind of codebase you're in, not to require references to other projects. Examples per shape are illustrative, not mandatory.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-ai-engineering.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `.aipe/project/aieng-curriculum.md` or `.aipe/project/curriculum.md` (optional but valuable — curriculum-loaded mode generates one file per in-scope `[Cx.y]` AI/ML concept; without it, the inventory falls back to the fixed concept catalog the spec defines)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)
- `~/.config/aipe/global/aieng-curriculum.md` or `~/.config/aipe/global/curriculum.md` (optional)

Per-repo scope: do NOT load context files from other repos. The codebase being studied is the one this command was invoked in.

## Step 3 — Load both templates

AI engineering inherits the per-concept-file template from `study.md`. Load both:

```
${CLAUDE_PLUGIN_ROOT}/specs/study.md
${CLAUDE_PLUGIN_ROOT}/specs/study-ai-engineering.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` and `specs/study-ai-engineering.md` upward from this file's location.

`study.md` is read for **structure** — per-concept template, formatting rules, diagram requirements, hard rules, Validate block, constraint summary. `study-ai-engineering.md` is read for **topic, concept inventory, three-shapes framing, and AI/ML-specific constraints**. The agent uses both in tandem.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-ai-engineering/` already contains the guide. The signal is the presence of `00-overview.md` at the root OR any file inside `01-llm-foundations/`, `02-context-and-prompts/`, `03-retrieval-and-rag/`, `04-agents-and-tool-use/`, `05-evals-and-observability/`, `06-production-serving/`, `07-system-design-templates/`, `08-machine-learning/`, or `09-ml-system-design-templates/`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

(The `.aipe/study-ai-engineering/` directory itself may exist as an empty placeholder; that's not the same as having a guide already.)

---

# CREATE MODE

Runs only when no existing guide is found.

## Step 5C — Identify the codebase's shape

Before planning the inventory, identify which of the three shapes of AI work this codebase most resembles. This determines which sub-sections will be richest:

- **LLM application engineering** — single-purpose chains, retrieval, agents that call tools, prompt-driven features. (loopd is an example of this shape.)
- **Prompt engineering as a discipline** — meta-tooling: markdown specs, slash commands, retrieval over project context, prompts that generate prompts. (aipe is an example.) For codebases that match *this* shape primarily, much of the content belongs in `/aipe:study-prompt-engineering` instead — this spec covers the operational side (token budgeting, retrieval over context, evals).
- **Classical supervised ML + on-device inference** — trained models, data pipelines, feature engineering, retraining, metrics, deployment to constrained runtimes. (contrl-mo is an example.) Sub-section 08 (machine learning) carries the weight here.

Most codebases lean toward one shape but exercise patterns from the others. Record the dominant shape; it informs which sub-sections to weight, which patterns to expect, and which "features in this codebase" file ends up substantive vs honestly-empty.

## Step 6C — Plan the guide

Apply the structure from `study.md` (the per-concept-file template loaded in Step 3) and the topic + inventory from `study-ai-engineering.md`.

The non-negotiables — inherited from both specs:

1. **Persona: staff engineer.** Same as `study.md` — 12 years industry, 8 at Google/Meta on distributed systems at scale, 4 as EM/principal at Series B. Authoritative, systems-focused, comparison-rich. AI engineering content is already systems-shaped (distributed inference, scale concerns, on-device deployment, retraining pipelines), so the staff-engineer voice fits. (Prompt engineering lives in its own spec — `/aipe:study-prompt-engineering` — with a different persona.)
2. **All structural rules from `study.md` apply unchanged** — the per-concept-file template (Subtitle, Why care's five moves, How it works's three moves with diagrams at every move and every sub-section, primary ASCII diagram, In this codebase, Elaborate, Tradeoffs, Tech reference, Project exercises when curriculum loaded, Summary, Interview defense with diagrams per Q&A, Validate), formatting rules (no markdown pipe-tables for Tech reference, kebab-case file names, no Mermaid/no images, box-drawing diagram characters), the frontend-primitive-first anchor priority order, the Validate block's 5 levels.
3. **Three-shapes framing as categories, not required references.** Each `═════` sub-section divider in `study-ai-engineering.md` declares which shape it primarily belongs to. The shape names a *category* of codebase, not a specific project — examples (loopd / aipe / contrl-mo) are illustrative. When the codebase being studied matches one of the shapes, weight coverage toward sub-sections in that shape. **Cover every sub-section** that the curriculum or codebase touches — even thinly — because the contrast between shapes is itself instructive.
4. **Curriculum-driven inventory when curriculum is loaded.** In curriculum-loaded mode, each sub-section generates one file per in-scope `[Cx.y]` concept (status `covered`, `learn-only`, or `deferred`) — including Case B for not-yet-implemented concepts. In codebase-driven mode (no curriculum), inventory falls back to the fixed concept catalog the spec defines. Both modes are first-class.
5. **Per-codebase synthesis files** (`ai-features-in-this-codebase.md`, `ml-features-in-this-codebase.md`) at the root of `.aipe/study-ai-engineering/` describe how *this codebase* uses AI and ML. They list every AI or ML feature in this repo (chains, models, prompts, classifiers) with the patterns each uses. If the codebase has no AI features, `ai-features-in-this-codebase.md` is still generated but says so honestly ("This codebase does not currently use any LLM-powered features. The concepts below are covered as study material; project exercises identify features that *could* be added."). Same for ML.
6. **System design templates are non-negotiable.** Sub-section 07 (AI side) and Sub-section 09 (ML side) generate IK-style interview-prompt reframes regardless of codebase applicability. The fixed list: AI side gets `01-search-ranking.md`, `02-tech-support-chatbot.md`; ML side gets `01-recommender-system.md`, `02-anomaly-detection.md`, `03-object-detection-cv.md`. Curriculum can extend with additional templates at the next available numeric prefix. Templates use the 9-labelled-bullet shape from study.md (`**The prompt:**` / `**Standard architecture:**` / `**Data model:**` / `**Key components:**` / `**Scale concerns:**` / `**Eval framing:**` / `**Common failure modes:**` / `**Applies to this codebase:**` / `**How to make it apply:**`), not the per-concept template.
7. **Prompt engineering is NOT in this spec.** It lives in `/aipe:study-prompt-engineering` with its own persona. This spec covers everything *except* prompt engineering as a discipline — LLM foundations, context window management (operational, not prompt-craft), retrieval, agents, evals, production serving, machine learning.

## Step 7C — Create the directory structure

Create:

```
.aipe/study-ai-engineering/
.aipe/study-ai-engineering/01-llm-foundations/
.aipe/study-ai-engineering/02-context-and-prompts/
.aipe/study-ai-engineering/03-retrieval-and-rag/
.aipe/study-ai-engineering/04-agents-and-tool-use/
.aipe/study-ai-engineering/05-evals-and-observability/
.aipe/study-ai-engineering/06-production-serving/
.aipe/study-ai-engineering/07-system-design-templates/
.aipe/study-ai-engineering/08-machine-learning/          (skip if no ML surface in this codebase)
.aipe/study-ai-engineering/09-ml-system-design-templates/ (always when 08 exists)
```

(Use `mkdir -p`.) Sub-section 08 is skipped only when this codebase has no ML surface (no trained models, recommenders, or on-device inference). Sub-section 09 is always created when 08 exists.

## Step 8C — Generate `00-overview.md`

System map of this codebase's AI/ML surface plus a one-line legend per major feature. Identify the codebase's dominant shape (from Step 5C) and orient the overview accordingly. **No prose paragraphs** beyond the opening overview sentence — the rest is the diagram and legend.

## Step 9C — Generate per-concept files in each sub-section

Walk the inventory from Step 6C (curriculum-loaded or codebase-driven). For each sub-section, generate one file per concept following `study.md`'s per-concept template. Use `study-ai-engineering.md`'s sub-section breakdown:

- **01-llm-foundations/** — what an LLM is, tokenization, sampling parameters, structured outputs, streaming, token economics, heuristic before LLM, provider abstraction, user override locks
- **02-context-and-prompts/** — context window, lost in the middle, prompt chaining
- **03-retrieval-and-rag/** — embeddings, embedding model choice, chunking strategies, vector databases, dense vs sparse, hybrid retrieval (RRF), reranking, query rewriting (HyDE), stale embeddings, incremental indexing, RAG, GraphRAG
- **04-agents-and-tool-use/** — agents vs chains, tool calling, ReAct pattern, tool routing, agent memory, error recovery
- **05-evals-and-observability/** — eval set types, eval methods, LLM-as-judge bias, LLM observability
- **06-production-serving/** — LLM caching, LLM cost optimization, prompt injection, rate limiting + backpressure, retry + circuit breaker
- **08-machine-learning/** — supervised pipeline, feature engineering, train/val/test, model selection, class imbalance, domain gap, transfer learning, confusion matrices, calibration, recommender systems, cold start, on-device inference, quantization, training run logging, drift detection, retraining pipelines

For each file: if this codebase implements the concept (Case A), `In this codebase` describes the implementation with real file + function + line range. If not (Case B), `In this codebase` says "Not yet implemented" with one honest sentence; Project exercises (when curriculum loaded) becomes the primary buildable target.

## Step 10C — Generate the two system-design-templates sub-sections

**07-system-design-templates/** (AI side): `01-search-ranking.md`, `02-tech-support-chatbot.md`. Curriculum may extend with `03-*`, `04-*`, etc.

**09-ml-system-design-templates/** (ML side): `01-recommender-system.md`, `02-anomaly-detection.md`, `03-object-detection-cv.md`. Curriculum may extend.

Each template uses the 9-labelled-bullet shape (NOT the per-concept template):
- `**The prompt:**` (verbatim interview prompt, one sentence)
- `**Standard architecture:**` (ASCII box-and-arrow diagram, the 60-second whiteboard)
- `**Data model:**` (what's stored where — indexes, embeddings, signals, logs)
- `**Key components:**` (named sub-systems — retrieval, ranking, serving, eval — with one technical choice + rationale each)
- `**Scale concerns:**` (three minimum, ordered by which problem hits first, each with a concrete threshold — "at 100k QPS", never vague)
- `**Eval framing:**` (metrics that matter, online vs offline, what's measured per deployment)
- `**Common failure modes:**` (three or four things an interviewer probes for, each with the mitigation)
- `**Applies to this codebase:**` (one of `yes` / `partially` / `no` with a paragraph explaining; when `partially`, name what's there and what's missing)
- `**How to make it apply:**` (concrete refactor or feature; references Project exercises when curriculum Build items apply)

## Step 11C — Generate the two per-codebase synthesis files

**`ai-features-in-this-codebase.md`** at the root — describes how *this codebase* uses AI. Lists every AI feature in the repo (chains, prompts, retrieval pipelines, agents, anything LLM-shaped) with the patterns each uses. Uses `###` heading + labelled bullets per feature, not pipe-tables. Each feature entry includes:
- `**Feature:**` what it does for the user (or for the engineer, if it's tooling)
- `**Patterns used:**` cross-references back to the concept files (e.g., `01-llm-foundations/04-structured-outputs.md`, `03-retrieval-and-rag/11-rag.md`)
- `**Why these patterns:**` one sentence on the design choice

If the codebase has no AI features, generate the file with one honest paragraph: "This codebase does not currently use any LLM-powered features. The concepts in this guide are covered as study material; the Project exercises blocks in individual concept files identify features that could be added."

**`ml-features-in-this-codebase.md`** at the root — same shape for ML features (trained classifiers, recommenders, on-device models). Skip this file if Sub-section 08 was skipped.

## Step 12C — Generate section README indexes

Each sub-section directory gets its own `README.md` indexing the files in that sub-section and noting the reading order. Most concepts are self-contained, so reading order matters less than discoverability — make the README scannable.

Also generate `.aipe/study-ai-engineering/README.md` at the root: full guide index, identification of the codebase's dominant shape (from Step 5C), reading order across sub-sections, and a pointer to the two per-codebase synthesis files.

## Step 13C — Report + stop

Print exactly:

```
✓ AI engineering guide created at .aipe/study-ai-engineering/
  Codebase shape:   <LLM application engineering / classical ML + on-device / mixed>
  00-overview.md
  README.md
  01-llm-foundations/                 (<N> files + README.md)
  02-context-and-prompts/             (<N> files + README.md)
  03-retrieval-and-rag/               (<N> files + README.md)
  04-agents-and-tool-use/             (<N> files + README.md)
  05-evals-and-observability/         (<N> files + README.md)
  06-production-serving/              (<N> files + README.md)
  07-system-design-templates/         (<N> files + README.md)
  08-machine-learning/                (<N> files + README.md)   [omit if not created]
  09-ml-system-design-templates/      (<N> files + README.md)   [omit if 08 not created]
  ai-features-in-this-codebase.md
  ml-features-in-this-codebase.md     [omit if 08 not created]
```

Then a 3–5 sentence summary: which sub-section was richest given the codebase's actual surface area, any Case B files (curriculum-driven concepts not yet implemented in this codebase), and whether the codebase is more LLM application engineering, more classical ML, or a mix.

**Stop. Wait for the user's next instruction.** They'll typically pick a concept file to drill on. Do NOT auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: refresh stale takes without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-ai-engineering/` recursively. Read every `.md` file in every sub-section, plus `00-overview.md`, `README.md`, `ai-features-in-this-codebase.md`, and `ml-features-in-this-codebase.md`.

If the existing guide contains older-style `ai-features-in-portfolio.md` or `ml-features-in-portfolio.md` files (from earlier versions of this command), flag them for rename to the `-in-this-codebase.md` form in the Step 7U change plan.

## Step 6U — Diff each file against the current codebase AND the loaded templates

Three diff sources to check per file:

- **Codebase drift** — file paths that have moved, function names that have changed, line ranges that no longer match the implementation, model versions named in Tech reference that have been upgraded.
- **Template drift** — `study.md` has added new blocks (e.g., a new Move sub-section, a new Tech reference field, a new Validate level) since the file was written. Identify missing blocks.
- **Inventory drift** — curriculum concepts whose status changed (newly in-scope, newly out-of-scope), new codebase features that warrant a new file, removed features whose file should be archived.

Output a structured change plan grouped by sub-section.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Maintain the staff-engineer voice. If the older `*-in-portfolio.md` files exist, rename to `*-in-this-codebase.md` and update content to be about this codebase specifically (not the portfolio). Append a changelog entry at the bottom of each updated file:

```
---
Updated: <today's ISO date> — <one-line summary of what changed and why>
```

Do NOT rewrite accurate sections. Do NOT add new concepts that aren't in the inventory or the curriculum.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-ai-engineering/
─────────────────────────────────────────────────
Files updated:        <list>
Files added:          <list>
Files renamed:        <list — e.g., ai-features-in-portfolio.md → ai-features-in-this-codebase.md>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
