---
description: Frontend accessibility audit — describe what's there, never propose fixes
argument-hint: <optional scope...>
---

The user invoked `/aipe:audit-frontend-a11y` with optional scope: `$ARGUMENTS`.

`$ARGUMENTS` is optional. If empty, scan the whole frontend. If supplied, narrow the scan to that area (e.g., "checkout flow", "settings screens").

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:audit-frontend-a11y.`
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

## Step 3 — Load the `audit-frontend-a11y` template

Read the template at:

```
${CLAUDE_PLUGIN_ROOT}/specs/audit-frontend-a11y.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/audit-frontend-a11y.md` upward from this file's location.

## Step 4 — Run the six-lens scan

Apply the procedure in the loaded template. One pass through the frontend's UI surface, applying **six lenses**: Keyboard → Focus → Semantics → Names and labels → Visual → Dynamic content. Each lens finds different problems; running them separately keeps the findings from collapsing into "vibes about a11y."

The non-negotiables from the template:

1. **Describe, don't fix.** No "you should add X." No code changes. Observations only.
2. **Don't grade.** No severity scores, no pass/fail, no priority labels. Problems are described, not ranked. Severity is the user's call after reading the snapshot.
3. **Be specific.** Name screens, components, interactions, elements. "The login form has accessibility issues" is useless; "the email input on `<LoginForm>` has no associated `<label>` — it's only labelled by a `placeholder` attribute" is useful.
4. **Cover all six lenses in order**, even when one finds nothing. Stating "no issues observed under Lens 4 in this scan" is a real finding.
5. **Findings that demand action route OUT of this spec**, not into it. The spec is explicit:
   - Adding capability (new keyboard handlers, focus management, ARIA live regions, skip links) → **feature spec**, not this audit
   - Fixing broken a11y (handler doesn't fire, focus escapes a modal, screen reader announces wrong thing) → **fix mini-spec**
   - Markup-only changes (`<div onClick>` → `<button>`, semantic landmarks) → **`/aipe:refactor-frontend-visual`**
6. **A long output is normal and not a judgment.** Default frameworks make a11y easy to skip; backlogs accumulate. The right response is not to feel bad — it's to triage, hand off, document accepted-and-deferred, and move on.
7. **This audit is not WCAG compliance certification.** It's a structured way to surface the most likely a11y problems in plain language. If the user needs formal compliance, the output is a starting point, not an endpoint.

## Step 5 — Save the snapshot

Compute the date: `<YYYY-MM-DD>` (today, local time).

Path: `.aipe/audits/a11y-<YYYY-MM-DD>.md`

If that file already exists, append an ISO time suffix: `.aipe/audits/a11y-<YYYY-MM-DD>T<HH-MM-SS>.md`. **Never overwrite** — audits are timestamped snapshots.

Body: six lens sections in order, every finding specific and located. End with the "What to expect" framing from the spec so the reader knows that a long list is normal.

## Step 6 — Report + stop

Print exactly:

```
✓ A11y audit saved to <path>
  Lens 1 (keyboard):       <N> findings
  Lens 2 (focus):          <N> findings
  Lens 3 (semantics):      <N> findings
  Lens 4 (names/labels):   <N> findings
  Lens 5 (visual):         <N> findings
  Lens 6 (dynamic):        <N> findings
```

Then a short summary (3–5 sentences) — which lens produced the densest findings, any systemic patterns (e.g., "every modal has the same focus bug"), and which findings cluster naturally into a single fix spec.

Optionally suggest re-read lenses from the spec:
- *pre-publication review* — focus on Lens 3 (semantics) and Lens 4 (names)
- *interview preparation* — read for patterns: was a11y considered from the start, or patched on?
- *capability gap planning* — group "adding capability" items into feature specs
- *bug triage* — cluster "X exists but is broken" items into fix mini-specs

**Stop. Wait for the user's next instruction.** Do NOT auto-act on findings. Do NOT generate refactor/feature/fix specs unless the user asks for one.
