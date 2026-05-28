---
description: Generate a USER_GUIDE.md written from a first-time user's perspective, grounded in what the app actually does
---

The user invoked `/aipe:generate-user-guide`.

This command takes **no arguments**. It inspects the current repo and produces `USER_GUIDE.md` at the repo root (or in `/docs` if the project keeps docs there) — user-facing documentation written from the perspective of someone using the app for the first time. Not a technical readme, not API docs. Unlike the other aipe commands, this one does NOT require `.aipe/` scaffolding — it inspects the actual codebase directly.

## Step 1 — Load optional project context

If they exist, read these for extra signal (skip silently if absent — the spec gathers its own context from the repo in step 0):

- `.aipe/project/context.md`
- `.aipe/project/rules.md`
- `~/.config/aipe/global/identity.md`
- `~/.config/aipe/global/rules.md`

## Step 2 — Load the `generate-user-guide` template

Read the template at:

```
${CLAUDE_PLUGIN_ROOT}/specs/generate-user-guide.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/generate-user-guide.md` upward from this file's location.

## Step 3 — Execute the spec's procedure

Follow the loaded template's steps in order. The spec is self-contained and procedural:

- **Step 0 — understand the app from the outside in.** Read the code, but think like a user. Inspect user-facing surfaces (read the actual labels, button text, headings, placeholder text, empty states, copy the user sees), navigation/structure, the entry point a brand-new user hits first, the actions a user can take, settings/configuration, and the README for name/purpose/voice. Note the app's exact feature names and terminology — if the app calls it a "board," call it a "board."
- **Step 1 — map the features.** List every user-facing feature, then order them the way a user encounters them: getting started → core feature → supporting features → settings → advanced. For each: its in-app name, what it lets the user accomplish (benefit, not mechanism), how the user triggers it (real steps), what they see as a result, prerequisites, and gotchas. Drop anything purely internal and invisible to the user.
- **Step 2 — generate `USER_GUIDE.md`** in the app's own voice with these sections: intro ("what is [app name]?"), getting started (the first-time path to first success), features (one subsection per feature using the consistent *what it does* / *how to use it* / *what you'll see* / *good to know* shape), tips & common questions (FAQ grounded in real behavior), and an optional "coming soon" (only if there are real planned-but-unbuilt features worth signaling).
- **Step 3 — accuracy pass.** Re-read against the app. Confirm every button, label, screen, and flow you described actually exists with those names in the code. Fix drift. Flag anything you couldn't verify with `> ⚠️ verify: ...` rather than guessing.

The non-negotiables from the template:

1. **User's perspective only.** No internal architecture, file paths, function names, or tech stack. If you're describing how the code works, you've drifted — pull back to what the user sees and does.
2. **Accuracy over completeness.** Document only features that exist and work. Half-built or flagged features go in "coming soon" or get omitted — never presented as usable.
3. **Use the app's real words.** Exact feature names, button labels, and terminology from the actual UI. Mirror its voice and casing. Don't rename a "board" to a "kanban view."
4. **Task-oriented and concrete.** Every feature answers "how do I do this?" with steps a first-timer can follow — "tap the + button in the bottom right," not "create a new item."
5. **Scannable.** A user with one question should find the answer without reading the whole thing. Clear headings, short steps.
6. **One output file**: `USER_GUIDE.md` (repo root, or `/docs` if that's the project convention), plus the console summary.
7. If part of the app is too incomplete to document accurately, say so plainly rather than inventing a flow.

## Step 4 — Report + stop

After writing `USER_GUIDE.md`, print the console summary the spec specifies:

- how many user-facing features were documented (1 line)
- anything that looked half-built or ambiguous and was omitted or flagged (1–2 lines)
- one suggestion for a feature whose in-app copy or labeling is confusing and could be clearer (1 line)

**Stop. Wait for the user's next instruction.** Do NOT auto-revise the guide or change the app's copy.
