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

**Why this matters in practice.** Consider a todo list with 10,000 items where the user is toggling checkboxes rapidly. With an array, every toggle scans on average half the list (5,000 comparisons per toggle). With a Map, every toggle is one hash lookup (constant time, regardless of list size). At small scales (a 20-item shopping list) you don't notice. At medium scales (a project tracker with hundreds of tasks) you start noticing jank during keyboard navigation. At large scales (a CRM with 50,000 contacts), the array model is unusable. The collection model scales transparently because the lookup cost doesn't grow with the data.

This is exactly the trick `normalizr` (Redux's normalisation library) does to client-side state: instead of nested arrays of objects, you get `{ todos: { byId: Map, allIds: Array } }`. The `byId` map is your collection; `allIds` is just a render-order helper. Same data, different access pattern.

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

These two freebies — O(1) by-id lookup, uniqueness by construction — are why every relational engine, from Postgres to SQLite to `@mswjs/data`, uses a hash-map (or B-tree, which adds O(log n) ordered traversal but keeps the same identity model) for the primary key. You couldn't reasonably build a database without them. The collection IS the primary-key index — the rest of the engine is layered on top of it.

A subtle but important consequence: there's no "duplicate primary key" error to handle in your code, because the data structure can't represent it. If you try to insert two todos with the same id, the second one overwrites the first. Real databases promote this into a runtime error (`UNIQUE constraint violation`) instead of silently overwriting, but the underlying structure is the same.

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

**A worked example — the schema for a todo collection:**

```
   SCHEMA for collection "todo"
   ┌────────────┬──────────────┬───────────────────────────┐
   │ FIELD      │ TYPE         │ ROLE                      │
   ├────────────┼──────────────┼───────────────────────────┤
   │ id         │ string       │ PRIMARY KEY               │
   │ text       │ string       │ value (required)          │
   │ done       │ boolean      │ value (default: false)    │
   │ createdAt  │ number       │ value (timestamp ms)      │
   │ userId     │ → user       │ REFERENCE (who owns it)   │
   │ listId     │ → list       │ REFERENCE (which list)    │
   └────────────┴──────────────┴───────────────────────────┘

   one schema. shared by every todo in the collection.
   write a record missing 'text' or with 'done: 42' and
   the database REJECTS the insert. shape is law.
```

The schema does three jobs at once:

1. **It tells the engine how to store records.** Strings, numbers, and booleans are laid out differently in memory and on disk; the schema is how the engine knows.
2. **It tells the engine what to validate.** A `boolean` field can only ever hold `true` or `false`. A `number` field rejects `"three"`. The validation happens at the write boundary, so by the time a record is *in* the collection, you can trust its shape without re-checking.
3. **It tells the engine which fields are references.** `userId: → user` says "the value in this field must match some user's primary key." That's the contract Chapter 3 will lean on heavily.

In TypeScript land, you'd write `interface Todo { ... }` and trust the compiler. In relational land, the schema travels with the data and the engine enforces it on every write — even when the write came from code that wasn't checked at compile time (a curl command, a buggy migration, a test fixture). The schema is a runtime contract, not just a build-time hint.

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

**A worked database for a todo app, drawn at full size:**

```
   DATABASE: todo-app
   ╔══════════════════════════════════════════════════════════════╗
   ║                                                              ║
   ║  collection: user                                            ║
   ║  ┌───────┬─────────────────────────────────────────────────┐ ║
   ║  │ "u-1" │ { id:"u-1", name:"Ada",  email:"a@x.com" }      │ ║
   ║  │ "u-2" │ { id:"u-2", name:"Lin",  email:"l@x.com" }      │ ║
   ║  └───────┴─────────────────────────────────────────────────┘ ║
   ║                                                              ║
   ║  collection: list                                            ║
   ║  ┌───────┬─────────────────────────────────────────────────┐ ║
   ║  │ "l-1" │ { id:"l-1", name:"Today",   userId:"u-1" }      │ ║
   ║  │ "l-2" │ { id:"l-2", name:"Shopping",userId:"u-1" }      │ ║
   ║  │ "l-3" │ { id:"l-3", name:"Work",    userId:"u-2" }      │ ║
   ║  └───────┴─────────────────────────────────────────────────┘ ║
   ║                                                              ║
   ║  collection: todo                                            ║
   ║  ┌───────┬─────────────────────────────────────────────────┐ ║
   ║  │ "t-1" │ { id:"t-1", text:"buy milk", listId:"l-2" }     │ ║
   ║  │ "t-2" │ { id:"t-2", text:"ship v2",  listId:"l-3" }     │ ║
   ║  │ "t-3" │ { id:"t-3", text:"call mom", listId:"l-1" }     │ ║
   ║  └───────┴─────────────────────────────────────────────────┘ ║
   ║                                                              ║
   ╚══════════════════════════════════════════════════════════════╝
```

Three collections. Each is a Map keyed by id. No nesting between collections — `list` rows store `userId` (a string pointing at a user), not a copy of the user. `todo` rows store `listId`, not a copy of the list. Everything is flat at this layer; the relationships are encoded entirely as id strings.

Why flat is good: changing Ada's name is one write to one row in `user`. The 47 todos that "belong to Ada" don't need to update — they only ever held a pointer (`userId: "u-1"`), and the pointer still resolves to the same updated record. This is the single biggest reason real databases reject nested document storage when the data is genuinely relational. One source of truth per fact, joined at read time.

---

**Prev:** [01 — Records & identity](01-records-and-identity.md) · **Next:** [03 — References](03-references.md)
