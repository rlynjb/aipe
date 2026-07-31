# The buffr Handbook

A working book for **rlynjb/buffr** — your personal RAG/agent assistant. Three things live here: how to *think* about the system, how to *use* it day to day, and how to *improve* it.

It's split so you can read one chapter at a sitting and jump straight to whatever you need.

---

## Table of contents

| # | Chapter | What it's for |
|---|---------|---------------|
| 01 | [Mental model](01-mental-model.md) | The maturity ladder, why buffr is becoming a decision engine, and the beginner's mindset shift |
| 02 | [Daily routine](02-daily-routine.md) | The 5-minute daily loop + reading the footer numbers |
| 03 | [Diagnosing & tweaks](03-diagnosing-and-tweaks.md) | When something feels off: decision tree → the four tweaks |
| 04 | [Weekly cadence](04-weekly-cadence.md) | The 15-minute Monday review + growing the eval set |
| 05 | [Improvement roadmap](05-improvement-roadmap.md) | The 10 highest-leverage upgrades, known bugs, build order, target architecture |
| 06 | [Reference](06-reference.md) | Cheat sheet, command index, metrics glossary, source tiers |

---

## Reading paths

**Just want to use it well.** → [02](02-daily-routine.md) → [03](03-diagnosing-and-tweaks.md) → [04](04-weekly-cadence.md), with [06](06-reference.md) open on the side.

**Want to make it smarter.** → [01](01-mental-model.md) for the frame, then [05](05-improvement-roadmap.md) for the work.

**Onboarding your future self after a break.** → [01](01-mental-model.md) → [06](06-reference.md), then skim the rest.

---

## The one rule that ties it together

> Change one thing at a time. Prompt, chunk size, reranker, threshold, embedding model — move one, run the eval, keep or revert. Move four at once and you'll never know which one mattered.

Everything in this book is built around that loop.
