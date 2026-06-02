# Audit Spec — Frontend Accessibility

Companion to `audit.md`. Same discipline (describe, don't act) applied to the accessibility surface of a frontend app. The audit produces a status report you can read — not a list of fixes to execute. Nothing gets changed. No work is proposed.

> **Read `audit.md` first.** This spec extends it. The discipline carries over; this one adds scan sections specific to a11y. When the audit surfaces problems worth acting on, they hand off to feature specs (for new capability) or fix mini-specs (for bugs), not to this spec.

Framework-agnostic. Applies to React, Vue, Svelte, Angular, vanilla JS, and any web frontend.


## When to run this

  - **Before claiming an app is "done"** — a11y is the most commonly skipped completeness check
  - **Before any portfolio publication or external sharing** — public-facing apps are held to a higher bar
  - **After major UI changes** — new screens, new flows, redesigns
  - **Periodic check-ins** — a11y regresses silently as features get added
  - **When preparing to brief someone else on the codebase** — interviewers may ask, and the honest answer is more valuable than a polished one

> This audit is not a WCAG compliance certification. It's a structured way to find the a11y problems most likely to exist in a frontend codebase, described in plain language. If you need formal compliance, the audit's output is a starting point, not an endpoint.


## What this audit does not do

  - **It doesn't fix anything.** No code changes.
  - **It doesn't propose fixes.** No "you should add X." Observations only.
  - **It doesn't grade.** No pass/fail, no severity scores. Problems are described, not ranked.
  - **It doesn't gate releases.** Use it whenever; it's a snapshot, not a checkpoint.

If you find yourself wanting to act on what the audit surfaces, hand off:

  - **Adding capability** (new keyboard handlers, focus management, announcements, skip links, ARIA live regions) → feature spec
  - **Fixing broken a11y** (existing handler doesn't work, focus escapes a modal, screen reader announces wrong thing) → fix mini-spec
  - **Restructuring markup without changing pixels** (`<div onClick>` → `<button>`, semantic landmark elements) → `refactor-frontend-visual.md`


## Step 1 — Run the scan

One pass through the app's UI surface, applying six lenses. Each lens finds different problems — running them separately keeps you from collapsing them into "vibes about a11y."


```
"Audit the accessibility of [app]. Produce a status
report covering the six lenses below. Be specific —
name screens, components, interactions, elements.
Do not propose fixes. Do not grade severity.
Describe what you observe."
```


### Lens 1 — Keyboard

Can everything be reached and operated without a mouse or touchscreen?

  - **Reachability** — interactive elements that can't be focused with Tab. Common culprits: `<div onClick>`, custom dropdowns, modals, carousels.
  - **Operability** — focused elements that don't respond to expected keys. Buttons that work with click but not Enter/Space. Menus that don't respond to arrow keys.
  - **Tab order** — focus moving in surprising ways. Visual order and tab order disagreeing. `tabindex` values above 0 forcing an unnatural sequence.
  - **Traps** — focus that gets stuck somewhere it shouldn't. Old-school example: an iframe that captures focus and won't release.
  - **Skip mechanisms** — long lists of nav links the user has to tab through to reach main content, with no way to skip.

> Method: unplug the mouse, or commit to not touching it. Try to use the app. Note everywhere you can't get to or can't operate.


### Lens 2 — Focus

Where focus is, where it goes, and whether you can see it.

  - **Focus visibility** — focused elements that don't show a visible focus indicator. `outline: none` without a replacement is the most common cause.
  - **Focus on route change** — navigating to a new page leaves focus where it was (often on the link that was clicked, now removed or in a different context). Should usually move to the new page's heading or main region.
  - **Focus on modal/dialog open** — opening a modal doesn't move focus into it. Closing doesn't return focus to the trigger.
  - **Focus traps in modals** — focus escapes a modal back to the page behind it via Tab.
  - **Focus on dynamic content** — content appearing (errors, toasts, expansion panels) without any focus consideration. May or may not be a problem depending on the content's purpose.
  - **Focus restoration** — closing a panel/menu/dialog and focus going to `<body>` instead of the element that opened it.

> Method: Tab through the app while watching the screen carefully. Open and close every modal, dropdown, drawer. Navigate between routes. Note everywhere the focus indicator disappears, jumps unexpectedly, or doesn't move when it should.


### Lens 3 — Semantics

Whether the markup means what it looks like it means.

  - **Landmarks** — pages without `<main>`, `<nav>`, `<header>`, `<footer>`. Assistive tech users navigate by landmarks; their absence makes the page one undifferentiated blob.
  - **Headings** — heading hierarchy that skips levels (`<h1>` then `<h3>`), pages with no `<h1>`, pages with multiple `<h1>`s, or `<div>` styled to look like headings without being headings.
  - **Buttons and links** — `<div onClick>` doing what a button should do; `<button>` doing what a link should do (navigating). Distinction: buttons trigger actions, links navigate.
  - **Lists** — sequences of items rendered as `<div>` instead of `<ul>` / `<ol>`. Assistive tech announces "list of 5 items" when it's a real list, which is useful context.
  - **Form structure** — inputs without `<label>`, labels not associated with their inputs (`for`/`id` missing), fieldsets and legends not used for grouped controls (radio groups, checkbox groups).
  - **Tables** — data tables without `<th>`, layout tables in general (rare now but not extinct), tables without captions when they need them.

> Method: open dev tools, inspect the actual DOM (not the JSX/template). Look at element names. The structure should mirror the meaning, not just the layout.


### Lens 4 — Names and labels

Whether every interactive thing has an accessible name.

  - **Buttons without text** — icon-only buttons (search, close, menu) with no `aria-label` or visually-hidden text. Screen reader announces "button" with nothing else.
  - **Form inputs without labels** — inputs labelled only by adjacent text or placeholder. Placeholders are not labels.
  - **Links without descriptive text** — "Click here," "Read more," "Learn more" — works visually with surrounding context, broken when read alone.
  - **Images without alt text** — `<img>` without `alt` attribute, or with empty `alt=""` when the image conveys information. Conversely, decorative images with descriptive alt text creating noise.
  - **Custom widgets without ARIA** — custom dropdowns, comboboxes, sliders, tabs without the ARIA attributes that tell assistive tech what they are.
  - **Inconsistent labelling approach** — `aria-label` in some places, visually-hidden `<span>` in others, `title` attribute somewhere else. Inconsistency makes maintenance painful.

> Method: use a screen reader (VoiceOver on Mac, NVDA on Windows, TalkBack on Android) and navigate through interactive elements. Listen to what's announced. If you hear "button" or "link" with no description, the name is missing.


### Lens 5 — Visual

What's perceivable for users with reduced vision, colour blindness, low contrast tolerance, or motion sensitivity.

  - **Colour contrast** — text against background. Light grey on white is the most common failure. Includes body text, labels, placeholders, disabled state, links.
  - **Colour as sole signal** — error states shown only by red text, required fields shown only by red asterisks, status shown only by colour dots. Need a non-colour cue too (icon, text, pattern).
  - **Text sizing** — text that doesn't scale when the user zooms the browser or increases OS font size. Fixed pixel sizes for body text are usually the cause.
  - **Reflow at zoom** — layout breaking at 200% zoom — content cut off, overlapping, scrolling in two directions.
  - **Motion** — animations that auto-play, parallax effects, large transitions, without respecting `prefers-reduced-motion`. Can cause nausea or vertigo for some users.
  - **Hover-only content** — information available only on mouse hover (tooltips, dropdowns). Touch and keyboard users miss it.
  - **Touch target size** — interactive elements too small to reliably tap on a touchscreen. Tiny close buttons, tightly-packed icon clusters.

> Method: zoom to 200%, try the app. Toggle a contrast checker. Use the keyboard only. Enable "reduce motion" in OS settings and reload. Try the app on a phone, not just a phone-sized browser window.


### Lens 6 — Dynamic content

How changes that happen after page load are communicated.

  - **Loading states** — a button shows a spinner mid-action; nothing announced to screen readers. User doesn't know the action is in progress.
  - **Errors** — form validation errors appearing visually but not announced. User submits, nothing happens (visually nothing happens from their perspective).
  - **Success/confirmation** — "Your changes were saved" toast appearing visually and disappearing, never reaching assistive tech.
  - **Live data** — values updating in place (notification counts, stock prices, chat messages). Some should be announced, some shouldn't — the audit notes which is which.
  - **Route changes in SPAs** — the URL changes, the page content swaps, but nothing announces that navigation happened. The user, especially a screen reader user, can be left unsure if anything changed.
  - **Expand/collapse** — accordions, disclosure widgets, dropdowns. Is the expanded/collapsed state announced? Is the focus handled?

> Method: trigger every async action and watch what happens both visually and (via screen reader) audibly. Note every change the eye sees that the screen reader doesn't.


> 💾 Save output → .aipe/audits/a11y-[date].md


## Step 2 — Re-read for purpose

The scan produces a comprehensive snapshot. Re-read it through one of these lenses depending on why you ran the audit.


### Lens: pre-publication review

Read everything, but pay particular attention to Lenses 3 (semantics) and 4 (names). These are the highest-impact issues for the largest number of assistive tech users, and they're often the cheapest to fix. If the audit surfaces missing landmarks or buttons without names, those are the items most likely to embarrass you when someone else looks at the site.


### Lens: interview preparation

The interesting material for interview answers is in patterns — what does the audit reveal about how this codebase approaches a11y? Was it considered from the start (consistent landmark use, semantic elements, labelling pattern) or added later in patches? An honest answer to "how did you handle accessibility?" is more valuable than a polished one; the audit gives you the honest answer.


### Lens: capability gap planning

Treat the audit as input to feature backlog planning. The "adding capability" items (focus management, route announcements, ARIA live regions, skip links) are features you haven't built yet. Group them, prioritize them, and write feature specs for the ones worth doing.


### Lens: bug triage

Items that read as "X exists but is broken" are bugs. Cluster them and write fix mini-specs. Common cluster: focus management bugs (focus escaping modals, focus disappearing on close).


## Step 3 — Hand off to other specs

A11y audit findings are inputs to other specs, never executed directly. The audit's output is read material; the action specs are where work happens.

  - **Feature spec** — for new capability the app lacks (route announcements, focus management on navigation, focus traps in modals, skip links, ARIA live regions, keyboard support for custom widgets that don't have it)
  - **Fix mini-spec** — for broken behaviour (focus handler doesn't fire, announcement happens twice, focus indicator disappears in a specific state)
  - **`refactor-frontend-visual.md`** — for semantic HTML restructuring where pixels stay identical (`<div onClick>` → `<button>`, replacing generic containers with landmarks, fixing heading hierarchy by element-swap)
  - **Cleanup audit** — if the a11y audit reveals systemic patterns (e.g., every modal in the codebase has the same focus bug) that suggest broader structural issues


## What to expect from the output

A first-time a11y audit on most frontend codebases will surface a long list. This is normal and isn't a judgment on the codebase or its author. A11y problems accumulate quickly because the tools and frameworks default to easy patterns (`<div>`s everywhere, inline event handlers, custom widgets) that are easy to write and not accessible.

The right response to a long audit output is not to feel bad. It's to:

  1. Acknowledge the list exists
  2. Decide what's worth fixing now versus what's accepted/deferred
  3. Hand off the now-items to feature specs and fix mini-specs
  4. Move on

> Like the cleanup audit's debt list, most a11y findings will be accepted-and-deferred. That's a legitimate decision as long as it's documented. The worst outcome is finding problems, not writing them down, and re-discovering them next audit.
