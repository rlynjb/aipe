# Prompt engineering as a discipline

**Industry name(s):** Prompt engineering, prompt design, prompt programming, structured prompting
**Type:** Industry standard

> Treating prompts as production code — versioned, reviewed, tested, and refined the same way a function is. This is the concept aipe literally encodes.

**See also:** → [08-provider-agnostic-chains](08-provider-agnostic-chains.md) · → [10-single-purpose-chains](10-single-purpose-chains.md) · → [01-template-source-of-truth](../01-system-design/01-template-source-of-truth.md)

---

## Why care

You've seen two engineers at the same company build "the same" LLM-powered feature, one of them ships in a week and ships well, the other ships in three weeks and ships flaky. The difference isn't the model; it's the discipline. One writes prompts the way they write code (version-controlled, structured, repeated patterns named, edge cases enumerated); the other writes prompts the way they send Slack messages (off-the-cuff, hoping for the best).

The pattern is *treating prompts as first-class engineering artifacts*. Code reviewers review them. Version control tracks them. Tests verify them. Style guides constrain them. Same shape as the move from "ad-hoc SQL queries scattered in code" to "ORMs and migration files" (mid-2000s), or from "configuration as string concatenation" to "schema-validated YAML" (2010s). The trick is to recognise that the work of *crafting* a prompt is engineering work, not creative writing — and to build the discipline to match.

This is the load-bearing concept for aipe. Every other concept in this study guide is supporting evidence; this one is what aipe IS.

---

## How it works

A workshop with named tools, not a kitchen with whatever's at hand.

### What makes a prompt "engineered" vs "improvised"

An engineered prompt has:

- **Explicit structure.** Sections with named purposes, not free-flowing paragraphs.
- **Variable contracts.** Inputs declared (`{user_intent}`), outputs specified (`return a markdown spec with the following sections...`).
- **Edge cases enumerated.** What if input is empty? What if context is incomplete? What if the user's request is out of scope?
- **Reuse across instances.** The same prompt shape backs multiple invocations; you can read 11 of them and recognise the family.
- **Version control + review.** Changes go through PR review; old versions are recoverable.

An improvised prompt has none of these. It's one paragraph the author wrote once, copy-pasted into a function, and never revisited.

### What aipe encodes

Every `specs/<type>.md` template in aipe is an engineered prompt. The discipline shows up at several layers:

**1. Per-spec-type contract.** Every template follows the same 8-step shape (Step 1 scaffold → Step 2 load context → Step 3 load template → Step 4 detect → CREATE/UPDATE → STOP). A reader who learns one template learns the shape of all 11.

**2. Named sections per template.** `specs/study.md` has 11 required per-concept sections (Why care, How it works, diagram, In this codebase, Elaborate, Tradeoffs, Tech reference, Project exercises, Summary, Interview defense, Validate). Each section has sub-rules. The structure is verifiable — `commands/study.md` Step 6U has ~30 flags for structural drift.

**3. Variable contracts.** `specs/feature.md` declares `$ARGUMENTS` as the user's intent; the wrapper validates it's non-empty before proceeding. `specs/study.md` declares the curriculum file resolution flow with explicit branches on candidate count.

**4. Edge cases enumerated.** `commands/<type>.md` Step 1 handles "no context file"; Step 4 handles "existing spec"; Step 7U handles "user confirms scope." Each branch is named, not implicit.

**5. Reuse.** The 11 templates share the 8-step skeleton; the templates' per-section structure is documented in the `study.md` non-negotiables; the placeholder `context.md` body is identical across all wrappers.

**6. Version control + review.** `specs/<type>.md` lives in git; changes go through PR review; old versions are visible via `git log`. The plugin's own update mechanism is built around the assumption that prompts evolve and that evolution must be reviewable.

If you're coming from frontend, this is the difference between writing a React component as a one-off and writing it as part of a design system. The design system is the discipline; the one-off is improvisation. Aipe is a design system *for prompts*.

### Move 2.5 — Phase A: discipline-by-template (today) / Phase B: discipline-by-style-guide

**Phase A — today.** aipe encodes prompt engineering discipline through the 11 templates themselves. A user who runs `/aipe:feature` learns by example: the generated spec follows a known shape, with sections in a known order, with sub-rules a reader can articulate. The user doesn't read a separate style guide; the template *is* the style guide.

**Phase B — Build item B1.7.** The curriculum's B1.7 anchors to aipe: "ship `template-style-guide.md` documenting prompt engineering principles in your 11 templates." This is a *meta* artifact — a document that names the principles the templates already follow, so the discipline can be articulated, defended, and taught.

The Phase A → Phase B transition is the move from "the discipline is implicit in the artifact" to "the discipline is explicit AND in the artifact." What doesn't have to change between phases: the templates themselves — they already encode the discipline. What earns its place in Phase B: the meta-document that lets someone defend the templates in an interview without first reading all 11.

### The principle — prompts are code

If a prompt is going into production (or into a tool that goes into production), treat it as code. Version control it. Review it. Test it. Refactor it when it grows past 100 lines. Extract repeated patterns into shared templates. The discipline isn't optional; it's the difference between a flaky LLM feature and a reliable one.

The full picture is below.

---

## Prompt engineering as a discipline — diagram

```
The aipe encoding

┌─ Improvised prompts (the failure mode) ──────────────────────────────────┐
│                                                                          │
│   const prompt = `Generate a feature spec for: ${intent}`;               │
│                                                                          │
│   - one line, no structure                                               │
│   - no variable contract                                                 │
│   - no edge cases                                                        │
│   - no reuse                                                             │
│   - not version-controlled separately                                    │
│   - "ships when it ships"                                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────-┘

┌─ Engineered prompts (the aipe shape) ────────────────────────────────────┐
│                                                                          │
│   specs/feature.md  (the canonical template, ~1.5 KB)                    │
│                                                                          │
│   - explicit structure (sections with named purposes)                    │
│   - declared inputs ($ARGUMENTS, .aipe/project/context.md)               │
│   - declared output (markdown spec with N required sections)             │
│   - edge cases (empty $ARGUMENTS, missing context.md, existing spec)     │
│   - reused across all 11 spec types via the 8-step contract              │
│   - version-controlled; PR-reviewed; updateable via UPDATE-mode          │
│                                                                          │
│   commands/feature.md  (the wrapper, ~3 KB)                              │
│   skills/feature/SKILL.md  (the Codex mirror, ~3 KB)                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────-┘

  The discipline lives in:
   • the 8-step contract (every wrapper)
   • the per-section structure (every template)
   • the 22-flag taxonomy in Step 6U of commands/study.md (Diff B)
   • the mirror discipline (cp + sed for Claude → Codex)
   • the lockstep version bumps (both manifests, every release)
```

---

## In this codebase

**This is the load-bearing case for aipe.** Every artifact in the repo is shaped by this concept.

- **Templates (`specs/<type>.md`):** 11 engineered prompts. Each follows a discipline of explicit structure, variable contracts, edge cases.
- **Wrappers (`commands/<type>.md`, `skills/<type>/SKILL.md`):** the 8-step contract from [02-per-spec-type-contract](../01-system-design/02-per-spec-type-contract.md) IS the prompt-engineering discipline applied at the contract layer.
- **The mirror discipline** ([01-template-source-of-truth](../01-system-design/01-template-source-of-truth.md)): keeps two wrappers byte-identical, preventing drift between Claude and Codex surfaces.
- **The two-diff UPDATE mode** ([05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md)): treats template structure as a versioned schema; specs are lifted from older template versions to newer ones via named flag taxonomies.

**Phase A (today) vs Phase B (after B1.7):**
- Phase A: the discipline is implicit in the artifacts. A reader sees the shape by reading any template.
- Phase B: the discipline is named in `template-style-guide.md` — what principles drove each section's shape, what costs were paid, what alternatives were considered. B1.7 is the curriculum's aipe-anchored proof artifact.

**Currently:** Phase A is shipped. Phase B is not — `template-style-guide.md` does not exist in the repo.

---

## Elaborate

### Where this pattern comes from

Prompt engineering as a named discipline emerged in 2022–2023 as LLMs became production tools. Anthropic's "Constitutional AI" paper (2022) named the structured-prompting approach; OpenAI's "Cookbook" (2023+) collected prompt recipes; DSPy (Stanford, 2023) formalised prompt-as-code with composable modules. The "prompts as engineering artifacts" framing is the consensus today; the disagreement is *how much* discipline (DSPy-level structure vs ad-hoc-with-conventions).

### The deeper principle

If a prompt is in production, treat it like code. The discipline (version control, review, tests, style guide, refactoring) compounds: each layer makes the next one easier to apply. Without discipline, every prompt is a fresh problem; with discipline, the next prompt inherits everything you learned from the last.

### Where this breaks down

When the discipline becomes a cage. If the per-spec-type contract is too rigid to express a new spec type's actual needs (say, a streaming output type), the contract has to bend. The fix is rarely to break the contract for one type — it's to expand the contract's hooks. Breaking discipline for one outlier is the start of erosion.

### What to explore next

- [08-provider-agnostic-chains](08-provider-agnostic-chains.md) → how discipline shows up in cross-provider prompts
- [10-single-purpose-chains](10-single-purpose-chains.md) → why single-purpose prompts are more disciplined than agent loops
- DSPy (Stanford) — the most-structured prompt-engineering framework
- Anthropic's "Building effective agents" — Anthropic's framing of the discipline

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Disciplined prompts      │ Improvised prompts          │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Up-front cost    │ Design templates,         │ Write a string, ship       │
│                  │ specify sections,         │                            │
│                  │ enumerate edges; days     │ minutes                    │
│ Per-instance      │ Near-zero (template      │ Same minutes every time;   │
│   cost           │ does the work)            │ no compounding              │
│ Reliability      │ ~95% — structure forces  │ ~70–80% — depends on the   │
│                  │ the model to comply       │ mood of one paragraph      │
│ Edit cost        │ Edit template once,      │ Edit every call site;       │
│                  │ all instances update      │ drift across instances     │
│ Onboarding       │ "Read the templates;     │ "Read the call sites; you  │
│                  │ here's the discipline"    │ figure it out"             │
│ Debugging        │ "Section X is wrong" —   │ "The prompt is wrong" —    │
│                  │ specific                 │ where exactly?              │
│ Failure blast    │ Discipline breach        │ One-off prompts breach     │
│                  │ visible in PR diff       │ unspoken conventions       │
│                  │                          │ silently                    │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe spent considerable up-front cost building the discipline. `commands/study.md` is 138 KB — most of which is the structural-rule machinery from non-negotiables 1–20. Every template's Step 6U flag taxonomy is the discipline expressed as enforcement.

The cost is felt every release. A new template version means updating the canonical-section list, adding flags to Step 6U if the change is structural, adding repair recipes to Step 8U. Roughly 30–60 minutes per template-version release. That cost is constant; it doesn't go away.

The cost is also felt in onboarding. A new contributor reading `commands/study.md` for the first time faces 138 KB of structure. They have to internalise the 8-step contract, the 11 required per-concept sections, the ~30 structural-gap flags. ~2 hours of reading before they can confidently edit anything.

### Sub-block 2 — what the alternative would have cost

Improvised prompts would have meant: each `/aipe:<type>` had its own opinion about structure. A user running `/aipe:feature` would get one shape; `/aipe:debugging` would get a different shape; `/aipe:study` would get a third. Users couldn't transfer mental models across commands. Contributors couldn't reuse machinery across templates. Drift would accumulate every release.

The improvised path would also have made the two-diff UPDATE mode impossible. Diff B works because the templates have a known canonical shape — without a canonical shape, "the template added a section" isn't a detectable event. The UPDATE-mode-preserves-edits property is downstream of the discipline.

### Sub-block 3 — the breakpoint

Fine until a spec type genuinely doesn't fit the 8-step contract. If a streaming-output spec type emerges (e.g., `/aipe:research` that needs to interleave research and writing), the contract has to bend. The fix is to expand the contract's hooks — add an optional Step 4.5 for streaming-flow types — rather than break the contract for one outlier. The breakpoint is "user-flow divergence," not file count.

A second breakpoint: when the discipline outpaces the contributor base's ability to maintain it. At a flag count of ~50 in Step 6U, the wrapper exceeds ~200 KB and reviewers can't reliably eyeball the diff. The fix at that scale is to extract the discipline into a structured file (`specs/<type>-update-flags.yaml`) — keeping the wrappers reviewable while preserving the discipline.

---

## Tech reference (industry pairing)

### Prompt-engineering frameworks

- **Codebase uses:** plain markdown. No framework. The discipline is encoded in the templates' structure, not in a runtime library.
- **Why it's here:** the consumer is a host LLM agent that reads markdown directly. Adding a framework would mean adding a runtime layer between the wrapper and the agent.
- **Leading today:** plain-markdown prompts — `adoption-leading` for agent-plugin systems, 2026.
- **Why it leads:** zero runtime cost, every host agent parses markdown natively, prompts are human-readable, version control is git.
- **Runner-up:** DSPy — `innovation-leading` for systems where prompts are composable program modules. Stronger discipline; pulls in a Python runtime.

### Prompt versioning

- **Codebase uses:** git for version control; `version` in `plugin.json`; per-spec-type history in `git log`.
- **Why it's here:** treats prompts as artifacts that evolve across releases.
- **Leading today:** git — `adoption-leading` for prompt versioning, 2026.
- **Why it leads:** same tool as code versioning; diffs are reviewable; rollback is one command.
- **Runner-up:** prompt-registry services (e.g., PromptHub, Langfuse prompts) — `innovation-leading` for teams with many prompts and non-engineer authors; pulls in a hosted service.

---

## Project exercises

### [B1.7] Ship `template-style-guide.md`

- **Exercise ID:** `[B1.7]` — verbatim from curriculum.
- **What to build:** A markdown document at `aipe/template-style-guide.md` (or `aipe/docs/template-style-guide.md`) that names the prompt-engineering principles encoded in the 11 templates. Sections to cover: the 8-step contract, why per-spec-type templates instead of one dispatcher, why markdown over a framework, why the two-diff UPDATE mode, why the byte-identical mirror, why STOP at every key gate. Each principle should reference the template(s) where it's exercised.
- **Why it earns its place:** Phase A (the discipline lives in the templates) is the *implementation*; Phase B (the style guide) is the *defense*. Without the style guide, defending aipe in an interview means asking the listener to read 138 KB of `commands/study.md`. With it, the defense is one page.
- **Files to touch:** `aipe/template-style-guide.md` (new file). Optionally a link from `README.md` to the new document. No template changes — the style guide describes existing structure.
- **Done when:** the file exists at `aipe/template-style-guide.md`, names every principle in non-negotiables 1–20 of `specs/study.md`, references the wrappers/templates where each principle is exercised, and is linked from `README.md`. A reviewer who reads only the style guide should be able to answer "why does aipe look the way it does?" without opening any wrapper.
- **Estimated effort:** `1–2 days`. Reading + extraction is half; structuring + writing the defense is the other half.

The exercise exists because the discipline is currently implicit. Phase B makes it explicit, which makes it teachable, defensible, and (most importantly) auditable when the next template-version change tempts the maintainer to relax a rule.

---

## Summary

Prompt engineering as a discipline is the move from improvised prompts ("write a string, ship") to engineered prompts ("structure, contract, edge cases, reuse, version control, review"). This is the load-bearing concept for aipe — every template, every wrapper, every UPDATE-mode flag is an instance of the discipline. Phase A (today): the discipline is implicit in the artifacts. Phase B (B1.7): a `template-style-guide.md` names the principles explicitly. The constraint that drove this: aipe ships prompts to thousands of host-agent sessions; quality has to be the floor, not the average. The cost being paid: ~138 KB of wrapper machinery and ~30 min/release of discipline maintenance.

- aipe IS the discipline applied to spec generation; templates, wrappers, UPDATE-mode are all instances.
- The 8-step contract, the 11 required per-concept sections, the ~30 Diff B flags are the discipline encoded.
- Phase A: discipline implicit in templates. Phase B (B1.7): discipline named in `template-style-guide.md`.
- The discipline pays off in compounding reliability and onboarding clarity; costs in up-front design.
- The breakpoint is "user-flow divergence" — when one spec type genuinely doesn't fit the contract.

---

## Interview defense

### What an interviewer is really asking

"What is aipe?" or "Why prompts as code?" — the dodge is to call aipe a "prompt template library." The senior answer names the discipline: aipe IS prompt engineering applied to spec generation, with the 8-step contract, the per-section structure, the two-diff UPDATE mode, and the mirror discipline as the load-bearing expressions.

### Likely questions

**Q [mid]:** What does it mean to treat a prompt as code?

**A:** It means: version control it; review changes; track its evolution; refactor when patterns repeat; enumerate edge cases explicitly; reuse across instances. For aipe, that's: 11 templates in `specs/`, two wrappers per template kept byte-identical, the 8-step contract reused across all of them, an UPDATE mode that lifts old specs to current template structure. The prompts aren't strings in a function — they're versioned artifacts in `specs/<type>.md`.

```
Improvised             Engineered (aipe shape)
────────────           ──────────────────────────
"Generate a feature    specs/feature.md (template)
spec for {intent}"     commands/feature.md (wrapper)
   │                   skills/feature/SKILL.md (mirror)
1 line, 1 author          │
                       11 templates × 2 wrappers = 33 artifacts
                       all version-controlled,
                       PR-reviewed, refactored together
```

**Q [senior]:** Why didn't you write all 11 templates with the same content and one dispatcher?

**A:** Two reasons. First, the 11 templates do *different work* — the feature template prompts for a feature spec; the debugging template prompts for a debug spec; the study template generates a 65-file directory. The shape is different per template even though the wrapper contract is the same. Second, the per-template-as-slash-command shape gives users tab-complete discoverability — type `/aipe:` and see all 11 options. Under a dispatcher, the surface would be one row in the slash-command picker; users would have to memorise the 11 sub-types.

```
Per-template (today)              One dispatcher (alternative)
───────────────────              ─────────────────────────
/aipe:feature ...                /aipe <type> <intent>
/aipe:debugging ...                 │
/aipe:study                          ▼
... 11 separate commands          one slash command; user types
                                  the sub-type as an argument
                                  ─ loses tab-complete surface ─
```

**Q [arch]:** What's the failure mode of disciplined prompts at scale?

**A:** When the discipline becomes a cage. If a new spec type genuinely doesn't fit the 8-step contract, the right move isn't to break the contract for one outlier — it's to add a hook to the contract that all 11 types can opt into. The discipline's strength is enforcement; its weakness is the cost of changing the contract once it has 11 templates following it. Each contract change touches 11 templates + 22 wrappers + the canonical-section docs. That's the breakpoint where you'd start to question the discipline — and the answer is usually "still worth it, but plan the contract change carefully."

```
Adding a new contract step           Adding a per-type carve-out
─────────────────────────             ─────────────────────────
edit 11 templates                     edit 1 template
edit 22 wrappers                      ─ contract erodes ─
edit canonical docs                   ─ next new type follows the
mirror discipline runs                  carve-out instead of contract ─
─ slow but principled ─               ─ fast and seductive ─
```

### The question candidates always dodge

**Q:** Why is `commands/study.md` 138 KB? Isn't that absurd?

**A:** It's the discipline made visible. The wrapper carries the 8-step contract (~5 KB), the per-concept template structure (~30 KB of non-negotiables), the Diff B flag taxonomy (~40 KB), the Step 8U repair recipes (~50 KB), the mode-detection logic (~5 KB), and the documentation prose tying it together (~8 KB).

```
┌─────────────────────────────────┬──────────┐
│ Component                       │ Size     │
├─────────────────────────────────┼──────────┤
│ 8-step contract                 │ ~5 KB    │
│ Non-negotiables 1–20            │ ~30 KB   │
│ Step 6U flag taxonomy           │ ~40 KB   │
│ Step 8U repair recipes          │ ~50 KB   │
│ Mode detection                  │ ~5 KB    │
│ Documentation prose             │ ~8 KB    │
├─────────────────────────────────┼──────────┤
│ Total                           │ ~138 KB  │
└─────────────────────────────────┴──────────┘
```

It's large because the discipline is large. The alternative (a small wrapper with the discipline missing) is the failure mode the discipline exists to prevent. The breakpoint where this stops being worth it is ~200 KB; we're at 138 KB; v1.30+ will probably push past 150 KB and trigger the structured-file refactor described in [03-template-diff](../02-dsa/03-template-diff.md) Sub-block 3.

### One-line anchors

- aipe IS prompt engineering as a discipline applied to spec generation.
- The discipline lives in the 8-step contract, the per-section structure, the two-diff UPDATE mode, the mirror, the lockstep version.
- Phase A: discipline implicit in templates. Phase B (B1.7): style guide names it explicitly.
- The discipline pays off in reliability that compounds across the 11 spec types.
- The breakpoint is user-flow divergence, not file count.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the improvised-vs-engineered comparison from memory. Name 4 dimensions where aipe shows discipline.

### Level 2 — Explain it out loud
Explain to a colleague why aipe exists. Under 90 seconds.

Checkpoints:
- Did you name the 8-step contract?
- Did you mention the templates being version-controlled artifacts?
- Did you contrast against the improvised-prompt failure mode?

### Level 3 — Apply it to a new scenario

A teammate is building an internal AI tool with 5 LLM-powered features, each implemented as a one-paragraph prompt in a function. They're about to ship. What advice from the discipline do you give them?

Reference `specs/feature.md` and `specs/study.md` to ground your advice in real examples.

### Level 4 — Defend the decision you'd change

"If you were starting aipe today knowing it would grow to 14 spec types, would you still ship per-template-as-slash-command? Or would the dispatcher start to make sense?"

Reference the cost ledger in the dodge-question answer.

### Quick check — code reference test
Without opening files:
- What file is the discipline encoded in? → every `specs/<type>.md`
- What's the discipline's explicit version? → Phase B B1.7 `template-style-guide.md` (not yet shipped)
- How many templates currently encode the 8-step contract? → 11 (one per spec type)
