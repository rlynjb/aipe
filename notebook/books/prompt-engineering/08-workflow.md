# 08 — Workflow

## Claude.ai → Claude Code

The two tools serve different phases of the same process. **Claude.ai is for thinking** — designing, deciding, writing the spec. **Claude Code is for building** — implementing the spec with full codebase context. The cheatsheet so far describes what goes into each phase. A persistent `.dev/` or `.aipe/` folder bridges the two by saving context between sessions so you never have to re-explain your project.

> **Why it matters**
>
> Skipping the design phase and going straight to Claude Code means writing a spec in code rather than plain language — which is slower, harder to revise, and produces more throwaway work.

## The flow

```
Claude.ai                              Claude Code
─────────────────────────────────  →  ─────────────────────────────
System design + interaction flow      Implementation with tight spec
+ spec                                + all three paths
```

The two phases use the same conceptual building blocks (chapters 03–07) but optimize for different outputs:

- **Claude.ai output:** a markdown spec saved to `.dev/<feature>.md` or `.aipe/specs/<type>/<slug>.md`.
- **Claude Code output:** the implementation that matches that spec.

## Do / don't

**✗ Don't**

```
[Claude Code]
Add a tap-to-edit feature to
the journal entry component
```

Jumping straight to implementation without a spec. Multiple correction cycles ahead.

**✓ Do**

```
[Claude.ai]
Design tap-to-edit for journal
entries → produce spec

[Claude Code]
Implement from .dev/journal.md
Data model + flow defined there
```

## The principle

> The better your spec coming out of Claude.ai, the fewer correction cycles in Claude Code. **Time spent designing is always faster than time spent debugging.**

The .dev/ or .aipe/ folder is the memory bank between sessions. Each session starts by loading it. Each session ends by updating it. The persistent context is what makes multi-session work tractable — without it, every session is starting from scratch.
