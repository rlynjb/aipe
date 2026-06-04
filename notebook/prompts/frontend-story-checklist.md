# Frontend Story Checklist

**Ticket:** <!-- link -->
**Mock:** <!-- link -->
**Backend contact:** <!-- @name -->

---

## 1. Review story ticket
- [ ] Read acceptance criteria end-to-end
- [ ] Use Rovo to gather related context (linked tickets, prior discussions, specs)
- [ ] List open questions to surface before starting
- [ ] Confirm scope: what's in, what's explicitly out

## 2. Review mock design
- [ ] List every view/screen
- [ ] For each view, list states: empty, loading, error, success, permission-denied, offline
- [ ] List CRUD operations per view (Create / Read / Update / Delete)
- [ ] List interactive elements: filters, sorts, pagination, search, bulk actions, drag-to-reorder, toggles, inline edits
- [ ] Flag missing states the designer may have skipped
- [ ] Note responsive/breakpoint behavior

## 3. Define API contract
- [ ] Map each UI action → endpoint (method + path)
- [ ] Lock primary resource names — confirm singular vs plural (`/users` list, `/users/:id` single)
- [ ] Define request shape per endpoint (body, query params, headers)
- [ ] Define response shape per endpoint (success + error)
- [ ] Pagination strategy: cursor vs offset; page size defaults
- [ ] Filter/sort param conventions
- [ ] Auth & permission requirements per endpoint
- [ ] Standard error shape and status codes (400/401/403/404/409/422/500)
- [ ] Field casing convention locked (camelCase vs snake_case)
- [ ] Nullable vs required fields explicit for every field

## 4. Determine mock functionality
- [ ] How does each interaction work end-to-end?
- [ ] What triggers refetches vs optimistic updates?
- [ ] Required vs optional form fields
- [ ] Validation rules (client-side + server-side)
- [ ] Real-time / polling / websocket requirements
- [ ] Loading skeletons vs spinners — which where?
- [ ] Success/error toast or inline feedback patterns

## 5. Align with backend
- [ ] Share contract draft, confirm feasibility
- [ ] Lock field names, types, nullability
- [ ] Agree on mock/stub strategy so FE isn't blocked
- [ ] Confirm response time / payload size expectations
- [ ] Identify any endpoints that need to be built vs already exist

## 6. Document & de-risk
- [ ] Drop finalized contract in ticket or shared doc
- [ ] List assumptions explicitly so reviewers can challenge
- [ ] List edge cases: empty lists, long text, slow networks, large datasets
- [ ] Note any feature flags or rollout strategy
- [ ] Estimate (now that the unknowns are smaller)

---

## Tips & gotchas

- **Name things once, name them well.** `userId` vs `user_id` vs `id` is the #1 source of avoidable bugs. Decide casing upfront.
- **Pluralization rule:** collection endpoints plural (`GET /todos`); single-resource plural with ID (`GET /todos/:id`). Don't mix.
- **Ask "what changes the URL?"** — that usually tells you route vs local state.
- **Push back on ambiguous mocks.** A missing error state is a question, not an assumption.
- **Think in data, not screens.** Two screens showing the same data shouldn't need two endpoints.
- **Watch for hidden CRUD.** Drag-to-reorder, toggles, and inline edits are all Updates.
- **Optimistic updates need rollback.** If you fake success in the UI, plan the revert path.
- **Empty state ≠ loading state.** Design and code them as distinct things.
- **A 200 with `{error: ...}` is a smell.** Use real status codes.
- **Lock the contract before you build.** Refactoring a component is cheap. Refactoring a shipped API is not.
