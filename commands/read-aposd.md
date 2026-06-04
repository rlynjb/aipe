---
description: [standalone] Book-style guide to A Philosophy of Software Design — original chaptered teaching of the design primitives, with your-code anchors
argument-hint: <optional flags, e.g. "--part II" or "--anchor ./path">
---

The user invoked `/aipe:read-aposd` with optional flags: `$ARGUMENTS`.

This command produces an original, **book-style** study guide to the design primitives in John Ousterhout's *A Philosophy of Software Design* — taught in this family's voice, with original examples, anchored to your own code where a repo is present. It is a **guided read of the ideas**, not a copy of the book.

This is a new generator family: the **read** family. Like the `study-*` specs it loads `teacher.md` (voice), `me.md` (reader), and `format.md` (teaching primitives — diagrams-first, zoom out, structure pass, claim → consequence, verdict-first). But a book is not a codebase, so this spec defines its **own** per-chapter template (seven beats) rather than the per-concept-file template — the same way the `rehearse-*` books define their own chapter shape while inheriting the persona.

**Optional flags** parsed from `$ARGUMENTS`:
- `--part <N>` (Roman numeral I–V) — only (re)generate one Part instead of the whole book
- `--anchor <path>` — anchor the "In your code" beat to a specific repo path (falls back to the current repo when omitted)

Output lands in `.aipe/read-aposd/` as a numbered book.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:read-aposd.`
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

If `--anchor <path>` was supplied in `$ARGUMENTS`, also load context from that repo when reachable (for the "In your code" beat).

## Step 3 — Load the template chain

read-aposd reads four files in order — structure (teaching primitives), writer persona, reader calibration, then the spec itself:

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/read-aposd.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the *teaching primitives* (zoom-out, structure pass with axes/seams/layered decomposition, claim → consequence, diagrams-primary, verdict-first, no physical-world analogy as the primary anchor, no hedging, no marketing language). This spec uses these primitives but **does NOT use format.md's per-concept-file template** — it defines its own per-chapter book template inline (see Step 5C). Specifically, the codebase-anchored blocks (Implementation in codebase) are replaced by "In your code" in this spec.
- **`teacher.md`** — the writer persona in **teacher posture**. General software design is the staff-engineer's home turf — this book is exactly that engineer's wheelhouse. Inherit the banned list and the verdict-first / rank-what-matters trait.
- **`me.md`** — reader-side calibration. Bridge from what the reader knows (frontend, DSA, agent/pipeline work) into each design primitive.
- **`read-aposd.md`** — the through-line, the book map (5 parts, 19 chapters), the per-chapter seven-beat template, the copyright hard rule, the concept-by-concept teaching guide.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/read-aposd/` already contains the guide. The signal is the presence of `README.md` or `00-front-matter.md` at the root OR any file inside `part-1/` through `part-5/`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

If `--part <N>` was supplied, scope the run to that Part only (only generate or only diff the matching directory).

---

# CREATE MODE

Runs only when no existing guide is found (or only the targeted Part is missing under a `--part` invocation).

## Step 5C — Plan the book

The non-negotiables — inherited from `format.md`, `teacher.md`, `me.md`, and this spec:

1. **COPYRIGHT — HARD RULE (non-negotiable).** The book is copyrighted. This guide teaches the *ideas* (not protected) in entirely original *expression* (the protected part stays the author's). **NEVER reproduce the book's prose.** No passage dumps, no chapter text, no figure redraws-as-copies. Quote at most a short phrase (under ~15 words) and only when the exact wording is a defined term (e.g., the name of a red flag). Default to paraphrase. Explain every concept in your own words with your own examples. If you cannot explain an idea without quoting it, you do not understand it yet — go understand it. Every Part's README states plainly: this guide supplements the book, it does not replace it.
2. **The through-line is "complexity is the enemy."** Every chapter ties back to which complexity symptom (change amplification / cognitive load / unknown unknowns) the technique reduces, and which cause (dependency / obscurity) it removes. A technique that doesn't reduce complexity doesn't earn a chapter.
3. **Per-chapter seven-beat template.** Each chapter follows the same beats, in this order:
   1. **Opener** — one line: where we are in the arc, what the last chapter set up that this one needs.
   2. **The idea** — VERDICT FIRST. The principle in one or two sentences, in plain words. No on-ramp.
   3. **How it works** — diagram-primary. Draw the shape of the idea (a deep vs shallow module, a leak across a boundary, a layer stack). Prose fills in what the diagram can't.
   4. **Why it cuts complexity** — tie to the through-line explicitly: which symptom does this reduce, by removing which cause?
   5. **In your code** — anchor to the reader (`me.md`) and, if `--anchor` was supplied, to real files in that repo. **Original examples only — never the book's.** Name one place the reader's own code already does this well, and one place it doesn't.
   6. **The red flag** — the smell that says you're violating this principle. One named flag, one sentence on how to spot it. Use the book's flag *names* as defined terms; describe them in your words.
   7. **Carry forward** — one line threading into the next chapter.
4. **Every chapter has at least one ASCII box-drawing diagram.** The idea is a picture before it is prose.
5. **Every abstract claim is followed by a concrete consequence.**
6. **No physical-world analogy as the primary anchor.** Reach for engineering the reader already knows (interfaces, layers, call stacks, the pipeline/agent work) first.
7. **No hedging, no marketing language, no slow on-ramps** (inherited from teacher.md).
8. **Paraphrase, never reproduce** (see COPYRIGHT above).
9. **The book has exactly 5 parts and 19 chapters** in the order the spec defines. Do not add chapters, do not collapse chapters, do not reorder Parts. Enumerating the topics/chapter order is fine (that's a fact about the book, not its expression); only the *expression* must be original.

## Step 6C — Create the directory structure

Create:

```bash
mkdir -p .aipe/read-aposd/part-1 .aipe/read-aposd/part-2 .aipe/read-aposd/part-3 .aipe/read-aposd/part-4 .aipe/read-aposd/part-5
```

## Step 7C — Generate front matter

`README.md` at the root — the through-line, the book map, how to read this guide, the "supplement not replace" note, where to get the book (it is also free to read on the author's site).

`00-front-matter.md` at the root — the through-line in full (the three complexity symptoms, the two causes, "deep modules with simple interfaces" as the weapon) plus a running example threaded through the chapters.

## Step 8C — Generate the 19 chapters in book order

Walk Part I through Part V, generating each chapter file with the seven-beat template:

```
part-1/
  01-complexity.md
  02-tactical-vs-strategic.md
part-2/
  03-deep-modules.md
  04-information-hiding.md
  05-general-purpose.md
  06-layers.md
  07-pull-complexity-down.md
  08-together-or-apart.md
part-3/
  09-errors-out-of-existence.md
  10-design-it-twice.md
part-4/
  11-why-comments.md
  12-comments-not-obvious.md
  13-names.md
  14-comments-first.md
  15-consistency.md
  16-obvious-code.md
part-5/
  17-trends-and-dogma.md
  18-performance.md
  19-conclusion-red-flags.md
```

Each chapter closes its through-line loop ("this reduces *cognitive load* by removing *obscurity*") and threads into the next chapter via the carry-forward line. The consolidated red-flags checklist lives in chapter 19.

If `--part <N>` was supplied, generate only that Part's chapters.

## Step 9C — Report + stop

Print:

```
✓ APOSD read guide created at .aipe/read-aposd/
  README.md
  00-front-matter.md
  part-1/  (2 chapters)
  part-2/  (6 chapters)
  part-3/  (2 chapters)
  part-4/  (6 chapters)
  part-5/  (3 chapters)
```

Then a 3–5 sentence summary: the through-line in one sentence, the part with the densest material for the reader given `me.md`, the running example used, and where the red-flags checklist lives (chapter 19).

**Stop. Wait for the user's next instruction.**

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: refresh stale takes without rewriting accurate ones. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/read-aposd/` and read `README.md`, `00-front-matter.md`, plus every chapter file across `part-1/` through `part-5/`. If `--part <N>` was supplied, scope to that Part only.

## Step 6U — Diff each chapter against the current loaded specs (and the optional --anchor repo)

Three diff sources to check per chapter:

- **Anchor drift** — when `--anchor` is set, file paths or examples in the "In your code" beat that have moved or stopped applying.
- **Template drift** — a chapter missing one of the seven beats, or missing a diagram, or with prose instead of a diagram in Block 3.
- **Voice drift** — sections that read like blog-post advice instead of the teacher's verdict-first / rank-what-matters voice. Hedging or marketing language that crept in.
- **Copyright drift** — any chapter that contains long quotes, paraphrases too close to the original, or reproduces a figure layout from the book. Mark for rewrite in original expression.

Output a structured change plan grouped by Part.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Edit only the sections identified. Preserve chapters that still hold; surgically edit the ones whose anchors moved or whose voice drifted. Append to each updated file:

```
---
Updated: <today's ISO date> — <one-line summary of what changed and why>
```

Do NOT add, collapse, or reorder chapters — the 19-chapter contract is fixed. Do NOT introduce quotes from the book.

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/read-aposd/
─────────────────────────────────────────────────
Chapters updated:     <list>
Chapters unchanged:   <count or list>
Anchor:               <repo path or "none — using me.md fallback">
```

**Stop. Wait for the user's next instruction.**
