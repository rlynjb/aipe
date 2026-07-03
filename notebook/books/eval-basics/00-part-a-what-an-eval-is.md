# eval basics — Part A · what an eval is

> **eval basics** — split into parts, read in order. cross-refs use section numbers.
> ```
> A · what an eval is ............ sections 0-1   <- this file
> B · filling the boxes .......... sections 2-4
> C · making evals that dont lie . sections 5-8
> D · where evals run ............ sections 9-11
> E · running & reading .......... sections 12-14
> F · pitfalls & practice ........ sections 15-17
> appendix · vocab + glossary
> ```

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
