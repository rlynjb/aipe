# spec-tool — Implementation Plan

> Structured for Claude Code. Read this file at the start of every session and continue from the next unchecked step. Complete all checkboxes in the current phase before moving to the next. Notify the user when a phase is complete before proceeding.

---

## Session startup prompt

```
Read spec-tool-plan.md from the project root and continue
from the next unchecked step in the current active phase.
Do not modify any files not explicitly mentioned in that phase.
When a phase is fully complete, stop and notify the user
before starting the next phase.
```

---

## Notification rule

After completing every phase, stop and output this before doing anything else:

```
✓ Phase [N] complete — [phase name]

Summary of what was done:
- [bullet list of completed steps]

Next up: Phase [N+1] — [name]
[one sentence describing what it involves]

Ready to continue? Type "yes" to start Phase [N+1].
```

Do not begin the next phase until the user confirms.

---

## What this tool is

A spec workflow tool for developers who build with AI coding agents. It stores a library of proven prompt spec templates, knows about your project context, and generates filled specs you can hand directly to any coding agent.

The core loop is simple:

```
Developer describes intent
  → tool loads the right spec template
  → tool pulls project context
  → tool generates a filled spec
  → developer hands spec to coding agent
  → agent implements
```

The problem it solves: copying prompt templates from a cheatsheet, manually filling in project context, and re-explaining the same codebase to every agent every session. This tool automates all of that.

---

## Version distinctions

Each version is a different product with a different user experience — not just an upgrade to the same thing. Understanding the distinction before building prevents you from conflating them mid-implementation.

---

### v1 — CLI

**What it is:** A command-line tool you run in your terminal. You are the one calling it. The agent never touches it directly — it only reads the output file the CLI produces.

```
┌─────────────────────────────────────────────────────────────────┐
│                         v1 — CLI                                │
│                   "You run it. Agent reads it."                 │
└─────────────────────────────────────────────────────────────────┘

  Your terminal
  │
  │  npx [tool] feature "add dark mode toggle"
  │
  ▼
┌──────────────────────────────────────┐
│            [tool] CLI                │
│                                      │
│  1. reads .buffr/project/context.md  │◄── your project context
│  2. loads feature spec template      │◄── 14 built-in templates
│  3. calls Claude API to fill it      │◄── Anthropic API
│  4. saves filled spec to disk        │
└──────────────────────────────────────┘
  │
  │  .buffr/specs/features/add-dark-mode.md
  │
  ▼
┌──────────────────────────────────────┐
│         Your coding agent            │
│                                      │
│  Claude Code:                        │
│  "read .buffr/specs/features/        │
│   add-dark-mode.md then implement"   │
│                                      │
│  Codex CLI:                          │
│  codex ".buffr/specs/features/       │
│         add-dark-mode.md"            │
└──────────────────────────────────────┘
```

**How to use it:**

```
Step 1 — Install (once)
  npm install -g [tool]
  or just use npx — no install needed

Step 2 — Initialise your project (once per project)
  cd your-project
  npx [tool] init
  → creates .buffr/ scaffold in current directory

Step 3 — Fill in your context (once, update as codebase changes)
  edit .buffr/project/context.md
  → describe your stack, data model, file structure

Step 4 — Generate a spec (whenever you need one)
  npx [tool] feature "add dark mode toggle"
  npx [tool] debug "cart total shows wrong amount"
  npx [tool] interview --project ./my-spec.md

Step 5 — Hand it to your agent
  Claude Code:  "read .buffr/specs/features/add-dark-mode.md
                 then implement"
  Codex:        codex ".buffr/specs/features/add-dark-mode.md"
  Any agent:    paste the file path — if it reads files, it works
```

**Works in:** Any terminal. Claude Code terminal, Codex CLI, Cursor terminal, Warp, iTerm, bash, zsh. If Node.js is installed, it works.

**Requires:** Node.js. An `ANTHROPIC_API_KEY` in your environment.

---

### v2 — MCP Server

**What it is:** A server that wraps the same CLI logic and exposes it as tools the coding agent can call directly — without you running a command. The agent becomes the one calling the tool, mid-session, on your behalf.

```
┌─────────────────────────────────────────────────────────────────┐
│                      v2 — MCP Server                            │
│              "Agent calls it. You just describe intent."        │
└─────────────────────────────────────────────────────────────────┘

  You (in your coding agent)
  │
  │  "generate a debugging spec for the
  │   agent routing bug in Ollama"
  │
  ▼
┌──────────────────────────────────────┐
│         Coding agent                 │
│   (Claude Code / Cursor / Windsurf)  │
│                                      │
│  agent decides to call a tool ───────┼──────────────────┐
└──────────────────────────────────────┘                  │
                                                          ▼
                                          ┌───────────────────────────┐
                                          │   [tool] MCP Server       │
                                          │                           │
                                          │  tools it exposes:        │
                                          │   list_specs()            │
                                          │   get_spec(type)          │
                                          │   generate_spec(          │
                                          │     type, intent,         │
                                          │     context)              │
                                          │   save_spec(...)          │
                                          │   get_context()           │
                                          └───────────────────────────┘
                                                          │
                                          filled spec returned to agent
                                                          │
                                          ┌───────────────▼───────────┐
                                          │  Agent continues working  │
                                          │  with the spec inline —   │
                                          │  no file handoff needed   │
                                          └───────────────────────────┘
```

**How to use it:**

```
Step 1 — Add to your agent config (once)

  Claude Code (~/.claude.json):
  {
    "mcpServers": {
      "[tool]": {
        "command": "npx",
        "args": ["[tool]-mcp"]
      }
    }
  }

  Cursor (settings → MCP):
  {
    "mcpServers": {
      "[tool]": {
        "command": "npx",
        "args": ["[tool]-mcp"]
      }
    }
  }

Step 2 — Use naturally in conversation
  You:   "generate a feature spec for adding dark mode"
  Agent: [calls generate_spec("feature", "add dark mode")]
  Agent: "Here's the spec. Should I implement it now?"

Step 3 — No file handoff needed
  The agent has the spec inline — it can implement
  immediately or save it for a future session
```

**The difference from v1:** In v1, you run the tool and then tell the agent about the output. In v2, the agent runs the tool itself — the loop is fully inside the session.

**Works in:** Any MCP-compatible agent: Claude Code, Cursor, Windsurf, Cline, Continue, Zed. The list grows as more agents adopt the standard.

**Requires:** One config entry per agent. Same `ANTHROPIC_API_KEY`.

---

### v3 — Web App (MCP Client)

**What it is:** A browser-based product that connects to MCP servers as data sources, assembles your project context automatically, and generates complete specs without you having to fill in anything manually. It is a client that *consumes* MCP servers — including your own v2 server — rather than a server that exposes tools.

```
┌─────────────────────────────────────────────────────────────────┐
│                   v3 — Web App (MCP Client)                     │
│       "Connect your sources. Describe intent. Get the spec."    │
└─────────────────────────────────────────────────────────────────┘

  You (in a browser)
  │
  │  "add dark mode toggle to the settings page"
  │
  ▼
┌─────────────────────────────────────────────────┐
│               Web App UI                        │
│                                                 │
│  Project: buffr          Spec type: Feature     │
│  Intent: [add dark mode toggle ............]    │
│  [Generate spec]                                │
└─────────────────────────────────────────────────┘
  │
  │  triggers LangChain agent
  ▼
┌─────────────────────────────────────────────────┐
│           LangChain Agent                       │
│                                                 │
│  assembles context by calling:                  │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │  GitHub MCP      │  │  Filesystem MCP      │ │
│  │                  │  │                      │ │
│  │  pulls:          │  │  reads:              │ │
│  │  → open issues   │  │  → .buffr/project/   │ │
│  │  → recent PRs    │  │    context.md        │ │
│  │  → file tree     │  │  → .buffr/global/    │ │
│  └──────────────────┘  └──────────────────────┘ │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │  Notion MCP      │  │  [tool] MCP Server   │ │
│  │                  │  │       (v2)           │ │
│  │  pulls:          │  │                      │ │
│  │  → project docs  │  │  provides:           │ │
│  │  → meeting notes │  │  → spec template     │ │
│  │  → decisions     │  │  → filled spec       │ │
│  └──────────────────┘  └──────────────────────┘ │
│                                                 │
│  merges all context → calls generate_spec()     │
└─────────────────────────────────────────────────┘
  │
  │  complete filled spec — no manual context needed
  ▼
┌─────────────────────────────────────────────────┐
│               Spec output UI                    │
│                                                 │
│  [Copy for Claude Code]  [Copy for Codex]       │
│  [Save to .buffr/specs/] [Export as .md]        │
│                                                 │
│  Spec history → all specs for this project      │
└─────────────────────────────────────────────────┘
```

**How to use it:**

```
Step 1 — Sign in and create a project
  app.[tool].dev → sign in → new project → "buffr"

Step 2 — Connect your data sources (once per project)
  Connect GitHub  → authorise → select repo
  Connect Notion  → authorise → select workspace
  Connect local   → install filesystem MCP → link path

Step 3 — Generate a spec
  Select spec type: Feature
  Describe intent: "add dark mode toggle to settings"
  Click Generate

  The app:
  → pulls your repo structure from GitHub
  → reads your project context from .buffr/
  → pulls relevant Notion docs
  → assembles full context automatically
  → generates a complete, filled spec

Step 4 — Hand it to your agent
  Click "Copy for Claude Code" → paste into session
  or
  Click "Save to .buffr/specs/" → file is written locally
  then tell your agent to read it
```

**The difference from v1 and v2:** In v1 you fill in the context manually. In v2 the agent helps but still needs you to have set up `.buffr/`. In v3 the context is assembled automatically from your live data sources — GitHub issues, Notion docs, recent commits. The spec gets smarter every time you connect a new source.

**Works in:** Any browser. The output works with any coding agent.

**Requires:** Account. GitHub and/or Notion connected. Optional: local filesystem MCP for `.buffr/` integration.

---

### Side-by-side comparison

```
                    v1 CLI          v2 MCP Server     v3 Web App
─────────────────────────────────────────────────────────────────
Who runs it         You             The agent         You (browser)
Context source      .buffr/ files   Agent passes it   MCP servers
                                                      (auto-assembled)
Where output goes   File on disk    Inline in agent   UI + file/copy
Agent integration   Manual handoff  Native mid-session Native + copy
Setup               npx — nothing   Config once        Account + OAuth
Works offline       Yes             Yes (if local)    No
Requires API key    Yes             Yes               No (managed)
─────────────────────────────────────────────────────────────────
Best for            Solo devs who   Devs who want     Teams or devs
                    want fast CLI   seamless agent    who want zero
                    with no setup   integration       manual context
```

**The progression:** v1 proves the spec loop. v2 removes the manual step. v3 removes the context setup entirely.

---

In v2, Claude Code and Codex can call the MCP server directly mid-session without the developer running anything manually.

---

## Tech stack

```
v1 CLI
  Runtime:     Node.js
  Language:    TypeScript
  CLI parser:  commander or yargs
  LLM:         Anthropic SDK (claude-sonnet-4-20250514)
  Context:     fs — reads .buffr/project/context.md
  Output:      stdout + optional file write
  Publish:     npm (npx [tool-name])

v2 MCP Server
  Runtime:     Node.js
  Language:    TypeScript
  MCP SDK:     @modelcontextprotocol/sdk
  Builds on:   v1 core logic (same spec generation)
  Transport:   stdio (standard for local MCP servers)
  Publish:     npm (same package, different entry point)

v3 Web App
  Frontend:    Next.js + TypeScript + Tailwind
  Backend:     Netlify Functions
  Auth:        Clerk or Auth.js
  DB:          Neon Postgres + Drizzle
  MCP client:  connects to GitHub MCP, Notion MCP,
               Filesystem MCP, and v2 server
  LLM:         LangChain.js + multi-provider
  Deploy:      Netlify
```

---

## Phase overview

| Phase | Description | Depends on | Est. |
|-------|-------------|------------|------|
| **1** | CLI foundation — scaffold, config, spec runner | — | 3–4h |
| **2** | Spec templates — all 14 specs as prompt files | Phase 1 | 2–3h |
| **3** | Context loading — read .buffr/ + project files | Phase 1 | 2–3h |
| **4** | LLM generation — fill specs via Claude API | Phase 2 + 3 | 3–4h |
| **5** | Agent adapters — Claude Code + Codex output formats | Phase 4 | 2–3h |
| **6** | Polish + publish — npm publish, README, npx support | Phase 5 | 2–3h |
| **7** | MCP server — expose CLI logic as MCP tools | Phase 6 | 4–5h |
| **8** | Web app foundation — Next.js, auth, DB, design system | Phase 6 | 4–6h |
| **9** | MCP client — connect GitHub, Notion, Filesystem MCPs | Phase 8 | 4–6h |
| **10** | Web app spec workflow — full generation UI | Phase 9 | 4–6h |
| | **Total** | | **30–43h** |

---

## Phase 1 — CLI foundation

**Status: Active**

**Goal:** Scaffold the project, set up TypeScript, and get a working CLI that accepts a spec type and intent as arguments. No LLM calls yet — just the skeleton that everything else builds on.

**Depends on:** —

### Project structure (target)

```
[tool-name]/
  src/
    cli.ts              ← entry point — parses args, routes commands
    commands/
      generate.ts       ← generate a spec
      list.ts           ← list available spec types
      init.ts           ← scaffold .buffr/ in current project
    lib/
      templates.ts      ← loads spec templates from disk
      context.ts        ← reads project context files
      llm.ts            ← Anthropic API calls
      output.ts         ← formats and saves output
    templates/          ← the 14 spec markdown files (Phase 2)
    types.ts            ← shared TypeScript interfaces
  bin/
    cli.js              ← compiled entry point for npx
  package.json
  tsconfig.json
  README.md
  spec-tool-plan.md     ← this file
```

### Steps

- [ ] **1.1** Initialise project: `npm init -y`, install TypeScript, `tsx`, `commander`, `@anthropic-ai/sdk`, `dotenv`. Create `tsconfig.json` targeting `es2022`, `moduleResolution: bundler`.

- [ ] **1.2** Create `src/types.ts`:
  ```typescript
  export type SpecType =
    | 'plan' | 'feature' | 'debugging' | 'curriculum'
    | 'interview' | 'audit' | 'testing' | 'user-stories'
    | 'refactor' | 'migration' | 'performance'
    | 'prompt-engineering' | 'onboarding' | 'integration';

  export interface SpecRequest {
    type: SpecType;
    intent: string;
    projectName?: string;
    contextPath?: string;
    outputPath?: string;
    agent?: 'claude-code' | 'codex' | 'cursor' | 'generic';
    dryRun?: boolean;
  }

  export interface SpecResult {
    type: SpecType;
    intent: string;
    content: string;
    savedTo?: string;
  }
  ```

- [ ] **1.3** Create `src/cli.ts` using `commander`:
  - `generate <type> <intent>` — main command
  - `list` — list available spec types with descriptions
  - `init` — scaffold `.buffr/` directory in current project
  - Global options: `--output <path>`, `--agent <name>`, `--dry-run`, `--context <path>`

- [ ] **1.4** Create `src/commands/list.ts` — prints a table of all 14 spec types with a one-line description of each.

- [ ] **1.5** Create `src/commands/init.ts` — scaffolds `.buffr/` in the current working directory:
  ```
  .buffr/
    global/
      identity.md     ← placeholder — edit with your details
      rules.md        ← placeholder
      stack.md        ← placeholder
      skills.md       ← placeholder
    project/
      context.md      ← placeholder — fill with codebase context
      rules.md        ← placeholder
      stack.md        ← placeholder
    specs/            ← empty — filled by generate command
  ```

- [ ] **1.6** Add `bin` field to `package.json`, create `bin/cli.js` as a thin wrapper that runs `src/cli.ts` via `tsx`.

- [ ] **1.7** Verify: `npx tsx src/cli.ts list` prints all spec types. `npx tsx src/cli.ts init` creates `.buffr/` in the current directory.

---

### Constraints
- No LLM calls in this phase — stubs only
- Do not create the templates folder yet — that is Phase 2
- Keep `commander` usage minimal — routing only, no business logic in `cli.ts`

### Rollback plan
Delete the directory and start over — no external state, no database, no side effects.

### ✓ Done when
- [ ] `list` command prints all 14 spec types
- [ ] `init` command creates `.buffr/` scaffold
- [ ] `generate` command accepts type + intent args without crashing (stub output ok)
- [ ] Project compiles with `tsc --noEmit`

**→ Notify user, wait for confirmation before starting Phase 2**

---

## Phase 2 — Spec templates

**Status: Backlog**

**Goal:** Add all 14 spec prompt templates as markdown files. These are the core content of the tool — the prompts that get filled in with project context and handed to the LLM.

**Depends on:** Phase 1 complete

### Steps

- [ ] **2.1** Create `src/templates/` directory. Copy the 14 spec markdown files from the specs-md folder into it:
  ```
  plan.md
  feature.md
  debugging.md
  curriculum.md
  interview.md
  audit.md
  testing.md
  user-stories.md
  refactor.md
  migration.md
  performance.md
  prompt-engineering.md
  onboarding.md
  integration.md
  ```

- [ ] **2.2** Create `src/lib/templates.ts`:
  - `loadTemplate(type: SpecType): string` — reads the markdown file for the given spec type
  - `listTemplates(): { type: SpecType; description: string }[]` — returns all types with descriptions
  - `injectIntent(template: string, intent: string): string` — replaces `[paste your spec...]` placeholder with actual intent

- [ ] **2.3** Update `src/commands/list.ts` to use `listTemplates()` instead of hardcoded values.

- [ ] **2.4** Verify: `npx tsx src/cli.ts generate feature "add dark mode"` loads and prints the feature template with the intent injected.

---

### Constraints
- Do not modify the template content in this phase — copy as-is
- Templates must load from disk at runtime, not be bundled as strings

### ✓ Done when
- [ ] All 14 templates load without errors
- [ ] `generate` command prints the correct template for any spec type
- [ ] Intent is correctly injected into the template

**→ Notify user, wait for confirmation before starting Phase 3**

---

## Phase 3 — Context loading

**Status: Backlog**

**Goal:** Read project context from `.buffr/` directory so the spec generation has real codebase knowledge to work with.

**Depends on:** Phase 1 complete

### Steps

- [ ] **3.1** Create `src/lib/context.ts`:
  - `findBuffrDir(startPath?: string): string | null` — walks up from cwd until it finds `.buffr/`
  - `loadProjectContext(buffr Dir: string): ProjectContext` — reads all files in `.buffr/project/` and `.buffr/global/`
  - `formatContextForPrompt(ctx: ProjectContext): string` — formats context as a clean string for injection into prompts

- [ ] **3.2** Add `ProjectContext` interface to `src/types.ts`:
  ```typescript
  export interface ProjectContext {
    identity?: string;       // .buffr/global/identity.md
    globalRules?: string;    // .buffr/global/rules.md
    globalStack?: string;    // .buffr/global/stack.md
    globalSkills?: string;   // .buffr/global/skills.md
    projectContext?: string; // .buffr/project/context.md
    projectRules?: string;   // .buffr/project/rules.md
    projectStack?: string;   // .buffr/project/stack.md
  }
  ```

- [ ] **3.3** Update `src/commands/generate.ts` to load context before generating. If `.buffr/` is not found, warn the user and suggest running `init` — but continue with an empty context rather than failing.

- [ ] **3.4** Support `--context <path>` flag to override the auto-detected `.buffr/project/context.md` with any markdown file.

- [ ] **3.5** Verify: running `generate` from a directory with a `.buffr/` folder loads and injects context. Running from a directory without one warns but continues.

---

### Constraints
- Context loading must never throw — degrade gracefully to empty context
- Do not read files outside `.buffr/` unless `--context` flag is explicitly passed

### ✓ Done when
- [ ] Context loads correctly from `.buffr/` in current or parent directory
- [ ] Missing `.buffr/` shows warning, not error
- [ ] `--context` flag overrides default context path

**→ Notify user, wait for confirmation before starting Phase 4**

---

## Phase 4 — LLM generation

**Status: Backlog**

**Goal:** Wire the Anthropic Claude API to take the template + context + intent and return a filled spec.

**Depends on:** Phase 2 + Phase 3 complete

### Steps

- [ ] **4.1** Create `src/lib/llm.ts`:
  - `generateSpec(request: SpecRequest, template: string, context: ProjectContext): Promise<string>`
  - Uses `@anthropic-ai/sdk`, model `claude-sonnet-4-20250514`
  - System prompt: positions Claude as the spec assistant with the project context
  - User message: the template with intent injected
  - Returns: the filled spec as a markdown string

- [ ] **4.2** System prompt for spec generation:
  ```
  You are a spec assistant for an AI-assisted software
  development workflow. You are given a spec template
  and a project context. Your job is to fill in the
  template completely, replacing all placeholder text
  with specific, accurate content derived from the
  project context and the developer's stated intent.

  Rules:
  - Every placeholder must be filled — no [brackets] left
  - All file names and paths must match the actual project
  - Constraints section must reflect real project constraints
  - Output only the filled spec — no preamble, no commentary
  ```

- [ ] **4.3** Add `ANTHROPIC_API_KEY` to `.env` loading via `dotenv`. Fail with a clear message if key is missing.

- [ ] **4.4** Update `src/commands/generate.ts` to call `generateSpec()` and print the result.

- [ ] **4.5** Add `--dry-run` flag that skips the LLM call and prints the unfilled template with context injected — useful for debugging without burning API credits.

- [ ] **4.6** Verify: `npx tsx src/cli.ts generate feature "add dark mode toggle"` calls Claude and returns a filled spec.

---

### Constraints
- Model must be `claude-sonnet-4-20250514` — do not make model configurable yet
- API key must come from env — never hardcoded
- Streaming is optional in this phase — blocking response is fine

### ✓ Done when
- [ ] `generate` command calls Claude and returns a filled spec
- [ ] Missing API key shows a clear error with instructions
- [ ] `--dry-run` prints template without calling Claude

**→ Notify user, wait for confirmation before starting Phase 5**

---

## Phase 5 — Agent adapters

**Status: Backlog**

**Goal:** Format and save spec output optimised for different coding agents. Claude Code and Codex have different conventions for how they expect to receive instructions.

**Depends on:** Phase 4 complete

### Steps

- [ ] **5.1** Create `src/lib/output.ts`:
  - `formatForAgent(spec: string, agent: SpecRequest['agent']): string` — wraps or formats the spec for the target agent
  - `saveSpec(spec: string, request: SpecRequest): string` — saves to the correct `.buffr/specs/[type]/[name].md` path and returns the saved path

- [ ] **5.2** Agent-specific formatting:
  ```
  claude-code   No wrapper needed. Append this footer:
                ---
                To implement: "Read [saved-path] then implement."

  codex         No wrapper needed. Append this footer:
                ---
                To implement: codex "[saved-path]"

  cursor        No wrapper needed. Append reference comment at top:
                <!-- spec: [saved-path] -->

  generic       Plain markdown, no additions
  ```

- [ ] **5.3** Auto-detect agent from environment if `--agent` flag is not passed:
  - Check `CLAUDE_CODE` env var → `claude-code`
  - Check `CODEX_CLI` env var → `codex`
  - Default → `generic`

- [ ] **5.4** Update `src/commands/generate.ts` to save the spec and print the saved path + the "to implement" instruction.

- [ ] **5.5** Add `--print` flag that outputs the spec to stdout instead of saving — useful for piping to other tools.

- [ ] **5.6** Verify: generating a spec with `--agent claude-code` saves to `.buffr/specs/` and prints the correct Claude Code invocation. Same for `--agent codex`.

---

### Constraints
- Do not create `.buffr/specs/` if it doesn't exist — create it automatically
- Saved filename should be slugified from the intent: "add dark mode" → `add-dark-mode.md`
- Never overwrite an existing spec file — append a timestamp suffix if conflict

### ✓ Done when
- [ ] Spec saves to correct `.buffr/specs/[type]/[name].md`
- [ ] Claude Code footer is correct
- [ ] Codex footer is correct
- [ ] `--print` flag outputs to stdout without saving
- [ ] Agent auto-detection works from env vars

**→ Notify user, wait for confirmation before starting Phase 6**

---

## Phase 6 — Polish + publish

**Status: Backlog**

**Goal:** Make the CLI production-ready and publish to npm so anyone can use it with `npx`.

**Depends on:** Phase 5 complete

### Steps

- [ ] **6.1** Write `README.md`:
  - What it is (one paragraph)
  - Installation: `npm install -g [tool]` and `npx [tool]`
  - Quick start: 3 commands to get started
  - All 14 spec types with descriptions
  - `init`, `generate`, `list` command reference
  - Agent compatibility table (Claude Code, Codex, Cursor, generic)
  - Environment variables

- [ ] **6.2** Add `build` script to `package.json`: compile TypeScript to `dist/`. Update `bin` to point to `dist/cli.js`.

- [ ] **6.3** Add `.npmignore` — exclude `src/`, `*.ts`, test files, `.env`.

- [ ] **6.4** Set package metadata: `name`, `version: 0.1.0`, `description`, `keywords: ["ai", "spec", "cli", "claude-code", "codex"]`, `license: MIT`.

- [ ] **6.5** Test `npx` flow end to end from a clean directory:
  - `npx [tool] init`
  - Edit `.buffr/project/context.md`
  - `npx [tool] generate feature "add user settings page"`
  - Confirm spec saved and Claude Code / Codex invocation printed

- [ ] **6.6** `npm publish --access public`

---

### ✓ Done when
- [ ] `npx [tool] --help` works from any machine with Node.js
- [ ] README covers all commands and agent setup
- [ ] Published to npm registry

**→ Notify user, wait for confirmation before starting Phase 7**

---

## Phase 7 — MCP server _(backlog)_

**Goal:** Expose the CLI's core logic as MCP tools so coding agents can call spec generation natively mid-session — without the developer running a command manually.

**Depends on:** Phase 6 complete and published

**What changes:** The LLM generation and context loading from v1 don't change. A new entry point wraps them in the MCP protocol. Same package, new `bin` entry.

**Key work:**
- Install `@modelcontextprotocol/sdk`
- Create `src/mcp-server.ts` entry point using `StdioServerTransport`
- Expose tools: `list_specs`, `get_spec`, `generate_spec`, `save_spec`, `get_context`
- Add `bin/mcp.js` entry point to `package.json`
- Test in Claude Code (`claude mcp add`) and Cursor MCP config
- Document agent config snippets for Claude Code, Cursor, Windsurf, Cline

**Agent config format (Claude Code):**
```json
{
  "mcpServers": {
    "[tool-name]": {
      "command": "npx",
      "args": ["[tool-name]-mcp"]
    }
  }
}
```

---

## Phase 8 — Web app foundation _(backlog)_

**Goal:** Scaffold the Next.js web app — auth, database, design system. No spec logic yet — infrastructure only.

**Depends on:** Phase 6 complete

**Key work:**
- Next.js 15 + TypeScript + Tailwind + Netlify
- Auth (Clerk or Auth.js)
- Neon Postgres + Drizzle schema: `users`, `projects`, `specs`, `connections`
- Design system — same aesthetic as buffr (dark, clean, monospace accents)
- Dashboard: list projects, add project, project detail page

---

## Phase 9 — MCP client _(backlog)_

**Goal:** Connect the web app to external MCP servers as data sources — GitHub, Notion, Filesystem — so context is assembled automatically.

**Depends on:** Phase 8 complete

**Key work:**
- Connect GitHub MCP — pull repos, issues, commits, file structure
- Connect Notion MCP — pull project docs and notes
- Connect Filesystem MCP — read `.buffr/` from a linked local path
- Build context assembly layer — merge sources into a single `ProjectContext`
- UI for managing connections per project

---

## Phase 10 — Web app spec workflow _(backlog)_

**Goal:** Full spec generation UI in the browser. Developer describes intent, app assembles context from connected sources, LangChain agent fills the spec, result is ready to hand to any coding agent.

**Depends on:** Phase 9 complete

**Key work:**
- Spec generation page — select type, enter intent, generate
- LangChain agent that calls: Filesystem MCP (context), v2 MCP server (template + generation)
- Spec history per project — list, view, copy, re-generate
- One-click copy formatted for Claude Code, Codex, or generic
- Export to `.buffr/specs/` via Filesystem MCP

---

## Cross-phase constraints

- **Notify after every phase** — summary, next phase, wait for "yes"
- **One phase per Claude Code session** — no skipping ahead
- **Do not touch unrelated files** — only files mentioned in current phase
- **Run `tsc --noEmit` after every phase** — no phase is done until it compiles
- **Agent-agnostic by design** — never hardcode Claude Code as the only target
- **`.buffr/` is optional** — tool must work without it, just with less context

---

## Naming note

The tool name is TBD. Use `[tool-name]` as a placeholder throughout this plan. When a name is decided, do a global find-and-replace before publishing. Good candidates: something short, memorable, and related to specs, prompts, or scaffolding.

---

## File location

Save as `spec-tool-plan.md` in the project root once a repo is created.
