---
description: Prompt engineering study guide — 13 concepts in a working-AI-engineer voice, anchored to real code
---

The user invoked `/aipe:study-prompt-engineering`.

This command takes **no arguments**. There is one prompt-engineering guide per repo, saved at the fixed path `.aipe/study-prompt-engineering/`. `.aipe/` is per-repo (lives at the root of whichever repo the command is run in); the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused companion to `/aipe:study` — same per-concept template, different voice, fixed concept list. The 13 concepts cover prompt engineering as a working discipline: anatomy of a production prompt, structured outputs, prompts as code, token budgeting, eval-driven iteration, single-purpose chains, output mode mismatch, few-shot, chain-of-thought, self-critique, meta-prompting, prompt injection defenses, forbidden patterns.

**Per-repo scope.** This spec runs against one codebase at a time — the repo where the command was invoked. Codebase examples (loopd, aipe) named in the spec are illustrative of patterns; they are not required references. The agent describes how *this codebase* uses each pattern, not how the named projects use them.

## Step 1 — Initialize if needed

If `.aipe/project/context.md` does NOT exist in the current working directory:

1. Create `.aipe/project/` and `.aipe/specs/` directories.
2. Write `.aipe/project/context.md` with this placeholder body:

   ```
   # Project context

   Describe this codebase so an AI agent can implement against it without asking.

   ## Stack
   - runtime, framework, language

   ## Data model
   - entities, relationships, where they live

   ## File structure
   - top-level folders and what lives where

   ## What must not change
   - public API surface, schema fields, ...
   ```

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-prompt-engineering.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `.aipe/project/aieng-curriculum.md` or `.aipe/project/curriculum.md` (optional — Phase 1 concepts C1.7, C1.10, C1.12 and Phase 3 evals concepts inform anchoring when present)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)
- `~/.config/aipe/global/aieng-curriculum.md` or `~/.config/aipe/global/curriculum.md` (optional)

## Step 3 — Load both templates

Prompt engineering inherits the per-concept-file template from `study.md`. Load both:

```
${CODEX_PLUGIN_ROOT}/specs/study.md
${CODEX_PLUGIN_ROOT}/specs/study-prompt-engineering.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for `specs/study.md` and `specs/study-prompt-engineering.md` upward from this file's location.

`study.md` is read for **structure** — per-concept template, formatting rules, diagram requirements, hard rules, Validate block, constraint summary. `study-prompt-engineering.md` is read for **topic and voice** — the persona, the 13 concepts to cover, the anchoring rules. The agent uses both in tandem.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-prompt-engineering/` already contains the guide. The signal is the presence of `00-overview.md` at the root OR any file matching `[0-9][0-9]-*.md` (the 13 concept files).

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

(The `.aipe/study-prompt-engineering/` directory itself may exist as an empty placeholder; that's not the same as having a guide already.)

---

# CREATE MODE

Runs only when no existing guide is found.

## Step 5C — Plan the guide

Apply the structure from `study.md` (the per-concept-file template loaded in Step 3) and the topic + voice from `study-prompt-engineering.md`.

The non-negotiables — inherited from both specs:

1. **Voice: working AI engineer, not staff engineer.** The persona has 6–8 years in software, 3–4 of them heads-down on production LLM systems. Has shipped RAG, multi-step chains, meta-tooling, safety systems, code-aware features. Has iterated thousands of prompts. Reads Hamel Husain on evals, follows Simon Willison, has opinions about Latent Space episodes. **Not** authoritative-systems-architect; instead practitioner-skeptical, concrete-over-abstract, distinguishes "advice that works in demos" from "advice that survives production." When `study.md`'s staff-engineer voice would land differently on the same topic, the working-AI-engineer voice wins for this guide.
2. **All structural rules from `study.md` apply unchanged** — the per-concept-file template (Subtitle, Why care's five moves, How it works's three moves, primary ASCII diagram, In this codebase, Elaborate, Tradeoffs, Tech reference, Project exercises, Summary, Interview defense, Validate, See also), all formatting rules (no markdown pipe-tables for Tech reference, kebab-case file names, no Mermaid/no images, box-drawing diagram characters), the frontend-primitive-first anchor priority order, the Validate block's 5 levels.
3. **Hedging is banned in both voices** — "might," "could potentially," "tends to" are out everywhere. Production engineers don't talk that way.
4. **Concrete over abstract.** Specific bugs the persona debugged, specific dates the underlying model changed, specific phrasings that drifted in production. Generic "best practices" prose is banned.
5. **Practitioner skepticism.** When folklore from blog posts contradicts what actually happens in production, name the contradiction. "Internet advice says X. In a production system I shipped, X did Y, and here's why."
6. **No demo-vs-prod elision.** If a technique only works in demos, say so. If it works under specific conditions, name the conditions. If it stops working after a model upgrade, name that too.
7. **First-person where it earns its place.** "I" appears when recounting a specific debugging episode, a specific production decision, a specific learning. Not for every paragraph.
8. **Cite the literature when relevant.** When a pattern has a canonical source (Hamel on evals, OpenAI cookbook, Anthropic prompt guide), name it.
9. **Anchor every concept to *this* codebase.** For each concept, identify whether *this* codebase implements it (Case A — `In this codebase` describes the implementation with real file + function + line range) or not (Case B — "Not yet implemented" with one honest sentence; Project exercises becomes the primary buildable target). Examples in the spec (aipe, loopd) illustrate what each concept *typically* looks like in well-shaped LLM application or meta-tooling codebases — they're not required references for the file you're writing.
10. **Out-of-scope topics stay out**: vendor-specific syntax quirks (they appear inside Tech reference, not as their own concepts), Tree of Thoughts / academic prompt research, Constitutional AI, vision/multi-modal prompting, jailbreak research from the attacker side, the history of prompt engineering. The 13 concepts are the complete list.

## Step 6C — Create the directory structure

Create:

```
.aipe/study-prompt-engineering/
```

(Use `mkdir -p`.) The 13 concept files plus `00-overview.md` and `README.md` live directly under the root — no subdirectories.

## Step 7C — Generate `00-overview.md`

One-page map of the discipline plus a reading-order legend. Cover, in order: what prompt engineering as a discipline is (1 paragraph, working-AI-engineer voice), the 13 concepts grouped by what they solve (operational discipline first: anatomy, structured outputs, prompts-as-code, token budgeting, eval-driven iteration; then specific techniques: chains, output modes, few-shot, CoT, self-critique, meta-prompting, injection defenses, forbidden patterns), and a one-line "what it gets wrong" summary per concept that names the production failure mode the concept addresses. **No prose paragraphs beyond the opening one** — the rest is bullets, lists, and the diagram.

## Step 8C — Generate the 13 concept files

Write the files in this order so each builds on prior context where useful:

```
01-anatomy.md                       Anatomy of a production prompt
02-structured-outputs.md            Structured outputs via tool calling and schemas
03-prompts-as-code.md               Prompts as code: versioning and observability
04-token-budgeting.md               Token budgeting and context window management
05-eval-driven-iteration.md         Eval-driven prompt iteration
06-single-purpose-chains.md         Single-purpose chains
07-output-mode-mismatch.md          Output mode mismatch
08-few-shot.md                      Few-shot prompting
09-chain-of-thought.md              Chain-of-thought (CoT)
10-self-critique.md                 Self-critique and self-consistency
11-meta-prompting.md                Meta-prompting
12-prompt-injection-defense.md      Prompt injection defenses (author side)
13-forbidden-patterns.md            Forbidden patterns and rotating formulas
```

Each file uses the full per-concept structure from `study.md` — Subtitle, blockquote summary, See also, Why care (5 moves), How it works (3 moves with diagrams at every move and every sub-section), primary diagram, In this codebase (with real file + function + line range references), Elaborate, Tradeoffs (with comparison table + breakpoint), Tech reference (with `###` heading + labelled bullets, never pipe-tables), Project exercises (curriculum-driven if curriculum loaded), Summary, Interview defense (with diagrams per Q&A), Validate.

Anchor each concept to *this* codebase. The example anchors below (from `study-prompt-engineering.md`) describe what each concept *typically* looks like in well-shaped codebases — use them to recognize the pattern, then describe how this specific codebase implements it (Case A) or hasn't yet (Case B):

- **#1 anatomy** — typically: explicit templates named in code (aipe-shaped) or chains each with their own anatomy (loopd-shaped)
- **#2 structured-outputs** — typically: classifiers / extractors with declared schemas (loopd-shaped) or template-output contracts (aipe-shaped)
- **#3 prompts-as-code** — typically: markdown templates as version-controlled prompts (aipe-shaped)
- **#4 token-budgeting** — typically: chains with measured token costs or templates that fit a budget
- **#5 eval-driven-iteration** — typically: golden eval sets, regression suites, LLM-as-judge wired in
- **#6 single-purpose-chains** — typically: each chain doing one job, composed into longer flows
- **#7 output-mode-mismatch** — typically: explicit output modes per chain, mismatches caught at boundaries
- **#8 few-shot** — typically: classifiers with explicit examples or template literals carrying them
- **#9 chain-of-thought** — typically: reasoning prompts for multi-step decisions
- **#10 self-critique** — typically: high-stakes generation that runs a verify step (edits, content moderation)
- **#11 meta-prompting** — typically: templates that generate prompts for other LLM calls (aipe-shaped)
- **#12 prompt-injection-defense** — typically: any feature interpolating user-controlled content into prompts
- **#13 forbidden-patterns** — typically: generative chains run repeatedly for the same user (caption-like)

For each file: if this codebase implements the concept, write `In this codebase` (Case A) with real file + function + line range. If not, use Case B — `In this codebase` says "Not yet implemented" with one honest sentence; Project exercises becomes the primary buildable target.

## Step 9C — Generate `README.md`

Index of all 13 concepts with one-line descriptions and the recommended reading order. Operational discipline first (01–05), then specific techniques (06–13). The README is what the reader opens first; it makes the discipline scannable.

## Step 10C — Report + stop

Print exactly:

```
✓ Prompt engineering guide created at .aipe/study-prompt-engineering/
  00-overview.md
  README.md
  01-anatomy.md
  02-structured-outputs.md
  03-prompts-as-code.md
  04-token-budgeting.md
  05-eval-driven-iteration.md
  06-single-purpose-chains.md
  07-output-mode-mismatch.md
  08-few-shot.md
  09-chain-of-thought.md
  10-self-critique.md
  11-meta-prompting.md
  12-prompt-injection-defense.md
  13-forbidden-patterns.md
```

Then a 3-sentence summary: which codebases were used as anchors most, any Case B files (concept named but not yet implemented), and any concepts where the working-AI-engineer voice produced a take that diverged most from staff-engineer framing.

**Stop. Wait for the user's next instruction.** They'll typically pick a concept file to drill on. Do NOT auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: refresh stale takes without rewriting accurate sections. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-prompt-engineering/` and read every `.md` file: `00-overview.md`, `README.md`, and `01-anatomy.md` through `13-forbidden-patterns.md`. Skip any that don't exist (and flag them for regeneration in Step 6U).

## Step 6U — Diff each file against the current codebases AND the loaded templates

For each concept file, check three diff sources:

- **Codebase drift** — file paths that have moved, function names that have changed, line ranges that no longer match the implementation, model versions named in Tech reference that have been upgraded.
- **Template drift** — `study.md` has added new blocks (e.g., a new sub-section to How it works, a new field to Tech reference, a new Validate level) since the file was last written. Identify missing blocks.
- **Voice drift** — sections that read like blog-post advice instead of working-AI-engineer practitioner takes. Hedging language ("tends to," "might," "could potentially") that crept in. Concept claims that aren't anchored to specific codebase references.

Output a structured change plan in this shape:

```
Changes detected for .aipe/study-prompt-engineering/
─────────────────────────────────────────────────

01-anatomy.md
  Outdated: file path aipe/prompts/legacy.md no longer exists
  Missing:  Move 2.5 (current state vs future state) — required by study.md v1.32+
  Action:   update path references; add Move 2.5 block

02-structured-outputs.md
  Voice:    paragraph 3 hedges ("structured outputs tend to work better")
  Action:   rewrite paragraph 3 in working-AI-engineer voice with a specific bug

... (one block per file)

Files unchanged: <list>
```

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Maintain the working-AI-engineer voice throughout. Append a changelog entry at the bottom of each updated file:

```
---
Updated: <today's ISO date, e.g. 2026-05-23> — <one-line summary of what changed and why>
```

Do NOT rewrite accurate sections. Do NOT add new concepts — the 13 concepts are the complete list per the spec. If a genuinely new prompt engineering concept emerges that should be added, propose it in the Step 6U change plan rather than adding it silently.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-prompt-engineering/
─────────────────────────────────────────────────
Files updated:        <list>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
