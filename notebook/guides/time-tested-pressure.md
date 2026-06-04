# Time-Pressure Interview Exercises

Paired exercises for the FAANG-bar interview loop. Each exercise works **both surfaces** at once (technical content + narrative coherence) because real interviews probe them together, not separately.

**Verdict:** time pressure exposes two failure modes simultaneously — freezing on technical content + losing narrative coherence on soft. Practice them together or they collapse together.

═════════════════════════════════════════════════
DAILY REPS (10-30 min) — build the muscle
═════════════════════════════════════════════════

```
  60-second STAR delivery       pick a story from your behavioral
                                bank, time yourself, record audio.
                                Listen back the same day.

  45-min LeetCode (1/day)       narrate aloud as you solve. Not
                                silent solving — talk the whole time.
                                The verbal track is what fails in
                                real interviews, not the code.

  "explain in 90 seconds"       after solving any problem (LeetCode,
                                a real bug at work, anything), pitch
                                the solution to a wall in 90 seconds.
                                Verdict first, then reasoning.

  whiteboard problem (1/wk)     no IDE; pen on paper. Simulates
                                Google's actual whiteboard rounds and
                                forces you to think in structures,
                                not auto-complete.
```

═════════════════════════════════════════════════
WEEKLY MOCKS (60+ min) — simulate the real loop
═════════════════════════════════════════════════

```
  Mock coding interview         peer + screenshare, verbal narration
  with peer                     throughout, hands on keyboard the
                                whole time. The peer ASKS questions
                                while you code, not after.

  45-min system design solo     pick a prompt; 5 min clarifying
                                aloud, 30 min designing aloud, 10
                                min answering your own follow-ups.
                                Record audio; review the next day.

  Rapid-fire behavioral         peer asks 5 STAR questions in 15 min;
                                each gets a 2-min answer cap. Forces
                                story selection under pressure —
                                the "which story for this Q" muscle.

  Hostile follow-up drill       give a story; partner pushes back
                                HARD on every weakness ("but why not
                                X?", "you said 'we' — what was
                                actually yours?", "what would you do
                                differently?"). Recover in real time;
                                no re-takes.
```

═════════════════════════════════════════════════
CROSS-CUTTING EXERCISES — highest leverage
═════════════════════════════════════════════════

These train both surfaces simultaneously. Spend the most time here.

```
  Project walkthrough + Q&A     5 min present + 10 min Q&A on your
                                strongest AIPE'd project. Source: your
                                rehearse-interview-defense book; the
                                rep is the DELIVERY, not the writing.

  Onboarding pitch (90 sec)     "Tell me about yourself." Your
                                FE → AI pivot in 90 seconds. Anthropic
                                asks this in the first 3 min of every
                                loop. Lead with the arc, not the
                                resume.

  "Why not X?" reps             partner picks a real decision from
                                your rehearse-problem-selection
                                brief; asks "Why didn't you do X
                                instead?" 5 times in 10 min. The
                                rejected-alternative muscle is the
                                senior-bar discriminator.

  Take-home time-box            Anthropic-shaped. 4-hour cap on a
  (Anthropic-specific)          real decision; ship the design doc;
                                get a peer to red-team it the next
                                day. Don't extend the timer.

  Constraint shift              same system design at 10x then 100x
                                in fixed time. Trains the "what
                                changes at scale" reflexes that DDIA
                                content shows up as.
```

═════════════════════════════════════════════════
USE YOUR AIPE ARTIFACTS AS EXERCISE MATERIAL
═════════════════════════════════════════════════

The writing is the easy half; the rep is the rep. Every AIPE artifact you've generated is exercise source material:

```
  /aipe:rehearse-behavioral-stories  →  STAR delivery drills
                                         (60-second cap; record)
  /aipe:rehearse-interview-defense   →  project walkthrough + Q&A
                                         (5 min + 10 min)
  /aipe:rehearse-problem-selection   →  "why not X?" reps
                                         (10 min, 5 alternatives)
  /aipe:rehearse-design-doc          →  take-home time-box material
                                         (4 hours, then red-team)
  /aipe:study-system-design audit    →  pitch the architecture in 90s
  /aipe:study-ai-engineering audit   →  pitch the AI surface in 90s
  /aipe:drill war stories            →  failure-recovery STAR reps
                                         (the one non-negotiable
                                         senior story)
  /aipe:recon TRACK queue            →  the gap names what to drill;
                                         the rep is acting on it
```

If you skip the rep, the artifact is just nice prose. The artifact is the script; the exercise is the performance.

═════════════════════════════════════════════════
THE SINGLE MOST UNDERVALUED EXERCISE
═════════════════════════════════════════════════

**Bounded uncertainty under time.**

Most senior candidates lose points not by being wrong but by handwaving when probed. Have a peer ask intentionally vague or out-of-your-depth questions ("how would Postgres handle this at 50k QPS?", "what's the threading model in V8 here?", "what does Anthropic's RSP actually require at AGI-4?") and practice answering:

```
  "I don't know specifically, but the shape would be…"
  "That's an assumption I haven't tested — the failure mode
   would be…"
  "I'd reach for X here based on first principles, but I'd
   verify Y before shipping."
  "I haven't worked at that scale — what I'd watch for is…"
```

Bounded uncertainty under time pressure is **the** senior-bar discriminator. Drill it for 10 minutes a week and your behavioral round AND system design follow-ups both get sharper. No other exercise yields more per minute spent.

═════════════════════════════════════════════════
RECOMMENDED CADENCE
═════════════════════════════════════════════════

```
  daily       1× LeetCode (45 min, narrated)
              1× STAR (90 sec, recorded)

  3×/week     1× cross-cutting exercise
              (project walkthrough OR onboarding pitch OR
               "why not X?" reps)

  weekly      1× full 60-min mock with a peer
              1× recording review (watch yourself; brutal)
              1× bounded-uncertainty drill (10 min)

  monthly     1× take-home time-box, red-teamed by a peer
              1× full mock loop (3-4 rounds back-to-back)
```

Six weeks of this with the AIPE artifacts as source material puts you in real shape for the loop. The first two weeks will feel embarrassing on playback; that's the muscle being built.

═════════════════════════════════════════════════
USAGE NOTES
═════════════════════════════════════════════════

  → **Record everything.** Audio is enough for STAR; video for
    project walkthroughs. The playback is brutal but cuts
    iteration time in half. Watch the next day, not immediately.

  → **Verbal narration is the actual skill.** Silent solving on
    LeetCode is the wrong rep. The interview measures your ability
    to think *and talk at the same time* — practice the combo.

  → **Don't extend timers.** The point is the cap. If you'd give
    yourself another 10 minutes in practice, you'll fold at minute
    44 of a 45-minute round. Hold the line.

  → **Mocks beat solo reps past week 2.** Once the muscle exists,
    the social pressure is what trips people up. A peer is the
    minimum-viable substitute for the interview room.

  → **Track what fails.** Keep a 1-liner log of which question
    type tripped you up each week. The pattern is your next drill.
