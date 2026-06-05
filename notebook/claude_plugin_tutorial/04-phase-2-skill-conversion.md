# Phase 2 — Convert one command → skill

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `03-phase-1-audit-commands.md` · **Next:** `05-phase-3-subagent-conversion.md`

**Maps to:** Roadmap Phase 2
**Estimated time:** 1 hour
**Files you'll create:** `skills/read-aposd/SKILL.md`

═════════════════════════════════════════════════
STEP 2.1 — Re-read the source
═════════════════════════════════════════════════

```bash
cat commands/read-aposd.md
cat specs/read-aposd.md | head -50
```

Get a feel for what the command does. The skill version will need to be triggered by the model when the user asks something like *"explain deep modules"* without typing `/aipe:read-aposd`.

═════════════════════════════════════════════════
STEP 2.2 — Create the directory
═════════════════════════════════════════════════

```bash
mkdir -p skills/read-aposd
```

═════════════════════════════════════════════════
STEP 2.3 — Open a fresh Claude Code session and use this prompt verbatim
═════════════════════════════════════════════════

```
Read commands/read-aposd.md and specs/read-aposd.md. Author a Claude Code
skill version at skills/read-aposd/SKILL.md.

Requirements:
- The skill's description field must trigger when the user asks about
  software-design primitives (deep modules, information hiding,
  complexity, layering) WITHOUT typing /aipe:read-aposd.
- The skill body instructs the model to load specs/read-aposd.md as
  the source-of-truth for the framework, then teach the relevant
  primitive grounded in the user's current repo if applicable.
- Keep specs/read-aposd.md unchanged. The skill is a wrapper, not a
  rewrite.

Do not commit anything. Print the file you'd write.
```

Review the proposed file. Save it to `skills/read-aposd/SKILL.md`.

═════════════════════════════════════════════════
STEP 2.4 — Verify the trigger
═════════════════════════════════════════════════

Reload plugins so the new skill registers. In Claude Code:

```
/reload-plugins
```

Open a fresh Claude Code session in any repo. Type:

> *Explain deep modules. What's a shallow module and why is it a smell?*

Watch what happens:

```
  if the skill triggers automatically   → the description field works
  if you get a generic answer            → the description doesn't match
                                           the user's natural phrasing;
                                           iterate
```

═════════════════════════════════════════════════
STEP 2.5 — Reflect
═════════════════════════════════════════════════

Append to your `notebook/guides/plugin-primitives.md`:

```markdown
## Phase 2 — Lessons from the read-aposd skill conversion

- What surprised me about authoring this as a skill:
- The description-field iteration cycle:
- The actual difference between this skill and the /aipe:read-aposd command:
```

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW UNDERSTAND
═════════════════════════════════════════════════

- **The skill description IS the trigger.** It's the only thing the model sees when deciding whether to load the skill.
- Skills compete with each other on description match quality. A vague description means the skill never fires.
