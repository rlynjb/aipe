---
description: Hackathon demo book for this codebase — overview + 6 chapters in coach voice, hard time budget, choreographed live demo with money shot
argument-hint: <optional slot length, e.g. "5 min">
---

The user invoked `/aipe:study-hackathon-demo` with optional slot length: `$ARGUMENTS`.

This command produces a hackathon demo book for the current repo at the fixed path `.aipe/study-hackathon-demo/`. It is the third performance-oriented sibling alongside `/aipe:study-interview-defense` — that one helps you *defend* the work to an interviewer; this one helps you *show* the work to a room watching a clock. Coach posture, hard time discipline, choreographed live demo as the centerpiece.

The slot length defaults to **10 minutes** when `$ARGUMENTS` is empty. If supplied, treat the argument as the real number of minutes and scale every time budget proportionally — but keep the demo's share largest and keep the money shot inside the first third of the slot.

**Per-repo scope.** This spec runs against one codebase at a time — the repo where the command was invoked. The book demos only what the codebase *actually does* on a path that actually runs (see the no-vaporware constraint).

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does NOT exist in the current working directory:

1. Create `.aipe/project/` and `.aipe/specs/` directories.
2. Write `.aipe/project/context.md` with this placeholder body:

   ```
   # Project context

   Describe this codebase so an AI agent can implement against it without asking.

   ## Stack
   - runtime, framework, language

   ## Data model
   - entities, relationships, where they live

   ## File structure
   - top-level folders and what lives where

   ## What must not change
   - public API surface, schema fields, ...
   ```

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-hackathon-demo.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)

Per-repo scope: do NOT load context files from other repos.

## Step 3 — Load the template chain

Hackathon demo reads four files in order — structure, writer persona, reader calibration, then the spec itself:

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-hackathon-demo.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the shared concept-file rules across the whole study family: formatting (kebab-case file names, no Mermaid/no images, box-drawing diagram chars), diagram quality, the "use real software, not analogies" rule, the no-hedging rule, the hard rules. This spec uses its own per-chapter book template (defined inline in `study-hackathon-demo.md`), but the *quality standards* come from format.md.
- **`teacher.md`** — the base writer persona (the staff engineer with 12 years' experience). This spec shifts that persona to **coach posture** with a demo-coach framing layered on top: same engineer, watched a hundred hackathon demos win and lose, optimizes for the clock and the room.
- **`me.md`** — reader-side calibration: voice (first person, present tense, directly speakable in all SAY tracks and script lines), reader portfolios (ground the build story / under-the-hood / Q&A in what the reader has actually shipped), and the visual-first cognitive shape.
- **`study-hackathon-demo.md`** — the book shape (overview plus six chapters), the time discipline, the six visual treatments, the per-chapter template, and the demo-specific constraints (no vaporware, money shot inside the first third, every on-screen beat has an IF-IT-BREAKS backup).

## Step 4 — Detect existing book → branch CREATE or UPDATE

Check whether `.aipe/study-hackathon-demo/` already contains the book. The signal is the presence of `00-overview.md` at the root OR any file matching `0[1-6]-*.md`.

- **Existing book found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing book** → go to CREATE MODE (Step 5C onward).

(The directory may exist as an empty placeholder; that's not the same as having a book already.)

---

# CREATE MODE

Runs only when no existing book is found.

## Step 5C — Set the slot length and time budgets

If `$ARGUMENTS` is empty, use the default 10-minute slot. Otherwise parse the argument as a number of minutes (e.g. `5`, `3 min`, `7m`) and use that.

Scale the default budget proportionally to the actual slot:

```
Default 10-minute split:
  01 — Cold open + one-liner          1:00
  02 — The demo (centerpiece)         5:00   ← money shot lands by 3:00
  03 — Under the hood                 2:00
  04 — The build story                0:45
  05 — The close + the ask            0:45
                                     ─────
                                      9:30  (+ 0:30 buffer = 10:00)
  06 — The Q&A                       prep only, runs after the clock
```

When scaling: **the demo has a floor; everything else has a ceiling.** Cut from under-the-hood, build story, and close first when the slot is tight. **Never cut the demo below the point where the room sees the thing actually work.** The money shot always lands inside the first third of the slot.

Record the per-chapter time budgets — they drive every chapter's time-budget bar visual.

## Step 6C — Identify per-chapter content from the codebase

For each chapter, identify the content that's specific to this codebase, anchored to what actually runs:

- **01 — The cold open** — the hook (open on the thing working or the problem that stings, NOT a title slide or self-intro) and the one-liner ("X is a Y that does Z for W"). Pull the strongest single value from what the codebase actually does.
- **02 — The demo** — the centerpiece. A choreographed click-path through the running app, anchored to what the codebase actually does: the screen sequence, what to say at each step (value, not narration), the designated **money shot** (the single moment the room goes "oh"). Includes the demo-failure recovery (the backup for when the live build won't cooperate).
- **03 — Under the hood** — the one impressive or non-obvious mechanism in the codebase (real-time sync, on-device model, agent loop, …), kept demo-shallow. One diagram, three sentences. **Go exactly one level deep and stop.**
- **04 — The build story** — what *actually shipped* in the hackathon window, the one hard part that got cracked. Anchored to real features, real commits, the genuine obstacle and the solution. Own the rough edges honestly rather than hide them.
- **05 — The close** — vision + ask + last line. Where it goes next (clearly framed as future, never demoed as if it exists), what you want from the room, the one sentence you want repeated.
- **06 — The Q&A** — prep for the standard probes ("Is this actually working?", "What was the hard part?", "What's the stack?", "Did you build this during the hackathon?", "Is there a business here?"). Each gets a crisp, honest, speakable answer anchored to the codebase, plus a decision tree for likely follow-ups. **Runs after the timed slot — never eats the budget.**

## Step 7C — Plan the book

The non-negotiables — inherited from `format.md`, `teacher.md`, `me.md`, and this spec:

1. **Coach voice throughout.** Address the reader as "you." The book is a conversation between the staff-engineer demo-coach and the presenter, not a third-person narration. The coach is direct, opinionated, and writes choreography ("don't open with the problem slide; open with the thing working") not options.
2. **The slot ceiling is hard.** Every chapter carries a time budget; the budgets sum to the slot with a buffer. The book never plans to use the full slot to the second — it plans to finish early with breathing room.
3. **The demo is the centerpiece and gets the largest budget.** The money shot is named explicitly and scheduled inside the first third of the slot. Never bury it past the halfway mark.
4. **Every chapter opens with its time-budget bar.** Drawn as an ASCII timeline showing where this beat sits in the slot and how long it owns. The reader always knows where they are against the clock.
5. **Every on-screen beat is choreographed as a SAY / SHOW pair** — a two-column table separating what's on screen from what comes out of your mouth. Narrating the clicks ("now I click here") is the failure mode this prevents.
6. **Every chapter with an on-screen beat has at least one IF-IT-BREAKS recovery box** — double-line border (`╔ ╗ ╚ ╝ ═ ║`) so the eye finds it under stress. Names the backup: recorded clip, screenshots, the exact line to say while narrating from memory. **A demo with no backup plan is off-spec.**
7. **Every chapter names its "tighten it" cut** — the beat to drop when running long, and the floor it must not cut below. The demo's floor is "the room sees it work."
8. **No vaporware.** The book demos only what the codebase actually does on a path that actually runs. Features that don't work or don't exist go in the close as clearly-framed "what's next" — never shown as if they exist. If a planned money shot depends on an unbuilt feature, pick a different money shot from what is built.
9. **Own the rough edges, don't hide them.** Hackathon builds are rough; the build-story and Q&A chapters teach the reader to name rough edges with the confidence of someone who shipped under a clock — not to pretend the build is production-grade.
10. **All spoken script lines are written in the reader's voice** — first person, present tense, directly speakable. Third-person prose ("the developer then shows…") is banned in SAY tracks and script lines.
11. **All claims grounded in the codebase must be verifiable.** Features, stack, file references in under-the-hood and build-story must match the repo. If a beat requires a claim the agent can't verify, drop the beat rather than fabricate.
12. **The book has exactly an overview plus six chapters (00-overview plus 01–06).** Do not add chapters. Do not collapse chapters. The chapter list is the contract.
13. **The Q&A chapter (06) is prep only** — runs after the timed slot, never eats the budget. Always generated.
14. **Banned marketing language across the whole book**: "scalable solution," "robust architecture," "leveraging," "cutting-edge," "best-in-class," "state-of-the-art," "industry-leading," "revolutionary," "game-changing," "seamless." These collapse on contact with a real room.
15. **Hedging banned (inherited).** "We might show…" is weaker than "we show…". Pick one.
16. **AI-assistance honesty in the Q&A.** Judges in 2026 assume heavy AI use; defensiveness reads worse than candor. The Q&A teaches matter-of-fact ownership of what the tools did and what the reader did.

## Step 8C — Create the directory and generate the book

Create:

```bash
mkdir -p .aipe/study-hackathon-demo
```

Generate 7 files (flat — no subdirectories) in chapter order so each builds on the previous:

```
00-overview.md             the run-of-show: the whole slot on one timeline
01-the-cold-open.md        first 60 seconds — hook + one-liner
02-the-demo.md             the live walkthrough, the centerpiece, the money shot
03-under-the-hood.md       the one impressive technical thing, kept demo-shallow
04-the-build-story.md      what you actually shipped + the hard part you cracked
05-the-close.md            the vision, the ask, the last line they remember
06-the-qa.md               judge questions + crisp answers (prep, post-clock)
```

Each chapter file follows the per-chapter template from `study-hackathon-demo.md`: `# Chapter N — [title] ([start]–[end], [duration])` → time-budget bar → opening hook (direct address, names the chapter's job in the run-of-show) → the chapter-opening diagram (15–30 lines: click-path for the demo, attention curve for the cold open, architecture for under-the-hood, etc.) → the body (SAY/SHOW tables, beats in presentation order, script lines as pull quotes) → at least one IF-IT-BREAKS recovery box for any on-screen beat → the "tighten it" cut → the one-page run sheet the reader holds while presenting.

`00-overview.md` is the run-of-show: the whole slot on one timeline, every chapter's time budget visualized, the money shot scheduled by name, a reading-order recommendation (rehearse front-to-back at least twice; on demo day skim the run sheets at the back of each chapter).

## Step 9C — Report + stop

Print exactly:

```
✓ Hackathon demo book created at .aipe/study-hackathon-demo/
  Slot length:      <N> minutes
  Money shot lands: by <T> (first third)
  00-overview.md
  01-the-cold-open.md
  02-the-demo.md
  03-under-the-hood.md
  04-the-build-story.md
  05-the-close.md
  06-the-qa.md
```

Then a 3–5 sentence summary: the slot length, the money shot (one phrase — what the room actually sees in that moment), the single demo failure most likely to happen and which IF-IT-BREAKS box covers it, and one line on the rough edge the build-story chapter teaches the reader to own.

**Stop. Wait for the user's next instruction.** They'll typically rehearse the demo, ask for tightening, or adjust the slot. Do NOT auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing book. Goal: re-derive demoable content from the current code without rewriting beats whose underlying feature still works. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing book

Walk `.aipe/study-hackathon-demo/` and read `00-overview.md` plus `01-the-cold-open.md` through `06-the-qa.md`.

## Step 6U — Diff against the current codebase AND the loaded templates

Three diff sources to check per chapter:

- **Codebase drift** — features in the demo that no longer work, file/function names that changed, stack details that have shifted, the money shot's feature being removed or moved.
- **Template drift** — a chapter missing one of the six visual treatments (time-budget bar, chapter-opening diagram, SAY/SHOW table, script line pull quote, IF-IT-BREAKS recovery box, strong-vs-weak side-by-side), or missing its "tighten it" cut.
- **Time drift** — the user supplied a new slot length in `$ARGUMENTS` that differs from the existing book's budget. Re-scale every chapter's time budget proportionally.

Output a structured change plan grouped by chapter.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Leave timing and choreography intact where the underlying feature still works. Maintain coach voice and the reader's-voice convention for script lines. Append a changelog entry at the bottom of each updated chapter:

```
---
Updated: <today's ISO date> — <one-line summary of what changed and why>
```

Do NOT regenerate unchanged chapters. Do NOT add or collapse chapters — the 6-chapter list is the contract. Do NOT fabricate demos for unbuilt features — drop the beat instead.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-hackathon-demo/
─────────────────────────────────────────────────
Chapters updated:     <list>
Chapters unchanged:   <count or list>
Slot length:          <N> minutes  [unchanged | rescaled from <M>]
```

**Stop. Wait for the user's next instruction.**
