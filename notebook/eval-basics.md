# eval basics

> the foundation, the choices, the numbers, and the shapes — built up foundation-first,
> not in the order we stumbled through it.
>
> one-line spine (plain): **an eval is a unit test for AI** — a pile of examples, a way to
> grade each answer, and a squish into one number you can decide on.
> one-line spine (formal): an eval is a scoring function run over a fixed dataset, aggregated
> into a decision. everything else names a choice about the dataset or the scorer.

---

## contents

```
PART A — WHAT AN EVAL IS
  0 · start here — an eval is a test for AI
  1 · the machine, stated formally

PART B — FILLING THE BOXES (the choices)
  2 · the choices (golden / rubric / judge / trajectory)
  3 · dataset roles (golden / adversarial / regression)
  4 · the method menu (not made up, not math)

PART C — MAKING EVALS THAT DON'T LIE
  5 · the core metrics, defined plainly (accuracy / precision / recall / F1)
  6 · dataset quality — a good pile beats a big pile
  7 · LLM-as-judge — and how to trust it (biases + calibration)
  8 · why n matters — statistics without the pain

PART D — WHERE EVALS RUN (the common shapes)
  9 · offline vs online (dev-time vs production)
 10 · RAG evals — grade the two halves separately
 11 · agent / trajectory evals — grade the path, not just the destination

PART E — RUNNING & READING
 12 · the harness (what turns the loop into infrastructure)
 13 · what the numbers are *for*
 14 · per-agent vs shared (the number that trips everyone)

PART F — PITFALLS & PRACTICE
 15 · common pitfalls & Goodhart's law
 16 · a worked example, end to end
 17 · mapping a real topic to all of the above

APPENDIX
  · eng-vocab one-liners
  · glossary
```

---

## 0 · start here — an eval is a test for AI

You've written a unit test:

```js
test("adds numbers", () => {
  expect(add(2, 3)).toBe(5);
});
```

Input `(2, 3)`, known right answer `5`, check they match. Green or red. Done.

**An eval is just that — a test, but for AI.** The only reason it *looks* different is that AI
breaks the clean unit test in two annoying ways. Understanding those two problems *is*
understanding evals — everything else is dealing with them.

```
problem 1 — AI doesn't return the same answer twice.
   summarize an email → slightly different wording every run.
   so  expect(out).toBe("exact string")  is dead on arrival.

problem 2 — often there's no single right answer.
   what's the "correct" summary of an email? fifty good ones exist.
   so you can't even WRITE the expected value.
```

So how do you actually check if an AI is any good? Let's do it for real, with an AI that reads
a customer email and labels it `angry` / `not angry`.

**you need examples to test on.** "is my AI good?" — good *at what*? You collect ~20 real
emails and write down what each *should* be:

```
"WHERE IS MY REFUND"        → should be: angry
"thanks, got it!"           → should be: not angry
"following up on my order"  → should be: not angry
```

That pile of examples-with-answers is **the dataset**. No pile → nothing to test.

**you need a way to grade each answer.** For labels it's easy — check if the AI's label matches
your written-down one (`angry === angry` ✓). But if the AI *summarized* instead, there's no
exact match, so you'd have to *judge* it: read it, decide "good / missed the point," maybe rate
1–5, maybe even ask *another AI* to rate it. That grading step — the thing that turns "the AI
said X" into "and that's good/bad" — is **the scorer**.

> every fancy word from later in this doc is just *a different way to build the scorer*:
> - written-down right answer, check match → **golden**
> - no single answer, grade against a checklist ("accurate? short?") → the checklist is a **rubric**
> - another AI does the grading → **LLM judge**
>
> they are *not* different "types of eval." they're different ways to fill one box. don't let
> them intimidate you.

**you ran 20 emails, you have 20 verdicts — now squish them into one number** you can act on.
"17 / 20 correct → 85%. ship it or not?" That squish is **the aggregation**.

That's the whole machine:

```
1. a pile of test examples          →  the dataset       ("what to test on")
2. a way to grade each answer        →  the scorer        ("is this answer good?")
3. squish grades into one number     →  the aggregation   ("...overall, good?")
→ now you can DECIDE: ship or don't.
```

**why you can't skip any of the three** (this is all "invariant" ever meant):

```
no examples   → nothing to test.
no grader     → you have answers but no idea if they're good.
no squish     → 20 scattered verdicts, no single "is it good, y/n".
```

Miss one and you don't have an eval — you have a pile of stuff. The golden/rubric/judge words
can be *swapped out* (use whichever fits your case). The three boxes can only be *filled
differently*, never removed. **Fancy words = removable parts. Three boxes = the parts that must
be there.**

---

## 1 · the machine, stated formally

Same three boxes you just built from the email example — now as the diagram you'll see
everywhere. An eval is a *measurement*, and every measurement is these three parts plus a
purpose:

```
   ┌─────────────────────────────────────────────┐
   │   dataset  ──►  scorer  ──►  aggregate       │──► decision
   │   (cases)      (case →        (scores →       │
   │                 judgment)      number)        │
   └─────────────────────────────────────────────┘
         ▲              ▲
      what's in     how you turn
      a case        output → score
```

`dataset + scorer + aggregation → decision`. That's it. (dataset = your email pile, scorer =
the grader, aggregation = the 17/20 squish.)

Why *this* is the foundation and the fancier stuff isn't:

- it is **invariant** — drop any box and it stops being an eval (the "miss one, you have a pile
  of stuff" point above).
- the fancier vocabulary is **contingent** — you can have an eval with no golden answers
  (rubric only), no LLM (pure code), no trajectory (single-turn). Any of those can be
  *absent*. Invariant beats contingent when deciding what's fundamental.

The three survivors aren't three independent rules — they're **one dependency chain**, which is
*why* none can drop: the decision needs a squished number, the squish needs verdicts, the
verdicts need a scorer, the scorer needs a case to grade. Pull any link and everything
downstream starves.

**analogy.** "types of car — electric, manual, AWD?" Those are real axes but a car isn't
*fundamentally* those. It's engine + wheels + chassis moving a payload. Fuel / transmission
/ drivetrain are the config space of the components. Same here: golden / rubric / judge are
the config space of `dataset` and `scorer`.

> **how to read the rest of this doc.** you now have the whole thing. everything below zooms
> into one box: PART B (§2–§4) = ways to build the **dataset** and **scorer**; PART C (§5–§8)
> = making the numbers trustworthy instead of pretty; PART D (§9–§11) = the three common
> shapes you'll meet (offline/online, RAG, agents); PART E (§12–§14) = running the machine at
> scale and reading its output; PART F (§15–§17) = the traps, a worked example, and one real
> codebase. if a section feels dense, ask "which of the three boxes is this about?"

---

## 2 · the choices (what "golden / rubric / etc." actually are)

Each fills exactly one box. This is why they compose instead of competing — they're answers
to *different questions*.

```
"golden"   = a fact about your DATASET  (each case carries a labeled answer)
"rubric"   = a fact about your SCORER   (it grades against criteria, not an answer)
"judge"    = a fact about your SCORER   (an LLM assigns the score)
"trajectory" = a fact about the UNIT    (a case is a path, not a single output)
```

They feel like a menu of "eval types" but they're picks along independent axes. A real eval
is one pick from each axis at once:

```
axis 1 — REFERENCE  what do you compare against?
  reference-based ... you have a gold answer   ("golden", labeled set)
  reference-free .... no single right answer    ("rubric", assertions)

axis 2 — GRADER     who assigns the score?
  code · statistical · LLM-judge · human

axis 3 — SCALE      what shape is the score?
  binary · absolute (1–5) · pairwise (A>B) · ranking

axis 4 — UNIT       what counts as one case?
  point / single-turn  ("LLM eval")
  trajectory / path    ("agent eval")
```

> caveat: "the four axes" is a *teaching map*, not a named industry thing. The individual
> distinctions inside it are canonical (reference-based vs reference-free is textbook;
> pointwise vs pairwise is textbook). Don't write "the four axes of eval" in notes as if
> teams say it. Say: *"an eval is one pick from each of these independent choices."*

---

## 3 · dataset roles (a *different* axis: why the case exists)

The axes in §2 all answer **"how is a case scored?"** This answers a different question:
**"why is this case in the set at all?"** That's *provenance / intent* — orthogonal to
reference / grader / scale / unit. `golden / adversarial / regression` is the industry-standard
naming, and it's the one thing people collapse into the single word "golden" when it's really
a three-way distinction.

```
role          provenance (where the case came from)      what it defends
──────────────────────────────────────────────────────────────────────────
GOLDEN        a human curated it: "this is right"        defines correct behavior
ADVERSARIAL   you hunted for where it breaks             exposes failure modes
REGRESSION    a REAL past failure, frozen as a test      stops a fixed bug returning
```

**the key move: role ≠ folder. one file layout can play all three at once.** A single case
can wear more than one hat — a case with a labeled answer (golden) that also encodes a bug
that already bit you once (regression). Role is *why the case is in the set*, not where it
lives.

```
eval/goldens/01-*.ts … 10-*.ts   (10 files, each one case, each with signalClass)
        │
        ├─ GOLDEN ────── the curated whole. hand-labeled right answers.
        │
        ├─ ADVERSARIAL ─ the TRAP subset, each targeting a failure mode:
        │     no-signal   → abstention test   (does it invent an anomaly?)  ← most important
        │     positive    → direction trap    (surge, not drop — breaks "down=bad")
        │     multi-scope → compositional test (two anomalies at once)
        │
        └─ REGRESSION ── cases 01 + 08: captured from a real past failure
                        ("pause the A/B" rec), frozen so it can't come back.
```

**why adversarial is where the value is.** the happy-path (`has-signal`) case only proves the
system works when nothing's wrong — near-worthless alone. the traps are the eval:
- **abstention** (`no-signal`) — the default failure of an anomaly system is *confidently
  inventing* an anomaly. "should say I don't know" is the behavior most systems fail.
- **direction** (`positive`) — almost every detector silently assumes *down = bad*. one case
  catches an entire baked-in assumption.
- **composition** (`multi-scope`) — does it degrade to reporting one anomaly when two co-occur?

naming *why each adversarial class exists* ("I test abstention, direction-assumption, and
composition — not just the happy path") is a far stronger interview answer than "I have 10
golden cases."

**regression = harness-concern-#6 pushed down into the data.** in §12 "regression-compare" is a
*harness* property (diff vs baseline). a regression *case* is the same ratchet at the dataset
level: **a bug that became a permanent test.** the gate fails the moment a refactor
reintroduces the old behavior. behavior only moves forward.

> **role vs reference are independent.** in this set all three roles happen to be
> reference-based (all have expected answers), but they needn't be — an adversarial
> prompt-injection case graded by "did it leak the prompt?" is reference-free. don't conflate
> **golden** (a role) with **reference-based** (a grading axis); this set just makes them coincide.

**three traps to avoid (the honest flags):**
- **roles riding too few cases** — with 4 classes across 10 files, `no-signal` is ~1–2 cases:
  a *smoke test* for abstention, not coverage. adversarial should be the *fastest-growing*
  slice, not a couple of ten.
- **implicit regression = rot** — "de-facto regression set" is a smell. if 01+08's regression
  role is emergent convention, nothing stops a refactor deleting case 08 and silently dropping
  the guard. tag it: `regression_for: 'ab-pause-2025-11'` pointing at the original failure, so
  the case self-documents *what bug it protects*. regression is the one role you cannot leave
  implicit.
- **no adversarial case for the judge** — every trap here targets the *agents*; none targets
  the *scorer* (e.g. a verbose-but-wrong diagnosis a naive judge over-scores). that's the
  calibration gap (§7/§17) seen from the dataset side. point ≥1 adversarial case at the judge.

---

## 4 · the method menu (not made up, not math)

"which method?" is a **lookup off a small closed menu**, the way you pick a data structure.
No formula outputs the method. There's a menu and a matching rule.

```
GRADER MENU (who assigns the score)          needs a gold answer?
─────────────────────────────────────────────────────────────────
1. exact / structural match   (==, schema)   yes
2. fuzzy / overlap            (F1, edit dist) yes
3. semantic similarity        (embedding cos) yes
4. set metrics                (precision/recall/F1)  yes (labeled set)
5. rubric + LLM-judge         (criteria → score)     no
6. property / assertion       (valid JSON? no PII?)  no
7. trajectory / path check    (right tools, right order)  no
8. human rating               (person scores)        no
```

That's ~the whole toolbox. "rubric / golden / trajectory" are just entries 5, 4, 7.

**the matching rule** — a decision procedure, not arithmetic:

```
does the output have ONE correct answer?
├─ yes, exact ──────────► exact match (1)      classify, extract, route
├─ yes, a labeled set ──► set metrics (4)      "did it catch the anomaly?"
├─ close-but-fuzzy ─────► overlap / semantic (2,3)
└─ no, it's a judgment call ─► rubric + judge (5)   summaries, diagnoses, recs

is it a PATH, not an output? ──► trajectory (7)   agents
is it a hard constraint? ─────► assertion (6)     "must be valid JSON"
is it the ground-truth anchor? ► human (8)        calibration
```

the pick is **forced by the shape of the output** — that's why it feels non-arbitrary but
also non-mathematical. Ground-truth labels exist → you *can* compute precision/recall, so
you do. No single right answer exists → no metric exists to compute, so you fall to
rubric+judge.

**where math actually enters:** only *inside* a method, never in choosing it.
`precision = TP/(TP+FP)`, F1, percentiles — arithmetic that runs *after* the method is
already chosen by output-shape. So: **choosing = lookup (no math). running = sometimes
arithmetic.** The "is this math?" instinct is picking up on the arithmetic inside methods
1–4, which happens downstream of the (non-math) choice.

> honest caveat: the menu has *defaults*, not one legal answer per row. A diagnosis *could*
> be graded by semantic-similarity to a golden diagnosis (3) instead of a rubric (5). Some
> teams do exactly that. "I chose rubric over semantic-similarity because diagnoses have
> many valid phrasings" is a strong deliberate-choice answer.

---

## 5 · the core metrics, defined plainly

You keep seeing accuracy / precision / recall / F1. They're not hard — all four fall out of
**one 2×2 table**: what the AI said vs what was actually true. For the angry/not-angry labeler:

```
                     actually angry       actually not
   AI said angry     TP (hit)             FP (false alarm)
   AI said not       FN (miss)            TN (correct pass)
```

- **accuracy** = (TP+TN) / all — "what fraction did it get right." *trap:* useless on lopsided
  classes. if 99% of emails are not-angry, a model that always says "not-angry" scores 99%
  accuracy and catches **zero** angry customers.
- **precision** = TP / (TP+FP) — "when it SAID angry, how often was it right." punishes false
  alarms.
- **recall** = TP / (TP+FN) — "of all the truly angry, how many did it CATCH." punishes misses.
- **F1** = harmonic mean of precision & recall — one number when you care about both.

precision vs recall is a **dial you set by consequence**, not a fact:

```
spam filter    → precision (a false-positive eats a real email)
cancer screen  → recall    (a miss is fatal; a false alarm = one more test)
3am on-call    → precision  (don't page for noise)
safety-critical→ recall     (don't miss the real one)
```

plain: **precision = "don't cry wolf." recall = "don't miss the wolf."** you rarely max both;
pushing one usually drops the other.

blooming's `scoreDetections` is exactly this table over the golden anomaly set: did the
monitoring agent flag the anomalies that were really there (recall) without inventing ones
that weren't (precision)?

---

## 6 · dataset quality — a good pile beats a big pile

§3 was *why each case exists* (role). This is whether the **pile as a whole** is any good. A
clean eval on a bad dataset lies to you confidently.

four things make a set trustworthy:

- **coverage** — does it hit the real input distribution *and* the important edges? gaps are
  blind spots you'll ship straight past.
- **diversity** — 20 cases that each test something different, not 20 rewordings of one case.
- **balance** — enough of each class/slice to say anything *per-slice* (see §8).
- **no leakage** — test cases must not overlap what the system was built/tuned on, or you're
  grading memorization. this is the eval version of testing on your training data — the #1
  silent score-inflator.

**how big?** no magic number, but a ladder:

```
~10        smoke test — "not obviously broken." can't slice. (blooming is here)
~50–100    per-slice signal starts to mean something
~300–1000  a single percentage point moves with confidence
```

**the senior habit: metadata on every case** — tag each with slice / difficulty / role so
aggregation answers "*where* does it fail," not just "does it fail." a flat `85%` is inert;
"`85%` overall but `40%` on multi-scope" tells you exactly what to fix next.

build order that avoids waste: a few happy-path cases, then aggressively add adversarial +
real production failures. never grow the happy-path past the point it's proven — grow the traps.

---

## 7 · LLM-as-judge — and how to trust it

When there's no single right answer you often let an LLM grade (rubric + judge). It's powerful
and it's the scorer people trust *too much*. Two things make it usable: knowing its biases,
and calibrating it.

**the judge's known biases** (all documented, all real):

```
position   ─ prefers whichever answer came first (in pairwise)
verbosity  ─ scores longer answers higher, right or wrong
self-pref  ─ a model rates its OWN family's outputs higher
sycophancy ─ agrees with hints in the prompt ("I think A is better, right?")
```

**mitigations** (cheap — do them):
- randomize order and run both orders → kills position bias
- give an explicit-criteria rubric, not "rate 1–10" → kills most verbosity drift
- judge with a *different model family* than the one generating → blunts self-preference
- absolute scoring (grade each answer in isolation), and ask for reasoning *then* a score

**calibration — the part everyone skips.** A judge is a ruler you haven't checked against a
real ruler. Calibration = have humans label ~30–50 cases, then check the judge agrees:

```
judge says 5, human says 5  → exact hit
judge says 4, human says 5  → within-1 (fine for most uses)
judge says 5, human says 2  → the judge is lying to you at scale
```

Agreement metrics: exact-match rate, within-1 (on a 1–5), or correlation. **Without
calibration, every downstream RESULT number (§13) is a reading off an unchecked instrument.**
blooming's `6/6` is the right idea at the wrong size: n=6 proves "not broken," not
"trustworthy" — the confidence interval is enormous (§8). target ~40.

**separation discipline** (the pro move): generate, label, and judge with three *different*
model families where you can, so no model grades its own homework.

---

## 8 · why n matters — statistics without the pain

The doc keeps saying "n is thin." here's *why*, without formulas you'll forget.

**the intuition:** a percentage from few samples is jittery. flip a fair coin 4 times and
getting 3 heads (75%) is common — you'd wrongly "conclude" the coin is biased. flip it 400
times and 75% basically never happens. **more n = less jitter = you can trust the number.**

what small n breaks, concretely:

```
"85% on 20 cases"    → the true value is roughly 68–95%. THAT RANGE is your real result.
"p99 latency, n=10"  → p99 of 10 samples IS the max. one data point cosplaying a percentile.
"6/6 calibration"    → looks perfect BECAUSE tiny. proves not-broken, not trustworthy.
"40% on a 2-case slice" → that's 40% ± a coin flip. don't act on it yet.
```

rules of thumb (not law):
- percentiles (p95/p99) need **hundreds** or they're theater.
- per-slice claims need **~30+ in that slice** before you act on them.
- one pass/fail flip on tiny n can swing your headline several points — don't celebrate or
  panic over a single case.

**the honest reporting move: always show the denominator.** "`85% (n=20)`" lets the reader
size the jitter; a bare "`85%`" hides it. this one habit reads as senior, because a number
without an n is half a number.

---

## 9 · offline vs online — two different jobs both called "eval"

Everything so far is *offline*: a frozen pile of cases, run in dev/CI, answering "is the new
version better than the old one *before* I ship." there's a second world.

```
OFFLINE (dev-time)                    ONLINE (production)
─────────────────────                 ──────────────────────
fixed, labeled dataset                live, unlabeled real traffic
runs in CI / before deploy            runs continuously on real users
Q: "good enough to ship?"             Q: "still good? did it regress in the wild?"
metrics vs known answers              quality proxies + guardrails + user signals
you HAVE ground truth                 you usually DON'T — no labels live
```

**the hard part of online: no labels.** you can't compute recall on traffic you never
labeled. so online eval leans on things that need no ground truth: **guardrail checks** (no
PII, valid format), **sampled human review**, **user signals** (thumbs, retries,
escalations), and **drift detection** (is today's output distribution sliding vs last week?).

**how they connect — the loop:** online *surfaces* real failures → you capture the ugly ones
→ they become new offline cases (many of them regression cases, §3). offline *proves* a fix;
online *finds* what to fix next. a mature system runs both continuously.

blooming's `onCapabilityEvent` + receipts pipeline is the **online** half (watching live
behavior + cost). the goldens + harness are the **offline** half.

---

## 10 · RAG evals — grade the two halves separately

RAG = *retrieve* documents, then *generate* an answer from them. the beginner mistake is
grading only the final answer — then when it's wrong you can't tell *which half* broke. so you
eval retrieval and generation **separately**.

```
query ─► [ RETRIEVER ] ─► chunks ─► [ GENERATOR ] ─► answer
              │                          │
        did it FETCH               did it USE them
        the right stuff?           faithfully?
```

**retrieval metrics** (this half *has* ground truth — you know which docs are relevant):
- **recall@k** — of the docs that should've been fetched, how many made the top-k
- **precision@k** — of the top-k fetched, how many are actually relevant
- **MRR / nDCG** — did the best doc rank near the top

**generation metrics** (reference-free, usually rubric + judge):
- **faithfulness / groundedness** — is every claim supported by the retrieved chunks, or did
  it hallucinate?
- **answer relevance** — does it actually address the question?
- **context use** — did it use the good chunk it was handed, or ignore it?

**the diagnostic power of splitting:**

```
retrieval good + answer bad  → generation / prompt problem
retrieval bad  + answer bad  → retriever / index problem (fix here FIRST)
retrieval bad  + answer good → it got lucky; will break silently later
```

"RAG at two scales" = running this same split on a small corpus and a large one. the metrics
don't change; the retrieval difficulty does.

---

## 11 · agent / trajectory evals — grade the path, not just the destination

a single LLM call has one output → you grade the output (**point eval**). an agent takes
*steps* — picks tools, calls them, reacts, loops. now the final answer being right isn't
enough: *how it got there* matters (40 tool calls when 2 would do? a dangerous action on the
way?). you grade the **trajectory**.

```
POINT eval (LLM)         TRAJECTORY eval (agent)
──────────────           ───────────────────────
one output               a sequence of steps
"is the answer good?"    "was the PATH correct?"
      ↓                        ↓
grade the string         right tools? right order? recovered from errors?
                         efficient? reached the goal? safe?
```

what you actually check on a trajectory:
- **task success** — did it ultimately achieve the goal (the destination still counts)
- **tool correctness** — right tool, right args, at the right step
- **efficiency** — step count / cost vs optimal (agents love to wander)
- **error recovery** — when a tool failed, did it adapt or spiral
- **safety** — did it avoid actions it shouldn't take

blooming's **coordinator** is exactly this: "did it route to the right agents in the right
order" is a trajectory / path check, not a quality score — which is why (§17) it gets
trajectory × code, not a rubric.

the catch: trajectory evals are harder to label (many valid paths exist) and often need
step-level ground truth or a rubric over the whole trace. this is the frontier — most teams do
it only partially.

---

## 12 · the harness (what turns the loop into infrastructure)

The loop in §1 is the *physics*. A **harness** is the engineering around it that lets you
run it repeatedly, cheaply, and trustably over real (slow, flaky, expensive,
non-deterministic) systems.

```
                        THE EVAL HARNESS
   ┌──────────────────────────────────────────────────────────┐
   │  dataset ─► TASK ─► output ─► SCORER ─► score ─► AGG       │─► report
   │  loader   (SUT)              (grader)                      │   + compare
   │  ────────────────────────────────────────────────────────│   to baseline
   │            cross-cutting concerns (the actual job):        │
   │  versioning · concurrency · caching · persistence ·        │
   │  observability · regression-compare                        │
   └──────────────────────────────────────────────────────────┘
```

**core (minimum viable):**
- **case** = `{input, [expected], metadata}`. metadata matters more than expected —
  it's how you slice ("judge fine on refunds, tanks on returns").
- **task / SUT** = the thing under test, behind a *pluggable* interface. If the harness
  knows whether the SUT is one call vs a RAG chain vs an agent, it's a script, not a harness.
- **scorer** = `(output, expected?) → score`, pluggable + composable.
- **aggregation** = scores → decision signal (mean, p50/p95, pass-rate, per-slice).

**the six concerns that earn the name "harness":**
1. **concurrency + rate control** — bounded parallelism, retries+backoff, timeouts. naive
   `for case: await run()` is unusable at 500 cases.
2. **partial-failure isolation** — one case throwing must not kill the run. capture the
   error *as a result* and continue. dying on case 347/500 = worthless.
3. **caching** — key on `hash(input + prompt_version + model)`. changing only the scorer
   must not re-pay for generation. biggest cost lever.
4. **persistence of raw I/O** — store outputs, not just scores. you debug a pass-rate drop
   by *reading the failing outputs*. scores-only = a black box you can't act on.
5. **observability** — tokens / latency / $ per case + per run.
6. **versioning + regression-compare** — pin dataset+prompt+model together, diff against a
   baseline. "did my change help?" is *the* question a harness exists to answer.

**the test — harness vs script:** *can you swap the SUT, swap the scorer, and re-run against
last week's numbers without editing the loop?* yes → harness.

> most portfolio "harnesses" implement 1–4 and stop. concurrency, failure-isolation, and
> regression-compare are the senior signal — they only matter at real scale, which is exactly
> what synthetic-load + fault-injection are meant to demonstrate.

---

## 13 · what the numbers are *for*

The mistake is reading every number as "how good is the system." Only one kind is. Sort by
**purpose**:

```
kind          answers                        about quality?
──────────────────────────────────────────────────────────────
INSTRUMENT    "what resolution is my ruler?"   no — scorer design
              (4 dims, 5-scale, 3 verdicts, #rubrics)
COVERAGE      "how much did I test?"            no — dataset breadth
              (10 goldens, 4 classes)
RESULT        "is the system good?"            YES ← the only one
              (the scores themselves)
CALIBRATION   "do I trust the ruler?"           no — measures the measurer
              (6/6 verdict, 24/24 within-1)
OPERATIONAL   "what did it cost / how slow?"    no — runtime
              (p50/p95/p99, $ per case)
```

- **INSTRUMENT** describes the ruler, not the thing measured. `4 dims × 5-scale × 3 verdicts`
  is scorer *design* — resolution. Picked before you run anything. Can't be good/bad, only
  well/poorly designed for the question.
- **COVERAGE** is the *denominator* of every result. "passed" is meaningless without
  "passed *on what*."
- **RESULT** is the only quality signal — and often the *last* to exist. If your dashboard
  is all instrument+coverage+calibration+cost, note that **none of those numbers say whether
  the system is good.** They say it's *measurable*.
- **CALIBRATION** is meta — it says the *judge* agrees with humans, licensing trust in the
  results. Without it, results are readings from an ungraded ruler.
- **OPERATIONAL** is orthogonal to quality entirely. p95 can be great while the system is
  wrong. it's a ship-gate, not a quality-gate.

**interview move:** when someone points at the dashboard and asks "so is it good?", answer
*"which number — the quality result, or my confidence in the judge that produced it?"*
Separating result from calibration out loud is the senior tell.

---

## 14 · per-agent vs shared (the number that trips everyone)

"different evals per agent" is true about the **method**. It does **not** mean each agent
owns a column of numbers. Most numbers are *shared plumbing*; only two things are per-agent.

```
PER-AGENT (changes by agent)        SHARED (same for everyone)
────────────────────────────        ──────────────────────────
which method  (rubric/golden/traj)  5-scale, 3 verdicts   (grading scale)
which rubric  (2 rubrics = 2 agents) calibration           (judge trust)
                                    p50/p95/p99, $         (runtime)
```

**analogy.** a school grades essays by rubric and math by answer-key — *per subject*. But
the A–F scale is the *same* in every class; the student count is the *same*. Nobody says
"the A–F scale belongs to English." The 5-scale and percentiles are the A–F scale.

walk **one** agent and check every number:

```
diagnostic agent — which numbers touch it?
  method: rubric × judge ──────  ✓ ITS choice (per-agent)
  4 dimensions ────────────────  ✓ shape of ITS rubric (per-agent)
  5-scale, 3 verdicts ─────────  shared scale
  10 goldens ──────────────────  ✗ DOESN'T TOUCH IT (feeds monitoring's P/R/F1)
  calibration ─────────────────  shared — validates the JUDGE (→ licenses diag's scores)
  p95 / $ ─────────────────────  shared runtime
```

of ~7 numbers, exactly **one pair** (method + its dimensions) is "about" this agent. The
odd one out — **goldens** — is a *single-agent* dataset that only the monitoring agent is
scored against. Not global, not every-agent. That's usually what snags people.

```
per-agent:      method + rubric
shared:         scale, calibration, percentiles, $
per-ONE-agent:  goldens → monitoring only
```

---

## 15 · common pitfalls & Goodhart's law

The ways evals lie to you, collected in one place:

- **testing on training data (leakage)** — grades memorization, not ability. the #1 silent
  score-inflator (§6).
- **tiny-n theater** — §8. percentages and percentiles that are noise wearing a suit.
- **uncalibrated judge** — §7. a confident RESULT number sitting on an unchecked ruler.
- **happy-path only** — §3. proves it works when nothing's wrong; says nothing about failure.
- **one number, no slices** — "85%" hides "40% on the slice that actually matters."
- **gaming the metric (Goodhart)** — *"when a measure becomes a target, it stops being a good
  measure."* optimize hard against one rubric and the model learns to satisfy the *rubric*,
  not the goal (e.g. pad answers to please a verbosity-biased judge). defense: keep a held-out
  set the optimizer never sees, and adversarially rotate the rubric.
- **vanity metrics** — measuring what's easy (accuracy) instead of what matters (recall on the
  rare critical class).
- **no baseline** — "85%!" versus *what?* without last week's number you can't say
  better/worse, which is the only question that ships code.

one rule that prevents most of these: **an eval number is only meaningful with its
denominator (n), its baseline, and a calibrated scorer.** missing any of the three → treat the
number as a hint, not a fact.

---

## 16 · a worked example, end to end

The smallest real eval — the angry-email labeler — all three boxes in code shape (pseudo-TS):

```ts
// BOX 1 — dataset: examples with known answers + metadata for slicing
const cases = [
  { input: "WHERE IS MY REFUND",       expected: "angry",     meta: { slice: "billing", role: "golden" } },
  { input: "thanks, got it!",          expected: "not-angry", meta: { slice: "thanks",  role: "golden" } },
  { input: "following up on my order", expected: "not-angry", meta: { slice: "neutral", role: "adversarial" } },
  // ...20 total
];

// BOX 2 — scorer: one case → verdict. here exact-match, because there's a right answer.
const score = (output, expected) => (output.trim() === expected ? 1 : 0);

// THE LOOP (a baby harness): run each case, keep the RAW output so you can read failures
const results = [];
for (const c of cases) {
  const output = await classify(c.input);          // ← the system under test
  results.push({ ...c, output, score: score(output, c.expected) });
}

// BOX 3 — aggregate: squish verdicts into decision numbers
const accuracy = mean(results.map(r => r.score));
const { precision, recall, f1 } = prf(results);     // the 2×2 table from §5

// THE DECISION — note the denominator (§8) and slice breakdown (§6)
console.log(`acc ${accuracy}  P ${precision}  R ${recall}  F1 ${f1}  (n=${cases.length})`);
report(bySlice(results));   // "85% overall, 40% on adversarial" ← the actionable line
```

Two things to notice:
- swap `score()` for a **rubric+judge** and *nothing else changes* — that's the pluggability
  from §12. the boxes don't move; only the scorer's insides do.
- wrap `classify()` in a cache, add retries + a baseline diff, and you've started building the
  real harness. every section of this doc is a way to make **one of these three boxes** better.

---

## 17 · mapping a real topic to all of the above

The multi-agent system uses **a different eval type per agent role** — §4's matching rule
made physical. This is why "4 signal classes / 2 rubrics" line up the way they do:

```
agent           eval question     method (the axis combo)        primitive
coordinator     routed right?     trajectory × code              —
monitoring      caught anomaly?   golden × code × set → P/R/F1   scoreDetections
diagnostic      diagnosis good?   rubric × judge × 5-scale       RubricJudge
recommendation  rec good?         rubric × judge × 5-scale       RubricJudge
```

2 rubrics (not 4) because monitoring gets precision/recall (not a rubric) and coordinator
gets routing correctness (not a quality score). Naming *"different agents demand different
eval axes"* explicitly is exactly the point an interviewer rewards.

**machinery ↔ files:**

```
file                     box              axis picks
01-eval-set-types    →   DATASET          reference-based (golden) storage
02-eval-methods      →   SCORER           rubric × judge × 5-scale(abs)
03-llm-judge-bias    →   SCORER trust     bias mitigation + calibration
04-observability     →   AGGREGATE+runtime cost/latency
run.eval.ts          →   THE LOOP         the harness
report.eval.ts       →   AGGREGATE→report percentiles + $
```

**the honest read: structure = senior-grade, n = placeholder.**
- 10 goldens / 4 classes ≈ 2.5 per class — smoke skeleton; can't slice per-class yet.
- 6/6, 24/24 within-1 = a calibration *smoke test*, not a calibration *set*. 6/6 looks
  perfect *because* n is tiny; CI is enormous. proves "not broken", not "calibrated". target
  ~30–50 human labels before "calibrated" is defensible. ← the thing an interviewer pokes.
- p50/p95/p99 over 10 cases is meaningless (p99 of 10 = the max). percentiles need volume —
  which is why synthetic load is on the plan.

don't add eval *machinery* — it's there. add **volume + human labels**.

**dependency-first build order** (from `not_started`):
```
1. 01  freeze golden schema {input, expected, signal_class, metadata}
2. 02  rubrics-as-data (write before judge — judge needs criteria to read)
3. run.eval.ts  the loop, once dataset+scorer shapes are stable
4. 03  calibration (after judge runs) — expand n=6 → ~40 here
5. 04 / report  observability last — aggregates what the loop produced
```

> one structural edit: "evals" and "observability" answer different questions —
> *is the output good* (01–03) vs *what did it cost / what happened* (04). worth a one-line
> separator so `onCapabilityEvent` + receipts is clearly answering the second.

---

## eng-vocab one-liners

- **eval** — a scoring function run over a fixed dataset, aggregated into a decision;
  everything else is a choice about the dataset or the scorer.
- **the three boxes** — dataset (what to test on) → scorer (grade each answer) → aggregation
  (squish to one number). invariant: drop any one and it stops being an eval.
- **eval harness** — the runtime that executes that loop over a fixed, *versioned* dataset
  with production concerns (concurrency, failure-isolation, caching, persistence,
  observability, regression-compare) that make results repeatable and debuggable.
- **eval methods** — a fixed ~8-item menu of grader types; selected per agent by the *shape
  of its output* (single answer → match/metrics; judgment call → rubric+judge; path →
  trajectory), not by calculation. math only appears *inside* a method once chosen.
- **dataset roles (golden / adversarial / regression)** — a *provenance* axis independent of
  how you grade: golden = curated to define correct; adversarial = built to expose failure;
  regression = a real past bug frozen as a permanent test. one case can wear several roles;
  regression is the one role you must tag explicitly or it rots.
- **precision vs recall** — precision = "don't cry wolf" (of what it flagged, how much was
  real); recall = "don't miss the wolf" (of what was real, how much it caught). F1 combines
  them. you set the dial by consequence, not by formula.
- **dataset quality** — coverage + diversity + balance + no-leakage. a good pile beats a big
  pile; metadata-per-case is what turns "does it fail" into "*where* it fails."
- **LLM-as-judge** — flexible scorer with known biases (position, verbosity, self-preference,
  sycophancy); usable only with mitigations + a human-labeled calibration set (~30–50).
- **calibration set** — human-labeled anchors that measure the *judge*, not the system.
  small n = "not broken"; trustworthy needs ~30–50.
- **why n matters** — small samples jitter; "85% (n=20)" spans ~68–95%. show the denominator;
  percentiles need hundreds; per-slice claims need ~30+.
- **offline vs online** — offline = fixed labeled set in CI ("good enough to ship?"); online =
  live unlabeled traffic ("still good?"), graded by guardrails + signals + drift, no ground
  truth. online finds failures → they become offline regression cases.
- **RAG eval** — grade retrieval (recall@k, precision@k, nDCG — has ground truth) and
  generation (faithfulness, answer-relevance — rubric+judge) *separately*, so you know which
  half broke.
- **agent / trajectory eval** — grade the *path* (right tools, order, recovery, efficiency,
  safety), not just the final answer. harder to label; many valid paths.
- **eval numbers by purpose** — instrument (ruler design), coverage (what was tested),
  result (is it good), calibration (do I trust the ruler), operational (what it cost). only
  *result* speaks to quality; the other four exist to make result trustworthy + affordable.
- **per-agent vs shared** — each agent picks a *method*; most numbers are a shared measuring
  toolkit reused across agents; goldens are a single-agent dataset scored only against the
  monitoring agent.
- **Goodhart's law** — when a measure becomes a target it stops being a good measure. defense:
  hold-out set the optimizer never sees + adversarial rubric rotation.

---

## glossary

```
accuracy         (TP+TN)/all. misleads on imbalanced classes.
adversarial      a case built to expose a failure mode (dataset role).
aggregation      box 3: squish per-case verdicts into a decision number.
baseline         last known result; the thing you diff against to say "better/worse".
calibration      checking the judge (or any scorer) against human labels.
case             one eval example: {input, [expected], metadata}.
coverage         how much of the real input space the dataset touches.
dataset          box 1: the pile of cases you test on.
drift            output/input distribution sliding over time (online signal).
faithfulness     RAG-gen metric: are the answer's claims grounded in retrieved text?
F1               harmonic mean of precision & recall.
golden           a curated "this is the right answer" case (dataset role).
ground truth     the known-correct label for a case.
harness          the runtime around the loop: concurrency, cache, persistence, compare.
judge (LLM-)     an LLM used as the scorer for open-ended outputs.
leakage          test data overlapping build/tune data → grades memorization.
offline eval     fixed labeled dataset, run in dev/CI, pre-ship.
online eval      live production traffic, usually unlabeled, continuous.
precision        TP/(TP+FP). "when it fired, was it right?"
p50/p95/p99      latency/score percentiles; need large n to mean anything.
recall           TP/(TP+FN). "of the real ones, how many caught?"
recall@k         retrieval metric: of relevant docs, how many in top-k.
reference-based  grading against a known answer (needs a gold label).
reference-free   grading against criteria/properties (no single answer).
regression       a real past failure frozen as a permanent test (dataset role).
rubric           explicit scoring criteria a (usually LLM) judge grades against.
scorer           box 2: turns one output into a verdict.
slice            a labeled subset (by class/difficulty) you report separately.
SUT              system under test — the thing being evaluated.
trajectory       the step-by-step path an agent takes; the unit of agent eval.
```
