# Chapter 4 — Career Coaching: Strategy, Behavioral, Negotiation

**IK Section IV.** Reading time: 20 minutes.

> Passing the technical loops is necessary. Converting a passing loop into the offer you actually want is the other half — interview strategy, behavioral signal, and negotiation. Most engineers neglect this half and get paid 20-30% less than they should.

## The shape of an FAANG ML interview loop

You've prepped for the technical content. Here's what the loop actually looks like.

```
Phone screen (1):
  - 45 minutes.
  - One DSA problem, sometimes ML basics.
  - This is the screen-out. ~50% pass.

Phone screen (2) — sometimes:
  - 45 minutes.
  - One ML system design or applied ML.

Onsite / virtual onsite (Day 1):
  - Slot 1: DSA coding (45 min)
  - Slot 2: DSA coding (45 min)
  - Slot 3: System design (45 min)
  - Slot 4: ML system design (45 min)
  - Slot 5: Behavioral / culture (45 min)
  - Slot 6: Senior bar-raiser or hiring manager (45 min)

Day 2 — sometimes:
  - Slot 7: ML fundamentals (45 min)
  - Slot 8: Deep technical with the team's lead (45 min)
```

Each slot is graded independently. You need to pass every one. One "no hire" can sink the loop even if the others are "strong hire."

## Interview strategy

### Before the loop

**Research the company and the team.** Know what they ship, what their AI work looks like publicly (engineering blog posts, papers, conference talks), what the role does specifically. The behavioral interviewer will ask "why us." If your answer is generic, that's a soft signal that you didn't do the work.

**Understand the leveling.** L4 vs L5 vs L6 at Google. E4 vs E5 vs E6 at Meta. Each level has different expectations. L5 (senior) is the typical destination for someone with your experience. Know what L5 means at your target company:
- L5 at Google: "owns complex projects, mentors others, drives technical decisions."
- E5 at Meta: similar.
- Compensation: $300k–500k+ TC depending on location and stock comp.

**Practice with mocks.** This is what IK exists to do — schedule real mock interviews with actual FAANG engineers giving real feedback. Take all 15 if you can. Mocks reveal the gap between "I know this" and "I can perform this under interview pressure."

### During the loop

**Listen for the clarifying questions the interviewer wants.** They've calibrated the question. They want specific clarifications — usually about scale, latency, scope. Ask 3-5 clarifying questions before diving in. Demonstrate that you don't just rush to code.

**Think out loud.** The interviewer is grading your *process*, not your final answer. If you stare at the wall in silence for 5 minutes, you fail even if you find the right answer. Talk through your reasoning. "I'm thinking about a hash map here because lookups need to be O(1) — but I'm not sure if order matters. Let me think..."

**Manage time.** A 45-minute slot has a rhythm. Spend 5 minutes clarifying, 15 minutes designing/coding, 15 minutes optimizing/refining, 10 minutes on follow-up questions. If you're 25 minutes in and still discussing the high level, that's a red flag.

**Don't argue with the interviewer.** If they push back on your design, engage with their concern. Don't double down on your first idea. Saying "that's a fair point — let me think about it" is strength, not weakness.

**Handle "I don't know" gracefully.** It's better to say "I don't know that specific detail; here's how I'd think about it" than to bullshit. Senior engineers get respect for owning the edge of their knowledge. Bullshitters get fired in onboarding.

### After each slot

Pause for 2-3 minutes between interviews. Decompress. Don't dwell on the previous slot. Each slot is independent.

## The DSA loops

You did the prep in Chapters 1.1–1.5. The performance instructions:

**Do not start coding immediately.** Walk through:
1. Restate the problem in your own words. (Verifies you understood it.)
2. Walk through an example. (Surfaces edge cases.)
3. State your approach in plain English before any code.
4. Discuss complexity (time + space) of your proposed approach.
5. *Then* write code.

**Edge cases.** Empty input, single element, all-same elements, negative numbers, integer overflow, very large input. Always check.

**Test your code by hand.** Walk through it with the example you stated earlier. If you find a bug, fix it. If you don't, the interviewer might point one out — handle that gracefully.

## The system design loop

You did the prep in Chapters 2.1–2.3 and 3.1–3.5. The performance instructions:

**Drive the conversation.** The interviewer asks "design Twitter." That's a prompt. They expect *you* to ask the next 5 questions (scale, features, latency). If you wait for them to feed you direction, you signal junior.

**The minute-by-minute structure** (from Chapter 2.1):
- 0-5: Clarify.
- 5-10: High-level architecture.
- 10-25: Deep dive on 1-2 components.
- 25-35: Scale concerns.
- 35-45: Tradeoffs and alternatives.

**Pick your deep dive deliberately.** The interviewer often gives you the choice ("which component should we discuss in detail?"). Pick the one you're strongest on, not the one that sounds most impressive. A solid deep dive on the database tier beats a hand-wavy deep dive on the recommendation algorithm.

## The ML system design loop

The hardest slot in the loop. You did the prep in Chapter 3.6's template. The instructions:

**Reach the model section quickly.** Junior candidates spend 30 minutes on the data pipeline and never get to the model. Senior candidates spend 10 minutes on the data pipeline and 20 on the model + evaluation. Allocate time.

**Have an opinion on every choice.** "I'd use LightGBM here because the features are tabular, the data volume is in the millions not billions, and I want interpretability for the failure-mode analysis." Not "I'd use a neural network because they're powerful." The first sentence shows engineering judgment; the second shows brand awareness.

**Always discuss eval.** What metric? Online or offline? How do you know when the new model is better than the old? This is one of the highest-leverage signals — most candidates skip evaluation, and addressing it deliberately differentiates you.

**Always discuss failure modes.** Cold start, distribution shift, bias, adversarial inputs. Name them. Name the mitigation. Even if you don't go deep on each, naming them shows you've operated systems in production.

## The behavioral / culture interview

The slot most engineers underprepare. The slot most candidates lose offers in.

### The format

```
The interviewer asks a question like:
  "Tell me about a time you had a conflict with a coworker."
  "Tell me about a project you're particularly proud of."
  "Tell me about a time you failed."
  "How do you handle disagreement with leadership?"

You answer with a story.
The interviewer probes the story.
You answer the probes.
```

### The STAR framework

Every story you tell follows this structure:

```
S — Situation. Set the scene. 30 seconds.
T — Task. What was your responsibility? 15 seconds.
A — Action. What did you specifically do? 1-2 minutes.
R — Result. What happened? Was it good? What did you learn?
    30 seconds.
```

The most common failure: candidates skip the **Action** and jump to the result, or skip the result and just describe the situation. Both feel hollow.

### The stories you need ready

Prepare 6-8 stories before the loop. Each story should be 2-3 minutes long. They should be:

```
A) "Tell me about a major technical achievement."
   Pick something with a concrete number. "I rebuilt the
   monitoring pipeline; p99 latency dropped 60%; we caught
   3 outages early in the next quarter that would otherwise
   have been customer-impacting."

B) "Tell me about a time you failed."
   Real failure. The candidate who says "I worked too hard"
   is screened out. Pick a real failure where you took
   accountability and learned. The lesson is the point.

C) "Tell me about a time you disagreed with someone."
   Show that you can hold a position respectfully, gather
   evidence, and either persuade or change your mind based
   on new information.

D) "Tell me about a time you mentored someone."
   Senior signal. You're not just a senior IC; you make
   others better. Concrete example: "I onboarded a junior
   engineer; in 6 months they were leading their own project."

E) "Tell me about working under pressure."
   On-call story. Outage story. Tight deadline story.
   Show that you keep composure and make good decisions
   in chaos.

F) "Why are you leaving your current role?"
   Don't badmouth your current employer. Frame as growth:
   "I want to work on AI engineering at production scale,
   and the opportunities in my current role are bounded."

G) "Where do you see yourself in 5 years?"
   Aligned with the role you're interviewing for. Not "I'll
   start my own company in 6 months."

H) "Why this company?"
   Specific. Their work, their team, their mission.
   Not "great culture and good comp."
```

### Telling the stories

**Be specific.** "I shipped a thing" is bad. "I shipped feature X that affected Y users; here's the specific challenge I navigated" is good. Specifics signal real experience.

**Own the decisions you made.** "We decided to" is bad. "I decided to, and here's why" is good. They want to know what *you* did.

**Mention measurable outcomes.** Latency dropped 30%. Cost reduced 50%. User retention improved 5%. Numbers anchor the story.

**Acknowledge constraints.** "We had three weeks and two engineers; I optimized for time-to-ship over architectural purity." Shows trade-off awareness.

**Stay within the lane of behavioral, not technical.** They're testing your judgment, not your technical depth. Don't go deep on the technical implementation; go deep on the decisions.

## The bar-raiser / hiring manager interview

Senior IC interviewer or the team's hiring manager. They're calibrating *level*. Are you L4 or L5? Are you L5 or L6?

The signals they evaluate:

```
Scope of impact:
  Did you affect a project, a team, an org, a company?
  Senior candidates affect teams and orgs.

Technical judgment:
  Can you explain *why* a decision was right, not just what was done?
  Senior candidates have opinions backed by experience.

Mentorship:
  Have you made others better?
  Senior candidates do.

Ambiguity tolerance:
  Can you work in unclear situations and produce a plan?
  Senior candidates can.

Communication:
  Can you adapt your explanation to the audience?
  Senior candidates can talk to execs, engineers, and PMs.
```

The questions are open-ended. "Walk me through a system you've built." "Tell me about a time you had to convince a skeptical stakeholder." The bar is whether you sound like a senior engineer at that company. The IK mocks help you calibrate.

## Negotiation

You got the offer. Now do not accept the first number.

### The principle

Tech companies expect negotiation. The first offer is typically 10-20% below what they're willing to pay. Walking away with the first offer is leaving money on the table — meaningful money, like a year's mortgage or two years of college tuition over the course of the role.

### The leverage

You have leverage if:

- You have **competing offers** (the single most powerful lever).
- You have **a current job** you can stay in.
- You have **specific skills the team needs** (rare for the role).
- You have **deep domain experience** they can't easily find.

Most candidates have 1-2 of these. That's enough.

### The mechanics

```
Step 1 — Don't take the first offer.
  Recruiter calls with the offer. You say:
  "Thank you so much. This is exciting. Can I have a few days
   to think it over and review the details?"
  Don't accept. Don't reject. Just buy time.

Step 2 — Get competing offers.
  If you're not already in other loops, accelerate them.
  Recruiters at other companies will fast-track when you mention
  a competing offer in hand.

Step 3 — Counter.
  Once you have a competing offer (real or expected), counter the
  first offer. Specifically:
  
  "I'm really excited about this role. I also have a competing
   offer at [Company X] for [TC amount]. Is there anything you can
   do on the base/equity/sign-on to bring the offers closer?"

  Be specific about what you want. "Bump the base by $20k" or
  "Add $200k to the equity grant" or "Increase the sign-on to $80k."

Step 4 — Negotiate the negotiation.
  The recruiter will go back to leveling committee or hiring manager.
  They'll come back with a revised offer.
  Compare to your competing offer. If still short, push once more.
  Two rounds of counter is typical.

Step 5 — Accept the offer you want.
  Don't drag the negotiation past two counters. Recruiters lose
  patience. Pick the offer (or stay at current role) and commit.
```

### What to negotiate

```
Base salary:
  Hardest to move (limited by leveling). 5-15% movement typical.

Equity:
  More flexible. 20-50% movement possible if they want you.

Sign-on bonus:
  The most flexible. 100-300% movement common.
  Can be paid in chunks (one at signing, one at 1 year).

Annual bonus target:
  Set by company policy. Hard to move.

Relocation:
  Standard package; small room for negotiation.

Start date:
  Negotiable. Take 2-4 weeks between jobs if you can.

PTO / WFH / role scope:
  Negotiable. Get in writing.
```

### Common negotiation mistakes

**"How much did your current salary pay?"** Don't answer. It's illegal to ask in some states. In any case, you set your worth by the market, not by your previous employer.

**"What's your number?"** Don't anchor low. Say "I'm looking at offers in the [reasonable range based on level] TC range and would love to understand what your strongest offer is for this level."

**Accepting verbally before getting it in writing.** Wait for the written offer. The recruiter is your ally; they want you to sign. They want to give you a strong offer.

**Negotiating after you've signed.** Once signed, you're locked. Stretch every dollar before signing.

## What the IK Section IV teaches

The IK career coaching section walks through these in live classes with real recruiters and senior engineers from FAANG. The book version is shorter because the IK live sessions can role-play behavioral scenarios with you, which is the practice you need. The book primes you with the framework; the practice is in IK's mocks and coaching sessions.

## How interviewers probe the soft slots

Three signals they're looking for:

1. **Self-awareness.** Do you know your weaknesses? Can you talk about them honestly?
2. **Growth mindset.** Have you learned and changed? Or do you tell the same story about your achievements from 8 years ago?
3. **Cultural fit.** Do you work the way this company works? Are you collaborative? Do you care about the mission?

Don't fake any of these. Faked self-awareness is more obvious than no self-awareness.

## The Interview Move

> *"In the behavioral slot, every story I tell has a specific outcome with measurable impact. I take ownership for decisions and acknowledge what I'd do differently in retrospect. In the bar-raiser slot, I show scope of impact and technical judgment by walking through one project at depth, naming the constraints, the alternatives I considered, and why I picked what I picked. In negotiation, I don't take the first offer — I wait for a competing offer, I counter once or twice, I get everything in writing. The technical work that got me to the offer is necessary but not sufficient; the soft slots and the negotiation determine whether the offer is the one I take."*

That's the senior approach to the whole loop, not just the technical parts.

---

## Closing

You've covered the full IK Machine Learning Interview Masterclass curriculum: five sections, fifteen chapters, ~50 hours of reading.

The order to use the book:

1. Read the chapter for the topic of your next IK live class.
2. Attend the live class.
3. Practice the assigned problems.
4. Take the IK mock interviews — all of them.
5. Loop until you can answer every category fluently.

The technical part is grinding through the practice. The behavioral and negotiation part is preparing the stories and the framework. The combination of all of it, over the 16 weeks of the IK course, is what gets you from "I know AI stuff" to "I have offers from Google, Meta, and Anthropic."

Good luck. Go take the mocks.
