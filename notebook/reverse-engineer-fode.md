# Fundamentals of Data Engineering Reverse-Engineering Prompt Library

Quick-reference for reverse-engineering an existing app, feature, pipeline, dataset, or platform component with an AI coding agent, using *Fundamentals of Data Engineering* as the question framework. The agent is the explorer, tracer, lifecycle analyst, operations critic, and tutor; FoDE gives it better questions about sources, storage, ingestion, transformation, serving, undercurrents, consumers, operations, and cost.

The core question FoDE asks of any data system:

```text
How does data move from source generation to useful serving, who depends on it,
which lifecycle contracts exist, and which undercurrents make it trustworthy and
operable?
```

A normal explanation says: *`daily_orders` is built by an Airflow DAG and queried by dashboards.*

A FoDE explanation asks: *Which source system generated the orders? What contract does ingestion rely on? Where is raw data stored? What transformations define the business meaning? Who consumes the served dataset? How are quality, lineage, orchestration, access, cost, and recovery handled?* Those questions reveal the real **data engineering system**, not just the job list.

**Always separate evidence from inference.** Otherwise agents present assumed source contracts, data quality, consumer fit, ownership, security, or operability as if they were proven by the implementation.

---

## Index

| #  | Prompt                                                                                      | What it does                                                         | Reach for it when                                      |
| -- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| 0  | [**Master reverse-engineering**](#0-master-reverse-engineering-prompt)                      | Full 12-point pass -> 9-section report                               | Start here on any unfamiliar data feature              |
| 1  | [**Consumer contract**](#1-establish-the-consumer-contract)                                 | Feature from consumer/use-case perspective before implementation     | Before studying jobs and tables                        |
| 2  | [**Find entry points**](#2-find-the-real-entry-points)                                      | Every route, job, script, DAG, source, sink, and manual path         | Do not trust the first pipeline you find               |
| 3  | [**Trace one lifecycle scenario**](#3-trace-one-lifecycle-scenario)                         | Follows one record, batch, event, or partition end to end            | Need concrete ground truth                             |
| 4  | [**Lifecycle map**](#4-map-the-data-engineering-lifecycle)                                  | Generation, storage, ingestion, transformation, serving              | Building the end-to-end mental model                   |
| 5  | [**Source systems**](#5-investigate-source-systems-and-generation)                          | Upstream owners, contracts, schema drift, extraction constraints     | Sources are unclear or unreliable                      |
| 6  | [**Storage layout**](#6-analyze-storage-layout-and-access)                                  | Tables, files, formats, partitions, retention, access patterns       | Data is persisted or copied                            |
| 7  | [**Ingestion path**](#7-investigate-ingestion-paths)                                        | Batch, streaming, CDC, API pulls, file drops, replay, checkpoints    | Data enters the platform                               |
| 8  | [**Transformation and modeling**](#8-analyze-transformation-and-modeling)                   | Grain, joins, business definitions, incremental logic, lineage       | SQL/dbt/Spark/ELT/ETL or feature logic matters         |
| 9  | [**Serving consumers**](#9-map-serving-outputs-and-consumers)                               | Analytics, ML, APIs, reverse ETL, exports, dashboards, SLAs          | Outputs or data products need explanation              |
| 10 | [**Data management**](#10-analyze-data-quality-metadata-lineage-and-ownership)              | Quality checks, metadata, catalog, lineage, ownership, retention     | Trust and governance are important                     |
| 11 | [**Security and privacy**](#11-investigate-security-privacy-and-governance)                 | Sensitive data, access, secrets, masking, audit, deletion            | PII, permissions, exports, or tenant boundaries exist  |
| 12 | [**Orchestration**](#12-investigate-orchestration-and-dependencies)                         | DAGs, schedules, dependencies, retries, backfills, manual steps      | Workflows or scheduled jobs exist                      |
| 13 | [**DataOps**](#13-analyze-dataops-release-safety-and-environments)                          | CI/CD, environments, deployment, rollback, observability             | Need to understand production maturity                 |
| 14 | [**Technology and cost**](#14-analyze-technology-choice-cost-and-operability)               | Tool fit, workload, team maturity, cost drivers, on-call burden      | New or expensive data infrastructure exists            |
| 15 | [**Unknown unknowns**](#15-find-unknown-unknowns)                                           | Hidden consumers, scripts, contracts, manual fixes, external paths   | Before trusting any clean explanation                  |
| A  | [**FoDE scorecard**](#a-fode-lifecycle-scorecard)                                           | 1-5 scores across 10 lifecycle and undercurrent dimensions           | After the RE pass, want a summary                      |
| B  | [**Architecture-teaching**](#b-architecture-teaching-prompt)                                | Teaches the system as if you will rebuild the lifecycle              | Studying data engineering through real code            |
| C  | [**Current vs ideal**](#c-compare-current-and-ideal-lifecycle-designs)                      | Existing lifecycle vs a FoDE-informed alternative                    | Want to evaluate the gap                               |

Reference (not prompts): [RE model chain](#the-fode-reverse-engineering-model) - [Multi-pass workflow](#recommended-multi-pass-workflow)

---

## The FoDE reverse-engineering model

Instead of merely generating a job or table diagram, have the agent reconstruct this chain:

```text
Consumer need
    |
Served data product, API, dashboard, ML feature, export, or reverse ETL target
    |
Transformation and modeling logic
    |
Ingestion path and checkpoints
    |
Storage locations, formats, partitions, and retention
    |
Source systems and generation contracts
    |
Undercurrents across every stage:
security, data management, DataOps, architecture, orchestration,
software engineering, observability, cost, ownership, and recovery
```

The lifecycle is not always linear. Storage can appear at every stage. Transformation can happen before or after loading. Serving can feed data back to operational systems. Reverse engineering should record the actual flow, not force it into a neat diagram.

---

## 0. Master reverse-engineering prompt

**What it does:** The full first pass - 12 investigation points producing a 9-section report. Explicitly forces evidence-vs-inference separation so assumed source contracts, consumer requirements, quality guarantees, and operational maturity are not presented as facts. Use this first.

```text
Reverse-engineer this feature, pipeline, dataset, or data platform component
using principles from Fundamentals of Data Engineering.

Do not modify the code yet.

Your goal is to explain:

1. What consumer, business process, analyst, ML model, operational workflow, or
   external system the data serves.
2. Where the data lifecycle begins: source systems, source owners, generated
   events, operational databases, files, APIs, manual inputs, or vendor feeds.
3. The end-to-end lifecycle flow for one important record, event, batch,
   partition, or consumer request.
4. Where data is stored at each stage, in which format, and for how long.
5. How ingestion works: trigger, schedule, extract method, checkpoints, retries,
   replay, deduplication, schema drift, late data, corrections, and deletes.
6. How transformation and modeling work: grain, business definitions, joins,
   filters, incremental behavior, lineage, and quality checks.
7. How data is served: dashboards, marts, features, APIs, exports, reverse ETL,
   user-facing product behavior, or operational consumers.
8. Which undercurrents are visible: security, data management, DataOps, data
   architecture, orchestration, and software engineering.
9. How orchestration, deployment, monitoring, alerting, runbooks, and incident
   response work.
10. What technology choices exist, what workload they serve, what they cost, and
    whether they are reversible.
11. Which conclusions are confirmed by code, configuration, schemas, tests,
    docs, metadata, or runbooks, and which are inferences.
12. What questions remain unanswered.

For every lifecycle claim, identify evidence from code, configuration, schema,
metadata, query, job definition, infrastructure, tests, logs, docs, or runbooks.

Do not infer data quality, consumer fit, ownership, security, recoverability,
lineage, freshness, or cost control from naming alone.

For every conclusion, cite the relevant file, symbol, schema, table, DAG, job,
query, configuration, metadata entry, or line range.

Present the result as:

- Consumer and business-value summary
- Lifecycle map
- Source-system and generation map
- Storage and ingestion model
- Transformation and serving model
- Data quality, metadata, lineage, and ownership assessment
- Security, privacy, and governance assessment
- Orchestration, DataOps, operability, and cost assessment
- Unknowns and verification steps
```

---

## 1. Establish the consumer contract

**What it does:** Pins down the consumer need before studying implementation, including freshness, quality, latency, access, and compatibility expectations.

```text
Describe this data feature entirely from the consumer's perspective.

Identify:

- Consumer or user
- Business process or decision supported
- Product behavior, dashboard, ML model, extract, API, reverse ETL target, or
  operational workflow that depends on it
- Inputs the consumer provides, if any
- Outputs the consumer receives
- Required grain and business definitions
- Required freshness or latency
- Required completeness, validity, and accuracy
- Expected history or retention
- Expected availability
- Access permissions
- Change compatibility expectations
- Failure or delay behavior
- Whether stale, partial, duplicate, or corrected data is acceptable
- Who owns the definition
- Who owns the operational outcome

Do not explain implementation yet.

Produce a consumer contract that could later become data-product, quality,
freshness, compatibility, and incident-response tests.
```

---

## 2. Find the real entry points

**What it does:** Enumerates every way data can enter, move through, change, or leave the system.

```text
Find every entry point into this data lifecycle.

Consider:

- UI routes that trigger data reads or writes
- API endpoints
- Public functions
- Commands
- Background jobs
- DAGs and scheduled tasks
- Queue consumers
- Event listeners
- Change-data-capture consumers
- Database triggers
- Webhooks
- File drops
- Vendor feeds
- Manual uploads
- Administrative scripts
- Notebook jobs
- Backfills
- Data migrations
- Reverse ETL jobs
- External exports

For each entry point, explain:

- What starts it
- What data it reads
- What data it writes
- Which lifecycle stage it belongs to
- Whether it is source generation, ingestion, transformation, serving, repair,
  or cleanup
- Who or what depends on it
- Whether it is production, test, ad hoc, or migration-only
- Evidence from files, configs, schedules, metadata, or docs

Flag anything that can change data outside the main documented path.
```

---

## 3. Trace one lifecycle scenario

**What it does:** Follows one concrete record, event, file, batch, partition, or consumer request end to end so the explanation is grounded in real behavior.

```text
Trace one important lifecycle scenario end to end.

Choose one concrete:

- Source record
- Source event
- API response page
- CDC change
- File drop
- Batch partition
- Incremental model run
- Dashboard query
- ML feature
- Reverse ETL update
- External export

Follow it through:

1. Source generation
2. Extraction or emission
3. Ingestion trigger
4. Checkpoint or deduplication
5. Raw storage
6. Intermediate storage
7. Transformation and modeling
8. Quality checks
9. Curated storage
10. Serving path
11. Consumer use
12. Monitoring, lineage, and logs
13. Failure, replay, and backfill path

At each step, identify:

- File, job, query, schema, table, topic, bucket, or endpoint
- Data shape before and after the step
- Owner
- Contract
- Possible failure
- Evidence

Separate observed facts from inferred behavior.
```

---

## 4. Map the data engineering lifecycle

**What it does:** Reconstructs the whole data lifecycle and shows where the feature actually sits.

```text
Map this feature across the data engineering lifecycle.

For each stage, document what exists:

Generation:
- Source systems
- Source owners
- Business process represented
- Source contracts
- Volumes, cadence, and change behavior

Storage:
- Raw, intermediate, curated, serving, and archive storage
- Formats
- Partitions, indexes, clustering, or sorting
- Retention and deletion
- Access controls

Ingestion:
- Batch, streaming, CDC, API pull, file drop, push, manual load, or vendor feed
- Checkpoints
- Retries
- Replay
- Deduplication
- Drift handling

Transformation:
- Models, queries, jobs, features, or enrichment logic
- Grain
- Business definitions
- Quality checks
- Incremental behavior
- Lineage

Serving:
- Consumers
- Tables, marts, APIs, dashboards, features, extracts, or reverse ETL targets
- Freshness and availability expectations
- Compatibility expectations

Then identify:

- Stages that are explicit in code or configuration
- Stages hidden inside one script or tool
- Stages handled manually
- Stages with no clear owner
- Stages whose guarantees are inferred rather than proven
```

---

## 5. Investigate source systems and generation

**What it does:** Explains where the data originates, who owns it, and what assumptions the downstream lifecycle makes about the source.

```text
Investigate every source system or data-generation point involved.

For each source, identify:

- Owner
- Business process represented
- Source technology
- Schema or event contract
- Identifier strategy
- Timestamp semantics
- Update behavior
- Delete behavior
- Correction behavior
- Late-arriving data behavior
- Expected volume and cadence
- Extraction constraints
- API pagination, rate limits, or throttling
- Access requirements
- Known data quality problems
- Contact path when the source changes

Look for evidence in:

- Source connectors
- API clients
- Event schemas
- CDC configuration
- Database queries
- File naming conventions
- Vendor docs
- README/runbooks
- Tests
- Data quality checks

Flag:

- Sources treated as controlled by the data team when they are not
- Missing source contract
- Timestamp or ID assumptions
- Silent schema drift
- Manual extracts becoming production dependencies
- Deletes and corrections ignored
- Source owner unknown
- Source constraints not represented in ingestion design
```

---

## 6. Analyze storage layout and access

**What it does:** Explains what is persisted, why it is stored that way, and whether layout matches lifecycle use.

```text
Analyze every storage location used by this lifecycle.

Consider:

- Operational databases
- Warehouses
- Lakes or lakehouses
- Object stores
- Search indexes
- Caches
- Feature stores
- Queues and logs
- Local files
- Test fixtures
- Archives

For each storage location, identify:

- Lifecycle role: raw, staging, intermediate, curated, serving, archive, cache,
  dead letter, quarantine, or backup
- Data stored
- Format or table structure
- Partitioning, clustering, indexing, or sorting
- Compression and serialization
- Retention and deletion
- Backup or recovery expectation
- Read and write access patterns
- Dataset size and growth
- Cost drivers
- Access permissions
- Owner

Explain:

- Why this data is stored here
- Whether it can be rebuilt
- Whether it is authoritative or derived
- Which consumers depend on the layout
- What becomes expensive or fragile as data grows

Flag storage that is duplicated, unowned, sensitive, unbounded, expensive, or
misaligned with ingestion or serving access patterns.
```

---

## 7. Investigate ingestion paths

**What it does:** Reconstructs how data enters the platform and whether ingestion can handle real source behavior.

```text
Investigate the ingestion paths for this lifecycle.

For each path, identify:

- Source
- Ingestion mode: batch, streaming, CDC, API pull, push, file drop, manual load,
  or vendor-managed sync
- Trigger or schedule
- Code or configuration that performs ingestion
- Authentication and authorization
- Expected volume
- Expected latency and freshness
- Schema contract
- Checkpoint, offset, cursor, or high-water mark
- Deduplication key
- Retry behavior
- Timeout behavior
- Replay behavior
- Backfill behavior
- Handling of late, missing, duplicate, corrected, and deleted data
- Quarantine or dead-letter path
- Monitoring and alerting

Trace the exact behavior when:

- The source schema changes
- The source returns duplicate records
- The source is late
- The source deletes or corrects data
- The job crashes after partial ingestion
- The source throttles or times out
- The same partition is rerun

Separate behavior proven by code/configuration from behavior only assumed.
```

---

## 8. Analyze transformation and modeling

**What it does:** Explains how raw data becomes meaningful served data, including grain, business definitions, lineage, and incremental correctness.

```text
Analyze every transformation, model, query, feature build, enrichment, or
business rule in this lifecycle.

For each transformation, identify:

- Inputs
- Outputs
- Grain
- Primary keys or natural keys
- Business definitions
- Filters
- Joins
- Aggregations
- Windowing or time logic
- Time zone behavior
- Null and invalid value behavior
- Incremental or full-refresh behavior
- Late-data handling
- Delete and correction handling
- Dependencies
- Lineage
- Quality checks
- Owner
- Consumers

Look for:

- Grain changes hidden in SQL
- Many-to-many joins that multiply rows
- Business definitions duplicated across models
- Filters that silently redefine metrics
- Incremental models that miss updates or deletes
- Late-arriving facts excluded permanently
- Ambiguous time windows
- Nulls converted into meaningful values without justification
- Transformations coupled to one dashboard or consumer
- Lineage that cannot explain a served value

For each important output field, trace how it is derived from source data and
which definition owns it.
```

---

## 9. Map serving outputs and consumers

**What it does:** Explains how data is used, who depends on it, and whether the served form matches the consumer's need.

```text
Map every served output in this lifecycle.

Consider:

- Curated tables
- Marts
- Semantic models
- Dashboards
- Reports
- ML features
- Model-training datasets
- Product APIs
- Embedded analytics
- Operational workflows
- Reverse ETL destinations
- External exports
- Data shares

For each output, identify:

- Consumer
- Use case
- Owner of the definition
- Schema or interface
- Access pattern
- Freshness requirement
- Latency expectation
- Availability expectation
- Historical coverage
- Compatibility expectation
- Access permissions
- Failure or delay behavior
- Notification path for breaking changes

Then answer:

- Is this a real data product or only a table?
- What consumer decision or action depends on it?
- Does the output's grain match the use case?
- Does freshness match the pipeline's actual schedule?
- Does quality monitoring match consumer risk?
- Can consumers discover owner, lineage, definition, and caveats?
- What happens when the output is late, partial, or wrong?
```

---

## 10. Analyze data quality, metadata, lineage, and ownership

**What it does:** Reconstructs the data management undercurrent: whether data can be trusted, found, explained, owned, and governed.

```text
Analyze data quality and data management for this lifecycle.

Identify:

- Dataset owners
- Critical data elements
- Source contracts
- Business definitions
- Quality expectations
- Quality checks
- Freshness checks
- Completeness checks
- Validity checks
- Uniqueness checks
- Referential checks
- Metadata
- Catalog entries
- Lineage
- Documentation
- Retention and deletion rules
- Incident response path for bad data

For each important dataset or output, answer:

- Who owns the data?
- Who owns the definition?
- Who owns operations?
- What checks prove the output is fit for use?
- Where are quality failures surfaced?
- What metadata helps a new engineer understand the dataset?
- Can a bad served value be traced back to source records?
- How are changes communicated to consumers?
- How are deletion and retention obligations handled across copies?

Flag data that is important but unowned, undocumented, unvalidated, unlineaged,
or governed only by convention.
```

---

## 11. Investigate security, privacy, and governance

**What it does:** Applies security and privacy thinking across the entire lifecycle instead of only at the serving layer.

```text
Investigate security, privacy, and governance across this data lifecycle.

Identify:

- Sensitive fields
- Data classification
- Source credentials
- Pipeline credentials
- Storage permissions
- Transformation access
- Serving access
- Cross-environment movement
- External sharing
- Data masking
- Encryption
- Secrets handling
- Logs containing data
- Audit logs
- Retention and deletion behavior
- Tenant or customer boundaries
- Regulatory or contractual obligations

Trace sensitive data through:

1. Source
2. Ingestion
3. Raw storage
4. Intermediate storage
5. Transformation
6. Served outputs
7. Logs and monitoring
8. Test, development, and QA environments
9. External exports or reverse ETL destinations

Flag:

- Broad admin access
- Secrets in code, configs, logs, or notebooks
- PII copied into less controlled stores
- Masking applied only after raw/intermediate exposure
- Tenant boundaries enforced by convention only
- Production data in test environments
- External exports without approval, expiration, or tracking
- Retention conflicts between lifecycle stages
```

---

## 12. Investigate orchestration and dependencies

**What it does:** Reconstructs how the lifecycle is scheduled, triggered, retried, backfilled, and recovered.

```text
Investigate orchestration for this lifecycle.

Identify:

- DAGs
- Jobs
- Tasks
- Sensors
- Triggers
- Schedules
- Event-driven starts
- Manual starts
- Upstream dependencies
- Downstream dependencies
- Task ordering
- Retry policy
- Timeout policy
- Concurrency limits
- Resource requirements
- Backfill behavior
- Catchup behavior
- Failure notification
- Manual intervention path
- Runbook

For each workflow, explain:

- What condition means data is ready?
- What condition means the job succeeded?
- What partial outputs can exist?
- Whether rerunning is safe
- Whether backfilling is safe
- How dependencies are represented: data dependency, time dependency, or manual
  convention
- How a failed step is resumed or repaired
- Who gets alerted and what they do

Flag hidden dependencies, unsafe retries, unbounded backfills, time-based
ordering where data dependencies are needed, and success states that do not
prove data correctness.
```

---

## 13. Analyze DataOps, release safety, and environments

**What it does:** Explains how data changes move safely from development to production.

```text
Analyze DataOps maturity for this lifecycle.

Identify:

- Development workflow
- Code ownership
- CI checks
- SQL/model validation
- Test data strategy
- Local execution path
- Staging or dev environment
- Production deployment process
- Configuration management
- Secrets management
- Migration process
- Rollback or roll-forward path
- Monitoring and alerting
- Incident response
- Runbooks
- Post-deploy verification

Then answer:

- Can changes be tested without production-only assumptions?
- Are schema, model, and pipeline changes deployed in a safe order?
- Can old and new versions run together?
- Can bad data be rolled back or repaired?
- Can an engineer reproduce a production run?
- Are alerts tied to data freshness and quality, not only process success?
- Is there a clear owner during incidents?
- Are environment differences explicit or tribal knowledge?

Flag production-only validation, manual config drift, missing rollback, missing
runbooks, and tests that use unrealistically clean data.
```

---

## 14. Analyze technology choice, cost, and operability

**What it does:** Explains why the tools exist, whether they fit the workload, what they cost, and whether the team can operate them.

```text
Analyze the technology and platform choices in this lifecycle.

For each major tool, service, framework, vendor, or platform component, identify:

- Lifecycle stage supported
- Concrete problem solved
- Requirements that justify it
- Workload shape
- Data volume
- Latency or freshness need
- Team ownership
- Required skills
- Integration points
- Failure modes
- Observability
- Cost model
- Cost drivers
- Capacity limits
- Vendor lock-in
- Exit or rollback path
- Alternatives already present in the codebase

Then answer:

- Is this tool necessary now?
- Could an existing component satisfy the need?
- Does it reduce lifecycle risk or merely add a tool boundary?
- Which undercurrents become stronger or weaker?
- What happens when the tool is unavailable?
- What grows in cost with data volume, job count, users, queries, or retention?
- Is the operational burden visible and assigned?
- Is the decision reversible?

Classify each major choice as necessary, reasonable and reversible, premature
but low-risk, operationally under-specified, cost risk, or unnecessary
complexity.
```

---

## 15. Find "unknown unknowns"

**What it does:** Hunts for evidence that the current lifecycle story is incomplete.

```text
Find unknown unknowns in this data lifecycle.

Search for evidence of:

- Hidden writers
- Hidden readers
- Manual repair scripts
- One-off backfills
- Notebook jobs
- Cron jobs outside the main orchestrator
- External vendor syncs
- Reverse ETL destinations
- Data exports
- Downstream dashboards not represented in code
- ML training jobs
- Consumers outside the repository
- Database triggers
- Stored procedures
- Views or materialized views
- Untracked files or buckets
- Secrets and credentials for unexpected systems
- Comments describing manual production steps
- Unfinished notes around schema, quality, or backfills
- Tests that imply behavior not documented elsewhere
- Metrics, alerts, or runbooks that reveal production incidents

For each clue, explain:

- What it suggests
- Why it matters
- What evidence supports it
- What question remains
- How to verify it

Do not present a complete lifecycle explanation until these clues have been
checked or explicitly listed as unknown.
```

---

## A. FoDE lifecycle scorecard

**What it does:** Produces a compact 1-5 assessment across lifecycle stages and undercurrents after reverse engineering.

```text
Score this data feature using Fundamentals of Data Engineering principles.

Use a 1-5 score for each dimension:

1. Consumer fit
2. Source-system understanding
3. Storage design
4. Ingestion reliability
5. Transformation and modeling clarity
6. Serving design
7. Data quality and data management
8. Security, privacy, and governance
9. Orchestration and DataOps
10. Technology choice, cost, and operability

For each score, provide:

- Score
- Evidence
- Biggest strength
- Biggest risk
- What is proven
- What is inferred
- Smallest improvement that would raise the score by one point

End with:

- Three most important files, jobs, tables, or configs
- Three highest-risk assumptions
- Three questions to ask owners or consumers
- One concise lifecycle diagram
```

---

## B. Architecture-teaching prompt

**What it does:** Teaches the feature as if you will rebuild the data lifecycle from scratch, beginning with consumers and sources rather than tools.

```text
Teach me this feature as if I will rebuild its data engineering lifecycle from
scratch using principles from Fundamentals of Data Engineering.

Use the real code as evidence, but organize the lesson in this order:

1. Consumer need and business value
2. Source systems and generation
3. Source contracts and known source constraints
4. Storage stages and data layout
5. Ingestion mechanics
6. Transformation and modeling
7. Serving outputs and consumer contracts
8. Data quality checks and data management
9. Security, privacy, and governance
10. Orchestration and dependencies
11. DataOps, environments, and release safety
12. Observability and incident response
13. Technology choices and cost drivers
14. Operational trade-offs
15. Simplest lifecycle that could satisfy the same need

For every major lifecycle decision:

- Explain the requirement
- Show the current implementation
- Identify the consumer value
- Identify the operational risk
- Explain the trade-off
- Show what changes at 10x data, jobs, or consumers

Finish with:

- A concise lifecycle diagram
- One complete source-to-serving trace
- The five most important files, jobs, tables, schemas, or configs to inspect
- Five FoDE concepts demonstrated
- Five comprehension questions
- One small redesign exercise
```

---

## C. Compare current and ideal lifecycle designs

**What it does:** Separates the observed lifecycle from a possible FoDE-informed redesign, preventing tool recommendations from being confused with current behavior.

```text
Compare the current implementation with a plausible FoDE-informed lifecycle
design.

Keep the two designs strictly separate.

For the current implementation, document:

- Actual consumers
- Actual source systems
- Actual storage layout
- Actual ingestion path
- Actual transformation logic
- Actual serving outputs
- Actual quality checks
- Actual ownership and lineage
- Actual access controls
- Actual orchestration
- Actual deployment and monitoring behavior
- Actual cost and operational limits

For the proposed design, document:

- Consumer contract
- Source contract
- Revised storage stages
- Revised ingestion strategy
- Revised transformation/modeling structure
- Revised serving contract
- Revised data quality and metadata strategy
- Revised security and governance posture
- Revised orchestration and DataOps model
- Revised observability and recovery plan
- Revised cost controls
- Migration and backfill approach

Then answer:

1. What lifecycle problem is the redesign solving?
2. Is the current data volume, freshness need, consumer criticality, or team
   maturity large enough to justify it?
3. Which consumer outcome improves?
4. Which undercurrent becomes stronger?
5. Which operational complexity is added?
6. Which current components should remain unchanged?
7. What migration or backfill risk appears?
8. At what workload, reliability requirement, governance requirement, or cost
   threshold does the redesign become worthwhile?

Do not recommend a new data platform, orchestrator, catalog, quality framework,
streaming system, or warehouse pattern merely because it is fashionable.
```

---

## Recommended multi-pass workflow

Do not run every prompt at once. Use focused passes so each explanation can be verified before building on it.

### Pass 1 -- Establish reality

Run:

```text
1. Establish the consumer contract
2. Find the real entry points
3. Trace one lifecycle scenario
```

Goal:

```text
Understand who needs the data, what it does for them, and one verified path from
source to use.
```

### Pass 2 -- Reconstruct lifecycle stages

Run:

```text
4. Map the data engineering lifecycle
5. Investigate source systems and generation
6. Analyze storage layout and access
7. Investigate ingestion paths
8. Analyze transformation and modeling
9. Map serving outputs and consumers
```

Goal:

```text
Understand how data moves from source generation to served value.
```

### Pass 3 -- Reconstruct undercurrents

Run:

```text
10. Analyze data quality, metadata, lineage, and ownership
11. Investigate security, privacy, and governance
12. Investigate orchestration and dependencies
13. Analyze DataOps, release safety, and environments
```

Goal:

```text
Understand whether trust, governance, workflow, and release safety are built
into the lifecycle.
```

### Pass 4 -- Reconstruct production behavior

Run:

```text
14. Analyze technology choice, cost, and operability
15. Find unknown unknowns
A. FoDE lifecycle scorecard
```

Goal:

```text
Determine whether the lifecycle can be operated, paid for, debugged, and scaled.
```

### Pass 5 -- Learn or redesign

Run either:

```text
B. Architecture-teaching prompt
```

or:

```text
C. Compare current and ideal lifecycle designs
```

Goal:

```text
Turn reverse engineering into transferable data-engineering judgment.
```

---

## Compact workflow

When time is limited, use this sequence:

```text
1. Who consumes this data, and what do they use it for?
2. Trace one source record, event, batch, or partition to the served output.
3. What source system generated it, and what source contract exists?
4. Where is the data stored at each lifecycle stage?
5. How does ingestion handle drift, duplicates, lateness, corrections, deletes,
   retries, and replay?
6. What transformation defines the business meaning and grain?
7. What serving contract exists for the consumer?
8. What quality, metadata, lineage, and ownership evidence exists?
9. How are access, privacy, and retention handled across copies?
10. How is the workflow orchestrated, monitored, backfilled, and recovered?
11. What does the tooling cost, and who operates it?
12. Which lifecycle assumptions are proven, inferred, or unknown?
```

---

## Lifecycle-evidence rule

Never accept this:

```text
The data product is reliable because the DAG completed successfully.
```

Require this:

```text
The source contract is explicit and monitored.

Ingestion records a checkpoint and can replay safely.

Transformation tests verify grain, joins, null handling, business definitions,
and incremental behavior.

The served output has a named consumer, freshness expectation, quality checks,
owner, lineage, access controls, and alerts.

Backfill, rollback, and repair paths have been tested on realistic data.
```

Likewise, distinguish:

```text
Pipeline success != data quality

Table exists != data product

Dashboard exists != consumer contract

Source API works today != stable source contract

Raw data retained != recoverability

Full refresh != simple at production scale

Streaming != valuable real-time serving

Orchestration != DataOps maturity

Catalog entry != ownership

Lineage graph != correctness

Admin access != enablement

Vendor platform != data architecture
```

---

## Final reverse-engineering principle

The goal is not to ask:

```text
Which data tools does this system use?
```

The better sequence is:

```text
Who needs this data?
Where does it originate?
What contract exists at the source?
How is it stored, ingested, transformed, and served?
What business meaning is created?
What can be late, duplicated, corrected, deleted, missing, stale, or malformed?
How are quality, lineage, ownership, security, orchestration, and DataOps handled?
Can the team debug, backfill, recover, scale, and pay for it?
Which assumptions are proven?
Which technology choices are justified by actual lifecycle requirements?
```

Technology names are implementation details. The real architecture is the data lifecycle, the consumers it serves, the contracts it relies on, the undercurrents that make it trustworthy, and the operational trade-offs behind it.
