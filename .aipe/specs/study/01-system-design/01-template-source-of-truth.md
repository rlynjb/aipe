# Template as the single source of truth

**Industry name(s):** Single Source of Truth, Template / Wrapper pattern, Adapter layer
**Type:** Industry standard · Language-agnostic

> 11 markdown templates back two different agent hosts (Claude Code and Codex CLI) through paper-thin wrappers — edit a template once, both surfaces update on the next plugin pull.

**See also:** → [03-plugin-distribution](03-plugin-distribution.md) · → [02-per-spec-type-contract](02-per-spec-type-contract.md)

---

## Why care

You've worked on a system where the same logic existed in two slightly-different copies — say, validation rules duplicated between the form and the API — and watched a bug fix land in one copy but not the other. The whole architecture shrugged its shoulders for six months until somebody noticed. That's the everyday failure mode this pattern prevents: two surfaces sharing one truth, instead of two surfaces drifting independently.

The pattern is *single source of truth with adapter wrappers*. One file holds the actual behaviour; one wrapper per consumer makes it callable in that consumer's idiom. It's the same shape as a shared validation schema with React + Express adapters, a `package.json` that backs both `npm` and `pnpm`, a Postgres view that backs both REST and GraphQL. The wrappers can do platform-specific glue, but they don't carry the behaviour. Here's how that works in this codebase.

---

## How it works

Two doors, one room behind them. The room is the prompt template; the doors are the slash-command bodies one host agent reads (Claude Code) and the other host agent reads (Codex CLI). Walk through either door, you arrive at the same room — and any change you make to the room is visible from both doors next time anyone walks in.

### The template layer is the room

The template files live at `specs/<type>.md`. There are 11 of them today: `plan.md`, `feature.md`, `debugging.md`, `study.md`, `audit.md`, `testing.md`, `user-stories.md`, `refactor.md`, `migration.md`, `performance.md`, `integration.md`. Each one is a prompt — instructions a host agent reads and executes against the user's project context. They're plain markdown; there is no compile step, no preprocessor, no schema.

If you're coming from frontend, you're used to thinking of a "source of truth" as a TypeScript type or a Zod schema — something the compiler enforces. Here it's different: the source of truth is a *prompt*, and the enforcement is by-convention plus the mirror step described below. The host agent reads the template at runtime and follows it; there's no IDE that will flag a drift between the template and the wrapper. The mechanical mirror is what keeps them honest.

The practical consequence: every behaviour change starts in `specs/<type>.md`. You don't edit the command file to fix a bug in `/aipe:feature`'s output — you edit `specs/feature.md`. The command file is downstream of it.

### The wrapper layer is the two doors

Each spec type has two wrappers:

- `commands/<type>.md` — the Claude Code slash-command body
- `skills/<type>/SKILL.md` — the Codex skill body

They are byte-identical apart from one substitution: every `${CLAUDE_PLUGIN_ROOT}` in the Claude wrapper becomes `${CODEX_PLUGIN_ROOT}` in the Codex skill. That's the only difference. Same instructions, same Step 1–11 flow, same canonical sections, same stop-points.

The mirror is mechanical:

```
cp commands/<type>.md skills/<type>/SKILL.md
sed -i '' 's|${CLAUDE_PLUGIN_ROOT}|${CODEX_PLUGIN_ROOT}|g' skills/<type>/SKILL.md
```

This is like React's `forwardRef` — you have a component that does the work, and a wrapper that adapts it to the parent component's interface. The wrapper carries no logic. If you find yourself adding behaviour to a wrapper (not to the template), you've broken the invariant.

This works whether the host agent is Claude Code (Mac app, VS Code, JetBrains, web) or Codex CLI. It breaks if anyone hand-edits one wrapper without mirroring — at which point Claude Code users and Codex users see different behaviour for the same `/aipe:feature` command, and the bug report won't be reproducible across the two surfaces.

### The plugin-root env var is the load-bearing seam

Each host agent injects a different env var pointing at the plugin's install location:

- Claude Code: `${CLAUDE_PLUGIN_ROOT}` resolves to something like `/Users/rein/.claude/plugins/cache/rlynjb-aipe/aipe/1.29.0/`
- Codex CLI: `${CODEX_PLUGIN_ROOT}` resolves to the equivalent under Codex's install dir.

Both wrappers reach into their plugin root for the template:

```
Step 3 — Load the template
  Read ${CLAUDE_PLUGIN_ROOT}/specs/<type>.md
  (or ${CODEX_PLUGIN_ROOT}/specs/<type>.md for Codex)
```

Think of it like `process.env.NODE_ENV` in a Next.js app, but injected by the host agent rather than the build. The wrapper doesn't know whether it's running in Claude Code or Codex — it just dereferences the env var the host provides. The two hosts have agreed on the convention `${<HOST>_PLUGIN_ROOT}/specs/<type>.md` so the wrappers can be near-identical.

### What the wrappers actually contain

A wrapper is the 8-step contract described in [`02-per-spec-type-contract`](02-per-spec-type-contract.md): Step 1 scaffold, Step 2 load context, Step 3 load template (this is where the env-var seam lives), Step 4 detect-existing-spec, then CREATE or UPDATE branch. The wrappers also carry the canonical section list, the UPDATE-mode flags, and the Step 8U repair recipes — that's why they're large (the study wrapper is 138 KB).

The body of the work — what each section should contain, what the diagrams should look like, what the validation block requires — lives in `specs/<type>.md`. When you bump v1.28.0 → v1.29.0 (the recent system-design-templates change), you're editing `specs/study.md` first, then re-mirroring `commands/study.md` and `skills/study/SKILL.md` to match.

### This is what people mean by "single source of truth"

The pattern generalises beyond plugin systems. Any time you have two consumers of the same logic — two frontends of the same API, two SDKs over the same protocol, two adapters over the same compute engine — the question is *which one is canonical?* Pick one, and treat the others as mechanical translations. Don't let logic live in two places, even when "they look the same right now" — because they won't, in three months, when someone fixes a bug in one and forgets the other.

The full picture is below.

---

## Template-as-source-of-truth — diagram

```
Single source of truth with two consumer wrappers

┌─ Template layer ──────────────────────────────────────────────────────────┐
│                                                                           │
│   specs/feature.md   specs/debugging.md   specs/study.md   …   (11 files) │
│         ▲                  ▲                  ▲                           │
└─────────│──────────────────│──────────────────│──────────────────────────-┘
          │ reads at runtime │                  │
          │                  │                  │
┌─ Wrapper layer ───────────────────────────────────────────────────────────┐
│                                                                           │
│   commands/feature.md  ┐   commands/debugging.md  ┐   commands/study.md ┐ │
│                        │                          │                     │ │
│   skills/feature/      ┘   skills/debugging/      ┘   skills/study/     ┘ │
│     SKILL.md                 SKILL.md                   SKILL.md          │
│                                                                           │
│   Identical content per spec type ── one swap:                            │
│       ${CLAUDE_PLUGIN_ROOT}  ←→  ${CODEX_PLUGIN_ROOT}                     │
│                                                                           │
└──────────────────────────────────────┬────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        │                                                             │
        ▼                                                             ▼
┌─ Host: Claude Code ──────────────┐              ┌─ Host: Codex CLI ──────────────┐
│   reads commands/<type>.md       │              │   reads skills/<type>/SKILL.md │
│   resolves ${CLAUDE_PLUGIN_ROOT} │              │   resolves ${CODEX_PLUGIN_ROOT}│
└──────────────────────────────────┘              └────────────────────────────────┘
```

---

## In this codebase

**Template files:** `specs/feature.md`, `specs/debugging.md`, `specs/study.md`, `specs/audit.md`, `specs/testing.md`, `specs/user-stories.md`, `specs/refactor.md`, `specs/migration.md`, `specs/performance.md`, `specs/integration.md`, `specs/plan.md` — 11 files, ~294 KB combined (study.md is by far the largest at 294 KB; the rest are 1–6 KB).

**Wrapper files (Claude Code):** `commands/<type>.md` × 11. Loaded via the slash-command discovery in Claude Code.
- Largest: `commands/study.md` (~138 KB).
- Each wrapper opens with frontmatter (`description:`, `argument-hint:`) and then walks the 8-step contract.
- Reference: `commands/feature.md` lines 1–50 show the canonical Step 1 scaffold body — the same body appears in every wrapper.

**Wrapper files (Codex CLI):** `skills/<type>/SKILL.md` × 11. Same content as the Claude versions, env-var-swapped.

**Manifest pointers:**
- `.codex-plugin/plugin.json` lines 13–24 enumerate each `skills/<type>/` directory in the `skills` array — this is how Codex discovers the wrappers.
- `.claude-plugin/plugin.json` doesn't enumerate; Claude Code discovers `commands/*.md` by directory scan.

**The mirror command (from `spec-aipe.md`):**

```bash
cp commands/<type>.md skills/<type>/SKILL.md
sed -i '' 's|${CLAUDE_PLUGIN_ROOT}|${CODEX_PLUGIN_ROOT}|g' skills/<type>/SKILL.md
```

The script is not enforced by CI — there is no CI. The invariant is enforced by reading the diff before commit.

---

## Elaborate

### Where this pattern comes from

The pattern is older than software. Newspaper wire services in the 1800s wrote one article and distributed it to every member paper, which then ran it under their own masthead. The article was canonical; the masthead was the wrapper. Software inherited the shape via library design (one implementation, many language bindings) and amplified it with package managers in the late 90s. The Single Source of Truth term itself became common around the time of the data-warehouse movement, but the shape generalises far beyond data.

### The deeper principle

When two consumers need the same behaviour, decide which one is canonical and treat the rest as projections. A projection is allowed to do glue — env-var swaps, type casts, idiom adaptation — but it must not own behaviour. The moment a projection contains a decision the canonical layer doesn't, you have two truths, and the system has started lying to itself.

### Where this breaks down

When the two consumers genuinely want *different* behaviour. If `/aipe:feature` should generate a different spec shape in Claude Code than in Codex CLI — say, because Codex's argument parsing differs — the wrapper-only-glue invariant breaks. At that point you either accept divergence (two templates, named differently), promote the difference into the template (a `host` parameter), or give up the dual-surface story. None of these are great. The pattern is fragile to "almost-identical" — it works perfectly when the consumers are interchangeable and breaks honestly when they aren't.

### What to explore next

- [03-plugin-distribution](03-plugin-distribution.md) → how Claude Code and Codex marketplaces both reach the same git repo
- [05-two-diff-update-mode](05-two-diff-update-mode.md) → why the two-diff UPDATE mode requires the template layer to be canonical
- The Anthropic SDK's tool definitions (JSON Schema) are a similar pattern: one schema definition, two consumers (the LLM's tool-use protocol and the developer's type system).

---

## Tradeoffs

The cost of "one truth, two doors" is paid every time you edit a wrapper. The cost of "two trues" is paid every time the system surprises a user. The two cost shapes are not symmetric.

```
┌──────────────────┬───────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Single source + mirror    │ Two independent wrappers    │
├──────────────────┼───────────────────────────┼─────────────────────────────┤
│ Edit cost        │ 3 files per change        │ 2 files per change          │
│                  │ (template + 2 wrappers)   │ (just the two wrappers)     │
│ Drift risk       │ Caught by diff before     │ Caught by user-reported     │
│                  │ commit (mirror script)    │ bug six months later        │
│ Onboarding       │ One file to understand    │ Two files to keep in sync   │
│                  │ behaviour                 │ mentally                    │
│ CI cost          │ None — no CI to fail      │ None — but should have CI   │
│                  │                           │ to catch drift              │
│ Vendor lock-in   │ Same: both surfaces       │ Same                        │
│                  │ depend on the convention  │                             │
│ Failure blast    │ Bug in template → both    │ Bug in one wrapper → one    │
│                  │ surfaces broken at once   │ surface broken; harder to   │
│                  │ (loud, immediate)         │ notice (quiet, slow)        │
└──────────────────┴───────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

The mirror step costs three files per behavioural change instead of two. Every time `specs/feature.md` changes — say, the v1.21.0 Tradeoffs restructure that affected `specs/study.md` — you re-mirror `commands/study.md` and `skills/study/SKILL.md`. The `cp` + `sed` is mechanical (15 seconds), but it's a step a contributor can forget. The whole repo has no CI to catch the omission; only the diff at PR time reveals it. With 11 spec types, the friction adds up: every release ships 11 × 2 = 22 wrapper updates alongside the template change, even when no behaviour changes (e.g., a version bump in `.claude-plugin/plugin.json` cascades to `.codex-plugin/plugin.json`).

The onboarding cost is one extra concept to teach contributors. A new contributor sees three files for "the feature template" — `specs/feature.md`, `commands/feature.md`, `skills/feature/SKILL.md` — and has to learn which one to edit. The current `README.md` documents this in the "Editing or adding spec templates" section, but it's still a layer of indirection that takes 10 minutes to internalise.

Failure blast is the largest cost when it does fire. If a bug lands in the template, both Claude Code and Codex users hit it on the next plugin update. Bug reports come in pairs ("I get the same error in Codex"), confirming the bug is in the canonical layer and not a host-specific issue — that's the silver lining, but it means a single template bug is a two-surface incident.

### Sub-block 2 — what the alternative would have cost

If we had kept `commands/<type>.md` and `skills/<type>/SKILL.md` as fully-independent files, the per-change cost would have been two files instead of three — a 33% saving on edits. But the drift cost would have been continuous and silent. A bug fix that ships in Claude Code but not Codex (or vice versa) is the kind of thing nobody notices until a user reports identical commands behaving differently across the two surfaces. With 11 spec types and ~5 plugin releases over the v1.0–v1.29 lifespan, the expected number of drift incidents under independent-wrappers is around 3–5 silent divergences. Each one is a half-day to diagnose because the reporter can't reproduce on their host and the author can't reproduce on theirs.

The CI cost would have appeared eventually. Independent wrappers + 11 spec types + 2 hosts = enough surface to need some form of drift detection. The mirror script we use today is an *avoidance* of that CI cost: by making the wrappers byte-identical except for one substitution, drift is detectable by `diff` instead of by a test suite. We saved building CI by adopting a stronger invariant.

### Sub-block 3 — the breakpoint

Fine until a spec type genuinely needs different content in Claude Code vs Codex — typically when one host adds an argument-parsing feature or a UI hint the other doesn't have. At that point, the byte-identical-except-env-var invariant breaks, and either: (a) a third file appears (`commands/feature.md`, `skills/feature.md`, `specs/feature.md` carrying the shared body and the wrappers carrying host-specific pre/post), or (b) the spec type is forked (`feature-cc.md` vs `feature-codex.md`). Neither is fatal; both end the pure-mirror invariant.

A second breakpoint: when the wrappers themselves grow to where editing the same 138 KB twice per release is painful. `commands/study.md` is already at 138 KB. Two more spec types of that size and the mirror step is no longer a 15-second operation; at that point, replacing `cp` + `sed` with a generated wrapper (the wrapper becomes a build artifact, the template stays the source) is the obvious move.

---

## Tech reference (industry pairing)

### Claude Code plugin marketplace

- **Codebase uses:** `.claude-plugin/marketplace.json` (rlynjb-aipe namespace) + `.claude-plugin/plugin.json` (version, name, repo URL). Installed via `/plugin marketplace add rlynjb/aipe` then `/plugin install aipe@rlynjb-aipe`.
- **Why it's here:** the discovery + install path for Claude Code users. Without it, users would have to manually clone the repo and configure Claude Code's plugin paths.
- **Leading today:** Claude Code plugin marketplace — `adoption-leading` for IDE-agent plugins, 2026.
- **Why it leads:** native discovery inside the agent's slash-command picker, automatic version pinning per session, no separate package manager required.
- **Runner-up:** Continue.dev's plugin model — `innovation-leading` for VS Code-integrated agent customisation; broader IDE coverage but smaller agent-side audience.

### Codex CLI plugin marketplace

- **Codebase uses:** `.codex-plugin/plugin.json` with a `skills` array enumerating each `skills/<type>/` directory. Installed via `codex plugin marketplace add rlynjb/aipe`; tracked in `~/.codex/config.toml`.
- **Why it's here:** the discovery + install path for Codex CLI users. Codex has a different plugin shape than Claude Code (skills array vs directory scan), which is why the wrapper directories differ in layout even when their contents are identical.
- **Leading today:** Codex CLI plugins — `innovation-leading` for terminal-native AI workflows, 2026.
- **Why it leads:** TOML-based config, shells well into git workflows, runs identical content across macOS / Linux without IDE attachment.
- **Runner-up:** Aider's `--model` + `--read` flags — `adoption-leading` for terminal-native code-editing agents; no plugin layer, but a wider installed base today.

### Markdown as a prompt format

- **Codebase uses:** plain markdown for every template (`specs/<type>.md`) and wrapper (`commands/<type>.md`, `skills/<type>/SKILL.md`). No build step, no preprocessor, no schema.
- **Why it's here:** markdown is what host agents read natively; turning prompts into markdown makes the templates human-editable and version-controllable without tooling.
- **Leading today:** markdown — `adoption-leading` for LLM-readable instruction formats, 2026.
- **Why it leads:** every host agent parses markdown into its prompt context; structured headings let the agent navigate sub-sections; code fences delimit examples without escaping.
- **Runner-up:** MDX — `innovation-leading` for prompts that mix markdown with interactive components (e.g., parameterised prompts in agent IDEs), still under-adopted.

---

## Summary

The 11 spec templates in `specs/*.md` are the single source of truth for aipe's behaviour. Two wrappers per spec type — `commands/<type>.md` for Claude Code and `skills/<type>/SKILL.md` for Codex CLI — load the canonical template at runtime via a host-injected env var (`${CLAUDE_PLUGIN_ROOT}` or `${CODEX_PLUGIN_ROOT}`). The constraint that forced this design: two host agents had to consume the same prompt logic without diverging across versions. The cost being paid: three files per behavioural edit instead of two, plus a mechanical mirror step (`cp` + `sed`) that has no CI to enforce it.

- The room is `specs/<type>.md`; the doors are the two wrappers — change the room, both doors see it.
- Wrappers carry no behaviour; the only allowed difference between `commands/<type>.md` and `skills/<type>/SKILL.md` is the env-var swap.
- The mirror is enforced by convention and pre-commit review, not by tooling — there is no CI in this repo.
- A bug in the template is a two-surface incident (loud); a bug under independent wrappers would be a one-surface incident (quiet, slow).
- Lives in step 2 (Request flow) and step 4 (State ownership) of the system-design checklist — every command's request flow loads the canonical template; state ownership is "template owns behaviour, wrappers own host adaptation."
- The pattern breaks honestly the moment a spec type genuinely needs host-specific behaviour.

---

## Interview defense

### What an interviewer is really asking
When someone asks how aipe stays consistent across Claude Code and Codex CLI, they're testing whether you understand the cost of code duplication vs the cost of the abstraction that prevents it. The dodge is to say "we use a shared template" without naming what's *not* shared (the env-var swap) or how the invariant is *enforced* (mechanical mirror, pre-commit review, no CI). A senior answer names the cost ledger on both sides — what the mirror buys, what it costs, and where it breaks.

### Likely questions

**Q [mid]:** Why are `commands/feature.md` and `skills/feature/SKILL.md` two separate files if they're identical?

**A:** They're identical except for one substitution — `${CLAUDE_PLUGIN_ROOT}` in the Claude wrapper becomes `${CODEX_PLUGIN_ROOT}` in the Codex skill. The plugin hosts inject different env vars at runtime, so each wrapper has to dereference the host-specific one. Both wrappers exist because Claude Code discovers slash commands by scanning `commands/*.md` and Codex enumerates skills via `skills/<dir>/SKILL.md` in `.codex-plugin/plugin.json` — different discovery conventions force different on-disk layouts. The mirror is mechanical: `cp` followed by one `sed`.

```
commands/feature.md  ───copy + sed─▶  skills/feature/SKILL.md
                              │
                              ▼
                    ${CLAUDE_PLUGIN_ROOT}
                              │ replace
                              ▼
                    ${CODEX_PLUGIN_ROOT}
```

**Q [senior]:** Why mirror instead of generating one wrapper from the other at build time?

**A:** Two reasons. First, there's no build step in the repo — markdown is the artifact, and we keep it that way so users see exactly the file the host will read. Adding a build means adding CI, adding a `dist/` directory or a publish step, adding a release process more complex than `git push`. Second, the mirror is so mechanical (`cp` + one `sed`) that the cost of generating it is roughly the cost of running it — but generation hides the substitution one layer deeper, while running it leaves it visible in the commit diff. Reviewers can see drift in the PR. Where it'd change: if we add a third host (say, Aider) or a fourth, the mirror becomes a triangle instead of a line, and a generator starts to earn its place.

```
Mirror (current)                     Generator (alternative)
────────────────                     ───────────────────────
commands/<type>.md                   specs/<type>.md (source)
       │                                    │
   cp + sed                            generator script
       │                                    │
       ▼                                    ▼
skills/<type>/SKILL.md             commands/<type>.md
                                    skills/<type>/SKILL.md
                                    (both build artifacts)

Wins: visible in diff,              Wins: zero-cost mirror,
      no CI required                       N hosts not 2

Loses: 3rd host = triangle          Loses: build step,
                                            CI to enforce,
                                            wrappers leave git
```

**Q [arch]:** What changes if you add a third agent host (say, Aider) — does the mirror still hold?

**A:** It bends. With two hosts, the mirror is a line (Claude → Codex); with three, it's a star with the template at the centre and three wrappers radiating out. The cost grows linearly with N hosts in disk space, in edit time, and in mental overhead. At three hosts the manual mirror starts to creak — every behavioural edit becomes four files (template + 3 wrappers), and human reviewers can't reliably catch a missed mirror in three diffs at once. The fix at that scale is a generator: keep the template canonical, generate the N wrappers at release time, and let CI run the generator on every PR. The current architecture's breakpoint is "fine until N=2; reconsider at N≥3."

```
N = 2 (today)            N = 3 (Aider added)
─────────────            ──────────────────────────
   template                       template
    │   │                       /    │    \
    ▼   ▼                      ▼     ▼     ▼
   CC   Codex             CC   Codex   Aider
   (cp+sed: 2 files)      (mirror by hand:
                           3 files, harder to
                           catch missed updates)
                           ── breaks first ──
```

### The question candidates always dodge

**Q:** Why didn't you just use one wrapper file with `if host == 'claude'` branches?

**A:** That's the obvious-but-wrong answer. A single wrapper with host branches puts the host-detection logic inside the prompt — and the host agent is the *executor* of the prompt, so making it decide whether it's running in itself is a recursion that doesn't pay. It also moves the byte-identical invariant from a property of two files (where it's enforced by `diff`) into a property of one file with two execution paths (where it's enforced by code review of every branch). The current shape has a clean property: byte-identical means byte-identical. A branch-per-host wrapper has a fuzzy property: "branches handle the right host." The cost ledger:

```
┌────────────────────┬──────────────────────────┬────────────────────────────┐
│ Dimension          │ Two wrappers + mirror    │ One wrapper + host branches│
├────────────────────┼──────────────────────────┼────────────────────────────┤
│ Files per release  │ 3 (template + 2 wrap.)   │ 2 (template + 1 wrapper)   │
│ Lines of branch    │ 0                        │ ~10 per spec type × 11 =   │
│   logic            │                          │ ~110 lines of host glue    │
│ Drift detection    │ `diff` between wrappers  │ Code review of every branch│
│ Onboarding cost    │ "wrappers are mirrored"  │ "wrappers have branches,   │
│                    │ — 30 seconds             │  here's where the host is  │
│                    │                          │  inspected" — 10 minutes   │
│ Failure blast      │ Same — bug in template = │ Same in template + new     │
│                    │ both hosts break         │ class of bug: branch logic │
│                    │                          │ inverted, one host silent  │
└────────────────────┴──────────────────────────┴────────────────────────────┘
```

The branch-per-host design saves one file per release and pays in a new class of bug (branch logic gets the host backwards) and 10 extra minutes of contributor onboarding per person. With ~11 spec types and a small contributor base, that's the wrong trade.

### One-line anchors

- The room is the template; the doors are the wrappers — change the room, both doors see it.
- The only allowed difference between `commands/<type>.md` and `skills/<type>/SKILL.md` is one env-var name.
- Drift is enforced by `diff`, not by CI — and `diff` is enough at N=2 hosts.
- A bug in the template is a two-surface incident, which is loud and easy to triage.
- The breakpoint is N=3 hosts: at that point, replace the manual mirror with a generator.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Close this file. Draw the layered diagram from memory: template layer at top, wrapper layer in the middle, two host boxes at the bottom. Label the env-var seam.

Open the file. Compare.

✓ Pass: layers labelled, env-var swap shown, wrapper directory layouts named.
✗ Fail: re-read the diagram, wait 10 minutes, retry.

### Level 2 — Explain it out loud
Explain template-as-source-of-truth to an imaginary colleague who's used to React + Express monorepos. No notes, under 90 seconds.

Checkpoints:
- Did you name the canonical layer (`specs/*.md`)?
- Did you name the mirror command (`cp` + `sed`)?
- Did you name the breakpoint (third host)?

### Level 3 — Apply it to a new scenario

You're adding a 12th spec type: `/aipe:onboarding`. The behaviour spec lives in `specs/onboarding.md`. What three things must exist (and in what order) before the spec type is usable in Claude Code AND Codex CLI?

Write your answer. Then check `specs/feature.md`, `commands/feature.md`, `skills/feature/SKILL.md`, and `.codex-plugin/plugin.json` lines 13–24 to verify.

### Level 4 — Defend the decision you'd change

Pick the mirror-vs-generator tradeoff. Answer:

"If you were redesigning aipe today knowing the project would grow to 3+ host agents within 12 months, would you still ship the manual mirror? Or would you start with the generator? Name the cost of each at year 1."

Reference:
- Point to the current `cp` + `sed` recipe in `spec-aipe.md` to support what exists.
- Point to what would need to change if you chose the generator (CI, `dist/`, publish step).

### Quick check — code reference test
Without opening files:
- What file holds the 11 prompt templates? → `specs/<type>.md`
- What's the env-var swap that distinguishes Claude wrapper from Codex skill? → `${CLAUDE_PLUGIN_ROOT}` ↔ `${CODEX_PLUGIN_ROOT}`
- Which manifest enumerates the Codex skills? → `.codex-plugin/plugin.json`

Open the files and verify.
