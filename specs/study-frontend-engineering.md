# Study — Frontend Engineering (applied)
## the `/aipe:study-frontend-engineering` command

A study-family generator that turns the **current repo** into a frontend-engineering guide: how the framework renders, how state is shaped, how components compose, where the network seam lives, how styling scales, what platform APIs the repo touches, and how the bundle is built and delivered. It teaches the frontend layer actually present in the repo without absorbing the architecture, performance, or security topics owned by neighboring generators.

Topic generator. Reads `format.md`, `teacher.md` in teacher posture, `me.md`, and the codebase. Inherits the family create/update, confirmation-gate, and run/report mechanics. This file owns the frontend-layer inventory, partition seams, output layout, and anchoring rules.

```
  /aipe:study-frontend-engineering      → create or update
  output: .aipe/study-frontend-engineering/
```

## Where this sits — partition

```
study-system-design          WHERE state and data live at the system level.
study-software-design        modules, interfaces, complexity (Ousterhout).
study-runtime-systems        event loop, scheduling, async at the runtime level.
study-networking             HTTP / WebSocket / fetch semantics on the wire.
study-performance-eng        measurement: FCP / LCP / TTI / bundle size as numbers.
study-security               trust boundaries (XSS, CSP, token storage).
study-testing                test design + the AI-eval seam.
study-frontend-engineering   the framework-and-platform layer of THIS repo:   ← here
                             rendering, state shape, components, data-fetch,
                             routing, styling, platform APIs, build.
study-data-modeling          the SHAPE of persistent data.
```

A finding belongs here when it is about a **frontend-specific pattern or seam** — how the framework decides what to render, where component boundaries are drawn, how server-state crosses into client-state, how the design system scales. Cross-link mechanism-level teaching to the owning generator: the event loop to `study-runtime-systems`, the wire format to `study-networking`, FCP / LCP measurement to `study-performance-engineering`, XSS / CSP to `study-security`, deep modules to `study-software-design`.

## Through-line

```
  the question: how does the user interface get from data to pixels,
                and what happens at each seam — state, component,
                network, platform, build?
```

This is the reader's home turf (`me.md`: 7+ years frontend, Vue/React). The teacher can lean on existing knowledge — no on-ramp for what a component or hook is. Lead with what THIS repo does. If the repo does not exercise a topic (no service worker, no SSR, no design tokens), say `not yet exercised` — never invent a pattern to fill the inventory.

## Topic concepts — audit-style two-pass output

**This is an audit-style generator.** It produces output in the two-pass shape defined in `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — one `audit.md` walking the lens inventory below
  → Pass 2 — discovered-pattern files, one per significant frontend pattern the repo actually exercises

The pattern-discovery rules, file-layout rules, and worked examples live in `me.md`. Do not restate them here. This spec defines only the **lens inventory specific to frontend engineering**.

### The lens inventory (for `audit.md`)

Walk the codebase against this ordered 8-lens inventory. Each lens becomes one `##` section in `audit.md`. For each lens: name what the codebase actually does (with `file:line` grounding) or emit `not yet exercised`. When a finding is significant enough to have a dedicated pattern file in Pass 2, cross-link to it.

1. **rendering-and-reactivity** — rendering mode (SPA / SSR / SSG / RSC / hybrid / island), reconciliation model (virtual-DOM diffing vs fine-grained reactivity vs resumability), scheduling (concurrent / sync / suspending), and when work actually happens (mount / update / commit / hydration). Cross-link the runtime event loop to `study-runtime-systems`.
2. **state-architecture** — the state graph: local component state, lifted state, global stores, derived state, server state, URL state, form state. Who owns each transition and how source-of-truth is enforced. Cross-link system-level state ownership to `study-system-design`.
3. **component-architecture** — composition patterns (children / slots / render props / headless / compound), boundary placement, abstraction earning its place, container-vs-presentational discipline (or its absence). Cross-link module/interface depth to `study-software-design`.
4. **data-fetching-and-cache** — how server state crosses into client state: fetch wrappers, query libraries (react-query / SWR), route loaders, RSC streaming, mutations + optimistic updates, cache invalidation strategy, error and retry behavior. Cross-link wire semantics to `study-networking` and cache-as-architecture to `study-system-design`.
5. **routing-and-navigation** — route structure (file-based / config / nested), code-splitting at the route boundary, navigation lifecycle (prefetch / suspense / transitions), guards / redirects / loaders, scroll restoration, deep-linking.
6. **styling-and-design-system** — CSS architecture (utility-first / CSS-in-JS / CSS Modules / vanilla), design tokens, theming (dark mode, brand themes), responsive strategy (breakpoints / container queries / fluid type), animation system, and how the design system scales as components grow.
7. **browser-platform-and-build** — which Web APIs the repo actually touches (Storage, Worker, ServiceWorker, IndexedDB, MediaRecorder, WebSocket, EventSource, etc.); the bundler (Vite / Webpack / Turbopack / esbuild) and the deploy artifact shape; code splitting, tree shaking, polyfills, sourcemaps. Cross-link bundle-size *measurement* to `study-performance-engineering`.
8. **frontend-red-flags-audit** — ranked frontend risks, each grounded in real evidence: state stored where it can't be invalidated, components that re-render on every keystroke, route boundaries that block FCP, theme tokens that don't compose, platform features used without a fallback.

### What earns a Pass 2 pattern file in this topic

The general rules in `me.md` apply: the pattern has a name, passes the load-bearing test, passes the recognition test. For frontend engineering specifically, the load-bearing test asks: *"if I stripped this pattern out, what specifically would the UI lose?"* Real answers name a concrete user-facing or platform capability — perceived-instant mutations, sub-second route transitions, offline reads, themeable design tokens that scale to N components, streaming server-rendered handoff to client interactivity, fine-grained re-renders confined to the changed leaf. Vague answers ("better DX") do not earn a file.

Typical frontend-engineering pattern names (kebab-case): `signals-and-fine-grained-reactivity`, `route-level-code-splitting`, `optimistic-mutations-with-rollback`, `streaming-ssr-handoff`, `island-architecture`, `headless-component-pattern`, `design-token-scaling`, `form-state-as-derived-state`, `service-worker-offline-cache`, `compound-component-api`, `route-loader-data-flow`, `theme-context-with-token-resolver`. The pattern name comes from the repo, not from this list — this is a calibration guide for the kind of names that pass the recognition test, not an enumeration.

## Output

The two-pass file layout is defined in `me.md` → AUDIT-STYLE GENERATORS → File layout. For this topic the output folder is `.aipe/study-frontend-engineering/`. All files flat at the root, no nested sub-directories.

Files produced:

- `README.md` — reading order plus cross-links to neighboring guides (`study-system-design`, `study-software-design`, `study-performance-engineering`, `study-security`, `study-runtime-systems`, `study-networking`).
- `00-overview.md` — one-page orientation: the rendering mode in one sentence, the state-architecture in one diagram, the network seam in one diagram, the three highest-leverage frontend patterns named with file paths. The reader who skims only this file knows what the repo is.
- `audit.md` — Pass 1, the 8-lens audit defined above. Eight `##` sections, one per lens. The final lens (`frontend-red-flags-audit`) ranks risks by user-visible consequence and names the evidence.
- `01-` through `0N-` — Pass 2, discovered-pattern files. Each named after a pattern the repo actually exercises (kebab-case), each using the full `format.md` template.

## Anchoring rules

- Ground every applied claim in a real `file:line` range, configuration value, schema object, or executable path. Both `audit.md` and the pattern files anchor to real evidence.
- Distinguish observed behavior from inference. Label inferred runtime / rendering behavior plainly ("this *would* re-render on every keystroke under React's default behavior" vs "this re-renders at `App.tsx:42`").
- Do not manufacture frontend patterns to fill the inventory. Use `not yet exercised` in the audit when a lens finds nothing. Do not invent pattern files for capabilities the repo doesn't actually exercise.
- Keep the partition seam sharp: runtime, network, security, performance, testing, system-architecture, and module-design details belong to their owning generators. Frontend-engineering owns the framework-and-platform layer only.
- On UPDATE, follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: regenerate `audit.md` against current evidence, add pattern files when the codebase grows a new frontend pattern, update existing pattern files when implementations change, and remove pattern files only when the pattern is genuinely gone (not just refactored).

## Running it inside `/aipe:study`

This generator belongs to the study orchestrator. `/aipe:study` creates or updates it under the shared confirmation gate and consolidated summary, placed in the run order after `study-software-design` (component-architecture findings inherit module-design vocabulary) and before `study-performance-engineering` (rendering-pipeline patterns set the stage for FCP / LCP measurement). It also remains runnable standalone through `/aipe:study-frontend-engineering` when only the frontend layer changed.
