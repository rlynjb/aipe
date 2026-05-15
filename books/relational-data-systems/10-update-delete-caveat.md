## Chapter 10 — `update`, `delete`, and the honest caveat

```js
// UPDATE — Chapter 6.2. identity (id) never changes; value fields do.
db.user.update({
  where: { id: { equals: 'u-uuid' } },
  data:  { age: 37 },
})

// DELETE — Chapter 6.3.
db.user.delete({ where: { id: { equals: 'u-uuid' } } })
```

```
   ┌─────────────────────────────────────────────────────────────┐
   │  ⚠  THE HONEST CAVEAT — integrity strictness                 │
   │                                                              │
   │  @mswjs/data gives you the relational MACHINERY — schemas,   │
   │  references, automatic resolution — but it is a MOCK layer,  │
   │  not a production RDBMS. it does NOT enforce the full set    │
   │  of integrity invariants for you:                            │
   │                                                              │
   │   ✗ it does NOT stop you deleting a user that posts still   │
   │     reference. no automatic RESTRICT/CASCADE/SET NULL        │
   │     policy engine (Ch 4.4).                                  │
   │                                                              │
   │   ✗ after such a delete, those posts hold a key that no     │
   │     longer resolves — a DANGLING EDGE (Ch 4.2). reading      │
   │     post.author may then come back null or error.           │
   │                                                              │
   │  WHAT THIS MEANS FOR YOU:                                    │
   │  the THEORY in Part II is universal — but with a mock layer  │
   │  YOU are partly responsible for the invariants the engine    │
   │  doesn't enforce. when you delete a referenced record in     │
   │  your tests, you delete or re-point its referrers yourself.  │
   │  you are HAND-RUNNING the delete policy from Ch 4.4.         │
   │                                                              │
   │  this is GOOD for you — it forces you to actually understand │
   │  the invariant instead of letting the database hide it.      │
   └─────────────────────────────────────────────────────────────┘
```

**The caveat in practice — hand-rolling CASCADE on the todo schema.** Say a test needs to delete Ada and clean up after her properly. In Postgres you'd declare `ON DELETE CASCADE` on the FKs and `DELETE FROM user WHERE id = ?` would do all the work. In `@mswjs/data` you write the cascade yourself:

```js
function deleteUser(userId) {
  // 1. CASCADE — delete dependent rows the user owns outright.
  const lists = db.list.findMany({ where: { owner: { id: { equals: userId } } } })
  for (const l of lists) {
    db.todo.deleteMany({ where: { list: { id: { equals: l.id } } } })
    db.list.delete({ where: { id: { equals: l.id } } })
  }

  // 2. SET NULL — todos merely *assigned* to her survive, but unassigned.
  db.todo.updateMany({
    where: { owner: { id: { equals: userId } } },
    data:  { owner: null },
  })

  // 3. Finally, delete the user.
  db.user.delete({ where: { id: { equals: userId } } })
}
```

What you've just written is the manual version of the Chapter 4.4 policy table. Each block is one policy enforced by you instead of the engine: the for-loop is CASCADE, the `updateMany(...null)` is SET NULL, the final delete is the last step of the universal write pipeline from Chapter 6. If you skip any block, you create the dangling edges from Chapter 4.2 — `todo.list` pointing at a list-id the engine no longer knows about, with `findFirst` returning a todo whose `.list` is undefined.

Skip this in a real test and the failure mode is gnarly: a *seemingly unrelated* test, run later in the same suite, fetches a todo, calls `todo.list.name`, and throws `Cannot read properties of null`. The bug is in the test setup three files away.

**An update twist worth knowing.** Updates have a quieter version of the same problem. Look at:

```js
db.todo.update({
  where: { id: { equals: 't-uuid-1' } },
  data:  { list: { id: 'l-does-not-exist' } },   // ← oops
})
```

A Postgres FK constraint would reject this immediately. `@mswjs/data` accepts it — and now the todo claims to live in a nonexistent list. Same root cause as the delete case: the engine trusts you to keep edges valid. The defense is to treat your reference fields as *opaque identifiers you've already verified* — always pass actual records or ids you just read from the same store, not strings from the URL or user input without a lookup first.

The caveat is also why `@mswjs/data` is a *mock layer*, not a database. It demonstrates the relational machinery beautifully; it does not protect you from yourself. Once you've internalised the invariants from Part II, you can run the policies in your head — and that's the actual learning goal.

---

**Prev:** [09 — find & the join](09-find-and-the-join.md) · **Next:** [11 — the msw bridge](11-the-msw-bridge.md)
