# Chapter 3.4 — Patterns, Tools, and Techniques

**IK Section III, Module 4.** Reading time: 25 minutes.

> The grab-bag of front-end fundamentals that come up everywhere — coding interviews, system design follow-ups, behavioral "tell me about a bug you debugged." This chapter is the unfashionable but load-bearing depth that separates a senior FE engineer from a strong React user.

## `==` vs `===` — and why this still matters

The classic interview question. Answer cleanly:

```
== is loose equality.
  Type coercion happens before comparison.
  0 == false      // true
  "" == 0         // true
  null == undefined  // true
  "5" == 5        // true

=== is strict equality.
  No type coercion.
  0 === false     // false
  "" === 0        // false
  null === undefined  // false
  "5" === 5       // false
```

The rule in production: **always use ===** unless you have a specific reason to allow coercion (rare). ESLint configs at most companies require `===`.

The senior answer to "when would you use ==?" is "I don't, but the one historical exception is `x == null` to check for both null and undefined in one comparison." Even that's better written as `x === null || x === undefined` or just `x == null` if you've configured your linter to allow it specifically.

## Classical vs prototypal inheritance

JavaScript is prototypal. The class syntax (ES2015+) is sugar over prototypes.

```
Classical (Java-style):
  class Animal { ... }
  class Dog extends Animal { ... }

  Each instance is a separate "type" with copied methods.

Prototypal (JavaScript's actual model):
  Each object has a [[Prototype]] reference.
  Method lookup walks the prototype chain.

  function Animal() { this.kind = "animal"; }
  Animal.prototype.makeSound = function() { ... };

  function Dog() { Animal.call(this); }
  Dog.prototype = Object.create(Animal.prototype);
  Dog.prototype.constructor = Dog;
  Dog.prototype.bark = function() { ... };

  ES6 class is sugar:
  class Animal {
    constructor() { this.kind = "animal"; }
    makeSound() { ... }
  }
  class Dog extends Animal {
    bark() { ... }
  }
```

The chain in practice:

```
const d = new Dog();

d.bark();        // found on Dog.prototype
d.makeSound();   // not on Dog.prototype, walks up to Animal.prototype
d.toString();    // walks further up to Object.prototype

d.__proto__ === Dog.prototype;             // true
Dog.prototype.__proto__ === Animal.prototype;  // true
Animal.prototype.__proto__ === Object.prototype;  // true
Object.prototype.__proto__ === null;        // true (root)
```

Why this matters:

- **Memory efficiency.** Methods on the prototype are shared across all instances. Methods on the instance (e.g., `this.method = () => ...` in a constructor) are duplicated per instance.
- **Dynamic.** You can add methods to a prototype at runtime; all existing instances get them.
- **Debug-time inspection.** `obj.__proto__.constructor.name` tells you the class.

The interview probe: "what's `__proto__`?" The internal prototype reference of an object. Accessible via the deprecated `__proto__` getter or the standard `Object.getPrototypeOf(obj)`.

## Functional vs OOP in JavaScript

Both styles work. JS supports both. Senior engineers pick deliberately.

```
OOP style:
  class Counter {
    constructor() { this.count = 0; }
    increment() { this.count += 1; }
    decrement() { this.count -= 1; }
  }
  const c = new Counter();
  c.increment();

  Pro: encapsulates state with behavior.
  Con: `this` confusion, mutation makes testing harder.

Functional style:
  function createCounter() {
    let count = 0;
    return {
      increment: () => count += 1,
      decrement: () => count -= 1,
      get count() { return count; },
    };
  }
  const c = createCounter();
  c.increment();

  Pro: no `this`, no prototypes, closures encapsulate state.
  Con: each instance has its own copies of methods (memory cost).

Pure functional style:
  function counter(state, action) {
    switch (action.type) {
      case "increment": return { count: state.count + 1 };
      case "decrement": return { count: state.count - 1 };
      default: return state;
    }
  }
  let state = { count: 0 };
  state = counter(state, { type: "increment" });

  Pro: immutable, testable, predictable.
  Con: more verbose; state must be threaded through.
```

In modern React, the functional style dominates (hooks are functional). For very large class hierarchies (a complex form library with deep inheritance), OOP can be cleaner. Pick deliberately.

## Storage options — cookies, localStorage, sessionStorage, IndexedDB

```
Cookies:
  Sent with every HTTP request to the same domain.
  Used for: authentication tokens, server-side session IDs.
  Max ~4KB per cookie.
  Set via Set-Cookie header (server) or document.cookie (client).
  Security flags: Secure, HttpOnly, SameSite.
  Performance cost: included in every request.

localStorage:
  Persists across sessions. Survives tab close, browser restart.
  Per-origin storage; up to ~5-10MB.
  Synchronous API (blocks main thread on read/write).
  String-only (serialize objects as JSON).
  Use for: user preferences, recently viewed items.

sessionStorage:
  Same API as localStorage.
  Cleared when the tab closes.
  Per-tab storage (not shared between tabs of the same origin).
  Use for: in-session state that shouldn't survive a reload-and-close.

IndexedDB:
  Asynchronous, structured, large (gigabytes possible).
  Indexed queries (efficient lookups by key).
  Use for: offline-first apps, large local caches,
           any data > localStorage's 5MB.
  Complex API; people usually use a wrapper (Dexie, idb).
```

The interview probe: "where would you store the auth token?" The answer depends on context:

- **HttpOnly cookie + SameSite=Strict** for server-managed sessions. Browser sends automatically; JS can't read it (XSS-safe).
- **localStorage** if the API uses bearer tokens and the SPA needs to read the token to attach it to fetch requests. Lower XSS safety; need to mitigate via CSP.
- **In-memory only** for highly sensitive tokens (refreshed via separate refresh-token cookie).

There's no universal best answer; the senior signal is naming the security tradeoffs.

## Internationalization (i18n)

The IK module specifically flags this. Quick coverage:

```
Pattern: separate strings from code.

  // Bad:
  return <h1>Welcome, {name}!</h1>;

  // Good:
  return <h1>{t("welcome", { name })}</h1>;

  Where t() looks up a string in the current locale's translation file:
    en: { welcome: "Welcome, {name}!" }
    es: { welcome: "¡Bienvenido, {name}!" }
    ja: { welcome: "ようこそ、{name}さん!" }

The hard parts:

  - Pluralization. "1 item" vs "5 items" — and locales with multiple
    plural forms (Russian has 3, Arabic has 6).
    Use ICU MessageFormat: "{count, plural, =0 {no items} =1 {1 item}
                            other {# items}}"

  - Date/time formatting. Use Intl.DateTimeFormat — locale-aware,
    timezone-aware, format-aware.

  - Number formatting. Intl.NumberFormat — currency, decimal separators,
    thousands separators all vary by locale.

  - RTL (right-to-left) languages. Arabic, Hebrew.
    Use CSS logical properties (margin-inline-start instead of
    margin-left), or HTML dir attribute.

  - Text expansion. German often 1.3x English. Japanese is often
    50% shorter. UIs that assume English length break in other
    languages.

  - Pluralization in components. <Counter count={5} /> needs to
    render "5 items"; the component must call t() not inline strings.
```

Libraries: react-intl, react-i18next, FormatJS. They all wrap the same Intl APIs and add a React-friendly layer.

The senior interview probe: "your app suddenly needs to support 5 new languages. What changes?"

- Extract all hardcoded strings to translation files.
- Add the new locale files; ship translations.
- Test text expansion on the longest expected strings.
- Test RTL if any new locale is RTL.
- Update date/number formatting to use Intl APIs.

This is a 2-week project for a typical app, much longer if i18n wasn't planned from the start.

## Accessibility (a11y) — keyboard events

The IK module specifically calls out keyboard events. The non-negotiables for senior FE:

```
Keyboard navigation:
  - Tab moves through focusable elements in DOM order.
  - Shift+Tab reverses.
  - Enter and Space activate buttons.
  - Arrow keys navigate within composite widgets (lists, menus,
    tabs, etc.).
  - Escape closes modals and dropdowns.

Focus management:
  - Visible focus indicators (don't blanket-remove outline:none).
  - Focus follows expected flow after dynamic changes.
  - Trap focus inside open modals (Tab cycles within modal,
    doesn't escape to background).
  - Return focus to the trigger when a modal closes.

ARIA roles for interactive elements:
  - role="button" if it acts like a button but isn't a <button>.
    But: prefer the actual <button> element.
  - role="dialog" + aria-modal for modals.
  - role="alert" or aria-live="assertive" for important
    dynamic content (errors).
  - aria-label or aria-labelledby for elements without
    visible text labels.

Form accessibility:
  - <label for="x"> properly associated with <input id="x">.
  - Required fields with aria-required="true".
  - Error messages with aria-describedby pointing to error text.
  - Disabled fields with disabled (HTML attribute, also styled
    visually).

Color and contrast:
  - WCAG AA: contrast 4.5:1 for normal text, 3:1 for large.
  - Don't rely on color alone for meaning (red error text +
    icon, not just red text).
```

The senior interview probe: "your designer's mockup has gray text on a slightly-lighter-gray background. What do you do?" Push back. Show the contrast ratio. Suggest alternatives. Don't ship inaccessible UI.

## Advanced CSS — positioning, transform, media queries

```
Positioning:

  static (default):
    Normal document flow.

  relative:
    In normal flow, but can offset with top/left/right/bottom
    relative to its normal position.
    Establishes a positioning context for descendants.

  absolute:
    Removed from normal flow. Positioned relative to the nearest
    positioned ancestor (or viewport if none).

  fixed:
    Removed from normal flow. Positioned relative to the viewport
    regardless of scroll.

  sticky:
    Behaves as relative until a scroll threshold is crossed, then
    behaves as fixed.

z-index:
  Controls stacking order. Higher numbers stack on top.
  Only applies to positioned elements (relative, absolute, fixed,
  sticky).
  Creates stacking contexts at certain values (auto for normal,
  numeric for explicit).
```

```
Transform for animation:

  transform: translate(x, y);
  transform: scale(x, y);
  transform: rotate(deg);
  transform: matrix(a, b, c, d, e, f);

Why transform is the right tool for animation:

  - Transform changes are GPU-accelerated.
  - They don't trigger layout (reflow).
  - They don't trigger paint.
  - They run on the compositor thread.

Compare to changing top/left/width/height:
  - These trigger layout and paint.
  - Cause jank on slow devices.
  - Especially bad on mobile.

Rule: animate transform and opacity. Almost nothing else.
```

```
Media queries:

  @media (max-width: 768px) { /* mobile */ }
  @media (min-width: 769px) and (max-width: 1024px) { /* tablet */ }
  @media (min-width: 1025px) { /* desktop */ }
  @media (prefers-reduced-motion: reduce) { /* a11y */ }
  @media (prefers-color-scheme: dark) { /* dark mode */ }
  @media (hover: hover) { /* devices with hover; not mobile touch */ }

Container queries (newer):

  @container (min-width: 400px) { /* style based on parent size */ }

  Allows components to be responsive based on their container,
  not the viewport. Lets the same component look right whether
  it's in a wide layout or a narrow sidebar.
```

The interview probe: "your component breaks on mobile. What's the first thing you check?" Media query breakpoints. Then: touch-vs-mouse interactions. Then: viewport meta tag.

## Tricky interview problems

```
Problem 1 — Animate away on click.

  When the user clicks a button, animate the button out
  smoothly, then remove it from the DOM.

  button.addEventListener("click", () => {
    button.style.transition = "opacity 300ms";
    button.style.opacity = "0";
    button.addEventListener("transitionend", () => {
      button.remove();
    }, { once: true });
  });

  Senior touches:
    - transitionend event for clean DOM removal.
    - { once: true } so the listener self-cleans.
    - Don't use setTimeout(300); the transition might be
      different duration on different devices.

Problem 2 — Tab key handling.

  When the user opens a modal, trap focus inside the modal.
  Tab moves through focusable elements within; Shift+Tab
  reverses; both wrap.

  function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'textarea:not([disabled]), select:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    first.focus();
  }

Problem 3 — Click outside.

  Detect when the user clicks outside a specific element.

  function onClickOutside(element, callback) {
    function handle(event) {
      if (!element.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }

  Senior touches:
    - Return a cleanup function (caller controls teardown).
    - Listen on document, not window (different event flow).
    - Check element.contains, not strict equality.

Problem 4 — Lazy image loading.

  Load images only when they're about to enter the viewport.

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "50px" }
  );

  document.querySelectorAll("img[data-src]").forEach(img => {
    observer.observe(img);
  });

  Modern alternative: <img loading="lazy" src="..." />
  Native browser support, no JS needed.
```

## Implementation on existing code

The IK module calls out "Implementation on existing code solutions for score improvement." This is the kind of question where the interviewer gives you a broken or suboptimal code snippet and asks you to improve it.

The framework:

```
1. Read the code carefully.
2. Identify what it does well.
3. Identify what's wrong or could be better:
   - Correctness bugs.
   - Performance issues.
   - Accessibility gaps.
   - Maintainability problems.
4. Prioritize fixes.
5. Make the changes, explaining each.

Common bad-patterns to spot:

  - Inline event handlers in JSX that create new functions each render.
    Fix: useCallback, or hoist outside the component.

  - Direct DOM manipulation in React.
    Fix: state-driven rendering; useRef only when necessary.

  - Async without error handling.
    Fix: try/catch or .catch.

  - State updates that depend on previous state without using updater.
    Fix: setCount(prev => prev + 1) instead of setCount(count + 1).

  - Missing keys on list items.
    Fix: stable, unique keys (not array index when items can reorder).

  - useEffect with missing dependencies.
    Fix: include all deps; eslint-plugin-react-hooks catches this.

  - Mutation of state directly.
    Fix: spread/clone; immutable updates.
```

The senior interview move: prioritize the fixes. Don't try to fix everything in 10 minutes. Pick the 2-3 highest-impact changes and explain why.

## How interviewers probe this category

Three layers:

1. **Surface:** "What's the difference between == and ===?" Tests basic JS knowledge.
2. **Standard:** "Walk me through this React code and fix what you'd improve." Tests code review skill.
3. **Twist:** "Your app is slow on a 3G connection from a low-end Android device. What changes?" Tests performance instincts: bundle size, image compression, lazy loading, server-side rendering, etc.

The twist layer is the senior bar. Have a checklist memorized.

## The Interview Move

> *"For patterns and fundamentals questions, I default to: === over ==, functional style with hooks in React, native HTML elements before reaching for ARIA, transform and opacity for animations, lazy loading for images and below-the-fold components. Storage choices map to use case — HttpOnly cookies for sessions, localStorage for preferences, IndexedDB for large client-side caches. Accessibility is non-negotiable: keyboard nav from the start, semantic HTML, contrast ratios checked, focus management in modals. When reviewing existing code I prioritize correctness bugs first, then performance, then maintainability — and I explain why each change matters. Let me work through your specific problem."*

That's the senior fundamentals answer. You named your defaults; you named the priority order; you named accessibility as non-negotiable. Then you solve their problem.

You've finished Section III — the FE Domain Course. Combined with Sections I and II (DSA and System Design from the ML book), you've covered every technical area in the IK Front-End Engineering Interview Masterclass.

Next chapter: career coaching for the FE-specific loop.
