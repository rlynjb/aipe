[← Contents](README.md)

# 04 · Weekly cadence

The daily loop catches individual bad answers. The weekly loop catches *drift* — and slowly builds an eval set that reflects how you actually use buffr.

Budget ~15 minutes, Monday morning.

---

## Monday morning

```bash
npm run chat
```

Ask 3 questions that represent your week — one **personal/habits**, one **work/project**, one **current events**.

Score each answer mentally:

- Did it use my notes? (check the spinner)
- Was the answer accurate?
- Did it feel useful?

Then run the eval and compare to last week:

```bash
npm run eval
```

If a score dropped, something changed — either your notes changed, or a threshold needs adjusting. That's a [Tweak A](03-diagnosing-and-tweaks.md#tweak-a--retrieval-misses) investigation: compare before/after.

---

## Add one new eval query every week

Take one real question you asked that week and add it to `eval/queries.json`:

```json
{ "query": "your real question", "relevant": ["doc-id-that-should-answer-it"] }
```

Over a month you'll have a ~20-query eval set that actually reflects how you use the app. **That's when the numbers become meaningful** — a P@1 average over queries you invented in the abstract tells you far less than one built from your own weeks.

---

## Why this compounds

Each week you're doing two things at once:

1. **Detecting regressions** early, while you still remember what changed.
2. **Growing ground truth** — the eval set is the asset. Prompts, thresholds, and models come and go; a good eval set outlives all of them and is what lets you [change one thing and know if it helped](01-mental-model.md#the-optimization-loop).

When you're ready to measure more than retrieval precision, [Roadmap · improvement 10](05-improvement-roadmap.md#10-expand-evals-beyond-retrieval-precision) covers routing, grounding, and answer-usefulness evals.

---

← Prev: [03 · Diagnosing & tweaks](03-diagnosing-and-tweaks.md) · [Contents](README.md) · Next: [05 · Improvement roadmap](05-improvement-roadmap.md) →
