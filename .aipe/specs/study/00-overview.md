# aipe — system overview

> One-page map of the aipe codebase: the layers, the artifacts, and what talks to what. Read this before any concept file.

---

## Full system map

```
┌─ User's editor / terminal ─────────────────────────────────────────────────────┐
│                                                                                │
│  ┌─ Claude Code session ────────┐         ┌─ Codex CLI session ────────────┐   │
│  │                              │         │                                │   │
│  │  /aipe:feature <intent>      │         │  /aipe:feature <intent>        │   │
│  │  /aipe:study                 │         │  /aipe:study                   │   │
│  │  /aipe:debugging <intent>    │         │  /aipe:debugging <intent>      │   │
│  │                              │         │                                │   │
│  └───────────┬──────────────────┘         └────────────┬───────────────────┘   │
└──────────────│─────────────────────────────────────────│───────────────────────┘
               │                                         │
               ▼                                         ▼
┌─ Wrapper layer (in plugin cache) ──────────────────────────────────────────────┐
│  commands/<type>.md                       skills/<type>/SKILL.md               │
│  (Claude Code slash command body)         (Codex skill body)                   │
│                                                                                │
│  Identical content, one swap:                                                  │
│      ${CLAUDE_PLUGIN_ROOT}  ←→  ${CODEX_PLUGIN_ROOT}                           │
└─────────────────────────────┬──────────────────────────────────────────────────┘
                              │ loads
                              ▼
┌─ Template layer (single source of truth) ──────────────────────────────────────┐
│                                                                                │
│  specs/<type>.md   ← 11 templates: plan, feature, debugging, study,            │
│                       audit, testing, user-stories, refactor, migration,       │
│                       performance, integration                                 │
│                                                                                │
│  specs/README.md   ← index of spec types                                       │
│                                                                                │
└─────────────────────────────┬──────────────────────────────────────────────────┘
                              │ + reads
                              ▼
┌─ Context layer (in the user's repo + home) ────────────────────────────────────┐
│                                                                                │
│  Per-project (required):                                                       │
│    .aipe/project/context.md         ← stack, data model, structure, invariants │
│    .aipe/project/rules.md           ← project conventions (optional)           │
│    .aipe/project/stack.md           ← project tech list (optional)             │
│    .aipe/project/aieng-curriculum.md ← project curriculum (optional)           │
│                                                                                │
│  Cross-project (~/.config/aipe/global/, all optional):                         │
│    identity.md, rules.md, stack.md, skills.md, aieng-curriculum.md             │
│                                                                                │
└─────────────────────────────┬──────────────────────────────────────────────────┘
                              │ host agent fills template against context
                              ▼
┌─ Output layer (in the user's repo) ────────────────────────────────────────────┐
│                                                                                │
│  Single-file specs:                                                            │
│    .aipe/specs/<type-plural>/<slug>.md                                         │
│                                                                                │
│  Multi-file spec (study only):                                                 │
│    .aipe/specs/study/00-overview.md                                            │
│    .aipe/specs/study/01-system-design/   README.md + per-concept files         │
│    .aipe/specs/study/02-dsa/             README.md + per-concept files         │
│    .aipe/specs/study/03-ai-engineering/  README.md + per-concept files         │
│                                          + system-design-templates/            │
│    .aipe/specs/study/04-machine-learning/ (only if ML surface exists)          │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Layer legend

- **User's editor / terminal** — the entry surface. Claude Code (Mac/Windows desktop app, VS Code, JetBrains, web at claude.ai/code) and Codex CLI. The two surfaces are interchangeable consumers of the same plugin.

- **Wrapper layer** — `commands/<type>.md` for Claude Code, `skills/<type>/SKILL.md` for Codex. Each file is the slash-command body the host agent executes. Byte-identical content between the two surfaces; only `${CLAUDE_PLUGIN_ROOT}` ↔ `${CODEX_PLUGIN_ROOT}` differs. The mirror is mechanical (`cp` + one `sed`). Loads from the template layer.

- **Template layer** — `specs/<type>.md`. The 11 prompt templates that drive spec generation. The single source of truth. Editing one template updates both Claude Code and Codex surfaces on next plugin pull. Loaded by the wrapper at runtime.

- **Context layer (per-project)** — `.aipe/project/*.md`. Lives in the user's repo, committed alongside the code it describes. `context.md` is required; `rules.md`, `stack.md`, and `aieng-curriculum.md` are optional. The first `/aipe:<type>` invocation scaffolds the directory with a placeholder `context.md` and stops, waiting for the user to fill in real values.

- **Context layer (global)** — `~/.config/aipe/global/*.md`. Cross-project context — identity, default stack, conventions, curriculum. All files optional. Present, they shape every spec across every project; absent, the per-project layer is enough.

- **Output layer** — `.aipe/specs/<type-plural>/<slug>.md` for single-file specs (10 of the 11 templates). `.aipe/specs/study/` is the only multi-file output: nested by section (`01-system-design/`, `02-dsa/`, `03-ai-engineering/`, optionally `04-machine-learning/`), each containing a `README.md` index plus one file per concept. `system-design-templates/` sub-directories under 03/04 hold IK-style interview reframes.

---

## Distribution map

```
                  ┌────────────────────┐
                  │ rlynjb/aipe (repo) │
                  └─────────┬──────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │                                     │
         ▼                                     ▼
┌──────────────────────┐              ┌──────────────────────┐
│ .claude-plugin/      │              │ .codex-plugin/       │
│   plugin.json        │              │   plugin.json        │
│   marketplace.json   │              │                      │
└──────────┬───────────┘              └──────────┬───────────┘
           │                                     │
           ▼                                     ▼
┌──────────────────────┐              ┌──────────────────────┐
│ Claude Code          │              │ Codex CLI            │
│ /plugin marketplace  │              │ codex plugin         │
│   add rlynjb/aipe    │              │   marketplace add    │
└──────────────────────┘              └──────────────────────┘
```

- One repo. Two plugin manifests. One version number bumped in lockstep across both manifests.

---

## Spec generation flow (the per-command contract)

```
[Step 1]  Scaffold .aipe/ if context.md absent  →  STOP for user to fill
   │
   ▼
[Step 2]  Load context (project + global, + curriculum for /aipe:study)
   │
   ▼
[Step 3]  Load template from specs/<type>.md
   │
   ▼
[Step 4]  Detect existing spec at output path
   │
   ├── absent ──▶  CREATE MODE  (Steps 5C–8C / 5C–11C for study)
   │
   └── present ─▶  UPDATE MODE
                     │
                     ▼
                  [Step 6U]  Diff A: spec vs codebase context
                              Diff B: spec vs current template structure
                     │
                     ▼
                  [Step 7U]  Print change plan → STOP for confirmation
                     │
                     ▼
                  [Step 8U]  Apply only confirmed changes
```

- **Every command stops after generating.** The spec is the handoff; implementation is a separate user turn.
- **UPDATE mode runs two diffs.** Diff A catches codebase drift. Diff B catches template-version drift (a sub-section added in a later plugin version that the existing spec never had).

---

## Key invariants (one-liners)

- `specs/*.md` is the single source of truth. Both plugins load it.
- `commands/<type>.md` and `skills/<type>/SKILL.md` stay byte-identical except for the plugin-root env var.
- One version number; `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` bumped together.
- `.aipe/project/context.md` is required and per-project. Global files are optional and idempotent.
- No state outside markdown — no DB, no cache, no telemetry, no remote service.
- The host agent in the user's session does the work using its own model. There is no aipe binary.

---

## Where to go next

- **Section 01 (system design):** how the layers above fit together — template-as-source-of-truth, per-spec-type contract, plugin distribution, context layering, two-diff UPDATE mode, scaffold-then-stop. → `01-system-design/README.md`
- **Section 02 (DSA):** the small operations that load-bear the design — curriculum file resolution, existing-guide detection, template structural diff. → `02-dsa/README.md`
- **Section 03 (AI engineering):** the curriculum-anchored concepts. Phase 1 prompt-engineering (where aipe lives), Phase 2B RAG (deferred), Phase 4A meta-agent (deferred), plus the LLM foundations / evals / production concepts every AI engineer should defend. → `03-ai-engineering/README.md`
