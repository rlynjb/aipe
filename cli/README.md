# aipe

Spec workflow CLI for AI-assisted development. Generate filled specs from templates and project context, then hand them to any coding agent.

Requires Node.js 20.11+ and an `ANTHROPIC_API_KEY` in your environment.

---

## Install

Pick the path that matches where the package is right now.

### From the GitHub repo (current state — package not yet on npm)

```bash
# install once globally from the monorepo subpath
npm install -g github:rlynjb/aipe#main

# or pin to a tagged release-candidate
npm install -g github:rlynjb/aipe#aipe-v0.1.0
```

`package.json` declares `"directory": "cli"`, so npm picks the right subfolder out of the monorepo.

### From a local clone (for developers iterating on `aipe` itself)

```bash
git clone https://github.com/rlynjb/aipe.git
cd aipe/cli
npm install
npm run build
npm link               # registers a global symlink → this checkout

# in any project where you want to use it:
cd ~/some-project
npm link aipe          # consumes the symlink
aipe --help
```

After any source edit, run `npm run build` in `aipe/cli/` and the linked install picks it up automatically.

### From npm (after publish)

```bash
npm install -g aipe
# or one-shot:
npx aipe --help
```

---

## Quick start

```bash
# 1. set your API key
export ANTHROPIC_API_KEY=sk-...

# 2. scaffold project context (run once per project)
cd your-project
aipe init

# 3. open .aipe/project/context.md and describe your stack/data/files.
#    one paragraph is enough to start — improve it as you go.

# 4. generate a spec
aipe generate feature "add dark mode toggle"

# 5. tell your agent to read it
# Claude Code:  "Read .aipe/specs/features/add-dark-mode-toggle.md then implement."
# Codex:        codex ".aipe/specs/features/add-dark-mode-toggle.md"
```

To skip the API call and just see what would be sent:

```bash
aipe generate feature "add dark mode toggle" --dry-run
```

---

## Spec types

Run `aipe list` to see all 14 types: plan, feature, debugging, curriculum, interview, audit, testing, user-stories, refactor, migration, performance, prompt-engineering, onboarding, integration.

---

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

---

## Configuration

| Where | What |
|-------|------|
| `.aipe/project/context.md`, `rules.md`, `stack.md` | Per-project context |
| `.aipe/specs/<type-plural>/<slug>.md` | Generated specs |
| `~/.config/aipe/global/*.md` | Cross-project identity, rules, stack, skills |
| `~/.config/aipe/config.json` | `defaultAgent`, `model` |

### Environment

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Required. Used for the Claude API call. |
| `CLAUDE_CODE` | Set by Claude Code; auto-selects `--agent claude-code`. |
| `CODEX_CLI` | Set by Codex; auto-selects `--agent codex`. |

---

## Updating spec templates

Spec template markdown files live at the repo root in `specs/` (single source of truth). The CLI reads them from `cli/dist/templates/` after a build, or falls back to `../specs/` in dev.

### Editing an existing template

Tweaking the wording in, say, `specs/feature.md`:

```bash
cd aipe/cli
npm run build              # re-runs tsc + copies specs/ into dist/templates/
```

If you used `npm link`, every linked project picks up the change on the next `aipe generate`. If you installed from a tarball or path, reinstall after the build.

### Adding a new spec type

Adding a brand-new type (e.g. `release-notes`) requires touching four files so the CLI knows it exists:

1. **Create the template** at `specs/release-notes.md`.
2. **Register the type** in `cli/src/types.ts` — append `'release-notes'` to the `SPEC_TYPES` `as const` array.
3. **Add a description** in `cli/src/lib/templates.ts` — the `DESCRIPTIONS` map is `Record<SpecType, string>`, so TypeScript will refuse to compile until you add an entry.
4. **Pick an output folder** in `cli/src/lib/output.ts` — same exhaustiveness check on `TYPE_TO_FOLDER`. Use the same name or pluralise it (e.g. `'release-notes': 'release-notes'`).

Then:

```bash
npm test                   # confirms the new type loads + lists
npm run build              # bundles into dist/
```

If you're publishing the change, also bump `version` in `cli/package.json` (a new spec type warrants `0.x.0` minor; a wording tweak is `0.0.x` patch).

### Updating after a published release

End users on the npm-published package update the same way as any global package:

```bash
npm update -g aipe
# or pin a specific version:
npm install -g aipe@0.2.0
```

Linked installs (`npm link aipe`) auto-update from the linked source — just rebuild.

---

## License

MIT.
