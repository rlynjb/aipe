# Prompting Specs — Quick Reference

Reusable prompt snippets for AI-assisted development.
Paste directly into Claude.ai or Claude Code.

## Specs

| File | Use when |
|------|----------|
| [plan.md](plan.md) | Starting a multi-phase project with Claude Code |
| [feature.md](feature.md) | Building something new |
| [debugging.md](debugging.md) | A bug keeps coming back |
| [study.md](study.md) | Understanding a codebase as a visual study guide |
| [audit.md](audit.md) | Reviewing existing code before adding features |
| [testing.md](testing.md) | Writing or improving tests |
| [user-stories.md](user-stories.md) | Rewriting tasks in different personas |
| [refactor.md](refactor.md) | Restructuring without changing behaviour |
| [migration.md](migration.md) | Changing a schema, dependency, or storage layer |
| [performance.md](performance.md) | Diagnosing speed or bundle size issues |
| [integration.md](integration.md) | Connecting an external service |

## How to use

1. Open the relevant `.md` file
2. Copy the prompt block
3. Paste into Claude.ai with your project spec or codebase context
4. Save the output to `.aipe/specs/[category]/[name].md`
5. Reference it in Claude Code: `Read .aipe/project/context.md and .aipe/specs/[category]/[name].md then implement.`

## File location

Save this folder as `specs/` in your AIPE repo or link it from `.aipe/global/skills.md`.
