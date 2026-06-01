# Study — Security (threat surface, applied)
## the `/aipe:study-security` command

A study-family generator that audits the **current repo** for security:
the trust boundaries, who's allowed to do what, where untrusted input is
trusted, what's exposed, and what the dependencies drag in. It produces a
per-concept guide grounded in real files — where the code is safe, where
it isn't, and the specific fix.

Topic generator like the rest of the family. Reads `format.md` (structure),
`teacher.md` (teacher posture), `me.md` (reader), the codebase. Inherits
the per-concept-file template, the create/update detection, the single
confirmation gate, and the run/report mechanics from the family — see
`study-software-design.md` for those; they are identical here. This file
defines only the topic, the concepts, the partition, and the anchoring.

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
  study-system-design-dsa  architecture & scale — NOT threat modeling.
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
THE TOPIC — concepts (one file each, full format.md template)
═════════════════════════════════════════════════

The "Implementation in codebase" block carries the audit: real files,
the trust assumption, whether it holds, the fix.

```
  1. trust-boundaries-and-attack-surface
       map every place untrusted input crosses into trusted code
       (request bodies, query params, headers, uploaded files, LLM
       output, third-party responses). The zoom-out for the guide.
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
       doesn't / N/A, location, severity, one-line fix. The capstone.
```

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

```
  .aipe/study-security/
    README.md   through-line (trace the trust axis) + map
    01-trust-boundaries-and-attack-surface.md
    02-authentication-and-authorization.md
    03-input-validation-and-injection.md
    04-secrets-and-configuration.md
    05-data-exposure-and-privacy.md
    06-dependencies-and-supply-chain.md
    07-llm-and-agent-security.md
    08-security-red-flags-audit.md
```

Create/update detection, the single confirmation gate, the audit pass, the
run order, and the summary report are the family pattern — identical to
`study-software-design.md`. Per-repo. Code-level findings only. Original
expression. Inherit structure from `format.md`, voice from `teacher.md`.

To run inside `/aipe:study`: add the table row + run-order entry in
`study.md` (teacher-posture bucket). Standalone until then.
