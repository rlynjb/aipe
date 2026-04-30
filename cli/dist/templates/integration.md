# Integration Spec

Use this when connecting to a new external service or API — Notion, a new LLM provider, a webhook, or any third-party dependency. Needs auth flow, data contract, error handling, and rate limit behaviour defined upfront.


## Integration spec format


```
## Service being integrated
[name and purpose of the external service]

## What it replaces or extends
[existing feature this connects to, or "new capability"]

## Auth
[API key / OAuth / token — where it's stored,
 how it's passed, how it's rotated]

## Data contract
Request shape:  [fields, types, required vs optional]
Response shape: [fields, types, what we actually use]

## Error handling
  - Rate limit (429): [retry strategy]
  - Auth failure (401): [behaviour]
  - Service down (5xx): [fallback]
  - Malformed response: [behaviour]

## Rate limits
[requests per second/minute, payload size limits]

## Where it lives in the codebase
[new file location, existing file to modify]

## Constraints
  - Credentials never exposed to client
  - All calls go through [server route / edge function]
  - Must not break existing [related feature]

## Done when
[happy path works, rate limit is handled,
 auth failure shows correct UI state]
```


> 💾 Save as → .aipe/specs/integrations/[service-name].md
