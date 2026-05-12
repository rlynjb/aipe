# User-override locks

**Industry name(s):** User-locked field, manual override flag, "do-not-touch" marker
**Type:** Industry standard

> When the user has explicitly edited an AI-generated field, the LLM must not overwrite it on regeneration — the human's edit is the ground truth.

**See also:** → [05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md)

---

## Why care

You've spent 30 minutes hand-editing an AI-generated description because the model got nuance wrong, only to watch the next regeneration silently wipe your work. The trust loss is permanent — once the user knows the system can erase their effort, they stop trusting it everywhere.

The pattern is *respect the user's edits as ground truth*. Same shape as Git's merge-conflict markers (don't auto-pick a side; ask the human), as Word's "track changes" with author preservation. The trick is to know *when* the user edited and *what* they edited, so regeneration can route around it.

---

## How it works

A document with sticky notes saying "do not overwrite."

### The shape

```
- AI generates field X with value A.
- User edits X to value B; system records "X is user-overridden."
- Next regeneration sees the user-override flag; preserves X = B; regenerates everything else.
```

### What aipe does (load-bearing case)

aipe's UPDATE mode (from [05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md)) is built around user-override preservation. The two diffs identify what *needs* to change; everything else is left alone. The user's hand-edits to a Tradeoffs section, a tweaked summary paragraph, an added line of code reference — all preserved by default. Step 7U's STOP for confirmation lets the user veto individual changes.

The semantic difference from a literal "user-override flag": aipe doesn't mark individual fields. The whole existing spec file is treated as user-owned content, and UPDATE mode only modifies sections it has positively identified as drift. By default, everything is user-locked.

This is the inverse-default — instead of "auto-regenerate unless locked," it's "preserve unless flagged for change." For markdown documents that are human-readable and human-editable, this is the safer default.

### Where explicit locks would appear

If aipe ever auto-applied changes without user confirmation, explicit lock markers would matter — e.g., a `<!-- user-locked: true -->` comment at the top of a section to skip it in UPDATE mode. Today, the STOP for confirmation makes explicit locks unnecessary; the user reviews and approves every change.

Curriculum tags C1.11 to loopd via B1.9 ("`user_overridden_*` lock pattern audit") — loopd has DB-level user-override flags on AI-generated fields. aipe's analog is the file-level preservation default.

The full picture is below.

---

## User-override locks — diagram

```
Loopd's per-field lock pattern (DB-level)
─────────────────────────────────────────

entries table:
   title           TEXT
   ai_generated    BOOL
   user_overridden BOOL    ◀── flag set when user edits title

regeneration logic:
   if user_overridden = true → skip
   else                       → regenerate from AI


aipe's file-level lock pattern (default-preserve)
─────────────────────────────────────────────────

existing spec file:
   ## Section A (unedited)
   ## Section B (user edited)
   ## Section C (unedited)

UPDATE mode:
   Diff identifies sections needing change.
   Step 7U: print plan, STOP for confirmation.
   Step 8U: only edits confirmed sections.
   
   default: PRESERVE
   exception: explicit user approval of a change
```

---

## In this codebase

**Not as field-level locks.** aipe doesn't mark individual sections as user-edited. Instead, the whole file is treated as user-owned content by default; UPDATE mode preserves unless explicitly authorised to edit.

How this works in practice:
- Diff A flags codebase drift (file moved, content changed) → Step 7U lists the change → user approves or vetoes.
- Diff B flags template drift (new section added in template version) → Step 7U lists → user approves or vetoes.
- Sections clean on both diffs are NOT mentioned in the plan and NOT touched.

The STOP for confirmation is the load-bearing mechanic. Without it, UPDATE would auto-apply and user edits would be at risk; with it, the user's authorisation is the only path to a file edit.

Curriculum tags C1.11 to loopd's B1.9 (DB-level lock pattern). For aipe, the analog is the file-level default-preserve behaviour.

---

## Elaborate

### Where this pattern comes from

User-override preservation is older than software — every editor's "track changes" feature implements it. The DB-level lock variant (a boolean flag per field) became standard in CMS systems around 2010. The default-preserve variant (the system never auto-applies; humans authorise everything) is older still — it's how Git's manual merge works.

### The deeper principle

Once a human has touched a piece of state, treat that state as authoritative. Auto-regeneration that doesn't respect prior edits costs trust faster than it saves time.

### Where this breaks down

When the user wants the LLM to regenerate a field they previously edited. Without a way to "unlock" a field, the user is stuck — their old edit prevents the new regeneration. The fix is an explicit unlock signal (delete the section, or pass a flag, or use a sentinel marker the user types).

### What to explore next

- [05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md) → where the default-preserve behaviour lives
- Git's `--no-commit` merges → similar default-preserve pattern
- CRDT systems (Yjs, Automerge) → finer-grained merge semantics for collaborative editing

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Default-preserve (aipe)  │ Auto-regenerate              │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Trust            │ User edits never lost    │ Edits sometimes wiped       │
│ Per-edit cost    │ +1 round trip (STOP for  │ Zero — system applies        │
│                  │  confirmation)           │ silently                    │
│ Adoption        │ Higher — users trust the  │ Lower — users hand-edit     │
│                  │ tool                     │ outside the tool            │
│ Implementation   │ STOP gate + change plan  │ None — just regenerate      │
│ Failure blast   │ User declines a change    │ User's hand-edit gone       │
│                  │ → no edit lands          │ silently                    │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

aipe's UPDATE mode is slower because every change requires user confirmation. A user with 50 files to update sees a 50-file plan and has to read it before approving. That's overhead for the user. The overhead is the cost of the trust invariant.

### Sub-block 2 — what the alternative would have cost

Auto-regeneration would silently overwrite user hand-edits. The lost edits accumulate per release; users notice; trust erodes; users start hand-rewriting outside aipe. At which point aipe's value proposition (generated specs you can hand-tweak) collapses — the user does the hand-tweaking somewhere else.

### Sub-block 3 — the breakpoint

Fine until the change plan becomes too large to review meaningfully. A 200-file UPDATE plan is harder to read than a 50-file one. At that scale, the right fix is to group changes by category (codebase drift, template drift) and let the user approve whole categories ("apply all codebase-drift fixes"), preserving the default-preserve invariant for unflagged content.

---

## Tech reference (industry pairing)

### Default-preserve UPDATE patterns

- **Codebase uses:** Step 7U STOP for confirmation in every wrapper.
- **Why it's here:** preserves user edits as ground truth.
- **Leading today:** plan-before-apply (Terraform, kubectl-diff, Atlas) — `adoption-leading` for stateful systems, 2026.
- **Why it leads:** decouples computation of delta from application; user reviews before commit.
- **Runner-up:** Git's `merge --no-commit` — `adoption-leading` for code merging; same pattern with different vocabulary.

---

## Project exercises

Curriculum's B1.9 (`user_overridden_*` lock pattern audit) anchors to loopd, not aipe. aipe's analog (file-level default-preserve) is structurally present and doesn't need a separate Build item.

---

## Summary

User-override locks preserve human edits when the system regenerates. aipe uses a file-level default-preserve variant: the existing spec is treated as user-owned; UPDATE mode only edits sections flagged by Diff A or Diff B AND approved at Step 7U. The constraint that drove this: spec generation produces hand-editable artifacts, and silently overwriting user edits would erode trust. The cost being paid: per-update round-trip cost (read the plan, approve or veto).

- Default-preserve at the file level, not field-level locks.
- Step 7U STOP is the load-bearing mechanic.
- Sections clean on both diffs are never touched.
- Trust is the load-bearing benefit; per-update friction is the cost.

---

## Interview defense

### Likely questions

**Q [mid]:** What does "user-override lock" mean?

**A:** Marking AI-generated content that the user has hand-edited so subsequent regenerations don't overwrite the edit. In loopd's version, it's a DB column (`user_overridden_*`) flipped on user edit. In aipe's version, it's the default-preserve behaviour of UPDATE mode — every section is implicitly user-owned, and only Step 7U-approved diffs result in writes.

**Q [senior]:** Why didn't aipe use explicit lock markers?

**A:** Because the spec output is markdown files, not records in a database. Adding `<!-- user-locked -->` comments would clutter the document and require users to add them deliberately. The cleaner inversion is: trust the user always, and only write when explicitly authorised. The STOP for confirmation is the authorisation signal; no per-section flag needed.

```
Field-level locks (loopd)         File-level default-preserve (aipe)
─────────────────────             ──────────────────────────────────
title          (TEXT)             ## Section A (preserved by default)
title_locked   (BOOL) ◀── flag    ## Section B (preserved by default)
                                  ## Section C (preserved by default)

regen: if locked → skip          UPDATE: STOP for confirmation
                                          edit only confirmed sections
```

**Q [arch]:** What's the trust mechanic underneath this?

**A:** "The user's last edit is the ground truth." Regeneration can suggest changes; only the user can authorise them. The system never assumes its own output is better than the user's edit. This inverts the typical AI-tool default (auto-apply suggestions); the trust gained from this inversion is durable. The breakpoint is "user wants to bulk-accept everything" — at that scale, "yes" / "yes to all in this section" branches in Step 7U give the user the right granularity.

### The question candidates always dodge

**Q:** Why not just have an "auto-apply" mode for users who trust the system?

**A:** Because trust is built by demonstrating safety, not by giving users a footgun. The first time auto-apply wipes a hand-edit, the user disables auto-apply forever — they don't know if the auto-apply will work next time either. The STOP-for-confirmation default is friction at first and trust at scale.

```
With auto-apply mode             Without (today)
─────────────────────            ─────────────────
"It's faster!" — user enables    Every update is reviewed
"Wait, where's my edit?" —       User keeps trusting aipe
user disables forever            for next 100 updates
─ trust gone, mode useless ─     ─ trust grows ─
```

### One-line anchors

- User edits are ground truth; the AI never overwrites without authorisation.
- aipe uses file-level default-preserve; loopd uses field-level locks (same principle).
- The STOP for confirmation is the authorisation signal.
- Trust is the benefit; per-update friction is the cost.
- The breakpoint is bulk-review at high update count.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw loopd's field-lock pattern alongside aipe's file-level default-preserve.

### Level 2 — Explain it out loud
Explain how aipe's UPDATE mode preserves user edits. Under 90 seconds.

### Level 3 — Apply it to a new scenario

A user hand-tweaked the Tradeoffs section of one concept file. They run `/aipe:study` after a template upgrade adding the v1.23.0 Tech reference section. What does Step 7U print? What gets touched?

### Level 4 — Defend the decision you'd change

"Would you add an `--auto-apply` flag for power users?"

### Quick check — code reference test
Without opening files:
- What's the load-bearing mechanic? → Step 7U STOP for confirmation
- What's flagged by default? → nothing — preserve everything unless drift detected
- Where does loopd's variant live? → DB columns (`user_overridden_*`)
