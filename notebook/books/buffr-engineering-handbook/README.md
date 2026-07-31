# Buffr Engineering Handbook

A practical routine for improving Buffr through real use, diagnosis, controlled experiments, and evals.

## Reading order

| File | Part | What it covers |
|---|---|---|
| [00-introduction.md](00-introduction.md) | — | Core principle and the AI system pipeline overview |
| [01-operating-buffr.md](01-operating-buffr.md) | I | One-time setup, daily use, weekly review |
| [02-diagnosing-bad-results.md](02-diagnosing-bad-results.md) | II | Capture failures; 9-step failure decision tree |
| [03-improving-the-system.md](03-improving-the-system.md) | III | Controlled tweaks A–F (threshold, routing, chunking, etc.) |
| [04-evaluation-and-experiments.md](04-evaluation-and-experiments.md) | IV | Four-layer eval framework; experiment log template |
| [05-improvement-roadmap.md](05-improvement-roadmap.md) | V | Monthly sprints, prioritized backlog, cheat sheet, implementation order |
| [06-ai-engineering-workflow.md](06-ai-engineering-workflow.md) | VI | Continuous improvement loop, failure taxonomy, full pipeline diagram |

## Core principle

> Do not improve Buffr by intuition alone. Turn every disappointing answer into a reproducible test case.

## The pipeline at a glance

```text
Question → conversation understanding → intent routing → query planning
         → retrieval → ranking → evidence selection
         → answer generation → grounding and presentation
```

A bad final answer does not mean the model is bad. The failure may have happened at any earlier stage. Diagnose before changing code.
