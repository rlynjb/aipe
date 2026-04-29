# aipe

Spec workflow CLI for AI-assisted development. Generate filled specs from templates and project context, then hand them to any coding agent.

## Install

```bash
npm install -g aipe
# or just run via npx
npx aipe --help
```

Requires Node.js 20.11+ and an `ANTHROPIC_API_KEY` in your environment.

## Quick start

```bash
# 1. set your API key
export ANTHROPIC_API_KEY=sk-...

# 2. scaffold project context
cd your-project
npx aipe init

# 3. fill in .aipe/project/context.md (one paragraph is enough to start)

# 4. generate a spec
npx aipe generate feature "add dark mode toggle"

# 5. tell your agent to read it
# Claude Code:  "Read .aipe/specs/features/add-dark-mode-toggle.md then implement."
# Codex:        codex ".aipe/specs/features/add-dark-mode-toggle.md"
```

## Spec types

Run `aipe list` to see all 14 types: plan, feature, debugging, curriculum, interview, audit, testing, user-stories, refactor, migration, performance, prompt-engineering, onboarding, integration.

## Commands

| Command | What it does |
|---------|--------------|
| `aipe list` | List all spec types with descriptions |
| `aipe init` | Scaffold `.aipe/` in the current project |
| `aipe init --global` | Scaffold global config in `~/.config/aipe/` |
| `aipe generate <type> "<intent>"` | Generate a filled spec |

### Generate options

- `--agent <name>` — `claude-code`, `codex`, `cursor`, or `generic`. Auto-detected from `CLAUDE_CODE` / `CODEX_CLI` env vars.
- `--output <dir>` — override the default `.aipe/specs/` output root.
- `--context <path>` — use a different file as project context.
- `--dry-run` — print the assembled prompt without calling the LLM.
- `--print` — write the spec to stdout instead of saving a file.

## Configuration

| Where | What |
|-------|------|
| `.aipe/project/context.md`, `rules.md`, `stack.md` | Per-project context |
| `.aipe/specs/<type-plural>/<slug>.md` | Generated specs |
| `~/.config/aipe/global/*.md` | Cross-project identity, rules, stack, skills |
| `~/.config/aipe/config.json` | `defaultAgent`, `model` |

## Environment

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Required. Used for the Claude API call. |
| `CLAUDE_CODE` | Set by Claude Code; auto-selects `--agent claude-code`. |
| `CODEX_CLI` | Set by Codex; auto-selects `--agent codex`. |

## License

MIT.
