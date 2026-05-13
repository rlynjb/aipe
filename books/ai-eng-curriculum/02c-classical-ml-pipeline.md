# Chapter 2C — Classical ML Pipeline

**Phase 2C of the curriculum.** Primary project: contrl-mo's form classifier and progression recommender. Reading time: 30 minutes.

> Most candidates have consumed pre-trained models. They've never trained one. This chapter is the one that, when you've finished the work, separates you from 80% of resumes that look superficially similar to yours.

## Why this chapter is the long one

Classical supervised ML is the most under-represented skill in modern AI engineering candidates. Everyone has called an OpenAI API. Almost nobody has labeled data, trained a model from scratch, debugged a 0.42 minority-class F1, deployed it on-device, and watched it drift over six months.

That gap is your opportunity. **contrl-mo** — your bodyweight-progression coaching app with on-device MediaPipe pose detection — is the rarest shape on the three-codebase resume. The form classifier is the centerpiece: a real trained model that takes pose-landmark time-series and outputs labels like `good_form`, `elbow_flare`, `incomplete_depth`, `back_arch`, `hip_sag`.

This is the chapter that fully maps to **IK Modules 1, 2, 3** — supervised classification, recommender systems, imbalanced data. If you can defend the contrl-mo pipeline end-to-end, you'll pass an IK-style ML system design interview at Google, Meta, or any company hiring ML engineers in 2026.

---

## The pipeline, in one diagram

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Data → Features → Train/Val/Test → Model → Deploy  │
│   │        │            │             │       │     │
│   ▼        ▼            ▼             ▼       ▼     │
│  Raw     Engineered   Split        Trained  Quantized│
│  labeled per-rep      session-     weights  on-device│
│  inputs  features     level                          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Five stages. Each one has failure modes that matter more than the model choice. The candidate who only argues about LR vs XGBoost without thinking about the upstream four stages is the candidate who gets a 0.42 F1 and doesn't know why.

---

## Stage 1: Data — `[C2C.1]`, `[B2C.1]`, `[B2C.4]`, `[B2C.5]`

**Where does labeled data come from?** This is the first question and most teams underestimate it.

You have two sources:

**Public datasets.** MM-Fit, Fit3D, MMA-Pose. These are labeled pose-landmark sequences from various fitness datasets, with annotations that *sometimes* overlap with your exercise set. They were collected in a studio, on professional subjects, with multiple cameras. Free, large, but distribution-mismatched to your real users.

**Self-labeled data.** You record your own sessions on your phone, in your living room, with the contrl-mo app's audit trail (`[B2C.4]`, drawn from your spec §13). The audit trail logs every landmark sequence and every phase transition into local SQLite. Then you build a labeling tool (`[B2C.5]`) that walks each rep window, plays it back, and prompts you to label `good_form` or one of the failure modes.

This is real work. A few hundred labeled reps per exercise across five exercises is a few thousand labels. A weekend of labeling once the audit trail is shipped.

```
Public dataset            Self-labeled
  (large)                   (small)
     │                         │
     ▼                         ▼
  10k+ reps               ~500 reps
  Studio conditions       Living room, your camera
  Wide diversity          One subject (you)
     │                         │
     └─────────┬───────────────┘
               │
               ▼
       Domain-gap problem
       (you'll measure it)
```

The instinct from the data center: you know that synthetic load tests don't match production traffic. Real packets at real volumes do unexpected things. Public datasets are synthetic load tests for ML; self-labeled real-condition data is production traffic. Both are useful; the second one is non-negotiable for measuring the model's real-world performance.

---

## Stage 2: Feature engineering — `[C2C.2]`, `[B2C.3]`

This is where 60–80% of model quality is decided. Model choice contributes maybe 10%. Features are load-bearing.

The raw input is a sequence of pose landmarks: at each video frame, you have ~33 keypoints (left shoulder, right elbow, etc.) with X-Y coordinates and confidence values. A 4-second rep at 30fps is 120 frames × 33 landmarks × 3 values = 11,880 numbers. You can't feed that directly to a tabular classifier; the dimensionality is wrong, the temporal alignment is variable, and the absolute coordinates are camera-position-dependent.

**Feature engineering converts the variable-length, camera-dependent landmark sequence into a fixed-shape vector of human-interpretable numbers per rep.**

```
Raw input (per rep):
  Landmark sequence, 120 frames × 33 keypoints

                 │
                 ▼ feature extraction
                 │

Engineered features (per rep, fixed length):

  peak_elbow_angle:        78.2 degrees   ← at deepest point
  trough_elbow_angle:     142.5 degrees   ← at top
  range_of_motion:         64.3 degrees   ← peak - trough
  asymmetry_l_r:            4.1 degrees   ← left vs right elbow
  time_to_bottom:           0.81 seconds  ← descent phase length
  avg_angular_velocity:    88.5 deg/sec
  shoulder_hip_alignment:   0.92          ← normalized stability
  ... 15-20 features per rep ...
```

Why this matters at interview:

1. **Real features come from domain knowledge.** A non-fitness person would not have thought to compute "asymmetry between left and right elbow angles" as a feature — but for pushup form classification, that asymmetry is the single most predictive signal for elbow-flare failure mode. The fitness domain knowledge ate the ML.
2. **Features make the model interpretable.** With engineered features, a feature-importance plot tells you "elbow angle asymmetry contributed 31% of the prediction." With raw landmarks fed to a deep model, you get a black box.
3. **Features are how you handle domain gap.** Studio vs phone, different camera angle, different lighting — these change *coordinates*, not *angles*. Angles between joints are invariant to camera position. Coordinates aren't.

Build item `[B2C.3]`: ship the feature extraction pipeline. Document each feature, what it measures, why it's there. The output is JSONL of `{rep_id, features: [...], label}` rows ready for training.

The interview move: *"My feature set has 18 engineered features per rep — joint angles, angular velocities, ROM, asymmetries, temporal aggregates. I picked angles over raw coordinates because angles are camera-position invariant; raw coordinates would tie the model to my specific phone setup. I added asymmetry features after I noticed elbow-flare reps had detectable left-right asymmetry of 4–10 degrees while clean reps stayed under 2. The features encode my domain knowledge of what bad form looks like."*

---

## Stage 3: Train / val / test split discipline — `[C2C.3]`, `[B2C.9]`

This is one of the two stages where junior candidates get a 0.92 train accuracy and a 0.55 test accuracy and don't know why.

The naive split is row-level random. Mix all your reps, shuffle, 70/15/15. **That's wrong.** Here's the failure mode:

```
WRONG — random row-level split:

  Session A reps:
    rep 1 → train
    rep 2 → val
    rep 3 → test
    rep 4 → train

  Problem: reps from the same session leak signal across splits.
  Same lighting, same camera angle, same form patterns.
  The model memorizes session-specific quirks, then "tests"
  on the same quirks. Test score is inflated. The model
  collapses on real new data.
```

The right split is at the unit your model encounters as new at inference time. For session data, that's session-level:

```
RIGHT — session-level split:

  Session A → train
  Session B → train
  Session C → val
  Session D → test

  No reps from the same session in different splits.
  Test set is genuinely held out.
```

This single discipline is the difference between a model that ships and a model that publishes inflated metrics and crashes in production. **Every ML system at Google does temporal or entity-level splits, never random row-level.** YouTube doesn't shuffle users across train/val/test; they keep users in the same split so the model can't memorize per-user habits.

The build (`[B2C.9]`) is to implement this and *document why a random split would leak*. Documentation is the interview artifact. When asked "how do you split your data," you say "session-level because reps from the same session share confounds — camera angle, lighting, my form pattern that day; a random split would let the model memorize those and inflate the test score." That's a sentence the average candidate cannot produce.

---

## Stage 4: Model selection — `[C2C.4]`, `[B2C.6]`, `[B2C.7]`

This is **IK Module 1 verbatim**. "Which performs better: logistic regression or gradient-boosted trees?" The right answer is: train both, compare on the same val set, pick the simpler one if quality is comparable.

```
┌──────────────────────┬──────────────────────────┐
│ Logistic Regression  │ Gradient Boosted Trees   │
│  (LR)                │  (LightGBM / XGBoost)    │
├──────────────────────┼──────────────────────────┤
│ Linear decision      │ Non-linear, captures     │
│ boundary             │ interactions between     │
│                      │ features                 │
├──────────────────────┼──────────────────────────┤
│ Coefficients are     │ Feature importances are  │
│ directly             │ available; less directly │
│ interpretable        │ interpretable            │
├──────────────────────┼──────────────────────────┤
│ Fast to train, fast  │ Slower to train, fast    │
│ to infer             │ to infer with care       │
├──────────────────────┼──────────────────────────┤
│ Few hyperparameters  │ Many hyperparameters     │
│                      │ (depth, lr, n_estimators)│
└──────────────────────┴──────────────────────────┘
```

The Phase 2C discipline is:

1. **`[B2C.6]`**: Train LR baseline. Per-class precision, recall, F1, full confusion matrix.
2. **`[B2C.7]`**: Train LightGBM. Same eval, same val set.
3. Compare. If LightGBM beats LR by >5% macro-F1, ship LightGBM. If the gain is smaller, default to LR for interpretability.

For contrl-mo's form classifier, my prediction is: **LightGBM will win by ~10–15% macro-F1**. Why? Because the features have non-linear interactions. Elbow angle by itself isn't predictive; elbow-angle-asymmetry *combined with* time-to-bottom *combined with* shoulder-hip alignment is. LR can't model those interactions without manual feature crosses. GBT does it automatically by splitting on combinations of features.

The interview move: *"I trained LR and LightGBM on the same train/val split. Macro-F1 jumped from 0.68 to 0.81 with GBT. The gain came from the model picking up that elbow asymmetry at peak combined with time-to-bottom under 0.5s strongly predicts incomplete-depth-with-flare. LR can't model that interaction without me writing the cross feature by hand. Worth the loss in interpretability because the failure modes are well-defined and predictable from feature importance plots."*

---

## Stage 5: Class imbalance — `[C2C.5]`, `[B2C.8]` (IK Module 3)

This is the second of the two stages where models silently fail.

In your data, most reps are `good_form`. Failure modes are rare. Your data distribution might be:

```
"good_form":      900 reps
"elbow_flare":     50 reps
"incomplete_depth":30 reps
"back_arch":       15 reps
"hip_sag":          5 reps
                  ───
                 1000 reps
```

A naive model trained on this data will learn "always predict good_form." That gets it 90% accuracy. **And it's useless** — the whole point is to flag bad form, and the model never flags anything.

```
Confusion matrix of a naive model:

         predicted →
         good  flare  depth  arch   sag
  good   900    0      0     0      0
  flare   50    0      0     0      0   ← every flare misclassified
  depth   30    0      0     0      0
  arch    15    0      0     0      0
  sag      5    0      0     0      0

  Accuracy: 90%  ← looks great!
  Macro-F1: 0.19 ← terrible!
  Recall on "sag": 0%
```

Mitigations:

- **Class weights** — penalize errors on rare classes more heavily during training. Tell the loss function "missing a hip-sag costs 100× missing a good-form."
- **Oversampling** — replicate rare-class examples in the training set.
- **SMOTE** — synthesize new examples by interpolating between existing rare-class points.
- **Focal loss** — automatic focus on hard examples without manual weight tuning.
- **Threshold tuning** — predict the rare class at a lower probability threshold (0.3 instead of 0.5).

For contrl-mo, ship `[B2C.8]` with and without class weights. Report results side by side. Document why macro-F1 is the metric, not accuracy. **Accuracy lies on imbalanced data.** Macro-F1 averages F1 across classes, equally weighted; it's honest.

This is IK Module 3 verbatim. The interview is straightforwardly:

> *"My form classifier has 5× class imbalance — most reps are clean. Without class weighting I get 90% accuracy and 0.19 macro-F1; the model just predicts good-form every time. With LightGBM + class_weight='balanced' I get 78% accuracy and 0.74 macro-F1 — that's the real number. I report macro-F1, per-class recall, and the full confusion matrix. Aggregate accuracy on imbalanced data is the lie of the field."*

---

## Domain gap — `[C2C.6]`, `[B2C.10]`

Public dataset training → your phone in your living room. The distribution shifts.

```
Training data: public dataset, professional gym,
                studio lighting, top-down camera,
                diverse body types

Inference data: your phone, in your living room,
                 side angle, dim lighting, just you

  ┌──────────────────────────────────────────────────┐
  │ Feature distribution shift                       │
  │                                                  │
  │          ┌── train distribution                  │
  │          │                                       │
  │   ▁▂▄▆██████▆▄▂▁                                 │
  │   ─────────────────► feature value               │
  │            │                                     │
  │            ▁▂▄▆██▆▄▂▁                            │
  │            │                                     │
  │          ┌── inference distribution              │
  │                                                  │
  │  Model trained on left peak; fails on right peak │
  └──────────────────────────────────────────────────┘
```

The symptom is the classic: model performs great on val set, terrible in production. Public-data evals don't match self-labeled evals. Your test set was lying to you.

The fix is **transfer learning**: train on the large public dataset to get good general features, then fine-tune on a small self-labeled set to adapt to your real conditions.

```
Train on big public dataset
  Model learns general patterns
  Output: pretrained_model_v1
                 │
                 ▼  freeze most weights, fine-tune top
                 ▼
Fine-tune on small labeled set from your phone
  Model adapts to your camera angle, lighting, body
  Output: fine_tuned_model_v1
                 │
                 ▼
Deploy. Re-fine-tune as more data arrives.
```

For tabular classifiers like LightGBM, "transfer learning" is less standard but still applies: train on public data, then incrementally retrain on personal data. The model picks up patterns from public, then specializes via the personal data.

`[B2C.10]` is the disciplined measurement: report `Train-only-on-public → eval on personal: 0.62 F1`. Then `Train-on-public + fine-tune-on-personal → eval on personal: 0.78 F1`. That delta — 0.62 to 0.78 — is the domain-gap number. Naming it explicitly is the interview signal.

---

## On-device inference — `[C2C.8]`, `[B2C.12]`

You can't run a 200MB model on a phone in real time. You have to quantize and you have to budget.

```
┌──────────────────┬──────────┬───────┬─────────┐
│ Precision        │ Size     │ Speed │ Quality │
├──────────────────┼──────────┼───────┼─────────┤
│ FP32 (baseline)  │ 100%     │ 1×    │ 100%    │
│ FP16             │ 50%      │ 1–2×  │ ~99.9%  │
│ INT8             │ 25%      │ 2–4×  │ ~99%    │
│ INT4             │ 12.5%    │ 4–8×  │ ~95%    │
└──────────────────┴──────────┴───────┴─────────┘
```

For tabular GBT models, you'll likely ship FP16 or INT8 via ONNX Runtime Mobile or TF Lite. The latency budget for contrl-mo is `< 50ms per rep` because the UX is real-time form feedback. Measure inference latency on a real Pixel 7 (not a simulator) and document the number.

`[B2C.12]`: export the trained LightGBM to ONNX with int8 quantization. Integrate with the Android side of contrl-mo. Measure end-to-end latency from rep-detected to label-emitted. Target 50ms p95.

The interview move that opens doors: *"I quantized my LightGBM form classifier from 12MB to 3MB at int8, measured end-to-end latency at 38ms median, 47ms p95 on a real Pixel 7 across 200 reps spanning three exercises. Macro-F1 dropped 0.6 points from quantization — acceptable. If I needed sub-30ms I'd reach for a smaller variant or move to fp16; I haven't yet because the user-perceived latency budget is hit."*

That sentence is gold. Real number, real device, named tradeoff, named breakpoint. Most candidates can't say one of those things, let alone all four.

---

## The recommender — `[C2C.9]`, `[C2C.10]`, `[B2C.14]`–`[B2C.18]`

This is **IK Module 2 verbatim**. Contrl-mo recommends what exercise the user should do next.

The framing:

```
┌─ Content-based filtering ─────────────────┐
│  Recommend items similar to ones the user │
│  already liked. Uses item features only.  │
│  Works when: you know item attributes.    │
│  Fails when: items are sparse or generic. │
└───────────────────────────────────────────┘

┌─ Collaborative filtering ─────────────────┐
│  Recommend items liked by users similar to│
│  this user. Uses user-item interactions.  │
│  Works when: many users with overlapping  │
│  behavior.                                │
│  Fails when: cold-start (new user/item).  │
└───────────────────────────────────────────┘

┌─ Hybrid ──────────────────────────────────┐
│  Combine content and collaborative.       │
│  Modern recommenders are all hybrid.      │
└───────────────────────────────────────────┘
```

For contrl-mo's single-user case, **collaborative filtering doesn't apply** — you only have one user. The recommender is content-based + rules.

The build sequence:

1. **`[B2C.14]` Rule-based v1.** Pure deterministic logic. "If two clean sessions in a row, recommend next gate." "If elbow-flare recurring, recommend a regression." No model. Just rules. Ships in a day.
2. **`[B2C.15]` Learned recommender v2.** After a few months of sessions accumulate, build a classifier where features = recent sessions + gate state + form history, target = clean-session probability per candidate exercise. Rank candidates by predicted probability. This is a real ML system on top of the form classifier.
3. **`[B2C.16]` Cold-start.** New gate, no history yet → fall back to rule-based. Document the threshold.
4. **`[B2C.17]` Diversity / freshness.** Never recommend the same exercise 3 sessions in a row, even if the model says optimal. This is the classical recommender-systems patch — filter-bubble prevention.
5. **`[B2C.18]` A/B framing**, even single-user. Keep a control arm (rules only) and an experimental arm (learned). Log which arm produced each session. **You're A/B'ing the recommender against yourself.** This is IK Module 1 A/B framing without the user-scale problem.

The interview answer:

> *"My recommender for contrl-mo is hybrid: rule-based for cold-start (under five sessions on a new gate), learned after threshold. The learned arm is a LightGBM classifier ranking candidate exercises by predicted clean-session probability. I keep a diversity rule that prevents three same-exercise sessions in a row regardless of model output — pure classical-recommender filter-bubble defense. And I A/B the two arms against my own usage; I log which arm produced each session so I can compare clean-session rate over time. Single-user A/B sounds funny but the framing is identical — control vs treatment, log the assignment, compare the outcome."*

---

## Calibration — `[C2C.12]`, `[B2C.11]`

Most candidates skip calibration. It's where you measure whether your model's confidence scores are honest.

```
Reliability diagram:

  1.0 │              .                  ← perfect calibration
      │            .                   (model says 70% confident,
      │          .  ●                   it's right 70% of the time)
  0.8 │        .   ●
      │      .
      │    .       ●
  0.6 │  .
      │.       ●
  0.4 │    ●
      │
  0.2 │
      │
  0.0 └─────────────────────────────────►
      0.0    0.2    0.4    0.6    0.8    1.0
              Predicted probability

  ● = actual frequency in each prediction bucket
```

If the model says "70% confident" and is right 70% of the time, it's calibrated. If it says "70% confident" and is right 90% of the time, it's *under*-confident. If it says "70% confident" but is only right 50% of the time, it's *over*-confident — that's the dangerous case.

For contrl-mo, you use the probability score downstream. The coaching layer ranks exercises by predicted-clean-rep probability. If your model says "this rep is 80% likely good form" and the calibration is poor, the downstream coaching is wrong.

`[B2C.11]` plots the reliability diagram on val data. If miscalibrated, apply Platt scaling or isotonic regression — both are post-hoc adjustments that map raw scores to calibrated probabilities. Two lines of sklearn.

The interview move: *"I checked calibration on the form classifier's val set. LightGBM scores were under-confident at the high end and over-confident at the low end — classic GBT pattern. I applied isotonic regression as a post-hoc adjustment; reliability diagram flattens out, ECE drops from 0.08 to 0.02. Now when the coaching layer says '80% confidence' downstream, the user can trust that number."*

This is one of those answers that signals "I've actually deployed an ML model and watched what goes wrong." Most candidates haven't.

---

## The Tier-4 LLM coaching layer — `[B2C.13]`

The form classifier emits structured labels. The LLM turns those into natural-language coaching.

```
Form classifier:
  rep_1: { label: "elbow_flare", confidence: 0.82 }
  rep_2: { label: "good_form", confidence: 0.91 }
  rep_3: { label: "elbow_flare", confidence: 0.74 }
  ...

User history (last 5 sessions):
  3 of 5 sessions: ≥30% reps with elbow_flare

           │
           ▼  LLM call (Sonnet 4)
           │
           ▼

LLM output (Markdown coaching):
  "You've been flaring elbows on 3 of last 5 pushup sessions —
   try cueing 'tuck elbows toward hips' next set. If that doesn't
   change anything, drop to incline pushups for a session and
   focus on the cue with the reduced load."
```

This is the bridge between the classical ML output and the user-facing experience. The classical ML produces facts; the LLM produces guidance. They're separate concerns and they swap independently.

`[B2C.13]` ships this. Same provider abstraction as loopd. Same Zod schemas. This is also one of the **Phase 4 Path C agent** stepping stones — the orchestration of an ML tool inside an LLM workflow.

---

## The Phase 2C deliverables

Form classifier:
- [ ] `[B2C.1]` Public dataset surveyed and chosen.
- [ ] `[B2C.2]` Label schema (5 exercises × ~3–5 failure modes).
- [ ] `[B2C.3]` Feature extraction pipeline shipped.
- [ ] `[B2C.4]` Audit trail records landmark series + phase transitions.
- [ ] `[B2C.5]` CLI labeling tool walks rep windows, prompts for label.
- [ ] `[B2C.6]` LR baseline with confusion matrix.
- [ ] `[B2C.7]` LightGBM comparison documented.
- [ ] `[B2C.8]` Class imbalance handled, with/without weights documented.
- [ ] `[B2C.9]` Session-level split discipline, documented.
- [ ] `[B2C.10]` Domain-gap measured: public-only vs fine-tuned.
- [ ] `[B2C.11]` Calibration check + post-hoc adjustment.
- [ ] `[B2C.12]` On-device deployment, latency measured on real Pixel 7.
- [ ] `[B2C.13]` LLM coaching layer reads classifier output.

Recommender:
- [ ] `[B2C.14]` Rule-based v1.
- [ ] `[B2C.15]` Learned recommender v2.
- [ ] `[B2C.16]` Cold-start fallback.
- [ ] `[B2C.17]` Diversity / freshness rule.
- [ ] `[B2C.18]` Single-user A/B framing.

When all 18 ship, your resume has a thing that <5% of AI engineer candidates have: actual end-to-end supervised ML with real data, real evaluation, on-device deployment, and ongoing A/B.

---

## The Interview Move

> *"My form classifier in contrl-mo is the rarest shape on my resume: actual supervised learning end-to-end. I labeled ~500 reps of self-collected pose data on top of MM-Fit pretraining. Features are engineered angles, ROMs, asymmetries — invariant to camera position, interpretable as failure modes. I split at session level because a rep-level shuffle leaks; I trained LR baseline first then LightGBM, +13 macro-F1 on the interactions; I handled imbalance with class weights and report macro-F1 not accuracy; I measured the public→personal domain gap explicitly and closed it with fine-tuning; I checked calibration and applied isotonic regression to honest-up the probability scores; I quantized to int8 and measured 38ms median inference on Pixel 7; and the labels feed an LLM coaching layer that reads the last 5 sessions and produces natural-language cues. The recommender on top is rule-based until 5 sessions of cold-start data accumulate, then it's a learned classifier ranked by predicted clean-rep probability, with a diversity rule to prevent 3-in-a-row exercises, A/B'd single-user against the rules baseline."*

That's a ninety-second walk of an entire pipeline. Every clause is a build artifact. Every clause maps to an IK Module. This is the chapter that gets you in the room at Google and Meta for ML-leaning AI roles, not just LLM-application roles.

Next chapter: evaluation. The thing that ties this work together and tells you whether any of it is real.
