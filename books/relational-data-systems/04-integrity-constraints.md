# PART II — THE INVARIANTS

In DSA, **invariants** are the properties that must hold or the structure isn't what it claims to be: a tree must be connected & acyclic; a DAG must have no cycle. Relational data has invariants too — they're called **integrity constraints**, and they keep every edge in the graph pointing at a node that *actually exists*.

```
   DSA INVARIANT                    RELATIONAL INVARIANT
   ─────────────────                ────────────────────
   "a tree has no cycle"     ───►   "no record references itself
                                     into an impossible loop"
   "a DAG has a topo order" ───►    "delete order must respect refs"
   "every edge endpoint      ───►   "every foreign key points at a
    exists in the graph"             record that EXISTS"   ← THE big one
```

---

## Chapter 4 — Integrity Constraints

### 4.1 Entity integrity — every record has a valid identity

```
   THE RULE: every record has a primary key — unique, non-null.
             (you saw in Ch.2.3 this is FREE from the dictionary structure.)

   ┌──────────────────────────────────┬─────────────────────────────┐
   │  { id:"u-1", name:"Ada" }        │  ✓ VALID — has unique id    │
   ├──────────────────────────────────┼─────────────────────────────┤
   │  { name:"Ada" }                  │  ✗ INVALID — no identity,   │
   │                                  │    can't even be stored     │
   │                                  │    (no key to store it at)  │
   ├──────────────────────────────────┼─────────────────────────────┤
   │  set("u-1", A); set("u-1", B)    │  uniqueness preserved —     │
   │                                  │  B overwrote A structurally │
   └──────────────────────────────────┴─────────────────────────────┘
```

### 4.2 Referential integrity — every edge points at a REAL node

This is the big one. The invariant that makes the dataset a *valid* graph instead of a graph with broken edges.

```
   THE RULE: every reference must point at a record that EXISTS
             (or be explicitly null).

   ┌──────────────────────────────────────────────────────────────┐
   │  VALID EDGE                                                   │
   │                                                               │
   │    post.authorId = "u-1"    user store HAS "u-1"             │
   │    ┌──────────────┐         ┌──────────────┐                 │
   │    │ authorId:"u-1"│───────►│ "u-1"→{Ada}  │   ✓ resolves    │
   │    └──────────────┘         └──────────────┘                 │
   │                                                               │
   ├──────────────────────────────────────────────────────────────┤
   │  DANGLING EDGE  (the invariant is BROKEN)                     │
   │                                                               │
   │    post.authorId = "u-99"   user store has NO "u-99"         │
   │    ┌──────────────┐         ┌──────────────┐                 │
   │    │authorId:"u-99"│───────►│      ???     │   ✗ points at   │
   │    └──────────────┘         └──────────────┘     nothing     │
   │                                                               │
   │    the post claims an author that does not exist.            │
   │    this is the relational equivalent of a pointer into       │
   │    freed memory, or a graph edge whose endpoint was deleted. │
   └──────────────────────────────────────────────────────────────┘
```

### 4.3 The TWO dangerous moments — where the invariant can break

The invariant can only break at two moments. Knowing them tells you exactly where enforcement logic must live.

```
   ┌─────────────────────────────────────────────────────────────┐
   │  DANGER MOMENT 1 — you INSERT / UPDATE a reference           │
   │                                                              │
   │     you set  post.authorId = "u-99"                          │
   │                                                              │
   │     ┌─────────────────────────────────────────────────┐     │
   │     │ ENFORCEMENT: before accepting the write, check  │     │
   │     │ that "u-99" exists in the user store.           │     │
   │     │ doesn't exist? → REJECT the write.              │     │
   │     └─────────────────────────────────────────────────┘     │
   ├─────────────────────────────────────────────────────────────┤
   │  DANGER MOMENT 2 — you DELETE a record others point at       │
   │                                                              │
   │     you delete user "u-1"                                    │
   │     but posts p-1, p-3 still have authorId="u-1"             │
   │                                                              │
   │     before:  p-1 ──► u-1        after:  p-1 ──► ???          │
   │              p-3 ──► u-1                p-3 ──► ???          │
   │                                          ▲                   │
   │                                          └─ dangling!        │
   │     ┌─────────────────────────────────────────────────┐     │
   │     │ ENFORCEMENT: a DELETE POLICY must run (Ch 4.4)   │     │
   │     └─────────────────────────────────────────────────┘     │
   └─────────────────────────────────────────────────────────────┘
```

### 4.4 Delete policies — the fate of the edges when a node dies

When you delete a record other records point at, **something** must happen to those incoming edges. Three classic policies. You pick one **per relationship**.

```
   SETUP:   delete user "u-1"  ◄── posts p-1, p-3 point at it
                                   p-2 points at u-2 (unaffected)

   ════════════════════════════════════════════════════════════════
   POLICY A — RESTRICT   ("deny")
   ────────────────────────────────────────────────────────────────
        ┌──────────────────────────────────────────────┐
        │  refuse to delete u-1 while ANYTHING still   │
        │  references it.                              │
        │  "delete or reassign the posts FIRST."       │
        └──────────────────────────────────────────────┘
        delete("u-1")  ──►  ✗ ERROR: 2 records still reference u-1
        → SAFEST. the graph is never even briefly broken.

   ════════════════════════════════════════════════════════════════
   POLICY B — CASCADE
   ────────────────────────────────────────────────────────────────
        ┌──────────────────────────────────────────────┐
        │  deleting u-1 ALSO deletes p-1 and p-3       │
        │  (and recursively, anything pointing at THOSE)│
        │  "the author is gone, so are their posts."   │
        └──────────────────────────────────────────────┘
        delete("u-1")
            │
            ├──► delete p-1
            │       └──► delete c-1 (comment on p-1)  ◄ recursion
            └──► delete p-3
        → POWERFUL + DANGEROUS. one delete can wipe a subgraph.

   ════════════════════════════════════════════════════════════════
   POLICY C — SET NULL   ("nullify")
   ────────────────────────────────────────────────────────────────
        ┌──────────────────────────────────────────────┐
        │  keep p-1 and p-3, but set their authorId    │
        │  to null. "posts survive as orphans."        │
        │  (requires the reference field to be nullable)│
        └──────────────────────────────────────────────┘
        delete("u-1")  ──►  p-1.authorId = null
                            p-3.authorId = null
```

```
   SAME STARTING STATE, THREE OUTCOMES — drawn as a table:

                BEFORE delete u-1     CASCADE          SET NULL
                ─────────────────     ───────          ────────
   user store   u-1, u-2              u-2              u-2
   post store   p-1 → u-1             (p-1 GONE)       p-1 → null
                p-2 → u-2             p-2 → u-2        p-2 → u-2
                p-3 → u-1             (p-3 GONE)       p-3 → null

   (RESTRICT outcome: nothing changes — the delete is refused.)

   DSA parallel:
     CASCADE   = "delete the whole reachable subtree"
     SET NULL  = "snip the edges, keep the orphaned nodes"
     RESTRICT  = "refuse to delete a node that still has neighbors"
```

### 4.5 Value constraints (the smaller invariants)

```
   the two integrity rules above are STRUCTURAL. these keep VALUES sane:

   ┌────────────┬──────────────────────────────────────────────────┐
   │ NOT NULL   │ field must always have a value                   │
   │            │   user.name = ""        ✗ rejected               │
   ├────────────┼──────────────────────────────────────────────────┤
   │ UNIQUE     │ a non-PK field must still be unique              │
   │            │   two users, same email   ✗ rejected             │
   │            │   (this is ALSO how you make a one-to-one!)      │
   ├────────────┼──────────────────────────────────────────────────┤
   │ CHECK      │ value must satisfy a predicate                   │
   │            │   age >= 0       status in {draft, published}    │
   ├────────────┼──────────────────────────────────────────────────┤
   │ DEFAULT    │ no value supplied on insert → use this           │
   │            │   active defaults to true                        │
   └────────────┴──────────────────────────────────────────────────┘

   all of these are just:   if (!predicate(value)) reject()
   guarding the insert/update path. no new machinery.
```

---


---

**Prev:** [03 — References](03-references.md) · **Next:** [05 — Reading: query as traversal](05-reading-query-as-traversal.md)
