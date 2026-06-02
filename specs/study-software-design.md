# Study — Software Design (A Philosophy of Software Design, applied)
## the `/aipe:study-software-design` command

A study-family generator that audits the **current repo** through the
design primitives in John Ousterhout's *A Philosophy of Software Design* —
deep modules, information hiding, complexity, layering, readability — and
produces a per-concept guide grounded in your real files: where the code
honors each principle, where it violates it, and the specific move to fix
it.

This is a topic generator like `study-agent-architecture.md` and
`study-ai-engineering.md`. It reads `format.md` for structure, `teacher.md`
for voice, `me.md` for the reader, and the codebase for evidence. It does
not restate the concept-file template or the persona — it inherits them.

```
  /aipe:study-software-design        → create or update the guide
  output: .aipe/study-software-design/
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition (no overlap)
═════════════════════════════════════════════════

This spec is code-level design quality. It does not touch system
architecture, and it is not the book reader.

```
  read-aposd.md            LEARN the primitives (book style,
                           abstract). The framework itself.
  study-software-design.md APPLY the primitives to THIS repo.   ← here
                           Findings, grounded in real files.
  study-system-design.md     SYSTEM architecture. A different altitude
                             (services, boundaries, scaling), not module/
                             interface-level design.
  study-dsa-foundations.md    reusable algorithm and data-structure curriculum.
```

  → A concept here teaches the primitive briefly, then spends its
    weight on the codebase findings. For the full conceptual
    treatment of a primitive, it cross-references the matching
    `read-aposd` chapter rather than re-teaching it. Inherit,
    don't restate.
  → If both `study-software-design/` and `study-system-design/`
    seem to want the same finding, the rule is altitude: module/
    interface/complexity → here; service/architecture → system-design;
    reusable algorithm teaching → dsa-foundations.

═════════════════════════════════════════════════
WHAT THIS SPEC DOES NOT REDEFINE
═════════════════════════════════════════════════

Read these from their source files; do not restate them here.

  → The per-concept-file template (Subtitle, Zoom out → zoom in,
    Structure pass, How it works, primary diagram, Implementation
    in codebase, Elaborate, Project exercises, Interview defense,
    Validate, See also). Lives in `format.md`.
  → The Zoom-out block, the Structure-pass block (layers · axes ·
    seams), How-it-works's moves, the diagram rules, the hard
    rules. All `format.md`.
  → The persona. `teacher.md`, teacher posture — same staff
    engineer. This book is general software design: that engineer's
    home turf. Inherit the banned list and the verdict-first /
    rank-what-matters trait.
  → Reader calibration. `me.md`.

This spec defines only: the **topic** (which primitives are
concepts), how to **anchor findings to the codebase**, and the
**honest-assessment** rules below.

═════════════════════════════════════════════════
COPYRIGHT — HARD RULE
═════════════════════════════════════════════════

  → Teach the ideas in original words; never reproduce the book's
    prose. Quote a defined term only (a red flag's name), under
    ~15 words, and only when naming it; paraphrase everything else.
  → The value here is the findings about YOUR code, which are
    original by construction. Keep the conceptual lead-in short and
    point to the `read-aposd` chapter for depth.
  → Every README notes the book as the source and recommends
    reading it.

═════════════════════════════════════════════════
THE TOPIC — primitives as codebase-evaluated concepts
═════════════════════════════════════════════════

Each concept below becomes one concept file, built on the full
`format.md` template. The "How it works" block teaches the
principle in general (briefly); the **"Implementation in codebase"
block is the heavy one** — it is the audit: real files, real
line ranges, deep vs shallow examples, the red flag firing or not,
and the fix.

```
  1. complexity-in-this-codebase
       the diagnostic overview. Locate the three symptoms in real
       files: where a single change amplifies across many files,
       where cognitive load spikes (the module nobody wants to
       touch), where the unknown-unknowns hide. This is the
       zoom-out for the whole guide.
       findings: name the 2–3 highest-complexity hotspots by path.

  2. deep-vs-shallow-modules
       inventory modules by depth (functionality ÷ interface size).
       Name the deepest module (best — big behaviour, small
       surface) and the shallowest (worst — interface nearly as
       complex as the body; classitis).
       red flag: shallow module, classitis.
       findings: file:line for the best and worst; the fix for the
       worst (what to fold in / hide).

  3. information-hiding-and-leakage
       find decisions that leak — a fact known in two modules that
       forces them to change together; temporal decomposition;
       config that exposes internals.
       red flag: information leakage; same knowledge edited twice.
       findings: name each leak as a seam where knowledge crosses
       that shouldn't, with both file locations.

  4. layers-and-abstractions
       find pass-through methods and pass-through variables;
       adjacent layers offering the same abstraction (a layer not
       earning its place).
       red flag: pass-through method/variable.
       findings: the call chains where a layer just forwards.

  5. pull-complexity-downward
       find knobs/parameters pushed up to callers that the module
       had enough information to decide itself.
       red flag: avoidable config exposed to users.
       findings: each exposed knob + whether the module could own it.

  6. errors-and-special-cases
       find exception handling scattered across call sites and
       special cases a different definition would erase.
       red flag: try/except everywhere; special-case sprawl.
       findings: where errors could be defined out, masked low, or
       aggregated.

  7. readability (names · comments · consistency · obviousness)
       the readability audit, four facets in one concept:
         names        — vague names (data, obj, tmp, manager) where
                        precision would prevent bugs.
         comments     — comments that restate the code; missing
                        interface comments; what only a comment
                        could carry that's absent.
         consistency  — two conventions for one job.
         obviousness  — the "huh?" spots: hidden control flow,
                        untyped generics, surprise.
       red flag: one per facet.
       findings: a short ranked list per facet with file refs.

  8. red-flags-audit
       the capstone. Ousterhout's red flags as a review checklist,
       each marked against this repo: fires / doesn't / N/A, with
       the location and the one-line fix when it fires. This is the
       actionable index the rest of the guide feeds.
       findings: the checklist, sorted by severity for this repo.
```

═════════════════════════════════════════════════
ANCHORING FINDINGS TO THE CODEBASE
═════════════════════════════════════════════════

```
  → Every claim about the code cites a real path and, where it
    helps, a line range. "Shallow module" with no file is an
    opinion; with a path it's a finding.
  → Show the code side by side with the read, per format.md — the
    actual lines, annotated. Never drop a raw block; never invent
    code that isn't in the repo.
  → Rank. Don't flatten. Per the verdict-first trait: name the
    single worst offender for each primitive before the long list.
    A flat catalogue of every minor smell teaches less than "fix
    this one first."
  → Be blunt, then constructive (teacher.md). Name the weak design
    plainly, then name the move — and, when the call was reasonable
    given constraints, say why it was still the right call at the
    time. No apologetic hedging.
```

═════════════════════════════════════════════════
HONEST ASSESSMENT — including when a principle doesn't apply
═════════════════════════════════════════════════

```
  → A small or young codebase won't exercise every primitive. When
    a principle has little to bite on, say so honestly — don't
    manufacture findings. The concept file states "this repo is too
    small / too uniform to show meaningful X yet," then gives a
    buildable target: what to watch for as it grows.
  → Praise is a finding too. Where the code is genuinely deep,
    well-hidden, or consistent, name it with the file — the reader
    learns as much from a good example in their own code as from a
    bad one.
  → Never soften a real problem to be nice, and never invent a
    problem to seem thorough. The audit's credibility is the whole
    product.
```

═════════════════════════════════════════════════
CHECK FOR EXISTING GUIDE — create vs update
═════════════════════════════════════════════════

```
  does .aipe/study-software-design/ exist?
     NO  → CREATE: full audit, every concept file + README index.
     YES → UPDATE: reconcile against the current codebase.
              the findings drift when the code drifts:
                Outdated:  a finding whose file/line moved or whose
                           smell was fixed (mark it resolved)
                Missing:   a new module / leak / pass-through the
                           code grew since last run
                Stale ref: paths / line ranges that moved
                Action:    the specific edit
              edit only the sections that moved; refresh the
              red-flags-audit checklist; append
              "Updated: [date] — …".
```

A repo whose design didn't change since the last run is a no-op —
same contract as the rest of the study family. (Note: like every
study guide, this reconciles against the CODE, not against
`format.md`. A template change does not propagate through UPDATE;
that needs a regenerate.)

═════════════════════════════════════════════════
OUTPUT STRUCTURE
═════════════════════════════════════════════════

```
  .aipe/study-software-design/
    README.md                          map + the through-line
                                       (complexity is the enemy;
                                       deep modules are the weapon)
                                       + book/source note
    01-complexity-in-this-codebase.md
    02-deep-vs-shallow-modules.md
    03-information-hiding-and-leakage.md
    04-layers-and-abstractions.md
    05-pull-complexity-downward.md
    06-errors-and-special-cases.md
    07-readability.md
    08-red-flags-audit.md
```

═════════════════════════════════════════════════
HOW THE RUN EXECUTES — step by step
═════════════════════════════════════════════════

```
  1. Resolve inputs
       read format.md (template + rules), teacher.md (teacher
       posture), me.md (reader), the current repo's codebase.

  2. Detection
       .aipe/study-software-design/ exists? → CREATE or UPDATE.

  3. Audit pass (read-only)
       walk the repo; for each primitive, gather evidence:
       module depths, leaks, pass-throughs, exposed knobs, error
       handling, readability smells. Record path + line range per
       finding. Rank per primitive.

  4. Plan
       CREATE → "will generate README + 8 concept files".
       UPDATE → per-file change list (resolved / new / moved).

  5. Confirm (single gate; skip if non-interactive).

  6. Execute, in concept order
       each concept file on the full format.md template; the
       "Implementation in codebase" block carries the findings;
       Project exercises become refactor tasks ("make this shallow
       module deep"); Interview defense becomes "defend or critique
       this design decision". Then build red-flags-audit from the
       per-concept findings.

  7. Report
       STUDY RUN SUMMARY line + the red-flags-audit location +
       the top 3 fixes ranked across the whole repo.
```

═════════════════════════════════════════════════
SCOPE AND CONSTRAINTS
═════════════════════════════════════════════════

```
  → Per-repo. Every finding, path, and citation is about the
    invoked repo only.
  → Code-level only. Module/interface/complexity/readability.
    System architecture and algorithms belong to
    study-system-design; do not duplicate them here.
  → Findings are grounded. No claim about the code without a real
    file reference. No invented code.
  → Teach briefly, audit heavily. The conceptual depth lives in
    read-aposd; this guide's product is the findings.
  → Original expression. Paraphrase the book; never reproduce it.
  → Inherit structure from format.md and voice from teacher.md.
    Restate neither.
```

═════════════════════════════════════════════════
RUNNING IT INSIDE `/aipe:study` (optional)
═════════════════════════════════════════════════

This generator is wired into `/aipe:study` after `study-system-design` under the shared create/update detection, single confirmation gate, and consolidated summary. It also remains runnable standalone with `/aipe:study-software-design` when only code-level design changed.
