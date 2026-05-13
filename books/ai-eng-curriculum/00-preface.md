# Preface — Why This Book Exists

You spent eight years in a data center. You know what a packet looks like when it's lost; you've watched a TOR switch fail at 3 AM; you've debugged a NIC offload that quietly dropped one frame in ten thousand. On the application side, you've shipped React for a living long enough to have opinions about hooks vs HOCs, about when to colocate state and when to lift it, about why context isn't a state manager.

None of that is the problem.

The problem is that the next five years of senior engineering jobs at the companies you want to work for — Google, Meta, Anthropic, the Series B unicorns that pay like FAANG — will increasingly want one specific skill: **engineering AI systems**. Not "I used ChatGPT for a side project." Not "I added a chatbot to a marketing site." The actual thing: building, evaluating, deploying, and hardening a system that takes a non-deterministic function and turns it into a reliable product.

Most candidates fail this interview the same way. They've consumed pre-trained models — slapped GPT-4o behind a fetch call, wired up a vector store, declared themselves an AI engineer. They can't tell you why their RAG recall is 0.4 instead of 0.8. They've never trained a model. They've never measured anything. They've never debugged a hallucination.

You will not be that candidate.

---

## The three-track story

Most pivoters into AI have one shape of AI experience. You'll have three, deliberately separated. This is the senior-plus answer to the inevitable interview opener, *"tell me about your AI work":*

> "I've shipped three different shapes of AI work. Classical supervised ML for on-device form classification in contrl-mo. LLM application engineering with five disciplined chains in loopd. Retrieval-augmented systems in two scales — personal corpus in loopd, project context in aipe. I can tell you why each pattern fit its problem and what I'd change at scale."

That sentence is not a brag. It's a contract. It tells the interviewer: *I've actually built each of these, I know where each one breaks, and I'm not going to give you a Wikipedia answer when you start probing.*

Everything in this book is built backwards from that sentence.

```
┌─ Three codebases, three shapes ───────────────────────────────────┐
│                                                                   │
│  loopd       ──►  LLM application engineering                     │
│  (Android journal,   5 single-purpose chains, RAG over journal,   │
│   5 AI chains)       LLM evals, prompt versioning                 │
│                                                                   │
│  aipe        ──►  Prompt engineering as a discipline              │
│  (this repo,         + meta-tooling — markdown specs as the API   │
│   spec workflow)     between intent and code                      │
│                                                                   │
│  contrl-mo   ──►  Classical supervised ML + on-device inference   │
│  (bodyweight         + recommender systems                        │
│   coach app)         (the rarest shape on most resumes)           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

Each project is a real codebase you're actively building. The curriculum's phase plan and this book are the same plan, written two different ways: the curriculum tracks concepts and exercises with IDs; this book explains what each one means and how a staff engineer would talk about it on a whiteboard.

---

## Why the data-center background actually helps

A surprising number of AI engineering concepts have direct analogs in infra work you've already done.

**Connection pooling for LLM providers** is connection pooling for databases. You don't open a new HTTPS connection per call to Anthropic; you keep a warm pool with HTTP keep-alive. Same pattern. Different layer.

**Token budgeting** is bandwidth budgeting. Tokens are the unit of cost and context. You sized switches in terms of pps; you'll size chains in terms of tokens per call × calls per day × dollars per million tokens.

**Caching layers** in a typical web stack (CDN → edge cache → app-level cache → DB query cache) map cleanly onto LLM caching (prompt cache at provider → semantic cache at app → exact-match cache → KV cache in the model itself). Each layer has its own invalidation rules. You know how to think about invalidation.

**Failure isolation** in a rack — you don't put both PSUs on the same circuit — maps to provider abstraction in an LLM stack. If Anthropic's API has an outage, your chains shouldn't go dark.

**Observability** in a data center — netflow, sFlow, structured syslog — maps onto LLM observability — traces, spans, prompt logs. Same problem (distributed system, partial visibility); different signals.

This is the bridge. Throughout the book, every backend / AI / infra concept will be anchored to something you already know from frontend work or from running infrastructure. If a chapter ever fails to bridge, the chapter is broken. Tell me and I'll fix it.

---

## Why the frontend background also helps

You think in components. You know that a `<Button>` is a thing with props, state, and a render function. That instinct — separating *what something is* from *what it does* — is exactly the instinct you need for typed contracts at the LLM boundary.

Most LLM call sites in production code look like this:

```typescript
const res = await openai.chat.completions.create({...});
const result = JSON.parse(res.choices[0].message.content);
// ... pray ...
```

That's not engineering. That's hoping. The frontend version of this would be a component that ships with no prop types and no error boundaries; you wouldn't accept it on review.

The right version puts a Zod schema between the model and the rest of your code:

```typescript
const ResultSchema = z.object({
  intent: z.enum(["todo", "question", "vent"]),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string()),
});

const result = ResultSchema.parse(JSON.parse(res.choices[0].message.content));
// result is typed. If the model returns garbage, this throws here, not later.
```

This is one of the load-bearing patterns in Phase 1. Your frontend instinct ("types or it didn't happen") generalizes directly.

---

## How to use this book

- **Read each chapter once for understanding.** No notes, no implementing. Just read.
- **Then read it again with the curriculum file open.** Check off the `[Cx.y]` concepts you can now explain out loud in 90 seconds. The ones you can't, re-read those sections.
- **Pick one `[Bx.y]` build item per week.** Use `/aipe:feature` to spec it. Implement it. Commit the spec.
- **At the end of each phase, re-read the chapter.** What did you find that the chapter missed? Add a note.

The exercises in the curriculum are the real proof. This book is the explanation. The explanation without the exercises is content; the exercises without the explanation are flailing. You need both.

---

## What this book is not

- **Not a math textbook.** I'll name the math (cosine similarity, cross-entropy, BPE), explain what it does and what to use it for, and link to one place to read more. The math is fine but it isn't what gets you the job; the *systems thinking* around the math is.
- **Not vendor-specific.** Where I name a tool, the underlying concept is the load-bearing thing. Anthropic vs OpenAI matters less than the chain shape; pgvector vs Pinecone matters less than the retrieval pattern.
- **Not optimistic about generic prep.** Grinding LeetCode and watching ML Coursera videos won't get you to the bar at Google or Meta for these roles. Building the three projects in this curriculum will.
- **Not a substitute for IK's Machine Learning Interview Masterclass.** IK's curriculum is the source of the system-design templates referenced throughout (search ranking, recommender, anomaly detection, object detection / CV, support chatbot). This book teaches the engineering; IK teaches the interview shape. Both are valuable.

---

## The bar

The companies you're targeting have a specific bar for AI engineering. It's not "can you ship something with an LLM call in it." It's:

- Can you explain, on a whiteboard, the full data flow of a retrieval-augmented system you've built?
- Can you name the failure modes and the mitigations *for each*?
- Can you tell me, without looking, why you chose your embedding model and what would change at 10× scale?
- Can you walk me through a confusion matrix and tell me what to do about a 0.42 F1 score on the minority class?
- Have you ever shipped a model to production and watched it drift?

By the time you finish this book and the underlying curriculum, every one of those answers will be a specific story about something you actually built. That's the bar. That's also the bar the FAANGs hire against. They're the same bar.

Let's start.
