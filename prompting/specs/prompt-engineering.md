# Prompt Engineering Spec

Use this for AI apps like buffr when your system prompt, tool descriptions, or agent instructions are producing wrong output. The "code" being fixed is the prompt itself — not the application logic. Needs current prompt, observed output, and what you've already tried.


## Prompt engineering spec format


```
## What prompt is broken
[system prompt / tool description / agent instruction]

## Current prompt
[paste the exact current prompt]

## Input that triggers wrong output
[exact user message or context that causes the problem]

## Observed output
[what the model actually returns]

## Expected output
[what it should return instead]

## What I've already tried
[previous attempts and why they didn't work]

## Constraints
  - Must work across all supported providers
  - Must not increase token count significantly
  - Must not break existing working inputs

## Done when
[the broken input produces the expected output,
 and 3 other inputs still produce correct output]
```


> 💾 Save as → .buffr/specs/prompts/[name].md


## Key principle

> Always test a prompt fix against at least 3 inputs that were already working correctly. A fix that solves one failure mode while breaking existing behaviour is worse than the original problem.
