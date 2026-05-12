# AI Engineering Curriculum

**Owner:** Rein
**Target role:** AI Engineer / AI Product Engineer (L4–L5) — with a deliberate classical ML side that makes the resume stronger for hybrid AI/ML roles
**Approach:** Project-anchored to three active codebases plus an interview-prep surface. Three shapes of AI work, deliberately separated:
- **LLM application engineering** → loopd
- **Prompt engineering as a discipline + meta-tooling** → aipe
- **Classical supervised ML + on-device inference + recommender systems** → contrl-mo

**Sources merged:** project-anchored AI eng plan + IK ML Interview Masterclass (5 case studies) + IK Advanced ML v6 (high-leverage modules only).

---

## Active projects

| Project | What it is | Primary curriculum role |
|---|---|---|
| **loopd** | Android daily-vlog journal with 5 single-purpose AI chains | **Phase 1 (LLM foundations), Phase 2A (RAG over personal corpus), Phase 3 (LLM evals), Phase 5 (LLM production)** |
| **aipe** | Markdown spec templates + slash-command plugin for Claude Code / Codex | **Phase 1 (prompt engineering as discipline), Phase 2B (RAG over project context), Phase 4 Path A (meta-agent)** |
| **contrl-mo** | Local-first bodyweight progression with on-device MediaPipe pose detection | **Phase 2C (classical ML: form classifier + recommender), Phase 3 (ML evals), Phase 4 Path C (LLM coaching layer), Phase 5 (on-device ML production)** |
| **reincodes** | Portfolio + interactive DSA visualizer (Next.js static export) | **Interview prep surface — vizzes for tokenization, embeddings, RAG, agents, ML metrics** |

---

## The three-track interview story

Most candidates have one shape of AI experience. You'll have three, deliberately separated, with documented reasons for each architectural choice.

> "I've shipped three different shapes of AI work. Classical supervised ML for on-device form classification in contrl-mo. LLM application engineering with five disciplined chains in loopd. Retrieval-augmented systems in two scales — personal corpus in loopd, project context in aipe. I can tell you why each pattern fit its problem and what I'd change at scale."

That's the senior+ answer. The curriculum is built backwards from that sentence.

---

## How to use this doc

- Five phases plus a side track. Each phase has a **concept layer**, a **build layer**, and a **proof artifact**.
- Concepts are tagged with IDs like `[C1.3]`. Build items reference concepts as `[exercises C1.3, C1.4]`. Each phase ends with a coverage table.
- Concepts not referenced by any build are `[learn-only]` — interview material, not project work.
- Phases 1 and 2 (with sub-phases 2A, 2B, 2C) run in parallel after Phase 1 foundations land.
- Phase 3 starts the moment Phase 1 produces something to evaluate.
- Phase 4 waits for Phase 3 to be real. Phase 5 is last.
- Side track runs continuously — one paper or video per week.
- Flashcard track is a separate Anki/markdown doc. Hit 3×/week.
- Use `/aipe:feature` to spec each build before implementing. The spec *is* the proof artifact.
- Check items off as `[x]`. Don't move on from a phase until the proof artifact exists.

---

## Two RAGs, two shapes, plus one classical ML pipeline

| Dimension | loopd RAG (2A) | aipe RAG (2B) | contrl-mo ML (2C) |
|---|---|---|---|
| Problem shape | Retrieval-augmented generation | Retrieval-augmented prompting | Supervised classification + recommendation |
| Inputs | User journal queries | User spec intents | Pose landmark sequences |
| Outputs | Generated text grounded in past entries | Generated specs shaped by project context | Form-issue labels + progression recommendations |
| Model type | Generative LLM + embedding model | Generative LLM + embedding model | Trained classifier (LR / GBT) + rules / collaborative filtering |
| Training | None — uses pre-trained | None — uses pre-trained | **Real training on public data + self-labeled fine-tune** |
| Eval shape | Hit@k, MRR, faithfulness | Precision@k, pairwise spec quality | Precision/recall/F1 per class, confusion matrix |
| Failure modes | Stale embeddings, hallucination | Wrong context fed, prompt drift | Distribution shift, domain gap (public→personal), class imbalance |
| Interview shape | Modern AI eng | Modern AI eng | **Classical ML — IK Modules 1, 2, 3, 4** |

The contrast across all three is the interview answer.

---

## On loopd's principle #11

Current spec: *"No RAG. Hand-picked retrieval (sibling todos + last 3 days of entries, capped at 1000 chars each) feeds the expand chain. Embeddings + vector store would be overkill at this scale."*

**Updated principle #11:** *"RAG above threshold. The expand chain stays hand-picked (recency-based, ≤ 1000 chars per source) because the corpus is bounded by today. The interpret chain at week/month scope and the 'find related entries' feature on threads use embeddings + cosine search. The threshold is documented per-feature; default is no RAG until a feature provably needs it."*

That update is a Phase 1 deliverable — `loopd/.aipe/specs/refactor/principle-11-update.md` via `/aipe:refactor`.

---

## Phase 1 — LLM application foundations + ML primer

**Primary anchor:** loopd's 5 AI chains
**Supporting anchor:** aipe (prompt engineering as a discipline)

### Concept layer

- [ ] `[C1.1]` Tokenization (BPE, sentencepiece) — what is a token, why context windows are sized in tokens `[learn-only — built in reincodes viz]`
- [ ] `[C1.2]` Context windows and the lost-in-the-middle problem `[learn-only — surfaces in Phase 2 chunking]`
- [ ] `[C1.3]` Sampling parameters: temperature, top-p, top-k — loopd's caption chain is a real test case
- [ ] `[C1.4]` Structured outputs: JSON mode, tool schemas, typed contracts
- [ ] `[C1.5]` Streaming responses `[learn-only — loopd has no streaming]`
- [ ] `[C1.6]` Token economics
- [ ] `[C1.7]` Prompt engineering as a discipline — what aipe encodes
- [ ] `[C1.8]` Provider-agnostic chain design
- [ ] `[C1.9]` Heuristic-before-LLM — loopd's classifier pattern
- [ ] `[C1.10]` Single-purpose chains vs agent loops `[learn-only — defended in Phase 4 framing]`
- [ ] `[C1.11]` User-override locks
- [ ] `[C1.12]` Output mode mismatch — loopd's 5 chains are 4 JSON + 1 markdown `[learn-only — emerges from C1.4 build]`
- [ ] `[C1.13]` Discriminative vs generative models (**IK Module 6**) `[learn-only]`
- [ ] `[C1.14]` Why we learn a distribution vs deterministic (**IK Module 6**) `[learn-only]`

### Build layer

- [ ] `[B1.1]` Add Zod schemas for every AI input/output across loopd's 5 chains `[exercises C1.4, C1.12]`
- [ ] `[B1.2]` Add token usage logging per chain → new local `ai_call_log` table `[exercises C1.6]`
- [ ] `[B1.3]` Verify `recentCaptions` anti-repetition + add temperature variance per variant as a deliberate sampling experiment `[exercises C1.3]`
- [ ] `[B1.4]` Update principle #11 via `/aipe:refactor` `[meta-build: enables Phase 2A]`
- [ ] `[B1.5]` Document heuristic regex coverage in `heuristicClassify.ts` — false-negative cases as assertions `[exercises C1.9]`
- [ ] `[B1.6]` Provider-swap eval: all 5 chains on Claude → OpenAI on same 10 fixtures. Document divergences. `[exercises C1.8]`
- [ ] `[B1.7]` **In aipe**: ship `template-style-guide.md` documenting prompt engineering principles in your 11 templates `[exercises C1.7]`
- [ ] `[B1.8]` "AI cost & latency" panel in `app/settings/ai.tsx` `[exercises C1.6, C1.9]`
- [ ] `[B1.9]` `user_overridden_*` lock pattern audit `[exercises C1.11]`

### Concept↔build coverage

| Concept | Exercised by | Status |
|---|---|---|
| C1.1 Tokenization | (reincodes viz) | deferred |
| C1.2 Context windows | (Phase 2 chunking) | deferred |
| C1.3 Sampling | B1.3 | covered |
| C1.4 Structured outputs | B1.1 | covered |
| C1.5 Streaming | — | learn-only |
| C1.6 Token economics | B1.2, B1.8 | covered |
| C1.7 Prompt eng discipline | B1.7 | covered |
| C1.8 Provider-agnostic | B1.6 | covered |
| C1.9 Heuristic-before-LLM | B1.5, B1.8 | covered |
| C1.10 Chains vs agents | (Phase 4) | deferred |
| C1.11 User-override locks | B1.9 | covered |
| C1.12 Output mode mismatch | B1.1 | covered |
| C1.13 Discriminative vs generative | — | learn-only |
| C1.14 Distribution vs deterministic | — | learn-only |

### Proof artifact

- [ ] `loopd/.aipe/specs/features/chains-typed-contracts.md`
- [ ] `loopd/.aipe/specs/refactor/principle-11-update.md`
- [ ] `aipe/template-style-guide.md`

---

## Phase 2A — RAG over personal corpus (loopd)

### Concept layer (shared with 2B)

- [ ] `[C2.1]` What an embedding is geometrically
- [ ] `[C2.2]` Embedding models: text-embedding-3, Cohere, BGE, sentence-transformers — when to pick each
- [ ] `[C2.3]` Chunking strategies
- [ ] `[C2.4]` Dense vs sparse retrieval (BM25) — **IK Module 1**
- [ ] `[C2.5]` Hybrid retrieval with RRF
- [ ] `[C2.6]` Reranking with a cross-encoder
- [ ] `[C2.7]` Vector databases: pgvector, sqlite-vec, in-memory
- [ ] `[C2.8]` Query rewriting and HyDE
- [ ] `[C2.9]` Embedding visualization — t-SNE vs PCA (**IK Module 3**) `[learn-only]`
- [ ] `[C2.10]` Word embedding methods (**IK Module 5**) `[learn-only]`
- [ ] `[C2.11]` Stale-embedding problem
- [ ] `[C2.12]` Incremental indexing vs full rebuild
- [ ] `[C2.13]` GraphRAG basics — loopd's `#tag` threads are an explicit graph

### Build layer

- [ ] `[B2A.1]` Pick storage: `sqlite-vec` extension (preferred) or TEXT + JS cosine. Document. `[exercises C2.1, C2.7]`
- [ ] `[B2A.2]` Schema: `entry_embeddings`, `todo_embeddings` with `{source_id, chunk_index, content, embedding, model, embedding_stale_at}` + sync columns `[exercises C2.7, C2.11]`
- [ ] `[B2A.3]` Pick embedding model — document why (likely text-embedding-3-small) `[exercises C2.2]`
- [ ] `[B2A.4]` Embed on commit; mark stale on text change; re-embed on idle pass `[exercises C2.11, C2.12]`
- [ ] `[B2A.5]` Chunking: per-entry whole-text first; sentence-window only if eval shows recall miss `[exercises C2.3]`
- [ ] `[B2A.6]` Query path: embed query → top-k cosine → filter `deleted_at IS NULL` `[exercises C2.1, C2.4]`
- [ ] `[B2A.7]` Ship feature: **"interpret this week"** — interpret chain at 7-day scope, retrieval supplements full-week text
- [ ] `[B2A.8]` Ship feature: **"related entries"** on thread detail (semantic, complements prose mentions) `[exercises C2.13]`
- [ ] `[B2A.9]` Eval set: 20–30 (query, expected entry ID) pairs `[enables Phase 3 suite 4]`
- [ ] `[B2A.10]` Add BM25 alongside cosine; combine with RRF; measure hit@k `[exercises C2.4, C2.5]`
- [ ] `[B2A.11]` Cross-encoder rerank on "related entries"; measure hit@5; if no improvement, skip in 2B `[exercises C2.6]`

### Proof artifact

- [ ] `loopd/.aipe/specs/features/rag-personal-corpus.md`

---

## Phase 2B — RAG over project context (aipe)

### Build layer (concept layer shared with 2A)

- [ ] `[B2B.1]` Add `commands/index.md` slash command: walks `.aipe/project/` + `~/.config/aipe/global/`, chunks by section, embeds, writes to `.aipe/.index/` (gitignored) `[exercises C2.3, C2.12]`
- [ ] `[B2B.2]` Embedding source decision: (a) host-agent embedding tool, (b) local model, (c) OPENAI_API_KEY env var. Pick and document. `[exercises C2.2]`
- [ ] `[B2B.3]` Retrieve-then-feed: every `/aipe:<type>` starts with retrieval, feeds top-k chunks (not full file) `[exercises C2.1, C2.4]`
- [ ] `[B2B.4]` Stale-index handling via file mtime `[exercises C2.11, C2.12]`
- [ ] `[B2B.5]` Query rewriting: expand `/aipe:feature <intent>` into richer retrieval query `[exercises C2.8]`
- [ ] `[B2B.6]` Eval: 10 representative intents, precision@k `[enables Phase 3 suite 5]`

### Proof artifact

- [ ] `aipe/.aipe/specs/features/rag-project-context.md`
- [ ] `aieng-flashcards/rag-comparison.md` — side-by-side table expanded

---

## Phase 2C — Classical ML pipeline (contrl-mo)

**Primary anchor:** contrl-mo form classifier + progression recommender
**Why this phase is here:** This is the *most under-represented* skill in modern AI eng candidates — actual end-to-end supervised ML with labeled data, feature engineering, training, evaluation, and on-device deployment. The interview signal is enormous because most candidates have only consumed pre-trained models, never trained one.

### Concept layer

- [ ] `[C2C.1]` Supervised learning pipeline: data → features → train/val/test → model → eval → deploy (**IK Module 1**)
- [ ] `[C2C.2]` Feature engineering from time-series landmark data: joint angles, angular velocities, ROM, ratios, temporal aggregates
- [ ] `[C2C.3]` Train/val/test split discipline — why temporal splits matter for session data (you can't shuffle reps from the same session across splits)
- [ ] `[C2C.4]` Model selection for tabular features: logistic regression vs gradient-boosted trees (XGBoost / LightGBM) — **IK Module 1**'s "which performs better?"
- [ ] `[C2C.5]` Class imbalance — most form is correct; failure modes are rare. SMOTE, class weights, focal loss. **IK Module 3**
- [ ] `[C2C.6]` Domain gap: public dataset → your phone in your living room. Distribution shift detection and mitigation.
- [ ] `[C2C.7]` Transfer learning / fine-tuning shape for tabular — incremental retraining as user-specific data arrives
- [ ] `[C2C.8]` On-device inference: model size, latency, quantization, ONNX runtime mobile, TF Lite
- [ ] `[C2C.9]` Recommender systems framing — **IK Module 2**: content-based vs collaborative filtering, cold-start, freshness/diversity/fairness
- [ ] `[C2C.10]` Cold-start problem — your user has zero history on day 1. Heuristic rules first, learned model after threshold.
- [ ] `[C2C.11]` Confusion matrices and per-class metrics — why aggregate accuracy lies for imbalanced data
- [ ] `[C2C.12]` Calibration — predicted probability vs actual frequency. Critical when downstream decisions use the score.
- [ ] `[C2C.13]` Audit trail / inference logging for offline review — production ML systems pattern from your spec §13

### Build layer — Form classifier (Tier 2 + Tier 4)

- [ ] `[B2C.1]` Survey public pose datasets: MM-Fit, Fit3D, MMA-Pose. Pick one or two with labels closest to your exercise set. Document choice. `[exercises C2C.1, C2C.6]`
- [ ] `[B2C.2]` Build label schema: per-exercise failure modes (e.g. pushup: `good`, `elbow_flare`, `incomplete_depth`, `back_arch`, `hip_sag`). Five exercises × ~3–5 failure modes = ~20 classes total. `[exercises C2C.1]`
- [ ] `[B2C.3]` Feature extraction pipeline: from landmark sequences → fixed-length feature vectors per rep-window. Features: peak/trough joint angles, angular velocity, ROM, time-to-bottom, asymmetry between left/right sides. `[exercises C2C.2]`
- [ ] `[B2C.4]` Build the audit trail feature from contrl-mo spec §13 first — record landmark series + phase transitions to local SQLite per rep. This *is* your training data pipeline. `[exercises C2C.13]`
- [ ] `[B2C.5]` Build a CLI labeling tool: `node bin/label-session.ts <session-id>` walks rep-windows, plays them back via terminal viz (ASCII or simple frame export), prompts for label. Outputs JSONL. `[exercises C2C.1]`
- [ ] `[B2C.6]` Train baseline: logistic regression on engineered features. Per-class precision/recall/F1, confusion matrix. `[exercises C2C.1, C2C.4, C2C.11]`
- [ ] `[B2C.7]` Train comparison: gradient-boosted trees (LightGBM or XGBoost). Compare to baseline. Document which is better and why — this is **IK Module 1 verbatim**. `[exercises C2C.4]`
- [ ] `[B2C.8]` Handle class imbalance: report results with and without class weights / oversampling. Measure macro-F1 vs accuracy to show why accuracy lies. `[exercises C2C.5, C2C.11]`
- [ ] `[B2C.9]` Temporal split discipline: train on session-level split, never rep-level. Document why a random split would leak. `[exercises C2C.3]`
- [ ] `[B2C.10]` Domain gap measurement: train on public data, eval on your self-labeled set (small but real). Report the gap. Fine-tune on self-labeled. Re-measure. `[exercises C2C.6, C2C.7]`
- [ ] `[B2C.11]` Calibration check: plot reliability diagram on val set. If miscalibrated, apply Platt scaling or isotonic regression. `[exercises C2C.12]`
- [ ] `[B2C.12]` On-device deployment: export model to ONNX or TF Lite, integrate with contrl-mo, measure inference latency on real Android device, target < 50ms per rep `[exercises C2C.8]`
- [ ] `[B2C.13]` **Tier 4 LLM coaching layer**: form classifier emits structured labels → feeds an LLM prompt with user history (last 5 sessions, recent failure modes) → LLM produces natural-language coaching ("you've been flaring elbows on 3 of last 5 pushup sessions — try cueing 'tuck elbows toward hips' next set"). Provider toggle like loopd. `[exercises C2C.13, ties to Phase 4 Path C]`

### Build layer — Recommender (rule-based first, learned later)

- [ ] `[B2C.14]` **Rule-based v1**: deterministic progression advice. If `consecutivePasses == 2` and last form was clean, recommend gate completion. If `failure_mode == elbow_flare` recurring, recommend a regression exercise. Pure rules over your existing data model. `[exercises C2C.10]`
- [ ] `[B2C.15]` **Learned recommender v2** (after sessions accumulate): features = recent sessions, gate state, form history. Target = which exercise the user *should* pick next to maximize clean-session probability. Train as a classifier; rank by predicted probability. `[exercises C2C.4, C2C.9]`
- [ ] `[B2C.16]` Cold-start: if user has < 5 sessions, fall back to rule-based. Document threshold and reasoning. `[exercises C2C.10]`
- [ ] `[B2C.17]` Diversity / freshness check: never recommend the same exercise 3 sessions in a row, even if the model says it's optimal. Classical recommender-system patch. `[exercises C2C.9]`
- [ ] `[B2C.18]` A/B framing (even single-user): keep a control arm that uses rules only, an experimental arm that uses learned. Log which arm produced which session. This is **IK Module 1 A/B** without the user-scale problem — you're A/B'ing the recommender against yourself. `[exercises C2C.9]`

### Concept↔build coverage

| Concept | Exercised by | Status |
|---|---|---|
| C2C.1 Supervised pipeline | B2C.1, B2C.2, B2C.5, B2C.6 | covered |
| C2C.2 Feature engineering | B2C.3 | covered |
| C2C.3 Train/val/test discipline | B2C.9 | covered |
| C2C.4 Model selection | B2C.6, B2C.7, B2C.15 | covered |
| C2C.5 Class imbalance | B2C.8 | covered |
| C2C.6 Domain gap | B2C.1, B2C.10 | covered |
| C2C.7 Transfer learning | B2C.10 | covered |
| C2C.8 On-device inference | B2C.12 | covered |
| C2C.9 Recommender systems | B2C.15, B2C.17, B2C.18 | covered |
| C2C.10 Cold-start | B2C.14, B2C.16 | covered |
| C2C.11 Confusion matrices | B2C.6, B2C.8 | covered |
| C2C.12 Calibration | B2C.11 | covered |
| C2C.13 Audit trail / inference logging | B2C.4, B2C.13 | covered |

### Proof artifact

- [ ] `contrl-mo/.aipe/specs/features/form-classifier.md` — full pipeline spec
- [ ] `contrl-mo/.aipe/specs/features/progression-recommender.md` — rule-based + learned
- [ ] `contrl-mo/.aipe/specs/features/audit-trail.md` — the inference-logging layer
- [ ] `contrl-mo/docs/ml-results.md` — public-data baseline, self-labeled fine-tune, domain gap measured, per-class confusion matrices, calibration plot. This is your "I trained a model and have the numbers to show it" interview artifact.

---

## Phase 3 — Evals and observability (for LLMs *and* for ML)

**Primary anchors:** loopd (5 chains + RAG) + aipe (RAG + specs) + contrl-mo (classifier + recommender)
**Why this phase next:** You now have *seven* surfaces to evaluate across three projects: 5 LLM chains, 2 RAG retrievals, 1 classifier, 1 recommender. The eval harness is the connective tissue across all three projects.

### Concept layer

- [ ] `[C3.1]` Golden sets, adversarial sets, regression sets
- [ ] `[C3.2]` Eval methods: exact match, fuzzy, rubric, LLM-as-judge, pairwise
- [ ] `[C3.3]` LLM-as-judge bias: position, verbosity, self-preference
- [ ] `[C3.4]` Classical metrics: precision, recall, F1, AUC-ROC, MRR, NDCG (**IK Modules 1, 3**) — *fully exercised on contrl-mo classifier*
- [ ] `[C3.5]` Imbalanced dataset metrics (**IK Module 3**) — *fully exercised on form classifier (most reps are good form)*
- [ ] `[C3.6]` A/B testing for ML/LLM features (**IK Module 1**) — exercised via single-user A/B in contrl-mo recommender
- [ ] `[C3.7]` "No-click is not a negative label" (**IK Module 1**) — applies to loopd RAG *and* to contrl-mo recommender (an unselected recommendation isn't necessarily bad)
- [ ] `[C3.8]` Positional bias in ranking (**IK Module 2**) — lost-in-the-middle for LLMs; recency bias in recommenders
- [ ] `[C3.9]` Bias-variance and ensembles (**IK Module 2**) — *exercised when comparing LR vs GBT in `B2C.7`*
- [ ] `[C3.10]` Observability: traces, spans, replay, drift detection
- [ ] `[C3.11]` Tools: Langfuse, LangSmith, Phoenix/Arize — and the ML-side analog: MLflow / W&B for training runs
- [ ] `[C3.12]` Drift detection for production ML — when does the classifier need retraining? Population stability index, prediction drift.

### Build layer

- [ ] `[B3.1]` Build reusable eval harness (TypeScript / Node + Python for ML side): takes dataset + model-under-test + metric config; pointable at LLM and ML targets `[exercises C3.1, C3.2]`
- [ ] `[B3.2]` Suite 1 — loopd classifier (heuristic vs LLM): accuracy + per-type F1 on ~50 labeled todos `[exercises C3.4, C3.5]`
- [ ] `[B3.3]` Suite 2 — loopd caption variants: rubric LLM-judge on 30 entries, randomize variant order `[exercises C3.2, C3.3]`
- [ ] `[B3.4]` Suite 3 — loopd interpret: rubric judge on 20 entries `[exercises C3.2]`
- [ ] `[B3.5]` Suite 4 — loopd RAG retrieval: hit@k, MRR `[exercises C3.4, C3.7]`
- [ ] `[B3.6]` Suite 5 — aipe RAG retrieval: precision@k `[exercises C3.4]`
- [ ] `[B3.7]` Suite 6 — aipe end-to-end: pairwise with-RAG vs without-RAG `[exercises C3.2, C3.3]`
- [ ] `[B3.8]` Suite 7 — **contrl-mo form classifier**: per-class precision/recall/F1, macro-F1, confusion matrix, calibration plot. This is the most quantitatively rigorous eval in the curriculum. `[exercises C3.4, C3.5, C3.9]`
- [ ] `[B3.9]` Suite 8 — **contrl-mo recommender**: precision@k on next-exercise prediction, MRR. Single-user A/B between rule-based and learned arms. `[exercises C3.4, C3.6, C3.7]`
- [ ] `[B3.10]` Wire LLM evals into CI for classifier + caption suites `[exercises C3.1]`
- [ ] `[B3.11]` Local `ai_trace` table for LLM tracing `[exercises C3.10]`
- [ ] `[B3.12]` **For contrl-mo: training-run logging** — MLflow or a minimal JSON log of every training run (data version, features, hyperparameters, metrics). This is the ML-side analog of LLM tracing. `[exercises C3.10, C3.11]`
- [ ] `[B3.13]` Drift detection on contrl-mo classifier: log prediction distribution per session; alert if it shifts beyond a threshold from training distribution `[exercises C3.12]`
- [ ] `[B3.14]` Evaluate one observability tool: Langfuse self-hosted for LLM side, MLflow for ML side. Decide stay-local or migrate. `[exercises C3.11]`
- [ ] `[B3.15]` Document one regression caught — write `caught-regression.md`

### Concept↔build coverage

| Concept | Exercised by | Status |
|---|---|---|
| C3.1 Eval set types | B3.1, B3.10 | covered |
| C3.2 Eval methods | B3.1, B3.3, B3.4, B3.7 | covered |
| C3.3 LLM-judge bias | B3.3, B3.7 | covered |
| C3.4 Classical metrics | B3.2, B3.5, B3.6, B3.8, B3.9 | covered |
| C3.5 Imbalanced datasets | B3.2, B3.8 | covered |
| C3.6 A/B testing | B3.9 | covered |
| C3.7 No-click negative label | B3.5, B3.9 | covered |
| C3.8 Positional bias | (touched via B3.3 randomization) | partial |
| C3.9 Bias-variance | B3.8 (via LR vs GBT compare) | covered |
| C3.10 Observability | B3.11, B3.12 | covered |
| C3.11 Tools | B3.12, B3.14 | covered |
| C3.12 Drift detection | B3.13 | covered |

### Proof artifact

- [ ] `loopd/.aipe/specs/features/eval-harness.md` — LLM-side suites
- [ ] `contrl-mo/docs/ml-evaluation.md` — classifier + recommender eval with real numbers, confusion matrices, calibration plots
- [ ] `caught-regression.md`

---

## Phase 4 — Agents and tool use

**Primary anchor:** Pick one path

### Concept layer

- [ ] `[C4.1]` Tool/function calling mechanics
- [ ] `[C4.2]` The agent loop, termination conditions
- [ ] `[C4.3]` ReAct (Reasoning + Acting) — read the paper
- [ ] `[C4.4]` Planning vs reactive agents
- [ ] `[C4.5]` Memory: short-term (context), long-term (retrieval — Phase 2)
- [ ] `[C4.6]` Tool routing: heuristic vs LLM-routed
- [ ] `[C4.7]` Error recovery
- [ ] `[C4.8]` Multi-agent orchestration `[learn-only — interview defense]`
- [ ] `[C4.9]` When *not* to use an agent
- [ ] `[C4.10]` RL primer (**IK Module 6**): value iteration vs policy iteration `[learn-only]`
- [ ] `[C4.11]` Anthropic's "Building effective agents" post
- [ ] `[C4.12]` **ML-in-the-loop agents** — when the agent's tools include trained models (your form classifier in Path C is this pattern)

### Build layer — Pick one path

**Path A — aipe meta-agent**
- [ ] `[B4A.1]` `/aipe:implement` command — reads spec, identifies changes, edits per file, confirms `[exercises C4.1, C4.2, C4.4]`
- [ ] `[B4A.2]` Tool set: file read/write, run command, ask user `[exercises C4.1]`
- [ ] `[B4A.3]` Termination conditions documented `[exercises C4.2]`
- [ ] `[B4A.4]` Explicit dispatcher routing `[exercises C4.6]`
- [ ] `[B4A.5]` Failure modes + mitigations `[exercises C4.7]`

**Path B — loopd classifier upgrade**
- [ ] `[B4B.1]` Classifier → mini-agent loop: classify → if confidence < 0.7, retrieve via 2A RAG → re-classify → finalize `[exercises C4.1, C4.2, C4.5]`
- [ ] `[B4B.2]` Tools: `retrieve_similar_todos`, `get_user_override_history` `[exercises C4.1]`
- [ ] `[B4B.3]` Termination: confidence ≥ 0.7 or 2 iterations `[exercises C4.2]`
- [ ] `[B4B.4]` Routing: heuristic (confidence threshold) `[exercises C4.6]`
- [ ] `[B4B.5]` Failure modes documented `[exercises C4.7]`

**Path C — contrl-mo coaching agent** (recommended given Phase 2C)
- [ ] `[B4C.1]` Coaching agent loop: form classifier emits labels → agent decides whether to coach (rule: ≥ 2 instances of same failure in session) → retrieves user history → LLM generates coaching message → user confirms/dismisses `[exercises C4.1, C4.2, C4.5, C4.12]`
- [ ] `[B4C.2]` Tools: `get_form_history`, `get_progression_state`, `get_recent_coaching` (don't repeat advice), `get_exercise_cues` `[exercises C4.1, C4.12]`
- [ ] `[B4C.3]` Termination: coaching message generated or "no coaching needed" `[exercises C4.2]`
- [ ] `[B4C.4]` Routing: rule-based gate (form classifier output triggers the agent) `[exercises C4.6]`
- [ ] `[B4C.5]` Failure modes: stale form data, contradictory cues, coaching fatigue `[exercises C4.7]`

**Either path**
- [ ] `[B4.6]` Write the "when *not* to" section `[exercises C4.9]`
- [ ] `[B4.7]` Phase 3 evals: did the agent pick the right tool? Did the plan complete? `[exercises C4.2]`
- [ ] `[B4.8]` Read & annotate Anthropic's "Building effective agents" — map each pattern to your build `[exercises C4.11]`

### My recommendation

**Path C** is the richest interview answer because it's the only agent in your portfolio that has a *trained ML model as a tool*. Most candidates' agents call only LLM tools or API tools. An agent that orchestrates a trained classifier + a generative LLM + a structured rules engine is a stronger pattern.

### Proof artifact

- [ ] `<project>/.aipe/specs/features/agent-architecture.md`

---

## Phase 5 — Production serving (LLM *and* ML)

**Primary anchors:** loopd (LLM serving) + contrl-mo (on-device ML serving)

### Concept layer

- [ ] `[C5.1]` LLM serving: caching, batching, streaming
- [ ] `[C5.2]` Latency optimization for LLMs: prompt caching, model routing, speculative decoding
- [ ] `[C5.3]` Cost optimization for LLMs
- [ ] `[C5.4]` Rate limiting and backpressure
- [ ] `[C5.5]` Retry and circuit breaker patterns
- [ ] `[C5.6]` Observability in production: token spend, latency, errors, drift
- [ ] `[C5.7]` Security: prompt injection, output sanitization, PII
- [ ] `[C5.8]` Self-hosted vs API tradeoffs `[learn-only]`
- [ ] `[C5.9]` ML system design vs general system design (**IK Module 6**)
- [ ] `[C5.10]` Search ranking system design (**IK Module 1**)
- [ ] `[C5.11]` Recommender system design (**IK Module 2**) — *now fully exercised by contrl-mo*
- [ ] `[C5.12]` Anomaly detection system design (**IK Module 3**) — applies to LLM hallucination *and* ML drift
- [ ] `[C5.13]` Object detection / CV system design (**IK Module 4**) — *now fully exercised by contrl-mo*
- [ ] `[C5.14]` Tech support chatbot (**IK Module 5**)
- [ ] `[C5.15]` **On-device ML serving**: quantization (int8, fp16), model size budgets, GPU delegate, battery cost, OTA model updates
- [ ] `[C5.16]` **Retraining pipelines**: when to retrain (data drift, prediction drift, scheduled), where to retrain (cloud vs on-device personalization)

### Build layer

**loopd LLM hardening**
- [ ] `[B5.1]` Request queue with retry/backoff for all chains + RAG retrievals `[exercises C5.4, C5.5]`
- [ ] `[B5.2]` Prompt caching (Anthropic prompt caching API) `[exercises C5.1, C5.2]`
- [ ] `[B5.3]` Formalize model routing policy in `loopd/docs/spec.md` `[exercises C5.2, C5.3]`
- [ ] `[B5.4]` Circuit breaker for provider outage `[exercises C5.5]`
- [ ] `[B5.5]` Ops dashboard `app/more/ai-ops.tsx` `[exercises C5.6]`
- [ ] `[B5.6]` Define and document SLOs `[exercises C5.6]`
- [ ] `[B5.7]` Prompt-injection guards on user-generated text `[exercises C5.7]`
- [ ] `[B5.8]` Semantic cache for interpret chain `[exercises C5.1]`

**contrl-mo ML hardening**
- [ ] `[B5.9]` Quantize the form classifier (int8 for tabular models, fp16 if neural). Measure size + latency before/after. `[exercises C5.15]`
- [ ] `[B5.10]` Latency budget: < 50ms per rep inference, documented and measured on real Android device `[exercises C5.15]`
- [ ] `[B5.11]` Model versioning: bundle model with app version; allow override via Notion config (your existing exercises-from-Notion pattern) `[exercises C5.15, C5.16]`
- [ ] `[B5.12]` Retraining decision doc: when does the classifier need retraining? Drift threshold from `B3.13`, scheduled cadence, manual trigger. `[exercises C5.16]`
- [ ] `[B5.13]` On-device personalization layer: per-user calibration (the 10-second countdown calibrates angle thresholds — extend this to the classifier itself with online learning or threshold-only adaptation) `[exercises C5.16]`

**System design integration**
- [ ] `[B5.14]` System design 1-pager: "my portfolio as three system designs." loopd = LLM application. contrl-mo = on-device classification + recommender. aipe = retrieval-augmented tooling. Reference IK Modules 1, 2, 3, 4, 5 where each applies. `[exercises C5.9, C5.10, C5.11, C5.12, C5.13, C5.14]`

### Concept↔build coverage

| Concept | Exercised by | Status |
|---|---|---|
| C5.1 Serving patterns | B5.2, B5.8 | covered |
| C5.2 Latency optimization | B5.2, B5.3 | covered |
| C5.3 Cost optimization | B5.3 | covered |
| C5.4 Rate limiting | B5.1 | covered |
| C5.5 Retry / circuit breaker | B5.1, B5.4 | covered |
| C5.6 Production observability | B5.5, B5.6 | covered |
| C5.7 Security | B5.7 | covered |
| C5.8 Self-hosted vs API | — | learn-only |
| C5.9–C5.14 System design framings | B5.14 | covered |
| C5.15 On-device ML serving | B5.9, B5.10, B5.11 | covered |
| C5.16 Retraining pipelines | B5.12, B5.13 | covered |

### Proof artifact

- [ ] `loopd/.aipe/specs/features/llm-infra.md`
- [ ] `contrl-mo/.aipe/specs/features/ml-infra.md`
- [ ] `aieng-portfolio/three-system-designs.md` — the integrated 1-pager

---

## Side track — Model internals (run continuously)

One per week.

### Foundations
- [ ] Karpathy: "Let's build GPT"
- [ ] Karpathy: "Let's build the GPT tokenizer" `[surfaces in reincodes viz]`
- [ ] Jay Alammar: "The Illustrated Transformer"
- [ ] Jay Alammar: "The Illustrated GPT-2"
- [ ] 3Blue1Brown: neural network + attention series

### Papers (in order)
- [ ] "Attention Is All You Need"
- [ ] "Retrieval-Augmented Generation" (Lewis et al.) `[grounds Phase 2A/2B]`
- [ ] "ReAct: Synergizing Reasoning and Acting" `[grounds Phase 4]`
- [ ] "Constitutional AI"
- [ ] "Direct Preference Optimization"
- [ ] "Chain-of-Thought Prompting"
- [ ] **Classical ML reading for Phase 2C:**
  - [ ] XGBoost paper (Chen & Guestrin) `[grounds B2C.7]`
  - [ ] "Wide & Deep Learning" (Cheng et al.) — Google's recommender pattern `[grounds B2C.15]`
  - [ ] Two Towers / DSSM papers — modern recommender architecture
- [ ] One current paper per week after this

### Classical DL theory (IK-anchored)
- [ ] Vanishing/exploding gradients in RNNs (**IK Module 5**)
- [ ] When *not* to use a bi-LSTM (**IK Module 5**)
- [ ] CNN fundamentals (**IK Module 4**) — *MediaPipe Pose Landmarker is CNN-based; your Phase 2C work is downstream of it*
- [ ] Vanishing/exploding gradients in CNNs (**IK Module 4**)
- [ ] Learning rate optimizers (**IK Module 4**)
- [ ] Dropout, L1/L2 (**IK Modules 1, 4**)

### Anthropic interpretability (spare time)
- [ ] "Toy Models of Superposition"
- [ ] "Scaling Monosemanticity"

---

## Flashcard track — IK fundamentals

`aieng-flashcards.md` or Anki. Hit 3×/week. Many of these are now *not* learn-only because Phase 2C and Phase 3 exercise them through real ML work.

- [ ] L1/L2 regularization performance (**IK Module 1**) `[reinforces B2C.6/B2C.7]`
- [ ] Imbalanced dataset metrics (**IK Module 1**) `[reinforces C3.5, B2C.8]`
- [ ] KNN vs logistic regression (**IK Module 1**) `[reinforces B2C.4]`
- [ ] SVM on non-linear data (**IK Module 2**)
- [ ] Random forest feature subsetting (**IK Module 2**) `[reinforces B2C.7]`
- [ ] Bias-variance tradeoff (**IK Module 2**) `[reinforces C3.9, B2C.7]`
- [ ] Agglomerative clustering dendrograms (**IK Module 3**)
- [ ] t-SNE vs PCA (**IK Module 3**) `[reinforces C2.9 — and useful for visualizing your form-classifier feature space]`
- [ ] Dropout in small networks (**IK Module 4**)
- [ ] CNN gradient issues (**IK Module 4**)
- [ ] Learning rate optimizers (**IK Module 4**)
- [ ] Word embedding for context similarity (**IK Module 5**) `[reinforces C2.10]`
- [ ] RNN exploding gradients (**IK Module 5**)
- [ ] When not to use bi-LSTM (**IK Module 5**)
- [ ] Discriminative vs generative (**IK Module 6**) `[reinforces C1.13]`
- [ ] Distribution vs deterministic encoding (**IK Module 6**)
- [ ] Value vs policy iteration (**IK Module 6**) `[reinforces C4.10]`

---

## Interview prep surface — reincodes

Use deliberately during interview cycles.

- [ ] Add `concepts/ai-engineering/` category
- [ ] **Tokenization visualizer** `[exercises C1.1]`
- [ ] **Cosine similarity playground** `[exercises C2.1]`
- [ ] **RAG pipeline visualizer** `[exercises C2.1, C2.4, C2.6]`
- [ ] **Agent loop animation** `[exercises C4.2]`
- [ ] **Confusion matrix interactive** — hover a cell, see what kind of error it represents, classifier metrics update live `[exercises C3.4, C3.11]`
- [ ] **Bias-variance interactive** — sliders for model complexity, watch over/underfit `[exercises C3.9]`
- [ ] Finish `binary-heap` (currently WIP)

---

## Reading list

- [ ] Eugene Yan's blog
- [ ] Chip Huyen: *Designing Machine Learning Systems*
- [ ] Hamel Husain on LLM evals
- [ ] Simon Willison's blog
- [ ] Latent Space podcast
- [ ] **For Phase 2C specifically:** *Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow* (Géron) — the classical-ML reference

---

## Master coverage summary

| Phase | Concepts | Build-exercised | Learn-only | Deferred |
|---|---|---|---|---|
| 1. LLM foundations | 14 | 7 | 5 | 2 |
| 2A. RAG (loopd) | 13 (shared) | — see 2B/2C | — | — |
| 2B. RAG (aipe) | (shares 2A) | 11 across 2A+2B | 2 | 0 |
| 2C. Classical ML | 13 | 13 | 0 | 0 |
| 3. Evals | 12 | 11 | 1 | 0 |
| 4. Agents | 12 | 9 | 2 | 1 |
| 5. Production | 16 | 14 | 1 | 1 |

**Read of the table:** Phase 2C has perfect coverage — every classical ML concept gets exercised in code. That's the strength of having a real ML training pipeline. Phase 1 retains the most learn-only items (foundations theory). Across the curriculum, the ratio of build-exercised to learn-only concepts is roughly 4:1, which is honest for a curriculum that has to balance interview theory with shipping work.

---

## How to sequence

**Months 1–2:** Phase 1 + start Phase 2A (loopd RAG). Side track 1–2 items per week.

**Month 3:** Phase 2A finishes. Start Phase 2C — but only `B2C.4` (audit trail) since you need the data pipeline before you can train. Phase 2B (aipe RAG) runs in parallel; it's lighter.

**Month 4:** Phase 2C heavy lifting — `B2C.1` through `B2C.12` (dataset selection through classifier training and deployment). This is the biggest single chunk of work in the curriculum.

**Month 5:** Phase 2C recommender (`B2C.14`–`B2C.18`) + Phase 3 starts. Phase 3 evals for the classifier are the natural next step because you just produced the model.

**Months 6–7:** Phase 3 full eval harness + Phase 4 (recommend Path C).

**Month 8:** Phase 5.

**Ongoing:** Side track, flashcards, reincodes vizzes during interview windows.

Open-ended timing. Proof artifacts are the gate.

---

## What this curriculum does *not* cover

- **Training transformers from scratch** — low ROI
- **Fine-tuning LLMs** — covered conceptually; add Phase 6 with QLoRA if a specific role requires it
- **Deep neural networks for pose** — Phase 2C uses classical models (LR, GBT) for honesty about scope. Sequence models (Tier 3) are an optional later phase.
- **Kubernetes, deep MLOps** — Phase 5 covers application-layer + on-device. Server-side ML serving (TF Serving, Triton) is out of scope.
- **Image generation, diffusion models** — out of scope

---

## Status tracker

| Phase | Anchor | Concept | Build | Proof |
|---|---|---|---|---|
| 1. LLM foundations | loopd + aipe | [ ] | [ ] | [ ] |
| 2A. RAG — personal corpus | loopd | [ ] | [ ] | [ ] |
| 2B. RAG — project context | aipe | [ ] | [ ] | [ ] |
| 2C. Classical ML pipeline | contrl-mo | [ ] | [ ] | [ ] |
| 3. Evals (LLM + ML) | all three | [ ] | [ ] | [ ] |
| 4. Agents | path A/B/C | [ ] | [ ] | [ ] |
| 5. Production (LLM + ML) | loopd + contrl-mo | [ ] | [ ] | [ ] |
| Side track | reading | [ ] | — | — |
| Flashcards | IK Q&A | [ ] | — | — |
| Interview prep | reincodes | — | [ ] | — |
