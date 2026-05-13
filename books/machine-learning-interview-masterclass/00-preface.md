# Preface — The IK Course as a Book

Interview Kickstart's Machine Learning Interview Masterclass is a structured 16-week course built around the actual interview shape at FAANG. Live classes, mock interviews, six months of support. It's good. Thousands of engineers have gone through it and landed at Google, Meta, Amazon, Apple, Netflix.

This is the book version. Same curriculum. Same five sections. Different format: prose you can read at your own pace, written by a voice that pretends to be a senior engineer at one of those companies explaining the material the way they'd explain it to a colleague — not the way it would be presented in a classroom.

## Why a book, not just the course

The IK course is the practice. This book is the substrate underneath the practice. You'll use them differently:

- **Use IK for:** the live class, the mock interviews, the cohort, the feedback loop on actual interview performance. The course is *interactive* — that's what makes it work.
- **Use this book for:** the reading you do before each live class so you arrive ready. The reference you come back to between mocks. The quiet 2am moment when you need to remember what bias-variance tradeoff actually means and there's no live class to attend.

Both. Not either.

## Who this book is written for

A frontend engineer with 8+ years of experience. Most of that experience is in a data center — running infrastructure, debugging packet loss, building tooling on top of platforms you understand at the hardware level. Some of it is React, TypeScript, modern frontend frameworks.

You're not new to engineering. You're new to **the interview shape these companies use for ML and AI roles**. That shape is:

```
Day 1 (loop):
  - 1 coding interview (DSA-style)
  - 1 coding interview (DSA-style, different topic)
  - 1 system design interview (web-scale, possibly ML-flavored)
  - 1 ML system design interview (Google Search, Netflix recs, etc.)
  - 1 behavioral + values interview

Day 2 (sometimes):
  - 1 ML fundamentals interview (whiteboard math + tradeoffs)
  - 1 senior bar-raiser
```

Five-to-seven 45-minute slots. You're evaluated on every one. The IK curriculum is built to make you pass every one.

## What the IK curriculum covers, mapped to chapters

```
Section I — Data Structures & Algorithms       → Chapters 01-dsa/*
  (5 weeks, 5 live classes)
  Sorting, recursion, trees, graphs, DP.
  Goal: pass the two DSA loops cleanly.

Section II — System Design                     → Chapters 02-system-design/*
  (3 weeks, 3 live classes)
  Online, batch, stream. URL shorteners through YouTube.
  Goal: pass the one general system design loop with depth.

Section III — Machine Learning Masterclass     → Chapters 03-ml-masterclass/*
  (5 weeks, 5 live classes)
  Search ranking, recommenders, fraud detection,
  object detection, chatbot, plus modern architectures.
  Goal: pass the ML system design loop, and answer
        the ML fundamentals questions that follow.

Section IV — Career Coaching                   → Chapter 04
  (3 weeks, 3 live classes)
  Interview strategy, behavioral, negotiation.
  Goal: turn passing loops into the offer you actually want.

Section V — 6-month support period             → not a chapter
  15 mock interviews. Take all of them.
```

Sections IV and V exist for one reason: even great candidates flunk loops they should pass because they didn't practice. The book covers Section IV in one chapter and skips V because V isn't a thing to read; it's a thing to do.

## Why the data-center + frontend background actually helps

A lot of what you'll learn in the ML and System Design sections is structurally familiar:

- **Caching layers.** You already know how CDN → edge cache → app cache → DB query cache works. ML systems use the same pattern, different layer.
- **Replication and sharding.** You've sharded a database before, or watched one being sharded. ML feature stores and embedding indexes use the same partitioning logic.
- **Failure isolation.** You don't put both PSUs on the same circuit. ML inference servers don't put redundant copies of a model on the same rack.
- **Backpressure.** Network engineers know that dropping early is better than buffering forever. ML inference services drop requests the same way under load.
- **Observability.** Netflow, structured syslog, distributed tracing. ML systems use traces, spans, and per-request logs. Same problem; different signal.
- **Typed contracts.** Your React habit of typing every prop maps directly to typed contracts at the LLM boundary or at the ML model's API.

This is the bridge. Every technical concept in this book will be anchored to something you already know from infra or frontend.

## How to read

1. Read the chapter for the topic of the next IK live class. Take notes.
2. Attend the live class. Compare what the instructor said to what the book said. The deltas are the parts to study harder.
3. Practice the LeetCode / system design / ML problems IK assigns.
4. Do the mock interviews. The mocks tell you whether the reading and the practice converged into a real skill.
5. Repeat.

The book has been deliberately written in the **same voice IK's instructors tend to use** — direct, specific, opinionated, anchored in production systems. If a chapter sounds wrong to you, trust your instinct and check it against the live class.

## What this book is not

- **Not a substitute for IK.** The mocks, the cohort, the instructor feedback — those are the practice. Practice is irreplaceable. Reading is preparation for practice.
- **Not a math textbook.** Math is named where useful, explained at intuition-level, with one link for deeper reading. The bar at FAANG is *systems thinking around the math*, not derivation of the math.
- **Not vendor-specific.** Tools come and go. The underlying patterns stay.
- **Not optimistic about generic prep.** Grinding LeetCode without doing the system design and ML work won't pass a FAANG ML loop. The two DSA interviews aren't the bottleneck; the ML system design and the senior bar-raiser are.

## The bar at FAANG

The companies you're targeting hire AI / ML engineers against a specific bar in 2026:

- Can you walk a system design (search ranking, recommender, fraud detection) on a whiteboard, naming components, data models, scale concerns, and failure modes?
- Can you explain bias-variance tradeoff in 60 seconds, with a concrete example from a model you've actually trained?
- Can you defend a model choice (LR vs GBT vs neural) with numbers from a real dataset?
- Have you ever shipped a model to production and watched it drift?
- Can you describe the difference between L1 and L2 regularization geometrically, not just in formula?

Those questions get answered in the chapters that follow. By the time you've read them and practiced through the IK course, every one of those answers will be specific, opinionated, and grounded.

Let's start with the foundation. DSA.
