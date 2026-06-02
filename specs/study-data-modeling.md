# Study — Data Modeling (persistent data, applied)
## the `/aipe:study-data-modeling` command

A study-family generator that audits the **current repo**'s persistent
data: the schema as-built, how it's normalized (or duplicated), how it's
indexed against how it's queried, how integrity is enforced, and how it
evolves. Findings grounded in real schema/migration/query files.

Topic generator. Reads `format.md`, `teacher.md` (teacher posture),
`me.md`, the codebase. Inherits the concept-file template, create/update,
confirmation gate, and run/report mechanics from the family — see
`study-software-design.md`. This file defines topic, concepts, partition,
anchoring.

```
  /aipe:study-data-modeling      → create or update
  output: .aipe/study-data-modeling/
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition (two seams)
═════════════════════════════════════════════════

```
  study-data-modeling   the SHAPE of persistent data: schema,           ← here
                        normalization, indexes, queries, integrity.
  study-system-design-dsa  WHICH datastore + scaling/sharding/replication
                           (architecture), and IN-MEMORY data structures
                           (DSA). Not schema shape.
  study-software-design information hiding / duplication in CODE — the
                        DB analog (normalization) cross-links to it.
```

  → Two seams. Against **system-design**: "use Postgres, shard by
    tenant, add a read replica" is architecture → there; "this table
    is shaped wrong / this query has no index" is data modeling →
    here. Against **DSA**: a heap in memory is DSA; a B-tree index on
    disk is data modeling.
  → Normalization is information-hiding for data — single source of
    truth, no fact stored twice. Cross-link to software-design's
    information-hiding concept; don't re-teach it.

═════════════════════════════════════════════════
PERSONA + THROUGH-LINE
═════════════════════════════════════════════════

`teacher.md`, teacher posture. Verdict-first / rank-what-matters. `me.md`.
Inherit template + persona.

```
  the question:  does the data's shape match how it's actually
                 read and written — and can it stay correct?

  the data model is the most expensive thing to get wrong: code is
  cheap to change, a schema with live data in it is not. Migrations
  are the change-amplification symptom made physical.
```

Relevant to your stack: Supabase per-app Postgres schemas
(`loopd.entries`, `contrl.workouts`) + a shared `public`; expo-sqlite's
three-tier state and durability ordering in loopd; Notion-as-database in
PLRI+. The audit anchors to whichever persistence the repo actually uses.

═════════════════════════════════════════════════
THE TOPIC — concepts (full format.md template each)
═════════════════════════════════════════════════

```
  1. the-data-model-and-its-shape
       the entities, relationships, and schema as-built — drawn as a
       diagram from the real schema/migrations. The zoom-out.
       red flag: no discernible model (everything in one JSON blob /
       one table) when the data has real structure.

  2. normalization-and-duplication
       facts stored once vs copied across rows/tables; when
       denormalization is a deliberate read optimization vs an
       accident. Single source of truth.
       red flag: the same fact editable in two places (the DB analog
       of information leakage).

  3. indexing-vs-query-patterns
       the indexes that exist vs the queries actually run; missing
       indexes on hot paths; N+1 query patterns in the app code.
       red flag: a frequent query with no supporting index; a loop
       issuing one query per row.

  4. transactions-and-integrity
       constraints (FKs, unique, not-null, checks), atomicity where
       multiple writes must succeed together, what enforces
       invariants — the DB or hopeful app code.
       red flag: a multi-write operation with no transaction; an
       invariant enforced only in app code the DB doesn't guard.

  5. migrations-and-evolution
       how schema changes ship — reversible, safe under live data,
       backfills, zero-downtime patterns vs destructive ones.
       red flag: a destructive migration with no rollback; a column
       drop with no backfill plan.

  6. access-patterns-and-storage-choice
       does the storage shape match the read/write pattern (the seam
       to system-design): relational vs document vs KV vs the app's
       actual access shape; local-first / sync concerns where present.
       red flag: a relational schema fighting a document-shaped access
       pattern, or vice versa.
       (Honest "not exercised" if the repo has no real persistence —
       e.g. a purely client-side app.)

  7. data-modeling-red-flags-audit
       consolidated checklist marked against this repo. Capstone.
```

═════════════════════════════════════════════════
ANCHORING + OUTPUT
═════════════════════════════════════════════════

Family anchoring rules (real schema/migration/query paths, rank worst-first,
blunt + constructive, honest "no real persistence here yet" with a buildable
target). Diagram the actual schema, not a generic one. Project exercises
become "redesign this table / add this index / make this write atomic";
Interview defense becomes "defend this normalization / denormalization call."

```
  .aipe/study-data-modeling/
    README.md   through-line (does shape match access?) + the two
                partition seams, stated up front + the schema diagram
    01-the-data-model-and-its-shape.md
    02-normalization-and-duplication.md
    03-indexing-vs-query-patterns.md
    04-transactions-and-integrity.md
    05-migrations-and-evolution.md
    06-access-patterns-and-storage-choice.md
    07-data-modeling-red-flags-audit.md
```

Create/update, confirmation, audit pass, run order, summary: family pattern,
identical to `study-software-design.md`. Per-repo, code-grounded, original
expression, inherit structure + voice. Wired into `/aipe:study` under the shared confirmation gate and consolidated summary; also runnable standalone.
