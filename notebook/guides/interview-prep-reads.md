# Interview-Prep Reading List

Curated reading for the FE → AI engineering pivot, targeting senior-bar
loops at **Anthropic, Meta, Google**. Pairs external books with AIPE-
generated per-repo material so the reading layer (concepts) and the
doing layer (your own code) compose.

**Verdict — what carries the weight:**

```
  external books     4 do ~80% of the work (Tier 1 below)
  AIPE-generated     covers the per-project muscle; the books
                     teach the framework, AIPE applies it to YOUR code
  papers + posts     Anthropic-specific signal; higher per-hour
                     than most books for that loop
```

═════════════════════════════════════════════════
TIER 1 — read these first, in this order
═════════════════════════════════════════════════

  1. **A Philosophy of Software Design** — John Ousterhout
     `~190 pages. Short, dense, transformative on module design.`
     Already in your stack via `/aipe:read-aposd`. Read this first
     if you haven't — compound interest starts immediately on every
     other piece of code you touch.

  2. **Designing Data-Intensive Applications** — Martin Kleppmann
     `~600 pages but non-linear. Chapters 5-9 carry the weight.`
     **The** backend system-design book. Every senior-bar system
     design round at Meta / Google / Anthropic probes content from
     here (replication, partitioning, transactions, consistency).
     If you only read one book on this list, this is it.

  3. **AI Engineering** — Chip Huyen (2024)
     `current on the LLM-app shape; replaces older RAG / agents
      blog-post collections with a coherent text.`
     Direct prep for Anthropic and AI tracks at Meta / Google. Covers
     evals, retrieval, agents, serving, finetuning — the layer
     `/aipe:study-ai-engineering` audits in your own repos.

  4. **Staff Engineer** — Will Larson
     `the senior bar mapped — archetypes, what staff actually do,
      the behavioral round's hidden rubric.`
     Read alongside building your behavioral story bank. Turns
     "scope, ambiguity, influence" from vague interview jargon into
     a concrete competency checklist.

═════════════════════════════════════════════════
TIER 2 — worth it after the four
═════════════════════════════════════════════════

  5. **System Design Interview Vol 1 & 2** — Alex Xu
     Exercise book, not theory. Skip if DDIA's mental models
     stick well enough that you can solve from first principles.

  6. **The Alignment Problem** — Brian Christian
     Anthropic-specific signal. Reads as background, not
     bibliography. Shows mission alignment isn't a vague intuition;
     you understand the broader stakes.

  7. **Crucial Conversations** — Patterson et al.
     Behavioral muscle for `peer-conflict-resolution` and
     `stakeholder-pushback` stories. Helps you *say* the conflict
     story sharply in the room, not just remember it.

═════════════════════════════════════════════════
TIER 3 — domain depth only
═════════════════════════════════════════════════

  8. **Designing Machine Learning Systems** — Chip Huyen
     Huyen's earlier book; classical-ML pipelines. Skip unless you
     would build training/serving infra rather than consume LLMs.

  9. **Build a Large Language Model (From Scratch)** — Sebastian Raschka
     Transformer internals. High signal for Anthropic where
     understanding model behavior carefully shows up under probing.
     Pair with Sebastian's video walkthroughs to cut the read-time.

 10. **Database Internals** — Alex Petrov
     Deeper than DDIA on storage engines (B-trees, LSM, page
     layout). Only if interviewing for infra-shaped roles.

═════════════════════════════════════════════════
WHAT TO SKIP GIVEN YOUR PROFILE
═════════════════════════════════════════════════

  → **The Pragmatic Programmer** / **Code Complete** —
     already absorbed at 7+yr SWE.
  → **The Manager's Path** —
     only if considering TLM/EM; doesn't fit your direction.
  → **Cracking the Coding Interview** —
     Interview Kickstart is already your DSA layer.
  → **Deep Learning** (Goodfellow) / **Pattern Recognition** (Bishop) —
     too theoretical for the timeframe; you're shipping AI features,
     not training novel architectures.

═════════════════════════════════════════════════
AIPE-GENERATED READING — what to run, what to read
═════════════════════════════════════════════════

Books teach the framework. AIPE applies it to your code. The
outputs below ARE reading material — generate them per-repo on
your strongest 2-3 projects, then read them like the books above.

  → **`/aipe:study-ai-engineering`** → `.aipe/study-ai-engineering/`
     The single highest-leverage AIPE artifact for Anthropic loops.
     Maps your repo onto the same competency space `recon` scores
     against. Read after AI Engineering (Tier 1 #3) — the book gives
     vocabulary, this gives evidence in your own code.

  → **`/aipe:study-system-design`** → `.aipe/study-system-design/`
     Your project's architecture in DDIA-shaped language. Read after
     DDIA (Tier 1 #2). The `audit.md` lens walk is your one-line
     system-design pitch per project; the Pass-2 discovered-pattern
     files are the deep walks for the inevitable follow-ups.

  → **`/aipe:study-software-design`** → `.aipe/study-software-design/`
     APOSD applied to your real files. Read after APOSD (Tier 1 #1).
     The `red-flags-audit` lens is the actionable index — the deep-
     vs-shallow finding is your best Software-Design Q answer.

  → **`/aipe:study-frontend-engineering`** → `.aipe/study-frontend-engineering/`
     Rendering / state / component vocabulary in your repo. The
     reader's home turf — leans on existing knowledge without
     re-teaching. Useful for any role that asks "walk me through
     this React app."

  → **`/aipe:study-security`** + **`/aipe:study-testing`** + **`/aipe:study-distributed-systems`** + **`/aipe:study-debugging-observability`** + **`/aipe:study-performance-engineering`**
     The adjacent disciplines. Run them on AI-native projects when
     they apply. Trust seam (security), AI-eval seam (testing),
     evidence layer (debugging) all show up in senior loops.

  → **`/aipe:recon`** → `.aipe/audits/recon-<date>.md`
     **Run this first** on your strongest AI-native repo. It scores
     against the L0–L3 hiring ladder (same competency map study-ai-
     engineering uses) and produces the TRACK queue — the ordered
     gaps to close before applying.

  → **`/aipe:drill`** → `.aipe/drills/<competency>-<slug>.md`
     The induced-failure rep. The deliverable is a war story — the
     sentence that survives "tell me about a time you broke something
     in production." No book replaces these reps; do them.

  → **`/aipe:rehearse-interview-defense`** → `.aipe/rehearse-interview-defense/`
     Per-project 8-chapter defense book in coach posture. Run on
     every project you'd list on a resume. The "I don't know"
     recovery chapter is what separates senior from staff in the room.

  → **`/aipe:rehearse-problem-selection`** → `.aipe/rehearse-problem-selection/`
     The "why this problem" answer. Anthropic in particular probes
     this hard. Run per project.

  → **`/aipe:rehearse-design-doc`** → `.aipe/rehearse-design-doc/`
     Written-RFC quality on a real decision. Ship one publicly —
     Anthropic weighs written communication; a public design doc
     with the alternative you rejected and why is portable proof.

  → **`/aipe:rehearse-behavioral-stories`** → `.aipe/rehearse-behavioral-stories/`
     The person-level STAR bank. 8-12 quantified stories tagged by
     competency. Includes the failure-recovery non-negotiable.
     Pair with each `rehearse-interview-defense` book.

═════════════════════════════════════════════════
ANTHROPIC-SPECIFIC SIGNAL — papers + posts beat books here
═════════════════════════════════════════════════

For the Anthropic loop specifically, read these BEFORE the
interview. Per-hour signal is higher than any book.

  → **Constitutional AI** (Anthropic) — the technique that
     differentiates Claude's training approach. Read for vocabulary
     + mission framing.
  → **Responsible Scaling Policy (RSP)** (Anthropic) — the
     framework that translates safety intent into shipping
     discipline. Read for "why this work matters" depth.
  → **Latest Claude system card** (Anthropic) — current model card,
     including evals + red-team work. Read for context on what
     Anthropic actually ships.
  → **Lilian Weng's blog** — agents, RL, LLM internals; the most
     reliable LLM-eng signal-per-word on the open web.
  → **Andrej Karpathy** — the transformer-from-scratch video series
     and the "intro to LLMs" talk. Cheaper than reading Raschka
     cover-to-cover.

═════════════════════════════════════════════════
RECOMMENDED SEQUENCE — 4-6 weeks of prep
═════════════════════════════════════════════════

A defensible reading sequence assuming you're starting from
"shipped lots of frontend, building AI projects on the side, no
formal interview prep yet":

```
  Week 1   APOSD (~3 evenings) +
           /aipe:read-aposd on top of any repo +
           /aipe:study-software-design on your strongest project
  Week 2   DDIA chapters 5-9 +
           /aipe:study-system-design on your strongest AI project +
           /aipe:study-distributed-systems if applicable
  Week 3   AI Engineering (Huyen) +
           /aipe:study-ai-engineering on your AI project(s) +
           /aipe:recon on the same project; read the TRACK queue
  Week 4   /aipe:drill on the load-bearing gap recon surfaced +
           Staff Engineer (Larson) +
           /aipe:rehearse-behavioral-stories (BANK mode if your
           career-history is ready, SCAFFOLD mode otherwise)
  Week 5   /aipe:rehearse-interview-defense on top 2-3 projects +
           Anthropic papers (Constitutional AI, RSP, system card) +
           /aipe:rehearse-problem-selection per project
  Week 6   System Design Interview Vol 1 & 2 for reps +
           /aipe:rehearse-design-doc — ship one public design doc +
           mock interviews; iterate the behavioral bank from
           feedback
```

═════════════════════════════════════════════════
USAGE NOTES
═════════════════════════════════════════════════

  → **Don't read every book cover-to-cover.** DDIA, AI Engineering,
    and Designing ML Systems are reference texts. Read what you
    need; skim the rest. The chapter-level table-of-contents is
    your filter.

  → **AIPE output IS interview-bound writing.** Treat each
    `.aipe/study-*/audit.md` or `.aipe/rehearse-*/00-overview.md`
    as material you'd hand to an interviewer. If a section
    embarrasses you, that's your prep target.

  → **Mock reps beat reading.** Past Tier 1 books and your strongest
    project's full AIPE pass, the highest-leverage next hour is
    almost always a timed mock interview, not another chapter.

  → **Update this file** as you finish things. Strike through
    completed reads; note the date you finished; capture the one-
    line takeaway you'd say in an interview. The file becomes a
    "what I read and why" artifact that's itself useful for the
    Tell-me-about-yourself opening question.
