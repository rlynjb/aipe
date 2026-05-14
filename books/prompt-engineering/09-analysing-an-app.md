# 09 — Analysing an application

## Questions to ask before writing any prompt

Before you can write a detailed prompt, you need a clear picture of the application you're working in. **Without this, the AI fills gaps with assumptions** — inventing data shapes, putting files in the wrong place, and missing constraints that already exist in the codebase. These are the questions to answer first, grouped by when you need them.

> **Why it matters**
>
> A prompt is only as good as the context behind it. The questions below are exactly what the AI would need to ask you if it could — answering them upfront eliminates the most common source of wrong output: missing context.

---

## Before designing anything

### Data model

What are the core entities? What shape is each one? What are the relationships between them? What fields are required vs optional?

> **How to ask:** "List every entity in the app, its fields and types, and how it relates to other entities. Include any Notion page/block schemas if applicable."

### Backend architecture

Where does data live? What handles API logic — serverless functions, edge functions, a dedicated server? What does each endpoint do and what does it return?

> **How to ask:** "Describe the backend: where data is stored, how API routes are structured, what each route reads or writes, and what external services are called."

### Frontend architecture

What framework and routing pattern? Server components vs client components? How are pages and layouts composed? What rendering strategy — SSR, SSG, CSR?

> **How to ask:** "Describe the frontend: framework, router, rendering strategy, how pages are structured, and the distinction between server and client components."

### State management

Where does UI state live — local component, global store, server state, URL params? How does shared state get passed between components? What triggers a re-render or refetch?

> **How to ask:** "Where does state live in this app? What's local, what's global, what's server-synced? How is shared state passed between components?"

### Data flow

How does data move from the database to the screen? REST, tRPC, server components, realtime subscription? Where is data fetched, cached, and invalidated?

> **How to ask:** "Trace data from database to UI. How is it fetched, where is it cached, what triggers a refresh, and what format does it arrive in at the component level?"

### Auth & permissions

Who can do what? Are there roles or tiers? What's gated behind login? What happens when an unauthenticated user hits a protected route or action?

> **How to ask:** "Describe the auth model: who are the user types, what can each do, what is gated, and what happens when permissions are missing?"

### External dependencies

What third-party APIs, SDKs, or services does the app rely on? What do they handle — payments, storage, AI, analytics, notifications? What are their constraints?

> **How to ask:** "List every external service the app calls, what it handles, and any constraints (rate limits, data shape, auth requirements)."

### File & folder structure

How is the codebase organised — feature-first or layer-first? Where do components, hooks, utils, types, and API routes live? What naming conventions exist?

> **How to ask:** "Describe the folder structure: how is code organised, where do different file types live, and what naming conventions should new files follow?"

---

## Before writing any feature prompt

### User stories

Who is the user, what do they want to do, and why? What does success look like from their perspective — not the system's? Stories should be written as: "As a [user], I want to [action] so that [outcome]."

> **How to ask:** "Write user stories for this feature. For each: who is doing it, what they're trying to accomplish, and what a successful outcome looks like."

### Error & loading states

What is the app's contract for failure? What shows during slow loads — skeleton, spinner, placeholder? What shows on error — inline message, toast, full-page fallback? What can be retried?

> **How to ask:** "For this feature, describe every loading and error state: what the UI shows, whether the user can retry, and whether partial data should be preserved."

### Constraints & non-negotiables

What cannot change? Performance budgets, accessibility requirements, browser targets, existing patterns that must be followed, APIs that are fixed. The AI must know these before it suggests anything.

> **How to ask:** "What are the hard constraints for this feature? What existing patterns must be followed? What must not change under any circumstances?"

---

## Before handing to Claude Code

### Existing patterns to follow

Point to specific files or components that represent the pattern the new code should match. **This is more reliable than describing the pattern in words.**

> e.g. "Follow the pattern in `components/EntryCard.tsx` for component structure and `app/api/entries/route.ts` for API route shape."

### Where new code should live

Tell the AI exactly where to put new files. Without this it places things in plausible but wrong locations, and refactoring later costs more time than specifying upfront.

> e.g. "New component goes in `components/journal/`. New API route goes in `app/api/journal/`. Types go in `types/journal.ts`."

### What must NOT change

Explicitly list files, functions, schemas, or behaviours the AI must leave untouched. **AI optimises aggressively** — without this guardrail it will refactor things you didn't ask it to touch.

> e.g. "Do not modify the Notion schema, the auth middleware, or any existing API routes. Only add new files — do not edit existing ones unless specified."

> ⚠ The three most skipped questions that cause the most bugs: **state management**, **error & loading states**, and **file structure**. The AI invents answers for all three if you don't provide them.

---

## Full question checklist

Use this ordered list as a pre-prompt audit before starting any new feature or session.

```
Before designing anything
  → Data model         entities, fields, relationships
  → Backend arch        storage, API shape, endpoints
  → Frontend arch       framework, routing, render strategy
  → State management    local vs global vs server vs URL
  → Data flow           fetch → cache → invalidate path
  → Auth & permissions  roles, gates, failure behaviour
  → External deps       APIs, SDKs, constraints
  → File structure      org pattern, naming conventions

Before writing any feature prompt
  → User stories        who / what / why
  → Error & loading     app's contract for failure
  → Constraints         what cannot change

Before handing to Claude Code
  → Patterns to follow  point to specific files
  → Where code goes     exact folder/file targets
  → What not to touch   explicit do-not-modify list
```

This list is the substrate for the `/aipe:audit` command — it makes the questions the AI runs through automatically before generating any spec.
