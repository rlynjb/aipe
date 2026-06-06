# generate-learning-path

A portable generator spec. Given some material to learn — a Book (a folder of markdown notes), a subject, or a rough plan — produce a **learning path** that is simultaneously a readable plan and a structure dryrun can parse. One file, two readers: a human reads the prose; dryrun reads the phase and step markers and skips everything else.

Runs identically in Claude Code, Claude chat, or ChatGPT. The *method* (how the path is sequenced and explained) is yours to do well; the *output structure* is fixed so dryrun reads the same shape every time, whatever tool produced it.

---

## Intent

You are sequencing material into a deliberate study path with a readable plan wrapped around it: foundations first, dependencies respected, grouped into a small number of phases with a clear arc, each step tagged with how to engage it and why it's there. The document reads top-to-bottom as a plan a person would follow; embedded in it is a structure a parser can lift out. You are honest to the source — you never invent material that isn't there.

## Input

The material to sequence is provided as one of:
- a **Book** — a folder of markdown notes (Claude Code: read the files at the given path);
- a **subject or goal** — sequence it from your own knowledge;
- a **rough plan** — restructure it into this format.

In Claude chat / ChatGPT the user pastes the material, topic list, or plan. Work only from what's provided.

Steps are **self-contained** — a step is a titled unit with an activity and a rationale. It does not link to a file. The step title carries the topic. (If a future version needs steps to link to concept files in a dryrun book, add a `- **concept:**` bullet holding the file path as a join key — not part of this version.)

## Method (sequence and explain it well)

1. Survey the material. Build the dependency order in your head: what must be understood before what.
2. Group into **2–5 phases** with a legible arc (e.g. fundamentals → core → integration → advanced). Each phase gets a one-line goal stated as a capability ("after this you can…").
3. For each step, choose an `activity`:
   - `READ` — conceptual material absorbed by reading.
   - `EXERCISE` — something practiced or built.
   - `TODO` — a setup or action item (install, gather, configure).
4. Write a one-line `rationale` per step: why this, why here, what it builds on.
5. Wrap the structure in a real plan. Use prose freely **outside** the parsed markers: a framing intro under the metadata, optional narrative under each phase, an `Exit —` line per phase, and closing prose sections (constraints, sequencing rules, what this closes). This prose is what makes it read as a plan; the parser skips all of it.
6. Scale to the material. Don't pad; don't drop what matters. Be honest to the source.

## Output structure (FIXED — do not deviate)

```
# <path title>

- **book:** <slug or name of the book/subject this path is for>
- **summary:** <1–3 sentences describing the path's arc>

<optional framing prose — human-only>

## <any prose section title, e.g. "Don't change these">
<prose — any "## " heading that is NOT "Phase <N> — …" is skipped by the parser>

## Phase <N> — <phase title>

- **goal:** <capability gained, "after this you can…">

<optional per-phase narrative prose — human-only>

### Step <N> — <step title>
- **activity:** READ | EXERCISE | TODO
- **rationale:** <why this step, why here, what it builds on>

### Step <N+1> — <step title>
- **activity:** ...
- **rationale:** ...

Exit — <optional prose line stating the phase's done-criteria; human-only>

## Phase <N+1> — <phase title>
...

## <closing prose sections — Sequencing rules, What this closes, etc. — human-only>
```

### What the parser reads
- **metadata** — the `- **book:**` and `- **summary:**` bullets directly under the H1.
- **phase** — a heading matching exactly `## Phase <N> — <title>`; its `- **goal:**` bullet.
- **step** — a heading matching exactly `### Step <N> — <title>`; its `- **activity:**` and `- **rationale:**` bullets.

Everything else — the H1's other text, framing paragraphs, non-Phase `##` sections, per-phase narrative, `Exit —` lines — is human-only and skipped.

## Hard rules (these protect the contract)

1. **Phases** use exactly `## Phase <N> — <title>` — integer `N`, an em dash `—`. Any other `## ` heading is prose and is skipped; use those freely for plan sections.
2. **Steps** use exactly `### Step <N> — <title>`, under a phase. **The heading pattern is the discriminator** — never use `### Step <N> —` for anything that isn't a real step, and never give a real step a different heading shape.
3. Each step has exactly two bullets, in order: `- **activity:**` then `- **rationale:**`. Nothing between the step heading and these bullets.
4. `activity` is one of `READ`, `EXERCISE`, `TODO` — uppercase, exactly.
5. `- **book:**` and `- **summary:**` sit directly under the H1, before the first `## `.
6. **No HTML comments anywhere.** They don't render invisibly across Markwon / GitHub / viewers — they leak as visible text. The structure is self-evident; never document the parse contract inside the file.
7. **Plain section names — no insider jargon.** Write "Don't change these," not "the moat." A reader shouldn't need a metaphor decoded.
8. **Prose only outside the parsed markers.** Never put prose between a phase heading and its `goal` bullet, or between a step heading and its bullets. Narrative lives in its own paragraphs or non-Phase `##` sections.
9. Same input in → same structure out. Be deterministic.

## Worked example

```
# Postgres performance — learning path

- **book:** postgres-performance
- **summary:** Build a mental model of how queries execute, then learn to read and fix slow ones, before touching configuration.

Aimed at a developer comfortable writing SQL who has never tuned a query. Each phase ends when you can do something you couldn't before.

## Don't change these

Not a phase — skipped by the parser. Work through phases in order; don't jump to configuration before you can read a query plan.

## Phase 1 — Foundations

- **goal:** After this you can explain how Postgres turns a query into an execution plan.

Front-load the model so the later fixes have something to attach to.

### Step 1 — How a query executes
- **activity:** READ
- **rationale:** Parse → plan → execute; the vocabulary every later step assumes.

### Step 2 — Reading EXPLAIN output
- **activity:** EXERCISE
- **rationale:** Practice reading a plan now; you'll do it constantly in Phase 2.

Exit — you can read an EXPLAIN plan and name each node.

## Phase 2 — Diagnosing slow queries

- **goal:** After this you can find and fix the common causes of a slow query.

### Step 1 — Indexes and when they're used
- **activity:** EXERCISE
- **rationale:** The first thing to check; depends on reading plans from Phase 1.

## Sequencing rules

Parser skips this. Don't start Phase 2 until you can read a plan unaided.
```
