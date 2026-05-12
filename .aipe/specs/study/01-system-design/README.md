# Section 01 — System design

Architectural patterns in the aipe codebase. Read in numbered order on first pass; reference any file independently afterwards.

---

## Index

- [`01-template-source-of-truth`](01-template-source-of-truth.md) — `specs/*.md` is canonical; `commands/` + `skills/` are byte-identical wrappers around it.
- [`02-per-spec-type-contract`](02-per-spec-type-contract.md) — the 8-step shape every `/aipe:<type>` follows.
- [`03-plugin-distribution`](03-plugin-distribution.md) — one repo, two marketplaces (Claude Code + Codex), lockstep version.
- [`04-context-layering`](04-context-layering.md) — global + project context files merged into the prompt at runtime.
- [`05-two-diff-update-mode`](05-two-diff-update-mode.md) — Diff A (codebase) + Diff B (template) per file, with STOP for user confirmation.
- [`06-scaffold-then-stop`](06-scaffold-then-stop.md) — Step 1's idempotent scaffold + refusal to proceed without real context.

---

## System map (recap from 00-overview.md)

```
                  user
                    │
                    ▼
      ┌─ Wrapper layer (per-host) ─┐
      │   commands/<type>.md       │
      │   skills/<type>/SKILL.md   │
      └─────────────┬──────────────┘
                    │ loads
                    ▼
      ┌─ Template layer ───────────┐
      │   specs/<type>.md          │
      │   (single source of truth) │
      └─────────────┬──────────────┘
                    │ + reads
                    ▼
      ┌─ Context layer ────────────┐
      │   .aipe/project/*.md       │
      │   ~/.config/aipe/global/*  │
      └─────────────┬──────────────┘
                    │
                    ▼
      ┌─ Output layer ─────────────┐
      │   .aipe/specs/<type-       │
      │       plural>/<slug>.md    │
      └────────────────────────────┘
```

---

## The 6-step system-design checklist

aipe's architecture, like any system, can be read through six steps. Each concept file in this section is tagged with the step(s) it lives in — read the file, recognise the step, build the unified mental model.

1. **Data model** — what's stored, where it lives, what shape it has.
2. **Request / response flow** — how a request enters, transforms, and exits.
3. **Caching layers** — what's cached, at which boundary, with what invalidation.
4. **State ownership** — who owns each piece of state; where ownership transitions happen.
5. **Failure handling** — what fails, how it's detected, how the system recovers (or refuses).
6. **Scale concerns** — what breaks first as load grows.

### Per-pattern checklist tags

- [`01-template-source-of-truth`](01-template-source-of-truth.md) — Step 2 (Request flow: every command's request flow loads the canonical template), Step 4 (State ownership: template owns behaviour, wrappers own host adaptation).
- [`02-per-spec-type-contract`](02-per-spec-type-contract.md) — Step 2 (Request flow: the contract IS the request flow shape).
- [`03-plugin-distribution`](03-plugin-distribution.md) — Step 1 (Data model: distribution is "where the plugin lives").
- [`04-context-layering`](04-context-layering.md) — Step 1 (Data model: config IS the data the agent reads), Step 4 (State ownership: layer boundary between personal and project).
- [`05-two-diff-update-mode`](05-two-diff-update-mode.md) — Step 2 (Request flow: UPDATE is the alternate flow), Step 5 (Failure handling: STOP-before-edit prevents lost work).
- [`06-scaffold-then-stop`](06-scaffold-then-stop.md) — Step 1 (Data model: scaffold initialises), Step 5 (Failure handling: refuse missing required input).

A reader who skims this README walks away with: the six steps, which patterns live where, and the file to open for any specific concept.

---

## Reading order

1. [`01-template-source-of-truth`](01-template-source-of-truth.md) — establishes the canonical layer.
2. [`02-per-spec-type-contract`](02-per-spec-type-contract.md) — the 8-step flow that uses it.
3. [`06-scaffold-then-stop`](06-scaffold-then-stop.md) — Step 1's gate (read with #2).
4. [`04-context-layering`](04-context-layering.md) — what Step 2 loads.
5. [`03-plugin-distribution`](03-plugin-distribution.md) — how the wrappers reach users.
6. [`05-two-diff-update-mode`](05-two-diff-update-mode.md) — UPDATE-mode mechanics.
