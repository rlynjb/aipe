# Part I — Operating Buffr

## 1. One-Time Setup and Baseline

Run:

```bash
npm run chat
```

Ask:

> What do you know about me?

A healthy setup should draw from your profile, indexed notes, and relevant stored data. If it says little or nothing, index a focused note:

```bash
npm run index -- path/to/your-notes.md
```

Then run:

```bash
npm run eval
```

Record your starting baseline:

```text
Date:
Commit:
Prompt version:
Embedding model:
Generation model:
Mean P@1:
Mean R@3:
Typical latency:
Typical input tokens:
Notes:
```

This gives you something to compare against after each experiment.

---

## 2. Daily Natural Use

### Goal

Use Buffr like a real tool and notice where the experience breaks.

Open chat and ask two or three real questions you genuinely have that day. Do not invent artificial tests during daily use.

Try to naturally include different question types over time:

- a direct personal fact
- a question connecting several personal records
- a follow-up question such as "Why?" or "What about the other one?"
- a current external question
- a recommendation based on your own goals or preferences

After each answer, ask:

> Was this accurate, useful, grounded, and appropriately personalized?

If yes, move on. If no, save the exact question and continue to Phase 2.

### Read the footer numbers

An answer may show:

```text
2.1s · 1,842 in · 312 out
```

Meaning:

```text
2.1s       total answer latency
1,842 in   tokens read by the model
312 out    tokens generated
```

Do not optimize these numbers in isolation. First learn your normal range.

Watch for changes such as:

- latency suddenly increasing
- input tokens growing without a better answer
- several tools firing for a simple question
- a very short answer despite strong available evidence
- a long answer containing irrelevant retrieved material

---

## 3. Weekly Review

Once a week, run three representative questions:

1. personal fact or habit
2. project or multi-document synthesis
3. current external question

Also run one follow-up question that depends on the previous turn.

For each answer, score:

```text
Route correct?            0 or 1
Needed evidence found?    0 or 1
Top evidence relevant?    0 or 1
Claims supported?         0 or 1
Answer complete?          0 or 1
Answer useful?            1–5
Latency acceptable?       0 or 1
```

Then run:

```bash
npm run eval
```

Compare results with the previous week.

### Add one real question to the eval set

Every week, add at least one real question from your usage:

```json
{
  "query": "your real question",
  "relevant": ["expected-document-id"]
}
```

Also label its type:

```json
{
  "query": "Based on my recent priorities, what should I build next?",
  "type": "personal_synthesis",
  "relevant": ["career-goals", "active-projects", "recent-journal"]
}
```

Over time, your eval suite should reflect how you genuinely use Buffr.
