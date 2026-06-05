# Claude Plugin Conversion — Learning Roadmap

A learning-first plan to evolve AIPE from a 36-slash-command plugin into a fully-conventional Claude Code plugin (commands + agents + skills + hooks), structured so each phase builds intuition for **which primitive fits which kind of business requirement**.

**Goal:** by the end you have a one-pager you can reach for next time someone says "can the agent just X?" — and you know which of the four primitives to reach for.

```
  Total time estimate    8-12 hours across 2-3 weeks
  Pacing                 one phase per weekend session
  Companion              02-tutorial.md (step-by-step elaboration
                         of each phase with concrete prompts +
                         file paths)
```

═════════════════════════════════════════════════
THE FOUR PRIMITIVES — what you're learning to choose between
═════════════════════════════════════════════════

```
  slash command    user-invoked verb. "do this thing now."
                   always synchronous; user is steering.

  subagent         separate Claude instance with isolated
                   context + curated tool palette. spawned for a
                   scoped task; reports back a summary.

  skill            on-demand capability the model loads when
                   relevant. markdown instructions + optional
                   bundled scripts. model decides when to invoke.

  hook             harness-fired automation on events (post-edit,
                   post-tool-use, etc). runs without model
                   intervention.
```

The decision matrix at the end of Phase 6 is the deliverable. The phases between here and there are the reps that make the matrix feel obvious instead of arbitrary.

═════════════════════════════════════════════════
PHASE 0 — Map the territory  (1 hr, solo)
═════════════════════════════════════════════════

**Goal:** name the four primitives without looking them up.

Read Claude Code docs on each. Build a one-paragraph definition + concrete example for each, in your own words. **Crucial:** for each primitive, write "what fails if I try to use the wrong one for this" — that's the seam.

**Output:** `notebook/guides/plugin-primitives.md`

═════════════════════════════════════════════════
PHASE 1 — Audit your 36 commands  (1-2 hrs, solo)
═════════════════════════════════════════════════

**Goal:** force yourself to classify what you already have.

Walk through every `commands/*.md` and tag each:

```
  user-must-invoke           → stays a slash command
  could be a subagent        → heavy research, isolated work
  could be a skill           → conditional expertise the model
                               should reach for when relevant
  could be a hook            → fires on an event, not on intent
```

Most of your 36 are correctly slash commands. A handful might be skill-shaped or subagent-shaped — that's the find. Don't act yet; just classify.

**Output:** add a "primitive fit" column to a table in `notebook/guides/plugin-primitives.md`.

═════════════════════════════════════════════════
PHASE 2 — Convert one command → skill  (1 hr, with Claude help)
═════════════════════════════════════════════════

**Goal:** see firsthand how a skill differs from a command in invocation.

Pick the smallest command that scored "could be a skill" in Phase 1. Strong candidate from your set: `/aipe:read-aposd` — it teaches a framework when relevant; the user doesn't always invoke it explicitly.

**What you'll learn:** the description field is the entire trigger mechanism for skills. Write it like an SEO match rule. Skills compete on description quality.

**Output:** `skills/<name>/SKILL.md` (the Claude Code skill format, distinct from the Codex skill format we removed). Verify in a fresh session that typing "explain deep modules" triggers the skill without typing `/aipe:read-aposd`.

═════════════════════════════════════════════════
PHASE 3 — Convert one command → subagent  (1-2 hrs, with Claude help)
═════════════════════════════════════════════════

**Goal:** see how isolated context + tool curation changes a heavy task.

Pick a command that walks the whole repo and synthesizes: `/aipe:audit-cleanup` or `/aipe:audit-refactor` fit. Subagents are for "go research X and come back" — the result is a clean summary, not 50k tokens of grep output bloating the parent context.

**What you'll learn:** tool restriction is a feature, not a limitation. It forces clean inputs/outputs and prevents the subagent from drifting outside its scope.

**Output:** `agents/cleanup-auditor.md`. Notice your main context stays tight after you spawn it.

═════════════════════════════════════════════════
PHASE 4 — Add one hook  (30 min, mostly config)
═════════════════════════════════════════════════

**Goal:** see automation that fires without you asking.

Pick a hook trigger that fits your habits. Suggestions:

```
  post-edit on commands/*.md     run a markdown linter
  post-commit                    suggest /aipe:code-review on the
                                 new branch
  user-prompt-submit on
    "ship it" / "commit"         run verification-before-completion
```

**What you'll learn:** hooks are the only primitive that runs without model decision. They're for invariants ("always do X after Y"), not for judgment calls. A hook that needs to reason is the wrong shape — it should be a skill the hook triggers.

**Output:** a working hook in `.claude/settings.json`. Notice it doesn't appear in `/help`; users have no way to invoke it directly.

═════════════════════════════════════════════════
PHASE 5 — Skill spawns subagent  (2-3 hrs, with Claude help)
═════════════════════════════════════════════════

**Goal:** see multi-primitive composition — the realistic shape of complex features.

Author a skill that, when relevant, spawns 2-3 subagents in parallel (e.g., `cleanup-auditor`, `security-auditor`, `a11y-auditor`) and synthesizes their reports into one consolidated finding.

**What you'll learn:** the skill is the orchestration layer; the subagents are the workers; the slash command (if you add one) is just the invocation handle. Each primitive earns its place by doing what only it can.

**Output:** `skills/audit-branch-end-to-end/SKILL.md` + 3 subagent files. Test invocation shows parallel dispatch.

═════════════════════════════════════════════════
PHASE 6 — Distill the decision framework  (1 hr writing)
═════════════════════════════════════════════════

**Goal:** the deliverable you keep for life — a one-pager that converts business asks into primitive choices.

Write the matrix that answers:

```
  "We need to X"                          → which primitive
  user types a command to do X            → slash command
  X happens when condition Y is true      → skill (model decides)
  X is heavy research; isolated context   → subagent
  X must happen after event Y             → hook
  X is too big for one round              → skill orchestrates
                                            subagents

  red flag patterns                        → what's wrong
  "command always runs on save"            should be a hook
  "skill bloats parent context"            should spawn a subagent
  "subagent has Write access"              tighten tool palette
  "hook makes a judgment call"             should be skill/command
```

Add 3-5 worked examples from real asks you've had at work or in projects. Each: the ask → which primitive(s) → why.

**Output:** `notebook/guides/business-req-to-primitive.md` — the page you reach for next time.

═════════════════════════════════════════════════
RECOMMENDED CADENCE
═════════════════════════════════════════════════

```
  Week 1   Phase 0 (Sat)  +  Phase 1 (Sun)
  Week 2   Phase 2 (Sat)  +  Phase 3 (Sun)
  Week 3   Phase 4 (Sat)  +  Phase 5 (Sun)
  Week 4   Phase 6 (any 1-hour block)
```

Each phase is independent — if you skip Phase 4, the others still teach what they teach. But the order is the muscle-building order: primitives → audit → smallest conversion → bigger conversion → automation → composition → framework.

═════════════════════════════════════════════════
WHAT YOU'LL HAVE AT THE END
═════════════════════════════════════════════════

```
  the plugin                  one skill, one subagent, one hook,
                              one composite skill-subagent —
                              proof you can ship in every primitive.

  the framework               business-req-to-primitive.md — the
                              one-pager you actually use at work.

  the intuition               you can read a business ask and feel
                              which primitive fits, without checking
                              the matrix. that's the real product.
```

The plugin gains are nice. The intuition is the asset. The framework is the artifact you point at when someone else needs to learn this.

═════════════════════════════════════════════════
HOW THE STEP-BY-STEP TUTORIAL IS SPLIT
═════════════════════════════════════════════════

The companion tutorial — concrete commands + verbatim Claude prompts + verification steps — is split one file per phase. Read this roadmap first, then work through the phase files in order:

```
  02-phase-0-map-territory.md         primitives reading + your
                                       definitions page
  03-phase-1-audit-commands.md        classify all 36 commands
  04-phase-2-skill-conversion.md      read-aposd → skill
  05-phase-3-subagent-conversion.md   audit-cleanup → subagent
  06-phase-4-hook.md                  post-commit hook
  07-phase-5-composition.md           skill spawning 3 subagents
                                       in parallel
  08-phase-6-decision-framework.md    business-req-to-primitive
                                       matrix + worked examples
```

Each phase file is self-contained — opens with `Maps to:` linking back to this roadmap, lists the file(s) it creates, has Previous/Next links for navigation. One sitting per phase, in order.

═════════════════════════════════════════════════
FILES YOU'LL CREATE — index
═════════════════════════════════════════════════

```
  Phase 0  notebook/guides/plugin-primitives.md
  Phase 1  notebook/guides/plugin-primitives.md  (append section)
  Phase 2  skills/read-aposd/SKILL.md
  Phase 3  agents/cleanup-auditor.md
  Phase 4  .claude/settings.json                 (modified)
  Phase 5  skills/audit-branch-end-to-end/SKILL.md
           agents/security-auditor.md
           agents/a11y-auditor.md
           (cleanup-auditor.md from Phase 3 also used)
  Phase 6  notebook/guides/business-req-to-primitive.md
```

At the end of the tutorial the repo will have new top-level `skills/` and `agents/` directories alongside the existing `commands/` and `specs/`, plus two new personal-guide pages in `notebook/guides/`.
