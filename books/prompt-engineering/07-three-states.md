# 07 — Always describe these three states

## What AI skips by default

When AI implements a feature, it imagines a user arriving at a fully-loaded screen with existing data, doing exactly one thing, and leaving. **It rarely imagines the screen before any data exists, what happens when an action fails, or what the user sees when they come back.** These three states account for most of the missing UI in any first implementation.

> **Why it matters**
>
> These aren't edge cases — they're states every user hits on their first session, on a bad connection, or on their second visit. Shipping without them means users hit blank screens, broken layouts, or stale data.

## The three states

### Empty / zero state

The screen **before any data exists** — first-time user, cleared list, no results. Without this, UI often renders nothing or crashes on null data.

> e.g. "If `entry.blocks` is empty, show placeholder: 'Tap to start writing…' — no widgets, no timestamp gap visible"

### Error / edge state

When an action **fails, is slow, or is attempted more than once**. Without this, errors either show nothing or crash the UI silently.

> e.g. "If save fails: show inline error below the entry, keep all content intact, show retry button — do not navigate away"

### Re-entry behaviour

What the user sees when they **return** — after refreshing, closing the app, or navigating back. Without this, state is either lost or stale.

> e.g. "On re-open: restore scroll position, reload from Notion API, show loading skeleton while fetching"

## Do / don't

**✗ Don't**

```
Show a list of journal entries
```

What shows if there are none? What if fetch fails? What if they return after a week?

**✓ Do**

```
Show a list of journal entries.
Zero state: "No entries yet" + CTA.
Error: "Couldn't load" + retry,
  show cached data if available.
Re-entry: reload on focus, show
  skeleton while fetching.
```

> ✓ Naming all three states catches ~70% of edge case bugs before you run the code.
