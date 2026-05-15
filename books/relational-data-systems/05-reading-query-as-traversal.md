# PART III — THE OPERATIONS

You have primitives (Part I) and invariants (Part II). Now: what do you DO with the data? **CRUD** — create, read, update, delete. The key insight: **reads are graph traversals.** That's the lens for the whole part.

---

## Chapter 5 — Reading: Query as Traversal

### 5.1 The atom — lookup by primary key

```
   findById(user, "u-1")
         │
         ▼
   ┌─────────────────────────────┐
   │ user store . get("u-1")     │
   └─────────────────────────────┘
         │
         ▼
   { id:"u-1", name:"Ada", age:36 }

   ONE dictionary hit. O(1).
   "I know the node's label — give me the node."
   EVERY more complex read decomposes into a bunch of these.
```

### 5.2 Filtering — iterate & keep what matches a predicate

```
   findMany(user, where age >= 30)

   user store values:                        for each, run the PREDICATE
   ┌─────────────────────┐
   │ {u-1, "Ada", 36}  ──┼──►  age >= 30 ?  ──►  36 >= 30   ✓  KEEP
   │ {u-2, "Lin", 28}  ──┼──►  age >= 30 ?  ──►  28 >= 30   ✗  drop
   │ {u-3, "Sam", 41}  ──┼──►  age >= 30 ?  ──►  41 >= 30   ✓  KEEP
   └─────────────────────┘
                                                    │
                                                    ▼
                                            [ {Ada}, {Sam} ]

   O(n) over the collection.
   a PREDICATE is just a function:  Record ──► boolean
   "WHERE clauses", "filters", "query operators" are all just
   ways of BUILDING that function.

   operators you'll meet (all compile to a predicate):
     equals   notEquals   gt  gte  lt  lte
     contains   startsWith   (strings)
     in   (membership)
```

> **Frontend bridge:** `findMany` with a predicate **is `array.filter()`**. You already know this operation cold. The only new thing is it runs over a `Map`'s values instead of an array.

**In the todo app:** every "filtered list" UI you've built — the Today view, the unfinished-only view, the search-by-text view — is a `findMany` with a predicate. The translation is mechanical:

```
   UI feature                                Predicate
   ─────────────────────────────────         ──────────────────────────────────
   "Show me today's todos"                   todo => sameDay(todo.createdAt, today)
   "Show me unfinished todos"                todo => todo.done === false
   "Show me todos with 'milk' in the text"   todo => todo.text.includes("milk")
   "Show me todos due in the next 7 days"    todo => todo.dueAt < now + 7d
                                                 && todo.dueAt > now
```

Every UI surface that shows a *subset* of records compiles down to one of these. When you stack two filters together (the user is on the Today tab AND searching for "milk"), you're composing predicates with AND — the underlying mechanism is unchanged, still a single scan over the collection. SQL's `WHERE a AND b` and your `.filter(t => a(t) && b(t))` are the same operation, dressed differently.

### 5.3 THE JOIN — resolving a reference (the key operation)

A join is: **read a foreign key → ONE lookup in another collection → splice the result in.** Watch it frame by frame:

```
   getPostWithAuthor("p-1")

   ┌─ STEP 1 ─ fetch the post ──────────────────────────────────┐
   │   post store . get("p-1")                                   │
   │   → { id:"p-1", title:"Hello", authorId:"u-1" }            │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ STEP 2 ─ notice authorId is a REFERENCE field ────────────┐
   │   (the SCHEMA told us so — it's typed as → user)           │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ STEP 3 ─ follow the edge — resolve the key ───────────────┐
   │   take "u-1"  ──►  user store . get("u-1")    ◄── O(1)     │
   │              ──►  { id:"u-1", name:"Ada" }                 │
   └────────────────────────────────────────────────────────────┘
                            │
   ┌─ STEP 4 ─ assemble the joined result ──────────────────────┐
   │   { id:"p-1", title:"Hello",                               │
   │     author: { id:"u-1", name:"Ada" } }                     │
   │              ▲                                              │
   │              └─ the STRING "u-1" has been REPLACED by      │
   │                 the actual record it pointed at            │
   └────────────────────────────────────────────────────────────┘

   drawn as the edge-walk it is:

      post p-1                       user u-1
      ┌───────────────┐   resolve    ┌──────────────┐
      │ authorId:"u-1" │ ───────────► │ id:"u-1"     │
      └───────────────┘  (walk the   │ name:"Ada"   │
                          edge)      └──────────────┘
                                            │
                              spliced into the result
                                            ▼
                  { title:"Hello", author:{ name:"Ada" } }

   this is EXACTLY "visit node, follow edge to neighbor" from
   graph traversal. forward join = one edge = O(1).
```

**The todo-app version, made concrete:** every detail screen you've ever built is a forward join. A todo's detail view shows the todo itself, but also the name of the list it belongs to and the email of the user who owns it. Three collections touched. Two foreign keys followed. The UI doesn't need to know about joins — it just needs the assembled object.

```
   UI screen                          Joins to assemble it
   ───────────────────────────        ──────────────────────────────────────
   "Todo detail card"                 todo  +  list (via listId)
                                              +  user (via userId)
   "List page header"                 list  +  user (via userId)
   "Comment in a todo thread"         comment +  user (via authorId)
                                              +  todo (via todoId)
```

The forward join is cheap because the FK is *on* the record you already have — you read it, you look up the target by primary key, you're done. O(1) per edge followed. The whole reason your "todo detail" page renders in 5ms instead of 500ms is that none of those three collections has to be *scanned* — each one is hit by id.

A useful mental model: **the foreign key is a precomputed address.** When the todo was written, the engine made sure `userId: "u-1"` referred to an actual user. At read time, you don't search for the user — you go directly to `user.get("u-1")`. The work was done at write time so reads stay fast.

### 5.4 The reverse join — scanning for incoming edges

```
   getPostsByUser("u-1")

   the user record stores NOTHING about posts.
   so: SCAN the post store, keep posts pointing back at u-1.

   post store:
   ┌──────────────────────────────────┐
   │ p-1   authorId:"u-1"   ──────  ✓ │
   │ p-2   authorId:"u-2"   ──────  ✗ │
   │ p-3   authorId:"u-1"   ──────  ✓ │
   └──────────────────────────────────┘
                  │
                  ▼
            [ p-1, p-3 ]

   O(n) over posts.
   "find all edges that END AT u-1."

   ┌──────────────────────────────────────────────────────────┐
   │  a real DB keeps an INDEX:  Map<authorId, postId[]>      │
   │                                                           │
   │     "u-1" → [p-1, p-3]                                    │
   │     "u-2" → [p-2]                                         │
   │                                                           │
   │  → turns the O(n) scan back into an O(1) lookup.         │
   │  (see Appendix A.)                                        │
   └──────────────────────────────────────────────────────────┘
```

**Why this matters in a todo app:** *almost every list screen is a reverse join.* The sidebar of "your lists" is `list.findMany(where userId = me)`. The body of a list page is `todo.findMany(where listId = current)`. The "todos assigned to me" inbox is `todo.findMany(where assignedUserId = me)`. None of these can be answered by following a foreign key from the user record — the user record doesn't *contain* the list of lists. So the engine has to look the other direction.

```
   Reverse-join UI                      What it scans for
   ───────────────────────────────      ─────────────────────────────────
   "My lists" sidebar                   list rows where userId = me
   "Todos in this list" body            todo rows where listId = current
   "My inbox" / "assigned to me"        todo rows where assignedUserId = me
   "Comments on this todo"              comment rows where todoId = this
```

Without an index, each of these is O(n) over the *whole* collection. A user with 10 lists and 5,000 todos doesn't notice. A team workspace with 200,000 todos absolutely does — opening a list would scan every todo on the planet to find the dozen that belong to it.

This is why every real database (Postgres, SQLite, even `@mswjs/data` once you opt in) lets you declare an **index on the foreign key**. The engine maintains a side-map: `Map<userId, todoId[]>` — and every write keeps it in sync. The reverse-join now costs the same as a forward join: one dictionary hit. The cost gets paid at write time (each insert/update of a todo updates the index), which is the right trade — reads happen far more often than writes in a todo UI.

### 5.5 Multi-hop traversal — joins compose into deep walks

```
   "give me post p-1, its author, and that author's team"

      p-1 ──authorId──► u-1 ──teamId──► t-2
       │                │               │
     post             user            team
   {title:"Hello"}  {name:"Ada"}    {name:"Core"}

   walk it:
   ┌──────────┐   follow    ┌──────────┐   follow    ┌──────────┐
   │  post    │   authorId  │  user    │   teamId    │  team    │
   │  p-1     │ ──────────► │  u-1     │ ──────────► │  t-2     │
   │          │   O(1)      │          │   O(1)      │          │
   └──────────┘             └──────────┘             └──────────┘

   result — a nested object assembled by walking 2 edges:
   {
     title: "Hello",
     author: {
       name: "Ada",
       team: { name: "Core" }
     }
   }

   3 collections. 2 edges followed. each O(1).
   THIS IS DEPTH-FIRST TRAVERSAL of the data graph.
   a "query" just describes WHICH edges to walk.
```

**A todo-app multi-hop, drawn end-to-end:** imagine your app's "expanded todo" UI — you tap a todo and it slides open to show the todo text, the list it belongs to, the user who owns the list, and the tags attached to the todo. That single screen is a four-collection walk:

```
   todo t-42  ──listId──►   list l-5   ──userId──►   user u-1
                                                       │
                                                       └─ owner: Ada

   todo t-42  ──todoId────────────────────► tag_link rows
                                              │
                                              └── tagId ──► tag rows
                                                              │
                                                              └─ "urgent", "groceries"
```

Two distinct walks fanning out from the same todo: one chain (todo → list → user) is a series of forward joins, each O(1). The other branch (todo → tag_link → tag) is a *reverse* join (find all tag-links pointing at t-42) followed by a forward join (look up each tag). Indexed correctly, even this whole composite costs only a handful of dictionary hits.

Notice the result shape mirrors the walk. The JSON the UI consumes is a tree:

```
   {
     id: "t-42",
     text: "buy milk",
     list: {
       name: "Shopping",
       owner: { name: "Ada" }
     },
     tags: [{ name: "urgent" }, { name: "groceries" }]
   }
```

Each level of nesting in that JSON corresponds to one edge that was walked. This is the secret behind GraphQL's appeal — a GraphQL query *literally describes* which edges to walk, and the resolver mechanically follows them. The shape of the response matches the shape of the query, because both are descriptions of the same traversal.

### 5.6 The universal read pipeline

```
   EVERY read — no matter how complex — is this 4-stage pipeline:

   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  START   │    │  FILTER  │    │ RESOLVE  │    │  SHAPE   │
   │          │───►│          │───►│          │───►│          │
   │ pick a   │    │ keep     │    │ follow   │    │ select   │
   │ collec-  │    │ records  │    │ reference│    │ which    │
   │ tion     │    │ matching │    │ edges to │    │ fields   │
   │          │    │ predicate│    │ other    │    │ to       │
   │          │    │          │    │ records  │    │ return   │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘
       ▲                ▲               ▲               ▲
       │                │               │               │
     "FROM"          "WHERE"          "JOIN"          "SELECT"
    (Ch 5.1)         (Ch 5.2)        (Ch 5.3-5.5)    (pick fields)

   see those 4 stages and you can read ANY query in ANY system —
   SQL, @mswjs/data, Memgraph's MATCH, a GraphQL resolver.
```

**Mapping a real todo-app query onto the four stages:** "show me the unfinished todos in my Shopping list, with the assignee's name." Translate it stage by stage:

```
   STAGE        Concrete operation for this query
   ──────       ────────────────────────────────────────────────
   START        from the "todo" collection
   FILTER       where listId = "l-2" AND done = false
   RESOLVE      for each todo, follow assignedUserId → user
   SHAPE        return { text, dueAt, assignee: { name } }
```

The same four stages handle the same query in four different systems:

```
   SQL                                  JS / @mswjs/data
   ────                                 ────────────────
   SELECT t.text, t.dueAt,              db.todo.findMany({
          u.name as assignee            │  where: { listId: { equals: "l-2" },
   FROM todo t                          │            done:   { equals: false } },
   JOIN user u ON u.id = t.userId       │  include: { assignedUser: true }
   WHERE t.listId = 'l-2'               │ })
     AND t.done   = false               │ .map(t => ({ text: t.text,
                                        │              dueAt: t.dueAt,
                                        │              assignee: { name: t.assignedUser.name } }))

   GraphQL                              Cypher / Memgraph MATCH
   ───────                              ───────────────────────
   query {                              MATCH (t:Todo)-[:ASSIGNED_TO]->(u:User)
     todos(where:{                      WHERE t.listId = "l-2" AND t.done = false
       listId:"l-2", done:false}) {     RETURN t.text, t.dueAt, u.name
       text dueAt
       assignee { name }
     }
   }
```

Different syntax, identical traversal. Once you can see "FROM → WHERE → JOIN → SELECT" inside any of these, the syntax stops mattering and you're reading the underlying graph walk directly. That fluency is the whole reason Part III exists — *reads are traversals, queries are walk descriptions.*

---


---

**Prev:** [04 — Integrity constraints](04-integrity-constraints.md) · **Next:** [06 — Writing: CRUD](06-writing-crud.md)
