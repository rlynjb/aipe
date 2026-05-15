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


---

**Prev:** [00 — Introduction](00-introduction.md) · **Next:** [02 — Collections](02-collections.md)
