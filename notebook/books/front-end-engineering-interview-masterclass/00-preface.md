# Preface — The IK Front-End Course as a Book

Interview Kickstart's Front-End Engineering Interview Masterclass is a structured 15-week program built around what FAANG actually asks in front-end interviews. Live classes, mock interviews, six months of support.

This is the book version. Same curriculum. Same four sections. Different format.

The structural similarity to the ML book in the parent folder is intentional — IK uses the same DSA and System Design modules across all their domain tracks (ML, FE, mobile, etc.). The differentiator is the third section: the Front-End Domain Course. That's the four chapters in this book that justify its existence.

## Why a separate FE book

You came to AI engineering with 8+ years of frontend experience. Your previous instinct in this curriculum was "I should pivot to ML." That's one valid path. There's another: **stay in front-end, but level up to senior or staff at FAANG**. The compensation is competitive ($300k-500k TC for staff FE), the work is rewarding, and your existing skills compound rather than reset.

The Front-End Engineering Masterclass is the path to that promotion. The interview shape is different from ML or backend roles:

```
FAANG FE loop (4-6 slots):

  Phone screen:    DSA coding (45 min), sometimes JS-specific.

  Onsite Day 1:
    Slot 1:  DSA coding (general algorithms)
    Slot 2:  JS coding (language-specific challenges)
    Slot 3:  UI build (HTML + CSS + vanilla JS)
    Slot 4:  Front-end system design (Netflix, infinite scroll, etc.)
    Slot 5:  Behavioral / culture
    Slot 6:  Bar-raiser or hiring manager
```

The middle three slots are what separates FE candidates from generalist engineers who happen to know React. The IK curriculum (and this book) is built around mastering those.

## Who this book is written for

Same target reader as the ML book: a frontend engineer with 8+ years of experience, currently working at a data-center-adjacent role. You know:

- React/Vue/TypeScript at production scale
- Webpack, Vite, modern bundlers
- Browser APIs (fetch, history, IndexedDB, service workers)
- Performance optimization (bundle splitting, lazy loading)
- Accessibility (WCAG, screen readers, keyboard nav)
- State management patterns (Redux, Zustand, Recoil)

You're not new to engineering. You're new to **the interview shape FAANG uses for senior+ FE roles**. That shape probes deeper than "build a counter component" — it asks you to defend architectural decisions on systems serving billions of users.

## What the FE Domain Course covers

Four modules, four chapters in this book:

```
1. JavaScript Language and Libraries
   - "this" binding, arrow functions, scope
   - Built-in data structures: object vs Map vs Set vs Array
   - Currying, callbacks, promises
   - Memoization, existential get(), classic JS interview problems

2. UI and DOM
   - HTML + CSS + JS combined problems
   - Reusable component design (Dropdown, Tooltip, Progress Button)
   - Flexbox for complex layouts
   - DOM event delegation and binding

3. Front-End System Design
   - Design Netflix, Facebook homepage, Infinite Scroller, Instagram
   - Redux-style state management
   - Reusable UI component libraries (Bootstrap, Material UI)
   - Framework evaluation: React, Angular, Vue
   - Cross-framework, cross-platform, cross-device portability

4. Patterns, Tools, Techniques
   - == vs === (and why this still matters)
   - Classical vs prototypal inheritance
   - Cookies vs localStorage vs sessionStorage
   - Internationalization (i18n) and accessibility (a11y)
   - Advanced CSS: positioning, translate, media queries
   - Tricky problems: animate onClick, tab and keyboard events
```

This is what separates a strong React engineer from a senior FE engineer. The strong React engineer can ship features; the senior FE engineer can defend the architecture of the system underneath the features.

## Why front-end stayed hard

It used to be: frontend was "easy" compared to backend. Backend was systems work; frontend was forms.

Then frontend ate the world.

Modern frontend at FAANG handles:
- **Real-time collaborative state** (Figma, Notion, Google Docs)
- **Streaming video** (Netflix, YouTube)
- **Infinite-scale feeds** (Facebook, Instagram, TikTok)
- **Offline-first sync** (Notion, Linear, Superhuman)
- **Cross-platform code generation** (React Native, Flutter)
- **Performance optimization at every layer** (bundle splitting, edge rendering, server components)

The frontend at scale is a distributed system that lives partly in the browser and partly on edge servers, partly in CDNs and partly in service workers, partly in your app code and partly in libraries you don't control. Senior FE engineers reason about this stack the way backend engineers reason about microservices.

The IK course (and this book) treats frontend with that seriousness.

## The mapping to your background

Your data-center experience and your existing frontend experience both directly help:

- **From the data center:** caching layers, CDN behavior, network protocols (HTTP/2, HTTP/3, WebSocket), failure isolation, observability. All of these show up in front-end system design.
- **From frontend:** component composition, state management, render performance, event handling, accessibility. All of these are the foundation of the FE Domain Course.

The IK course is teaching you to articulate these instincts as **decisions defended with tradeoffs**, not just preferences.

## How to read

Same pattern as the ML book:

1. Read the chapter for the topic of the next IK live class.
2. Attend the live class.
3. Practice the LeetCode / FE problems IK assigns.
4. Take all the mock interviews IK offers.
5. Loop until each chapter's concepts are fluid under interview pressure.

For DSA and System Design (Sections I and II), the chapters are in the ML book in the sibling folder. Read those first if you haven't already.

## What this book is not

- **Not a React tutorial.** Frameworks come and go; this book teaches the principles underneath. If you want a React tutorial, the docs at react.dev are the source of truth.
- **Not a CSS reference.** CSS is named where it matters for interview problems (Flexbox, positioning, animation). For the long tail, MDN.
- **Not a substitute for the IK mocks.** The book is the substrate; the mocks are the practice.
- **Not optimistic about LeetCode-only prep.** The FE interview probes UI build and FE system design — neither shows up in LeetCode.

## The bar at FAANG for senior FE

The companies hiring senior FE in 2026 have a specific bar:

- Can you build a polished, accessible dropdown component in 30 minutes with vanilla JS and CSS, no framework?
- Can you design Netflix's video player from scratch, walking through buffering strategy, adaptive bitrate, CDN behavior, and offline state?
- Can you defend choosing React Server Components over a traditional SPA for a specific product surface?
- Can you explain the cost/benefit of Flexbox vs CSS Grid for a specific layout, and the cost/benefit of CSS-in-JS vs CSS Modules vs Tailwind?
- Have you ever debugged a memory leak in production frontend code, and can you walk through what you found?

By the time you finish this book and the IK course's mocks, every one of those answers will be a specific story tied to something you've shipped.

Let's start.
