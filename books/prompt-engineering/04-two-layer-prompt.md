# 04 — Two-layer prompt structure

## Intent + constraints

For any prompt — whether a one-liner or a full spec — **two layers must both be present**: what you want and why (intent), and what the output must or must not do (constraints). Intent without constraints produces output that's directionally right but full of assumptions. Constraints without intent produces something technically correct that solves the wrong problem.

> **Why it matters**
>
> Pseudocode describes *how*. Intent + constraints describe *what* and *why*. The AI is better at filling in the how than you might expect — but it can't read your mind on the what and why.

## Layer 1 — Intent

```
What you want and why (1–3 sentences).
Describe the goal, not the steps.
```

## Layer 2 — Constraints

```
- Must do X
- Must not do Y
- Edge case: if Z, then...
- Must match existing pattern in [file]
```

## Do / don't

**✗ Don't**

```
Add validation to the form
```

Which fields? What rules? What happens on failure? All guessed.

**✓ Do**

```
Add validation to the log entry
form so users can't submit empty.

- Email: valid format required
- Title: 3–80 chars
- Error: inline message below field,
  do not clear existing input
- Submit stays enabled always
```

The intent is in the first line. The constraints carry the rest.

## When to use pseudocode

Pseudocode is a *third* layer — useful only when you have a specific algorithm in mind. For UI/UX flows, interaction-flow prompting (chapter 6) is more effective. Save pseudocode for cases where the algorithm itself is the load-bearing part: a custom sort, a deduplication step, a complex state machine.
