# Ticket Investigation Prompt

**What it does:** Reviews a ticket and its surrounding context to determine what work is actually required before implementation begins.

```text
Review this ticket thoroughly before proposing an implementation.

Investigate:

- Ticket title and description
- User story
- Acceptance criteria
- Comments and discussion
- Parent epic
- Linked or related tickets
- Dependencies and blockers
- Referenced documentation
- Relevant existing behavior, if available

Then answer the following.

## 1. What is this ticket actually asking for?

Summarize:

- User problem
- Expected behavior
- Current behavior
- Desired behavior
- Acceptance criteria
- Explicitly out-of-scope work

Separate confirmed requirements from assumptions.

## 2. Frontend work

Determine whether frontend work is required.

If yes, identify:

- Screens or components affected
- User interactions
- UI states
- Validation
- Loading states
- Empty states
- Error states
- Permissions or visibility rules
- Data the frontend needs
- Existing components that may be reusable

If no frontend work appears necessary, explain why.

## 3. Backend work

Determine whether backend work is required.

If yes, identify:

- APIs or endpoints affected
- Business logic
- Services/modules
- Validation
- Authorization
- Database changes
- Queries
- Background jobs
- External integrations
- Events or side effects
- Error handling

If no backend work appears necessary, explain why.

## 4. Data requirements

Identify the data required to implement and verify the feature.

For each piece of data explain:

- What data is needed
- Where it comes from
- Current source of truth
- Whether it already exists
- Whether new data must be stored
- Whether existing data needs migration or backfill
- What data I should inspect or confirm before coding

## 5. Existing-system investigation

Identify what should be inspected in the existing codebase.

Look for:

- Similar features
- Existing UI components
- Existing APIs
- Existing business logic
- Existing data models
- Existing queries
- Existing validation
- Existing permissions
- Existing tests

Tell me specifically what I should search for rather than saying
"investigate the codebase."

## 6. Related-ticket analysis

Review the parent epic and related tickets.

Determine:

- What work has already been completed
- What another ticket is responsible for
- What this ticket depends on
- Whether another ticket changes the interpretation of this ticket
- Whether requirements are duplicated
- Whether there are implementation decisions already established elsewhere

Do not assume this ticket should implement behavior owned by another ticket.

## 7. Ambiguities and missing information

Identify anything that is:

- Missing
- Ambiguous
- Contradictory
- Outdated
- Assumed but not confirmed

For each one provide:

Question:
Why it matters:
Who can likely answer it:
Does it block implementation? Yes / No

Do not silently invent missing requirements.

## 8. Scope assessment

Classify the expected work:

Frontend: None / Small / Medium / Large
Backend: None / Small / Medium / Large
Database: None / Small / Medium / Large
Infrastructure: None / Small / Medium / Large
Testing: None / Small / Medium / Large

Explain each classification.

## 9. Implementation readiness

Classify the ticket as:

READY
READY WITH ASSUMPTIONS
NEEDS CLARIFICATION
BLOCKED

Explain why.

Then provide:

- What I know
- What I still need to confirm
- What I should investigate in the codebase
- What I should ask the team
- Dependencies/blockers
- Likely frontend work
- Likely backend work
- Likely data work
- Suggested first implementation step

Do not write code yet.
```

## Compact daily version

For normal day-to-day Jira work, I'd probably use this shorter one most often:

```text
Review this ticket, its description, acceptance criteria, comments, parent epic,
linked tickets, and relevant documentation before I start coding.

Determine:

1. What is the ticket actually asking for?
2. What requirements are confirmed vs inferred?
3. Is frontend work required? What specifically?
4. Is backend work required? What specifically?
5. Are database, API, infrastructure, or integration changes required?
6. What data do I need to inspect or confirm?
7. What similar existing behavior should I find in the codebase?
8. What work is already handled by related tickets?
9. What dependencies or blockers exist?
10. What requirements are ambiguous, missing, or contradictory?
11. What questions should I ask before implementation?
12. Is this ticket READY, READY WITH ASSUMPTIONS, NEEDS CLARIFICATION, or BLOCKED?

Finish with:

Frontend:
Backend:
Data:
Dependencies:
Questions:
Codebase areas to investigate:
Implementation readiness:
Recommended next step:

Separate confirmed information from assumptions.

Do not write code yet.
```

I especially like the **implementation-readiness classification** here. It turns the prompt from just “tell me what this ticket means” into a practical **pre-coding gate**.
