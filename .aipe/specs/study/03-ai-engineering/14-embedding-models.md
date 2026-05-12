# Embedding model choice

**Industry name(s):** Embedding model selection, OpenAI text-embedding-3, BGE, sentence-transformers, Cohere Embed
**Type:** Industry standard

> Pick the model that fits your scale, language, latency, and self-host needs — then never change it without re-embedding everything.

**See also:** → [13-embeddings-geometric](13-embeddings-geometric.md) · → [19-vector-databases](19-vector-databases.md)

---

## Why care

You've swapped an embedding model in production and discovered your stored embeddings are now meaningless — different models produce incompatible vector spaces. Re-embedding the whole corpus is the only fix, and at large scale that's hours of compute and dollars.

The pattern is *commit to one embedding model per corpus*. Same shape as committing to one hash function for a Merkle tree — the choice is foundational; changing it means rebuilding.

---

## How it works

A coordinate system you pick once and live with.

### The dimensions of choice

- **Quality.** MTEB benchmark scores; domain match (general web vs code vs medical).
- **Dimension count.** 384 (small, cheap) → 3072 (large, expensive). Trade quality for storage + retrieval cost.
- **Hosted vs self-hosted.** API calls vs running the model yourself.
- **Cost.** Per-1M-tokens for hosted; per-GPU-hour for self-hosted at scale.
- **Multilingual.** English-only vs multilingual.

### What aipe doesn't decide yet

Phase 2B's B2B.2 is "embedding source decision: (a) host-agent embedding tool, (b) local model, (c) OPENAI_API_KEY env var. Pick and document." This is the choice aipe has to make when Phase 2B is built; it isn't made today.

Likely default (per curriculum): `text-embedding-3-small` — cheap ($0.02/1M tokens), good quality, hosted via OpenAI. Trade-off: ties aipe to OpenAI's API; users without an OpenAI key can't use RAG.

The full picture is below.

---

## Embedding model choice — diagram

```
The choice space (B2B.2)

┌─ Hosted API (OpenAI text-embedding-3-small) ────────────────────────────┐
│   pros: zero setup, $0.02/1M tokens, good quality                       │
│   cons: tied to OpenAI; users need API key                              │
└─────────────────────────────────────────────────────────────────────────┘

┌─ Local model (BGE-small-en via sentence-transformers) ──────────────────┐
│   pros: free per-call, no API dependency, on-device                     │
│   cons: ~500 MB download, requires Python runtime                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─ Host-agent embedding tool ─────────────────────────────────────────────┐
│   pros: leverages host's existing embedding capability                  │
│   cons: not all hosts expose one; tied to host's choice                 │
└─────────────────────────────────────────────────────────────────────────┘

   Phase 2B B2B.2 picks one. Likely default: text-embedding-3-small.
```

---

## In this codebase

**Not chosen yet.** The Phase 2B B2B.2 decision is deferred. When made, the choice lives in `.aipe/project/stack.md` or a documented constant in the wrapper.

Likely landing point: `text-embedding-3-small` (1536 dim, $0.02/1M tokens) with `OPENAI_API_KEY` env var as the auth path.

---

## Elaborate

### Where this pattern comes from

Production embedding-model selection became a real decision around 2022 as multiple hosted options emerged. MTEB (Massive Text Embedding Benchmark, 2022) gave a standard way to compare them; the leaderboard is the starting point for picking.

### The deeper principle

Foundational choices have switching costs. Pick deliberately, document the choice, and don't change without budgeting the re-embed.

### Where this breaks down

When the chosen model is deprecated or pricing changes. The corpus has to be re-embedded against the replacement — for a 1M-document corpus, hours of compute. Mitigation: pick widely-supported models (OpenAI, Cohere, BGE) rather than experimental ones.

### What to explore next

- [13-embeddings-geometric](13-embeddings-geometric.md) → the geometric model behind the embedding
- MTEB leaderboard — the benchmark for picking

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Hosted (OpenAI)          │ Self-hosted (BGE)           │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Per-call cost    │ $0.02/1M tokens          │ Compute only (~free idle)   │
│ Setup            │ API key, done            │ Download model, install     │
│                  │                          │ Python deps                 │
│ Latency          │ +network round-trip      │ Local, faster after warmup  │
│ Maintenance      │ None — provider managed  │ Update model, manage deps   │
│ Failure blast    │ API down → RAG offline   │ Local OOM / dep break       │
│ Privacy          │ Data leaves machine      │ Data stays local            │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Choosing hosted ties aipe to OpenAI's roadmap. If OpenAI changes pricing 10× or deprecates `text-embedding-3-small`, every aipe user feels it.

### Sub-block 2 — what the alternative would have cost

Self-hosted means asking users to install Python + sentence-transformers + download a 500 MB model. For a markdown-only plugin, that's a huge ask. The hosted path matches aipe's "no runtime" ethos.

### Sub-block 3 — the breakpoint

Fine until OpenAI deprecates or significantly raises prices. Mitigation: pick a model with a long lifecycle (`text-embedding-3-small` looks stable through 2026); document the swap path in `template-style-guide.md`.

---

## Tech reference (industry pairing)

### Embedding API

- **Codebase uses:** none today; Phase 2B will pick.
- **Leading today:** OpenAI `text-embedding-3-small` — `adoption-leading`, 2026.
- **Why it leads:** good quality at low cost, well-supported, stable API.
- **Runner-up:** Cohere Embed v3 — `innovation-leading` for multilingual quality.

---

## Project exercises

### [B2B.2] Embedding source decision

- **Exercise ID:** `[B2B.2]`
- **What to build:** Pick one embedding source — host-agent tool, local model, or `OPENAI_API_KEY` — and document the choice in `.aipe/project/stack.md` and the wrapper's Step 2.
- **Why it earns its place:** an undocumented embedding choice is a footgun; users who don't realise the default need an API key get cryptic failures.
- **Files to touch:** `.aipe/project/stack.md` (decision recorded), `commands/index.md` (indexer that uses the chosen source).
- **Done when:** the decision is one paragraph in `stack.md` with rationale, and `commands/index.md` references it for the indexer + retrieval.
- **Estimated effort:** `<1hr` for the decision; `1–4hr` for documentation + integration.

---

## Summary

Embedding model choice is a Phase 2B decision (B2B.2). Likely default: `text-embedding-3-small` via OpenAI API key. The constraint: aipe is markdown-only; asking users to install Python + a local model is a big shift. Hosted is the lightweight path. The cost being paid: vendor lock-in to OpenAI's embedding API.

- Pick once per corpus; switching means re-embedding.
- Hosted (OpenAI) is the lightweight path; self-hosted is heavier setup.
- B2B.2 makes the decision; today undecided.
- Breakpoint: provider deprecation or 10× pricing change.

---

## Interview defense

### Likely questions

**Q [mid]:** Why can't you swap embedding models freely?

**A:** Different models produce different vector spaces. A vector from model A doesn't match the geometry of vectors from model B — searching across them returns meaningless results. To swap, you re-embed the whole corpus against the new model.

**Q [senior]:** What's the trade between hosted and self-hosted embeddings for aipe?

**A:** Hosted (`text-embedding-3-small`) is one API call away; users need an OpenAI key. Self-hosted (BGE via sentence-transformers) is ~500 MB download + Python runtime — a huge asks of a markdown-only plugin. The lighter shape matches aipe's ethos better; the vendor lock-in is the cost.

**Q [arch]:** What happens when OpenAI deprecates `text-embedding-3-small`?

**A:** Re-embed every user's `.aipe/.index/` against the replacement. The migration cost falls on each user (their corpus, their compute). For small corpora (~10k tokens), it's seconds; for large ones (1M+ tokens), it's hours. Mitigation: pick models with long announced lifecycles; document the swap recipe in `template-style-guide.md`.

### The question candidates always dodge

**Q:** Why pick the small model instead of the larger, higher-quality one?

**A:** Quality vs cost vs dim count. `text-embedding-3-large` (3072 dim) is ~2× the per-call cost and stores ~2× the bytes; quality gain is ~3% on MTEB. For RAG over project context, that quality gain isn't worth the 2× cost. The small model is the right starting point; the large model earns its place if eval (B2B.6) shows precision@k limits hitting at small-model quality.

### One-line anchors

- Embedding model = vector space; can't swap without re-embedding.
- Hosted vs self-hosted = tradeoff on setup, cost, privacy, vendor lock-in.
- B2B.2 is the Phase 2B decision; default likely `text-embedding-3-small`.
- Breakpoint: model deprecation or pricing change forces re-embed.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the three Phase 2B B2B.2 choices and trade-offs.

### Level 2 — Explain it out loud
Explain why you'd pick `text-embedding-3-small` over BGE-large for aipe. Under 90 seconds.

### Level 3 — Apply it to a new scenario

A user has 50 documents of Cyrillic text in their project context. Does the default `text-embedding-3-small` work? What model would you swap to?

### Level 4 — Defend the decision you'd change

"Would you switch to self-hosted BGE if 30% of aipe users objected to sending project context to OpenAI?"

### Quick check — code reference test
Without opening files:
- What's the typical default? → `text-embedding-3-small`
- What's the dim count of that model? → 1536
- Where does the decision get documented? → `.aipe/project/stack.md` (per B2B.2)
