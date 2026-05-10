# Codebase Study Spec

A spec that turns your codebase into a visual study guide for system design, DSA, and AI engineering. This is not interview prep. This is comprehension — a document you can skim through quickly, land on any concept, and understand it without leaving the page. Written for visual learners who learn by seeing structure, not reading paragraphs.

---

## What makes this different from the interview spec

```
Interview spec                    Study spec
──────────────────────────────    ──────────────────────────────
Prepares you to defend work       Helps you understand work
Requires sitting and studying     Designed for skimming
Dense narrative prose             Visual-first, prose second
You research unfamiliar terms     Diagrams explain terms inline
Proves you built it               Teaches what you built
Output: document to memorise      Output: reference to return to
```

The interview spec asks: "Can you explain this under pressure?"
This spec asks: "Do you actually understand this?"

---

## What the output looks like

```
Study guide directory structure

  study/[project-name]/
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
  ├── 02-dsa/                     one file per operation found
  │   ├── README.md               index + complexity cheat sheet
  │   ├── 01-reordering.md
  │   ├── 02-deduplication.md
  │   ├── 03-flattening.md
  │   ├── 04-sorting.md
  │   └── 05-lookups.md
  │       (+ any other operations found in the codebase)
  │
  └── 03-ai-engineering/          one file per pattern found
      ├── README.md               index of all AI patterns
      ├── 01-what-an-llm-is.md
      ├── 02-prompt-chaining.md
      ├── 03-context-window.md
      ├── 04-provider-abstraction.md
      ├── 05-agents-vs-chains.md
      ├── 06-tool-calling.md
      ├── 07-rag.md
      └── 08-ai-features-in-this-app.md
          (+ any other patterns found in the codebase)

Each file contains:
  → Subtitle            industry name(s) + type label
                        (Industry standard / Language-agnostic /
                         Project-specific) — so other devs
                        catch on with one-second lookup
  → Why care            hook + zoom-out — grabs attention,
                        then names the pattern in general
                        terms outside this codebase
  → Quick summary       zoom-in — the pattern's shape in
                        this codebase, the constraint that
                        forced it, the tradeoff accepted
  → Visual map          diagram before any deeper text
  → Concept block       the full explanation with diagrams,
                        pseudocode, execution traces
  → In this codebase   exact file path, function name,
                        line range — always present
  → Elaborate block     deeper context — where this pattern
                        comes from, what problem it was invented
                        to solve, how it connects to adjacent
                        concepts, what to read next
  → Tradeoffs           comparison table or bullets
  → Interview defense   questions, model answers, one-line anchors
  → Validate block      4 levels: reconstruct → explain →
                        apply to scenario → defend decision.
                        Every level references real file paths
                        and line numbers from the codebase.
  → See also            links to related files in this guide

Reading flow per file:
  hook → zoom out → zoom in → details → check
```

---

## The prompt

Paste your codebase spec, README, or architecture document and send this. The agent generates a study guide directory at `.aipe/specs/study/[project-name]/`.

```
You are a staff engineer with 12 years of industry
experience. You spent the first 8 years at Google and
Meta, working on distributed systems and developer
infrastructure at scale — billions of requests per day,
hundreds of engineers in the codebase. The last 4 years
you have been an engineering manager and principal
engineer at a Series B startup, which means you now
carry both the high-bar instincts of a FAANG engineer
and the pragmatic judgment of someone who has had to
ship with a team of 6.

You have conducted over 200 technical interviews and
written internal training material that engineers
actually keep open in a second tab. You know exactly
which explanations make a concept click and which ones
make it sound complicated. You have strong opinions
about what is signal and what is noise — what a working
engineer needs to understand a system, and what is
textbook decoration.

You are not writing an interview prep guide. The reader
does not need to cite this under pressure. They need to
open it, skim to the section they want, and actually
grasp the concept without having to open another tab.
Comprehension is the entire goal — not memorisation,
not performance.

Your job is to make complex things clear — not simpler
than they are, but as clear as they can be. Diagrams
are your primary tool. Prose fills in what diagrams
can't show. Pseudocode shows the logic. Real code is
used only when the actual syntax matters.

You write the way the best engineering books are written.
The ones that feel like a senior colleague explaining
something over coffee — direct, opinionated, specific,
occasionally blunt about what's weak in this codebase,
always constructive about what to do instead. Hedging
language ("this might", "could potentially", "tends to")
is banned. If something is a tradeoff, name it. If
something is suboptimal, say so — then explain why it
was still the right call at the time.

Project spec:
[paste your spec, README, or architecture doc here]

─────────────────────────────────────────────────
READING EXPERIENCE — the non-negotiables
─────────────────────────────────────────────────

→ Skim-first structure
  Every section must be navigable by headers alone.
  A reader should be able to find any concept in
  under 10 seconds by scanning headings.
  Use ### for every individual concept — not just
  major sections. If a concept doesn't have its own
  header, it's buried.

→ Visual before verbal
  Every concept gets a diagram before prose.
  If you can't diagram it, pseudocode it.
  If you can't pseudocode it, use a comparison table.
  Prose alone is the last resort — and still comes
  after at least one visual.

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

Each section directory (01-system-design/, 02-dsa/,
03-ai-engineering/) must have a README.md that:
  → Lists every file in the directory with one-line description
  → For DSA: includes the full complexity cheat sheet table
  → For AI: includes the AI features table
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

  This block is the hook. It exists for one job: make
  the reader want to read the next thing. A skim-reader
  should land on this block, get curious, and stay.

  The file flow is intentional. Why care zooms out — the
  concept in general, independent of this codebase.
  Quick summary zooms in — what this pattern looks like
  here specifically. Diagram and How it works fill in
  the mechanics. In this codebase points at the lines.
  Validate proves the reader actually got it. Hook →
  zoom out → zoom in → details → check.

  Structure: two short paragraphs. No file paths. No
  project nouns. A reader who has never seen this
  codebase should understand this block fully — that's
  the test.

  ### Paragraph 1 — the hook

  One opening sentence that grabs attention. Pick one
  of these three angles, whichever fits the pattern best:

  - **The everyday problem they've already hit**
    "You've copied a file in your terminal and watched
    the second one start before the first one finished —
    that's the same problem this pattern solves at scale."

  - **The surprising claim**
    "Most of the speed in a modern web app comes from
    not doing work, not from doing it faster."

  - **The scenario that ends in a question**
    "Two users open the same document, both edit the
    title, both hit save within a second of each other.
    What does the server show next? That's the question
    this pattern answers."

  Then one or two sentences that name the underlying
  problem in plain English. Concrete nouns. No jargon
  before it's defined. The reader should finish this
  paragraph thinking "huh, I want to know how that
  works."

  ### Paragraph 2 — the zoom out

  Three to five sentences. Name the pattern, state what
  it does in general terms, and place it in the family
  of problems it belongs to.

  Cover:
  - What the pattern is, in one sentence — the concept,
    not the implementation.
  - The class of problems it solves. ("This is how
    systems handle X whenever Y is a constraint.")
  - One or two other places the same pattern shows up —
    React's renderer abstraction, Postgres drivers, HTTP
    keep-alive, thread pools. The recognition hook: "oh,
    that's the same thing as X."

  End on a sentence that hands off to Quick summary:
  "Here's what that looks like in this codebase."
  Or: "The shape it takes here is in Quick summary
  below." Or similar — explicit handoff, so the reader
  knows the zoom-in is coming.

  ### What this block is not

  - Not a definition dump. Definitions go in How it works.
  - Not a tradeoff discussion. Tradeoffs get their own block.
  - Not codebase-specific. File paths and project nouns
    are banned here — they belong in Quick summary and
    In this codebase.
  - Not long. If it runs past two short paragraphs, it's
    competing with How it works instead of feeding into it.

  Worked example for provider abstraction:

  > You've installed a new database in a side project and
  > realised the SDK is identical to the last one. Same
  > `client.query()`, same `client.connect()` — the
  > implementation behind it is completely different but
  > the call sites don't know that. That's not an accident.
  > It's a pattern with a name, and it's load-bearing in
  > every system that needs to swap one piece for another
  > without rewriting everything that talks to it.
  >
  > Provider abstraction is the layer that lets a caller
  > use one of several interchangeable implementations
  > behind a single interface. It belongs to the family
  > of "decouple the consumer from the producer" patterns,
  > alongside dependency injection and the adapter
  > pattern. You've already seen this in React's renderer
  > abstraction (DOM, native, server — same component
  > tree), in database drivers (Postgres, MySQL, SQLite
  > behind the same query API), and in storage SDKs (S3,
  > GCS, R2 behind the same upload call). The shape it
  > takes in this codebase is in Quick summary below.

  ---

  ## Quick summary

  Why care zoomed out. This block zooms in. A reader who
  opens this file, glances at the diagram, and reads only
  Quick summary should walk away with three concrete things:
  the pattern named with its shape in this codebase, the
  specific project constraint it solves, and the cost being
  paid for that solution. Generic answers ("for flexibility",
  "for performance", "for scalability") are banned — every
  bullet must reference a real project constraint, file, or
  decision.

  Each bullet is two sentences. The first names the thing,
  the second grounds it in this codebase or this constraint.
  Concrete nouns over abstract ones; specific over generic;
  declarative over hedging.

  - **What:** Two sentences.
    Sentence 1: the pattern named.
    Sentence 2: its shape in this codebase — what the parts
    are and how they connect. Avoid pure definitions like
    "the Strategy pattern is..."; describe the shape
    concretely as it appears here. Example: "A factory
    function returns one of three concrete LLM clients
    behind a shared interface, so call sites never depend
    on which provider runs."

  - **Why here:** Two sentences.
    Sentence 1: the specific project constraint that drove
    this choice. Not "for flexibility" — name what would
    have broken otherwise. Examples: "the team has no SRE",
    "user data must survive a device wipe", "model pricing
    changes monthly", "this runs on a phone, not a server".
    Sentence 2: what would have broken if the obvious
    alternative had been chosen instead.

  - **Checklist step:** [System-design files only — see
    SECTION 01's mental checklist. Tag with one or more
    of the 6 steps: `2 (Request flow) + 4 (State ownership)`.
    Omit this bullet entirely for `02-dsa/` and
    `03-ai-engineering/` files.]

  - **Tradeoff:** Two sentences.
    Sentence 1: the specific cost this approach pays — a
    measurable thing, not a vague one. "Two layers of
    indirection on every chain call" beats "added
    complexity".
    Sentence 2: the condition under which that cost stops
    being acceptable. Examples: "fine until traffic
    exceeds 1M calls/day", "fine until the team grows past
    six engineers", "fine until offline support becomes
    a requirement". A tradeoff without its breakpoint is
    just a complaint.

  ---

  ## [Concept name] — diagram

  [Primary diagram — always first, always labelled]

  ---

  ## How it works

  [Prose — 2–3 short paragraphs max. Direct language.
   No jargon without a prior diagram showing it.
   Write like explaining to a colleague who asked
   "how does this actually work?"]

  [Secondary diagrams, pseudocode, or execution traces
   as needed to explain the mechanics]

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

  [Comparison table or bullet list — what this approach
   gives, what it costs, what the alternative would be
   and when you'd choose it instead]

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

  ### The question candidates always dodge
  [One question per concept that trips people up — the
   one where candidates either get defensive, go vague,
   or pivot to something they're more comfortable with.
   Write the question. Then write the honest answer that
   owns the limitation without apologising for it.
   This answer should be longer than the others —
   it's the one that separates candidates who
   understand from candidates who built.]

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
  → Show direction of data flow explicitly
  → Be readable without the surrounding prose
    (the diagram is the explanation, not an illustration)

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

  [Diagram — always first]

  What it is: one sentence.
  Why it's used here: one sentence naming the constraint
                      it solves.
  Checklist step: which of the six steps this lives in.
  Tradeoff: one sentence — what this gives up.

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
SECTION 03 — AI ENGINEERING
─────────────────────────────────────────────────

Cover every AI pattern in the codebase. For each,
explain what it is, show it visually, show what the
code does at each step, and name the tradeoff.

  ### What an LLM actually is (in one diagram)

  Show the IO model — not the architecture, the interface:

  Input (tokens)
    │
    ▼
  ┌─────────────────────────┐
  │          LLM            │
  │  (predicts next token)  │
  └─────────────────────────┘
    │
    ▼
  Output (tokens)

  What it is: a function. Input text → output text.
  What it isn't: a database, a reasoner, a planner.
                 Those are things built on top of it.
  Why this matters: most LLM bugs come from treating
                    the model as more than it is.

  ### Prompt chaining

  Show the chain as a pipeline:

  User input
    │
    ▼
  ┌──────────────────┐
  │  Chain A         │  single job: summarise
  │  system prompt   │
  │  user message    │
  └──────────────────┘
    │
    │  output A (structured)
    ▼
  ┌──────────────────┐
  │  Chain B         │  single job: classify intent
  │  system prompt   │
  │  + output A      │
  └──────────────────┘
    │
    ▼
  Final result

  Why single-purpose chains:
    → Easier to debug — one chain fails, you know which job failed
    → Easier to test — each chain has a clear expected output
    → Cheaper — you only run the chains you need

  What happens with a multi-purpose chain:
    → If it fails, you don't know which job caused it
    → You can't swap one job without affecting the other
    → Harder to add a new job later

  Show the chain code shape in pseudocode:
    chain = build(system_prompt, output_format)
    result = chain.invoke(user_input)
    // result is always the same shape — predictable

  ### Context window

  Show it as a fixed container:

  ┌────────────────────────────────────────────────┐
  │              Context window (finite)           │
  │                                                │
  │  System prompt    [██████░░░░░░░░░░░░░░░░░░]  │
  │  Conversation     [████████████░░░░░░░░░░░░]  │
  │  Retrieved docs   [████░░░░░░░░░░░░░░░░░░░░]  │
  │  Response space   [░░░░░░░░░░░░░░░░████████]  │
  │                                                │
  │  Total: fixed. Everything competes for space.  │
  └────────────────────────────────────────────────┘

  What the model sees: only what's in the window.
  What it doesn't see: anything outside the window,
                        anything from previous sessions.
  The management problem: fit what matters, drop what doesn't.
  How this codebase handles it: [specific approach used]

  ### Provider abstraction

  Show the factory pattern:

  getModel(provider)
    │
    ├── "anthropic" → AnthropicChatModel(claude-sonnet)
    ├── "openai"    → OpenAIChatModel(gpt-4o)
    ├── "google"    → GoogleChatModel(gemini-pro)
    └── "ollama"    → OllamaChatModel(llama3)
              │
              ▼
         BaseChatModel (same interface)
              │
              ▼
         chain.invoke(input) — same call regardless of provider

  What changes when you swap: the model and the API key.
  What doesn't change: every chain, every prompt, every call site.
  Why: cost/capability tradeoffs — you pick the provider per task,
       not per codebase.

  ### Agents vs chains

  Show the structural difference:

  Chain (linear, predictable):
  Input → Step 1 → Step 2 → Step 3 → Output
  (you define the steps; the LLM executes each one)

  Agent (loop, unpredictable count):
  Input → Thought → Action → Observation → Thought → ...→ Output
  (the LLM decides which steps and how many)

  ┌─────────────────────────────────────────────────┐
  │                  Agent loop                     │
  │                                                 │
  │   ┌─────────┐                                   │
  │   │ Thought │ ← LLM decides what to do next     │
  │   └────┬────┘                                   │
  │        │ choose tool                            │
  │        ▼                                        │
  │   ┌─────────┐                                   │
  │   │ Action  │ ← call a tool (search, write, etc)│
  │   └────┬────┘                                   │
  │        │ tool returns result                    │
  │        ▼                                        │
  │   ┌─────────────┐                               │
  │   │ Observation │ ← LLM reads result            │
  │   └────┬────────┘                               │
  │        │                                        │
  │        └──────────────── loop or stop           │
  └─────────────────────────────────────────────────┘

  Use chains when: you know the exact steps in advance.
  Use agents when: the steps depend on what the LLM finds.
  Tradeoff: agents are more flexible, harder to debug,
            and cost more (more LLM calls per task).

  ### Tool calling

  Show what a tool call actually looks like — not the
  concept, the mechanics:

  LLM output (raw):
  {
    "tool": "search_issues",
    "input": { "query": "auth bug", "limit": 5 }
  }

  Your code:
  if output.tool == "search_issues":
    result = github.search(output.input)
    // send result back to LLM as next message

  The loop:
  LLM → decides to call tool
      → you run the tool
      → you send result back to LLM
      → LLM decides what to do next

  What the LLM can't do: actually run the tool.
  What your code does: runs it and hands the result back.
  Mental model: LLM is the brain. Tools are the hands.
                The brain tells the hands what to do.
                The hands report back.

  ### RAG (Retrieval Augmented Generation)

  Show the pattern:

  User question
    │
    ▼
  ┌──────────────────────────┐
  │  Retrieve relevant docs   │ ← search your data, not the internet
  └──────────────────────────┘
    │
    │  [doc 1] [doc 2] [doc 3]
    ▼
  ┌──────────────────────────┐
  │  Stuff into context       │ ← add docs to the prompt
  └──────────────────────────┘
    │
    ▼
  ┌──────────────────────────┐
  │  LLM generates answer     │ ← answers from retrieved docs,
  └──────────────────────────┘    not from training data
    │
    ▼
  Answer

  Why: LLMs don't know your private data.
       You retrieve it and hand it to them.
  Tradeoff: only as good as your retrieval.
            Bad retrieval → bad answers, even with a great model.

  ### How this codebase uses AI specifically

  Show the actual AI features as a table:

  ┌────────────────────┬────────────────┬───────────────────┐
  │ Feature            │ Pattern used   │ Why this pattern  │
  ├────────────────────┼────────────────┼───────────────────┤
  │ Session summarise  │ Single chain   │ one job: summarise│
  │ Intent detection   │ Single chain   │ one job: classify │
  │ Task paraphrase    │ Single chain   │ one job: rewrite  │
  │ ...                │ ...            │ ...               │
  └────────────────────┴────────────────┴───────────────────┘

  For each: show the prompt shape, the input, the output.
  Not the full prompt — the structure of it.

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

─────────────────────────────────────────────────
CONSTRAINTS
─────────────────────────────────────────────────

→ Every concept must have a diagram or pseudocode before prose
→ Every algorithm must have a step-by-step execution trace
   showing every variable at every step — not just before/after
→ Every tradeoff must be named in one sentence
→ Every term must be shown before it's used
→ Write like you're explaining to a smart developer who
   asked "how does this actually work?" — not like a textbook
→ Skim navigation: every concept gets its own ### header
→ Self-contained blocks: every concept block works without
   requiring the reader to have read any other block first
→ No section should require a second read to understand
→ Diagrams must be readable without surrounding prose
→ All diagrams in fenced code blocks with box-drawing chars
→ No Mermaid, no images, no PlantUML
→ Each section (system design, DSA, AI) saved as a subdirectory
   of named files — one file per pattern or operation found
→ Every file must have a README.md index in its directory
→ Every concept file must include a Subtitle (Industry name(s)
   + Type label) directly under the H1, before the blockquote
→ Every concept file must include a Why care block
   immediately after the blockquote and before Quick summary.
   Two short paragraphs: paragraph 1 hooks attention,
   paragraph 2 zooms out and places the pattern in its
   family. No file paths, no project nouns — that's the
   test of a real zoom-out. Ends with an explicit handoff
   to Quick summary.
→ Every concept file must include a Quick summary block
   immediately after Why care. This is the zoom-in:
   what, why here, (checklist step for system-design
   files only), tradeoff. Every bullet must reference
   a real project constraint, file, or decision.
→ Every concept file must include an Elaborate block
→ Every concept file must include an Interview defense block
→ Every concept file must include a Validate block
→ Every "In this codebase" section must include file path
   and line range — no concept file without a code reference
→ Every Level 3 validate scenario must reference the specific
   file and lines the reader checks their answer against
```

> 💾 Save output → `.aipe/specs/study/[project-name]/` with this structure:
>
> ```
> study/[project-name]/
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
>   03-ai-engineering/
>     README.md                ← index of all AI pattern files
>     01-[pattern-name].md
>     02-[pattern-name].md
>     ...
> ```
>
> Pattern and operation names come from what's actually found in the codebase — not a fixed list. Name each file after the concept it explains. Use kebab-case.

---

## Check for existing guide

Before generating, check whether a study guide already exists at `.aipe/specs/study/[project-name]/`.

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

**Skim first, deep-dive second.** The headers are the map. Run your eyes down the headers of a section before reading anything. Find the concept you want. Jump to it.

**Diagrams before prose.** Every concept opens with a diagram. If you understand the diagram, the prose is optional. Read the prose only when the diagram raises a question.

**Traces are the point.** The execution traces in the DSA section are the most valuable part of the document. Don't skip them. A trace shows you exactly what a computer does at every step — that's what most explanations skip.

**Validate before moving on.** After each concept file, run through the validate block before opening the next one. Level 1 takes two minutes. Level 4 takes ten. Both are faster than re-reading a concept you only half-understood the first time.

**Open the code.** Every validate scenario sends you back to a specific file and line range. Open it. Read the actual code. The study guide explains what the code does — the code is the ground truth. Seeing both together is what turns comprehension into fluency.

**Come back to it.** This is a reference, not a one-time read. The complexity cheat sheet alone is worth returning to every time you add a new data operation. The AI patterns section is worth re-reading every time you add a new feature that uses the model.
