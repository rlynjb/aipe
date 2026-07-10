# Dependency Tracker

living doc for tracking dependency branches + jira tickets owned by other devs.
goal: know (a) what backend api contracts are ready to consume, and (b) what
frontend deps are already built — so you know what you can start building next.

---

## how to use (claude code)

**invocation** — paste a branch + ticket to review:

```
review dependency:
  branch = feat/orders-api
  ticket = https://<jira>/browse/SWITCH-1235
```

**what claude does each run:**

1. `git fetch origin <branch>` — get latest.
2. `git log origin/<branch> --oneline -20` — recent commits.
3. `git diff origin/main...origin/<branch> --stat` — what changed vs main.
4. inspect the changed files for the **consumable surface**:
   - backend → route handlers, controllers, `types/`, openapi/schema, dtos.
     extract: method + path + request shape + response shape.
   - frontend → exported components/hooks/utils, their import path + props.
5. read the ticket. (if jira isn't reachable, ask me to paste the summary +
   acceptance criteria, or use the jira mcp if connected.)
6. **create or update** that ticket's section below:
   - refresh `reviewed:` with today's date + a one-line note (always, even if
     nothing changed — the timestamp is the point).
   - if their last commit is newer than my last `reviewed:`, flip `aligned:` to
     `?` until i re-confirm the contract.
7. update **overall** at the bottom: cross-check, statuses, gaps.

**rule:** never delete a `pending` item silently — move it to `done` with a
checkmark so there's a trail.

---

## legend

- status (their lifecycle): `todo` · `in-progress` · `in-review` · `merged`
- aligned: `✓` matches what i need · `?` changed since last check, re-verify · `✗` drifted, go talk to them
- availability: `ready` consumable now · `wip` exists but unstable/incomplete · `none` not built yet

---

## Branch & Ticket #1 — SWITCH-1235

- **ticket:** https://<jira>/browse/SWITCH-1235
- **branch:** `feat/orders-api`
- **owner:** @dev-a
- **reviewed:** jul 10 — <note>
- **status:** in-review
- **aligned:** ✓

**what it is**
> <1–2 line description of the ticket in plain terms>

**consumable surface**

_backend api:_
| method | path | request | response | avail |
|--------|------|---------|----------|-------|
| GET | `/orders` | `?status=` | `Order[]` | ready |
| GET | `/orders/:id` | — | `Order` | wip |

_frontend exports:_
| export | from | notes | avail |
|--------|------|-------|-------|
| — | — | — | — |

**todo**
- [x] confirmed `GET /orders` response shape matches my model
- [ ] `GET /orders/:id` — still returning `null` for `items`, blocked
- [ ] confirm error shape (`{ code, message }`?)

**gaps / risks / drift**
> <soft signals — comments, hallway "we might change X", stale assumptions>

---

## Branch & Ticket #2 — SWITCH-1240

- **ticket:** https://<jira>/browse/SWITCH-1240
- **branch:** `feat/auth-mw`
- **owner:** @dev-b
- **reviewed:** jul 7 — STALE, 3 commits since
- **status:** in-progress
- **aligned:** ?

**what it is**
> <description>

**consumable surface**

_backend api:_
| method | path | request | response | avail |
|--------|------|---------|----------|-------|
| — | — | — | — | — |

_frontend exports:_
| export | from | notes | avail |
|--------|------|-------|-------|
| `useAuth()` | `@/hooks/useAuth` | returns `{ token, user }` | wip |

**todo**
- [x] reviewed initial hook shape
- [ ] re-verify — they mentioned moving token from header → cookie
- [ ] confirm final `useAuth` return type before i wire my components

**gaps / risks / drift**
> possible header→cookie change in standup. affects everything downstream.

---
<!-- copy a block above for each new dependency -->
---

# OVERALL

_the combined view across all branches above._

## combined todo → source

every actionable item, tagged with where it comes from and whether i'm blocked.

| # | item | source | status | blocked? |
|---|------|--------|--------|----------|
| 1 | wire orders list to `GET /orders` | → SWITCH-1235 | ready to start | no |
| 2 | build order detail view | → SWITCH-1235 | waiting | yes — `:id` wip |
| 3 | gate routes behind `useAuth` | → SWITCH-1240 | waiting | yes — hook wip + may change |
| 4 | error toast component | → mine | ready to start | no |

## cross-check (what i need ↔ what exists)

the money table. maps my needs to what's actually available upstream.

| what i need | provided by | avail | matches? |
|-------------|-------------|-------|----------|
| order list endpoint | SWITCH-1235 `GET /orders` | ready | ✓ |
| single order w/ items | SWITCH-1235 `GET /orders/:id` | wip | ✗ items null |
| auth token access | SWITCH-1240 `useAuth()` | wip | ? shape unstable |
| standard error shape | — | none | ✗ nobody owns it |

## what i can build NOW (unblocked)

- orders list view — `GET /orders` is `ready` + `✓`
- error toast component — no upstream dep

## gaps

- **missing (i need it, nobody's building it):**
  - standard error shape — no ticket owns it. flag it.
- **drift (was aligned, changed):**
  - SWITCH-1240 auth — header→cookie rumor, `aligned: ?`
- **unknown (not yet verified):**
  - SWITCH-1235 error shape — haven't checked

---

_last full sweep: jul 10_
