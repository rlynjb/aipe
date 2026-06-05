# Phase 0 — Map the territory

> **Tutorial:** part of the claude-plugin conversion tutorial. Start with `01-roadmap.md` for the high-level plan.
> **Previous:** `01-roadmap.md` · **Next:** `03-phase-1-audit-commands.md`

**Maps to:** Roadmap Phase 0
**Estimated time:** 1 hour
**Files you'll create:** `notebook/guides/plugin-primitives.md`

**Note on official syntax:** the exact frontmatter fields and directory paths Claude Code expects can evolve. When in doubt, check the official Claude Code plugin docs (or use the `claude-code-guide` agent) for the current spec. The structures used across this tutorial are accurate as of writing but verify before shipping.

═════════════════════════════════════════════════
STEP 0.1 — Read the four primitive docs
═════════════════════════════════════════════════

Open the Claude Code docs (or use the `claude-code-guide` agent in a session and ask each as a separate question):

```
  https://docs.claude.com/en/docs/claude-code/slash-commands
  https://docs.claude.com/en/docs/claude-code/sub-agents
  https://docs.claude.com/en/docs/claude-code/skills
  https://docs.claude.com/en/docs/claude-code/hooks
```

Time-box: **10 minutes per primitive**. **Don't take notes during reading.** Read with the goal of being able to explain it back to yourself, not transcribe it.

═════════════════════════════════════════════════
STEP 0.2 — Write the primitives page (without re-reading the docs)
═════════════════════════════════════════════════

Create `notebook/guides/plugin-primitives.md` with this skeleton, then fill it in **from memory**:

```markdown
# The Four Plugin Primitives

## Slash command
**Definition (in my own words):**
**Example I'd use:**
**What fails if I pick this when I should have picked something else:**

## Subagent
**Definition:**
**Example:**
**What fails:**

## Skill
**Definition:**
**Example:**
**What fails:**

## Hook
**Definition:**
**Example:**
**What fails:**
```

Time-box: **30 minutes for the writing.** If you can't fill in a "what fails" section, you don't understand that primitive yet — go back and re-read.

═════════════════════════════════════════════════
STEP 0.3 — Verify
═════════════════════════════════════════════════

Close the file. Open a fresh Claude session. Ask:

> *Explain the four Claude Code plugin primitives to me — be sharp about what fails when I pick the wrong one.*

Compare Claude's answer to yours. The gaps tell you what to re-read.

═════════════════════════════════════════════════
WHAT YOU SHOULD NOW UNDERSTAND
═════════════════════════════════════════════════

- The four primitives differ on **who invokes them**: user (command), model (skill), spawn (subagent), harness (hook).
- The wrong-primitive failure mode is specific per primitive — that's the seam.
