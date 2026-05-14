# 01 — What prompt engineering actually is

## The 80 / 20 rule

Most people treat prompt engineering as a wording problem — how do I phrase this so the AI does what I want? **That's the last 20%.** The first 80% is structural: what information, constraints, and context are you giving the model to reason against? A well-structured brief produces correct output even with casual wording. A vague brief produces wrong output no matter how carefully you phrase it.

> **Why it matters**
>
> AI is a contractor. A contractor with a vague brief builds the wrong thing politely. Give them a tight brief — data model, behaviour, edge cases, constraints — and they'll build the right thing even if you spoke to them casually.

## What contributes to correctness vs readability

```
Layer                    Contribution    Determines
──────────────────────   ─────────────   ──────────────
Context setting          ████████████    correctness
  data model, system
  design, codebase info

Task framing             ████████        correctness
  intent + constraints
  (two-layer structure)

Behaviour specification  █████           correctness
  interaction flow,
  three paths, edge cases

Output shaping           ███             readability
  format, length, tone,
  code style

Wording / phrasing       █               readability
  what most people think
  prompt engineering is
```

The top three layers — context, framing, behaviour — are where correctness lives. The bottom two are polish.

> ℹ For multi-session work, prompt engineering is really **spec writing**. Better spec = fewer bugs, less context re-established each session. This is what a persistent `.dev/` or `.aipe/` folder is for — context that travels between Claude.ai and Claude Code sessions.

## The take-away

If you're spending time word-smithing your prompt and not getting better output, you're tuning the wrong dial. Step back and look at what's missing in the layers above wording: what does the AI not know about your data model, your file structure, your constraints? Fill that in. The phrasing will become irrelevant.
