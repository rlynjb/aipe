# Chapter 4 — Career Coaching for Front-End

**IK Section IV.** Reading time: 18 minutes.

> Most of the strategy, behavioral, and negotiation content from the ML book's career chapter applies here unchanged. This chapter covers the FE-specific differences in loop shape, signal weighting, and the cross-team interview where FE engineers prove they're not just "the React person."

## What's different about the FE loop

If you've read the ML book's career chapter, the negotiation mechanics and STAR framework apply directly — those are universal. The differences for the FE-specific loop are:

```
ML loop emphasis:                FE loop emphasis:
  DSA: 2 slots                     DSA: 1-2 slots
  System design: 1 slot            System design: 1 slot (FE-flavored)
  ML system design: 1 slot         UI build: 1 slot (live coding)
  ML fundamentals: 0-1 slot        JS coding: 1 slot (language depth)
  Behavioral: 1 slot               FE system design: 1 slot
  Bar raiser: 1 slot               Behavioral: 1 slot
                                   Bar raiser: 1 slot
```

The FE loop has fewer DSA slots and more domain slots. The signal is shifted toward "can you build a UI from scratch" and "can you reason about front-end systems at scale."

## The FE-specific slots

### JavaScript coding slot

What it tests:
- Language-level fluency. Closures, `this`, async, prototypes.
- Implementing common utilities from scratch (debounce, throttle, curry, memoize).
- Reasoning about the event loop and microtasks.

What strong FE candidates do:
- Talk through `this` rules before writing code.
- Pick the right data structure (Map vs object) and explain why.
- Handle async errors explicitly.
- Test their solution with examples before declaring done.

What weak FE candidates do:
- Reach for jQuery- or React-style solutions in vanilla JS contexts.
- Get tangled in `this` and don't recover.
- Skip error handling on promises.
- Don't test their code; the interviewer finds the bug.

### UI-build slot

What it tests:
- Semantic HTML and CSS layout reasoning.
- Vanilla JS event handling and state management.
- Accessibility instincts (keyboard, ARIA, focus).
- Edge cases (empty data, long content, narrow viewports).

What strong FE candidates do:
- Sketch HTML before writing any code.
- Use semantic elements (button, dialog, nav).
- Add ARIA attributes as they build.
- Handle keyboard nav (Tab, Escape, arrow keys).
- Test edge cases at the end.

What weak FE candidates do:
- Build div-soup HTML.
- Implement only mouse interactions; forget keyboard.
- Skip cleanup of event listeners.
- Don't handle long content overflow.

### Front-end system design slot

What it tests:
- Reasoning about bundle architecture, render performance, state shape.
- Handling real-world product surfaces (Netflix player, infinite scroll, News Feed).
- Framework decisions and tradeoffs.
- Scale: how does the system behave at 10× users or 10× data?

What strong FE candidates do:
- Drive the conversation; ask clarifying questions; pick a deep dive deliberately.
- Discuss performance budgets explicitly (16ms frame, 50KB bundle, 2s TTFB).
- Name failure modes and mitigations.
- Connect FE concepts to backend (cache layers, CDN, observability) — show you think about the full stack.

What weak FE candidates do:
- Describe React features instead of system architecture.
- Skip performance discussion entirely.
- Don't think about offline / network failure.
- Avoid the cross-team conversation (FE-only thinking).

## What FAANG companies weight differently

Each FAANG has its own emphasis for FE candidates. Tendencies (these shift over time):

```
Google:
  Heavy on DSA, even for FE roles.
  System design and FE system design both required.
  Bar raiser will probe scope and impact at senior+.

Meta:
  Heavy on UI build and FE system design.
  React-specific knowledge expected.
  Behavioral interview is a major signal (Meta culture-fit).
  
Netflix:
  Strong emphasis on JavaScript depth and FE system design.
  Bar raiser is rigorous; expect Staff-level conversations.
  Compensation is unusually high.

Stripe:
  TypeScript fluency expected.
  Code-review interviews common (review a real PR).
  Less emphasis on whiteboard; more on real-codebase work.

Airbnb:
  Designed/styled UI gets weighted; visual polish matters.
  Behavioral signal around values is strong.
  Performance focus (large-scale image content).

Shopify:
  Strong Ruby/Rails culture even on FE side.
  Liquid templating knowledge bonus.
  Solid technical depth expected at senior+.
```

The senior signal across all of them: you can pivot the conversation. If they want React depth, you go deep on hooks and render performance. If they want CSS depth, you walk Flexbox vs Grid and explain transform vs layout. If they want JS depth, you walk closures and async control flow.

## Stories you need ready (FE-specific)

The ML book's career chapter covered the general STAR-framework stories. Three FE-specific ones to have ready:

```
A) "Walk me through a UI you're proud of."
   Concrete, polished, complex. Talk about: the design system you
   built or used, the accessibility decisions, the performance
   work, the failure mode you handled.

   Bad version: "I built a dashboard with charts."
   Good version: "I built a real-time monitoring dashboard for our
                  data center's traffic. It rendered 10k data
                  points at 60fps using Canvas; I introduced
                  virtualization for the metric list; it shipped
                  with keyboard nav and screen-reader support; I
                  benchmarked p99 frame time at 8ms on mid-tier
                  hardware."

B) "Tell me about a performance problem you debugged."
   FE-specific. The interviewer wants to see methodical debugging.
   The shape of the story: I noticed X was slow → I measured with
   tool Y → I found bottleneck Z → I changed approach W → it improved
   N%.

   Tools to mention: Chrome DevTools (Performance, Network,
   Lighthouse), React Profiler, Web Vitals (LCP, CLS, FID), bundle
   analyzers (webpack-bundle-analyzer, source-map-explorer).

C) "Tell me about a tradeoff you made between feature and performance."
   Senior signal. Concrete tradeoff with measurements. "Adding
   client-side filtering improved UX but increased the bundle by
   40KB; I added it behind a route-based code split so it only
   ships to users on that page."
```

## Compensation negotiation for FE

The mechanics from the ML book apply directly. The FE-specific notes:

```
Compensation bands:
  L4/E4 (mid-senior):     $200-300k TC
  L5/E5 (senior):          $300-450k TC
  L6/E6 (staff):           $450-700k TC
  L7+/E7+ (sr staff/prin): $700k+ TC

These vary by company, location, and stock vesting.

Senior FE roles at FAANG:
  Often pay the same as senior backend roles.
  Companies have realized FE engineering is real engineering.
  Don't accept lower comp because someone implies FE pays less.

The single most-undervalued FE leverage:
  Multiple offers. If you have offers at Meta E5 and Google L5,
  use each to push the other up. 20-50% lift on equity grants
  is common.
```

## A common FE-candidate failure mode

The candidate who has 5+ years of React experience and bombs the JS-coding slot because they only know how React abstracts the DOM, not how the DOM actually works.

The fix: spend a week before the loop writing vanilla JS only. No React. Implement: a router, a form library, a small state library, an infinite scroll. You'll discover what React was doing for you and learn it explicitly.

The interviewer probes for this. "How would you implement this without React?" If your answer is "I'd use jQuery" or "I'd use Vue," you fail. The right answer is "I'd write it in vanilla JS using these primitives" and then do it.

## The senior FE interview move

For the bar-raiser slot (senior IC interviewing you), demonstrate **breadth + depth + judgment**.

```
Breadth:
  Talk about backend, infra, ML in passing. Show you're not just
  the React person. Mention CI/CD, observability, on-call. You've
  worked in a data center; that breadth shows.

Depth:
  Pick one FE area (rendering performance, build tooling, accessibility,
  state management) and go deep. Show you've operated at scale and
  debugged hard problems.

Judgment:
  Have opinions. "I'd use Tailwind because the design system needs to
  scale across 30 engineers and CSS Modules would fragment style
  ownership." Not: "Tailwind is good." Opinions backed by reasoning.
```

The bar raiser at Google or Meta is calibrating: are you E5, E6, or E7? Each level requires more breadth, more depth, more judgment. The way you talk about systems signals the level.

## The technical-deep-dive slot (some loops)

Some loops include a "deep dive with the team lead" slot. Open-ended discussion of your strongest area.

Pick wisely. Don't pretend to be deep in something you're not. The lead will probe; faking it shows.

Strong areas for a senior FE engineer to deep-dive on:

```
- React render performance and reconciliation internals.
- Bundle architecture: webpack/vite, code splitting, tree shaking.
- TypeScript type system depth (variance, conditional types,
  template literal types).
- CSS rendering pipeline: layout, paint, composite.
- Browser internals: event loop, microtask queue, animation frame.
- Accessibility (a11y) — full WCAG knowledge, screen reader testing.
- Build tooling — module systems, transformation pipelines.
- Performance measurement — Web Vitals, RUM, synthetic monitoring.
- Server components and the React 19+ architecture.
- A specific framework (React internals, Vue's reactivity system,
  Svelte's compilation).
```

You don't need depth in all of these. One or two is enough to anchor the conversation. The senior signal is *visible expertise* — you can teach the interviewer something they didn't know.

## How to use this chapter

Apply the strategy from the ML book's career chapter as the foundation. Layer in the FE-specific adjustments:

- Practice JS coding (debounce, throttle, curry, etc.) until automatic.
- Practice UI builds (5-10 of them) on a timer.
- Practice FE system design (Netflix, infinite scroll, News Feed) — 45 minutes each.
- Build the FE-specific stories with measurements.
- Have a deep-dive topic ready for the lead interview.

## The Interview Move

> *"For the FE loop, my preparation is split: DSA and system design from the shared modules, JavaScript depth via daily practice of utility implementations, UI builds with full accessibility and edge-case coverage, FE system design via the case-study templates — Netflix player, infinite scroller, News Feed. I have three FE-specific stories ready with measurements: a UI I built and shipped, a performance problem I debugged, a feature-vs-performance tradeoff I made. For the deep dive I lead with my strongest area — typically rendering performance or accessibility — and let the interviewer probe. For negotiation, I follow the same play: don't take the first offer, push for competing offers, counter once or twice, get everything in writing. FE pays the same as backend at senior+; don't anchor low because of historical bias."*

That's the senior FE candidate's loop plan, in one paragraph.

---

## Closing

You've now read both IK books — Machine Learning Interview Masterclass and Front-End Engineering Interview Masterclass. The combination covers ~32 weeks of IK content, two FAANG career paths, and the interview shapes for both.

Pick the one that matches where you want to go in the next five years. Both lead to senior+ compensation at companies you'll recognize. The technical content of both is rigorous; the IK practice (mocks, coaching) is what converts reading into offers.

Good luck. Go take the mocks.
