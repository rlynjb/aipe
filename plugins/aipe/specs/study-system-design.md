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

## Topic concepts — audit-style two-pass output

**This is an audit-style generator.** It produces output in the two-pass shape defined in `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — one `audit.md` walking the lens inventory below
  → Pass 2 — discovered-pattern files, one per significant pattern the repo actually exercises

The pattern-discovery rules, file-layout rules, and worked examples live in `me.md`. Do not restate them here. This spec defines only the **lens inventory specific to system-design**.

### The lens inventory (for `audit.md`)

Walk the codebase against this ordered 8-lens inventory. Each lens becomes one `##` section in `audit.md`. For each lens: name what the codebase actually does (with `file:line` grounding) or emit `not yet exercised`. When a finding is significant enough to have a dedicated pattern file in Pass 2, cross-link to it.

1. **system-map-and-boundaries** — every major component, responsibility, connection, trust boundary, and external dependency.
2. **request-response-and-data-flow** — the important end-to-end flows, waterfalls, parallel work, and handoffs.
3. **state-ownership-and-source-of-truth** — server, client, URL, form, local, cached, and persisted state; who owns each transition.
4. **caching-and-invalidation** — cache layers, freshness requirements, invalidation strategy, and stale-data behavior.
5. **storage-choice-and-durability-boundaries** — why each datastore exists, what it owns, and which durability guarantees matter. Cross-link engine internals to `study-database-systems` and schema shape to `study-data-modeling`.
6. **failure-handling-and-reliability** — slow dependencies, offline behavior, retries, partial failure, graceful degradation, and recovery paths. Cross-link coordination mechanics to `study-distributed-systems`.
7. **scale-bottlenecks-and-evolution** — what breaks first at 10x and 100x, what stays stable, and which future change would force rearchitecture.
8. **system-design-red-flags-audit** — ranked architectural risks, each grounded in real evidence.

### What earns a Pass 2 pattern file in this topic

The general rules in `me.md` apply: the pattern has a name, passes the load-bearing test, passes the recognition test. For system-design specifically, the load-bearing test asks: *"if I stripped this pattern out, what architectural capability would the system lose?"* Real answers name specific capabilities — sub-second response time, OAuth identity propagation, fan-out parallelism, eventual consistency, local-first offline behavior. Vague answers ("harder to maintain") do not earn a file.

Typical system-design pattern names (kebab-case): `request-flow`, `oauth-boundary`, `provider-abstraction`, `caching-and-rate-limiting`, `streaming-ndjson`, `multi-agent-orchestration`, `client-stream-handoff`, `schema-gated-coverage`, `local-first-sync`, `on-device-ml-pipeline`, `canonical-local-with-cloud-mirror`. The pattern name comes from the repo, not from this list — this is a calibration guide for the kind of names that pass the recognition test, not an enumeration.

## Output

The two-pass file layout is defined in `me.md` → AUDIT-STYLE GENERATORS → File layout. For system-design specifically, the output folder is `.aipe/study-system-design/`. All files flat at the root, no nested sub-directories.

Files produced:

- `README.md` — reading order plus cross-links to neighboring foundation guides (`study-database-systems`, `study-data-modeling`, `study-distributed-systems`, `study-runtime-systems`)
- `00-overview.md` — one-page orientation artifact: one full-system ASCII diagram plus a concise legend naming what each component is, what it owns, and what it talks to. The reader who skims only this file gets the whole map.
- `audit.md` — Pass 1, the 8-lens audit defined above. Eight `##` sections, one per lens.
- `01-` through `0N-` — Pass 2, the discovered-pattern files. Each named after a pattern in kebab-case, each using the full `format.md` template.

Worked examples (which repos produce which file lists) live in `me.md` — see the "Worked example" sub-section there.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path. Both `audit.md` and the pattern files anchor to real evidence.
- Distinguish observed behavior from inference. Label inferred production or scale behavior plainly.
- Do not manufacture architecture to fill the inventory. Use `not yet exercised` in the audit when a lens finds nothing. Do not invent pattern files for patterns the repo doesn't actually exercise.
- Keep the partition seam sharp: runtime, protocol, database-engine, DSA, distributed-correctness, schema-shape, security, and performance details belong to their owning generators. System-design owns architectural boundaries and tradeoffs only.
- On UPDATE, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: add new pattern files when the codebase grows new patterns, update existing pattern files when implementations change, remove pattern files only when patterns are genuinely gone, regenerate `audit.md` against current evidence.

## Migration from the former combined generator

Earlier versions wrote a combined system-design + DSA guide to `.aipe/study-system-design-dsa/`. That path is now legacy.

When running this generator:

1. Detect `.aipe/study-system-design-dsa/` if it exists.
2. Tell the user that system-design content moves to `.aipe/study-system-design/` and DSA learning moves to `.aipe/study-dsa-foundations/`.
3. Do not silently delete or overwrite the legacy folder. Offer to leave it as an archive after generating the two new guides.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it after the foundation guides and before code-level design guides under the shared confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-system-design`.
