# industry discovery spec

> feed this to claude/chatgpt with the inputs filled in. it produces a *builder's map* of an industry — what a solution has to survive to get adopted — not a wikipedia summary. the goal is to get past the obvious, saturated problems that everyone already asks about.

---

## inputs

```
INDUSTRY:            (e.g. "ecommerce personalization / product discovery")
PRODUCT_HYPOTHESIS:  (optional — your current idea, even if half-baked)
TARGET_USER:         (optional — the role you think you're building for)
AI_INVOLVED:         (yes / no — changes the cost-of-error analysis)
DEPTH:               (quick scan / deep dive)
```

---

## instructions to the model

read these before answering. they matter more than the questions.

1. **rank, don't list.** order everything by leverage. a flat bullet list of 12 "problems" is useless — i need to know which 2 matter.
2. **tag every claim** with one of: `[known]` (stable fact you're confident in), `[inferred]` (reasoning, could be wrong), `[verify]` (i need primary research to confirm). do not present inferences as facts.
3. **kill the consensus answer.** for each problem you surface, ask yourself "would this show up if someone just googled 'common problems in {INDUSTRY}'?" if yes, either cut it or explain the non-obvious twist on it.
4. **be specific or say nothing.** "improve efficiency" is banned. give dollar/hour estimates, named workflows, named incumbents, real numbers — or flag `[verify]` and tell me where to find the number.
5. **no filler.** skip preamble, skip "it's important to note." dense and actionable.

---

## part 1 — how the industry actually makes money

before any problem matters, i need the economic shape.

- how does a player in this industry make money? what's the margin structure (high-volume-low-margin vs low-volume-high-margin)?
- where does the **money** concentrate vs where does the **time/effort** go? (these are rarely the same place — the gap is where automation pays.)
- what's the one metric everyone in this industry is judged on? (conversion rate? CAC? retention? GMV? margin?)
- what does a 1% improvement in that metric translate to in dollars, for a typical player?

## part 2 — the problem landscape (why-unsolved framing)

do **not** answer "what are common problems." answer this instead:

- list the top problems, but for **each one** state: *why hasn't this already been solved?* the constraint is the real insight. options: fragmentation, regulation, switching costs, locked-up data, misaligned incentives, "good-enough" incumbents, or the pain being too diffuse to fund a fix.
- which problems are solved on purpose being left broken because someone profits from the friction?
- which are genuinely open vs already owned by a well-funded incumbent i'd be fighting?

## part 3 — painkiller vs vitamin

for the top 2-3 problems:

- what does the status quo *cost* the person who feels it — in dollars or hours per month? is that cost **concentrated** (one person feels it acutely) or **diffuse** (everyone mildly annoyed)?
- what's the current workaround? (often "a spreadsheet + a person." if the workaround is fine, the problem isn't fundable.)
- on a scale, is this a painkiller (they'll pay to stop the pain now) or a vitamin (nice, deferrable)?

## part 4 — who pays vs who uses vs who benefits

these are almost always different people with conflicting incentives.

- **user**: who touches the tool daily? what do they care about? (usually: not being slowed down.)
- **buyer**: who controls the budget and signs off? what do they care about? (usually: risk, cost, defensibility.)
- **beneficiary**: who actually gets the upside? (the firm? a different team?)
- **blocker**: who loses status/headcount/control if this gets adopted, and will quietly kill it?
- where do these incentives conflict, and what does that mean for how the product must be designed?

## part 5 — data & workflow ownership

value accrues to whoever owns the workflow and the data, not whoever has the best model.

- where does the relevant data physically live? who owns it? is it accessible, or locked behind a vendor / contract / API i can't touch?
- is the data clean, or is "the data is a mess" itself the real problem?
- who owns the *workflow* this product would sit inside? (if an incumbent owns the workflow, they can clone my feature and bundle it.)
- what would i need access to that i probably can't get? (this kills more products than model quality ever does.)

## part 6 — cost-of-error → augment vs automate

**(critical if AI_INVOLVED = yes)**

- what happens when the system is wrong? is a mistake annoying, expensive, or catastrophic/regulated?
- given that: will this industry tolerate **automation** (system decides) or only **augmentation** (system drafts, human approves)?
- if augmentation: the output must be **auditable and verifiable**, not a confident black box. what does "show your work" look like here?
- where's the highest-stakes step everyone's too scared to automate — and is there a lower-stakes adjacent step that's the real wedge?

## part 7 — incumbents & integration reality

- who are the 3-5 incumbents / "good-enough" tools people already use? what are their 2-star-review complaints?
- what stack does my product have to sit *next to*? what does it integrate with or replace?
- what's the switching cost for a customer, and who eats it?

## part 8 — adoption & how things actually get bought

- how does a new tool actually enter this industry? (bottoms-up by individual users? top-down enterprise sales? through an agency/consultant/platform?)
- what's the sales cycle and who has to say yes? (1 person with a credit card vs a 9-month procurement committee changes everything.)
- is there a trust / compliance / security gate i have to clear before anyone will even pilot?

## part 9 — the wedge

synthesize the above into:

- the single **narrowest** entry point: one problem, one user, one workflow where i could win first and earn the right to expand.
- why this wedge specifically — tie it back to a constraint from part 2 and an incentive from part 4.
- the 3 riskiest assumptions in this whole map, ranked, that i should go validate before writing code.

---

## output format

```
## economic shape
## problem map (ranked, each with why-unsolved)
## the wedge
## conflicting incentives i must design around
## data/access risks
## augment-vs-automate verdict
## riskiest assumptions to validate (ranked)
```

---

## what the model CANNOT tell you — go do this yourself

the spec above gets you the consensus-plus map. it cannot get you the real thing. after running it, do at least two of these:

- **talk to 3-5 actual practitioners.** ask them to walk you through their *last bad day* at work, step by step. don't ask "what are your problems" — ask "show me how you did X last time."
- **read the 2-star reviews** of the incumbents on G2 / Capterra / Trustpilot. that's where the unmet needs are written down for free.
- **read job postings** in the field — they describe the work that actually needs doing.
- **skim a public company's 10-K or earnings call** in this industry — execs state plainly what they're scared of.
- **lurk the trade communities** — industry subreddits, slacks, discords — and watch what people complain about unprompted.

the meta-move: stop asking *"what's the problem"* and start asking *"walk me through how this gets done today, and where it hurts."* the problem hides in the workflow, not in the summary.
