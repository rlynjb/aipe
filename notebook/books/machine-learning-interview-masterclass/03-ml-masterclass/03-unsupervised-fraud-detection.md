# Chapter 3.3 — Unsupervised Learning: Detect Fraud Transactions for Airbnb

**IK Section III, Module 3.** Reading time: 25 minutes.

> Unsupervised learning is what you reach for when you don't have labels — or more often, when you don't have *enough* labels. Fraud is the canonical example: by the time you have ground truth ("this account was fraudulent"), you've lost money, and you want a system that flags the fraud before it completes.

## The prompt

> "Design a fraud detection system for Airbnb. Detect fraudulent transactions before they complete; minimize false positives that block legitimate users."

The structural twist that makes fraud different from search and recommenders:

```
Search ranking, recommenders:
  Plentiful positive signal (clicks, views).
  Train supervised models on labeled engagement.

Fraud detection:
  Sparse labels (you only know fraud after it's reported).
  Lots of negative examples (legitimate transactions).
  Adversarial domain — fraudsters adapt to your model.
  Cost asymmetry: false positives anger users; false negatives
                  lose money.
```

The combination of sparse labels and adversarial actors is why fraud uses **multiple signals layered together**, not one big model. Modern fraud stacks combine rules, supervised classification, anomaly detection, and graph analysis.

## High-level architecture

```
Transaction submitted
  │
  ▼
┌─────────────────────────────────────┐
│ Feature aggregation                 │
│  - User features (account age,      │
│    past transactions, history)     │
│  - Listing features (host, price,   │
│    reviews)                        │
│  - Context features (IP, device,    │
│    time, location)                 │
└──────────────────┬──────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌──────────────┐
  │ Reputation│ │ Rules  │ │ ML scoring   │
  │ lists    │ │ engine │ │ - Supervised  │
  │ (known   │ │        │ │ - Anomaly det.│
  │  bad IPs,│ │        │ │               │
  │  emails) │ │        │ │               │
  └─────┬───┘ └────┬───┘ └──────┬────────┘
        │          │            │
        └──────────┼────────────┘
                   ▼
        ┌─────────────────────┐
        │ Decision aggregator │
        │ - Combine signals   │
        │ - Risk score 0-100  │
        └──────┬──────────────┘
               │
        ┌──────┴───────┐
        ▼              ▼
    Block          ┌─ Allow ─┐
    transaction    │         │
                  ▼          ▼
            Manual review   Approve
            queue           transaction
                  │
                  ▼
            Labeled feedback →
              feeds training data
```

The pattern: cheap-and-fast checks first (reputation lists, rules), slow-and-expensive checks (ML, graph analysis) for the cases that pass the cheap layers. Then aggregate to a risk score; thresholds decide block / approve / review.

## Reputation lists — `[the cheapest layer]`

```
Known bad signals:
  - Stolen credit card numbers (from CC fraud reports)
  - Known fraudster emails / IPs (industry-shared lists)
  - Devices linked to past fraud
  - Listing URLs scraped from blacklists

Implementation:
  Bloom filter or hash set lookup in <1ms.
  Updated continuously from fraud-team reports.

Limitation:
  Catches only known patterns. New fraud rings start at zero
  reputation and fly through this layer.
```

## Rules-based detection — `[the second cheapest]`

```
Hand-coded rules:
  - Transaction amount > $X with account age < Y days
  - User just changed email + immediate large transaction
  - Listing has fewer than 3 reviews + price 5× area average
  - IP and shipping country don't match user's profile country
  - Multiple transactions from same device in <1 hour

Each rule fires a flag. Aggregate flags into a risk increment.

Pros: Fast. Interpretable. Easy to update when fraud-team
      identifies a new pattern.

Cons: Doesn't catch novel fraud. Rules are gamed.
      Maintenance overhead.
```

Rules are **never replaced** by ML; they're complemented. Even the most sophisticated fraud systems run rules first because:
- Rules are explainable to compliance/legal.
- Rules respond instantly to new threats (no retrain needed).
- Rules catch obviously-bad cases without spending ML compute.

## Classification vs clustering

The IK module hammers this distinction.

```
Classification (supervised):
  You have labels. "This transaction was fraud. This wasn't."
  Train a model that, given features, predicts P(fraud).

  Use for: known fraud patterns with enough labeled data.
  Examples: LightGBM, logistic regression with hand-tuned features.

Clustering (unsupervised):
  You don't have labels. Group transactions by similarity.
  Look for outliers — small clusters or far-from-cluster points.

  Use for: novel fraud, unknown patterns, sparse-label situations.
  Examples: K-means, DBSCAN, isolation forest.

In a real fraud system, both run. Supervised catches known patterns;
clustering surfaces anomalies that supervised never saw.
```

## Anomaly detection — `[the unsupervised arm]`

```
Approach 1 — Isolation forest:
  Build many random trees that recursively split the data.
  Outliers are easier to isolate — they need fewer splits.
  Score each point by average isolation depth.
  Low score = anomalous.

  Pros: Works in high dimensions. Fast.
  Cons: Doesn't capture local density patterns.

Approach 2 — Autoencoder:
  Train a neural net to reconstruct its input.
  Train only on normal data; the model learns "normal" patterns.
  At inference, reconstruction error is high for anomalies.

  Pros: Captures complex non-linear patterns.
  Cons: Requires normal-only training data, lots of compute.

Approach 3 — Density-based (DBSCAN, LOF):
  Cluster the data; mark low-density points as anomalies.

  Pros: Interpretable. Finds clusters of fraud too.
  Cons: Slow on large data. Sensitive to density parameters.

Approach 4 — One-class SVM:
  Find the hyperplane separating "normal" from "everything else."

  Pros: Theoretically sound.
  Cons: Slow on large data. Sensitive to hyperparameters.
```

For Airbnb-scale fraud, **isolation forest is the workhorse** for cheap anomaly scoring. Autoencoders are used for deeper detection on the suspicious subset.

## High-level architecture details

```
Layer 1 — Real-time feature aggregation:
  Stream of transactions through Kafka.
  Compute features per transaction:
    - User's recent activity (windowed counts)
    - Listing's recent metrics
    - Velocity features (transactions per minute)
  Sub-100ms.

Layer 2 — Scoring:
  Reputation list check (1ms)
  Rule engine (5ms)
  ML scoring (50ms)
  Aggregate to risk score.

Layer 3 — Decision and action:
  Risk score > T_block: block immediately, notify fraud team.
  Risk score > T_review: allow but queue for manual review.
  Risk score < T_review: approve.

Layer 4 — Feedback loop:
  Fraud team labels reviewed transactions.
  Labels feed back into training data for next model.
  Model retrains weekly or when drift is detected.
```

## Computation speed optimization

Fraud scoring is in the critical request path — every transaction goes through it before completing. Latency budget is tight (sub-200ms total, ideally sub-50ms for the synchronous part).

Optimizations:

- **Async scoring for low-risk-profile transactions.** Pre-screen based on cheap rules; only run the expensive ML on the medium-risk subset.
- **Feature caching.** User features change slowly; cache and refresh asynchronously. Velocity features (real-time counts) need fresh computation.
- **Model distillation.** Train a large model offline; distill to a smaller model for inference.
- **Pre-computed risk scores.** For long-tail users with stable patterns, cache the recent risk score and only recompute on signal change.

## Dendrograms from agglomerative clustering

The IK module specifically calls out dendrograms. Quick coverage:

```
Agglomerative (hierarchical) clustering:

  Start: each point is its own cluster.
  Repeat:
    Find the two closest clusters.
    Merge them.
  Continue until one cluster contains everything.

  The merging history forms a tree (dendrogram).

         ●─────────────
        / \
       /   ●─────────
      ●   / \
     / \ /   ●───
    ●  ● ●  / \
            ●  ●

  Cut the dendrogram at a horizontal level to get K clusters.

Pros: Doesn't require pre-specifying K (cut the tree where you want).
      Reveals hierarchical structure.

Cons: O(n³) without optimization. Too slow for million-row datasets.
      Better for exploratory analysis, not production scale.
```

Use for: fraud pattern exploration. Cluster recent suspicious transactions and look for tight sub-clusters — those are likely a coordinated fraud ring.

## Dimensionality reduction — `t-SNE vs PCA`

The IK module asks about this distinction. It's a frequent interview question.

```
PCA (Principal Component Analysis):
  Linear. Finds directions of maximum variance.
  Preserves global structure.
  Reduces N dimensions → K dimensions (K << N).

  Use for: feature compression, decorrelation, visualization
           (when global geometry matters).

t-SNE (t-distributed Stochastic Neighbor Embedding):
  Non-linear. Preserves local structure.
  Points that are close in high-D stay close in 2D/3D.
  Points that are far in high-D may be artificially placed
  in 2D — global distances are misleading.

  Use for: visualization (when local clusters matter),
           exploration. Not for downstream ML — it's a
           visualization tool, not a feature extractor.

UMAP:
  Modern alternative to t-SNE. Faster, sometimes better.
  Same use cases.
```

The interview move: "PCA preserves global variance and is suitable as a feature compressor. t-SNE preserves local neighborhoods and is suitable for visualization only — its distances aren't meaningful between distant clusters."

## Combining supervised and unsupervised

Real systems run both arms. The patterns:

```
Pattern 1 — Cascading:
  Anomaly detector flags suspicious transactions.
  Flagged transactions go to supervised classifier for verdict.

Pattern 2 — Parallel + ensemble:
  Both run. Risk scores are combined (weighted sum, or
  a meta-model trained on both outputs).

Pattern 3 — Unsupervised as feature engineering:
  Cluster transactions; use cluster ID as a feature in the
  supervised model.
  Anomaly score becomes a feature alongside hand-engineered ones.

Pattern 4 — Active learning:
  Anomaly detector surfaces unfamiliar transactions to humans.
  Human labels become training data for the supervised model.
  The unsupervised arm is a label-acquisition strategy.
```

Pattern 4 is the most senior answer. The unsupervised arm doesn't just detect — it strategically surfaces uncertainty for human labeling.

## The case study walk

**Functional requirements:**
- Score every transaction in <50ms before completing it.
- Block obvious fraud, queue suspicious for review.
- Adapt to new fraud patterns within hours of detection.

**Non-functional requirements:**
- Throughput: 10k transactions/sec peak.
- False positive rate < 0.1% (legitimate users shouldn't be blocked).
- False negative rate measured by recovered chargebacks.

**Architecture:**

```
Real-time:
  Transaction → feature aggregator → multi-layer scoring →
    decision aggregator → block / review / approve

Offline / batch:
  Daily: retrain ML model on labels collected from review queue
         and chargebacks
  Weekly: cluster recent suspicious transactions for pattern discovery
  Continuously: update reputation lists from external feeds
```

**Data model:**

- Transaction table: `{id, user, listing, amount, timestamp, IP, device, features}`
- User profile: `{id, account_age, transaction_history_summary, recent_velocity}`
- Listing profile: `{id, host, age, reviews, complaints}`
- Reputation: bloom filters or hash sets of bad signals.
- Model registry: trained models with versions, training data snapshots, eval metrics.

**Scale concerns:**

- Feature aggregator: stream processor on Kafka. Sharded by user_id.
- ML inference: deployed on GPU for autoencoder, CPU for simpler models.
- Decision aggregator: stateless, replicated.

**Failure modes:**

- **Concept drift.** Fraud patterns change. Retraining cadence + drift detection (PSI) on input features.
- **Adversarial gaming.** Fraudsters figure out your rules. Combine with ML so they can't game both.
- **Cold start for new fraud rings.** Anomaly detection is what catches these — supervised only knows past patterns.
- **Class imbalance.** Fraud is rare (<1%). Macro-F1 as the eval metric, not accuracy.

## How interviewers probe fraud system design

Three layers:

1. **Surface:** "How do you detect fraud?" Tests whether you list rules + ML + reputation as a layered system.
2. **Standard:** "How does your design handle a new fraud ring that's never been seen?" Tests anomaly detection + active learning.
3. **Twist:** "False positives are killing your conversion. What do you change?" Tests whether you can tune thresholds, defer to human review, change the model objective to weight FP higher than FN.

The third layer is where senior signal lives. Cost-asymmetric ML is the production reality of fraud, and most candidates don't think about it.

## The Interview Move

> *"For Airbnb fraud, I'd build a four-layer system: reputation lists at the front (microsecond lookups), rule-based detection (millisecond evaluation, for known patterns and policy), supervised classifier (predict P(fraud) on features from user history and transaction context), and anomaly detection (isolation forest for novel patterns the supervised model never saw). Risk scores aggregate to a decision threshold: block, queue, or approve. The queue feeds back into training data via human labels — that's the active learning loop that adapts the system. False positives are weighted heavier than false negatives in the loss, because blocking a legitimate user is more expensive than allowing one fraudulent transaction through. Drift on input features triggers retraining. The system handles novel fraud through the anomaly arm and policy adjustments at the rules layer; supervised catches up over the next week as labels accumulate."*

You named four arms. You named active learning. You named cost asymmetry. You named drift handling. That's senior fraud detection design.

Next chapter: deep learning. Object detection — the canonical CV interview question.
