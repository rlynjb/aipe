# Existing-guide detection (CREATE vs UPDATE branch)

**Industry name(s):** Idempotent operation branch, Init-vs-update branch, Existence-based dispatch
**Type:** Industry standard

> Step 4 of every command — does the output path exist? For single-file specs it's one stat; for `/aipe:study` it's a multi-signal check across the section tree.

**See also:** → [05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md) · → [02-per-spec-type-contract](../01-system-design/02-per-spec-type-contract.md)

---

## Why care

You've written a deploy script that took two different paths depending on whether the target directory existed — and watched it get the check wrong, treating a freshly-created-but-empty directory as "already deployed" and skipping the actual work. Existence-based dispatch is everywhere, and the failure mode is almost always "what does *exists* mean here?" — a question that's harder than it looks.

The pattern is *existence-based dispatch with a domain-specific predicate*. The naive form is "does the file exist?" The real form is "does enough of the artifact exist to consider it the target of UPDATE rather than CREATE?" Database migrations ask this (schema_migrations table populated?). Terraform asks this (state file present?). Every "init or pull" command in version control asks this. Here's how aipe's `/aipe:study` does it, and why the predicate is multi-signal rather than single-file.

---

## How it works

A landlord checking whether an apartment is rented. The naive check is "is the front door locked?" — but a vacant apartment might have a locked door, and a rented apartment might have an unlocked one. The real check is "are there belongings inside?" — multiple signals, any one of which means rented.

### Single-file spec types: the simple case

For 10 of the 11 spec types (`/aipe:feature`, `/aipe:debugging`, etc.), Step 4 is one file stat:

```
if [ -e .aipe/specs/<type-plural>/<slug>.md ]; then
    UPDATE MODE
else
    CREATE MODE
fi
```

If you're coming from frontend, think of this like `useEffect` deps — the existence of one specific file decides which branch runs. There's no ambiguity: file present means "this slug has been generated before," file absent means "fresh slug."

The slug is derived from the user's intent (e.g., `/aipe:feature add dark mode toggle` → `add-dark-mode-toggle.md`), so collisions are rare in practice.

### Multi-file spec type: `/aipe:study` is the complex case

`/aipe:study` produces a directory of files, not a single file. The check has to ask "does any part of the study layout exist?" — which means looking at multiple potential signals.

```
Existing-study signal (any one returns true → UPDATE):

  .aipe/specs/study/00-overview.md exists
  OR any file in .aipe/specs/study/01-system-design/
  OR any file in .aipe/specs/study/02-dsa/
  OR any file in .aipe/specs/study/03-ai-engineering/
  OR any file in .aipe/specs/study/04-machine-learning/
```

This is like React's `cleanup` function detection — you check several places because the artifact lives in several places. The fix is to OR them; missing any signal would mean a partial-layout user gets CREATE-mode-on-already-existing-files, which would clobber their work.

The practical consequence: the check fires `true` if the user has run `/aipe:study` before AND any of the section sub-directories has content. A user who deleted `00-overview.md` but kept the section files still gets UPDATE mode — the deletion isn't enough to reset the layout. A user who wants a true fresh-start has to delete the whole `.aipe/specs/study/` tree.

### Why the empty-directory case is handled

The `.aipe/specs/study/` directory itself might exist as a placeholder (created by a previous run that scaffolded and stopped). That alone is not the same as "a study guide already exists" — the check explicitly notes that an empty `study/` directory doesn't count.

This matters for the very-first-run case. A user runs `/aipe:study` for the first time; Step 1 scaffolds `.aipe/project/` and `.aipe/specs/` (creating `study/` as part of the standard scaffold); the wrapper proceeds to Step 4. Without the empty-directory exception, the wrapper would see `study/` exists and try to UPDATE — but there's nothing to update, so it'd fail in confusing ways. The exception says "directory presence is necessary but not sufficient; we need at least one *file* to fire UPDATE."

```
Directory exists, no content → CREATE (the right thing)
Directory + 00-overview.md   → UPDATE
Directory + only section dir → UPDATE
No directory at all          → CREATE
```

This works whether the user has run `/aipe:study` once or never. It breaks if a user manually creates `.aipe/specs/study/01-system-design/` without any files — but that's a deliberate manual edit, not a typical flow.

### The branch is the load-bearing point

Step 4's branch is one of the two big control-flow gates in every wrapper (the other is Step 7U's STOP). It picks which set of step blocks runs — Steps 5C–8C (or 11C for study) for CREATE, Steps 5U–9U for UPDATE.

CREATE-mode-on-existing-files would be destructive: the wrapper would write fresh files over the user's work. UPDATE-mode-on-fresh-repo would be incoherent: there's nothing to diff against. The branch keeps both from happening by getting the predicate right.

This is what people mean by "the predicate is the contract." If Step 4's check is wrong, every downstream step is operating on the wrong assumption. The check has to be correct, and its correctness is verifiable by ad-hoc test — "delete 00-overview.md, leave section files, re-run; does UPDATE fire?"

The full picture is below.

---

## Existing-guide detection — diagram

```
Step 4 decision tree

┌─ Single-file spec types (10 of 11) ─────────────────────────────────────┐
│                                                                         │
│   Check: .aipe/specs/<type-plural>/<slug>.md                            │
│                                                                         │
│        exists ──▶ UPDATE MODE                                           │
│   does not    ──▶ CREATE MODE                                           │
│                                                                         │
│   Single file stat. Branch is binary.                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─ /aipe:study (multi-file spec) ─────────────────────────────────────────┐
│                                                                         │
│   .aipe/specs/study/00-overview.md exists?                              │
│        yes ──▶ UPDATE MODE                                              │
│        no                                                               │
│                                                                         │
│   .aipe/specs/study/01-system-design/ has any file?                     │
│        yes ──▶ UPDATE MODE                                              │
│        no                                                               │
│                                                                         │
│   .aipe/specs/study/02-dsa/ has any file?                               │
│        yes ──▶ UPDATE MODE                                              │
│        no                                                               │
│                                                                         │
│   .aipe/specs/study/03-ai-engineering/ has any file?                    │
│        yes ──▶ UPDATE MODE                                              │
│        no                                                               │
│                                                                         │
│   .aipe/specs/study/04-machine-learning/ has any file?                  │
│        yes ──▶ UPDATE MODE                                              │
│        no                                                               │
│                                                                         │
│        ──▶ CREATE MODE                                                  │
│                                                                         │
│   Empty .aipe/specs/study/ directory alone does NOT fire UPDATE.        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Where the check lives:** every `commands/<type>.md` Step 4.

- `commands/feature.md` Step 4: single-file check, ~5 lines of body.
- `commands/study.md` Step 4: multi-signal check, explicit enumeration of the per-section "any file" conditions.

**The exact phrasing in `commands/study.md` Step 4:**

> Check whether `.aipe/specs/study/` already contains the study layout. The signal is the presence of `00-overview.md` at the root, OR any file inside `01-system-design/`, `02-dsa/`, `03-ai-engineering/`, or `04-machine-learning/`.
>
> **If any of those exist → go to UPDATE MODE (Step 5U onward). Do NOT regenerate from scratch.**
>
> **If none exist → go to CREATE MODE (Step 5C onward).**
>
> (The `.aipe/specs/study/` directory itself may exist as a placeholder; that's not the same as having a guide already.)

**Verification:** the empty-directory exception is the load-bearing part. Without it, every fresh-run-after-scaffold would mistakenly fire UPDATE. The exception is enforced by the agent reading "directory itself may exist as placeholder" and dispatching accordingly.

---

## Elaborate

### Where this pattern comes from

Existence-based dispatch is older than UNIX — physical filing cabinets had "new account" vs "existing account" branches based on whether a folder for the customer existed. In software, `git init` vs `git pull` is the canonical pair (2005). Database migration tools added the multi-signal variant (Rails migrations check `schema_migrations` table presence; Django checks `django_migrations`). The aipe variant inherits the shape and adds the empty-directory exception, which most simple "exists?" predicates skip.

### The deeper principle

The right predicate for "does this artifact already exist?" is artifact-specific, not file-system-specific. A directory's presence is necessary but not sufficient; the meaningful signal is whether content is inside it. When designing an existence-based dispatch, write down what "exists" means for *your* artifact — and make sure the predicate matches.

### Where this breaks down

When the user manually creates one of the section directories (e.g., `mkdir .aipe/specs/study/01-system-design/`) but doesn't put any file in it. The check sees no files in any section, no `00-overview.md`, and fires CREATE. CREATE then runs and writes files into the directory the user already created — which is fine, but the user's intent (was the empty directory a placeholder? a deliberate signal?) is ambiguous. The current predicate trades this edge case for the much more common one (the directory exists because scaffolding created it).

### What to explore next

- [05-two-diff-update-mode](../01-system-design/05-two-diff-update-mode.md) → what UPDATE actually does once the branch fires
- Database migration tools (Flyway, Liquibase, Atlas) — all use multi-signal existence checks
- `git init`'s detect-existing-repo logic — same pattern, even more conservative (refuses to re-init a non-empty `.git/`)

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Multi-signal check       │ Single-file check (naive)   │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Run time         │ Up to 5 stat calls       │ 1 stat call                 │
│                  │ (~5 ms total)            │ (~1 ms)                     │
│ Correctness on   │ Correct — empty dir =    │ Wrong — scaffold-created    │
│   partial state  │ CREATE; any file = UPDATE│ empty dir would fire UPDATE │
│ User work        │ Preserved — UPDATE       │ Lost — CREATE clobbers any  │
│   protection     │ branch handles existing  │ partial work                │
│                  │ files                    │                             │
│ Edge case load   │ Empty-directory          │ Cleaner predicate but wrong │
│                  │ exception is the         │ for our scaffolding flow    │
│                  │ load-bearing part        │                             │
│ Failure blast    │ Wrong branch → user      │ Wrong branch → CREATE       │
│                  │ catches at Step 7U STOP  │ regeneration loses user     │
│                  │                          │ edits silently              │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

We pay 5 stat calls instead of 1 — about 4ms of extra I/O per `/aipe:study` invocation. On a fast filesystem this is invisible; on a slow one (HDD, network), it's still well under any threshold a user would notice. The cost is negligible.

We accept a more complex predicate. A new contributor reading `commands/study.md` Step 4 sees 5 conditions ORed together, not one — they have to read all of them to understand the branch. The current wrapper documents the multi-signal logic in plain English, so the cost is bounded; without that documentation, the predicate would be cryptic.

### Sub-block 2 — what the alternative would have cost

Single-file check would silently miss the "partial guide" case. A user who deleted `00-overview.md` but kept the section files would re-run `/aipe:study` and see CREATE mode kick off — regenerating files over their (partially-customised) section files. The work loss would be silent and irreversible (no git history of `.aipe/specs/study/` if the user hadn't committed yet).

The check would also miss the "user manually wrote `01-system-design/02-foo.md` to seed the guide" case. Some users might want to drop a hand-written section file before running `/aipe:study` for the first time and have UPDATE mode merge it in. The multi-signal check supports this; single-file wouldn't.

### Sub-block 3 — the breakpoint

Fine until the study layout grows enough section directories that the OR-list becomes unwieldy (say, 10+ sections). Adding `04-machine-learning/` from v1.25.0 didn't push past the threshold; an `05-mobile-engineering/` or `06-security/` section might. At that point, the right refactor is "check `.aipe/specs/study/` for any subdirectory containing any file" — a single recursive check, slightly slower but indifferent to section count.

A second breakpoint: when `.aipe/specs/study/` itself becomes large (hundreds of files). Today, even a thorough scan is a handful of milliseconds. At 200+ files, the multi-signal check is still milliseconds — the breakpoint is unlikely to hit on file count.

---

## Tech reference (industry pairing)

### Filesystem stat-based detection

- **Codebase uses:** the agent runs file/dir existence checks (in practice, via `ls`/`find`/`[ -e ]` shell primitives, or equivalent stat calls).
- **Why it's here:** picks the CREATE-vs-UPDATE branch at Step 4.
- **Leading today:** stat-based filesystem checks — `adoption-leading` for existence-based dispatch, 2026.
- **Why it leads:** kernel-level, sub-millisecond, no parsing required.
- **Runner-up:** content-based detection (hash + manifest file) — `innovation-leading` in tools that need cryptographic certainty (signed builds); overkill for a markdown-detection use case.

---

## Summary

Step 4 of `/aipe:study` decides CREATE vs UPDATE by checking multiple signals: `00-overview.md` at the root OR any file inside any of the 4 section sub-directories. An empty `.aipe/specs/study/` directory does NOT fire UPDATE — the directory might exist as a scaffold artifact, not as a signal of prior generation. Single-file spec types use a simpler single-stat check. The constraint that drove this: regeneration over partial work would be silently destructive, and scaffolding creates empty directories that mustn't be mistaken for prior generations. The cost being paid: 5 stat calls instead of 1 (~4ms negligible) and a multi-condition predicate that's harder to read than a single check.

- For single-file spec types, the check is one stat; for `/aipe:study`, it's a 5-signal OR.
- Empty `.aipe/specs/study/` directory does NOT trigger UPDATE (load-bearing exception).
- Wrong branch is recoverable in UPDATE (Step 7U STOP catches it) but destructive in CREATE.
- The predicate scales by enumeration today; if section count grows past ~10, switch to recursive "any file under study/" check.
- The pattern's failure mode is "interpreting empty directory as signal" — easy to get wrong, easy to test.

---

## Interview defense

### What an interviewer is really asking

"How does Step 4 decide between CREATE and UPDATE?" is testing whether you understand artifact-specific predicates. The dodge is "it checks if the file exists." The senior answer names the multi-signal predicate for the multi-file case and the load-bearing empty-directory exception.

### Likely questions

**Q [mid]:** What does Step 4 actually check for `/aipe:study`?

**A:** It checks 5 conditions, ORed together: `00-overview.md` at the root, or any file in `01-system-design/`, `02-dsa/`, `03-ai-engineering/`, or `04-machine-learning/`. If any one is true, UPDATE mode fires. If all are false, CREATE mode fires. The directory `.aipe/specs/study/` itself can exist (as a scaffold artifact) without triggering UPDATE — only file presence inside it counts.

```
.aipe/specs/study/ exists, empty           → CREATE
.aipe/specs/study/00-overview.md exists    → UPDATE
.aipe/specs/study/01-system-design/foo.md  → UPDATE
.aipe/specs/study/ does not exist           → CREATE
```

**Q [senior]:** Why is the empty-directory exception necessary?

**A:** Step 1 scaffolds `.aipe/specs/` (which creates the directory). A user running `/aipe:study` for the first time would have `.aipe/specs/` exist after Step 1 — and if Step 4 just checked for directory presence, every fresh run would mistakenly fire UPDATE mode. UPDATE mode on a fresh repo has nothing to diff against; the wrapper would print a confusing "no existing files to update" or fail. The exception says "directory presence alone is necessary but not sufficient" — file presence is the real signal. The shape is "what is in the artifact, not what is around it."

```
Without empty-dir exception                  With (today)
─────────────────────────                    ────────────
fresh repo                                   fresh repo
  │                                            │
Step 1 scaffold creates                      Step 1 scaffold creates
.aipe/specs/study/                           .aipe/specs/study/
  │                                            │
Step 4 sees directory                        Step 4 sees directory
exists → UPDATE                              exists, empty → CREATE
  │                                            │
UPDATE has nothing to                        CREATE proceeds
diff against → confused                      normally
failure                                       │
                                              ▼
                                            study guide generated
```

**Q [arch]:** What changes if `.aipe/specs/study/` grows to 10 section sub-directories?

**A:** The 5-condition OR list becomes a 10-condition OR list. At that count, the predicate is harder to maintain and easier to mis-list (someone adds a section but forgets to add the check). The right refactor is "check `.aipe/specs/study/` for any sub-directory containing any file" — a single recursive scan instead of an enumerated OR. The recursive scan is slightly slower (microseconds), but indifferent to section count and immune to "forgot to add the check" bugs. The breakpoint is around 6–7 sections; we're at 4 today (+ optional 5th if ML).

```
Today (4 sections, enumerated)     At 10+ sections (refactor to recursive)
───────────────────────────────    ──────────────────────────────────────
explicit OR list of 5 checks       single scan: find study/ -type f
  │                                  │
verbose but greppable               concise but harder to "see"
  │                                  │
scales linearly with section       constant time regardless of N
count + chance of                  ─ no chance of "forgot to add" bug ─
"forgot to add" bug
  ─ breaks first around 6–7 sections ─
```

### The question candidates always dodge

**Q:** Why didn't you use a sentinel file (e.g., `.aipe/specs/study/.exists`) instead of multi-signal detection?

**A:** Sentinel files are simpler to check but harder to invalidate. With sentinels:

```
┌────────────────────┬──────────────────────────┬───────────────────────────┐
│ Dimension          │ Multi-signal (today)     │ Sentinel file (`.exists`) │
├────────────────────┼──────────────────────────┼───────────────────────────┤
│ Check cost         │ 5 stats                  │ 1 stat                    │
│ "Reset" UX         │ Delete the section files │ Delete the sentinel       │
│                    │ you want regenerated     │ (cryptic) OR the whole    │
│                    │                          │ directory (drastic)       │
│ Hand-edit safety   │ Hand-edited section file │ Hand-edited section file  │
│                    │ → UPDATE preserves it    │ → UPDATE preserves it,    │
│                    │                          │ IF sentinel still exists  │
│ Partial state      │ Any file = UPDATE        │ Sentinel present even if  │
│                    │ (correct)                │ user deleted everything   │
│                    │                          │ else → wrong mode         │
│ Invariant          │ "Any content = exists"   │ "Sentinel present =       │
│                    │ (matches user intuition) │ exists" (artificial)      │
│ Failure blast      │ Wrong-mode → STOP saves  │ Stale sentinel → UPDATE   │
│                    │                          │ on missing files → fail   │
└────────────────────┴──────────────────────────┴───────────────────────────┘
```

The sentinel is cleaner *if* the user never touches the directory by hand. But users *do* — they delete files they don't want, manually edit sections, sometimes `mv` the whole thing. The sentinel becomes a synchronization artifact between "what's actually here" and "what we claim is here." Multi-signal detection doesn't need that synchronization because the check IS the truth.

### One-line anchors

- Step 4 picks CREATE vs UPDATE; the predicate is artifact-specific, not file-system-specific.
- Empty `.aipe/specs/study/` directory does NOT count as "existing study" — file presence is the signal.
- Single-file spec types use 1 stat; `/aipe:study` uses a 5-signal OR.
- Multi-signal scales by enumeration; switch to recursive scan past ~7 sections.
- The predicate is the contract — get it wrong, every downstream step operates on a false premise.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw Step 4's decision tree for `/aipe:study` from memory. Include the empty-directory exception explicitly.

### Level 2 — Explain it out loud
Explain Step 4's predicate to a colleague who's used to `git init` vs `git pull` dispatch. Under 90 seconds.

Checkpoints:
- Did you name all 5 signals (4 sections + 00-overview)?
- Did you mention the empty-directory exception?
- Did you contrast single-file vs multi-file detection?

### Level 3 — Apply it to a new scenario

A user has:
- `.aipe/specs/study/` (directory exists)
- `.aipe/specs/study/00-overview.md` (deleted last week)
- `.aipe/specs/study/01-system-design/01-foo.md` (still here)

They run `/aipe:study`. Which mode fires? Why?

Open `commands/study.md` Step 4 and verify against the OR-list.

### Level 4 — Defend the decision you'd change

Pick the multi-signal-vs-sentinel tradeoff. Answer:

"If the study layout grew to 12 sections, would you keep multi-signal or switch to a sentinel file (or recursive scan)?"

### Quick check — code reference test
Without opening files:
- How many sub-directories are checked in `/aipe:study` Step 4? → 4 (01–04) plus `00-overview.md`
- What does an empty `study/` directory trigger? → CREATE (the exception)
- Where does this predicate live? → `commands/study.md` Step 4
