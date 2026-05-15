## Chapter 3 — References (THE NEW IDEA)

Everything before this was "collections you already understood." **This** chapter is what makes data *relational*.

### 3.1 Frontend bridge: you make this exact decision every day

```
   when you design a React component, you choose:

   OPTION A — pass the whole object down       OPTION B — pass an id, look it up
   ─────────────────────────────────────       ────────────────────────────────
   <Post author={fullAuthorObject} />          <Post authorId="u-1" />
                                                       │
   the author is NESTED inside the post's              the post holds only a
   data. a COPY travels with it.                       STRING. the real author
                                                       lives in one shared store.

        ▲                                              ▲
        │ this is CONTAINMENT                          │ this is a REFERENCE
        │ (how your Tree class worked —                │ (how relational data
        │  parent literally holds children)            │  works — always)
```

Relational data **always picks B**. A record points at another record by **storing that record's primary key as a plain value**.

### 3.2 Containment vs. Reference — drawn side by side

```
   CONTAINMENT (your Tree class)              REFERENCE (relational)
   ════════════════════════════              ═══════════════════════

   parentNode                                 post record
   ┌────────────────────────┐                 ┌──────────────────────────┐
   │ value: "root"          │                 │ id:       "p-1"          │
   │ children: [            │                 │ title:    "Hello World"  │
   │   ┌──────────────────┐ │                 │ authorId: "u-1"  ────────┼──┐
   │   │ value: "child A" │ │                 └──────────────────────────┘  │
   │   │ children: [...]  │ │                                                │
   │   └──────────────────┘ │                  the post does NOT contain     │
   │   ┌──────────────────┐ │                  the user. it contains the     │
   │   │ value: "child B" │ │                  STRING "u-1" — a NAME that    │
   │   │ children: [...]  │ │                  can be RESOLVED into the user.│
   │   └──────────────────┘ │                                                │
   │ ]                      │                  user collection ◄─────────────┘
   └────────────────────────┘                  ┌────────┬───────────────────┐
        the child object                       │ "u-1"  │ {id:"u-1",        │
        lives INSIDE the parent                 │        │  name:"Ada"}      │
        one big nested blob                     └────────┴───────────────────┘
```

> A **reference** (a.k.a. **foreign key**) = a field whose **value** is the **primary key** of a record in some collection.

### 3.3 WHY references instead of nesting — three payoffs, drawn

```
   PAYOFF 1 — NO DUPLICATION
   ──────────────────────────
   CONTAINMENT:  1000 posts by Ada                REFERENCE: 1000 posts by Ada
   ┌────────────────────────────┐                 ┌──────────────────────────┐
   │ post: {…, author:{Ada…}}   │  ◄ full copy    │ post: {…, authorId:"u-1"}│
   │ post: {…, author:{Ada…}}   │  ◄ full copy    │ post: {…, authorId:"u-1"}│
   │ post: {…, author:{Ada…}}   │  ◄ full copy    │ post: {…, authorId:"u-1"}│
   │  ... ×1000 copies of Ada   │                 │  ... ×1000 just "u-1"    │
   └────────────────────────────┘                 └──────────────────────────┘
              1000 Adas                                    user store:
                                                           ┌──────────────┐
                                                           │ "u-1"→{Ada}  │  ← ONE Ada
                                                           └──────────────┘

   PAYOFF 2 — CONSISTENCY FOR FREE
   ────────────────────────────────
   rename Ada → "Ada Lovelace"

   CONTAINMENT:                          REFERENCE:
   rewrite all 1000 copies               rewrite ONE record
   ┌──────────┐ ┌──────────┐             ┌──────────────────┐
   │ copy 1 ✎ │ │ copy 2 ✎ │ ... ✎×1000  │ "u-1"→{Ada Love…}│ ✎  done.
   └──────────┘ └──────────┘             └──────────────────┘
   miss one → stale data                 every post resolves to the
                                          one updated record. instantly correct.

   PAYOFF 3 — FLAT, UNIFORM SHAPE
   ───────────────────────────────
   CONTAINMENT:  arbitrarily deep         REFERENCE: every record is flat
   post                                   ┌─────────────┐  ┌─────────────┐
    └─ author                             │ post (flat) │  │ user (flat) │
        └─ team                           └─────────────┘  └─────────────┘
            └─ company                    every record reachable in ONE hop
                └─ ...                     from its collection. no digging.
```

```
   THE ONE COST (and it's cheap)
   ──────────────────────────────
   to read "a post WITH its author", you must RESOLVE the reference:

        post.authorId = "u-1"   ──lookup──►   user store   ──►   {Ada}
                                              ONE O(1) hit

   that's the whole tradeoff. one cheap lookup buys you all 3 payoffs.
```

### 3.4 A reference is stored on ONE side, read from BOTH

This asymmetry is the single most important mechanic in the chapter. Watch it.

```
   THE REFERENCE PHYSICALLY LIVES HERE  ───►  post.authorId = "u-1"

   ┌─────────────────────────────────────────────────────────────────┐
   │                                                                  │
   │  FORWARD direction  ("given a post → who's the author?")         │
   │  ─────────────────────────────────────────────────────           │
   │                                                                  │
   │     post p-1                          user store                │
   │     ┌──────────────┐                  ┌────────────────────┐    │
   │     │ authorId:"u-1"│ ───follow key──► │ get("u-1")→{Ada}   │    │
   │     └──────────────┘                  └────────────────────┘    │
   │                                                                  │
   │     ✓ the key is RIGHT THERE on the post. ONE lookup. O(1).      │
   │                                                                  │
   ├─────────────────────────────────────────────────────────────────┤
   │                                                                  │
   │  REVERSE direction  ("given a user → all their posts?")          │
   │  ────────────────────────────────────────────────────           │
   │                                                                  │
   │     user u-1                          post store                │
   │     ┌──────────────┐                  ┌──────────────────────┐  │
   │     │ (stores       │   must SCAN ──►  │ p-1 authorId:"u-1" ✓ │  │
   │     │  NOTHING      │   the entire     │ p-2 authorId:"u-2" ✗ │  │
   │     │  about posts) │   post store     │ p-3 authorId:"u-1" ✓ │  │
   │     └──────────────┘                  └──────────────────────┘  │
   │                                                  │               │
   │                                                  ▼               │
   │                                            [p-1, p-3]            │
   │                                                                  │
   │     ✗ nothing stored on the user. SCAN. O(n). (an index fixes    │
   │       this — see Appendix.)                                      │
   │                                                                  │
   └─────────────────────────────────────────────────────────────────┘

   MEMORIZE THIS RULE:
   ┌─────────────────────────────────────────────────────────────────┐
   │  the reference is stored on the "MANY" side,                     │
   │  pointing AT the "ONE" side.                                     │
   │                                                                  │
   │  a post belongs to ONE author  →  the POST stores authorId       │
   │  a user has MANY posts         →  the USER stores nothing;       │
   │                                   "their posts" is DERIVED       │
   └─────────────────────────────────────────────────────────────────┘
```

### 3.5 Cardinalities — every relationship shape, drawn

```
   ┌─────────────────────────────────────────────────────────────────┐
   │  ONE-TO-MANY   (the most common — learn this one cold)           │
   │                                                                  │
   │    one team  ──has many──►  users                                │
   │    each user ──belongs to one──►  team                           │
   │                                                                  │
   │    ┌────────┐                      ┌────────┐                    │
   │    │  team  │ ◄────────────────────│  user  │                    │
   │    │  "t-1" │   user.teamId="t-1"  │  "u-1" │                    │
   │    └────────┘   key stored HERE ───┘ "u-2" │                     │
   │       "ONE"        on the "MANY" side  └────┘                     │
   │                                        "MANY"                    │
   ├─────────────────────────────────────────────────────────────────┤
   │  MANY-TO-ONE   = THE SAME RELATIONSHIP, viewpoint flipped         │
   │                                                                  │
   │    many users → one team. identical wiring. just read from       │
   │    the other end. one-to-many AND many-to-one are ONE thing.     │
   ├─────────────────────────────────────────────────────────────────┤
   │  ONE-TO-ONE                                                      │
   │                                                                  │
   │    one user ──has one──►  profile                                │
   │    ┌────────┐             ┌──────────┐                           │
   │    │  user  │ ◄───────────│ profile  │  profile.userId="u-1"     │
   │    │  "u-1" │             │  "pr-1"  │  + UNIQUE rule on userId  │
   │    └────────┘             └──────────┘                           │
   │    it's a one-to-many where the "many" is capped at 1.          │
   ├─────────────────────────────────────────────────────────────────┤
   │  MANY-TO-MANY   (needs a helper collection!)                     │
   │                                                                  │
   │    a student takes many courses.                                 │
   │    a course has many students.                                   │
   │    you CANNOT store this with one key on either side.           │
   │    → introduce a THIRD collection: the JUNCTION.                 │
   │                                                                  │
   │   ┌─────────┐      ┌──────────────────────┐      ┌─────────┐     │
   │   │ student │ ◄────│  enrollment          │────► │ course  │     │
   │   │  "s-1"  │      │  ┌─────────────────┐ │      │  "c-1"  │     │
   │   └─────────┘      │  │ studentId:"s-1" │ │      └─────────┘     │
   │                    │  │ courseId: "c-1" │ │                      │
   │                    │  └─────────────────┘ │                      │
   │                    │  each record =       │                      │
   │                    │  ONE pairing         │                      │
   │                    └──────────────────────┘                      │
   │                                                                  │
   │   a many-to-many is just TWO one-to-many relationships           │
   │   pointing INTO a shared junction collection. no new primitive.  │
   └─────────────────────────────────────────────────────────────────┘
```

### 3.6 THE BIG REVEAL — a relational dataset IS a graph

```
   put three collections together, wired by references:

   COLLECTION: user                  COLLECTION: post
   ┌────────┬─────────────┐          ┌────────┬─────────────────────────────┐
   │ "u-1"  │ name:"Ada"  │◄────┐    │ "p-1"  │ title:"Hello"  authorId:u-1 │──┐
   │ "u-2"  │ name:"Lin"  │◄──┐ │    │ "p-2"  │ title:"World"  authorId:u-2 │  │
   └────────┴─────────────┘   │ │    │ "p-3"  │ title:"Again"  authorId:u-1 │──┤
                              │ │    └────────┴─────────────────────────────┘  │
                              │ └─────────────────────────────────────────────┘
                              │                                                │
                              │      COLLECTION: comment                       │
                              │      ┌────────┬──────────────────────────────┐ │
                              └──────│ "c-1"  │ text:"nice!"   authorId:u-2  │ │
                                     │        │                postId: p-1 ─┼─┘
                                     └────────┴──────────────────────────────┘

   ┌─────────────────────────────────────────────────────────────────┐
   │                                                                  │
   │   RECORDS  =  NODES                                              │
   │   REFERENCES  =  DIRECTED EDGES                                  │
   │                                                                  │
   │   a relational dataset is a DIRECTED GRAPH where:                │
   │     • nodes are partitioned into collections (a node has a TYPE) │
   │     • edges are foreign keys (an edge has a known origin field)  │
   │     • every edge: walk FORWARD in O(1), walk BACKWARD by scan    │
   │                                                                  │
   └─────────────────────────────────────────────────────────────────┘

   the same data, drawn as the graph it actually is:

                      ┌──────────────┐
                      │  user u-1    │
                      │  "Ada"       │
                      └──────────────┘
                        ▲          ▲
              authorId  │          │  authorId
            ┌───────────┘          └───────────┐
            │                                  │
     ┌──────────────┐                   ┌──────────────┐
     │  post p-1    │                   │  post p-3    │
     │  "Hello"     │                   │  "Again"     │
     └──────────────┘                   └──────────────┘
            ▲
            │ postId
            │
     ┌──────────────┐      authorId     ┌──────────────┐
     │ comment c-1  │ ─────────────────►│  user u-2    │
     │ "nice!"      │                   │  "Lin"       │
     └──────────────┘                   └──────────────┘

   you ALREADY KNOW how to think about this. you studied it.
   → a relational QUERY is a GRAPH TRAVERSAL.  (Part III proves it.)

   THIS is why Memgraph clicked for you: a graph DB makes the
   "data is a graph" model LITERAL. a relational DB hides the
   exact same graph behind tables + foreign keys. same animal,
   different clothes.
```

---


---

**Prev:** [02 — Collections](02-collections.md) · **Next:** [04 — Integrity constraints](04-integrity-constraints.md)
