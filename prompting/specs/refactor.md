# Refactor Spec

Use this when restructuring existing code without changing behaviour. The constraint list does most of the work — what must stay functionally identical, what the target structure looks like, and explicit do-not-touch boundaries.


## Refactor spec format


```
## What to refactor
[file, module, or pattern being restructured]

## Why
[the problem with the current structure]

## Current structure
[brief description or code snippet of what exists]

## Target structure
[what it should look like after — describe or sketch]

## Must not change
  - External API / component interface stays identical
  - No behaviour changes — same input → same output
  - Do not touch [specific files]

## Must not introduce
  - No new dependencies
  - No new abstractions not discussed here

## Done when
[existing tests pass / feature still works end-to-end]
```


> 💾 Save as → .aipe/specs/refactors/[name].md


## Key principle

> Refactors are the highest-risk prompts to give AI. Without tight constraints, Claude will optimise aggressively and change things you didn't ask it to. The "must not change" and "must not introduce" sections are the most important part of this spec.
