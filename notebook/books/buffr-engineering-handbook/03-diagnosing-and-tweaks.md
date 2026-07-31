[← Contents](README.md)

# 03 · Diagnosing & tweaks

When an answer feels off, work through the decision tree first, land on a cause, then apply the matching tweak. Change **one** thing, rebuild, run the eval.

---

## Contents

- [The decision tree](#the-decision-tree)
- [Tweak A — Retrieval misses](#tweak-a--retrieval-misses)
- [Tweak B — Wrong tool fires first](#tweak-b--wrong-tool-fires-first)
- [Tweak C — Too slow / too many tool calls](#tweak-c--too-slow--too-many-tool-calls)
- [Tweak D — Knowledge base is stale](#tweak-d--knowledge-base-is-stale)

---

## The decision tree

### Step 1 — Was the answer about something in your notes?

- **Yes, but it got it wrong** → retrieval miss → [Tweak A](#tweak-a--retrieval-misses).
- **No, and it shouldn't need your notes** → probably fine, it used web search.

### Step 2 — Watch the spinner text while it thinks

The spinner shows which tools fired:

```text
"searching knowledge base"     → looked in your notes
"searching the web (Brave)"    → used live web
"fetching RSS feed"            → grabbed articles
```

- Said "searching knowledge base" but answered wrong → the relevant note wasn't found → [Tweak A](#tweak-a--retrieval-misses).
- Never searched your notes for a personal question → routing is off → [Tweak B](#tweak-b--wrong-tool-fires-first).
- **No tools fired at all** → the model answered from its own memory. This is the hallucination risk. → [Tweak B](#tweak-b--wrong-tool-fires-first).

### Step 3 — Run the eval

```bash
npm run eval
```

You'll see output like:

```text
query: "what did I write about coffee"
  P@1: 1.00   ← the top result was the right doc  ✓
  R@3: 1.00   ← the right doc appeared in top 3   ✓

query: "my workout routine"
  P@1: 0.00   ← top result was wrong doc          ✗
  R@3: 0.33   ← right doc appeared once in top 3
```

**Reading P@1 and R@3:**

- `P@1` (Precision at 1) — was the very first result the right document? `1.0 = yes, 0.0 = no`
- `R@3` (Recall at 3) — did the right document appear anywhere in the top 3? `1.0 = yes, 0.0 = missed entirely`
- **Target:** P@1 ≥ 0.7, R@3 ≥ 0.8 across all your queries.

Interpretation:

- P@1 low → retrieval is missing → [Tweak A](#tweak-a--retrieval-misses).
- R@3 high but P@1 low → right content exists but isn't ranked first → [Tweak A](#tweak-a--retrieval-misses), lower the threshold slightly.

---

## Tweak A — Retrieval misses

*Answer should be in your notes but isn't.*

**File:** `src/session.ts` — find this line:

```typescript
createSearchKnowledgeBaseTool(pipeline, { minTopK: 4, minScore: 0.65 })
```

`minScore: 0.65` is the similarity cutoff. If results that should match are being filtered out:

- Lower to `0.60` → retrieves more, may include some noise.
- Raise to `0.70` → stricter, fewer but more relevant results.

Change it, rebuild, run eval, check if scores improve:

```bash
npm run build && npm run eval
```

> A single global threshold behaves inconsistently across journal entries, short task records, long documents, and exact project names. If tuning one number keeps trading one query for another, that's the signal to move toward per-source thresholds or reranking — see [Roadmap · retrieval quality](05-improvement-roadmap.md#phase-2--retrieval-quality).

---

## Tweak B — Wrong tool fires first

*Model answers from memory instead of searching.*

**File:** `src/session.ts` — find the long string that starts with something like `"You are a personal assistant..."`. This is the routing prompt. It contains rules like:

> "Always call search_knowledge_base first for personal questions"

If the model is skipping KB search, add a more explicit rule:

```text
- For ANY question about my habits, journal, health, work, or routines:
  call search_knowledge_base FIRST before doing anything else.
```

> This is the patch. The durable fix is intent-based routing — deciding *what kind of evidence a question needs* instead of forcing a search every time. See [Roadmap · improvement 1](05-improvement-roadmap.md#1-replace-always-search-everything-with-intent-based-routing).

---

## Tweak C — Too slow / too many tool calls

**File:** `src/session.ts` — find:

```typescript
maxToolCalls: 4,
maxTurns: 6,
```

- Slow and you're okay with shallower synthesis → lower `maxToolCalls` to 3.
- Answers feel incomplete and you want more searching → raise to 5 or 6.

> Watch this against the routing prompt: a four-call budget plus a prompt that demands personal search *and* web search *and* product retrieval *and* synthesis leaves no room for a second retrieval pass. See [Roadmap · tool-call limits](05-improvement-roadmap.md#tool-call-limits-can-conflict-with-routing-requirements).

---

## Tweak D — Knowledge base is stale

After adding or editing any notes:

```bash
npm run index -- path/to/updated-note.md
npm run eval
```

After any DB data changes (journal, workouts, etc.):

```bash
npm run index:db
npm run eval
```

---

← Prev: [02 · Daily routine](02-daily-routine.md) · [Contents](README.md) · Next: [04 · Weekly cadence](04-weekly-cadence.md) →
