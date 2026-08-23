# Reusable Design-Spec Prompt

Copy the prompt below into any coding agent. Replace only the request section.

````text
You are writing a design specification for an existing codebase.

Your job is to inspect the repository first, then produce one grounded design
specification. Do not implement code, create an implementation plan, modify
application behavior, create commits, or invent capabilities that do not exist
in the repo.

Follow repository instructions first, including any AGENTS.md, CLAUDE.md,
GEMINI.md, README, architecture docs, package scripts, test conventions, and
recent git history. Treat existing code, tests, specs, traces, fixtures,
architecture docs, and committed plans as evidence.

If an important product or technical decision is genuinely unknown, ask one
concise question before writing the spec. Otherwise, make the most conservative
repo-consistent assumption and state it.

## Request

Create a design spec for:

<DESCRIBE THE FEATURE, INTEGRATION, REFACTOR, BUGFIX, OR ARCHITECTURAL CHANGE>

## Source context

Use this ticket, issue, conversation, product note, existing spec, or design
context:

<LINK OR PASTE THE RELEVANT CONTEXT>

If there is no source context, first reverse-engineer the relevant code path and
write the spec from observed repository behavior.

## Output location

Save the spec at:

docs/superpowers/specs/YYYY-MM-DD-<concise-topic>-design.md

Use today's date and a concise kebab-case topic. If this repository uses a
different documented convention, follow that convention instead.

## Writing principles

- Explain what exists today before explaining what changes.
- State the problem, boundary, and rationale in plain language.
- Preserve existing public APIs, data contracts, tests, user behavior, and
  operational behavior unless the request explicitly changes them.
- Preserve clear seams: external systems, adapters, contracts, deterministic
  core, AI/agent boundary, persistence, tracing, user-facing actions, and human
  approval gates.
- Prefer a small vertical slice over premature generalization.
- Make non-goals explicit.
- Clearly distinguish implemented now, proposed by this spec, and intentionally
  deferred work.
- Keep deterministic routing, validation, permissions, and readiness checks
  outside any model or agent.
- Require structured outputs, runtime validation, and human approval before any
  production-changing action when AI or agents are involved.
- Never describe raw credentials, tokens, customer data, provider payloads,
  production URLs, shop domains, or private values in examples, diagrams,
  traces, fixtures, or persisted state.
- Do not use TODO, TBD, vague placeholders, or "handle appropriately."
- Do not write an implementation plan. The design may identify likely files or
  modules, but task-by-task execution belongs in a later plan.

## Lens policy

Use DDIA, Fundamentals of Data Engineering, AI Agents in Action, A Philosophy
of Software Design, and Head First Design Patterns as optional learning lenses.
Apply a lens only where the scanned codebase and the design decision make the
lens genuinely useful.

- **DDIA lens:** Use for data models, system of record, transactions,
  idempotence, retries, ordering, consistency, derived data, schema evolution,
  storage, indexes, replication, queues, streams, failures, and recovery.
- **Fundamentals of Data Engineering lens:** Use for source systems, ingestion,
  batch/stream processing, data quality, freshness, lineage, orchestration,
  analytical data products, governance, lifecycle boundaries, and operational
  data pipelines.
- **AI Agents in Action lens:** Use for agent goals, autonomy, tools, MCP,
  deterministic orchestration, bounded specialists, prompt/instruction stacks,
  structured outputs, retrieval, memory, tracing, evaluation, feedback loops,
  human-in-the-loop control, and multi-agent coordination.
- **A Philosophy of Software Design lens:** Use for module depth, information
  hiding, interface design, complexity, change amplification, temporal coupling,
  shallow modules, error abstraction, and keeping design knowledge in one place.
- **Head First Design Patterns lens:** Use for concrete pattern vocabulary when
  it clarifies the design, such as Strategy, Adapter, Facade, Command,
  Observer, State, Template Method, Decorator, Factory Method, Abstract Factory,
  Proxy, or Chain of Responsibility.

Rules for lens notes:

- A section can have all five lenses, a subset of lenses, one lens, or no lens.
- A single decision can have multiple lens notes when the lenses clarify
  different tradeoffs.
- Place lens notes beside the design decision, boundary, contract, workflow, or
  data flow they clarify.
- Do not collect lens notes into a detached glossary.
- Do not force a data lens onto UI-only work.
- Do not force an agent lens onto deterministic code unless an agent boundary,
  tool contract, prompt, evaluation, or human approval decision is involved.
- Do not force a design-pattern lens where a plain function, type, or module is
  clearer than naming a pattern.
- Every lens note must explain the concept in plain language and say exactly how
  this design uses it.

Use this lens-note format:

> **DDIA lens - <concept>:** Define the concept in plain language and say how
> this design uses it.

> **FODE lens - <concept>:** Define the concept in plain language and say how
> this design uses it.

> **AIAIA lens - <concept>:** Define the concept in plain language and say how
> this design uses it.

> **APOSD lens - <concept>:** Define the concept in plain language and say how
> this design uses it.

> **HFDP lens - <concept>:** Define the concept in plain language and say how
> this design uses it.

## Diagram policy

Include execution/data-flow diagrams only when they make the design easier to
understand.

- Include one end-to-end ASCII diagram when the design crosses several
  components, modules, workflows, data stores, external systems, or human
  approval gates.
- Include more than one diagram when separate paths need separate explanations.
- Omit diagrams when the spec is clearer without one.
- Diagrams must reflect the scanned codebase and proposed design, not a generic
  architecture template.
- Label external systems, trust boundaries, source-of-record boundaries,
  validation points, persistence points, agent/model boundaries, and human
  approval gates when applicable.
- Prefer execution/data flow over decorative architecture diagrams.
- After every diagram, explain what crosses each boundary, what is validated,
  what is persisted, what remains source of record, where agent/model behavior
  is allowed, where human approval is required, and what the system never does.

Reusable diagram skeleton, only when it fits the codebase:

```text
EXTERNAL SYSTEM / USER / SCHEDULED TRIGGER
        |
        v
+--------------------------------------------------+
| Source boundary / adapter                         |
| Validate input, normalize shape, preserve proof   |
+------------------------+-------------------------+
                         |
                         v
+--------------------------------------------------+
| Deterministic core                                |
| Readiness, routing, validation, permissions       |
+------------------------+-------------------------+
                         |
             +-----------+-----------+
             |                       |
             v                       v
+------------------------+  +-----------------------+
| Persistence / tracing  |  | Bounded agent/model   |
| State, artifacts, logs |  | Structured proposal   |
+-----------+------------+  +-----------+-----------+
            |                           |
            +-------------+-------------+
                          v
+--------------------------------------------------+
| Human approval / user-facing result               |
| Manual action, accepted proposal, or safe stop     |
+--------------------------------------------------+
```

## Required document format

# <Feature Name> Design

**Date:** YYYY-MM-DD
**Status:** Proposed design, pending review
**Depends on:** <relevant existing specs, tickets, plans, modules, or none>

## Goal

State the concrete outcome in 1-3 paragraphs.

Explain who benefits, what the system will be able to do after the design, and
what success looks like. Keep this outcome grounded in the scanned repo and the
source context.

Add lens notes here only when a lens clarifies the goal or success criteria.

## Why This Exists

Describe what is already implemented, what is missing or mismatched, why this
specific seam or capability is needed, and what is explicitly not being rebuilt.

Separate evidence from inference:

- **Evidence:** Files, modules, tests, commands, specs, traces, or docs that
  prove current behavior.
- **Inference:** Plausible conclusions from names or structure that are not
  directly proven.
- **Unknown:** Decisions that need owner input, production traces, external
  docs, or future discovery.

Add lens notes here only when they clarify why the current system shape creates
the design need.

## Scope

List the capabilities this design adds.

For each capability, state:

- User-visible or operator-visible behavior.
- Internal boundary or module affected.
- Data, state, or artifact it reads.
- Data, state, or artifact it writes.
- Whether AI/agent behavior is involved.
- Whether human approval is required.

## Non-goals

List what remains out of scope.

Call out unrelated platforms, future generalization, dashboards or UI not needed
for the first slice, automatic production writes, raw-data warehousing when
aggregates suffice, migrations not needed for the first release, and performance
work that can wait.

## Architecture

Explain the proposed architecture in prose first.

Include:

- Existing boundaries that stay intact.
- New boundary, seam, module, adapter, workflow, or interface being added.
- External systems and which side owns each contract.
- Deterministic core responsibilities.
- Agent/model responsibilities, if any.
- Persistence and tracing responsibilities.
- Human approval or manual-action responsibilities.
- Why this design is smaller or safer than obvious alternatives.

### Terms and design patterns

Define project-specific terms and map them to established patterns only when
that vocabulary improves the design.

| Pattern / term | Meaning in this design |
| --- | --- |
| <local term or pattern> | <specific meaning in this repo> |

### Execution/data-flow diagram

Include zero, one, or many ASCII diagrams depending on the scanned codebase.

If useful, show the primary runtime path here. If separate paths matter, give
each path its own short subsection and diagram.

After each diagram, explain ownership boundaries:

- Which component owns collection.
- Which component owns validation.
- Which component owns interpretation.
- Which component owns lifecycle routing.
- Which component owns persistence.
- Which component owns production actions.
- Which component owns human approval.

Add lens notes beside the architectural decision they clarify.

Examples:

> **APOSD lens - information hiding:** This design keeps provider-specific
> details behind the adapter boundary so the core workflow can depend on a small
> contract instead of scattered provider assumptions.

> **HFDP lens - Strategy:** The design uses a constrained strategy selector only
> for the behavior that varies, instead of duplicating the whole workflow.

## Contracts and Data Flow

Define conceptual input and output contracts in TypeScript-like pseudocode. Use
the repository's dominant language if TypeScript is not appropriate.

For each contract, specify:

- Owner.
- Producer.
- Consumer.
- Allowed fields.
- Prohibited fields.
- Runtime validation.
- Provenance fields.
- Freshness or observed-period fields.
- Missing, incomplete, unavailable, or stale states.
- Whether it is persisted.
- Whether it can cross an agent/model boundary.

Explain the end-to-end data flow in numbered steps. If an ASCII data-flow
diagram would clarify the contract path, include one here.

Add lens notes when they clarify contract shape.

Examples:

> **DDIA lens - schema evolution:** A discriminated contract lets the system add
> a new input kind without changing the meaning of historical records.

> **FODE lens - data-quality contract:** Freshness, coverage, and missingness
> are first-class fields so downstream consumers do not mistake partial input
> for complete evidence.

## Workflow Behavior

Describe each important workflow path.

For every path, define:

- Trigger or entry point.
- Entry criteria.
- Deterministic readiness gates.
- Validation rules.
- State transitions.
- Valid outcomes.
- Wait, stop, retry, rejection, and failure behavior.
- Whether AI or agents are allowed.
- Whether human approval is required.
- What evidence proves the path.

If there are multiple paths, give each path its own subsection and optional
ASCII flow.

Add lens notes where they clarify workflow correctness, lifecycle boundaries, or
agent control.

Example:

> **AIAIA lens - human-in-the-loop control:** The model can produce a structured
> proposal, but the workflow cannot perform a production-changing action until a
> human explicitly approves the proposal.

## Module Responsibilities

Use a table when modules, stages, services, commands, or adapters exist.

| Stage / component | Responsibility | Deterministic or agent-assisted | Inputs | Outputs |
| --- | --- | --- | --- | --- |
| <component> | <owned behavior> | <deterministic/agent-assisted> | <inputs> | <outputs> |

Rules:

- Keep measurement, validation, routing, permissions, and persistence
  deterministic.
- Constrain agent-assisted modules to interpretation, summarization, proposal,
  or review unless the source request explicitly requires more autonomy.
- Make ownership clear enough that a future implementation plan can assign
  tasks without rediscovering boundaries.
- Avoid naming a design pattern unless it improves the reader's understanding.

Add lens notes where they clarify module boundaries.

Example:

> **APOSD lens - deep module:** The module exposes a small service API while
> hiding validation, routing, trace, and persistence complexity.

## Persistence, Tracing, and Idempotence

Describe:

- What is persisted.
- What remains a source system of record.
- Which artifacts are immutable.
- Which references point to external or local evidence.
- Which fields are never persisted.
- How retries avoid duplicate effects.
- How backfills or replays behave, if applicable.
- How trace/event boundaries are named.
- How prompts, model turns, tool calls, and agent outputs are traced when AI is
  involved.
- How credentials, raw provider data, customer data, and private values are
  excluded from state, traces, logs, examples, and fixtures.

Add lens notes if data lineage, derived data, immutable history, batching,
idempotence, tracing, or feedback loops are relevant.

## Failure Handling and Safety

Use a table when failure cases matter.

| Condition | Deterministic behavior | User/operator result | Evidence retained |
| --- | --- | --- | --- |
| Missing or malformed input | <behavior> | <result> | <evidence> |
| Partial or stale source data | <behavior> | <result> | <evidence> |
| Agent schema failure | <behavior> | <result> | <evidence> |
| Provider/API failure | <behavior> | <result> | <evidence> |
| Human rejection | <behavior> | <result> | <evidence> |
| Result evidence is insufficient | <behavior> | <result> | <evidence> |

Rules:

- Never claim a metric that the underlying source cannot actually prove.
- Never treat missing data, zero values, stale data, and malformed data as the
  same condition.
- Never allow retries to duplicate external side effects.
- Never make the agent responsible for enforcing permissions that code can
  enforce.
- State safe degradation behavior.

## Testing Strategy

List concrete test categories and essential cases.

Use the repository's actual test tools and command conventions.

Include relevant categories:

1. Contract validation and privacy tests.
2. Deterministic gate and policy tests.
3. Adapter/integration tests using fakes and fixed clocks.
4. Workflow route, wait-state, and failure-state tests.
5. Persistence, tracing, idempotence, and replay tests.
6. Approval/no-write tests.
7. Agent structured-output and schema-failure tests.
8. Evaluation or feedback-loop tests when agent behavior is involved.
9. End-to-end fake evidence-to-artifact tests.
10. Existing behavior regression tests.

For each category, say what it proves and what it does not prove.

## Decisions and Deferred Work

For each major decision, state:

- Decision.
- Rationale.
- Tradeoff.
- Evidence from the repo.
- Alternatives considered.
- Why alternatives were rejected or deferred.

Then list deliberately deferred work. Do not hide deferred work inside vague
phrases.

## Done Means

Give numbered, observable acceptance criteria.

Each criterion should be verifiable by code review, tests, docs, traces,
fixtures, or a user/operator action.

Include acceptance criteria for:

- The user-visible or operator-visible behavior.
- Contract boundaries.
- Persistence/tracing behavior.
- Safety and approval behavior.
- Regression safety for existing behavior.
- Documentation or runbook updates, if applicable.

## Final self-review

Before saving:

1. Confirm the spec is based on repository evidence, not invented architecture.
2. Confirm the section order matches this required format.
3. Confirm every proposed capability maps to scope and acceptance criteria.
4. Confirm all diagrams, if present, match the written boundaries and real
   execution/data flow.
5. Confirm lens notes are useful and not forced.
6. Confirm the spec distinguishes current behavior, proposed design, deferred
   work, inference, and unknowns.
7. Confirm no implementation plan, task checklist, code changes, secrets, raw
   private data, provider payloads, or production URLs appear.
8. Confirm AI/agent behavior, if present, has deterministic validation,
   structured outputs, tracing, and human approval boundaries.
9. Confirm there are no TODO, TBD, vague placeholders, or contradictions.

Then save the specification and report:

- Exact file path.
- 3-5 bullet summary.
- The main boundary or seam the spec defines.
- Which lenses were used and why.
- Whether diagrams were included or intentionally omitted.
- Any open question that should be answered before implementation planning.
- That implementation planning is intentionally deferred until review.
````
