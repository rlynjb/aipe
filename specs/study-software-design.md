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

> **See also:**
> - `audit-cleanup.md` (Lens 2: Architectural) — overlapping evidence (shallow modules, leaky abstractions, layers that don't earn their place) triaged with fix-now / fix-later / accept verdicts.
> - `audit-software-design.md` — the **action-shaped companion to this spec** (same 8 AOSD lenses; produces per-finding refactor specs at `.aipe/audits/refactors/design-*.md` instead of a teaching artifact). Run this spec to **understand** the design shape; run `audit-software-design` to **act** on the same findings. `/aipe:audit` invokes `audit-software-design` (action); `/aipe:study` invokes this spec (comprehension). Run both when you want both halves.

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
THE TOPIC — audit-style two-pass output
═════════════════════════════════════════════════

**This is an audit-style generator.** It produces output in the
two-pass shape defined in `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — one `audit.md` walking the lens inventory below.
  → Pass 2 — discovered-pattern files, one per significant
    design pattern the repo actually exercises (a single deep
    module worth a deep walk, a leakage seam worth its own file,
    a layering decision that earns a named pattern).

The pattern-discovery rules, file-layout rules, and worked
examples live in `me.md`. Do not restate them here. This spec
defines only the **lens inventory specific to software design**
and the topic-specific calibration for Pass 2 pattern files.

  → THE LENS INVENTORY (for `audit.md`)

  Walk the codebase against this ordered 8-lens inventory. Each
  lens becomes one `##` section in `audit.md`. For each lens:
  name what the codebase actually does (with `file:line`
  grounding) or emit `not yet exercised` honestly. Each lens
  carries the AOSD red flag(s) that fire it. When a finding is
  significant enough to have a dedicated pattern file in Pass 2,
  cross-link to it rather than restating the deep walk.

```
  1. complexity-in-this-codebase
       the diagnostic overview. Locate the three symptoms in real
       files: where a single change amplifies across many files,
       where cognitive load spikes (the module nobody wants to
       touch), where the unknown-unknowns hide. The zoom-out for
       the whole audit.
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
       the readability audit, four facets in one lens:
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
       the capstone lens. Ousterhout's red flags as a review
       checklist, each marked against this repo: fires / doesn't /
       N/A, with the location and the one-line fix when it fires.
       This is the actionable index the rest of `audit.md` feeds.
       findings: the checklist, sorted by severity for this repo.
```

  → WHAT EARNS A PASS 2 PATTERN FILE IN THIS TOPIC

  The general rules in `me.md` apply: the pattern has a name,
  passes the load-bearing test, passes the recognition test. For
  software design specifically, the load-bearing test asks: *"if
  I stripped this design move out, what specifically would the
  module/interface lose?"* Real answers name a concrete property
  (a deep interface that hides N decisions; an abstraction that
  collapses M call sites into one; an error definition that
  removes a class of special cases). A red flag firing in a
  single file is a lens finding; a recurring design *move* the
  repo makes deliberately is a pattern.

  Vague answers ("the code would be uglier") do not earn a file.
  When in doubt, push down to the audit — a pattern file you
  can't fill the Interview defense block for with confidence is
  a signal the pattern isn't load-bearing.

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
     NO  → CREATE: produce audit.md (all 8 lenses) +
              discovered-pattern files + README index.
     YES → UPDATE: follow the rules in `me.md` →
              AUDIT-STYLE GENERATORS → On UPDATE.
              regenerate audit.md against current evidence;
              add pattern files when the codebase grows a new
              design move; update existing pattern files when
              the implementation changes; remove pattern files
              only when the design move is genuinely gone.
              Append "Updated: [date] — …" to changed files.
```

A repo whose design didn't change since the last run is a no-op —
same contract as the rest of the study family. (Note: like every
study guide, this reconciles against the CODE, not against
`format.md`. A template change does not propagate through UPDATE;
that needs a regenerate.)

═════════════════════════════════════════════════
OUTPUT STRUCTURE
═════════════════════════════════════════════════

The two-pass file layout is defined in `me.md` →
AUDIT-STYLE GENERATORS → File layout. For software-design
specifically, the output folder is `.aipe/study-software-design/`.
All files flat at the root, no nested sub-directories.

Files produced:

  → `README.md` — map + the through-line (complexity is the
    enemy; deep modules are the weapon) + book/source note +
    reading order + cross-links (`read-aposd`, `study-system-design`).
  → `audit.md` — Pass 1, the 8-lens audit defined above. Eight
    `##` sections, one per lens. The capstone lens
    (`red-flags-audit`) consolidates the AOSD red-flag checklist.
  → `01-` through `0N-` — Pass 2, the discovered-pattern files.
    Each named after a design move actually exercised by the
    repo (kebab-case), each using the full `format.md` template.
    Typical count: 3-8 files (the `me.md` calibration).

Worked examples (which repos produce which file lists) live
in `me.md` — adapt the system-design worked example to the
software-design altitude (module/interface moves, not service
boundaries).

═════════════════════════════════════════════════
HOW THE RUN EXECUTES — step by step
═════════════════════════════════════════════════

```
  1. Resolve inputs
       read format.md (template + rules), teacher.md (teacher
       posture), me.md (reader + AUDIT-STYLE GENERATORS), the
       current repo's codebase.

  2. Detection
       .aipe/study-software-design/ exists? → CREATE or UPDATE.

  3. Audit pass (read-only)
       walk the repo; for each lens, gather evidence: module
       depths, leaks, pass-throughs, exposed knobs, error
       handling, readability smells. Record path + line range
       per finding. Rank per lens. Separately, discover the
       design moves the repo makes deliberately enough to earn
       Pass 2 pattern files.

  4. Plan
       CREATE → "will generate audit.md + N discovered-pattern
                files (named: …) + README".
       UPDATE → per-file change list (audit.md regenerated;
                pattern files added/updated/removed).

  5. Confirm (single gate; skip if non-interactive).

  6. Execute
       Pass 1: write audit.md — one `##` section per lens, each
       as long as the finding warrants, `not yet exercised`
       named honestly, cross-linking Pass 2 files where the
       deep walk lives. The capstone red-flags-audit lens
       consolidates the AOSD checklist.

       Pass 2: write each discovered-pattern file on the full
       format.md template. The "Implementation in codebase"
       block carries the deep walk; Project exercises become
       refactor tasks ("make this shallow module deep");
       Interview defense becomes "defend or critique this
       design decision".

  7. Report
       STUDY RUN SUMMARY line + the audit.md location + the
       Pass 2 file list + the top 3 fixes ranked across the
       whole repo.
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
