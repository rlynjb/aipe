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


---

**Prev:** [09 — find & the join](09-find-and-the-join.md) · **Next:** [11 — the msw bridge](11-the-msw-bridge.md)
