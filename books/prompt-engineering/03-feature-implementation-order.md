# 03 — Feature implementation order

## System → behaviour → UI

When implementing a feature, the order you describe things shapes what the AI prioritises. **Start with UI and the AI designs the data model to fit the visuals — which is backwards.** Start with the data model and the AI designs everything else to fit the data, which is how software is actually supposed to work.

> **Why it matters**
>
> UI is the surface. Logic is the foundation. Describe the surface first and AI builds something pretty on an unstable foundation. Lead with data and behaviour — UI becomes a consequence, not a guess.

> ⚠ **Never start with UI** — AI infers logic from how things look and guesses on edge cases. Lead with system design so UI becomes a consequence of the data.

## The order

```
1. System design
   What data exists, where it lives, what shape it's in, and
   what changes when the feature runs. Include TypeScript
   interfaces if you have them.

2. Behaviour
   The full interaction flow — all three paths (happy,
   unhappy, weird). This is where edge cases get decided
   before any code is written.

3. UI last
   Visual treatment, layout, component names, spacing —
   described only after data model and behaviour are locked.
   The UI should feel like it falls out naturally from the
   above.
```

## Feature prompt structure (template)

Fill this in before handing off to Claude Code. The more complete the sections, the fewer correction cycles needed.

```
## Data model
[what exists, what shape it's in — include TS interfaces]

## What changes
[what this feature reads, writes, or mutates]

## Behaviour
[interaction flow — happy, unhappy, weird paths]

## UI
[visual treatment — only after above is locked]

## Constraints
[must do X / must not do Y]
```

## Do / don't

**✗ Don't**

```
Add a tap-to-edit feature to
the journal entry screen. It
should look clean and minimal.
```

No data model, no state logic, no edge cases. AI guesses everything.

**✓ Do**

```
## Data model
Entry: { id, blocks: Block[] }
Block: { type: 'text'|'todo', value }

## What changes
Tap gap → append text Block

## Behaviour
→ No blocks: show placeholder
→ Tap gap: insert + focus cursor
→ Tap block: resume editing
→ Tap outside: blur + save

## UI
Inline, no border unless focused.
```

> ℹ **For Notion as DB:** always define the page/block schema upfront — if you don't, AI will invent a schema mid-implementation that won't match your actual Notion structure.
