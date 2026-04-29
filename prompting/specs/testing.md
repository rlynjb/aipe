# Testing Spec

Use this after implementation to manually verify a feature before shipping. Each test case is a path with numbered steps and a clear expected result per step. Define "done when" before you start testing, not after.


## Test case format


```
## Feature
[name of the feature being tested]

## Setup
[app state required before testing begins]

## Happy path
Steps:
  1. [action]
  2. [action]
  3. [action]
Expect:
  [ ] [what you should see after step N]
  [ ] [what you should see after step N]

## Unhappy path
Steps:
  1. [action that triggers failure]
  2. [e.g. disconnect network then submit]
Expect:
  [ ] [error state shown correctly]
  [ ] [data not lost]
  [ ] [retry available if needed]

## Weird path
Steps:
  1. [edge case setup]
  2. [action]
Expect:
  [ ] [boundary condition handled correctly]
  [ ] [no crash or visual break]

## States
  [ ] empty state — correct before any data
  [ ] error state — correct on failure
  [ ] re-entry — correct after close + reopen

## Done when
[the specific condition that means this feature is shippable]
```


> 💾 Save as → .aipe/specs/tests/[feature-name].md


## Filled example — DailyRecap


```
## Feature
DailyRecap — end of day summary

## Setup
Today screen open. At least 1 entry with mixed
block types (text + habit + clip) logged today.

## Happy path
Steps:
  1. Open Today screen
  2. Scroll past journal entries to bottom
  3. Observe the recap section
Expect:
  [ ] Recap section is visible below entries
  [ ] Clips section shows thumbnails
  [ ] Habits section shows checked / total count
  [ ] Notes section shows truncated text blocks

## Unhappy path
Steps:
  1. Disconnect network
  2. Force-close and reopen the app
  3. Navigate to Today screen
Expect:
  [ ] Recap section is hidden — no broken UI
  [ ] No crash or white screen
  [ ] Journal entries show their own error state

Steps:
  1. Log only clips today (no text or habits)
  2. Open Today screen
Expect:
  [ ] Only clips section renders in recap
  [ ] No empty habit or notes sections shown

## Weird path
Steps:
  1. Log 50 clips today
  2. Scroll to recap
Expect:
  [ ] Shows 4 thumbnails + "+46" overflow label
  [ ] No layout overflow or clipping

Steps:
  1. Log exactly 1 entry with 1 text block
  2. Scroll to recap
Expect:
  [ ] Only notes section renders
  [ ] No empty clips or habits sections shown

## States
  [ ] No entries today → recap not shown at all
  [ ] Entries loading → skeleton shown, not blank
  [ ] Close + reopen app → recap reloads correctly

## Done when
All checkboxes pass on device, not just browser
```


## What each path covers

> Always test on device, not just browser. Layout, touch targets, scroll behaviour, and timing differ enough that browser-only testing misses real bugs.
