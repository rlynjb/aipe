# Study — Networking (applied)
## the `/aipe:study-networking` command

A study-family generator that audits the **current repo** through the transport and protocol behavior exercised by the repo: DNS, connections, TLS, HTTP semantics, realtime transports, timeouts, retries, pooling, and network failure. Findings are grounded in real files, configuration, runtime behavior, and dependency choices.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns topic scope, partition seams, concept inventory, and anchoring rules.

```
  /aipe:study-networking      → create or update
  output: .aipe/study-networking/
```

## Where this sits — partition

```
study-networking        WHAT happens on the wire and why.
study-security          WHETHER each trust boundary is safe.
study-system-design WHERE network boundaries belong in the architecture.
```

A finding belongs to the generator that owns the mechanism. Cross-link neighboring guides rather than re-teaching their material.

## Through-line

```
  the question: what actually happens on the wire, where can it fail, and which protocol semantics does the code rely on?
```

Use verdict-first teaching. Start with the repo's actual shape, identify the most consequential mechanisms and risks, then teach the fundamentals required to reason about them. If a topic is absent, say `not yet exercised` and explain when it becomes relevant. Never invent infrastructure, scale, or behavior.

## Topic concepts

Every concept file uses the full `format.md` template. Generate these files in order:

  1. `network-map`
     the full on-the-wire path and every network boundary.

  2. `dns-routing-and-addressing`
     names, addresses, routing, proxies, edge layers, and origin resolution.

  3. `tcp-udp-connections-and-sockets`
     connections, sockets, transport choices, ordering, and connection lifecycle.

  4. `tls-and-trust-establishment`
     encryption in transit, certificates, trust establishment, and termination points.

  5. `http-semantics-caching-and-cors`
     methods, status codes, headers, caching, cookies, CORS, and browser policy.

  6. `websockets-sse-streaming-and-realtime`
     long-lived connections, streams, realtime behavior, and reconnect logic.

  7. `timeouts-retries-pooling-and-backpressure`
     timeouts, retries, jitter, connection pools, request collapse, and overload.

  8. `networking-red-flags-audit`
     ranked protocol and network-failure risks grounded in the repo.

## Output

```
  .aipe/study-networking/
    00-overview.md
    01-network-map.md
    02-dns-routing-and-addressing.md
    03-tcp-udp-connections-and-sockets.md
    04-tls-and-trust-establishment.md
    05-http-semantics-caching-and-cors.md
    06-websockets-sse-streaming-and-realtime.md
    07-timeouts-retries-pooling-and-backpressure.md
    08-networking-red-flags-audit.md
```

`00-overview.md` contains the repo-grounded map, the ranked findings, the reading order, and explicit `not yet exercised` notes. The final audit file ranks risks by consequence and names the evidence for each verdict.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path.
- Distinguish observed behavior from an inference. Label inferred runtime or production behavior plainly.
- Do not manufacture findings to fill the template. Use `not yet exercised` when the repo does not contain the mechanism.
- Keep the partition seam sharp. Cross-link adjacent generators instead of duplicating their lessons.
- On UPDATE, reconcile against the codebase surgically: add newly exercised concepts, update changed evidence, retain still-correct teaching, and remove stale claims.

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it alongside the other study guides under the same single confirmation gate and consolidated summary. It also remains runnable standalone through `/aipe:study-networking`.
