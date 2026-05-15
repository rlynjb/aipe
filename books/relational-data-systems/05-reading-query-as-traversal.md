# PART III — THE OPERATIONS

You have primitives (Part I) and invariants (Part II). Now: what do you DO with the data? **CRUD** — create, read, update, delete. The key insight: **reads are graph traversals.** That's the lens for the whole part.

---

## Chapter 5 — Reading: Query as Traversal

### 5.1 The atom — lookup by primary key

```
   findById(user, "u-1")
         │
         ▼
   ┌─────────────────────────────┐
   │ user store . get("u-1")     │
   └─────────────────────────────┘
         │
         ▼
   { id:"u-1", name:"Ada", age:36 }

   ONE dictionary hit. O(1).
   "I know the node's label — give me the node."
   EVERY more complex read decomposes into a bunch of these.
```

### 5.2 Filtering — iterate & keep what matches a predicate

```
   findMany(user, where age >= 30)

   user store values:                        for each, run the PREDICATE
   ┌─────────────────────┐
   │ {u-1, "Ada", 36}  ──┼──►  age >= 30 ?  ──►  36 >= 30   ✓  KEEP
   │ {u-2, "Lin", 28}  ──┼──►  age >= 30 ?  ──►  28 >= 30   ✗  drop
   │ {u-3, "Sam", 41}  ──┼──►  age >= 30 ?  ──►  41 >= 30   ✓  KEEP
   └─────────────────────┘
                                                    │
                                                    ▼
                                            [ {Ada}, {Sam} ]

   O(n) over the collection.
   a PREDICATE is just a function:  Record ──► boolean
   "WHERE clauses", "filters", "query operators" are all just
   ways of BUILDING that function.

   operators you'll meet (all compile to a predicate):
     equals   notEquals   gt  gte  lt  lte
     contains   startsWith   (strings)
     in   (membership)
```

> **Frontend bridge:** `findMany` with a predicate **is `array.filter()`**. You already know this operation cold. The only new thing is it runs over a `Map`'s values instead of an array.

### 5.3 THE JOIN — resolving a reference (the key operation)

A join is: **read a foreign key → ONE lookup in another collection → splice the result in.** Watch it frame by frame:

```
   getPostWithAuthor("p-1")

   ┌─ STEP 1 ─ fetch the post ──────────────────────────────────┐
   │   post store . get("p-1")                                   │
   │   → { id:"p-1", title:"Hello", authorId:"u-1" }            │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ STEP 2 ─ notice authorId is a REFERENCE field ────────────┐
   │   (the SCHEMA told us so — it's typed as → user)           │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ STEP 3 ─ follow the edge — resolve the key ───────────────┐
   │   take "u-1"  ──►  user store . get("u-1")    ◄── O(1)     │
   │              ──►  { id:"u-1", name:"Ada" }                 │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ STEP 4 ─ assemble the joined result ──────────────────────┐
   │   { id:"p-1", title:"Hello",                               │
   │     author: { id:"u-1", name:"Ada" } }                     │
   │              ▲                                              │
   │              └─ the STRING "u-1" has been REPLACED by      │
   │                 the actual record it pointed at            │
   └────────────────────────────────────────────────────────────┘

   drawn as the edge-walk it is:

      post p-1                       user u-1
      ┌───────────────┐   resolve    ┌──────────────┐
      │ authorId:"u-1" │ ───────────► │ id:"u-1"     │
      └───────────────┘  (walk the   │ name:"Ada"   │
                          edge)      └──────────────┘
                                            │
                              spliced into the result
                                            ▼
                  { title:"Hello", author:{ name:"Ada" } }

   this is EXACTLY "visit node, follow edge to neighbor" from
   graph traversal. forward join = one edge = O(1).
```

### 5.4 The reverse join — scanning for incoming edges

```
   getPostsByUser("u-1")

   the user record stores NOTHING about posts.
   so: SCAN the post store, keep posts pointing back at u-1.

   post store:
   ┌──────────────────────────────────┐
   │ p-1   authorId:"u-1"   ──────  ✓ │
   │ p-2   authorId:"u-2"   ──────  ✗ │
   │ p-3   authorId:"u-1"   ──────  ✓ │
   └──────────────────────────────────┘
                  │
                  ▼
            [ p-1, p-3 ]

   O(n) over posts.
   "find all edges that END AT u-1."

   ┌──────────────────────────────────────────────────────────┐
   │  a real DB keeps an INDEX:  Map<authorId, postId[]>      │
   │                                                           │
   │     "u-1" → [p-1, p-3]                                    │
   │     "u-2" → [p-2]                                         │
   │                                                           │
   │  → turns the O(n) scan back into an O(1) lookup.         │
   │  (see Appendix A.)                                        │
   └──────────────────────────────────────────────────────────┘
```

### 5.5 Multi-hop traversal — joins compose into deep walks

```
   "give me post p-1, its author, and that author's team"

      p-1 ──authorId──► u-1 ──teamId──► t-2
       │                │               │
     post             user            team
   {title:"Hello"}  {name:"Ada"}    {name:"Core"}

   walk it:
   ┌──────────┐   follow    ┌──────────┐   follow    ┌──────────┐
   │  post    │   authorId  │  user    │   teamId    │  team    │
   │  p-1     │ ──────────► │  u-1     │ ──────────► │  t-2     │
   │          │   O(1)      │          │   O(1)      │          │
   └──────────┘             └──────────┘             └──────────┘

   result — a nested object assembled by walking 2 edges:
   {
     title: "Hello",
     author: {
       name: "Ada",
       team: { name: "Core" }
     }
   }

   3 collections. 2 edges followed. each O(1).
   THIS IS DEPTH-FIRST TRAVERSAL of the data graph.
   a "query" just describes WHICH edges to walk.
```

### 5.6 The universal read pipeline

```
   EVERY read — no matter how complex — is this 4-stage pipeline:

   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  START   │    │  FILTER  │    │ RESOLVE  │    │  SHAPE   │
   │          │───►│          │───►│          │───►│          │
   │ pick a   │    │ keep     │    │ follow   │    │ select   │
   │ collec-  │    │ records  │    │ reference│    │ which    │
   │ tion     │    │ matching │    │ edges to │    │ fields   │
   │          │    │ predicate│    │ other    │    │ to       │
   │          │    │          │    │ records  │    │ return   │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘
       ▲                ▲               ▲               ▲
       │                │               │               │
     "FROM"          "WHERE"          "JOIN"          "SELECT"
    (Ch 5.1)         (Ch 5.2)        (Ch 5.3-5.5)    (pick fields)

   see those 4 stages and you can read ANY query in ANY system —
   SQL, @mswjs/data, Memgraph's MATCH, a GraphQL resolver.
```

---


---

**Prev:** [04 — Integrity constraints](04-integrity-constraints.md) · **Next:** [06 — Writing: CRUD](06-writing-crud.md)
