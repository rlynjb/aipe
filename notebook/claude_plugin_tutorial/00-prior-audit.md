# Prior Audit — Tutor's Read

> ⚠️ **SPOILER WARNING.** This file is my read after ~15 minutes of thinking, NOT the answer. Phase 1 of the tutorial asks **you** to do this audit as the rep that builds the intuition. **Reading this before doing Phase 1 yourself will undercut the learning.**
>
> **Intended use:** open this file as a comparison or check AFTER you finish Phase 1 — not as a replacement for it.
>
> File numbered `00-` only so it sorts at the top of the folder for findability, NOT because it's the entry point. Actual reading order:
>
> ```
>   01-roadmap.md
>   02-phase-0-map-territory.md
>   03-phase-1-audit-commands.md   ← do this yourself
>   ...
>   08-phase-6-decision-framework.md
>   (optionally) 00-prior-audit.md ← compare here
> ```

═════════════════════════════════════════════════
METHOD (what to take with a grain of salt)
═════════════════════════════════════════════════

This audit was done by Claude after ~15 minutes of thinking about the 36 commands' general shape — not by reading every spec end-to-end. Your audit, done over 1-2 hours with each spec actually open, will be sharper and more grounded in your own judgment. The value of comparing is in the *disagreements*: where my read differs from yours, one of us is wrong, and the why-disagreement conversation is where the muscle gets built.

═════════════════════════════════════════════════
COLUMN MEANINGS (unified file format)
═════════════════════════════════════════════════

Under current Claude Code, custom commands + skills + subagent-style fork-context skills all share one file format (`skills/<name>/SKILL.md`). The columns below are **invocation behaviors** you'd pick via frontmatter flags, not separate file formats:

```
  command (YES)    skill with disable-model-invocation: true
                   — user must type /name; never auto-fires

  skill (YES)      skill with a description field
                   — auto-fires from natural-language prompts

  subagent (YES)   skill with context: fork
                   — runs in isolated context with curated tools

  hook (YES)       configured in .claude/settings.json
                   — fires on harness events, not in skill format
```

The four columns aren't mutually exclusive. A single skill can be both user-invocable (`/name`) AND auto-triggered (description), and a subagent is just a skill with `context: fork` plus a description. Hooks remain a separate config layer.

═════════════════════════════════════════════════
THE CLASSIFICATION TABLE
═════════════════════════════════════════════════

```
                            command   skill    subagent    hook
                            (stays    (model   (heavy      (event-
                             user-     fires    research,   driven)
                             driven)   from     isolated
                                       natural  context)
                                       lang)
─────────────────────────────────────────────────────────────────────
ORCHESTRATORS (4)
  /aipe:study                YES       YES        no       no
  /aipe:rehearse             YES       YES        no       no
  /aipe:ready                YES       YES        no       no
  /aipe:audit                YES       YES        no       no
  ↑ these should SPAWN their children as subagents — they're
    the skill-orchestrates-subagents composition pattern from
    Phase 5, already implicit in your architecture

STUDY GENERATORS (16)
  All study-*                YES       YES (*)    YES      no
  ↑ all walk the codebase heavily; all are subagent-shaped
    under their orchestrator; all could trigger as skills when
    user asks about the topic ("explain caching in this repo")

AUDIT GENERATORS (4)
  /aipe:audit-status         YES       maybe      YES      maybe
  /aipe:audit-cleanup        YES       no         YES      no
  /aipe:audit-frontend-a11y  YES       no         YES      no
  /aipe:audit-refactor       YES       no         YES (!)  no
  ↑ audit-refactor is the strongest subagent candidate — it
    produces a 6-chapter book; the parent context wouldn't
    survive inline

REHEARSE GENERATORS (5)
  /aipe:rehearse-problem-    YES       no         YES      no
    selection
  /aipe:rehearse-design-doc  YES       no         YES      no
  /aipe:rehearse-hackathon-  YES       no         YES      no
    demo
  /aipe:rehearse-interview-  YES       no         YES      no
    defense
  /aipe:rehearse-behavioral- YES       YES        no       no
    stories
  ↑ behavioral-stories is the odd one — per-person, not heavy
    repo walk, so skill-shape over subagent-shape

REFACTOR (3)
  /aipe:refactor             YES       YES        no       no
  /aipe:refactor-frontend-*  YES       YES        no       no
  ↑ skill candidates: trigger on "refactor this to extract X" /
    "rewrite this with the strategy pattern" without typing
    /aipe:refactor

STANDALONE (3)
  /aipe:code-review          YES       YES        YES      YES
  /aipe:read-aposd           YES       YES (!)    no       no
  /aipe:drill                YES       no         no       no
  ↑ code-review is the unicorn — could legitimately be all four
    (command for explicit, skill for "review this PR", subagent
    for branch-end-to-end composition, hook for post-commit
    auto-review). It's the perfect Phase 5+ teaching case if
    you ever extend the tutorial.
  ↑ read-aposd is the strongest skill candidate — book-style
    teaching that should fire on natural-language requests
  ↑ drill REQUIRES user interaction (six hands-on steps);
    not subagent-shaped — subagents go off and return; drill
    is a walk-with-the-user

READINESS (2)
  /aipe:recon                YES       no         YES      no
  /aipe:drill                (covered in STANDALONE above)

(*) "skill: YES" for study generators is qualified — they're
    long; loading the full spec as a skill bloats parent context.
    Better pattern: skill triggers ON natural language but spawns
    the corresponding subagent for the heavy lift.
```

═════════════════════════════════════════════════
FIVE FINDINGS WORTH THEIR OWN LINE
═════════════════════════════════════════════════

**1. Your orchestrators are already a composition pattern in disguise.**
The Phase 5 "skill spawns 3 subagents in parallel" exercise is literally what `/aipe:study` does today (sequentially, not in parallel). Converting `study` / `rehearse` / `ready` / `audit` to skill-orchestrates-subagents-in-parallel is the highest-leverage architectural improvement hiding in the audit. If you ever expand the tutorial, this is the natural Phase 7.

**2. `/aipe:audit-refactor` is the strongest single subagent candidate.**
It produces a 6-chapter notebook — the parent context wouldn't survive inline. If you only convert ONE command to a subagent in Phase 3, this is more illustrative than `audit-cleanup`. The tutorial picks `audit-cleanup` for the lower complexity (smaller surface area to convert), but `audit-refactor` would teach the "main context died inline" lesson more viscerally.

**3. `/aipe:code-review` is the all-four unicorn.**
It's the only command in your set that's defensibly **every** primitive depending on context:
- **Command** — for explicit `/aipe:code-review` invocation
- **Skill** — fires on "review this PR" without explicit typing
- **Subagent** — heavy diff walking + structured findings; perfect isolated context
- **Hook** — post-commit auto-review on protected branches

If you extend the tutorial to a Phase 7, this is the case study that teaches multi-form-factor design.

**4. `/aipe:drill` is firmly NOT a subagent candidate** despite touching the codebase.
It requires turn-by-turn interaction with the user (six hands-on steps: build, induce, diagnose, fix, eval, war story). Subagents go off and return with a summary; drill is a walk-with-the-user. Worth calling out as the counter-example that proves "walks the repo" isn't the same as "subagent-shaped."

**5. Most refactor-* commands are skill-shaped** because they're triggered by natural language ("refactor this to extract the data layer") more than by explicit `/aipe:refactor` invocation.
This is a sleeper conversion that the tutorial doesn't currently highlight. If you finish the tutorial and want another rep, converting `/aipe:refactor-frontend-behaviour` to a skill that fires on "extract this state to a hook" would be a clean second skill case study.

═════════════════════════════════════════════════
HOW TO USE THIS AFTER PHASE 1
═════════════════════════════════════════════════

1. Finish your own Phase 1 audit table in `notebook/guides/plugin-primitives.md`.
2. Open this file side-by-side with yours.
3. For each row where we disagree, ask: *which read holds up under "but what if the user does X" pressure?*
4. Capture the disagreement-resolution in your Phase 1 reflection notes. Those are the load-bearing intuitions for Phase 6's decision framework.

═════════════════════════════════════════════════
HONEST LIMITS
═════════════════════════════════════════════════

- This audit didn't read every spec end-to-end. Your hour-by-hour Phase 1 work will surface nuances I missed.
- My "YES / no" classifications collapse spectrum into binary. Reality is messier — most commands are mostly-one-shape with a long tail of edge cases that justify a second form factor.
- The Phase 1 rep teaches you to *make these calls under uncertainty*. Reading my answers doesn't teach that. Doing yours does.

Use this as a check, not a substitute.
