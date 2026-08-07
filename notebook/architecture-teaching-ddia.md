# DDIA Architecture-Teaching Prompt Library

Quick-reference for learning an application's architecture using *Designing Data-Intensive Applications*. These prompts teach the system by following data: where truth lives, how reads and writes happen, what guarantees exist, and what happens when concurrency or failure enters the picture.

The goal is to move from:

```text
The app uses Postgres, Redis, and a queue.
```

to:

```text
I understand why each exists,
which data it owns,
what guarantees the system provides,
and what happens when one component fails.
```

---

## Index

| #  | Prompt            | What it teaches                     | Reach for it when         |
| -- | ----------------- | ----------------------------------- | ------------------------- |
| 1  | **Compact daily** | Complete data architecture overview | Default                   |
| 2  | **Master**        | Full DDIA architecture lesson       | Data-heavy application    |
| 3  | **Data map**      | Data entities and ownership         | First orientation         |
| 4  | **Read path**     | How data reaches users              | Understanding queries     |
| 5  | **Write path**    | How state changes safely            | Understanding mutations   |
| 6  | **Transactions**  | Concurrency and invariants          | Multi-step writes         |
| 7  | **Consistency**   | What readers can observe            | Async/distributed systems |
| 8  | **Events**        | Queues and streams                  | Event-driven app          |
| 9  | **Derived data**  | Cache/index/projection architecture | Multiple representations  |
| 10 | **Failure tour**  | Architecture under failure          | Reliability learning      |
| 11 | **Scale tour**    | Architecture under growth           | Performance learning      |
| 12 | **Quiz me**       | Active recall                       | After studying            |

---

## Recommended learning sequence

```text
User behavior
 ↓
Data model
 ↓
System of record
 ↓
Read paths
 ↓
Write paths
 ↓
Transactions
 ↓
Consistency
 ↓
Events / derived data
 ↓
Failure
 ↓
Scale
```

---

## 1. Compact daily prompt

```text
Teach me this application's data architecture using DDIA principles.

Explain:

1. Important data entities
2. System of record for each
3. Read paths
4. Write paths
5. Transaction boundaries
6. Important invariants
7. Concurrency behavior
8. Consistency and ordering guarantees
9. Events and queues
10. Caches, indexes, and projections
11. Retry and idempotency behavior
12. Failure and recovery
13. Schema evolution
14. Scaling strategy

For every guarantee distinguish:

- Proven by code/configuration
- Likely
- Assumed
- Unknown

Point to concrete files, schemas, queries, and configuration.

Finish with:

- ASCII data architecture diagram
- One representative read trace
- One representative write trace
- 5 files to study
- 5 DDIA concepts demonstrated
- 5 questions testing my understanding
```

---

## 2. Master architecture-teaching prompt

```text
Teach me this application's architecture using Designing Data-Intensive
Applications.

Teach the system by following its data.

## 1. Data model

Identify:

- Entities
- Identifiers
- Relationships
- Invariants
- Lifecycle
- Derived fields

## 2. Data ownership

For every important value identify:

- System of record
- Authoritative writer
- Readers
- Copies
- Derived representations

## 3. Storage architecture

Explain every important:

- Database
- Cache
- Search index
- Object store
- Queue
- Stream

For each explain why it exists.

## 4. Read architecture

Trace representative reads:

Request
→ service
→ query
→ store/replica/cache
→ transformation
→ response

Explain freshness guarantees.

## 5. Write architecture

Trace representative mutations:

Request
→ validation
→ transaction
→ authoritative write
→ event
→ derived updates
→ response

Explain where atomicity begins and ends.

## 6. Transactions and concurrency

Explain:

- Transaction boundaries
- Isolation
- Constraints
- Locks
- Optimistic concurrency
- Lost-update protection
- Idempotency

Use concrete concurrent scenarios.

## 7. Consistency

Explain relevant:

- Read-your-writes
- Eventual consistency
- Ordering
- Replica lag
- Projection lag
- Causal relationships

State exactly what users can observe.

## 8. Events and streams

Explain:

- Producers
- Topics/queues
- Consumers
- Partitioning
- Ordering
- Acknowledgements
- Retry
- Redelivery
- Replay

## 9. Derived data

Map:

System of record
→ cache
→ projection
→ search index
→ analytics

Explain update and rebuilding mechanisms.

## 10. Schema evolution

Explain:

- Database migrations
- API compatibility
- Event compatibility
- Rolling deployments
- Historical data

## 11. Failure tour

Simulate:

- App crash
- DB timeout
- Cache outage
- Queue outage
- Consumer crash
- External API timeout

For each explain what state may remain.

## 12. Scale tour

Explain what happens at:

10× traffic
10× data
100× data

Identify likely bottlenecks and scaling mechanisms.

## 13. Trade-offs

Explain where the architecture chooses between:

- Consistency and availability
- Latency and freshness
- Normalization and read efficiency
- Synchronous and asynchronous work
- Simplicity and scalability

## 14. Learning summary

Return:

- Data architecture diagram
- Systems-of-record map
- Read-flow diagram
- Write-flow diagram
- Consistency map
- Failure map
- 5 files to study
- 5 DDIA concepts
- 10 interview questions
```

---

## 3. Data map

```text
Create a teaching map of this application's data.

For each important entity show:

Entity
Identifier
System of record
Authoritative writer
Readers
Derived copies
Important invariants

Then draw how data moves between stores.
```

---

## 4. Read path

```text
Teach me this read path:

[user action/query]

Trace:

Request
→ API
→ application logic
→ cache
→ database/index
→ transformation
→ response

At each step explain:

- Data requested
- Query
- Source
- Freshness
- Possible stale state
- Failure behavior
```

---

## 5. Write path

```text
Teach me this write path:

[action]

Trace every state change.

At each step show:

- Data read
- Data written
- Transaction
- Constraint
- Event emitted
- Derived data updated
- External side effect

Then tell me what happens if the process crashes after each step.
```

---

## 6. Transactions

```text
Teach me the transaction architecture.

For each important invariant show:

Invariant
→ concurrent threat
→ protection mechanism

Identify whether protection comes from:

- Constraint
- Atomic operation
- Transaction
- Lock
- Optimistic concurrency
- Single writer
- Idempotency
- Application convention

Use concrete interleavings to teach me how races could occur.
```

---

## 7. Consistency

```text
Teach me exactly what consistency guarantees this application provides.

For each important workflow answer:

What did the user write?
What can they immediately read?
Can another user see something different?
Can a replica be stale?
Can events arrive later?
Can updates arrive out of order?

Do not use "eventually consistent" without explaining the observable behavior.
```

---

## 8. Events

```text
Teach me the event architecture.

Map:

Producer
→ event
→ broker/topic
→ partition
→ consumer
→ side effect

Explain:

- Delivery semantics
- Ordering
- Duplicate delivery
- Retry
- Dead letters
- Replay
- Idempotency

Then simulate one consumer crash.
```

---

## 9. Derived data

```text
Teach me every important derived representation.

For each cache, projection, index, or aggregate explain:

Source of truth
Update mechanism
Freshness
Failure behavior
Rebuild mechanism
Deletion propagation

Answer:

Could I delete this representation and reconstruct it from authoritative data?
```

---

## 10. Failure tour

```text
Take me on a failure tour of this architecture.

For each major dependency:

Assume it fails halfway through a realistic workflow.

Explain:

- What already succeeded
- What failed
- What the caller sees
- Whether retry is safe
- Whether data becomes inconsistent
- How inconsistency is detected
- How recovery happens
```

---

## 11. Scale tour

```text
Teach me how this architecture behaves as it grows.

Evaluate:

10× users
10× reads
10× writes
10× stored data
100× stored data

Explain:

- First likely bottleneck
- Queries affected
- Index impact
- Cache impact
- Queue impact
- Contention
- Partitioning implications

Separate real current concerns from hypothetical future ones.
```

---

## 12. Quiz me

```text
Quiz me one question at a time about:

1. Data model
2. System of record
3. Read path
4. Write path
5. Transactions
6. Concurrency
7. Consistency
8. Events
9. Failure
10. Scale

Eventually give me failure scenarios and ask me to predict the outcome.
```

---

## Final teaching principle

Do not teach data architecture as:

```text
Postgres stores data.
Redis caches it.
Kafka handles events.
```

Teach:

```text
Where does truth live?
Who can change it?
What happens concurrently?
What can become stale?
What can be duplicated?
What happens after failure?
How is truth reconstructed?
```

Infrastructure names matter less than the **data guarantees they create**.
