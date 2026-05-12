# Project context

aipe is a spec workflow for AI-assisted development. It ships as a plugin for **Claude Code** and **Codex CLI**. There is no binary, no service, no API keys. The host agent in the user's session does the work using its own model — aipe contributes prompt templates, slash commands, and a deterministic file layout.

The deliverable is markdown. Each spec type (feature, debugging, refactor, study, …) is a slash command that loads a template, reads the user's project context from `.aipe/project/*.md`, and writes a filled spec to `.aipe/specs/<type-plural>/<slug>.md`. Re-running a command on an existing spec triggers UPDATE mode, which diffs the spec against both the current codebase and the current template structure, then patches what drifted.

Current version: **1.29.0** (kept in sync across both plugin manifests).

## Stack

- **Runtime:** none. The repo is plain markdown + a couple of JSON manifests. No build step, no compile, no tests.
- **Distribution:** Claude Code plugin marketplace (`rlynjb/aipe` namespace `rlynjb-aipe`) and Codex CLI plugin marketplace. Both pull the same git repo.
- **Language:** Markdown for every template, command, skill, and spec. JSON for the two plugin manifests.
- **Host agents:** Claude Code and Codex CLI. The plugin resolves its own root via `${CLAUDE_PLUGIN_ROOT}` (Claude) or `${CODEX_PLUGIN_ROOT}` (Codex); the two surfaces are byte-identical apart from that one env-var swap.
- **No external runtime:** no Node, no Python, no Bash entry point, no database, no telemetry, no remote service. The plugin can be uninstalled and reinstalled without losing user state — all state lives in the user's repo (`.aipe/`) or home dir (`~/.config/aipe/global/`).

## Data model

The "data" here is entirely files. There are no records, no schemas, no IDs — just three layers of markdown.

- **Template layer** — `specs/<type>.md`. One file per spec type (currently 11 active: `plan`, `feature`, `debugging`, `study`, `audit`, `testing`, `user-stories`, `refactor`, `migration`, `performance`, `integration`). This is the single source of truth. Both plugins load these at runtime.
- **Wrapper layer** — `commands/<type>.md` (Claude Code slash commands) and `skills/<type>/SKILL.md` (Codex skills). Identical content; only the plugin-root env-var name differs. Mechanical mirror via `cp` + `sed`.
- **Context layer (in the user's repo)** — `.aipe/project/context.md` (required), `.aipe/project/rules.md`, `.aipe/project/stack.md` (both optional), plus optional curriculum files for the `study` template (`aieng-curriculum.md` or `curriculum.md`).
- **Global context layer (cross-project)** — `~/.config/aipe/global/{identity,rules,stack,skills,aieng-curriculum}.md`, all optional.
- **Output layer** — `.aipe/specs/<type-plural>/<slug>.md` for single-file specs; `.aipe/specs/study/` (nested: `00-overview.md` at root, then `01-system-design/`, `02-dsa/`, `03-ai-engineering/`, `04-machine-learning/`, each with a `README.md` index plus one file per concept, plus an optional `system-design-templates/` sub-directory for AI/ML interview reframes).

Relationships:

- Each `commands/<type>.md` and each `skills/<type>/SKILL.md` references exactly one `specs/<type>.md`.
- Each generated spec references exactly one template (loaded at generation time) and the user's project context (also loaded at generation time).
- `study.md` is the only multi-file generator. Everything else writes one file.

## File structure

```
aipe/
  .claude-plugin/
    plugin.json              ← Claude Code manifest (version, name, repo)
    marketplace.json         ← Marketplace listing (rlynjb-aipe namespace)
  .codex-plugin/
    plugin.json              ← Codex manifest (skills array enumerates each skill dir)
  commands/
    <type>.md                ← 11 Claude Code slash-command bodies, one per spec type
                                study.md is the largest (~140 KB) — it drives multi-file generation
  skills/
    <type>/SKILL.md          ← 11 Codex skill bodies — identical to commands/<type>.md
                                with ${CLAUDE_PLUGIN_ROOT} → ${CODEX_PLUGIN_ROOT}
  specs/
    <type>.md                ← 11 template markdowns — the single source of truth
    README.md                ← Index of spec types
  prompts/                   ← Standalone prompt assets used by templates
    aieng-curriculum.md      ← Curriculum that drives study.md AI/ML inventory
    frontend-story-checklist.md
    pr-review-protocol-v2.md
  html/                      ← Static cheatsheet site, separate from the plugin
  docs/                      ← Roadmap, historical plans, superpowers reference
  README.md                  ← Install + usage for end users
  spec-aipe.md               ← Project spec (snapshot of architecture and load-bearing decisions)
  .worktrees/                ← Reserved for future worktree-based development; currently empty
  .aipe/                     ← This project's own self-applied context + study guide
    project/
      context.md             ← This file
    specs/                   ← (created on demand by /aipe:* commands run inside this repo)
```

## What must not change

- **`specs/*.md` is the single source of truth.** Templates are loaded by both plugins at runtime. Editing a template is the only sanctioned way to change behaviour. Never branch the template per agent.
- **`commands/<type>.md` and `skills/<type>/SKILL.md` stay byte-identical** apart from `${CLAUDE_PLUGIN_ROOT}` ↔ `${CODEX_PLUGIN_ROOT}`. The mirror command is mechanical:

  ```bash
  cp commands/<type>.md skills/<type>/SKILL.md
  sed -i '' 's|${CLAUDE_PLUGIN_ROOT}|${CODEX_PLUGIN_ROOT}|g' skills/<type>/SKILL.md
  ```

  Every release ships both surfaces. Never let one drift.
- **One version number, bumped in lockstep.** `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` must always carry the same `version`. `main` is always the latest published version — no release branches, no tags.
- **The per-spec-type contract.** Every command/skill follows the same eight-step shape: Step 1 init → Step 2 load context → Step 3 load template → Step 4 detect existing spec → CREATE (5C–8C) or UPDATE (5U–9U). Each command ends with an explicit "wait for the user's next instruction" line. Never auto-implement.
- **Stop after generating.** The flow is: command generates spec → user reviews → user says "implement it" → agent implements. The spec is the handoff.
- **UPDATE mode runs two diffs.** Diff A against the codebase context (file paths moved, libraries swapped). Diff B against the template's current canonical structure (sections added in later versions). Files clean on both diffs are left alone. The user approves the change plan before any edit lands.
- **No state outside markdown.** No database, no cache, no telemetry, no remote service. Generated specs live in the user's repo; project context lives in `.aipe/`; global context lives in `~/.config/aipe/`. Don't introduce hidden state.
- **`study.md` is the high-cadence template.** Most version bumps from v1.18.0 onward are study-template iterations. When editing, expect UPDATE-mode "Diff B" flags in this command to grow — that's intentional. Other templates change rarely.
- **No CLI binary.** Existed through v0.x, removed in v1.0.0. Don't reintroduce it. The host agent already runs the templates.
- **Public surface that downstream users depend on:**
  - The 11 slash commands and their argument shapes (e.g., `/aipe:study` takes no arguments; `/aipe:feature` takes free-text intent).
  - The `.aipe/project/context.md` scaffold body (every command writes the same placeholder; users have muscle memory for it).
  - The `.aipe/specs/<type-plural>/<slug>.md` output path convention.
  - The `${CLAUDE_PLUGIN_ROOT}/specs/<type>.md` and `${CODEX_PLUGIN_ROOT}/specs/<type>.md` template paths.
