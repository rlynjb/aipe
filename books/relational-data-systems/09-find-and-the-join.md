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


---

**Prev:** [08 — create & the store](08-create-and-the-store.md) · **Next:** [10 — update, delete & the caveat](10-update-delete-caveat.md)
