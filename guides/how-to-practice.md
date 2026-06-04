# How to practice — turning study material into reps

A weekly routine for senior interview prep that survives a full-time job. Companion to `how-to-study.md`: that file is about reading the material the study system produces; this file is about turning material into reps you actually do.

The routine below assumes ~10 hours per week and a 2-3 month interview horizon. It is calibrated specifically for your learning style (visual-first, question-driven, project-anchored) and your reality (day job, weekend deep work).

---

## The core insight

The three pillars of senior interview prep — DSA, system design, behavioral — have very different shapes of practice. They reward very different time blocks. **Treating them as interchangeable study slots is the failure mode.**

| Pillar | Rewards | Hurt by |
|---|---|---|
| **DSA** | Short, frequent, high-friction practice (~25 min daily) | Long sessions, skipped days |
| **System design** | Medium blocks of question-driven exploration (45-90 min, 2-3× per week) | Splitting into 15-min chunks, daily grind |
| **Behavioral** | Low-frequency, high-quality writing + rehearsal (~30 min weekly) | Last-minute cramming, no story bank |
| **Project work** | Uninterrupted long blocks (3-4+ hours, weekend only) | 1-hour weekday chunks |

A naive "30 minutes of X every morning" schedule ignores these shape differences. You end up doing DSA when you should be doing system design (because DSA fits any block) and skipping behavioral entirely (because it never feels urgent).

**The schedule below matches the shapes.** Each rep has a defined source (something from your `.aipe/` outputs) and a defined produced artifact (something you can point at).

---

## The weekly structure

### Daily reps — Monday through Friday — 45 min total

Two micro-reps that survive workday fatigue. **Total: 45 min/day on weekdays. No daily reps on weekends.**

#### Morning rep — DSA, 25 minutes

Before work or during commute. One problem from your IK curriculum or LeetCode. **Code it, even if you've seen it before.** Don't read solutions; struggle is the work. If you don't finish in 25 minutes, write down where you got stuck and move on.

- **Source:** IK problem set or LeetCode (pattern picked in Sunday review)
- **Produced:** coded solution + a note on where you got stuck
- **Why morning:** DSA needs a fresh brain. Pattern recognition and recursive reasoning don't survive workday fatigue.

#### Evening rep — One concept file, 20 minutes

Open one file from `.aipe/study-<topic>/`. Wave 1 (visual scan) the diagrams. Then run the three diagnostic questions from `how-to-study.md` Tip 4:

1. Can I name three other use cases the spec didn't mention?
2. Where else in my codebases is this pattern hiding?
3. What would I lose if I stripped this out?

If you can answer all three, you're done — move on. If you can't, open Claude in a fresh chat and pull on threads until you can.

- **Source:** one file from a `.aipe/study-<topic>/` folder (folder picked in Sunday review)
- **Produced:** answers to the three diagnostic questions
- **Why evening:** reading + questioning survives evening fatigue better than coding.

#### Why 25 + 20, not 30 + 30

The smaller window makes the streak easier to maintain. Missing one day in a 30+30 plan feels like falling off; missing one day in a 25+20 plan feels recoverable. **You're playing for adherence, not throughput.**

---

### System design nights — Mon/Wed/Fri — 60 min each

Three weeknights, after dinner. One hour each. The work alternates between two activities — pick one per night, alternating across the three sessions.

#### Activity A — chapter walkthrough

Pick one chapter from your interview defense book for your strongest project. Read it. Then close it and **record yourself walking through it on your phone**. Listen to the recording on tomorrow's commute. If you stumbled or hedged, you have a marker for what to revisit.

- **Source:** one chapter from `.aipe/study-interview-defense/`
- **Produced:** voice memo (kept; review on commute)

#### Activity B — system design from cold

Pick a system design prompt (from IK or a standard list). Sketch the whole architecture on paper or notes app — 30 minutes. Then for the remaining 30 minutes, compare your sketch against either an existing concept file from your study outputs (for similar patterns) or against Claude (ask *"I designed X this way — what would a senior interviewer push back on?"*). **Do not look up solutions; let the gaps in your design be the lesson.**

- **Source:** one system design prompt
- **Produced:** hand-drawn architecture + a list of pushback points to address

#### The alternation

```
Mon: A (chapter walkthrough)
Wed: B (cold design)
Fri: A (chapter walkthrough)

next week:
Mon: B
Wed: A
Fri: B
```

Always a B before each weekend — going into the project block with system design pressure fresh.

---

### Saturday — Behavioral rep, 30 minutes

This is the one most people skip. **Don't.** Behavioral interviews are where senior candidates lose offers they otherwise would have gotten.

Pick one prompt from a STAR-format question list (`"tell me about a time you disagreed with your manager,"` `"tell me about a project that failed,"` `"tell me about a technical decision you regretted"`). Write the answer in your notes app — actually write it, don't just think through it. Aim for **~150-300 words**. Read it out loud once. Mark it as drafted.

- **Source:** one STAR-format prompt
- **Produced:** one written answer in `.aipe/behavioral/<prompt-name>.md`

Build a library of these — ~30 questions covered over the interview prep window. Re-read the library once a month. You're building a story bank, not memorizing scripts; under interview pressure the stories will compress into the right answer if you've written them once.

---

### Weekend — Project block, 3-4 hours

One weekend day, one long block. **The other weekend day is rest — for real.**

Three things compete for this block:
- Refining an existing project
- Adding a new feature
- Shipping something new

You don't have to pick one for the whole interview window — rotate based on what's most interesting that week. The constraint is: **one project, one focused block, until something ships.** Don't switch projects mid-block.

**The trap to avoid:** using the project block to *also* study. The whole point of the project block is that it's *building*, not consuming. The study reps elsewhere in the week feed the project, not the other way around. If you find yourself "studying" during the project block because the project feels too hard, that's a signal to ask Claude a question, not to abandon building for reading.

- **Source:** one of your active projects (see Portfolio strategy below)
- **Produced:** one shipped feature, refactor, or visible improvement

---

### Sunday evening — Review and reset, 20 minutes

The lightest rep, but the one that holds the others together.

- Look at the past week's study artifacts. Did the streak hold? If not, what got in the way?
- Pick the DSA pattern for next week — five problems, one per weekday. Not specific problems, just the pattern (e.g. "binary search variants" or "graph traversal").
- Pick the concept file source for next week. Point at one folder in `.aipe/study-<topic>/` and commit to working through it.
- Pick the project goal for next weekend. One concrete deliverable, sized to fit one block.
- Update your cross-reference matrix (`how-to-study.md` Tip 7) with anything new from the week.

20 minutes. This is the cheapest rep and the one that makes everything else work. **Without it, the week starts adrift and the daily reps degrade into "whatever I open first."**

---

## The weekly map

```
            Mon     Tue     Wed     Thu     Fri     Sat     Sun
          ───────  ─────  ───────  ─────  ───────  ────────  ─────────
  morning   DSA     DSA     DSA     DSA     DSA      —         —
  evening   file    file    file    file    file     —         —
  night     A        —       B        —       A      —         —
  block      —       —       —       —       —    project ⟷ rest
  rest       —       —       —       —       —     rest ⟷ project
  review     —       —       —       —       —      —         20 min
```

Saturday and Sunday: pick one for the project block, the other is rest. Behavioral goes on the project-block day (it's 30 min, doesn't disrupt the long block) or the rest day (treat as gentle return-to-work).

---

## The rep-to-source mapping

This is the lookup when you sit down and need to know what to open:

| Rep | What you open | What you produce |
|---|---|---|
| Morning DSA | IK problem set / LeetCode (pattern from Sun review) | Coded solution + stuck-points note |
| Evening concept | One file from `.aipe/study-<topic>/` (folder from Sun review) | Three diagnostic question answers |
| Mon/Wed/Fri System design | Interview defense chapter OR cold prompt | Voice memo OR hand-drawn system |
| Saturday Behavioral | One STAR question | 150-300 word answer in `.aipe/behavioral/` |
| Weekend Project | One active project | One shipped feature or refinement |
| Sunday Review | Past week's artifacts | A plan for next week |

You don't have to decide what to study each day. The Sunday review picks the sources; the daily reps just open what's queued.

---

## Two principles to enforce

### Protect the project block from study creep

Senior interviewers care about what you've shipped *recently* more than what you can recite. **A 3-hour weekend block that ships a refactor is worth more than 9 hours of study spread across the week.** The discipline is to defend that block from *"but I should review system design before the interview..."* impulses. The study reps already happen elsewhere. The project block is the one place where you're a builder, not a student.

### Track adherence, not output

At the end of each week, the question to ask isn't *"did I learn enough?"* It's *"did I do the reps I committed to?"* Adherence is a leading indicator. Output (interview readiness) is a lagging indicator that you can't measure week-to-week anyway. **If you adhere for 8 weeks straight, you will be interview-ready regardless of whether each individual rep "felt productive."**

A simple weekly check (in your Sunday review):

```
This week:
  morning DSA      [ ][ ][ ][ ][ ]   5 reps committed
  evening concept  [ ][ ][ ][ ][ ]   5 reps committed
  system design    [ ][ ][ ]         3 reps committed
  behavioral       [ ]               1 rep committed
  project block    [ ]               1 rep committed
  review           [ ]               1 rep committed
```

Boxes ticked is the metric. Not how much you learned.

---

## The downshift mode — for bad weeks

Some weeks won't have 10 hours. Work crunch, family stuff, illness, low energy. **The plan needs a survival mode that preserves the streak without pretending nothing changed.**

When life intervenes, keep only:

- Morning DSA (25 min weekdays)
- Sunday review (20 min)

That's 45 minutes a week. Sustainable in any week. It preserves the muscle memory. The plan returns to full strength when life does.

**The mistake to avoid:** "this week was bad, I'll catch up next week by doubling." You won't. The streak repairs by *returning to baseline*, not by overcompensating. A 4-week stretch of downshifted weeks is fine. Two 60-hour weeks to "catch up" is how you burn out before interviews.

---

## Portfolio strategy — pick two active projects

You have ~5 projects across the portfolio (dryrun, buffr, contrl, aipe, AdvntrCue, possibly blooming_insights). The temptation will be to rotate through all of them during prep. **Don't.**

**Pick two projects to be active during the interview window:**

- **Primary defense** — the project you'll talk about most in interviews. Probably AdvntrCue or blooming_insights (richest AI surface, most depth in the interview defense book).
- **Wild card** — the project that shows breadth. Probably contrl (on-device ML angle, different shape from the primary).

The other three projects are dormant during the interview window. **No new features, no refactors.** They stay buildable but unbuilt. After interviews land, you can rotate which two are active.

During the prep window, depth on two beats breadth on five every time. The project block defends only these two. The interview defense books prioritize only these two.

---

## The startup sequence — don't start with everything

The schedule above is what the routine looks like at full strength. **Do not try to start there.** Most study plans die because all the reps fight for willpower at once.

Build in layers, one week at a time:

| Week | Add | Total time/wk |
|---|---|---|
| 1 | Morning DSA + Sunday review | ~2.5 hrs |
| 2 | Add evening concept rep | ~4.5 hrs |
| 3 | Add system design Mon/Wed/Fri | ~7.5 hrs |
| 4 | Add behavioral Saturday | ~8 hrs |
| 5+ | Add project block | ~11 hrs |

By week 5, all reps are in place. The early reps are habitual by then and don't fight for willpower with the newer ones.

**If a layer doesn't hold for two consecutive weeks, don't add the next one.** The plan exists to be executed, not admired.

---

## The meta-point

You built a study system that produces material calibrated to your learning style. The routine above is the execution system calibrated the same way:

- **Visual-first** → voice memos for system design (audio of you walking diagrams), hand-drawn architectures
- **Question-driven** → three diagnostic questions in every evening concept rep
- **Project-anchored** → defended project block, study reps feed the project
- **Working-engineer reality** → 10-hour week, downshift mode, weekend recovery

If a different routine works better for you in practice, that's signal — **adjust toward what holds, not what looks rigorous**. The plan you actually execute beats the plan you abandon.

---

## Quick reference — the weekly loop

```
   ┌─────────────────────────────────────────┐
   │  SUNDAY REVIEW (20 min)                 │
   │  - audit last week's adherence          │
   │  - pick next week's DSA pattern         │
   │  - pick next week's concept folder      │
   │  - pick next week's project goal        │
   │  - update cross-reference matrix        │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
   ┌─────────────────────────────────────────┐
   │  WEEKDAY DAILY REPS (45 min/day × 5)    │
   │  morning: DSA problem (25 min)          │
   │  evening: one concept file (20 min)     │
   │           + three diagnostic questions  │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
   ┌─────────────────────────────────────────┐
   │  SYSTEM DESIGN NIGHTS (60 min × 3)      │
   │  Mon / Wed / Fri after dinner           │
   │  alternate: chapter walkthrough         │
   │             ⟷ cold design               │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
   ┌─────────────────────────────────────────┐
   │  WEEKEND                                │
   │  Sat OR Sun: project block (3-4 hrs)    │
   │  the other day: rest (real rest)        │
   │  somewhere: behavioral STAR (30 min)    │
   └──────────────────┬──────────────────────┘
                      │
                      ▼
              loop back to Sunday review
```

---

## Companion files

- `me.md` — who you are; the cognitive style this routine is calibrated to
- `how-to-study.md` — how to read the material the spec system produces (the input side)
- `how-to-practice.md` — this file (the output side)

Read together: `how-to-study.md` is what to do *with* one concept file. `how-to-practice.md` is *when* to open one and which other reps surround it.
