# Onboarding Spec

Use this for the first-run experience — what a brand new user sees before any data exists. Covers empty states, setup flows, and progressive disclosure. Relevant for loopd, contrl, and any app where the first session is meaningfully different from subsequent ones.


## Onboarding spec format


```
## App / feature being onboarded
[app name or specific feature with a first-run state]

## First-run trigger
[how the app knows it's a new user —
 no data, flag in storage, first login, etc.]

## What the user needs to do first
[minimum setup required before the app is useful]

## First-run flow
Steps:
  1. [what user sees on first open]
  2. [first action prompted]
  3. [completion state]
Expect:
  [ ] [user understands what to do next]
  [ ] [no dead ends or empty screens]

## Empty states per screen
  [Screen A]: [what shows before any data]
  [Screen B]: [what shows before any data]

## Progressive disclosure
[what is hidden until the user completes setup —
 features that require data to be meaningful]

## Skip / defer option
[can the user skip setup? what happens if they do?]

## Done when
[a new user can reach the core value of the app
 without hitting a blank screen or dead end]
```


> 💾 Save as → .aipe/specs/features/onboarding.md
