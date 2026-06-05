# Phase 5 — Skill spawns subagent (composition)

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `06-phase-4-hook.md` · **Next:** `08-phase-6-decision-framework.md`

**Maps to:** Roadmap Phase 5
**Estimated time:** 2-3 hours
**Files you'll create:**
- `skills/audit-branch-end-to-end/SKILL.md`
- `agents/security-auditor.md` *(or `skills/security-auditor/SKILL.md` with `context: fork`)*
- `agents/a11y-auditor.md` *(or `skills/a11y-auditor/SKILL.md` with `context: fork`)*

(The cleanup-auditor from Phase 3 is also used; use whichever path you chose there for consistency.)

> **Unified-format note:** Under current Claude Code docs, "subagents" are skills with `context: fork`. The `agents/` path may be legacy; the modern unified path is `skills/<name>/SKILL.md`. Whichever you used in Phase 3, stay consistent here so the orchestrating skill can spawn them via the same convention.

═════════════════════════════════════════════════
STEP 5.1 — Plan the composition
═════════════════════════════════════════════════

Sketch on paper (or in a scratch note):

```
  user prompt: "audit this branch end-to-end before I merge"
                              │
                              ▼
                ┌─────────────────────────────┐
                │  skill: audit-branch-end-   │
                │         to-end              │
                │  (orchestrator — model      │
                │   chose to load this        │
                │   because of the prompt)    │
                └──────┬──────────┬──────┬────┘
                       │          │      │
              parallel ▼          ▼      ▼
              ┌──────────────┐  ┌────────┐  ┌────────┐
              │ cleanup-     │  │ security│  │ a11y-  │
              │ auditor      │  │ -auditor│  │ auditor│
              │ (subagent)   │  │         │  │        │
              └──────┬───────┘  └────┬───┘  └────┬───┘
                     │               │           │
                     └───────────┬───┴───────────┘
                                 ▼
                     skill collects the three summaries
                     and writes one consolidated report
                     (uses Write — the skill's one
                      "produce" responsibility)
```

═════════════════════════════════════════════════
STEP 5.2 — Author the two new subagents
═════════════════════════════════════════════════

Use the same prompt shape as Phase 3, twice:

```
Author a security-auditor subagent at agents/security-auditor.md.
Source: specs/study-security.md. Restricted tools: Read, Glob, Grep,
Bash (read-only). Returns a ranked trust-boundary findings list as
its summary.
```

```
Author an a11y-auditor subagent at agents/a11y-auditor.md.
Source: specs/audit-frontend-a11y.md. Restricted tools: Read,
Glob, Grep. Returns a ranked a11y findings list as its summary.
If the repo has no frontend surface, returns "no frontend surface"
and exits early.
```

═════════════════════════════════════════════════
STEP 5.3 — Author the orchestrating skill
═════════════════════════════════════════════════

```bash
mkdir -p skills/audit-branch-end-to-end
```

Use this prompt:

```
Author a skill at skills/audit-branch-end-to-end/SKILL.md that:

- Has a description that triggers when the user asks for an
  end-to-end branch audit, pre-merge review, or "everything-at-once"
  audit before merging.
- The body instructs the model to spawn three subagents in PARALLEL
  via the Agent tool with multiple tool calls in one message:
    - cleanup-auditor (debt triage)
    - security-auditor (trust-boundary findings)
    - a11y-auditor (a11y findings; may return "no frontend surface")
- Once all three return their summaries, the skill ranks the
  cross-cutting findings (anything flagged by 2+ subagents bubbles
  to the top) and writes a consolidated report to
  .aipe/audits/branch-end-to-end-<YYYY-MM-DD>.md.
- Tool palette for the skill: Agent (to spawn subagents), Write
  (for the consolidated report only). NO direct Read/Grep — those
  are the subagents' job.
```

═════════════════════════════════════════════════
STEP 5.4 — Verify the composition
═════════════════════════════════════════════════

In a fresh Claude Code session in this repo (or any repo with code):

> *Audit this branch end-to-end before I merge.*

Watch for:

```
  skill fires                       description match worked
  3 subagents spawn in PARALLEL     single message with multiple
                                     Agent tool calls; not sequential
  main context stays small          you see 3 summaries, not 3 full
                                     reports
  consolidated report appears       at .aipe/audits/branch-end-to-end-
                                     <date>.md
```

═════════════════════════════════════════════════
STEP 5.5 — Reflect (the most important reflection of the tutorial)
═════════════════════════════════════════════════

Append to `notebook/guides/plugin-primitives.md`:

```markdown
## Phase 5 — Lessons from skill-orchestrates-subagents

- What broke or surprised me on the first attempt:
- Why each primitive in the composition earned its place:
  - skill: ...
  - subagent (each): ...
  - (no slash command needed because: ...)
- The shape of complex features I now recognize:
```

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW UNDERSTAND
═════════════════════════════════════════════════

- **Multi-primitive composition is the realistic shape of non-trivial features.**
- Each primitive is doing exactly what only it can do — the skill orchestrates because it has natural-language trigger semantics; subagents work because they have isolated context and restricted tools; no slash command because the user describes their need in plain English.
- **Parallel spawn is a real tool** — when subagents are independent, dispatch them together (single message, multiple Agent calls).
