# Section 02 — DSA (operations)

Algorithm-shaped operations in the aipe codebase. Most are short — file resolution, branch detection, structural diff. None require heavy data structures because aipe is markdown-only.

---

## Index

- [`01-curriculum-resolution`](01-curriculum-resolution.md) — Check 4 canonical paths; fallback `find` over `$HOME` (maxdepth 4); branch on candidate count (0/1/many).
- [`02-existing-guide-detect`](02-existing-guide-detect.md) — Step 4's CREATE-vs-UPDATE predicate; multi-signal check for `/aipe:study`, single-file check elsewhere.
- [`03-template-diff`](03-template-diff.md) — Diff B's section-list walk against the canonical template; ~30 structural-gap flags + repair recipes.

---

## Complexity cheat sheet

| Operation | Time | Space | Holds at 10×? |
|---|---|---|---|
| Curriculum resolution (canonical-only) | O(1) — 4 stats | O(1) | yes (4 stats no matter what) |
| Curriculum resolution (fallback `find`) | O(N) where N = $HOME files within maxdepth 4 | O(K) for K candidates | yes up to ~50k files; slow past that |
| Existing-guide detection (single-file) | O(1) — 1 stat | O(1) | yes |
| Existing-guide detection (multi-file `/aipe:study`) | O(1) — 5 stats | O(1) | yes (grows linearly in section count, but section count is bounded) |
| Template structural diff (Diff B) per file | O(S × R) — sections × rules | O(F) — flags collected | yes — bounded by ~30 flags per file |

### Operations that don't hold at 10×

None of the operations are at risk past 10× scale. The closest concern is **Curriculum resolution fallback `find`** — if a user's home directory grows past ~50k files within maxdepth 4, the find walks slowly. Fix: cache the resolved location after first run (skip the fallback forever once a canonical symlink is installed). Effort: `1–4hr` if it becomes a real complaint; today the fallback runs once per user per repo, so the breakpoint is unlikely.

The **Template diff** scales linearly with template-version flag count. At ~50 flags per template (we're at ~30 today), the wrapper exceeds ~200 KB and reviewers can't reliably eyeball the diff. Fix: extract flag taxonomy into a structured file (`specs/<type>-update-flags.yaml`). Effort: `1–2 days`.

Neither operation is O(n²) anywhere; aipe's algorithmic surface is genuinely small.

---

## Reading order

1. [`01-curriculum-resolution`](01-curriculum-resolution.md) — canonical example of two-phase resolution.
2. [`02-existing-guide-detect`](02-existing-guide-detect.md) — the CREATE-vs-UPDATE branch predicate.
3. [`03-template-diff`](03-template-diff.md) — Diff B's structural validation walk.
