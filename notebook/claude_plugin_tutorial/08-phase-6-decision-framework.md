# Phase 6 — Distill the decision framework

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `07-phase-5-composition.md` · **Next:** (none — this is the final phase)

**Maps to:** Roadmap Phase 6
**Estimated time:** 1 hour writing
**Files you'll create:** `notebook/guides/business-req-to-primitive.md`

═════════════════════════════════════════════════
STEP 6.1 — Pull insights from your prior reflections
═════════════════════════════════════════════════

Re-read everything you wrote in `notebook/guides/plugin-primitives.md` (Phases 0-5 reflections). Highlight any pattern you noticed twice — those are the ones that belong in the framework.

═════════════════════════════════════════════════
STEP 6.2 — Write the framework page
═════════════════════════════════════════════════

Create `notebook/guides/business-req-to-primitive.md`:

```markdown
# Business Requirement → Plugin Primitive

A decision framework for converting a business ask into the right
Claude Code plugin primitive (or combination).

## The decision matrix

| "We need to X" pattern                    | Primitive |
|-------------------------------------------|-----------|
| User types a command to do X              | slash command |
| X happens when condition Y is true        | skill (model decides) |
| X is heavy research, isolated context     | subagent |
| X must happen after event Y               | hook |
| X is too big for one round                | skill orchestrates subagents |

## Red flags — wrong-primitive picks

| Pattern in the wild                       | Should have been |
|-------------------------------------------|------------------|
| "Command always runs on save"             | hook |
| "Skill bloats parent context"             | spawn a subagent |
| "Subagent has Write access to repo"       | tighten tool palette |
| "Hook makes a judgment call"              | skill/command triggered by hook |
| "Slash command nobody invokes"            | skill (description-triggered) |

## Worked examples

### Example 1: <real ask from work/projects>
**Ask:** ...
**Primitive(s) chosen:** ...
**Why:** ...
**What I would NOT use here and why:** ...

### Example 2: <real ask>
...

### Example 3: <real ask>
...

(Aim for 3-5 examples. Real asks beat invented ones.)

## How to use this page

Next time a business ask lands, before writing any code:
1. Read it twice. Identify the verb (what action) and the trigger
   (who/what causes it to happen).
2. Match the trigger to the primitive: user → command, model → skill,
   spawn → subagent, harness event → hook.
3. If the action is heavy and the trigger is user-facing, you almost
   always need composition (skill or command that spawns subagents).
4. If you find yourself reaching for the "wrong" primitive, write down
   why in your reflection — it's a future worked example.
```

═════════════════════════════════════════════════
STEP 6.3 — Pressure-test the framework
═════════════════════════════════════════════════

Pick 3 hypothetical asks (real ones from work if you have them, invented if not):

1. *"We need a tool that reviews every PR for accessibility regressions and posts comments inline."*
2. *"We need a way for engineers to quickly get a system-design walkthrough of any unfamiliar service."*
3. *"We need to make sure we never deploy on Fridays without a senior review."*

For each, decide the primitive(s) using your matrix. If your matrix doesn't have a clear answer, that's a gap — refine the matrix.

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW HAVE
═════════════════════════════════════════════════

- A framework you trust enough to refer to in a meeting.
- **Intuition that runs faster than the framework** — you'll often pick the primitive before consciously consulting the matrix. That's the goal.
- 3-5 worked examples that ground the framework in real asks.

═════════════════════════════════════════════════
WHAT TO DO AFTER PHASE 6
═════════════════════════════════════════════════

```
  Use the framework            next time a business ask lands —
                               decide primitive before writing code.
                               Capture the decision in
                               business-req-to-primitive.md as a new
                               worked example.

  Iterate the framework        when a worked example doesn't fit the
                               matrix, the matrix needs a row, not
                               the example reshaped.

  Don't expand for completion  the goal was learning, not converting
                               all 36 commands to skills. Most of
                               your commands are correctly commands.
                               Resist over-conversion.
```

The plugin gains (one skill, one subagent, one hook, one composite) are nice. The framework is the artifact you'll point at when teaching someone else. The intuition is what you take to interviews.
