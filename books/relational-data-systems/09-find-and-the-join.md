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

**Todo-app queries in `@mswjs/data`, side by side with what they mean.** Every UI screen you've ever built compiles into one of these. Match the call to the screen:

```js
// "Show me all unfinished todos in the Shopping list."
const open = db.todo.findMany({
  where: { done: { equals: false },
           list: { id: { equals: shopping.id } } },
})

// "Get the todo I just tapped, with its list and owner."
const todo = db.todo.findFirst({ where: { id: { equals: 't-uuid-2' } } })
console.log(todo.list.name, todo.owner.name)   // joins auto-resolved

// "Show every todo that's tagged 'urgent'."
const urgentTodos = db.todo.findMany({
  where: { tags: { label: { equals: 'urgent' } } },
})

// "Search bar typing 'milk'."
const matches = db.todo.findMany({
  where: { text: { contains: 'milk' } },
})

// "User profile — give me Ada and everything she owns."
const ada = db.user.findFirst({ where: { name: { equals: 'Ada' } } })
console.log(ada.lists.length, ada.todos.length)  // reverse joins
```

Each line maps mechanically onto a stage of the universal pipeline from Chapter 5.6:

```
   call                            FROM      WHERE                JOIN
   ─────────────────────────       ─────     ──────────────       ─────────────
   findMany on todo (unfinished)   todo      done=false &         (none — flat
                                              list.id=shopping     scalars only)
   findFirst on todo by id         todo      id=t-uuid-2          list, owner
                                                                    (auto)
   findMany on todo by tag         todo      tags.label='urgent'  (engine walks
                                                                    todo → tag)
   findMany on todo by text        todo      text contains 'milk' (none)
   findFirst on user, then .lists  user      name='Ada'           lists, todos
                                                                    (reverse)
```

Once you can see those four columns, the syntax is just decoration. The `where` is a predicate; the relations are edges the engine walks for you.

**The "automatic join" cost.** Convenience hides work. Every `findFirst` on a user with `posts: manyOf('post')` triggers a *scan* of the post collection looking for back-pointers — that's the reverse-join cost from Chapter 5.4. In a test fixture with 50 posts it's invisible; in a stress test with 50,000 it's a noticeable wait. `@mswjs/data` doesn't keep secondary indexes, so for very large mock datasets you sometimes drop down to `findMany` with a `where` on the FK directly, to make the cost legible. The lesson generalises: convenient resolve-on-read is great until the dataset is big enough that you want to pick *which* edges to walk.

---

**Prev:** [08 — create & the store](08-create-and-the-store.md) · **Next:** [10 — update, delete & the caveat](10-update-delete-caveat.md)
