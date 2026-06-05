# Phase 1 — Audit your 36 commands

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `02-phase-0-map-territory.md` · **Next:** `04-phase-2-skill-conversion.md`

**Maps to:** Roadmap Phase 1
**Estimated time:** 1-2 hours
**Files you'll modify:** `notebook/guides/plugin-primitives.md` (append a section)

═════════════════════════════════════════════════
STEP 1.1 — List the commands
═════════════════════════════════════════════════

```bash
ls commands/ | sort
```

You should see ~36 files (one per slash command).

═════════════════════════════════════════════════
STEP 1.2 — Append a classification table
═════════════════════════════════════════════════

Append to `notebook/guides/plugin-primitives.md`:

```markdown
## Audit of current AIPE commands

| Command | Stays as command? | Could be skill? | Could be subagent? | Could be hook? | Why |
|---------|-------------------|-----------------|--------------------|----------------|-----|
| /aipe:study | YES | no | no | no | user-invoked orchestrator |
| /aipe:read-aposd | maybe | YES | no | no | model could load when user asks about software-design concepts |
| /aipe:audit-cleanup | YES, but | no | YES (composite) | no | the heavy walk is subagent-shaped |
| ... | | | | | |
```

Fill in **one row per command**. Time-box: **1.5 hours**. Go fast on the obvious ones (most are clearly user-invoked commands). Spend more time on the ambiguous ones — that's where the learning lives.

═════════════════════════════════════════════════
STEP 1.3 — Pick your conversion candidates
═════════════════════════════════════════════════

At the bottom of the section, write:

```markdown
### Skills candidate: <command name> — picked because <reason>
### Subagent candidate: <command name> — picked because <reason>
```

You'll use these in Phases 2 and 3. **The tutorial suggests `/aipe:read-aposd` for the skill conversion and `/aipe:audit-cleanup` for the subagent conversion** — pick those if you don't have stronger candidates after auditing.

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW UNDERSTAND
═════════════════════════════════════════════════

- Most of your commands are correctly slash commands. That's a feature, not a problem.
- The interesting ones are the ambiguous ones — the conversion decision is itself the learning.
