# Phase 3 — Convert one command → subagent

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `04-phase-2-skill-conversion.md` · **Next:** `06-phase-4-hook.md`

**Maps to:** Roadmap Phase 3
**Estimated time:** 1-2 hours
**Files you'll create:** `agents/cleanup-auditor.md` *(or, under the unified file format, `skills/cleanup-auditor/SKILL.md` with `context: fork` in frontmatter — confirm with the current docs which path is canonical for your Claude Code version)*

> **Unified-format note:** Under current Claude Code docs, "subagents" are realized as skills with `context: fork` set in frontmatter — they share the same file format as commands and skills. Older `agents/<name>.md` paths may still work as a separate top-level directory; the cleanest modern form is a skill at `skills/<name>/SKILL.md` with `context: fork`. The Claude prompt below works for either — ask the model to use the canonical path for your version.

═════════════════════════════════════════════════
STEP 3.1 — Re-read the source
═════════════════════════════════════════════════

```bash
cat specs/audit-cleanup.md | head -80
```

Notice this is a heavy task: walks the whole repo, classifies findings by lens, produces a triaged debt list. The output is structured; the inputs are the repo. **Perfect subagent shape.**

═════════════════════════════════════════════════
STEP 3.2 — Create the directory
═════════════════════════════════════════════════

```bash
mkdir -p agents
# OR, if the modern unified path is preferred:
# mkdir -p skills/cleanup-auditor
```

═════════════════════════════════════════════════
STEP 3.3 — Use this prompt verbatim in a fresh Claude session
═════════════════════════════════════════════════

```
Read specs/audit-cleanup.md. Author it as a Claude Code subagent.

Use the canonical path for the current Claude Code version. Under
the unified file format, this is likely:
  skills/cleanup-auditor/SKILL.md   (modern: skill with context: fork)
The legacy path is:
  agents/cleanup-auditor.md         (older Claude Code versions)
Check the current docs and pick the right one — note which you chose.

Requirements:
- Frontmatter:
    name: cleanup-auditor
    description: <when the main agent should spawn this subagent —
                  "when the user asks for a triaged debt list" /
                  "before merging a large refactor" / etc>
    context: fork                       (if using skills/ path)
    allowed-tools: [Read, Glob, Grep, Bash]   (tool restriction)
- NO Write, NO Edit, NO Bash with destructive flags. The subagent
  walks; it does not change the repo.
- The body instructs the subagent to follow the four-lens method
  from specs/audit-cleanup.md and return its final report as the
  spawning agent's summary (not as a written file).

Do not commit. Print the file.
```

Review. Save to `agents/cleanup-auditor.md`.

═════════════════════════════════════════════════
STEP 3.4 — Verify the spawn
═════════════════════════════════════════════════

In a fresh Claude Code session (in any repo with code), test:

> *Spawn the cleanup-auditor on this repo and bring back a triaged debt list.*

The main agent should use its `Agent` tool with `subagent_type: cleanup-auditor`. Watch:

```
  main context stays small              you don't see 50k tokens of
                                         grep output — that's the point
  summary is structured                  the subagent returns its lens-
                                         classified findings, not raw
                                         evidence
  tool restriction holds                 if you ask the subagent to
                                         "also fix the first three," it
                                         should refuse (Write isn't in
                                         its palette)
```

═════════════════════════════════════════════════
STEP 3.5 — Reflect
═════════════════════════════════════════════════

Append to `notebook/guides/plugin-primitives.md`:

```markdown
## Phase 3 — Lessons from the cleanup-auditor subagent conversion

- How the main context stayed clean vs running /aipe:audit-cleanup inline:
- What tool-restriction caught that I wouldn't have caught otherwise:
- The actual difference between this subagent and the /aipe:audit-cleanup command:
```

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW UNDERSTAND
═════════════════════════════════════════════════

- **Subagents are for "go research X and come back with a structured summary."** The summary IS the output.
- **Tool restriction is the feature, not the limitation.** It forces clean inputs/outputs and prevents drift.
- The main context is a finite resource. Subagents are how you spend it wisely.
