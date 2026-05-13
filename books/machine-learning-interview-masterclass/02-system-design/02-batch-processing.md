# Chapter 2.2 — Batch Processing Systems

**IK Section II, Module 2.** Reading time: 22 minutes.

> Online processing serves the user's last request. Batch processing computes what the user will see for their next request — overnight, on terabytes, with hours of latency budget. Different deadline, different architecture, same engineering instincts.

## When to reach for batch

A system uses batch processing when:

- The output is needed periodically, not on demand. (Yesterday's analytics.)
- The input is large enough that real-time processing would be expensive. (All-user feature recomputation.)
- The latency budget allows hours. (Tonight's recommendations for tomorrow.)
- The job is restartable. (Crash, rerun.)

Examples: search index building (Google), recommendation model retraining (Netflix), nightly billing computation (Stripe), social graph analytics (Facebook).

The interview shape is the same as online (clarify, architecture, deep-dive, scale, tradeoffs), but the components are different: distributed file systems, map-reduce, external sort-merge, batch schedulers.

## Inverted index — the foundational data structure

The inverted index is what makes search engines work. It's a map from terms to the documents containing them.

```
Documents:
  doc1: "the cat sat on the mat"
  doc2: "the dog ran across the yard"
  doc3: "the cat and the dog met"

Forward index (doc → terms):
  doc1: [the, cat, sat, on, the, mat]
  doc2: [the, dog, ran, across, the, yard]
  doc3: [the, cat, and, the, dog, met]

Inverted index (term → docs):
  the:    [doc1, doc2, doc3]
  cat:    [doc1, doc3]
  sat:    [doc1]
  on:     [doc1]
  mat:    [doc1]
  dog:    [doc2, doc3]
  ran:    [doc2]
  across: [doc2]
  yard:   [doc2]
  and:    [doc3]
  met:    [doc3]
```

To search "cat dog," intersect the postings lists: `[doc1, doc3] ∩ [doc2, doc3] = [doc3]`.

Building an inverted index over a billion documents is a classic batch problem. You can't fit the whole thing in memory. You can't write to one machine. You need map-reduce.

## External sort-merge

Before map-reduce, the foundational batch primitive is external sort — sorting data that doesn't fit in memory.

```
Input: a 100GB file you can't load into 16GB of RAM.

External sort:

  1. Read chunks that DO fit (~10GB).
  2. Sort each chunk in memory.
  3. Write the sorted chunk to disk as a "run."
     (After this step: 10 sorted runs of 10GB each.)
  4. Merge the runs.

Merge step:
  Open all runs.
  Keep one element from each in a min-heap.
  Pop the smallest; emit it; advance that run.
  Continue until all runs are exhausted.

  Memory: heap of size k (where k = number of runs).
  Time: O(N log k) for the merge phase.
```

K-way external sort-merge generalizes: when k is so large that even k heap entries don't fit, you do it in passes — merge groups of √k runs at a time, repeat.

This is the engineering pattern behind all of these:

- **Sorting a 100GB log file for analysis.**
- **Joining two large tables that don't fit in memory.**
- **De-duplicating a billion records.**
- **Building an inverted index** (you sort `(term, doc_id)` pairs by term, then group).

If you've ever piped a giant log through `sort -m` from chunked files, you've used external sort-merge.

## Distributed file systems

You can't run external sort-merge on one machine forever. Beyond a certain scale you need data distributed across many machines, and you need a coordination layer.

```
Hadoop Distributed File System (HDFS) — the canonical example.
Google File System (GFS) — the model HDFS copies.

Architecture:

  ┌────────────────┐
  │ Name node       │  Single metadata store. Maps filename →
  │ (single)        │  block locations. Crashes if it dies.
  └─────────────────┘
           │
   ┌───────┼────────┐
   ▼       ▼        ▼
  ┌──┐    ┌──┐     ┌──┐
  │D1│    │D2│     │D3│   Data nodes. Each holds blocks
  └──┘    └──┘     └──┘   (default 128MB chunks).
                          Replicated 3× across nodes.

Properties:
  Write-once, read-many.   (You don't update files in place.)
  Streaming reads.         (Large sequential I/O, not random.)
  Block-level replication. (3 copies on different racks.)
  Fault tolerance.         (Data node death → re-replicate from copies.)
```

Modern alternatives: S3, Google Cloud Storage, Azure Blob. They're not technically distributed file systems but they fill the same role — object storage, designed for the same access patterns, with similar replication.

For interview purposes, name HDFS or S3 as the substrate for any batch system. Don't roll your own.

## Map-reduce

The framework that made batch processing tractable for non-PhDs.

```
The shape of every map-reduce job:

  Input → Map → Shuffle → Reduce → Output

  Map step:
    For each input record, emit (key, value) pairs.
    Stateless. Parallelizable across input chunks.

  Shuffle step:
    Group all values by key. Send to reducers.
    The most expensive step (network-heavy).

  Reduce step:
    For each key, take the list of values, produce output.
    One reducer per key (or partitioned hash of keys).
```

Concrete example: word count.

```
Input: a 100GB text file.

Map:
  For each line, for each word, emit (word, 1).
  Output: many (word, 1) pairs.

Shuffle:
  Group all (word, 1) pairs by word.
  Send to reducers.

Reduce:
  For each word, sum the 1s.
  Emit (word, count).

Total: word counts over 100GB of text.
```

The pattern: any aggregation that's commutative and associative can be parallelized this way. Sum, count, average (via sum + count), max, min, set union — all map-reduce-friendly.

The harder pattern: joins. You can join two tables in map-reduce by emitting `(join_key, ('A', row))` from one map and `(join_key, ('B', row))` from the other, then combining in the reducer. Network-expensive but works.

Modern descendants: Spark, Flink, Beam. Same shape, better performance, better APIs. For interviews, name map-reduce as the conceptual primitive and Spark as the modern tooling.

## Distributed sorting

```
Sort a dataset that's bigger than one machine can hold:

  1. Partition by range.
     Sample data, pick range boundaries that divide it evenly.
     Range 1: keys < A. Range 2: A ≤ keys < M. Range 3: M ≤ keys.

  2. Each mapper reads its input chunk, emits records partitioned
     by destination range.

  3. Each reducer receives all records in its range.

  4. Each reducer sorts its range internally (external sort if
     even one range doesn't fit in memory).

  5. Output: each reducer writes a sorted output file.
     Concatenated, the files form a globally sorted dataset.

Total: O(N log N) work, distributed across many machines.
       Network bottleneck: the shuffle step.
```

Hadoop's TeraSort benchmark runs exactly this algorithm.

## Building an inverted index with map-reduce

The full pattern in one diagram:

```
Input: billions of documents.

Map (one per document):
  For each term in the document, emit (term, doc_id).
  Output: (term, doc_id) pairs.

Shuffle:
  Group by term.

Reduce (one per term):
  Receive all (term, doc_id) pairs for one term.
  Build the postings list: [doc_id_1, doc_id_2, ...].
  Optionally compress.
  Emit (term, postings_list).

Output: the inverted index.
```

This is how Google indexed the web in the early 2000s. The architecture has evolved, but the bones are identical.

## The case studies

The IK module walks four batch case studies. Each is a complete system design.

### Search engine

The full picture: crawler → indexer → query serving. The batch parts are crawling (continuous, but each crawl is a batch job) and indexing (build the inverted index nightly).

Components:

- **Crawler:** distributed BFS over the web graph. Polite delays per host. URL frontier in a distributed queue.
- **Storage:** raw HTML in distributed file storage.
- **Indexer:** map-reduce job over crawled docs producing the inverted index.
- **Query path:** online, takes a query, hits the index shards, ranks, returns.

The senior probe: "how do you keep the index fresh?" Differential index — a small "live" index for recent crawls, merged into the main index nightly. Same pattern as a database WAL.

### Graph processor

Compute properties of a graph too big for one machine. Examples: PageRank, connected components, community detection.

The pattern (Pregel, Google's framework that inspired GraphX/Spark): **think like a vertex.** Each iteration, every vertex receives messages from neighbors, computes its new state, sends messages to neighbors for the next iteration. Bulk Synchronous Parallel (BSP) model.

```
Iteration K:
  For each vertex in parallel:
    1. Receive messages from previous iteration.
    2. Update local state.
    3. Send messages to neighbors.
  Barrier: wait for all vertices.
  Iteration K+1.
```

PageRank as vertex computation:

```
Each page (vertex) has a rank.
Each iteration, a page sends rank/N to each of its N outgoing links.
Each iteration, a page receives the sum of incoming ranks.
Damping factor handles convergence.

Run until ranks converge (deltas below threshold).
```

For interviews: name BSP, name Pregel as the canonical framework, walk PageRank as the example.

### Typeahead suggestions

Build the data structure for autocomplete: as the user types "ne...", instantly return "netflix, netflix shows, network engineer, ..."

The data structure: **trie**. Each node represents a prefix; leaves represent words.

```
       (root)
      /   |   \
     n    p    s
     |    |    |
     e    o   ...
     |    |
     t    r
     |    |
     f    t
     ...
```

Each leaf stores the popularity (count of past searches). At query time, descend the trie by the typed characters, then return the top-K leaves under that node.

Building: map-reduce over query logs, count each query, build the trie offline, deploy to query-serving nodes.

Scale concerns: trie size (compress with double-array trie or DAWG), shard by first few chars, refresh nightly.

### Recommendation system

This is the bridge to Section III of the IK course (the ML masterclass). Recommenders are taught as batch systems first (build user-item embeddings overnight, serve online from precomputed lookups), then upgraded to online inference.

Two main approaches (covered properly in Chapter 3.2):

- **Content-based:** recommend items similar to ones the user has engaged with. Item embeddings, user history embedding, cosine similarity.
- **Collaborative filtering:** find similar users, recommend items they liked.

Batch part: train the model overnight on yesterday's interactions. Build user-item score matrix. Index for fast lookup.

Online part: at request time, look up the user's row in the matrix, return top-K scoring items.

## How interviewers probe batch system design

Three layers:

1. **Surface:** "Design word count over a terabyte of text." Tests whether you reach for map-reduce.
2. **Standard:** "Design a search engine." Tests whether you walk the full batch+online pipeline, naming crawler/indexer/serving.
3. **Twist:** "How does your search engine handle freshness — what changes if I want results to reflect tweets posted in the last 5 seconds?" Tests whether you can layer a streaming system over the batch system. The answer is: build a small streaming index for recent docs, merge into the main batch index periodically. Lambda architecture.

The third-layer probe is increasingly common as streaming has become standard. Be ready.

## Lambda architecture — the bridge to streaming

```
Input data
  │
  ├──→ Batch layer:    full historical processing, slow but exact
  │                    (e.g., daily index rebuild)
  │
  └──→ Speed layer:    recent data, fast but approximate
                       (e.g., last hour's tweets in a small live index)

Serving layer:
  Combines results from batch + speed layers.
  At query time, hits both, merges.
```

Twitter's search system was the canonical lambda example. Modern systems often replace lambda with **kappa architecture** — everything through the streaming layer, batch reduced to occasional reprocessing.

## The Interview Move

> *"For this batch system, I'd start by sizing the data. With X TB of input and Y hours of latency budget, I'd reach for map-reduce on top of distributed file storage like HDFS or S3. The map step would emit (key, value) pairs partitioned for the shuffle; the reduce step would aggregate per key. The bottleneck is the shuffle — that's where the network gets pounded. If freshness mattered, I'd layer a streaming system on top — kappa or lambda — to keep recent data hot while the batch handles the long tail. Let me walk the data flow."*

Pattern named (map-reduce on HDFS). Bottleneck named (shuffle network cost). Adjacent pattern named (lambda / kappa for freshness). Then you walk the system. That's senior batch system design.

Next chapter: stream processing. Where the latency budget shrinks from hours to seconds and the architecture changes again.
