# Software Engineering Requirements & Collaboration Checklist

## 1. Define the Project Outcome

* [ ] Write the main problem the project is solving.
* [ ] Define the intended user or stakeholder.
* [ ] Describe the expected outcome.
* [ ] Identify how success will be measured.
* [ ] Confirm that the team agrees on the project goal.

---

## 2. Define the Scope

### In Scope

* [ ] List the features included in the current release.
* [ ] Define the workflows the system must support.
* [ ] Identify the platforms, users, or environments included.

### Out of Scope

* [ ] List features intentionally excluded.
* [ ] Document ideas that may be considered later.
* [ ] Confirm that stakeholders understand what is not being built.

---

## 3. Organize the Information

Separate project information into these categories:

* [ ] Goals
* [ ] Functional requirements
* [ ] Non-functional requirements
* [ ] Constraints
* [ ] Assumptions
* [ ] Decisions
* [ ] Open questions
* [ ] Dependencies
* [ ] Risks
* [ ] Implementation tasks
* [ ] Test requirements

---

## 4. Create a Project Control Page

Maintain one central page that contains:

* [ ] Project goal
* [ ] Current scope
* [ ] Out-of-scope items
* [ ] Major requirements
* [ ] Current workstreams
* [ ] Open questions
* [ ] Recent decisions
* [ ] Dependencies
* [ ] Risks
* [ ] Blockers
* [ ] Links to detailed documents
* [ ] Current project status

---

## 5. Document Requirements

For each important requirement:

* [ ] Assign a stable ID, such as `REQ-01`.
* [ ] Describe the expected behavior.
* [ ] Explain why the requirement matters.
* [ ] Identify the user or stakeholder affected.
* [ ] Add acceptance criteria.
* [ ] Define edge cases.
* [ ] Identify related dependencies.
* [ ] Identify related technical tasks.
* [ ] Identify related tests.
* [ ] Confirm who approved the requirement.

Example:

```text
REQ-01: Users can view prerequisite relationships.

Acceptance criteria:
- Skills are displayed as nodes.
- Prerequisites are displayed as directed edges.
- The relationship is visible without editing the graph.
```

---

## 6. Identify Non-Functional Requirements

* [ ] Performance expectations
* [ ] Security requirements
* [ ] Privacy requirements
* [ ] Accessibility requirements
* [ ] Reliability expectations
* [ ] Scalability expectations
* [ ] Browser or device support
* [ ] Observability and logging requirements
* [ ] Data retention requirements
* [ ] Compliance requirements

---

## 7. Track Open Questions

For every unresolved question:

* [ ] Assign an ID, such as `Q-01`.
* [ ] Write the exact question.
* [ ] Assign an owner.
* [ ] Identify who can answer it.
* [ ] Add a needed-by date.
* [ ] Record the current status.
* [ ] Document the consequence of delaying the answer.
* [ ] Record a temporary assumption when necessary.
* [ ] Update the project documents when the question is answered.

Example:

```text
Q-01: Can a skill have multiple prerequisites?

Owner: Product
Needed by: Before API implementation
Fallback assumption: Yes
```

---

## 8. Maintain a Decision Log

For each meaningful decision:

* [ ] Assign an ID, such as `DEC-01`.
* [ ] Describe the decision.
* [ ] Explain the context.
* [ ] List the options considered.
* [ ] Record the selected option.
* [ ] Explain why it was selected.
* [ ] Document the tradeoffs.
* [ ] Record who participated.
* [ ] Add the decision date.
* [ ] Link affected requirements or tasks.

Example:

```text
DEC-01: The backend will return canonical graph relationships.

Reason:
This prevents each client from interpreting prerequisite rules differently.

Tradeoff:
The frontend has less control over relationship construction.
```

---

## 9. Map Dependencies

For each dependency:

* [ ] Describe what is needed.
* [ ] Identify the person or team responsible.
* [ ] Identify which task depends on it.
* [ ] Add a needed-by date.
* [ ] Track the current status.
* [ ] Document the impact of delay.
* [ ] Identify whether work can continue without it.
* [ ] Escalate dependencies that affect the critical path.

Common dependencies:

* [ ] Product decisions
* [ ] Design files
* [ ] API contracts
* [ ] Backend services
* [ ] Data availability
* [ ] Security review
* [ ] Legal or compliance approval
* [ ] Infrastructure
* [ ] Third-party services
* [ ] Another team's release

---

## 10. Identify Risks

For each risk:

* [ ] Describe what might happen.
* [ ] Estimate the likelihood.
* [ ] Estimate the impact.
* [ ] Assign an owner.
* [ ] Define a mitigation plan.
* [ ] Define a fallback plan.
* [ ] Identify early warning signs.
* [ ] Review the risk regularly.

Example:

```text
Risk:
The graph library may perform poorly with more than 1,000 nodes.

Mitigation:
Test large datasets during the prototype phase.

Fallback:
Add filtering, clustering, or progressive loading.
```

---

## 11. Break the Project Into Vertical Slices

For each slice:

* [ ] Define the user-visible outcome.
* [ ] Identify the requirements covered.
* [ ] Identify frontend changes.
* [ ] Identify backend changes.
* [ ] Identify data changes.
* [ ] Identify infrastructure changes.
* [ ] Define tests.
* [ ] Identify dependencies.
* [ ] Define the completion criteria.
* [ ] Make sure the slice can be demonstrated.

Example slices:

* [ ] Display a static graph.
* [ ] Load graph data from an API.
* [ ] Add expand and collapse behavior.
* [ ] Add progress states.
* [ ] Support large graphs.
* [ ] Add editing permissions.

---

## 12. Break Slices Into Tasks

Each task should include:

* [ ] A clear title
* [ ] The requirement it supports
* [ ] The expected result
* [ ] An owner
* [ ] Dependencies
* [ ] Acceptance criteria
* [ ] Testing expectations
* [ ] Relevant links
* [ ] Current status
* [ ] Definition of done

Avoid vague tasks such as:

```text
Work on graph feature
```

Prefer:

```text
Implement expand and collapse state for graph nodes.
```

---

## 13. Define the Definition of Done

For each feature or slice, confirm:

* [ ] Code is implemented.
* [ ] Acceptance criteria are met.
* [ ] Automated tests are added.
* [ ] Manual testing is complete.
* [ ] Error states are handled.
* [ ] Loading states are handled.
* [ ] Accessibility has been reviewed.
* [ ] Logging or monitoring is added.
* [ ] Documentation is updated.
* [ ] Product or design has reviewed the result.
* [ ] The feature is deployable.
* [ ] No unresolved critical blockers remain.

---

## 14. Prepare for Collaboration Meetings

Before the meeting:

* [ ] Share the relevant context.
* [ ] Explain what changed.
* [ ] List the questions requiring decisions.
* [ ] Include your recommended option.
* [ ] Explain the tradeoffs.
* [ ] Identify the consequence of delaying the decision.
* [ ] Share relevant documents beforehand.

During the meeting:

* [ ] Keep the discussion tied to the project goal.
* [ ] Separate facts from assumptions.
* [ ] Clarify conflicting interpretations.
* [ ] Confirm decisions verbally.
* [ ] Assign owners.
* [ ] Assign deadlines.
* [ ] Record unresolved questions.
* [ ] Identify follow-up actions.

After the meeting:

* [ ] Update the source of truth.
* [ ] Update the decision log.
* [ ] Update requirements.
* [ ] Update owners and deadlines.
* [ ] Create follow-up tasks.
* [ ] Share a concise summary.
* [ ] Confirm that participants agree with the recorded outcome.

---

## 15. Communicate Project Status

Use this structure for updates:

### Completed

* [ ] What was finished?
* [ ] What outcome is now available?

### In Progress

* [ ] What is actively being worked on?
* [ ] Who owns it?

### Next

* [ ] What will happen next?
* [ ] What is the next testable slice?

### Blocked

* [ ] What is blocked?
* [ ] Who or what is blocking it?
* [ ] What is the impact?

### Decisions Needed

* [ ] What decision is required?
* [ ] Who must make it?
* [ ] When is it needed?

### Risks

* [ ] What new risks appeared?
* [ ] Did any existing risk increase?

Example:

```text
Completed
- API schema approved
- Static graph prototype completed

In progress
- Connecting the frontend to the graph endpoint

Next
- Add expand and collapse behavior

Blocked
- Waiting for product to define cycle behavior

Decision needed
- Should graph layouts remain stable between sessions?

Risk
- Layout performance declines above 700 nodes
```

---

## 16. Handle Requirement Changes

When a requirement changes:

* [ ] Document what changed.
* [ ] Record why it changed.
* [ ] Identify who requested the change.
* [ ] Identify affected requirements.
* [ ] Identify affected decisions.
* [ ] Identify affected designs.
* [ ] Identify affected implementation tasks.
* [ ] Identify affected tests.
* [ ] Estimate the additional effort.
* [ ] Identify what will be delayed.
* [ ] Identify what may need to be removed.
* [ ] Communicate the tradeoff.
* [ ] Get approval for the revised scope.
* [ ] Update the source of truth.

---

## 17. Manage Assumptions

For every important assumption:

* [ ] Write it down explicitly.
* [ ] Explain why the assumption is being made.
* [ ] Identify who should validate it.
* [ ] Add a validation deadline.
* [ ] Document what happens if it is incorrect.
* [ ] Convert confirmed assumptions into requirements or decisions.
* [ ] Remove assumptions that are no longer relevant.

---

## 18. Use Three Planning Horizons

### Now

Detailed and actionable:

* [ ] Tasks are clearly defined.
* [ ] Owners are assigned.
* [ ] Dependencies are known.
* [ ] Acceptance criteria are written.

### Next

Roughly decomposed:

* [ ] Upcoming features are identified.
* [ ] Major dependencies are visible.
* [ ] Important decisions are anticipated.

### Later

Outcome-level only:

* [ ] Future ideas are recorded.
* [ ] Detailed tasks are not created too early.
* [ ] Future work is separated from current commitments.

---

## 19. Keep Documentation Current

* [ ] Remove outdated information.
* [ ] Mark superseded decisions.
* [ ] Close answered questions.
* [ ] Update requirement statuses.
* [ ] Update links to designs and tickets.
* [ ] Archive completed project phases.
* [ ] Keep the project control page concise.
* [ ] Make sure team members know where the source of truth is.

---

## 20. Daily Engineering Check

At the beginning of the day:

* [ ] What is the highest-priority outcome?
* [ ] What task moves the project forward most?
* [ ] Am I blocked by anyone?
* [ ] Is anyone blocked by me?
* [ ] Is there a question I need answered?
* [ ] Has a requirement changed?
* [ ] Is there a decision that needs to be documented?
* [ ] Am I working on the critical path?

At the end of the day:

* [ ] What did I complete?
* [ ] What changed?
* [ ] What did I learn?
* [ ] What remains blocked?
* [ ] What should happen next?
* [ ] Does the project tracker need an update?
* [ ] Does anyone need to be informed?

---

## 21. Weekly Project Review

* [ ] Reconfirm the project goal.
* [ ] Review current scope.
* [ ] Review completed work.
* [ ] Review upcoming work.
* [ ] Review open questions.
* [ ] Review decisions made.
* [ ] Review dependencies.
* [ ] Review blockers.
* [ ] Review risks.
* [ ] Review requirement changes.
* [ ] Review the critical path.
* [ ] Confirm priorities for the next week.
* [ ] Remove tasks that no longer matter.
* [ ] Make tradeoffs visible.

---

# Quick Project Health Check

You should be able to answer:

* [ ] What outcome are we trying to achieve?
* [ ] What is currently in scope?
* [ ] What is currently out of scope?
* [ ] What is being worked on now?
* [ ] What is the next testable slice?
* [ ] What decisions have been made?
* [ ] What questions remain unanswered?
* [ ] What assumptions are we making?
* [ ] What is blocked?
* [ ] Who owns each blocker?
* [ ] What dependencies affect the critical path?
* [ ] What recently changed?
* [ ] What are the biggest risks?
* [ ] What tradeoffs are being made?
* [ ] What does done mean?

---

# Minimum Viable Version

When the full checklist feels too heavy, track only these items:

* [ ] Goal
* [ ] In scope
* [ ] Out of scope
* [ ] Requirements
* [ ] Open questions
* [ ] Decisions
* [ ] Dependencies
* [ ] Risks
* [ ] Current tasks
* [ ] Blockers
* [ ] Next testable slice
* [ ] Definition of done

