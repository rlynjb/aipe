# Chapter 3.3 — Front-End System Design

**IK Section III, Module 3.** Reading time: 35 minutes.

> The front-end system design interview is the slot that determines senior vs staff. The prompts — "design Netflix's video player," "design an infinite scroller," "design Facebook's News Feed" — sound similar to backend system design but probe different things: bundle architecture, render performance, state shape, framework boundaries, cross-device portability.

## What FE system design probes

Backend system design probes: scaling, caching, sharding, consistency.

Frontend system design probes:

- **Bundle architecture.** How is code split? What's loaded eagerly? What's deferred?
- **Render performance.** What renders when state changes? How do you avoid janky scrolls and slow interactions?
- **State shape.** Where does state live? Server state vs client state vs URL state vs form state.
- **Component composition.** What's the boundary of a reusable component? How do you share styles, hooks, behavior?
- **Framework decisions.** When to reach for React vs alternatives. Server components vs client components. Server-rendered vs client-rendered.
- **Cross-platform.** Web + mobile + native + email. How does the same component logic span all four?
- **Offline / sync.** When the network is unreliable, how does the app behave?
- **Accessibility at scale.** What's the system that ensures every component is accessible by default?

The 45-minute slot rewards candidates who think about all of these. Most candidates skip half because they're frameworks-deep and haven't operated at scale.

## The interview shape

```
Minute 0-5:    Clarifying questions.
               What does the product do? Who uses it? What devices?
               What's out of scope?

Minute 5-15:   High-level architecture.
               Component tree. Data flow. Where state lives.
               Routing. Bundling.

Minute 15-30:  Deep dive on 1-2 components.
               The interviewer picks. You walk the implementation
               in detail: state, events, performance, edge cases.

Minute 30-40:  Scale and performance.
               What breaks at 10×? What's the bottleneck?
               How do you measure and improve?

Minute 40-45:  Tradeoffs and alternatives.
               What did you give up? What would you do
               differently with constraint X?
```

The structure mirrors backend system design. The content is FE-specific.

## Case study: design Netflix's video player

The canonical FE system design question. Walk through it.

### Functional requirements

- Plays video from a streaming source.
- Adaptive bitrate based on bandwidth.
- Resumes from last watched position.
- Multi-language subtitle support.
- Picture-in-picture, fullscreen, captions toggle.
- Keyboard shortcuts (space = pause, arrow keys = seek).

### Non-functional requirements

- < 2 second time-to-first-frame on a typical desktop.
- < 1 second seek latency.
- Works on Chrome, Safari, Firefox, Edge, mobile Safari, Android Chrome.
- Handles network blips without crashing.
- Accessible to keyboard and screen reader users.

### High-level architecture

```
┌─────────────────────────────────────────────────────┐
│  Video Player UI                                    │
│                                                     │
│  ┌─────────────────────────────────────┐           │
│  │  <video> element                    │           │
│  │  (browser-native, hardware-accel)   │           │
│  └──────────────┬──────────────────────┘           │
│                 │ events: play, pause, timeupdate, │
│                 │ ratechange, buffered, error      │
│                 ▼                                   │
│  ┌─────────────────────────────────────┐           │
│  │  Player state machine                │           │
│  │  (idle → loading → playing → paused │           │
│  │   → buffering → error → ended)      │           │
│  └──────────────┬──────────────────────┘           │
│                 │                                   │
│         ┌───────┼───────┐                          │
│         ▼       ▼       ▼                          │
│      Controls Subtitles Loading                    │
│      (HUD)   (overlay) (spinner)                   │
│                                                     │
│  ┌─────────────────────────────────────┐           │
│  │  Adaptive bitrate manager            │           │
│  │  (HLS or DASH; switch quality based │           │
│  │   on bandwidth & buffer)             │           │
│  └──────────────┬──────────────────────┘           │
│                 │                                   │
│                 ▼                                   │
│  Streaming source (HLS/DASH chunks from CDN)        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Component breakdown

```
<VideoPlayer>
  <Video />              ← native <video> wrapper
  <Controls>             ← play/pause, seek bar, volume, fullscreen
    <PlayButton />
    <SeekBar />
    <VolumeControl />
    <FullscreenButton />
    <SubtitlesToggle />
  </Controls>
  <SubtitlesOverlay />    ← positioned over video
  <LoadingSpinner />      ← shown during buffering
  <ErrorMessage />        ← shown on player error
</VideoPlayer>
```

Each component receives the relevant slice of player state. Communication goes through the parent (Controls dispatches events upward; parent dispatches state downward).

### State management

```
const playerState = {
  status: "idle" | "loading" | "playing" | "paused" | "buffering" | "ended" | "error",
  currentTime: 0,
  duration: 0,
  buffered: [{ start: 0, end: 30 }],  // ranges
  volume: 1.0,
  muted: false,
  fullscreen: false,
  pictureInPicture: false,

  subtitles: {
    enabled: true,
    language: "en",
    available: ["en", "es", "ja"],
  },

  quality: {
    current: "auto",
    available: ["240p", "360p", "480p", "720p", "1080p", "auto"],
  },
};
```

For a small player, this lives in a single state container (React useState with useReducer, or Redux). For a complex player like Netflix's, the state is split into modules — playback state, network state, subtitle state, UI state — each with its own reducer.

### Adaptive bitrate

The hardest part of a video player. You can't just pick one quality and hope. Network conditions change; buffer depletes or grows; user has data caps.

The algorithm:

```
Every chunk download:
  measured_bandwidth = chunk_size / download_time
  smoothed_bandwidth = EMA(smoothed_bandwidth, measured_bandwidth)

If buffer < 10 seconds:
  prefer lower quality (avoid stalls).
If buffer > 30 seconds and smoothed_bandwidth > current_quality_bitrate * 1.5:
  step up to next quality.
If buffer < 5 seconds and current_quality is not lowest:
  step down to lower quality immediately.
```

The interview probe: "how do you handle the user joining a video on a slow network?" Start with the lowest quality (fast first frame), then upshift as bandwidth allows. Avoid downshifts during a single play session unless buffer is in danger.

### CDN and caching strategy

Video chunks are served from a CDN (Akamai, Cloudflare, Netflix's Open Connect). The client requests chunks one at a time as the playhead approaches them.

```
Buffering strategy:
  Read-ahead: keep 30-60 seconds of buffer.
  Prefetch: while playing, fetch the next chunk in parallel.
  Adaptive: drop quality before running out of buffer.

CDN cache:
  Edge nodes cache popular chunks.
  Long videos with seek points are fragmented; each fragment is a
  separate cacheable resource.
```

### Performance optimizations

```
Bundle:
  - Player code is ~50KB gzipped (split out from main app bundle).
  - Loaded on-demand when user navigates to a video page.
  - Subtitle parsing library (vtt.js) lazy-loaded only if subtitles
    are toggled on.

Render:
  - <video> element is hardware-accelerated; we don't touch its
    rendering except for overlays.
  - Subtitle overlay uses absolute positioning + transform (composited
    layer; doesn't trigger reflow).
  - Controls fade in/out via CSS opacity + transition (composited).

State updates:
  - timeupdate event fires every 200-300ms during playback.
    Don't re-render the entire UI on each — debounce the SeekBar
    update to once per 100ms.
  - Volume changes don't re-render the video element.
```

### Failure modes

```
- Network drops mid-playback.
  Show buffering UI; retry chunk fetch with backoff.
  If recovery fails for > 30 seconds, show error with retry button.

- Codec not supported.
  Fall back to a lower-quality variant with broader codec support.
  Surface error if no variant works.

- DRM negotiation fails.
  Show DRM-specific error message.
  Common pattern: log to monitoring; offer customer support link.

- User loses focus and returns.
  Modern browsers auto-pause when tab loses focus (mobile).
  Resume playback or stay paused based on user preference.
```

## Case study: design an infinite scroller

The second canonical FE system design question. Critical for News Feed, Twitter timeline, Instagram, TikTok-style feeds.

### The naive approach (which fails)

Render all 10,000 items on first load. Browser dies.

### The right approach

**Virtualization**: only render the items that are currently visible (plus a small buffer).

```
┌─ Viewport (visible portion) ───────────────────────┐
│                                                    │
│  Item 4 (rendered)                                 │
│  Item 5 (rendered)                                 │
│  Item 6 (rendered)                                 │
│  Item 7 (rendered)                                 │
│                                                    │
└────────────────────────────────────────────────────┘

   Items 1-3 above viewport — NOT rendered.
   Items 8+ below viewport — NOT rendered.

   Container has fixed height = (number of items) × (item height)
   to maintain correct scrollbar.
   Items 4-7 are absolutely positioned at their calculated offsets.

On scroll:
  Recompute which items are visible.
  Render those; remove the others from the DOM.
```

This pattern is the foundation of `react-window`, `react-virtual`, `react-virtualized` libraries, and is implemented in production at every infinite-scroll product.

### The Intersection Observer approach

For loading more items as the user approaches the bottom:

```
const sentinel = document.querySelector(".sentinel");
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMoreItems();
    }
  },
  { rootMargin: "200px" }  // trigger 200px before sentinel reaches viewport
);
observer.observe(sentinel);
```

Intersection Observer replaced manual scroll handlers years ago. It's debounced, off-main-thread, and tells you exactly when an element enters/leaves the viewport.

### Implementation considerations

```
Variable-height items?
  Maintain a "measured heights" cache.
  When an item is rendered, measure its height; cache it.
  Use the cache to compute the offset of items below.
  Force a remeasure if content changes.

Items with images that load late?
  Each image's load can change the item's height.
  Re-measure on image load.
  Or: reserve space for images via known dimensions (most CDNs
  return image dimensions in the URL or response).

Scroll restoration?
  When navigating away and back, restore the scroll position.
  Pin to a specific item ID (not pixel offset) so the position
  is correct even if items above were edited.

Empty state, loading state, error state?
  All explicit. Don't show a broken skeleton forever.
```

### Performance budget

A scrollable list should hit:
- 60fps scroll (16ms frame budget).
- Each new item appears within 50ms of becoming visible.
- Memory usage stays constant regardless of total item count (because virtualization).

The senior probe: "how do you measure this?" Performance API (`performance.mark` / `performance.measure`). FPS via `requestAnimationFrame` timing.

## Case study: design Facebook's News Feed

The most complex FE system design question. It combines: infinite scroll, mixed content types, real-time updates, personalization, optimistic UI, deep linking.

### Architectural layers

```
┌─────────────────────────────────────────────────────┐
│  News Feed Page                                     │
│                                                     │
│  ┌─────────────────────────────────────┐           │
│  │  Feed container                     │           │
│  │  (virtualized list, infinite scroll)│           │
│  └─────────────────┬───────────────────┘           │
│                    │                                │
│         ┌──────────┼──────────┐                    │
│         ▼          ▼          ▼                    │
│   PostCard    AdCard     SuggestedFriends          │
│   (text, image (sponsored)  (carousel)             │
│    video)                                           │
│         │                                           │
│         ▼                                           │
│   Engagement bar (like, comment, share)             │
│         │                                           │
│         ▼                                           │
│   Comments thread (expandable)                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Component composition

Polymorphic feed items: every item has a `type` and is rendered by a registered component for that type.

```
const itemRenderers = {
  post: PostCard,
  ad: AdCard,
  suggestion: SuggestedFriendsCard,
  story: StoryCard,
  // ...
};

function FeedItem({ item }) {
  const Renderer = itemRenderers[item.type] ?? UnknownItemCard;
  return <Renderer {...item} />;
}
```

This pattern lets the backend change feed composition without the frontend redeploying. New item types? Backend adds them to the feed; frontend renders `UnknownItemCard` for unknown types until the next deploy.

### Real-time updates

Posts shouldn't only update on refresh. Likes, comments, new posts should propagate live.

```
WebSocket connection to push channel.
On message:
  - if it's a new like on a visible post, update the count.
  - if it's a new comment, optionally append to visible thread.
  - if it's a new top-of-feed post, show "New posts" banner;
    don't auto-scroll (would disrupt user).
```

### Optimistic UI

When the user likes a post, the like count should update immediately, even before the server confirms. This is **optimistic updates**.

```
function onLike(postId) {
  // Optimistic update: increment count locally.
  setLikeCount(prev => prev + 1);
  setIsLiked(true);

  fetch(`/api/like`, {
    method: "POST",
    body: JSON.stringify({ postId }),
  })
    .then(() => { /* server confirmed; no-op */ })
    .catch(() => {
      // Rollback on error.
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
      showToast("Couldn't like — try again");
    });
}
```

This is the pattern that makes apps feel native instead of laggy. The instinct from your data-center days: locally commit + remote replicate. Same pattern at the UI layer.

### Data caching

```
Pattern: React Query / SWR / similar.

Cache:
  Key: ("feed-page", page_number)
  Value: array of feed items
  Stale-after: 60 seconds
  Refetch-on: visibility change, focus

When user navigates away and back:
  Cache returns instantly.
  Background refetch updates the data if it's stale.
  User sees something immediately; updates land softly.
```

### Performance

```
Lazy loading images:
  Use loading="lazy" attribute or Intersection Observer.
  Load images only as they approach the viewport.

Lazy loading videos:
  Show poster image until viewport intersects video.
  Then load + autoplay (or wait for user interaction).

Lazy loading components:
  Use React.lazy + Suspense.
  Comment thread component loaded only when user expands comments.

Memoize expensive components:
  React.memo on FeedItem so it doesn't re-render when unrelated
  items change.
  useCallback / useMemo to stabilize prop references.

Code splitting:
  Route-based splitting (the feed route is one bundle).
  Component-based splitting for rarely-used components
  (comment modal, share modal).
```

## Designing redux-like state management

The IK curriculum asks about this. The senior interview prompt is often: "how would you design a Redux-like state management library from scratch?"

The core ideas:

```
1. Single source of truth.
   All state lives in one store.

2. State is immutable.
   You never mutate the store; you create a new state object.

3. State changes are triggered by actions.
   action = { type: "INCREMENT", payload: 1 }

4. Reducers compute new state from old state + action.
   newState = reducer(oldState, action)

5. Subscribers are notified after state changes.
   store.subscribe(listener)
```

A minimal implementation:

```
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach(l => l(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// Usage:
const counter = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT": return state + 1;
    case "DECREMENT": return state - 1;
    default: return state;
  }
};

const store = createStore(counter, 0);
store.subscribe(s => console.log(s));
store.dispatch({ type: "INCREMENT" });  // logs 1
store.dispatch({ type: "INCREMENT" });  // logs 2
```

Senior follow-ups:

- "How do you handle async actions?" Middleware (Redux-thunk, Redux-saga). The store doesn't know about async; middleware intercepts actions and dispatches when async resolves.
- "How do you avoid re-rendering every component on every state change?" Selectors + memoization. Each component subscribes to a slice; re-renders only when that slice changes.
- "How does this compare to MobX?" Redux is explicit and verbose; MobX is implicit and reactive. Redux scales to large teams; MobX is faster to write for small projects.

## Common components library design

The IK curriculum asks about Bootstrap-style component libraries. The principles:

```
1. Composable primitives.
   <Button>, <Card>, <Modal>, <Input>.
   Each does one thing well.

2. Consistent API surface.
   Variants via prop: <Button variant="primary" size="md" />
   Slots via children: <Card><Card.Header>...</Card.Header></Card>

3. Themeable.
   Design tokens (colors, spacing, typography) via CSS custom properties.
   Theme switching at the root.

4. Accessible by default.
   Components ship with correct ARIA, keyboard nav, focus management.
   Consumers don't have to think about a11y.

5. Tree-shakable.
   import { Button } from 'lib'  brings only Button, not the whole library.

6. Documented with live examples.
   Storybook or similar.

7. Versioned with semver.
   Breaking changes = major version. Library users decide when to migrate.
```

The interview question: "you're designing a component library for an internal product. What's your first decision?" Answer: "Theming and design tokens. Get the primitives right; everything composes on top. Without that, components hardcode colors and break when the design system evolves."

## Framework evaluation

The IK module specifically asks about React vs Angular vs others.

```
React:
  + Largest ecosystem, most jobs, broadest hiring pool.
  + Concept of components + hooks scales well.
  + Server components / actions in App Router shift logic to the server.
  - "Framework" is loose; ecosystem fragmentation
    (CSS-in-JS, routing, state management — pick your own).
  - Reactivity is opt-in via hooks; missed dependencies cause bugs.

Vue:
  + Approachable, gradual adoption.
  + Reactivity is automatic (no useState/useMemo dance).
  + Strong template + single-file-component story.
  - Smaller hiring pool than React.

Svelte:
  + Compiled away to vanilla JS at build time.
  + Best bundle sizes of any major framework.
  + Reactive primitives feel native.
  - Smallest hiring pool of the three.
  - Newest, fewest battle-tested production patterns.

Angular:
  + Strongly typed, opinionated, "batteries included".
  + Used heavily at Google internally.
  - Bigger learning curve.
  - Hiring market less hot than React.

The senior take:
  Frameworks are mostly interchangeable from an architecture POV.
  Pick by team familiarity, hiring market, and product needs (SSR,
  bundle size, etc.). Don't pick by hype.
```

## Cross-framework portability

The IK module asks about portability. The senior answer involves Web Components or framework-agnostic primitives.

```
Approach 1 — Web Components:
  Build core UI as Web Components (using Lit or vanilla).
  Wrap with thin framework adapters (React wrapper, Vue wrapper).

  Pro: Truly portable.
  Con: Shadow DOM is awkward; theming is harder.

Approach 2 — Headless components:
  Build logic in framework-agnostic JS modules.
  Each framework has its own thin presentation layer.

  Example: Radix UI's primitives, react-aria's hooks.

Approach 3 — Code generation:
  Source of truth in one format (e.g., MDX, JSON spec, design tokens).
  Generate framework-specific code at build time.

  Pro: One source, many targets.
  Con: Build complexity.
```

For an interview answer: "I'd default to headless logic in framework-agnostic modules with thin per-framework presentation layers. Web Components are tempting but the developer experience for theming and SSR is still rough in 2026."

## Industry trends

The IK curriculum touches "industry trends in Front-end engineering and AI/ML." Quick takes:

```
- Server components (React 19+, Next App Router).
  Logic ships to the server; client gets HTML + minimal JS.
  The trend reverses 10 years of "everything is a SPA."

- Edge rendering.
  Render close to the user via Cloudflare Workers, Vercel Edge.
  Reduces TTFB by 100-300ms for global audiences.

- AI assistance in development.
  GitHub Copilot, Cursor, Claude Code.
  Senior FE engineers are productivity-multiplied by these.

- Streaming responses (LLM UX).
  Chat UIs need to render tokens as they arrive.
  This was niche in 2022; now it's standard.

- WASM in the browser.
  Heavy compute (image processing, video decoding) moves to WASM.
  Reduces JS bundle, faster cold start.

- AI features in products.
  Every B2C product is adding LLM features.
  FE engineers integrate LLMs (streaming, error handling, loading states).
```

## How interviewers probe FE system design

Three layers:

1. **Surface:** "Design a comment system." Tests basic component hierarchy and state.
2. **Standard:** "Design an infinite scroller for News Feed." Tests virtualization + caching.
3. **Twist:** "Your News Feed is rendering 60% slower on mobile than desktop. How do you debug?" Tests Performance API knowledge, mobile-specific bottlenecks (memory, slow CPU), bundle analysis, image strategy.

The twist layer is the senior bar. Practice the debugging questions; they show up often.

## The Interview Move

> *"For front-end system design, I drive from clarifying questions to architecture to deep dive on one or two components. The architecture for a Netflix-style player is: native <video> element + state machine for player state + adaptive bitrate manager + controls UI + accessibility layer. Components compose; state lives in a small reducer; performance comes from native acceleration and careful overlay layering. For an infinite scroller, virtualization is non-negotiable at >1000 items; Intersection Observer for load-more triggers, variable-height caching for measurement. For a News Feed, polymorphic item renderers, WebSocket for real-time, optimistic UI for likes, React Query for caching. Across all three, the senior signal is: accessibility from the start, performance budgets named, failure modes explicit, framework-agnostic where possible. Let me walk the architecture for whichever system you want."*

Three real systems, named with their architectural moves. Then offer the deep-dive choice. That's senior FE system design.

Next chapter: patterns, tools, techniques. The grab-bag of things that come up in the deep-technical and JS-coding slots.
