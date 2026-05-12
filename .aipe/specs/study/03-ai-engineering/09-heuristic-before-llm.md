# Heuristic-before-LLM

**Industry name(s):** Pre-classification, cheap-filter-before-expensive-call, rules-first routing
**Type:** Industry standard

> Run a cheap deterministic check first; call the LLM only for cases the heuristic can't decide. Saves cost, latency, and adds determinism for the easy cases.

**See also:** → [10-single-purpose-chains](10-single-purpose-chains.md) · → [22-tool-routing](22-tool-routing.md)

---

## Why care

You've called an LLM to detect whether a string is an email address and paid 200 tokens to learn what a regex would tell you in microseconds. The everyday failure is using a heavyweight tool when a lightweight one suffices.

The pattern is *cascading classifiers* — start cheap and specific; escalate to expensive and general only when the cheap layer can't decide. Same shape as L1 / L2 / L3 cache hierarchies, as triage in emergency rooms, as form validation that runs client-side regex before submitting.

---

## How it works

A bouncer with a clipboard who hands the hard cases to the manager.

### The shape

```
input → cheap heuristic → can decide?
                            │
                            ├── yes → return heuristic result (cheap, deterministic)
                            │
                            └── no  → call LLM → return LLM result (expensive, flexible)
```

### When it works

- The heuristic correctly handles the common case (80%+ of inputs).
- The cost difference between heuristic and LLM is significant (10×+).
- The LLM provides better quality for the hard cases (the residual 20%).

### What aipe doesn't do directly

aipe's slash commands don't use heuristic-before-LLM internally — each `/aipe:<type>` call goes straight to the host agent, which is the LLM tier. There's no pre-classifier deciding whether a `/aipe:feature` invocation needs the LLM or can be served by templates alone.

But the pattern shows up structurally elsewhere: Step 4's CREATE-vs-UPDATE detection is a heuristic (file-existence check) that branches the flow before the agent does work. If `.aipe/project/context.md` is missing, Step 1's scaffold is a heuristic decision that short-circuits the entire command — no LLM call at all for that case.

Curriculum tags C1.9 to loopd (B1.5: "Document heuristic regex coverage in `heuristicClassify.ts`"). For aipe, the analogous case is "structural checks short-circuit the LLM path."

The full picture is below.

---

## Heuristic-before-LLM — diagram

```
Cascading classification

         input
           │
           ▼
   ┌────────────────┐
   │ Heuristic      │  regex / lookup / structural check
   │ (cheap, fast)  │  ~μs, $0
   └───────┬────────┘
           │
           ▼
      can decide?
           │
     ┌─────┴─────┐
     │ yes       │ no
     ▼           ▼
   return     ┌────────────────┐
   heuristic  │ LLM            │  call API
              │ (expensive)    │  ~s, $0.001+
              └───────┬────────┘
                      │
                      ▼
                  return LLM
                  result
```

---

## In this codebase

**Not directly used.** No aipe wrapper has an internal heuristic-then-LLM cascade. The closest analogue is the early-exit gates in the per-spec-type contract:

- **Step 1 scaffold check** — `[ -e .aipe/project/context.md ]` is a heuristic. If false, write placeholder + STOP (no LLM call).
- **Step 4 CREATE-vs-UPDATE** — file-existence check is a heuristic that picks the flow.

Both are heuristic-before-LLM in spirit (cheap structural check → branch before doing expensive work), even though "expensive work" here is "LLM-driven spec generation" rather than "another LLM call."

Curriculum anchors C1.9 to loopd (B1.5 "Document heuristic regex coverage in `heuristicClassify.ts`"). aipe's role is the structural analogue.

---

## Elaborate

### Where this pattern comes from

Cascading classifiers predate ML — production systems have used "cheap filter first" since computer vision in the 1990s (Haar cascades for face detection). The LLM-era version became common in 2023 as cost concerns made "don't call the API if you don't need to" mandatory.

### The deeper principle

Expensive operations earn their place when cheap operations can't. Default to cheap; escalate when needed.

### Where this breaks down

When the heuristic mis-classifies and routes a hard case to the cheap layer. The cost of a mis-route is a wrong answer that the system doesn't know is wrong. The fix is conservatism — the heuristic should err toward escalation (false negatives over false positives).

### What to explore next

- [22-tool-routing](22-tool-routing.md) → heuristic routing in agent loops
- [10-single-purpose-chains](10-single-purpose-chains.md) → why structured chains avoid LLM-routes
- Haar cascades — the original cascading classifier

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Heuristic-first cascade  │ Always-LLM                  │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Cost / call      │ ~$0 on easy cases        │ $0.001+ on every call       │
│ Latency          │ ~μs on easy cases        │ ~1–3s on every call         │
│ Determinism      │ Easy cases deterministic │ Stochastic on every call    │
│ Implementation   │ Heuristic + LLM + branch │ Just LLM                    │
│ Failure blast    │ Mis-route → silent wrong │ LLM hallucination → wrong   │
│                  │ answer                   │ but flagged                 │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe's commands don't cascade. Every invocation hits the host agent (LLM). For aipe specifically, that's fine because every spec generation genuinely needs the model — no spec is so simple a regex could produce it. The cost of *not* cascading is paid every time but justified because the work is always LLM-shaped.

### Sub-block 2 — what the alternative would have cost

A hypothetical pre-classifier that short-circuited "trivial" specs (say, `/aipe:feature add a single import statement` → templated output without LLM) would save tokens on edge cases — but it'd also complicate every wrapper with a "can we skip the LLM?" branch. For 99% of invocations the LLM is needed; the 1% saving isn't worth the complexity.

### Sub-block 3 — the breakpoint

Fine until a spec type emerges where most invocations are simple enough for templates alone. If `/aipe:rename` (a hypothetical "rename this variable across the codebase") became a common command and most invocations could be done by sed-like rules, then a heuristic-first cascade would earn its place.

---

## Tech reference (industry pairing)

### Heuristic routing libraries

- **Codebase uses:** none — aipe has structural heuristics (file checks) but no LLM-routing heuristic.
- **Leading today:** custom regex + classifier code per use case — `adoption-leading` for production LLM apps, 2026.
- **Runner-up:** Semantic Router (open-source library) — `innovation-leading` for embedding-based routing; fits when "what kind of intent is this?" is itself an LLM-shaped question.

---

## Project exercises

Curriculum anchors B1.5 to loopd ("Document heuristic regex coverage in `heuristicClassify.ts`"). aipe has structural early-exit gates but no documented heuristic-first cascade. No aipe-specific Build item.

---

## Summary

Heuristic-before-LLM runs a cheap deterministic check first, calling the LLM only when the cheap layer can't decide. aipe doesn't do this internally — every spec generation needs the LLM. But the per-spec-type contract has structural early-exit gates (Step 1 scaffold-or-stop, Step 4 CREATE-vs-UPDATE) that are heuristic short-circuits in spirit. The constraint: every aipe invocation is LLM-shaped work; no cheap layer would help. The cost being paid: full LLM cost on every call.

- The pattern is "cheap-filter-before-expensive-call."
- aipe's structural gates (Step 1, Step 4) are heuristic-first short-circuits.
- aipe's spec generation is always LLM-shaped; no internal cascade.
- The breakpoint is a future spec type with mostly-trivial invocations.

---

## Interview defense

### Likely questions

**Q [mid]:** What does heuristic-before-LLM look like?

**A:** A cheap deterministic check first (regex, lookup, simple rule), then the LLM only when the cheap layer can't decide. The pattern reduces cost and latency for the easy cases while keeping LLM flexibility for the hard ones.

**Q [senior]:** Does aipe use heuristic-before-LLM internally?

**A:** Not for the actual spec-generation work — that always needs the LLM. But the per-spec-type contract has structural gates that are heuristic-first short-circuits: Step 1 checks for `.aipe/project/context.md` (heuristic), Step 4 checks for existing spec (heuristic). Both branches the flow before any LLM work. They're not "pre-classify the intent and skip the LLM if simple"; they're "is the workspace ready for LLM work at all?"

**Q [arch]:** When would aipe need internal heuristic-first routing?

**A:** If a future spec type had a large fraction of mechanical invocations that templates could serve directly. A hypothetical `/aipe:rename oldName newName` could probably be done by sed without LLM intervention 80% of the time. At that point, a pre-classifier in the wrapper could short-circuit to a templated output. Today, no such spec type exists.

### The question candidates always dodge

**Q:** Why doesn't aipe just template the common cases?

**A:** Because "common cases" in spec generation are still LLM-shaped. A user typing `/aipe:feature add dark mode toggle` expects the spec to name their *actual files*, their *actual stack*, their *actual constraints* — all of which require reading `.aipe/project/context.md` and synthesising. No template alone can do that; the LLM is what makes the output project-specific. Templating the common cases would produce generic specs that miss the point.

### One-line anchors

- Cheap filter before expensive call.
- aipe has structural gates (Step 1, Step 4) but no internal cascade.
- Every spec generation is LLM-shaped; no candidate for caching/templating.
- Breakpoint: a future spec type with mostly-mechanical invocations.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the cascading classifier flow.

### Level 2 — Explain it out loud
Explain why aipe doesn't short-circuit `/aipe:feature` for "easy" intents. Under 60 seconds.

### Level 3 — Apply it to a new scenario

A hypothetical `/aipe:rename oldName newName` is being designed. Would you add a heuristic-first cascade? Why or why not?

### Level 4 — Defend the decision you'd change

"If 30% of `/aipe:feature` invocations were trivial (one-line specs), would you add a pre-classifier?"

### Quick check — code reference test
Without opening files:
- What's the cost saving angle? → ~$0 on easy cases vs $0.001+ per LLM call
- What's the determinism angle? → easy cases deterministic, hard cases stochastic
- Does aipe cascade internally? → No, but has structural gates
