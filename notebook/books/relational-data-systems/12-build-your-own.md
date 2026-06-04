# PART V — BUILD YOUR OWN

You really learned graphs by **implementing the Graph class yourself.** So here's a relational store from scratch — no library — implementing Parts I–III. `@mswjs/data` is a more featureful version of this same ~120 lines.

**How to read the code below.** Each method is labelled with the chapter it implements. Read them in this order to mirror the book's structure: `Collection` and `Database` (Parts I–II — the primitives and the storage), `create` (Part II's invariants enforced on a write), `findById` and `findMany` (Part III reads), `resolve` (the join), and finally `update` / `delete` (the dangerous writes plus the policy engine).

The code is deliberately bare: no indexes, no transactions, no async. It is small enough that you can hold every line in your head — which is exactly what makes it a teaching artefact. Once you can read this file top to bottom and predict what each method does, you can read `@mswjs/data`'s source, or Prisma's query engine, or any toy ORM tutorial, with the same shape already in your head.

```js
// ============================================================
//  A relational data system from scratch.
//  Parts I-III of the spec book, implemented.
// ============================================================

// ---- PART I: PRIMITIVES ------------------------------------

class Collection {
  // a collection IS a primary-key-keyed dictionary (Chapter 2.1)
  constructor(name, schema) {
    this.name    = name        // collection name
    this.schema  = schema      // { field: { type, ref?, isPrimaryKey? } }
    this.store   = new Map()   // Map<primaryKey, record>  ← THE store
    this.pkField = Object.keys(schema)
      .find(f => schema[f].isPrimaryKey)   // which field is identity
  }
}

class Database {
  // the database is a bag of collections (Chapter 2.5)
  constructor() { this.collections = {} }

  defineCollection(name, schema) {
    this.collections[name] = new Collection(name, schema)
    return this   // chainable, like a builder
  }
}

// ---- PART III: OPERATIONS ----------------------------------

// ---- CREATE (Chapter 6.1): validate -> enforce -> commit ---
Database.prototype.create = function (collName, input) {
  const coll   = this.collections[collName]
  const record = { ...input }

  // entity integrity (Ch 4.1): every record needs a primary key
  const pk = record[coll.pkField]
  if (pk == null)            throw new Error('record has no primary key')
  if (coll.store.has(pk))    throw new Error(`duplicate key ${pk}`)

  // referential integrity (Ch 4.2): every reference must resolve
  for (const [field, def] of Object.entries(coll.schema)) {
    if (def.ref && record[field] != null) {
      const target = this.collections[def.ref]
      if (!target.store.has(record[field]))
        throw new Error(`dangling reference: ${field} -> ${record[field]}`)
    }
  }

  // commit — the only step that touches data
  coll.store.set(pk, record)
  return record
}

// ---- READ: lookup by key (Chapter 5.1) ---------------------
Database.prototype.findById = function (collName, key) {
  return this.collections[collName].store.get(key) ?? null
}

// ---- READ: filter by predicate (Chapter 5.2) ---------------
Database.prototype.findMany = function (collName, predicate = () => true) {
  const coll = this.collections[collName]
  const out  = []
  for (const record of coll.store.values()) {   // iterate the values
    if (predicate(record)) out.push(record)      // keep matches
  }
  return out
}

// ---- READ: resolve references = the JOIN (Ch 5.3 - 5.4) ----
Database.prototype.resolve = function (collName, record) {
  const coll     = this.collections[collName]
  const resolved = { ...record }

  for (const [field, def] of Object.entries(coll.schema)) {
    if (!def.ref) continue

    if (def.many) {
      // REVERSE relation: SCAN the other collection (Ch 5.4)
      // "all records in def.ref whose `def.backref` points at me"
      const myPk = record[coll.pkField]
      resolved[field] = this.findMany(def.ref,
        r => r[def.backref] === myPk)
    } else {
      // FORWARD relation: ONE lookup, follow the edge (Ch 5.3)
      const key = record[field]
      resolved[field] = key == null
        ? null
        : this.findById(def.ref, key)
    }
  }
  return resolved
}

// ---- UPDATE (Chapter 6.2): identity never changes ----------
Database.prototype.update = function (collName, key, changes) {
  const coll     = this.collections[collName]
  const existing = coll.store.get(key)
  if (!existing) throw new Error(`no record ${key}`)
  if (coll.pkField in changes)
    throw new Error('cannot change a primary key')   // Ch 1.5
  const updated = { ...existing, ...changes }
  // (a full impl re-checks referential integrity here)
  coll.store.set(key, updated)
  return updated
}

// ---- DELETE (Chapter 6.3): apply the delete policy ---------
Database.prototype.delete = function (collName, key, policy = 'restrict') {
  const coll = this.collections[collName]

  // step 2: find INCOMING edges — who references this record?
  const referrers = []
  for (const other of Object.values(this.collections)) {
    for (const [field, def] of Object.entries(other.schema)) {
      if (def.ref === collName && !def.many) {
        for (const rec of other.store.values()) {
          if (rec[field] === key) referrers.push({ other, field, rec })
        }
      }
    }
  }

  // step 3: apply the policy (Ch 4.4)
  if (referrers.length) {
    if (policy === 'restrict')
      throw new Error(`cannot delete ${key}: ${referrers.length} referrers`)
    if (policy === 'cascade')
      for (const { other, rec } of referrers)
        this.delete(other.name, rec[other.pkField], 'cascade')  // recursion
    if (policy === 'setNull')
      for (const { other, field, rec } of referrers)
        this.update(other.name, rec[other.pkField], { [field]: null })
  }

  // step 4: remove the record
  coll.store.delete(key)
}

// ============================================================
//  USING IT — the same shape as @mswjs/data, by hand
// ============================================================

const db = new Database()
  .defineCollection('team', {
    id:   { isPrimaryKey: true },
    name: { type: 'string' },
  })
  .defineCollection('user', {
    id:     { isPrimaryKey: true },
    name:   { type: 'string' },
    teamId: { ref: 'team' },                                    // forward ref
    posts:  { ref: 'post', many: true, backref: 'authorId' },   // reverse rel
  })
  .defineCollection('post', {
    id:       { isPrimaryKey: true },
    title:    { type: 'string' },
    authorId: { ref: 'user' },                                  // forward ref
  })

db.create('team', { id: 't-1', name: 'Core' })
db.create('user', { id: 'u-1', name: 'Ada', teamId: 't-1' })
db.create('post', { id: 'p-1', title: 'Hello', authorId: 'u-1' })
db.create('post', { id: 'p-2', title: 'Again', authorId: 'u-1' })

// lookup by key — O(1)
db.findById('user', 'u-1')
// → { id:'u-1', name:'Ada', teamId:'t-1' }

// filter by predicate — array.filter() over the Map's values
db.findMany('post', p => p.title.startsWith('H'))
// → [ {…Hello…} ]

// resolve — the JOIN: forward edge + reverse scan, multi-hop
const ada = db.resolve('user', db.findById('user', 'u-1'))
// → {
//     id:'u-1', name:'Ada',
//     teamId: { id:'t-1', name:'Core' },        ← forward join resolved
//     posts:  [ {…Hello…}, {…Again…} ],         ← reverse relation scanned
//   }

// delete with a policy — try to remove a referenced team
db.delete('team', 't-1', 'restrict')   // throws: u-1 still references it
db.delete('team', 't-1', 'setNull')    // ok: u-1.teamId becomes null
```

```
   ┌─────────────────────────────────────────────────────────────┐
   │  if you internalize that file, you understand @mswjs/data.   │
   │                                                              │
   │  the library adds:                                           │
   │    • nicer ergonomics  db.user.create() vs db.create('user') │
   │    • more query operators                                    │
   │    • INDEXES for fast reverse lookups (Appendix A)           │
   │    • the toHandlers msw bridge (Chapter 11)                  │
   │                                                              │
   │  but the SKELETON is this — keyed dictionaries, predicate    │
   │  filters, reference resolution, delete policies.             │
   └─────────────────────────────────────────────────────────────┘
```

**Apply the build-your-own to the todo app.** Take the same engine and run the todo schema through it — note how all four chapter-by-chapter pieces re-appear in less than 20 lines of setup:

```js
const db = new Database()
  .defineCollection('user', {
    id:    { isPrimaryKey: true },
    name:  { type: 'string' },
    email: { type: 'string' },
    todos: { ref: 'todo', many: true, backref: 'userId' },   // reverse rel
    lists: { ref: 'list', many: true, backref: 'userId' },   // reverse rel
  })
  .defineCollection('list', {
    id:     { isPrimaryKey: true },
    name:   { type: 'string' },
    userId: { ref: 'user' },                                  // forward FK
    todos:  { ref: 'todo', many: true, backref: 'listId' },   // reverse rel
  })
  .defineCollection('todo', {
    id:     { isPrimaryKey: true },
    text:   { type: 'string' },
    done:   { type: 'boolean' },
    userId: { ref: 'user' },                                  // forward FK
    listId: { ref: 'list' },                                  // forward FK
  })

db.create('user', { id: 'u-1', name: 'Ada',  email: 'a@x.com' })
db.create('list', { id: 'l-1', name: 'Shop', userId: 'u-1' })
db.create('todo', { id: 't-1', text: 'milk', done: false,
                     userId: 'u-1', listId: 'l-1' })

const ada = db.resolve('user', db.findById('user', 'u-1'))
// → { id:'u-1', name:'Ada', email:'a@x.com',
//     todos: [ {…milk…} ],
//     lists: [ {…Shop…} ] }

db.delete('user', 'u-1', 'cascade')
// → recursively deletes the list (and its todo, via cascade depth-2)
```

Every concept from this book is present in those lines: identity (Part I), collections (Part II), references and relations (Part III), the integrity invariants (Part II — `create` rejected if the FK didn't resolve), reading by id and by predicate (Chapter 5), reverse joins via `backref` (Chapter 5.4), and the delete policy engine running through two levels of cascade (Chapter 4.4). About 120 lines of engine, a few lines of schema, and you have a working relational data system — exactly what `@mswjs/data` ships and what Postgres provides with durability, transactions, and a network protocol added.

---

# APPENDIX

## A. Indexes — turning the O(n) reverse scan back into O(1)

```
   THE PROBLEM (Chapter 5.4):
   "all posts by user u-1" means SCANNING the whole post store.
   O(n). slow when there are 100,000 posts.

   THE FIX: keep an extra Map alongside the collection — an INDEX.

   post store (the data)            index on authorId (the shortcut)
   ┌──────────────────────┐         ┌──────────────────────────────┐
   │ p-1 authorId:"u-1"   │         │ "u-1"  →  [ p-1, p-3 ]       │
   │ p-2 authorId:"u-2"   │         │ "u-2"  →  [ p-2 ]            │
   │ p-3 authorId:"u-1"   │         └──────────────────────────────┘
   └──────────────────────┘                    ▲
                                               │
   "posts by u-1" → index.get("u-1") → [p-1,p-3]   O(1) again!

   the cost: every create/update/delete must ALSO update the index.
   (this is the classic space + write-cost vs. read-speed tradeoff —
    you've seen it: it's a hash map memoizing a graph adjacency query.)

   frontend bridge: it's the same move as building a lookup object —
     const byAuthor = _.groupBy(posts, 'authorId')
   ...except the database keeps it in sync for you.
```

**An index in the todo app, drawn.** For the "todos in this list" query — the most common reverse-join in the whole UI — adding one auxiliary map collapses the cost from "scan every todo in the database" to "look up one list-id":

```
   todo store (the data)                  index on listId (the shortcut)
   ┌───────────────────────────────┐      ┌─────────────────────────────────┐
   │ t-1  listId:"l-1"  "buy milk" │      │ "l-1"  →  [ t-1, t-4 ]           │
   │ t-2  listId:"l-2"  "ship v2"  │      │ "l-2"  →  [ t-2 ]                │
   │ t-3  listId:"l-3"  "call mom" │      │ "l-3"  →  [ t-3 ]                │
   │ t-4  listId:"l-1"  "eggs"     │      └─────────────────────────────────┘
   └───────────────────────────────┘
                                              "todos in list l-1"
                                              → index.get("l-1")
                                              → [t-1, t-4]   O(1)

   what each todo write must ALSO do:
     create(todo)  → push the new id into index[listId]
     update.listId → remove from old bucket, add to new bucket
     delete(todo)  → remove the id from index[listId]
```

The cost moves from read-time to write-time — and since reads vastly outnumber writes in any UI, the trade is overwhelmingly worth it. Real databases let you declare `CREATE INDEX todo_listId_idx ON todo(listId)` and the engine maintains exactly this map for you, hidden behind the scenes. You don't write the bookkeeping; you just notice that the query got fast.

## B. The Rosetta Stone — Frontend / DSA  ↔  Relational

```
   ┌─────────────────────────────┬──────────────────────────────┬─────────────────────┐
   │ YOU ALREADY KNOW (left)     │ RELATIONAL WORLD             │ NOTES               │
   ├─────────────────────────────┼──────────────────────────────┼─────────────────────┤
   │ object in an array          │ record / row                 │ atomic data object  │
   │ React `key` prop / node id  │ primary key                   │ identity            │
   │ Map<id, item>               │ collection / table            │ keyed store         │
   │ array of items              │ collection                    │ same thing, indexed │
   │ TS interface                │ schema                        │ but enforced at     │
   │                             │                               │ WRITE time          │
   │ passing an `id` prop        │ reference / foreign key       │ edge, stored as key │
   │ passing the whole object    │ containment (NOT relational)  │ the thing rel.      │
   │                             │                               │ data avoids         │
   │ graph edge                  │ foreign key                   │ directed            │
   │ neighbor lookup             │ resolving a reference (join)  │ "follow the edge"   │
   │ out-edges of a node         │ forward relations             │ O(1) each           │
   │ in-edges of a node          │ reverse relations             │ scan, or indexed    │
   │ BFS / DFS                   │ a multi-hop query / join chain│ "which edges to walk│
   │ adjacency list              │ the set of foreign keys       │ physical storage    │
   │ array.filter()              │ findMany + where predicate    │ identical operation │
   │ array.find()                │ findFirst / findById          │ identical operation │
   │ _.groupBy()                 │ an index                      │ the read shortcut   │
   │ tree/DAG invariants         │ integrity constraints         │ keep structure valid│
   │ delete node + its edges     │ delete + CASCADE/SET NULL/    │ fate of incident    │
   │                             │ RESTRICT                      │ edges               │
   │ typed nodes in a graph      │ multiple collections          │ node has a "type"   │
   │ Memgraph                    │ Postgres / @mswjs/data        │ graph DB = explicit │
   │                             │                               │ graph; relational DB│
   │                             │                               │ = graph behind      │
   │                             │                               │ tables              │
   └─────────────────────────────┴──────────────────────────────┴─────────────────────┘
```

## C. Glossary

- **Record** — one uniquely-identifiable data object. A row. A node. (Frontend: one object in an array.)
- **Primary key** — the field holding a record's permanent, unique identity. (Frontend: React's `key` prop, made permanent.)
- **Collection** — a group of same-shape records, stored as a dictionary keyed by primary key. A table.
- **Schema** — the field-and-type definition of a collection. (Frontend: a TS interface the DB actually enforces.)
- **Reference / Foreign key** — a field whose value is the primary key of a record in another collection. A directed edge. (Frontend: passing an `id` instead of the whole object.)
- **Containment** — nesting the actual related object inside a record. What relational data deliberately *avoids*. (Frontend: passing the whole object down as a prop.)
- **Resolve** — to follow a reference: take the stored key, look it up, get the actual record.
- **Join** — assembling a result by resolving references — splicing related records together.
- **Forward relation** — a reference physically stored on this record; resolved with one O(1) lookup.
- **Reverse relation** — "records elsewhere that point at me"; found by scanning (or via an index). Stored nowhere on this record.
- **Cardinality** — the shape of a relationship: one-to-one, one-to-many, many-to-many.
- **Junction / join collection** — a third collection whose records are pairings; how many-to-many is built from two one-to-manys.
- **Entity integrity** — invariant: every record has a unique, non-null primary key.
- **Referential integrity** — invariant: every reference points at a record that actually exists.
- **Dangling reference** — a foreign key whose target no longer exists; a broken edge. (DSA: a graph edge whose endpoint was deleted.)
- **Delete policy** — the rule (RESTRICT / CASCADE / SET NULL) for what happens to incoming edges when a referenced record is deleted.
- **Predicate** — a `Record → boolean` function; what a `where` clause builds. (Frontend: the callback you pass to `.filter()`.)
- **Index** — an auxiliary `Map` (e.g. `Map<authorId, postId[]>`) that turns an O(n) reverse scan into O(1). (Frontend: a `_.groupBy()` the DB keeps in sync.)
- **`factory`** (`@mswjs/data`) — builds the database object from your schemas.
- **`primaryKey`** (`@mswjs/data`) — declares the identity field and its key-generation function.
- **`oneOf` / `manyOf`** (`@mswjs/data`) — declare a forward reference / a reverse (or many) relation.
- **`toHandlers`** (`@mswjs/data`) — converts a model's CRUD operations into msw HTTP request handlers.

## D. Exercises — do these the way you did graph problem sets

```
   1. IDENTITY
      take your old Tree node class. add a stable `id` field and
      store nodes in a Map<id, Node> alongside the tree structure.
      implement getNodeById in O(1). notice: no more traversal.

   2. REFERENCE vs CONTAINMENT
      model a blog two ways:
        (a) posts with authors NESTED inside them
        (b) posts with authorId REFERENCING a user collection
      rename an author in both. COUNT THE WRITES.

   3. REVERSE RELATION + INDEX
      using the Part V code, implement getPostsByAuthor WITHOUT
      the resolve helper — write the scan by hand. then add an
      index Map<authorId, postId[]> and make it O(1).

   4. CARDINALITY
      model students & courses (many-to-many). implement the
      `enrollment` junction collection. write "all courses for a
      student" AND "all students in a course" — note they're
      symmetric.

   5. DELETE POLICIES
      in the Part V code, create a team with three users. delete
      the team with each of restrict / cascade / setNull. PREDICT
      the resulting state before running it.

   6. TRAVERSAL = QUERY
      write a function that, given a post id, returns
      { title, authorName, teamName } by following two edges.
      you just wrote a 3-collection join as a depth-first traversal.

   7. @mswjs/data PARITY
      rebuild exercise 2(b) using REAL @mswjs/data — factory,
      primaryKey, oneOf. confirm the mental model holds:
      same primitives, nicer API.

   8. THE BRIDGE
      add toHandlers('rest') to the exercise-7 database, point an
      msw server at it, fetch('/posts/:id') from a test. trace the
      request through Chapter 11's round-trip diagram.
```

---

```
   ┌─────────────────────────────────────────────────────────────┐
   │  END OF SPEC BOOK.                                           │
   │                                                              │
   │  Parts I-III are UNIVERSAL — they describe Postgres,        │
   │  SQLite, Memgraph's relational cousins, and @mswjs/data     │
   │  equally.                                                    │
   │  Part IV is the ONE concrete engine.                        │
   │  Part V is the proof you could BUILD it — which, the same   │
   │  way it did for graphs, is what turns "I read about it"     │
   │  into "I understand it under the hood."                     │
   │                                                              │
   │  the load-bearing idea, one more time:                       │
   │                                                              │
   │     a relational dataset IS a directed graph.                │
   │     records are nodes. foreign keys are edges.               │
   │     queries are traversals.                                  │
   │                                                              │
   │  that's why Memgraph clicked. now relational clicks too.    │
   └─────────────────────────────────────────────────────────────┘
```

---

**Prev:** [11 — the msw bridge](11-the-msw-bridge.md)
