# Study — System Design (applied)
## the `/aipe:study-system-design` command

A study-family generator that turns the **current repo** into a system-design guide: the system map, architectural boundaries, request and data flow, state ownership, caching, storage choice, failure handling, reliability boundaries, and scale tradeoffs. It teaches the architecture actually present in the repo without absorbing the foundation topics owned by neighboring generators.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns the architecture inventory, partition seams, output layout, and anchoring rules.

```
  /aipe:study-system-design      → create or update
  output: .aipe/study-system-design/
```

## Where this sits — partition

```
study-runtime-systems      HOW work executes inside one machine or runtime.
study-networking           WHAT happens on the wire.
study-database-systems     HOW a datastore executes and preserves reads and writes.
study-dsa-foundations      reusable data-structure and algorithm curriculum.
study-system-design        WHERE components live, how state and data move,     ← here
                           where boundaries fail, and what changes at scale.
study-distributed-systems  correctness when coordination crosses boundaries.
study-data-modeling        the SHAPE of persistent data.
```

A system-design finding belongs here when it changes the architectural map or a boundary-level tradeoff. Cross-link mechanism-level teaching to the owning foundation generator. Do not recreate a DSA section: algorithms and data structures now belong to `study-dsa-foundations`.

## Through-line

```
  the question: where do data, state, and work live; how do they move;
                what happens when a boundary fails; and what changes at 10x?
```

System design is not a stack shopping list. Start with constraints, draw the whole system, trace the important flows, name ownership at each boundary, and defend tradeoffs. If the repo does not exercise a topic, say `not yet exercised`; never invent services, scale, or infrastructure.

## Topic concepts

Every concept file uses the full `format.md` template. Cover the significant architectural patterns actually present in the repo, using this ordered inventory as the audit lens:

1. **system-map-and-boundaries** — every major component, responsibility, connection, trust boundary, and external dependency.
2. **request-response-and-data-flow** — the important end-to-end flows, waterfalls, parallel work, and handoffs.
3. **state-ownership-and-source-of-truth** — server, client, URL, form, local, cached, and persisted state; who owns each transition.
4. **caching-and-invalidation** — cache layers, freshness requirements, invalidation strategy, and stale-data behavior.
5. **storage-choice-and-durability-boundaries** — why each datastore exists, what it owns, and which durability guarantees matter. Cross-link engine internals to `study-database-systems` and schema shape to `study-data-modeling`.
6. **failure-handling-and-reliability** — slow dependencies, offline behavior, retries, partial failure, graceful degradation, and recovery paths. Cross-link coordination mechanics to `study-distributed-systems`.
7. **scale-bottlenecks-and-evolution** — what breaks first at 10x and 100x, what stays stable, and which future change would force rearchitecture.
8. **system-design-red-flags-audit** — ranked architectural risks, each grounded in real evidence.

Add a repo-specific concept file only when the architecture contains another significant pattern, such as an event pipeline, plugin boundary, sync engine, edge layer, or multi-tenant split.

## Output

```
  .aipe/study-system-design/
    README.md
    00-overview.md
    01-system-map-and-boundaries.md
    02-request-response-and-data-flow.md
    03-state-ownership-and-source-of-truth.md
    04-caching-and-invalidation.md
    05-storage-choice-and-durability-boundaries.md
    06-failure-handling-and-reliability.md
    07-scale-bottlenecks-and-evolution.md
    08-system-design-red-flags-audit.md
    09-<repo-specific-pattern>.md       optional; only when exercised
```

All concept files live **flat** at the root of `.aipe/study-system-design/` — no `01-system-design/` (or any other) nested sub-directory. The folder name already names the topic; another wrapping directory adds nothing.

`00-overview.md` is a one-page orientation artifact: one full-system ASCII diagram plus a concise legend naming what each component is, what it owns, and what it talks to. `README.md` (at the same root) gives the reading order and explicitly cross-links relevant foundation guides.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from inference. Label inferred production or scale behavior plainly.
- Do not manufacture architecture to fill the inventory. Use `not yet exercised` when the repo lacks a mechanism.
- Keep the partition seam sharp: runtime, protocol, database-engine, DSA, distributed-correctness, schema-shape, security, and performance details belong to their owning generators.
- On UPDATE, reconcile surgically against the codebase: add new boundaries and patterns, update changed evidence, retain correct teaching, and remove stale claims.

## Migration from the former combined generator

Earlier versions wrote a combined system-design + DSA guide to `.aipe/study-system-design-dsa/`. That path is now legacy.

When running this generator:

1. Detect `.aipe/study-system-design-dsa/` if it exists.
2. Tell the user that system-design content moves to `.aipe/study-system-design/` and DSA learning moves to `.aipe/study-dsa-foundations/`.
3. Do not silently delete or overwrite the legacy folder. Offer to leave it as an archive after generating the two new guides.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it after the foundation guides and before code-level design guides under the shared confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-system-design`.
