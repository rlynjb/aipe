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
  → How it works        prose walkthrough of the mechanics,
                        2–3 short paragraphs with inline
                        secondary diagrams, pseudocode, or
                        execution traces where needed
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
extends it, Tradeoffs name the cost, Summary recaps it,
Interview defense pressure-tests it, Validate proves you got it.
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
open one file at a time and work through it — building
the concept the way they'd build it in their own head,
without having to open another tab. Comprehension is
the entire goal — not memorisation, not performance.

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
  How it works walks the mechanics in prose; the diagram
  follows as the recap visual for what was just described.
  In this codebase points at the lines. Tradeoffs name
  what was given up. Summary recaps everything in
  one block — the concept plus the key points worth
  carrying away. Validate proves the reader actually
  got it. Hook → zoom out → mechanics → diagram →
  tradeoffs → recap → check.

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

  End on a sentence that hands off to How it works:
  "Here's how that actually works in this codebase."
  Or: "How it shows up here is in the next block."
  Or similar — explicit handoff, so the reader knows
  the mechanics are coming.

  ### What this block is not

  - Not a definition dump. Definitions go in How it works.
  - Not a tradeoff discussion. Tradeoffs get their own block.
  - Not codebase-specific. File paths and project nouns
    are banned here — they belong in How it works and
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
  > GCS, R2 behind the same upload call). How it works
  > in this codebase is in the next block.

  ---

  ## How it works

  [Prose — 2–3 short paragraphs max. Direct language.
   Write like explaining to a colleague who asked
   "how does this actually work?"]

  [Secondary diagrams, pseudocode, or execution traces
   inline where they earn their place. The reader should
   never encounter a piece of jargon without a visual
   anchoring it within the same paragraph.]

  End with a sentence that hands off to the primary
  diagram: "The full picture is below." Or: "Here's
  the diagram of the whole flow." The diagram that
  follows is the recap visual — it shows everything
  the prose just walked through, in one frame.

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

  ## Summary

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
    Why care's paragraph 2).
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
→ Each section (system design, DSA, AI) saved as a subdirectory
   of named files — one file per pattern or operation found
→ Every file must have a README.md index in its directory
→ Every concept file must include a Subtitle (Industry name(s)
   + Type label) directly under the H1, before the blockquote
→ Every concept file must include a Why care block
   immediately after the blockquote and before the
   diagram. Two short paragraphs: paragraph 1 hooks
   attention, paragraph 2 zooms out and places the
   pattern in its family. No file paths, no project
   nouns — that's the test of a real zoom-out. Ends
   with an explicit handoff to the diagram or
   How it works.
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
