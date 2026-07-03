# eval basics — Part C · making evals that don't lie

> **eval basics** — split into parts, read in order. cross-refs use section numbers.
> ```
> A · what an eval is ............ sections 0-1
> B · filling the boxes .......... sections 2-4
> C · making evals that dont lie . sections 5-8   <- this file
> D · where evals run ............ sections 9-11
> E · running & reading .......... sections 12-14
> F · pitfalls & practice ........ sections 15-17
> appendix · vocab + glossary
> ```

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
