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
INPUT — the career-history file (or project archetype fallback)
═════════════════════════════════════════════════

The spec runs in one of two modes depending on what's available:

```
  BANK mode      career-history.md is present
                 → generate REAL stories from the reader's material

  SCAFFOLD mode  career-history.md is absent
                 → detect the current project's archetype and produce
                   archetype-shaped TEMPLATES the reader fills in
```

  → BANK MODE INPUT

  Career-history file, in this order of preference:

  1. `.aipe/project/career-history.md` (per-repo location)
  2. `~/.config/aipe/global/career-history.md` (global / per-user)

  When the file is present, generate real stories grounded in it.
  The career-history template (used when the user creates it manually):

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

  → SCAFFOLD MODE INPUT

  When no career-history file exists, the spec does NOT stop. Instead
  it scaffolds the per-user career-history.md (so the reader has a
  place to capture real material when they reflect) AND it produces
  archetype-shaped template stories from the current project. The
  scaffold bank is a starting point — the reader's job is to replace
  each template's STAR fields with their real story.

═════════════════════════════════════════════════
SCAFFOLD MODE — archetype-shaped templates
═════════════════════════════════════════════════

When career-history is absent, infer the current project's archetype
and produce 5-7 template stories shaped to the moments that archetype
typically generates. Templates are explicitly NOT interview-ready;
they are prompts that point the reader at the kinds of moments worth
turning into stories.

  → THREE ARCHETYPES

```
  1. HACKATHON       short, time-pressured, demo-driven
                     stories cluster around scope-cutting under time
                     pressure, last-2-hours decisions, broken-demo
                     recovery, pitching to judges

  2. PERSONAL        solo-authored, self-directed, no external pressure
                     stories cluster around inspiration, decision-to-
                     start, why-this-over-alternatives, the
                     almost-gave-up moment, feedback that changed
                     direction

  3. WORK            team-shipped, stakeholder-accountable
                     stories cluster around scope expansion / saying
                     no, peer/stakeholder conflict, influence without
                     authority, technical judgment, failure recovery,
                     mentorship, quantified impact
```

  → ARCHETYPE DETECTION (first match wins; fall back to asking)

  1. Presence of `.aipe/rehearse-hackathon-demo/` → **hackathon**
  2. README / `.aipe/project/context.md` keywords:
       "hackathon" / "48 hours" / "prize" / "demo day" → **hackathon**
       "personal" / "side project" / "for fun" / "portfolio" → **personal**
  3. `.github/PULL_REQUEST_TEMPLATE.md` OR `CODEOWNERS` OR
     multiple distinct git committers → **work**
  4. Single-committer git history with a public-looking remote →
     **personal**
  5. None of the above match → **ask the user which archetype applies**

  → ARCHETYPE TEMPLATE LIBRARIES

  Each scaffold story is one file `01-<slug>.md` through `0N-<slug>.md`
  named after the moment the template points at, not the project.

  **Hackathon library** (typical templates):
    - `scope-cutting-under-time-pressure` — "we wanted X, shipped Y;
       the cut that held the demo"
    - `decision-in-the-last-two-hours` — "the call I made at hour 46"
    - `team-stack-or-scope-conflict` — "we disagreed about X; how we
       landed"
    - `broken-demo-recovery` — "the moment it broke; what I did in
       the next 90 seconds"
    - `the-money-shot-decision` — "what to lead the demo with, and
       why I cut the other thing"
    - `pitching-to-a-skeptical-judge` — "the question that landed
       hardest; my answer"
    - `mission-alignment-48h` — "why this idea was worth coding
       through the night"

  **Personal library** (typical templates):
    - `the-inspiration-moment` — "where the idea came from; what the
       spark was"
    - `decision-to-start` — "what made me open the editor instead
       of just thinking about it"
    - `why-this-over-alternatives` — "the other things I considered
       building; why this one won"
    - `self-imposed-scope-discipline` — "what I cut from my own
       vision; what stayed"
    - `the-almost-gave-up-moment` — "when I nearly stopped; what
       got me back to it"
    - `feedback-that-changed-direction` — "a user / friend /
       reviewer said X; I changed Y"
    - `mission-alignment-personal` — "why this matters to me; what
       it would have cost not to build it"

  **Work library** (typical templates):
    - `scope-expansion-or-saying-no` — "the ask was X; I owned
       (or declined) Y; here's why"
    - `peer-or-stakeholder-conflict` — "we disagreed; the decision
       the team owned"
    - `influence-without-authority` — "the cross-team change I drove;
       how I got buy-in"
    - `technical-judgment-under-uncertainty` — "the call I made with
       incomplete information"
    - `failure-recovery-and-post-mortem` — "the wrong call I owned;
       what I changed about my process"
    - `mentorship` — "the teammate I leveled up; the specific thing
       I taught"
    - `impact-at-scale` — "the quantified outcome; the number that
       holds without footnotes"

  → SCAFFOLD-FILE DISCIPLINE

  Each scaffold file opens with a banner:

  ```
  **STATUS:** scaffold template — not interview-ready

  This is a prompt, not a story. Replace each section below with your
  real material before rehearsing with this story.
  ```

  Followed by the standard STAR template (Situation / Task / Action /
  Result / Reflection / Defense) with each field containing a *prompt*
  rather than fabricated content, plus **3-5 archetype-specific
  reflection questions** to help surface the real moment.

  Example (hackathon, `scope-cutting-under-time-pressure`):

  ```
  ## Reflection prompts
  - At what hour did you realize the original scope wouldn't ship?
  - What did you actually cut, in concrete terms?
  - Who pushed back, and how did you handle it?
  - When the demo ran, what did the cut cost you (or save)?
  - The judge / teammate who would have wanted the cut feature back —
    what would you say to them now?
  ```

  Numbers, quotes, names, and timestamps are NEVER invented in scaffold
  mode. If a field would otherwise hold fabricated content, it holds a
  prompt instead. The reader replaces the prompts with real material as
  they reflect — at which point the file graduates from scaffold to
  real bank entry.

  → RE-RUNNING WITH PARTIAL CAREER HISTORY

  When the reader fills in career-history.md AFTER generating a scaffold
  bank, re-running the spec graduates each filled-in template into BANK
  mode and adds any new real stories the career-history surfaces. Files
  still showing the `STATUS: scaffold template` banner remain templates;
  files with replaced STAR content are treated as real entries.

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
    README.md                             reading order + mode (BANK or SCAFFOLD)
                                          + competency-to-company map
    00-overview.md                        the ten competencies, the coverage matrix
                                          (competencies × companies), and explicit
                                          gaps named honestly. In SCAFFOLD mode,
                                          also names the detected archetype.
    01-<story-slug>.md                    one story per file, 5-12 files total
    02-<story-slug>.md
    ...
    0N-<story-slug>.md
```

`00-overview.md` is the navigation layer: a competency × company matrix showing which stories cover which gaps, the gaps explicitly named, and the recommended rehearsal order for each company's loop. In BANK mode the reader who only opens this file knows which stories to lead with at each interview. In SCAFFOLD mode the overview also names the archetype (`hackathon` / `personal` / `work`), states the bank is template-only, and points the reader at the highest-leverage templates to fill in first.

In BANK mode, each story is a real entry the reader has lived. In SCAFFOLD mode, each story file opens with the `**STATUS:** scaffold template — not interview-ready` banner and contains prompts in place of fabricated content. Re-running after the reader fills in templates graduates them to real entries (banner removed, STAR fields populated with real material).

═════════════════════════════════════════════════
ANCHORING + HONEST ASSESSMENT
═════════════════════════════════════════════════

  → BANK MODE rules (career-history present):

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

  → SCAFFOLD MODE rules (career-history absent — archetype templates):

```
  → Templates carry the STATUS banner explicitly. Every scaffold
    file opens with `**STATUS:** scaffold template — not
    interview-ready`. Removing the banner is the reader's signal
    that they have replaced the prompts with real material.

  → Numbers, names, quotes, and timestamps are NEVER invented to
    fill a template field. If a field would otherwise hold
    fabricated content, it holds a prompt instead. "Insert the
    actual deploy time here" beats "Saturday 3:47 AM" as filler.

  → The archetype is named in `00-overview.md`. The reader who
    opens only the overview should know whether the bank is real
    or scaffolded, and which archetype the scaffolds were drawn
    from (`hackathon` / `personal` / `work`).

  → Templates are tagged by competency too. Even scaffolded files
    carry the same `Competency:` tag the BANK-mode template uses,
    so when the reader fills in real material the coverage matrix
    keeps working without re-tagging.

  → Re-running with partial career-history graduates filled-in
    templates into real entries. Files still showing the banner
    remain scaffolds; files with replaced STAR content are
    treated as real bank entries and counted in the coverage
    matrix as fulfilled rather than gap.
```

═════════════════════════════════════════════════
WHAT THIS SPEC DOES NOT DO
═════════════════════════════════════════════════

  → **Does not fabricate stories.** In BANK mode, if the career-history file is thin, the bank is thin. The honest gap is the prep target, not an invented narrative. In SCAFFOLD mode, templates contain *prompts*, never fabricated numbers / quotes / timestamps — the banner makes their non-interview-ready status explicit so they can never be mistaken for real entries.
  → **Does not run inside `/aipe:rehearse`.** That orchestrator is per-repo. This spec is per-person. The two layers compose; the orchestrator does not own this.
  → **Does not replace mock interviews.** Stories read well silently and fold at minute 4 under a real interviewer. The bank is raw material for reps, not a substitute for them.

═════════════════════════════════════════════════
RUNNING IT STANDALONE
═════════════════════════════════════════════════

`/aipe:rehearse-behavioral-stories` runs standalone, separate from `/aipe:rehearse`. Run it once when starting interview prep, update it as new material accumulates (a shipped project, a resolved conflict, a recovered failure), and reference it alongside each `/aipe:rehearse-interview-defense` book for the project layer. The behavioral bank covers WHO you are as an engineer; the defense book covers what you built on a specific repo. Pair them at every loop.
