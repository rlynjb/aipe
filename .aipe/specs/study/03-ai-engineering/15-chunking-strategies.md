# Chunking strategies

**Industry name(s):** Document chunking, sliding-window chunking, semantic chunking, hierarchical chunking
**Type:** Industry standard

> How you split a long document into embeddable units shapes everything downstream — too small misses context; too large blurs the embedding.

**See also:** → [13-embeddings-geometric](13-embeddings-geometric.md) · → [02-context-windows](02-context-windows.md)

---

## Why care

You've built a RAG system, watched it retrieve the wrong chunks, and discovered the chunks themselves were the problem — too small to carry meaning, or too large to be distinguishable. Chunking is the silent design decision in every RAG system.

The pattern is *granularity matching*. Same shape as picking the right keyframe interval in video compression, or the right granularity for cache invalidation. Pick the wrong unit and the system fights you; pick the right one and retrieval just works.

---

## How it works

Slicing a long document into pieces small enough to be specific but large enough to be meaningful.

### Strategies

- **Fixed-size sliding window.** N tokens per chunk, M-token overlap. Simple, predictable; ignores structure.
- **Whole-document.** Each document is one chunk. Works for short documents; fails for long ones.
- **Section-based (markdown-aware).** Split by headings (`##`, `###`). Respects structure; chunks vary in size.
- **Sentence-window.** Split by sentences with N-sentence overlap. Fine-grained; can lose paragraph-level context.
- **Semantic chunking.** Use the embedding model to find topic boundaries. Slow but highest-quality.

### For aipe (Phase 2B)

The curriculum's B2B.1 implies section-based chunking for markdown — walk `.aipe/project/*.md` and `~/.config/aipe/global/*.md`, chunk by `##` heading sections. Each section becomes one chunk; metadata records source file and heading.

```
.aipe/project/context.md:
   ## Stack          → chunk 1
   ## Data model     → chunk 2
   ## File structure → chunk 3
   ## What must not change → chunk 4
```

If you're coming from frontend, think of this like splitting a long React component file by component definition rather than by 100-line windows — respect the structural unit.

---

## Chunking strategies — diagram

```
Strategy comparison for a 5,000-token markdown document

Fixed-size (500-token chunks):
  [────────][────────][────────][────────][────────]
   ten arbitrary slices, may split paragraphs

Whole-document:
  [─────────────────────────────────────────────]
   one chunk; ranking is per-document

Section-based (aipe Phase 2B):
  [── ## Stack ──][── ## Data model ────][── ## File structure ──]
   chunks aligned with markdown headings; each chunk is meaningful

Semantic:
  [── topic A ──][── topic B ──][── topic C ──]
   slowest; topic boundaries inferred by the embedding model
```

---

## In this codebase

**Not yet implemented.** Phase 2B B2B.1 introduces section-based chunking via `commands/index.md`. Today, full files are loaded; no chunking happens.

The chunking strategy for aipe's Phase 2B is section-based (split by `##` headings). The choice fits aipe's content shape — markdown files with explicit structure — and avoids the cost of semantic chunking.

---

## Elaborate

### Where this pattern comes from

Chunking became a named decision in 2023 as RAG systems matured. Earlier RAG (2020–2022) often chunked by fixed windows; LangChain's `RecursiveCharacterTextSplitter` (2022) made the choice explicit. Section-based chunking for structured content (markdown, HTML) is the newer best practice.

### The deeper principle

The chunk is the retrieval unit; pick a unit that's a meaningful chunk *of meaning*, not just a fixed number of characters.

### Where this breaks down

When the document doesn't have natural sections. Plain prose with no headings has no obvious section boundary; fixed-size windows or semantic chunking become the fallback. Aipe's content is heavily structured (markdown with headings), so section-based works.

### What to explore next

- [13-embeddings-geometric](13-embeddings-geometric.md) → what gets embedded
- [16-incremental-indexing](21-incremental-indexing.md) → how chunks update over time
- LangChain `MarkdownHeaderTextSplitter` — same pattern in a library

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Section-based            │ Fixed-window                │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Retrieval quality│ Better — chunks aligned  │ Lower — chunks may cut mid- │
│                  │ with meaning             │ thought                     │
│ Implementation   │ Parse markdown structure │ Count tokens, slice         │
│ Chunk-size       │ Variable (10 → 5000 tok) │ Constant                    │
│ Storage          │ Variable per file        │ Predictable per file        │
│ Failure mode     │ Sections too large for   │ Splits sentences arbitrarily│
│                  │ one embedding            │                             │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Section-based chunking makes chunk sizes unpredictable. A `.aipe/project/context.md` with a tiny `## Stack` section (5 lines) and a huge `## What must not change` section (200 lines) produces chunks of very different sizes; embedding quality may suffer on the huge one.

### Sub-block 2 — what the alternative would have cost

Fixed-window would lose markdown structure — chunks split mid-paragraph, retrieval recall drops on questions about specific sections. For markdown-heavy content like aipe's, this is a measurable quality loss.

### Sub-block 3 — the breakpoint

Fine until sections grow past ~2k tokens. At that point, secondary splitting (by sub-heading or by sentence-window) earns its place. Today, project context files are small and the issue is hypothetical.

---

## Tech reference (industry pairing)

### Markdown chunking

- **Codebase uses:** none today; Phase 2B will use markdown-aware splitter.
- **Leading today:** LangChain `MarkdownHeaderTextSplitter` — `adoption-leading`, 2026.
- **Why it leads:** structure-aware, configurable header levels.
- **Runner-up:** `llama-index` markdown nodes — `innovation-leading` for tree-shaped retrieval; richer but heavier.

---

## Project exercises

### [B2B.1] Section-based indexer for project + global context

- **Exercise ID:** `[B2B.1]`
- **What to build:** A new slash command `commands/index.md` that walks `.aipe/project/*.md` and `~/.config/aipe/global/*.md`, chunks each file by `##` headings, embeds each chunk, and writes `.aipe/.index/embeddings.jsonl` (gitignored).
- **Why it earns its place:** establishes the retrieval foundation; B2B.3 retrieval feeds on its output.
- **Files to touch:** `commands/index.md` (new), `skills/index/SKILL.md` (mirror), `specs/index.md` (template), `.aipe/.index/` (new dir, gitignored).
- **Done when:** running `/aipe:index` produces `.aipe/.index/embeddings.jsonl` with one record per `##` section across all input files; running it twice is idempotent (mtime stale check).
- **Estimated effort:** `1–2 days`.

---

## Summary

Chunking decides the granularity of retrieval. aipe's Phase 2B uses section-based chunking — split markdown by `##` headings, one chunk per section. The constraint: aipe's content is structured markdown; the natural retrieval unit is a section, not a fixed window. The cost being paid: chunk sizes vary; very large sections may need secondary splitting.

- Section-based for markdown; respects structure.
- aipe Phase 2B uses this via B2B.1 `commands/index.md`.
- Variable chunk size is the cost; quality is the benefit.
- Breakpoint: sections > ~2k tokens trigger secondary splitting.

---

## Interview defense

### Likely questions

**Q [mid]:** Why not fixed-size chunks?

**A:** Fixed-size chunks ignore meaning. Splitting a markdown file every 500 tokens cuts through paragraphs, sections, often sentences — retrieval gets fragments that aren't coherent units. Section-based chunks align with meaning because `##` headings mark topic boundaries.

**Q [senior]:** What's the tradeoff of variable chunk sizes?

**A:** Bigger chunks blur the embedding (averages too many ideas into one vector); smaller chunks lose context (you can't tell what they're about without surrounding text). Section-based chunks are at the natural unit but inherit whatever size the section has. A 2000-token section is right at the edge of where embedding quality starts degrading.

**Q [arch]:** When would aipe need to switch chunking strategies?

**A:** When section sizes routinely exceed ~2k tokens or when input is unstructured prose. The first triggers secondary splitting (split big sections by sub-heading); the second triggers fixed-window or semantic chunking. Neither has happened — aipe's contexts are well-structured markdown.

### The question candidates always dodge

**Q:** Why not semantic chunking — let the embedding model find boundaries?

**A:** Cost and latency. Semantic chunking requires running the embedding model many times per document to find topic boundaries; for a small `.aipe/project/` it's overkill. Section-based gets ~95% of the quality at ~1% of the cost.

### One-line anchors

- Chunking = granularity of retrieval.
- Section-based for markdown (aipe's choice).
- Variable chunk size is the cost; quality is the benefit.
- Breakpoint: sections > ~2k tokens trigger secondary splitting.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the four chunking strategies on a 5,000-token document.

### Level 2 — Explain it out loud
Explain why section-based beats fixed-window for `.aipe/project/`. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A user's `.aipe/project/context.md` has one massive `## What must not change` section of 3000 tokens. What does aipe's Phase 2B chunker do? Should it sub-split?

### Level 4 — Defend the decision you'd change

"If you ran into a project with 50% unstructured prose, would you switch to fixed-window or semantic chunking?"

### Quick check — code reference test
Without opening files:
- What's aipe's Phase 2B chunking strategy? → section-based (split by `##`)
- What's the alternative for prose? → fixed-window or semantic
- Where does the indexer live? → `commands/index.md` (Phase 2B, not shipped)
