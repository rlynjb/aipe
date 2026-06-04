# Quick reference

Two views: a **use-case picker** (find your situation, apply the techniques) and a **technique mapping** (formal prompt-engineering technique names ↔ the cheatsheet's plain-English names).

---

## Use-case quick picker

Find your situation, apply the techniques listed. Each technique links to the full chapter for detail.

### Starting a new feature

**Brand new feature, blank slate**

- → [App analysis](09-analysing-an-app.md) — answer all chapter-09 questions first
- → [Feature template](03-feature-implementation-order.md) — data model → behaviour → UI
- → [Three paths](05-three-user-paths.md) — happy / unhappy / weird
- → [Three states](07-three-states.md) — empty / error / re-entry

**Adding to an existing feature**

- → [Patterns to follow](09-analysing-an-app.md) — point to existing files
- → [What not to touch](09-analysing-an-app.md) — explicit do-not-modify list
- → [Constraint spec](04-two-layer-prompt.md) — what must / must not change
- → [Two-layer prompt](04-two-layer-prompt.md) — intent + delta constraints only

**Exploring or prototyping**

- → [High-level prompt](02-detail-vs-high-level.md) — describe goal, not steps
- → [Intent only](04-two-layer-prompt.md) — skip constraints, let AI decide
- → [Claude.ai phase](08-workflow.md) — design thinking before building

**AI keeps guessing wrong**

- → [App analysis](09-analysing-an-app.md) — missing context is the root cause
- → [Few-shot examples](02-detail-vs-high-level.md) — show do/don't before asking
- → [Negative prompting](04-two-layer-prompt.md) — add "must not" constraints
- → [Output format spec](03-feature-implementation-order.md) — give the AI a template to fill

### Fixing bugs and edge cases

**Bug appears on first load**

- → [Empty / zero state](07-three-states.md) — describe what shows before data exists
- → [Re-entry behaviour](07-three-states.md) — what persists, what resets
- → [State management Q](09-analysing-an-app.md) — clarify who owns the state

**Bug appears on network failure**

- → [Unhappy path](05-three-user-paths.md) — specify failure behaviour explicitly
- → [Error state](07-three-states.md) — what shows, can user retry?
- → [Negative prompting](04-two-layer-prompt.md) — "must not clear data on failure"

**Bug with real data (not mocks)**

- → [Data model Q](09-analysing-an-app.md) — confirm actual shape vs assumed shape
- → [Data flow Q](09-analysing-an-app.md) — trace fetch → transform → render
- → [External deps Q](09-analysing-an-app.md) — check API constraints and response shape

**Weird user behaviour breaks UI**

- → [Weird path](05-three-user-paths.md) — describe the unintended-but-valid case
- → [Interaction flow](06-interaction-flow.md) — narrate full sequence including re-taps
- → [Constraint spec](04-two-layer-prompt.md) — debounce / idempotent requirements

### Designing UI and interactions

**Designing a new screen**

- → [User stories](09-analysing-an-app.md) — who / what / why before any layout
- → [UI last](03-feature-implementation-order.md) — data model and behaviour first
- → [Three states](07-three-states.md) — empty / error / re-entry per component

**Designing a tap / gesture**

- → [Interaction flow](06-interaction-flow.md) — narrate every tap target and its states
- → [Three paths](05-three-user-paths.md) — what if already active / loading / failed
- → [Negative prompting](04-two-layer-prompt.md) — "tapping X must not trigger Y"

**Specifying a form**

- → [Two-layer prompt](04-two-layer-prompt.md) — intent + constraints (validation rules)
- → [Unhappy path](05-three-user-paths.md) — invalid input / submit failure / partial fill
- → [Error state](07-three-states.md) — inline vs toast, preserve input on failure

**Specifying a list or feed**

- → [Three states](07-three-states.md) — empty list / load error / re-entry cache
- → [Weird path](05-three-user-paths.md) — 1 item / 1000 items / very long strings
- → [Data flow Q](09-analysing-an-app.md) — pagination, infinite scroll, or full fetch?

### Working with Claude Code

**Starting a new Claude Code session**

- → [Role + context](09-analysing-an-app.md) — load `.dev/` or `.aipe/` folder as first message
- → [File structure Q](09-analysing-an-app.md) — confirm where new files should go
- → [What not to touch](09-analysing-an-app.md) — state explicitly before any task

**AI refactored things uninvited**

- → [Negative prompting](04-two-layer-prompt.md) — "only add new files, do not edit existing"
- → [Constraint spec](09-analysing-an-app.md) — list every file that must not change
- → [Task decomposition](01-what-pe-actually-is.md) — smaller prompts = less drift

**Prompt chain across sessions**

- → [Prompt chaining](08-workflow.md) — Claude.ai spec → `.dev/` → Claude Code
- → [Output format spec](03-feature-implementation-order.md) — ask Claude.ai to output a structured `.md`
- → [Role + context](09-analysing-an-app.md) — re-inject `.dev/` at start of each session

**Implementation drifted from spec**

- → [Few-shot examples](02-detail-vs-high-level.md) — show correct pattern from existing file
- → [Constraint spec](04-two-layer-prompt.md) — re-state the spec as explicit constraints
- → [Chain of thought](03-feature-implementation-order.md) — ask AI to explain approach before coding

---

## Mapping to formal techniques

Prompting techniques are abstract patterns. The concepts in this cheatsheet are those same techniques applied to building apps. **Once you see the formal name, you can apply the pattern to any context — not just app development.**

| Formal technique | What we called it | How it applies in practice | Chapter |
|---|---|---|---|
| **Role + context setting** | [Analysing an application](09-analysing-an-app.md) | Instead of "you are a senior engineer", you give the AI the actual context a senior engineer would already have — data model, architecture, file structure, constraints. | 09 |
| **Chain of thought** | [Feature implementation order](03-feature-implementation-order.md) | System → behaviour → UI forces a reasoning order that prevents the AI from jumping to UI conclusions before the data model is defined. The order you describe things determines the order the AI thinks about them. | 03 |
| **Few-shot examples** | [Do / don't comparisons](02-detail-vs-high-level.md) | Showing the AI a bad example and a good example before asking for output is few-shot prompting. The do/don't blocks throughout the cheatsheet prime the model on the pattern before it generates. | 02, 03, 04 |
| **Constraint specification** | [Two-layer prompt / what must not change](04-two-layer-prompt.md) | Explicitly telling the AI what the output must and must not do. Covers both positive constraints (must do X) and negative constraints (do not touch Y). The more specific, the less the AI improvises. | 04, 09 |
| **Task decomposition** | [Pre-prompt question checklist](09-analysing-an-app.md) | Breaking a complex task into ordered sub-tasks so each prompt has a narrower, cleaner scope. The three phases in chapter 09 decompose the whole process. | 09 |
| **Negative prompting** | [Unhappy path / what not to touch](05-three-user-paths.md) | Explicitly stating what you don't want — "do not modify existing routes", "must not clear input on error", "UI last". Negative prompts are as important as positive ones because AI optimises aggressively without guardrails. | 05, 09 |
| **Output format specification** | [Feature prompt structure template](03-feature-implementation-order.md) | Giving the AI a scaffold it must fill — `## Data model`, `## Behaviour`, `## UI`, `## Constraints`. The structure of the prompt shapes the structure of the output. No template = AI chooses its own format, which changes every time. | 03 |
| **Persona priming** | [Workflow — Claude.ai phase](08-workflow.md) | Using Claude.ai for design before Claude Code for implementation puts the model in "thinking" mode vs "building" mode. The phase shapes the kind of output you need. | 08 |
| **Prompt chaining** | [Claude.ai → `.dev/` → Claude Code](08-workflow.md) | Using the output of one prompt as the input to the next. The spec produced in Claude.ai becomes the context fed into Claude Code via the persistent folder. Each prompt in the chain is narrower and more reliable than trying to do everything in one shot. | 08, 09 |
| **State injection** | [Always describe these three states](07-three-states.md) | Explicitly injecting the empty, error, and re-entry states into the prompt. AI imagines a fully-loaded happy-path screen by default — injecting the other states forces it to reason about the full surface area. | 07 |
| **Observation / sensing** | [Closing the feedback loop](10-closing-the-feedback-loop.md) | Removing yourself as the middleman. The AI instruments the system, runs it, observes the result, and reasons from evidence rather than your description. | 10 |
| **Self-evaluation** | [Self-evaluation pattern](10-closing-the-feedback-loop.md) | Forcing the AI to check its own output against criteria before showing it to you. The reflection step in agentic patterns. | 10 |
| **Emulation** | [Emulate user / role](10-closing-the-feedback-loop.md) | Having the AI simulate a user, attacker, or screen reader and observe directly — instead of you manually clicking through. | 10 |

> ℹ Every concept in this cheatsheet is a prompting technique in disguise. **Learning the formal name lets you apply the pattern to problems outside app development** — research, writing, analysis, system design.
