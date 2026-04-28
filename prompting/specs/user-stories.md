# User Stories Spec

Use this to generate user stories with all three paths for an existing app or feature. The more context you provide — data model, stack, constraints — the more accurate the paths. Without the data model, Claude invents plausible but possibly wrong failure modes.


## Prompt template


```
I have an existing app called [app name].

[2–3 sentences describing what it does]

For the [feature or screen] feature, write user stories
with all three paths for each story.

Data model:
  [Entity]: { field, field, field }
  [Entity]: { field, field, field }

Stack: [framework, database, relevant services]

Constraints:
  - [must do X]
  - [must not do Y]

Format each story as:

## Story
As a [user], I want to [action] so that [outcome].

## Happy path
Steps:
  1. [action]
  2. [action]
Expect:
  [ ] [result]

## Unhappy path
Steps:
  1. [action that triggers failure]
Expect:
  [ ] [result]

## Weird path
Steps:
  1. [edge case setup]
  2. [action]
Expect:
  [ ] [result]
```


## What to include for better output


**Data model**

Entity names, field shapes, relationships. Without this, Claude guesses at what can go wrong — with it, unhappy paths reflect real failure modes in your stack.

Which specific screen or user flow you're targeting. Keeps stories scoped and prevents Claude from writing generic stories that could apply to any app.

Framework, database, external services. Unhappy paths differ significantly — Notion API timeouts behave differently to REST API failures or local state errors.

Things it must or must not do. Prevents Claude from writing stories that conflict with existing behaviour or architecture decisions.


## Filled example — loopd journal entry

> User stories written this way feed directly into your spec. Once Claude generates them, paste the paths into your docs/features/[name].md spec file as the behaviour section.


```
I have an existing app called loopd — a daily vlogging PWA.
It lets users log journal entries with text, habit, and
clip blocks throughout the day.

For the journal entry screen, write user stories with
all three paths for:
  - Creating a new entry
  - Adding a clip block to an existing entry
  - Checking off a habit block

Data model:
  Entry: { id, date, blocks: Block[] }
  Block: { type: 'text'|'habit'|'clip', value, timestamp }

Stack: Next.js, Notion API as the database

Constraints:
  - All reads/writes go through Notion API, no local DB
  - Blocks append to entry, never replace existing blocks
  - Habit blocks can only be checked once per day
```
