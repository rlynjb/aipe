# Chapter 2.1 — Online Processing Systems

**IK Section II, Module 1.** Reading time: 30 minutes.

> Eight years in a data center is the head start. You already think in terms of throughput, latency, replication, and failure isolation. The IK system design module is teaching you the *interview shape* of those concepts — how to walk through them on a whiteboard in 45 minutes such that an interviewer sees senior signal.

## The interview shape

System design interviews at FAANG follow a fixed template. Internalize it.

```
Minute 0–5:    Clarifying questions
               What's the scale? Read-heavy or write-heavy?
               Latency requirements? Geographic scope?
               What are the core features? What's out of scope?

Minute 5–10:   High-level architecture
               Boxes and arrows. Client, server(s), database,
               cache, queue. Name each box. Show data flow.

Minute 10–25:  Deep dive on 1-2 components
               The interviewer picks where to go deep.
               You walk the chosen component: data model,
               algorithms, scale concerns, failure modes.

Minute 25–35:  Scale concerns
               What breaks first at 10×? At 100×?
               Sharding, replication, caching, async.

Minute 35–45:  Tradeoffs and alternatives
               What did you give up? What would you do
               differently if X constraint changed?
```

Walk this rhythm in every system design interview. The interviewer guides; you have a script to fall back on when the question gets ambiguous.

## Top-down steps for system design

1. **Functional requirements.** What does the system do? What are the user-visible features?
2. **Non-functional requirements.** Latency, throughput, durability, consistency, availability.
3. **Capacity estimation.** Reads per second, writes per second, storage size, bandwidth.
4. **API design.** What are the endpoints? Request/response shape?
5. **High-level architecture.** Boxes and arrows.
6. **Data model.** Tables, fields, relationships. Indexes.
7. **Detailed design.** Pick 1–2 components and go deep.
8. **Scale, bottlenecks, and tradeoffs.** What breaks first?

Every senior interview walks this. Practice it.

## Capacity estimation — the back-of-envelope math

```
Common numbers to memorize:

  1 ms     CPU cache hit
  1 µs     L1 cache
  100 ns   RAM access
  1 µs     RAM read of 1 KB
  10 ms    Disk seek (HDD)
  0.1 ms   SSD read
  150 ms   Round-trip US east to west coast
  500 ms   Round-trip transatlantic

  1 KB     ~250 short tweets
  1 MB     1 high-resolution photo (compressed)
  1 GB     ~1000 short videos compressed (low quality)

  1 server can serve   ~10k QPS for simple reads
                       ~1k QPS for moderate compute
                       ~100 QPS for expensive ops (e.g., RAG)
```

When the interviewer asks "design Twitter," you should be able to estimate: 300M monthly users, 30M daily active, 100 tweets/user/day average (high estimate), 3B tweets/day, 35k tweets/second average, 100k tweets/second peak. From those numbers, you size the system.

The bridge from infra: this is the same back-of-envelope math you've done sizing switches. PPS, bps, cores per server, RAM per core. The numbers transfer.

## Network protocols — `[the parts that matter for interviews]`

```
TCP: reliable, ordered, connection-based.
     Three-way handshake. Slow start. Congestion control.
     Use for: most HTTP traffic, database connections.

UDP: unreliable, unordered, connectionless.
     No handshake. No flow control.
     Use for: video/audio streaming, DNS, real-time gaming.

HTTP/1.1: stateless, request-response over TCP.
          One request per TCP connection without keep-alive.
          With keep-alive, multiple sequential requests.

HTTP/2: multiplexed over a single TCP connection.
        Server push. Header compression.

HTTP/3: HTTP over QUIC (UDP-based). Faster handshake,
        better congestion control. Slowly replacing HTTP/2.

WebSocket: persistent bidirectional connection over TCP.
           Use for: chat, real-time notifications, collaborative editing.

gRPC: HTTP/2 + protocol buffers. Strongly typed, fast.
      Use for: service-to-service communication, mobile clients.
```

The interview won't quiz you on protocol details. It will ask you to *choose*. "Why HTTP/2 over HTTP/1.1 for this service?" Multiplexing reduces head-of-line blocking. "Why WebSockets over HTTP polling for the chat surface?" Lower latency, less server load, true bidirectional. Pick deliberately, defend the choice.

## Scaling concepts — `vertical / horizontal / sharding / replication`

```
Vertical scaling
  Bigger machine. More CPU cores, more RAM, more disk.
  Limit: hardware ceiling. No 1024-core consumer machine.
  Pro: simple, no architecture change.
  Con: doesn't scale forever, single point of failure.

Horizontal scaling
  More machines. Add nodes to the cluster.
  Limit: network bandwidth between nodes, coordination cost.
  Pro: scales arbitrarily, redundancy is built in.
  Con: requires partitioning state across nodes.

Replication
  Multiple copies of the same data on different nodes.
  Read replicas serve reads at lower latency.
  Failover: if primary dies, a replica becomes primary.
  Tradeoffs: replication lag, strong vs eventual consistency.

Sharding (partitioning)
  Split data across nodes by some key.
  Each node owns a subset of the keyspace.
  Lookups: route to the right shard.
  Tradeoffs: cross-shard queries are expensive, rebalancing is hard.
```

The interviewer's probe: "you said you'd shard the user table. What's the partition key?" Answer: usually user_id, hashed to spread evenly. Then: "what happens if one shard gets hot?" Resharding. Then: "how do you reshard without downtime?" That's the real bar — you can walk three levels deep.

## Performance metrics — `SLOs, SLAs`

```
Latency: how long one request takes.
  p50 (median):  half are faster, half are slower.
  p95:           95% are faster than this.
  p99:           99% are faster.
  p99.9:         the tail.

  Track p99, not avg. Avg lies — one slow request can be hidden
  by 99 fast ones. p99 surfaces the bad experiences.

Throughput: how many requests per second.

Availability: fraction of time the system is operational.
  99%:    87.6 hours downtime/year
  99.9%:  8.76 hours/year ("three nines")
  99.99%: 52 minutes/year ("four nines")
  99.999%: 5 minutes/year ("five nines")

SLO (Service Level Objective): internal target.
  "p99 latency under 200ms, 99.9% availability over rolling 30 days."

SLA (Service Level Agreement): external contract with consequences.
  Usually less strict than SLO. Refunds or credits when violated.
```

You already know this from the data center. The IK module just attaches the SRE vocabulary to it.

## Proxies — `forward / reverse`

```
Forward proxy
  Client → Forward proxy → Server
  Sits in front of clients. Used to enforce client policy
  (filter content, anonymize requests, cache for clients).
  Examples: corporate firewall, VPN.

Reverse proxy
  Client → Reverse proxy → Server
  Sits in front of servers. Used to load-balance, cache,
  terminate TLS, route based on URL.
  Examples: nginx, HAProxy, AWS ALB.
```

The interview probe: "where would you put TLS termination?" At the reverse proxy. Why? So your backends don't have to manage certs and can speak plain HTTP internally.

## Load balancing

```
Load balancing strategies:

  Round-robin:        send request 1 to server A, 2 to B, 3 to C.
                      Simple, fair, no state.

  Weighted round-robin: same, but heavier servers get more.
                      Use when servers are heterogeneous.

  Least connections:  send to the server with fewest active connections.
                      Use when request lengths vary widely.

  IP hash:            hash the client IP, route to consistent server.
                      Use for session stickiness.

  Consistent hash:    hash the request key, route to ring.
                      Use for cache shards (see below).
```

Layer 4 vs Layer 7 load balancers:
- **L4 (transport-level):** routes based on IP/port. Fast. Doesn't inspect content. Used for raw TCP/UDP.
- **L7 (application-level):** routes based on HTTP path, headers, etc. Slower. Used for HTTP APIs with smart routing.

## CAP theorem

```
You can only pick two of:

  C — Consistency: every read sees the most recent write.
  A — Availability: every request gets a response.
  P — Partition tolerance: the system survives network splits.

In practice, you always pick P (because partitions happen).
The real choice is between C and A.

CP systems (consistency + partition tolerance):
  Reject requests during partition to avoid inconsistency.
  Examples: ZooKeeper, etcd, traditional RDBMS with strict mode.

AP systems (availability + partition tolerance):
  Accept requests during partition; reconcile later.
  Examples: Cassandra, Dynamo, most NoSQL stores.
```

The interviewer's twist: "what about Spanner? It's CA, right?" No, but it's *effectively* CA in non-partitioned operation because Google's network is reliable enough that partitions are rare; and during partition, Spanner becomes unavailable rather than inconsistent. The senior answer is "CAP is a snapshot model; modern systems trade granularly between C and A on a per-operation basis (e.g., DynamoDB has strong-read and eventually-consistent-read APIs)."

## Content Distribution Networks (CDNs)

```
CDN: a network of edge servers caching static content close to users.

  Client request                          Origin server
       │                                       ▲
       ▼                                       │
  ┌─ Nearest edge ───────────┐                 │
  │  (LA, Tokyo, Berlin, ...)│                 │
  │                          │                 │
  │  Cache hit?              │ ─── cache miss ─┘
  │   Yes → return cached    │
  │   No  → fetch from origin│
  │         cache it         │
  │         return           │
  └──────────────────────────┘

CDN tradeoffs:
  + Lower latency for users (geographic proximity)
  + Less load on origin (cache offloads requests)
  - Cache invalidation is hard (Cloudflare's purge API exists for a reason)
  - Static content only (mostly — modern CDNs do edge compute, but mainly static)
```

When the interviewer asks "how do you scale globally," CDN is the first answer for static content. For dynamic content, you replicate the application to multiple regions.

## Caching

The single most-used optimization in web systems. The pattern:

```
Cache-aside (lazy loading):

  Read:
    1. Check cache.
    2. If hit: return.
    3. If miss: fetch from DB, populate cache, return.

  Write:
    1. Update DB.
    2. Invalidate cache (or update it).

  Pro: cache only holds what's accessed.
  Con: first read is a cache miss.

Write-through:

  Read:
    1. Check cache. Always present.
    2. Return.

  Write:
    1. Update cache.
    2. Update DB.

  Pro: cache always consistent with DB.
  Con: writes are slower (two operations).

Write-behind (write-back):

  Read:
    1. Check cache.

  Write:
    1. Update cache.
    2. Asynchronously update DB.

  Pro: fast writes.
  Con: data loss if cache dies before flush.
```

For most systems, **cache-aside** is the default. The other two are special-cases.

Cache invalidation is one of the two hardest problems in CS. The interview move: name your invalidation strategy. TTL-based ("entries expire after 5 minutes"), event-based ("invalidate on write to underlying data"), or version-based ("each cache entry has a version that increments on write"). Each has tradeoffs.

## Sharding and consistent hashing

```
Sharding by hash:

  shard = hash(key) % N

  Pro: even distribution.
  Con: adding a new shard requires rehashing almost all keys.

Consistent hashing:

  Imagine the hash space as a ring. Each shard owns a range
  of the ring. Adding a new shard only redistributes keys
  in its range, not all keys.

      ┌────── shard A ──────┐
      │                     │
  shard D              shard B
      │                     │
      └────── shard C ──────┘

  Each key hashes to a point on the ring; the next shard
  clockwise owns it.

  Adding shard E: only the keys in E's new range move.
  Removing shard B: only B's keys move to its successor.
```

Consistent hashing is what powers DynamoDB, Cassandra, Memcached cluster mode. Memorize the technique. Senior interviews ask about it directly.

## Storage choices

```
Relational (Postgres, MySQL):
  Strong consistency, joins, transactions, mature.
  Default unless a specific reason to leave.

Key-value (Redis, DynamoDB):
  Fast simple lookups, no joins.
  Use for: session storage, caches, lookup tables.

Document (MongoDB, Couchbase):
  Schema flexibility, single-document atomic ops.
  Use for: variable-schema data, content-management.

Column-family (Cassandra, HBase):
  Massive write throughput, no joins.
  Use for: time-series data, write-heavy logs.

Graph (Neo4j, Neptune):
  Optimized for relationship traversal.
  Use for: social graphs, recommendation graphs, fraud detection.

Time-series (InfluxDB, TimescaleDB):
  Optimized for timestamped append-only data.
  Use for: metrics, IoT sensor data, financial ticks.
```

The interview probe: "why MongoDB over Postgres for this?" Defensible answer: schema flexibility for variable user content. Indefensible answer: "it's web scale."

## The case studies

The IK module walks five canonical system designs. Each is a 45-minute interview pattern. The five:

```
URL Shortener (bitly)
  Read-heavy. Sharded key-value store.
  Custom hash function for short codes.
  Edge case: collisions, custom slugs.

Instagram
  Read-heavy media + metadata.
  CDN for media. Fanout-on-write for the feed.
  Edge case: celebrity users (fanout explosion).

Uber
  Real-time geographic dispatch.
  Quad-tree or geohash for spatial index.
  Edge case: surge pricing, driver availability.

Twitter
  Mix of read and write heavy.
  Fanout debate (write to followers vs read pull).
  Edge case: timeline ordering, retweet semantics.

Chat / Messaging (WhatsApp scale)
  Low-latency message delivery.
  WebSocket persistent connections.
  Edge case: offline users, message ordering, encryption.
```

For each, practice walking the 45-minute template. The patterns repeat: cache, shard, replicate, async-where-possible. The deltas between systems are where to apply each pattern.

## How interviewers probe online system design

Three layers:

1. **Surface:** "Design a URL shortener." Tests whether you can produce the basic architecture in 15 minutes.
2. **Standard:** "How would you handle Twitter's fanout problem?" Tests whether you can name fanout-on-write vs read-pull and defend a choice.
3. **Twist:** "What happens to your design if 1% of users follow 90% of the active audience?" Tests whether you've thought about distribution skew, hot keys, celebrity-user problems.

The third layer is the senior bar.

## The Interview Move

> *"Before I draw boxes, let me confirm the requirements. Scale: how many users? Reads vs writes? Latency? Geographic? OK, given X users and Y QPS, I'd start with: load balancer in front, application servers behind, database with read replicas, cache layer (cache-aside, Redis), CDN for static. For the write path, I'd think about whether to do it synchronously or push to a queue and do async. For the read path, I'd think about which queries hit the cache and which fall through. Let me walk the high-level architecture, then you tell me where to go deep."*

That's the FAANG-shape opener. Requirements first, then architecture, then offer the interviewer the deep-dive choice. You're not winging it; you're walking a template.

Next chapter: batch processing. Where the offline / cold path lives.
