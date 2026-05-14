# 02 — Detail vs high-level

## When to go deep vs stay broad

The right level of detail depends on what you're optimising for. Too much detail and you constrain the AI into your approach — even if a better one exists. Too little and it fills gaps with assumptions, which is where bugs come from. **The sweet spot:** describe the *what* and *why* in detail, let the AI decide the *how*.

> **Why it matters**
>
> If you write every step out as pseudocode, you're essentially writing the code yourself. Use detail to eliminate ambiguity, not to micromanage the implementation.

## Two columns

```
Use detail when                       Stay high-level when
──────────────────────────────        ──────────────────────────────
Complex or branching logic            Exploring or prototyping
Specific data structure required      Task is well-understood
Fitting into an existing codebase     You want the AI's best approach
AI has guessed wrong before           Creative latitude improves output
Rigid schema (e.g. Notion API)        Early-stage design thinking
```

## Do / don't

**✗ Don't**

```
Build a habit tracker where
users can check off habits
```

AI invents the data model, reset logic, and streak behaviour. Every assumption is a potential bug.

**✓ Do**

```
Build a habit tracker.
Each habit: { id, name, streak }.
Tapping checks it for today only.
Habits reset at midnight UTC.
Missed yesterday = streak resets to 0.
```

Decisions made upfront. AI builds to the spec, not to a guess.

## The principle

> More detail = less guessing.
> Less detail = better solutions you didn't think of.
> **Match depth to what you already know.**

If you've decided X, write down X. If you haven't decided X — and it's not load-bearing — leave it open and let the AI propose. Detail at every level for everything turns the AI into a transcriptionist; detail at zero level for anything turns it into a guessing game.
