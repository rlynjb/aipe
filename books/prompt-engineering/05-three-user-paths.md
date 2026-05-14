# 05 — The three user paths

## Happy / unhappy / weird

Every feature has at least three versions of how a user can interact with it. **AI defaults to the happy path** — the ideal sequence where everything goes right. The unhappy and weird paths are where real-world bugs live, and they're almost never described in a typical prompt.

> **Why it matters**
>
> AI generates what it imagines. If you only describe success, it only imagines success. Explicitly labelling unhappy and weird paths forces the model to reason about failure modes before writing any code.

## The three paths

### Happy path

The ideal flow — user does everything correctly, in order, once. AI always defaults to this. No need to over-specify it, but you do need to specify the others.

Examples:
- user taps → action succeeds → state updates
- form submits → confirmation shown

### Unhappy path

Something goes wrong — **not the user's fault**. Network, permissions, missing data, timeouts. These cause silent failures and broken UI states.

Examples:
- network fails mid-submit
- API returns empty array
- double-tap / double-submit
- session expired mid-flow
- permission denied
- slow response (>3s)

### Weird path

Technically valid but unintended. The user didn't break anything — your assumptions about normal usage were just wrong.

Examples:
- 1000 items in a list designed for 5
- app open for 3 days
- emoji in a plain-text field
- flow completed in under 1s
- back button mid-multi-step
- two tabs open simultaneously

## Do / don't

**✗ Don't**

```
When user submits the form,
save the entry and show success.
```

Only covers the happy path. All other cases are unspecified.

**✓ Do**

```
Happy: save + show success toast
Unhappy: if save fails, show inline
  error, keep form data, allow retry
Weird: if submitted twice quickly,
  debounce — only one save fires
```

> **Tip:** label these sections explicitly — writing `Unhappy:` or `Weird:` as a literal label in your prompt signals to the model to shift into failure-mode reasoning. This is meta-prompting: the structure of your prompt tells the model what kind of thinking to do.
