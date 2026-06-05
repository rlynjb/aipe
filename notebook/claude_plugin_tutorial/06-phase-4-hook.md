# Phase 4 — Add one hook

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `05-phase-3-subagent-conversion.md` · **Next:** `07-phase-5-composition.md`

**Maps to:** Roadmap Phase 4
**Estimated time:** 30 minutes
**Files you'll modify:** `.claude/settings.json`

═════════════════════════════════════════════════
STEP 4.1 — Pick a trigger
═════════════════════════════════════════════════

Pick ONE of these (**don't add all three at once** — one is the rep):

```
  A) post-edit on commands/*.md       run a markdown linter
  B) post-commit                       print a reminder to consider
                                       /aipe:code-review
  C) user-prompt-submit when the
     prompt contains "ship it" or
     "commit"                          print verification reminders
```

The tutorial recommends **B (post-commit reminder)** — simplest, lowest-risk hook to start with.

═════════════════════════════════════════════════
STEP 4.2 — Edit settings via the update-config skill
═════════════════════════════════════════════════

In a fresh Claude Code session in this repo:

> *Use the update-config skill to add a post-commit hook to .claude/settings.json. The hook should print: "Consider /aipe:code-review on this branch before pushing." Use the user-prompt-submit hook type if post-commit isn't directly available — match on prompts mentioning "git commit" or "committed".*

Review the proposed change to `.claude/settings.json`. Verify it doesn't override existing permissions or other config.

═════════════════════════════════════════════════
STEP 4.3 — Verify
═════════════════════════════════════════════════

Make a small commit in this repo (or any test repo):

```bash
echo "test" > /tmp/test-file
git add /tmp/test-file 2>/dev/null || true
# whatever your hook trigger is, do that action in Claude Code
```

The hook should fire and print the reminder. If it doesn't, check:

- Did `.claude/settings.json` get the new entry?
- Is the hook syntax correct per Claude Code docs?
- Did you `/reload-plugins` (some hook changes need it)?

═════════════════════════════════════════════════
STEP 4.4 — Reflect
═════════════════════════════════════════════════

Append to `notebook/guides/plugin-primitives.md`:

```markdown
## Phase 4 — Lessons from the post-commit hook

- What the hook handled that a command/skill wouldn't have:
- What the hook canNOT do (where I'd reach for a different primitive):
- The actual difference between "command runs on commit" (hook) vs
  "command suggests on commit" (skill that fires when prompt mentions commit):
```

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW UNDERSTAND
═════════════════════════════════════════════════

- **Hooks are the only primitive that runs without model decision.** They're for invariants.
- A hook that needs to reason (e.g., "decide whether to suggest code-review based on diff size") is the wrong shape — it should be a skill the hook triggers.
