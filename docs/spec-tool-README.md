# [tool-name]

> Your specs. Your conventions. Available in every coding agent, on every project.

---

## What this is

A spec workflow tool for developers who build with AI coding agents.

The problem it solves: you have proven prompt templates — for features, debugging, interviews, migrations. But every session you copy them from a cheatsheet, manually fill in project context, and re-explain the same codebase to the agent. Again. And again.

This tool automates that loop. Describe your intent. The tool loads the right template, pulls your project context, calls Claude to fill it in, and saves a spec your agent can implement from immediately.

```
You describe intent
  → tool loads spec template
  → tool pulls project context
  → Claude fills the spec
  → you hand it to your coding agent
  → agent implements
```

Works with **Claude Code**, **Codex CLI**, **Cursor**, **Windsurf**, **Cline**, and any agent that can read a file.

---

## Why this exists

Most current solutions to agent context are either too broad or too narrow:

```
Too broad    "here's my whole codebase as context"
             → noisy, expensive, slow

Too narrow   "here's this one .cursorrules file"
             → doesn't travel across projects or agents
```

This tool is structured, portable, and reusable. The same 14 spec templates work for every project. Your context is managed by the tool — not by you — and travels across every project and machine you work on.

---

## The three versions

This tool ships in three versions. Each one is a different product — not just an upgrade to the same thing.

---

### v1 — CLI

**"You run it. Agent reads it."**

A command-line tool you run in your terminal. You call it. The agent reads the file it produces.

```
  Your terminal
  │
  │  npx [tool] feature "add dark mode toggle"
  │
  ▼
┌──────────────────────────────────────┐
│            [tool] CLI                │
│                                      │
│  1. reads project context from ~/.config/[tool]/  │◄── your project context
│  2. loads feature spec template      │◄── 14 built-in templates
│  3. calls Claude API to fill it      │◄── Anthropic API
│  4. saves filled spec to disk        │
└──────────────────────────────────────┘
  │
  │  ~/.config/[tool]/projects/[id]/specs/features/add-dark-mode.md
  │
  ▼
┌──────────────────────────────────────┐
│         Your coding agent            │
│                                      │
│  Claude Code:                        │
│  "read [tool context: feature/add-dark-mode]  │
│   then implement"   │
│                                      │
│  Codex CLI:                          │
│  codex "[tool context: feature/add-dark-mode]"            │
└──────────────────────────────────────┘
```

**How to use:**

```bash
# Step 1 — initialise your project (once)
npx [tool] init

# Step 2 — fill in your context (once, update when codebase changes)
# npx [tool] scan  ← auto-generates context

# Step 3 — generate a spec
npx [tool] feature "add dark mode toggle"
npx [tool] debug "cart total shows wrong amount"
npx [tool] interview --project ./my-app-spec.md

# Step 4 — hand it to your agent
# Claude Code:
"read ~/.config/[tool]/projects/[id]/specs/features/add-dark-mode.md then implement"

# Codex:
codex "~/.config/[tool]/projects/[id]/specs/features/add-dark-mode.md"
```

**Works in:** Any terminal — Claude Code, Codex CLI, Cursor terminal, Warp, iTerm, bash, zsh.

**Requires:** Node.js. `ANTHROPIC_API_KEY` in your environment.

---

### v2 — MCP Server

**"Agent calls it. You just describe intent."**

The same spec logic, exposed as MCP tools the coding agent calls directly — mid-session, without you running a command. The agent becomes the one calling the tool on your behalf.

```
  You (in your coding agent)
  │
  │  "generate a debugging spec for the
  │   agent routing bug in Ollama"
  │
  ▼
┌──────────────────────────────────────┐
│  Coding agent                        │
│  (Claude Code / Cursor / Windsurf)   │
│                                      │
│  agent calls a tool ─────────────────┼──────────────┐
└──────────────────────────────────────┘              │
                                                      ▼
                                        ┌─────────────────────────┐
                                        │  [tool] MCP Server      │
                                        │                         │
                                        │  list_specs()           │
                                        │  get_spec(type)         │
                                        │  generate_spec(         │
                                        │    type, intent,        │
                                        │    context)             │
                                        │  save_spec(...)         │
                                        │  get_context()          │
                                        └─────────────────────────┘
                                                      │
                                        filled spec returned to agent
                                                      │
                                        ┌─────────────▼───────────┐
                                        │  Agent continues with   │
                                        │  spec inline — no file  │
                                        │  handoff needed         │
                                        └─────────────────────────┘
```

**How to use:**

```jsonc
// Step 1 — add to agent config once

// Claude Code (~/.claude.json):
{
  "mcpServers": {
    "[tool]": {
      "command": "npx",
      "args": ["[tool]-mcp"]
    }
  }
}

// Cursor / Windsurf (settings → MCP):
{
  "mcpServers": {
    "[tool]": {
      "command": "npx",
      "args": ["[tool]-mcp"]
    }
  }
}
```

```
# Step 2 — use naturally in conversation
You:   "generate a feature spec for adding dark mode"
Agent: [calls generate_spec("feature", "add dark mode")]
Agent: "Here's the spec. Should I implement it now?"

# No file handoff — the agent has it inline and can
# implement immediately or save for a future session
```

**Works in:** Claude Code, Cursor, Windsurf, Cline, Continue, Zed — any MCP-compatible agent.

**Requires:** One config entry per agent. Same `ANTHROPIC_API_KEY`.

---

### v3 — Web App (MCP Client)

**"Connect your sources. Describe intent. Get the spec."**

A browser-based product that connects to MCP servers as data sources and assembles your project context automatically. It *consumes* MCP servers — including your own v2 server — rather than exposing tools.

```
  You (in a browser)
  │
  │  "add dark mode toggle to the settings page"
  │
  ▼
┌──────────────────────────────────────────────┐
│  Web App UI                                  │
│                                              │
│  Project: my-app     Spec type: Feature      │
│  Intent: [add dark mode toggle ...........]  │
│  [Generate spec]                             │
└──────────────────────────────────────────────┘
  │
  │  triggers LangChain agent
  ▼
┌──────────────────────────────────────────────┐
│  LangChain Agent                             │
│                                              │
│  ┌─────────────────┐  ┌───────────────────┐  │
│  │  GitHub MCP     │  │  Filesystem MCP   │  │
│  │  → open issues  │  │  → ~/.config/    │  │
│  │  → recent PRs   │  │    context.md     │  │
│  │  → file tree    │  │  → global rules   │  │
│  └─────────────────┘  └───────────────────┘  │
│                                              │
│  ┌─────────────────┐  ┌───────────────────┐  │
│  │  Notion MCP     │  │  [tool] MCP (v2)  │  │
│  │  → project docs │  │  → spec template  │  │
│  │  → decisions    │  │  → filled spec    │  │
│  └─────────────────┘  └───────────────────┘  │
│                                              │
│  merges context → generates spec            │
└──────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────┐
│  Spec output                                 │
│                                              │
│  [Copy for Claude Code]  [Copy for Codex]    │
│  [Save to local specs/] [Export .md]        │
│                                              │
│  Spec history — all specs for this project   │
└──────────────────────────────────────────────┘
```

**How to use:**

```
1. Sign in → create a project
2. Connect GitHub → select repo
   Connect Notion → select workspace (optional)
   Connect local  → install filesystem MCP → link path
3. Select spec type, describe intent, click Generate
   → context assembled automatically from all sources
   → complete spec returned with no manual filling
4. Copy for Claude Code / Codex, or save to local specs/
```

**Works in:** Any browser. Output works with any coding agent.

**Requires:** Account. GitHub connected. Notion and filesystem optional.

---

### Side by side

```
                    v1 CLI          v2 MCP Server     v3 Web App
─────────────────────────────────────────────────────────────────
Who calls it        You             The agent         You (browser)
Context source      local ~/.config/   Agent provides    MCP servers
                                                      (auto-assembled)
Output lands        File on disk    Inline in agent   UI + copy/save
Agent integration   Manual handoff  Native            Copy + paste
Setup               npx, nothing    Config once        Account + OAuth
Works offline       Yes             Yes (if local)    No
Best for            Fast CLI,       Seamless agent    Zero manual
                    no setup        integration       context setup
─────────────────────────────────────────────────────────────────
```

**The progression:** v1 proves the spec loop. v2 removes the manual command step. v3 removes the context setup entirely.

---

## The 14 spec templates

```
Plan              multi-phase project planning for Claude Code
Feature           building something new
Debugging         observability-first bug investigation
Curriculum        turn a codebase into a learning resource
Interview         book-style interview prep from your codebase
Audit             review existing code before adding features
Testing           writing and improving tests
User stories      rewrite tasks in different personas
Refactor          restructure without changing behaviour
Migration         schema, dependency, or storage changes
Performance       diagnosing speed and bundle size issues
Prompt eng        fixing AI output quality
Onboarding        generate context docs for a new codebase
Integration       connecting an external service
```

---

## How context storage works

Context is managed invisibly by the tool — there is no folder to commit, no file to manually maintain, and nothing extra showing up in your repo.

```
Developer never sees or edits a context folder.
Tool manages everything internally.

~/.config/[tool-name]/
  identity.md        ← your developer identity (set once)
  rules.md           ← conventions you always follow
  stack.md           ← your default tech stack
  skills.md          ← reusable patterns
  projects/
    [project-id]/    ← keyed by git remote or repo path
      context.md     ← auto-generated by scanning the repo
      specs/         ← generated specs for this project
```

The developer interacts only through commands:

```bash
npx [tool] setup     # one-time: describe yourself as a developer
npx [tool] scan      # analyse current repo, build project context
npx [tool] context   # print what the tool knows (no black boxes)
npx [tool] feature "add dark mode toggle"
```

---

## Context storage tradeoffs — the honest picture

There is no tradeoff-free way to store context. Here is what each approach gives up so you know what you're choosing.

```
~/.config/ (v1 — local, invisible)
  ✓ clean repo — nothing committed
  ✓ developer never manually edits files
  ✗ machine-local — switch machines, context doesn't travel
  ✗ teams can't share it
  ✗ no version history

Committed to repo (visible folder)
  ✓ context travels with the repo
  ✓ version history
  ✓ teams share the same context
  ✗ folder shows up in the repo
  ✗ developer has to think about it

Cloud (v3 — remote, invisible)
  ✓ travels across every machine
  ✓ team-shareable
  ✓ auto-generated, no manual editing
  ✓ no folder in the repo
  ✗ requires account and internet
```

**v1 accepts the machine-local limitation deliberately.** It is a CLI to prove the spec generation loop works — not the finished product. The limitation is addressed in v2 and fully eliminated in v3.

---

## The ContextProvider abstraction

The way the tradeoffs are eliminated progressively is through a single abstraction built into v1 from the start. Context has an interface — not a hardcoded path — so the source can swap out without rewriting any spec generation logic.

```typescript
// v1 — reads from local ~/.config/
const context = await ContextProvider.fromDisk(process.cwd());

// v2 — same interface, reads from MCP server
const context = await ContextProvider.fromMCP(projectId);

// v3 — same interface, reads from cloud
const context = await ContextProvider.fromCloud(userId, projectId);
```

The spec generation logic never changes across versions. Only the context source changes. This means:

- v1 ships fast with no cloud dependency
- v2 adds the MCP server and swaps the provider — nothing else changes
- v3 adds the cloud layer and swaps the provider again — spec logic untouched

```
┌─────────────────────────────────────────────────────────────┐
│                  Spec generation logic                      │
│    (same across v1, v2, v3 — never rewritten)              │
└─────────────────────────────────────────────────────────────┘
           │               │               │
           ▼               ▼               ▼
  ContextProvider   ContextProvider  ContextProvider
    .fromDisk()       .fromMCP()      .fromCloud()
        │                 │                │
        ▼                 ▼                ▼
  ~/.config/         MCP server       Cloud API
  (v1 — local)      (v2 — any agent) (v3 — anywhere)
```

---

## Why this is a source of truth across projects

Your developer identity — conventions, stack defaults, patterns — is not per-project. It describes you. Once set up, it travels to every project through the tool.

```
project A          project B          project C
    │                  │                  │
    └──────────────────┴──────────────────┘
                       │
              [tool] reads from
              ~/.config/[tool]/
              identity.md     ← same file, all projects
              rules.md        ← same file, all projects
              stack.md        ← same file, all projects
                       │
              in v2: reads from MCP server
              in v3: reads from cloud — any machine
```

You define your conventions once. Every spec generated for every project uses them. Every agent on every project gets them. As the tool evolves from v1 → v2 → v3, the context becomes more portable without you changing anything.

---

## Industry context

**Is this standard?** MCP is approximately six months old and already adopted by Claude Code, Cursor, Windsurf, Cline, Continue, and Zed. Personal context servers are an emerging category — large engineering teams are already building internal versions for their conventions and standards.

**What makes this different:** The spec templates. Anyone can build MCP infrastructure in a weekend. Fourteen proven templates refined through real projects — buffr, loopd, contrl — are not something you generate from scratch. The infrastructure is the commodity. The templates are what makes it useful.

**The formal pattern:** What this tool implements is [RAG — Retrieval Augmented Generation](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) applied to developer workflow. Instead of stuffing all context into every prompt, the agent retrieves the relevant spec template and project context at the moment it needs them. This is considered best practice for production AI systems.

---

## Environment variables

```bash
ANTHROPIC_API_KEY=sk-ant-...   # required for spec generation
```

---

## Roadmap

```
v1  CLI (active)
    npx [tool] [spec-type] "[intent]"
    works in Claude Code, Codex, any terminal

v2  MCP server (backlog)
    agents call generate_spec() mid-session
    works in Claude Code, Cursor, Windsurf, Cline

v3  Web app — MCP client (backlog)
    browser UI, auto-assembled context from
    GitHub + Notion + local filesystem
    LangChain agent, full spec history
```

---

## Naming

The tool name is TBD. `[tool-name]` is used as a placeholder throughout. Once a name is decided, it replaces all instances in this file and the plan.

---

*Built to work with Claude Code and Codex CLI first. Designed to work with every agent that follows.*
