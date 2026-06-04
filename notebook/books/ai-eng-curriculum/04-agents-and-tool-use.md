# Chapter 4 — Agents and Tool Use

**Phase 4 of the curriculum.** Three possible paths; you pick one. Reading time: 20 minutes.

> Agents are not "smarter chains." They're a different control-flow shape with different failure modes. Most teams build them before they need them, and pay for the complexity for years.

## Why this chapter is positioned where it is

You waited three phases to read about agents on purpose. The order matters.

If you'd reached for agents first — the way most candidates do — you'd have built a system you can't evaluate (no Phase 3 eval harness), with retrieval that doesn't measure recall (no Phase 2 grounding), running models you don't understand (no Phase 1 token economics). The agent would loop, burn through tokens, produce plausible-looking output, and you'd have no way to tell whether it was right.

Agents on top of disciplined chains are powerful. Agents without the discipline are demos that don't ship.

---

## The structural difference — `[C4.1]`

The agent loop versus the chain pipeline:

```
Chain (linear, predictable):

  Input → Step 1 → Step 2 → Step 3 → Output

  You define the steps. The LLM executes each one.
  Token count is predictable: roughly N × per-step cost.
  Latency is predictable: roughly N × per-step latency.
  Cost is predictable.

Agent (loop, unpredictable count):

  Input → Thought → Action → Observation → Thought → ... → Output

  The LLM decides which steps and how many.
  Token count is bounded but variable.
  Latency depends on tool-call latency × number of iterations.
  Cost can blow up if the agent loops.
```

```
┌─────────────────────────────────────────────────┐
│                  Agent loop                     │
│                                                 │
│   ┌─────────┐                                   │
│   │ Thought │ ← LLM decides what to do next     │
│   └────┬────┘                                   │
│        │ choose tool                            │
│        ▼                                        │
│   ┌─────────┐                                   │
│   │ Action  │ ← call a tool (search, write, etc)│
│   └────┬────┘                                   │
│        │ tool returns result                    │
│        ▼                                        │
│   ┌─────────────┐                               │
│   │ Observation │ ← LLM reads result            │
│   └────┬────────┘                               │
│        │                                        │
│        └──────────────── loop or stop           │
└─────────────────────────────────────────────────┘
```

When to use chains vs agents:

```
Use chains when you know the exact steps in advance.

  "Take this transcript → summarize → caption → score."
  Three steps, defined by you. Use a chain.

Use agents when the steps depend on what the LLM finds.

  "Answer this question about a codebase. You might need to
  search files, read tests, run a command — but I don't know
  in advance which."
  Use an agent.
```

For Phase 4, you pick **one** of three agent paths and ship it. The other two are interview material — you should be able to defend the structural choice across all three.

---

## The three paths

### Path A — `/aipe:implement` meta-agent

The agent reads a generated spec from `.aipe/specs/features/<slug>.md` and orchestrates the implementation: scaffolds files, makes edits, runs tests, iterates on failures, and stops when the spec's acceptance criteria are met.

```
User: /aipe:implement add-dark-mode

Agent reads: .aipe/specs/features/add-dark-mode.md

Agent's tool surface:
  - read_file(path)       — load source files
  - write_file(path, content) — create or replace
  - edit_file(path, ...)   — surgical edits via apply-patch
  - run_command(cmd)       — pnpm test, pnpm build, etc.
  - search(pattern)        — grep across the repo

Loop:
  Read spec.
  Plan: which files need to change.
  Action: write/edit. Run tests. Observation: did tests pass?
    If no, what's the failure? Edit. Run tests again.
    If still no after N iterations, stop and report.
  If tests pass: report success, summarize changes.
```

The interview signal: you've shipped a real coding agent, with bounded tool surface and explicit stopping conditions, that operates on specs YOU generate. That's the agent shape inside Anthropic's own Claude Code and inside the `aider`/`continue` ecosystems. Naming the tradeoffs (when to use meta-agent vs hand-implement) is the senior move.

### Path B — Loopd classifier-upgrade agent

The agent runs offline on weekly batches of loopd's data. Its goal: identify drift in the classifier, find systematic error patterns, propose prompt or model updates.

```
Weekly cron: /run/loopd-classifier-audit

Agent's tool surface:
  - query_logs(window)     — fetch last week's predictions
  - get_label_overrides()  — fetch user corrections (audit trail!)
  - run_eval(prompt, set)  — re-eval on the regression set
  - propose_prompt_diff()  — generate a candidate prompt update
  - score_proposal()        — compare current vs proposed

Loop:
  Pull last week's classifier outputs + user overrides.
  Identify systematic patterns:
    - Which classes are over-corrected by users?
    - Are there new input shapes the heuristic isn't catching?
  Propose: prompt diff, heuristic regex addition, or retraining trigger.
  Score: re-run eval with proposed change.
  Report: human reviews; doesn't auto-deploy.
```

This is a useful, narrow agent. It's also the kind of system that quietly runs every day in production at companies like Spotify and Netflix — model-curating agents that watch deployed models and surface what's drifting.

### Path C — Contrl-mo coaching agent (recommended)

The agent orchestrates form classification + recommendation + LLM coaching into a single interactive surface.

```
User session start.

Agent's tool surface:
  - get_user_history(N)       — last N sessions, gate state, form trends
  - classify_form(rep_window) — call the form classifier
  - get_recommendation()       — call the recommender
  - generate_coaching_cue(...) — call the LLM coaching layer
  - log_session(...)           — record the trace

Loop per rep:
  Form classifier runs on the rep → label + confidence.
  If failure mode detected:
    - Look up recent history: has this user been failing this mode?
    - If yes, escalate: generate coaching cue via LLM with context.
    - If no, simple feedback.
  Log everything.

End of session:
  Recommender suggests next exercise.
  Coaching agent reviews session summary, generates closing notes.
```

**Why Path C is the recommended interview signal:** it's the only one that orchestrates an ML model (the form classifier) as a tool inside an LLM agent. Most candidates' agents call only LLM tools. Yours calls a trained model. That's a rare composition.

```
Most candidates:                  Path C agent:

    User                              User
     │                                 │
     ▼                                 ▼
  Agent (LLM)                       Agent (LLM)
     │                                 │
     │ calls                       calls
     │                                 │
     ▼                                 ▼
  LLM tool                         LLM tool          ┌─ rare ─┐
  LLM tool             AND          LLM tool         │        │
  LLM tool                          ML model     ←───┘ this   │
                                    (form           │ is the  │
                                     classifier)    │ signal  │
                                                    └────────┘
```

---

## ReAct pattern — `[C4.4]`

ReAct is the dominant prompting pattern for agents. It forces the model to externalize its reasoning between actions.

```
Question: "How many open auth-related PRs are there?"

Thought 1: "I need to search PRs for auth-related ones."
Action 1: search_prs(query="auth", state="open")
Observation 1: 7 PRs returned.

Thought 2: "But the user wants count. Let me also check
            if any have 'authentication' in the title."
Action 2: search_prs(query="authentication", state="open")
Observation 2: 3 additional PRs (no overlap with first).

Thought 3: "Total is 7 + 3 = 10."
Final answer: "There are 10 open auth-related PRs."
```

Why ReAct works:
- Externalized reasoning is easier to debug when the trace is bad. You can see *where* the agent went wrong.
- The thought-action-observation rhythm prevents the model from generating answers without grounding them in tool calls.
- Most production agent failures show up as bad Thought-N entries — the model's planning step picked the wrong tool or had the wrong assumption.

For Path C, every coaching cue generation runs through a small ReAct trace: "Thought: which exercise? Look up history. Thought: which failure mode is recurring? Action: classify recent reps. Observation: elbow-flare 3 of 5 sessions. Thought: cue is..."

---

## Tool routing — `[C4.5]`

You have multiple tools. The agent has to pick the right one per step. Two routing strategies:

```
Heuristic routing (deterministic):

  if query contains "search"        → search tool
  elif query starts with "delete"   → delete tool
  elif intent is "session_review"   → coaching tool
  else                              → LLM-routed

LLM routing (model-decided):

  Give LLM tool definitions + query
  LLM picks the right tool
  Falls back to "no tool" if no match
```

When to use heuristic: predictable input patterns, latency-sensitive paths, high-volume routes.

When to use LLM routing: when intent isn't apparent from surface form (natural-language queries).

**Production pattern** (Google's tool routing, Anthropic's Claude Code, GitHub Copilot Workspace): **heuristic at the front (fast path), LLM at the back (fallback)**. Heuristics catch 80% of cases with zero LLM cost; the LLM only sees the ambiguous cases.

This is exactly the heuristic-before-LLM pattern from Chapter 1, applied to tool routing instead of classification.

---

## Agent memory — `[C4.6]`

Agents have two kinds of memory and they're often confused.

```
┌─ Short-term (in-context) ─────────────────────┐
│  The conversation so far, fitted into the     │
│  context window. Disappears when the          │
│  conversation ends.                           │
│  Capacity: limited by window size.            │
└───────────────────────────────────────────────┘

┌─ Long-term (retrieved) ───────────────────────┐
│  Past conversations, decisions, facts stored  │
│  in a vector DB or graph. Retrieved per turn  │
│  by relevance to the current query.           │
│  Capacity: unbounded.                         │
└───────────────────────────────────────────────┘
```

Short-term is what you wrote in Chapter 1. Long-term is RAG inside the agent (Chapter 2A pattern, applied to conversation history).

For Path C, contrl-mo's agent uses **both**: the last 5 sessions live in short-term (fits easily in context); session history older than that goes through long-term retrieval (filtered by the current exercise type). Most coaching needs only short-term. Long-term kicks in when the user asks "what was I doing wrong six months ago?"

---

## Error recovery — `[C4.7]`, `[C4.8]`

Agents fail in more ways than chains. Without explicit recovery, a failing agent loops silently or burns tokens.

```
┌──────────────────────┬──────────────────────────┐
│ Failure              │ Recovery                 │
├──────────────────────┼──────────────────────────┤
│ Tool returns error   │ Pass error to LLM as     │
│                      │ observation; let it       │
│                      │ retry or pick different   │
│                      │ tool                      │
├──────────────────────┼──────────────────────────┤
│ Tool times out       │ Cancel; pass timeout as   │
│                      │ observation               │
├──────────────────────┼──────────────────────────┤
│ LLM loops on same    │ Detect repeated tool      │
│ tool repeatedly      │ calls; force stop or      │
│                      │ inject a "try a different │
│                      │ approach" message         │
├──────────────────────┼──────────────────────────┤
│ LLM outputs invalid  │ Catch parse error; re-    │
│ tool call            │ prompt with the error     │
├──────────────────────┼──────────────────────────┤
│ Loop exceeds max     │ Hard stop; return         │
│ iterations           │ partial result + error    │
└──────────────────────┴──────────────────────────┘
```

The most common failure in real agents: **infinite loop on the same tool with the same input**. The model is stuck thinking the action it just took is what it should do next. Detect by hashing (tool_name, input_args) and counting. If the same call appears N times without progress, force stop and inject a clarifying message.

The data-center instinct that applies: circuit breakers. You wouldn't keep retrying a failing backend. The agent shouldn't either.

---

## Why agents are over-built in 2025–2026

The current state of the industry is that **most "agents" should have been chains**. The pattern of an LLM "deciding what to do next" is genuinely useful in a small set of cases — open-ended research, multi-step debugging, complex tool orchestration with unknown depth. For most product features, the steps *are* known, and a chain is cheaper, faster, easier to debug, and easier to evaluate.

Interview signal: be the candidate who can defend "I picked a chain over an agent for this surface because the steps were knowable, and the agent shape would have added cost without adding capability." That's the rare answer.

---

## The Phase 4 deliverables

If Path A:
- [ ] `[B4.1]` Spec-reader agent loop with bounded tool surface.
- [ ] `[B4.2]` Stopping conditions: acceptance criteria met, max iterations, or explicit failure.
- [ ] `[B4.3]` Trace every step. Replay capability.

If Path B:
- [ ] Weekly cron + tool-bound classifier-audit agent.
- [ ] Drift signal + proposal generation + score-then-human-review.

If Path C (recommended):
- [ ] `[B4.4]` Coaching agent orchestrates classifier + recommender + LLM cue layer.
- [ ] `[B4.5]` Per-rep ReAct traces logged to ai_trace table.
- [ ] `[B4.6]` Short-term (last 5 sessions) + long-term (filtered RAG) memory layered.
- [ ] `[B4.7]` Loop-detection circuit-breaker prevents infinite recommendation cycles.

Plus the framing artifact: `aieng-flashcards/chains-vs-agents.md` — a one-page comparison you can produce on demand in interviews.

---

## The Interview Move

> *"My agent layer in contrl-mo orchestrates a trained ML model — the form classifier — alongside a recommender and an LLM coaching layer. Most candidates' agents call only LLM tools; mine calls a real ML model as one of its tools, which is the orchestration pattern Google and Netflix use for in-product ML, not the LangChain demo pattern. The agent uses ReAct prompting — every coaching cue has an externalized thought-action-observation trace. Tool routing is heuristic-first, LLM-fallback. Memory is layered: short-term holds the last 5 sessions in context, long-term retrieves older sessions via RAG when the user asks about historical trends. Failure handling is explicit — loop detection by hashing repeated tool calls, max-iteration circuit breakers, parse-error recovery. The reason I built this as an agent and not a chain is that the steps depend on the user's history; if I knew the steps in advance, I'd use a chain and pay less."*

Next chapter: production. Where the work either ships or doesn't.
