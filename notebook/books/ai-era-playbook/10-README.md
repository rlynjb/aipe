# AI-Era Application Design — Field Playbook

> Orient to, design, review, implement, and coordinate applications with AI while keeping ownership of the system's mental model and its complexity.
>
> Companion book: the [Daily Debrief](../debrief/README.md), for end-of-day reflection.

## How to use this book

This is a field reference, not a read-through. Each chapter is its own file — jump straight to the one for what you're doing right now. The router below is the fastest way in.

Everything hangs off three questions (the [Core model](00-core-model.md)):

1. **Orientation** — what is this, and how does it work?
2. **Design quality** — what complexity is exposed, duplicated, obscure, or avoidable?
3. **Execution** — what must be decided, built, tested, coordinated, and communicated next?

The [review gates](06-review-gates.md) are the fast path. The numbered chapters behind them are the depth for when a gate isn't enough.

## In the field, jump to

| When you're… | Go to |
| --- | --- |
| Orienting to a new app or feature | [§2 Orient](02-orient.md) · [Gate 6.1 Fast orientation](06-review-gates.md#61-fast-orientation) |
| About to build | [Gate 6.2 Before implementation](06-review-gates.md#62-before-implementation) · [§4.4 Small vertical slices](04-use-ai.md#44-keep-changes-small-and-vertical) |
| Reviewing what you just built | [Gate 6.3 After implementation](06-review-gates.md#63-after-implementation) · [§8 Completion standard](08-completion-standard.md) |
| Judging design quality / complexity | [§3 Philosophy-of-Software-Design review](03-philosophy-review.md) |
| Directing AI on real code | [§4 Use AI](04-use-ai.md) · [§4.5 Review AI complexity](04-use-ai.md#45-review-ai-generated-complexity) |
| You need the full AI review prompt | [§7 Unified AI prompt](07-unified-ai-prompt.md) |
| Setting up project tracking | [§1 Source of truth](01-source-of-truth.md) |
| Coordinating, status, or a scope change | [§5 Coordinate delivery and change](05-coordinate-delivery.md) |

## Chapters

- [Core model](00-core-model.md)
- [1. Establish the project source of truth](01-source-of-truth.md)
  - [1.1 Separate kinds of information](01-source-of-truth.md#11-separate-kinds-of-information)
  - [1.2 Maintain one project control page](01-source-of-truth.md#12-maintain-one-project-control-page)
  - [1.3 Use traceable IDs](01-source-of-truth.md#13-use-traceable-ids)
  - [1.4 Track unknowns and decisions](01-source-of-truth.md#14-track-unknowns-and-decisions)
- [2. Orient to an application or feature](02-orient.md)
  - [2.1 Purpose and outcome](02-orient.md#21-purpose-and-outcome)
  - [2.2 Domain model and invariants](02-orient.md#22-domain-model-and-invariants)
  - [2.3 System design and boundaries](02-orient.md#23-system-design-and-boundaries)
  - [2.4 One complete execution flow](02-orient.md#24-one-complete-execution-flow)
  - [2.5 Software design](02-orient.md#25-software-design)
  - [2.6 Data and technical foundations](02-orient.md#26-data-and-technical-foundations)
  - [2.7 Failure, security, and scale boundaries](02-orient.md#27-failure-security-and-scale-boundaries)
- [3. Review the design using *A Philosophy of Software Design*](03-philosophy-review.md)
  - [3.1 Essential versus accidental complexity](03-philosophy-review.md#31-essential-versus-accidental-complexity)
  - [3.2 Change amplification](03-philosophy-review.md#32-change-amplification)
  - [3.3 Cognitive load](03-philosophy-review.md#33-cognitive-load)
  - [3.4 Unknown unknowns](03-philosophy-review.md#34-unknown-unknowns)
  - [3.5 Module depth](03-philosophy-review.md#35-module-depth)
  - [3.6 Information hiding and leakage](03-philosophy-review.md#36-information-hiding-and-leakage)
  - [3.7 Interface design and "do the whole job"](03-philosophy-review.md#37-interface-design-and-do-the-whole-job)
  - [3.8 Pass-through layers and coupling](03-philosophy-review.md#38-pass-through-layers-and-coupling)
  - [3.9 General-purpose versus special-purpose design](03-philosophy-review.md#39-general-purpose-versus-special-purpose-design)
  - [3.10 Errors, configuration, consistency, and documentation](03-philosophy-review.md#310-errors-configuration-consistency-and-documentation)
  - [3.11 Strategic versus tactical programming](03-philosophy-review.md#311-strategic-versus-tactical-programming)
  - [3.12 Design it twice](03-philosophy-review.md#312-design-it-twice)
- [4. Use AI without surrendering design ownership](04-use-ai.md)
  - [4.1 Ground the AI in the real project](04-use-ai.md#41-ground-the-ai-in-the-real-project)
  - [4.2 Ask for analysis before edits](04-use-ai.md#42-ask-for-analysis-before-edits)
  - [4.3 Require evidence](04-use-ai.md#43-require-evidence)
  - [4.4 Keep changes small and vertical](04-use-ai.md#44-keep-changes-small-and-vertical)
  - [4.5 Review AI-generated complexity](04-use-ai.md#45-review-ai-generated-complexity)
- [5. Coordinate delivery and change](05-coordinate-delivery.md)
  - [5.1 Deliver vertical slices](05-coordinate-delivery.md#51-deliver-vertical-slices)
  - [5.2 Map dependencies and the critical path](05-coordinate-delivery.md#52-map-dependencies-and-the-critical-path)
  - [5.3 Use meetings to make decisions](05-coordinate-delivery.md#53-use-meetings-to-make-decisions)
  - [5.4 Give decision-oriented status updates](05-coordinate-delivery.md#54-give-decision-oriented-status-updates)
  - [5.5 Analyze requirement changes](05-coordinate-delivery.md#55-analyze-requirement-changes)
  - [5.6 Keep three planning horizons](05-coordinate-delivery.md#56-keep-three-planning-horizons)
- [6. Reusable review gates](06-review-gates.md)
  - [6.1 Fast orientation](06-review-gates.md#61-fast-orientation)
  - [6.2 Before implementation](06-review-gates.md#62-before-implementation)
  - [6.3 After implementation](06-review-gates.md#63-after-implementation)
- [7. Unified AI prompt](07-unified-ai-prompt.md)
- [8. Completion standard](08-completion-standard.md)
- [Final reminder](09-final-reminder.md)
