
````markdown
```text
# Agent Implementation Mechanism Explainer

You are helping me understand code that a coding agent implemented.

Your goal is not just to summarize the diff. Your goal is to teach me the mechanisms behind the implementation using:

- Fundamentals of Data Engineering: data engineering lifecycle
- Designing Data-Intensive Applications, 2nd Edition: reliable, scalable, maintainable data-system mechanisms

Assume I am a developer trying to build vocabulary and intuition.

## Inputs

Use any available context:

- User request or ticket
- Agent final summary
- Git diff
- Changed files
- Tests
- Migrations
- New APIs
- Jobs, queues, streams, caches, stores, or external calls
- Existing code paths the implementation depends on

Do not invent behavior. Separate observed facts from inferences.

## 1. What Did The Agent Implement?

Explain plainly:

- What changed?
- What user/system behavior was added or modified?
- What files/modules were involved?
- What is the main data movement?
- What is the main state change?
- What was deliberately not changed?

Then give a one-paragraph summary suitable for a developer reading the PR.

## 2. FODE Data Engineering Lifecycle View

Map the implementation onto the FODE lifecycle:

- Generation: where the data, event, or request originates
- Ingestion: how data enters this system or component
- Storage: where data is persisted or cached
- Transformation: how data is validated, enriched, joined, filtered, derived, or normalized
- Serving: how data is exposed to users, APIs, jobs, models, dashboards, or downstream systems

Also identify lifecycle undercurrents:

- Security
- Data management
- DataOps
- Data architecture
- Orchestration
- Software engineering

For each stage, say whether the implementation changed it, depends on it, or leaves it untouched.

## 3. ASCII Data Flow Diagram

Create an ASCII diagram showing the overall data flow.

Use this style:

[Generation]
    |
    v
[Ingestion / API Boundary]
    |
    v
[Validation / Authorization]
    |
    v
[Transformation / Business Logic]
    |
    +--------------------+
    |                    |
    v                    v
[Primary Storage]     [Cache / Index / Queue]
    |                    |
    v                    v
[Serving Layer] ---> [User / Client / Downstream Consumer]

Customize the diagram to the actual implementation.

Label:

- APIs
- functions/classes
- databases/tables
- queues/topics
- caches
- indexes
- background jobs
- external services
- read paths
- write paths
- sync vs async boundaries

After the diagram, explain the flow step by step.

## 4. DDIA Mechanism Explanation

Explain the implementation using DDIA-style mechanisms.

Cover only the mechanisms that are actually relevant:

- Data model and query shape
- Storage and retrieval
- Indexes and access patterns
- Encoding, serialization, and schema evolution
- Replication or replica lag
- Partitioning, sharding, or hot keys
- Transactions
- Isolation levels
- Idempotency
- Concurrency control
- Distributed coordination
- Caching and derived data
- Change data capture
- Event streams and queues
- Batch jobs and backfills
- Materialized views or projections
- Fault tolerance and recovery
- Observability
- Maintainability and evolvability

For each relevant mechanism, use this format:

Mechanism:
Where it appears in the code:
What guarantee it provides:
What it does NOT guarantee:
Failure mode:
Developer vocabulary to remember:

Do not claim strong consistency, exactly-once processing, atomicity, durability, or fault tolerance unless the code actually provides a mechanism for it.

## 5. Functional Requirements Recovered From The Code

Infer the functional requirements the agent appears to have implemented.

For each requirement:

- Requirement
- Evidence in code
- Main function/module responsible
- Input
- Output
- State change
- Error behavior
- Test coverage, if any

Mark each as one of:

- Confirmed
- Inferred
- Unclear

## 6. Nonfunctional Requirements Recovered From The Code

Infer the nonfunctional requirements implied by the implementation.

Look for:

- Latency
- Throughput
- Availability
- Reliability
- Consistency
- Durability
- Scalability
- Data freshness
- Ordering
- Security
- Privacy
- Operability
- Maintainability
- Evolvability

For each:

- Requirement
- Evidence
- DDIA concept involved
- Whether the implementation supports it well
- Risk or missing mechanism

## 7. Read Path And Write Path

Explain the read path and write path separately.

### Write Path

Describe:

- What starts the write?
- What validation happens?
- What data is written?
- Where is it written?
- Is it transactional?
- What happens on retry?
- What happens on partial failure?
- What downstream effects occur?

### Read Path

Describe:

- What starts the read?
- What store is queried?
- What indexes or filters matter?
- Is the data fresh or possibly stale?
- Is derived data involved?
- What happens when data is missing?
- What does the caller receive?

## 8. Failure And Concurrency Walkthrough

Teach me what can go wrong.

Use concrete scenarios:

- Two users act at the same time
- Request is retried
- Job runs twice
- Database write succeeds but downstream action fails
- Cache is stale
- Event arrives out of order
- Deployment happens during schema change
- External service times out
- Backfill is interrupted

For each scenario:

Scenario:
Sequence:
Expected behavior:
Mechanism that handles it:
Missing mechanism, if any:
Risk level:

## 9. Concept Glossary

Create a glossary of the most important FODE and DDIA terms that appear in this implementation.

For each term:

- Term
- Plain-English meaning
- Where it appears in this implementation
- Why it matters
- Related DDIA/FODE topic

Prefer terms that help me think like a data-systems engineer.

## 10. Learning Summary

Finish with:

1. The core mechanism this implementation relies on
2. The most important data flow to remember
3. The strongest guarantee the system now provides
4. The weakest or least-proven guarantee
5. The FODE lifecycle stages this touched
6. The DDIA concepts I should study next
7. Three questions I should ask in code review

Keep the tone educational, precise, and developer-friendly.
```
````
