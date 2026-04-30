# Performance Spec

Use this when something is too slow or too heavy. A performance spec needs a baseline measurement, a clear target, and constraints on acceptable solutions — otherwise Claude will introduce complexity that trades one problem for another.


## Performance spec format


```
## What is slow / heavy
[specific screen, route, query, or operation]

## Baseline
[measured current behaviour — load time, bundle size,
 API calls, re-renders, memory usage]

## Target
[specific measurable goal — "under 200ms", "1 API call",
 "no re-render on scroll"]

## Context
[why it's slow — too many fetches, large payload,
 no memoisation, blocking render, etc.]

## Acceptable solutions
  - [caching, debounce, lazy load, pagination, etc.]

## Not acceptable
  - No new dependencies
  - No breaking API changes
  - Do not change data model

## Done when
[target metric is met, measured the same way as baseline]
```


> 💾 Save as → .aipe/specs/performance/[name].md
