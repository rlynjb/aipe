─────────────────────────────────────────────────
me.md — reader profile and thinking style
─────────────────────────────────────────────────

A reference document the other specs (study-system-design-dsa.md,
study-ai-engineering.md, study-prompt-engineering.md,
study-interview-defense.md, and any future specs in
this family) can consult when they need to calibrate
to Rein specifically — voice, examples, format,
anchoring, and what to avoid.

This file is not a generator. It produces no
artifact of its own. It is *referenced* by other
specs as a source of truth for who the reader is,
how she thinks, what she's already built (and
therefore what makes a credible example), and what
register the writing should land in.

When a spec needs to know "what kind of example
will Rein recognize," "what voice should I write
in," or "what's the right entry point for this
concept," it consults this file rather than
inventing each time.

═════════════════════════════════════════════════
WHO YOU ARE — the spine
═════════════════════════════════════════════════

You are Rein, a Software Engineer 3, based in
Seattle. Seven-plus years of professional frontend
experience — primarily Vue and React, shipped to
customers including FedEx, Amazon, and CoreWeave.
You're credited with ~$700K in client cost savings
across that span.

You are now pivoting deliberately into AI
engineering. Not abandoning frontend — composing it
with a new layer. You're working through Interview
Kickstart's frontend program in parallel with
building AI-native projects of your own.

```
THE ARC

  past 7+ years            now              next
  ─────────────────        ─────────        ────────────────
  frontend specialist      pivot point      AI engineer
  (Vue / React)            (this is         (AI product /
  enterprise customers     where you are)   AI-native apps)
  ($700K cost savings)
       │                        │                  ▲
       │                        │                  │
       └────── carries ────────►┼─────── builds ───┘
                                │
                         frontend instincts +
                         systems thinking +
                         AI-first product sense
```

You are not starting over. The 7 years of frontend
work is the load-bearing layer — what you carry
forward, not what you replace. The pivot is
additive.

You're open to senior frontend roles, senior AI
engineering roles, or product engineering roles
that compose the two. The portfolio (reincodes,
plus the five featured projects) is the case for
that combination.

═════════════════════════════════════════════════
HOW YOU THINK — the cognitive shape
═════════════════════════════════════════════════

```
THE LEARNING LOOP — how knowledge becomes real for you

   idea arrives          you can see the shape
   as a picture          before you can articulate
        │                the mechanism
        ▼                       │
   ┌─────────────┐               │
   │ shape       │◄──────────────┘
   │ (visual)    │
   └──────┬──────┘
          │  takes time —
          │  the picture is fast,
          │  the mechanism is slow
          ▼
   ┌─────────────┐
   │ mechanism   │  you walk the layers,
   │ (logic)     │  but you don't trust
   └──────┬──────┘  the logic until...
          │
          ▼
   ┌─────────────┐
   │ hands-on    │  ...you build it.
   │ (code)      │  the visualizer
   └──────┬──────┘  swapping bars in front
          │         of you is when the sort
          │         becomes real.
          ▼
    understanding
    that transfers
```

Four observations about this loop, each with a
direct consequence for how to write *for* you:

  ## 1. You think visually first

  Ideas arrive as pictures. You see the shape of a
  solution before you can articulate its parts.
  This is direct in your code — you built
  visualizers for every algorithm because you
  cannot fully trust the algorithm until you see it
  execute in front of you. Bubble sort isn't real
  until the bars swap on screen. The grid graph
  isn't real until BFS lights up the cells.

  **Consequence for explanations:** diagrams are
  not decoration. They are the primary medium. A
  concept that lands as a diagram lands; a concept
  that lands as a paragraph has not landed yet,
  even if you can recite it. Specs writing for you
  should lead with a diagram and let prose fill in
  what the diagram can't show — not the other way
  around. This is consistent with how study-system-design-dsa.md
  already operates ("diagrams are your primary
  tool. Prose fills in what diagrams can't show").

  ## 2. Ideas come fast, details take time

  You arrive at the *what* of a problem quickly and
  spend longer arriving at the *how* and *why*.
  This is not a defect — it's a thinking pattern.
  The fast arrival means you don't need to be
  walked into the concept slowly. The slow descent
  into details means you need the details *worked
  through carefully*, not glossed.

  **Consequence for explanations:** skip the
  on-ramp. Don't spend three paragraphs setting up
  what RAG is before showing how it works. You
  already see RAG as a shape (retrieve → augment →
  generate). What you need is the layered
  walkthrough of *each* part with the mechanism
  named precisely. Move 1 of How it works (mental
  model + diagram) can be tight. Move 2 (layered
  walkthrough) is where the writing has to slow
  down.

  ## 3. You value language-agnostic patterns

  You've moved from Vue to React. You translate
  Python to TypeScript routinely (Graph2.py →
  Graph2.ts, BinaryHeap.py → BinaryHeap.ts). When
  you say "I implemented a priority queue" you mean
  the concept, not the syntax — the same priority
  queue could be Python, TypeScript, Rust, or
  pseudocode and you'd recognize it.

  This is the deeper pattern: **the concept is the
  signal; the syntax is incidental.** Frameworks
  rotate (Vue → React → Next.js → whatever's next),
  but `useState`-shaped reactivity is the same
  primitive in all of them. Vector stores rotate
  (Pinecone → pgvector → Weaviate → Qdrant), but
  the pattern of *embedding + ANN + retrieval* is
  the same shape. Specs writing for you should
  reach for the pattern, name the canonical example
  once, and not anchor entire explanations to a
  single vendor or framework.

  **Consequence for explanations:** banned as the
  *primary* anchor: vendor-specific framing
  ("Pinecone does this," "Next.js does this"). The
  primary anchor is the pattern. Vendor specifics
  show up under "how this codebase handles it" or
  inside Tech reference, where they belong.

  ## 4. Fundamentals matter more than surface — and
  hands-on is how fundamentals become real

  Both halves of this are load-bearing. You value
  fundamentals: you implemented BinaryHeap and
  PriorityQueue from scratch even though
  npm has libraries that do this in three lines.
  You're working through IK's curriculum methodically.
  You're not chasing the surface of every new tool;
  you're going back to the substrate.

  *And* you don't trust the fundamentals until
  you've built with them. The PriorityQueue isn't
  real until Dijkstra's animation uses it to find a
  path through your grid. The Graph class isn't
  real until BFS lights up the river-crossing
  puzzle. The RAG pattern isn't real until you
  shipped AdvntrCue.

  **Consequence for explanations:** the structure
  that lands for you is *concept → mechanism →
  code in your own repo*. The concept names the
  fundamental. The mechanism walks the layers. The
  code anchors the abstract to something you can
  open and read. This is the spine of how study-system-design-dsa.md
  is structured (Why care → How it works → In this
  codebase). The combination of foundation +
  hands-on is the whole point — neither alone is
  enough.

═════════════════════════════════════════════════
WHAT YOU'VE BUILT — DSA portfolio
═════════════════════════════════════════════════

This section is for specs that need a credible
example anchored to Rein's lived work. When a spec
needs to say "you've already built X — here's how
that maps to Y," it can pull from this.

```
DSA portfolio — what's in the reincodes repo

  ┌─────────────────────────┬──────────────────────────────┐
  │ implementation          │ where it lives in your code  │
  ├─────────────────────────┼──────────────────────────────┤
  │ Graph (adj list)        │ Graph.ts                     │
  │   BFS + DFS             │ + bfs_traversal              │
  │   Eulerian cycle/path   │ + dfs_traversal              │
  │   valid-tree check      │ + isGraphValidTree           │
  │   connected components  │ + numberOfConnectedComponents│
  ├─────────────────────────┼──────────────────────────────┤
  │ Graph2 (node+edge)      │ Graph2.ts                    │
  │   weighted edges        │ supports Dijkstra            │
  │   directed/undirected   │ + obstacle marking for grid  │
  ├─────────────────────────┼──────────────────────────────┤
  │ Binary Search Tree      │ BinarySearchTree.ts          │
  │   insert / search /     │ all three traversals         │
  │   delete (rec + iter)   │ successor / predecessor      │
  ├─────────────────────────┼──────────────────────────────┤
  │ Binary Heap             │ BinaryHeap.ts                │
  │   MinHeap + MaxHeap     │ heapifyUp / heapifyDown      │
  │   from scratch          │ insert / getMin / getMax     │
  ├─────────────────────────┼──────────────────────────────┤
  │ Priority Queue          │ PriorityQueue.ts             │
  │   heap-backed           │ enqueue / dequeue            │
  │   with updatePriority   │ value→index lookup           │
  │                         │ (used by Dijkstra animation) │
  ├─────────────────────────┼──────────────────────────────┤
  │ Tree (general n-ary)    │ Tree.ts                      │
  │   pre/post traversal    │ used in recursion call-stack │
  │   (generators)          │ visualizers                  │
  ├─────────────────────────┼──────────────────────────────┤
  │ Sorting (5)             │ utils/notes/Sorting/         │
  │   selection / bubble /  │ + interactive React          │
  │   insertion / merge /   │   visualizers for all 5      │
  │   quick / heap          │   (animated bar swaps)       │
  ├─────────────────────────┼──────────────────────────────┤
  │ State-space search      │ PG.ts                        │
  │   (river-crossing       │ BFS over state graph         │
  │   puzzle)               │ implicit graph from rules    │
  └─────────────────────────┴──────────────────────────────┘
```

Strong on: graph algorithms (BFS, DFS, shortest
path via Dijkstra), heaps and priority queues, BSTs
with all traversals, recursion with call-stack
visualization, sorting fundamentals. Comfortable
implementing from scratch — not just using library
versions.

Less depth on: tries, union-find, segment trees,
suffix arrays, dynamic programming beyond the
classic recursion-with-memoization patterns. These
haven't shown up in your projects yet, so an
explanation that anchors to "you've already built
X" can't reach for them.

The IK curriculum framing matters here. You're not
self-taught from internet tutorials. The DSA
foundation is structured, with comments
referencing IK lessons by date ("@note 3/8/25").
Specs that explain DSA can assume the IK
vocabulary is familiar (adjacency list, captured
set, fringe edge, etc.) without needing to
introduce it.

═════════════════════════════════════════════════
WHAT YOU'VE BUILT — system design portfolio
═════════════════════════════════════════════════

You have not built one system five times. You have
built five different system shapes, each with a
distinct architecture, each shipped end-to-end.
This is the system-design hands-on layer.

```
SYSTEM DESIGN — five shapes you've shipped

  ┌──────────────────┬─────────────────────────────────────┐
  │ project          │ what it exercises                   │
  ├──────────────────┼─────────────────────────────────────┤
  │ dryrun           │ local-first mobile + cloud sync     │
  │ Android, Kotlin  │ on-device AI (Gemini Nano)          │
  │                  │ + API fallback                      │
  │                  │ GitHub-as-backend (no SQL server)   │
  │                  │ spaced-repetition scheduling        │
  ├──────────────────┼─────────────────────────────────────┤
  │ buffr            │ canonical-local + opt-in mirror     │
  │ React Native,    │ SQLite primary, Supabase secondary  │
  │ Expo, ffmpeg     │ multi-source compose pipeline       │
  │                  │ (prose + clips → vlog)              │
  │                  │ AI-assisted compose, local-first    │
  ├──────────────────┼─────────────────────────────────────┤
  │ contrl           │ real-time on-device ML pipeline     │
  │ RN + MediaPipe   │ frame-rate latency budget           │
  │ + Vision Camera  │ no network in the hot path          │
  │ + Worklets-core  │ pose-landmark → rep counter         │
  │                  │ on-device, low power                │
  ├──────────────────┼─────────────────────────────────────┤
  │ aipe             │ markdown-as-source-of-truth         │
  │ meta-tooling     │ prompt templates as code            │
  │ (this system)    │ slash commands as the interface     │
  │                  │ describe → diagnose → act layering  │
  ├──────────────────┼─────────────────────────────────────┤
  │ AdvntrCue        │ classic RAG, serverless web         │
  │ Next.js +        │ vector + relational data colocated  │
  │ pgvector +       │   (one Postgres instance)           │
  │ GPT-4 +          │ serverless API + streaming response │
  │ Drizzle +        │ tool-calling + session memory       │
  │ Netlify Fns      │   (MemoRAG)                         │
  └──────────────────┴─────────────────────────────────────┘
```

The five shapes are deliberately distinct. They are
not "five Next.js apps." They span:

  → **Local-first vs cloud-first.** dryrun and
     buffr are local-first; AdvntrCue is
     cloud-first. contrl is fully local (no cloud
     in the hot path at all).

  → **Native mobile vs web.** dryrun is native
     Android. buffr and contrl are React Native.
     AdvntrCue is web. The frontend layer
     vocabulary changes; the system-design
     concerns stay similar.

  → **On-device AI vs cloud AI.** dryrun runs
     Gemini Nano on-device with API fallback.
     contrl runs MediaPipe on-device, no cloud.
     AdvntrCue runs GPT-4 in the cloud,
     streaming back. buffr runs Anthropic with
     local SQLite as the canonical store.

  → **Storage layering.** Each project has a
     different storage story — GitHub-as-store
     (dryrun), SQLite+Supabase (buffr), pgvector
     in Postgres (AdvntrCue), filesystem (aipe).
     This is the system-design substrate.

When a spec needs an architectural example anchored
to your work, the right move is to pull from one of
these five and walk it as a worked example. You've
shipped the architecture; the spec can refer to it
without inventing.

What you have not built yet: distributed systems at
horizontal scale, hot-path queue infrastructure
(Kafka, Redis Streams), multi-region replication,
or anything that involves real load balancing
under sustained traffic. These are the parts of
"system design" that come from large-company work
at scale, and they're not in your portfolio yet.
Specs explaining these patterns should be honest
about that gap — they can still teach them, but
they can't anchor to your code.

═════════════════════════════════════════════════
HOW TO WRITE FOR YOU — voice and format
═════════════════════════════════════════════════

When other specs need to produce content you will
read, these are the rules that apply *on top of*
whatever the spec's own rules already say. They
hold across every spec in the family.

  ## What works

  → **Diagram first, then prose.** Lead with the
     visual anchor. Use ASCII (box-drawing
     characters: ┌ ┐ └ ┘ ─ │ ═ ║ ◄ ► ▼). Diagram
     wrapped in one sentence of prose before and
     one after. This is non-negotiable; everything
     downstream depends on it.

  → **Pattern as the primary anchor.** Name the
     pattern. Name the canonical example once.
     Don't anchor entire explanations to a vendor
     or framework. RAG is the pattern; pgvector is
     the implementation you happen to have in
     AdvntrCue. The pattern survives if you swap
     the vector store.

  → **Concept → mechanism → code in your own repo.**
     The three-step structure that lands for you.
     Concept names the fundamental, mechanism
     walks the layers, code points at a file in
     one of your projects. The fundamental becomes
     real when you can open the file.

  → **Code references with file paths.** Real
     paths (`src/utils/data_structures/PriorityQueue.ts`,
     `migrations/0003_chunks.sql`). Not "some
     file in the codebase." The specificity is
     the load-bearing part.

  → **Direct, opinionated.** No hedging language
     ("might," "could potentially," "tends to").
     If something is a tradeoff, name it. If
     something in your code is suboptimal, say
     so, then explain why it was the right call
     at the time.

  → **Frontend primitives as the universal
     example.** When a spec needs a substrate-level
     anchor, reach for things you build with daily:
     a list rendering, a `.map()` with a `key`, a
     form input, a `fetch()` and its loading
     states, a DB table with rows and columns,
     a primary key. Universal across frontend
     engineers; assumes no specific product.

  ## What doesn't

  → **Long abstract definitions before the
     concrete.** Don't open with "X is a mechanism
     that..." Open with a picture or a scenario.
     The definition can come after.

  → **Physical-world analogies as the primary
     anchor.** Locked doors, coat checks,
     librarians, post offices, kitchens,
     factories. Banned as the lead. The reader
     has built apps; reach for app-building
     knowledge before metaphor. (This rule is
     already in study-system-design-dsa.md; restating here so
     other specs that don't inherit study-system-design-dsa.md
     still get it.)

  → **Whole-product anchors when a primitive
     works.** "Linear does X," "Gmail does Y."
     Use these only when no lower-level primitive
     captures the concept. Most of the time, a
     todo list or a DB table is the better
     anchor.

  → **Marketing language.** Banned: "scalable
     solution," "robust architecture,"
     "cutting-edge," "industry-leading,"
     "leveraging best practices." These signal
     surface knowledge. The spec teaches by
     example — specs writing for you never use
     these phrases.

  → **Walking you slowly into the concept.** You
     arrive at the *what* quickly. The on-ramp
     is wasted on you. Don't spend three
     paragraphs setting up RAG before showing
     how it works. The mental model lands fast;
     the slow part is the mechanism walkthrough.

═════════════════════════════════════════════════
HOW OTHER SPECS REFERENCE THIS FILE
═════════════════════════════════════════════════

This file is referenced, not regenerated. The
expected pattern: when a spec in this family
(study-system-design-dsa.md, study-ai-engineering.md,
study-prompt-engineering.md,
study-interview-defense.md, or future specs)
needs to calibrate to Rein, it cites `me.md` and
treats the contents as a contract.

`me.md` is paired with `teacher.md`, which
defines the *writer* persona (the staff engineer
who teaches across the family). Together they
specify the conversation: `teacher.md` says who
is writing; `me.md` says who is reading. Each
generator spec reads both. They compose:
`teacher.md` sets the voice register;
`me.md` sets which examples land, what's already
known, and what's a gap.

Three common reference patterns:

  ## When the spec needs to know "what voice"

  Reference: the "HOW TO WRITE FOR YOU" section.
  The voice is consistent across the family —
  direct, opinionated, diagram-first, anchored to
  code. This file is the canonical source of
  those rules.

  ## When the spec needs an example anchored to
  Rein's work

  Reference: the DSA portfolio or system design
  portfolio tables. Pick one of the five system
  shapes (dryrun, buffr, contrl, aipe, AdvntrCue)
  or one of the DSA implementations. Walk it as
  a worked example. Don't invent examples when
  the portfolio already exercises the pattern.

  ## When the spec needs to know "what does she
  already know"

  Reference: the "WHAT YOU'VE BUILT" sections and
  the cognitive-style observations. The honest
  framing is: strong on frontend (7+ years), DSA
  fundamentals (IK curriculum), the five system
  shapes she's shipped. Less depth on distributed
  systems at scale, competitive-programming DSA
  beyond the IK set, and ML beyond what contrl
  exercises. Specs explaining patterns outside the
  portfolio should be honest about the gap rather
  than overclaim.

═════════════════════════════════════════════════
WHAT THIS FILE DOES NOT DO
═════════════════════════════════════════════════

  → Does not generate any artifact. No output
    folder. No command. It is a reference
    document.

  → Does not override individual spec rules. If
    study-system-design-dsa.md says "the Why care block has 5
    moves," this file does not change that. It
    adds layer-on-top calibration — voice,
    examples, anchoring — to whatever the
    consuming spec already defines.

  → Does not lock the reader profile. As Rein
    builds new projects or shifts focus, this
    file updates. The system-design portfolio
    will grow. The DSA portfolio will grow. The
    career arc will move. The file is meant to
    stay current.

  → Does not flatter. The strengths and the gaps
    are both named. The honest framing is what
    makes the file useful to other specs — they
    can calibrate accurately rather than
    overclaim what the reader knows.
