# DDIA Reverse-Engineering Prompt Library

Quick-reference for reverse-engineering an existing app or feature with an AI coding agent, using *Designing Data-Intensive Applications* as the question framework. The agent is the explorer, tracer, systems analyst, critic, and tutor; DDIA gives it better questions about data, scale, correctness, and failure.

The core question DDIA asks of any system:

```text
What data exists, how does it move and change, what guarantees does the system
provide, and which trade-offs make those guarantees possible?
```

A normal explanation says: *`OrderService` writes the order to Postgres and publishes an event.*

A DDIA explanation asks: *Is the database the system of record? Is event publication atomic with the write? Can consumers observe duplicates, missing events, or reordered updates? What consistency does the user actually experience?* — those questions reveal the real **data-system design**, not just the call sequence.

**Always separate evidence from inference.** Otherwise agents present assumed consistency, durability, or scalability guarantees as if they were proven by the implementation.

---

## Index

| #  | Prompt                                                                        | What it does                                                           | Reach for it when                               |
| -- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| 0  | [**Master reverse-engineering**](#0-master-reverse-engineering-prompt)        | Full 12-point pass → 9-section report                                  | Start here on any unfamiliar feature            |
| 1  | [**Behavioral contract**](#1-establish-the-behavioral-contract)               | Feature purely from the user's side, no implementation                 | Before studying any code                        |
| 2  | [**Find entry points**](#2-find-the-real-entry-points)                        | Every route / handler / job / listener that starts the feature         | Don't trust the first function you find         |
| 3  | [**Trace one scenario**](#3-trace-one-concrete-scenario)                      | Follows one read or write end to end                                   | Need concrete ground truth                      |
| 4  | [**Data model**](#4-identify-the-data-model-and-system-of-record)             | Maps entities, relationships, schemas, ownership, and source of truth  | Building the data mental model                  |
| 5  | [**Storage and indexes**](#5-analyze-storage-engines-and-indexes)             | Explains how data is physically stored and retrieved                   | Reads or writes are slow or mysterious          |
| 6  | [**Replication**](#6-investigate-replication-and-failover)                    | Maps replicas, leaders, lag, failover, and read guarantees             | System spans multiple database nodes            |
| 7  | [**Partitioning**](#7-investigate-partitioning-and-data-distribution)         | Finds shard keys, hotspots, routing, and rebalancing                   | Scale depends on distributing data              |
| 8  | [**Transactions**](#8-analyze-transactions-and-concurrency)                   | Reconstructs atomicity, isolation, races, and invariants               | Concurrent writes can conflict                  |
| 9  | [**Consistency guarantees**](#9-identify-consistency-and-ordering-guarantees) | States what readers and writers can actually observe                   | “Eventually consistent” is too vague            |
| 10 | [**Batch processing**](#10-investigate-batch-processing)                      | Maps periodic jobs, snapshots, recomputation, and backfills            | Data is processed offline or on schedules       |
| 11 | [**Stream processing**](#11-investigate-stream-processing)                    | Maps logs, events, offsets, windows, retries, and delivery semantics   | Feature depends on events or queues             |
| 12 | [**Derived data**](#12-map-derived-data-and-materialized-views)               | Finds caches, search indexes, projections, and recomputation paths     | Multiple representations of the same data exist |
| 13 | [**Schema evolution**](#13-analyze-encoding-and-schema-evolution)             | Audits compatibility across versions and services                      | Data formats change over time                   |
| 14 | [**Failure model**](#14-analyze-failures-retries-and-recovery)                | Maps partial failure, retries, duplication, corruption, and recovery   | Distributed behavior feels unreliable           |
| 15 | [**Unknown unknowns**](#15-find-unknown-unknowns)                             | Hunts for hidden writes, triggers, consumers, and operational behavior | Before trusting any clean explanation           |
| A  | [**DDIA scorecard**](#a-ddia-design-scorecard)                                | 1–5 scores across 10 DDIA dimensions                                   | After the RE pass, want a summary               |
| B  | [**Architecture-teaching**](#b-architecture-teaching-prompt)                  | Teaches the system as if you'll rebuild it                             | Studying DDIA through real code                 |
| C  | [**Current vs ideal**](#c-compare-current-and-ideal-designs)                  | Existing architecture vs a data-intensive alternative                  | Want to evaluate the gap                        |

Reference (not prompts): [RE model chain](#the-ddia-reverse-engineering-model) · [Multi-pass workflow](#recommended-multi-pass-workflow)

---

## The DDIA reverse-engineering model

Instead of merely generating a service or file diagram, have the agent reconstruct this chain:

```text
User behavior
    ↓
Read or write request
    ↓
Application entry point
    ↓
Data validation and transformation
    ↓
System of record
    ↓
Storage engine and indexes
    ↓
Transaction and concurrency behavior
    ↓
Replication and partitioning
    ↓
Events, streams, and derived data
    ↓
User-visible consistency and failure behavior
```

---

## 0. Master reverse-engineering prompt

**What it does:** The full first pass — 12 investigation points producing a 9-section report. Explicitly forces evidence-vs-inference separation so assumed guarantees are not presented as facts. Use this first.

```text
Reverse-engineer this feature using the principles from Designing
Data-Intensive Applications.

Do not modify the code yet.

Your goal is to explain:

1. What user-visible behavior the feature provides.
2. Where reads and writes begin in the codebase.
3. The end-to-end data flow for one important scenario.
4. The main data entities, schemas, and relationships.
5. Which store is the system of record for each important value.
6. How data is indexed, queried, updated, and deleted.
7. Whether replication, partitioning, caching, or derived views are involved.
8. What transaction, consistency, and ordering guarantees exist.
9. How asynchronous processing, queues, logs, or streams participate.
10. How failures, retries, duplicates, stale reads, and recovery are handled.
11. Which conclusions are confirmed by code and which are inferences.
12. What questions remain unanswered.

For every guarantee, identify evidence from code, configuration, schema,
infrastructure, or tests.

Do not infer strong consistency, exactly-once processing, durability, or
atomicity from naming alone.

For every conclusion, cite the relevant file, symbol, schema, configuration,
query, migration, or line range.

Present the result as:

- Behavioral summary
- System boundary
- Read and write traces
- Data-model and ownership map
- Storage and query model
- Consistency and transaction assessment
- Replication, partitioning, and derived-data map
- Failure and recovery scenarios
- Unknowns and verification steps
```

---

## 1. Establish the behavioral contract

**What it does:** Pins down the behavior visible to the user before studying implementation, including freshness and correctness expectations.

```text
Describe this feature entirely from the user's perspective.

Identify:

- How the user enters the feature
- Inputs the user can provide
- Visible outputs
- Loading, empty, success, and error states
- Persistent changes
- Whether updates should appear immediately
- Whether stale data is acceptable
- Whether actions may be retried
- Whether duplicate actions are acceptable
- Ordering expectations
- Permissions or prerequisites
- External systems involved

Do not explain implementation yet.

Produce a behavioral contract that could later become acceptance,
consistency, and failure-recovery tests.
```

---

## 2. Find the real entry points

**What it does:** Enumerates every way data can be read, written, transformed, or emitted.

```text
Find every entry point into this feature.

Consider:

- UI routes
- API endpoints
- Public functions
- Commands
- Background jobs
- Queue consumers
- Event listeners
- Change-data-capture consumers
- Database triggers
- Scheduled tasks
- Webhooks
- Administrative scripts
- Backfills
- Data migrations

For each entry point, explain:

- Who invokes it
- Under what conditions
- Whether it reads, writes, or transforms data
- Which store it contacts
- Whether it is synchronous or asynchronous
- Whether retries are possible
- Whether the operation must be idempotent

Distinguish primary entry points from indirect or internal entry points.
```

---

## 3. Trace one concrete scenario

**What it does:** Follows one read or write through all relevant stores, queues, projections, and user-visible outcomes.

```text
Trace the following scenario end to end:

[Describe one specific read or write action.]

Start with the user interaction and follow the data through:

1. Request entry point
2. Authentication and authorization
3. Input validation
4. Data transformation
5. Read or write query
6. Transaction boundary
7. System-of-record update
8. Event or log publication
9. Cache or derived-view update
10. Response construction
11. User-visible result
12. Retry and failure behavior

At each step, identify:

- File and symbol
- Input
- Output
- Data representation
- Store read or written
- Query or command issued
- Transaction context
- Idempotency mechanism
- Ordering dependency
- Failure behavior
- Consistency guarantee

Do not skip intermediate queues, caches, database abstractions, or background
processors.
```

*Example:*

```text
Trace what happens when a user places an order and immediately opens the order
history page.
```

---

## 4. Identify the data model and system of record

**What it does:** Reconstructs the logical data model and clarifies which representation is authoritative.

```text
Construct a data-model and ownership map for this feature.

For each important entity or value, document:

- Meaning
- Identifier
- Fields
- Relationships
- Invariants
- Lifecycle
- Source of truth
- Readers
- Writers
- Persistence store
- Derived representations
- Cache representations
- Search-index representations
- Event representations
- Deletion or retention behavior

Identify whether the model is primarily:

- Relational
- Document-oriented
- Key-value
- Graph
- Event-sourced
- Log-oriented
- Mixed or polyglot

Then identify:

- Data duplicated across stores
- Fields whose ownership is unclear
- Denormalized values
- Derived values stored as if authoritative
- Cross-service invariants
- Data that can become inconsistent
```

---

## 5. Analyze storage engines and indexes

**What it does:** Explains how the feature’s access patterns map to tables, indexes, files, caches, and query costs.

```text
Analyze how this feature stores and retrieves data.

For every important read and write, identify:

- Store or database
- Table, collection, keyspace, or file
- Primary key
- Secondary indexes
- Composite indexes
- Unique constraints
- Sort order
- Filter conditions
- Join behavior
- Full scans
- Pagination approach
- Write amplification
- Read amplification
- Serialization format
- Expected data volume

Determine whether the design favors:

- Write performance
- Read performance
- Point lookups
- Range scans
- Aggregations
- Full-text search
- Analytical queries
- Append-only writes
- In-place updates

Look for likely problems:

- Missing indexes
- Redundant indexes
- Hot indexes
- N+1 queries
- Offset-pagination degradation
- Unbounded scans
- Large rows or documents
- Expensive joins
- Write-heavy index maintenance
- Cache dependence hiding slow storage
```

---

## 6. Investigate replication and failover

**What it does:** Maps leader/follower behavior, replica lag, failover assumptions, and the consistency seen by users.

```text
Determine whether any store used by this feature is replicated.

Identify:

- Leader, primary, or writable node
- Followers, replicas, or read replicas
- Replication mode
- Synchronous vs asynchronous replication
- Read-routing policy
- Write-routing policy
- Failover mechanism
- Leader-election mechanism
- Replica-lag monitoring
- Conflict handling
- Multi-region topology
- Backup relationship versus replication

Then answer:

- Can a user read their own write?
- Can two consecutive reads move backward in time?
- Can different users see different versions?
- Can failover lose acknowledged writes?
- Can stale replicas authorize or reject an action incorrectly?
- What happens during network partitions?
- What happens when the old leader returns?
- How are replication offsets or positions tracked?

Separate guarantees established by configuration from assumptions made in
application code.
```

---

## 7. Investigate partitioning and data distribution

**What it does:** Finds shard keys, routing logic, skew, hotspots, cross-partition operations, and rebalancing behavior.

```text
Determine whether the feature's data is partitioned or sharded.

For each partitioned dataset, identify:

- Partition key
- Routing mechanism
- Hash-based or range-based partitioning
- Secondary-index strategy
- Local versus global indexes
- Rebalancing mechanism
- Number of partitions
- Replication factor
- Cross-partition query behavior
- Cross-partition transaction behavior
- Tenant isolation
- Geographic placement

Evaluate the partition key for:

- Cardinality
- Distribution
- Growth over time
- Hot keys
- Celebrity or high-traffic records
- Sequential-write hotspots
- Large tenants
- Temporal skew

Then explain:

- How a request finds the correct partition
- What happens when the partition map changes
- Whether clients cache routing metadata
- Whether fan-out queries occur
- Whether one partition can limit total system throughput
- How data is moved during rebalancing
```

---

## 8. Analyze transactions and concurrency

**What it does:** Reconstructs transaction boundaries, isolation, race conditions, and invariant enforcement.

```text
Map every transaction involved in this feature.

For each transaction, document:

- Operations included
- Store involved
- Beginning and end of the transaction
- Isolation level
- Locks acquired
- Optimistic-concurrency checks
- Version fields
- Compare-and-set operations
- Unique constraints
- Foreign-key constraints
- Retry behavior
- Timeout behavior
- Deadlock handling

Identify invariants that must survive concurrent access.

For each invariant, explain whether it is protected by:

- A database constraint
- Serializable isolation
- Row or table locks
- Optimistic concurrency
- Atomic update
- Application-level check
- Distributed lock
- Single-writer architecture
- Idempotency key
- Nothing visible

Search for anomalies including:

- Lost updates
- Dirty reads
- Non-repeatable reads
- Read skew
- Write skew
- Phantom reads
- Double spending
- Duplicate creation
- Check-then-act races
- Read-modify-write races

Do not assume a multi-step operation is atomic merely because it appears in one
service method.
```

---

## 9. Identify consistency and ordering guarantees

**What it does:** Replaces vague labels with concrete guarantees for reads, writes, events, and projections.

```text
State the consistency guarantees of this feature precisely.

Evaluate:

- Read-your-writes consistency
- Monotonic reads
- Monotonic writes
- Consistent-prefix reads
- Causal consistency
- Linearizability
- Sequential consistency
- Eventual consistency
- Snapshot consistency
- Session consistency
- Ordering per key
- Global ordering
- Transactional consistency

For each guarantee, explain:

- Where it matters
- Whether it is required by user behavior
- What mechanism provides it
- What evidence confirms it
- When it can fail
- What the user sees when it fails

For every asynchronous flow, answer:

- Can messages arrive out of order?
- Can a newer value be overwritten by an older one?
- Can consumers observe only part of a logical update?
- Can two projections disagree temporarily?
- How is versioning or ordering represented?
```

---

## 10. Investigate batch processing

**What it does:** Maps scheduled jobs, snapshots, recomputation, backfills, and their relationship to live data.

```text
Find all batch-processing behavior connected to this feature.

Consider:

- Scheduled jobs
- ETL or ELT pipelines
- Reports
- Aggregations
- Data exports
- Backfills
- Reindexing
- Reconciliation
- Cleanup
- Compaction
- Snapshot generation
- Machine-learning feature generation

For each job, identify:

- Input dataset
- Output dataset
- Schedule or trigger
- Processing framework
- Partitioning
- Checkpointing
- Retry behavior
- Idempotency
- Incremental versus full recomputation
- Late-arriving data handling
- Failure recovery
- Data freshness
- Resource impact on production systems

Explain whether the batch output is:

- Authoritative
- Derived
- Replaceable
- Recomputable
- User-facing
- Used to repair streaming results
```

---

## 11. Investigate stream processing

**What it does:** Reconstructs the event log, consumers, offsets, windows, delivery semantics, and stateful processing.

```text
Map every event stream, queue, or log involved in this feature.

For each stream, identify:

- Producer
- Event type
- Schema
- Broker or transport
- Topic, queue, or channel
- Partition key
- Ordering scope
- Consumer groups
- Consumers
- Offset or acknowledgement mechanism
- Retention
- Replay support
- Dead-letter handling
- Retry behavior
- Duplicate-delivery behavior

Determine the effective delivery semantics:

- At-most-once
- At-least-once
- Effectively-once through idempotency
- Transactional exactly-once within a limited boundary
- Unknown

For stateful processing, identify:

- State store
- Windowing
- Watermarks
- Late data handling
- Checkpoints
- Recovery behavior
- Reprocessing behavior

Do not describe a flow as exactly-once unless the code and infrastructure prove
the full end-to-end guarantee.
```

---

## 12. Map derived data and materialized views

**What it does:** Finds every secondary representation and explains how it is produced, refreshed, repaired, and trusted.

```text
Map all derived data associated with this feature.

Consider:

- Caches
- Search indexes
- Materialized views
- Read models
- Analytics tables
- Aggregates
- Recommendation features
- Denormalized records
- CDN content
- Session state
- Precomputed summaries

For each derived representation, document:

- Source data
- Transformation
- Update trigger
- Synchronous or asynchronous update
- Freshness expectation
- Rebuild process
- Backfill process
- Failure behavior
- Staleness detection
- Consistency with the source
- Whether users read it directly
- Whether writes ever occur against it

Then answer:

- Can it be deleted and rebuilt?
- How long would rebuilding take?
- What happens while it is rebuilding?
- How are missed updates detected?
- How are duplicate updates handled?
- Which representation wins when stores disagree?
```

---

## 13. Analyze encoding and schema evolution

**What it does:** Audits compatibility between old and new application versions, stored records, and event consumers.

```text
Analyze every important data encoding and schema used by this feature.

Consider:

- Database schema
- JSON
- Protobuf
- Avro
- MessagePack
- CSV
- Binary formats
- Event schemas
- API request and response shapes
- Cache values
- Search documents

For each schema, identify:

- Producer
- Consumers
- Versioning strategy
- Required fields
- Optional fields
- Default values
- Unknown-field behavior
- Field removal behavior
- Field renaming behavior
- Type changes
- Migration mechanism
- Rollback behavior

Evaluate:

- Backward compatibility
- Forward compatibility
- Rolling-deployment compatibility
- Stored-data compatibility
- Event-replay compatibility

Find changes that could break:

- Older application instances
- Newer application instances
- Delayed consumers
- Replayed events
- Historical records
- External clients
```

---

## 14. Analyze failures, retries, and recovery

**What it does:** Builds the actual failure model, including partial success and the side effects caused by retrying.

```text
Map the failure model of this feature.

Identify failures involving:

- Application crashes
- Database unavailability
- Network timeouts
- Slow responses
- Leader failover
- Replica lag
- Queue unavailability
- Consumer crashes
- Poison messages
- Partial transactions
- Cache failure
- Search-index failure
- Disk exhaustion
- Data corruption
- Duplicate requests
- Out-of-order events
- Dependency rate limits

For each operation, explain:

- What may have succeeded before failure
- Whether the caller can know the outcome
- Whether retry is safe
- How duplicate effects are prevented
- Whether compensation exists
- Whether the operation can be resumed
- Whether manual repair is required
- What monitoring detects the problem
- What data may become inconsistent

Identify recovery mechanisms:

- Transaction rollback
- Idempotency keys
- Deduplication
- Reconciliation jobs
- Dead-letter queues
- Checkpoint replay
- Backups
- Point-in-time recovery
- Read repair
- Anti-entropy
- Manual runbooks
```

---

## 15. Find "unknown unknowns"

**What it does:** Challenges the current data-system explanation and looks for behavior hidden outside the main application path.

```text
Challenge the current data-system explanation.

Search for evidence that contradicts or expands it, including:

- Alternative write paths
- Hidden reads
- Database triggers
- Stored procedures
- Change-data-capture pipelines
- Queue consumers
- Background jobs
- Scheduled reconciliation
- Cache warming
- Search indexing
- Data migrations
- Backfill scripts
- Administrative scripts
- Feature flags
- Multi-region configuration
- Read replicas
- Failover configuration
- ORM behavior
- Framework-managed transactions
- Generated queries
- External systems modifying shared data
- Tests using a different datastore
- Environment-specific topology

List anything that could make the current data-flow, ownership, consistency, or
failure explanation incomplete.
```

---

## A. DDIA design scorecard

**What it does:** Produces a compact 1–5 assessment after tracing the system. The score summarizes how clearly and safely the design manages data, scale, and failure.

```text
Score this feature from 1 to 5 across the following dimensions.

For every score, cite evidence and explain the reasoning.

1. Data-model clarity
   Are entities, relationships, identifiers, and invariants explicit?

2. Ownership clarity
   Is the system of record clear for every important value?

3. Access-pattern fit
   Do the storage model and indexes match actual reads and writes?

4. Transaction correctness
   Are concurrency and invariants protected appropriately?

5. Consistency clarity
   Are user-visible guarantees known and supported by evidence?

6. Replication and partitioning readiness
   Does the design handle lag, failover, skew, and distribution safely?

7. Asynchronous correctness
   Are ordering, retries, duplication, and idempotency handled explicitly?

8. Derived-data recoverability
   Can caches, indexes, and projections be rebuilt and reconciled?

9. Schema evolvability
   Can old and new versions coexist during deployment and replay?

10. Failure recovery
    Are partial failure, data loss, corruption, and repair mechanisms understood?

Use this scale:

1 = severe correctness or operability risk
2 = weak
3 = mixed or adequate
4 = strong
5 = exceptionally robust and well evidenced

Finish with:

- Overall assessment
- Three strongest data-system decisions
- Three largest correctness or scaling risks
- One guarantee that is well supported
- One guarantee that is only assumed
- One area requiring production evidence
```

---

## B. Architecture-teaching prompt

**What it does:** Teaches the feature as if you will rebuild it from scratch, beginning with data and access patterns rather than technologies.

```text
Teach me this feature as if I will rebuild it from scratch using the principles
from Designing Data-Intensive Applications.

Use the real code as evidence, but organize the lesson in this order:

1. User-visible behavior
2. Core data entities and invariants
3. Read and write access patterns
4. System of record
5. Storage model and indexes
6. Transaction and concurrency requirements
7. Consistency and ordering requirements
8. Replication and failover
9. Partitioning and scale
10. Events and stream processing
11. Batch processing
12. Derived data and caches
13. Schema evolution
14. Failure and recovery
15. Operational trade-offs

For every major design decision:

- Explain the requirement
- Show the current implementation
- Identify the guarantee provided
- Identify the guarantee not provided
- Explain the trade-off
- Show how the design behaves under failure
- Show what changes at 10× and 100× scale

Finish with:

- A concise data architecture diagram
- One complete read trace
- One complete write trace
- The five most important files or schemas to inspect
- Five comprehension questions
- One small redesign exercise
```

---

## C. Compare current and ideal designs

**What it does:** Separates the observed architecture from a possible data-intensive redesign, preventing theoretical recommendations from being confused with current behavior.

```text
Compare the current implementation with a plausible DDIA-informed design.

Keep the two designs strictly separate.

For the current implementation, document:

- Actual data model
- Actual system of record
- Actual read path
- Actual write path
- Actual indexes
- Actual transaction boundaries
- Actual consistency behavior
- Actual asynchronous flows
- Actual failure behavior
- Actual operational limits

For the proposed design, document:

- Revised data model
- Revised storage choices
- Revised indexes
- Revised transaction strategy
- Revised consistency guarantees
- Revised event or stream architecture
- Revised derived-data strategy
- Revised replication and partitioning plan
- Revised recovery plan
- Migration and backfill approach

Then answer:

1. What problem is the redesign solving?
2. Is the current scale large enough to justify it?
3. Which correctness guarantee improves?
4. Which guarantee becomes weaker?
5. What operational complexity is added?
6. What new failure modes appear?
7. Which current components should remain unchanged?
8. At what traffic, data volume, or reliability requirement does the redesign
   become worthwhile?

Do not recommend distributed systems merely because they are more scalable in
theory.
```

---

## Recommended multi-pass workflow

Do not run every prompt at once. Use focused passes so each explanation can be verified before building on it.

### Pass 1 — Establish reality

Run:

```text
1. Establish the behavioral contract
2. Find the real entry points
3. Trace one concrete scenario
```

Goal:

```text
Understand what the feature does and obtain one verified read or write path.
```

### Pass 2 — Reconstruct the data model

Run:

```text
4. Identify the data model and system of record
5. Analyze storage engines and indexes
12. Map derived data and materialized views
```

Goal:

```text
Understand what data exists, where truth lives, and how it is queried.
```

### Pass 3 — Reconstruct correctness guarantees

Run:

```text
8. Analyze transactions and concurrency
9. Identify consistency and ordering guarantees
13. Analyze encoding and schema evolution
```

Goal:

```text
Understand what the system guarantees during concurrent access and change.
```

### Pass 4 — Reconstruct distributed behavior

Run the prompts relevant to the feature:

```text
6. Investigate replication and failover
7. Investigate partitioning and data distribution
10. Investigate batch processing
11. Investigate stream processing
```

Goal:

```text
Understand how data is copied, distributed, processed, and delivered over time.
```

### Pass 5 — Test failure and operability

Run:

```text
14. Analyze failures, retries, and recovery
15. Find unknown unknowns
A. DDIA design scorecard
```

Goal:

```text
Determine whether the observed guarantees survive real failures.
```

### Pass 6 — Learn or redesign

Run either:

```text
B. Architecture-teaching prompt
```

or:

```text
C. Compare current and ideal designs
```

Goal:

```text
Turn reverse engineering into transferable data-system design knowledge.
```

---

## Compact workflow

When time is limited, use this sequence:

```text
1. What user behavior does this feature provide?
2. Trace one important write end to end.
3. Trace the corresponding read end to end.
4. What is the system of record?
5. What data is duplicated or derived?
6. What transaction and consistency guarantees exist?
7. Can retries produce duplicates or conflicting updates?
8. What happens during partial failure?
9. What becomes slow or unsafe at 10× scale?
10. Which guarantees are proven, inferred, or unknown?
```

---

## Guarantee-evidence rule

Never accept this:

```text
The operation is exactly-once because the consumer acknowledges each message.
```

Require this:

```text
The broker provides at-least-once delivery.

The consumer records the event ID in the same database transaction as the
business update. A unique constraint prevents the same event ID from being
applied twice.

This makes processing effectively once for this consumer's database side
effect, but it does not prove exactly-once behavior for external API calls or
other downstream effects.
```

Likewise, distinguish:

```text
Database transaction ≠ distributed transaction

Read replica ≠ read-your-writes consistency

Message acknowledgement ≠ exactly-once processing

Retry policy ≠ idempotency

Replication ≠ backup

Cache ≠ system of record

Eventual consistency ≠ no consistency guarantees

Unique ID ≠ duplicate prevention

Queue ordering ≠ global ordering

ORM method call ≠ one atomic database operation
```

---

## Final reverse-engineering principle

The goal is not to ask:

```text
Which database or queue does this system use?
```

The better sequence is:

```text
What data exists?
Where is truth stored?
How is it read and written?
Which invariants must hold?
What can happen concurrently?
What can be stale, duplicated, lost, or reordered?
How does the system recover?
What changes at larger scale?
Which guarantees are proven?
Which trade-offs make those guarantees possible?
```

Technology names are implementation details. The real architecture is the set of data flows, guarantees, failure modes, and trade-offs behind them.
