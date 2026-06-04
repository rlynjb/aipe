# Rehearse — Behavioral Stories (the `/aipe:rehearse-behavioral-stories` command)

A per-person rehearsal generator that turns the reader's career history into a **STAR story bank** for FAANG-style behavioral interview loops (Anthropic, Meta, Google, similar). Each story is quantified, competency-tagged, and rehearsed in the reader's voice so it survives time pressure and follow-up probing.

Reads `format.md`, `teacher.md` in **coach posture**, `me.md`, and a career-history input file. **Diverges from the rest of the rehearse family in one important way: this spec is per-person, not per-repo.** The bank covers the reader's entire career, not the current codebase. It is therefore runnable standalone, not part of `/aipe:rehearse`'s fan-out.

```
  /aipe:rehearse-behavioral-stories     → create or update
  output: .aipe/rehearse-behavioral-stories/
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition
═════════════════════════════════════════════════

```
  rehearse-problem-selection  WHY this problem deserves investment (per-repo).
  rehearse-design-doc         HOW a technical decision is communicated (per-repo).
  rehearse-hackathon-demo     HOW the resulting value is shown (per-repo).
  rehearse-interview-defense  HOW the project is defended under scrutiny (per-repo).
  rehearse-behavioral-stories WHO the engineer is, told as 8-12 scoped       ← here
                              STAR stories tagged by competency (per-person).
```

A finding belongs here when it is about **the reader as an engineer across their career** — scope expansion, ambiguity navigation, conflict, mentorship, failure recovery, prioritization. Project-defense material (why this architecture, why this tradeoff) belongs to `rehearse-interview-defense`. Single-decision narrative (why we built X over Y on this repo) belongs to `rehearse-problem-selection`. This spec is the **person-level** layer the other rehearse books rest on top of.

═════════════════════════════════════════════════
INPUT — the career-history file
═════════════════════════════════════════════════

The spec reads a career-history file in this order of preference:

  1. `.aipe/project/career-history.md` (per-repo location)
  2. `~/.config/aipe/global/career-history.md` (global / per-user)

If neither exists, **stop and scaffold the per-user version** with a placeholder template:

```markdown
# Career history

Raw material for the behavioral story bank. Be specific.
Names, dates, numbers, the actual decisions. Reps will not save
a vague memory.

## Roles, in reverse chronological order
- <company> <role> <date range> — <one-line scope of what you owned>

## Notable projects (per role)
- <project name> — <one-line outcome, with a number when possible>
  - what was at stake when you started
  - the decision you owned
  - the result, quantified
  - one thing you'd do differently now

## Moments worth a story
Free-form. Anything you've thought "I should remember to tell that
story" about. Bullet points, no structure required.
```

Print `✓ Scaffolded ~/.config/aipe/global/career-history.md. Fill it in, then re-run /aipe:rehearse-behavioral-stories.` and stop. **A behavioral story bank without raw material is a fabrication risk.** Force the user to supply it.

═════════════════════════════════════════════════
PERSONA + READER
═════════════════════════════════════════════════

`teacher.md` in **coach posture** — the staff engineer who has sat on the L4–L5 hiring loop at Google and Meta and conducted 200+ technical interviews. The coach voice does not soften vague stories. *"You said 'we improved performance' — by what number, in what units, at what cost?"* is the coach's default response to handwaving.

Reader calibration from `me.md`. The bank is yours; the coach is sharpening your delivery, not writing your career.

═════════════════════════════════════════════════
THE COMPETENCIES — what FAANG behavioral rounds actually probe
═════════════════════════════════════════════════

Senior-bar behavioral loops at Anthropic, Meta, and Google probe these ten competencies. Each story is tagged with one **primary** competency and optionally one or two secondary tags.

```
  1. scope-expansion              took on more than the original ask;
                                  named the gap and owned the solution
  2. ambiguity-navigation         handled unclear scope, conflicting
                                  requirements, or missing information
  3. peer-conflict-resolution     disagreed with an engineer or peer
                                  and reached a decision the team owned
  4. stakeholder-pushback         declined, redirected, or renegotiated
                                  scope with PM / business / customer
  5. influence-without-authority  drove a cross-team change or mentored
                                  someone outside your reporting line
  6. technical-judgment           made a call under uncertainty; named
                                  the alternative rejected and why
  7. prioritization-and-saying-no protected what matters by cutting;
                                  named what you did NOT build
  8. failure-recovery             owned a wrong call, named the cost,
                                  named what you changed (non-negotiable
                                  at senior bar — must have one)
  9. impact-at-scale              shipped a measurable outcome; the
                                  number lands without footnotes
 10. mission-alignment            chose this work over alternatives;
                                  the why holds under "why not X" probing
                                  (Anthropic-weighted; safety-adjacent
                                  is a plus)
```

**Senior bar non-negotiable:** the bank must include at least one `failure-recovery` story. An engineer who cannot name a wrong call from their career either has not been operating at senior scope or has not reflected on it. Both read as a yellow flag.

═════════════════════════════════════════════════
THE STORY TEMPLATE — STAR + defense block
═════════════════════════════════════════════════

Each story is one file, `01-<kebab-case-title>.md` through `0N-…`. The template:

```
# Story: <kebab-case title that names the moment, not the company>

**Competency:** <primary>
**Also probes:** <secondary tags or "—">
**Lands at:** Anthropic | Meta | Google | all
**Project / context:** <repo, team, or "personal">
**Cross-link:** [defense doc path if the story is about a repo that
                 has a rehearse-interview-defense book]

## Situation     (1-2 sentences)
What was happening. Real timestamps when known. No throat-clearing.

## Task          (1-2 sentences)
The specific responsibility or decision YOU owned. First person
singular. Not "we" without naming the team and what specifically
was yours.

## Action        (3-6 sentences)
What you actually did, in order. Verbs. Specific decisions, with
the alternatives you considered and rejected named inline. Do not
narrate the team's work; narrate yours.

## Result        (2-3 sentences)
Quantified outcome. Numbers in real units. If a number is not
available, say so plainly — never invent a metric to make the story
sound bigger.

## What I'd do differently / what I learned   (1-2 sentences)
Senior-bar non-negotiable. The reflection that turns a war story
into a credible one.

## Defense — likely follow-ups
The two or three probes the story invites, with the answer you'd
give in the room. Do not script verbatim; capture the bones.
  - Q: <probe>
    A: <answer, no hedging, in your voice>
  - Q: <probe>
    A: <answer>
```

═════════════════════════════════════════════════
OUTPUT
═════════════════════════════════════════════════

```
  .aipe/rehearse-behavioral-stories/
    README.md                             reading order + competency-to-company map
    00-overview.md                        the ten competencies, the coverage matrix
                                          (competencies × companies), and explicit
                                          gaps named honestly
    01-<story-slug>.md                    one story per file, 8-12 files total
    02-<story-slug>.md
    ...
    0N-<story-slug>.md
```

`00-overview.md` is the navigation layer: a competency × company matrix showing which stories cover which gaps, the gaps explicitly named, and the recommended rehearsal order for each company's loop. The reader who only opens this file knows which stories to lead with at each interview.

═════════════════════════════════════════════════
ANCHORING + HONEST ASSESSMENT
═════════════════════════════════════════════════

```
  → Numbers must be real. If the result is "I think we improved
    latency by maybe half," the story is not done — the coach
    sends it back. A vague story is a fabrication risk; vague
    stories collapse under follow-up.

  → Verbs must be first-person. "We launched it" is a team
    sentence. "I owned the migration plan, ran the rollout, and
    held the rollback decision" is a story sentence. The coach
    rewrites we-sentences into I-sentences.

  → The failure-recovery story is non-negotiable. If the career
    history file does not surface one, the spec emits
    `gap — no failure-recovery story available; this is the
    highest-leverage prep target.` Do not fabricate to fill it.

  → Mission-alignment is asymmetric. Anthropic weighs it heavily
    (safety, alignment, why this work matters); Meta and Google
    weigh it less. A reader with a mission-alignment story has
    an Anthropic-shaped story to lead with.

  → Stories cross-link to project defense books. When a story is
    about a project that has a `.aipe/rehearse-interview-defense/`
    book, the story's Cross-link field points at it, so the
    behavioral story and the project defense compose.

  → On UPDATE, reconcile against the current career-history file:
    add new stories when the reader's career grows new material,
    update existing stories when reflection sharpens them, remove
    stories that no longer represent the reader's current voice
    or current scope.
```

═════════════════════════════════════════════════
WHAT THIS SPEC DOES NOT DO
═════════════════════════════════════════════════

  → **Does not fabricate stories.** If the career-history file is thin, the bank is thin. The honest gap is the prep target, not an invented narrative.
  → **Does not run inside `/aipe:rehearse`.** That orchestrator is per-repo. This spec is per-person. The two layers compose; the orchestrator does not own this.
  → **Does not replace mock interviews.** Stories read well silently and fold at minute 4 under a real interviewer. The bank is raw material for reps, not a substitute for them.

═════════════════════════════════════════════════
RUNNING IT STANDALONE
═════════════════════════════════════════════════

`/aipe:rehearse-behavioral-stories` runs standalone, separate from `/aipe:rehearse`. Run it once when starting interview prep, update it as new material accumulates (a shipped project, a resolved conflict, a recovered failure), and reference it alongside each `/aipe:rehearse-interview-defense` book for the project layer. The behavioral bank covers WHO you are as an engineer; the defense book covers what you built on a specific repo. Pair them at every loop.
