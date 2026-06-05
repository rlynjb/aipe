# Phase 2 — Turn a user-only command into an auto-triggered skill

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `03-phase-1-audit-commands.md` · **Next:** `05-phase-3-subagent-conversion.md`

**Maps to:** Roadmap Phase 2
**Estimated time:** 1 hour
**Files you'll create:** `skills/read-aposd/SKILL.md` (and optionally remove `commands/read-aposd.md`)

> **What this rep actually is (unified file format note):** Under current Claude Code, "commands" and "skills" share one file format. A "command" is just a skill with `disable-model-invocation: true` (user must type `/name`). A "skill" is a skill with a `description` that auto-triggers from natural language. This phase converts a legacy user-only invocation into an auto-trigger — the file move (`commands/X.md` → `skills/X/SKILL.md`) is the mechanical change; **the lesson is the behavioral consequence of writing a description field that fires on the right prompts and only the right prompts.**

═════════════════════════════════════════════════
STEP 2.1 — Re-read the source
═════════════════════════════════════════════════

```bash
cat commands/read-aposd.md
cat specs/read-aposd.md | head -50
```

Get a feel for what the command does. The new auto-triggered skill needs to fire on prompts like *"explain deep modules"* or *"what's information hiding?"* without the user typing `/aipe:read-aposd` — but it should NOT fire on irrelevant prompts (those false positives are how skills get disabled).

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
skill at skills/read-aposd/SKILL.md.

Under Claude Code's unified file format, this skill should AUTO-TRIGGER
from natural-language prompts — not require the user to type
/aipe:read-aposd. That means writing a strong description field, and
NOT setting disable-model-invocation.

Requirements:
- Frontmatter:
    name: read-aposd
    description: <when to load this — write it like an SEO match rule;
                  cover the four APOSD primitives by name (deep modules,
                  information hiding, complexity, layering) and the
                  shapes of questions that should fire it. Aim for
                  ~150-300 chars; under 1,536 char cap>.
    when_to_use: <optional additional trigger context if helpful>
- Do NOT set disable-model-invocation (we want auto-trigger).
- The body instructs the model to load specs/read-aposd.md as the
  source-of-truth for the framework, then teach the relevant primitive
  grounded in the user's current repo if applicable.
- Keep specs/read-aposd.md unchanged. The skill is a wrapper, not a
  rewrite.

Do not commit anything. Print the file you'd write.
```

Review the proposed file. Save it to `skills/read-aposd/SKILL.md`. Decide whether to also `git rm commands/read-aposd.md` (clean migration) or leave it (the legacy form will still resolve `/aipe:read-aposd` — but you'll have two definitions until you delete one).

═════════════════════════════════════════════════
STEP 2.4 — Verify the auto-trigger
═════════════════════════════════════════════════

Reload plugins so the new skill registers. In Claude Code:

```
/reload-plugins
```

Open a fresh Claude Code session in any repo. Test both directions:

**Should fire:**

> *Explain deep modules. What's a shallow module and why is it a smell?*

**Should NOT fire (false-positive check):**

> *Help me understand React's useEffect dependencies.*

Watch what happens:

```
  fires on the APOSD prompt              description matches the right
                                          things — good

  fires on the React prompt              description is too broad;
                                          tighten it (false positives
                                          are how skills get disabled
                                          or ignored)

  doesn't fire on either                  description is too narrow or
                                          mis-targeted; iterate

  /doctor warns about description bloat   you're over the 1,536-char
                                          cap or competing with many
                                          other skills; shorten
```

═════════════════════════════════════════════════
STEP 2.5 — Reflect
═════════════════════════════════════════════════

Append to your `notebook/guides/plugin-primitives.md`:

```markdown
## Phase 2 — Lessons from the read-aposd auto-trigger conversion

- What surprised me about writing a description that auto-triggers:
- The description-field iteration cycle (false positives, false negatives):
- The actual behavioral difference between user-only-invocation
  (disable-model-invocation: true) and auto-trigger (description-based):
- Whether I'd still want the user to be able to type /aipe:read-aposd
  explicitly (you can have both — auto-trigger doesn't disable the slash
  invocation):
```

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW UNDERSTAND
═════════════════════════════════════════════════

- **The description IS the trigger.** It's the only thing the model sees when deciding whether to auto-load the skill.
- Skills compete on description match quality. A vague description means it never fires; a too-broad description means it false-positive-fires on irrelevant prompts (worse than not firing — it disrupts the user's actual task).
- Under the unified file format, "convert command → skill" is mechanically just `commands/X.md` → `skills/X/SKILL.md` plus adding a `description` field. The lesson is the **behavioral consequence** of auto-trigger: the model is now an SEO-match-with-your-description-string away from running your skill on any prompt.
- A skill with a description AND no `disable-model-invocation` flag is both auto-triggerable AND user-invocable via `/name`. You don't have to pick one.
