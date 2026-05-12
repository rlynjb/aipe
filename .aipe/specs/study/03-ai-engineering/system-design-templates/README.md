# AI system design templates (interview reframes)

Canonical interview-prompt templates for AI engineering system design. These files use a different shape than the per-concept template — 9 labelled bullets per file, covering prompt → architecture → data model → components → scale → eval → failure modes → applies → make-it-apply.

Generated for every AI/ML study guide regardless of whether the codebase currently exemplifies the prompt. The `Applies to this codebase` bullet is honest about fit; `How to make it apply` names the refactor path (or notes it's a thought experiment).

---

## Index

- [`01-search-ranking`](01-search-ranking.md) — Information retrieval system, learned ranking (IK Module 1).
- [`02-tech-support-chatbot`](02-tech-support-chatbot.md) — RAG-backed chatbot with human escalation (IK Module 5).

---

## Applies table

| Template | Applies to aipe? | Reason |
|---|---|---|
| `01-search-ranking` | `partially` | Phase 2B target IS a small-scale search ranking system; today no surface exists. |
| `02-tech-support-chatbot` | `no` | aipe is spec generation, not chat. Thought experiment only. |

`partially` means: the pieces apply 1-to-1 but the surface isn't built yet. Phase 2B Build items (B2B.1–B2B.6) would move `01-search-ranking` to `yes`.

`no` means: structurally incompatible — aipe will not become a chatbot. The template is interview prep, not a buildable target.
