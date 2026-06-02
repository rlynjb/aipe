---
name: audit
description: Take stock of a project — describe what is, not what to do
argument-hint: <optional scope...>
---

The user invoked `/aipe:audit` with optional scope: `$ARGUMENTS`.

`$ARGUMENTS` is optional. If empty, audit the whole project. If supplied, treat it as a hint to narrow the scan (e.g., "auth flow", "data layer").

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does NOT exist in the current working directory:

1. Create `.aipe/project/` and `.aipe/audits/` directories.
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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:audit.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)

## Step 3 — Load the `audit` template

Read the template at:

```
${CODEX_PLUGIN_ROOT}/specs/audit.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/audit.md` upward from this file's location.

## Step 4 — Run the audit

Apply the procedure in the loaded template. Produce a status report covering the **eight sections** the spec names. If `$ARGUMENTS` is non-empty, narrow the scan to that area; otherwise cover the whole project.

The non-negotiables from the template:

1. **Describe, don't act.** No "you should...", no prioritized fix lists, no grading. The audit's job is to tell the reader *what is*, not *what to do*.
2. **Be specific.** Name modules, features, libraries, decisions, file paths. Generic claims ("uses some libraries") are useless to a future reader.
3. **Cover all 8 sections in order.** Identity → Stack → Architecture → Features → Decisions → Incomplete and deferred → Risks and rough edges → What's next.
4. **Decisions section is the highest-value one.** Reconstruct the *why* behind notable choices — tradeoffs accepted, things explicitly rejected. The code shows what; only the audit captures why.
5. **Risks section is observation, not prescription.** "Hard to change" is an observation; "needs to be refactored" is a prescription that belongs in `audit-cleanup` or feature work.
6. **If the audit surfaces something that wants to be acted on, hand off** — debt → `/aipe:audit-cleanup`, restructuring → `/aipe:refactor`, new capability → feature work. Do NOT execute the action here.

## Step 5 — Save the snapshot

Compute the date: `<YYYY-MM-DD>` (today, local time).

Path: `.aipe/audits/snapshot-<YYYY-MM-DD>.md`

If that file already exists, append an ISO time suffix: `.aipe/audits/snapshot-<YYYY-MM-DD>T<HH-MM-SS>.md`. **Never overwrite** — audits are timestamped snapshots, not living documents.

Create parent directories as needed and write the audit body. The output is the eight-section report only — no preamble, no commentary about the process.

## Step 6 — Report + stop

Print exactly:

```
✓ Audit saved to <path>
```

Then a short summary (3–5 sentences) of what the audit covers and what stood out: which section ran longest, any notable deferred items, any aging dependencies the user might not have realized.

Optionally suggest the four re-read lenses from the spec as next prompts:
- *onboarding yourself back* — read Identity → What's next → Incomplete and deferred → Decisions
- *portfolio / README writing* — read Identity → Features (stable) → Architecture → Stack → Decisions
- *briefing someone else* — read Identity → Architecture → Decisions → Incomplete and deferred → Risks
- *periodic check-in* — read Incomplete and deferred → What's next → Risks

**Stop. Wait for the user's next instruction.** Do NOT auto-update `.aipe/project/context.md`. Do NOT act on findings. Do NOT generate follow-up specs — that's the user's call.
