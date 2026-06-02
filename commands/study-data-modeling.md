---
description: Data modeling audit for this codebase — schema shape, normalization, indexes vs queries, integrity, migrations
---

The user invoked `/aipe:study-data-modeling`.

This command takes **no arguments**. There is one data-modeling guide per repo, saved at the fixed path `.aipe/study-data-modeling/`. `.aipe/` is per-repo; the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused study generator that audits the **current repo**'s persistent data: the schema as-built, how it's normalized (or duplicated), how it's indexed against how it's queried, how integrity is enforced, and how it evolves. Findings grounded in real schema/migration/query files.

This generator is wired into `/aipe:study` and also remains runnable standalone when only the data-shape audit changed.

**Partition (two seams):**
- `study-data-modeling` — the **SHAPE** of persistent data: schema, normalization, indexes, queries, integrity. ← this command.
- `study-system-design-dsa` — **WHICH** datastore + scaling/sharding/replication (architecture), and IN-MEMORY data structures (DSA). Not schema shape.
- `study-software-design` — information hiding / duplication in *code*; the DB analog (normalization) cross-links to it.

Two seams to keep straight. Against **system-design**: "use Postgres, shard by tenant, add a read replica" is architecture (→ system-design-dsa); "this table is shaped wrong / this query has no index" is data modeling (→ here). Against **DSA**: a heap in memory is DSA; a B-tree index on disk is data modeling. Normalization is information-hiding for data — cross-link to software-design's information-hiding concept; don't re-teach it.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does NOT exist in the current working directory:

1. Create `.aipe/project/` and `.aipe/specs/` directories.
2. Write `.aipe/project/context.md` with this placeholder body:

   ```
   # Project context

   Describe this codebase so an AI agent can implement against it without asking.

   ## Stack
   - runtime, framework, language

   ## Data model
   - entities, relationships, where they live

   ## File structure
   - top-level folders and what lives where

   ## What must not change
   - public API surface, schema fields, ...
   ```

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-data-modeling.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)

## Step 3 — Load the template chain

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/study-data-modeling.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the 11-block concept-file template, formatting + diagram + pseudocode + hard rules.
- **`teacher.md`** — writer persona in teacher posture.
- **`me.md`** — reader calibration.
- **`study-data-modeling.md`** — the topic (data-modeling concepts), the partition rules, the anchoring rules.

## Step 4 — Detect existing guide → CREATE or UPDATE

Check `.aipe/study-data-modeling/` for `00-overview.md` at the root OR any concept file matching `0[1-7]-*.md`. Existing → UPDATE; missing → CREATE.

---

# CREATE MODE

## Step 5C — Audit pass (read-only)

Walk the schema/migration/query files as a data-modeling auditor: locate entities and their relationships, identify normalization holes (the same fact stored twice), find queries with no supporting index, locate places where integrity is enforced in app code instead of the DB, scan migrations for risky patterns. Build an inventory anchored to real `file:line` ranges.

## Step 6C — Plan the guide

Non-negotiables:

1. **All structural rules from `format.md` apply** — the 11-block per-concept template.
2. **Implementation in codebase is the heavy block** — real schema files, real migrations, real query call sites, the specific fix per finding. Every finding cites `**File:**` + `**Function / class:**` + `**Line range:**`.
3. **Stay in the data-modeling lane.** Architecture findings (sharding, replicas, datastore choice) go to `study-system-design-dsa`. In-memory DSA goes to `study-system-design-dsa`. Information hiding *in code* goes to `study-software-design` — but normalization (its data analog) lives here.
4. **Honest assessment.** A repo with no persistent data (a client-only app) means most concepts are N/A — name that plainly, don't invent.
5. **No project names in generated output except the studied repo.**

## Step 7C — Create the directory and generate the guide

Create:

```bash
mkdir -p .aipe/study-data-modeling
```

Generate 8 files in concept order:

```
00-overview.md                          master summary + the 3 highest-cost findings
01-the-data-model-and-its-shape.md      entities + relationships + cardinality as a diagram
02-normalization-and-duplication.md     where the same fact is stored twice; SSOT vs derived
03-indexing-vs-query-patterns.md        every hot query has a supporting index; vice versa
04-transactions-and-integrity.md        where invariants live (DB constraints vs app code)
05-migrations-and-evolution.md          how the schema changes safely; backfill / online migration discipline
06-access-patterns-and-storage-choice.md  the access pattern justifies (or doesn't) the chosen store
07-data-modeling-red-flags-audit.md     the consolidated red-flags checklist applied to this repo
```

## Step 8C — Generate `00-overview.md`

The audit at a glance: the entity-relationship diagram for this repo (rows + columns + cardinality), the three highest-cost findings, and a one-line verdict per concept.

## Step 9C — Report + stop

Print:

```
✓ Data modeling audit created at .aipe/study-data-modeling/
  00-overview.md                          (3 highest-cost findings named)
  01-the-data-model-and-its-shape.md      (entity count: <N>)
  02-normalization-and-duplication.md     (<N> duplications)
  03-indexing-vs-query-patterns.md        (<N> missing indexes; <N> unused indexes)
  04-transactions-and-integrity.md        (<N> invariants enforced in app code)
  05-migrations-and-evolution.md          (<N> risky patterns)
  06-access-patterns-and-storage-choice.md  (<N> findings)
  07-data-modeling-red-flags-audit.md     (<N> red flags fired)
```

Then a 3–5 sentence summary: the codebase's dominant data-shape pattern, the single highest-leverage fix, and any concept mostly N/A for this repo.

**Stop. Wait for the user's next instruction.**

---

# UPDATE MODE

## Step 5U — Read the existing guide

Walk `.aipe/study-data-modeling/` and read all concept files.

## Step 6U — Re-audit and diff

- **Codebase drift** — schema/migration changes, query shifts, indexes added/removed.
- **Template drift** — `format.md` blocks added.
- **Cross-reference drift** — pointers to sibling guides that moved.

Output the change plan.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation.** Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only identified sections. Append:

```
---
Updated: <today's ISO date> — <one-line summary>
```

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-data-modeling/
─────────────────────────────────────────────────
Files updated:        <list>
Findings added:       <count>
Findings removed:     <count, with one-line reason each>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
