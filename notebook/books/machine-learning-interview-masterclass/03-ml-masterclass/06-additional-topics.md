# Chapter 3.6 — Additional Topics

**IK Section III, Module 6.** Reading time: 22 minutes.

> Four topics the IK curriculum groups together: ML system design interview approach, modern ML architectures (variational autoencoders, generative models), discriminative vs generative models, and a reinforcement learning primer. These are the fundamentals questions you face after the system design portion of an ML loop.

## The ML system design interview approach

You've seen five case studies (search ranking, recommender, fraud, object detection, chatbot). The pattern across all five is the same. Internalize it.

```
The universal ML system design template:

  1. Clarify the problem.
     - What's the user-visible task?
     - What's the metric? Online or offline?
     - What's the scale (users, data, QPS)?
     - What's out of scope?

  2. Define functional and non-functional requirements.
     - Functional: what the system does.
     - Non-functional: latency, throughput, availability, cost.

  3. Define the ML problem.
     - Input shape, output shape.
     - Supervised, unsupervised, reinforcement?
     - Classification, regression, ranking, generation?

  4. Data.
     - Sources of training data.
     - Labels — how acquired, how clean.
     - Volume.
     - Data privacy / compliance.

  5. Features.
     - Per-entity features.
     - Cross features.
     - Real-time vs batch.

  6. Model.
     - Start with the simplest reasonable model.
     - Justify any escalation in complexity.
     - Discuss alternatives.

  7. Training pipeline.
     - Train/val/test split discipline.
     - Hyperparameter tuning.
     - Eval metrics.

  8. Serving / deployment.
     - Online vs batch inference.
     - Latency budget.
     - Caching.
     - Sharding.

  9. Monitoring and continuous improvement.
     - What you log.
     - Drift detection.
     - Retraining triggers.
     - A/B testing.

  10. Failure modes.
      - Adversarial inputs.
      - Cold start.
      - Distribution shift.
      - Bias.
```

A 45-minute ML system design interview walks this template. You don't have to hit every box explicitly; the interviewer steers. But you should know that every box exists and be able to walk it on demand.

## Modern ML architectures

The IK module flags variational autoencoders (VAEs) and generative vs deterministic models. Quick coverage of the architecture landscape:

### Autoencoders

```
Encoder:  input → low-dim representation (bottleneck)
Decoder:  bottleneck → reconstruct input

Trained: minimize reconstruction error.

The bottleneck is a learned compression of the input.
Use the encoder for: dimensionality reduction, feature learning,
                    anomaly detection (high reconstruction error
                    = anomaly).
```

### Variational autoencoders (VAE)

```
Same as autoencoder, but the bottleneck is forced to follow a
distribution (typically Gaussian). The encoder outputs (mean, std);
sampling from this distribution gives the bottleneck representation.

Why? VAE can GENERATE new examples — sample from the distribution,
decode. The decoder learns to produce in-distribution outputs.

Use for: generative modeling, sometimes anomaly detection
        (out-of-distribution inputs have unusual encoded distributions).

VAE vs GAN vs Diffusion models:
  - VAE:        encoder + decoder, probabilistic. Smooth latent space.
  - GAN:        generator vs discriminator adversarial training.
               Sharp outputs but training is unstable.
  - Diffusion:  progressively denoise random noise into target.
               State-of-the-art image generation in 2026.

Modern generative AI (Stable Diffusion, DALL-E) is diffusion-based.
VAE is mostly historical now but the encoder-decoder pattern survives.
```

### Transformers

```
The 2017 architecture that ate machine learning.

Components:
  - Self-attention: each token attends to every other token,
    weighted by learned compatibility.
  - Positional encoding: tokens have positions; the model uses them.
  - Feed-forward + layer norm + residual connections at each layer.

Encoder: takes a sequence, outputs contextual representations
         (each token vector is influenced by all other tokens).
         Use for: classification, NER, sentence similarity (BERT).

Decoder: generates a sequence one token at a time, conditioned
         on encoder output and previous tokens.
         Use for: translation, summarization.

Encoder-decoder: both. Use for sequence-to-sequence tasks.

Decoder-only: just the decoder. Used for autoregressive text generation.
              GPT, Llama, Sonnet, Claude — all decoder-only transformers.
```

The transformer is the architecture under every modern LLM, most modern computer vision (Vision Transformers — ViT), and increasingly speech (Whisper).

## Discriminative vs generative models — `[IK Module 6]`

A fundamental distinction. Memorize it.

```
Discriminative models:
  Learn P(Y | X) — given an input, what's the probability of each class?
  
  Examples: logistic regression, SVM, random forest, neural net classifiers.
  Use for: classification, regression, ranking.

  Strengths: directly optimize for the decision task. Often more accurate.
  Limitations: can't generate examples. Don't model the input distribution.

Generative models:
  Learn P(X) or P(X, Y) — the distribution of the data itself.

  Examples: Naive Bayes, VAEs, GANs, diffusion models, autoregressive LLMs.
  Use for: generation, density estimation, anomaly detection,
           classification via P(X|Y) and Bayes.

  Strengths: can generate new examples. Captures input structure.
  Limitations: harder to train. Modeling input distribution is harder
              than modeling the decision boundary.
```

### Why we learn a distribution vs deterministic

Another IK-flagged topic. The framing:

```
Deterministic model: input X → output Y. Same input always gives same Y.
  Example: trained classifier with temperature=0.

Distribution model: input X → distribution over Y.
  Sample from the distribution to get a Y.
  Example: same classifier with softmax outputs interpreted as probabilities.

Why learn a distribution:
  - Uncertainty quantification. "I'm 70% sure it's a cat" is more useful
    than "it's a cat."
  - Generation. You can sample multiple Y values from the distribution.
  - Calibration. Probabilities can be checked against actual frequency.

Why learn deterministic:
  - When you need one answer fast.
  - When the application doesn't use uncertainty information.

In modern ML:
  Most production models output distributions, even if downstream
  systems collapse to argmax.
```

## Reinforcement learning primer

The IK module touches RL as a fundamental topic. Senior interviews at companies doing RL work (DeepMind, Anthropic for RLHF, some recommender teams) ask about it.

### The setup

```
Agent: the model making decisions.
Environment: the world the agent operates in.
State: the current situation (what the agent observes).
Action: what the agent does.
Reward: feedback signal — was this action good?

The loop:
  Agent observes state → picks action → environment transitions →
  agent observes new state + reward → repeat.

Goal: learn a policy that maximizes expected cumulative reward.
```

```
            ┌─ Agent ─┐
            │ Policy  │
            │   π     │
            └────┬────┘
                 │ action a
                 ▼
            ┌─ Environment ─┐
            │  state s'     │
            │  reward r     │
            └─────┬─────────┘
                  │
                  ▼
            new (s', r)
            back to agent
```

### Value iteration vs policy iteration

Two ways to solve a Markov Decision Process (MDP).

```
Value iteration:
  Compute V(s) — the value of being in each state.
  Iterate the Bellman equation until V converges.
  Then derive the policy: pick the action that leads to highest V.

  Pro: simple, robust.
  Con: requires knowing P(s'|s,a) — the transition function.

Policy iteration:
  Start with a random policy.
  Evaluate V(s) under that policy.
  Improve the policy: at each state, switch to the action
    with higher V.
  Iterate until policy stops changing.

  Pro: converges in fewer iterations than value iteration.
  Con: same requirement — knowing the transition function.

For interviews: name both, name the Bellman equation, name when
                each wins (policy iteration usually converges faster).
```

### Model-free RL (Q-learning, policy gradient)

```
Q-learning:
  Learn Q(s, a) — the value of action a in state s.
  Update: Q(s, a) ← Q(s, a) + α * (r + γ * max(Q(s', a')) - Q(s, a))
  Pick actions greedily on Q (with ε-greedy exploration).

  Pro: doesn't need the transition function.
  Con: requires lots of data; doesn't generalize across states naturally.

Deep Q-learning (DQN):
  Q is a neural network. Same update rule.
  Replay buffer: store past transitions; sample randomly to train.

  Pro: works on high-dim states (game pixels, sensor data).
  Con: training is unstable; many tricks needed.

Policy gradient:
  Learn the policy π(a|s) directly.
  Update: increase probability of actions that led to high reward.

  Pro: works for continuous action spaces.
  Con: high variance; converges slowly.

Modern (PPO, A3C):
  Combinations of the above with engineering tricks.
  Used in: AlphaGo, RLHF for LLMs (Anthropic Constitutional AI,
           OpenAI's RLHF for ChatGPT).
```

### Where RL appears in modern AI

```
RLHF (RL from Human Feedback):
  How Claude, GPT-4, and other LLMs are fine-tuned.
  - Pretrain LLM on text.
  - Collect human preferences on pairs of responses.
  - Train a reward model to predict human preferences.
  - Fine-tune the LLM with PPO using the reward model.

This is the biggest practical application of RL today.

Recommendation systems:
  Multi-armed bandits (a simplified RL setup) for exploration vs
  exploitation in ranking decisions.

Game playing:
  AlphaGo, AlphaZero, AlphaStar — historical breakthroughs.
  Modern game AI uses RL for non-player characters and procedural
  difficulty adjustment.

Robotics:
  Continuous control for legged locomotion, manipulation.
  Tesla's FSD uses imitation learning + RL for some sub-tasks.
```

For interviews: know RLHF in detail (the actual practical thing). Know value iteration vs policy iteration as a theoretical baseline. Anything beyond that is bonus.

## Other fundamentals that recur

A grab-bag of concepts that appear across modules but worth surfacing.

### Cross-entropy loss

```
The standard loss for classification.

For binary classification:
  L = -[y * log(p) + (1-y) * log(1-p)]
  where y is the true label (0 or 1), p is the predicted probability.

For multi-class:
  L = -sum over classes c of (y_c * log(p_c))
  where y is one-hot encoded.

Intuition: penalizes confident wrong predictions more than uncertain
           wrong predictions. The model is incentivized to be calibrated.

Almost every classifier in 2026 is trained with cross-entropy loss.
```

### MSE vs MAE

```
MSE (Mean Squared Error):
  Loss = (1/n) * sum((y - y_pred)^2)
  Penalizes large errors more (squaring).
  Default for regression.

MAE (Mean Absolute Error):
  Loss = (1/n) * sum(|y - y_pred|)
  Penalizes errors linearly.
  More robust to outliers than MSE.

Huber loss:
  Quadratic for small errors, linear for large errors.
  Best of both. Often used in detection bounding-box regression.

For interviews:
  "I'd use MSE by default. Switch to MAE if I suspect outliers
   are biasing the model. Use Huber for box regression in detection."
```

### Gradient descent variants

```
Batch gradient descent:
  Compute gradient over entire dataset, take one step.
  Stable but slow on large data.

Stochastic gradient descent (SGD):
  Compute gradient over one sample at a time.
  Fast but noisy.

Mini-batch SGD:
  Compute gradient over a batch (e.g., 32 samples).
  Balance of stability and speed.
  The default in practice.

Momentum:
  Track an exponential moving average of past gradients.
  Smoother trajectory; faster convergence in valleys.

Adam:
  Per-parameter learning rates based on gradient history.
  Robust default for most problems.

AdamW:
  Adam with decoupled weight decay.
  The current default for transformer training.
```

## The bias-variance decomposition revisited

You saw this in Chapter 3.2. It deserves another mention because it's the most-asked ML fundamentals question.

```
Total error = (bias)² + variance + irreducible noise

  bias:     how far the average prediction is from the truth
  variance: how much predictions vary across different training sets
  noise:    irreducible — even a perfect model can't predict random noise

Underfitting: high bias, low variance.
              Model is too simple to capture the pattern.
              Fix: more complex model, more features, less regularization.

Overfitting:  low bias, high variance.
              Model memorizes training data, doesn't generalize.
              Fix: more data, simpler model, more regularization,
                   ensembling, dropout.

The sweet spot: minimize both.
```

When the interviewer asks "what's the bias-variance tradeoff," answer with the decomposition, the symptoms of each, and the mitigations. 90 seconds. Specific.

## Imbalanced datasets (revisited)

You saw this in 3.1 and 3.3. Worth re-mentioning because it appears constantly.

```
The trap: accuracy lies on imbalanced data.

The metrics that don't lie:
  - Macro-F1 (average F1 per class, equally weighted)
  - Per-class precision and recall
  - Confusion matrix
  - AUC-ROC (if you care about ranking quality)
  - Precision-Recall curve (when the positive class is rare)

The mitigations:
  - Class weights
  - Oversampling / SMOTE
  - Undersampling negatives
  - Focal loss
  - Threshold tuning
```

## How interviewers probe fundamentals

Three layers:

1. **Surface:** "What's bias-variance tradeoff?" Tests the decomposition.
2. **Standard:** "When would you use logistic regression vs gradient boosting?" Tests model selection reasoning.
3. **Twist:** "Your model has 95% accuracy on training, 65% on test. What do you do?" Tests overfitting diagnosis and mitigation chain (more data → regularization → simpler model → ensembling).

## The Interview Move

> *"The ML system design template I run through every interview is: clarify the problem, define functional and non-functional requirements, define the ML problem as input/output shapes and supervised/unsupervised, talk through data sources and labels, design the feature pipeline (including which features are real-time vs batch), pick the simplest reasonable model first and justify any complexity escalation, define the training pipeline with proper splits and metrics, design serving with latency and caching, set up monitoring with drift detection and retraining triggers, and name the failure modes — adversarial inputs, cold start, distribution shift, bias. Across the five case studies — search ranking, recommendation, fraud, object detection, chatbot — this template covers every concept the modules teach. The specific knobs (transformers vs CNNs, discriminative vs generative, value iteration vs policy iteration) come up in the fundamentals follow-ups, but the system design walk is the template."*

The IK ML Masterclass is now covered. Six modules, five case studies, plus the fundamentals. You're ready for the ML loops at any FAANG.

One final chapter: career coaching. Interview strategy, behavioral prep, negotiation. Short, mostly behavioral, ships next.
