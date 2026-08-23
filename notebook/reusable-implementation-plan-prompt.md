# Reusable Implementation-Plan Prompt

Copy the prompt below into any coding agent. Replace only the request section.

````text
You are writing an implementation plan for an existing codebase.

Your job is to inspect the repository first, then produce one grounded,
task-by-task implementation plan. Do not implement code, modify files, create
commits, or invent capabilities that do not exist in the repo.

Follow repository instructions first, including any AGENTS.md, CLAUDE.md,
GEMINI.md, README, architecture docs, package scripts, test conventions, and
recent git history. Treat existing code, tests, specs, traces, fixtures, and
committed plans as evidence.

If an important product or technical decision is genuinely unknown, ask one
concise question before writing the plan. Otherwise, make the most conservative
repo-consistent assumption and state it.

## Request

Create an implementation plan for:

<DESCRIBE THE FEATURE, INTEGRATION, REFACTOR, BUGFIX, OR ARCHITECTURAL CHANGE>

## Source spec or context

Use this source spec, ticket, design document, issue, or conversation context:

<LINK OR PASTE THE RELEVANT SPEC/TICKET/CONTEXT>

If there is no source spec, first reverse-engineer the relevant code path and
write the plan from the observed repository behavior.

## Output location

Save the plan at:

docs/superpowers/plans/YYYY-MM-DD-<concise-topic>-implementation-plan.md

Use today's date and a concise kebab-case topic. If this repository uses a
different documented convention, follow that convention instead.

## Planning principles

- Explain the intended change as a vertical slice through the existing system.
- Describe current behavior before planned behavior.
- Preserve existing public APIs, data contracts, tests, and user behavior unless
  the request explicitly changes them.
- Keep the first slice small enough to verify with focused tests.
- Prefer repository patterns over new abstractions.
- Make boundaries explicit: external systems, adapters, contracts,
  deterministic core, AI/agent boundary, persistence, tracing, user-facing
  actions, and approval gates.
- Separate deterministic logic from agent/model interpretation.
- Require structured outputs, schema validation, and human approval before any
  production-changing action when AI or agents are involved.
- Never put raw credentials, tokens, private customer data, provider payloads,
  production URLs, or secret values in examples, fixtures, state, traces, or
  diagrams.
- Do not use TODO, TBD, vague placeholders, or "handle appropriately."
- Each task must be independently reviewable and should end with focused
  verification.
- Each task should commit only after its focused tests pass.
- Include exact commands based on the repository's package scripts and tooling.
- If a command is uncertain, inspect the repo before naming it.
- Do not create a plan that requires real network calls, real provider writes,
  live credentials, or a real `.env` in tests.

## Lens policy

Use DDIA, Fundamentals of Data Engineering, and AI Agents in Action as optional
learning lenses. Apply a lens only where the scanned codebase and the planned
task make the lens genuinely useful.

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

Rules for lens notes:

- A task can have all three lenses, one lens, or no lens.
- A section can have multiple lens notes, one note, or none.
- Place lens notes beside the task, decision, interface, or flow they clarify.
- Do not collect lens notes into a detached glossary.
- Do not force a data lens onto UI-only work.
- Do not force an agent lens onto deterministic code unless an agent boundary,
  tool contract, prompt, evaluation, or human approval decision is involved.
- Every lens note must explain the concept in plain language and say exactly how
  this plan uses it.

## Diagram policy

Include ASCII execution/data-flow diagrams only when they make the plan easier
to understand.

- Include one end-to-end diagram when the work crosses several components,
  modules, workflows, data stores, external systems, or human approval gates.
- Include more than one diagram when separate paths need separate explanations.
- Omit diagrams when the plan is clearer without one.
- If a diagram is included, map numbered boxes to plan tasks where practical.
- Diagrams must reflect the scanned codebase and planned changes, not a generic
  architecture template.
- Label external systems, trust boundaries, source-of-record boundaries,
  validation points, persistence points, agent/model boundaries, and human
  approval gates when applicable.
- Prefer execution/data flow over decorative architecture diagrams.

## Required document format

# <Feature Name> Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use the repository's normal
> implementation workflow. If this environment supports `superpowers`, use
> `superpowers:subagent-driven-development` for independent task execution or
> `superpowers:executing-plans` for sequential execution. Steps use checkbox
> (`- [ ]`) syntax for tracking.

**Goal:** State the concrete outcome in 1-3 sentences.

**Architecture:** Explain the intended architecture in one compact paragraph.
Name the existing boundaries being preserved and the new boundary, seam, or
module being added.

**Tech Stack:** List the relevant languages, frameworks, libraries, test tools,
storage mechanisms, build tools, and local scripts discovered in the repo.

**Spec:** Link to the source spec, ticket, design doc, issue, or context. If no
source spec exists, say `Spec: none; plan derived from repository inspection`.

## Global Constraints

List non-negotiable constraints as bullets.

Include constraints for:

- Existing behavior and compatibility that must not break.
- External systems that must not be called in tests.
- Credentials, secrets, private data, raw provider payloads, and production URLs
  that must not be persisted, logged, traced, or committed.
- Deterministic validation, routing, permissions, and approval gates.
- Date/time behavior, fixed clocks, fakes, fixtures, and idempotence.
- Human approval or no-write requirements.
- Commit boundaries.

## File Structure Map

Include a concise file map of planned changes.

Use this format:

```text
path/to/file.ts                         # why this file changes or is created
path/to/existing-file.test.ts           # focused tests for the behavior
path/to/another-file.ts                 # integration boundary, adapter, CLI, etc.
```

Rules:

- Include only files that matter to the implementation.
- Mark files as create or modify in the surrounding text if needed.
- Mention files intentionally left untouched when that prevents a bad design
  direction.
- Do not invent file paths without checking repository conventions.

Add lens notes immediately after the file map only if they clarify the boundary
or module layout.

Example:

> **DDIA lens - schema evolution:** A discriminated persisted union lets the
> system add a new input kind without changing the meaning of historical runs.

> **Fundamentals of Data Engineering lens - curated consumption:** A validated
> artifact boundary lets downstream consumers use aggregate evidence without
> reinterpreting raw provider data.

> **AI Agents in Action lens - bounded agent context:** Agent modules receive
> only validated, scoped context and cannot access credentials or provider
> payloads.

## End-to-End Execution/Data Flow

If useful, include one or more ASCII diagrams showing how the planned tasks
connect when the feature runs.

The diagram may be omitted when it would not clarify the plan. If included,
write a short lead-in sentence like:

```text
This execution/data flow shows how the implementation-plan tasks connect at
runtime. Each numbered box maps to a task below.
```

Diagram guidelines:

```text
EXTERNAL SYSTEM / USER / SCHEDULED TRIGGER
        |
        v
+--------------------------------------------------+
| [Task 1] Boundary or adapter                      |
| Validate input, normalize shape, reject unsafe    |
| fields, preserve provenance                       |
+------------------------+-------------------------+
                         |
                         v
+--------------------------------------------------+
| [Task 2] Deterministic policy / domain logic      |
| Readiness, routing, qualification, idempotence    |
+------------------------+-------------------------+
                         |
                         v
+--------------------------------------------------+
| [Task 3] Persistence / workflow / API seam        |
| Store state, trace events, expose narrow methods  |
+------------------------+-------------------------+
                         |
                         v
+--------------------------------------------------+
| [Task 4] User-visible command / UI / output       |
| Human review, approval, result, or final response |
+--------------------------------------------------+
```

After each diagram, explain:

- What crosses each boundary.
- What is validated.
- What is persisted.
- What remains source of record.
- Where agent/model behavior is allowed, if anywhere.
- Where human approval is required, if anywhere.
- What the system never does.

## Shared Interfaces

Define the conceptual interfaces in TypeScript-like pseudocode when contracts
matter. Use the repository's dominant language if TypeScript is not appropriate.

Include:

- Input types.
- Output types.
- Runtime schemas or validators.
- Service or module interfaces.
- Important discriminated unions.
- Persisted state shape.
- CLI/API command shape.
- Agent/tool schemas when AI is involved.

Rules:

- Keep pseudocode concise and implementation-oriented.
- Do not over-specify internals that should remain private to a task.
- Say which definitions must be runtime-validated.
- Say which values are references rather than raw provider data.
- Say which fields are prohibited.

Add lens notes after the interface section only when a lens clarifies why the
contract is shaped that way.

## Tasks

Break the work into numbered tasks. Each task must be small enough to implement,
test, review, and commit independently.

Task order should normally be:

1. Contracts, schemas, or boundary validation.
2. Deterministic domain logic.
3. Persistence, state, routing, or shared engine changes.
4. Product/profile/module integration.
5. Result, feedback, or lifecycle closure.
6. UI, CLI, API, or user-facing entry point.
7. Final compatibility and safety verification.

Use only the tasks that fit the request. Do not force all seven categories.

### Task N: <imperative task title>

**Purpose:** Explain the direct outcome of this task.

**Why:** Explain the problem this task solves and why it belongs at this layer.

**How:** Explain the implementation approach in concrete repo terms.

**Learning lenses:**

Include this subsection only when one or more lenses apply. If no lens applies,
omit the subsection entirely.

- **DDIA lens - <concept>:** Define the concept in plain language and say how
  this task uses it.
- **FODE lens - <concept>:** Define the concept in plain language and say how
  this task uses it.
- **AIAIA lens - <concept>:** Define the concept in plain language and say how
  this task uses it.

**Files:**

- Create: `path/to/new-file`
- Modify: `path/to/existing-file`
- Test: `path/to/focused-test`

**Interfaces:**

- Consumes: existing types, modules, files, APIs, fixtures, or commands.
- Produces: new or changed functions, schemas, services, commands, states, or
  artifacts.

- [ ] **Step 1: Write focused failing tests**

Describe the tests to add before implementation. Include short code snippets
only when they clarify exact behavior.

```ts
it('describes the expected behavior in repository terms', () => {
  expect(result).toMatchObject({ status: 'expected' });
});
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `<exact focused test command>`

Expected: FAIL because `<missing function/schema/behavior>`.

- [ ] **Step 3: Implement the smallest behavior that satisfies the tests**

Describe the concrete implementation. Include important pseudocode when useful.

```ts
export function plannedFunction(input: Input): Output {
  // Keep this snippet short; real implementation belongs in the task.
}
```

Implementation rules:

- Keep the change scoped to the files named above.
- Preserve existing behavior unless this task explicitly changes it.
- Use runtime validation at untrusted boundaries.
- Use fakes, fixtures, and fixed clocks in tests.
- Do not call real external systems.
- Do not persist or log prohibited data.

- [ ] **Step 4: Run focused verification**

Run: `<exact focused test command> && <exact typecheck/lint command if relevant>`

Expected: PASS, including the edge cases named in this task.

- [ ] **Step 5: Commit this task**

```bash
git add <task files>
git commit -m "<type>: <short task summary>"
```

Commit only the files for this task.

## Spec Coverage Review

Add a table mapping each source-spec requirement to one or more plan tasks.

| Design requirement | Plan task |
| --- | --- |
| <requirement> | Task <N> |

Rules:

- Include every important requirement from the source spec or ticket.
- If a requirement is intentionally deferred, map it to `Deferred After This
  Plan` and explain why.
- If the source spec is missing a necessary requirement, list it as an
  assumption or open question before the task list.

## Deferred After This Plan

List work intentionally excluded from this implementation plan.

Examples:

- Scheduling, dashboard UI, or notification workflows.
- Additional providers, products, or source packs.
- Automatic production writes.
- Performance tuning beyond the first safe slice.
- Backfills or migrations not required for the first release.

## Final self-review

Before saving:

1. Confirm every task is independently implementable and reviewable.
2. Confirm task order follows dependency order.
3. Confirm each task starts with focused failing tests unless the task is purely
   verification or documentation.
4. Confirm every command exists in the repo or is clearly marked as newly added
   by a task.
5. Confirm lens notes are useful and not forced.
6. Confirm diagrams, if present, match the planned tasks and scanned codebase.
7. Confirm the plan names exact files and avoids invented architecture.
8. Confirm no secrets, raw private data, provider payloads, or production URLs
   appear.
9. Confirm implementation is deferred; this output is only a plan.

Then save the implementation plan and report:

- Exact file path.
- 3-5 bullet summary.
- The main boundary or seam the plan defines.
- The first task to execute.
- Any open question that should be answered before implementation.
````
