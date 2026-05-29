---
description: Interview defense book for this codebase — 8 chapters in coach voice, book-style visual treatments, "I don't know" recovery
---

The user invoked `/aipe:study-interview-defense`.

This command takes **no arguments**. There is one interview defense book per repo, saved at the fixed path `.aipe/study-interview-defense/`. `.aipe/` is per-repo (lives at the root of whichever repo the command is run in); the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a **book** — 8 chapters of continuous narrative prose flowing through visual aids, in **coach voice**, for the reader who is days away from defending their own work in an interview. Unlike the other study specs (reference-grid shape, optimized for lookup), this one is optimized for sequential reading and re-reading. The unit of organization is the **chapter**, not the question.

**Per-repo scope.** This spec runs against one codebase at a time — the repo where the command was invoked. Defenses anchor to what's actually in this code.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-interview-defense.`
4. **Stop. Don't proceed.** The user needs to fill in real context first.

## Step 2 — Load context

Read these files (skip missing ones):

- `.aipe/project/context.md` (required — exists after Step 1)
- `.aipe/project/rules.md` (optional)
- `.aipe/project/stack.md` (optional)
- `~/.config/aipe/global/identity.md` (optional)
- `~/.config/aipe/global/rules.md` (optional)
- `~/.config/aipe/global/stack.md` (optional)
- `~/.config/aipe/global/skills.md` (optional)

Per-repo scope: do NOT load context files from other repos. The codebase being defended is the one this command was invoked in.

## Step 3 — Load the template chain

Interview defense reads four files in order — structure, writer persona, reader calibration, then the spec itself:

```
${CLAUDE_PLUGIN_ROOT}/specs/study.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/study-interview-defense.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`study.md`** — formatting rules, diagram quality standards, the "use real software, not analogies" rule, the no-hedging rule, the hard rules.
- **`teacher.md`** — the base writer persona (the staff engineer with 12 years' experience). This spec shifts that persona from *teacher* to **coach** — see teacher.md's "THE POSTURE" section and this spec's persona section.
- **`me.md`** — reader-side calibration: who the reader is professionally, what voice the strong answers should embody, what defenses the reader can credibly make from her actual portfolios (DSA + system design), and what gaps she should defer on rather than fake. `me.md` does NOT override study.md's structural rules or teacher.md's voice rules — it calibrates examples, depth, and what's defensible. For this spec `me.md` carries extra weight: the book is the reader's own defense, so its anchors must be things the reader has actually shipped.
- **`study-interview-defense.md`** — the book shape (8 chapters), the six required visual conventions, the per-chapter template.

## Step 4 — Detect existing book → branch CREATE or UPDATE

Check whether `.aipe/study-interview-defense/` already contains the book. The signal is the presence of `00-overview.md` at the root OR any file matching `0[1-8]-*.md`.

- **Existing book found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing book** → go to CREATE MODE (Step 5C onward).

**Legacy structure check.** Earlier versions of this command generated a per-question directory tree (`01-architecture/`, `02-tech-choices/`, … plus `the-ai-question.md`). If that structure is detected instead of the 8-chapter book, flag it in the report and ask the user whether to migrate to the book shape or leave the old guide as archive.

(The `.aipe/study-interview-defense/` directory itself may exist as an empty placeholder; that's not the same as having a book already.)

---

# CREATE MODE

Runs only when no existing book is found.

## Step 5C — Identify the per-chapter content

For each of the 8 chapters, identify the content that's specific to this codebase, cross-referenced against `me.md`'s portfolios so the defenses anchor to things the reader has actually shipped:

- **01 — The pitch** — the project pitched in three lengths: 10 seconds (elevator), 30 seconds (hallway), 90 seconds (the real "tell me about a project" answer).
- **02 — The architecture** — the system as a labeled whiteboard diagram, request flow walked end-to-end, plus "where they'll interrupt and what to say."
- **03 — The choices** — one section per load-bearing technology choice (database, vector store, framework, deployment target, …). Skip trivial ones (CSS tool, test runner). Name alternatives, decision criteria, the cost being paid.
- **04 — The scale story** — three realistic scale scenarios (10x users, 100x data, 10x latency-sensitive requests); for each, the first bottleneck, the second, what you'd add when, and how you'd measure.
- **05 — The failure story** — failure surfaces in the codebase (network failures, LLM API outages, DB read-only, malformed input, partial writes) and what the system does in each.
- **06 — The hard parts** — 3–5 reflection prompts: hardest bug, proudest part, least-confident-to-defend part. Teach answering honestly without collapsing.
- **07 — The counterfactuals** — the 3–4 most reconsiderable decisions and what the strong counterfactual sounds like for each. Anti-pattern: fabricating regrets for decisions that were obviously right.
- **08 — The AI question** — always generated. "Did you use AI to build this?" and its follow-ups. The calibrated-honest answer.

## Step 6C — Plan the book

The non-negotiables — inherited from `study.md`, `teacher.md`, `me.md`, and this spec:

1. **Coach voice throughout.** Address the reader as "you." The book is a conversation between the staff-engineer-as-coach persona (teacher.md in coach posture) and the candidate, not a third-person narration. The coach optimizes for the reader being ready in the room.
2. **Book shape, not reference grid.** Each chapter is one continuous narrative — opening hook → chapter-opening diagram → the body (questions and defenses) → "I don't know" recovery box → "what you'd change" → one-page summary. The reader reads front-to-back the first time and skims the visual treatments on re-reading.
3. **Exactly 8 chapters (00-overview plus 01–08).** Do not add chapters. Do not collapse chapters. The chapter list is the contract.
4. **The six required visual treatments** appear throughout (a reader who skims only these gets ~70% of the book):
   - **Chapter-opening diagram** — one large (15–30 line) ASCII visual anchor per chapter, wrapped in one sentence before and after.
   - **"What they're really asking" callout** — single-line box (`┌ ┐ └ ┘ │ ─`) before every interview question: surface question on top, the probe underneath.
   - **Strong-answer / weak-answer side-by-side** — two-column table where a failure pattern is distinctive enough to teach against; the contrast does the teaching.
   - **"I don't know" recovery box** — at least one per chapter, with a **double-line border (`╔ ╗ ╚ ╝ ═ ║`)** so the eye finds it on re-reading. Names the kind of pushback, what to say, what it signals, and what NOT to say.
   - **Follow-up decision tree** — at least one per chapter, branching ASCII tree showing the 2–4 likely follow-ups and what to say to each.
   - **Pull quotes** — 2–4 per chapter, single sentences in distinct treatment (heavy bar `┃` prefix or indented `▸` marker) — the lines the reader memorizes.
5. **All "strong answer" prose is in the reader's voice** — first person, present tense, directly speakable. "I picked pgvector because…" not "the developer picked…". Third-person prose is banned in strong-answer blocks.
6. **Every claim grounded in the codebase must be verifiable.** Library versions, file paths, function names must match the repo. If a defense requires a claim the agent can't verify, the question is wrong for this codebase — drop it rather than fabricate.
7. **Chapter 8 (the AI question) is always generated**, regardless of detectable AI use. The 2026 baseline assumes the reader used AI heavily; if they didn't, the chapter teaches how to say so without sounding defensive. AI-assistance honesty is woven through *every* chapter, distinguishing three modes of decision-making: deliberate (reader's choice), evaluated-and-accepted (AI suggested, reader evaluated), defaulted-to (AI's default, reader didn't deeply evaluate). The third is riskiest to own and most senior-signal-positive when owned well.
8. **Every chapter closes with a "what you'd change" treatment** — even Chapter 2 (architecture). The senior-engineer habit of always being able to name what you'd reconsider.
9. **No marketing language.** Banned across the whole book: "scalable solution," "robust architecture," "leveraging modern best practices," "cutting-edge," "best-in-class," "state-of-the-art," "industry-leading," "enterprise-grade."
10. **Hedging banned (inherited).** "I might have used X" is weaker than "I used X" or "I didn't use X." Pick one.

## Step 7C — Create the directory and generate the book

Create:

```bash
mkdir -p .aipe/study-interview-defense
```

Generate 9 files (flat — no subdirectories), in chapter order so each builds on the previous:

```
00-overview.md                 TOC + how to use this book + master "system at a glance" diagram
01-the-pitch.md                first 60 seconds — the project in 10s / 30s / 90s
02-the-architecture.md         walk me through the system
03-the-choices.md              why this stack
04-the-scale-story.md          what breaks first at 10x
05-the-failure-story.md        what happens when things go wrong
06-the-hard-parts.md           hardest bug, proudest part, weakest spot
07-the-counterfactuals.md      what you'd do differently
08-the-ai-question.md          modern table-stakes
```

Each chapter file follows the per-chapter template: `# Chapter N — [title]` → Opening hook (1–2 paragraphs, direct address, no interview-prep platitudes) → the chapter-opening diagram → the body (each question treated with the callout, strong-answer prose, optional side-by-side, follow-up decision tree, ≥1 pull quote) → ≥1 "I don't know" recovery box → "what you'd change" → one-page summary (core claim, questions with one-line answers, pull quotes, the "what you'd change" sentence).

`00-overview.md` maps all 8 chapters with one-line descriptions and the questions each covers, suggests a reading order (first read: in order; review: skim summaries + pull quotes; night-before: read only each chapter's one-page summary), contains the master "system at a glance" diagram, and connects to the rest of the study system (the concept-level Interview defense blocks live inside `.aipe/study-system-design-dsa/` and `.aipe/study-ai-engineering/` concept files; this book is the wide opener, those are the deep dives).

## Step 8C — Report + stop

Print exactly:

```
✓ Interview defense book created at .aipe/study-interview-defense/
  00-overview.md
  01-the-pitch.md
  02-the-architecture.md
  03-the-choices.md
  04-the-scale-story.md
  05-the-failure-story.md
  06-the-hard-parts.md
  07-the-counterfactuals.md
  08-the-ai-question.md
```

Then a 3–5 sentence summary: how many load-bearing tech choices Chapter 3 defends, which chapter has the densest content for this codebase, the single question the reader is most likely to get pushed past their depth on (and which chapter's "I don't know" box covers it), and a one-line note that the book pairs with the concept-level Interview defense blocks in the other study guides.

**Stop. Wait for the user's next instruction.** They'll typically pick a chapter to drill or ask for a mock-interview run. Do NOT auto-revise.

---

# UPDATE MODE

Runs when Step 4 found an existing book. Goal: refresh stale defenses without rewriting accurate ones. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing book

Walk `.aipe/study-interview-defense/` and read `00-overview.md` plus `01-the-pitch.md` through `08-the-ai-question.md`. If the legacy per-question directory structure is present instead, flag it in Step 7U (migrate to the book shape, or leave as archive — user's call).

## Step 6U — Diff each chapter against the current codebase AND the loaded templates

Three diff sources to check per chapter:

- **Codebase drift** — file paths that have moved, function names that changed, library versions in the defenses that have been upgraded, decisions that have shifted.
- **Template drift** — a chapter missing one of the six required visual treatments, a chapter missing its one-page summary, a strong-answer block written in third person instead of the reader's voice.
- **Inventory drift** — new load-bearing tech choices that warrant a new section in Chapter 3, new failure surfaces for Chapter 5, decisions that are now reconsiderable for Chapter 7.

Output a structured change plan grouped by chapter.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified in Step 6U. Maintain the coach voice and the reader's-voice convention for strong answers. Append a changelog entry at the bottom of each updated chapter:

```
---
Updated: <today's ISO date> — <one-line summary of what changed and why>
```

Do NOT rewrite accurate sections. Do NOT add or collapse chapters — the 8-chapter list is the contract. Do NOT fabricate defenses whose claims can't be grounded in the actual code — drop the question instead.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-interview-defense/
─────────────────────────────────────────────────
Chapters updated:     <list>
Chapters unchanged:   <count or list>
Legacy structure:     <migrated / left as archive, per user's choice>
```

**Stop. Wait for the user's next instruction.**
