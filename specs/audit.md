# Audit Spec

Use this at the end of a phase before starting the next one. You're answering: what is the current state, what's incomplete, and what must be true before we move forward? This is subtractive — you're closing gaps, not adding features.


## Step 1 — Update app analysis

Re-run app analysis with a focus on what has changed since the last phase. More important here than during feature work — the codebase has grown and assumptions may have shifted.


```
"Update context.md to reflect the current
state of [app]. What has changed since phase N?
What's stable, what's still rough?"
```


> 💾 Update → .aipe/project/context.md


## Step 2 — Phase audit

Instead of a feature spec, write a phase audit. What's complete, what's half-done, what's blocking the next phase, and what's explicitly deferred. Document deferred items — otherwise you accidentally build on top of them.


```
## What's complete
features that are stable and tested

## What's incomplete
exists but has gaps — missing states,
unhappy paths deferred, known edge cases

## What's blocking next phase
must be resolved before building anything new

## What's explicitly deferred
choosing not to fix now — documented so you
don't build on top of it unknowingly
```


> 💾 Save output → .aipe/specs/phases/phase-N-audit.md


## Steps 3–5 — Mini specs per blocker

For each item in "incomplete" or "blocking", write a mini spec — same technique as feature specs but smaller in scope. Interaction flow and three paths for each gap.


```
"Write a mini spec to fix [incomplete item].
Cover the interaction flow, unhappy path,
and the three states. Keep it tight."
```


> 💾 Save each → .aipe/specs/features/fix-[name].md


## Step 6 — Fix in Claude Code

Same as implementing a feature — one spec file per fix, one Claude Code session per fix. Keep sessions narrow so context stays clean.

> Fix blockers before starting the next phase. Building new features on top of half-finished ones compounds bugs in ways that become very hard to trace.


```
"Read .aipe/project/context.md and
.aipe/specs/features/fix-[name].md
then fix [item]."
```


## After all fixes — update context

Once all blockers are resolved, update context.md to reflect the clean state. The next phase starts from accurate, stable ground.


```
"Update .aipe/project/context.md — phase N blockers
are resolved. Mark those features as stable.
App is ready for phase [N+1]."
```
