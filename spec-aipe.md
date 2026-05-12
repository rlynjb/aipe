# aipe — Project Spec

A spec workflow for AI-assisted development, shipped as a plugin for Claude Code and Codex CLI. The deliverable is **markdown templates and slash commands** — no binary, no service, no extra API keys. Reviewed on 2026-05-11 against `main` at v1.24.0.

---

## Problem

Coding agents (Claude Code, Codex) are good at writing code. They're bad at the step before code: turning a one-line intent ("add dark mode toggle") into a structured plan that names real files, real constraints, and real edge cases in the user's repo. Without that plan, agents guess — and guesses produce plausible code that misses the actual project's shape.

The recurring pattern users hit:

```
intent ───▶ agent ───▶ generic code
              │
              └── doesn't know your stack, files, conventions, or what must not change
```

aipe inserts a deterministic step between intent and code: a filled, structured spec written from the project's own context.

```
intent ───▶ aipe ───▶ filled spec ───▶ agent ───▶ project-shaped code
            │            │
            │            └── concrete: real file paths, real constraints, real edge cases
            │
            └── 11 templates, one per spec type (feature, debugging, refactor, …)
```

---

## Goals

- **One slash command per spec type.** `/aipe:feature`, `/aipe:debugging`, `/aipe:study`, etc. Tab-completable; no flags; no dispatcher.
- **No external runtime.** The agent in the user's session does the work using its own model. No separate CLI binary, no API keys, no auth.
- **Same templates back both agents.** Claude Code and Codex CLI install the same source of truth — `specs/*.md` — via their respective plugin manifests.
- **Project-shaped output.** Generated specs reference the user's real files, stack, and constraints — pulled from `.aipe/project/context.md` the first invocation scaffolds.
- **UPDATE mode is first-class.** Re-running a command on a project that already has a spec diffs against the codebase + the template and patches what drifted, instead of regenerating.
- **Templates are the heart.** Editing a template is markdown work — no build step, no compile.

## Non-goals

- A self-hosted server, dashboard, or web app.
- An AI service of any kind. aipe doesn't make API calls; the host agent does.
- A general-purpose markdown framework. Each template is a prompt with a specific job.
- A CLI binary. (Existed in v0.x; removed in v1.0.0 — no use case beyond what the plugin already provides.)

---

## Architecture

```
┌─ User's editor / terminal ────────────────────────────────────────┐
│                                                                   │
│  Claude Code session              Codex CLI session                │
│        │                                │                          │
│        │  /aipe:feature ...             │  /aipe:feature ...      │
│        ▼                                ▼                          │
│  commands/feature.md            skills/feature/SKILL.md            │
│  (slash command body)           (skill body — identical content,   │
│        │                         CODEX_PLUGIN_ROOT instead of      │
│        │                         CLAUDE_PLUGIN_ROOT)               │
│        │                                │                          │
│        └────────┬───────────────────────┘                          │
│                 │  loads                                           │
│                 ▼                                                  │
│       specs/feature.md  ← single source of truth template          │
│                 │                                                  │
│                 │  + reads                                         │
│                 ▼                                                  │
│       .aipe/project/context.md  (per-project)                      │
│       ~/.config/aipe/global/*.md (cross-project, optional)         │
│                 │                                                  │
│                 │  agent fills the template against the context    │
│                 ▼                                                  │
│       .aipe/specs/<type-plural>/<slug>.md                          │
│       (filled spec, ready for the agent to implement against)      │
└───────────────────────────────────────────────────────────────────┘
```

**Layered design:**

- **Slash command layer** (`commands/<type>.md` for Claude; `skills/<type>/SKILL.md` for Codex) — agent-facing instructions. Identical content between the two; only the plugin-root env var differs.
- **Template layer** (`specs/<type>.md`) — the actual prompt and structure. Both plugins load the same files at runtime via `${CLAUDE_PLUGIN_ROOT}` / `${CODEX_PLUGIN_ROOT}`.
- **Context layer** (`.aipe/` in the user's repo; `~/.config/aipe/global/` cross-project) — the project-specific facts that turn a generic template into a project-shaped spec.
- **Output layer** (`.aipe/specs/<type-plural>/<slug>.md`) — the filled spec. The handoff artifact to the agent that implements.

**Key invariant:** `specs/*.md` is the single source of truth. `commands/` and `skills/` are agent-shaped wrappers around it. Touch the template, both surfaces update on the next plugin pull.

---

## Repo layout

```
aipe/
  .claude-plugin/
    plugin.json           ← Claude Code plugin manifest
    marketplace.json      ← marketplace listing (rlynjb-aipe namespace)
  .codex-plugin/
    plugin.json           ← Codex plugin manifest (skills array)
  commands/
    <type>.md             ← one file per spec type — Claude Code slash command body
  skills/
    <type>/SKILL.md       ← one directory per spec type — Codex skill body
  specs/
    <type>.md             ← 11 template markdowns — source of truth
    README.md             ← index of spec types
  html/                   ← static cheatsheet site, separate from the plugin
  docs/                   ← roadmap, historical plans, superpowers reference
  README.md               ← install + usage
  spec-aipe.md            ← this document
```

The `.worktrees/` directory exists but is unused at the moment (kept gitignored for future worktree-based development).

---

## Spec types — the 11 templates

| Slash command | Template | Use when |
|---|---|---|
| `/aipe:plan` | `specs/plan.md` | Multi-phase project that spans sessions |
| `/aipe:feature` | `specs/feature.md` | Building something new |
| `/aipe:debugging` | `specs/debugging.md` | A bug keeps coming back |
| `/aipe:study` | `specs/study.md` | Understanding a codebase as a study guide (system design, DSA, AI engineering) |
| `/aipe:audit` | `specs/audit.md` | Reviewing existing code before extending it |
| `/aipe:testing` | `specs/testing.md` | Writing or improving tests |
| `/aipe:user-stories` | `specs/user-stories.md` | Rewriting tasks in different personas |
| `/aipe:refactor` | `specs/refactor.md` | Restructuring without changing behaviour |
| `/aipe:migration` | `specs/migration.md` | Changing schema, dependency, or storage |
| `/aipe:performance` | `specs/performance.md` | Diagnosing speed or bundle issues |
| `/aipe:integration` | `specs/integration.md` | Connecting an external service |

Two templates have evolved well past the simple-prompt baseline and now drive multi-file generation: `study.md` (one file per concept, nested by section, with per-file UPDATE-mode diffs) and `plan.md`. The rest are single-file generators.

---

## Per-spec-type contract

Every command file follows a consistent shape. The pattern (using `/aipe:feature` as the canonical example):

```
Step 1 — Initialize if needed
  If .aipe/project/context.md does NOT exist:
    - scaffold .aipe/project/ and .aipe/specs/
    - write a placeholder context.md
    - print "Edit .aipe/project/context.md, then re-run."
    - STOP.

Step 2 — Load context
  Read .aipe/project/{context,rules,stack}.md (required + optional)
  Read ~/.config/aipe/global/*.md (cross-project, optional)

Step 3 — Load the template
  Read ${CLAUDE_PLUGIN_ROOT}/specs/<type>.md
  (or ${CODEX_PLUGIN_ROOT}/specs/<type>.md for Codex)

Step 4 — Detect existing spec → branch CREATE or UPDATE
  If .aipe/specs/<type-plural>/<slug>.md exists → UPDATE MODE
  Else                                          → CREATE MODE

CREATE MODE
  Step 5C — Plan the spec
  Step 6C — Generate
  Step 7C — Save to .aipe/specs/<type-plural>/<slug>.md
  Step 8C — Report and STOP

UPDATE MODE
  Step 5U — Read the existing spec
  Step 6U — Diff against codebase context AND template structure
  Step 7U — Output change plan and STOP for confirmation
  Step 8U — Apply changes (only after the user confirms)
  Step 9U — Report and STOP
```

Two design choices encoded in this contract:

- **Stop after generating.** Every command ends with an explicit "wait for the user's next instruction" line. The spec is the handoff; the implementation is the user's call (often the agent's, on the next turn). Never auto-implement.
- **UPDATE mode runs two diffs.** Diff A checks the existing spec against the current codebase context (file paths moved, libraries swapped, features added). Diff B checks the spec against the template's current canonical structure (sections that didn't exist when the spec was generated). Files clean on both diffs are left alone; the rest get a structured change plan that the user approves before any edit lands.

The two-diff model was introduced in v1.11.1 specifically because users were hitting "the spec is missing the new sections you just added to the template" — re-generation lost their hand-edits, and naive update-mode only caught codebase drift.

---

## Configuration model

Two layers of context feed every spec generation:

```
~/.config/aipe/global/         ← cross-project, optional
  identity.md                    Who I am, how I work
  rules.md                       Conventions I apply to every project
  stack.md                       My default tech preferences
  skills.md                      Capabilities and tools I bring

.aipe/                         ← per-project, committed to the repo
  project/
    context.md                   This codebase: stack, data model, file structure, constraints
    rules.md                     This codebase: conventions specific to this project
    stack.md                     This codebase: specific tech in use
  specs/
    <type-plural>/
      <slug>.md                  Generated specs (committed)
    study/                       Multi-file output for /aipe:study
      00-overview.md
      01-system-design/
        README.md + per-concept files
      02-dsa/
        README.md + per-concept files
      03-ai-engineering/
        README.md + per-concept files
```

`.aipe/project/context.md` is the required minimum. The first invocation of any `/aipe:<type>` command scaffolds it with a placeholder and stops; the user fills it in once, and subsequent commands use it for every spec they generate.

Global files are optional and idempotent — present, they shape every spec across every project; absent, the per-project context is enough.

---

## Plugin distribution

Both plugins distribute via marketplace install — no binaries published, no npm package, no pip wheel.

**Claude Code:**

```
/plugin marketplace add rlynjb/aipe
/plugin install aipe@rlynjb-aipe
```

The marketplace listing lives at `.claude-plugin/marketplace.json` (namespace `rlynjb-aipe`). On install, Claude Code fetches the repo at the version specified in `.claude-plugin/plugin.json`. Updates: `/plugin update aipe@rlynjb-aipe`.

**Codex CLI:**

```
codex plugin marketplace add rlynjb/aipe
```

Codex reads `.codex-plugin/plugin.json` directly from the repo, auto-installs, and tracks the plugin in `~/.codex/config.toml`. The `skills` array in `plugin.json` enumerates each `skills/<type>/` directory; each skill's `SKILL.md` is the same content as the Claude `commands/<type>.md`, with `${CLAUDE_PLUGIN_ROOT}` replaced by `${CODEX_PLUGIN_ROOT}`. Updates: `codex plugin marketplace upgrade`.

**The mirror step is mechanical and unbreakable:**

```bash
cp commands/<type>.md skills/<type>/SKILL.md
sed -i '' 's|${CLAUDE_PLUGIN_ROOT}|${CODEX_PLUGIN_ROOT}|g' skills/<type>/SKILL.md
```

The two surfaces are otherwise byte-identical. Every release ships both.

---

## Versioning and release flow

The repo has a single version number, bumped together in both plugin manifests:

```
.claude-plugin/plugin.json  → "version": "1.24.0"
.codex-plugin/plugin.json   → "version": "1.24.0"
```

Each version corresponds to one commit on `main` and one git push. There are no tagged releases or release branches — `main` is always the latest published version.

**Release flow:**

1. Edit `specs/<type>.md` (the source of truth).
2. Update `commands/<type>.md` to match — non-negotiables, canonical section list, UPDATE-mode flags, Step 8U repair recipes.
3. Mirror to `skills/<type>/SKILL.md` via the `cp` + `sed` command above.
4. Bump `version` in both `plugin.json` files.
5. Commit, push.

The high-cadence template (currently `specs/study.md`) has driven most version bumps: v1.18.0 through v1.24.0 are all study-template iterations.

---

## Design decisions worth naming

**Plugin-only, no CLI.** The CLI existed through v0.x and was removed in v1.0.0. The single user-visible feature it had — running templates from the terminal — was already covered by the agent that hosts the plugin. The CLI added installation friction and a second surface to maintain, with no capability the plugin lacked.

**Single source of truth for templates.** Both plugins load from `specs/*.md`. There is no separate Claude version and Codex version. The agent-specific wrappers are byte-identical apart from one env-var name. This is enforced by the mirror script, not by convention.

**No state outside markdown.** Generated specs live in the user's repo as plain markdown; project context lives in `.aipe/`; global context lives in `~/.config/aipe/`. There is no database, no cache, no telemetry, no remote service. The plugin can be uninstalled and reinstalled without losing user state, because no state is held outside files the user owns.

**UPDATE mode is the default, not an afterthought.** Re-running a command on an existing spec triggers UPDATE mode automatically. This was decided after early users hit the "I edited the spec, and now I want to refresh it without losing my edits" problem. The two-diff model (codebase drift + template drift) covers both of the cases that lead to a stale spec.

**Generated specs stop before implementing.** No `/aipe:<type>` command runs implementation. The flow is: command generates spec → user reviews → user says "implement it" → agent implements. Auto-implementing breaks the review step that the whole tool exists to create.

**11 templates, one slash command each.** A single `/aipe <type> <intent>` dispatcher was the original design and was rejected in favour of per-type commands. Per-type commands tab-complete, surface in the slash-command picker, and let each template own its argument shape (e.g., `/aipe:study` takes no arguments; `/aipe:feature` takes a free-text intent).

---

## What's NOT here (intentional)

- **No published package** (npm / pip / brew). The plugin marketplace is the only distribution channel.
- **No GitHub Actions or CI.** There's nothing to test or build. Markdown is the artifact.
- **No tests.** The templates are prose; correctness is judged by reading generated output, not by assertions.
- **No issue templates / contributing guide.** The contribution path is "open a PR with a template change"; there's nothing else.
- **No telemetry.** The plugin reports nothing. The user's agent is the only thing that sees their context.

---

## The `html/` directory

Separate from the plugin. A small static cheatsheet site (`html/index.html` + linked pages) that explains prompt-engineering concepts visually — the conceptual companion to the templates. It does not ship with the plugin; it's a documentation artifact for the project. Either hosted as a static site or browsed locally.

---

## The `docs/` directory

- `spec-tool-README.md` and `spec-tool-plan.md` — historical: the original implementation plan when the project was a CLI (pre-v1.0.0). Kept for context on how the design evolved.
- `superpowers/` — reference plans and specs from earlier subagent-driven implementation phases.

These are not load-bearing for the current plugin. They document the path that got the project here.

---

## Open questions

- **Codex skill discovery without `codex plugin marketplace add`.** Currently Codex users have to know the GitHub repo. The marketplace shortcut is `codex plugin marketplace add rlynjb/aipe`, which works but isn't discoverable from a fresh Codex install.
- **Multi-language templates.** All templates assume English. Whether to support translations or leave it to forks is an open call.
- **Per-spec-type evolution rate.** `study.md` has had ~7 versions; most others haven't moved in months. Whether this means the others are mature, or whether they're under-iterated, is unresolved.

---

## How this spec should be used

This is a project spec — a snapshot of what the repo is, how the pieces fit, and which decisions are load-bearing. It is not a generated spec from any of the 11 templates; the templates produce specs *for the user's project*, not for aipe itself.

When the architecture changes (a new spec type, a new plugin host, a new context layer), update this document so it remains a faithful map of the codebase. When only a template changes, this document does not need to change — the per-template version cadence lives in the commit log.
