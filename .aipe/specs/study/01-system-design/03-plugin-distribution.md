# Plugin distribution (dual marketplace)

**Industry name(s):** Plugin marketplace, Multi-target package distribution, Polyglot manifest
**Type:** Industry standard

> One git repo backs two plugin marketplaces (Claude Code + Codex CLI) through two manifests in lockstep — no published binaries, no npm/pip, no CI; the marketplace pulls the repo at the version each manifest declares.

**See also:** → [01-template-source-of-truth](01-template-source-of-truth.md) · → [02-per-spec-type-contract](02-per-spec-type-contract.md)

---

## Why care

You've published a library and watched the version on npm drift from the version on JitPack drift from the version in the GitHub release notes — three "sources of truth" claiming different things, and a downstream consumer hitting whichever one their package manager defaults to. The everyday failure of multi-channel distribution is that the channels don't synchronise. The pattern this file describes is the opposite: one repo, two channels, two manifests bumped together, no published binary anywhere.

The pattern is *polyglot manifest distribution* — one canonical source backs multiple package ecosystems, each with its own manifest pointing at the same git ref. The shape shows up in `pyproject.toml` projects that also publish to conda, in npm packages that also ship to JSR, in Cargo crates that also ship to nixpkgs. The trick is to make the manifests two views of the same release rather than two independent releases. Here's how that works for aipe.

---

## How it works

One repo, two storefronts. The repo is on GitHub. The storefronts are Claude Code's plugin marketplace and Codex CLI's plugin marketplace. Each storefront has a manifest in the repo that tells the host how to find it; the host pulls the repo at the manifest's declared version and stages it locally.

### The Claude Code path

A user types `/plugin marketplace add rlynjb/aipe` in any Claude Code session. Claude Code reads `.claude-plugin/marketplace.json` from the repo (namespace `rlynjb-aipe`), finds the entry pointing at `rlynjb/aipe`, and lists it as installable.

```json
{
  "name": "rlynjb-aipe",
  "owner": { "name": "rlynjb" },
  "description": "Spec workflow plugin for AI-assisted development",
  "plugins": [
    {
      "name": "aipe",
      "source": { "source": "github", "repo": "rlynjb/aipe" },
      ...
    }
  ]
}
```

If you're coming from frontend, you're used to a package being identified by name and version in a registry — the registry holds the artifact, npm pulls it from the registry. Here it's different: there's no registry artifact. The manifest tells Claude Code "the source is `rlynjb/aipe` on GitHub," and Claude Code clones the repo at the version `.claude-plugin/plugin.json` declares.

The version pin lives at `.claude-plugin/plugin.json`:

```json
{ "name": "aipe", "version": "1.29.0", ... }
```

The practical consequence: a user who installs aipe today gets `commands/*.md` and `specs/*.md` exactly as they sit in the repo at the v1.29.0 tag. They can update with `/plugin update aipe@rlynjb-aipe`, which re-pulls at whatever version `plugin.json` declares on `main`.

### The Codex CLI path

A user runs `codex plugin marketplace add rlynjb/aipe` in the terminal. Codex reads `.codex-plugin/plugin.json` directly from the repo and auto-installs:

```json
{
  "name": "aipe",
  "version": "1.29.0",
  "skills": [
    "./skills/plan",
    "./skills/feature",
    ...
    "./skills/study"
  ],
  ...
}
```

Think of it like a Cargo workspace that also publishes individual crates — the workspace manifest enumerates each member crate. Codex's manifest enumerates each `skills/<type>/` directory as a separate skill. Claude Code doesn't need that enumeration because it discovers slash commands by scanning `commands/*.md` — a different convention with the same outcome.

The version pin lives at `.codex-plugin/plugin.json`. It must match `.claude-plugin/plugin.json` at every commit; if they drift, Claude Code and Codex users see different versions of "the same release."

### The lockstep release

A release is one git push that includes:

1. The template edit (`specs/<type>.md`).
2. The two wrapper mirrors (`commands/<type>.md` + `skills/<type>/SKILL.md`).
3. A version bump in BOTH manifests (`1.28.0 → 1.29.0` in both `plugin.json` files).
4. A descriptive commit message documenting what changed.

There are no tagged releases or release branches. `main` is always the latest published version. Both manifests on `main` declare the same `version` field at every commit. CI doesn't enforce this — the discipline is in the release flow's `git diff` review.

This is what people mean by "lockstep distribution" — the channels are different but the artifact is one, and the manifests are sibling pointers, not independent declarations.

### What's deliberately absent

There is no `dist/` directory. There is no published npm/pip/brew package. There is no GitHub Actions workflow. There is no separate `aipe-cli` binary (existed through v0.x, removed in v1.0.0 because the host agent in the user's session already does the work). There is no telemetry, no remote service, no auth.

The whole distribution shape is: one git repo with two manifests, two host agents that know how to pull a git repo at a manifest's version. Everything else is the user's host doing what it already does.

This is what people mean by "distribution as configuration" — the publishing model is two `.json` files in the repo, not a separate release pipeline.

The full picture is below.

---

## Plugin distribution — diagram

```
One repo, two marketplaces, lockstep version

┌─ Source ──────────────────────────────────────────────────────────────────┐
│                                                                           │
│   github.com/rlynjb/aipe (the repo)                                       │
│                                                                           │
│   ├── .claude-plugin/                                                     │
│   │     plugin.json         { "version": "1.29.0", "repository": ... }    │
│   │     marketplace.json    { "name": "rlynjb-aipe", "plugins": [...] }   │
│   │                                                                       │
│   ├── .codex-plugin/                                                      │
│   │     plugin.json         { "version": "1.29.0",                        │
│   │                           "skills": ["./skills/plan", ...] }          │
│   │                                                                       │
│   ├── commands/             (Claude Code wrappers)                        │
│   ├── skills/               (Codex skills)                                │
│   └── specs/                (canonical templates)                         │
└───────────────────────────────────────────┬───────────────────────────────┘
                                            │
            ┌───────────────────────────────┼──────────────────────────────┐
            │ Claude Code path              │ Codex CLI path               │
            ▼                               ▼                              │
┌─ User session ──────────────────┐  ┌─ User terminal ────────────────────┐ │
│  /plugin marketplace add        │  │  $ codex plugin marketplace add    │ │
│    rlynjb/aipe                  │  │    rlynjb/aipe                     │ │
│                                 │  │                                    │ │
│  /plugin install aipe@          │  │  (auto-installs, tracks in         │ │
│    rlynjb-aipe                  │  │   ~/.codex/config.toml)            │ │
└──────────┬──────────────────────┘  └────────────────────────┬───────────┘ │
           │ host clones repo at                              │             │
           │ plugin.json's "version"                          │             │
           ▼                                                  ▼             │
┌─ Plugin cache (host-managed) ──────────────────────────────────────────────┐
│                                                                            │
│   ${CLAUDE_PLUGIN_ROOT}/specs/<type>.md     ${CODEX_PLUGIN_ROOT}/...        │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## In this codebase

**Manifest files (the two pointers):**
- `.claude-plugin/plugin.json` — name, version (`1.29.0`), author, homepage, repository, license.
- `.claude-plugin/marketplace.json` — `rlynjb-aipe` namespace, GitHub source pointer, plugin entry.
- `.codex-plugin/plugin.json` — name, version (matches Claude side), `skills` array enumerating each `./skills/<type>/` directory.

**Version cross-references:** `spec-aipe.md` lines 252–270 ("Versioning and release flow") documents the lockstep requirement. The repo's `README.md` lines 14–38 documents the user-facing install flow for both hosts.

**What's NOT in the repo:**
- No `package.json`, no `pyproject.toml`, no `Cargo.toml` — the plugin is not published to npm/pip/cargo.
- No `dist/`, no `build/`, no compiled artifacts.
- No `.github/workflows/` — no CI.
- No tests directory — there's nothing to assert.

The repo layout is the published artifact. Editing `specs/feature.md` and pushing to `main` is the release.

---

## Elaborate

### Where this pattern comes from

Multi-target distribution is older than language package managers — Unix's `make install` shipped to multiple target directories from one Makefile. Polyglot manifests (one project, multiple ecosystem manifests) became common in the late 2010s with the rise of multi-language repos: Cargo workspaces alongside `pyproject.toml`, `package.json` alongside `Gemfile`. The plugin-marketplace pattern is newer — it borrows from VS Code Marketplace (2015) and JetBrains Plugin Repository, both of which evolved into "the manifest lives in the repo, the marketplace is a discovery layer" by 2020.

### The deeper principle

The publishing model can be as light as "git repo + N manifests." Heavy distribution pipelines (CI to build, registries to host, signing keys to manage) buy reproducibility, version pinning, and revocation. If you don't need those, you don't need them. The aipe model trades reproducibility (anyone can fork-and-modify trivially) and signing (no provenance check) for zero ops cost. That trade only works for projects where the artifact is human-readable markdown and the consumers are sophisticated agents that already handle git.

### Where this breaks down

The model breaks when (a) the artifact stops being human-readable markdown — e.g., if aipe ever ships compiled code, the lack of CI becomes a problem because there's no automated build; (b) when revocation matters — e.g., a security issue in `specs/feature.md` needs a fix users get without re-pulling, and the model has no push channel; (c) when consumers want signed releases — there's no provenance chain today. None of these have hit; if any does, the model needs a release pipeline grafted on.

### What to explore next

- [01-template-source-of-truth](01-template-source-of-truth.md) → the lockstep requirement that the two manifests pin the same version
- VS Code Marketplace publish flow — same "manifest-in-repo" shape, with mandatory signing
- Helm chart distribution (manifest-in-repo + `helm repo add`) — same pattern in the Kubernetes ecosystem

---

## Tradeoffs

```
┌──────────────────┬──────────────────────────┬─────────────────────────────┐
│ Cost dimension   │ Manifest-in-repo (today) │ Published binary + registry │
├──────────────────┼──────────────────────────┼─────────────────────────────┤
│ Release effort   │ git commit + push         │ tag + CI + publish + sign  │
│ Reproducibility  │ Anyone can fork-and-edit  │ Signed artifact = signed   │
│                  │ trivially                 │ provenance                 │
│ Revocation       │ None — must re-pull       │ Yank from registry         │
│ User install     │ /plugin marketplace add   │ Same UX with versioning    │
│   complexity     │ + /plugin install         │                            │
│ Vendor lock-in   │ Tied to host's git puller │ Tied to registry           │
│ Ops cost         │ Zero                      │ Registry hosting + CI hours│
│ Update channel   │ Pull-based (user opts in) │ Push-based (host triggers) │
│ Failure blast    │ Bad commit on main = next │ Bad release = users on bad │
│                  │ install gets it           │ version until yanked       │
└──────────────────┴──────────────────────────┴─────────────────────────────┘
```

### Sub-block 1 — what we gave up

We gave up signed provenance. Anyone can clone `rlynjb/aipe`, modify `specs/feature.md`, push to their fork, and tell users to `/plugin marketplace add their-fork/aipe`. The fork would appear in their marketplace identical to the upstream. There's no signing layer to detect this. For a markdown plugin where the worst case is "your specs come out shaped weirdly," that's acceptable; for a plugin that touched credentials or executed code, it would be a serious gap.

We gave up revocation. If a critical bug ships in v1.29.0, the fix is v1.29.1 on `main` and a `/plugin update aipe` from each user. There's no "yank v1.29.0 from the marketplace" — anyone who installed it has it until they update. With markdown templates, the consequence is "your spec is shaped wrong"; with a binary plugin, it could be "your install runs malware until you update."

We gave up CI assurance. The repo has no GitHub Actions, no test runner, no build validation. A typo in `commands/study.md` ships to every user on the next pull. The mitigation is the discipline of the release flow (review the diff, mirror the wrappers, bump both manifests) — but it's pure discipline, not enforcement.

### Sub-block 2 — what the alternative would have cost

If we had published as an npm package + signed releases, every change would cost: a `git tag`, a CI run (5–10 minutes), a `npm publish` (or equivalent), and a marketplace registration update. ~15 minutes of latency per release, plus the ongoing cost of maintaining a CI workflow, signing keys, and a publish script. For a project that ships 1–3 releases per month and has one maintainer, that's 30–45 minutes of pure overhead monthly, indefinitely. The current model's overhead is 5 minutes of `git commit && git push`.

We'd gain signed provenance and revocation. Whether that's worth the ongoing cost depends on the failure mode. With markdown-only artifacts, the worst case is "user's spec is shaped wrong" — recoverable, embarrassing, not dangerous. If aipe ever ships a binary helper, the calculus flips and the heavier model earns its place.

### Sub-block 3 — the breakpoint

Fine until aipe ships an executable. The moment any file in the repo is meant to be *run* (not just *read*) by the host, the lack of signing becomes a real security gap — an attacker who can MitM the GitHub clone can replace the executable with malware that runs in the user's editor session. As long as the artifacts are markdown read by the host agent (which sanitises its own execution context), the gap is mostly cosmetic. The breakpoint is "any executable artifact"; until then, the no-CI / no-signing model is the right trade.

A secondary breakpoint: when the user base exceeds the point where individual update notifications can't be coordinated. At ~10k installs, "users update by re-running `/plugin update`" stops working — a security issue in v1.29.0 would take months to drain. At that scale, a push-based update channel (or at minimum, a versioned "min-required version" gate inside the wrappers) earns its place.

---

## Tech reference (industry pairing)

### Plugin marketplace (Claude Code side)

- **Codebase uses:** `.claude-plugin/marketplace.json` registers the `rlynjb-aipe` namespace pointing at `rlynjb/aipe` on GitHub; `.claude-plugin/plugin.json` pins the version.
- **Why it's here:** the discovery + install path. Users `/plugin marketplace add` then `/plugin install`; Claude Code clones at the manifest's version.
- **Leading today:** Claude Code plugin marketplace — `adoption-leading` for agent-host plugins in 2026.
- **Why it leads:** native marketplace UI in the slash-command picker; per-session version pinning; no separate package manager required.
- **Runner-up:** Cursor's MCP server registry — `innovation-leading` for agent-host plugin discovery via Model Context Protocol; broader cross-host story still maturing.

### Plugin marketplace (Codex CLI side)

- **Codebase uses:** `.codex-plugin/plugin.json` with `skills` array enumerating each `skills/<type>/` directory.
- **Why it's here:** Codex's plugin discovery convention. The host reads the manifest and stages each named skill.
- **Leading today:** Codex CLI plugin marketplace — `innovation-leading` for terminal-native agent plugins, 2026.
- **Why it leads:** TOML-tracked config in `~/.codex/config.toml`, fits CLI / git-driven workflows, runs identical across macOS / Linux.
- **Runner-up:** Aider's `--config` file + `--read` flags — `adoption-leading` for terminal AI tools; no plugin layer but a wider installed base.

### Git as the distribution channel

- **Codebase uses:** GitHub (`rlynjb/aipe`) is the canonical source; both manifests reference it.
- **Why it's here:** git provides version pinning (by tag or commit), atomic updates, and a free CDN via GitHub Pages / raw URLs. No registry needed.
- **Leading today:** git + GitHub — `adoption-leading` for "manifest-in-repo" distribution, 2026.
- **Why it leads:** every developer already has a GitHub auth flow; clone is a primitive operation in every install context.
- **Runner-up:** OCI artifact registries (ghcr.io, Artifact Hub) — `innovation-leading` for signed-by-default plugin distribution; gaining ground in the Helm and OPA Gatekeeper worlds.

---

## Summary

aipe ships through two plugin marketplaces — Claude Code's and Codex CLI's — backed by one git repo with two manifests (`.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`) pinned to the same `version` field at every commit. The Claude side adds a `marketplace.json` for namespace discovery; the Codex side enumerates skills in its `plugin.json`. No CI, no published binary, no `dist/`, no separate release process — `git push` to `main` is the release. The constraint that drove this: maintain one source of truth across two host agents with zero ops overhead. The cost being paid: no signed provenance, no revocation, no automated test gate; release discipline is pure human-review.

- One repo backs two marketplaces; one version number bumped in lockstep across both manifests.
- The user-facing UX is symmetric: `/plugin marketplace add` (Claude) or `codex plugin marketplace add` (Codex).
- There is no `dist/`, no CI, no test runner — the repo IS the published artifact.
- A bad commit on `main` reaches every user on the next pull; the mitigation is pre-merge review, not CI.
- Lives in step 1 (Data model) of the system-design checklist — distribution is the data model for "where does the plugin live?"
- The model breaks the moment any artifact becomes executable rather than human-readable.

---

## Interview defense

### What an interviewer is really asking

The dodge on "why no CI?" is to call it laziness. The senior answer is to name what CI buys (signed provenance, automated test gates, build reproducibility) and to argue that for markdown-only artifacts read by a sophisticated host agent, those benefits don't earn their ongoing cost. The architect-level answer names the breakpoint (executable artifacts) and the migration plan.

### Likely questions

**Q [mid]:** How does a user install aipe? Walk through the Claude Code path.

**A:** They type `/plugin marketplace add rlynjb/aipe` in any Claude Code session. Claude Code reads `.claude-plugin/marketplace.json` from the repo at `rlynjb/aipe`, finds the `aipe` plugin entry, and lists it in their marketplace. They then type `/plugin install aipe@rlynjb-aipe`. Claude Code clones the repo at the version `.claude-plugin/plugin.json` declares (currently `1.29.0`), stages it under its plugin cache, and `${CLAUDE_PLUGIN_ROOT}` points at that cache for the session.

```
user types                 host action
──────────                 ───────────
/plugin marketplace add  ──▶  read marketplace.json from rlynjb/aipe
  rlynjb/aipe                  → list rlynjb-aipe namespace

/plugin install          ──▶  clone repo at plugin.json's "version"
  aipe@rlynjb-aipe             → stage under plugin cache
                               → resolve ${CLAUDE_PLUGIN_ROOT}
```

**Q [senior]:** Why two manifests instead of one shared manifest format?

**A:** The two host agents predate any cross-host plugin spec. Claude Code's marketplace expects a specific JSON shape (`marketplace.json` + `plugin.json`); Codex's expects a different shape (`plugin.json` with a `skills` array). There's no shared standard between them. We could have built one shared file with both host schemas merged, but that bets on a standard that doesn't exist — and it'd grow whenever either host added a field. Today both manifests are tiny (~10 lines each); maintaining both costs less than maintaining a hybrid plus a translator. The breakpoint changes if a cross-host plugin standard (like a future MCP plugin format) ships and both hosts adopt it; at that point, the two manifests collapse into one.

```
Today (2 manifests)              Hypothetical shared format
──────────────────              ──────────────────────────
.claude-plugin/                  .plugin/
  plugin.json                      manifest.json
  marketplace.json                   ← carries both schemas
.codex-plugin/                          via a "hosts" sub-object
  plugin.json
                                 Wins: 1 file, 1 version bump
Wins: each host's native shape   Loses: translator between
       carried verbatim                  the merged schema and
Loses: 2 files, 2 version              what each host expects
       bumps                            (one more layer)
```

**Q [arch]:** What happens to the model if aipe grows to 10k+ installs?

**A:** Two pressures emerge. First, a bug-fix's update latency becomes a real problem — under pull-based updates, users find out about v1.29.1 when they next type `/plugin update`, which for some users is weeks. At 10k installs that's thousands of users on the bad version. Second, the lack of signing becomes recruitable as an attack vector — at small scale, MitM-ing a GitHub clone has no payoff; at large scale, it does. The mitigation is to add (a) a "min-required version" gate inside the wrapper (every command checks the running plugin version against a known-bad list embedded in `specs/`), and (b) a push channel via the host's notification API (Claude Code's session-start hook can warn on outdated plugin versions). Adding signed releases is the third step, costing the most ops and gating the largest attack surface.

```
At < 1k installs           At ~10k installs (breaks first)
─────────────────          ─────────────────────────────────
Pull updates fine           Bug-fix latency: weeks
No signing fine             Signing gap: real attack surface
                            ─ Layer: distribution model ─
                            (replace with signed releases +
                             session-start version gate)
                            ─ Stays fine: spec generation,
                                            wrapper mirror,
                                            single source of truth
```

### The question candidates always dodge

**Q:** Why didn't you publish to npm — every install would `npm install -g aipe` and get versioned, signed, registry-hosted releases.

**A:** Two reasons the npm path costs more than it pays:

```
┌────────────────────┬──────────────────────────┬────────────────────────────┐
│ Dimension          │ Manifest-in-repo (today) │ npm package                │
├────────────────────┼──────────────────────────┼────────────────────────────┤
│ Ops cost / release │ git commit + push        │ tag + CI + npm publish +   │
│                    │ (~5 min)                 │ both marketplaces still    │
│                    │                          │ have to register the pkg   │
│                    │                          │ (~20 min)                  │
│ User install path  │ Already inside their     │ npm install -g aipe +      │
│                    │ host agent — no extra    │ configure host to find the │
│                    │ tools required           │ npm install location +     │
│                    │                          │ marketplace registration   │
│                    │                          │ pointing at the npm pkg    │
│ Versioning         │ One version pin in       │ npm version (semver) +     │
│                    │ each manifest, bumped    │ both manifests still       │
│                    │ in lockstep              │ point at the same npm vers │
│ Signing            │ None today               │ npm signs sigstore by      │
│                    │                          │ default since 2024         │
│ Failure blast      │ Bad commit reaches users │ Bad publish reaches users  │
│                    │ on next pull             │ on next install            │
└────────────────────┴──────────────────────────┴────────────────────────────┘
```

The npm path buys signing (genuinely valuable) and costs ongoing ops (15 minutes of overhead per release indefinitely). For markdown-only artifacts, the signing value is low; for binary artifacts, it'd be high. We took the trade that fits today's scope and named the breakpoint (executable artifacts) where the trade flips.

### One-line anchors

- One repo, two manifests, lockstep version — `git push` to `main` is the release.
- Both host marketplaces pull the repo at `plugin.json`'s declared version; no published artifact.
- The model trades signing + revocation for zero ops cost.
- The breakpoint is "any executable artifact" — at that point, add CI and signed releases.
- 10k installs is the scale where pull-based updates start to feel slow.

---

## Validate your understanding

### Level 1 — Reconstruct the diagram
Draw the source → two-marketplaces → plugin-cache flow from memory. Label the version-pin location (both manifests).

### Level 2 — Explain it out loud
Explain aipe's distribution model to a colleague who's used to publishing npm packages. No notes, under 90 seconds.

Checkpoints:
- Did you name "no CI, no published binary"?
- Did you name the lockstep version bump across both manifests?
- Did you name the user-install command for at least one host?

### Level 3 — Apply it to a new scenario

A bug lands in v1.29.0's `specs/feature.md` — the spec output omits the "Test plan" section. You ship v1.29.1 with the fix. What's the literal release sequence? List every file you edit, and what command pushes it.

Check against `spec-aipe.md` lines 252–270 (Versioning and release flow).

### Level 4 — Defend the decision you'd change

"If you knew aipe would have 50k installs and one full-time maintainer in 18 months, would you start adopting CI + signed releases now, or wait until the breakpoint hits?"

Reference:
- Point to current `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` to support what exists.
- Point to what would have to be added (CI workflow, signing keys, push-update channel).

### Quick check — code reference test
Without opening files:
- What file declares the version on the Claude Code side? → `.claude-plugin/plugin.json`
- What file enumerates Codex's skills? → `.codex-plugin/plugin.json` (the `skills` array)
- What command updates aipe in a Claude Code session? → `/plugin update aipe@rlynjb-aipe`
