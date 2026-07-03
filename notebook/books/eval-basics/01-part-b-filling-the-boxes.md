# eval basics — Part B · filling the boxes

> **eval basics** — split into parts, read in order. cross-refs use section numbers.
> ```
> A · what an eval is ............ sections 0-1
> B · filling the boxes .......... sections 2-4   <- this file
> C · making evals that dont lie . sections 5-8
> D · where evals run ............ sections 9-11
> E · running & reading .......... sections 12-14
> F · pitfalls & practice ........ sections 15-17
> appendix · vocab + glossary
> ```

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
