# eval basics — Part D · where evals run

> **eval basics** — split into parts, read in order. cross-refs use section numbers.
> ```
> A · what an eval is ............ sections 0-1
> B · filling the boxes .......... sections 2-4
> C · making evals that dont lie . sections 5-8
> D · where evals run ............ sections 9-11   <- this file
> E · running & reading .......... sections 12-14
> F · pitfalls & practice ........ sections 15-17
> appendix · vocab + glossary
> ```

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

**why online eval isn't optional — shipping is the beginning, not the end.** a system that
passed offline decays in production for reasons you don't control:

```
provider swaps the model  → your prompts silently stop working overnight
knowledge base goes stale → correct-at-launch answers become wrong
user distribution shifts  → real queries drift away from what you tested
product team edits prompt  → someone changes the system prompt, no re-eval
```

each of these passes your frozen offline set (nothing changed *there*) while quality drops for
real users. online eval is what *detects it fast* — the offline set can't, because the world
moved and the set didn't.

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
