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


---

**Prev:** [06 — Writing: CRUD](06-writing-crud.md) · **Next:** [08 — create & the store](08-create-and-the-store.md)
