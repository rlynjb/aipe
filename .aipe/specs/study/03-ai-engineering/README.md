# Section 03 — AI engineering

Curriculum-anchored AI engineering concepts. aipe's anchor is Phase 1 (prompt engineering as a discipline — what aipe encodes), Phase 2B (RAG over project context, deferred), and Phase 4 Path A (meta-agent for `/aipe:implement`, deferred).

---

## Index by sub-discipline

### LLM foundations

- [`01-tokenization`](01-tokenization.md) — text → integer IDs; the unit context windows are sized in.
- [`02-context-windows`](02-context-windows.md) — hard token limit; lost-in-the-middle U-shape.
- [`03-sampling-parameters`](03-sampling-parameters.md) — temperature, top-p, top-k.
- [`04-structured-outputs`](04-structured-outputs.md) — JSON mode, schema-constrained decoding, tool calling output.
- [`05-streaming`](05-streaming.md) — token-by-token output for chat UIs.
- [`06-token-economics`](06-token-economics.md) — input/output pricing asymmetry; cost per call.

### Prompt engineering (aipe's anchor)

- [`07-prompt-engineering-discipline`](07-prompt-engineering-discipline.md) **Case A** — what aipe encodes; the load-bearing concept.
- [`08-provider-agnostic-chains`](08-provider-agnostic-chains.md) — markdown as the universal substrate.
- [`09-heuristic-before-llm`](09-heuristic-before-llm.md) — cheap-filter-before-expensive-call pattern.
- [`10-single-purpose-chains`](10-single-purpose-chains.md) — one prompt, one input, one output, no loop.
- [`11-user-override-locks`](11-user-override-locks.md) — preserving hand-edits; aipe's default-preserve UPDATE mode.
- [`12-output-mode-mismatch`](12-output-mode-mismatch.md) — consistent output mode across instruction + example + decoding.

### Retrieval and RAG (Phase 2B, deferred)

- [`13-embeddings-geometric`](13-embeddings-geometric.md) — vectors in learned space; cosine similarity.
- [`14-embedding-models`](14-embedding-models.md) — picking a model; aipe's Phase 2B B2B.2 decision.
- [`15-chunking-strategies`](15-chunking-strategies.md) — section-based chunking for markdown.
- [`16-dense-vs-sparse-retrieval`](16-dense-vs-sparse-retrieval.md) — embedding vs BM25 retrieval.
- [`17-hybrid-retrieval-rrf`](17-hybrid-retrieval-rrf.md) — Reciprocal Rank Fusion for combining retrievers.
- [`18-reranking-cross-encoder`](18-reranking-cross-encoder.md) — two-stage retrieval; precision after recall.
- [`19-vector-databases`](19-vector-databases.md) — tiered choice by corpus size.
- [`20-query-rewriting-hyde`](20-query-rewriting-hyde.md) — expanding short user intents.
- [`21-stale-embeddings`](21-stale-embeddings.md) — mtime-based staleness detection.
- [`22-incremental-indexing`](22-incremental-indexing.md) — re-embed only changed chunks.
- [`23-graphrag`](23-graphrag.md) — graph + vector hybrid retrieval.

### Evals and observability

- [`24-eval-set-types`](24-eval-set-types.md) — golden, adversarial, regression sets.
- [`25-eval-methods`](25-eval-methods.md) — exact, fuzzy, rubric, LLM-judge, pairwise.
- [`26-llm-judge-bias`](26-llm-judge-bias.md) — position, verbosity, self-preference biases.
- [`27-positional-bias-ranking`](27-positional-bias-ranking.md) — lost-in-the-middle for LLMs; recency for recommenders.
- [`28-no-click-not-negative`](28-no-click-not-negative.md) — implicit-feedback noise.
- [`29-llm-observability`](29-llm-observability.md) — tracing, spans, replay.
- [`30-observability-tools`](30-observability-tools.md) — Langfuse, LangSmith, Phoenix.

### Agents and tool use (Phase 4A, deferred)

- [`31-tool-calling`](31-tool-calling.md) — structured action invocation.
- [`32-agent-loop`](32-agent-loop.md) — decide / act / observe / repeat with termination.
- [`33-react-pattern`](33-react-pattern.md) — reasoning + acting interleaved.
- [`34-planning-vs-reactive`](34-planning-vs-reactive.md) — plan-first vs step-at-a-time.
- [`35-agent-memory`](35-agent-memory.md) — short-term context + long-term retrieval.
- [`36-tool-routing`](36-tool-routing.md) — heuristic / LLM / classifier dispatch.
- [`37-error-recovery`](37-error-recovery.md) — tool failure handling.
- [`38-multi-agent-orchestration`](38-multi-agent-orchestration.md) — role-based agent crews (learn-only).
- [`39-when-not-to-agent`](39-when-not-to-agent.md) — default to chains; reach for agents rarely.
- [`40-building-effective-agents`](40-building-effective-agents.md) — Anthropic's catalog.

### Production serving

- [`41-llm-caching`](41-llm-caching.md) — prompt caching for 10× cost reduction on cached prefix.
- [`42-latency-optimization`](42-latency-optimization.md) — prefill + decode; caching + routing.
- [`43-cost-optimization`](43-cost-optimization.md) — tier / cache / slim / batch.
- [`44-rate-limiting-backpressure`](44-rate-limiting-backpressure.md) — flow control under 429s.
- [`45-retry-circuit-breaker`](45-retry-circuit-breaker.md) — transient + sustained failure handling.
- [`46-production-observability`](46-production-observability.md) — token / latency / errors / drift signals.
- [`47-prompt-injection`](47-prompt-injection.md) — user input as untrusted instruction.
- [`48-self-hosted-vs-api`](48-self-hosted-vs-api.md) — build-vs-buy for LLM inference.

### How this codebase uses AI

- [`49-ai-features-in-this-app`](49-ai-features-in-this-app.md) — the honest answer: aipe doesn't call AI directly; host agents do.

---

## AI features table

| Feature | Pattern used | Why this pattern |
|---|---|---|
| `/aipe:feature ...` | Single-purpose chain | Spec generation is one-prompt, one-output |
| `/aipe:debugging ...` | Single-purpose chain | Same shape, different template |
| `/aipe:study` | Chain + parallelisation across files | 65 files, each independently generated |
| `/aipe:study UPDATE` | Two-diff chain (codebase + template) | Preserve user edits; lift to current template |
| `/aipe:audit / refactor / migration / ...` | Single-purpose chain | All share the 8-step contract |
| (deferred) `/aipe:index` | Embedding indexer | Phase 2B B2B.1 |
| (deferred) `/aipe:implement` | Full agent (planning + tool calling + ReAct) | Phase 4A B4A.1 |

→ See [`system-design-templates/`](system-design-templates/) for IK-style interview reframes (search ranking, tech support chatbot).
