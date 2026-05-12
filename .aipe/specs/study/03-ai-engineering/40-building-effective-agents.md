# Anthropic's "Building effective agents"

**Industry name(s):** Anthropic's agent patterns, anti-agent argument (formalised)
**Type:** Industry standard

> The 2024 Anthropic post that crystallised the practitioner consensus: most LLM tasks aren't agents. The post enumerates patterns from simple chains to multi-step agents, with explicit guidance on when each fits.

**See also:** → [39-when-not-to-agent](39-when-not-to-agent.md) · → [32-agent-loop](32-agent-loop.md)

---

## Why care

You've seen "agent" as a buzzword and wondered which framework or pattern actually delivers. Anthropic's post settled the argument — most production work fits in a few simple shapes, and the agent shape is the rarest of them.

The pattern is *catalog of LLM design patterns with guidance*. Same shape as Design Patterns (GoF) for OOP — name the shape, name the cost.

---

## How it works

The post enumerates patterns from cheapest to most elaborate.

### Patterns

- **Routing.** One LLM picks which downstream prompt to run.
- **Prompt chaining.** Sequential LLM calls; output of one is input of next.
- **Parallelisation.** Run N prompts in parallel; aggregate.
- **Orchestrator-workers.** One agent plans; workers execute.
- **Evaluator-optimiser.** One generates; another critiques.
- **Agents (full).** Decide / act / observe loop with tools.

### Guidance

Use the simplest pattern that works. Most production tasks need only the first 2–3 patterns. Full agents are for genuinely exploratory work.

### For aipe

aipe is prompt chaining (Step 1 → Step 2 → ... → Step N within a wrapper). `/aipe:study` adds parallelisation across files. `/aipe:implement` (Phase 4A) is the first full agent.

Curriculum's B4.8: "Read & annotate Anthropic's 'Building effective agents' — map each pattern to your build."

---

## Patterns by shape — diagram

```
Simpler ─────────────────────────────▶ More elaborate

  routing       chaining       parallel       orchestrator    agents
  ───────       ────────       ────────       ─────────       ──────
  LLM picks     A → B → C      A | B | C      planner +       full loop
  next prompt                  (parallel)     workers          with tools

  aipe shape    aipe wrappers   /aipe:study   (none)          /aipe:implement
                                across files                    (Phase 4A)
```

---

## In this codebase

**aipe's wrappers are chaining + parallelisation.** Phase 4A introduces full agent.

---

## Elaborate

### Where this pattern comes from

Anthropic engineering post (early 2024). Authored by practitioners who'd built production LLM systems and wanted to share the consensus.

### The deeper principle

Catalog the shapes; pick by task fit.

### Where this breaks down

When the task spans patterns — e.g., chain that occasionally needs reactive lookup. Hybrid shapes work but require thought.

### What to explore next

- The Anthropic post itself
- B4.8 mapping exercise

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Follow the catalog       │ Improvise patterns          │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Onboarding       │ "It's pattern X"         │ Each system is bespoke      │
│ Debug            │ "Pattern X fails when…"  │ No shared vocabulary        │
│ Maintenance      │ Pattern boundaries clear │ Pattern boundaries fuzzy    │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe follows the catalog implicitly (B4.8 makes it explicit). The cost is mostly absorbed.

### Sub-block 2 — what the alternative would have cost

Improvised patterns make every wrapper a fresh problem.

### Sub-block 3 — the breakpoint

Not applicable — catalog has been useful in every implementation phase.

---

## Tech reference (industry pairing)

### Pattern catalogs

- **Codebase uses:** Anthropic's catalog (implicitly).
- **Leading today:** "Building effective agents" — `adoption-leading`, 2026.

---

## Project exercises

### [B4.8] Annotate Anthropic's post; map patterns to your build

- **Exercise ID:** `[B4.8]`
- **What to build:** Walk Anthropic's post; for each pattern, name where it appears in aipe (or doesn't). Output: a section in `template-style-guide.md` mapping patterns to wrappers.
- **Why it earns its place:** makes the implicit catalog explicit; teaches by labelling.
- **Files to touch:** `aipe/template-style-guide.md` (Phase 1 B1.7 artifact).
- **Done when:** every named pattern in the post is mapped or marked "not used."
- **Estimated effort:** `1–4hr`.

---

## Summary

Anthropic's post catalogs LLM design patterns from cheapest (routing) to most elaborate (full agents). aipe uses chaining + parallelisation; Phase 4A introduces full agent. The constraint: pick the simplest pattern that fits. The cost: discipline to not reach for elaborate shapes.

- Six patterns from routing to full agent.
- aipe uses chaining + parallelisation today.
- B4.8 maps explicitly.

---

## Interview defense

### Likely questions

**Q [mid]:** Name three patterns from Anthropic's post.

**A:** Routing (LLM picks next prompt), chaining (A → B → C), parallelisation (N prompts in parallel; aggregate).

**Q [senior]:** What's the post's main argument?

**A:** Use the simplest pattern that works. Most production tasks need chaining or parallelisation; full agents are rare.

**Q [arch]:** What pattern fits `/aipe:study`?

**A:** Prompt chaining within each file's generation; parallelisation across files (each file is independent).

### The question candidates always dodge

**Q:** Why is Anthropic's post the canonical reference?

**A:** It came from practitioners with actual production systems and named patterns the field had been improvising for a year. The labels stuck.

### One-line anchors

- Catalog: routing / chaining / parallel / orchestrator / evaluator / agent.
- aipe = chaining + parallelisation.
- B4.8 maps explicitly.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the six patterns from simplest to most elaborate.

### Level 2 — Explain it out loud
What pattern is `/aipe:feature`? Under 60 seconds.

### Level 3 — Apply it to a new scenario

A `/aipe:multi-feature add A, add B, add C` runs three specs in parallel. Which pattern?

### Level 4 — Defend the decision you'd change

"Would you adopt the orchestrator-workers pattern for `/aipe:study`?"

### Quick check — code reference test
Without opening files:
- Six patterns from cheapest to elaborate? → routing, chaining, parallel, orchestrator, evaluator, agent
- aipe pattern? → chaining + parallelisation
- Build item for the mapping? → B4.8
