# Chapter 2.3 — Stream Processing Systems

**IK Section II, Module 3.** Reading time: 22 minutes.

> Stream processing is what you reach for when the latency budget is seconds, not hours, and the input is continuous, not finite. The interview shape adds two complications batch doesn't have: handling late-arriving data, and computing windowed aggregations correctly.

## When to reach for streams

A system uses stream processing when:

- The input is unbounded (events arriving continuously).
- The output is needed in seconds, not hours.
- The computation can be done incrementally per event.
- You care about recent state, not just historical aggregates.

Examples: real-time fraud detection (Stripe), trending topics (Twitter), application monitoring (Datadog), live recommendations (TikTok's "for you" page).

## The stream-processing pipeline

```
Producers → Message broker → Stream processor → Sinks
                  │                  │
                  │                  └─ writes to:
                  │                       - database
                  │                       - cache
                  │                       - downstream stream
                  │                       - alerting system
                  │
                  └─ examples: Kafka, Kinesis, RabbitMQ, Pub/Sub
```

The four components:

- **Producers:** services that emit events. Mobile apps, web servers, IoT sensors, microservices.
- **Message broker:** durable, ordered, partitioned event log. Kafka is the dominant choice.
- **Stream processor:** Flink, Spark Streaming, Kafka Streams, Beam. Consumes events, computes, emits.
- **Sinks:** where the processed results land. Often back into Kafka for downstream consumers.

## Kafka — the message broker pattern

Kafka is the most-asked-about message broker in system design interviews. Memorize its model.

```
Kafka concepts:

  Topic:        a named log. Producers write to it; consumers read from it.
  Partition:    a topic is split into partitions for parallelism.
                Each partition is an ordered, append-only log.
                One partition can only be read by one consumer in a group.
  Offset:       position in a partition. Consumers track their own offset.
  Producer:     writes events to a topic. Picks the partition (round-robin
                or by key hash).
  Consumer:     reads events from a topic. Consumer groups distribute partitions
                across consumers.
  Replication:  each partition has replicas (default 3) for durability.

Key properties:
  - Events are immutable. Once written, you can't change them.
  - Order is guaranteed within a partition, not across.
  - Replay is fundamental — consumers can re-read from any offset.
  - Retention is configurable — keep events for N days or N bytes.
```

The mental model: Kafka is a distributed, durable log. Producers append. Consumers read at their own pace. Multiple consumers can read independently.

The interview probe: "what's the difference between Kafka and a traditional message queue?" Answer: traditional queues (RabbitMQ) typically delete messages once consumed; Kafka retains them, allowing replay. Kafka scales horizontally via partitions; queues scale vertically.

## Windowing — the load-bearing concept

Stream processing aggregates over windows of time. Three window types matter:

```
Tumbling windows
  Fixed-size, non-overlapping.
  "Count events every 5 minutes."

  |---5min---|---5min---|---5min---|
  W1         W2         W3

Sliding windows
  Fixed-size, overlapping.
  "Count events in the last 5 minutes, updated every 1 minute."

  |--5min--|
       |--5min--|
            |--5min--|

Session windows
  Variable-size, based on activity gaps.
  "Group events into sessions; session ends after 30 minutes of inactivity."

  evt evt evt    [30min gap]    evt evt
  |- session 1 -|              |- session 2 -|
```

When to use which:
- **Tumbling:** non-overlapping reports. Daily counts. Hourly summaries.
- **Sliding:** smooth metrics. Moving averages. Trending topics.
- **Session:** user-behavior analysis. Where the natural unit of activity is "the period the user was active."

## Event time vs processing time

The single most-asked stream-processing concept, after windowing.

```
Event time:       when the event actually happened.
                  Encoded in the event itself.
                  Example: a click happened at 12:00:00.

Processing time:  when the event arrived at your stream processor.
                  Wall clock. Might be 12:00:00 or 12:00:03 (after
                  network and queue delay).

Late events:      events that arrive after processing has moved on.
                  Mobile app offline for 10 minutes, then syncs.
                  Event time is from 10 minutes ago; processing
                  time is now.
```

Real systems use event time, not processing time. Why? Because clocks aren't synchronized, networks have variable latency, and mobile clients sync late. If your hourly aggregate is computed by processing time, the 11:59:58 click that arrived at 12:00:03 ends up in the wrong hour.

**Watermarks** are how streams handle late events. A watermark says: "I've processed events up to event-time X. Any event with timestamp before X is considered late." When a watermark crosses a window's end, the window is finalized. Late events after that point are handled separately (dropped, sent to a side channel, or used to update the window if you allow lateness).

This is one of the parts of stream processing that gets candidates tangled. Practice explaining it: "event time is what time it happened; processing time is what time we got it; watermarks bridge the gap." If you can say that in one sentence, you've shown senior signal.

## Exactly-once semantics

The other load-bearing stream concept.

```
Three delivery guarantees:

  At-most-once:   each event processed 0 or 1 times.
                  Risk: data loss.

  At-least-once:  each event processed 1 or more times.
                  Risk: duplicates.

  Exactly-once:   each event processed exactly 1 time, even
                  across failures.
                  Risk: complexity. Requires idempotent processing
                  or transactional state management.
```

Real systems are usually at-least-once with idempotent operations. "Exactly-once" requires coordinated commits between the processor and the sink — Kafka Streams + Kafka Transactions, Flink's checkpoint mechanism, etc.

The interview probe: "how do you handle duplicates from at-least-once delivery?" Answer: make the processing idempotent. If the operation is "increment a counter," use the event's unique ID as a deduplication key (skip if already seen). If the operation is "send a notification," check whether you've already sent for this event ID.

## State management

Stream processors hold state — windowed aggregates, joining data from multiple streams, machine-learning model state. The state has to survive crashes.

Strategies:

- **Checkpointing:** periodically snapshot state to durable storage (S3, HDFS). On restart, restore from the latest checkpoint and replay events since then. Flink does this.
- **Changelog topic:** every state mutation is logged to Kafka. State is rebuilt by replaying the changelog. Kafka Streams does this.
- **External state store:** state lives in an external system (Redis, RocksDB). The processor is stateless from its own perspective.

Trade-offs: checkpointing has higher recovery latency but lower steady-state overhead. Changelogs are cheaper to maintain but slower to recover. External stores are the simplest mental model but add a network hop per operation.

## The case studies

The IK module walks several stream case studies. Each illustrates a different stream pattern.

### Application Performance Monitoring (APM, e.g., Datadog, New Relic)

The input: traces, spans, and metrics from instrumented applications.

```
App emits trace → Kafka → Stream processor → time-series DB
                            │
                            ├─ alert if p99 latency > threshold
                            └─ aggregate per-service stats
```

Key patterns:
- **Sampling:** can't store every trace at full fidelity. Sample 1-in-N, but keep all error traces.
- **Aggregation:** per-service p50, p95, p99 latency in sliding windows.
- **Alerting:** anomaly detection on the aggregated metrics; page someone when thresholds breached.

### Social connections graph (Facebook-scale friend recommendations)

The input: friend-add events, profile-view events, page-like events.

The pattern: maintain a real-time projection of the social graph in a graph database (or a partitioned hash store). On each event, update affected vertices. Periodically compute "people you may know" — DFS friends-of-friends, score by shared connections.

Scale concerns: 3B users, 200 average friends each = 600B edges. Sharded by user. Graph queries are mostly local (within 2 hops), so sharding by user works well.

### Netflix viewing patterns

The input: every play, pause, skip, complete event from every device.

```
Device → Kafka → Stream processor → multiple sinks:
                  │
                  ├─→ user viewing history (for "continue watching")
                  ├─→ recommendation feature store (updated continuously)
                  ├─→ content engagement metrics (per-show, per-hour)
                  └─→ A/B test event stream (which test arm, what behavior)
```

Patterns:
- **Multi-sink fan-out:** one input stream feeds many independent consumers.
- **Materialized views:** maintain a precomputed "continue watching" list per user as a stream-updated projection.
- **Real-time A/B:** the stream tags each event with which experiment arm the user is in, enabling continuous metric tracking.

### Google Maps live traffic

The input: GPS pings from phones running Google Maps.

The pattern: stream of `(lat, lng, timestamp, device_id)` events. Aggregate by road segment. Compute speed = distance / time per device per segment. Average across devices per segment per window. Surface as live traffic.

Scale: hundreds of millions of devices, billions of pings per hour. Partition by geographic region.

### Trending topics

The input: tweet/post events with hashtags.

The pattern: sliding window count of hashtags, ranked by surge (count this window compared to baseline). Top-K maintained in real time.

Watch for the **top-K problem** in interviews. You can't fully sort an unbounded stream, but you can maintain a small heap of the top-K. The Misra-Gries algorithm or Count-Min Sketch are approximate alternatives when memory matters.

### YouTube view count

Sounds simple. Isn't. Bots, replay attacks, view fraud at scale.

The pattern: events tagged with viewer ID, video ID, session ID. Stream processor counts views per video per window with deduplication (per-viewer-per-video within a session counts once). Anti-fraud layer filters bot-like patterns (too many views from one IP, too-fast viewing, etc.).

The senior probe: "how do you count views consistently for a video being watched by 100M people simultaneously?" Sharded counters, eventual consistency, sum across shards at read time. Or: sketches (HyperLogLog for distinct viewer count).

## Stream-batch coexistence — Lambda and Kappa

You saw lambda in the batch chapter. The picture:

```
Lambda architecture:
  Input
    │
    ├──→ Batch layer (overnight reprocess)
    └──→ Speed layer (real-time, approximate)
  Serving layer:
    Merges batch + speed at query time.

Kappa architecture:
  Input
    │
    └──→ Stream processor (one path)

  For "batch" reprocessing, replay the Kafka log
  from earlier offsets. No separate batch system.
```

Kappa wins when stream processing has caught up enough that you don't need a separate batch system. Kafka's long retention enables replay-as-batch. Modern recommendation pipelines (Twitter's Manhattan, LinkedIn's Pinot) are mostly kappa.

The interview move: name both. Defend a choice based on the scale and recompute needs of the specific system being designed.

## How interviewers probe stream system design

Three layers:

1. **Surface:** "Design a system to count tweet impressions." Tests whether you reach for Kafka + stream processor.
2. **Standard:** "Design real-time fraud detection for Stripe." Tests windowing, watermarks, exactly-once semantics, model inference in stream.
3. **Twist:** "What if events arrive late by hours because a mobile app was offline?" Tests whether you can describe watermarks, allowed lateness, and side outputs for very late data.

The third layer is the senior bar. Practice explaining watermarks until it's fluid.

## The data-center analog

You've watched sFlow / netflow streams in real time, sometimes for hours, looking for anomalies. The IK module is teaching you the same pattern at the application layer, with formal vocabulary (windows, watermarks, exactly-once) and modern tooling (Kafka, Flink).

The instinct of "watch the stream, aggregate over time, alert on threshold breach" you already have. It's just being mapped to a different stream.

## The Interview Move

> *"For a stream system at this scale, I'd use Kafka as the durable log and Flink as the processor. Events partition by user_id for ordering and parallelism. Windowed aggregations use event-time with watermarks; allowed lateness is 5 minutes, anything later goes to a side output for offline reconciliation. State is checkpointed to S3 every 30 seconds. Exactly-once is achieved through Flink's checkpoint protocol with Kafka transactions on the sink. The bottleneck is going to be the shuffle when joining streams; if that becomes a problem I'd reach for broadcast joins on smaller streams or denormalize at producer-side. Let me walk the pipeline."*

You named Kafka, you named the processor, you named the windowing strategy with watermarks and lateness, you named the consistency mechanism, you named the failure handling, you named the bottleneck and the workaround. That's senior streaming design.

Section II — System Design — complete. Three chapters, three patterns: online, batch, stream. Each one is a 45-minute interview shape. Each one has its own canonical case studies. You're now ready for the system design loop.

Next section: the Machine Learning Masterclass. Five modules. The hardest section of the IK course. The one that, when you've finished, gets you in the room.
