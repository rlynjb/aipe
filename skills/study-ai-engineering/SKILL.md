---
description: AI engineering + ML study guide — portfolio-wide, 9 sub-sections, anchored to loopd / aipe / contrl-mo
---

The user invoked `/aipe:study-ai-engineering`.

This command takes **no arguments**. There is one AI engineering guide across the user's whole portfolio (not per-project) saved at the fixed path `.aipe/study-ai-engineering/`. The three project anchors (loopd / aipe / contrl-mo) inform the *examples* inside the files; the folder name is fixed. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused companion to `/aipe:study` — same per-concept template, same staff-engineer persona, but a fixed concept inventory spanning AI engineering (LLM foundations, retrieval, agents, evals, production serving) and machine learning. **AI engineering and ML content lives exclusively here** — `/aipe:study` no longer covers it (study.md was reduced to system-design + DSA).

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

This spec spans the whole portfolio, not a single project. Also load the project contexts for all three anchor projects when they exist — typically the agent is invoked from one of `loopd/`, `aipe/`, or `contrl-mo/`, but the spec references all three:

- `<loopd-repo>/.aipe/project/context.md` (when reachable)
- `<aipe-repo>/.aipe/project/context.md` (when reachable)
- `<contrl-mo-repo>/.aipe/project/context.md` (when reachable)

If only one project's context is available, generate from that project's perspective and mark the other two anchors' files as Case B ("not yet implemented" with a one-line honest note).

## Step 3 — Load both templates

AI engineering inherits the per-concept-file template from `study.md`. Load both:

```
${CODEX_PLUGIN_ROOT}/specs/study.md
${CODEX_PLUGIN_ROOT}/specs/study-ai-engineering.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` and `specs/study-ai-engineering.md` upward from this file's location.

`study.md` is read for **structure** — per-concept template, formatting rules, diagram requirements, hard rules, Validate block, constraint summary. `study-ai-engineering.md` is read for **topic, concept inventory, three-project anchor framing, and AI/ML-specific constraints**. The agent uses both in tandem.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-ai-engineering/` already contains the guide. The signal is the presence of `00-overview.md` at the root OR any file inside `01-llm-foundations/`, `02-context-and-prompts/`, `03-retrieval-and-rag/`, `04-agents-and-tool-use/`, `05-evals-and-observability/`, `06-production-serving/`, `07-system-design-templates/`, `08-machine-learning/`, or `09-ml-system-design-templates/`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

(The `.aipe/study-ai-engineering/` directory itself may exist as an empty placeholder; that's not the same as having a guide already.)

---

# CREATE MODE

Runs only when no existing guide is found.

## Step 5C — Plan the guide

Apply the structure from `study.md` (the per-concept-file template loaded in Step 3) and the topic + inventory from `study-ai-engineering.md`.

The non-negotiables — inherited from both specs:

1. **Persona: staff engineer.** Same as `study.md` — 12 years industry, 8 at Google/Meta on distributed systems at scale, 4 as EM/principal at Series B. Authoritative, systems-focused, comparison-rich. AI engineering content is already systems-shaped (distributed inference, scale concerns, on-device deployment, retraining pipelines), so the staff-engineer voice fits. (Prompt engineering lives in its own spec — `/aipe:study-prompt-engineering` — with a different persona.)
2. **All structural rules from `study.md` apply unchanged** — the per-concept-file template (Subtitle, Why care's five moves, How it works's three moves with diagrams at every move and every sub-section, primary ASCII diagram, In this codebase, Elaborate, Tradeoffs, Tech reference, Project exercises when curriculum loaded, Summary, Interview defense with diagrams per Q&A, Validate), formatting rules (no markdown pipe-tables for Tech reference, kebab-case file names, no Mermaid/no images, box-drawing diagram characters), the frontend-primitive-first anchor priority order, the Validate block's 5 levels.
3. **Three-project anchor framing.** Each `═════` sub-section divider in `study-ai-engineering.md` carries an `Anchor:` line naming the primary project (loopd / aipe / contrl-mo) and a `Curriculum:` line naming the phase + concept ID range. The three anchors map to three shapes of AI work — loopd (LLM application engineering: prompts, chains, retrieval), aipe (prompt engineering as discipline + meta-tooling, covered in study-prompt-engineering), contrl-mo (classical supervised ML + on-device inference). **Every sub-section is covered**, because the three-shapes interview story depends on the contrast.
4. **Curriculum-driven inventory when curriculum is loaded.** In curriculum-loaded mode, each sub-section generates one file per in-scope `[Cx.y]` concept (status `covered`, `learn-only`, or `deferred`) — including Case B for not-yet-implemented concepts. In codebase-driven mode (no curriculum), inventory falls back to the fixed concept catalog the spec defines. Both modes are first-class.
5. **Cross-codebase synthesis files** (`ai-features-in-portfolio.md`, `ml-features-in-portfolio.md`) at the root of `.aipe/study-ai-engineering/` list every AI or ML feature across the portfolio with the patterns each uses. These replace the per-codebase "How this codebase uses AI/ML specifically" sub-sections from the old study.md, because this spec spans multiple codebases.
6. **System design templates are non-negotiable.** Sub-section 07 (AI side) and Sub-section 09 (ML side) generate IK-style interview-prompt reframes regardless of codebase applicability. The fixed list: AI side gets `01-search-ranking.md`, `02-tech-support-chatbot.md`; ML side gets `01-recommender-system.md`, `02-anomaly-detection.md`, `03-object-detection-cv.md`. Curriculum can extend with additional templates at the next available numeric prefix. Templates use the 9-labelled-bullet shape from study.md (`**The prompt:**` / `**Standard architecture:**` / `**Data model:**` / `**Key components:**` / `**Scale concerns:**` / `**Eval framing:**` / `**Common failure modes:**` / `**Applies to this codebase:**` / `**How to make it apply:**`), not the per-concept template.
7. **Prompt engineering is NOT in this spec.** It lives in `/aipe:study-prompt-engineering` with its own persona. This spec covers everything *except* prompt engineering as a discipline — LLM foundations, context window management (operational, not prompt-craft), retrieval, agents, evals, production serving, machine learning.

## Step 6C — Create the directory structure

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
.aipe/study-ai-engineering/08-machine-learning/          (skip if no ML surface anywhere in the portfolio)
.aipe/study-ai-engineering/09-ml-system-design-templates/ (always when 08 exists)
```

(Use `mkdir -p`.) Sub-section 08 is skipped only when no project in the portfolio has any ML surface (no trained models, recommenders, or on-device inference anywhere). Sub-section 09 is always created when 08 exists.

## Step 7C — Generate `00-overview.md`

Full-portfolio AI/ML system map plus bullet legend per anchor (loopd / aipe / contrl-mo). One line per major AI or ML feature across the portfolio: what it is, what pattern it exercises, where it lives. **No prose paragraphs** beyond the opening overview sentence — the rest is the diagram and legend.

## Step 8C — Generate per-concept files in each sub-section

Walk the inventory from Step 5C (curriculum-loaded or codebase-driven). For each sub-section, generate one file per concept following `study.md`'s per-concept template. Use `study-ai-engineering.md`'s sub-section breakdown:

- **01-llm-foundations/** — what an LLM is, tokenization, sampling parameters, structured outputs, streaming, token economics, heuristic before LLM, provider abstraction, user override locks
- **02-context-and-prompts/** — context window, lost in the middle, prompt chaining
- **03-retrieval-and-rag/** — embeddings, embedding model choice, chunking strategies, vector databases, dense vs sparse, hybrid retrieval (RRF), reranking, query rewriting (HyDE), stale embeddings, incremental indexing, RAG, GraphRAG
- **04-agents-and-tool-use/** — agents vs chains, tool calling, ReAct pattern, tool routing, agent memory, error recovery
- **05-evals-and-observability/** — eval set types, eval methods, LLM-as-judge bias, LLM observability
- **06-production-serving/** — LLM caching, LLM cost optimization, prompt injection, rate limiting + backpressure, retry + circuit breaker
- **08-machine-learning/** — supervised pipeline, feature engineering, train/val/test, model selection, class imbalance, domain gap, transfer learning, confusion matrices, calibration, recommender systems, cold start, on-device inference, quantization, training run logging, drift detection, retraining pipelines

For each file, identify the anchor codebase from `study-ai-engineering.md`. If the anchor codebase implements the concept (Case A), `In this codebase` describes the implementation with real file + function + line range. If not (Case B), `In this codebase` says "Not yet implemented" with one honest sentence; Project exercises (when curriculum loaded) becomes the primary buildable target.

## Step 9C — Generate the two system-design-templates sub-sections

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

## Step 10C — Generate the cross-codebase synthesis files

**`ai-features-in-portfolio.md`** at the root — a table-style synthesis listing every AI feature across the portfolio (loopd's chains, aipe's templates, contrl-mo's AI surface if any). Columns: Feature → Project → Pattern used (linking back to the relevant concept file) → Why this pattern. Uses `###` heading + labelled bullets per feature, not pipe-tables.

**`ml-features-in-portfolio.md`** at the root — same shape for ML features (contrl-mo's classifier and recommender primarily; aipe and loopd typically don't have ML surface). Columns: Feature → Project → Model type → Inference location → Pattern used.

Skip `ml-features-in-portfolio.md` if Sub-section 08 was skipped.

## Step 11C — Generate section README indexes

Each sub-section directory gets its own `README.md` indexing the files in that sub-section and noting the reading order. Most concepts are self-contained, so reading order matters less than discoverability — make the README scannable.

Also generate `.aipe/study-ai-engineering/README.md` at the root: full guide index, reading order across sub-sections, and a pointer to the cross-codebase synthesis files.

## Step 12C — Report + stop

Print exactly:

```
✓ AI engineering guide created at .aipe/study-ai-engineering/
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
  ai-features-in-portfolio.md
  ml-features-in-portfolio.md         [omit if 08 not created]
```

Then a 3–5 sentence summary: which anchor projects exercised the most patterns, any Case B files (curriculum-driven concepts not yet implemented in any portfolio project), and which sub-section was richest given the portfolio's actual surface area.

**Stop. Wait for the user's next instruction.** They'll typically pick a concept file to drill on. Do NOT auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: refresh stale takes without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-ai-engineering/` recursively. Read every `.md` file in every sub-section, plus `00-overview.md`, `README.md`, `ai-features-in-portfolio.md`, and `ml-features-in-portfolio.md`.

## Step 6U — Diff each file against the current codebases AND the loaded templates

Three diff sources to check per file:

- **Codebase drift** — file paths that have moved, function names that have changed, line ranges that no longer match the implementation, model versions named in Tech reference that have been upgraded.
- **Template drift** — `study.md` has added new blocks (e.g., a new Move sub-section, a new Tech reference field, a new Validate level) since the file was written. Identify missing blocks.
- **Inventory drift** — curriculum concepts whose status changed (newly in-scope, newly out-of-scope), new portfolio features that warrant a new file, removed features whose file should be archived.

Output a structured change plan grouped by sub-section.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Maintain the staff-engineer voice and the three-project anchor framing. Append a changelog entry at the bottom of each updated file:

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
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
