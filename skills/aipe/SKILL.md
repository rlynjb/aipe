---
description: Generate a spec from a template using your project context. Invoke as `/aipe <type> <intent...>`.
---

The user invoked: `/aipe $ARGUMENTS`

Parse `$ARGUMENTS` as `<spec-type> <intent words...>`. The first word is the spec type; the rest is the intent.

**Valid spec types:** `plan`, `feature`, `debugging`, `curriculum`, `interview`, `audit`, `testing`, `user-stories`, `refactor`, `migration`, `performance`, `prompt-engineering`, `onboarding`, `integration`.

If the spec type is missing or invalid, list the valid types and stop. If the intent is missing, ask for it and stop.

---

## Step 1 — Initialize if needed

Check whether `.aipe/project/context.md` exists in the current working directory.

**If it does NOT exist:**

1. Create `.aipe/project/` and `.aipe/specs/` directories.
2. Write `.aipe/project/context.md` with this placeholder body:

   ```
   # Project context

   Describe this codebase so an AI agent can implement against it without asking.

   ## Stack
   - runtime, framework, language

   ## Data model
   - entities, relationships, where they live

   ## File structure
   - top-level folders and what lives where

   ## What must not change
   - public API surface, schema fields, ...
   ```

3. Print: `✓ Scaffolded .aipe/. Open .aipe/project/context.md, fill in your project details, then re-run /aipe $ARGUMENTS.`
4. **Stop. Do not proceed to generation.** The user needs to fill in real context first.

**If it exists, continue to Step 2.**

---

## Step 2 — Load context

Read these files. Skip any that don't exist (empty content is fine for the optional ones):

| Path | Required? |
|------|-----------|
| `.aipe/project/context.md` | yes (exists after Step 1) |
| `.aipe/project/rules.md` | optional |
| `.aipe/project/stack.md` | optional |
| `~/.config/aipe/global/identity.md` | optional |
| `~/.config/aipe/global/rules.md` | optional |
| `~/.config/aipe/global/stack.md` | optional |
| `~/.config/aipe/global/skills.md` | optional |

---

## Step 3 — Load the spec template

Read the template from this plugin's `specs/` directory. The plugin is installed at `~/.codex/plugins/cache/aipe/` after `codex plugin marketplace add rlynjb/aipe`, so the template is at:

```
~/.codex/plugins/cache/aipe/specs/<spec-type>.md
```

(If you're running this from a local clone / dev install, the path is `<repo-root>/specs/<spec-type>.md`. Try the installed path first; if it doesn't exist, search for `specs/<spec-type>.md` upward from this file's location.)

---

## Step 4 — Compose the filled spec

Apply the template structure to the project context and the user's intent. Use your own model (this is what you're already doing in this conversation — no separate API call).

Rules:
- Replace every `[bracket placeholder]` in the template with concrete content.
- All file names and paths must match the actual project (from the context files).
- Constraints sections must reflect real project constraints, not generic advice.
- Output ONLY the filled spec body — no preamble, no commentary.

---

## Step 5 — Save the spec

Compute the destination path:

- **Folder map** (spec type → folder under `.aipe/specs/`):
  - `plan` → `plans`
  - `feature` → `features`
  - `debugging` → `bugs`
  - `curriculum` → `curriculum`
  - `interview` → `interview`
  - `audit` → `audits`
  - `testing` → `testing`
  - `user-stories` → `user-stories`
  - `refactor` → `refactors`
  - `migration` → `migrations`
  - `performance` → `performance`
  - `prompt-engineering` → `prompts`
  - `onboarding` → `onboarding`
  - `integration` → `integrations`
- **Slug**: lowercase the intent, replace non-alphanumerics with `-`, collapse repeats, trim to 60 chars. If empty, use `spec`.
- **Path**: `.aipe/specs/<folder>/<slug>.md`
- **Conflict**: if that file already exists, append an ISO timestamp: `.aipe/specs/<folder>/<slug>-<YYYY-MM-DDTHH-MM-SS>.md`. Never overwrite.

Create parent directories as needed and write the filled spec to the path.

---

## Step 6 — Report + stop

Print exactly:

```
✓ Spec saved to <path>
```

Then give a 3-sentence summary of what the spec covers (the main sections, the key decisions baked in, any open questions the user might want to clarify).

**Stop. Wait for the user's next instruction.** Do NOT auto-implement. The user will say "implement it", or ask for revisions, or move on.
