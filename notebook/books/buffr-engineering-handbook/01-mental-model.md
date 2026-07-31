[← Contents](README.md)

# 01 · Mental model

Before the routines and the roadmap, the frame: **what kind of thing is buffr becoming?**

The short answer is that it's moving from "a chatbot that searches" toward "a system that decides how to answer." The workflow you're building is closer to what top AI infrastructure teams do than to what most AI *application* developers do. It helps to see the whole ladder.

---

## Contents

- [The four maturity levels](#the-four-maturity-levels)
- [What buffr already has](#what-buffr-already-has)
- [The optimization loop](#the-optimization-loop)
- [Where buffr becomes unique](#where-buffr-becomes-unique)
- [The mindset shift](#the-mindset-shift)

---

## The four maturity levels

### Level 1 — Prompt engineering

```text
User
   │
Prompt
   │
LLM
   │
Answer
```

You tweak prompts until the output "looks better." The questions are:

- Should I add another sentence?
- Which model is better?
- Should I use temperature 0.2?

Most AI apps stop here.

### Level 2 — RAG engineering

```text
Question
      │
Retrieve documents
      │
Prompt
      │
LLM
      │
Answer
```

Now the questions shift to retrieval:

- Why wasn't this document retrieved?
- Top-K 5 or 10?
- Which embedding model? Chunk size? Overlap?

Most production AI startups live here.

### Level 3 — AI systems engineering

This is where buffr is heading. The question stops being *"how do I improve my prompt?"* and becomes *"which subsystem caused the failure?"*

```text
             User Question
                    │
                    ▼
         Intent Classification
                    │
      ┌─────────────┴─────────────┐
      ▼                           ▼
 Conversation              Knowledge Retrieval
      │                           │
      ▼                           ▼
 Recent History          Query Planning
                              │
                              ▼
                  Hybrid Retrieval
                              │
                              ▼
                      Reranking
                              │
                              ▼
                  Evidence Selection
                              │
                              ▼
                   Final Generation
                              │
                              ▼
                      Grounding Check
```

Every box becomes independently measurable. That's the whole point — you can point at the failing stage instead of guessing at the prompt.

### Level 4 — AI platform engineering

Eventually you stop thinking in terms of one agent and start thinking in terms of an operating system.

```text
                    Evaluation System
                           ▲
                           │
Prompt Registry ◄──────── buffr ───────► Tool Registry
                           │
                           ▼
                 Routing Engine
                           │
                           ▼
                  Retrieval Engine
                           │
                           ▼
                  Generation Engine
                           │
                           ▼
                 Decision Engine
                           │
                           ▼
                 Observability Layer
```

The LLM is just **one component**. Everything else exists to improve the information the LLM receives and to evaluate what it produces.

---

## What buffr already has

Looking at the repo, buffr is already past a typical personal RAG project. It has:

- prompt registry
- retrieval pipeline
- conversation memory
- trace sink
- eval framework
- connectors
- capability abstraction
- engines
- domain packs
- tool registry
- structured generation
- caching
- provider abstraction
- policy filtering

That's much closer to an AI platform than a chatbot.

---

## The optimization loop

Treat AI engineering as a continuous loop, not a one-shot build:

```text
          Build
            │
            ▼
     Use the system
            │
            ▼
    Find one bad answer
            │
            ▼
 Classify the failure
            │
            ├── Routing
            ├── Retrieval
            ├── Ranking
            ├── Memory
            ├── Tool selection
            ├── Generation
            └── Evaluation
            │
            ▼
 Form a hypothesis
            │
            ▼
 Change ONE thing
            │
            ▼
 Run evals
            │
            ▼
 Did it improve?
      │            │
     Yes          No
      │            │
      └──────┬─────┘
             ▼
       Keep learning
```

The daily and weekly routines ([02](02-daily-routine.md), [04](04-weekly-cadence.md)) are how you *find one bad answer*. The tweaks and roadmap ([03](03-diagnosing-and-tweaks.md), [05](05-improvement-roadmap.md)) are how you *change one thing*. The evals are how you know it worked.

---

## Where buffr becomes unique

The long-term goal isn't "another RAG framework." It's a **decision engine**. That's a subtle but important shift — from *"how do I retrieve information?"* to *"how should the system think before answering?"*

That's why the recurring ideas are routing, scorecards, evaluators, planners, evidence, principles, engines, and domain packs. Those are the parts of a reasoning platform, not a retrieval library.

The through-line for the rest of this book:

> **buffr should not be an agent that automatically searches and then talks. It should be a decision system that first determines what kind of evidence the question requires.**

Keep every subsystem — routing, retrieval, ranking, generation, evaluation — independently testable, and the app gets smarter over time even on the same local models.

---

## The mindset shift

The ladder above describes where *systems* sit. This is about where *you* stand as the engineer.

| discipline | core act | you know it's working when |
|---|---|---|
| coding | logic | it runs correctly |
| architecture | design | the structure holds as it changes |
| AI engineering | **evidence** | the number moved |

The one switch that matters most: in coding you can reason your way to correctness. In AI engineering you can't — the system is probabilistic and multi-stage, so intuition is only ever a hypothesis. The unit of progress isn't a clever idea, it's a measurement. "This prompt looks better" is worth nothing until the eval agrees. That's the whole shift: from *proving* to *measuring*.

Everything else falls out of that:

- **Isolate one variable.** "Change one thing, run the eval" ([the one rule](README.md)) is the scientific method applied to a pipeline, not a productivity tip. Move four knobs at once and you've learned nothing, however much better the output got.
- **Attribute failure to a subsystem, not a prompt.** When an answer is bad, ask *which box failed* — routing, retrieval, ranking, generation — not "how do I fix the prompt." This is your architecture instinct, pointed at a stochastic system. It's exactly the "classify the failure" step of the [optimization loop](#the-optimization-loop).
- **Build the ruler before you chase the model.** Prompts, thresholds, and models churn; a good eval set outlives them and is the only thing that separates progress from noise. Growing it weekly ([04](04-weekly-cadence.md#why-this-compounds)) is the compounding rep.
- **Your leverage is the evidence, not the model.** Improve what reaches the model and how you verify what comes back — that's the whole thesis of the [roadmap](05-improvement-roadmap.md). The LLM is one component; garbage in, *confident* garbage out, and the confidence is what makes it dangerous.
- **Decide before you act.** Classify what a question actually needs before searching, rather than reflexively search-then-talk. This is the high- vs low-validity frame turned into code.

The trap, specifically for someone with strong software instincts: over-trusting logic. Good engineers reason their way to answers, and that reflex works against you here. The humbling move is deferring to the eval when your gut disagrees with it. Two instincts port over cleanly — architectural decomposition, and validity-aware decision-making. The genuinely new muscle is empiricism.

> Coding proves; AI engineering measures. Stop asking "is this right?" and start asking "did the number move?"

---

← Prev: — · [Contents](README.md) · Next: [02 · Daily routine](02-daily-routine.md) →
