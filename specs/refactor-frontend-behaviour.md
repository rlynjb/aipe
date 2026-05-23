# Refactor Spec — Frontend

Companion to `refactor.md`. Same discipline (one refactor type per spec, must-not-change, must-not-introduce) applied to refactor categories that are specific to frontend code — things the general spec doesn't name because they don't exist in non-UI code.

> **Read refactor.md first.** This spec extends it; it doesn't replace it. The spec format, principles, and discipline carry over. Composition refactors (Extract Function, Rename, Move) still apply the same way to frontend code — they're not repeated here.

Framework-agnostic. Concepts named here exist in React, Vue, Svelte, Angular, SolidJS, Lit, and vanilla JS. Where a concept has framework-specific names, they're listed in parentheses.


## Refactor spec format

Same as `refactor.md`, with one added field:


```
## What to refactor
## Why
## Refactor type      ← name from the categories below
## Framework context  ← which framework, version, any relevant idioms
## Current structure
## Target structure
## Must not change
  - Visible UI behaviour — same renders, same user-observable output
  - Event semantics — same events fire in the same order
  - Network / storage behaviour — same requests, same writes
  - Accessibility — keyboard, focus, ARIA, screen reader output stays identical
  - Do not touch [specific files / components]

## Must not introduce
  - No new dependencies
  - No new abstractions not discussed here
  - No additional refactors discovered along the way

## Done when
  - Existing tests pass
  - Manual smoke test of affected screens
  - No new console warnings or errors
```


> 💾 Save as → .aipe/specs/refactors/frontend-[name].md


## Key principles specific to frontend refactors

> **"Same behaviour" includes more than function output.** Frontend code has visible side effects — what's on screen, what's focused, what re-renders, what fires what event, what gets requested. A refactor that keeps the function's return value identical but changes when a component re-renders has changed behaviour. The must-not-change list in this spec is longer for that reason.

> **Test coverage before refactoring is often worse on frontend.** Many frontend codebases have weak coverage of interaction flows. If the only "test" is "does it look right when I click around," your verification surface is thinner than it would be for backend code. Either add a smoke test first, or accept that the refactor's safety net is shallower and proceed in smaller steps.


---


# Frontend refactor vocabulary


## 1. State placement refactors

Where state lives is the single most consequential structural decision in frontend code. Most "this component is a mess" problems are actually "this state is in the wrong place" problems.

  - **Lift State** — state lives in a component but needs to be shared with siblings or parents. Move it up to the lowest common ancestor.
  - **Lower State** — state lives high in the tree but is only used by one subtree or leaf. Push it down to where it's actually used. Reduces unnecessary re-renders of unrelated siblings.
  - **Extract to Shared State** (Context, Store, Provide/Inject, Signal at module level) — state needed in many distant places. Move out of the tree entirely. Use sparingly — global state is the most overused pattern in frontend.
  - **Move to URL / Route State** — state that should survive refresh, be shareable as a link, or participate in browser back/forward. Filters, tabs, modal open/close, pagination cursors.
  - **Move to Server State / Cache Layer** — state that's actually a cached server value being treated as client state. Use a cache library's primitives (TanStack Query, SWR, Apollo, RTK Query, Vue Query) so caching, invalidation, and refetching are explicit.
  - **Move to Form State** (React Hook Form, Formik, VeeValidate, Angular Forms) — form fields managed as ad-hoc useState scattered through a tree. Consolidate into a form library or a single reducer.
  - **Collapse Redundant State** — two or more state values that always change together, or one that can be derived from others. Replace with one source of truth + derivations.

> **State placement caution:** moving state changes re-render scope, which can affect perceived performance. Verify that the new placement doesn't introduce a render of a large subtree on every change.


## 2. Component structure refactors

Composition refactors from `refactor.md` apply — these are the additions specific to a component model.

  - **Extract Component** — a piece of one component is conceptually a separate unit. Pull it out. The frontend version of Extract Function.
  - **Inline Component** — a component used in one place that adds no clarity. Pull its contents back into the parent.
  - **Split Container / Presentation** — a component does both data fetching/coordination and rendering. Split into a parent that handles data and a child that handles markup.
  - **Extract Reusable Logic** (Custom Hook, Composable, Service, Use-Function, Action) — stateful or effectful logic embedded in a component that's needed elsewhere. Extract into the framework's reuse primitive.
  - **Slot-ify** (Slots, Children-as-Function, Render Props, Named Slots) — a component is rigid because layout/content is baked in. Replace fixed children with slot/prop-based extension points so callers can customize.
  - **Compound Component** — a parent and its children share state via implicit context, instead of prop-drilling through several layers. The parent exposes the children as a coordinated set.
  - **Replace Imperative DOM Access with Declarative State** — code uses refs to read or write DOM directly when the framework's reactive model could express the same thing. Refs should be for the cases the model genuinely can't reach (measuring, focus, integrating non-framework libraries).


## 3. Effect and lifecycle refactors

Side effects tied to component lifecycle are where most frontend bugs live. These refactors address the structural problems specifically.

  - **Extract Effect to its Own Unit** — multiple unrelated effects packed into one lifecycle hook. Split so each effect has one purpose and a clear dependency set.
  - **Collapse Redundant Effects** — multiple effects doing related work that could be one. Often appears as a chain: effect A sets state, which triggers effect B.
  - **Move Effect to Event Handler** — work in an effect that's actually a response to a user action, not a response to a state change. Move it back to the handler. Reduces indirection and bugs from effects running on initial mount.
  - **Move Effect Out of Component** (Service, Subscription, Module-Scope) — an effect that's really a long-lived subscription or singleton being recreated per-component-instance. Move out so it lives at the right scope.
  - **Replace Effect with Derived Value** — state in an effect that's computed from other state, instead of being computed inline or via the framework's derivation primitive (`useMemo`, `computed`, `$derived`, signal computed). Removes a state→effect→state cycle.
  - **Add or Tighten Cleanup** — an effect sets up something (subscription, timer, listener) but doesn't tear it down. Add cleanup. Often a precursor refactor before any other effect work.


## 4. Rendering and performance refactors

Apply only to **measured** problems. Frontend perf intuition is unreliable — the actual bottleneck is rarely where it feels like it is.

  - **Memoize Component** (React.memo, Vue defineComponent with shallow comparison, Solid's fine-grained reactivity) — a component re-renders frequently with the same props. Wrap so it skips renders when props haven't changed. Verify with profiler first; speculative memoization adds overhead and obscures the actual dependency graph.
  - **Memoize Derived Value** (useMemo, computed, $derived) — an expensive computation runs on every render. Cache at the appropriate boundary.
  - **Memoize Callback** (useCallback) — a function passed as a prop changes identity every render, defeating a child's memoization. Stabilize the reference.
  - **Code-Split / Lazy Load** — a route, modal, or feature pulls in a heavy bundle that isn't needed at first paint. Split at the boundary. Almost always wins on initial load time.
  - **Virtualize Long List** — list with hundreds or thousands of items renders all of them. Replace with windowing/virtualization. Behaviour stays the same; only what's mounted changes.
  - **Defer Non-Critical Work** (requestIdleCallback, startTransition, queueMicrotask) — work that runs during a user-blocking interaction but isn't actually urgent. Move to a deferred queue.
  - **Reduce Re-Render Scope** — a state change causes a large subtree to re-render when only a small part depends on it. Often fixed by lowering state, splitting components, or memoizing intermediate nodes.

> **Perf caution:** every memoization is overhead. The cost is small but real, and the indirection makes the code harder to reason about. Measure before, measure after; if there's no measurable win, revert.


## 5. Data flow refactors

How data moves through the app, independent of where it's stored.

  - **Replace Prop Drilling** — props passed through many intermediate components that don't use them. Replace with context/provide-inject, or by lifting the rendering location closer to where the data lives.
  - **Invert Event Flow** — a child component reaches up to mutate parent state via callbacks for many fields. Replace with an event/dispatch pattern where the parent owns state and the child emits semantic events ("submitted," "cancelled," not "name changed, then email changed, then ...").
  - **Introduce Adapter at Data Boundary** — components consume the raw shape of a server response, coupling UI to API. Introduce a transform layer so the UI sees a stable shape and API changes don't propagate.
  - **Replace Two-Way Binding with One-Way Flow** — `v-model` or `[(ngModel)]` used in places where the parent should own state and the child should emit changes. One-way flow is easier to debug.
  - **Stabilize Object/Array Identity** — props that are new objects on every render (`{...obj}`, `[...arr]`) triggering downstream invalidations. Stabilize at the source.


## 6. Styling refactors

Behaviour-preserving structural changes to how styles are organized. Visual output must stay identical.

  - **Extract Style to Component-Local** — global CSS rules targeting one component. Move to component-scoped styles (CSS modules, scoped slot, styled component, `:host` in shadow DOM).
  - **Promote Style to Design Token** — repeated literal values (colours, spacing, fonts) used directly in many places. Extract to design tokens / CSS variables / theme object. Callers reference the token, not the literal.
  - **Replace Utility Sprawl with Component** — long strings of utility classes repeated across many places. Extract into a styled component or composed class with a clear name.
  - **Replace Bespoke Layout with Layout Primitive** — repeated `flex` / `grid` setups across the codebase. Extract into reusable layout components (Stack, Cluster, Grid, Sidebar).
  - **Move Computed Style to State-Driven Class** — styles set imperatively via JS that could be class names toggled by state. Returns control to the styling system.


## 7. DSA-flavoured frontend refactors

Narrow set of perf-shaped refactors specific to the rendering and event model. Apply only to measured problems.

  - **Key-Based Reconciliation Fix** — list rendering with missing or unstable keys causing unnecessary unmount/remount. Provide stable keys. Often dramatic perf and behaviour improvements (preserves focus, animation state).
  - **Batch State Updates** — multiple state updates fired sequentially causing multiple renders. Batch into one update.
  - **Debounce / Throttle User Input** — input handlers that fire on every keystroke triggering expensive work. Coalesce. Common refactor for search-as-you-type, resize handlers, scroll handlers.
  - **Replace Repeated Selector with Memoized Selector** (Reselect, Pinia getters, Angular computed) — derived value computed in many components from the same source. Memoize once at the store layer.
  - **Replace Polling with Subscription / Event** — UI poll-fetches data on a timer when a push mechanism (WebSocket, SSE, framework event) is available.


---


# Frontend system design

This section is **not** a refactor catalog — it's the architectural lens that tells you *what* to refactor. When the system design is wrong, the resulting refactor is usually from one of the categories above, but you can't pick the right refactor without first diagnosing the architecture.

> A refactor spec doesn't capture system design. If a refactor is downstream of a system design change, write the design decision down separately first — what's changing at the architecture level, why, and what refactors that implies. Then write each refactor as its own spec.


## Dimension 1 — Rendering strategy

Where and when HTML is produced.

  - **Client-side rendering (CSR)** — HTML is a shell; JS produces the UI in the browser. Cheap to host, slow to first paint, bad for SEO and slow networks.
  - **Server-side rendering (SSR)** — HTML produced per request on the server. Better first paint, hydration cost on the client.
  - **Static site generation (SSG)** — HTML produced at build time. Fastest, but stale until rebuilt.
  - **Incremental static regeneration (ISR)** — SSG with per-page revalidation. Static-fast with controlled freshness.
  - **Streaming SSR** — server sends HTML in chunks as it's ready, instead of waiting for the full page.
  - **Islands / partial hydration** — most of the page is static HTML; only specific interactive regions hydrate. Lowest JS payload for content-heavy sites.
  - **Server components / RSC** — components that run only on the server, never ship to the client. The interactive parts are explicitly marked.

> Diagnosis: if first paint is slow and pages are content-heavy → consider SSG/SSR/islands. If interactive parts feel sluggish → CSR may be fine but the JS bundle needs attention. If the rendering strategy was chosen by framework default rather than deliberately, that itself is a finding.


## Dimension 2 — State architecture

The hierarchy from most local to most global. Each layer has a cost and a use case.

  1. **Local component state** — defaults here. Cheapest, most contained.
  2. **Lifted state** — shared by a small subtree. Lives at the nearest common ancestor.
  3. **Context / provide-inject** — shared by a section of the tree without prop-drilling. Watch re-render scope.
  4. **Module-scope reactive state** (Signals, Stores, Pinia, Zustand) — shared across the whole app, framework-aware.
  5. **Server cache** (TanStack Query, SWR, Apollo) — cached server data with explicit caching/invalidation rules.
  6. **URL state** — survives refresh, shareable, participates in history.
  7. **Persistent client storage** (localStorage, IndexedDB, cookies) — survives session.

> Diagnosis: every piece of state should live at the lowest tier where it works. State higher than it needs to be causes unnecessary coupling and re-renders. State lower than it needs to be causes prop-drilling, duplication, or sync bugs. Find both directions of misplacement.


## Dimension 3 — Data flow direction

How information moves between layers and components.

  - **Top-down (props)** — data flows from parent to child. Predictable, debuggable.
  - **Bottom-up (events)** — children emit events; parents own state and react.
  - **Two-way binding** — child can both read and write a parent value. Convenient for forms, hides causality elsewhere.
  - **Observable / reactive** — many subscribers react to a shared source. Powerful, can become hard to trace.

> Diagnosis: in a healthy frontend, top-down + bottom-up is the default; two-way binding and observables are reserved for cases that genuinely benefit. When debugging "why did this change?" is hard, the data flow is probably the answer.


## Dimension 4 — Boundaries

Frontend has structural boundaries that backend code rarely has. Each is a place where behaviour can be contained and refactors can be scoped.

  - **Route boundary** — what's owned by a route vs shared across the app
  - **Error boundary** — where errors get caught and a fallback is shown, instead of bubbling
  - **Suspense / loading boundary** — where loading states are coordinated (one spinner for many concurrent loads, not many)
  - **Hydration boundary** — what hydrates immediately, what hydrates later, what never hydrates
  - **Code-split boundary** — what's in the initial bundle, what's loaded on demand

> Diagnosis: boundaries are often invisible until they're wrong. Symptoms include errors crashing the whole app, loading spinners flickering everywhere, large initial bundles, hydration warnings.


## Dimension 5 — Bundle and loading strategy

How code reaches the browser.

  - **Code splitting** — by route, by feature, by dynamic import
  - **Lazy loading** — components, images, modules
  - **Prefetching / preloading** — anticipated navigation, critical resources
  - **Critical CSS** — above-the-fold styles inlined
  - **Tree shaking** — unused code removed at build time
  - **Asset optimization** — images, fonts, icons

> Diagnosis: open the network tab on a cold load. What's blocking first paint? What loaded but wasn't needed? What loaded that could have been loaded later? The answers point to specific refactors.


## Dimension 6 — Caching layers

Where copies of data live and how they stay consistent.

  - **HTTP cache** (browser, CDN) — driven by headers
  - **Service worker cache** — offline support, fine-grained control
  - **In-memory cache** (TanStack Query, SWR, Apollo store) — request deduplication, stale-while-revalidate
  - **Persistent client cache** (IndexedDB, localStorage) — survives session
  - **Build-time cache** (SSG, ISR) — pre-rendered HTML

> Diagnosis: a piece of data is "the same" if it always comes from one source. The moment two layers cache the same value, you have a consistency problem. Audit which data lives in which cache and whether invalidation is handled.


---


## How to use this spec

  1. **Start with the system design dimensions** if the refactor feels architectural. Diagnose which dimension is misaligned.
  2. **Pick the refactor type** from the categories above that addresses the diagnosis.
  3. **Write the spec** using the format at the top — same discipline as `refactor.md`, with the extended must-not-change list.
  4. **One refactor type per spec, one spec per session.** Combining frontend refactors is especially dangerous because the surfaces interact (a state placement change affects rendering, which affects perf).

> The cardinal rule of `refactor.md` still applies: name the technique. "Make this component cleaner" is not a refactor; "Lower state to the leaf" is.
