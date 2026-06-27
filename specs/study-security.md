# Study — Security (threat surface, applied)
## the `/aipe:study-security` command

A study-family generator that audits the **current repo** for security:
the trust boundaries, who's allowed to do what, where untrusted input is
trusted, what's exposed, and what the dependencies drag in. It produces a
per-concept guide grounded in real files — where the code is safe, where
it isn't, and the specific fix.

Topic generator like the rest of the family. Reads `format.md` (structure),
`teacher.md` (teacher posture), `me.md` (reader + AUDIT-STYLE GENERATORS),
the codebase. **This is an audit-style generator** — it produces the
two-pass output (`audit.md` + discovered-pattern files) defined in
`me.md` → AUDIT-STYLE GENERATORS. Inherits the per-concept-file template,
the create/update detection, the single confirmation gate, and the run/
report mechanics from the family — see `study-software-design.md` for
those; they are identical here. This file defines only the topic, the
lens inventory, the partition, and the anchoring.

```
  /aipe:study-security      → create or update
  output: .aipe/study-security/
```

═════════════════════════════════════════════════
WHERE THIS SITS — partition (no overlap)
═════════════════════════════════════════════════

```
  study-security        the TRUST axis as a discipline: what can     ← here
                        each side see, reach, or tamper with?
  study-system-design  architecture & scale — NOT threat modeling.
  study-software-design    complexity & interfaces — NOT trust.
```

  → This is the `format.md` structure-pass **trust axis** made into a
    full audit. The through-line: every input is hostile until proven
    otherwise, and every boundary either enforces a trust decision or
    leaks one.
  → A finding about *how data is structured* belongs to data-modeling;
    a finding about *who may read/write it and how that's enforced*
    belongs here.

═════════════════════════════════════════════════
PERSONA
═════════════════════════════════════════════════

`teacher.md`, teacher posture — same staff engineer, security-literate
(every senior engineer is). Inherit the banned list and verdict-first /
rank-what-matters trait. Reader calibration from `me.md`. Do not restate
the persona or the concept-file template; inherit both.

═════════════════════════════════════════════════
THE THROUGH-LINE
═════════════════════════════════════════════════

```
  the only question:  what can an attacker reach, and what happens
                      when they do?

  trace the trust axis across every boundary ───────────────────
     where does untrusted input enter?      (the attack surface)
     who is allowed past this boundary?      (authn / authz)
     what's hidden, what's exposed?          (secrets / data)
     what do my dependencies let in?         (supply chain)
```

Every finding ties to this: which boundary, which trust assumption, what
breaks if it's wrong.

═════════════════════════════════════════════════
THE TOPIC — audit-style two-pass output
═════════════════════════════════════════════════

Per `me.md` → AUDIT-STYLE GENERATORS:

  → Pass 1 — `audit.md` walks the lens inventory below.
  → Pass 2 — discovered-pattern files name the security-shaped
    mechanisms the repo actually exercises (e.g. a specific
    auth boundary, a specific sanitization seam, an agent
    tool-scope decision worth a deep walk).

  → THE LENS INVENTORY (for `audit.md`)

  Walk the codebase against this ordered 8-lens inventory. Each lens
  becomes one `##` section in `audit.md`. For each lens: name what the
  codebase actually does (with `file:line` grounding) or emit `not yet
  exercised` honestly. The lens's "How it works" content (the codebase
  walk: real files, the trust assumption, whether it holds, the fix)
  belongs in `audit.md`. When a finding is significant enough to have
  a dedicated pattern file in Pass 2, cross-link to it.

```
  1. trust-boundaries-and-attack-surface
       map every place untrusted input crosses into trusted code
       (request bodies, query params, headers, uploaded files, LLM
       output, third-party responses). The zoom-out for the audit.
       red flag: an input treated as trusted because it "comes from
       our own frontend."

  2. authentication-and-authorization
       who-are-you (sessions, tokens, expiry) vs what-can-you-do
       (per-resource authz checks). The classic gap: authn present,
       authz assumed.
       red flag: an endpoint that checks logged-in but not allowed.

  3. input-validation-and-injection
       SQL / command / path / SSRF / XSS / prompt injection. Where
       input reaches a sink (query, shell, fs, DOM, LLM) unsanitized.
       red flag: string-built query or prompt with user input in it.

  4. secrets-and-configuration
       keys, tokens, connection strings — where they live, what's in
       the repo/history, what's in client bundles, env hygiene.
       red flag: a secret in source, in a client bundle, or in logs.

  5. data-exposure-and-privacy
       over-fetching, PII in logs/errors, verbose error messages,
       missing field-level access control, leaky responses.
       red flag: an error or API response that returns more than the
       caller is entitled to.

  6. dependencies-and-supply-chain
       known-vuln packages, lockfile presence, update posture,
       postinstall/script risk, transitive bloat.
       red flag: no lockfile, or known CVEs unpatched.

  7. llm-and-agent-security   (AI repos)
       prompt injection via retrieved/user content, tool/permission
       scope (an agent with broader access than its task needs),
       output handling (treating model output as trusted code/SQL),
       data exfiltration through tool calls. Ties to your agent work.
       red flag: an agent whose tool set exceeds its task; model
       output flowing into a sink without a gate.
       (Honest "not exercised" if the repo has no LLM/agent code.)

  8. security-red-flags-audit
       consolidated checklist, marked against this repo: fires /
       doesn't / N/A, location, severity, one-line fix. The capstone
       lens.
```

  → WHAT EARNS A PASS 2 PATTERN FILE IN THIS TOPIC

  The general rules in `me.md` apply: the pattern has a name, passes
  the load-bearing test, passes the recognition test. For security
  specifically, the load-bearing test asks: *"if I stripped this
  control out, which trust assumption would now be unenforced — and
  what specifically could an attacker reach?"* Real answers name a
  concrete capability defended (cross-tenant row isolation, token
  exchange that binds identity across a service hop, output gating
  that prevents model-emitted SQL). A single CVE or single missing
  validation is a lens finding; a recurring control the repo
  implements deliberately is a pattern.

  Vague answers ("things would be less secure") do not earn a file.

═════════════════════════════════════════════════
ANCHORING + HONEST ASSESSMENT
═════════════════════════════════════════════════

Same rules as `study-software-design.md`: every claim cites a real path;
rank the single worst exposure per concept before the list; be blunt then
constructive; never invent a vulnerability to seem thorough, never soften a
real one. State plainly when the repo is too small to exercise a concept
(e.g. no auth layer yet) and give the buildable target.

One security-specific rule: **do not write exploit code.** Name the
weakness, the trust assumption it breaks, and the fix — never a working
attack. Defensive findings, not a how-to.

═════════════════════════════════════════════════
OUTPUT + MECHANICS
═════════════════════════════════════════════════

The two-pass file layout is defined in `me.md` → AUDIT-STYLE
GENERATORS → File layout. For this topic the output folder is
`.aipe/study-security/`. All files flat at the root, no nested
sub-directories.

Files produced:

  → `README.md` — through-line (trace the trust axis) + map + reading
    order + cross-links.
  → `audit.md` — Pass 1, the 8-lens audit defined above. The capstone
    lens (`security-red-flags-audit`) consolidates the checklist.
  → `01-` through `0N-` — Pass 2, discovered-pattern files, each named
    after a security control or boundary the repo actually exercises.

Create/update detection, the single confirmation gate, the audit pass,
the run order, and the summary report are the family pattern — identical
to `study-software-design.md` (which now follows the two-pass shape).
On UPDATE, follow `me.md` → AUDIT-STYLE GENERATORS → On UPDATE: regenerate
`audit.md` against current evidence, add/update/remove pattern files
against current controls. Per-repo. Code-level findings only. Original
expression. Inherit structure from `format.md`, voice from `teacher.md`.

To run inside `/aipe:study`: add the table row + run-order entry in
`study.md` (teacher-posture bucket). Standalone until then.
