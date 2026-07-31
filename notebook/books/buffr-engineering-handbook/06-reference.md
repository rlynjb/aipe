[← Contents](README.md)

# 06 · Reference

Everything you reach for mid-flow, in one place.

---

## Contents

- [Cheat sheet](#cheat-sheet)
- [Command index](#command-index)
- [Footer numbers](#footer-numbers)
- [Metrics glossary](#metrics-glossary)
- [Source authority tiers](#source-authority-tiers)
- [Where the knobs live](#where-the-knobs-live)

---

## Cheat sheet

| Feeling | First thing to check | Likely fix |
|---------|---------------------|------------|
| Answer is wrong / made up | Did spinner show "searching KB"? | Run eval → [Tweak A](03-diagnosing-and-tweaks.md#tweak-a--retrieval-misses) |
| Good answer but slow | Token count unusually high | Lower `maxToolCalls` → [Tweak C](03-diagnosing-and-tweaks.md#tweak-c--too-slow--too-many-tool-calls) |
| Doesn't know my notes | Spinner never said "searching KB" | Routing → [Tweak B](03-diagnosing-and-tweaks.md#tweak-b--wrong-tool-fires-first) |
| Knows old info, not new | You edited a note recently | Re-index → [Tweak D](03-diagnosing-and-tweaks.md#tweak-d--knowledge-base-is-stale) |
| /investing score seems off | Run /eval in chat | Check fixtures or prompts |
| Eval P@1 dropped | Recent re-index or threshold change | [Tweak A](03-diagnosing-and-tweaks.md#tweak-a--retrieval-misses), compare before/after |

---

## Command index

```bash
npm run chat                        # open the assistant
npm run index -- path/to/note.md    # (re)index a notes file into the KB
npm run index:db                    # re-index after DB data changes (journal, workouts…)
npm run eval                        # run the retrieval eval (P@1, R@3)
npm run build && npm run eval       # rebuild after a code tweak, then re-eval
```

In-chat:

```text
/eval        # run the in-chat scorecard (e.g. /investing)
```

---

## Footer numbers

```text
2.1s · 1,842 in · 312 out
 │        │         └── output tokens (the answer the model wrote)
 │        └──────────── input tokens (question + tools + KB results)
 └───────────────────── latency
```

Baseline for you: ~1–2s, ~2,000 input tokens. Watch deviations, not absolutes.

---

## Metrics glossary

| Metric | Reads as | Meaning |
|--------|----------|---------|
| **P@1** (Precision at 1) | 1.0 = yes, 0.0 = no | Was the very first result the right document? |
| **R@3** (Recall at 3) | 1.0 = yes, 0.0 = missed | Did the right document appear anywhere in the top 3? |
| **Recall@5** | higher = better | Right document in the top 5 — a looser retrieval check |
| **MRR** (Mean Reciprocal Rank) | higher = better | Rewards ranking the right doc *higher*, not just present |
| **nDCG** | higher = better | Ranking quality weighted by position and relevance grade |
| **supported-claim %** | grounding | Share of factual claims backed by a real source |
| **required-fact coverage** | completeness | Did the answer include the facts it needed to? |
| **irrelevant-context rate** | relevance | How much retrieved junk leaked into context |

**Targets for the retrieval eval:** P@1 ≥ 0.7, R@3 ≥ 0.8 across your queries.

---

## Source authority tiers

Higher tier = more trustworthy for *personal* facts. Prior assistant answers should never outrank original user material.

```text
Tier 1: direct user-authored records      (user-authored)
Tier 2: structured application data        (structured-record)
Tier 3: retrieved prior user messages      (user-message)
Tier 4: previous assistant answers         (assistant-memory)
Tier 5: live external sources              (external)
```

---

## Where the knobs live

All in `src/session.ts`:

| Knob | Line looks like | Controls | Tweak |
|------|-----------------|----------|-------|
| Similarity cutoff | `createSearchKnowledgeBaseTool(pipeline, { minTopK: 4, minScore: 0.65 })` | how strict retrieval is | [A](03-diagnosing-and-tweaks.md#tweak-a--retrieval-misses) |
| Routing prompt | the long `"You are a personal assistant..."` string | which tool fires first | [B](03-diagnosing-and-tweaks.md#tweak-b--wrong-tool-fires-first) |
| Call budget | `maxToolCalls: 4, maxTurns: 6` | depth vs. speed | [C](03-diagnosing-and-tweaks.md#tweak-c--too-slow--too-many-tool-calls) |

Eval queries live in `eval/queries.json`:

```json
{ "query": "your real question", "relevant": ["doc-id-that-should-answer-it"] }
```

---

← Prev: [05 · Improvement roadmap](05-improvement-roadmap.md) · [Contents](README.md) · Next: — →
