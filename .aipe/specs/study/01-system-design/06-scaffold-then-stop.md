# Scaffold-then-stop

**Industry name(s):** Bootstrap idempotency, Confirmation gate, Init-then-pause
**Type:** Industry standard

> Step 1 of every command writes `.aipe/project/context.md` if missing, prints a re-run hint, and stops cold — the agent never proceeds with placeholder context.

**See also:** → [02-per-spec-type-contract](02-per-spec-type-contract.md) · → [04-context-layering](04-context-layering.md)

---

## Why care

You've cloned a repo and run its setup command, hit enter at the "do you want to use defaults?" prompt without reading it, and produced something that looked right at first glance but was secretly using `mydb` as the database name and `password123` as the password. Defaults are seductive; they let you skip the work of thinking about your context, and they're almost always wrong for your situation.

The pattern is *bootstrap idempotency with a confirmation gate*. `npm init` does this — it scaffolds `package.json` with placeholder fields and waits for you to fill them in. `terraform init` does this — it creates `.terraform/` and stops. `git init` does this — empty repo, no commits, waiting. The shape is: prepare the workspace, refuse to do real work until the user has supplied real intent. aipe's version refuses to generate a spec until `.aipe/project/context.md` describes the actual project. Here's how that works.

---

## How it works

A waiting room with two doors. The first door is the scaffold (the agent walks in, sees an empty `.aipe/` directory, opens the scaffold door, drops a placeholder, leaves). The second door is the real work — it's locked until `.aipe/project/context.md` describes the actual project. The agent stands at the first door, prints the instructions for unlocking the second, and stops.

### The check is file existence

Step 1 of every wrapper:

```
If `.aipe/project/context.md` does NOT exist in the current working directory:
  1. Create `.aipe/project/` and `.aipe/specs/` directories.
  2. Write `.aipe/project/context.md` with this placeholder body:
     ...
  3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:<type>.`
  4. **Stop. Don't proceed.** The user needs to fill in real context first.
```

If you're coming from frontend, think of this like a React component that renders a "loading" state when its required prop is undefined — but instead of rendering "loading," it renders "fill me in" and refuses to render anything else. The component is *strict* about its required prop, and "strict" means visible refusal, not silent fallback.

The practical consequence: a user who runs `/aipe:feature` in a fresh repo gets a scaffolded `.aipe/` and an explicit prompt to fill in `context.md`. They cannot accidentally generate a spec against the placeholder body. The agent refuses.

### Why the placeholder body is duplicated 11 times

Every wrapper contains the same 14-line scaffold body:

```markdown
# Project context

Describe this codebase so an AI agent can implement against it without asking.

## Stack
- runtime, framework, language

## Data model
- entities, relationships, where they live

## File structure
- top-level folders and what lives where

## What must not change
- public API surface, schema fields, ...
```

It's duplicated, not centralised. Why?

Two reasons. First, the duplication is mechanical and easy to verify: a one-line `grep "Describe this codebase"` across `commands/*.md` catches any drift. Second, centralising would require either: (a) every wrapper to dynamically read the body from a shared file (adding a dependency between wrappers), or (b) a build step that injects the body at release (adding CI). Both cost more than the duplication. The mirror discipline from [01-template-source-of-truth](01-template-source-of-truth.md) absorbs this cost — when the placeholder body needs to change, all 11 wrappers update in one mechanical pass.

This is like React's `propTypes` defaults — sometimes the cleanest thing is to write the same defaults in N components rather than abstract them prematurely. You pay for it in maintenance; you save on indirection.

### Why STOP and not "proceed with defaults"

The alternative would be: write the scaffold, fill the placeholder with sensible defaults, generate a spec against those defaults, and present it to the user as "draft — please customise." That's strictly more work for the agent and produces output the user has to actively un-trust.

By stopping, the contract makes the user say "yes, I've supplied real context" before any spec is generated. The spec quality is gated on the input quality — which is the right cost model for a tool that exists to produce shaped, project-specific specs.

This is what people mean by "garbage in, garbage out, but loudly." The agent doesn't accept garbage; it tells you what input it needs.

### Why this is the agent-side analog of an error boundary

In React, an error boundary intercepts a render that's about to fail and renders a fallback. The pattern is: detect the failure at the outermost layer that has enough information to recover; render the recovery state; don't propagate.

Step 1's scaffold is the analog. The "failure" is "this repo doesn't have project context yet." The outermost layer with enough information to recover is Step 1 — it can scaffold the file. The recovery state is the placeholder + the re-run hint. The propagation is suppressed (the rest of the command doesn't run).

The cost is one extra round-trip for first-time users. The benefit is no spec is ever generated against an empty or placeholder context.

### Idempotency

The check is "does `.aipe/project/context.md` exist?" — not "does it contain real content?" If the user runs the scaffold once, fills in `context.md` with real values, then runs `/aipe:feature` again, Step 1 sees the file exists and proceeds to Step 2. The agent doesn't re-scaffold; it doesn't re-prompt; it doesn't overwrite the user's content.

If the user runs `/aipe:feature` then `/aipe:debugging` in the same repo, both Step 1 scaffolds short-circuit on the second call — the directory and file already exist. The placeholder body is identical across all 11 commands, so the user can scaffold via any command and run any other after.

This is what idempotency means: running the operation twice yields the same end state as running it once. The agent can be re-invoked without harm.

The full picture is below.

---

## Scaffold-then-stop — diagram

```
Step 1 flow: idempotent scaffold + confirmation gate

┌─ Step 1 entry ──────────────────────────────────────────────────────────┐
│                                                                         │
│   .aipe/project/context.md exists?                                      │
│                                                                         │
└──────────────┬──────────────────────────────────┬───────────────────────┘
               │                                  │
               │ NO                               │ YES
               ▼                                  ▼
┌─ Scaffold path ──────────────────────┐  ┌─ Continue path ────────────────┐
│                                      │  │                                │
│  1. mkdir .aipe/project/             │  │  Proceed to Step 2             │
│     mkdir .aipe/specs/               │  │  (load context layers)         │
│                                      │  │                                │
│  2. Write placeholder context.md     │  │                                │
│     (14-line template, identical     │  │                                │
│     across all 11 commands)          │  │                                │
│                                      │  │                                │
│  3. Print: "✓ Scaffolded .aipe/.     │  │                                │
│     Edit context.md, re-run."        │  │                                │
│                                      │  │                                │
│  4. STOP                             │  │                                │
│                                      │  │                                │
└──────────────────────────────────────┘  └────────────────────────────────┘

  ┌─ Idempotency check ────────────────────────────────────────────────┐
  │                                                                    │
  │  Run scaffold path once  → file exists, directories exist          │
  │  Run scaffold path twice → file already exists; short-circuit      │
  │                            to Continue path                        │
  │                                                                    │
  └────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Where the scaffold lives:** every `commands/<type>.md` lines 1–50.

- `commands/feature.md` lines 1–50 — canonical example.
- The placeholder body (a 14-line `# Project context` template) appears identically in every wrapper.
- Step 1 closes with: `Print: '✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:<type> $ARGUMENTS.'` followed by `**Stop. Don't proceed.** The user needs to fill in real context first.`

**Companion in the codex skills:** every `skills/<type>/SKILL.md` carries the same Step 1. The mirror discipline from [01-template-source-of-truth](01-template-source-of-truth.md) keeps them in sync.

**Verification:** searching for the literal string `"Describe this codebase so an AI agent can implement against it without asking"` should return exactly 22 hits (11 commands + 11 skills) plus any documentation references. If it returns fewer, a wrapper has drifted.

---

## Elaborate

### Where this pattern comes from

The "init-then-stop" shape is older than software toolchains — it's how every form-based bureaucracy works (start the application, scaffold the boilerplate fields, refuse to proceed until you've filled them in). In software, `npm init`, `git init`, `terraform init`, `cargo new`, `pip install --user --requirement` all wear different versions of the same shape. The agent-side variant (an LLM agent that refuses to proceed with placeholder input) is newer, post-2023; it inherits the structure but adds the load-bearing "the agent prints the next action" line that file-based scaffolds don't need.

### The deeper principle

Reject low-quality inputs at the outermost gate. If the spec generation is going to be bad because the context is missing, find that out at Step 1, not Step 6. The user's time is more expensive than the agent's; surfacing the requirement at the front saves both.

### Where this breaks down

When a user *wants* the agent to proceed with defaults — say, in a one-off test environment where they don't care about spec quality. Step 1's refusal is non-negotiable; there's no `--skip-context` flag. The fix would be a flag or env var, but adding one undermines the gate's whole purpose. The current shape is "refuse, full stop"; the breakpoint is when test/sandbox usage becomes common enough that the friction outweighs the safety.

### What to explore next

- [02-per-spec-type-contract](02-per-spec-type-contract.md) → how Step 1 fits in the full 8-step flow
- [04-context-layering](04-context-layering.md) → why `.aipe/project/context.md` is required while the rest is optional
- `npm init --yes` — the antipattern that lets users skip the prompt; arguments for and against

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Scaffold-then-stop       │ Scaffold + proceed w/ defaults│
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ First-run UX     │ +1 round trip            │ Single command, output now   │
│                  │ (read prompt, fill,      │                              │
│                  │  re-run)                 │                              │
│ Output quality   │ Always project-shaped    │ Default-shaped, user has to  │
│                  │                          │ un-trust and rewrite          │
│ User trust       │ "Tool waits for me"      │ "Tool guesses for me"        │
│ Failure mode     │ User skips the fill →    │ Default spec ships → user     │
│                  │ they get an error msg    │ uses it without realising it │
│                  │ (loud)                   │ is generic (silent)          │
│ Edit cost        │ 11 placeholder copies    │ Same — defaults need same    │
│   (this code)    │ to keep in sync          │ duplication                  │
│ Onboarding doc   │ "Fill in context.md      │ "Run, edit output later"     │
│                  │ first" — explicit         │                              │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

We gave up the single-command first-run UX. A new user runs `/aipe:feature add dark mode` in a fresh repo and gets `✓ Scaffolded .aipe/. Edit context.md, re-run.` They have to: open `context.md`, fill in their stack and data model (~5–15 minutes of writing), then re-invoke `/aipe:feature add dark mode`. The extra round trip is the price.

The cost is felt only once per repo. After `context.md` exists, every subsequent `/aipe:<type>` call proceeds immediately. The per-repo cost is one-time; the per-command cost is zero. For a project with many specs generated over time, the amortised cost approaches zero. For a one-off use ("I just want to try aipe"), the friction is real.

We gave up the "tab-complete and go" demo path. Showing aipe to someone for the first time means showing them the scaffold + fill-in step before they see a generated spec. It's a slower demo than "run one command, see output."

### Sub-block 2 — what the alternative would have cost

If we had let the agent proceed with the placeholder body, every first-run user would get a generic spec full of phrases like "describe this codebase" — output shaped by the placeholder, not by the project. The user would have to actively recognise the output as generic and rewrite their context — but most users won't, because the output *looks* convincing. They'd ship a generic-looking spec, find out at code-review time that it was misshapen, and lose trust in the tool.

Worse, after the first generation, the agent has implicitly endorsed the placeholder content as "valid input." The user can't tell the difference between "agent did its best" and "agent had nothing to work with." Step 1's STOP makes that distinction explicit and loud.

### Sub-block 3 — the breakpoint

Fine until aipe is run in a sandboxed test environment where context doesn't matter and the user wants automated end-to-end testing. At that point, the scaffold-then-stop gate becomes friction without payoff. The fix would be a `--ci` flag or `AIPE_SKIP_SCAFFOLD=1` env var that proceeds with the placeholder. Adding one undermines the gate for human users but enables CI flows. Today, the friction in CI is real but rare (the tool has no CI of its own and isn't typically used in user CI). If it becomes common, add the flag with a loud "context is placeholder — output is not project-shaped" warning.

---

## Tech reference (industry pairing)

### Idempotent scaffold pattern

- **Codebase uses:** Step 1 in every wrapper.
- **Why it's here:** lets users invoke any spec command in a fresh repo without first running an "init" command separately.
- **Leading today:** init-then-stop — `adoption-leading` for tool bootstraps, 2026.
- **Why it leads:** `npm init`, `terraform init`, `git init`, `cargo new` — the pattern is the convention. Users recognise the shape.
- **Runner-up:** init-with-defaults (`npm init --yes`) — same shape with a fast-path flag; useful for testing, weak for production.

### Mandatory user input gate

- **Codebase uses:** Step 1's STOP after the scaffold.
- **Why it's here:** prevents the agent from generating output against placeholder content.
- **Leading today:** human-in-the-loop confirmation — `adoption-leading` for AI agent tools in 2026.
- **Why it leads:** every production agent system has at least one confirmation gate; the shape generalises across CLI tools and AI tools alike.
- **Runner-up:** "best effort with warning" (proceed with defaults but flag them) — `innovation-leading` in some scaffolding tools (yo, cookiecutter); higher friction-to-value ratio in agent contexts.

---

## Summary

Step 1 of every `/aipe:<type>` command checks whether `.aipe/project/context.md` exists. If not, it creates `.aipe/project/` and `.aipe/specs/`, writes a 14-line placeholder context file (identical across all 11 commands), prints a re-run hint, and stops cold. The agent never proceeds with placeholder context. The constraint that drove this: spec quality is gated on input quality, and the cheapest place to gate input quality is before any generation work. The cost being paid: one extra round-trip on first run per repo, and a 14-line placeholder body duplicated 22 times (11 commands + 11 skills).

- Step 1 is the agent-side error boundary — it intercepts missing project context at the outermost layer.
- The check is file existence, not content quality — idempotent under repeated invocation.
- The placeholder body is duplicated across wrappers rather than centralised — duplication is cheaper than indirection at N=22.
- "Garbage in, garbage out, but loudly" — the agent refuses placeholder input rather than producing generic output.
- Lives in step 1 (Data model) and step 5 (Failure handling) of the system-design checklist — the scaffold is the data-model initialiser; the STOP is the failure-handling shape for missing required input.

---

## Interview defense

### What an interviewer is really asking

"Why does it stop instead of proceeding with defaults?" is testing whether you understand input-quality gates and where to place them. The dodge is to say "we want users to customise." The senior answer names the cost of *not* gating (silent generic output, lost trust) and locates the gate at the outermost layer that can detect the failure cheaply.

### Likely questions

**Q [mid]:** Why is the scaffold body duplicated 22 times instead of being a shared file?

**A:** Centralising would require either: every wrapper to dynamically read from a shared file (which adds a runtime dependency between wrappers and breaks the "wrapper loads template; everything else is self-contained" invariant), or a build step that injects the body at release (which adds CI). Both cost more than the duplication. A one-line `grep` across `commands/*.md` and `skills/*/SKILL.md` catches any drift, and the mirror discipline updates all 22 copies mechanically when the body needs to change.

```
Today (duplication)         Hypothetical shared file
───────────────────         ──────────────────────────
commands/feature.md         commands/feature.md
  ┌─ Step 1 ─┐                 ┌─ Step 1 ─┐
  │ <body>   │                 │ <load shared/scaffold-body.md>
  └──────────┘                 └──────────┘
              ×22                          ×22
                              shared/scaffold-body.md
                              (now wrappers depend on it)
                              ─ adds runtime indirection ─
```

**Q [senior]:** What does the STOP buy that "proceed with defaults" doesn't?

**A:** It forces the user to acknowledge they've supplied real context. Without it, the agent generates output against the placeholder body, and the user can't tell the difference between "this is project-shaped" and "this is default-shaped." With it, the user knows: the spec they see is grounded in the `context.md` they wrote. The trade is one round-trip up front for permanent confidence in every subsequent generation. For a tool that exists to produce shaped, project-specific output, that trade is correct.

```
With STOP                              Without STOP
─────────                              ────────────
scaffold context.md                    scaffold context.md
   │                                       │
   ▼                                       ▼
user fills it in                       agent generates spec
   │  (5–15 min, one time)                 │  against placeholder
   ▼                                       ▼
re-run command                         user sees spec
   │                                       │
   ▼                                       ▼
spec generated against                 user has to detect
real context                           "this isn't shaped right"
   │                                       │
   ▼                                       ▼
high confidence                        low confidence,
                                       lost trust
```

**Q [arch]:** What changes when aipe is used in CI for automated spec regeneration?

**A:** The STOP becomes friction without payoff because the CI runner has no human to fill `context.md`. The right fix is a flag — `AIPE_SKIP_SCAFFOLD=1` or `--ci` — that lets the wrapper proceed with the placeholder, accompanied by a loud "context is placeholder — output is not project-shaped" warning in stdout. Adding the flag breaks the universal-STOP contract, but in the CI context the breakage is intentional. The breakpoint is "is CI usage common enough that the friction matters?" Today, no — aipe has no CI of its own and isn't typically run in user CI. If it becomes common, the flag earns its place; until then, the universal STOP is right.

```
Human run (today)                 CI run (hypothetical)
─────────────────                 ─────────────────────
fresh repo                        fresh repo + CI script
   │                                   │
   ▼                                   ▼
Step 1 scaffold + STOP            Step 1 sees AIPE_SKIP_SCAFFOLD=1
   │                                   │
   ▼                                   ▼
human fills context.md             scaffold + WARN + proceed
   │                                   │
   ▼                                   ▼
re-run, proceed                    spec generated against
                                   placeholder (low quality,
                                   loud warning)
                                   ─ breaks first if CI usage
                                     becomes common ─
```

### The question candidates always dodge

**Q:** Why not write the placeholder body once and let each wrapper import it via `${CLAUDE_PLUGIN_ROOT}/specs/_scaffold-body.md`?

**A:** Two reasons it costs more than the duplication, with the ledger:

```
┌────────────────────┬──────────────────────────┬────────────────────────────┐
│ Dimension          │ Duplication (today)      │ Shared file via import     │
├────────────────────┼──────────────────────────┼────────────────────────────┤
│ Drift detection    │ `grep` catches            │ Read shared/scaffold +    │
│                    │ drift trivially           │ verify each wrapper        │
│                    │                           │ imports the same way       │
│ Wrapper            │ Self-contained — wrapper  │ Wrapper depends on shared │
│   isolation       │ reads templates from       │ file existing + parseable │
│                    │ ${PLUGIN_ROOT}/specs/      │ in the cache              │
│ Edit cost (when    │ 22 mechanical updates     │ 1 update — wins here       │
│   body changes)   │ via mirror                 │                            │
│ Onboarding        │ "Here's the placeholder    │ "Here's the placeholder    │
│                    │ in every command file"    │ in a separate file the     │
│                    │ — 1 layer                 │ command imports" — 2 layer │
│ Failure blast     │ One wrapper drifts =      │ Shared file deleted /      │
│                    │ visible in `grep`         │ unparseable = all 22       │
│                    │ output                    │ wrappers break             │
│ Mirror discipline │ Existing — `cp` + `sed`   │ Would need to verify      │
│                    │                           │ the import line stays      │
│                    │                           │ valid in both ${ROOTS}     │
└────────────────────┴──────────────────────────┴────────────────────────────┘
```

The "edit cost" column has the shared file winning — but only on body-change events, which are rare (the body has changed maybe twice in the project's lifetime). Every other dimension prefers duplication for a wrapper-isolation invariant that's already in place. The shared file would earn its place if the body changed monthly; it doesn't.

### One-line anchors

- Step 1 refuses to proceed without real project context — the gate, not a suggestion.
- The check is file existence; idempotent under repeated invocation.
- The 14-line placeholder body is duplicated across 22 wrappers; drift detected by `grep`.
- "Garbage in, garbage out, but loudly" — the agent refuses placeholders rather than producing generic output.
- One-time per repo, never per command.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw Step 1's flow from memory: file-exists check, scaffold path, continue path. Include the idempotency check (twice-run leaves state stable).

### Level 2 — Explain it out loud
Explain scaffold-then-stop to a colleague who's used to `npm init`. Under 90 seconds.

Checkpoints:
- Did you name the file (`.aipe/project/context.md`)?
- Did you name the STOP and what it forces?
- Did you mention idempotency?

### Level 3 — Apply it to a new scenario

A user runs `/aipe:debugging cart total is wrong` in a brand-new repo with no `.aipe/` directory. What's the literal sequence of side-effects (directories created, files written, stdout printed)?

Open `commands/debugging.md` lines 1–50 and verify against your answer.

### Level 4 — Defend the decision you'd change

Pick the duplication-vs-shared-file tradeoff. Answer:

"If a future plugin version expanded the placeholder body to 80 lines, would you keep the 22-copy duplication or switch to a shared file?"

### Quick check — code reference test
Without opening files:
- What file does Step 1 check for existence? → `.aipe/project/context.md`
- What does Step 1 print before stopping? → `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:<type>.`
- How many copies of the placeholder body exist in the repo? → 22 (11 commands + 11 skills)
