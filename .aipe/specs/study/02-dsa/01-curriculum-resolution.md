# Curriculum file resolution

**Industry name(s):** Bounded filesystem search, Resolution-then-branch, Candidate counting
**Type:** Industry standard

> Check 4 canonical paths in order; if none match, `find` the user's home with maxdepth 4 for candidates, then branch on the count (0 / 1 / many).

**See also:** → [02-existing-guide-detect](02-existing-guide-detect.md) · → [04-context-layering](../01-system-design/04-context-layering.md)

---

## Why care

You've watched a tool look for its config file in seven places "for compatibility" — `~/.toolrc`, `~/.config/tool/config`, `/etc/toolrc`, `./.toolrc`, `$XDG_CONFIG_HOME/tool/config`, the parent directory, the grandparent — and produced a config the user didn't know they had, because one of those locations held an old file from a prior version. Resolution order matters; it's the difference between "found the right file" and "found a wrong file."

The pattern is *priority-ordered candidate resolution with a bounded fallback search*. Every language's module resolver does this (Node's `node_modules` walk, Python's `sys.path`, Ruby's `$LOAD_PATH`). Every editor's config loader does this. The shape: define an explicit priority list, walk it in order, fall back to a wider search only if the explicit list is empty, count the results, branch on the count. Here's how aipe's `/aipe:study` resolves its optional curriculum file.

---

## How it works

A scavenger hunt with two rules: first, check the named hiding spots in order; second, if all named spots come up empty, sweep the rest of the house but only to a fixed depth.

### Step 1 — Check canonical paths in priority order

```
.aipe/project/aieng-curriculum.md      ← per-project, higher priority
.aipe/project/curriculum.md            ← per-project, alternate name
~/.config/aipe/global/aieng-curriculum.md  ← global, primary name
~/.config/aipe/global/curriculum.md    ← global, alternate name
```

If you're coming from frontend, think of this like Webpack's `resolve.extensions` — a list of candidate suffixes tried in order, first match wins. The order encodes priority: per-project beats global (more specific), the "aieng-curriculum" name beats the bare "curriculum" name (more recent convention).

The check is `[ -e <path> ]` (or equivalent) — does the path resolve to an existing file? Broken symlinks fail this test, which means the resolver naturally skips a dangling symlink at a canonical path. (This bit us in this very session — see the section below on `/Users/rein/.config/aipe/global/aieng-curriculum.md` having been a broken symlink.)

```
First match wins:

.aipe/project/aieng-curriculum.md     ──── exists? yes → use it, done
                                          no
.aipe/project/curriculum.md           ──── exists? yes → use it, done
                                          no
~/.config/aipe/global/aieng-...       ──── exists? yes → use it, done
                                          no
~/.config/aipe/global/curriculum.md   ──── exists? yes → use it, done
                                          no
                                          ▼
                                     fall to Step 2
```

### Step 2 — Fallback `find` over home, maxdepth 4

If no canonical path matches, run a bounded filesystem search:

```bash
find ~ -maxdepth 4 \( -name "aieng-curriculum.md" -o -name "curriculum.md" \) \
  -not -path "*/node_modules/*" -not -path "*/.git/*" \
  -not -path "*/.aipe/specs/*" 2>/dev/null
```

Think of it like a `grep` over your project tree — except instead of searching by content, you search by filename, and instead of unbounded, you cap the depth so the search returns quickly even on a home directory with thousands of subdirectories.

**Why maxdepth 4?** It's the depth where typical user-project files live (e.g., `~/Public/aipe/prompts/aieng-curriculum.md` is depth 4: `~/Public/aipe/prompts/`). Going deeper costs disk I/O without finding more candidates in practice. Going shallower would miss real candidates.

**Why exclude `node_modules`, `.git`, `.aipe/specs/`?** Those directories are huge and contain content that's never the canonical curriculum. `node_modules` is 10k+ files in some projects. `.git` is binary plumbing. `.aipe/specs/` contains generated study guides, not curricula. Excluding them keeps the search fast.

The practical consequence: the `find` returns 0, 1, or N candidate file paths. The branch on count decides what happens next.

### Step 3 — Branch on candidate count

```
N = 0:   no curriculum → continue in codebase-driven mode (silent)
N = 1:   auto-install via symlink → continue in curriculum-loaded mode
N > 1:   prompt the user to pick → wait for reply
```

The three branches encode three different user states:

- **Zero candidates** — the user hasn't authored a curriculum file. AI/ML files in the study guide will be codebase-driven (one file per pattern in the actual code) and skip the `## Project exercises` block. No warning printed; codebase-driven is a first-class mode, not a fallback.

- **Exactly one candidate** — the user has authored a curriculum file but hasn't placed it in a canonical location. The agent auto-installs by creating a symlink at `~/.config/aipe/global/aieng-curriculum.md` pointing at the found file. A one-line notice prints; future runs find the canonical path immediately and skip the fallback `find`.

- **Multiple candidates** — the user has multiple curriculum files (e.g., one per project, none yet promoted to global). The agent prints a numbered list and waits for the user to pick which to install, copy, or skip. The prompt enumerates the user's options (`<N>`, `copy <N>`, `project <N>`, `skip`).

The branch is the load-bearing part. Without it, "many candidates" would resolve to "use the first one find returned" — which is filesystem-traversal-order-dependent and unstable across runs.

### The pitfall — broken symlinks

`[ -e <path> ]` returns false for broken symlinks. This means the canonical-path check can "miss" a path that *appears* to exist on disk (the symlink directory entry is there) but doesn't resolve. The `find` command finds the symlink anyway (it sees the dirent), so the fallback may report two candidates: the broken symlink at the canonical path, and the real file somewhere else.

The fix is to repair the symlink. The agent treats this as an obvious-repair case: it deletes the broken symlink and creates a new one pointing at the real file (which becomes the "exactly one candidate" auto-install path). This was the case in this session — `/Users/rein/.config/aipe/global/aieng-curriculum.md` was a broken symlink to `/Users/rein/Public/aipe/aieng-curriculum.md` (deleted), and the agent repointed it at `/Users/rein/Public/aipe/prompts/aieng-curriculum.md` (the moved-to location).

This is what people mean by "the filesystem lies." Use the resolved file's stat, not the dirent's existence.

The full picture is below.

---

## Curriculum resolution — diagram

```
The two-step resolution flow

┌─ Step 1 — canonical paths ─────────────────────────────────────────────┐
│                                                                        │
│   .aipe/project/aieng-curriculum.md       [ -e ]?                      │
│     │ no                                                               │
│   .aipe/project/curriculum.md             [ -e ]?                      │
│     │ no                                                               │
│   ~/.config/aipe/global/aieng-curri…      [ -e ]?                      │
│     │ no                                                               │
│   ~/.config/aipe/global/curriculum.md     [ -e ]?                      │
│     │ no                                                               │
│     ▼                                                                  │
│   fall to Step 2                                                       │
│                                                                        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌─ Step 2 — bounded find over home ──────────────────────────────────────┐
│                                                                        │
│   find ~ -maxdepth 4 \(                                                │
│     -name "aieng-curriculum.md" -o -name "curriculum.md" \)            │
│     -not -path "*/node_modules/*"                                      │
│     -not -path "*/.git/*"                                              │
│     -not -path "*/.aipe/specs/*"                                       │
│                                                                        │
│   Returns: list of file paths                                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌─ Step 3 — branch on candidate count ───────────────────────────────────┐
│                                                                        │
│   N = count of returned candidates                                     │
│                                                                        │
│       N = 0  ─▶  codebase-driven mode  (silent, no warning)            │
│                                                                        │
│       N = 1  ─▶  auto-symlink to canonical path                        │
│                  Print: "✓ Auto-installed curriculum from <path>"      │
│                  curriculum-loaded mode                                │
│                                                                        │
│       N > 1  ─▶  prompt user to pick                                   │
│                  - "<number>"     symlink                              │
│                  - "copy <N>"     copy instead of symlink              │
│                  - "project <N>"  install at .aipe/project/            │
│                  - "skip"         codebase-driven mode                 │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Where the resolution logic lives:** `commands/study.md` Step 2 (in the "Curriculum file resolution" sub-section).

- Canonical-paths check: lines documenting the 4 paths in priority order.
- Fallback `find` command: appears as a literal shell command in the wrapper.
- Branch-on-count: 3 branches with the user-prompt format and the auto-symlink command.

**This session's example:**

- Canonical paths checked: 4 paths, 1 appeared to exist but was a broken symlink — `[ -e ]` correctly returned false on all 4.
- Fallback `find` returned 2 candidates: `/Users/rein/.config/aipe/global/aieng-curriculum.md` (broken symlink) and `/Users/rein/Public/aipe/prompts/aieng-curriculum.md` (the real file).
- The broken symlink was repaired (deleted + re-pointed at the real file), resolving the "two candidates" state into "one canonical candidate that exists."

**Documentation:** `commands/study.md` Step 2 lists the resolution flow verbatim. The pattern was added in v1.27.0 (curriculum auto-discovery), refined in v1.28.0 (curriculum is optional, auto-install single candidate).

---

## Elaborate

### Where this pattern comes from

Resolution-by-priority is older than software — it's how postal sort works (deliver to the most-specific routing address that matches). In software, `node_modules` resolution (2009) formalised it for JavaScript; `sys.path` did it for Python; `LD_LIBRARY_PATH` does it for dynamic linking. Bounded filesystem search has its roots in `locate` (the indexed search tool) and `mdfind` on macOS. The combination — canonical priority list with bounded fallback — is common in modern tools but underdocumented as a named pattern.

### The deeper principle

When the right file might live anywhere but conventionally lives in a few specific places, check the conventional places first and fall back to bounded search. Don't go straight to search (slow, returns garbage on big trees), don't refuse to search at all (forces users to manually move files into the canonical spot). The two-step shape lets fast-path users avoid I/O and convenience-path users avoid manual setup.

### Where this breaks down

When candidate counts repeatedly come back > 1 — that means the user has multiple curriculum files and isn't promoting any to canonical. The prompt becomes recurring friction. The fix is to honour the user's choice (symlink, copy, project-install) so subsequent runs hit Step 1 and skip Step 2 entirely. If the user keeps saying "skip," the codebase-driven mode is fine and the prompt isn't worth showing — but the current flow always shows it when N > 1, which costs a round-trip even when the user has no curriculum intent.

### What to explore next

- [02-existing-guide-detect](02-existing-guide-detect.md) → the same branch-on-file-existence pattern, but with a binary outcome instead of three branches
- Node.js module resolution algorithm — the canonical "walk parent directories looking for `node_modules/`" pattern
- Git's config layer resolution (`--system` → `--global` → `--local`) — same priority-ordered lookup

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Canonical + find fallback│ Canonical paths only        │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ First-run UX     │ Auto-discovers a         │ User must manually move     │
│                  │ misplaced curriculum     │ curriculum to a canonical   │
│                  │ file                     │ path before first run       │
│ Run time         │ Step 1 fast (4 stats),   │ Step 1 fast (4 stats); done │
│                  │ Step 2 ~50–500 ms        │                             │
│                  │ depending on $HOME size  │                             │
│ Edge case load   │ Branch-on-count adds 3   │ No branch — found or not    │
│                  │ user-visible paths       │                             │
│ False positives  │ `find` may return        │ None — only documented      │
│                  │ unintended files (e.g.,  │ paths checked              │
│                  │ a backup copy)           │                             │
│ Failure blast    │ Auto-symlink to wrong    │ Resolver fails honestly —   │
│                  │ candidate (silent bad    │ user knows curriculum isn't │
│                  │ behaviour)               │ loaded                      │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

We pay 50–500ms of I/O on first run (and any time canonical paths come up empty). On a home directory with ~10k subdirs (excluding `node_modules` and `.git`), maxdepth-4 traversal touches around 1–5k directory entries. SSDs handle this in well under a second; HDDs can stretch to multiple seconds.

We accept some risk of finding the wrong file. If the user has `~/old-projects/legacy/curriculum.md` from a defunct project, it'll appear as a candidate. The N > 1 prompt mitigates this by letting the user choose, but a user who picks-without-reading could install a stale curriculum.

We add three user-visible paths in Step 3's branch. Each is documented in `commands/study.md` Step 2, but a new user must understand them when prompted. The codebase-driven case is silent (no warning) so it doesn't add to the cognitive load on N=0.

### Sub-block 2 — what the alternative would have cost

Canonical-paths-only would refuse to find a curriculum file the user wrote at, say, `~/Public/aipe/prompts/aieng-curriculum.md` (this session's actual case). The user would have to read the docs, find the canonical path list, manually symlink or move the file, then re-run. That's a friction point on a feature (curriculum support) that's already opt-in — adding friction on opt-in features is the wrong move.

The alternative also wouldn't repair broken symlinks (a real case in this session). With canonical-only, a broken symlink at `~/.config/aipe/global/aieng-curriculum.md` would silently fail forever — the resolver would say "not found" while the dirent exists. The fallback `find` exposes the discrepancy: the resolver sees both the broken symlink (dirent) and the real file (resolved path), and the repair flow kicks in.

### Sub-block 3 — the breakpoint

Fine until $HOME tree size exceeds ~50k directories within maxdepth 4. At that scale, the `find` becomes seconds-not-ms, and first-run users see noticeable latency. The fix is either to (a) cache the resolved location after first run (skip Step 2 forever once a curriculum is installed), or (b) reduce maxdepth to 3 (faster but misses some real candidates). Today, the resolution runs only when canonical paths come up empty — which is once per user per repo — so the breakpoint is unlikely to bite.

A second breakpoint: when users routinely have 3+ curriculum candidates in their home. The prompt becomes a recurring nuisance. The fix is to cache the user's last choice and skip the prompt on re-encounter ("you picked candidate 2 last time; pick again?"). Today, no users have 3+ curricula in practice.

---

## Tech reference (industry pairing)

### Bounded filesystem search

- **Codebase uses:** `find ~ -maxdepth 4` with exclusion paths in `commands/study.md` Step 2.
- **Why it's here:** unbounded search over `$HOME` would be unacceptably slow; bounded depth + exclusions keeps it under a second.
- **Leading today:** `find` — `adoption-leading` for ad-hoc filesystem search, 2026.
- **Why it leads:** POSIX-standard, available on every Unix-like system, predictable semantics, no daemon required.
- **Runner-up:** `fd` — `innovation-leading` for fast file-name search; faster, prettier output, but not universally installed.

### Symlink-as-pointer for canonical paths

- **Codebase uses:** `ln -s <found-path> ~/.config/aipe/global/aieng-curriculum.md` after auto-discovery.
- **Why it's here:** avoids copying the file (canonical path stays in sync if the real file is edited).
- **Leading today:** symlinks — `adoption-leading` for "pointer" semantics in tools that resolve canonical locations, 2026.
- **Why it leads:** POSIX-standard, kernel-level, no application-layer indirection.
- **Runner-up:** indirection files (text files holding the real path) — `adoption-leading` in tools that can't rely on symlinks (Windows pre-developer-mode); pays an extra read per resolution.

---

## Summary

The curriculum file resolver checks 4 canonical paths in priority order; if all come up empty, it falls back to a bounded `find` over `$HOME` (maxdepth 4, exclusions for `node_modules`, `.git`, `.aipe/specs/`). The result is branched on candidate count: 0 → codebase-driven (silent), 1 → auto-symlink to canonical path, many → prompt user. The constraint that drove this: curriculum files might live anywhere the user authored them, but conventionally live in a few specific places, and resolution must work without manual setup. The cost being paid: 50–500ms of I/O on first run, three user-visible branch paths in Step 3, and a small false-positive risk on the auto-install branch.

- Canonical-paths-first means fast path for users who've already installed; fallback only fires when needed.
- The fallback `find` is bounded by depth and excludes huge directories — keeps the search fast.
- N = 0 is silent (no warning); codebase-driven mode is first-class, not a fallback.
- N = 1 auto-installs via symlink with a one-line notice; future runs hit the canonical path immediately.
- N > 1 prompts the user; the prompt is the only point where filesystem ambiguity reaches the user.
- Broken symlinks at canonical paths fail the `[ -e ]` check correctly; the fallback `find` exposes them for repair.

---

## Interview defense

### What an interviewer is really asking

"Why two steps instead of one?" is testing whether you understand the cost-asymmetry between common-case lookups (fast, frequent) and edge-case lookups (slow, rare). The dodge is to call the two-step thing "more thorough." The senior answer names the fast-path/slow-path separation and the explicit branch-on-count that handles ambiguity.

### Likely questions

**Q [mid]:** Why maxdepth 4 specifically? Why not 3 or 5?

**A:** Depth 4 covers the typical user-project layout. A curriculum file at `~/Projects/myproject/prompts/aieng-curriculum.md` is at depth 4 (`Projects/`, `myproject/`, `prompts/`, file). Depth 3 would miss files in any `prompts/` or `docs/` subdirectory; depth 5 would add traversal of every subdirectory below that without finding more real candidates. Depth 4 is the pragmatic threshold.

```
~                        depth 0
~/Public                 depth 1
~/Public/aipe            depth 2
~/Public/aipe/prompts    depth 3
~/Public/aipe/prompts/aieng-curriculum.md    depth 4  ← found
```

**Q [senior]:** What happens if `find` is slow because $HOME is on a network filesystem?

**A:** Step 2's latency would inflate from ~500ms to multiple seconds. The user sees that latency only on first run (or any run where canonical paths come up empty), so the impact is bounded — once the file is installed at a canonical path via the auto-symlink branch, every future run hits Step 1 and skips Step 2 entirely. If we wanted to harden against this case, we'd add a Step 1.5: "cache the last successful resolution in a small file" — but that's a layer of cache invalidation we don't need today. The current shape pays the cost once per user; that's acceptable.

```
Today (no cache)                      With resolution cache
─────────────                         ──────────────────────
first run: Step 1 fail                first run: Step 1 fail
   → Step 2 (slow over NFS)              → Step 2 + write cache
   → auto-symlink                        → auto-symlink
                                          + record in ~/.aipe-cache

subsequent runs: Step 1 hit            subsequent runs: read cache
   → no fallback                          → no Step 1, no Step 2
   (fine)                                 (faster — but cache may
                                           drift from filesystem
                                           if user moves files)
```

**Q [arch]:** What changes if the fallback `find` consistently returns multiple candidates for many users?

**A:** The N > 1 prompt becomes recurring friction. At that scale, "pick from N" is a poor UX — users want one decision, not a recurring quiz. The right fix is to (a) make the N > 1 branch remember the user's choice (cache "you picked candidate 2; we'll use it again unless you explicitly re-resolve"), and (b) provide a `/aipe:curriculum reset` command that clears the cache and re-prompts. The current flow assumes N > 1 is rare; if it becomes common, the prompt's cost compounds and the cache earns its place.

```
Today: N > 1 prompts every run when curricula are unequal
─────────────────────────────────────────────────────────
  run 1: "Pick: 1 or 2?" → user picks 1
  run 2: "Pick: 1 or 2?" → user picks 1 again (annoying)
  run 3: "Pick: 1 or 2?" → user picks 1 again (more annoying)
  ─ breaks first when N > 1 is the user's normal state ─

With cache: prompt once, remember
─────────────────────────────────
  run 1: "Pick: 1 or 2?" → user picks 1, cached
  run 2: cache hit, no prompt
  run 3: cache hit, no prompt
  /aipe:curriculum reset → cache cleared, re-prompt
```

### The question candidates always dodge

**Q:** Why didn't you just require the curriculum to live at a single hardcoded path?

**A:** Two reasons, with the cost ledger:

```
┌────────────────────┬──────────────────────────┬───────────────────────────┐
│ Dimension          │ Resolution + fallback    │ Single hardcoded path     │
├────────────────────┼──────────────────────────┼───────────────────────────┤
│ First-run friction │ Auto-discovers misplaced │ User must `mv` or `ln`    │
│                    │ files                    │ before running            │
│ Doc surface        │ Branch table in Step 2,  │ One sentence: "place file │
│                    │ ~30 lines of explanation │ at <path>"                │
│ False positives    │ Possible on auto-install │ Impossible                │
│ Naming flexibility │ Two names supported      │ One name only             │
│                    │ (aieng-curriculum.md     │ (whichever was hardcoded) │
│                    │ + curriculum.md)         │                           │
│ Repair flow        │ Broken symlinks caught   │ Broken symlinks fail      │
│                    │ by the `find` step       │ silently forever          │
│ Failure mode       │ Wrong file auto-loaded   │ Curriculum-loaded mode is │
│                    │ silently (rare)          │ off; user has to debug    │
│                    │                          │ why                       │
└────────────────────┴──────────────────────────┴───────────────────────────┘
```

The hardcoded path saves ~30 lines of wrapper body and ~500ms of I/O on first run. It costs every user who didn't read the docs and every user with a moved curriculum. For an optional feature where the right friction-to-help ratio matters, the resolver earns its keep.

### One-line anchors

- Two-step resolution: canonical priority list first, bounded `find` only as fallback.
- Branch on count (0/1/many) explicitly — don't pick the first result silently.
- `maxdepth 4` covers typical user-project layouts; excludes `node_modules` / `.git` / `.aipe/specs/`.
- Auto-install via symlink on N=1 — future runs skip the fallback.
- Broken symlinks at canonical paths fail `[ -e ]` correctly; the fallback exposes them for repair.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the three-step flow from memory: canonical paths → fallback find → branch on count. Label the candidate count branches and what each does.

### Level 2 — Explain it out loud
Explain curriculum resolution to a colleague who's used to Webpack's `resolve.extensions`. Under 90 seconds.

Checkpoints:
- Did you name the four canonical paths in priority order?
- Did you mention `maxdepth 4` and at least one exclusion?
- Did you name all three branch outcomes (0/1/many)?

### Level 3 — Apply it to a new scenario

A user has:
- `/Users/them/.config/aipe/global/aieng-curriculum.md` — broken symlink to a deleted file
- `/Users/them/Projects/loopd/docs/curriculum.md` — real file, 800 lines
- `/Users/them/Projects/aipe-fork/prompts/aieng-curriculum.md` — real file, 1200 lines

What does the resolver do? Walk through Step 1, Step 2, Step 3.

Open `commands/study.md` Step 2 and check the branch-on-count rules.

### Level 4 — Defend the decision you'd change

Pick the cache-the-resolution tradeoff. Answer:

"If the project grew to a user base where 30% of users hit N > 1 on every run, would you add a resolution cache? What would it cost?"

### Quick check — code reference test
Without opening files:
- How many canonical paths are checked in Step 1? → 4
- What's the maxdepth of the fallback `find`? → 4
- What three branches handle the candidate count? → 0 → codebase-driven; 1 → auto-symlink; many → prompt
