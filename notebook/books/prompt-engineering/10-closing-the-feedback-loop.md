# 10 — Closing the feedback loop

## Make the AI the sensor, not you

The most powerful shift in AI-assisted development is **removing yourself as the middleman between the AI and observable reality**. Instead of observing what happens, describing it to the AI, and waiting for a fix — you instrument the system so the AI can observe directly, reason from evidence, and close the loop itself.

> **Why it matters**
>
> When you describe a bug, the AI builds a mental model of what might be wrong and fixes that model — not the actual bug. When the AI observes directly, it works from evidence. That's the difference between guessing and diagnosing.

```
Instead of:  you observe → you describe → AI fixes → repeat

You do:      AI instruments → AI runs → AI observes → AI fixes
```

## The language-agnostic principle

This applies at every level of software development — not just debugging. Any time you find yourself acting as the middleman between the AI and something observable, ask: **can the AI observe this directly instead?**

```
Code level
  → AI reads logs instead of you describing errors
  → AI runs the test suite instead of you reporting failures
  → AI traces execution instead of you explaining flow

System level
  → AI reads metrics instead of you reporting slowness
  → AI inspects DB state instead of you querying manually
  → AI checks network traces instead of you describing requests

Product level
  → AI emulates user interaction instead of you clicking through
  → AI audits accessibility instead of you tabbing manually
  → AI reviews API contracts instead of you testing with Postman

Architecture level
  → AI reviews its own output before you see it
  → AI validates its assumptions against the codebase
  → AI checks its fix didn't break adjacent things
```

## The three forms it takes

### Instrumentation

Add observability to the system — logs, traces, snapshots — so the AI can read real signals. (What the debugging spec encodes in Step 1.)

> e.g. "Add structured logs at every state transition before touching the bug"

### Emulation

The AI simulates a role — user, attacker, screen reader — and observes what happens. Replaces you manually clicking through and describing what broke.

> e.g. "Emulate a user clicking through the checkout flow and log every state change"

### Self-evaluation

The AI checks its own work against defined criteria before returning it to you. Closes the loop between implementation and verification.

> e.g. "Before showing me the fix, re-run the reproduction steps and confirm the logs show the correct path"

## Where this fits in agentic patterns

Closing the feedback loop is part of a broader set of language-agnostic agentic patterns — ways of structuring AI work so it can complete more of the loop autonomously.

```
Observation    make the AI the sensor          ← this chapter
Planning       make the AI decompose before executing
Reflection     make the AI evaluate its own output
Memory         give the AI persistent context   ← .dev/ or .aipe/
Tool use       give the AI actions beyond text generation
```

> ℹ The Debugging spec is the practical application of the observation pattern. The `.aipe/` (or `.dev/`) memory bank is the practical application of the memory pattern. You've been building agentic infrastructure without necessarily calling it that.

---

## Reusable instruction — instrumentation

Use this before any debugging or investigation session. Give it to Claude Code before describing the bug. **Do not ask it to fix anything yet.**

```
Before we touch anything, make [feature/area]
observable so we can work from evidence.

Add structured logging at:
  → Every state transition
     { event, prev_state, next_state, timestamp, input }
  → Every external call (API, DB, LLM, network)
     { call, input, output, duration_ms, error? }
  → Every branch point that affects this flow
     { condition, value, branch_taken }
  → Full state snapshot before and after the
     operation we're investigating

Output to: [console / log file / debug panel]

Rules
  - Do not fix anything yet — instrumentation only
  - Logs must include timestamps and unique event names
  - Remove all debug logs after the investigation is done
```

---

## Reusable instruction — emulation

Use this to have Claude Code simulate a user, attacker, or any role that interacts with your app — **instead of you manually running through it and describing what you saw**.

```
Emulate [role: user / attacker / screen reader /
API consumer] interacting with [feature].

Simulate this exact sequence:
  → [step 1]
  → [step 2]
  → [step 3 — this is where I think it breaks]

At each step, log:
  → What action was taken
  → What state the app was in before
  → What state it's in after
  → Any error, unexpected branch, or missing handler

After the simulation
  → Tell me exactly where execution diverged
    from what I would expect
  → Do not fix anything — observation only
```

---

## Reusable instruction — self-evaluation

Use this after Claude Code produces a fix, feature, or output — **before you review it**. Forces it to validate its own work against the criteria that matter to you.

```
Before showing me the result, evaluate your own output
against these criteria:

  → Does it cover the happy path?         [ ]
  → Does it handle the unhappy path?      [ ]
  → Does it handle the weird path?        [ ]
  → Does it respect all the constraints?  [ ]
  → Could it break anything adjacent?     [ ]

Format your self-evaluation as:
  Pass / Fail per criterion
  If any fail: what specifically fails and why
  If all pass: confirm and show the result

Do not show me the result until the evaluation is done.
```

---

## Reusable instruction — full loop

The complete autonomous loop. Use this when you want Claude Code to investigate, diagnose, and fix with minimal back-and-forth. Works best when you've already instrumented the area.

```
Run the full observation loop on [feature/bug]:

Step 1 — Instrument
Add structured logging to every relevant state
transition and external call. Do not fix anything.

Step 2 — Emulate
Simulate [user action / reproduction steps].
Run through the instrumented code and collect
the full log output.

Step 3 — Diagnose
Read the logs. Identify:
  → Where execution first diverged from expected
  → The root cause (not the symptom)
  → The minimal fix
  → What else could break if you apply it

Step 4 — Confirm
Tell me your diagnosis and proposed fix.
Wait for my approval before making any changes.

Step 5 — Fix and verify
Apply the fix. Re-run the emulation.
Confirm logs now show the correct path.
Remove all debug instrumentation.
Run the test suite.
```

> ✓ This is the loop that replaces "I clicked through the app and it broke, here's what I saw." You describe the scenario once — Claude Code runs it, observes it, diagnoses it, fixes it, and verifies it.
