# Refactor Spec — Frontend Visual

Companion to `refactor-frontend-behaviour.md` and `refactor.md`. Same discipline (one refactor type per spec, must-not-change, must-not-introduce) applied to the visual surface of frontend code — styling, design system structure, and semantic HTML.

> **Read `refactor.md` and `refactor-frontend-behaviour.md` first.** This spec extends them. The general discipline carries over; this one adds refactor categories for the part of frontend that's about how things look and how the markup is structured, rather than how things behave.

Framework- and library-agnostic. Concepts named here apply to BEM, CSS Modules, Tailwind, vanilla-extract, styled-components, Emotion, CSS-in-JS generally, SCSS/Sass, plain CSS, and design tokens. Where a concept has tool-specific names, they're listed in parentheses.


## What's in scope

  - CSS architecture (naming, organization, methodology, specificity, scope)
  - Design system structure (tokens, variables, themes, variants)
  - Semantic HTML (using correct elements without changing what's rendered)


## What's NOT in scope

These belong in **feature specs** or **fix mini-specs**, not refactors, because they change what users can do or see:

  - Adding keyboard navigation that didn't exist
  - Adding focus management (focus on route change, focus trapping)
  - Adding screen reader announcements / ARIA live regions
  - Adding skip links, landmarks where there were none
  - Fixing colour contrast (changes appearance)
  - Restyling components (changes appearance)
  - Responsive breakpoint changes that alter layout
  - Adding new design tokens for capabilities that didn't exist

> **The discipline:** if the pixels change or a user can now do something they couldn't before, it's not a refactor. The visual refactor spec covers reorganizing how the existing look is *expressed*, not changing what the look *is*.


## Refactor spec format

Same as `refactor-frontend-behaviour.md`, with visual-specific must-not-change items:


```
## What to refactor
## Why
## Refactor type      ← name from the categories below
## Styling context    ← what's used (BEM, Tailwind, CSS Modules, etc.)
## Current structure
## Target structure
## Must not change
  - Rendered pixels — same visual output, verified by screenshot or eye
  - Responsive behaviour — same layout at all breakpoints
  - Interactive states — hover, focus, active, disabled look identical
  - Animations and transitions — same timing, same easing, same triggers
  - Print styles, dark mode, high-contrast mode — all variants preserved
  - Keyboard behaviour, focus visibility, screen reader output
  - DOM structure where it matters for selectors / tests / third-party scripts
  - Do not touch [specific files / stylesheets / components]

## Must not introduce
  - No new design tokens or theme values not explicitly listed
  - No new dependencies
  - No new abstractions not discussed here

## Done when
  - Visual diff is empty (screenshot comparison or manual check)
  - Existing tests pass
  - All viewports, themes, and modes verified
  - No new console warnings (especially CSS warnings)
```


> 💾 Save as → .aipe/specs/refactors/visual-[name].md


## Key principles specific to visual refactors

> **"Same pixels" is the verification gate.** Visual refactors have the strictest definition of "behaviour" — if a single shadow renders differently, the refactor failed. Screenshot diffs (Playwright, Chromatic, Percy, manual side-by-side) are the only reliable verification. Compiling without errors means nothing here.

> **CSS specificity is fragile.** Most CSS refactor bugs come from one rule winning where another used to win. Whenever you change selectors, change file order, or change methodology, the specificity graph changes. Verify the cascade hasn't shifted.

> **Test the visual edges.** Empty states, very long text, missing images, slow networks, RTL layouts, very small and very large screens, browser zoom, OS-level font size changes. These are where visual refactors silently break — the happy path looks the same, but the edges shift.


---


# Visual refactor vocabulary


## 1. CSS naming and methodology refactors

Apply a consistent naming/methodology where the codebase has drifted. The goal is consistency, not picking the "best" methodology — whichever one the codebase mostly uses, complete the conversion.

  - **Adopt BEM Consistently** — class names follow `block__element--modifier`. Useful when the codebase already mostly does this and a few outliers exist. Don't introduce BEM into a codebase that uses something else; that's a methodology migration, which is a different refactor.
  - **Adopt Utility-First Consistently** (Tailwind, Tachyons, atomic CSS) — components use utility classes for layout/styling. Refactor outliers that introduced custom classes when utilities would do.
  - **Adopt CSS-in-JS Consistently** (styled-components, Emotion, vanilla-extract, Linaria) — styles live alongside components in the same primitive. Convert outliers using global stylesheets or other approaches.
  - **Adopt CSS Modules Consistently** — local-scoped classes per component. Convert outliers using global classes that should be scoped.
  - **Methodology Migration** — codebase uses methodology A, target is methodology B. This is a *large* refactor that should be planned as a sequence of smaller specs (one file/component at a time, with a shared target methodology spec'd up front). Do not attempt as one spec.

> **Methodology caution:** a half-converted codebase is worse than a consistent one in the old methodology. If you start a methodology migration, complete it or revert it. Living indefinitely in two methodologies is the worst outcome.


## 2. Specificity and cascade refactors

Make the cascade predictable. These are some of the highest-value CSS refactors because they prevent entire classes of future bugs.

  - **Flatten Selector Depth** — selectors like `.parent .container .item .label` should be `.label` (or a scoped equivalent). Deep selectors couple unrelated layers and create specificity that's hard to override.
  - **Remove `!important`** — the `!important` was a band-aid for a specificity problem. Diagnose the underlying issue (usually a selector that's too specific elsewhere) and fix it. Removing `!important` without fixing the cause makes things worse.
  - **Equalize Specificity** — multiple rules competing with mismatched specificity, causing surprising overrides. Refactor so rules at the same level have the same specificity.
  - **Replace ID Selectors** — `#header` in stylesheets binds CSS to specific instances. Replace with classes unless there's a structural reason for the ID.
  - **Replace Element Selectors with Classes** — `nav ul li a { ... }` makes the styling depend on the exact DOM structure. Replace with classes that survive markup changes.
  - **Adopt `@layer` / Cascade Layers** — modern CSS lets you declare specificity order explicitly. Useful when migrating off `!important` or organizing competing systems (framework styles vs app styles vs utility classes).


## 3. Scope and organization refactors

Where styles live and what they're scoped to.

  - **Scope Global Styles** — rules in a global stylesheet that target a specific component. Move into the component's own scoped styles. Reduces unintended cascade.
  - **Promote Component Style to Global** — the reverse, when a "component style" is actually the only place a reusable pattern is defined. Promote to a shared layer (reset, base typography, utility class).
  - **Co-locate Styles with Component** — styles for a component live in a far-away stylesheet. Move into the same file/folder as the component.
  - **Decompose Mega-Stylesheet** — one huge `.css` file with rules for the whole app. Split by component, feature, or layer.
  - **Extract Shared Mixin / Helper** — same SCSS mixin / CSS custom property block / styled-component fragment duplicated across files. Extract once.
  - **Remove Dead Styles** — selectors that don't match anything in the codebase. Tooling can detect these (PurgeCSS, CSS coverage tools, Tailwind's built-in purge). Removal is behaviour-preserving by definition since nothing was using them.

> **Dead style caution:** "doesn't match anything in the codebase" misses styles that are applied dynamically via JS, by third-party scripts, or by CMS content. Verify before deleting; don't trust a tool alone.


## 4. Design token and theme refactors

The structural backbone of the design system.

  - **Extract Literal to Token** — colour, spacing, radius, font, shadow value used as a literal in many places. Extract to a design token / CSS custom property / theme value. Call sites reference the token.
  - **Consolidate Duplicate Tokens** — `--color-primary` and `--brand-blue` are the same value. Pick one canonical name and replace references to the other.
  - **Rename Tokens for Clarity** — `--color-1`, `--color-2` are meaningless. Rename to semantic names (`--color-surface`, `--color-text-primary`). Long, mechanical refactor; very valuable.
  - **Promote Component Style to Theme** — a component bakes in colours/spacing that should be themeable. Refactor to reference theme tokens so dark mode / brand variants work.
  - **Restructure Token Hierarchy** — flat token namespace has grown unwieldy. Group into tiers (primitive tokens like `--blue-500`, semantic tokens like `--color-accent`, component tokens like `--button-bg`). Higher tiers reference lower tiers.
  - **Replace Hardcoded Breakpoints with Named Breakpoints** — `@media (min-width: 768px)` repeated everywhere. Extract to `--breakpoint-md` or framework breakpoint variables.


## 5. Component variant and composition refactors

How variants and modifiers are expressed.

  - **Consolidate Variant Props** — a component takes `isLarge`, `isMedium`, `isSmall` as separate booleans. Replace with `size: 'sm' | 'md' | 'lg'`. Three booleans = eight states, most invalid; one prop = three valid states.
  - **Replace Boolean Variant with Enum** — same pattern as above, generalized to any variant.
  - **Extract Variant System** — variant logic scattered through component code. Move into a structured variant system (CVA / class-variance-authority, tailwind-variants, stitches variants, theme.variants).
  - **Replace Inline Style with Class Variant** — a component uses inline styles to express variants (e.g., `style={{ backgroundColor: isPrimary ? 'blue' : 'gray' }}`). Replace with class-based variants.
  - **Compose Instead of Configure** — a component has grown many props to handle many cases. Replace the configuration props with composition — let the caller provide the variant via slots/children.


## 6. Semantic HTML refactors

The narrow sliver of a11y-adjacent work that fits as a refactor: making the markup correctly semantic without changing what's rendered.

  - **Replace Div-with-Click with Button** — `<div onClick>` styled to look like a button. Replace with `<button>`. The visible UI is identical; the element is now keyboard-focusable and announced correctly by assistive tech. Verify focus styles, default browser styling reset, and any `type="button"` to prevent form submission.
  - **Replace Div-with-Link-Behaviour with Anchor** — `<div onClick={() => navigate(...)}>` should be `<a href>`. Same pixel output; correct semantics, working middle-click, working "copy link," working "open in new tab."
  - **Use Landmark Elements** — page wrapped in nested `<div>`s where `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>` express the structure. Replace, preserving styles via class names.
  - **Use Heading Hierarchy Correctly** — `<div class="heading-2">` styled to look like a heading. Replace with `<h2>`. Conversely, `<h3>` used because the styling matched, but it's not actually a heading — replace with a styled `<p>` or `<div>`.
  - **Use List Elements for Lists** — a sequence of `<div>` rendered as a visual list. Replace with `<ul>` / `<ol>` + `<li>`, preserving the visual.
  - **Consolidate Labelling Approach** — `aria-label`, `aria-labelledby`, visually-hidden `<label>`, and inline `<label>` all used inconsistently for the same kind of element. Pick one approach per case and apply consistently.
  - **Replace Decorative Attribute with `aria-hidden`** — icons or decorative images announced redundantly. Mark as `aria-hidden="true"`. Verify they were genuinely decorative and not the only label.

> **Semantic HTML caution:** these refactors look small but can ripple. A `<div>` becoming a `<button>` means it now has default browser styles, default focus behaviour, and (inside a `<form>`) may submit by default. Reset the defaults explicitly so the visual stays identical. Verify with screenshot diff.


## 7. CSS framework / library refactors

Behaviour-preserving cleanups specific to using a CSS framework.

  - **Replace Utility Sprawl with Component** (Tailwind, Tachyons) — the same long utility string repeated in many places. Extract into a component or `@apply`-ed class.
  - **Replace Custom CSS with Framework Utility** — bespoke CSS doing what a framework utility already does. Replace with the utility. Reduces custom CSS surface area.
  - **Replace Framework Component with Bespoke** — using a framework's high-level component (a Bootstrap card, a Material Card) that's been customized so heavily the framework provides no value. Replace with a thin custom component. Counterintuitive but sometimes correct.
  - **Update Framework Idioms** — codebase uses older framework patterns when newer ones exist (Bootstrap 4 `row`/`col` when grid utilities are cleaner; Tailwind v2 patterns in a v3 codebase). Convert incrementally.
  - **Adopt Framework's Theming Primitives** — manually overriding framework variables in one place when the framework provides a theming API. Migrate to the API.


---


## How to use this spec

  1. **Diagnose the visual surface problem.** Is it naming inconsistency, specificity, scope, tokens, variants, semantics, or framework usage? Picking the wrong category means picking the wrong refactor.
  2. **Pick the refactor type.** Prefer the smaller, more localized refactor. Token extraction over methodology migration. One file's selectors over the whole stylesheet.
  3. **Pick the verification method up front.** Screenshot diff (automated or manual), visual regression suite, before/after side-by-side. Without this, you can't tell if "same pixels" held.
  4. **One refactor type per spec, one spec per session.** Visual refactors are especially prone to "while I'm in here" creep — fix one thing per session and stop.

> The cardinal rule of `refactor.md` still applies: name the technique. "Clean up the styles" is not a refactor; "Extract spacing literals to tokens" is.


## When the refactor reveals a feature problem

Visual refactors often surface things that look fixable but aren't refactors:

  - "This button doesn't have a focus state" → not a refactor (adds capability). File as a11y fix.
  - "These two cards look identical but use different colour values" → token extraction (refactor) reveals they *should* be one value; if they should be *different* values, the inconsistency is a design decision and the refactor stops at flagging it.
  - "This responsive breakpoint is wrong" → not a refactor (changes layout). File as design fix.
  - "Dark mode is broken for this component" → not a refactor (was broken, fix changes appearance). File as bug fix.

When a refactor reveals one of these, document it and exit. The cleanup audit or a feature spec is the right home for the follow-up.
