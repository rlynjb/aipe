# 06 — Interaction flow template

## Narrate the full user experience

Interaction flow prompting borrows the structure of pseudocode but applies it to user behaviour rather than algorithms. **Instead of describing what the code should do, you describe what the user does and what should happen at each step — including what they see when things go wrong.** This is the most effective technique for catching edge cases before implementation.

> **Why it matters**
>
> When you narrate user behaviour step by step, you're forced to make decisions the AI would otherwise guess. Those guesses are exactly where your bugs come from. Interaction flows turn implicit decisions into explicit ones before a single line is written.

## Template

```
User opens [screen] ([state: empty | loaded | error])
  → if no data: show empty state with [CTA]
  → if data exists: render [component]
  → if load fails: show error with retry option

User taps [element]
  → if [state A]: [action + feedback]
  → if [state B]: [alternative action]
  → if already active: [idempotent behaviour]
  → if loading: [block or queue?]

User leaves app / navigates away
  → is state persisted? where?
  → draft saved or discarded?

User returns (next session)
  → what resets?
  → what persists?
```

## Real example — journal entry tap-to-edit

```
User opens entry (no content yet)
  → shows timestamp at top
  → visible padding below timestamp, above any widgets
  → tapping that padding: activates text input, keyboard opens

User opens entry (has todo / habit / clip blocks)
  → widgets render below timestamp
  → tapping gap between timestamp and first widget:
      inserts text block above widgets, focuses cursor
  → tapping a widget: opens widget interaction, NOT text input
  → tapping timestamp: no action

Edge cases
  → keyboard already open + tap gap: no change
  → entry already has text: tap resumes at tap position
  → user navigates away mid-edit: auto-save draft
```

> ✓ This level of specificity catches ~70% of edge cases before you write a line of code. The AI has nothing left to guess on.

## Why this beats pseudocode

Pseudocode describes what the code does. Interaction flow describes what the user does and what the system answers with. The interaction-flow form forces you to answer questions like "what happens on tap when state is X" — and you can only answer once you've decided. Decisions made on a whiteboard cost minutes; decisions discovered mid-implementation cost hours.
