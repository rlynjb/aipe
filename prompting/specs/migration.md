# Migration Spec

Use this when moving data, changing a schema, or swapping a dependency. Migrations need a clear before/after state, a rollback plan, and steps that can be done incrementally without breaking production.


## Migration spec format


```
## What is being migrated
[data schema / dependency / service / pattern]

## Before state
[current structure, dependency, or data shape]

## After state
[target structure, dependency, or data shape]

## Why
[reason for the migration]

## Steps
  1. [incremental step — safe to ship alone]
  2. [incremental step]
  3. [incremental step]

## Rollback plan
[how to revert if something breaks in production]

## What must keep working
  - [feature A must behave identically after]
  - [existing data must not be lost or corrupted]

## Constraints
  - Each step must be independently deployable
  - No breaking changes to external interfaces
```


> 💾 Save as → .buffr/specs/migrations/[name].md


## buffr example — chains to ReAct agent


```
## What is being migrated
LangChain chains (LCEL) → ReAct agent loop

## Before state
prompt.pipe(model).pipe(parser) — linear chain,
no tool routing, no multi-step reasoning

## After state
AgentExecutor with tool array, ReAct loop,
conversation memory injected per session

## Steps
  1. Add tool definitions alongside existing chain
  2. Wire AgentExecutor, keep chain as fallback
  3. Route simple queries to chain, complex to agent
  4. Remove chain once agent is stable

## Rollback plan
Revert to chain by toggling USE_AGENT env flag

## What must keep working
  - All existing provider switching (Anthropic/OpenAI/Ollama)
  - Streaming responses
  - .buffr/global/ context injection
```
