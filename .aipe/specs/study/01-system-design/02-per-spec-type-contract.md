# Per-spec-type contract

**Industry name(s):** Template Method pattern, Command contract, Pipeline-with-checkpoints
**Type:** Industry standard

> Every `/aipe:<type>` command follows the same 8-step shape — Step 1 scaffold → Step 2 load context → Step 3 load template → Step 4 detect existing → CREATE or UPDATE branch → STOP. The shape is the API.

**See also:** → [01-template-source-of-truth](01-template-source-of-truth.md) · → [05-two-diff-update-mode](05-two-diff-update-mode.md) · → [06-scaffold-then-stop](06-scaffold-then-stop.md)

---

## Why care

You've onboarded onto a CLI with 11 subcommands and noticed each one prints "loading config…", "checking cache…", "validating…" in roughly the same order — and that you start to *expect* that order, so when one subcommand silently skips the cache check, you know something is off. The repeated shape is what lets you read the unfamiliar subcommand. That's the same job a per-spec-type contract does here: the 11 templates do different work, but every one is wrapped in the same outer flow, so a user who learns `/aipe:feature` learns 90% of `/aipe:debugging` for free.

The pattern is *template method* — a base flow with fixed phases, and per-instance hooks that customise specific phases without altering the order. Every web framework's request lifecycle is this shape (middleware → handler → response). Every test runner is this shape (setup → test body → teardown). Compilers' phases (lex → parse → analyse → emit) are this shape. The 8-step `/aipe:<type>` contract is the same idea applied to spec generation. Here's how that actually works in this codebase.

---

## How it works

A factory line with 8 stations. Each spec type wheels in raw material at station 1 and rolls out a finished spec at station 8 — but every type passes through the same stations in the same order, so a contributor inspecting station 4 of `/aipe:feature` looks the same as inspecting station 4 of `/aipe:debugging`. The work that *happens* at each station differs by spec type; the stations themselves don't.

### Step 1 — Initialize if needed (the scaffold gate)

The first thing every command does is check whether `.aipe/project/context.md` exists in the current working directory. If not, it scaffolds `.aipe/project/` and `.aipe/specs/`, writes a placeholder `context.md`, prints "Edit `.aipe/project/context.md`, then re-run", and **stops**. No spec is generated until the user fills in real project context.

If you're coming from frontend, you're used to React error boundaries — a component that intercepts the render path and renders a fallback when downstream state is incomplete. Step 1 is the agent-side version: it intercepts the spec-generation flow when the project context layer is incomplete, renders the scaffold, and refuses to proceed. The fallback isn't an error — it's a deliberate stop point with a prompt to the user.

The practical consequence: every fresh repo gets the same `.aipe/project/context.md` placeholder body. The placeholder is duplicated *verbatim* across all 11 command files. That's by design — users develop muscle memory for the placeholder shape, and the duplication is checked against the template at every release.

### Step 2 — Load context

The command reads context files into the prompt:

```
.aipe/project/context.md         (required — exists after Step 1)
.aipe/project/rules.md           (optional)
.aipe/project/stack.md           (optional)
.aipe/project/aieng-curriculum.md  (optional — /aipe:study only)
~/.config/aipe/global/identity.md  (optional)
~/.config/aipe/global/rules.md     (optional)
~/.config/aipe/global/stack.md     (optional)
~/.config/aipe/global/skills.md    (optional)
~/.config/aipe/global/aieng-curriculum.md  (optional — /aipe:study only)
```

Think of it like React Context providers — global wraps project wraps the spec-generation work. Both context layers feed the same prompt; the agent sees them concatenated. Missing optional files are skipped silently; a missing required file would have been caught at Step 1.

### Step 3 — Load the template

The command reads `${CLAUDE_PLUGIN_ROOT}/specs/<type>.md` (or the `CODEX` equivalent) — the canonical template from [01-template-source-of-truth](01-template-source-of-truth.md). The env-var swap is the only host-specific line in the whole command body.

### Step 4 — Detect existing spec → CREATE or UPDATE

The branch point. For most spec types, the check is "does `.aipe/specs/<type-plural>/<slug>.md` exist?" For `/aipe:study` (multi-file output), the check is "does `.aipe/specs/study/` contain `00-overview.md` or any file in a section sub-directory?"

```
if (output_path exists)  →  UPDATE MODE
else                      →  CREATE MODE
```

This is like Git's `init` vs `pull` — `init` brings a fresh repo into existence; `pull` updates an existing one. Step 4 picks the right command for the user's current state without making them think about which mode they want.

### Steps 5C–8C — CREATE MODE

```
Step 5C — Plan the spec        (apply template + context)
Step 6C — Generate              (compose the filled spec)
Step 7C — Save                  (write to .aipe/specs/<type-plural>/<slug>.md)
Step 8C — Report and STOP       (print path, wait for next instruction)
```

`/aipe:study` extends CREATE mode through Step 11C because it generates multiple files (overview, section directories, per-concept files, READMEs) and needs a richer report. Other spec types are single-file generators and stop at Step 8.

### Steps 5U–9U — UPDATE MODE

```
Step 5U — Read the existing spec
Step 6U — Diff against codebase + template
Step 7U — Print change plan and STOP for confirmation
Step 8U — Apply only confirmed changes
Step 9U — Report and STOP
```

The middle step — STOP for confirmation — is the contract's key invariant: UPDATE mode never edits files before the user explicitly approves the change plan. [05-two-diff-update-mode](05-two-diff-update-mode.md) covers the diff machinery.

### Step N — every command ends with STOP

The literal last line of every wrapper is some variant of "Stop. Wait for the user's next instruction." This is the contract's enforcement: the spec is the handoff; the implementation is the user's call. Auto-implementing breaks the review step that the whole tool exists to create.

In React terms: every command is a *controlled* component. The agent doesn't decide what happens next; the user does. The stop point is the equivalent of waiting for `onClick` instead of triggering it from inside the component.

### This is what people mean by a "command contract"

The shape generalises beyond AI tooling. CLI tools have argparse-then-dispatch-then-output. Web frameworks have middleware-then-handler-then-response. AWS Lambda has init-then-handler-then-cleanup. The lesson is that when you have N variations of the same kind of work, you don't write N independent flows — you write one flow with N hooks. The hooks earn the variation; the flow earns the predictability.

The full picture is below.

---

## Per-spec-type contract — diagram

```
The 8-step shape (every /aipe:<type> wrapper)

┌─ User invokes /aipe:<type> [intent] ───────────────────────────────────────┐
│                                                                            │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │
                                     ▼
┌─ Step 1 ───────────────────────────────────────────────────────────────────┐
│  .aipe/project/context.md exists?                                          │
│        no ──▶ scaffold + STOP   yes ──▶ continue                           │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │
                                     ▼
┌─ Step 2 ───────────────────────────────────────────────────────────────────┐
│  Load context (project + global + optional curriculum)                     │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │
                                     ▼
┌─ Step 3 ───────────────────────────────────────────────────────────────────┐
│  Load specs/<type>.md from plugin root                                     │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │
                                     ▼
┌─ Step 4 ───────────────────────────────────────────────────────────────────┐
│  Output path exists?                                                       │
│        no ──▶ CREATE MODE        yes ──▶ UPDATE MODE                       │
└────────────────────────────────────┬───────────────────────────────────────┘
                                     │
              ┌──────────────────────┴──────────────────────┐
              ▼                                             ▼
┌─ CREATE MODE ─────────────────────────┐  ┌─ UPDATE MODE ─────────────────────┐
│  Step 5C  Plan                        │  │  Step 5U  Read existing            │
│  Step 6C  Generate                    │  │  Step 6U  Diff codebase + template │
│  Step 7C  Save to output path         │  │  Step 7U  Print plan ── STOP       │
│  Step 8C  Report ── STOP              │  │  Step 8U  Apply confirmed changes  │
│                                       │  │  Step 9U  Report ── STOP           │
│  (study extends to Step 11C for       │  │                                    │
│   multi-file output)                  │  │                                    │
└───────────────────────────────────────┘  └────────────────────────────────────┘
```

---

## In this codebase

**Where the contract lives:** every `commands/<type>.md` file in the repo. The shape is literally repeated 11 times.

- **Canonical example:** `commands/feature.md` — lines 1–50 hold Step 1 (the scaffold), lines 51–80 hold Step 2 (load context), the rest walks Steps 3–8.
- **Largest extension:** `commands/study.md` — extends CREATE mode to Step 11C (multi-file output, section README generation) and UPDATE mode to Step 9U (with template-version flag taxonomy). 138 KB of wrapper, all built on the same 8-step skeleton.
- **Step 1 placeholder body** is byte-identical across all 11 commands — it's the same 14-line `# Project context` template. Each command's Step 1 also includes its own "re-run /aipe:<type> $ARGUMENTS" print line.

**Mirror to Codex:** the same 11 contracts exist as `skills/<type>/SKILL.md`. Discovery is enumerated in `.codex-plugin/plugin.json` lines 13–24.

**The spec for the contract:** `spec-aipe.md` lines 137–180 ("Per-spec-type contract") documents the canonical shape.

---

## Elaborate

### Where this pattern comes from

The template method pattern was named in *Design Patterns* (Gamma et al., 1994) but predates it — it's how Unix pipelines work, how `make` works, how every batch-processing pipeline has worked since the 60s. The CLI subcommand version (with shared global flags and per-subcommand hooks) became standard with git in 2005 and was codified in tools like `commander.js` and `click`. The AI-prompt application of the pattern is newer (post-2023) but borrows the same shape: a fixed outer flow that loads context, runs a template, writes output, and stops.

### The deeper principle

When you have N variations of the same kind of work, design the outer flow once and hook in the variations. The flow is the API for both your users *and* your contributors — users learn one shape and reuse it across all N variations; contributors implement a new variation by filling in the hooks, not by inventing new flow. The contract is what makes the system tractable past 3–4 variations.

### Where this breaks down

When the variations stop being variations. If one spec type needs to run *before* loading context (impossible in the current shape) or *skip* the template load entirely (also impossible), the contract becomes a cage. The fix is rarely to break the contract for one type — it's usually to add a hook in the shared flow (a `Step 2.5` between context and template) that all 11 types can opt into. Breaking the contract for one type is a leading indicator that the contract is the wrong shape and needs a redesign, not a per-type carve-out.

### What to explore next

- [06-scaffold-then-stop](06-scaffold-then-stop.md) → why Step 1's STOP is non-negotiable
- [05-two-diff-update-mode](05-two-diff-update-mode.md) → how UPDATE mode's two diffs work in detail
- `commander.js` / `click` / `cobra` — language-specific implementations of the same pattern for CLIs

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Shared 8-step contract   │ Per-type independent flows  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Edit cost        │ Add a step = 11 wrappers │ Add a step = 1 wrapper at a │
│                  │ updated (lockstep)       │ time (incremental rollout)  │
│ User learning    │ One shape ≈ 10 min       │ N shapes ≈ N × 10 min       │
│ Drift risk       │ "one wrapper skipped     │ N independent flows drift   │
│                  │ Step 2" caught by diff   │ independently               │
│ Per-type freedom │ Constrained — every type │ Unconstrained — each type   │
│                  │ obeys the shape          │ owns its own flow           │
│ Onboarding (new  │ "8 steps, every wrapper  │ "Read all 11 wrappers to    │
│   contributor)   │ same" — 30 minutes       │  understand the surface" —  │
│                  │                          │  4 hours                    │
│ Failure blast    │ Bug in shared step =     │ Bug in one step = one type  │
│                  │ all 11 types affected    │ affected                    │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

Every contract change is an 11-wrapper update. When v1.27.0 softened the v1.26.0 curriculum stop-gate in `/aipe:study`, that was a one-wrapper change — but most contract-level changes are 11. The recent v1.13.0 subtitle-block addition (the `**Industry name(s):**` / `**Type:**` lines) was a study-only change because it's a per-concept-file thing, not a contract-level thing. The pure contract-level changes since v1.0 are roughly: v1.11.0 (Interview defense section in study), v1.11.1 (two-diff UPDATE introduced — applies to all 11), and a few smaller. Each one touches 11 × 2 = 22 wrapper files plus 11 templates. That's the friction.

Per-type freedom is the other cost. The `/aipe:study` command would arguably benefit from a different Step 2 (it loads a curriculum file the others ignore) — and instead of breaking the shape, the contract absorbs the curriculum read as an *optional* file in Step 2. The compromise is that the contract's Step 2 loads ~5 files for most types and ~7 for `/aipe:study`. The shape holds; the body within the shape varies. That's the right call, but it requires writers to know "Step 2 includes the curriculum read only for study."

Failure blast at the contract level is the rarest but loudest cost. A bug in Step 1 (say, the scaffold body changes between commits and only 9 of 11 commands get the new body) shows up as inconsistent placeholder text across the 11 spec types — and users can tell. The mirror discipline catches this at PR time most of the time, but the failure mode is real.

### Sub-block 2 — what the alternative would have cost

If every spec type had its own independent flow, each command could optimise for its own shape — `/aipe:feature` could skip context entirely if `$ARGUMENTS` was rich enough; `/aipe:study` could skip Step 1 if it ran scoped to an existing study directory. The total wrapper line count would probably drop 15–25% because each flow could lose the parts it doesn't need.

But contributors would face N flows to learn instead of one. A senior dev opening the repo today sees 11 wrappers and reads `commands/feature.md` first — by line 50 they know how every other wrapper opens. With independent flows, they'd need to read all 11 to know whether any of them have surprising shape. The onboarding cost compounds: with 14 spec types planned (the README lists 14 even though only 11 exist today), independent flows would cost ~4 hours of "what does this one do" reading. The shared contract costs 30 minutes.

User learning is similar. Today, learning `/aipe:feature` teaches you everything that's *also* true of `/aipe:debugging`: Step 1 scaffold, Step 4 detect-existing, STOP at end. Under independent flows, every command is its own discovery exercise. The "tab to see all 14 spec types" pattern in the README assumes the shapes are interchangeable; they wouldn't be.

### Sub-block 3 — the breakpoint

Fine until two cohorts of users start needing genuinely different flows — say, "instant" specs (no context load, fire-and-forget for tiny edits) and "deep" specs (current shape). At that point, splitting the contract into two contracts is the move. The breakpoint is not file-count or version number; it's *user-flow divergence*. If `/aipe:onboarding` (a hypothetical 12th type) would be best served by skipping Step 1 and reading from a remote URL, the contract has hit its limit. Until then, the shared shape carries.

A secondary breakpoint: when the wrapper files exceed 200 KB each. `commands/study.md` is at 138 KB; the next big template-version change (v1.30.0+) might push it past 200. At that size, the byte-identical-mirror invariant from [01-template-source-of-truth](01-template-source-of-truth.md) gets fragile because reviewers can't reliably eyeball the diff. The contract holds at any size, but the mirror mechanism breaks first.

---

## Tech reference (industry pairing)

### Slash-command frontmatter (Claude Code / Codex)

- **Codebase uses:** `---` YAML frontmatter at the top of each `commands/<type>.md` with `description:` and `argument-hint:`. Example in `commands/feature.md` lines 1–4.
- **Why it's here:** how the host agent surfaces the command in the slash-command picker (description) and prompts for arguments (argument-hint). Without it, users see a bare command name with no hint.
- **Leading today:** YAML frontmatter — `adoption-leading` for markdown-as-config, 2026.
- **Why it leads:** parsed by every static-site generator, every editor's outline view, and most agent-plugin formats. Becomes interactive metadata without leaving markdown.
- **Runner-up:** TOML frontmatter (`+++ ... +++`) — `innovation-leading` in Hugo and some Rust ecosystems; cleaner syntax but smaller installed base.

### Plain-markdown prompts as wrappers

- **Codebase uses:** each `commands/<type>.md` is plain markdown with code fences for placeholders. No DSL, no templating engine.
- **Why it's here:** keeps the artifact human-readable; no build step required between editing and shipping.
- **Leading today:** plain markdown prompts — `adoption-leading` for agent plugin systems in 2026.
- **Why it leads:** every host agent already parses markdown; no preprocessor means no new bug surface; structured headings let the agent navigate sub-sections.
- **Runner-up:** templated markdown (Handlebars, Jinja) — `innovation-leading` in research-prompt frameworks (DSPy, Promptflow), more powerful but pulls in a runtime.

---

## Summary

Every `/aipe:<type>` command follows the same 8-step contract — Step 1 scaffold-if-needed → Step 2 load context → Step 3 load template → Step 4 detect existing → CREATE mode (5C–8C, study to 11C) or UPDATE mode (5U–9U) → STOP. The shape is duplicated across 11 wrappers in `commands/` and mirrored to 11 skills in `skills/`. The constraint that drove this: 11 spec types had to feel interchangeable to users so they could tab-complete across the picker without learning a new shape per type. The cost being paid: every contract-level change touches 22 wrapper files in lockstep, and Step 1's scaffold body is byte-duplicated across all 11.

- Step 4 is the CREATE-vs-UPDATE branch — file existence at the output path picks the mode.
- UPDATE mode has a STOP for confirmation in the middle (Step 7U) that the user must answer before edits land.
- Every command's last line is "STOP. Wait for the user's next instruction." — the contract enforces no-auto-implement.
- A bug in a shared step is an 11-type incident; the discipline that catches it is reading the diff at PR time, not CI.
- Lives in step 2 (Request flow) of the system-design checklist — the contract IS the request flow shape across all 11 spec types.

---

## Interview defense

### What an interviewer is really asking

The question behind "why every command has the same 8 steps" is "did you reason about user experience at scale, or did you copy-paste?" A junior answer says "consistency is good." A senior answer names the *user* benefit (predictability across 11 types) AND the *contributor* benefit (onboarding cost flat instead of growing) AND the cost paid (11-file edits per contract change). An architect answer names the breakpoint (when does the contract stop fitting?) and a candidate replacement.

### Likely questions

**Q [mid]:** What does Step 4 actually check, and why is it the branch point?

**A:** Step 4 checks whether the output path for this spec type already exists. For single-file types (10 of 11), that's `.aipe/specs/<type-plural>/<slug>.md`. For `/aipe:study` (multi-file), it's whether `.aipe/specs/study/` contains `00-overview.md` or any file in a section sub-directory. File presence picks CREATE vs UPDATE — fresh repos go to CREATE, returning users go to UPDATE.

```
Step 4 branch (literal check)
─────────────────────────────
output_path exists?
  │
  ├── no ──▶  CREATE MODE  (Steps 5C–8C)
  │
  └── yes ─▶  UPDATE MODE  (Steps 5U–9U)
```

**Q [senior]:** Why is the scaffold in Step 1 instead of inside CREATE mode at Step 5C?

**A:** Step 1 runs *before* anything else, including context load. CREATE mode runs *after* context load. If we put the scaffold inside CREATE, every command would have to attempt the load first and fail when `context.md` is missing — which means dealing with the missing-required-file error gracefully inside the per-type flow. Putting the scaffold at Step 1 short-circuits that: if context is missing, write the placeholder, print a re-run hint, stop. No attempt at loading, no error to handle, no per-type variation. The same pattern shows up in React error boundaries — catch the failure at the outermost layer that has enough information to recover.

```
Today (Step 1 scaffold)              If scaffold was in Step 5C
─────────────────────────             ──────────────────────────
Step 1: scaffold if needed            Step 2: load context
   │                                     │   "ERR: context.md missing"
   ▼                                     ▼
Step 2: load context                  Step 5C: handle ERR by scaffolding
   │  (always succeeds now)              │  (every CREATE flow needs
   ▼                                     ▼   this branch — DRY violation)
Step 3+                               Step 6C+

Wins: one scaffold path              Wins: scaffold colocated with create
Loses: Step 1 is "noisy" for         Loses: 11 per-type CREATE flows
       existing repos                       all carry the same error handler
```

**Q [arch]:** What's the breakpoint where the shared 8-step contract stops being the right design?

**A:** When two cohorts of users want genuinely different flows. Right now every spec type is a "load context, fill template, write file, stop" kind of operation — so the contract fits. The breakpoint is when a spec type emerges that needs a flow shape the contract can't absorb — say, a streaming flow that emits results as they generate, or a flow that pulls inputs from a remote URL instead of the user's repo. At that point, the contract splits: keep the current shape for the existing 11 types, define a second contract for the new shape. The break is at *user-flow divergence*, not at file-count or version number.

```
N spec types under one contract            Two contracts side-by-side
────────────────────────────────           ──────────────────────────────
   user                                       user
    │                                          │
    ▼                                          ├─▶ /aipe:<type> (8-step shape)
  /aipe:<type>                                 │
    │   (every type same 8 steps)              └─▶ /aipe:stream:<type>
    │                                                │   (different shape, e.g.
    │   ── breaks first when                         │    streaming output,
    │      a type genuinely needs                    │    no STOP at end)
    │      a different shape                         │
    ▼                                                ▼
  output
```

### The question candidates always dodge

**Q:** Why didn't you build a dispatcher (`/aipe <type> <intent>`) instead of 11 separate slash commands?

**A:** A dispatcher was the original v0.x design and was rejected for v1.0. Three reasons the dispatcher loses, cost-laid-out:

```
┌─────────────────────────┬───────────────────────────┬───────────────────────────┐
│ Dimension               │ 11 slash commands         │ One dispatcher            │
├─────────────────────────┼───────────────────────────┼───────────────────────────┤
│ Tab completion          │ Type / → 11 names appear  │ Type / → "/aipe" appears  │
│                         │   immediately             │   one row; user has to    │
│                         │                           │   know the 11 sub-types   │
│ Slash-command picker    │ All 11 surface in the     │ Only "/aipe" surfaces;    │
│   surface area          │   picker (high            │   sub-types invisible     │
│                         │   discoverability)        │   until typed             │
│ Per-type arg shape      │ `/aipe:study` takes no    │ Dispatcher needs to       │
│                         │   args; `/aipe:feature`   │   route based on first    │
│                         │   takes free-text intent  │   token of $ARGUMENTS —   │
│                         │                           │   one more bug surface    │
│ Edit cost               │ 11 files                  │ 1 dispatcher + 11 sub-    │
│                         │                           │   templates anyway        │
│ Failure mode            │ Wrong command name fails  │ Wrong sub-type silently   │
│                         │   loudly (autocomplete    │   dispatched to wrong     │
│                         │   doesn't match)          │   template                │
└─────────────────────────┴───────────────────────────┴───────────────────────────┘
```

The discoverability cost is the load-bearing one. New users learn aipe by typing `/aipe:` and tabbing — they see all 11 options without reading docs. Under a dispatcher, the discovery surface is the README. That cost compounds with every new user.

### One-line anchors

- The contract IS the API for both users and contributors — 11 types, one shape.
- Step 1's scaffold is the error boundary, not a hook in CREATE mode.
- Step 4's file-existence check is the CREATE-vs-UPDATE branch.
- UPDATE mode has a mandatory STOP for confirmation in the middle (Step 7U).
- The contract holds at 11; the breakpoint is user-flow divergence, not file count.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Close this file. Draw the 8-step flow from memory. Label the branch at Step 4 and the two STOP points (Step 1 if context missing, Step N at end).

### Level 2 — Explain it out loud
Explain the per-spec-type contract to an imaginary colleague who's just installed aipe and ran `/aipe:feature add dark mode` in a fresh repo. Walk them through what happens, step by step. Under 90 seconds.

Checkpoints:
- Did you mention the scaffold + STOP at Step 1?
- Did you say "you'd see CREATE mode this time, UPDATE mode if you re-run it"?
- Did you end with "and then it stops, waiting for you to review"?

### Level 3 — Apply it to a new scenario

A user runs `/aipe:feature` in a repo that has `.aipe/project/context.md` but no `.aipe/specs/features/` directory. What happens, step by step? Write out the sequence.

Then open `commands/feature.md` Step 1 (lines 1–50) and Step 4 (further down) and check whether your answer matches the wrapper's actual logic.

### Level 4 — Defend the decision you'd change

Pick the dispatcher-vs-11-commands tradeoff. Answer:

"If aipe were rewritten today knowing it would grow to 25 spec types, would you still ship 25 separate slash commands? Or would the dispatcher start to earn its place?"

Reference:
- Point to `.codex-plugin/plugin.json` lines 13–24 (the `skills` array) to support what exists.
- Point to what would need to change in `commands/` and `skills/` if you went dispatcher.

### Quick check — code reference test
Without opening files:
- What file holds the canonical scaffold-body template? → every `commands/<type>.md` Step 1 (lines 1–50)
- What's the branch condition at Step 4 for single-file types? → output path `.aipe/specs/<type-plural>/<slug>.md` exists?
- What's the last line of every wrapper? → "Stop. Wait for the user's next instruction."
