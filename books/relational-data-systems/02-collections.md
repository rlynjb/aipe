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


---

**Prev:** [01 — Records & identity](01-records-and-identity.md) · **Next:** [03 — References](03-references.md)
