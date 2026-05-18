# Project-Based Curriculum

A year-long plan to build and grow projects while mastering foundations and discipline across five parallel tracks: **aipe** (study), **reincodes** (DSA + portfolio), **unshippd**, **buffr**, and **contrl**.

---

## Q1 — Building a Strong Foundation

Focus: relational data systems, system design fundamentals, DSA refresher.

1. **aipe** — Read the relational data systems book (foundation).
2. **reincodes** — DSA refresher; study core patterns and rebuild intuition.
3. **unshippd** — Real-world project (system design, relational data systems). Study the existing build, audit it end-to-end, and harden it (tests, edge cases, schema review).
4. **buffr** — Real-world project (system design, DSA, relational data systems). Study and document the current architecture.
5. **contrl** — Real-world project (system design, DSA). Study and document the current architecture.
6. **dryrun** - Real-world project (system design, DSA). Study and document the current architecture.

---

## Q2 — AI Focus

Focus: AI engineering foundations, ML-adjacent algorithms, applying AI in projects.

1. **aipe** — Work through the AI engineering curriculum book (foundation).
2. **reincodes** — Continue DSA study; specifically look for algorithms used in AI/ML and adjacent disciplines (e.g., behavior trees in gaming, search/optimization in planning agents, vector similarity).
3. **unshippd** — Extend the project: implement graph/tree structures in an in-memory database layer.
4. **buffr** — Study existing AI infrastructure in the codebase; improve current AI features.
5. **contrl** — Study existing ML infrastructure; implement the form-detection feature.

---

## Q3 — ML Focus

Focus: ML interview prep, production polish, observability.

1. **aipe** — Read through the machine learning interview class/book.
2. **reincodes** — Continue DSA practice: dry-runs, talking through algorithms out loud, mock-interview style.
3. **unshippd** — Extend with authentication.
4. **buffr** — Polish the app: implement evals/observability, track bugs, handle multi-user concerns (updates, installs, migrations), plan the cloud paid tier.
5. **contrl** — Polish the app: evals/observability, bug tracking, multi-user handling (updates, installs).

---

## Q4 — Ship, Interview, Consolidate

Focus: turning a year of work into interview signal and shipped product.

1. **aipe** — Capstone: write 2–3 deep-dive technical posts synthesizing the year (e.g., "How I built X with relational + AI + ML stack").
2. **reincodes** — Portfolio pass: surface the strongest work from buffr, contrl, and unshippd; add architecture writeups; mock interviews on the 8 questions already identified.
3. **unshippd** — Public launch or open-source release; write a postmortem.
4. **buffr** — Ship the paid cloud tier; collect real user feedback; iterate.
5. **contrl** — Ship form detection v1 to real users; collect telemetry; iterate.

---

## Recommendations

**Make each quarter end with a deliverable, not just study.** Each track currently has "study" actions but vague exit criteria. Define, per project per quarter, *one shippable artifact* (a PR merged, a feature live, a writeup published, a benchmark hit). This converts learning into portfolio signal — which matters for senior/staff interviews.

**Cap the parallel surface area.** Five tracks × four quarters is a lot of context-switching for a solo dev with a day job. Designate a "primary" project per quarter (weekday evening time) and "secondary" projects (weekend-only, maintenance mode). Suggested split: buffr as Q1/Q2 primary, contrl as Q3 primary, unshippd as Q4 primary.

**Add a weekly review ritual.** A 30-minute Sunday review — what shipped, what's blocked, what's next — keeps a year-long plan from drifting. Tie it to the existing buffr journaling habit to reduce surface area.

**Front-load interview prep, don't backload it.** The 8 interview questions already identified (4 per project for buffr and contrl) should be answerable in writing by end of Q2, not Q4. That way Q3 and Q4 are about *practicing delivery*, not generating content.

**Decide where unshippd fits long-term.** It appears in every quarter but the work is incremental (harden → graphs → auth → launch). If it's a portfolio piece, great. If it's a learning sandbox, consider whether it's competing for attention with buffr/contrl, which already carry the interview narrative.

**Run a "kill criteria" check at the end of each quarter.** You already made the call to decommission the old buffr — building that muscle deliberately is valuable. Each quarter, ask: is this project still earning its slot?
