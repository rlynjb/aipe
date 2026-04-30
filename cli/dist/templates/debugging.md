# Debugging Spec

Use this when a bug keeps coming back and describing it to Claude Code isn't working. The root problem is that Claude Code can only act on what it can observe — if it's relying on your description, it's guessing. This spec makes the app observable first, then lets Claude Code read real evidence instead.


## Why describing bugs to Claude Code fails

> **The real problem**
>
> When you describe a bug verbally, Claude Code builds a mental model of what might be wrong and fixes that model — not the actual bug. Each failed fix narrows what it tries next, but it's still working from your filtered description. The fix is to give Claude Code direct access to what's actually happening: structured logs, state snapshots, network traces, and reproduced interactions it can observe itself.


## Step 1 — Instrument before debugging

Before touching the bug, ask Claude Code to add observability to the area where the bug lives. Give it nothing else to do in this step — instrumentation only.


```
Before we fix anything, instrument [feature/component]
so we can observe what's actually happening.

Add the following:
→ Structured log at every state transition
   log: { event, prev_state, next_state, timestamp, input }
→ Log at every external call (API, DB, LLM)
   log: { call, input, output, duration_ms, error? }
→ Log at every branch point that affects this bug
   log: { condition, value, branch_taken }
→ Snapshot the full state before and after the
   operation that triggers the bug

Output logs to:
[console / log file / debug panel / wherever is easiest
 to read in this stack]

Constraints
  - Do not fix anything yet — only add logging
  - Logs must include timestamps and unique event names
  - Remove all logs after the bug is fixed
```


## Step 2 — Reproduce and collect evidence

Run the exact sequence that triggers the bug. Collect all output — logs, errors, network traces, screenshots. Do this once and capture everything. Do not describe it from memory.


```
Collect:
  → Full console log output (copy all, not just errors)
  → Network tab — all requests and responses
  → State snapshots from before and after the failure
  → Exact error message and stack trace if any
  → Screenshot or screen recording of what happened
```


## Step 3 — Bug report spec with evidence

Feed Claude Code the collected evidence — not your interpretation of it. Paste raw logs, not summaries. The spec below is what you hand it.


```
## Feature
[which feature is buggy]

## Environment
[browser / device / OS, app state when bug occurs]

## Steps to reproduce (exact)
  1. [exact action]
  2. [exact action]
  3. [exact action — this is where it breaks]

## Observed behaviour
[what actually happens — quote the UI or log, not your
 interpretation of it]

## Expected behaviour
[what should happen instead]

## Structured log output
[paste raw log output from Step 1 instrumentation here]

## State snapshot — before
[paste the state object before the operation]

## State snapshot — after
[paste the state object after the operation, if available]

## Network trace
[paste relevant request/response from network tab]

## Error output
[paste exact console error and full stack trace]

## What has already been tried
[list every fix that was attempted and what happened —
 this prevents Claude from trying the same thing again]

## Suspected cause
[your hunch if you have one — wrong state, race condition,
 bad transform, off-by-one, etc. Say "unknown" if not sure]

## Constraints
  - Do not modify [X] — only change [Y]
  - Fix must not affect [related feature]
  - Remove all debug logging after fix is confirmed
```


> 💾 Save as → .aipe/specs/bugs/[feature-name].md


## Step 4 — Let Claude Code diagnose from evidence

With real evidence in hand, Claude Code can trace what actually happened rather than guessing. Give it this instruction after feeding the spec.

> Asking Claude Code to diagnose before fixing forces it to reason from evidence rather than pattern-match on the symptom. The diagnosis step catches cases where the obvious fix masks the real cause.


```
Read .aipe/specs/bugs/[feature-name].md.

Do not fix anything yet.

First, trace through the log output and state snapshots
and tell me:
  1. Exactly where the execution diverged from expected
  2. What the root cause is (not a symptom — the cause)
  3. What the minimal fix is
  4. What else might break if you apply that fix

Then wait for my confirmation before making any changes.
```


## Step 5 — Fix and verify

Once you've confirmed the diagnosis, apply the fix and verify using the same reproduction steps — not a new description.


```
Apply the fix described in the diagnosis.

After applying:
  1. Re-run the exact steps to reproduce from the spec
  2. Confirm the structured logs now show the correct path
  3. Confirm the state snapshots match expected values
  4. Remove all debug logging added in Step 1
  5. Run the test suite
```


## When the same bug keeps coming back

> One bug per Claude Code session. Mixing multiple bugs causes the AI to conflate causes and produce fixes that break adjacent things.


**Symptom was fixed, not the cause**

The previous fix suppressed the visible error but the underlying condition still occurs. Use the diagnosis step (Step 4) to find where the state first goes wrong — not where it visibly breaks.

If you don't tell Claude Code what was tried before, it will try the same things again. The "what has been tried" section is the most important field for recurring bugs.

The fix changed shared state or a shared utility. Use the "constraints" section to list what must not change, and ask for the minimal change that fixes only this case.

Timestamps in structured logs will show this. If two events happen in the wrong order, the logs will show the sequence. Ask Claude Code to look for ordering violations in the log output specifically.
