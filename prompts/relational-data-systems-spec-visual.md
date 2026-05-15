# Relational Data Systems — The Visual Edition

*A diagram-first foundation for a frontend developer who already knows DSA. Built the way you learned graphs and trees — but you can SEE every mechanic move.*

---

## Who this is for / how to read it

You are a **frontend developer**. You already think in:

- **component trees** (nested, parent owns child)
- **props vs. state** (data passed down vs. data owned)
- **references** (you pass objects around; you know `===` is identity, not equality)
- **DSA foundations** (you implemented graph & tree collections — nodes, edges, traversal)

This book reuses *all* of that. Every relational concept is mapped to something already in your head. And every mechanic is drawn — you will watch records get created, references get resolved, edges get deleted, frame by frame.

**Reading rule:** don't skim the diagrams. They *are* the explanation. The prose just labels them.

```
   THE WHOLE BOOK IN ONE PICTURE
   ─────────────────────────────────────────────────────────────

   PART I        PART II         PART III        PART IV       PART V
   primitives    invariants      operations      the engine    build it
   ┌────────┐    ┌────────┐      ┌────────┐      ┌────────┐    ┌────────┐
   │ record │    │ entity │      │ create │      │ @mswjs │    │  ~120  │
   │ collec-│ →  │ integ. │  →   │ read   │  →   │ /data  │ →  │  lines │
   │ tion   │    │ ref.   │      │ update │      │ mapped │    │  from  │
   │ ref.   │    │ integ. │      │ delete │      │ to I-III│   │ scratch│
   └────────┘    └────────┘      └────────┘      └────────┘    └────────┘
   "node,edge"   "tree must     "traversal"     one real      "implement
                  be acyclic"                    system        the class"

   each layer only uses the layer to its left. learn left-to-right.
```

---

# PART I — THE PRIMITIVES

Three primitives. That's the entire foundation.

```
   ┌─────────────────────────────────────────────────────────┐
   │                                                          │
   │   1. RECORD       one data object, uniquely identifiable │
   │                   (frontend: one object in an array)     │
   │                                                          │
   │   2. COLLECTION   a group of same-shape records          │
   │                   (frontend: the array itself — a table) │
   │                                                          │
   │   3. REFERENCE    a pointer from one record to another,  │
   │                   stored as a KEY                        │
   │                   (frontend: an id, not a nested object) │
   │                                                          │
   └─────────────────────────────────────────────────────────┘

   you ALREADY HAVE 1 and 2 from your graph/tree work.
   #3 is the new idea — it is literally why the word
   "relational" exists.
```

---

## Chapter 1 — Records & Identity

### 1.1 Frontend bridge: you've felt the pain of missing identity

You know this React warning:

```
   Warning: Each child in a list should have a unique "key" prop.
                                                   ▲
                                                   │
            React is BEGGING for identity. without a stable key,
            it can't tell which item is which across renders.
            relational data has the same need — and solves it
            the same way: a permanent, unique id per record.
```

A record is just an object — *plus one promise*: it carries a field whose value is **unique** and **never changes**. That's the **primary key**. It IS the record's identity.

### 1.2 Node without identity vs. record with identity

```
   GRAPH NODE (no identity)            RELATIONAL RECORD (has identity)
   ┌──────────────────────┐           ┌──────────────────────────────┐
   │  name: "Ada"         │           │  id:   "u-1"   ◄─────────────┼── primary key
   │  age:  36            │           │  name: "Ada"                 │     unique + permanent
   └──────────────────────┘           │  age:  36                    │
        │                             └──────────────────────────────┘
        │ "which node is this?"            │
        │ you must TRAVERSE to find it     │ "this is u-1. always.
        ▼                                  ▼  everywhere."
   reached by walking the structure    reached by DIRECT LOOKUP
   O(n) — search                       O(1) — index
```

### 1.3 What identity unlocks — three superpowers

```
   ┌─────────────────────────────────────────────────────────┐
   │  SUPERPOWER 1 — DIRECT LOOKUP                            │
   │                                                          │
   │     "give me u-1"  ────────►  { id:"u-1", name:"Ada" }   │
   │      no traversal. one step.                             │
   ├─────────────────────────────────────────────────────────┤
   │  SUPERPOWER 2 — STABLE POINTERS                          │
   │                                                          │
   │     other records can hold "u-1" and the pointer stays  │
   │     valid even when Ada's other fields change.          │
   │     post ──"u-1"──► [still valid after Ada's age++]     │
   ├─────────────────────────────────────────────────────────┤
   │  SUPERPOWER 3 — DEDUPLICATION                            │
   │                                                          │
   │     there is exactly ONE record with key "u-1".         │
   │     "the same entity" has ONE canonical home.           │
   └─────────────────────────────────────────────────────────┘
```

### 1.4 Anatomy of a record — three kinds of field

```
   RECORD
   ╔═══════════════════════════════════════════════════════╗
   ║                                                        ║
   ║   ┌─────────────────────────────────────────────────┐ ║
   ║   │ PRIMARY KEY     id: "u-1"                       │ ║  ← identity
   ║   └─────────────────────────────────────────────────┘ ║     EXACTLY ONE
   ║                                                        ║
   ║   ┌─────────────────────────────────────────────────┐ ║
   ║   │ VALUE FIELDS    name:   "Ada"                   │ ║  ← plain data
   ║   │                 age:    36                      │ ║     strings, numbers,
   ║   │                 active: true                    │ ║     booleans, dates
   ║   └─────────────────────────────────────────────────┘ ║
   ║                                                        ║
   ║   ┌─────────────────────────────────────────────────┐ ║
   ║   │ REFERENCE FIELD teamId: "t-2"  ─────────────────┼─╫──► points at another
   ║   └─────────────────────────────────────────────────┘ ║     record (Chapter 3)
   ║                                                        ║
   ╚═══════════════════════════════════════════════════════╝

   every relational record is some mix of these three field types.
```

### 1.5 The primary key contract

```
   ┌────────────┬────────────────────────────────────────────┐
   │ UNIQUE     │ no two records in the collection share it  │
   ├────────────┼────────────────────────────────────────────┤
   │ STABLE     │ never changes after creation.              │
   │            │ change name freely. NEVER change id.       │
   ├────────────┼────────────────────────────────────────────┤
   │ NON-NULL   │ every record has one. no id = not a record │
   └────────────┴────────────────────────────────────────────┘

   key-generation strategies:
     auto-increment   1, 2, 3, 4 ...
     UUID             "550e8400-e29b-41d4-a716-..."
     natural key      an email, an ISBN  (already unique in real life)
```

---

## Chapter 2 — Collections

### 2.1 Frontend bridge: from `array.find()` to `map.get()`

This is a mental shift you can feel:

```
   HOW YOU PROBABLY STORE THINGS NOW        HOW A COLLECTION STORES THINGS
   ────────────────────────────────         ──────────────────────────────
   const users = [                          const users = new Map([
     { id:"u-1", name:"Ada" },                 ["u-1", { id:"u-1", name:"Ada" }],
     { id:"u-2", name:"Lin" },                 ["u-2", { id:"u-2", name:"Lin" }],
   ]                                         ])

   users.find(u => u.id === "u-1")           users.get("u-1")
        ▲                                         ▲
        │ O(n) — scans the array                  │ O(1) — direct hit
        │ every lookup                            │ every lookup
```

A **collection** is a **dictionary keyed by primary key**. Same data — indexed for identity.

### 2.2 The collection, drawn

```
   COLLECTION: user
   ┌──────────┬────────────────────────────────────────────┐
   │   KEY    │   RECORD (the value)                       │
   ├──────────┼────────────────────────────────────────────┤
   │  "u-1"   │   { id:"u-1", name:"Ada", age:36 }         │
   │  "u-2"   │   { id:"u-2", name:"Lin", age:28 }         │
   │  "u-3"   │   { id:"u-3", name:"Sam", age:41 }         │
   └──────────┴────────────────────────────────────────────┘
        ▲              ▲
        │              │
        │              └─ the value is the full record
        │
        └─ THE KEY IS NOT ARBITRARY.
           key  ===  record.id   (always)
           the contract:  collection.get(r.id)  returns  r
```

### 2.3 Two things you get FREE from this structure

```
   FREEBIE 1 — O(1) LOOKUP BY ID
   ───────────────────────────────
        get("u-2")
            │
            ▼
   ┌──────────────────────┐
   │ "u-2" → {…Lin…}      │   one hash, one hit. done.
   └──────────────────────┘   this is the workhorse of all relational data.


   FREEBIE 2 — UNIQUENESS ENFORCED BY CONSTRUCTION
   ────────────────────────────────────────────────
        set("u-1", recordA)        store: { "u-1" → recordA }
        set("u-1", recordB)        store: { "u-1" → recordB }   ← B overwrote A
                                                                  you CANNOT have
                                                                  two "u-1"s.
        the "primary key is unique" RULE isn't code you wrote.
        it's just how a dictionary behaves. constraint = free.
```

### 2.4 A collection has a SHAPE (schema)

```
   every record in the collection is the SAME SHAPE.
   that shape is the SCHEMA — the "type definition" of the collection.

   SCHEMA for collection "user"
   ┌────────────┬──────────────┬───────────────────────────┐
   │ FIELD      │ TYPE         │ ROLE                      │
   ├────────────┼──────────────┼───────────────────────────┤
   │ id         │ string       │ PRIMARY KEY               │
   │ name       │ string       │ value (required)          │
   │ age        │ number       │ value (required)          │
   │ active     │ boolean      │ value (default: true)     │
   │ teamId     │ → team       │ REFERENCE                 │
   └────────────┴──────────────┴───────────────────────────┘

   frontend bridge: this is a TypeScript interface that the
   database actually ENFORCES at runtime.

        interface User {            ─── but unlike TS, the
          id: string                    relational schema is
          name: string                  checked when you WRITE,
          age: number                   not just at compile time.
          active: boolean
          teamId: string
        }
```

### 2.5 The whole "database" is just a bag of collections

```
   DATABASE
   ╔═══════════════════════════════════════════════════════╗
   ║                                                        ║
   ║   collections = {                                      ║
   ║                                                        ║
   ║     user    →  Map { "u-1"→{…}, "u-2"→{…} }            ║
   ║                                                        ║
   ║     post    →  Map { "p-1"→{…}, "p-2"→{…} }            ║
   ║                                                        ║
   ║     comment →  Map { "c-1"→{…} }                       ║
   ║                                                        ║
   ║     team    →  Map { "t-1"→{…}, "t-2"→{…} }            ║
   ║                                                        ║
   ║   }                                                    ║
   ║                                                        ║
   ╚═══════════════════════════════════════════════════════╝

   no magic at this level. it is a CONTAINER OF CONTAINERS.
   all the interesting behaviour comes from how records in
   DIFFERENT collections point at each other → Chapter 3.
```

---

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

# PART IV — THE ENGINE: `@mswjs/data` UNDER THE HOOD

Now we drop from theory into one real system. `@mswjs/data` is a mock relational data layer for tests & prototypes. **Everything in Parts I–III is exactly what it implements.** This part maps the theory onto its actual API.

```
   ┌─────────────────────────────────────────────────────────────┐
   │   WHAT @mswjs/data GIVES YOU                                 │
   │                                                              │
   │   1. factory()    — describe schemas → get a database object│
   │   2. models       — one per collection: full CRUD + query   │
   │   3. relations    — first-class references (oneOf, manyOf)  │
   │   4. msw bridge   — toHandlers(): collections → a fake API  │
   └─────────────────────────────────────────────────────────────┘

   in this book's vocabulary: it's THE ENGINE that wires the
   three primitives together, plus a converter that turns
   collections into a mock REST/GraphQL API.

        YOUR SCHEMA            @mswjs/data          WHAT YOU GET
   ┌──────────────────┐    ┌──────────────┐    ┌──────────────────┐
   │ describe each    │    │  factory()   │    │ db.user.create() │
   │ collection's     │───►│  builds      │───►│ db.post.findMany()│
   │ fields + relations│   │  models      │    │ db.user.toHandlers│
   └──────────────────┘    └──────────────┘    └──────────────────┘
      (Parts I & II)        (Part V — the          (Part III +
                             implementation)        the msw bridge)
```

## Chapter 7 — Defining collections: `factory`

You call `factory()` with an object. Each top-level key = a **collection name**. Each value = that collection's **schema** (the Chapter 2.4 concept).

```js
import { factory, primaryKey, oneOf, manyOf } from '@mswjs/data'

const db = factory({
  // ── COLLECTION: user ───────────────────────────────
  user: {
    id:    primaryKey(() => crypto.randomUUID()),  // ← identity (Ch.1)
    name:  String,                                  // ← value field
    age:   Number,                                  // ← value field
    team:  oneOf('team'),                           // ← forward reference (Ch.3)
    posts: manyOf('post'),                          // ← reverse relation (Ch.3.4)
  },

  // ── COLLECTION: team ───────────────────────────────
  team: {
    id:   primaryKey(() => crypto.randomUUID()),
    name: String,
  },

  // ── COLLECTION: post ───────────────────────────────
  post: {
    id:     primaryKey(() => crypto.randomUUID()),
    title:  String,
    author: oneOf('user'),                          // ← the forward edge
  },
})
```

```
   EVERY API PIECE MAPS BACK TO A CHAPTER:

   ┌─────────────────────┬──────────┬────────────────────────────────┐
   │ @mswjs/data thing   │ Chapter  │ what it IS                     │
   ├─────────────────────┼──────────┼────────────────────────────────┤
   │ top-level key       │  Ch 2    │ a COLLECTION                   │
   │ (user, post, team)  │          │                                │
   ├─────────────────────┼──────────┼────────────────────────────────┤
   │ the object under it │  Ch 2.4  │ the collection's SCHEMA        │
   ├─────────────────────┼──────────┼────────────────────────────────┤
   │ primaryKey(...)     │  Ch 1    │ declares the IDENTITY field    │
   │                     │          │ + how keys are generated       │
   ├─────────────────────┼──────────┼────────────────────────────────┤
   │ String, Number,     │  Ch 1.4  │ VALUE fields + their types     │
   │ Boolean             │          │                                │
   ├─────────────────────┼──────────┼────────────────────────────────┤
   │ oneOf('team')       │  Ch 3    │ a FORWARD reference — this     │
   │                     │          │ record stores an edge to one  │
   │                     │          │ team                           │
   ├─────────────────────┼──────────┼────────────────────────────────┤
   │ manyOf('post')      │  Ch 3.4  │ a REVERSE relation — "all      │
   │                     │          │ posts pointing back at me"     │
   ├─────────────────────┼──────────┼────────────────────────────────┤
   │ the returned db     │  Ch 2.5  │ the DATABASE — bag of collec-  │
   │                     │          │ tions                          │
   └─────────────────────┴──────────┴────────────────────────────────┘

   primaryKey() takes a FUNCTION that generates the key —
   that function IS your "key strategy" from Ch 1.5.
   UUID here, but () => nanoid() or a counter would work too.
```

## Chapter 8 — `create` and the in-memory store

```js
const core = db.team.create({ name: 'Core' })
//     ▲ create RETURNS the full record, including the generated id

const ada = db.user.create({
  name: 'Ada',
  age:  36,
  team: core,        // ← you pass the whole team RECORD...
})

db.post.create({ title: 'Hello', author: ada })
db.post.create({ title: 'Again', author: ada })
```

**Under the hood**, after those calls, the engine's internal state is exactly the bag-of-dictionaries from Chapter 2.5 — and watch what happened to `ada`:

```
   db (internal state)
   ╔═══════════════════════════════════════════════════════════════╗
   ║                                                                ║
   ║  team    Map {                                                 ║
   ║            "t-uuid" → { id:"t-uuid", name:"Core" }            ║
   ║          }                                                     ║
   ║                                                                ║
   ║  user    Map {                                                 ║
   ║            "u-uuid" → { id:"u-uuid", name:"Ada", age:36,      ║
   ║                          team: ⟶ "t-uuid"  }  ◄── stored as   ║
   ║          }                                        a REFERENCE  ║
   ║                                                   NOT a copy   ║
   ║  post    Map {                                                 ║
   ║            "p-uuid1" → { id:"p-uuid1", title:"Hello",         ║
   ║                           author: ⟶ "u-uuid" }                ║
   ║            "p-uuid2" → { id:"p-uuid2", title:"Again",         ║
   ║                           author: ⟶ "u-uuid" }                ║
   ║          }                                                     ║
   ║                                                                ║
   ╚═══════════════════════════════════════════════════════════════╝

   ┌──────────────────────────────────────────────────────────────┐
   │  KEY INSIGHT:                                                 │
   │  even though you PASSED the whole `ada` record into           │
   │  db.post.create({ author: ada }),  the engine does NOT       │
   │  nest a copy of Ada inside the post.                         │
   │                                                               │
   │     you passed:   author: { id:"u-uuid", name:"Ada", ... }   │
   │     it stored:    author: ⟶ "u-uuid"                         │
   │                                                               │
   │  it EXTRACTS her primary key and stores a REFERENCE (Ch 3.2). │
   │  this is the no-duplication payoff (Ch 3.3) made concrete.    │
   └──────────────────────────────────────────────────────────────┘
```

## Chapter 9 — `findFirst` / `findMany` and the automatic join

```js
// FROM + WHERE — filter (Chapter 5.2)
db.user.findMany({
  where: {
    age:  { gte: 30 },          // ← predicate operator
    name: { contains: 'a' },
  },
})

// effectively a primary-key lookup (Chapter 5.1)
db.user.findFirst({
  where: { id: { equals: 'u-uuid' } },
})
```

The `where` object is how you **build the predicate** from Chapter 5.2:

```
   db.user.findMany({ where: { age: { gte: 30 }, name: { contains:'a' } } })

   the engine COMPILES this where-object into ONE function:

      record  ──►  record.age >= 30  &&  record.name.includes('a')  ──► boolean

   then runs it over every value in the user Map. it's array.filter()
   over a dictionary's values. you already know this operation.
```

**The automatic join.** `@mswjs/data` resolves references *for you* on read. Read a user, and its `team` field comes back as the actual team record — not the stored key:

```js
const u = db.user.findFirst({ where: { name: { equals: 'Ada' } } })

u.team        // → { id:'t-uuid', name:'Core' }   ← reference RESOLVED
u.posts       // → [ {…Hello…}, {…Again…} ]       ← reverse relation SCANNED
u.team.name   // → 'Core'                          ← multi-hop just works
```

What the engine did under the hood — Chapters 5.3 + 5.4, automatically:

```
   read user "Ada"   →   { id:"u-uuid", name:"Ada", team:⟶"t-uuid" }
        │
        │  the engine inspects the SCHEMA, field by field:
        │
        ├─ field "team"  is a oneOf  ──────────── FORWARD JOIN (Ch 5.3)
        │     take stored key  "t-uuid"
        │     team Map . get("t-uuid")                          O(1)
        │     splice in  → team: { id:"t-uuid", name:"Core" }
        │
        └─ field "posts" is a manyOf ──────────── REVERSE JOIN (Ch 5.4)
              scan the post Map
              keep posts whose  author ⟶ "u-uuid"
              splice in  → posts: [ {…Hello…}, {…Again…} ]

   final object handed back to you:
   ┌──────────────────────────────────────────────────────┐
   │ {                                                     │
   │   id: "u-uuid",                                       │
   │   name: "Ada",                                        │
   │   team:  { id:"t-uuid", name:"Core" },    ◄ resolved  │
   │   posts: [ {…Hello…}, {…Again…} ],        ◄ scanned   │
   │ }                                                     │
   └──────────────────────────────────────────────────────┘

   this is RESOLVE-ON-READ: the store holds KEYS, reads
   ASSEMBLE the joined object. that's why mock data stays
   consistent — there is one Ada, everything resolves to her.
```

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

## Chapter 11 — The msw bridge: `toHandlers` — collections become an API

This is the part that makes it `@mswjs/data` and not just an in-memory ORM. Each model converts itself into **msw request handlers**.

```js
import { setupServer } from 'msw/node'

const server = setupServer(
  ...db.user.toHandlers('rest'),   // generates GET/POST/PUT/DELETE for /users
  ...db.post.toHandlers('rest'),   // ...and for /posts
)
```

```
   what toHandlers('rest') generates — every route is just a
   CRUD operation from Part III wired to an HTTP verb:

   ┌────────────────────────┬─────────────────────────┬──────────────┐
   │ HTTP REQUEST           │ @mswjs/data OPERATION   │ BOOK CHAPTER │
   ├────────────────────────┼─────────────────────────┼──────────────┤
   │ GET    /users          │ db.user.findMany()      │ Ch 5 pipeline│
   │ GET    /users/:id      │ db.user.findFirst({id}) │ Ch 5.1 lookup│
   │ POST   /users  + body  │ db.user.create(body)    │ Ch 6.1 create│
   │ PUT    /users/:id+body │ db.user.update({id},…)  │ Ch 6.2 update│
   │ DELETE /users/:id      │ db.user.delete({id})    │ Ch 6.3 delete│
   └────────────────────────┴─────────────────────────┴──────────────┘

   the full request round-trip — drawn:

   ┌──────────┐   HTTP     ┌────────────────┐  calls   ┌──────────────┐
   │ your     │ ─────────► │ msw handler    │ ───────► │ @mswjs/data  │
   │ app's    │ GET /users │ (generated by  │ findMany │ model        │
   │ fetch()  │            │  toHandlers)   │          │              │
   │          │ ◄───────── │                │ ◄─────── │ in-memory    │
   └──────────┘   JSON     └────────────────┘  records │ collections  │
                                                        └──────────────┘
        ▲                                                      ▲
        │ your component code doesn't                          │ the keyed
        │ know it's talking to a mock                          │ dictionaries
        │ — that's the whole point                             │ from Ch 2
```

```
   THE FULL STACK OF WHAT YOU'RE LEARNING — bottom-up:

   ┌─────────────────────────────────────────────────────────────┐
   │  msw bridge      toHandlers → fake REST/GraphQL API         │ ◄ Ch 11
   ├─────────────────────────────────────────────────────────────┤
   │  operations      create / findMany / update / delete       │ ◄ Part III
   ├─────────────────────────────────────────────────────────────┤
   │  invariants      schema types, primaryKey, relations       │ ◄ Part II
   ├─────────────────────────────────────────────────────────────┤
   │  primitives      records · collections · references        │ ◄ Part I
   └─────────────────────────────────────────────────────────────┘

   each layer ONLY uses the layer below it. learn bottom-up.
```

---

# PART V — BUILD YOUR OWN

You really learned graphs by **implementing the Graph class yourself.** So here's a relational store from scratch — no library — implementing Parts I–III. `@mswjs/data` is a more featureful version of this same ~120 lines.

```js
// ============================================================
//  A relational data system from scratch.
//  Parts I-III of the spec book, implemented.
// ============================================================

// ---- PART I: PRIMITIVES ------------------------------------

class Collection {
  // a collection IS a primary-key-keyed dictionary (Chapter 2.1)
  constructor(name, schema) {
    this.name    = name        // collection name
    this.schema  = schema      // { field: { type, ref?, isPrimaryKey? } }
    this.store   = new Map()   // Map<primaryKey, record>  ← THE store
    this.pkField = Object.keys(schema)
      .find(f => schema[f].isPrimaryKey)   // which field is identity
  }
}

class Database {
  // the database is a bag of collections (Chapter 2.5)
  constructor() { this.collections = {} }

  defineCollection(name, schema) {
    this.collections[name] = new Collection(name, schema)
    return this   // chainable, like a builder
  }
}

// ---- PART III: OPERATIONS ----------------------------------

// ---- CREATE (Chapter 6.1): validate -> enforce -> commit ---
Database.prototype.create = function (collName, input) {
  const coll   = this.collections[collName]
  const record = { ...input }

  // entity integrity (Ch 4.1): every record needs a primary key
  const pk = record[coll.pkField]
  if (pk == null)            throw new Error('record has no primary key')
  if (coll.store.has(pk))    throw new Error(`duplicate key ${pk}`)

  // referential integrity (Ch 4.2): every reference must resolve
  for (const [field, def] of Object.entries(coll.schema)) {
    if (def.ref && record[field] != null) {
      const target = this.collections[def.ref]
      if (!target.store.has(record[field]))
        throw new Error(`dangling reference: ${field} -> ${record[field]}`)
    }
  }

  // commit — the only step that touches data
  coll.store.set(pk, record)
  return record
}

// ---- READ: lookup by key (Chapter 5.1) ---------------------
Database.prototype.findById = function (collName, key) {
  return this.collections[collName].store.get(key) ?? null
}

// ---- READ: filter by predicate (Chapter 5.2) ---------------
Database.prototype.findMany = function (collName, predicate = () => true) {
  const coll = this.collections[collName]
  const out  = []
  for (const record of coll.store.values()) {   // iterate the values
    if (predicate(record)) out.push(record)      // keep matches
  }
  return out
}

// ---- READ: resolve references = the JOIN (Ch 5.3 - 5.4) ----
Database.prototype.resolve = function (collName, record) {
  const coll     = this.collections[collName]
  const resolved = { ...record }

  for (const [field, def] of Object.entries(coll.schema)) {
    if (!def.ref) continue

    if (def.many) {
      // REVERSE relation: SCAN the other collection (Ch 5.4)
      // "all records in def.ref whose `def.backref` points at me"
      const myPk = record[coll.pkField]
      resolved[field] = this.findMany(def.ref,
        r => r[def.backref] === myPk)
    } else {
      // FORWARD relation: ONE lookup, follow the edge (Ch 5.3)
      const key = record[field]
      resolved[field] = key == null
        ? null
        : this.findById(def.ref, key)
    }
  }
  return resolved
}

// ---- UPDATE (Chapter 6.2): identity never changes ----------
Database.prototype.update = function (collName, key, changes) {
  const coll     = this.collections[collName]
  const existing = coll.store.get(key)
  if (!existing) throw new Error(`no record ${key}`)
  if (coll.pkField in changes)
    throw new Error('cannot change a primary key')   // Ch 1.5
  const updated = { ...existing, ...changes }
  // (a full impl re-checks referential integrity here)
  coll.store.set(key, updated)
  return updated
}

// ---- DELETE (Chapter 6.3): apply the delete policy ---------
Database.prototype.delete = function (collName, key, policy = 'restrict') {
  const coll = this.collections[collName]

  // step 2: find INCOMING edges — who references this record?
  const referrers = []
  for (const other of Object.values(this.collections)) {
    for (const [field, def] of Object.entries(other.schema)) {
      if (def.ref === collName && !def.many) {
        for (const rec of other.store.values()) {
          if (rec[field] === key) referrers.push({ other, field, rec })
        }
      }
    }
  }

  // step 3: apply the policy (Ch 4.4)
  if (referrers.length) {
    if (policy === 'restrict')
      throw new Error(`cannot delete ${key}: ${referrers.length} referrers`)
    if (policy === 'cascade')
      for (const { other, rec } of referrers)
        this.delete(other.name, rec[other.pkField], 'cascade')  // recursion
    if (policy === 'setNull')
      for (const { other, field, rec } of referrers)
        this.update(other.name, rec[other.pkField], { [field]: null })
  }

  // step 4: remove the record
  coll.store.delete(key)
}

// ============================================================
//  USING IT — the same shape as @mswjs/data, by hand
// ============================================================

const db = new Database()
  .defineCollection('team', {
    id:   { isPrimaryKey: true },
    name: { type: 'string' },
  })
  .defineCollection('user', {
    id:     { isPrimaryKey: true },
    name:   { type: 'string' },
    teamId: { ref: 'team' },                                    // forward ref
    posts:  { ref: 'post', many: true, backref: 'authorId' },   // reverse rel
  })
  .defineCollection('post', {
    id:       { isPrimaryKey: true },
    title:    { type: 'string' },
    authorId: { ref: 'user' },                                  // forward ref
  })

db.create('team', { id: 't-1', name: 'Core' })
db.create('user', { id: 'u-1', name: 'Ada', teamId: 't-1' })
db.create('post', { id: 'p-1', title: 'Hello', authorId: 'u-1' })
db.create('post', { id: 'p-2', title: 'Again', authorId: 'u-1' })

// lookup by key — O(1)
db.findById('user', 'u-1')
// → { id:'u-1', name:'Ada', teamId:'t-1' }

// filter by predicate — array.filter() over the Map's values
db.findMany('post', p => p.title.startsWith('H'))
// → [ {…Hello…} ]

// resolve — the JOIN: forward edge + reverse scan, multi-hop
const ada = db.resolve('user', db.findById('user', 'u-1'))
// → {
//     id:'u-1', name:'Ada',
//     teamId: { id:'t-1', name:'Core' },        ← forward join resolved
//     posts:  [ {…Hello…}, {…Again…} ],         ← reverse relation scanned
//   }

// delete with a policy — try to remove a referenced team
db.delete('team', 't-1', 'restrict')   // throws: u-1 still references it
db.delete('team', 't-1', 'setNull')    // ok: u-1.teamId becomes null
```

```
   ┌─────────────────────────────────────────────────────────────┐
   │  if you internalize that file, you understand @mswjs/data.   │
   │                                                              │
   │  the library adds:                                           │
   │    • nicer ergonomics  db.user.create() vs db.create('user') │
   │    • more query operators                                    │
   │    • INDEXES for fast reverse lookups (Appendix A)           │
   │    • the toHandlers msw bridge (Chapter 11)                  │
   │                                                              │
   │  but the SKELETON is this — keyed dictionaries, predicate    │
   │  filters, reference resolution, delete policies.             │
   └─────────────────────────────────────────────────────────────┘
```

---

# APPENDIX

## A. Indexes — turning the O(n) reverse scan back into O(1)

```
   THE PROBLEM (Chapter 5.4):
   "all posts by user u-1" means SCANNING the whole post store.
   O(n). slow when there are 100,000 posts.

   THE FIX: keep an extra Map alongside the collection — an INDEX.

   post store (the data)            index on authorId (the shortcut)
   ┌──────────────────────┐         ┌──────────────────────────────┐
   │ p-1 authorId:"u-1"   │         │ "u-1"  →  [ p-1, p-3 ]       │
   │ p-2 authorId:"u-2"   │         │ "u-2"  →  [ p-2 ]            │
   │ p-3 authorId:"u-1"   │         └──────────────────────────────┘
   └──────────────────────┘                    ▲
                                               │
   "posts by u-1" → index.get("u-1") → [p-1,p-3]   O(1) again!

   the cost: every create/update/delete must ALSO update the index.
   (this is the classic space + write-cost vs. read-speed tradeoff —
    you've seen it: it's a hash map memoizing a graph adjacency query.)

   frontend bridge: it's the same move as building a lookup object —
     const byAuthor = _.groupBy(posts, 'authorId')
   ...except the database keeps it in sync for you.
```

## B. The Rosetta Stone — Frontend / DSA  ↔  Relational

```
   ┌─────────────────────────────┬──────────────────────────────┬─────────────────────┐
   │ YOU ALREADY KNOW (left)     │ RELATIONAL WORLD             │ NOTES               │
   ├─────────────────────────────┼──────────────────────────────┼─────────────────────┤
   │ object in an array          │ record / row                 │ atomic data object  │
   │ React `key` prop / node id  │ primary key                   │ identity            │
   │ Map<id, item>               │ collection / table            │ keyed store         │
   │ array of items              │ collection                    │ same thing, indexed │
   │ TS interface                │ schema                        │ but enforced at     │
   │                             │                               │ WRITE time          │
   │ passing an `id` prop        │ reference / foreign key       │ edge, stored as key │
   │ passing the whole object    │ containment (NOT relational)  │ the thing rel.      │
   │                             │                               │ data avoids         │
   │ graph edge                  │ foreign key                   │ directed            │
   │ neighbor lookup             │ resolving a reference (join)  │ "follow the edge"   │
   │ out-edges of a node         │ forward relations             │ O(1) each           │
   │ in-edges of a node          │ reverse relations             │ scan, or indexed    │
   │ BFS / DFS                   │ a multi-hop query / join chain│ "which edges to walk│
   │ adjacency list              │ the set of foreign keys       │ physical storage    │
   │ array.filter()              │ findMany + where predicate    │ identical operation │
   │ array.find()                │ findFirst / findById          │ identical operation │
   │ _.groupBy()                 │ an index                      │ the read shortcut   │
   │ tree/DAG invariants         │ integrity constraints         │ keep structure valid│
   │ delete node + its edges     │ delete + CASCADE/SET NULL/    │ fate of incident    │
   │                             │ RESTRICT                      │ edges               │
   │ typed nodes in a graph      │ multiple collections          │ node has a "type"   │
   │ Memgraph                    │ Postgres / @mswjs/data        │ graph DB = explicit │
   │                             │                               │ graph; relational DB│
   │                             │                               │ = graph behind      │
   │                             │                               │ tables              │
   └─────────────────────────────┴──────────────────────────────┴─────────────────────┘
```

## C. Glossary

- **Record** — one uniquely-identifiable data object. A row. A node. (Frontend: one object in an array.)
- **Primary key** — the field holding a record's permanent, unique identity. (Frontend: React's `key` prop, made permanent.)
- **Collection** — a group of same-shape records, stored as a dictionary keyed by primary key. A table.
- **Schema** — the field-and-type definition of a collection. (Frontend: a TS interface the DB actually enforces.)
- **Reference / Foreign key** — a field whose value is the primary key of a record in another collection. A directed edge. (Frontend: passing an `id` instead of the whole object.)
- **Containment** — nesting the actual related object inside a record. What relational data deliberately *avoids*. (Frontend: passing the whole object down as a prop.)
- **Resolve** — to follow a reference: take the stored key, look it up, get the actual record.
- **Join** — assembling a result by resolving references — splicing related records together.
- **Forward relation** — a reference physically stored on this record; resolved with one O(1) lookup.
- **Reverse relation** — "records elsewhere that point at me"; found by scanning (or via an index). Stored nowhere on this record.
- **Cardinality** — the shape of a relationship: one-to-one, one-to-many, many-to-many.
- **Junction / join collection** — a third collection whose records are pairings; how many-to-many is built from two one-to-manys.
- **Entity integrity** — invariant: every record has a unique, non-null primary key.
- **Referential integrity** — invariant: every reference points at a record that actually exists.
- **Dangling reference** — a foreign key whose target no longer exists; a broken edge. (DSA: a graph edge whose endpoint was deleted.)
- **Delete policy** — the rule (RESTRICT / CASCADE / SET NULL) for what happens to incoming edges when a referenced record is deleted.
- **Predicate** — a `Record → boolean` function; what a `where` clause builds. (Frontend: the callback you pass to `.filter()`.)
- **Index** — an auxiliary `Map` (e.g. `Map<authorId, postId[]>`) that turns an O(n) reverse scan into O(1). (Frontend: a `_.groupBy()` the DB keeps in sync.)
- **`factory`** (`@mswjs/data`) — builds the database object from your schemas.
- **`primaryKey`** (`@mswjs/data`) — declares the identity field and its key-generation function.
- **`oneOf` / `manyOf`** (`@mswjs/data`) — declare a forward reference / a reverse (or many) relation.
- **`toHandlers`** (`@mswjs/data`) — converts a model's CRUD operations into msw HTTP request handlers.

## D. Exercises — do these the way you did graph problem sets

```
   1. IDENTITY
      take your old Tree node class. add a stable `id` field and
      store nodes in a Map<id, Node> alongside the tree structure.
      implement getNodeById in O(1). notice: no more traversal.

   2. REFERENCE vs CONTAINMENT
      model a blog two ways:
        (a) posts with authors NESTED inside them
        (b) posts with authorId REFERENCING a user collection
      rename an author in both. COUNT THE WRITES.

   3. REVERSE RELATION + INDEX
      using the Part V code, implement getPostsByAuthor WITHOUT
      the resolve helper — write the scan by hand. then add an
      index Map<authorId, postId[]> and make it O(1).

   4. CARDINALITY
      model students & courses (many-to-many). implement the
      `enrollment` junction collection. write "all courses for a
      student" AND "all students in a course" — note they're
      symmetric.

   5. DELETE POLICIES
      in the Part V code, create a team with three users. delete
      the team with each of restrict / cascade / setNull. PREDICT
      the resulting state before running it.

   6. TRAVERSAL = QUERY
      write a function that, given a post id, returns
      { title, authorName, teamName } by following two edges.
      you just wrote a 3-collection join as a depth-first traversal.

   7. @mswjs/data PARITY
      rebuild exercise 2(b) using REAL @mswjs/data — factory,
      primaryKey, oneOf. confirm the mental model holds:
      same primitives, nicer API.

   8. THE BRIDGE
      add toHandlers('rest') to the exercise-7 database, point an
      msw server at it, fetch('/posts/:id') from a test. trace the
      request through Chapter 11's round-trip diagram.
```

---

```
   ┌─────────────────────────────────────────────────────────────┐
   │  END OF SPEC BOOK.                                           │
   │                                                              │
   │  Parts I-III are UNIVERSAL — they describe Postgres,        │
   │  SQLite, Memgraph's relational cousins, and @mswjs/data     │
   │  equally.                                                    │
   │  Part IV is the ONE concrete engine.                        │
   │  Part V is the proof you could BUILD it — which, the same   │
   │  way it did for graphs, is what turns "I read about it"     │
   │  into "I understand it under the hood."                     │
   │                                                              │
   │  the load-bearing idea, one more time:                       │
   │                                                              │
   │     a relational dataset IS a directed graph.                │
   │     records are nodes. foreign keys are edges.               │
   │     queries are traversals.                                  │
   │                                                              │
   │  that's why Memgraph clicked. now relational clicks too.    │
   └─────────────────────────────────────────────────────────────┘
```
