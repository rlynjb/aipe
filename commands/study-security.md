---
description: Security audit for this codebase — trust boundaries, auth, input validation, secrets, data exposure, dependencies, LLM/agent security
---

The user invoked `/aipe:study-security`.

This command takes **no arguments**. There is one security guide per repo, saved at the fixed path `.aipe/study-security/`. `.aipe/` is per-repo; the folder name is fixed across repos because it names the *topic*, not the codebase. Re-running enters UPDATE MODE on the existing directory.

This command produces a topic-focused study generator that audits the **current repo** for security: trust boundaries, who's allowed to do what, where untrusted input is trusted, what's exposed, what dependencies drag in. Per-concept findings are grounded in real files — where the code is safe, where it isn't, the specific fix.

**Partition (no overlap with sibling specs):**
- `study-security` — the **trust axis** as a discipline: what can each side see, reach, or tamper with? ← this command.
- `study-system-design` — architecture & scale (NOT threat modeling).
- `study-software-design` — complexity & interfaces (NOT trust).
- `study-data-modeling` — schema shape; "*how data is structured*" — versus "who may read/write and how that's enforced," which lives here.

This is `format.md`'s structure-pass **trust axis** made into a full audit. Through-line: every input is hostile until proven otherwise; every boundary either enforces a trust decision or leaks one.

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

3. Print: `✓ Scaffolded .aipe/. Edit .aipe/project/context.md, then re-run /aipe:study-security.`
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

Security reads four files in order — structure, writer persona, reader calibration, then the spec itself:

```
${CLAUDE_PLUGIN_ROOT}/specs/format.md
${CLAUDE_PLUGIN_ROOT}/specs/teacher.md
${CLAUDE_PLUGIN_ROOT}/specs/me.md
${CLAUDE_PLUGIN_ROOT}/specs/study-security.md
```

If `${CLAUDE_PLUGIN_ROOT}` is unset (running from a dev clone), fall back to searching for each upward from this file's location.

What each file supplies:
- **`format.md`** — the concept-file template, house-style traits, diagram rules, pseudocode rules, hard rules. The 11-block per-concept structure (Subtitle → Zoom out → Structure pass → How it works → Primary diagram → Implementation in codebase → Elaborate → Interview defense → Validate → See also; AI/ML adds Project exercises).
- **`teacher.md`** — writer persona in **teacher posture** — same staff engineer, security-literate. Inherit the banned list and the verdict-first / rank-what-matters trait.
- **`me.md`** — reader calibration: voice register, example anchoring, what the reader already knows.
- **`study-security.md`** — the topic (which security primitives are concepts), the anchoring rules (every finding cites file + line range), the honest-assessment rules.

Precedence when they conflict: format.md wins on **structure**; teacher.md wins on **voice register**; me.md wins on **calibration**.

## Step 4 — Detect existing guide → branch CREATE or UPDATE

Check whether `.aipe/study-security/` already contains the guide. The signal is the presence of `00-overview.md`, `audit.md`, or any concept file matching `0[1-9]-*.md`.

- **Existing guide found** → go to UPDATE MODE (Step 5U onward). **Do NOT regenerate from scratch.**
- **No existing guide** → go to CREATE MODE (Step 5C onward).

Also check for the **legacy fixed-file-list layout** — files named after the 8 audit lenses: `01-trust-boundaries-and-attack-surface.md`, `02-authentication-and-authorization.md`, `03-input-validation-and-injection.md`, `04-secrets-and-configuration.md`, `05-data-exposure-and-privacy.md`, `06-dependencies-and-supply-chain.md`, `07-llm-and-agent-security.md`, `08-security-red-flags-audit.md`. Older runs produced one file per lens; the current shape consolidates the lens walk into a single `audit.md` and reserves numbered files for discovered patterns (`me.md` → AUDIT-STYLE GENERATORS). If any of these lens-named files exist, flag them in the plan and ask whether to (a) fold their content into a regenerated `audit.md` and break out true Pass-2 pattern files, or (b) leave them in place as an archive. Do not silently rewrite or delete them.

---

# CREATE MODE

## Step 5C — Audit pass (read-only)

Walk the codebase as a security auditor. For each concept below, identify trust boundaries, locate where input crosses them, find secret-leak surfaces, scan dependency risks. Build an inventory of findings, each anchored to `file:line` ranges.

This is the heavy work — the conceptual teaching is brief; the findings are the substance. **No vague claims.** Every "this is exposed" needs a file path and a line range.

## Step 6C — Plan the guide

The non-negotiables from `format.md` (structure), `teacher.md` (voice), `me.md` (calibration), and this spec (topic):

1. **All structural rules from `format.md` apply** — the 11-block per-concept template, formatting rules, box-drawing diagram chars.
2. **Implementation in codebase is the heavy block** — this is the audit. Real files, real line ranges, where each trust decision lives, where each boundary is enforced or leaks, the specific fix. Every finding cites `**File:**` + `**Function / class:**` + `**Line range:**`.
3. **Teach the primitive briefly; spend weight on findings.** In How it works, give the principle in 1–2 sentences (verdict-first), draw the shape (trust boundary, the data flow across it). Don't re-teach what general security texts cover.
4. **Honest assessment.** Name what the principle would look like in this codebase. If a primitive doesn't apply (e.g., a static site has no auth surface), say so plainly — don't fabricate a finding.
5. **Trust axis as the through-line.** Every concept ties back to "what can each side see, reach, or tamper with?" — a finding that doesn't shift a trust answer probably belongs in a sibling spec.
6. **No project names in generated output except the studied repo.**

## Step 7C — Create the directory and generate the guide

Follow the two-pass shape defined in `specs/me.md` → AUDIT-STYLE GENERATORS and the lens inventory in `specs/study-security.md`.

Create:

```bash
mkdir -p .aipe/study-security
```

Generate the following (flat — no subdirectories):

```
README.md                          map + through-line (trace the trust axis) + reading order
00-overview.md                     master summary + the three highest-risk findings
audit.md                           Pass 1 — the 8-lens audit walking each trust-axis lens
01-<discovered-pattern>.md         Pass 2 — discovered security controls the repo actually exercises,
02-<discovered-pattern>.md                   named after the control (kebab-case), one per control,
0N-<discovered-pattern>.md                   3-8 files for a typical repo
```

**Pass 1 (`audit.md`)** walks all 8 lenses from the spec, each as one `##` section. Each lens names what the codebase actually does with `file:line` grounding, or `not yet exercised` honestly. The `07-llm-and-agent-security` lens emits `not yet exercised` for repos without LLM/agent surface. The capstone lens (`security-red-flags-audit`) consolidates the red-flag checklist. When a finding is significant enough to have its own pattern file, the lens cross-links to it rather than restating the deep walk.

**Pass 2 (discovered-pattern files)** uses the full `format.md` per-concept template. The auditing emphasis lands in Block 6 (Implementation in codebase) — real `file:line` references, the trust assumption named, whether it holds, and the specific fix. Pattern file names come from the repo, not from the lens inventory — see `me.md` → AUDIT-STYLE GENERATORS → "What earns its own pattern file" for the discovery rules.

## Step 8C — Generate `00-overview.md`

The audit at a glance: the codebase's trust map (a layers-and-hops diagram of boundaries), the three highest-risk findings (with file paths), and a one-line verdict per primitive ("auth is JWT-with-refresh / boundaries enforced server-side" / "secrets live in env vars; no rotation policy"). The reader who reads only the overview gets the punch list. Cross-link to `audit.md` for the full lens walk and to each Pass 2 file for the deep walks.

## Step 9C — Report + stop

Print:

```
✓ Security audit created at .aipe/study-security/
  README.md
  00-overview.md             (3 highest-risk findings named)
  audit.md                   (8 lenses; <N> red flags firing)
  01-<pattern>.md            (Pass 2 — discovered security control)
  ...
  0N-<pattern>.md
```

Then a 3–5 sentence summary: the trust map's most exposed boundary, the single highest-leverage fix, any primitive that's mostly `not yet exercised` for this repo. Name the Pass 2 file list explicitly so the user sees what controls the repo earned dedicated files for.

**Stop. Wait for the user's next instruction.**

---

# UPDATE MODE

## Step 5U — Read the existing guide

Walk `.aipe/study-security/` and read every file (`README.md`, `00-overview.md`, `audit.md`, and each Pass 2 pattern file). If the legacy fixed-file-list layout is present (per Step 4 check), include those files in the walk as the source material to be folded into the regenerated `audit.md`.

## Step 6U — Re-audit and diff

Follow the rules in `me.md` → AUDIT-STYLE GENERATORS → On UPDATE.

Diff sources:
- **Codebase drift** — findings that no longer hold (the leak was sealed; the auth check was added), file paths that moved, new findings the original audit missed, and new security controls that now earn their own Pass 2 pattern file.
- **Template drift** — `format.md` has added blocks since the file was written; check that older files have them.
- **Cross-reference drift** — pointers to sibling guides (study-software-design, study-data-modeling) that moved or renamed.
- **Pattern drift** — Pass 2 pattern files for controls the repo no longer enforces; missing files for controls the repo added.

Output a structured change plan: `audit.md` regenerated (full diff against current evidence), pattern files added / updated / removed, with reasons per change.

## Step 7U — Output the plan and STOP for confirmation

Print the change plan. **Wait for user confirmation.** Do NOT auto-apply.

## Step 8U — Apply changes (after user confirms)

Regenerate `audit.md` against current evidence. Add new Pass 2 pattern files for newly-load-bearing security controls. Update existing pattern files where the implementation changed. Remove pattern files only when the control is genuinely gone from the codebase (not just refactored). Append:

```
---
Updated: <today's ISO date> — <one-line summary of what changed>
```

## Step 9U — Report + stop

Print:

```
Update complete for .aipe/study-security/
─────────────────────────────────────────────────
Files updated:        <list>
Findings added:       <count>
Findings removed:     <count, with one-line reason each>
Files unchanged:      <count or list>
```

**Stop. Wait for the user's next instruction.**
