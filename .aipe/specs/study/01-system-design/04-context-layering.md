# Context layering (global + project)

**Industry name(s):** Layered configuration, Cascading defaults, Context composition
**Type:** Industry standard

> Per-project context (`.aipe/project/*.md`) overlaid on optional global context (`~/.config/aipe/global/*.md`) — both feed the same template prompt, with the project layer winning where they conflict.

**See also:** → [02-per-spec-type-contract](02-per-spec-type-contract.md) · → [06-scaffold-then-stop](06-scaffold-then-stop.md)

---

## Why care

You've worked on a CLI tool that read config from `~/.toolrc`, then from `./.toolrc.local`, then from env vars, then from command-line flags — each layer overriding the one before it — and you've spent half a day debugging why your `--verbose` flag didn't take effect (it did; an env var set elsewhere overrode the flag with the same name). Cascading config is everywhere, and it has the same failure mode everywhere: when layers stack and the layer order isn't obvious, you can't predict the resolved value without tracing.

The pattern is *layered configuration with explicit precedence*. ESLint configs cascade (root config + per-directory overrides). Git config cascades (system → global → repo → command-line). Docker layers cascade. Kubernetes labels and annotations cascade. The pattern's strength is composition — common settings live once, project-specific overrides earn their place per-project. The pattern's weakness is the trace cost when something doesn't behave as expected. Here's how aipe's version works.

---

## How it works

A onion of context. The host agent peels layers from the outside in: global identity, global rules, global stack, global skills, global curriculum, then the per-project layer (context, rules, stack, curriculum). Every layer that exists gets read into the prompt; layers that don't exist are skipped silently. The prompt sees the concatenated result.

### The global layer — cross-project identity and defaults

Lives at `~/.config/aipe/global/`. Five files, all optional:

```
identity.md           — who I am, how I work
rules.md              — conventions I apply to every project
stack.md              — my default tech preferences
skills.md             — capabilities and tools I bring
aieng-curriculum.md   — my AI engineering curriculum
```

If you're coming from frontend, this is your `.eslintrc` at the home directory — defaults that apply to every project you open. They're optional: a fresh install of aipe has nothing under `~/.config/aipe/global/` and works fine; the global layer earns its place when you want consistency across multiple projects.

The practical consequence: if your `~/.config/aipe/global/rules.md` says "prefer TypeScript over JavaScript," every `/aipe:feature` invocation in every project gets that instruction passed into its prompt — without you having to re-write it in every repo.

### The project layer — committed to the repo

Lives at `.aipe/project/` in the user's git repo:

```
context.md            — required — stack, data model, file structure, invariants
rules.md              — optional — conventions specific to this project
stack.md              — optional — this codebase's specific tech list
aieng-curriculum.md   — optional — project-anchored curriculum
```

Think of it like a per-project `.eslintrc` that overrides the home-directory one. The project layer is committed to the repo, so every contributor reads the same project context — and the project context describes the project, not the person. `context.md` is required because without it, the host agent doesn't know what the codebase IS.

This works whether the user has a global layer or not. The project layer stands alone; the global layer enhances it.

### How the prompt sees them

Every wrapper's Step 2 reads both layers:

```
Step 2 — Load context

Read these files (skip missing ones):

- .aipe/project/context.md         (required)
- .aipe/project/rules.md           (optional)
- .aipe/project/stack.md           (optional)
- ~/.config/aipe/global/identity.md  (optional)
- ~/.config/aipe/global/rules.md     (optional)
- ~/.config/aipe/global/stack.md     (optional)
- ~/.config/aipe/global/skills.md    (optional)
```

The host agent reads each file into the prompt context. There is no merge step; both layers feed the prompt at once. The LLM resolves conflicts at inference time. This is unlike a typical config cascade where the resolver picks one value per key — here, both values land in the prompt, and the prompt's instructions tell the agent how to handle conflict (in practice: project-specific wins because it's more specific).

If you're coming from frontend, this is like passing both `defaultProps` and runtime `props` into a React component — both are visible to the component, and the component decides how to combine them. There's no compile-time merge; both layers are visible at runtime.

The practical consequence: there is no precedence rule encoded in the wrappers. The agent reasons about conflict on the fly. A `global/rules.md` saying "prefer TypeScript" and a `project/rules.md` saying "use plain JS for this project" both reach the LLM; the LLM defers to project-level. This works ~95% of the time and surprises occasionally, which is the cost.

### Curriculum is a special case (third resolution layer)

The `/aipe:study` command extends Step 2 with a curriculum-file resolution flow:

1. Check canonical paths in order — `.aipe/project/aieng-curriculum.md` → `.aipe/project/curriculum.md` → `~/.config/aipe/global/aieng-curriculum.md` → `~/.config/aipe/global/curriculum.md`.
2. If none, search `~` (maxdepth 4) for candidate files.
3. Auto-install if exactly one, prompt if multiple, silent-codebase-driven if zero.

This is a single value resolved (the curriculum file), not a layered overlay. See [02-curriculum-resolution](../02-dsa/01-curriculum-resolution.md) for the algorithm.

### What's deliberately not here

There's no merge. There's no precedence enforcement. There's no schema. The two layers are markdown — the agent reads them and applies them. The lightness is the design: configuration is *prompt*, not *parsed structure*. Configuration becomes structured if and when the agent needs to act on a specific field (the curriculum's `[Cx.y]` tags); otherwise it's prose that shapes the agent's behaviour.

This is what people mean by "configuration as conversation" — the layers are how the user talks to the agent, not how the agent talks to itself.

The full picture is below.

---

## Context layering — diagram

```
Two layers, both feed the prompt at runtime

┌─ ~/.config/aipe/global/  (cross-project, optional) ─────────────────────────┐
│                                                                             │
│   identity.md            ┐                                                  │
│   rules.md               │  read into prompt context                        │
│   stack.md               │                                                  │
│   skills.md              │                                                  │
│   aieng-curriculum.md    ┘                                                  │
│                                                                             │
└──────────────────────────┬──────────────────────────────────────────────────┘
                           │
                           ▼
┌─ .aipe/project/  (per-project, committed) ──────────────────────────────────┐
│                                                                             │
│   context.md          ◀── REQUIRED ── scaffolded at Step 1 if absent        │
│   rules.md            ┐                                                     │
│   stack.md            │  read into prompt context                           │
│   aieng-curriculum.md ┘                                                     │
│                                                                             │
└──────────────────────────┬──────────────────────────────────────────────────┘
                           │
                           ▼  both layers concatenated
┌─ Prompt context (in-memory, transient) ─────────────────────────────────────┐
│                                                                             │
│   The host agent sees:                                                      │
│   - global identity + rules + stack + skills (if present)                   │
│   - project context (always) + rules + stack (if present)                   │
│   - the template body from specs/<type>.md                                  │
│   - the user's $ARGUMENTS                                                   │
│                                                                             │
│   Conflict resolution: agent decides at inference time;                     │
│   project-specific wins by convention.                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Project layer location:** `.aipe/project/` inside the user's repo.
- `.aipe/project/context.md` — for the aipe project itself, this file describes the markdown plugin (see `/Users/rein/Public/aipe/.aipe/project/context.md`).
- Scaffolded by every wrapper's Step 1 if absent. The placeholder body is byte-identical across all 11 commands (verified by reading any `commands/<type>.md` lines 12–30).

**Global layer location:** `~/.config/aipe/global/`.
- `aieng-curriculum.md` — currently a symlink to `prompts/aieng-curriculum.md` in this repo (so the curriculum is sourced from the aipe project's own `prompts/` directory).
- Other files (identity, rules, stack, skills) are not present in this install but are documented in `README.md` lines 87–95.

**Load order in wrappers:** every `commands/<type>.md` Step 2 lists the load order. Example: `commands/feature.md` lines 50–80.

**Documentation:**
- `README.md` lines 87–95 ("Configuration") shows the two-layer table.
- `spec-aipe.md` lines 182–215 ("Configuration model") describes the load order and the optionality rules.

---

## Elaborate

### Where this pattern comes from

Layered config predates Unix — it's the same idea as `bin/PATH` searching: start with the most-specific, fall back to the least-specific. Git formalised the three-layer cascade (`--system`, `--global`, `--local`) in 2005. ESLint's hierarchical configs (2014) made it standard for JavaScript tooling. The pattern in aipe inherits the structure (global + project) but skips the merge step because the consumer (the LLM) reasons about conflict at inference time rather than at parse time.

### The deeper principle

Configuration can be conversation, not data. When the consumer is a sophisticated agent capable of natural-language reasoning, you don't need to parse, merge, and reduce the configuration to a key-value bag — you can feed both layers as prose and let the consumer reason about it. The cost is unpredictability when layers conflict (the agent decides, and sometimes decides surprisingly); the win is that the configuration is human-readable, the layering is obvious, and you spend no code on a merge resolver.

### Where this breaks down

When you need *deterministic* configuration behaviour. If a project rule contradicts a global rule and the agent has to consistently pick one or the other (say, a security policy that must override personal preference), the no-merge model is wrong — the agent might defer to either side depending on the phrasing. The fix is to introduce explicit precedence in the prompt ("project rules override global rules where they conflict") — a one-line instruction that gives the agent a deterministic resolver. Today that line isn't in the wrappers; if precedence ambiguity becomes a real bug, adding it is cheap.

### What to explore next

- [02-curriculum-resolution](../02-dsa/01-curriculum-resolution.md) → how the curriculum file is resolved (single value, not layered)
- ESLint's flat config cascade — same pattern with explicit merge rules
- Tailwind's `theme.extend` — layered defaults with explicit override semantics

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Two-layer overlay (today)│ Deep merge with precedence  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Implementation   │ Read both layers into    │ Parse markdown into struct, │
│                  │ prompt — zero merge code │ merge per-field, resolve    │
│ Predictability   │ Agent decides; ~95%      │ Deterministic — every key   │
│                  │ project-wins             │ has a known resolved value  │
│ Configuration    │ Markdown — any prose     │ Schema'd YAML / JSON — only │
│   shape          │ that the agent can read  │ documented fields work      │
│ Debugging        │ Why did the agent pick   │ `aipe config print` shows   │
│                  │ this? — hard             │ resolved values             │
│ Onboarding       │ "Write a rule, it gets   │ "Write a rule in this YAML  │
│                  │  read" — minutes         │  schema with these fields"  │
│                  │                          │  — hours of doc reading     │
│ Failure blast    │ Surprise behaviour from  │ Schema mismatch fails at    │
│                  │ conflicting rules        │ load time (loud, immediate) │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

We gave up determinism. A user with a global rule "always use TypeScript" and a project rule "use plain JS for this codebase" relies on the agent doing the right thing at inference time. The agent does the right thing most of the time, but the contract is not enforced — a particularly cleverly-phrased global rule could mislead the agent. The cost is felt rarely; when it is felt, it's confusing.

We gave up a structured-config debugger. There's no `aipe config print` that shows the resolved view. Debugging "why did the agent suggest X?" is reading both `.aipe/project/*.md` and `~/.config/aipe/global/*.md` and reasoning about how the agent might have weighed them. With a structured config, the debug story is `print resolved_config; line 3 came from global/stack.md`. Today, the debug story is reasoning.

We gave up a schema. Anyone can write anything in `rules.md`. The agent reads it; if it's incoherent, the agent will say so or guess. With a schema, "this key isn't valid" is a load-time error. Today, "this key isn't valid" is a silent absorption into the prompt.

### Sub-block 2 — what the alternative would have cost

Schema'd config (YAML with documented fields, deterministic merge, CLI debugger) would have cost: a parser, a merger, a schema definition file, a documentation page, and a per-spec-type ingestor that knows which fields apply to which template. Roughly 500–1000 lines of code plus a maintenance commitment to keep the schema in sync with the templates. For a markdown-only plugin where there's no other code surface, that's a 10× expansion of the codebase to buy determinism on a problem (cross-layer config conflicts) that's hit maybe 5% of the time.

We'd gain a debugger and load-time errors. Both genuinely useful. But the cost is paid every release (schema must evolve with templates); the benefit is paid only when conflict bugs hit. Today's volume of conflict bugs doesn't justify the ongoing cost.

### Sub-block 3 — the breakpoint

Fine until a team is sharing global rules and projects start contradicting them in non-obvious ways. If aipe gets adopted by a team of 10 sharing the same `~/.config/aipe/global/` over a shared workspace, "the agent picked global over project" becomes a recurring confusion. The team would need either (a) a documented precedence rule baked into the wrappers ("project always wins on overlap"), or (b) a schema'd config with explicit precedence. (a) is cheap and works for most cases; (b) is the right move once shared-team usage scales past a few people.

A secondary breakpoint: when the number of layers exceeds two. If aipe ever adds an "organisation" layer between global and project (e.g., `~/.config/aipe/org/rules.md` for shared company rules), the no-merge model gets brittle — the agent has to weigh three sources. At that point, structured config earns its place.

---

## Tech reference (industry pairing)

### File-based configuration

- **Codebase uses:** plain markdown files at `.aipe/project/*.md` and `~/.config/aipe/global/*.md`.
- **Why it's here:** human-readable, version-controllable, no parser dependency.
- **Leading today:** plain markdown — `adoption-leading` for agent-readable config, 2026.
- **Why it leads:** every host agent reads markdown natively; no schema means no schema drift; commits are diff-friendly.
- **Runner-up:** YAML — `adoption-leading` for structured CLI config (kubectl, GitHub Actions); pulls in a parser dependency and a schema discipline.

### XDG Base Directory specification

- **Codebase uses:** `~/.config/aipe/global/` follows the XDG Base Directory standard (`$XDG_CONFIG_HOME/<app>/`).
- **Why it's here:** the agreed-upon location for cross-project user config on Linux/macOS; tools that respect XDG don't compete for `~/.aipe`.
- **Leading today:** XDG — `adoption-leading` for user-config locations, 2026.
- **Why it leads:** standardised across most modern CLI tools; user can set `$XDG_CONFIG_HOME` to relocate without per-app config.
- **Runner-up:** dotfile-at-home (`~/.toolrc`) — `adoption-leading` for older tools (git, ssh); collides under heavy multi-tool usage but still common.

---

## Summary

aipe's configuration is two layers: per-project (`.aipe/project/*.md` — required `context.md`, optional `rules.md`, `stack.md`, `aieng-curriculum.md`) and global (`~/.config/aipe/global/*.md` — all optional). Both layers are markdown read into the prompt at Step 2 of every wrapper; there is no merge step, no schema, no parser. The agent reasons about conflict at inference time. The constraint that drove this: keep configuration human-readable and human-editable without imposing a schema discipline. The cost being paid: cross-layer conflicts resolve non-deterministically (agent decides, project usually wins, sometimes surprisingly).

- Project layer is per-repo, committed; global layer is cross-project, optional.
- Both layers feed the prompt at once — no merge code, no resolved value.
- `context.md` is required; everything else is optional.
- A schema would buy determinism at the cost of 10× the code; today's volume doesn't justify it.
- Lives in step 1 (Data model) and step 4 (State ownership) of the system-design checklist — config IS the data the agent reads; layering IS the state ownership boundary between "what's mine personally" and "what's the project's."

---

## Interview defense

### What an interviewer is really asking

"Why two layers instead of one?" is testing whether you understand the separation between *personal context* (who the developer is, what they prefer) and *project context* (what the codebase is, what its constraints are). The dodge is to say "more configurability." The senior answer separates the two responsibilities and names why merging them into one layer would be worse for both onboarding and team sharing.

### Likely questions

**Q [mid]:** What's the difference between `.aipe/project/rules.md` and `~/.config/aipe/global/rules.md`?

**A:** `.aipe/project/rules.md` is committed to the repo and describes rules for this codebase — every contributor reads the same file. `~/.config/aipe/global/rules.md` is on my home machine and describes my personal rules — only I see it. Both reach the agent's prompt at Step 2 of every command. If they conflict, the agent typically defers to project-specific because it's more specific.

```
Repo                                Home
────                                ────
.aipe/project/rules.md              ~/.config/aipe/global/rules.md
     │                                      │
     │ everyone sees                        │ only I see
     ▼                                      ▼
shared context                       personal context
```

**Q [senior]:** Why isn't there a merge step or a config-resolver CLI? Wouldn't that make conflicts easier to debug?

**A:** A merge step buys determinism at the cost of every change shipping with a schema update. Today the config is prose — anyone can write any rule and the agent reads it. A schema would mean: every new field documented, every new field validated, the schema versioned in lockstep with the templates. For a markdown-only plugin where the consumer is an LLM, that ongoing cost outweighs the benefit. The 5% of cases where conflicts surprise is debuggable by reading both files; the 95% works fine without machinery. The trade flips if shared-team usage scales past a few people — at that point, "the agent picked global over project" becomes a recurring incident, and structured config earns its place.

```
Today                              Schema'd config
─────                              ───────────────
prose markdown                     YAML/JSON with schema
   │                                  │
   ▼                                  ▼
agent reasons                      parser → merger → resolver
about conflict                     deterministic output
   │                                  │
   ▼                                  ▼
~95% right                         100% predictable
   ▲                                  ▲
   │                                  │
zero code                          500–1000 lines + ongoing
                                   schema-sync work
                                   ── breaks first at team
                                      scale; fine at solo ──
```

**Q [arch]:** What changes if aipe adds an "organisation" layer between global and project?

**A:** Two-layer-no-merge stops scaling. With three layers (org > project > personal), the agent has more sources to weigh and the prompt-level conflict-resolution becomes less reliable. At three layers, the right move is either (a) a documented precedence rule in the wrappers ("project overrides org overrides personal" — explicit, one line), or (b) a structured config with schema'd merge. (a) is the cheap fix and probably right for most teams; (b) is the right fix when the org layer carries genuinely-binding rules (security policies, audit requirements) that must override personal preference. The breakpoint is the org layer carrying non-negotiable content. Until then, three layers + one precedence line is enough.

```
Today (2 layers)            At 3 layers (org layer added)
────────────────            ──────────────────────────────
global                        ─ Layer: precedence rule ─
   │                          ┌── breaks first if rules
project                       │   start conflicting
   │                          │   non-trivially across
agent reasons                 │   layers ────────────────┐
                              ▼                          │
                          org                            │
                          project                        │
                          personal                       │
                              │                          │
                              ▼                          │
                          add: "project > org >          │
                          personal" line in wrapper      │
                          (cheapest fix)                 │
                          ─ or jump to schema'd config ──┘
```

### The question candidates always dodge

**Q:** Why is everything markdown? Wouldn't JSON or YAML be safer?

**A:** Markdown is the format the host agent reads natively — there's no parser between the file and the prompt context. JSON / YAML buys schema validation and structured access; it costs (a) a parser dependency, (b) a schema definition file, (c) a load-time validator, (d) onboarding friction ("which field do I write this in?"). For an agent that's going to read the content as prose anyway, the JSON wrapper is an indirection that pays nothing.

```
┌──────────────────────┬──────────────────────────┬───────────────────────────┐
│ Dimension            │ Markdown (today)         │ YAML with schema          │
├──────────────────────┼──────────────────────────┼───────────────────────────┤
│ Onboarding           │ Write prose, agent reads │ Learn schema, fields,     │
│                      │ it — 5 min               │ valid values — 30 min     │
│ Tooling              │ git diff, any editor     │ schema validator, IDE     │
│                      │                          │ plugin, lint              │
│ Parser dependency    │ None                     │ Parser per host          │
│ Conflict detection   │ "Did the agent get it?"  │ "Schema says field X has │
│                      │ — soft signal            │ value Y" — hard signal    │
│ Failure blast        │ Bad prose = bad agent    │ Schema error = config     │
│                      │ output (recoverable)     │ refuses to load (loud)    │
│ Cost over time       │ Same per release         │ Schema must evolve with   │
│                      │                          │ every template change     │
└──────────────────────┴──────────────────────────┴───────────────────────────┘
```

For a markdown-plugin tool where the consumer is an LLM and the failure mode is "spec output is shaped wrong," markdown wins. For a tool where the consumer is a typed program and failure mode is "system crash," YAML wins. We picked the right format for our consumer.

### One-line anchors

- Two layers: global (~/.config/aipe/global/, optional) + project (.aipe/project/, committed, context.md required).
- Both layers feed the prompt; the agent resolves conflict at inference time.
- No merge step, no schema, no parser — markdown all the way.
- The model trades determinism for human-readability and zero machinery.
- Three-layer scaling (org added) is the natural breakpoint for structured config.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the global + project layers feeding the prompt. Label what's required, what's optional, where the curriculum file resolution differs.

### Level 2 — Explain it out loud
Explain context layering to a colleague who's used to ESLint cascading configs. Under 90 seconds.

Checkpoints:
- Did you name the two layer locations?
- Did you say "both feed the prompt, no merge"?
- Did you name what's required (`.aipe/project/context.md`)?

### Level 3 — Apply it to a new scenario

A user has `~/.config/aipe/global/rules.md` with "Always use Tailwind." Their project's `.aipe/project/rules.md` says "Use vanilla CSS." They run `/aipe:feature add a settings page`. What likely happens? Why?

Open `commands/feature.md` Step 2 (lines 50–80) and check the load order.

### Level 4 — Defend the decision you'd change

Pick the markdown-vs-schema tradeoff. Answer:

"If aipe were being designed for a team of 50 sharing a `~/.config/aipe/org/` layer, would you keep markdown or switch to schema'd YAML?"

### Quick check — code reference test
Without opening files:
- What's the required file in the project layer? → `.aipe/project/context.md`
- Where does the global layer live? → `~/.config/aipe/global/`
- At what step do wrappers load context? → Step 2
