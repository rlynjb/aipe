# Important Notes

## What Matters Most in AI Engineering Now

AI has shifted the engineering bottleneck.

As implementation and coding become faster and cheaper with AI, the highest-value work moves toward **designing the right system and proving that it works**.

A useful priority order is:

1. **Problem Framing & System Architecture**  
   Define what problem is being solved, how the system should behave, and how the parts fit together.

2. **Evaluations**  
   Define what “good” looks like and test whether the system actually behaves correctly.

3. **Prompts / Behavioral Specifications**  
   Define how the model should reason, decide, interpret evidence, and handle uncertainty.

4. **Schemas & Module Contracts**  
   Define what data enters and leaves each component and what each module guarantees.

5. **Workflow & Orchestration**  
   Define execution order, routing, retries, branching, and how modules interact.

6. **Code / Implementation**  
   Handle deterministic calculations, validation, transformations, APIs, infrastructure, and other exact operations.

### Core Idea

The old bottleneck was often:

**Can we build this?**

With AI-assisted development, the harder questions increasingly become:

**What should we build?**  
**How should it behave?**  
**How do we know it works?**

So the engineer's role shifts from mainly writing implementation toward:

**System Design → Specification → Evaluation → Iteration**

AI can generate a lot of code.

It cannot remove the need to decide what the system should do, where its boundaries are, and what counts as correct.

---

## Where to Start in an AI / Agentic System

There is **no universal rule that says “always start with the prompt.”**

The right starting point depends on **where the biggest uncertainty is**.

A useful question is:

> **What part of the system do I understand the least right now?**

That often tells you where to begin.

### Start With the Problem

Before prompt, schema, tools, or workflow, define:

**What problem am I solving?**

For example:

> Analyze Etsy product performance, identify the primary bottleneck, and recommend one controlled experiment.

Everything else should support that goal.

### Start With the Prompt When the Reasoning Is Unclear

Use the prompt as your starting point when your biggest questions are:

- How should the agent analyze this problem?
- What decisions should it make?
- What role should it assume?
- What reasoning process should it follow?
- What should it do when evidence is uncertain?

For the Etsy agent, the master prompt helped discover the behavioral specification:

**Observe → Measure → Classify → Diagnose → Hypothesize → Experiment → Evaluate**

Think:

> **Prompt = How should the model reason?**

### Start With the Schema When the Data Contract Is Clear or Critical

Start with a schema when the biggest question is:

> **What exact information must enter and leave this component?**

This is especially useful when:

- several modules communicate with each other,
- another application consumes the output,
- fields must always exist,
- output must be machine-readable,
- invalid output would break downstream code.

Example:

```text
DiagnosisResult

selectedPath
primaryBottleneck
confidence
evidence
decision
```

Once the schema is known, you can design the prompt to reliably produce those fields.

Think:

> **Schema = What information must move between components?**

### Start With the Workflow When Orchestration Is the Hard Part

Start with the workflow when the biggest uncertainty is:

> **What needs to happen, and in what order?**

Example:

```text
Get Etsy data
     ↓
Calculate metrics
     ↓
Qualify metrics
     ↓
Diagnose bottleneck
     ↓
Create experiment
     ↓
Wait for results
     ↓
Evaluate experiment
```

Think:

> **Workflow = How does the system move from goal to result?**

### Start With Code When the Problem Is Exact

If something has one objectively correct solution, it usually doesn't need to begin as an LLM problem.

Examples:

- conversion-rate calculation
- percentage change
- validation
- date calculations
- threshold checks
- data transformations

Use code.

```text
Orders + Views
     ↓
Code
     ↓
Conversion Rate
```

Then give the result to the LLM for interpretation.

Think:

> **Code = What must be exact?**

### Start With Tools When Missing Information Is the Main Problem

If the agent already knows **how** to reason but doesn't have the information required, the problem may be tool access.

Example:

```text
Agent
  ↓
Research Tool
  ↓
Marketplace Data
  ↓
Agent Interpretation
```

Think:

> **Tools = What external information or actions does the agent need?**

### Start With Evaluations When Behavior Already Exists

Sometimes you already have:

- prompts,
- code,
- workflows,
- tools,

but you don't know whether the system is actually good.

Then start by defining test cases.

Example:

```text
Input:
High impressions
Low clicks
Healthy conversion after click

Expected:
CLICK-THROUGH

Actual:
CONVERSION

Result:
FAIL
```

Think:

> **Eval = How do I know the behavior is correct?**

### A Good Default Design Order

For a new agent, a useful default is:

```text
PROBLEM
   ↓
GOAL
   ↓
WORKFLOW
   ↓
MODULE RESPONSIBILITIES
   ↓
MODULE CONTRACTS
   ↓
SCHEMAS
   ↓
PROMPTS
   ↓
CODE + TOOLS
   ↓
EVALUATIONS
```

But this is **not a rigid waterfall**.

You'll frequently loop backward.

Example:

```text
Design Prompt
     ↓
Realize missing data
     ↓
Add Tool
     ↓
Realize tool output is inconsistent
     ↓
Add Schema
     ↓
Run Eval
     ↓
Discover reasoning failure
     ↓
Revise Prompt
     ↓
Run Eval Again
```

That iteration is normal.

### The Shortcut

When you're unsure where to start, ask:

**How should the agent think?**  
→ **Prompt**

**What data must move around?**  
→ **Schema**

**What happens in what order?**  
→ **Workflow**

**How do I know it still works?**  
→ **Evaluation**

**What must be exact?**  
→ **Code**

**What information or action exists outside the model?**  
→ **Tools**

### Key Principle

**You don't always start with a prompt.**

You start with the **largest uncertainty in the system**.

Then use:

**Prompt** for reasoning.  
**Schema** for data contracts.  
**Workflow** for orchestration.  
**Code** for exact behavior.  
**Tools** for external knowledge and actions.  
**Evaluations** for behavioral correctness.

Iterate between them until the overall system behaves the way you intended.
