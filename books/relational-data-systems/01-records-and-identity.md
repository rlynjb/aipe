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

**Concretely:** imagine a todo list in your app. Each todo is an object — `{ text: "buy milk", done: false }`. That's the *value* part. But the moment you need to update one specific todo (the user toggles its checkbox), you need a way to say "*this* one, not any of the others." That's identity. A todo without identity is unaddressable — you can render it, but you can't update it, you can't reference it, you can't even know if a re-rendered version is "the same todo, updated" or a brand-new todo that happens to have the same text. Adding `id: "t-1"` fixes all three problems at once.

The frontend pain: every time you've used array-index as a React `key` and then watched the wrong input lose focus when you deleted an item, you've felt identity missing. The relational answer is the same as React's correct answer — a stable, unique key that travels with the record forever.

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

**Why this cost difference matters in real code.** Picture a todo app holding 5,000 todos. The user toggles todo number 3,847. Without identity, the only way to find that todo is to walk the array until you find a match on some combination of fields — `text === "..." && createdAt === ...`. That's O(n) per update, and the comparison is brittle (two todos could share text). With identity, it's `todos.findIndex(t => t.id === "t-3847")` — still O(n) over an array, but O(1) once you put the todos in a `Map` keyed by `id`. The lookup is also unambiguous: there is exactly one match, ever.

Graphs avoided identity historically because most graph algorithms only care about reachability ("can you walk from A to B"), not addressability ("give me node 3,847 now"). Databases are the opposite — almost every operation needs to address a specific record by name. That's why identity is built into every relational primitive from the start.

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

Each superpower maps directly onto a frontend pain you've already had:

```
   ┌──────────────────┬─────────────────────────────────────────────────┐
   │ Superpower       │ Where it shows up in your frontend code         │
   ├──────────────────┼─────────────────────────────────────────────────┤
   │ Direct lookup    │ todosById[todoId] in a Redux/Zustand store      │
   │                  │ instead of todos.find(t => t.id === todoId)     │
   ├──────────────────┼─────────────────────────────────────────────────┤
   │ Stable pointers  │ a "Recently Viewed" sidebar stores [id1, id2,   │
   │                  │ id3] — not copies of the todos. When a todo's   │
   │                  │ text changes, the sidebar shows the new text    │
   │                  │ for free.                                       │
   ├──────────────────┼─────────────────────────────────────────────────┤
   │ Deduplication    │ a server-fetched todo and the optimistically-   │
   │                  │ created local todo end up as the SAME row in    │
   │                  │ the store once they share id="t-1". No dupes,  │
   │                  │ no "did I already render this" check.          │
   └──────────────────┴─────────────────────────────────────────────────┘
```

If you've worked in Redux with `normalizr`, you've already lived this. Normalised state shape (`{ todos: { byId: {...}, allIds: [...] } }`) is just relational thinking applied to client memory. The `byId` map is identity-keyed direct lookup. The `allIds` array is the collection. Pointers between slices use ids, not nested objects. You shipped a relational store and may not have called it that.

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

**A worked example — annotate a todo with the three field types:**

```
   todo
   ╔════════════════════════════════════════════════════════════╗
   ║                                                            ║
   ║   id:         "t-42"        ← PRIMARY KEY  (identity)      ║
   ║                                                            ║
   ║   text:       "buy milk"    ← VALUE FIELD                  ║
   ║   done:       false         ← VALUE FIELD                  ║
   ║   createdAt:  1715000000    ← VALUE FIELD (a timestamp)    ║
   ║                                                            ║
   ║   userId:     "u-1"  ───────► REFERENCE — points at a user ║
   ║   listId:     "l-5"  ───────► REFERENCE — points at a list ║
   ║                                                            ║
   ╚════════════════════════════════════════════════════════════╝
```

Mental rule of thumb: **primitive values stay as value fields; entities go through reference fields.** A todo's text is a string, so it lives on the todo itself. A todo's user is a whole entity with its own identity — so the todo stores the *id* of the user, not a copy of the user. If you embedded a copy, updating Ada's name in one place would leave a stale "Ada" inside every todo's embedded copy. The id approach keeps one source of truth.

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

**Pick the strategy that matches where the id is generated.**

- **Auto-increment** is the database's choice. The client sends `{ text: "buy milk", userId: "u-1" }` without an id; the database assigns `id = 4248` on insert. Pro: small, dense, easy to read in logs. Con: the client can't refer to the record until the response comes back, so optimistic UI needs a temp-id-then-swap step.
- **UUID** is the client's choice. The frontend generates `crypto.randomUUID()` *before* sending, so an optimistic todo can immediately appear in the list with its final id, and the server just accepts it. Pro: no temp-id swap, plays well with offline-first sync. Con: longer, less log-friendly, very slightly more storage.
- **Natural key** uses something already unique in the real world — an email, an ISBN, a Stripe payment intent id. Pro: no separate id needed. Con: real-world identifiers can change (people change emails, books get re-issued), which breaks the *stable* rule. Use natural keys only when the value is truly immutable.

In todo apps, UUIDs are the modern default. In server-rendered CRUD admins, auto-increment is still common. In integrations with third-party systems, the natural key is often forced on you (`stripe_payment_intent_id`).

```
   ┌─────────────────┬───────────────────────────┬────────────────────┐
   │ Strategy        │ Example                   │ Optimistic UI ok?  │
   ├─────────────────┼───────────────────────────┼────────────────────┤
   │ auto-increment  │ id: 4248                  │ needs temp-id swap │
   │ UUID            │ id: "550e8400-e29b-..."   │ yes — id is local  │
   │ natural key     │ id: "ada@example.com"     │ depends on input   │
   └─────────────────┴───────────────────────────┴────────────────────┘
```

---

**Prev:** [00 — Introduction](00-introduction.md) · **Next:** [02 — Collections](02-collections.md)
