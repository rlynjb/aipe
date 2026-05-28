# command: generate demo guide

> run this in any project repo. it inspects the actual codebase and produces a demo presentation guide grounded in what was really built — not what was planned. designed for hackathons, demo days, stakeholder reviews, or any time you need to present a working project. output is written to `.aipe/DEMO_GUIDE.md`.

---

## what this command does

you are generating `DEMO_GUIDE.md` inside the `.aipe/` folder at the repo root (create `.aipe/` if it doesn't exist). this matches the aipe plugin convention — all aipe-generated artifacts live under `.aipe/`. the file is a presentation playbook for whoever will demo this project — a script to read from while recording or presenting, plus prep for live questions.

the guide must be **accurate to the code as it exists right now**. do not describe features that aren't built. if something was planned but not implemented, either omit it or clearly mark it as "roadmap, not built." audiences — especially technical judges or reviewers — lose trust fast when a demo claims something the product doesn't do.

---

## step 0: detect the context

before anything, figure out what kind of project this is and who it's being presented to. read whatever surfaces this:

- `README.md`, `CONTRIBUTING.md`, docs folders
- any spec, brief, or planning docs in the repo (e.g. `SPEC.md`, `/docs`, `.md` files at root)
- any submission or event requirements file if present (hackathon kit, rfp, rubric, brief)
- `package.json` / `pyproject.toml` / `go.mod` / etc. for name, description, stack

from this, infer and note:
- **what the project is** (the domain, the problem)
- **who the audience is** (hackathon judges? a client? internal stakeholders? investors?)
- **any format constraints** (time limit, required sections, a rubric to score against)

if there's a rubric or set of judging/evaluation criteria anywhere in the repo, extract it and design the guide to hit those criteria explicitly. if there isn't one, default to a general "clear problem → working solution → credible architecture → honest limitations" structure.

if you genuinely can't tell who the audience is, default to "a technically literate reviewer who has not seen this project before" and note that assumption at the top of the guide.

---

## step 1: inspect the codebase

read the repo to understand what actually exists. do not skip this — accuracy is the entire point.

adapt what you inspect to the stack you find, but cover at least:

1. **entry points & core logic** — find the main modules that do the real work. determine what the system actually does end to end, not what the docs claim.

2. **external integrations** — find every external service, api, sdk, model, or data source the code calls. for each, determine:
   - is it real and wired up, or stubbed/mocked?
   - what specifically is called (endpoints, tools, methods) — get real counts and names
   - how is it authenticated (real auth vs hardcoded/mocked)

3. **user-facing surfaces** — find the ui, cli, api, or whatever the user interacts with. determine:
   - which surfaces exist and actually render/respond
   - what real functionality is reachable vs placeholder

4. **data reality** — answer honestly: is the project running on live data, cached/recorded responses, synthetic seeds, or fixtures? search for mock files, fixtures, hardcoded responses. this is the single most important thing to get right.

5. **config & stack** — read the dependency manifest (real deps + versions), env example files (what credentials are needed), and deploy config. the guide must reflect the real stack, not the planned one.

after inspecting, write yourself a short internal summary: "here is what is actually built vs what was planned." ground everything below in that.

---

## step 2: generate the demo guide

write `.aipe/DEMO_GUIDE.md` with these sections. match the project's voice — if the repo has a consistent writing style (casing, tone) in its docs/ui copy, mirror it. otherwise write clean, direct, scannable prose. this is a working document the presenter glances at, so favor structure over paragraphs where it helps.

### section 1: what this is (the elevator version)

three short paragraphs:
- one-sentence definition a non-expert in the audience would understand
- the problem it solves, with the specific user/beneficiary named
- the one thing that makes it different or notable

pull real user-facing copy from the app if it exists — use the actual headline/tagline, not an invented one.

### section 2: how it actually works (the honest architecture)

describe the real flow as built, end to end. for each stage, write one line grounded in the actual code:
- the interface the user touches
- the runtime / core logic that processes the request
- external services / data sources called (real names, real counts)
- the processing or reasoning layer
- what the system produces as output
- any human-in-the-loop or review/approval point

include a plain-text (ascii box) architecture diagram that's copy-pasteable into a slide or submission artifact. keep it readable over impressive — the goal is that a reviewer understands the system in ten seconds.

### section 3: the use case (the story the audience remembers)

write the concrete scenario the demo will walk through. it must be something the app can actually do. if it runs on live data, pick a real example from a test run; if cached/synthetic, describe that scenario honestly. structure it as a narrative:
- the trigger / starting point (what the user wants)
- what the system does in response (the real steps, the real calls)
- the result the user gets
- (if applicable) a follow-up interaction that shows depth

this is the spine of the demo. it should read like a story, not a feature list.

### section 4: the demo script

produce a timed, section-by-section script. if step 0 found a required structure or time limit, match it exactly. otherwise use this default flow scaled to the time available:

| section | what to cover |
|---|---|
| context | the problem, the user, why it matters |
| solution overview | what was built |
| architecture | how it works, what it integrates |
| core demo | the use case from section 3, live |
| depth | the most technically impressive part, explained |
| close | differentiation + what's next |

for each section write:
- **say**: the actual words to speak — full, rehearsable sentences in the project's voice
- **do**: the exact action/click on screen at that moment
- **show**: what should be visible

ground every claim in real functionality. if a feature isn't built, don't script a moment around it — adapt the script to what exists. include suggested timing per section that fits any overall limit.

### section 5: presenting tips (how to deliver it)

practical delivery guidance tailored to the audience from step 0:
- the opening line, memorized word-for-word
- where to slow down (the single most impressive moment — let it breathe)
- where to speed up (setup, navigation — don't dwell)
- what to do with the cursor / attention during key moments
- pacing relative to any time limit (leave buffer; don't run to the ceiling)
- energy / register appropriate to the audience (formal review vs casual demo day)
- how to close cleanly without trailing off

### section 6: q&a prep

anticipate the questions this audience will ask and give the presenter one-sentence answers grounded in the real build. always include:
- *"what's real vs mocked?"* — the honest answer from step 1's data-reality inspection
- *"how does the core integration actually work / how deep does it go?"* — real specifics
- *"how is this different from existing solutions?"* — the differentiation
- *"what would break at scale / in production?"* — honest technical limitations
- *"what would you build next?"* — the roadmap

add any audience-specific questions implied by step 0 (e.g. a rubric criterion suggests a likely question). for each, if the honest answer exposes a weakness, coach how to frame it truthfully but confidently — owning a limitation reads better than hiding it, and reviewers usually catch the hidden ones anyway.

### section 7: pre-demo checklist

a literal checklist the presenter runs before presenting:
- environment ready (which env vars / credentials must be set, from the env example)
- data confirmed (live, cached, or synthetic — which mode, how to enable it)
- the exact command / url to start the app
- presentation environment setup (clean browser/terminal, readable font size, notifications off)
- backup plan if the live demo fails (recorded fallback, cached mode, screenshots)
- recording or screen-share setup (resolution, mic, do-not-disturb)
- rehearsal requirement: full run-through several times with a timer before going live

### section 8: what's real vs roadmap (transparency ledger)

a two-column table populated from step 1:

| built and working | roadmap / not built |
|---|---|
| (real features) | (planned but unbuilt features) |

this protects the presenter in q&a and is reusable source material for any "responsible design," "limitations," or "future work" artifact the submission requires.

---

## step 3: accuracy pass

after writing `.aipe/DEMO_GUIDE.md`, re-read it against the codebase once more. for every factual claim (counts, names, features, data source, stack), confirm it matches the code. fix anything that drifted. flag anything uncertain with a `> ⚠️ verify: ...` note rather than guessing.

then print a short console summary:
- what's built (1–2 lines)
- what's notably missing vs the plan/spec, if one exists (1–2 lines)
- the single biggest risk for the demo (1 line)
- one concrete suggestion to strengthen the demo before presenting (1 line)

---

## constraints

- **accuracy over aspiration.** the guide describes what exists. planned-but-unbuilt features go in the roadmap column, never in the present-tense demo script.
- **match the project's voice.** mirror the casing and tone of the repo's existing docs/copy. don't impose a generic corporate register.
- **respect the format constraints** found in step 0 (time limit, required sections, rubric). if none exist, use the sensible defaults above.
- **one output file**: `.aipe/DEMO_GUIDE.md` (create the `.aipe/` folder if it doesn't exist), plus the console summary.
- if the codebase is incomplete in a way that makes part of the guide impossible to write accurately, say so plainly in that section rather than inventing content.
