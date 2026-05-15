# Relational Data Systems — The Visual Edition

A diagram-first foundation for a frontend developer who already knows DSA. Built the way you learned graphs and trees — but you can SEE every mechanic move.

This book is split from [`prompts/relational-data-systems-spec-visual.md`](../../prompts/relational-data-systems-spec-visual.md) into chapter files. Source content is unchanged; the split is for navigation. Read linearly — each part only uses the part to its left.

## Whole book in one picture

```
   PART I        PART II         PART III        PART IV       PART V
   primitives    invariants      operations      the engine    build it
   ┌────────┐    ┌────────┐      ┌────────┐      ┌────────┐    ┌────────┐
   │ record │    │ entity │      │ create │      │ @mswjs │    │  ~120  │
   │ collec-│ →  │ integ. │  →   │ read   │  →   │ /data  │ →  │  lines │
   │ tion   │    │ ref.   │      │ update │      │ mapped │    │  from  │
   │ ref.   │    │ integ. │      │ delete │      │ to I-III│   │ scratch│
   └────────┘    └────────┘      └────────┘      └────────┘    └────────┘
   "node,edge"   "tree must     "traversal"     one real      "implement
                  be acyclic"                    system        the class"
```

## Reading order

### Front matter

- [00 — Introduction](00-introduction.md) — who this is for, how to read it

### Part I — The primitives

- [01 — Records & identity](01-records-and-identity.md) — primary keys, three superpowers, common confusions
- [02 — Collections](02-collections.md) — same-shape records grouped, the inverted index, three operations
- [03 — References — THE NEW IDEA](03-references.md) — keys pointing at keys, cardinality, the universal mapping (records = nodes, foreign keys = edges)

### Part II — The invariants

- [04 — Integrity constraints](04-integrity-constraints.md) — entity integrity, referential integrity, the three delete policies

### Part III — The operations

- [05 — Reading: query as traversal](05-reading-query-as-traversal.md) — `findFirst`, `findMany`, the automatic join, filters as edges
- [06 — Writing: create, update, delete](06-writing-crud.md) — the four CRUD primitives and how each one respects the invariants

### Part IV — The engine: `@mswjs/data` under the hood

- [07 — Defining collections: `factory`](07-defining-collections.md)
- [08 — `create` and the in-memory store](08-create-and-the-store.md)
- [09 — `findFirst` / `findMany` and the automatic join](09-find-and-the-join.md)
- [10 — `update`, `delete`, and the honest caveat](10-update-delete-caveat.md)
- [11 — The msw bridge: `toHandlers` — collections become an API](11-the-msw-bridge.md)

### Part V — Build your own

- [12 — Build your own](12-build-your-own.md) — ~120 lines from scratch, plus a closing exercise set

## How to read

Don't skim the diagrams. **They are the explanation.** The prose just labels them. Parts I–III are universal (they describe Postgres, SQLite, Memgraph's relational cousins, and `@mswjs/data` equally). Part IV is one concrete engine. Part V is the proof you could build it.

The load-bearing idea, one line: **a relational dataset is a directed graph. Records are nodes. Foreign keys are edges. Queries are traversals.**
