# Chapter 3 — Evals and Observability

**Phase 3 of the curriculum.** Across all three projects. Reading time: 20 minutes.

> If you can't measure it, you can't ship it. If you can't observe it, you can't debug it. The hardest part of senior ML/AI work isn't building — it's knowing whether what you built actually works.

## The framing

You've built systems in Phases 1, 2A, 2B, 2C. None of them are real yet. They're real the moment you can answer, with a number, "is this working?" and "is it getting better or worse?"

This chapter is the eval harness and the observability stack that makes all the previous chapters trustworthy. It's also where the curriculum's three tracks converge — LLM evals and ML evals share more than candidates realize.

```
            ┌─ LLM evals (loopd, aipe) ──────┐
            │                                │
Candidates  │  - Golden set                  │
think these │  - Adversarial set             │
are         │  - Regression set              │
different.  │  - LLM-as-judge                │
            │  - Faithfulness, precision@k   │
They're     │                                │
not.        │                                │
            └────────────────────────────────┘

            ┌─ ML evals (contrl-mo) ─────────┐
            │                                │
            │  - Held-out test set           │
            │  - Per-class precision/recall  │
            │  - Confusion matrix            │
            │  - Calibration (reliability)   │
            │  - A/B testing                 │
            │  - "No-click is not negative"  │
            │                                │
            └────────────────────────────────┘
```

The pattern: every system that makes a decision needs a labeled answer for what the right decision was, a way to score the system's decision against that, a place to record the score over time, and a deployment that's gated by score thresholds.

---

## Three kinds of eval sets — `[C3.1]`

Every system you ship needs three eval sets. They're for different jobs.

```
┌─ Golden set ──────────────────────────────────┐
│  Hand-curated, "this is the right answer".    │
│  Used to measure baseline quality.            │
│  Small (10–100 items), high signal.           │
└───────────────────────────────────────────────┘

┌─ Adversarial set ─────────────────────────────┐
│  Inputs designed to break the system —        │
│  edge cases, ambiguous queries, prompt        │
│  injection attempts, malformed inputs.        │
│  Used to measure robustness.                  │
└───────────────────────────────────────────────┘

┌─ Regression set ──────────────────────────────┐
│  Failures you caught in production, frozen    │
│  as test cases. Grows over time.              │
│  Used to prevent re-introducing fixed bugs.   │
└───────────────────────────────────────────────┘
```

The **golden set** is the first thing you build. For loopd, it's 30 NL queries with manually labeled correct entries (the 30 you wrote in Phase 2A). For aipe, it's 10 slash-command intents with manually labeled correct retrieved chunks. For contrl-mo, it's the held-out session-level test set you reserved before training.

The **adversarial set** is the second thing. It's harder to build because you have to think like an attacker. For loopd: questions about future events, questions in mixed languages, questions with typos, prompt-injection attempts in the journal text. For aipe: ambiguous intents like `/aipe:feature thing`, intents that should fail. For contrl-mo: reps captured from weird angles, with occlusion, with the user wearing baggy clothing.

The **regression set** grows. Every time a user reports a bug — "this caption is repetitive" or "this rep was clearly bad form and the model said good" — add the failing case to the regression set. Frozen. Every future deploy runs against it. **You never regress a fixed bug.**

The discipline is brutally underrated. The standard FAANG model is that the regression set becomes the largest of the three within a year, and it's what catches 80% of would-be regressions before they ship.

---

## Eval methods, cheap to expensive — `[C3.2]`, `[C3.3]`, `[B3.1]`–`[B3.4]`

You have a ladder of options. Pick the cheapest one that gives a signal you can act on.

```
┌──────────────────────┬──────────────────────────┐
│ Method               │ When to use              │
├──────────────────────┼──────────────────────────┤
│ Exact match          │ Classifiers, structured  │
│                      │ outputs, IDs             │
├──────────────────────┼──────────────────────────┤
│ Fuzzy match          │ Generated text where     │
│                      │ wording varies but       │
│                      │ semantics shouldn't      │
├──────────────────────┼──────────────────────────┤
│ Rubric eval          │ Quality of generated     │
│ (criteria, human)    │ text on dimensions —     │
│                      │ tone, accuracy, structure│
├──────────────────────┼──────────────────────────┤
│ LLM-as-judge         │ Scalable rubric eval.    │
│                      │ Cheap, but biased        │
├──────────────────────┼──────────────────────────┤
│ Pairwise             │ "Is A better than B?"    │
│                      │ for comparing variants   │
├──────────────────────┼──────────────────────────┤
│ Human eval           │ Highest signal, lowest   │
│                      │ scale                    │
└──────────────────────┴──────────────────────────┘
```

For loopd's classifier (`B1.1` shipped Zod schemas), **exact match** is the right eval. The output is one of `{todo, question, vent}`. Either it matches the label or it doesn't.

For loopd's caption chain, **rubric eval with LLM-as-judge** is the right call. Captions are generated text; you can't exact-match. You define a 5-point rubric (tone match, no repetition, no hallucination, concise, hooks the reader), have an LLM evaluator score each generated caption on each criterion, and aggregate.

For contrl-mo's form classifier, **exact match on per-class labels** with full confusion matrix is the right answer — same shape as a traditional classifier eval.

---

## LLM-as-judge bias — `[C3.3]`

LLM-as-judge is cheap and scalable. It's also biased in three known ways, and you need to design around all three.

```
┌─ Position bias ───────────────────────────────┐
│  Judge prefers whichever variant appears      │
│  first. Fix: randomize order per evaluation.  │
└───────────────────────────────────────────────┘

┌─ Verbosity bias ──────────────────────────────┐
│  Judge prefers longer responses. Fix: cap     │
│  length or include length as a rubric         │
│  dimension being scored.                      │
└───────────────────────────────────────────────┘

┌─ Self-preference ─────────────────────────────┐
│  Judge prefers outputs from the same model    │
│  family. Fix: use a different model family    │
│  as judge than the one being judged.          │
└───────────────────────────────────────────────┘
```

If you're scoring outputs from Sonnet 4 (Anthropic) with Sonnet 4 (Anthropic), you're getting a biased score. Use GPT-4o or Gemini as the judge. Or — better — have two different model families judge and look at agreement. The interview answer is "I'm aware of the three known LLM-as-judge biases and explicitly design around each."

---

## Faithfulness for RAG — `[C3.10]`

This is the LLM-eval metric that matters for retrieval-augmented systems.

**Faithfulness** measures: of the claims in the generated answer, how many are supported by the retrieved context?

```
Retrieved context (3 chunks):
  - "We use Drizzle ORM in this codebase."
  - "Drizzle was introduced in March 2026."
  - "Postgres is the backing database."

Generated answer:
  "We use Drizzle ORM, introduced in March 2026, backed
   by Postgres. Drizzle is the most popular ORM in 2026."
                                       ^^^^^^^^^^^^^^^^^^^^
                                       ← unsupported claim
                                         (hallucination!)

Faithfulness score: 3 supported claims / 4 total claims = 0.75
```

The score is computed by running each claim through an LLM verifier with the retrieved chunks: "Is this claim supported by the chunks?" Yes/no. Aggregate.

A faithfulness of 1.0 means the model only said things supported by what you gave it. A score of 0.6 means 40% of the claims were unsupported (hallucinated). Track this per chain. If faithfulness drops over a deploy, *something broke*.

For loopd's interpret chain at week/month scope, faithfulness is the most important quality metric. `[B3.3]` ships it: 30-question eval set, faithfulness score reported, drift over time tracked.

---

## ML metrics: the IK Module 1, 3 set — `[C3.4]`, `[C3.5]`

For contrl-mo's classifier (a real ML model, not an LLM call), the metrics are the classical ones:

- **Precision** — of items the model labeled X, what fraction were actually X?
- **Recall** — of items that are actually X, what fraction did the model label X?
- **F1** — harmonic mean of precision and recall.
- **Macro-F1** — average F1 across classes, equally weighted (not biased toward common classes).
- **AUC-ROC** — area under the precision-recall curve, a threshold-agnostic measure.
- **NDCG / MRR** — ranking quality for the recommender.

The exam question: which one matters when?

```
Use precision when false positives are expensive.
  "Spam filter — better to let one spam through than
   to mark a real email as spam."

Use recall when false negatives are expensive.
  "Medical screening — better to over-flag than to miss
   a real positive."

Use F1 / macro-F1 when both matter equally.
  "Form classifier — false positives waste user time
   but false negatives mean missed coaching opportunities;
   both are similar costs."

Use AUC-ROC when you care about ranking, not classification.
  "Search ranking — the rank order matters more than
   the absolute label."

Use NDCG when the rank position itself has weighted value.
  "Recommender — position 1 matters way more than
   position 10."
```

The interview move: *"For the form classifier I report macro-F1 because the classes are imbalanced and the failure modes have similar costs. Accuracy alone would be 90% because good-form is the majority; macro-F1 forces me to look at minority-class performance. For the recommender, I track NDCG@5 because the top of the list matters more than the bottom."*

---

## "No-click is not a negative label" — `[C3.7]` (IK Module 1)

This is one of the rare interview-trap concepts. Both IK and FAANG ML interviews hammer it.

The naive instinct: in a recommender, when the user doesn't click a recommendation, treat it as "the recommendation was bad." Train on `clicked=positive, not_clicked=negative`.

The correct take: **no-click is not a negative label.** A user not clicking doesn't mean the item was bad. They might have read the title and gotten their answer. They might have scrolled past too fast. They might have already known what they wanted from another tab.

```
Position 1: "Buy milk on Thursday" ← user reads it, doesn't click
                                     because they already know
Position 2: "Pizza recipe"          ← user clicks, eats pizza

A naive system trains:
  "milk" → not_clicked = bad recommendation ← wrong
  "pizza" → clicked = good recommendation   ← right
```

For loopd's RAG and for contrl-mo's recommender, this rule applies. Train on **positive labels only** (the user explicitly engaged) plus **carefully selected negatives** (random items the user didn't see — those are real negatives). Don't treat absent engagement as evidence.

---

## Positional bias — `[C3.8]` (IK Module 2)

Adjacent failure mode in ranked outputs.

In a search-ranking system, position 1 in the SERP gets ~30% of clicks regardless of relevance. Position 10 gets ~3%. If you train on click data, the model learns "position 1 → click" rather than "this doc → click." That's positional bias.

For loopd's RAG, this maps to **lost-in-the-middle** (you already saw it in Chapter 2A). The model attends to position-1 and position-5 retrieved chunks more than position-3. For contrl-mo's recommender, it maps to **recency bias** — the exercise at the top of the suggestion list gets picked more, regardless of the model's predicted probability.

Mitigations:
- **Inverse propensity scoring** — weight each click by the inverse probability of it being in the position it was. Position 1 clicks get downweighted; position 10 clicks get upweighted.
- **Randomization** — in some user sessions, randomize the ranking order. The clicks from those sessions are bias-free.

You don't have to implement IPS in Phase 3. You do have to be able to name it and explain when you'd reach for it.

---

## Observability — `[C3.11]`

The eval set tells you "is this working right now in test?" Observability tells you "is this still working in production, and where did it break?"

The three pillars:

```
┌─ Traces ──────────────────────────────────────┐
│  Per-request: input, output, latency, tokens, │
│  cost, model, prompt version.                 │
│  One row per chain call.                      │
└───────────────────────────────────────────────┘

┌─ Spans ───────────────────────────────────────┐
│  Sub-steps within a request: chain steps,     │
│  tool calls, retrieval steps. Lets you find   │
│  the slow link in a multi-stage chain.        │
└───────────────────────────────────────────────┘

┌─ Replay ──────────────────────────────────────┐
│  Re-run a saved trace with a different prompt │
│  or model. Lets you verify a fix without      │
│  shipping it.                                 │
└───────────────────────────────────────────────┘
```

The data-center analog is netflow + sFlow + structured syslog. You don't run a rack without visibility into every link and every hop. You don't run AI in production without traces, spans, and replay.

**Tools.** Production teams use Langfuse, LangSmith, Phoenix/Arize, Helicone. For your scale, the right starting point is a local `ai_trace` table — just SQLite — that holds per-call data. Upgrade to a hosted tool when the volume justifies. `[B3.11]` ships exactly this for loopd.

---

## A/B testing — `[C3.6]` (IK Module 1)

You shipped a new model. Is it better than the one before?

The naive instinct: deploy it, look at metrics. Wrong — confounded by every other change happening simultaneously, by seasonality, by demographic drift.

The right answer is an **A/B test**. Randomly assign traffic to control (old model) and treatment (new model). Compare metrics between arms. Statistical test. Promote treatment only if the lift is significant and the lift is positive.

For loopd and aipe at solo-user scale, A/B is awkward but possible. For contrl-mo's recommender, **single-user A/B (`B2C.18`)** is real: keep a control arm using rules, an experimental arm using learned, log which arm produced each session, compare clean-session rate over weeks.

For senior interview signal, you need to be fluent in:
- How A/B traffic is split (random vs. clustered).
- What metrics to track (online vs. offline).
- How to size the test (power, MDE).
- Common confounds (Simpson's paradox, novelty effect, ramp-up bias).
- When to stop early (sequential testing) vs. when not to (peeking).

You don't have to implement all of this. You have to be able to talk about it.

---

## Drift detection — `[C3.12]`

The model that worked yesterday may not work today. Data drifts, user behavior drifts, the world drifts.

```
Training distribution (saved at training time):
  feature_x mean: 0.42, std: 0.11
  feature_y mean: 0.81, std: 0.08
  ...

Production distribution (computed weekly):
  feature_x mean: 0.51, std: 0.13   ← shifted up
  feature_y mean: 0.79, std: 0.08
  ...

Population Stability Index (PSI):
  PSI = sum over buckets of
          (prod_pct - train_pct) × ln(prod_pct/train_pct)

  PSI < 0.1:   no significant change
  PSI < 0.2:   moderate change, investigate
  PSI > 0.2:   significant change, consider retraining
```

For contrl-mo's form classifier, the data that drifts is **your form patterns over time**. As you progress, your "good form" might tighten; your failure modes might shift from one type to another. A model trained six months ago may be classifying differently than the data it was trained on.

`[B3.13]` ships drift detection: compute PSI weekly on input features, alert when it exceeds 0.1. Phase 5 closes the loop with retraining triggers.

For loopd's LLM stack, drift is rarer but real — provider model updates (Sonnet 4 → Sonnet 4.5) shift behavior. Track output distribution and detect when a new model behaves differently from the old one. Stay alert.

---

## The five proof artifacts — `[B3.5]`–`[B3.10]`

Phase 3 ships five eval suites:

1. **`[B3.5]` Suite 1 — loopd classifier**: 30 labeled inputs, exact match, per-class precision/recall.
2. **`[B3.6]` Suite 2 — loopd caption chain**: 20 labeled inputs, 5-criteria rubric, LLM-as-judge with bias controls.
3. **`[B3.7]` Suite 3 — loopd interpret chain**: 30 NL queries, hit@5, MRR, faithfulness.
4. **`[B3.8]` Suite 4 — contrl-mo form classifier**: per-class precision/recall/F1, confusion matrix, calibration.
5. **`[B3.9]` Suite 5 — aipe spec retrieval**: 10 intents, precision@k.

Plus the observability stack: **`[B3.11]` ai_trace table** + **`[B3.12]` per-trace UI surface** + **`[B3.13]` drift detection** + **`[B3.10]` eval-CI integration** (run all five suites on every meaningful change; block deploy if regression).

---

## The Phase 3 deliverables

- [ ] Five eval suites cover the five major decision surfaces.
- [ ] One unified `ai_trace` table records every chain call in loopd.
- [ ] Drift detection runs weekly on contrl-mo's classifier inputs.
- [ ] Eval-CI integration means no deploy without re-running the five suites.

---

## The Interview Move

> *"Every chain and every model I ship has an eval set with labeled answers. I run five suites across loopd, contrl-mo, and aipe — each tied to a specific decision surface. The contrl-mo classifier gets confusion matrices and per-class F1; the loopd RAG gets hit@5, MRR, and faithfulness; the caption chain gets rubric scores via LLM-as-judge with bias controls. Every chain call writes a trace to a local ai_trace table — input, output, latency, tokens, cost, model, prompt version — so I can replay any historical request with a new model and verify the fix offline. Drift detection runs weekly on the classifier inputs; if PSI exceeds 0.1 the system flags for retraining. The eval suites run in CI on every meaningful change; regression blocks deploy."*

That paragraph is rare. Most senior candidates can speak about evals in the abstract; they can't tell you what their five eval suites are, what each measures, and how regression detection is wired into deploys. You can. That's the signal.

Next chapter: agents. Where the simple chain pattern ends and the loop begins.
