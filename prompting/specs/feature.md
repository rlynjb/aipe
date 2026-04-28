# Feature Spec

Use this when building something new. You're answering: what are we building? The goal is a spec that removes every decision Claude Code would otherwise guess on.


## Step 1 — App analysis

Ask Claude.ai to extract the current state of your codebase. You do this once per project, then update it when the codebase changes significantly.


```
"Analyse my [app] codebase and answer:
data model, state management, file structure,
external deps, what must not change.
Output as context.md for my .buffr/global/ folder."
```


> 💾 Save output → .buffr/project/context.md


## Steps 2–5 — Feature spec

One conversation. You describe the feature, Claude.ai applies the template and fills in the gaps. Review and lock it before moving on.


```
"Help me write a spec for [feature]
using my prompting cheatsheet structure.
Here's what I want it to do: [description]"
```


```
## Data model       entities, shape, relationships
## What changes     reads, writes, mutations
## Behaviour        interaction flow — all three paths
## UI               visual treatment, only after above
## Constraints      must / must not
```


> 💾 Save output → .buffr/specs/features/[name].md


## Step 6 — Implement

Open a new Claude Code session. Feed it the spec files. This is the only step that goes to Claude Code — everything before this was design.

> The spec removes every decision Claude Code would otherwise guess on. What's left is just the implementation.


```
"Read .buffr/project/context.md and
.buffr/specs/features/[name].md
then implement the [feature]."
```
