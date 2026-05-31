---
description: Agent architecture study guide for this codebase — reasoning patterns, agentic retrieval, multi-agent orchestration
---

The user invoked `/aipe:study-agent-architecture`.

This command takes **no arguments**. There is one agent architecture guide per repo, saved at the fixed path `.aipe/study-agent-architecture/`. `.aipe/` is per-repo (lives at the root of whichever repo the command is run in); the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused companion to `/aipe:study` covering everything *above one agent*: reasoning patterns beyond ReAct, retrieval as a control loop, and multi-agent orchestration topologies. It is the sibling of `/aipe:study-ai-engineering` — that spec owns what ONE model/agent does (LLM foundations, retrieval mechanics, single agent + tools); this spec owns what happens ABOVE one agent. Where a concept is already covered there, this spec **cross-references rather than duplicates**.

**Per-repo scope.** This spec runs against one codebase at a time — the repo where the command was invoked. The spec body is codebase-agnostic (every example is a generic shape label: workflow / single-agent / multi-agent), and the only project that appears in generated output is the studied repo.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-agent-architecture.`
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

Per-repo scope: do NOT load context files from other repos. The codebase being studied is the one this command was invoked in.

## Step 3 — Load the template chain

Agent architecture reads four files in order — structure, writer persona, reader calibration, then the spec itself. It also reads any existing `study-ai-engineering` guide to cross-reference instead of duplicate:

```
${CODEX_PLUGIN_ROOT}/specs/study-system-design-dsa.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-agent-architecture.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`study-system-design-dsa.md`** — structure: per-concept template, formatting rules, diagram requirements, hard rules, Validate block, constraint summary.
- **`teacher.md`** — the writer persona, used in **teacher posture** (the default — no shift). Agent orchestration is systems-shaped work (control loops, message passing, shared state, coordination failure modes), so the staff-engineer-explains-distributed-systems voice fits. Production scar tissue ("don't reach for multi-agent before single-agent hits its quality ceiling") is carried as architectural opinion with a breakpoint, the way study-system-design-dsa.md's Tradeoffs block names a decision — not as a separate persona.
- **`me.md`** — reader-side calibration: voice register, example anchoring (agent topologies map onto frontend primitives — supervisor-worker is a manager component delegating to children; pipeline is a `.then()` chain; fan-out/fan-in is `Promise.all()` then a merge), and the reader's gaps (single-agent concepts move faster; multi-agent orchestration is the load-bearing new ground). `me.md` does NOT override structural or voice rules — it calibrates examples and depth.
- **`study-agent-architecture.md`** — the concept list, three-shapes framing, agent-architecture-specific constraints.

Also check for an existing `.aipe/study-ai-engineering/` guide in this repo. When present, cross-reference its concept files (ReAct mechanics, tool-calling, RAG/GraphRAG, agent memory, LLM-as-judge, single-call caching/cost/rate-limit/retry) in `See also` blocks rather than re-teaching them.

Precedence when the files overlap: this spec wins on **structure**; `teacher.md` wins on **voice register**; `me.md` wins on **calibration**.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-agent-architecture/` already contains the guide. The signal is the presence of `00-overview.md` at the root OR any file inside `01-reasoning-patterns/`, `02-agentic-retrieval/`, `03-multi-agent-orchestration/`, `04-agent-infrastructure/`, `05-production-serving/`, or `06-orchestration-system-design-templates/`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

(The directory may exist as an empty placeholder; that's not the same as having a guide already.)

---

# CREATE MODE

Runs only when no existing guide is found.

## Step 5C — Identify the codebase's agent shape

Before planning the inventory, identify which of the three agent shapes this codebase most resembles. This determines which sub-sections are richest and which patterns get full files vs "Not yet implemented" treatment:

- **Workflow / chain** — fixed, known steps; no autonomous loop. A `.then()` chain of single-purpose calls. Skips most of SECTION C's topology files but ALWAYS gets the boundary files (`01-chains-vs-agents.md`, `01-when-not-to-go-multi-agent.md`) and the SECTION F templates (which name the refactor toward an agent loop).
- **Single-agent** — one autonomous loop (ReAct or similar) that decides its own path, calls tools, observes, iterates. Single-agent mechanics are cross-referenced to `study-ai-engineering`; this spec places them in the reasoning-pattern family.
- **Multi-agent** — many agents coordinating via a topology (supervisor-worker, pipeline, parallel fan-out, debate, swarm, graph). SECTION C carries the weight — this is the load-bearing new material.

Most codebases lean toward one shape. Record the dominant shape; it drives inventory in Step 6C.

## Step 6C — Plan the guide (shape-driven AND codebase-driven inventory)

A concept file is generated when EITHER (a) the codebase exercises the pattern, OR (b) the pattern belongs to the shape the codebase matches and is in-scope for that shape. Patterns from a shape the codebase does not match at all are skipped — no file generated.

For not-yet-implemented patterns that are in-scope for the codebase's shape: `In this codebase` says "Not yet implemented" with one honest sentence (why — no autonomous loop yet, single-agent hasn't hit its ceiling, etc.), and the SECTION F system design template carries the concrete "how to make it apply" refactor. **No Project exercises block** — this spec has no curriculum dependency (unlike `study-ai-engineering`); the SECTION F templates are the buildable targets.

The non-negotiables — inherited from all four files:

1. **All structural rules from `study-system-design-dsa.md` apply unchanged** — the per-concept template (Subtitle, Why care's 5 moves, How it works's 3 moves with diagrams at every move and sub-section, primary diagram, In this codebase, Elaborate, Tradeoffs, Tech reference with `###`+labelled-bullets not pipe-tables, Summary, Interview defense, Validate), formatting rules, box-drawing diagram chars.
2. **Cross-reference, do not duplicate.** Where a concept is already covered in `study-ai-engineering.md` (ReAct mechanics, tool-calling mechanics, RAG/GraphRAG mechanics, agent-memory two-layer split, LLM-as-judge bias, prompt-injection per-call defense, single-call caching/cost/rate-limit/retry-and-circuit-breaker mechanics), the file here cites that file in its `See also` block and covers only the agent-architecture angle (placement in the pattern family, the control loop, the topology, the trajectory). **A file that re-teaches mechanics already in `study-ai-engineering.md` is a generation failure.**
3. **Lead with the shape.** Every SECTION C topology file opens with its topology diagram as the Move 1 mental-model visual — the topology IS the mental model. A topology file whose Move 1 is prose instead of a shape diagram is incomplete.
4. **Each `═════` sub-section divider carries an `Anchor:` line naming the shape category** (workflow / single-agent / multi-agent) the sub-section belongs to — a CATEGORY, never a project. Weight coverage toward the sub-section matching the studied codebase's shape.
5. **No project names in generated output except the studied repo.** Shape labels (workflow, single-agent, multi-agent) and generic worked examples (research assistant, support system, coding agent) are instructional templates only. The only project in any "In this codebase," file path, or "Applies to this codebase" bullet is the repo where the command was run.
6. **Teacher posture, production scar tissue as breakpoints.** Architectural opinions ("here is when this topology earns its overhead, and here is when it doesn't") are named as decisions with breakpoints, the way study-system-design-dsa.md's Tradeoffs block works.

## Step 7C — Create the directory structure

Create the root and the sub-section directories that the shape + codebase warrant:

```
.aipe/study-agent-architecture/
.aipe/study-agent-architecture/01-reasoning-patterns/
.aipe/study-agent-architecture/02-agentic-retrieval/
.aipe/study-agent-architecture/03-multi-agent-orchestration/
.aipe/study-agent-architecture/04-agent-infrastructure/
.aipe/study-agent-architecture/05-production-serving/
.aipe/study-agent-architecture/06-orchestration-system-design-templates/
```

(Use `mkdir -p`.) SECTION F (`06-orchestration-system-design-templates/`) is ALWAYS created regardless of shape — its templates name the refactor toward agent loops even for workflow/chain codebases.

## Step 8C — Generate per-concept files in each sub-section

Following `study-agent-architecture.md`'s sub-section breakdown (generate the in-scope files per Step 6C):

- **01-reasoning-patterns/** — chains-vs-agents (boundary, always), react (placement in family; cross-ref study-ai-engineering for mechanics), plan-and-execute, reflexion-self-critique, tree-of-thoughts, routing (the bridge to SECTION C)
- **02-agentic-retrieval/** — agentic-rag, self-corrective-rag, retrieval-routing (retrieval as a control loop; cross-ref study-ai-engineering for RAG/embedding mechanics)
- **03-multi-agent-orchestration/** — when-not-to-go-multi-agent (boundary, always), supervisor-worker, sequential-pipeline, parallel-fan-out, debate-verifier-critic, swarm-handoff, graph-orchestration, shared-state-and-message-passing, coordination-failure-modes
- **04-agent-infrastructure/** — context-engineering, agent-memory-tiers, tool-calling-and-mcp, agent-evaluation (trajectory / tool-call accuracy / topology), guardrails-and-control
- **05-production-serving/** — cross-turn-caching, fan-out-backpressure, per-tool-circuit-breaking

Each file uses `study-system-design-dsa.md`'s per-concept template. SECTION C topology files lead with the topology diagram.

## Step 9C — Generate SECTION F templates

`06-orchestration-system-design-templates/`: `01-multi-agent-research-assistant.md`, `02-agentic-support-system.md`, `03-agentic-coding-system.md`. Generated for EVERY guide regardless of shape. Use the **9-labelled-bullet shape from `study-ai-engineering.md`** (`**The prompt:**` / `**Standard architecture:**` / `**Data model:**` / `**Key components:**` / `**Scale concerns:**` / `**Eval framing:**` / `**Common failure modes:**` / `**Applies to this codebase:**` / `**How to make it apply:**`), NOT the per-concept template. The architecture/data-model/scale/eval/failure bullets are generic; `**Applies to this codebase:**` and `**How to make it apply:**` are answered about the studied repo only.

## Step 10C — Generate `agent-patterns-in-this-codebase.md`

At the root. Describes how *this codebase* uses agent patterns: an agent-patterns table (Feature → Pattern/shape → Why this pattern), and for each, the shape (workflow / single-agent / multi-agent), the loop or topology as a small diagram, the control envelope (caps, budgets, guardrails), and the eval (if any) — the structure, not the full implementation. If the codebase is a workflow/chain shape with no autonomous loop, say so plainly and point to the SECTION F templates for what adopting an agent loop would require.

## Step 11C — Generate `00-overview.md` and READMEs

`00-overview.md`: full-repo agent-surface system map + the codebase's dominant shape. Each sub-section directory gets its own `README.md` (index + reading order; within a sub-section most files are self-contained). Root `README.md`: full guide index, the recommended cross-sub-section order (A → B → C → D → E → F), and a pointer to `agent-patterns-in-this-codebase.md`.

## Step 12C — Report + stop

Print exactly:

```
✓ Agent architecture guide created at .aipe/study-agent-architecture/
  Codebase shape:   <workflow/chain | single-agent | multi-agent>
  00-overview.md
  README.md
  01-reasoning-patterns/                    (<N> files + README.md)
  02-agentic-retrieval/                     (<N> files + README.md)
  03-multi-agent-orchestration/             (<N> files + README.md)
  04-agent-infrastructure/                  (<N> files + README.md)
  05-production-serving/                    (<N> files + README.md)
  06-orchestration-system-design-templates/ (<N> files + README.md)
  agent-patterns-in-this-codebase.md
```

Then a 3–5 sentence summary: the codebase's dominant agent shape, which sub-section was richest, any "Not yet implemented" patterns whose SECTION F template names the refactor, and whether the codebase has hit the ceiling where a more complex topology would earn its overhead.

**Stop. Wait for the user's next instruction.** Do NOT auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: refresh stale content without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-agent-architecture/` recursively. Read every `.md` file in every sub-section, plus `00-overview.md`, `README.md`, and `agent-patterns-in-this-codebase.md`.

## Step 6U — Diff each file against the current codebase AND the loaded templates

Three diff sources to check per file:

- **Codebase drift** — file paths that have moved, function names that changed, topologies that have evolved, a shape transition (the codebase grew from single-agent into multi-agent).
- **Template drift** — `study-system-design-dsa.md` has added new blocks since the file was written. Identify missing blocks. Check that cross-references to `study-ai-engineering` files are still valid paths and that no file has started re-teaching mechanics it should cross-reference.
- **Inventory drift** — new patterns the codebase now exercises that warrant a new file, patterns no longer used.

Output a structured change plan grouped by sub-section.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Maintain the teacher voice and the cross-reference discipline (never duplicate `study-ai-engineering` mechanics). Append a changelog entry at the bottom of each updated file:

```
---
Updated: <today's ISO date> — <one-line summary of what changed and why>
```

Do NOT rewrite accurate sections.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-agent-architecture/
─────────────────────────────────────────────────
Files updated:        <list>
Files added:          <list>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
