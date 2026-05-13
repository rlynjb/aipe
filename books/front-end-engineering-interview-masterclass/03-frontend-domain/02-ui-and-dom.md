# Chapter 3.2 — UI and DOM

**IK Section III, Module 2.** Reading time: 28 minutes.

> The UI-build slot is what separates frontend engineers from generalists. You get 45 minutes, a blank editor, and a prompt like "build a typeahead dropdown" or "build a tooltip that follows the cursor." No framework. No starter code. Vanilla HTML, CSS, and JavaScript. The interviewer watches you reason through the markup, the styles, the events, and the accessibility.

## What FAANG actually expects

The UI-build interview has a fixed shape across companies:

```
Minute 0-3:    Clarifying questions about the spec.
Minute 3-10:   HTML structure — semantic, accessible, complete.
Minute 10-25:  CSS — layout, sizing, responsive, transitions.
Minute 25-40:  JavaScript — events, state, dynamic behavior.
Minute 40-45:  Edge cases — accessibility, keyboard, screen reader,
               edge content (long strings, empty data).
```

The grading signals:

- **Semantic HTML.** Using `<button>` for buttons, `<nav>` for navigation, `<dialog>` for modals. Not divs everywhere.
- **Accessible by default.** Keyboard focusable, ARIA where needed, doesn't break screen readers.
- **CSS organization.** Class naming, scoping, responsiveness.
- **Event handling.** Right scope, no leaks, proper cleanup.
- **State management.** Where state lives, how it propagates.
- **Edge cases handled.** Long content, no content, very wide screens, very narrow screens, touch vs mouse.

## The structured approach

Every UI-build problem decomposes into the same steps. The IK curriculum drills this.

```
Step 1 — Understand the spec.
  What does the component look like in the default state?
  What states does it have? (hover, focus, disabled, loading, error)
  How does it respond to user input?
  What are the edge cases? (very long content, no content, tons of items)

Step 2 — Sketch the HTML.
  What semantic elements?
  What hierarchy?
  What ARIA attributes?

Step 3 — Sketch the CSS.
  What layout? (flexbox, grid, positioning)
  What variables / design tokens?
  What media queries?

Step 4 — Wire the JavaScript.
  What state?
  What events?
  What DOM mutations?

Step 5 — Test edge cases.
  Empty data.
  Long content.
  Keyboard nav.
  Click outside to close.
  Window resize.
```

The senior signal is walking this structure explicitly: "Before I start coding, let me think about the spec, then sketch the HTML, then add CSS, then JS, then test edge cases." That announces process to the interviewer.

## Reusable component setup — the dropdown example

The IK curriculum specifically asks for dropdowns. Walk through the structure.

```
HTML:

<div class="dropdown" data-state="closed">
  <button class="dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded="false">
    Select an option
    <span class="caret" aria-hidden="true">▼</span>
  </button>

  <ul class="dropdown-menu" role="listbox" hidden>
    <li role="option" tabindex="-1">Option 1</li>
    <li role="option" tabindex="-1">Option 2</li>
    <li role="option" tabindex="-1">Option 3</li>
  </ul>
</div>

Key points:
  - <button> is the trigger (keyboard-focusable, screen-reader-friendly).
  - aria-haspopup="listbox" tells AT: this opens a list.
  - aria-expanded mirrors the state.
  - <ul role="listbox"> is the popup. role="option" on items.
  - hidden hides from layout AND from screen readers.
```

```
CSS:

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  /* style for the visible trigger button */
  cursor: pointer;
  padding: 8px 12px;
  border: 1px solid #ccc;
  background: white;
}

.dropdown-menu {
  position: absolute;       /* absolute relative to .dropdown */
  top: 100%;                /* below the trigger */
  left: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid #ccc;
  min-width: 100%;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.dropdown-menu li[role="option"] {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-menu li[role="option"]:hover,
.dropdown-menu li[role="option"]:focus {
  background: #f0f0f0;
  outline: none;
}

@media (max-width: 480px) {
  .dropdown-menu {
    /* on mobile, you might want fullscreen behavior */
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    max-height: none;
  }
}
```

```
JavaScript:

const dropdown = document.querySelector(".dropdown");
const trigger = dropdown.querySelector(".dropdown-trigger");
const menu = dropdown.querySelector(".dropdown-menu");

function toggle() {
  const open = dropdown.dataset.state === "open";
  if (open) close();
  else openMenu();
}

function openMenu() {
  dropdown.dataset.state = "open";
  trigger.setAttribute("aria-expanded", "true");
  menu.removeAttribute("hidden");

  document.addEventListener("click", onDocumentClick);
  document.addEventListener("keydown", onKeyDown);

  // focus first option for keyboard nav
  menu.querySelector('[role="option"]')?.focus();
}

function close() {
  dropdown.dataset.state = "closed";
  trigger.setAttribute("aria-expanded", "false");
  menu.setAttribute("hidden", "");

  document.removeEventListener("click", onDocumentClick);
  document.removeEventListener("keydown", onKeyDown);

  trigger.focus();
}

function onDocumentClick(e) {
  if (!dropdown.contains(e.target)) close();
}

function onKeyDown(e) {
  if (e.key === "Escape") return close();

  const options = [...menu.querySelectorAll('[role="option"]')];
  const current = options.indexOf(document.activeElement);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    options[(current + 1) % options.length].focus();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    options[(current - 1 + options.length) % options.length].focus();
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    document.activeElement.click();
  }
}

trigger.addEventListener("click", toggle);
```

This is ~50 lines of code that demonstrates: semantic HTML, ARIA, focus management, keyboard navigation, click-outside-to-close, event cleanup on close, state mirrored in data attributes and ARIA. **Every one of those is graded.** A candidate who writes a beautiful dropdown but forgets keyboard nav signals junior.

## The tooltip pattern

Different problem, same approach.

```
HTML:

<button class="trigger" aria-describedby="tip-1">
  Hover me
</button>
<div id="tip-1" role="tooltip" hidden>
  This is the tooltip content.
</div>

Key: aria-describedby ties the trigger to the tooltip ID.
     Screen readers announce the tooltip when the trigger is
     focused.
```

```
CSS:

.trigger {
  position: relative;
}

#tip-1 {
  position: absolute;
  background: #333;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
}

/* Position above the trigger */
#tip-1::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #333;
}
```

```
JavaScript:

const trigger = document.querySelector(".trigger");
const tooltip = document.getElementById("tip-1");

function show() {
  tooltip.removeAttribute("hidden");
  positionTooltip();
}

function hide() {
  tooltip.setAttribute("hidden", "");
}

function positionTooltip() {
  const rect = trigger.getBoundingClientRect();
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
  tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
}

trigger.addEventListener("mouseenter", show);
trigger.addEventListener("mouseleave", hide);
trigger.addEventListener("focus", show);     // accessibility: keyboard too
trigger.addEventListener("blur", hide);

window.addEventListener("resize", positionTooltip);
window.addEventListener("scroll", positionTooltip, { passive: true });
```

The senior-vs-junior signal here: keyboard accessibility. Junior devs add `mouseenter`/`mouseleave` only. Senior devs also add `focus`/`blur` because tooltips need to work for keyboard users.

Modern shortcut: CSS-only tooltips via `:hover` on the trigger + adjacent sibling selector for the tooltip. The interview asks you to do it in JS, though, because they want to see event handling.

## Progress button (loading state)

```
HTML:

<button id="submit"
        aria-busy="false"
        aria-live="polite">
  Submit
</button>

CSS:

#submit[aria-busy="true"] {
  cursor: wait;
  opacity: 0.6;
}

#submit[aria-busy="true"]::after {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 8px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

JavaScript:

const button = document.getElementById("submit");

button.addEventListener("click", async () => {
  if (button.getAttribute("aria-busy") === "true") return;

  button.setAttribute("aria-busy", "true");
  button.disabled = true;

  try {
    await submit();
    button.textContent = "Done!";
  } catch (e) {
    button.textContent = "Error — try again";
  } finally {
    button.setAttribute("aria-busy", "false");
    button.disabled = false;
  }
});
```

The senior moves: use `aria-busy` and `aria-live` so screen readers announce state changes. Guard against double-clicks. Reset state in `finally` so errors don't leave the button stuck.

## Flexbox — the universal layout primitive

The IK curriculum specifically calls out flexbox. It's the answer to most layout questions.

The mental model:

```
.container {
  display: flex;
  flex-direction: row;   /* or column */

  /* Main axis (row = horizontal): */
  justify-content: flex-start | center | space-between | space-around;

  /* Cross axis (row = vertical): */
  align-items: stretch | center | flex-start | flex-end;

  flex-wrap: nowrap | wrap;  /* break onto next line if no space */
  gap: 16px;                 /* gap between items */
}

.item {
  flex: 1;                   /* grow to fill space */
  /* OR */
  flex: 0 0 200px;           /* fixed width, no grow, no shrink */
}
```

Common patterns to memorize:

```
Centered (both axes):
  .container { display: flex; justify-content: center; align-items: center; }

Equal columns:
  .container { display: flex; }
  .item { flex: 1; }

Sidebar + main:
  .container { display: flex; }
  .sidebar { flex: 0 0 250px; }
  .main { flex: 1; }

Header / body / footer (column):
  .container { display: flex; flex-direction: column; min-height: 100vh; }
  .header { flex: 0 0 auto; }
  .body { flex: 1; }
  .footer { flex: 0 0 auto; }

Wrapping responsive grid:
  .container { display: flex; flex-wrap: wrap; gap: 16px; }
  .item { flex: 1 1 200px; }   /* grow, shrink, base 200px */
```

For 2D layouts (rows AND columns with explicit alignment), use Grid instead. For 1D layouts (rows OR columns), Flexbox is simpler.

## Modern strategies for connecting JS to UI

```
Pattern 1 — Direct DOM manipulation:
  element.classList.add("active");
  element.textContent = "Hello";

  Pro: simple, no framework. Cheap.
  Con: state lives in the DOM; hard to scale.

Pattern 2 — Data attributes + CSS:
  element.dataset.state = "loading";

  /* CSS: */
  [data-state="loading"] { opacity: 0.5; }

  Pro: separates state semantic from style.
  Con: still ad-hoc.

Pattern 3 — Custom events:
  element.dispatchEvent(new CustomEvent("toggle", { detail: { ... } }));
  otherElement.addEventListener("toggle", e => /* respond */);

  Pro: decouples components.
  Con: harder to debug; events are fire-and-forget.

Pattern 4 — Small state library:
  const state = createStore({ counter: 0 });
  state.subscribe(s => render(s));

  Pro: testable, framework-agnostic.
  Con: requires writing or pulling in the library.

Pattern 5 — Web Components:
  class MyComponent extends HTMLElement { ... }
  customElements.define("my-component", MyComponent);

  Pro: encapsulated, reusable, no framework lock-in.
  Con: shadow DOM is awkward; ecosystem is smaller than React.

Pattern 6 — Framework (React, Vue, Svelte):
  <Counter value={count} onIncrement={() => setCount(count + 1)} />

  Pro: huge ecosystem, declarative, well-known.
  Con: bundle size, learning curve, framework lock-in.
```

The interview probe: "for this UI build, what would you use?" The right answer depends on the spec. For a 45-minute UI build, direct DOM + data attributes is usually the right choice — fast to write, no framework to set up. For a production system, frameworks have already won.

## Design-centric problem management

```
The IK curriculum's framing:

  1. Read the spec carefully.
  2. Identify the design tokens (colors, spacing, font sizes).
  3. Identify the components (reusable pieces).
  4. Identify the states (default, hover, focus, active, disabled, error).
  5. Identify the interactions (clicks, drags, hovers, keyboard).
  6. Identify the responsive breakpoints (mobile, tablet, desktop).
  7. Identify accessibility requirements (keyboard nav, screen reader,
     color contrast, focus indicators).

Then build, in that order:
  - Tokens (CSS custom properties).
  - Components (HTML + scoped CSS).
  - States (CSS variants + JS toggles).
  - Interactions (event handlers).
  - Responsive (media queries).
  - Accessibility (ARIA, keyboard, contrast).
```

## How interviewers probe UI builds

Three layers:

1. **Surface:** "Build a button that increments a counter when clicked."
   Tests: basic HTML + CSS + event handler.

2. **Standard:** "Build a typeahead dropdown that fetches suggestions as the user types."
   Tests: debounced input handler + async fetch + DOM updates + keyboard nav.

3. **Twist:** "Build the same typeahead, but it must handle 10,000 results in the dropdown without lag."
   Tests: virtualization (only render visible items), DOM reuse, throttled scroll handler.

The twist layer is the senior bar. Virtualization on a 45-minute timer is hard. Practice it before the interview.

## Common UI build problems (memorize the templates)

```
- Dropdown / select.
- Typeahead with debounced search.
- Tooltip that positions itself.
- Modal / dialog with focus trap.
- Tabs.
- Accordion.
- Infinite scroll list.
- Drag-and-drop reorder.
- Image carousel with autoplay.
- Star rating component.
- Progress bar.
- Toast notifications stack.
- Form with validation.
- Color picker.
- Date picker.
```

Practice 5-10 of these from scratch. Each is a 30-45 minute exercise. The pattern across all of them: structured HTML, scoped CSS, careful event handling, accessibility from the start.

## A note on accessibility

This is where junior FE candidates lose the slot. Senior FE candidates show accessibility instinct throughout.

```
Accessibility checklist for every UI build:

  HTML:
    - Use semantic elements (<button>, <nav>, <main>, <dialog>).
    - Provide alt text for images.
    - Label form inputs (<label for=> or aria-label).

  Keyboard:
    - All interactive elements focusable via Tab.
    - Escape closes modals/dropdowns.
    - Enter/Space activates buttons.
    - Arrow keys navigate lists/menus.
    - Focus trapped in open modals.

  ARIA:
    - aria-expanded on toggleable disclosure.
    - aria-haspopup on triggers that open lists.
    - aria-busy on async-loading elements.
    - aria-live on dynamically-updating regions.
    - role= when semantic HTML isn't enough.

  Visual:
    - Focus indicators visible (don't blanket-remove outline).
    - Color contrast ≥ 4.5:1 for text.
    - Don't rely on color alone to convey meaning.

  Motion:
    - Respect prefers-reduced-motion.
    - Animations < 5 seconds, with pause control if longer.
```

Senior FE candidates *talk through* accessibility while building. "Let me add aria-expanded to the trigger so screen readers know it's a disclosure." That's signal.

## The Interview Move

> *"For UI builds, my approach is structured: clarify the spec, sketch semantic HTML, scope the CSS with logical class names, wire JS for state and events, then test edge cases with a focus on accessibility. I default to native HTML elements — `<button>` for buttons, `<dialog>` for modals — and reach for ARIA only when the native semantics aren't enough. I handle keyboard nav explicitly (Escape closes, arrow keys navigate lists, focus trapping in modals). I separate state from view by using data attributes that CSS can hook into. Events are cleaned up on teardown to avoid leaks. The 45-minute slot is tight; I avoid premature abstraction and lean on the platform."*

Process. Standards. Accessibility. Cleanup. That's the senior UI-build answer.

Next chapter: front-end system design. The 45-minute slot where you design Netflix's video player or Facebook's News Feed.
