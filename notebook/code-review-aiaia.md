# AI Agents in Action Code-Review Prompt Library

Quick-reference for reviewing a change with an AI coding agent, using *AI Agents in Action* as the question framework. Use this lens when a diff changes prompts, agents, tools, MCP integrations, retrieval, memory, planning, tracing, evaluation, feedback, or multi-agent orchestration.

A normal review asks:

```text
Does this code work?
Are there bugs?
Are there tests?
```

An AI Agents in Action review also asks:

```text
What goal is this agent trying to complete?
Which layer changed: persona, tools/actions, reasoning/planning,
knowledge/memory, or evaluation/feedback?
Can we trace the sense-plan-act-learn loop?
Are tools scoped, typed, reliable, and observable?
Are outputs structured enough for downstream consumers?
How are grounding, failure, cost, and feedback measured?
```

AI Agents in Action should **complement, not replace** reviews for ordinary correctness, security, privacy, maintainability, product behavior, accessibility, and data guarantees.

---

## Index

| #  | Prompt                                                                      | What it does                                                        | Reach for it when                                      |
| -- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| *  | [**Compact daily**](#compact-daily-code-review-prompt)                      | 12-point pass in one shot, blocking vs optional                     | Default for agent-related diffs                        |
| 0  | [**Master**](#0-master-ai-agents-in-action-code-review-prompt)              | Full 15-point review -> 5 finding buckets                           | Bigger or higher-risk agent changes                    |
| 1  | [**Understand the change**](#1-understand-the-change-first)                 | Reconstructs agent behavior before critique                         | First -- do not review what you do not understand      |
| 2  | [**Agent goal and boundary**](#2-review-agent-goal-scope-and-autonomy)      | Goal, autonomy, approval boundary, success criteria                 | Any agent behavior changed                             |
| 3  | [**Persona and instructions**](#3-review-persona-and-instructions)          | Role, task contract, prompt clarity, delimiters                     | Prompts or system instructions changed                 |
| 4  | [**Sense-plan-act-learn**](#4-review-the-sense-plan-act-learn-loop)         | Perception, planning, action, observation, feedback                 | Agent loop or workflow changed                         |
| 5  | [**Tools and actions**](#5-review-tools-actions-and-mcp-contracts)          | Tool schemas, MCP, permissions, failure behavior                    | Tools, actions, connectors, MCP servers changed        |
| 6  | [**Reasoning and planning**](#6-review-reasoning-and-planning-control)      | Decomposition, ReAct, plan limits, loop control                     | Multi-step task behavior changed                       |
| 7  | [**Knowledge and memory**](#7-review-knowledge-retrieval-and-memory)        | RAG, memory, retrieval, compression, stale context                  | Retrieval or memory changed                            |
| 8  | [**Typed outputs**](#8-review-typed-inputs-outputs-and-handoffs)            | Schemas, structured outputs, workflow handoffs                      | JSON/schema/tool handoffs changed                      |
| 9  | [**Grounding and safety**](#9-review-grounding-safety-and-human-control)    | Evidence, approvals, guardrails, unsafe autonomy                    | User-impacting or external actions changed             |
| 10 | [**Tracing and observability**](#10-review-tracing-and-observability)       | Traces, logs, token/cost/latency, tool-call visibility              | Production/debuggability risk                          |
| 11 | [**Evaluation and feedback**](#11-review-evaluation-feedback-and-tdad)      | Test-driven agent development, rubrics, feedback loops              | Evals, benchmarks, critics, or feedback changed        |
| 12 | [**Multi-agent design**](#12-review-multi-agent-orchestration)              | Routing, handoffs, hub-and-spoke, collaboration                     | Multiple agents or orchestrators changed               |
| 13 | [**Cost and performance**](#13-review-cost-latency-and-token-budget)        | Token budget, model choice, latency, tool overhead                  | Model/tool/context cost changes                        |
| 14 | [**Failure and recovery**](#14-review-failure-handling-and-recovery)        | Timeouts, retries, fallbacks, partial actions, repair               | Production reliability matters                         |
| 15 | [**Tests as agent evidence**](#15-review-tests-as-agent-behavior-evidence)  | Tests prove agent behavior, not only mocks                          | Reviewing test changes                                 |
| A  | [**AI-generated change**](#a-reviewing-an-ai-generated-agent-change)        | Skeptical pass for agent-specific AI mistakes                       | Diff came from an agent                                |
| B  | [**Single agent path**](#b-review-a-single-agent-path)                      | Zoomed review of one goal-to-result path                            | Investigating one agent workflow                       |
| C  | [**New tool or MCP server**](#c-review-a-new-tool-action-or-mcp-server)     | Whether new capability earns its complexity                         | New external action/tool introduced                    |
| D  | [**Eval or feedback change**](#d-review-an-evaluation-or-feedback-change)   | Reviews benchmark, rubric, critic, grounding, feedback              | Evaluation system changed                              |
| E  | [**Review comments**](#e-producing-useful-review-comments)                  | Concrete, actionable, severity-tagged output                        | Turning findings into PR comments                      |

Reference (not prompts): [Review workflow](#recommended-review-workflow) - [Manual questions](#questions-to-remember-during-manual-review) - [The four reviews](#the-overall-model)

---

## Compact daily code-review prompt

**What it does:** Runs the agent review as a single 12-point pass and separates blocking problems from optional improvements.

```text
Review this diff using principles from AI Agents in Action.

Focus on:

1. Behavioral correctness and user-visible outcome
2. Agent goal, scope, autonomy, and approval boundary
3. Persona and instruction quality
4. Sense-plan-act-learn loop
5. Tools, actions, MCP contracts, and permissions
6. Reasoning and planning control
7. Knowledge, retrieval, and memory
8. Typed inputs, structured outputs, and workflow handoffs
9. Grounding, safety, and human control
10. Tracing, observability, cost, latency, and token budget
11. Evaluation, feedback, rubrics, and TDAD coverage
12. Failure handling and recovery

For every finding, provide:

- Evidence
- Concrete consequence
- Severity
- Realistic agent run, tool-call, retrieval, planning, or feedback scenario
- Smallest recommended improvement

Separate blocking issues from optional design improvements.

Do not recommend more autonomy, more tools, more agents, or more memory unless
the goal and evidence justify the added cost and failure surface.
```

---

## 0. Master AI Agents in Action code-review prompt

**What it does:** The full 15-point review producing five finding buckets. Each finding must tie to a concrete agent run, user goal, tool action, retrieval result, evaluation result, cost, or failure scenario.

```text
Review this change using principles from AI Agents in Action.

Do not focus only on whether the happy-path prompt response looks plausible.

Evaluate:

1. What user or system goal the agent is supposed to complete.
2. Whether the implementation matches the intended product behavior.
3. Which agent layer changed: persona, actions/tools, reasoning/planning,
   knowledge/memory, or evaluation/feedback.
4. Whether the agent's scope, autonomy, approval boundary, and success criteria
   are explicit.
5. Whether prompts are front-loaded, delimited, specific, non-contradictory, and
   contract-shaped.
6. Whether the sense-plan-act-learn loop is visible and bounded.
7. Whether tools and MCP integrations are single-purpose, typed, permissioned,
   observable, and designed for failure.
8. Whether reasoning and planning have loop limits, confidence gates, and a
   recovery path for uncertainty.
9. Whether retrieval, knowledge, and memory are relevant, current, scoped, and
   not overstuffed into prompts.
10. Whether structured outputs are stable enough for downstream tools, agents,
   or users.
11. Whether grounding, safety checks, and human approval boundaries are
   appropriate for the action being taken.
12. Whether traces, logs, metrics, token counts, latency, costs, and tool calls
   are observable.
13. Whether evaluation and feedback prove the desired behavior across good,
   bad, edge, and adversarial examples.
14. Whether multi-agent routing, delegation, and handoffs are necessary and
   understandable.
15. Whether failure handling, retries, fallback, and partial-action recovery are
   safe.

Separate findings into:

- Goal, persona, and instruction issues
- Tool/action, autonomy, and safety issues
- Retrieval, memory, and structured-output issues
- Evaluation, observability, and feedback issues
- Cost, performance, and operability issues

For every finding:

- Cite the prompt, file, tool schema, eval, trace, route, agent, config, or test
- Explain the concrete consequence
- Give a realistic run sequence or failure scenario
- Suggest the smallest reasonable improvement
- Mark it as blocking, important, or optional

Clearly separate behavior proven by traces, evals, tests, and tool schemas from
behavior merely hoped for because the prompt says so.
```

---

## 1. Understand the change first

**What it does:** Forces the agent reviewer to reconstruct actual behavior before judging it.

```text
Explain this agent change before reviewing it.

Identify:

- User or system goal
- Entry points affected
- Agent or agents involved
- Persona or instruction changes
- Tools/actions/MCP servers involved
- Reasoning or planning flow
- Knowledge, retrieval, or memory used
- Input and output schemas
- Human approval points
- External side effects
- Tracing, logging, metrics, and evals
- Existing behavior being replaced
- Important safety, cost, latency, and reliability assumptions

Separate what is directly confirmed by the diff from what you inferred.
```

---

## 2. Review agent goal, scope, and autonomy

**What it does:** Checks whether the agent has a clear job and a safe autonomy boundary.

```text
Review the agent's goal, scope, and autonomy boundary.

Identify:

- Goal
- User intent served
- Inputs
- Outputs
- Success criteria
- Non-goals
- Actions the agent may take
- Actions requiring approval
- Actions it must never take
- Stopping condition
- Failure or uncertainty path

Look for:

- Vague "helpful assistant" scope
- Agent allowed to act without clear success criteria
- Autonomy broader than the product need
- No explicit human approval boundary
- No stopping condition
- No "insufficient evidence" path
- Product behavior hidden inside prompt prose

For each concern, describe the bad run the current design permits.
```

---

## 3. Review persona and instructions

**What it does:** Reviews prompts as operating contracts rather than prose.

```text
Review all persona, system, developer, tool, and task instructions changed by
this patch.

Check whether instructions:

- Put role, objective, constraints, and output format first
- Use clear delimiters for data, examples, and user input
- Avoid contradictions
- Prefer positive instructions
- Specify evidence requirements
- Specify output shape
- Specify when to ask for clarification
- Specify when to stop
- Include an uncertainty path
- Avoid stale runtime facts that should be injected dynamically

Look for:

- Persona without task boundary
- Long prompt prose hiding the actual job
- Output format buried near the end
- Few-shot examples that conflict with rules
- "Do not hallucinate" without evidence mechanics
- Runtime facts hard-coded into static prompts
- Prompt instructions compensating for weak tool schemas

Treat prompts like API contracts: unclear contract means variable agent behavior.
```

---

## 4. Review the sense-plan-act-learn loop

**What it does:** Checks whether the agent loop is explicit, bounded, observable, and connected to feedback.

```text
Review the sense-plan-act-learn loop for this change.

Identify:

- Sense: what input, state, retrieval, or observation the agent receives
- Plan: how it decomposes or selects next steps
- Act: which tools, responses, or external actions it can take
- Learn: what feedback, trace, eval, memory, or observation updates behavior
- Loop limits
- Stopping condition
- Recovery path

Look for:

- Acting before enough context is sensed
- Planning with no execution constraints
- Tool action with no observation handling
- Feedback collected but not used
- Unbounded loops
- Repeated failed tool calls
- No distinction between temporary observation and durable memory

For each issue, show the run sequence that exposes it.
```

---

## 5. Review tools, actions, and MCP contracts

**What it does:** Reviews tools as external action boundaries with schemas, permissions, observability, and failure behavior.

```text
Review every tool, action, function call, MCP server, or connector introduced or
changed by this patch.

For each one, identify:

- Purpose
- Inputs and types
- Output shape
- Permissions
- Side effects
- Idempotency
- Timeout behavior
- Retry behavior
- Error shape
- Observability
- Human approval requirement
- Why the agent needs this tool

Look for:

- Broad tools that do many unrelated things
- Ambiguous names or docstrings
- Untyped or unstable outputs
- Missing permission checks
- Dangerous side effects without approval
- Tool failures returned as plain text the agent may misread
- Prompt clutter that belongs in the tool schema
- Too many tools increasing context, cost, and selection errors

Prefer narrow, typed tools with explicit failure payloads.
```

---

## 6. Review reasoning and planning control

**What it does:** Checks whether non-trivial tasks have enough planning structure without creating uncontrolled loops.

```text
Review reasoning and planning behavior.

Identify:

- Planning strategy
- Decomposition boundary
- ReAct-style thought/action/observation loop, if present
- Sequential plan, tree, or self-consistency use
- Max iterations
- Confidence gates
- Self-review step
- Escalation or clarification path
- Criteria for switching strategy

Look for:

- Plan generated but not followed
- Agent continuing after low confidence
- Agent stuck retrying the same action
- No cap on exploration
- Over-planning simple tasks
- Hidden chain of agents where one prompt would suffice
- No self-check before final answer

Planning exists to make action more reliable, not to make the system look agentic.
```

---

## 7. Review knowledge, retrieval, and memory

**What it does:** Reviews RAG, knowledge, and memory as scoped context systems, not prompt stuffing.

```text
Review retrieval, knowledge, and memory changes.

Identify:

- Knowledge sources
- Retrieval query
- Embedding or search strategy
- Metadata filters
- Ranking or reranking
- Context budget
- Memory type: conversational, semantic, episodic, procedural, or other
- Write policy
- Read policy
- Expiration or pruning
- Privacy boundary

Look for:

- Stuffing large context directly into prompts
- Retrieval without grounding citations
- Memory written from unverified claims
- Stale or irrelevant memories influencing behavior
- Sensitive data persisted without policy
- No distinction between user preference and factual knowledge
- No way to debug why a memory or document was used

Require evidence that retrieved context is relevant and traceable.
```

---

## 8. Review typed inputs, outputs, and handoffs

**What it does:** Checks whether outputs are stable enough for tools, agents, and workflows.

```text
Review all inputs, outputs, and handoffs.

Identify:

- Input schema
- Output schema
- Required fields
- Optional fields
- Error fields
- Versioning
- Downstream consumer
- Validation
- Parsing behavior
- Fallback behavior

Look for:

- Free prose consumed by code
- JSON examples without validation
- Missing error shape
- Downstream agents relying on wording
- Schema drift between agents
- Output fields with ambiguous meaning
- No test for malformed or partial outputs

Prefer typed outputs for multi-step or multi-agent workflows.
```

---

## 9. Review grounding, safety, and human control

**What it does:** Reviews whether the agent is grounded in evidence and controlled before high-impact actions.

```text
Review grounding, safety, and human control.

Identify:

- Claims that require evidence
- Sources used for grounding
- Guardrails
- Approval gates
- User confirmation points
- Unsafe or irreversible actions
- Sensitive data exposure
- Policy or compliance constraints
- Red-team or adversarial tests

Look for:

- Confident final answers without citations or traces
- Agent action before user approval
- External API calls with irreversible side effects
- Prompt injection through retrieved content
- Tool outputs trusted without validation
- Safety checks only in prompt text
- No refusal or escalation path

For each risk, describe the concrete user harm or system harm.
```

---

## 10. Review tracing and observability

**What it does:** Checks whether developers can understand agent behavior after a run.

```text
Review tracing and observability for this agent change.

Determine whether traces or logs capture:

- User goal
- Model and settings
- Prompt version
- Retrieval query and selected context
- Tool calls and arguments
- Tool outputs and errors
- Agent plan and step outcomes
- Latency
- Token usage
- Cost
- Evaluation result
- Feedback result
- Final output

Look for:

- No run ID
- No prompt version
- Tool calls invisible in logs
- Token and cost not tracked
- Retrieval not inspectable
- Eval failures disconnected from traces
- Logs containing sensitive data

An agent that cannot be traced cannot be debugged.
```

---

## 11. Review evaluation, feedback, and TDAD

**What it does:** Checks whether behavior is measured with benchmarks, rubrics, critic agents, human feedback, and regression tests.

```text
Review evaluation and feedback changes.

Identify:

- Evaluation goal
- Benchmark dataset
- Golden examples
- Wrong examples
- Edge cases
- Adversarial cases
- Rubric
- Grounding check
- Critic or evaluator agent
- Human feedback path
- Pass threshold
- Repetition count for stochastic behavior
- Regression tracking

Look for:

- Only happy-path examples
- Eval that scores formatting but not task success
- Feedback collected but not acted on
- No grounding evaluation for RAG
- Single-run pass treated as stable
- Rubric too vague to fail bad behavior
- Evaluation agent with no calibration
- No link from eval failure to prompt/tool/model change

Test-driven agent development means benchmarks guide the minimum change needed.
```

---

## 12. Review multi-agent orchestration

**What it does:** Reviews whether multiple agents are necessary, coordinated, and observable.

```text
Review the multi-agent design.

Identify:

- Agents involved
- Topology: assembly line, hub-and-spoke, collaboration, or other
- Router or orchestrator
- Handoff payloads
- Shared state
- Ownership of final answer
- Conflict resolution
- Failure behavior
- Trace boundaries
- Cost of each agent turn

Look for:

- Multiple agents where one agent with tools would suffice
- Handoff through unstructured prose
- No clear owner of final output
- Agents duplicating work
- Infinite delegation or ping-pong
- Hidden shared memory causing stale state
- No trace tying sub-agent outputs to final answer

More agents should buy clearer decomposition, not more mystery.
```

---

## 13. Review cost, latency, and token budget

**What it does:** Reviews model, prompt, retrieval, tool, and multi-agent cost.

```text
Review cost, latency, and token budget.

Identify:

- Model choice
- Temperature and generation settings
- Prompt length
- Retrieval context length
- Tool-call count
- Agent turn count
- Max output tokens
- Parallelism
- Retry behavior
- Expected request volume
- Cost per successful run
- Latency budget

Look for:

- Expensive model used for routing or simple classification
- Long static prompts repeated every run
- Retrieval overfetching context
- Tool calls that duplicate model work
- Multi-agent handoffs for simple tasks
- Retries that multiply cost
- No token or cost telemetry

Cost is part of production behavior, not an afterthought.
```

---

## 14. Review failure handling and recovery

**What it does:** Reviews timeouts, retries, fallbacks, partial actions, and repair.

```text
Review agent failure handling.

Identify what happens when:

- Model call times out
- Tool call fails
- Tool returns partial data
- Retrieval returns irrelevant data
- Schema validation fails
- Agent has low confidence
- User denies approval
- External side effect partly succeeds
- Evaluator flags the output
- Budget or iteration limit is reached

Look for:

- Retrying unsafe actions
- Swallowing tool errors
- Final answer after failed grounding
- No fallback model or degraded path
- Partial side effects with no repair
- Failure messages that expose internals or secrets
- No incident signal for repeated failures

Failure paths should be visible, bounded, and recoverable.
```

---

## 15. Review tests as agent behavior evidence

**What it does:** Determines whether tests prove agent behavior rather than only exercising mocks.

```text
Review tests added or changed by this patch.

Determine whether they verify:

- User-visible task success
- Persona and instruction contract
- Tool selection
- Tool argument shape
- Tool error handling
- Retrieval grounding
- Memory read/write policy
- Structured output validation
- Planning loop limits
- Approval gates
- Multi-agent handoffs
- Tracing metadata
- Cost or token budget
- Eval regression cases
- Safety and adversarial cases

Look for:

- Tests that mock away the behavior under review
- One happy-path prompt snapshot
- No malformed tool output case
- No failed retrieval case
- No repeated runs for stochastic behavior
- No eval for grounding or evidence
- Tests coupled to exact prose instead of contract

Separate unit tests, integration tests, evals, red-team tests, and optional load
or cost tests.
```

---

## A. Reviewing an AI-generated agent change

**What it does:** Applies extra skepticism to common agent-code mistakes made by agents.

```text
Review this AI-generated agent change skeptically.

Look specifically for:

- Over-broad persona
- Prompt prose instead of explicit contract
- Tool schemas invented but not wired
- Tool permissions missing
- Free-text output parsed by code
- More agents added without decomposition need
- Memory used without write policy
- Retrieval added without grounding checks
- Evals that cannot fail bad behavior
- Tracing omitted
- Token and cost ignored
- Infinite or unbounded planning loops
- Human approval skipped for external actions
- Safety checks only described in comments or prompts
- Confident claims without evidence path

For each finding, require a concrete run, tool, retrieval, eval, or failure
scenario.
```

---

## B. Review a single agent path

**What it does:** Zooms in on one goal-to-result path.

```text
Review [agent path] using AI Agents in Action principles.

Identify:

- User goal
- Entry point
- Persona/instruction stack
- Sensed context
- Plan
- Tool actions
- Observations
- Retrieval or memory used
- Structured outputs
- Handoffs
- Approval gates
- Final result
- Trace evidence
- Eval or feedback evidence
- Cost and latency
- Failure behavior

Then answer:

1. Does the path complete the intended goal?
2. Is the autonomy boundary safe?
3. Are tool calls necessary and correctly typed?
4. Is the output grounded and structured?
5. Can the run be debugged from traces?
6. What fails when one step returns bad data?
7. Which behavior is proven and which is assumed?
```

---

## C. Review a new tool, action, or MCP server

**What it does:** Tests whether new agent capability earns its cost and risk.

```text
Review the new tool, action, connector, or MCP server.

Identify:

- Capability it gives the agent
- Goal that requires it
- Inputs
- Outputs
- Side effects
- Permissions
- Error contract
- Timeout and retry policy
- Idempotency
- Observability
- Approval boundary
- Alternatives
- Operational owner

Classify it as:

- Necessary now
- Reasonable and low-risk
- Too broad
- Under-specified
- Unsafe without approval
- Better expressed as retrieval or static context
- Unnecessary complexity
```

---

## D. Review an evaluation or feedback change

**What it does:** Reviews whether evaluation actually measures agent quality.

```text
Review this eval, benchmark, rubric, critic, grounding check, or feedback loop.

Identify:

- Behavior being measured
- Dataset or examples
- Negative examples
- Rubric
- Pass threshold
- Repetition count
- Evaluator model or code
- Feedback storage
- Regression workflow
- How failures change prompts, tools, models, or routing

Look for:

- Eval disconnected from user goal
- No wrong examples
- Rubric that cannot fail vague answers
- Grounding evaluated by style instead of evidence
- One run treated as stable
- Human feedback stored but never reviewed
- Eval result not linked to trace

Explain what bad agent behavior would still pass this eval.
```

---

## E. Producing useful review comments

**What it does:** Converts findings into actionable PR comments.

```text
Turn the review findings into actionable pull-request comments.

For each comment, include:

- Severity: blocking, important, or optional
- File, prompt, tool, schema, eval, trace, or agent
- Concrete agent behavior problem
- Why it matters
- Realistic run, tool, retrieval, eval, cost, or failure scenario
- Smallest recommended improvement

Avoid vague comments:

- "Improve the prompt."
- "Add evals."
- "Use memory."
- "Make this safer."
- "Add tracing."

Instead explain:

- Which instruction is ambiguous
- Which tool call can fail
- Which output is unparseable
- Which action needs approval
- Which eval would catch the regression
- Which trace field is missing
- Which cost grows with usage
```

---

## Recommended review workflow

### Pass 1 -- Understand behavior

Run:

```text
1. Understand the change first
2. Review agent goal, scope, and autonomy
3. Review persona and instructions
```

Goal:

```text
Understand what the agent is supposed to do and where its boundary sits.
```

### Pass 2 -- Review agent mechanics

Run:

```text
4. Review the sense-plan-act-learn loop
5. Review tools, actions, and MCP contracts
6. Review reasoning and planning control
7. Review knowledge, retrieval, and memory
8. Review typed inputs, outputs, and handoffs
```

Goal:

```text
Determine whether the agent can act predictably and hand off stable state.
```

### Pass 3 -- Review production controls

Run:

```text
9. Review grounding, safety, and human control
10. Review tracing and observability
11. Review evaluation, feedback, and TDAD
12. Review multi-agent orchestration
```

Goal:

```text
Determine whether behavior is safe, measurable, and debuggable.
```

### Pass 4 -- Review operating envelope

Run:

```text
13. Review cost, latency, and token budget
14. Review failure handling and recovery
15. Review tests as agent behavior evidence
```

Goal:

```text
Determine whether the agent can run reliably at real usage.
```

### Pass 5 -- Produce comments

Run:

```text
E. Producing useful review comments
```

---

## Questions to remember during manual review

```text
What goal does the agent serve?
What autonomy does it have?
Where must it stop or ask approval?
Which layer changed: persona, tools, planning, knowledge, memory, evaluation?
Can I trace sense -> plan -> act -> learn?
Are tools typed, narrow, permissioned, and observable?
Are outputs structured enough for the next consumer?
What grounding proves the answer?
What memory can be written, read, forgotten, or misused?
What happens when retrieval is wrong?
What happens when a tool fails?
What does the trace show?
What eval would catch a regression?
How much does one successful run cost?
Which behavior is proven?
Which behavior is only assumed?
```

---

## The overall model

A complete agent code review contains four different reviews:

```text
Behavior review
    Does the agent accomplish the intended user or system goal?

Layer review
    Are persona, tools/actions, planning, knowledge/memory, and
    evaluation/feedback each doing the right job?

Control review
    Is autonomy bounded by grounding, approvals, schemas, tracing, and evals?

Operational review
    Can the agent fail, recover, scale, and be debugged at acceptable cost?
```

---

## Agent-evidence rule

Never accept:

```text
The agent is reliable because the prompt tells it to be careful.
```

Require:

```text
The prompt states the role, boundary, evidence rule, output schema, and
uncertainty path.

Tool schemas constrain actions and return typed errors.

Traces show prompts, retrieval, tool calls, outputs, cost, and latency.

Evals include good, bad, edge, and adversarial cases, and failures feed back
into prompt, tool, model, or routing changes.
```

Likewise:

```text
Prompt instruction != guarantee
Tool access != safe action
Memory != truth
Retrieval != grounding
JSON example != typed output
Trace exists != useful observability
Eval exists != meaningful benchmark
More agents != better decomposition
Retry != recovery
Autonomy != product value
```

---

## Final code-review principle

The goal is not to ask:

```text
Does this agent look smart?
```

The better sequence is:

```text
What goal is it allowed to pursue?
What context can it sense?
How does it plan?
Which actions can it take?
How does it observe results?
What does it learn or remember?
How is it grounded?
How is it evaluated?
How can we trace and debug it?
What happens when it is wrong, slow, expensive, or unsafe?
```

The real review is about controlled agency: bounded goals, reliable tools, inspectable reasoning, grounded outputs, measured behavior, and recoverable failure.
