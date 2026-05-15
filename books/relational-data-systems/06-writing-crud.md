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

---


---

**Prev:** [05 — Reading: query as traversal](05-reading-query-as-traversal.md) · **Next:** [07 — Defining collections](07-defining-collections.md)
