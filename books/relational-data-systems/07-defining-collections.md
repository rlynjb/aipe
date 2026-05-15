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

**A full todo-app schema, written in @mswjs/data:** here's what the four-collection todo dataset we've been working with looks like as an actual `factory()` call. Every collection from Part I, every reference from Part III, every constraint from Part IV — wired up in one block:

```js
import { factory, primaryKey, oneOf, manyOf } from '@mswjs/data'

export const db = factory({
  // ── user ────────────────────────────────────────────
  user: {
    id:    primaryKey(() => crypto.randomUUID()),
    name:  String,
    email: String,                              // (uniqueness enforced by you)
    lists: manyOf('list'),                      // reverse: lists this user owns
    todos: manyOf('todo'),                      // reverse: todos this user owns
  },

  // ── list ────────────────────────────────────────────
  list: {
    id:    primaryKey(() => crypto.randomUUID()),
    name:  String,
    owner: oneOf('user'),                       // forward FK → user
    todos: manyOf('todo'),                      // reverse: todos in this list
  },

  // ── todo ────────────────────────────────────────────
  todo: {
    id:        primaryKey(() => crypto.randomUUID()),
    text:      String,
    done:      Boolean,
    createdAt: Number,
    list:      oneOf('list'),                   // forward FK → list
    owner:     oneOf('user'),                   // forward FK → user
    tags:      manyOf('tag'),                   // N:M edge (Ch 3.5)
  },

  // ── tag ─────────────────────────────────────────────
  tag: {
    id:    primaryKey(() => crypto.randomUUID()),
    label: String,
    todos: manyOf('todo'),                      // reverse side of the N:M
  },
})
```

Read the schema like a graph diagram and the topology jumps out:

```
   user ──owns──► list ──contains──► todo ◄──tagged──► tag
     │                                 ▲
     └──────────owns──────────────────┘
```

Every arrow in that picture corresponds to either a `oneOf` (the FK side) or a `manyOf` (the reverse side). `oneOf` is a *real* field on the record — it gets stored, it's what enforces referential integrity. `manyOf` is *not* a stored field — it's a synthesised view, "all records on the other side that point at me." When you call `user.todos`, the engine performs the reverse-join from Chapter 5.4 transparently.

**One subtle thing worth calling out** — `@mswjs/data` doesn't enforce all the integrity constraints from Chapter 4 by default. It will assign an id and store the record even if you reference a nonexistent list. This is fine for a mock layer (you control the test data, you don't need full DB rigor), but it means *you* are responsible for keeping referential integrity intact in your seed data. Real databases like Postgres or SQLite enforce these on every write; `@mswjs/data` trusts you.

The takeaway: the **factory call IS your schema, IS your data model, IS your graph topology** — all at once, all in one place. From this single block, the engine builds a `db` object whose shape is mechanically derived from the schema. Chapter 8 looks at what `db` actually contains.

---

**Prev:** [06 — Writing: CRUD](06-writing-crud.md) · **Next:** [08 — create & the store](08-create-and-the-store.md)
