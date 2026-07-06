# spec: rehearse-eval-workshop

> **To wire this up as a Claude Code command:** generate a `commands/rehearse-eval-workshop.md`
> modeled on `commands/rehearse-interview-defense.md`. The command should: take no arguments;
> scaffold `.aipe/project/context.md` and stop if missing; load project + global context; load
> the template chain in order — `${CLAUDE_PLUGIN_ROOT}/specs/format.md` → `teacher.md` → `me.md` →
> `specs/rehearse-eval-workshop.md` (this file); run a **discovery step** that reads the invoked
> repo's eval surface (search `eval/`, `evals/`, `*.eval.*`, `ragas`/`deepeval`/`langsmith`; detect
> RAG vs agent vs plain-LLM); branch CREATE vs RESUME on whether `.aipe/rehearse-eval-workshop/`
> already holds a workbook; generate a `00-map.md` discovery map plus one file per exercise below
> into `.aipe/rehearse-eval-workshop/` (skip RAG/agent exercises whose shape wasn't detected); then
> report and **stop**, offering to coach through exercises one at a time. Output is per-repo at the
> fixed path `.aipe/rehearse-eval-workshop/`.

This spec is the **content layer** — it supplies the exercise arc, the two-track structure, the
ownership model, the per-exercise template, and the guardrails. It is loaded last in the command's
template chain (after `format.md`, `teacher.md`, `me.md`), so it does NOT restate house style,
diagram rules, or voice — those come from `format.md` and `teacher.md`. Where this spec and
`format.md` conflict on quality standards, `format.md` wins; this spec wins on exercise shape and
guardrails.

---

## the payoff (verdict first)

The reader finishes able to answer one interview-grade question about their own repo, without
hand-waving:

> **"You let AI write the app AND the eval — why do you trust the result?"**

The answer the whole workbook builds toward: *not because a human typed it, but because a human
verified its verdicts against known-correct cases.* Trust comes from calibration against a
human-owned anchor, not from authorship.

## the instinct being corrected

Beginners assume *"the eval must be hand-written by the dev, because it's a test."* Half right.
An eval has three parts and only one is human-owned:

```
what's in an eval             who OWNS it            AI writes it?
──────────────────────────────────────────────────────────────────────
1. harness (loop, runner,     dev owns the design    YES — heavily. it's plumbing.
   gate, report, plumbing)
2. graders / rubrics          dev owns the criteria  AI drafts → human decides
   (what "good" means)
3. cases + LABELS             HUMAN owns the labels   NO for labels.
   (the ground truth)                                 AI may draft candidate cases;
                                                       human judges them.
```

The reader's leverage is at the **anchor** (ground-truth labels + calibration verdicts), not at
the plumbing. Every exercise keeps pushing them toward the anchor and away from hand-typing loops.

## repo-scope rule (inherited, restated because it's load-bearing here)

Every exercise anchors to the repo the command runs in. Example project names or paths that might
appear in a reader's mind (or in older notes) are illustrative shapes only — never the answer.
Read THIS repo's eval files (from the command's discovery step) and cite only those real paths.
If the repo has no eval surface, the workbook builds it from zero; do not pretend files exist.

---

## per-exercise template

Every exercise file uses this seven-part shape. Keep the order; keep both tracks visible.

```
# Exercise N — [title]

① verdict      one line: the point of this step, said first
② analogy      ground it in something non-eval before mechanism (per format.md's analogy rule)
③ in your repo the specific real path(s) this touches, from discovery — or "missing, you'll create"
④ human track  what the reader authors by hand, and WHY only a human can
⑤ AI track     what Claude may draft, and how it's VERIFIED (authorship is never trust)
⑥ do it        the concrete task; the exact file/shape to write (repo conventions)
⑦ done when    the checkable finish line
```

Coach voice throughout (second person). One diagram minimum per exercise where it clarifies.
Always name the ownership line in ④/⑤ explicitly.

---

## the exercise arc

### 01 — the ownership split

① an eval has three parts; only the labels must be human — sort this repo's eval files into the
three buckets and the model is yours.
② building a house: AI can pour the foundation and frame the walls (harness), and *draft* the
inspection checklist (rubric) — but the inspector's signature that this house is safe (the labels)
is a human standing behind a judgment. You don't outsource the signature.
③ walk the discovery map (`00-map.md`).
④ for each eval file, the reader states the owner and applies the test: "if AI wrote this and got
it subtly wrong, what catches it?" Plumbing errors are caught by tests; label errors are caught by
*nothing* — which is why humans own labels.
⑤ Claude offers to generate any missing *plumbing* file on request — explicitly not labels.
⑥ annotate each eval file with a one-word owner (`// owner: human-labels | dev-design | auto`).
⑦ every eval file has a declared owner; the reader can name the one thing AI must never author.

### 02 — write ONE ground-truth case, by hand (eval-first)

① you author the answer key. If you can't say what a good answer looks like, you don't understand
the feature yet — so write the case before the feature, not after.
② writing the exam question and its model answer before teaching the class.
③ the repo's golden/case dir (or create it, matching conventions). Read an existing case for shape.
④ the reader writes ONE case fully by hand: real input + the answer they'd accept + metadata
(slice, difficulty). The **expected answer is the human artifact** — the anchor. AI does not fill it.
⑤ AI may draft *candidate inputs* ("give me 5 realistic inputs for this feature"); the reader picks
and writes the expected. AI proposes inputs; the human disposes the labels.
⑥ commit one hand-authored case.
⑦ one case exists whose `expected` a human wrote and stands behind. (If the repo already has cases:
instead audit one — "did a human verify this expected, or was it generated?" Untrusted labels are
worse than none.)

### 03 — let AI write the harness (and notice you can)

① the loop is plumbing; let AI write it. Trust it the way you trust any code — via tests — not via
authorship.
② you don't hand-forge the bolts to trust the bridge; you inspect the finished bridge.
③ the repo's runner (or where it's missing).
④ the reader specifies the *contract*: input → SUT → scorer → aggregate, and the pluggability
requirement (swap scorer/SUT without editing the loop). Design = human.
⑤ Claude writes the runner to that contract, then a trivial smoke test proving it runs the case
from 02 end to end. Trust = smoke test passed, not that Claude wrote it.
⑥ generate/extend the runner; run it on the one case; read the raw output.
⑦ one case flows through the loop and its raw result is readable from disk.

### 04 — the rubric: AI drafts, human decides (dimensions menu)

① "good" is undefined until you name *which* good — pick 3–4 dimensions; AI drafts criteria; you
edit and own them.
② an essay rubric: AI can suggest "clarity, evidence, structure," but the teacher decides what
earns a 5.
③ the repo's rubric dir. Read an existing rubric for shape.
④ the reader picks the dimensions that matter for THIS feature:
```
faithfulness   grounded in context, or inventing facts?      ← RAG's #1
relevance      answers what was asked, or on-topic but useless?
completeness   covers all parts, or only some?
safety         harmful content / PII / policy violations?
format/style   length / tone / structure / output-format?
task-specific  code runs? SQL valid? math correct?
```
⑤ Claude drafts the 1–5 criteria per chosen dimension, including *claim decomposition* for
faithfulness (extract each claim → SUPPORTED / INFERRED / UNSUPPORTED / CONTRADICTED → map counts to
a score). The reader edits every threshold. The draft is a starting point, not the ruler.
⑥ write one rubric file for the most important dimension.
⑦ a rubric exists whose criteria a human has read and adjusted.

### 05 — the trust anchor: calibrate the judge  ← THE SPINE

① this is the answer to "why trust an AI-written eval": hand-label a few cases, run the judge on
them, confirm it agrees. Agreement — not authorship — is trust.
② checking a new thermometer against one you know is accurate before you rely on its readings.
③ the repo's calibration dir + agreement script (create if missing).
④ the reader hand-scores a small set across the full quality range — including some *bad* ones
(start ~10, target ~30–50). These human verdicts are the anchor AI never touches.
⑤ Claude runs the judge from 04 on the same cases and computes agreement (exact-match + within-1 on
a 1–5). Claude may build the agreement script; it may NOT supply the human labels.
```
judge 5 / human 5  → exact hit
judge 4 / human 5  → within-1 (usually fine)
judge 5 / human 2  → the judge is lying at scale — fix the rubric, re-run
```
⑥ produce an agreement number. If low, iterate the rubric (04) and re-run — that loop IS the work.
⑦ the reader can state the judge's agreement rate AND its n, and knows whether that n is a smoke
test (~6) or trustworthy (~30–50).

> If the reader does only one exercise, do this one. It converts "AI wrote my eval, is it real?"
> into a measured number.

### 06 — adversarial-first (make the eval find bugs)

① a happy-path eval passes a broken system; the traps are the eval. Weight new cases toward the
failure modes you fear.
② crash-testing a car, not driving it around the parking lot.
③ add cases tagged `role: adversarial` (role is a list-valued field on the case, not a folder — a
case can be golden AND adversarial).
④ the reader names this system's failure modes and writes a trap per mode. Generic seeds:
```
abstention   input with no valid answer; does it invent one or say "I don't know"?
direction    a case that breaks a baked-in assumption
composition  two problems at once; does it degrade to handling one?
injection    user tries to override the system prompt; is it caught?
```
⑤ Claude proposes candidate adversarial inputs (it's good at edge cases); the human confirms each is
actually a trap and writes the expected behavior.
⑥ add ≥3 adversarial cases with role tags.
⑦ the adversarial slice is countable and growing faster than the happy path.

### 07 — RAG track  (only if retrieval detected)

① grade the two halves separately, or a wrong answer won't tell you which half broke.
② a two-stage line: inspect the parts bin (retrieval) and final assembly (generation) separately.
③ the repo's retriever and generator seams.
④ the reader labels, per query, *which documents should have been retrieved* — a human relevance
judgment.
⑤ Claude computes retrieval metrics (recall@k, precision@k) against those labels, and runs the
faithfulness rubric on generation. Split the scores:
```
retrieval good + answer bad  → generation / prompt problem
retrieval bad  + answer bad  → fix the retriever FIRST
retrieval bad  + answer good → got lucky; will break silently
```
⑥ separate retrieval and generation scores for ≥5 queries.
⑦ two numbers, not one; the reader can name which half is weaker.

### 08 — agent track  (only if an agent detected)

① grade the path, not just the destination — a right answer via a broken 40-step path is still
broken.
② grading a math proof: the final number being right doesn't excuse invalid steps.
③ the repo's tool-call log / trajectory.
④ the reader defines, per task, the goal AND the forbidden actions (the safety boundary is a human
call). Start minimal: "reached goal?" + "avoided forbidden actions?"
⑤ Claude scores trajectories on tool-correctness, order, error-recovery, efficiency (steps vs
optimal). Many valid paths exist → rubric-over-trace, not exact-path-match.
⑥ score ≥3 trajectories on goal + safety, then add one path-quality dimension.
⑦ a broken-path / right-answer case is correctly flagged as a failure.

### 09 — wire the gate

① an eval that doesn't block a bad deploy is a notebook; gate it and baseline it.
② a smoke detector wired to the alarm, not one you have to remember to sniff.
③ the repo's gate + baseline files (create if missing).
④ the reader sets the thresholds (ship-worthy score) and the regression policy — human judgment
about acceptable risk.
⑤ Claude writes the gate + baseline-diff + CI hook. Trust via a dry-run that deliberately fails on
a regressed case.
⑥ make the gate fail on a known-bad change, then pass on a good one.
⑦ a bad change cannot ship silently.

### 10 — capstone: articulate the anchor

Have the reader answer, in their own words, grounded in the files they built:

> "AI wrote my harness, drafted my rubric, and generated candidate cases. It did NOT write my
> ground-truth labels or calibration verdicts. I trust the eval because it agrees with those
> human-labeled cases at [X]% over n=[Y] — not because I typed it."

```
AI writes the app  ─┐
                    ├─► both checked against ──► cases a HUMAN labeled
AI writes the eval ─┘                            (the anchor AI never touched)
```

If the numbers are thin, the honest capstone is: "the machine is real; the anchor is still a smoke
test — next I grow the labels."

---

## workshop-specific overrides (everything else comes from format.md / teacher.md / me.md)

- **coach voice** (teacher.md's coach posture), second person, optimizing for the reader building a
  trustworthy eval — not third-person narration.
- **one exercise at a time.** When coaching live, present one exercise, then STOP and wait. Never
  run the whole arc unprompted.
- **always both tracks.** Every exercise shows human-authored vs AI-authored + verification, and
  states the ownership line explicitly.
- **ground in real repo files** read from disk (discovery map). Cite real paths; never invented ones;
  never another repo.
- **skip what exists.** If a piece is already mature in the repo, pressure its *quality* (n,
  coverage, agreement) instead of re-teaching its basics.
- **match repo conventions** when writing files (naming, language, structure). Do not impose a layout.

## guardrails (non-negotiable)

- Claude MUST NOT author ground-truth labels or calibration verdicts. It may draft candidate
  *inputs* and *rubric criteria*; the human disposes.
- Every AI-authored artifact is paired with a verification step (smoke test, dry-run, or calibration
  agreement number). Authorship is never presented as trust.
- No score is reported without its denominator (n).
- If there's no ground truth to anchor on (subjective outputs — tone, creativity), say so:
  calibration then means the judge tracks *human preference* on a labeled set, not a "correct"
  answer. Same principle, softer anchor.
