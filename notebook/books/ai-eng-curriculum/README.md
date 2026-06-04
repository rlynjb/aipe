# The AI Engineering Book

A companion to `aieng-curriculum.md`, written for one specific reader: a frontend engineer with 8+ years in a data center pivoting toward AI Engineering / AI Product roles at L4–L5.

Each chapter expands one phase of the curriculum into book-style prose — the way a staff engineer at Google or Meta would explain it to you over coffee, after they'd reviewed a few hundred interview loops and seen which signal actually moves a packet.

## How to read

1. Read [00-preface.md](00-preface.md) once. It frames everything else.
2. Read chapters 01 through 05 in order. The dependency chain is real: you cannot evaluate what you haven't built, you cannot serve what you cannot evaluate.
3. Each chapter ends with **The Interview Move** — the specific sentence you'd say to a senior interviewer that converts the work into signal. Memorize those. They're the whole point.

## Chapters

| # | File | What it covers | IK Module(s) |
|---|------|----------------|---------------|
| 0 | [00-preface.md](00-preface.md) | Three-track story, target role, how this book uses your projects | — |
| 1 | [01-llm-application-foundations.md](01-llm-application-foundations.md) | What an LLM actually is, prompt engineering as a discipline, the five chains in loopd | 6 |
| 2A | [02a-rag-personal-corpus.md](02a-rag-personal-corpus.md) | Retrieval over your own journal — embeddings, chunking, hybrid retrieval, evals | 1, 3, 5 |
| 2B | [02b-rag-project-context.md](02b-rag-project-context.md) | Retrieval over `.aipe/` for the slash-command plugin | 1, 5 |
| 2C | [02c-classical-ml-pipeline.md](02c-classical-ml-pipeline.md) | End-to-end supervised ML for contrl-mo's form classifier and recommender | 1, 2, 3 |
| 3 | [03-evals-and-observability.md](03-evals-and-observability.md) | How real teams know their AI works — eval sets, traces, online metrics | 1, 2, 3 |
| 4 | [04-agents-and-tool-use.md](04-agents-and-tool-use.md) | Where chains end and agents begin; ReAct, tool routing, agent memory | 6 |
| 5 | [05-production-serving.md](05-production-serving.md) | Cost, latency, drift, rollback — what changes when AI goes to production | 4, 6 |

## Voice and conventions

- **Names are real.** If a chapter says "Sonnet 4 input is $3/1M tokens", that's the price at time of writing. Verify before acting.
- **Numbers are concrete.** "At 100k QPS" beats "at scale" every time.
- **Hedging is banned.** If something is a tradeoff, the cost is named. If it's the wrong choice, the chapter says so.
- **Anchors are explicit.** Every concept lands in one of your three codebases (loopd / aipe / contrl-mo). Generic explanations belong in textbooks, not here.

Reading time per chapter: 15–25 minutes. Reading the whole book: ~3 hours. Implementing it: 6–9 months part-time.
