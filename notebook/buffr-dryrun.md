# buffr Personal Routine

## Before anything: one-time setup check

```bash
npm run chat
```
Ask: "What do you know about me?" — if it draws from your profile and notes, setup is good. If it says nothing, your knowledge base needs indexing:
```bash
npm run index -- path/to/your-notes.md
```

---

## Phase 1 — Daily use (5 min)

**Goal: use it like a tool, notice what feels wrong**

Open chat and ask 2–3 real questions you actually have that day. Don't test it — just use it.

After each answer, ask yourself one question:

> "Was that answer useful, or did it feel made up?"

That's your only job in daily use. If it feels useful → nothing to do. If it feels off → go to Phase 2.

**Reading the footer numbers:**

When an answer comes back you'll see something like `2.1s · 1,842 in · 312 out`. Here's what that means:

```
2.1s         how long it took to answer
1,842 in     tokens the model read (your question + tools + KB results)
312 out      tokens the model wrote (the answer)
```

You don't need to act on these yet. Just get familiar with your baseline — a typical answer for you might be 1–2 seconds and ~2,000 input tokens. If it suddenly takes 8 seconds, something changed.

---

## Phase 2 — When something feels off (decision tree)

Run through this in order:

**Step 1: Was the answer about something in your notes?**
- Yes but it got it wrong → retrieval miss (see Tweak A)
- No and it shouldn't need your notes → probably fine, it used web search

**Step 2: Watch the spinner text while it thinks**

The spinner shows which tools fired. Common patterns:
```
"searching knowledge base"     → looked in your notes
"searching the web (Brave)"    → used live web
"fetching RSS feed"            → grabbed articles
```

If it said "searching knowledge base" but gave a wrong answer → the relevant note wasn't found (Tweak A).

If it never searched your notes for a personal question → routing is off (Tweak B).

If no tools fired at all → the model answered from its own memory, no tools called. This is a hallucination risk.

**Step 3: Run the eval**
```bash
npm run eval
```

You'll see output like:
```
query: "what did I write about coffee"
  P@1: 1.00   ← the top result was the right doc  ✓
  R@3: 1.00   ← the right doc appeared in top 3   ✓

query: "my workout routine"
  P@1: 0.00   ← top result was wrong doc          ✗
  R@3: 0.33   ← right doc appeared once in top 3
```

**Reading P@1 and R@3:**
- `P@1` (Precision at 1) — was the very first result the right document? `1.0 = yes, 0.0 = no`
- `R@3` (Recall at 3) — did the right document appear anywhere in the top 3? `1.0 = yes, 0.0 = missed entirely`
- **Target:** P@1 ≥ 0.7, R@3 ≥ 0.8 across all your queries

If P@1 is low → retrieval is missing (Tweak A). If R@3 is high but P@1 is low → right content exists but isn't ranked first (Tweak A, lower threshold slightly).

---

## Phase 3 — Tweaks

### Tweak A: Retrieval misses (answer should be in your notes but isn't)

**File:** `src/session.ts` — find this line:
```typescript
createSearchKnowledgeBaseTool(pipeline, { minTopK: 4, minScore: 0.65 })
```

`minScore: 0.65` is the similarity cutoff. If results that should match are being filtered out:
- Lower it to `0.60` → retrieves more, may include some noise
- Raise it to `0.70` → stricter, fewer but more relevant results

Change it, rebuild, run eval, see if scores improve:
```bash
npm run build && npm run eval
```

### Tweak B: Wrong tool fires first (model answers from memory instead of searching)

**File:** `src/session.ts` — find the long string that starts with something like `"You are a personal assistant..."`. This is the routing prompt. It contains rules like:

> "Always call search_knowledge_base first for personal questions"

If the model is skipping KB search, add a more explicit rule. Example addition:
```
- For ANY question about my habits, journal, health, work, or routines:
  call search_knowledge_base FIRST before doing anything else.
```

### Tweak C: Too slow / too many tool calls

**File:** `src/session.ts` — find:
```typescript
maxToolCalls: 4,
maxTurns: 6,
```

If answers are slow and you're okay with shallower synthesis: lower `maxToolCalls` to 3.
If answers feel incomplete and you want more searching: raise to 5 or 6.

### Tweak D: Knowledge base is stale

After adding or editing any notes:
```bash
npm run index -- path/to/updated-note.md
npm run eval
```

After any DB data changes (journal, workouts, etc.):
```bash
npm run index:db
npm run eval
```

---

## Phase 4 — Weekly (15 min)

**Monday morning:**

```bash
npm run chat
```
Ask 3 questions that represent your week — one personal/habits, one work/project, one current events.

Score each answer mentally:
- Did it use my notes? (check spinner)
- Was the answer accurate?
- Did it feel useful?

```bash
npm run eval
```
Compare P@1 / R@3 to last week. If a score dropped, something changed — either your notes changed, or the threshold needs adjusting.

**Add one new eval query.** Every week, take one real question you asked that week and add it to `eval/queries.json`:
```json
{ "query": "your real question", "relevant": ["doc-id-that-should-answer-it"] }
```
Over a month you'll have a 20-query eval set that actually reflects how you use the app. That's when the numbers become meaningful.

---

## Cheat sheet

| Feeling | First thing to check | Likely fix |
|---------|---------------------|------------|
| Answer is wrong / made up | Did spinner show "searching KB"? | Run eval → Tweak A |
| Good answer but slow | Token count unusually high | Lower maxToolCalls |
| Doesn't know my notes | Spinner never said "searching KB" | Tweak B (routing prompt) |
| Knows old info not new | You edited a note recently | Re-index → npm run index |
| /investing score seems off | Run /eval in chat | Check fixtures or prompts |
| Eval P@1 dropped | Recent re-index or threshold change | Tweak A, compare before/after |
