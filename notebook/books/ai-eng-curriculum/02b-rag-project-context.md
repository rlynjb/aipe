# Chapter 2B — RAG Over Project Context

**Phase 2B of the curriculum.** Primary project: aipe (this repo). Reading time: 15 minutes.

> Two RAGs, two shapes. Same mechanics, different design constraints. The interview signal is the *contrast*.

## What changes when the corpus is project context, not a journal

You already know how RAG works (Chapter 2A). 2B is shorter because most of the mechanics carry over verbatim. What changes:

| Dimension | loopd RAG (2A) | aipe RAG (2B) |
|---|---|---|
| **Who runs the retrieval** | The app at runtime, end-user device | The agent inside the user's IDE, during a slash command |
| **What's the corpus** | The user's journal entries | The user's `.aipe/project/`, `~/.config/aipe/global/`, and the agent's curated context |
| **What's a query** | User natural-language question | The slash-command intent ("add dark mode toggle") |
| **Output of retrieval** | Top-k entries fed into a generative chain | Top-k context chunks fed into a *spec generation* chain |
| **Freshness model** | Embedding stale on entry edit | Embedding stale on context-file edit (mtime) |
| **Where embeddings are stored** | sqlite-vec on the device | A gitignored `.aipe/.index/` in the project |

Most of the interesting work in 2B is *what's already different*. You ship 2B not to demonstrate that you can do RAG (you already did in 2A) but to demonstrate that you can adapt the same pattern to a different shape of system and explain why each decision differs.

That contrast — same problem family, different decisions — is the senior-staff move. The interview frame:

> *"I shipped two RAGs in the same year. One retrieves over a personal journal at end-user runtime; the other retrieves over project context inside a slash-command plugin. The mechanics are the same — hybrid retrieval, RRF, staleness tracking — but the deployment shape, the freshness signal, and the consumer chain are all different. Each design decision was driven by the constraints of the host system, not by a generic best-practice."*

---

## The shape of aipe's retrieval

The slash command `/aipe:feature add dark mode toggle` doesn't need to read every file in your `.aipe/` folder. It needs the *relevant* parts: the project context, the rules, the stack, anything tagged with auth or theming, and any prior feature specs. Without retrieval, every command loads the same generic context blob. With retrieval, the context is shaped to the intent.

```
User in IDE: /aipe:feature add dark mode toggle
                              │
                              ▼
            ┌────────────────────────────────────┐
            │  Query rewriting                    │
            │  "dark mode toggle" → expand to     │
            │  "dark mode theming UI toggle       │
            │  CSS variables, settings panel,     │
            │  preference persistence"            │
            └─────────────┬──────────────────────┘
                          │
                          ▼
            ┌────────────────────────────────────┐
            │  Retrieve from .aipe/.index/        │
            │  - project/context.md (most files)  │
            │  - project/stack.md (CSS/UI stack)  │
            │  - any prior /aipe:feature specs    │
            │    touching theming                 │
            └─────────────┬──────────────────────┘
                          │
                          │  top-k chunks
                          ▼
            ┌────────────────────────────────────┐
            │  Spec generation chain              │
            │  (the existing feature template     │
            │   filled with retrieved chunks      │
            │   as the project-shape input)       │
            └─────────────┬──────────────────────┘
                          │
                          ▼
                  .aipe/specs/features/dark-mode.md
```

The retrieval is a *gate* on what goes into the spec template. Without retrieval, every spec includes the whole `.aipe/` folder dumped in (or the agent picks blindly which files to load). With retrieval, the agent gets exactly what's relevant to the intent.

---

## The build items, fast

`[B2B.1]` — Add a new `/aipe:index` command. It walks `.aipe/project/` and `~/.config/aipe/global/`, chunks by section (markdown `## H2` boundaries are the natural cut), embeds each chunk, writes the embeddings to `.aipe/.index/embeddings.sqlite` (gitignored). One pass per project, run once at setup and again when context files change.

`[B2B.2]` — Pick the embedding source. Three options:

```
Option A — Host-agent embedding tool
  Use the embedding endpoint the agent itself already calls.
  Pro: zero new API keys, zero new auth.
  Con: ties you to the host (Claude Code or Codex). Switching
       agents means re-embedding.

Option B — Local model
  Run sentence-transformers locally via pyrun or onnx-runtime.
  Pro: privacy-friendly, no network cost.
  Con: setup complexity. Local model is bigger than expected.
       First-run cold-start is slow.

Option C — OPENAI_API_KEY env var
  Use the user's existing key (a common one to already have
  for other plugins) to call text-embedding-3-small.
  Pro: cheap, reliable, no setup beyond the key.
  Con: adds a network round trip per index pass. Also one
       more thing for the user to configure.
```

The right call for v1 is **Option C with Option B as a documented fallback for privacy-sensitive users.** The user already has an OpenAI key for half their other AI tools. Embeddings are cheap. The cost of running the index on a 20-file `.aipe/` is pennies. If a user wants local-only inference, the README points them at the sentence-transformers fallback.

`[B2B.3]` — Retrieve-then-feed. Every existing slash command (`/aipe:feature`, `/aipe:debugging`, etc.) gets a Step 2.5 that runs retrieval over the indexed context and feeds top-k chunks into the template's context-load step. The slash command spec docs need to mention this. UPDATE mode in `/aipe:study` already has a similar pattern; replicate it.

`[B2B.4]` — Stale-index handling via file mtime. Same idea as loopd's stale-embedding pattern, but the signal is different: the file's filesystem mtime. On every command invocation, walk the indexed files; if any mtime is newer than the index's recorded mtime for that file, mark stale; re-embed before retrieval runs. Single-file granularity, so a 50-line edit doesn't trigger a full reindex.

`[B2B.5]` — Query rewriting for slash commands. The user types `/aipe:feature dark mode toggle`. The intent string is short. Before retrieval, the agent expands it to a richer query that pulls in adjacent terms ("dark mode" → "theming, dark mode toggle, CSS variables, UI preferences"). This is the same query-rewriting pattern from 2A, just in a different host. The expansion is one cheap LLM call.

`[B2B.6]` — Eval on 10 representative intents. Pick 10 common slash-command intents you actually use. For each, label which `.aipe/` chunks the agent *should* retrieve. Measure precision@k of your retrieval. This is the eval surface that gates whether retrieval is helping — without it, you're guessing.

---

## What's different from 2A, explained

**Why mtime instead of explicit invalidation?** Loopd has app-level edit handlers; aipe's index lives in a folder the user edits with whatever editor they want. There's no edit event to subscribe to. mtime is the lowest-common-denominator signal. It's coarse (touching a file's whitespace marks it stale) but the cost of an unnecessary re-embed is pennies, so coarse is fine.

**Why no cross-encoder reranking?** The corpus is small. A `.aipe/` folder for a single project is, typically, under 100 files, under 50k tokens total. Bi-encoder hit@5 over a corpus that small is essentially perfect; reranking adds latency for no measurable gain. The interview move: "I measured retrieval quality on the eval set and bi-encoder alone hit 0.92 hit@5; reranking didn't earn its keep at this corpus size. I'd revisit if context grew past ~500 files." That's the reasoning a staff engineer applies.

**Why no streaming?** The slash command output is the generated spec file, written to disk. There's no user-facing streaming surface. Streaming would add complexity for no UX win.

**Why is the index gitignored?** The embeddings are derivable from the source files plus the embedding model version. They're cache state, not source state. Committing them would bloat the repo with binary blobs that rot the moment anyone re-embeds. Same instinct you have for `node_modules`.

---

## The cross-RAG comparison

This is the table you walk into a senior interview ready to draw, freehand, in 90 seconds:

```
┌─────────────────────┬──────────────────────┬────────────────────────┐
│                     │ loopd RAG (2A)       │ aipe RAG (2B)          │
├─────────────────────┼──────────────────────┼────────────────────────┤
│ Consumer            │ Generative LLM       │ Spec template fill     │
│ Corpus              │ Journal entries      │ .aipe/ markdown        │
│ Corpus size         │ 1k–10k entries       │ 10–100 files           │
│ Storage             │ sqlite-vec on device │ .aipe/.index/ in repo  │
│ Embedding source    │ Local or OpenAI      │ OpenAI (default)       │
│ Chunking            │ Per-entry            │ Per markdown section   │
│ Staleness signal    │ Edit handler in app  │ File mtime             │
│ Hybrid retrieval?   │ Yes (BM25 via FTS5)  │ No (dense alone)       │
│ Reranking?          │ Gated on recall      │ Not used               │
│ Query rewriting?    │ Yes (LLM)            │ Yes (LLM)              │
│ Eval set            │ 30 NL queries        │ 10 slash intents       │
│ Update cadence      │ Per-entry edit       │ Per-command invocation │
└─────────────────────┴──────────────────────┴────────────────────────┘
```

Every cell of that table is a decision driven by the constraints of the host system. Every cell can be defended on its own. The pattern of "same mechanics, different decisions" is the senior take.

---

## The Phase 2B deliverables

- [ ] `[B2B.1]` `/aipe:index` slash command exists and indexes `.aipe/` + global config.
- [ ] `[B2B.2]` Embedding source chosen, documented, with fallback option named.
- [ ] `[B2B.3]` Every slash command starts with retrieval before template fill.
- [ ] `[B2B.4]` Stale-index handling via mtime.
- [ ] `[B2B.5]` Query rewriting from slash intent into a richer retrieval query.
- [ ] `[B2B.6]` 10-intent precision@k eval set.

Plus the proof artifact: `aipe/.aipe/specs/features/rag-project-context.md` written via `/aipe:feature`. And `aieng-flashcards/rag-comparison.md` with the cross-RAG comparison table expanded.

---

## The Interview Move

> *"I've shipped two RAGs with the same retrieval mechanics — hybrid dense + sparse on the journal, dense-only on the spec context — but every other decision differs based on the host. The journal RAG lives on the user's Android device with sqlite-vec; the spec context RAG lives gitignored in the repo. The journal uses an edit handler for staleness; the spec context uses file mtime. The journal has a cross-encoder rerank gate; the spec context doesn't, because at 100 files the bi-encoder is already saturated. The point of building both wasn't to write a vector library twice — it was to have a concrete answer when an interviewer asks 'how would you do RAG differently in a chat product vs an IDE plugin.'"*

That's the contrast. The two-shapes answer is what makes the chapter worth its own chapter — not the mechanics, which you already know from 2A. Mechanics get you to mid-level. Naming why-the-mechanics-differ is what gets you to senior.

Next chapter: classical ML. The rarest shape, the highest interview signal, the chapter you'll spend the longest in.
