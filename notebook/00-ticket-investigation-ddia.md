Here’s a ready-to-use DDIA-style ticket investigation prompt, shaped like the ticket prompt but aimed at building the “what mechanism actually provides this guarantee?” reflex.

Sources used: [ticket investigation prompt](https://github.com/rlynjb/aipe/blob/main/notebook/00-ticket-investigation.md), [DDIA code-review prompt library](https://github.com/rlynjb/aipe/blob/main/notebook/code-review-ddia.md), and the [DDIA 2nd edition O’Reilly table of contents](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/).

```text
# DDIA Ticket Investigation Prompt

Review this ticket thoroughly before proposing an implementation.

Use Designing Data-Intensive Applications, 2nd Edition as the investigation lens:
do not only ask what the feature should do. Ask what data-system mechanisms are
needed to make the behavior reliable, scalable, maintainable, and correct.

Investigate:
- Ticket title and description
- User story
- Acceptance criteria
- Comments and discussion
- Parent epic
- Linked or related tickets
- Referenced documentation
- Existing behavior
- Relevant code paths, APIs, schemas, jobs, events, queues, caches, and stores

Then answer the following.

## 1. What is this ticket actually asking for?

Summarize:
- User problem
- Expected user-visible behavior
- Current behavior
- Desired behavior
- Acceptance criteria
- Explicitly out-of-scope work

Separate confirmed requirements from assumptions.

## 2. Functional requirements

Identify what the system must do.

For each requirement, explain:
- Actor or caller
- Trigger
- Input
- Output
- State change
- Read path
- Write path
- Error behavior
- Permission or tenancy rule
- Existing behavior that must be preserved

Do not merge functional behavior with implementation guesses.

## 3. Nonfunctional requirements

Identify what qualities the system must provide.

Look for requirements involving:
- Latency and response time
- Throughput
- Availability
- Reliability and fault tolerance
- Data freshness
- Consistency
- Ordering
- Durability
- Scalability
- Operability
- Maintainability
- Evolvability
- Privacy, compliance, or data retention

For each nonfunctional requirement, state:
- Is it explicitly required or inferred?
- What user or business outcome depends on it?
- What metric, SLO, workload, or scale assumption is known?
- What is unknown?
- Does this block implementation?

## 4. Data and system-of-record investigation

Identify the important data involved.

For each entity, field, event, or derived value, determine:
- Meaning
- Identifier
- Owner
- System of record
- Authoritative writer
- Readers
- Copies in caches, indexes, projections, warehouses, or external systems
- Lifecycle
- Retention or deletion behavior
- Invariants that must always hold

Call out any value whose ownership or source of truth is unclear.

## 5. Mechanism map

For every important guarantee the ticket appears to need, identify the mechanism
that would provide it.

Cover relevant DDIA mechanisms:
- Data model and query language
- Storage and retrieval path
- Indexes and access patterns
- Encoding and schema evolution
- Service or API dataflow
- Transactions and isolation
- Constraints and uniqueness
- Idempotency and deduplication
- Replication and replica lag
- Sharding or partitioning
- Events, streams, queues, or CDC
- Caches, search indexes, materialized views, or derived data
- Batch jobs, backfills, or migrations
- Consensus, locks, leases, or coordination
- Recovery, reconciliation, and repair

For each mechanism, answer:
- What guarantee does it provide?
- What evidence confirms that guarantee?
- Where can it fail?
- What would the user or downstream system observe if it fails?

Do not claim atomicity, exactly-once behavior, strong consistency, durability, or
scalability unless a concrete mechanism supports the claim.

## 6. Workload and scale assumptions

Determine the workload this ticket must survive.

Identify:
- Expected request volume
- Expected data size
- Cardinality and fan-out
- Tenant distribution
- Hot-key or large-tenant risk
- Query result sizes
- Pagination needs
- Growth expectations
- 10x or 100x failure points

Separate measured facts from guesses.

## 7. Failure, retry, and concurrency scenarios

Describe realistic failure cases before implementation.

Look for:
- Concurrent requests
- Lost updates
- Duplicate requests
- Retried jobs or API calls
- Timeout after partial success
- Queue redelivery
- Out-of-order events
- Stale reads
- Replica lag
- Cache disagreement
- Backfill interruption
- Partial external-service failure
- Deployment rollback

For each scenario, explain:
- Event sequence
- Required behavior
- Existing mechanism, if any
- Missing mechanism, if any
- Whether the ticket must handle it now

## 8. Schema, migration, and rollout requirements

If data shape changes, identify:
- Old readers
- Old writers
- New readers
- New writers
- Required and optional fields
- Defaults
- Backward compatibility
- Forward compatibility
- Historical data behavior
- Backfill needs
- Rollback behavior
- Deployment order

Do not assume an instantaneous deploy or migration.

## 9. Codebase investigation

Tell me specifically what to search for.

Identify likely:
- Existing similar features
- Entry points
- APIs or endpoints
- Services/modules
- Data models
- Queries
- Migrations
- Background jobs
- Event producers and consumers
- Cache or index update paths
- Authorization checks
- Tests
- Observability hooks

Avoid vague instructions like “investigate the codebase.”

## 10. Ambiguities and questions

List anything missing, ambiguous, contradictory, or assumed.

For each item provide:
Question:
Why it matters:
DDIA mechanism affected:
Who can likely answer it:
Does it block implementation? Yes / No

## 11. Implementation readiness

Classify the ticket as:

READY
READY WITH ASSUMPTIONS
NEEDS CLARIFICATION
BLOCKED

Then provide:
- Confirmed functional requirements
- Confirmed nonfunctional requirements
- Assumptions
- Required mechanisms
- Missing guarantees
- Codebase areas to inspect
- Team questions
- Dependencies or blockers
- Suggested first implementation step

Do not write code yet.
```

For a daily lightweight version:

```text
Review this ticket before implementation using a DDIA mechanism lens.

Determine:
1. What functional behavior is actually required?
2. What nonfunctional requirements are explicit or implied?
3. What data is read, written, derived, cached, indexed, or emitted?
4. Which store is authoritative for each important value?
5. What invariants must hold?
6. What mechanisms provide atomicity, consistency, ordering, durability, freshness, retry safety, and recovery?
7. What can go wrong under concurrency, retries, partial failure, stale reads, or scale?
8. Are schema, migration, rollout, or compatibility concerns involved?
9. What existing code paths, tests, jobs, events, stores, and queries should I inspect?
10. What is confirmed, what is assumed, and what needs clarification?
11. Is the ticket READY, READY WITH ASSUMPTIONS, NEEDS CLARIFICATION, or BLOCKED?

Finish with:

Functional requirements:
Nonfunctional requirements:
Data/system of record:
Required mechanisms:
Failure/concurrency risks:
Questions:
Codebase areas to investigate:
Implementation readiness:
Recommended next step:

Do not write code yet.
```
