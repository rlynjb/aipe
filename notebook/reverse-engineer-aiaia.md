# AI Agents in Action Reverse-Engineering Prompt Library

Quick-reference for reverse-engineering an existing app, feature, workflow, or platform component with an AI coding agent, using *AI Agents in Action* as the question framework. The agent is the explorer, trace reader, behavior analyst, orchestration critic, and tutor; AIAIA gives it better questions about goals, autonomy, tools, memory, planning, evaluation, and feedback.

The core question AIAIA asks of any agentic system:

```text
What goal is the agent trying to achieve, what does it sense, how does it plan,
which actions can it take, what state or knowledge does it rely on, and how does
the system learn whether the behavior was good?
```

A normal explanation says: *`SupportAgent` reads a ticket, calls search, and drafts a reply.*

An AIAIA explanation asks: *What user goal defines success? Which instructions shape the agent's persona? Which tools can change external state? What evidence grounds the answer? Where can planning drift? What trace proves the path taken? Which eval or feedback loop catches regressions?* Those questions reveal the real **agent system**, not just the prompt and tool list.

**Always separate evidence from inference.** Otherwise agents present assumed goals, safety boundaries, tool contracts, memory behavior, reasoning quality, and evaluation coverage as if they were proven by the implementation.

---

## Index

| #  | Prompt                                                                                         | What it does                                                       | Reach for it when                                      |
| -- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| 0  | [**Master reverse-engineering**](#0-master-reverse-engineering-prompt)                         | Full 13-point pass -> 10-section report                           | Start here on any unfamiliar agent workflow            |
| 1  | [**Goal and autonomy contract**](#1-establish-the-goal-and-autonomy-contract)                  | Defines what the agent is allowed to decide or do                  | Before studying prompts or tools                       |
| 2  | [**Find entry points**](#2-find-the-real-entry-points)                                         | Routes, commands, jobs, UI actions, hooks, and background paths    | Do not trust the first prompt you find                 |
| 3  | [**Trace one agent run**](#3-trace-one-agent-run)                                              | Follows one concrete request through sensing, planning, acting     | Need ground truth about behavior                       |
| 4  | [**Sense-plan-act-learn loop**](#4-map-the-sense-plan-act-learn-loop)                          | Reconstructs the core agent loop                                   | Building the behavioral model                          |
| 5  | [**Five agent layers**](#5-map-the-five-agent-layers)                                          | Persona, tools, planning, knowledge/memory, evaluation             | Need the AIAIA system map                              |
| 6  | [**Persona and instructions**](#6-analyze-persona-and-instructions)                            | System prompts, developer prompts, policies, examples, tone        | Behavior depends on prompt design                      |
| 7  | [**Tools, actions, and MCP**](#7-investigate-tools-actions-and-mcp)                            | Tool schemas, permissions, side effects, retries, approvals        | The agent can call tools or mutate state               |
| 8  | [**Reasoning and planning**](#8-analyze-reasoning-and-planning-control)                        | ReAct, plan-execute, routing, decomposition, stopping conditions   | The agent coordinates multi-step work                  |
| 9  | [**Knowledge, retrieval, and memory**](#9-map-knowledge-retrieval-and-memory)                  | RAG, files, context, conversation memory, persisted state          | Answers depend on retrieved or remembered information  |
| 10 | [**Typed outputs and handoffs**](#10-map-typed-outputs-and-handoffs)                           | JSON schemas, structured responses, downstream consumers           | Agent output feeds code, APIs, workflows, or UI        |
| 11 | [**Observability**](#11-investigate-tracing-and-observability)                                 | Traces, spans, prompts, tool calls, model turns, state snapshots   | Need to debug or audit behavior                        |
| 12 | [**Evaluation and feedback**](#12-investigate-evaluation-and-feedback)                         | Evals, TDAD, graders, human review, feedback loops                 | Need confidence that behavior is improving             |
| 13 | [**Multi-agent topology**](#13-map-multi-agent-topology)                                       | Managers, specialists, critics, handoffs, consensus, conflicts     | Multiple agents or roles collaborate                   |
| 14 | [**Safety and human control**](#14-analyze-safety-and-human-control)                           | Approvals, grounding, escalation, refusal, policy, sandboxing      | Tools or outputs carry risk                            |
| 15 | [**Failure, cost, and latency**](#15-analyze-failure-cost-and-latency)                         | Timeouts, fallback, token budget, retry storms, partial results    | Production behavior is expensive or unreliable         |
| 16 | [**Unknown unknowns**](#16-find-unknown-unknowns)                                              | Hidden prompts, model defaults, implicit tools, manual workflows   | Before trusting any clean explanation                  |
| A  | [**AIAIA scorecard**](#a-aiaia-agent-system-scorecard)                                         | 1-5 scores across agent-system dimensions                          | After the RE pass, want a summary                      |
| B  | [**Architecture-teaching**](#b-architecture-teaching-prompt)                                   | Teaches the system as if you will rebuild the agent                | Studying agent engineering through real code           |
| C  | [**Current vs ideal**](#c-compare-current-and-ideal-agent-designs)                             | Existing implementation vs an AIAIA-informed design                | Want to evaluate the gap                               |

Reference (not prompts): [RE model chain](#the-aiaia-reverse-engineering-model) - [Multi-pass workflow](#recommended-multi-pass-workflow)

---

## The AIAIA reverse-engineering model

Instead of merely generating a prompt or service diagram, have the agent reconstruct this chain:

```text
User goal or external trigger
    |
Agent contract: scope, autonomy, permissions, success criteria
    |
Entry point: route, command, job, UI action, event, or handoff
    |
Sense: input, context assembly, retrieval, memory, state snapshots
    |
Plan: routing, reasoning pattern, decomposition, stopping condition
    |
Act: model call, tool call, MCP command, workflow mutation, output
    |
Learn: trace, evaluation, feedback, human correction, memory update
    |
Operational controls:
observability, safety, approvals, cost, latency, failure handling
```

Agent systems are rarely a single loop in production. They often contain routers, specialist agents, fallback models, hidden retrieval, background graders, manually reviewed outputs, and implicit defaults supplied by SDKs. Reverse engineering should record the actual behavior, not force it into a clean diagram.

---

## 0. Master reverse-engineering prompt

**What it does:** The full first pass - 13 investigation points producing a 10-section report. Explicitly forces evidence-vs-inference separation so assumed goals, tool safety, planning behavior, memory, and evaluation coverage are not presented as facts. Use this first.

```text
Reverse-engineer this agent, AI workflow, prompt chain, or agentic feature using
principles from AI Agents in Action.

Do not modify the code yet.

Your goal is to explain:

1. What user goal, business process, developer workflow, or operational task the
   agent exists to accomplish.
2. What autonomy the agent has: what it can decide, what it can only recommend,
   what requires approval, and what it must never do.
3. Where execution begins: UI events, API routes, CLI commands, scheduled jobs,
   webhooks, background workers, event listeners, or handoffs from other agents.
4. The end-to-end path for one important agent run: input, context assembly,
   prompt construction, model call, tool calls, state changes, final output, and
   follow-up work.
5. The agent's persona and instruction stack: system prompt, developer prompt,
   user prompt, examples, constraints, policies, delimiters, output contract, and
   conflict resolution.
6. The available actions: tools, MCP servers, APIs, filesystem access, browser
   control, database writes, messages, deployments, approvals, retries, and
   side effects.
7. The reasoning and planning pattern: one-shot answer, ReAct loop,
   plan-execute, router-specialist, critic loop, evaluator loop, or custom
   state machine.
8. The knowledge and memory model: static docs, repo files, RAG, search,
   conversation history, user preferences, persisted memory, caches, and
   freshness rules.
9. The typed interfaces: input schemas, output schemas, structured model
   responses, tool schemas, handoff payloads, UI state, and downstream contracts.
10. The observability surface: traces, spans, prompts, completions, model turns,
    tool calls, intermediate state, errors, screenshots, artifacts, and audit
    logs.
11. The evaluation and feedback loop: unit tests, fixture replays, LLM-as-judge,
    human review, TDAD-style evals, production feedback, regression suites, and
    improvement workflow.
12. The safety and human-control model: grounding, refusal, confirmation gates,
    sandboxing, secrets handling, data exposure, rate limits, escalation paths,
    and recovery behavior.
13. The operational envelope: latency, token cost, model choice, fallback,
    concurrency, timeout behavior, retry behavior, partial failure, and
    degradation.

Return a 10-section report:

1. Executive summary
2. Agent goal and autonomy contract
3. Entry points and invocation paths
4. End-to-end run trace
5. Five-layer agent map:
   - persona / instruction layer
   - action / tool layer
   - reasoning / planning layer
   - knowledge / memory layer
   - evaluation / feedback layer
6. Data and control-flow diagram in text
7. Observability and debugging evidence
8. Safety, approvals, and failure model
9. Gaps, risks, and unknowns
10. What to inspect next

Rules:

- Cite concrete files, symbols, routes, prompts, schemas, tests, traces, and
  config.
- Separate "Evidence" from "Inference" in every major section.
- Do not infer safety, grounding, memory, or eval coverage from good naming.
- If the system uses an SDK, identify behavior supplied by the SDK versus local
  code.
- If the system uses multiple agents, map handoffs and ownership of final
  authority.
- If behavior cannot be proven from code or traces, say what evidence would
  prove it.
```

---

## 1. Establish the goal and autonomy contract

**What it does:** Explains what the agent is for before studying implementation details. This prevents the reverse-engineering pass from becoming a prompt inventory with no success criteria.

```text
Reverse-engineer the goal and autonomy contract for this agentic feature.

Do not modify code.

Find and explain:

1. The user goal or operational job the agent is supposed to complete.
2. The user-visible promise: what outcome the user expects.
3. The internal success criteria: tests, evals, score thresholds, states,
   artifacts, tickets, or deployment outcomes.
4. What the agent can decide on its own.
5. What the agent can only suggest.
6. What actions require confirmation, approval, or external review.
7. What actions are forbidden by prompt, policy, sandbox, code, or product
   design.
8. What happens when the agent is uncertain.
9. What happens when the agent cannot complete the task.
10. Where this contract is documented, encoded, implied, or missing.

Return:

- Goal statement.
- Autonomy table:
  - autonomous decisions
  - recommendation-only areas
  - confirmation-required actions
  - forbidden actions
- Evidence from files and traces.
- Ambiguities that could cause unsafe or inconsistent behavior.
```

---

## 2. Find the real entry points

**What it does:** Finds every path that can start the agent. This is essential because agent behavior often hides behind UI actions, job queues, route handlers, plugin hooks, scheduled tasks, or tool callbacks.

```text
Find every real entry point for this agentic workflow.

Search for:

1. API routes, handlers, controllers, server actions, and RPC methods.
2. CLI commands, scripts, package tasks, and developer tools.
3. UI buttons, forms, command palettes, keyboard shortcuts, and workflow
   triggers.
4. Queue consumers, scheduled jobs, background workers, and event listeners.
5. Webhooks or inbound integrations.
6. Agent-to-agent handoffs.
7. Tool callbacks that can restart or continue execution.
8. Test fixtures, replay harnesses, eval runners, and local-only paths.
9. Feature flags, config, env vars, or model settings that switch behavior.
10. Deprecated or legacy paths that still call the agent.

For each entry point, report:

- File and symbol.
- Trigger type.
- Input shape.
- Authentication or permission check.
- Model/prompt/tool path it reaches.
- Output or side effect.
- Whether it is production, test, local, or legacy.

End with the smallest set of entry points someone must read to understand the
real behavior.
```

---

## 3. Trace one agent run

**What it does:** Grounds the entire reverse-engineering pass in one concrete execution path. Without a run trace, agent explanations easily become speculative diagrams.

```text
Trace one representative agent run end to end.

Pick an important scenario. If no scenario is specified, choose the most common
or highest-risk path.

Explain:

1. The starting input and trigger.
2. How request state, user state, repo state, app state, or external state is
   loaded.
3. How context is selected, summarized, retrieved, filtered, or truncated.
4. How the prompt or message list is built.
5. Which model is called and where model parameters are configured.
6. Which tools are made available.
7. How the agent decides whether to answer, call a tool, ask a question, stop,
   retry, escalate, or hand off.
8. Every tool call, side effect, artifact, or state change.
9. How final output is validated, parsed, rendered, stored, or delivered.
10. Which traces, logs, tests, screenshots, fixtures, or saved artifacts prove
    the path.

Return:

- Step-by-step trace.
- Call graph or data-flow list.
- Prompt/context construction notes.
- Tool-call sequence.
- Evidence references.
- Inferences and missing proof.
```

---

## 4. Map the sense-plan-act-learn loop

**What it does:** Reconstructs the core loop behind the agent. Use it to avoid a shallow explanation that treats the prompt as the whole system.

```text
Map the sense-plan-act-learn loop for this agent.

For "sense", identify:

- User input.
- Application state.
- Repo or file context.
- Retrieved documents.
- Memory.
- Tool results.
- External services.
- Prior model turns.

For "plan", identify:

- Explicit planning prompt.
- Hidden planning logic.
- Routing rules.
- Decomposition logic.
- Stopping conditions.
- Critic or reflection steps.
- Model choice.

For "act", identify:

- Tool calls.
- API calls.
- File edits.
- Database writes.
- Messages or notifications.
- UI updates.
- Generated artifacts.
- Final answer.

For "learn", identify:

- Traces.
- Evals.
- Human feedback.
- Conversation memory.
- Regression fixtures.
- Error classification.
- Prompt changes.
- Model or tool tuning.

Return a loop diagram in text, then list where the loop is explicit, implicit,
or missing.
```

---

## 5. Map the five agent layers

**What it does:** Uses the AIAIA five-layer model to organize the system. This is the best prompt after the master pass when you need a clean map.

```text
Map this agent using five layers:

1. Persona and instructions.
2. Actions and tools.
3. Reasoning and planning.
4. Knowledge and memory.
5. Evaluation and feedback.

For each layer, report:

- Files and symbols that implement it.
- Configuration and runtime inputs.
- External services it depends on.
- Data it consumes.
- Data or state it produces.
- Who owns or can change it.
- How it fails.
- How behavior is tested or evaluated.
- What is hard-coded, configurable, inferred, or missing.

Then explain how the layers interact in one concrete run.

End with:

- The deepest layer of accidental complexity.
- The layer with the weakest evidence.
- The layer most likely to explain surprising behavior.
```

---

## 6. Analyze persona and instructions

**What it does:** Reverse-engineers the instruction layer: system prompts, developer prompts, examples, delimiters, policies, tone, and output rules.

```text
Analyze the persona and instruction layer for this agent.

Find:

1. System prompts, developer prompts, user prompt templates, tool instructions,
   policy snippets, and hidden defaults.
2. Personas, roles, goals, values, voice, or behavioral style.
3. Delimiters, context labels, input framing, and quoted evidence formats.
4. Few-shot examples and counterexamples.
5. Output format instructions, schemas, length constraints, and refusal rules.
6. Priority rules between system, developer, user, retrieved context, memory, and
   tool output.
7. Dynamic prompt construction and prompt injection surfaces.
8. Duplicate, stale, contradictory, or overly broad instructions.
9. Places where code relies on prompt text instead of enforceable validation.
10. Tests or evals that prove instruction-following.

Return:

- Instruction stack ordered by priority.
- Prompt construction flow.
- Risks caused by vague or conflicting language.
- Behavioral assumptions that should be enforced in code, schema, or evals.
```

---

## 7. Investigate tools, actions, and MCP

**What it does:** Finds what the agent can actually do. This is the highest-risk layer when tools can mutate files, data, infrastructure, money, or messages.

```text
Investigate the action layer for this agent.

Identify every tool, action, API, MCP command, browser command, filesystem
operation, database operation, external integration, and generated artifact.

For each action, report:

- Tool name and implementation.
- Schema and validation.
- Required permissions.
- Read-only or write-capable behavior.
- External side effects.
- Idempotency behavior.
- Retry and timeout behavior.
- Error shape returned to the agent.
- Confirmation or approval gate.
- Audit logging.
- Test coverage.

Then answer:

1. Can the agent choose unsafe arguments?
2. Can tool results inject instructions back into the agent?
3. Can the agent confuse read-only and write-capable tools?
4. Can retries duplicate side effects?
5. Can failures leave partial state?
6. Can a user or external service trick the agent into exceeding scope?

End with the minimum tool contract someone must understand before changing this
agent.
```

---

## 8. Analyze reasoning and planning control

**What it does:** Reconstructs how the agent coordinates multi-step work and how the system prevents drift, loops, and unbounded autonomy.

```text
Analyze the reasoning and planning control for this agent.

Find whether the system uses:

- One-shot prompting.
- Chain-of-thought-like hidden reasoning.
- ReAct loops.
- Plan-execute loops.
- Router-specialist patterns.
- Critic or evaluator loops.
- Behavior trees.
- State machines.
- Multi-agent delegation.
- Human-in-the-loop planning.

For the chosen pattern, explain:

1. Where the plan is represented.
2. How plan steps are created, updated, and stopped.
3. What evidence the agent must gather before acting.
4. How it decides to use tools.
5. How it handles contradictory evidence.
6. How it detects completion.
7. How it avoids loops or runaway tool calls.
8. How it handles uncertainty.
9. Whether the reasoning path is visible in traces.
10. Which tests or evals cover planning failures.

Return:

- Planning model.
- Control-flow diagram.
- Stopping conditions.
- Drift risks.
- Evidence gaps.
```

---

## 9. Map knowledge, retrieval, and memory

**What it does:** Explains where the agent gets facts and how stale, irrelevant, private, or ungrounded context can affect behavior.

```text
Map knowledge, retrieval, and memory for this agent.

Find:

1. Static instructions and embedded domain knowledge.
2. Repo/file context.
3. Documentation search.
4. Web search or external retrieval.
5. Vector indexes or RAG pipelines.
6. Database lookups.
7. Conversation history.
8. User preferences or profile memory.
9. Long-term persisted memory.
10. Tool results cached or reused across turns.
11. Freshness, invalidation, and source-priority rules.
12. Redaction and access-control rules.

For each source, report:

- Where it is loaded.
- How it is ranked or selected.
- How much of it enters the model context.
- How citations or evidence are preserved.
- How stale or conflicting information is handled.
- Whether it can carry prompt injection.
- Whether tests prove grounding.

End with a groundedness assessment: which claims can the agent prove, and which
claims can it only infer?
```

---

## 10. Map typed outputs and handoffs

**What it does:** Finds the contracts around structured responses, downstream consumers, and agent-to-agent handoffs.

```text
Map typed outputs and handoffs for this agent.

Find:

1. Input schemas and request validators.
2. Message types and conversation-state schemas.
3. Tool-call schemas.
4. Structured model output schemas.
5. Parsers and repair logic.
6. UI state or rendering contracts.
7. API responses.
8. Agent-to-agent handoff payloads.
9. Saved artifacts.
10. Downstream jobs, actions, or humans consuming the output.

For each contract, report:

- Schema location.
- Producer.
- Consumer.
- Validation behavior.
- Error behavior.
- Backward-compatibility requirements.
- Examples or fixtures.
- Missing fields or ambiguous semantics.

Then explain whether correctness depends on:

- The model following instructions.
- Code validation.
- Type checking.
- Runtime schema validation.
- Human review.
- Downstream tolerance.
```

---

## 11. Investigate tracing and observability

**What it does:** Explains whether an engineer can debug the agent from evidence instead of guessing.

```text
Investigate tracing and observability for this agent.

Find:

1. Request IDs, conversation IDs, run IDs, trace IDs, and artifact IDs.
2. Model calls and model parameters.
3. Prompt/message snapshots.
4. Retrieved context snapshots.
5. Tool-call inputs and outputs.
6. Intermediate plans, state transitions, and handoffs.
7. Errors and retry attempts.
8. Token usage, latency, cost, and model selection.
9. Safety decisions, approvals, and refusals.
10. Saved fixtures, replays, screenshots, and generated artifacts.
11. Production logs, metrics, traces, dashboards, and alerting.
12. Privacy, redaction, and retention of observability data.

Return:

- What can be reconstructed after a bad run.
- What is visible only in development.
- What is hidden or lost.
- Which missing signal makes debugging hardest.
- A minimal trace shape that would make future failures explainable.
```

---

## 12. Investigate evaluation and feedback

**What it does:** Reverse-engineers how the system knows whether the agent is good. This includes tests, human review, LLM graders, replay fixtures, and feedback-driven improvement.

```text
Investigate evaluation and feedback for this agent.

Find:

1. Unit tests around prompt assembly, schemas, tools, and control flow.
2. Integration tests around complete agent runs.
3. Golden fixtures, replay harnesses, and saved traces.
4. LLM-as-judge graders, rubric prompts, and scorer thresholds.
5. Human review, approval, labeling, or correction workflows.
6. Production telemetry used as feedback.
7. Regression suites for prompt, model, retrieval, and tool changes.
8. TDAD-style workflow: test definition, agent behavior, diagnosis, and design
   change.
9. How failed evals are triaged.
10. How feedback becomes code, prompt, memory, tool, or data changes.

Return:

- Eval inventory.
- What each eval proves.
- What each eval does not prove.
- Feedback loop from failure to improvement.
- Blind spots that could let bad agent behavior ship.
```

---

## 13. Map multi-agent topology

**What it does:** Explains how multiple agents, roles, or subflows coordinate. Use this when the system has managers, specialists, reviewers, critics, evaluators, or handoffs.

```text
Map the multi-agent topology.

Find:

1. Every agent, role, specialist, critic, evaluator, router, and tool-like
   subagent.
2. Who creates each agent.
3. What instructions and tools each agent receives.
4. What information each agent can see.
5. What output each agent produces.
6. How handoffs are represented.
7. Who owns final authority.
8. How conflicts are resolved.
9. How failures in one agent affect the others.
10. Whether agents can loop, duplicate work, or hide uncertainty.
11. What traces prove the collaboration.
12. What evals cover cross-agent behavior.

Return:

- Topology diagram in text.
- Agent responsibility table.
- Handoff contract table.
- Conflict and authority model.
- Risks caused by role overlap, missing context, or weak final review.
```

---

## 14. Analyze safety and human control

**What it does:** Reconstructs the controls that prevent the agent from exceeding user intent, leaking data, mutating unsafe state, or fabricating unsupported conclusions.

```text
Analyze safety and human control for this agent.

Find:

1. Approval gates and confirmation prompts.
2. Read/write permission boundaries.
3. Sandbox restrictions.
4. Authentication and authorization checks.
5. Secret handling.
6. Private-data redaction.
7. Prompt-injection defenses.
8. Grounding and citation requirements.
9. Refusal and escalation behavior.
10. Rate limits and abuse controls.
11. Destructive-action controls.
12. Human review workflow.
13. Recovery and rollback workflow.

For each control, report:

- Where it is enforced.
- Whether enforcement is prompt-only or code-enforced.
- What evidence proves it works.
- How it can fail.
- What happens when it fails.

End with the highest-risk autonomous action and the evidence required before
trusting it in production.
```

---

## 15. Analyze failure, cost, and latency

**What it does:** Explains the operating envelope. Agent systems often fail through timeouts, expensive loops, degraded retrieval, flaky tools, or partial completion.

```text
Analyze failure, cost, and latency for this agent.

Find:

1. Model choice and fallback behavior.
2. Token budgets and truncation strategy.
3. Context growth across turns.
4. Tool-call latency.
5. Retry behavior.
6. Timeout behavior.
7. Concurrency and queueing.
8. Rate limits.
9. Partial-result behavior.
10. User cancellation.
11. Cost tracking.
12. Degradation modes.
13. Recovery behavior after failed runs.

Return:

- Latency path for one run.
- Cost drivers.
- Failure modes.
- Retry and fallback map.
- Places where the agent can spend tokens or time without improving evidence.
- Whether the user receives a useful partial result when the run cannot finish.
```

---

## 16. Find unknown unknowns

**What it does:** Hunts for hidden behavior before trusting the explanation. Use near the end of the reverse-engineering pass.

```text
Look for unknown unknowns in this agentic system.

Search for:

1. Prompts outside the obvious prompt directory.
2. SDK defaults that inject instructions, tools, schemas, or behavior.
3. Model settings in environment variables or remote config.
4. Tool implementations outside the local repo.
5. Feature flags and experiments.
6. Legacy agents, fallback agents, and test-only agents reused in production.
7. Hidden retrieval paths.
8. Memory or preference stores not referenced from the main flow.
9. Background evals, graders, or feedback jobs.
10. Manual review steps documented outside code.
11. Production-only behavior.
12. Permission behavior supplied by hosting, plugins, connectors, or external
    services.
13. Observability data that is sampled, redacted, or missing locally.
14. Places where generated text becomes executable input.

Return:

- Confirmed hidden paths.
- Suspicious but unproven paths.
- Search terms used.
- Files inspected.
- Questions that require production traces, docs, or owner knowledge.
```

---

## A. AIAIA agent-system scorecard

**What it does:** Produces a compact 1-5 scorecard after the reverse-engineering pass. The scores are not a substitute for evidence; they make the findings easier to compare.

```text
Score this agentic system from 1 to 5 in each category.

Categories:

1. Goal clarity.
2. Autonomy boundaries.
3. Persona and instruction quality.
4. Tool/action contract quality.
5. Planning and control-flow clarity.
6. Knowledge grounding and memory hygiene.
7. Typed interfaces and output validation.
8. Observability and traceability.
9. Evaluation and feedback maturity.
10. Safety and human-control enforcement.
11. Multi-agent coordination, if applicable.
12. Cost, latency, and failure handling.

For each score, provide:

- Score.
- Evidence.
- Why it is not higher.
- What would change the score.

End with:

- The strongest layer.
- The weakest layer.
- The highest-risk assumption.
- The next most valuable inspection.
```

---

## B. Architecture-teaching prompt

**What it does:** Teaches the agent system as if the reader will rebuild it. Use this for learning AIAIA through a real codebase, not for proposing a rewrite.

```text
Teach me this agentic system using AI Agents in Action as the teaching frame.

Do not propose changes yet.

Explain the system in this order:

1. The user goal and why an agent is used instead of a normal deterministic
   workflow.
2. The autonomy contract: what the agent can and cannot decide.
3. The sense-plan-act-learn loop.
4. The five layers:
   - persona and instructions
   - actions and tools
   - reasoning and planning
   - knowledge and memory
   - evaluation and feedback
5. The main run trace from trigger to final output.
6. The tool and handoff contracts.
7. The observability and debugging story.
8. The safety and approval model.
9. The eval and feedback story.
10. The failure, cost, and latency envelope.

For each section:

- Start with the plain-English idea.
- Point to concrete files and symbols.
- Give one example run.
- Separate evidence from inference.
- Name one thing a new engineer would likely misunderstand.

End with a glossary of the local agent terms used by this codebase.
```

---

## C. Compare current and ideal agent designs

**What it does:** Compares the current implementation against an AIAIA-informed design without erasing real constraints.

```text
Compare the current agent design with an idealized design informed by AI Agents
in Action.

Do not rewrite code.

For each area, describe:

1. Current behavior.
2. Evidence.
3. Why the current design may be reasonable.
4. What an ideal design would add or clarify.
5. Cost, complexity, and risk of moving toward the ideal.

Areas:

- Goal and autonomy contract.
- Persona and instruction layer.
- Tool/action layer.
- Reasoning and planning layer.
- Knowledge and memory layer.
- Typed output and handoff layer.
- Observability layer.
- Evaluation and feedback layer.
- Safety and human-control layer.
- Failure, cost, and latency envelope.

End with:

- Changes that would improve understanding without changing behavior.
- Changes that would improve safety.
- Changes that would improve eval confidence.
- Changes that are probably not worth doing yet.
```

---

## Recommended multi-pass workflow

Use these prompts in passes instead of asking for everything at once:

```text
Pass 1 - Establish reality
0. Master reverse-engineering prompt
1. Goal and autonomy contract
2. Find the real entry points
3. Trace one agent run

Pass 2 - Reconstruct the agent layers
4. Sense-plan-act-learn loop
5. Five agent layers
6. Persona and instructions
7. Tools, actions, and MCP
8. Reasoning and planning
9. Knowledge, retrieval, and memory
10. Typed outputs and handoffs

Pass 3 - Reconstruct controls
11. Tracing and observability
12. Evaluation and feedback
13. Multi-agent topology
14. Safety and human control

Pass 4 - Understand production behavior
15. Failure, cost, and latency
16. Unknown unknowns
A. AIAIA scorecard

Pass 5 - Learn or evaluate design
B. Architecture-teaching prompt
C. Current vs ideal agent designs
```

For a quick daily pass:

```text
Use AI Agents in Action to reverse-engineer this agentic workflow.

Answer these questions with file evidence:

1. What goal is the agent trying to accomplish?
2. What autonomy does it have?
3. Where does execution enter?
4. What happens in one concrete run?
5. What does it sense?
6. How does it plan or route?
7. What tools or actions can it take?
8. What knowledge or memory does it use?
9. What typed outputs or handoffs exist?
10. What traces prove behavior?
11. What evals or feedback loops prove quality?
12. What safety gates, approvals, and failure controls exist?
13. Which claims are evidence, and which are inference?
```

---

## Questions to remember during manual reverse engineering

```text
Goal:
- What user or operational outcome defines success?
- Is the agent the right mechanism, or is it replacing missing deterministic
  workflow?

Autonomy:
- What can the agent do without asking?
- Where is the boundary enforced by code, not just instructions?

Instructions:
- Which prompt has highest priority?
- Are there stale, duplicated, or conflicting instructions?

Tools:
- Which tools mutate external state?
- Are retries and failures safe?

Planning:
- What stops the agent from drifting, looping, or over-solving?
- Where is uncertainty represented?

Knowledge:
- What sources ground the answer?
- How does the agent handle stale or conflicting context?

Observability:
- Can a bad run be replayed or explained?
- Are prompts, tool calls, and intermediate state visible enough?

Evaluation:
- What behavior is tested with realistic fixtures?
- How does feedback become an improved prompt, tool, eval, or control?
```

---

## Agent-evidence rule

When reverse-engineering agent systems, treat every claim as one of three types:

```text
Evidence:
  Proven by code, trace, test, fixture, config, schema, prompt, or artifact.

Inference:
  Plausible from naming or structure, but not directly proven.

Unknown:
  Requires production traces, external docs, owner knowledge, remote config, or
  a run that has not been inspected.
```

Do not let a fluent agent explanation erase this distinction. Agent systems are especially vulnerable to confident-but-unsupported stories because many important behaviors live in prompts, model defaults, tools, retrieval, hidden state, and feedback loops.

---

## Final reverse-engineering principle

Reverse-engineering an agent is not just finding the prompt. It is reconstructing controlled agency: the goal, the autonomy boundary, the context the system senses, the planning path it follows, the tools it can use, the memory it trusts, the traces that make it debuggable, and the evals that prove it improves instead of merely sounding better.
