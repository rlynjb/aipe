# Machine Learning Interview Masterclass — The Book

A book-form companion to Interview Kickstart's [Machine Learning Interview Masterclass](https://learn.interviewkickstart.com/course/machine-learning-interview-masterclass#curriculum), written for one specific reader: a frontend engineer with 8+ years in a data center, pivoting toward AI Engineer / ML Engineer roles at FAANG.

The IK course has five sections, taught over ~16 weeks of live classes plus 6 months of mock-interview support. This book is one chapter per topic, written the way a senior engineer at Google or Meta would explain it to you over coffee — direct, opinionated, anchored in production systems you've actually used.

## How to read

1. Read [00-preface.md](00-preface.md) once. It frames the rest.
2. The DSA section is foundation: read it in order. Even if you've done LeetCode, the FAANG-style framing in these chapters is the gap.
3. System design and ML masterclass are co-equal — read whichever feels weaker first. They cross-reference each other.
4. Career coaching is short and ships last.

Every chapter ends with **The Interview Move** — the sentence you'd say to a senior interviewer that converts the work into signal. Memorize those.

## Table of contents

### Preface

- [00-preface.md](00-preface.md) — target reader, why IK, how this book maps to the course

### Section I — Data Structures and Algorithms

5 chapters, ~5 weeks of IK live classes.

- [01-dsa/01-sorting.md](01-dsa/01-sorting.md) — asymptotic analysis, sorting algorithms, divide & conquer
- [01-dsa/02-recursion.md](01-dsa/02-recursion.md) — recursive functions, backtracking, exhaustive enumeration
- [01-dsa/03-trees.md](01-dsa/03-trees.md) — hash tables, BSTs, traversals, BFS and DFS patterns
- [01-dsa/04-graphs.md](01-dsa/04-graphs.md) — graph modeling, storage, traversal, interview templates
- [01-dsa/05-dynamic-programming.md](01-dsa/05-dynamic-programming.md) — overlapping subproblems, memoization, tabulation

### Section II — System Design

3 chapters, ~3 weeks of IK live classes.

- [02-system-design/01-online-processing.md](02-system-design/01-online-processing.md) — client-server, scaling, load balancing, CAP, sharding, caching. Case studies: URL shortener, Instagram, Uber, Twitter, chat
- [02-system-design/02-batch-processing.md](02-system-design/02-batch-processing.md) — inverted index, external sort-merge, distributed file systems, map-reduce. Case studies: search engine, graph processor, typeahead, recommendations
- [02-system-design/03-stream-processing.md](02-system-design/03-stream-processing.md) — stream processing patterns. Case studies: APM, social graph, Netflix, Google Maps, trending topics, YouTube

### Section III — Machine Learning Masterclass

6 chapters, ~5 weeks of IK live classes. Each module is a production ML system design problem.

- [03-ml-masterclass/01-supervised-i-search-ranking.md](03-ml-masterclass/01-supervised-i-search-ranking.md) — design Google-style search relevance with linear/logistic regression
- [03-ml-masterclass/02-supervised-ii-recommender.md](03-ml-masterclass/02-supervised-ii-recommender.md) — design YouTube's recommendation system: content-based, collaborative filtering, matrix factorization
- [03-ml-masterclass/03-unsupervised-fraud-detection.md](03-ml-masterclass/03-unsupervised-fraud-detection.md) — design Airbnb fraud detection: anomaly detection, clustering, supervised+unsupervised hybrid
- [03-ml-masterclass/04-deep-learning-i-object-detection.md](03-ml-masterclass/04-deep-learning-i-object-detection.md) — design an object detection system: CNNs, R-CNN, YOLO, transfer learning
- [03-ml-masterclass/05-deep-learning-ii-chatbot.md](03-ml-masterclass/05-deep-learning-ii-chatbot.md) — design a tech support chatbot: embeddings, knowledge base, cold start, continuous learning
- [03-ml-masterclass/06-additional-topics.md](03-ml-masterclass/06-additional-topics.md) — modern ML architectures, discriminative vs generative, reinforcement learning primer

### Section IV — Career Coaching

- [04-career-coaching.md](04-career-coaching.md) — interview strategy, behavioral prep, offer negotiation

## Voice and conventions

- **Names are real.** Real company systems (Google's PageRank, Netflix's Cinematch, Meta's News Feed, Anthropic's Sonnet 4) are named where they illustrate the pattern.
- **Numbers are concrete.** "At 100k QPS" beats "at scale." "$3 per million tokens" beats "expensive."
- **Hedging is banned.** If something is a tradeoff, the cost is named. If it's the wrong choice, the chapter says so.
- **Anchors are explicit.** Where applicable, examples reference the reader's three active codebases (loopd / aipe / contrl-mo). Where the reader hasn't built that surface yet, the chapter says so honestly.

Reading time per chapter: 15–25 minutes. Reading the whole book: ~6 hours. The IK course runs ~16 weeks; this book is the written substrate underneath those live classes.
