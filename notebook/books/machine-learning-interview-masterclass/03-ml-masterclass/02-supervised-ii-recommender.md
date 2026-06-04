# Chapter 3.2 — Supervised Learning II: Design a YouTube Video Recommendation System

**IK Section III, Module 2.** Reading time: 30 minutes.

> Recommenders are the largest ML systems on Earth, by user count and by revenue. Netflix says 75% of viewed content comes from recommendations. YouTube says similar. Spotify says similar. If you can defend a recommender system design, you can defend any production ML.

## The prompt

> "Design a video recommendation system for YouTube. The user opens the app; you return a list of N videos personalized to maximize engagement."

The phrase "maximize engagement" is loaded. Engagement-maximizing recommenders pushed YouTube into trouble in 2017-2020 — they got too good at finding the most-watched content, which turned out to be conspiracy theories and outrage. Modern YouTube optimizes for a multi-objective function: watch time *and* user satisfaction *and* content diversity *and* creator long-term success. The interview-shape version is simpler; you optimize a proxy metric like "predicted watch time conditional on click."

## The architecture

```
User context (history, profile)
  │
  ▼
┌──────────────────────────────────┐
│ Candidate generation             │
│  Reduce M videos → ~1000         │
│  Multiple sources                │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Ranking                          │
│  Predict engagement per          │
│  (user, candidate) pair          │
└──────────────┬───────────────────┘
               │
               │  top-N
               ▼
┌──────────────────────────────────┐
│ Re-ranking / business rules      │
│  Diversity, freshness, fairness, │
│  cold-start fallback             │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Serving + impression logging     │
└──────────────┬───────────────────┘
               │
               ▼
            N videos shown
```

Same shape as search ranking: retrieve (here called "candidate generation"), rank, then layer business rules on top. This is a universal pattern in industrial-scale ranking systems.

The difference from search: in search, the user provides the query. In recommendations, the system invents the query — implicitly, from the user's profile and context.

## Candidate generation — `[how do we reduce M to 1000?]`

YouTube has ~1B videos. You can't rank every video against every user. Candidate generation reduces the search space.

Three sources contribute candidates:

```
Source 1 — Content-based:
  Find videos similar to ones the user has engaged with.
  Use item embeddings; KNN over recent positive items.

Source 2 — Collaborative filtering:
  Find videos that users similar to this user have engaged with.
  "Users like you watched these."

Source 3 — Editorial / contextual:
  Trending, recently uploaded, regional popular,
  follow-graph (subscribed channels' latest videos).
```

Each source returns 200-500 candidates. Merge with deduplication. Send the union (~1000-2000 unique) to the ranking stage.

## Content-based filtering

```
Build item embeddings — each video becomes a vector.
  Sources of signal:
    - Video metadata (title, description, tags, category)
    - Audio/visual features (transcribed audio, frame embeddings)
    - Co-engagement patterns (videos watched in sequence)

Build user representation from history:
  - Average of recent positive items' embeddings, OR
  - Learned user encoder over history sequence

To recommend:
  Compute similarity (user_vector, item_vector) for candidates
  Return top-K most similar.

Pros: Works for cold-start items (new videos with content features).
      Interpretable: "we recommended this because you watched X."

Cons: Recommends within the user's existing taste — filter bubble.
      Limited cross-pollination between niches.
```

## Collaborative filtering

```
Construct user-item interaction matrix:
            video1  video2  video3  video4  ...
  user1     1                1
  user2     1       1
  user3             1                1
  user4     1                1
  ...

  (1 = positive engagement, blank = no signal)

Factor the matrix into user and item latent factors:
  M ≈ U × V^T

  where U is users-by-K, V is items-by-K, K=64 or 128.

To recommend for user u:
  Compute u's row in U.
  Score all items: u • V.
  Return top-K.

Pros: Captures behavior patterns that content can't.
      "People who bought this also bought."

Cons: Cold-start: new users have no rows; new items have no columns.
      Requires N×M matrix, sparse but huge.
```

## Matrix factorization

The standard algorithm for collaborative filtering. The IK module asks about it.

```
Problem: factorize R (user-item ratings) into U (user factors) and V (item factors)
         such that U × V^T ≈ R.

Approach: gradient descent.

  Initialize U and V with random values.
  For each known (user, item, rating) in R:
    predicted = U[user] • V[item]
    error = rating - predicted
    U[user] += learning_rate * error * V[item]
    V[item] += learning_rate * error * U[user]
  Repeat until convergence.

Add regularization:
  Loss += λ * (||U||² + ||V||²)
  This shrinks factors toward zero, prevents overfitting.

Modern: implicit feedback variant (ALS — alternating least squares)
        for click/view data instead of explicit ratings.
```

## Feature engineering, data collection, encoding

The IK module emphasizes "feature engineering, data collection, encoding, embeddings" as a cluster. They're all about turning raw signals into model inputs.

```
Feature types in a recommender:

  User features (static):
    - Demographics: age, country, language
    - Account age, premium subscription, device type

  User features (dynamic):
    - Recent watch history (sequence of video IDs)
    - Average session length last week
    - Time-of-day patterns
    - Days since last visit

  Item features (static):
    - Category, language, length
    - Upload date
    - Creator ID, creator quality score

  Item features (dynamic):
    - View count (with time decay)
    - Like ratio, comment ratio
    - Watch-completion rate

  Cross features:
    - Does user's history contain similar videos?
    - User's affinity to this creator
    - Time-of-day match (was the video posted at user's usual viewing time?)

  Context features:
    - Current time, current device, current geographic location
    - Whether the user just opened the app or has been browsing
```

Encoding strategies:

- **Categorical features** (category, country): one-hot or embedding lookup.
- **Numerical features** (length, count): normalize (z-score or min-max) or bucketize.
- **Sequence features** (watch history): aggregate (mean of embeddings) or sequence model (LSTM, transformer).
- **Cross features:** explicit cross (multiply one-hot of category × one-hot of country) or factorization machines.

## SVM on non-linear data

The IK curriculum calls out SVM as a fundamental topic. Quick coverage:

```
SVM idea: find the hyperplane that maximally separates classes.

For linearly separable data:
  The hyperplane is wᵀx + b = 0.
  Margin = distance from hyperplane to nearest point.
  SVM finds w, b maximizing margin.

For non-linear data:
  Use the "kernel trick":
    Map x → φ(x) into a higher-dimensional space where
    the classes become linearly separable.
  Common kernels: polynomial, RBF (Gaussian), sigmoid.

  The math conveniently lets you compute the kernel value
  K(x_i, x_j) = φ(x_i) • φ(x_j) without materializing
  the high-dim space.

In 2026:
  SVMs are rarely used in production for large-scale recommenders.
  GBT and neural nets dominate.
  But: SVMs are useful for small structured datasets, anomaly
  detection (one-class SVM), and they're interview-asked.
```

## Random forest feature selection

```
Random forest: ensemble of decision trees, each trained on a
               random subset of features and a bootstrap sample
               of data. Final prediction: average of trees.

Feature importance:
  For each feature, measure how much the tree's predictions
  change when this feature is permuted (broken).
  Features that cause big drops in accuracy are important.

In practice:
  Train a random forest.
  Rank features by importance.
  Drop bottom 30% of features.
  Retrain with the reduced feature set.

Use for: feature selection on tabular data, identifying which
         signals matter, building interpretable baselines.
```

## Bias-variance tradeoff

The single most-asked ML fundamentals question after "what is supervised learning."

```
Bias:     the model's tendency to underfit.
          High-bias model: simple, can't capture the true pattern.
          Example: linear regression on non-linear data.

Variance: the model's tendency to overfit.
          High-variance model: complex, memorizes noise.
          Example: deep neural net with too few training samples.

The tradeoff:
  Total error = (bias)² + variance + irreducible_error

  Simpler models → high bias, low variance.
  Complex models → low bias, high variance.
  The sweet spot is in between.
```

```
           Error
             │
             │   .         .
             │    .       /
             │     .     /
             │     bias   /
             │       .   /  variance
             │         . /
             │          ◊   ← optimal complexity
             │         / .
             │        /   .
             │_______/_____.___________  Model complexity →
              underfit   sweet spot   overfit
```

How to reduce bias: more complex model, more features, less regularization.
How to reduce variance: more data, simpler model, more regularization, ensembling.

In an interview: "I'm seeing high training accuracy and low validation accuracy. That's high variance / overfitting. I'd add regularization, reduce model complexity, or get more data." Or: "high training error AND low validation error close to it — that's high bias. I'd add features or a more expressive model."

## Ensemble methods

```
Bagging (bootstrap aggregation):
  Train N models on N bootstrap samples (sample with replacement).
  Average their predictions.
  Reduces variance.
  Example: random forest.

Boosting:
  Train models sequentially. Each model focuses on errors of the previous.
  Sum weighted predictions.
  Reduces bias and variance.
  Example: AdaBoost, gradient boosting (XGBoost, LightGBM).

Stacking:
  Train multiple diverse base models.
  Train a meta-model on the base models' predictions.
  Highest accuracy, slowest inference.

In recommenders:
  Boosting (LightGBM) is the dominant tabular model.
  Deep neural nets are used when you have sequence features or large data.
  Random forest is the strong baseline.
```

## Objective function optimization

Recommenders are trained to optimize a specific objective. What you optimize matters more than how you optimize.

```
Common objectives:

  Click prediction:
    Loss = binary cross-entropy on click/no-click.
    Optimizes for: probability the user will click.
    Risk: clickbait wins. Doesn't predict satisfaction.

  Watch time prediction:
    Loss = weighted cross-entropy or regression.
    Optimizes for: predicted watch time conditional on click.
    Risk: long videos win even when not really better.

  Multi-objective:
    Loss = α * click + β * watch_time + γ * satisfaction_signal
    Optimizes for: weighted combination.
    More aligned with business goals, harder to tune.
```

This is one of the deepest topics in recommenders. The choice of objective shapes what the system learns. Watch-time optimization gave YouTube the early 2010s; multi-objective is the modern frame.

## Positional bias, freshness, diversity, fairness

The four concerns that come up in every recommender interview:

```
Positional bias:
  Position 1 gets clicked at higher rate regardless of content.
  Naive training learns "rank doesn't matter, position matters."
  Fix: inverse propensity scoring (IPS) — weight each click
       by the inverse of the position's expected CTR.

Freshness:
  Old items have accumulated more interaction data, get ranked higher
  by default. New items can't compete.
  Fix: freshness boost in the re-ranking layer, or include
       "days since upload" with negative weight.

Diversity:
  Model finds the "best" item and recommends similar items
  for the next slots. User sees 5 cooking videos in a row.
  Fix: diversity constraint in re-ranking — penalize too-similar
       items, ensure category mix per recommendation set.

Fairness:
  Recommender amplifies a few creators, leaves the long tail
  unrecommended. Hurts creator ecosystem.
  Fix: exploration quota — every recommendation set includes
       at least one less-popular item to keep the funnel open.
```

These four are non-negotiable for senior interview signal. Memorize their names; be ready to walk each one's mitigation.

## Cold start

Three kinds:

```
New user (no history):
  Demographic prior (recommend popular-among-people-like-this).
  Onboarding questions ("what do you like?").
  Exploration phase: surface diverse content to learn user preferences.

New item (no interactions):
  Content-based candidates: similar items by metadata or content embeddings.
  Editorial boost: feature the item to a small audience to bootstrap signal.

New system (no data yet):
  Start with rules. Switch to learned model after data threshold.
  Common for contrl-mo (single user, sparse data).
```

## How interviewers probe recommender design

Three layers:

1. **Surface:** "Walk me through a YouTube recommendation request." Tests retrieve → rank → re-rank.
2. **Standard:** "Compare content-based and collaborative filtering for this domain." Tests whether you can name when each wins.
3. **Twist:** "How do you handle a new creator who just joined and has uploaded 5 videos with no views yet?" Tests cold-start strategies and exploration / exploitation tradeoffs.

The third layer is the bar for senior at companies like Netflix, Meta, Spotify.

## The case study walk for a senior interview

**Functional requirements:**
- Personalized N (=10) video recommendations per request.
- Updated within hours of new user activity.
- Handle 100M DAUs, 1B videos.

**Non-functional requirements:**
- p99 latency < 200ms for the recommendation call.
- Throughput: 100k QPS during peak.
- Freshness: new videos appearing within 1 hour of upload.

**Architecture:**

```
At request time:
  User context (last N watches, profile) →
    Candidate generation (3 sources):
      - Content-based: ANN over item embeddings
      - Collaborative: lookup in user-item matrix
      - Editorial: trending list
    → 1000 candidates

  Ranking model (LightGBM or DNN on features) →
    top-100 by predicted watch time

  Re-ranking:
    - Diversity: no 3 same-category in a row
    - Freshness: boost <24-hour-old by factor F
    - Fairness: ensure 1 long-tail item per response

  Return top-10
```

**Offline pipeline:**

- Daily: rebuild item embeddings (content-based). Retrain matrix factorization (collaborative).
- Hourly: update user history vectors. Recompute trending list.
- Per minute: stream new uploads into the candidate pool.

**Scale concerns:**

- Candidate generation index sharded by item hash; replicas for QPS.
- Ranking model served from GPU or CPU depending on architecture.
- Cache user history at request time (Redis), with TTL.

**Failure modes:**
- Cold start (above).
- Filter bubble (mitigated via diversity).
- Position bias (IPS in training).
- Distribution shift (PSI monitoring → retrain trigger).

## The Interview Move

> *"I'd design YouTube recommendations as a three-stage system: hybrid candidate generation from content-based + collaborative + editorial sources, ranking by a LightGBM or DNN model predicting watch time, then re-ranking with diversity, freshness, and fairness constraints. Training data comes from impression logs with click and watch-time labels; position bias corrected via inverse propensity scoring; cold-start handled by demographic priors for users and content-based candidates for items. The candidate index shards by item hash; the ranking model serves from cached user-history features at request time. I optimize for predicted watch time conditional on click, with diversity and fairness as re-ranking constraints rather than loss terms — because losses get gamed and constraints are interpretable. Let me walk the architecture."*

Eighteen seconds. Covered candidate generation, ranking, re-ranking, training pipeline, debiasing, cold-start, infrastructure pattern, and optimization philosophy. That's senior recommender system design.

Next chapter: unsupervised learning. Fraud detection at Airbnb — the chapter where you don't have labels.
