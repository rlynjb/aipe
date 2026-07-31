[← Contents](README.md)

# 02 · Daily routine

The daily loop is short on purpose: **use buffr like a tool, and notice what feels wrong.** Diagnosing and fixing come later ([03](03-diagnosing-and-tweaks.md)) — and only when something actually feels off.

---

## Before anything: one-time setup check

```bash
npm run chat
```

Ask: *"What do you know about me?"*

- If it draws from your profile and notes → setup is good.
- If it says nothing → your knowledge base needs indexing:

```bash
npm run index -- path/to/your-notes.md
```

---

## The daily loop (5 min)

Open chat and ask 2–3 real questions you actually have that day. **Don't test it — just use it.**

After each answer, ask yourself one question:

> "Was that answer useful, or did it feel made up?"

That's the whole job.

- Feels useful → nothing to do.
- Feels off → go to [03 · Diagnosing & tweaks](03-diagnosing-and-tweaks.md).

---

## Reading the footer numbers

When an answer comes back you'll see something like `2.1s · 1,842 in · 312 out`:

```text
2.1s         how long it took to answer
1,842 in     tokens the model read (your question + tools + KB results)
312 out      tokens the model wrote (the answer)
```

You don't need to *act* on these yet — just build a baseline. A typical answer for you might be **1–2 seconds and ~2,000 input tokens**. The value is in the deviation: if it suddenly takes 8 seconds or the input tokens balloon, something changed, and that's your cue to look closer.

| Signal | Baseline | What a spike means |
|--------|----------|--------------------|
| Latency | 1–2s | Slow model, too many tool calls, or a big context — see [Tweak C](03-diagnosing-and-tweaks.md#tweak-c--too-slow--too-many-tool-calls) |
| Input tokens | ~2,000 | Retrieval is dumping too much evidence into context |
| Output tokens | a few hundred | Usually fine; very high can mean rambling synthesis |

---

← Prev: [01 · Mental model](01-mental-model.md) · [Contents](README.md) · Next: [03 · Diagnosing & tweaks](03-diagnosing-and-tweaks.md) →
