---
name: study-software-design
description: Software design audit for this codebase — applies APOSD primitives (deep modules, info hiding, complexity, layering) to your real files
---

## Step 0 — Install repository guidance

Before continuing, ensure the target repository root `AGENTS.md` contains the `## AIPE learning workflow` section. Read the template at `${CODEX_PLUGIN_ROOT}/templates/AGENTS.md`. If `${CODEX_PLUGIN_ROOT}` is unset while running from a development clone, find `templates/AGENTS.md` by searching upward from this skill file. Resolve the repository root with `git rev-parse --show-toplevel`; if that is unavailable, use the current working directory. If `AGENTS.md` is absent, create it from the template. If it exists but does not contain the section heading, append a blank line and the template. If the section already exists, leave the file unchanged. Preserve all existing repository instructions.

The user invoked `/aipe:study-software-design`.

This command takes **no arguments**. There is one software-design guide per repo, saved at the fixed path `.aipe/study-software-design/`. `.aipe/` is per-repo; the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused study generator that audits the **current repo** through the design primitives in John Ousterhout's *A Philosophy of Software Design* — deep modules, information hiding, complexity, layering, readability — and produces per-concept findings grounded in real files: where the code honors each principle, where it violates it, and the specific move to fix it.

**Partition (no overlap with sibling specs):**
- `read-aposd.md` — LEARN the primitives (book style, abstract). The framework itself.
- `study-software-design.md` — APPLY the primitives to THIS repo. ← this command. Findings grounded in real files.
- `study-system-design.md` — SYSTEM architecture. A different altitude (services, boundaries, scaling), not module/interface-level design.

When both `study-software-design/` and `study-system-design/` seem to want the same finding, the rule is altitude: module/interface/complexity goes here; service/architecture goes in system-design; reusable algorithm teaching goes in dsa-foundations. A concept here teaches the primitive *briefly* and spends its weight on the codebase findings — for the full conceptual treatment, cross-reference the matching `read-aposd` chapter rather than re-teaching it.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-software-design.`
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

## Step 3 — Load the template chain

Software design reads four files in order — structure, writer persona, reader calibration, then the spec itself:

```
${CODEX_PLUGIN_ROOT}/specs/format.md
${CODEX_PLUGIN_ROOT}/specs/teacher.md
${CODEX_PLUGIN_ROOT}/specs/me.md
${CODEX_PLUGIN_ROOT}/specs/study-software-design.md
```

If `${CODEX_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

Also check for an existing `.aipe/read-aposd/` guide in this repo. When present, cross-reference its chapters in `See also` blocks rather than re-teaching the primitives.

What each file supplies:
- **`format.md`** — the concept-file template, house-style traits, diagram rules, pseudocode rules, hard rules. **Per format.md, the concept-file blocks are:** Subtitle → Zoom out, then zoom in → Structure pass (axes / seams / layered decomposition) → How it works → Primary diagram → Implementation in codebase → Elaborate → Interview defense → Validate → See also. Where legacy template sections in any loaded spec body conflict with format.md, format.md wins.
- **`teacher.md`** — the writer persona, used in **teacher posture** (the default — no shift). General software design is the staff-engineer's home turf; inherit the banned list (hedging, marketing language, slow on-ramps, physical-world analogies as primary anchor) and the verdict-first / rank-what-matters trait.
- **`me.md`** — reader-side calibration: voice register, example anchoring, what the reader already knows.
- **`study-software-design.md`** — the topic (which primitives are concepts), the anchoring rules (every finding cites file + line range), the honest-assessment rules (when a principle doesn't apply to this codebase, name that — don't fabricate a finding).

Precedence when the files overlap: format.md wins on **structure**; teacher.md wins on **voice register**; me.md wins on **calibration**.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-software-design/` already contains the guide. The signal is the presence of `00-overview.md`, `audit.md`, or any concept file matching `0[1-9]-*.md`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

Also check for the **legacy fixed-file-list layout** — files named after the 8 audit lenses: `01-complexity-in-this-codebase.md`, `02-deep-vs-shallow-modules.md`, `03-information-hiding-and-leakage.md`, `04-layers-and-abstractions.md`, `05-pull-complexity-downward.md`, `06-errors-and-special-cases.md`, `07-readability.md`, `08-red-flags-audit.md`. Older runs produced one file per lens; the current shape consolidates the lens walk into a single `audit.md` and reserves numbered files for discovered patterns (`me.md` → AUDIT-STYLE GENERATORS). If any of these lens-named files exist, flag them in the plan and ask whether to (a) fold their content into a regenerated `audit.md` and break out true Pass-2 pattern files, or (b) leave them in place as an archive. Do not silently rewrite or delete them.

---

# CREATE MODE

Runs only when no existing guide is found.

## Step 5C — Audit pass (read-only)

Before writing any file, walk the codebase as an auditor: identify deep vs shallow modules, locate information leaks, find layers that mix abstraction levels, spot pulled-up complexity, locate special-case handling, scan readability hotspots. Build an inventory of findings, each anchored to `file:line` ranges.

This is the heavy work of the spec — the conceptual teaching is brief; the codebase findings are the substance. **No vague claims.** Every "this module is shallow" needs a file path and a line range.

## Step 6C — Plan the guide

The non-negotiables from `format.md` (structure), `teacher.md` (voice), `me.md` (calibration), and this spec (topic):

1. **All structural rules from `format.md` apply** — the per-concept blocks (Subtitle, Zoom out / then zoom in with the LAYERS diagram, Structure pass, How it works, Primary diagram, Implementation in codebase, Elaborate, Interview defense, Validate, See also). Formatting rules and box-drawing diagram chars.
2. **Implementation in codebase is the heavy block** — this is the audit. Real files, real line ranges, deep vs shallow examples, the red flag firing or not, and the fix. Every finding cites `**File:**` + `**Function / class:**` + `**Line range:**`. **Never drop a raw block without annotation.**
3. **Teach the primitive briefly; cross-reference for depth.** In How it works, give the principle in one or two sentences (verdict-first), draw the shape (deep vs shallow module, leak across a boundary, a layer stack), then point at the matching `read-aposd` chapter for the conceptual treatment. **Don't restate what read-aposd already teaches.**
4. **Honest assessment.** Name what the principle would look like in this codebase. If a principle doesn't apply (e.g., a one-file app has no layers to evaluate), say so plainly in `In this codebase` — don't fabricate a finding. The guide's credibility is the willingness to say "not applicable here, and here's why."
5. **Copyright respect.** Teach the ideas in original words; never reproduce the book's prose. Quote a defined term only (a red flag's name), under ~15 words, and only when naming it; paraphrase everything else. The value here is the findings about *your* code, which are original by construction.
6. **No project names in generated output except the studied repo.** Every "In this codebase" reference is about this repo only.

## Step 7C — Create the directory and generate the guide

Follow the two-pass shape defined in `specs/me.md` → AUDIT-STYLE GENERATORS and the lens inventory in `specs/study-software-design.md`.

Create:

```bash
mkdir -p .aipe/study-software-design
```

Generate the following (flat — no subdirectories):

```
README.md                          map + through-line + book/source note + reading order
00-overview.md                     master summary + the three highest-cost hotspots
audit.md                           Pass 1 — the 8-lens audit walking each AOSD primitive
01-<discovered-pattern>.md         Pass 2 — discovered design moves the repo makes deliberately,
02-<discovered-pattern>.md                   named after the pattern (kebab-case), one per pattern,
0N-<discovered-pattern>.md                   3-8 files for a typical repo
```

**Pass 1 (`audit.md`)** walks all 8 lenses from the spec, each as one `##` section. Each lens names what the codebase actually does with `file:line` grounding, or `not yet exercised` honestly. The capstone lens (`red-flags-audit`) consolidates the AOSD red-flag checklist. When a finding is significant enough to have its own pattern file, the lens cross-links to it rather than restating the deep walk.

**Pass 2 (discovered-pattern files)** uses the full `format.md` per-concept template. The auditing emphasis lands in Block 6 (Implementation in codebase) — real `file:line` references, the red flag's name when it fires, and the specific fix (what to fold in / hide / rename / re-layer). Pattern file names come from the repo, not from the lens inventory — see `me.md` → AUDIT-STYLE GENERATORS → "What earns its own pattern file" for the discovery rules.

## Step 8C — Generate `00-overview.md`

The audit at a glance: the codebase's complexity profile (where the symptoms cluster), the three highest-cost hotspots (with file paths), and a one-line verdict per primitive ("modules are mostly deep / the one shallow class is X" / "layers are clean / the X / Y boundary leaks"). The reader who reads only the overview gets the punch list. Cross-link to `audit.md` for the full lens walk and to each Pass 2 file for the deep walks.

## Step 9C — Report + stop

Print:

```
✓ Software design audit created at .aipe/study-software-design/
  README.md
  00-overview.md             (3 hotspots named)
  audit.md                   (8 lenses; <N> red flags firing)
  01-<pattern>.md            (Pass 2 — discovered design move)
  ...
  0N-<pattern>.md
```

Then a 3–5 sentence summary: the codebase's dominant complexity pattern, the single highest-leverage fix (the change that reduces the most complexity for the least work), and any primitive that's mostly `not yet exercised` (so the reader knows the audit said so honestly). Name the Pass 2 file list explicitly so the user sees what patterns the repo earned dedicated files for.

**Stop. Wait for the user's next instruction.**

---

# UPDATE MODE

Runs when Step 4 found an existing guide. Goal: re-audit against the current codebase without rewriting findings that still hold. **Do NOT regenerate from scratch.**

## Step 5U — Read the existing guide

Walk `.aipe/study-software-design/` and read every file (`README.md`, `00-overview.md`, `audit.md`, and each Pass 2 pattern file). If the legacy fixed-file-list layout is present (per Step 4 check), include those files in the walk as the source material to be folded into the regenerated `audit.md`.

## Step 6U — Re-audit and diff against the current codebase AND the loaded templates

Follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE.

Diff sources:

- **Codebase drift** — findings that no longer hold (the shallow module got folded in; the leak was sealed), file paths that moved, new findings the original audit missed because the code has grown, and new design moves that now earn their own Pass 2 pattern file.
- **Template drift** — `format.md` has added blocks (Structure pass was added in v1.50.0; check that older files have it).
- **Cross-reference drift** — pointers to `read-aposd` chapters that moved or renamed.
- **Pattern drift** — Pass 2 pattern files for moves the repo no longer makes; missing files for moves the repo grew.

Output a structured change plan: `audit.md` regenerated (full diff against current evidence), pattern files added / updated / removed, with reasons per change.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation** before editing any files. Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Regenerate `audit.md` against current evidence. Add new Pass 2 pattern files for newly-load-bearing design moves. Update existing pattern files where the implementation changed. Remove pattern files only when the design move is genuinely gone from the codebase (not just refactored). Append to each updated file:

```
---
Updated: <today's ISO date> — <one-line summary of what changed>
```

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-software-design/
─────────────────────────────────────────────────
Files updated:        <list>
Findings added:       <count>
Findings removed:     <count, with one-line reason each>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
