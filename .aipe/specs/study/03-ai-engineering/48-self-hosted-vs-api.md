# Self-hosted vs API

**Industry name(s):** Self-hosted LLM, vLLM, model API, on-prem inference
**Type:** Industry standard

> Use a hosted API (Claude, GPT) or host the model yourself (Llama via vLLM). Trade between cost, privacy, latency, and ops burden.

**See also:** → [43-cost-optimization](43-cost-optimization.md)

---

## Why care

You've watched a team commit to self-hosting "for cost reasons" and discovered the GPU ops dwarf the API savings. Or you've chosen API and discovered your enterprise customer needs on-prem inference. The choice is genuinely hard.

The pattern is *build-vs-buy for LLMs*. Same shape as on-prem-vs-cloud, in-house-DB-vs-RDS.

---

## How it works

Two paths.

### Hosted API

Pay per token; provider handles serving. Zero ops.

### Self-hosted

Run open-weight model on your GPUs. Per-token cost approaches zero at scale; GPU ops are non-trivial.

### Hybrid

Hot path on API; long-context or cheap workloads on self-hosted.

### For aipe

Curriculum tags `learn-only` (C5.8). aipe defers — host agent picks. The concept matters for interview defense.

---

## Self-hosted vs API — diagram

```
Trade space

  Hosted API                        Self-hosted
  ──────────                        ───────────
  $0.001+ per call                  ~$0 per call (after GPU cost)
  Zero ops                          GPU ops (CUDA, drivers, monitoring)
  Fixed quality (provider's)        Tunable (fine-tuning)
  Latency: network + serving        Latency: local serving only
  Privacy: data leaves              Privacy: data stays
```

---

## In this codebase

**Not applicable for aipe.** The host agent's user picks. Curriculum `learn-only`.

---

## Elaborate

### Where this pattern comes from

Classical build-vs-buy. LLM-era variant emerged in 2023 as open-weight models (Llama 2, Mistral) became viable.

### The deeper principle

Per-token cost is one variable; ops burden is another. Both matter.

### Where this breaks down

When ops can't keep up with growth — self-hosting requires GPU expertise that small teams don't have.

### What to explore next

- vLLM, TGI (Text Generation Inference)
- LMSYS Chatbot Arena

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Hosted API               │ Self-hosted                 │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ $ per call       │ $0.001+                  │ ~$0 (after GPU sunk cost)   │
│ Setup            │ Account + API key        │ GPU servers + CUDA + serving│
│ Quality          │ Top-tier (provider)      │ Open-weight (Llama, Qwen)   │
│ Ops              │ Provider's problem       │ Your problem                │
│ Privacy          │ Data leaves              │ Stays local                 │
│ Failure mode     │ Provider outage          │ GPU failure / driver issue  │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe doesn't pick.

### Sub-block 2 — what the alternative would have cost

Self-hosting for aipe would be absurd — markdown plugin, no service.

### Sub-block 3 — the breakpoint

Not applicable for aipe.

---

## Tech reference (industry pairing)

### Self-hosted LLM serving

- **Codebase uses:** none.
- **Leading today:** vLLM — `adoption-leading` for self-hosted LLM serving, 2026.
- **Runner-up:** TGI, llama.cpp — `innovation-leading` for various deployment shapes.

---

## Project exercises

`learn-only` per curriculum.

---

## Summary

Self-hosted vs API trades $/call for ops burden + privacy. aipe doesn't pick — host agent does. The constraint: aipe is markdown. The cost: not applicable.

- Hosted: zero ops, per-call cost.
- Self-hosted: GPU ops, ~$0 per call after sunk cost.
- aipe doesn't pick.

---

## Interview defense

### Likely questions

**Q [mid]:** When does self-hosting win?

**A:** When per-token costs at scale exceed GPU ops burden, AND you have GPU expertise, AND privacy is required.

**Q [senior]:** Why is aipe never going to self-host?

**A:** Because aipe doesn't call LLMs. The host agent does. aipe is markdown.

**Q [arch]:** What's the breakpoint for switching?

**A:** Roughly when hosted API spend exceeds $20k/month — at that scale, hiring an ML ops engineer becomes cheaper than the API bill.

### The question candidates always dodge

**Q:** Why doesn't self-hosting always win?

**A:** Quality. Frontier models (Claude, GPT) outperform open-weight by a meaningful margin in 2026. Self-hosted Llama may be enough for many tasks but not all.

### One-line anchors

- Hosted: zero ops; self-hosted: ops burden.
- aipe doesn't pick.
- Breakpoint: ~$20k/month spend.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the hosted-vs-self-hosted trade.

### Level 2 — Explain it out loud
Why self-hosting isn't always cheaper. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A company spending $50k/month on Claude API is deciding. What numbers do they need?

### Level 4 — Defend the decision you'd change

"Would you ever recommend self-hosting for aipe?"

### Quick check — code reference test
Without opening files:
- aipe pick? → not applicable
- Leading self-hosted server? → vLLM
- Breakpoint for cost? → ~$20k/month
