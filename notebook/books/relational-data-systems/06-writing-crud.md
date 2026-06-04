## Chapter 6 — Writing: Create, Update, Delete

Writes are simpler than reads — **but they're where the Part II invariants get enforced.**

### 6.1 CREATE — validate → enforce → commit

```
   create(post, { title:"New", authorId:"u-1" })

   ┌─ 1 ─ generate / accept a primary key ──────────────────────┐
   │      → id:"p-9"                                             │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 2 ─ apply schema defaults for missing fields ─────────────┐
   │      → published:false   (had a DEFAULT)                    │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 3 ─ CHECK CONSTRAINTS ◄══ invariants fire HERE ═══════════┐
   │      • required fields present?                             │
   │      • value constraints satisfied? (CHECK, NOT NULL)       │
   │      • authorId "u-1" exists in user store?                 │
   │        └─ referential integrity (Ch 4.2)                    │
   └────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
        all pass:                    any fail:
        post store.set("p-9", rec)   REJECT — write nothing
```

**Walk it through with the todo app.** A user types "buy milk" into the input field and hits enter. The frontend builds `{ text: "buy milk", listId: "l-2" }` and calls `db.todo.create(...)`. Watch what the engine does:

```
   client payload:  { text: "buy milk", listId: "l-2" }

   1.  generate id            →  id = "t-9001"  (UUID or autoincrement)
   2.  apply schema defaults  →  done = false   (from DEFAULT clause)
                                  createdAt = 1715000000  (DEFAULT now())
   3.  validate value rules   →  text non-empty ✓   length <= 500 ✓
                                  done is a boolean ✓
   4.  validate references    →  listId "l-2" exists in list ?  ✓
                                  userId "u-1" exists in user ?  ✓
   5.  commit                 →  todo.set("t-9001", { id, text, done,
                                                       createdAt, userId,
                                                       listId })
```

Every step before the last is **rejectable**. If the client sneakily sent `listId: "l-999"` (nonexistent), the engine refuses *before* the record lands in storage. The UI sees an error, the user retries, the database is still consistent. Contrast with a system that "just writes" and validates later — by then you have a todo in a phantom list, the UI shows a confusing ghost, and you're writing a cron job to clean up.

A small but important detail: the engine assigns `id` and `createdAt` *before* validation runs, so by the time CHECK fires every field is populated and the rule can be applied uniformly. "Generate then validate" is simpler than "validate, then maybe assign defaults, then validate again."

### 6.2 UPDATE — identity NEVER changes

```
   update(post, where id="p-1", { title:"Edited" })

   ┌─ 1 ─ find the target record(s)  ── a READ (Chapter 5) ─────┐
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 2 ─ compute the new field values (merge) ─────────────────┐
   │      { ...existing, title:"Edited" }                        │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 3 ─ CHECK CONSTRAINTS ◄══ invariants fire AGAIN ══════════┐
   │      if a REFERENCE field changed → the new key must       │
   │      resolve to a real record                              │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 4 ─ write the merged record back ─────────────────────────┐
   │      SAME primary key. identity is IMMUTABLE (Ch 1.5).     │
   │      ✗ you may NEVER change a record's id.                 │
   └────────────────────────────────────────────────────────────┘
```

**Updates in the todo app, by frequency.** Most app writes are updates, not creates. Toggling done, editing text, moving a todo to a different list, reassigning to another user — each one is an `update` call. The rules from create still apply, but now they apply *to the merged record*, not just the new fields:

```
   User action                  Update call                          Re-validates
   ─────────────────────────    ──────────────────────────────       ──────────────
   tap checkbox                 update t-1 { done: true }            CHECK on done
   edit text                    update t-1 { text: "new text" }      NOT NULL, length
   move to another list         update t-1 { listId: "l-9" }         FK on listId ★
   reassign to teammate         update t-1 { assignedUserId:"u-7"}   FK on userId  ★
   change my email              update u-1 { email: "a@y.com" }      UNIQUE on email
```

The starred rows are the dangerous ones. Changing a foreign key is functionally "rewire this edge to a different node in the graph" — and the new target had better exist. If you try to move a todo to list `l-9` and `l-9` was deleted yesterday, the engine refuses the update and your edge stays pointing at the old, valid list. The todo never spends a single millisecond pointing at nothing.

The identity rule (point 4 above) is what makes optimistic UI tractable. The frontend can stash a reference like `selectedTodoId = "t-1"`, kick off an update, and *know* that `"t-1"` will still refer to the same todo afterward. If updates could renumber records, every cache, every pointer, every URL would break on every edit.

### 6.3 DELETE — the most dangerous write

```
   delete(user, where id="u-1")

   ┌─ 1 ─ find the target record ───────────────────────────────┐
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 2 ─ find INCOMING edges ── who references u-1? ───────────┐
   │      scan post.authorId, comment.authorId, ...             │
   │      → found: p-1, p-3                                      │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 3 ─ APPLY THE DELETE POLICY ◄══ invariant enforcement ════┐
   │      (Chapter 4.4)                                          │
   │        RESTRICT → abort if any incoming edge exists        │
   │        CASCADE  → recursively delete the referrers         │
   │        SET NULL → null out the referencing keys            │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ 4 ─ remove the record ────────────────────────────────────┐
   │      user store . delete("u-1")                            │
   └────────────────────────────────────────────────────────────┘

   ⚠ a naive delete that SKIPS steps 2-3 is EXACTLY how you get
     the dangling edges from Chapter 4.2.
```

**Delete is where your schema's policy choices pay off.** All the RESTRICT / CASCADE / SET NULL decisions from Chapter 4.4 actually *run* here. Walk through what happens when a user clicks "delete account" on their todo-app profile, given the policy table we drew earlier:

```
   delete user "u-1"

   incoming edges discovered:
   ───────────────────────────────────────────────────────
   list rows where userId = "u-1"        → policy: CASCADE
       l-1 "Today",  l-2 "Shopping"
   todo rows where assignedUserId = "u-1" → policy: SET NULL
       t-3, t-7
   subscription rows where userId = "u-1" → policy: RESTRICT
       s-1  (active)
   ───────────────────────────────────────────────────────

   step 3 evaluates each policy:
       subscription RESTRICT  →  active subscription found
                                 ✗ ABORT the whole delete.
                                 user stays. all the other edges
                                 untouched. transaction rolls back.
```

The RESTRICT policy is a circuit-breaker: as soon as *any* incoming edge with a RESTRICT policy is found, the entire delete fails atomically. The other policies don't even get a chance to run. This is by design — the engine refuses to leave the dataset in a partial state where some edges have been cascaded but others haven't.

Reverse the situation: the user cancels their subscription first, then retries the delete. Now there's no RESTRICT-protected edge, so:

```
   CASCADE branch fires:
       delete list l-1   →  CASCADE  → its todos (todo.listId = "l-1")
                                       are also deleted  (recursion)
       delete list l-2   →  CASCADE  → same recursion

   SET NULL branch fires:
       todo t-3 . assignedUserId  =  null
       todo t-7 . assignedUserId  =  null

   finally:
       user . delete("u-1")
```

One user delete just removed the user, two lists, and every todo in those lists, while *also* leaving every todo merely *assigned* to that user alive but unassigned. The engine did all of that in a single transaction — if any step had failed, every change would have been rolled back.

This is the entire reason a real database is worth the complexity: one declarative policy per FK, and delete is *correct* by construction. The alternative — manually orchestrating cascading deletes in application code — is where almost every "ghost row" bug in legacy apps comes from.

### 6.4 The universal write pipeline

```
   ┌──────────┐      ┌──────────────┐      ┌──────────┐
   │ VALIDATE │      │   ENFORCE    │      │  COMMIT  │
   │          │ ───► │              │ ───► │          │
   │ shape &  │      │ integrity    │      │ mutate   │
   │ value    │      │ constraints  │      │ the      │
   │ checks   │      │ (refs,       │      │ collec-  │
   │          │      │  policies)   │      │ tion     │
   └──────────┘      └──────────────┘      └──────────┘
        │                   │                   │
        └── reject ◄─────────┴── reject          └── the ONLY step
            on fail              on fail             that touches data

   reads  TRAVERSE the graph.
   writes GUARD the graph — the only place invariants can break,
                            so the only place they're checked.
```

**The frontend parallel you've already lived.** Think of how a typed form handler works in your React app: you validate inputs, you check business rules, *then* you call `setState`. The pattern is exactly the same — validate, enforce, commit — just applied at a different layer.

```
   React form handler                Relational write
   ─────────────────────────         ─────────────────────────
   parse fields from event           accept the payload
   run Zod schema                    run schema validation
   check business rule               check constraints + FKs
   if ok → setState                  if ok → write to store
   else  → show error                else  → return error
```

The relational engine is just a centralised, declarative version of the pattern. Instead of every form handler re-implementing "make sure userId points to a real user," the engine does it once, applies it to *every* write — your forms, your background jobs, your import scripts, your tests — and rejects any write that breaks the rules. The data layer becomes the single source of truth for the data's *rules*, not just the data's bytes.

---


---

**Prev:** [05 — Reading: query as traversal](05-reading-query-as-traversal.md) · **Next:** [07 — Defining collections](07-defining-collections.md)
