# Phase 3 — Convert one command → subagent

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `04-phase-2-skill-conversion.md` · **Next:** `06-phase-4-hook.md`

**Maps to:** Roadmap Phase 3
**Estimated time:** 1-2 hours
**Files you'll create:** `agents/cleanup-auditor.md`

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
```

═════════════════════════════════════════════════
STEP 3.3 — Use this prompt verbatim in a fresh Claude session
═════════════════════════════════════════════════

```
Read specs/audit-cleanup.md. Author it as a Claude Code subagent at
agents/cleanup-auditor.md.

Requirements:
- Frontmatter: name: cleanup-auditor, a description that captures
  when the main agent should spawn this subagent ("when the user
  asks for a triaged debt list" / "before merging a large refactor"
  / etc).
- Tool palette (restricted): Read, Glob, Grep, Bash (read-only
  commands). NO Write, NO Edit, NO Bash with destructive flags.
  The subagent walks; it does not change the repo.
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
