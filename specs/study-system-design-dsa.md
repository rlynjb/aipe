# Codebase Study Spec

A spec that turns your codebase into a study guide for system design, DSA, and AI engineering. This is not interview prep. This is comprehension — one file per pattern, each file walking the reader from a curiosity hook to verified understanding. Diagrams, prose, tradeoff analysis, and self-check blocks sit in a deliberate order, so working through a file builds the concept the way you'd build it in your own head.

---

## What makes this different from the interview spec

```
Interview spec                    Study spec
──────────────────────────────    ──────────────────────────────
Prepares you to defend work       Helps you understand work
Translates knowledge to speech    Builds the knowledge first
Performance under pressure        Comprehension without pressure
You research unfamiliar terms     Patterns walked end-to-end
Proves you built it               Teaches what you built
Output: document to memorise      Output: one file per pattern,
                                  worked through deeply
```

The interview spec asks: "Can you explain this under pressure?"
This spec asks: "Do you actually understand this?"

---

## How this spec composes with the rest of the family

This spec is one of five study generators, sitting under one orchestrator, plus two persona specs that they all reference:

```
study.md                       ← ORCHESTRATOR (the /aipe:study command)
                                  runs every generator below in create-or-update mode

teacher.md                     ← writer persona (who teaches, what voice)
me.md                          ← reader profile (who reads, how they think)
                                  both referenced by every generator below

study-system-design-dsa.md     → .aipe/study-system-design-dsa/   (this spec)
study-ai-engineering.md        → .aipe/study-ai-engineering/
study-prompt-engineering.md    → .aipe/study-prompt-engineering/
study-agent-architecture.md    → .aipe/study-agent-architecture/
rehearse-interview-defense.md     → .aipe/rehearse-interview-defense/
```

Each generator spec runs per-repo and produces a fixed-name folder. `study.md` is the single entry point — it invokes all five generators, detecting per-folder whether each run is a create or an update. `teacher.md` and `me.md` are read by every generator before producing output. They do not generate anything themselves — they calibrate **voice** (teacher.md) and **fit** (me.md) for the reader. The generator specs handle structure; the two persona specs handle who's speaking and who's listening; the orchestrator handles running them all.

This spec also serves as the **structural foundation** for the whole family: the per-concept-file template, the formatting rules, the diagram requirements, the hard rules, and the constraint summary all live here. The other four generators inherit them by reference rather than restating them.

One exception: `study-prompt-engineering.md` uses a different persona (working AI engineer, not staff engineer) because the discipline rewards different credibility. It still references `me.md` for reader calibration, but defines its own persona inline rather than inheriting from `teacher.md`. See `teacher.md`'s "WHEN NOT TO USE THIS PERSONA" section for why.

---

## Concept-file format — defined in format.md

The structure of every concept file — the block template,
the diagram rules, the pseudocode rules, the hard rules,
and the house-style traits — is defined in **`format.md`**,
the shared format reference for the whole study family
(alongside `teacher.md` for voice and `me.md` for reader
calibration). This spec reads `format.md` for structure and
supplies the system-design + DSA *topic* content below.

**Precedence: `format.md` is the single source of truth for
concept structure. Where an older template section in this
spec differs from `format.md`, `format.md` wins.** In
particular, per `format.md`: the opening block is **Zoom
out, then zoom in** (not "Why care"), and **Tradeoffs**,
**Tech reference**, and **Summary** are **removed** from
the concept file. The legacy "Why care," "Tradeoffs,"
"Tech reference," and "Summary" sections that remain in
this spec's body are superseded and retained only as
historical detail.

---

## What the output looks like

```
Study guide directory structure

  study-system-design-dsa/
  │
  ├── 00-overview.md              one-page system map + legend
  │
  ├── 01-system-design/           one file per pattern found
  │   ├── README.md               index of all patterns in this section
  │   ├── 01-request-flow.md
  │   ├── 02-auth-boundary.md
  │   ├── 03-serverless-functions.md
  │   ├── 04-storage-layer.md
  │   ├── 05-api-design.md
  │   └── 06-provider-abstraction.md
  │       (+ any other patterns found in the codebase)
  │
  └── 02-dsa/                     one file per operation found
      ├── README.md               index + complexity cheat sheet
      ├── 01-reordering.md
      ├── 02-deduplication.md
      ├── 03-flattening.md
      ├── 04-sorting.md
      └── 05-lookups.md
          (+ any other operations found in the codebase)

Each file contains:
  → Subtitle            industry name(s) + type label
                        (Industry standard / Language-agnostic /
                         Project-specific) — so other devs
                        catch on with one-second lookup
  → Why care            grounded scenario the reader can hold
                        in their head, then names the pattern
                        as the answer to a question the
                        scenario set up. Five moves: scenario
                        → name the question → why the question
                        matters → before/after → one-line
                        summary. All anchors come from the
                        frontend primitives the reader builds
                        with daily (a todo list, a DB table's
                        rows and columns, a `.map()` with a
                        `key`) — physical-world analogies and
                        whole-product references are banned.
                        Length scales with complexity.
  → How it works        prose walkthrough that bridges from
                        what the reader knows (frontend) to
                        what they don't (this concept).
                        Three moves: mental model → layered
                        walkthrough → principle. The mental
                        model anchors to a frontend primitive
                        the reader builds with (a re-rendering
                        list, a DB table, a primary key) —
                        analogies and whole-product references
                        are banned. ASCII diagrams required at
                        every move: a mnemonic for Move 1, a
                        mechanism diagram in every Move 2
                        sub-section, a side-by-side for Phase
                        A vs B. Length scales with complexity
                        — short for debounce, long for
                        multi-layer auth.
  → Primary diagram     recap visual after the mechanics —
                        labels every box, every arrow, and
                        every architectural layer (UI, Service,
                        Storage, etc.) the system has
  → In this codebase   exact file path, function name,
                        line range — always present
  → Elaborate block     deeper context — where this pattern
                        comes from, what problem it was invented
                        to solve, how it connects to adjacent
                        concepts, what to read next
  → Tradeoffs           comparison table of cost dimensions
                        (path taken vs alternative) plus four
                        sub-blocks: what was given up, what
                        the alternative would have cost, the
                        breakpoint, and what wasn't actually
                        a tradeoff at all
  → Tech reference      one `###` subsection per tech the
                        file references; five labelled bullets
                        per subsection: Codebase uses / Why
                        it's here / Leading today (adoption-
                        or innovation-leading) / Why it leads
                        / Runner-up. No markdown tables.
  → Project exercises   (SECTIONS 03 + 04 only) curriculum
                        Build items mapped to this file's
                        concept IDs. One `###` subsection per
                        exercise; six labelled bullets each:
                        Exercise ID / What to build / Why it
                        earns its place / Files to touch /
                        Done when / Estimated effort. Handles
                        Case A (concept already implemented;
                        exercise is the next step) and Case B
                        (concept not yet implemented;
                        exercise is the primary buildable
                        target).
  → Summary             recap — one-paragraph concept summary
                        plus 3–6 bulleted key points to
                        carry away. The block you return to
                        in three weeks to remember the file.
  → Interview defense   questions, model answers with a
                        diagram per answer (the visual you
                        sketch while you speak), one-line
                        anchors
  → Validate block      4 levels: reconstruct → explain →
                        apply to scenario → defend decision.
                        Every level references real file paths
                        and line numbers from the codebase.
  → See also            links to related files in this guide

Each file walks the pattern from curiosity hook to verified
understanding: Why care frames it, How it works explains it,
the diagram anchors it, In this codebase grounds it, Elaborate
extends it, Tradeoffs name the cost, Tech reference places it
in the industry, Project exercises name what to build next
(AI + ML only), Summary recaps it, Interview defense
pressure-tests it, Validate proves you got it.
```

---

## The prompt

Paste your codebase spec, README, or architecture document and send this. The agent generates a study guide directory at `.aipe/study-system-design-dsa/`.

The prompt below assumes the agent has access to two companion files:

  → `teacher.md` — the writer persona. The
    staff engineer who is teaching this guide.
    Defines voice, format hierarchy, what's
    banned, the teaching philosophy.

  → `me.md` — the reader profile. Who reads the
    guide and how they think. Defines voice
    calibration, example anchoring, and what
    the reader already knows vs honest gaps.

Both files are referenced, not duplicated, in
the prompt below.

```
You are the staff engineer defined in `teacher.md`.
Read that file first. It defines your background,
your teaching philosophy, your voice, your format
hierarchy (diagrams primary, prose fills in,
pseudocode for logic, real code only when syntax
matters), and what's banned (hedging, marketing
language, apologetic tradeoff naming, slow on-
ramps, physical-world analogies as primary
anchor). Treat its contents as your operating
contract.

This spec uses the **teacher posture** from
`teacher.md`. Not the coach posture (that's for
interview defense). The reader is sitting next to
you. You are explaining a concept. You assume
time, patience, and the goal of understanding.
Diagrams primary, mechanism walked slowly,
tradeoffs named.

─────────────────────────────────────────────────
THE READER — calibrate to `me.md`
─────────────────────────────────────────────────

`teacher.md` defines who is *writing* the guide.
`me.md` defines who is *reading* it. Read `me.md`
before generating, and treat its contents as the
source of truth for reader-side calibration:

  → **Voice and format register.** `me.md`'s
     "HOW TO WRITE FOR YOU" section names the
     rules that apply on top of `teacher.md`'s
     voice rules: diagram-first, pattern as the
     primary anchor (not vendor-specific),
     concept → mechanism → code in the reader's
     own repo.

  → **What examples land.** When this spec calls
     for an anchor example or a worked walkthrough,
     reach into `me.md`'s DSA portfolio (Graph,
     BinarySearchTree, BinaryHeap, PriorityQueue,
     sorting set, state-space search) and system
     design portfolio (dryrun, buffr, contrl,
     aipe, AdvntrCue) before inventing. These are
     real implementations the reader has shipped.

  → **What the reader already knows.** `me.md`
     names strengths (7+ years frontend, IK-
     curriculum DSA fundamentals, five distinct
     system shapes shipped) and honest gaps
     (distributed systems at horizontal scale,
     competitive-programming DSA beyond IK, ML
     beyond contrl). Calibrate depth accordingly.
     Assume the strengths. Teach the gaps as new
     ground, not as refresher.

  → **The cognitive shape.** Visual-first
     thinking. Ideas arrive as pictures; details
     and logic take longer. The reader needs the
     mental-model diagram early and the mechanism
     walkthrough slow. Skipping the on-ramp is
     correct for this reader.

─────────────────────────────────────────────────
PRECEDENCE WHEN THREE FILES OVERLAP
─────────────────────────────────────────────────

  1. This spec wins on **structure** (block
     templates, the 5 moves of Why care, the 3
     moves of How it works, hard rules).
  2. `teacher.md` wins on **voice register**
     (tone, posture, what's banned, what's
     reached for first).
  3. `me.md` wins on **calibration** (which
     examples land, what's already known, how
     deep to teach each concept).

These three layers are designed to compose. When
in doubt, treat `teacher.md` and `me.md` as input
data to respect rather than reinterpret.

Project spec:
[paste your spec, README, or architecture doc here]

─────────────────────────────────────────────────
READING EXPERIENCE — the non-negotiables
─────────────────────────────────────────────────

→ Navigable structure
  Every section must be navigable by headers alone.
  Use ### for every individual concept — not just
  major sections. The reader works through a file in
  one sitting, then returns to specific blocks later
  for reference. If a concept doesn't have its own
  header, the reader can't get back to it without
  re-reading the whole file.

→ Visual before verbal
  Every concept has a primary diagram. It sits after
  How it works as the recap visual — a reader who
  only looks at it should grasp the structure.
  Inside How it works, never let jargon land in a
  paragraph without a secondary visual (small diagram,
  pseudocode block, comparison table, or execution
  trace) anchoring it in the same paragraph. Prose
  alone is the last resort.

→ Self-contained concept blocks
  Each concept block must stand alone. A reader who
  jumps to page 4 should not need to have read page 2
  to understand what's on page 4. Cross-reference with
  "→ see also: [section]" but never require the
  prior section.

→ Flow over formality
  Write like you're explaining this to a smart colleague
  who just asked "wait, how does that actually work?"
  Not like a textbook. Not like documentation.
  Short sentences. Direct language. No passive voice.

→ Decisions and tradeoffs as part of explanation
  Don't separate "here's the concept" from "here's why
  it's done this way." The why is part of the what.
  Every non-trivial decision gets one line on the tradeoff.

─────────────────────────────────────────────────
FILE STRUCTURE — one file per pattern or operation
─────────────────────────────────────────────────

Do not write one large file per section. Write one file
per pattern (system design), one file per operation (DSA),
one file per AI pattern (AI engineering).

Each file is named with a number prefix and the concept
name in kebab-case:
  01-request-flow.md
  02-auth-boundary.md
  03-serverless-functions.md

Each section directory (01-system-design/, 02-dsa/)
must have a README.md that:
  → Lists every file in the directory with one-line description
  → For DSA: includes the full complexity cheat sheet table
  → For system design: includes the full system map diagram

Every individual concept file uses this structure exactly:

  # [Concept name]

  **Industry name(s):** [formal/widely-recognised names this
                          pattern goes by, e.g. "Strategy pattern,
                          Adapter pattern". If the pattern has no
                          formal name, write "— (project-specific
                          composition)".]
  **Type:** [one of: "Industry standard" | "Language-agnostic" |
             "Industry standard · Language-agnostic" |
             "Project-specific"]

  > [One sentence — what this is and why it matters in
  > this codebase. The reader should know if they need
  > this file from this one line alone.]

  **See also:** → [related file] · → [related file]

  ---

  ## Why care

  This block is the hook, but "hook" here means
  something more specific than a clever opening
  sentence. The hook is a *concrete grounded scenario
  the reader can hold in their head* — built from the
  primitives a frontend engineer touches every day: a
  todo list rendering, a database table with rows and
  columns, a `.map()` with a `key`, a form input, a
  `fetch()` and its loading state. From inside that
  scenario, the reader arrives at the question the
  pattern answers without having to be told what to
  care about.

  The reader is curious by the end of this block
  because the scenario showed them stakes they
  already understood — *from the substrate of their
  own work, not from invented metaphors*. Not because
  the writer used the word "fascinating," and not
  because the writer reached for a librarian or a
  coat check.

  Length is scaled by complexity, the same way How
  it works is. A simple concept gets a short scenario
  and a one-line summary; a complex one gets a fuller
  scenario, a worked before/after, and a bolded
  "why this question matters" pivot. The structure is
  the same either way.

  ### Five structural moves, in order

  Every Why care block makes five moves. Simple
  concepts compress moves 3 and 4 into a single
  paragraph; complex ones give each move its own
  paragraph. Move 5 is one sentence, always.

  #### Move 1 — The grounded scenario

  Open with a concrete picture the reader can hold
  in their head. Not abstract framing. Not a
  rhetorical question. **Not a physical-world
  analogy.** A scenario rooted in the primitives a
  frontend engineer touches every single day — a
  todo list being rendered, a database table with
  rows and columns, a form input, a `fetch()` call,
  a list re-rendering after state changes.

  These are lower-level than whole products. "Linear's
  drag-to-reorder" assumes the reader uses Linear.
  "A todo list where you drag a row to a new
  position" assumes only that the reader has built a
  list — which every frontend engineer has, in every
  tutorial, interview, and side project. Reach for
  the substrate the reader builds *with*, not the
  SaaS products they happen to use.

  Examples of opening scenarios that work:

  - "You've got a todo list on screen — five rows,
    each with text the user typed. The user fixes a
    typo in row 3 and the list re-renders. To the
    user it's the same five todos. But to the code,
    is row 3 the *same* row 3, or a brand-new row
    that happens to sit in the same spot?"
  - "Picture a database table: `todos`, with columns
    `id`, `text`, `created_at`, `user_id`. Two
    different users each have a row with `id = 1`.
    When the app asks for 'todo number 1,' which
    row comes back — and what stops it from being
    the wrong one?"
  - "You render a list of todos with `.map()`. Every
    React dev sets `key={todo.id}` because the
    console warns if you don't. But strip the `key`
    out and watch what breaks: the input you were
    typing in loses focus, the half-finished
    animation restarts. Something was relying on
    that key to know which row was which."

  What these scenarios have in common: they reference
  things the reader builds with daily — a rendered
  list, a table with named columns, a `.map()` with
  a `key`. The reader isn't imagining a kitchen or
  recalling a product they might not use; they're
  looking at the substrate of their own work. The
  scenario sets up a question the reader can almost
  ask themselves before the writer asks it for them.

  #### Move 2 — Name the question (or job) the pattern answers

  One or two sentences that turn the scenario's
  implicit question into an explicit one, and name
  what the pattern is by framing it as the answer.

  > "That same-row-or-new-row question is what a
  > reconciler answers. Not the diffing of the
  > array, not the re-rendering — just the matching
  > of old-row to new-row. It's the exact job
  > React's `key` prop does on the frontend.
  > Backends hit the same question and reach for the
  > same pattern."

  > "What stops 'todo number 1' from being the wrong
  > row is the *composite key* — the table is keyed
  > on `(user_id, id)` together, not `id` alone. The
  > pair is what's unique, so user A's row 1 and
  > user B's row 1 are simply different rows."

  > "What keeps the half-finished input from losing
  > focus is *identity tracking* — the list keeps a
  > stable handle on each row across re-renders, so
  > the DOM node, its focus, and its state all stay
  > attached to the same logical item."

  Notice the secondary technique: *naming what the
  pattern is by naming what it is NOT*. "Not the
  diffing of the array, not the re-rendering — just
  the matching." This narrows the concept before the
  reader can generalize too broadly. Use it when the
  pattern sits adjacent to other patterns it gets
  confused with.

  #### Move 3 — Why answering that question matters

  This is the load-bearing move. The scenario gave
  the reader a question; this move tells them what
  *depends* on the answer. What breaks if the
  pattern isn't there. What gets lost. What goes
  wrong silently.

  Open with a bolded transition that names the
  shift: **Why you need to answer that question at
  all:**, or **What depends on getting this right:**,
  or **What breaks without it:**. The bold makes the
  pivot legible. The reader is following the writer
  from "here's the question" to "here's the stakes."

  Then one paragraph that names the stakes in plain
  English, with at least one concrete consequence the
  reader can picture. Abstract claims about
  correctness, performance, or data integrity are
  banned without a concrete instance:

  > "**Why you need to answer that question at all:**
  > because *stuff is attached to the old lines*.
  > Every todo has a created-at timestamp, tags, an
  > AI classification, maybe a thread link. That
  > metadata lives with the row's identity, not its
  > text. If the user fixes a typo in row 3, you
  > want row 3 to still be row 3 — same created-at,
  > same tags, same classification."

  The codebase can appear here. The current rule
  banning project nouns from Why care is replaced by
  a softer rule: **the scenario in Move 1 must be
  understandable to someone who has never seen this
  codebase, but Move 3 can ground its consequences
  in real fields from real files**. The reader who
  doesn't know the codebase still understands the
  scenario; the reader who knows the codebase gets a
  sharper sense of what's at stake.

  #### Move 4 — Concrete before/after

  Show what happens with the pattern absent vs
  present. Two short bulleted scenarios, three to
  five bullets each. Same scenario, two outcomes.

  > Without a reconciler:
  > - User fixes typo in todo #3
  > - App sees "the list changed" → wipes old list,
  >   saves new list
  > - Todo #3's created-at is now today, its tags
  >   are gone, its AI classification re-runs and
  >   maybe comes back different
  >
  > With a reconciler:
  > - User fixes typo in todo #3
  > - Reconciler matches new-row-3 to old-row-3 (by
  >   position, since exact text no longer matches)
  > - Metadata stays attached, only the text field
  >   updates

  Why this works: abstract consequences ("metadata
  gets lost") are weaker than walked consequences
  ("the created-at resets to now, the tags vanish,
  and the AI re-classifies from scratch"). The
  before/after walks the consequences instead of
  asserting them.

  Skip Move 4 when the concept is too simple to
  earn it — when the difference between with-pattern
  and without-pattern is one obvious thing. Skip it
  also when before/after would be misleading because
  the concept isn't binary (e.g. retrieval quality,
  which is gradient).

  #### Move 5 — The one-line summary

  End with a single sentence that names the pattern
  in one phrase. Not a definition. **Not a physical-
  world analogy.** A *reduction* — the concept
  compressed into its essential job, often by naming
  the pattern as the same thing as something the
  reader already knows from real software.

  > "The reconciler is what React's `key` prop does,
  > but for database rows with attached columns
  > instead of DOM nodes with attached state."
  > "The composite key is just a primary key made
  > of two columns instead of one — `(user_id, id)`
  > instead of `id`."
  > "Optimistic update is rendering the new todo in
  > the list before the `POST` comes back, and
  > rolling the row back out if it fails."

  This is the sentence the reader will paraphrase
  three weeks later when someone asks them about
  this concept. It's also the sentence that hands
  off to How it works — the summary names the
  pattern by reference, and How it works walks the
  mechanics.

  After this sentence, optionally add one
  *handoff* line that explicitly points to the next
  block. "Here's how that actually plays out in
  this codebase." or "The full mechanics are below."
  This is small but the spec keeps the handoff
  habit consistent across blocks.

  ### Reader profile — same as How it works

  The default reader is a working frontend engineer
  with 5–8 years of experience, pivoting to
  full-stack and AI engineering. They are
  comfortable with components, hooks, client state,
  forms, browser APIs. They are still building
  intuition for databases, transactional semantics,
  server-side request handling, auth, queues,
  distributed systems, infra primitives, LLM-shaped
  failure modes.

  Move 1's scenario should connect to the primitives
  the reader builds with every day: a todo list
  being rendered, a database table with named
  columns, a `.map()` with a `key` prop, a form
  input, a `fetch()` and its loading state, a list
  re-rendering after `setState`. Not "imagine a
  library." Not "imagine you're scaling a Kubernetes
  cluster." Not even "open Linear and drag an issue"
  — that assumes a specific product. A todo list and
  a DB table are universal; every frontend engineer
  has built with both. The scenario brings the
  reader in; the rest of the file is what they came
  for.

  ### Hard rules

  - **Open with a scenario, not a hook sentence.**
    "Most of the speed in a modern web app comes
    from not doing work" is a clever sentence,
    but it doesn't put a picture in the reader's
    head. "You've got a list of todos rendering on
    screen. The user edits one. The whole list
    re-renders — but only one row actually changed,
    and something has to figure out which" does.
    Use the scenario form, grounded in a primitive
    the reader builds with daily.

  - **No physical-world analogies.** Coat checks,
    librarians, post offices, locked doors,
    bouncers, kitchens, factories — all banned as
    primary anchors. The reader has richer pattern
    recognition from software they use daily than
    from physical-world objects. See the global
    rule "Use real software, not analogies" in
    FORMATTING RULES for what to reach for instead
    (real apps, DevTools surfaces, patterns the
    reader has built, industry-standard products).

  - **Banned phrases.** "It's important to
    understand X" / "X is a fundamental concept" /
    "X is fascinating because" — these are
    permission-seeking. The reader gives permission
    by reading the next sentence. Drop the
    permission-seeking and trust the scenario to
    earn the attention.

  - **No definition-first openings.** "A reconciler
    is a function that..." is banned. Definitions
    belong in Move 2, framed as the answer to a
    question Move 1 set up.

  - **Concrete consequences only.** Move 3 must
    name what breaks, what gets lost, what shifts —
    with at least one specific consequence the
    reader can picture. "This is important for
    correctness" is banned without a worked
    instance.

  - **Codebase references allowed in Moves 3, 4,
    and 5.** Not in Move 1 (the scenario must be
    project-agnostic). Not in Move 2 (the pattern
    name is universal). After that, real fields,
    real files, real consequences make the block
    sharper.

  - **End with the one-line summary.** The reader
    should be able to highlight Move 5 and know
    what the pattern is in one phrase, by reference
    to something they already know from real
    software.

  ### Worked example — what good looks like

  This is what a Why care block looks like when the
  five moves above are followed. The concept being
  explained is *reconciliation between an old list
  and a new list when rows have metadata attached* —
  a pattern the reader has already used on the
  frontend (via React's `key` prop) but probably
  never named.

  > You've written this React code a thousand times:
  >
  > ```
  > {todos.map(todo => (
  >   <TodoRow key={todo.id} todo={todo} />
  > ))}
  > ```
  >
  > You set `key={todo.id}` because if you don't,
  > React will warn you in the console. But why does
  > React need the key at all? Open the dev tools,
  > drag a row to reorder the list, and watch what
  > happens: the input cursor inside the dragged row
  > stays in the same field, the focused element stays
  > focused, the animation continues smoothly. Without
  > `key`, all of that breaks — inputs lose focus,
  > animations restart, state resets. The key is how
  > React matches each item in the new list to the
  > same item in the old list, so attached state can
  > ride along.
  >
  > That matching problem is what a *reconciler*
  > solves. Not the diffing of the array. Not the
  > re-rendering. Just the matching of new-row to
  > old-row.
  >
  > **Why you need to answer that question at all:**
  > because *stuff is attached to the old rows*.
  > In React, the attached thing is component state
  > and DOM focus. In a backend with persistent rows,
  > the attached thing is server-side metadata —
  > created-at timestamps, AI classifications, tags,
  > thread links. That metadata lives with the row's
  > identity, not its text. If the user fixes a typo
  > in row 3, you want row 3 to still be row 3 —
  > same created-at, same tags, same classification.
  > You don't want the system to think "row 3 was
  > deleted and a new row was inserted," because
  > then the created-at resets to now, the tags
  > vanish, and the AI re-classifies from scratch.
  >
  > So the backend reconciler exists for the same
  > reason React's reconciler does — to prevent that
  > loss. It looks at old-list and new-list and says
  > "these two rows are the same row, just edited"
  > so the metadata can ride along.
  >
  > Without a reconciler:
  > - User fixes typo in todo #3
  > - Backend sees "the list changed" → wipes old
  >   rows, inserts new rows
  > - Todo #3's created-at is now today, its tags
  >   are gone, its AI classification re-runs and
  >   maybe comes back different
  >
  > With a reconciler:
  > - User fixes typo in todo #3
  > - Reconciler matches new-row-3 to old-row-3 (by
  >   position, since exact text no longer matches)
  > - Metadata stays attached, only the text field
  >   updates
  >
  > The backend reconciler is React's `key` prop, but
  > for server-side rows with attached metadata.
  > Everything else — the storage, the UI, the
  > classifier — depends on it getting the matches
  > right. Here's how that actually plays out in
  > this codebase.

  What this example does right:

  - Opens with React code the reader has written
    thousands of times. No notebook, no librarian
    — a real, verifiable pattern. The reader's
    first reaction is recognition, not imagination.
  - Names the pattern (reconciler) by reference to
    React's reconciler (which the reader has used
    even if they didn't know the term), and
    sharpens it by what it's NOT (not the diffing,
    not the re-rendering).
  - Bolded transition to "why answering that
    question matters" — the load-bearing pivot.
  - Concrete consequences with specific field names
    (created-at, tags, AI classification) — not
    abstract claims about metadata loss.
  - Before/after bullets walk the difference rather
    than asserting it.
  - One-line summary closes ("the backend reconciler
    is React's `key` prop, but for server-side rows
    with attached metadata") — a real-software
    reference, not a metaphor — and the handoff
    sentence points to How it works.

  ---

  ## How it works

  This is the load-bearing block of the entire file.
  Why care made the reader curious; How it works
  builds the actual understanding. Everything below
  (the diagram, In this codebase, Tradeoffs, Summary)
  assumes the reader finished this block with the
  concept fully clicking. If it doesn't click here,
  nothing else recovers.

  Length is scaled by complexity, not capped by
  paragraph count. A simple concept (a debounce
  function) gets four short paragraphs. A complex
  one (multi-layer auth, distributed locks, prompt
  routing under failure conditions) gets fifteen or
  twenty paragraphs with sub-headings, interspersed
  visuals, and explicit current-state vs future-state
  walkthroughs. Err long for complex backend, infra,
  and systems concepts — the reader is here to learn,
  not to skim.

  ### Know your reader before you write

  The first thing the writer does — before drafting a
  sentence — is name who the reader is and what
  they already know. This determines every bridging
  reference, every "if you're coming from X, this is
  different" line, every example reaching for software
  the reader has already used.

  Default reader profile for this study guide:
  a working frontend engineer with 5–8 years of
  React/Vue/TypeScript experience, who is pivoting
  toward full-stack and AI engineering. They are
  comfortable with: components, hooks, client state,
  forms, browser APIs, TypeScript, modern bundlers,
  client-side routing. They are still building
  intuition for: database internals, transactional
  semantics, server-side request handling, auth
  flows, queues, distributed systems, infra
  primitives, LLM-shaped failure modes.

  The writer's job: bridge from the first list to
  the second list. Every backend or AI concept must
  be anchored to something the reader already
  understands from frontend. The bridge is the
  difference between "explained" and "understood."

  ### Three required moves

  Every How it works block makes three moves, in
  order. Move 1 frames the concept. Move 2 walks
  the mechanics. Move 3 names the principle.
  Complex concepts spend most of their length on
  move 2; simple concepts compress move 2 to a
  single sub-section. None of the three moves is
  ever skipped.

  #### Move 1 — The mental model (first paragraph + diagram)

  Open with a concrete picture, not a definition.
  Not "X is a mechanism that..." — that's a textbook.
  Instead, **anchor the pattern to a primitive the
  reader already builds with** — a list re-rendering,
  a table with rows and columns, a `fetch()` and its
  states, a primary key. Defense in depth → "two
  WHERE conditions on the same query, where either
  one alone would still scope the rows correctly."
  Connection pooling → "the same open database
  connection handed to one request after another,
  instead of opening a fresh one each time — the way
  a single `fetch` keep-alive connection serves many
  calls." Optimistic UI → "rendering the new row in
  the list the instant the user hits save, before
  the `POST` resolves, and removing it again only if
  the request fails."

  The mental model has two jobs: make the reader
  recognize the shape from primitives they already
  work with, and prime them for the layered
  walkthrough that follows. A good mental model is
  the sentence the reader will paraphrase six weeks
  later when someone asks them about this concept.

  **Banned: physical-world analogies.** Locked doors,
  coat checks, librarians, post offices, bouncers,
  factories — all banned as primary anchors. See the
  global rule "Use real software, not analogies" in
  FORMATTING RULES. Also avoid whole-product anchors
  ("Linear does X", "GitHub does Y") when a lower-
  level primitive works — a todo list and a DB table
  are universal; a specific SaaS product is not.

  **Diagram required: the mental model picture.** Move 1
  always includes one small ASCII diagram (5–12 lines)
  — the literal shape of the mental model. If the
  model is "two WHERE conditions, either one
  sufficient," draw the two conditions as two boxes
  the query passes through. If it's "one connection
  handed to many requests," draw the one connection
  with many request arrows pointing at it. The
  diagram is the visual the reader will recall
  alongside the sentence. Place it immediately after
  the opening paragraph.

  After the mental model lands, one sentence names
  the underlying strategy in plain English: "two
  independent gates, both required." "One warm
  resource, lent and returned." "Show success
  immediately, reconcile when the server confirms."
  This is the transition from recognition to
  mechanics.

  #### Move 2 — The layered walkthrough (the body)

  Break the concept into its independent moving parts
  and walk each one separately. Each part gets its
  own bolded sub-heading. The reader should never have
  to hold more than one moving part in their head at
  a time.

  For each part, cover:

    1. The technical thing — what it is, named with
       its real term. "Composite primary key."
       "Row-Level Security." "JWT signature
       verification." Names matter; the reader needs
       to recognise the term when they encounter it
       again.

    2. The bridge from what the reader knows.
       This is the load-bearing sentence. "If you're
       coming from frontend, you're probably used to
       thinking of an `id` as globally unique — like
       a UUID. Here it's different." Without this
       bridge, the technical thing is just vocabulary.
       With it, the reader's existing mental model
       reshapes around the new concept.

       Common bridge starters:
       - "If you're coming from frontend, you're
          used to X. Here it's different — Y."
       - "This is like React's [pattern], except
          the [thing] lives on the server."
       - "Think of it like [browser API you know],
          but [twist that makes it different]."
       - "In React, you'd handle this with [hook].
          In a backend, you handle it with [server
          equivalent]."

    3. The practical consequence — what literally
       happens when this is active. Not "this provides
       security" — say "if user A's client sends a
       query for `id = 'abc123'` belonging to user B,
       the database looks for `(user_A_id, 'abc123')`
       and that row literally does not exist." Concrete.
       Specific. Walk a real example through.

    4. The condition under which it works (and
       doesn't). "This works whether the user is
       logged in or out." "This breaks if `auth.uid()`
       returns the wrong value." Boundary conditions
       are where understanding lives.

  **Every Move 2 sub-section requires at least one
  ASCII diagram showing its mechanism.** Not "where
  it helps" — every sub-section. The prose explains;
  the diagram shows. A reader who skims only the
  diagrams in Move 2 should come away with the shape
  of each mechanism before reading a sentence. Most
  sub-sections need more than one diagram — typically
  a data-shape diagram (what's stored) plus a flow
  diagram (how the operation moves).

  Pick the diagram type that matches what the
  sub-section is describing:

  - **Flow / pipeline** — a sequence of steps, a
    request moving through stages, a transformation.
    Boxes connected by labelled arrows, top to
    bottom.

    ```
    Request
      │
      ▼
    ┌──────────────────┐
    │ validate input   │  rejects malformed
    └────────┬─────────┘
             │ clean input
             ▼
    ┌──────────────────┐
    │ write to table   │  side effect
    └────────┬─────────┘
             ▼
        row stored
    ```

  - **Table rows & columns** — what's stored, the
    shape of a record, how rows relate. Use this
    constantly; the reader thinks in tables.

    ```
    todos
    ┌──────────┬─────────┬────────────┬──────────┐
    │ user_id  │ id      │ text       │ done     │
    ├──────────┼─────────┼────────────┼──────────┤
    │ alice    │ 1       │ buy milk   │ false    │
    │ alice    │ 2       │ call mom   │ true     │
    │ bob      │ 1       │ ship v2    │ false    │ ← same id=1,
    └──────────┴─────────┴────────────┴──────────┘   different row
              └────┬────┘
            (user_id, id) together = the unique key
    ```

  - **Comparison / side-by-side** — before vs after,
    with-pattern vs without, Phase A vs Phase B.
    Two columns, aligned rows, the difference marked.

    ```
        Without the pattern         With the pattern
    ┌────────────────────┐      ┌────────────────────┐
    │ query runs every   │      │ check cache first  │
    │ time → ~50ms       │      │ → ~1ms on hit      │
    └────────────────────┘      └────────────────────┘
    ```

  - **Sequence / interaction** — actors exchanging
    messages over time (client ↔ server ↔ database).
    Actors as columns, time flowing down, labelled
    arrows between.

    ```
    Client            Server            Database
      │                 │                  │
      │  POST /todos     │                  │
      │ ───────────────► │                  │
      │                  │  INSERT row      │
      │                  │ ───────────────► │
      │                  │  ◄─── id         │
      │  ◄─── 201 {id}   │                  │
      ▼                  ▼                  ▼
    ```

  - **Inline code annotation** — pointing at parts
    of a small snippet, naming what each piece does.

    ```
    SELECT * FROM todos
    WHERE user_id = $1     ← scopes to one user
      AND id = $2;         ← picks the row
    ```

  Rules for every diagram: label every box, label
  every arrow that carries information, name every
  layer the system has (UI, Service, Storage). Use
  box-drawing characters (┌─│▼◄►), not ASCII
  approximations (+−|v<). Introduce each diagram with
  one sentence of prose before it and one after — a
  diagram never stands alone. No Mermaid, no images.

  #### Move 2 variant — the load-bearing skeleton (for patterns with a kernel)

  Some patterns are not a set of co-equal parts — they
  have an irreducible *kernel*: a loop, a traversal, a
  protocol exchange, or a single data-structure
  operation that the whole pattern is built around.
  BFS, binary search, a sliding window, union-find, a
  rate limiter, a read-through cache, a write-ahead
  log, leader election, a retry policy, an agent loop
  — each has a smallest core that still *is* the
  pattern. When the concept has a kernel, run Move 2 as
  a load-bearing-skeleton walkthrough rather than a
  flat list of parts. Three steps:

  1. **Isolate the kernel.** Show the smallest
     pseudocode or shape that is still the pattern —
     nothing removed that the pattern can survive
     losing. This is the thing the reader should be
     able to reconstruct from memory.

       BFS:          frontier queue + visited set +
                     dequeue → expand → enqueue +
                     termination (frontier empty)
       Rate limiter: counter + window + allow/deny
                     decision + window reset
       Read cache:   lookup → hit returns / miss fills
                     → evict under pressure

  2. **Name each part by what BREAKS when it is
     missing — not by definition.** This is the move,
     and it is the whole difference between a reader who
     memorised the parts and one who understands them.
     "Drop BFS's visited set and it revisits nodes and
     never terminates on a cyclic graph." "Drop the
     rate limiter's window reset and it locks out
     permanently after the first burst." "Drop the
     cache's eviction and it grows until it OOMs."
     What-breaks-if-removed is how the reader learns
     which parts are load-bearing and which are
     incidental.

  3. **Separate skeleton from optional hardening.** The
     kernel is the minimum that makes it the pattern;
     everything else is hardening layered on top — and
     saying which is which is itself the lesson.
     Union-find's path compression and union-by-rank
     are hardening, not skeleton (the kernel is parent
     array + find + union; it works without them, just
     slower). A retry's backoff jitter, a cache's
     read-through-vs-write-through choice, an agent
     loop's retry and observability — all hardening.
     The reader who can say "this part is the skeleton,
     this part is the optimisation bolted on" is the
     one who actually understands the pattern.

  The interview-defense payoff: naming a load-bearing
  part people routinely forget — BFS's termination on
  the empty frontier, a rate limiter's reset, an agent
  loop's hard iteration budget — is the single
  strongest signal that the reader built the thing
  rather than read about it. Surface that part in
  Move 2 and again in the concept file's Interview
  defense block.

  **Diagram required, same as any Move 2 sub-section:**
  draw the kernel as a shape (the loop, the traversal
  frontier, the protocol exchange) before listing the
  parts. The skeleton is a picture before it is a list.

  This variant is a tool, not a mandatory block. Use it
  when the concept has a recognisable kernel; skip it
  for concepts that genuinely are co-equal independent
  parts with no central loop or operation (defense in
  depth is two independent gates, not a kernel — walk
  it as a flat list of parts instead).

  #### Move 2.5 — Current state vs future state (when applicable)

  Whenever the concept involves something built-but-
  not-fully-active, planned-but-not-yet-shipped, or
  in-migration, write a Phase A / Phase B (or Now /
  Later) sub-section. This is critical for concepts
  like multi-tenant scaffolding, auth migrations,
  feature flags, gradual rollouts, deprecated paths
  still in the codebase.

  Each phase gets:
  - What's true right now in the code
  - What's planned and why it's gated
  - What the migration between phases costs

  **Diagram required: side-by-side comparison.** Move 2.5
  always includes one comparison diagram — Phase A on
  the left, Phase B on the right, with the elements
  that change marked (an arrow, a `(new!)` label, a
  highlighted box). The reader sees in one glance what
  stays the same and what changes.

    ```
              Phase A (now)            Phase B (later)
    ┌────────────────────────┐  ┌────────────────────────┐
    │ user_id: hardcoded     │  │ user_id: from session  │ ←
    │   ▼                    │  │   ▼                    │
    │ schema gate  ✓         │  │ schema gate  ✓         │
    │   ▼                    │  │   ▼                    │
    │ row returns            │  │ RLS gate  ✓  (new!)    │ ←
    │                        │  │   ▼                    │
    │                        │  │ row returns            │
    └────────────────────────┘  └────────────────────────┘
       schema gate unchanged across both phases
    ```

  Example shape in prose:

    *Phase A (now):* No real auth. Client hardcodes
    a user_id. Schema gate is active. RLS exists as
    a migration file but isn't installed.

    *Phase B (later):* Ship real auth. Stop hardcoding
    user_id — it comes from the session. Run the RLS
    migration. Both gates live.

  The key insight this sub-section often surfaces:
  *what doesn't have to change.* "The schema didn't
  have to change between phases" is the kind of
  takeaway that turns a Phase A/B description into
  a lesson about architectural foresight.

  Skip this sub-section when the concept is fully
  shipped and stable.

  #### Move 3 — The principle (final paragraph)

  End with the takeaway that generalises beyond this
  codebase. Not a summary of what was just said —
  the underlying principle the concept exemplifies.
  "This is what people mean by designing for multi-
  tenancy from the start." "This is what defense in
  depth looks like in a real system." "This is why
  every web framework eventually adds optimistic
  updates."

  The principle paragraph is the bridge to the
  diagram below and to the reader's broader
  understanding. After this, the reader knows what
  the concept is, why this codebase uses it, and
  where else they'll see it. The diagram that follows
  is the visual recap of the mechanics they just
  understood.

  ### Hard rules

  - **No definition-first openings.** "X is a
    mechanism for..." is banned. Start with the mental
    model, end with the term.

  - **Bridge from what the reader knows in every
    sub-section.** If a sub-section has no bridge to
    a frontend concept the reader already understands,
    the writer hasn't done the work yet.

  - **Every abstract claim followed by a concrete
    consequence.** "This is secure" is banned;
    "If the client tries X, the database returns Y"
    is required.

  - **Name the terms; don't dance around them.**
    "Composite primary key" not "a special kind of
    key." Real terms, used after they're introduced
    with the bridge.

  - **Length scales with complexity.** A four-paragraph
    How it works for a complex auth pattern is a
    failure. A twenty-paragraph How it works for
    debounce is over-engineering. Calibrate.

  - **Code/file references inline where they earn it.**
    "The file `0002_rls_policies.sql` contains these
    policies — written, committed, ready, but not
    activated yet." File names ground the abstract
    in the actual repo.

  - **Diagrams at every move.** Move 1 gets a mnemonic
    diagram of the mental model. Every Move 2
    sub-section gets at least one mechanism diagram.
    Move 2.5 gets a side-by-side comparison. A How it
    works block with prose-only sub-sections is
    incomplete — the diagrams aren't decoration, they
    carry the mechanics. Every diagram is wrapped in
    prose: one sentence before, one after.

  End with a sentence that hands off to the primary
  diagram: "The full picture is below." Or: "Here's
  the diagram of the whole flow." The diagram that
  follows is the recap visual — it shows everything
  the prose just walked through, in one frame.

  ### Worked example — what good looks like

  This is what a How it works section looks like when
  the rules above are followed. The concept being
  explained is *multi-tenant data isolation in
  Postgres with both schema-level and policy-level
  enforcement* — a backend pattern the reader has
  likely never built but will be asked about. Notice
  a diagram at every move: a mnemonic for Move 1, a
  table-rows diagram for Layer 1, a flow diagram for
  the lookup, a transformation diagram for Layer 2,
  a side-by-side for Phase A vs B.

  > **The mental model: two WHERE conditions, either
  > one enough to scope the rows.**
  >
  > You've already built half of this pattern. When
  > you write a backend route, you check the logged-in
  > user in the handler AND you filter the query by
  > `user_id`. Two independent guards on the same
  > request: if the handler check has a bug, the
  > `user_id` filter still scopes the rows; if you
  > forget the filter, the handler check still
  > blocked the wrong user.
  >
  > ```
  > A query for one user's data passes two gates:
  >
  >   incoming query
  >        │
  >        ▼
  >   ┌─────────────────────────┐
  >   │ Gate 1: schema          │  composite key —
  >   │ (user_id, id) together  │  always on
  >   └───────────┬─────────────┘
  >        │
  >        ▼
  >   ┌─────────────────────────┐
  >   │ Gate 2: RLS policy      │  WHERE user_id =
  >   │ auto-added WHERE clause │  auth.uid() —
  >   └───────────┬─────────────┘  Phase B only
  >        │
  >        ▼
  >   rows for this user only
  > ```
  >
  > This codebase enforces multi-tenant isolation
  > with that same two-gate shape, but the gates sit
  > at two different layers: the database schema
  > itself (always on), and a Postgres policy
  > (written, not yet active). Two independent
  > mechanisms, layered. If one fails, the other
  > holds.
  >
  > **Layer 1: The schema gate (always on)**
  >
  > Every table that syncs to the cloud has a
  > *composite primary key*: `PRIMARY KEY (user_id, id)`.
  >
  > If you're coming from frontend, you're probably
  > used to thinking of an `id` as globally unique —
  > one `id`, one row, like a `key` prop. Here it's
  > different. A row isn't identified by `id` alone;
  > it's identified by the *pair* `(user_id, id)`.
  > Look at the table:
  >
  > ```
  > journal_entries
  > ┌──────────┬──────┬──────────────┬──────────────┐
  > │ user_id  │ id   │ body         │ created_at   │
  > ├──────────┼──────┼──────────────┼──────────────┤
  > │ alice    │ abc  │ "took a walk"│ 2024-01-05   │
  > │ alice    │ def  │ "called mom" │ 2024-01-06   │
  > │ bob      │ abc  │ "shipped v2" │ 2024-01-06   │ ← id=abc
  > └──────────┴──────┴──────────────┴──────────────┘   again,
  >          └────┬────┘                                 different
  >       PRIMARY KEY (user_id, id)                      row
  > ```
  >
  > Alice has a row with `id = abc`. Bob also has a
  > row with `id = abc`. They are different rows,
  > because the *pair* is what's unique, not the
  > `id` column alone.
  >
  > The practical consequence: if Bob's client sends
  > a query for `id = 'abc'` belonging to Alice, the
  > database looks for the pair `(bob, 'abc')` —
  > which is Bob's own row, not Alice's. Bob
  > physically cannot address Alice's row, because
  > the only `id` his session can pair with is his
  > own `user_id`. Walk it through:
  >
  > ```
  > Bob's client                Database lookup
  > ─────────────────           ───────────────────
  > "give me entry abc"   ──►   looks for the pair
  > (Bob's session                (bob, abc)
  >  supplies user_id=bob)            │
  >                                   ▼
  >                             ┌──────────────────┐
  >                             │ that's Bob's own │
  >                             │ row — NOT the    │
  >                             │ (alice, abc) row │
  >                             └──────────────────┘
  >                                   │
  >                                   ▼
  >                             Alice's row is
  >                             unreachable, not
  >                             "denied" — just not
  >                             addressable
  > ```
  >
  > This isn't a permission check ("you're not
  > allowed to see this"); it's an addressing fact
  > ("you cannot even name that row"). The isolation
  > is structural. It works whether the user is
  > logged in or out — it's baked into how rows are
  > keyed and looked up.
  >
  > **Layer 2: The runtime gate (RLS — Row Level
  > Security)**
  >
  > RLS is a Postgres feature where you write
  > policies on the table itself that say "whenever
  > anyone queries this table, automatically add
  > `WHERE user_id = auth.uid()` to their query."
  > `auth.uid()` is the currently-authenticated
  > user's id, pulled from their session token.
  >
  > If you've used Express middleware —
  > `app.use(authMiddleware)` running before your
  > route handlers — RLS is that idea, but it runs
  > inside the database instead of your app code,
  > on every single query. Here's the rewrite it
  > performs:
  >
  > ```
  > What the app sends:
  >   SELECT * FROM journal_entries;
  >        │
  >        ▼  Postgres applies the RLS policy
  >        │
  > What actually executes:
  >   SELECT * FROM journal_entries
  >   WHERE user_id = auth.uid();
  >        │
  >        ▼
  >   only the current user's rows come back
  > ```
  >
  > So even if a client runs `SELECT * FROM
  > journal_entries` with no filter at all, the
  > database silently appends the `WHERE` clause.
  > The client physically cannot retrieve other
  > users' rows because the query that runs never
  > selects them.
  >
  > The file `0002_rls_policies.sql` contains these
  > policies. They're written, committed, ready —
  > but not *activated* yet in Phase A.
  >
  > **Why two gates instead of one?**
  >
  > Because they fail differently:
  >
  > ```
  >                  Schema gate         RLS gate
  >                  ───────────         ────────
  > Depends on:      how rows are        auth.uid()
  >                  keyed (static)      returning the
  >                                      right value
  >
  > Fails when:      a query bypasses    auth is
  >                  the composite key   misconfigured
  >                  (very rare)         (more likely)
  >
  > If it fails,     RLS still appends   schema key
  > the other gate:  the WHERE clause    still scopes
  >                  ✓ data safe         the lookup
  >                                      ✓ data safe
  > ```
  >
  > Two independent failure modes have to both go
  > wrong, at the same time, to leak data. That's
  > the whole point of layering them.
  >
  > **Phase A vs Phase B**
  >
  > ```
  >           Phase A (now)              Phase B (later)
  > ┌──────────────────────────┐ ┌──────────────────────────┐
  > │ user_id: hardcoded in    │ │ user_id: from the auth   │ ←
  > │   the client             │ │   session (auth.uid())   │
  > │     ▼                    │ │     ▼                    │
  > │ Gate 1: schema  ✓        │ │ Gate 1: schema  ✓        │
  > │     ▼                    │ │     ▼                    │
  > │ rows returned            │ │ Gate 2: RLS  ✓  (new!)   │ ←
  > │                          │ │     ▼                    │
  > │ (RLS migration exists    │ │ rows returned            │
  > │  but is not installed)   │ │                          │
  > └──────────────────────────┘ └──────────────────────────┘
  >    Gate 1 is identical in both phases — the
  >    schema never had to change.
  > ```
  >
  > *Phase A (now):* No real auth. The client
  > hardcodes a `user_id` and stamps it onto every
  > row. There's only one user — you. The schema
  > gate is active and doing its job. RLS exists as
  > a migration file but isn't installed, because
  > there's no `auth.uid()` to filter against yet.
  >
  > *Phase B (later):* Ship Supabase Auth. Stop
  > hardcoding the user_id — it now comes from the
  > authenticated session. Run the RLS migration so
  > the policies become active. Both gates live.
  >
  > The key thing: **the schema didn't have to change
  > between phases.** The composite primary key was
  > correct from day one. You just turn on the second
  > gate when auth is ready.
  >
  > This is what people mean by "designing for
  > multi-tenancy from the start" — even with one
  > user, the table shape already supports many. You
  > don't pay a migration cost later to add a
  > `user_id` column, backfill it, and re-key every
  > row. It's already there.
  >
  > The full picture is below.

  What this example does right:
  - Opens by anchoring to a primitive the reader
    has built — the two-guard request handler
    (`user` check plus `user_id` filter) — and a
    mnemonic diagram of the two gates. No locked
    doors, no whole-product references.
  - Every move has a diagram. Move 1: the two-gate
    mnemonic. Layer 1: a literal table with rows
    and columns showing why `(user_id, id)` makes
    Alice's and Bob's `id=abc` distinct — then a
    flow diagram walking a cross-user lookup
    failing. Layer 2: the query-rewrite
    transformation. "Why two gates": a comparison
    of the two failure modes. Phase A vs B: a
    side-by-side with `(new!)` marking what
    changes.
  - Each diagram is wrapped in prose — a sentence
    introduces it, a sentence follows it. No
    diagram stands alone.
  - The "if you're coming from frontend, you're
    used to X — here it's different" bridge appears
    in every layer, with X being a frontend
    primitive (the unique-`id` assumption, the
    `key` prop, Express middleware).
  - Every abstract claim ("the isolation is
    structural") is followed by a concrete,
    walked consequence.
  - Phase A vs Phase B is a first-class sub-section,
    and the takeaway names the principle.

  ---

  ## [Concept name] — diagram

  [Primary diagram — comes after How it works as the
   recap visual. Labels every box, every arrow, and
   every architectural layer (UI, Service, Storage, etc.)
   where the system has them. Stands alone — a reader
   who only looks at this diagram should grasp the
   structure without reading the prose above.]

  ---

  ## In this codebase

  [Where exactly this pattern lives. Required for every file:]

  **File:** `path/to/file.ts`
  **Function / class:** `functionName()` or `ClassName`
  **Line range:** L[start]–L[end] (e.g. L42–L67)

  Link format for GitHub:
  `[functionName](https://github.com/[owner]/[repo]/blob/main/path/to/file.ts#L42-L67)`

  Show the relevant code in pseudocode or a trimmed
  real snippet if it clarifies the implementation.
  Do not paste large blocks — show the shape, not
  the full implementation.

  If multiple files are involved, list all of them:
  **Entry point:** `netlify/functions/projects.ts` L12–L34
  **Storage:**     `netlify/functions/lib/storage/projects.ts` L5–L28
  **Types:**       `src/lib/types.ts` L14–L22

  ---

  ## Elaborate

  [See elaborate block definition below]

  ---

  ## Tradeoffs

  Most architectural decisions are not about right vs
  wrong. They are about which costs you can afford to
  pay and which ones would have broken you. This block
  names both sides of the ledger — what was paid, what
  would have been paid the other way — so the reader
  sees the decision as a choice rather than an obvious
  default.

  Four sub-blocks. The first three are required for
  every concept file; the fourth is optional but
  valuable when it applies. Open the block with a
  comparison table that puts both paths' costs side
  by side, then walk each sub-block in prose.

  ### Comparison table — both costs in one frame

  Two-column table. Left column: the path taken in this
  codebase. Right column: the obvious alternative. Each
  row is one cost dimension — and there are more cost
  dimensions than money. Cover all that apply:

  ┌──────────────────┬──────────────────┬──────────────────┐
  │ Cost dimension   │ Path taken       │ Alternative      │
  ├──────────────────┼──────────────────┼──────────────────┤
  │ Build time       │ ...              │ ...              │
  │ Latency          │ ...              │ ...              │
  │ Dollars/month    │ ...              │ ...              │
  │ Complexity       │ ...              │ ...              │
  │ Team cog. load   │ ...              │ ...              │
  │ Vendor lock-in   │ ...              │ ...              │
  │ Debugging        │ ...              │ ...              │
  │ Hire-ability     │ ...              │ ...              │
  │ Migration cost   │ ...              │ ...              │
  │ Failure blast    │ ...              │ ...              │
  └──────────────────┴──────────────────┴──────────────────┘

  Not every row needs a value — skip dimensions that
  don't apply. But at least four rows must be filled in
  for the table to count. A table with only "complexity"
  and "dollars" is the lazy version of this block.

  ### Sub-block 1 — what we gave up

  Two to four short paragraphs. Walk the costs the
  path-taken column lists, one or two per paragraph,
  with the concrete shape of each cost. Not "added
  complexity" — say which file holds the extra layer,
  how many lines it adds, what a new contributor has to
  read before they can change it. Cost dimensions to
  consider, with what "concrete" looks like for each:

  - **Performance cost** — latency in ms, throughput
    drop in requests/sec, memory in MB, payload in KB.
    "Adds ~40ms to every chain call from the factory
    indirection." Not "may impact performance."

  - **Money cost** — dollars per month at current usage,
    dollars per 1k operations, dollars per user.
    "$0.12 per 1k caption generations at current
    Sonnet 4 pricing; ~$8/month at solo usage."

  - **Complexity cost** — files added, lines added,
    layers between caller and callee, concepts a new
    contributor must learn. "Three extra files in
    `lib/providers/`; one shared interface a contributor
    must read before adding any provider." This is
    where most teams under-count — complexity costs
    compound silently.

  - **Cognitive load** — how much of the codebase a
    contributor has to keep in their head to be
    productive. "Anyone touching chains has to know
    which provider runs in which env; one extra
    mental model on top of the chain logic itself."

  - **Vendor lock-in** — what breaks if the chosen
    vendor disappears, changes pricing, or deprecates
    the API. "Switching off Netlify Blobs would
    require rewriting every storage wrapper in
    `netlify/functions/lib/storage/` — about a week
    of work." Quantify the migration, not just the
    risk.

  - **Debugging cost** — how hard it is to find the
    bug when something goes wrong. "Errors from the
    underlying provider bubble through the abstraction
    layer with the original stack trace intact, but
    rate-limit errors look identical across providers
    so you have to check the provider env var to know
    who's throttling you."

  - **Hire-ability and onboarding** — does a new
    engineer recognise this pattern or have to learn
    it? "Any React engineer recognises a context
    provider; almost no one recognises our custom
    chain-routing pattern, so onboarding adds 1–2
    days."

  - **Failure blast radius** — when this thing breaks,
    what else breaks with it? "All three providers
    sit behind the same factory; if the factory throws
    at startup, every chain in the app fails to load."

  Every cost named must point at a real file, a real
  number, or a real scenario. Generic costs ("added
  complexity", "some performance impact", "vendor risk")
  are banned — they are the prose equivalent of
  shrugging.

  ### Sub-block 2 — what the alternative would have cost

  Two to four short paragraphs. Same cost dimensions,
  applied to the path not taken. This is the half of
  the tradeoff most candidates skip — they describe
  what they pay without describing what they avoided
  paying.

  The structure mirrors sub-block 1 but with a
  counterfactual frame: "If we had used [alternative]
  instead, the cost would have been [concrete shape]."

  Example for provider abstraction:

  > If we had hardcoded one provider into every chain,
  > the up-front complexity cost would have been zero —
  > no factory, no shared interface, no env-based
  > routing. But the cost of switching providers later
  > would have meant editing every chain file
  > individually. With six chains in the codebase and
  > the provider switch happening twice in the last
  > year (once when pricing changed, once when the
  > first provider rate-limited us), that would have
  > been twelve chain rewrites instead of two env
  > flips.

  The alternative's cost is often invisible to people
  who never paid it. Make it visible.

  ### Sub-block 3 — the breakpoint

  One short paragraph. Name the concrete condition
  under which the path taken stops being the right
  call. A tradeoff without a breakpoint is just a
  complaint; a tradeoff with a breakpoint becomes a
  scheduled decision the team can revisit when the
  conditions change.

  Good breakpoints are quantitative or event-shaped:

  - "Fine until traffic exceeds 1M chain calls/day —
    at that point the indirection cost becomes
    measurable and the factory should be inlined."
  - "Fine until the team grows past six engineers —
    at that point the cognitive load of the custom
    pattern exceeds the savings of provider switching."
  - "Fine until a single provider's unique features
    (e.g. caching, structured outputs) become
    load-bearing — at that point the lowest-common-
    denominator interface becomes the bottleneck."
  - "Fine until offline support becomes a requirement
    — at that point the network-bound provider model
    needs replacing with local inference."

  Bad breakpoints are vague:

  - "Fine for now." (When is now over?)
  - "Fine until it isn't." (Useless.)
  - "Fine until we scale." (What's scale?)
  - "Fine until requirements change." (Which ones?)

  If you cannot name a breakpoint, the decision was
  not a tradeoff — it was a guess. Say that openly
  rather than inventing a fake one.

  ### Sub-block 4 — what wasn't actually a tradeoff (optional)

  One short paragraph, when relevant. Sometimes the
  "obvious alternative" people might bring up wasn't
  a real option in the first place. Surfacing the
  non-options pre-empts wasted discussion and shows
  the reader you considered them.

  Examples:

  - "Redis was not a real alternative for this — we
    needed durable storage that survived restarts.
    Redis is in-memory by default and the AOF option
    would have meant operating Redis as a database,
    which is not what it is good at."
  - "A self-hosted LLM was not a real alternative at
    this scale — the cost of a single GPU instance
    exceeds our entire monthly API spend by 100x at
    current usage. Self-hosting only makes sense
    above ~5M tokens/day."
  - "Building our own vector DB was not a real
    alternative — the team has no one with
    distributed-systems experience, and the failure
    modes of an under-built vector store (silent
    recall degradation) are the worst kind to debug."

  Skip this sub-block when every plausible alternative
  was a real option. Forcing it in when nothing fits
  makes the document feel defensive.

  ### Tone — own the cost, do not apologise for it

  Hedging is the failure mode of this block. The
  decision was made; the cost was paid; the
  alternative had its own cost. Write that as a
  statement, not an apology. "We pay 40ms per chain
  call for provider flexibility, and we'd make the
  same trade again at this scale" reads stronger
  than "performance is acceptable but could be
  improved." If the decision was wrong in hindsight,
  say so plainly — that goes in this block, and it
  is more credible than defending a bad call.

  ---

  ## Tech reference (industry pairing)

  This block is the only place industry pairings
  live. Other sections (How it works, Tradeoffs,
  Interview defense) may name what the codebase
  uses, but the leader/runner-up pairing is
  consolidated here — one section per file, one
  subsection per tech.

  The job of this block is to let the reader build
  a mental map of where this codebase sits relative
  to the industry: what's chosen here, what's
  leading today, and what the credible alternatives
  are.

  ### Format — one `###` subsection per tech

  For every distinct library, framework, or service
  this file references — runtime, framework, ORM /
  query layer, AI provider, storage, queue, auth,
  observability, anything load-bearing — add a
  `###` subsection with the tech name as the
  heading. Inside the subsection, use labelled
  bullets. **Do not use markdown tables with pipes
  for these entries** — they break in narrow
  renderings and are illegible on mobile. Bullets
  with `**Label:**` prefixes are mandatory.

  Each subsection has five fields. The first two
  describe the codebase; the next three describe
  the industry context.

  - **Codebase uses:** the real library / framework
    / service in the repo, with version where it
    matters and the file or import line where it's
    instantiated.
  - **Why it's here:** one sentence naming the
    specific job this tech does in this codebase —
    the thing that would break if it were missing.
  - **Leading today:** name the current industry
    leader for this category, labelled as either
    `adoption-leading` (most-deployed in production
    today — for battle-tested patterns like auth,
    request flow, DB access) or `innovation-leading`
    (most mindshare/momentum, likely to lead in
    1–2 years — for fast-moving areas like AI
    tooling, edge compute, type safety). Include
    the year (2026, per the spec header).
  - **Why it leads:** one sentence naming the
    specific technical reason — typed end-to-end,
    server-component-native, zero bridge cost,
    edge-runtime-compatible. Never marketing.
  - **Runner-up:** name a credible alternative
    with one sentence on its angle. If the codebase
    already uses the leader, this field is required
    so the alternative landscape stays visible.
    Otherwise it's optional but valuable.

  Never claim a single tech "won". Where real
  disagreement exists (App Router vs Pages Router,
  Prisma vs Drizzle, Server Actions vs tRPC), name
  it in one of the fields rather than smoothing it
  over.

  ### Worked example — for a local-first request-flow file

  ### expo-sqlite (WAL)

  - **Codebase uses:** `expo-sqlite` in WAL mode,
    single-process via `loopd.db`. Opened in
    `src/lib/database.ts` at startup.
  - **Why it's here:** the synchronous write layer
    that makes "keystroke → ~1ms write → UI
    re-render" possible. If it were async, the
    optimistic UI shape collapses.
  - **Leading today:** `expo-sqlite` —
    adoption-leading, 2026.
  - **Why it leads:** ships with the Expo SDK;
    battle-tested WAL mode; mirrors the SQLite C
    API directly with zero bridge cost for Expo
    projects.
  - **Runner-up:** `op-sqlite` — innovation-leading
    JSI-direct binding with no bridge cost; the
    perf-tier alternative for bare React Native
    projects.

  ### @supabase/supabase-js + Supabase Postgres

  - **Codebase uses:** `@supabase/supabase-js`
    against managed Supabase Postgres as the cloud
    provider layer. `pushAll()` upserts dirty rows
    via the Supabase client.
  - **Why it's here:** the cloud mirror that
    receives every row the 5-second debounce
    batches and sends via HTTPS upsert.
  - **Leading today:** Supabase —
    adoption-leading for Postgres-as-a-service,
    2026.
  - **Why it leads:** managed Postgres + auth + RLS
    + Storage in one console; SDK mirrors
    PostgREST, so an upsert with `onConflict` is
    one call.
  - **Runner-up:** Neon + Drizzle —
    innovation-leading typed SQL with
    branch-per-PR; Convex is the reactive-first
    alternative.

  ### What this block is NOT

  - Not a rewrite of Tradeoffs. Tradeoffs name what
    was given up. Tech reference names what the
    industry context is. They overlap only in that
    both can mention alternatives — but the
    alternative in Tradeoffs is what was rejected
    in this codebase; the alternative in Tech
    reference is what's leading in the industry.
  - Not a place for prose paragraphs. Five bullets
    per tech, that's the shape.
  - Not a place for markdown tables. Use the
    `###` heading + labelled bullets format
    exactly. Pipe-tables render as garbage on
    narrow screens.

  ---

  ## Project exercises

  This block names the curriculum-defined exercises
  that build understanding of this concept by
  *making* something — not just reading about it.
  It exists for two reasons. First: some concepts in
  the AI engineering and ML curriculum are not yet
  implemented in any of the user's codebases — but
  the user still needs to learn them, and the
  curriculum already specifies a concrete project
  exercise for each one. Second: even for concepts
  already in the codebase, the next exercise in the
  curriculum is often the right next step to deepen
  understanding (add evals, harden under failure,
  measure cost). Project exercises name those next
  steps.

  ### The two cases this block covers

  **Case A — concept is implemented in the codebase.**
  In this case, In this codebase already names the
  files and walks the implementation. Project
  exercises here names the *next* curriculum build
  item that extends, evaluates, or hardens the
  existing implementation. Example: if the file is
  about LLM caching and the codebase has prompt
  caching active, the project exercise is to add
  the semantic cache layer named in the curriculum
  (B5.8 in the loopd curriculum) — the same concept,
  one step deeper.

  **Case B — concept is in the curriculum but not
  yet in the codebase.** In this case, the file
  still exists (the spec generates one file per
  curriculum concept that's tagged in-scope for the
  project, regardless of current implementation
  state). In this codebase says "Not yet
  implemented" with one honest sentence about why
  (deferred to Phase X, gated on prerequisite Y).
  Project exercises here is the *primary*
  buildable target — the curriculum's Build item
  becomes the spec for building the thing.

  Case B is the load-bearing reason this block
  exists. Without it, files for not-yet-implemented
  concepts would have nothing concrete in them.
  With it, every file has either a documented
  implementation (Case A) or a clear next exercise
  (Case B). The reader is never left with an
  abstract concept and no path forward.

  ### Format — one `###` subsection per exercise

  For every curriculum Build item that maps to this
  concept's IDs (the `[Cx.y]` and `[Bx.y]` tags
  from the curriculum), add a `###` subsection.
  Inside, use labelled bullets — same shape as
  Tech reference, so the file reads consistently.

  - **Exercise ID:** the curriculum's identifier,
    verbatim (e.g. `[B1.1]`, `[B2C.6]`, `[B5.9]`).
    The reader can cross-reference back to the
    curriculum for context.
  - **What to build:** the exercise statement from
    the curriculum, lightly edited if the original
    references concepts the reader hasn't met yet.
    Concrete deliverable, not a learning goal.
  - **Why it earns its place:** one sentence on
    what understanding this exercise produces that
    reading alone can't. The interview signal it
    creates.
  - **Files to touch:** the actual file paths in
    this codebase where the exercise would land.
    Names the codebase, not the curriculum. If
    files don't exist yet (Case B), name the
    expected paths and which directory they belong
    in.
  - **Done when:** a measurable end-state —
    "Zod schemas exist for all 5 chains and
    `pnpm test` passes" or "Per-class F1 reported
    on a 50-item held-out set, saved to
    `docs/ml-results.md`." If the exercise has no
    measurable end-state, the exercise is wrong.
  - **Estimated effort:** one of `<1hr`, `1–4hr`,
    `1–2 days`, `≥1 week`. Honesty here is more
    valuable than precision — the reader is
    deciding whether to take this on this week or
    park it for the next sprint.

  ### How to choose which exercises appear

  An exercise belongs in a file if it exercises one
  of the concept IDs the file covers. A single
  concept may map to one exercise or several. A
  single exercise may appear in two files if it
  legitimately exercises two concepts — but mark
  the primary file and reference it from the
  secondary one to avoid duplicating the spec.

  In general, expect 1–3 exercises per file. If a
  file has zero matching exercises in the
  curriculum, the file is either covering a
  `learn-only` concept (no exercise by design — say
  so in one line) or the concept isn't actually
  part of this project's curriculum scope (in
  which case the file shouldn't exist at all).

  ### Worked example — Case A: extending an
  implemented concept

  This is an excerpt from a hypothetical
  `study-ai-engineering/05-evals-and-observability/04-llm-observability.md`
  file. The codebase already has a local
  `ai_call_log` table; the curriculum exercise
  pushes it toward proper LLM tracing.

  > ### [B3.11] Local ai_trace table for LLM tracing
  >
  > - **Exercise ID:** `[B3.11]`
  > - **What to build:** Extend the existing
  >   `ai_call_log` table to capture full traces —
  >   per-request: input, output, latency, tokens,
  >   cost, model, prompt version — plus per-step
  >   spans for chain steps and tool calls.
  > - **Why it earns its place:** Tracing is the
  >   diff between "the chain failed" and "the
  >   summarize step failed because the model
  >   returned an empty string." Without spans, you
  >   can't find the slow or broken link. With
  >   them, debugging an LLM bug stops being
  >   archaeology.
  > - **Files to touch:** `src/lib/database.ts`
  >   (new `ai_trace` table), `src/lib/ai/log.ts`
  >   (new `logTrace` helper), `src/lib/ai/chains/`
  >   (instrument each chain call site).
  > - **Done when:** every chain call in the app
  >   writes a trace row, the existing AI Ops
  >   dashboard shows a "View trace" link per call,
  >   and clicking it expands the per-step span
  >   tree.
  > - **Estimated effort:** 1–2 days.

  ### Worked example — Case B: a concept the
  codebase doesn't yet cover

  This is an excerpt from a hypothetical
  `study-ai-engineering/08-machine-learning/12-on-device-inference.md`
  file. The codebase ships an unquantized model;
  the curriculum exercise is to quantize.

  > In this codebase: not yet implemented. The form
  > classifier currently ships as an unquantized
  > LightGBM model bundled with the app at
  > `assets/models/form-classifier-v1.lgb`.
  > Quantization is gated on first reliable
  > inference latency measurements on a real
  > Android device.
  >
  > ### [B5.9] Quantize the form classifier
  >
  > - **Exercise ID:** `[B5.9]`
  > - **What to build:** Export the trained
  >   LightGBM classifier to a quantized format
  >   (int8 for tabular models, fp16 if a neural
  >   variant is introduced). Measure model size
  >   and per-rep inference latency on a real
  >   Android device, before and after.
  > - **Why it earns its place:** Quantization is
  >   the interview signal for on-device ML.
  >   Naming "I quantized my model from 12MB to
  >   3MB with no measurable accuracy loss"
  >   converts an abstract claim of on-device
  >   experience into a concrete artifact.
  > - **Files to touch:**
  >   `scripts/quantize-model.ts` (new — runs the
  >   conversion pipeline),
  >   `assets/models/form-classifier-v1-int8.onnx`
  >   (new — the quantized artifact),
  >   `src/lib/ml/inference.ts` (swap loader to
  >   accept the quantized format).
  > - **Done when:** quantized model is bundled,
  >   inference latency is measured at <50ms per
  >   rep on a Pixel 7, and per-class macro-F1
  >   on the held-out test set is within 0.01 of
  >   the unquantized model.
  > - **Estimated effort:** 1–2 days.
  >
  > ### [B5.10] Latency budget on a real device
  >
  > - **Exercise ID:** `[B5.10]`
  > - **What to build:** Measure end-to-end
  >   per-rep inference latency on a real Android
  >   device. Target <50ms per rep. Document the
  >   measurement methodology.
  > - **Why it earns its place:** A latency claim
  >   without a real-device measurement is
  >   marketing. This exercise produces the
  >   measurement.
  > - **Files to touch:** `docs/ml-latency.md`
  >   (new — the measurement report),
  >   `src/lib/ml/inference.ts` (add timing
  >   instrumentation).
  > - **Done when:** report exists with median, p95,
  >   p99 latency on three exercise classes,
  >   measured over ≥100 reps per class.
  > - **Estimated effort:** 4–8 hours.

  ### What this block is NOT

  - Not a brainstorm of every possible thing the
    reader could build. Only the curriculum's named
    Build items belong here, with their `[Bx.y]`
    IDs preserved. The curriculum is the source of
    truth; this block is a per-file projection of
    it.
  - Not a rewrite of the In this codebase block.
    In this codebase describes what *is*. Project
    exercises describes what comes *next*.
  - Not a tutorial. Each exercise is a target, not
    a walkthrough. The reader is expected to use
    Claude Code or their own judgment to implement.

  ---


  This block is the recap. By the time the reader gets
  here, they've seen the hook, the diagram, the
  mechanics, the codebase references, and the tradeoffs.
  Summary collapses all of that into a one-paragraph
  concept recap plus a bulleted list of the points worth
  carrying away. It's the block the reader returns to in
  three weeks when they need to remember what this file
  was about.

  Two parts, in this order. Recap paragraph first, then
  key points. No new information — everything here must
  already appear above.

  ### Part 1 — concept recap (one paragraph)

  Three to five sentences that summarise the concept in
  prose. Cover:
  - What the pattern is (one sentence — pulled from
    Why care's Move 2 or Move 5).
  - How it shows up in this codebase (one sentence —
    pulled from How it works or In this codebase).
  - The constraint that made it the right call here
    (one sentence — pulled from Tradeoffs).
  - The cost being paid for that choice (one sentence —
    pulled from Tradeoffs).

  Write it as if a colleague asked "wait, what's this
  file about again?" — the answer they get without
  scrolling.

  Worked example for provider abstraction:

  > Provider abstraction is the layer that lets a caller
  > swap between interchangeable implementations behind
  > a single interface. In this codebase, a factory
  > function returns one of three LLM clients (Anthropic,
  > OpenAI, local) and every chain calls through that
  > interface — no call site knows which provider is
  > running. The constraint that forced this was model
  > pricing volatility: providers change prices monthly
  > and the team wanted to switch without touching chain
  > code. The cost is two layers of indirection on every
  > call and a shared interface that lags behind any one
  > provider's newest features.

  ### Part 2 — key points to remember (3–6 bullets)

  Short, declarative statements. The kind of thing the
  reader could write on an index card. Each bullet
  should be:
  - One sentence — bullets that need two sentences
    belong in How it works or Tradeoffs.
  - A conclusion, not a definition — "X happens before Y"
    not "X is a function that does Y".
  - Specific to this codebase where it matters — generic
    facts about the pattern belong in Why care.

  Mix categories: at least one shape ("the parts and
  how they connect"), at least one rule ("the invariant
  this pattern maintains"), at least one tradeoff
  ("the cost being paid"). A reader who skims only the
  bullets should walk away with the shape, the rule,
  and the cost.

  Worked example for provider abstraction:

  > - One factory function, three concrete clients,
  >   one shared interface — every chain calls the
  >   interface, never a client directly.
  > - Provider selection happens once at startup based
  >   on env var; chains never branch on provider.
  > - Adding a new provider means implementing the
  >   interface, not touching any chain code.
  > - The shared interface is the lowest common
  >   denominator of all three providers — newest
  >   features from any one provider are invisible
  >   to the chains.
  > - Worth it when providers are commodities;
  >   not worth it when one provider's unique
  >   features are load-bearing.

  ---

  ## Interview defense

  [See interview defense block definition below]

  ---

  ## Validate your understanding

  [See validate block definition below]

─────────────────────────────────────────────────
THE SUBTITLE — required in every file
─────────────────────────────────────────────────

Every concept file opens with a two-line subtitle directly
under the H1 title and BEFORE the blockquote summary. Its
job is to let the reader explain this concept to other
technical developers using vocabulary they will recognise
immediately.

  ## Why the subtitle matters

  When you describe a concept in conversation, the listener
  is doing a fast lookup: "have I seen this pattern before,
  and what is it called?" If you can name the formal pattern,
  the listener catches on in one second instead of three
  paragraphs. The subtitle makes that vocabulary visible.

  ## The two fields

  **Industry name(s):**
    The formal, widely-recognised names this pattern goes by
    in software engineering literature and practice. List
    every reasonable mapping. If the pattern has no formal
    name (e.g., it is a project-specific composition of
    multiple known patterns), write
    "— (project-specific composition of [X] + [Y])".

    Examples:
      → Provider abstraction → "Strategy pattern, Adapter
                                 pattern, Provider pattern"
      → Optimistic UI        → "Optimistic concurrency control,
                                 client-side speculation"
      → Connection pooling   → "Resource pool pattern,
                                 connection pool pattern"

  **Type:**
    One of four labels that tells the reader whether the
    concept transfers to other contexts:

      Industry standard
        Has a recognised name in textbooks, blog posts, or
        industry conferences. Other devs will know the term.

      Language-agnostic
        The principle behind the pattern transfers across
        stacks and languages. Implementations differ but
        the rule is the same.

      Industry standard · Language-agnostic
        Both. The pattern has a formal name AND the principle
        transfers. Most architectural patterns are this.

      Project-specific
        Emergent in this codebase. No widely-recognised name.
        Worth knowing because it shows up here, but the
        reader should not expect to encounter it elsewhere
        as a named pattern.

  ## Worked example

  ### Provider abstraction (a serverless LLM service)

    # Provider abstraction
    **Industry name(s):** Strategy pattern, Adapter pattern, Provider pattern
    **Type:** Industry standard · Language-agnostic

    > Switching layer that lets the caller pick which LLM
    > provider runs without changing any chain code.

  ### Reorder-by-rebuild (a project-specific operation)

    # Reorder-by-rebuild
    **Industry name(s):** — (project-specific composition of
                              hash-map indexing + position
                              rewrite)
    **Type:** Project-specific

    > Reorders a list of N items by building an id→item map,
    > rewriting positions in newOrder pass-order, and
    > returning the sorted result.

  ## Where to read the subtitle

  Skimming the section README is one path. The other is
  scanning subtitles directly: a reader can skim a folder of
  concept files and decide which to open by reading subtitles
  alone. Industry-standard patterns deserve a quick read-through;
  project-specific compositions deserve a deeper one.

─────────────────────────────────────────────────
THE ELABORATE BLOCK — required in every file
─────────────────────────────────────────────────

The elaborate block is the bridge between what this
codebase does and why the pattern exists in the world.
It answers the question a curious reader asks after
understanding the immediate explanation: "where did
this come from and what else should I know?"

Every concept file ends with an elaborate block.
Structure it as:

  ## Elaborate

  ### Where this pattern comes from
  [2–3 sentences on the origin — what problem the
   industry was trying to solve when this pattern
   was invented or named. Not a history lesson —
   just enough context to make the pattern feel
   inevitable rather than arbitrary.]

  ### The deeper principle
  [The generalised insight behind this specific pattern.
   What would you take away from this if you never used
   this codebase again? Name the principle explicitly.
   Show it with a diagram or comparison if it has structure.]

  ### Where this breaks down
  [When this pattern stops being the right choice.
   Concrete conditions — "when X exceeds Y" or "when
   Z is required". A pattern without its limits is
   just dogma.]

  ### What to explore next
  - [Related concept] → [one line on how it connects]
  - [Adjacent pattern] → [one line on how it connects]
  - [More advanced version] → [one line on how it connects]

Example of an elaborate block done right:

  ## Elaborate

  ### Where this pattern comes from
  Serverless functions emerged from the observation that
  most web applications spend 90% of their time doing
  nothing — waiting for requests. Always-on servers pay
  for that idle time. The serverless model bills only
  for the milliseconds a function runs, which aligns
  cost with actual usage at low scale.

  ### The deeper principle
  Stateless compute. The principle is that a function
  should be a pure transformation: given the same input,
  it returns the same output, regardless of what ran
  before it. This is the same principle behind pure
  functions in functional programming — just applied
  to infrastructure.

  ┌──────────────────────────────────────────────┐
  │  Stateless function                          │
  │                                              │
  │  Request → [function] → Response            │
  │                                              │
  │  No memory of previous requests.            │
  │  No shared state between invocations.       │
  └──────────────────────────────────────────────┘

  ### Where this breaks down
  When you need low-latency on every request — cold
  starts add 100–400ms on first invocation, which is
  acceptable for user-triggered actions but not for
  real-time features. When you need persistent
  connections (WebSockets, long-running jobs). When
  you have heavy computation that exceeds the function
  timeout limit.

  ### What to explore next
  - Edge functions → serverless but runs closer to the
    user, lower latency, more constraints
  - Connection pooling → how databases handle the
    stateless connection problem at scale
  - Worker queues → how long-running jobs are handled
    when serverless timeouts are a constraint

─────────────────────────────────────────────────
THE INTERVIEW DEFENSE BLOCK — required in every file
─────────────────────────────────────────────────

The interview defense block sits at the end of every
concept file after tradeoffs. Its job is direct: take
what the reader just learned and show them exactly how
an interviewer will probe it — and how to answer without
freezing.

This is not a repeat of the interview spec. The study
guide explains the concept. The interview defense block
turns that understanding into a conversation the reader
can have under pressure. The difference between knowing
something and being able to say it confidently is
usually just having seen the question before.

Every concept file ends with an interview defense block.
Structure it as:

  ## Interview defense

  ### What an interviewer is really asking
  [One paragraph. Behind every technical question is a
   softer question: do you understand the tradeoffs, or
   did you just use this because everyone else does?
   Name what the interviewer is actually probing for.
   This reframe makes the questions easier to answer —
   because the reader knows what game is being played.]

  ### Likely questions

  [List every question an interviewer would plausibly
   ask about this specific concept as it appears in
   this codebase. Not generic — grounded in the actual
   implementation. Label each question with the level
   it tests:]

    [mid]    — implementation knowledge
    [senior] — decision-making and tradeoffs
    [arch]   — system-level consequences and scale

  For each question, provide:
    Q: [the question, written exactly as an interviewer
        would say it — direct, slightly uncomfortable]

    A: [Model answer in first person. 3–5 sentences.
        Must include:
        → the decision that was made (specific, not vague)
        → the constraint that drove it
        → the tradeoff that was accepted
        → what would change at scale or under different
           constraints
        Written at the level the question label indicates.]

    Diagram: [Small ASCII diagram that supports the
        answer. This is the visual the reader can sketch
        on a whiteboard while they speak — not a recap
        of the primary diagram. Keep it tight: 5–10 lines,
        labelled, minimum boxes needed to make the point.
        Match the diagram type to the question level:]

        [mid]    → flow or shape diagram — 3–5 boxes
                    showing what the thing does or how
                    its parts connect. "Here's what a
                    request does, step by step."

        [senior] → comparison diagram — two-column
                    table or side-by-side flows showing
                    "what we picked" vs "what we didn't,
                    and why." The tradeoff is the point.

        [arch]   → scale or boundary diagram — what
                    changes at 10x, where the
                    architecture breaks first, what
                    layer would need replacing. Often
                    a layer diagram with one layer
                    marked "breaks first."

    Skip the diagram only when the question is genuinely
    non-visual ("why TypeScript over JavaScript" → tradeoff
    bullets, not a diagram). When in doubt, draw it —
    the act of drawing is the practice.

  ### The question candidates always dodge
  [One question per concept that trips people up — the
   one where candidates either get defensive, go vague,
   or pivot to something they're more comfortable with.
   Write the question. Then write the honest answer that
   owns the limitation without apologising for it.
   This answer should be longer than the others —
   it's the one that separates candidates who
   understand from candidates who built.]

   This question always gets a diagram. The dodge is
   usually a "why didn't you do X" question, and the
   visual is the comparison: what was picked, what was
   suggested, why the suggestion's cost was higher than
   it looks. Two-column table or side-by-side flows.

  ### One-line anchors
  [3–5 short, memorable statements about this concept
   that the reader can hold in their head walking into
   the interview. Not definitions — conclusions.
   The kind of thing you'd say to demonstrate you've
   thought about this, not just used it.]

  Example:
  - "Serverless is cheap at low scale and forces
     stateless design — both of which were right for
     this stage of the project."
  - "Cold starts are a real cost but an acceptable one
     when the alternative is provisioning a server for
     traffic that doesn't exist yet."
  - "The constraint isn't the platform — it's that I
     need to justify a server before I have the load
     that requires one."

Example of an interview defense block done right:

  ## Interview defense

  ### What an interviewer is really asking
  When an interviewer asks about serverless functions,
  they're not asking you to explain what AWS Lambda is.
  They're asking: did you choose this deliberately, or
  did you just use it because Netlify made it easy?
  The answer they want to hear is a decision — what
  you got, what you gave up, and when you'd choose
  something different.

  ### Likely questions

  [mid] Q: What is a serverless function and how does
           it differ from a traditional server?

        A: A serverless function is a process that starts
           on request and stops when it's done. There's no
           always-on server — the platform starts the
           process, runs the function, and tears it down.
           The key difference is state: a traditional server
           can hold things in memory between requests; a
           serverless function starts fresh every time.
           In this project, each Netlify function handles
           one domain — auth, projects, sessions — and
           holds no state between calls.

        Diagram:
        Serverless function lifecycle per request

        Request → [cold? warm up: 100–400ms]
                → [run handler]
                → [return response]
                → [tear down — no state survives]

        Next request: starts over, no memory of last one.

  [senior] Q: Why did you choose Netlify Functions over
              a dedicated Node.js server?

           A: At this scale and traffic pattern, a dedicated
              server would have been idle 95% of the time.
              Netlify Functions gave me zero infrastructure
              to manage and billing aligned with actual usage.
              The tradeoff is cold starts — the first request
              after a period of inactivity takes 100–400ms
              longer. I accepted that because this is a
              single-user developer tool, not a latency-
              sensitive consumer product. If I needed
              sub-100ms consistent response times, I'd
              reconsider.

           Diagram:
           Serverless vs always-on — the cost ledger

           ┌──────────────┬──────────────┬──────────────┐
           │              │ Netlify Fn   │ Express + VM │
           ├──────────────┼──────────────┼──────────────┤
           │ Idle cost    │ $0           │ $5–40/mo     │
           │ Cold start   │ 100–400ms    │ none         │
           │ Ops burden   │ none         │ patches, TLS │
           │ Fits when    │ sporadic use │ steady traffic│
           └──────────────┴──────────────┴──────────────┘

  [arch] Q: How would this architecture change if you
            needed to support 10,000 concurrent users?

         A: Three things would break first. Cold starts
            would become a user-facing latency problem at
            scale — you'd need provisioned concurrency or
            a move to always-on compute. The Netlify Blobs
            storage layer isn't designed for concurrent
            writes at volume — the migration to Neon
            Postgres addresses this. And the single-user
            JWT auth model would need to become a proper
            multi-tenant system with per-user isolation.
            The function logic itself is mostly fine —
            stateless design scales horizontally without
            changes to the function code.

         Diagram:
         What breaks first at 10,000 concurrent users

         ┌─ UI layer ──────────────────────────────────┐
         │  React app — fine, CDN handles it           │
         └─────────────────────────────────────────────┘
         ┌─ Auth layer ────────────────────────────────┐
         │  Single-user JWT  ◀── BREAKS: needs        │
         │                       multi-tenant rewrite  │
         └─────────────────────────────────────────────┘
         ┌─ Function layer ────────────────────────────┐
         │  Netlify Functions ◀── BREAKS: cold-start   │
         │                        latency at scale     │
         └─────────────────────────────────────────────┘
         ┌─ Storage layer ─────────────────────────────┐
         │  Netlify Blobs    ◀── BREAKS: concurrent    │
         │                        writes (→ Postgres)  │
         └─────────────────────────────────────────────┘

         Stateless function logic itself: fine,
         scales horizontally.

  ### The question candidates always dodge
  Q: If Netlify Functions have cold starts and you can't
     hold state, why not just use a simple Express server?

  A: Honestly, for a production multi-user app with
     consistent traffic, I would. The cold start cost is
     real and the statelessness forces workarounds for
     anything session-like. But I'm building a single-user
     developer tool with sporadic usage — there's no
     traffic to justify an always-on server, and there's
     no team to operate one. The constraint isn't
     technical capability; it's that I'm one person and
     Netlify Functions let me ship a working backend in
     an afternoon without touching infrastructure. That's
     the right call at this scale. The migration plan to
     Postgres exists precisely because I know which
     constraints will change as the product grows.

  Diagram:
  What we picked vs the Express suggestion — full cost

  ┌──────────────────┬──────────────────┬──────────────────┐
  │ Cost dimension   │ Netlify Fn       │ Express server   │
  ├──────────────────┼──────────────────┼──────────────────┤
  │ Build time       │ 1 afternoon      │ 1–2 days         │
  │ Ops burden       │ zero             │ patches, TLS,    │
  │                  │                  │ uptime, scaling  │
  │ Idle cost/mo     │ $0               │ $5–40            │
  │ Cold-start cost  │ 100–400ms first  │ none             │
  │                  │ request          │                  │
  │ Right when       │ solo, sporadic   │ team, steady     │
  │                  │ traffic          │ traffic          │
  └──────────────────┴──────────────────┴──────────────────┘

  The Express suggestion looks free because it removes
  one visible cost (cold starts). It adds three invisible
  ones (ops, idle billing, build time) that are larger
  at this stage.

  ### One-line anchors
  - "Serverless matched my traffic pattern — sporadic
     single-user usage with no idle-time cost."
  - "Cold starts are acceptable for a dev tool; they
     wouldn't be for a consumer product."
  - "Statelessness was a constraint I designed around,
     not a limitation I ran into by accident."
  - "The tradeoff was infrastructure simplicity now
     for potential rearchitecture later — the plan for
     later already exists."

─────────────────────────────────────────────────
THE VALIDATE BLOCK — required in every file
─────────────────────────────────────────────────

The validate block sits at the end of every concept
file, after the interview defense block. Its job is
to close the gap between reading and knowing.

Most study stops at reading. The validate block forces
the reader to produce something — a drawing, an
explanation, an answer — which is the only reliable
test of whether understanding is real or just
recognition. Each level builds on the last. Do not
skip levels.

Every concept file ends with a validate block.
Structure it as:

  ## Validate your understanding

  ### Level 1 — Reconstruct the diagram
  Close this file. Open a blank document or whiteboard.
  Draw the primary diagram from memory. Label every
  box and every arrow.

  Open the file. Compare.

  ✓ Pass: your diagram matches the structure and labels
  ✗ Fail: re-read the diagram section, wait 10 minutes,
          try again. Do not move to Level 2 until you pass.

  ### Level 2 — Explain it out loud
  Explain [concept name] to an imaginary colleague who
  just asked "how does this work in your project?"
  No notes. Under 90 seconds.

  Checkpoints — did you:
  - Name the specific file or function?
    → [file reference from "In this codebase" section]
  - Say why this approach was chosen over the alternative?
  - Name the tradeoff in one sentence?

  If you skipped any: you described it, you didn't
  understand it. Describing is not the same thing.

  ### Level 3 — Apply it to a new scenario
  Answer this without looking at the file:

  [One scenario per concept — generated from the actual
   pattern. Not a textbook question. A situation that
   would arise in a real project using this codebase.
   Examples by concept type:

   Serverless:     "A user reports the first request
                    after lunch is always slower than
                    the rest. What's happening and what
                    are your three options?"

   Reorder (DSA):  "You need to reorder 50,000 items
                    instead of 50. Does the current
                    implementation in [file L##–L##]
                    hold? What breaks first?"

   Prompt chain:   "The summarise chain starts returning
                    malformed JSON intermittently. Walk
                    through how you'd debug it using only
                    what's in [file L##–L##]."

   Provider abs:   "A new LLM provider launches with
                    better pricing. What do you need to
                    touch to swap it in? What do you
                    not touch?"]

  Write your answer. 3–5 sentences minimum.
  Then open [specific file, specific lines] and check
  whether your answer matches what the code actually does.

  ### Level 4 — Defend the decision you'd change
  Pick the biggest tradeoff from the tradeoffs section.
  Answer in writing:

  "If you were starting this project today with the
   same constraints, would you make the same decision?
   Why or why not? If you'd change it, what would you
   do instead and what would that cost?"

  Reference the actual code when you answer:
  → Point to [file] to support what exists
  → Point to what would need to change if you chose
    the alternative

  There is no right answer. The point is specificity.
  Vague answers mean you don't know the code well enough
  to have an opinion about it yet.

  ### Quick check — code reference test
  Without opening any files, answer:
  - What file does this pattern live in?
  - What is the function or class name?
  - Approximately what line range?

  Then open the file and verify.

  ✓ Pass: you named the file correctly
  ✓ Pass: you named the function or class correctly
  ✗ Fail on lines: that's fine — line numbers change.
                   File and function are what matter.

  If you failed the file name: re-read the
  "In this codebase" section and return to Level 1.

Example of a validate block done right:

  ## Validate your understanding

  ### Level 1 — Reconstruct the diagram
  Close this file. Draw the serverless function request
  flow from memory — browser to storage and back.
  Label what happens at each hop.

  Open the file. Check:
  ✓ Did you include the auth middleware hop?
  ✓ Did you label the Netlify Blobs layer separately
    from the function layer?
  ✓ Did you show the response path, not just the request?

  ### Level 2 — Explain it out loud
  Explain serverless functions to a colleague who asked
  "why don't we just use a regular server?" No notes.
  Under 90 seconds.

  Checkpoints:
  - Did you mention cold starts? (the real cost)
  - Did you mention statelessness? (the real constraint)
  - Did you say what traffic pattern makes serverless
    the right call vs the wrong call?
  - Did you reference netlify/functions/ as where this
    lives in the actual project?

  ### Level 3 — Apply it to a new scenario
  "A user reports that after they haven't used the app
   for two hours, the first action feels slow — but
   only the first one. Subsequent actions are fast.
   What's happening? Look at
   `netlify/functions/projects.ts` L1–L15.
   Does anything in there explain it?"

  Write your answer. Then open the file and verify
  whether the cold start behaviour is visible in the
  function initialisation code.

  ### Level 4 — Defend the decision you'd change
  "If you were starting today and expected 100 concurrent
   users from day one, would you still use Netlify
   Functions? What would you change in
   `netlify/functions/lib/storage/` if you switched to
   an always-on server with a persistent connection pool?"

  ### Quick check — code reference test
  Without opening any files:
  - Where does the auth middleware live?
  - What file handles project CRUD?
  - What's the Netlify Blobs storage wrapper called?

  Open and verify.

─────────────────────────────────────────────────
WHAT TO EXPECT BY DISCIPLINE — reference catalog
─────────────────────────────────────────────────

This section is a reference, not a generator
requirement. It exists for two reasons. First, when
the spec is pointed at a new codebase, knowing what
discipline it falls into ("this is a frontend SPA",
"this is a backend service", "this is a full-stack
app") helps predict which patterns will show up and
therefore which concept files to expect. Second,
when the reader is choosing what to study next,
this section maps the patterns by where they live —
so a frontend engineer pivoting toward full-stack
knows which backend patterns to learn first.

Use it as a checklist when scanning a new codebase:
read the discipline subsection that matches, walk
the pattern list, and note which patterns you find.
The ones you find become concept files. The ones
you don't find are gaps — either the codebase
doesn't need them, or you're missing something
worth investigating.

Patterns are listed by frequency in real codebases,
not alphabetically. The first few in each list are
nearly universal; the bottom of each list is
context-dependent.

  ### Tech stack rule — every concept file gets a dedicated Tech reference section

  Every industry pairing in a concept file lives in
  one place: the `## Tech reference (industry
  pairing)` section, which sits between `## Tradeoffs`
  and `## Summary`. Other sections (How it works,
  Tradeoffs, Interview defense) may name what the
  codebase uses, but the leader/runner-up pairing
  is consolidated in the Tech reference section —
  one section per file, one `###` subsection per
  tech, five labelled bullets per subsection.

  Format (mandatory — see the worked example in the
  per-concept template):

    ### [tech name]
    - **Codebase uses:** the real lib/framework/
      service in the repo, with the file or import
      line where it's instantiated.
    - **Why it's here:** one sentence — the specific
      job this tech does that nothing else does.
    - **Leading today:** name + label as either
      `adoption-leading` (most-deployed in
      production today — battle-tested patterns)
      or `innovation-leading` (most mindshare /
      momentum, likely to lead in 1–2 years —
      fast-moving areas), with the year (2026).
    - **Why it leads:** one sentence on the
      specific technical reason — typed end-to-end,
      server-component-native, zero bridge cost,
      edge-runtime-compatible. Never marketing.
    - **Runner-up:** required when the codebase
      already uses the leader (so the alternative
      landscape stays visible); optional otherwise.

  Never use markdown tables with pipes for tech
  entries. They break in narrow renderings and
  render as garbage on mobile. Use the `###` +
  labelled bullets format.

  Pick `adoption-leading` for battle-tested
  patterns (auth, request flow, DB access — what a
  senior engineer at a Series B startup defaults
  to). Pick `innovation-leading` for fast-moving
  areas (AI tooling, edge compute, type safety —
  what a senior engineer at a frontier-tech
  company is reaching for).

  Never claim a single tech "won". Where real
  disagreement exists (App Router vs Pages Router,
  Prisma vs Drizzle, Server Actions vs tRPC), name
  it in one of the fields rather than smoothing it
  over.

  The discipline section's stack lists below are
  the same idea applied at the catalog level — "in
  the wild" vs "leading today" — and are the source
  the agent draws from when picking leaders and
  runners-up for each tech in the Tech reference
  section.

─────────────────────────────────────────────────
FRONTEND
─────────────────────────────────────────────────

The shape of a frontend codebase. Boundaries to
look for, layers to expect, patterns to study.

  ┌──────────────────────────────────────────────────────┐
  │ Typical frontend architecture                        │
  └──────────────────────────────────────────────────────┘

  ┌─ Browser ───────────────────────────────────────────┐
  │                                                     │
  │  ┌─ Routing layer ─────────────────────────────┐   │
  │  │  URL → page component                       │   │
  │  │  (React Router, Next.js routing, Vue Router)│   │
  │  └─────────────────────────────────────────────┘   │
  │                       │                             │
  │                       ▼                             │
  │  ┌─ Component tree ────────────────────────────┐   │
  │  │  Layout → Page → Feature → Primitive        │   │
  │  │  (composition, render props, slots)         │   │
  │  └─────────────────────────────────────────────┘   │
  │                       │                             │
  │       ┌───────────────┼───────────────┐             │
  │       ▼               ▼               ▼             │
  │  ┌─────────┐    ┌─────────┐    ┌─────────────┐    │
  │  │ Local   │    │ Form    │    │ Server      │    │
  │  │ state   │    │ state   │    │ state cache │    │
  │  │ (hooks) │    │ (RHF,   │    │ (RQ, SWR)   │    │
  │  │         │    │ Formik) │    │             │    │
  │  └─────────┘    └─────────┘    └──────┬──────┘    │
  │                                       │            │
  └───────────────────────────────────────│────────────┘
                                          │ HTTP/WS
                                          ▼
                                    [API boundary]

Patterns to look for, in order of how often you see them:

  → Component composition
    How components combine — children, slots, render
    props, compound components. The big architectural
    decision a frontend codebase makes early.

  → Client routing
    How URL changes map to view changes. SPA-style
    (history API) vs file-based (Next.js, Remix).
    Look for nested routes, dynamic params, route
    guards.

  → State ownership split
    The most important pattern in any modern frontend:
    server state (data from APIs, cached locally)
    vs client state (UI state, form state, ephemeral)
    vs URL state (filters, pagination, modals you can
    share a link to). React Query and SWR are the
    explicit acknowledgment that these are different.

  → Forms and validation
    How fields, errors, submission, and server-side
    validation responses are wired together. React
    Hook Form, Formik, native forms, Zod schemas.

  → Optimistic UI
    UI updates immediately, then reconciles with the
    server. The pattern that makes apps feel instant.
    Look for `mutate` calls that update cache before
    the network responds.

  → Code splitting and lazy loading
    Routes loaded on demand, heavy components deferred.
    Look for `lazy()` or dynamic imports.

  → Rendering strategy
    SSR vs SSG vs ISR vs CSR — which pages render
    when, and why. Next.js makes this an explicit
    per-route decision.

  → Error boundaries
    What happens when a component throws. Look for
    `ErrorBoundary` wrappers, fallback UI, error
    reporting hooks.

  → Asset and bundle optimization
    Image components, font loading strategy, bundle
    analysis. Often the cheapest performance wins.

  → Accessibility patterns
    Focus management, ARIA labels, keyboard
    navigation, screen reader text. Look for
    `useFocusTrap`, headless UI libraries, semantic
    HTML.

Stacks in the wild vs leading today (2026):

  ┌─ Common in real codebases ──────────────────────────┐
  │                                                     │
  │  Next.js (Pages Router) + Tailwind                  │
  │    The dominant React stack of 2020–2023. Most      │
  │    production apps Rein will see at jobs.           │
  │                                                     │
  │  Create React App + React Router + Redux            │
  │    Older SPAs still in production. Active           │
  │    migration target — CRA was deprecated in 2023.   │
  │                                                     │
  │  Vue 2 / Vue 3 Options API + Vuex                   │
  │    Common in non-US enterprise and Asia-Pac. Where  │
  │    "we have a Vue 2 monolith" interviews come from. │
  │                                                     │
  │  React Native (bare) + Redux                        │
  │    Mobile apps built before Expo went universal.    │
  │                                                     │
  └─────────────────────────────────────────────────────┘

  ┌─ Leading today (innovation-leading, 2026) ──────────┐
  │                                                     │
  │  Next.js (App Router) + Tailwind + shadcn/ui        │
  │    Why it leads: server components ship less JS to  │
  │    the client; the App Router co-locates data       │
  │    fetching with routes; shadcn/ui is a copy-paste  │
  │    component library (not a dependency), so teams   │
  │    own their UI code.                               │
  │                                                     │
  │  React Native + Expo (managed)                      │
  │    Why it leads: Expo Router brings file-based      │
  │    routing to mobile; EAS handles builds and OTA    │
  │    updates without touching Xcode/Android Studio.   │
  │    The loopd stack — and now the default for new    │
  │    React Native apps.                               │
  │                                                     │
  │  Vue 3 Composition API + Pinia                      │
  │    Why it leads: Composition API matches React      │
  │    hooks ergonomically; Pinia replaced Vuex as the  │
  │    official state library with full TS support.     │
  │                                                     │
  │  Astro 5 + React/Svelte islands                     │
  │    Why it leads: zero-JS by default for static      │
  │    content, interactive islands where needed. The   │
  │    content-site winner.                             │
  │                                                     │
  └─────────────────────────────────────────────────────┘

  Real disagreement worth naming:
    → App Router vs Pages Router — App Router leads
      for new projects, but Pages Router is still
      what most production codebases run on.
    → shadcn/ui vs Material UI / Chakra — shadcn/ui
      leads new starts; the others have larger
      existing codebases and component coverage.

─────────────────────────────────────────────────
BACKEND
─────────────────────────────────────────────────

The shape of a backend codebase. Where requests
land, how they traverse the system, where state
lives.

  ┌──────────────────────────────────────────────────────┐
  │ Typical backend architecture                         │
  └──────────────────────────────────────────────────────┘

  Incoming request
         │
         ▼
  ┌─ Edge / Gateway ────────────────────────────────────┐
  │  TLS, rate limiting, WAF                            │
  └──────────────────────────┬──────────────────────────┘
                             │
                             ▼
  ┌─ Routing layer ─────────────────────────────────────┐
  │  URL + method → handler                             │
  └──────────────────────────┬──────────────────────────┘
                             │
                             ▼
  ┌─ Middleware ────────────────────────────────────────┐
  │  Auth → logging → validation → tracing              │
  └──────────────────────────┬──────────────────────────┘
                             │
                             ▼
  ┌─ Controller / Handler ──────────────────────────────┐
  │  Parses input, calls service, formats output        │
  └──────────────────────────┬──────────────────────────┘
                             │
                             ▼
  ┌─ Service layer ─────────────────────────────────────┐
  │  Business logic, transactions, cross-cutting calls  │
  └──────────────────────────┬──────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
  ┌─────────────────┐ ┌─────────────┐ ┌──────────────┐
  │ Repository / DB │ │ Cache layer │ │ Queue / jobs │
  │ (ORM, query)    │ │ (Redis)     │ │ (BullMQ etc) │
  └────────┬────────┘ └─────────────┘ └──────────────┘
           │
           ▼
        Database

Patterns to look for, in order of how often you see them:

  → Request/response flow with layered handlers
    Controller → service → repository (or handler →
    use-case → store). The shape almost every backend
    converges on. The discipline is keeping each
    layer's job clear: parse, decide, persist.

  → Authentication and authorization
    Who you are (auth) and what you can do (authz).
    JWT, session cookies, OAuth, API keys. Authz
    is the harder pattern — look for role/permission
    checks at the service layer, not the handler.

  → Database access
    ORM (Prisma, TypeORM, Drizzle, SQLAlchemy) vs
    query builder (Kysely) vs raw SQL. Each is a
    real tradeoff between safety, control, and
    performance.

  → Caching
    HTTP cache, in-process LRU, Redis. The question
    is always invalidation, not storage. Look for
    cache-aside, write-through, or stale-while-
    revalidate patterns.

  → Background jobs and queues
    What happens when a request can't finish in
    200ms. BullMQ, Sidekiq, Celery, SQS. Look for
    enqueue/worker split, retry policies, dead-letter
    queues.

  → Rate limiting
    Per-IP, per-user, per-key. Token bucket, leaky
    bucket, sliding window. Almost always at the
    edge or middleware layer.

  → Logging and observability
    Structured logs, request IDs, distributed tracing,
    metrics. The patterns that make production
    debuggable. Look for OpenTelemetry, structured
    JSON logs, request-scoped context.

  → API design
    REST (resources + verbs), GraphQL (one endpoint,
    typed schema), gRPC/tRPC (typed RPC). The
    decision shapes everything downstream.

  → Database migrations
    Versioned, ordered, irreversible-by-design.
    Prisma Migrate, Alembic, Flyway. Look for the
    migration directory before you look at the
    schema.

  → Connection pooling
    Pre-opened DB connections, lent per-request.
    Often invisible until it breaks at scale. Look
    for pool config in the DB client setup.

  → Error handling and retries
    Where errors bubble, what gets retried, what gets
    surfaced. Look for typed errors, retry-with-
    backoff, idempotency keys.

Stacks in the wild vs leading today (2026):

  ┌─ Common in real codebases ──────────────────────────┐
  │                                                     │
  │  Node.js + Express + Postgres + Sequelize/TypeORM   │
  │    The default JS backend stack of 2015–2022.       │
  │    Most production Node services Rein will see.     │
  │                                                     │
  │  Python + Django + Postgres                         │
  │    The most-deployed Python web stack. Common at    │
  │    larger companies and government.                 │
  │                                                     │
  │  Ruby on Rails + Postgres                           │
  │    Still the default at many YC-pedigree companies. │
  │    Convention-over-configuration backbone.          │
  │                                                     │
  │  Java + Spring Boot + Postgres                      │
  │    Enterprise default. What "we use Java" job       │
  │    listings actually mean.                          │
  │                                                     │
  │  PHP + Laravel + MySQL                              │
  │    The dominant non-JS web stack worldwide. More    │
  │    of the public web than people in JS circles      │
  │    realise.                                         │
  │                                                     │
  │  Serverless: Netlify Functions / AWS Lambda         │
  │    Function-per-endpoint, stateless. The "no        │
  │    infrastructure" stack — what buffr uses.         │
  │                                                     │
  └─────────────────────────────────────────────────────┘

  ┌─ Leading today (adoption-leading, 2026) ────────────┐
  │                                                     │
  │  Node.js + Hono + Postgres + Drizzle                │
  │    Why it leads: Hono is web-standard (uses Fetch   │
  │    API) and runs on Node, Bun, Deno, Cloudflare     │
  │    Workers, and edge runtimes unchanged. Drizzle    │
  │    is a type-safe query builder — closer to SQL     │
  │    than an ORM, with no schema-walking overhead.    │
  │                                                     │
  │  Python + FastAPI + Postgres + SQLAlchemy 2.0       │
  │    Why it leads: typed async Python with first-     │
  │    class OpenAPI generation; the default for AI-    │
  │    adjacent backends because the Python LLM         │
  │    ecosystem is years ahead of JS.                  │
  │                                                     │
  │  Go + chi or Echo + Postgres + sqlc                 │
  │    Why it leads: compile-time type-safe SQL via     │
  │    code generation; single static binary; minimal   │
  │    runtime. The choice when latency and binary      │
  │    size matter.                                     │
  │                                                     │
  │  Elixir + Phoenix + Postgres                        │
  │    Why it leads in its niche: BEAM concurrency      │
  │    handles long-lived connections and real-time     │
  │    at scale that other stacks struggle with.        │
  │    LiveView is a real alternative to SPAs.          │
  │                                                     │
  └─────────────────────────────────────────────────────┘

  Real disagreement worth naming:
    → ORM vs query builder vs raw SQL — Drizzle/sqlc
      have momentum; Prisma still dominates new JS
      projects; SQLAlchemy 2.0 is the Python winner.
    → Express vs the alternatives — Express is still
      where production lives, but every new Node
      framework (Hono, Fastify, Elysia) outperforms
      it on benchmarks; the migration cost is the
      reason Express isn't dead yet.

─────────────────────────────────────────────────
FULL-STACK
─────────────────────────────────────────────────

The shape of a full-stack codebase. Where the
client and server meet, and the patterns that
live at the boundary.

  ┌──────────────────────────────────────────────────────┐
  │ Typical full-stack architecture                      │
  └──────────────────────────────────────────────────────┘

  ┌─ Client ────────────────────────────────────────────┐
  │  Component tree                                     │
  │      │                                              │
  │      ├── Server state cache (React Query / SWR)    │
  │      │       │                                      │
  │      │       ▼                                      │
  │      └── Mutations (optimistic → reconcile)        │
  └───────────────────────│─────────────────────────────┘
                          │
                          │  typed contract
                          │  (tRPC, GraphQL, OpenAPI,
                          │   Next server actions)
                          │
  ┌───────────────────────│─────────────────────────────┐
  │  API boundary                                       │
  │     │                                               │
  │     ├── Validation (Zod, schema)                    │
  │     ├── Auth check                                  │
  │     └── Handler / resolver / action                 │
  │            │                                        │
  └────────────│────────────────────────────────────────┘
               │
               ▼
  ┌─ Server (same repo, same deploy) ───────────────────┐
  │  Service layer → DB / external APIs                 │
  └─────────────────────────────────────────────────────┘

  The full-stack pattern is: one codebase, one
  deployment, typed contract at the boundary, shared
  schema validation, shared types.

Patterns to look for. Some are frontend or backend
patterns; what makes them full-stack is that they
span the boundary.

  → End-to-end type safety
    The flagship full-stack pattern. tRPC, GraphQL
    codegen, OpenAPI generators, Next.js server
    actions. Types defined once, used on both
    sides. The bug-prevention story.

  → Shared validation schemas
    Zod, Yup, or JSON Schema definitions used at
    both the form (client) and the handler (server).
    The pattern that makes "validate on both sides"
    not a duplicated-code problem.

  → Server-side rendering with data fetching
    Loaders (Remix), getServerSideProps (Next Pages),
    server components (Next App Router). The data
    fetches on the server before the page renders;
    client hydrates with the data already in place.

  → Forms with server validation
    Form submits to the server, server validates,
    returns either success or typed errors, client
    renders the errors next to the right fields.
    React Hook Form + Zod + a server action is the
    current default shape.

  → Optimistic UI with server reconciliation
    Client updates the cache instantly, sends the
    mutation, reconciles with the server response.
    React Query's `onMutate` / `onError` / `onSuccess`
    is the canonical pattern. The thing that makes
    apps feel native.

  → Auth that spans client and server
    Server stores the session, client reads it via
    cookie. Auth checks run on the server for
    security, and the client gets a typed user
    object for UI. NextAuth/Auth.js, Clerk, Lucia.

  → Real-time sync
    WebSockets, Server-Sent Events, or polling
    when sync matters. Look for subscription
    patterns, reconnection logic, message ordering.

  → Edge vs origin compute
    What runs at the CDN edge (low-latency, limited
    runtime) vs at the origin (full runtime, slower
    cold start). Next.js middleware and edge runtime
    make this a per-route decision.

  → File uploads
    Client → presigned URL → object storage → server
    confirmation. Look for the three-hop pattern
    rather than streaming files through the API.

  → Background jobs triggered from the API
    User action triggers a job; client polls or
    subscribes for completion. The pattern for
    anything that takes longer than a request.

Stacks in the wild vs leading today (2026):

  ┌─ Common in real codebases ──────────────────────────┐
  │                                                     │
  │  Next.js (Pages Router) + Prisma + Postgres         │
  │    The default full-stack JS stack of 2021–2024.    │
  │    `getServerSideProps`, API routes, Prisma.        │
  │                                                     │
  │  Rails + Hotwire / Turbo                            │
  │    Server-rendered full-stack. Still the default    │
  │    at many product companies (Shopify, Basecamp,    │
  │    GitHub origins).                                 │
  │                                                     │
  │  Django + HTMX                                      │
  │    The Python answer to Hotwire. Growing in adoption│
  │    among teams reacting to SPA fatigue.             │
  │                                                     │
  │  Next.js + Notion API                               │
  │    No DB layer in the codebase — Notion is the      │
  │    database. The PLRI+ stack pattern; the buffr     │
  │    architecture.                                    │
  │                                                     │
  │  MERN (Mongo + Express + React + Node)              │
  │    The bootcamp default of the late 2010s. Still    │
  │    in production at smaller startups.               │
  │                                                     │
  └─────────────────────────────────────────────────────┘

  ┌─ Leading today (innovation-leading, 2026) ──────────┐
  │                                                     │
  │  Next.js (App Router) + Drizzle + Postgres +        │
  │    Server Actions                                   │
  │    Why it leads: server components send less JS;    │
  │    server actions remove the "design an API"        │
  │    step (form posts to a typed server function);    │
  │    Drizzle gives type-safe queries without an ORM.  │
  │    The current default starter for new full-stack   │
  │    React projects.                                  │
  │                                                     │
  │  Remix + Drizzle + Postgres                         │
  │    Why it leads: web-standards-first (forms, URLs,  │
  │    HTTP), no API layer to design (loaders/actions   │
  │    are the API), works on any JS runtime. The       │
  │    "use the platform" stack.                        │
  │                                                     │
  │  T3: Next.js + tRPC + Drizzle + Auth.js + Tailwind  │
  │    Why it leads: tRPC gives end-to-end TypeScript   │
  │    inference across the network boundary — change   │
  │    the server, the client errors at compile time.   │
  │    The strongly-opinionated "no API to design"      │
  │    approach.                                        │
  │                                                     │
  │  SvelteKit + Drizzle + Postgres                     │
  │    Why it leads: smallest bundle sizes of any       │
  │    major framework; the Svelte 5 reactivity model   │
  │    is genuinely new (signals + compile-time         │
  │    transforms). Same shape as Remix/Next loaders.   │
  │                                                     │
  │  Next.js + Vercel AI SDK + Anthropic/OpenAI         │
  │    Why it leads: streaming LLM responses with       │
  │    typed message structures; useChat hook handles   │
  │    state. The default for full-stack apps with AI   │
  │    features. What loopd or contrl's AI features     │
  │    would be built on.                               │
  │                                                     │
  └─────────────────────────────────────────────────────┘

  Real disagreement worth naming:
    → Server Actions vs tRPC vs REST — Server Actions
      lead for Next-only projects; tRPC leads for
      teams that want explicit typed RPC; REST still
      wins when the API must serve non-JS clients.
    → Prisma vs Drizzle — Prisma has more adoption
      and tooling; Drizzle has momentum, smaller
      bundle, no schema-walking overhead. Real teams
      pick on team familiarity, not pure technical
      merit.
    → ORM vs no-DB-in-codebase — most full-stack
      apps use Postgres + an ORM. Notion-as-DB
      (your PLRI+ pattern) is a smaller but real
      camp; airtable-as-backend is the no-code
      adjacent version.

─────────────────────────────────────────────────
CROSS-REFERENCE — what you see vs what it is
─────────────────────────────────────────────────

When scanning a new codebase, use this table to map
visible signals to underlying patterns. The signal
is what you spot first; the pattern is what it
indicates.

  ┌──────────────────────┬──────────────────────────────┐
  │ If you see           │ You're looking at            │
  ├──────────────────────┼──────────────────────────────┤
  │ useQuery / useSWR    │ Server state cache pattern   │
  │ useMutation +        │ Optimistic UI                │
  │   onMutate           │                              │
  │ <Suspense>           │ Async boundaries, code split │
  │ middleware.ts        │ Edge logic / route guards    │
  │ /api/ or /app/api/   │ Backend routes inside        │
  │                      │   a frontend framework       │
  │ server actions       │ Server-side mutations called │
  │   ("use server")     │   from client components     │
  │ schema.prisma        │ Type-safe ORM, migrations    │
  │ drizzle.config.ts    │ Type-safe query builder      │
  │ trpc/router.ts       │ End-to-end typed RPC         │
  │ zod schemas in       │ Shared client+server         │
  │   shared/            │   validation                 │
  │ workers/ or          │ Background jobs              │
  │   queues/            │                              │
  │ redis client setup   │ Caching or queues or both    │
  │ websocket / ws       │ Real-time sync               │
  │ presigned URL code   │ Three-hop file upload        │
  │ /providers/ folder   │ Provider abstraction         │
  │   with > 1 impl      │   (LLMs, storage, etc.)      │
  │ migrations/ folder   │ Schema versioning            │
  │ middleware chains    │ Request-pipeline pattern     │
  │ context provider     │ React-tree-wide state        │
  │   at root            │                              │
  │ loaders / actions    │ Remix or Next data pattern   │
  │ getServerSideProps   │ SSR with per-request data    │
  └──────────────────────┴──────────────────────────────┘

If the codebase has a signal not in this table, that
is a concept file worth writing — the unknown pattern
is the one most worth studying.

─────────────────────────────────────────────────
CODE REFERENCE RULES — apply throughout
─────────────────────────────────────────────────

Every concept file must include real file and line
references wherever the pattern or operation lives
in the codebase. These references serve two purposes:
the reader can jump directly to the code, and the
validate block can send the reader back to verify
their answers against the real implementation.

Reference format:
  `path/to/file.ts` L[start]–L[end]

GitHub link format (use when codebase is on GitHub):
  [function name](https://github.com/[owner]/[repo]/blob/main/path/to/file.ts#L42-L67)

Rules:
  → Every "In this codebase" section must include at
    least one file path with line range
  → Every Level 3 scenario in the validate block must
    reference the specific file and lines the reader
    should check their answer against
  → Every Level 4 question must point to the file
    that would need to change if the alternative
    was chosen
  → If a pattern spans multiple files, list all of them
    with the role each file plays
  → Line ranges must be accurate at time of generation
    — if lines shift during future updates, the
    "Updated" changelog entry must note it

What to reference:
  System design patterns → the function file, the
    storage wrapper, the middleware — each separately
  DSA operations → the exact function that performs
    the operation, including line range
  AI patterns → the chain file, the provider factory,
    the prompt file — each separately

─────────────────────────────────────────────────
DIAGRAM RULES — apply to every diagram
─────────────────────────────────────────────────

Use box-drawing characters for all diagrams:
─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼

Every diagram must:
  → Have a title line above it
  → Be inside a fenced code block
  → Label every box and every arrow
  → Label every architectural layer it spans —
     UI layer, Service layer, Storage layer, Network
     boundary, Provider layer, etc. A diagram that
     crosses a boundary without naming the boundary
     hides the most important thing it could show.
     Use a left-margin label, a horizontal divider with
     the layer name, or grouped boxes inside a labelled
     band — whichever fits the diagram's shape.
  → Show direction of data flow explicitly
  → Be readable without the surrounding prose
    (the diagram is the explanation, not an illustration)

Layer labeling — worked example:

  Request flow with layers

  ┌─ UI layer ──────────────────────────────────┐
  │  Browser   →   React component              │
  └─────────────────────────────────────────────┘
              │
              ▼  HTTP POST /api/sessions
  ┌─ Service layer ─────────────────────────────┐
  │  Netlify function   →   Auth middleware     │
  │                     →   Handler             │
  └─────────────────────────────────────────────┘
              │
              ▼  storage.set(key, value)
  ┌─ Storage layer ─────────────────────────────┐
  │  Netlify Blobs                              │
  └─────────────────────────────────────────────┘

  The bands make the boundaries reviewable. Without
  them, the reader sees boxes and arrows; with them,
  they see where the network sits, where auth sits,
  where the data finally lands.

Types of diagrams to use per situation:

  Flow diagram      for sequences — request flows, auth
                    chains, data pipelines
  Tree diagram      for hierarchies — component trees,
                    inheritance, nested structures
  State diagram     for transitions — UI states, auth
                    states, job statuses
  Comparison table  for tradeoffs — two approaches side
                    by side with the deciding constraint
  Execution trace   for algorithms — variable state at
                    every single step, not just before/after
  Entity diagram    for data models — tables, fields,
                    relationships, cardinality
  Layer diagram     for architecture — each layer as a
                    row, arrows showing what crosses layers
  Pattern diagram   for the shape of a pattern or algorithm
                    — the loop, the traversal frontier, the
                    topology, the kernel skeleton; the
                    mental-model picture the reader recalls
                    six weeks later (How it works Move 1)

─────────────────────────────────────────────────
PSEUDOCODE RULES
─────────────────────────────────────────────────

Use pseudocode when:
  → Showing algorithm logic without TypeScript noise
  → Explaining a pattern before showing real implementation
  → The concept is language-agnostic

Pseudocode style:
  → Plain English for control flow: "for each", "if", "return"
  → Concrete variable names, not x and y
  → One operation per line
  → Annotate with // comments on any non-obvious line
  → Show the input and output explicitly

Example of acceptable pseudocode:
  input: items[] each with {id, position}
         newOrder[] of ids in desired order

  build map: id → item           // O(n) — one pass
  for each id in newOrder:
    item = map[id]               // O(1) lookup
    item.position = current_index
  return items sorted by position // O(n log n)

─────────────────────────────────────────────────
SECTION 00 — SYSTEM OVERVIEW
─────────────────────────────────────────────────

One page. The entire system in one diagram.
A reader who has never seen this codebase should be
able to orient themselves in under 60 seconds.

Required:
  → Full system map: every major layer and every
    connection between them, in one diagram
  → Layer labels: what each layer is responsible for
  → Data flow direction: arrows showing what moves where
  → Technology labels: what runs in each box

Then a bullet-point legend — one line per component:
  What it is, what it does, what it talks to.

No prose paragraphs in this section. Map + legend only.

─────────────────────────────────────────────────
SECTION 01 — SYSTEM DESIGN
─────────────────────────────────────────────────

System design is not "what tech stack did you pick."
It is how data, state, and rendering move through
the system — and the tradeoff at every boundary.

The stack question is shopping list. System design
is the layer underneath: where things live, when
they run, what happens when they fail.

  ### The mental checklist

  Use this lens to walk any system — your own
  codebase, an interview prompt, a new repo you've
  just opened. Walk it in order. Each step constrains
  the next.

  ┌──────────────────────────────────────────────────────┐
  │  1. Data model                                       │
  │     What entities exist. What fields. What           │
  │     relationships. What's the source of truth.       │
  │                                                      │
  │  2. Request / response flow                          │
  │     Client → edge → origin → DB and back.            │
  │     Where auth sits. Where rate limiting sits.       │
  │     What's parallel, what's a waterfall.             │
  │                                                      │
  │  3. Caching layers                                   │
  │     HTTP cache · CDN · service worker · client       │
  │     memory cache · local DB. How each invalidates.   │
  │                                                      │
  │  4. State ownership                                  │
  │     Server state · URL state · client state ·        │
  │     form state. Which lives where, and why.          │
  │                                                      │
  │  5. Failure handling                                 │
  │     Slow network · offline · partial failure ·       │
  │     race conditions on concurrent edits.             │
  │                                                      │
  │  6. Scale concerns                                   │
  │     What breaks first at 10x. At 100x. What stays    │
  │     the same. What needs to be rearchitected.        │
  └──────────────────────────────────────────────────────┘

  Two signals that you are doing system design and
  not stack-trivia:

  → The answer changes depending on constraints.
    Number of users. Latency budget. Freshness
    requirements. Offline support. Cost.

  → There is no single right answer.
    There are tradeoffs you defend.

  Stack decision example:    "Expo over bare RN."
  System design example:     "Local SQLite is the
                              source of truth; cloud
                              is an opt-in mirror."

  The patterns covered below are instances of this
  lens. Request flow is step 2. Storage layer is
  step 1 and step 3. Auth boundary is step 2 and
  step 4. Serverless is step 5 and step 6. As you
  document each pattern, ask which step of the
  checklist it lives in — and note it in the
  concept file.

  ### Concept block structure

Cover every significant architectural pattern in the
codebase. For each concept, use this block structure:

  ### [Concept name]

  What it is: one sentence.
  Why it's used here: one sentence naming the constraint
                      it solves.
  Checklist step: which of the six steps this lives in.
  Tradeoff: one sentence — what this gives up.

  [Diagram — comes after the four lines above, as the
   recap visual. Labels every layer the system has
   (UI, Service, Storage, etc.).]

  [Optional pseudocode if the concept has a sequence]

  [Optional comparison table if there's an alternative
   worth contrasting]

Concepts to cover — identify all that apply to this
codebase and add any others present:

  ### Request flow
  Full path from browser to storage and back.
  Show every hop. Label what happens at each hop.
  Show the auth check as part of the flow, not separate.

  Request flow diagram:
  Browser → [what] → [what] → [what] → Storage
                                         ↓
  Browser ← [what] ← [what] ← [what] ←──┘

  ### Authentication boundary
  Where the auth check lives. What happens on success.
  What happens on failure. Show both paths.

  ### Serverless functions
  What "serverless" actually means in practice — not the
  marketing definition, the operational one.

  Show:
    → What a function is (a process that starts and stops)
    → Cold start: what it is, when it happens, what it costs
    → Statelessness: what you can't do, what you do instead
    → Connection pooling: why it's different from a server

  Serverless vs server comparison:
  ┌────────────────┬──────────────────┬──────────────────┐
  │                │ Serverless       │ Always-on server  │
  ├────────────────┼──────────────────┼──────────────────┤
  │ Startup cost   │ cold start ~200ms│ already running  │
  │ Memory         │ per invocation   │ persistent       │
  │ DB connections │ pool per request │ pool per server  │
  │ State          │ none between req │ can be in memory │
  │ Cost model     │ per invocation   │ per hour         │
  └────────────────┴──────────────────┴──────────────────┘

  ### Storage layer
  What storage is used. What it gives. What it costs.
  Show the data flow into and out of storage.
  Show what a "blob" or "row" actually looks like.

  ### API design
  How the API is structured. What the endpoints are.
  Show the request/response shape for the most important
  endpoint. Show the error shape too — not just success.

  ### Provider abstraction
  If the codebase has a provider switching pattern (e.g.
  multiple LLM providers, multiple storage backends),
  show the abstraction layer visually.

  Interface layer diagram:
  Consumer
    │
    ▼
  ┌─────────────────────────┐
  │ Provider interface       │
  └─────────────────────────┘
    │           │           │
    ▼           ▼           ▼
  Provider A  Provider B  Provider C

  What changes when you swap providers.
  What doesn't change. Why that boundary matters.

─────────────────────────────────────────────────
SECTION 02 — DATA STRUCTURES AND ALGORITHMS
─────────────────────────────────────────────────

Ground every concept in a real operation from the
codebase. Do not use abstract examples — use the actual
data the app operates on.

For every algorithm or data structure, use this block:

  ### [Operation name] — [data structure used]

  Real operation: [exact operation in the app]
  File it lives in: [filename]

  The data:
  [show the actual data structure — not generic,
   the real shape from this codebase]

  The problem:
  [what we're trying to do with it, in plain English]

  ── Brute force ──────────────────────────────────

  Pseudocode:
  [pseudocode — plain English, one operation per line]

  Execution trace:
  [step-by-step — show every variable at every step]

  Complexity: O(?) time · O(?) space

  What goes wrong at scale:
  [concrete: "with 10,000 items, this runs 100M operations"]

  ── Optimal ──────────────────────────────────────

  The insight: [one sentence — what the brute force
               misses that the optimal solution sees]

  Pseudocode:
  [pseudocode for optimal]

  Execution trace:
  [step-by-step for optimal — same level of detail
   as brute force trace, so the difference is visible]

  Complexity: O(?) time · O(?) space

  Why it's faster:
  [connect the insight to the complexity improvement]

  ── Comparison ───────────────────────────────────

  ┌─────────────────┬────────────────┬──────────────────┐
  │                 │ Brute force    │ Optimal          │
  ├─────────────────┼────────────────┼──────────────────┤
  │ Time            │ O(n²)         │ O(n)             │
  │ Space           │ O(1)          │ O(n)             │
  │ At 1,000 items  │ 1M ops        │ 1,000 ops        │
  │ At 10,000 items │ 100M ops      │ 10,000 ops       │
  │ Readable?       │ yes           │ slightly less    │
  └─────────────────┴────────────────┴──────────────────┘

  When brute force is fine:
  [honest answer — sometimes it is]

Operations to cover — find all that exist in the
codebase and cover each with the block above:

  → Reordering items (drag and drop, position updates)
  → Deduplication (activity feeds, commit lists)
  → Flattening nested structures (trees, specs dirs)
  → Sorting (by date, by field, by multiple keys)
  → Lookups (find by id, find by property)
  → Filtering (by status, by category, by date range)
  → Grouping (by project, by type, by date)
  → Diffing (what changed between two states)

Then end with the complexity cheat sheet:

  ### Complexity cheat sheet

  Every major data operation in this app:

  ┌─────────────────────────────┬────────┬────────┬────────────┐
  │ Operation                   │ Time   │ Space  │ At 10x?    │
  ├─────────────────────────────┼────────┼────────┼────────────┤
  │ List all projects           │ O(n)   │ O(n)   │ ✓ fine     │
  │ Get project by id           │ O(1)   │ O(1)   │ ✓ fine     │
  │ Reorder actions (current)   │ O(n²)  │ O(1)   │ ✗ fix this │
  │ Reorder actions (optimal)   │ O(n)   │ O(n)   │ ✓ fine     │
  │ ...                         │ ...    │ ...    │ ...        │
  └─────────────────────────────┴────────┴────────┴────────────┘

  For every ✗: one-line fix and estimated effort.

─────────────────────────────────────────────────
AI ENGINEERING AND MACHINE LEARNING
  See: study-ai-engineering.md
─────────────────────────────────────────────────

AI engineering and machine learning have their own
spec.

The content that previously lived here as SECTION 03
(AI Engineering) and SECTION 04 (Machine Learning) —
including the three-project anchor framing (loopd /
aipe / contrl-mo as three shapes of AI work), every
LLM foundation concept, retrieval and RAG, agents
and tool use, evals and observability, production
serving, classical ML, recommender systems,
on-device inference, ML observability, and both
sets of System Design Templates — has all moved to
a dedicated spec at the root of this project:
`study-ai-engineering.md`.

The new spec uses the same persona (the staff
engineer from `study-system-design-dsa.md`) and inherits the same
per-concept-file template, formatting rules,
diagram requirements, and hard rules. What it
defines is what's unique to the AI engineering and
ML topic: the concept list, the three-project
anchor framing, the AI/ML-specific constraints,
and a fixed output folder.

Structurally, AI engineering and ML are now a
*separate workflow* from the per-codebase study
guide generator. Running the per-codebase generator
(driven by `study-system-design-dsa.md` against a target codebase)
produces only system overview, system design, and
DSA content — no AI or ML files. AI and ML content
lives exclusively in `.aipe/study-ai-engineering/`,
produced by a separate run.

Run the AI engineering generator by giving the
agent three files: `study-system-design-dsa.md` (for structure),
`study-ai-engineering.md` (for topic, anchors, and
AI/ML-specific constraints), and `aieng-curriculum.md`
(for curriculum concept IDs), along with the
relevant codebases (typically loopd, aipe, and
contrl-mo).

Output folder: `.aipe/study-ai-engineering/`

─────────────────────────────────────────────────
FORMATTING RULES — apply throughout
─────────────────────────────────────────────────

→ Use ### for every concept — even small ones
   If a reader might want to jump to it, it needs a header.

→ Bullet points for:
   - lists of 3 or more items
   - tradeoffs and comparisons
   - "what it is / what it isn't" blocks
   - quick reference facts

→ Prose for:
   - connecting two ideas
   - explaining why something matters
   - the "so what" after a diagram

→ Comparison tables for:
   - any time two approaches are contrasted
   - any tradeoff with multiple dimensions
   - complexity comparisons

→ Bold for:
   - the term being defined (first use only)
   - the most important line in a tradeoff

→ Code blocks for:
   - all diagrams
   - all pseudocode
   - all execution traces
   - actual code only when the exact syntax matters

→ Never:
   - a wall of prose without a diagram or bullet
   - a concept introduced without a visual
   - jargon used before it's shown
   - an algorithm explained without a trace
   - **a physical-world analogy where a software
     example would work**. The reader is a working
     frontend engineer with 5–8 years of experience;
     they have richer pattern recognition from software
     they use daily than from coat checks, libraries,
     locked doors, or post offices. See the next rule.

→ Use real software, not analogies.
   When the writer needs a concrete anchor for an
   abstract concept, reach for something the reader
   has actually used or built — not a physical-world
   metaphor. Banned anchor types: coat checks,
   librarians, locked doors, bouncers, matchmakers,
   post offices, notebooks, kitchens, factories.
   Preferred anchor types, in priority order — reach
   for the most universal one that works:

   1. **Frontend primitives the reader builds with
      every day.** This is the default — the most
      universal anchor, because every frontend
      engineer has used these regardless of which
      products or stack they work in. A todo list
      rendering on screen. A database table with
      rows and columns. A `.map()` with a `key`
      prop. A form input and its controlled value.
      A `fetch()` and its loading / error / success
      states. A list re-rendering after `setState`.
      A primary key. A `WHERE` clause.
   2. **Patterns the reader has built in their own
      apps.** "You already do this when you check
      the logged-in user in the route handler AND
      filter by `user_id` in the query — that's two
      gates." "You already do this when you set
      `key` on a list item."
   3. **DevTools and engineering surfaces the reader
      touches.** The network tab. The "missing key
      prop" console warning. A response header. The
      session cookie in application storage.
   4. **Industry-standard protocols and primitives.**
      JWT signatures. OAuth's authorization code
      flow. Postgres `MVCC`. Redis `SETNX`. Use
      these only when no lower-level primitive
      captures the concept.
   5. **Whole products — last resort.** "Gmail's
      optimistic send", "Linear's drag-to-reorder",
      "GitHub's branch protection." Avoid these when
      a primitive works: they assume the reader uses
      that specific product. A todo list and a DB
      table are universal; a SaaS product is not.
      Use a whole-product anchor only when the
      concept genuinely has no primitive-level
      equivalent.

   The test: could the reader open the app, browser
   tool, or codebase and verify what the writer
   claims? If yes, the example is grounded. If the
   only way to verify is "trust me, this is like a
   coat check," the writer has used an analogy and
   needs to find a real example instead. The second
   test: is there a more universal anchor one level
   down? If the writer reached for "Linear does X"
   but a todo list would carry the same point, the
   writer should drop to the todo list.

   The narrow exception: when the only working
   example involves software the reader is unlikely
   to have touched (specialized academic systems,
   internal tools at large companies), a brief
   physical-world reference is acceptable as a
   *secondary* anchor after the engineering reference.
   Never as the primary.

─────────────────────────────────────────────────
CONSTRAINTS
─────────────────────────────────────────────────

→ Every concept has a primary diagram that follows
   How it works as the recap visual
→ Every paragraph inside How it works that introduces
   jargon must anchor it with a secondary visual in the
   same paragraph (small diagram, pseudocode, comparison
   table, or execution trace)
→ Every algorithm must have a step-by-step execution trace
   showing every variable at every step — not just before/after
→ Every term must be shown before it's used
→ Write like you're explaining to a smart developer who
   asked "how does this actually work?" — not like a textbook
→ Navigable headers: every concept gets its own ### header
   so the reader can return to specific blocks later
→ Self-contained blocks: every concept block works without
   requiring the reader to have read any other block first
→ No section should require a second read to understand
→ Diagrams must be readable without surrounding prose
→ All diagrams in fenced code blocks with box-drawing chars
→ No Mermaid, no images, no PlantUML
→ Each section (system design, DSA, AI, ML) saved as a subdirectory
   of named files — one file per pattern or operation found
→ Every file must have a README.md index in its directory
→ Every concept file must include a Subtitle (Industry name(s)
   + Type label) directly under the H1, before the blockquote
→ Every concept file must include a Why care block
   immediately after the blockquote and before the
   diagram. Length scaled by complexity — simple
   concepts get a short scenario plus a one-line
   summary; complex ones get a fuller scenario, a
   worked before/after, and a bolded "why this
   matters" pivot. Five required moves in order:
   (1) Move 1 — open with a grounded scenario the
   reader can hold in their head; physical objects,
   verbs, specifics; no abstract framing, no clever
   rhetorical openers. Hook-sentence openings
   ("Most of the speed in a modern web app comes
   from not doing work") are banned in favour of
   scenario openings ("You've watched your editor
   lag for a second after typing fast — that's
   the buffer filling up"). (2) Move 2 — name the
   pattern by framing it as the answer to the
   question the scenario set up; sharpen with
   "not X, not Y — just Z" when the pattern
   sits adjacent to similar patterns. Definition-
   first openings are banned. (3) Move 3 — bolded
   transition ("**Why you need to answer that
   question at all:**" or similar) then a paragraph
   on what depends on the pattern, what breaks
   without it. At least one concrete consequence
   the reader can picture; abstract claims about
   correctness/performance/data integrity are
   banned without a worked instance. Codebase
   references ARE allowed here (real fields, real
   files) — the relaxed rule replaces the old
   "no project nouns" ban. (4) Move 4 — concrete
   before/after with two short bulleted scenarios
   (three to five bullets each, same scenario two
   outcomes). Skip when concept is too simple to
   earn it or when before/after would mislead.
   (5) Move 5 — one-line summary that names the
   pattern in a single phrase, by reference to a
   frontend primitive the reader builds with daily
   (React's `key` prop, a primary key, an optimistic
   list render) — NOT a physical-world metaphor and
   NOT a whole-product reference. Always one
   sentence. Optionally followed by a handoff line
   to How it works. Move 1's scenario must remain
   project-agnostic (a reader who has never seen
   this codebase must understand it) and grounded in
   a frontend primitive — a todo list rendering, a
   DB table's rows and columns, a `.map()` with a
   `key`, a form input, a `fetch()` and its loading
   state. Banned: physical-world analogies (coat
   checks, librarians, locked doors) AND
   whole-product anchors ("Linear does X") when a
   lower-level primitive works — see the global
   "Use real software, not analogies" rule in
   FORMATTING RULES. Moves 3–5 may ground in the
   codebase to make consequences vivid.
→ Every concept file must include a How it works block
   immediately after Why care and before the primary
   diagram. Length scaled by complexity, not capped at
   a paragraph count — simple concepts get four short
   paragraphs, complex backend/AI/infra concepts get
   fifteen or twenty with sub-headings. Required moves
   in order: (1) Move 1 — open with a mental model
   anchored to **a frontend primitive the reader
   builds with** (a re-rendering list, a DB table
   with rows and columns, a primary key, a `fetch()`
   and its states), then one sentence naming the
   underlying strategy. Move 1 also requires one
   small ASCII mnemonic diagram (5–12 lines) showing
   the literal shape of the mental model.
   Definition-first openings ("X is a mechanism
   for...") are banned. **Physical-world analogies
   (locked doors, coat checks, librarians) AND
   whole-product anchors ("Linear does X", "GitHub
   does Y") are banned as primary anchors when a
   lower-level primitive works** — see the global
   "Use real software, not analogies" rule in
   FORMATTING RULES. (2) Move 2 — a
   layered walkthrough where each independent part of
   the concept gets its own bolded sub-heading and
   covers four things: the technical thing named with
   its real term, a bridge from what the reader already
   knows ("if you're coming from frontend, you're used
   to X — here it's different"), the practical
   consequence walked through with a concrete example,
   and the condition under which it works or breaks.
   **Every Move 2 sub-section requires at least one
   ASCII diagram showing its mechanism** — pick the
   type that fits (flow, table rows & columns,
   comparison, sequence, inline code annotation).
   (2.5) Optional but required when applicable —
   Phase A / Phase B sub-section for concepts that
   involve built-but-not-fully-active mechanisms,
   migrations, or gradual rollouts. **Move 2.5
   requires a side-by-side comparison diagram.**
   (3) Move 3 — end
   with the principle that generalises beyond this
   codebase, not a summary of what was just said.
   Every abstract claim must be followed by a concrete
   consequence. Bridges from frontend knowledge are
   required in every sub-section of move 2 — without
   a bridge, the writer hasn't done the work. Every
   diagram is wrapped in prose: one sentence before,
   one after — diagrams never stand alone. Use
   box-drawing characters, label every box and every
   information-carrying arrow, name every layer.
→ Every concept file must include a Tradeoffs block
   immediately before Summary. Required parts:
   (1) a comparison table with at least four cost
   dimensions, path-taken vs alternative; (2) sub-block
   1 — what we gave up, walking each cost in concrete
   terms (files, numbers, scenarios — never "added
   complexity"); (3) sub-block 2 — what the alternative
   would have cost, applied to the same dimensions;
   (4) sub-block 3 — the breakpoint, a quantitative or
   event-shaped condition under which this choice
   stops being the right call. Sub-block 4 (what
   wasn't actually a tradeoff) is optional. Hedging
   language is banned — own the cost or own the
   mistake.
→ Every concept file must include a Summary block
   immediately after Tradeoffs and before Interview
   defense. Two parts in this order: (1) a one-paragraph
   concept recap of 3–5 sentences covering what the
   pattern is, how it shows up in this codebase, the
   constraint that forced it, and the cost being paid;
   (2) 3–6 short, declarative key points covering at
   least one shape, one rule, and one tradeoff. No new
   information — everything in Summary must
   already appear earlier in the file.
→ Every concept file must include an Elaborate block
→ Every concept file must include an Interview defense
   block immediately after Summary. Required parts:
   (1) "What an interviewer is really asking" — one
   paragraph naming the softer question behind the
   technical one; (2) "Likely questions" — at minimum
   one [mid], one [senior], and one [arch] Q&A, each
   with a first-person model answer of 3–5 sentences
   AND a small diagram (5–10 lines, ASCII, labelled)
   that matches the question level — flow for [mid],
   comparison for [senior], scale/boundary for [arch];
   (3) "The question candidates always dodge" — one
   long-form Q&A that owns the limitation, with a
   comparison diagram showing what was picked vs what
   the questioner suggested; (4) "One-line anchors" —
   3–5 conclusion-shaped statements the reader can
   carry into the interview. Skip a diagram only when
   the question is genuinely non-visual.
→ Every concept file must include a Validate block
→ Every "In this codebase" section must include file path
   and line range — no concept file without a code reference
→ Every Level 3 validate scenario must reference the specific
   file and lines the reader checks their answer against
→ Every concept file must include a `## Tech reference
   (industry pairing)` section between Tradeoffs and
   Summary. One `###` subsection per tech the file
   references (runtime, framework, ORM, AI provider,
   storage, queue, auth — anything load-bearing).
   Each subsection has five labelled bullets:
   `**Codebase uses:**`, `**Why it's here:**`,
   `**Leading today:**` (with the label
   `adoption-leading` or `innovation-leading` and the
   year), `**Why it leads:**` (specific technical
   reason — never marketing), `**Runner-up:**`
   (required when the codebase already uses the leader).
   **No markdown tables with pipes** — they break in
   narrow renderings. Use `###` heading + labelled
   bullets exactly.
→ AI/ML-specific constraints have moved to
   `study-ai-engineering.md`. These include: the
   Project exercises block requirement for AI/ML
   files, the rule that files are generated for
   every in-scope curriculum concept (not just
   concepts found in the codebase), the System
   Design Templates sub-section behavior, and the
   per-sub-section Anchor / Curriculum line rule.
   They apply only when running the AI engineering
   workflow against `study-ai-engineering.md`.
```

> 💾 Save output → `.aipe/study-system-design-dsa/` with this structure:
>
> ```
> study-system-design-dsa/
>   00-overview.md
>   01-system-design/
>     README.md                ← index of all pattern files
>     01-[pattern-name].md
>     02-[pattern-name].md
>     ...
>   02-dsa/
>     README.md                ← index + complexity cheat sheet
>     01-[operation-name].md
>     02-[operation-name].md
>     ...
> ```
>
> Pattern and operation names come from what's actually found in the codebase — not a fixed list. Name each file after the concept it explains. Use kebab-case.

---

## Check for existing guide

Before generating, check whether a study guide already exists at `.aipe/study-system-design-dsa/`.

```
If found:
  → Read all existing files in all subdirectories
  → Diff each file against current context
  → Output change summary per file:
      01-system-design/03-serverless-functions.md
        Outdated: references Netlify Blobs, now Neon Postgres
        Missing:  connection pooling section
        Action:   update "In this codebase" + add elaborate link
  → Wait for confirmation before editing
  → Edit only the specific sections identified — not whole files
  → Add new files if new patterns are found in the codebase
  → Update README.md indexes if files were added or removed
  → Append to each updated file:
      ---
      Updated: [date] — [one-line summary of what changed]

If not found:
  → Generate full guide with subdirectory structure
```

---

## How to use it

**One file, one sitting.** Each file walks one pattern from
hook to validated understanding. Open one, work through it
end to end, then move on. The blocks are ordered for a reason
— Why care frames it, How it works explains it, the diagram
recaps it, the rest deepens it. Reading out of order leaves
gaps the validate block won't catch.

**Read the prose, then the diagram.** How it works comes
before the primary diagram by design. The prose walks the
mechanics; the diagram lands as the recap visual once you
already know what you're looking at. If the diagram raises
a question the prose didn't answer, that's a signal the prose
needs sharpening — not a sign to read the diagram first.

**Traces are the point.** The execution traces in the DSA
section are the most valuable part of the document. Don't
skip them. A trace shows you exactly what a computer does
at every step — that's what most explanations skip.

**Validate before moving on.** After each concept file, run
through the validate block before opening the next one.
Level 1 takes two minutes. Level 4 takes ten. Both are
faster than re-reading a concept you only half-understood
the first time.

**Open the code.** Every validate scenario sends you back to
a specific file and line range. Open it. Read the actual
code. The study guide explains what the code does — the code
is the ground truth. Seeing both together is what turns
comprehension into fluency.

**Return to specific blocks, not whole files.** Once you've
worked a file end to end, the navigable headers let you
return to specific blocks for reference — the complexity
cheat sheet when adding a new data operation, the AI
patterns when adding a new model feature, the tradeoff
table when revisiting a decision. Each block was written
to stand on its own when you come back to it.
