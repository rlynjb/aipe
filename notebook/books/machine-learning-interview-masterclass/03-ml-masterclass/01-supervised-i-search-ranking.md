# Chapter 3.1 — Supervised Learning I: Rank Relevant Search Results

**IK Section III, Module 1.** Reading time: 30 minutes.

> The Google Search relevance question is the canonical ML system design interview. If you can walk it cleanly — from query to ranked results, with model choices and metrics — you've passed the ML-system-design loop at any FAANG.

## The prompt

> "Design a search ranking system. The user types a query; the system returns the top-k most relevant items from a corpus."

A "corpus" can be anything: web pages, products, support articles, JIRA tickets, your own journal entries. The system shape is the same.

## The high-level architecture

This is the diagram you draw on a whiteboard in 60 seconds:

```
Query
  │
  ▼
┌──────────────────────────────────┐
│ Query understanding              │
│  (tokenize, expand, rewrite)     │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ Document retrieval                │
│  (inverted index + embeddings)    │
│  Returns: top-N candidates        │
└──────────────┬───────────────────┘
               │
               │  N candidates (N=500)
               ▼
┌──────────────────────────────────┐
│ Ranking                          │
│  (learned model, features +      │
│   relevance score)               │
└──────────────┬───────────────────┘
               │
               │  top-k (k=10)
               ▼
┌──────────────────────────────────┐
│ Serving + logging                │
└──────────────┬───────────────────┘
               │
               ▼
            Results
```

Two stages: **retrieve** (fast, broad), then **rank** (slow, precise). This pattern is universal in search and recommenders — get a small candidate set quickly, then spend more compute ranking just those.

## Stage 1: Document indexing and retrieval

You already saw the inverted index in Chapter 2.2 (batch). Search retrieval is the online query path against that index.

```
Inverted index (term → docs with that term):
  apple:   [doc1, doc5, doc23, doc47, ...]
  iphone:  [doc1, doc12, doc23, doc56, ...]
  ...

Query "apple iphone":
  Intersect postings lists:
    [doc1, doc5, doc23, doc47] ∩ [doc1, doc12, doc23, doc56]
    = [doc1, doc23]

Return doc1 and doc23 as candidates.
```

Two enhancements every senior interview expects:

**TF-IDF for relevance scoring.** Not all terms are equally valuable. "the" appears everywhere; "iphone" doesn't. Score each (term, doc) pair by:
```
TF (term frequency):     how often this term appears in this doc
IDF (inverse document frequency): how rare this term is across the corpus

Score = TF × IDF

A doc with high TF and high IDF for a query's terms is more relevant.
```

**BM25 as the modern TF-IDF.** Same idea, normalized for doc length and tuned parameters. The standard for keyword-based retrieval since the 1990s.

**Embedding-based retrieval (added in the 2020s).** Embed the query and each document into a vector space. Retrieve by cosine similarity. Catches semantic matches that keyword retrieval misses ("auth bug" finds "login broken").

**Hybrid retrieval (current best practice).** Combine BM25 + embeddings with Reciprocal Rank Fusion. BM25 catches exact terms, embeddings catch paraphrases.

## Stage 2: Ranking

After retrieval narrows to ~500 candidates, ranking sorts those by predicted relevance.

```
Inputs per (query, doc) pair:
  - Query features:       text length, complexity, intent
  - Doc features:          page rank, freshness, click history
  - Query-doc features:    BM25 score, embedding similarity,
                          title-query match, body-query overlap

Output:
  Predicted relevance score (typically 0-1 or 0-5)

Sort candidates by predicted score, return top-k.
```

This is the model. The model is supervised — trained on labeled data where "labeled" means "for this query and this doc, was the doc clicked, dwelled on, satisfied the user?"

## Linear and logistic regression — `[the bread-and-butter rankers]`

The IK curriculum teaches these as the foundation, and for good reason: they're the simplest models that work, and **most production rankers used them before deep learning took over**. Google's original PageRank-era ranking was largely linear in engineered features.

**Linear regression** (for regression problems — predict a continuous value):

```
Predicted score = w_0 + w_1*x_1 + w_2*x_2 + ... + w_n*x_n

where:
  x_i are features (BM25 score, freshness, etc.)
  w_i are learned weights

Training: minimize squared error against labels.
Inference: dot product of weights and features. Fast.
```

**Logistic regression** (for classification — predict probability of a class):

```
Predicted probability = sigmoid(w_0 + w_1*x_1 + ... + w_n*x_n)

The sigmoid squashes the linear output into [0, 1].

Use for: "will the user click this doc?" (binary).
Training: minimize cross-entropy loss.
Inference: same dot product, then sigmoid. Fast.
```

Why these models still matter in 2026:

- **Interpretable.** Each weight is the contribution of one feature. You can explain why doc A ranked above doc B.
- **Fast.** Dot product of 50 features in a microsecond. Critical when serving millions of queries per second.
- **Easy to debug.** Trained-model behavior is the linear combination of features. Bug in the model = bug in one weight; you find it.
- **Strong baseline.** Anyone who replaces LR with deep learning should be required to demonstrate the LR baseline first.

## L1 and L2 regularization

The IK module specifically calls these out. Memorize the distinction.

```
L2 regularization (ridge):
  Loss = squared_error + λ * sum(w_i^2)

  Penalizes large weights. Tends to shrink all weights
  toward zero without making any exactly zero.

  Use when: many features, all roughly relevant.

L1 regularization (lasso):
  Loss = squared_error + λ * sum(|w_i|)

  Penalizes the L1 norm. Tends to drive some weights
  to exactly zero — feature selection happens automatically.

  Use when: many features, some are noise. You want a
  sparse model.

Elastic net:
  Combines L1 + L2 with a mix parameter.
  Best of both: shrinks all weights, zeros out some.
```

The geometric intuition (graph it once and you'll remember forever):

```
The unregularized loss has a minimum at some weight vector.

L2 adds a circular constraint around the origin.
The regularized minimum sits at the intersection of
the loss contour and the circle. It tends to be slightly
inside the circle — all weights non-zero, all shrunk.

L1 adds a diamond-shaped constraint around the origin.
The regularized minimum often sits AT a corner of the
diamond — where multiple weights are exactly zero.
This is why L1 produces sparse models.
```

In an interview: "I'd use L2 by default. I'd switch to L1 if I had hundreds of engineered features and wanted automatic feature selection."

## Imbalanced datasets

The minority of clicks among all impressions. The minority of fraud among all transactions. The minority of relevant docs among all candidates. **Imbalance is the norm in ML problems**, and naive training crushes it under the majority class.

```
Example: 1M training examples.
         100 are positive (clicked relevant).
         999,900 are negative (not clicked).

Naive training: model learns "always predict negative."
                Accuracy: 99.99%. Useless.

Mitigations:
  - Class weights:     penalize positive errors more.
  - Downsampling:      keep all positives, sample a subset of negatives.
  - Upsampling/SMOTE:  duplicate or synthesize positives.
  - Focal loss:        loss function that focuses on hard examples.
  - Threshold tuning:  predict positive at a lower probability cutoff.
```

For search ranking, **downsampling negatives** is the standard pattern. You have far more "the user didn't click this doc" than "the user did." Sampling 1-in-100 negatives gets you a balanced training set without losing positive signal.

## K-nearest neighbors (KNN)

The IK curriculum touches KNN as a fundamental. It's worth a paragraph.

```
KNN classifier:
  To predict class of a new point:
    1. Find the K closest points in the training set.
    2. Take a majority vote of their labels.
    3. Return that label.

  No training. All computation at inference time.

  Distance metric: Euclidean (default), cosine, Manhattan.
  K: hyperparameter. Too small → noisy. Too large → over-smoothed.

Use for: small datasets, baseline classifier, when interpretability
         ("here are the 5 most similar past examples") matters.

Don't use for: production at scale (inference is O(N) per query
               without indexes), high-dimensional data
               (curse of dimensionality).
```

KNN connects to embedding-based retrieval — find K nearest in vector space is a KNN query. ANN (approximate nearest neighbors, e.g., HNSW, FAISS) makes it scale to millions of vectors.

## Online testing and A/B evaluation

You trained the model offline. Is the new model actually better in production?

```
A/B test setup:

  Random 50% of queries → arm A (control, old model)
  Random 50% of queries → arm B (treatment, new model)

  Run for two weeks. Collect online metrics:
    Click-through rate (CTR)
    Dwell time (post-click)
    Bounce rate
    Query reformulation rate

  Compare arms. Statistical test: t-test or proportion test.
  If treatment beats control by significant margin → ship.
```

Pitfalls to know:

- **Novelty effect.** New ranker performs better at first because users are curious. Plateaus over weeks.
- **Simpson's paradox.** Treatment is better on every sub-population but worse in aggregate due to traffic imbalance. Check both.
- **No-click is not a negative label.** Just because the user didn't click doc 3 doesn't mean doc 3 was bad. Maybe they got their answer from doc 1's snippet.
- **Position bias.** Position 1 gets 30% CTR regardless of relevance. Doc at position 5 with 5% CTR might actually be more relevant than position-1 with 30%. Inverse propensity scoring fixes this.

## The case study walk

In an interview, walk this for "design Google Search relevance":

**Functional requirements:**
- User types a query, gets ranked results in <200ms p99.
- Handle billions of queries per day.
- Handle dozens of languages.
- Handle freshness (news from minutes ago should rank).

**Non-functional requirements:**
- Availability: 99.99% uptime.
- Latency: p99 < 200ms.
- Throughput: 100k QPS peak.

**High-level architecture:**

```
Query
  │
  ▼
Query understanding
(tokenize, spelling correct, expand synonyms, detect intent)
  │
  ▼
Retrieval
  Inverted index shards (sharded by term hash)
  Embedding index shards
  Returns top-N candidates from each shard
  Merge: ~5000 candidates
  │
  ▼
First-stage ranking
(fast linear model over candidates → top-500)
  │
  ▼
Second-stage ranking
(slower model, more features → top-100)
  │
  ▼
Third-stage re-ranking
(cross-encoder or learned-to-rank → top-10)
  │
  ▼
Diversification, freshness boost, business rules
  │
  ▼
Final 10 results
```

This three-stage ranking is real. Google's actual stack has more stages. The principle: each stage is more expensive than the last, and only the survivors make it through.

**Data model:**
- Inverted index per term: postings list (doc_id, TF, position).
- Doc metadata: page rank, freshness, language, click history.
- Embedding index: ANN structure (HNSW) over doc embeddings.
- Click log: per-query, per-position, clicked-or-not, dwell time.

**Scale concerns:**
- At ~100M docs: index fits on one machine. Beyond, shard.
- At ~1k QPS: cross-encoder rerank for top-500 is too slow. Cache or distill.
- Index freshness: nightly batch + streaming layer for last 24 hours.

**Failure modes:**
- **Stale index.** Doc edited but not re-indexed. Fix: re-embed on edit, version embeddings.
- **Cold queries.** Query never seen before. Fix: fall back to lexical retrieval.
- **Position bias in training.** Always-position-1 doc dominates clicks. Fix: IPS weighting.
- **Lost-in-the-middle for downstream RAG.** Mid-ranked docs ignored by LLM. Fix: surface top-3 only or reorder.

## The features-list cheatsheet

When the interviewer asks "what features does your ranker use?", be ready with this list:

```
Query features:
  - Query length (tokens)
  - Query complexity (entropy, unique terms)
  - Detected intent (informational, navigational, transactional)

Document features:
  - Page rank / inbound link count
  - Freshness (timestamp)
  - Language match with query
  - Domain authority
  - Click-through rate from past queries

Query-doc features (the load-bearing ones):
  - BM25 score
  - Embedding cosine similarity
  - Title overlap with query
  - Body overlap with query (TF-IDF weighted)
  - URL contains query terms
  - Doc length normalized by avg in corpus

User features (when personalized):
  - User's past click history
  - User's location, time of day
  - User's language preference

Context features:
  - Time of day, day of week, season
  - User's device type
```

50-100 features is typical for a production ranker. Learned-to-rank models scale to thousands.

## How interviewers probe search ranking

Three layers:

1. **Surface:** "Walk me through how a search query becomes ranked results." Tests whether you can name retrieve → rank.
2. **Standard:** "What features go into your ranker?" Tests whether you've thought about feature engineering vs end-to-end models.
3. **Twist:** "How would your design change if you needed to support 10× more documents?" Tests sharding strategy, index size management, retrieval bottleneck identification.

## The Interview Move

> *"For search ranking, I'd use a two-stage architecture: hybrid retrieval (BM25 + embeddings, fused with RRF) for the top-500 candidates, then a learned-to-rank model — linear or LightGBM — on engineered query/doc/query-doc features for the final top-10. I'd start with logistic regression because it's interpretable and fast; if quality required it I'd upgrade to GBT. L2 regularization by default to control over-fitting; L1 if I needed feature selection. Training data comes from click logs with position bias corrected via inverse propensity scoring. Online evaluation is A/B with the standard metrics — CTR, dwell, no-click guards. Index shards by term-hash with replicas for QPS scaling. The failure modes I'd watch for are stale indexes, cold queries, and position bias drift. Let me walk the architecture in detail."*

That paragraph is one minute long. It hits every box. It names the model, the features, the regularization, the eval, the scaling pattern, the failure modes. Then you walk the architecture. That's senior ML system design.

Next chapter: the YouTube recommender. Same retrieval+ranking pattern, different application, more interesting features.
