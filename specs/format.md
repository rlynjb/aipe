─────────────────────────────────────────────────
format.md — the concept-file format (shared reference)
─────────────────────────────────────────────────

The shape of every concept file in the study family.

  teacher.md  → who writes the file (voice, persona)
  me.md       → who reads the file (calibration)
  format.md   → how the file is structured (this file)

The topic specs (`study-system-design-dsa.md`,
`study-ai-engineering.md`, `study-prompt-engineering.md`,
`study-agent-architecture.md`,
`study-interview-defense.md`) provide the WHAT — which
concepts, anchored to which codebase. This file
provides the structure they all fill.

Like `teacher.md` and `me.md`, this file is
**referenced, not regenerated**. It produces no
artifact of its own and names no specific project. A
spec that builds concept files reads this file for the
template, the diagram rules, the pseudocode rules, and
the hard rules — and does not restate them.

**Precedence: this file is the single source of truth
for concept structure.** Where an older embedded
template inside a topic spec differs from this file,
THIS FILE WINS.

═════════════════════════════════════════════════
HOUSE STYLE — the defining traits of every guide
═════════════════════════════════════════════════

These are the traits that make a guide *this* guide —
the identity every concept file carries. A file
missing them is off-spec regardless of how accurate
its content is. Each names the block where it lives.

Structure and teaching shape:

  1. **Zoom out, then zoom in.** Always the big shape
     before the details. The guide opens with the
     system overview (the whole system in one diagram);
     every concept file opens with the Zoom-out block
     before How it works walks the mechanics. Never a
     detail the reader can't yet place on a picture.
     → Block 2 (Zoom out); How it works Move 1.

  2. **Conversational tone.** Write like a senior
     colleague explaining it over coffee — warm,
     second-person, plain-spoken, contractions fine.
     Conversational means the *register* is a person
     talking; it does NOT mean hedging, filler, or
     slow on-ramps, which stay banned. Friendly voice,
     dense content. → teacher.md (voice register);
     strongest in Block 2.

  3. **Skeleton parts.** For any pattern with a kernel,
     isolate the irreducible core and name each part by
     *what breaks when it is missing*; separate skeleton
     from optional hardening.
     → How it works (Move 2 variant).

  4. **Step by step.** Walk the mechanism one move at a
     time — one operation per line, one moving part per
     sub-heading. The reader never holds two new things
     at once. Algorithms get an execution trace
     (variable state at every step). → How it works
     (Move 2); PSEUDOCODE RULES.

Code:

  5. **Pseudocode.** Show logic as language-agnostic
     pseudocode before (or instead of) real code —
     plain-English control flow, concrete variable
     names, one operation per line, annotated.
     → How it works (Move 2); PSEUDOCODE RULES.

  6. **Code side by side, with a line-by-line read.**
     In the codebase block, show the actual repo code
     beside an explanation of what each part does —
     annotate the specific lines, never drop a block
     raw. → Block 5 (Implementation in codebase).

Diagrams (ASCII, box-drawing, always):

  7. **Pattern diagrams.** Draw the *shape* of the
     pattern itself — the loop, the traversal frontier,
     the topology, the kernel. The pattern is a picture
     before it is prose. → DIAGRAM RULES; How it works
     Move 1.

  8. **Flow diagrams.** Draw sequences as box-and-arrow
     flows — request flows, auth chains, data pipelines
     — top to bottom, every arrow labelled.
     → DIAGRAM RULES.

  9. **Layer + layers-and-hops diagrams.** Draw the
     bigger picture as labelled layers (UI / Service /
     Storage / Provider bands); draw anything that
     crosses layers or services as layers-and-hops,
     with every hop between bands labelled. A diagram
     that crosses a boundary without naming it is
     off-spec. → Block 2; How it works Move 2;
     DIAGRAM RULES.

 10. **Use cases.** Every concept shows where it is
     actually reached for in this codebase — concrete
     scenarios, not abstract definitions. → Block 5
     (Implementation in codebase).

This list is the guide's identity and is meant to
grow. Adding a trait is a one-line addition here plus
its enforcing rule below.

═════════════════════════════════════════════════
THE CONCEPT FILE — blocks in order
═════════════════════════════════════════════════

Each concept file walks one pattern from orientation
to verified understanding, in this order:

  1.  Subtitle                    industry name(s) + type label
  2.  Zoom out, then zoom in      orient   (replaces Why care)
  3.  How it works                understand
  4.  Primary diagram             recap visual
  5.  Implementation in codebase  see it in the real code
  6.  Elaborate                   deeper context
  7.  Project exercises           (AI / ML sections only)
  8.  Interview defense           pressure-test it
  9.  Validate                    prove you got it
  10. See also                    related files

```
  orient            understand          implement         defend
  ┌──────────┐      ┌──────────┐      ┌──────────────┐  ┌──────────┐
  │ zoom out │  →   │ how it   │  →   │ in this      │  │ interview│
  │ → zoom in│      │ works    │      │ codebase     │  │ defense  │
  └──────────┘      └──────────┘      └──────────────┘  └──────────┘
   layers dia        skeleton +         use cases +       Q + diagram
   conversational    pattern/pseudo     code side by      per answer
                     step by step       side
```

**Changes from the older template:**
  → Why care is REPLACED by "Zoom out, then zoom in."
  → Tradeoffs is REMOVED.
  → Tech reference is REMOVED.
  → Summary is REMOVED.
  → The remaining blocks are carried forward unchanged.

═════════════════════════════════════════════════
BLOCK 1 — SUBTITLE
═════════════════════════════════════════════════

Industry name(s) for the pattern plus a one-word type
label (Industry standard / Language-agnostic /
Project-specific), so another dev catches on in a
one-second lookup.

═════════════════════════════════════════════════
BLOCK 2 — ZOOM OUT, THEN ZOOM IN   (replaces Why care)
═════════════════════════════════════════════════

The opening block. Before any mechanism, put the
reader on the map. Two beats, in order:

  **Zoom out — the bigger picture.** Where does this
  pattern sit in the whole system? Show it as a LAYERS
  ascii diagram: the system as labelled bands (UI /
  Service / Storage / Provider), with this concept's
  box marked in the band where it lives. The reader
  sees the forest before the tree.

  **Zoom in — narrow to the concept.** Now that the
  reader knows where it sits, drop into what it is and
  the question it answers. Name the pattern. Hand off
  to How it works.

**Tone: this is the most conversational block in the
file.** Write it like a senior colleague pulling up a
diagram and saying "okay — here's the whole thing. See
this box? That's what we're talking about." Second
person, plain-spoken, inviting. Conversational is the
register, not a license to hedge or pad.

**Required diagram:** one LAYERS ascii diagram of the
bigger picture, this concept's box marked (5–14 lines).

```
  Zoom out — where this concept lives

  ┌─ UI layer ──────────────────────────────────┐
  │  React component   →   fetch()               │
  └─────────────────────────┬────────────────────┘
                            │  HTTP
  ┌─ Service layer ─────────▼────────────────────┐
  │  handler   →   ★ THIS CONCEPT ★   →   ...     │ ← we are here
  └─────────────────────────┬────────────────────┘
                            │
  ┌─ Storage layer ─────────▼────────────────────┐
  │  database / cache                            │
  └──────────────────────────────────────────────┘
```

**Banned (inherited from teacher.md):** definition-first
openings ("X is a mechanism that…"), physical-world
analogies as the anchor, marketing language, and slow
on-ramps. The zoom-out is fast — one diagram and a few
sentences, not three paragraphs of throat-clearing.

═════════════════════════════════════════════════
BLOCK 3 — HOW IT WORKS
═════════════════════════════════════════════════

The load-bearing block. Zoom-out put the reader on the
map; How it works is where they actually come to
understand the thing. By the end of it the concept
should *click* — not "I read the definition" but "I
could rebuild this from memory." Length scales with
complexity: short for a debounce, long (15–20
paragraphs with sub-headings and interspersed visuals)
for multi-layer auth or a prompt-routing loop.

**Tone: stay conversational — the same register as the
Zoom-out block.** Write like a senior colleague at the
whiteboard walking you through it: second person,
plain-spoken, "okay, watch what happens when the queue
empties," "here's the part everyone trips on." The
register is a person talking; the content stays dense
and precise. No lecturing, no definition-dumps, no slow
on-ramps.

**Describe the mechanics with these five tools — and
lean on them, not prose paragraphs:**

  → **skeleton parts** — isolate the kernel, name each
    part by what breaks without it (Move 2 variant)
  → **pattern ascii diagrams** — the shape of the
    mechanism itself: the loop, the traversal, the
    topology, the kernel
  → **pseudocode** — plain-English control flow for the
    logic, concrete variable names, one operation per
    line, annotated
  → **step by step** — one moving part at a time, in
    order; the reader never holds two new things at once
  → **layers-and-hops ascii diagrams** — for anything
    that crosses layers or services, the bands plus
    every hop between them labelled

**No code line references in this block.** How it works
teaches the *pattern*, not your repo — so don't paste
real code or cite file paths, function names, or line
numbers here. Describe the mechanism with pseudocode
and diagrams. The actual code from the codebase, with
its file paths and line ranges, lives in the
Implementation in codebase block (Block 5). Keep the
two cleanly separated: How it works is the general
mechanism; Implementation is where it lives in your
code.

It runs in three moves.

  #### Move 1 — the mental model (the pattern's shape)

  Start with the shape, not a definition. Anchor to a
  primitive the reader already builds with — "you know
  how a `fetch()` has loading / success / error states?
  same idea here" — then, in one plain-English sentence,
  name the underlying strategy. Keep it warm and direct;
  you're pointing at a picture, not reciting a glossary.

  **Required: one PATTERN ascii diagram** — the literal
  shape of the pattern (the loop, the traversal
  frontier, the topology, the kernel). This is the
  picture the reader paraphrases six weeks later. 5–12
  lines, right after the opening paragraph.

  #### Move 2 — the step-by-step walkthrough (the body)

  Walk the mechanism one moving part at a time. **Step
  by step: one operation per line, one moving part per
  bolded sub-heading — the reader never holds more than
  one new part in their head at once.** For each part,
  talk it through like you're at the whiteboard: name
  the real term, bridge from what the reader already
  knows, say what concretely happens, then name the
  boundary condition ("and here's where it breaks if
  you're not careful").

  **Every Move 2 sub-section gets at least one diagram.**
  Pick the type that matches what it describes:
    → a PATTERN diagram for the shape of the mechanism
    → a LAYERS-AND-HOPS diagram for anything that
      crosses layers or services — draw the bands and
      label every hop between them (what travels, in
      which direction)
    → an EXECUTION TRACE for an algorithm — variable
      state at each step (the values, not code lines)

  Use **PSEUDOCODE** for the logic — plain-English
  control flow, concrete variable names, one operation
  per line, annotated. Pseudocode, not real code: the
  repo's actual code (and any line references) belongs
  in Block 5, not here.

```
  Layers-and-hops — label every hop between bands

  ┌─ Client ─────┐  hop 1: GET /data        ┌─ Edge ──────┐
  │  browser     │ ───────────────────────► │  CDN / LB   │
  └──────────────┘  hop 4: 200 + body ◄───── └──────┬──────┘
                                               hop 2 │ miss
                                                     ▼
                                            ┌─ Service ────┐
                                            │  handler     │
                                            └──────┬───────┘
                                              hop 3│ query
                                                   ▼
                                            ┌─ Storage ────┐
                                            │  database    │
                                            └──────────────┘
```

  #### Move 2 variant — the load-bearing skeleton

  When the concept has an irreducible *kernel* — a
  loop, a traversal, a protocol exchange, a single
  data-structure operation — run Move 2 as a
  load-bearing-skeleton walkthrough instead of a flat
  list of parts. Three steps:

  1. **Isolate the kernel.** Show the smallest
     pseudocode or shape that is still the pattern —
     nothing removed it can survive losing. The thing
     the reader should reconstruct from memory.

       BFS:          frontier queue + visited set +
                     dequeue → expand → enqueue +
                     termination (frontier empty)
       Rate limiter: counter + window + allow/deny
                     decision + window reset

  2. **Name each part by what BREAKS when it is
     missing — not by definition.** "Drop BFS's visited
     set and it revisits nodes and never terminates on a
     cyclic graph." What-breaks-if-removed is how the
     reader learns which parts are load-bearing and
     which are incidental.

  3. **Separate skeleton from optional hardening.** The
     kernel is the minimum that makes it the pattern;
     retry/backoff, observability, path compression,
     caching are hardening layered on top. Saying which
     is which is itself the lesson.

  The interview payoff: naming a load-bearing part
  people routinely forget — BFS's empty-frontier
  termination, a rate limiter's reset, an agent loop's
  hard iteration budget — signals you built the thing,
  not just read about it.

  This variant is a tool, not a mandatory move. Skip it
  for concepts that genuinely are co-equal independent
  parts with no central kernel.

  #### Move 2.5 — current state vs future state (when applicable)

  When the concept is built-but-not-active, planned, or
  in-migration, add a Phase A / Phase B sub-section with
  a side-by-side comparison diagram: what's true now,
  what's planned and why it's gated, what the migration
  costs. The takeaway is often *what doesn't have to
  change.* Skip when the concept is fully shipped.

  #### Move 3 — the principle

  End with the takeaway that generalises beyond this
  codebase — the underlying principle the concept
  exemplifies, not a summary of what was just said.

═════════════════════════════════════════════════
BLOCK 4 — PRIMARY DIAGRAM
═════════════════════════════════════════════════

The full recap visual after the mechanics — one frame
showing everything Move 2 walked through, with every
box, every arrow, and every architectural layer
labelled. The visual the reader returns to.

═════════════════════════════════════════════════
BLOCK 5 — IMPLEMENTATION IN CODEBASE
═════════════════════════════════════════════════

Where the pattern lives in the actual repo. Two parts:

  **Use cases.** The concrete scenarios in THIS codebase
  where the pattern is reached for — what triggers it,
  what it solves here, when it runs. Real, specific to
  the repo, not abstract restatement of the concept.

  **Code side by side, with a line-by-line read.** Show
  the actual repo code beside an explanation of what
  each part is doing — annotate the specific lines: what
  this line does, why it's there, what would break
  without it. Never drop a code block raw and move on;
  the explanation rides alongside the code. Always name
  the exact file path, function name, and line range.

```
  app/api/limit.ts  (lines 12–24)

  const key = `rl:${userId}`;        ← one bucket per user
  const n = await redis.incr(key);   ← atomic count this window
  if (n === 1)                       ← first hit in the window…
    await redis.expire(key, 60);     ← …starts the 60s reset timer
  if (n > LIMIT)                     ← over budget?
    return deny();                   ← reject without touching work
  return allow();
       │
       └─ the expire on first-hit IS the window reset; without
          it the counter never resets and the user is locked out
          permanently after the first burst (load-bearing)
```

═════════════════════════════════════════════════
BLOCK 6 — ELABORATE
═════════════════════════════════════════════════

Deeper context: where this pattern comes from, what
problem it was invented to solve, how it connects to
adjacent concepts, what to read next.

═════════════════════════════════════════════════
BLOCK 7 — PROJECT EXERCISES   (AI / ML sections only)
═════════════════════════════════════════════════

Curriculum Build items mapped to this file's concept
IDs. One `###` subsection per exercise; six labelled
bullets: Exercise ID / What to build / Why it earns its
place / Files to touch / Done when / Estimated effort.
Generated only for sections with a curriculum
dependency; omitted elsewhere.

═════════════════════════════════════════════════
BLOCK 8 — INTERVIEW DEFENSE
═════════════════════════════════════════════════

Questions, model answers with a diagram per answer (the
visual you sketch while you speak), and a one-line
anchor per answer. Surface the load-bearing skeleton
part here when the concept has a kernel — naming the
part people forget is the strongest signal.

═════════════════════════════════════════════════
BLOCK 9 — VALIDATE
═════════════════════════════════════════════════

Four levels: reconstruct → explain → apply to a
scenario → defend the decision. Every level references
real file paths and line numbers from the codebase.

═════════════════════════════════════════════════
BLOCK 10 — SEE ALSO
═════════════════════════════════════════════════

Links to related files in this guide.

═════════════════════════════════════════════════
DIAGRAM RULES — apply to every diagram
═════════════════════════════════════════════════

Use box-drawing characters, never ASCII approximations:
─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ → ← ↑ ↓ ◀ ▶ ▲ ▼

Every diagram must:
  → have a title line above it
  → sit inside a fenced code block
  → label every box and every arrow that carries info
  → label every architectural layer it spans (UI /
    Service / Storage / Network boundary / Provider).
    A diagram that crosses a boundary without naming it
    hides the most important thing it could show.
  → show direction of data flow explicitly
  → be readable without the surrounding prose
  → be wrapped in prose: one sentence before, one after.
  → no Mermaid, no images.

Types of diagram, by situation:

  Pattern           the shape of a pattern or algorithm —
                    the loop, the traversal frontier, the
                    topology, the kernel skeleton (How it
                    works Move 1)
  Flow              sequences — request flows, auth chains,
                    data pipelines, top to bottom
  Layer             architecture — each layer as a band,
                    the bigger-picture orientation (Block 2)
  Layers-and-hops   crossing layers/services — the bands
                    plus every hop between them labelled
                    (what travels, which direction)
  Execution trace   algorithms — variable state at every
                    step, not just before/after
  Comparison        before vs after, with vs without,
                    Phase A vs Phase B, side by side
  Sequence          actors exchanging messages over time
  Entity            data models — tables, fields, relations
  Tree              hierarchies — component/nesting trees
  State             transitions — UI states, job statuses
  Inline annotation pointing at parts of a code snippet,
                    naming what each piece does (Block 5)

═════════════════════════════════════════════════
PSEUDOCODE RULES
═════════════════════════════════════════════════

Use pseudocode when showing algorithm logic without
language noise, explaining a pattern before real code,
or when the concept is language-agnostic.

Style:
  → plain English for control flow: "for each", "if",
    "return"
  → concrete variable names, not x and y
  → one operation per line
  → annotate any non-obvious line with // comments
  → show input and output explicitly

Real code is the last tool reached for — used only when
the actual syntax matters (a specific hook, an
async/await error path). When real code appears, it is
always annotated (Block 5), never dropped raw.

═════════════════════════════════════════════════
HARD RULES
═════════════════════════════════════════════════

  → Zoom out before zoom in. No concept file opens on a
    detail. Block 2's layers diagram comes first.
  → No definition-first openings. Start with the
    shape/scenario, end with the term.
  → Diagrams at every move. Block 2 gets a layers
    diagram; How it works Move 1 gets a pattern diagram;
    every Move 2 sub-section gets at least one mechanism
    diagram. A prose-only mechanism walkthrough is
    incomplete.
  → How it works carries no code line references. It
    teaches the pattern with skeleton parts, pattern
    diagrams, pseudocode, step-by-step, and
    layers-and-hops diagrams — never real code, file
    paths, or line numbers. Real code and its line
    references live only in Implementation in codebase
    (Block 5).
  → Bridge from what the reader knows in every Move 2
    sub-section. No bridge = the work isn't done.
  → Every abstract claim is followed by a concrete
    consequence. "This is secure" is banned; "if the
    client sends X, the database returns Y" is required.
  → Name the real terms; don't dance around them.
  → Length scales with complexity, not a paragraph cap.
  → Code is shown side by side with a line-by-line read,
    never dropped raw.
  → Conversational register throughout; no hedging,
    marketing language, apologetic tradeoff naming, or
    slow on-ramps (see teacher.md).
  → Physical-world analogies are not the primary anchor;
    reach for software primitives first.
  → No project names except the codebase being studied;
    every file path and use case is about that repo only.
