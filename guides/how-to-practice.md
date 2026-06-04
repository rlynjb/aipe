# How to practice — turning study material into reps

A weekly routine for senior interview prep that survives a full-time job. Companion to `how-to-study.md`: that file is about reading the material the study system produces; this file is about turning material into reps you actually do.

The routine below is **depth-driven, not frequency-driven** — three full-cycle reps per week, calibrated to your learning style (visual-first, question-driven, project-anchored) and your reality (day job, finite energy, no desire to burn out).

---

## The philosophy

The naive way to design interview prep is frequency-first: lots of small reps, daily, build the muscle through repetition. That works for grinding LeetCode rankings. It does not work for senior interviews.

**Senior interviews test full cycles, not isolated slices.** A real DSA interview is not "code in 25 minutes." It's frame the problem → ask clarifying questions → sketch on a whiteboard → walk through it out loud → handle pushback → code it → talk through trade-offs → handle the follow-up. The interview *is* the full cycle, every time.

This file is built around that. Each weekly rep is a complete mini-interview — five angles on one problem, one architecture, one story. That's deeper consolidation than five problems each done once. For your learning style specifically, **one-deep beats five-shallow**.

The four pieces:

| Rep | What it is | What it produces |
|---|---|---|
| **DSA** | Full-cycle problem (~60-90 min) | Coded solution + 5-line lessons note |
| **System design** | Full-cycle architecture (~60-90 min) | Sketch + pushback-points note |
| **Behavioral** | Full STAR cycle (~30-60 min) | Written 150-300 word answer |
| **Project block** | Uninterrupted building (3-4 hours) | One shipped feature, refactor, or improvement |

Plus a 15-20 minute Sunday review that holds the whole thing together.

---

## The weekly structure

```
Mon: DSA rep
Wed: System design rep
Fri: Behavioral rep
Sat/Sun: project block OR rest
Sun evening: 15-20 min review
```

Three weekday reps, one weekend block (or rest), one short review. **Total: ~4-5 hours most weeks, ~7-8 hours on project weekends.**

Days are defaults, not contracts. If Tuesday's a better DSA day this week, swap it. The contract is *3 weekday reps + 1 weekend choice happen each week*. Which days they land on can flex. The Sunday review reconciles.

### Why these days specifically

- **Monday DSA** — start of week, fresh brain. DSA needs cognitive clarity more than the other reps.
- **Wednesday system design** — mid-week, deeper block. Tuesday absorbs Monday; Thursday absorbs Wednesday.
- **Friday behavioral** — end of week, lower cognitive load, going into the weekend already in reflective mode. The Friday behavioral lands right before the project block (if it's that weekend), priming the build session.

---

## The full-cycle rep — what each rep contains

Every weekday rep follows the same five-stage cycle. The point of the cycle is to hit the problem from multiple angles in one sitting, the same way a real interview will.

```
   1. FRAME       what is this problem really asking?
                  what's the load-bearing constraint?
                  what would I clarify if this were an interview?
                       │
                       ▼
   2. SOLVE       work through the solution
                  (code it, sketch it, write it — depending on rep type)
                       │
                       ▼
   3. WHITEBOARD  redraw the solution as you'd present it
                  diagrams, structure, naming
                       │
                       ▼
   4. SPEAK       walk through it out loud
                  voice memo or video, full explanation
                       │
                       ▼
   5. CAPTURE     write a small artifact
                  what you learned, where you got stuck,
                  what an interviewer would push back on
```

The cycle takes 60-90 minutes for DSA and system design, 30-60 for behavioral. Each stage is its own angle on the same content — that's the whole point. You leave the rep having seen the material from five different sides, not having read it five times.

Don't shortcut the speak stage. It's the angle that surfaces what you don't actually understand. If you can't explain it out loud, you don't understand it yet — and that's the signal to loop back to stages 1-3 before moving on.

---

## DSA rep — Monday (60-90 min)

Pick one problem that exercises the pattern your `.aipe/study-dsa-foundations/` covers for that week's project (see "The project orbit" below).

The cycle:

1. **Frame** — read the problem twice. What's it asking? What clarifying questions would you ask in an interview? Write them down. (~5 min)
2. **Solve** — code it. Struggle is the work. Don't look up solutions. If you get stuck for more than 20 minutes on the same step, take a hint, but write down where the hint was needed. (~30-50 min)
3. **Whiteboard** — once you have a working solution, redraw the data structures and algorithm flow as you'd draw them on a real whiteboard. Boxes, arrows, indices. (~10 min)
4. **Speak** — record yourself walking through your solution. Include trade-offs, time/space complexity, edge cases. (~10 min)
5. **Capture** — write a 5-line lessons note to `.aipe/dsa-log/<week>.md`:
   - Pattern recognized
   - Where I got stuck
   - What made the breakthrough
   - One follow-up problem an interviewer might ask
   - What I'd revisit

Listen to the recording on Tuesday's commute. If you hedged or stumbled, that's a marker for next week's rep.

---

## System design rep — Wednesday (60-90 min)

Two modes, alternate week to week:

**Mode A — Architecture from the project orbit.** Pick an architecture pattern from your `.aipe/study-system-design/` outputs for that week's project. Sketch the architecture as if explaining it cold to a new senior engineer.

**Mode B — Cold prompt.** Pick a system design prompt (IK list, or a standard list — "design a URL shortener," "design a chat app," "design a rate limiter"). Sketch it from zero. No looking up references.

Either mode, the cycle:

1. **Frame** — what are the constraints? What scale matters? What's the load-bearing tradeoff? Write them down. (~10 min)
2. **Solve** — sketch the architecture on paper or a notes app. Components, connections, data flow, where state lives. Be specific about technologies *only where they matter for the tradeoff*. (~30 min)
3. **Whiteboard** — refine the sketch into the diagram you'd actually draw on a whiteboard. Cleaner boxes, named components, explicit data flow. (~10 min)
4. **Speak** — record yourself walking through the system. Why each component, what fails first at 10x, what you'd change at 100x. (~15 min)
5. **Capture** — write a pushback-points note to `.aipe/sysdesign-log/<week>.md`:
   - What would a senior interviewer push back on?
   - What's the weakest link in this design?
   - What's the next decision you'd make if scale doubled?
   - What did Mode A teach that Mode B couldn't (or vice versa)?

The pushback-points note is the most valuable artifact in your interview prep over time. After 12 weeks of system design reps, you'll have ~12 designs each with a list of weaknesses you've already thought about. *That's what makes you defensible in real interviews.*

---

## Behavioral rep — Friday (30-60 min)

One STAR-format question per week. Anchor it to that week's project when possible — "tell me about a technical decision you made on [project]" lands harder than a generic prompt.

The cycle:

1. **Frame** — what is the interviewer really probing? Conflict handling? Technical judgment? Ownership under ambiguity? Name the probe. (~5 min)
2. **Solve** — write the answer. 150-300 words. STAR structure (Situation, Task, Action, Result), but written as natural prose, not bullet points. (~15-25 min)
3. **Whiteboard** — this stage is light for behavioral. Just re-read what you wrote and edit for compression. Cut anything that isn't doing work. (~5 min)
4. **Speak** — read it out loud once. Note where the words feel awkward — those are the spots that'll trip you in an interview. (~5 min)
5. **Capture** — save the file to `.aipe/behavioral/<question-name>.md`. The file itself is the artifact.

After 12 weeks: ~12 written stories, each rehearsed once. Re-read the library once a month. Under interview pressure, the stories will compress into the right answer because you wrote them once cleanly.

---

## The project orbit — one project per week, three reps that point at it

This is the highest-leverage move in the lighter schedule, and it's what makes 3 reps/week compete with 10 reps/week of unaligned work.

**Each week, pick one project as the orbit center.** All three weekday reps point at it:

- **Monday DSA** — a problem that exercises a pattern your project uses
- **Wednesday system design** — an architecture from the project's `.aipe/study-system-design/`
- **Friday behavioral** — a question about that same project

By Sunday, you've coded a relevant pattern, sketched the architecture, and written a story about a decision you made on it. The project is now defensible in interview form from three angles.

Pick the project in Sunday review. Rotate weekly across your two active projects (see "Portfolio strategy" below). A 12-week prep window with weekly rotation means each active project gets ~6 deep weeks of interview-shaped exercise.

**A worked example** — say week 3's orbit is AdvntrCue (a RAG project):

| Day | Rep | Anchored to |
|---|---|---|
| Mon | DSA: implement HNSW-style nearest neighbor search | The vector retrieval AdvntrCue does |
| Wed | System design: design a RAG pipeline at 10x query volume | AdvntrCue's actual architecture |
| Fri | Behavioral: "tell me about a technical tradeoff you made" | The pgvector-vs-Pinecone decision |

By Sunday, AdvntrCue is interview-ready across DSA, system design, and behavioral dimensions. Different week, different project, same shape.

---

## Sunday review — 15-20 min

The lightest rep, and the one that holds the others together.

1. **Audit the week.** Did all three reps happen? If not, what got in the way? Write down what broke and why. The Sunday review is the only place where missed reps get examined, not punished.
2. **Pick next week's orbit.** Which of your two active projects is this week's center?
3. **Pick next week's three sources.**
   - DSA pattern (the category, not the specific problem)
   - System design topic (architecture pattern or cold prompt — alternate week to week)
   - Behavioral question (anchored to the orbit project when possible)
4. **Pick the weekend.** Project block or rest?
5. **Read this week's artifacts.** Re-read the 3 written notes/files from this week. Anything to flag for repeat practice? Anything that feels unresolved?

20 minutes. Without it, the week starts adrift and Monday becomes "what should I do today" instead of "today is DSA on AdvntrCue."

---

## The weekend — project block OR rest

One of two things happens each weekend. Never both.

### Project block (3-4 hours)

One long block on Saturday OR Sunday. The other day is rest.

The work is **building**, not studying. Refining an existing project, adding a new feature, shipping something new. The constraint: **one project, one focused block, until something ships.** Don't switch projects mid-block.

The trap to avoid: using the project block to *also* study. The study reps elsewhere in the week feed the project, not the other way around. If you find yourself "studying" during the project block because the project feels too hard, that's a signal to ask Claude a question, not to abandon building for reading.

### Rest (the whole weekend)

Rest means: **no `.aipe/` folders open, no LeetCode, no system design videos, no reading interview blogs.** Doing something that isn't interview prep. Going outside, seeing people, cooking something, playing a game.

The *purpose* of the rest week is to prevent burnout and let the prior week consolidate. The *practice* of rest is being explicit that nothing prep-related happens. **Rest weeks are not "weeks I failed to study."** They are part of the plan.

### The project / rest cadence — Pattern A or Pattern B

Two cadences to consider:

**Pattern A — strict alternation.** Project, rest, project, rest. Every other weekend ships. Sustainable indefinitely.

```
W1: project | W2: rest | W3: project | W4: rest | ...
```

**Pattern B — 2-and-1.** Two project weekends in a row, then one rest weekend. You ship every ~3 weeks instead of every ~4.

```
W1: project | W2: project | W3: rest | W4: project | W5: project | W6: rest | ...
```

I'd lean toward **Pattern B** initially. Two consecutive project weekends lets momentum build — Saturday Week 1 sets up Saturday Week 2, and you can ship something meaningful instead of just incrementing. The rest weekend lands after enough work has happened to actually benefit from recovery.

If you find yourself exhausted on the second project weekend, drop back to Pattern A. Better to ship less and stay sane than to grind and burn out.

---

## Two principles to enforce

### Protect the project block from study creep

Senior interviewers care about what you've shipped *recently* more than what you can recite. A 3-hour weekend block that ships a refactor is worth more than 9 hours of study spread across the week. The discipline is defending that block from *"but I should review system design before the interview..."* impulses. The study reps already happen elsewhere. **The project block is the one place where you're a builder, not a student.**

### Track adherence, not output

At the end of each week, the question isn't *"did I learn enough?"* It's *"did I do the three reps I committed to?"* Adherence is a leading indicator; output (interview readiness) is a lagging one that you can't measure week-to-week anyway. **If you adhere for 10-12 weeks straight, you will be interview-ready.**

A simple weekly check in your Sunday review:

```
This week:
  Monday DSA           [ ]
  Wednesday system     [ ]
  Friday behavioral    [ ]
  Weekend choice       [ ]   (project / rest)
  Sunday review        [ ]
```

Boxes ticked is the metric. Not how much you "learned."

---

## The downshift mode — for hard weeks

Some weeks won't even hold three reps. Work crunch, illness, family stuff, low energy. **The plan needs a survival mode that preserves the streak.**

When life intervenes, keep only:

- **One DSA rep** (any day that works, 30-60 min — shorter than usual is fine)
- **Sunday review** (10 min minimum — even if it's just "this week was hard")

That's ~1 hour for the whole week. Sustainable in any week. It preserves muscle memory and prevents the full collapse where you stop opening the `.aipe/` folder altogether.

**The mistake to avoid:** "this week was bad, I'll catch up next week by doubling." You won't. The streak repairs by *returning to baseline*, not by overcompensating. A 4-week downshifted stretch is fine. Two grinding weeks to "catch up" is how you burn out before interviews.

---

## Cold-start mitigation

The risk in low-frequency plans is *cold starts*. If you do DSA only once a week, the first 15-20 minutes of Monday's rep is re-warming the pattern recognition you had last Monday. The actual learning happens in the back of the session. The front is tax.

Two ways to mitigate, both light:

### Keep a running pattern list

In Sunday review, append to `.aipe/dsa-log/patterns-seen.md`:

```
- two-pointer (W1, easy)
- sliding-window (W2, mid — got stuck on shrink condition)
- BFS-level-order (W3, easy)
- topological-sort (W4, hard — needed hint)
- ...
```

Before Monday's rep, glance at the list. 30 seconds of priming reduces cold-start tax substantially. By month 2, the list itself is interview prep — you can scan it before an interview and recall the patterns you've worked.

### Accept the tax for now

It's real but not fatal. Two to three months of weekly DSA reps is enough to build pattern fluency, even with cold starts. By month 2 the tax shrinks because patterns repeat and the list primes you faster.

**Do not add an extra DSA rep just to combat cold starts.** The whole point of this schedule is sustainability. A second weekly DSA rep would compromise that.

---

## Portfolio strategy — pick two active projects

You have several projects across the portfolio (dryrun, buffr, contrl, aipe, AdvntrCue, blooming_insights). The temptation will be to rotate through all of them. **Don't.**

**Pick two projects to be active during the interview window:**

- **Primary defense** — the project you'll talk about most. Probably AdvntrCue or blooming_insights (richest AI surface, most depth in your interview defense book).
- **Wild card** — the project that shows breadth. Probably contrl (on-device ML, different shape from the primary).

The other projects stay dormant during the interview window. **No new features, no refactors.** They remain buildable but unbuilt. After interviews land, you can rotate which two are active.

The orbit rotation alternates: Week 1 primary, Week 2 wild card, Week 3 primary, and so on. Each active project gets ~6 deep weeks across a 12-week prep window. **Depth on two beats breadth on five every time.**

---

## The destination shape — when (and if) you upgrade

The schedule above is calibrated to start with. If after 6-8 weeks the routine is fully automatic and you have surplus energy, you can layer in more frequency:

```
Optional upgrade — daily DSA (after 6-8 weeks of holding the lighter schedule)
══════════════════════════════════════════════════════════════════════════════

Mon: DSA rep (full cycle, ~60-90 min)                ← unchanged
Tue: DSA mini-rep (~25 min, one problem, code only)  ← new
Wed: System design rep (full cycle)                  ← unchanged
Thu: DSA mini-rep (~25 min)                          ← new
Fri: Behavioral rep (full cycle)                     ← unchanged
Sat/Sun: project block OR rest
Sun: review
```

The mini-reps are slices (just stage 2 of the full cycle — code the problem and move on). They build frequency without competing with the deep weekly cycles. Total week: ~6-7 hours instead of ~4-5.

**Conditions to consider this upgrade:**

1. The lighter schedule has held for 6+ consecutive weeks without skipping (excluding planned rest weekends)
2. You're not feeling drained on Friday evenings
3. Cold-start tax on Monday DSA is still painful after 6 weeks

If any of those don't hold, stay on the lighter schedule. **The depth-driven shape is not a stepping stone to the frequency-driven shape.** It's a complete, sustainable plan in its own right. The upgrade exists only for people who have surplus energy and want it.

A reasonable senior engineer can land senior interviews on the lighter schedule alone. Many do.

---

## The meta-point

You built a study system calibrated to your learning style. The routine above is the execution system calibrated the same way:

- **Visual-first** → whiteboard stages, voice memos, hand-drawn architectures
- **Question-driven** → the frame stage of every cycle, the pushback-points artifact
- **Multiple-angles** → five-stage full cycles, three reps orbiting one project
- **Project-anchored** → orbit mechanic, defended project block
- **Sustainable** → ~4-5 hours/week base, downshift mode, planned rest weekends

If a different routine works better in practice, that's signal — **adjust toward what holds, not what looks rigorous**. The plan you actually execute beats the plan you abandon.

---

## Quick reference — the weekly loop

```
   ┌──────────────────────────────────────────┐
   │  SUNDAY REVIEW (15-20 min)               │
   │  - audit last week's adherence           │
   │  - pick next week's orbit project        │
   │  - pick next week's 3 sources            │
   │  - pick next weekend (project or rest)   │
   │  - re-read this week's artifacts         │
   └──────────────────┬───────────────────────┘
                      │
                      ▼
   ┌──────────────────────────────────────────┐
   │  MONDAY — DSA REP (60-90 min)            │
   │  full cycle: frame → solve → whiteboard  │
   │            → speak → capture             │
   │  → 5-line lessons note                   │
   └──────────────────┬───────────────────────┘
                      │
                      ▼
   ┌──────────────────────────────────────────┐
   │  WEDNESDAY — SYSTEM DESIGN REP (60-90)   │
   │  Mode A (orbit) or Mode B (cold prompt)  │
   │  → pushback-points note                  │
   └──────────────────┬───────────────────────┘
                      │
                      ▼
   ┌──────────────────────────────────────────┐
   │  FRIDAY — BEHAVIORAL REP (30-60 min)     │
   │  full cycle: frame → write → speak       │
   │  → 150-300 word answer saved             │
   └──────────────────┬───────────────────────┘
                      │
                      ▼
   ┌──────────────────────────────────────────┐
   │  WEEKEND — project block OR rest         │
   │  Pattern B: 2 projects → 1 rest          │
   │  one project, one block, until ships     │
   └──────────────────┬───────────────────────┘
                      │
                      ▼
              loop back to Sunday review
```

---

## Companion files

- `me.md` — who you are; the cognitive style this routine is calibrated to
- `how-to-study.md` — how to read material the spec system produces (input side)
- `how-to-practice.md` — this file; how to turn material into reps (output side)

Read together:
- `me.md` tells you what shape of work suits your thinking
- `how-to-study.md` is what to do *with* one concept file in your hands
- `how-to-practice.md` is *when* to open one and which other reps surround it across a week
