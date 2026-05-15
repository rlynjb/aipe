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

**Seeding a realistic todo dataset.** Here's the same `create` machinery used to bootstrap a small dev fixture — exactly what you'd put in a `seed.ts` file for tests or local development:

```js
// 1. Make users.
const ada = db.user.create({ name: 'Ada', email: 'ada@x.com' })
const lin = db.user.create({ name: 'Lin', email: 'lin@x.com' })

// 2. Make lists, owned by users (note we pass the whole record).
const inbox    = db.list.create({ name: 'Inbox',    owner: ada })
const shopping = db.list.create({ name: 'Shopping', owner: ada })
const work     = db.list.create({ name: 'Work',     owner: lin })

// 3. Make tags.
const urgent = db.tag.create({ label: 'urgent' })
const home   = db.tag.create({ label: 'home' })

// 4. Make todos pinned to a list, owned by a user, optionally tagged.
db.todo.create({
  text: 'buy milk', done: false, createdAt: Date.now(),
  list: shopping, owner: ada, tags: [home],
})
db.todo.create({
  text: 'ship v2',  done: false, createdAt: Date.now(),
  list: work,      owner: lin, tags: [urgent],
})
db.todo.create({
  text: 'call mom', done: true,  createdAt: Date.now(),
  list: inbox,     owner: ada,
})
```

After those eight calls, the in-memory state is exactly the four-Map database we drew at the end of Chapter 2 — except the engine generated all the UUIDs and rewired every "passed the whole record" into "stored as a key reference." Watch the transformation for the second todo:

```
   what you wrote                  what the engine actually stored
   ──────────────────────          ──────────────────────────────────────
   db.todo.create({                todo Map . "t-uuid-2" → {
     text:  'ship v2',               id:        "t-uuid-2",
     done:  false,                   text:      "ship v2",
     createdAt: 17150...,            done:      false,
     list:  work,           ──►      createdAt: 17150...,
     owner: lin,                     list:      ⟶ "l-uuid-work",
     tags:  [urgent],                owner:     ⟶ "u-uuid-lin",
   })                                tags:      [⟶ "tag-uuid-urgent"]
                                   }
```

Everything you passed as a "whole record" got *flattened to its id*. The engine does this on every reference field — the schema you wrote in Chapter 7 told it which fields are FKs, so at write time it knows to extract the key. The ergonomics of "just pass the record" sit on top of the storage reality of "we keep ids only."

**The factory pattern this enables.** Notice how clean test setup becomes: you describe a tiny world with a few `create` calls, you don't have to invent ids, you don't have to keep them straight, you don't have to remember which field name holds the FK. The engine accepts entities and produces entities; the references are an internal detail. This is why `@mswjs/data` is such an ergonomic choice for tests — your fixtures read like the domain, not like SQL.

---

**Prev:** [07 — Defining collections](07-defining-collections.md) · **Next:** [09 — find & the join](09-find-and-the-join.md)
