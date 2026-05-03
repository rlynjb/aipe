# aipe

Spec workflow for AI-assisted development. 14 prompt templates that turn a one-line intent + your project context into a filled, structured spec your coding agent can implement from.

aipe ships as a **plugin** for both Claude Code and Codex CLI. There is no separate binary to install — the agent in your session does the work using its own model.

---

## Install

Pick the agent you use. (You can install both — the same template files back both plugins.)

### Claude Code

In any Claude Code session:

```
/plugin marketplace add rlynjb/aipe
/plugin install aipe@rlynjb-aipe
```

After install, `/aipe <type> <intent>` is available in every session.

### Codex CLI

From your terminal:

```bash
codex plugin marketplace add rlynjb/aipe
```

Codex auto-installs and tracks the plugin in `~/.codex/config.toml`. After install, `/aipe <type> <intent>` is available in every Codex session.

---

## Usage

Once installed, the flow is the same in both agents:

```
/aipe feature add dark mode toggle
```

The first time you run it in a project, it scaffolds `.aipe/project/context.md` and asks you to fill it in (your stack, data model, file structure, constraints). That file is the project context the agent uses to fill the template.

After context is in place, every `/aipe` invocation:

1. Loads the named template (e.g. `specs/feature.md`).
2. Loads your project context (`.aipe/project/*.md` and any global config at `~/.config/aipe/global/*.md`).
3. Composes a filled spec using the agent's own model.
4. Saves it to `.aipe/specs/<type-plural>/<slug>.md`.
5. Summarises and stops — waiting for you to say "implement it" or refine.

---

## Spec types

14 templates cover the common kinds of work you hand to a coding agent:

| Type | Use when |
|------|----------|
| `plan` | Multi-phase project that spans sessions |
| `feature` | Building something new |
| `debugging` | A bug keeps coming back |
| `curriculum` | Turning a codebase into a learning resource |
| `interview` | Defending a project in an interview |
| `audit` | Reviewing existing code before adding to it |
| `testing` | Writing or improving tests |
| `user-stories` | Rewriting tasks in different personas |
| `refactor` | Restructuring without changing behaviour |
| `migration` | Changing a schema, dependency, or storage layer |
| `performance` | Diagnosing speed or bundle issues |
| `prompt-engineering` | Fixing AI output quality |
| `onboarding` | Generating context docs for a new codebase |
| `integration` | Connecting an external service |

The templates are plain markdown in [`specs/`](specs/) — read them directly to see what each one produces.

---

## Configuration

| Where | What |
|-------|------|
| `.aipe/project/context.md`, `rules.md`, `stack.md` | Per-project context — committed to the repo, edited as the codebase evolves |
| `.aipe/specs/<type-plural>/<slug>.md` | Generated specs — also typically committed |
| `~/.config/aipe/global/*.md` | Cross-project context — your identity, default stack, skills, conventions |

Global files are optional. Project context is what makes the difference between a generic spec and one that names your real files and constraints.

---

## Editing or adding spec templates

The templates are the heart of the tool. Editing them is just markdown work — no build step, no compile.

**Edit an existing template:**

```bash
git clone https://github.com/rlynjb/aipe.git
cd aipe
vim specs/feature.md     # edit
git commit -am "tweak feature template"
git push
```

Users get the new template the next time they update the plugin (`/plugin update aipe` in Claude Code; `codex plugin marketplace upgrade` in Codex).

**Add a new spec type:**

1. Drop the new template at `specs/<type>.md`.
2. Edit `commands/aipe.md` — add the type to the **Valid spec types** list and the **Folder map**.
3. Edit `skills/aipe/SKILL.md` — same two edits as the Claude Code command.
4. Commit, push, bump `version` in both `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`.

That's it — there's no code to compile, no tests to update.

---

## Repo layout

```
aipe/
  .claude-plugin/        ← Claude Code plugin manifest + marketplace listing
  .codex-plugin/         ← Codex plugin manifest
  commands/aipe.md       ← Claude Code slash command body
  skills/aipe/SKILL.md   ← Codex skill body (same content, different filename)
  specs/                 ← 14 template markdowns — single source of truth
  html/                  ← static cheatsheet site (separate from the plugin)
  docs/                  ← roadmap and historical plans
```

---

## License

MIT.
