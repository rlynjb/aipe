# Prompt Engineering Cheatsheet

A practical reference for AI-assisted app development. Converted from the styled HTML site under [`html/`](../../html/) — same content, plain markdown, portable everywhere.

The premise: **prompt engineering is 80% structural and 20% wording**. Most people obsess over phrasing. The wins come from giving the model the right context, the right task framing, and explicit handling of failure paths and edge states.

## How to read

Linear order works. Each chapter builds on the last:

1. [01 — What prompt engineering actually is](01-what-pe-actually-is.md) — the 80/20 rule. Wording is the last 20%.
2. [02 — Detail vs high-level](02-detail-vs-high-level.md) — when to go deep vs stay broad.
3. [03 — Feature implementation order](03-feature-implementation-order.md) — system → behaviour → UI. Never start with UI.
4. [04 — Two-layer prompt](04-two-layer-prompt.md) — intent + constraints.
5. [05 — Three user paths](05-three-user-paths.md) — happy, unhappy, weird.
6. [06 — Interaction flow](06-interaction-flow.md) — narrate the full UX including failure.
7. [07 — Three states](07-three-states.md) — empty, error, re-entry.
8. [08 — Workflow](08-workflow.md) — Claude.ai for spec, Claude Code for implementation.
9. [09 — Analysing an app](09-analysing-an-app.md) — questions to ask before writing any prompt.
10. [10 — Closing the feedback loop](10-closing-the-feedback-loop.md) — make the AI the sensor. Instrumentation, emulation, self-evaluation patterns.

Plus a [quick-reference](quick-reference.md) — a use-case picker and a mapping from the cheatsheet's plain-English names to the formal prompting-technique names (role + context setting, chain of thought, few-shot, constraint specification, etc.).

## Voice and conventions

- Direct, opinionated, anchored to real app-building situations.
- Every section pairs a "Do" with a "Don't" — few-shot priming for the reader, same way it works for the AI.
- Callouts (`ℹ` info / `⚠` warning / `✓` good) flag the things that bite people in practice.
- Reusable instruction blocks at the end of chapters can be copy-pasted into Claude.ai or Claude Code verbatim.

Reading time per chapter: 4–10 minutes. Full read: ~75 minutes. The cheatsheet is also designed to grab once a question hits in the middle of a session.
