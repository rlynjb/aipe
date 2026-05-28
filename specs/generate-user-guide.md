# command: generate user guide

> run this in any project repo. it inspects the actual codebase and produces user-facing documentation written from the perspective of someone using the app for the first time. not a technical readme, not api docs — a guide that helps a real person understand what the app does and how to use its features. output is written to `.aipe/USER_GUIDE.md`.

---

## what this command does

you are generating `USER_GUIDE.md` inside the `.aipe/` folder at the repo root (create `.aipe/` if it doesn't exist). this matches the aipe plugin convention — all aipe-generated artifacts live under `.aipe/`. it documents the app's **features from a first-time user's perspective**: what they can do, how to do it, and what to expect.

write for the person using the app, not the person building it. that means:
- no internal architecture, no file paths, no function names, no tech stack
- no jargon the user wouldn't see in the app itself
- task-oriented ("how do i…") not implementation-oriented ("the system calls…")
- describe what the user sees and does, screen by screen / feature by feature

the guide must be **accurate to what the app actually does right now**. document only features that exist and work. if a feature is half-built or behind a flag, either omit it or clearly mark it as "coming soon" in its own section — never present an unbuilt feature as usable.

---

## step 0: understand the app from the outside in

before documenting, figure out what the app actually does for a user. read the code, but think like a user.

inspect:
- **user-facing surfaces** — the ui (pages, screens, components), cli commands, or api the user interacts with. this is your primary source. read the actual labels, button text, headings, placeholder text, empty states, and copy the user sees.
- **navigation / structure** — how does a user move through the app? what are the main areas, tabs, routes, screens, or commands? this becomes the skeleton of the guide.
- **entry point** — what does a brand-new user see first? the landing screen, the onboarding, the empty state, the first command. the guide should start where the user starts.
- **actions** — what can a user actually do? trace each interactive element (buttons, forms, inputs, commands, gestures) to what it accomplishes from the user's point of view.
- **settings / configuration** — anything the user can customize, toggle, or set up.
- **README / existing docs** — for the app's name, intended purpose, and any tone/voice cues.

note the app's **voice and naming**: use the exact feature names, button labels, and terminology the app itself uses. if the app calls it a "board," call it a "board" — don't rename it a "kanban view." mirror the app's casing and tone in the guide.

if the app requires setup before a user can use it (account, install, connecting a service), note that — there may be a getting-started step before features can be used.

---

## step 1: map the features

list every user-facing feature you found, then organize them the way a user would encounter them, not the way the code is organized. a good order is usually:

1. getting started (whatever a first-time user must do before the rest works)
2. the core feature (the main thing the app exists to do)
3. supporting features (in rough order of how commonly they're used)
4. settings & customization
5. anything advanced or power-user

for each feature, identify:
- what it's called (the app's own name for it)
- what it lets the user accomplish (the benefit, not the mechanism)
- how the user triggers / uses it (the actual steps)
- what the user sees as a result
- any prerequisites (must do X first)
- any limits or gotchas a user would hit

drop anything that's purely internal and invisible to the user.

---

## step 2: generate the user guide

write `.aipe/USER_GUIDE.md` in the app's own voice. structure it for scanning — a user looking for one specific answer should find it fast. use these sections:

### intro: what is [app name]?

two or three sentences. what the app is, who it's for, what they can accomplish with it. plain language, no hype. use the app's real name and tagline if it has one.

### getting started

the first-time path. cover only what's needed to go from "just opened it" to "using the core feature":
- any account / install / setup step (only if real and required)
- what the user sees first
- the very first thing they should do
- how they get to the main feature

keep this short. the goal is to get the user to their first success quickly.

### features

the heart of the guide. one subsection per feature, ordered as mapped in step 1. for each feature, use this consistent shape:

> **[feature name]**
>
> *what it does* — one or two sentences on the benefit from the user's perspective.
>
> *how to use it* — numbered steps the user actually follows. reference real buttons, labels, and screens by their actual names.
>
> *what you'll see* — the result, the output, what changes on screen.
>
> *good to know* — (only if relevant) tips, limits, prerequisites, or common mistakes.

write the steps so a first-time user who has never seen the app could follow them. be concrete: "tap the + button in the bottom right" not "create a new item."

### tips & common questions

a short faq-style section answering what a real first-time user would wonder:
- how do i undo / delete / edit something?
- where does my data go / is it saved?
- what happens if [common situation]?
- how do i get back to [main screen]?

only include questions the app's actual behavior answers. don't invent.

### coming soon (optional)

only if there are clearly-planned-but-unbuilt features worth signaling. mark them plainly as not yet available. omit this section entirely if there's nothing real to put in it.

---

## step 3: accuracy pass

re-read the guide against the app. for every step, confirm the buttons, labels, screens, and flows you described actually exist with those names in the code. apps drift from their docs constantly — the names in the guide must match the names in the ui right now.

fix anything that doesn't match. flag anything you couldn't verify with a `> ⚠️ verify: ...` note rather than guessing — for example, if you couldn't tell whether a button is labeled "save" or "done," flag it for a human to check in the running app.

then print a short console summary:
- how many user-facing features were documented (1 line)
- anything that looked half-built or ambiguous and was omitted or flagged (1–2 lines)
- one suggestion for a feature whose in-app copy or labeling is confusing and could be clearer (1 line)

---

## constraints

- **user's perspective only.** no architecture, file paths, function names, or tech stack. if you're describing how the code works, you've drifted — pull back to what the user sees and does.
- **accuracy over completeness.** document what exists and works. unbuilt features go in "coming soon" or get omitted, never in the main features as if usable.
- **use the app's real words.** exact feature names, button labels, and terminology from the actual ui. mirror its voice and casing.
- **task-oriented and concrete.** every feature answers "how do i do this?" with steps a first-timer can follow.
- **scannable.** a user with one question should find the answer without reading the whole thing. clear headings, short steps.
- **one output file**: `.aipe/USER_GUIDE.md` (create the `.aipe/` folder if it doesn't exist), plus the console summary.
- if a part of the app is too incomplete to document accurately, say so plainly rather than inventing a flow.
