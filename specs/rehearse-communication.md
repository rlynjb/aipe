# rehearse-communication

Drills the one skill underneath every standup, review, and 1:1: turning a
layered observation into a clear sentence in real time. The bottleneck is
not noticing — it is compression. This spec trains the compression.

It is the odd member of the family: every other rehearse generator's
subject is the current repo. This one's subject is you. See *Family
placement* at the end.

---

## Inputs

Reads, in this order:

```
  format.md   structure, diagram rules, the no-analogy rule, the
              no-hedging rule, hard rules. Structure comes from here.
              Do not restate it.
  teacher.md  coach posture. The staff engineer, shifted to prepare you
              for performance under pressure. Same posture the rest of
              the family uses.
  me.md       who is communicating, and where the pause shows up for them.
  the stash   logged raw dumps from recent meetings and events — the
              subject, in place of a codebase.
```

The stash:

```
  present  drills are generated from your real, logged events.
  absent   the spec still emits the framework, the capture habit, and
           synthetic warm-up drills, and tells you to start logging.
           It does not block on an empty stash.
```

---

## Output

Writes to `.aipe/rehearse-communication/`. Create if missing; update in
place if it exists. Coach posture throughout.

Emit an overview plus five parts.

### Overview — the diagnosis

The inputs are already there. The pause is a pipeline run before speaking:

```
  observation -> pattern -> relationship -> context -> interpretation -> speak
```

Most people run `observation -> speak`. You run five layers and then
compress the result to a sentence on the spot. The target is not "notice
more." It is: separate the layers, then sequence them — observation first,
interpretation last.

### Part 1 — The Model

`observe -> pattern -> stakes`. Describe before explain.

```
  DON'T OPEN WITH                 OPEN WITH
  ──────────────────────────────  ──────────────────────────────────────
  the verdict ("X is gatekeeping") the observation, no judgment words
  a feeling ("the meeting was bad")what literally happened
  a conclusion                     the pattern, then why it matters
```

Said in order, the three become one defensible statement: observation
the listener can't argue with, then the interpretation they can.

### Part 2 — The Drill Set

N drills (default 5), generated from the stash — or synthetic if the stash
is empty. Each drill:

```
  RAW       the dump, as logged
  OBSERVE   [ you fill ] facts only, no verdict words
  PATTERN   [ you fill ] one sentence, what this is an instance of
  STAKES    [ you fill ] why it matters
  COMPRESS  [ you fill ] two sentences, said out loud
```

OBSERVE / PATTERN / STAKES / COMPRESS ship blank. The spec does not fill
them. (See *Hard rules*.) Each drill carries one strong-vs-weak example of
a compression — drawn from a *different* situation than the one being
drilled, so the example teaches the move without handing over the answer.

### Part 3 — The Capture Habit

The two-minute loop, run after any meeting where you felt the pause:

```
  WHAT HAPPENED   observation, no verdict
  WHAT PATTERN    one sentence
  WHY IT MATTERS  the stakes
```

Append to the stash. Anchor every entry to a real event — abstract reps do
not transfer. Externalizing to organize (writing, vlogging, diagramming)
is the method here, not a crutch: the thoughts already exist, the loop
makes the organizing deliberate and repeatable.

### Part 4 — Validate

Detection. Run per rep, and watch the trend.

```
  PER REP
  [ ] Observe contains zero judgment words.
  [ ] Pattern is exactly one sentence.
  [ ] Compression is two sentences or fewer.
  [ ] A listener could disagree with the interpretation — not the observation.

  LONGITUDINAL  (the real detector)
  - Stash entries getting shorter while staying complete.
  - Reaching the stakes line faster, with fewer false starts.
  - The live pause shrinking.
```

A flat trend over weeks means you are collecting observations, not
compressing them. Back to the loop, and force the one-sentence pattern.

### Part 5 — Failure modes

```
  verdict-first ...... opening with the conclusion. demote it to stakes.
  no stakes .......... observation + pattern, then stop. "okay, and?"
  over-compression ... skipping to a one-word label to dodge the pause.
  abstract practice .. reps not tied to a real event. they don't transfer.
```

---

## Hard rules

```
  - Structure and formatting come from format.md. Do not restate them.
  - No analogies. The move is stated literally or not at all.
  - No hedging.
  - THE SPEC NEVER WRITES YOUR COMPRESSION. It scaffolds the layers and
    leaves the compression blank. Authoring it is the rep; auto-filling it
    builds nothing — the same reason the cross-reference matrix is built by
    hand, and the same failure as inline examples overriding scope.
```

---

## Family placement

This is the one rehearse generator whose subject is you, not the current
repo. It does not belong in the per-repo `/aipe:rehearse` fan-out — that
orchestrator runs against a codebase, and this has none. Run it as its own
command, or against a dedicated comms-stash folder. Keeping it out of the
fan-out is the clean-partition call, not an omission.
