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


---

**Prev:** [07 — Defining collections](07-defining-collections.md) · **Next:** [09 — find & the join](09-find-and-the-join.md)
