# Chapter 3.5 — Deep Learning II: Build a Tech Support Chatbot

**IK Section III, Module 5.** Reading time: 25 minutes.

> The chatbot interview question is where NLP, retrieval, and production engineering converge. The modern answer is RAG over a knowledge base with an LLM, and the senior bar is naming the failure modes — hallucination, prompt injection, stale KB, cold start — and the mitigations.

## The prompt

> "Design a Discord-style chatbot for technical support. It answers customer questions, escalates when it can't, and learns from agent corrections."

You'll get this prompt in roughly that form at Meta, Anthropic, AWS, and any company building B2B AI products. The 2020-2022 version of the answer was a fine-tuned BERT classifier. The 2024+ version is RAG with an LLM. The 2026 version layers in evals, observability, and continuous learning.

## Functional and non-functional requirements

Always start here.

```
Functional:
  - User asks a question; bot answers.
  - Bot escalates to a human if it can't answer.
  - Agent answers feed back into the knowledge base.
  - Bot improves over time.
  - Languages, channels, multi-turn conversation.

Non-functional:
  - Latency:    < 3 seconds for first token (streaming).
                < 10 seconds for full response.
  - Throughput: depends on scale. 100-10k concurrent conversations.
  - Quality:    > 80% resolution rate without escalation
                (for in-scope questions).
  - Safety:     no harmful content, no PII leakage, no
                hallucinated facts about products.
```

The scale, latency, and quality requirements drive every architectural decision.

## The architecture

```
User message
  │
  ▼
┌──────────────────────────────────┐
│ Intent classification            │
│  - Detect: question, command,    │
│    or out-of-scope               │
│  - Heuristic + LLM fallback      │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ RAG over knowledge base          │
│  - Embed query                   │
│  - Retrieve top-k relevant docs  │
│  - Hybrid (dense + BM25)         │
│  - Rerank                        │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│ LLM response generation          │
│  - System prompt with persona    │
│  - Retrieved docs as context     │
│  - Conversation history          │
│  - Constrained to cite KB        │
└──────────────┬───────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼ confident     ▼ uncertain
   Respond         ┌──────────────────┐
                   │ Escalate to      │
                   │ human agent      │
                   └──────┬───────────┘
                          │
                          ▼
                  Agent answers, the
                  answer is logged
                  and fed back to
                  improve KB
```

This is the load-bearing diagram. Every component has a job; every component has a failure mode.

## Knowledge base creation

The knowledge base is the substrate. Without it, the LLM is hallucinating.

```
Sources of KB content:
  - Product documentation
  - FAQs
  - Past resolved tickets (the gold mine — pre-labeled
    by humans solving real problems)
  - Internal runbooks
  - Community forum answers

Per source:
  - Chunk: split by section, paragraph, or sliding window
  - Embed: produce vector representations
  - Index: store in vector DB (pgvector, sqlite-vec, Pinecone)
  - Metadata: source URL, last-updated date, category

Cold-start handling:
  - Start with whatever docs exist; KB grows as agents resolve tickets.
  - For new product lines, surface uncertainty aggressively
    rather than guess.
```

## Embedding the KB

Same as Chapter 2.2 (online) and 2.3 (the RAG chapters) — embed each chunk into a fixed-dimensional vector. For chatbots, the embedding model needs to handle technical jargon — domain-specific embedding models (Cohere embed-v3, BGE, or domain fine-tuned sentence-transformers) often outperform the OpenAI defaults.

Key concern: **freshness**. Your product changes. Docs change. The embedded vectors must reflect current text.

```
Freshness pattern:
  - Track last-modified timestamp per chunk.
  - On doc edit, mark chunk as stale.
  - Background job re-embeds stale chunks.
  - SLA: < 24 hours from doc change to KB reflection.
```

## Sharding and caching

```
Sharding the KB:
  By category (billing, technical, account) — natural partitioning.
  Or by hash of chunk ID for even distribution.

Caching:
  - Embedding model output: cached per query (TTL 5 minutes).
  - Retrieved chunks per query: cached when query is exact-match
    or near-match.
  - LLM responses: semantic cache for common questions
    (with care about staleness).
```

For high-traffic chatbots, the LLM is the cost bottleneck. Aggressive caching (especially semantic cache for repeated questions) can cut costs 50-80%.

## KB expansion — `[the continuous learning loop]`

This is the IK module's specific topic and the senior interview signal.

```
The expansion loop:

  1. Bot receives a question.
  2. Retrieves KB chunks; generates an answer.
  3. If the bot is uncertain (confidence below threshold, OR
     retrieved chunks have low relevance score), escalate.
  4. Human agent reads the conversation, answers the user.
  5. Agent's answer is logged with the question.
  6. Periodically, the logged Q&A pairs are reviewed:
     - Is the agent's answer a general-applicable answer?
     - If yes, add it to the KB.
     - If no (one-off, account-specific), label as such.
  7. The KB grows. The bot gets smarter.
```

The senior insight: **the bot's escalation queue is the highest-value data source for improving the bot**. Every uncertain interaction is labeled by an expert. That's a labeled dataset growing organically.

## Cold-start problem

```
New product launch:
  No tickets yet. No KB content.

Approaches:
  - Seed KB from initial docs.
  - Bot answers conservatively, escalates more aggressively.
  - Agents' first answers form the KB.
  - Within 1-2 weeks, escalation rate drops as KB matures.

New customer with unique product:
  Bot has general docs but nothing specific to this customer.
  Allow agent to inject customer-specific KB entries.

New language:
  Translate KB. Test retrieval quality in target language.
  Use multilingual embedding model.
```

## Answer generation for unasked questions

The IK module mentions this — handling questions the bot has never seen before.

```
Patterns:

  Refuse and escalate.
    If no retrieved chunk is above relevance threshold,
    say "I don't have an answer for that — let me get a human
    to help" and escalate.
    Safer than hallucinating.

  Generative fallback with caveats.
    LLM generates from general knowledge, but explicitly states:
    "Based on general best practices (not your product docs),
    here's what I'd suggest..."
    Useful for low-stakes questions; dangerous for product-specific.

  Active learning.
    Surface the question to a human. Wait for an answer.
    Add the new Q&A to the KB for future occurrences.
```

The choice depends on the use case. For Stripe support, refuse-and-escalate is the right pattern — wrong financial advice is expensive. For a developer tools chatbot, generative fallback with caveats might be acceptable.

## Word embedding methods

The IK module asks about these as a fundamental topic. Quick coverage of the canonical methods:

```
Word2Vec (2013):
  Skip-gram: predict context words given a target word.
  CBOW: predict the target word given context words.
  Output: dense vector per word.

GloVe (2014):
  Factorize the word co-occurrence matrix.
  Captures global statistics; Word2Vec is local.

FastText (2016):
  Word2Vec + subword embeddings.
  Handles out-of-vocab and morphologically rich languages.

Modern (post-BERT):
  Contextual embeddings: same word, different vector
  depending on sentence context.
  "Bank" in "river bank" vs "Bank" in "Bank of America."
  Comes from transformer encoders.
```

For modern systems, you skip directly to sentence/document embeddings (sentence-BERT, OpenAI's text-embedding-3, Cohere embed-v3). Word embeddings are interview material and a historical foundation.

## Exploding gradients in RNNs

The IK module flags this. RNNs have a specific gradient pathology.

```
RNN: at each time step, compute hidden state h_t from h_{t-1} and input x_t.
     During training, gradients flow back through time.

Problem: same weight matrix multiplied at every time step.
         If its eigenvalues > 1, gradients explode.
         If its eigenvalues < 1, gradients vanish.

Mitigations:
  - Gradient clipping (cap norm at threshold).
  - LSTM / GRU: gated architectures that learn what to remember.
    Skip connections through time.
  - Layer normalization.
  - Transformers (no recurrence — attention instead).

In 2026:
  RNNs are largely replaced by transformers for most NLP.
  But the gradient pathology is a classic interview question;
  it shows the candidate understands deep learning fundamentals.
```

## Bi-directional LSTM applications

```
Bi-LSTM: two LSTMs, one processing left-to-right, one right-to-left.
         Hidden states are concatenated.

  Forward:   sees past context.
  Backward:  sees future context.
  Combined:  sees both.

Use for:
  - Sequence labeling (NER, POS tagging).
  - Pre-transformer sentence encoding for classification.

Not great for:
  - Generation (you can't generate the future).
  - Real-time / streaming (you need the full sequence).

In 2026:
  Largely replaced by transformer encoders (BERT, RoBERTa).
  Bi-LSTM is interview material more than production tool.
```

## Continuous learning

How does the bot improve over time without rebuilding?

```
Three feedback loops:

  Loop 1 — KB expansion:
    Agent answers feed back into KB content.
    Slow, manual, high-quality.

  Loop 2 — Retrieval quality:
    Track which retrieved chunks led to good answers.
    Boost their relevance score for similar future queries.
    Or: train a learned reranker on this signal.

  Loop 3 — Prompt versioning:
    A/B test prompt variations.
    Track resolution rate per version.
    Roll out winners; deprecate losers.
```

The senior move: name all three. Most candidates name only one (usually KB expansion).

## Complexity and scale management

```
Latency components:
  Embedding the query:        ~50ms
  Vector retrieval (HNSW):    ~10ms
  Reranking (cross-encoder):  ~100ms (optional)
  LLM generation:             ~1-3 seconds (streaming for UX)
  Total:                       ~3-5 seconds first-token.

Throughput:
  Embedding cache hit rate:   reduces ~50ms to <1ms.
  Connection pooling to LLM:  reuse keep-alive.
  Pre-warming:                keep N model instances warm.
  Batch the embedding queue:  if traffic is bursty.

Cost:
  Cheap embedding model + expensive generation model.
  Cache aggressively. Route easy questions to cheaper models
  (Haiku, gpt-4o-mini).
  Reserve expensive models (Sonnet, gpt-4) for hard escalation-worthy
  questions.
```

## The case study walk

**Functional requirements:**
- Answer customer questions about the product.
- Escalate when uncertain.
- Learn from agent corrections.
- Multi-language support.

**Non-functional requirements:**
- < 3 second first-token latency.
- > 80% in-scope resolution without escalation.
- < 5% hallucination rate (verified against KB).
- Adapts to new product features within 24 hours.

**Architecture:**

```
Real-time path:
  User → intent classifier → RAG retrieval → LLM generation
                                              → response

Async paths:
  - Doc updates → re-embed chunks → KB index update.
  - Agent answers in escalation queue → KB review queue → KB expansion.
  - Logged conversations → eval set → prompt regression tests.

Storage:
  - KB chunks + embeddings in pgvector or Pinecone.
  - Conversation history per session in Redis or DynamoDB.
  - Audit log in S3 + downstream warehouse for analysis.
```

**Data model:**

```
chunks table:
  id, source_url, text, embedding (vector), category,
  last_modified, version

conversations table:
  user_id, session_id, turn_index, role, content,
  retrieved_chunks (array of chunk_ids), confidence,
  escalated (bool), timestamp

agent_answers table:
  conversation_id, answer_text, kb_candidate (bool),
  reviewed_status, kb_chunk_id (foreign key after promotion)
```

**Failure modes and mitigations:**

```
Hallucination:
  Constrain LLM to cite retrieved chunks.
  Relevance threshold gates response.
  Eval set tracks faithfulness.

Prompt injection:
  Sanitize user input.
  Schema-bounded output.
  Output validation layer.

Stale KB:
  Re-embed on doc change.
  Last-modified date displayed.
  Periodic full re-indexing.

Cold start:
  Aggressive escalation initially.
  KB seeded with available docs.
  Active learning from escalations.

Tone drift:
  System prompt defines persona.
  Eval rubric scores tone adherence.
  Quarterly review of generated responses.
```

## How interviewers probe chatbot design

Three layers:

1. **Surface:** "How would you build a customer support chatbot?" Tests whether you reach for RAG + LLM.
2. **Standard:** "How do you prevent hallucination?" Tests whether you can name the relevance threshold, schema constraint, eval mechanism.
3. **Twist:** "Your bot answered questions correctly for 6 months. This week, accuracy dropped 20%. What's happening?" Tests drift diagnosis — could be: KB drift (docs not re-embedded), LLM provider model update changed behavior, fraud / abuse changing input distribution, or eval set becoming unrepresentative.

The third layer is the bar for senior at AWS, Anthropic, Stripe — companies where chatbots are real products and engineers debug them at 3 AM.

## The Interview Move

> *"For a tech support chatbot, I'd build RAG over a knowledge base — chunks from docs, FAQs, and past tickets, embedded with a domain-aware model like Cohere embed-v3, stored in pgvector. Retrieval is hybrid (dense + BM25) with optional cross-encoder rerank for hard queries. The LLM generates responses constrained to cite retrieved chunks; relevance threshold gates generation so we escalate rather than hallucinate. The escalation queue is the highest-value training data — agent answers become KB candidates after review. Failure modes I'd watch for: stale KB (mitigated by per-chunk freshness tracking and re-embed on edit), prompt injection (input sanitization + schema-bounded output), tone drift (system prompt with persona + eval rubric on tone), hallucination (faithfulness eval on golden set, deploy gate). The continuous learning loop is what makes this senior: the system gets better from doing its job, not from us shipping new code."*

Last sentence is the kill shot. "Gets better from doing its job, not from shipping new code" — that's the AI engineering thesis distilled to one sentence.

Next chapter: additional topics. The fundamentals interview asks — discriminative vs generative models, modern architectures, RL primer.
